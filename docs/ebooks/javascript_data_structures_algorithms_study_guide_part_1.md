# JavaScript 数据结构与算法学习手册（第 3 版）- Part 1

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 1 章：数组（Array）](#第-1-章数组array)
  - [数组｜知识点介绍](#数组知识点介绍)
  - [数组｜系统梳理](#数组系统梳理)
  - [数组｜使用示例](#数组使用示例)
  - [数组｜实战应用举例](#数组实战应用举例)
  - [数组｜常见面试问题](#数组常见面试问题)
  - [数组｜使用场景选择指南](#数组使用场景选择指南)
  - [数组｜记忆要点总结](#数组记忆要点总结)

---

## 第 1 章：数组（Array）

> 本章覆盖 JavaScript 中最基础的线性数据结构——数组。数组是其他结构（栈、队列、双端队列、堆等）的实现基石，也是绝大多数算法的输入容器。

### 数组｜知识点介绍

- 定义：数组是一种有序、可索引访问的线性数据结构。在 JavaScript 中，数组是动态长度、可稀疏的对象，拥有一套丰富的内建方法用于增删查改、遍历与变换。
- 基本原理：
  - JS 引擎会为“同质（同元素类型）且紧凑”的数组做元素存储优化（元素种类/稀疏度变化会退化）。
  - 常见操作的时间复杂度：
    - 末尾插入/删除（push/pop）：摊还 O(1)
    - 头部插入/删除（unshift/shift）：O(n)
    - 随机访问（a[i]）：O(1)
    - 按值查找（indexOf/includes/find）：O(n)
    - 排序（sort）：O(n log n)（实现依引擎而异，现代 V8 为 Timsort 变体）

### 数组｜系统梳理

- 在知识体系中的位置：
  - 线性结构家族的根基；栈/队列/双端队列常以数组实现；排序和搜索算法的主要载体。
- 与其他概念的关联：
  - 与对象：数组是对象的特化（带 length 与数字索引）。
  - 与迭代器/可迭代协议：数组天然可迭代（for...of、展开运算符）。
  - 与 Set/Map：Set 更适合去重与成员性测试；Map/Dedicated 对象更适合键值映射。
  - 与类型化数组（TypedArray）：用于定长数值缓冲区的高性能场景（WebGL、音视频、数据科学）。
  - 与高阶函数：map/filter/reduce/some/every 等提供函数式操作。
- 核心特性与属性：
  - 有序、索引访问、动态扩容、可稀疏（a[100]=1 将生成空洞）。
  - 变异方法（push/pop/splice/sort/reverse/shift/unshift）与非变异方法（slice/map/filter/concat/toSorted/toReversed 等新提案/实现）。
  - 可组合性强，适合作为数据管道的基础容器。

> 常用操作复杂度速查（平均情况）
>
> | 操作                  | 复杂度     |
> | --------------------- | ---------- |
> | 访问 a[i]             | O(1)       |
> | push/pop              | 摊还 O(1)  |
> | shift/unshift         | O(n)       |
> | splice(中间插入/删除) | O(n)       |
> | indexOf/includes/find | O(n)       |
> | sort                  | O(n log n) |

### 数组｜使用示例

以下示例均可在 Node.js 或浏览器控制台直接运行。

```js
// 1) 创建与基本操作
const a = [1, 2, 3]
a.push(4) // [1,2,3,4]
a.pop() // [1,2,3]
a.unshift(0) // [0,1,2,3]
a.shift() // [1,2,3]

// 2) 访问与遍历
for (let i = 0; i < a.length; i++) {
  // 传统 for，最快的通用遍历
}
for (const v of a) {
  // 可迭代遍历
}

// 3) 非变异的函数式操作
const b = a.map(x => x * 2) // 映射
const c = a.filter(x => x % 2 === 1) // 过滤
const sum = a.reduce((acc, x) => acc + x, 0) // 归并

// 4) 不可变增改（推荐在 React/Vue 状态中使用）
const appended = [...a, 4]
const replaced = a.map(x => (x === 2 ? 42 : x))
const removed = a.filter(x => x !== 3)

// 5) 拷贝与合并
const copy = a.slice() // 浅拷贝
const merged = [...a, ...b]

// 6) 排序（注意：sort 会变异原数组，且默认按字符串比较）
const nums = [10, 2, 5, 1]
nums.sort((x, y) => x - y) // [1,2,5,10]

// 7) 去重（小规模数据可直接使用 Set）
const deduped = [...new Set([1, 2, 2, 3, 3, 3])] // [1,2,3]
```

### 数组｜实战应用举例

1. 标签去重与频次统计（电商/内容检索常见）

目标：对用户提交的标签进行标准化、去重与计数，用于热门标签榜单或搜索权重。

```js
// 输入：自由文本标签数组，可能大小写不同、包含空白与噪声
const rawTags = ['JavaScript', 'javascript ', 'Vue', 'React', 'react', 'Vue', '  node.js  ', 'JS']

// 规范化、去噪
const normalize = s => s.trim().toLowerCase().replace(/\.+$/, '')
const cleaned = rawTags.map(normalize).filter(Boolean)

// 统计频次
function countBy(arr) {
  return arr.reduce((m, x) => {
    m[x] = (m[x] || 0) + 1
    return m
  }, {})
}

// 排序输出 TopN
function topNCounts(counter, n = 3) {
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([tag, cnt]) => ({ tag, cnt }))
}

const counter = countBy(cleaned)
console.log(topNCounts(counter, 3))
// 输出示例：[{tag:'vue',cnt:2},{tag:'react',cnt:2},{tag:'javascript',cnt:2}]
```

2. 表格数据的筛选/排序/分页（前端管理台常见）

目标：对数据集按关键词筛选、按列排序、并做前端分页展示。

```js
const data = [
  { id: 1, name: 'Alice', age: 28 },
  { id: 2, name: 'Bob', age: 20 },
  { id: 3, name: 'Carol', age: 35 },
  { id: 4, name: 'Dave', age: 28 },
  { id: 5, name: 'Eve', age: 22 },
]

function filterByKeyword(rows, keyword) {
  const k = keyword.trim().toLowerCase()
  if (!k) return rows
  return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(k)))
}

function sortByKey(rows, key, asc = true) {
  // 不变式：不变异原数组
  return [...rows].sort((a, b) => {
    const x = a[key],
      y = b[key]
    if (x === y) return 0
    return asc ? (x > y ? 1 : -1) : x > y ? -1 : 1
  })
}

function paginate(rows, page = 1, pageSize = 2) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}

// 管道组合
const resultPage1 = paginate(sortByKey(filterByKeyword(data, 'a'), 'age', true), 1, 2)
console.log(resultPage1)
// 输出示例：[ { id: 2, name: 'Bob', age: 20 }, { id: 5, name: 'Eve', age: 22 } ]
```

3. 简易虚拟列表窗口计算（长列表性能优化）

目标：给定滚动位置，计算当前需要渲染的可见项窗口，避免整表渲染。

```js
// 参数：总数据长度、条目高度、容器高度、滚动偏移、预渲染缓冲区
function calcWindow(total, itemHeight, viewportHeight, scrollTop, overscan = 3) {
  const itemsPerView = Math.ceil(viewportHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(total - 1, startIndex + itemsPerView + overscan * 2)
  return { startIndex, endIndex }
}

// 示例
const total = 10000
const viewportHeight = 600
const itemHeight = 30
const scrollTop = 1234

const { startIndex, endIndex } = calcWindow(total, itemHeight, viewportHeight, scrollTop)
console.log(startIndex, endIndex) // 计算当前应渲染的切片范围

// 前端渲染时：
// const visible = data.slice(startIndex, endIndex + 1);
// 配合占位高度与 translateY(startIndex * itemHeight) 渲染窗口即可。
```

### 数组｜常见面试问题

1. 问：push、pop、shift、unshift 的时间复杂度分别是多少？
   - 答：push/pop 摊还 O(1)；shift/unshift 由于需要移动大量元素，O(n)。

2. 问：如何在不变异原数组的前提下插入、删除和替换元素？
   - 答：使用 slice/spread/filter/map 等组合，例如：
     - 插入：`const r = [...a.slice(0, i), x, ...a.slice(i)];`
     - 删除：`const r = a.filter((_, idx) => idx !== i);`
     - 替换：`const r = a.map((v, idx) => (idx === i ? nv : v));`

3. 问：如何去重一个数组？复杂度如何？
   - 答：小规模可用 `Array.from(new Set(arr))`，时间 O(n)、空间 O(n)；大规模/对象键控制可以配合 Map 计数或键选择函数。

4. 问：为什么 `[].sort()` 默认不是数值大小排序？如何正确按数值排序？
   - 答：默认按字符串字典序比较；应提供比较函数：`arr.sort((a,b)=>a-b)`。

5. 问：浅拷贝与深拷贝的区别？数组如何深拷贝？
   - 答：浅拷贝（slice/spread）仅复制第一层引用；深拷贝需递归或结构化克隆（如 `structuredClone`、`JSON.parse(JSON.stringify(obj))` 有局限）。

### 数组｜使用场景选择指南

- 何时优先使用数组：
  - 需要有序、索引访问的数据；频繁尾部追加/弹出；需要批处理、映射与聚合；排序/分页/过滤/搜索。
- 优点：
  - 简单直观、API 丰富、生态支持好；尾部增删高效；天然可迭代、易于与函数式方法组合。
- 缺点：
  - 头部/中间插入删除成本高；稀疏数组可能造成性能退化；对成员性测试与去重不如 Set 直观高效。
- 替代方案对比：
  - 链表（LinkedList）：中间插入/删除 O(1)（已知节点），但随机访问 O(n)、实现复杂；适合频繁插入/删除场景。
  - Set：成员性测试 O(1) 期望、天然去重，但无索引顺序（迭代保持插入顺序），不适合随机索引访问。
  - Map/对象：键值映射结构；当需要根据键快速定位值时优于用数组查找。
  - TypedArray：数值密集计算、二进制数据处理场景的高性能方案，但大小固定、元素类型受限。

### 数组｜记忆要点总结

- 访问 O(1)，末尾增删摊还 O(1)，头部/中间插入删除 O(n)。
- 非变异优先（slice/map/filter/reduce/spread），状态管理更安全可预测。
- 排序要显式比较函数：数字 `a-b`，字符串/多字段需自定义 comparator。
- 小规模去重首选 Set，大规模或带规则的去重用 Map/计数法。
- 警惕稀疏数组与隐式类型转换带来的性能与逻辑陷阱。

---

> 下一篇（Part 2，单独文件）将覆盖：栈（Stack）与队列（Queue），并基于数组实现其核心操作与前端常见应用（撤销/重做、任务调度、节流/防抖队列等）。
