import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import '@/styles/index.scss' // global css

import methods from './utils/methods'
import $enum from './utils/enum'

import '@/icons' // icon
import '@/permission' // permission control
import LzTable from '@/components/LzTable'
import LzGridBox from '@/components/LzGridBox'
import LzForm from '@/components/LzForm'
import LzSearch from '@/components/LzSearch'
import LzPaging from '@/components/LzPaging'
import LzDialog from '@/components/LzDialog'
import LzSelect from '@/components/LzSelect'

Vue.component('LzTable', LzTable)
Vue.component('LzGridBox', LzGridBox)
Vue.component('LzForm', LzForm)
Vue.component('LzSearch', LzSearch)
Vue.component('LzPaging', LzPaging)
Vue.component('LzDialog', LzDialog)
Vue.component('LzSelect', LzSelect)

Vue.use(ElementUI)
Vue.prototype.$methods = methods
Vue.prototype.$enum = $enum
Vue.prototype.$message = (text, type) => {
  ElementUI.Message({
    'showClose': true, // 是否显示关闭按钮
    'message': text, // 消息内容
    'type': type || 'success', // 消息类型
    'duration': 1000 // 显示时间
  })
}
Vue.config.productionTip = false

export default Vue
