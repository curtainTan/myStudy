// 元组
// var x: [string, number];
// x = ["hello", 10];
// console.log(x[0].substr(1)); // OK
// 枚举
// enum Color {
// 	Red = 1,
// 	Green = 2,
// 	Blue = 4,
// }
// var colorName: string = Color[2];
// console.log(colorName); // 显示'Green'因为上面代码里它的值是2
// 接口
// interface person {
// 	(age: number): number;
// }
// var p: person;
// p = function (num: number) {
// 	console.log(num);
// 	return -1;
// };
// console.log(p);
// 枚举
// const enum Directions {
// 	Up,
// 	Down,
// 	Left,
// 	Right,
// }
// // 使用
// console.log(Directions.Down); // 2
// 联合类型
var A = /** @class */ (function () {
    function A() {
        this.name = "tan";
    }
    return A;
}());
var B = /** @class */ (function () {
    function B() {
        this.age = 78;
    }
    return B;
}());
var c;
console.log(c);
