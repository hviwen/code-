# 098. [中级] 什么是 Symbol？它的特点是什么？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Symbol 是 ES6 新增的第 7 种原始数据类型，用于创建**绝对唯一**的值。面试问这个是在考察你是否理解"唯一性"的意义——它解决了属性名冲突问题，也是 JS 元编程的入口（内置 Symbol 协议）。

一句话答法：Symbol 是唯一且不可变的原始值，`Symbol()` 每次返回新值（即使描述相同），常用作对象属性键以避免命名冲突。

## 问题意图

1. 是否知道 Symbol 是**原始类型**（不是对象），`typeof` 返回 `"symbol"`。
2. 是否理解 `Symbol('desc')` 的描述（description）仅是调试标签，不影响唯一性。
3. 是否知道 Symbol 作为对象属性键的特殊行为：不可枚举、`Object.keys` 忽略、`Object.getOwnPropertySymbols` 获取。

## 考察范围

- `Symbol()` 创建唯一值，`typeof` 判断。
- 描述参数 `Symbol('desc')` 和 `.description` 属性。
- Symbol 的不可变性：不能被隐式转换为字符串或数字。
- Symbol 作为对象属性键（`obj[sym] = val`）。
- Symbol 属性的不可枚举性（`Object.keys`、`for...in` 跳过）。
- `Object.getOwnPropertySymbols()` 和 `Reflect.ownKeys()` 获取 Symbol 键。
- 全局 Symbol 注册表（`Symbol.for` / `Symbol.keyFor`）和普通 Symbol 的区别。
- 内置 Symbol（`Symbol.iterator`、`Symbol.toStringTag` 等）。

## 技术错误纠正

- "Symbol 可以用来模拟私有属性"——仅靠 Symbol 并不是真正的私有，`Object.getOwnPropertySymbols()` 可以获取所有 Symbol 键。严格私有用 `#` 字段。
- Symbol 不是对象，不能用 `new Symbol()`。

## 知识点系统梳理

### Symbol 的核心特性

```js
// 1. 唯一性——即使描述相同也不相等
Symbol('id') === Symbol('id') // false

// 2. 描述仅用于调试
const s = Symbol('myKey')
s.description // 'myKey'
s.toString()  // 'Symbol(myKey)'

// 3. 不能隐式转换
Symbol() + ''      // TypeError
Number(Symbol())   // TypeError
Boolean(Symbol())  // true（唯一可显式转布尔）

// 4. typeof
typeof Symbol() // 'symbol'
```

### Symbol 作为属性键

```js
const TYPE = Symbol('type')
const obj = {
  name: 'public',
  [TYPE]: 'internal'
}

obj[TYPE]        // 'internal'
Object.keys(obj)      // ['name'] ← Symbol 键被忽略
Object.getOwnPropertySymbols(obj) // [Symbol(type)]
Reflect.ownKeys(obj)  // ['name', Symbol(type)]
```

### Symbol 属性 vs 普通属性

| 对比 | 普通属性（字符串键） | Symbol 键属性 |
| --- | --- | --- |
| 枚举性（for...in） | 可见 | 不可见 |
| `Object.keys()` | 包含 | 不包含 |
| `Object.getOwnPropertySymbols()` | 不包含 | 包含 |
| `Reflect.ownKeys()` | 包含 | 包含 |
| `JSON.stringify()` | 包含 | **不包含** |
| 命名冲突风险 | 可能冲突 | 不可能（唯一） |

## 实战应用举例

### 示例 1：定义唯一常量

```js
const STATUS = {
  PENDING: Symbol('pending'),
  FULFILLED: Symbol('fulfilled'),
  REJECTED: Symbol('rejected'),
}

function handleStatus(s) {
  switch (s) {
    case STATUS.PENDING: return '⏳'
    case STATUS.FULFILLED: return '✅'
    case STATUS.REJECTED: return '❌'
  }
}
```

### 示例 2：避免第三方库属性名冲突

```js
const uiPlugin = Symbol('plugin')
class Widget {
  constructor() {
    this[uiPlugin] = { version: '1.0' }
  }
  getPlugin() { return this[uiPlugin] }
}
// 即使另一段代码也给 Widget 加同名属性，用 String 键会被覆盖，Symbol 不冲突
```

## 使用场景说明和对比

| 场景 | 是否适合 Symbol | 替代方案 |
| --- | --- | --- |
| 唯一常量值（状态枚举） | 适合 | 字符串常量（有冲突风险） |
| 避免用户覆盖的内置方法 | 适合 | 无更好替代 |
| 元编程（迭代器、toStringTag） | 必须 | 内置 Symbol |
| 真正的私有属性 | 不推荐 | `#` 私有字段 |
| 序列化数据（需要 JSON.stringify） | 不适合 | Symbol 键会被忽略 |

## 易错点提示

- Symbol 不是构造函数，不能用 `new Symbol()`。`Symbol()` 是函数调用。
- `Symbol('a') === Symbol('a')` 是 `false`——描述一样也不相等。
- Symbol 不会出现在 `JSON.stringify` 中，如果属性键是 Symbol，序列化后会丢失。
- Symbol 作为属性键时不能用点语法：必须是 `obj[sym]` 而非 `obj.sym`。
- `Object.getOwnPropertySymbols()` 可以列出所有 Symbol 键，所以 Symbol 不是真正私有。

## 记忆要点总结

- Symbol = 唯一原始值，`typeof` → `"symbol"`。
- 描述相同值不同，不能隐式转字符串/数字。
- 属性键三特性：不可枚举、JSON 忽略、`getOwnPropertySymbols` 可查。
- 两大用途：唯一常量 & 元编程（内置 Symbol）。

## 延伸问题

1. `Symbol.for('key')` 和 `Symbol('key')` 的区别是什么？
2. `JSON.stringify` 为什么忽略 Symbol 键属性？
3. 如何获取对象上所有 Symbol 键属性？

## 可能类似的问题及简要参考答案

**Q：Symbol 是基本类型还是引用类型？**
A：基本类型。`typeof Symbol() === 'symbol'`。

**Q：两个相同描述的 Symbol 相等吗？**
A：不相等。`Symbol('a') !== Symbol('a')`，描述只是调试标签。

**Q：Symbol 能作为对象的私有属性吗？**
A：不能完全私有。`Object.getOwnPropertySymbols()` 可以枚举所有 Symbol 键。

## 辅助记忆总结

记成一句话：Symbol 是 JS 的"唯一 ID 生成器"——描述相同的 ID 也不同，存对象上 `for...in` 看不到，`JSON.stringify` 也跳过。
