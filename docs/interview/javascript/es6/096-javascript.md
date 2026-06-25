# 096. [中级] 抽象类在 JavaScript 中如何模拟？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

JavaScript 没有 `abstract` 关键字（TypeScript 有），但可以用运行时检查来强制约束——构造函数中拦截 `new`，抽象方法中抛 Error。面试问这个是在考察你是否理解抽象类"定义接口契约、强制子类实现"的设计意图，以及如何用 JS 的特性来模拟。

一句话答法：构造函数中检查 `this.constructor === AbstractClass` 阻止直接实例化，抽象方法体抛 `new Error('must implement')` 强制子类实现。

## 问题意图

1. 是否理解抽象类的核心契约：不能实例化 + 定义必须由子类实现的方法。
2. 是否能写出至少两种模拟方式（constructor 检查 + 方法抛错，或者用 Symbol/静态检查）。
3. 是否知道 TypeScript 的 `abstract` 关键字和 JS 模拟的根本区别（编译期 vs 运行时）。

## 考察范围

- 抽象类的定义：不能直接实例化，包含抽象方法。
- constructor 中 `new.target` 或 `this.constructor` 检查阻止实例化。
- 抽象方法中 `throw new Error('must implement')` 强制子类实现。
- 模板方法模式：抽象类定义算法骨架，子类实现具体步骤。
- Symbol 标记抽象类的更严格方案。
- 与 TypeScript `abstract` 关键字的对比。

## 技术错误纠正

- 原始代码 `this.constructor === Shape` 检查有效但不能检测子类实例——这是正确的行为（子类实例应可通过）。
- `getArea()` 直接抛 `Error` 只有在调用时才会报错，实例化时不会检查——这是 JS 模拟的局限，和 TypeScript 不同。

## 知识点系统梳理

### 基本模拟模式

```js
// 方式 1：构造函数检查 + 方法抛错（最常见）
class AbstractDatabase {
  constructor() {
    if (this.constructor === AbstractDatabase) {
      throw new Error('Abstract class cannot be instantiated')
    }
  }

  // 抽象方法——子类必须实现
  connect() { throw new Error('connect() must be implemented') }
  query(sql) { throw new Error('query() must be implemented') }
}

class MySQL extends AbstractDatabase {
  connect() { console.log('MySQL connected') }
  query(sql) { console.log(`Query: ${sql}`) }
}
```

### new.target 检查（更可靠）

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('Shape is abstract')
    }
  }
}
```

`new.target` 比 `this.constructor` 更好——它始终指向直接调用的构造函数，不会被子类覆盖。

### 抽象方法 + 模板方法模式

```js
class DataExporter {
  constructor() {
    if (new.target === DataExporter) throw new Error('abstract')
  }

  // 抽象方法
  parse() { throw new Error('implement parse()') }
  format(data) { throw new Error('implement format()') }

  // 模板方法——定义流程骨架
  export(rawData) {
    const parsed = this.parse(rawData)
    const formatted = this.format(parsed)
    return formatted
  }
}
```

### 方案对比

| 方案 | 阻止实例化 | 强制方法实现 | 运行时 vs 编译时 |
| --- | --- | --- | --- |
| constructor + `this.constructor` 检查 | ✅ | ❌（调用时才报错） | 运行时 |
| `new.target` 检查 | ✅（更准确） | ❌ | 运行时 |
| `new.target` + 方法抛错 | ✅ | ✅（调用时报错） | 运行时 |
| Symbol 标记 + 静态检查 | ✅ | ✅（实例化时检查） | 运行时 |
| TypeScript `abstract` | ✅ | ✅ **实例化时编译报错** | **编译时** |

## 实战应用举例

### 示例 1：数据库适配器

```js
class Database {
  constructor() {
    if (new.target === Database) throw new Error('abstract')
    this.connected = false
  }

  connect() { throw new Error('implement connect()') }
  disconnect() { throw new Error('implement disconnect()') }
  query(sql) { throw new Error('implement query()') }
}

class Postgres extends Database {
  connect() { this.connected = true; console.log('Postgres connected') }
  disconnect() { this.connected = false }
  query(sql) { return `Postgres result: ${sql}` }
}
```

### 示例 2：模板方法——报表生成器

```js
class ReportGenerator {
  constructor() {
    if (new.target === ReportGenerator) throw new Error('abstract')
  }

  // 抽象方法
  fetchData() { throw new Error('implement fetchData()') }
  transform(data) { throw new Error('implement transform()') }
  render(data) { throw new Error('implement render()') }

  // 模板方法——生成流程固定
  generate() {
    const raw = this.fetchData()
    const data = this.transform(raw)
    return this.render(data)
  }
}
```

## 使用场景说明和对比

| 场景 | 是否适合 JS 抽象类模拟 | 原因 |
| --- | --- | --- |
| 团队内部规范基类 | 适合 | 运行时提示，约定即可 |
| 开源库接口设计 | 不太适合 | TS 或接口文档更好 |
| 需要编译期检查 | 不适合 | JS 无法做到，改用 TypeScript |

vs 其他方案：

| 方案 | 约束时机 | 严格程度 |
| --- | --- | --- |
| JS 抽象类模拟 | 运行时 | 调用抽象方法时才报错 |
| TypeScript abstract | 编译时 | 实例化时即报错 |
| 接口文档约定 | 人工 | 无强制 |
| `instanceof` 检查 | 运行时 | 鸭子类型可用 |

## 易错点提示

- constructor 中 `this.constructor === AbstractClass` 检查会被子类继承——子类实例化时 `this.constructor` 是子类，检查通过。但 `new.target` 更准确。
- 抽象方法只有在被调用时才报错，实例化不检查。如果子类没实现也没人调用，程序不会报错。
- 一个常见误区："JS 没有抽象类"→ 严格说 JS 没有语言级别的 `abstract`，但可以用模式模拟，只是约束时机不同。
- 抽象类不等于接口——抽象类可以包含实现好的方法，接口只定义形状。

## 记忆要点总结

- 阻止实例化：`new.target === AbstractClass` 检查。
- 强制实现：抽象方法抛 `new Error('implement ...')`。
- 模板方法：抽象类骨架 + 子类具体实现。
- 局限：运行时报错，不是编译时。

## 延伸问题

1. `new.target` 和 `this.constructor` 在抽象类检查中有什么不同？
2. 抽象类模拟能否在实例化时检查子类是否实现了所有抽象方法？如何实现？
3. TypeScript 的 `abstract` 关键字和 JS 模拟在行为上有什么区别？

## 可能类似的问题及简要参考答案

**Q：JavaScript 有抽象类吗？**
A：语言层面没有 `abstract` 关键字。但可以用 constructor 检查 + 抽象方法抛错模拟。

**Q：抽象类和接口的区别是什么？**
A：抽象类可包含已实现的方法和状态，接口只定义形状。JS 两个都需要模拟。

**Q：为什么要用抽象类而不是直接用普通类加文档约定？**
A：抽象类在运行时提供保护——不小心实例化或忘记实现方法时会立即报错。

## 辅助记忆总结

记成一句话：JS 没有 `abstract` 关键字，但用 `new.target` 检查 + 方法 `throw` 可以模拟——告诉用法但管不了编译时。
