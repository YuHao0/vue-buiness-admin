<template>
  <div class="order-detail">
    <div class="order-process" v-show="false">
      <div class="process-item process-item-active">
        <p class="process-name">订单生成</p>
        <div class="circle"></div>
        <p class="process-time">2018.10.10 10:10:10</p>
      </div>
      <div class="process-item process-item-active">
        <p class="process-name">供应商确认</p>
        <div class="circle"></div>
        <p class="process-time">2018.10.10 10:10:10</p>
      </div>
      <div class="process-item">
        <p class="process-name">待发货</p>
        <div class="circle"></div>
        <p class="process-time">2018.10.10 10:10:10</p>
      </div>
      <div class="process-item">
        <p class="process-name">已发货</p>
        <div class="circle"></div>
        <p class="process-time">2018.10.10 10:10:10</p>
      </div>
      <div class="process-item">
        <p class="process-name">确认收货</p>
        <div class="circle"></div>
        <p class="process-time">2018.10.10 10:10:10</p>
      </div>
    </div>
    <div class="order-info">
      <h2>订单详情</h2>
      <div class="info">
        <div class="info-item">
          <span class="name">订单号</span><span class="symbol">:</span>
          <span>{{detail.orderInfo.orderNum}}</span>
        </div>
        <div class="info-item">
          <span class="name">订单状态</span><span class="symbol">:</span>
          <span v-show="detail.orderInfo.orderStatus==1">待付款</span>
          <span v-show="detail.orderInfo.orderStatus==100">待发货</span>
          <span v-show="detail.orderInfo.orderStatus==200">待收货</span>
          <span v-show="detail.orderInfo.orderStatus==300">已收货</span>
          <span v-show="detail.orderInfo.orderStatus==400">订单取消</span>
          <span v-show="detail.orderInfo.orderStatus==500">退货退款</span>
          <span v-show="detail.orderInfo.orderStatus==600">订单关闭</span>
        </div>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="name">订单金额</span><span class="symbol">:</span>
          <span class="red-color" v-show="detail.orderInfo.totalAmount || detail.orderInfo.totalAmount===0">¥{{detail.orderInfo.totalAmount}}</span>
        </div>
        <div class="info-item">
          <span class="name">商品金额</span><span class="symbol">:</span>
          <span class="red-color" v-show="detail.orderInfo.itemAmount || detail.orderInfo.itemAmount===0">¥{{detail.orderInfo.itemAmount}}</span>
        </div>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="name">运费金额</span><span class="symbol">:</span>
          <span class="red-color" v-show="detail.orderInfo.expAmount!==0">¥{{detail.orderInfo.expAmount}}</span>
          <span class="red-color" v-show="detail.orderInfo.expAmount===0">无</span>
        </div>
        <div class="info-item">
          <span class="name">优惠抵扣</span><span class="symbol">:</span>
          <span class="red-color" v-show="detail.orderInfo.couponAmount!==0">-¥{{detail.orderInfo.couponAmount}}</span>
          <span class="red-color" v-show="detail.orderInfo.couponAmount===0">无</span>
        </div>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="name">采购商</span><span class="symbol">:</span>
          <span>{{detail.orderInfo.buyer}}</span>
        </div>
        <div class="info-item" v-show="detail.orderInfo.orderStatus==500">
          <span class="name">退货退款</span><span class="symbol">:</span>
          <a class="link" @click="openBackModal()">发起退款</a>
          <a class="detail" @click="openRefundDetailModal()">查看退款详情</a>
          <a class="detail" @click="applyRefund()">确认退款</a>
        </div>
      </div>
      <h2 class="receiver">收货人信息</h2>
      <div class="info">
        <div class="info-item">
          <span class="name">收货人</span><span class="symbol">:</span>
          <span>{{detail.receiverInfo.receiver}}</span>
        </div>
        <div class="info-item">
          <span class="name">手机号</span><span class="symbol">:</span>
          <span>{{detail.receiverInfo.phone}}</span>
        </div>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="name">收货地址</span><span class="symbol">:</span>
          <span>{{detail.receiverInfo.address}}</span>
        </div>
        <div class="info-item">
          <span class="name">身份证号</span><span class="symbol">:</span>
          <span>{{detail.receiverInfo.idCardNum}}</span>
        </div>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="name">备注信息</span><span class="symbol">:</span>
          <span>{{detail.receiverInfo.remark}}</span>
        </div>
      </div>
    </div>
    <div class="order-content">
      <div class="order-inner">
        <h2>商品信息</h2>
        <table class="inner">
          <thead class="table-title">
            <tr>
              <th class="item-info">商品信息</th>
              <th class="table-w100">商品编号</th>
              <th class="table-w100">采购价(¥)</th>
              <th class="table-w100">供应价(¥)</th>
              <th class="table-w100" v-show="!userConfig.singleChannel">渠道</th>
              <th class="table-w100">供应商</th>
              <th class="table-w80">数量</th>
              <th class="table-w100">重量(kg)</th>
              <th class="table-w120">操作</th>
            </tr>
          </thead>
          <tbody class="info-body" v-for="(item, index) in detail.orderItemInfo" :key="index+'item'">
            <tr class="tips-top">
              <td colspan="9">
                <span class="table-tips">包裹号:<span class="tips-value">{{item.pkgNo}}</span></span>
                <span class="check-log pull-right" v-show="item.pkgNo==currentRightLogistics.pkgNo">右侧显示当前物流详情</span>
                <span class="check-log pull-right link" @click="setCurrent(item)" v-show="item.pkgNo!=currentRightLogistics.pkgNo">查看物流详情</span>
              </td>
            </tr>

            <!-- 物流详情随着包裹逐一列出,现改为只显示一个 -->
            <!-- <tr>
              <td colspan="9" class="order-logistics-box">
                <div class="order-logistics">
                  <div class="title">
                    <span>物流详情</span>
                    <div class="pull-right">
                      <a class="btn-main" @click="logisticsModal(item)">添加物流</a>
                      <a class="btn-fill-grey-main" @click="delLogisticsModal(item)">删除物流</a>
                    </div>
                  </div>
                  <div class="logistics-inner" v-show="item.pkgExpressInfos.length>0">
                    <div class="logistics-tab">
                      <span v-for="exp in item.pkgExpressInfos" :key="exp.expressId" 
                        :class="{'active':item.currentLogistics.expressId===exp.expressId}" @click="changeLogTab(item, exp)">
                        {{exp.company}}
                      </span>
                    </div>
                    <div class="logistics-content">
                      <p v-for="(log, log_index) in item.currentLogistics.expressDetail" :key="log_index+'log'">{{log}}</p>
                    </div>
                  </div>
                </div>
              </td>
            </tr> -->

            <tr v-for="(goods, goods_index) in item.pkgItemInfo" :key="goods_index+'goods'">
              <td class="goods-info">
                <el-popover
                  placement="right"
                  width="260"
                  trigger="hover">
                  <img style="width:100%;height:100%" :src="goods.itemImg">
                  <img slot="reference" :src="goods.itemImg" />
                </el-popover>
                <h4 class="item-title">{{goods.itemTitle}}</h4>
                <p>规格:{{goods.spec}}</p>
              </td>
              <td>{{goods.itemNum}}</td>
              <td class="channelPrice">{{goods.channelPrice}}</td>
              <td class="price">{{goods.price}}</td>
              <td v-show="!userConfig.singleChannel">{{goods.channelName}}</td>
              <td>{{goods.supplierName}}</td>
              <td>{{goods.count}}</td>
              <td>{{goods.weight}}</td>
              <td class="text-op-padding">
                <div class="table-op">
                  <p><a class="link splitPkg" @click="splitPkg(item, goods)" v-show="detail.orderInfo.orderStatus==100 || detail.orderInfo.orderStatus==200 || detail.orderInfo.orderStatus==300">拆包</a></p>
                  <p><a class="link resetSupModal" @click="resetSupModal(goods)">更换供应商</a></p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="order-logistics">
        <div class="title">
          <span>物流详情</span>
          <div class="pull-right">
            <a class="btn-main" @click="logisticsModal()" v-show="detail.orderInfo.orderStatus!=600 && detail.orderInfo.orderStatus!=1&&detail.orderInfo.orderStatus!=400">添加物流</a>
            <a class="btn-fill-grey-main" @click="delLogisticsModal()">删除物流</a>
          </div>
        </div>
        <div class="logistics-inner" v-show="currentRightLogistics.pkgExpressInfos.length>0">
          <div class="logistics-tab">
            <span v-for="exp in currentRightLogistics.pkgExpressInfos" :key="exp.expressId" 
              :class="{'active':currentRightLogistics.currentLogistics.expressId===exp.expressId}" @click="changeLogTab(currentRightLogistics, exp)">
              {{exp.company}}
            </span>
          </div>
          <div class="logistics-content">
            <div class="content-title">
              <h5>物流公司：{{currentRightLogistics.currentLogistics.company}}</h5>
              <h5>物流单号：{{currentRightLogistics.currentLogistics.expressNum}}</h5>
            </div>
            <p v-for="(log, log_index) in currentRightLogistics.currentLogistics.expressDetail" :key="log_index+'log'">{{log}}</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="添加物流:" :visible.sync="showLogisticsModal" width="468px">
      <div class="dialog-form border-bottom">
        <div class="search-item">
          <span class="title">物流公司：</span>
          <select class="form-control" v-model="addLogisticsParams.expressCompany" :class="{'unset-select':!addLogisticsParams.expressCompany}">
            <option value="">请选择物流公司</option>
            <option v-for="item in expCompany" :key="item.id" :value="item.id">{{item.name}}</option>
          </select>
        </div>
      </div>
      <div class="dialog-form">
        <div class="search-item">
          <span class="title">物流单号：</span>
          <input type="text" class="form-control" placeholder="请输入物流单号" v-model="addLogisticsParams.expressNum" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-main" @click="saveLogistics()">保存</button>
        <button class="btn-fill-grey-main" @click="showLogisticsModal=false">取消</button>
      </span>
    </el-dialog>
    <el-dialog title="删除物流:" :visible.sync="showDelLogisticsModal" width="468px">
      <div class="dialog-form">
        <h3>物流信息确认删除后无法找回，请确认是否删除本段物流信息</h3>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-main" @click="delLogistics()">删除</button>
        <button class="btn-fill-grey-main" @click="showDelLogisticsModal=false">取消</button>
      </span>
    </el-dialog>
    <el-dialog title="拆分包裹:" :visible.sync="showSplitModal" width="468px">
      <div class="dialog-form split-dialog">
        <div class="search-item">
          <span class="title">商品名称：</span>
          <span class="goods-name">{{splitDisplay.goodsName}}</span>
        </div>
        <div class="search-item">
          <span class="title">拆分包裹：</span>
          <select class="form-control" v-model="splitParams.pkgNo">
            <option value="">新建包裹</option>
            <option v-for="item in splitDisplay.splitList" :key="item" :value="item">{{item}}</option>
          </select>
        </div>
        <div class="search-item">
          <span class="title">拆分数量：</span>
          <input type="number" class="form-control" v-model="splitParams.num" :placeholder="'最多不超过'+splitDisplay.limit+'件'" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-main" @click="splitPacket()">保存</button>
        <button class="btn-fill-grey-main" @click="showSplitModal=false">取消</button>
      </span>
    </el-dialog>
    <el-dialog title="更换供应商:" :visible.sync="showResetSupModal" width="910px">
      <div class="dialog-form reset-sup">
        <table class="table">
          <thead>
            <tr>
              <th class="table-w340">商品</th>
              <th class="table-w60">数量</th>
              <th class="table-w180">原供应商</th>
              <th class="table-w180">新供应商</th>
              <th>拆分新包裹</th>
            </tr>
          </thead>
          <tbody>
            <td>
              <div class="back-goods-img">
                <img :src="resetSupData.itemImg" />
              </div>
              <div class="back-goods-name">
                <h2>{{resetSupData.itemTitle}}</h2>
                <p>规格:{{resetSupData.spec}}</p>
              </div>
            </td>
            <td>{{resetSupData.count}}</td>
            <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{resetSupData.supplierName}}</span>
                <span slot="reference">{{resetSupData.supplierName}}</span>
              </el-popover>
            </td>
            <td>
              <select class="form-control" v-show="resetSupData.supplierList && resetSupData.supplierList.length>0" v-model="resetSupData.supplierId">
                <option v-for="sup in resetSupData.supplierList" :key="sup.id" :value="sup.id">{{sup.name}}</option>
              </select>
              <span v-show="!resetSupData.supplierList || resetSupData.supplierList.length==0">暂无可以更换的供应商</span>
            </td>
            <td>
              <el-radio v-model="resetSupData.needSplit" :label="1">是</el-radio>
              <el-radio v-model="resetSupData.needSplit" :label="0">否</el-radio>
            </td>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-main" @click="resetSup()">确认</button>
        <button class="btn-fill-grey-main" @click="showResetSupModal=false">取消</button>
      </span>
    </el-dialog>
    <applyForRefund v-if="showRefundModal" ref="showRefundModal" :refundParams="refundParams" v-on:refund="refund" v-on:cancelRefund="refundCancel"></applyForRefund>
    <refundDetail v-if="showRefundDetailModal" :refundParams="refundDetailParams" v-on:refundDetail="closeRefundDetail" v-on:cancelRefundDetail="closeRefundDetail"></refundDetail>
  </div>
</template>

<script>
import applyForRefund from '@/components/applyForRefund/index.vue';
import refundDetail from '@/components/refundDetail/index.vue';
export default {
  components: { applyForRefund, refundDetail },
  data() {
    return {
      logisticsTab: '',
      showLogisticsModal: false,
      showDelLogisticsModal: false,
      showSplitModal: false,
      showResetSupModal: false,
      showRefundModal: false,
      showRefundDetailModal: false,
      resetSupData: {},
      expCompany: [],
      refundParams: {},
      refundDetailParams: {},
      currentRightLogistics: {
        pkgExpressInfos: [],
        currentLogistics: {
          expressDetail: []
        }
      },
      params: {
        userId: '',
        orderNum: '',
        orderStatus: ''
      },
      detail: {
        orderInfo: {},
        orderItemInfo: [],
        receiverInfo: {}
      },
      addLogisticsParams: {
        expressCompany: '',
        expressNum: ''
      },
      delLogisticsParams: {},
      splitParams: {},
      splitDisplay: {
        id: '',
        limit: 0,
        goodsName: '',
        splitList: []
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.params.userId = this.$route.params.userId || '';
      this.params.orderNum = this.$route.params.orderNum || '';
      this.params.orderStatus = this.$route.params.orderStatus || '';
      // 获取所有物流公司
      this.api.common.expressCompany({}).then((res) => {
        this.expCompany = res.data;
      });
      this.getDetail();
    },
    getDetail() {
      this.api.order.detail(this.params).then((res) => {
        this.detail = res.data;
        if(res.data.orderItemInfo) {
          this.currentRightLogistics = res.data.orderItemInfo[0];
        }
        this.detail.orderItemInfo.forEach(item => {
          if(item.pkgExpressInfos && item.pkgExpressInfos.length>0) {
            this.$set(item, 'currentLogistics', item.pkgExpressInfos[0]);
          } else {
            this.$set(item, 'currentLogistics', {});
          }
        });
      });
    },
    changeLogTab(item, exp) {
      item.currentLogistics = exp;
    },
    openBackModal() {
      this.refundParams.userId = this.params.userId,
      this.refundParams.orderNum = this.params.orderNum,
      this.showRefundModal = true;
    },
    openRefundDetailModal() {
      this.refundDetailParams = {
        userId: this.params.userId,
        orderNum: this.params.orderNum
      };
      this.showRefundDetailModal = true;
    },
    applyRefund() {
      this.$msgbox({
        title: '',
        message: '确认退款？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          let params = {
            userId: this.params.userId,
            orderRefundId: this.detail.orderInfo.orderRefundId,
            isPass: 1
          };
          this.api.order.applyRefund(params).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getList();
          });
        }
      });
    },
    refund(res) {
      this.console('refund:', res);
      this.showRefundModal = false;
    },
    refundCancel() {
      this.showRefundModal = false;
    },
    refundDetail() {
      this.showRefundDetailModal = false;
    },
    refundDetailCancel() {
      this.showRefundDetailModal = false;
    },
    setCurrent(item) {
      this.currentRightLogistics = item;
    },
    logisticsModal() {
      this.addLogisticsParams = {
        userId: this.params.userId,
        orderNum: this.params.orderNum,
        pkgNo: this.currentRightLogistics.pkgNo,
        expressCompany: '',
        expressNum: ''
      };
      if(!this.currentRightLogistics.pkgExpressInfos || this.currentRightLogistics.pkgExpressInfos.length===0) {
        this.addLogisticsParams.type = 1;
        this.addLogisticsParams.parentId = 0;
      } else {
        this.addLogisticsParams.type = this.currentRightLogistics.pkgExpressInfos.length + 1;
        this.addLogisticsParams.parentId = this.currentRightLogistics.pkgExpressInfos[this.currentRightLogistics.pkgExpressInfos.length - 1].expressId;
      }
      this.showLogisticsModal = true;
    },
    saveLogistics() {
      this.api.order.addExp(this.addLogisticsParams).then((res) => {
        this.$message.success({message: res.message, showClose:true});
        this.showLogisticsModal = false;
        this.getDetail();
      });
    },
    delLogisticsModal() {
      if(!this.currentRightLogistics.currentLogistics) {
        this.$message.info({message:'没有可以删除的物流', showClose:true});
        return
      }
      this.delLogisticsParams = {
        id: this.currentRightLogistics.currentLogistics.expressId,
        userId: this.params.userId
      };
      this.showDelLogisticsModal = true;
    },
    delLogistics() {
      this.api.order.delExp(this.delLogisticsParams).then((res) => {
        this.$message.success({message: res.message, showClose:true});
        this.showDelLogisticsModal = false;
        this.getDetail();
      });
    },
    splitPkg(item, goods) {
      this.showSplitModal = true;
      let splitList = [];
      this.splitDisplay.id = goods.orderItemId;
      this.splitDisplay.limit = goods.count;
      this.splitDisplay.goodsName = goods.itemTitle;
      this.detail.orderItemInfo.forEach(i => {
        splitList.push(i.pkgNo);
      });
      this.splitDisplay.splitList = splitList;
      this.splitParams.pkgNo = '';
      this.splitParams.num = '';
    },
    resetSupModal(item) {
      this.resetSupData = item;
      if(!this.resetSupData.needSplit) {
        this.$set(this.resetSupData, 'needSplit', 0);
      }
      this.showResetSupModal = true;
    },
    resetSup() {
      let supplierName = '';
      this.resetSupData.supplierList.forEach((item) => {
        if(item.id === this.resetSupData.supplierId) {
          supplierName = item.name;
        }
      });
      let params = {
        userId: this.params.userId,
        supplierId: this.resetSupData.supplierId,
        supplierName: supplierName,
        orderItemId: this.resetSupData.orderItemId,
        needSplit: this.resetSupData.needSplit
      };
      this.api.order.changeSupplier(params).then((res) => {
        this.$message.success({message: res.message, showClose:true});
        this.showResetSupModal = false;
        this.getDetail();
      });
    },
    splitPacket() {
      let params = {
        id: this.splitDisplay.id,
        pkgNo: this.splitParams.pkgNo,
        num: this.splitParams.num,
        orderUserId: this.params.userId,
        orderNum: this.params.orderNum
      };
      if(params.num > this.splitDisplay.limit) {
        this.$message.info('拆包数量不能超过该商品数');
        return
      }
      this.api.order.split(params).then((res) => {
        this.$message.success({message: res.message, showClose: false});
        this.showSplitModal = false;
        this.getDetail();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail{
  .order-process{
    margin-left: -54px;
    padding-bottom: 22px;
    .process-item{
      display: inline-block;
      vertical-align: top;
      width: 220px;
      text-align: center;
      position: relative;
      .process-name{
        color: #333333;
        font-size: 14px;
        padding-bottom: 14px;
      }
      .circle{
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 14px;
        border: 4px solid #CCCCCC;
        margin-left: 104px;
      }
      .process-time{
        color: #666666;
        font-size: 12px;
        padding-top: 10px;
      }
      &::after{
        content: '';
        position: absolute;
        width: 175px;
        height: 1px;
        background: #ccc;
        right: -88px;
        top: 35px;
      }
      &:last-child{
        &::after{
        content: '';
        width: 0;
        height: 0;
      }
      }
    }
    .process-item-active{
      .circle{
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 14px;
        border: 4px solid #70D008;
        margin-left: 104px;
      }
      &::after{
        background: #70D008;
      }
    }
  }
  .order-info{
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    h2{
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 15px;
    }
    .receiver{
      padding-top: 10px;
      padding-bottom: 15px;
    }
    .info{
      .info-item{
        white-space: normal;
        word-break: break-all;
        padding-bottom: 10px;
        display: inline-block;
        vertical-align: top;
        width: 450px;
        span{
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
          color: #333333;
          line-height: 24px;
        }
        .link{
          font-size: 12px;
          display: inline-block;
          vertical-align: top;
          width: 60px;
          height: 24px;
          text-align: center;
          line-height: 22px;
          border: 1px solid $main-color;
          color: $main-color;
          border-radius: 4px;
        }
        .detail{
          font-size: 12px;
          display: inline-block;
          vertical-align: top;
          width: 86px;
          height: 24px;
          text-align: center;
          line-height: 22px;
          border: 1px solid #DDD;
          color: #666;
          border-radius: 4px;
          margin-left: 10px;
          cursor: pointer;
        }
        .name{
          width: 60px;
          text-align-last: justify;
        }
        .symbol{
          padding: 0 8px 0 2px;
        }
        .red-color{
          color: $main-color;
        }
        &:last-child{
          padding-bottom: 0;
        }
      }
    }
  }
  .order-content{
    position: relative;
    .order-inner{
      margin-top: 10px;
      background: #fff;
      width: calc(100% - 400px);
      border-radius: 4px;
      h2{
        color: #333333;
        font-size: 14px;
        padding: 14px 16px;
        border-bottom: 1px solid $border-color;
        font-weight: bold;
      }
      .inner{
        width: 100%;
        tbody{
          tr{
            border-bottom: 1px solid $border-color;
          }
          .tips-top{
            background: #F5F5F5;
            border: none;
            .check-log{
              line-height: 44px;
              margin-right: 20px;
            }
          }
          .table-tips{
            font-size: 14px;
            color: #333333;
            line-height: 44px;
            font-weight: bold;
            margin-right: 80px;
            .tips-value{
              color: $main-color;
              font-weight: bold;
              padding-left: 10px;
            }
            a{
              padding-left: 20px;
              color: #5672DC;
            }
          }
        }
        th{
          line-height: 50px;
        }
        .item-info{
          min-width: 360px;
        }
        .table-w60{
          width: 60px;
        }
        .table-w80{
          width: 80px;
        }
        .table-w100{
          width: 100px;
        }
        .table-w120{
          width: 120px;
        }
        
        th, td{
          text-align: left;
          min-height: 50px;
          padding-left: 20px;
        }
        .channelPrice{
          font-weight: 500;
        }
        .price{
          color: $main-color;
          font-weight: 500;
        }
        .text-op-padding{
          position: relative;
          .table-op{
            position: absolute;
            top: 15px;
            left: 0;
            p{
              margin-bottom: 25px;
            }
            .splitPkg{
              font-size: 14px;
              display: inline-block;
              vertical-align: top;
              width: 56px;
              height: 30px;
              text-align: center;
              line-height: 28px;
              border: 1px solid $main-color;
              color: $main-color;
              border-radius: 4px;
              margin-left: 12px;
            }
            .resetSupModal{
              font-size: 14px;
              display: inline-block;
              vertical-align: top;
              width: 86px;
              height: 30px;
              text-align: center;
              line-height: 28px;
              border: 1px solid #DDDDDD;
              color: #666666;
              border-radius: 4px;
            }
          }
        }
        .goods-info{
          position: relative;
          padding: 20px 0 20px 130px;
          img{
            position: absolute;
            left: 20px;
            top: 20px;
            border-radius: 4px;
            border: 1px solid $border-color;
            max-height: 80px;
            max-width: 80px;
          }
          .item-title{
            vertical-align: top;
            font-size: 14px;
            color: #333333;
            height: 40px;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          p{
            font-size: 14px;
            color: #666666;
            line-height: 14px;
            padding: 20px 0;
            line-height: 20px;
            height: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
        .info-body{
          tr{
            
          }
        }
      }
    }
    .order-logistics{
      position: absolute;
      width: 390px;
      right: 0;
      top: 0;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
      .title{
        height: 52px;
        padding: 12px 20px;
        border-bottom: 1px solid $border-color;
        span{
          color: #333;
          line-height: 28px;
          font-weight: bold;
        }
        .btn-main{
          margin-right: 10px;
        }
      }
      .logistics-inner{
        padding: 10px;
        .logistics-tab{
          span{
            display: inline-block;
            vertical-align: top;
            height: 32px;
            line-height: 32px;
            padding: 0 20px;
            border-left: 1px solid #DDDDDD;
            border-top: 1px solid #DDDDDD;
            margin-bottom: -1px;
            cursor: pointer;
            &:last-child{
              border-right: 1px solid #DDDDDD;
            }
          }
          .active{
            background: #F5F8FC;
            border-bottom: 1px solid #F5F8FC;
          }
        }
        .logistics-content{
          background: #F5F8FC;
          border: 1px solid #DDDDDD;
          padding: 0 20px 10px;
          .content-title{
            padding-bottom: 10px;
            border-bottom: 1px solid #DDDDDD;
            h5{
              color: #333333;
              font-weight: bold;
              font-size: 14px;
              padding-top: 10px;
            }
          }
          p{
            color: #333333;
            font-size: 14px;
            line-height: 20px;
            padding-top: 10px;
          }
        }
      }
    }
  }
  .dialog-form{
    padding: 0;
    .search-item{
      padding-left: 20px;
      .form-control{
        width: 300px;
      }
    }
    h3{
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      padding: 0 20px;
    }
  }
  .border-bottom{
    padding-bottom: 15px;
  }
  .split-dialog{
    .search-item{
      padding-top: 15px;
      .goods-name{
        line-height: 30px;
      }
    }
  }
  .reset-sup{
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
      .el-radio+.el-radio{
        margin-left: 15px;
      }
    }
  }
}
</style>
