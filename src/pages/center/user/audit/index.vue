<template>
  <div class="audit">
    <div class="list-wrap">
      <!-- <div class="search-bar">
        <div class="form-wrap">
          <div class="form-name">会员类型</div>
          <select class="form-control"></select>
        </div>
        <button class="btn-fill-main">搜索</button>
      </div> -->
      <table class="table">
         <thead>
            <tr>
              <th class="table-w100">用户名称</th>
              <th class="table-w100">账号</th>
              <th class="table-w160">注册时间</th>
              <th class="table-w100">联系人</th>
              <th class="table-w100">账号类型</th>
              <th class="table-w120">邮箱</th>
              <th class="table-w100">资质</th>
              <th class="table-w160">银行账户信息</th>
              <th class="table-w100">审核状态</th>
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
                  <span>{{item.name}}</span>
                  <span slot="reference">{{item.name}}</span>
                </el-popover>
              </td>
              <td>
                <el-popover class="ellipsis"
                  placement="right"
                  width="260"
                  trigger="hover">
                  <span>{{item.account}}</span>
                  <span slot="reference">{{item.account}}</span>
                </el-popover>
              </td>
              <td>{{item.registerTime}}</td>
              <td>{{item.contact}}</td>
              <td>{{item.accountType}}</td>
              <td>{{item.email}}</td>
              <td>
                <el-popover
                  placement="right"
                  width="260"
                  trigger="hover">
                  <img style="width:100%;height:100%" :src="item.certificatePhoto">
                  <img slot="reference" :src="item.certificatePhoto" />
                </el-popover>
              </td>
              <td>
                <el-popover class="ellipsis"
                  placement="right"
                  width="260"
                  trigger="hover">
                  <span>{{item.bankAccountInfo}}</span>
                  <span slot="reference">{{item.bankAccountInfo}}</span>
                </el-popover>
              </td>
              <td>
                <span v-show="item.auditStatus==0">待审核</span>
                <span v-show="item.auditStatus==2">审核未通过</span>
              </td>
              <td>
                <a class="link" @click="auditItem(item, 1)" v-show="item.auditStatus==0">通过</a>
                <a class="link" @click="auditItem(item, 2)" v-show="item.auditStatus==0">不通过</a>
                <a class="link" @click="delItem(item)">删除</a>
              </td>
            </tr>
          </tbody>
      </table>
      <pagination v-show="total>0" :total="total" :page.sync="listParams.page" :limit.sync="listParams.limit" @pagination="getList()" />
      <noData v-if="total===0"></noData>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/pagination';
import noData from '@/components/noData';
export default {
  components: { Pagination, noData },
  data() {
    return {
      total: 0,
      tableData: [],
      listParams: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.api.staff.auditList(this.listParams).then((res) => {
        this.tableData = res.data.dataList;
        this.total = res.data.total;
      });
    },
    auditItem(item, status) {
      this.$msgbox({
        title: '',
        message: status==1 ? '确定审核通过?' : '确定审核不通过?',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          this.api.staff.auditUser({id: item.id, auditStatus:status}).then((res) => {
            this.$message.success({message: res.message, showClose: true});
            this.getList();
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .audit{
    .table{
      .link{
        margin-right: 10px;
      }
    }
  }
</style>
