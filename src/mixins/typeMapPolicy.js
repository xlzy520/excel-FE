// import controls from '../../package/controls-summary/index';
// import { handleComponent } from '@/utils/methods'
const DEFAULT_TYPE_MAP = {
  input: 'el-input',
  select: 'lz-select',
  date: 'el-time-picker',
  checkbox: 'el-check-box',
  radio: 'el-radio',
  switch: 'el-switch'
}
// function handleComponent(obj) {
//   let {component, render} = obj;
//   if (render) {
//     return {
//       functional: true,
//       render
//     };
//   } else {
//     return component;
//   }
// }
export default {
  props: {
    typeMap: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    _typeMap() {
      return Object.assign({}, DEFAULT_TYPE_MAP, this.typeMap)
    }
  },
  methods: {
    getComponent(obj = {}) {
      const { type } = obj
      return type === 'custom' && this.$methods.handleComponent(obj) || this._typeMap[type] || type
    },
    isExistType(type) {
      return Boolean(this._typeMap[type])
    }
  },
  components: {
    // ...controls
  }
}

