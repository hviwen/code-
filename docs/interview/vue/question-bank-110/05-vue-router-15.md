> ⚠️ **聚合题库，不参与12段结构评分**。本文件为题目索引/备用题库，标准答案见 `docs/interview/vue/` 下对应主题的单题文件。
# Vue Router 基础（15题）

> 来源：`docs/questions/vue_3_pinia_vue_router_面试题库（_110_题）.md`

## Vue Router 基础（15题）

56. **如何创建 Vue Router 实例（基本示例）？**
<details><summary>答案（折叠）</summary>
```js
import { createRouter, createWebHistory } from 'Vue Router'
const router = createRouter({ history: createWebHistory(), routes })
app.use(router)
```
</details>

57. **`router-link` 与 `router.push` 的区别？**
<details><summary>答案（折叠）</summary>
`router-link` 是模板组件用于声明式导航，`router.push` 是编程式导航在 JS 中调用。
</details>

58. **什么是动态路由？如何定义路由参数？**
<details><summary>答案（折叠）</summary>
在路由路径中使用 `:id`（如 `/user/:id`），在组件中通过 `useRoute().params.id` 访问，或在 props 模式下接收为 prop。
</details>

59. **如何将路由参数作为组件 props 传入？**
<details><summary>答案（折叠）</summary>
路由配置中使用 `props: true` 或函数 `props: route => ({ id: route.params.id })`。
</details>

60. **如何配置嵌套路由？举例简单结构。**
<details><summary>答案（折叠）</summary>
在父路由中定义 `children: [{ path: 'child', component: Child }]`，父组件需包含 `<router-view />` 以渲染子路由。
</details>

61. **如何实现路由懒加载？**
<details><summary>答案（折叠）</summary>
在路由定义中使用动态导入：`component: () => import('./views/MyView.vue')`，构建会生成代码分割块。
</details>

62. **`beforeEach` 全局守卫的用途？它的参数是什么？**
<details><summary>答案（折叠）</summary>
用于在每次导航前执行逻辑（如鉴权），参数 `(to, from, next)`（Vue Router 4 也支持返回 `false`/路径/Promise 等）。
</details>

63. **如何处理 404（找不到路由）？**
<details><summary>答案（折叠）</summary>
在路由表末尾添加 `{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }` 捕获未匹配的路径。
</details>

64. **路由中 `meta` 的作用？怎么在守卫中使用它？**
<details><summary>答案（折叠）</summary>
`meta` 用于存放路由元信息（如 `requiresAuth`），在守卫中通过 `to.meta.requiresAuth` 检测并处理逻辑。
</details>

65. **`replace` 与 `push` 的区别？**
<details><summary>答案（折叠）</summary>
`push` 会向 history 堆栈添加新记录，`replace` 替换当前记录（不会新增历史）。
</details>

66. **如何在路由中控制滚动行为？**
<details><summary>答案（折叠）</summary>
在 `createRouter` 时传入 `scrollBehavior(to, from, savedPosition)` 返回期望位置（如 `savedPosition`、`{ top:0 }` 或滚动到锚点）。
</details>

67. **如何在导航失败（navigation failure）时做错误处理？**
<details><summary>答案（折叠）</summary>
`router.push()` 返回一个 Promise，可捕获错误；也可监听 `router.onError` 做全局错误处理。
</details>

68. **`router.isReady()` 有什么用途？**
<details><summary>答案（折叠）</summary>
在 SSR 或需要等待初始导航完成后再挂载应用时使用，返回一个 Promise，确保路由解析完毕。
</details>

69. **如何实现命名路由并用其跳转？**
<details><summary>答案（折叠）</summary>
路由配置 `name: 'user'`，跳转 `router.push({ name: 'user', params: { id: 1 } })` 更稳健地管理路径变更。
</details>

70. **`alias` 与 `redirect` 的区别？**
<details><summary>答案（折叠）</summary>
`redirect` 会重定向到另一路由（URL 变更）；`alias` 提供同一路由的别名访问（URL 显示 alias，但匹配到同一路由记录）。
</details>

71. **路由导航守卫的执行顺序（全局、路由独享、组件内）？**
<details><summary>答案（折叠）</summary>
执行顺序：全局 `beforeEach` -> 路由独享 `beforeEnter` -> 组件内 `beforeRouteEnter` -> 解析后 `beforeResolve` -> `afterEach`。组件内 `beforeRouteLeave` 在离开组件时触发。
</details>

72. **如何在 `<router-link>` 中设置 active-class？**
<details><summary>答案（折叠）</summary>
使用 `active-class` 或全局配置 `linkActiveClass`，或者在 CSS 使用默认 `.router-link-active`。
</details>

---
