
import { extend } from 'shared/util'
import { detectErrors } from './error-detector'
import { createCompileToFunctionFn } from './to-function'

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
export function createCompilerCreator(baseCompile: Function): Function {
  return function createCompiler(baseOptions: CompilerOptions) {
    /**
     * 1.组装finalOptions，需要将内置的modules、directives合并进来
     *
     * @date 05/05/2021
     * @param {string} template
     * @param {CompilerOptions} [options]
     * @return {*}  {CompiledResult}
     */
    function compile(
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      // 以baseOptions为原型做个对象
      const finalOptions = Object.create(baseOptions)
      const errors: WarningMessage[] = []
      const tips: WarningMessage[] = []

      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg)
      }

      if (options) {
        if (
          process.env.NODE_ENV !== 'production' &&
          options.outputSourceRange
        ) {
          // $flow-disable-line
          // 主要空格长度 
          // \s匹配看不见的字符
          const leadingSpaceLength = template.match(/^\s*/)![0].length

          warn = (msg, range, tip) => {
            const data: WarningMessage = { msg }
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength
              }
            }
            (tip ? tips : errors).push(data)
          }
        }
        // merge custom modules
        // modules数组合并
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(
            options.modules
          )
        }
        // merge custom directives
        // 指令合并
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        // 剩余的选项复制过来
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      finalOptions.warn = warn

      // 真正实现编译的核心代码
      // baseCompile返回
      // {
      //   ast,
      //   render: code.render,
      //   staticRenderFns: code.staticRenderFns,
      // }
      const compiled = baseCompile(template.trim(), finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        detectErrors(compiled.ast, warn)
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile),
    }
  }
}
