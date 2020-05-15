
# api 一览

## 全局配置

**performance 性能追踪**

设置为 `true` 时，在浏览器的 `performance` 面板中，可以对 组件初始化，编译，渲染 进行性能追踪

## 全局 api

**Vue.extend( option )**

说明：主要搭配 `mixin` 使用

**Vue.nextTick( callback, context )**

说明：下次 DOM 更新完成后执行

**Vue.set( target, propertyName/index, value )**

返回值：返回设置的值

说明：设置 响应式 的值，对数组操作单个元素，对对象添加属性，确保视图更新

**Vue.delete( target, propertyName/index )**

说明：删除对象的属性，数组的元素，确保视图更新

**Vue.direactive( name, [] )**

说明：注册指令

```js
// 全局注册
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 局部注册
var comp = {
    directives: {
        // 指令
        focus: {
            // 在哪个 钩子 函数执行
            inserted: function (el) {
            el.focus()
            }
        }
    }
}
```

**Vue.filter( name, fn )**

说明：注册全局过滤器，获取全局过滤器

```js
// 注册
Vue.filter('my-filter', function (value) {
  // 返回处理后的值
})

// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')
```

**Vue.component( name, { } )**

说明：注册或获取全局组件

**Vue.use( plugin )**

说明：安装 vue.js 插件，如果是对象，必须提供 `install` 方法，需要在 `new Vue()` 之前注册

**Vue.mixin( mixinObj )**

说明：全局注册一个混入，影响注册之后所有创建的 每个 Vue 实例，**不推荐使用**

**Vue.compile( tenplateString )**

说明：将一个模板字符串编译成 `render` 函数

**Vue.observable( obj )**

说明：让一个对象可响应，可用于跨组件存储状态

## 选项 / 数据

1. **data**

组件中，data 只能是 function

说明：不要使用 `_` 和 `$` 命名 data 属性，不会被 vue 实例代理

2. **props**

类型：`Array<string> | Object`

说明：用于接收来自父组件的数据

```js
// 简单语法
Vue.component('props-demo-simple', {
  props: ['size', 'myMessage']
})

// 对象语法，提供验证
Vue.component('props-demo-advanced', {
    props: {
        // 检测类型
        height: Number,
        // 检测类型 + 其他验证
        age: {
            // 类型检测
            type: Number,
            // 默认值
            default: 0,
            // 是否必须传递
            required: true,
            // 验证
            validator: function (value) {
                return value >= 0
            }
        }
    }
})
```

**computed: {}**

说明：计算属性，可以单独设置 `get` 和 `set` 函数

**methods: {}**

说明：`methods` 将被混入到 Vue 实例中，定义指令方法

**注意：** `methods` 属性不能使用 箭头函数，箭头函数的 this 不会指向 Vue 实例，而是指向 当前对象的 外层

[参考案例 与 说明](./第三天/methods-this.html)

**watch: {}**

说明：是键值对，监听 data，methods 中的属性，也可以监听 路由，针对改变执行函数

```js
var vm = new Vue({
    data: {
        a: 1
    }
    watch: {
        a: function( newVal, oldVal ){},
        // 使用 methods 中的方法
        a: "methodsName",
        // 使用对象
        a: {
            handler: function( newVal, oldVal ){},
            // 如果监听对象，属性值改变，不会执行该函数，使用 deep ，属性改变时会调用该函数
            // 数组的 元素 使用 $set 可以直接监听到，不必使用 deep
            // 对象的属性 使用 $set 修改值，不能被监听到，必须使用 deep 属性才能监听到
            deep: true,
            // 回调会在监听开始后，立即被调用
            immediate: true
        },
        // 回调可以是数组，他们会被逐一调用
        a: [
            "methodsName",
            function( val, oldVal ){},
            { handler: function(){} }
        ],
        // 可以监听 对象内 的属性
        "e.f": function( val, oldVal ){}
    }
})
```

**[案例](./第三天/watch.html)**

**注意：** 不要使用箭头函数

## 选项 / 生命周期

**beforeCreate**

实例初始化之后，数据观测（data  observer）和 event/watcher 事件配置之前调用

**created**

实例创建完成后立即被调用，此时，实例已经完成：数据观测（data） property 和 方法 的运算，watch/event 监听事件回调，挂载阶段还没开始，此时 `$el` 不可使用

**beforeMount**

在挂载开始之前调用：相关的 render 函数执行

**mounted**

实例被挂载后调用，这是 `el` 被新创建的 `vm.$el` 替换，不保证所有子组件都被挂载，可以使用 `this.$nextTick` 保证整个视图渲染完毕

**beforeUpdate**

数据更新时调用，在这里适合在视图更新之前访问现有的 DOM，

**updated**

视图更新完成，DOM 已经更新之后，调用该函数，在此期间可以进行 DOM 操作，如果要改变状态，做好把状态放到 `computed` 和 `watch` 内

**activated**

搭配 `keep-alive` 组件使用，被 `keep-alive` 缓存的组件激活时被调用

**deactivated**

搭配 `keep-alive` 组件使用，当被缓存的组件停用时调用

**beforeDestroy**

实例销毁之前调用，此时，实例 仍然 完全可用

**destroyed**

实例销毁后调用

**errorCaptured**

当不会到一个来自子孙组件的错误时被调用

## 选项/资源

**directives**

自定义 组件内 指令，使用 `Vue.directive( "name", {} )` 定义全局指令

**filters**

组件的过滤器

**components**

局部组件内 注册组件

## 选项 / 其他

**name**

只在作为 组件 时有作用，name 搭配 devtools 时，会显示成组件 name

**functional: boolwan  -false**

使组件无状态（没有 data）和 无实例（没有 this 上下文），使用 `render` 函数返回虚拟节点

**model**

当向 子组件 传递 `v-model` 时，子组件可以使用 `model` 修改指令 和 接收参数（prop）

**comments**

设置为 true，会保留 html 模板中，代码的注释

## 实例 property 属性

通过在 属性前 添加 `$` 符号，访问实例属性。

这些属性有：
1. `this.$data`：访问 data
1. `this.$props`：访问 props
1. `this.$parent`：访问 父节点（实例）
1. `this.$children`：访问 子节点实例
1. `this.$refs`：访问 ref
1. `this.$isServer`：判定是否是服务端渲染
1. `this.$attr`：获取父节点给当前节点设置的 attr 属性，class 和 style 等

## 实例方法 / 事件

1. `vm.$on`：监听事件
1. `vm.$once`：只触发一次事件
1. `vm.$off`：移除事件监听
1. `vm.$emit`：使用 `this.$emit()` 触发实例事件，使用 `Vue.$emit()` 触发 vue 的 `eventBus` 回调

## 实例方法 / 生命周期

1. `this.$forceUpdate()`：强制 实例 重新渲染
2. `this.$nextTick()`：当 dom 渲染完成时调用该方法
3. `this.$destroy()`：让组件销毁

## 指令

1. `v-pre`：跳过这个元素和它的子元素的编译过程
2. `v-once`：元素只渲染一次

## 特使的 attribute

1. `is`：搭配 `<component v-bind:is="currentView"></component>` 生成动态组件



