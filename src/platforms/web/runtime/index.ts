import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement,
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'
import type { Component } from 'typescript/component'

// 加载web平台特殊工具函数
// install platform specific utils
Vue.config.mustUseProp = mustUseProp // 检查是否使用了恰当的标签和属性 比如如果传了checked属性就一定得是input标签
Vue.config.isReservedTag = isReservedTag // 检查是否是保留标签
Vue.config.isReservedAttr = isReservedAttr // 检查是否是保留属性
Vue.config.getTagNamespace = getTagNamespace // 检查标签的命名空间 目前只能查询svg和math标签的命名空间
Vue.config.isUnknownElement = isUnknownElement // 检查是否是未知的标签

// 加载web平台运行时指令功能和组件
// platformDirectives = {
//   on,
//   bind,
//   cloak: noop
// }
// platformComponents = {
//   KeepAlive
// }
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// 装载平台的核心函数 patch函数
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
// 公共mount方法
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 如果是浏览器环境就去selectElement
  el = el && inBrowser ? query(el) : undefined
  // 直接调用mount
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        // @ts-expect-error
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      // @ts-expect-error
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
          `Make sure to turn on production mode when deploying for production.\n` +
          `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue
