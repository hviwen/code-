# Vue Router Part 1 — 每题点评（面试复习助手风格）

作者：你的私人前端面试复习助手
说明：下文针对你上传的 `vue_router_part_1_answer.md` 中每一道题及答案逐条点评：**（1）评估（是否正确 / 是否不完整 / 是否错误）**；**（2）关键修正或补充**；**（3）一句话面试级标准答案**；**（4）必要时给出简短示例或注意事项**。便于在面试时快速背诵与应答。

---

> 我以你指定的风格（经验丰富的前端专家、面试级回答）来点评；如需我把这些再加工成“30s 背诵卡片”或导出为 PDF，请告诉我。

---

## 1. 如何创建 Vue Router 实例（基本示例）？
**原文问题/答案（摘录）**：示例代码有拼写与调用错误（`import HomeView form './HomeView'`、`createWebHistory` 没括号等）。
**评估**：示例意图正确但示范代码含语法/API 错误，面试会被扣分。
**关键修正/补充**：
- `import` 应为 `from`；`createWebHistory()` 需要调用；路由数组的写法应为多个对象而非把多个 path 写在同一对象内。
**一句话标准答案**：
```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView'
import AboutView from './AboutView'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
```
**面试扩展点**：提到 history 类型（`createWebHistory` vs `createWebHashHistory`）及 SSR 的 `createMemoryHistory`。

---

## 2. `router-link` 与 `router.push` 的区别？
**原文要点**：router-link 可以预加载下一页并不会重复创建；router.push 推入栈。
**评估**：部分正确，但有误导（router-link 并不是总会“预加载”，需与路由预加载策略配合）。
**关键修正/补充**：
- `<router-link>` 是模板级的声明式导航组件；支持 `to` prop，可被浏览器/框架做预取（在某些工具/插件中）。`router.push()` 是编程式导航，返回 Promise，可捕获失败。
**一句话标准答案**：
- `<router-link>`：声明式导航（模板），支持自动 active 类等；`router.push()`：编程式导航，向历史栈推入一条记录并返回 Promise。
**示例/注意**：
```html
<router-link to="/about">About</router-link>
```
```js
router.push({ name: 'about' }).catch(err => {/* handle NavigationFailure */})
```

---

## 3. 什么是动态路由？如何定义路由参数？
**原文要点**：用冒号 `:` 指定参数；可用正则；可用 `router.addRoute()` 等。
**评估**：总体正确，但表述粗糙且混淆“替换路由的方式实现导航”。
**关键修正/补充**：
- 动态路由示例：`/user/:id`；可使用 `props` 将 params 传入组件；可在路由配置中使用自定义正则 `:id(\d+)`。
- `router.addRoute()` 用于运行时添加路由，`router.removeRoute()` 移除。
**一句话标准答案**：
- 动态路由通过路径参数（`/path/:param`）来表示同一组件的多条路由实例，参数通过 `route.params` 或 `props` 使用。
**示例**：
```js
{ path: '/user/:id(\d+)', component: User }
```

---

## 4. 如何将路由参数作为组件 props 传入？
**原文要点**：设置 `props: true` 或函数/对象形式；也提到了 `$route`。
**评估**：正确，但表述含糊（“通过$route获取” 没说明优缺点）。
**关键修正/补充**：
- 推荐 `props: true` 或 `props: route => ({ id: route.params.id })`，可让组件更易测试与解耦。
**一句话标准答案**：
- 在路由配置中使用 `props: true`（或函数）将 `route.params` 映射为组件 props，避免组件直接依赖 `$route`。
**示例**：
```js
{ path: '/user/:id', component: User, props: true }
```

---

## 5. 如何配置嵌套路由？举例简单结构。
**原文要点**：在父组件放 `router-view`，在路由配置中加 `children`.
**评估**：正确，示例基本到位。
**关键修正/补充**：
- 注意子路径是相对父路径（不以 `/` 开头），以及命名视图和嵌套 `<router-view>` 的顺序。
**一句话标准答案**：
- 在父组件模板中放 `<router-view/>`，并在路由表中为父项添加 `children` 数组，子路由将渲染在父的 `<router-view>` 中。
**示例**：见原文示例（已接近标准）。

---

## 6. 如何实现路由懒加载？
**原文要点**：使用 `() => import()` 动态导入。
**评估**：正确且常用。
**关键修正/补充**：
- 可结合 webpack/vite 的 chunk name 注释分组，并使用 `defineAsyncComponent` 或 `Suspense` 做优雅降级/加载占位。
**一句话标准答案**：
- 在路由 `component` 使用动态导入：`component: () => import('./MyView.vue')`，实现按需加载并拆分代码块。

---

## 7. `beforeEach` 全局守卫的用途？它的参数是什么？
**原文要点**：用于导航前判断；参数写为 `(to, form, next)`.
**评估**：核心正确，但拼写 `form` 应为 `from`; Vue Router 4 支持返回值而不是必需使用 next。
**关键修正/补充**：
- 函数签名：`router.beforeEach((to, from) => { /* 可返回 true/false 或重定向对象或 Promise */ })` 或使用 `next` 兼容写法。
**一句话标准答案**：
- 全局守卫 `beforeEach` 在导航触发前运行，用于权限验证/重定向/取消导航，支持同步或异步返回（可返回 `false` / 重定向对象 / Promise）。
**示例**：
```js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isLoggedIn()) return { name: 'login' }
})
```

---

## 8. 如何处理 404（找不到路由）？
**原文要点**：可以在配置路由信息中添加一个正则匹配，当不符合当前项目结构的时候，通过配置重定向到404页面.
**评估**：方向对，但建议使用通配符写法更规范。
**关键修正/补充**：
- 推荐使用 `/:pathMatch(.*)*` 匹配所有未命中路径，避免复杂正则。
**一句话标准答案**：
- 使用通配符路由 `/:pathMatch(.*)*` 指向 404 页面或重定向以处理未匹配的路径。

---

## 9. 路由中 `meta` 的作用？怎么在守卫中使用它？
**原文要点**：可在配置路由信息中添加meta属性参数，通过在导航守卫中to.route.meta 来读取。
**评估**：正确，但可补充父路由 meta 的合并行为与使用场景。
**关键修正/补充**：
- `to.meta` 会合并父路由的 meta，可用于权限、标题、面包屑等。注意在 nested route 中 meta 可能来自多个层级。
**一句话标准答案**：
- `meta` 用于在路由上挂载自定义信息（如 `requiresAuth`），在守卫中通过 `to.meta` 读取以控制导航。

---

## 10. `replace` 与 `push` 的区别？
**原文要点**：replace 替换当前页面栈; push 添加新的页面到导航栈中.
**评估**：正确。
**一句话标准答案**：
- `router.push()` 向历史栈添加一条记录；`router.replace()` 替换当前记录（不会新增历史项）。

---

## 11. 如何在路由中控制滚动行为？
**原文要点**：createRouter 函数的参数中有一个 scrollBehavior,接收三个参数 to form savePosition; 然后通过返回位置对象或者位置信息来确定滚动的位置.
**评估**：正确。
**关键修正/补充**：
- `scrollBehavior` 可以返回 Promise 以处理异步场景；返回 `{ left:0, top:0 }` 或 `savedPosition`。
**一句话标准答案**：
- 在 `createRouter` 配置 `scrollBehavior(to, from, savedPosition)` 并返回位置对象以控制导航后的滚动。

---

## 12. 如何在导航失败（navigation failure）时做错误处理？
**原文要点**：通过全局导航守卫,检查到导航失败时留在当前页面或者重定向到首页.
**评估**：不够具体。应说明 `router.push()` 返回的 Promise 以及 `onError`。
**关键修正/补充**：
- 使用 `router.push(...).catch()` 处理失败，或使用 `router.onError()` 捕获路由器级别错误，且可使用 `isNavigationFailure` 检查失败类型。
**一句话标准答案**：
- 捕获 `router.push()` 的 Promise 错误或使用 `router.onError(handler)`，结合 `isNavigationFailure(err)` 判断导航失败类型并处理。

---

## 13. `router.isReady()` 有什么用途？
**原文要点**：空白.
**评估**：需要补充说明。
**关键修正/补充**：
- `router.isReady()` 返回一个 Promise 或状态，表示路由是否完成初始解析并准备就绪，常用于等待异步路由解析或在挂载应用前先等待路由就绪（SSR/客户端 hydration）。
**一句话标准答案**：
- 在应用挂载或 SSR hydration 前使用 `await router.isReady()` 确保路由完成初始解析。

---

## 14. 如何实现命名路由并用其跳转？
**原文要点**：在路由注册时将name属性进行命名；Router-link : 使用to=‘name’; router.push({name:'name'}).
**評估**：正确。
**一句话标准答案**：
- 在路由记录中添加 `name`，通过 `{ name: 'xxx', params: { id } }` 在 `<router-link>` 或 `router.push()` 中跳转。

---

## 15. `alias` 与 `redirect` 的区别？
**原文要点**：Alias: 定义别名，可以是多个; Redirect: 重定向.
**评估**：正确但需补充行为差异。
**关键修正/补充**：
- `alias` 提供替代访问路径但 URL 保持别名；`redirect` 会变更地址并触发导航到目标路由。
**一句话标准答案**：
- `alias` 是路径别名（不改变 URL 的显示目标），`redirect` 会立即重定向并更改浏览器地址。

---

## 16. 路由导航守卫的执行顺序（全局、路由独享、组件内）？
**原文要点**：列了一个较长顺序，但有拼写与顺序细微错误.
**评估**：部分正确但需要更准确的顺序说明。
**关键修正/补充**：
- 推荐掌握的简化顺序：全局 beforeEach → 路由独享 beforeEnter → 组件内 beforeRouteEnter/beforeRouteUpdate/beforeRouteLeave（视激活/失活）→ 全局 beforeResolve → afterEach。并能解释组件复用时的行为。
**一句话标准答案**：
- 背出简化顺序并解释组件守卫在组件激活/失活时的调用时机即可。

---

## 17. 如何在 `<router-link>` 中设置 active-class？
**原文要点**：使用active-class 或者全局配置 linkActiveClass.
**評估**：正确。
**一句话标准答案**：
- 可在 `<router-link active-class="my-active">` 或在 router 创建时通过 `linkActiveClass` 全局配置。

---

# 总结建议
- 原文件覆盖了 Router 主要主题，但**存在拼写、语法及 API 调用上的错误**（例如 `form`/`from` 混淆，`createWebHistory` 未调用等），面试场景必须纠正。  
- 对于守卫、错误处理、isReady、scrollBehavior、懒加载等题目，建议补充 1–2 行的示例代码与边界条件（SSR、异步组件、导航重入情况）。  
- 我可以把这些点评转为“面试卡片”或直接生成修正版 MD 覆盖原始文件。请选择：**(A)** 生成完整 MD（我已保存一个版本）供下载，或 **(B)** 先把前 10 题以口头模拟问答形式输出到聊天中进行练习。