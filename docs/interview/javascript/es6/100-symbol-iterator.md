# 100. [中级] Symbol.iterator 的作用是什么？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

`Symbol.iterator` 是让对象可被 `for...of`、`[...obj]`、解构等语法消费的"协议接口"。实现了 `[Symbol.iterator]` 方法的对象被称为"可迭代对象"。面试问这个是在考察你是否理解迭代器协议 `{ next() → { value, done } }` 以及生成器如何简化它。

一句话答法：`Symbol.iterator` 定义对象的默认迭代行为，返回一个 `{ next() }` 迭代器对象；实现了它就能用 `for...of`、扩展运算符、解构赋值。

## 问题意图

1. 是否理解迭代器协议：`next()` 返回 `{ value, done }`。
2. 是否能给自定义类实现 `[Symbol.iterator]` 使其可被 `for...of` 消费。
3. 是否知道生成器 `function*` 是实现 `Symbol.iterator` 的最简洁方式。
4. 是否了解哪些内置对象已实现了 `Symbol.iterator`（Array、Map、Set、String、arguments、NodeList）。

## 考察范围

- 迭代器协议：对象有 `next()` 方法返回 `{ value, done }`。
- 可迭代协议：对象有 `[Symbol.iterator]` 方法返回迭代器。
- `for...of` 循环的内部机制：调 `[Symbol.iterator]()` → 反复调 `next()`。
- 消费可迭代对象的语法：`for...of`、`[...arr]`、`[a,b,...rest]`、`Array.from()`、`Promise.all()`。
- 利用生成器简化：`*[Symbol.iterator]() { yield ... }`。
- 内置可迭代对象：Array、String、Map、Set、arguments、NodeList、TypedArray。
- 普通对象默认不可迭代（`for...of` 报错）。

## 技术错误纠正

- 原始代码用 `Symbol('iterator')` 而非 `Symbol.iterator`——自定义迭代器应使用 `[Symbol.iterator]` 内置 Symbol，而不是自定义 Symbol。
- "让对象可以通过 for...of 循环遍历"是结果不是机制，机制是实现了迭代器协议。

## 知识点系统梳理

### 迭代器协议 vs 可迭代协议

```js
// 可迭代协议：对象有 [Symbol.iterator]() 方法
// 迭代器协议：返回的对象有 next() 方法
// next() 返回 { value: any, done: boolean }

const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let i = 0
    const data = this.data
    return {          // ← 迭代器对象
      next() {
        if (i < data.length) {
          return { value: data[i++], done: false }
        }
        return { done: true }
      }
    }
  }
}

for (const v of iterable) { console.log(v) } // 1, 2, 3
```

### 消费可迭代对象的语法

```js
const range = { *[Symbol.iterator]() { for (let i = 1; i <= 3; i++) yield i } }

for (const n of range)     // 1, 2, 3
;[...range]                // [1, 2, 3]
const [a, ...rest] = range // a=1, rest=[2,3]
Array.from(range)          // [1, 2, 3]
new Set(range)             // Set {1, 2, 3}
```

### 内置可迭代对象

```js
Array.prototype[Symbol.iterator]   // ✅
String.prototype[Symbol.iterator]  // ✅
Map.prototype[Symbol.iterator]     // ✅
Set.prototype[Symbol.iterator]     // ✅
arguments[Symbol.iterator]         // ✅
NodeList.prototype[Symbol.iterator]// ✅

const obj = {}
obj[Symbol.iterator]               // ❌ undefined
for (const v of obj) {}            // TypeError
```

### 生成器版本（最简洁）

```js
class Range {
  constructor(start, end) { this.start = start; this.end = end }
  *[Symbol.iterator]() {
    for (let i = this.start; i < this.end; i++) yield i
  }
}

;[...new Range(1, 5)] // [1, 2, 3, 4]
```

## 实战应用举例

### 示例 1：自定义分段迭代

```js
class PaginatedList {
  constructor(items, pageSize = 2) {
    this.items = items
    this.pageSize = pageSize
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.items.length; i += this.pageSize) {
      yield this.items.slice(i, i + this.pageSize)
    }
  }
}

const list = new PaginatedList([1,2,3,4,5])
;[...list] // [[1,2], [3,4], [5]]
```

### 示例 2：树结构深度优先遍历

```js
class TreeNode {
  constructor(val) { this.val = val; this.children = [] }
  *[Symbol.iterator]() {
    yield this.val
    for (const child of this.children) yield* child
  }
}
```

## 使用场景说明和对比

| 场景 | 方案 | 说明 |
| --- | --- | --- |
| 自定义数据结构迭代 | `[Symbol.iterator]` | 让自定义类支持 `for...of` |
| 简化迭代实现 | `*[Symbol.iterator]()` | 生成器自动处理 next() |
| 只需迭代一次 | `function*` 生成器 | 更轻量，不涉及类 |
| 异步数据流（分页） | `[Symbol.asyncIterator]` | 异步版本的迭代协议 |

## 易错点提示

- 普通对象没有 `[Symbol.iterator]`，`for...of` 会 `TypeError`。对象迭代用 `Object.keys/values/entries`。
- `Symbol.iterator` 方法必须返回迭代器对象，不是返回值本身。
- 生成器 `*[Symbol.iterator]()` 返回的迭代器是 `Generator` 对象，天生符合迭代器协议。
- 同一个可迭代对象可以被多次迭代，但每次调用 `[Symbol.iterator]()` 必须返回新的迭代器（除非是单次消费的生成器）。

## 记忆要点总结

- `Symbol.iterator` = 对象的"让 for...of 能用"协议。
- 实现 = 返回 `{ next() → { value, done } }` 的对象。
- 消费：`for...of`、`[...x]`、解构、`Array.from()`。
- 最简实现：`*[Symbol.iterator]() { yield ... }`。

## 延伸问题

1. 为什么普通对象不能用 `for...of`？
2. `Symbol.iterator` 和 `Symbol.asyncIterator` 有什么区别？
3. `yield*` 在迭代器委托中的作用是什么？
4. 如何让一个对象既可以迭代又可以重置迭代？

## 可能类似的问题及简要参考答案

**Q：`for...of` 和 `for...in` 有什么区别？**
A：`for...of` 遍历可迭代对象的**值**（通过 `Symbol.iterator`），`for...in` 遍历对象的**可枚举键**（字符串键）。

**Q：为什么普通对象不能用 `for...of`？**
A：普通对象没有实现 `[Symbol.iterator]` 方法。可以用 `Object.keys()` 或 `Object.entries()` 替代。

**Q：生成器如何简化迭代器实现？**
A：生成器函数 `function*` 自动产生 `next()` 和 `{ value, done }` 结构，`*[Symbol.iterator]()` 一行顶手动迭代器的多行。

## 辅助记忆总结

记成一句话：`Symbol.iterator` 是 JS 对象的"可迭代身份证"——实现了它，`for...of`、`[...x]`、解构就都能用。
