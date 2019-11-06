<template>
  <el-pagination
    :page-sizes="sizeList"
    :page-size="_pageSize"
    :current-page="pageNo"
    :total="total"
    v-bind="getBind()"
    @size-change="changeSize"
    @current-change="changePage"
    v-on="$listeners"/>
</template>

<script>
const DEFAULT_PAGE_SIZES = [15, 30, 50, 100, 200]
const DEFAULT_PAGEING_ATTRS = {
  'layout': 'total, sizes, prev, pager, next',
  'pager-count': 5
}
export default {
  name: 'DjPaging',
  props: {
    'total': {
      type: Number,
      default: 0
    },
    'pageNo': {
      type: Number,
      default: 1
    },
    'pageSize': {
      type: Number
    },
    'pageSizeList': {
      type: Array,
      default: () => DEFAULT_PAGE_SIZES
    }
  },
  computed: {
    sizeList() {
      return this.pageSizeList
    },
    _pageSize() {
      return this.pageSizeList.includes(this.pageSize) ? this.pageSize : this.pageSizeList[0]
    }
  },
  watch: {
    total(newVal) {
      const pageSize = this._pageSize
      const maxPage = Math.ceil(newVal / pageSize)
      if (this.pageNo > maxPage) {
        this.$emit('change-page', maxPage === 0 ? 1 : maxPage, maxPage === 0)
      }
    }
  },
  methods: {
    getBind() {
      return {
        ...DEFAULT_PAGEING_ATTRS,
        ...this.$attrs
      }
    },
    changePage(page) {
      this.$emit('change-page', page)
    },
    changeSize(pageSize) {
      this.$emit('change-size', pageSize)
    }
  }
}
</script>
