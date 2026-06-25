# 039. [初级] 如何遍历对象的属性？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

遍历对象属性前要先确认三件事：是否只遍历自身属性，是否需要可枚举属性，是否要包含 Symbol 属性。不同遍历方式的差异都来自这三个维度。

一句话答法：普通业务遍历自身可枚举字符串属性用 `Object.keys/values/entries`；需要继承属性才用 `for...in`。

## 问题意图

这道题考察对象属性分类、枚举规则和 API 选择能力。面试官通常会追问 `for...in`、`Object.keys`、`Reflect.ownKeys` 的区别。

## 考察范围

- `for...in`。
- `Object.keys()`、`Object.values()`、`Object.entries()`。
- `Object.getOwnPropertyNames()`。
- `Object.getOwnPropertySymbols()`。
- `Reflect.ownKeys()`。
- 自身/继承、可枚举/不可枚举、字符串/Symbol 属性。

## 技术错误纠正

不能笼统说“遍历对象用 `for...in`”。`for...in` 会遍历可枚举的继承属性，业务中经常需要配合 `Object.hasOwn()` 过滤。

## 知识点系统梳理

| 方法 | 自身属性 | 继承属性 | 不可枚举 | Symbol | 返回 |
| --- | --- | --- | --- | --- | --- |
| `for...in` | 是 | 是 | 否 | 否 | key |
| `Object.keys(obj)` | 是 | 否 | 否 | 否 | key 数组 |
| `Object.values(obj)` | 是 | 否 | 否 | 否 | value 数组 |
| `Object.entries(obj)` | 是 | 否 | 否 | 否 | `[key, value]` 数组 |
| `Object.getOwnPropertyNames(obj)` | 是 | 否 | 是 | 否 | key 数组 |
| `Object.getOwnPropertySymbols(obj)` | 是 | 否 | 是 | 是 | Symbol 数组 |
| `Reflect.ownKeys(obj)` | 是 | 否 | 是 | 是 | 字符串 key + Symbol |

## 实战应用举例

### 示例 1：遍历配置对象

```js
const config = {
  host: 'localhost',
  port: 3000,
}

for (const [key, value] of Object.entries(config)) {
  console.log(`${key}=${value}`)
}
```

这个例子适合普通业务对象：只关心自身可枚举字符串属性。

### 示例 2：过滤 `for...in` 的继承属性

```js
const proto = { inherited: true }
const obj = Object.create(proto)
obj.own = true

for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key)
  }
}
```

这个例子证明：`for...in` 默认会看到原型链上的可枚举属性。

## 使用场景说明和对比

| 场景 | 推荐方式 | 原因 |
| --- | --- | --- |
| 转换普通对象 | `Object.entries()` | 同时拿 key 和 value |
| 只拿 key | `Object.keys()` | 简洁且只看自身可枚举 |
| 只拿 value | `Object.values()` | 少写一次索引 |
| 包含不可枚举属性 | `Object.getOwnPropertyNames()` | 适合调试或底层工具 |
| 包含 Symbol | `Reflect.ownKeys()` | 覆盖最全 |
| 遍历继承可枚举属性 | `for...in` | 少见，需明确目的 |

## 易错点提示

- `for...in` 会遍历继承的可枚举属性。
- `Object.keys` 不包含 Symbol 属性。
- 不可枚举属性不会出现在 `Object.keys`、`Object.entries` 中。
- 属性遍历顺序有规则，但不要把业务逻辑强依赖在对象 key 顺序上。
- 数组遍历不要用 `for...in`，用 `for...of`、`forEach` 或普通循环。

## 记忆要点总结

- 普通对象遍历优先 `Object.entries()`。
- 需要 key 用 `Object.keys()`。
- `for...in` 会看原型链。
- Symbol 和不可枚举属性要用更底层 API。
- 遍历前先问：自身还是继承，可枚举还是全部，字符串还是 Symbol。

## 延伸问题

1. `for...in` 和 `Object.keys()` 有什么区别？
2. 如何遍历 Symbol 属性？
3. 不可枚举属性如何获取？
4. 为什么不建议用 `for...in` 遍历数组？

## 可能类似的问题及简要参考答案

**Q：`Object.entries()` 返回什么？**  
A：返回对象自身可枚举字符串属性组成的 `[key, value]` 数组。

**Q：如何拿到对象所有自身 key，包括 Symbol？**  
A：用 `Reflect.ownKeys(obj)`。

**Q：`for...in` 会遍历不可枚举属性吗？**  
A：不会。它只遍历可枚举字符串属性，但包含继承属性。

## 辅助记忆总结

记成一句话：普通业务用 `entries`，查全家底用 `Reflect.ownKeys`，用 `for...in` 先想清楚原型链。
