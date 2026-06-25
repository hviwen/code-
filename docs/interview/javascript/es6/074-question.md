# 074. [中级]** 如何在模板字符串中执行函数？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

`${}` 里可以放任何 JavaScript **表达式**，函数调用就是表达式，所以直接写 `${fn()}` 即可。返回值会被隐式转为字符串（调用 `toString()`）。

一句话答法：`${}` 接受任意表达式——函数调用、方法链、三元、嵌套模板都行，结果自动 `toString()`。

## 问题意图

这道题主要考察三件事：

1. 是否理解 `${}` 接受的是**表达式**而非语句，能划清边界。
2. 是否知道返回值会被隐式字符串化，以及 `undefined`、对象、Promise 等非预期类型的表现。
3. 是否能在实际项目中合理使用函数插值而不滥用。

## 考察范围

- 表达式 vs 语句：`${}` 只接受表达式，不能写 `if`/`for`/`switch`。
- 函数调用：`${fn()}`、`${obj.method()}`、`${arr.map(...).join(...)}`。
- 方法链：`${'hello'.toUpperCase().slice(0, 3)}`。
- 三元/条件表达式：`${x > 0 ? 'positive' : 'non-positive'}`。
- 嵌套模板字符串：`` ${`inner ${value}`} ``。
- 返回值的 `toString()` 强制转换规则。

## 技术错误纠正

- 原始材料 `Math.max(arr)` 应为 `Math.max(...arr)`，数组需展开。
- `${}` 中调用 `async` 函数不会得到结果值，而是得到 `[object Promise]`，原材料未提及。

## 知识点系统梳理

### `${}` 接受的内容

`${}` 里可以写任何能求值的表达式：

| 类型 | 示例 | 结果 |
| --- | --- | --- |
| 变量 | `${name}` | 变量值 |
| 函数调用 | `${fn()}` | 函数返回值 |
| 方法链 | `${'hi'.toUpperCase()}` | `'HI'` |
| 三元表达式 | `${x ? 'yes' : 'no'}` | 条件结果 |
| 嵌套模板 | `` ${`${a}+${b}`} `` | 内层模板求值结果 |
| 逗号表达式 | `${(a++, a)}` | 最后一个子表达式的值 |

**不能写的**：`if`、`for`、`while`、`switch`、变量声明（`let x = 1`）。需要复杂逻辑时用 IIFE 包一层。

### 返回值的字符串化

`${}` 的值最终通过 `String()` 转换（等效调用 `toString()` / `Symbol.toPrimitive`）：

```js
`${undefined}`   // 'undefined'
`${null}`        // 'null'
`${[1, 2, 3]}`  // '1,2,3'（Array.prototype.toString）
`${{ a: 1 }}`   // '[object Object]'
`${async () => 1}` // 函数源码字符串（未调用）
```

### 常见调用模式

```js
// 1. 直接调用
const greet = name => `Hello, ${name.toUpperCase()}!`

// 2. 带参数
`Max: ${Math.max(...[5, 2, 8])}`  // 'Max: 8'

// 3. 方法链
`${'hello world'.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}`
// 'Hello World'

// 4. 三元条件
`Status: ${score >= 60 ? 'Pass' : 'Fail'}`

// 5. 嵌套模板
`${items.length > 0 ? `Found ${items.length} items` : 'Empty'}`

// 6. IIFE（需要语句时的逃生舱）
`Result: ${(() => {
  const temp = [1, 2, 3].filter(n => n > 1)
  return temp.join(', ')
})()}`
```

## 实战应用举例

### 示例 1：格式化用户信息

用函数调用完成模板内格式化，展示典型用法和边界。

```js
const fmt = (n, d = 2) => n.toFixed(d)
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

const user = { name: 'john', balance: 1234.5, role: 'admin' }

const info = `${cap(user.name)} | ¥${fmt(user.balance)} | ${user.role === 'admin' ? '管理员' : '普通用户'}`
// 'John | ¥1234.50 | 管理员'
```

边界：`user.name` 为 `undefined` 时 `cap()` 会抛错，调用方需保证入参有效。

### 示例 2：动态生成 HTML 片段

```js
const items = ['Apple', 'Banana', 'Cherry']

const html = `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`
// '<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>'
```

边界：`item` 含 `<script>` 等 HTML 会导致 XSS，生产代码需转义。

## 使用场景说明和对比

| 场景 | 推荐写法 | 原因 |
| --- | --- | --- |
| 简单格式化（日期、货币） | `${formatDate(d)}` | 可读、复用 |
| 条件文案 | `${x ? 'A' : 'B'}` | 一行搞定，不需要额外变量 |
| 数组拼接 | `${arr.join(', ')}` | 比手动循环拼接简洁 |
| 多行复杂逻辑 | 先算好变量，再放进模板 | `${}` 内塞太多逻辑可读性差 |
| 需要 `if/for` 语句 | 提取到外部函数或用 IIFE | `${}` 不支持语句 |
| 异步结果 | 先 `await`，再用模板 | 直接 `${asyncFn()}` 得到的是 Promise 对象 |

## 易错点提示

1. **语句不能写在 `${}` 里**：`${if (x) 'a'}` 语法错误。需要条件用三元，需要循环用 `map`/`join`。
2. **async 函数返回 Promise 而非值**：`${await fetchName()}` 只有在 `async` 函数内才有效；不加 `await` 会得到 `[object Promise]`。
3. **对象插值得到 `[object Object]`**：忘记 `JSON.stringify()` 或取具体属性是常见错误。
4. **副作用隐患**：`${counter++}` 合法但不推荐——模板字符串的插值不应该产生副作用，否则代码意图不清晰。
5. **XSS 风险**：在 `innerHTML` 中用模板拼接用户输入时，`${}` 不会自动转义 HTML。

## 记忆要点总结

- `${}` = 任何表达式，**不是**任何代码。
- 返回值自动 `toString()`：注意 `undefined`、对象、Promise 的意外结果。
- 需要语句 → 提取函数或 IIFE。
- 不要在 `${}` 里搞副作用。
- 用户输入进模板 → 注意 XSS。

## 延伸问题

1. 标签模板字符串（tagged template）里的函数调用和 `${}` 插值有什么关系？
2. `${}` 中的表达式求值顺序是从左到右吗？多个 `${}` 之间有依赖时表现如何？
3. 模板字符串的性能和字符串拼接（`+`）相比有差异吗？
4. 如何在模板字符串中安全地插入 HTML（防 XSS）？
5. React JSX 的 `{}` 和模板字符串的 `${}` 在表达式限制上有什么异同？

## 可能类似的问题及简要参考答案

**Q：模板字符串的 `${}` 里能写什么？**
A：任何 JavaScript 表达式——变量、函数调用、三元、方法链、嵌套模板都行。不能写 `if`/`for` 等语句。

**Q：`${}` 里调用函数返回 `undefined` 会怎样？**
A：模板中会出现字符串 `'undefined'`，不会报错。`null` 同理变成 `'null'`。

**Q：如何在模板字符串中处理异步函数的结果？**
A：先 `const result = await asyncFn()`，再 `${result}` 插值。直接 `${asyncFn()}` 得到的是 `[object Promise]`。

## 辅助记忆总结

`${}` 是表达式槽位，不是代码块——能调用函数、能链式、能三元，但不能写语句，返回值自动转字符串。
