# 075. [中级]** 什么是标签模板字符串？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

标签模板字符串的核心不是"模板字符串的另一种写法"，而是一种函数调用语法：把模板字符串拆成静态字符串数组和动态表达式值，作为参数传给前面的函数，由函数决定最终输出。

一句话答法：`` tag`Hello ${name}` `` 等价于 `tag(["Hello ", ""], name)`，标签函数拿到拆开的静态部分和动态部分，可以对插值做转义、翻译、DSL 解析等自定义处理。

## 问题意图

这道题主要考察三件事：

1. 是否理解标签模板是函数调用，而不是字符串操作。
2. 是否清楚标签函数的参数结构：`(strings, ...values)`，以及 `strings.length === values.length + 1`。
3. 是否知道实际用途：HTML 转义防 XSS、styled-components CSS-in-JS、i18n 翻译、GraphQL `gql` 标签等。

## 考察范围

- 标签模板的调用语法和等价形式。
- 标签函数签名：`function tag(strings, ...values)`，参数拆分规则。
- `strings.raw` 属性：获取未经转义处理的原始字符串。
- 常见用例：HTML 转义、styled-components、lit-html、i18n、SQL 参数化。
- 与普通模板字符串的区别：普通模板直接拼接，标签模板经过函数处理。
- 内置标签函数 `String.raw`。

## 技术错误纠正

- 标签模板不是"函数名紧跟模板字符串"这么简单；本质是一种特殊的函数调用语法，第一个参数是带 `raw` 属性的冻结字符串数组。
- `strings` 数组的长度始终比 `values` 多 1，即使模板以插值开头或结尾，对应位置会是空字符串 `""`。
- `String.raw` 是 ES6 内置的标签函数，不需要自己实现"获取原始字符串"的功能。

## 知识点系统梳理

### 基本语法

```js
function tag(strings, ...values) {
  // strings: 静态字符串数组（冻结），带 .raw 属性
  // values: 插值表达式的求值结果
  return strings.reduce((result, str, i) =>
    result + str + (values[i] ?? ''), ''
  )
}

const name = 'World'
tag`Hello ${name}!`
// 等价于：tag(["Hello ", "!"], "World")
```

### 参数拆分规则

以 `` tag`a${1}b${2}c` `` 为例：

| 参数 | 值 |
| --- | --- |
| `strings[0]` | `"a"` |
| `strings[1]` | `"b"` |
| `strings[2]` | `"c"` |
| `values[0]` | `1` |
| `values[1]` | `2` |

规律：模板被插值表达式 `${}` 切割，`strings` 是切割后的静态片段，`values` 是每个 `${}` 的求值结果。`strings.length` 始终等于 `values.length + 1`。

### `strings.raw` — 原始字符串

`strings` 数组上有一个 `raw` 属性，保存未经转义处理的原始文本：

```js
function showRaw(strings) {
  console.log(strings[0])     // 换行符（实际换行）
  console.log(strings.raw[0]) // "\\n"（两个字符）
}

showRaw`\n`
```

ES6 内置的 `String.raw` 就是利用这个特性：

```js
String.raw`C:\Users\name`  // "C:\\Users\\name"  — 反斜杠不会被转义
```

### 普通模板 vs 标签模板

| 对比项 | 普通模板字符串 | 标签模板字符串 |
| --- | --- | --- |
| 语法 | `` `Hello ${name}` `` | `` tag`Hello ${name}` `` |
| 处理方式 | 引擎自动拼接为字符串 | 由标签函数自定义处理 |
| 返回值 | 一定是 string | 由函数决定，可以是任意类型 |
| 插值处理 | 直接 toString 后拼接 | 函数可对每个插值做转义、过滤、包装 |
| 典型场景 | 普通字符串拼接 | HTML 转义、CSS-in-JS、DSL |

## 实战应用举例

### 示例 1：HTML 转义标签，防止 XSS

这个例子说明：用户输入的内容通过标签函数自动转义，不需要手动调用转义函数。

```js
function safeHtml(strings, ...values) {
  const escape = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return strings.reduce((out, str, i) =>
    out + str + (i < values.length ? escape(values[i]) : ''), ''
  )
}

const userInput = '<script>alert("xss")</script>'
const html = safeHtml`<div>用户说：${userInput}</div>`
// "<div>用户说：&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</div>"
```

边界说明：

- 只转义插值部分（动态输入），静态模板部分由开发者控制，不需要转义。
- 这正是标签模板的设计意图：区分"可信的静态片段"和"不可信的动态值"。

### 示例 2：简易 i18n 翻译标签

```js
const dict = { 'Hello ': '你好 ', ', welcome!': '，欢迎！' }

function i18n(strings, ...values) {
  return strings.reduce((out, str, i) =>
    out + (dict[str] ?? str) + (values[i] ?? ''), ''
  )
}

const user = 'Alice'
i18n`Hello ${user}, welcome!`  // "你好 Alice，欢迎！"
```

翻译工具可以在构建期扫描所有 `i18n` 标签的静态字符串，自动生成翻译 key，而插值部分保持动态。

## 使用场景说明和对比

| 场景 | 代表库/API | 标签函数做了什么 |
| --- | --- | --- |
| HTML 转义防 XSS | 自定义 `safeHtml` | 对插值做 HTML 实体转义 |
| CSS-in-JS | styled-components | 把模板解析为 CSS 并注入样式表 |
| HTML 模板渲染 | lit-html | 把模板编译为高效 DOM 更新 |
| GraphQL 查询 | Apollo `gql` | 把模板解析为 AST 查询对象 |
| 国际化翻译 | i18n 库 | 用静态部分做翻译 key 查找 |
| 原始字符串 | `String.raw` | 保留反斜杠，不做转义 |

## 易错点提示

- `strings` 是数组不是字符串。初学者容易把第一个参数当成完整字符串处理。
- `strings.length === values.length + 1`，即使模板以 `${}` 开头，`strings[0]` 也会是空字符串 `""`。
- `strings` 数组是冻结的（`Object.isFrozen(strings) === true`），不能修改。
- `strings.raw` 和 `strings` 的区别：`raw` 保留原始转义序列，`strings` 是处理过转义的版本。
- 标签函数的返回值不一定是字符串，可以返回任意类型（React 元素、DOM 节点、AST 对象等）。
- 标签函数名和模板之间不能加括号：`` tag`...` `` 是标签调用，`tag(`...`)` 是普通函数调用。

## 记忆要点总结

- `` tag`A${x}B` `` 等价于 `tag(["A", "B"], x)`。
- 第一个参数永远是字符串数组，带 `.raw` 属性。
- `strings.length` 始终等于 `values.length + 1`。
- 核心价值：把"可信静态部分"和"不可信动态部分"分开处理。
- 返回值由函数决定，不一定是字符串。

## 延伸问题

1. `String.raw` 的实现原理是什么？如何自己写一个？
2. styled-components 的 `css` 和 `styled.div` 标签函数内部是怎么解析 CSS 的？
3. 标签模板字符串能否返回非字符串类型？有哪些实际库这样做？
4. 如果标签函数是 async 函数，返回的是什么？
5. `strings.raw` 在什么场景下和 `strings` 的值不同？

## 可能类似的问题及简要参考答案

**Q：标签模板和普通模板字符串的区别是什么？**  
A：普通模板由引擎自动拼接为字符串；标签模板把静态和动态部分拆开传给函数，由函数决定输出，可以做转义、翻译、DSL 等自定义处理。

**Q：`String.raw` 有什么用？**  
A：`String.raw` 是内置标签函数，返回模板的原始字符串（不处理 `\n`、`\t` 等转义序列），常用于正则表达式和 Windows 文件路径。

**Q：标签函数的第一个参数有什么特殊之处？**  
A：它是一个冻结的字符串数组，长度比插值数量多 1，并且带有 `.raw` 属性保存原始文本。

## 辅助记忆总结

记成一句话：标签模板是"把模板拆成静态和动态两部分交给函数处理"的特殊调用语法。回答时按"语法等价形式 → 参数结构 strings/values → 典型用例（转义/CSS/i18n）→ strings.raw"展开。
