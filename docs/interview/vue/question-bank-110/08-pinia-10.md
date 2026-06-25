> ⚠️ **聚合题库，不参与12段结构评分**。本文件为题目索引/备用题库，标准答案见 `docs/interview/vue/` 下对应主题的单题文件。
# Pinia 进阶（10题）

> 来源：`docs/questions/vue_3_pinia_vue_router_面试题库（_110_题）.md`

## Pinia 进阶（10题）

85. **如何给 Pinia 写一个插件（插件 API 简述）？**
<details><summary>答案（折叠）</summary>
插件接收 `context`（`store`、`app`、`pinia`），通过 `pinia.use(plugin)` 注册，在 plugin 中可扩展 store（如 `store.$subscribe`、注入方法或持久化逻辑）。
</details>

86. **如何为 Pinia 实现持久化插件（大概思路）？**
<details><summary>答案（折叠）</summary>
在插件初始化时从 storage 恢复 state（`store.$patch`），并通过 `store.$subscribe` 监听变更写入 storage，可按 store id 或 keys 选择性持久化。
</details>

87. **如何在服务端渲染中同步 Pinia 状态（hydrate）？**
<details><summary>答案（折叠）</summary>
服务端渲染时创建独立 pinia 实例并在服务端填充 store，序列化 state 到 HTML；客户端创建 pinia 并用 `store.$patch` 恢复服务端状态后再挂载应用。
</details>

88. **Pinia 中如何实现模块之间的依赖注入且避免循环依赖？**
<details><summary>答案（折叠）</summary>
通过在 action 中动态 `useOtherStore()` 而不是在模块顶层导入，或拆分职责、抽象公共逻辑到 composable，避免直接循环引用。
</details>

89. **如何对 Pinia store 做权限/隔离（多租户或不同用户）？**
<details><summary>答案（折叠）</summary>
为不同租户创建不同的 store 实例或在 state 中区分 namespace，结合插件在初始化时注入上下文（如 tenantId）并基于此过滤数据。
</details>

90. **如何对 Pinia 的 actions 做事务化（批量回滚）？**
<details><summary>答案（折叠）</summary>
通过在 action 内部先保存旧 state 快照（`toRaw` 或深拷贝），执行变更并在失败时使用 `store.$patch` 恢复快照；或使用插件封装事务 API。
</details>

91. **在大型项目中，如何组织 Pinia 的 store 文件结构？**
<details><summary>答案（折叠）</summary>
按域（feature）划分目录，每个功能一或多个 store，公共 utils/composables 放共享目录，store 使用 index 汇总并文档化 id。
</details>

92. **如何为 Pinia store 编写单元测试？（思路）**
<details><summary>答案（折叠）</summary>
在测试中创建 Pinia 实例并注入到组件/函数，mock API 调用，测试 state/getters/actions 的行为，使用 `createTestingPinia` 等工具简化。
</details>

93. **如何在 Pinia 中监听 state 变化并触发副作用（subscribe）？**
<details><summary>答案（折叠）</summary>
使用 `store.$subscribe((mutation, state) => {})` 监听变化，mutation 包含变更信息，可用于持久化或日志。
</details>

94. **Pinia 如何支持按需加载 store（动态注册）？**
<details><summary>答案（折叠）</summary>
`defineStore` 是惰性注册的，第一次调用 `useStore()` 时会注册该 store；可和路由懒加载结合实现按需 store 加载。
</details>
