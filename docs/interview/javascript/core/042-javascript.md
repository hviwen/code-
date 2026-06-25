# 042. [高级] 解释 JavaScript 中的继承机制

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

JavaScript 的继承核心是原型委托：对象访问属性时，如果自身没有，就沿原型链查找。class 和 extends 是建立在原型机制上的语法。

一句话答法：JavaScript 不是复制父类属性，而是通过原型链把属性查找委托给原型对象。

## 问题意图

这道题考察原型链、构造函数、class、`extends`、`super` 和组合优先思想。高级回答要能说明不同继承写法的优缺点。

## 考察范围

- 原型链继承。
- 构造函数继承。
- 组合继承和寄生组合继承。
- ES6 class/extends。
- `super`。
- 原型方法共享和实例属性隔离。
- 组合优于继承的工程取舍。

## 技术错误纠正

不要把 class 理解成和 Java/C++ 一样的类模型。JavaScript class 主要是构造函数和原型链的语法糖，同时增加了一些语法约束。

## 知识点系统梳理

原型委托：

```js
const animal = {
  speak() {
    return `${this.name} speaks`
  },
}

const dog = Object.create(animal)
dog.name = 'Lucky'

console.log(dog.speak()) // Lucky speaks
```

class 继承：

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  speak() {
    return `${this.name} speaks`
  }
}

class Dog extends Animal {
  speak() {
    return `${super.speak()} loudly`
  }
}
```

## 实战应用举例

### 示例 1：class 继承共享方法

```js
class View {
  constructor(el) {
    this.el = el
  }

  show() {
    this.el.hidden = false
  }
}

class Dialog extends View {
  close() {
    this.el.hidden = true
  }
}
```

这里 `Dialog` 实例既有自己的方法，也能通过原型链访问 `View.prototype.show`。

### 示例 2：组合替代继承

```js
function withLogger(target) {
  return {
    ...target,
    log(message) {
      console.log(`[${target.name}] ${message}`)
    },
  }
}
```

如果只是复用能力，不一定要建立父子关系。组合通常比深层继承更容易维护。

## 使用场景说明和对比

| 方式 | 优点 | 缺点 |
| --- | --- | --- |
| 原型链继承 | 方法共享，机制直接 | 引用属性容易共享，写法旧 |
| 构造函数继承 | 实例属性隔离 | 方法不能共享 |
| 组合继承 | 属性隔离 + 方法共享 | 旧写法较繁琐 |
| class extends | 语法清晰 | 仍要理解原型和 `super` |
| 组合 | 依赖关系更灵活 | 需要设计清晰接口 |

## 易错点提示

- 继承不是复制，而是委托查找。
- 原型上的引用类型属性会被实例共享，容易出错。
- 子类构造函数中必须先 `super()` 才能用 `this`。
- class 方法默认不可枚举。
- 不要为了复用一两个方法建立很深的继承层级。

## 记忆要点总结

- JavaScript 继承基础是原型链。
- class 是原型继承的现代语法。
- 实例属性放构造函数里，方法放原型上。
- `extends` 建立子类原型到父类原型的连接。
- 工程上优先考虑组合，继承用于明确的 is-a 关系。

## 延伸问题

1. 原型链继承有什么问题？
2. class extends 底层做了什么？
3. 为什么子类 constructor 里要先调用 `super()`？
4. 组合和继承如何取舍？
5. 方法放在构造函数里和原型上有什么区别？

## 可能类似的问题及简要参考答案

**Q：JavaScript 继承是复制父类属性吗？**  
A：不是。它主要通过原型链委托查找属性和方法。

**Q：class 是语法糖吗？**  
A：可以理解为构造函数和原型链的语法糖，但它也带来更严格的语法规则。

**Q：什么时候不用继承？**  
A：只想复用能力、没有稳定父子关系时，组合通常更清晰。

## 辅助记忆总结

记成一句话：JS 继承不是“拷贝家产”，而是“找不到就问原型”。
