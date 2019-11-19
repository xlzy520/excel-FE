<template>
  <div class="app-container">
    <div class="header">
      <lz-search ref="search" :config="searchConfig" @search="search"/>
    </div>
    <lz-table ref="table"
              :data="tableData"
              :columns="tableColumns"
              :total="total"
              :loading="loading"
              @update-data="getList">
      <div slot="btn">
        <el-button type="primary" @click="open(true)">新增用户</el-button>
      </div>
    </lz-table>
    <user-dialog v-if="visible" ref="dialog" @confirm="toSearch" @close="close"></user-dialog>
  </div>
</template>

<script>
import userManage from '@/api/userManage'
import UserDialog from '@/views/user/userDialog'

export default {
  components: {
    UserDialog
  },
  data() {
    return {
      searchConfig: [
        { label: '用户名', key: 'username', type: 'input' },
        { label: '学校', key: 'school', type: 'input' },
        { label: '学段', key: 'grade', type: 'select', attrs: { default: '', options: this.$enum.grade }}
      ],
      tableData: [],
      tableColumns: [
        { label: '用户名', prop: 'username' },
        { label: '学校', prop: 'school' },
        { label: '学段', prop: 'grade',width: 80, formatter: row => {
          return this.$enum.gradeNotAll.find(v => row.grade === v.value).label
        } },
        { label: '手机', prop: 'phone' },
        { label: '创建时间', prop: 'saveDate', width: 180, },
        { label: '修改时间', prop: 'modifyDate',width: 180, },
        {
          label: '操作', prop: 'operation',
          render: (h, { props: { row }}) => {
            return (
              <div class='td-btn-group'>
                <a onClick={() => this.delete(row)}>删除</a>
                <span></span>
                <a onClick={() => this.open(false, row)}>编辑</a>
              </div>
            )
          }
        }
      ],
      total: 0,
      loading: false,
      visible: false
    }
  },
  mounted() {
    this.toSearch()
  },
  methods: {
    open(isAdd, row) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dialog.open(isAdd, row)
      })
    },
    close() {
      this.visible = false
    },
    search(query) {
      this.searchData = query
      this.$refs.table.changePage(1)
    },
    delete(row) {
      this.$methods.tipBox(`确定删除该条内容吗？`, () => {
        userManage.deleteUser({
          userId: row.id
        }).then(() => {
          this.$message(`删除成功`)
          this.toSearch()
        })
      })
    },
    toSearch() {
      this.$refs.search.search()
    },
    getList(page) {
      this.loading = true
      const post = { ...this.searchData, ...page }
      userManage.getUserList(post).then(res => {
        this.tableData = res.list || []
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
