<template>
  <div class="center-brand">
      <div class="search-bar">
        <div class="search-bar-title">品牌英文名筛选：</div>
        <div class="letter-wrap">
          <div v-for="item in letter" :key='item' class="letter-item" 
            :class="{active:item==currentLetter}" @click="selectLetter(item)">
            {{item}}
          </div>
        </div>
        <div class="form-wrap">
          <div class="form-name">品牌筛选：</div>
          <input type="text" class="form-control" placeholder="请输入品牌名称" v-model="listParams.name">
        </div>
        <div class="btn-fill-main" @click="getList()">搜索</div>
        <div class="btn-main pull-right" @click="editDetail()">新增品牌</div>
      </div>
      <table class="table table-text">
         <thead>
           <tr>
             <th class="table-w100">品牌ID</th>
             <th class="table-w180">品牌中文名</th>
             <th class="table-w180">品牌英文名</th>
             <th class="table-w100">上架商品</th>
             <th class="table-w100">下架商品</th>
             <th class="table-w180">备注</th>
             <th class="table-w80">状态</th>
             <th>操作</th>
           </tr>
         </thead>
         <tbody>
          <tr v-for="(item, index) in listData" :key="index+'list'">
            <td>{{item.id}}</td>
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
                <span>{{item.originalName}}</span>
                <span slot="reference">{{item.originalName}}</span>
              </el-popover>
            </td>
            <td>{{item.onShelfNum}}</td>
            <td>{{item.offShelfNum}}</td>
            <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.desc}}</span>
                <span slot="reference">{{item.desc}}</span>
              </el-popover>
            </td>
            <td>
              <span class="active-status" v-show="item.status">启用</span>
              <span class="disable-status" v-show="!item.status">禁用</span>
            </td>
            <td>
              <a class="link" @click="editDetail(item)">编辑</a>
              <a class="link" @click="removeItem(item)">删除</a>
              <a class="link" @click="setStatus(item, 1)" v-show="!item.status">启用</a>
              <a class="link" @click="setStatus(item, 0)" v-show="item.status">禁用</a>
            </td>
          </tr>
          </tbody>
      </table>
      <pagination v-show="total>0" :total="total" :page.sync="listParams.page" :limit.sync="listParams.limit" @pagination="getList()" />
      <noData v-if="total===0"></noData>
      <el-dialog title="新增品牌" :visible.sync="addShow" width="468px">
        <div class="dialog-form">
          <div class="form-wrap">
            <div class="form-name">中文名称</div>
            <input class="form-control"/>
          </div>
          <div class="form-wrap">
            <div class="form-name">英文名称</div>
            <input class="form-control"/>
          </div>
          <div class="form-wrap">
            <div class="form-name">品牌国家</div>
            <input class="form-control"/>
          </div>
          <div class="form-wrap">
            <div class="form-name">品牌状态</div>
            <el-radio v-model="radio" label="1">显示</el-radio>
            <el-radio v-model="radio" label="2">不显示</el-radio>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <button class="btn-org-main" @click="addType()">保存</button>
          <button class="btn-fill-grey-main" @click="addShow = false">取消</button>
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
      letter: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'],
      currentLetter:'',
      addShow:false,
      radio:1,
      total: -1,
      listParams: {
        page:1,
        limit:10,
        name:'',
        letter:''
      },
      listData: []
    }
  },
  methods:{
    init() {
      this.getList();
    },
    getList(reload) {
      if(reload){
        this.listParams = {
          page:1,
          limit:10,
          name:'',
          letter:''
        }
      }
      this.api.brand.list(this.listParams).then((res) => {
        this.listData = res.data.dataList;
        this.total = res.data.total;
      });
    },
    selectLetter(item) {
      if(this.currentLetter === item) {
        this.currentLetter = '';
      } else {
        this.currentLetter = item;
      }
      this.listParams.letter = this.copy(this.currentLetter);
      this.getList();
    },
    editDetail(item) {
      let href = '';
      if(item && item.id){
        href = this.$router.resolve({ path: 'brand/detail/' + item.id});
      } else {
        href = this.$router.resolve({ name: '品牌详情' });
      }
      window.open(href.href, '_blank');
    },
    removeItem(item) {
      this.$msgbox({
        title: '',
        message: '确认删除？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          this.api.brand.del({id: item.id}).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getList(true);
          });
        }
      });
    },
    setStatus(item, status) {
      this.$msgbox({
        title: '',
        message: status === 1 ? '确认启用？' : '确认禁用？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if(action === 'confirm') {
          this.api.brand.setStatus({id: item.id, status: status}).then((res) => {
            this.$message.success({message:res.message, showClose:true});
            this.getList(true);
          });
        }
      });
    }
  },
  created() {
    this.init();
  },
  components: { Pagination, noData }
}
</script>
<style scoped lang='scss'>
  .center-brand{
    background: $white-color;
    .table{
      .link{
        margin-right: 20px;
      }
      .ellipsis{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }
    .search-bar{
      .form-name{
        font-weight: 600;
      }
    }
    .letter-wrap{
      display: inline-block;
      margin-right: 40px;
      user-select: none;
      .letter-item{
        display: inline-block;
        padding: 0 7px;
        cursor: pointer;
        &.active{
          color:$org-color;
        }
      }
    }
    .dialog-form{
      .form-name{
        width: 60px; 
      }
      .form-control{
        width: 300px;
      }
      .form-group{
        width: 380px;
      }
    }
  }
</style>