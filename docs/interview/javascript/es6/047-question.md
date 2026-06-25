# 047. [初级] 什么是块级作用域？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

块级作用域是由 `{}` 创建的作用域，`let`、`const`、class 声明会被限制在这个块内。它解决了 `var` 只有函数作用域导致的变量泄漏问题。

一句话答法：块级作用域让变量只在当前 `{}` 里有效。

## 问题意图

这道题考察 ES6 为什么引入 `let/const`，以及你是否能解释 if、for、try/catch 等块里的变量隔离。

## 考察范围

- `{}` 块级作用域。
- `let/const` 和 `var` 的作用域差异。
- for 循环每轮独立绑定。
- TDZ。
- 块级函数声明的特殊行为。
- 变量生命周期和命名冲突控制。

## 技术错误纠正

不是所有 `{}` 都会让 `var` 进入块级作用域。`var` 仍然是函数作用域或全局作用域；块级作用域主要约束 `let/const/class`。

## 知识点系统梳理

```js
if (true) {
  let blockValue = 1
  const blockConst = 2
  var functionValue = 3
}

console.log(functionValue) // 3
console.log(blockValue) // ReferenceError
console.log(blockConst) // ReferenceError
```

常见块：

| 语法 | 是否形成块级作用域 | 说明 |
| --- | --- | --- |
| `if {}` | 是 | `let/const` 只在块内有效 |
| `for {}` | 是 | 每轮迭代可有独立绑定 |
| `while {}` | 是 | 同样约束 `let/const` |
| `try/catch` | 是 | `catch (err)` 只在 catch 块内 |
| 函数体 | 是，也是函数作用域 | 函数参数和 var 也在函数内 |

## 实战应用举例

### 示例 1：避免临时变量污染外层

```js
const result = []

if (result.length === 0) {
  const message = 'empty'
  result.push(message)
}

console.log(typeof message) // undefined
```

临时变量被限制在块内，外层不会多出无意义变量。

### 示例 2：for 循环中的独立绑定

```js
const handlers = []

for (let i = 0; i < 3; i += 1) {
  handlers.push(() => i)
}

console.log(handlers.map(fn => fn())) // [0, 1, 2]
```

`let` 在 for 循环中每轮创建新的绑定，解决了经典闭包共享同一个 `var i` 的问题。

## 使用场景说明和对比

| 场景 | 块级作用域价值 |
| --- | --- |
| 条件分支临时变量 | 避免泄漏到外层 |
| 循环计数器 | 每轮绑定更符合直觉 |
| try/catch 错误对象 | 错误变量只在 catch 内使用 |
| 大函数中的局部计算 | 降低命名冲突 |

## 易错点提示

- `var` 不受普通块级作用域限制。
- `let/const` 在块内声明前访问会触发 TDZ。
- for 循环里的 `let` 每轮是新绑定。
- 块级函数声明在非严格模式和不同环境里有历史兼容差异，少依赖。
- 块级作用域不是模块作用域；模块文件还有自己的顶层作用域。

## 记忆要点总结

- 块级作用域由 `{}` 创建。
- `let/const/class` 受块级作用域约束。
- `var` 不受普通块约束。
- for + let 每轮独立绑定。
- 块级作用域减少变量污染和命名冲突。

## 延伸问题

1. `let` 在 for 循环中为什么能解决闭包问题？
2. 块级作用域和函数作用域有什么区别？
3. TDZ 和块级作用域有什么关系？
4. 块级函数声明为什么不建议依赖？

## 可能类似的问题及简要参考答案

**Q：`if` 块里的 `var` 外面能访问吗？**  
A：能，`var` 没有普通块级作用域。

**Q：块级作用域解决了什么问题？**  
A：减少变量泄漏、命名冲突和循环闭包误用。

**Q：`const` 是块级作用域吗？**  
A：是，`const` 声明只在所在块内有效。

## 辅助记忆总结

记成一句话：块级作用域就是“变量只在这一对大括号里活着”。
