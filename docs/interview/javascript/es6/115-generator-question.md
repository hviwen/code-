# 115. [高级] 如何用 Generator 生成无限序列？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

利用 Generator 的惰性求值特性——`while(true)` 永不退出，每次 `yield` 挂起执行，外部 `.next()` 控制获取下一个值的节奏。不调用 `next()` 就不会计算，所以"无限"只是逻辑无限，内存不会爆炸。

一句话答法：`function* infiniteSeq() { let i = 0; while (true) yield i++ }`——`while(true)` 只是逻辑循环，每次 `yield` 后暂停，真正的"无限"通过 `for...of` 配合 `break` 或 `take` 函数控制获取数量。

## 问题意图

1. 是否理解 Generator 的惰性特性——无限序列不需要无限内存。
2. 是否能写出一个无限序列的生成函数（如自然数、斐波那契）。
3. 是否知道如何"取前 N 个"而不让循环跑满（`take` 模式或 `for...of` + `break`）。

## 考察范围

- `while(true) { yield value }` 是无限序列的标准模式。
- 惰性求值：不 `next()` 就不执行，内存安全。
- 取前 N 个的方式：`take()` 辅助函数、`for...of` + break、`Array.from({length: n}, () => gen.next().value)`。
- 具体示例：自然数、斐波那契、ID 生成器、随机数。
- 可组合性：`yield*` 委托和管道。
- 与普通 `while(true)` 区别：普通无限循环会耗尽 CPU，Generator 的 `while(true) yield` 会暂停。

## 技术错误纠正

- "无限序列会撑爆内存"——Generator 是惰性的。`while(true) yield` 不会预先生成所有值，只有 `.next()` 时才产生下一个。
- "调用 `for...of` 无限序列会死循环"——如果不加 `break` 确实会无限循环，但 Generator 本身不会因此占用更多内存。

## 知识点系统梳理

### 标准模式：惰性无限循环

```js
// 暂停在 yield，外部 next() 驱动向前
function* naturalNumbers(start = 0) {
  let n = start
  while (true) yield n++
}

const nums = naturalNumbers()
nums.next().value  // 0
nums.next().value  // 1
nums.next().value  // 2
```

### 取前 N 个的三种方式

```js
const fib = fibonacci()

// 方式 1：take 辅助函数
function* take(iter, n) {
  let i = 0
  for (const v of iter) { if (i++ >= n) break; yield v }
}
;[...take(fib, 5)]

// 方式 2：for...of + break
const results = []
for (const v of fib) {
  if (results.length >= 5) break
  results.push(v)
}

// 方式 3：.next() 手动取值
Array.from({ length: 10 }, () => fib.next().value)
```

### 常见无限序列

```js
// 斐波那契
function* fibonacci() {
  let [a, b] = [0, 1]
  while (true) {
    yield a;
    [a, b] = [b, a + b]
  }
}

// 素数（埃氏筛迭代版）
function* primes() {
  yield 2
  const sieved = new Map()
  let n = 3
  while (true) {
    const step = sieved.get(n)
    if (step !== undefined) {
      sieved.delete(n)
      let next = n + step
      while (sieved.has(next)) next += step
      sieved.set(next, step)
    } else {
      yield n
      sieved.set(n * n, 2 * n)
    }
    n += 2
  }
}

// ID 生成器
function* idGen(prefix = 'id') {
  let count = 0
  while (true) yield `${prefix}_${++count}`
}

// 循环周期序列
function* cycle(arr) {
  while (true) for (const v of arr) yield v
}
const weekDays = cycle(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
weekDays.next().value  // 'Mon'
// ...
weekDays.next().value  // 'Sun'
weekDays.next().value  // 'Mon'（循环）
```

## 实战应用举例

### 示例 1：取偶数斐波那契

```js
function* fibonacci() { let a = 0, b = 1; while (true) { yield a; [a, b] = [b, a + b] } }
function* filter(iter, pred) { for (const v of iter) if (pred(v)) yield v }

const fib = fibonacci()
const evenFib = filter(fib, x => x % 2 === 0)
;[...take(evenFib, 5)] // [0, 2, 8, 34, 144]
```

### 示例 2：滑动窗口

```js
function* slidingWindow(arr, size) {
  for (let i = 0; i <= arr.length - size; i++) yield arr.slice(i, i + size)
}

;[...slidingWindow([1,2,3,4,5], 3)]
// [[1,2,3], [2,3,4], [3,4,5]]
```

## 使用场景说明和对比

| 场景 | Generator | 普通函数 |
| --- | --- | --- |
| 无限 ID 生成 | ✅ 惰性、不占内存 | ❌ 需要预生成或额外状态机 |
| 大文件行读取 | ✅ 流式、逐行 yield | ❌ 一次性读到内存 |
| 数学序列（斐波那契） | ✅ 惰性、节省内存 | ❌ 需要规划上限 |
| 已知有限列表 | ❌ 过度设计 | ✅ 数组直接返回 |

## 易错点提示

- `while(true)` 在 Generator 中是安全的——每次 `yield` 后暂停，不会死循环。但 `for...of` 消费无限序列时必须加 `break`。
- 无限序列不要试图 `[...gen]` 或 `Array.from(gen)`——这会耗尽内存/栈。
- Generator 是**单次消费**的，不能"重置"。每次重新生成需要再次调用 Generator 函数。
- `yield*` 委托给无限序列时要小心——`yield* infiniteSeq()` 也会被外层 `take` 控制。
- 每次 `next()` 调用只计算一个值，性能开销低，适合大量数据的惰性处理。

## 记忆要点总结

- `while(true) yield x` 是无限序列的语法模式。
- 惰性：不 next 不执行，无限循环不会耗尽 CPU 或内存。
- 消费量控制：`take()` 辅助函数 + `for...of` + break。
- 常用无限序列：自然数、斐波那契、ID、循环周期。

## 延伸问题

1. 如何组合两个无限序列（如 zip）？
2. 如何用 Generator 实现惰性求值的 map/filter/reduce？
3. Generator 惰性求值和函数式编程语言（如 Haskell）的惰性求值有什么不同？

## 可能类似的问题及简要参考答案

**Q：while(true) 在 Generator 中为什么不会导致死循环？**
A：因为每次 `yield` 会挂起函数执行，等待下一次 `.next()` 才继续。CPU 不会空转。

**Q：如何控制从无限序列中取多少个值？**
A：用 `take` 辅助函数：`function* take(iter, n) { let i = 0; for (const v of iter) if (i++ < n) yield v else break }`。

**Q：无限序列能重置吗？**
A：不能。每个 Generator 对象只能前进不能后退。要重新开始只能再次调用 Generator 函数创建一个新实例。

## 辅助记忆总结

记成一句话：Generator 的 `while(true) yield` = 一个按需生产的传送带——转一下产一个，不转就停，永远不占仓库。
