<template>
  <lz-dialog ref="dialog" v-loading="loading" width="1000px" title="查看详情" :has-footer="false" @close="close">
    <div style="min-height: 70vh">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="列表查看" name="1">
          <lz-table ref="table"
                    :data="chartData"
                    :columns="tableColumns"
                    :total="total"
                    :loading="loading"
                    @update-data="getList">
            <div slot="btn">
              <div class="ext-content">
                <el-button type="primary" :loading="exportLoading" @click="exportExcel">导出Excel</el-button>
                <div class="ext-data">
                  <div v-if="totalCount">总人数： {{ totalCount }}</div>
                </div>
              </div>
            </div>
          </lz-table>
        </el-tab-pane>
        <el-tab-pane label="图表查看" name="2">
          <chart-view ref="chart" :data="chartData"></chart-view>
        </el-tab-pane>
      </el-tabs>
    </div>
  </lz-dialog>
</template>
<script>
import countingApi from '@/api/counting'
import chartView from './chartView'

export default {
  name: 'CountingDialog',
  components: {
    chartView
  },
  data() {
    return {
      loading: false,
      activeTab: '1',
      chartData: [],
      tableColumns: [
        { label: '学校名称', prop: 'name' },
        { label: '人数', prop: 'total' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改时间', prop: 'modifyDate' }
      ],
      total: 0,
      exportLoading: false,
      id: '',
      totalCount: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    open(row) {
      this.id = row.id
      this.totalCount = row.total
      this.$refs.dialog.open()
    },
    handleClick() {
      if (this.activeTab === '2') {
        this.$refs.chart.draw()
      }
    },
    close() {
      this.$refs.dialog.close()
      this.$emit('close')
    },
    exportExcel() {
      this.$emit('export', this.id)
    },
    getList(page) {
      this.loading = true
      const post = { id: this.id, ...page }
      countingApi.getCountingDetailById(post).then(res => {
        this.chartData = res.list || []
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ext-content {
    display: flex;
    padding-left: 15px;
    line-height: 2;
  }
  .ext-data {
    margin-left: 30px;
    display: flex;
    padding: 5px 0;
    font-family: "PingFang SC Regular", sans-serif;
    font-weight: bold;
    div {
      margin-right: 30px;
    }
  }
</style>
