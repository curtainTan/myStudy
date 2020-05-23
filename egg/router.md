# router 路由

## 路由的详细定义

```js
// 直接匹配路由，处理函数
router.verb('path-match', app.controller.action)
// 给路由定义一个名字
router.verb('router-name', 'path-match', app.controller.action)
// 当前路由使用中间件
router.verb('path-match', middleware1, ..., middlewareN, app.controller.action)
// 使用名字，匹配 url ， 使用中间件，最后到达处理函数
router.verb('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action)
```

**注意：** Controller 支持子目录，在定义路由的时候，可以通过 ${directoryName}.${fileName}.\${functionName} 的方式制定对应的 Controller

## RESTful 风格的 URL 定义

使用 `app.router.resources('routerName', 'pathMatch', controller)` 快速在一个路径上生成 CRUD 路由结构

CRUD 需要配置特定的 函数名，不是很好使用

## 参数获取

```js
// 1. Query String 方式
ctx.body = `search: ${ctx.query.name}`;

// 动态路由
// app/router.js
module.exports = (app) => {
  app.router.get('/user/:id/:name', app.controller.user.info);
};
// app/controller/user.js
exports.info = async (ctx) => {
  ctx.body = `user: ${ctx.params.id}, ${ctx.params.name}`;
};

// 表单内容的获取
// app/router.js
module.exports = (app) => {
  app.router.post('/form', app.controller.form.post);
};
// app/controller/form.js
exports.post = async (ctx) => {
  ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
};
```

## 重定向

```js
// 定义路由重定向
app.router.redirect('/', '/home/index', 302);

// 函数内部重定向
// app/router.js
module.exports = (app) => {
  app.router.get('/search', app.controller.search.index);
};
exports.index = async (ctx) => {
  const type = ctx.query.type;
  const q = ctx.query.q || 'nodejs';

  if (type === 'bing') {
    ctx.redirect(`http://cn.bing.com/search?q=${q}`);
  } else {
    ctx.redirect(`https://www.google.co.kr/search?q=${q}`);
  }
};
```

## 路由映射

手动拆分：

```js
// app/router.js
module.exports = (app) => {
  require('./router/news')(app);
  require('./router/admin')(app);
};

// app/router/news.js
module.exports = (app) => {
  app.router.get('/news/list', app.controller.news.list);
  app.router.get('/news/detail', app.controller.news.detail);
};

// app/router/admin.js
module.exports = (app) => {
  app.router.get('/admin/user', app.controller.admin.user);
  app.router.get('/admin/log', app.controller.admin.log);
};
```

也可以使用插件：egg-router-plus
