# 085. [中级]** 扩展运算符的实际应用场景

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

扩展运算符 `...` 在不同上下文中有两种角色：在函数调用和数组/对象字面量中是"展开"（spread），在函数参数和解构中是"收集"（rest）。面试问"实际应用场景"，重点是能举出数组合并、对象浅拷贝、函数参数展开、解构剩余收集、类数组转换这几个高频用法，并说清楚边界。

一句话答法：扩展运算符用于展开可迭代对象（数组展开、对象展开、函数参数展开）和收集剩余项（rest 参数、解构剩余），核心场景是数组/对象合并、浅拷贝和参数转发。

## 问题意图

这道题考察三件事：

1. 是否能区分 spread（展开）和 rest（收集）两种用法。
2. 是否能举出 3-5 个实际业务场景而不是只说语法。
3. 是否知道浅拷贝、性能、可迭代协议等边界限制。

## 考察范围

- 数组 spread：合并、复制、插入、去重。
- 对象 spread：合并、浅拷贝、不可变更新。
- 函数调用 spread：`Math.max(...arr)`、`console.log(...arr)`。
- rest 参数：收集剩余实参。
- 解构 rest：`const [first, ...rest] = arr`、`const { a, ...rest } = obj`。
- 可迭代协议：`...` 在数组上下文中要求目标实现 `Symbol.iterator`。

## 技术错误纠正

- 原答案只列出"剩余参数"和"解构"两个词，缺少具体场景。
- 对象 spread 不要求实现 `Symbol.iterator`（对象 spread 是独立语法，不走迭代协议）。

## 知识点系统梳理

### spread 和 rest 的区别

| 用法 | 语法位置 | 作用 | 示例 |
| --- | --- | --- | --- |
| Spread（展开） | 函数调用、数组/对象字面量 | 把整体拆成个体 | `[...arr]`、`fn(...arr)`、`{...obj}` |
| Rest（收集） | 函数参数、解构赋值 | 把个体收成数组/对象 | `function f(...args)`、`const [a, ...rest] = arr` |

### 六大实战场景速查

```js
// 1. 数组合并
const all = [...arr1, ...arr2, ...arr3]

// 2. 数组/对象浅拷贝
const copy = [...original]
const objCopy = { ...original }

// 3. 函数参数展开
Math.max(...numbers)

// 4. 数组去重
const unique = [...new Set(arr)]

// 5. 类数组转真数组
const arr = [...document.querySelectorAll('div')]

// 6. 不可变状态更新
const newState = { ...state, count: state.count + 1 }
```

## 实战应用举例

### 示例 1：数组操作合集

```js
// 合并——替代 concat
const frontend = ['React', 'Vue']
const backend = ['Node', 'Deno']
const fullstack = [...frontend, ...backend]
// ['React', 'Vue', 'Node', 'Deno']

// 中间插入
const withMiddle = [...frontend, 'Svelte', ...backend]
// ['React', 'Vue', 'Svelte', 'Node', 'Deno']

// 去重
const nums = [1, 2, 2, 3, 3]
const unique = [...new Set(nums)]
// [1, 2, 3]

// 复制并修改（不影响原数组）
const scores = [85, 92, 78]
const sorted = [...scores].sort((a, b) => b - a)
// sorted: [92, 85, 78]，scores 不变
```

边界说明：
- `[...scores].sort()` 是常见技巧——先浅拷贝再排序，避免 `sort()` 修改原数组。
- 浅拷贝只复制第一层，嵌套数组/对象仍共享引用。

### 示例 2：函数参数展开 vs apply

```js
const numbers = [5, 2, 8, 1, 9]

// ES6 spread
Math.max(...numbers) // 9

// ES5 等价写法
Math.max.apply(null, numbers) // 9

// 边界：数组太大（>~65536 个元素）时两种方式都可能栈溢出
// 超大数组应改用 reduce
numbers.reduce((max, n) => n > max ? n : max, -Infinity)
```

### 示例 3：解构 rest 剔除属性

```js
const user = { name: 'Alice', password: 'secret', age: 25, role: 'admin' }

// 剔除 password，取剩余属性
const { password, ...safeUser } = user
console.log(safeUser) // { name: 'Alice', age: 25, role: 'admin' }

// 数组解构：取第一个，收集剩余
const [head, ...tail] = [1, 2, 3, 4]
// head: 1, tail: [2, 3, 4]
```

## 使用场景说明和对比

| 场景 | 扩展运算符写法 | 替代方案 | 推荐 |
| --- | --- | --- | --- |
| 数组合并 | `[...a, ...b]` | `a.concat(b)` | spread 更直观 |
| 数组浅拷贝 | `[...arr]` | `arr.slice()` | 等价，spread 更通用 |
| 对象浅拷贝/合并 | `{...obj}` | `Object.assign({}, obj)` | spread 不改原对象 |
| 函数参数展开 | `fn(...arr)` | `fn.apply(null, arr)` | spread 更简洁 |
| 类数组转数组 | `[...nodeList]` | `Array.from(nodeList)` | `Array.from` 可传 mapFn |
| 数组去重 | `[...new Set(arr)]` | `Array.from(new Set(arr))` | 等价 |

和 rest 参数/解构的关系：

| 用法 | 位置 | 作用 |
| --- | --- | --- |
| `fn(...arr)` | 函数调用 | 展开数组为多个实参 |
| `function f(...args)` | 函数定义 | 收集多个实参为数组 |
| `[a, ...rest] = arr` | 解构赋值 | 收集剩余元素为数组 |
| `{ a, ...rest } = obj` | 解构赋值 | 收集剩余属性为对象 |

## 易错点提示

- 对象 spread 只能在对象字面量中使用，`console.log(...obj)` 报错（普通对象不可迭代）。
- `[...obj]` 要求 `obj` 实现 `Symbol.iterator`，普通对象没有，会报 `not iterable`。
- 浅拷贝只复制第一层，嵌套引用类型仍共享。
- `Math.max(...hugeArray)` 在数组过大时可能栈溢出（V8 参数上限约 65536）。
- rest 参数必须是参数列表最后一个：`function f(...a, b)` 语法错误。

## 记忆要点总结

- Spread = 展开（调用/字面量中），Rest = 收集（参数/解构中）。
- 核心六场景：数组合并、浅拷贝、参数展开、去重、类数组转换、不可变更新。
- 对象 spread 不走迭代协议，和数组 spread 是不同语法。
- 全部是浅操作，深层引用共享。
- 超大数组展开可能栈溢出，改用 `reduce`。

## 延伸问题

1. `{...arr}` 和 `[...obj]` 分别会发生什么？
2. 为什么 `Math.max(...largeArray)` 可能报错？上限是多少？
3. 对象 spread 和数组 spread 在底层机制上有什么不同？
4. 如何用 spread 实现数组的深拷贝？
5. `[...str]` 和 `str.split('')` 在处理 emoji 时有什么区别？

## 可能类似的问题及简要参考答案

**Q：扩展运算符和 rest 参数有什么区别？**
A：位置不同、作用相反。Spread 在调用/字面量中"展开"，Rest 在参数/解构中"收集"。

**Q：扩展运算符是深拷贝还是浅拷贝？**
A：浅拷贝。第一层独立，嵌套引用共享。

**Q：`[...str]` 返回什么？**
A：将字符串按 Unicode 码点拆为字符数组。`[...'hi👋']` → `['h', 'i', '👋']`，比 `split('')` 能正确处理 emoji。

**Q：普通对象能用 `[...obj]` 展开吗？**
A：不能。`[...]` 要求目标实现 `Symbol.iterator`，普通对象没有。对象展开只能用 `{...obj}`。

## 辅助记忆总结

记成一句话：`...` 在"给出去"的位置是展开，在"接进来"的位置是收集——展开用于合并/拷贝/传参，收集用于剩余参数/解构。
