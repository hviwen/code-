# 105. **描述虚拟 DOM（VNode）在 Vue 中的生命周期，从创建到打补丁（patch）。

> 来源：`docs/vue/vue_3_part_3_answer.md`

## 问题本质解读

这道题核心是在确认对「105. **描述虚拟 DOM（VNode）在 Vue 中的生命周期，从创建到打补丁（patch）。」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

VNode（虚拟节点）是 Vue 用 JS 对象描述真实 DOM 的中间层。其完整生命周期如下：

1. **模板编译**：`<template>` 经编译器转为 render 函数，内部调用 `h()` 函数
2. **VNode 创建**：`h('div', { class: 'foo' }, children)` 返回 VNode 对象，包含 `type`、`props`、`children`、`shapeFlag`、`patchFlag` 等字段
3. **挂载（mount）**：首次渲染时 `patch(null, vnode, container)` 将 VNode 递归创建为真实 DOM 插入容器
4. **更新触发**：响应式数据变化 → effect 重新执行 render → 生成新 VNode 树
5. **Diff（patch）**：`patch(oldVNode, newVNode)` 先用 `sameVNode(n1, n2)` 判断（比较 `type` + `key`），相同则进入 `patchElement` 对比 props 和 children；不同则卸载旧节点、挂载新节点
6. **子节点 Diff**：keyed children 使用双端 + 最长递增子序列算法，最小化 DOM 操作
7. **卸载（unmount）**：组件销毁时递归调用 `unmount`，触发 `onUnmounted` 钩子并移除 DOM

Vue 3 关键优化：
- **静态提升（hoistStatic）**：纯静态 VNode 在编译时提取到 render 函数外，避免重复创建
- **Patch Flags**：编译时标记动态绑定类型（`TEXT = 1`、`CLASS = 2`、`PROPS = 8` 等），patch 时只对比标记部分
- **Block Tree**：`openBlock()` + `createBlock()` 收集动态子节点到 `dynamicChildren` 数组，跳过静态子树的 diff

## 实战应用举例

**示例 1：手写 render 函数观察 VNode**

```vue
<script setup lang="ts">
import { h, ref } from 'vue'

const count = ref(0)

// 手动编写 render 函数，等价于 <button @click>{{ count }}</button>
const MyButton = () =>
  h(
    'button',
    { onClick: () => count.value++ },
    `点击次数：${count.value}`
  )
</script>

<template>
  <!-- 每次 count 变化，MyButton 返回新 VNode，Vue 进行 patch -->
  <MyButton />
  <p>通过 DevTools 可观察到 button 文本节点被 patch，而非整个 button 被替换</p>
</template>
```

**示例 2：v-once 跳过 patch**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const title = ref('初始标题')
const count = ref(0)
</script>

<template>
  <!-- v-once 使 VNode 只创建一次，后续 patch 时被跳过 -->
  <h1 v-once>{{ title }}</h1>
  <button @click="count++">count: {{ count }}</button>
  <p>点击按钮后 h1 不会重新渲染，因为被标记为静态</p>
</template>
```

## 使用场景说明和对比

| 方案 | 适用场景 | 优势 | 劣势 |
|------|---------|------|------|
| **VNode (Vue 模板)** | 绝大多数业务 UI | 声明式、自动 diff、编译时优化 | 极端高频更新（如 Canvas 动画）有开销 |
| **手写 render / h()** | 高度动态组件（如表格列渲染器） | 完全可编程、无模板限制 | 可读性下降，失去部分编译优化 |
| **直接 DOM 操作** | Canvas、WebGL、超高频动画 | 零抽象开销 | 手动管理状态同步，容易不一致 |
| **v-once / v-memo** | 静态或极少变化的大块内容 | 跳过 diff 减少开销 | 数据变化时不更新，误用导致 UI 不一致 |

**何时关注 VNode 开销**：列表超 1000 项、60fps 动画、大表格频繁刷新时应考虑虚拟滚动或直接 Canvas。普通业务场景下 VNode diff 开销可忽略。

## 易错点提示

**1. sameVNode 判断不只看 tag，还看 key**

```vue
<!-- 错误：没有 key，切换时 Vue 认为是同类型节点，复用 DOM 导致状态残留 -->
<component :is="flag ? CompA : CompB" />

<!-- 正确：加 key 强制销毁重建 -->
<component :is="flag ? CompA : CompB" :key="flag ? 'a' : 'b'" />
```

**2. 静态提升只在 SFC 编译模式下生效**

```js
// 运行时编译（浏览器 build）不做 hoistStatic
// 只有 vite/webpack + vue-loader/plugin-vue 的预编译才启用
// 所以 CDN 引入的 Vue 不享有此优化
```

**3. Patch Flag 不是万能的——动态 key 的 props 会退化**

```vue
<!-- 编译器能优化：patchFlag = PROPS, dynamicProps = ["title"] -->
<div :title="val">静态内容</div>

<!-- 编译器无法优化：动态属性名，退化为全量 props diff -->
<div v-bind="dynamicObj">内容</div>
```

**4. v-for 不加 key 导致就地复用的 bug**

```vue
<!-- 错误：无 key，删除列表中间项时，输入框内容错位 -->
<div v-for="item in list">
  <input v-model="item.text" />
</div>

<!-- 正确 -->
<div v-for="item in list" :key="item.id">
  <input v-model="item.text" />
</div>
```

**5. template ref 在 patch 完成后才可用**

```ts
// onMounted 中 ref 已就绪，但在 setup 顶层 ref.value 为 null
const el = ref<HTMLDivElement | null>(null)
console.log(el.value) // null —— DOM 还没 patch
onMounted(() => {
  console.log(el.value) // <div> —— patch 完成
})
```

## 记忆要点总结

**口诀**：「编 h 挂 patch 卸」—— 编译出 render → h() 创建 VNode → 挂载到 DOM → patch diff 更新 → 卸载清理。

关键数字：
- sameVNode = `type` 相同 + `key` 相同
- Patch Flag 是编译时标记，运行时按位与判断
- 静态提升把不变的 VNode 提到 render 外面，只创建一次

## 延伸问题

Vue 3 的 Block Tree 和 Patch Flag 机制具体如何减少 diff 范围？与 React Fiber 的 diff 策略有什么本质区别？可结合 `openBlock()` / `createBlock()` 源码说明。

## 可能类似的问题及简要参考答案

**Q: Vue 的 diff 算法和 React 的有什么区别？**
A: Vue 3 使用双端比较 + 最长递增子序列，React 使用单向遍历 + Fiber 链表。Vue 编译时有 Patch Flag 可跳过静态节点，React 纯运行时。

**Q: 为什么 v-for 一定要加 key？**
A: 没有 key 时 Vue 使用就地复用策略（in-place patch），相同位置的节点直接 patch props。如果子节点含状态（如 input），会导致状态错位。

**Q: 什么是静态提升？**
A: 编译器将纯静态 VNode 提升到 render 函数外部，使其只创建一次、每次 render 直接复用引用，避免重复 `h()` 调用和 diff。

## 辅助记忆总结

**一句话**：VNode 是 DOM 的 JS 镜像，Vue 通过 patch 做最小化 DOM 更新；记住 `sameVNode = type + key`，记住编译优化三件套：静态提升、Patch Flag、Block Tree。
