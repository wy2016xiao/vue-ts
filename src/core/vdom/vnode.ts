import type { Component } from "typescript/component";
import type { ComponentOptions } from "typescript/options";
import type { VNodeComponentOptions, VNodeData } from "typescript/vnode";

export default class VNode {
  tag?: string; // 标签名 div span
  data: VNodeData | undefined;// 标签上的属性  id  class等
  children?: Array<VNode> | null;// 子节点,VNode数组
  text?: string;// 文本节点
  elm: Node | undefined;
  ns?: string;
  context?: Component; // rendered in this component's scope
  key: string | number | undefined;
  componentOptions?: VNodeComponentOptions;
  componentInstance?: Component; // component instance
  parent: VNode | undefined; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory?: Function; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext?: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions?: ComponentOptions | null; // for SSR caching
  devtoolsMeta?: Object | null; // used to store functional render context for devtools
  fnScopeId?: string | null; // functional scope id support

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode> | null,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    // 当前节点标签名
    this.tag = tag
    // 当前节点html标签上面定义的属性
    // id class show key等等
    // 是一个VNodeData类型，可以参考VNodeData类型中的数据信息
    this.data = data
    // 当前节点的子节点，一个数组
    this.children = children
    // 当前节点的文本
    this.text = text
    // 当前虚拟节点对应的真实节点
    this.elm = elm
    // 当前节点的命名空间
    this.ns = undefined
    // 编译作用域
    this.context = context
    // 函数化组件作用域
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    // 节点的key属性，被当做节点的标志，用以diff优化
    this.key = data && data.key
    // 当前节点对应的组件的options选项
    this.componentOptions = componentOptions
    // 当前节点对应的组件的实例
    this.componentInstance = undefined
    // 当前节点的父节点
    this.parent = undefined
    // 简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false
    this.raw = false
    // 静态节点的标志
    this.isStatic = false
    // 是否作为跟节点插入
    this.isRootInsert = true
    // 是否为注释节点
    this.isComment = false
    // 是否为克隆节点
    this.isCloned = false
    // 是否有v-once指令
    this.isOnce = false
    // 异步组件的工厂方法
    this.asyncFactory = asyncFactory
    // 异步源
    this.asyncMeta = undefined
    // 是否异步的预赋值
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance;
  }
}

export const createEmptyVNode = (text: string = "") => {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

export function createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val));
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode(vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned;
}
