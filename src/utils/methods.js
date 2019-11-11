import defaultSettings from '@/settings'
import { MessageBox } from 'element-ui'

export default {
  parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  },
  formatTime(time, option) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    } else {
      time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return this.parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      )
    }
  },
  param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse(
      '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
    )
  },
  getPageTitle(pageTitle) {
    const title = defaultSettings.title || 'xlzy520'
    if (pageTitle) {
      return `${pageTitle} - ${title}`
    }
    return `${title}`
  },
  required(tip) {
    return { required: true, message: '请输入' + tip }
  },
  inputLength(min, max, method = 'blur') {
    return { min: min, max: max, message: `长度在 ${min} 到 ${max} 个字符`, trigger: method }
  },
  checkType(val, type) {
    if (Array.isArray(type)) {
      return type.some(t => Object.prototype.toString.call(val) === `[object ${t}]`)
    } else {
      return Object.prototype.toString.call(val) === `[object ${type}]`
    }
  },
  deepClone(obj = {}, ignoreKeyList = []) {
    const _obj = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
      if (!(obj.constructor === Object && ignoreKeyList.includes(key))) {
        if (this.checkType(obj[key], ['Array', 'Object'])) {
          _obj[key] = this.deepClone(obj[key], ignoreKeyList)
        } else {
          _obj[key] = obj[key]
        }
      }
    }
    return _obj
  },
  handleComponent(obj) {
    const { component, render } = obj
    if (render) {
      return {
        functional: true,
        render
      }
    } else {
      return component
    }
  },
  // 弹出提示框
  tipBox: (txt, fn1) => {
    return new Promise((resolve, reject) => {
      MessageBox.confirm(txt, '', {
        confirmButtonText: '确 认',
        cancelButtonText: '取 消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        type: 'warning',
        showClose: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (fn1 && fn1.constructor === Function) {
              instance.confirmButtonLoading = true
              instance.cancelButtonLoading = true
              instance.cancelButtonClass = 'is-disabled'
              const result = fn1()
              if (result && typeof result.then === 'function') {
                result.then(() => {
                  done()
                  resolve()
                }).catch(e => {
                  done()
                  reject(e)
                }).finally(() => {
                  instance.confirmButtonLoading = false
                  instance.cancelButtonLoading = false
                  instance.cancelButtonClass = ''
                })
              } else {
                done()
                resolve()
                instance.confirmButtonLoading = false
                instance.cancelButtonLoading = false
              }
            } else {
              done()
              resolve()
            }
          } else {
            done()
            resolve()
          }
        }
      })
    })
  },
  fileDownload(href) {
    var eleLink = document.createElement('a')
    eleLink.style.display = 'none'
    eleLink.href = href
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
  }
}
