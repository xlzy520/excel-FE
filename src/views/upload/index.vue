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
      <lz-table ref="table" :data="tableData" :columns="tableColumns">
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
      errorCount: ''
    }
  },
  computed: {
    ...mapGetters([
      'roleCode'
    ]),
    totalCount() {
      return this.tableData.length
    }
  },
  mounted() {
    this.getTemplateList()
  },
  methods: {
    getTemplateList() {
      templateApi.getTemplateList({
        pageNo: 1,
        pageSize: 9999
      }).then(res => {
        this.templateConfig.options = res.list.map(v => {
          return { label: v.name, value: v.id }
        }) || []
      })
    },
    upload() {
      if (!this.template) {
        this.$message('请先选择模板项目', 'info')
        return false
      }
      studentsApi.addStudent({
        data: this.tableData,
        template: this.template
      }).then(res => {
        this.$message('上传成功')
      })
    },
    download() {
      if (!this.template) {
        this.$message('请先选择模板项目', 'info')
        return false
      }
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
      this.tableData = data.results
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

  }
}
</style>
