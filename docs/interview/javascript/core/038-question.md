# 038. [中级] 什么是属性描述符？如何使用？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

属性描述符是 JavaScript 用来描述对象属性行为的元信息。它决定属性能不能写、能不能枚举、能不能重新配置，或者通过 getter/setter 读写。

一句话答法：属性描述符让你不只定义“属性值是什么”，还定义“这个属性怎么表现”。

## 问题意图

这道题考察你是否理解对象属性的底层控制能力，以及 `Object.defineProperty`、getter/setter、不可枚举属性这些常见机制。

## 考察范围

- 数据描述符：`value`、`writable`。
- 访问器描述符：`get`、`set`。
- 公共字段：`enumerable`、`configurable`。
- `Object.defineProperty()`。
- `Object.getOwnPropertyDescriptor()`。
- Vue 2 响应式、只读属性、隐藏属性等场景。

## 技术错误纠正

属性描述符分为数据描述符和访问器描述符，不能在同一个属性描述符里同时使用 `value/writable` 和 `get/set`。

## 知识点系统梳理

数据描述符：

```js
Object.defineProperty(user, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false,
})
```

访问器描述符：

```js
Object.defineProperty(user, 'name', {
  get() {
    return this._name
  },
  set(value) {
    this._name = value.trim()
  },
})
```

字段含义：

| 字段 | 作用 |
| --- | --- |
| `value` | 属性值 |
| `writable` | 是否可重新赋值 |
| `enumerable` | 是否出现在枚举中 |
| `configurable` | 是否可删除或重新配置描述符 |
| `get` | 读取时调用 |
| `set` | 写入时调用 |

## 实战应用举例

### 示例 1：定义不可写 ID

```js
const user = {}

Object.defineProperty(user, 'id', {
  value: 1001,
  writable: false,
  enumerable: true,
})

user.id = 2002
console.log(user.id) // 1001
```

这个例子适合定义不希望业务代码随意改掉的标识字段。

### 示例 2：用 getter/setter 做输入整理

```js
const form = {
  _email: '',
}

Object.defineProperty(form, 'email', {
  get() {
    return this._email
  },
  set(value) {
    this._email = String(value).trim().toLowerCase()
  },
})

form.email = '  TEST@EXAMPLE.COM '
console.log(form.email) // test@example.com
```

这个例子证明：访问器属性可以把读取和写入变成受控逻辑。

## 使用场景说明和对比

| 场景 | 使用方式 | 注意点 |
| --- | --- | --- |
| 定义只读字段 | `writable: false` | 严格模式下写入会报错 |
| 隐藏内部字段 | `enumerable: false` | 仍可直接访问 |
| 禁止删除/重配 | `configurable: false` | 很难再回退，慎用 |
| 响应式拦截 | getter/setter | 只能拦截已有属性 |
| 查看属性行为 | `Object.getOwnPropertyDescriptor` | 只查自身属性 |

## 易错点提示

- `Object.defineProperty` 默认 `writable/enumerable/configurable` 都是 `false`。
- 数据描述符和访问器描述符不能混用。
- `configurable: false` 后很多配置不能再改。
- `enumerable: false` 只是不参与枚举，不是私有属性。
- getter 里不要递归读取同名属性，否则会无限递归。

## 记忆要点总结

- 属性描述符控制属性行为。
- 数据描述符管值和可写性。
- 访问器描述符管 getter/setter。
- `enumerable` 影响遍历。
- `configurable` 最硬，设置前要谨慎。

## 延伸问题

1. 数据描述符和访问器描述符有什么区别？
2. 为什么 `defineProperty` 默认不可枚举？
3. Vue 2 为什么使用 `Object.defineProperty` 做响应式？
4. `configurable: false` 后还能改什么？

## 可能类似的问题及简要参考答案

**Q：如何查看属性描述符？**  
A：用 `Object.getOwnPropertyDescriptor(obj, key)`。

**Q：不可枚举属性能访问吗？**  
A：能。不可枚举只影响枚举方法，不影响点访问或方括号访问。

**Q：getter/setter 是数据属性吗？**  
A：不是，它们属于访问器属性，不能和 `value/writable` 同时出现。

## 辅助记忆总结

记成一句话：描述符是属性的“行为说明书”；回答时按“数据属性还是访问器属性、能不能写、能不能枚举、能不能重配”四个点展开。
