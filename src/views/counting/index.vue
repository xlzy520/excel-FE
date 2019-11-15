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
    </lz-table>
    <counting-dialog v-if="visible" ref="dialog" @close="close"></counting-dialog>
  </div>
</template>

<script>
import countingDialog from './countingDialog'
import templateApi from '@/api/template'

export default {
  components: {
    countingDialog
  },
  data() {
    return {
      searchConfig: [
        { label: '项目名称', key: 'name', type: 'input' }
      ],
      tableData: [],
      tableColumns: [
        { label: '项目名称', prop: 'templateName' },
        { label: '总人数', prop: 'peopleCount' },
        { label: '创建时间', prop: 'saveDate', width: 180 },
        { label: '修改时间', prop: 'modifyDate', width: 180 },
        {
          label: '操作', prop: 'operation',
          render: (h, { props: { row }}) => {
            return (
              <div class='td-btn-group'>
                <a onClick={() => this.view(row)}>查看</a>
                <span></span>
                <a onClick={() => this.download(row)}>导出</a>
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
    view(row) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dialog.open(row)
      })
    },
    close() {
      this.visible = false
    },
    search(query) {
      this.searchData = query
      this.$refs.table.changePage(1)
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
