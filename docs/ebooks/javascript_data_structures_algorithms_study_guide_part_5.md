# JavaScript 数据结构与算法学习手册（第 3 版）- Part 5

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 5 章：集合（Set）、字典/映射（Map）与哈希表（Hash Table）](#第-5-章集合set字典映射map与哈希表hash-table)
  - [集合 Set｜知识点介绍](#集合-set知识点介绍)
  - [集合 Set｜系统梳理](#集合-set系统梳理)
  - [集合 Set｜使用示例](#集合-set使用示例)
  - [集合 Set｜实战应用举例](#集合-set实战应用举例)
  - [集合 Set｜常见面试问题](#集合-set常见面试问题)
  - [集合 Set｜使用场景选择指南](#集合-set使用场景选择指南)
  - [集合 Set｜记忆要点总结](#集合-set记忆要点总结)
  - [映射 Map｜知识点介绍](#映射-map知识点介绍)
  - [映射 Map｜系统梳理](#映射-map系统梳理)
  - [映射 Map｜使用示例](#映射-map使用示例)
  - [映射 Map｜实战应用举例](#映射-map实战应用举例)
  - [映射 Map｜常见面试问题](#映射-map常见面试问题)
  - [映射 Map｜使用场景选择指南](#映射-map使用场景选择指南)
  - [映射 Map｜记忆要点总结](#映射-map记忆要点总结)
  - [哈希表 Hash Table｜知识点介绍](#哈希表-hash-table知识点介绍)
  - [哈希表 Hash Table｜系统梳理](#哈希表-hash-table系统梳理)
  - [哈希表 Hash Table｜使用示例](#哈希表-hash-table使用示例)
  - [哈希表 Hash Table｜实战应用举例](#哈希表-hash-table实战应用举例)
  - [哈希表 Hash Table｜常见面试问题](#哈希表-hash-table常见面试问题)
  - [哈希表 Hash Table｜使用场景选择指南](#哈希表-hash-table使用场景选择指南)
  - [哈希表 Hash Table｜记忆要点总结](#哈希表-hash-table记忆要点总结)

---

## 第 5 章：集合（Set）、字典/映射（Map）与哈希表（Hash Table）

> Set/Map 是 ES6 提供的高效集合与映射结构；Hash Table 是其典型底层思想。它们在唯一性约束、成员性测试、去重计数、索引与缓存等场景中极为重要。

### 集合 Set｜知识点介绍

- 定义：Set 是不包含重复元素的集合结构，提供成员性测试与去重能力。
- 基本原理：通常基于哈希表或平衡树实现；JavaScript 的 Set 使用插入顺序迭代，成员判断使用 SameValueZero。
- 复杂度（期望）：
  - add/delete/has：O(1)
  - 遍历：O(n)

### 集合 Set｜系统梳理

- 在知识体系中的位置：
  - 用于表达“唯一性”与“集合代数（并/交/差）”。
- 关联关系：
  - 与 Array：Array 适合索引与排序；Set 适合集合运算与去重。
  - 与 Map：Map 管键值映射；Set 只有键（值即键）。
  - 与 WeakSet：只能存对象，弱引用，不可遍历，适合私有标记与内存安全。
- 核心特性：
  - 唯一、迭代保留插入顺序、成员性测试快。

### 集合 Set｜使用示例

```js
// 去重
const arr = [1, 2, 2, 3, 3, 4]
const unique = [...new Set(arr)] // [1,2,3,4]

// 集合代数
const A = new Set([1, 2, 3])
const B = new Set([3, 4, 5])
const union = new Set([...A, ...B]) // 并集
const intersection = new Set([...A].filter(x => B.has(x))) // 交集
const difference = new Set([...A].filter(x => !B.has(x))) // 差集
```

### 集合 Set｜实战应用举例

1. 标签去重与成员性判定

```js
const tags = ['Vue', 'React', 'Vue', 'Svelte']
const tagSet = new Set(tags)
console.log(tagSet.has('React')) // true
```

2. 路由权限（角色集合检查）

```js
function canAccess(userRoles, routeRoles) {
  const u = new Set(userRoles)
  return routeRoles.some(r => u.has(r))
}
```

3. 滚动监听（已曝光元素集合避免重复上报）

```js
const seen = new Set()
function reportOnce(id) {
  if (!seen.has(id)) {
    seen.add(id)
    console.log('report', id)
  }
}
```

### 集合 Set｜常见面试问题

1. Set 与 Array 的差异？
   - 答：Set 无重复元素、无索引、成员测试 O(1) 期望；Array 有索引、可重复、includes O(n)。
2. 如何实现并/交/差？
   - 答：见使用示例；交集常用 filter + has。
3. WeakSet 的特点与使用场景？
   - 答：仅对象、弱引用、不可遍历；适合给对象做“访问过/已处理”标记避免内存泄漏。

### 集合 Set｜使用场景选择指南

- 何时使用：去重、成员性测试、集合代数、已处理标记。
- 优点：语义清晰、性能好、API 简洁。
- 缺点：不支持按索引访问；无自带排序；序列化需转数组。
- 替代方案：Array（小规模或需要索引）、Map（需要携带值）。

### 集合 Set｜记忆要点总结

- 唯一性；并/交/差组合常用；SameValueZero 判断；WeakSet 弱引用不可遍历。

---

### 映射 Map｜知识点介绍

- 定义：Map 是键值对集合，键可以是任意类型（对象、函数、原始值）。
- 基本原理：典型实现为哈希表或哈希+树；JS Map 按插入顺序迭代。
- 复杂度（期望）：
  - set/get/has/delete：O(1)
  - 遍历：O(n)

### 映射 Map｜系统梳理

- 在知识体系中的位置：
  - 通用键值索引容器，比对象更正统的“字典”。
- 关联关系：
  - 与 Object：Object 键会被强制为字符串/符号；原型链等语义复杂；Map 更直观可靠。
  - 与 WeakMap：键必须是对象，弱引用，不可遍历；适合私有数据与缓存。
  - 与 Set：Set 可看作“只有键没有值的 Map”。

### 映射 Map｜使用示例

```js
const m = new Map()
m.set('a', 1)
m.set({ id: 1 }, 'obj')
console.log(m.get('a')) // 1
console.log(m.has('a')) // true
m.delete('a')

// 频次统计
const words = ['a', 'b', 'a']
const freq = new Map()
for (const w of words) freq.set(w, (freq.get(w) || 0) + 1)
```

### 映射 Map｜实战应用举例

1. 分组聚合（groupBy）

```js
function groupBy(arr, keyFn) {
  const map = new Map()
  for (const item of arr) {
    const k = keyFn(item)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(item)
  }
  return map
}
```

2. 请求缓存（按 URL+参数缓存响应）

```js
function createFetchCache(fetcher) {
  const cache = new Map()
  return async function cachedFetch(url, params = {}) {
    const key = url + '?' + JSON.stringify(params)
    if (cache.has(key)) return cache.get(key)
    const p = fetcher(url, params).finally(() => {
      // 可选：失败时删除缓存，避免污染
    })
    cache.set(key, p)
    return p
  }
}
```

3. 双向索引（ID 与对象互查）

```js
class BiMap {
  constructor() {
    this.a2b = new Map()
    this.b2a = new Map()
  }
  set(a, b) {
    this.deleteByA(a)
    this.deleteByB(b)
    this.a2b.set(a, b)
    this.b2a.set(b, a)
  }
  getByA(a) {
    return this.a2b.get(a)
  }
  getByB(b) {
    return this.b2a.get(b)
  }
  deleteByA(a) {
    const b = this.a2b.get(a)
    if (b !== undefined) {
      this.a2b.delete(a)
      this.b2a.delete(b)
    }
  }
  deleteByB(b) {
    const a = this.b2a.get(b)
    if (a !== undefined) {
      this.b2a.delete(b)
      this.a2b.delete(a)
    }
  }
}
```

### 映射 Map｜常见面试问题

1. Map 与 Object 的区别？
   - 答：任意类型键、无原型干扰、迭代顺序可控、API 完整；Object 受字符串化与原型链影响。
2. WeakMap 的适用场景？
   - 答：关联对象的私有数据/缓存，键是对象且弱引用，避免内存泄漏。
3. 如何实现 LRU？
   - 答：Map + 双向链表（或有序 Map）实现 O(1) get/set/移动与淘汰。

### 映射 Map｜使用场景选择指南

- 何时使用：需要键值映射、任意类型键、高性能查找/插入/删除、保持插入顺序。
- 优点：语义直观、性能优、API 完整。
- 缺点：相较对象略多内存；不可直接 JSON 序列化（需转数组）。
- 替代方案：Object（简单键/与旧接口兼容）、数组键值对（小规模）。

### 映射 Map｜记忆要点总结

- 任意类型键；set/get/has O(1)；WeakMap 弱引用不可遍历；与 LRU/缓存天然契合。

---

### 哈希表 Hash Table｜知识点介绍

- 定义：哈希表通过哈希函数将键映射到桶（bucket），在桶中存储键值对，实现平均 O(1) 的查找/插入/删除。
- 冲突处理：开放寻址（线性探测、二次探测、双重散列）或拉链法（链式存储）。
- 负载因子：装载程度（size/capacity），过高会退化到 O(n)，需要扩容再散列。

### 哈希表 Hash Table｜系统梳理

- 底层思想：
  - hash(key) -> index；在 index 的槽位存放（或链接）键值对。
- 与 Set/Map 的关系：
  - 二者常用哈希表实现；理解哈希表有助于选择与优化 Set/Map 的使用。
- 复杂度：
  - 期望：O(1)；最坏：O(n)。

### 哈希表 Hash Table｜使用示例

```js
// 一个简易哈希表（拉链法 + 扩容），演示用：
class HashTable {
  constructor(initCap = 8) {
    this.cap = initCap
    this.size = 0
    this.buckets = Array.from({ length: this.cap }, () => [])
  }
  _hash(key) {
    // djb2 变体：字符串化后散列
    const s = typeof key === 'string' ? key : JSON.stringify(key)
    let h = 5381
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i)
    return h >>> 0
  }
  _index(key) {
    return this._hash(key) % this.cap
  }
  _rehash(newCap) {
    const old = this.buckets
    this.cap = newCap
    this.buckets = Array.from({ length: this.cap }, () => [])
    this.size = 0
    for (const bucket of old) for (const [k, v] of bucket) this.set(k, v)
  }
  _maybeResize() {
    const load = this.size / this.cap
    if (load > 0.75) this._rehash(this.cap * 2)
    else if (load < 0.1 && this.cap > 8) this._rehash(Math.floor(this.cap / 2))
  }
  set(key, value) {
    const idx = this._index(key)
    const bucket = this.buckets[idx]
    for (const kv of bucket) {
      if (Object.is(kv[0], key)) {
        kv[1] = value
        return
      }
    }
    bucket.push([key, value])
    this.size++
    this._maybeResize()
  }
  get(key) {
    const bucket = this.buckets[this._index(key)]
    for (const [k, v] of bucket) if (Object.is(k, key)) return v
    return undefined
  }
  has(key) {
    const bucket = this.buckets[this._index(key)]
    for (const [k] of bucket) if (Object.is(k, key)) return true
    return false
  }
  delete(key) {
    const idx = this._index(key)
    const bucket = this.buckets[idx]
    for (let i = 0; i < bucket.length; i++) {
      if (Object.is(bucket[i][0], key)) {
        bucket.splice(i, 1)
        this.size--
        this._maybeResize()
        return true
      }
    }
    return false
  }
}

// 用法
const ht = new HashTable()
ht.set('a', 1)
ht.set('b', 2)
console.log(ht.get('a')) // 1
console.log(ht.has('c')) // false
```

### 哈希表 Hash Table｜实战应用举例

1. 两数之和（Two Sum）— 借助哈希实现线性时间

```js
function twoSum(nums, target) {
  const map = new Map() // 值 -> 下标
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (map.has(need)) return [map.get(need), i]
    map.set(nums[i], i)
  }
  return []
}
```

2. 字符串异位词分组（哈希签名）

```js
function groupAnagrams(strs) {
  const map = new Map()
  for (const s of strs) {
    const key = s.split('').sort().join('') // 简易签名
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(s)
  }
  return [...map.values()]
}
```

3. 唯一访客计数（去重统计）

```js
function uniqueVisitors(logs) {
  // logs: [{userId}]
  const set = new Set(logs.map(l => l.userId))
  return set.size
}
```

### 哈希表 Hash Table｜常见面试问题

1. 冲突有哪些处理方式？
   - 答：拉链法、开放寻址（线性/二次/双重散列）。
2. 为什么负载因子过高会退化？如何缓解？
   - 答：碰撞增多导致桶内线性查找，近似 O(n)；通过扩容再散列维持合适负载因子（如 0.75）。
3. 哈希函数的性质？
   - 答：均匀分布、快速、可重复；根据键域选择合适方案（字符串、数值、对象）。
4. Map 与自实现哈希表的选择？
   - 答：优先用内建 Map；自实现用于教学/特殊需求（定制哈希/序列化/最小化体积）。
5. 为什么 JS Map/Set 的迭代顺序可预测？
   - 答：规范规定按插入顺序迭代，便于构建稳定的遍历与序列化策略。

### 哈希表 Hash Table｜使用场景选择指南

- 何时使用：
  - 快速成员测试/索引、去重、计数、分组、缓存、规则匹配（如两数之和）。
- 优点：平均 O(1) 操作、语义直观、实现通用。
- 缺点：最坏 O(n)、需要哈希函数、扩容成本、无自然排序。
- 替代方案：
  - 平衡树/有序结构：需要排序/范围查询时更优。
  - 数组：小规模/顺序处理。

### 哈希表 Hash Table｜记忆要点总结

- hash -> bucket；冲突处理；负载因子与扩容；平均 O(1)、最坏 O(n)；排序与范围查询非其强项。

---

> 下一篇（Part 6，单独文件）将覆盖：字典树（Trie）与树（Tree）的基础，包含二叉搜索树、平衡思想与常见遍历。
