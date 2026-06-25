# 084. [中级]** 剩余参数与arguments对象的区别

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

剩余参数（`...args`）是 ES6 引入的真正数组，用来收集函数多余的实参；`arguments` 是 ES3 就有的类数组对象，包含所有实参。核心区别：`...args` 是真数组、可用于箭头函数、语义更清晰；`arguments` 是类数组、箭头函数中不存在、需要转换后才能用数组方法。

一句话答法：`...args` 产生真数组且只收集"剩余"的参数，`arguments` 是类数组且包含全部参数；箭头函数没有 `arguments`，只能用 `...args`。

## 问题意图

这道题考察三件事：

1. 是否能准确说出"真数组 vs 类数组"的区别和影响。
2. 是否知道 `arguments` 在箭头函数中不可用。
3. 是否理解 rest 参数只收集"剩余"参数，而 `arguments` 包含全部参数。

## 考察范围

- rest 参数的语法和位置限制（必须在参数列表最后）。
- `arguments` 的类数组特性和转换方式。
- 箭头函数中 `arguments` 的行为。
- rest 参数与命名参数的组合使用。
- 严格模式下 `arguments` 与命名参数的关系。
- 性能和可读性对比。

## 知识点系统梳理

### 核心差异对比

| 对比项 | 剩余参数 `...args` | `arguments` 对象 |
| --- | --- | --- |
| 类型 | 真正的 `Array` | 类数组对象（Array-like） |
| 数组方法 | 直接使用 `map`/`filter`/`reduce` | 需要 `Array.from()` 或 `[...arguments]` 转换 |
| 收集范围 | 只收集没有命名参数接收的"剩余"实参 | 包含所有实参 |
| 箭头函数 | 可用 | 不可用（继承外层函数的 `arguments`） |
| 位置限制 | 必须是参数列表的最后一个 | 无限制（自动存在） |
| 解构/默认值 | 可以配合使用 | 不可以 |

### 基本用法对比

```js
// arguments 方式（ES5）
function sumOld() {
  // arguments 是类数组，不能直接用 reduce
  const args = Array.prototype.slice.call(arguments)
  return args.reduce((sum, n) => sum + n, 0)
}

// rest 参数方式（ES6）
function sumNew(...numbers) {
  // numbers 就是数组，直接用
  return numbers.reduce((sum, n) => sum + n, 0)
}

sumOld(1, 2, 3) // 6
sumNew(1, 2, 3) // 6
```

### rest 参数只收集"剩余"的

```js
function log(level, ...messages) {
  // level = 'info'
  // messages = ['user logged in', { userId: 1 }]
  console.log(`[${level}]`, ...messages)
}

log('info', 'user logged in', { userId: 1 })

// 对比 arguments：arguments[0] 是 'info'，arguments[1] 是 'user logged in'
// 用 arguments 实现同样效果需要手动 slice
function logOld(level) {
  const messages = Array.prototype.slice.call(arguments, 1)
  console.log(`[${level}]`, ...messages)
}
```

### 箭头函数中的行为

```js
function outer() {
  const inner = (...args) => {
    console.log(args)           // ✅ [1, 2, 3]（rest 参数正常工作）
    // console.log(arguments)   // ⚠️ 这里拿到的是 outer 的 arguments，不是 inner 的
  }
  inner(1, 2, 3)
}
outer(99)

// 箭头函数没有自己的 arguments，只能用 rest 参数
const arrowFn = (...args) => args.length
arrowFn(1, 2, 3) // 3
```

## 实战应用举例

### 示例 1：函数包装器中收集并转发参数

这个例子证明：rest 参数让参数转发比 `arguments` 简洁得多。

```js
// rest 参数版——简洁
function withTiming(fn) {
  return function(...args) {
    const start = performance.now()
    const result = fn(...args)  // 展开传递
    console.log(`${fn.name}: ${(performance.now() - start).toFixed(2)}ms`)
    return result
  }
}

// arguments 版——繁琐
function withTimingOld(fn) {
  return function() {
    const start = performance.now()
    const result = fn.apply(this, arguments)  // 必须用 apply
    console.log(`${fn.name}: ${(performance.now() - start).toFixed(2)}ms`)
    return result
  }
}
```

边界说明：
- `arguments` 版不能用箭头函数作为返回值，否则拿不到 `arguments`。
- rest 参数版可以自由使用箭头函数或普通函数。

### 示例 2：命名参数 + 剩余参数的组合

```js
function createElement(tag, attributes, ...children) {
  // tag: 'div'
  // attributes: { class: 'box' }
  // children: ['Hello', ' ', 'World']  ← 只收集第三个参数及之后的
  return { tag, attributes, children }
}

createElement('div', { class: 'box' }, 'Hello', ' ', 'World')
// { tag: 'div', attributes: { class: 'box' }, children: ['Hello', ' ', 'World'] }
```

## 使用场景说明和对比

| 场景 | 推荐方案 | 原因 |
| --- | --- | --- |
| 收集不定数量参数 | `...args` | 真数组，直接用数组方法 |
| 参数转发给另一个函数 | `...args` + 展开 | `fn(...args)` 比 `fn.apply(this, arguments)` 简洁 |
| 箭头函数中收集参数 | `...args` | 箭头函数没有 `arguments` |
| 需要访问 `callee`（递归） | `arguments`（非严格模式） | 但更推荐用具名函数 |
| 维护老代码 | `arguments` | 不改动已有逻辑 |

## 易错点提示

- rest 参数必须在参数列表最后：`function f(a, ...b, c)` 语法错误。
- 箭头函数中的 `arguments` 不是自己的，是外层普通函数的。如果外层也没有普通函数，`arguments` 是 `ReferenceError`。
- `arguments` 在非严格模式下和命名参数是"绑定"关系：修改 `arguments[0]` 会同步修改第一个命名参数。严格模式下无此绑定。
- rest 参数的 `length` 不计入函数的 `length` 属性：`(function(a, ...b){}).length` 是 `1`。
- `arguments` 有 `callee` 属性（指向当前函数），严格模式下访问会报错。

## 记忆要点总结

- `...args` 是真数组，`arguments` 是类数组。
- `...args` 只收集剩余参数，`arguments` 包含全部参数。
- 箭头函数没有自己的 `arguments`，只能用 `...args`。
- rest 参数必须放在参数列表最后。
- 新代码全部用 rest 参数，`arguments` 仅在维护老代码时碰到。

## 延伸问题

1. `arguments` 在严格模式和非严格模式下有什么行为差异？
2. `function f(a, ...b) {}` 中 `f.length` 是多少？为什么？
3. 如何在箭头函数中获取所有参数？
4. rest 参数和解构赋值能同时使用吗？怎么写？

## 可能类似的问题及简要参考答案

**Q：`arguments` 是数组吗？**
A：不是。是类数组对象，有 `length` 和数字索引，但没有数组方法。用 `Array.from(arguments)` 或 `[...arguments]` 转为真数组。

**Q：箭头函数有 `arguments` 吗？**
A：没有自己的 `arguments`。如果在箭头函数中访问 `arguments`，拿到的是外层普通函数的 `arguments`。

**Q：rest 参数可以有默认值吗？**
A：不可以。`...args = []` 是语法错误。rest 参数在没有剩余实参时自动为空数组 `[]`。

**Q：什么时候还需要用 `arguments`？**
A：几乎不需要。唯一场景是维护不能改签名的老代码，或者需要 `arguments.callee`（非严格模式下的递归，但不推荐）。

## 辅助记忆总结

记成一句话：`...args` 是"真数组 + 只收剩余"，`arguments` 是"类数组 + 收全部"——新代码只用前者。
