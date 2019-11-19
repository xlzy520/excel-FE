<template>
  <div class="upload">
    <div class="upload-header">
      <div class="excel">
        <div class="template-select">
          <label>选择项目: </label>
          <lz-select v-model="template" v-bind="templateConfig" style="width: 232px;"></lz-select>
        </div>
        <upload-excel-button :on-success="handleSuccess" :before-upload="beforeUpload"></upload-excel-button>
        <el-button type="primary" @click="upload">确认上传</el-button>
      </div>
      <el-button type="success" icon="el-icon-download" @click="download">下载文件模板</el-button>
    </div>
    <h3>不符合要求的内容：</h3>
    <div class="upload-table">
      <lz-table ref="table" :data="tableData" :columns="tableColumns" :cell-class-name="cellClassName"
                :row-class-name="tableRowClassName">
        <div v-if="totalCount" slot="btn">
          <div>总条数： {{ totalCount }}</div>
          <div>失败条数： {{ errorCount }}</div>
        </div>
      </lz-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import uploadExcelButton from './uploadExcelButton'
import templateApi from '@/api/template'
import studentsApi from '@/api/students'

export default {
  name: 'Upload',
  components: {
    uploadExcelButton
  },
  data() {
    return {
      tableData: [],
      tableColumns: [],
      visible: false,
      template: '', // 选择一个模板项目
      templateConfig: {
        key: 'single',
        type: 'single',
        options: []
      },
      errorCount: 0
    }
  },
  computed: {
    ...mapGetters([
      'roleCode', 'name'
    ]),
    totalCount() {
      return this.tableData.length
    }
  },
  mounted() {
    this.getTemplateList()
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.repeat || row.error) {
        return 'warning-row'
      }
      return ''
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (row.error) {
        if (rowIndex === row.errorIndex[0] && columnIndex === row.errorIndex[1]) {
          return 'warning-cell'
        }
      }
      return ''
    },
    getTemplateList() {
      templateApi.getTemplateList({
        pageNo: 1,
        pageSize: 9999
      }).then(res => {
        this.templateConfig.options = res.list.map(v => {
          return { label: v.templateName, value: v.id, fileUrl: v.fileUrl }
        }) || []
      })
    },
    upload() {
      if (!this.template) {
        this.$message('请先选择模板项目', 'info')
        return false
      }
      if (this.errorCount > 0) {
        this.$message('该表格存在不符合规范的行', 'error')
        return false
      }
      studentsApi.addStudent({
        data: this.tableData,
        templateId: this.template,
        username: this.name
      }).then(res => {
        this.$message('上传成功')
      }).catch((res) => {
        this.tableData = res.data
      })
    },
    download() {
      if (!this.template) {
        this.$message('请先选择模板项目', 'info')
        return false
      }
      const fileUrl = this.templateConfig.options.find(v => v.value === this.template).fileUrl
      this.$methods.fileDownload('http://localhost:3000' + fileUrl)
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 5
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '请不要上传大于5M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess(data) {
      const { results, header } = data
      results.map((v, index) => {
        header.map((vh, indexVh) => {
          if (!v[vh]) {
            v.error = true
          } else {
            if (vh === '联系电话') {
              v.error = !/^1[3456789]\d{9}$/.test(v[vh])
              if (v.error) {
                v.errorIndex = [index, indexVh]
              }
            }
          }
        })
      })
      this.errorCount = results.filter(v => v.error).length
      this.tableData = results
      this.tableColumns = data.header.map(v => ({ prop: v, label: v }))
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  padding: 10px;
  &-header{
    display: flex;
    justify-content: space-between;
    .excel{
      display: flex;
    }
    ::v-deep .el-button{
      margin-left: 30px;
    }
  }
  h3{
    color: #f35532;
  }
  &-table{
    ::v-deep .el-table{
      .warning-row {
        background: #ce8777;
        color: #fff;
      }
      .warning-cell{
        color: #f3ff48;
      }
      tr.warning-row:hover>td {
        background-color: initial;
      }
    }
  }
}
</style>
