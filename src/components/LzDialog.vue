<template>
  <div class="dj-dialog">
    <el-dialog
      top="0"
      :title="title"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :modal="false"
      :model-append-to-body="false"
      :append-to-body="!appendElement"
      v-bind="$attrs"
      @close="closeCallback"
      @closed="closed"
      @open="open"
      v-on="filterListeners">
      <div v-if="isOpen" class="dj-dialog-content">
        <slot>这是一段信息</slot>
      </div>
      <div slot="footer" class="dj-dialog-footer" :class="hasFooter ? '' : 'has-footer'">
        <slot v-if="hasFooter" name="footer">
          <el-button @click="closeCallback">取 消</el-button>
          <slot name="footer-confirm">
            <el-button type="primary" :loading="loading" @click="confirm">确 认</el-button>
          </slot>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LzDialog',
  props: {
    // 弹窗插入的 dom 节点位置，与 element 源码逻辑一致；默认插入到路由的节点， false 时插入到 body
    appendElementId: {
      default: 'router'
    },
    title: {
      default: '标题'
    },
    hasFooter: {
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      isOpen: false,
      appendElement: document.getElementById(this.appendElementId)
    }
  },
  computed: {
    filterListeners() {
      return ['close', 'open'].reduce((sum, key) => {
        delete sum[key]
        return sum
      }, { ...this.$listeners })
    }
  },
  watch: {
    dialogVisible(val) {
      if (val && this.appendElement) {
        this.appendElement.appendChild(this.$el)
      }
    }
  },
  mounted() {
    if (this.dialogVisible && this.appendElement) {
      this.appendElement.appendChild(this.$el)
    }
  },
  destroyed() {
    if (this.appendElement && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    open() {
      this.dialogVisible = true
      this.isOpen = true
    },
    closed() {
      this.isOpen = false
    },
    closeCallback() {
      this.dialogVisible && this.$emit('close')
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>
