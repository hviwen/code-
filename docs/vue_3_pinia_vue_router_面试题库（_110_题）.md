# Vue 3 + Pinia + Vue Router 面试题库（110题）

**说明**：题库共 **110** 道题，按难度与主题分类排序，方便做题与复习。题目下方都附有**折叠答案**（默认收起），如果你想要无答案的版本，直接忽略折叠内容即可。

分布：
- **初级（66题）**：Vue 3（36） + Pinia（15） + Vue Router（15）
- **中级（33题）**：Vue 3（12） + Pinia（10） + Vue Router（11）
- **高级（11题）**：深度原理 / 架构题

---

# 初级（66题）

## Vue 3 基础（36题）

1. **什么是 `ref`，与 `reactive` 的区别？**
<details><summary>答案（折叠）</summary>
`ref` 创建一个包含单一值的响应式引用对象（`.value`），适用于原始值；`reactive` 将对象转为响应式代理，适合复杂对象。`ref` 在模板中会自动解包。
</details>

2. **如何创建一个计算属性（computed）？它与 `watch` 的区别是什么？**
<details><summary>答案（折叠）</summary>
使用 `import { computed } from 'vue'`，`const x = computed(() => a.value + b.value)`。`computed` 用于基于响应式值的缓存计算并返回新值；`watch` 用于副作用（监听变化并执行回调）。
</details>

3. **`setup()` 的执行时机是什么？能访问 `this` 吗？**
<details><summary>答案（折叠）</summary>
`setup()` 在组件实例创建阶段执行，props 已解析但挂载前。`setup()` 中不能使用 `this`（因为实例还未被代理），应通过返回对象或 `expose` 暴露方法。
</details>

4. **如何在 `script setup` 中定义 props 和 emits？**
<details><summary>答案（折叠）</summary>
使用 `defineProps()` 和 `defineEmits()`：
```js
const props = defineProps({ name: String })
const emit = defineEmits(['save'])
```
</details>

5. **`v-if` 与 `v-show` 的区别？**
<details><summary>答案（折叠）</summary>
`v-if` 是条件渲染，会销毁/重建 DOM；`v-show` 只是切换 `display`，更适合频繁切换的小范围场景。
</details>

6. **`v-for` 上为什么需要 `key`？如何选择 key？**
<details><summary>答案（折叠）</summary>
`key` 帮助 Vue 跟踪节点身份，优化重用。推荐使用稳定且唯一的 id；不要使用索引作为长期可变列表的 key。
</details>

7. **如何在父组件向子组件传入回调事件？（基本 props & emit）**
<details><summary>答案（折叠）</summary>
父组件通过 `:onSave="handle"` 或 `@save="handle"` 监听子组件 `emit('save', payload)`；子组件使用 `emit` 触发事件。
</details>

8. **什么是 `provide` / `inject`？有什么使用场景？**
<details><summary>答案（折叠）</summary>
用于跨多层组件传递依赖或共享状态，避免多层 props 传递。通常用于主题、I18n、依赖注入等场景。
</details>

9. **如何创建一个自定义指令（directive）？举例 `v-focus`。**
<details><summary>答案（折叠）</summary>
定义对象并注册：
```js
app.directive('focus', {
  mounted(el){ el.focus() }
})
```
在组件或全局使用 `<input v-focus />`。
</details>

10. **`nextTick` 有什么用途？什么时候使用？**
<details><summary>答案（折叠）</summary>
`nextTick` 在 DOM 更新完成后运行回调，常用于在数据改变后获取新的 DOM 尺寸或操作 DOM。
</details>

11. **`teleport` 的用途是什么？如何使用？**
<details><summary>答案（折叠）</summary>
`<teleport to="body">...</teleport>` 用于将子树渲染到 DOM 中的其他位置，常用于模态、提示类组件以避免样式/层级问题。
</details>

12. **`Suspense` 组件的基本作用是什么？**
<details><summary>答案（折叠）</summary>
用于等待异步子组件（或 `async setup`）完成渲染，并显示 fallback，占位或加载状态，常用于代码分割与异步数据加载。
</details>

13. **模板中如何使用 `v-model` 在子组件进行双向绑定？**
<details><summary>答案（折叠）</summary>
子组件定义 `modelValue` prop 并 `emit('update:modelValue', value)`；父组件使用 `v-model="value"` 或 `v-model:propName`（自定义）绑定。
</details>

14. **如何在组件中访问模板引用（template refs）？**
<details><summary>答案（折叠）</summary>
使用 `const el = ref(null)` 并在模板 `<div ref="el">`，在 `onMounted` 或 `nextTick` 后可访问 `el.value`。
</details>

15. **`watchEffect` 与 `watch` 的区别？**
<details><summary>答案（折叠）</summary>
`watchEffect` 自动收集依赖并立即执行副作用；`watch` 则显式监听源并提供旧值、新值，用于更精确的副作用控制。
</details>

16. **什么是 `shallowRef` 和 `shallowReactive`？**
<details><summary>答案（折叠）</summary>
浅层响应：只对顶层属性建立响应，适合需要避免深度代理的大对象或第三方库对象。
</details>

17. **如何将响应式对象解构而不丢失响应性？**
<details><summary>答案（折叠）</summary>
使用 `toRefs` 将 `reactive` 的属性转换成 `ref`，或直接使用 `computed` 包装。避免直接解构导致失去响应性。
</details>

18. **`isRef`、`unref`、`toRaw` 分别是什么？**
<details><summary>答案（折叠）</summary>
`isRef` 检测是否为 ref，`unref` 返回 ref 的值或原值，`toRaw` 返回 reactive 对象的原始非代理对象。
</details>

19. **如何防止子组件暴露过多内部实现？（组件封装）**
<details><summary>答案（折叠）</summary>
使用 `expose()` 在 `setup` 显式暴露方法/属性，默认不暴露内部实现；使用 `props`/`emit` 作为外部 API。
</details>

20. **什么是 `defineAsyncComponent`？什么时候使用？**
<details><summary>答案（折叠）</summary>
用于异步加载组件以实现路由分割或按需加载，能够配置 loading/error 超时等选项，减少首屏包体积。
</details>

21. **如何在模板中绑定 class 和 style（双向/多值）？**
<details><summary>答案（折叠）</summary>
`v-bind:class` 支持对象/数组语法：`:class="{ active: isActive }"` 或 `:class="['a', className]"`；style 类似，支持对象或字符串。
</details>

22. **组件的 `emits` 选项有什么作用？**
<details><summary>答案（折叠）</summary>
声明组件可以发出的事件并可对事件参数做验证（类型/形状），帮助文档化与错误提示。
</details>

23. **如何在 Vue 3 中使用 TypeScript 定义组件 props？**
<details><summary>答案（折叠）</summary>
使用 `defineComponent` 或 `script setup` + `defineProps<T>()` 来声明类型；`PropType<T>` 可用于复杂类型注解。
</details>

24. **`watch` 的 `immediate` 与 `deep` 选项分别做什么？**
<details><summary>答案（折叠）</summary>
`immediate: true` 使回调在注册时立即执行一次；`deep: true` 深度监听对象内的变化（代价较高）。
</details>

25. **Vue 3 中如何实现组件懒加载？**
<details><summary>答案（折叠）</summary>
使用动态 `import()` 与 `defineAsyncComponent`，或在路由中用 `() => import('...')` 实现代码分割和懒加载。
</details>

26. **为什么尽量避免在模板中进行昂贵计算？有什么替代方案？**
<details><summary>答案（折叠）</summary>
模板每次渲染会重新计算，昂贵操作影响性能。用 `computed` 缓存结果或在 `setup` 中预计算。
</details>

27. **如何在组件间共享逻辑（composition vs mixin）？**
<details><summary>答案（折叠）</summary>
使用 Composition API（可复用的 composable 函数）代替 mixin，避免命名冲突和不透明依赖，易于测试与复用。
</details>

28. **`Fragment` 在 Vue 3 中是什么？有什么好处？**
<details><summary>答案（折叠）</summary>
组件可以返回多个根节点（Fragment），无需多余的包裹元素，DOM 更简洁。
</details>

29. **如何处理表单输入与双向绑定复杂场景（自定义 `v-model`）？**
<details><summary>答案（折叠）</summary>
使用自定义 `v-model:propName`，在子组件声明 `props: ['modelValue']` 或通过 `defineModel`（script setup）并 `emit('update:propName', val)`。
</details>

30. **`effectScope` 的用途是什么？**
<details><summary>答案（折叠）</summary>
用来创建可手动停止的响应式副作用作用域，便于管理与销毁一组响应式副作用（例如动态创建的组件/插件）。
</details>

31. **如何在 Vue 中捕获错误（错误边界）？**
<details><summary>答案（折叠）</summary>
使用组件选项 `errorCaptured(err, instance, info)` 来捕获子组件错误；全局可以使用 `app.config.errorHandler`。
</details>

32. **什么是 `markRaw`？什么时候使用？**
<details><summary>答案（折叠）</summary>
`markRaw(obj)` 标记对象不被 Vue 转为响应式，适用于第三方库对象或大数据结构以避免代理开销和循环引用问题。
</details>

33. **如何在模板或 setup 中调用父组件方法？**
<details><summary>答案（折叠）</summary>
通过 `emit` 触发事件让父组件处理，或使用 `getCurrentInstance().proxy.$parent`（不推荐）。更好的方式是通过 provide/inject 或 store。
</details>

34. **如何实现跨组件的事件总线（建议方式）？**
<details><summary>答案（折叠）</summary>
推荐使用状态管理（Pinia）或提供/注入（provide/inject）来共享函数或事件处理，不建议使用全局事件总线。
</details>

35. **`v-once` 有什么作用？什么时候用？**
<details><summary>答案（折叠）</summary>
使节点只渲染一次，之后不再更新，适合静态内容优化渲染性能。
</details>

36. **如何在组件中使用 CSS Modules 或 Scoped CSS？**
<details><summary>答案（折叠）</summary>
在 `<style scoped>` 中写样式会生成属性选择器防止冲突；CSS Modules 可在构建工具（如 Vite）配置并通过 `:class="$style.foo"` 使用。
</details>


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


## Vue Router 基础（15题）

56. **如何创建 Vue Router 实例（基本示例）？**
<details><summary>答案（折叠）</summary>
```js
import { createRouter, createWebHistory } from 'vue-router'
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

# 中级（33题）

## Vue 3 进阶（12题）

73. **解释 Vue 3 响应式系统中 `track` 与 `trigger` 的作用。**
<details><summary>答案（折叠）</summary>
`track` 在 getter 中收集依赖（记录哪个 effect 依赖了哪个属性），`trigger` 在 setter 中触发依赖的 effects 重新运行，实现响应式更新。
</details>

74. **如何实现一个可复用的 `useFetch` composable？要考虑哪些边界情况？**
<details><summary>答案（折叠）</summary>
`useFetch` 返回 data、loading、error、refresh；需处理请求取消（AbortController）、错误捕获、SSR 支持、缓存策略和重复请求去重。
</details>

75. **`computed` 的缓存失效有哪些触发条件？**
<details><summary>答案（折叠）</summary>
当其依赖的任一响应式源发生改变时缓存失效，下一次访问会重新计算。若依赖为对象内部属性改变（需要深度依赖收集），则会触发。
</details>

76. **解释 `reactive` 与 `Proxy` 的实现优势与限制。**
<details><summary>答案（折叠）</summary>
`Proxy` 能拦截读取/写入/删除操作，支持动态属性并能代理数组；限制包括无法代理某些内建对象或非对象值，以及不能直接代理原生 getter-only 情况，需要注意 `this` 绑定问题。
</details>

77. **如何实现防抖/节流的 composable？要注意依赖问题吗？**
<details><summary>答案（折叠）</summary>
将回调封装在 `ref` 或 `function` 中，使用 `setTimeout`/`Date` 控制执行；注意在依赖变化时清理 timer，避免闭包捕获过时的值。
</details>

78. **如何用 `markRaw` 或 `toRaw` 优化性能或避免代理问题？**
<details><summary>答案（折叠）</summary>
对第三方大型对象或无法序列化的对象使用 `markRaw` 防止深度代理；用 `toRaw` 获取原始对象用于低层处理或比较。
</details>

79. **解释 `render` 函数与 JSX 的应用场景及优缺点。**
<details><summary>答案（折叠）</summary>
`render`/JSX 提供更灵活的条件渲染和动态节点生成，适合库或复杂 UI；缺点是可读性比模板差，调试与模板语法集成较弱。
</details>

80. **如何避免大型列表渲染的性能问题？有什么技巧？**
<details><summary>答案（折叠）</summary>
使用分页/虚拟滚动（virtual scrolling）、适当 key、`v-once`、尽量减少子组件的响应式依赖、懒加载图片与资源。
</details>

81. **解释 `watch` 中的 `flush` 选项（pre/post/sync）有何不同？**
<details><summary>答案（折叠）</summary>
`pre` 在组件更新之前触发（用于同步异步前的准备），`post` 在 DOM 更新后触发（默认），`sync` 同步执行（立即）。
</details>

82. **如何实现一个带取消功能的异步操作（例如按键触发的请求）？**
<details><summary>答案（折叠）</summary>
使用 `AbortController` 或维护一个标志/计数器，在新的请求开始时取消/忽略旧请求的结果，并在组件卸载时清理。
</details>

83. **当一个 reactive 对象的属性被替换时（整体赋值），如何保证视图更新？**
<details><summary>答案（折叠）</summary>
直接替换对象引用（`state.obj = newObj`）会触发更新；避免仅替换内部某些不可观察属性。对于深层属性，确保使用响应式方法或赋予新对象。
</details>

84. **如何测试 Vue 3 组件（单元测试）？常用工具和策略。**
<details><summary>答案（折叠）</summary>
使用 `@vue/test-utils` 与 Jest/Vitest，测试 props、events、DOM 渲染和行为；对异步逻辑使用 `flushPromises` 与 `nextTick`，对 composables 可单独导出并单测。
</details>


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

# 高级（11题）

105. **解释 Vue 3 响应式系统的核心数据结构（effect、dep、targetMap）。**
<details><summary>答案（折叠）</summary>
核心是 `effect`（副作用函数），`track`/`trigger` 操作会在 `targetMap`（WeakMap）中记录 `target` -> `key` -> `dep`（依赖集合）。当属性变化时根据 `dep` 触发关联的 effects。
</details>

106. **描述虚拟 DOM（VNode）在 Vue 中的生命周期，从创建到打补丁（patch）。**
<details><summary>答案（折叠）</summary>
组件渲染产生 VNode，渲染器比较新旧 VNode（diff）并生成 patch 操作，最后应用到真实 DOM。patch 包括创建、更新、移动、删除等步骤。
</details>

107. **解释 Vue 的调度器（scheduler）与微任务队列，为什么 `nextTick` 有时表现为异步？**
<details><summary>答案（折叠）</summary>
Vue 在响应式变化时把 effect 推入一个队列并使用微任务（Promise.then 或 queueMicrotask）批量刷新，`nextTick` 实际上是在该刷新周期之后执行，保证 DOM 已更新。
</details>

108. **Vue 编译器如何处理模板指令（简述 transform & codegen 流程）？**
<details><summary>答案（折叠）</summary>
编译分解析（parser）-> 转换（transform）-> 代码生成（codegen）。transform 阶段将 AST 转换为更适合运行时的形式并应用优化（如静态提升），最后生成渲染函数代码。
</details>

109. **描述 Pinia store 的内部注册与 state 响应化过程（高层次）。**
<details><summary>答案（折叠）</summary>
定义 store 时 Pinia 会根据 id 创建内部记录，state 使用 Vue 的 `reactive`/`ref` 转为响应式，并注册订阅者用于 devtools 与持久化插件。
</details>

110. **Vue Router 的路由匹配（matcher）大致是如何实现的？（高层）**
<details><summary>答案（折叠）</summary>
Router 将路由定义转换成一棵或多组匹配树/正则，匹配时按顺序测试每个记录并提取 params，支持嵌套与通配符，最终返回匹配记录栈用于渲染。
</details>

---

> 以上为 **110 道面试题与折叠答案**。如果你需要：
> - 导出为 **Markdown / PDF / .md 文件**，我可以帮你生成下载链接；
> - 生成 **仅题目（无答案）** 的版本；
> - 或 **按公司岗位（前端/高级/架构）定制题库**，我也可以进一步筛选与调整。

你想要哪一种后续操作？

