<template>
  <div class="banner-detail">
    <h2 class="title">{{id ? '编辑' : '新增'}}banner</h2>
    <div class="banner-wrap">
      <div class="banner-item">
        <span class="banner-title">标题</span>
        <input type="text" class="form-control" v-model="bannerParams.title" />
      </div>
      <div class="banner-item">
        <span class="banner-title">图片上传</span>
        <img class="imageUrl" :src="bannerParams.imageUrl" v-show="bannerParams.imageUrl" />
        <a href="javascript:;" class="upload-img" v-show="!bannerParams.imageUrl" @click="openCropperModal()">点击上传图片</a>
        <a class="link" v-show="bannerParams.imageUrl" @click="openCropperModal()">更改海报</a>
        <span class="tips" v-show="!bannerParams.imageUrl">建议尺寸:1650x450</span>
      </div>
      <div class="banner-item">
        <span class="banner-title">跳转至</span>
        <select class="form-control" v-model="bannerParams.jumpType">
          <option v-for="item in jumpTypeList" :key="item.id" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="banner-item" v-show="bannerParams.jumpType===25">
        <span class="banner-title">活动ID</span>
        <input type="text" class="form-control" v-model="bannerParams.jumpData" placeholder="请输入活动ID" />
      </div>
      <div class="banner-item" v-show="bannerParams.jumpType===24">
        <span class="banner-title">链接地址</span>
        <input type="text" class="form-control" v-model="bannerParams.jumpData" placeholder="请输入跳转地址" />
      </div>
      <div class="group-content" v-show="bannerParams.jumpType===31">
        <div class="banner-item" v-for="(item, index) in bannerParams.conditionList" :key="index+'banner'">
          <span class="banner-title">{{index===0 ? '组合条件' : ''}}</span>
          <div class="item-condition">
            <div class="condition-row">
              <span class="condition-title">类目</span>
              <a class="btn-fill-main" @click="selectItemCate(item, index)">选择类目</a>
              <span class="btn-small" v-for="(cate, cate_index) in item.cateList" :key="cate_index+'cate'+index">
                {{cate.name}}<a class="delete-icon" @click="removeItemCate(item, cate_index)">X</a>
              </span>
            </div>
            <div class="condition-row">
              <span class="condition-title">品牌</span>
              <a class="btn-fill-main" @click="selectItemBrand(item, index)">选择品牌</a>
              <span class="btn-small" v-for="(brand, brand_index) in item.brandList" :key="brand_index+'brand'+index">
                {{brand.name}}<a class="delete-icon" @click="removeItemBrand(item, brand_index)">X</a>
              </span>
            </div>
            <div class="condition-row">
              <span class="condition-title line40">店铺</span>
              <el-select v-model="item.shopIdList" multiple placeholder="请选择" class="multipleSelect">
                <el-option
                  v-for="shop in shopList"
                  :key="shop.id"
                  :label="shop.name"
                  :value="shop.id">
                </el-option>
              </el-select>
            </div>
            <div class="condition-row">
              <span class="condition-title line40">渠道</span>
              <el-select v-model="item.channelTypeList" multiple placeholder="请选择" class="multipleSelect">
                <el-option
                  v-for="channel in channelList"
                  :key="channel.channelType"
                  :label="channel.channelTypeName"
                  :value="channel.channelType">
                </el-option>
              </el-select>
            </div>
            <div class="condition-btn">
              <a @click="addConditionItem()" v-show="index===0">添加</a>
              <a class="delete-condition" @click="removeConditionItem(index)" v-show="index>0">删除</a>
            </div>
          </div>
        </div>
      </div>
      <div class="banner-item">
        <span class="banner-title">起止时间</span>
        <el-date-picker class="timepicker-control" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择" v-model="bannerParams.startTime" :picker-options="pickerOption"></el-date-picker>
        <el-date-picker class="timepicker-control" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择" v-model="bannerParams.endTime" :picker-options="pickerOption"></el-date-picker>
      </div>
      <div class="banner-item">
        <span class="banner-title">是否启用</span>
        <el-radio v-model="bannerParams.status" :label="1" class="radio">启用</el-radio>
        <el-radio v-model="bannerParams.status" :label="0" class="radio">禁用</el-radio>
      </div>
    </div>
    <div class="bot-btn">
      <a href="javascript:;" class="btn-main" @click="saveBanner()">保存</a>
      <router-link class="btn-fill-main" :to="{ name: '电脑端'}">返回</router-link>
    </div>
    <selectCategory v-if="showCategoryModal" v-on:dialogCategory="dialogCategory" v-on:dialogCategoryCancel="dialogCategoryCancel" :selected="selectedCateList"></selectCategory>
    <selectBrand v-if="showBrandModal" v-on:dialogBrand="dialogBrand" v-on:dialogBrandCancel="dialogBrandCancel" :selected="selectedBrandList"></selectBrand>
    <Cropper v-if="showCropper" ref="cropper" v-on:dialogCropper="dialogCropper" v-on:dialogCropperCancel="dialogCropperCancel" :imgUrl="bannerParams.imageUrl" :fixedNumber="[11, 3]"></Cropper>
  </div>
</template>

<script>
import selectCategory from '@/components/selectCategory/index.vue';
import selectBrand from '@/components/selectBrand/index.vue';
import Cropper from '@/components/cropper/index.vue';
export default {
  components: { selectCategory, selectBrand, Cropper },
  data() {
    return {
      id: '',
      showCategoryModal: false,
      showBrandModal: false,
      showCropper: false,
      cateList: [],
      brandList: [],
      shopList: [],
      channelList: [],
      currentCateItem: -1,
      selectedCateList: [],
      currentBrandItem: -1,
      selectedBrandList: [],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now()-8.64e7;
        }
      },
      jumpTypeList: [
        { id: 25, name: '活动'},
        { id: 24, name: '链接'},
        { id: 31, name: '组合条件'}
      ],
      bannerParams: {
        title: '',
        jumpType: 25,
        imageUrl: '',
        startTime: '',
        endTime: '',
        status: 0,
        conditionList: [{
          cateList: [],
          brandList: [],
          shopIdList: [],
          channelTypeList: []
        }]
      }
    }
  },
  created() {
    this.id = this.$route.params.id || '';
    this.api.store.allShop({}).then((res) => {
      this.shopList = res.data;
    });
    this.api.goods.channel({}).then((res) => {
      this.channelList = res.data;
    });
    if(this.id) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      this.api.category.thirdCate({}).then((resCate) => {
        this.cateList = resCate.data.dataList;
        this.api.brand.letterList({}).then((resBrand) => {
          this.brandList = resBrand.data;
          this.api.system.bannerDetail({id: this.id}).then((res) => {
            this.bannerParams.id = res.data.id;
            this.bannerParams.title = res.data.title;
            this.bannerParams.startTime = res.data.startTime;
            this.bannerParams.endTime = res.data.endTime;
            this.bannerParams.status = res.data.status;
            this.bannerParams.jumpType = res.data.jump.jumpType;
            this.bannerParams.imageUrl = res.data.imageUrl;
            if(this.bannerParams.jumpType===31) {
              this.bannerParams.conditionList = JSON.parse(res.data.jump.jumpData);
              this.bannerParams.conditionList.forEach(item => {
                this.$set(item, 'cateList', []);
                this.$set(item, 'brandList', []);
                item.categoryUnitList.forEach(cate => {
                  this.cateList.forEach(c => {
                    if(c.id === cate.cateId3) {
                      item.cateList.push({
                        name: c.name,
                        id: c.id
                      });
                    }
                  });
                });
                item.brandIdList.forEach(brand => {
                  this.brandList.forEach(xb => {
                    if(xb.id === brand) {
                      item.brandList.push(xb);
                    }
                  });
                });
              });
            } else {
              this.bannerParams.jumpData = res.data.jump.jumpData;
            }
          });
        });
      });
    },
    addConditionItem() {
      this.bannerParams.conditionList.push({
        cateList: [],
        brandList: [],
        shopIdList: [],
        channelTypeList: []
      });
    },
    removeConditionItem(index) {
      this.bannerParams.conditionList.splice(index, 1);
    },
    selectItemCate(item, index) {
      this.currentCateItem = this.copy(index);
      this.selectedCateList = item.cateList || [];
      this.showCategoryModal = true;
    },
    removeItemCate(item, index) {
      item.cateList.splice(index, 1);
    },
    openCropperModal() {
      this.showCropper = true;
    },
    dialogCropper(res) {
      this.bannerParams.imageUrl = res.url;
      this.showCropper = false;
    },
    dialogCropperCancel() {
      this.showCropper = false;
    },
    selectItemBrand(item, index) {
      this.currentBrandItem = this.copy(index);
      this.selectedBrandList = item.brandList || [];
      this.showBrandModal = true;
    },
    removeItemBrand(item, index) {
      item.brandList.splice(index, 1);
    },
    dialogCategory(res) {
      if(this.currentCateItem > -1) {
        this.bannerParams.conditionList[this.currentCateItem].cateList = res.categoryList;
        this.showCategoryModal = false;
        this.currentCateItem = -1;
      } else {
        this.$message.info({message: '系统错误', showClose: true});
      }
    },
    dialogCategoryCancel() {
      this.showCategoryModal = false;
    },
    dialogBrand(res) {
      if(this.currentBrandItem > -1) {
        this.bannerParams.conditionList[this.currentBrandItem].brandList = res.brandList;
        this.showBrandModal = false;
        this.currentBrandItem = -1;
      } else {
        this.$message.info({message: '系统错误', showClose: true});
      }
    },
    dialogBrandCancel() {
      this.showBrandModal = false;
    },
    saveBanner() {
      let params = this.copy(this.bannerParams);
      let startTime = new Date(params.startTime);
      let endTime = new Date(params.endTime);
      if(startTime >= endTime) {
        this.$message.info('结束时间应在开始时间之后');
        return 0;
      }
      if(params.jumpType === 31) {
        params.conditionList.forEach(item => {
          item.categoryUnitList = [];
          item.brandIdList = [];
          if(item.cateList && item.cateList.length>0) {
            item.cateList.forEach(cate => {
              item.categoryUnitList.push({
                cateId1: 0,
                cateId2: 0,
                cateId3: cate.id
              });
            });
          }
          if(item.brandList && item.brandList.length>0) {
            item.brandList.forEach(brand => {
              item.brandIdList.push(brand.id);
            });
          }
          delete item.cateList;
          delete item.brandList;
          delete item.empty;
        });
        params.jump = {
          jumpType: params.jumpType,
          jumpData: params.conditionList
        }
      } else {
        params.jump = {
          jumpType: params.jumpType,
          jumpData: params.jumpData
        }
      }
      delete params.jumpType;
      delete params.jumpData;
      delete params.conditionList;
      params.jump = JSON.stringify(params.jump);
      this.console(params);
      if(params.id) {
        this.api.system.editBanner(params).then((res) => {
          this.$message.success({message: res.message, showClose: true});
          this.$router.push({ name: '电脑端' });
        });
      } else {
        this.api.system.addBanner(params).then((res) => {
          this.$message.success({message: res.message, showClose: true});
          this.$router.push({ name: '电脑端' });
        });
      }
    }
  }
}
</script>

<style lang="scss">
  .banner-detail{
    .title{
      font-size: 14px;
      color: #333333;
      font-weight: bold;
      padding-bottom: 10px;
    }
    .banner-wrap{
      padding: 20px 20px 5px;
      background: #fff;
      border-radius: 4px;
      .banner-item{
        padding-bottom: 15px;
        .timepicker-control{
          margin-right: 10px;
          width: 180px;
        }
        .imageUrl{
          display: inline-block;
          vertical-align: top;
          max-width: 330px;
          max-height: 90px;
        }
        .upload-img{
          display: inline-block;
          vertical-align: top;
          width: 100px;
          height: 30px;
          font-size: 14px;
          color: $org-color;
          border: 1px dashed $org-color;
          text-align: center;
          line-height: 30px;
        }
        .link{
          line-height: 30px;
          margin-left: 15px;
        }
        .tips{
          display: inline-block;
          vertical-align: top;
          color: #888;
          padding-left: 10px;
          line-height: 30px;
        }
        .radio{
          line-height: 30px;
        }
        .banner-title{
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
          color: #333333;
          text-align: left;
          width: 78px;
          line-height: 30px;
        }
        .form-control{
          width: 366px;
        }
        .item-condition{
          display: inline-block;
          vertical-align: top;
          width: 800px;
          .condition-row{
            padding-bottom: 15px;
            .condition-title{
              display: inline-block;
              vertical-align: top;
              font-size: 14px;
              color: #333333;
              font-weight: bold;
              padding-right: 10px;
              line-height: 30px;
            }
            .line40{
              line-height: 40px;
            }
            .multipleSelect{
              width: 328px;
            }
            .btn-small{
              margin-left: 10px;
              .delete-icon{
                cursor: pointer;
                padding: 0 2px 0 10px;
              }
            }
          }
          .condition-btn{
            a{
              display: inline-block;
              vertical-align: top;
              width: 42px;
              height: 30px;
              text-align: center;
              line-height: 30px;
              color: #F06941;
              border: 1px dashed #F06941;
              cursor: pointer;
              border-radius: 15px;
            }
            .delete-condition{
              color: #666666;
              border: 1px dashed #999999;
            }
          }
        }
      }
    }
    .bot-btn{
      padding-top: 20px;
      a{
        margin-right: 20px;
      }
    }
  }
</style>

