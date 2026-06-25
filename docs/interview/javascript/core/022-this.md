# 022. [中级] `this` 关键字在不同情况下指向什么？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

普通函数的 `this` 由调用方式决定，不由函数定义位置决定。箭头函数没有自己的 `this`，它捕获外层词法作用域里的 `this`。

一句话答法：普通函数看“谁调用”，箭头函数看“在哪里创建”。

## 问题意图

这道题想确认你是否能按绑定规则判断输出，并能处理回调、事件、`bind`、构造函数和箭头函数这些项目中最容易错的场景。

## 考察范围

- 默认绑定、隐式绑定、显式绑定、`new` 绑定。
- 箭头函数的词法 `this`。
- 严格模式下默认绑定为 `undefined`。
- 方法赋值后丢失隐式绑定。
- DOM 事件、定时器、class 方法、React/Vue 中的 `this`。

## 技术错误纠正

原始内容中的规则方向正确，但需要补充优先级和边界：`new` 绑定优先于显式绑定；箭头函数不能被 `call/apply/bind` 改变 `this`；严格模式下独立函数调用的 `this` 是 `undefined`。

## 知识点系统梳理

普通函数 `this` 绑定优先级：

| 优先级 | 规则 | 示例 | `this` |
| ---: | --- | --- | --- |
| 1 | `new` 绑定 | `new Fn()` | 新创建的实例 |
| 2 | 显式绑定 | `fn.call(obj)` | `obj` |
| 3 | 隐式绑定 | `obj.fn()` | `obj` |
| 4 | 默认绑定 | `fn()` | 严格模式为 `undefined`，非严格模式通常为全局对象 |

箭头函数单独记：它没有自己的 `this`，不会参与上面的优先级比较。

## 实战应用举例

### 示例 1：方法赋值后丢失 this

```js
'use strict'

const user = {
  name: 'Ada',
  sayName() {
    return this.name
  },
}

console.log(user.sayName()) // Ada

const fn = user.sayName
console.log(fn()) // TypeError 或 undefined，取决于使用方式
```

这个例子证明：`this` 看调用点。`user.sayName()` 是隐式绑定，`fn()` 是默认绑定。

### 示例 2：箭头函数不能当对象方法 this 使用

```js
const counter = {
  count: 1,
  add() {
    return this.count + 1
  },
  addArrow: () => {
    return this.count + 1
  },
}

console.log(counter.add()) // 2
console.log(counter.addArrow()) // NaN 或意外值
```

对象方法需要动态 `this` 时用普通函数；回调里想保留外层 `this` 时才适合箭头函数。

## 使用场景说明和对比

| 场景 | 推荐写法 | 原因 |
| --- | --- | --- |
| 对象方法 | 普通方法 | 需要调用时绑定到对象 |
| 定时器回调访问外层实例 | 箭头函数 | 捕获外层 `this` |
| 方法借用 | `call/apply` | 临时指定上下文 |
| React class 事件 | `bind` 或 class field 箭头函数 | 防止回调丢失实例 |
| Vue 3 `setup` | 不使用 `this` | 通过闭包变量和返回值组织状态 |

## 易错点提示

- `this` 不看函数写在哪里，只看普通函数怎么被调用。
- `const fn = obj.method` 会丢失 `obj`。
- 箭头函数的 `this` 不能被 `call/apply/bind` 改。
- `bind` 后返回新函数，事件解绑要保存这个新函数引用。
- `new (fn.bind(obj))()` 中，`new` 绑定优先于 `bind` 的 `thisArg`。
- DOM 普通事件处理函数中的 `this` 常指向事件目标；箭头函数不会。

## 记忆要点总结

- 普通函数：调用方式决定 `this`。
- 优先级：`new` > `call/apply/bind` > `obj.fn()` > `fn()`。
- 箭头函数：创建位置决定 `this`。
- 严格模式下默认绑定是 `undefined`。
- 判断输出题时先找调用点，再看是否箭头函数。

## 延伸问题

1. 箭头函数为什么不能作为构造函数？
2. `bind` 返回的函数再被 `new` 调用时发生什么？
3. DOM 事件里普通函数和箭头函数的 `this` 有什么差异？
4. 为什么 Vue 3 `setup` 不推荐使用 `this`？
5. `obj.method.call(other)` 中隐式绑定和显式绑定谁优先？

## 可能类似的问题及简要参考答案

**Q：`obj.fn()` 和 `(0, obj.fn)()` 的 `this` 一样吗？**  
A：不一样。前者是隐式绑定，`this` 是 `obj`；后者方法引用被取出后再调用，通常变成默认绑定。

**Q：箭头函数可以用 `bind` 改 `this` 吗？**  
A：不能。箭头函数没有自己的 `this`，`bind` 只能预置参数，不能改变它的 `this`。

**Q：严格模式下独立调用普通函数，`this` 是什么？**  
A：是 `undefined`。非严格模式下通常会被装箱到全局对象。

## 辅助记忆总结

记成一句话：普通函数找调用点，箭头函数找出生地。
