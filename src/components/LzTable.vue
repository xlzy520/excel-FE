<template>
  <div class="lz-table-container"
       :style="{height: $attrs.height === '100%' ? $attrs.height : ''}">
    <div class="over-table clearfix">
      <div class="left-item fl">
        <slot name="btn"></slot>
      </div>
      <div class="right-item fr">
        <lz-paging
          v-if="isNeedPage"
          :total="total"
          :page-no="pageNo"
          :page-size="pageSize"
          :page-size-list="pageSizeList"
          @change-page="changePage"
          @change-size="changeSize"
        />
      </div>
    </div>
    <div class="under-table dj-flex-1">
      <el-table ref="baseTable" :data="data" v-bind="$attrs" v-on="$listeners">
        <el-table-column v-if="selection" type="selection" width="55"/>
        <el-table-column v-if="index" type="index" width="55" label="序号" align="center"/>
        <el-table-column v-for="col in showColumns" :key="col.label" :align="col.align||'center'" v-bind="col">
          <template v-if="col.component" slot-scope="scope">
            <component :is="col.component" v-bind="getComponentBind(scope, col)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
// 为无component列创建一个component
const defaultComponent = function() {
  return {
    functional: true,
    render(h, { props: { row, col }, _v: text }) {
      const { formatter } = col
      if (row[col.prop] === 0) {
        return text(0)
      }
      const v = formatter && formatter(row, col) || row[col.prop] || ''
      return text && text(v) || v
    }
  }
}
export default {
  name: 'LzTable',
  props: {
    // 是否有选择框
    selection: {
      type: Boolean,
      default: false
    },
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    columns: {
      type: Array,
      default: () => { [] }
    },
    loading: {
      type: Boolean,
      default: false
    },
    index: Boolean,
    pageSizeList: {
      type: Array
    },
    defaultPageSize: {
      type: Number
    },
    isNeedPage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 处理后的表头数据
      showColumns: [],
      pageNo: 1,
      pageSize: this.defaultPageSize || (this.pageSizeList && this.pageSizeList[0]) || 15
    }
  },
  mounted() {
    // 处理表头数据
    this.showColumns = this.columns.filter(v => !v.hidden).map(col => {
      const temp = defaultComponent()
      if (col.render) {
        temp.render = col.render
      }
      return {
        ...col,
        component: temp
      }
    })
  },
  methods: {
    changePage(pageNo, bool, ...argv) {
      this.pageNo = pageNo
      if (!bool) {
        this.updateData(...argv)
      }
    },
    changeSize(pageSize, ...argv) {
      this.pageSize = pageSize
      if (this.pageSize * (this.pageNo - 1) < this.total || this.total === 0) {
        this.updateData(...argv)
      }
    },
    updateData(...argv) {
      this.$emit('update-data', {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }, ...argv)
    },
    // 使用v-bind展开props到组件上
    getComponentBind({ row, column, $index }, col) {
      return { row, col, column, $index }
    }
  }
}
</script>
<style lang="scss" scoped>
  .fr{
    float: right;
  }
  .fl{
    float: left;
  }
  .lz-table-container{
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    .over-table{
      margin-bottom: 16px;
      .left-item{
        display: inline-block;
        margin-bottom: 2px;
      }
      .right-item{
        display: flex;
        align-items: center;
      }
    }
    .under-table{
      height: 100%;
      overflow: hidden;
      position: relative;
      flex: 1;
    }
  }
</style>
