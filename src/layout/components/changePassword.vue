<template>
  <lz-dialog ref="dialog" :loading="loading" width="450px" title="修改密码"
             @close="close" @confirm="confirm">
    <lz-form ref="form" :form-data="formData" :form-options="formOptions" :column-num="1"></lz-form>
  </lz-dialog>
</template>

<script>
import userApi from '@/api/user'
export default {
  name: 'ChangePassword',
  data() {
    return {
      loading: false,
      formData: {},
      formOptions: [
        {
          type: 'input',
          formItem: {
            prop: 'password',
            label: '初始密码',
            rules: [
              this.$methods.required('请输入初始密码'),
              this.$methods.inputLength(6, 20)
            ]
          },
          attrs: {
            type: 'password',
            'show-password': true
          }
        },
        {
          type: 'input',
          formItem: {
            prop: 'newPassword',
            label: '密码',
            rules: [
              this.$methods.required('请输入密码'),
              this.$methods.inputLength(6, 20)
            ]
          },
          attrs: {
            type: 'password',
            'show-password': true
          }
        }
      ]
    }
  },
  methods: {
    open() {
      this.$refs.dialog.open()
    },
    close() {
      this.$refs.dialog.close()
      this.$emit('close')
      this.formData = {}
    },
    confirm() {
      this.$refs.form.validate(() => {
        this.loading = true
        userApi.updatePassword(this.formData).then(res => {
          this.$message('修改密码成功')
          this.close()
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
