<template>
  <div class="api-login">
    <div class="loginBox">
      <div class="loginContent">
        <div class="loginLogo">
          <img src="~assets/login/loginLogo.png" />
        </div>
        <!-- <h2>SIGN IN</h2> -->
        <h4>欢迎登录商城管理后台</h4>
        <!-- 给item加loginItemFocus为选中样式,加loginItemWarning为警告样式 -->
        <div class="loginItem" :class="{'loginItemFocus':focusName}">
          <div class="form-name">帐号</div>
          <input type="text" v-model="account" @keyup.enter="login"  class="form-control" placeholder="请输入帐号" v-on:focus="focusInput(1)" @blur="blurInput(1)" />
        </div>
        <div class="loginItem" :class="{'loginItemFocus':focusPwd}">
          <div class="form-name">密码</div>
          <input type="password" v-model="password" @keyup.enter="login" class="form-control" placeholder="请输入管理密码" v-on:focus="focusInput(2)" @blur="blurInput(2)" />
        </div>
        <button @click="login" class="loginBtn">
          立即登录
          <img src="~assets/login/btnTriangle.png" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      focusName: false,
      focusPwd: false,
      account:'',
      password:''
    }
  },
  methods: {
    focusInput(type) {
      if(type == 1){
        this.focusName = true;
        this.focusPwd = false;
      }else{
        this.focusName = false;
        this.focusPwd = true;
      }
    },
    blurInput(type) {
      if(type == 1){
        this.focusName = false;
      }else{
        this.focusPwd = false;
      }
    },
    login(){
      this.api.user.login({
        account:this.account,
        password:this.password
      }).then(result=>{
        this.console(result);
        // 获取后台菜单
        localStorage.user = JSON.stringify(result.data);
        this.api.common.menu({}).then((res) => {
          localStorage.menu = JSON.stringify(res.data);
          this.api.common.config({}).then((config) => {
            localStorage.userConfig = JSON.stringify(config.data);
            this.$router.push({ name: res.data[0].menus[0].menus[0].title });
          });
        });
      });
    }
  },
  created() {
    
  }
}
</script>
<style scoped lang='scss'>
  .api-login{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
    background: linear-gradient(to right, $org-color, $main-color);
    display: flex;
    justify-content: center;
    align-items: center;
    .loginBox{
      background: url('~@/assets/login/loginInner.png') no-repeat center;
      width: 850px;
      height: 520px;
      padding-top: 50px;
      .loginContent{
        width: 338px;
        margin-left: 454px;
        .loginLogo{
          width: 100px;
          height: 100px;
          margin: 0 auto;
          img{
            width: 100%;
            height: 100%;
          }
        }
        h2{
          color: #3E5872;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          padding-top: 24px;
        }
        h4{
          color: #66899D;
          font-size: 24px;
          text-align: center;
          padding-top: 10px;
          line-height: 32px;
        }
        .loginItem{
          border-bottom: 1px solid #999999;
          padding-bottom: 5px;
          position: relative;
          margin-top: 36px;
          .form-name{
            color: #66899D;
            font-size: 18px;
          }
          .form-control{
            width: 278px;
            border: none;
            background: transparent;
            padding: 0 12px;
            line-height: 30px;
            font-size: 18px;
            color: #333;
            &::placeholder{
              color: #999999;
            }
          }
          &::after{
            content: '';
            position: absolute;
            top: 10px;
            right: 0;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            background: #999999;
          }
        }
        .loginItemFocus{
          border-bottom: 1px solid #3E5872;
          &::after{
            background: #3E5872;
          }
        }
        .loginItemWarning{
          border-bottom: 1px solid $main-color;
          &::after{
            background: $main-color;
          }
        }
        .loginBtn{
          display: inline-block;
          vertical-align: top;
          width: 240px;
          height: 50px;
          background: #fff;
          border-radius: 50px;
          box-shadow: 0 2px 18px rgba(60, 116, 191, .2);
          text-align: center;
          line-height: 50px;
          font-size: 22px;
          color: #333333;
          margin: 50px 0 0 70px;
          border: none;
          img{
            display: inline-block;
            vertical-align: top;
            margin-top: 19px;
            margin-left: 6px;
          }
        }
      }
    }
  }
</style>
