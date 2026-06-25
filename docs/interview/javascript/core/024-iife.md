# 024. [初级] 什么是立即执行函数表达式（IIFE）？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

IIFE 是定义后立刻执行的函数表达式。它的核心价值是创建一个独立作用域，把临时变量、初始化逻辑和私有状态包起来，避免污染外部作用域。

一句话答法：IIFE 是“包起来马上执行”的函数，常用于旧时代模块封装和一次性初始化。

## 问题意图

这道题想确认你是否理解函数表达式、作用域隔离和历史模块化写法，也能说出现代代码里 IIFE 为什么变少了。

## 考察范围

- 函数声明和函数表达式的区别。
- IIFE 的常见语法：`(function(){})()`、`(() => {})()`。
- 创建私有作用域、避免全局变量污染。
- 一次性初始化、旧版模块封装。
- `let/const`、ESM、块级作用域出现后对 IIFE 的替代。

## 技术错误纠正

原始内容“使用括号将函数包装并立即调用”是对的，但需要补充：括号的目的不是装饰，而是把 `function` 解析成函数表达式，否则 `function fn(){}()` 这种函数声明后直接调用在语法上不成立。

## 知识点系统梳理

IIFE 的基本形式：

```js
(function () {
  const message = 'init'
  console.log(message)
})()
```

箭头函数形式：

```js
(() => {
  const message = 'init'
  console.log(message)
})()
```

它解决的问题：

| 问题 | IIFE 的作用 |
| --- | --- |
| 临时变量污染全局 | 把变量限制在函数作用域 |
| 初始化逻辑只执行一次 | 定义后立即执行 |
| 暴露有限 API | 返回对象或函数，隐藏内部状态 |
| 老浏览器没有块级作用域 | 用函数作用域模拟隔离 |

## 实战应用举例

### 示例 1：封装一次性初始化变量

```js
const config = (() => {
  const env = location.hostname.includes('test') ? 'test' : 'prod'

  return {
    env,
    apiBase: env === 'test' ? '/mock-api' : '/api',
  }
})()

console.log(config.apiBase)
```

这个例子证明：IIFE 可以隐藏 `env` 这样的临时变量，只把最终配置暴露出去。

### 示例 2：旧式模块封装

```js
const counter = (function () {
  let count = 0

  return {
    inc() {
      count += 1
      return count
    },
    reset() {
      count = 0
    },
  }
})()

console.log(counter.inc()) // 1
```

这里 `count` 是私有状态。现代项目通常会用 ESM 或 class 私有字段，但理解 IIFE 有助于读旧代码和库源码。

## 使用场景说明和对比

| 场景 | 现在是否推荐 IIFE | 原因 |
| --- | --- | --- |
| 一次性计算复杂常量 | 可以 | 避免外部多出临时变量 |
| 老代码模块封装 | 常见 | ESM 普及前的模块化手段 |
| 普通块级作用域隔离 | 不优先 | `let/const` + `{}` 更简单 |
| 现代模块文件 | 很少需要 | ESM 文件本身就是模块作用域 |
| 异步初始化 | 可用 async IIFE | 顶层 await 不可用时有价值 |

async IIFE 示例：

```js
;(async () => {
  const user = await fetchCurrentUser()
  console.log(user)
})()
```

## 易错点提示

- IIFE 是函数表达式，不是函数声明。
- 前一行如果没有分号，`(function(){})()` 可能和上一行表达式连在一起，常见写法会在前面加 `;`。
- IIFE 内部变量不会泄漏到外部，但返回的函数仍可能形成闭包。
- 现代 ESM 文件天然有模块作用域，不要为了“显得高级”强行套 IIFE。
- 箭头 IIFE 没有自己的 `this` 和 `arguments`。

## 记忆要点总结

- IIFE = Immediately Invoked Function Expression。
- 核心价值：创建私有作用域并立即执行。
- 旧用途：防全局污染、模块封装、一次性初始化。
- 新替代：ESM、`let/const` 块级作用域、class 私有字段。
- async IIFE 仍适合没有顶层 await 的场景。

## 延伸问题

1. IIFE 为什么要用括号包起来？
2. IIFE 和闭包有什么关系？
3. ESM 出现后 IIFE 为什么变少了？
4. async IIFE 适合解决什么问题？
5. IIFE 前面为什么常加分号？

## 可能类似的问题及简要参考答案

**Q：IIFE 的主要作用是什么？**  
A：创建独立作用域并立即执行，避免临时变量污染外部环境。

**Q：IIFE 和普通函数调用有什么区别？**  
A：IIFE 通常没有外部复用入口，定义后立刻执行，重点是作用域隔离和初始化。

**Q：现代代码还需要 IIFE 吗？**  
A：少了。ESM 和块级作用域已经覆盖大多数用途，但 async IIFE 和旧代码阅读仍会遇到。

## 辅助记忆总结

记成一句话：IIFE 是“临时开一个房间，把事办完再出来”。
