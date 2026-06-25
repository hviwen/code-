# 043. [中级] 构造函数和普通函数的区别

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

构造函数本质上也是普通函数，但它被 `new` 调用时会走对象创建流程：创建新对象、绑定原型、绑定 `this`、执行函数体并返回对象。

一句话答法：区别不在函数定义本身，而在调用方式；用 `new` 调用时它才表现为构造函数。

## 问题意图

这道题考察 `new`、`this`、`prototype` 和实例对象之间的关系，也会顺带考察忘记 `new` 的风险。

## 考察范围

- 构造函数命名和调用习惯。
- `new` 调用过程。
- `this` 指向实例。
- `Constructor.prototype` 和实例原型。
- 构造函数返回对象时的特殊规则。
- class 与构造函数的关系。

## 技术错误纠正

不要把“首字母大写”当成语法区别。首字母大写只是约定，真正的区别是是否通过 `new` 调用。

## 知识点系统梳理

```js
function User(name) {
  this.name = name
}

const user = new User('Ada')

console.log(user.name) // Ada
console.log(Object.getPrototypeOf(user) === User.prototype) // true
```

`new User('Ada')` 大致做了四步：

1. 创建一个新对象。
2. 把新对象的原型指向 `User.prototype`。
3. 用新对象作为 `this` 执行 `User`。
4. 如果构造函数没有显式返回对象，则返回这个新对象。

## 实战应用举例

### 示例 1：忘记 new 的问题

```js
'use strict'

function User(name) {
  this.name = name
}

const user = User('Ada') // TypeError: Cannot set properties of undefined
```

严格模式下普通调用时 `this` 是 `undefined`，所以构造函数必须配合 `new`。

### 示例 2：构造函数返回对象

```js
function User(name) {
  this.name = name

  return { name: 'Override' }
}

console.log(new User('Ada').name) // Override
```

如果构造函数显式返回对象，`new` 的结果会变成这个对象；返回基本类型则会被忽略。

## 使用场景说明和对比

| 写法 | 特点 | 适合场景 |
| --- | --- | --- |
| 普通函数 | 直接执行逻辑并返回结果 | 工具函数、计算函数 |
| 构造函数 | 通过 `new` 创建实例 | 旧式面向对象代码 |
| class | 构造函数语法糖，更明确 | 现代实例建模 |
| 工厂函数 | 普通函数返回对象 | 不想暴露 `new` 或原型细节 |

## 易错点提示

- 构造函数不加 `new` 就是普通调用。
- 构造函数里的 `this` 指向新实例。
- 方法应放在 `prototype` 上，避免每个实例重复创建。
- 构造函数返回对象会覆盖默认返回的实例。
- 箭头函数不能作为构造函数。

## 记忆要点总结

- 构造函数靠 `new` 触发特殊流程。
- `this` 指向新创建的对象。
- 实例原型来自构造函数的 `prototype`。
- 显式返回对象会覆盖实例。
- class 是更现代、更受约束的构造函数写法。

## 延伸问题

1. `new` 操作符具体做了什么？
2. 构造函数返回基本类型和对象有什么区别？
3. 为什么箭头函数不能被 `new` 调用？
4. class 和构造函数有什么关系？

## 可能类似的问题及简要参考答案

**Q：构造函数必须首字母大写吗？**  
A：不是语法要求，只是约定，用来提醒调用方需要 `new`。

**Q：构造函数可以有返回值吗？**  
A：可以。返回对象会覆盖默认实例，返回基本类型会被忽略。

**Q：普通函数能变成构造函数吗？**  
A：普通函数只要能被 `new` 调用，就可以作为构造函数；箭头函数不行。

## 辅助记忆总结

记成一句话：函数戴上 `new` 这顶帽子，才走构造流程。
