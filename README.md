
# vue 学习计划

1. - [x] vue 基础知识
2. - [ ] vue 模板语法(组件)
3. - [ ] vue 组件
4. - [ ] vue 过度组件
5. - [ ] 生命周期详解
5. - [ ] api 一览
6. - [ ] vue-router
7. - [ ] vuex
8. - [ ] MVVM
9. - [ ] vue 源码分析

## 一. vue 基础知识

1. vue 实例

```js
var app = new Vue({
    el: "#app",     // vue 实例挂载的目标元素，vue 会接管这个组件
    data: {         // vue 实例的数据对象
        name: "tan"
    }
})
app.name = "yu"
```

**使用 $ ：为了区别 data 中的属性和 vue 的属性** 

```js
var data = { name: "tan" }
var app = new Vue({
    el: "#app", 
    data: data
})
app.name = "yu"
app.$data === data  // true 可以添加属性
```

2. 模板语法

使用 `{{ data }}` 进行文本插值，使用 `<div v-html="html" ></div>` 进行插入 html 代码

在标签中间，使用双大括号，在变迁内，搭配 vue 指令，直接填写 data 属性 或 computed 属性
```html
<div id="app">
    <h2>{{ name }}</h2>
    <div v-html="myhtml" ></div>
</div>
<script>
    var app = new Vue({
        el: "#app",
        data: {
            name: "tan",
            myhtml: "<div class='box'><h1>我是h1</h1><script>alert(1)<\/script></div>"
        }
    })
</script>
```

使用 vue 指令绑定相关属性，监听事件，设置相关展示特性。

3. vue 实例-计算属性 和 监听

计算属性：抽离 html 模板内 `{{  }}` 中的 js 逻辑

计算属性是基于他们的 响应式依赖进（可变数据，例如 data） 行缓存的

```html
<div id="app">
    <h2>{{ name }}</h2>
    <div>{{ reverseName }}</div>
</div>

<script>
    var app = new Vue({
        el: "#app",
        data: {
            name: "tan",
            myhtml: "<div class='box'><h1>我是h1</h1><script>alert(1)<\/script></div>"
        },
        computed: {
            reverseName: function(){
                return this.name.split("").reverse().join("")
            }
        }
    })
</script>
```

watch 监听属性：主要是针对 data 中是数据或是 路由 等进行监听，当数据改变，进行响应，如果监听的是一个 vue 属性，需要返回 一个相对应的值，不要滥用监听属性

可以在搜索框中使用监听，搭配防抖，实时弹出搜索提示。

4. class 和 style 绑定

使用 v-bind 绑定类名：

1. 直接字符串 搭配 data 属性绑定
2. 使用对象，对象的 value 决定 class 拥有 key 类名
3. 使用 computed 函数属性，`v-bind:class="computedFn"`，函数返回对象 或 字符串
4. 使用数组，与使用对象类似，适合绑定多个类名

使用 v-bind 绑定内联样式：

1. 使用对象：搭配 data 或 computed 属性返回对象


5. 条件渲染

条件渲染有如下指令：`v-if`  `v-else`  `v-else-if`  

条件渲染需要注意的点：vue 会复用元素，使用条件渲染的时候，input 输入的元素会被保留，可以使用 key 让元素独立

`v-show` 与 `v-if` 的区别：

`v-show` 总是会渲染，控制的是 `dispaly` 属性

`v-if` 在切换的过程中，会 重建组件 和 销毁组件（待验证-----）

6. 列表渲染 `v-for`

`v-for` 可以使用数组，也可以使用对象，可迭代对象都可（因为使用的 `for...in..` 遍历的，数字也行）

数组的更新检测：vue 监听了 数组的变更方法，触发这些方式的时候，就会触发更新。

这些方法是：
- push
- pop
- shift
- unshift
- splice
- sort
- reverse

<details>
<summary>案例：</summary>

```html
<div id="app">
    <ul>
        <li v-for="item in arr" >{{ item }}</li>
    </ul>
    <button @click="push" >pushItem</button>
    <button @click="update" >update</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script>
    var app = new Vue({
        el: "#app",
        data: {
            arr: [ 1,2,3,4,5,6 ]
        },
        methods: {
            push: function(){
                this.arr.push("aaaa")
            },
            update: function(){
                this.arr[2] = "sss"
            }
        },
    })
</script>
```

</details>


**如何更改数组的单个元素呢？**

使用 $set 函数：`this.$set( this.arr, index, value )`

也可以使用 `arr.splite( index, 1, value )` 方法，删除选中目标元素，再添加一个新的元素

<details>
<summary>案例：</summary>

```html
<div id="app">
    <ul>
        <li v-for="item in arr" >{{ item }}</li>
    </ul>
    <ul>
        <li v-for="item, key in obj" >{{ key }}  :  {{ item }}</li>
    </ul>
    <button @click="push" >pushItem</button>
    <button @click="update" >update</button>
    <button @click="updateObj" >updateObj</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script>
    var app = new Vue({
        el: "#app",
        data: {
            arr: [ 1,2,3,4,5,6 ],
            obj: {
                name: "tan",
                yu: "ayu",
                go: "go"
            }
        },
        methods: {
            push: function(){
                this.arr.push("aaaa")
            },
            update: function(){
                this.$set( this.arr, 2, "3456" )
            },
            updateObj: function(){
                this.obj.go = "add"
                // this.$set( this.obj, go, "3456" )
            }
        },
    })
</script>
```

</details>

7. 事件处理

使用 `v-on` 搭配 `methods` 属性完成事件处理

事件修饰符：原生事件相关

- `@click.stop`     阻止事件冒泡
- `@click.prevent`  阻止默认事件
- `@click.capture`  事件监听使用 capture(捕获) 模式  --- 捕获阶段执行
- `@click.self`     只有事件从元素本身触发时，才触发回调 `e.currentTarget === e.target`
- `@click.once`     只触发一次回调
- `@click.left`     鼠标左键点击时触发
- `@click.right`    鼠标右键点击时触发
- `@click.middle`   鼠标中键点击时触发
- `@click.passive`  优化滚动
- `@keyup.13="onEnter"`   键修饰符，键代码

[【web前端】passive是个啥？](https://www.jianshu.com/p/46e5223086b3)

按键修饰符：主要的按键，回车，tab，回退，空格，esc，上下左右

8. 表单输入绑定

`v-model`: 一般用于绑定表单控件

`v-model` 在内部为不同的输入元素绑定不同的 property 和 事件

- `text` 和 `textarea` 绑定 `value` 属性 和 `input` 事件
- `checkbox` 和 `radio` 绑定 `checked` 属性 和 `change` 事件
- `select` 绑定 `value` 属性 和 `change` 事件

修饰符：

[vue修饰符 之 .lazy .number .trim](https://blog.csdn.net/qq_36407748/article/details/80149072)

- `v-model.lazy="val"`  在 失去焦点 或 按下回车 时数据更新
- `v-model.number="val"` 将输入的值转换成 number 类型
- `v-model.trim="val"`  会自动过滤掉输入首尾空格

9. 组件基础

组件的创建：

使用：`Vue.component()` 创建组件

```js
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

创建的组件，data 属性必须是一个函数

**父子组件通信**

父 -> 子： `prop`传值：父组件搭配 `v-bind:` 设置 子组件 属性，子组件使用 `prop` 接收数据

子 -> 父： 父组件使用 `@event` 来监听子组件使用 `$emit` 触发的事件，也可以使用 `Vue.eventBus()` 订阅函数

**插槽 <slot>**

**动态组件**

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```












