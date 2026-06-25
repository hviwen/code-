# 040. [中级] `Object.keys()`、`Object.values()`、`Object.entries()` 的区别

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这三个方法遍历范围相同，都是对象自身可枚举的字符串属性；区别只在返回内容：key、value，还是 key-value 二元组。

一句话答法：`keys` 拿键，`values` 拿值，`entries` 同时拿键和值。

## 问题意图

这道题想确认你是否能选择合适的对象转换 API，并知道它们不包含原型属性、不可枚举属性和 Symbol 属性。

## 考察范围

- 三个方法的返回值。
- 自身属性、可枚举属性、字符串属性。
- 和 `for...in` 的区别。
- 和 `Object.fromEntries()` 的配合。
- 对数组、类数组、普通对象的处理。

## 技术错误纠正

不能说这三个方法“遍历对象所有属性”。它们只处理自身、可枚举、字符串 key 属性，不包含继承属性、不可枚举属性和 Symbol。

## 知识点系统梳理

```js
const user = {
  id: 1,
  name: 'Ada',
}

console.log(Object.keys(user)) // ['id', 'name']
console.log(Object.values(user)) // [1, 'Ada']
console.log(Object.entries(user)) // [['id', 1], ['name', 'Ada']]
```

对比：

| 方法 | 返回 | 适合场景 |
| --- | --- | --- |
| `Object.keys(obj)` | key 数组 | 白名单过滤、判断字段名 |
| `Object.values(obj)` | value 数组 | 求和、查值、展示值 |
| `Object.entries(obj)` | `[key, value]` 数组 | 转换对象、遍历键值对 |

## 实战应用举例

### 示例 1：用 entries 转换对象

```js
const params = {
  page: 1,
  keyword: 'js',
}

const query = Object.entries(params)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&')

console.log(query) // page=1&keyword=js
```

这个例子证明：需要同时使用 key 和 value 时，`Object.entries` 最直接。

### 示例 2：配合 fromEntries 过滤字段

```js
const raw = {
  id: 1,
  name: 'Ada',
  password: 'secret',
}

const safe = Object.fromEntries(
  Object.entries(raw).filter(([key]) => key !== 'password'),
)

console.log(safe) // { id: 1, name: 'Ada' }
```

`entries -> filter/map -> fromEntries` 是对象转换的常见管道。

## 使用场景说明和对比

| 需求 | 推荐方法 | 原因 |
| --- | --- | --- |
| 判断对象有哪些字段 | `Object.keys` | 只需要 key |
| 对所有值求和 | `Object.values` | 只需要 value |
| 生成查询字符串 | `Object.entries` | 同时需要 key 和 value |
| 对象字段过滤转换 | `Object.entries` + `Object.fromEntries` | 管道清晰 |
| 包含 Symbol 或不可枚举属性 | `Reflect.ownKeys` | 三者都不覆盖 |

## 易错点提示

- 三者都不包含原型链属性。
- 三者都不包含不可枚举属性。
- 三者都不包含 Symbol 属性。
- `Object.values` 只返回值，丢失 key 后就无法知道来源字段。
- 空对象返回空数组，不会报错。

## 记忆要点总结

- `keys` = 键。
- `values` = 值。
- `entries` = 键值对。
- 三者范围一致：自身、可枚举、字符串属性。
- 对象转换优先想到 `entries` 和 `fromEntries`。

## 延伸问题

1. `Object.entries()` 和 `for...in` 的遍历范围有什么区别？
2. 如何把 entries 数组转回对象？
3. Symbol 属性为什么不会出现在 `Object.keys()` 中？
4. 如何获取不可枚举属性？

## 可能类似的问题及简要参考答案

**Q：`Object.keys([])` 会返回什么？**  
A：返回数组已有索引组成的字符串数组，例如 `Object.keys(['a'])` 是 `['0']`。

**Q：如何把对象的所有 value 做求和？**  
A：用 `Object.values(obj).reduce((sum, n) => sum + n, 0)`。

**Q：如何过滤对象字段？**  
A：常用 `Object.entries(obj).filter(... )` 后再 `Object.fromEntries(...)`。

## 辅助记忆总结

记成一句话：`keys/values/entries` 是同一范围的三种视角。
