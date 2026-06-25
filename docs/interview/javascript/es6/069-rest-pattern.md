# 069. [高级]** 解构赋值的剩余模式（rest pattern）

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

剩余模式的核心不是"三个点的另一种写法"，而是在解构时把未被单独提取的剩余部分收集到一个新对象或新数组中。对象 rest 收集剩余自有可枚举属性，数组 rest 收集剩余元素，且 rest 必须是最后一个。

一句话答法：`...rest` 在解构左侧表示"把剩下的都给我"，对象解构产出新普通对象（浅拷贝、仅自有可枚举属性），数组解构产出新数组，且只能出现在最后位置。

## 问题意图

这道题主要考察三件事：

1. 是否能区分 rest pattern（解构左侧收集）和 spread syntax（表达式右侧展开）。
2. 是否知道对象 rest 只拷贝自有可枚举属性，且结果是普通对象（丢失原型）。
3. 是否清楚 rest 必须是最后一个、每层解构只能有一个 rest 的语法限制。

## 考察范围

- 对象 rest：`const { a, ...rest } = obj`。
- 数组 rest：`const [first, ...rest] = arr`。
- 必须在最后位置、每层只能有一个 rest。
- rest 创建新对象/新数组（浅拷贝）。
- 嵌套解构中使用 rest。
- 函数参数解构中使用 rest。

## 技术错误纠正

- rest 不产生"深拷贝效果"。`...rest` 收集属性值时是浅拷贝——原始值被复制，引用值只拷贝引用。
- `import()` 不是只能写固定字符串等无关纠正已删除；本题仅涉及解构 rest。
- 对象 rest 的结果始终是普通对象（`Object.create(null)` 或 `{}`），不保留源对象的原型链。

## 知识点系统梳理

### 对象 rest

```js
const user = { id: 1, name: 'Alice', email: 'a@b.com', role: 'admin' }
const { id, ...profile } = user
// profile → { name: 'Alice', email: 'a@b.com', role: 'admin' }
```

`profile` 是一个全新的普通对象，包含 `user` 中除 `id` 以外的所有自有可枚举属性。

### 数组 rest

```js
const [head, ...tail] = [10, 20, 30, 40]
// head → 10, tail → [20, 30, 40]
```

`tail` 是一个全新的数组。

### 最后位置限制

```js
// ✅ 合法
const { a, ...rest } = obj
const [first, ...rest] = arr

// ❌ SyntaxError
const { ...rest, a } = obj   // rest 不在最后
const { ...a, ...b } = obj   // 两个 rest
```

### 嵌套 rest

```js
const config = {
  api: { baseUrl: '/api', timeout: 5000, retries: 3 },
  theme: 'dark',
}
const { api: { baseUrl, ...apiRest }, ...uiConfig } = config
// baseUrl → '/api'
// apiRest → { timeout: 5000, retries: 3 }
// uiConfig → { theme: 'dark' }
```

每一层解构可以各自有一个 rest，互不冲突。

### 函数参数 rest

```js
function createUser({ name, email, ...extra }) {
  // extra 收集调用者传入的所有"意料之外"的属性
  return { name, email, metadata: extra }
}
```

### rest pattern vs spread syntax 对比

| 对比项 | Rest pattern（解构左侧） | Spread syntax（表达式右侧） |
| --- | --- | --- |
| 位置 | 赋值 `=` 左侧 / 函数形参 | 赋值 `=` 右侧 / 函数实参 |
| 作用 | 收集剩余部分到一个变量 | 展开可迭代对象或对象属性 |
| 示例 | `const { a, ...rest } = obj` | `const copy = { ...obj }` |
| 产物 | 一个新对象或新数组 | 一组展开的值 |
| 限制 | 必须最后、每层只能一个 | 无位置限制，可出现多次 |

## 实战应用举例

### 示例 1：剔除敏感字段后转发

这个例子证明：对象 rest 最常见的用法是"排除已知属性，保留其余全部"，比手动 pick 或 delete 更安全。

```js
function toPublicUser(user) {
  const { password, ssn, ...publicFields } = user
  return publicFields
}

const raw = { id: 1, name: 'Alice', password: 'x', ssn: '123', role: 'admin' }
toPublicUser(raw)
// → { id: 1, name: 'Alice', role: 'admin' }

// 边界：源对象没有要排除的字段时，rest 就是完整浅拷贝
toPublicUser({ id: 2, name: 'Bob' })
// → { id: 2, name: 'Bob' }
```

边界说明：

- 如果 `user` 不含 `password` / `ssn`，`publicFields` 等于 `user` 的浅拷贝，不会报错。
- rest 只拷贝自有可枚举属性；如果 `user` 的某些字段来自原型链，rest 中不会包含它们。
- 嵌套对象（如 `user.address`）仍是引用，修改 `publicFields.address.city` 会影响原对象。

### 示例 2：分离必选参数和可选配置

```js
function request(url, { method = 'GET', headers, ...extraOptions }) {
  const config = { method, headers, ...extraOptions }
  console.log(`${method} ${url}`, config)
  return fetch(url, config)
}

request('/api/users', { method: 'POST', headers: { 'X-Token': 'abc' }, cache: 'no-store' })
// extraOptions → { cache: 'no-store' }

// 边界：不传任何额外配置
request('/api/users', { method: 'GET' })
// extraOptions → {}（空对象，不是 undefined）
```

## 使用场景说明和对比

| 场景 | 写法 | 说明 |
| --- | --- | --- |
| 剔除特定属性 | `const { secret, ...safe } = obj` | 最常见用法，替代手动 delete |
| 数组取头尾分组 | `const [first, ...rest] = arr` | 递归处理、pipeline 首元素分离 |
| 函数参数分离必选和可选 | `function f({ required, ...opts })` | 框架 API 设计常用，opts 透传给下层 |
| React props 透传 | `const { className, ...rest } = props` | 提取自用 prop，其余 `{...rest}` 传给子组件 |
| 配置合并 | `const { override, ...settings } = userConfig` | 提取控制标记，剩余才是真正配置 |
| 嵌套解构提取 + 收集 | `const { api: { baseUrl, ...apiRest } } = config` | 多层配置按需解构 |

## 易错点提示

- rest 必须在最后位置，`const { ...rest, a } = obj` 是语法错误。
- 每一层解构只能有一个 rest，`const { ...a, ...b } = obj` 不合法。
- 对象 rest 结果是普通对象，源对象的原型方法和不可枚举属性不会出现在 rest 中。
- rest 是浅拷贝，嵌套引用值（对象、数组）和源对象共享同一引用。
- 对象 rest 只收集自有可枚举属性（等价于 `Object.keys` 能遍历到的）。
- 数组 rest 对空剩余产出 `[]`（空数组），不是 `undefined`；对象 rest 对空剩余产出 `{}`。

## 记忆要点总结

- rest 在左侧收集、spread 在右侧展开，语法相同（`...`）但方向相反。
- rest 必须最后、每层只能一个。
- 对象 rest 产出普通新对象，只含自有可枚举属性，浅拷贝。
- 数组 rest 产出新数组，剩余为空时是 `[]` 而非 `undefined`。
- 实战最常见用途：剔除字段、分离参数、props 透传。

## 延伸问题

1. 对象 rest 和 `Object.assign({}, obj)` 在拷贝范围上有什么区别？
2. rest pattern 在 TypeScript 中如何标注类型？（`Omit<T, K>` 的关系）
3. 为什么规范要求 rest 必须在最后位置？如果允许在中间会有什么问题？
4. 嵌套解构中多层 rest 的性能开销是否值得关注？
5. 对象 rest 和 `structuredClone` 在深拷贝场景下如何选择？

## 可能类似的问题及简要参考答案

**Q：rest pattern 和 spread syntax 有什么区别？**  
A：rest 出现在赋值左侧或函数形参中，作用是收集剩余部分；spread 出现在右侧或实参中，作用是展开。两者语法都是 `...`，但方向相反。

**Q：对象 rest 能拿到原型上的属性吗？**  
A：不能。对象 rest 只收集自有可枚举属性，等价于 `Object.keys()` 遍历范围。原型属性和不可枚举属性都不会出现在 rest 结果中。

**Q：rest 解构是深拷贝吗？**  
A：不是。rest 是浅拷贝——原始值被复制，引用类型只拷贝引用。修改 rest 中的嵌套对象会影响原对象。

## 辅助记忆总结

记成一句话：`...rest` 在解构左侧是"把剩下的都收进一个新容器"。回答时按"左收右展 → 必须最后 → 浅拷贝仅自有可枚举 → 剔除字段 / 参数分离"展开。
