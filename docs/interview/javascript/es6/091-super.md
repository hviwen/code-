# 091. [高级] super 关键字的作用和用法

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

`super` 不是"父类引用"，而是一个指向父类原型或父类构造函数的 **绑定**。面试问 `super` 是在考察你是否理解它在构造函数、实例方法、静态方法三个上下文中的不同含义，以及它的底层机制——`[[HomeObject]]` 内部槽。

一句话答法：`super` 在 constructor 中调用父类构造函数（`super()`），在实例方法中指代父类原型（`super.method()`），在静态方法中指代父类构造函数（`super.staticMethod()`）。

## 问题意图

1. 是否知道 `super()` 在子类 constructor 中必须调用且必须在 `this` 之前。
2. 是否理解 `super.method()` 的查找链——父类 prototype，不是父类实例。
3. 是否知道 `super` 在静态方法中同样可用，指向父类构造函数。
4. 是否了解 `super` 的底层依赖：`[[HomeObject]]` + `[[Prototype]]` 动态查找。

## 考察范围

- `super()` 作为函数调用——只在构造器中有效。
- `super.method()` 作为方法调用——原型链查找。
- `super.staticMethod()`——父类构造函数上的静态方法。
- `super` 的底层机制：`[[HomeObject]]` 内部槽。
- `super` 不能在箭头函数中使用（箭头函数没有 `[[HomeObject]]`）。
- `super` 在对象字面量方法中的使用（ES2015 开始支持）。
- `super` 不能赋值为变量，也不能作为函数参数传递。

## 技术错误纠正

- "实现父属性的超类"——表述不准确，`super` 是访问父类属性/方法，不是"实现父类的超类"。
- `super()` 在子类 constructor 中不是可选的，是强制的——如果写了 constructor 就必须调用。

## 知识点系统梳理

### 三种上下文中的 super

```js
class Parent {
  constructor(name) { this.name = name }
  greet() { return `Hi, ${this.name}` }
  static identify() { return 'Parent' }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)                  // 1. 调用父类构造函数
    this.age = age
  }

  greet() {
    return `${super.greet()}, age ${this.age}`  // 2. 调用父类原型方法
  }

  static identify() {
    return `${super.identify()} -> Child`        // 3. 调用父类静态方法
  }
}
```

### super 的三种角色

| 上下文 | 写法 | 指向 | 用途 |
| --- | --- | --- | --- |
| constructor | `super()` | 父类构造函数 | 初始化 `this` 绑定 |
| 实例方法 | `super.method()` | `Parent.prototype` | 调用父类原型方法 |
| 静态方法 | `super.staticMethod()` | `Parent`（构造函数） | 调用父类静态方法 |

### super 的底层机制

`super` 的实现依赖两个机制：

1. **`[[HomeObject]]`**：每个方法在定义时有一个内部 `[[HomeObject]]` 槽，指向该方法所属的对象。`super` 通过它找到"父对象"。
2. **原型链查找**：`super.method()` 等价于 `Object.getPrototypeOf([[HomeObject]])` 然后再取属性。

```js
// 近似理解：super.method() 的行为
const proto = Object.getPrototypeOf(method.[[HomeObject]])
proto.method.call(this, ...args)
```

这也是为什么箭头函数里不能使用 `super`——箭头函数没有自己的 `[[HomeObject]]`。

### 对象字面量中的 super

```js
const parent = {
  greet() { return 'Hello' }
}

const child = {
  __proto__: parent,
  greet() {
    return `${super.greet()} World`
  }
}

child.greet() // 'Hello World'
```

## 实战应用举例

### 示例 1：方法增强（重写 + 复用）

```js
class BaseModel {
  constructor(data) {
    Object.assign(this, data)
  }

  toJSON() {
    return { ...this }
  }

  validate() { return true }
}

class UserModel extends BaseModel {
  constructor(data) {
    super(data)
    this.role = data.role || 'user'
  }

  validate() {
    if (!super.validate()) return false
    if (!this.email) throw new Error('email required')
    return true
  }
}
```

### 示例 2：静态方法的多层继承

```js
class API {
  static version = '1.0'
  static getVersion() { return this.version }
}

class V2API extends API {
  static version = '2.0'
  static getVersion() {
    return `${super.getVersion()} (upgrade available: ${API.version} → ${this.version})`
  }
}
```

## 使用场景说明和对比

| 场景 | super 用法 | 替代方案 |
| --- | --- | --- |
| 子类 constructor 初始化 | `super(params)` | 无替代，必须使用 |
| 增强父类方法 | `super.method()` + 额外逻辑 | 无替代，核心模式 |
| 调用父类静态方法 | `super.staticMethod()` | `ParentClass.staticMethod()`（硬编码） |
| 对象字面量中委托 | `super.method()` | `Reflect.get(proto, ...)` |

## 易错点提示

- 子类 constructor 中 `super()` 必须在访问 `this` 之前调用，否则 `ReferenceError`。
- `super` 不能赋给变量：`const x = super` 是语法错误。
- 箭头函数中无法使用 `super`（箭头函数没有 `[[HomeObject]]`）。
- `super()` 只能在子类 constructor 中调用一次，重复调用报错。
- `super.method()` 的 `this` 绑定仍然是当前实例（`this`），不是父类实例。
- 多层继承中 `super` 查找的是直接父类的 prototype，不是祖父类。

## 记忆要点总结

- constructor 中用 `super()` 调父构造，必须且在使用 `this` 之前。
- 实例方法用 `super.method()` 调父原型方法。
- 静态方法用 `super.staticMethod()` 调父构造函数方法。
- 底层靠 `[[HomeObject]]` 确定"父对象"是谁。
- 箭头函数不能用 `super`。

## 延伸问题

1. `super()` 为什么必须在 `this` 之前调用？它和 `this` 初始化的关系是什么？
2. 为什么 `super` 在箭头函数中不可用？
3. `super` 在对象字面量中和在 class 中的行为完全一致吗？
4. 多级继承（A → B → C）中，C 的实例方法中 `super.method()` 查找的是哪个 prototype？

## 可能类似的问题及简要参考答案

**Q：`super()` 调用父类构造和 `Parent.constructor.call(this)` 等价吗？**
A：不完全等价。`super()` 还会处理 `[[ConstructorKind]]: derived` 语义，`call` 不能复现类继承的所有行为。

**Q：`super` 为什么不能在箭头函数中使用？**
A：箭头函数没有自己的 `[[HomeObject]]`，无法确定从哪个对象开始查找父级方法。

**Q：`super.method()` 中的 `this` 指向谁？**
A：指向当前实例（`this`），不是父类实例。父类方法中的 `this` 仍然是子类实例。

## 辅助记忆总结

记成一句话：`super` 是"父类环境引用"—构造用 `super()`，原型用 `super.method()`，静态用 `super.staticMethod()`，箭头函数里没有它。
