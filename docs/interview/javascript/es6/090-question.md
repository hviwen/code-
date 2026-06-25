# 090. [中级] 类的私有属性如何实现？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

JavaScript 长期以来没有真正的私有属性，只能靠约定（`_` 前缀）或闭包模拟。ES2022 引入了 `#` 私有字段，提供语言级的真正封装。面试问"私有属性如何实现"是考察你是否了解原生私有语法，以及是否知道历史上的替代方案。

一句话答法：ES2022 用 `#` 前缀定义真正私有字段，运行时报错强制保护；旧方案用 `_` 约定、WeakMap 或闭包模拟。

## 问题意图

1. 是否知道 `#` 私有字段语法（`#balance = 0`）及其访问规则。
2. 是否了解 `_` 前缀只是约定，无法真正阻止外部访问。
3. 是否能对比不同私有方案的优缺点和适用场景。

## 考察范围

- `#` 私有字段定义和访问语法（`#field`、`this.#field`）。
- 私有方法（`#method()`）。
- `#` 字段的硬约束：类外访问报 SyntaxError，运行时 `in` 检查。
- 私有字段不能在类外部定义，必须先声明。
- `_` 前缀约定的历史用法和实际工程。
- WeakMap 模拟私有（无 `#` 时的 polyfill 方式）。
- 闭包模拟私有（利用作用域，每个实例独立闭包）。
- 私有字段的继承行为（子类不可直接访问父类私有字段）。

## 技术错误纠正

- 原始代码 `static color = 'yellow_while_black'` 演示的是**静态属性**，不是私有属性。需要补私有属性的正确示例。
- `#` 私有字段是 ES2022 进入标准的，不是提案阶段。现代 Node.js 和浏览器已全面支持。

## 知识点系统梳理

### 四类私有实现方案

```js
// 1. # 私有字段（ES2022，推荐）
class BankAccount {
  #balance = 0       // 私有字段
  #pin               // 先声明
  constructor(pin) { this.#pin = pin }

  #validate(pin) {   // 私有方法
    return this.#pin === pin
  }

  getBalance(pin) {
    if (!this.#validate(pin)) throw new Error('Invalid PIN')
    return this.#balance
  }
}

// 2. _ 约定（不推荐，但广泛存在）
class Legacy {
  _privateCount = 0   // 没有真正保护
}

// 3. WeakMap（# 出现前的 polyfill 方案）
const privates = new WeakMap()
class User {
  constructor(password) {
    privates.set(this, { password })
  }
  check(pwd) { return privates.get(this).password === pwd }
}

// 4. 闭包（构造函数内定义私有，每个实例独享）
class Secret {
  constructor(secret) {
    const _secret = secret
    this.reveal = () => _secret
  }
}
```

### 方案对比

| 方案 | 真正私有 | 继承友好 | 调试友好 | 使用场景 |
| --- | --- | --- | --- | --- |
| `#` 字段 | ✅ 运行时保护 | ❌ 子类不能访问 | ⚠️ 调试器可看 | 现代项目，推荐优先使用 |
| `_` 约定 | ❌ 毫无保护 | ✅ 可访问 | ✅ 完全透明 | 老旧项目、第三方库（已不推荐） |
| WeakMap | ✅ 真正私有 | ❌ 需手动处理继承 | ❌ WeakMap 不易调试 | Polyfill / 库作者控制内部状态 |
| 闭包 | ✅ 作用域隔离 | ❌ 每个实例消耗内存 | ❌ 无法从外部访问 | 单体模式、反防篡改场景 |

### # 私有字段的关键规则

```js
class Example {
  #field = 1
  static #staticField = 2

  getField() { return this.#field }         // ✅ 类内访问
  static getStatic() { return Example.#staticField } // ✅ 静态方法内访问
}

new Example().#field  // ❌ SyntaxError: Private field
Example.#staticField  // ❌ SyntaxError
```

- 私有字段必须先在类体内声明（不能动态添加）。
- 私有方法同样遵循上述规则。
- 子类不能直接读取父类的 `#` 字段。但可通过父类暴露的 getter 间接访问。
- `#` 字段支持 `in` 检查：`#field in obj` 返回 `true/false`，用于特征检测。

## 实战应用举例

### 示例 1：带私有关键业务字段

```js
class APIKey {
  #key
  constructor(key) { this.#key = key }

  get masked() {
    return this.#key.slice(-4).padStart(this.#key.length, '*')
  }

  verify(input) { return this.#key === input }

  static fromEnv(name) {
    return new APIKey(process.env[name])
  }
}
```

### 示例 2：私有计数器

```js
class Counter {
  #count = 0

  increment() { this.#count++ }
  decrement() { this.#count-- }
  get value() { return this.#count }
  reset() { this.#count = 0 }
}
```

## 使用场景说明和对比

| 场景 | 推荐方案 | 原因 |
| --- | --- | --- |
| 新项目、现代工程 | `#` 字段 | 真正私有，标准化 |
| 老旧项目代码风格 | `_` 约定 + lint 检查 | 避免大规模重构 |
| 库作者（防外部篡改） | `#` + WeakMap 降级 | 兼容旧环境 |
| 数据脱敏、令牌处理 | `#` | 防止意外泄露到序列化 |

## 易错点提示

- `#` 私有字段必须在类体内声明：`#field` 不声明直接赋值会 `SyntaxError`。
- 私有字段不参与 `JSON.stringify`、`Object.keys`、`for...in`——序列化时自动忽略。
- `#` 私有字段不支持 `delete` 操作符。
- 子类不能直接访问父类的 `#` 字段，但可以通过父类提供的 `getter` 间接访问。
- `_` 前缀没有任何运行时保护，只要有人故意访问就能拿到。

## 记忆要点总结

- ES2022 用 `#` 定义真正私有，类外访问直接报错。
- 旧方案三种：`_` 约定、WeakMap、闭包。
- `#` 不会被 JSON.stringify 等序列化，天然防泄漏。

## 延伸问题

1. `#` 私有字段和 TypeScript 的 `private` 关键字有什么区别？
2. 私有字段能被 `Proxy` 拦截到吗？
3. 私有字段的 `in` 运算符（`#field in obj`）有什么用途？
4. 为什么 `JSON.stringify` 会忽略 `#` 私有字段？

## 可能类似的问题及简要参考答案

**Q：`#` 和 TypeScript 的 `private` 有什么区别？**
A：`#` 是运行时强制保护，编译后依然存在；`private` 只在 TypeScript 编译期检查，编译后变成普通属性。

**Q：`#` 私有字段能被子类访问吗？**
A：不能。子类没有访问父类私有字段的权限。但可用父类 getter 间接访问。

**Q：`_` 前缀为什么不安全？**
A：它只是命名约定，没有任何运行时保护，`obj._secret` 就可以读取。

## 辅助记忆总结

记成一句话：`#` 是 JS 目前唯一的真正私有（ES2022），`_` 是君子协定，WeakMap 和闭包是 polyfill 思路。
