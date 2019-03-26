<template>
  <div class="api-center">
      <div class="top-nav">
        <div class="nav-left pull-left">
          <!-- <router-link :to="{ name: '登录'}" class="name">接口联盟</router-link>
          <div class="inline-block">供应链管理</div> -->
          <router-link :to="{ name: '登录'}">
            <img src="~/assets/login/admin-logo.png" class="logoImg">
          </router-link>
        </div>
        <div class="nav-list">
          <router-link v-for="(item,index) in nav.groups" :key="index" class="nav-item" 
            :class="{active:item.groupName == current.meta.parent.name}"
            :to="{ path: item.list[0].children[0].routePath}" v-show="item.hasAuth">
            {{item.groupName}}
          </router-link>
          <div class="login-info">
            <img class="user-photo" src="https://via.placeholder.com/40x40" />
            <el-popover
              placement="bottom"
              trigger="hover">
              <a class="link" style="display: block;text-align: center;" @click="openResetModal()">修改密码</a>
              <span slot="reference" class="name">{{user.nickName}}</span>
            </el-popover>
            <a href="javascript:;" class="power">{{user.roleName}}</a>
            <a href="javascript:;" class="logout" @click="logout">退出</a>
          </div>
        </div>
      </div>
      <div class="side-nav" :class="{'side-nav-retract':!isOpen}">
        <div v-for="(item,index) in slide" :key="index" class="side-item" v-show="item.hasAuth"
          :class="{active:item.open,'router-active':current.meta.group.name == item.title}">
          <div class="side-parent" @click="openSide(item)">
            <div class="dot inline-block"></div>
            <div class="inline-block">{{item.title}}</div>
            <svg class="icon pull-right" aria-hidden="true">
              <use xlink:href="#icon-arrow-solid-right"></use>
            </svg>
          </div>
          <div class="child-wrap">
            <router-link class="child-item" v-for="(child,index) in item.children" 
              :key="index" :to="{ path: child.routePath}" v-show="child.hasAuth">
              <span>{{child.title}}</span>
              <div class="dot"></div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="toggle-nav" :class="{'toggle-nav-retract':!isOpen}" @click="toggleNav">
        <!-- <img src="~/assets/retract.png" alt="缩起" v-show="isOpen" />
        <img src="~/assets/open.png" alt="展开" v-show="!isOpen" /> -->
        <span class="toggle-text" v-show="isOpen">缩起<i>&lt;</i></span>
        <span class="toggle-text" v-show="!isOpen">展开<i>&gt;</i></span>
      </div>
      <div class="current-route" :class="{'current-route-retract':!isOpen}" v-if="!current.meta.hideBreadNav">
        <div class="current-0 inline-block">{{current.meta.group.name}}</div> 
        <svg class="icon inline-block" aria-hidden="true">
            <use xlink:href="#icon-arrow-solid-right"></use>
        </svg>
        <div class="current-1 inline-block">{{current.name}}</div> 
      </div>
      <router-view class="center-view" :class="{'center-view-retract':!isOpen}"></router-view>

      <el-dialog title="更改密码" :visible.sync="showResetModal" width="450px">
        <div class="dialog-form">
          <div class="form-wrap">
            <div class="form-name">原密码</div>
            <input type="password" class="form-control" v-model="resetParams.originalPassword"/>
          </div>
          <div class="form-wrap">
            <div class="form-name">新密码</div>
            <input type="password" class="form-control" v-model="resetParams.newPassword"/>
          </div>
          <div class="form-wrap">
            <div class="form-name">确认密码</div>
            <input type="password" class="form-control" v-model="resetParams.confirmPassword"/>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <button class="btn-main" @click="saveReset()">保存</button>
          <button class="btn-fill-grey-main" @click="showResetModal = false">取消</button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import nav from '@/router/nav.config.json';
export default {
  props: {
    msg: String
  },
  data() {
    return {
      isOpen: true,
      showResetModal: false,
      resetParams: {
        originalPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      nav:[],
      slide:[],
      current:{},
      user:{}
    }
  },
  watch: {
    '$route' (to,from) {
      this.current = to;
      this.slide = this.nav.groups[this.current.meta.parent.index].list;
      if(to.meta.parent.name != from.meta.parent.name){
        this.slide[this.current.meta.group.index].open = true;
      }
    }
  },
  methods: {
    goRouter(name){
      this.$router.push({name:name});
    },
    openSide(item){
      item.open = !item.open;
    },
    toggleNav() {
      this.isOpen = !this.isOpen;
    },
    openResetModal() {
      this.resetParams = {
        originalPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.showResetModal = true;
    },
    saveReset() {
      if(this.resetParams.newPassword !== this.resetParams.confirmPassword) {
        this.$message.info({message:'两次输入的密码不一致', showClose:true});
      } else {
        this.api.staff.resetPassword(this.resetParams).then((res) => {
          this.$message.success({message:res.message, showClose:true});
          this.showResetModal = false;
        });
      }
    },
    logout() {
      this.$msgbox({
        title: '',
        message: '确认退出？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          this.api.common.logout({}).then(() => {
            delete localStorage.user;
            delete localStorage.firstMune;
            delete localStorage.menu;
            window.location.href = '/';
          });
        }
      });
    }
  },
  created() {
    var centerNav = nav[2];
    centerNav.groups.forEach((group) => {
      group.list.forEach((groupChild) => {
        groupChild.open = true;
      });
    });
    if(!localStorage.menu) {
      window.location.href = '/';
    }
    let topMenu = JSON.parse(localStorage.menu);
    topMenu.forEach(nav_1 => {
      centerNav.groups.forEach(item_1 => {
        if(nav_1.title === item_1.groupName) {
          item_1.hasAuth = true;
          nav_1.menus.forEach(nav_2 => {
            item_1.list.forEach(item_2 => {
              if(item_2.title === nav_2.title) {
                item_2.hasAuth = true;
                nav_2.menus.forEach(nav_3 => {
                  item_2.children.forEach(item_3 => {
                    if(item_3.title === nav_3.title) {
                      item_3.hasAuth = true;
                    }
                  });
                });
              }
            });
          });
        }
      });
    });
    this.nav = centerNav;
    this.current = this.$route;
    this.slide = this.nav.groups[this.current.meta.parent.index].list;
    this.slide[this.current.meta.group.index].open = true;
    this.user = JSON.parse(localStorage.user);
  }
}
</script>
<style scoped lang='scss'>
  .api-center{
    padding-top: 50px;
    .top-nav{
      position: fixed;
      left: 0;
      top: 0;
      height: 50px;
      width: 100%;
      min-width: 1440px;
      background: $main-color;
      color:#fff;
      font-size: 0;
      text-align: center;
      z-index: 500;
      .nav-left{
        display: inline-block;
        padding-top: 14px;
        width: 190px;
        height: 40px;
        font-size: 14px;
        .name{
          display: inline-block;
          margin-right: 14px;
          padding: 8px 12px;
          background: #fff;
          border-radius: 15px;
          color:$main-color;
          font-weight: 600;
          cursor: pointer;
        }
        .inline-block{
          font-weight: 600;
        }
        .logoImg{
          display: inline-block;
          vertical-align: top;
        }
      }
      .nav-list{
        display: flex;
        height: 50px;
        align-items: center;
        font-size: 14px;
        position: relative;
        .nav-item{
          line-height: 50px;
          // width: 115px;
          width: 94px;
          color:#fff;
          font-weight: 600;
          &.active{
            background: #fff;
            color:$main-color;
            border-bottom: 2px solid $main-color;
            position: relative;
            &::after{
              content: " ";
              display: block;
              width: 0;
              height: 0;
              position: absolute;
              bottom: 0;
              left: 50%;
              margin-left: -7.5px;
              border-left: 7.5px solid transparent;
              border-right: 7.5px solid transparent;
              border-bottom: 6px solid $main-color;
            }
          }
        }
        .login-info{
          position: absolute;
          top: 5px;
          right: 0;
          height: 40px;
          padding-right: 20px;
          .user-photo{
            display: inline-block;
            vertical-align: top;
            width: 30px;
            height: 30px;
            border-radius: 30px;
            margin-top: 5px;
          }
          span, a{
            display: inline-block;
            vertical-align: top;
            color: #fff;
            font-size: 14px;
            line-height: 40px;
          }
          .name{
            margin-left: 10px;
            margin-right: 10px;
          }
          .power{
            padding-left: 10px;
            margin-right: 60px;
            position: relative;
            cursor: default;
            &::before{
              content: '';
              position: absolute;
              left: 0;
              top: 13px;
              width: 1px;
              height: 14px;
              background: #fff;
            }
          }
          .logout{
            width: 60px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 14px;
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 4px;
            margin-top: 5px;
          }
        }
      }
    }
    .toggle-nav{
      position: fixed;
      left: 160px;
      top: calc(50% - 60px);
      cursor: pointer;
      width: 18px;
      height: 100px;
      background: url('~assets/openBg.png') no-repeat left top;
      .toggle-text{
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        line-height: 20px;
        color: #fff;
        margin-top: 22px;
        padding-left: 2px;
        i{
          display: inline-block;
          vertical-align: top;
          font-size: 16px;
          color: #fff;
          font-family: -webkit-pictograph;
          padding-left: 2px;
        }
      }
    }
    .toggle-nav-retract{
      left: 0;
    }
    .side-nav{
      padding: 20px 10px 20px 15px;
      width: 160px;
      position: fixed;
      top: 50px;
      left: 0;
      bottom: 0;
      box-shadow: 0 0 1px 0 $border-color;
      background: #fff;
      z-index: 100;
      overflow: auto;
      .side-item{
        margin-bottom: 40px;
        .side-parent{
          cursor: pointer;
          font-size: 16px;
          .dot{
            margin-right: 15px;
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background:#ddd;
          }
          .icon{
            margin-top: 2px;
            font-size: 8px;
            color:#ddd;
            transition: transform 0.3s;
          }
        }
        .child-wrap{
          max-height: 0;
          overflow: hidden;
          .child-item{
            display: block;
            margin: 20px 0 20px 27px;
            color:#666;
            .dot{
              display: none;
              margin-top: 3px;
              float: right;
              width: 8px;
              height: 8px;
              border-radius: 4px;
              background:$org-color;
            }
          }
        }
        &.router-active{
          .side-parent{
            .dot{
              background:$main-color;
            }
            .icon{
              color:$main-color;
            }
          }
          .router-link-active{
            color:$org-color;
            .dot{
              display: block;
            }
          }
        }
        &.active{
          border-bottom: 1px solid $border-color;
          .side-parent{
            .icon{
              transform: rotate(90deg);
            }
          }
          .child-wrap{
            transition: max-height 1s;
            max-height: 2000px;
          }
        }
      }
    }
    .side-nav-retract{
      left: -160px;
    }
    .current-route{
      margin: 15px 20px 0 180px;
      .current-0{
        font-weight: 600;
        line-height: 20px;
        padding-right: 10px;
      }
      .icon{
        margin: 1px 0 0 2px;
        vertical-align: top;
        font-size: 16px;
        color:#999;
        transform: scale(0.5);
      }
      .current-1{
        font-weight: 600;
        line-height: 20px;
        padding-left: 5px;
      }
    }
    .current-route-retract{
      margin-left: 20px;
    }
    .dialog-form{
      .form-wrap{
        .form-name{
          width: 70px;
          text-align: left;
        }
        .form-control{
          width: 290px;
        }
      }
    }
  }
  .center-view{
    min-width: 1300px;
    width: calc(100% - 200px);
    // background: #fff;
    min-height: 500px;
    margin: 15px 20px 50px 180px;
  }
  .center-view-retract{
    margin-left: 20px;
    width: calc(100% - 40px);
  }
</style>