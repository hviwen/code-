# 115. [高级] 如何使用生成器实现无限序列？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Generator 的惰性特性使"无限"成为可能——`while(true)` 中的 `yield` 会在每次 `.next()` 时暂停，不会耗尽 CPU 或内存。序列在逻辑上无限，实际只计算被请求的值。

一句话答法：`function* naturals() { let n = 0; while (true) yield n++ }`。`while(true)` 是逻辑循环，每次 `yield` 后暂停等待下一次 `.next()`。用 `take()` 辅助函数控制获取数量，不会死循环或内存溢出。

## 问题意图

1. 是否理解 Generator 的惰性特性——不 `next()` 就不执行。
2. 是否能写出无限序列的标准模式 `while(true) yield xxx`。
3. 是否知道如何控制从无限序列中仅取前 N 个值。
4. 是否能写出具体的无限序列（斐波那契、自然数、ID 生成器、周期序列）。

## 考察范围

- `while(true) { yield value }` 是无限序列标准模式。
- 惰性：不 `next()` 不执行，`while(true)` 不耗尽资源。
- 取前 N 个：`take(n)` 辅助函数、`for...of + break`、`Array.from({length:n}, () => gen.next().value)`。
- 常见无限序列：自然数、斐波那契、素数、ID 生成器、循环周期序列。
- `yield*` 组合无限序列。
- `[...gen]` 或 `Array.from(gen)` 在无限序列上是错误用法（死循环）。

## 技术错误纠正

- "无限序列会内存溢出"——不会。Generator 惰性求值，只记录当前状态和上次 yield 的值。
- "while(true) 在 Generator 中也会死循环"——不会。每次 `yield` 暂停执行，只有 `.next()` 才会继续。

## 知识点系统梳理

### 标准模式

```js
function* naturalNumbers(start = 0) {
  let n = start
  while (true) yield n++
}

const nums = naturalNumbers()
nums.next().value  // 0
nums.next().value  // 1
```

### 取前 N 个的三种方式

```js
const fib = fibonacci()

// 方式 1：take 辅助函数（可组合）
function* take(iter, n) {
  let i = 0
  for (const v of iter) { if (i++ >= n) break; yield v }
}

// 方式 2：for...of + break
const results = []
for (const v of fib) {
  if (results.length >= 5) break
  results.push(v)
}

// 方式 3：Array.from 映射
Array.from({ length: 10 }, () => fib.next().value)
```

### 常见无限序列

```js
// 自然数
function* naturals(start = 0) { while (true) yield start++ }

// 斐波那契
function* fibonacci() {
  let [a, b] = [0, 1]
  while (true) { yield a; [a, b] = [b, a + b] }
}

// ID 生成器
function* idGen(prefix = 'id') {
  let n = 0
  while (true) yield `${prefix}_${++n}`
}

// 周期循环
function* cycle(arr) {
  while (true) for (const v of arr) yield v
}

const week = cycle(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'])
week.next().value  // 'Mon'
// ...
week.next().value  // 'Mon'（循环）

// 偶数
function* evens() { let n = 0; while (true) yield n += 2 }
```

## 实战应用举例

### 示例 1：惰性管道——取被 3 整除的斐波那契

```js
function* fibonacci() { let a = 0, b = 1; while (true) { yield a; [a, b] = [b, a + b] } }
function* filter(iter, pred) { for (const v of iter) if (pred(v)) yield v }
function* take(iter, n) { let i = 0; for (const v of iter) if (i++ < n) yield v else break }

const fib = fibonacci()
const filtered = filter(fib, x => x % 3 === 0)
;[...take(filtered, 3)]  // [0, 3, 21]
```

### 示例 2：页码生成器

```js
function* pageGenerator(pageSize) {
  let page = 1
  while (true) {
    yield { page, pageSize, start: (page - 1) * pageSize }
    page++
  }
}

const pages = pageGenerator(20)
pages.next().value  // { page: 1, pageSize: 20, start: 0 }
```

## 使用场景说明和对比

| 场景 | Generator | 数组 |
| --- | --- | --- |
| 无限/超大序列 | ✅ 惰性，不占内存 | ❌ 无法表示无限 |
| 需要部分数据 | ✅ 按需取 | ❌ 需预生成全部 |
| 可组合管道 | ✅ yield* 链式 | ✅ 但需中间数组 |
| 数学序列 | ✅ 自然 | ❌ 需提前计算 |

## 易错点提示

- `[...gen]` 在无限序列上会导致无限循环（耗尽堆栈或内存）。
- Generator 是单次消费的，不能重置。想重头开始需要重新调用函数创建新实例。
- `for...of` 无限序列时**必须**加 `break`，否则无限循环。
- 每次 `next()` 只计算下一个值，逐个调用的性能比批量数组慢。
- `yield*` 委托给另一个无限 Generator 时，外层也必须有消费限制。

## 记忆要点总结

- `while(true) yield x` = 无限序列的标准语法。
- 惰性：不 next 不执行，不占额外内存。
- 取 N 个：`take()` + `for...of` + break。
- 常见：自然数、斐波那契、ID、周期循环。

## 延伸问题

1. 如何实现惰性 `map/filter/reduce` 作用于无限序列？
2. 无限序列能实现 `zip` 操作吗？

## 可能类似的问题及简要参考答案

**Q：Generator 的 while(true) 不会死循环吗？**
A：不会。每次 `yield` 挂起执行，等到下次 `.next()` 才继续。CPU 不会空转。

**Q：取无限序列前 N 个的最简洁方法？**
A：`function* take(iter, n) { let i=0; for(const v of iter) if(i++<n) yield v else break }` 然后用 `[...take(fib, 10)]`。

## 辅助记忆总结

记成一句话：Generator 的 `while(true) yield x` = 无限供应但按需生产的传送带 —— 你要才转，你不要就停。
