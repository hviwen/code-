# JavaScript 数据结构与算法学习手册（第 3 版）- Part 6

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 6 章：字典树（Trie）与树（Tree 基础、二叉搜索树 BST）](#第-6-章字典树trie与树tree-基础二叉搜索树-bst)
  - [字典树 Trie｜知识点介绍](#字典树-trie知识点介绍)
  - [字典树 Trie｜系统梳理](#字典树-trie系统梳理)
  - [字典树 Trie｜使用示例](#字典树-trie使用示例)
  - [字典树 Trie｜实战应用举例](#字典树-trie实战应用举例)
  - [字典树 Trie｜常见面试问题](#字典树-trie常见面试问题)
  - [字典树 Trie｜使用场景选择指南](#字典树-trie使用场景选择指南)
  - [字典树 Trie｜记忆要点总结](#字典树-trie记忆要点总结)
  - [二叉搜索树 BST｜知识点介绍](#二叉搜索树-bst知识点介绍)
  - [二叉搜索树 BST｜系统梳理](#二叉搜索树-bst系统梳理)
  - [二叉搜索树 BST｜使用示例](#二叉搜索树-bst使用示例)
  - [二叉搜索树 BST｜实战应用举例](#二叉搜索树-bst实战应用举例)
  - [二叉搜索树 BST｜常见面试问题](#二叉搜索树-bst常见面试问题)
  - [二叉搜索树 BST｜使用场景选择指南](#二叉搜索树-bst使用场景选择指南)
  - [二叉搜索树 BST｜记忆要点总结](#二叉搜索树-bst记忆要点总结)

---

## 第 6 章：字典树（Trie）与树（Tree 基础、二叉搜索树 BST）

> 本章覆盖经典树结构中的两类：前缀树（Trie）与二叉搜索树（BST）。Trie 面向字符串前缀检索，BST 面向有序集合的对数级查找与遍历。

### 字典树 Trie｜知识点介绍

- 定义：Trie（前缀树）是用于高效字符串前缀查找的树形结构，根节点为空，每条边表示一个字符，节点可标记“是否为一个完整单词”。
- 基本原理：按字符逐级索引；共享公共前缀，避免重复存储；支持前缀查询与词典操作。
- 时间复杂度（设单词长度为 L）：
  - 插入/查找单词：O(L)
  - 前缀查询 startsWith：O(L)
  - 删除：O(L)（自底向上清理冗余节点）
- 空间复杂度：与词典规模和字符集大小相关；共享前缀降低冗余。

### 字典树 Trie｜系统梳理

- 位置：字符串检索结构；适合自动补全、拼写检查、敏感词匹配。
- 关联：
  - 与哈希表：哈希表查整词 O(1) 期望，但不支持按前缀枚举；Trie 适合前缀/字典序。
  - 与后缀树/后缀数组：用于子串匹配，复杂度与适用面更广，但实现复杂。
  - 与压缩 Trie（Radix Tree/Patricia）：合并单分支路径，节省空间。
- 核心特性：按字符路径共享前缀、前缀检索友好、空间与字符集有关。

### 字典树 Trie｜使用示例

```js
// 可运行：Trie 的基本实现
class TrieNode {
  constructor() {
    this.children = new Map() // char -> TrieNode
    this.isWord = false
  }
}

class Trie {
  constructor(words = []) {
    this.root = new TrieNode()
    for (const w of words) this.insert(w)
  }
  insert(word) {
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode())
      node = node.children.get(ch)
    }
    node.isWord = true
    return this
  }
  search(word) {
    const node = this._traverse(word)
    return !!node && node.isWord
  }
  startsWith(prefix) {
    return !!this._traverse(prefix)
  }
  _traverse(s) {
    let node = this.root
    for (const ch of s) {
      node = node.children.get(ch)
      if (!node) return null
    }
    return node
  }
  delete(word) {
    const path = []
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) return false
      path.push([node, ch])
      node = node.children.get(ch)
    }
    if (!node.isWord) return false
    node.isWord = false
    // 自底向上清理冗余节点
    for (let i = path.length - 1; i >= 0; i--) {
      const [parent, ch] = path[i]
      const child = parent.children.get(ch)
      if (child.isWord || child.children.size > 0) break
      parent.children.delete(ch)
    }
    return true
  }
  // 列出以 prefix 开头的最多 k 个词
  suggest(prefix, k = 10) {
    const res = []
    const start = this._traverse(prefix)
    if (!start) return res
    const dfs = (node, path) => {
      if (res.length >= k) return
      if (node.isWord) res.push(prefix + path)
      for (const [ch, nxt] of node.children) dfs(nxt, path + ch)
    }
    dfs(start, '')
    return res
  }
}

// 基本用法
const trie = new Trie(['apple', 'app', 'apply', 'apt', 'bat'])
console.log(trie.search('app')) // true
console.log(trie.startsWith('ap')) // true
console.log(trie.suggest('ap', 3)) // ['app','apple','apply'] 之类
```

### 字典树 Trie｜实战应用举例

1. 输入法/搜索框自动补全

```js
function createAutocomplete(words) {
  const t = new Trie(words)
  return (q, k = 5) => t.suggest(q, k)
}
```

2. 敏感词过滤（命中最长词优先）

```js
function maskText(text, words, mask = '*') {
  const t = new Trie(words)
  const chars = [...text]
  for (let i = 0; i < chars.length; i++) {
    let node = t.root,
      lastEnd = -1
    for (let j = i; j < chars.length; j++) {
      node = node.children.get(chars[j])
      if (!node) break
      if (node.isWord) lastEnd = j
    }
    if (lastEnd >= i) {
      for (let k = i; k <= lastEnd; k++) chars[k] = mask
      i = lastEnd // 跳过已掩码部分
    }
  }
  return chars.join('')
}
```

3. 路由前缀匹配（静态前缀树，快速定位 handler）

```js
class Router {
  constructor() {
    this.trie = new Trie()
  }
  add(path) {
    this.trie.insert(path)
    return this
  }
  match(prefix) {
    return this.trie.startsWith(prefix)
  }
}
```

### 字典树 Trie｜常见面试问题

1. Trie 与哈希表的取舍？
   - 答：查整词优先哈希；需前缀检索/字典序/自动补全优先 Trie。
2. 如何降低 Trie 空间开销？
   - 答：路径压缩（Radix/Patricia）、共享节点、按需加载子节点、限制字符集。
3. 删除单词如何处理冗余节点？
   - 答：自底向上回溯，若子节点既非单词尾也无子节点则删除。
4. Trie 的字符集影响？
   - 答：字符集越大分支越多；可先归一化（小写、去重音、映射表）。
5. 如何做前缀 topK？
   - 答：节点维护词频/权重，DFS/BFS 按权排序或用小根堆维护前 K。

### 字典树 Trie｜使用场景选择指南

- 何时使用：自动补全、拼写检查、敏感词/前缀过滤、按字典序检索。
- 优点：前缀查询 O(L)、共享前缀节省重复、支持按字典序遍历。
- 缺点：空间占用随字符集增大、实现比哈希复杂、序列化相对麻烦。
- 替代：哈希表（整词）、后缀数组/AC 自动机（多模式/子串）。

### 字典树 Trie｜记忆要点总结

- 节点 Map + isWord；插入/查找/删除 O(L)；前缀 suggest 用 DFS。
- 压缩 Trie 降低空间；字符集预处理很关键。

---

### 二叉搜索树 BST｜知识点介绍

- 定义：BST 是一棵二叉树，满足任意节点：左子树所有节点 < 当前节点 < 右子树所有节点（以比较函数为准）。
- 基本原理：有序性保证中序遍历为递增序列；插入/查找沿树下降，平均 O(log n)。
- 复杂度：
  - 查找/插入/删除：平均 O(log n)，最坏退化为 O(n)（严格升降序插入时）。
  - 遍历：O(n)。
- 非稳定排序容器；若需稳定性能应使用平衡树（AVL/红黑树等）。

### 二叉搜索树 BST｜系统梳理

- 位置：有序集合/字典的基础树结构。
- 关联：
  - 与平衡树（AVL/红黑树）：通过旋转维持平衡，保证 O(log n)；实现更复杂。
  - 与堆：堆仅保证父子局部序，不支持有序遍历；BST 支持全序遍历与范围查询。
  - 与跳表/有序数组：有序数组查找快但插入贵；跳表近似平衡树特性且实现简单。
- 核心特性：按 comparator 维护全序；中序遍历有序；删除需区分 3 种情况。

### 二叉搜索树 BST｜使用示例

```js
// 可运行：简易 BST（不自平衡）
class BSTNode {
  constructor(key, value = key) {
    this.key = key
    this.value = value
    this.left = null
    this.right = null
  }
}

class BST {
  constructor(comparator = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
    this.root = null
    this.cmp = comparator
    this._size = 0
  }
  size() {
    return this._size
  }
  isEmpty() {
    return this._size === 0
  }
  has(key) {
    return !!this.getNode(key)
  }
  getNode(key) {
    let cur = this.root
    while (cur) {
      const r = this.cmp(key, cur.key)
      if (r === 0) return cur
      cur = r < 0 ? cur.left : cur.right
    }
    return null
  }
  get(key) {
    return this.getNode(key)?.value
  }
  set(key, value = key) {
    if (!this.root) {
      this.root = new BSTNode(key, value)
      this._size++
      return this
    }
    let cur = this.root,
      parent = null
    while (cur) {
      parent = cur
      const r = this.cmp(key, cur.key)
      if (r === 0) {
        cur.value = value
        return this
      }
      cur = r < 0 ? cur.left : cur.right
    }
    const r = this.cmp(key, parent.key)
    if (r < 0) parent.left = new BSTNode(key, value)
    else parent.right = new BSTNode(key, value)
    this._size++
    return this
  }
  minNode(node = this.root) {
    while (node?.left) node = node.left
    return node
  }
  maxNode(node = this.root) {
    while (node?.right) node = node.right
    return node
  }
  delete(key) {
    const del = (node, key) => {
      if (!node) return null
      const r = this.cmp(key, node.key)
      if (r < 0) {
        node.left = del(node.left, key)
        return node
      }
      if (r > 0) {
        node.right = del(node.right, key)
        return node
      }
      // 命中：三种情况
      if (!node.left) {
        this._size--
        return node.right
      }
      if (!node.right) {
        this._size--
        return node.left
      }
      // 两个孩子：用右子树最小节点替换
      const succ = this.minNode(node.right)
      node.key = succ.key
      node.value = succ.value
      node.right = del(node.right, succ.key)
      return node
    }
    this.root = del(this.root, key)
    return this
  }
  inorder(cb, node = this.root) {
    // 升序
    if (!node) return
    this.inorder(cb, node.left)
    cb(node)
    this.inorder(cb, node.right)
  }
  range(lo, hi) {
    // 返回 [lo,hi] 闭区间的 key
    const res = []
    const dfs = node => {
      if (!node) return
      if (this.cmp(node.key, lo) >= 0) dfs(node.left)
      if (this.cmp(node.key, lo) >= 0 && this.cmp(node.key, hi) <= 0) res.push(node.key)
      if (this.cmp(node.key, hi) <= 0) dfs(node.right)
    }
    dfs(this.root)
    return res
  }
}

// 基本用法
const bst = new BST()
;[5, 3, 7, 2, 4, 6, 8].forEach(x => bst.set(x))
console.log(bst.has(4)) // true
console.log(bst.range(3, 6)) // [3,4,5,6]
bst.delete(7)
const arr = []
bst.inorder(n => arr.push(n.key))
console.log(arr) // 有序
```

### 二叉搜索树 BST｜实战应用举例

1. 动态有序集合（排行榜/去重并排序）

```js
function topK(bst, k, desc = true) {
  const out = []
  const dfs = node => {
    if (!node || out.length >= k) return
    const [first, second] = desc ? ['right', 'left'] : ['left', 'right']
    dfs(node[first])
    if (out.length < k) out.push({ key: node.key, value: node.value })
    dfs(node[second])
  }
  dfs(bst.root)
  return out
}
```

2. 区间搜索（时间/价格过滤）

```js
// 见 bst.range(lo, hi) 用法，按区间返回元素；可用于前端过滤本地索引。
```

3. 有序去重合并（合并两个升序数组为 BST，再输出有序并集）

```js
function unionSorted(a, b) {
  const bst = new BST()
  for (const x of a) bst.set(x)
  for (const x of b) bst.set(x)
  const res = []
  bst.inorder(n => res.push(n.key))
  return res
}
```

### 二叉搜索树 BST｜常见面试问题

1. 删除节点的三种情况是什么？
   - 答：无子/单子/双子；双子用后继（右子树最小）或前驱（左子树最大）替换。
2. 为什么 BST 会退化？如何避免？
   - 答：按有序序列插入导致链式退化；使用随机化插入、AVL/红黑树维持平衡。
3. 中序遍历的性质？
   - 答：对 BST 中序遍历输出递增序列，可用于输出有序结果。
4. BST 与堆的区别？
   - 答：堆只保证父子局部序、支持取顶；BST 保证全序、支持范围查询与有序遍历。
5. 如何支持自定义比较？
   - 答：在构造函数中传 comparator；注意一致性（自反、反对称、传递）。

### 二叉搜索树 BST｜使用场景选择指南

- 何时使用：需要有序集合、范围查询、TopK 的场景；数据规模中等且对最坏性能不太敏感。
- 优点：有序遍历自然、范围查询高效、实现直观。
- 缺点：可能退化、删除实现复杂、非稳定。
- 替代：平衡树（红黑/AVL）、跳表、有序数组（读多写少）。

### 二叉搜索树 BST｜记忆要点总结

- 中序遍历有序；插入/查找/删除平均 O(log n)、最坏 O(n)。
- 删除三种情况，双子用前驱/后继替换。
- 真正的工程场景优先平衡树/库实现，避免退化。

---

> 下一篇（Part 7，单独文件）将覆盖：堆（Heap）与优先队列（Priority Queue），包括二叉堆/小顶堆/大顶堆、合并 K 路、TopK、Dijkstra 等应用。
