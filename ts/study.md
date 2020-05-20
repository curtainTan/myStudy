# typeScript

## 基础变量

1. boolean - 布尔值
2. number - 数字
3. string - 字符串
4. 数组

```ts
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

5. 元组 Tuple

```ts
// 定义元组 -- 元组是指定长度-指定类型的数组-如果数组越界，会报错
let x: [string, number];
x = ["hello", 10]; // OK
x = [10, "hello"]; // Error
```

6. 枚举 enum

```ts
// 默认从 0 开始为元素编号
enum Color {
	Red,
	Green,
	Blue,
}
let c: Color = Color.Green; // 2

// 也可以手动赋值
enum Color {
	Red = 1,
	Green = 2,
	Blue = 4,
}
let c: Color = Color.Green;

// 编译结果
var Color;
(function (Color) {
	Color[(Color["Red"] = 1)] = "Red";
	Color[(Color["Green"] = 2)] = "Green";
	Color[(Color["Blue"] = 4)] = "Blue";
})(Color || (Color = {}));
var colorName = Color[2];
// Green { '1': 'Red', '2': 'Green', '4': 'Blue', Red: 1, Green: 2, Blue: 4 }
console.log(colorName, Color); // 显示'Green'因为上面代码里它的值是2
```

7. any - 任意类型
8. void - 空

`void` 一般声明函数返回值，声明的变量只能赋予 `undefined` 和 `null`

9. undefined 和 null

默认情况下，`null` 和 `undefined` 是所有类型的子类型

10. never - 永不存在的类型

`never` 类型是那些总是会抛出异常或根本不会有返回值的函数表达式的返回值

11. object- 对象，可以表示 对象 和 `null`

## 接口

用于规范类型

```ts
interface SquareConfig {
	// 可选类型
	color?: string;
	// 只读属性
	readonly x: number;
}

// 函数类型接口
interface say {
	(something: str): void;
}
```

## 类

三个修饰符：public provide protected

## 枚举

使用枚举可以一系列常量，可以清晰的表达意图和创建一组有区别的用例

ts 支持 数字的 和 基于字符串的 枚举

```ts
// 1. 数字枚举：
// 定义
enum Direction {
	Up = 1,
	Down,
	Left,
	Right,
}
// 使用
console.log(Direction.Down, Direction);
// 2 {
//   '1': 'Up',
//   '2': 'Down',
//   '3': 'Left',
//   '4': 'Right',
//   Up: 1,
//   Down: 2,
//   Left: 3,
//   Right: 4
// }

// 2. 字符串枚举
enum Direction {
	Up = "UP",
	Down = "DOWN",
	Left = "LEFT",
	Right = "RIGHT",
}
// 使用
console.log(Direction.Down, Direction);
//DOWN { Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT' }

// 3. 异构枚举 -- 混合枚举
// 在字符串枚举的元素后，不允许值为空出现

// 4. 计算的 和 常量成员
enum FileAccess {
	// constant members
	None,
	Read = 1 << 1,
	Write = 1 << 2,
	ReadWrite = Read | Write,
	// computed member
	G = "123".length,
}

// 5. 反向映射
enum Enum {
	A,
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"

// 6. const 修饰枚举
const enum Directions {
	Up,
	Down,
	Left,
	Right,
}
let directions = [Directions.Up, Directions.Down]; // [ 0, 1 ]
// 使用 const 修饰的枚举，编译结束后，会被删除，只取结果
```

## 高级类型

1. 交叉类型：将多个类型合并为一个类型

```ts
class A {
	name: string = "tan";
}
class B {
	age: number = 78;
}

var c: A & B = {
	// 如果添加其他属性 -- 会报错
	name: "yu",
	age: 1,
};
```

2. 联合类型：几个类型，选其中一个

## 模块

导出：`export`

导入：`import { name } from "./module"`

为了支持 CJS 和 AMD 的 `exports` ，ts 提供了 `export =` 和 `import naem = require( ""./module )`
