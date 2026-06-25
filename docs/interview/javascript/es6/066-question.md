# 066. [中级]** 解构赋值在函数参数中的应用

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

函数参数解构的核心不是"把对象拆开"，而是用命名参数模式替代位置参数，使函数调用自带文档性，同时在签名层面完成默认值、可选参数和结构校验。

一句话答法：函数参数解构让调用方用对象传参、函数签名直接声明需要哪些字段和默认值，解决了多参数函数"参数顺序难记、可选参数难处理"的问题。

## 问题意图

这道题主要考察三件事：

1. 是否理解命名参数模式（options object pattern）及其相比位置参数的优势。
2. 是否掌握解构默认值在函数签名中的写法和生效时机（仅 `undefined` 触发）。
3. 是否知道必传参数校验、嵌套解构、rest 收集等工程实践技巧。

## 考察范围

- 对象参数解构的基本语法和命名参数模式。
- 解构参数的默认值设置及 `= {}` 防御性写法。
- 嵌套参数解构及其可读性边界。
- 利用参数默认值实现必传参数校验（`requiredParam()` 技巧）。
- 解构与 rest 参数的结合使用。
- 解构参数不会修改原始对象（浅拷贝语义）。

## 技术错误纠正

- 解构默认值只在值为 `undefined` 时生效；传入 `null` 不会触发默认值，因为 `null` 是一个明确的值。
- `function f({ a } = {})` 和 `function f({ a })` 不同：后者在不传参时会报 `TypeError`（无法对 `undefined` 解构）。
- 嵌套解构 `{ a: { b } }` 如果中间层 `a` 为 `undefined`，同样会抛错，需要在对应层级加 `= {}` 防御。

## 知识点系统梳理

### 命名参数模式

位置参数在超过 2-3 个时，调用方很难记住顺序：

```js
// 位置参数：调用方看不出每个值的含义
createUser('Alice', 25, true, 'admin')

// 命名参数：字段名即文档
createUser({ name: 'Alice', age: 25, active: true, role: 'admin' })
```

在函数签名中直接解构，就省去了手动从 options 对象取值：

```js
function createUser({ name, age, active = true, role = 'user' }) {
  return { name, age, active, role }
}
```

### 默认值的写法和生效时机

```js
function request({ url, method = 'GET', timeout = 5000 }) {
  console.log(method, url, timeout)
}

request({ url: '/api' })            // 'GET' '/api' 5000
request({ url: '/api', method: undefined }) // 'GET' — undefined 触发默认值
request({ url: '/api', method: null })      // null — null 不触发默认值
```

关键区别：默认值只在 `undefined` 时生效，`null` 被视为有效值。

### 整体参数默认值 `= {}`

```js
// 不加 = {}：不传参时报错
function bad({ a, b }) {}
bad() // TypeError: Cannot destructure property 'a' of undefined

// 加 = {}：不传参安全
function good({ a = 1, b = 2 } = {}) {}
good()   // a=1, b=2
good({}) // a=1, b=2
```

### 必传参数校验技巧

```js
function required(name) {
  throw new Error(`Missing required parameter: ${name}`)
}

function createOrder({
  productId = required('productId'),
  quantity = required('quantity'),
  discount = 0,
} = {}) {
  return { productId, quantity, discount }
}

createOrder({ productId: 'A1' })
// Error: Missing required parameter: quantity
```

原理：参数为 `undefined` 时求值默认表达式，`required()` 被执行并抛错。

### 嵌套解构

```js
function renderCard({
  user: { name, avatar },
  settings: { theme = 'light', lang = 'zh' } = {},
}) {
  return `${name} [${theme}] [${lang}]`
}

renderCard({ user: { name: 'Bob', avatar: 'b.png' } })
// 'Bob [light] [zh]' — settings 未传，= {} 兜底
```

注意：嵌套超过两层时可读性急剧下降，建议在函数体内手动取值。

### 解构 + rest 收集

```js
function processConfig({ debug, verbose, ...rest }) {
  if (debug) console.log('Debug mode')
  // rest 包含除 debug、verbose 外的所有属性
  return rest
}

processConfig({ debug: true, host: 'localhost', port: 3000 })
// rest = { host: 'localhost', port: 3000 }
```

常用于从 props/options 中分离已知字段，将剩余字段透传。

## 实战应用举例

### 示例 1：API 请求函数

这个例子展示命名参数模式在多可选参数场景的优势，以及默认值和必传校验的配合。

```js
function required(name) {
  throw new Error(`Missing: ${name}`)
}

async function apiRequest({
  url = required('url'),
  method = 'GET',
  headers = {},
  body = null,
  timeout = 5000,
} = {}) {
  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  }
  if (body) config.body = JSON.stringify(body)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { ...config, signal: controller.signal })
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

// 调用
apiRequest({ url: '/api/users', method: 'POST', body: { name: 'Alice' } })
// 只传需要的字段，其余走默认值

apiRequest() // Error: Missing: url
```

边界说明：

- `url` 用 `required()` 强制必传，其余参数全部可选。
- `headers` 默认值是 `{}` 而不是 `null`，保证展开运算符安全。
- `= {}` 在最外层兜底，使 `apiRequest()` 不报解构错误（而是报 required 错误，语义更清晰）。

### 示例 2：rest 分离 + 透传

```js
function Button({ onClick, disabled = false, children, ...attrs }) {
  // attrs 收集 id、className、data-* 等未显式列出的属性
  return { tag: 'button', props: { onClick, disabled, ...attrs }, children }
}

Button({ onClick: () => {}, children: 'OK', id: 'btn', className: 'primary' })
// attrs = { id: 'btn', className: 'primary' }
```

边界说明：

- rest 只收集"自己的可枚举属性"，不包含原型链上的属性。
- 解构是浅拷贝：如果 `attrs` 中的值是对象，修改它会影响原始对象。

## 使用场景说明和对比

| 场景 | 推荐写法 | 原因 |
| --- | --- | --- |
| 参数 ≤ 2 个且含义明确 | 位置参数 `(a, b)` | 简单直接，不需要额外对象 |
| 参数 ≥ 3 个或多个可选 | 对象解构 `({ a, b, c })` | 调用方不用记顺序，可选参数自然 |
| 需要透传剩余属性 | 解构 + rest `({ known, ...rest })` | 分离关注点，剩余安全透传 |
| 配置/选项对象 | 解构 + 默认值 + `= {}` | 每个选项独立默认，整体可不传 |
| 坐标、范围等固定结构 | 数组解构 `([x, y])` | 顺序固定、语义清晰时更紧凑 |
| 嵌套超过两层的复杂对象 | 函数体内手动取值 | 签名嵌套太深可读性差 |

## 易错点提示

- **忘加 `= {}`**：`function f({ a })` 在不传参时报 `TypeError`，加 `= {}` 才安全。
- **`null` 不触发默认值**：`f({ x: null })` 中 `x` 是 `null` 而非默认值；只有 `undefined` 触发。
- **嵌套解构缺少中间层防御**：`{ a: { b } }` 如果 `a` 是 `undefined` 会抛错，需要 `{ a: { b } = {} }`。
- **解构赋值是浅拷贝**：解构出来的引用类型属性和原对象指向同一个引用，修改会互相影响。
- **rest 对象不包含原型属性**：`...rest` 只收集 own enumerable properties。
- **参数重命名易混淆**：`{ name: userName }` 中 `name` 是源属性名，`userName` 才是本地变量名，写反会报错。

## 记忆要点总结

- 参数多于 2 个就用对象解构，调用自带文档性。
- `= {}` 加在参数末尾，不传参也不报错。
- 默认值只对 `undefined` 生效，`null` 不触发。
- `required()` 默认值技巧可在签名层面强制必传。
- rest 参数配合解构实现"取已知、透传未知"。
- 嵌套解构不超过两层，超过就在函数体内取。

## 延伸问题

1. 解构参数的默认值表达式何时求值？每次调用都会重新求值吗？
2. `function f({ a } = {})` 和 `function f({ a = 1 })` 在不传参时行为有什么区别？
3. TypeScript 中解构参数如何标注类型？和 JavaScript 的默认值写法如何配合？
4. 解构参数对函数的 `length` 属性有什么影响？
5. 在 Vue 3 的 `defineProps` 解构中为什么需要特殊处理响应性？

## 可能类似的问题及简要参考答案

**Q：函数参数默认值和解构默认值有什么区别？**
A：函数参数默认值是 `function f(x = 1)` 的整体参数默认值；解构默认值是 `{ a = 1 }` 中单个属性的默认值。两者可以叠加：`function f({ a = 1 } = {})` 既有属性默认值又有整体参数默认值。

**Q：如何让函数某个参数必传？**
A：利用默认值求值特性：`function required() { throw new Error('missing') }`，然后 `function f({ id = required() })` — 不传 `id` 时默认值表达式执行并抛错。

**Q：解构参数会修改原始对象吗？**
A：不会。解构是浅拷贝，基本类型值独立，但如果属性值是对象/数组，解构出的变量和原属性指向同一引用。

## 辅助记忆总结

记成一句话：函数参数解构就是"签名里写好要什么字段、给好默认值，调用时传对象不记顺序"。回答时按"命名参数模式 → 默认值时机 → `= {}` 防御 → 必传校验 → rest 透传"展开。
