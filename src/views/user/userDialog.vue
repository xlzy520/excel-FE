<template>
  <lz-dialog ref="dialog" v-loading="loading" width="450px" :title="dialogTypeIsAdd?'新增用户': '编辑用户'"
             @close="close" @confirm="confirm">
    <div>
      <lz-form ref="form" :form-data="formData" :form-options="formOptions" :column-num="1"></lz-form>
    </div>
  </lz-dialog>
</template>
<script>
import userManage from '@/api/userManage'
export default {
  name: 'UserDialog',
  data() {
    return {
      loading: false,
      formData: {},
      formOptions: [
        {
          type: 'input',
          formItem: {
            prop: 'school',
            label: '学校',
            rules: [
              this.$methods.required('请输入学校'),
              this.$methods.inputLength(3, 20)
            ]
          },
          attrs: {
            maxlength: 20
          }
        },
        {
          type: 'input',
          formItem: {
            prop: 'username',
            label: '用户名',
            rules: [
              this.$methods.required('请输入用户'),
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ]
          },
          attrs: {
            maxlength: 10
          }
        },
        {
          type: 'input',
          formItem: {
            prop: 'phone',
            label: '手机号',
            rules: [
              this.$methods.required('请输入手机号'),
              { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                message: '请输入正确的手机号', trigger: 'blur' }
            ]
          },
          attrs: {
            maxlength: 11
          }
        },
        {
          type: 'select',
          formItem: {
            prop: 'grade',
            label: '所属学段',
            rules: [this.$methods.required('请选择所属学段')]
          },
          attrs: {
            options: this.$enum.grade
          }
        },
        {
          type: 'input',
          formItem: {
            prop: 'password',
            label: '密码',
            rules: [
              this.$methods.required('请输入密码'),
              { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
            ]
          },
          attrs: {
            type: 'password',
            'show-password': true
          }
        }
      ],
      dialogTypeIsAdd: false
    }
  },
  methods: {
    open(isAdd, row) {
      this.$refs.dialog.open()
      if (!isAdd) {
        this.formData = row
      }
      this.dialogTypeIsAdd = isAdd
    },
    confirm() {
      this.$refs.form.validate(() => {
        this.loading = true
        const post = this.dialogTypeIsAdd ? { request: userManage.addUser, msg: '添加' }
          : { request: userManage.updateUser, msg: '编辑' }
        post.request(this.formData).then(res => {
          this.$message(post.msg + '成功')
          this.close()
        }).finally(() => {
          this.loading = false
        })
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
