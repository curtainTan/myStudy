
# vue-cli

## 开发 / HTML 和 静态资源

**HTML**
---

**插值**

html 模板中，使用插值

- `<%= VALUE %>` 用来做不转义插值
- `<%- VALUE %>` 用来做 HTML 转义插值
- `<% expression %>` 用来描述 js 流程控制

**preload**

用来指定页面加载后很快会被用到的资源，浏览器开始主题渲染之前尽早 `preload`

默认情况下，一个 Vue CLI 应用会为所有初始化渲染需要的文件自动生成 preload 提示。

`<link rel="preload">`

**prefetch**

`<link rel="prefetch">` 告诉浏览器，在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容

默认情况下，vue-cli 会让 使用 `import()` 懒加载 的代码 自动生成 prefetch

配置案例：

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // 移除 prefetch 插件
    // 移除后，使用 import() 语法引入的代码就是 懒加载 (动态加载)，而非 预加载
    config.plugins.delete('prefetch')

    // 或者
    // 修改它的选项：
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
      return options
    })
  }
}

// 当 prefetch 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```

**注意：** 当应用很大，并且有很多 异步chunk 时，可以关掉 `prefetch`，手动 添加预加载代码块

---

**处理静态资源**

可以使用两种方式处理：

1. 在 JavaScript 被导入或在 template/CSS 中通过相对路径被引用，这类引用会被 webpack 处理
2. 放置在 `public` 目录下或通过绝对路径被引用，这类资源将被直接拷贝，不经过 webpack 处理

第一种方案案例：

```js
<img src="./image.png">
// 会被编译成  --  然后通过 file-loader url-loader 处理
h('img', { attrs: { src: require('./image.png') }})
```

url 转换规则

- 如果 url 是一个绝对路径（`/images/foo.png`）,它将会被保留
- 如果 url 以 `.` 开头，会作为一个相对模块请求被 webpack 解析，且基于文件目录解析文件位置
- 如果以 `~` 开头，内容会被作为模块被解析------（不懂）
- 如果以 `@` 开头，也会作为模块解析，`@` 是 webpack 设定的 路径别名

第二种方案：使用 `public` 文件夹

将静态资源放置在 `public` 文件夹下，通过绝对路径引用

**推荐**

推荐将资源作为 模块 引入，有以下好处：

1. 脚本和样式会被压缩打包在一起，避免额外的网络请求
2. 文件丢失时 在 编译时会报错，避免产生 404 问题
3. 最终生成的文件名包含 hash 内容，不必担心缓存问题

**关于 public**

可以 通过`process.env.BASE_URL` 手动构建这样一个路径

```js
<img :src="`${publicPath}my-image.png`">

data () {
  return {
    publicPath: process.env.BASE_URL
  }
}
```

## webpack 相关

### 基本操作

在根目录创建 `vue.config.js` 配置 webpack 相关内容

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
```

配置 `configureWebpack` 对象，这个对象会被 merge 与默认 webpack 配置合并成一个配置

**警告**

    有些配置，尽量使用 `vue.config.js` 提供的属性配置，vue 会处理配置在多个地方，确保所有部分能正常工作

可以将 config 对象配置成 函数

```js
// vue.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  }
}
```

### 链式操作

`vue.config.js` 内部配置的 webpack 是通过 `webpack-chain` 维护

案例：

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
      // 你还可以再添加一个 loader
      .use('other-loader')
        .loader('other-loader')
        .end()
  }
}
```

## 配置参考

1. publicPath：部署应用包的基本 URL
2. outputDir：打包后文件存放的目录  --  在构建前，目标目录会被清除
3. assetsDir：放置生成的静态资源目录（相对于 `outputDir`）
4. indexPath：指定生成 `index.html` 的输出路径
5. filenameHashing：默认为 `true`，文件名使用 `hash` 模式
6. pages：配置多页应用
7. lintOnSave：默认为 `true`，是否在开发环境下通过 `eslint` 每次保存时 lint 代码
8. runtimeCompiler：
9. transpileDependencies：默认情况下 `babel-loader` 会忽略所有 `node_modules` 的文件，默认配置为 `[]`
10. productionSourceMap：生产环境的 sourcemap 文件
11. crossorigin：
12. integrity：如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性
13. configureWebpack：会通过 `webpack-merge` 与默认配置合并
14. chainWebpack：通过 `webpack-chain` 针对内部配置进行细粒度修改
15. css.requireModuleExtension：设置为 `false`，所有 css 格式文件将被视为 css 模块
16. css.extract：生产环境下为 `true`，是否将 css 提取到一个独立的文件（与 webpack 的功能一致）
17. css.sourceMap：css 的 sourceMap 文件
18. css.loaderOptions：向 CSS 相关的 loader 传递选项
19. devServer：配置开发环境相关  --  与 `webpack-dev-server` 一致
20. parallel：是否为 Babel 或 TypeScript 使用 thread-loader，多线程构建
21. pwa：pwa 选项
22. pluginOptions：
23. babel：可以通过 `babel.config.js` 配置 babel
24. ESLint：可以通过 .eslintrc 或 package.json 中的 eslintConfig 字段来配置
25. TypeScript：可以通过 tsconfig.json 来配置



## vue-cli 命令

1. `vue create [option] <app-name>`     创建一个 vue 项目



1. `create [options] <app-name>`                创建一个 vue 项目
2. `add [options] <plugin> [pluginOptions]`     安装插件并在已创建的项目中调用其生成器
3. `invoke [options] <plugin> [pluginOptions]`  在已创建的项目中调用插件的生成器
4. `inspect [options] [paths...]`               使用vue-clip-service检查项目中的 webpack 配置
5. `serve [options] [entry]`                    运行一个 js 或 vue 文件
6. `build [options] [entry]`                    构建一个 js 或 vue 文件
7. `ui [options]`                               ui 界面开始
8. `init [options] <template> <app-name>`       从远程模板生成项目
9. `config [options] [value]`                   检查并修改配置
10. `outdated [options]`                        检查过时的 vue 配置
11. `upgrade [options] [plugin-name]`           升级 vue-cli 或者 插件
12. `migrate [options] [plugin-name]`           为已经安装的cli插件运行migrator
13. `info`                                      打印有关环境的调试信息



