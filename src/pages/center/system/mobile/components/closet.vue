<template>
  <div class="closet-set">
    <div class="title">
      <div class="name">壁橱布局</div>
      <div class="link underline pull-right">恢复默认</div>
      <div class="link underline pull-right" @click="save()">确定</div>
    </div>
    <div class="module-content">
      <div class="goods-source">
        <div class="form-wrap">
          <div class="form-name form-name-middle">添加商品来源</div>
          <select class="form-control" v-model="formData.styleAndData.dataType">
            <option value="">请选择</option>
            <option v-for="jump in jumpList" :key='jump.code' :value="jump.code">{{jump.remark}}</option>
          </select>
        </div>
        <div class="form-wrap" v-show="formData.styleAndData.dataType == 26">
          <div class="form-name form-name-middle">活动ID</div>
          <input type="text" class="form-control" v-model="formData.styleAndData.headerImage.jump.jumpData">
        </div>
        <div class="form-wrap" v-show="formData.styleAndData.dataType == 28">
          <div class="form-name form-name-middle">分类选择</div>
          <div class="form-group">
            <div class="flex-wrap">
              <select class="form-control" v-model="categoryData.first.id">
                <option value="">请选择</option>
                <option v-for="category in categoryData.first.data" :key='category.id' :value="category.id">{{category.name}}</option>
              </select>
              <select class="form-control" v-model="categoryData.second.id">
                <option value="">请选择</option>
                <option v-for="category in categoryData.second.data" :key='category.id' :value="category.id">{{category.name}}</option>
              </select>
              <select class="form-control" v-model="categoryData.third.id">
                <option value="">请选择</option>
                <option v-for="category in categoryData.third.data" :key='category.id' :value="category.id">{{category.name}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-wrap">
        <div class="form-name form-name-small">标题</div>
        <input type="text" class="form-control" v-model="formData.title">
        <div class="text-type">
          <span>对齐</span>
          <img :class="{active:formData.styleAndData.titleStyle.align.horizontalAlign===1}" @click="titlePosition(1)" src="~assets/system/mobile/textLeft.png" draggable="false">
          <img :class="{active:formData.styleAndData.titleStyle.align.horizontalAlign==2}" @click="titlePosition(2)" src="~assets/system/mobile/textCenter.png" draggable="false">
          <img :class="{active:formData.styleAndData.titleStyle.align.horizontalAlign==3}" @click="titlePosition(3)" src="~assets/system/mobile/textRight.png" draggable="false">
        </div>
      </div>
      <div class="form-wrap">
        <div class="form-name form-name-small">标题风格</div>
        <el-radio v-model="formData.styleAndData.titleStyleType" 
          :label='radio.id' v-for="radio in styleSelect.titleStyle" :key="radio.id">
          {{radio.styleName}}
        </el-radio>
      </div>
      <div class="layout">
        <div class="layout-name">模块布局</div>
        <div class="layout-img"></div>
      </div>
      <div class="add-bg">
        <upload class="img-alt" v-on:uploadSuccess="uploadSuccess">
          <div class="up-tip" v-if="!formData.styleAndData.headerImage.url">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-img-default"></use>
            </svg>
            <div class="link underline">添加一个背景图</div>
          </div>
          <img :src="formData.styleAndData.headerImage.url" v-if="formData.styleAndData.headerImage.url">
        </upload>
      </div>
      <div class="other-set-wrap">
        <div class="form-wrap">
          <div class="form-name">模块其他设置</div>
          <el-radio v-model="formData.styleAndData.styleType" 
            :label='radio.id' v-for="radio in styleSelect.other" :key="radio.id">
            {{radio.styleName}}
          </el-radio>
          <el-radio v-model="formData.styleAndData.styleType" :label='9'>自定义</el-radio>
        </div>
        <div class="other-set" v-show="formData.styleAndData.styleType == 9">
            <div class="form-wrap form-flex-wrap">
              <div class="form-name form-name-middle">模块间距</div>
              <div class="form-flex">
                <span>上</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[1]">
                <span>下</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[3]">
                <span>左</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[0]">
                <span>右</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[2]">
              </div>
            </div>
            <div class="form-wrap">
              <div class="form-name form-name-middle">模块背景</div>
              <el-color-picker v-model="formData.styleAndData.backgroundStyle.color"></el-color-picker>
              <upload v-on:uploadSuccess="setUpload" class="form-name add-img">
                <div v-show="!formData.styleAndData.backgroundStyle.imageUrl">上传图片</div>
                <el-popover
                  v-show="formData.styleAndData.backgroundStyle.imageUrl"
                  placement="right"
                  width="200"
                  trigger="hover">
                  <img style="width:100%;height:100%" :src="formData.styleAndData.backgroundStyle.imageUrl">
                  <span slot="reference">查看图片</span>
                </el-popover>
              </upload>
            </div>
            <div class="form-wrap">
              <div class="form-name form-name-middle">分割线显示</div>
              <el-radio v-model="formData.styleAndData.hideDividers" :label='0'>显示</el-radio>
              <el-radio v-model="formData.styleAndData.hideDividers" :label='1'>不显示</el-radio>
            </div>
            <div class="form-wrap">
              <div class="form-name form-name-middle">分割线高度</div>
              <input type="text" class="form-control" v-model="formData.styleAndData.divider.height">
            </div>
            <div class="form-wrap">
              <div class="form-name form-name-middle">分割线颜色</div>
              <el-color-picker v-model="formData.styleAndData.divider.color"></el-color-picker>
            </div>
            <div class="form-wrap">
              <div class="form-name">海报</div>
            </div>
            <div class="form-wrap">
              <div class="form-name">列表上移高度</div>
              <input type="text" class="form-control" v-model="formData.styleAndData.offset">
              <div class="form-name">商品列表间距</div>
              <input type="text" class="form-control" v-model="formData.styleAndData.footerPadding">
            </div>
            <div class="form-wrap">
              <div class="form-name">商品名称颜色</div>
              <el-color-picker v-model="formData.styleAndData.itemStyle.titleStyle.foreground"></el-color-picker>
              <div class="form-name">商品价格颜色</div>
              <el-color-picker v-model="formData.styleAndData.itemStyle.priceStyle.foreground"></el-color-picker>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    msg: String
  },
  data() {
    return {
      jumpList:[],
      categoryData:{
        first:{
          id:'',
          data:[]
        },
        second:{
          id:'',
          data:[]
        },
        third:{
          id:'',
          data:[]
        }
      },
      styleSelect:{
        titleStyle:[],
        displayStyle:[],
        other:[]
      },
      formData:{
        layoutType:2,
        name:'壁橱',
        module:'closet',
        title:'',
        styleAndData:{
          styleType:'',
          padding:'',
          paddingArr:['','','',''],
          backgroundStyle:{
            imageUrl:'',
            color:''
          },
          hideDividers:0,
          divider:{
            height:'',
            color:''
          },
          titleStyleType:0,
          titleStyle:{
            align:{
              horizontalAlign:0
            }
          },
          headerImage:{
            url:'',
            jump:{
                jumpType:'',
                jumpData:''
              }
          },
          footerPadding:'',
          offset:'',
          showShadow:'',
          itemStyle:{
            titleStyle:{foreground:''},
            priceStyle:{foreground:''}
          },
          dataTypeName:'',
          dataType:'',
          value:''
        }
      }
    }
  },
  methods:{
    getEditData(data){
      this.console(data);
      this.formData = this.extend(this.formData,data);
    },
    getFirstList() {
      this.api.category.categoryNode({parentId:0}).then((res) => {
        this.categoryData.first.data = res.data;
      });
    },
    setUpload(data){
      this.formData.styleAndData.backgroundStyle.imageUrl = data.data;
    },
    uploadSuccess(data){
      this.formData.styleAndData.headerImage.url = data.data;
    },
    titlePosition(type){
      this.formData.styleAndData.titleStyle.align.horizontalAlign = type;
    },
    save(){
      this.formData.styleAndData.headerImage.jump.jumpType = this.formData.styleAndData.dataType;
      if(this.formData.styleAndData.dataTypeName == '类目详情'){
        this.formData.styleAndData.headerImage.jump.jumpData = this.categoryData.third.id || this.categoryData.second.id || this.categoryData.first.id || this.formData.styleAndData.value;
      }
      this.formData.styleAndData.value = this.formData.styleAndData.headerImage.jump.jumpData;
      this.formData.styleAndData.padding = this.formData.styleAndData.paddingArr.toString();
      this.$emit('listenSet',this.formData);
    }
  },
  created() {
    this.api.index.jumpType({layoutType:this.formData.layoutType}).then(result=>{
      this.jumpList = result.data;
      this.jumpList.forEach(item => {
        if(item.code == this.formData.styleAndData.dataType && item.remark == '类目详情'){
          this.formData.styleAndData.dataTypeName = item.remark;
          this.getFirstList();
        }
      });
    });
    this.api.index.getModuleStyle({layoutType:this.formData.layoutType}).then(result=>{
      result.data.forEach(item=>{
        switch(item.part){
          case 1:
            this.styleSelect.other.push(item);
          break;
          case 2:
            this.styleSelect.titleStyle.push(item);
          break;
          case 3:
            this.styleSelect.displayStyle.push(item);
          break;
        }
      });
      this.formData.styleAndData.titleStyleType = this.styleSelect.titleStyle[0].id;
      this.formData.styleAndData.styleType = this.styleSelect.other[0].id;
    });
  },
  watch: {
    'categoryData.first.id': function(val){
      if(!val){
          return
      }
      this.api.category.categoryNode({parentId:val}).then((res) => {
        this.categoryData.second.data = res.data;
      });
    },
    'categoryData.second.id': function(val){
      if(!val){
          return
      }
      this.api.category.categoryNode({parentId:val}).then((res) => {
        this.categoryData.third.data = res.data;
      });
    },
    'formData.styleAndData.dataType':function(val){
      if(!val){
          return
      }
      this.jumpList.forEach(item => {
        if(item.code == val){
          this.formData.styleAndData.dataTypeName = item.remark;
          !this.categoryData.first.data.length && item.remark == '类目详情' && this.getFirstList();
        }
      });
    }
  }
}
</script>
<style lang='scss'>
  .closet-set{
    background: #fff;
    border-radius: 4px;
    .goods-source{
      margin-bottom: 15px;
      padding: 10px;
      border:1px dotted $org-color;
      border-radius: 2px;
      .form-group{
        .form-control{
          margin-right: 10px;
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .layout{
      margin-bottom: 15px;
      .layout-name{
        display: inline-block;
        margin-right: 10px;
        vertical-align: top;
      }
      .layout-img{
        display: inline-block;
        width: 361px;
        height: 237px;
        background: url(~assets/system/mobile/closet/closet.png) top center;
      }
    }
    .other-set{
      .form-wrap{
        .form-name:nth-of-type(2){
          margin-left: 10px;
        }
      }
    }
  }
</style>