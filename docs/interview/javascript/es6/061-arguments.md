# 061. [中级] 如何在箭头函数中访问 `arguments` 对象？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

箭头函数没有自己的 `arguments` 对象。现代写法不是“访问 arguments”，而是用 rest 参数 `(...args)` 显式收集实参。

一句话回答：箭头函数中用 `...args`；不要依赖外层 `arguments`。

## 问题意图

这题考察你是否知道箭头函数缺失 `arguments`，以及是否能用 ES6 的 rest 参数替代旧式类数组参数对象。

## 考察范围

- 箭头函数没有自己的 `arguments`。
- rest 参数 `...args`。
- `arguments` 是类数组，rest 参数是真数组。
- 命名参数和 rest 参数组合。
- 外层 `arguments` 的可读性风险。

## 技术错误纠正

原答案“可以通过在参数中使用 `(...args)`”结论正确，但应补充边界：`...args` 必须放在参数列表最后，并且它收集的是剩余实参，不是 `arguments` 对象本身。

## 知识点系统梳理

| 对比项 | `arguments` | rest 参数 |
| --- | --- | --- |
| 所属 | 普通函数自带 | 显式声明 |
| 类型 | 类数组对象 | 真数组 |
| 数组方法 | 需转换 | 可直接用 |
| 可读性 | 参数含义不明显 | 参数意图明确 |
| 箭头函数支持 | 没有自己的 | 支持 |

## 实战应用举例

```js
const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0)

console.log(sum(1, 2, 3)) // 6
```

`numbers` 是真正的数组，所以可以直接调用 `reduce`。

```js
const request = (url, ...middlewares) => {
  middlewares.forEach(fn => fn())
  return fetch(url)
}
```

命名参数和 rest 参数可以组合：`url` 表示核心参数，`middlewares` 表示数量不定的附加参数。

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 箭头函数收集全部参数 | `(...args)` | 明确且是真数组 |
| 普通函数兼容旧代码 | `arguments` | 维护历史写法 |
| 需要固定参数 + 变参 | `(first, ...rest)` | 语义清楚 |
| 只取数组输入 | 直接传数组 | 不要伪装成变参 |
| TypeScript 中变参 | rest 参数 | 类型更容易标注 |

## 易错点提示

- rest 参数必须是最后一个参数。
- `(...args)` 收集的是调用时传入的剩余实参。
- 箭头函数里写 `arguments` 可能读到外层普通函数的 `arguments`，这很容易误导。
- rest 参数是真数组，不需要 `Array.from`。

## 记忆要点总结

- 箭头函数没有自己的 `arguments`。
- 变参用 `...args`。
- rest 参数是真数组。
- 不要偷读外层 `arguments`。

## 延伸问题

为什么不建议在箭头函数里读取外层 `arguments`？

参考答案：它读到的不是当前箭头函数的参数，而是外层普通函数的参数。代码一旦移动位置，含义就变，维护风险高。

## 可能类似的问题及简要参考答案

问：rest 参数和扩展运算符是同一个东西吗？

答：语法都是 `...`，但位置不同。函数参数位置是 rest，负责收集；调用或数组/对象字面量位置是 spread，负责展开。

问：`arguments` 能直接 `map` 吗？

答：不能。它是类数组对象，不是真数组；需要 `Array.from(arguments)`，或直接使用 rest 参数。

## 辅助记忆总结

记成一句话：箭头函数要变参，别找 `arguments`，直接写 `...args`。
