# JavaScript 数据结构与算法学习手册（第 3 版）- Part 10

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 10 章：动态规划（Dynamic Programming）](#第-10-章动态规划dynamic-programming)
  - [动态规划｜知识点介绍](#动态规划知识点介绍)
  - [动态规划｜系统梳理](#动态规划系统梳理)
  - [动态规划｜使用示例](#动态规划使用示例)
  - [动态规划｜实战应用举例](#动态规划实战应用举例)
  - [动态规划｜常见面试问题](#动态规划常见面试问题)
  - [动态规划｜使用场景选择指南](#动态规划使用场景选择指南)
  - [动态规划｜记忆要点总结](#动态规划记忆要点总结)

---

## 第 10 章：动态规划（Dynamic Programming）

> 动态规划通过“最优子结构 + 重叠子问题 + 状态转移”将指数级问题降为多项式时间。常见场景包括序列最优、路径计数/最短、编辑距离、背包选择、区间合并等。

### 动态规划｜知识点介绍

- 定义：将原问题分解为子问题，利用子问题最优解构成原问题最优解，并用表或记忆化保存中间结果避免重复计算。
- 基本原理：
  - 最优子结构：最优解可由子问题的最优解组成。
  - 重叠子问题：相同子问题被多次计算。
  - 状态与转移：定义状态（dp[i][j]...）并给出转移方程。
- 复杂度：
  - 时间：状态数 × 每个状态的转移复杂度。
  - 空间：存储状态的表大小（可优化为一维/滚动数组）。

### 动态规划｜系统梳理

- 位置：在算法设计中与分治、贪心并列；当贪心不成立而存在重叠子问题时常用 DP。
- 关联：
  - 与分治：DP 是“带缓存的分治”，常从递归（自顶向下）到表填充（自底向上）。
  - 与回溯：当搜索空间大但有结构时，用 DP 剪枝/重用中间解。
  - 与图：许多 DP 可转化为图上的最短路（DAG 动态规划）。
- 常见分类：
  - 线性 DP（斐波那契、爬楼梯、打家劫舍）。
  - 序列 DP（最长上升子序列 LIS、最长公共子序列 LCS）。
  - 区间/二维 DP（编辑距离、区间合并、石子合并）。
  - 背包类（0-1/完全/多重背包）。
  - 树形 DP（树上路径/聚合）。

> DP 设计“五步法”
>
> 1. 明确状态（维度与含义）
> 2. 明确转移（递归式/选择集）
> 3. 边界与初始化
> 4. 计算顺序（拓扑/层次/滚动）
> 5. 答案位置（dp 的哪一格/哪一层）

### 动态规划｜使用示例

```js
// 1) 爬楼梯（线性 DP）：f(n) = f(n-1)+f(n-2)
function climbStairs(n) {
  if (n <= 2) return n
  let a = 1,
    b = 2
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b]
  return b
}

// 2) 最长上升子序列 LIS（O(n log n) 牌堆法）
function lengthOfLIS(nums) {
  const tails = [] // tails[k] 表示长度为 k+1 的 LIS 的最小尾值
  for (const x of nums) {
    let l = 0,
      r = tails.length
    while (l < r) {
      const m = (l + r) >> 1
      if (tails[m] < x) l = m + 1
      else r = m
    }
    tails[l] = x
  }
  return tails.length
}

// 3) 编辑距离（Levenshtein，二维 DP）
function editDistance(a, b) {
  const m = a.length,
    n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1]
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

// 4) 0-1 背包（滚动数组，价值最大化）
function knapsack01(weights, values, cap) {
  // n 件物品
  const n = weights.length
  const dp = Array(cap + 1).fill(0)
  for (let i = 0; i < n; i++) {
    for (let c = cap; c >= weights[i]; c--) {
      dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i])
    }
  }
  return dp[cap]
}

// 5) 硬币找零（最少硬币数，完全背包）
function coinChange(coins, amount) {
  const INF = 1e9
  const dp = Array(amount + 1).fill(INF)
  dp[0] = 0
  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1)
    }
  }
  return dp[amount] === INF ? -1 : dp[amount]
}
```

### 动态规划｜实战应用举例

1. 文本差异对齐（编辑距离驱动的最短编辑脚本）

```js
function diffOps(a, b) {
  const m = a.length,
    n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1]
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  // 回溯生成操作
  const ops = []
  let i = m,
    j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      i--
      j--
      continue
    }
    const cur = dp[i][j]
    if (i > 0 && dp[i - 1][j] + 1 === cur) {
      ops.push(['del', a[i - 1]])
      i--
    } else if (j > 0 && dp[i][j - 1] + 1 === cur) {
      ops.push(['ins', b[j - 1]])
      j--
    } else {
      ops.push(['sub', a[i - 1], b[j - 1]])
      i--
      j--
    }
  }
  return ops.reverse()
}
```

2. 预算分配（0-1 背包在前端功能开关/收费项选择中的应用）

```js
// 在限定预算内选择最大收益的特性组合
function selectFeatures(features, budget) {
  const weights = features.map(f => f.cost)
  const values = features.map(f => f.value)
  const best = knapsack01(weights, values, budget)
  return best
}
```

3. 路由最短路径（DAG 上 DP）：拓扑序 O(V+E)

```js
function shortestPathDAG(n, edges, src) {
  // edges: [u,v,w]
  const g = Array.from({ length: n }, () => [])
  const indeg = Array(n).fill(0)
  for (const [u, v, w] of edges) {
    g[u].push([v, w])
    indeg[v]++
  }
  const q = []
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i)
  const topo = []
  while (q.length) {
    const u = q.shift()
    topo.push(u)
    for (const [v] of g[u]) if (--indeg[v] === 0) q.push(v)
  }
  const dist = Array(n).fill(Infinity)
  dist[src] = 0
  for (const u of topo) {
    for (const [v, w] of g[u]) dist[v] = Math.min(dist[v], dist[u] + w)
  }
  return dist
}
```

### 动态规划｜常见面试问题

1. 如何判断一个问题适合 DP？
   - 答：存在重叠子问题与最优子结构；贪心不满足“贪心选择性质”。
2. 设计状态与转移的套路？
   - 答：从递归定义出发，明确维度与边界；用选择集（取/不取、匹配/不匹配）推导转移。
3. 如何做空间优化？
   - 答：观察转移只依赖于前一行/列，使用滚动数组或一维数组逆序遍历。
4. LIS 为何能 O(n log n)？
   - 答：用“最小尾值数组”维护每个长度的最优尾，二分替换尾值即可。
5. 0-1/完全背包的遍历顺序为何不同？
   - 答：0-1 背包需逆序容量以避免重复使用同一物品；完全背包正序容量允许重复取用。

### 动态规划｜使用场景选择指南

- 何时用 DP：
  - 序列/字符串最优（编辑距离、LCS/LIS）。
  - 选择/组合（背包、分割）。
  - 路径计数/最短（网格/DAG）。
- 优点：将指数级降为多项式、方案通用。
- 缺点：状态设计成本、可能占用大量内存、实现细节易错。
- 替代：贪心（满足贪心性质）、分治（子问题独立）、图最短路（Dijkstra/Bellman-Ford）。

### 动态规划｜记忆要点总结

- 三件套：状态、转移、边界；答案位置要明确。
- 空间优化：滚动数组/一维化；遍历顺序与转移依赖匹配。
- 识别模式：线性/序列/区间/背包/树形 DP。

---

> 下一篇（Part 11，单独文件）将覆盖：图算法（Graph Algorithms）概览，包括 DFS/BFS 回顾、拓扑排序、最短路（Dijkstra/Bellman-Ford）、最小生成树（Prim/Kruskal）与前端应用。
