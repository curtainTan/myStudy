

# vue 模板语法(组件)




## 1. 注册组件

全局注册：`Vue.component("my-componetnt", { ... })`

局部注册：

<details>
<summary>案例</summary>

```html
<div id="app">
    <component-a></component-a>
</div>
```

```js
var componentA = {
    data(){
        return {
            count: 10
        }
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
}

new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA
  }
})
```
</details>

**关于命名：**驼峰组件 和 短横线分割组件 都能接受 

例如：`<my-component></my-component>` 或 `<MyComponent></MyComponent>`


## prop 相关

`prop` 接受数据的命名支持 驼峰命名 和 短横线命名 交错使用（html 的 attribute 对大小写不敏感）

`prop` 的接收与类型检测：

可以使用 数组 搭配 字符串对应参数命名 来接收参数

可以使用 对象 搭配 key：参数说明 来接收参数

prop 是单向下行绑定的，只能 父组件 流向 子组件

**props 验证**

type 类型：

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

`null` 和 `undefined` 会通过任何类型的验证

```js
Vue.component('my-component', {
    props: {
        propA: {
            // 定义 类型
            type: [ String, Number ],
            // 是否必填
            required: true,
            // 默认值
            default: 100, // 可以是一个函数，有返回值
            // 自定义验证函数
            validator: function( value ){
                // 返回 布尔值
                return ['success', 'warning', 'danger'].indexOf(value) !== -1
            }
        }
    }
})

```

**注意：** prop 在组件实例 **创建之前** 进行验证

**这里的 attribute 继承不懂----待验证**


**自定义事件**

1. 搭配 `$emit( "event-name", [ props ] )` 定义 父子 事件

2. 自定义组件的 `v-model`

`v-model` 结合了 `v-bind` 和 `v-on` 监听事件 和 双向绑定 值，子组件可以修改这两个属性

```js
<base-checkbox v-model="lovingVue"></base-checkbox>

Vue.component('base-checkbox', {
    model: {
        // 接收命令： 子组件 接收 参数，并修改它们的 值
        prop: 'checked',
        event: 'change'
    },
    // 接收 prop 值
    props: {
        checked: Boolean
    },
    template: `
        <input
        type="checkbox"
        v-bind:checked="checked"
        v-on:change="$emit('change', $event.target.checked)"
        >
    `
})
```

**sync 修饰符**：用来对 `prop`  进行双向绑定，触发的事件必须为：`$emit( "update:属性名"， value )`

**[案例](./第二天/sync.html)**

## 插槽 `v-slot`


使用 `slot` 可以组件标签内的代码，如果组件内没有使用 `slot` 标签，则中间的代码将被抛弃

传入 `slot` 的组件，只能访问外层的数据，不能访问 内层组件 的数据

可以在 `<slot></slot>` 标签内设置默认内容

通过 `<slot name="header"></slot>` 设置 具名 插槽，搭配 `<template v-slot:slot-name >...</template>` 使用

**[案例](./第二天/slot.html)**

作用域插槽：为了让 父组件 提供的 插槽 内容能够使用 子组件的信息，

可以使用 `v-bind` 传递数据给插槽组件，父组件的 `template` 使用 `v-slot` 来接收参数

```html
<!-- 子组件  current-user -->
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>

<!-- 父组件  使用 default 接收参数 -->
<current-user>
    <!-- 在 template 上面接收 参数 -->
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

默认插槽 的 参数获取：

```html
<!-- 在组件上 获取，内部组件 即可 使用 -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

**注意：**默认插槽 与 具名插槽 不能 混用，多个插槽，需要每个插槽单独提供数据

插槽提供的参数 可以使用 解构语法，解构参数 让 prop 写起来更简洁

**具名插槽的缩写：** 使用 ` # ` 号加 `slot-name`

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

## 动态组件 和 异步组件

`keep-alive` : 搭配 `<component :is='' >` 可以完成组件的缓存，路由中，也可以使用


异步组件：使用 函数 异步加载  --> `() => import("./my-component")`

异步组件处理：

```js
const MyComponent = () => ({
    component: import("component")，
    loading: LoadingComponent,
    error: ErrorComponent,
    // 展示组件的延迟事件，默认是 200ms
    delay: 200,
    // 超时，超时时使用 err 组件，默认值是 Infinity 无穷大
    timeout: 3000,
})

```

## 处理边界 ( 有劣势的场景 )

可以使用 `$root` 访问根节点信息

可以使用 `$parent` 访问父节点

可是使用 `$refs.ref-name` 访问子节点实例，也可以访问子节点元素，父子联动

```js
// 父组件
<base-input ref="usernameInput"></base-input>
this.$refs.usernameInput.focus()   // 调用子组件的 focus 方法

// 子组件
<input ref="input">
{
    methods: {
        // 用来从父级组件聚焦输入框
        focus: function () {
            this.$refs.input.focus()
        }
    }
}
```

组件可以使用依赖注入，把需要共享的数据传递给更深的 子组件，这个方式会使组件 耦合，

```js
// 父组件   --   传递
provide: function () {
    // 返回一个对象
    return {
        getMap: this.getMap
    }
}

// 子组件   --  接收
// 直接 获取属性  --  对应的值
inject: ['getMap']

```

使用 `$forceUpdate` 强制更新 


