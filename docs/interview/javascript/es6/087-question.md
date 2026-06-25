# 087. [中级] 类的构造函数如何定义？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

构造函数的本质是"实例初始化器"。面试问"如何定义"不是问语法（`constructor` 关键字），而是考察你是否知道参数接收、默认值设置、属性初始化、验证逻辑和 `super()` 调用规则。

一句话答法：在类体内用 `constructor` 关键字定义，接收实例化参数、初始化实例属性、调用父类构造函数（`super()`），一个类只能有一个构造函数。

## 问题意图

1. 是否能写出 `constructor` 的标准写法并处理参数默认值。
2. 是否知道 `super()` 必须在子类 constructor 中且在使用 `this` 之前调用。
3. 是否理解 constructor 不是必须的，以及缺省时的默认行为。

## 考察范围

- `constructor` 关键字语法和唯一性约束。
- 参数接收与默认值（`constructor(name, age = 18)`）。
- `super()` 在继承中的调用时机和必要性。
- 缺省 constructor 时的隐式行为（空 `constructor()` 或 `constructor(...args) { super(...args) }`）。
- constructor 中 `this` 的可用性条件。
- constructor 返回值：默认返回 `this`，返回对象时覆盖。

## 技术错误纠正

- 原始代码 `this._password = null` 是约定式私有，不是真正私有。ES2022 用 `#password`。
- `constructor` 中调用 `this.init()` 是可行模式，但注意此时 `this` 已可用（因为 `super()` 已在合成代码中隐含调用）。

## 知识点系统梳理

### 基本语法

```js
class User {
  constructor(name, email, options = {}) {
    this.name = name
    this.email = email
    this.role = options.role || 'user'
    this.createdAt = new Date()
  }
}
```

### constructor 在不同场景下的行为

| 场景 | 行为 |
| --- | --- |
| 基类，不写 constructor | 自动添加空 `constructor()` |
| 基类，写 constructor | 自定义初始化逻辑 |
| 子类，不写 constructor | 自动添加 `constructor(...args) { super(...args) }` |
| 子类，写 constructor | 必须手动调用 `super()` 且在使用 `this` 之前 |
| constructor 返回非对象 | 忽略，仍返回 `this` |
| constructor 返回对象 | 返回该对象而非 `this` |

### 参数处理三板斧

```js
class Product {
  constructor(name, price, options = {}) {
    // 1. 参数验证
    if (!name) throw new Error('name required')
    if (price < 0) throw new Error('price must be >= 0')

    // 2. 属性赋值
    this.name = name
    this.price = price

    // 3. 扩展配置（安全合并默认值）
    this.tags = options.tags ?? []
    this.visible = options.visible ?? true
  }
}
```

## 实战应用举例

### 示例 1：带验证的 constructor

```js
class Account {
  constructor(owner, initialBalance = 0) {
    if (!owner) throw new Error('owner required')
    if (initialBalance < 0) throw new Error('balance cannot be negative')

    this.owner = owner
    this.balance = initialBalance
    this.createdAt = new Date()
  }

  deposit(amount) {
    this.balance += amount
  }
}
```

### 示例 2：子类 constructor 必须调用 super

```js
class Animal {
  constructor(name) { this.name = name }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name) // 必须在使用 this 之前
    this.breed = breed
  }
}
```

## 使用场景说明和对比

| 场景 | 说明 | 推荐程度 |
| --- | --- | --- |
| 纯数据容器（DTO） | constructor 只做属性赋值 | 适合，但也可用工厂函数 |
| 需要验证逻辑 | constructor 中校验参数再赋值 | 适合 |
| 异步初始化 | constructor 不支持 async | 不适合，用静态工厂方法替代 |
| 继承链中构造 | super() 调用+子类属性 | 必须，无替代方案 |

异步初始化的替代方案：

```js
class DbConnection {
  static async create(config) {
    const conn = new DbConnection(config)
    await conn.connect()
    return conn
  }

  constructor(config) {
    this.config = config
    // 不做异步操作
  }

  async connect() {
    // 真实连接逻辑
  }
}
```

## 易错点提示

- 子类 constructor 中必须先调 `super()` 再使用 `this`，否则 `ReferenceError`。
- constructor 不支持 `async`，无法 `await`。异步初始化用静态工厂方法。
- constructor 中不要做 setTimeout、事件监听等副作用（创建和初始化应该分离）。
- constructor 返回值默认是 `this`；如果返回原始类型会被忽略，返回对象会替代 `this`。

## 记忆要点总结

- constructor 是实例初始化入口，一个类只有一个。
- 子类必须 `super()` 且在使用 `this` 之前。
- 三件事：参数接收 → 参数验证 → 属性赋值。

## 延伸问题

1. 子类不写 constructor 时引擎会自动添加什么？
2. constructor 为什么不能是 async 函数？异步初始化如何实现？
3. constructor 返回一个不同的对象会有什么后果？

## 可能类似的问题及简要参考答案

**Q：constructor 可以不写吗？**
A：可以。基类缺省得到空 `constructor()`，子类缺省得到 `constructor(...args) { super(...args) }`。

**Q：子类 constructor 为什么必须调用 `super()`？**
A：因为 `this` 的初始化由父类构造函数完成，不调 `super()` 就无法创建 `this` 绑定。

**Q：constructor 可以返回值吗？**
A：可以 return 一个对象，这个对象会替代 `new` 表达式的返回值。return 原始类型无效。

## 辅助记忆总结

记成一句话：constructor 就是 `new` 时自动执行的初始化函数，子类必须先 `super()` 才能碰 `this`。
