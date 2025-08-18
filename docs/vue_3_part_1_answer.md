**什么是 `ref`，与 `reactive` 的区别？**

Ref是vue中响应式声明的一个函数，它接收一个原始值作为参数，返回一个带有。value的响应式值。这个值在计算时需要使用。value，在模板中可以自动解包。

reactive也是响应式声明的函数。它接收的是一个对象。

---

**如何创建一个计算属性（computed）？它与 `watch` 的区别是什么？**

computed 是vue中创建计算属性的函数，它自动返回响应式计算的结果。包含get和set两个内置方法可以定义。set在修改这计算值时使用，get在获取计算值时使用。

watch时vue中的监听器，他监听一个响应式值的改变，而做出相应的改变。可以在第一次定义时监听，立即；也可以是监听响应式值的内部结构的变化，深度；也可以在实现延迟反应、提前反应。可以接受监听值更新时新旧两个值。

computed 只是根据多个响应式值变化，做出对应变化后的计算结果。

watch可以监听任意单个或者多个响应式值的变化，而做出响应的处理。

---

**`setup()` 的执行时机是什么？能访问 `this` 吗？**

setup() 是vue3选项式api结构中的内容，可以接受props和上下文对象。在页面创建之初执行。不能访问this，因为实例还没有加载

---

**如何在 `script setup` 中定义 props 和 emits？**

可以使用 defineProps 和 defineEmits 中以对象和数组的形式来定义

---

**`v-if` 与 `v-show` 的区别？**

v-if用于逻辑判断，逻辑为false的组件将不展示。dom不渲染。变换为true时将重新渲染dom

v-show用于组件的展示和隐藏。隐藏时视觉上看不到，但是dom结构依然存在。

---

**`v-for` 上为什么需要 `key`？如何选择 key？**

循环相同结构的组件，需要对每个组件标识身份，以提高dom操作的可靠性。key要避免是一个对象类型，会被解析成字符串结构。导致每一个key都相同。key可以是遍历中的顺序编号，或者遍历内容的id。

---

**如何在父组件向子组件传入回调事件？（基本 props & emit）**

1. 通过 v-on （@）
2. provide inject

---

**什么是 `provide` / `inject`？有什么使用场景？**

provide 和 inject 是vue中突破祖孙组件数据逐层传递的方式，可以在祖父组件中通过provide传递任意类型的值，在任意子孙组件中通过inject接收。

场景：多级嵌套的部门选择组件可以使用以上方式。

---

**如何创建一个自定义指令（directive）？举例 `v-focus`。**



```javascript
app.dirrective('focus',{
  mounted(el){
    el.foucs()
  }
})
```

---

**`nextTick` 有什么用途？什么时候使用？**

nextTick() 是DOM更新完成后的回调方法。用于修改数据后计算新的DOM或者操作DOM

---

**`teleport` 的用途是什么？如何使用？**

teleport用于将内层组件指向外部组件渲染。通常在内层组件布局结构较小，需要展示更大的组件空间时使用。

可以通过to指向到外层任意节点上

---

**`Suspense` 组件的基本作用是什么？**

suspense组件主要是为其内部子组件提供等待显示，当内容子组件内容没有加载完成时为pending状态，显示loading状态。当加载完成后为resolve，显示子组件内容。当子组件加载错误时，状态为fall，显示fallback 错误提示内容。主要作用为提升交互体验。

---

**模板中如何使用 `v-model` 在子组件进行双向绑定？**

在输入型组件：input，textarea、radio、select等组件中通过v-model将值绑定，就实现了双向绑定。

本质上是简化了props和emits的传递和事件响应。

---

**如何在组件中访问模板引用（template refs）？**

可以通过 useRefs定一个refs，然后通过在组件中ref绑定该值，就可以获取到该组件的实例，就可以通过ref来调用该组件的方法。

---

**`watchEffect` 与 `watch` 的区别？**

都是vue中作为监听响应式值变化的函数。

watchEffect：自动收集依赖并立即执行副作用
watch：显示监听源，并提供新旧值，用于更精准的副作用控制

---

**什么是 `shallowRef` 和 `shallowReactive`？**

shalowRef 是定义浅层响应式原始值

shallowReactive 是定义浅层响应式对象

---

**如何将响应式对象解构而不丢失响应性？**

可以在解构时使用 toRef将解构后的内容包装 不会丢失响应式

---

**`isRef`、`unref`、`toRaw` 分别是什么？**

isRef 判断是否是响应式值

unref 返回响应式值或者原始值

toRaw 返回响应式包装对象的原始对象

---

**如何防止子组件暴露过多内部实现？（组件封装）**

可以使用Expose()在setup显示暴露方法和属性

---

**什么是 `defineAsyncComponent`？什么时候使用？**

动态加载异步组件，用于性能优化。当某个组件暂时不在渲染内容中时，先不需要将可能用到的所有组件全部加载，而是在当需要显示的时候按需加载。

---

**如何在模板中绑定 class 和 style（双向/多值）？**

可以使用 :calss，：style 动态属性，以数组的方式传入多个值

---

**组件的 `emits` 选项有什么作用？**

用于接收父组件传递的事件方法，以数组的方式接收多个，返回一个emit可以在事件执行时调用

---

**如何在 Vue 3 中使用 TypeScript 定义组件 props？**

使用defineComponent 或者 defineProps

---

**`watch` 的 `immediate` 与 `deep` 选项分别做什么？**

immediate 是监听ref getter 数组的第一次时立即执行一次，此时的oldValue为undefined

deep时监听reactive 内嵌套属性的变化，也发生响应

---

**Vue 3 中如何实现组件懒加载？**

使用动态 import（）或者 defineAsyncComponent

---

**为什么尽量避免在模板中进行昂贵计算？有什么替代方案？**

模版中进行昂贵的计算会导致DOM更新效率变低，使得交互卡顿。

可以使用 computed 将计算结果缓存。

---

**如何在组件间共享逻辑（composition vs mixin）？**

可以使用组合式函数

---

**`Fragment` 在 Vue 3 中是什么？有什么好处？**

Fragment 是 Vue 3 中用于支持组件返回多个根节点的特性。它允许组件模板中不需要额外的包裹元素，减少无意义的 DOM 层级。

好处：
- 避免多余的 DOM 节点，优化渲染结构。
- 使模板结构更简洁，便于样式和布局管理。

---

**如何处理表单输入与双向绑定复杂场景（自定义 `v-model`）？**

在输入型组件如 input、textarea、select 等中使用 v-model 进行双向绑定。

对于自定义组件，可以通过 props 和 emits 实现自定义 v-model，简化父子通信。

---

**`effectScope` 的用途是什么？**

effectScope 用于收集和管理一组响应式副作用（如 watch、computed 等），便于统一停止和释放资源，提升代码的可维护性。

---

**如何在 Vue 中捕获错误（错误边界）？**

可以通过 app.config.errorHandler 注册全局错误处理函数，捕获运行时异常，实现错误边界。

---

**什么是 `markRaw`？什么时候使用？**

markRaw 用于将对象标记为不可被 Vue 响应式系统代理，返回原始对象。

适用于不需要响应式的对象（如第三方库实例、大型数据结构等）。

---

**如何在模板或 setup 中调用父组件方法？**

1. 通过 emits 传递事件方法，子组件调用时传递参数。
2. 父组件通过 provide 提供方法，子组件 inject 获取并调用。

---

**如何实现跨组件的事件总线（建议方式）？**

推荐通过状态提升到独立的 store（如 Pinia）统一管理，实现跨组件通信和状态同步。

---

**`v-once` 有什么作用？什么时候用？**

v-once 只渲染元素和组件一次，后续数据变化不会重新渲染。

适用于静态内容或不需要响应式更新的场景，提升渲染性能。

---

**如何在组件中使用 CSS Modules 或 Scoped CSS？**

在 <style scoped>  标签中添加 scoped 属性，实现样式只作用于当前单文件组件。

使用 CSS Modules 时，通过 module 属性和 :class 绑定实现样式隔离。
