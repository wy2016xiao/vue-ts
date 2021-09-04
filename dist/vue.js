/*!
 * Vue.js v2.6.12
 * (c) 2014-2021 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  var emptyObject = Object.freeze({});
  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef(v) {
      return v === undefined || v === null;
  }
  function isDef(v) {
      return v !== undefined && v !== null;
  }
  function isTrue(v) {
      return v === true;
  }
  function isFalse(v) {
      return v === false;
  }
  /**
   * Check if value is primitive.
   */
  function isPrimitive(value) {
      return (typeof value === 'string' ||
          typeof value === 'number' ||
          // $flow-disable-line
          typeof value === 'symbol' ||
          typeof value === 'boolean');
  }
  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject(obj) {
      return obj !== null && typeof obj === 'object';
  }
  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;
  function toRawType(value) {
      return _toString.call(value).slice(8, -1);
  }
  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject(obj) {
      return _toString.call(obj) === '[object Object]';
  }
  function isRegExp(v) {
      return _toString.call(v) === '[object RegExp]';
  }
  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex(val) {
      var n = parseFloat(String(val));
      return n >= 0 && Math.floor(n) === n && isFinite(val);
  }
  function isPromise(val) {
      return (isDef(val) &&
          typeof val.then === 'function' &&
          typeof val.catch === 'function');
  }
  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString(val) {
      return val == null
          ? ''
          : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
              ? JSON.stringify(val, null, 2)
              : String(val);
  }
  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber(val) {
      var n = parseFloat(val);
      return isNaN(n) ? val : n;
  }
  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap(str, expectsLowerCase) {
      var map = Object.create(null);
      var list = str.split(',');
      for (var i = 0; i < list.length; i++) {
          map[list[i]] = true;
      }
      return expectsLowerCase ? function (val) { return map[val.toLowerCase()]; } : function (val) { return map[val]; };
  }
  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);
  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
  /**
   * Remove an item from an array.
   */
  function remove$2(arr, item) {
      if (arr.length) {
          var index = arr.indexOf(item);
          if (index > -1) {
              return arr.splice(index, 1);
          }
      }
  }
  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
  }
  /**
   * Create a cached version of a pure function.
   */
  function cached(fn) {
      var cache = Object.create(null);
      return function cachedFn(str) {
          var hit = cache[str];
          return hit || (cache[str] = fn(str));
      };
  }
  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
      return str.replace(camelizeRE, function (_, c) { return (c ? c.toUpperCase() : ''); });
  });
  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  });
  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
      return str.replace(hyphenateRE, '-$1').toLowerCase();
  });
  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */
  /* istanbul ignore next */
  function polyfillBind(fn, ctx) {
      function boundFn(a) {
          var l = arguments.length;
          return l
              ? l > 1
                  ? fn.apply(ctx, arguments)
                  : fn.call(ctx, a)
              : fn.call(ctx);
      }
      boundFn._length = fn.length;
      return boundFn;
  }
  function nativeBind(fn, ctx) {
      return fn.bind(ctx);
  }
  // @ts-expect-error bind cannot be `undefined`
  var bind$1 = Function.prototype.bind ? nativeBind : polyfillBind;
  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray(list, start) {
      start = start || 0;
      var i = list.length - start;
      var ret = new Array(i);
      while (i--) {
          ret[i] = list[i + start];
      }
      return ret;
  }
  /**
   * Mix properties into target object.
   */
  function extend(to, _from) {
      for (var key in _from) {
          to[key] = _from[key];
      }
      return to;
  }
  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject(arr) {
      var res = {};
      for (var i = 0; i < arr.length; i++) {
          if (arr[i]) {
              extend(res, arr[i]);
          }
      }
      return res;
  }
  /* eslint-disable no-unused-vars */
  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop(a, b, c) { }
  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };
  /* eslint-enable no-unused-vars */
  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };
  /**
   * Generate a string containing static keys from compiler modules.
   */
  function genStaticKeys$1(modules) {
      return modules
          .reduce(function (keys, m) {
          return keys.concat(m.staticKeys || []);
      }, [])
          .join(',');
  }
  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual(a, b) {
      if (a === b)
          { return true; }
      var isObjectA = isObject(a);
      var isObjectB = isObject(b);
      if (isObjectA && isObjectB) {
          try {
              var isArrayA = Array.isArray(a);
              var isArrayB = Array.isArray(b);
              if (isArrayA && isArrayB) {
                  return (a.length === b.length &&
                      a.every(function (e, i) {
                          return looseEqual(e, b[i]);
                      }));
              }
              else if (a instanceof Date && b instanceof Date) {
                  return a.getTime() === b.getTime();
              }
              else if (!isArrayA && !isArrayB) {
                  var keysA = Object.keys(a);
                  var keysB = Object.keys(b);
                  return (keysA.length === keysB.length &&
                      keysA.every(function (key) {
                          return looseEqual(a[key], b[key]);
                      }));
              }
              else {
                  /* istanbul ignore next */
                  return false;
              }
          }
          catch (e) {
              /* istanbul ignore next */
              return false;
          }
      }
      else if (!isObjectA && !isObjectB) {
          return String(a) === String(b);
      }
      else {
          return false;
      }
  }
  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf(arr, val) {
      for (var i = 0; i < arr.length; i++) {
          if (looseEqual(arr[i], val))
              { return i; }
      }
      return -1;
  }
  /**
   * Ensure a function is called only once.
   */
  function once(fn) {
      var called = false;
      return function () {
          if (!called) {
              called = true;
              fn.apply(this, arguments);
          }
      };
  }

  var SSR_ATTR = 'data-server-rendered';
  var ASSET_TYPES = ['component', 'directive', 'filter'];
  var LIFECYCLE_HOOKS = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',
      'deactivated',
      'errorCaptured',
      'serverPrefetch' ];

  var config = {
      /**
       * Option merge strategies (used in core/util/options)
       */
      // $flow-disable-line
      optionMergeStrategies: Object.create(null),
      /**
       * Whether to suppress warnings.
       */
      silent: false,
      /**
       * Show production mode tip message on boot?
       */
      productionTip: "development" !== 'production',
      /**
       * Whether to enable devtools
       */
      devtools: "development" !== 'production',
      /**
       * Whether to record perf
       */
      performance: false,
      /**
       * Error handler for watcher errors
       */
      errorHandler: null,
      /**
       * Warn handler for watcher warns
       */
      warnHandler: null,
      /**
       * Ignore certain custom elements
       */
      ignoredElements: [],
      /**
       * Custom user key aliases for v-on
       */
      // $flow-disable-line
      keyCodes: Object.create(null),
      /**
       * Check if a tag is reserved so that it cannot be registered as a
       * component. This is platform-dependent and may be overwritten.
       */
      isReservedTag: no,
      /**
       * Check if an attribute is reserved so that it cannot be used as a component
       * prop. This is platform-dependent and may be overwritten.
       */
      isReservedAttr: no,
      /**
       * Check if a tag is an unknown element.
       * Platform-dependent.
       */
      isUnknownElement: no,
      /**
       * Get the namespace of an element
       */
      getTagNamespace: noop,
      /**
       * Parse the real tag name for the specific platform.
       */
      parsePlatformTagName: identity,
      /**
       * Check if an attribute must be bound using property, e.g. value
       * Platform-dependent.
       */
      mustUseProp: no,
      /**
       * Perform updates asynchronously. Intended to be used by Vue Test Utils
       * This will significantly reduce performance if set to false.
       */
      async: true,
      /**
       * Exposed for legacy reasons
       */
      _lifecycleHooks: LIFECYCLE_HOOKS,
  };

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  /**
   * Check if a string starts with $ or _
   */
  function isReserved(str) {
      var c = (str + '').charCodeAt(0);
      return c === 0x24 || c === 0x5f;
  }
  /**
   * Define a property.
   */
  function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
          value: val,
          enumerable: !!enumerable,
          writable: true,
          configurable: true,
      });
  }
  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath(path) {
      if (bailRE.test(path)) {
          return;
      }
      var segments = path.split('.');
      return function (obj) {
          for (var i = 0; i < segments.length; i++) {
              if (!obj)
                  { return; }
              obj = obj[segments[i]];
          }
          return obj;
      };
  }

  // can we use __proto__?
  var hasProto = '__proto__' in {};
  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  (UA && UA.indexOf('android') > 0) || weexPlatform === 'android';
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === 'ios';
  UA && /chrome\/\d+/.test(UA) && !isEdge;
  UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);
  // Firefox has a "watch" function on Object.prototype...
  // @ts-expect-error firebox support
  var nativeWatch = {}.watch;
  var supportsPassive = false;
  if (inBrowser) {
      try {
          var opts = {};
          Object.defineProperty(opts, 'passive', {
              get: function get() {
                  /* istanbul ignore next */
                  supportsPassive = true;
              },
          }); // https://github.com/facebook/flow/issues/285
          window.addEventListener('test-passive', null, opts);
      }
      catch (e) { }
  }
  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
      if (_isServer === undefined) {
          /* istanbul ignore if */
          if (!inBrowser && !inWeex && typeof global !== 'undefined') {
              // detect presence of vue-server-renderer and avoid
              // Webpack shimming the process
              _isServer =
                  global['process'] && global['process'].env.VUE_ENV === 'server';
          }
          else {
              _isServer = false;
          }
      }
      return _isServer;
  };
  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  /* istanbul ignore next */
  function isNative(Ctor) {
      return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
  }
  var hasSymbol = typeof Symbol !== 'undefined' &&
      isNative(Symbol) &&
      typeof Reflect !== 'undefined' &&
      isNative(Reflect.ownKeys);
  var _Set; // $flow-disable-line
  /* istanbul ignore if */ if (typeof Set !== 'undefined' && isNative(Set)) {
      // use native Set when available.
      _Set = Set;
  }
  else {
      // a non-standard Set polyfill that only works with primitive keys.
      _Set = /*@__PURE__*/(function () {
          function Set() {
              this.set = Object.create(null);
          }
          Set.prototype.has = function has (key) {
              return this.set[key] === true;
          };
          Set.prototype.add = function add (key) {
              this.set[key] = true;
          };
          Set.prototype.clear = function clear () {
              this.set = Object.create(null);
          };

          return Set;
      }());
  }

  var warn$2 = noop;
  var tip = noop;
  var generateComponentTrace; // work around flow check
  var formatComponentName;
  {
      var hasConsole = typeof console !== 'undefined';
      var classifyRE = /(?:^|[-_])(\w)/g;
      var classify = function (str) { return str.replace(classifyRE, function (c) { return c.toUpperCase(); }).replace(/[-_]/g, ''); };
      warn$2 = function (msg, vm) {
          var trace = vm ? generateComponentTrace(vm) : '';
          if (config.warnHandler) {
              config.warnHandler.call(null, msg, vm, trace);
          }
          else if (hasConsole && !config.silent) {
              console.error(("[Vue warn]: " + msg + trace));
          }
      };
      tip = function (msg, vm) {
          if (hasConsole && !config.silent) {
              console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
          }
      };
      formatComponentName = function (vm, includeFile) {
          if (vm.$root === vm) {
              return '<Root>';
          }
          var options = typeof vm === 'function' && vm.cid != null
              ? vm.options
              : vm._isVue
                  ? vm.$options || vm.constructor.options
                  : vm;
          var name = options.name || options._componentTag;
          var file = options.__file;
          if (!name && file) {
              var match = file.match(/([^/\\]+)\.vue$/);
              name = match && match[1];
          }
          return ((name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
              (file && includeFile !== false ? (" at " + file) : ''));
      };
      var repeat$1 = function (str, n) {
          var res = '';
          while (n) {
              if (n % 2 === 1)
                  { res += str; }
              if (n > 1)
                  { str += str; }
              n >>= 1;
          }
          return res;
      };
      generateComponentTrace = function (vm) {
          if (vm._isVue && vm.$parent) {
              var tree = [];
              var currentRecursiveSequence = 0;
              while (vm) {
                  if (tree.length > 0) {
                      var last = tree[tree.length - 1];
                      if (last.constructor === vm.constructor) {
                          currentRecursiveSequence++;
                          vm = vm.$parent;
                          continue;
                      }
                      else if (currentRecursiveSequence > 0) {
                          tree[tree.length - 1] = [last, currentRecursiveSequence];
                          currentRecursiveSequence = 0;
                      }
                  }
                  tree.push(vm);
                  vm = vm.$parent;
              }
              return ('\n\nfound in\n\n' +
                  tree
                      .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat$1(' ', 5 + i * 2)) + (Array.isArray(vm)
                      ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
                      : formatComponentName(vm))); })
                      .join('\n'));
          }
          else {
              return ("\n\n(found in " + (formatComponentName(vm)) + ")");
          }
      };
  }

  var uid$2 = 0;
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
  var Dep = function Dep() {
      this.id = uid$2++;
      this.subs = [];
  };
  Dep.prototype.addSub = function addSub (sub) {
      this.subs.push(sub);
  };
  Dep.prototype.removeSub = function removeSub (sub) {
      remove$2(this.subs, sub);
  };
  // Dep.target为当前的watcher
  // 和watcher进行你中有我我中有你
  // dep收集watcher,watcher也能知道谁收集了自己
  // 在dep中依靠depend告诉watcher我收集你了
  Dep.prototype.depend = function depend () {
      if (Dep.target) {
          // 调用当前watcher的addDep
          // 在addDep中会调用这边的addSub
          Dep.target.addDep(this);
      }
  };
  // 一个一个调用subs里面watcher的update方法
  Dep.prototype.notify = function notify () {
      // stabilize the subscriber list first
      // 复制一遍subs
      var subs = this.subs.slice();
      if (!config.async) {
          // subs aren't sorted in scheduler if not running async
          // we need to sort them now to make sure they fire in correct
          // order
          subs.sort(function (a, b) { return a.id - b.id; });
      }
      for (var i = 0, l = subs.length; i < l; i++) {
          // 一个一个调用update
          subs[i].update();
      }
  };
  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  // 当前watch的实例
  // 同一时间只有一个实例会被watch
  // 但是会记录很多实例
  // Dep类有一个静态属性 target  保存当前该类对应的watcher
  // 在这里可以看成是栈顶元素
  // 为什么有上面的说法,可以看下面定义的pushTarget和popTarget函数
  Dep.target = null;
  // 一个全局变量,保存全局所有存活的watcher
  var targetStack = [];
  /**
   * 将自身的watcher对象压入栈，设置全局的变量Dep.target为当前的watcher对象。
   * @date 04/05/2021
   * @export
   * @param {(Watcher | null)} [target]
   */
  function pushTarget(target) {
      targetStack.push(target);
      Dep.target = target;
  }
  /**
   * 从全局watcher列表中弹出一个最后一个成员
   * @date 04/05/2021
   * @export
   */
  function popTarget() {
      targetStack.pop();
      Dep.target = targetStack[targetStack.length - 1];
  }

  var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
      // 当前节点标签名
      this.tag = tag;
      // 当前节点html标签上面定义的属性
      // id class show key等等
      // 是一个VNodeData类型，可以参考VNodeData类型中的数据信息
      this.data = data;
      // 当前节点的子节点，一个数组
      this.children = children;
      // 当前节点的文本
      this.text = text;
      // 当前虚拟节点对应的真实节点
      this.elm = elm;
      // 当前节点的命名空间
      this.ns = undefined;
      // 编译作用域
      this.context = context;
      // 函数化组件作用域
      this.fnContext = undefined;
      this.fnOptions = undefined;
      this.fnScopeId = undefined;
      // 节点的key属性，被当做节点的标志，用以diff优化
      this.key = data && data.key;
      // 当前节点对应的组件的options选项
      this.componentOptions = componentOptions;
      // 当前节点对应的组件的实例
      this.componentInstance = undefined;
      // 当前节点的父节点
      this.parent = undefined;
      // 简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false
      this.raw = false;
      // 静态节点的标志
      this.isStatic = false;
      // 是否作为跟节点插入
      this.isRootInsert = true;
      // 是否为注释节点
      this.isComment = false;
      // 是否为克隆节点
      this.isCloned = false;
      // 是否有v-once指令
      this.isOnce = false;
      // 异步组件的工厂方法
      this.asyncFactory = asyncFactory;
      // 异步源
      this.asyncMeta = undefined;
      // 是否异步的预赋值
      this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };
  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
      return this.componentInstance;
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );
  var createEmptyVNode = function (text) {
      if ( text === void 0 ) text = "";

      var node = new VNode();
      node.text = text;
      node.isComment = true;
      return node;
  };
  function createTextVNode(val) {
      return new VNode(undefined, undefined, undefined, String(val));
  }
  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode(vnode) {
      var cloned = new VNode(vnode.tag, vnode.data, 
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
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

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */
  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse' ];
  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
      // cache original method
      var original = arrayProto[method];
      def(arrayMethods, method, function mutator() {
          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];

          var result = original.apply(this, args);
          var ob = this.__ob__;
          var inserted;
          switch (method) {
              case 'push':
              case 'unshift':
                  inserted = args;
                  break;
              case 'splice':
                  inserted = args.slice(2);
                  break;
          }
          if (inserted)
              { ob.observeArray(inserted); }
          // notify change
          ob.dep.notify();
          return result;
      });
  });

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;
  function toggleObserving(value) {
      shouldObserve = value;
  }
  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   * Observer类能给目标对象的属性名附加getter/setter来收集依赖和发布更新
   *
   * Observer 主要是用来初始化对一个对象的监听，比如在 data 中存在一个对象成员
   * 直接给该对象成员添加属性并不会触发任何钩子函数，但是这个对象又是数据的一部分
   * 也就是说该对象发生变化也会导致DOM发生改变
   * 因此要用 Observer 来初始化监视一个对象的变化并且在变化时通知与其相关的 Watcher 来运行回调函数。
   */
  var Observer = function Observer(value) {
      // 1.初始化
      this.value = value;
      // 在对象本身增删属性或者数组变化的时候被触发的Dep
      this.dep = new Dep();
      this.vmCount = 0;
      // 给被观察对象加上__ob__属性，属性值是Observer实例
      def(value, '__ob__', this);
      if (Array.isArray(value)) {
          // can we use __proto__
          if (hasProto) {
              protoAugment(value, arrayMethods);
          }
          else {
              copyAugment(value, arrayMethods, arrayKeys);
          }
          this.observeArray(value);
      }
      else {
          this.walk(value);
      }
  };
  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   * 对每一个属性调用defineReactive，设置其getter/setter，将其变成响应式
   */
  Observer.prototype.walk = function walk (obj) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
          defineReactive(obj, keys[i]);
      }
  };
  /**
   * 对数组每一个成员使用observe
   */
  Observer.prototype.observeArray = function observeArray (items) {
      for (var i = 0, l = items.length; i < l; i++) {
          observe(items[i]);
      }
  };
  // helpers
  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   * 将target的__proto__设置为src
   */
  function protoAugment(target, src) {
      /* eslint-disable no-proto */
      target.__proto__ = src;
      /* eslint-enable no-proto */
  }
  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment(target, src, keys) {
      for (var i = 0, l = keys.length; i < l; i++) {
          var key = keys[i];
          def(target, key, src[key]);
      }
  }
  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   * 尝试创建一个该对象的观察者实例,也就是new Oberser(obj)
   * 如果成功观察，返回一个新的观察者实例
   * 如果已经存在，返回存在的观察者实例（在某些情况下不会添加）
   * 不会添加的场景包括
   * 1.修改变量shouldObserve
   * 2.非数组或者简单对象
   * 3.不可扩展
   * 4._isVue属性是真值
   *
   * 对于一个对象，vue不会直接进行`new Observer()`，而是调用`observe`方法，
   * 进行一些预处理，然后返回`Observer`类的实例。
   * 这个函数主要是用来动态返回一个`Observer`类实例，即`new Observer()`。
   * 首先判断value如果不是对象则返回`undefined`，
   * 然后检测该对象是否已经有`Observer`，有则直接返回，
   * 否则新建并将`Observer`保存在该对象的`__ob__`属性中（在构造函数中进行），
   * 然后将实例返回。
   *
   * @date 2020-02-04
   * @export
   * @param {*} value - 将被观察的对象，就是传入的data
   * @param {?boolean} asRootData - 是否是根数据
   * @returns {(Observer | void)}
   */
  function observe(value, asRootData) {
      // 如果不是个对象或者是VNode实例，就不进行观察
      if (!isObject(value) || value instanceof VNode) {
          return;
      }
      var ob;
      // 如果自身有__ob__属性并且该属性是observer的实例，证明已经存在观察者，直接返回这个属性
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
          ob = value.__ob__;
      }
      else if (
      // 没有就加一个__ob__属性
      shouldObserve && // 可观察
          !isServerRendering() && // 当前不是服务器渲染模式
          (Array.isArray(value) || isPlainObject(value)) && // 是数组或简单对象
          Object.isExtensible(value) && // 可扩展(可以添加新属性)
          !value._isVue // 不是vue实例
      ) {
          ob = new Observer(value);
      }
      if (asRootData && ob) {
          // 如果是根数据并且有observer实例，就给vmCount属性+1
          ob.vmCount++;
      }
      return ob;
  }
  /**
   * 将一个对象的属性变成响应式
   * @date 2020-04-20
   * @export
   * @param {Object} obj - 被定义的对象
   * @param {string} key - 被定义的对象的属性名
   * @param {*} val - 被定义的对象的属性值
   * @param {?Function} [customSetter]
   * @param {boolean} [shallow]
   */
  function defineReactive(obj, key, val, customSetter, shallow) {
      // 1.创建属性数据的发布器
      // 用于由对象本身修改而触发setter函数导致闭包中的Dep通知所有的Watcher对象
      var dep = new Dep();
      // 获取该属性的描述符
      var property = Object.getOwnPropertyDescriptor(obj, key);
      // 如果属性不允许被设置就直接返回undefined
      if (property && property.configurable === false) {
          return;
      }
      // 获取该属性的getter和setter,缓存一下
      // 一般是没有的，除非已经被框架或者用户定义过
      var getter = property && property.get;
      var setter = property && property.set;
      // 给val赋值
      // conputed可能会设置set或者get
      // 必须没有getter才去取值,不然会意外的触发getter
      if ((!getter || setter) && arguments.length === 2) {
          val = obj[key];
      }
      // 2.如果属性的值也是对象，递归为每个对象创建Observer对象
      var childOb = !shallow && observe(val);
      Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          get: function reactiveGetter() {
              var value = getter ? getter.call(obj) : val;
              // 依赖收集,调用watcher的addDep方法
              // Dep.target表示需要被收集的依赖，即当前的watcher
              if (Dep.target) {
                  dep.depend(); // target.addDep()
                  if (childOb) {
                      // 如果值是个对象类型，在值的dep中也depend
                      childOb.dep.depend();
                      if (Array.isArray(value)) {
                          dependArray(value);
                      }
                  }
              }
              return value;
          },
          set: function reactiveSetter(newVal) {
              var value = getter ? getter.call(obj) : val;
              /* eslint-disable no-self-compare */
              // 值没改变或者值被设置为null
              if (newVal === value || (newVal !== newVal && value !== value)) {
                  return;
              }
              /* eslint-enable no-self-compare */
              if (customSetter) {
                  customSetter();
              }
              // #7981: for accessor properties without setter
              if (getter && !setter)
                  { return; }
              if (setter) {
                  setter.call(obj, newVal);
              }
              else {
                  val = newVal;
              }
              // 重新尝试观察
              childOb = !shallow && observe(newVal);
              // 通知更新
              dep.notify();
          },
      });
  }
  /**
   * this.$set()
   * 向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。
   * 它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性
   * (比如 this.myObject.newProperty = 'hi')
   */
  function set(target, key, val) {
      if ((isUndef(target) || isPrimitive(target))) {
          warn$2(("Cannot set reactive property on undefined, null, or primitive value: " + target));
      }
      if (Array.isArray(target) && isValidArrayIndex(key)) {
          target.length = Math.max(target.length, key);
          target.splice(key, 1, val);
          return val;
      }
      if (key in target && !(key in Object.prototype)) {
          target[key] = val;
          return val;
      }
      var ob = target.__ob__;
      if (target._isVue || (ob && ob.vmCount)) {
          warn$2('Avoid adding reactive properties to a Vue instance or its root $data ' +
                  'at runtime - declare it upfront in the data option.');
          return val;
      }
      if (!ob) {
          target[key] = val;
          return val;
      }
      defineReactive(ob.value, key, val);
      ob.dep.notify();
      return val;
  }
  /**
   * 删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。
   * 这个方法主要用于避开 Vue 不能检测到 property 被删除的限制，但是你应该很少会使用它。
   * this.$delete
   */
  function del(target, key) {
      if ((isUndef(target) || isPrimitive(target))) {
          warn$2(("Cannot delete reactive property on undefined, null, or primitive value: " + target));
      }
      if (Array.isArray(target) && isValidArrayIndex(key)) {
          target.splice(key, 1);
          return;
      }
      var ob = target.__ob__;
      if (target._isVue || (ob && ob.vmCount)) {
          warn$2('Avoid deleting properties on a Vue instance or its root $data ' +
                  '- just set it to null.');
          return;
      }
      if (!hasOwn(target, key)) {
          return;
      }
      delete target[key];
      if (!ob) {
          return;
      }
      ob.dep.notify();
  }
  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray(value) {
      for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
          e = value[i];
          e && e.__ob__ && e.__ob__.dep.depend();
          if (Array.isArray(e)) {
              dependArray(e);
          }
      }
  }

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;
  /**
   * Options with restrictions
   */
  {
      strats.el = strats.propsData = function (parent, child, vm, key) {
          if (!vm) {
              warn$2("option \"" + key + "\" can only be used during instance " +
                  'creation with the `new` keyword.');
          }
          return defaultStrat(parent, child);
      };
  }
  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData(to, from) {
      if (!from)
          { return to; }
      var key, toVal, fromVal;
      var keys = hasSymbol
          ? Reflect.ownKeys(from)
          : Object.keys(from);
      for (var i = 0; i < keys.length; i++) {
          key = keys[i];
          // in case the object is already observed...
          if (key === '__ob__')
              { continue; }
          toVal = to[key];
          fromVal = from[key];
          if (!hasOwn(to, key)) {
              set(to, key, fromVal);
          }
          else if (toVal !== fromVal &&
              isPlainObject(toVal) &&
              isPlainObject(fromVal)) {
              mergeData(toVal, fromVal);
          }
      }
      return to;
  }
  /**
   * Data
   */
  function mergeDataOrFn(parentVal, childVal, vm) {
      if (!vm) {
          // in a Vue.extend merge, both should be functions
          if (!childVal) {
              return parentVal;
          }
          if (!parentVal) {
              return childVal;
          }
          // when parentVal & childVal are both present,
          // we need to return a function that returns the
          // merged result of both functions... no need to
          // check if parentVal is a function here because
          // it has to be a function to pass previous merges.
          return function mergedDataFn() {
              return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
          };
      }
      else {
          return function mergedInstanceDataFn() {
              // instance merge
              var instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
              var defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal;
              if (instanceData) {
                  return mergeData(instanceData, defaultData);
              }
              else {
                  return defaultData;
              }
          };
      }
  }
  strats.data = function (parentVal, childVal, vm) {
      if (!vm) {
          if (childVal && typeof childVal !== 'function') {
              warn$2('The "data" option should be a function ' +
                      'that returns a per-instance value in component ' +
                      'definitions.', vm);
              return parentVal;
          }
          return mergeDataOrFn(parentVal, childVal);
      }
      return mergeDataOrFn(parentVal, childVal, vm);
  };
  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook$1(parentVal, childVal) {
      var res = childVal
          ? parentVal
              ? parentVal.concat(childVal)
              : Array.isArray(childVal)
                  ? childVal
                  : [childVal]
          : parentVal;
      return res ? dedupeHooks(res) : res;
  }
  function dedupeHooks(hooks) {
      var res = [];
      for (var i = 0; i < hooks.length; i++) {
          if (res.indexOf(hooks[i]) === -1) {
              res.push(hooks[i]);
          }
      }
      return res;
  }
  LIFECYCLE_HOOKS.forEach(function (hook) {
      strats[hook] = mergeHook$1;
  });
  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets(parentVal, childVal, vm, key) {
      var res = Object.create(parentVal || null);
      if (childVal) {
          assertObjectType(key, childVal, vm);
          return extend(res, childVal);
      }
      else {
          return res;
      }
  }
  ASSET_TYPES.forEach(function (type) {
      strats[type + 's'] = mergeAssets;
  });
  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (parentVal, childVal, vm, key) {
      // work around Firefox's Object.prototype.watch...
      //@ts-expect-error work around
      if (parentVal === nativeWatch)
          { parentVal = undefined; }
      //@ts-expect-error work around
      if (childVal === nativeWatch)
          { childVal = undefined; }
      /* istanbul ignore if */
      if (!childVal)
          { return Object.create(parentVal || null); }
      {
          assertObjectType(key, childVal, vm);
      }
      if (!parentVal)
          { return childVal; }
      var ret = {};
      extend(ret, parentVal);
      for (var key$1 in childVal) {
          var parent = ret[key$1];
          var child = childVal[key$1];
          if (parent && !Array.isArray(parent)) {
              parent = [parent];
          }
          ret[key$1] = parent
              ? parent.concat(child)
              : Array.isArray(child)
                  ? child
                  : [child];
      }
      return ret;
  };
  /**
   * Other object hashes.
   */
  strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal, vm, key) {
      if (childVal && "development" !== 'production') {
          assertObjectType(key, childVal, vm);
      }
      if (!parentVal)
          { return childVal; }
      var ret = Object.create(null);
      extend(ret, parentVal);
      if (childVal)
          { extend(ret, childVal); }
      return ret;
  };
  strats.provide = mergeDataOrFn;
  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
      return childVal === undefined ? parentVal : childVal;
  };
  /**
   * Validate component names
   */
  function checkComponents(options) {
      for (var key in options.components) {
          validateComponentName(key);
      }
  }
  function validateComponentName(name) {
      if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
          warn$2('Invalid component name: "' +
              name +
              '". Component names ' +
              'should conform to valid custom element name in html5 specification.');
      }
      if (isBuiltInTag(name) || config.isReservedTag(name)) {
          warn$2('Do not use built-in or reserved HTML elements as component ' +
              'id: ' +
              name);
      }
  }
  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps(options, vm) {
      var props = options.props;
      if (!props)
          { return; }
      var res = {};
      var i, val, name;
      if (Array.isArray(props)) {
          i = props.length;
          while (i--) {
              val = props[i];
              if (typeof val === 'string') {
                  name = camelize(val);
                  res[name] = { type: null };
              }
              else {
                  warn$2('props must be strings when using array syntax.');
              }
          }
      }
      else if (isPlainObject(props)) {
          for (var key in props) {
              val = props[key];
              name = camelize(key);
              res[name] = isPlainObject(val) ? val : { type: val };
          }
      }
      else {
          warn$2("Invalid value for option \"props\": expected an Array or an Object, " +
              "but got " + (toRawType(props)) + ".", vm);
      }
      options.props = res;
  }
  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject(options, vm) {
      var inject = options.inject;
      if (!inject)
          { return; }
      var normalized = (options.inject = {});
      if (Array.isArray(inject)) {
          for (var i = 0; i < inject.length; i++) {
              normalized[inject[i]] = { from: inject[i] };
          }
      }
      else if (isPlainObject(inject)) {
          for (var key in inject) {
              var val = inject[key];
              normalized[key] = isPlainObject(val)
                  ? extend({ from: key }, val)
                  : { from: val };
          }
      }
      else {
          warn$2("Invalid value for option \"inject\": expected an Array or an Object, " +
              "but got " + (toRawType(inject)) + ".", vm);
      }
  }
  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives$1(options) {
      var dirs = options.directives;
      if (dirs) {
          for (var key in dirs) {
              var def = dirs[key];
              if (typeof def === 'function') {
                  dirs[key] = { bind: def, update: def };
              }
          }
      }
  }
  function assertObjectType(name, value, vm) {
      if (!isPlainObject(value)) {
          warn$2("Invalid value for option \"" + name + "\": expected an Object, " +
              "but got " + (toRawType(value)) + ".", vm);
      }
  }
  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions(parent, child, vm) {
      {
          checkComponents(child);
      }
      if (typeof child === 'function') {
          // @ts-expect-error
          child = child.options;
      }
      normalizeProps(child, vm);
      normalizeInject(child, vm);
      normalizeDirectives$1(child);
      // Apply extends and mixins on the child options,
      // but only if it is a raw options object that isn't
      // the result of another mergeOptions call.
      // Only merged options has the _base property.
      if (!child._base) {
          if (child.extends) {
              parent = mergeOptions(parent, child.extends, vm);
          }
          if (child.mixins) {
              for (var i = 0, l = child.mixins.length; i < l; i++) {
                  parent = mergeOptions(parent, child.mixins[i], vm);
              }
          }
      }
      var options = {};
      var key;
      for (key in parent) {
          mergeField(key);
      }
      for (key in child) {
          if (!hasOwn(parent, key)) {
              mergeField(key);
          }
      }
      function mergeField(key) {
          var strat = strats[key] || defaultStrat;
          options[key] = strat(parent[key], child[key], vm, key);
      }
      return options;
  }
  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset(options, type, id, warnMissing) {
      /* istanbul ignore if */
      if (typeof id !== 'string') {
          return;
      }
      var assets = options[type];
      // check local registration variations first
      if (hasOwn(assets, id))
          { return assets[id]; }
      var camelizedId = camelize(id);
      if (hasOwn(assets, camelizedId))
          { return assets[camelizedId]; }
      var PascalCaseId = capitalize(camelizedId);
      if (hasOwn(assets, PascalCaseId))
          { return assets[PascalCaseId]; }
      // fallback to prototype chain
      var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
      if (warnMissing && !res) {
          warn$2('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
      }
      return res;
  }

  function validateProp(key, propOptions, propsData, vm) {
      var prop = propOptions[key];
      var absent = !hasOwn(propsData, key);
      var value = propsData[key];
      // boolean casting
      var booleanIndex = getTypeIndex(Boolean, prop.type);
      if (booleanIndex > -1) {
          if (absent && !hasOwn(prop, 'default')) {
              value = false;
          }
          else if (value === '' || value === hyphenate(key)) {
              // only cast empty string / same name to boolean if
              // boolean has higher priority
              var stringIndex = getTypeIndex(String, prop.type);
              if (stringIndex < 0 || booleanIndex < stringIndex) {
                  value = true;
              }
          }
      }
      // check default value
      if (value === undefined) {
          value = getPropDefaultValue(vm, prop, key);
          // since the default value is a fresh copy,
          // make sure to observe it.
          var prevShouldObserve = shouldObserve;
          toggleObserving(true);
          observe(value);
          toggleObserving(prevShouldObserve);
      }
      {
          assertProp(prop, key, value, vm, absent);
      }
      return value;
  }
  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue(vm, prop, key) {
      // no default, return undefined
      if (!hasOwn(prop, 'default')) {
          return undefined;
      }
      var def = prop.default;
      // warn against non-factory defaults for Object & Array
      if (isObject(def)) {
          warn$2('Invalid default value for prop "' +
              key +
              '": ' +
              'Props with type Object/Array must use a factory function ' +
              'to return the default value.', vm);
      }
      // the raw prop value was also undefined from previous render,
      // return previous default value to avoid unnecessary watcher trigger
      if (vm &&
          vm.$options.propsData &&
          vm.$options.propsData[key] === undefined &&
          vm._props[key] !== undefined) {
          return vm._props[key];
      }
      // call factory function for non-Function types
      // a value is Function if its prototype is function even across different execution context
      return typeof def === 'function' && getType(prop.type) !== 'Function'
          ? def.call(vm)
          : def;
  }
  /**
   * Assert whether a prop is valid.
   */
  function assertProp(prop, name, value, vm, absent) {
      if (prop.required && absent) {
          warn$2('Missing required prop: "' + name + '"', vm);
          return;
      }
      if (value == null && !prop.required) {
          return;
      }
      var type = prop.type;
      var valid = !type || type === true;
      var expectedTypes = [];
      if (type) {
          if (!Array.isArray(type)) {
              type = [type];
          }
          for (var i = 0; i < type.length && !valid; i++) {
              var assertedType = assertType(value, type[i], vm);
              expectedTypes.push(assertedType.expectedType || '');
              valid = assertedType.valid;
          }
      }
      var haveExpectedTypes = expectedTypes.some(function (t) { return t; });
      if (!valid && haveExpectedTypes) {
          warn$2(getInvalidTypeMessage(name, value, expectedTypes), vm);
          return;
      }
      var validator = prop.validator;
      if (validator) {
          if (!validator(value)) {
              warn$2('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
          }
      }
  }
  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;
  function assertType(value, type, vm) {
      var valid;
      var expectedType = getType(type);
      if (simpleCheckRE.test(expectedType)) {
          var t = typeof value;
          valid = t === expectedType.toLowerCase();
          // for primitive wrapper objects
          if (!valid && t === 'object') {
              valid = value instanceof type;
          }
      }
      else if (expectedType === 'Object') {
          valid = isPlainObject(value);
      }
      else if (expectedType === 'Array') {
          valid = Array.isArray(value);
      }
      else {
          try {
              valid = value instanceof type;
          }
          catch (e) {
              warn$2('Invalid prop type: "' + String(type) + '" is not a constructor', vm);
              valid = false;
          }
      }
      return {
          valid: valid,
          expectedType: expectedType,
      };
  }
  var functionTypeCheckRE = /^\s*function (\w+)/;
  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType(fn) {
      var match = fn && fn.toString().match(functionTypeCheckRE);
      return match ? match[1] : '';
  }
  function isSameType(a, b) {
      return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
      if (!Array.isArray(expectedTypes)) {
          return isSameType(expectedTypes, type) ? 0 : -1;
      }
      for (var i = 0, len = expectedTypes.length; i < len; i++) {
          if (isSameType(expectedTypes[i], type)) {
              return i;
          }
      }
      return -1;
  }
  function getInvalidTypeMessage(name, value, expectedTypes) {
      var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
          " Expected " + (expectedTypes.map(capitalize).join(', '));
      var expectedType = expectedTypes[0];
      var receivedType = toRawType(value);
      // check if we need to specify expected value
      if (expectedTypes.length === 1 &&
          isExplicable(expectedType) &&
          isExplicable(typeof value) &&
          !isBoolean(expectedType, receivedType)) {
          message += " with value " + (styleValue(value, expectedType));
      }
      message += ", got " + receivedType + " ";
      // check if we need to specify received value
      if (isExplicable(receivedType)) {
          message += "with value " + (styleValue(value, receivedType)) + ".";
      }
      return message;
  }
  function styleValue(value, type) {
      if (type === 'String') {
          return ("\"" + value + "\"");
      }
      else if (type === 'Number') {
          return ("" + (Number(value)));
      }
      else {
          return ("" + value);
      }
  }
  var EXPLICABLE_TYPES = ['string', 'number', 'boolean'];
  function isExplicable(value) {
      return EXPLICABLE_TYPES.some(function (elem) { return value.toLowerCase() === elem; });
  }
  function isBoolean() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; });
  }

  function handleError(err, vm, info) {
      // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
      // See: https://github.com/vuejs/vuex/issues/1505
      pushTarget();
      try {
          if (vm) {
              var cur = vm;
              while ((cur = cur.$parent)) {
                  var hooks = cur.$options.errorCaptured;
                  if (hooks) {
                      for (var i = 0; i < hooks.length; i++) {
                          try {
                              var capture = hooks[i].call(cur, err, vm, info) === false;
                              if (capture)
                                  { return; }
                          }
                          catch (e) {
                              globalHandleError(e, cur, 'errorCaptured hook');
                          }
                      }
                  }
              }
          }
          globalHandleError(err, vm, info);
      }
      finally {
          popTarget();
      }
  }
  function invokeWithErrorHandling(handler, context, args, vm, info) {
      var res;
      try {
          res = args ? handler.apply(context, args) : handler.call(context);
          if (res && !res._isVue && isPromise(res) && !res._handled) {
              res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
              // issue #9511
              // avoid catch triggering multiple times when nested calls
              res._handled = true;
          }
      }
      catch (e) {
          handleError(e, vm, info);
      }
      return res;
  }
  function globalHandleError(err, vm, info) {
      if (config.errorHandler) {
          try {
              return config.errorHandler.call(null, err, vm, info);
          }
          catch (e) {
              // if the user intentionally throws the original error in the handler,
              // do not log it twice
              if (e !== err) {
                  logError(e, null, 'config.errorHandler');
              }
          }
      }
      logError(err, vm, info);
  }
  function logError(err, vm, info) {
      {
          warn$2(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
      }
      /* istanbul ignore else */
      if ((inBrowser || inWeex) && typeof console !== 'undefined') {
          console.error(err);
      }
      else {
          throw err;
      }
  }

  /* globals MutationObserver */
  var isUsingMicroTask = false;
  var callbacks = [];
  var pending = false;
  function flushCallbacks() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
          copies[i]();
      }
  }
  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;
  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
      var p = Promise.resolve();
      timerFunc = function () {
          p.then(flushCallbacks);
          // In problematic UIWebViews, Promise.then doesn't completely break, but
          // it can get stuck in a weird state where callbacks are pushed into the
          // microtask queue but the queue isn't being flushed, until the browser
          // needs to do some other work, e.g. handle a timer. Therefore we can
          // "force" the microtask queue to be flushed by adding an empty timer.
          if (isIOS)
              { setTimeout(noop); }
      };
      isUsingMicroTask = true;
  }
  else if (!isIE &&
      typeof MutationObserver !== 'undefined' &&
      (isNative(MutationObserver) ||
          // PhantomJS and iOS 7.x
          MutationObserver.toString() === '[object MutationObserverConstructor]')) {
      // Use MutationObserver where native Promise is not available,
      // e.g. PhantomJS, iOS7, Android 4.4
      // (#6466 MutationObserver is unreliable in IE11)
      var counter = 1;
      var observer = new MutationObserver(flushCallbacks);
      var textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
          characterData: true,
      });
      timerFunc = function () {
          counter = (counter + 1) % 2;
          textNode.data = String(counter);
      };
      isUsingMicroTask = true;
  }
  else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
      // Fallback to setImmediate.
      // Technically it leverages the (macro) task queue,
      // but it is still a better choice than setTimeout.
      timerFunc = function () {
          setImmediate(flushCallbacks);
      };
  }
  else {
      // Fallback to setTimeout.
      timerFunc = function () {
          setTimeout(flushCallbacks, 0);
      };
  }
  function nextTick(cb, ctx) {
      var _resolve;
      callbacks.push(function () {
          if (cb) {
              try {
                  cb.call(ctx);
              }
              catch (e) {
                  handleError(e, ctx, 'nextTick');
              }
          }
          else if (_resolve) {
              _resolve(ctx);
          }
      });
      if (!pending) {
          pending = true;
          timerFunc();
      }
      // $flow-disable-line
      if (!cb && typeof Promise !== 'undefined') {
          return new Promise(function (resolve) {
              _resolve = resolve;
          });
      }
  }

  var mark;
  var measure;
  {
      var perf = inBrowser && window.performance;
      /* istanbul ignore if */
      if (perf &&
          perf.mark &&
          perf.measure &&
          perf.clearMarks &&
          perf.clearMeasures) {
          mark = function (tag) { return perf.mark(tag); };
          measure = function (name, startTag, endTag) {
              perf.measure(name, startTag, endTag);
              perf.clearMarks(startTag);
              perf.clearMarks(endTag);
              // perf.clearMeasures(name)
          };
      }
  }

  /* not type checking this file because flow doesn't play well with Proxy */
  var initProxy;
  {
      var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' +
          'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
          'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
          'require' // for Webpack/Browserify
      );
      var warnNonPresent = function (target, key) {
          warn$2("Property or method \"" + key + "\" is not defined on the instance but " +
              'referenced during render. Make sure that this property is reactive, ' +
              'either in the data option, or for class-based components, by ' +
              'initializing the property. ' +
              'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
      };
      var warnReservedPrefix = function (target, key) {
          warn$2("Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
              'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
              'prevent conflicts with Vue internals. ' +
              'See: https://vuejs.org/v2/api/#data', target);
      };
      var hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);
      if (hasProxy) {
          var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
          config.keyCodes = new Proxy(config.keyCodes, {
              set: function set(target, key, value) {
                  if (isBuiltInModifier(key)) {
                      warn$2(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
                      return false;
                  }
                  else {
                      target[key] = value;
                      return true;
                  }
              },
          });
      }
      var hasHandler = {
          has: function has(target, key) {
              var has = key in target;
              var isAllowed = allowedGlobals(key) ||
                  (typeof key === 'string' &&
                      key.charAt(0) === '_' &&
                      !(key in target.$data));
              if (!has && !isAllowed) {
                  if (key in target.$data)
                      { warnReservedPrefix(target, key); }
                  else
                      { warnNonPresent(target, key); }
              }
              return has || !isAllowed;
          },
      };
      var getHandler = {
          get: function get(target, key) {
              if (typeof key === 'string' && !(key in target)) {
                  if (key in target.$data)
                      { warnReservedPrefix(target, key); }
                  else
                      { warnNonPresent(target, key); }
              }
              return target[key];
          },
      };
      initProxy = function initProxy(vm) {
          if (hasProxy) {
              // determine which proxy handler to use
              var options = vm.$options;
              var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
              vm._renderProxy = new Proxy(vm, handlers);
          }
          else {
              vm._renderProxy = vm;
          }
      };
  }

  var seenObjects = new _Set();
  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse(val) {
      _traverse(val, seenObjects);
      seenObjects.clear();
  }
  function _traverse(val, seen) {
      var i, keys;
      var isA = Array.isArray(val);
      if ((!isA && !isObject(val)) ||
          Object.isFrozen(val) ||
          val instanceof VNode) {
          return;
      }
      if (val.__ob__) {
          var depId = val.__ob__.dep.id;
          if (seen.has(depId)) {
              return;
          }
          seen.add(depId);
      }
      if (isA) {
          i = val.length;
          while (i--)
              { _traverse(val[i], seen); }
      }
      else {
          keys = Object.keys(val);
          i = keys.length;
          while (i--)
              { _traverse(val[keys[i]], seen); }
      }
  }

  var normalizeEvent = cached(function (name) {
      var passive = name.charAt(0) === '&';
      name = passive ? name.slice(1) : name;
      var once = name.charAt(0) === '~'; // Prefixed last, checked first
      name = once ? name.slice(1) : name;
      var capture = name.charAt(0) === '!';
      name = capture ? name.slice(1) : name;
      return {
          name: name,
          once: once,
          capture: capture,
          passive: passive,
      };
  });
  /**
   * 创建事件调用者
   *
   * @date 16/04/2021
   * @export
   * @param {(Function | Array<Function>)} fns
   * @param {Component} [vm]
   * @return {*}  {Function}
   */
  function createFnInvoker(fns, vm) {
      function invoker() {
          var arguments$1 = arguments;

          var fns = invoker.fns;
          if (Array.isArray(fns)) {
              var cloned = fns.slice();
              for (var i = 0; i < cloned.length; i++) {
                  invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
              }
          }
          else {
              // return handler return value for single handlers
              return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
          }
      }
      invoker.fns = fns;
      return invoker;
  }
  /**
   * 更新实例上的事件监听列表
   *
   * @date 15/04/2021
   * @export
   * @param {Object} on
   * @param {Object} oldOn
   * @param {Function} add
   * @param {Function} remove
   * @param {Function} createOnceHandler
   * @param {Component} vm
   */
  function updateListeners(on, oldOn, add, remove, createOnceHandler, vm) {
      var name, cur, old, event;
      for (name in on) {
          // 循环事件名称
          cur = on[name];
          old = oldOn[name];
          // 格式化event名称,去掉& ~ ！符号
          event = normalizeEvent(name);
          // 绑定的事件，undefined检查
          if (isUndef(cur)) {
              warn$2("Invalid handler for event \"" + (event.name) + "\": got " + String(cur), vm);
          }
          else if (isUndef(old)) {
              // 如果同名老事件为undefined
              if (isUndef(cur.fns)) {
                  // 如果新事件的fns对象为undefined
                  // 创建事件函数调用器
                  cur = on[name] = createFnInvoker(cur, vm);
              }
              if (isTrue(event.once)) {
                  // 如果加了once，把事件转成once事件
                  cur = on[name] = createOnceHandler(event.name, cur, event.capture);
              }
              add(event.name, cur, event.capture, event.passive, event.params);
          }
          else if (cur !== old) {
              // 新事件覆盖老事件
              old.fns = cur;
              on[name] = old;
          }
      }
      // 遍历oldOn内的事件
      // 如果在新的事件列表中不存在，就删掉它
      for (name in oldOn) {
          if (isUndef(on[name])) {
              event = normalizeEvent(name);
              remove(event.name, oldOn[name], event.capture);
          }
      }
  }

  function mergeVNodeHook(def, hookKey, hook) {
      if (def instanceof VNode) {
          def = def.data.hook || (def.data.hook = {});
      }
      var invoker;
      var oldHook = def[hookKey];
      function wrappedHook() {
          hook.apply(this, arguments);
          // important: remove merged hook to ensure it's called only once
          // and prevent memory leak
          remove$2(invoker.fns, wrappedHook);
      }
      if (isUndef(oldHook)) {
          // no existing hook
          invoker = createFnInvoker([wrappedHook]);
      }
      else {
          /* istanbul ignore if */
          if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
              // already a merged invoker
              invoker = oldHook;
              invoker.fns.push(wrappedHook);
          }
          else {
              // existing plain hook
              invoker = createFnInvoker([oldHook, wrappedHook]);
          }
      }
      invoker.merged = true;
      def[hookKey] = invoker;
  }

  function extractPropsFromVNodeData(data, Ctor, tag) {
      // we are only extracting raw values here.
      // validation and default values are handled in the child
      // component itself.
      var propOptions = Ctor.options.props;
      if (isUndef(propOptions)) {
          return;
      }
      var res = {};
      var attrs = data.attrs;
      var props = data.props;
      if (isDef(attrs) || isDef(props)) {
          for (var key in propOptions) {
              var altKey = hyphenate(key);
              {
                  var keyInLowerCase = key.toLowerCase();
                  if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
                      tip("Prop \"" + keyInLowerCase + "\" is passed to component " +
                          (formatComponentName(
                          // @ts-expect-error tag is string
                          tag || Ctor)) + ", but the declared prop name is" +
                          " \"" + key + "\". " +
                          "Note that HTML attributes are case-insensitive and camelCased " +
                          "props need to use their kebab-case equivalents when using in-DOM " +
                          "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
                  }
              }
              checkProp(res, props, key, altKey, true) ||
                  checkProp(res, attrs, key, altKey, false);
          }
      }
      return res;
  }
  function checkProp(res, hash, key, altKey, preserve) {
      if (isDef(hash)) {
          if (hasOwn(hash, key)) {
              res[key] = hash[key];
              if (!preserve) {
                  delete hash[key];
              }
              return true;
          }
          else if (hasOwn(hash, altKey)) {
              res[key] = hash[altKey];
              if (!preserve) {
                  delete hash[altKey];
              }
              return true;
          }
      }
      return false;
  }

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:
  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren(children) {
      for (var i = 0; i < children.length; i++) {
          if (Array.isArray(children[i])) {
              return Array.prototype.concat.apply([], children);
          }
      }
      return children;
  }
  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren(children) {
      return isPrimitive(children)
          ? [createTextVNode(children)]
          : Array.isArray(children)
              ? normalizeArrayChildren(children)
              : undefined;
  }
  function isTextNode(node) {
      return isDef(node) && isDef(node.text) && isFalse(node.isComment);
  }
  function normalizeArrayChildren(children, nestedIndex) {
      var res = [];
      var i, c, lastIndex, last;
      for (i = 0; i < children.length; i++) {
          c = children[i];
          if (isUndef(c) || typeof c === 'boolean')
              { continue; }
          lastIndex = res.length - 1;
          last = res[lastIndex];
          //  nested
          if (Array.isArray(c)) {
              if (c.length > 0) {
                  c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
                  // merge adjacent text nodes
                  if (isTextNode(c[0]) && isTextNode(last)) {
                      res[lastIndex] = createTextVNode(last.text + c[0].text);
                      c.shift();
                  }
                  res.push.apply(res, c);
              }
          }
          else if (isPrimitive(c)) {
              if (isTextNode(last)) {
                  // merge adjacent text nodes
                  // this is necessary for SSR hydration because text nodes are
                  // essentially merged when rendered to HTML strings
                  res[lastIndex] = createTextVNode(last.text + c);
              }
              else if (c !== '') {
                  // convert primitive to vnode
                  res.push(createTextVNode(c));
              }
          }
          else {
              if (isTextNode(c) && isTextNode(last)) {
                  // merge adjacent text nodes
                  res[lastIndex] = createTextVNode(last.text + c.text);
              }
              else {
                  // default key for nested array children (likely generated by v-for)
                  if (isTrue(children._isVList) &&
                      isDef(c.tag) &&
                      isUndef(c.key) &&
                      isDef(nestedIndex)) {
                      c.key = "__vlist" + nestedIndex + "_" + i + "__";
                  }
                  res.push(c);
              }
          }
      }
      return res;
  }

  function initProvide(vm) {
      var provide = vm.$options.provide;
      if (provide) {
          vm._provided =
              typeof provide === 'function'
                  ? // @ts-expect-error typing not correct
                      provide.call(vm)
                  : provide;
      }
  }
  function initInjections(vm) {
      var result = resolveInject(vm.$options.inject, vm);
      if (result) {
          toggleObserving(false);
          Object.keys(result).forEach(function (key) {
              /* istanbul ignore else */
              {
                  defineReactive(vm, key, result[key], function () {
                      warn$2("Avoid mutating an injected value directly since the changes will be " +
                          "overwritten whenever the provided component re-renders. " +
                          "injection being mutated: \"" + key + "\"", vm);
                  });
              }
          });
          toggleObserving(true);
      }
  }
  function resolveInject(inject, vm) {
      if (inject) {
          // inject is :any because flow is not smart enough to figure out cached
          var result = Object.create(null);
          var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);
          for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              // #6574 in case the inject object is observed...
              if (key === '__ob__')
                  { continue; }
              var provideKey = inject[key].from;
              var source = vm;
              while (source) {
                  if (source._provided && hasOwn(source._provided, provideKey)) {
                      result[key] = source._provided[provideKey];
                      break;
                  }
                  // @ts-expect-error
                  source = source.$parent;
              }
              if (!source) {
                  if ('default' in inject[key]) {
                      var provideDefault = inject[key].default;
                      result[key] =
                          typeof provideDefault === 'function'
                              ? provideDefault.call(vm)
                              : provideDefault;
                  }
                  else {
                      warn$2(("Injection \"" + key + "\" not found"), vm);
                  }
              }
          }
          return result;
      }
  }

  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots(children, context) {
      if (!children || !children.length) {
          return {};
      }
      var slots = {};
      for (var i = 0, l = children.length; i < l; i++) {
          var child = children[i];
          var data = child.data;
          // remove slot attribute if the node is resolved as a Vue slot node
          if (data && data.attrs && data.attrs.slot) {
              delete data.attrs.slot;
          }
          // named slots should only be respected if the vnode was rendered in the
          // same context.
          if ((child.context === context || child.fnContext === context) &&
              data &&
              data.slot != null) {
              var name = data.slot;
              var slot = slots[name] || (slots[name] = []);
              if (child.tag === 'template') {
                  slot.push.apply(slot, child.children || []);
              }
              else {
                  slot.push(child);
              }
          }
          else {
              (slots.default || (slots.default = [])).push(child);
          }
      }
      // ignore slots that contains only whitespace
      for (var name$1 in slots) {
          if (slots[name$1].every(isWhitespace)) {
              delete slots[name$1];
          }
      }
      return slots;
  }
  function isWhitespace(node) {
      return (node.isComment && !node.asyncFactory) || node.text === ' ';
  }

  function normalizeScopedSlots(slots, normalSlots, prevSlots) {
      var res;
      var hasNormalSlots = Object.keys(normalSlots).length > 0;
      var isStable = slots ? !!slots.$stable : !hasNormalSlots;
      var key = slots && slots.$key;
      if (!slots) {
          res = {};
      }
      else if (slots._normalized) {
          // fast path 1: child component re-render only, parent did not change
          return slots._normalized;
      }
      else if (isStable &&
          prevSlots &&
          prevSlots !== emptyObject &&
          key === prevSlots.$key &&
          !hasNormalSlots &&
          !prevSlots.$hasNormal) {
          // fast path 2: stable scoped slots w/ no normal slots to proxy,
          // only need to normalize once
          return prevSlots;
      }
      else {
          res = {};
          for (var key$1 in slots) {
              if (slots[key$1] && key$1[0] !== '$') {
                  res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
              }
          }
      }
      // expose normal slots on scopedSlots
      for (var key$2 in normalSlots) {
          if (!(key$2 in res)) {
              res[key$2] = proxyNormalSlot(normalSlots, key$2);
          }
      }
      // avoriaz seems to mock a non-extensible $scopedSlots object
      // and when that is passed down this would cause an error
      if (slots && Object.isExtensible(slots)) {
          slots._normalized = res;
      }
      def(res, '$stable', isStable);
      def(res, '$key', key);
      def(res, '$hasNormal', hasNormalSlots);
      return res;
  }
  function normalizeScopedSlot(normalSlots, key, fn) {
      var normalized = function () {
          var res = arguments.length ? fn.apply(null, arguments) : fn({});
          res =
              res && typeof res === 'object' && !Array.isArray(res)
                  ? [res] // single vnode
                  : normalizeChildren(res);
          return res && (res.length === 0 || (res.length === 1 && res[0].isComment)) // #9658
              ? undefined
              : res;
      };
      // this is a slot using the new v-slot syntax without scope. although it is
      // compiled as a scoped slot, render fn users would expect it to be present
      // on this.$slots because the usage is semantically a normal slot.
      if (fn.proxy) {
          Object.defineProperty(normalSlots, key, {
              get: normalized,
              enumerable: true,
              configurable: true,
          });
      }
      return normalized;
  }
  function proxyNormalSlot(slots, key) {
      return function () { return slots[key]; };
  }

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList(val, render) {
      var ret = null, i, l, keys, key;
      if (Array.isArray(val) || typeof val === 'string') {
          ret = new Array(val.length);
          for (i = 0, l = val.length; i < l; i++) {
              ret[i] = render(val[i], i);
          }
      }
      else if (typeof val === 'number') {
          ret = new Array(val);
          for (i = 0; i < val; i++) {
              ret[i] = render(i + 1, i);
          }
      }
      else if (isObject(val)) {
          if (hasSymbol && val[Symbol.iterator]) {
              ret = [];
              var iterator = val[Symbol.iterator]();
              var result = iterator.next();
              while (!result.done) {
                  ret.push(render(result.value, ret.length));
                  result = iterator.next();
              }
          }
          else {
              keys = Object.keys(val);
              ret = new Array(keys.length);
              for (i = 0, l = keys.length; i < l; i++) {
                  key = keys[i];
                  ret[i] = render(val[key], key, i);
              }
          }
      }
      if (!isDef(ret)) {
          ret = [];
      }
      ret._isVList = true;
      return ret;
  }

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot(name, fallback, props, bindObject) {
      var scopedSlotFn = this.$scopedSlots[name];
      var nodes;
      if (scopedSlotFn) {
          // scoped slot
          props = props || {};
          if (bindObject) {
              if (!isObject(bindObject)) {
                  warn$2('slot v-bind without argument expects an Object', this);
              }
              props = extend(extend({}, bindObject), props);
          }
          nodes = scopedSlotFn(props) || fallback;
      }
      else {
          nodes = this.$slots[name] || fallback;
      }
      var target = props && props.slot;
      if (target) {
          return this.$createElement('template', { slot: target }, nodes);
      }
      else {
          return nodes;
      }
  }

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter(id) {
      return resolveAsset(this.$options, 'filters', id, true) || identity;
  }

  function isKeyNotMatch(expect, actual) {
      if (Array.isArray(expect)) {
          return expect.indexOf(actual) === -1;
      }
      else {
          return expect !== actual;
      }
  }
  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
      var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
      if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
          return isKeyNotMatch(builtInKeyName, eventKeyName);
      }
      else if (mappedKeyCode) {
          return isKeyNotMatch(mappedKeyCode, eventKeyCode);
      }
      else if (eventKeyName) {
          return hyphenate(eventKeyName) !== key;
      }
  }

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps(data, tag, value, asProp, isSync) {
      if (value) {
          if (!isObject(value)) {
              warn$2('v-bind without argument expects an Object or Array value', this);
          }
          else {
              if (Array.isArray(value)) {
                  value = toObject(value);
              }
              var hash;
              var loop = function ( key ) {
                  if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
                      hash = data;
                  }
                  else {
                      var type = data.attrs && data.attrs.type;
                      hash =
                          asProp || config.mustUseProp(tag, type, key)
                              ? data.domProps || (data.domProps = {})
                              : data.attrs || (data.attrs = {});
                  }
                  var camelizedKey = camelize(key);
                  var hyphenatedKey = hyphenate(key);
                  if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
                      hash[key] = value[key];
                      if (isSync) {
                          var on = data.on || (data.on = {});
                          on[("update:" + key)] = function ($event) {
                              value[key] = $event;
                          };
                      }
                  }
              };

              for (var key in value) loop( key );
          }
      }
      return data;
  }

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic(index, isInFor) {
      var cached = this._staticTrees || (this._staticTrees = []);
      var tree = cached[index];
      // if has already-rendered static tree and not inside v-for,
      // we can reuse the same tree.
      if (tree && !isInFor) {
          return tree;
      }
      // otherwise, render a fresh tree.
      tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this // for render fns generated for functional component templates
      );
      markStatic$1(tree, ("__static__" + index), false);
      return tree;
  }
  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce(tree, index, key) {
      markStatic$1(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
      return tree;
  }
  function markStatic$1(tree, key, isOnce) {
      if (Array.isArray(tree)) {
          for (var i = 0; i < tree.length; i++) {
              if (tree[i] && typeof tree[i] !== 'string') {
                  markStaticNode(tree[i], (key + "_" + i), isOnce);
              }
          }
      }
      else {
          markStaticNode(tree, key, isOnce);
      }
  }
  function markStaticNode(node, key, isOnce) {
      node.isStatic = true;
      node.key = key;
      node.isOnce = isOnce;
  }

  function bindObjectListeners(data, value) {
      if (value) {
          if (!isPlainObject(value)) {
              warn$2('v-on without argument expects an Object value', this);
          }
          else {
              var on = (data.on = data.on ? extend({}, data.on) : {});
              for (var key in value) {
                  var existing = on[key];
                  var ours = value[key];
                  on[key] = existing ? [].concat(existing, ours) : ours;
              }
          }
      }
      return data;
  }

  function resolveScopedSlots(fns, res, 
  // the following are added in 2.6
  hasDynamicKeys, contentHashKey) {
      res = res || { $stable: !hasDynamicKeys };
      for (var i = 0; i < fns.length; i++) {
          var slot = fns[i];
          if (Array.isArray(slot)) {
              resolveScopedSlots(slot, res, hasDynamicKeys);
          }
          else if (slot) {
              // marker for reverse proxying v-slot without scope on this.$slots
              // @ts-expect-error
              if (slot.proxy) {
                  // @ts-expect-error
                  slot.fn.proxy = true;
              }
              res[slot.key] = slot.fn;
          }
      }
      if (contentHashKey) {
          res.$key = contentHashKey;
      }
      return res;
  }

  // helper to process dynamic keys for dynamic arguments in v-bind and v-on.
  function bindDynamicKeys(baseObj, values) {
      for (var i = 0; i < values.length; i += 2) {
          var key = values[i];
          if (typeof key === 'string' && key) {
              baseObj[values[i]] = values[i + 1];
          }
          else if (key !== '' &&
              key !== null) {
              // null is a special value for explicitly removing a binding
              warn$2(("Invalid value for dynamic directive argument (expected string or null): " + key), this);
          }
      }
      return baseObj;
  }
  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier(value, symbol) {
      return typeof value === 'string' ? symbol + value : value;
  }

  function installRenderHelpers(target) {
      target._o = markOnce;
      target._n = toNumber;
      target._s = toString;
      target._l = renderList;
      target._t = renderSlot;
      target._q = looseEqual;
      target._i = looseIndexOf;
      target._m = renderStatic;
      target._f = resolveFilter;
      target._k = checkKeyCodes;
      target._b = bindObjectProps;
      target._v = createTextVNode;
      target._e = createEmptyVNode;
      target._u = resolveScopedSlots;
      target._g = bindObjectListeners;
      target._d = bindDynamicKeys;
      target._p = prependModifier;
  }

  function FunctionalRenderContext(data, props, children, parent, Ctor) {
      var this$1 = this;

      var options = Ctor.options;
      // ensure the createElement function in functional components
      // gets a unique context - this is necessary for correct named slot check
      var contextVm;
      if (hasOwn(parent, '_uid')) {
          contextVm = Object.create(parent);
          // $flow-disable-line
          contextVm._original = parent;
      }
      else {
          // the context vm passed in is a functional context as well.
          // in this case we want to make sure we are able to get a hold to the
          // real context instance.
          contextVm = parent;
          // $flow-disable-line
          parent = parent._original;
      }
      var isCompiled = isTrue(options._compiled);
      var needNormalization = !isCompiled;
      this.data = data;
      this.props = props;
      this.children = children;
      this.parent = parent;
      this.listeners = data.on || emptyObject;
      this.injections = resolveInject(options.inject, parent);
      this.slots = function () {
          if (!this$1.$slots) {
              normalizeScopedSlots(data.scopedSlots, (this$1.$slots = resolveSlots(children, parent)));
          }
          return this$1.$slots;
      };
      Object.defineProperty(this, 'scopedSlots', {
          enumerable: true,
          get: function get() {
              return normalizeScopedSlots(data.scopedSlots, this.slots());
          },
      });
      // support for compiled functional template
      if (isCompiled) {
          // exposing $options for renderStatic()
          this.$options = options;
          // pre-resolve slots for renderSlot()
          this.$slots = this.slots();
          this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
      }
      if (options._scopeId) {
          this._c = function (a, b, c, d) {
              var vnode = createElement$1(contextVm, a, b, c, d, needNormalization);
              if (vnode && !Array.isArray(vnode)) {
                  vnode.fnScopeId = options._scopeId;
                  vnode.fnContext = parent;
              }
              return vnode;
          };
      }
      else {
          this._c = function (a, b, c, d) { return createElement$1(contextVm, a, b, c, d, needNormalization); };
      }
  }
  installRenderHelpers(FunctionalRenderContext.prototype);
  function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
      var options = Ctor.options;
      var props = {};
      var propOptions = options.props;
      if (isDef(propOptions)) {
          for (var key in propOptions) {
              props[key] = validateProp(key, propOptions, propsData || emptyObject);
          }
      }
      else {
          if (isDef(data.attrs))
              { mergeProps(props, data.attrs); }
          if (isDef(data.props))
              { mergeProps(props, data.props); }
      }
      var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);
      var vnode = options.render.call(null, renderContext._c, renderContext);
      if (vnode instanceof VNode) {
          return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
      }
      else if (Array.isArray(vnode)) {
          var vnodes = normalizeChildren(vnode) || [];
          var res = new Array(vnodes.length);
          for (var i = 0; i < vnodes.length; i++) {
              res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
          }
          return res;
      }
  }
  function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
      // #7817 clone node before setting fnContext, otherwise if the node is reused
      // (e.g. it was from a cached normal slot) the fnContext causes named slots
      // that should not be matched to match.
      var clone = cloneVNode(vnode);
      clone.fnContext = contextVm;
      clone.fnOptions = options;
      {
          (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
      }
      if (data.slot) {
          (clone.data || (clone.data = {})).slot = data.slot;
      }
      return clone;
  }
  function mergeProps(to, from) {
      for (var key in from) {
          to[camelize(key)] = from[key];
      }
  }

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
      init: function init(vnode, hydrating) {
          if (vnode.componentInstance &&
              !vnode.componentInstance._isDestroyed &&
              vnode.data.keepAlive) {
              // kept-alive components, treat as a patch
              var mountedNode = vnode; // work around flow
              componentVNodeHooks.prepatch(mountedNode, mountedNode);
          }
          else {
              var child = (vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance));
              child.$mount(hydrating ? vnode.elm : undefined, hydrating);
          }
      },
      prepatch: function prepatch(oldVnode, vnode) {
          var options = vnode.componentOptions;
          var child = (vnode.componentInstance = oldVnode.componentInstance);
          updateChildComponent(child, options.propsData, // updated props
          options.listeners, // updated listeners
          vnode, // new parent vnode
          options.children // new children
          );
      },
      insert: function insert(vnode) {
          var context = vnode.context;
          var componentInstance = vnode.componentInstance;
          if (!componentInstance._isMounted) {
              componentInstance._isMounted = true;
              callHook$1(componentInstance, 'mounted');
          }
          if (vnode.data.keepAlive) {
              if (context._isMounted) {
                  // vue-router#1212
                  // During updates, a kept-alive component's child components may
                  // change, so directly walking the tree here may call activated hooks
                  // on incorrect children. Instead we push them into a queue which will
                  // be processed after the whole patch process ended.
                  queueActivatedComponent(componentInstance);
              }
              else {
                  activateChildComponent(componentInstance, true /* direct */);
              }
          }
      },
      destroy: function destroy(vnode) {
          var componentInstance = vnode.componentInstance;
          if (!componentInstance._isDestroyed) {
              if (!vnode.data.keepAlive) {
                  componentInstance.$destroy();
              }
              else {
                  deactivateChildComponent(componentInstance, true /* direct */);
              }
          }
      },
  };
  var hooksToMerge = Object.keys(componentVNodeHooks);
  function createComponent(Ctor, data, context, children, tag) {
      if (isUndef(Ctor)) {
          return;
      }
      var baseCtor = context.$options._base;
      // plain options object: turn it into a constructor
      if (isObject(Ctor)) {
          Ctor = baseCtor.extend(Ctor);
      }
      // if at this stage it's not a constructor or an async component factory,
      // reject.
      if (typeof Ctor !== 'function') {
          {
              warn$2(("Invalid Component definition: " + (String(Ctor))), context);
          }
          return;
      }
      // async component
      var asyncFactory;
      // @ts-expect-error
      if (isUndef(Ctor.cid)) {
          asyncFactory = Ctor;
          Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
          if (Ctor === undefined) {
              // return a placeholder node for async component, which is rendered
              // as a comment node but preserves all the raw information for the node.
              // the information will be used for async server-rendering and hydration.
              return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
          }
      }
      data = data || {};
      // resolve constructor options in case global mixins are applied after
      // component constructor creation
      resolveConstructorOptions(Ctor);
      // transform component v-model data into props & events
      if (isDef(data.model)) {
          // @ts-expect-error
          transformModel(Ctor.options, data);
      }
      // extract props
      // @ts-expect-error
      var propsData = extractPropsFromVNodeData(data, Ctor, tag);
      // functional component
      // @ts-expect-error
      if (isTrue(Ctor.options.functional)) {
          return createFunctionalComponent(Ctor, propsData, data, context, children);
      }
      // extract listeners, since these needs to be treated as
      // child component listeners instead of DOM listeners
      var listeners = data.on;
      // replace with listeners with .native modifier
      // so it gets processed during parent component patch.
      data.on = data.nativeOn;
      // @ts-expect-error
      if (isTrue(Ctor.options.abstract)) {
          // abstract components do not keep anything
          // other than props & listeners & slot
          // work around flow
          var slot = data.slot;
          data = {};
          if (slot) {
              data.slot = slot;
          }
      }
      // install component management hooks onto the placeholder node
      installComponentHooks(data);
      // return a placeholder vnode
      // @ts-expect-error
      var name = Ctor.options.name || tag;
      var vnode = new VNode(
      // @ts-expect-error
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')), data, undefined, undefined, undefined, context, 
      // @ts-expect-error
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, asyncFactory);
      return vnode;
  }
  function createComponentInstanceForVnode(
  // we know it's MountedComponentVNode but flow doesn't
  vnode, 
  // activeInstance in lifecycle state
  parent) {
      var options = {
          _isComponent: true,
          _parentVnode: vnode,
          parent: parent,
      };
      // check inline-template render functions
      var inlineTemplate = vnode.data.inlineTemplate;
      if (isDef(inlineTemplate)) {
          options.render = inlineTemplate.render;
          options.staticRenderFns = inlineTemplate.staticRenderFns;
      }
      return new vnode.componentOptions.Ctor(options);
  }
  function installComponentHooks(data) {
      var hooks = data.hook || (data.hook = {});
      for (var i = 0; i < hooksToMerge.length; i++) {
          var key = hooksToMerge[i];
          var existing = hooks[key];
          var toMerge = componentVNodeHooks[key];
          // @ts-expect-error
          if (existing !== toMerge && !(existing && existing._merged)) {
              hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
          }
      }
  }
  function mergeHook(f1, f2) {
      var merged = function (a, b) {
          // flow complains about extra args which is why we use any
          f1(a, b);
          f2(a, b);
      };
      merged._merged = true;
      return merged;
  }
  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel(options, data) {
      var prop = (options.model && options.model.prop) || 'value';
      var event = (options.model && options.model.event) || 'input';
      (data.attrs || (data.attrs = {}))[prop] = data.model.value;
      var on = data.on || (data.on = {});
      var existing = on[event];
      var callback = data.model.callback;
      if (isDef(existing)) {
          if (Array.isArray(existing)
              ? existing.indexOf(callback) === -1
              : existing !== callback) {
              on[event] = [callback].concat(existing);
          }
      }
      else {
          on[event] = callback;
      }
  }

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;
  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  /**
   * 创建VNode
   *
   * @date 2020-04-21
   * @export
   * @param {Component} context - vm
   * @param {*} tag / {String | Object | Function}
   * 一个 HTML 标签字符串，组件选项对象，或者
   * 解析上述任何一种的一个 async 异步函数。必需参数。
   * @param {*} data - 一个包含模板相关属性的数据对象，可选参数 会有attr props style on等
   * @param {*} children - 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，
   * 也可以使用字符串来生成“文本虚拟节点”。可选参数。
   * @param {*} normalizationType - 子节点的规范类型，对于手写的render方法需要进行规整
   * @param {boolean} alwaysNormalize
   * @returns {(VNode | Array<VNode>)}
   */
  function createElement$1(context, tag, data, children, normalizationType, alwaysNormalize) {
      // 处理data的入参，如果data不符合规范(是数组或简单数据格式)就视作没有
      // 主要是怕用户传了个奇怪的data,那就默认用户没有传data,吧所有参数往前移动
      if (Array.isArray(data) || isPrimitive(data)) {
          normalizationType = children;
          children = data;
          data = undefined;
      }
      // 是否定义了永远标准化
      if (isTrue(alwaysNormalize)) {
          normalizationType = ALWAYS_NORMALIZE;
      }
      // 这才是核心
      return _createElement(context, tag, data, children, normalizationType);
  }
  /**
   * 创建虚拟dom tree
   * @date 2020-04-21
   * @export
   * @param {Component} context - vm
   * @param {(string | Class<Component> | Function | Object)} [tag]
   * @param {VNodeData} [data]
   * @param {*} [children]
   * @param {number} [normalizationType]
   * @returns {(VNode | Array<VNode>)}
   */
  function _createElement(context, tag, data, children, normalizationType) {
      // 避免使用被观察的对象作为vnode的选项对象
      // 即vnode不可以是一个响应式的
      // 会返回一个注释节点(空节点)
      if (isDef(data) && isDef(data.__ob__)) {
          warn$2("Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" + 'Always create fresh vnode data objects in each render!', context);
          return createEmptyVNode();
      }
      // object syntax in v-bind
      // is属性绑定
      if (isDef(data) && isDef(data.is)) {
          tag = data.is;
      }
      if (!tag) {
          // in case of component :is set to falsy value
          // 也有一种情况是is的值是个假值
          // 此时也返回一个空vnode   即注释节点
          return createEmptyVNode();
      }
      // warn against non-primitive key
      // key属性的值不是一个简单数据类型的话,就警告
      if (isDef(data) &&
          isDef(data.key) &&
          !isPrimitive(data.key)) {
          // @ts-expect-error
          // 没有使用false或者key中没有@binding的情况下,进行警告
          {
              warn$2('Avoid using non-primitive value as key, ' +
                  'use string/number value instead.', context);
          }
      }
      // support single function children as default scoped slot
      // 函数式子节点,使用渲染函数时会触发
      // 把children长度变为零
      if (Array.isArray(children) && // children是个数组
          typeof children[0] === 'function' // 第一个children是个函数
      ) {
          data = data || {};
          data.scopedSlots = { default: children[0] };
          children.length = 0;
      }
      // 规整子节点
      // 经过children的规整，children变成一个类型为VNode的Array
      if (normalizationType === ALWAYS_NORMALIZE) {
          children = normalizeChildren(children);
      }
      else if (normalizationType === SIMPLE_NORMALIZE) {
          children = simpleNormalizeChildren(children);
      }
      var vnode, ns;
      // 创建VNode
      if (typeof tag === 'string') {
          var Ctor;
          ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
          // 判断是否是html协议的保留标签
          if (config.isReservedTag(tag)) {
              // platform built-in elements
              if (isDef(data) &&
                  isDef(data.nativeOn) &&
                  data.tag !== 'component') {
                  warn$2(("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."), context);
              }
              // 保留字段规整
              // 创建一个普通的VNode，初始化tag，data，children等变量
              vnode = new VNode(
              // 让保留字段变得规整
              config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
          }
          else if ((!data || !data.pre) &&
              isDef((Ctor = resolveAsset(context.$options, 'components', tag)))) {
              // component
              // 已注册的组件，则调用createComponent创建VNode
              vnode = createComponent(Ctor, data, context, children, tag);
          }
          else {
              // unknown or unlisted namespaced elements
              // check at runtime because it may get assigned a namespace when its
              // parent normalizes children
              // 未知的或未列出的命名空间元素
              // 在运行时检查，因为它可能会被分配一个名称空间
              // 标准化子组件
              // 创建一个未知标签的VNode
              vnode = new VNode(tag, data, children, undefined, undefined, context);
          }
      }
      else {
          // direct component options / constructor
          // 如果不是个String类型，调用createComponent创建组件类型的VNode
          vnode = createComponent(tag, data, context, children);
      }
      if (Array.isArray(vnode)) {
          // 是个数组就直接返回
          return vnode;
      }
      else if (isDef(vnode)) {
          // 不是数组
          if (isDef(ns))
              { applyNS(vnode, ns); } // 有命名空间则递归的赋予命名空间
          if (isDef(data))
              { registerDeepBindings(data); } // 对data进行深度的双向绑定 主要是styles和class
          return vnode;
      }
      else {
          // 没定义就给个空vnode
          return createEmptyVNode();
      }
  }
  /**
   * 递归地给VNode应用命名空间
   */
  function applyNS(vnode, ns, force) {
      vnode.ns = ns;
      if (vnode.tag === 'foreignObject') {
          // use default namespace inside foreignObject
          ns = undefined;
          force = true;
      }
      if (isDef(vnode.children)) {
          for (var i = 0, l = vnode.children.length; i < l; i++) {
              var child = vnode.children[i];
              if (isDef(child.tag) &&
                  (isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
                  applyNS(child, ns, force);
              }
          }
      }
  }
  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  /**
   * 给VNode应用style和class
   */
  function registerDeepBindings(data) {
      if (isObject(data.style)) {
          traverse(data.style);
      }
      if (isObject(data.class)) {
          traverse(data.class);
      }
  }

  /**
   * 首先对_vnode与_staticTrees进行初始化。
   * 接着对$slots,$scopedSlots赋值。
   * vm._c与vm.$createElement分别是对template和render函数处理的方法
   */
  function initRender(vm) {
      // 保存node树的根节点
      vm._vnode = null; // the root of the child tree
      // v-once树的缓存,只渲染一次
      vm._staticTrees = null; // v-once cached trees
      var options = vm.$options;
      var parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
      var renderContext = parentVnode && parentVnode.context;
      vm.$slots = resolveSlots(options._renderChildren, renderContext);
      vm.$scopedSlots = emptyObject;
      // bind the createElement fn to this instance
      // so that we get proper render context inside it.
      // args order: tag, data, children, normalizationType, alwaysNormalize
      // internal version is used by render functions compiled from templates
      // @ts-expect-error
      // tamplate渲染为render函数时的处理
      vm._c = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, false); };
      // normalization is always applied for the public version, used in
      // user-written render functions.
      // @ts-expect-error
      // 用户自己用render函数
      vm.$createElement = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, true); };
      // $attrs & $listeners are exposed for easier HOC creation.
      // they need to be reactive so that HOCs using them are always updated
      var parentData = parentVnode && parentVnode.data;
      /* istanbul ignore else */
      // 对$attrs和listeners进行监听
      {
          defineReactive(vm, '$attrs', (parentData && parentData.attrs) || emptyObject, function () {
              !isUpdatingChildComponent && warn$2("$attrs is readonly.", vm);
          }, true);
          defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
              !isUpdatingChildComponent && warn$2("$listeners is readonly.", vm);
          }, true);
      }
  }
  /**
   * 当前的渲染实例
   */
  var currentRenderingInstance = null;
  /**
   * 定义了$nextTick _render 方法
   *
   * @date 2021-01-06
   * @export
   * @param {Class<Component>} Vue
   */
  function renderMixin(Vue) {
      // install runtime convenience helpers
      installRenderHelpers(Vue.prototype);
      Vue.prototype.$nextTick = function (fn) {
          return nextTick(fn, this);
      };
      Vue.prototype._render = function () {
          var vm = this;
          var ref = vm.$options;
          var render = ref.render;
          var _parentVnode = ref._parentVnode;
          if (_parentVnode) {
              vm.$scopedSlots = normalizeScopedSlots(_parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
          }
          // set parent vnode. this allows render functions to have access
          // to the data on the placeholder node.
          vm.$vnode = _parentVnode;
          // render self
          var vnode;
          try {
              // There's no need to maintain a stack because all render fns are called
              // separately from one another. Nested component's render fns are called
              // when parent component is patched.
              currentRenderingInstance = vm;
              // _renderProxy就是vm，
              // render的内容
              // t.g. 
              // render: function (createElement) {
              //   return createElement(
              //     'h' + this.level,   // 标签名称
              //     this.$slots.default // 子元素数组
              //   )
              // }
              // 调用用户传入的render函数
              vnode = render.call(vm._renderProxy, vm.$createElement);
          }
          catch (e) {
              handleError(e, vm, "render");
              // return error render result,
              // or previous vnode to prevent render error causing blank component
              /* istanbul ignore else */
              if (vm.$options.renderError) {
                  try {
                      vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                  }
                  catch (e$1) {
                      handleError(e$1, vm, "renderError");
                      vnode = vm._vnode;
                  }
              }
              else {
                  vnode = vm._vnode;
              }
          }
          finally {
              currentRenderingInstance = null;
          }
          // if the returned array contains only a single node, allow it
          if (Array.isArray(vnode) && vnode.length === 1) {
              vnode = vnode[0];
          }
          // return empty vnode in case the render function errored out
          if (!(vnode instanceof VNode)) {
              if (Array.isArray(vnode)) {
                  warn$2('Multiple root nodes returned from render function. Render function ' +
                      'should return a single root node.', vm);
              }
              vnode = createEmptyVNode();
          }
          // set parent
          vnode.parent = _parentVnode;
          return vnode;
      };
  }

  function ensureCtor(comp, base) {
      if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module')) {
          comp = comp.default;
      }
      return isObject(comp) ? base.extend(comp) : comp;
  }
  function createAsyncPlaceholder(factory, data, context, children, tag) {
      var node = createEmptyVNode();
      node.asyncFactory = factory;
      node.asyncMeta = { data: data, context: context, children: children, tag: tag };
      return node;
  }
  function resolveAsyncComponent(factory, baseCtor) {
      if (isTrue(factory.error) && isDef(factory.errorComp)) {
          return factory.errorComp;
      }
      if (isDef(factory.resolved)) {
          return factory.resolved;
      }
      var owner = currentRenderingInstance;
      if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
          // already pending
          factory.owners.push(owner);
      }
      if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
          return factory.loadingComp;
      }
      if (owner && !isDef(factory.owners)) {
          var owners = (factory.owners = [owner]);
          var sync = true;
          var timerLoading = null;
          var timerTimeout = null;
          owner.$on('hook:destroyed', function () { return remove$2(owners, owner); });
          var forceRender = function (renderCompleted) {
              for (var i = 0, l = owners.length; i < l; i++) {
                  owners[i].$forceUpdate();
              }
              if (renderCompleted) {
                  owners.length = 0;
                  if (timerLoading !== null) {
                      clearTimeout(timerLoading);
                      timerLoading = null;
                  }
                  if (timerTimeout !== null) {
                      clearTimeout(timerTimeout);
                      timerTimeout = null;
                  }
              }
          };
          var resolve = once(function (res) {
              // cache resolved
              factory.resolved = ensureCtor(res, baseCtor);
              // invoke callbacks only if this is not a synchronous resolve
              // (async resolves are shimmed as synchronous during SSR)
              if (!sync) {
                  forceRender(true);
              }
              else {
                  owners.length = 0;
              }
          });
          var reject = once(function (reason) {
              warn$2("Failed to resolve async component: " + (String(factory)) +
                      (reason ? ("\nReason: " + reason) : ''));
              if (isDef(factory.errorComp)) {
                  factory.error = true;
                  forceRender(true);
              }
          });
          var res = factory(resolve, reject);
          if (isObject(res)) {
              if (isPromise(res)) {
                  // () => Promise
                  if (isUndef(factory.resolved)) {
                      res.then(resolve, reject);
                  }
              }
              else if (isPromise(res.component)) {
                  res.component.then(resolve, reject);
                  if (isDef(res.error)) {
                      factory.errorComp = ensureCtor(res.error, baseCtor);
                  }
                  if (isDef(res.loading)) {
                      factory.loadingComp = ensureCtor(res.loading, baseCtor);
                      if (res.delay === 0) {
                          factory.loading = true;
                      }
                      else {
                          // @ts-expect-error NodeJS timeout type
                          timerLoading = setTimeout(function () {
                              timerLoading = null;
                              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                  factory.loading = true;
                                  forceRender(false);
                              }
                          }, res.delay || 200);
                      }
                  }
                  if (isDef(res.timeout)) {
                      // @ts-expect-error NodeJS timeout type
                      timerTimeout = setTimeout(function () {
                          timerTimeout = null;
                          if (isUndef(factory.resolved)) {
                              reject(("timeout (" + (res.timeout) + "ms)")
                                  );
                          }
                      }, res.timeout);
                  }
              }
          }
          sync = false;
          // return in case resolved synchronously
          return factory.loading ? factory.loadingComp : factory.resolved;
      }
  }

  function isAsyncPlaceholder(node) {
      // @ts-expect-error not really boolean type
      return node.isComment && node.asyncFactory;
  }

  function getFirstComponentChild(children) {
      if (Array.isArray(children)) {
          for (var i = 0; i < children.length; i++) {
              var c = children[i];
              if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                  return c;
              }
          }
      }
  }

  /**
   * 初始化_events _hasHookEvent变量
   */
  function initEvents(vm) {
      vm._events = Object.create(null);
      // 标识是否有hook:样式的钩子事件
      vm._hasHookEvent = false;
      // init parent attached events
      // 获取_parentListeners，表示父组件对子组件（当前实例）的监听，即v-on
      var listeners = vm.$options._parentListeners;
      if (listeners) {
          updateComponentListeners(vm, listeners);
      }
  }
  var target$1;
  function add$1(event, fn) {
      target$1.$on(event, fn);
  }
  function remove$1(event, fn) {
      target$1.$off(event, fn);
  }
  function createOnceHandler$1(event, fn) {
      var _target = target$1;
      return function onceHandler() {
          var res = fn.apply(null, arguments);
          if (res !== null) {
              _target.$off(event, onceHandler);
          }
      };
  }
  /**
   * 更新实例上的事件列表
   *
   * @date 15/04/2021
   * @export
   * @param {Component} vm
   * @param {Object} listeners - _parentListeners对象
   * @param {(Object | null)} [oldListeners]
   */
  function updateComponentListeners(vm, listeners, oldListeners) {
      target$1 = vm;
      // 更新实例上的事件列表
      updateListeners(listeners, oldListeners || {}, add$1, remove$1, createOnceHandler$1, vm);
      target$1 = undefined;
  }
  function eventsMixin(Vue) {
      var hookRE = /^hook:/;
      Vue.prototype.$on = function (event, fn) {
          var vm = this;
          if (Array.isArray(event)) {
              for (var i = 0, l = event.length; i < l; i++) {
                  vm.$on(event[i], fn);
              }
          }
          else {
              (vm._events[event] || (vm._events[event] = [])).push(fn);
              // optimize hook:event cost by using a boolean flag marked at registration
              // instead of a hash lookup
              if (hookRE.test(event)) {
                  vm._hasHookEvent = true;
              }
          }
          return vm;
      };
      Vue.prototype.$once = function (event, fn) {
          var vm = this;
          function on() {
              vm.$off(event, on);
              fn.apply(vm, arguments);
          }
          on.fn = fn;
          vm.$on(event, on);
          return vm;
      };
      Vue.prototype.$off = function (event, fn) {
          var vm = this;
          // all
          if (!arguments.length) {
              vm._events = Object.create(null);
              return vm;
          }
          // array of events
          if (Array.isArray(event)) {
              for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
                  vm.$off(event[i$1], fn);
              }
              return vm;
          }
          // specific event
          var cbs = vm._events[event];
          if (!cbs) {
              return vm;
          }
          if (!fn) {
              vm._events[event] = null;
              return vm;
          }
          // specific handler
          var cb;
          var i = cbs.length;
          while (i--) {
              cb = cbs[i];
              if (cb === fn || cb.fn === fn) {
                  cbs.splice(i, 1);
                  break;
              }
          }
          return vm;
      };
      Vue.prototype.$emit = function (event) {
          var vm = this;
          {
              var lowerCaseEvent = event.toLowerCase();
              if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                  tip("Event \"" + lowerCaseEvent + "\" is emitted in component " +
                      (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
                      "Note that HTML attributes are case-insensitive and you cannot use " +
                      "v-on to listen to camelCase events when using in-DOM templates. " +
                      "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\".");
              }
          }
          var cbs = vm._events[event];
          if (cbs) {
              cbs = cbs.length > 1 ? toArray(cbs) : cbs;
              var args = toArray(arguments, 1);
              var info = "event handler for \"" + event + "\"";
              for (var i = 0, l = cbs.length; i < l; i++) {
                  invokeWithErrorHandling(cbs[i], vm, args, vm, info);
              }
          }
          return vm;
      };
  }

  var activeInstance = null;
  var isUpdatingChildComponent = false;
  /**
   * 更改当前存储的活跃实例
   *
   * @date 15/04/2021
   * @export
   * @param {Component} vm - 新的实例,将要替换当前实例
   * @return {*}
   */
  function setActiveInstance(vm) {
      var prevActiveInstance = activeInstance;
      activeInstance = vm;
      return function () {
          activeInstance = prevActiveInstance;
      };
  }
  /**
   * 初始化生命周期
   * 1.找到最近的一个非抽象父组件，在他的$children数组中添加自己
   * 2.初始化一些变量 $parent $root $children $refs _watcher _inactive _directInactive _isMounted _isDestroyed _isBeingDestroyed
   *
   * @date 15/04/2021
   * @export
   * @param {Component} vm
   */
  function initLifecycle(vm) {
      var options = vm.$options;
      // locate first non-abstract parent
      var parent = options.parent;
      if (parent && !options.abstract) {
          // 如果有父组件且自身不是抽象组件（抽象组件就是不渲染出真实DOM的组件，如keep-alive组件）
          // 抽象组件：自身不会渲染一个 DOM 元素，也不会出现在父组件链中
          while (parent.$options.abstract && parent.$parent) {
              // 通过while循环父组件链，找出最近的一个非抽象的组件，并赋值为parent
              parent = parent.$parent;
          }
          // 为该parent的子组件数据添加vm对象，形成一个环形链表
          // 这个链表是非抽象组件链表，忽略了抽象组件
          parent.$children.push(vm);
      }
      // 初始化vue实例的一系列属性
      // $parent $root $children $refs _watcher _inactive _directInactive _isMounted 
      // _isDestroyed _isBeingDestroyed
      vm.$parent = parent;
      vm.$root = parent ? parent.$root : vm;
      vm.$children = [];
      vm.$refs = {};
      vm._watcher = null;
      vm._inactive = null;
      vm._directInactive = false;
      vm._isMounted = false;
      vm._isDestroyed = false;
      vm._isBeingDestroyed = false;
  }
  /**
   * 定义了_update $forceUpdate $destroy方法
   * @date 2021-01-06
   * @export
   * @param {Class<Component>} Vue
   */
  function lifecycleMixin(Vue) {
      // vm._update会把vnode渲染成真实的dom节点
      // 它调用的时机有两个地方，第一个是首次渲染，第二个是数据更新
      // 核心其实就是调用了__patch__方法
      Vue.prototype._update = function (vnode, hydrating) {
          var vm = this;
          var prevEl = vm.$el;
          var prevVnode = vm._vnode;
          var restoreActiveInstance = setActiveInstance(vm);
          vm._vnode = vnode; // 把实例上那个当前vnode更新为传入的这个
          // Vue.prototype.__patch__ is injected in entry points
          // based on the rendering backend used.
          // 使用prevVnode来判断是首次渲染还是更新DOM
          if (!prevVnode) {
              // initial render
              // 首次渲染
              vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
          }
          else {
              // updates
              vm.$el = vm.__patch__(prevVnode, vnode);
          }
          restoreActiveInstance();
          // update __vue__ reference
          if (prevEl) {
              prevEl.__vue__ = null;
          }
          if (vm.$el) {
              vm.$el.__vue__ = vm;
          }
          // if parent is an HOC, update its $el as well
          if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
              vm.$parent.$el = vm.$el;
          }
          // updated hook is called by the scheduler to ensure that children are
          // updated in a parent's updated hook.
      };
      // 提供了一个手动调用当前watcher的update的方法的方法
      Vue.prototype.$forceUpdate = function () {
          var vm = this;
          if (vm._watcher) {
              vm._watcher.update();
          }
      };
      // 销毁实例
      Vue.prototype.$destroy = function () {
          var vm = this;
          // 如果正在被销毁就不管了
          if (vm._isBeingDestroyed) {
              return;
          }
          // 上来就调用beforeDestory钩子
          callHook$1(vm, "beforeDestroy");
          vm._isBeingDestroyed = true;
          // remove self from parent
          // 1.从父实例上的$children列表中移除自己
          var parent = vm.$parent;
          if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
              remove$2(parent.$children, vm);
          }
          // 2.销毁watcher
          // teardown watchers
          if (vm._watcher) {
              // 当前watcher
              vm._watcher.teardown();
          }
          var i = vm._watchers.length;
          while (i--) {
              // 销毁所有watcher
              vm._watchers[i].teardown();
          }
          // remove reference from data ob
          // frozen object may not have observer.
          // 实例被销毁那么__ob__的计数也要减一
          if (vm._data.__ob__) {
              vm._data.__ob__.vmCount--;
          }
          // call the last hook...
          vm._isDestroyed = true;
          // invoke destroy hooks on current rendered tree
          // 把vnode给更新咯
          vm.__patch__(vm._vnode, null);
          // fire destroyed hook
          // destroyed钩子调用
          callHook$1(vm, "destroyed");
          // turn off all instance listeners.
          // 取消所有事件监听
          vm.$off();
          // remove __vue__ reference
          // $el上的__vue__重置
          if (vm.$el) {
              vm.$el.__vue__ = null;
          }
          // release circular reference (#6759)
          if (vm.$vnode) {
              // @ts-expect-error null is not undefined
              vm.$vnode.parent = null;
          }
      };
  }
  /**
   * 挂载组件
   * @date 2020-04-21
   * @export
   * @param {Component} vm - 当前实例
   * @param {?Element} el - 被挂载的DOM实例
   * @param {boolean} [hydrating] - 是否服务端渲染
   * @returns {Component}
   */
  function mountComponent(vm, el, hydrating) {
      vm.$el = el;
      // 如果没有使用render的方式去定义template（createElement）
      // 那就是我们最熟悉的template标签的方式咯
      if (!vm.$options.render) {
          // @ts-expect-error invalid type
          // 给一个默认值
          vm.$options.render = createEmptyVNode;
          {
              /* istanbul ignore if */
              if ((vm.$options.template && vm.$options.template.charAt(0) !== "#") ||
                  vm.$options.el ||
                  el) {
                  warn$2("You are using the runtime-only build of Vue where the template " +
                      "compiler is not available. Either pre-compile the templates into " +
                      "render functions, or use the compiler-included build.", vm);
              }
              else {
                  warn$2("Failed to mount component: template or render function not defined.", vm);
              }
          }
      }
      callHook$1(vm, "beforeMount");
      var updateComponent;
      /* istanbul ignore if */
      // 定义updateComponent，vm._render将render表达式转化为vnode，vm._update将vnode渲染成实际的dom节点
      if (config.performance && mark) {
          updateComponent = function () {
              var name = vm._name;
              var id = vm._uid;
              var startTag = "vue-perf-start:" + id;
              var endTag = "vue-perf-end:" + id;
              mark(startTag);
              // 将render表达式转化为vnode
              var vnode = vm._render();
              mark(endTag);
              measure(("vue " + name + " render"), startTag, endTag);
              mark(startTag);
              // 将vnode渲染成实际的dom节点
              vm._update(vnode, hydrating);
              mark(endTag);
              measure(("vue " + name + " patch"), startTag, endTag);
          };
      }
      else {
          // 定义updateComponent，
          // vm._render将render表达式转化为vnode，
          // vm._update将vnode渲染成实际的dom节点
          // 这里在render时就会触发html中你写的变量的getter
          // vm._render() => VNode
          updateComponent = function () {
              vm._update(vm._render(), hydrating);
          };
      }
      // we set this to vm._watcher inside the watcher's constructor
      // since the watcher's initial patch may call $forceUpdate (e.g. inside child
      // component's mounted hook), which relies on vm._watcher being already defined
      // 首次渲染，并监听数据变化，并实现dom的更新
      // new Watcher干了两件事情
      // 初始化实例时执行updateComponent方法，实现dom的渲染，并完成表达式对属性变量的依赖收集。
      // 一旦包含的表达式中的属性变量有变化，将重新执行updateComponent方法。
      new Watcher(vm, updateComponent, noop, {
          before: function before() {
              if (vm._isMounted && !vm._isDestroyed) {
                  callHook$1(vm, "beforeUpdate");
              }
          },
      }, true /* isRenderWatcher */);
      hydrating = false;
      // manually mounted instance, call mounted on self
      // mounted is called for render-created child components in its inserted hook
      // 挂载完成，回调mount函数
      if (vm.$vnode == null) {
          vm._isMounted = true;
          callHook$1(vm, "mounted");
      }
      return vm;
  }
  /**
   *
   *
   * @date 2020-04-21
   * @export
   * @param {Component} vm
   * @param {?Object} propsData
   * @param {?Object} listeners
   * @param {MountedComponentVNode} parentVnode
   * @param {?Array<VNode>} renderChildren
   */
  function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
      {
          isUpdatingChildComponent = true;
      }
      // determine whether component has slot children
      // we need to do this before overwriting $options._renderChildren.
      // check if there are dynamic scopedSlots (hand-written or compiled but with
      // dynamic slot names). Static scoped slots compiled from template has the
      // "$stable" marker.
      var newScopedSlots = parentVnode.data.scopedSlots;
      var oldScopedSlots = vm.$scopedSlots;
      var hasDynamicScopedSlot = !!((newScopedSlots && !newScopedSlots.$stable) ||
          (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
          (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key));
      // Any static slot children from the parent may have changed during parent's
      // update. Dynamic scoped slots may also have changed. In such cases, a forced
      // update is necessary to ensure correctness.
      var needsForceUpdate = !!(renderChildren || // has new static slots
          vm.$options._renderChildren || // has old static slots
          hasDynamicScopedSlot);
      vm.$options._parentVnode = parentVnode;
      vm.$vnode = parentVnode; // update vm's placeholder node without re-render
      if (vm._vnode) {
          // update child tree's parent
          vm._vnode.parent = parentVnode;
      }
      vm.$options._renderChildren = renderChildren;
      // update $attrs and $listeners hash
      // these are also reactive so they may trigger child update if the child
      // used them during render
      vm.$attrs = parentVnode.data.attrs || emptyObject;
      vm.$listeners = listeners || emptyObject;
      // update props
      if (propsData && vm.$options.props) {
          toggleObserving(false);
          var props = vm._props;
          var propKeys = vm.$options._propKeys || [];
          for (var i = 0; i < propKeys.length; i++) {
              var key = propKeys[i];
              var propOptions = vm.$options.props; // wtf flow?
              props[key] = validateProp(key, propOptions, propsData, vm);
          }
          toggleObserving(true);
          // keep a copy of raw propsData
          vm.$options.propsData = propsData;
      }
      // update listeners
      listeners = listeners || emptyObject;
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      updateComponentListeners(vm, listeners, oldListeners);
      // resolve slots + force update if has children
      if (needsForceUpdate) {
          vm.$slots = resolveSlots(renderChildren, parentVnode.context);
          vm.$forceUpdate();
      }
      {
          isUpdatingChildComponent = false;
      }
  }
  function isInInactiveTree(vm) {
      while (vm && (vm = vm.$parent)) {
          if (vm._inactive)
              { return true; }
      }
      return false;
  }
  function activateChildComponent(vm, direct) {
      if (direct) {
          vm._directInactive = false;
          if (isInInactiveTree(vm)) {
              return;
          }
      }
      else if (vm._directInactive) {
          return;
      }
      if (vm._inactive || vm._inactive === null) {
          vm._inactive = false;
          for (var i = 0; i < vm.$children.length; i++) {
              activateChildComponent(vm.$children[i]);
          }
          callHook$1(vm, "activated");
      }
  }
  function deactivateChildComponent(vm, direct) {
      if (direct) {
          vm._directInactive = true;
          if (isInInactiveTree(vm)) {
              return;
          }
      }
      if (!vm._inactive) {
          vm._inactive = true;
          for (var i = 0; i < vm.$children.length; i++) {
              deactivateChildComponent(vm.$children[i]);
          }
          callHook$1(vm, "deactivated");
      }
  }
  /**
   * 调用用户自定义的生命周期钩子函数
   * @date 2020-01-13
   * @export
   * @param {Component} vm
   * @param {string} hook
   */
  function callHook$1(vm, hook) {
      // #7573 disable dep collection when invoking lifecycle hooks
      // 使用一个空的watch实例
      pushTarget();
      // 获取定义的钩子函数
      var handlers = vm.$options[hook];
      var info = hook + " hook";
      if (handlers) {
          // 调用
          for (var i = 0, j = handlers.length; i < j; i++) {
              invokeWithErrorHandling(handlers[i], vm, null, vm, info);
          }
      }
      // 如果有生命周期指令，也一并调用
      if (vm._hasHookEvent) {
          vm.$emit("hook:" + hook);
      }
      // 推出空的watch实例
      popTarget();
  }

  var MAX_UPDATE_COUNT = 100;
  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index$1 = 0;
  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState() {
      index$1 = queue.length = activatedChildren.length = 0;
      has = {};
      {
          circular = {};
      }
      waiting = flushing = false;
  }
  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;
  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;
  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
      var performance = window.performance;
      if (performance &&
          typeof performance.now === 'function' &&
          getNow() > document.createEvent('Event').timeStamp) {
          // if the event timestamp, although evaluated AFTER the Date.now(), is
          // smaller than it, it means the event is using a hi-res timestamp,
          // and we need to use the hi-res version for event listener timestamps as
          // well.
          getNow = function () { return performance.now(); };
      }
  }
  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue() {
      currentFlushTimestamp = getNow();
      flushing = true;
      var watcher, id;
      // Sort queue before flush.
      // This ensures that:
      // 1. Components are updated from parent to child. (because parent is always
      //    created before the child)
      // 2. A component's user watchers are run before its render watcher (because
      //    user watchers are created before the render watcher)
      // 3. If a component is destroyed during a parent component's watcher run,
      //    its watchers can be skipped.
      queue.sort(function (a, b) { return a.id - b.id; });
      // do not cache length because more watchers might be pushed
      // as we run existing watchers
      for (index$1 = 0; index$1 < queue.length; index$1++) {
          watcher = queue[index$1];
          if (watcher.before) {
              watcher.before();
          }
          id = watcher.id;
          has[id] = null;
          watcher.run();
          // in dev build, check and stop circular updates.
          if (has[id] != null) {
              circular[id] = (circular[id] || 0) + 1;
              if (circular[id] > MAX_UPDATE_COUNT) {
                  warn$2('You may have an infinite update loop ' +
                      (watcher.user
                          ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                          : "in a component render function."), watcher.vm);
                  break;
              }
          }
      }
      // keep copies of post queues before resetting state
      var activatedQueue = activatedChildren.slice();
      var updatedQueue = queue.slice();
      resetSchedulerState();
      // call component updated and activated hooks
      callActivatedHooks(activatedQueue);
      callUpdatedHooks(updatedQueue);
      // devtool hook
      /* istanbul ignore if */
      if (devtools && config.devtools) {
          devtools.emit('flush');
      }
  }
  function callUpdatedHooks(queue) {
      var i = queue.length;
      while (i--) {
          var watcher = queue[i];
          var vm = watcher.vm;
          if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
              callHook$1(vm, 'updated');
          }
      }
  }
  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent(vm) {
      // setting _inactive to false here so that a render function can
      // rely on checking whether it's in an inactive tree (e.g. router-view)
      vm._inactive = false;
      activatedChildren.push(vm);
  }
  function callActivatedHooks(queue) {
      for (var i = 0; i < queue.length; i++) {
          queue[i]._inactive = true;
          activateChildComponent(queue[i], true /* true */);
      }
  }
  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher(watcher) {
      var id = watcher.id;
      if (has[id] == null) {
          has[id] = true;
          if (!flushing) {
              queue.push(watcher);
          }
          else {
              // if already flushing, splice the watcher based on its id
              // if already past its id, it will be run next immediately.
              var i = queue.length - 1;
              while (i > index$1 && queue[i].id > watcher.id) {
                  i--;
              }
              queue.splice(i + 1, 0, watcher);
          }
          // queue the flush
          if (!waiting) {
              waiting = true;
              if (!config.async) {
                  flushSchedulerQueue();
                  return;
              }
              nextTick(flushSchedulerQueue);
          }
      }
  }

  var uid$1 = 0;
  /**
   * 观察者解析表达式，收集依赖项，
   * 并在表达式值改变时触发回调。
   * 这用于$watch() api和指令。
   *
   * Watcher 在构造时传入的参数最重要的是 expOrFn
   * 这是一个 getter 函数，或者可以用来生成一个 getter 函数的字符串
   * 而这个 getter 函数就是之前所说的回调函数之一
   * 另外一个回调函数是 this.cb，这个函数只有在用 vm.$watch 生成的 Watcher 才会运行。
   */
  var Watcher = function Watcher(vm, expOrFn, // 被观察的数据的求值表达式
  cb, // 当被观察的表达式的值变化时的回调函数
  options, isRenderWatcher // 用来标识该观察者实例是否是渲染函数的观察者
  ) {
      // 1.初始化变量
      this.vm = vm;
      if (isRenderWatcher) {
          vm._watcher = this;
      }
      vm._watchers.push(this);
      // options
      if (options) {
          this.deep = !!options.deep;
          this.user = !!options.user;
          this.lazy = !!options.lazy;
          this.sync = !!options.sync;
          this.before = options.before;
      }
      else {
          this.deep = this.user = this.lazy = this.sync = false;
      }
      this.cb = cb;
      this.id = ++uid$1; // uid for batching
      this.active = true;
      this.dirty = this.lazy; // for lazy watchers
      this.deps = [];
      this.newDeps = [];
      this.depIds = new _Set();
      this.newDepIds = new _Set();
      this.expression =
          expOrFn.toString() ;
      // parse expression for getter
      // 2.解析表达式,获取getter方法
      // 如果是function类型,直接将其设置为getter方法
      // 即render watcher
      if (typeof expOrFn === 'function') {
          this.getter = expOrFn;
      }
      else {
          // 否则需要从中间解析出用户设置的getter
          // 这种情况下一般是b.c.d的字符串,使用this.getter(a)的形式可以得到a.b.c.d
          this.getter = parsePath(expOrFn);
          if (!this.getter) {
              this.getter = noop;
              warn$2("Failed watching path: \"" + expOrFn + "\" " +
                      'Watcher only accepts simple dot-delimited paths. ' +
                      'For full control, use a function instead.', vm);
          }
      }
      this.value = this.lazy ? undefined : this.get();
  };
  /**
   * 求值,重新收集依赖
   * 其实就是获取被watch属性当前的值
   */
  Watcher.prototype.get = function get () {
      // 1.将当前的watcher压栈
      // 这样触发getter时就知道应该收集哪个watcher了
      pushTarget(this);
      var value;
      var vm = this.vm;
      try {
          // 2.核心代码,依赖收集
          // 获取被watch对象的当前值
          value = this.getter.call(vm, vm);
      }
      catch (e) {
          if (this.user) {
              handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
          }
          else {
              throw e;
          }
      }
      finally {
          // "touch" every property so they are all tracked as
          // dependencies for deep watching
          // 3.收尾工作
          if (this.deep) {
              // 递归一次value,做一个取值操作以触发getter
              traverse(value);
          }
          popTarget();
          this.cleanupDeps();
      }
      return value;
  };
  /**
   * Add a dependency to this directive.
   * 如果新的deps里面没有,则把该dep加入到列表里面
   * 如果同时需要检查dep自身的subs里面有没有自己
   * 如果没有自己也要addSub
   */
  Watcher.prototype.addDep = function addDep (dep) {
      var id = dep.id;
      // 如果新deps中没有该id
      if (!this.newDepIds.has(id)) {
          // 添加id到缓冲区
          this.newDepIds.add(id);
          // 添加dep到缓冲区
          this.newDeps.push(dep);
          // 如果真正的池子里没有id,说明dep的subs里面没有自己,把自己加进去
          if (!this.depIds.has(id)) {
              // 添加到池子里
              dep.addSub(this);
          }
      }
  };
  /**
   * Clean up for dependency collection.
   * 清空实例的deps列表
   * 把newdeps赋值给deps,同时清掉旧的deps
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
      // 1. 遍历实例上的deps,新的depLists里面没有则将在dep的subs里面将自己删掉
      var i = this.deps.length;
      while (i--) {
          var dep = this.deps[i];
          if (!this.newDepIds.has(dep.id)) {
              // 如果新的deps里面没有这个dep,证明已经过期可以将watcher从Dep的subs里删掉了
              // 我里面没有你,那你里面也不必有我了
              dep.removeSub(this);
          }
      }
      // 2.把newdeps赋值给deps,同时清掉旧的deps
      var tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
  };
  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   * 更新数据,实际上是执行的run或者queueWatcher函数
   */
  Watcher.prototype.update = function update () {
      /* istanbul ignore else */
      if (this.lazy) {
          // 异步处理,先标记一下该变量是个脏值
          this.dirty = true;
      }
      else if (this.sync) {
          // 同步处理,立即执行(插队)
          this.run();
      }
      else {
          // 一般情况下,队列执行
          queueWatcher(this);
      }
  };
  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   * 当值发生改变或是是个对象(对象无法确定是否值发生改变)或是需要深度观察时
   * 调用cb
   */
  Watcher.prototype.run = function run () {
      // 不活跃的话直接不管了
      if (this.active) {
          // 获取当前的值
          var value = this.get();
          if (value !== this.value || // 当前值和之前的值不一样
              isObject(value) || // 当前值是个对象
              this.deep // 需要深度观察
          ) {
              // set new value
              // 赋值
              var oldValue = this.value; // 暂存一下调用cb的时候要传过去
              this.value = value;
              // 调用cb
              if (this.user) {
                  // 如果是调用的用户定义的,catch一下
                  // 即user watcher
                  try {
                      this.cb.call(this.vm, value, oldValue);
                  }
                  catch (e) {
                      handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
                  }
              }
              else {
                  this.cb.call(this.vm, value, oldValue);
              }
          }
      }
  };
  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   * 求值,赋值给value同时dirty重置为false
   */
  Watcher.prototype.evaluate = function evaluate () {
      this.value = this.get();
      this.dirty = false;
  };
  /**
   * Depend on all deps collected by this watcher.
   * 和自己dep池子里的所有dep形成你中有我我中有你的状态
   * 实际上就是调用了自己的addDep方法
   */
  Watcher.prototype.depend = function depend () {
      var i = this.deps.length;
      while (i--) {
          this.deps[i].depend();
      }
  };
  /**
   * Remove self from all dependencies' subscriber list.
   * 真正的销毁抹去一个watcher实例的存在
   * 1.从所有的dep的subs中把自己移除
   * 2.从实例的_watchers列表中把自己移除
   */
  Watcher.prototype.teardown = function teardown () {
      if (this.active) {
          // remove self from vm's watcher list
          // this is a somewhat expensive operation so we skip it
          // if the vm is being destroyed.
          if (!this.vm._isBeingDestroyed) {
              // vm._watchers收集了实例上的所有watcher,先从里面删掉
              remove$2(this.vm._watchers, this);
          }
          var i = this.deps.length;
          while (i--) {
              this.deps[i].removeSub(this);
          }
          this.active = false;
      }
  };

  var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: noop,
      set: noop,
  };
  function proxy(target, sourceKey, key) {
      sharedPropertyDefinition.get = function proxyGetter() {
          return this[sourceKey][key];
      };
      sharedPropertyDefinition.set = function proxySetter(val) {
          this[sourceKey][key] = val;
      };
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  function initState(vm) {
      vm._watchers = [];
      var opts = vm.$options;
      if (opts.props)
          { initProps$1(vm, opts.props); }
      if (opts.methods)
          { initMethods(vm, opts.methods); }
      if (opts.data) {
          initData(vm);
      }
      else {
          observe((vm._data = {}), true /* asRootData */);
      }
      if (opts.computed)
          { initComputed$1(vm, opts.computed); }
      if (opts.watch && opts.watch !== nativeWatch) {
          initWatch(vm, opts.watch);
      }
  }
  function initProps$1(vm, propsOptions) {
      var propsData = vm.$options.propsData || {};
      var props = (vm._props = {});
      // cache prop keys so that future props updates can iterate using Array
      // instead of dynamic object key enumeration.
      var keys = (vm.$options._propKeys = []);
      var isRoot = !vm.$parent;
      // root instance props should be converted
      if (!isRoot) {
          toggleObserving(false);
      }
      var loop = function ( key ) {
          keys.push(key);
          var value = validateProp(key, propsOptions, propsData, vm);
          /* istanbul ignore else */
          {
              var hyphenatedKey = hyphenate(key);
              if (isReservedAttribute(hyphenatedKey) ||
                  config.isReservedAttr(hyphenatedKey)) {
                  warn$2(("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."), vm);
              }
              defineReactive(props, key, value, function () {
                  if (!isRoot && !isUpdatingChildComponent) {
                      warn$2("Avoid mutating a prop directly since the value will be " +
                          "overwritten whenever the parent component re-renders. " +
                          "Instead, use a data or computed property based on the prop's " +
                          "value. Prop being mutated: \"" + key + "\"", vm);
                  }
              });
          }
          // static props are already proxied on the component's prototype
          // during Vue.extend(). We only need to proxy props defined at
          // instantiation here.
          if (!(key in vm)) {
              proxy(vm, "_props", key);
          }
      };

      for (var key in propsOptions) loop( key );
      toggleObserving(true);
  }
  function initData(vm) {
      var data = vm.$options.data;
      data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
      if (!isPlainObject(data)) {
          data = {};
          warn$2('data functions should return an object:\n' +
                  'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
      }
      // proxy data on instance
      var keys = Object.keys(data);
      var props = vm.$options.props;
      var methods = vm.$options.methods;
      var i = keys.length;
      while (i--) {
          var key = keys[i];
          {
              if (methods && hasOwn(methods, key)) {
                  warn$2(("Method \"" + key + "\" has already been defined as a data property."), vm);
              }
          }
          if (props && hasOwn(props, key)) {
              warn$2("The data property \"" + key + "\" is already declared as a prop. " +
                      "Use prop default value instead.", vm);
          }
          else if (!isReserved(key)) {
              proxy(vm, "_data", key);
          }
      }
      // observe data
      observe(data, true /* asRootData */);
  }
  function getData(data, vm) {
      // #7573 disable dep collection when invoking data getters
      pushTarget();
      try {
          return data.call(vm, vm);
      }
      catch (e) {
          handleError(e, vm, "data()");
          return {};
      }
      finally {
          popTarget();
      }
  }
  var computedWatcherOptions = { lazy: true };
  function initComputed$1(vm, computed) {
      // $flow-disable-line
      var watchers = (vm._computedWatchers = Object.create(null));
      // computed properties are just getters during SSR
      var isSSR = isServerRendering();
      for (var key in computed) {
          var userDef = computed[key];
          var getter = typeof userDef === 'function' ? userDef : userDef.get;
          if (getter == null) {
              warn$2(("Getter is missing for computed property \"" + key + "\"."), vm);
          }
          if (!isSSR) {
              // create internal watcher for the computed property.
              watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
          }
          // component-defined computed properties are already defined on the
          // component prototype. We only need to define computed properties defined
          // at instantiation here.
          if (!(key in vm)) {
              defineComputed(vm, key, userDef);
          }
          else {
              if (key in vm.$data) {
                  warn$2(("The computed property \"" + key + "\" is already defined in data."), vm);
              }
              else if (vm.$options.props && key in vm.$options.props) {
                  warn$2(("The computed property \"" + key + "\" is already defined as a prop."), vm);
              }
          }
      }
  }
  function defineComputed(target, key, userDef) {
      var shouldCache = !isServerRendering();
      if (typeof userDef === 'function') {
          sharedPropertyDefinition.get = shouldCache
              ? createComputedGetter(key)
              : createGetterInvoker(userDef);
          sharedPropertyDefinition.set = noop;
      }
      else {
          sharedPropertyDefinition.get = userDef.get
              ? shouldCache && userDef.cache !== false
                  ? createComputedGetter(key)
                  : createGetterInvoker(userDef.get)
              : noop;
          sharedPropertyDefinition.set = userDef.set || noop;
      }
      if (sharedPropertyDefinition.set === noop) {
          sharedPropertyDefinition.set = function () {
              warn$2(("Computed property \"" + key + "\" was assigned to but it has no setter."), this);
          };
      }
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  function createComputedGetter(key) {
      return function computedGetter() {
          var watcher = this._computedWatchers && this._computedWatchers[key];
          if (watcher) {
              if (watcher.dirty) {
                  watcher.evaluate();
              }
              if (Dep.target) {
                  watcher.depend();
              }
              return watcher.value;
          }
      };
  }
  function createGetterInvoker(fn) {
      return function computedGetter() {
          return fn.call(this, this);
      };
  }
  function initMethods(vm, methods) {
      var props = vm.$options.props;
      for (var key in methods) {
          {
              if (typeof methods[key] !== 'function') {
                  warn$2("Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
                      "Did you reference the function correctly?", vm);
              }
              if (props && hasOwn(props, key)) {
                  warn$2(("Method \"" + key + "\" has already been defined as a prop."), vm);
              }
              if (key in vm && isReserved(key)) {
                  warn$2("Method \"" + key + "\" conflicts with an existing Vue instance method. " +
                      "Avoid defining component methods that start with _ or $.");
              }
          }
          vm[key] = typeof methods[key] !== 'function' ? noop : bind$1(methods[key], vm);
      }
  }
  function initWatch(vm, watch) {
      for (var key in watch) {
          var handler = watch[key];
          if (Array.isArray(handler)) {
              for (var i = 0; i < handler.length; i++) {
                  createWatcher(vm, key, handler[i]);
              }
          }
          else {
              createWatcher(vm, key, handler);
          }
      }
  }
  function createWatcher(vm, expOrFn, handler, options) {
      if (isPlainObject(handler)) {
          options = handler;
          handler = handler.handler;
      }
      if (typeof handler === 'string') {
          handler = vm[handler];
      }
      return vm.$watch(expOrFn, handler, options);
  }
  function stateMixin(Vue) {
      // flow somehow has problems with directly declared definition object
      // when using Object.defineProperty, so we have to procedurally build up
      // the object here.
      var dataDef = {};
      dataDef.get = function () {
          return this._data;
      };
      var propsDef = {};
      propsDef.get = function () {
          return this._props;
      };
      {
          dataDef.set = function () {
              warn$2('Avoid replacing instance root $data. ' +
                  'Use nested data properties instead.', this);
          };
          propsDef.set = function () {
              warn$2("$props is readonly.", this);
          };
      }
      Object.defineProperty(Vue.prototype, '$data', dataDef);
      Object.defineProperty(Vue.prototype, '$props', propsDef);
      Vue.prototype.$set = set;
      Vue.prototype.$delete = del;
      Vue.prototype.$watch = function (expOrFn, cb, options) {
          var vm = this;
          if (isPlainObject(cb)) {
              return createWatcher(vm, expOrFn, cb, options);
          }
          options = options || {};
          options.user = true;
          var watcher = new Watcher(vm, expOrFn, cb, options);
          if (options.immediate) {
              pushTarget();
              try {
                  cb.call(vm, watcher.value);
              }
              catch (error) {
                  handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
              }
              popTarget();
          }
          return function unwatchFn() {
              watcher.teardown();
          };
      };
  }

  var uid = 0;
  /**
   * 给实例加上了_init方法，以供实例化时（new Vue()）调用
   * _init主要做了四件事情
   * 1.初始化 _uid _isVue
   * 2.合并相关options
   * 3.初始化相关功能以及钩子调用 initLifecycle initEvents initRender callHook('beforecreate') initInjections initState initProvide callHook('created')
   * 4.挂载vue vm.$mount(vm.$options.el)
   */
  function initMixin$1(Vue) {
      Vue.prototype._init = function (options) {
          var vm = this;
          // a uid
          /**
           * 第一部分
           * 1.初始化部分属性 _uid _isVue
           * 2.开启性能检测
           */
          vm._uid = uid++;
          var startTag, endTag;
          /* istanbul ignore if */
          if (config.performance && mark) {
              // 性能检测相关
              // 在created之后，性能测试结束
              startTag = "vue-perf-start:" + (vm._uid);
              endTag = "vue-perf-end:" + (vm._uid);
              mark(startTag);
          }
          // a flag to avoid this being observed
          // _isVue变量可以避免Vue实例对象被观察
          vm._isVue = true;
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
              initInternalComponent(vm, options);
          }
          else {
              // 如果是顶层实例则设置它的options
              // 对options进行合并，vue会将相关的属性和方法都统一放到vm.$options中，为后续的调用做准备工作。
              // vm.$option的属性来自两个方面，一个是Vue的构造函数(vm.constructor)预先定义的
              // 一个是new Vue时传入的入参对象
              vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), // 如果通过Vue.extend创造，则这一步会取出祖先的options
              options || {}, vm);
          }
          /**
           * 第三部分
           * 初始化相关功能
           */
          /* istanbul ignore else */
          {
              // 开发环境
              // 代理功能初始化，设置vm._renderProxy
              // 该功能其实主要是用来做一个非法访问属性的警告（形如this.a的属性访问）
              initProxy(vm);
          }
          // expose real self
          // _self保存实例本身
          vm._self = vm;
          // 初始化vue实例的一系列属性,给到默认属性
          // 1.找到最近的一个非抽象父组件，在他的$children数组中添加自己
          // 2.初始化一些变量 $parent $root $children $refs _watcher _inactive _directInactive _isMounted _isDestroyed _isBeingDestroyed
          initLifecycle(vm);
          // 初始化_events _hasHookEvent变量
          // 存储父组件绑定的当前子组件的事件，保存到vm._events。
          initEvents(vm);
          // 定义vm._c和 vm.$createElement等方法
          initRender(vm);
          // 生命周期事件通知
          // 挨着调用用户定义的生命周期钩子函数和指令
          callHook$1(vm, 'beforeCreate');
          // 通过逐级查找，从父级provide中获取子级组件inject定义的属性值，并增加对该属性的监听
          // 只设置setter和getter不实例化__ob__
          initInjections(vm); // resolve injections before data/props
          // initProps initMethods initData initComputed initWatch
          // 是对prop，method，data，computed，watch的初始化，增加对定义属性的监听
          initState(vm);
          // 把用户定义的provide赋值到_provided上
          // 如果是函数形式，就调用一下
          initProvide(vm); // resolve provide after data/props
          // 生命周期事件通知
          callHook$1(vm, 'created');
          /* istanbul ignore if */
          if (config.performance && mark) {
              // 性能测试结束部分
              vm._name = formatComponentName(vm, false);
              mark(endTag);
              measure(("vue " + (vm._name) + " init"), startTag, endTag);
          }
          // 挂载。如果说前面几部分都是准备阶段，那么这部分是整个new Vue的核心部分，将template编译成render表达式，然后转化为大名鼎鼎的Vnode，最终渲染为真实的dom节点。
          if (vm.$options.el) {
              vm.$mount(vm.$options.el);
          }
      };
  }
  function initInternalComponent(vm, options) {
      var opts = (vm.$options = Object.create(vm.constructor.options));
      // doing this because it's faster than dynamic enumeration.
      var parentVnode = options._parentVnode;
      opts.parent = options.parent;
      opts._parentVnode = parentVnode;
      var vnodeComponentOptions = parentVnode.componentOptions;
      opts.propsData = vnodeComponentOptions.propsData;
      opts._parentListeners = vnodeComponentOptions.listeners;
      opts._renderChildren = vnodeComponentOptions.children;
      opts._componentTag = vnodeComponentOptions.tag;
      if (options.render) {
          opts.render = options.render;
          opts.staticRenderFns = options.staticRenderFns;
      }
  }
  function resolveConstructorOptions(Ctor) {
      var options = Ctor.options;
      if (Ctor.super) {
          var superOptions = resolveConstructorOptions(Ctor.super);
          var cachedSuperOptions = Ctor.superOptions;
          if (superOptions !== cachedSuperOptions) {
              // super option changed,
              // need to resolve new options.
              Ctor.superOptions = superOptions;
              // check if there are any late-modified/attached options (#4976)
              var modifiedOptions = resolveModifiedOptions(Ctor);
              // update base extend options
              if (modifiedOptions) {
                  extend(Ctor.extendOptions, modifiedOptions);
              }
              options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
              if (options.name) {
                  options.components[options.name] = Ctor;
              }
          }
      }
      return options;
  }
  function resolveModifiedOptions(Ctor) {
      var modified;
      var latest = Ctor.options;
      var sealed = Ctor.sealedOptions;
      for (var key in latest) {
          if (latest[key] !== sealed[key]) {
              if (!modified)
                  { modified = {}; }
              modified[key] = latest[key];
          }
      }
      return modified;
  }

  function Vue(options) {
      // 对Vue函数没有使用new字符的警告
      if (!(this instanceof Vue)) {
          warn$2("Vue is a constructor and should be called with the `new` keyword");
      }
      // 核心初始化方法
      // 通过initMixin附上
      this._init(options);
  }
  //@ts-expect-error Vue has function type
  initMixin$1(Vue);
  //@ts-expect-error Vue has function type
  stateMixin(Vue);
  //@ts-expect-error Vue has function type
  eventsMixin(Vue);
  //@ts-expect-error Vue has function type
  lifecycleMixin(Vue);
  //@ts-expect-error Vue has function type
  renderMixin(Vue);

  function initUse(Vue) {
      Vue.use = function (plugin) {
          var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
          if (installedPlugins.indexOf(plugin) > -1) {
              return this;
          }
          // additional parameters
          var args = toArray(arguments, 1);
          args.unshift(this);
          if (typeof plugin.install === 'function') {
              plugin.install.apply(plugin, args);
          }
          else if (typeof plugin === 'function') {
              plugin.apply(null, args);
          }
          installedPlugins.push(plugin);
          return this;
      };
  }

  function initMixin(Vue) {
      Vue.mixin = function (mixin) {
          this.options = mergeOptions(this.options, mixin);
          return this;
      };
  }

  function initExtend(Vue) {
      /**
       * Each instance constructor, including Vue, has a unique
       * cid. This enables us to create wrapped "child
       * constructors" for prototypal inheritance and cache them.
       */
      Vue.cid = 0;
      var cid = 1;
      /**
       * Class inheritance
       */
      Vue.extend = function (extendOptions) {
          extendOptions = extendOptions || {};
          var Super = this;
          var SuperId = Super.cid;
          var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
          if (cachedCtors[SuperId]) {
              return cachedCtors[SuperId];
          }
          var name = extendOptions.name || Super.options.name;
          if (name) {
              validateComponentName(name);
          }
          var Sub = function VueComponent(options) {
              this._init(options);
          };
          Sub.prototype = Object.create(Super.prototype);
          Sub.prototype.constructor = Sub;
          Sub.cid = cid++;
          Sub.options = mergeOptions(Super.options, extendOptions);
          Sub['super'] = Super;
          // For props and computed properties, we define the proxy getters on
          // the Vue instances at extension time, on the extended prototype. This
          // avoids Object.defineProperty calls for each instance created.
          if (Sub.options.props) {
              initProps(Sub);
          }
          if (Sub.options.computed) {
              initComputed(Sub);
          }
          // allow further extension/mixin/plugin usage
          Sub.extend = Super.extend;
          Sub.mixin = Super.mixin;
          Sub.use = Super.use;
          // create asset registers, so extended classes
          // can have their private assets too.
          ASSET_TYPES.forEach(function (type) {
              Sub[type] = Super[type];
          });
          // enable recursive self-lookup
          if (name) {
              Sub.options.components[name] = Sub;
          }
          // keep a reference to the super options at extension time.
          // later at instantiation we can check if Super's options have
          // been updated.
          Sub.superOptions = Super.options;
          Sub.extendOptions = extendOptions;
          Sub.sealedOptions = extend({}, Sub.options);
          // cache constructor
          cachedCtors[SuperId] = Sub;
          return Sub;
      };
  }
  function initProps(Comp) {
      var props = Comp.options.props;
      for (var key in props) {
          proxy(Comp.prototype, "_props", key);
      }
  }
  function initComputed(Comp) {
      var computed = Comp.options.computed;
      for (var key in computed) {
          defineComputed(Comp.prototype, key, computed[key]);
      }
  }

  function initAssetRegisters(Vue) {
      /**
       * Create asset registration methods.
       */
      ASSET_TYPES.forEach(function (type) {
          // @ts-expect-error function is not exact same type
          Vue[type] = function (id, definition) {
              if (!definition) {
                  return this.options[type + 's'][id];
              }
              else {
                  /* istanbul ignore if */
                  if (type === 'component') {
                      validateComponentName(id);
                  }
                  if (type === 'component' && isPlainObject(definition)) {
                      // @ts-expect-error
                      definition.name = definition.name || id;
                      definition = this.options._base.extend(definition);
                  }
                  if (type === 'directive' && typeof definition === 'function') {
                      definition = { bind: definition, update: definition };
                  }
                  this.options[type + 's'][id] = definition;
                  return definition;
              }
          };
      });
  }

  /**
   * 获取组件名称
   * @date 2020-01-09
   * @param {?VNodeComponentOptions} opts
   * @returns {?string}
   */
  function getComponentName(opts) {
      return opts && (opts.Ctor.options.name || opts.tag);
  }
  /**
   * 用一些规则去匹配字符串
   * 如果是数组，则匹配数组成员
   * 如果是正则，则应用正则
   * 如果是字符串，则split(',')后匹配数组成员
   * @date 2020-01-09
   * @param {(string | RegExp | Array<string>)} pattern
   * @param {string} name
   * @returns {boolean}
   */
  function matches(pattern, name) {
      if (Array.isArray(pattern)) {
          // 如果规则是个数组，匹配数组成员
          return pattern.indexOf(name) > -1;
      }
      else if (typeof pattern === 'string') {
          // 如果规则
          return pattern.split(',').indexOf(name) > -1;
      }
      else if (isRegExp(pattern)) {
          return pattern.test(name);
      }
      /* istanbul ignore next */
      return false;
  }
  /**
   * 修剪缓存
   * 如果传入的filter返回false,那么会销毁filter过滤出的这个缓存实例
   * @date 2020-01-09
   * @param {*} keepAliveInstance
   * @param {Function} filter
   */
  function pruneCache(keepAliveInstance, filter) {
      var cache = keepAliveInstance.cache;
      var keys = keepAliveInstance.keys;
      var _vnode = keepAliveInstance._vnode;
      for (var key in cache) {
          var cachedNode = cache[key];
          if (cachedNode) {
              var name = getComponentName(cachedNode.componentOptions);
              if (name && !filter(name)) {
                  pruneCacheEntry(cache, key, keys, _vnode);
              }
          }
      }
  }
  /**
   * 销毁缓存中的vnode
   *
   * @date 2020-01-09
   * @param {VNodeCache} cache
   * @param {string} key
   * @param {Array<string>} keys
   * @param {VNode} [current]
   */
  function pruneCacheEntry(cache, key, keys, current) {
      var cached = cache[key];
      if (cached && (!current || cached.tag !== current.tag)) {
          //@ts-expect-error has void type
          cached.componentInstance.$destroy();
      }
      cache[key] = null;
      remove$2(keys, key);
  }
  var patternTypes = [String, RegExp, Array];
  /**
   * 导出组件
   */
  var KeepAlive = {
      name: 'keep-alive',
      abstract: true,
      props: {
          include: patternTypes,
          exclude: patternTypes,
          max: [String, Number], // 最多可以缓存多少组件实例 涉及LRU
      },
      created: function created() {
          this.cache = Object.create(null);
          this.keys = []; // 用来做LRU
      },
      /**
       * 销毁所有缓存组件
       *
       * @date 18/01/2021
       */
      destroyed: function destroyed() {
          for (var key in this.cache) {
              pruneCacheEntry(this.cache, key, this.keys);
          }
      },
      mounted: function mounted() {
          var this$1 = this;

          this.$watch('include', function (val) {
              pruneCache(this$1, function (name) { return matches(val, name); });
          });
          this.$watch('exclude', function (val) {
              pruneCache(this$1, function (name) { return !matches(val, name); });
          });
      },
      render: function render() {
          var slot = this.$slots.default;
          var vnode = getFirstComponentChild(slot);
          var componentOptions = vnode && vnode.componentOptions;
          if (componentOptions) {
              // check pattern
              var name = getComponentName(componentOptions);
              var ref = this;
              var include = ref.include;
              var exclude = ref.exclude;
              if (
              // not included
              (include && (!name || !matches(include, name))) ||
                  // excluded
                  (exclude && name && matches(exclude, name))) {
                  // 设置了included但不在included
                  // 或设置了exclude且在excluded中
                  // 直接返回vnode
                  // 即不会被缓存起来
                  return vnode;
              }
              var ref$1 = this;
              var cache = ref$1.cache;
              var keys = ref$1.keys;
              var key = vnode.key == null
                  ? // same constructor may get registered as different local components
                      // so cid alone is not enough (#3269)
                      componentOptions.Ctor.cid +
                          (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
                  : vnode.key;
              if (cache[key]) {
                  // 如果在缓存列表中,则从缓存列表中拿实例
                  vnode.componentInstance = cache[key].componentInstance;
                  // make current key freshest
                  // LRU
                  remove$2(keys, key);
                  keys.push(key);
              }
              else {
                  // 不在缓存列表中就缓存一下
                  cache[key] = vnode;
                  keys.push(key);
                  // prune oldest entry
                  // LRU
                  if (this.max && keys.length > parseInt(this.max)) {
                      pruneCacheEntry(cache, keys[0], keys, this._vnode);
                  }
              }
              vnode.data.keepAlive = true;
          }
          return vnode || (slot && slot[0]);
      },
  };

  var builtInComponents = {
      KeepAlive: KeepAlive,
  };

  function initGlobalAPI(Vue) {
      // config
      var configDef = {};
      configDef.get = function () { return config; };
      {
          configDef.set = function () {
              warn$2('Do not replace the Vue.config object, set individual fields instead.');
          };
      }
      Object.defineProperty(Vue, 'config', configDef);
      // exposed util methods.
      // NOTE: these are not considered part of the public API - avoid relying on
      // them unless you are aware of the risk.
      Vue.util = {
          warn: warn$2,
          extend: extend,
          mergeOptions: mergeOptions,
          defineReactive: defineReactive,
      };
      Vue.set = set;
      Vue.delete = del;
      Vue.nextTick = nextTick;
      // 2.6 explicit observable API
      Vue.observable = function (obj) {
          observe(obj);
          return obj;
      };
      Vue.options = Object.create(null);
      ASSET_TYPES.forEach(function (type) {
          Vue.options[type + 's'] = Object.create(null);
      });
      // this is used to identify the "base" constructor to extend all plain-object
      // components with in Weex's multi-instance scenarios.
      Vue.options._base = Vue;
      extend(Vue.options.components, builtInComponents);
      initUse(Vue);
      initMixin(Vue);
      initExtend(Vue);
      initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);
  Object.defineProperty(Vue.prototype, '$isServer', {
      get: isServerRendering,
  });
  Object.defineProperty(Vue.prototype, '$ssrContext', {
      get: function get() {
          /* istanbul ignore next */
          return this.$vnode && this.$vnode.ssrContext;
      },
  });
  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
      value: FunctionalRenderContext,
  });
  Vue.version = '2.6.12';

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');
  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
      return ((attr === 'value' && acceptValue(tag) && type !== 'button') ||
          (attr === 'selected' && tag === 'option') ||
          (attr === 'checked' && tag === 'input') ||
          (attr === 'muted' && tag === 'video'));
  };
  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');
  var convertEnumeratedValue = function (key, value) {
      return isFalsyAttrValue(value) || value === 'false'
          ? 'false'
          : // allow arbitrary string value for contenteditable
              key === 'contenteditable' && isValidContentEditableValue(value)
                  ? value
                  : 'true';
  };
  var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
      'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
      'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
      'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
      'required,reversed,scoped,seamless,selected,sortable,' +
      'truespeed,typemustmatch,visible');
  var xlinkNS = 'http://www.w3.org/1999/xlink';
  var isXlink = function (name) {
      return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
  };
  var getXlinkProp = function (name) {
      return isXlink(name) ? name.slice(6, name.length) : '';
  };
  var isFalsyAttrValue = function (val) {
      return val == null || val === false;
  };

  function genClassForVnode(vnode) {
      var data = vnode.data;
      var parentNode = vnode;
      var childNode = vnode;
      while (isDef(childNode.componentInstance)) {
          childNode = childNode.componentInstance._vnode;
          if (childNode && childNode.data) {
              data = mergeClassData(childNode.data, data);
          }
      }
      while (isDef((parentNode = parentNode.parent))) {
          if (parentNode && parentNode.data) {
              data = mergeClassData(data, parentNode.data);
          }
      }
      return renderClass(data.staticClass, data.class);
  }
  function mergeClassData(child, parent) {
      return {
          staticClass: concat(child.staticClass, parent.staticClass),
          class: isDef(child.class) ? [child.class, parent.class] : parent.class,
      };
  }
  function renderClass(staticClass, dynamicClass) {
      if (isDef(staticClass) || isDef(dynamicClass)) {
          return concat(staticClass, stringifyClass(dynamicClass));
      }
      /* istanbul ignore next */
      return '';
  }
  function concat(a, b) {
      return a ? (b ? a + ' ' + b : a) : b || '';
  }
  function stringifyClass(value) {
      if (Array.isArray(value)) {
          return stringifyArray(value);
      }
      if (isObject(value)) {
          return stringifyObject(value);
      }
      if (typeof value === 'string') {
          return value;
      }
      /* istanbul ignore next */
      return '';
  }
  function stringifyArray(value) {
      var res = '';
      var stringified;
      for (var i = 0, l = value.length; i < l; i++) {
          if (isDef((stringified = stringifyClass(value[i]))) && stringified !== '') {
              if (res)
                  { res += ' '; }
              res += stringified;
          }
      }
      return res;
  }
  function stringifyObject(value) {
      var res = '';
      for (var key in value) {
          if (value[key]) {
              if (res)
                  { res += ' '; }
              res += key;
          }
      }
      return res;
  }

  var namespaceMap = {
      svg: 'http://www.w3.org/2000/svg',
      math: 'http://www.w3.org/1998/Math/MathML',
  };
  var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' +
      'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
      'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
      'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
      's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
      'embed,object,param,source,canvas,script,noscript,del,ins,' +
      'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
      'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
      'output,progress,select,textarea,' +
      'details,dialog,menu,menuitem,summary,' +
      'content,element,shadow,template,blockquote,iframe,tfoot');
  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
      'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
      'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
  var isPreTag = function (tag) { return tag === 'pre'; };
  var isReservedTag = function (tag) {
      return isHTMLTag(tag) || isSVG(tag);
  };
  function getTagNamespace(tag) {
      if (isSVG(tag)) {
          return 'svg';
      }
      // basic support for MathML
      // note it doesn't support other MathML elements being component roots
      if (tag === 'math') {
          return 'math';
      }
  }
  var unknownElementCache = Object.create(null);
  function isUnknownElement(tag) {
      /* istanbul ignore if */
      if (!inBrowser) {
          return true;
      }
      if (isReservedTag(tag)) {
          return false;
      }
      tag = tag.toLowerCase();
      /* istanbul ignore if */
      if (unknownElementCache[tag] != null) {
          return unknownElementCache[tag];
      }
      var el = document.createElement(tag);
      if (tag.indexOf('-') > -1) {
          // http://stackoverflow.com/a/28210364/1070244
          return (unknownElementCache[tag] =
              el.constructor === window.HTMLUnknownElement ||
                  el.constructor === window.HTMLElement);
      }
      else {
          return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()));
      }
  }
  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /**
   * Query an element selector if it's not an element already.
   */
  function query(el) {
      if (typeof el === 'string') {
          var selected = document.querySelector(el);
          if (!selected) {
              warn$2('Cannot find element: ' + el);
              return document.createElement('div');
          }
          return selected;
      }
      else {
          return el;
      }
  }

  function createElement(tagName, vnode) {
      var elm = document.createElement(tagName);
      if (tagName !== 'select') {
          return elm;
      }
      // false or null will remove the attribute but undefined will not
      if (vnode.data &&
          vnode.data.attrs &&
          vnode.data.attrs.multiple !== undefined) {
          elm.setAttribute('multiple', 'multiple');
      }
      return elm;
  }
  function createElementNS(namespace, tagName) {
      return document.createElementNS(namespaceMap[namespace], tagName);
  }
  function createTextNode(text) {
      return document.createTextNode(text);
  }
  function createComment(text) {
      return document.createComment(text);
  }
  function insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
      node.removeChild(child);
  }
  function appendChild(node, child) {
      node.appendChild(child);
  }
  function parentNode(node) {
      return node.parentNode;
  }
  function nextSibling(node) {
      return node.nextSibling;
  }
  function tagName(node) {
      return node.tagName;
  }
  function setTextContent(node, text) {
      node.textContent = text;
  }
  function setStyleScope(node, scopeId) {
      node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  var ref$1 = {
      create: function create(_, vnode) {
          registerRef(vnode);
      },
      update: function update(oldVnode, vnode) {
          if (oldVnode.data.ref !== vnode.data.ref) {
              registerRef(oldVnode, true);
              registerRef(vnode);
          }
      },
      destroy: function destroy(vnode) {
          registerRef(vnode, true);
      },
  };
  function registerRef(vnode, isRemoval) {
      var key = vnode.data.ref;
      if (!isDef(key))
          { return; }
      var vm = vnode.context;
      var ref = vnode.componentInstance || vnode.elm;
      var refs = vm.$refs;
      var obj = refs[key];
      if (isRemoval) {
          if (Array.isArray(obj)) {
              remove$2(obj, ref);
          }
          else if (obj === ref) {
              refs[key] = undefined;
          }
      }
      else {
          if (vnode.data.refInFor) {
              if (!Array.isArray(obj)) {
                  refs[key] = [ref];
              }
              else if (obj.indexOf(ref) < 0) {
                  obj.push(ref);
              }
          }
          else {
              refs[key] = ref;
          }
      }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */
  var emptyNode = new VNode('', {}, []);
  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
  /**
   * 判断两个节点是否相同,无需完全相同，只比较下方的属性
   * key tag isComment !!data input-type
   * @date 2020-05-07
   * @param {*} a
   * @param {*} b
   * @returns
   */
  function sameVnode(a, b) {
      return (a.key === b.key && // key相同,undefined也算相同
          ((a.tag === b.tag && // tag相同
              a.isComment === b.isComment && // 是否是comment  注释节点
              isDef(a.data) === isDef(b.data) && // data,属性已定义 比如id属性
              sameInputType(a, b)) || // input相同 input的type类型相同
              (isTrue(a.isAsyncPlaceholder) &&
                  a.asyncFactory === b.asyncFactory &&
                  isUndef(b.asyncFactory.error))));
  }
  function sameInputType(a, b) {
      if (a.tag !== 'input')
          { return true; }
      var i;
      var typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
      var typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
      return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB));
  }
  /**
   * 把children中所有的key拿出来做成一个映射表并返回
   * {
   *   key_1: 1,
   *   key_2: 2,
   *   ...
   * }
   * @date 2020-05-07
   * @param {*} children -
   * @param {*} beginIdx - startIdx
   * @param {*} endIdx - endIdx
   * @returns
   */
  function createKeyToOldIdx(children, beginIdx, endIdx) {
      var i, key;
      var map = {};
      for (i = beginIdx; i <= endIdx; ++i) {
          key = children[i].key;
          if (isDef(key))
              { map[key] = i; }
      }
      return map;
  }
  /**
   * 一个终极长的函数
   * 内部定义了一系列方法，最后返回了patch方法，
   * 它有四个参数，实际在vm.__patch__(vm.$el, vnode, hydrating, false )传入
   *
   */
  function createPatchFunction(backend) {
      var i, j;
      var cbs = {};
      // nodeOps是关于dom节点的各种操作函数
      // modules是各种指令模块导出的以生命周期命名的函数
      // 比如modules.style.create = updateStyle<Function>
      var modules = backend.modules;
      var nodeOps = backend.nodeOps;
      // 给cbs加上所有模块对应的生命周期的回调函数
      // 例如style模块有create生命周期调用的函数updateStyle
      // 则cbs.create = [updateStyle]
      // 然后再看下一个modules有没有create生命周期该调用的函数,有就push进去
      // 则cbs.create = [updateStyle, updateActivite]
      for (i = 0; i < hooks.length; ++i) {
          cbs[hooks[i]] = [];
          for (j = 0; j < modules.length; ++j) {
              if (isDef(modules[j][hooks[i]])) {
                  cbs[hooks[i]].push(modules[j][hooks[i]]);
              }
          }
      }
      /**
       * 以传进来的这个实际dom节点为基础
       * 创建一个空的虚拟节点
       *
       * @date 14/01/2021
       * @param {*} elm
       * @return {*}
       */
      function emptyNodeAt(elm) {
          return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
      }
      /**
       * 创建remove回调
       * 调用后能删除当前创建的节点
       *
       * @date 14/01/2021
       * @param {*} childElm
       * @param {*} listeners
       * @return {*}
       */
      function createRmCb(childElm, listeners) {
          function remove() {
              if (--remove.listeners === 0) {
                  removeNode(childElm);
              }
          }
          remove.listeners = listeners;
          return remove;
      }
      /**
       * 删除元素
       * 如果有父dom元素
       * 从父dom元素中移除这个元素
       *
       * @date 14/01/2021
       * @param {*} el
       */
      function removeNode(el) {
          var parent = nodeOps.parentNode(el);
          // element may have already been removed due to v-html / v-text
          if (isDef(parent)) {
              nodeOps.removeChild(parent, el);
          }
      }
      /**
       * 判断vnode是不是未知的标签名
       */
      function isUnknownElement(vnode, inVPre) {
          return (!inVPre &&
              !vnode.ns &&
              !(config.ignoredElements.length &&
                  config.ignoredElements.some(function (ignore) {
                      return isRegExp(ignore)
                          ? ignore.test(vnode.tag)
                          : ignore === vnode.tag;
                  })) &&
              config.isUnknownElement(vnode.tag));
      }
      var creatingElmInVPre = 0;
      /**
       * 创建dom element
       *
       * @date 2020-04-23
       * @param {*} vnode - 虚拟node
       * @param {*} insertedVnodeQueue - inserted 钩子函数
       * @param {*} parentElm - 父节点的DOM 如果是#app节点,通常就是body标签
       * @param {*} refElm - 如果这个存在的话，就插到这个节点之前
       * @param {*} nested - 嵌套的
       * @param {*} ownerArray
       * @param {*} index
       */
      function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
          // 如果存在子节点的话,就会克隆一遍
          if (isDef(vnode.elm) && isDef(ownerArray)) {
              //这个vnode是在之前的渲染中使用过的!
              //现在它被用作一个新节点，覆盖它的elm会导致当它被用作插入时，可能会出现patch错误引用节点。
              // 相反，我们在创建之前按需克隆节点关联的DOM元素。
              vnode = ownerArray[index] = cloneVNode(vnode);
          }
          vnode.isRootInsert = !nested; // for transition enter check
          if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
              return;
          }
          var data = vnode.data;
          var children = vnode.children;
          var tag = vnode.tag;
          if (isDef(tag)) {
              // 1.合法性校验 
              {
                  if (data && data.pre) {
                      creatingElmInVPre++;
                  }
                  if (isUnknownElement(vnode, creatingElmInVPre)) {
                      warn$2('Unknown custom element: <' +
                          tag +
                          '> - did you ' +
                          'register the component correctly? For recursive components, ' +
                          'make sure to provide the "name" option.', vnode.context);
                  }
              }
              // 2、创建该vnode的dom元素
              // 没做什么特别的事情,有命名空间就创建命名空间,没有就创建DOM
              // 如果vnode有attrs中的multiple属性就加上
              vnode.elm = vnode.ns
                  ? nodeOps.createElementNS(vnode.ns, tag)
                  : nodeOps.createElement(tag, vnode);
              // 设置scope
              setScope(vnode);
              /* istanbul ignore if */
              {
                  // 如果有子节点,递归调用createElm
                  createChildren(vnode, children, insertedVnodeQueue);
                  if (isDef(data)) {
                      // 调用所有create hook
                      invokeCreateHooks(vnode, insertedVnodeQueue);
                  }
                  insert(parentElm, vnode.elm, refElm);
              }
              if (data && data.pre) {
                  creatingElmInVPre--;
              }
          }
          else if (isTrue(vnode.isComment)) {
              // 注释节点
              vnode.elm = nodeOps.createComment(vnode.text);
              insert(parentElm, vnode.elm, refElm);
          }
          else {
              // 其他节点
              vnode.elm = nodeOps.createTextNode(vnode.text);
              insert(parentElm, vnode.elm, refElm);
          }
      }
      /**
       * 创建组件
       *
       * @date 15/01/2021
       * @param {*} vnode
       * @param {*} insertedVnodeQueue
       * @param {*} parentElm
       * @param {*} refElm
       * @return {*}
       */
      function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
          var i = vnode.data;
          if (isDef(i)) {
              var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
              if (isDef((i = i.hook)) && isDef((i = i.init))) {
                  i(vnode, false /* hydrating */);
              }
              // after calling the init hook, if the vnode is a child component
              // it should've created a child instance and mounted it. the child
              // component also has set the placeholder vnode's elm.
              // in that case we can just return the element and be done.
              if (isDef(vnode.componentInstance)) {
                  initComponent(vnode, insertedVnodeQueue);
                  insert(parentElm, vnode.elm, refElm);
                  if (isTrue(isReactivated)) {
                      reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                  }
                  return true;
              }
          }
      }
      /**
       * 初始化组件
       *
       * @date 15/01/2021
       * @param {*} vnode
       * @param {*} insertedVnodeQueue
       */
      function initComponent(vnode, insertedVnodeQueue) {
          if (isDef(vnode.data.pendingInsert)) {
              insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
              vnode.data.pendingInsert = null;
          }
          vnode.elm = vnode.componentInstance.$el;
          if (isPatchable(vnode)) {
              invokeCreateHooks(vnode, insertedVnodeQueue);
              setScope(vnode);
          }
          else {
              // empty component root.
              // skip all element-related modules except for ref (#3455)
              registerRef(vnode);
              // make sure to invoke the insert hook
              insertedVnodeQueue.push(vnode);
          }
      }
      function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
          var i;
          // hack for #4339: a reactivated component with inner transition
          // does not trigger because the inner node's created hooks are not called
          // again. It's not ideal to involve module-specific logic in here but
          // there doesn't seem to be a better way to do it.
          var innerNode = vnode;
          while (innerNode.componentInstance) {
              innerNode = innerNode.componentInstance._vnode;
              if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
                  for (i = 0; i < cbs.activate.length; ++i) {
                      cbs.activate[i](emptyNode, innerNode);
                  }
                  insertedVnodeQueue.push(innerNode);
                  break;
              }
          }
          // unlike a newly created component,
          // a reactivated keep-alive component doesn't insert itself
          insert(parentElm, vnode.elm, refElm);
      }
      function insert(parent, elm, ref) {
          if (isDef(parent)) {
              if (isDef(ref)) {
                  if (nodeOps.parentNode(ref) === parent) {
                      // 有父节点就插入到ref节点之前
                      nodeOps.insertBefore(parent, elm, ref);
                  }
              }
              else {
                  // 添加子节点
                  nodeOps.appendChild(parent, elm);
              }
          }
      }
      /**
       * 创建子节点
       * @date 2020-04-23
       * @param {*} vnode
       * @param {*} children
       * @param {*} insertedVnodeQueue
       */
      function createChildren(vnode, children, insertedVnodeQueue) {
          // 如果有子节点，则调用creatElm递归创建
          if (Array.isArray(children)) {
              {
                  // 检查key是否重复
                  checkDuplicateKeys(children);
              }
              for (var i = 0; i < children.length; ++i) {
                  createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
              }
          }
          else if (isPrimitive(vnode.text)) {
              // 对于叶节点，直接添加text
              nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
          }
      }
      function isPatchable(vnode) {
          while (vnode.componentInstance) {
              vnode = vnode.componentInstance._vnode;
          }
          return isDef(vnode.tag);
      }
      /**
       * 调用所有create hook
       *
       * @date 15/01/2021
       * @param {*} vnode
       * @param {*} insertedVnodeQueue
       */
      function invokeCreateHooks(vnode, insertedVnodeQueue) {
          for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
              cbs.create[i$1](emptyNode, vnode);
          }
          i = vnode.data.hook; // Reuse variable
          if (isDef(i)) {
              if (isDef(i.create))
                  { i.create(emptyNode, vnode); }
              if (isDef(i.insert))
                  { insertedVnodeQueue.push(vnode); }
          }
      }
      // set scope id attribute for scoped CSS.
      // this is implemented as a special case to avoid the overhead
      // of going through the normal attribute patching process.
      // 为限定CSS设置范围id属性。
      // 如果有使用scoped css,给vnode设置范围id
      // 这是作为一种特殊情况实现的，以避免经历普通属性patching过程的开销。
      function setScope(vnode) {
          var i;
          if (isDef((i = vnode.fnScopeId))) {
              // 添加scopeId属性
              nodeOps.setStyleScope(vnode.elm, i);
          }
          else {
              // 向上查找直到最上层祖先元素
              // 同时如果每个祖先元素有_scopeId的话就加上scopeId属性
              var ancestor = vnode;
              while (ancestor) {
                  if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
                      nodeOps.setStyleScope(vnode.elm, i);
                  }
                  ancestor = ancestor.parent;
              }
          }
          // for slot content they should also get the scopeId from the host instance.
          // 对于插槽内容，它们还应该从主机实例获得scopeId
          if (isDef((i = activeInstance)) &&
              i !== vnode.context &&
              i !== vnode.fnContext &&
              isDef((i = i.$options._scopeId))) {
              nodeOps.setStyleScope(vnode.elm, i);
          }
      }
      /**
       * 根据vnode创建dom元素
       *
       * @date 15/01/2021
       * @param {*} parentElm 父节点
       * @param {*} refElm 插入到该节点之前
       * @param {*} vnodes 要被创建的节点组
       * @param {*} startIdx 计数器
       * @param {*} endIdx 计数器
       * @param {*} insertedVnodeQueue 插入队列
       */
      function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
          for (; startIdx <= endIdx; ++startIdx) {
              createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
          }
      }
      /**
       * 删除node,触发vnode上的destory hook
       */
      function invokeDestroyHook(vnode) {
          var i, j;
          var data = vnode.data;
          if (isDef(data)) {
              // 有定义hook或者destroy钩子就直接调用
              if (isDef((i = data.hook)) && isDef((i = i.destroy)))
                  { i(vnode); }
              for (i = 0; i < cbs.destroy.length; ++i)
                  { cbs.destroy[i](vnode); }
          }
          if (isDef((i = vnode.children))) {
              // 递归
              for (j = 0; j < vnode.children.length; ++j) {
                  invokeDestroyHook(vnode.children[j]);
              }
          }
      }
      /**
       * 移除vnode
       *
       * @date 15/01/2021
       * @param {*} vnodes
       * @param {*} startIdx
       * @param {*} endIdx
       */
      function removeVnodes(vnodes, startIdx, endIdx) {
          for (; startIdx <= endIdx; ++startIdx) {
              var ch = vnodes[startIdx];
              if (isDef(ch)) {
                  if (isDef(ch.tag)) {
                      removeAndInvokeRemoveHook(ch);
                      invokeDestroyHook(ch);
                  }
                  else {
                      // Text node
                      removeNode(ch.elm);
                  }
              }
          }
      }
      /**
       * 移除vnode并触发vnode上的remove hook
       *
       * @date 15/01/2021
       * @param {*} vnode
       * @param {*} rm
       */
      function removeAndInvokeRemoveHook(vnode, rm) {
          if (isDef(rm) || isDef(vnode.data)) {
              var i;
              var listeners = cbs.remove.length + 1;
              if (isDef(rm)) {
                  // we have a recursively passed down rm callback
                  // increase the listeners count
                  rm.listeners += listeners;
              }
              else {
                  // directly removing
                  rm = createRmCb(vnode.elm, listeners);
              }
              // recursively invoke hooks on child component root node
              if (isDef((i = vnode.componentInstance)) &&
                  isDef((i = i._vnode)) &&
                  isDef(i.data)) {
                  removeAndInvokeRemoveHook(i, rm);
              }
              for (i = 0; i < cbs.remove.length; ++i) {
                  cbs.remove[i](vnode, rm);
              }
              if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
                  i(vnode, rm);
              }
              else {
                  rm();
              }
          }
          else {
              removeNode(vnode.elm);
          }
      }
      /**
       * diff的核心函数
       * 按照规律一个个对比vnode
       *
       * @date 2020-05-07
       * @param {*} parentElm 父DOM节点
       * @param {*} oldCh 同层比较中的节点组
       * @param {*} newCh 同层比较中的节点组
       * @param {*} insertedVnodeQueue 插入队列
       * @param {*} removeOnly
       */
      function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
          var oldStartIdx = 0;
          var newStartIdx = 0;
          var oldEndIdx = oldCh.length - 1;
          var oldStartVnode = oldCh[0];
          var oldEndVnode = oldCh[oldEndIdx];
          var newEndIdx = newCh.length - 1;
          var newStartVnode = newCh[0];
          var newEndVnode = newCh[newEndIdx];
          var oldKeyToIdx, idxInOld, vnodeToMove, refElm;
          // removeOnly is a special flag used only by <transition-group>
          // to ensure removed elements stay in correct relative positions
          // during leaving transitions
          var canMove = !removeOnly;
          {
              checkDuplicateKeys(newCh);
          }
          // DIFF规则
          // 1.看os oe有没有,没有直接把索引移动向中间一位
          // 2.依次进行对比,看vnode是否相同
          //  顺序为对比osv nsv 对比oev nev 对比osv nev 对比oev nsv
          // osv === nsv, oev === nev 时只做下标更改,  下标向中间移动一位
          // osv === nev os移动到oe后面,  双方下标向中间移动一位
          // oev === nsv oe移动到os前面,  双方下标向中间移动一位
          // 3.四个地方都不相同的情况下,判断在oldCh中是否有和nsv相同key的vnode
          // (1) 在oldCh中有相同key的vnode
          //     进一步判断是否为相同vnode
          //        ①vnode一样,插入到oldStartVnode前,并将oldvnode置为undefined
          //        ②vnode不一样,以ns为基础创建一个ele元素并插入到oldStartVnode前
          // (2) 在oldCh中没有相同key的vnode
          //     创建一个ele元素并插入到oldStartVnode前
          // 同时,该规则是递归的.在每一个找到相等的oldVnode的时候,继续对相等的双方(新旧vnode)调用patchVnode
          while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              if (isUndef(oldStartVnode)) { // os没有定义，os索引向后移动一位
                  oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
              }
              else if (isUndef(oldEndVnode)) { //oe没有定义，oe索引向前移动一位
                  oldEndVnode = oldCh[--oldEndIdx];
              }
              else if (sameVnode(oldStartVnode, newStartVnode)) {
                  //os==ns，保持节点位置不变，继续比较其子节点，os,ns索引向后移动一位
                  patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                  oldStartVnode = oldCh[++oldStartIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else if (sameVnode(oldEndVnode, newEndVnode)) {
                  //oe==ne，保持节点位置不变，继续比较其子节点，oe，ne索引向前移动一位。
                  patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldStartVnode, newEndVnode)) {
                  // os==ne，将os节点移动到oe后面，继续比较其子节点，os索引向后移动一位，ne索引向前移动一位
                  patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                  canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                  oldStartVnode = oldCh[++oldStartIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldEndVnode, newStartVnode)) {
                  // oe==ns，将oe移动到os节点前，继续比较其子节点，oe索引向后移动一位，ns向前移动一位
                  patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                  canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else {
                  //两组都不相同的情况下
                  // 做个映射表,方便在旧vnode中找到那个vnode
                  if (isUndef(oldKeyToIdx))
                      { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
                  //在oldstartIdx与oldEndIdx间，查找与newStartVnode相同(key相同，或者节点元素相同)节点索引位置
                  idxInOld = isDef(newStartVnode.key)
                      ? oldKeyToIdx[newStartVnode.key]
                      : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                  if (isUndef(idxInOld)) {
                      // 没有相同节点，证明是个新的vnode
                      // 创建newStartVnode的真实dom节点并插入到oldStartVnode(不是最前面,是当前索引前面)前
                      createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                  }
                  else {
                      vnodeToMove = oldCh[idxInOld];
                      // 对比两个元素的key和节点
                      if (sameVnode(vnodeToMove, newStartVnode)) {
                          //key值和节点都都相同
                          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                          oldCh[idxInOld] = undefined;
                          //移动到oldStartVnode(不是最前面,是当前索引前面)前
                          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                      }
                      else {
                          // 相同的key，但节点元素不同，和没有相同节点一样.
                          // 以ns为基础创建一个ele元素并插入到oldStartVnode前
                          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                      }
                  }
                  //newStartVnode索引向前移
                  newStartVnode = newCh[++newStartIdx];
              }
          }
          // 全部遍历完了之后
          if (oldStartIdx > oldEndIdx) {
              //如果旧节点先遍历完，把剩余的vnode全部插入到oe后面位置
              // 尝试取nev后面的一个元素,取不到就算了
              refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
              addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
          }
          else if (newStartIdx > newEndIdx) {
              //新节点先遍历完，删除剩余的老节点
              removeVnodes(oldCh, oldStartIdx, oldEndIdx);
          }
      }
      /**
       * 检查是否有重复的key
       *
       * @date 15/01/2021
       * @param {*} children
       */
      function checkDuplicateKeys(children) {
          var seenKeys = {};
          for (var i = 0; i < children.length; i++) {
              var vnode = children[i];
              var key = vnode.key;
              if (isDef(key)) {
                  if (seenKeys[key]) {
                      warn$2(("Duplicate keys detected: '" + key + "'. This may cause an update error."), vnode.context);
                  }
                  else {
                      seenKeys[key] = true;
                  }
              }
          }
      }
      /**
       * 在oldCh中找到node并返回在oldCh中的位置(index)
       * @date 2020-05-08
       * @param {*} node
       * @param {*} oldCh
       * @param {*} start
       * @param {*} end
       * @returns
       */
      function findIdxInOld(node, oldCh, start, end) {
          for (var i = start; i < end; i++) {
              var c = oldCh[i];
              if (isDef(c) && sameVnode(node, c))
                  { return i; }
          }
      }
      /**
       * 对vnode进行新老对比并更新dom节点
       * 1.判断是否是static
       * 为了提高patch效率，对于静态节点，直接进行元素复用。
       * 2.更新当前节点，执行相关的update方法
       * 3.比较子节点
       * (1)对于非text叶节点，继续子节点比较。
       * 新旧子节点存在，则调用updateChildren继续比较；
       * 新子节点存在，旧子节点不存在，则说明该子节点是新增，调用addVnodes创建；
       * 新子节点不存在，旧子节点存在，说明该子节点是多余的，调用removeVnodes删除该节点。
       * (2)对于text叶节点，如果text内容不同，则直接更新。
       * @date 2020-05-07
       * @param {*} oldVnode
       * @param {*} vnode
       * @param {*} insertedVnodeQueue
       * @param {*} ownerArray
       * @param {*} index
       * @param {*} removeOnly
       */
      function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
          // 新老节点相同就直接renturn
          if (oldVnode === vnode) {
              return;
          }
          // 如果新的vnode已经有了element实例 表示是在之前的渲染中使用的
          // 并且已经存在等待插入的节点
          if (isDef(vnode.elm) && isDef(ownerArray)) {
              // clone reused vnode
              vnode = ownerArray[index] = cloneVNode(vnode);
          }
          // 先暂时把新老vnode对应的element统一
          // 新vnode一般是没有elm的
          var elm = (vnode.elm = oldVnode.elm);
          if (isTrue(oldVnode.isAsyncPlaceholder)) {
              if (isDef(vnode.asyncFactory.resolved)) {
                  hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
              }
              else {
                  vnode.isAsyncPlaceholder = true;
              }
              return;
          }
          // reuse element for static trees.
          // note we only do this if the vnode is cloned -
          // if the new node is not cloned it means the render functions have been
          // reset by the hot-reload-api and we need to do a proper re-render.
          //1、对于static节点树，无需比较，直接节点复用
          if (isTrue(vnode.isStatic) &&
              isTrue(oldVnode.isStatic) &&
              vnode.key === oldVnode.key &&
              (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
              vnode.componentInstance = oldVnode.componentInstance;
              return;
          }
          var i;
          var data = vnode.data;
          if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
              i(oldVnode, vnode);
          }
          // 获取oldVnode，Vnode的子节点，进行比较
          var oldCh = oldVnode.children;
          var ch = vnode.children;
          //2、更新当前节点，执行update相关方法
          if (isDef(data) && isPatchable(vnode)) {
              // 如果vnode上有
              // 调用所有指令模块的update方法去更新标签上附带的state
              for (i = 0; i < cbs.update.length; ++i)
                  { cbs.update[i](oldVnode, vnode); }
              if (isDef((i = data.hook)) && isDef((i = i.update)))
                  { i(oldVnode, vnode); }
          }
          //3、比较子节点
          if (isUndef(vnode.text)) { //3.1 非text节点
              if (isDef(oldCh) && isDef(ch)) { //新的有子节点,旧的没有
                  // 新旧节点不同,递归调用updateChildren继续比较
                  if (oldCh !== ch)
                      { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
              }
              else if (isDef(ch)) {
                  // 新子节点存在，旧子节点不存在，添加新节点
                  // 如果有文本内容,先清空文本内容
                  // 然后再加入新节点
                  {
                      checkDuplicateKeys(ch);
                  }
                  if (isDef(oldVnode.text))
                      { nodeOps.setTextContent(elm, ''); }
                  addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
              }
              else if (isDef(oldCh)) {
                  // 旧的有子节点,新的没有子节点,直接删除子节点
                  removeVnodes(oldCh, 0, oldCh.length - 1);
              }
              else if (isDef(oldVnode.text)) { //旧节点为text节点，则设置为空
                  nodeOps.setTextContent(elm, '');
              }
          }
          else if (oldVnode.text !== vnode.text) { //3.2 text叶节点，但是text不同，直接更新
              nodeOps.setTextContent(elm, vnode.text);
          }
          if (isDef(data)) {
              if (isDef((i = data.hook)) && isDef((i = i.postpatch)))
                  { i(oldVnode, vnode); }
          }
      }
      function invokeInsertHook(vnode, queue, initial) {
          // delay insert hooks for component root nodes, invoke them after the
          // element is really inserted
          if (isTrue(initial) && isDef(vnode.parent)) {
              vnode.parent.data.pendingInsert = queue;
          }
          else {
              for (var i = 0; i < queue.length; ++i) {
                  queue[i].data.hook.insert(queue[i]);
              }
          }
      }
      var hydrationBailed = false;
      // list of modules that can skip create hook during hydration because they
      // are already rendered on the client or has no need for initialization
      // Note: style is excluded because it relies on initial clone for future
      // deep updates (#7063).
      var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
      // Note: this is a browser-only function so we can assume elms are DOM nodes.
      function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
          var i;
          var tag = vnode.tag;
          var data = vnode.data;
          var children = vnode.children;
          inVPre = inVPre || (data && data.pre);
          vnode.elm = elm;
          if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
              vnode.isAsyncPlaceholder = true;
              return true;
          }
          // assert node match
          {
              if (!assertNodeMatch(elm, vnode, inVPre)) {
                  return false;
              }
          }
          if (isDef(data)) {
              if (isDef((i = data.hook)) && isDef((i = i.init)))
                  { i(vnode, true /* hydrating */); }
              if (isDef((i = vnode.componentInstance))) {
                  // child component. it should have hydrated its own tree.
                  initComponent(vnode, insertedVnodeQueue);
                  return true;
              }
          }
          if (isDef(tag)) {
              if (isDef(children)) {
                  // empty element, allow client to pick up and populate children
                  if (!elm.hasChildNodes()) {
                      createChildren(vnode, children, insertedVnodeQueue);
                  }
                  else {
                      // v-html and domProps: innerHTML
                      if (isDef((i = data)) &&
                          isDef((i = i.domProps)) &&
                          isDef((i = i.innerHTML))) {
                          if (i !== elm.innerHTML) {
                              /* istanbul ignore if */
                              if (typeof console !== 'undefined' &&
                                  !hydrationBailed) {
                                  hydrationBailed = true;
                                  console.warn('Parent: ', elm);
                                  console.warn('server innerHTML: ', i);
                                  console.warn('client innerHTML: ', elm.innerHTML);
                              }
                              return false;
                          }
                      }
                      else {
                          // iterate and compare children lists
                          var childrenMatch = true;
                          var childNode = elm.firstChild;
                          for (var i$1 = 0; i$1 < children.length; i$1++) {
                              if (!childNode ||
                                  !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                                  childrenMatch = false;
                                  break;
                              }
                              childNode = childNode.nextSibling;
                          }
                          // if childNode is not null, it means the actual childNodes list is
                          // longer than the virtual children list.
                          if (!childrenMatch || childNode) {
                              /* istanbul ignore if */
                              if (typeof console !== 'undefined' &&
                                  !hydrationBailed) {
                                  hydrationBailed = true;
                                  console.warn('Parent: ', elm);
                                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                              }
                              return false;
                          }
                      }
                  }
              }
              if (isDef(data)) {
                  var fullInvoke = false;
                  for (var key in data) {
                      if (!isRenderedModule(key)) {
                          fullInvoke = true;
                          invokeCreateHooks(vnode, insertedVnodeQueue);
                          break;
                      }
                  }
                  if (!fullInvoke && data['class']) {
                      // ensure collecting deps for deep class bindings for future updates
                      traverse(data['class']);
                  }
              }
          }
          else if (elm.data !== vnode.text) {
              elm.data = vnode.text;
          }
          return true;
      }
      function assertNodeMatch(node, vnode, inVPre) {
          if (isDef(vnode.tag)) {
              return (vnode.tag.indexOf('vue-component') === 0 ||
                  (!isUnknownElement(vnode, inVPre) &&
                      vnode.tag.toLowerCase() ===
                          (node.tagName && node.tagName.toLowerCase())));
          }
          else {
              return node.nodeType === (vnode.isComment ? 8 : 3);
          }
      }
      /**
       * vm.__patch__的实际调用函数
       * 用来渲染和更新实际DOM
       * 返回最终更新后的DOM
       * e.g.
       * vm.__patch__(vm.$el, vnode, hydrating, false )
       * vm.__patch__(prevVnode, vnode)
       * @date 2020-04-23
       * @param {*} oldVnode - 老的虚拟dom
       * @param {*} vnode - 新的虚拟dom
       * @param {*} hydrating - 是否开启激活模式
       * @param {*} removeOnly
       * @returns
       */
      return function patch(oldVnode, vnode, hydrating, removeOnly) {
          // 如果没有定义新vnode,但有oldVnode
          // 证明节点被销毁了
          // 对老节点调用destroy hook钩子
          // 虚拟dom的remove在后面进行
          if (isUndef(vnode)) {
              if (isDef(oldVnode))
                  { invokeDestroyHook(oldVnode); }
              return;
          }
          var isInitialPatch = false;
          // 这是等待插入的虚拟节点队列
          var insertedVnodeQueue = [];
          if (isUndef(oldVnode)) {
              // 1.oldVnode为空(首次渲染,或者是组件节点),直接创建新的dom节点
              // empty mount (likely as component), create new root element
              // 没有oldVnode，证明初次渲染
              // empty mount (likely as component), create new root element
              isInitialPatch = true;
              // 创建新的dom节点
              createElm(vnode, insertedVnodeQueue);
          }
          else {
              // 2.新老Vnode都存在
              // 判断oldVnode这个参数是不是一个dom元素实例
              // nodeType 元素类型
              var isRealElement = isDef(oldVnode.nodeType);
              if (!isRealElement && sameVnode(oldVnode, vnode)) {
                  // 不是一个dom实例(那就是一个vnode了)
                  // 并且新老虚拟节点形似
                  // 去patchVnode
                  // patch existing root node
                  patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
              }
              else {
                  // oldVnode是一个dom实例
                  // 或者新老虚拟节点不一样
                  if (isRealElement) {
                      // oldVnode是一个dom实例
                      // mounting to a real element
                      // check if this is server-rendered content and if we can perform
                      // a successful hydration.
                      // 检查一下,如果是服务器渲染并且我们能执行一个成功的hydration
                      if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                          oldVnode.removeAttribute(SSR_ATTR);
                          hydrating = true;
                      }
                      // 服务端渲染有关
                      if (isTrue(hydrating)) {
                          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                              invokeInsertHook(vnode, insertedVnodeQueue, true);
                              return oldVnode;
                          }
                          else {
                              warn$2('The client-side rendered virtual DOM tree is not matching ' +
                                  'server-rendered content. This is likely caused by incorrect ' +
                                  'HTML markup, for example nesting block-level elements inside ' +
                                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                                  'full client-side render.');
                          }
                      }
                      // either not server-rendered, or hydration failed.
                      // create an empty node and replace it
                      // 如果不是服务端渲染或者hydration出错
                      // 把这个oldVnode从Element实例转空的Vnode实例
                      oldVnode = emptyNodeAt(oldVnode);
                  }
                  // replacing existing element
                  /**
                   * oldVnode对应的dom节点
                   */
                  var oldElm = oldVnode.elm;
                  /**
                   * oldVnode对应的dom节点的父节点
                   */
                  var parentElm = nodeOps.parentNode(oldElm);
                  // create new node
                  // 3.用新的vnode创建dom节点
                  createElm(vnode, insertedVnodeQueue, 
                  // extremely rare edge case: do not insert if old element is in a
                  // leaving transition. Only happens when combining transition +
                  // keep-alive + HOCs. (#4590)
                  oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm) // 下一个兄弟节点
                  );
                  // update parent placeholder node element, recursively
                  if (isDef(vnode.parent)) {
                      // 如果vnode还有父节点存在
                      /**
                       * vnode的父节点(祖先节点)
                       * 因为parent忽略文本节点等垃圾节点
                       */
                      var ancestor = vnode.parent;
                      var patchable = isPatchable(vnode);
                      while (ancestor) {
                          for (var i = 0; i < cbs.destroy.length; ++i) {
                              cbs.destroy[i](ancestor);
                          }
                          ancestor.elm = vnode.elm;
                          if (patchable) {
                              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                                  cbs.create[i$1](emptyNode, ancestor);
                              }
                              // #6513
                              // invoke insert hooks that may have been merged by create hooks.
                              // e.g. for directives that uses the "inserted" hook.
                              var insert = ancestor.data.hook.insert;
                              if (insert.merged) {
                                  // start at index 1 to avoid re-invoking component mounted hook
                                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                                      insert.fns[i$2]();
                                  }
                              }
                          }
                          else {
                              registerRef(ancestor);
                          }
                          ancestor = ancestor.parent;
                      }
                  }
                  // destroy old node
                  if (isDef(parentElm)) {
                      removeVnodes([oldVnode], 0, 0);
                  }
                  else if (isDef(oldVnode.tag)) {
                      invokeDestroyHook(oldVnode);
                  }
              }
          }
          invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
          return vnode.elm;
      };
  }

  var directives$1 = {
      create: updateDirectives,
      update: updateDirectives,
      destroy: function unbindDirectives(vnode) {
          // @ts-expect-error emptyNode is not VNodeWithData
          updateDirectives(vnode, emptyNode);
      },
  };
  function updateDirectives(oldVnode, vnode) {
      if (oldVnode.data.directives || vnode.data.directives) {
          _update(oldVnode, vnode);
      }
  }
  function _update(oldVnode, vnode) {
      var isCreate = oldVnode === emptyNode;
      var isDestroy = vnode === emptyNode;
      var oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context);
      var newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
      var dirsWithInsert = [];
      var dirsWithPostpatch = [];
      var key, oldDir, dir;
      for (key in newDirs) {
          oldDir = oldDirs[key];
          dir = newDirs[key];
          if (!oldDir) {
              // new directive, bind
              callHook(dir, 'bind', vnode, oldVnode);
              if (dir.def && dir.def.inserted) {
                  dirsWithInsert.push(dir);
              }
          }
          else {
              // existing directive, update
              dir.oldValue = oldDir.value;
              dir.oldArg = oldDir.arg;
              callHook(dir, 'update', vnode, oldVnode);
              if (dir.def && dir.def.componentUpdated) {
                  dirsWithPostpatch.push(dir);
              }
          }
      }
      if (dirsWithInsert.length) {
          var callInsert = function () {
              for (var i = 0; i < dirsWithInsert.length; i++) {
                  callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode);
              }
          };
          if (isCreate) {
              mergeVNodeHook(vnode, 'insert', callInsert);
          }
          else {
              callInsert();
          }
      }
      if (dirsWithPostpatch.length) {
          mergeVNodeHook(vnode, 'postpatch', function () {
              for (var i = 0; i < dirsWithPostpatch.length; i++) {
                  callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
              }
          });
      }
      if (!isCreate) {
          for (key in oldDirs) {
              if (!newDirs[key]) {
                  // no longer present, unbind
                  callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
              }
          }
      }
  }
  var emptyModifiers = Object.create(null);
  function normalizeDirectives(dirs, vm) {
      var res = Object.create(null);
      if (!dirs) {
          // $flow-disable-line
          return res;
      }
      var i, dir;
      for (i = 0; i < dirs.length; i++) {
          dir = dirs[i];
          if (!dir.modifiers) {
              // $flow-disable-line
              dir.modifiers = emptyModifiers;
          }
          res[getRawDirName(dir)] = dir;
          dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
      }
      // $flow-disable-line
      return res;
  }
  function getRawDirName(dir) {
      return (dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.'))));
  }
  function callHook(dir, hook, vnode, oldVnode, isDestroy) {
      var fn = dir.def && dir.def[hook];
      if (fn) {
          try {
              fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
          }
          catch (e) {
              handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
          }
      }
  }

  var baseModules = [ref$1, directives$1];

  function updateAttrs(oldVnode, vnode) {
      var opts = vnode.componentOptions;
      if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
          return;
      }
      if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
          return;
      }
      var key, cur, old;
      var elm = vnode.elm;
      var oldAttrs = oldVnode.data.attrs || {};
      var attrs = vnode.data.attrs || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(attrs.__ob__)) {
          attrs = vnode.data.attrs = extend({}, attrs);
      }
      for (key in attrs) {
          cur = attrs[key];
          old = oldAttrs[key];
          if (old !== cur) {
              setAttr(elm, key, cur, vnode.data.pre);
          }
      }
      // #4391: in IE9, setting type can reset value for input[type=radio]
      // #6666: IE/Edge forces progress value down to 1 before setting a max
      /* istanbul ignore if */
      if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
          setAttr(elm, 'value', attrs.value);
      }
      for (key in oldAttrs) {
          if (isUndef(attrs[key])) {
              if (isXlink(key)) {
                  elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
              }
              else if (!isEnumeratedAttr(key)) {
                  elm.removeAttribute(key);
              }
          }
      }
  }
  function setAttr(el, key, value, isInPre) {
      if (isInPre || el.tagName.indexOf('-') > -1) {
          baseSetAttr(el, key, value);
      }
      else if (isBooleanAttr(key)) {
          // set attribute for blank value
          // e.g. <option disabled>Select one</option>
          if (isFalsyAttrValue(value)) {
              el.removeAttribute(key);
          }
          else {
              // technically allowfullscreen is a boolean attribute for <iframe>,
              // but Flash expects a value of "true" when used on <embed> tag
              value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
              el.setAttribute(key, value);
          }
      }
      else if (isEnumeratedAttr(key)) {
          el.setAttribute(key, convertEnumeratedValue(key, value));
      }
      else if (isXlink(key)) {
          if (isFalsyAttrValue(value)) {
              el.removeAttributeNS(xlinkNS, getXlinkProp(key));
          }
          else {
              el.setAttributeNS(xlinkNS, key, value);
          }
      }
      else {
          baseSetAttr(el, key, value);
      }
  }
  function baseSetAttr(el, key, value) {
      if (isFalsyAttrValue(value)) {
          el.removeAttribute(key);
      }
      else {
          // #7138: IE10 & 11 fires input event when setting placeholder on
          // <textarea>... block the first input event and remove the blocker
          // immediately.
          /* istanbul ignore if */
          if (isIE &&
              !isIE9 &&
              el.tagName === 'TEXTAREA' &&
              key === 'placeholder' &&
              value !== '' &&
              !el.__ieph) {
              var blocker = function (e) {
                  e.stopImmediatePropagation();
                  el.removeEventListener('input', blocker);
              };
              el.addEventListener('input', blocker);
              // $flow-disable-line
              el.__ieph = true; /* IE placeholder patched */
          }
          el.setAttribute(key, value);
      }
  }
  var attrs = {
      create: updateAttrs,
      update: updateAttrs,
  };

  function updateClass(oldVnode, vnode) {
      var el = vnode.elm;
      var data = vnode.data;
      var oldData = oldVnode.data;
      if (isUndef(data.staticClass) &&
          isUndef(data.class) &&
          (isUndef(oldData) ||
              (isUndef(oldData.staticClass) && isUndef(oldData.class)))) {
          return;
      }
      var cls = genClassForVnode(vnode);
      // handle transition classes
      var transitionClass = el._transitionClasses;
      if (isDef(transitionClass)) {
          cls = concat(cls, stringifyClass(transitionClass));
      }
      // set the class
      if (cls !== el._prevClass) {
          el.setAttribute('class', cls);
          el._prevClass = cls;
      }
  }
  var klass$1 = {
      create: updateClass,
      update: updateClass,
  };

  var validDivisionCharRE = /[\w).+\-_$\]]/;
  function parseFilters(exp) {
      var inSingle = false;
      var inDouble = false;
      var inTemplateString = false;
      var inRegex = false;
      var curly = 0;
      var square = 0;
      var paren = 0;
      var lastFilterIndex = 0;
      var c, prev, i, expression, filters;
      for (i = 0; i < exp.length; i++) {
          prev = c;
          c = exp.charCodeAt(i);
          if (inSingle) {
              if (c === 0x27 && prev !== 0x5c)
                  { inSingle = false; }
          }
          else if (inDouble) {
              if (c === 0x22 && prev !== 0x5c)
                  { inDouble = false; }
          }
          else if (inTemplateString) {
              if (c === 0x60 && prev !== 0x5c)
                  { inTemplateString = false; }
          }
          else if (inRegex) {
              if (c === 0x2f && prev !== 0x5c)
                  { inRegex = false; }
          }
          else if (c === 0x7c && // pipe
              exp.charCodeAt(i + 1) !== 0x7c &&
              exp.charCodeAt(i - 1) !== 0x7c &&
              !curly &&
              !square &&
              !paren) {
              if (expression === undefined) {
                  // first filter, end of expression
                  lastFilterIndex = i + 1;
                  expression = exp.slice(0, i).trim();
              }
              else {
                  pushFilter();
              }
          }
          else {
              switch (c) {
                  case 0x22:
                      inDouble = true;
                      break; // "
                  case 0x27:
                      inSingle = true;
                      break; // '
                  case 0x60:
                      inTemplateString = true;
                      break; // `
                  case 0x28:
                      paren++;
                      break; // (
                  case 0x29:
                      paren--;
                      break; // )
                  case 0x5b:
                      square++;
                      break; // [
                  case 0x5d:
                      square--;
                      break; // ]
                  case 0x7b:
                      curly++;
                      break; // {
                  case 0x7d:
                      curly--;
                      break; // }
              }
              if (c === 0x2f) {
                  // /
                  var j = i - 1;
                  var p = (void 0);
                  // find first non-whitespace prev char
                  for (; j >= 0; j--) {
                      p = exp.charAt(j);
                      if (p !== ' ')
                          { break; }
                  }
                  if (!p || !validDivisionCharRE.test(p)) {
                      inRegex = true;
                  }
              }
          }
      }
      if (expression === undefined) {
          expression = exp.slice(0, i).trim();
      }
      else if (lastFilterIndex !== 0) {
          pushFilter();
      }
      function pushFilter() {
          (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
          lastFilterIndex = i + 1;
      }
      if (filters) {
          for (i = 0; i < filters.length; i++) {
              expression = wrapFilter(expression, filters[i]);
          }
      }
      return expression;
  }
  function wrapFilter(exp, filter) {
      var i = filter.indexOf('(');
      if (i < 0) {
          // _f: resolveFilter
          return ("_f(\"" + filter + "\")(" + exp + ")");
      }
      else {
          var name = filter.slice(0, i);
          var args = filter.slice(i + 1);
          return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args));
      }
  }

  /* eslint-disable no-unused-vars */
  function baseWarn(msg, range) {
      console.error(("[Vue compiler]: " + msg));
  }
  /* eslint-enable no-unused-vars */
  function pluckModuleFunction(modules, key) {
      return modules ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; }) : [];
  }
  function addProp(el, name, value, range, dynamic) {
      (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
      el.plain = false;
  }
  function addAttr(el, name, value, range, dynamic) {
      var attrs = dynamic
          ? el.dynamicAttrs || (el.dynamicAttrs = [])
          : el.attrs || (el.attrs = []);
      attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
      el.plain = false;
  }
  // add a raw attr (use this in preTransforms)
  function addRawAttr(el, name, value, range) {
      el.attrsMap[name] = value;
      el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
  }
  function addDirective(el, name, rawName, value, arg, isDynamicArg, modifiers, range) {
      (el.directives || (el.directives = [])).push(rangeSetItem({
          name: name,
          rawName: rawName,
          value: value,
          arg: arg,
          isDynamicArg: isDynamicArg,
          modifiers: modifiers,
      }, range));
      el.plain = false;
  }
  function prependModifierMarker(symbol, name, dynamic) {
      return dynamic ? ("_p(" + name + ",\"" + symbol + "\")") : symbol + name; // mark the event as captured
  }
  function addHandler(el, name, value, modifiers, important, warn, range, dynamic) {
      modifiers = modifiers || emptyObject;
      // warn prevent and passive modifier
      /* istanbul ignore if */
      if (warn &&
          modifiers.prevent &&
          modifiers.passive) {
          warn("passive and prevent can't be used together. " +
              "Passive handler can't prevent default event.", range);
      }
      // normalize click.right and click.middle since they don't actually fire
      // this is technically browser-specific, but at least for now browsers are
      // the only target envs that have right/middle clicks.
      if (modifiers.right) {
          if (dynamic) {
              name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
          }
          else if (name === 'click') {
              name = 'contextmenu';
              delete modifiers.right;
          }
      }
      else if (modifiers.middle) {
          if (dynamic) {
              name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
          }
          else if (name === 'click') {
              name = 'mouseup';
          }
      }
      // check capture modifier
      if (modifiers.capture) {
          delete modifiers.capture;
          name = prependModifierMarker('!', name, dynamic);
      }
      if (modifiers.once) {
          delete modifiers.once;
          name = prependModifierMarker('~', name, dynamic);
      }
      /* istanbul ignore if */
      if (modifiers.passive) {
          delete modifiers.passive;
          name = prependModifierMarker('&', name, dynamic);
      }
      var events;
      if (modifiers.native) {
          delete modifiers.native;
          events = el.nativeEvents || (el.nativeEvents = {});
      }
      else {
          events = el.events || (el.events = {});
      }
      var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
      if (modifiers !== emptyObject) {
          newHandler.modifiers = modifiers;
      }
      var handlers = events[name];
      /* istanbul ignore if */
      if (Array.isArray(handlers)) {
          important ? handlers.unshift(newHandler) : handlers.push(newHandler);
      }
      else if (handlers) {
          events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
      }
      else {
          events[name] = newHandler;
      }
      el.plain = false;
  }
  function getRawBindingAttr(el, name) {
      return (el.rawAttrsMap[':' + name] ||
          el.rawAttrsMap['v-bind:' + name] ||
          el.rawAttrsMap[name]);
  }
  /**
   * 获取绑定的attr
   * 取:name或者v-bind:name中的name
   *
   * @date 18/01/2021
   * @export
   * @param {ASTElement} el
   * @param {string} name
   * @param {boolean} [getStatic]
   * @return {*}  {?string}
   */
  function getBindingAttr(el, name, getStatic) {
      var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
      if (dynamicValue != null) {
          return parseFilters(dynamicValue);
      }
      else if (getStatic !== false) {
          var staticValue = getAndRemoveAttr(el, name);
          if (staticValue != null) {
              return JSON.stringify(staticValue);
          }
      }
  }
  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.
  function getAndRemoveAttr(el, name, removeFromMap) {
      var val;
      // 确定这个attr在attrsMap中存在,name就在attrsList中删除它
      if ((val = el.attrsMap[name]) != null) {
          var list = el.attrsList;
          for (var i = 0, l = list.length; i < l; i++) {
              if (list[i].name === name) {
                  list.splice(i, 1);
                  break;
              }
          }
      }
      if (removeFromMap) {
          delete el.attrsMap[name];
      }
      return val;
  }
  function getAndRemoveAttrByRegex(el, name) {
      var list = el.attrsList;
      for (var i = 0, l = list.length; i < l; i++) {
          var attr = list[i];
          if (name.test(attr.name)) {
              list.splice(i, 1);
              return attr;
          }
      }
  }
  function rangeSetItem(item, range) {
      if (range) {
          if (range.start != null) {
              item.start = range.start;
          }
          if (range.end != null) {
              item.end = range.end;
          }
      }
      return item;
  }

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel(el, value, modifiers) {
      var ref = modifiers || {};
      var number = ref.number;
      var trim = ref.trim;
      var baseValueExpression = '$$v';
      var valueExpression = baseValueExpression;
      if (trim) {
          valueExpression =
              "(typeof " + baseValueExpression + " === 'string'" +
                  "? " + baseValueExpression + ".trim()" +
                  ": " + baseValueExpression + ")";
      }
      if (number) {
          valueExpression = "_n(" + valueExpression + ")";
      }
      var assignment = genAssignmentCode(value, valueExpression);
      el.model = {
          value: ("(" + value + ")"),
          expression: JSON.stringify(value),
          callback: ("function (" + baseValueExpression + ") {" + assignment + "}"),
      };
  }
  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode(value, assignment) {
      var res = parseModel(value);
      if (res.key === null) {
          return (value + "=" + assignment);
      }
      else {
          return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")");
      }
  }
  /**
   * Parse a v-model expression into a base path and a final key segment.
   * Handles both dot-path and possible square brackets.
   *
   * Possible cases:
   *
   * - test
   * - test[key]
   * - test[test1[key]]
   * - test["a"][key]
   * - xxx.test[a[a].test1[key]]
   * - test.xxx.a["asa"][test1[key]]
   *
   */
  var len, str, chr, index, expressionPos, expressionEndPos;
  function parseModel(val) {
      // Fix https://github.com/vuejs/vue/pull/7730
      // allow v-model="obj.val " (trailing whitespace)
      val = val.trim();
      len = val.length;
      if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
          index = val.lastIndexOf('.');
          if (index > -1) {
              return {
                  exp: val.slice(0, index),
                  key: '"' + val.slice(index + 1) + '"',
              };
          }
          else {
              return {
                  exp: val,
                  key: null,
              };
          }
      }
      str = val;
      index = expressionPos = expressionEndPos = 0;
      while (!eof()) {
          chr = next();
          /* istanbul ignore if */
          if (isStringStart(chr)) {
              parseString(chr);
          }
          else if (chr === 0x5b) {
              parseBracket(chr);
          }
      }
      return {
          exp: val.slice(0, expressionPos),
          key: val.slice(expressionPos + 1, expressionEndPos),
      };
  }
  function next() {
      return str.charCodeAt(++index);
  }
  function eof() {
      return index >= len;
  }
  function isStringStart(chr) {
      return chr === 0x22 || chr === 0x27;
  }
  function parseBracket(chr) {
      var inBracket = 1;
      expressionPos = index;
      while (!eof()) {
          chr = next();
          if (isStringStart(chr)) {
              parseString(chr);
              continue;
          }
          if (chr === 0x5b)
              { inBracket++; }
          if (chr === 0x5d)
              { inBracket--; }
          if (inBracket === 0) {
              expressionEndPos = index;
              break;
          }
      }
  }
  function parseString(chr) {
      var stringQuote = chr;
      while (!eof()) {
          chr = next();
          if (chr === stringQuote) {
              break;
          }
      }
  }

  var warn$1;
  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';
  function model$1(el, dir, _warn) {
      warn$1 = _warn;
      var value = dir.value;
      var modifiers = dir.modifiers;
      var tag = el.tag;
      var type = el.attrsMap.type;
      {
          // inputs with type="file" are read only and setting the input's
          // value will throw an error.
          if (tag === 'input' && type === 'file') {
              warn$1("<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
                  "File inputs are read only. Use a v-on:change listener instead.", el.rawAttrsMap['v-model']);
          }
      }
      if (el.component) {
          genComponentModel(el, value, modifiers);
          // component v-model doesn't need extra runtime
          return false;
      }
      else if (tag === 'select') {
          genSelect(el, value, modifiers);
      }
      else if (tag === 'input' && type === 'checkbox') {
          genCheckboxModel(el, value, modifiers);
      }
      else if (tag === 'input' && type === 'radio') {
          genRadioModel(el, value, modifiers);
      }
      else if (tag === 'input' || tag === 'textarea') {
          genDefaultModel(el, value, modifiers);
      }
      else if (!config.isReservedTag(tag)) {
          genComponentModel(el, value, modifiers);
          // component v-model doesn't need extra runtime
          return false;
      }
      else {
          warn$1("<" + (el.tag) + " v-model=\"" + value + "\">: " +
              "v-model is not supported on this element type. " +
              "If you are working with contenteditable, it's recommended to " +
              'wrap a library dedicated for that purpose inside a custom component.', el.rawAttrsMap['v-model']);
      }
      // ensure runtime directive metadata
      return true;
  }
  function genCheckboxModel(el, value, modifiers) {
      var number = modifiers && modifiers.number;
      var valueBinding = getBindingAttr(el, 'value') || 'null';
      var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
      var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
      addProp(el, 'checked', "Array.isArray(" + value + ")" +
          "?_i(" + value + "," + valueBinding + ")>-1" +
          (trueValueBinding === 'true'
              ? (":(" + value + ")")
              : (":_q(" + value + "," + trueValueBinding + ")")));
      addHandler(el, 'change', "var $$a=" + value + "," +
          '$$el=$event.target,' +
          "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
          'if(Array.isArray($$a)){' +
          "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
          "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
          "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
          "}else{" + (genAssignmentCode(value, '$$c')) + "}", null, true);
  }
  function genRadioModel(el, value, modifiers) {
      var number = modifiers && modifiers.number;
      var valueBinding = getBindingAttr(el, 'value') || 'null';
      valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
      addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
      addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
  }
  function genSelect(el, value, modifiers) {
      var number = modifiers && modifiers.number;
      var selectedVal = "Array.prototype.filter" +
          ".call($event.target.options,function(o){return o.selected})" +
          ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
          "return " + (number ? '_n(val)' : 'val') + "})";
      var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
      var code = "var $$selectedVal = " + selectedVal + ";";
      code = code + " " + (genAssignmentCode(value, assignment));
      addHandler(el, 'change', code, null, true);
  }
  function genDefaultModel(el, value, modifiers) {
      var type = el.attrsMap.type;
      // warn if v-bind:value conflicts with v-model
      // except for inputs with v-bind:type
      {
          var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
          var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
          if (value$1 && !typeBinding) {
              var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
              warn$1(binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
                  'because the latter already expands to a value binding internally', el.rawAttrsMap[binding]);
          }
      }
      var ref = modifiers || {};
      var lazy = ref.lazy;
      var number = ref.number;
      var trim = ref.trim;
      var needCompositionGuard = !lazy && type !== 'range';
      var event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';
      var valueExpression = '$event.target.value';
      if (trim) {
          valueExpression = "$event.target.value.trim()";
      }
      if (number) {
          valueExpression = "_n(" + valueExpression + ")";
      }
      var code = genAssignmentCode(value, valueExpression);
      if (needCompositionGuard) {
          code = "if($event.target.composing)return;" + code;
      }
      addProp(el, 'value', ("(" + value + ")"));
      addHandler(el, event, code, null, true);
      if (trim || number) {
          addHandler(el, 'blur', '$forceUpdate()');
      }
  }

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents(on) {
      /* istanbul ignore if */
      if (isDef(on[RANGE_TOKEN])) {
          // IE input[type=range] only supports `change` event
          var event = isIE ? 'change' : 'input';
          on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
          delete on[RANGE_TOKEN];
      }
      // This was originally intended to fix #4521 but no longer necessary
      // after 2.5. Keeping it for backwards compat with generated code from < 2.4
      /* istanbul ignore if */
      if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
          on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
          delete on[CHECKBOX_RADIO_TOKEN];
      }
  }
  var target;
  function createOnceHandler(event, handler, capture) {
      var _target = target; // save current target element in closure
      return function onceHandler() {
          var res = handler.apply(null, arguments);
          if (res !== null) {
              remove(event, onceHandler, capture, _target);
          }
      };
  }
  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);
  function add(name, handler, capture, passive) {
      // async edge case #6566: inner click event triggers patch, event handler
      // attached to outer element during patch, and triggered again. This
      // happens because browsers fire microtask ticks between event propagation.
      // the solution is simple: we save the timestamp when a handler is attached,
      // and the handler would only fire if the event passed to it was fired
      // AFTER it was attached.
      if (useMicrotaskFix) {
          var attachedTimestamp = currentFlushTimestamp;
          var original = handler;
          //@ts-expect-error
          handler = original._wrapper = function (e) {
              if (
              // no bubbling, should always fire.
              // this is just a safety net in case event.timeStamp is unreliable in
              // certain weird environments...
              e.target === e.currentTarget ||
                  // event is fired after handler attachment
                  e.timeStamp >= attachedTimestamp ||
                  // bail for environments that have buggy event.timeStamp implementations
                  // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
                  // #9681 QtWebEngine event.timeStamp is negative value
                  e.timeStamp <= 0 ||
                  // #9448 bail if event is fired in another document in a multi-page
                  // electron/nw.js app, since event.timeStamp will be using a different
                  // starting reference
                  e.target.ownerDocument !== document) {
                  return original.apply(this, arguments);
              }
          };
      }
      target.addEventListener(name, handler, supportsPassive ? { capture: capture, passive: passive } : capture);
  }
  function remove(name, handler, capture, _target) {
      (_target || target).removeEventListener(name, 
      //@ts-expect-error
      handler._wrapper || handler, capture);
  }
  function updateDOMListeners(oldVnode, vnode) {
      if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
          return;
      }
      var on = vnode.data.on || {};
      var oldOn = oldVnode.data.on || {};
      target = vnode.elm;
      normalizeEvents(on);
      updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context);
      target = undefined;
  }
  var events = {
      create: updateDOMListeners,
      update: updateDOMListeners,
  };

  var svgContainer;
  function updateDOMProps(oldVnode, vnode) {
      if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
          return;
      }
      var key, cur;
      var elm = vnode.elm;
      var oldProps = oldVnode.data.domProps || {};
      var props = vnode.data.domProps || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(props.__ob__)) {
          props = vnode.data.domProps = extend({}, props);
      }
      for (key in oldProps) {
          if (!(key in props)) {
              elm[key] = '';
          }
      }
      for (key in props) {
          cur = props[key];
          // ignore children if the node has textContent or innerHTML,
          // as these will throw away existing DOM nodes and cause removal errors
          // on subsequent patches (#3360)
          if (key === 'textContent' || key === 'innerHTML') {
              if (vnode.children)
                  { vnode.children.length = 0; }
              if (cur === oldProps[key])
                  { continue; }
              // #6601 work around Chrome version <= 55 bug where single textNode
              // replaced by innerHTML/textContent retains its parentNode property
              if (elm.childNodes.length === 1) {
                  elm.removeChild(elm.childNodes[0]);
              }
          }
          if (key === 'value' && elm.tagName !== 'PROGRESS') {
              // store value as _value as well since
              // non-string values will be stringified
              elm._value = cur;
              // avoid resetting cursor position when value is the same
              var strCur = isUndef(cur) ? '' : String(cur);
              if (shouldUpdateValue(elm, strCur)) {
                  elm.value = strCur;
              }
          }
          else if (key === 'innerHTML' &&
              isSVG(elm.tagName) &&
              isUndef(elm.innerHTML)) {
              // IE doesn't support innerHTML for SVG elements
              svgContainer = svgContainer || document.createElement('div');
              svgContainer.innerHTML = "<svg>" + cur + "</svg>";
              var svg = svgContainer.firstChild;
              while (elm.firstChild) {
                  elm.removeChild(elm.firstChild);
              }
              while (svg.firstChild) {
                  elm.appendChild(svg.firstChild);
              }
          }
          else if (
          // skip the update if old and new VDOM state is the same.
          // `value` is handled separately because the DOM value may be temporarily
          // out of sync with VDOM state due to focus, composition and modifiers.
          // This  #4521 by skipping the unnecessary `checked` update.
          cur !== oldProps[key]) {
              // some property updates can throw
              // e.g. `value` on <progress> w/ non-finite value
              try {
                  elm[key] = cur;
              }
              catch (e) { }
          }
      }
  }
  function shouldUpdateValue(elm, checkVal) {
      return (
      //@ts-expect-error
      !elm.composing &&
          (elm.tagName === 'OPTION' ||
              isNotInFocusAndDirty(elm, checkVal) ||
              isDirtyWithModifiers(elm, checkVal)));
  }
  function isNotInFocusAndDirty(elm, checkVal) {
      // return true when textbox (.number and .trim) loses focus and its value is
      // not equal to the updated value
      var notInFocus = true;
      // #6157
      // work around IE bug when accessing document.activeElement in an iframe
      try {
          notInFocus = document.activeElement !== elm;
      }
      catch (e) { }
      return notInFocus && elm.value !== checkVal;
  }
  function isDirtyWithModifiers(elm, newVal) {
      var value = elm.value;
      var modifiers = elm._vModifiers; // injected by v-model runtime
      if (isDef(modifiers)) {
          if (modifiers.number) {
              return toNumber(value) !== toNumber(newVal);
          }
          if (modifiers.trim) {
              return value.trim() !== newVal.trim();
          }
      }
      return value !== newVal;
  }
  var domProps = {
      create: updateDOMProps,
      update: updateDOMProps,
  };

  var parseStyleText = cached(function (cssText) {
      var res = {};
      var listDelimiter = /;(?![^(]*\))/g;
      var propertyDelimiter = /:(.+)/;
      cssText.split(listDelimiter).forEach(function (item) {
          if (item) {
              var tmp = item.split(propertyDelimiter);
              tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
          }
      });
      return res;
  });
  // merge static and dynamic style data on the same vnode
  function normalizeStyleData(data) {
      var style = normalizeStyleBinding(data.style);
      // static style is pre-processed into an object during compilation
      // and is always a fresh object, so it's safe to merge into it
      return data.staticStyle ? extend(data.staticStyle, style) : style;
  }
  // normalize possible array / string values into Object
  function normalizeStyleBinding(bindingStyle) {
      if (Array.isArray(bindingStyle)) {
          return toObject(bindingStyle);
      }
      if (typeof bindingStyle === 'string') {
          return parseStyleText(bindingStyle);
      }
      return bindingStyle;
  }
  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle(vnode, checkChild) {
      var res = {};
      var styleData;
      if (checkChild) {
          var childNode = vnode;
          while (childNode.componentInstance) {
              childNode = childNode.componentInstance._vnode;
              if (childNode &&
                  childNode.data &&
                  (styleData = normalizeStyleData(childNode.data))) {
                  extend(res, styleData);
              }
          }
      }
      if ((styleData = normalizeStyleData(vnode.data))) {
          extend(res, styleData);
      }
      var parentNode = vnode;
      while ((parentNode = parentNode.parent)) {
          if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
              extend(res, styleData);
          }
      }
      return res;
  }

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
      /* istanbul ignore if */
      if (cssVarRE.test(name)) {
          el.style.setProperty(name, val);
      }
      else if (importantRE.test(val)) {
          el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
      }
      else {
          var normalizedName = normalize(name);
          if (Array.isArray(val)) {
              // Support values array created by autoprefixer, e.g.
              // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
              // Set them one by one, and the browser will only set those it can recognize
              for (var i = 0, len = val.length; i < len; i++) {
                  el.style[normalizedName] = val[i];
              }
          }
          else {
              el.style[normalizedName] = val;
          }
      }
  };
  var vendorNames = ['Webkit', 'Moz', 'ms'];
  var emptyStyle;
  var normalize = cached(function (prop) {
      emptyStyle = emptyStyle || document.createElement('div').style;
      prop = camelize(prop);
      if (prop !== 'filter' && prop in emptyStyle) {
          return prop;
      }
      var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
      for (var i = 0; i < vendorNames.length; i++) {
          var name = vendorNames[i] + capName;
          if (name in emptyStyle) {
              return name;
          }
      }
  });
  function updateStyle(oldVnode, vnode) {
      var data = vnode.data;
      var oldData = oldVnode.data;
      if (isUndef(data.staticStyle) &&
          isUndef(data.style) &&
          isUndef(oldData.staticStyle) &&
          isUndef(oldData.style)) {
          return;
      }
      var cur, name;
      var el = vnode.elm;
      var oldStaticStyle = oldData.staticStyle;
      var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};
      // if static style exists, stylebinding already merged into it when doing normalizeStyleData
      var oldStyle = oldStaticStyle || oldStyleBinding;
      var style = normalizeStyleBinding(vnode.data.style) || {};
      // store normalized style under a different key for next diff
      // make sure to clone it if it's reactive, since the user likely wants
      // to mutate it.
      vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;
      var newStyle = getStyle(vnode, true);
      for (name in oldStyle) {
          if (isUndef(newStyle[name])) {
              setProp(el, name, '');
          }
      }
      for (name in newStyle) {
          cur = newStyle[name];
          if (cur !== oldStyle[name]) {
              // ie9 setting to null has no effect, must use empty string
              setProp(el, name, cur == null ? '' : cur);
          }
      }
  }
  var style$1 = {
      create: updateStyle,
      update: updateStyle,
  };

  var whitespaceRE$1 = /\s+/;
  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass(el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
          return;
      }
      /* istanbul ignore else */
      if (el.classList) {
          if (cls.indexOf(' ') > -1) {
              cls.split(whitespaceRE$1).forEach(function (c) { return el.classList.add(c); });
          }
          else {
              el.classList.add(cls);
          }
      }
      else {
          var cur = " " + (el.getAttribute('class') || '') + " ";
          if (cur.indexOf(' ' + cls + ' ') < 0) {
              el.setAttribute('class', (cur + cls).trim());
          }
      }
  }
  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass(el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
          return;
      }
      /* istanbul ignore else */
      if (el.classList) {
          if (cls.indexOf(' ') > -1) {
              cls.split(whitespaceRE$1).forEach(function (c) { return el.classList.remove(c); });
          }
          else {
              el.classList.remove(cls);
          }
          if (!el.classList.length) {
              el.removeAttribute('class');
          }
      }
      else {
          var cur = " " + (el.getAttribute('class') || '') + " ";
          var tar = ' ' + cls + ' ';
          while (cur.indexOf(tar) >= 0) {
              cur = cur.replace(tar, ' ');
          }
          cur = cur.trim();
          if (cur) {
              el.setAttribute('class', cur);
          }
          else {
              el.removeAttribute('class');
          }
      }
  }

  function resolveTransition(def) {
      if (!def) {
          return;
      }
      /* istanbul ignore else */
      if (typeof def === 'object') {
          var res = {};
          if (def.css !== false) {
              extend(res, autoCssTransition(def.name || 'v'));
          }
          extend(res, def);
          return res;
      }
      else if (typeof def === 'string') {
          return autoCssTransition(def);
      }
  }
  var autoCssTransition = cached(function (name) {
      return {
          enterClass: (name + "-enter"),
          enterToClass: (name + "-enter-to"),
          enterActiveClass: (name + "-enter-active"),
          leaveClass: (name + "-leave"),
          leaveToClass: (name + "-leave-to"),
          leaveActiveClass: (name + "-leave-active"),
      };
  });
  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';
  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
      /* istanbul ignore if */
      if (window.ontransitionend === undefined &&
          // @ts-expect-error
          window.onwebkittransitionend !== undefined) {
          transitionProp = 'WebkitTransition';
          transitionEndEvent = 'webkitTransitionEnd';
      }
      if (window.onanimationend === undefined &&
          // @ts-expect-error
          window.onwebkitanimationend !== undefined) {
          animationProp = 'WebkitAnimation';
          animationEndEvent = 'webkitAnimationEnd';
      }
  }
  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
      ? window.requestAnimationFrame
          ? window.requestAnimationFrame.bind(window)
          : setTimeout
      : /* istanbul ignore next */ function (fn) { return fn(); };
  function nextFrame(fn) {
      raf(function () {
          // @ts-expect-error
          raf(fn);
      });
  }
  function addTransitionClass(el, cls) {
      var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
      if (transitionClasses.indexOf(cls) < 0) {
          transitionClasses.push(cls);
          addClass(el, cls);
      }
  }
  function removeTransitionClass(el, cls) {
      if (el._transitionClasses) {
          remove$2(el._transitionClasses, cls);
      }
      removeClass(el, cls);
  }
  function whenTransitionEnds(el, expectedType, cb) {
      var ref = getTransitionInfo(el, expectedType);
      var type = ref.type;
      var timeout = ref.timeout;
      var propCount = ref.propCount;
      if (!type)
          { return cb(); }
      var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
      var ended = 0;
      var end = function () {
          el.removeEventListener(event, onEnd);
          cb();
      };
      var onEnd = function (e) {
          if (e.target === el) {
              if (++ended >= propCount) {
                  end();
              }
          }
      };
      setTimeout(function () {
          if (ended < propCount) {
              end();
          }
      }, timeout + 1);
      el.addEventListener(event, onEnd);
  }
  var transformRE = /\b(transform|all)(,|$)/;
  function getTransitionInfo(el, expectedType) {
      var styles = window.getComputedStyle(el);
      // JSDOM may return undefined for transition properties
      var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
      var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
      var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
      var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
      var animationTimeout = getTimeout(animationDelays, animationDurations);
      var type;
      var timeout = 0;
      var propCount = 0;
      /* istanbul ignore if */
      if (expectedType === TRANSITION) {
          if (transitionTimeout > 0) {
              type = TRANSITION;
              timeout = transitionTimeout;
              propCount = transitionDurations.length;
          }
      }
      else if (expectedType === ANIMATION) {
          if (animationTimeout > 0) {
              type = ANIMATION;
              timeout = animationTimeout;
              propCount = animationDurations.length;
          }
      }
      else {
          timeout = Math.max(transitionTimeout, animationTimeout);
          type =
              timeout > 0
                  ? transitionTimeout > animationTimeout
                      ? TRANSITION
                      : ANIMATION
                  : null;
          propCount = type
              ? type === TRANSITION
                  ? transitionDurations.length
                  : animationDurations.length
              : 0;
      }
      var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
      return {
          type: type,
          timeout: timeout,
          propCount: propCount,
          hasTransform: hasTransform,
      };
  }
  function getTimeout(delays, durations) {
      /* istanbul ignore next */
      while (delays.length < durations.length) {
          delays = delays.concat(delays);
      }
      return Math.max.apply(null, durations.map(function (d, i) {
          return toMs(d) + toMs(delays[i]);
      }));
  }
  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs(s) {
      return Number(s.slice(0, -1).replace(',', '.')) * 1000;
  }

  function enter(vnode, toggleDisplay) {
      var el = vnode.elm;
      // call leave callback now
      if (isDef(el._leaveCb)) {
          el._leaveCb.cancelled = true;
          el._leaveCb();
      }
      var data = resolveTransition(vnode.data.transition);
      if (isUndef(data)) {
          return;
      }
      /* istanbul ignore if */
      if (isDef(el._enterCb) || el.nodeType !== 1) {
          return;
      }
      var css = data.css;
      var type = data.type;
      var enterClass = data.enterClass;
      var enterToClass = data.enterToClass;
      var enterActiveClass = data.enterActiveClass;
      var appearClass = data.appearClass;
      var appearToClass = data.appearToClass;
      var appearActiveClass = data.appearActiveClass;
      var beforeEnter = data.beforeEnter;
      var enter = data.enter;
      var afterEnter = data.afterEnter;
      var enterCancelled = data.enterCancelled;
      var beforeAppear = data.beforeAppear;
      var appear = data.appear;
      var afterAppear = data.afterAppear;
      var appearCancelled = data.appearCancelled;
      var duration = data.duration;
      // activeInstance will always be the <transition> component managing this
      // transition. One edge case to check is when the <transition> is placed
      // as the root node of a child component. In that case we need to check
      // <transition>'s parent for appear check.
      var context = activeInstance;
      var transitionNode = activeInstance.$vnode;
      while (transitionNode && transitionNode.parent) {
          context = transitionNode.context;
          transitionNode = transitionNode.parent;
      }
      var isAppear = !context._isMounted || !vnode.isRootInsert;
      if (isAppear && !appear && appear !== '') {
          return;
      }
      var startClass = isAppear && appearClass ? appearClass : enterClass;
      var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
      var toClass = isAppear && appearToClass ? appearToClass : enterToClass;
      var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
      var enterHook = isAppear
          ? typeof appear === 'function'
              ? appear
              : enter
          : enter;
      var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
      var enterCancelledHook = isAppear
          ? appearCancelled || enterCancelled
          : enterCancelled;
      var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);
      if (explicitEnterDuration != null) {
          checkDuration(explicitEnterDuration, 'enter', vnode);
      }
      var expectsCSS = css !== false && !isIE9;
      var userWantsControl = getHookArgumentsLength(enterHook);
      var cb = (el._enterCb = once(function () {
          if (expectsCSS) {
              removeTransitionClass(el, toClass);
              removeTransitionClass(el, activeClass);
          }
          // @ts-expect-error
          if (cb.cancelled) {
              if (expectsCSS) {
                  removeTransitionClass(el, startClass);
              }
              enterCancelledHook && enterCancelledHook(el);
          }
          else {
              afterEnterHook && afterEnterHook(el);
          }
          el._enterCb = null;
      }));
      if (!vnode.data.show) {
          // remove pending leave element on enter by injecting an insert hook
          mergeVNodeHook(vnode, 'insert', function () {
              var parent = el.parentNode;
              var pendingNode = parent && parent._pending && parent._pending[vnode.key];
              if (pendingNode &&
                  pendingNode.tag === vnode.tag &&
                  pendingNode.elm._leaveCb) {
                  pendingNode.elm._leaveCb();
              }
              enterHook && enterHook(el, cb);
          });
      }
      // start enter transition
      beforeEnterHook && beforeEnterHook(el);
      if (expectsCSS) {
          addTransitionClass(el, startClass);
          addTransitionClass(el, activeClass);
          nextFrame(function () {
              removeTransitionClass(el, startClass);
              // @ts-expect-error
              if (!cb.cancelled) {
                  addTransitionClass(el, toClass);
                  if (!userWantsControl) {
                      if (isValidDuration(explicitEnterDuration)) {
                          setTimeout(cb, explicitEnterDuration);
                      }
                      else {
                          whenTransitionEnds(el, type, cb);
                      }
                  }
              }
          });
      }
      if (vnode.data.show) {
          toggleDisplay && toggleDisplay();
          enterHook && enterHook(el, cb);
      }
      if (!expectsCSS && !userWantsControl) {
          cb();
      }
  }
  function leave(vnode, rm) {
      var el = vnode.elm;
      // call enter callback now
      if (isDef(el._enterCb)) {
          el._enterCb.cancelled = true;
          el._enterCb();
      }
      var data = resolveTransition(vnode.data.transition);
      if (isUndef(data) || el.nodeType !== 1) {
          return rm();
      }
      /* istanbul ignore if */
      if (isDef(el._leaveCb)) {
          return;
      }
      var css = data.css;
      var type = data.type;
      var leaveClass = data.leaveClass;
      var leaveToClass = data.leaveToClass;
      var leaveActiveClass = data.leaveActiveClass;
      var beforeLeave = data.beforeLeave;
      var leave = data.leave;
      var afterLeave = data.afterLeave;
      var leaveCancelled = data.leaveCancelled;
      var delayLeave = data.delayLeave;
      var duration = data.duration;
      var expectsCSS = css !== false && !isIE9;
      var userWantsControl = getHookArgumentsLength(leave);
      var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);
      if (isDef(explicitLeaveDuration)) {
          checkDuration(explicitLeaveDuration, 'leave', vnode);
      }
      var cb = (el._leaveCb = once(function () {
          if (el.parentNode && el.parentNode._pending) {
              el.parentNode._pending[vnode.key] = null;
          }
          if (expectsCSS) {
              removeTransitionClass(el, leaveToClass);
              removeTransitionClass(el, leaveActiveClass);
          }
          // @ts-expect-error
          if (cb.cancelled) {
              if (expectsCSS) {
                  removeTransitionClass(el, leaveClass);
              }
              leaveCancelled && leaveCancelled(el);
          }
          else {
              rm();
              afterLeave && afterLeave(el);
          }
          el._leaveCb = null;
      }));
      if (delayLeave) {
          delayLeave(performLeave);
      }
      else {
          performLeave();
      }
      function performLeave() {
          // the delayed leave may have already been cancelled
          // @ts-expect-error
          if (cb.cancelled) {
              return;
          }
          // record leaving element
          if (!vnode.data.show && el.parentNode) {
              (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
          }
          beforeLeave && beforeLeave(el);
          if (expectsCSS) {
              addTransitionClass(el, leaveClass);
              addTransitionClass(el, leaveActiveClass);
              nextFrame(function () {
                  removeTransitionClass(el, leaveClass);
                  // @ts-expect-error
                  if (!cb.cancelled) {
                      addTransitionClass(el, leaveToClass);
                      if (!userWantsControl) {
                          if (isValidDuration(explicitLeaveDuration)) {
                              setTimeout(cb, explicitLeaveDuration);
                          }
                          else {
                              whenTransitionEnds(el, type, cb);
                          }
                      }
                  }
              });
          }
          leave && leave(el, cb);
          if (!expectsCSS && !userWantsControl) {
              cb();
          }
      }
  }
  // only used in dev mode
  function checkDuration(val, name, vnode) {
      if (typeof val !== 'number') {
          warn$2("<transition> explicit " + name + " duration is not a valid number - " +
              "got " + (JSON.stringify(val)) + ".", vnode.context);
      }
      else if (isNaN(val)) {
          warn$2("<transition> explicit " + name + " duration is NaN - " +
              'the duration expression might be incorrect.', vnode.context);
      }
  }
  function isValidDuration(val) {
      return typeof val === 'number' && !isNaN(val);
  }
  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength(fn) {
      if (isUndef(fn)) {
          return false;
      }
      // @ts-expect-error
      var invokerFns = fn.fns;
      if (isDef(invokerFns)) {
          // invoker
          return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
      }
      else {
          // @ts-expect-error
          return (fn._length || fn.length) > 1;
      }
  }
  function _enter(_, vnode) {
      if (vnode.data.show !== true) {
          enter(vnode);
      }
  }
  var transition = inBrowser
      ? {
          create: _enter,
          activate: _enter,
          remove: function remove(vnode, rm) {
              /* istanbul ignore else */
              if (vnode.data.show !== true) {
                  // @ts-expect-error
                  leave(vnode, rm);
              }
              else {
                  rm();
              }
          },
      }
      : {};

  var platformModules = [attrs, klass$1, events, domProps, style$1, transition];

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules$1 = platformModules.concat(baseModules);
  // nodeOps是关于dom节点的各种操作函数
  // modules是各种指令模块导出的以生命周期命名的函数
  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules$1 });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */
  /* istanbul ignore if */
  if (isIE9) {
      // http://www.matts411.com/post/internet-explorer-9-oninput/
      document.addEventListener('selectionchange', function () {
          var el = document.activeElement;
          // @ts-expect-error
          if (el && el.vmodel) {
              trigger(el, 'input');
          }
      });
  }
  var directive = {
      inserted: function inserted(el, binding, vnode, oldVnode) {
          if (vnode.tag === 'select') {
              // #6903
              if (oldVnode.elm && !oldVnode.elm._vOptions) {
                  mergeVNodeHook(vnode, 'postpatch', function () {
                      directive.componentUpdated(el, binding, vnode);
                  });
              }
              else {
                  setSelected(el, binding, vnode.context);
              }
              el._vOptions = [].map.call(el.options, getValue);
          }
          else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
              el._vModifiers = binding.modifiers;
              if (!binding.modifiers.lazy) {
                  el.addEventListener('compositionstart', onCompositionStart);
                  el.addEventListener('compositionend', onCompositionEnd);
                  // Safari < 10.2 & UIWebView doesn't fire compositionend when
                  // switching focus before confirming composition choice
                  // this also fixes the issue where some browsers e.g. iOS Chrome
                  // fires "change" instead of "input" on autocomplete.
                  el.addEventListener('change', onCompositionEnd);
                  /* istanbul ignore if */
                  if (isIE9) {
                      el.vmodel = true;
                  }
              }
          }
      },
      componentUpdated: function componentUpdated(el, binding, vnode) {
          if (vnode.tag === 'select') {
              setSelected(el, binding, vnode.context);
              // in case the options rendered by v-for have changed,
              // it's possible that the value is out-of-sync with the rendered options.
              // detect such cases and filter out values that no longer has a matching
              // option in the DOM.
              var prevOptions = el._vOptions;
              var curOptions = (el._vOptions = [].map.call(el.options, getValue));
              if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
                  // trigger change event if
                  // no matching option found for at least one value
                  var needReset = el.multiple
                      ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
                      : binding.value !== binding.oldValue &&
                          hasNoMatchingOption(binding.value, curOptions);
                  if (needReset) {
                      trigger(el, 'change');
                  }
              }
          }
      },
  };
  function setSelected(el, binding, vm) {
      actuallySetSelected(el, binding, vm);
      /* istanbul ignore if */
      if (isIE || isEdge) {
          setTimeout(function () {
              actuallySetSelected(el, binding, vm);
          }, 0);
      }
  }
  function actuallySetSelected(el, binding, vm) {
      var value = binding.value;
      var isMultiple = el.multiple;
      if (isMultiple && !Array.isArray(value)) {
          warn$2("<select multiple v-model=\"" + (binding.expression) + "\"> " +
                  "expects an Array value for its binding, but got " + (Object.prototype.toString
                      .call(value)
                      .slice(8, -1)), vm);
          return;
      }
      var selected, option;
      for (var i = 0, l = el.options.length; i < l; i++) {
          option = el.options[i];
          if (isMultiple) {
              selected = looseIndexOf(value, getValue(option)) > -1;
              if (option.selected !== selected) {
                  option.selected = selected;
              }
          }
          else {
              if (looseEqual(getValue(option), value)) {
                  if (el.selectedIndex !== i) {
                      el.selectedIndex = i;
                  }
                  return;
              }
          }
      }
      if (!isMultiple) {
          el.selectedIndex = -1;
      }
  }
  function hasNoMatchingOption(value, options) {
      return options.every(function (o) { return !looseEqual(o, value); });
  }
  function getValue(option) {
      return '_value' in option ? option._value : option.value;
  }
  function onCompositionStart(e) {
      e.target.composing = true;
  }
  function onCompositionEnd(e) {
      // prevent triggering an input event for no reason
      if (!e.target.composing)
          { return; }
      e.target.composing = false;
      trigger(e.target, 'input');
  }
  function trigger(el, type) {
      var e = document.createEvent('HTMLEvents');
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
  }

  // recursively search for possible transition defined inside the component root
  function locateNode(vnode) {
      // @ts-expect-error
      return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
          ? locateNode(vnode.componentInstance._vnode)
          : vnode;
  }
  var show = {
      bind: function bind(el, ref, vnode) {
          var value = ref.value;

          vnode = locateNode(vnode);
          var transition = vnode.data && vnode.data.transition;
          var originalDisplay = (el.__vOriginalDisplay =
              el.style.display === 'none' ? '' : el.style.display);
          if (value && transition) {
              vnode.data.show = true;
              enter(vnode, function () {
                  el.style.display = originalDisplay;
              });
          }
          else {
              el.style.display = value ? originalDisplay : 'none';
          }
      },
      update: function update(el, ref, vnode) {
          var value = ref.value;
          var oldValue = ref.oldValue;

          /* istanbul ignore if */
          if (!value === !oldValue)
              { return; }
          vnode = locateNode(vnode);
          var transition = vnode.data && vnode.data.transition;
          if (transition) {
              vnode.data.show = true;
              if (value) {
                  enter(vnode, function () {
                      el.style.display = el.__vOriginalDisplay;
                  });
              }
              else {
                  leave(vnode, function () {
                      el.style.display = 'none';
                  });
              }
          }
          else {
              el.style.display = value ? el.__vOriginalDisplay : 'none';
          }
      },
      unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
          if (!isDestroy) {
              el.style.display = el.__vOriginalDisplay;
          }
      },
  };

  var platformDirectives = {
      model: directive,
      show: show,
  };

  // Provides transition support for a single element/component.
  var transitionProps = {
      name: String,
      appear: Boolean,
      css: Boolean,
      mode: String,
      type: String,
      enterClass: String,
      leaveClass: String,
      enterToClass: String,
      leaveToClass: String,
      enterActiveClass: String,
      leaveActiveClass: String,
      appearClass: String,
      appearActiveClass: String,
      appearToClass: String,
      duration: [Number, String, Object],
  };
  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild(vnode) {
      var compOptions = vnode && vnode.componentOptions;
      if (compOptions && compOptions.Ctor.options.abstract) {
          return getRealChild(getFirstComponentChild(compOptions.children));
      }
      else {
          return vnode;
      }
  }
  function extractTransitionData(comp) {
      var data = {};
      var options = comp.$options;
      // props
      for (var key in options.propsData) {
          data[key] = comp[key];
      }
      // events.
      // extract listeners and pass them directly to the transition methods
      var listeners = options._parentListeners;
      for (var key$1 in listeners) {
          data[camelize(key$1)] = listeners[key$1];
      }
      return data;
  }
  function placeholder(h, rawChild) {
      // @ts-expect-error
      if (/\d-keep-alive$/.test(rawChild.tag)) {
          return h('keep-alive', {
              props: rawChild.componentOptions.propsData,
          });
      }
  }
  function hasParentTransition(vnode) {
      while ((vnode = vnode.parent)) {
          if (vnode.data.transition) {
              return true;
          }
      }
  }
  function isSameChild(child, oldChild) {
      return oldChild.key === child.key && oldChild.tag === child.tag;
  }
  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };
  var isVShowDirective = function (d) { return d.name === 'show'; };
  var Transition = {
      name: 'transition',
      props: transitionProps,
      abstract: true,
      render: function render(h) {
          var this$1 = this;

          var children = this.$slots.default;
          if (!children) {
              return;
          }
          // filter out text nodes (possible whitespaces)
          children = children.filter(isNotTextNode);
          /* istanbul ignore if */
          if (!children.length) {
              return;
          }
          // warn multiple elements
          if (children.length > 1) {
              warn$2('<transition> can only be used on a single element. Use ' +
                  '<transition-group> for lists.', this.$parent);
          }
          var mode = this.mode;
          // warn invalid mode
          if (mode &&
              mode !== 'in-out' &&
              mode !== 'out-in') {
              warn$2('invalid <transition> mode: ' + mode, this.$parent);
          }
          var rawChild = children[0];
          // if this is a component root node and the component's
          // parent container node also has transition, skip.
          if (hasParentTransition(this.$vnode)) {
              return rawChild;
          }
          // apply transition data to child
          // use getRealChild() to ignore abstract components e.g. keep-alive
          var child = getRealChild(rawChild);
          /* istanbul ignore if */
          if (!child) {
              return rawChild;
          }
          if (this._leaving) {
              return placeholder(h, rawChild);
          }
          // ensure a key that is unique to the vnode type and to this transition
          // component instance. This key will be used to remove pending leaving nodes
          // during entering.
          var id = "__transition-" + (this._uid) + "-";
          child.key =
              child.key == null
                  ? child.isComment
                      ? id + 'comment'
                      : id + child.tag
                  : isPrimitive(child.key)
                      ? String(child.key).indexOf(id) === 0
                          ? child.key
                          : id + child.key
                      : child.key;
          var data = ((child.data || (child.data = {})).transition = extractTransitionData(this));
          var oldRawChild = this._vnode;
          var oldChild = getRealChild(oldRawChild);
          // mark v-show
          // so that the transition module can hand over the control to the directive
          if (child.data.directives && child.data.directives.some(isVShowDirective)) {
              child.data.show = true;
          }
          if (oldChild &&
              oldChild.data &&
              !isSameChild(child, oldChild) &&
              !isAsyncPlaceholder(oldChild) &&
              // #6687 component root is a comment node
              !(oldChild.componentInstance &&
                  oldChild.componentInstance._vnode.isComment)) {
              // replace old child transition data with fresh one
              // important for dynamic transitions!
              var oldData = (oldChild.data.transition = extend({}, data));
              // handle transition mode
              if (mode === 'out-in') {
                  // return placeholder node and queue update when leave finishes
                  this._leaving = true;
                  mergeVNodeHook(oldData, 'afterLeave', function () {
                      this$1._leaving = false;
                      this$1.$forceUpdate();
                  });
                  return placeholder(h, rawChild);
              }
              else if (mode === 'in-out') {
                  if (isAsyncPlaceholder(child)) {
                      return oldRawChild;
                  }
                  var delayedLeave;
                  var performLeave = function () {
                      delayedLeave();
                  };
                  mergeVNodeHook(data, 'afterEnter', performLeave);
                  mergeVNodeHook(data, 'enterCancelled', performLeave);
                  mergeVNodeHook(oldData, 'delayLeave', function (leave) {
                      delayedLeave = leave;
                  });
              }
          }
          return rawChild;
      },
  };

  // Provides transition support for list items.
  var props = extend({
      tag: String,
      moveClass: String,
  }, transitionProps);
  delete props.mode;
  var TransitionGroup = {
      props: props,
      beforeMount: function beforeMount() {
          var this$1 = this;

          var update = this._update;
          this._update = function (vnode, hydrating) {
              var restoreActiveInstance = setActiveInstance(this$1);
              // force removing pass
              this$1.__patch__(this$1._vnode, this$1.kept, false, // hydrating
              true // removeOnly (!important, avoids unnecessary moves)
              );
              this$1._vnode = this$1.kept;
              restoreActiveInstance();
              update.call(this$1, vnode, hydrating);
          };
      },
      render: function render(h) {
          var tag = this.tag || this.$vnode.data.tag || "span";
          var map = Object.create(null);
          var prevChildren = (this.prevChildren = this.children);
          var rawChildren = this.$slots.default || [];
          var children = (this.children = []);
          var transitionData = extractTransitionData(this);
          for (var i = 0; i < rawChildren.length; i++) {
              var c = rawChildren[i];
              if (c.tag) {
                  if (c.key != null && String(c.key).indexOf("__vlist") !== 0) {
                      children.push(c);
                      map[c.key] = c;
                      (c.data || (c.data = {})).transition = transitionData;
                  }
                  else {
                      var opts = c.componentOptions;
                      var name = opts
                          ? opts.Ctor.options.name || opts.tag || ""
                          : c.tag;
                      warn$2(("<transition-group> children must be keyed: <" + name + ">"));
                  }
              }
          }
          if (prevChildren) {
              var kept = [];
              var removed = [];
              for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
                  var c$1 = prevChildren[i$1];
                  c$1.data.transition = transitionData;
                  // @ts-expect-error .getBoundingClientRect is not typed in Node
                  c$1.data.pos = c$1.elm.getBoundingClientRect();
                  if (map[c$1.key]) {
                      kept.push(c$1);
                  }
                  else {
                      removed.push(c$1);
                  }
              }
              this.kept = h(tag, null, kept);
              this.removed = removed;
          }
          return h(tag, null, children);
      },
      updated: function updated() {
          var children = this.prevChildren;
          var moveClass = this.moveClass || (this.name || "v") + "-move";
          if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
              return;
          }
          // we divide the work into three loops to avoid mixing DOM reads and writes
          // in each iteration - which helps prevent layout thrashing.
          children.forEach(callPendingCbs);
          children.forEach(recordPosition);
          children.forEach(applyTranslation);
          // force reflow to put everything in position
          // assign to this to avoid being removed in tree-shaking
          // $flow-disable-line
          this._reflow = document.body.offsetHeight;
          children.forEach(function (c) {
              if (c.data.moved) {
                  var el = c.elm;
                  var s = el.style;
                  addTransitionClass(el, moveClass);
                  s.transform = s.WebkitTransform = s.transitionDuration = "";
                  el.addEventListener(transitionEndEvent, (el._moveCb = function cb(e) {
                      if (e && e.target !== el) {
                          return;
                      }
                      if (!e || /transform$/.test(e.propertyName)) {
                          el.removeEventListener(transitionEndEvent, cb);
                          el._moveCb = null;
                          removeTransitionClass(el, moveClass);
                      }
                  }));
              }
          });
      },
      methods: {
          hasMove: function hasMove(el, moveClass) {
              /* istanbul ignore if */
              if (!hasTransition) {
                  return false;
              }
              /* istanbul ignore if */
              if (this._hasMove) {
                  return this._hasMove;
              }
              // Detect whether an element with the move class applied has
              // CSS transitions. Since the element may be inside an entering
              // transition at this very moment, we make a clone of it and remove
              // all other transition classes applied to ensure only the move class
              // is applied.
              var clone = el.cloneNode();
              if (el._transitionClasses) {
                  el._transitionClasses.forEach(function (cls) {
                      removeClass(clone, cls);
                  });
              }
              addClass(clone, moveClass);
              clone.style.display = "none";
              this.$el.appendChild(clone);
              var info = getTransitionInfo(clone);
              this.$el.removeChild(clone);
              return (this._hasMove = info.hasTransform);
          },
      },
  };
  function callPendingCbs(c) {
      /* istanbul ignore if */
      if (c.elm._moveCb) {
          c.elm._moveCb();
      }
      /* istanbul ignore if */
      if (c.elm._enterCb) {
          c.elm._enterCb();
      }
  }
  function recordPosition(c) {
      c.data.newPos = c.elm.getBoundingClientRect();
  }
  function applyTranslation(c) {
      var oldPos = c.data.pos;
      var newPos = c.data.newPos;
      var dx = oldPos.left - newPos.left;
      var dy = oldPos.top - newPos.top;
      if (dx || dy) {
          c.data.moved = true;
          var s = c.elm.style;
          s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
          s.transitionDuration = "0s";
      }
  }

  var platformComponents = {
      Transition: Transition,
      TransitionGroup: TransitionGroup,
  };

  // 加载web平台特殊工具函数
  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp; // 检查是否使用了恰当的标签和属性 比如如果传了checked属性就一定得是input标签
  Vue.config.isReservedTag = isReservedTag; // 检查是否是保留标签
  Vue.config.isReservedAttr = isReservedAttr; // 检查是否是保留属性
  Vue.config.getTagNamespace = getTagNamespace; // 检查标签的命名空间 目前只能查询svg和math标签的命名空间
  Vue.config.isUnknownElement = isUnknownElement; // 检查是否是未知的标签
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
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);
  // 装载平台的核心函数 patch函数
  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;
  // public mount method
  // 公共mount方法
  Vue.prototype.$mount = function (el, hydrating) {
      // 如果是浏览器环境就去selectElement
      el = el && inBrowser ? query(el) : undefined;
      // 直接调用mount
      return mountComponent(this, el, hydrating);
  };
  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
      setTimeout(function () {
          if (config.devtools) {
              if (devtools) {
                  devtools.emit('init', Vue);
              }
              else {
                  // @ts-expect-error
                  console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' +
                      'https://github.com/vuejs/vue-devtools');
              }
          }
          if (config.productionTip !== false &&
              typeof console !== 'undefined') {
              // @ts-expect-error
              console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" +
                  "Make sure to turn on production mode when deploying for production.\n" +
                  "See more tips at https://vuejs.org/guide/deployment.html");
          }
      }, 0);
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
  var buildRegex = cached(function (delimiters) {
      var open = delimiters[0].replace(regexEscapeRE, '\\$&');
      var close = delimiters[1].replace(regexEscapeRE, '\\$&');
      return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
  });
  function parseText(text, delimiters) {
      //@ts-expect-error
      var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
      if (!tagRE.test(text)) {
          return;
      }
      var tokens = [];
      var rawTokens = [];
      var lastIndex = (tagRE.lastIndex = 0);
      var match, index, tokenValue;
      while ((match = tagRE.exec(text))) {
          index = match.index;
          // push text token
          if (index > lastIndex) {
              rawTokens.push((tokenValue = text.slice(lastIndex, index)));
              tokens.push(JSON.stringify(tokenValue));
          }
          // tag token
          var exp = parseFilters(match[1].trim());
          tokens.push(("_s(" + exp + ")"));
          rawTokens.push({ '@binding': exp });
          lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
          rawTokens.push((tokenValue = text.slice(lastIndex)));
          tokens.push(JSON.stringify(tokenValue));
      }
      return {
          expression: tokens.join('+'),
          tokens: rawTokens,
      };
  }

  /**
   * 处理class和:class
   *
   * @date 05/05/2021
   * @param {ASTElement} el
   * @param {CompilerOptions} options
   */
  function transformNode$1(el, options) {
      var warn = options.warn || baseWarn;
      var staticClass = getAndRemoveAttr(el, 'class');
      if (staticClass) {
          var res = parseText(staticClass, options.delimiters);
          if (res) {
              warn("class=\"" + staticClass + "\": " +
                  'Interpolation inside attributes has been removed. ' +
                  'Use v-bind or the colon shorthand instead. For example, ' +
                  'instead of <div class="{{ val }}">, use <div :class="val">.', el.rawAttrsMap['class']);
          }
      }
      if (staticClass) {
          el.staticClass = JSON.stringify(staticClass);
      }
      var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
      if (classBinding) {
          el.classBinding = classBinding;
      }
  }
  function genData$2(el) {
      var data = '';
      if (el.staticClass) {
          data += "staticClass:" + (el.staticClass) + ",";
      }
      if (el.classBinding) {
          data += "class:" + (el.classBinding) + ",";
      }
      return data;
  }
  var klass = {
      staticKeys: ['staticClass'],
      transformNode: transformNode$1,
      genData: genData$2,
  };

  /**
   * 处理style和:style
   *
   * @date 05/05/2021
   * @param {ASTElement} el
   * @param {CompilerOptions} options
   */
  function transformNode(el, options) {
      var warn = options.warn || baseWarn;
      var staticStyle = getAndRemoveAttr(el, 'style');
      if (staticStyle) {
          /* istanbul ignore if */
          {
              var res = parseText(staticStyle, options.delimiters);
              if (res) {
                  warn("style=\"" + staticStyle + "\": " +
                      'Interpolation inside attributes has been removed. ' +
                      'Use v-bind or the colon shorthand instead. For example, ' +
                      'instead of <div style="{{ val }}">, use <div :style="val">.', el.rawAttrsMap['style']);
              }
          }
          el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
      }
      var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
      if (styleBinding) {
          el.styleBinding = styleBinding;
      }
  }
  function genData$1(el) {
      var data = '';
      if (el.staticStyle) {
          data += "staticStyle:" + (el.staticStyle) + ",";
      }
      if (el.styleBinding) {
          data += "style:(" + (el.styleBinding) + "),";
      }
      return data;
  }
  var style = {
      staticKeys: ['staticStyle'],
      transformNode: transformNode,
      genData: genData$1,
  };

  var decoder;
  var he = {
      decode: function decode(html) {
          decoder = decoder || document.createElement('div');
          decoder.innerHTML = html;
          return decoder.textContent;
      },
  };

  var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
      'link,meta,param,source,track,wbr');
  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');
  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
      'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
      'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
      'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
      'title,tr,track');

  /**
   * Not type-checking this file because it's mostly vendor code.
   */
  // Regular Expressions for parsing tags and attributes
  // 对于双引号情况
  // [
  //   'class="some-class"',
  //   'class',
  //   '=',
  //   'some-class',
  //   undefined,
  //   undefined
  // ]
  // 对于单引号的情况
  // [
  //   "class='some-class'",
  //   'class',
  //   '=',
  //   undefined,
  //   'some-class',
  //   undefined
  // ]
  // 对于没有引号
  // [
  //   'class=some-class',
  //   'class',
  //   '=',
  //   undefined,
  //   undefined,
  //   'some-class'
  // ]
  // 对于单独的属性名
  // [
  //   'disabled',
  //   'disabled',
  //   undefined,
  //   undefined,
  //   undefined,
  //   undefined
  // ]
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // 一个典型的XML标签:<k:bug xmlns:k="http://www.xxx.com/xxx"></k:bug>
  // k是前缀 bug是标签名(xml标签名由用户自定义) xmlns为前缀赋予与指定命名空间相关联的限定名称
  // 不包含前缀的XML标签名称
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
  var startTagOpen = new RegExp(("^<" + qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
  var doctype = /^<!DOCTYPE [^>]+>/i;
  // #7298: escape - to avoid being passed as HTML comment when inlined in page
  var comment = /^<!\--/;
  var conditionalComment = /^<!\[/;
  // Special Elements (can contain anything)
  var isPlainTextElement = makeMap('script,style,textarea', true);
  var reCache = {};
  var decodingMap = {
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&amp;': '&',
      '&#10;': '\n',
      '&#9;': '\t',
      '&#39;': "'",
  };
  var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;
  // #5992
  var isIgnoreNewlineTag = makeMap('pre,textarea', true);
  var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };
  /**
  * 把各种转义符解码
  * '&lt;': '<',
  * '&gt;': '>',
  * '&quot;': '"',
  * '&amp;': '&',
  * '&#10;': '\n',
  * '&#9;': '\t',
  * '&#39;': "'"
  */
  function decodeAttr(value, shouldDecodeNewlines) {
      var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
      return value.replace(re, function (match) { return decodingMap[match]; });
  }
  /**
   * 解析tamplate字符串的主要方法
   * 返回AST
   * @date 2020-04-24
   * @export
   * @param {*} html
   * @param {*} options
   */
  function parseHTML(html, options) {
      var stack = [];
      var expectHTML = options.expectHTML;
      // 检测一个标签是否是一元标签
      var isUnaryTag = options.isUnaryTag || no;
      // 检测一个标签是否是可以省略闭合标签的非一元标签
      var canBeLeftOpenTag = options.canBeLeftOpenTag || no;
      var index = 0;
      var last, lastTag;
      // 循环处理html
      while (html) {
          last = html;
          // Make sure we're not in a plaintext content element like script/style
          // 处理非script，style,textarea所包围的html字符串
          if (!lastTag || !isPlainTextElement(lastTag)) {
              var textEnd = html.indexOf('<');
              // 1."<"字符打头处理逻辑
              if (textEnd === 0) {
                  // Comment:
                  // 如果html以注释开头
                  if (comment.test(html)) {
                      var commentEnd = html.indexOf('-->');
                      // 1.1、处理标准注释,<!--
                      if (commentEnd >= 0) {
                          // 如果找到了标准注释的结尾处
                          if (options.shouldKeepComment) {
                              // 当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
                              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
                          }
                          // 步进三个字符
                          // 开始解析下一个节点
                          advance(commentEnd + 3);
                          continue;
                      }
                  }
                  // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
                  // 1.2、处理条件注释
                  // e.g. <!--[if IE 8]> ... <![endif]-->
                  // 直接舍弃跳过
                  if (conditionalComment.test(html)) {
                      var conditionalEnd = html.indexOf(']>');
                      if (conditionalEnd >= 0) {
                          advance(conditionalEnd + 2);
                          continue;
                      }
                  }
                  // Doctype:
                  // 1.3、处理申明，<!DOCTYPE
                  // 直接舍弃跳过
                  var doctypeMatch = html.match(doctype);
                  if (doctypeMatch) {
                      advance(doctypeMatch[0].length);
                      continue;
                  }
                  // End tag:
                  // 1.4、处理结束标签，遇到结束标签直接舍弃跳过
                  var endTagMatch = html.match(endTag);
                  if (endTagMatch) {
                      var curIndex = index;
                      advance(endTagMatch[0].length);
                      parseEndTag(endTagMatch[1], curIndex, index);
                      continue;
                  }
                  // Start tag:
                  // 1.5、处理开始标签
                  // 返回一个标签模型对象
                  // 含有attrs tagName等属性
                  var startTagMatch = parseStartTag();
                  if (startTagMatch) {
                      handleStartTag(startTagMatch);
                      if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                          advance(1);
                      }
                      continue;
                  }
              }
              // 2、非"<"打头，作为text内容处理
              var text = (void 0), rest = (void 0), next = (void 0);
              if (textEnd >= 0) {
                  rest = html.slice(textEnd);
                  while (!endTag.test(rest) &&
                      !startTagOpen.test(rest) &&
                      !comment.test(rest) &&
                      !conditionalComment.test(rest)) {
                      // < in plain text, be forgiving and treat it as text
                      // 普通文本中包含的<字符，作为普通字符处理
                      // 继续查找下一个<符号
                      next = rest.indexOf('<', 1);
                      if (next < 0)
                          { break; }
                      textEnd += next;
                      // 此时text就是所有的文本内容
                      rest = html.slice(textEnd);
                  }
                  text = html.substring(0, textEnd);
              }
              // 没在字符串中找到<符号，直接全部识别为字符串
              // html的<字符匹配结束，将剩余字符都作为text处理
              if (textEnd < 0) {
                  text = html;
              }
              // 步进
              if (text) {
                  advance(text.length);
              }
              // 创建text的AST模型
              if (options.chars && text) {
                  options.chars(text, index - text.length, index);
              }
          }
          else {
              var endTagLength = 0;
              var stackedTag = lastTag.toLowerCase();
              var reStackedTag = reCache[stackedTag] ||
                  (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
              var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
                  endTagLength = endTag.length;
                  if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
                      text = text
                          .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
                          .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                  }
                  if (shouldIgnoreFirstNewline(stackedTag, text)) {
                      text = text.slice(1);
                  }
                  if (options.chars) {
                      options.chars(text);
                  }
                  return '';
              });
              index += html.length - rest$1.length;
              html = rest$1;
              parseEndTag(stackedTag, index - endTagLength, index);
          }
          if (html === last) {
              options.chars && options.chars(html);
              if (!stack.length &&
                  options.warn) {
                  options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), {
                      start: index + html.length,
                  });
              }
              break;
          }
      }
      // Clean up any remaining tags
      parseEndTag();
      /**
       * html代码前进
       */
      function advance(n) {
          index += n;
          html = html.substring(n);
      }
      /**
       * 解析出起始标签
       * 返回tag模型对象
       * 含有tagName start end attrs等属性
       */
      function parseStartTag() {
          // 1、匹配<${qnameCapture}字符，如:<div
          var start = html.match(startTagOpen);
          if (start) {
              // 把这个标签保存在match对象里面
              var match = {
                  tagName: start[1],
                  attrs: [],
                  start: index,
              };
              // 2.往前跳过，步进tag的长度
              advance(start[0].length);
              // 3.循环查找该标签的attr，直到结束符>
              var end, attr;
              while (!(end = html.match(startTagClose)) &&
                  (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                  attr.start = index;
                  // 步进该attr的长度
                  advance(attr[0].length);
                  attr.end = index;
                  match.attrs.push(attr);
              }
              //4、tag结束，记录全局的位置
              if (end) {
                  match.unarySlash = end[1];
                  advance(end[0].length);
                  match.end = index;
                  return match;
              }
          }
      }
      /**
       * 处理起始标签模型对象
       * 主要实现对属性对象进行规整
       * 并调用start方法，创建该标签的AST模型
       */
      function handleStartTag(match) {
          var tagName = match.tagName;
          var unarySlash = match.unarySlash;
          if (expectHTML) {
              // p标签或者短语标签
              if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
                  parseEndTag(lastTag);
              }
              // 可以成为自闭和标签的标签
              if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
                  parseEndTag(tagName);
              }
          }
          // 自闭和标签
          var unary = isUnaryTag(tagName) || !!unarySlash;
          // 1.整理attrs为字面量对象数组
          // 规整完毕后 attrs=[{name=id,value=app}]
          var l = match.attrs.length;
          var attrs = new Array(l);
          for (var i = 0; i < l; i++) {
              var args = match.attrs[i];
              var value = args[3] || args[4] || args[5] || '';
              var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
                  ? options.shouldDecodeNewlinesForHref
                  : options.shouldDecodeNewlines;
              attrs[i] = {
                  name: args[1],
                  value: decodeAttr(value, shouldDecodeNewlines), // 解码转义符
              };
              if (options.outputSourceRange) {
                  attrs[i].start = args.start + args[0].match(/^\s*/).length;
                  attrs[i].end = args.end;
              }
          }
          // 2.如果不是一元标签
          // 存起来并在lastTag中缓存
          // 该stack在后面的结束tag中进行闭环处理
          if (!unary) {
              stack.push({
                  tag: tagName,
                  lowerCasedTag: tagName.toLowerCase(),
                  attrs: attrs,
                  start: match.start,
                  end: match.end,
              });
              lastTag = tagName;
          }
          // 3、创建该标签的AST模型,并建立关联关系
          // 继续调用start方法，创建该标签元素的AST模型，建立模型树
          if (options.start) {
              options.start(tagName, attrs, unary, match.start, match.end);
          }
      }
      /**
       * 解析结束标签
       */
      function parseEndTag(tagName, start, end) {
          var pos, lowerCasedTagName;
          if (start == null)
              { start = index; }
          if (end == null)
              { end = index; }
          // Find the closest opened tag of the same type
          // 1、从stack数组中查找结束的tag标签，并记录位置pos
          if (tagName) {
              lowerCasedTagName = tagName.toLowerCase();
              // 循环stack查找能否和传进来的tag一样，如果一样证明是闭合标签
              for (pos = stack.length - 1; pos >= 0; pos--) {
                  if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                      break;
                  }
              }
          }
          else {
              // If no tag name is provided, clean shop
              pos = 0;
          }
          // 2、当pos>0,证明找到了闭合标签
          // 关闭从pos到最后的所有元素，理论上只会有一个，但也要防止不规范多写了结束标签
          if (pos >= 0) {
              // Close all the open elements, up the stack
              for (var i = stack.length - 1; i >= pos; i--) {
                  if ((i > pos || !tagName) &&
                      options.warn) {
                      options.warn(("tag <" + (stack[i].tag) + "> has no matching end tag."), {
                          start: stack[i].start,
                          end: stack[i].end,
                      });
                  }
                  if (options.end) {
                      options.end(stack[i].tag, start, end);
                  }
              }
              // Remove the open elements from the stack
              //  从stack中删除元素
              stack.length = pos;
              lastTag = pos && stack[pos - 1].tag;
          }
          else if (lowerCasedTagName === 'br') {
              if (options.start) {
                  options.start(tagName, [], true, start, end);
              }
          }
          else if (lowerCasedTagName === 'p') {
              if (options.start) {
                  options.start(tagName, [], false, start, end);
              }
              if (options.end) {
                  options.end(tagName, start, end);
              }
          }
      }
  }

  var onRE = /^@|^v-on:/;
  var dirRE = /^v-|^@|^:|^#/;
  var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  var stripParensRE = /^\(|\)$/g;
  var dynamicArgRE = /^\[.*\]$/;
  var argRE = /:(.*)$/;
  var bindRE = /^:|^\.|^v-bind:/;
  var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;
  var slotRE = /^v-slot(:|$)|^#/;
  var lineBreakRE = /[\r\n]/;
  var whitespaceRE = /[ \f\t\r\n]+/g;
  var invalidAttributeRE = /[\s"'<>\/=]/;
  var decodeHTMLCached = cached(he.decode);
  var emptySlotScopeToken = "_empty_";
  // configurable state
  var warn;
  var delimiters;
  var transforms;
  var preTransforms;
  var postTransforms;
  var platformIsPreTag;
  var platformMustUseProp;
  var platformGetTagNamespace;
  var maybeComponent;
  /**
   * 创建标签元素的AST模型对象
   */
  function createASTElement(tag, attrs, parent) {
      return {
          type: 1,
          tag: tag,
          attrsList: attrs,
          attrsMap: makeAttrsMap(attrs),
          rawAttrsMap: {},
          parent: parent,
          children: [],
      };
  }
  /**
   * 把html字符串转成AST（抽象语法树）
   * AST: 一个含有type tag attrsList children parent等属性的对象，用来描述html
   */
  function parse(template, options) {
      warn = options.warn || baseWarn;
      platformIsPreTag = options.isPreTag || no;
      platformMustUseProp = options.mustUseProp || no;
      platformGetTagNamespace = options.getTagNamespace || no;
      var isReservedTag = options.isReservedTag || no;
      maybeComponent = function (el) { return !!(el.component ||
          el.attrsMap[':is'] ||
          el.attrsMap['v-bind:is'] ||
          !(el.attrsMap.is ? isReservedTag(el.attrsMap.is) : isReservedTag(el.tag))); };
      transforms = pluckModuleFunction(options.modules, 'transformNode');
      preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
      postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
      // 分隔符设置
      delimiters = options.delimiters;
      var stack = [];
      // 是否保留空格
      var preserveWhitespace = options.preserveWhitespace !== false;
      // 是否保留空格
      var whitespaceOption = options.whitespace;
      // 定义AST模型对象
      var root;
      var currentParent;
      var inVPre = false;
      var inPre = false;
      var warned = false;
      /**
       * 报一次错
       * 免得疯狂报错
       */
      function warnOnce(msg, range) {
          if (!warned) {
              warned = true;
              warn(msg, range);
          }
      }
      /**
       * 把没有闭合的标签闭合
       */
      function closeElement(element) {
          trimEndingWhitespace(element);
          if (!inVPre && !element.processed) {
              element = processElement(element, options);
          }
          // tree management
          if (!stack.length && element !== root) {
              // allow root elements with v-if, v-else-if and v-else
              if (root.if && (element.elseif || element.else)) {
                  {
                      checkRootConstraints(element);
                  }
                  addIfCondition(root, {
                      exp: element.elseif,
                      block: element,
                  });
              }
              else {
                  warnOnce("Component template should contain exactly one root element. " +
                      "If you are using v-if on multiple elements, " +
                      "use v-else-if to chain them instead.", { start: element.start });
              }
          }
          if (currentParent && !element.forbidden) {
              if (element.elseif || element.else) {
                  processIfConditions(element, currentParent);
              }
              else {
                  if (element.slotScope) {
                      // scoped slot
                      // keep it in the children list so that v-else(-if) conditions can
                      // find it as the prev node.
                      var name = element.slotTarget || '"default"';
                      (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                  }
                  currentParent.children.push(element);
                  element.parent = currentParent;
              }
          }
          // final children cleanup
          // filter out scoped slots
          element.children = element.children.filter(function (c) { return !c.slotScope; });
          // remove trailing whitespace node again
          trimEndingWhitespace(element);
          // check pre state
          if (element.pre) {
              inVPre = false;
          }
          if (platformIsPreTag(element.tag)) {
              inPre = false;
          }
          // apply post-transforms
          for (var i = 0; i < postTransforms.length; i++) {
              postTransforms[i](element, options);
          }
      }
      /**
       * 修剪尾部空白节点
       */
      function trimEndingWhitespace(el) {
          // remove trailing whitespace node
          if (!inPre) {
              var lastNode;
              while ((lastNode = el.children[el.children.length - 1]) &&
                  lastNode.type === 3 &&
                  lastNode.text === ' ') {
                  el.children.pop();
              }
          }
      }
      /**
       * 根节点限制
       * 不允许使用slot或者template节点作为组件根节点
       * 不允许在根节点使用v-for
       * 这是因为vue不允许根节点有多个
       */
      function checkRootConstraints(el) {
          if (el.tag === 'slot' || el.tag === 'template') {
              warnOnce("Cannot use <" + (el.tag) + "> as component root element because it may " +
                  'contain multiple nodes.', { start: el.start });
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
              warnOnce('Cannot use v-for on stateful component root element because ' +
                  'it renders multiple elements.', el.rawAttrsMap['v-for']);
          }
      }
      // 主要的解析方法
      parseHTML(template, {
          warn: warn,
          expectHTML: options.expectHTML,
          isUnaryTag: options.isUnaryTag,
          canBeLeftOpenTag: options.canBeLeftOpenTag,
          shouldDecodeNewlines: options.shouldDecodeNewlines,
          shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
          shouldKeepComment: options.comments,
          outputSourceRange: options.outputSourceRange,
          // 标准起始标签处理
          start: function start(tag, attrs, unary, start$1, end) {
              // check namespace.
              // inherit parent ns if there is one
              // 检查命名空间
              // 如果有父级就直接继承，否自直接获取该tag的命名空间
              var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);
              // handle IE svg bug
              /* istanbul ignore if */
              // IE浏览器的svg元素bug修复
              if (isIE && ns === 'svg') {
                  attrs = guardIESVGBug(attrs);
              }
              // 1、创建ASTelement
              var element = createASTElement(tag, attrs, currentParent);
              if (ns) {
                  element.ns = ns;
              }
              {
                  if (options.outputSourceRange) {
                      element.start = start$1;
                      element.end = end;
                      element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
                          cumulated[attr.name] = attr;
                          return cumulated;
                      }, {});
                  }
                  attrs.forEach(function (attr) {
                      if (invalidAttributeRE.test(attr.name)) {
                          warn("Invalid dynamic argument expression: attribute names cannot contain " +
                              "spaces, quotes, <, >, / or =.", {
                              start: attr.start + attr.name.indexOf("["),
                              end: attr.start + attr.name.length,
                          });
                      }
                  });
              }
              if (isForbiddenTag(element) && !isServerRendering()) {
                  element.forbidden = true;
                  warn('Templates should only be responsible for mapping the state to the ' +
                          'UI. Avoid placing tags with side-effects in your templates, such as ' +
                          "<" + tag + ">" +
                          ', as they will not be parsed.', { start: element.start });
              }
              // apply pre-transforms
              // 2、以下是处理属性中各类指令，从attrsList中删除相关的属性，
              for (var i = 0; i < preTransforms.length; i++) {
                  element = preTransforms[i](element, options) || element;
              }
              if (!inVPre) {
                  processPre(element);
                  if (element.pre) {
                      inVPre = true;
                  }
              }
              if (platformIsPreTag(element.tag)) {
                  inPre = true;
              }
              if (inVPre) {
                  processRawAttrs(element);
              }
              else if (!element.processed) {
                  // structural directives
                  processFor(element);
                  processIf(element);
                  processOnce(element);
              }
              // 3、构建AST模型树
              if (!root) {
                  // 如果是第一个元素，就设置其为根元素
                  root = element;
                  {
                      checkRootConstraints(root);
                  }
              }
              // 4、非单元素，将元素push到stack数组，
              // 对于非单元素，将当前的AST element push到stack数组(注意与上面的stack的区别，两者保存的对象不同，也是为后面的结束进行闭环准备)。对于单元素，调用closeElement做结束处理。
              if (!unary) {
                  currentParent = element;
                  stack.push(element);
              }
              else {
                  // 否则将这个元素闭合
                  closeElement(element);
              }
          },
          // 解析到结束标签，则为该标签的元素对象做闭环处理
          end: function end(tag, start, end$1) {
              // 从AST中查找该标签的模型对象
              var element = stack[stack.length - 1];
              // pop stack
              // stack中删除该模型模型对象，并变更当前的currentParent
              stack.length -= 1;
              currentParent = stack[stack.length - 1];
              if (options.outputSourceRange) {
                  element.end = end$1;
              }
              // 关闭
              closeElement(element);
          },
          // 文本节点(字符)处理
          // 将text作为所属元素的child，纳入到AST模型树
          chars: function chars(text, start, end) {
              // 如果文本节点没有父级节点就报错
              if (!currentParent) {
                  {
                      if (text === template) {
                          warnOnce('Component template requires a root element, rather than just text.', { start: start });
                      }
                      else if ((text = text.trim())) {
                          warnOnce(("text \"" + text + "\" outside root element will be ignored."), {
                              start: start,
                          });
                      }
                  }
                  return;
              }
              // IE textarea placeholder bug
              /* istanbul ignore if */
              // IE的特殊处理
              if (isIE &&
                  currentParent.tag === 'textarea' &&
                  currentParent.attrsMap.placeholder === text) {
                  return;
              }
              // 获取text内容
              var children = currentParent.children;
              if (inPre || text.trim()) {
                  text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
              }
              else if (!children.length) {
                  // remove the whitespace-only node right after an opening tag
                  text = '';
              }
              else if (whitespaceOption) {
                  if (whitespaceOption === 'condense') {
                      // in condense mode, remove the whitespace node if it contains
                      // line break, otherwise condense to a single space
                      text = lineBreakRE.test(text) ? '' : ' ';
                  }
                  else {
                      text = ' ';
                  }
              }
              else {
                  text = preserveWhitespace ? ' ' : '';
              }
              // 创建AST模型
              if (text) {
                  if (!inPre && whitespaceOption === 'condense') {
                      // condense consecutive whitespaces into single space
                      text = text.replace(whitespaceRE, ' ');
                  }
                  var res;
                  var child;
                  if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
                      // 包含表达式的test
                      // parseText 解析文本中的表达式
                      child = {
                          type: 2,
                          expression: res.expression,
                          tokens: res.tokens,
                          text: text,
                      };
                  }
                  else if (text !== ' ' ||
                      !children.length ||
                      children[children.length - 1].text !== ' ') {
                      //纯文本的text
                      child = {
                          type: 3,
                          text: text,
                      };
                  }
                  if (child) {
                      if (options.outputSourceRange) {
                          child.start = start;
                          child.end = end;
                      }
                      children.push(child);
                  }
              }
          },
          comment: function comment(text, start, end) {
              // adding anything as a sibling to the root node is forbidden
              // comments should still be allowed, but ignored
              if (currentParent) {
                  var child = {
                      type: 3,
                      text: text,
                      isComment: true,
                  };
                  if (options.outputSourceRange) {
                      child.start = start;
                      child.end = end;
                  }
                  currentParent.children.push(child);
              }
          },
      });
      // 返回AST
      return root;
  }
  function processPre(el) {
      if (getAndRemoveAttr(el, 'v-pre') != null) {
          el.pre = true;
      }
  }
  function processRawAttrs(el) {
      var list = el.attrsList;
      var len = list.length;
      if (len) {
          var attrs = (el.attrs = new Array(len));
          for (var i = 0; i < len; i++) {
              attrs[i] = {
                  name: list[i].name,
                  value: JSON.stringify(list[i].value),
              };
              if (list[i].start != null) {
                  attrs[i].start = list[i].start;
                  attrs[i].end = list[i].end;
              }
          }
      }
      else if (!el.pre) {
          // non root node in pre blocks with no attributes
          el.plain = true;
      }
  }
  function processElement(element, options) {
      // 处理attrs中的key
      processKey(element);
      // determine whether this is a plain element after
      // removing structural attributes
      // 在删除结构属性后，确定这是否是普通元素
      element.plain =
          !element.key && !element.scopedSlots && !element.attrsList.length;
      // 处理ref
      processRef(element);
      processSlotContent(element);
      processSlotOutlet(element);
      processComponent(element);
      for (var i = 0; i < transforms.length; i++) {
          element = transforms[i](element, options) || element;
      }
      processAttrs(element);
      return element;
  }
  /**
   * 处理attrs中的key
   *
   * @date 18/01/2021
   * @param {*} el
   */
  function processKey(el) {
      var exp = getBindingAttr(el, 'key');
      if (exp) {
          {
              if (el.tag === 'template') {
                  warn("<template> cannot be keyed. Place the key on real elements instead.", getRawBindingAttr(el, 'key'));
              }
              if (el.for) {
                  var iterator = el.iterator2 || el.iterator1;
                  var parent = el.parent;
                  if (iterator &&
                      iterator === exp &&
                      parent &&
                      parent.tag === 'transition-group') {
                      warn("Do not use v-for index as key on <transition-group> children, " +
                          "this is the same as not using keys.", getRawBindingAttr(el, 'key'), true /* tip */);
                  }
              }
          }
          el.key = exp;
      }
  }
  function processRef(el) {
      var ref = getBindingAttr(el, 'ref');
      if (ref) {
          el.ref = ref;
          el.refInFor = checkInFor(el);
      }
  }
  function processFor(el) {
      var exp;
      if ((exp = getAndRemoveAttr(el, 'v-for'))) {
          var res = parseFor(exp);
          if (res) {
              extend(el, res);
          }
          else {
              warn(("Invalid v-for expression: " + exp), el.rawAttrsMap['v-for']);
          }
      }
  }
  function parseFor(exp) {
      var inMatch = exp.match(forAliasRE);
      if (!inMatch)
          { return; }
      var res = {};
      res.for = inMatch[2].trim();
      var alias = inMatch[1].trim().replace(stripParensRE, '');
      var iteratorMatch = alias.match(forIteratorRE);
      if (iteratorMatch) {
          res.alias = alias.replace(forIteratorRE, '').trim();
          res.iterator1 = iteratorMatch[1].trim();
          if (iteratorMatch[2]) {
              res.iterator2 = iteratorMatch[2].trim();
          }
      }
      else {
          res.alias = alias;
      }
      return res;
  }
  function processIf(el) {
      var exp = getAndRemoveAttr(el, 'v-if');
      if (exp) {
          el.if = exp;
          addIfCondition(el, {
              exp: exp,
              block: el,
          });
      }
      else {
          if (getAndRemoveAttr(el, 'v-else') != null) {
              el.else = true;
          }
          var elseif = getAndRemoveAttr(el, 'v-else-if');
          if (elseif) {
              el.elseif = elseif;
          }
      }
  }
  function processIfConditions(el, parent) {
      var prev = findPrevElement(parent.children);
      if (prev && prev.if) {
          addIfCondition(prev, {
              exp: el.elseif,
              block: el,
          });
      }
      else {
          warn("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " +
              "used on element <" + (el.tag) + "> without corresponding v-if.", el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']);
      }
  }
  function findPrevElement(children) {
      var i = children.length;
      while (i--) {
          if (children[i].type === 1) {
              return children[i];
          }
          else {
              if (children[i].text !== ' ') {
                  warn("text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
                      "will be ignored.", children[i]);
              }
              children.pop();
          }
      }
  }
  function addIfCondition(el, condition) {
      if (!el.ifConditions) {
          el.ifConditions = [];
      }
      el.ifConditions.push(condition);
  }
  function processOnce(el) {
      var once = getAndRemoveAttr(el, 'v-once');
      if (once != null) {
          el.once = true;
      }
  }
  // handle content being passed to a component as slot,
  // e.g. <template slot="xxx">, <div slot-scope="xxx">
  function processSlotContent(el) {
      var slotScope;
      if (el.tag === 'template') {
          slotScope = getAndRemoveAttr(el, 'scope');
          /* istanbul ignore if */
          if (slotScope) {
              warn("the \"scope\" attribute for scoped slots have been deprecated and " +
                  "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
                  "can also be used on plain elements in addition to <template> to " +
                  "denote scoped slots.", el.rawAttrsMap['scope'], true);
          }
          el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
      }
      else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
          /* istanbul ignore if */
          if (el.attrsMap['v-for']) {
              warn("Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
                  "(v-for takes higher priority). Use a wrapper <template> for the " +
                  "scoped slot to make it clearer.", el.rawAttrsMap['slot-scope'], true);
          }
          el.slotScope = slotScope;
      }
      // slot="xxx"
      var slotTarget = getBindingAttr(el, 'slot');
      if (slotTarget) {
          el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
          el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
          // preserve slot as an attribute for native shadow DOM compat
          // only for non-scoped slots.
          if (el.tag !== 'template' && !el.slotScope) {
              addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
          }
      }
      // 2.6 v-slot syntax
      {
          if (el.tag === 'template') {
              // v-slot on <template>
              var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
              if (slotBinding) {
                  {
                      if (el.slotTarget || el.slotScope) {
                          warn("Unexpected mixed usage of different slot syntaxes.", el);
                      }
                      if (el.parent && !maybeComponent(el.parent)) {
                          warn("<template v-slot> can only appear at the root level inside " +
                              "the receiving component", el);
                      }
                  }
                  var ref = getSlotName(slotBinding);
                  var name = ref.name;
                  var dynamic = ref.dynamic;
                  el.slotTarget = name;
                  el.slotTargetDynamic = dynamic;
                  el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
              }
          }
          else {
              // v-slot on component, denotes default slot
              var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
              if (slotBinding$1) {
                  {
                      if (!maybeComponent(el)) {
                          warn("v-slot can only be used on components or <template>.", slotBinding$1);
                      }
                      if (el.slotScope || el.slotTarget) {
                          warn("Unexpected mixed usage of different slot syntaxes.", el);
                      }
                      if (el.scopedSlots) {
                          warn("To avoid scope ambiguity, the default slot should also use " +
                              "<template> syntax when there are other named slots.", slotBinding$1);
                      }
                  }
                  // add the component's children to its default slot
                  var slots = el.scopedSlots || (el.scopedSlots = {});
                  var ref$1 = getSlotName(slotBinding$1);
                  var name$1 = ref$1.name;
                  var dynamic$1 = ref$1.dynamic;
                  var slotContainer = (slots[name$1] = createASTElement('template', [], el));
                  slotContainer.slotTarget = name$1;
                  slotContainer.slotTargetDynamic = dynamic$1;
                  slotContainer.children = el.children.filter(function (c) {
                      if (!c.slotScope) {
                          c.parent = slotContainer;
                          return true;
                      }
                  });
                  slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
                  // remove children as they are returned from scopedSlots now
                  el.children = [];
                  // mark el non-plain so data gets generated
                  el.plain = false;
              }
          }
      }
  }
  function getSlotName(binding) {
      var name = binding.name.replace(slotRE, '');
      if (!name) {
          if (binding.name[0] !== '#') {
              name = 'default';
          }
          else {
              warn("v-slot shorthand syntax requires a slot name.", binding);
          }
      }
      return dynamicArgRE.test(name)
          ? // dynamic [name]
              { name: name.slice(1, -1), dynamic: true }
          : // static name
              { name: ("\"" + name + "\""), dynamic: false };
  }
  // handle <slot/> outlets
  function processSlotOutlet(el) {
      if (el.tag === 'slot') {
          el.slotName = getBindingAttr(el, 'name');
          if (el.key) {
              warn("`key` does not work on <slot> because slots are abstract outlets " +
                  "and can possibly expand into multiple elements. " +
                  "Use the key on a wrapping element instead.", getRawBindingAttr(el, 'key'));
          }
      }
  }
  function processComponent(el) {
      var binding;
      if ((binding = getBindingAttr(el, 'is'))) {
          el.component = binding;
      }
      if (getAndRemoveAttr(el, 'inline-template') != null) {
          el.inlineTemplate = true;
      }
  }
  function processAttrs(el) {
      var list = el.attrsList;
      var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
      for (i = 0, l = list.length; i < l; i++) {
          name = rawName = list[i].name;
          value = list[i].value;
          if (dirRE.test(name)) {
              // mark element as dynamic
              el.hasBindings = true;
              // modifiers
              modifiers = parseModifiers(name.replace(dirRE, ''));
              // support .foo shorthand syntax for the .prop modifier
              if (modifiers) {
                  name = name.replace(modifierRE, '');
              }
              if (bindRE.test(name)) {
                  // v-bind
                  name = name.replace(bindRE, '');
                  value = parseFilters(value);
                  isDynamic = dynamicArgRE.test(name);
                  if (isDynamic) {
                      name = name.slice(1, -1);
                  }
                  if (value.trim().length === 0) {
                      warn(("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\""));
                  }
                  if (modifiers) {
                      if (modifiers.prop && !isDynamic) {
                          name = camelize(name);
                          if (name === 'innerHtml')
                              { name = 'innerHTML'; }
                      }
                      if (modifiers.camel && !isDynamic) {
                          name = camelize(name);
                      }
                      if (modifiers.sync) {
                          syncGen = genAssignmentCode(value, "$event");
                          if (!isDynamic) {
                              addHandler(el, ("update:" + (camelize(name))), syncGen, null, false, warn, list[i]);
                              if (hyphenate(name) !== camelize(name)) {
                                  addHandler(el, ("update:" + (hyphenate(name))), syncGen, null, false, warn, list[i]);
                              }
                          }
                          else {
                              // handler w/ dynamic event name
                              addHandler(el, ("\"update:\"+(" + name + ")"), syncGen, null, false, warn, list[i], true // dynamic
                              );
                          }
                      }
                  }
                  if ((modifiers && modifiers.prop) ||
                      (!el.component && platformMustUseProp(el.tag, el.attrsMap.type, name))) {
                      addProp(el, name, value, list[i], isDynamic);
                  }
                  else {
                      addAttr(el, name, value, list[i], isDynamic);
                  }
              }
              else if (onRE.test(name)) {
                  // v-on
                  name = name.replace(onRE, '');
                  isDynamic = dynamicArgRE.test(name);
                  if (isDynamic) {
                      name = name.slice(1, -1);
                  }
                  addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic);
              }
              else {
                  // normal directives
                  name = name.replace(dirRE, '');
                  // parse arg
                  var argMatch = name.match(argRE);
                  var arg = argMatch && argMatch[1];
                  isDynamic = false;
                  if (arg) {
                      name = name.slice(0, -(arg.length + 1));
                      if (dynamicArgRE.test(arg)) {
                          arg = arg.slice(1, -1);
                          isDynamic = true;
                      }
                  }
                  addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
                  if (name === 'model') {
                      checkForAliasModel(el, value);
                  }
              }
          }
          else {
              // literal attribute
              {
                  var res = parseText(value, delimiters);
                  if (res) {
                      warn(name + "=\"" + value + "\": " +
                          'Interpolation inside attributes has been removed. ' +
                          'Use v-bind or the colon shorthand instead. For example, ' +
                          'instead of <div id="{{ val }}">, use <div :id="val">.', list[i]);
                  }
              }
              addAttr(el, name, JSON.stringify(value), list[i]);
              // #6887 firefox doesn't update muted state if set via attribute
              // even immediately after element creation
              if (!el.component &&
                  name === 'muted' &&
                  platformMustUseProp(el.tag, el.attrsMap.type, name)) {
                  addProp(el, name, 'true', list[i]);
              }
          }
      }
  }
  function checkInFor(el) {
      var parent = el;
      while (parent) {
          if (parent.for !== undefined) {
              return true;
          }
          parent = parent.parent;
      }
      return false;
  }
  function parseModifiers(name) {
      var match = name.match(modifierRE);
      if (match) {
          var ret = {};
          match.forEach(function (m) {
              ret[m.slice(1)] = true;
          });
          return ret;
      }
  }
  function makeAttrsMap(attrs) {
      var map = {};
      for (var i = 0, l = attrs.length; i < l; i++) {
          if (map[attrs[i].name] &&
              !isIE &&
              !isEdge) {
              warn('duplicate attribute: ' + attrs[i].name, attrs[i]);
          }
          map[attrs[i].name] = attrs[i].value;
      }
      return map;
  }
  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag(el) {
      return el.tag === 'script' || el.tag === 'style';
  }
  function isForbiddenTag(el) {
      return (el.tag === 'style' ||
          (el.tag === 'script' &&
              (!el.attrsMap.type || el.attrsMap.type === 'text/javascript')));
  }
  var ieNSBug = /^xmlns:NS\d+/;
  var ieNSPrefix = /^NS\d+:/;
  /* istanbul ignore next */
  function guardIESVGBug(attrs) {
      var res = [];
      for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];
          if (!ieNSBug.test(attr.name)) {
              attr.name = attr.name.replace(ieNSPrefix, '');
              res.push(attr);
          }
      }
      return res;
  }
  function checkForAliasModel(el, value) {
      var _el = el;
      while (_el) {
          if (_el.for && _el.alias === value) {
              warn("<" + (el.tag) + " v-model=\"" + value + "\">: " +
                  "You are binding v-model directly to a v-for iteration alias. " +
                  "This will not be able to modify the v-for source array because " +
                  "writing to the alias is like modifying a function local variable. " +
                  "Consider using an array of objects and use v-model on an object property instead.", el.rawAttrsMap['v-model']);
          }
          _el = _el.parent;
      }
  }

  /**
   * Expand input[v-model] with dynamic type bindings into v-if-else chains
   * Turn this:
   *   <input v-model="data[type]" :type="type">
   * into this:
   *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
   *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
   *   <input v-else :type="type" v-model="data[type]">
   */
  /**
   * 预处理v-model
   *
   * @date 05/05/2021
   * @param {ASTElement} el
   * @param {CompilerOptions} options
   * @return {*}
   */
  function preTransformNode(el, options) {
      if (el.tag === 'input') {
          var map = el.attrsMap;
          if (!map['v-model']) {
              return;
          }
          var typeBinding;
          if (map[':type'] || map['v-bind:type']) {
              typeBinding = getBindingAttr(el, 'type');
          }
          if (!map.type && !typeBinding && map['v-bind']) {
              typeBinding = "(" + (map['v-bind']) + ").type";
          }
          if (typeBinding) {
              var ifCondition = getAndRemoveAttr(el, 'v-if', true);
              var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
              var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
              var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
              // 1. checkbox
              var branch0 = cloneASTElement(el);
              // process for on the main node
              processFor(branch0);
              addRawAttr(branch0, 'type', 'checkbox');
              processElement(branch0, options);
              branch0.processed = true; // prevent it from double-processed
              branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
              addIfCondition(branch0, {
                  exp: branch0.if,
                  block: branch0,
              });
              // 2. add radio else-if condition
              var branch1 = cloneASTElement(el);
              getAndRemoveAttr(branch1, 'v-for', true);
              addRawAttr(branch1, 'type', 'radio');
              processElement(branch1, options);
              addIfCondition(branch0, {
                  exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
                  block: branch1,
              });
              // 3. other
              var branch2 = cloneASTElement(el);
              getAndRemoveAttr(branch2, 'v-for', true);
              addRawAttr(branch2, ':type', typeBinding);
              processElement(branch2, options);
              addIfCondition(branch0, {
                  exp: ifCondition,
                  block: branch2,
              });
              if (hasElse) {
                  branch0.else = true;
              }
              else if (elseIfCondition) {
                  branch0.elseif = elseIfCondition;
              }
              return branch0;
          }
      }
  }
  function cloneASTElement(el) {
      return createASTElement(el.tag, el.attrsList.slice(), el.parent);
  }
  var model = {
      preTransformNode: preTransformNode,
  };

  var modules = [klass, style, model];

  function text(el, dir) {
      if (dir.value) {
          addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
      }
  }

  function html(el, dir) {
      if (dir.value) {
          addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
      }
  }

  var directives = {
      model: model$1,
      text: text,
      html: html,
  };

  var baseOptions = {
      expectHTML: true,
      modules: modules,
      directives: directives,
      isPreTag: isPreTag,
      isUnaryTag: isUnaryTag,
      mustUseProp: mustUseProp,
      canBeLeftOpenTag: canBeLeftOpenTag,
      isReservedTag: isReservedTag,
      getTagNamespace: getTagNamespace,
      staticKeys: genStaticKeys$1(modules),
  };

  var isStaticKey;
  var isPlatformReservedTag;
  var genStaticKeysCached = cached(genStaticKeys);
  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   * 优化器的目标:遍历生成的模板AST树
   * 检测纯静态的子树，即
   * 永远不需要改变的DOM。
   *
   * 一旦我们检测到这些子树，我们可以:
   *
   *  1。把它们变成常数，这样我们就不需要了
   * 在每次重新渲染时为它们创建新的节点;
   *  2。在打补丁的过程中完全跳过它们。
   */
  function optimize(root, options) {
      if (!root)
          { return; }
      isStaticKey = genStaticKeysCached(options.staticKeys || '');
      isPlatformReservedTag = options.isReservedTag || no;
      // first pass: mark all non-static nodes.
      // 标注静态节点
      markStatic(root);
      // 标注静态根节点
      // second pass: mark static roots.
      markStaticRoots(root, false);
  }
  function genStaticKeys(keys) {
      return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
          (keys ? ',' + keys : ''));
  }
  /**
   * 标注静态节点
   */
  function markStatic(node) {
      //1、标注节点的状态
      node.static = isStatic(node);
      //2、对标签节点进行处理
      // type === 1 表示element
      if (node.type === 1) {
          // do not make component slot content static. this avoids
          // 1. components not able to mutate slot nodes
          // 2. static slot content fails for hot-reloading
          if (!isPlatformReservedTag(node.tag) && // 非平台保留标签
              node.tag !== 'slot' && // 不是slot标签
              node.attrsMap['inline-template'] == null // 不是一个内联模板选容器
          ) {
              return;
          }
          //递归其子节点，给子节点也标注状态
          for (var i = 0, l = node.children.length; i < l; i++) {
              var child = node.children[i];
              // 递归一下
              markStatic(child);
              //如果发现子节点非静态，则该节点也标注非静态
              if (!child.static) {
                  node.static = false;
              }
          }
          //对ifConditions进行循环递归
          // ifConditions代表该节点使用了if指令
          if (node.ifConditions) {
              for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
                  // block是当前AST的引用
                  var block = node.ifConditions[i$1].block;
                  markStatic(block);
                  if (!block.static) {
                      node.static = false;
                  }
              }
          }
      }
  }
  /**
   * 标注静态根节点
   */
  function markStaticRoots(node, isInFor) {
      // type === 1 表示element
      if (node.type === 1) {
          // 用以标记在v-for内的静态节点
          // 这个属性用以告诉renderStatic(_m)对这个节点生成新的key
          // 避免patch error
          if (node.static || node.once) {
              node.staticInFor = isInFor;
          }
          // For a node to qualify as a static root, it should have children that
          // are not just static text. Otherwise the cost of hoisting out will
          // outweigh the benefits and it's better off to just always render it fresh.
          //一个节点要成为根节点，那么要满足以下条件：
          //1、静态节点，并且有子节点，
          //2、子节点不能仅为一个文本节点
          if (node.static &&
              node.children.length &&
              !(node.children.length === 1 && node.children[0].type === 3)) {
              node.staticRoot = true;
              return;
          }
          else {
              node.staticRoot = false;
          }
          //循环递归标记
          if (node.children) {
              for (var i = 0, l = node.children.length; i < l; i++) {
                  markStaticRoots(node.children[i], isInFor || !!node.for);
              }
          }
          if (node.ifConditions) {
              for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
                  markStaticRoots(node.ifConditions[i$1].block, isInFor);
              }
          }
      }
  }
  /**
   * 判断AST节点是否是静态节点
   */
  function isStatic(node) {
      if (node.type === 2) { // expression 表达式，标注非静态节点
          return false;
      }
      if (node.type === 3) { // text 普通文本，标注静态节点
          return true;
      }
      // (1)无动态绑定
      // (2)没有 v-if 和 v-for 
      // (3)不是内置的标签，内置的标签有slot和component 
      // (4)是平台保留标签(html和svg标签)
      // (5)不是 template 标签的直接子元素并且没有包含在 for 循环中
      // (6)结点包含的属性只能有isStaticKey中指定的几个.
      return !!(node.pre || ( // 有v-pre指令
      !node.hasBindings && // no dynamic bindings 无动态绑定
          !node.if && !node.for && // not v-if or v-for or v-else 无v-if v-for 相关指令
          !isBuiltInTag(node.tag) && // not a built-in 不是内置标签，内置标签有slot 和 component
          isPlatformReservedTag(node.tag) && // not a component 是平台保留标签
          !isDirectChildOfTemplateFor(node) && // 不是template标签的直接子元素并且没有包含在for循环中
          Object.keys(node).every(isStaticKey) // 节点包含的属性只能有isStaticKey中指定的几个
      ));
  }
  function isDirectChildOfTemplateFor(node) {
      while (node.parent) {
          node = node.parent;
          if (node.tag !== 'template') {
              return false;
          }
          if (node.for) {
              return true;
          }
      }
      return false;
  }

  var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
  var fnInvokeRE = /\([^)]*?\);*$/;
  var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;
  // KeyboardEvent.keyCode aliases
  var keyCodes = {
      esc: 27,
      tab: 9,
      enter: 13,
      space: 32,
      up: 38,
      left: 37,
      right: 39,
      down: 40,
      delete: [8, 46],
  };
  // KeyboardEvent.key aliases
  var keyNames = {
      // #7880: IE11 and Edge use `Esc` for Escape key name.
      esc: ['Esc', 'Escape'],
      tab: 'Tab',
      enter: 'Enter',
      // #9112: IE11 uses `Spacebar` for Space key name.
      space: [' ', 'Spacebar'],
      // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
      up: ['Up', 'ArrowUp'],
      left: ['Left', 'ArrowLeft'],
      right: ['Right', 'ArrowRight'],
      down: ['Down', 'ArrowDown'],
      // #9112: IE11 uses `Del` for Delete key name.
      delete: ['Backspace', 'Delete', 'Del'],
  };
  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };
  var modifierCode = {
      stop: '$event.stopPropagation();',
      prevent: '$event.preventDefault();',
      self: genGuard("$event.target !== $event.currentTarget"),
      ctrl: genGuard("!$event.ctrlKey"),
      shift: genGuard("!$event.shiftKey"),
      alt: genGuard("!$event.altKey"),
      meta: genGuard("!$event.metaKey"),
      left: genGuard("'button' in $event && $event.button !== 0"),
      middle: genGuard("'button' in $event && $event.button !== 1"),
      right: genGuard("'button' in $event && $event.button !== 2"),
  };
  function genHandlers(events, isNative) {
      var prefix = isNative ? 'nativeOn:' : 'on:';
      var staticHandlers = "";
      var dynamicHandlers = "";
      for (var name in events) {
          var handlerCode = genHandler(events[name]);
          //@ts-expect-error
          if (events[name] && events[name].dynamic) {
              dynamicHandlers += name + "," + handlerCode + ",";
          }
          else {
              staticHandlers += "\"" + name + "\":" + handlerCode + ",";
          }
      }
      staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
      if (dynamicHandlers) {
          return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])";
      }
      else {
          return prefix + staticHandlers;
      }
  }
  function genHandler(handler) {
      if (!handler) {
          return 'function(){}';
      }
      if (Array.isArray(handler)) {
          return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]");
      }
      var isMethodPath = simplePathRE.test(handler.value);
      var isFunctionExpression = fnExpRE.test(handler.value);
      var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));
      if (!handler.modifiers) {
          if (isMethodPath || isFunctionExpression) {
              return handler.value;
          }
          return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}"); // inline statement
      }
      else {
          var code = '';
          var genModifierCode = '';
          var keys = [];
          for (var key in handler.modifiers) {
              if (modifierCode[key]) {
                  genModifierCode += modifierCode[key];
                  // left/right
                  if (keyCodes[key]) {
                      keys.push(key);
                  }
              }
              else if (key === 'exact') {
                  var modifiers = handler.modifiers;
                  genModifierCode += genGuard(['ctrl', 'shift', 'alt', 'meta']
                      .filter(function (keyModifier) { return !modifiers[keyModifier]; })
                      .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
                      .join('||'));
              }
              else {
                  keys.push(key);
              }
          }
          if (keys.length) {
              code += genKeyFilter(keys);
          }
          // Make sure modifiers like prevent and stop get executed after key filtering
          if (genModifierCode) {
              code += genModifierCode;
          }
          var handlerCode = isMethodPath
              ? ("return " + (handler.value) + ".apply(null, arguments)")
              : isFunctionExpression
                  ? ("return (" + (handler.value) + ").apply(null, arguments)")
                  : isFunctionInvocation
                      ? ("return " + (handler.value))
                      : handler.value;
          return ("function($event){" + code + handlerCode + "}");
      }
  }
  function genKeyFilter(keys) {
      return (
      // make sure the key filters only apply to KeyboardEvents
      // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
      // key events that do not have keyCode property...
      "if(!$event.type.indexOf('key')&&" +
          (keys.map(genFilterCode).join('&&')) + ")return null;");
  }
  function genFilterCode(key) {
      var keyVal = parseInt(key, 10);
      if (keyVal) {
          return ("$event.keyCode!==" + keyVal);
      }
      var keyCode = keyCodes[key];
      var keyName = keyNames[key];
      return ("_k($event.keyCode," +
          (JSON.stringify(key)) + "," +
          (JSON.stringify(keyCode)) + "," +
          "$event.key," +
          "" + (JSON.stringify(keyName)) +
          ")");
  }

  /**
   * 给元素绑定一个方法
   * @date 2020-01-09
   * @export
   * @param {ASTElement} el
   * @param {ASTDirective} dir
   */
  function on(el, dir) {
      if (dir.modifiers) {
          warn$2("v-on without argument does not support modifiers.");
      }
      el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
  }

  /**
   * 给传入的标签绑一个方法
   * 该方法返回一个字符串
   * @date 2020-01-09
   * @export
   * @param {ASTElement} el
   * @param {ASTDirective} dir
   */
  function bind(el, dir) {
      el.wrapData = function (code) {
          return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")");
      };
  }

  var baseDirectives = {
      on: on,
      bind: bind,
      cloak: noop,
  };

  var CodegenState = function CodegenState(options) {
      this.options = options;
      this.warn = options.warn || baseWarn;
      //@ts-expect-error `this.transforms ` is a different type than `options.modules.transformCode`
      this.transforms = pluckModuleFunction(options.modules, 'transformCode');
      this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
      this.directives = extend(extend({}, baseDirectives), options.directives);
      var isReservedTag = options.isReservedTag || no;
      this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
      this.onceId = 0;
      this.staticRenderFns = [];
      this.pre = false;
  };
  function generate(ast, options) {
      var state = new CodegenState(options);
      // fix #11483, Root level <script> tags should not be rendered.
      //核心部分，生成render表达式字符串主体
      var code = ast
          ? ast.tag === 'script'
              ? 'null'
              : genElement(ast, state)
          : '_c("div")';
      return {
          //最外层用with(this)包裹
          render: ("with(this){return " + code + "}"),
          //被标记为 staticRoot 节点的 VNode 就会单独生成 staticRenderFns
          staticRenderFns: state.staticRenderFns,
      };
  }
  /**
   * 生成createElement的参数字符串
   *
   * @date 2020-05-04
   * @export
   * @param {ASTElement} el
   * @param {CodegenState} state
   * @returns {string}
   */
  function genElement(el, state) {
      if (el.parent) {
          el.pre = el.pre || el.parent.pre;
      }
      // 对一些标签属性进行处理
      if (el.staticRoot && !el.staticProcessed) {
          // 静态的根节点
          return genStatic(el, state);
      }
      else if (el.once && !el.onceProcessed) {
          return genOnce(el, state);
      }
      else if (el.for && !el.forProcessed) {
          return genFor(el, state);
      }
      else if (el.if && !el.ifProcessed) {
          return genIf(el, state);
      }
      else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
          return genChildren(el, state) || 'void 0';
      }
      else if (el.tag === 'slot') {
          return genSlot(el, state);
      }
      else {
          // component or element
          var code;
          //组件的处理
          if (el.component) {
              code = genComponent(el.component, el, state);
          }
          else {
              //核心的body部分
              //1、生成节点的数据对象data的字符串
              var data;
              if (!el.plain || (el.pre && state.maybeComponent(el))) {
                  data = genData(el, state);
              }
              //2、查找其子节点,生成子节点的字符串
              var children = el.inlineTemplate ? null : genChildren(el, state, true);
              //3、将tag，data，children拼装成字符串
              code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
          }
          // module transforms
          for (var i = 0; i < state.transforms.length; i++) {
              code = state.transforms[i](el, code);
          }
          return code;
      }
  }
  // hoist static sub-trees out
  function genStatic(el, state) {
      el.staticProcessed = true;
      // Some elements (templates) need to behave differently inside of a v-pre
      // node.  All pre nodes are static roots, so we can use this as a location to
      // wrap a state change and reset it upon exiting the pre node.
      var originalPreState = state.pre;
      if (el.pre) {
          state.pre = el.pre;
      }
      state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
      state.pre = originalPreState;
      return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")");
  }
  // v-once
  function genOnce(el, state) {
      el.onceProcessed = true;
      if (el.if && !el.ifProcessed) {
          return genIf(el, state);
      }
      else if (el.staticInFor) {
          var key = '';
          var parent = el.parent;
          while (parent) {
              if (parent.for) {
                  key = parent.key;
                  break;
              }
              parent = parent.parent;
          }
          if (!key) {
              state.warn("v-once can only be used inside v-for that is keyed. ", el.rawAttrsMap['v-once']);
              return genElement(el, state);
          }
          return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")");
      }
      else {
          return genStatic(el, state);
      }
  }
  /**
   * 针对v-if节点生成render表达式
   *
   * @date 2020-05-04
   * @export
   * @param {*} el
   * @param {CodegenState} state
   * @param {Function} [altGen]
   * @param {string} [altEmpty]
   * @returns {string}
   */
  function genIf(el, state, altGen, altEmpty) {
      el.ifProcessed = true; // avoid recursion 同样的，打个标记表示该节点已经被处理过了
      return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
  }
  /**
   * 针对v-if节点生成render表达式
   * @date 2020-05-05
   * @param {ASTIfConditions} conditions
   * @param {CodegenState} state
   * @param {Function} [altGen]
   * @param {string} [altEmpty]
   * @returns {string}
   */
  function genIfConditions(conditions, state, altGen, altEmpty) {
      // 如果没有表达式，直接使用普通的_e
      if (!conditions.length) {
          return altEmpty || '_e()';
      }
      //对于多个condition，将调用genIfConditions进行递归生成二元表达式
      var condition = conditions.shift();
      if (condition.exp) {
          //生成本次条件的二元表达式
          return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block
          // 递归生成后续的二元表达式
          )) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)));
      }
      else {
          return ("" + (genTernaryExp(condition.block)));
      }
      // v-if with v-once should generate code like (a)?_m(0):_m(1)
      function genTernaryExp(el) {
          return altGen
              ? altGen(el, state)
              : el.once
                  ? genOnce(el, state)
                  : genElement(el, state);
      }
  }
  /**
   * 针对包含v-for属性的标签，将调用该方法生成render表达式
   *
   * @date 2020-05-04
   * @export
   * @param {*} el
   * @param {CodegenState} state
   * @param {Function} [altGen]
   * @param {string} [altHelper]
   * @returns {string}
   */
  function genFor(el, state, altGen, altHelper) {
      var exp = el.for;
      var alias = el.alias;
      var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
      var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
      if (state.maybeComponent(el) &&
          el.tag !== 'slot' &&
          el.tag !== 'template' &&
          !el.key) {
          state.warn("<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
              "v-for should have explicit keys. " +
              "See https://vuejs.org/guide/list.html#key for more info.", el.rawAttrsMap['v-for'], true /* tip */);
      }
      //1、标记已处理，防止进入死循环
      el.forProcessed = true; // avoid recursion
      //2、function...return...包裹字符串，调用genElement继续节点字符串生成
      return ((altHelper || '_l') + "((" + exp + ")," +
          "function(" + alias + iterator1 + iterator2 + "){" +
          "return " + ((altGen || genElement)(el, state)) +
          '})');
  }
  function genData(el, state) {
      var data = '{';
      // directives first.
      // directives may mutate the el's other properties before they are generated.
      var dirs = genDirectives(el, state);
      if (dirs)
          { data += dirs + ','; }
      // key
      if (el.key) {
          data += "key:" + (el.key) + ",";
      }
      // ref
      if (el.ref) {
          data += "ref:" + (el.ref) + ",";
      }
      if (el.refInFor) {
          data += "refInFor:true,";
      }
      // pre
      if (el.pre) {
          data += "pre:true,";
      }
      // record original tag name for components using "is" attribute
      if (el.component) {
          data += "tag:\"" + (el.tag) + "\",";
      }
      // module data generation functions
      for (var i = 0; i < state.dataGenFns.length; i++) {
          data += state.dataGenFns[i](el);
      }
      // attributes
      if (el.attrs) {
          data += "attrs:" + (genProps(el.attrs)) + ",";
      }
      // DOM props
      if (el.props) {
          data += "domProps:" + (genProps(el.props)) + ",";
      }
      // event handlers
      if (el.events) {
          data += (genHandlers(el.events, false)) + ",";
      }
      if (el.nativeEvents) {
          data += (genHandlers(el.nativeEvents, true)) + ",";
      }
      // slot target
      // only for non-scoped slots
      if (el.slotTarget && !el.slotScope) {
          data += "slot:" + (el.slotTarget) + ",";
      }
      // scoped slots
      if (el.scopedSlots) {
          data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
      }
      // component v-model
      if (el.model) {
          data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
      }
      // inline-template
      if (el.inlineTemplate) {
          var inlineTemplate = genInlineTemplate(el, state);
          if (inlineTemplate) {
              data += inlineTemplate + ",";
          }
      }
      data = data.replace(/,$/, '') + '}';
      // v-bind dynamic argument wrap
      // v-bind with dynamic arguments must be applied using the same v-bind object
      // merge helper so that class/style/mustUseProp attrs are handled correctly.
      if (el.dynamicAttrs) {
          data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
      }
      // v-bind data wrap
      if (el.wrapData) {
          data = el.wrapData(data);
      }
      // v-on data wrap
      if (el.wrapListeners) {
          data = el.wrapListeners(data);
      }
      return data;
  }
  function genDirectives(el, state) {
      var dirs = el.directives;
      if (!dirs)
          { return; }
      var res = 'directives:[';
      var hasRuntime = false;
      var i, l, dir, needRuntime;
      for (i = 0, l = dirs.length; i < l; i++) {
          dir = dirs[i];
          needRuntime = true;
          var gen = state.directives[dir.name];
          if (gen) {
              // compile-time directive that manipulates AST.
              // returns true if it also needs a runtime counterpart.
              needRuntime = !!gen(el, dir, state.warn);
          }
          if (needRuntime) {
              hasRuntime = true;
              res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value
                  ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value)))
                  : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
          }
      }
      if (hasRuntime) {
          return res.slice(0, -1) + ']';
      }
  }
  function genInlineTemplate(el, state) {
      var ast = el.children[0];
      if ((el.children.length !== 1 || ast.type !== 1)) {
          state.warn('Inline-template components must have exactly one child element.', { start: el.start });
      }
      if (ast && ast.type === 1) {
          var inlineRenderFns = generate(ast, state.options);
          return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns
              .map(function (code) { return ("function(){" + code + "}"); })
              .join(',')) + "]}");
      }
  }
  function genScopedSlots(el, slots, state) {
      // by default scoped slots are considered "stable", this allows child
      // components with only scoped slots to skip forced updates from parent.
      // but in some cases we have to bail-out of this optimization
      // for example if the slot contains dynamic names, has v-if or v-for on them...
      var needsForceUpdate = el.for ||
          Object.keys(slots).some(function (key) {
              var slot = slots[key];
              return (slot.slotTargetDynamic || slot.if || slot.for || containsSlotChild(slot) // is passing down slot from parent which may be dynamic
              );
          });
      // #9534: if a component with scoped slots is inside a conditional branch,
      // it's possible for the same component to be reused but with different
      // compiled slot content. To avoid that, we generate a unique key based on
      // the generated code of all the slot contents.
      var needsKey = !!el.if;
      // OR when it is inside another scoped slot or v-for (the reactivity may be
      // disconnected due to the intermediate scope variable)
      // #9438, #9506
      // TODO: this can be further optimized by properly analyzing in-scope bindings
      // and skip force updating ones that do not actually use scope variables.
      if (!needsForceUpdate) {
          var parent = el.parent;
          while (parent) {
              if ((parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
                  parent.for) {
                  needsForceUpdate = true;
                  break;
              }
              if (parent.if) {
                  needsKey = true;
              }
              parent = parent.parent;
          }
      }
      var generatedSlots = Object.keys(slots)
          .map(function (key) { return genScopedSlot(slots[key], state); })
          .join(',');
      return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")");
  }
  function hash(str) {
      var hash = 5381;
      var i = str.length;
      while (i) {
          hash = (hash * 33) ^ str.charCodeAt(--i);
      }
      return hash >>> 0;
  }
  function containsSlotChild(el) {
      if (el.type === 1) {
          if (el.tag === 'slot') {
              return true;
          }
          return el.children.some(containsSlotChild);
      }
      return false;
  }
  function genScopedSlot(el, state) {
      var isLegacySyntax = el.attrsMap['slot-scope'];
      if (el.if && !el.ifProcessed && !isLegacySyntax) {
          return genIf(el, state, genScopedSlot, "null");
      }
      if (el.for && !el.forProcessed) {
          return genFor(el, state, genScopedSlot);
      }
      var slotScope = el.slotScope === emptySlotScopeToken ? "" : String(el.slotScope);
      var fn = "function(" + slotScope + "){" +
          "return " + (el.tag === 'template'
              ? el.if && isLegacySyntax
                  ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
                  : genChildren(el, state) || 'undefined'
              : genElement(el, state)) + "}";
      // reverse proxy v-slot without scope on this.$slots
      var reverseProxy = slotScope ? "" : ",proxy:true";
      return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}");
  }
  /**
   * 生成子节点字符串
   *
   * @date 2020-05-04
   * @export
   * @param {ASTElement} el
   * @param {CodegenState} state
   * @param {boolean} [checkSkip]
   * @param {Function} [altGenElement]
   * @param {Function} [altGenNode]
   * @returns {(string | void)}
   */
  function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
      var children = el.children;
      if (children.length) {
          var el$1 = children[0];
          // optimize single v-for
          if (children.length === 1 &&
              el$1.for &&
              el$1.tag !== 'template' &&
              el$1.tag !== 'slot') {
              var normalizationType = checkSkip
                  ? state.maybeComponent(el$1)
                      ? ",1"
                      : ",0"
                  : "";
              return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType);
          }
          var normalizationType$1 = checkSkip
              ? getNormalizationType(children, state.maybeComponent)
              : 0;
          var gen = altGenNode || genNode;
          //拼装子节点的字符串
          return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''));
      }
  }
  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType(children, maybeComponent) {
      var res = 0;
      for (var i = 0; i < children.length; i++) {
          var el = children[i];
          if (el.type !== 1) {
              continue;
          }
          if (needsNormalization(el) ||
              (el.ifConditions &&
                  el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
              res = 2;
              break;
          }
          if (maybeComponent(el) ||
              (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
              res = 1;
          }
      }
      return res;
  }
  function needsNormalization(el) {
      return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
  }
  /**
   * 生成节点字符串
   * 节点可以是element or comment or test
   */
  function genNode(node, state) {
      if (node.type === 1) {
          return genElement(node, state);
      }
      else if (node.type === 3 && node.isComment) {
          return genComment(node);
      }
      else {
          return genText(node);
      }
  }
  function genText(text) {
      return ("_v(" + (text.type === 2
          ? text.expression // no need for () because already wrapped in _s()
          : transformSpecialNewlines(JSON.stringify(text.text))) + ")");
  }
  function genComment(comment) {
      return ("_e(" + (JSON.stringify(comment.text)) + ")");
  }
  function genSlot(el, state) {
      var slotName = el.slotName || '"default"';
      var children = genChildren(el, state);
      var res = "_t(" + slotName + (children ? ("," + children) : '');
      var attrs = el.attrs || el.dynamicAttrs
          ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
              // slot props are camelized
              name: camelize(attr.name),
              value: attr.value,
              dynamic: attr.dynamic,
          }); }))
          : null;
      var bind = el.attrsMap['v-bind'];
      if ((attrs || bind) && !children) {
          res += ",null";
      }
      if (attrs) {
          res += "," + attrs;
      }
      if (bind) {
          res += (attrs ? '' : ',null') + "," + bind;
      }
      return res + ')';
  }
  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent(componentName, el, state) {
      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      return ("_c(" + componentName + "," + (genData(el, state)) + (children ? ("," + children) : '') + ")");
  }
  function genProps(props) {
      var staticProps = "";
      var dynamicProps = "";
      for (var i = 0; i < props.length; i++) {
          var prop = props[i];
          var value = transformSpecialNewlines(prop.value);
          if (prop.dynamic) {
              dynamicProps += (prop.name) + "," + value + ",";
          }
          else {
              staticProps += "\"" + (prop.name) + "\":" + value + ",";
          }
      }
      staticProps = "{" + (staticProps.slice(0, -1)) + "}";
      if (dynamicProps) {
          return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])");
      }
      else {
          return staticProps;
      }
  }
  // #3895, #4268
  function transformSpecialNewlines(text) {
      return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }

  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp('\\b' +
      ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
          'super,throw,while,yield,delete,export,import,return,switch,default,' +
          'extends,finally,continue,debugger,function,arguments')
          .split(',')
          .join('\\b|\\b') +
      '\\b');
  // these unary operators should not be used as property/method names
  var unaryOperatorsRE = new RegExp('\\b' +
      'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') +
      '\\s*\\([^\\)]*\\)');
  // strip strings in expressions
  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
  // detect problematic expressions in a template
  function detectErrors(ast, warn) {
      if (ast) {
          checkNode(ast, warn);
      }
  }
  function checkNode(node, warn) {
      if (node.type === 1) {
          for (var name in node.attrsMap) {
              if (dirRE.test(name)) {
                  var value = node.attrsMap[name];
                  if (value) {
                      var range = node.rawAttrsMap[name];
                      if (name === 'v-for') {
                          checkFor(node, ("v-for=\"" + value + "\""), warn, range);
                      }
                      else if (name === 'v-slot' || name[0] === '#') {
                          checkFunctionParameterExpression(value, (name + "=\"" + value + "\""), warn, range);
                      }
                      else if (onRE.test(name)) {
                          checkEvent(value, (name + "=\"" + value + "\""), warn, range);
                      }
                      else {
                          checkExpression(value, (name + "=\"" + value + "\""), warn, range);
                      }
                  }
              }
          }
          if (node.children) {
              for (var i = 0; i < node.children.length; i++) {
                  checkNode(node.children[i], warn);
              }
          }
      }
      else if (node.type === 2) {
          checkExpression(node.expression, node.text, warn, node);
      }
  }
  function checkEvent(exp, text, warn, range) {
      var stripped = exp.replace(stripStringRE, '');
      var keywordMatch = stripped.match(unaryOperatorsRE);
      if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
          warn("avoid using JavaScript unary operator as property name: " +
              "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()), range);
      }
      checkExpression(exp, text, warn, range);
  }
  function checkFor(node, text, warn, range) {
      checkExpression(node.for || '', text, warn, range);
      checkIdentifier(node.alias, 'v-for alias', text, warn, range);
      checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
      checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
  }
  function checkIdentifier(ident, type, text, warn, range) {
      if (typeof ident === 'string') {
          try {
              new Function(("var " + ident + "=_"));
          }
          catch (e) {
              warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
          }
      }
  }
  function checkExpression(exp, text, warn, range) {
      try {
          new Function(("return " + exp));
      }
      catch (e) {
          var keywordMatch = exp
              .replace(stripStringRE, '')
              .match(prohibitedKeywordRE);
          if (keywordMatch) {
              warn("avoid using JavaScript keyword as property name: " +
                  "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()), range);
          }
          else {
              warn("invalid expression: " + (e.message) + " in\n\n" +
                  "    " + exp + "\n\n" +
                  "  Raw expression: " + (text.trim()) + "\n", range);
          }
      }
  }
  function checkFunctionParameterExpression(exp, text, warn, range) {
      try {
          new Function(exp, '');
      }
      catch (e) {
          warn("invalid function parameter expression: " + (e.message) + " in\n\n" +
              "    " + exp + "\n\n" +
              "  Raw expression: " + (text.trim()) + "\n", range);
      }
  }

  var range = 2;
  function generateCodeFrame(source, start, end) {
      if ( start === void 0 ) start = 0;
      if ( end === void 0 ) end = source.length;

      var lines = source.split(/\r?\n/);
      var count = 0;
      var res = [];
      for (var i = 0; i < lines.length; i++) {
          count += lines[i].length + 1;
          if (count >= start) {
              for (var j = i - range; j <= i + range || end > count; j++) {
                  if (j < 0 || j >= lines.length)
                      { continue; }
                  res.push(("" + (j + 1) + (repeat(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
                  var lineLength = lines[j].length;
                  if (j === i) {
                      // push underline
                      var pad = start - (count - lineLength) + 1;
                      var length = end > count ? lineLength - pad : end - start;
                      res.push("   |  " + repeat(" ", pad) + repeat("^", length));
                  }
                  else if (j > i) {
                      if (end > count) {
                          var length$1 = Math.min(end - count, lineLength);
                          res.push("   |  " + repeat("^", length$1));
                      }
                      count += lineLength + 1;
                  }
              }
              break;
          }
      }
      return res.join('\n');
  }
  function repeat(str, n) {
      var result = '';
      if (n > 0) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
              // eslint-disable-line
              if (n & 1)
                  { result += str; }
              n >>>= 1;
              if (n <= 0)
                  { break; }
              str += str;
          }
      }
      return result;
  }

  function createFunction(code, errors) {
      try {
          return new Function(code);
      }
      catch (err) {
          errors.push({ err: err, code: code });
          return noop;
      }
  }
  /**
   *
   *
   * @date 07/05/2021
   * @export
   * @param {Function} compile
   * @return {*}  {Function}
   */
  function createCompileToFunctionFn(compile) {
      var cache = Object.create(null);
      return function compileToFunctions(template, options, vm) {
          // 复制一份options
          options = extend({}, options);
          var warn = options.warn || warn$2;
          delete options.warn;
          /* istanbul ignore if */
          {
              // detect possible CSP restriction
              try {
                  // 这里主要是为了测试能否使用new Function
                  // 严格模式下是不行的
                  new Function('return 1');
              }
              catch (e) {
                  if (e.toString().match(/unsafe-eval|CSP/)) {
                      warn('It seems you are using the standalone build of Vue.js in an ' +
                          'environment with Content Security Policy that prohibits unsafe-eval. ' +
                          'The template compiler cannot work in this environment. Consider ' +
                          'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                          'templates into render functions.');
                  }
              }
          }
          // check cache
          var key = options.delimiters
              // String(options.delimiters) = String(['${', '}']) = "${,}"
              ? String(options.delimiters) + template
              : template;
          // 检查是否有缓存, 有缓存直接使用
          if (cache[key]) {
              return cache[key];
          }
          // 解析
          var compiled = compile(template, options);
          // check compilation errors/tips
          // 各种提示和警告
          {
              if (compiled.errors && compiled.errors.length) {
                  if (options.outputSourceRange) {
                      compiled.errors.forEach(function (e) {
                          warn("Error compiling template:\n\n" + (e.msg) + "\n\n" +
                              generateCodeFrame(template, e.start, e.end), vm);
                      });
                  }
                  else {
                      warn("Error compiling template:\n\n" + template + "\n\n" +
                          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') +
                          '\n', vm);
                  }
              }
              if (compiled.tips && compiled.tips.length) {
                  if (options.outputSourceRange) {
                      compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
                  }
                  else {
                      compiled.tips.forEach(function (msg) { return tip(msg, vm); });
                  }
              }
          }
          // turn code into functions
          // 把compiled的返回值转成函数
          var res = {};
          var fnGenErrors = [];
          res.render = createFunction(compiled.render, fnGenErrors);
          res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
              return createFunction(code, fnGenErrors);
          });
          // check function generation errors.
          // this should only happen if there is a bug in the compiler itself.
          // mostly for codegen development use
          /* istanbul ignore if */
          // 错误处理
          {
              if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                  warn("Failed to generate render function:\n\n" +
                      fnGenErrors
                          .map(function (ref) {
                              var err = ref.err;
                              var code = ref.code;

                              return ((err.toString()) + " in\n\n" + code + "\n");
                  })
                          .join('\n'), vm);
              }
          }
          return (cache[key] = res);
      };
  }

  /**
   * createCompiler函数的创建函数
   * 这么写主要原因是需要区分不同环境
   * 比如浏览器和SSR就是不同的baseCompile
   *
   * @date 05/05/2021
   * @export
   * @param {Function} baseCompile
   * @return {*}  {Function}
   */
  function createCompilerCreator(baseCompile) {
      return function createCompiler(baseOptions) {
          /**
           * 1.组装finalOptions，需要将内置的modules、directives合并进来
           *
           * @date 05/05/2021
           * @param {string} template
           * @param {CompilerOptions} [options]
           * @return {*}  {CompiledResult}
           */
          function compile(template, options) {
              // 以baseOptions为原型做个对象
              var finalOptions = Object.create(baseOptions);
              var errors = [];
              var tips = [];
              var warn = function (msg, range, tip) {
                  (tip ? tips : errors).push(msg);
              };
              if (options) {
                  if (options.outputSourceRange) {
                      // $flow-disable-line
                      // 主要空格长度 
                      // \s匹配看不见的字符
                      var leadingSpaceLength = template.match(/^\s*/)[0].length;
                      warn = function (msg, range, tip) {
                          var data = { msg: msg };
                          if (range) {
                              if (range.start != null) {
                                  data.start = range.start + leadingSpaceLength;
                              }
                              if (range.end != null) {
                                  data.end = range.end + leadingSpaceLength;
                              }
                          }
                          (tip ? tips : errors).push(data);
                      };
                  }
                  // merge custom modules
                  // modules数组合并
                  if (options.modules) {
                      finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
                  }
                  // merge custom directives
                  // 指令合并
                  if (options.directives) {
                      finalOptions.directives = extend(Object.create(baseOptions.directives || null), options.directives);
                  }
                  // copy other options
                  // 剩余的选项复制过来
                  for (var key in options) {
                      if (key !== 'modules' && key !== 'directives') {
                          finalOptions[key] = options[key];
                      }
                  }
              }
              finalOptions.warn = warn;
              // 真正实现编译的核心代码
              // baseCompile返回
              // {
              //   ast,
              //   render: code.render,
              //   staticRenderFns: code.staticRenderFns,
              // }
              var compiled = baseCompile(template.trim(), finalOptions);
              {
                  detectErrors(compiled.ast, warn);
              }
              compiled.errors = errors;
              compiled.tips = tips;
              return compiled;
          }
          return {
              compile: compile,
              compileToFunctions: createCompileToFunctionFn(compile),
          };
      };
  }

  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  // “createCompilerCreator”允许创建使用替代解析器/优化器/codegen的编译器
  // e.g. SSR优化编译器。
  // 这里我们只是使用默认部分导出一个默认编译器。
  var createCompiler = createCompilerCreator(function baseCompile(template, options) {
      // 1、parse，将templat转成AST模型
      var ast = parse(template.trim(), options);
      // 2、optimize为true则会进行优化，主要就是标注静态节点
      // 静态节点就是那些永远不会变化的节点
      // 重新渲染时，作为常量，无需创建新节点
      if (options.optimize !== false) {
          optimize(ast, options);
      }
      // 3、generate，用AST生成render表达式
      var code = generate(ast, options);
      return {
          ast: ast,
          render: code.render,
          staticRenderFns: code.staticRenderFns, // string[]
      };
  });

  var ref = createCompiler(baseOptions);
  var compileToFunctions = ref.compileToFunctions;

  // check whether current browser encodes a char inside attribute values
  var div;
  function getShouldDecode(href) {
      div = div || document.createElement('div');
      div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
      return div.innerHTML.indexOf('&#10;') > 0;
  }
  // #3663: IE encodes newlines inside attribute values while other browsers don't
  var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
  // #6828: chrome encodes content in a[href]
  var shouldDecodeNewlinesForHref = inBrowser
      ? getShouldDecode(true)
      : false;

  /**
   * 传入id查找dom，返回并缓存id内部dom
   */
  var idToTemplate = cached(function (id) {
      var el = query(id);
      return el && el.innerHTML;
  });
  // 将在src/platforms/web/runtime/index.js中定义的$mount方法缓存起来
  var mount = Vue.prototype.$mount;
  /**
   * 重新定义$mount
   * 根据el或者template，获取到html的字符串
   * 将字符串转成render函数表达式
   * @returns {Component} 返回vue实例
   */
  Vue.prototype.$mount = function (el, hydrating // 服务端渲染相关
  ) {
      // 根据id获取dom元素
      el = el && query(el);
      /* istanbul ignore if */
      if (el === document.body || el === document.documentElement) {
          // 如果是body或者根节点（html节点）就报错
          warn$2("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
          // 返回vue实例
          return this;
      }
      // $options vue实例的初始化选项
      var options = this.$options;
      // 解析template，转换成render函数
      // 如果是根据template/el，获取html的字符串的情况
      // 就没有render
      if (!options.render) {
          // 获取template
          var template = options.template;
          if (template) {
              // 如果定义了template
              if (typeof template === 'string') {
                  // 如果给的是字符串
                  // `
                  //   <div class="demo-alert-box">
                  //     <strong>Error!</strong>
                  //     <slot></slot>
                  //   </div>
                  // `或
                  // `#app`
                  if (template.charAt(0) === '#') {
                      // 如果值以 # 开始，则它将被用作选择符，并使用匹配元素的 innerHTML 作为模板
                      template = idToTemplate(template);
                      /* istanbul ignore if */
                      if (!template) {
                          warn$2(("Template element not found or is empty: " + (options.template)), this);
                      }
                  }
              }
              else if (template.nodeType) {
                  // nodeType：节点类型
                  // 证明template传了个html元素
                  template = template.innerHTML;
              }
              else {
                  // 报错
                  {
                      warn$2('invalid template option:' + template, this);
                  }
                  return this;
              }
          }
          else if (el) {
              // 如果用户没有定义template，直接获取el
              // @ts-expect-error
              template = getOuterHTML(el);
          }
          // 取到template还不算完，
          // 还需要构建render函数
          if (template) {
              /* istanbul ignore if */
              // 性能相关
              if (config.performance && mark) {
                  mark('compile');
              }
              var ref = compileToFunctions(template, {
                  outputSourceRange: "development" !== 'production',
                  shouldDecodeNewlines: shouldDecodeNewlines,
                  shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
                  delimiters: options.delimiters,
                  comments: options.comments, // 是否保留注释
              }, this);
              var render = ref.render;
              var staticRenderFns = ref.staticRenderFns;
              options.render = render;
              options.staticRenderFns = staticRenderFns;
              /* istanbul ignore if */
              // 性能相关
              if (config.performance && mark) {
                  mark('compile end');
                  measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
              }
          }
      }
      // 核心代码
      // 上面的代码核心工作是提供渲染函数
      // 或是用户定义的render选项
      // 或是template或是el
      // 然后去调用刚刚缓存的旧的$mount方法
      return mount.call(this, el, hydrating);
  };
  /**
  * 获取el元素的父级元素
  * 或把el元素放到一个创建的div元素内，返回div元素
  */
  function getOuterHTML(el) {
      if (el.outerHTML) {
          return el.outerHTML;
      }
      else {
          var container = document.createElement('div');
          container.appendChild(el.cloneNode(true));
          return container.innerHTML;
      }
  }
  Vue.compile = compileToFunctions;

  return Vue;

})));
