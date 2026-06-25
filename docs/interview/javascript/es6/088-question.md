# 088. [中级] 如何实现类的继承？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

ES6 类继承的核心是 `extends` + `super`，底层仍然是原型链：子类的 `prototype.__proto__` 指向父类的 `prototype`。面试问"如何实现继承"是考察你是否能写出 `extends` 继承语法、理解 `super()` 调用链、方法重写和静态方法继承。

一句话答法：用 `extends` 继承父类，子类 constructor 中先调 `super()`，重写方法后用 `super.method()` 调用父类方法。

## 问题意图

1. 是否能正确写出 `class Child extends Parent` 并调用 `super()`。
2. 是否理解方法重写时如何保留父类功能。
3. 是否知道静态方法也可以被继承。

## 考察范围

- `extends` 关键字语法。
- `super()` 在 constructor 中的位置规则。
- 方法重写（override）和 `super.method()` 调用父类方法。
- 继承链：`Child.__proto__ === Parent`（静态继承），`Child.prototype.__proto__ === Parent.prototype`（实例继承）。
- 内置类继承（`class MyArray extends Array {}`）。
- 多级继承（孙子类）。
- `new.target` 在继承中的行为。

## 技术错误纠正

- "`super()` 不是必须的吗？" 只在子类显式写了 constructor 时才必须。如果不写 constructor 会自动合成包含 `super()` 的构造函数。
- `this.hobies` 拼写错误 → `this.hobbies`。

## 知识点系统梳理

### 基本继承语法

```js
class Animal {
  constructor(name) { this.name = name }
  move() { return `${this.name} moves` }
  static getType() { return 'Animal' }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name) // 必须调用
    this.breed = breed
  }

  // 重写父类方法
  move() {
    return `${this.name} runs`
  }

  // 调用父类方法
  speak() {
    return super.move() // 'Buddy moves'
  }
}
```

### 继承的两条链

```js
// 实例链（方法/属性继承）
Dog.prototype.__proto__ === Animal.prototype // true
const d = new Dog('Buddy', 'Husky')
d instanceof Animal // true

// 类链（静态成员继承）
Dog.__proto__ === Animal // true
Dog.getType() // 'Animal'
```

### 方法重写的三种模式

| 模式 | 写法 | 适用场景 |
| --- | --- | --- |
| 完全覆盖 | `method() { /* 全新实现 */ }` | 子类行为完全不同 |
| 增强父类 | `method() { super.method(); /* 额外 */ }` | 保留父类逻辑，增加子类逻辑 |
| 条件委托 | `method() { if (cond) super.method(); else /* 自己处理 */ }` | 按条件决定是否走父类 |

## 实战应用举例

### 示例 1：标准继承 + 方法增强

```js
class Component {
  constructor(el) { this.el = el }
  render() { this.el.innerHTML = '' }
}

class ListComponent extends Component {
  constructor(el, items) {
    super(el)
    this.items = items
  }

  render() {
    super.render() // 清空
    this.items.forEach(item => {
      const div = document.createElement('div')
      div.textContent = item
      this.el.appendChild(div)
    })
  }
}
```

### 示例 2：内置类继承

```js
class Stack extends Array {
  push(...items) {
    console.log(`push: ${items}`)
    return super.push(...items)
  }

  pop() {
    if (this.length === 0) throw new Error('empty stack')
    return super.pop()
  }

  peek() { return this[this.length - 1] }
}
```

## 使用场景说明和对比

| 方案 | 适用场景 | 优点 | 缺点 |
| --- | --- | --- | --- |
| `extends` 继承 | 明确的 is-a 关系 | 语法清晰，完整继承原型和静态 | 耦合强，层级深难维护 |
| Mixin / 组合 | 需要共享多个能力 | 灵活，避免钻石问题 | 需要手动组合 |
| 接口/鸭子类型 | 只有行为约定 | 最松耦合 | JS 无原生接口 |
| 委托（`setPrototypeOf`） | 动态改变行为 | 运行时灵活 | 性能差，不直观 |

## 易错点提示

- 子类 constructor 中必须先 `super()` 再访问 `this`，否则 `ReferenceError`。
- 如果子类不写 constructor，引擎自动添加 `constructor(...args) { super(...args) }`，不能和显式 constructor 同时存在。
- 静态方法也是继承的，但受原型链限制，`super` 在静态方法中指向父类构造函数。
- 多层继承时 `super` 始终指向直接父类的 prototype，不是祖父类。
- 内置类（Array、Error）继承需要使用 `extends`，且 constructor 中必须 `super()` 传参。

## 记忆要点总结

- 两条链：`Child.__proto__`（静态）→ `Parent`；`Child.prototype.__proto__`（实例）→ `Parent.prototype`。
- super 的三职责：`super()` 调父构造、`super.method()` 调父方法、`super.staticMethod()` 调父静态。
- 重写三模式：完全覆盖、增强父类、条件委托。

## 延伸问题

1. `class Child extends Parent` 在底层创建了哪几条原型链？
2. `super` 关键字在静态方法和实例方法中的 `this` 指向分别是什么？
3. 什么情况下不适合用 class 继承而该用组合？
4. 内置类（Array、Error）继承后，返回的实例类型是否正确？为什么？

## 可能类似的问题及简要参考答案

**Q：`extends` 和 ES5 的原型继承有什么关系？**
A：`extends` 自动完成两件事：`Child.prototype.__proto__ = Parent.prototype` 和 `Child.__proto__ = Parent`。

**Q：子类方法重写后还能调用父类方法吗？**
A：能。用 `super.methodName()` 直接调用父类原型上的方法。

**Q：静态方法也能继承吗？**
A：能。`class Child extends Parent {}` 后 `Child.staticMethod()` 可用，通过 `Child.__proto__` 链访问。

## 辅助记忆总结

记成一句话：`extends` 建两条链，`super` 调父层面——构造用 `super()`，方法用 `super.method()`，静态用 `super.staticMethod()`。
