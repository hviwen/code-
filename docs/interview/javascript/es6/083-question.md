# 083. [高级]** 如何使用参数默认值实现必需参数检查？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

ES6 参数默认值在参数为 `undefined` 时才会求值。利用这一点，可以将默认值设为一个抛出错误的函数调用：调用者如果漏传参数，函数会立即抛出明确的错误，而不是在函数体内拿到 `undefined` 后产生隐蔽 bug。

一句话答法：定义 `const required = () => { throw new Error('Missing required parameter') }`，把它作为参数默认值，漏传时自动抛错。

## 问题意图

这道题考察三件事：

1. 是否理解默认值的求值时机——只在参数为 `undefined` 时。
2. 是否能写出 `required()` 辅助函数并作为默认值使用。
3. 是否知道 `null` 不触发默认值、默认值表达式可以引用前面参数等边界。

## 考察范围

- 参数默认值的求值时机（`undefined` 触发，`null` 不触发）。
- 默认值可以是任意表达式，包括函数调用。
- `required()` 辅助函数的实现模式。
- 默认值表达式中可以引用前面的参数。
- 与传统 `if (!param)` 检查的对比。
- 与 TypeScript 类型检查的区别（编译时 vs 运行时）。

## 技术错误纠正

- 原答案提到"可以使用 TypeScript"——这是 JavaScript 运行时技巧题，TypeScript 类型检查是编译时行为，不等价。
- `null` 不会触发默认值。`createUser(null)` 不会抛错，`name` 会是 `null`。

## 知识点系统梳理

### 核心实现

```js
const required = (name) => {
  throw new Error(`Missing required parameter: ${name}`)
}

function createUser(
  name = required('name'),
  email = required('email'),
  role = 'user'   // 可选参数，有默认值
) {
  return { name, email, role }
}

createUser('Alice', 'alice@test.com')      // ✅ { name: 'Alice', email: 'alice@test.com', role: 'user' }
createUser('Alice')                         // ❌ Error: Missing required parameter: email
createUser()                                // ❌ Error: Missing required parameter: name
```

### 求值时机

```js
function demo(a = required('a'), b = required('b')) {
  return [a, b]
}

demo(1, 2)          // ✅ [1, 2]
demo(1)             // ❌ 抛错——b 未传，默认值求值
demo(undefined, 2)  // ❌ 抛错——a 为 undefined，触发默认值
demo(null, 2)       // ✅ [null, 2] —— null 不是 undefined，不触发默认值
demo(0, '')         // ✅ [0, ''] —— 0 和 '' 不是 undefined，不触发
```

### 默认值可以引用前面的参数

```js
function createRange(
  start = required('start'),
  end = required('end'),
  step = end > start ? 1 : -1  // 默认值引用前面的 start 和 end
) {
  return { start, end, step }
}

createRange(1, 10)   // { start: 1, end: 10, step: 1 }
createRange(10, 1)   // { start: 10, end: 1, step: -1 }
```

## 实战应用举例

### 示例 1：API 请求函数的参数校验

这个例子证明：必需参数检查在函数签名层面完成，不需要在函数体里写 if 判断。

```js
const required = (name) => { throw new Error(`Missing: ${name}`) }

function fetchData(
  url = required('url'),
  method = 'GET',
  timeout = 5000
) {
  console.log(`${method} ${url} (timeout: ${timeout}ms)`)
  return fetch(url, { method, signal: AbortSignal.timeout(timeout) })
}

fetchData('/api/users')              // ✅ GET /api/users (timeout: 5000ms)
fetchData('/api/users', 'POST')      // ✅ POST /api/users (timeout: 5000ms)
fetchData()                           // ❌ Error: Missing: url
```

边界说明：
- `method` 和 `timeout` 是可选参数，有合理默认值。
- 如果 `url` 也可能传 `null`（从变量来），这种方式不会拦截，需要额外在函数体内检查。

### 示例 2：与传统检查方式的对比

```js
// 传统方式——冗长且错误信息不明确
function createUserOld(name, email) {
  if (!name) throw new Error('name is required')
  if (!email) throw new Error('email is required')
  return { name, email }
}
// 问题：!name 会误拦截 name = '' 或 name = 0

// 默认值方式——简洁且语义明确
function createUserNew(
  name = required('name'),
  email = required('email')
) {
  return { name, email }
}
// 优点：签名即文档，一眼看出哪些参数必需
```

## 使用场景说明和对比

| 方案 | 检查时机 | 优点 | 缺点 |
| --- | --- | --- | --- |
| 默认值 `required()` | 函数调用时（运行时） | 签名即文档，代码简洁 | 不拦截 `null`，只拦截 `undefined` |
| 函数体内 `if (!param)` | 函数体内（运行时） | 可检查任意条件 | 冗长，`!param` 可能误判 falsy 值 |
| TypeScript 必需参数 | 编译时 | 编译期发现问题 | 不提供运行时保护 |
| JSDoc `@param {string} name` | 编辑器提示 | 零运行时开销 | 不强制，容易被忽略 |

## 易错点提示

- `null` 不触发默认值。`fn(null)` 中参数为 `null` 而非 `undefined`，不会调用 `required()`。
- 默认值表达式在每次调用时求值，不是只求值一次。如果默认值是 `Date.now()`，每次调用得到不同值。
- 默认值表达式有自己的作用域，不能引用函数体内的变量，只能引用前面的参数和外部作用域。
- 解构参数中也能用 `required()`：`function f({ name = required('name') } = {}) {}`。

## 记忆要点总结

- 默认值只在参数为 `undefined` 时求值，`null`/`0`/`''` 不触发。
- `const required = (name) => { throw new Error(...) }` 一行搞定。
- 签名即文档：看函数签名就知道哪些参数必需。
- 每次调用都重新求值默认值表达式。
- 需要拦截 `null` 时，仍然要在函数体内额外检查。

## 延伸问题

1. 如果用 `required()` 但传入 `null`，会发生什么？如何处理？
2. 默认值表达式中可以引用后面的参数吗？为什么？
3. 解构参数中如何使用 `required()` 模式？
4. 这种模式和 TypeScript 的必需参数有什么本质区别？

## 可能类似的问题及简要参考答案

**Q：参数默认值什么时候会被使用？**
A：当参数为 `undefined` 时（包括未传参和显式传 `undefined`），`null` 不触发。

**Q：默认值可以是函数调用吗？**
A：可以。默认值可以是任意表达式，包括函数调用、三元表达式，甚至引用前面的参数。

**Q：如何在 JavaScript 中实现必需参数？**
A：将 `() => { throw new Error('...') }` 的调用结果作为参数默认值，漏传时自动抛错。

**Q：默认值表达式是编译时还是运行时求值？**
A：运行时。每次函数调用时，如果对应参数为 `undefined`，就重新求值默认值表达式。

## 辅助记忆总结

记成一句话：把"抛错函数的调用"写成默认值，漏传参数时 JS 引擎替你抛错。
