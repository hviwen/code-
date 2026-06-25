# 023. [中级] `call`、`apply`、`bind` 方法的区别和用法

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

`call`、`apply`、`bind` 都用于指定普通函数执行时的 `this`，区别在于参数传递方式和是否立即执行。

一句话答法：`call` 参数一个个传并立即执行，`apply` 参数用数组传并立即执行，`bind` 返回一个绑定好的新函数稍后执行。

## 问题意图

这道题想确认你是否真正理解函数调用、`this` 绑定、参数传递和偏函数，而不是只背 API 名称。

## 考察范围

- `thisArg` 和业务参数的区别。
- `call/apply` 立即执行，`bind` 延迟执行。
- 参数列表、参数数组、预置参数。
- 严格模式下 `null/undefined` 的 `this` 行为。
- `bind` 返回函数作为构造函数时的边界。
- 方法借用、类型判断、事件绑定等实际场景。

## 技术错误纠正

原始表述里“第一个参数是传入要执行的参数”不准确。第一个参数是 `thisArg`，业务参数从第二个位置开始。

还要注意：三者只能影响普通函数的 `this`，不能改变箭头函数的词法 `this`。

## 知识点系统梳理

| 方法 | 是否立即执行 | 参数形式 | 返回值 | 典型场景 |
| --- | --- | --- | --- | --- |
| `fn.call(ctx, a, b)` | 是 | 参数列表 | 函数执行结果 | 方法借用、精确类型判断 |
| `fn.apply(ctx, [a, b])` | 是 | 参数数组或类数组 | 函数执行结果 | 旧代码中展开数组参数 |
| `fn.bind(ctx, a)` | 否 | 参数列表，可预置 | 新函数 | 事件回调、偏函数 |

`bind` 还有一个关键点：它可以预置部分参数。

```js
function add(a, b) {
  return a + b
}

const add10 = add.bind(null, 10)
console.log(add10(5)) // 15
```

## 实战应用举例

### 示例 1：基础差异

```js
function greet(prefix, suffix) {
  return `${prefix} ${this.name}${suffix}`
}

const user = { name: 'Ada' }

console.log(greet.call(user, 'Hi', '!')) // Hi Ada!
console.log(greet.apply(user, ['Hello', '.'])) // Hello Ada.

const sayHi = greet.bind(user, 'Hi')
console.log(sayHi('?')) // Hi Ada?
```

这个例子证明：`call/apply` 当场返回结果，`bind` 返回函数。

### 示例 2：精确类型判断

```js
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

console.log(getType([])) // Array
console.log(getType(null)) // Null
console.log(getType(new Date())) // Date
```

这里使用 `call` 是为了让 `Object.prototype.toString` 以目标值作为 `this` 执行。

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 明确参数个数并立刻调用 | `call` | 写法直接 |
| 已经有参数数组并立刻调用 | `apply` 或展开运算符 | 现代代码更常用 `fn(...args)` |
| 回调稍后执行但需要固定 `this` | `bind` | 返回新函数 |
| 只想保留外层 `this` | 箭头函数 | 比 `bind` 更轻 |
| 借用数组方法处理类数组 | `call` | 如 `Array.prototype.slice.call(arguments)` |

## 易错点提示

- `call/apply` 会立即执行，`bind` 不会。
- 第一个参数是 `thisArg`，不是业务参数。
- 严格模式下传 `null/undefined` 不会自动变成全局对象。
- `bind` 之后再 `bind`，第一次绑定的 `this` 不会被覆盖。
- `bind` 返回的是新函数，移除事件监听时必须保存同一个函数引用。
- 箭头函数的 `this` 不受三者影响。

## 记忆要点总结

- `call`：call me now，参数一个个传。
- `apply`：apply array，参数数组传。
- `bind`：bind later，返回新函数。
- 三者的第一参数都是 `thisArg`。
- 现代代码中 `apply` 的很多场景可用展开运算符替代。

## 延伸问题

1. 如何手写简化版 `call`？
2. `bind` 返回的函数被 `new` 调用时，`thisArg` 还生效吗？
3. `Object.prototype.toString.call(value)` 为什么能判断类型？
4. `apply` 和展开运算符 `...` 有什么关系？
5. 为什么箭头函数不能用 `call` 改变 `this`？

## 可能类似的问题及简要参考答案

**Q：`call` 和 `apply` 的本质区别是什么？**  
A：都立即执行，区别只是业务参数传递形式：`call` 用参数列表，`apply` 用数组或类数组。

**Q：`bind` 能做偏函数吗？**  
A：能。`bind` 可以预置前几个参数，调用返回函数时再补剩余参数。

**Q：`bind` 返回函数还能被解绑事件吗？**  
A：可以，但必须保存 `bind` 返回的新函数引用，不能每次重新 `bind`。

## 辅助记忆总结

记成一句话：`call/apply` 是“马上借 this 用一下”，`bind` 是“先绑好 this，之后再用”。
