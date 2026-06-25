# 103. [中级] 内置 Symbol 有哪些？举例说明

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

内置 Symbol 是 JavaScript 语言预定义的"协议接口"。它们不属于某个具体 API，而是约定——如果对象实现了某个内置 Symbol 方法，JS 引擎会在对应操作中自动调用它。核心是让用户对象深度参与语言行为。

一句话答法：内置 Symbol 是 JS 预定义的 Symbol 常量，如 `Symbol.iterator`（可迭代）、`Symbol.toPrimitive`（类型转换）、`Symbol.toStringTag`（toString 标签）、`Symbol.hasInstance`（instanceof）、`Symbol.species`（衍生构造函数）。实现它们可以自定义对象在语言操作中的行为。

## 问题意图

1. 能否说出至少 4 个内置 Symbol 及各自用途。
2. 是否理解内置 Symbol 是"协议接口"——实现它就能影响语言行为。
3. 是否能在实际代码中通过实现内置 Symbol 来自定义对象行为。

## 考察范围

- `Symbol.iterator` — 可迭代协议，`for...of`、`[...x]`、解构的基础。
- `Symbol.toPrimitive` — 自定义对象转原始值时的行为（`+obj`、`\`${obj}\``）。
- `Symbol.toStringTag` — `Object.prototype.toString.call(obj)` 返回的标签。
- `Symbol.hasInstance` — 自定义 `instanceof` 的行为。
- `Symbol.species` — 控制衍生对象（如 `arr.map()` 返回的数组类型）的构造函数。
- `Symbol.isConcatSpreadable` — 控制 `concat` 时是否展开。
- `Symbol.match` / `Symbol.replace` / `Symbol.search` / `Symbol.split` — 自定义正则相关操作。
- `Symbol.unscopables` — 控制 `with` 语句中哪些属性被排除。

## 技术错误纠正

- "内置 Symbol 就是一些特殊的 Symbol 值"——更准确地说，它们是语言**协议接口**，实现后改变对象的行为。
- `Symbol.species` 不是用来"控制实例的继承对象"的，而是控制衍生对象（如 `map`、`filter` 返回值的类型）使用的构造函数。

## 知识点系统梳理

### 常用内置 Symbol 速查

```js
// Symbol.iterator — 可迭代
class Range { *[Symbol.iterator]() { for (let i = 0; i < 3; i++) yield i } }

// Symbol.toPrimitive — 类型转换
class Price {
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? '$10' : 10
  }
}

// Symbol.toStringTag — toString 标签
class MyClass { get [Symbol.toStringTag]() { return 'MyClass' } }
Object.prototype.toString.call(new MyClass()) // "[object MyClass]"

// Symbol.hasInstance — instanceof 自定义
class MyArr { static [Symbol.hasInstance](i) { return Array.isArray(i) } }
[] instanceof MyArr // true

// Symbol.species — 衍生类型控制
class MyArray extends Array {
  static get [Symbol.species]() { return Array }
}
const m = new MyArray(1,2,3)
m.map(x => x).constructor // Array（不是 MyArray）

// Symbol.isConcatSpreadable
const arr = [1, 2]; arr[Symbol.isConcatSpreadable] = false
[0].concat(arr) // [0, [1, 2]]
```

### 内置 Symbol 分类

| 类别 | Symbol | 触发操作 |
| --- | --- | --- |
| 迭代 | `Symbol.iterator` | `for...of`、`[...x]`、解构 |
| 类型转换 | `Symbol.toPrimitive` | `String(obj)`、`+obj`、`\`${obj}\`` |
| 类型信息 | `Symbol.toStringTag` | `Object.prototype.toString.call()` |
| 类型检查 | `Symbol.hasInstance` | `instanceof` |
| 构造函数 | `Symbol.species` | `map`、`filter`、`slice` 等衍生操作 |
| 数组 | `Symbol.isConcatSpreadable` | `Array.prototype.concat` |
| 正则 | `Symbol.match` / `Symbol.replace` / `Symbol.search` / `Symbol.split` | `String.prototype` 中的正则方法 |
| with | `Symbol.unscopables` | `with` 语句 |

## 实战应用举例

### 示例 1：自定义 toString 和类型转换

```js
class Product {
  constructor(name, price) { this.name = name; this.price = price }

  get [Symbol.toStringTag]() { return 'Product' }
  [Symbol.toPrimitive](hint) {
    return hint === 'number' ? this.price : `${this.name}: $${this.price}`
  }
}

const p = new Product('Widget', 29.99)
String(p)   // 'Widget: $29.99'
+p          // 29.99
```

### 示例 2：控制衍生类型

```js
class ReadOnlyArray extends Array {
  static get [Symbol.species]() { return Array }
  push() { throw new Error('read-only') }
}

const ro = new ReadOnlyArray(1, 2, 3)
const mapped = ro.map(x => x * 2)
mapped.push(4) // ✅ 正常，因为 mapped 是普通 Array
```

### 示例 3：自定义 instanceof

```js
class Duck {
  static [Symbol.hasInstance](obj) {
    return obj && typeof obj.quack === 'function'
  }
}

const something = { quack: () => 'quack' }
something instanceof Duck // true
```

## 使用场景说明和对比

| 内置 Symbol | 使用频率 | 说明 |
| --- | --- | --- |
| `Symbol.iterator` | 高频 | 自定义数据结构必备 |
| `Symbol.toStringTag` | 中频 | 提升调试体验 |
| `Symbol.toPrimitive` | 中频 | 自定义数值/字符串转换 |
| `Symbol.hasInstance` | 低频 | 自定义类型判断逻辑 |
| `Symbol.species` | 低频 | 库作者控制派生类型 |
| 其他 | 低频 | 特殊场景 |

## 易错点提示

- `Symbol.species` 是一个静态 getter，不能是实例方法：`static get [Symbol.species]() { return Array }`。
- `Symbol.hasInstance` 定义在类的静态方法上，不是实例方法。
- `Symbol.toStringTag` 是一个 getter（`get [Symbol.toStringTag]()`），不是普通属性。
- 不要用 `Symbol.for()` 覆盖内置 Symbol（如 `Symbol.for('iterator')` 不是 `Symbol.iterator`）。
- 内置 Symbol 在 `Object.keys()` 中不可见，但 `Object.getOwnPropertySymbols` 可列出。

## 记忆要点总结

- 内置 Symbol = 语言协议接口，实现即可参与语言行为。
- 高频三剑客：`Symbol.iterator`（可迭代）、`Symbol.toPrimitive`（类型转换）、`Symbol.toStringTag`（调试标签）。
- 中频：`Symbol.hasInstance`（instanceof）、`Symbol.species`（衍生类型）。
- 都是 `Symbol.xxx` 常量，不是 `Symbol.for('xxx')`。

## 延伸问题

1. `Symbol.species` 有什么实际应用场景？
2. `Symbol.toPrimitive` 和 `valueOf/toString` 的优先级关系是什么？
3. 如果同时定义了 `Symbol.toPrimitive` 和 `valueOf`，哪个优先？
4. `Symbol.unscopables` 在现代 JavaScript 中还有意义吗？

## 可能类似的问题及简要参考答案

**Q：最常用的内置 Symbol 是什么？**
A：`Symbol.iterator`，用于自定义可迭代对象，支持 `for...of`。

**Q：`Symbol.species` 控制什么？**
A：控制 `map`、`filter`、`slice` 等方法的返回值使用的构造函数。比如子类不希望返回子类实例时用。

**Q：`Symbol.toPrimitive` 和 `toString/valueOf` 的关系？**
A：`Symbol.toPrimitive` 优先级最高。定义了它，`toString/valueOf` 在类型转换时不会被调用。

## 辅助记忆总结

记成一句话：内置 Symbol 是 JS 的"协议接口"——实现 `Symbol.iterator` 就能被 for...of，实现 `Symbol.toPrimitive` 就能控制对象转原始值。
