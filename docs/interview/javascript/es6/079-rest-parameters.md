# 079. [中级]** 剩余参数（rest parameters）和扩展运算符的区别

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

`...` 在 JavaScript 中有两个相反的含义：出现在函数形参或解构左侧时是 rest（收集），出现在函数调用、数组/对象字面量中时是 spread（展开）。同一个语法符号，方向相反。

一句话答法：rest 把散落的值收进一个数组（或对象），spread 把一个数组（或对象）拆成散落的值。记忆口诀——左收右散。

## 问题意图

这道题主要考察三件事：

1. 是否能区分 `...` 在不同位置的语义（赋值目标 vs 值）。
2. 是否知道 rest 参数和 `arguments` 对象的差异。
3. 是否了解 spread 的浅拷贝本质和可迭代要求。

## 考察范围

- rest 在函数形参中收集剩余实参：`function f(a, ...rest) {}`。
- spread 在函数调用中展开数组：`fn(...arr)`。
- rest 在解构赋值中收集剩余元素：`const [a, ...rest] = arr`。
- spread 在数组/对象字面量中展开：`[...arr]`、`{ ...obj }`。
- rest 参数与 `arguments` 对象的区别。
- spread 创建的是浅拷贝。

## 技术错误纠正

- rest 参数得到的是真正的 `Array`，可以直接调用 `map`、`filter` 等方法；`arguments` 是类数组对象，不能直接调用数组方法。
- spread 展开对象时只复制自有可枚举属性，且是浅拷贝；嵌套对象仍然共享引用。
- rest 参数必须是形参列表的最后一个，`function f(...a, b) {}` 是语法错误。

## 知识点系统梳理

### 核心对比

| 对比维度 | Rest `...` | Spread `...` |
| --- | --- | --- |
| 方向 | 收集（多 → 一） | 展开（一 → 多） |
| 出现位置 | 函数形参、解构赋值左侧 | 函数调用、数组/对象字面量 |
| 结果类型 | 始终是数组（形参 rest）或对象（对象解构 rest） | 取决于展开目标上下文 |
| 与 `arguments` | rest 是真数组，箭头函数中可用 | 无关 |
| 位置约束 | 必须在最后 | 任意位置 |
| 拷贝深度 | 不涉及拷贝，只是收集引用 | 浅拷贝 |

### Rest 参数

```js
// 函数形参：收集剩余实参
function log(level, ...messages) {
  // messages 是真正的 Array
  console.log(`[${level}]`, messages.join(' '))
}

// 解构赋值：收集剩余元素
const [head, ...tail] = [1, 2, 3, 4]
// head = 1, tail = [2, 3, 4]

const { id, ...attrs } = { id: 1, name: 'a', age: 20 }
// id = 1, attrs = { name: 'a', age: 20 }
```

### Spread 运算符

```js
// 函数调用：展开数组为参数
Math.max(...[3, 1, 4])  // 4

// 数组字面量：合并、复制
const merged = [...arr1, ...arr2]

// 对象字面量：合并、覆盖
const updated = { ...user, age: 26 }
```

### Rest vs arguments

| 对比项 | Rest 参数 | `arguments` |
| --- | --- | --- |
| 类型 | `Array` | 类数组对象 |
| 箭头函数中 | 可用 | 不存在 |
| 只收集部分参数 | 可以（前面放命名参数） | 不行，包含全部实参 |
| `length` 影响 | rest 不计入 `function.length` | 无关 |

## 实战应用举例

### 示例 1：rest 收集 + spread 转发

这个例子展示同一个函数中 rest 和 spread 协作：收集参数、处理后再展开传给下游。

```js
function withTiming(fn, ...args) {
  const start = performance.now()
  const result = fn(...args)   // spread 展开传给原函数
  console.log(`${fn.name}: ${(performance.now() - start).toFixed(2)}ms`)
  return result
}

// 使用
withTiming(Math.max, 3, 1, 4, 1, 5)
// 输出: "max: 0.01ms"，返回 5
```

边界：如果 `fn` 是异步函数，需要 `await fn(...args)` 才能正确计时。

### 示例 2：对象解构 rest + spread 合并

```js
function updateUser(user, updates) {
  const { password, ...safeUpdates } = updates  // rest：剥离敏感字段
  return { ...user, ...safeUpdates }             // spread：合并
}

const user = { id: 1, name: 'Alice', role: 'user' }
updateUser(user, { name: 'Bob', password: '123', role: 'admin' })
// { id: 1, name: 'Bob', role: 'admin' }
// password 被 rest 解构丢弃，不会进入结果
```

注意：spread 合并是浅拷贝，嵌套对象的修改会影响原对象。

## 使用场景说明和对比

| 场景 | 用 Rest 还是 Spread | 说明 |
| --- | --- | --- |
| 可变参数函数 | Rest | `function sum(...nums)` 收集任意数量参数 |
| 数组/对象浅拷贝 | Spread | `[...arr]`、`{ ...obj }` |
| 函数参数转发 | 两者配合 | rest 收集，spread 展开传给下游 |
| 解构时提取剩余部分 | Rest | `const { id, ...rest } = obj` |
| 合并多个数组/对象 | Spread | `[...a, ...b]`、`{ ...a, ...b }` |
| 替代 `arguments` | Rest | 箭头函数中唯一选择 |

## 易错点提示

- rest 必须是最后一个参数：`function f(a, ...b, c) {}` 语法错误。
- spread 展开非可迭代值会报错：`...(123)` → `TypeError`；展开 `null`/`undefined` 在数组中报错，在对象中安静跳过。
- 箭头函数没有 `arguments`，必须用 rest：`const f = (...args) => args`。
- spread 只做浅拷贝：`{ ...obj }` 中嵌套的对象仍是同一引用。
- 对象 spread 遇到同名属性时后面覆盖前面：`{ ...a, ...b }` 中 `b` 的属性优先。
- rest 参数不计入 `function.length`：`((a, ...b) => {}).length === 1`。

## 记忆要点总结

- `...` 在赋值目标侧（形参、解构左侧）= rest = 收集。
- `...` 在值侧（调用、字面量）= spread = 展开。
- rest 得到真数组，替代 `arguments`。
- spread 是浅拷贝，嵌套引用共享。
- rest 必须在最后，spread 位置任意。

## 延伸问题

1. rest 参数为什么不计入 `function.length`？
2. `Object.assign()` 和对象 spread 有什么区别？
3. spread 展开字符串 `[...'abc']` 的结果是什么？为什么？
4. 如何用 rest + spread 实现一个简单的函数柯里化？
5. TypeScript 中 rest 参数的类型标注怎么写？

## 可能类似的问题及简要参考答案

**Q：rest 参数和 `arguments` 有什么区别？**  
A：rest 是真数组、可以只收集部分参数、箭头函数可用；`arguments` 是类数组、包含所有实参、箭头函数中不存在。

**Q：spread 运算符是深拷贝吗？**  
A：不是。`{ ...obj }` 和 `[...arr]` 都是浅拷贝，嵌套的引用类型仍然共享同一对象。

**Q：`...` 在哪些地方可以使用？**  
A：函数形参（rest）、函数调用（spread）、数组字面量（spread）、对象字面量（spread）、解构赋值左侧（rest）。

## 辅助记忆总结

记成一句话：`...` 在左边是 rest 收集，在右边是 spread 展开；方向相反，语法相同。
