# JavaScript 数据结构与算法学习手册（第 3 版）- Part 7

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 7 章：堆（Heap）与优先队列（Priority Queue）](#第-7-章堆heap与优先队列priority-queue)
  - [堆（二叉堆）｜知识点介绍](#堆二叉堆知识点介绍)
  - [堆（二叉堆）｜系统梳理](#堆二叉堆系统梳理)
  - [堆（二叉堆）｜使用示例](#堆二叉堆使用示例)
  - [堆（二叉堆）｜实战应用举例](#堆二叉堆实战应用举例)
  - [堆（二叉堆）｜常见面试问题](#堆二叉堆常见面试问题)
  - [堆（二叉堆）｜使用场景选择指南](#堆二叉堆使用场景选择指南)
  - [堆（二叉堆）｜记忆要点总结](#堆二叉堆记忆要点总结)
  - [优先队列｜知识点介绍](#优先队列知识点介绍)
  - [优先队列｜系统梳理](#优先队列系统梳理)
  - [优先队列｜使用示例](#优先队列使用示例)
  - [优先队列｜实战应用举例](#优先队列实战应用举例)
  - [优先队列｜常见面试问题](#优先队列常见面试问题)
  - [优先队列｜使用场景选择指南](#优先队列使用场景选择指南)
  - [优先队列｜记忆要点总结](#优先队列记忆要点总结)

---

## 第 7 章：堆（Heap）与优先队列（Priority Queue）

> 堆是部分有序的完全二叉树结构（常用实现为数组二叉堆），支持在 O(log n) 时间插入与取顶。优先队列在堆之上定义“优先级更高的元素先出队”的抽象。

### 堆（二叉堆）｜知识点介绍

- 定义：堆是一种满足“堆序性质”的完全二叉树。最小堆要求任一节点不大于其子节点；最大堆相反。
- 基本原理：用数组表示完全二叉树，下标 i 的父子关系为 parent=(i-1)//2，left=2i+1，right=2i+2；通过上浮/下沉维持堆序。
- 复杂度：
  - 插入（push）：O(log n)
  - 取顶（pop/ extract）：O(log n)
  - peek：O(1)
  - 建堆（heapify，自底向上）：O(n)

### 堆（二叉堆）｜系统梳理

- 在体系中的位置：
  - 排序与选择问题（堆排序、TopK）、优先调度、图算法（Dijkstra/Prim）的基础。
- 关联关系：
  - 与二叉搜索树：堆仅局部有序，不支持有序遍历；BST 支持全序与范围查询。
  - 与优先队列：堆是优先队列的经典实现；也可用配对堆、二项堆、斐波那契堆等。
  - 与数组：二叉堆以数组实现，空间紧凑、局部性好。
- 核心特性：
  - 只关心堆顶最优，插入/删除堆顶对数时间，适合“持续选出最优元素”。

### 堆（二叉堆）｜使用示例

```js
// 可运行：通用二叉堆，支持 comparator（最小堆/最大堆）
class BinaryHeap {
  constructor(comparator = (a, b) => a - b, iterable = []) {
    this.cmp = comparator // 小于 0 表示 a < b
    this.heap = []
    for (const x of iterable) this.heap.push(x)
    if (this.heap.length) this._heapify()
  }
  size() {
    return this.heap.length
  }
  isEmpty() {
    return this.size() === 0
  }
  peek() {
    return this.heap[0]
  }
  push(x) {
    this.heap.push(x)
    this._siftUp(this.size() - 1)
    return this
  }
  pop() {
    const n = this.size()
    if (n === 0) return undefined
    const top = this.heap[0]
    const last = this.heap.pop()
    if (n > 1) {
      this.heap[0] = last
      this._siftDown(0)
    }
    return top
  }
  _parent(i) {
    return (i - 1) >> 1
  }
  _left(i) {
    return (i << 1) + 1
  }
  _right(i) {
    return (i << 1) + 2
  }
  _less(i, j) {
    return this.cmp(this.heap[i], this.heap[j]) < 0
  }
  _swap(i, j) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }
  _siftUp(i) {
    while (i > 0) {
      const p = this._parent(i)
      if (this._less(i, p)) {
        this._swap(i, p)
        i = p
      } else break
    }
  }
  _siftDown(i) {
    const n = this.size()
    while (true) {
      let s = i
      const l = this._left(i),
        r = this._right(i)
      if (l < n && this._less(l, s)) s = l
      if (r < n && this._less(r, s)) s = r
      if (s !== i) {
        this._swap(i, s)
        i = s
      } else break
    }
  }
  _heapify() {
    for (let i = (this.size() >> 1) - 1; i >= 0; i--) this._siftDown(i)
  }
}

// 最小堆与最大堆
const minHeap = new BinaryHeap((a, b) => a - b, [5, 3, 8, 1])
const maxHeap = new BinaryHeap((a, b) => b - a, [5, 3, 8, 1])
console.log(minHeap.pop(), minHeap.pop()) // 1,3
console.log(maxHeap.pop(), maxHeap.pop()) // 8,5
```

### 堆（二叉堆）｜实战应用举例

1. TopK 频次元素（小顶堆维持前 K 大）

```js
function topKFrequent(arr, k) {
  const freq = new Map()
  for (const x of arr) freq.set(x, (freq.get(x) || 0) + 1)
  const heap = new BinaryHeap((a, b) => a[1] - b[1]) // [val, cnt]
  for (const entry of freq) {
    heap.push(entry)
    if (heap.size() > k) heap.pop()
  }
  return heap.heap.sort((a, b) => b[1] - a[1]).map(([v]) => v)
}
```

2. 合并 K 个有序数组（小顶堆，O(n log k)）

```js
function mergeKSorted(lists) {
  const heap = new BinaryHeap((a, b) => a.val - b.val)
  const res = []
  for (let i = 0; i < lists.length; i++)
    if (lists[i].length) heap.push({ val: lists[i][0], i, j: 0 })
  while (!heap.isEmpty()) {
    const { val, i, j } = heap.pop()
    res.push(val)
    const nj = j + 1
    if (nj < lists[i].length) heap.push({ val: lists[i][nj], i, j: nj })
  }
  return res
}
```

3. 前端任务调度：根据优先级安排渲染/网络任务（最大堆）

```js
class Scheduler {
  constructor() {
    this.heap = new BinaryHeap((a, b) => b.priority - a.priority)
  }
  add(task, priority = 0) {
    this.heap.push({ task, priority })
  }
  runNext() {
    const item = this.heap.pop()
    return item ? item.task() : undefined
  }
}

// 用法
const sch = new Scheduler()
sch.add(() => console.log('low'), 1)
sch.add(() => console.log('high'), 10)
sch.add(() => console.log('mid'), 5)
sch.runNext() // high
```

### 堆（二叉堆）｜常见面试问题

1. 为什么建堆可以 O(n)？
   - 答：自底向上下沉，低层节点多但高度低，总工作量收敛为线性。
2. 堆与 BST 区别？
   - 答：堆只保证父子局部序，不支持有序遍历；BST 支持有序遍历与范围查询。
3. 使用数组下标实现堆的父子关系公式？
   - 答：parent=(i-1)//2，left=2i+1，right=2i+2。
4. 如何实现可自定义优先级的堆？
   - 答：引入 comparator，将“更小”定义为“更高优先级”或按需要调整。
5. 堆排序性质？
   - 答：基于最大堆的升序排序，时间 O(n log n)，空间 O(1)，不稳定。

### 堆（二叉堆）｜使用场景选择指南

- 何时使用：TopK/近似统计、在线合并、实时最优选择、优先调度、图最短路。
- 优点：插入/取顶 O(log n)、空间紧凑、实现简单。
- 缺点：不支持按值快速查找/删除任意元素；有序遍历不便。
- 替代方案：
  - 有序结构（平衡树/跳表）：需要按序/范围查询。
  - 选择算法（快速选择）：一次性找第 K 小更快（O(n) 期望）。

### 堆（二叉堆）｜记忆要点总结

- 数组表示完全二叉树；上浮/下沉维持堆序；建堆 O(n)、操作 O(log n)。
- 小顶堆求最小/维护前 K 大；大顶堆求最大/维护前 K 小（镜像使用）。

---

### 优先队列｜知识点介绍

- 定义：优先队列（Priority Queue）是一种抽象数据类型，元素带有优先级，出队时总返回优先级最高（或最低）的元素。
- 实现：常用二叉堆；也可用配对堆、二项堆、斐波那契堆，或基于桶（计数优先）在整数范围有限时实现 O(1)。
- 复杂度（以堆实现）：
  - 入队/出队：O(log n)
  - peek：O(1)

### 优先队列｜系统梳理

- 在体系中的位置：
  - 任务调度、路径规划、流处理的通用基础组件。
- 关联关系：
  - 与普通队列（FIFO）：优先队列按优先级而非时间顺序出队。
  - 与堆：堆是优先队列的常用实现载体。
  - 与定时器最小堆：浏览器/Node 计时轮或最小堆常用于高效定时任务管理。

### 优先队列｜使用示例

```js
class PriorityQueue {
  constructor(comparator = (a, b) => a.priority - b.priority) {
    this.heap = new BinaryHeap((a, b) => comparator(a, b)) // 默认最小优先
  }
  enqueue(value, priority = 0) {
    this.heap.push({ value, priority })
  }
  dequeue() {
    const x = this.heap.pop()
    return x && x.value
  }
  peek() {
    return this.heap.peek()?.value
  }
  size() {
    return this.heap.size()
  }
  isEmpty() {
    return this.heap.isEmpty()
  }
}

// 基本用法
const pq = new PriorityQueue()
pq.enqueue('low', 5)
pq.enqueue('high', 1)
console.log(pq.dequeue()) // 'high'
```

### 优先队列｜实战应用举例

1. Dijkstra 最短路径（非负边权）

```js
function dijkstra(n, edges, src) {
  const g = Array.from({ length: n }, () => [])
  for (const [u, v, w] of edges) {
    g[u].push([v, w])
    g[v].push([u, w])
  } // 若有向则去掉反向
  const dist = Array(n).fill(Infinity)
  dist[src] = 0
  const pq = new PriorityQueue((a, b) => a.priority - b.priority)
  pq.enqueue(src, 0)
  while (!pq.isEmpty()) {
    const u = pq.dequeue()
    const du = dist[u]
    for (const [v, w] of g[u]) {
      if (du + w < dist[v]) {
        dist[v] = du + w
        pq.enqueue(v, dist[v])
      }
    }
  }
  return dist
}
```

2. 动画/任务优先级调度（与 requestIdleCallback 类似思想）

```js
function createPriorityScheduler() {
  const pq = new PriorityQueue((a, b) => a.priority - b.priority) // 数值越小优先级越高
  let running = false
  function pump() {
    if (running) return
    running = true
    Promise.resolve().then(() => {
      const item = pq.dequeue()
      if (item) item()
      running = false
      if (!pq.isEmpty()) pump()
    })
  }
  return (task, priority = 0) => {
    pq.enqueue(task, priority)
    pump()
  }
}
```

3. TopK 流式去重推荐（按打分优先级）

```js
function topKStream(pushes, k) {
  const heap = new BinaryHeap((a, b) => a.score - b.score)
  for (const item of pushes) {
    if (heap.size() < k) heap.push(item)
    else if (item.score > heap.peek().score) {
      heap.pop()
      heap.push(item)
    }
  }
  return heap.heap.sort((a, b) => b.score - a.score)
}
```

### 优先队列｜常见面试问题

1. 为什么用堆实现优先队列而不是有序数组/链表？
   - 答：堆在入队/出队均为 O(log n)；有序数组入队 O(n)、链表出队 O(n)（或需要复杂的数据结构）。
2. 如何支持更新某个元素的优先级？
   - 答：需要定位该元素在堆中的位置（额外哈希表索引）并执行上浮/下沉；或插入新项并惰性丢弃旧项。
3. 多队列优先级如何公平？
   - 答：可使用多级反馈队列或时间片轮转；或在 comparator 中加入年龄衰减（aging）。
4. 与延时队列的关系？
   - 答：以过期时间为优先级的最小堆可实现定时/延时队列；队首即将到期任务。
5. 稳定性问题？
   - 答：堆不稳定；若需稳定，可将入队序号作为次级关键字。

### 优先队列｜使用场景选择指南

- 何时使用：最优任务先做、路径规划、流式 TopK、定时/延时队列、限流/退避策略。
- 优点：对数级性能、实现简洁、与 comparator 解耦。
- 缺点：不支持快速随机删除/更新；不稳定；需要额外索引才能支持 decrease-key。
- 替代方案：
  - 有序结构（平衡树）支持范围/顺序更好，但插入/删除常数更大。
  - 桶/计数排序思想在整数范围有限时更高效。

### 优先队列｜记忆要点总结

- 抽象：队首=最高优先级；实现常用堆。
- 更新优先级需位置信息（索引）或惰性删除策略。
- 定时/TopK/最短路/调度是高频应用。

---

> 下一篇（Part 8，单独文件）将覆盖：排序与搜索（快速排序、归并排序、二分查找等），并给出在前端中的实践与优化建议。
