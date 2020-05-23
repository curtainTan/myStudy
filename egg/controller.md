# controller 控制器

控制器需要做的事情：

1. 获取用户通过 HTTP 传递过来的请求参数
2. 校验、组装参数 -- 可以使用 extend 扩展的各个函数处理
3. 调用 service 处理业务 -- 返回结果，必要时，处理返回结果
4. 将结果响应给用户

尽量将与 HTTP 相关的操作用 controller 处理，让其他操作更单纯

## 获取请求参数

1. 使用 `ctx.query` 获取 get 请求参数
2. 使用 `ctx.queries` 获取重复参数
3. 使用 `ctx.params` 获取动态路由参数
4. 使用 `ctx.request.body` 获取 post 发送的参数

**zhuyi :** `ctx.request.body` 是请求体中的 `body`，`ctx.body` 是 `ctx.response.body` 的简写

## 获取上传文件

框架内置了 `Multipart` 插件支持用户上传文件

1. file 模式：

在 `config` 文件中配置即可：

```js
// config/config.default.js
exports.multipart = {
  mode: 'file',
};

// 在 request 中获取上传文件的信息
// 上传后，可以使用 ctx.request.files[0] 获取缓存文件
// 我们需要 使用fs 模块手动存储，或发送给云端存储
// 处理完成后，我们需要使用 ctx.cleanupRequestFiles() 移除缓存文件
// 如果不移除，每天凌晨 4 点半，自动清除缓存文件
```

2. 使用 `ctx.getFileStream()` 获取上传的文件

## 获取 Header 信息

- `ctx.headers`，`ctx.header`，`ctx.request.headers`，`ctx.request.header`：这几个方法是等价的，都是获取整个 header 对象
- `ctx.get(name)`，`ctx.request.get(name)`：获取请求 header 中的一个字段的值，如果这个字段不存在，会返回空字符串
- 建议用 `ctx.get(name)` 而不是 `ctx.headers['name']`，因为前者会自动处理大小写

## Cookie

```js
// 设置 cookie
ctx.cookies.set('name', 'value', {
  // 过期时间
  expires: new Date(),
  // 保存时间 - s 秒
  maxAge: 60 * 60 * 24,

  // cookie 作用的 url 路径
  path: '/',
  // 指定 前缀 作用域
  domain: '.',

  // 是否跨站
  sameSite: 'none',
  // 是否允许修改
  httpOnly: true,
  // 是否必须使用 https
  secure: false,
  // 是否加密  -- 可加密汉字
  encrypt: true,
  // 签名  --  用户修改过后，服务端不能识别
  signed: true,
});
// 获取 cookie
ctx.cookies.get('name');

// 删除 cookie
ctx.cookies.set('name', null);

// 在 config 中配置 cookie
module.exports = {
  cookies: {
    // httpOnly: true | false,
    // sameSite: 'none|lax|strict',
    // sameSite: 'lax',
  },
};
```

## session

框架内置了 session 插件，我们可以使用 `ctx.session` 来访问或修改用户的 `session`

使用插件同上，只不过增加了两个属性：

```js
// config/config.default.js
module.exports = {
  session: {
    renew: true, // 每次请求都更新时间
    key: 'EGG_SESS', // 承载 Session 的 Cookie 键值对名字
  },
};
```

## 返送 HTTP 响应

1. 通过：`ctx.status = 201` 设置响应状态码
2. 通过 `ctx.boxy = {}` 设置响应体
3. 通过 `ctx.set( key, val )` 设置请求头
