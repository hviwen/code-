# 089. [中级] 类中的静态方法如何定义和使用？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

静态方法定义在类构造函数本身上，而不是实例原型上。它不能被实例调用，用于工具函数、工厂方法和类级别的操作。面试问这个题是考察你是否能区分静态和实例成员、理解 `this` 在静态方法中的指向、以及知道静态方法的继承规则。

一句话答法：用 `static` 关键字定义，通过 `ClassName.method()` 调用，`this` 指向类构造函数本身，可被子类继承。

## 问题意图

1. 是否能正确写出 `static` 方法并知道调用方式（类名调用，不是实例调用）。
2. 是否理解静态方法中 `this` 的指向（类本身）。
3. 是否知道静态方法可以被继承以及和实例方法的本质差异。

## 考察范围

- `static` 关键字语法。
- 静态方法的调用方式：`MyClass.method()`，不是 `instance.method()`。
- 静态方法中 `this` 指向的运行时值（类本身）。
- 静态属性的定义（`static count = 0`）。
- 静态方法的继承（子类通过 `__proto__` 链继承）。
- 静态方法中调用其他静态方法：`this.otherMethod()` 或 `ClassName.otherMethod()`。
- 静态工厂方法模式。

## 技术错误纠正

- 原始代码中静态方法内 `return this.name` 的 `this` 指向类本身（`Dog`），不是实例。如果类没有 `name` 属性会返回 `undefined`。
- 静态方法内不能通过 `this.xxx` 访问实例属性，因为 `this` 指向类，不是实例。

## 知识点系统梳理

### 基本语法

```js
class MathUtils {
  static add(a, b) { return a + b }
  static PI = 3.14159 // 静态属性（ES2022）
}

MathUtils.add(1, 2) // 3
```

### 静态方法 vs 实例方法

| 对比项 | 实例方法 | 静态方法 |
| --- | --- | --- |
| 定义位置 | `ClassName.prototype` | `ClassName` 本身 |
| 关键字 | 无 | `static` |
| 调用者 | 实例 | 类 |
| `this` 指向 | 实例 | 类（构造函数） |
| 继承方式 | `Child.prototype.__proto__` | `Child.__proto__` |
| 典型用途 | 行为逻辑 | 工具函数、工厂方法、配置 |

### 静态方法中的 this

```js
class Config {
  static getDefaults() { return { theme: 'light' } }
  static merge(userConfig) {
    // this 指向 Config 本身（子类调用时指向子类）
    return { ...this.getDefaults(), ...userConfig }
  }
}

class AppConfig extends Config {}
AppConfig.merge({ theme: 'dark' }) // this → AppConfig
```

## 实战应用举例

### 示例 1：工厂方法

```js
class User {
  constructor(name, role) {
    this.name = name
    this.role = role
  }

  static createAdmin(name) {
    return new User(name, 'admin')
  }

  static createGuest() {
    return new User('Guest', 'guest')
  }
}

const admin = User.createAdmin('Alice')
```

### 示例 2：工具方法

```js
class Validator {
  static email(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) }
  static required(val) { return val !== undefined && val !== null && val !== '' }
  static minLen(val, n) { return String(val).length >= n }
}
```

## 使用场景说明和对比

| 场景 | 是否适合 static | 原因 |
| --- | --- | --- |
| 工厂方法（`User.createAdmin()`） | 适合 | 封装实例创建逻辑 |
| 工具函数（验证、格式化） | 适合 | 不依赖实例状态 |
| 类级配置/常量 | 适合 | 通过类名访问，全局唯一 |
| 需要访问实例数据 | 不适合 | 静态方法没有 `this.xxx` 指向实例 |
| 需要多态（子类不同行为） | 不推荐 | 被子类重写后可替代，但不如实例方法灵活 |

## 易错点提示

- 静态方法只能通过类名调用：`user.createAdmin()` 会报 `TypeError`（实例上没有静态方法）。
- 静态方法中的 `this` 在子类调用时指向子类，不是父类——可利用这点实现多态，但也容易误解。
- 静态方法不能使用 `super()`（那是 constructor 中的语法），但可以用 `super.staticMethod()` 调用父类静态方法。
- 静态属性 `static count = 0` 是 ES2022 语法。旧环境用 `ClassName.count = 0`。

## 记忆要点总结

- `static` 方法挂类上，不挂原型上，实例调不了。
- `this` 指向类本身（子类调用时指向子类）。
- 三用途：工厂方法、工具函数、类级配置。

## 延伸问题

1. 静态方法和实例方法在原型链上的位置有什么不同？
2. 子类如何重写父类的静态方法？
3. `static` 块（`static {}`）的用途是什么？

## 可能类似的问题及简要参考答案

**Q：静态方法能被实例调用吗？**
A：不能。实例上不存在静态方法，`instance.method()` 会 `TypeError`。

**Q：静态方法中的 `this` 指向什么？**
A：指向类本身。`User.staticMethod()` 中的 `this` 是 `User`；`Child.staticMethod()` 中的 `this` 是 `Child`。

**Q：静态方法有什么实际用途？**
A：工厂方法（`createAdmin`）、工具函数（`Validator.email`）、类级别统计（`User.count`）、单例管理。

## 辅助记忆总结

记成一句话：`static` 方法挂类上不挂实例上——`this` 指向类，子类能继承，适合工厂和工具。
