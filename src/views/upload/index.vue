<template>
  <div class="upload">
    <div class="upload-header">
      <el-upload accept=".xls,.xlsx" class="upload-demo" multiple
                 action="https://jsonplaceholder.typicode.com/posts/">
        <el-button type="primary" icon="el-icon-upload">Excel上传</el-button>
      </el-upload>
      <el-button type="success" icon="el-icon-download" @click="download">下载文件模板</el-button>
    </div>
    <h3>不符合要求的内容：</h3>
    <div class="upload-table">
      <lz-table ref="table" :table-data="tableData" :table-columns="tableColumns"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Upload',
  data() {
    return {
      tableData: [{ test: '2122' }],
      tableColumns: [
        { prop: 'test', label: '测试' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'roleCode'
    ])
  },
  methods: {
    download() {

    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  padding: 10px;
  &-header{
    display: flex;
    ::v-deep &>.el-button{
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
