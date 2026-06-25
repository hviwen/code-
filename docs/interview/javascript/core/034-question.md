# 034. [初级] 如何检查对象是否具有某个属性？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

检查对象属性时，真正要先判断的是：只关心对象自身属性，还是也接受原型链上的属性。不同 API 的差异正来自这个边界。

一句话答法：查自身属性用 `Object.hasOwn()` 或 `hasOwnProperty`，查自身加原型链用 `in`。

## 问题意图

这道题考察对象属性查找、原型链和 API 选择能力。面试官通常会追问 `in` 和 `hasOwnProperty` 的区别，以及对象没有继承 `hasOwnProperty` 时怎么办。

## 考察范围

- `in` 操作符。
- `Object.hasOwn()`。
- `Object.prototype.hasOwnProperty.call()`。
- 自身属性和原型链属性。
- 属性值为 `undefined` 时的判断误区。
- `Object.create(null)` 这类无原型对象。

## 技术错误纠正

不能用 `obj.key !== undefined` 判断属性是否存在。属性存在但值就是 `undefined` 时，这种写法会误判。

## 知识点系统梳理

| 方法 | 查自身属性 | 查原型链 | 适合场景 |
| --- | --- | --- | --- |
| `'name' in obj` | 是 | 是 | 判断属性访问是否能命中 |
| `Object.hasOwn(obj, 'name')` | 是 | 否 | 判断对象自身是否拥有属性 |
| `Object.prototype.hasOwnProperty.call(obj, 'name')` | 是 | 否 | 兼容无原型对象或被覆盖方法 |
| `obj.name !== undefined` | 不可靠 | 不可靠 | 不推荐用来判断存在性 |

属性查找分两层：

1. 先查对象自身属性。
2. 自身没有，再沿 `[[Prototype]]` 原型链向上查。

## 实战应用举例

### 示例 1：区分自身属性和原型属性

```js
const proto = { role: 'admin' }
const user = Object.create(proto)
user.name = 'Ada'

console.log('name' in user) // true
console.log('role' in user) // true，来自原型

console.log(Object.hasOwn(user, 'name')) // true
console.log(Object.hasOwn(user, 'role')) // false
```

这个例子证明：`in` 看整条原型链，`Object.hasOwn` 只看对象自身。

### 示例 2：属性值为 undefined 也算存在

```js
const form = {
  email: undefined,
}

console.log(form.email !== undefined) // false
console.log(Object.hasOwn(form, 'email')) // true
```

这个例子适合表单、接口字段判断：字段存在但值为空，和字段不存在不是一回事。

## 使用场景说明和对比

| 场景 | 推荐方式 | 原因 |
| --- | --- | --- |
| 判断接口字段是否返回 | `Object.hasOwn(data, key)` | 不受值是否为 `undefined` 影响 |
| 判断对象能否访问某属性 | `key in obj` | 接受原型链属性 |
| 遍历后过滤自身属性 | `Object.hasOwn(obj, key)` | 避免原型污染影响 |
| 兼容旧环境或无原型对象 | `Object.prototype.hasOwnProperty.call(obj, key)` | 不依赖对象自身方法 |

## 易错点提示

- `in` 会查原型链，不等于“对象自身有这个属性”。
- 属性值是 `undefined` 时，属性仍然可能存在。
- `obj.hasOwnProperty` 可能被对象自身覆盖。
- `Object.create(null)` 创建的对象没有 `hasOwnProperty` 方法。
- 用户输入作为 key 时，要警惕 `__proto__` 等原型污染问题。

## 记忆要点总结

- 自身属性：优先 `Object.hasOwn(obj, key)`。
- 自身加原型：用 `key in obj`。
- 不用 `obj[key] !== undefined` 判断存在性。
- 兼容特殊对象：用 `Object.prototype.hasOwnProperty.call`。

## 延伸问题

1. `in` 和 `hasOwnProperty` 有什么区别？
2. `Object.create(null)` 为什么没有 `hasOwnProperty`？
3. 如何判断一个字段存在但值为 `undefined`？
4. 什么是原型污染，它和属性检测有什么关系？

## 可能类似的问题及简要参考答案

**Q：`'toString' in {}` 是什么结果？**  
A：是 `true`，因为 `toString` 来自 `Object.prototype`。

**Q：为什么推荐 `Object.hasOwn()`？**  
A：它语义清晰，直接判断自身属性，不依赖对象上是否有 `hasOwnProperty` 方法。

**Q：`obj[key]` 为假值能说明属性不存在吗？**  
A：不能。值可能是 `0`、`false`、`''`、`null` 或 `undefined`。

## 辅助记忆总结

记成一句话：`in` 问“能不能访问到”，`hasOwn` 问“是不是自己家的”。
