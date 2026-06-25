# 049. [中级] `const` 声明的对象可以修改吗？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

`const` 限制的是变量绑定不能重新指向别的值，不限制对象内部属性变化。因此 `const obj = {}` 后，`obj` 不能重新赋值，但 `obj.name` 可以修改。

一句话答法：`const` 保证引用不变，不保证对象内容不变。

## 问题意图

这道题考察你是否理解值类型、引用类型、变量绑定和对象不可变性的区别。

## 考察范围

- `const` 绑定不可重新赋值。
- 引用类型内部属性可变。
- 基本类型与引用类型的差异。
- `Object.freeze()`。
- 浅冻结与深冻结。
- 前端状态更新中的不可变思想。

## 技术错误纠正

不能说 `const` 声明的对象“不能修改”。准确说法是：不能把变量重新绑定到另一个对象，但可以修改原对象属性。

## 知识点系统梳理

```js
const user = {
  name: 'Ada',
}

user.name = 'Grace'
console.log(user.name) // Grace

user = { name: 'Lin' } // TypeError
```

如果希望对象第一层也不可改，可以使用：

```js
const config = Object.freeze({
  host: 'localhost',
})
```

但 `Object.freeze` 是浅冻结，嵌套对象仍需递归处理。

## 实战应用举例

### 示例 1：状态更新不要直接改对象

```js
const user = { name: 'Ada', age: 18 }

const nextUser = {
  ...user,
  age: 19,
}

console.log(user.age) // 18
console.log(nextUser.age) // 19
```

虽然 `const user` 的属性能改，但在 React/Vue 状态场景中，返回新对象通常更利于变更追踪。

### 示例 2：freeze 只冻结第一层

```js
const config = Object.freeze({
  api: {
    timeout: 1000,
  },
})

config.api.timeout = 2000
console.log(config.api.timeout) // 2000
```

这个例子证明：`freeze` 不等于深不可变。

## 使用场景说明和对比

| 需求 | 推荐 |
| --- | --- |
| 变量不会重新赋值 | `const` |
| 变量后续会重新赋值 | `let` |
| 对象第一层不可变 | `Object.freeze` |
| 深层不可变 | 递归 freeze 或不可变数据方案 |
| 状态更新 | 创建新对象而不是原地修改 |

## 易错点提示

- `const` 必须声明时初始化。
- `const` 不能重新赋值，但对象属性能改。
- `Object.freeze` 是浅冻结。
- 数组也是对象，`const arr = []` 后仍可 `arr.push()`。
- 真正的不可变需要约束对象内容，不只是变量绑定。

## 记忆要点总结

- `const` 锁绑定。
- 对象属性不被 `const` 锁住。
- 数组同理，能 push。
- 要锁对象内容用 freeze。
- 状态管理中更推荐不可变更新。

## 延伸问题

1. `const` 和 `Object.freeze` 有什么区别？
2. 如何实现深冻结？
3. 为什么 React 状态不建议原地修改？
4. `const arr = []` 后能不能 `push`？

## 可能类似的问题及简要参考答案

**Q：`const` 声明数组可以修改吗？**  
A：可以修改数组内容，例如 `push`；但不能把变量重新赋值为另一个数组。

**Q：如何让对象属性也不可修改？**  
A：用 `Object.freeze` 冻结第一层；深层对象需要递归冻结。

**Q：`const` 比 `let` 更安全吗？**  
A：它能防止重新绑定，表达意图更清晰，但不自动保证对象内容不可变。

## 辅助记忆总结

记成一句话：`const` 锁的是“指向哪”，不是“里面啥样”。
