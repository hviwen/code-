# JavaScript 数据结构与算法学习手册（第 3 版）- Part 11

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 11 章：图算法（Graph Algorithms）](#第-11-章图算法graph-algorithms)
  - [图算法｜知识点介绍](#图算法知识点介绍)
  - [图算法｜系统梳理](#图算法系统梳理)
  - [图算法｜使用示例](#图算法使用示例)
  - [图算法｜实战应用举例](#图算法实战应用举例)
  - [图算法｜常见面试问题](#图算法常见面试问题)
  - [图算法｜使用场景选择指南](#图算法使用场景选择指南)
  - [图算法｜记忆要点总结](#图算法记忆要点总结)

---

## 第 11 章：图算法（Graph Algorithms）

> 图以“顶点 + 边”表示实体与关系。常见问题：遍历（BFS/DFS）、有向无环图排序（拓扑）、最短路径（BFS/Dijkstra/Bellman-Ford）、最小生成树（Prim/Kruskal）、连通性与并查集。

### 图算法｜知识点介绍

- 图的表示：
  - 邻接表（常用，稀疏图高效）；邻接矩阵（稠密图/常数判边）。
  - 有向/无向，加权/非加权，多源/单源。
- 基本能力：
  - 遍历：BFS（层次、最短边数）/DFS（深入、回溯）。
  - 有向无环图（DAG）：拓扑排序（线性化依赖）。
  - 最短路：
    - 无权：BFS。
    - 非负权：Dijkstra（用优先队列）。
    - 负权：Bellman-Ford（可检负环）。
  - 最小生成树（无向连通加权）：Kruskal（并查集）/Prim。

### 图算法｜系统梳理

- 与其他主题的关系：
  - DP 与 DAG：DAG 上的最短路径可视作 DP（拓扑序 DP）。
  - 并查集：Kruskal 排序边后逐步合并集合构造 MST。
  - 堆：Dijkstra 依赖最小堆高效取出最近节点。
- 复杂度要点：
  - BFS/DFS：O(V+E)。
  - Kahn 拓扑：O(V+E)。
  - Dijkstra（二叉堆）：O((V+E) log V)。
  - Bellman-Ford：O(V·E)。
  - Kruskal：O(E log E)（排序 + α(V) 并查集）。

> 设计小抄
>
> - 明确是否无权/非负权/存在负权。
> - 有依赖关系用拓扑序；检测环时看是否拿到完整拓扑序。
> - 无向连通加权求覆盖全点的最小总权，选 MST（Kruskal/Prim）。

### 图算法｜使用示例

```js
// 工具：构建邻接表
function buildGraph(n, edges, directed = true, weighted = false) {
  const g = Array.from({ length: n }, () => [])
  for (const e of edges) {
    if (!weighted) {
      const [u, v] = e
      g[u].push(v)
      if (!directed) g[v].push(u)
    } else {
      const [u, v, w] = e
      g[u].push([v, w])
      if (!directed) g[v].push([u, w])
    }
  }
  return g
}

// 1) BFS（最短边数）
function bfsShortestSteps(n, edges, src, dst) {
  const g = buildGraph(n, edges, true, false)
  const dist = Array(n).fill(Infinity)
  const q = [src]
  dist[src] = 0
  for (let i = 0; i < q.length; i++) {
    const u = q[i]
    if (u === dst) return dist[u]
    for (const v of g[u])
      if (dist[v] === Infinity) {
        dist[v] = dist[u] + 1
        q.push(v)
      }
  }
  return dist[dst] === Infinity ? -1 : dist[dst]
}

// 2) DFS（递归与栈）
function dfsRecursive(n, edges, start) {
  const g = buildGraph(n, edges)
  const seen = Array(n).fill(false)
  const order = []
  ;(function go(u) {
    seen[u] = true
    order.push(u)
    for (const v of g[u]) if (!seen[v]) go(v)
  })(start)
  return order
}

function dfsIterative(n, edges, start) {
  const g = buildGraph(n, edges)
  const seen = Array(n).fill(false)
  const st = [start]
  const order = []
  while (st.length) {
    const u = st.pop()
    if (seen[u]) continue
    seen[u] = true
    order.push(u)
    for (let i = g[u].length - 1; i >= 0; i--) {
      const v = g[u][i]
      if (!seen[v]) st.push(v)
    }
  }
  return order
}

// 3) 拓扑排序（Kahn，检测环）
function topoSort(n, edges) {
  const g = Array.from({ length: n }, () => [])
  const indeg = Array(n).fill(0)
  for (const [u, v] of edges) {
    g[u].push(v)
    indeg[v]++
  }
  const q = []
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i)
  const order = []
  for (let i = 0; i < q.length; i++) {
    const u = q[i]
    order.push(u)
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v)
  }
  const hasCycle = order.length !== n
  return { order: hasCycle ? [] : order, hasCycle }
}

// 4) Dijkstra（最短路，非负权）
class MinHeap {
  constructor() {
    this.a = []
  }
  size() {
    return this.a.length
  }
  push(x) {
    this.a.push(x)
    this._up(this.a.length - 1)
  }
  pop() {
    if (!this.a.length) return undefined
    const t = this.a[0],
      b = this.a.pop()
    if (this.a.length) {
      this.a[0] = b
      this._down(0)
    }
    return t
  }
  _up(i) {
    const a = this.a
    while (i) {
      const p = (i - 1) >> 1
      if (a[p][0] <= a[i][0]) break
      ;[a[p], a[i]] = [a[i], a[p]]
      i = p
    }
  }
  _down(i) {
    const a = this.a
    for (;;) {
      let l = i * 2 + 1,
        r = l + 1,
        m = i
      if (l < a.length && a[l][0] < a[m][0]) m = l
      if (r < a.length && a[r][0] < a[m][0]) m = r
      if (m === i) break
      ;[a[m], a[i]] = [a[i], a[m]]
      i = m
    }
  }
}
function dijkstra(n, edges, src) {
  // edges: [u,v,w], directed
  const g = buildGraph(n, edges, true, true)
  const dist = Array(n).fill(Infinity)
  const heap = new MinHeap()
  dist[src] = 0
  heap.push([0, src]) // [dist,node]
  while (heap.size()) {
    const [d, u] = heap.pop()
    if (d !== dist[u]) continue
    for (const [v, w] of g[u]) {
      const nd = d + w
      if (nd < dist[v]) {
        dist[v] = nd
        heap.push([nd, v])
      }
    }
  }
  return dist
}

// 5) Kruskal（最小生成树，总权与边集）
class UnionFind {
  constructor(n) {
    this.p = Array(n)
      .fill(0)
      .map((_, i) => i)
    this.r = Array(n).fill(0)
  }
  find(x) {
    return this.p[x] === x ? x : (this.p[x] = this.find(this.p[x]))
  }
  union(a, b) {
    a = this.find(a)
    b = this.find(b)
    if (a === b) return false
    if (this.r[a] < this.r[b]) [a, b] = [b, a]
    this.p[b] = a
    if (this.r[a] === this.r[b]) this.r[a]++
    return true
  }
}
function kruskal(n, edges) {
  // edges: [u,v,w] undirected
  const uf = new UnionFind(n)
  const sorted = edges.slice().sort((e1, e2) => e1[2] - e2[2])
  const mst = []
  let total = 0
  for (const [u, v, w] of sorted) {
    if (uf.union(u, v)) {
      mst.push([u, v, w])
      total += w
    }
    if (mst.length === n - 1) break
  }
  const connected = mst.length === n - 1
  return { total: connected ? total : Infinity, edges: connected ? mst : [] }
}
```

### 图算法｜实战应用举例

1. 前端构建依赖拓扑排序（确定打包/任务执行顺序）

```js
function resolveBuildOrder(modules, deps) {
  // deps: [a,b] 表示 a 依赖 b，边 b->a
  const nameToId = new Map(modules.map((m, i) => [m, i]))
  const n = modules.length
  const edges = deps.map(([a, b]) => [nameToId.get(b), nameToId.get(a)])
  const { order, hasCycle } = topoSort(n, edges)
  if (hasCycle) throw new Error('Circular dependency')
  return order.map(i => modules[i])
}
```

2. 路由/地图最短路径（Dijkstra）

```js
function shortestRoute(points, roads, srcName, dstName) {
  const nameToId = new Map(points.map((p, i) => [p, i]))
  const src = nameToId.get(srcName),
    dst = nameToId.get(dstName)
  const dist = dijkstra(points.length, roads, src)
  return dist[dst]
}
```

3. 图片懒加载优先级（构建小图、按距离或权重最小优先加载）

```js
function planPreload(n, links, start) {
  const dist = dijkstra(n, links, start)
  return dist
    .map((d, i) => [i, d])
    .sort((a, b) => a[1] - b[1])
    .map(([i]) => i)
}
```

### 图算法｜常见面试问题

1. BFS 与 DFS 的典型差异与应用？
   - 答：BFS 层序、求最短边数；DFS 深度优先、用于连通性、拓扑 DFS、回溯搜索。
2. 何时用 Dijkstra、BFS、Bellman-Ford？
   - 答：无权图最短路用 BFS；非负权用 Dijkstra；存在负权或需检负环用 Bellman-Ford。
3. 如何检测有向图环？
   - 答：Kahn 拓扑后若未覆盖所有节点则有环；或 DFS 灰色边法（递归栈）。
4. Kruskal 与 Prim 的取舍？
   - 答：稀疏图用 Kruskal 简洁高效；稠密图可用 Prim（配合堆或邻接矩阵）。
5. 为什么 Dijkstra 不适用于负权？
   - 答：其贪心选择依赖“最短前缀路径单调”，负权会破坏该性质。

### 图算法｜使用场景选择指南

- 如果是依赖/任务排序：拓扑排序（检测环并给出顺序）。
- 如果是最短路径：
  - 边权全为 1 或无权：BFS。
  - 非负权：Dijkstra（注意堆优化）。
  - 含负权或需要检负环：Bellman-Ford。
- 如果是网络连通与聚类：并查集；若需最小成本连接所有点：MST。

### 图算法｜记忆要点总结

- 建模先行：点集、边集、是否有向、是否有权。
- 复杂度基线：BFS/DFS/拓扑 O(V+E)；Dijkstra O((V+E)logV)；Kruskal O(ElogE)。
- 常见陷阱：
  - Dijkstra 不要用于负权；
  - 拓扑排序拿到的顺序未必唯一；
  - Kruskal 要判是否连通（边数是否达 n-1）。

---

> 下一篇（Part 12，单独文件）将覆盖：字符串算法与应用（Rolling Hash、KMP、Trie 混合检索）与前端文本处理实战。
