<template>
  <div class="system-agreement center-view">
    <div class="search-bar">
      <div class="search-bar-title">平台相关协议</div>
    </div>
    <table class="table table-text">
      <thead>
        <tr>
          <th class="table-w220">协议名称</th>
          <th class="table-w220">备注</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in agreementList" :key="item.id">
          <td>{{item.name}}</td>
          <td>{{item.remark}}</td>
          <td>
            <a class="link" @click="editAgreement(item)">编辑</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      agreementList: [
        {id: 1, name: '平台服务协议', remark: '注册页-平台服务协议'},
        {id: 2, name: '用户注册协议', remark: '个人页-设置-用户注册协议'},
        {id: 3, name: '使用帮助', remark: '个人页-使用帮助'},
        {id: 4, name: '正品保证', remark: '个人页-正品保证'},
        {id: 5, name: '保障说明', remark: '商品详情页-保障'},
        {id: 6, name: '运费说明|购买须知', remark: '商品详情页-运费说明|购买须知'},
        {id: 7, name: '充值协议', remark: '充值协议'}
      ]
    }
  },
  created() {

  },
  methods: {
    editAgreement(item) {
      let path = 'agreement/detail/'+item.id;
      window.open(path, '_blank');
    }
  }
}
</script>

<style lang="scss" scoped>
  .system-agreement{
    background: #fff;
    .search-bar{
      .search-bar-title{
        line-height: 30px;
      }
    }
  }
</style>

