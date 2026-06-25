> ⚠️ **聚合题库，不参与12段结构评分**。本文件为题目索引/备用题库，标准答案见 `docs/interview/vue/` 下对应主题的单题文件。
# Vue Router 进阶（11题）

> 来源：`docs/questions/vue_3_pinia_vue_router_面试题库（_110_题）.md`

## Vue Router 进阶（11题）

95. **路由懒加载与 webpack chunk name 的关系如何控制？**
<details><summary>答案（折叠）</summary>
使用动态 `import(/* webpackChunkName: "group" */ './MyView.vue')` 注释或 Vite 的约定来控制 chunk 命名与分组，利于调试和缓存策略。
</details>

96. **如何实现基于 `meta` 的权限路由（示例流程）？**
<details><summary>答案（折叠）</summary>
在路由 meta 设置 `requiresAuth`，全局 `beforeEach` 检查 `to.meta` 并验证用户状态，若未登录重定向到登录页并保留回跳信息。
</details>

97. **解释路由守卫中异步验证的正确使用方式（避免导航闪烁）。**
<details><summary>答案（折叠）</summary>
在守卫中返回 Promise 或 `next()`，对异步操作进行等待，最好配合全局加载状态或延迟显示进度条以避免闪烁，并在异常时返回 `false` 或重定向。
</details>

98. **如何在路由导航时实现数据预取（prefetch）？**
<details><summary>答案（折叠）</summary>
在路由守卫（如 `beforeEnter` 或全局 `beforeEach`）中触发数据加载并等待，或在组件 `setup` 中使用 `async setup` 与 Suspense；也可在路由变更前并行 prefetch 静态资源。
</details>

99. **解释 `history` 模式的差异（HTML5 history vs hash vs Web History）以及服务端配置注意点。**
<details><summary>答案（折叠）</summary>
`createWebHistory` 使用 HTML5 history（漂亮的 URL），需要服务端对所有非静态请求返回 index.html；`hash` 模式使用 `#` 不需服务端配置；还有 `memory` 用于测试/SSR。
</details>

100. **如何缓存路由组件（keep-alive）并控制哪些路由被缓存？**
<details><summary>答案（折叠）</summary>
使用 `<keep-alive include="ComponentName" exclude>` 或动态控制 `include`，在组件中使用 `activated`/`deactivated` 生命周期管理缓存行为。
</details>

101. **路由重定向和导航守卫中如何传递原始目标（用于登录后回跳）？**
<details><summary>答案（折叠）</summary>
重定向到登录页时在 query 中附带 `redirect` 或 `from`，登录成功后读取该参数并用 `router.replace` 跳回原目标。
</details>

102. **如何处理多个并发导航（重复点击）导致的导航取消错误？**
<details><summary>答案（折叠）</summary>
捕获 `router.push` 的 Promise 错误并忽略导航取消（`isNavigationFailure(err, NavigationFailureType.cancelled)`），或在操作按钮上禁用防重复提交。
</details>

103. **如何实现路由级别的滚动恢复（back/forward）？**
<details><summary>答案（折叠）</summary>
在 `scrollBehavior` 中使用 `savedPosition` 返回上次的滚动位置（浏览器 forward/back 操作会提供该位置）。
</details>

104. **Vue Router 中如何处理动态匹配优先级？例如 `/user/:id` 与 `/user/profile` 的匹配顺序。**
<details><summary>答案（折叠）</summary>
静态路径优先于动态路径，路由表顺序也会影响匹配，设计时把更具体的路由放在前面以避免冲突。
</details>

---
