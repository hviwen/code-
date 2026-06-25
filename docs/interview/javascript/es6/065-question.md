# 065. [中级]** 如何解构嵌套对象？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

嵌套对象解构的核心不是"用 `{}` 展开"，而是让解构模式的层级结构与对象的层级结构一一对应。外层属性名充当导航路径，只有最内层的标识符才会成为变量。

一句话答法：解构嵌套对象就是在 `{}` 里再写 `{}`，每一层的属性名对应对象里同名的键，最终只有叶子位置的名字会变成变量；每一层都可以独立加默认值 `= {}` 和重命名 `: newName`。

## 问题意图

这道题主要考察三件事：

1. 是否理解解构模式是在"镜像"对象结构，而不只是取一层属性。
2. 是否知道中间层属性名不会成为变量，以及中间层缺失时会 TypeError。
3. 是否能在实际代码中合理使用默认值防御和重命名，同时控制嵌套深度以保持可读性。

## 考察范围

- 嵌套 `{}` 语法必须与对象结构一一对应。
- 嵌套层中的重命名语法 `{ a: { b: newName } }`。
- 每一层独立设置默认值 `= {}`，防止中间层 `undefined` 导致 TypeError。
- 深层嵌套（3 层以上）的可读性限制和替代方案。
- 数组与对象混合嵌套解构。
- 函数参数中的嵌套解构与默认值联用。

## 技术错误纠正

- "使用 `{}` 展开"表述不准确。`{}` 在解构中不是展开操作，而是声明"进入这个属性继续匹配"。正确说法是"使用嵌套的 `{}` 模式按层级匹配对象结构"。
- 中间层属性名（如 `const { profile: { avatar } } = user` 中的 `profile`）不会被声明为变量。尝试访问 `profile` 会得到 `ReferenceError`。
- 如果中间层属性值为 `undefined` 或 `null`，引擎会尝试对其解构从而抛出 TypeError，必须用 `= {}` 防御。

## 知识点系统梳理

### 基本语法：模式镜像结构

```js
const user = {
  profile: {
    avatar: 'pic.jpg',
    social: { twitter: '@dev' }
  }
}

// 解构模式镜像对象层级
const { profile: { avatar, social: { twitter } } } = user
// avatar → 'pic.jpg'
// twitter → '@dev'
// profile → ReferenceError（不是变量，只是路径）
```

核心规则：冒号 `:` 左边是属性名（路径），右边是新的模式或最终变量名。

### 重命名

```js
const { profile: { avatar: userPic, social: { twitter: handle } } } = user
// userPic → 'pic.jpg'
// handle → '@dev'
```

每一层都可以独立重命名，语法是 `原属性名: 新变量名`。

### 默认值防御

```js
const config = {} // profile 不存在

// 不加默认值 → TypeError: Cannot destructure property 'avatar' of undefined
// const { profile: { avatar } } = config

// 每一层加 = {} 防御
const { profile: { avatar = 'default.jpg' } = {} } = config
// avatar → 'default.jpg'
```

默认值从内到外读：先检查 `profile` 是否存在，不存在时用 `{}`；再检查 `avatar` 是否存在，不存在时用 `'default.jpg'`。

### 数组与对象混合嵌套

```js
const response = {
  data: {
    users: [
      { name: 'Alice', role: 'admin' },
      { name: 'Bob', role: 'viewer' }
    ]
  }
}

const { data: { users: [first, second] } } = response
// first → { name: 'Alice', role: 'admin' }
// second → { name: 'Bob', role: 'viewer' }

// 继续解构数组元素内部的对象
const { data: { users: [{ name: firstName }, { role: secondRole }] } } = response
// firstName → 'Alice'
// secondRole → 'viewer'
```

### 函数参数中的嵌套解构

```js
function createUser({ name, address: { city, zip } = {} } = {}) {
  return `${name} from ${city || 'unknown'}`
}

createUser({ name: 'Tom', address: { city: 'Beijing', zip: '100000' } })
// → 'Tom from Beijing'

createUser({ name: 'Tom' })
// → 'Tom from unknown'（address 缺失，= {} 兜底）

createUser()
// → 'undefined from unknown'（整个参数缺失，= {} 兜底）
```

## 实战应用举例

### 示例 1：解构 API 响应中的嵌套数据

这个例子展示从典型 RESTful 响应中提取嵌套字段，并防御可选层级缺失。

```js
function handleUserResponse(response) {
  const {
    data: {
      user: {
        name,
        profile: { avatar = '/default-avatar.png', bio = '' } = {},
        settings: { theme = 'light', lang = 'zh-CN' } = {}
      } = {}
    } = {}
  } = response || {}

  return { name, avatar, bio, theme, lang }
}

// 正常情况
handleUserResponse({
  data: { user: { name: 'Li', profile: { avatar: '/li.png' }, settings: { theme: 'dark' } } }
})
// → { name: 'Li', avatar: '/li.png', bio: '', theme: 'dark', lang: 'zh-CN' }

// profile 字段缺失
handleUserResponse({ data: { user: { name: 'Li' } } })
// → { name: 'Li', avatar: '/default-avatar.png', bio: '', theme: 'light', lang: 'zh-CN' }

// response 为 null
handleUserResponse(null)
// → { name: undefined, avatar: '/default-avatar.png', bio: '', theme: 'light', lang: 'zh-CN' }
```

边界说明：

- 每一层 `= {}` 不可省略，否则中间层缺失直接 TypeError。
- 如果 API 返回 `null` 而不是 `undefined`，`= {}` 默认值不会生效（`null` 不等于 `undefined`），所以最外层加了 `|| {}`。

### 示例 2：深层嵌套的可读性取舍

```js
// 不推荐：超过 3 层嵌套，解构模式比原对象还难读
const {
  a: { b: { c: { d: { e: value } } } }
} = deepObj

// 推荐：分步解构或用可选链
const value = deepObj?.a?.b?.c?.d?.e
// 或
const { c } = deepObj.a.b
const { d: { e: value2 } } = c
```

取舍原则：嵌套超过 2-3 层时，解构模式的"镜像结构"优势消失，反而增加阅读负担。此时可选链或分步解构更清晰。

## 使用场景说明和对比

| 场景 | 是否适合嵌套解构 | 原因 |
| --- | --- | --- |
| API 响应提取 1-2 层嵌套字段 | 适合 | 结构清晰，解构比多次 `.` 访问更简洁 |
| 函数参数为配置对象且有嵌套默认值 | 适合 | 声明式地表达参数结构和默认值 |
| React/Vue props 解构 | 适合 | 组件入口处一次提取所需字段 |
| 超过 3 层深度的数据 | 不适合 | 解构模式本身比原对象还难读 |
| 中间层可能为 `null`（不只是 `undefined`） | 需注意 | `= {}` 对 `null` 不生效，需额外判断 |
| 需要同时保留中间层引用和内部字段 | 需两次解构 | 同一属性只能选"继续解构"或"赋值为变量"，不能同时做 |

## 易错点提示

- 中间层属性名不是变量：`const { a: { b } } = obj` 之后，`a` 不存在，只有 `b`。
- 中间层为 `undefined` 未加 `= {}` 会 TypeError，不是得到 `undefined`。
- `null` 不触发默认值：`const { x = 1 } = { x: null }` 结果 `x` 是 `null`，不是 `1`。
- 同一属性不能既解构又赋值：想同时拿 `profile` 对象和 `profile.avatar`，要写两次解构或分步处理。
- 数组混合嵌套时，数组位置要用 `[]` 而不是 `{}`，顺序即索引。
- 函数参数嵌套解构如果不加最外层 `= {}`，调用时不传参数会 TypeError。

## 记忆要点总结

- 解构模式是对象结构的镜像：`{}` 对 `{}`，`[]` 对 `[]`，层级一一对应。
- 冒号左边是路径，右边是变量或更深的模式。中间层名不会成为变量。
- 每一层 `= {}` 各管各的：外层防中间层缺失，内层防叶子字段缺失。
- `null` 不等于 `undefined`，`= {}` 对 `null` 不生效。
- 超过 2-3 层考虑可选链或分步解构，解构不是越深越好。

## 延伸问题

1. `const { a: { b } } = obj` 之后能访问 `a` 吗？为什么？
2. 嵌套解构中 `= {}` 和 `= { key: default }` 分别防御什么场景？
3. 如果中间层是 `null` 而不是 `undefined`，解构会怎样？如何防御？
4. 函数参数 `function f({ a: { b } = {} } = {})` 中两个 `= {}` 分别防御什么？
5. 嵌套解构和可选链 `?.` 在什么场景下各有优势？

## 可能类似的问题及简要参考答案

**Q：解构赋值中冒号 `:` 的含义是什么？**
A：冒号左边是源对象的属性名（路径），右边是目标变量名或更深的解构模式。`{ name: n }` 表示取 `name` 属性赋给变量 `n`；`{ profile: { avatar } }` 表示进入 `profile` 属性继续解构。

**Q：如何同时获取中间层对象和它内部的字段？**
A：同一个解构语句中不能对同一属性既赋值又继续解构。需要分两步：先 `const { profile } = user`，再 `const { avatar } = profile`；或写两次解构 `const { profile, profile: { avatar } } = user`（后者合法但可读性一般）。

**Q：嵌套解构和 Lodash `_.get()` 的区别？**
A：嵌套解构是语法层面的模式匹配，中间层缺失会报错（除非加 `= {}`）；`_.get(obj, 'a.b.c', default)` 是运行时安全访问，任何层级缺失都返回默认值。解构适合结构已知且需要多个字段的场景，`_.get` 适合路径动态或只取单个深层值。

## 辅助记忆总结

记成一句话：嵌套解构就是用 `{}` 镜像对象层级，冒号左边走路径、右边拿变量，每层 `= {}` 防 TypeError。
