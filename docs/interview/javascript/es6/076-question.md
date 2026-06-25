# 076. [高级]** 如何实现一个简单的模板字符串处理函数？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

实现模板字符串处理函数的核心是把 `${expr}` 或 `{{key}}` 占位符替换为实际值。两条主流路径：正则替换（安全、简单）和 `new Function` 求值（强大、危险）。面试要的是你对两条路径的取舍判断，而不是写一个完整模板引擎。

一句话答法：最简实现是 `str.replace(/\$\{(.+?)\}/g, (_, k) => data[k] ?? '')`；需要表达式求值就用 `new Function`，但必须说清 XSS 风险。

## 问题意图

这道题主要考察三件事：

1. 能否用正则写出基本的占位符替换，并处理变量缺失等边界。
2. 是否知道 `new Function` / `eval` 方案的能力和安全代价。
3. 是否了解标签模板函数（tagged template）这条原生路径。

## 考察范围

- 正则 `replace` 方案：匹配 `${key}` 或 `{{key}}`，从数据对象取值。
- `new Function` 求值方案：支持表达式，但引入代码注入风险。
- 标签模板函数（tag function）：原生机制，`strings` + `values` 拆分。
- 嵌套属性访问：`a.b.c` 路径解析。
- 安全边界：XSS、任意代码执行、不可信输入。
- 与原生模板字面量的区别：原生在定义时求值，自定义函数在调用时求值。

## 技术错误纠正

1. `data[key] !== 'undefined'` 是常见笔误，应为 `data[key] !== undefined` 或 `typeof data[key] !== 'undefined'`；前者比较的是字符串 `"undefined"`。
2. `new Function('data', 'with(data) { return ... }')` 在严格模式下 `with` 会报错；面试中用这个写法要主动说明限制。
3. 正则 `\w+` 只匹配单层 key；要支持 `user.name` 需要改为 `[\w.]+`。

## 知识点系统梳理

### 方案一：正则替换（推荐默认方案）

```js
function template(str, data) {
  return str.replace(/\$\{(.+?)\}/g, (_, key) => {
    const val = key.split('.').reduce((o, k) => o?.[k], data)
    return val ?? ''
  })
}
```

特点：安全、无代码执行、支持嵌套路径（加 `split('.')`）、不支持表达式。

### 方案二：`new Function` 求值

```js
function templateEval(str, data) {
  const keys = Object.keys(data)
  const vals = Object.values(data)
  // 把 ${expr} 原样保留，用反引号包裹交给 Function 求值
  const body = 'return `' + str + '`'
  return new Function(...keys, body)(...vals)
}

templateEval('${name.toUpperCase()} is ${age + 1}', { name: 'alice', age: 25 })
// → "ALICE is 26"
```

特点：支持任意表达式，但等同于 `eval`，**绝不能用在用户可控的模板字符串上**。

### 方案三：标签模板函数

```js
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) =>
    result + str + (i < values.length ? `<mark>${values[i]}</mark>` : ''), '')
}

const name = 'Alice'
highlight`Hello ${name}!` // → "Hello <mark>Alice</mark>!"
```

特点：原生语法，编译期就拆好 `strings` 和 `values`，适合 HTML 转义、国际化、CSS-in-JS 等场景。

### 三种方案对比

| 对比项 | 正则替换 | `new Function` 求值 | 标签模板函数 |
| --- | --- | --- | --- |
| 安全性 | 高（无代码执行） | 低（等同 eval） | 高 |
| 表达式支持 | 不支持 | 完整支持 | 原生支持 |
| 嵌套属性 | 需手动实现路径解析 | 自动支持 | 自动支持 |
| 使用场景 | 后端模板、邮件、配置 | 受信环境、构建工具 | HTML 转义、i18n、styled |
| 模板来源 | 运行时字符串 | 运行时字符串 | 源码中的模板字面量 |

## 实战应用举例

### 示例 1：安全的正则替换（处理缺失变量和嵌套路径）

```js
function template(str, data) {
  return str.replace(/\$\{(.+?)\}/g, (match, key) => {
    const val = key.trim().split('.').reduce((o, k) => o?.[k], data)
    return val !== undefined ? val : match // 缺失变量保留原始占位符
  })
}

// 正常替换
template('Hello ${name}, age ${age}', { name: 'Bob', age: 30 })
// → "Hello Bob, age 30"

// 嵌套属性
template('Email: ${user.contact.email}', { user: { contact: { email: 'a@b.com' } } })
// → "Email: a@b.com"

// 缺失变量：保留占位符，不会静默吞掉
template('Hi ${name}, ${missing}', { name: 'Bob' })
// → "Hi Bob, ${missing}"

// 空数据：不崩溃
template('${a.b.c}', {})
// → "${a.b.c}"
```

取舍说明：用 `?.` 可选链解析路径，缺失时返回原始占位符而非空字符串，便于调试。不支持 `${x + 1}` 这类表达式——面试时要主动说明这是设计选择，不是遗漏。

### 示例 2：标签模板实现 HTML 转义

```js
function safeHtml(strings, ...values) {
  const escape = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  return strings.reduce((out, str, i) =>
    out + str + (i < values.length ? escape(values[i]) : ''), '')
}

const userInput = '<script>alert("xss")</script>'
safeHtml`<div>${userInput}</div>`
// → "<div>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</div>"
```

边界说明：标签函数天然拆分静态片段和动态值，只对动态值转义，不会误伤模板本身的 HTML。这正是 `lit-html` 等库的核心思路。

## 使用场景说明和对比

| 场景 | 推荐方案 | 原因 |
| --- | --- | --- |
| 邮件/通知模板，变量来自后端 | 正则替换 | 安全、简单、无需表达式 |
| 构建工具 / CLI 的代码生成 | `new Function` | 受信环境，需要表达式能力 |
| 前端 HTML 拼接，插值含用户输入 | 标签模板 + 转义 | 天然隔离静态片段与动态值 |
| CSS-in-JS（styled-components） | 标签模板 | 原生语法，编译期可优化 |
| i18n 国际化翻译占位 | 正则替换 | 翻译文本是运行时字符串，不是源码模板 |
| 用户自定义模板（CMS、低代码） | 正则替换 + 白名单 key | 绝不能用 eval 类方案 |

## 易错点提示

1. **`new Function` / `eval` 是 XSS 入口**：模板内容来自用户输入时，`new Function('with(data){return ' + expr + '}')` 可以执行任意代码。面试必须主动提及。
2. **正则 `(.+?)` vs `(\w+)`**：`\w+` 不匹配 `.`，无法支持嵌套路径；`.+?` 更灵活但要注意贪婪匹配边界。
3. **`with` 在严格模式下报错**：ES module 默认严格模式，`with(data)` 不可用；要改用解构参数传入。
4. **缺失变量的处理策略不一致**：返回空字符串、保留占位符、抛错——面试时要说明你的选择和理由。
5. **正则不处理嵌套 `${}`**：`${obj[arr[0]]}` 这类嵌套表达式无法用简单正则匹配，需要状态机或 AST 解析。
6. **模板缓存**：高频调用时每次 `new Function` 都会编译，应缓存已编译的函数。

## 记忆要点总结

1. 最简实现 = `str.replace(/\$\{(.+?)\}/g, (_, k) => data[k])`。
2. 嵌套路径用 `key.split('.').reduce((o, k) => o?.[k], data)` 解析。
3. `new Function` 支持表达式但等同 eval，只能用在受信模板上。
4. 标签模板函数是原生方案，`strings` + `values` 天然分离，适合 HTML 转义和 DSL。
5. 面试答题顺序：正则方案 → 说局限 → 提 `new Function` → 说风险 → 提标签模板。

## 延伸问题

1. 如何让正则替换方案支持管道过滤器（如 `${name | uppercase}`）？
2. `new Function` 和 `eval` 的区别是什么？哪个更安全？
3. 标签模板函数的 `strings.raw` 属性有什么用途？
4. 如何实现模板的预编译（compile 一次，render 多次）以提升性能？
5. Vue / React 的模板编译和这里的模板字符串处理有什么本质区别？

## 可能类似的问题及简要参考答案

**Q：如何实现一个 `render(template, data)` 函数？**
A：用 `template.replace(/\$\{(.+?)\}/g, (_, key) => data[key] ?? '')` 做基础变量替换；需要嵌套路径就加 `split('.').reduce`。不要用 `eval`，除非模板完全受信。

**Q：标签模板字符串和普通模板字符串有什么区别？**
A：普通模板字符串直接求值拼接；标签模板把静态片段数组和动态值分别传给函数，由函数决定如何拼接，常用于 HTML 转义、SQL 防注入、国际化。

**Q：为什么不直接用 eval 实现模板引擎？**
A：`eval` 在当前作用域执行任意代码，模板内容含恶意输入时会导致 XSS 或数据泄露。即使用 `new Function` 隔离了作用域，仍可通过 `constructor` 链访问全局对象。生产环境应优先用正则替换或成熟模板库。

## 辅助记忆总结

简单模板处理 = 正则替换变量；要表达式就 `new Function`（但必须说风险）；原生方案是标签模板函数。面试按"正则 → Function → tag function"三级递进回答。
