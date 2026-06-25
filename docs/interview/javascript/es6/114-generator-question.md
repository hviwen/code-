# 114. [高级] Generator 的典型应用场景？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Generator 的核心应用围绕**惰性求值**和**异步流程控制**。典型场景包括：惰性生成无限序列、自定义迭代器、简化异步回调（`co` 库）、状态机建模、数据流管道处理、Generator 组合（`yield*` 委托）。

一句话答法：Generator 用于懒加载无限序列、实现自定义可迭代对象、异步流程控制（co 库让异步像同步）、状态机（每一步 yield 一个状态）、数据管道（链式 yield 转换）。

## 问题意图

1. 能否说出 3 个以上 Generator 的实际应用场景。
2. 是否知道 async/await 是 Generator + Promise 的语法糖。
3. 是否能写出 Generator 实现无限序列或自定义迭代器的完整代码。
4. 是否了解 Generator 在状态机场景中的应用（每个 yield 是一个状态）。

## 考察范围

- 无限序列生成：斐波那契、素数、ID 生成器。
- 自定义迭代器：`*[Symbol.iterator]()` 使类可迭代。
- 异步流程控制：co/koa 1.x 依赖 Generator 实现异步同步化。
- async/await 是 Generator + Promise + 自动执行器的语法糖。
- 状态机：yield 每个状态值，next 驱动状态转移。
- 数据管道：yield* 组合多个 Generator 做链式数据处理。
- 简化回调嵌套：Generator 做协程调度。

## 技术错误纠正

- "Generator 可以替代 async/await"——async/await 是 Generator + Promise 的语法糖，也更适合错误处理（try/catch 更自然）。Generator 的异步控制更底层的实现机制。
- "Generator 能并行执行"——不能。Generator 是串行的，yield 只暂停当前函数，不会并发执行。

## 知识点系统梳理

### 场景 1：无限序列/惰性求值

```js
function* naturalNumbers() {
  let n = 1
  while (true) yield n++
}

const nums = naturalNumbers()
nums.next().value  // 1
nums.next().value  // 2

// 取前 5 个
;[...new Array(5)].map(() => nums.next().value) // [3,4,5,6,7]
```

### 场景 2：状态机

```js
function* trafficLight() {
  while (true) {
    yield 'green'
    yield 'yellow'
    yield 'red'
  }
}

const light = trafficLight()
light.next().value  // 'green'
light.next().value  // 'yellow'
light.next().value  // 'red'
light.next().value  // 'green'

// 简化 async/await 中的状态流转
```

### 场景 3：异步流程控制（co 方案）

```js
// co 库让 Generator 自动执行 Promise
// 下面代码用 Generator 实现 "异步像同步"

function* fetchUser(id) {
  const user = yield fetch(`/api/user/${id}`).then(r => r.json())
  const posts = yield fetch(`/api/user/${id}/posts`).then(r => r.json())
  return { user, posts }
}

// async/await 是等价的语法糖
async function fetchUser(id) {
  const user = await fetch(`/api/user/${id}`).then(r => r.json())
  const posts = await fetch(`/api/user/${id}/posts`).then(r => r.json())
  return { user, posts }
}
```

### 场景 4：组合/管道

```js
function* map(iter, fn) {
  for (const v of iter) yield fn(v)
}

function* filter(iter, fn) {
  for (const v of iter) if (fn(v)) yield v
}

function* take(iter, n) {
  let i = 0
  for (const v of iter) { if (i++ >= n) break; yield v }
}

// 链式使用（没有中间数组）
const nums = take(
  filter(
    map(naturalNumbers(), x => x * 2),
    x => x % 3 === 0
  ),
  5
)

;[...nums] // 惰性求值：直到展开才真正计算
```

### 场景 5：简化递归——树的遍历

```js
class TreeNode {
  constructor(val) { this.val = val; this.children = [] }
  *depthFirst() {
    yield this.val
    for (const child of this.children) yield* child.depthFirst()
  }
}

const root = new TreeNode(1)
root.children = [new TreeNode(2), new TreeNode(3)]
root.children[0].children = [new TreeNode(4)]
;[...root.depthFirst()] // [1, 2, 4, 3]
```

## 实战应用举例

### 示例：Koa 1.x 中间件链

```js
// Koa 1.x 使用 Generator 实现中间件链
// 每个中间件是一个 Generator，yield next 交给下一个中间件

app.use(function* (next) {
  console.log('>> 1')
  yield next
  console.log('<< 1')
})

app.use(function* (next) {
  console.log('>> 2')
  yield next
  console.log('<< 2')
})

// 访问请求时输出：
// >> 1
// >> 2
// << 2
// << 1
// 这就是"洋葱模型"——Generator yield 天然支持
```

## 使用场景说明和对比

| 场景 | Generator | async/await | 普通函数 |
| --- | --- | --- | --- |
| 惰性生成无限序列 | ✅ 天然支持 | ❌ 不支持 | ❌ 一次性返回全部 |
| 异步流程控制 | ✅ 手动或 co | ✅ 语法简洁 | ❌ 回调地狱 |
| 自定义迭代器 | ✅ `*[Symbol.iterator]()` | ❌ | ✅ 需手动 next |
| 状态机 | ✅ yield 表示状态 | ❌ | ✅ 但需外部状态变量 |
| 数据管道 | ✅ yield* 链式 | ❌ | ❌ 需中间数组 |
| 一般业务逻辑 | ❌ 过度设计 | ✅ | ✅ |

## 易错点提示

- Generator 的异步控制需要自动执行器（co 或自己写的 runner），不能像 async/await 那样自动。
- Generator 是串行执行，不能在 Generator 内部并行两个异步操作——需要 `Promise.all` 配合。
- 在 async/await 时代，不要在新项目中使用 Generator 做异步控制（除非特殊情况）。
- Generator 做状态机时，每次 `next()` 驱动下一次状态转换——如果忘记调 `next` 状态不更新。
- `yield*` 委托时，外层的 `.return()` 和 `.throw()` 会穿透到内层 Generator。

## 记忆要点总结

- 四大场景：无限序列、状态机、异步控制（co）、数据管道。
- 核心优势：惰性求值 + 暂停恢复。
- async/await 是 Generator 异步控制的升级增强版。
- 现代应用：`*[Symbol.iterator]()` 自定义可迭代类。

## 延伸问题

1. 如何用 Generator 实现一个简单的状态机？
2. co 库是如何自动执行 Generator 的？
3. 为什么 Koa 2.x 放弃了 Generator 改用了 async/await？
4. 如何用 Generator 实现一个可暂停的动画循环？

## 可能类似的问题及简要参考答案

**Q：Generator 在异步编程中的应用？**
A：co 库利用 Generator + Promise 实现了"异步像同步"，每个 `yield` 等待一个 Promise 完成后自动恢复执行。async/await 是此模式的语言级支持。

**Q：为什么 Generator 不适合做一般的异步控制？**
A：需要额外的自动执行器，try/catch 不如 async/await 自然。async/await 完全替代了 Generator 的异步角色。

**Q：Generator 做状态机有什么好处？**
A：状态机本质是一个"存根+状态转移"模型，Generator 的 `yield` 天然表示暂停在某个状态，`next()` 表示状态转移，且内部变量自动保持，不需要外部状态表。

## 辅助记忆总结

记成一句话：Generator 四大应用——无限序列惰性产出、自定义迭代器一行搞定、异步控制（co/koa 1 洋葱模型）、管道链式数据处理。
