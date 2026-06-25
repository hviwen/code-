# JavaScript 数据结构与算法学习手册（第 3 版）- Part 8

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 8 章：排序与搜索（Sorting & Searching）](#第-8-章排序与搜索sorting--searching)
  - [排序（概览与选型）｜知识点介绍](#排序概览与选型知识点介绍)
  - [排序（概览与选型）｜系统梳理](#排序概览与选型系统梳理)
  - [排序（概览与选型）｜使用示例](#排序概览与选型使用示例)
  - [排序（概览与选型）｜实战应用举例](#排序概览与选型实战应用举例)
  - [排序（概览与选型）｜常见面试问题](#排序概览与选型常见面试问题)
  - [排序（概览与选型）｜使用场景选择指南](#排序概览与选型使用场景选择指南)
  - [排序（概览与选型）｜记忆要点总结](#排序概览与选型记忆要点总结)
  - [搜索（线性/二分）｜知识点介绍](#搜索线性二分知识点介绍)
  - [搜索（线性/二分）｜系统梳理](#搜索线性二分系统梳理)
  - [搜索（线性/二分）｜使用示例](#搜索线性二分使用示例)
  - [搜索（线性/二分）｜实战应用举例](#搜索线性二分实战应用举例)
  - [搜索（线性/二分）｜常见面试问题](#搜索线性二分常见面试问题)
  - [搜索（线性/二分）｜使用场景选择指南](#搜索线性二分使用场景选择指南)
  - [搜索（线性/二分）｜记忆要点总结](#搜索线性二分记忆要点总结)

---

## 第 8 章：排序与搜索（Sorting & Searching）

> 本章聚焦最常用的排序与搜索套路。排序侧重快速排序、归并排序与插入排序；搜索侧重二分查找与边界查找（lower/upper bound）。

### 排序（概览与选型）｜知识点介绍

- 定义：排序是将序列按某种比较规则重排的过程，常见比较规则来源于数字大小、字典序、复合键（多字段）。
- 关键性质：
  - 时间复杂度：快排平均 O(n log n)，最坏 O(n^2)；归并稳定 O(n log n)；插入 O(n^2) 但对近乎有序数据表现优异。
  - 空间复杂度：原地（快排、插入）与非原地（归并，O(n) 额外空间）。
  - 稳定性：是否保持相等元素相对次序。现代 JavaScript 的 Array.prototype.sort 在规范中要求稳定。
- JS 特性：
  - 默认 sort 按字符串字典序比较；数值排序需提供比较器 `(a,b)=>a-b`。
  - 新提案/现代实现提供非变异版本：toSorted（如在新引擎中）。

### 排序（概览与选型）｜系统梳理

- 位置与关联：
  - 与堆：堆排序 O(n log n) 且原地但不稳定；TopK 更适合堆而非全量排序。
  - 与二分搜索：二分要求数据有序；排序常作为搜索的前置条件。
  - 与计数/桶/基数排序：当键是整数且范围可控时可达线性时间。
- 核心特性与属性列表：
  - 快速排序：分治，原地，平均 O(n log n)，不稳定。
  - 归并排序：分治，非原地，O(n log n)，稳定，适合外部排序/链表。
  - 插入排序：原地，O(n^2)；对小数组或近有序数据很快；常用作混合排序的小规模基线。

> 常见排序复杂度与性质速查
>
> | 算法         | 平均  | 最坏  | 额外空间   | 稳定  |
> | ------------ | ----- | ----- | ---------- | ----- |
> | 快排         | nlogn | n^2   | O(1)       | 否    |
> | 归并         | nlogn | nlogn | O(n)       | 是    |
> | 插入         | n^2   | n^2   | O(1)       | 是    |
> | 堆排         | nlogn | nlogn | O(1)       | 否    |
> | 计数/桶/基数 | n+k   | n+k   | 取决于实现 | 是/否 |

### 排序（概览与选型）｜使用示例

```js
// 1) 快速排序（原地，Hoare 分区变体，数值升序）
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  const swap = (i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])
  const partition = (l, r) => {
    const pivot = arr[Math.floor((l + r) / 2)]
    let i = l,
      j = r
    while (i <= j) {
      while (arr[i] < pivot) i++
      while (arr[j] > pivot) j--
      if (i <= j) {
        swap(i, j)
        i++
        j--
      }
    }
    return i
  }
  if (lo < hi) {
    const p = partition(lo, hi)
    if (lo < p - 1) quickSort(arr, lo, p - 1)
    if (p < hi) quickSort(arr, p, hi)
  }
  return arr
}

// 2) 归并排序（稳定，返回新数组）
function mergeSort(arr, cmp = (a, b) => a - b) {
  const n = arr.length
  if (n <= 1) return arr.slice()
  const mid = n >> 1
  const left = mergeSort(arr.slice(0, mid), cmp)
  const right = mergeSort(arr.slice(mid), cmp)
  const res = []
  let i = 0,
    j = 0
  while (i < left.length && j < right.length) {
    if (cmp(left[i], right[j]) <= 0) res.push(left[i++])
    else res.push(right[j++])
  }
  while (i < left.length) res.push(left[i++])
  while (j < right.length) res.push(right[j++])
  return res
}

// 3) 插入排序（小数组或近有序数据）
function insertionSort(arr, cmp = (a, b) => a - b) {
  for (let i = 1; i < arr.length; i++) {
    const x = arr[i]
    let j = i - 1
    while (j >= 0 && cmp(arr[j], x) > 0) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = x
  }
  return arr
}
```

### 排序（概览与选型）｜实战应用举例

1. 多字段排序（先按优先级 desc，再按时间 asc）

```js
function by(...comparators) {
  return (a, b) => {
    for (const cmp of comparators) {
      const r = cmp(a, b)
      if (r) return r
    }
    return 0
  }
}
const desc = key => (a, b) => (a[key] === b[key] ? 0 : a[key] < b[key] ? 1 : -1)
const asc = key => (a, b) => (a[key] === b[key] ? 0 : a[key] < b[key] ? -1 : 1)

const rows = [
  { id: 1, prio: 2, time: 1700 },
  { id: 2, prio: 2, time: 1600 },
  { id: 3, prio: 1, time: 1500 },
]
const sorted = rows.slice().sort(by(desc('prio'), asc('time')))
```

2. 稳定排序保证（对等分数按创建顺序）

```js
// JS sort 现代规范稳定；若需兼容极老环境，可用“装饰-排序-去装饰”
function stableSortBy(arr, keyFn, cmp = (a, b) => a - b) {
  return arr
    .map((v, i) => ({ v, k: keyFn(v), i }))
    .sort((a, b) => {
      const r = cmp(a.k, b.k)
      return r || a.i - b.i
    })
    .map(x => x.v)
}
```

3. 本地化排序（按拼音/区域规则）

```js
const names = ['张三', '李四', '王五']
const sortedCN = names.slice().sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
```

### 排序（概览与选型）｜常见面试问题

1. 快排为何平均 O(n log n) 却有最坏 O(n^2)？如何缓解？
   - 答：划分不均导致递归深度接近 n；随机化选枢轴或三取样中值可降低最坏概率。
2. 归并为何稳定？
   - 答：合并时相等元素取自左边优先，保持相对次序；实现时需注意 `<=`。
3. 插入排序何时更优？
   - 答：小数组（如 n≤32）或近乎有序序列；常作为混合排序的阈值算法。
4. JS sort 的默认行为与隐患？
   - 答：默认按字符串字典序；数字排序需比较器；现代规范要求稳定。
5. 计数/基数排序的适用条件？
   - 答：键是整数且范围有限/可拆位的场景，可达线性时间。

### 排序（概览与选型）｜使用场景选择指南

- 何时用快排：通用场景、内存友好、追求平均性能。
- 何时用归并：需要稳定性/外部排序/链表排序。
- 何时用插入：小数组或近有序；也用于混合排序阈值段。
- 何时用计数/基数/桶：键范围有限、非比较排序更快。

### 排序（概览与选型）｜记忆要点总结

- 数值排序要比较器；稳定性：归并稳、快排常不稳；小规模用插入。
- 随机化/三取样降低快排最坏；toSorted 可避免变异。

---

### 搜索（线性/二分）｜知识点介绍

- 定义：搜索是在集合中查找满足条件的元素位置或存在性；二分要求集合有序。
- 复杂度：
  - 线性搜索 O(n)
  - 二分搜索 O(log n)
- 拓展：下界（lower_bound，首个 ≥target）、上界（upper_bound，首个 >target），用于区间与计数。

### 搜索（线性/二分）｜系统梳理

- 位置与关联：排序后的数组通常用二分定位；树结构（BST）可视作“多叉二分”。
- 常见变体：
  - 精确命中、下界、上界、最接近值、旋转数组搜索、二分答案（参数域单调）。
- 边界策略：闭区间/开区间指针更新、循环终止条件统一化。

### 搜索（线性/二分）｜使用示例

```js
// 1) 基本二分（命中索引，找不到返回 -1）
function binarySearch(arr, target, cmp = (a, b) => a - b) {
  let l = 0,
    r = arr.length - 1
  while (l <= r) {
    const m = (l + r) >> 1
    const c = cmp(arr[m], target)
    if (c === 0) return m
    if (c < 0) l = m + 1
    else r = m - 1
  }
  return -1
}

// 2) lower_bound：首个 >= target 的索引（若都小于则返回 arr.length）
function lowerBound(arr, target, cmp = (a, b) => a - b) {
  let l = 0,
    r = arr.length
  while (l < r) {
    const m = (l + r) >> 1
    if (cmp(arr[m], target) < 0) l = m + 1
    else r = m
  }
  return l
}

// 3) upper_bound：首个 > target 的索引
function upperBound(arr, target, cmp = (a, b) => a - b) {
  let l = 0,
    r = arr.length
  while (l < r) {
    const m = (l + r) >> 1
    if (cmp(arr[m], target) <= 0) l = m + 1
    else r = m
  }
  return l
}
```

### 搜索（线性/二分）｜实战应用举例

1. 断点匹配（响应式断点/区间边界）

```js
const breaks = [0, 640, 768, 1024, 1280]
function activeBreakpoint(width) {
  const i = upperBound(breaks, width) - 1
  return Math.max(0, i)
}
```

2. 固定高度虚拟列表的可见窗口起点（用二分定位首个可见下标）

```js
function firstVisibleIndex(scrollTop, itemHeight) {
  return Math.floor(scrollTop / itemHeight)
}
// 若高度不等，则可对前缀和数组二分：prefixHeights 用 lowerBound(prefixHeights, scrollTop)
```

3. 二分答案（最小可行值示例：最小带宽满足总时长 ≤ D）

```js
function minSpeedToFinish(jobs, hours) {
  // 单调性：速度越快总耗时越短
  let lo = 1,
    hi = Math.max(...jobs)
  const time = spd => jobs.reduce((t, x) => t + Math.ceil(x / spd), 0)
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (time(mid) <= hours) hi = mid
    else lo = mid + 1
  }
  return lo
}
```

### 搜索（线性/二分）｜常见面试问题

1. 二分模板为何容易错？
   - 答：边界与收敛条件不清；统一成 [l,r] 或 [l,r) 模板，谨慎更新。
2. lower/upper bound 的典型用途？
   - 答：区间计数、插入位置、去重后计数、命中首尾边界。
3. 旋转有序数组如何二分？
   - 答：判断哪一半有序并在有序半边内继续二分。
4. 二分答案的本质？
   - 答：在“答案空间”上利用可行性单调性做二分搜索。
5. 比较函数的要求？
   - 答：自反、传递、反对称；避免不一致导致死循环或错判。

### 搜索（线性/二分）｜使用场景选择指南

- 何时使用二分：数据有序或答案空间单调；需要对数级定位时。
- 何时使用线性：数据规模小、无序且只查一次、或比较代价极低。
- 组合：排序一次 + 多次二分，比分别线性多次更划算。

### 搜索（线性/二分）｜记忆要点总结

- 二分要统一区间定义与更新规则；lower/upper 是高频工具函数。
- 排序+二分是前端本地索引与性能优化常用搭配。

---

> 下一篇（Part 9，单独文件）将覆盖：递归与分治（递归树、尾递归优化思路、常见分治模式），并结合前端实际场景给出可运行示例。
