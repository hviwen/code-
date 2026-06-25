# 114. [高级] 生成器的实际应用场景有哪些？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Generator 的核心应用围绕**惰性求值**和**暂停/恢复**。典型场景：无限序列（斐波那契、ID 生成器）、状态机（yield 表示每个状态）、异步流程控制（co 库核心）、自定义迭代器、数据管道（yield* 链式组合）。

一句话答法：Generator 用于惰性无限序列、状态机建模（每次 yield 一个状态）、异步控制（co 库让异步像同步）、自定义可迭代对象、数据管道流式处理。

## 问题意图

1. 能否说出 3 个以上 Generator 的实际应用场景。
2. 是否知道 async/await 是 Generator + Promise 的语法糖。
3. 是否能写出 Generator 实现无限序列、状态机或数据管道的代码。
4. 是否了解 yield* 在组合 Generator 中的作用。

## 考察范围

- 无限序列：斐波那契、素数、ID 生成器（惰性按需取值）。
- 状态机：每个 `yield` 是一个状态，`next()` 驱动转移。
- 异步流程控制：Generator 产出 Promise，外部自动执行器驱动（co 库）。
- 自定义迭代器：`*[Symbol.iterator]()` 一行让类可迭代。
- 数据管道：`yield*` 串联多个转换 Generator。
- 树结构遍历：`yield*` 递归遍历树。
- async/await 是 Generator + Promise 的语法糖。

## 技术错误纠正

- "Generator 可以替代 async/await"——不准确。async/await 是语言级支持，错误处理更自然。Generator 的异步控制需自动执行器。
- "Generator 能并行执行"——不能。Generator 是串行暂停/恢复，不涉及并行。

## 知识点系统梳理

### 场景 1：无限序列

```js
function* fibonacci() {
  let [a, b] = [0, 1]
  while (true) { yield a; [a, b] = [b, a + b] }
}

function* take(iter, n) {
  let i = 0
  for (const v of iter) { if (i++ >= n) break; yield v }
}

;[...take(fibonacci(), 5)]  // [0, 1, 1, 2, 3]
```

### 场景 2：状态机

```js
function* trafficLight() {
  while (true) {
    yield 'green'    // 状态 1
    yield 'yellow'   // 状态 2
    yield 'red'      // 状态 3
  }
}

const light = trafficLight()
light.next().value  // 'green'
light.next().value  // 'yellow'
light.next().value  // 'red'
light.next().value  // 'green'（循环）
```

### 场景 3：异步控制（co 原理）

```js
function run(generator) {
  const gen = generator()
  function step(value) {
    const result = gen.next(value)
    if (result.done) return result.value
    return Promise.resolve(result.value).then(step)
  }
  return step()
}

// 使用：yield 一个 Promise
run(function* () {
  const user = yield fetch('/api/user').then(r => r.json())
  const posts = yield fetch(`/api/posts?userId=${user.id}`).then(r => r.json())
  return { user, posts }
}).then(console.log)
```

### 场景 4：数据管道

```js
function* map(iter, fn) { for (const v of iter) yield fn(v) }
function* filter(iter, pred) { for (const v of iter) if (pred(v)) yield v }

function* range(start, end) { for (let i = start; i < end; i++) yield i }

// 管道：取 0~20 中偶数的平方
const pipeline = take(
  map(
    filter(range(0, 20), x => x % 2 === 0),
    x => x * x
  ),
  3
)

;[...pipeline]  // [0, 4, 16] — 惰性求值
```

## 实战应用举例

### 示例：树的深度优先遍历

```js
class TreeNode {
  constructor(val) { this.val = val; this.children = [] }
  *[Symbol.iterator]() {
    yield this.val
    for (const child of this.children) yield* child
  }
}

const root = new TreeNode(1)
root.children = [new TreeNode(2), new TreeNode(3)]
root.children[0].children = [new TreeNode(4)]
;[...root]  // [1, 2, 4, 3]
```

## 使用场景说明和对比

| 场景 | Generator | async/await | 普通函数 |
| --- | --- | --- | --- |
| 无限序列 | ✅ 天然 | ❌ | ❌ |
| 状态机 | ✅ yield 表示状态 | ❌ | ✅ 需外部状态 |
| 异步控制 | ✅ 需执行器 | ✅ 语法简洁 | ❌ 回调地狱 |
| 自定义迭代器 | ✅ 一行代码 | ❌ | ✅ 手动实现 |

## 易错点提示

- Generator 异步控制需要自动执行器，不能像 async/await 自动。
- Generator 是串行的，不能并行两个异步——需要 `Promise.all` 配合。
- `yield*` 委托时，外层 `.return()` 和 `.throw()` 会穿透到内层 Generator。
- 在 async/await 时代，不要在一般异步场景中用 Generator。
- Generator 对象只能单次迭代，不能重置。

## 记忆要点总结

- 四大场景：无限序列、状态机、异步控制（co）、数据管道。
- async/await = Generator + Promise + 自动执行器（语法糖）。
- 现代用途主要是 `*[Symbol.iterator]()` 自定义可迭代类。

## 延伸问题

1. co 库是如何自动执行 Generator 的？
2. Generator 和 async/await 在错误处理上有什么区别？

## 可能类似的问题及简要参考答案

**Q：Generator 在异步编程中的应用？**
A：co 在 Generator 中 yield Promise，自动执行器在 Promise resolve 后调用 `.next()` 恢复执行。async/await 是此模式的语言级支持。

**Q：async/await 能替代 Generator 吗？**
A：部分替代（异步场景），不能替代（惰性序列、状态机、自定义迭代器）。

## 辅助记忆总结

记成一句话：Generator 四大用——无限序列惰性产、状态机 yield 做状态、数据管道链式处理、自定义迭代器一行搞定。
