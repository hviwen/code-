# 060. [高级] 箭头函数在事件处理中的注意事项

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

事件处理里使用箭头函数要看两个问题：你需要哪个 `this`，以及后续能不能移除同一个监听器。

一句话回答：箭头函数不会把 `this` 绑定到 DOM 元素；需要元素本身时用普通函数或 `event.currentTarget`，需要组件/实例上下文时可以用箭头函数，但要保留函数引用便于移除。

## 问题意图

这题不是问“能不能写箭头函数事件”，而是考察事件系统、`this`、函数引用、框架渲染性能之间的组合判断。

## 考察范围

- DOM 事件监听器里的 `this`。
- `event.target` 和 `event.currentTarget`。
- `addEventListener/removeEventListener` 函数引用一致性。
- React/Vue 中事件处理函数的写法差异。
- 渲染过程中创建新函数的成本。

## 技术错误纠正

“需要导出”不是这个问题的有效答案。真正需要说明的是：箭头函数不会把 `this` 设为事件元素，并且匿名箭头函数如果没有保存引用，就不能用 `removeEventListener` 移除。

## 知识点系统梳理

| 问题 | 箭头函数表现 | 应对 |
| --- | --- | --- |
| 监听器内的 `this` | 来自外层，不是 DOM 元素 | 用 `event.currentTarget` 或普通函数 |
| 移除监听器 | 匿名函数无法移除 | 保存同一个函数引用 |
| 访问组件实例 | 适合保留外层实例 | 可用箭头函数 |
| 渲染中创建函数 | 每次渲染都是新引用 | 提前定义处理函数 |

## 实战应用举例

```js
const button = document.querySelector('button')

button.addEventListener('click', function (event) {
  console.log(this === event.currentTarget) // true
})
```

普通函数监听器中，浏览器会把 `this` 设为绑定事件的元素。

```js
const button = document.querySelector('button')

const handleClick = event => {
  console.log(event.currentTarget) // button
}

button.addEventListener('click', handleClick)
button.removeEventListener('click', handleClick)
```

箭头函数也能处理事件，但不要依赖 `this` 指向元素；要保存函数引用，移除时才能匹配。

## 使用场景说明和对比

| 场景 | 推荐写法 | 原因 |
| --- | --- | --- |
| 原生 DOM 中需要元素 `this` | 普通函数 | 浏览器会绑定 `this` |
| 原生 DOM 中只需要事件对象 | 箭头函数可用 | 使用 `event.currentTarget` 更明确 |
| 类实例方法里绑定 DOM 事件 | 箭头函数属性或 bind | 保留实例上下文 |
| React JSX 中简单传参 | 谨慎 inline 箭头 | 方便但每次 render 新引用 |
| Vue `methods` | 普通函数 | 让 Vue 绑定组件实例 |

## 易错点提示

- `removeEventListener('click', () => {})` 不能移除之前的匿名箭头函数。
- `event.target` 可能是子元素，`event.currentTarget` 才是当前绑定监听器的元素。
- 箭头函数事件处理器里的 `this` 不是 DOM 元素。
- 不要为了省一行，在频繁渲染的列表里给每项创建复杂 inline 处理器。

## 记忆要点总结

- 事件里先问：我要元素 `this` 还是外层实例？
- 要元素 `this`：普通函数。
- 要外层实例：箭头函数可用。
- 要移除监听：保存同一个函数引用。

## 延伸问题

为什么匿名箭头函数不方便移除事件监听？

参考答案：`removeEventListener` 需要传入和添加时完全相同的函数引用。每次写 `() => {}` 都会创建新函数，引用不同，无法匹配旧监听器。

## 可能类似的问题及简要参考答案

问：事件处理中用 `event.target` 还是 `event.currentTarget`？

答：`target` 是实际触发事件的元素，可能是子节点；`currentTarget` 是当前绑定监听器的元素。

问：Vue 事件方法为什么不写箭头函数？

答：Vue 的 `methods` 普通函数会被绑定到组件实例，箭头函数会捕获外层 `this`，导致拿不到组件实例。

## 辅助记忆总结

记成一句话：事件里的箭头函数可以用，但别指望它的 `this` 是元素，也别丢了引用。
