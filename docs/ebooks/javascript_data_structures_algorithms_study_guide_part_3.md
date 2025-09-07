# JavaScript 数据结构与算法学习手册（第 3 版）- Part 3

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 3 章：队列（Queue）与双端队列（Deque）](#第-3-章队列queue与双端队列deque)
  - [队列｜知识点介绍](#队列知识点介绍)
  - [队列｜系统梳理](#队列系统梳理)
  - [队列｜使用示例](#队列使用示例)
  - [队列｜实战应用举例](#队列实战应用举例)
  - [队列｜常见面试问题](#队列常见面试问题)
  - [队列｜使用场景选择指南](#队列使用场景选择指南)
  - [队列｜记忆要点总结](#队列记忆要点总结)
  - [双端队列｜知识点介绍](#双端队列知识点介绍)
  - [双端队列｜系统梳理](#双端队列系统梳理)
  - [双端队列｜使用示例](#双端队列使用示例)
  - [双端队列｜实战应用举例](#双端队列实战应用举例)
  - [双端队列｜常见面试问题](#双端队列常见面试问题)
  - [双端队列｜使用场景选择指南](#双端队列使用场景选择指南)
  - [双端队列｜记忆要点总结](#双端队列记忆要点总结)

---

## 第 3 章：队列（Queue）与双端队列（Deque）

> 队列是先进先出（FIFO）的受限线性表；双端队列（Deque）允许两端进出，能同时模拟栈与队列。它们在任务调度、BFS、滑动窗口、缓存淘汰等场景极为常见。

### 队列｜知识点介绍

- 定义：队列（Queue）支持在尾部入队（enqueue）与在头部出队（dequeue），遵循先进先出（FIFO）。
- 基本操作与复杂度（合理实现）：
  - enqueue(x)：O(1)
  - dequeue()：O(1)
  - front()/peek()：O(1)
  - size()/isEmpty()：O(1)
  - clear()：O(1)
- 注意：直接使用 `Array.prototype.shift()` 会导致出队 O(n)，应使用“头尾指针”或“循环队列”实现以保证均摊 O(1)。

### 队列｜系统梳理

- 在体系中的位置：
  - 与栈相对（LIFO vs FIFO），是图遍历（BFS）、任务调度、缓冲区管理的基础。
- 关联关系：
  - 与双端队列：Deque 支持两端操作，是队列的超集；可退化为队列或栈。
  - 与优先队列：当需要按优先级出队时，用堆实现的优先队列更合适。
  - 与事件循环：浏览器/Node.js 的宏任务/微任务队列是概念上的队列，但实现更复杂。
  - 与循环队列：固定容量、使用环形缓冲消除元素移动的开销。
- 核心特性：
  - 有序、单端进出、接口简单、吞吐稳定；适用于流式处理与公平调度。

> 复杂度速查（合理实现）
>
> | 操作    | 复杂度 |
> | ------- | ------ |
> | enqueue | O(1)   |
> | dequeue | O(1)   |
> | front   | O(1)   |
> | size    | O(1)   |

### 队列｜使用示例

```js
// 高性能队列实现：使用对象 + 头尾指针，避免 shift O(n)
class Queue {
  constructor(iterable = []) {
    this._store = Object.create(null)
    this._head = 0
    this._tail = 0
    for (const x of iterable) this.enqueue(x)
  }
  enqueue(x) {
    this._store[this._tail++] = x
    return this
  }
  dequeue() {
    if (this.isEmpty()) return undefined
    const x = this._store[this._head]
    delete this._store[this._head++]
    return x
  }
  front() {
    return this.isEmpty() ? undefined : this._store[this._head]
  }
  size() {
    return this._tail - this._head
  }
  isEmpty() {
    return this.size() === 0
  }
  clear() {
    this._store = Object.create(null)
    this._head = this._tail = 0
  }
  toArray() {
    const a = []
    for (let i = this._head; i < this._tail; i++) a.push(this._store[i])
    return a
  }
}

// 基本用法
const q = new Queue([1, 2])
q.enqueue(3).enqueue(4)
console.log(q.front()) // 1
console.log(q.dequeue()) // 1
console.log(q.size()) // 3
```

### 队列｜实战应用举例

1. 并发受控的异步任务队列（前端上传/抓取）

```js
class TaskQueue {
  constructor(concurrency = 2) {
    this.queue = new Queue()
    this.concurrency = concurrency
    this.running = 0
  }
  push(task) {
    // task: () => Promise<any>
    this.queue.enqueue(task)
    this._next()
  }
  _next() {
    while (this.running < this.concurrency && !this.queue.isEmpty()) {
      const task = this.queue.dequeue()
      this.running++
      Promise.resolve()
        .then(task)
        .catch(err => console.error('task error:', err))
        .finally(() => {
          this.running--
          this._next()
        })
    }
  }
}

// 示例
const tq = new TaskQueue(2)
const wait = ms => new Promise(r => setTimeout(r, ms))
for (let i = 1; i <= 5; i++) {
  tq.push(async () => {
    console.log('start', i)
    await wait(300)
    console.log('done', i)
  })
}
```

2. 广度优先搜索（BFS）层序遍历（树/图）

```js
function bfsTree(root) {
  // root: { val, left, right }
  if (!root) return []
  const q = new Queue([root])
  const res = []
  while (!q.isEmpty()) {
    const node = q.dequeue()
    res.push(node.val)
    if (node.left) q.enqueue(node.left)
    if (node.right) q.enqueue(node.right)
  }
  return res
}

// 用法示例
const tree = { val: 1, left: { val: 2 }, right: { val: 3 } }
console.log(bfsTree(tree)) // [1,2,3]
```

3. 请求重试队列（退避重试）

```js
class RetryQueue {
  constructor(maxRetries = 3, baseDelay = 200) {
    this.q = new Queue()
    this.maxRetries = maxRetries
    this.baseDelay = baseDelay
    this.running = false
  }
  add(fn) {
    // fn: () => Promise
    this.q.enqueue({ fn, tries: 0 })
    if (!this.running) this._drain()
  }
  async _drain() {
    this.running = true
    while (!this.q.isEmpty()) {
      const item = this.q.dequeue()
      try {
        await item.fn()
      } catch (e) {
        if (item.tries < this.maxRetries) {
          item.tries++
          const delay = this.baseDelay * 2 ** (item.tries - 1)
          await new Promise(r => setTimeout(r, delay))
          this.q.enqueue(item)
        } else {
          console.error('retry failed:', e)
        }
      }
    }
    this.running = false
  }
}
```

### 队列｜常见面试问题

1. 用两个栈实现队列的思路与复杂度？
   - 思路：入队栈 s1 负责 push，出队栈 s2 负责 pop；当 s2 为空时，将 s1 全量转移到 s2，再从 s2 弹出。
   - 复杂度：均摊入队/出队 O(1)。

2. 为什么 `Array.shift()` 不适合实现出队？替代方案是什么？
   - 答：shift 会移动剩余元素，O(n)；使用头尾指针或环形缓冲的实现，保证 O(1)。

3. 设计循环队列的满/空判定方法？
   - 答：预留一个空位：当 `(tail + 1) % cap === head` 视为满；`head === tail` 为空。

4. BFS 的时间/空间复杂度？
   - 答：邻接表图上为 O(V+E)；队列最坏空间 O(V)。

5. 何时使用优先队列替代普通队列？
   - 答：当需要按优先级出队，如调度任务、Dijkstra 等。

### 队列｜使用场景选择指南

- 何时使用：任务调度、生产者-消费者、BFS、缓冲区、节流/排队请求。
- 优点：接口简单、吞吐稳定、顺序语义清晰。
- 缺点：仅头尾访问，随机访问不便；固定容量时需溢出策略。
- 替代方案：
  - 双端队列：需要两端操作或滑动窗口时优先。
  - 优先队列：需要按优先级出队。
  - 栈：需要 LIFO 访问。

### 队列｜记忆要点总结

- FIFO；enqueue/dequeue/front/size O(1)（合理实现）。
- 避免 shift，使用头尾指针/环形缓冲。
- BFS/调度/缓冲场景常用；容量管理与溢出策略需提前设计。

---

### 双端队列｜知识点介绍

- 定义：双端队列（Deque, Double-Ended Queue）允许两端入队与出队：pushFront、pushBack、popFront、popBack。
- 复杂度（合理实现）：上述四类操作均为 O(1)。
- 常见实现：环形缓冲区、双向链表；在 JS 中可用“索引映射 + 头尾指针”高效实现。

### 双端队列｜系统梳理

- 在体系中的位置：
  - 队列的超集，亦可模拟栈；是单调队列与 LRU 缓存等结构的基石。
- 关联关系：
  - 与单调队列：通过在 deque 中维护单调性，O(n) 解决滑动窗口最值。
  - 与缓存淘汰：通过两端操作高效维护最近使用次序。
  - 与队列/栈：设置只用一端即可退化为栈；只用 pushBack/popFront 退化为队列。
- 核心特性：
  - 灵活的两端操作，支持窗口滑动、双向遍历、头尾插入删除。

### 双端队列｜使用示例

```js
// 简洁高效的 Deque：对象存储 + 可向两端扩展的索引
class Deque {
  constructor(iterable = []) {
    this._store = Object.create(null)
    this._head = 0
    this._tail = 0 // 指向尾后位置
    for (const x of iterable) this.pushBack(x)
  }
  size() {
    return this._tail - this._head
  }
  isEmpty() {
    return this.size() === 0
  }
  clear() {
    this._store = Object.create(null)
    this._head = 0
    this._tail = 0
  }
  pushBack(x) {
    this._store[this._tail++] = x
    return this
  }
  pushFront(x) {
    this._store[--this._head] = x
    return this
  }
  popFront() {
    if (this.isEmpty()) return undefined
    const x = this._store[this._head]
    delete this._store[this._head++]
    return x
  }
  popBack() {
    if (this.isEmpty()) return undefined
    const x = this._store[--this._tail]
    delete this._store[this._tail]
    return x
  }
  front() {
    return this.isEmpty() ? undefined : this._store[this._head]
  }
  back() {
    return this.isEmpty() ? undefined : this._store[this._tail - 1]
  }
  toArray() {
    const a = []
    for (let i = this._head; i < this._tail; i++) a.push(this._store[i])
    return a
  }
}

// 基本用法
const d = new Deque([2, 3])
d.pushFront(1).pushBack(4)
console.log(d.front(), d.back()) // 1 4
console.log(d.popFront()) // 1
console.log(d.popBack()) // 4
```

### 双端队列｜实战应用举例

1. 滑动窗口最大值（单调队列）— O(n)

```js
// 维护一个下标的递减队列：队首始终是当前窗口最大值的下标
function maxSlidingWindow(nums, k) {
  const dq = new Deque() // 存下标
  const res = []
  for (let i = 0; i < nums.length; i++) {
    // 1) 移除窗口外的下标
    while (!dq.isEmpty() && dq.front() <= i - k) dq.popFront()
    // 2) 维护递减性：尾部小于当前值的都出队
    while (!dq.isEmpty() && nums[dq.back()] <= nums[i]) dq.popBack()
    // 3) 当前下标入队
    dq.pushBack(i)
    // 4) 当形成窗口时记录答案
    if (i >= k - 1) res.push(nums[dq.front()])
  }
  return res
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)) // [3,3,5,5,6,7]
```

2. LRU 缓存（Map + 双向链表思想，简化为 Deque + Map）

```js
class LRUCache {
  constructor(capacity = 3) {
    this.cap = capacity
    this.deque = new Deque() // 头部为最近使用，尾部为最久未用
    this.pos = new Map() // key -> node-like: { key, value, indexRef }
  }
  _moveToFront(key) {
    // 简化实现：重新插入到头部；为保持 O(1)，这里用 Map 取值并在 deque 中线性删除会退化。
    // 实战可用“显式双向链表”存节点指针，这里演示语义正确性与用法。
    const value = this.pos.get(key).value
    this._deleteKey(key)
    this.deque.pushFront({ key, value })
    this.pos.set(key, { value })
  }
  _deleteKey(key) {
    // 简化：重建 deque（O(n)）。若需严格 O(1)，应使用双向链表维护节点引用。
    const arr = this.deque.toArray()
    this.deque.clear()
    for (const item of arr) if (item.key !== key) this.deque.pushBack(item)
    this.pos.delete(key)
  }
  get(key) {
    if (!this.pos.has(key)) return undefined
    const value = this.pos.get(key).value
    this._moveToFront(key)
    return value
  }
  set(key, value) {
    if (this.pos.has(key)) {
      this._deleteKey(key)
    } else if (this.deque.size() >= this.cap) {
      const least = this.deque.popBack()
      if (least) this.pos.delete(least.key)
    }
    this.deque.pushFront({ key, value })
    this.pos.set(key, { value })
  }
}

const cache = new LRUCache(2)
cache.set('a', 1)
cache.set('b', 2)
cache.get('a') // 访问 a，a 成为最近
cache.set('c', 3) // 淘汰 b
console.log(cache.get('b')) // undefined
console.log(cache.get('a')) // 1
```

3. 固定时间窗限流（滑动窗口计数）

```js
function createRateLimiter(limit, windowMs) {
  const dq = new Deque() // 存时间戳（ms）
  return function allow() {
    const now = Date.now()
    while (!dq.isEmpty() && now - dq.front() > windowMs) dq.popFront()
    if (dq.size() < limit) {
      dq.pushBack(now)
      return true
    }
    return false
  }
}

const allow = createRateLimiter(3, 1000)
console.log([1, 2, 3, 4, 5].map(() => allow())) // 前 3 个 true，后续可能 false
```

### 双端队列｜常见面试问题

1. 为什么 Deque 适合滑动窗口最值？
   - 答：可在尾部维护单调性、在头部弹出过期下标，保证每个元素入队/出队至多一次，整体 O(n)。

2. 如何用 Deque 实现 LRU？复杂度如何？
   - 答：Deque 维护最近使用次序，搭配哈希表 O(1) 查找；若用双向链表节点引用，可保证 get/set 均摊 O(1)。

3. Deque 与两个栈的关系？
   - 答：Deque 是更通用的两端结构；两个栈也能模拟队列，但 Deque 原生支持两端操作更简洁。

4. 基于数组与链表实现 Deque 的取舍？
   - 答：数组环形缓冲空间局部性好；链表插入删除 O(1) 且容量动态，但指针与 GC 开销更高。

5. 如何检测环形缓冲的满与空？
   - 答：保留空位或维护 size 变量；常用 `(tail + 1) % cap === head` 为满，`head === tail` 为空。

### 双端队列｜使用场景选择指南

- 何时使用：滑动窗口（最值/平均数）、LRU/LFU、双向遍历、任务调度需要头尾双操作的场景。
- 优点：两端 O(1) 操作，既能做队列也能做栈，适配滑动窗口。
- 缺点：实现较队列复杂；若用链表需维护节点与 GC；若用环形缓冲需扩容策略。
- 替代方案：
  - 队列：仅需尾入头出即可。
  - 优先队列：需要基于优先级取顶值。
  - 两个栈：能模拟队列，但不如 Deque 自然与高效。

### 双端队列｜记忆要点总结

- Deque：pushFront/pushBack/popFront/popBack 均 O(1)。
- 单调队列可 O(n) 解滑动窗口最值；LRU = 哈希表 + 双向链表/Deque。
- 环形缓冲/双向链表是常用底层实现；选择取决于缓存策略与性能特征。

---

> 下一篇（Part 4，单独文件）将覆盖：链表（Linked List），包含单链表、双向链表、循环链表及其常见操作与应用（LRU 更优实现、K 个一组反转等）。
