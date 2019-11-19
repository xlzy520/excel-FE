<template>
  <lz-dialog ref="dialog" v-loading="loading" width="450px" :title="dialogTypeIsAdd?'新增模板': '编辑模板'"
             @close="close" @confirm="confirm">
    <div>
      <el-form ref="form" label-width="100px" :model="formData" :rules="rule">
        <el-form-item label="项目名" prop="templateName">
          <el-input v-model="formData.templateName"></el-input>
        </el-form-item>
        <el-form-item label="模板" prop="fileUrl">
          <el-upload ref="upload" action="/excel/upload"
                     :on-success="uploadSuccess"
                     :on-error="uploadError"
                     accept=".xls,.xlsx" :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="学段" prop="grade">
          <lz-select v-model="formData.grade" v-bind="gradeConfig"></lz-select>
        </el-form-item>
      </el-form>
    </div>
  </lz-dialog>
</template>
<script>
import templateApi from '@/api/template'
export default {
  name: 'TemplateDialog',
  data() {
    return {
      loading: false,
      formData: {
        fileUrl: ''
      },
      gradeConfig: {
        key: 'single',
        type: 'single',
        options: this.$enum.gradeNotAll
      },
      dialogTypeIsAdd: false,
      rule: {
        templateName: [
          this.$methods.required('请输入项目名')
        ],
        fileUrl: [
          this.$methods.required('请上传文件')
        ],
        grade: [
          this.$methods.required('请选择学段')
        ]
      }
    }
  },
  methods: {
    uploadSuccess(res) {
      if (res.success) {
        this.formData.fileUrl = res.data.fileUrl
        this.$message('上传成功')
      } else {
        this.$message('上传失败：' + res.msg, 'error')
        this.$refs.upload.clearFiles()
      }
    },
    uploadError(err, file, fileList) {
      this.$message('上传失败' + JSON.stringify(err), 'error')
    },
    open(isAdd, row) {
      this.$refs.dialog.open()
      if (!isAdd) {
        this.formData = row
      }
      this.dialogTypeIsAdd = isAdd
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const post = this.dialogTypeIsAdd ? { request: templateApi.addTemplate, msg: '添加' }
            : { request: templateApi.updateTemplate, msg: '编辑' }
          post.request(this.formData).then(res => {
            this.$message(post.msg + '成功')
            this.$emit('confirm')
            this.close()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    close() {
      this.$refs.dialog.close()
      this.$emit('close')
      this.formData = {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>
