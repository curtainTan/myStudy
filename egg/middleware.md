# egg 中间件

中间件主要有以下几个知识点：

1. 在 `qpp/middleware` 中 编写 中间件，并定义在项目中
2. 使用中间件
   - 在 `config/config.default.js` 中进行全局配置
   - 在框架中 `` 使用
   - 在路由中单独使用

## 中间件的编写

```js
// app/middleware/gzip.js
const isJSON = require('koa-is-json');
const zlib = require('zlib');

// options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来。
// app: 当前应用 Application 的实例。

module.exports = (options, app) => {
  return async function gzip(ctx, next) {
    await next();

    // 后续中间件执行完成后将响应体转换成 gzip
    let body = ctx.body;
    if (!body) return;

    // 支持 options.threshold
    if (options.threshold && ctx.length < options.threshold) return;

    if (isJSON(body)) body = JSON.stringify(body);

    // 设置 gzip body，修正响应头
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  };
};
```

## 我对中间件的理解

因为 egg 和 koa 都使用的是洋葱模型，所以，中间件可以做两件事情，

1. 对请求参数做处理，或拦截请求，做完后，调用 next() 进行下一步操作
2. 对返回结果做处理，压缩 respose 传回的数据等
