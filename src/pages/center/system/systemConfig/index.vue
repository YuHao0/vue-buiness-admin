<template>
  <div class="systemConfig">
    <div class="tab-bar">
      <div class="tab-item" v-for="item in typeList" :key="item.id" :class="{'active':currentType==item.id}" @click="changeType(item.id)">{{item.name}}</div>
    </div>
    <div class="config-content">
      <div class="config-row" v-show="currentType=='sms_account'">
        <span class="config-name">短信运营商</span>
        <select class="form-control" v-model="configData.channel" :disabled="!isEdit">
          <option v-for="item in smsList" :key="item.channel" :value="item.channel">{{item.channelName}}</option>
        </select>
      </div>
      <!-- <div class="config-row" v-show="currentType=='ses_account'">
        <span class="config-name">邮件运营商</span>
        <select class="form-control" v-model="configData.channel" :disabled="!isEdit">
          <option v-for="item in smsList" :key="item.channel" :value="item.channel">{{item.channelName}}</option>
        </select>
      </div> -->
      <div class="config-row">
        <span class="config-name">{{currentType=='service_qq_account'?'QQ':''}}账号</span>
        <input type="text" class="form-control" v-model="configData.account" :disabled="!isEdit" />
      </div>
      <div class="config-row" v-show="!(currentType=='service_qq_account')">
        <span class="config-name">密码</span>
        <input :type="checkPassword?'text':'password'" class="form-control" v-model="configData.password" :disabled="!isEdit" />
        <i class="el-icon-view" :class="{'active':checkPassword}" @click="checkPassword=!checkPassword"></i>
      </div>
      <div class="config-row" v-show="currentType=='sms_account'||currentType=='ses_account'">
        <span class="config-name">签名</span>
        <input type="text" class="form-control" v-model="configData.sign" :disabled="!isEdit" />
      </div>
      <div class="config-row">
        <span class="config-name"></span>
        <button class="btn-main" @click="startEdit()" v-show="!isEdit">编辑</button>
        <button class="btn-main" @click="saveConfig()" v-show="isEdit">保存</button>
        <button class="btn-fill-main" @click="cancelEdit()" v-show="isEdit">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false,
      checkPassword: false,
      currentType: 'sms_account',
      smsList: [],
      typeList: [
        { id: 'sms_account', name: '短信运营商'},
        { id: 'ses_account', name: '邮件运营商'},
        { id: 'service_qq_account', name: 'QQ在线客服'},
        { id: 'service_email_account', name: '客服邮箱'}
      ],
      configData: {}
    }
  },
  created() {
    this.api.common.smsList().then((res) => {
      this.smsList = res.data;
    });
    this.getConfig();
  },
  methods: {
    getConfig() {
      this.api.common.accountConfig({configType: this.currentType}).then((res) => {
        this.configData = res.data || {};
      });
    },
    changeType(type) {
      this.currentType = type;
      this.checkPassword = false;
      this.getConfig();
    },
    startEdit() {
      this.isEdit = true;
    },
    cancelEdit() {
      this.isEdit = false;
      this.checkPassword = false;
      this.getConfig();
    },
    saveConfig() {
      let params = {};
      switch(this.currentType) {
        case 'sms_account':
        case 'ses_account':
          params = {
            configType: this.currentType,
            configContent: {
              channel: this.configData.channel,
              account: this.configData.account,
              password: this.configData.password,
              sign: this.configData.sign,
            }
          }
          break
        case 'service_qq_account':
        case 'service_email_account':
          params = {
            configType: this.currentType,
            configContent: {
              account: this.configData.account,
              password: this.configData.password,
            }
          }
      }
      this.console(this.configData);
      params.configContent = JSON.stringify(params.configContent);
      this.api.common.updateAccountConfig(params).then((res) => {
        this.$message.success({message: res.message, showClose: true});
        this.isEdit = false;
        this.checkPassword = false;
        this.getConfig();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .systemConfig{
    .tab-bar{
      .tab-item{
        padding: 0 10px;
      }
    }
    .config-content{
      background: #fff;
      padding: 15px 15px 0;
      border-radius: 4px;
      .config-row{
        padding-bottom: 15px;
        .config-name{
          display: inline-block;
          vertical-align: top;
          width: 90px;
          line-height: 30px;
          text-align: right;
          padding-right: 10px;
        }
        .config-info{
          display: inline-block;
          vertical-align: top;
          line-height: 30px;
        }
        .form-control{
          width: 200px;
        }
        .btn-main{
          margin-right: 15px;
        }
        .el-icon-view{
          font-size: 18px;
          color: #999;
          margin-left: 10px;
          cursor: pointer;
        }
        .active{
          color: $main-color;
        }
      }
    }
  }
</style>
