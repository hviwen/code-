# 095. [高级] 类的继承如何实现方法重写？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

方法重写（override）是子类定义与父类同名方法，覆盖父类的行为。这是面向对象多态的核心实现。面试问这个是在考察你是否理解原型链查找机制、`super.method()` 调用父类方法、以及重写时常见的增强模式。

一句话答法：子类定义同名方法即覆盖父类方法，用 `super.method()` 保持父类逻辑；重写有三种模式：完全覆盖、增强父类、条件委托。

## 问题意图

1. 是否能正确写出子类重写父类方法的语法。
2. 是否理解 `super.method()` 在重写中的作用——保留父类逻辑而非完全替换。
3. 是否能讲出方法重写与原型链的关系：`Child.prototype.method` 覆盖 `Parent.prototype.method`。

## 考察范围

- 子类定义同名方法即可重写父类方法。
- `super.method()` 调用被覆盖的父类方法。
- 原型链机制：JS 运行时沿着 `[[Prototype]]` 链查找，子类原型方法先被发现。
- 完全覆盖 vs 增强父类 vs 条件委托三种模式。
- 多态：不同子类对同一方法有不同实现。
- 重写与 `this` 的绑定——父类方法中的 `this` 仍然指向子类实例。
- 多层继承链中的方法解析。

## 技术错误纠正

- 原始代码 `super.sayHello()` 在子类方法中调用但没有返回值——`super.method()` 的返回值通常需要显式使用。
- `new Child('xiaomin', ['alice', 'jone', 'mike'])` 中 age 参数缺失，且 friends 被当成了第二个参数 `age`——构造函数参数顺序不对。

## 知识点系统梳理

### 重写的基本机制

```js
class Parent {
  greet() { return 'Hello' }
}

class Child extends Parent {
  // 同名方法覆盖父类
  greet() {
    return `${super.greet()} World`  // 用 super 调用父类版本
  }
}

// 原型链机制：
// Child.prototype.greet 覆盖了 Parent.prototype.greet
// 但 Parent.prototype.greet 仍然可通过 super.greet() 访问
```

### 三种重写模式

```js
class Base {
  process(data) { return data }
}

// 1. 完全覆盖——父类逻辑不用了
class Override extends Base {
  process(data) { return data.toUpperCase() }
}

// 2. 增强父类——先父类逻辑，再加自己的
class Enhance extends Base {
  process(data) {
    const result = super.process(data)  // 父类处理
    return `[PROCESSED] ${result}`      // 自己加工
  }
}

// 3. 条件委托——按条件决定是否走父类
class Conditional extends Base {
  process(data) {
    if (typeof data !== 'string') {
      return super.process(data)  // 非字符串走父类
    }
    return data.trim()            // 字符串自己处理
  }
}
```

### 多态演示

```js
class Shape {
  area() { throw new Error('abstract') }
}

class Circle extends Shape {
  constructor(r) { super(); this.r = r }
  area() { return Math.PI * this.r * this.r }
}

class Rect extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h }
  area() { return this.w * this.h }
}

const shapes = [new Circle(5), new Rect(4, 6)]
shapes.forEach(s => console.log(s.area()))
// 78.54 ← Circle.area()
// 24    ← Rect.area()
```

### 重写 + super 的 this 指向

```js
class Parent {
  getThis() { return this }
}

class Child extends Parent {
  getThis() {
    return super.getThis()  // super 只是解析方式，this 仍是子类实例
  }
}

const c = new Child()
c.getThis() === c  // true
```

## 实战应用举例

### 示例 1：数据处理器增强

```js
class DataProcessor {
  validate(data) { return data != null }
  transform(data) { return data }
}

class UserProcessor extends DataProcessor {
  validate(data) {
    if (!super.validate(data)) return false
    return data.name && data.email
  }

  transform(data) {
    return { ...super.transform(data), name: data.name.trim() }
  }
}
```

### 示例 2：UI 组件生命周期

```js
class Component {
  render(container) { container.innerHTML = '' }
  destroy() { /* cleanup */ }
}

class ListComponent extends Component {
  render(container) {
    super.render(container)           // 清空容器
    container.appendChild(this.buildList())  // 渲染列表
  }

  buildList() {
    const ul = document.createElement('ul')
    return ul
  }
}
```

## 使用场景说明和对比

| 模式 | 适用场景 | 优点 |
| --- | --- | --- |
| 完全覆盖 | 子类行为与父类完全不同 | 语义清晰 |
| 增强父类 | 保留父类核心逻辑 + 扩展 | 代码复用，符合开闭原则 |
| 条件委托 | 部分情况走父类，部分自定义 | 灵活 |

vs 其他方案：

| 方案 | 说明 |
| --- | --- |
| 方法重写（override） | 继承体系内，子类覆盖父类 |
| 装饰器（wrapper） | 不修改原类，在外面包装一层 |
| Mixin | 从多个来源组合行为，非继承链覆盖 |

## 易错点提示

- 重写后父类方法完全不可访问，除非用 `super.method()` 显式调用。
- `super.method()` 的 `this` 仍然是子类实例，不是父类实例。
- 箭头函数不能用作重写方法（因为它不在 prototype 上）。
- 多层继承中 `super` 只查找直接父类的 prototype，不会跳过。
- 如果不确定是否需要保留父类行为，用"增强父类"模式最安全。

## 记忆要点总结

- 同名方法自动覆盖，`super.method()` 调用父类版本。
- 三种模式：完全覆盖、增强父类、条件委托。
- 重写 + `super` 是"保留父类逻辑 + 扩展"的标准化模式。
- 多态 = 不同子类各自实现同一方法签名。

## 延伸问题

1. 方法重写和原型链的关系是什么？
2. `super.method()` 中的 `this` 指向子类实例还是父类实例？
3. 如何在重写时部分保留父类逻辑？
4. 箭头函数可以作为重写的方法吗？为什么？

## 可能类似的问题及简要参考答案

**Q：重写父类方法后还能调用父类原来的方法吗？**
A：能。在子类方法中用 `super.methodName()` 显式调用父类原型上的方法。

**Q：方法重写和原型链有什么关系？**
A：JS 方法查找沿着 `[[Prototype]]` 链进行。子类原型上的方法比父类原型上的先被发现，所以子类方法"覆盖"了父类。

**Q：重写时 `super` 中的 `this` 指向谁？**
A：指向子类实例。`super` 只影响方法的查找位置，不影响 `this` 绑定。

## 辅助记忆总结

记成一句话：重写就是子类同名方法盖住父类的，`super.method()` 把被盖住的再拿出来用。
