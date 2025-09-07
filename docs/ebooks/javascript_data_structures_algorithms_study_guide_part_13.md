# JavaScript 数据结构与算法学习手册（第 3 版）- Part 13

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 13 章：并查集与区间结构（Union-Find & Range Structures）](#第-13-章并查集与区间结构union-find--range-structures)
  - [并查集与区间结构｜知识点介绍](#并查集与区间结构知识点介绍)
  - [并查集与区间结构｜系统梳理](#并查集与区间结构系统梳理)
  - [并查集与区间结构｜使用示例](#并查集与区间结构使用示例)
  - [并查集与区间结构｜实战应用举例](#并查集与区间结构实战应用举例)
  - [并查集与区间结构｜常见面试问题](#并查集与区间结构常见面试问题)
  - [并查集与区间结构｜使用场景选择指南](#并查集与区间结构使用场景选择指南)
  - [并查集与区间结构｜记忆要点总结](#并查集与区间结构记忆要点总结)

---

## 第 13 章：并查集与区间结构（Union-Find & Range Structures）

> 并查集（Disjoint Set Union, DSU）擅长“连通性/分组”问题；区间结构（Fenwick/BIT、Segment Tree）高效处理“区间查询/单点更新”或更复杂的“区间更新/区间查询”。

### 并查集与区间结构｜知识点介绍

- 并查集：维护若干不相交集合，支持查找代表（find）与合并（union）。常用于连通分量、朋友圈、Kruskal 最小生成树。
- Fenwick/BIT（二叉索引树）：支持前缀和 O(log n) 与单点加 O(log n)，空间 O(n)。实现简单，常用于频率/计数、区间和。
- Segment Tree（线段树）：支持多种区间聚合（和/最值/自定义）与单点更新 O(log n)。可扩展懒标记支持区间更新。
- 复杂度：
  - DSU：近似 O(α(n))，几乎常数（α 为反阿克曼）。
  - Fenwick：O(log n)。
  - Segment Tree：O(log n)。

### 并查集与区间结构｜系统梳理

- 关系与取舍：
  - 需要“集合合并+连通性判断”→ DSU。
  - 需要“区间和/最值 + 单点更新”→ Fenwick 或 Segment Tree（Fenwick 更轻量）。
  - 需要“多类型聚合/区间更新/复杂函数”→ Segment Tree（可加懒标记）。
- 工程注意：
  - DSU 支持“按大小/按秩合并 + 路径压缩”。
  - Fenwick 1-indexed 更自然；注意索引偏移。
  - Segment Tree 推荐迭代写法（更简洁），懒标记需小心边界。

> 小抄
>
> - DSU：find 带路径压缩，union 按 size/rank。
> - Fenwick：lowbit = i & -i；sum(i) 为 1..i 的前缀和。
> - Segment Tree：点更改自底向上，区间查询双指针向上合并。

### 并查集与区间结构｜使用示例

```js
// 1) 并查集：按大小合并 + 路径压缩
class UnionFind {
  constructor(n) {
    this.p = Array.from({ length: n }, (_, i) => i)
    this.sz = Array(n).fill(1)
    this.sets = n
  }
  find(x) {
    if (this.p[x] !== x) this.p[x] = this.find(this.p[x])
    return this.p[x]
  }
  union(a, b) {
    a = this.find(a)
    b = this.find(b)
    if (a === b) return false
    if (this.sz[a] < this.sz[b]) [a, b] = [b, a]
    this.p[b] = a
    this.sz[a] += this.sz[b]
    this.sets--
    return true
  }
  connected(a, b) {
    return this.find(a) === this.find(b)
  }
  compSize(x) {
    return this.sz[this.find(x)]
  }
}

// 2) Fenwick/BIT：前缀和 + 单点加
class Fenwick {
  constructor(n) {
    this.n = n
    this.bit = Array(n + 1).fill(0)
  }
  add(i, delta) {
    // i: 1..n
    for (; i <= this.n; i += i & -i) this.bit[i] += delta
  }
  sum(i) {
    // 1..i 的前缀和
    let s = 0
    for (; i > 0; i -= i & -i) s += this.bit[i]
    return s
  }
  rangeSum(l, r) {
    if (r < l) return 0
    return this.sum(r) - this.sum(l - 1)
  }
}

// 3) Segment Tree（区间和 + 单点加，迭代写法）
class SegTreeSum {
  constructor(arr) {
    this.n = arr.length
    this.size = 1
    while (this.size < this.n) this.size <<= 1
    this.t = Array(this.size * 2).fill(0)
    for (let i = 0; i < this.n; i++) this.t[this.size + i] = arr[i]
    for (let i = this.size - 1; i > 0; i--) this.t[i] = this.t[i << 1] + this.t[(i << 1) | 1]
  }
  pointAdd(i, delta) {
    let p = this.size + i
    this.t[p] += delta
    for (p >>= 1; p; p >>= 1) this.t[p] = this.t[p << 1] + this.t[(p << 1) | 1]
  }
  rangeSum(l, r) {
    l += this.size
    r += this.size
    let res = 0
    while (l <= r) {
      if (l & 1) res += this.t[l++]
      if ((r & 1) === 0) res += this.t[r--]
      l >>= 1
      r >>= 1
    }
    return res
  }
}

// 4) Fenwick 扩展：区间加 + 单点查（差分思想）
class FenwickRangeAddPointQuery {
  constructor(n) {
    this.ft = new Fenwick(n)
  }
  rangeAdd(l, r, delta) {
    // 对 [l,r] 都加 delta（1-indexed）
    this.ft.add(l, delta)
    if (r + 1 <= this.ft.n) this.ft.add(r + 1, -delta)
  }
  pointQuery(i) {
    return this.ft.sum(i)
  }
}
```

### 并查集与区间结构｜实战应用举例

1. 社交圈合并与查询（DSU）

```js
// 用户注册后分配 id：0..n-1
function SocialGroups(n) {
  const uf = new UnionFind(n)
  return {
    addFriend(a, b) {
      uf.union(a, b)
    },
    inSameGroup(a, b) {
      return uf.connected(a, b)
    },
    groupSize(a) {
      return uf.compSize(a)
    },
    groupCount() {
      return uf.sets
    },
  }
}
```

2. 列表局部汇总（Fenwick/Segment Tree）：区间和秒算

```js
// 例如商品列表价格总和、可见区间的累计点赞等
const prices = [9, 12, 5, 7, 30, 21]
const bit = new Fenwick(prices.length)
for (let i = 0; i < prices.length; i++) bit.add(i + 1, prices[i])
// 求 [l,r] 的价格总和（0-indexed）
function sumPrices(l, r) {
  return bit.rangeSum(l + 1, r + 1)
}
// 单个商品打折 -3
bit.add(3 + 1, -3)
```

3. 区间活动加权（Fenwick：区间加 + 单点查）

```js
// 批量活动：对 [l,r] 的所有条目 +delta 权重；单个条目查询当前权重
const n = 8
const fw = new FenwickRangeAddPointQuery(n)
fw.rangeAdd(2, 5, 10)
fw.rangeAdd(4, 7, 3)
// 查询第 5 项的当前权重：应为 10 + 3 = 13
const weight5 = fw.pointQuery(5)
```

4. 实时看板（Segment Tree）：近 N 条事件的累计统计

```js
// 以固定窗口保存最近 N 条事件计数，支持子区间统计（如分页段）
const N = 16
const seg = new SegTreeSum(Array(N).fill(0))
function recordAt(idx, count = 1) {
  seg.pointAdd(idx, count)
}
function windowSum(l, r) {
  return seg.rangeSum(l, r)
}
// 记录事件
recordAt(2, 1)
recordAt(3, 4)
recordAt(10, 2)
const s23 = windowSum(2, 3) // 5
```

### 并查集与区间结构｜常见面试问题

1. 并查集的时间复杂度为何“几乎常数”？
   - 答：路径压缩 + 按秩/大小合并可将均摊复杂度降为 O(α(n))，α(n) 在实际数据范围内 < 5。
2. Fenwick 与 Segment Tree 的区别？
   - 答：Fenwick 实现轻量、常用于前缀和/区间和；Segment Tree 更通用，可支持多种聚合、区间更新（配懒标记）。
3. Segment Tree 为什么常用迭代写法？
   - 答：避免递归栈与函数开销，逻辑更直观（尤其点更新/区间查询）。
4. 如何支持区间更新？
   - 答：Fenwick 用差分/双树技巧；Segment Tree 加懒标记（延迟传播）。
5. 何时需要坐标压缩？
   - 答：当索引范围很大且稀疏时，将用到的坐标离散化到 1..m，便于 Fenwick/Segment Tree 处理。

### 并查集与区间结构｜使用场景选择指南

- 动态连通、分组、去重聚类：并查集。
- 频率统计、前缀/区间求和、在线更新：Fenwick。
- 多样聚合（和/最值/自定义函数）、需要区间更新或复杂查询：Segment Tree。
- 若仅偶尔查询，数组扫描可能更简单；当 n 大且更新频繁时才引入树结构。

### 并查集与区间结构｜记忆要点总结

- DSU：find 压缩 + union 按大小/秩；支持连通性与成分大小。
- Fenwick：1-indexed；lowbit 技巧；前缀和与区间和常用。
- Segment Tree：迭代点更改 + 双指针区间查询；需要区间更新时再引入懒标记。

---

> 下一篇（Part 14，单独文件）将覆盖：数学与位运算（数论基础、快速幂、位运算技巧、概率抽样）与前端实践。
