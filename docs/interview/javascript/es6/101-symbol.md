# 101. [高级] 如何使用 Symbol 创建对象的私有属性？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

在 ES2022 `#` 私有字段之前，Symbol 是模拟"私有属性"的常用方式——在模块作用域内定义 Symbol，用它作属性键，类外部无法直接构造相同的 Symbol 来访问。但这种方法**不是真正私有**（`Object.getOwnPropertySymbols` 可枚举）。

一句话答法：在模块顶层定义 `const _private = Symbol('private')`，类内部用 `this[_private]` 存取值；模块外无法直接构造相同 Symbol，但可通过 `getOwnPropertySymbols` 穿透。

## 问题意图

1. 是否理解 Symbol 作为属性键的隔离机制——不在模块作用域就无法构造相同 Symbol。
2. 是否知道 Symbol 私有和 `#` 私有字段的根本区别（Symbol 可枚举，`#` 不可）。
3. 是否能写出利用 Symbol 实现封装属性的完整模式。

## 考察范围

- 模块作用域内定义 Symbol 变量作为私有键。
- 类内部通过 `this[SymbolVar]` 存取。
- Symbol 属性的局限性：`Object.getOwnPropertySymbols()` 可列出所有 Symbol。
- 对比 `#` 私有字段（ES2022，真正私有）。
- 对比 `_` 前缀约定（无保护）。
- 对比 WeakMap 私有（真正私有但语法繁琐）。

## 技术错误纠正

- "Symbol 可以实现真正的私有属性"——不准确。虽然模块外无法直接构造相同的 Symbol，但 `Object.getOwnPropertySymbols(obj)` 可以枚举出所有 Symbol 键，然后就可以读取/修改。
- 如果 Symbol 变量被导出，外部也完全可以访问。

## 知识点系统梳理

### 四种私有方案对比

```js
// 方案 A: Symbol（模块隔离级）
const _id = Symbol('id')
class User {
  constructor(id) { this[_id] = id }
  getId() { return this[_id] }
}

// 方案 B: # 私有字段（真正私有，ES2022）
class User {
  #id
  constructor(id) { this.#id = id }
  getId() { return this.#id }
}

// 方案 C: _ 约定（无保护）
class User {
  constructor(id) { this._id = id }
}

// 方案 D: WeakMap（真正私有）
const privates = new WeakMap()
class User {
  constructor(id) { privates.set(this, { id }) }
  getId() { return privates.get(this).id }
}
```

### 对比表

| 方案 | 真正私有 | 可枚举 | 语法简洁 | 兼容性 |
| --- | --- | --- | --- | --- |
| Symbol | ❌（`getOwnPropertySymbols` 可查） | 不可枚举 | ✅ | ES6+ |
| `#` 字段 | ✅ | 不可枚举 | ✅ | ES2022+ |
| `_` 约定 | ❌ 毫无保护 | 可枚举 | ✅ | 全兼容 |
| WeakMap | ✅ | 不可枚举 | ❌ 繁琐 | ES6+ |

### Symbol 私有模式详解

```js
// lib/user.js
const _id = Symbol('id')
const _token = Symbol('token')

export class User {
  constructor(name, token) {
    this.name = name
    this[_id] = crypto.randomUUID()
    this[_token] = token
  }
  get id() { return this[_id] }
  verify(t) { return this[_token] === t }
}

// 外部代码无法直接访问 _id 和 _token（除非用 getOwnPropertySymbols）
```

## 实战应用举例

### 示例：模块内私有状态

```js
const _internal = Symbol('internal')

export class BankAccount {
  constructor(owner) {
    this.owner = owner
    this[_internal] = { balance: 0, pin: null, txns: [] }
  }

  setPin(pin) { this[_internal].pin = pin }
  deposit(amt) { this[_internal].balance += amt }
  get balance() { return this[_internal].balance }
}
```

## 使用场景说明和对比

| 场景 | 推荐方案 |
| --- | --- |
| 新项目，现代环境 | `#` 私有字段 |
| 库代码需兼容 ES6 | Symbol 私有（不导出 Symbol 变量） |
| 老旧项目 | `_` 约定 + ESLint |
| 需要真正运行时保护 | `#` 或 WeakMap |

## 易错点提示

- Symbol 私有不是安全机制，是"防君子不防小人"——`Object.getOwnPropertySymbols` + `Object.getOwnPropertyDescriptor` 可完全读取。
- 如果 Symbol 变量被意外导出或可以通过 `Symbol.for()` 重建，等于公开了访问路径。
- `JSON.stringify` 会忽略 Symbol 键属性，序列化后丢失。
- `#` 私有字段是 ES2022 标准，现代 Node/Chrome/Firefox/Safari 均已支持。

## 记忆要点总结

- Symbol 私有 = 模块作用域隔离，不是真正私有。
- `Object.getOwnPropertySymbols()` 可枚举穿透。
- 三对比：Symbol（模块隔离）、`#`（真正私有）、`_`（无保护）。

## 延伸问题

1. Symbol 私有和 `#` 私有字段在枚举性上有什么不同？
2. 如何用 Proxy 拦截 `Object.getOwnPropertySymbols` 来增强 Symbol 私有？
3. 为什么说 `#` 私有字段是 JavaScript 第一个真正意义上的私有机制？

## 可能类似的问题及简要参考答案

**Q：Symbol 能实现真正的私有属性吗？**
A：不能。`Object.getOwnPropertySymbols()` 可以获取所有 Symbol 键，外界仍然可以访问。

**Q：Symbol 私有和 `#` 私有哪个更好？**
A：`#` 更好。它是真正的语言级私有，编译后就无法访问。Symbol 私有只是约定级隔离。

**Q：什么场景仍然适合用 Symbol 模拟私有？**
A：需要兼容 ES6 且不愿意用 Babel 转译 `#` 字段的库代码。

## 辅助记忆总结

记成一句话：Symbol 私有 = 模块内看不见键名但能枚举到——防误用不防恶意，`#` 字段才是真私有。
