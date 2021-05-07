import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";
import type { GlobalAPI } from "typescript/global-api";

function Vue(options) {
  // 对Vue函数没有使用new字符的警告
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }

  // 核心初始化方法
  // 通过initMixin附上
  this._init(options);
}

//@ts-expect-error Vue has function type
initMixin(Vue);
//@ts-expect-error Vue has function type
stateMixin(Vue);
//@ts-expect-error Vue has function type
eventsMixin(Vue);
//@ts-expect-error Vue has function type
lifecycleMixin(Vue);
//@ts-expect-error Vue has function type
renderMixin(Vue);

export default (Vue as unknown) as GlobalAPI;
