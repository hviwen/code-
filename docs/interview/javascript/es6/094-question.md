# 094. [中级] 类的实例方法和原型方法的区别

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

这个问题本质上是问"类体内定义的方法 vs constructor 内 `this.fn = function`"的区别。类体内定义的"原型方法"挂到 `ClassName.prototype` 上，所有实例共享同一个函数；constructor 内定义的"实例方法"每个实例创建独立的函数副本。

一句话答法：原型方法定义在 `prototype` 上，所有实例共享同一份；实例方法在 constructor 里用 `this.fn = function` 定义，每个实例独立内存。优先用原型方法，除非需要闭包捕获实例特定状态。

## 问题意图

1. 是否知道类体内定义的方法（原型方法）和 constructor 中 `this.fn = function`（实例方法）在存储位置上的区别。
2. 是否理解原型方法节省内存（共享）而实例方法更灵活（可创建闭包、this 绑定稳定）。
3. 是否能根据实际场景选择合适的方式。

## 考察范围

- 原型方法：类体内 `method() {}` → `ClassName.prototype.method`。
- 实例方法：constructor 内 `this.method = function() {}` → 实例自身属性。
- 内存差异：原型方法共享一个函数，实例方法 N 个实例 N 个副本。
- `this` 绑定差异：箭头函数实例方法 `this` 绑定稳定，原型方法取决于调用方式。
- 继承中的行为：原型方法被子类继承，实例方法不继承。
- `for...in` 遍历可见性：实例方法可枚举时可见，原型方法不可枚举。

## 技术错误纠正

- 题目前提"实例方法和原型方法的区别"——实际上 class 类体内定义的方法都是原型方法；在 constructor 中用 `this.method = function` 定义才是真正的"实例方法"。题目表述需要明确是指这两种定义方式。
- 原始代码中实例方法 `handleClick` 是箭头函数，`this` 绑定稳定但每个实例独有一份——这是使用场景的典型例子。

## 知识点系统梳理

### 定义方式对比

```js
class Example {
  constructor() {
    // 实例方法——每个实例独立副本
    this.instanceMethod = function() {
      return 'instance'
    }

    // 箭头函数实例方法——this 绑定更稳定
    this.arrowMethod = () => {
      return this
    }
  }

  // 原型方法——所有实例共享
  protoMethod() {
    return 'prototype'
  }
}

const a = new Example()
const b = new Example()

a.protoMethod === b.protoMethod   // true（共享）
a.instanceMethod === b.instanceMethod // false（独立）
a.arrowMethod === b.arrowMethod   // false（独立）
```

### 完整对比表

| 对比项 | 原型方法 | 实例方法 |
| --- | --- | --- |
| 定义位置 | 类体内 `method() {}` | constructor 内 `this.fn = function` |
| 存储位置 | `ClassName.prototype` | 实例自身 |
| 内存占用 | 1 份（共享） | N 份（每个实例一份） |
| `this` 绑定 | 取决于调用方式 | 箭头函数稳定绑定 |
| 继承 | 子类继承 | 不继承 |
| 重写 | 子类重写原型方法 | 在构造函数中重写 |
| `for...in` | 不可枚举 | 可枚举（默认） |

### 何时用实例方法

```js
class EventEmitter {
  constructor(target) {
    this.target = target

    // 必须用实例方法：需要稳定的 this 绑定做事件监听器
    this.handleClick = (e) => {
      console.log('clicked', this.target.id) // this 始终指向实例
    }

    target.addEventListener('click', this.handleClick)
  }

  destroy() {
    this.target.removeEventListener('click', this.handleClick)
    // ✅ 因为 handleClick 是同一个引用，可以移除
  }

  // 原型方法适合通用逻辑
  emit(event, data) {
    console.log(event, data)
  }
}
```

## 实战应用举例

### 示例 1：计数器——原型方法就够了

```js
class Counter {
  constructor(init = 0) {
    this.count = init
  }
  // 原型方法即可——不需要闭包
  increment() { this.count++ }
  decrement() { this.count-- }
  get value() { return this.count }
}
```

### 示例 2：需要闭包捕获状态

```js
class Logger {
  constructor(prefix) {
    // 实例方法：闭包捕获 prefix，每次调用不需要传参
    this.log = (msg) => console.log(`[${prefix}] ${msg}`)
  }
}

const dbLogger = new Logger('DB')
const httpLogger = new Logger('HTTP')
dbLogger.log('connected')   // [DB] connected
httpLogger.log('request')   // [HTTP] request
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 通用业务逻辑 | 原型方法 | 节省内存，继承友好 |
| 事件监听回调 | 实例箭头函数 | 稳定的 `this` 绑定 |
| 需要闭包捕获状态 | 实例方法 | 每个实例独立隔离 |
| 热水路径（大量实例，如粒子系统） | 原型方法 | 避免内存爆炸 |
| 子类需要重写 | 原型方法 | 可被子类 override |

## 易错点提示

- 原型方法中的 `this` 取决于调用方式：`obj.method()` 指向实例，`const fn = obj.method; fn()` 指向 `undefined`（严格模式）。
- 实例方法的箭头函数 `this` 始终指向实例，但不能用 `new` 调用，也不能用作 generator。
- 实例方法在 `for...in` 中可见，原型方法不可见（class 方法默认 `enumerable: false`）。
- 子类继承的只有原型方法，实例方法不继承。

## 记忆要点总结

- 原型方法：`prototype` 上存一份，所有实例共享。
- 实例方法：`this.fn` 存在实例上，每个实例一份。
- 选型：通用逻辑用原型，闭包/绑定用实例。
- 内存：原型方法 O(1)，实例方法 O(N)。

## 延伸问题

1. 原型方法和实例方法在 `this` 绑定上有什么不同？
2. 为什么 class 的原型方法默认不可枚举？这对 `for...in` 有什么好处？
3. 原型方法在子类继承中如何被覆写？

## 可能类似的问题及简要参考答案

**Q：原型方法会被实例的 `hasOwnProperty` 检查到吗？**
A：不会。原型方法在 `prototype` 上，不是实例自有属性。`instance.hasOwnProperty('method')` → `false`。

**Q：为什么说原型方法更节省内存？**
A：N 个实例共享 1 个函数实例，而实例方法创建 N 个函数闭包。

**Q：什么时候必须用实例方法？**
A：需要稳定的 `this` 绑定（事件监听）或者闭包捕获实例级配置时。

## 辅助记忆总结

记成一句话：原型方法 prototype 上存 1 份大家用，实例方法 constructor 里每人 1 份自己用——省内存用原型，绑 this 用实例。
