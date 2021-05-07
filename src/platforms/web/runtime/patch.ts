
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

// nodeOps是关于dom节点的各种操作函数
// modules是各种指令模块导出的以生命周期命名的函数
export const patch: Function = createPatchFunction({ nodeOps, modules })
