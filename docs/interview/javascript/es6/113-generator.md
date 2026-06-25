# 113. [中级] Generator 函数的基本概念和用法

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Generator 是 ES6 引入的**可暂停/可恢复**的函数。`function*` 定义，`yield` 暂停，`next()` 恢复，每次 `.next()` 返回 `{ value, done }`。核心价值是编写看起来同步的**惰性求值**和**异步流程控制**代码。

一句话答法：Generator 是 `function*` 声明的函数，调用返回 `Generator` 对象。`yield` 暂停执行并产出值，`next()` 恢复执行。特性：惰性求值（运行到第一个 `yield` 才真正执行）、可双向传参、天生符合迭代器协议。

## 问题意图

1. 是否理解 Generator 的**暂停/恢复**机制——调用 Generator 函数不执行代码，返回迭代器。
2. 是否知道 `.next(value)` 可以从外部向 Generator 内部传递参数。
3. 是否知道 `for...of`、`...` 展开、解构可以自动消费 Generator（自动调用 `next` 直到 `done: true`）。
4. 是否知道 Generator 是实现协程（coroutine）的基础。

## 考察范围

- `function* gen()` 声明，返回 Generator 对象。
- `yield` 暂停并产出值，`yield*` 委托给另一个可迭代对象。
- `.next(value)` → `{ value, done }`，`value` 可传递到 Generator 内部。
- `.return(value)` 终止 Generator，`.throw(error)` 向 Generator 抛异常。
- Generator 实现了 `[Symbol.iterator]` 协议（既是可迭代对象也是迭代器）。
- Generator vs 普通函数：可以多段执行（yield 暂停/next 恢复）。
- 协程概念：Generator 是"半协程"——调用方控制执行流。

## 技术错误纠正

- "Generator 不能拿到 return 的值"——`next()` 最后返回 `{ value: returnVal, done: true }`，但 `for...of` 和展开语法会忽略 `done: true` 时的 value。
- "yield 和 return 差不多"——yield 可以出现多次暂停并输出多个值，return 只一次终止。

## 知识点系统梳理

### 基本流程

```js
function* counter() {
  console.log('start')
  yield 1
  console.log('resume 1')
  yield 2
  console.log('resume 2')
  yield 3
  console.log('end')
  return 'done'
}

const gen = counter() // 未执行——gen 只是 Generator 对象
gen.next()            // 'start' → { value: 1, done: false }
gen.next()            // 'resume 1' → { value: 2, done: false }
gen.next()            // 'resume 2' → { value: 3, done: false }
gen.next()            // 'end' → { value: 'done', done: true }
gen.next()            // { value: undefined, done: true }
```

### 双向传参

```js
function* add() {
  const a = yield 'give a'
  const b = yield 'give b'
  return a + b
}

const gen = add()
gen.next()       // { value: 'give a', done: false } ← 第一次 next 启动
gen.next(10)     // { value: 'give b', done: false } ← 10 赋给 a
gen.next(20)     // { value: 30, done: true } ← 20 赋给 b，返回 a+b
```

### yield* 委托

```js
function* inner() { yield 'a'; yield 'b' }
function* outer() {
  yield 'start'
  yield* inner()   // 委托给 inner
  yield 'end'
}

;[...outer()] // ['start', 'a', 'b', 'end']

// 等价于：
function* outer2() {
  yield 'start'
  for (const v of inner()) yield v
  yield 'end'
}
```

### 错误处理

```js
function* safe() {
  try {
    yield 1
    yield 2
  } catch (e) {
    console.log('caught:', e.message)
  }
  yield 3
}

const gen = safe()
gen.next()           // { value: 1 }
gen.throw(new Error('oops')) // 'caught: oops' → { value: 3 }
gen.next()           // { value: undefined, done: true }
```

### 终止 Generator

```js
function* infinite() { let i = 0; while (true) yield i++ }

const g = infinite()
g.next()          // { value: 0 }
g.return('stop')  // { value: 'stop', done: true }
g.next()          // { value: undefined, done: true }
```

## 实战应用举例

### 示例 1：惰性求值——斐波那契数列

```js
function* fibonacci() {
  let [a, b] = [0, 1]
  while (true) {
    yield a;
    [a, b] = [b, a + b]
  }
}

const fib = fibonacci()
fib.next()  // { value: 0 }
fib.next()  // { value: 1 }
fib.next()  // { value: 1 }
fib.next()  // { value: 2 }

// 取前 10 个
;[...new Array(10)].map(() => fib.next().value)
```

### 示例 2：生成唯一 ID

```js
function* idGenerator(prefix = 'id') {
  let count = 0
  while (true) yield `${prefix}_${++count}`
}

const genId = idGenerator()
genId.next().value  // 'id_1'
genId.next().value  // 'id_2'
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 惰性生成数据序列 | Generator | 无限序列按需取值 |
| 异步流程控制 | async/await（更简洁） | Generator + Co 的升级版 |
| 自定义迭代器 | Generator `*[Symbol.iterator]()` | 最简洁的迭代器实现 |
| 协程式协作 | Generator | 暂停/恢复 + 双向传参 |
| 状态机 | Generator | yield 天然表示状态转移 |

## 易错点提示

- Generator 对象只能迭代**一次**（状态会前进），不能"倒带"重新开始。
- `for...of` 自动消费 Generator 到 `done: true`，但会忽略 `return` 语句的值。
- 第一次 `.next()` 不传参（参数被忽略）。从第二次 `next()` 开始传参赋给上一个 `yield` 表达式。
- `yield*` 不只是委托迭代——它也会传递 `.return()` 和 `.throw()` 到被委托的 Generator。
- Generator 内部 `return` 后的值在 `done: true` 的 `value` 中，`for...of` 不会访问到。

## 记忆要点总结

- `function*` 定义，`yield` 暂停，`.next()` 恢复。
- 惰性：不调用 `next()` 就不执行。
- 双向传参：`gen.next(val)` → yield 表达式值为 val。
- `yield*` 委托给另一个 Generator 或可迭代对象。
- `for...of` 自动消费到 done。

## 延伸问题

1. Generator 和 async/await 有什么关系？
2. `yield` 和 `yield*` 有什么区别？
3. Generator 的 `.throw()` 可以在 Generator 内部被 try/catch 捕获吗？
4. 为什么说 Generator 是"半协程"？

## 可能类似的问题及简要参考答案

**Q：Generator 和普通函数有什么区别？**
A：Generator 可暂停/恢复，调用不执行函数体而是返回迭代器对象，可多次产出值。

**Q：如何向 Generator 内部传值？**
A：`gen.next(value)`，这个 value 会作为上一个 `yield` 表达式的返回值。

**Q：Generator 的 return 值能被 for...of 捕获吗？**
A：不能。`for...of` 在 `done: true` 时停止，`return` 的值在 `{ value, done: true }` 里，`for...of` 不会访问。

## 辅助记忆总结

记成一句话：Generator 是"可暂停的函数"——`yield` 踩刹车，`next()` 踩油门，每次暂停能把值抛出来，还能接住外面传回来的参数。
