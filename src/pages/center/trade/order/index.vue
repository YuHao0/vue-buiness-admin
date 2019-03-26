<template>
  <div class="center-order">
    <div class="tab-bar">
      <div class="tab-item" v-for="item in statusList" :key="item.id" 
      :class="{'active':item.id==listParams.status}" @click="changeStatus(item)"
      >{{item.name}}</div>
    </div>
    <div class="list-wrap">
      <div class="search-bar">
        <div class="search-bar-title">商品属性：</div>
        <button class="btn-fill-main" @click="showSupplierModal=true">选择供应商</button>
        <span class="btn-small" v-for="(item, index) in searchSupplierList" :key="index+'supplier'">
          {{item.supplierName}}
          <a href="javascript:;" @click="removeSearchSupplier(index)">X</a>
        </span>
        <button class="btn-fill-org-main" @click="showBuyerModal=true">选择采购商</button>
        <span class="btn-org-small" v-for="(item, index) in searchBuyerList" :key="index+'buyer'">
          {{item.userName}}
          <a href="javascript:;" @click="removeSearchBuyer(index)">X</a>
        </span>
      </div>
      <div class="search-bar">
        <div class="search-bar-title">其他筛选：</div>
        <div class="form-wrap">
          <div class="form-name">关键字</div>
          <select class="form-control" v-model="listParams.keywordType" :class="{'unset-select':!listParams.keywordType}">
            <option v-for="item in keywordList" :key="item.id" :value="item.id">{{item.name}}</option>
          </select>
          <input type="text" class="form-control" placeholder="请输入关键字" v-model="listParams.keyword">
        </div>
        <div class="form-wrap">
          <div class="form-name">下单时间</div>
          <el-date-picker class="timepicker-control" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择" v-model="listParams.startTime"></el-date-picker>
          <el-date-picker class="timepicker-control" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择" v-model="listParams.endTime"></el-date-picker>
        </div>
        <button class="btn-fill-main" @click="getList(1)">搜索</button>
        <button class="btn-fill-main pull-right" @click="openImportModal()">导入物流信息</button>
        <button class="btn-fill-main pull-right" @click="openExportModal()">导出订单</button>
      </div>
      <table class="table table-text">
         <thead>
           <tr>
             <th class="table-w160">用户下单时间</th>
             <th class="table-w200">订单号</th>
             <th class="table-w100">采购商</th>
             <th class="table-w100" v-show="!userConfig.singleChannel">渠道</th>
             <th class="table-w100">供应商</th>
             <th class="table-w100">商品数</th>
             <th class="table-w120">供货价(￥)</th>
             <th class="table-w120">采购价(￥)</th>
             <th class="table-w120">收货人</th>
             <th class="table-w100">订单状态</th>             
             <th>操作</th>
           </tr>
         </thead>
         <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{item.createTime}}</td>
            <td>
              <a class="link" @click="seekDetail(item)">{{item.orderNum}}</a>
            </td>
            <td>{{item.buyer}}</td>
            <td v-show="!userConfig.singleChannel">{{item.channel}}</td>
            <td class="supplier-color">
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.supplier}}</span>
                <span slot="reference">{{item.supplier}}</span>
              </el-popover>
            </td>
            <td>{{item.itemCount}}</td>
            <td class="price-status">{{item.supplyPrice}}</td>
            <td class="price-status">{{item.purchasePrice}}</td>
            <td>{{item.receiver}}</td>
            <td>
              <span v-show="item.orderStatus==1">待付款</span>
              <span v-show="item.orderStatus==100">待发货</span>
              <span v-show="item.orderStatus==200">待收货</span>
              <span v-show="item.orderStatus==300">已收货</span>
              <span v-show="item.orderStatus==400">订单取消</span>
              <span v-show="item.orderStatus==500">退货退款</span>
              <span v-show="item.orderStatus==600">已驳回</span>
            </td>
            <td>
              <a class="link link-op" v-show="listParams.status==1" @click="refuseOrder(item)">驳回订单</a>
              <a class="link link-op" v-show="listParams.status==1||listParams.status==2" @click="openBackModal(item)">申请退款</a>
              <!-- <a class="link link-op" @click="applyPass(item)">通过审核</a>
              <a class="link link-op" @click="applyRefund(item)">确认退款</a> -->
              <!-- <a class="link link-op" v-show="item.orderStatus==200" @click="confirmReceive(item)">确认收货</a> -->
              <a class="link link-op" v-show="listParams.status==5" @click="applyPass(item)">通过审核</a>
              <!-- <a class="link link-op" v-show="item.orderStatus==500" @click="applyRefund(item)">确认退款</a> -->
              <a class="link link-op" v-show="listParams.status==5" @click="checkRefundDetail(item)">退款详情</a>
            </td>
          </tr>
          </tbody>
      </table>
      <pagination v-show="total>0" :total="total" :page.sync="listParams.page" :limit.sync="listParams.limit" @pagination="getList()" />
      <noData v-if="total===0"></noData>
    </div>
    <el-dialog title="订单导出:" :visible.sync="showExportModal" width="468px">
      <div class="dialog-form export-dialog">
        <el-progress :text-inside="true" :stroke-width="14" :percentage="exportProgress" color="#F06941"></el-progress>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-main" @click="exportOrder()" v-show="!exportKey">开始导出</button>
        <a class="btn-main" @click="downloadOrder()" v-show="exportKey">点击下载</a>
        <button class="btn-fill-grey-main" @click="showExportModal=false">取消</button>
      </span>
    </el-dialog>
    <el-dialog title="物流导入:" :visible.sync="showImportModal" width="815px">
      <div class="dialog-form import-dialog">
        <div class="import-box">
          <multiple-file-uploader 
            :postURL="postUrl" 
            successMessagePath="" errorMessagePath="" 
            @upload-success='successHandler' ref="multipleUpload" 
            :post-data="{'type':importLogRadio}">
          </multiple-file-uploader>
        </div>
        <div class="radio-box">
          <el-radio v-model="importLogRadio" :label="1">
            <span class="radio-item">补充新物流节点</span>
            <span class="tips">在原物流公司及运单后新增物流信息</span>
          </el-radio>
        </div>
        <div class="radio-box">
          <el-radio v-model="importLogRadio" :label="2">
            <span class="radio-item">覆盖原物流信息</span>
            <span class="tips">覆盖原物流公司及运单信息</span>
          </el-radio>
        </div>
        <div class="error-box" v-show="false">
          <p>信息错误，请检查后重新上传全部信息。</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-main" @click="importLogistics()">确认导入</button>
        <button class="btn-fill-grey-main" @click="showImportModal=false">取消</button>
      </span>
    </el-dialog>
    <selectSupplier v-if="showSupplierModal" v-on:dialogSupplier="dialogSupplier" v-on:dialogSupplierCancel="dialogSupplierCancel"></selectSupplier>
    <selectBuyer v-if="showBuyerModal" v-on:dialogBuyer="dialogBuyer" v-on:dialogBuyerCancel="dialogBuyerCancel"></selectBuyer>
    <applyForRefund v-if="showRefundModal" ref="showRefundModal" :refundParams="refundParams" v-on:refund="refund" v-on:cancelRefund="refundCancel"></applyForRefund>
    <refundDetail v-if="showRefundDetail" :refundParams="refundDetailParams" v-on:refundDetail="closeRefundDetail" v-on:cancelRefundDetail="closeRefundDetail"></refundDetail>
  </div>
</template>
<script>
import Pagination from '@/components/pagination';
import noData from '@/components/noData';
import selectSupplier from '@/components/selectSupplier/index.vue';
import selectBuyer from '@/components/selectBuyer/index.vue';
import applyForRefund from '@/components/applyForRefund/index.vue';
import refundDetail from '@/components/refundDetail/index.vue';
import MultipleFileUploader from '@/components/multipleFileUploader/MultipleFileUploader.vue';
export default {
  components: { Pagination, noData, selectSupplier, selectBuyer, MultipleFileUploader, applyForRefund, refundDetail },
  props: {
    msg: String
  },
  data() {
    return {
      showSupplierModal: false,
      showBuyerModal: false,
      showImportModal: false,
      showExportModal: false,
      showRefundModal: false,
      showRefundDetail: false,
      // postUrl: 'https://at.apiunion.com/order/upload_express.do',
      postUrl: '/order/upload_express.do',
      searchSupplierList: [],
      searchBuyerList: [],
      refundParams: {
        userId: '',
        orderNum: ''
      },
      refundDetailParams: {

      },
      listParams:{
        page: 1,
        limit: 10,
        status: 0,
        keywordType: '',
        keyword: '',
        startTime: '',
        endTime: ''
      },
      total: -1,
      statusList:[
        {name:'全部', id: 0},
        {name:'待发货', id: 1},
        {name:'待收货', id: 2},
        {name:'已完成', id: 3},
        {name:'已驳回', id: 4},
        {name:'退货退款', id: 5},
        {name:'异常', id: 6}
      ],
      keywordList: [
        {name: '全部', id: ''},
        {name: '商品ID', id: 1},
        {name: '商品名称', id: 2},
        {name: '收货人姓名', id: 3},
        {name: '订单号', id: 4}
      ],
      tableData: [],
      importLogRadio: 1,
      exportProgress: 0,
      exportKey: ''
    }
  },
  created() {
    this.init();
  },
  methods:{
    init() {
      this.getList();
    },
    openImportModal() {
      this.showImportModal = true;
    },
    openExportModal() {
      this.exportProgress = 0;
      this.exportKey = '';
      this.showExportModal = true;
    },
    getList(page){
      let params = {
        page: this.listParams.page,
        limit: this.listParams.limit,
        status: this.listParams.status
      };
      if(page) {
        params.page = page;
      }
      if(this.listParams.keyword) {
        if(!this.listParams.keywordType) {
          this.$message.info({message:'情选择关键字类型', showClose:true});
          return
        } else {
          params.keywordType = this.listParams.keywordType;
          params.keyword = this.listParams.keyword;
        }
      }
      if(this.listParams.startTime && !this.listParams.endTime) {
        this.$message.info({message:'请输入正确的时间', showClose:true});
        return
      }
      if(!this.listParams.startTime && this.listParams.endTime) {
        this.$message.info({message:'请输入正确的时间', showClose:true});
        return
      }
      if(this.listParams.startTime && this.listParams.endTime) {
        params.startTime = this.listParams.startTime;
        params.endTime = this.listParams.endTime;
      }
      if(this.searchSupplierList.length>0) {
        let ids = [];
        this.searchSupplierList.forEach(item => {
          ids.push(item.id);
        });
        params.supplierIds = ids.join(',');
      }
      if(this.searchBuyerList.length>0) {
        let ids = [];
        this.searchBuyerList.forEach(item => {
          ids.push(item.userId);
        });
        params.userIds = ids.join(',');
      }
      this.api.order.list(params).then((res) => {
        this.tableData = res.data.dataList;
        this.total = res.data.total;
      });
    },
    applyPass(item) {
      this.$msgbox({
        title: '',
        message: '确认通过审核？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          let params = {
            userId: item.userId,
            orderNum: item.orderNum,
            isPass: 1
          };
          this.api.order.applyPass(params).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getList();
          });
        }
      });
    },
    // confirmReceive(item) {
    //   this.$msgbox({
    //     title: '',
    //     message: '确认收到订单所有商品？',
    //     showCancelButton: true,
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(action => {
    //     if(action === 'confirm') {
    //       this.api.order.applyPass(params).then((res) => {
    //         this.$message.success({message:res.message, showClose:true});
    //         this.getList();
    //       });
    //     }
    //   });
    // },
    applyRefund(item) {
      this.$msgbox({
        title: '',
        message: '确认退款？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          let params = {
            userId: item.userId,
            orderRefundId: item.orderRefundId,
            isPass: 1
          };
          this.api.order.applyRefund(params).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getList();
          });
        }
      });
    },
    checkRefundDetail(item) {
      this.refundDetailParams = {
        userId: item.userId,
        orderNum: item.orderNum
      };
      this.showRefundDetail = true;
    },
    closeRefundDetail() {
      this.showRefundDetail = false;
      this.getList();
    },
    changeStatus(item) {
      this.listParams.status = item.id;
      this.getList();
    },
    refuseOrder(item) {
      let user = JSON.parse(localStorage.user);
      this.$msgbox({
        title: '',
        message: '确认驳回？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          let params = {
            userId: item.userId,
            orderNum: item.orderNum,
            operator: user.nickName
          };
          this.api.order.refuse(params).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getList();
          });
        }
      });
    },
    dialogSupplier(res) {
      this.searchSupplierList = res.supplierList;
      this.showSupplierModal = false;
    },
    dialogSupplierCancel() {
      this.showSupplierModal = false;
    },
    removeSearchSupplier(index) {
      this.searchSupplierList.splice(index, 1);
    },
    dialogBuyer(res) {
      this.searchBuyerList = res.buyerList;
      this.showBuyerModal = false;
    },
    dialogBuyerCancel() {
      this.showBuyerModal = false;
    },
    removeSearchBuyer(index) {
      this.searchBuyerList.splice(index, 1);
    },
    seekDetail(item) {
      let path = 'order/detail/'+(item.userId?item.userId:'')+'/'+(item.orderNum?item.orderNum:'')+'/'+(item.orderStatus?item.orderStatus:'')
      window.open(path, '_blank');
    },
    openBackModal(item) {
      this.refundParams.userId = item.userId;
      this.refundParams.orderNum = item.orderNum;
      this.showRefundModal = true;
    },
    refund(res) {
      this.console('refund:', res);
      this.showRefundModal = false;
      this.getList();
    },
    refundCancel() {
      this.showRefundModal = false;
    },

    // upload ----------------
    successHandler(resultMsg) {
      if(resultMsg.success) {
        this.getList();
      }
    },
    importLogistics() {
      this.$refs.multipleUpload.onSubmit();
    },

    // export ----------------
    exportOrder() {
      let params = {
        status: this.copy(this.listParams.status)
      };
      if(this.listParams.keyword) {
        if(!this.listParams.keywordType) {
          this.$message.info({message:'情选择关键字类型', showClose:true});
          return
        } else {
          params.keywordType = this.listParams.keywordType;
          params.keyword = this.listParams.keyword;
        }
      }
      if(this.listParams.keywordType) {
        if(!this.listParams.keyword) {
          this.$message.info({message:'情输入关键字', showClose:true});
          return
        } else {
          params.keywordType = this.listParams.keywordType;
          params.keyword = this.listParams.keyword;
        }
      }
      if(this.listParams.startTime && !this.listParams.endTime) {
        this.$message.info({message:'请输入正确的时间', showClose:true});
        return
      }
      if(!this.listParams.startTime && this.listParams.endTime) {
        this.$message.info({message:'请输入正确的时间', showClose:true});
        return
      }
      if(this.listParams.startTime && this.listParams.endTime) {
        params.startTime = this.listParams.startTime;
        params.endTime = this.listParams.endTime;
      }
      if(this.searchSupplierList.length>0) {
        let ids = [];
        this.searchSupplierList.forEach(item => {
          ids.push(item.id);
        });
        params.supplierIds = ids.join(',');
      }
      if(this.searchBuyerList.length>0) {
        let ids = [];
        this.searchBuyerList.forEach(item => {
          ids.push(item.userId);
        });
        params.userIds = ids.join(',');
      }
      this.exportProgress = 0;
      this.exportKey = '';
      this.api.order.exportOrder(params).then((res) => {
        let key = res.data;
        let exportTimer = setInterval(() => {
          this.api.progress.rate({data: key}).then((res) => {
              if(res.success) {
                  if(res.data.finished) {
                      this.exportProgress = res.data.percent;
                      this.exportKey = key;
                      clearInterval(exportTimer);
                  } else {
                      this.exportProgress = res.data.percent;
                  }
              } else {
                  this.$message.info({message:res.message, showClose:true});
                  this.exportProgress = 0;
                  clearInterval(exportTimer);
              }
          });
        }, 1000);
      });
    },
    downloadOrder() {
      window.open('/common/progress_result.do?data='+this.exportKey, '_blank');
    }
  }
}
</script>
<style lang='scss'>
  .center-order{
    .search-bar{
      button{
        margin-right: 10px;
      }
      .btn-org-small, .btn-small{
        margin-right: 10px;
        a{
          color: #fff;
          padding-left: 5px;
        }
      }
    }
    .form-wrap{
      .el-input__inner{
        width: 160px;
        height: 30px;
      }
      .el-date-editor.el-input{
        width: 160px;
        margin-right: 10px;
      }
      .el-input__icon{
        line-height: 30px;
      }
    }
    .table{
      .link-op{
        margin-right: 10px;
      }
      .supplier-color{
        color: #F06941;
      }
    }
    .el-dialog__body{
      .import-dialog{
        padding: 0;
        .import-box{
          padding: 0 10px;
          .import-btn{
            display: inline-block;
            vertical-align: top;
            height: 30px;
            line-height: 30px;
            color: #F06941;
            border: 1px dashed #F06941;
            padding: 0 6px;
            margin-right: 20px;
            border-radius: 15px;
          }
          .btn-org-small{
            margin: 5px 10px 10px 0;
            .close-btn{
              padding: 0 6px;
            }
          }
        }
        .radio-box{
          padding: 15px 10px 0 10px;
          .radio-item{
            color: #333333;
            font-size: 14px;
            font-weight: bold;
          }
          .tips{
            padding-left: 10px;
            font-size: 14px;
            color: #F06941;
          }
        }
        .error-box{
          margin: 15px 10px 0;
          padding: 10px;
          border: 1px solid $border-color;
          border-radius: 4px;
          p{
            color: #333;
            font-size: 14px;
            line-height: 16px;
            padding-bottom: 8px;
            &:last-child{
              padding-bottom: 0;
            }
          }
        }
        .uploadBox{

        }
      }
      .dialog-back{
        padding: 0;
        .table{
          padding-left: 0;
          .back-goods-img{
            display: inline-block;
            vertical-align: top;
            img{
              max-width: 54px;
              max-height: 54px;
            }
          }
          .back-goods-name{
            display: inline-block;
            vertical-align: top;
            width: 260px;
            margin-left: 10px;
            h2{
              font-size: 14px;
              line-height: 18px;
              height: 36px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            p{
              font-size: 14px;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-top: 5px;
            }
          }
        }
      }
    }
    .el-progress-bar__outer{
      background-color: #f7f7f7;
    }
  }
</style>