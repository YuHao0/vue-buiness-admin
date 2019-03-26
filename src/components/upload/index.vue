<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :on-error="handleImageError"
      class="image-uploader"
      :before-upload='beforeUpload'
      :action="action">
      <slot></slot>
    </el-upload>
  </div>
</template>
<script>
import core from '@/core';

export default {
  name: 'SingleImageUpload',
  props: {
    uploadType: {
      type: String,
      default: '2'
    },
    fileFolderId: {
      type: Number,
      default: -1
    },
    index:Number
  },
  data() {
    return {
      action:'',
      dataObj: { 
        uploadType:''
      }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    handleImageSuccess(val) {
      // val.index = this.index;
      let target = {
        data: val.data.url,
        name: val.data.fileName,
        index: this.index
      };
      this.$emit('uploadSuccess', target);
      this.loading.hideLoading();
    },
    handleImageError(){
      this.loading.hideLoading();
    },
    beforeUpload() {
      this.loading.showLoading();
    }
  },
  created(){
      this.action = core.api.static.upload;
      if (location.hostname == 'localhost' && this.action.substring(0, 4) != 'http' && location.port != '9050') {
          this.action = 'https://at.apiunion.com' + this.action;
          // this.action = 'http://localhost:9050' + this.action;
      }
      this.dataObj.uploadType = this.uploadType;
      if(this.fileFolderId != -1){
        this.dataObj.fileFolderId = this.fileFolderId;
      }
  },
  watch:{
    fileFolderId(val){
      if(val != -1){
        this.dataObj.fileFolderId = val;
      }
    }
  }
}
</script>