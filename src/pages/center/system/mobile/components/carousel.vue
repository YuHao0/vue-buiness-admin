<template>
  <div class="carousel-set">
    <div class="title">
      <div class="name">轮播海报</div>
      <div class="link underline pull-right">恢复默认</div>
      <div class="link underline pull-right" @click="save()">确定</div>
    </div>
    <div class="module-content">
      <div class="form-wrap">
        <div class="form-name form-name-small">图片比例</div>
        <el-radio v-model="formData.styleAndData.proportion" :label="1.5">3:2</el-radio>
        <el-radio v-model="formData.styleAndData.proportion" :label='2'>2:1</el-radio>
        <el-radio v-model="formData.styleAndData.proportion" :label='3'>
          <input type="number" @click="formData.styleAndData.proportion=3" @click.stop class="form-control" placeholder="自定义" v-model="formData.proportion">
        </el-radio>
      </div>
      <div class="form-wrap">
        <div class="form-name form-name-small">填充方式</div>
        <el-radio v-model="formData.styleAndData.scaleType" :label='0'>填充</el-radio>
        <el-radio v-model="formData.styleAndData.scaleType" :label='1'>按比例</el-radio>
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
      <div class="btn-fill-org-main base-margin-bottom" @click="addData()">添加一个背景图</div>
      <div class="blue-wrap" v-for="(item,index) in formData.styleAndData.imageList" :key="index + 'No'">
        <div class="el-icon-close pull-right" @click="deleteJump(index)"></div>
        <div class="img-wrap inline-block">
          <div class="img-alt">
            <img :src="item.url" v-if="item.url">
          </div>
          <upload uploadType='2' :index="index" v-on:uploadSuccess="uploadSuccess">
            <div class="link underline">更换图片</div>
          </upload>
        </div>
        <div class="form-content inline-block">
          <div class="form-wrap">
            <div class="form-name">跳转</div>
            <select class="form-control" v-model="item.jump.jumpType">
              <option value="">请选择</option>
              <option v-for="jump in jumpList" :key='jump.code' :value="jump.code">{{jump.remark}}</option>
            </select>
          </div>
          <div class="form-wrap">
            <div class="form-name">活动ID/链接</div>
            <input type="text" class="form-control" v-model="item.jump.jumpData">
          </div>
        </div>
      </div>
      <div class="other-set-wrap">
        <div class="form-wrap">
          <div class="form-name">模块其他设置</div>
          <el-radio v-model="formData.styleAndData.styleType" 
            :label='radio.id' v-for="radio in styleSelect.other" :key="radio.id">
            {{radio.styleName}}
          </el-radio>
          <el-radio v-model="formData.styleAndData.styleType" :label='0'>自定义</el-radio>
        </div>
        <div class="other-set" v-show="formData.styleAndData.styleType == 0">
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
      styleSelect:{
        titleStyle:[],
        displayStyle:[],
        other:[]
      },
      formData:{
        layoutType:1,
        name:'轮播海报',
        module:'carousel',
        title:'',
        proportion:'',
        styleAndData:{
          styleType:0,
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
          proportion:1.5,
          scaleType:0,
          duration:'',
          indicatorStyle:'',
          imageList:[
            {
              url:'',
              jump:{
                jumpType:'',
                jumpData:''
              }
            }
          ]        
        }
      }
    }
  },
  methods:{
    setUpload(data){
      this.formData.styleAndData.backgroundStyle.imageUrl = data.data;
    },
    getEditData(data){
      this.console(data);
      this.formData = this.extend(this.formData,data);
      if(this.formData.styleAndData.proportion != 1.5 && this.formData.styleAndData.proportion !=2){
        this.formData.proportion = this.formData.styleAndData.proportion;
        this.formData.styleAndData.proportion = 3;
      }
      console.log(this.formData);
    },
    deleteJump(index){
      this.formData.styleAndData.imageList.splice(index,1)
    },
    titlePosition(type){
      this.formData.styleAndData.titleStyle.align.horizontalAlign = type;
    },
    addData(){
      this.formData.styleAndData.imageList.push({
          url:'',
          jump:{
            jumpType:'',
            jumpData:''
          }
        });
    },
    uploadSuccess(result){
      this.formData.styleAndData.imageList[result.index].url = result.data;
    },
    save(){
      this.formData.styleAndData.padding = this.formData.styleAndData.paddingArr.toString();
      if(this.formData.styleAndData.proportion == 3){
        this.formData.styleAndData.proportion = this.formData.proportion;
      }
      this.$emit('listenSet',this.formData);
    }
  },
  created() {
    this.api.index.jumpType({layoutType:this.formData.layoutType}).then(result=>{
      this.jumpList = result.data;
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
  }
}
</script>
<style lang='scss'>
  .carousel-set{
    background: #fff;
    border-radius: 4px;
  }
</style>