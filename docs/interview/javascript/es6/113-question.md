# 113. [中级] 生成器函数的语法和特点

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Generator 函数用 `function*` 声明，内部通过 `yield` 关键字暂停/恢复执行。调用 Generator 函数不执行函数体，而是返回 Generator 对象。`.next()` 方法推进执行到下一个 `yield`。

一句话答法：`function* gen() { yield 1; yield 2 }` 定义生成器，返回 Generator 对象。`gen.next()` 返回 `{ value, done }`。Generator 可暂停/恢复、惰性求值、双向传参。

## 问题意图

1. 是否知道 `function*` 语法和 `yield` 关键字的作用。
2. 是否理解 Generator 的暂停/恢复机制。
3. 是否知道 Generator 的 `next()` 可以传参（将值传回生成器内部）。
4. 是否知道 `yield*` 委托给另一个可迭代对象。

## 考察范围

- `function*` 声明 Generator 函数。
- `yield` 暂停执行并产出值。
- `.next(value)` 返回值 `{ value, done }` 并恢复执行，`value` 传入生成器。
- `.return(value)` 提前终止，`.throw(error)` 向生成器抛异常。
- `yield*` 委托给另一个可迭代对象或 Generator。
- 生成器实现了 `[Symbol.iterator]` 协议。
- Generator 函数是惰性的——调用不执行，`next()` 才执行。
- 双向传参：`next(val)` → yield 表达式的值。

## 技术错误纠正

- "Generator 函数和普通函数没有区别"——区别很大：Generator 可暂停，多次返回值，调用不执行函数体。
- "`yield` 就是 `return`"——`yield` 可以出现多次，每次暂停并产出值；`return` 只一次终止。

## 知识点系统梳理

### 基本语法

```js
function* counter() {
  console.log('start')
  yield 1
  console.log('middle')
  yield 2
  console.log('end')
}

const gen = counter()  // 未执行，只创建 Generator 对象
gen.next()  // 'start' → { value: 1, done: false }
gen.next()  // 'middle' → { value: 2, done: false }
gen.next()  // 'end' → { value: undefined, done: true }
```

### 双向传参

```js
function* add() {
  const a = yield 'give a'
  const b = yield 'give b'
  return a + b
}

const gen = add()
gen.next()        // { value: 'give a', done: false }
gen.next(10)      // { value: 'give b', done: false } ← 10 赋给 a
gen.next(20)      // { value: 30, done: true } ← 20 赋给 b
```

### yield* 委托

```js
function* inner() { yield 'a'; yield 'b' }
function* outer() {
  yield 'start'
  yield* inner()   // 委托
  yield 'end'
}

;[...outer()] // ['start', 'a', 'b', 'end']
```

### 错误处理

```js
function* safe() {
  try {
    yield 1
  } catch (e) {
    console.log('caught:', e.message)
  }
  yield 2
}

const gen = safe()
gen.next()                // { value: 1 }
gen.throw(new Error('x')) // 'caught: x' → { value: 2 }
```

## 实战应用举例

### 示例 1：惰性 ID 生成器

```js
function* idGen(prefix = 'ID') {
  let i = 0
  while (true) yield `${prefix}_${++i}`
}

const nextId = idGen()
nextId.next().value  // 'ID_1'
nextId.next().value  // 'ID_2'
```

### 示例 2：斐波那契

```js
function* fib() {
  let [a, b] = [0, 1]
  while (true) { yield a; [a, b] = [b, a + b] }
}
```

## 使用场景说明和对比

| 特性 | Generator | 普通函数 |
| --- | --- | --- |
| 调用时机 | 返回迭代器，不执行体 | 立即执行 |
| 产出的值 | 多次（每次 yield） | 一次（return） |
| 状态保持 | 自动（yield 保持上下文） | 需闭包或全局变量 |
| 惰性 | 是 | 否 |

## 易错点提示

- Generator 对象只能迭代一次（状态前进不可逆）。
- 第一次 `.next()` 不传参（参数被忽略）。从第二次开始传参赋给上一个 `yield`。
- `for...of` 自动消费 Generator 到 `done: true`，但会忽略 `return` 值。
- `yield*` 也会传递 `.return()` 和 `.throw()` 到被委托的 Generator。

## 记忆要点总结

- `function*` 定义，`yield` 暂停，`.next()` 恢复。
- 惰性：不 next 不执行。
- 双向传参：`gen.next(val)` → yield 赋值为 val。
- `yield*` 委托给其他可迭代对象。

## 延伸问题

1. Generator 和 async/await 的关系？
2. `next()` 传参时第一个 yield 如何接收？

## 可能类似的问题及简要参考答案

**Q：Generator 调用后立即执行吗？**
A：不。调用返回 Generator 对象，每次 `.next()` 才执行到下一个 `yield`。

**Q：如何向 Generator 内部传参？**
A：`gen.next(value)` 将 value 作为上一个 `yield` 的结果传入生成器内部。

## 辅助记忆总结

记成一句话：Generator = 可暂停函数 —— `yield` 踩刹车，`next()` 踩油门，每次暂停还能往外丢个值。
