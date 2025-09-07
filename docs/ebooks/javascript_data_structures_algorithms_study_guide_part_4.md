# JavaScript 数据结构与算法学习手册（第 3 版）- Part 4

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 4 章：链表（Linked List）](#第-4-章链表linked-list)
  - [单向链表｜知识点介绍](#单向链表知识点介绍)
  - [单向链表｜系统梳理](#单向链表系统梳理)
  - [单向链表｜使用示例](#单向链表使用示例)
  - [单向链表｜实战应用举例](#单向链表实战应用举例)
  - [单向链表｜常见面试问题](#单向链表常见面试问题)
  - [单向链表｜使用场景选择指南](#单向链表使用场景选择指南)
  - [单向链表｜记忆要点总结](#单向链表记忆要点总结)
  - [双向链表｜知识点介绍](#双向链表知识点介绍)
  - [双向链表｜系统梳理](#双向链表系统梳理)
  - [双向链表｜使用示例](#双向链表使用示例)
  - [双向链表｜实战应用举例](#双向链表实战应用举例)
  - [双向链表｜常见面试问题](#双向链表常见面试问题)
  - [双向链表｜使用场景选择指南](#双向链表使用场景选择指南)
  - [双向链表｜记忆要点总结](#双向链表记忆要点总结)

---

## 第 4 章：链表（Linked List）

> 链表使用节点保存元素与指针，解决了数组在中间插入/删除需要移动大量元素的问题；典型形态包括单向链表、双向链表与循环链表。

### 单向链表｜知识点介绍

- 定义：单向链表由一系列节点组成，每个节点包含值和指向下一个节点的指针（next）。
- 基本原理：通过指针将节点按顺序连接；插入/删除只需改变相邻指针，避免大规模移动元素。
- 复杂度：
  - 头部插入/删除：O(1)
  - 中间/尾部插入删除（已知前驱）：O(1)；未知前驱需遍历 O(n)
  - 按索引访问/查找：O(n)
  - 反转：O(n)

### 单向链表｜系统梳理

- 在知识体系中的位置：线性结构；相比数组优化“插入/删除”，牺牲“随机访问”。
- 关联关系：
  - 队列/栈：可基于链表实现，避免数组扩容/搬移成本。
  - 双向链表：在节点中增加 prev 指针，换取双向遍历与 O(1) 删除任意节点（有引用）。
  - 循环链表：尾节点 next 指回头节点，方便旋转/循环调度。
- 核心特性：
  - 节点+指针的可组合性；在 JS 中需注意 GC 与对象分配开销。

> 常用操作复杂度
>
> | 操作              | 复杂度 |
> | ----------------- | ------ |
> | pushFront（头插） | O(1)   |
> | pushBack（尾插）  | O(1)\* |
> | insertAfter(node) | O(1)   |
> | removeAfter(node) | O(1)   |
> | find/按索引访问   | O(n)   |
>
> 注：若维护 tail 指针，尾插为 O(1)。

### 单向链表｜使用示例

```js
// 单向链表实现（可运行）
class SLLNode {
  constructor(value, next = null) {
    this.value = value
    this.next = next
  }
}

class SinglyLinkedList {
  constructor(iterable = []) {
    this.head = null
    this.tail = null
    this.length = 0
    for (const x of iterable) this.pushBack(x)
  }
  pushFront(value) {
    const node = new SLLNode(value, this.head)
    this.head = node
    if (!this.tail) this.tail = node
    this.length++
    return this
  }
  pushBack(value) {
    const node = new SLLNode(value)
    if (!this.head) {
      this.head = this.tail = node
    } else {
      this.tail.next = node
      this.tail = node
    }
    this.length++
    return this
  }
  find(predicate) {
    let cur = this.head
    while (cur) {
      if (predicate(cur.value)) return cur
      cur = cur.next
    }
    return null
  }
  insertAt(index, value) {
    if (index < 0 || index > this.length) throw new RangeError('index out of range')
    if (index === 0) return this.pushFront(value)
    if (index === this.length) return this.pushBack(value)
    let prev = this.head
    for (let i = 0; i < index - 1; i++) prev = prev.next
    const node = new SLLNode(value, prev.next)
    prev.next = node
    this.length++
    return this
  }
  removeAt(index) {
    if (index < 0 || index >= this.length) return undefined
    if (index === 0) {
      const val = this.head.value
      this.head = this.head.next
      if (!this.head) this.tail = null
      this.length--
      return val
    }
    let prev = this.head
    for (let i = 0; i < index - 1; i++) prev = prev.next
    const target = prev.next
    prev.next = target.next
    if (target === this.tail) this.tail = prev
    this.length--
    return target.value
  }
  reverse() {
    let prev = null,
      cur = this.head
    this.tail = cur
    while (cur) {
      const next = cur.next
      cur.next = prev
      prev = cur
      cur = next
    }
    this.head = prev
    return this
  }
  toArray() {
    const a = []
    let cur = this.head
    while (cur) {
      a.push(cur.value)
      cur = cur.next
    }
    return a
  }
}

// 基本用法
const sll = new SinglyLinkedList([1, 2, 3])
sll.pushFront(0).pushBack(4).insertAt(3, 2.5)
console.log(sll.toArray()) // [0,1,2,2.5,3,4]
console.log(sll.removeAt(3)) // 2.5
sll.reverse()
console.log(sll.toArray()) // [4,3,2,1,0]
```

### 单向链表｜实战应用举例

1. 微内核中间件流水线（Koa/Express 风格）

```js
// 使用链表串联中间件，避免数组 splice 开销
class MiddlewarePipeline {
  constructor() {
    this.list = new SinglyLinkedList()
  }
  use(fn) {
    this.list.pushBack(fn)
    return this
  }
  async run(ctx) {
    let node = this.list.head
    const dispatch = async () => {
      if (!node) return
      const fn = node.value
      node = node.next
      await fn(ctx, dispatch)
    }
    await dispatch()
    return ctx
  }
}

// 示例
const app = new MiddlewarePipeline()
app
  .use(async (ctx, next) => {
    ctx.log = ['A']
    await next()
    ctx.log.push('a')
  })
  .use(async (ctx, next) => {
    ctx.log.push('B')
    await next()
    ctx.log.push('b')
  })
  .use(async (ctx, next) => {
    ctx.log.push('C')
    await next()
    ctx.log.push('c')
  })

app.run({}).then(ctx => console.log(ctx.log)) // [ 'A','B','C','c','b','a' ]
```

2. 图的邻接表（稀疏图存储）

```js
// 邻接表可用数组+链表/数组；此处用链表表现增删边更友好
class Graph {
  constructor(n) {
    this.n = n
    this.adj = Array.from({ length: n }, () => new SinglyLinkedList())
  }
  addEdge(u, v) {
    this.adj[u].pushBack(v)
  }
  removeEdge(u, v) {
    let idx = 0,
      cur = this.adj[u].head
    while (cur) {
      if (cur.value === v) {
        this.adj[u].removeAt(idx)
        break
      }
      cur = cur.next
      idx++
    }
  }
}
```

3. 流式日志采样（尾部丢弃）

```js
// 固定窗口只保留最新 N 条日志：头插、尾删
class LogWindow {
  constructor(capacity) {
    this.cap = capacity
    this.list = new SinglyLinkedList()
  }
  push(log) {
    this.list.pushFront({ log, ts: Date.now() })
    if (this.list.length > this.cap) this.list.removeAt(this.list.length - 1)
  }
  toArray() {
    return this.list.toArray()
  }
}
```

### 单向链表｜常见面试问题

1. 反转链表的迭代/递归写法与复杂度？
   - 答：迭代三指针 O(n)/O(1) 额外空间；递归 O(n) 时间、O(n) 栈空间。
2. 检测环与入环点？
   - 答：Floyd 快慢指针判环；相遇后，一指针回头与慢指针同步前进，交点为入环点。
3. 删除倒数第 N 个节点？
   - 答：双指针先行 N 步；随后同步前进到尾，前指针的后继即目标节点。
4. 找到中间节点？
   - 答：快指针每次两步、慢指针一步；慢指针停在中点（偶数时可约定左中或右中）。
5. 合并两个有序链表？
   - 答：双指针按序摘取节点连接到哑节点之后，O(m+n)。

### 单向链表｜使用场景选择指南

- 何时使用：
  - 高频插入/删除（尤其头部/已知前驱）；不可预知容量、避免数组搬移；需要稳定迭代语义。
- 优点：
  - 插入/删除 O(1)（已知位置）；无需连续内存；适合可组合的节点结构。
- 缺点：
  - 随机访问 O(n)；缓存局部性差；对象分配与 GC 增加开销。
- 替代方案：
  - 数组：随机访问与批量处理更优；中间插入/删除差。
  - 双向链表：需要 O(1) 删除任意节点（持引用）或双向遍历时更优。
  - Deque：若只需两端操作，选 Deque 更简单高效。

### 单向链表｜记忆要点总结

- 核心：节点+next 指针；插入/删除 O(1)，访问 O(n)。
- 三指针反转套路：prev, cur, next。
- 经典双指针：判环/中点/第 N 个倒数元素。
- 维护 tail 可将尾插降到 O(1)。

---

### 双向链表｜知识点介绍

- 定义：在单向链表基础上为每个节点增加 prev 指针，支持从任意节点 O(1) 删除与双向遍历。
- 复杂度：
  - 头尾插入/删除：O(1)
  - 已知节点删除：O(1)
  - 查找：O(n)
  - 旋转/拼接：O(1)（改指针）
- 典型用途：LRU 缓存、播放/浏览历史、编辑器光标/片段链。

### 双向链表｜系统梳理

- 与其他结构：
  - 相比单向链表，双向链表以空间（prev 指针）换取操作灵活性。
  - 与循环链表：head.prev 指向 tail，tail.next 指向 head，方便循环调度。
  - 与哈希表：二者组合可实现 O(1) LRU/LFU。
- 特性：
  - 需要小心维护四条指针（node.prev/next 与相邻的对应指针）。

### 双向链表｜使用示例

```js
class DLLNode {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.prev = null
    this.next = null
  }
}

class DoublyLinkedList {
  constructor() {
    // 使用哑头尾节点，简化边界
    this.head = new DLLNode(null, null)
    this.tail = new DLLNode(null, null)
    this.head.next = this.tail
    this.tail.prev = this.head
    this.length = 0
  }
  _insertAfter(node, ref) {
    node.prev = ref
    node.next = ref.next
    ref.next.prev = node
    ref.next = node
    this.length++
  }
  _remove(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
    node.prev = node.next = null
    this.length--
  }
  pushFront(node) {
    this._insertAfter(node, this.head)
    return this
  }
  moveToFront(node) {
    this._remove(node)
    this.pushFront(node)
    return this
  }
  popBack() {
    if (this.length === 0) return null
    const node = this.tail.prev
    this._remove(node)
    return node
  }
}

// LRU：Map + 双向链表（O(1) get/set）
class LRUCache {
  constructor(capacity = 3) {
    this.cap = capacity
    this.dll = new DoublyLinkedList()
    this.map = new Map() // key -> node
  }
  get(key) {
    const node = this.map.get(key)
    if (!node) return undefined
    this.dll.moveToFront(node)
    return node.value
  }
  set(key, value) {
    let node = this.map.get(key)
    if (node) {
      node.value = value
      this.dll.moveToFront(node)
      return
    }
    node = new DLLNode(key, value)
    this.dll.pushFront(node)
    this.map.set(key, node)
    if (this.dll.length > this.cap) {
      const evicted = this.dll.popBack()
      if (evicted) this.map.delete(evicted.key)
    }
  }
}

// 用法
const lru = new LRUCache(2)
lru.set('a', 1)
lru.set('b', 2)
lru.get('a') // a 变最近
lru.set('c', 3) // 淘汰 b
console.log(lru.get('b')) // undefined
console.log(lru.get('a')) // 1
```

### 双向链表｜实战应用举例

1. 播放列表/浏览历史（前后跳转）

```js
class History {
  constructor() {
    this.dll = new DoublyLinkedList()
    this.cur = null
  }
  visit(url) {
    // 清空当前之后的 forward 历史
    while (this.cur && this.cur.next && this.cur.next.value) {
      const next = this.cur.next
      this.dll._remove(next)
    }
    const node = new DLLNode('url', url)
    if (!this.cur) {
      this.dll.pushFront(node)
    } else {
      this.dll._insertAfter(node, this.cur)
    }
    this.cur = node
  }
  back() {
    if (this.cur && this.cur.prev && this.cur.prev.value) this.cur = this.cur.prev
    return this.cur?.value
  }
  forward() {
    if (this.cur && this.cur.next && this.cur.next.value) this.cur = this.cur.next
    return this.cur?.value
  }
}
```

2. 文本编辑器选区链（片段拼接与撤销）

```js
// 用双向链表保存片段，支持从当前节点 O(1) 插入/删除
class PieceChain {
  constructor(text = '') {
    this.dll = new DoublyLinkedList()
    this.cur = null
    if (text) this.append(text)
  }
  append(piece) {
    const node = new DLLNode('piece', piece)
    if (!this.cur) this.dll.pushFront(node)
    else this.dll._insertAfter(node, this.cur)
    this.cur = node
  }
  deleteCur() {
    if (this.cur) {
      const prev = this.cur.prev.value ? this.cur.prev : null
      this.dll._remove(this.cur)
      this.cur = prev
    }
  }
  toString() {
    let s = '',
      p = this.dll.head.next
    while (p && p.value) {
      s += p.value
      p = p.next
    }
    return s
  }
}
```

3. 双向环 + 指针实现轮播图（循环滚动）

```js
// 将 head.prev 指向 tail，tail.next 指向 head，实现 O(1) 循环切换
function makeCircular(dll) {
  if (dll.length) {
    dll.head.next.prev = dll.tail.prev
    dll.tail.prev.next = dll.head.next
  }
  return dll
}
```

### 双向链表｜常见面试问题

1. 为什么 LRU 常用双向链表而不是单向链表？
   - 答：需要 O(1) 从任意位置删除节点（持有 node 引用），单向链表无法在 O(1) 时间找到前驱。
2. 如何在双向链表中以 O(1) 将任意节点移动到头部？
   - 答：先 \_remove(node)，再 pushFront(node)。
3. 双向链表相比数组的代价是什么？
   - 答：更多对象与指针，较差的缓存局部性，GC 压力增大。
4. 如何安全地拼接两个双向链表？
   - 答：改四条指针：aTail.next=bHead; bHead.prev=aTail; 更新长度与新尾部。
5. 何时考虑循环双向链表？
   - 答：需要从尾回到头、或需要统一化头尾边界处理时（如轮播、游戏回合）。

### 双向链表｜使用场景选择指南

- 何时使用：LRU/LFU、双向遍历、编辑器/播放列表、复杂撤销/重做链。
- 优点：O(1) 插入/删除任意节点（持引用）、双向迭代灵活、易与 Map 组合。
- 缺点：实现更复杂、空间开销较大、CPU 缓存友好度差。
- 替代方案：
  - 数组+索引：当随机访问为主或需要稳定排序。
  - Deque：若仅需两端操作，选 Deque 更简单高效。
  - 平衡树/跳表：需要有序集合与对数级查找/插入时。

### 双向链表｜记忆要点总结

- prev/next 指针成对维护，注意四条指针一致性。
- Map + 双向链表 = LRU 的常见 O(1) 组合。
- 循环化能统一边界处理，适合轮播与循环任务。

---

> 下一篇（Part 5，单独文件）将覆盖：集合（Set）与字典（Map），包括 ES6 Set/Map 与哈希表思想、典型操作与去重/计数、以及前端常见应用。
