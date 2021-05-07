
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)
// compile 函数生成的是字符串形式的代码，而 compileToFunctions 生成的才是真正可执行的函数

export { compile, compileToFunctions }
