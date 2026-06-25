# 099. [中级] 如何创建 Symbol？Symbol 的用途有哪些？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

创建 Symbol 有四种方式：`Symbol()`（本地唯一）、`Symbol(description)`（带描述）、`Symbol.for(key)`（全局共享）、`Symbol.keyFor(sym)`（查 key）。用途覆盖唯一属性键、元编程协议（迭代器、toStringTag）、常量枚举和封装内部状态。

一句话答法：`Symbol()` 创建本地唯一值，`Symbol.for()` 创建/获取全局注册 Symbol；用途包括唯一属性键、迭代器协议、`toStringTag`、枚举常量和模块内状态隔离。

## 问题意图

1. 是否知道 `Symbol()` 和 `Symbol.for()` 的区别——前者的唯一性 vs 后者的全局共享。
2. 是否能举出 3 个以上的实际用途而非只说"定义唯一值"。
3. 是否了解内置 Symbol 作为协议接口的作用（如 `Symbol.iterator`）。

## 考察范围

- `Symbol()` 创建本地唯一 Symbol。
- `Symbol(description)` 带描述的 Symbol，`.description` 读取。
- `Symbol.for(key)` 全局注册表中创建/获取 Symbol。
- `Symbol.keyFor(sym)` 查询全局 Symbol 的 key。
- 不是所有 Symbol 都能用 `keyFor`（仅 `for` 创建的）。
- 用途：唯一属性键、迭代器（`Symbol.iterator`）、类型转换（`Symbol.toPrimitive`）、toStringTag、枚举常量。
- 内置 Symbol 作为"协议接口"的概念。

## 技术错误纠正

- "Symbol 作为私有属性"—`Symbol()` 在模块级定义可做模块内私有，但外界仍可通过 `Object.getOwnPropertySymbols` 访问。
- `Symbol.for('key')` 不是 `Symbol('key')` 的别名——行为完全不同（一个全局共享，一个本地唯一）。

## 知识点系统梳理

### 四种创建方式

```js
// 1. 本地唯一
const s1 = Symbol()           // 无描述
const s2 = Symbol('myKey')    // 带描述
s2.description  // 'myKey'

// 2. 全局注册表
const g1 = Symbol.for('app.config')
const g2 = Symbol.for('app.config')
g1 === g2  // true ← 相同 key 返回同一 Symbol

// 3. 查 key（仅全局 Symbol 可用）
Symbol.keyFor(g1)   // 'app.config'
Symbol.keyFor(s2)   // undefined
```

### Symbol() vs Symbol.for()

| 对比 | `Symbol()` | `Symbol.for()` |
| --- | --- | --- |
| 唯一性 | 每次调用返回新值 | 相同 key 返回同一值 |
| 注册表 | 不使用 | 使用全局注册表 |
| 跨模块共享 | 不能（除非导出变量） | 可以（相同 key） |
| `keyFor` 查询 | `undefined` | 返回注册 key |
| 适用场景 | 模块内私有键 | 跨模块协议/常量 |

### 主要用途速查

```js
// 1. 唯一常量
const COLORS = { RED: Symbol('red'), BLUE: Symbol('blue') }

// 2. 迭代器协议
class Range {
  constructor(s, e) { this.s = s; this.e = e }
  *[Symbol.iterator]() { for (let i = this.s; i < this.e; i++) yield i }
}

// 3. 自定义 toStringTag
class MyClass { get [Symbol.toStringTag]() { return 'MyClass' } }
Object.prototype.toString.call(new MyClass())
// "[object MyClass]"

// 4. 类型转换
class Temp {
  constructor(c) { this.c = c }
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? `${this.c}°C` : this.c
  }
}
```

## 实战应用举例

### 示例 1：跨模块共享配置键

```js
// config-keys.js
const DB_URL = Symbol.for('app.db.url')
const API_KEY = Symbol.for('app.api.key')
export { DB_URL, API_KEY }

// app.js
import { DB_URL } from './config-keys.js'
const config = { [DB_URL]: 'mysql://localhost' }
```

### 示例 2：自定义对象类型转换

```js
class Price {
  constructor(amount, currency = 'USD') {
    this.amount = amount
    this.currency = currency
  }
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount
    return `${this.currency} ${this.amount.toFixed(2)}`
  }
}

const p = new Price(19.99)
+p         // 19.99（数字上下文）
`${p}`     // 'USD 19.99'（字符串上下文）
```

## 使用场景说明和对比

| 用途 | 创建方式 | 说明 |
| --- | --- | --- |
| 模块内私有属性键 | `Symbol()` | 不导出 Symbol 变量，外部无法构造相同 Symbol |
| 跨模块共享常量 | `Symbol.for()` | 相同 key 全局唯一 |
| 元编程协议 | 内置 Symbol | `Symbol.iterator`、`Symbol.toPrimitive` 等 |
| 枚举常量 | `Symbol()` | 比字符串更安全（不会意外匹配） |

## 易错点提示

- `Symbol.for('x')` 和 `Symbol('x')` 不是同一个值，`===` 为 `false`。
- `Symbol.keyFor()` 只能查询全局注册 Symbol，对 `Symbol()` 返回 `undefined`。
- `Symbol()` 即使不传描述也有唯一值，只是调试不便。
- `Symbol` 的 `description` 属性是只读的（ES2019）。
- 内置 Symbol（如 `Symbol.iterator`）是语言规范预定义的，不要用 `Symbol.for` 覆盖。

## 记忆要点总结

- 创建：`Symbol()` 本地唯一，`Symbol.for()` 全局共享。
- 查 key：`Symbol.keyFor()` 只查全局注册表。
- 四大用途：唯一键、迭代协议、toStringTag、toPrimitive。

## 延伸问题

1. `Symbol.for('key')` 的全局注册表在跨 iframe/realm 中是否共享？
2. 如果意外用 `Symbol.for` 覆盖了内置 Symbol 会发生什么？
3. `description` 和 `key` 有什么区别？

## 可能类似的问题及简要参考答案

**Q：`Symbol()` 和 `Symbol.for()` 有什么区别？**
A：`Symbol()` 每次创建唯一值；`Symbol.for()` 使用全局注册表，相同 key 返回相同值。

**Q：如何检查一个 Symbol 是否在全局注册表中？**
A：用 `Symbol.keyFor(sym)`，返回非 `undefined` 则说明在注册表中。

**Q：有哪些常用的内置 Symbol？**
A：`Symbol.iterator`、`Symbol.toStringTag`、`Symbol.toPrimitive`、`Symbol.hasInstance`、`Symbol.species`。

## 辅助记忆总结

记成一句话：`Symbol()` 是"我自己的唯一标签"，`Symbol.for()` 是"大家共用的唯一标签"。
