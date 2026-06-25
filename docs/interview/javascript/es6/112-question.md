# 112. [中级] 什么是迭代器？如何自定义迭代器？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

迭代器是一个有 `next()` 方法的对象，每次调用返回 `{ value: any, done: boolean }`。它提供统一的遍历接口，让不同数据结构（数组、Set、Map、自定义对象）能用同样的方式消费。核心是**惰性求值**——调用 `next()` 才取下一个值。

一句话答法：迭代器是拥有 `next()` 方法的对象，每次返回 `{ value, done }`。自定义迭代器只需给对象定义 `[Symbol.iterator]()` 方法，返回一个 `{ next() }` 对象。

## 问题意图

1. 是否理解迭代器协议：`{ next: () => { value, done } }`。
2. 是否知道可迭代协议：`[Symbol.iterator]` 返回迭代器。
3. 是否能写出自定义 `[Symbol.iterator]` 的完整代码。
4. 是否知道 `for...of`、`[...x]`、解构底层依赖迭代器。

## 考察范围

- 迭代器协议：`{ next() → { value, done } }`。
- 可迭代协议：`obj[Symbol.iterator] = () => iterator`。
- 内置可迭代对象：Array、String、Map、Set、arguments、NodeList。
- 消费迭代器的语法：`for...of`、`[...x]`、`Array.from()`、解构、`Promise.all()`。
- Generator 是迭代器的最简实现。
- 普通对象不可迭代（没有 `[Symbol.iterator]`）。

## 技术错误纠正

- "迭代器就是 `for...of`"——`for...of` 是迭代器的消费者，迭代器是底层协议。
- "数组才能迭代"——实现 `[Symbol.iterator]` 的任何对象都可以迭代。

## 知识点系统梳理

### 迭代器协议

```js
// 迭代器的本质：一个 next() 方法
const iterator = {
  index: 0,
  data: ['a', 'b', 'c'],
  next() {
    if (this.index < this.data.length) {
      return { value: this.data[this.index++], done: false }
    }
    return { value: undefined, done: true }
  }
}

iterator.next()  // { value: 'a', done: false }
iterator.next()  // { value: 'b', done: false }
iterator.next()  // { value: 'c', done: false }
iterator.next()  // { value: undefined, done: true }
```

### 可迭代协议 + 自定义迭代器

```js
const myIterable = {
  data: ['x', 'y', 'z'],
  [Symbol.iterator]() {
    let i = 0
    const data = this.data
    return {
      next() {
        if (i < data.length) return { value: data[i++], done: false }
        return { done: true }
      }
    }
  }
}

// 现在能用 for...of 了
for (const v of myIterable) console.log(v) // x, y, z
;[...myIterable]                             // ['x', 'y', 'z']
const [first, ...rest] = myIterable          // first='x', rest=['y','z']
```

### 生成器版本

```js
const myIterable = {
  data: ['x', 'y', 'z'],
  *[Symbol.iterator]() { yield* this.data }
}
```

### 内置可迭代对象

```js
Array.prototype[Symbol.iterator]   // ✅
String.prototype[Symbol.iterator]  // ✅
Map.prototype[Symbol.iterator]     // ✅
Set.prototype[Symbol.iterator]     // ✅

const obj = {}
typeof obj[Symbol.iterator]        // 'undefined'
```

## 实战应用举例

### 示例 1：范围迭代器

```js
function range(start, end, step = 1) {
  return {
    [Symbol.iterator]() {
      let value = start
      return {
        next() {
          if (value <= end) return { value: value, done: (value += step, false) }
          // 等价于：
          // if (value <= end) {
          //   const result = { value, done: false } ; value += step ; return result
          // }
          return { done: true }
        }
      }
    }
  }
}

;[...range(1, 5)]      // [1, 2, 3, 4, 5]
;[...range(0, 10, 2)]  // [0, 2, 4, 6, 8, 10]
```

### 示例 2：无限迭代器

```js
function naturalNumbers() {
  let n = 0
  return {
    [Symbol.iterator]() { return this },
    next() { return { value: n++ } }  // done: false 可省略
  }
}

const nums = naturalNumbers()
nums.next().value  // 0
nums.next().value  // 1
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 自定义数据结构迭代 | 自定义 `[Symbol.iterator]` | 让自定义类支持 `for...of` |
| 简化迭代器实现 | Generator `*[Symbol.iterator]()` | 生成器自动处理 next |
| 只需迭代一次 | Generator 函数 | 更简洁，无需定义类 |
| 惰性数据序列 | 迭代器 + next | 按需取值 |

## 易错点提示

- 迭代器对象必须实现 `next()` 方法，返回 `{ value, done }` 对象。
- `[Symbol.iterator]` 方法必须返回迭代器对象，不是返回值本身。
- 同一个可迭代对象可以被多次迭代，每次 `[Symbol.iterator]()` 必须返回新迭代器。
- 普通对象不能 `for...of`——`for...in` 或 `Object.keys/values/entries` 替代。
- 迭代器是一次性消费品，状态不能重置。

## 记忆要点总结

- 迭代器协议：`{ next() → { value, done } }`。
- 可迭代协议：`obj[Symbol.iterator] = () => iterator`。
- 消费：`for...of`、`[...x]`、解构、`Array.from`。
- Generator 是最简实现方式。

## 延伸问题

1. 迭代器和生成器有什么关系？
2. 为什么普通对象不默认可迭代？
3. 如何让普通对象支持 `for...of`？

## 可能类似的问题及简要参考答案

**Q：迭代器和可迭代对象有什么区别？**
A：可迭代对象有 `[Symbol.iterator]` 方法返回迭代器；迭代器有 `next()` 方法遍历数据。

**Q：`for...of` 和 `for...in` 有什么区别？**
A：`for...of` 遍历可迭代对象的值（通过 `Symbol.iterator`），`for...in` 遍历对象的可枚举字符串键（含原型链）。

**Q：如何让一个普通对象可迭代？**
A：给对象定义 `[Symbol.iterator]()` 方法返回一个带 `next()` 的对象。

## 辅助记忆总结

记成一句话：迭代器 = `next()` 吐数据的机器，可迭代对象 = 身上贴着`[Symbol.iterator]`标签的东西——`for...of` 就找这个标签。
