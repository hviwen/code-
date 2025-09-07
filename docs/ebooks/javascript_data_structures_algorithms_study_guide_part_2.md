# JavaScript 数据结构与算法学习手册（第 3 版）- Part 2

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 2 章：栈（Stack）](#第-2-章栈stack)
  - [栈｜知识点介绍](#栈知识点介绍)
  - [栈｜系统梳理](#栈系统梳理)
  - [栈｜使用示例](#栈使用示例)
  - [栈｜实战应用举例](#栈实战应用举例)
  - [栈｜常见面试问题](#栈常见面试问题)
  - [栈｜使用场景选择指南](#栈使用场景选择指南)
  - [栈｜记忆要点总结](#栈记忆要点总结)

---

## 第 2 章：栈（Stack）

> 栈是受限的线性表，只能在一端进行插入与删除（后进先出 LIFO）。在编译器、表达式求值、括号匹配、撤销/重做、回溯搜索等场景广泛使用。

### 栈｜知识点介绍

- 定义：栈（Stack）是一种后进先出（LIFO）的抽象数据类型。新元素总在“栈顶”入栈（push），并从“栈顶”出栈（pop）。
- 核心操作与复杂度：
  - push(x)：入栈，平均 O(1)
  - pop()：出栈并返回栈顶元素，O(1)
  - peek()：仅查看栈顶元素，O(1)
  - size()/isEmpty()：O(1)
  - clear()：置空，O(1)（实现相关）
- 实现方式：
  - 基于数组（常用，简单且在 JS 中性能好）。
  - 基于链表（插入/删除 O(1)，但内存指针开销更大）。

### 栈｜系统梳理

- 在知识体系中的位置：
  - 线性结构的一员；与队列（FIFO）相对；常用于算法中的“状态保存与回溯”。
- 关联关系：
  - 与递归：函数调用栈即系统维护的栈；递归可转为显式栈的迭代实现。
  - 与表达式求值：中缀转后缀（逆波兰）、后缀表达式求值。
  - 与括号匹配与语法分析：编译器/解释器常用栈做括号/块结构校验。
  - 与浏览器/编辑器历史：后退/前进、撤销/重做通常由两个栈实现。
- 核心特性与属性：
  - 访问受限：只操作栈顶，保证操作 O(1)。
  - 空间策略：可能设置容量上限；溢出时需策略（丢弃/扩容/报错）。
  - 可用数组或链表实现；在 JS 中优先数组末端作为栈顶（push/pop）。

> 复杂度速查
>
> | 操作   | 复杂度 |
> | ------ | ------ |
> | push   | O(1)   |
> | pop    | O(1)   |
> | peek   | O(1)   |
> | size   | O(1)   |
> | search | O(n)   |

### 栈｜使用示例

以下示例可在 Node.js 或浏览器控制台运行。

```js
// 简易栈实现（基于数组）
class Stack {
  constructor(iterable = []) {
    this._data = []
    for (const x of iterable) this._data.push(x)
  }
  push(x) {
    this._data.push(x)
    return this
  }
  pop() {
    return this._data.pop()
  }
  peek() {
    return this._data[this._data.length - 1]
  }
  size() {
    return this._data.length
  }
  isEmpty() {
    return this._data.length === 0
  }
  clear() {
    this._data.length = 0
  }
  toArray() {
    return this._data.slice()
  }
}

// 基本用法
const s = new Stack()
s.push(1).push(2).push(3)
console.log(s.peek()) // 3
console.log(s.pop()) // 3
console.log(s.size()) // 2
console.log(s.isEmpty()) // false
```

### 栈｜实战应用举例

1. 撤销/重做（Undo/Redo）管理器

```js
// 两个栈：undoStack 存已执行操作，redoStack 存被撤销操作
class UndoRedoManager {
  constructor() {
    this.undoStack = new Stack()
    this.redoStack = new Stack()
  }
  // action: { do:()=>void, undo:()=>void, label?:string }
  exec(action) {
    action.do()
    this.undoStack.push(action)
    this.redoStack.clear()
  }
  undo() {
    if (this.undoStack.isEmpty()) return false
    const action = this.undoStack.pop()
    action.undo()
    this.redoStack.push(action)
    return true
  }
  redo() {
    if (this.redoStack.isEmpty()) return false
    const action = this.redoStack.pop()
    action.do()
    this.undoStack.push(action)
    return true
  }
}

// 示例：编辑器文本追加与回退
let text = ''
const mgr = new UndoRedoManager()

function append(str) {
  const prev = text
  return {
    do: () => {
      text += str
    },
    undo: () => {
      text = prev
    },
    label: `append(${str})`,
  }
}

mgr.exec(append('Hello'))
mgr.exec(append(' World'))
console.log(text) // Hello World
mgr.undo()
console.log(text) // Hello
mgr.redo()
console.log(text) // Hello World
```

2. 括号/括块匹配校验（表单校验、编辑器高亮）

```js
// 支持 () [] {} 的有效性检查
function isBracketsValid(str) {
  const pairs = { ')': '(', ']': '[', '}': '{' }
  const stack = new Stack()
  for (const ch of str) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch)
    } else if (ch === ')' || ch === ']' || ch === '}') {
      if (stack.isEmpty() || stack.pop() !== pairs[ch]) return false
    }
  }
  return stack.isEmpty()
}

console.log(isBracketsValid('{[()]}')) // true
console.log(isBracketsValid('{[(])}')) // false
```

3. 十进制转二进制（或任意进制）

```js
// 使用栈反向收集余数，得到正确顺序
function toBase(num, base = 2) {
  if (num === 0) return '0'
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (base < 2 || base > digits.length) throw new Error('base out of range')
  const stack = new Stack()
  let n = Math.floor(Math.abs(num))
  while (n > 0) {
    stack.push(n % base)
    n = Math.floor(n / base)
  }
  let out = num < 0 ? '-' : ''
  while (!stack.isEmpty()) out += digits[stack.pop()]
  return out
}

console.log(toBase(10, 2)) // "1010"
console.log(toBase(31, 16)) // "1F"
```

### 栈｜常见面试问题

1. 用两个队列实现一个栈，复杂度如何？
   - 思路：保持一个队列为主，每次 push 入主队列；pop 时将前 n-1 个元素移到辅队列，留下最后一个作为栈顶弹出；交换队列引用。
   - 复杂度：push O(1)，pop O(n)（或相反取舍）。

2. 设计一个支持 getMin 的栈，所有操作 O(1)。
   - 思路：维护一个辅助栈 minStack，入栈时压入当前最小值；出栈同步弹出。peekMin 直接看 minStack 栈顶。

3. 递归与显式栈的关系？如何将递归 DFS 改为迭代？
   - 答：递归调用栈由运行时维护；将递归中的“待处理状态”改存到自建栈，循环取栈顶处理即可。

4. 有效括号问题的时间与空间复杂度？
   - 答：时间 O(n)，空间 O(n)（最坏情况下全是左括号）。

5. 何时使用链表实现栈更合适？
   - 答：当频繁在头部操作、且需要规避数组潜在的扩容/复制成本，或受限内存碎片时；但在 JS 中数组 push/pop 已很快，链表实现通常得不偿失。

### 栈｜使用场景选择指南

- 何时使用栈：
  - 需要 LIFO 访问的场景：撤销/重做、回溯、表达式求值、括号匹配、函数调用管理。
- 优点：
  - 接口简单、操作常数时间、适合状态回滚与路径追踪。
- 缺点：
  - 只能访问栈顶，随机访问不便；容量受限时需溢出策略。
- 与替代方案对比：
  - 队列（FIFO）：任务排队、消息传递更合适；与栈访问方向相反。
  - 双端队列（Deque）：两端入出更灵活，能同时模拟栈与队列。
  - 递归：语义自然，但可能造成栈溢出；可用显式栈改写为迭代。
  - 链表：实现栈顶在头部插入/删除 O(1)；但在 JS 中一般数组实现更简洁高效。

### 栈｜记忆要点总结

- 核心特征：LIFO，仅操作栈顶，push/pop/peek O(1)。
- JS 中优先用数组末端作为栈顶（push/pop），避免 shift/unshift。
- 撤销/重做=两个栈；括号匹配=左括号入栈，遇右括号匹配栈顶。
- 递归可转显式栈迭代；注意极端深度的栈溢出风险。
- 复杂度：查找/遍历 O(n)；容量与溢出策略需事先设计。

---

> 下一篇（Part 3，单独文件）将覆盖：队列（Queue）与双端队列（Deque），包含循环队列与节流/防抖队列等前端常见实践。
