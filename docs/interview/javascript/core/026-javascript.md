# 026. [高级] 什么是尾调用优化？JavaScript 支持吗？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

尾调用是函数最后一步直接返回另一个函数的调用结果。尾调用优化是运行时复用当前调用栈帧，避免深递归不断增长栈。

一句话答法：ES2015 规范描述了严格模式下的 proper tail calls，但主流 JavaScript 引擎支持很不一致，业务代码不能依赖它防栈溢出。

## 问题意图

这道题想确认你是否能区分“尾调用形式”和“引擎真的优化”，并知道在 JavaScript 项目里更可靠的替代方案是循环、显式栈或 trampoline。

## 考察范围

- 尾调用和非尾调用的区别。
- 尾递归、调用栈、栈溢出。
- ES2015 proper tail calls 的规范背景。
- 浏览器和 Node.js 的现实支持差异。
- 循环、显式栈、trampoline 等替代方案。

## 技术错误纠正

原始内容“ES6 规范定义，严格模式下，浏览器支持有限”方向正确，但需要强调：规范存在不代表当前主流运行环境可依赖。实际开发中应默认 JavaScript 没有可依赖的尾调用优化。

## 知识点系统梳理

尾调用成立的关键：函数的最后一个动作必须是返回另一个函数调用的结果。

```js
function tail(n) {
  return next(n) // 尾调用
}

function notTail(n) {
  return next(n) + 1 // 不是尾调用，next 返回后还要 +1
}
```

尾递归版本：

```js
function factorial(n, acc = 1) {
  if (n <= 1) return acc
  return factorial(n - 1, n * acc)
}
```

虽然形式是尾递归，但在大多数 JavaScript 运行环境里仍可能栈溢出。

## 实战应用举例

### 示例 1：用循环替代深递归

```js
function factorial(n) {
  let result = 1

  for (let i = 2; i <= n; i += 1) {
    result *= i
  }

  return result
}
```

这个写法比依赖尾调用优化更可靠：不会增长调用栈，也更容易被团队理解。

### 示例 2：trampoline 模拟尾递归

```js
function trampoline(task) {
  let current = task

  while (typeof current === 'function') {
    current = current()
  }

  return current
}

function sumTo(n, acc = 0) {
  if (n === 0) return acc
  return () => sumTo(n - 1, acc + n)
}

console.log(trampoline(() => sumTo(10000))) // 50005000
```

这个例子证明：把下一步计算包装成函数，再由循环不断执行，可以避免递归调用栈增长。

## 使用场景说明和对比

| 方案 | 是否推荐 | 适合场景 |
| --- | --- | --- |
| 依赖尾调用优化 | 不推荐 | 面试解释概念即可 |
| 普通循环 | 推荐 | 数值累加、遍历、状态更新 |
| 显式栈 | 推荐 | 树/图深度遍历 |
| trampoline | 可选 | 想保留递归表达但避免栈溢出 |
| 普通递归 | 谨慎 | 深度可控、逻辑简单 |

## 易错点提示

- 尾递归写法不等于引擎一定做尾调用优化。
- `return fn(x) + 1` 不是尾调用。
- `try/finally`、闭包捕获、调试栈信息等都会影响优化可行性。
- Node.js 中不要依赖尾调用优化处理深递归。
- 面试可以讲规范，但项目里要给可靠替代方案。

## 记忆要点总结

- 尾调用：最后一步直接返回函数调用。
- 尾调用优化：复用栈帧，避免调用栈增长。
- JavaScript 规范有描述，但现实支持不可依赖。
- 深递归优先改循环或显式栈。
- Trampoline 是保留递归风格的折中方案。

## 延伸问题

1. 尾调用和尾递归有什么区别？
2. 为什么 `return fn() + 1` 不是尾调用？
3. JavaScript 中深度遍历树如何避免栈溢出？
4. Trampoline 的核心思想是什么？
5. 为什么主流 JS 引擎没有普遍启用 proper tail calls？

## 可能类似的问题及简要参考答案

**Q：JavaScript 支持尾调用优化吗？**  
A：规范层面有 proper tail calls，但主流运行环境支持不稳定，实际业务不要依赖。

**Q：如何避免深递归栈溢出？**  
A：优先改循环或显式栈；如果想保留递归表达，可用 trampoline。

**Q：尾调用优化解决什么问题？**  
A：复用调用栈帧，避免大量递归调用导致调用栈不断增长。

## 辅助记忆总结

记成一句话：尾调用优化“概念要会，业务别赌”；答题时先判断是否真的是最后一步调用，再说明主流 JS 环境里要用循环、显式栈或 trampoline 兜底。
