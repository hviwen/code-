> ⚠️ **聚合题库，不参与12段结构评分**。本文件为题目索引/备用题库，标准答案见 `docs/interview/vue/` 下对应主题的单题文件。
# Pinia 基础（15题）

> 来源：`docs/questions/vue_3_pinia_vue_router_面试题库（_110_题）.md`

## Pinia 基础（15题）

37. **Pinia 是什么？为什么选它代替 Vuex？**
<details><summary>答案（折叠）</summary>
Pinia 是 Vue 官方推荐的状态管理库，API 更简洁、基于 Composition API 设计、类型友好、支持模块化、插件机制和 devtools，学习曲线更低。
</details>

38. **如何创建一个基本的 Pinia store？举例。**
<details><summary>答案（折叠）</summary>
```js
import { defineStore } from 'pinia'
export const useCounter = defineStore('counter', {
 state: ()=> ({ count: 0 }),
 getters: { double: (state) => state.count * 2 },
 actions: { inc(){ this.count++ } }
})
```
</details>

39. **store 的 `state`、`getters`、`actions` 分别是什么角色？**
<details><summary>答案（折叠）</summary>
`state` 保存响应式数据，`getters` 类似计算属性（基于 state），`actions` 用于修改 state 和处理副作用（可以是异步）。
</details>

40. **如何在组件中使用 store？**
<details><summary>答案（折叠）</summary>
在组件中 `const store = useCounter()`，直接读取 `store.count` 或调用 `store.inc()`。在 setup 外也可直接调用（需在 Pinia 安装后）。
</details>

41. **Pinia 与组件组合函数（composables）如何配合？**
<details><summary>答案（折叠）</summary>
Store 本身就是可复用的组合 API，可在 composable 内使用 store 或在 store 中调用 composable，实现分层逻辑。
</details>

42. **如何在 Pinia 中进行异步操作？（示例）**
<details><summary>答案（折叠）</summary>
在 `actions` 中使用 `async`：
```js
async fetch(){ this.items = await api.get() }
```
Actions 支持返回 Promise，组件可以 `await store.fetch()`。
</details>

43. **如何持久化 Pinia 的 state？有什么常用方案？**
<details><summary>答案（折叠）</summary>
使用插件如 `pinia-plugin-persistedstate` 或自定义插件在 `subscribe` 时写入 `localStorage`/`sessionStorage`，并在初始化时恢复。
</details>

44. **如何在组件中只监听 store 的某个字段变化？**
<details><summary>答案（折叠）</summary>
在组件中使用 `watch(() => store.field, (newVal)=>{})` 或使用 `storeToRefs(store)` 解构出响应式 refs 再 watch。
</details>

45. **Pinia 的热重载（HMR）如何工作？**
<details><summary>答案（折叠）</summary>
Pinia 支持开发模式下的 HMR，store 定义在模块中时会在模块替换时保留 state 并替换逻辑，依赖构建工具实现。
</details>

46. **如何在多个组件间共享同一个 store 实例？**
<details><summary>答案（折叠）</summary>
通过 `useStore()`（同一个 id）在不同组件中调用会返回同一单例 store 实例（在同一应用/上下文中）。
</details>

47. **Pinia 是否支持模块化命名空间（namespaced）？**
<details><summary>答案（折叠）</summary>
Pinia 的 store 天然就是模块化的，每个 `defineStore` 都有唯一 id；不需要像 Vuex 那样额外配置 namespaced。
</details>

48. **如何在 setup 外部使用 store（例如在普通 JS 文件）？**
<details><summary>答案（折叠）</summary>
需确保 Pinia 已创建并挂载到 app 后，可直接 `useStore()` 使用；在服务端或测试中需要创建独立的 Pinia 实例并注入。
</details>

49. **如何在 Pinia 中实现依赖注入（store 之间互用）？**
<details><summary>答案（折叠）</summary>
在 store 中直接导入并调用另一个 store（避免循环依赖），或在动作中注入 `this` 与 `useOtherStore()`。
</details>

50. **Pinia 的 `mapState` / `mapActions` 如何在 Options API 中使用？**
<details><summary>答案（折叠）</summary>
通过 `import { mapState, mapActions } from 'pinia'` 在 `computed`/`methods` 中映射，但更推荐使用 Composition API 的 `useStore()`。
</details>

51. **Pinia 与 Vue 组件的 devtools 集成如何开启？**
<details><summary>答案（折叠）</summary>
安装 Pinia 时（`app.use(createPinia())`）在开发环境自动启用 devtools；确保 browser extension 已安装。
</details>

52. **如何在 SSR 场景下使用 Pinia？**
<details><summary>答案（折叠）</summary>
创建独立 Pinia 实例用于每次请求（避免全局单例），在服务端填充 state 并序列化到页面进行客户端 hydration。
</details>

53. **什么是 `storeToRefs`？为什么要使用？**
<details><summary>答案（折叠）</summary>
将 store 的 reactive state 转为 refs，便于解构并保持响应性（避免直接解构丢失响应）。
</details>

54. **如何对 Pinia 的 state 进行类型约束（TypeScript）？**
<details><summary>答案（折叠）</summary>
在定义 `defineStore` 时通过泛型或在 `state: ()=> ({}) as StateType` 指定类型，actions/getters 会推断出类型。
</details>

55. **Pinia 的插件机制是如何工作的？**
<details><summary>答案（折叠）</summary>
通过 `pinia.use(plugin)` 注册插件，插件会在 store 创建时运行，可扩展 store API、订阅事件或注入持久化逻辑。
</details>
