<template>
  <div class="center-supply-account">
    <div class="list-wrap">
      <div class="search-bar">
        <!-- <div class="search-bar-title">会员筛选：</div>
        <div class="form-wrap">
          <div class="form-name">会员类型</div>
          <select  class="form-control"></select>
        </div>
        <button class="btn-fill-main">搜索</button> -->
        <button class="btn-main" @click="addSupply()">新增供应商</button>
      </div>
      <table class="table table-text">
         <thead>
           <tr>
             <th class="table-w100">账户ID</th>
             <th class="table-w180">账户名</th>         
             <th class="table-w180" v-show="!userConfig.singleChannel">渠道</th>         
             <th>操作</th>
           </tr>
         </thead>
         <tbody>
          <tr v-for="item in listData" :key="item.id">
            <td>{{item.id}}</td>
            <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.supplierName}}</span>
                <span slot="reference">{{item.supplierName}}</span>
              </el-popover>
            </td>
            <td v-show="!userConfig.singleChannel">
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.channelTypeNames}}</span>
                <span slot="reference">{{item.channelTypeNames}}</span>
              </el-popover>
            </td>
            <td>
              <a class="link" @click="editItem(item)">编辑</a>
              <a class="link" @click="delItem(item)">删除</a>
            </td>
          </tr>
          </tbody>
      </table>
      <pagination v-show="total>0" :total="total" :page.sync="listParams.page" :limit.sync="listParams.limit" @pagination="getList()" />
      <noData v-if="total===0"></noData>
    </div>
    <el-dialog :title="isEdit?'编辑供应商':'新增供应商'" :visible.sync="modalShow" width="470px">
      <div class="dialog-form">
        <div class="form-wrap">
          <div class="form-name">供应商</div>
          <input class="form-control" placeholder="请输入供应商名称" v-model="modalParams.supplierName"/>
        </div>
        <div class="form-wrap" v-show="!userConfig.singleChannel">
          <div class="form-name">渠道选择</div>
          <div class="channel-control">
            <el-checkbox v-for="channel in channelList" :key="channel.channelType" v-model="channel.checked">
              {{channel.channelTypeName}}
            </el-checkbox>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-org-main" @click="saveSupplier()">保存</button>
        <button class="btn-fill-grey-main" @click="modalShow = false">取消</button>
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
      modalShow:false,
      total: -1,
      listData: [],
      isEdit: false,
      channelList: [],
      listParams: {
        page: 1,
        limit: 10
      },
      modalParams: {
        id: '',
        supplierName: '',
        channelType: ''
      }
    }
  },
  created() {
    this.init();
  },
  methods:{
    init() {
      this.api.goods.channel({}).then((res) => {
        this.channelList = res.data;
      });
      this.getList();
    },
    getList() {
      this.api.supplier.list(this.listParams).then((res) => {
        this.listData = res.data.dataList;
        this.total = res.data.total;
      });
    },
    addSupply() {
      this.modalParams = {
        id: '',
        supplierName: ''
      };
      this.channelList.forEach(item => {
        this.$set(item, 'checked', false);
      });
      this.isEdit = false;
      this.modalShow = true;
    },
    editItem(item) {
      this.isEdit = true;
      this.api.supplier.detail({id: item.id}).then((res) => {
        if(res.data.channelTypes && res.data.channelTypes.length>0){
          this.channelList.forEach(channel => {
            this.$set(channel, 'checked', false);
            res.data.channelTypes.forEach(item => {
              if(channel.channelType === item) {
                this.$set(channel, 'checked', true);
              }
            });
          });
        } else {
          this.channelList.forEach(channel => {
            this.$set(channel, 'checked', false);
          });
        }
        this.modalParams = {
          id: item.id,
          supplierName: res.data.supplierName
        };
        this.modalShow = true;
      });
    },
    saveSupplier() {
      let params = this.copy(this.modalParams);
      let api = params.id ? 'edit' : 'add';
      if(!params.id) {
        delete params.id;
      }
      if(!params.supplierName) {
        this.$message.info({message: '请输入供应商名称', showClose: true});
        return
      }
      let channelIds = [];
      this.channelList.forEach(item => {
        if(item.checked) {
          channelIds.push(item.channelType);
        }
      });
      if(!this.userConfig.singleChannel) {
        if(channelIds.length === 0) {
          this.$message.info({message: '请选择渠道', showClose: true});
          return
        }
        params.channelTypes = channelIds.join(',');
      } 
      this.api.supplier[api](params).then((res) => {
        this.$message.success({message:res.message, showClose:true});
        this.modalShow = false;
        this.getList();
      });
    },
    delItem(item) {
      this.$msgbox({
        title: '',
        message: '确认删除？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          this.api.supplier.del({id: item.id}).then((res) => {
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
<style scoped lang='scss'>
  .center-supply-account{
    .table{
      .link{
        margin-right: 10px;
      }
    }
    .dialog-form{
      .form-name{
        width: 60px;
        text-align: right;
        vertical-align: top;
        line-height: 30px;
      }
      .form-control{
        width: 320px;
      }
      .channel-control{
        display: inline-block;
        vertical-align: top;
        width: 320px;
        .el-checkbox{
          line-height: 30px;
          margin-right: 15px;
        }
        .el-checkbox+.el-checkbox{
          margin-left: 0;
        }
      }
    }
  }
</style>