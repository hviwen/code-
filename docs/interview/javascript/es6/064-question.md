# 064. [中级]** 对象解构赋值如何设置默认值？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

对象解构默认值的核心不是"用 `=` 写个值"，而是理解默认值只在属性值为 `undefined` 时生效，`null` 不会触发默认值。

一句话答法：`{ prop = defaultValue } = obj`，当 `obj.prop` 为 `undefined` 或不存在时使用默认值；`null`、`0`、`''`、`false` 都不触发。

## 问题意图

这道题主要考察三件事：

1. 是否知道默认值的触发条件是严格的 `=== undefined`，而不是所有 falsy 值。
2. 是否能处理嵌套解构时父级不存在导致的 `TypeError`，以及 `= {}` 兜底模式。
3. 是否了解重命名 + 默认值的组合语法 `{ a: b = val }`。

## 考察范围

- 默认值基本语法 `{ prop = val } = obj`。
- 触发条件：仅 `undefined`，`null` 不触发。
- 重命名 + 默认值组合 `{ a: newName = val }`。
- 嵌套解构的 `= {}` 兜底，防止父级属性缺失时 `TypeError`。
- 计算默认值：函数调用作为默认值，惰性求值。
- 函数参数解构中的双层默认值。

## 技术错误纠正

- 原始材料中说"属性不存在时"触发默认值，表述不精确。准确说法是：属性不存在时该属性值为 `undefined`，所以触发默认值；触发条件始终是 `=== undefined`。
- `null` 不触发默认值，这是最常见的认知错误。`null` 是一个明确赋予的值，JavaScript 不会用默认值覆盖它。

## 知识点系统梳理

### 基本语法

```js
const { name = 'Anonymous', age = 0 } = { name: 'Alice' }
// name → 'Alice'（属性存在，不用默认值）
// age → 0（属性不存在，使用默认值）
```

### 触发条件

默认值只在属性值严格等于 `undefined` 时生效：

| 属性值 | 是否触发默认值 | 结果 |
| --- | --- | --- |
| 不存在 | 是 | 使用默认值 |
| `undefined` | 是 | 使用默认值 |
| `null` | 否 | `null` |
| `0` | 否 | `0` |
| `''` | 否 | `''` |
| `false` | 否 | `false` |

```js
const { a = 1, b = 2, c = 3, d = 4 } = { a: null, b: 0, c: undefined, d: '' }
// a → null, b → 0, c → 3, d → ''
```

### 重命名 + 默认值

冒号左边是源属性名，冒号右边是新变量名，`=` 后面是默认值：

```js
const { name: userName = 'Anonymous' } = {}
// userName → 'Anonymous'
// name 不是变量，只是属性键
```

### 嵌套解构与 `= {}` 兜底

嵌套解构时，如果父级属性不存在，直接解构会抛 `TypeError`。用 `= {}` 兜底：

```js
// 危险：config.api 不存在时报错
// const { api: { timeout } } = {}  // TypeError

// 安全：= {} 兜底
const { api: { timeout = 3000 } = {} } = {}
// timeout → 3000
```

### 计算默认值（惰性求值）

默认值可以是函数调用，只在需要时执行：

```js
function getDefault() {
  console.log('computed')
  return 42
}

const { val = getDefault() } = { val: 1 }
// 不打印 'computed'，val → 1

const { val: v2 = getDefault() } = {}
// 打印 'computed'，v2 → 42
```

### 函数参数中的双层默认值

```js
function createUser({ name = 'Guest', role = 'viewer' } = {}) {
  return { name, role }
}

createUser({ name: 'Alice' })  // { name: 'Alice', role: 'viewer' }
createUser()                    // { name: 'Guest', role: 'viewer' }
```

第一层 `= {}`：整个参数缺失时兜底。第二层 `name = 'Guest'`：参数对象中属性缺失时兜底。

## 实战应用举例

### 示例 1：API 配置合并

这个例子证明：嵌套解构 + 默认值可以替代手动的 `options.timeout || 5000` 写法，并且不会把 `null` 误判为缺失。

```js
function request(options = {}) {
  const {
    url,
    method = 'GET',
    timeout = 5000,
    headers: { contentType = 'application/json', auth = null } = {},
  } = options

  return { url, method, timeout, contentType, auth }
}

request({ url: '/api/users' })
// { url: '/api/users', method: 'GET', timeout: 5000,
//   contentType: 'application/json', auth: null }

request({ url: '/api/login', method: 'POST', timeout: 0 })
// { url: '/api/login', method: 'POST', timeout: 0, ... }
// timeout → 0，不是 5000；0 不触发默认值
```

边界：`timeout: 0` 是合法值，不会被默认值覆盖。如果用 `||` 写法（`options.timeout || 5000`），`0` 会被错误替换为 `5000`。

### 示例 2：组件 props 处理（Vue/React 通用模式）

```js
function renderButton({ text = 'Submit', disabled = false, size = 'md' } = {}) {
  return `<button class="${size}" ${disabled ? 'disabled' : ''}>${text}</button>`
}

renderButton({})                    // <button class="md">Submit</button>
renderButton({ disabled: null })    // disabled → null（truthy 判断为 false，不是 false）
renderButton({ text: '', size: 'lg' })  // text → ''，不触发默认值
```

边界：`text: ''` 不触发默认值。如果业务上空字符串也要用默认文案，需要额外判断 `text || 'Submit'`，不能依赖解构默认值。

## 使用场景说明和对比

| 场景 | 是否适合解构默认值 | 原因 |
| --- | --- | --- |
| 函数 options 参数兜底 | 适合 | 清晰声明每个配置项的默认值 |
| API 响应字段缺失保护 | 适合 | 后端可能不返回某些可选字段 |
| `null` 需要当作"无值"处理 | 不适合 | `null` 不触发默认值，需用 `??` |
| 深层嵌套（3 层以上） | 谨慎 | 可读性急剧下降，考虑先提取再解构 |
| 需要校验值的类型或范围 | 不适合 | 默认值只管有无，不管值是否合法 |
| 循环内解构大量对象 | 适合 | 语法简洁，性能与手动取值无显著差异 |

## 易错点提示

- `null` 不触发默认值。`{ a = 1 } = { a: null }` 结果是 `null`，不是 `1`。
- 嵌套解构不加 `= {}` 兜底，父级缺失时直接 `TypeError`。
- `{ a: b = 1 }` 中 `a` 不是变量，`b` 才是。给 `a` 赋值会报错 `a is not defined`。
- `||` 和解构默认值的触发条件不同：`||` 对所有 falsy 值生效，解构默认值只对 `undefined` 生效。
- 计算默认值的函数有副作用时要注意：属性存在则函数不会被调用。
- 函数参数解构忘写外层 `= {}`，调用 `fn()` 时不传参会报 `TypeError`。

## 记忆要点总结

- 默认值语法：`{ prop = val } = obj`。
- 触发条件：仅 `undefined`。`null`、`0`、`''`、`false` 都不触发。
- 重命名 + 默认值：`{ old: new = val }`，冒号左边是源属性，右边是变量。
- 嵌套安全：`{ a: { b = val } = {} } = obj`，`= {}` 防 `TypeError`。
- 函数参数双层兜底：`function f({ a = 1 } = {})`，外层防不传参，内层防属性缺失。

## 延伸问题

1. 解构默认值和 `??`（空值合并）在处理 `null` 时有什么区别？
2. 嵌套解构超过几层时应该考虑重构？有什么替代方案？
3. TypeScript 中解构默认值和类型注解如何配合？
4. 解构默认值中的计算表达式会被提前求值还是惰性求值？
5. `{ a = 1 } = { a: undefined }` 和 `{ a = 1 } = {}` 的结果一样吗？为什么？

## 可能类似的问题及简要参考答案

**Q：解构默认值和 `||` 有什么区别？**
A：解构默认值只在值为 `undefined` 时生效；`||` 在所有 falsy 值（`null`、`0`、`''`、`false`、`undefined`）时生效。`{ timeout = 5000 } = { timeout: 0 }` 得到 `0`，而 `timeout || 5000` 得到 `5000`。

**Q：对象解构时如何同时重命名和设置默认值？**
A：`{ originalName: newName = defaultValue } = obj`。冒号左边是对象中的属性名，右边是本地变量名，`=` 后面是默认值。

**Q：为什么嵌套解构要写 `= {}`？**
A：嵌套解构会对父级属性的值做进一步解构。如果父级属性不存在，其值为 `undefined`，对 `undefined` 解构会抛 `TypeError`。`= {}` 提供一个空对象兜底，使内层属性走默认值逻辑。

## 辅助记忆总结

记成一句话：默认值只救 `undefined`，不救 `null`。回答时按"基本语法 → 触发条件（只有 undefined）→ null 不触发 → 重命名组合 → 嵌套兜底 `= {}` → 函数参数双层默认值"展开。
