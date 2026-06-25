# 032. [中级] 什么是原型链？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

原型链是对象属性查找的后备链条：访问对象属性时，先查对象自身，找不到就沿着它的原型继续查，直到 `null`。

一句话答法：原型链就是对象通过 `[[Prototype]]` 串起来的属性查找链。

## 问题意图

这道题考察 JavaScript 继承机制的底层模型。面试官通常会继续追问 `prototype`、`__proto__`、`new`、继承和属性遮蔽。

## 考察范围

- `[[Prototype]]` 和 `Object.getPrototypeOf()`。
- 属性查找规则。
- `Constructor.prototype`。
- `new` 如何连接实例和原型。
- 原型链终点 `null`。
- 方法共享和属性遮蔽。

## 技术错误纠正

原型链不是“对象复制父对象属性”。实例只是通过原型链查找属性，原型上的方法通常被多个实例共享。

## 知识点系统梳理

```js
function User(name) {
  this.name = name
}

User.prototype.sayName = function () {
  return this.name
}

const user = new User('Ada')

console.log(user.sayName()) // Ada
console.log(Object.getPrototypeOf(user) === User.prototype) // true
```

属性查找过程：

```text
user.sayName
  -> user 自身没有
  -> User.prototype 上找到
  -> 调用时 this 仍然是 user
```

原型链终点：

```text
user -> User.prototype -> Object.prototype -> null
```

## 实战应用举例

### 示例 1：实例共享原型方法

```js
function Counter(count) {
  this.count = count
}

Counter.prototype.inc = function () {
  this.count += 1
  return this.count
}

const a = new Counter(1)
const b = new Counter(10)

console.log(a.inc()) // 2
console.log(b.inc()) // 11
console.log(a.inc === b.inc) // true
```

这个例子证明：方法放在原型上，多个实例共享同一个函数。

### 示例 2：属性遮蔽

```js
const proto = { role: 'viewer' }
const user = Object.create(proto)

console.log(user.role) // viewer

user.role = 'admin'
console.log(user.role) // admin，自身属性遮蔽原型属性
console.log(proto.role) // viewer
```

属性写入通常会在对象自身创建属性，而不是修改原型属性。

## 使用场景说明和对比

| 概念 | 作用 | 常见 API |
| --- | --- | --- |
| 原型链 | 属性查找和继承 | `Object.getPrototypeOf` |
| 构造函数 `prototype` | 作为实例原型 | `Fn.prototype` |
| `Object.create(proto)` | 手动指定原型 | `Object.create` |
| class | 原型继承语法糖 | `extends` |

## 易错点提示

- 原型链是查找链，不是复制链。
- 实例方法放在构造函数内部会每个实例一份，放原型上会共享。
- 原型属性如果是对象/数组，可能被多个实例共享引用。
- `obj.__proto__` 不推荐作为常规代码 API，优先 `Object.getPrototypeOf`。
- `this` 不是由方法所在原型决定，而是由调用方式决定。

## 记忆要点总结

- 查属性先自身，再原型。
- 原型链终点是 `null`。
- `new` 会把实例原型连接到构造函数的 `prototype`。
- 原型方法可被实例共享。
- 自身属性会遮蔽同名原型属性。

## 延伸问题

1. `prototype` 和 `__proto__` 有什么区别？
2. `new` 如何影响原型链？
3. 为什么方法通常放在原型上？
4. `Object.create()` 如何创建原型链？

## 可能类似的问题及简要参考答案

**Q：原型链的终点是什么？**  
A：是 `null`。普通对象通常是 `obj -> Object.prototype -> null`。

**Q：实例可以访问构造函数原型上的方法吗？**  
A：可以。属性查找会沿实例的原型链向上查找。

**Q：原型链实现的是类继承吗？**  
A：JavaScript 的继承基础是原型委托，class 是建立在原型机制上的语法。

## 辅助记忆总结

记成一句话：找属性像查户口，自己没有就去祖先那里找。
