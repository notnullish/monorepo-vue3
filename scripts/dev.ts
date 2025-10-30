/**
 * 打包开发环境
 *
 * node scripts/dev.ts --format cjs
 */

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { createRequire } from 'node:module'
import * as esbuild from 'esbuild'

/**
 * 解析命令行参数
 */
const {
  values: { format },
  positionals,
} = parseArgs({
  allowPositionals: true, // 位置参数
  options: {
    format: {
      type: 'string', // 类型
      short: 'f', // 别名
      default: 'esm', // 默认值
    },
  },
})

/**
 * 创建 esm 的 __filename
 */
const __filename = fileURLToPath(import.meta.url)
/**
 * 创建 esm 的 __dirname
 */
const __dirname = dirname(__filename)
/**
 * 创建 esm 的 require
 */
const require = createRequire(import.meta.url)
/**
 * 获取入口文件名
 */
const target = positionals.length ? positionals[0] : 'vue'
/**
 * 获取入口文件
 */
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)

/**
 * --format cjs or esm
 * cjs => reactive.cjs.js
 * esm => reactive.esm.js
 * @type {string}
 */
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`,
)
const pkg = require(`../packages/${target}/package.json`)

/**
 * 使用 esbuild 打包
 */
esbuild
  .context({
    entryPoints: [entry], // 人口文件
    outfile, // 输入文件
    format: format as esbuild.Format, // 打包格式
    platform: format === 'cjs' ? 'node' : 'browser', // 打包平台
    sourcemap: true, // 开启 sourcemap 调试
    bundle: true, // 把所有依赖打包到一个文件中
    globalName: pkg.buildOptions.name,
  })
  .then(ctx => ctx.watch())
