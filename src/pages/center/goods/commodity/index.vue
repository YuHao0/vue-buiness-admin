<template>
  <div class="center-commodity">
    <div class="tab-bar">
      <div class="tab-item" :class="{'active':listParams.status===0}" @click="changeStatus(0)">等待审核</div>
      <div class="tab-item" :class="{'active':listParams.status===1}" @click="changeStatus(1)">已上架</div>
      <div class="tab-item" :class="{'active':listParams.status===2}" @click="changeStatus(2)">已下架</div>
    </div>
    <div class="type-wrap" v-show="firstCateList.length>0">
      <div class="type-content-wrap">
        <div class="type-title">一级类目：</div>
        <div class="type-content border-bottom">
          <div class="type-item" v-for="(item, index) in firstCateList" :key="index+'first'" :class="{'active':selectedCate.first===item.id}">
            <a href="javascript:;" class="ellipsis" :class="{'pr40':item.count>99}" @click="selectCate(1, item)">
              {{item.name}}
              <span class="item-count" v-show="item.count<=99">({{item.count}})</span>
              <span class="item-count" v-show="item.count>99">(99+)</span>
            </a>
          </div>
        </div>
      </div>
      <div class="type-content-wrap" v-show="secondCateList.length>0">
        <div class="type-title">二级类目：</div>
        <div class="type-content">
          <div class="type-item" v-for="(item, index) in secondCateList" :key="index+'second'" :class="{'active':selectedCate.second===item.id}">
            <a href="javascript:;" class="ellipsis" :class="{'pr40':item.count>99}" @click="selectCate(2, item)">
              {{item.name}}
              <span class="item-count" v-show="item.count<=99">({{item.count}})</span>
              <span class="item-count" v-show="item.count>99">(99+)</span>
            </a>
          </div>
        </div>
      </div>
      <div class="type-content-wrap" v-show="thirdCateList.length>0">
        <div class="type-title">三级类目：</div>
        <div class="type-content">
          <div class="type-item" v-for="(item, index) in thirdCateList" :key="index+'third'" :class="{'active':selectedCate.third===item.id}">
            <a href="javascript:;" class="ellipsis" :class="{'pr40':item.count>99}" @click="selectCate(3, item)">
              {{item.name}}
              <span class="item-count" v-show="item.count<=99">({{item.count}})</span>
              <span class="item-count" v-show="item.count>99">(99+)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="list-wrap">
      <div class="search-bar">
        <div class="search-bar-title">商品属性：</div>
        <button class="btn-fill-main" @click="openDialog('showSupplierModal')">选择供应商</button>
        <span class="btn-small" v-for="(item, index) in searchSupplierList" :key="index+'supplier'">
          {{item.supplierName}}
          <a href="javascript:;" @click="removeSearchSupplier(index)">X</a>
        </span>
        <button class="btn-fill-org-main" @click="openDialog('showBrandModal')">选择品牌</button>
        <span class="btn-org-small" v-for="(item, index) in searchBrandList" :key="index+'brand'">
          {{item.name}}
          <a href="javascript:;" @click="removeSearchBrand(index)">X</a>
        </span>
        <button class="btn-fill-org-main btn-select-shop" @click="openDialog('showShopModal')">选择店铺</button>
        <span class="btn-org-small btn-select-shop-item" v-for="(item, index) in searchShopList" :key="index+'shop'">
          {{item.name}}
          <a href="javascript:;" @click="removeSearchShop(index)">X</a>
        </span>
        <select class="form-control" v-model="listParams.itemChannelTypes" :class="{'unset-select':!listParams.itemChannelTypes}" v-show="!userConfig.singleChannel">
          <option v-for="(item, index) in channelList" v-bind:value="item.channelType" :key="index+'channel'">{{item.channelTypeName}}</option>
        </select>
        <!-- <button class="btn-fill-main" @click="getGoodsList">搜索</button>
        <button class="btn-fill-grey-main" @click="clearSearch">清空</button> -->
      </div>
      <div class="search-bar">
        <div class="search-bar-title">其他筛选：</div>
        <div class="form-wrap">
          <div class="form-name">关键字</div>
          <select class="form-control" v-model="listParams.keywordType" :class="{'unset-select':!listParams.keywordType}">
            <option v-for="(item, index) in keywordTypeList" v-bind:value="item.id" :key="index+'channel'">{{item.name}}</option>
          </select>
          <input type="text" class="form-control" v-model="listParams.keyword">
        </div>
        <div class="form-wrap">
          <div class="form-name">价格区间</div>
          <input type="number" class="form-control" v-model="listParams.priceRange.minPrice">
          <span class="price-mid">~</span>
          <input type="number" class="form-control" v-model="listParams.priceRange.maxPrice">
        </div>
        <button class="btn-fill-main" @click="getGoodsList">搜索</button>
        <button class="btn-fill-grey-main" @click="clearSearch">清空</button>
      </div>
      <div class="control-wrap">
        <div class="control-item">
          <router-link :to="{ name: '商品详情'}" class="btn-main">新增商品</router-link>
          <!-- <div class="btn-fill-main">批量导入</div> -->
        </div>
        <div class="control-item" v-show="listParams.status!==0">
          <div>批量操作：</div>
          <div class="btn-fill-org-main" @click="batchSetStatus(1)" v-show="listParams.status===2">上架商品</div>
          <div class="btn-fill-org-main" @click="batchSetStatus(2)" v-show="listParams.status===1">下架商品</div>
          <!-- <div class="btn-fill-org-main">设置价格</div> -->
        </div>
      </div>
      <table class="table">
         <thead>
           <tr>
             <th class="dot" :class="{'active':checkAll}" @click="selectAll()"></th>
             <th class="table-w100">宝贝ID</th>
             <th class="table-w100">主图</th>
             <th class="table-w120">品牌</th>
             <th>商品名称</th>
             <th class="table-w340">型号</th>
             <!-- <th>重量</th>
             <th>库存</th> -->
             <th class="table-w140" v-show="!userConfig.singleChannel">渠道</th>
             <th class="table-w100">操作</th>
           </tr>
         </thead>
         <tbody>
          <tr v-for="(item, index) in tableData" :key="index+'table'" :class="{'selectedTr':item.checked}">
            <td class="dot" :class="{'active':item.checked}" @click="selectItem(item)"></td>
            <td>{{item.id}}</td>
            <td>
              <el-popover
                placement="right"
                width="260"
                trigger="hover">
                <img style="width:100%;height:100%" :src="item.mainImageUrl">
                <img slot="reference" :src="item.mainImageUrl" />
              </el-popover>
            </td>
            <td>{{item.brandName}}</td>
            <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.name}}</span>
                <span slot="reference">{{item.name}}</span>
              </el-popover>
            </td>
            <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>
                  <span v-for="(sku, sku_index) in item.skuList" :key="sku_index+'sku'">
                    {{sku}}
                    <span v-show="sku_index != item.skuList.length-1">、</span>
                  </span>
                </span>
                <span slot="reference">
                  <span v-for="(sku, sku_index) in item.skuList" :key="sku_index+'sku'">
                    {{sku}}
                    <span v-show="sku_index != item.skuList.length-1">、</span>
                  </span>
                </span>
              </el-popover>
            </td>
            <!-- <td>{{item.weight}}</td>
            <td>{{item.quantity}}</td> -->
            <td v-show="!userConfig.singleChannel">{{item.channelName}}</td>
            <td>
              <a href="javascript:;" class="link base-margin-right" @click="editItem(item.id)">编辑</a>
              <a href="javascript:;" class="link base-margin-right" v-show="item.status===2" @click="setStatus(item, 1)">上架</a>
              <a href="javascript:;" class="link base-margin-right" v-show="item.status===1" @click="setStatus(item, 2)">下架</a>
              <!-- <a href="javascript:;" class="link">类目</a> -->
            </td>
          </tr>
          </tbody>
      </table>
      <pagination v-show="total>0" :total="total" :page.sync="listParams.page" :limit.sync="listParams.limit" @pagination="getGoodsList()" />
      <noData v-if="total===0"></noData>
    </div>
    <SelectBrand v-if="showBrandModal" ref="showBrandModal" v-on:dialogBrand="dialogBrand" v-on:dialogBrandCancel="dialogBrandCancel"></SelectBrand>
    <SelectSupplier v-if="showSupplierModal" ref="showSupplierModal" v-on:dialogSupplier="dialogSupplier" v-on:dialogSupplierCancel="dialogSupplierCancel"></SelectSupplier>
    <SelectShop v-if="showShopModal" ref="showShopModal" v-on:dialogShop="dialogShop" v-on:dialogShopCancel="dialogShopCancel"></SelectShop>
  </div>
</template>
<script>
import selectBrand from '@/components/selectBrand/index.vue';
import selectSupplier from '@/components/selectSupplier/index.vue';
import selectShop from '@/components/selectShop/index.vue';
import Pagination from '@/components/pagination';
import noData from '@/components/noData';
export default {
  data() {
    return {
      showBrandModal: false,
      showSupplierModal: false,
      showShopModal: false,
      firstCateList: [],
      secondCateList: [],
      thirdCateList: [],
      searchBrandList: [],
      searchSupplierList: [],
      searchShopList: [],
      selectedCate: {
        first:'',
        second:'',
        third:''
      },
      checkAll: false,
      total: -1,
      channelList: [{channelType:'', channelTypeName:'请选择商品渠道'}],
      keywordTypeList: [
        {id:'',name:'请选择关键词类型'},
        {id:1,name:'商品ID'},
        {id:2,name:'商品名称'},
        {id:3,name:'UPC'}
      ],
      listParams: {
        page: 1,
        limit: 20,
        status: 1,
        itemChannelTypes: '',
        keywordType: '',
        keyword: '',
        priceRange: {
          minPrice: '',
          maxPrice: ''
        }
      },
      tableData: []
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 获取一级类目列表
      this.getCate(0, '');
      // 初始化商品列表
      this.getGoodsList();
      // 获取渠道列表
      this.getChannelList();
    },
    openDialog(index){
      this[index] = true;
    },
    getCate(level, id) {
      let pId = id ? id : 0;
      this.api.category.categoryNode({parentId:pId,status:1}).then((res) => {
          if(level===0){
              this.firstCateList = res.data;
              this.secondCateList = [];
              this.thirdCateList = [];
          } else if (level===1){
              this.secondCateList = res.data;
              this.thirdCateList = [];
          }else{
              this.thirdCateList = res.data;
          }
      });
    },
    getChannelList() {
      this.api.goods.channel({}).then((res) => {
        this.channelList = this.channelList.concat(res.data);
      });
    },
    selectCate(type, item) {
      if(type === 1){
          if(this.selectedCate.first !== item.id){
              this.getCate(1, item.id);
              this.selectedCate.first = item.id;
              this.selectedCate.second = '';
              this.selectedCate.third = '';
          } else {
            this.selectedCate.first = '';
            this.selectedCate.second = '';
            this.selectedCate.third = '';
            this.secondCateList = [];
            this.thirdCateList = [];
          }
      } else if (type === 2){
          if(this.selectedCate.second !== item.id){
              this.getCate(2, item.id);
              this.selectedCate.second = item.id;
              this.selectedCate.third = '';
          } else {
            this.selectedCate.second = '';
              this.selectedCate.third = '';
              this.thirdCateList = [];
          }
      }else{
        if(this.selectedCate.third !== item.id) {
          this.selectedCate.third = item.id;
        } else {
          this.selectedCate.third = '';
        }
      }
      this.getGoodsList();
    },
    editItem(id) {
      let path = 'commodity/detail/'+id;
      window.open(path, '_blank');
    },
    setStatus(item, status) {
      this.$msgbox({
        title: '',
        message: status === 1 ? '确认上架？' : '确认下架？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          this.api.goods.setStatus({ids: item.id, status}).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getGoodsList();
          });
        }
      });
    },
    batchSetStatus(status) {
      let selected = [];
      this.tableData.forEach((item) => {
        if(item.checked) {
          selected.push(item.id);
        }
      });
      let ids = selected.join(',');
      if(!ids) {
        this.$message.info({message:'请选择至少一件商品', showClose:true});
      } else {
        this.$msgbox({
          title: '',
          message: status === 1 ? '确认批量上架？' : '确认批量下架？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(action => {
          if(action === 'confirm') {
            this.api.goods.setStatus({ids: ids, status}).then((res) => {
              this.$message.success({message:res.message, showClose:true});
              this.getGoodsList();
            });
          }
        });
      }
    },
    selectItem(item) {
      this.checkAll = true;
      item.checked = !item.checked;
      this.tableData.forEach((item) => {
        if(!item.checked) {
          this.checkAll = false;
        }
      });
    },
    selectAll() {
      this.checkAll = !this.checkAll;
      this.tableData.forEach((item) => {
        if(this.checkAll) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    getGoodsList() {
      let params = this.copy(this.listParams);
      params.priceRange = JSON.stringify(params.priceRange);
      if(this.searchBrandList.length>0){
        let brandId = [];
        this.searchBrandList.forEach((item) => {
          brandId.push(item.id);
        });
        params.brandIds = brandId.join(',');
      }
      if(this.searchSupplierList.length>0){
        let supplier = [];
        this.searchSupplierList.forEach((item) => {
          supplier.push(item.id);
        });
        params.supplierIds = supplier.join(',');
      }
      if(this.searchShopList.length>0){
        let shop = [];
        this.searchShopList.forEach((item) => {
          shop.push(item.id);
        });
        params.shopIds = shop.join(',');
      }
      params.cateId = this.selectedCate.third || this.selectedCate.second || this.selectedCate.first || '';
      this.api.goods.list(params).then((res) => {
        res.data.dataList.forEach((item) => {
          item.checked = false;
        });
        this.tableData = res.data.dataList;
        this.total = res.data.total;
      });
    },
    clearSearch() {
      this.listParams.page = 1;
      this.listParams.limit = 20;
      this.listParams.itemChannelTypes = '';
      this.listParams.keywordType = '';
      this.listParams.keyword = '';
      this.listParams.priceRange = {
        minPrice: '',
        maxPrice: ''
      };
      this.selectedCate = {
        first:'',
        second:'',
        third:''
      }
      this.secondCateList = [],
      this.thirdCateList = [],
      this.searchBrandList = [];
      this.searchSupplierList = [];
      this.getGoodsList();
    },
    changeStatus(status) {
      this.listParams.status = status;
      this.getGoodsList();
    },
    dialogBrand(brands) {
      this.searchBrandList = brands.brandList;
      this.showBrandModal = false;
    },
    dialogBrandCancel() {
      this.showBrandModal = false;
    },
    removeSearchBrand(index) {
      this.searchBrandList.splice(index, 1);
    },
    dialogSupplier(suppliers) {
      this.searchSupplierList = suppliers.supplierList;
      this.showSupplierModal = false;
    },
    dialogSupplierCancel() {
      this.showSupplierModal = false;
    },
    removeSearchSupplier(index) {
      this.searchSupplierList.splice(index, 1);
    },
    dialogShop(res) {
      this.searchShopList = res.shopList;
      this.showShopModal = false;
    },
    dialogShopCancel() {
      this.showShopModal = false;
    },
    removeSearchShop(index) {
      this.searchShopList.splice(index, 1);
    }
  },
  components: {
    'SelectBrand': selectBrand,
    'SelectSupplier': selectSupplier,
    'SelectShop': selectShop,
    'Pagination': Pagination,
    'noData': noData
  }
}
</script>
<style scoped lang='scss'>
  .center-commodity{
    .type-wrap{
      margin-bottom: 10px;
      padding: 0 20px 0;
      background: $white-color;
      .type-content-wrap{
        display: flex;
        padding: 10px 0;
        border-top:1px solid $border-color;
        &:first-child{
          border: none;
        }
        .type-title{
          width: 90px;
          font-weight: 600;
          line-height: 30px;
        }
        .type-content{
          display: flex;
          flex: 1;
          flex-wrap:wrap;
          align-content:center;
          .type-item{
            min-width: 80px;
            line-height: 30px;
            border-radius: 15px;
            margin-right: 10px;
            border-radius: 15px;
            .ellipsis{
              padding-right: 30px;
              width: auto;
              max-width: 100%;
              position: relative;
              .item-count{
                position: absolute;
                right: 5px;
                top: 0;
              }
            }
            .pr40{
              padding-right: 40px;
            }
            a{
              display: inline-block;
              vertical-align: top;
              color: #333;
              height: 28px;
              line-height: 28px;
              padding: 0 8px;
              border-radius: 28px;
              border: 1px solid #fff;
            }
          }
          .active{
            a{
              border:1px solid rgba($color: $main-color, $alpha: 0.6);
              color:$main-color;
            }
          }
        }
      }
    }
    .table{
      .ellipsis{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }
    .search-bar{
      button,.form-control{
        margin-right: 10px;
      }
      .btn-org-small, .btn-small{
        margin-right: 10px;
        a{
          color: #fff;
          padding-left: 5px;
        }
      }
      .price-mid{
        padding-right: 10px;
      }
      .btn-select-shop{
        color: #3A62E1;
        border:1px solid rgba($color: #3A62E1, $alpha: 0.6);
      }
      .btn-select-shop-item{
        background: #3A62E1;
        border-color: #3A62E1;
      }
    }
    .control-wrap{
      display: flex;
      justify-content: space-between;
      padding: 10px;
      .control-item{
        display: flex;
        align-items: center;
        .btn-fill-main{
          margin-left: 10px;
        }
      }
    }
  }
</style>