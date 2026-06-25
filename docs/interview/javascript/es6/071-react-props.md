# 071. [中级]** 解构赋值在React props中的应用

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

React 函数组件的参数就是一个普通对象（props），解构赋值让你在函数签名里直接拿到需要的属性，而不是通篇写 `props.xxx`。这是现代 React 的标准写法，不是可选技巧。

一句话答法：函数组件用 `function Comp({ a, b })` 代替 `function Comp(props)` + `props.a`，配合默认值和 `...rest` 可以同时完成参数声明、默认值设定和属性透传。

## 问题意图

1. 是否真正用过函数组件，而不是只看过语法。
2. 是否知道解构默认值、rest 透传、嵌套解构在组件 props 上的实际用法。
3. 是否了解类组件 `this.props` 与函数组件解构的差异，以及 TypeScript 下的类型标注方式。

## 考察范围

- 函数参数位置的对象解构（`function({ a, b })`）。
- 解构默认值代替 `defaultProps`。
- `...rest` 收集剩余 props 并透传给子元素。
- 嵌套解构提取深层 props 属性。
- 解构重命名（`{ value: inputValue }`）。
- 类组件 `this.props` 解构与函数组件参数解构的对比。

## 技术错误纠正

- 解构默认值只在属性值为 `undefined` 时生效，**不防 `null`**。传了 `null` 就是 `null`，不会退回默认值。
- `...rest` 收集的是"没有被解构到的属性"，不是"所有属性"。
- 嵌套解构时，如果中间层对象不存在会抛 TypeError，需要在中间层给 `= {}` 默认值。

## 知识点系统梳理

### 基本用法

```jsx
// 不解构 — 到处写 props.
function Button(props) {
  return <button className={props.className}>{props.children}</button>
}

// 解构 — 直接用
function Button({ className, children }) {
  return <button className={className}>{children}</button>
}
```

### 默认值

```jsx
function Button({ variant = 'primary', size = 'md', children }) {
  return <button className={`btn-${variant} btn-${size}`}>{children}</button>
}

// <Button>OK</Button>        → btn-primary btn-md
// <Button variant="danger">  → btn-danger btn-md
```

解构默认值可以替代 `Button.defaultProps`（React 19 已移除 `defaultProps`）。

### rest 透传

```jsx
function Button({ variant = 'primary', children, ...rest }) {
  return (
    <button className={`btn-${variant}`} {...rest}>
      {children}
    </button>
  )
}

// <Button variant="danger" disabled aria-label="删除">Delete</Button>
// disabled 和 aria-label 通过 ...rest 透传到 <button>
```

### 嵌套解构

```jsx
function UserCard({ user: { name, email }, onEdit }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={onEdit}>编辑</button>
    </div>
  )
}
```

如果 `user` 可能为空，中间层需要默认值：`{ user: { name, email } = {} }`。

### 解构重命名

```jsx
function Input({ value: inputValue, onChange: handleChange }) {
  // 组件内部用 inputValue 和 handleChange，避免和其他变量冲突
}
```

### 类组件 vs 函数组件

| 对比项 | 类组件 | 函数组件 |
| --- | --- | --- |
| 访问方式 | `this.props.xxx` | 参数解构 `{ xxx }` |
| 解构位置 | `render()` 内部 `const { a } = this.props` | 函数参数 |
| 默认值 | `static defaultProps` 或解构默认值 | 参数默认值（推荐） |
| rest 透传 | `const { a, ...rest } = this.props` | `function({ a, ...rest })` |
| 心智负担 | 需要记 `this` 绑定 | 纯函数参数，无 `this` |

## 实战应用举例

### 示例 1：通用 Button 组件

这个例子演示解构默认值 + rest 透传的标准组件模式。

```jsx
function Button({ variant = 'primary', size = 'md', children, ...rest }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...rest}>
      {children}
    </button>
  )
}
```

```jsx
<Button>提交</Button>
// → <button class="btn btn-primary btn-md">提交</button>

<Button variant="danger" size="lg" disabled onClick={handleDelete}>
  删除
</Button>
// → <button class="btn btn-danger btn-lg" disabled>删除</button>
// disabled 和 onClick 由 ...rest 透传
```

边界说明：

- `variant={null}` 时，默认值不生效，className 会出现 `btn-null`。如果调用方可能传 `null`，需要 `variant ?? 'primary'`。
- `...rest` 会把所有未解构的属性转发，包括 `data-*`、`aria-*`、事件处理器。如果子元素不支持某些属性（如把 DOM 属性传给自定义组件），需要过滤。

### 示例 2：嵌套解构 + TypeScript

```tsx
interface Props {
  user: { name: string; avatar: string }
  settings?: { theme?: 'light' | 'dark' }
  onSave: () => void
}

function Profile({
  user: { name, avatar },
  settings: { theme = 'light' } = {},
  onSave,
}: Props) {
  return (
    <div className={theme}>
      <img src={avatar} alt={name} />
      <button onClick={onSave}>保存</button>
    </div>
  )
}
```

边界说明：

- `settings` 可能不传，所以中间层要给 `= {}`，否则解构报 TypeError。
- TypeScript 的类型标注放在整个解构模式之后（`: Props`），不是每个属性单独标注。

## 使用场景说明和对比

| 场景 | 推荐写法 | 原因 |
| --- | --- | --- |
| 函数组件接收 props | 参数位置解构 | 标准写法，直观声明依赖 |
| 可选 props 带默认值 | 解构默认值 | 替代 `defaultProps`，React 19 已移除后者 |
| 包装组件透传 HTML 属性 | `...rest` | 不用逐个列举 `disabled`、`aria-*` |
| 深层嵌套 props（如 `user.address.city`） | 适度嵌套解构，超过两层改用变量 | 嵌套太深降低可读性 |
| 类组件 render 内部 | `const { a, b } = this.props` | 减少 `this.props.` 重复 |
| 需要同时拿整体 props 对象和个别属性 | 不解构，或解构后另存 | 参数位解构后拿不到完整 props 引用 |

## 易错点提示

- **null 不触发默认值**：`{ x = 1 }` 在 `x` 为 `null` 时得到 `null`，不是 `1`。只有 `undefined` 触发默认值。
- **嵌套解构中间层为空**：`{ user: { name } }` 如果 `user` 是 `undefined`，直接 TypeError。必须 `{ user: { name } = {} }`。
- **rest 包含意外属性**：`...rest` 透传到 DOM 元素时，React 会对不认识的属性发出 warning。需要在透传前过滤非 DOM 属性。
- **解构后丢失整体引用**：参数位解构后没有 `props` 变量，如果需要把整个 props 传给子组件或日志，要么不解构，要么 `function Comp(props)` + 内部解构。
- **TypeScript 标注位置**：类型写在解构模式之后 `({ a, b }: Props)`，不是 `({ a: string, b: number })`——后者是重命名语法。
- **重命名和默认值同时用**：`{ value: v = 0 }` 先重命名为 `v`，再给默认值 `0`，顺序容易混淆。

## 记忆要点总结

- 函数组件参数解构是 React 标准写法，不是可选优化。
- 解构默认值替代 `defaultProps`（React 19 已移除）。
- `...rest` 收集未解构的属性，用于透传给子元素。
- 嵌套解构中间层要给 `= {}` 防 TypeError。
- 默认值只防 `undefined`，不防 `null`。

## 延伸问题

1. React 19 移除 `defaultProps` 后，函数组件的默认值应该怎么写？
2. `...rest` 透传到 DOM 元素时，如何过滤掉自定义属性避免 React warning？
3. TypeScript 中如何给解构的 props 标注类型？`React.FC<Props>` 和参数标注有什么区别？
4. 嵌套解构超过几层时应该放弃，改用什么写法？
5. 为什么 `{ value: v = 0 }` 中 `value` 不是变量名而 `v` 才是？

## 可能类似的问题及简要参考答案

**Q：函数组件的 props 解构和类组件的 `this.props` 有什么区别？**
A：函数组件在参数位直接解构，声明式地列出需要的属性；类组件在 `render()` 内 `const { a } = this.props`，多了 `this` 绑定和一行变量声明。功能等价，函数组件写法更简洁。

**Q：`...rest` 透传 props 时有什么注意事项？**
A：rest 会包含所有未解构的属性。如果透传到原生 DOM 元素，非标准属性会触发 React warning；如果透传到自定义组件，可能传入不期望的属性。通常需要在传递前过滤。

**Q：解构默认值和 `??` 运算符处理 `null` 的区别？**
A：解构默认值只在属性为 `undefined` 时生效，`null` 不触发。`??`（空值合并）在 `null` 和 `undefined` 时都生效。如果调用方可能传 `null`，用 `??`。

## 辅助记忆总结

记成一句话：函数组件参数直接解构 props，配合默认值替代 `defaultProps`、`...rest` 做透传、中间层 `= {}` 防空。
