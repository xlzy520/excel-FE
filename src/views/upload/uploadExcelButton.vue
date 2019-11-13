<template>
  <div class="upload-btn">
    <el-button :loading="loading" type="primary" @click="handleUpload">选择excel验证</el-button>
    <input v-show="false" ref="excel-upload-input" type="file" accept=".xlsx,.xls"
           class="excel-upload-input" @change="handleClick">
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'UploadExcelButton',
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: []
    }
  },
  methods: {
    generateDate(table) {
      this.excelData = table
      this.loading = false
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleUpload() {
      if (!this.$parent.template) {
        this.$message('请先选择模板项目', 'info')
        return false
      }
      this.$refs['excel-upload-input'].click()
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.get_header_row(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet, {
            blankrows: false,
            header: header,
            range: 4
          })
          const table_data = { header: header, results: results, SheetName: workbook.SheetNames }
          this.generateDate(table_data)
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    get_header_row(sheet) {
      const headers = []
      if (sheet['!ref']) {
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({ c: C, r: 3 })]
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
      }
      return headers
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
