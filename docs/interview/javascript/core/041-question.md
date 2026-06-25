# 041. [中级] 如何冻结一个对象？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

冻结对象通常指使用 `Object.freeze(obj)` 让对象自身属性不能新增、删除或修改。它是浅冻结，不会递归冻结嵌套对象。

一句话答法：`Object.freeze` 能冻结对象第一层属性，深层对象还要递归冻结。

## 问题意图

这道题考察对象不可变性、属性描述符和浅冻结边界。面试常追问 `freeze`、`seal`、`preventExtensions` 的区别。

## 考察范围

- `Object.freeze()`。
- `Object.isFrozen()`。
- `Object.seal()`。
- `Object.preventExtensions()`。
- 浅冻结与深冻结。
- 严格模式下修改冻结对象的行为。

## 技术错误纠正

冻结不是“让所有层级都不可变”。`Object.freeze` 只处理对象自身第一层属性；如果属性值本身是对象，那个对象仍然可以被修改。

## 知识点系统梳理

```js
const user = {
  name: 'Ada',
  profile: {
    age: 18,
  },
}

Object.freeze(user)

user.name = 'Grace'
user.profile.age = 20

console.log(user.name) // Ada
console.log(user.profile.age) // 20
```

冻结后的第一层效果：

- 不能新增属性。
- 不能删除属性。
- 不能修改已有数据属性。
- 已有属性变成不可配置。

## 实战应用举例

### 示例 1：冻结常量配置

```js
const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
})

ROUTES.HOME = '/home'

console.log(ROUTES.HOME) // /
```

这个例子适合固定枚举、路由常量、权限标识等不希望被改的对象。

### 示例 2：实现简化深冻结

```js
function deepFreeze(obj) {
  Object.freeze(obj)

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  }

  return obj
}
```

这个简化版本不处理循环引用，真实项目要加 `WeakSet` 防止递归死循环。

## 使用场景说明和对比

| 方法 | 可新增 | 可删除 | 可修改已有值 | 适合场景 |
| --- | --- | --- | --- | --- |
| `Object.preventExtensions` | 否 | 是 | 是 | 只禁止扩展 |
| `Object.seal` | 否 | 否 | 是 | 固定结构但允许改值 |
| `Object.freeze` | 否 | 否 | 否 | 常量对象、不可变配置 |

## 易错点提示

- `Object.freeze` 是浅冻结。
- 非严格模式下修改冻结对象可能静默失败，严格模式下会报错。
- 冻结数组后不能 `push/pop`。
- 冻结对象不等于深度不可变数据结构。
- 对大型对象深冻结有性能成本，不要在热路径滥用。

## 记忆要点总结

- `freeze` 最强：不增、不删、不改。
- `seal` 固定结构但可改值。
- `preventExtensions` 只禁止新增。
- `freeze` 是浅的。
- 深冻结要递归并处理循环引用。

## 延伸问题

1. `freeze`、`seal`、`preventExtensions` 有什么区别？
2. 如何判断对象是否被冻结？
3. 如何实现支持循环引用的深冻结？
4. 冻结数组后会发生什么？

## 可能类似的问题及简要参考答案

**Q：`Object.freeze` 会冻结嵌套对象吗？**  
A：不会。它只冻结第一层属性，嵌套对象要递归冻结。

**Q：如何检测对象是否冻结？**  
A：用 `Object.isFrozen(obj)`。

**Q：冻结对象后修改属性一定报错吗？**  
A：严格模式下通常报错，非严格模式下可能静默失败。

## 辅助记忆总结

记成一句话：`freeze` 锁第一层，深层要另锁。
