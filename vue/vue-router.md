
# vue-router

**案例：**

```js
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义路由组件
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由数组
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 eouter 实例，传入 数组 配置
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 挂载到实例
const app = new Vue({
  router
}).$mount('#app')

```

在组件中，可以使用 `this.$router` 访问路由器，使用 `this.$route` 访问当前路由

## 动态路由与匹配

|匹配|匹配路径|this.$route.params|
|:--|:--|:--|
|user/:username|/suer/tan|{ username: "tan" }|
|user/:username/post/:post_id|/suer/tan/post/123|{ username: "tan", post_id: 123 }|

|匹配|匹配路径|this.$route.query|
|:--|:--|:--|
|/search?label=css|search?label=css|{ label: "css" }|

**监听路由变化**

```js
const User = {
  template: '...',
  watch: {
    // 因为 watch 会被混合到道歉实例上，所以直接监听 this 上的属性："$route"
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}
```

**捕获规则路由和匹配 404 路由**

```js
{
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}

// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```

## 嵌套路由

路由组件搭配 `<router-view></router-view>` 使用

案例：

```js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**注意：** 注意子路由的 `path` 路径编写方式，不要在前面 加 `/` ，会被当做根路径

## 编程式路由导航

主要是讲 路由的两种跳转方式

1. 使用 vue-router 提供的 路由标签 完成跳转
2. 使用 js 的方式完成跳转

|声明式|编程式|
|:--|:--|
|`<router-link :to=".." >`|`this.$router.push(..)`|

**注意：** 路由相关操作都在 `this.$router` 上，而不是在当前路由上 `this.$route`

```js
// 字符串   ---  path
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})


const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```

## 命名路由

使用：在路由跳转时，直接使用 name 指定，不用再编写 `path` 属性，用在路径较复杂的 路由上

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})

router.push({ name: 'user', params: { userId: 123 }})

<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

## 命名视图

**注意：** 使用 `components` 需要加 `s` 

```js
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>

const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

## 重定向和别名

重定向有三种方式：直接路由，对象，方法

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' },
    { path: '/a', redirect: { name: 'foo' }},
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```

别名：`/a` 的别名是 `/b`，当用户访问 `/b` 时，路由匹配的是 `/a`，展示 `/a` 的内容

```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

## 路由组件传参

两种方式可以获取路由中的参数：

1. 通过 `this.$route` 获取当前路由的信息，组件 耦合性 太高，不适合组件复用
2. 通过配置 路由 时，配置 `props` 参数，将 信息放在组件 `props` 上

三种设置 `poprs` 方式：

1. 布尔模式：设置为 布尔值  --  `{ path: '/user/:id', component: User, props: true }`
2. 对象模式：
3. 函数模式：`{ path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }`


# 进阶

## 路由守卫

路由守卫分为两种，一种全局守卫，一种单个路由守卫

1. 全局路由守卫需要在路由配置文件里面设置
2. 单个路由守卫：可以在**组件内** 设置，可以在路由文件里，单个路由的对象里设置

**路由解析过程：**

1. 导航被处罚
2. 在失活的组件里调用离开守卫
3. 调用全局的 `beforeEach` 守卫
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫
5. 在路由配置里调用 `beforeEnter`
6. 解析异步路由组件
7. 在被激活的组件里调用 `beforeRouteEnter`
8. 调用全局的 `beforeResolve` 守卫
9. 导航被确认
10. 调用全局的 `afterEach` 钩子
11. 触发 DOM 更新
12. 创建好的实例中调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数


## 路由元信息

给单个路由 定义 `meta` 字段，可以在 路由守卫 里针对不同的 mate 做不同的事情

## 滚动行为

切换路由时，想要页面滚动到顶部，或者保持原先的滚动位置。

**注意：** 这个功能只在 支持 `history.pushState` 的浏览器中可用

**使用：**  --没有实践

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```

# api 一览

## router-link

1. `to`：到另一个路由的信息
2. `replace`：替换当前路由，在 history 中，替换当前记录
3. `append`：在当前路径前添加 新的 路径
4. `tag`：渲染成何种标签
5. `active-class`：激活时的 css 类名
6. `exact`：精准匹配，只在完全匹配时生效
7. `event`：触发导航的事件  --  默认是 `click`
8. `exact-active-class`：精准匹配的 链接 激活时的 `class`

## router-view

展示视图框，拥有 `name` 属性 则是 命名视图

## Router 构造 对象

**说明：**

```js
// 下面的   ---   就是 VueRouter 传入的对象 
const router = new VueRouter({
  routes: []
})
```

这个对象有如下属性：
1. mode     路由模式
2. routes   配置的路由
3. base     应用的基路径
4. linkActiveClass  全局配置默认激活样式
5. scrollBehavior   滚动行为
6. parseQuery/StringifyQuery    解析与泛解析函数
7. fallback     当浏览器不支持 `history` 模式时路由是否自动回退到 `hash` 模式，默认为 `true`

---

1. `routes` 数组 的 单个对象

```js
interface RouteConfig = {
  path: string,
  component?: Component,
  name?: string, // 命名路由
  components?: { [name: string]: Component }, // 命名视图组件
  redirect?: string | Location | Function,
  props?: boolean | Object | Function,
  alias?: string | Array<string>,
  children?: Array<RouteConfig>, // 嵌套路由
  beforeEnter?: (to: Route, from: Route, next: Function) => void,
  meta?: any,

  // 2.6.0+
  caseSensitive?: boolean, // 匹配规则是否大小写敏感？(默认值：false)
  pathToRegexpOptions?: Object // 编译正则的选项
}
```

## Router 路由实例

路由实例的方法：

1. `this.$router.push`
2. `this.$router.replace`
3. `this.$router.go`
4. `this.$router.back`
5. `this.$router.forwaod`

## Route 当前路由对象

1. `this.$route.path`       当前路径
2. `this.$route.params`     动态路由参数
3. `this.$route.query`      url 查询参数
4. `this.$route.hash`       当前路由的 hash 值
5. `this.$route.fullPath`   包括查询参数 和 hash 的完整路径
6. `this.$route.matched`    数组 -- 嵌套路由记录
7. `this.$route.name`       当前路由的 `name`
8. `this.$route.redirectedFrom` 如果存在重定向，即重定向来源路由的名字


# 总结

路由总共有 三个 概念

1. 路由 DOM  --  `<router-link> <router-view>`
2. 路由构造器 对象
3. router 路由实例
4. route  当前路由信息


