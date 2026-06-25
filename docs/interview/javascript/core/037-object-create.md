# 037. [高级] `Object.create()` 方法的作用和用法

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

`Object.create(proto)` 用指定对象作为新对象的原型，直接创建一个拥有特定原型链的新对象。它关注的是“原型是谁”，不是“构造函数怎么执行”。

一句话答法：`Object.create()` 可以绕过构造函数，精确指定新对象的原型。

## 问题意图

这道题考察你是否理解原型继承的底层模型，以及 `Object.create` 和 `new`、对象字面量的区别。

## 考察范围

- `Object.create(proto)` 创建对象。
- 第二个参数属性描述符。
- `Object.create(null)` 创建无原型字典对象。
- 原型式继承。
- 和 `new Constructor()` 的区别。
- 原型链属性查找和自身属性判断。

## 技术错误纠正

`Object.create()` 不是复制原型对象，也不是调用构造函数。它创建的新对象内部 `[[Prototype]]` 指向传入的 `proto`。

## 知识点系统梳理

基础用法：

```js
const animal = {
  speak() {
    return `${this.name} makes sound`
  },
}

const dog = Object.create(animal)
dog.name = 'Lucky'

console.log(dog.speak()) // Lucky makes sound
console.log(Object.getPrototypeOf(dog) === animal) // true
```

第二个参数可定义属性描述符：

```js
const user = Object.create(null, {
  id: {
    value: 1,
    enumerable: true,
  },
})
```

## 实战应用举例

### 示例 1：创建无原型字典

```js
const dict = Object.create(null)

dict.apple = 1
dict.toString = 2

console.log('toString' in dict) // true，只来自自身
console.log(Object.getPrototypeOf(dict)) // null
```

这个例子适合做纯 key-value 字典，避免 `Object.prototype` 上的属性干扰。

### 示例 2：原型式继承

```js
const baseView = {
  render() {
    return `<div>${this.title}</div>`
  },
}

const homeView = Object.create(baseView)
homeView.title = 'Home'

console.log(homeView.render())
```

这个例子证明：新对象可以复用原型方法，同时保留自己的数据。

## 使用场景说明和对比

| 创建方式 | 原型 | 是否调用构造函数 | 适合场景 |
| --- | --- | --- | --- |
| `{}` | `Object.prototype` | 否 | 普通对象 |
| `new Fn()` | `Fn.prototype` | 是 | 需要初始化逻辑 |
| `Object.create(proto)` | 指定的 `proto` | 否 | 精确控制原型 |
| `Object.create(null)` | `null` | 否 | 字典对象 |

## 易错点提示

- `Object.create(proto)` 不会复制 `proto` 的属性。
- 原型上的引用类型属性仍然是共享的，慎放可变对象。
- `Object.create(null)` 没有 `toString`、`hasOwnProperty` 等方法。
- 第二个参数是属性描述符对象，不是普通属性值对象。
- 现代业务建模通常优先 class 或普通对象，底层原型控制才用它。

## 记忆要点总结

- `Object.create` 的核心是指定原型。
- 它不执行构造函数。
- `Object.create(null)` 可做无原型字典。
- 第二参数能定义属性描述符。
- 它适合理解和控制原型链，不适合滥用替代 class。

## 延伸问题

1. `Object.create()` 和 `new` 有什么区别？
2. `Object.create(null)` 有什么优缺点？
3. 如何判断 `Object.create` 创建对象的原型？
4. 第二个参数里的 `enumerable`、`writable` 是什么？

## 可能类似的问题及简要参考答案

**Q：`Object.create(null)` 创建的对象有什么特点？**  
A：没有原型，不继承 `Object.prototype`，适合做字典，但也没有 `hasOwnProperty`。

**Q：`Object.create(proto)` 会拷贝 proto 吗？**  
A：不会。它只是把新对象的原型指向 `proto`。

**Q：什么时候用 `new`，什么时候用 `Object.create`？**  
A：需要构造初始化用 `new`；只想指定原型、不执行构造逻辑用 `Object.create`。

## 辅助记忆总结

记成一句话：`Object.create` 是“给新对象指定一个祖先”。
