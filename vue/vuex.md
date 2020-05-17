
# vuex

![vuex流程图](https://vuex.vuejs.org/vuex.png)

**案例**

```js
import Vue from 'vue'
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

// 使用
store.commit('increment')
console.log(store.state.count) // -> 1

// 注入实例
new Vue({
  el: '#app',
  store: store,
})

// 组件中使用
var comp = {
    methods: {
        increment() {
            this.$store.commit('increment')
            console.log(this.$store.state.count)
        }
    }
}
```

## 核心概念

### state

**获取 state**

```js
// 通过 this.$store.模块.key
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}

// 通过 mapState
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
    // 搭配扩展运算符
    computed: {
        ...mapState({
            // 箭头函数可使代码更简练
            count: state => state.count,
            // 传字符串参数 'count' 等同于 `state => state.count`
            countAlias: 'count',
            // 为了能够使用 `this` 获取局部状态，必须使用常规函数
            countPlusLocalState (state) {
                return state.count + this.localCount
            }
        })
    }
}

// 传入数组 搭配字符串 与 扩展运算符
computed: {
    ...mapState([
        // 映射 this.count 为 store.state.count
        'count'
    ])
}
```

### getter

使用场景：当 `store` 中 `state` 的状态进行一些处理的时候，我们可以使用 `getter`

例如：对列表过滤：`this.$store.state.todos.filter(todo => todo.done)` 筛选出已完成的 元素

geeter 就像一个中间层样，对原始数据进行一个过滤，赛选的作用

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

// 获取 getter
import { mapGetters } from 'vuex'

export default {
    computed: {
        // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters([
            'doneTodosCount',
            'anotherGetter',
        ]),
        // 也可以使用对象映射  ---   修改名字
        ...mapGetters({
                // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
                doneCount: 'doneTodosCount'
            }
        })
        doneTodosCount () {
            return this.$store.getters.doneTodosCount
        }
    },
}
```

## Mutation

说明：更改 Vuex 的 store 中的状态的唯一方法，mutation 类似于事件，每个 `mutation` 都有一个字符串的 事件类型，和一个 回调函数，这个回调函数就是我们实际进行更改状态的地方，他会接收 state 作为第一个参数

**使用案例**

```js
// 注册 mutation 对象
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state, payload ) {
      // 变更状态
      state.count += payload.amount
    }
  }
})

// 触发更新  --  大多数时候，第二个参数是传递一个对象
store.commit( 'increment', { amount: 10 } )

// 对象风格式 的 提交
store.commit({
  type: 'increment',
  amount: 10
})

```

**注意：** mutation 遵循 vue 响应式的规则，有两种方案 操作 对象 和 数组，

1. 使用 `Vue.set( obj, "key", value )` 方法实现
2. 使用 扩展符 搭配属性 返回全新 `obj`，如：`state.obj = { ...state.obj, newProp: 123 }`

**提示**

在 mutation 中，可以使用常量作为事件名，并提取常量，外部可以共享常量，避免 事件名 编写出错

**注意：** mutation 必须是同步函数

当我们在进行 `debug` 调试时，我们会在 `devtool` 中观测数据的变化，这个数据的变化就是 `mutation` 的更新日志，每一条 `mutaction` 都会被记录，`devtool` 会捕捉记录进行前后对比展示数据的变化。在 `mutaction` 中做异步操作的时候，`mutation` 触发，`devtool` 追踪不到状态的改变

**在组件中使用 mutation:** 注册在 `methods` 对象下

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

## action

`action` 是一个中间层，我们在这里可以做异步操作，把结果传递给 `mutation`，会优先拦截 `mutation`

使用案例：

```js
// 注册 action
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
        state.count++
        }
    },
    actions: {
        // 这里的 context 不是 store 实例
        increment (context) {
        context.commit('increment')
        }
    }
})

// 分发 action
store.dispatch('increment')
// 以载荷形式分发
store.dispatch('incrementAsync', {
    amount: 10
})
// 以对象形式分发
store.dispatch({
    type: 'incrementAsync',
    amount: 10
})

// 购物车案例    ---    在一个 action 里面将数据操作进行封装
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

## module -- 模块化

使用案例：

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

**获取全局 state** 

```js
const moduleA = {
  // ... 通过 rootState 获取其他模块的信息 --- 所有模块属性会合并到 rootstate 上
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

**命名空间**

不使用命名空间时，内部的 `action`、`mutation`、`getter` 注册在全局命名空间 -- 多个模块能对同意 `mutation` 和 `action` 作出响应

通过添加 `namespaced: true` 使用命名空间，当前模块的 `getter`、`action`、`mutation` 需要使用前缀路径

**扩充：** 模块可以嵌套


**带命名空间的模块访问**

案例：

```js
// 在模块中 访问
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

**组件中 访问和注册 模块化中的 数据和方法**

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}

// 取出公共前缀     -   会自动绑定上下文  
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}

// 使用辅助函数 提取 前缀
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

# 部分重要 api

**Vue.store** 构造器

1. modules：模块
2. plugins：[]  插件
3. devtools：vuex store 是否会被订阅到 `devtoosl` 插件

**Vuex.Store实例属性**

1. dispatch：分发 `action`
2. replaceState：替换 `store` 的根状态，用于状态合并和时光旅行调试
3. watch：响应式的监听 `fn` 的返回值
4. subscribe：订阅 `store` 的 `mutation`，
5. subscribeAction：订阅

**组件绑定的辅助函数**

1. mapState
2. mapGetters
3. mapActions
4. mapMutations
5. createNamespacedHelpers


## 总结

vuex 需要记住下面两点：

1. vuex 需要记住整个修改的流程
2. 核心概念：State，Getter，Mutation，Action，Module


