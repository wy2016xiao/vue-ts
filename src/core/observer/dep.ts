import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * dependency 依赖类
 * Dep 是一个类，用于依赖收集和派发更新，也就是存放watcher实例和触发watcher实例上的update。
 * 其成员函数最主要的是 depend 和 notify 
 * Dep是watcher实例的管理者。类似观察者模式的实现
 * 前者用来收集 Watcher ，后者则用来通知与这个依赖相关的 Watcher 来运行其回调函数。
 * @date 2020-05-05
 * @export
 * @class Dep
 */
export default class Dep {
  // 之所以这样单独提出来放在target里面是因为不可能在每一个需要watcher的地方自动出现watcher
  // 可以在这里存到target然后在另外一个地方取出来
  // 省掉了watcher四处访问传递的逻辑
  static target?: Watcher | null // 当前的watcher 需要被收集的依赖
  id: number // 属性
  subs: Array<Watcher>  // watcher类集合

  /**
   * Creates an instance of Dep.
   * 添加id和subs属性
   * @date 2021-01-04
   */
  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  // Dep.target为当前的watcher
  // 和watcher进行你中有我我中有你
  // dep收集watcher,watcher也能知道谁收集了自己
  // 在dep中依靠depend告诉watcher我收集你了
  depend() {
    if (Dep.target) {
      // 调用当前watcher的addDep
      // 在addDep中会调用这边的addSub
      Dep.target.addDep(this)
    }
  }

  // 一个一个调用subs里面watcher的update方法
  notify() {
    // stabilize the subscriber list first
    // 复制一遍subs
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      // 一个一个调用update
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// 当前watch的实例
// 同一时间只有一个实例会被watch
// 但是会记录很多实例

// Dep类有一个静态属性 target  保存当前该类对应的watcher
// 在这里可以看成是栈顶元素
// 为什么有上面的说法,可以看下面定义的pushTarget和popTarget函数
Dep.target = null
// 一个全局变量,保存全局所有存活的watcher
const targetStack: Array<Watcher | null | undefined> = []

/**
 * 将自身的watcher对象压入栈，设置全局的变量Dep.target为当前的watcher对象。
 * @date 04/05/2021
 * @export
 * @param {(Watcher | null)} [target]
 */
export function pushTarget(target?: Watcher | null) {
  targetStack.push(target)
  Dep.target = target
}

/**
 * 从全局watcher列表中弹出一个最后一个成员
 * @date 04/05/2021
 * @export
 */
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
