<template>
  <div class="lz-search">
    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item v-for="item in config" :key="item.key" :label="item.label">
        <component :is="item.type==='select'?'lz-select':'el-'+ item.type"
                   v-model="query[item.key]"
                   v-bind="item.attrs" :placeholder="item.label"
                   v-on="$listeners" @input="$emit('change', query, item)"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="search">搜索</el-button>
        <el-button v-show="showResetButton" size="medium" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LzSearch',
  props: {
    query: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Array,
      default: () => []
    },
    showResetButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hidden: false,
      cache: {}
    }
  },
  created() {
    this.getBaseQuery()
  },
  methods: {
    getBaseQuery() {
      this.config.forEach(item => {
        const { attrs = {}} = item
        let _default = attrs.default
        if (this.$methods.checkType(_default, ['Object', 'Array'])) {
          _default = this.$methods.deepClone(_default)
        }
        this.$set(this.query, item.key, _default)
      })
    },
    search() {
      const tempQuery = this.$methods.deepClone(this.query)
      this.$emit('search', tempQuery)
      this.cache = tempQuery
    },
    restQuery() {
      if (this.$listeners['before-reset']) {
        this.$emit('before-reset')
        this.$nextTick(() => {
          this.getBaseQuery()
        })
      } else {
        this.getBaseQuery()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .lz-search{
    color: red;
    label{
      font-weight: 500;
    }
  }
</style>
