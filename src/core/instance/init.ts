
import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'
import type { Component } from 'typescript/component'
import type { InternalComponentOptions } from 'typescript/options'

let uid = 0

/**
 * 给实例加上了_init方法，以供实例化时（new Vue()）调用
 * _init主要做了四件事情
 * 1.初始化 _uid _isVue
 * 2.合并相关options
 * 3.初始化相关功能以及钩子调用 initLifecycle initEvents initRender callHook('beforecreate') initInjections initState initProvide callHook('created')
 * 4.挂载vue vm.$mount(vm.$options.el)
 */
export function initMixin(Vue: Component) {
  Vue.prototype._init = function (options?: Record<string, any>) {
    const vm: Component = this
    // a uid
    /**
     * 第一部分
     * 1.初始化部分属性 _uid _isVue
     * 2.开启性能检测
     */
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      // 性能检测相关
      // 在created之后，性能测试结束
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    // _isVue变量可以避免Vue实例对象被观察
    vm._isVue = true
    /**
     * 第二部分
     * 合并相关options
     */
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      // 优化内部组件的实例化，
      // 因为动态选项合并非常缓慢，
      // 而且没有一个内部组件选项需要特殊处理。

      initInternalComponent(vm, options as any)
    } else {
      // 如果是顶层实例则设置它的options
      // 对options进行合并，vue会将相关的属性和方法都统一放到vm.$options中，为后续的调用做准备工作。
      // vm.$option的属性来自两个方面，一个是Vue的构造函数(vm.constructor)预先定义的
      // 一个是new Vue时传入的入参对象
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor as any), // 如果通过Vue.extend创造，则这一步会取出祖先的options
        options || {},
        vm
      )
    }

    /**
     * 第三部分 
     * 初始化相关功能
     */
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // 开发环境
      // 代理功能初始化，设置vm._renderProxy
      // 该功能其实主要是用来做一个非法访问属性的警告（形如this.a的属性访问）
      initProxy(vm)
    } else {
      // 生产环境
      // 渲染函数作用域代理
      // _renderProxy属性指向vm本身
      vm._renderProxy = vm
    }
    // expose real self
    // _self保存实例本身
    vm._self = vm

    // 初始化vue实例的一系列属性,给到默认属性
    // 1.找到最近的一个非抽象父组件，在他的$children数组中添加自己
    // 2.初始化一些变量 $parent $root $children $refs _watcher _inactive _directInactive _isMounted _isDestroyed _isBeingDestroyed
    initLifecycle(vm)
    // 初始化_events _hasHookEvent变量
    // 存储父组件绑定的当前子组件的事件，保存到vm._events。
    initEvents(vm)
    // 定义vm._c和 vm.$createElement等方法
    initRender(vm)
    // 生命周期事件通知
    // 挨着调用用户定义的生命周期钩子函数和指令
    callHook(vm, 'beforeCreate')
    // 通过逐级查找，从父级provide中获取子级组件inject定义的属性值，并增加对该属性的监听
    // 只设置setter和getter不实例化__ob__
    initInjections(vm)  // resolve injections before data/props
    // initProps initMethods initData initComputed initWatch
    // 是对prop，method，data，computed，watch的初始化，增加对定义属性的监听
    initState(vm)
    // 把用户定义的provide赋值到_provided上
    // 如果是函数形式，就调用一下
    initProvide(vm) // resolve provide after data/props
    // 生命周期事件通知
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      // 性能测试结束部分
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    // 挂载。如果说前面几部分都是准备阶段，那么这部分是整个new Vue的核心部分，将template编译成render表达式，然后转化为大名鼎鼎的Vnode，最终渲染为真实的dom节点。
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create((vm.constructor as any).options))
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions!
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions(Ctor: Component) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions(Ctor: Component): Record<string, any> | null {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
