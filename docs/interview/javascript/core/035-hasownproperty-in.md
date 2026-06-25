# 035. [中级] `hasOwnProperty` 和 `in` 操作符的区别

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

`hasOwnProperty` 和 `in` 都能判断属性，但判断范围不同：前者只看对象自身，后者会沿原型链查找。

一句话答法：`hasOwnProperty` 查“自有属性”，`in` 查“自有属性 + 原型链属性”。

## 问题意图

这道题主要考察原型链、属性归属和安全判断。面试常用它区分候选人是否知道对象属性不都在对象自身上。

## 考察范围

- 自身属性和继承属性。
- `in` 的原型链查找。
- `hasOwnProperty` 的调用风险。
- `Object.hasOwn()` 的现代写法。
- `for...in` 遍历时为什么要过滤。
- 原型污染和无原型对象。

## 技术错误纠正

直接写 `obj.hasOwnProperty(key)` 在大多数普通对象上可用，但不是最稳写法。对象可能覆盖这个方法，也可能是 `Object.create(null)` 创建的无原型对象。

## 知识点系统梳理

```js
const parent = { inherited: true }
const child = Object.create(parent)
child.own = true

console.log('own' in child) // true
console.log('inherited' in child) // true

console.log(child.hasOwnProperty('own')) // true
console.log(child.hasOwnProperty('inherited')) // false
```

更稳写法：

```js
Object.hasOwn(child, 'own')
Object.prototype.hasOwnProperty.call(child, 'own')
```

## 实战应用举例

### 示例 1：过滤 `for...in` 的原型属性

```js
const proto = { fromProto: 1 }
const obj = Object.create(proto)
obj.name = 'Ada'

for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key])
  }
}
```

这个例子证明：`for...in` 会枚举可枚举的继承属性，所以需要 `Object.hasOwn` 过滤自身属性。

### 示例 2：避免方法被覆盖

```js
const data = {
  hasOwnProperty: false,
  id: 1,
}

console.log(Object.prototype.hasOwnProperty.call(data, 'id')) // true
```

如果直接调用 `data.hasOwnProperty('id')` 会报错，因为方法名被业务字段覆盖了。

## 使用场景说明和对比

| 需求 | 推荐 | 原因 |
| --- | --- | --- |
| 判断自身属性 | `Object.hasOwn(obj, key)` | 简洁明确 |
| 判断属性访问是否存在 | `key in obj` | 包含原型链 |
| 兼容特殊对象 | `Object.prototype.hasOwnProperty.call(obj, key)` | 不依赖对象自身方法 |
| 遍历对象自身属性 | `Object.keys(obj)` | 默认只返回自身可枚举属性 |

## 易错点提示

- `in` 返回 true 不代表属性在对象自身。
- `hasOwnProperty` 可能被对象覆盖。
- `Object.create(null)` 没有继承 `Object.prototype`。
- `for...in` 会遍历可枚举继承属性。
- 判断属性存在不要用真假值判断。

## 记忆要点总结

- `in` 范围更大，会查原型链。
- `hasOwnProperty` 范围更小，只查自身。
- 更推荐 `Object.hasOwn()`。
- 遍历时要明确是否需要继承属性。

## 延伸问题

1. `for...in` 和 `Object.keys()` 有什么区别？
2. 为什么 `Object.hasOwn()` 比 `obj.hasOwnProperty()` 更稳？
3. 原型链属性会影响哪些判断？
4. 如何处理 `Object.create(null)` 创建的对象？

## 可能类似的问题及简要参考答案

**Q：`in` 会检查不可枚举属性吗？**  
A：会。只要属性在对象自身或原型链上存在，不要求可枚举。

**Q：`hasOwnProperty` 会检查原型链吗？**  
A：不会，只检查对象自身属性。

**Q：如何判断对象自身是否有某属性？**  
A：优先用 `Object.hasOwn(obj, key)`。

## 辅助记忆总结

记成一句话：`in` 管“家里和祖上”，`hasOwn` 只管“自己名下”。
