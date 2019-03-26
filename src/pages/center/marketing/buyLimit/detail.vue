<template>
  <div class="buy-limit-detail">
    <h2 class="big-title">编辑活动</h2>
    <div class="wrap">
      <div class="form-wrap">
        <div class="form-name">活动时间:</div>
        <el-date-picker class="timepicker-control" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择开始时间" v-model="detailData.startTime"></el-date-picker>
        <el-date-picker class="timepicker-control" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择结束时间" v-model="detailData.endTime"></el-date-picker>
      </div>
      <div class="form-wrap">
        <div class="form-name">活动商品:</div>
        <a class="select-goods" @click="showGoodsModal=true">+ 选择商品</a>
      </div>
      <div class="form-wrap">
        <div class="form-name">货币:</div>
        <select class="form-control" v-model="detailData.currency" :class="{'unset-select':!detailData.currency}">
          <option :value="0">请选择</option>
          <option v-for="item in currencyList" :key="item.code" :value="item.code">{{item.mixName}}</option>
        </select>
      </div>
      <div class="form-wrap">
        <div class="form-name">商品信息:</div>
      </div>
      <div class="goods-list">
        <table>
          <thead>
            <tr>
              <th class="w300">商品名称</th>
              <th class="w100" v-show="!userConfig.singleChannel">渠道</th>
              <th class="w200">SKU/原价</th>
              <th>库存</th>
              <th>抢购价</th>
              <th>限购</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in detailData.activityItems" :key="item.itemId">
              <td>
                <img class="itemImg" :src="item.itemImg" />
                <span class="itemTitle">{{item.itemTitle}}</span>
              </td>
              <td v-show="!userConfig.singleChannel">{{item.channelName}}</td>
              <td>{{item.spec}}</td>
              <td>{{item.stock}}</td>
              <td>
                <input type="text" class="form-control" v-model="item.flashSalePrice">
              </td>
              <td>
                <input type="text" class="form-control" v-model="item.num">
              </td>
              <td>
                <a class="link" v-show="itemIndex != 0" @click="moveItem(itemIndex)">上移</a>
                <a class="link" v-show="itemIndex != detailData.activityItems.length-1" @click="moveItem(itemIndex,1)">下移</a>
                <a class="link" @click="deleteItem(item)">删除</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-wrap">
        <div class="form-name form-disable">禁用优惠券:</div>
        <el-radio name="disabled" v-model="detailData.isDisableCoupon" :label="1">是</el-radio>
        <el-radio name="disabled" v-model="detailData.isDisableCoupon" :label="0">否</el-radio>
      </div>
      <div class="btn-main" @click="save()">保存</div>
    </div>
    <selectActGoods v-if="showGoodsModal" v-on:dialogGoods="dialogGoods" v-on:dialogGoodsCancel="dialogGoodsCancel"></selectActGoods>
  </div>
</template>

<script>
import selectActGoods from '@/components/selectActGoods/index.vue';
export default {
  components: { selectActGoods },
  data() {
    return {
      showGoodsModal: false,
      isDisabled: 1,
      currencyList:[],
      detailData: {
        startTime:'',
        endTime:'',
        currency:0,
        isDisableCoupon: 1,
        activityItems:[]
      }
    }
  },
  created() {
    let id = this.$route.params.id;
    this.getCurrency();
    if(id){
      this.api.activity.getBuyLimit({activityId:id}).then((res) => {
        this.detailData = res.data;
      });
    }
  },
  methods: {
    getCurrency() {
      this.api.common.currency({}).then((res) => {
        this.currencyList = res.data;
        this.currencyList.forEach(item => {
          item.mixName = item.symbol + ' ' + item.name;
        });
      });
    },
    dialogGoods(res) {
      this.console(res.goodsList);
      if(res.goodsList && res.goodsList.length>0) {
        res.goodsList.forEach(goods => {
          let itemGoods = {
            itemId: goods.itemId,
            itemTitle: goods.itemName,
            itemImg: goods.mainImg,
            channelName: goods.selectedChannelName,
            skuIds: [],
            spec: '',
            stock: 0,
            channelType: goods.selectedChannel,
            flashSalePrice: '',
            num: ''
          };
          goods.selectedSku.forEach(sku => {
            itemGoods.stock += sku.stockNum;
            itemGoods.skuIds.push(sku.skuId);
            itemGoods.spec += sku.skuValue+'/'+sku.price+'、';
          });
          itemGoods.spec = itemGoods.spec.substring(itemGoods.spec.length-1, 1);
          this.detailData.activityItems.push(itemGoods);
        });
      }
      this.showGoodsModal = false;
    },
    dialogGoodsCancel() {
      this.showGoodsModal = false;
    },
    save(){
      let api = 'addBuyLimit';
      if(this.detailData.activityId){
        api = 'updateBuyLimit';
      }
      this.detailData.participateItemNum = JSON.stringify(this.detailData.activityItems);
      this.api.activity[api](this.detailData).then((res) => {
        this.$message.success({message: res.message, showClose: true});
        this.$router.push({name: '限时抢购'});
      });
    },
    deleteItem(item){
      this.detailData.activityItems.splice(item.index - 1, 1);
    },
    moveItem(index,down){
      let current = this.copy(this.detailData.activityItems[index]);
      let pos = index + (down ? 1 : -1);
      let bot = this.copy(this.detailData.activityItems[pos]);
      this.$set(this.detailData.activityItems, index, bot);
      this.$set(this.detailData.activityItems, pos, current);
    }
  }
}
</script>

<style lang="scss">
  .buy-limit-detail{
    .big-title{
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 10px;
    }
    .wrap{
      background: #fff;
      padding: 10px 20px;
      box-shadow: 0 2px 3px #E5E5E5;
      border-radius: 4px;
      .form-wrap{
        margin-bottom: 15px;
        .form-name{
          vertical-align: top;
          line-height: 30px;
          width: 60px;
        }
        .form-disable{
          width: 80px;
        }
        .timepicker-control{
          width: 160px;
          margin-right: 15px;
        }
        .select-goods{
          display: inline-block;
          vertical-align: top;
          width: 110px;
          height: 30px;
          border: 1px dashed #F06941;
          color: #F06941;
          text-align: center;
          line-height: 30px;
          margin-right: 10px;
          border-radius: 15px;
          cursor: pointer;
        }
        .el-radio{
          line-height: 30px;
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
      .goods-list{
        margin-bottom: 15px;
        table {
          width: 1000px;
          border-collapse: collapse;
          border-spacing: 0;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 0 0 1px $border-color;
          thead {
            background: #EBEFFC;
          }
          tr {
            th{
              white-space: nowrap;
            }
            th, td {
              padding: 10px;
              text-align: left;
              line-height: 20px;
              .link{
                margin-right: 10px;
              }
              .itemImg{
                display: inline-block;
                vertical-align: top;
                max-height: 54px;
                max-width: 54px;
              }
              .itemTitle{
                display: inline-block;
                vertical-align: top;
                width: 210px;
                margin-left: 10px;
              }
            }
            .w300{
              width: 300px;
            }
            .w100{
              width: 100px;
            }
            .w200{
              width: 200px;
            }
            .form-control{
              width: 60px;
            }
          }
        }
      }
    }
    .el-dialog__body{
      padding: 0;
    }
  }
</style>