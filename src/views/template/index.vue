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
        <el-button type="primary" @click="open(true)">新增模板</el-button>
      </div>
    </lz-table>
    <template-dialog v-if="visible" ref="dialog" @confirm="toSearch" @close="close"></template-dialog>
  </div>
</template>

<script>
import templateApi from '@/api/template'
import templateDialog from '@/views/template/templateDialog'

export default {
  components: {
    templateDialog
  },
  data() {
    return {
      searchConfig: [
        { label: '名称', key: 'name', type: 'input' }
        // { label: '学段', key: 'grade', type: 'select', attrs: { options: this.$enum.grade }}
      ],
      tableData: [],
      tableColumns: [
        { label: '名称', prop: 'templateName' },
        { label: '学段', prop: 'grade', formatter: row => {
          return this.$enum.grade.find(v => row.grade === v.value).label
        } },
        { label: '创建时间', prop: 'saveDate', width: 180 },
        { label: '修改时间', prop: 'modifyDate', width: 180 },
        {
          label: '操作', prop: 'operation',
          render: (h, { props: { row }}) => {
            return (
              <div class='td-btn-group'>
                <a onClick={() => this.delete(row)}>删除</a>
                <span></span>
                <a onClick={() => this.download(row)}>下载</a>
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
      this.$methods.tipBox(`确定删除该模板吗？`, () => {
        templateApi.deleteTemplate(row.id).then(() => {
          this.$message(`删除成功`)
          this.toSearch()
        })
      })
    },
    download(row) {
      this.$methods.fileDownload(row.url)
    },
    toSearch() {
      this.$refs.search.search()
    },
    getList(page) {
      this.loading = true
      const post = { ...this.searchData, ...page }
      templateApi.getTemplateList(post).then(res => {
        this.tableData = res.list || []
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
