# 033. [中级] `__proto__` 和 `prototype` 的区别是什么？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

`prototype` 是函数对象上的属性，用来作为它创建实例时的原型；`__proto__` 是对象访问自身原型的历史访问器。

一句话答法：函数的 `prototype` 给实例当原型，实例的 `__proto__` 指向这个原型。

## 问题意图

这道题考察你是否真正理解构造函数、实例和原型对象之间的三角关系，而不是只背两个名字。

## 考察范围

- `Function.prototype` 属性。
- 对象的 `[[Prototype]]`。
- `__proto__` 历史访问器。
- `Object.getPrototypeOf()`。
- `new` 和实例原型连接。
- `constructor` 属性。

## 技术错误纠正

不建议在业务代码里直接操作 `__proto__`。读取原型用 `Object.getPrototypeOf(obj)`，设置原型也应谨慎使用 `Object.setPrototypeOf`，因为可能影响性能和可维护性。

## 知识点系统梳理

```js
function User() {}

const user = new User()

console.log(User.prototype) // 实例的原型对象
console.log(user.__proto__ === User.prototype) // true
console.log(Object.getPrototypeOf(user) === User.prototype) // true
```

关系图：

```text
User 函数
  └─ prototype -> User.prototype

user 实例
  └─ [[Prototype]] / __proto__ -> User.prototype
```

## 实战应用举例

### 示例 1：方法放在 prototype 上供实例共享

```js
function User(name) {
  this.name = name
}

User.prototype.sayName = function () {
  return this.name
}

const ada = new User('Ada')

console.log(ada.sayName()) // Ada
console.log(Object.getPrototypeOf(ada) === User.prototype) // true
```

这个例子证明：实例能访问 `User.prototype` 上的方法，是因为实例原型指向它。

### 示例 2：普通对象也有原型

```js
const obj = {}

console.log(Object.getPrototypeOf(obj) === Object.prototype) // true
console.log(typeof obj.toString) // function
```

对象字面量的原型通常是 `Object.prototype`，所以能访问 `toString`。

## 使用场景说明和对比

| 名称 | 属于谁 | 作用 |
| --- | --- | --- |
| `Fn.prototype` | 函数对象 | 作为 `new Fn()` 创建实例的原型 |
| `obj.__proto__` | 普通对象也可访问 | 历史方式读取对象原型 |
| `Object.getPrototypeOf(obj)` | 标准 API | 推荐读取对象原型 |
| `Object.setPrototypeOf(obj, proto)` | 标准 API | 可设置原型，但慎用 |

## 易错点提示

- 不是所有对象都有 `prototype` 属性，通常函数才有。
- 所有普通对象都有内部 `[[Prototype]]`，可用 `Object.getPrototypeOf` 读取。
- `__proto__` 是访问器，不是推荐的正式建模工具。
- `Constructor.prototype.constructor` 默认指回构造函数，但可以被覆盖。
- 箭头函数没有 `prototype`，不能作为构造函数。

## 记忆要点总结

- `prototype`：函数拿来给实例当原型。
- `__proto__`：对象指向自己原型的历史入口。
- 实例的 `__proto__ === 构造函数.prototype`。
- 推荐用 `Object.getPrototypeOf()`。
- class 也是基于这套原型关系。

## 延伸问题

1. 为什么箭头函数没有 `prototype`？
2. `Object.getPrototypeOf()` 和 `__proto__` 有什么关系？
3. `constructor` 属性一定可靠吗？
4. `new` 如何连接实例和构造函数的 `prototype`？

## 可能类似的问题及简要参考答案

**Q：`prototype` 是实例上的属性吗？**  
A：不是。`prototype` 通常是函数对象上的属性，实例通过内部原型指向它。

**Q：实例如何访问原型？**  
A：标准方式是 `Object.getPrototypeOf(instance)`，历史上也可以用 `instance.__proto__`。

**Q：`__proto__` 和 `[[Prototype]]` 一样吗？**  
A：`[[Prototype]]` 是内部槽，`__proto__` 是访问它的历史访问器。

## 辅助记忆总结

记成一句话：`prototype` 是函数准备的祖先，`__proto__` 是对象认祖归宗的线索。
