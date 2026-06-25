# Pinia 面试复习

Pinia 题目按基础和进阶拆分，默认按 Pinia 3.0.3 语义复习。

## 学习顺序

1. 先读题目或索引，确认考察范围。
2. 再读拆分后的答案文件，按 12 段结构复习。
3. 最后回到练习目录做代码题或手写实现。

## 文件索引

- [Pinia 是什么？为什么选它代替 Vuex？](core/q001-pinia-vuex.md)
- [store 的 `state`、`getters`、`actions` 分别是什么角色？](core/q002-store-state-getters-actions.md)
- [如何在组件中使用 store？](core/q003-store.md)
- [Pinia 与组件组合函数（composables）如何配合？](core/q004-pinia-composables.md)
- [如何在 Pinia 中处理异步操作？](core/q005-pinia.md)
- [如何持久化 Pinia 的 state？有什么常用方案？](core/q006-pinia-state.md)
- [如何在组件中只监听 store 的某个字段变化？](core/q007-store.md)
- [Pinia 的热重载（HMR）如何工作？](core/q008-pinia-hmr.md)
- [如何在多个组件间共享同一个 store 实例？](core/q009-store.md)
- [Pinia 是否支持模块化命名空间（namespaced）？](core/q010-pinia-namespaced.md)
- [如何在 setup 外部使用 store（例如在普通 JS 文件）？](core/q011-setup-store-js.md)
- [如何在 Pinia 中实现依赖注入（store 之间互用）？](core/q012-pinia-store.md)
- [Pinia 的 `mapState` / `mapActions` 如何在 Options API 中使用？](core/q013-pinia-mapstate-mapactions-options-api.md)
- [Pinia 与 Vue 组件的 devtools 集成如何开启？](core/q014-pinia-vue-devtools.md)
- [如何在 SSR 场景下使用 Pinia？](core/q015-ssr-pinia.md)
- [什么是 `storeToRefs`？为什么要使用？](core/q016-storetorefs.md)
- [如何对 Pinia 的 state 进行类型约束（TypeScript）？](core/q017-pinia-state-typescript.md)
- [Pinia 的插件机制是如何工作的？](core/q018-pinia.md)
- [原题：如何给 Pinia 写一个插件（插件 API 简述）？](advanced/q001-pinia-api.md)
- [原题：如何为 Pinia 实现持久化插件（大概思路）？](advanced/q002-pinia.md)
- [原题：如何在服务端渲染中同步 Pinia 状态（hydrate）？](advanced/q003-pinia-hydrate.md)
- [原题：Pinia 中如何实现模块之间的依赖注入且避免循环依赖？](advanced/q004-pinia.md)
- [原题：如何对 Pinia store 做权限/隔离（多租户或不同用户）？](advanced/q005-pinia-store.md)
- [原题：如何对 Pinia 的 actions 做事务化（批量回滚）？](advanced/q006-pinia-actions.md)
- [原题：在大型项目中，如何组织 Pinia 的 store 文件结构？](advanced/q007-pinia-store.md)
- [原题：如何为 Pinia store 编写单元测试？（思路）](advanced/q008-pinia-store.md)
- [原题：如何在 Pinia 中监听 state 变化并触发副作用（subscribe）？](advanced/q009-pinia-state-subscribe.md)
- [原题：Pinia 如何支持按需加载 store（动态注册）？](advanced/q010-pinia-store.md)
