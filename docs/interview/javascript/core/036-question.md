# 036. [中级] 如何实现对象的深拷贝？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

深拷贝是复制对象结构时，也递归复制内部引用值，让新对象和旧对象的嵌套数据不再共享引用。

一句话答法：浅拷贝只复制第一层引用，深拷贝要递归复制每一层引用，并处理循环引用和特殊类型。

## 问题意图

这道题考察引用类型、递归、循环引用、特殊对象和工程取舍。面试官通常会追问 JSON 拷贝为什么不可靠。

## 考察范围

- 浅拷贝和深拷贝。
- 递归复制对象和数组。
- 循环引用处理。
- `Date`、`RegExp`、`Map`、`Set` 等特殊类型。
- `structuredClone`。
- JSON 序列化方案的限制。

## 技术错误纠正

`JSON.parse(JSON.stringify(obj))` 不是通用深拷贝。它会丢失函数、`undefined`、Symbol、循环引用、原型、`Date` 类型等信息。

## 知识点系统梳理

浅拷贝问题：

```js
const a = { profile: { age: 18 } }
const b = { ...a }

b.profile.age = 20
console.log(a.profile.age) // 20
```

简化深拷贝：

```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value
  if (seen.has(value)) return seen.get(value)

  if (value instanceof Date) return new Date(value)
  if (value instanceof RegExp) return new RegExp(value)

  const result = Array.isArray(value) ? [] : {}
  seen.set(value, result)

  for (const key of Reflect.ownKeys(value)) {
    result[key] = deepClone(value[key], seen)
  }

  return result
}
```

## 实战应用举例

### 示例 1：处理循环引用

```js
const user = { name: 'Ada' }
user.self = user

const copy = deepClone(user)

console.log(copy !== user) // true
console.log(copy.self === copy) // true
```

`WeakMap` 用来记录已经拷贝过的对象，避免循环引用导致无限递归。

### 示例 2：优先使用 structuredClone

```js
const state = {
  user: { name: 'Ada' },
  createdAt: new Date(),
}

const copy = structuredClone(state)
```

现代环境中，`structuredClone` 是更稳的内置深拷贝能力，但它也不能克隆函数和 DOM 节点。

## 使用场景说明和对比

| 方案 | 优点 | 限制 |
| --- | --- | --- |
| `structuredClone` | 原生、支持循环引用和多种内置类型 | 不支持函数、DOM 节点，需看运行环境 |
| 手写递归 | 可控，可定制 | 边界多，容易漏类型 |
| JSON 序列化 | 简单 | 丢类型、丢值、不支持循环 |
| 浅拷贝 | 快、简单 | 嵌套引用仍共享 |

## 易错点提示

- 深拷贝不是越多越好，大对象深拷贝有性能成本。
- JSON 方案会把 `Date` 变成字符串。
- 循环引用必须用 `WeakMap` 或类似结构处理。
- `Map/Set`、属性描述符、原型链要不要保留，取决于需求。
- React/Vue 状态更新很多时候只需要结构共享，不需要完整深拷贝。

## 记忆要点总结

- 深拷贝要断开嵌套引用。
- JSON 方案只适合简单纯数据。
- 循环引用用 `WeakMap`。
- 特殊类型要单独处理。
- 有原生 `structuredClone` 时优先考虑它。

## 延伸问题

1. 浅拷贝和深拷贝有什么区别？
2. JSON 深拷贝会丢失哪些信息？
3. 如何处理循环引用？
4. `structuredClone` 有哪些限制？
5. 状态管理里为什么不总是深拷贝？

## 可能类似的问题及简要参考答案

**Q：展开运算符是深拷贝吗？**  
A：不是。`{ ...obj }` 只浅拷贝第一层。

**Q：为什么用 `WeakMap` 处理循环引用？**  
A：它能记录源对象和克隆对象的映射，遇到同一个源对象时直接返回已克隆结果。

**Q：什么时候 JSON 拷贝可以接受？**  
A：只包含简单 JSON 数据，且不关心 `Date`、函数、`undefined`、Symbol、原型等信息时。

## 辅助记忆总结

记成一句话：深拷贝是“每层都另建一份，遇到绕圈要记路”。
