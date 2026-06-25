# 092. [中级] 类表达式和类声明的区别

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

类表达式和类声明是定义 class 的两种语法形式，区别类似于函数声明 vs 函数表达式。面试问这道题是考察你是否理解类提升行为、作用域绑定、命名规则以及类表达式在动态场景（条件创建、混入、高阶函数）中的灵活性。

一句话答法：类声明是 `class Name {}`，有块级绑定但不提升；类表达式是 `const C = class {}`，可命名可匿名、可在运行时动态创建和传递。

## 问题意图

1. 是否能说出类声明和类表达式在**提升**行为上的共同点（都不提升）。
2. 是否理解类表达式可用于动态创建类（工厂函数、高阶组件、混入）。
3. 是否知道命名类表达式（`class Named {}`）中内部名称的作用域规则。

## 考察范围

- 类声明语法：`class Name { }`。
- 类表达式语法：匿名 `class { }` 和命名 `class Name { }`。
- 提升行为：两者都不提升（存在 TDZ）。
- 命名类表达式中的内部名称作用域（只在类体内可见）。
- 类表达式的动态创建能力：工厂函数、条件创建、混入、高阶组件。
- 块级作用域中的类声明（ES6 spec）。

## 技术错误纠正

- "类声明不提升，类表达式也不提升"——这是对的，但要注意：如果类声明写在块级作用域中，它在外部不可见。
- 命名类表达式和函数表达式类似，内部名称在外部不可访问，用于类内部自引用。

## 知识点系统梳理

### 基本语法对比

```js
// 类声明
class User {
  constructor(name) { this.name = name }
}

// 匿名类表达式
const User = class {
  constructor(name) { this.name = name }
}

// 命名类表达式
const User = class NamedUser {
  constructor(name) { this.name = name }
  getClassName() { return NamedUser.name } // 类体内可用
}

// 外部不可访问 NamedUser
// console.log(NamedUser) // ReferenceError
```

### 类声明 vs 类表达式完整对比

| 对比项 | 类声明 | 类表达式 |
| --- | --- | --- |
| 语法 | `class Name {}` | `const C = class {}` 或 `class Name {}` 作为值 |
| 提升（hoisting） | 不提升（TDZ） | 不提升（取决于变量声明） |
| 是否必须命名 | 必须命名 | 可匿名也可命名 |
| 内部名称作用域 | 整个作用域 | 命名时只在类体内可见 |
| 动态创建 | 不能 | 可以在函数内、条件中创建 |
| 类体内自引用 | 通过 `ClassName` | 命名表达式通过内部名称，匿名通过无 |
| 再次赋值 | 类名是绑定，不能重新赋值 | 变量可重新赋值 |
| 使用场景 | 静态定义，模块顶层 | 工厂、混入、HOC、条件创建 |

### 类表达式动态创建的三模式

```js
// 1. 工厂函数
function createClass(type) {
  if (type === 'admin') {
    return class { hasAccess() { return true } }
  }
  return class { hasAccess() { return false } }
}

// 2. 混入（Mixin）
const WithLogging = (Base) => class extends Base {
  log(...args) { console.log(`[${new Date().toISOString()}]`, ...args) }
}

// 3. 条件定义
const UserClass = isServer
  ? class { fetch() { /* server logic */ } }
  : class { fetch() { /* client logic */ } }
```

## 实战应用举例

### 示例 1：工厂模式创建不同类

```js
function makeUser(role) {
  return class {
    constructor(name) { this.name = name; this.role = role }
    getInfo() { return `${this.name} (${this.role})` }
  }
}

const Admin = makeUser('admin')
const admin = new Admin('Alice')
admin.getInfo() // 'Alice (admin)'
```

### 示例 2：混入增强

```js
const WithTimestamp = Base => class extends Base {
  constructor(...args) {
    super(...args)
    this.createdAt = new Date()
  }
}

const WithSerializable = Base => class extends Base {
  toJSON() { return { ...this } }
}

class User {}
const EnhancedUser = WithSerializable(WithTimestamp(User))

const u = new EnhancedUser()
u.toJSON() // { createdAt: '...' }
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 模块顶层定义 | 类声明 | 更直观，类名明确 |
| 动态 / 条件创建 | 类表达式 | 唯一选择 |
| 混入 / 高阶组件 | 类表达式 | 可接收基类参数返回新类 |
| 类体内需要自引用 | 命名类表达式 | 内部名称只在类体内可见 |
| IIFE 中定义类 | 类表达式 | 表达式可被立即执行 |

## 易错点提示

- 类声明和类表达式都不提升，不存在"类声明提升而类表达式不提升"的区别。
- 命名类表达式的名称只在类体内可访问，外部不可见。这和函数表达式一致。
- 类声明在块级作用域中（`if { class Foo {} }`）只在块内可见，外部 ReferenceError。
- 类表达式赋值给 `const` 后，变量名和类名（如果命名）是两回事。`const X = class Y {}`，`X` 和 `Y` 不同。

## 记忆要点总结

- 类声明 vs 类表达式 = 语法糖 vs 灵活值。
- 两者都不提升，都存在 TDZ。
- 类表达式三优势：工厂创建、混入增强、条件定义。
- 命名类表达式的内部名字只在类体内可见。

## 延伸问题

1. 类声明在块级作用域中的行为是什么？
2. 命名类表达式的内部名称可以在外部访问吗？
3. 类表达式在混入模式中为什么比类声明更合适？

## 可能类似的问题及简要参考答案

**Q：类声明和类表达式哪个会提升？**
A：两者都不提升。类声明存在暂时性死区（TDZ），必须在声明后才能使用。

**Q：什么时候用类表达式？**
A：需要动态创建类时：工厂函数按条件返回不同类、混入增强、高阶组件模式。

**Q：命名类表达式的名称有什么作用？**
A：在类体内可用作自引用（递归、获取 `name` 属性），外部不可访问。

## 辅助记忆总结

记成一句话：类声明是"这儿定义个类"，类表达式是"这里有个类的值"——表达式可传、可存、可动态创建，命名时内部名字类体外不可见。
