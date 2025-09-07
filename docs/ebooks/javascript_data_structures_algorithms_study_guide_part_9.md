# JavaScript 数据结构与算法学习手册（第 3 版）- Part 9

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 9 章：递归（Recursion）与分治（Divide & Conquer）](#第-9-章递归recursion与分治divide--conquer)
  - [递归｜知识点介绍](#递归知识点介绍)
  - [递归｜系统梳理](#递归系统梳理)
  - [递归｜使用示例](#递归使用示例)
  - [递归｜实战应用举例](#递归实战应用举例)
  - [递归｜常见面试问题](#递归常见面试问题)
  - [递归｜使用场景选择指南](#递归使用场景选择指南)
  - [递归｜记忆要点总结](#递归记忆要点总结)
  - [分治｜知识点介绍](#分治知识点介绍)
  - [分治｜系统梳理](#分治系统梳理)
  - [分治｜使用示例](#分治使用示例)
  - [分治｜实战应用举例](#分治实战应用举例)
  - [分治｜常见面试问题](#分治常见面试问题)
  - [分治｜使用场景选择指南](#分治使用场景选择指南)
  - [分治｜记忆要点总结](#分治记忆要点总结)

---

## 第 9 章：递归（Recursion）与分治（Divide & Conquer）

> 递归是“函数调用自身”的编程技巧；分治是在递归基础上“分解-解决-合并”的通用模式。它们贯穿排序、搜索、图与树、组合搜索等问题的核心解法。

### 递归｜知识点介绍

- 定义：递归是函数直接或间接调用自己的过程。
- 基本原理：
  - 必须有“基例（base case）”终止条件。
  - 每次调用将问题规模缩小，并向基例收敛。
  - 调用过程依赖调用栈保存上下文（参数、局部变量、返回地址）。
- 复杂度：
  - 时间与空间复杂度通常可由递推式或递归树分析；递归深度决定栈空间（最坏 O(n)）。
- 注意：JS 引擎普遍不保证尾调用优化（TCO）；深递归可能导致 RangeError（Maximum call stack size exceeded）。

### 递归｜系统梳理

- 在知识体系中的位置：
  - 栈结构的直接应用；树/图天然适合递归遍历。
- 关联：
  - 与分治：递归是分治的载体；分治=分解子问题+合并结果。
  - 与动态规划：当子问题重叠时，递归+记忆化 => 自顶向下 DP。
  - 与回溯：递归枚举解空间，借助“做选择/撤销选择/递归”的模板。
- 核心特性：
  - 代码简洁、贴合问题结构；可能带来额外栈开销与重复计算。

### 递归｜使用示例

```js
// 1) 阶乘（演示基例与递归式）
function factorial(n) {
  if (n < 0) throw new Error('n must be >= 0')
  return n <= 1 ? 1 : n * factorial(n - 1)
}

// 2) Fibonacci：记忆化避免指数级重复计算
function fib(n, memo = new Map()) {
  if (n <= 1) return n
  if (memo.has(n)) return memo.get(n)
  const v = fib(n - 1, memo) + fib(n - 2, memo)
  memo.set(n, v)
  return v
}

// 3) 二叉树遍历（前序）
function preorder(root, visit = console.log) {
  if (!root) return
  visit(root.val)
  preorder(root.left, visit)
  preorder(root.right, visit)
}
```

### 递归｜实战应用举例

1. 组件/DOM 树查找目标节点（按谓词）

```js
function findInTree(node, predicate) {
  if (!node) return null
  if (predicate(node)) return node
  for (const child of node.children || []) {
    const hit = findInTree(child, predicate)
    if (hit) return hit
  }
  return null
}
```

2. 深拷贝（含循环引用处理）

```js
function deepClone(obj, seen = new Map()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (seen.has(obj)) return seen.get(obj)
  const out = Array.isArray(obj) ? [] : {}
  seen.set(obj, out)
  for (const k of Object.keys(obj)) out[k] = deepClone(obj[k], seen)
  return out
}
```

3. 回溯：生成全排列

```js
function permutations(nums) {
  const res = [],
    used = Array(nums.length).fill(false),
    path = []
  const dfs = () => {
    if (path.length === nums.length) {
      res.push(path.slice())
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(nums[i])
      dfs()
      path.pop()
      used[i] = false
    }
  }
  dfs()
  return res
}
```

### 递归｜常见面试问题

1. 递归三要素？
   - 答：明确函数的含义/返回值；基例；递归关系（缩小规模并收敛）。
2. 如何避免栈溢出？
   - 答：改迭代；显式栈；分块递归；尾递归（JS 不保证 TCO）。
3. 记忆化与自底向上 DP 的比较？
   - 答：前者易写、只算必要子问题；后者空间可控、顺序明确，适合大规模。
4. 回溯模板？
   - 答：for 选择 -> 做选择 -> 递归 -> 撤销选择；结合剪枝降低复杂度。
5. 递归复杂度如何分析？
   - 答：递归树/主定理/展开法；关注每层工作量与层数。

### 递归｜使用场景选择指南

- 何时用递归：树/图遍历；子问题结构与原问题同构；枚举/回溯。
- 优点：贴合结构、易于表达；
- 缺点：栈深限制、潜在重复计算；
- 替代：迭代+显式栈、DP、分层循环。

### 递归｜记忆要点总结

- 基例+递推+收敛三要素；
- 记忆化可降指数到线性；
- JS 无 TCO，深递归需转迭代/分块。

---

### 分治｜知识点介绍

- 定义：将问题划分为若干规模更小但结构相同的子问题，递归求解并合并结果。
- 模板：Divide（分）→ Conquer（解）→ Combine（合）。
- 典型算法：快速排序、归并排序、二分搜索、最近点对、快速选择（Quickselect）。
- 复杂度：常以 T(n) = a T(n/b) + f(n) 表示，依据主定理判断增长级。

### 分治｜系统梳理

- 与递归：分治通常以递归实现；
- 与 DP：当子问题重叠且可记忆化/表填充时可降复杂度；
- 与并行：子问题独立性强，易并行化（Web Workers/线程）。
- 核心属性：
  - 子问题规模均衡与否决定性能；
  - 合并开销 f(n) 的大小影响总体复杂度。

### 分治｜使用示例

```js
// 1) 归并思想：计算逆序对个数（O(n log n)）
function countInversions(arr) {
  const a = arr.slice()
  function sort(l, r) {
    // [l,r)
    if (r - l <= 1) return 0
    const m = (l + r) >> 1
    let inv = sort(l, m) + sort(m, r)
    const tmp = []
    let i = l,
      j = m
    while (i < m && j < r) {
      if (a[i] <= a[j]) tmp.push(a[i++])
      else {
        tmp.push(a[j++])
        inv += m - i
      }
    }
    while (i < m) tmp.push(a[i++])
    while (j < r) tmp.push(a[j++])
    for (let k = 0; k < tmp.length; k++) a[l + k] = tmp[k]
    return inv
  }
  return sort(0, a.length)
}

// 2) 快速选择：期望 O(n) 找第 k 小（k 从 0 开始）
function quickSelect(arr, k) {
  let l = 0,
    r = arr.length - 1
  while (l <= r) {
    const pivot = arr[Math.floor(Math.random() * (r - l + 1)) + l]
    let i = l,
      j = r
    while (i <= j) {
      while (arr[i] < pivot) i++
      while (arr[j] > pivot) j--
      if (i <= j) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        i++
        j--
      }
    }
    if (k <= j) r = j
    else if (k >= i) l = i
    else return arr[k]
  }
  return undefined
}

// 3) 最近点对（简化一维版：最近相邻差，O(n log n)）
function closestPair1D(arr) {
  const a = arr.slice().sort((x, y) => x - y)
  let best = Infinity
  for (let i = 1; i < a.length; i++) best = Math.min(best, a[i] - a[i - 1])
  return best
}
```

### 分治｜实战应用举例

1. 大数组 TopK：分片+局部 TopK + 归并（适合分页数据流）

```js
function topKChunked(chunks, k) {
  // chunks: number[][]
  // 每片取 TopK（用小顶堆或排序），再合并再取 TopK
  const flattened = []
  for (const c of chunks) {
    const local = c
      .slice()
      .sort((a, b) => b - a)
      .slice(0, k)
    flattened.push(...local)
  }
  return flattened.sort((a, b) => b - a).slice(0, k)
}
```

2. 前端图片切片处理（分片并行，主线程合并）

```js
async function mapDivideCombine(items, mapFn, { chunkSize = 100 } = {}) {
  const out = []
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    const mapped = await Promise.all(chunk.map(mapFn))
    out.push(...mapped)
  }
  return out
}
```

3. 四叉树（Quadtree）构建与区域查询（二维空间分区）

```js
function buildQuadtree(
  points,
  depth = 0,
  maxDepth = 6,
  cap = 8,
  bbox = { x: 0, y: 0, w: 1, h: 1 },
) {
  if (points.length <= cap || depth >= maxDepth) return { bbox, points }
  const { x, y, w, h } = bbox
  const mx = x + w / 2,
    my = y + h / 2
  const q = [[], [], [], []]
  for (const p of points) {
    const idx = (p.y < my ? 0 : 2) + (p.x < mx ? 0 : 1)
    q[idx].push(p)
  }
  return {
    bbox,
    children: [
      buildQuadtree(q[0], depth + 1, maxDepth, cap, { x, y, w: w / 2, h: h / 2 }),
      buildQuadtree(q[1], depth + 1, maxDepth, cap, { x: mx, y, w: w / 2, h: h / 2 }),
      buildQuadtree(q[2], depth + 1, maxDepth, cap, { x, y: my, w: w / 2, h: h / 2 }),
      buildQuadtree(q[3], depth + 1, maxDepth, cap, { x: mx, y: my, w: w / 2, h: h / 2 }),
    ],
  }
}

function queryQuadtree(node, rect, out = []) {
  const { x, y, w, h } = node.bbox
  const hit = !(rect.x > x + w || rect.x + rect.w < x || rect.y > y + h || rect.y + rect.h < y)
  if (!hit) return out
  if (node.points) {
    for (const p of node.points)
      if (p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h)
        out.push(p)
  } else {
    for (const c of node.children) queryQuadtree(c, rect, out)
  }
  return out
}
```

### 分治｜常见面试问题

1. 主定理三种情形？
   - 答：设 T(n)=aT(n/b)+f(n)。
     - 若 f(n)=O(n^{log_b a - ε})，则 T(n)=Θ(n^{log_b a}).
     - 若 f(n)=Θ(n^{log_b a} log^k n)，则 T(n)=Θ(n^{log_b a} log^{k+1} n).
     - 若 f(n)=Ω(n^{log_b a + ε}) 且满足正则性，则 T(n)=Θ(f(n)).
2. 快速选择为何期望 O(n)？
   - 答：随机枢轴使划分期望均衡；递推期望解为线性级。
3. 何时切换到插入排序？
   - 答：分治到小规模（如 ≤32）时切换，常数更小，整体更快。
4. 分治并行化的注意点？
   - 答：任务拆分/合并开销与线程/worker 数量权衡，避免过度切分。
5. 二分答案是否分治？
   - 答：本质是对答案空间分治搜索（单调性），可视为分治范式的一种。

### 分治｜使用场景选择指南

- 何时使用：能自然拆分为子问题且合并代价可控；排序/选择/空间索引/图算法。
- 优点：结构清晰、易优化与并行；
- 缺点：合并开销与栈深；当子问题不独立或不均衡时退化。
- 替代：线性时间算法（若存在）、动态规划（有重叠子问题）。

### 分治｜记忆要点总结

- 模板：分-解-合；
- T(n)=aT(n/b)+f(n) 抓住 a、b、f(n)；
- 小规模切换更快；随机化可降最坏。

---

> 下一篇（Part 10，单独文件）将覆盖：动态规划（Dynamic Programming），从记忆化到表填充，剖析典型模型与前端实际用例。
