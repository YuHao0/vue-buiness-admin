<template>
  <div class="center-purchase-account">
     <div class="list-wrap">
      <div class="search-bar">
        <div class="search-bar-title">会员筛选：</div>
        <div class="form-wrap">
          <div class="form-name">会员类型</div>
          <select class="form-control" v-model="listParams.type" :class="{'unset-select':!listParams.type}">
            <option value="">请选择会员类型</option>
            <option v-for="item in levelList" :key="item.id" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <button class="btn-fill-main" @click="getList()">搜索</button>
        <button class="btn-main pull-right" @click="addShow = true" v-show="false">添加采购商</button>
      </div>
      <table class="table table-text">
         <thead>
           <tr>
             <th class="table-w160">账户名</th>
             <!-- <th class="table-w140">平台来源</th> -->
             <th class="table-w140">手机号</th>
             <th class="table-w180">注册时间</th>
             <th class="table-w140">联系人</th>
             <th>邮箱号</th>
             <th class="table-w100">会员类型</th>          
             <th class="table-w100">账户余额</th>          
             <th class="table-w100">账户状态</th>          
             <th>操作</th>
           </tr>
         </thead>
         <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.userName}}</span>
                <span slot="reference">{{item.userName}}</span>
              </el-popover>
            </td>
            <!-- <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.channel}}</span>
                <span slot="reference">{{item.channel}}</span>
              </el-popover>
            </td> -->
            <td>{{item.userPhone}}</td>
            <td>{{item.registerTime}}</td>
            <td>{{item.contact}}</td>
            <td>{{item.email}}</td>
            <td>
              <span v-show="item.certificateType==1">个人会员</span>
              <span v-show="item.certificateType==2">企业会员</span>
            </td>
            <td>{{item.balance}}</td>
            <td>
              <span v-show="!item.disable">启用</span>
              <span v-show="item.disable">禁用</span>
            </td>
            <td>
              <a class="link" @click="openRechargeModal(item)">充值记录</a>
              <a class="link" v-show="item.disable" @click="setDisable(item, 0)">启用</a>
              <a class="link" v-show="!item.disable" @click="setDisable(item, 1)">禁用</a>
            </td>
          </tr>
          </tbody>
      </table>
      <pagination v-show="total>0" :total="total" :page.sync="listParams.page" :limit.sync="listParams.limit" @pagination="getList()" />
      <noData v-if="total===0"></noData>
    </div>
    <el-dialog title="新增采购商" :visible.sync="addShow" width="450px">
      <div class="dialog-form">
        <div class="form-wrap">
          <div class="form-name">账户名</div>
          <input class="form-control"/>
        </div>
        <div class="form-wrap">
          <div class="form-name">联系人</div>
          <input class="form-control"/>
        </div>
        <div class="form-wrap">
          <div class="form-name">联系方式</div>
          <input class="form-control"/>
        </div>
        <div class="form-wrap">
          <div class="form-name">登录账号</div>
          <input class="form-control"/>
        </div>
        <div class="form-wrap">
          <div class="form-name">登录密码</div>
          <input class="form-control"/>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-org-main" @click="addSupply()">保存</button>
        <button class="btn-fill-grey-main" @click="addShow = false">取消</button>
      </span>
    </el-dialog>
    <el-dialog title="充值流水" :visible.sync="showRecharge" width="880px" class="recharge-dialog">
      <div class="dialog-form">
        <table class="table table-text">
          <thead>
            <tr>
              <th class="table-w180">交易时间</th>
              <th class="table-w220">充值号</th>
              <th>交易类型</th>
              <th>充值金额</th>
              <th>余额</th>
              <th>交易状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in rechargeData" :key="index+'recharge'">
              <td>{{item.createTime}}</td>
              <td>{{item.flowNum}}</td>
              <td>
                <span v-show="item.flowType==1">充值</span>
                <span v-show="item.flowType==2">支付</span>
                <span v-show="item.flowType==3">退款</span>
                <span v-show="item.flowType==4">定金支付</span>
                <span v-show="item.flowType==5">尾款支付</span>
              </td>
              <td class="price">￥{{item.account}}</td>
              <td class="price">￥{{item.balance}}</td>
              <td class="status">
                <span v-show="item.flowStatus==1">付款中</span>
                <span v-show="item.flowStatus==2">已付款</span>
                <span v-show="item.flowStatus==3">已关闭</span>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination v-show="rechargeTotal>0" :total="rechargeTotal" :page.sync="rechargeParams.page" :limit.sync="rechargeParams.limit" @pagination="getRechargeList()" />
        <noData v-if="rechargeTotal===0"></noData>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-main" @click="showRecharge = false">确定</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/pagination';
import noData from '@/components/noData';
export default {
  data() {
    return {
      addShow:false,
      showRecharge: false,
      levelList: [
        { id: 1, name: '个人会员'},
        { id: 2, name: '企业会员'}
      ],
      listParams: {
        page: 1,
        limit: 10,
        type: ''
      },
      total: -1,
      tableData: [],
      rechargeParams: {
        id: '',
        limit: 10,
        page: 1
      },
      rechargeData: [],
      rechargeTotal: 0
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // this.api.staff.levelList({page: 1, limit: 9999}).then((res) => {
      //   this.levelList = res.data.dataList;
      // });
      this.getList();
    },
    getList() {
      let params = this.copy(this.listParams);
      if(!params.type) {
        delete params.type;
      }
      this.api.consumer.user(params).then((res) => {
        this.tableData = res.data.dataList;
        this.total = res.data.total;
      });
    },
    openRechargeModal(item) {
      this.showRecharge = true;
      this.rechargeParams.id = item.userId;
      this.getRechargeList();
    },
    getRechargeList() {
      this.api.staff.recharge(this.rechargeParams).then((res) => {
        this.rechargeData = res.data.dataList;
        this.rechargeTotal = res.data.total;
      });
    },
    setDisable(item, disable) {
      this.$msgbox({
        title: '',
        message: disable ? '确认禁用？' : '确认启用？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          this.api.staff.disableUser({id: item.userId, disable: disable}).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getList();
          });
        }
      });
    }
  },
  components: {
    Pagination,
    noData
  }
}
</script>
<style lang='scss'>
  .center-purchase-account{
    .table{
      .link{
        margin-right: 12px;
      }
    }
    .dialog-form{
      .form-name{
        width: 60px;
        text-align: right;
      }
      .form-control{
        width: 300px;
      }
    }
    .recharge-dialog{
      .el-dialog__body{
        padding: 0;
        .dialog-form{
          padding-left: 0;
          .table{
            border-bottom: 1px solid $border-color;
            thead{
              tr{
                th{
                  border-bottom: 1px solid $border-color;
                  &:first-child{
                    &::before{
                      height: 0;
                    }
                  }
                }
              }
            }
            .price{
              font-weight: bold;
            }
            .status{
              color: $main-color;
            }
          }
        }
      }
      .el-dialog__footer{
        padding: 20px 0;
      }
    }
  }
</style>