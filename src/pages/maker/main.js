import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    'usingComponents': {
      'i-button': '../../static/iview/button/index',
      'i-input': '../../static/iview/input/index',
      'i-tab-bar': '../../static/iview/tab-bar/index',
      'i-tab-bar-item': '../../static/iview/tab-bar-item/index',
      'i-icon': '../../static/iview/icon/index',
      'i-row': '../../static/iview/row/index',
      'i-col': '../../static/iview/col/index',
      'i-message': '../../static/iview/message/index',
      'i-spin': '../../static/iview/spin/index',
      'i-page': '../../static/iview/page/index',
      'i-modal': '../../static/iview/modal/index',
      'i-input-number': '../../static/iview/input-number/index',
      'i-tabs': '../../static/iview/tabs/index',
      'i-tab': '../../static/iview/tab/index',
      'i-divider': '../../static/iview/divider/index'
    }
  }
}
