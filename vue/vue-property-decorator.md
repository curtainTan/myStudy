
# vue-property-decorator使用手册

[参考材料](https://segmentfault.com/a/1190000019906321)

[npm--vue-property-decorator](https://www.npmjs.com/package/vue-property-decorator)

vue-property-decorator 有以下几个装饰器 和 一个 mxin 功能

1. `@Prop`
3. `@PropSync`
4. `@Model`
5. `@Watch`
6. `@Provide`
7. `@Inject`
8. `@ProvideReactive`
9. `@InjectReactive`
10. `@Emit`
11. `@Ref`
12. `@component`  修饰类
13. `Mixin` 修饰类

## 使用方法介绍

### @Prop( PropOptions | Constructor[] | Constructor) = {} )

`@Prop()` 接收一个参数，这个参数有三种写法：

1. 构造函数 --  如：`String` `Number` `Boolean` 等，指定 `prop` 的类型
2. 构造函数数组 -- 如：`[ String, Number ]` 等，指定 `prop` 可选类型
3. `option` -- 有如下属性：`type  default  required  validator`

案例：

```js
import { Vue, Component, Prop } from 'vue-property-decorator'

@Componentexport default class MyComponent extends Vue {
  @Prop(String) public propA: string | undefined
  @Prop([String, Number]) public propB!: string | number
  @Prop({
    type: String,
    default: 'abc'
  })
  public propC!: string
}
```

**注意：** 每个 `prop` 需要加上 `undefined`，或 `!` 断言，否则会报错，默认值写在对象内

### @PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {})

接收两个参数：
1. `propName`：表示父元素传递过来的属性名   ---  因为要使用 `:name.sync` 
2. `option`：与 `@Prop` 参数一致

**注意：** @PropSync需要配合父组件的.sync修饰符使用

### @Model( event?: string, options: (PropOptions | Constructor[] | Constructor) = {} )

`@Model` 装饰器允许我们在一个组件上自定义 `v-model`，接收两个参数：
1. `event: string` 事件名。
2. `options: Constructor | Constructor[] | PropOptions` 与 `@Prop` 的第一个参数一致。

案例：

```js
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Model('change', { type: String, default: '123' }) public value!: string
}

// 结果
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: '123'
    }
  }
}
```

### @Watch( path: string, options: WatchOptions = {} )

`@Watch` 装饰器接收两个参数：
1. `path: string` 被监听的属性名
2. `option: object`  主要两个属性，一个是 是否立即执行 `immediate`, 一个是 深度监听 `deep`

案例：

```js
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Watch('msg')
  public onMsgChanged(newValue: string, oldValue: string) {}

  @Watch('arr', { immediate: true, deep: true })
  public onArrChanged1(newValue: number[], oldValue: number[]) {}

  @Watch('arr')
  public onArrChanged2(newValue: number[], oldValue: number[]) {}
}
```

### @Emit( event?: string )

`@Emit()` 说明：

1. 参数：传参：参数将作为传递事件名，不传参，将使用方法名作为参数，方法名会转为 小写 + 短横线 作为事件名
2. `@Emit()` 函数的返回值 将作为 `emit()` 的第二个参数，如果返回值是 `Promise`，会在状态变成 `resolved` 之后触发
3. `@Emit` 装饰函数的回调函数的参数，会被放在 `$emit()` 函数的最后一位

案例：

```js
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  count = 0
  @Emit()
  public addToCount(n: number) {
    this.count += n
  }
  @Emit('reset')
  public resetCount() {
    this.count = 0
  }
  @Emit()
  public returnValue() {
    return 10
  }
  @Emit()
  public onInputChange(e) {
    return e.target.value
  }
  @Emit()
  public promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}

// 相当于：
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    onInputChange(e) {
      this.$emit('on-input-change', e.target.value, e)
    },
    promise() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })
      promise.then(value => {
        this.$emit('promise', value)
      })
    }
  }
}
```

### @Ref( refKey?: string )

`@Ref` 装饰器接收一个可选参数，用来指向元素或子组件的引用信息。如果没有提供这个参数，会使用装饰器后面的属性名充当参数

案例：

```js
import { Vue, Component, Ref } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Componentexport default class MyComponent extends Vue {
  @Ref() readonly loginForm!: Form
  @Ref('changePasswordForm') readonly passwordForm!: Form

  public handleLogin() {
    this.loginForm.validate(valide => {
      if (valide) {
        // login...
      } else {
        // error tips
      }
    })
  }
}

// 等同于
export default {
  computed: {
    loginForm: {
      cache: false,
      get() {
        return this.$refs.loginForm
      }
    },
    passwordForm: {
      cache: false,
      get() {
        return this.$refs.changePasswordForm
      }
    }
  }
}

```


### @Provide/@Inject 和 @ProvideReactive/@InhectReactive

与 vue 中的 `provide   inject` 类似，不常用，如需使用，可查看官网。



## 总结

vue 想要使用 ts ，需要将 vue 文件中的 `<script>` 标签改成 `<script lang="ts">` 完成 ts 支持

再使用 类 的方式完成单个组件 js 部分的编写，主要使用 装饰器 对部分实例方法进行 封装


