
**Pinia 是什么？为什么选它代替 Vuex？**

pinia是一个为vue3定制的数据状态管理库，是vuex的升级版。

pinia 去掉了vuex中mountion冗余的部分，pinia操作更简单，typescript更友好，api实现更简单

**如何创建一个基本的 Pinia store？举例。**

可以通过 pinia中的defineStore函数，第一个参数是模块名称，第二个参数是一个对象

```javascript
const pinia = defineStore('counter',{
  state:()=>({
    count:0
  }),
  getters:{
    double:(state)=>state.count *2
  },
  actions:{
    increment(){
      this.count++
    }
  }
})
```

**store 的 `state`、`getters`、`actions` 分别是什么角色？**

State : 维护一个组件树的状态值

getters：返回一个状态值的计算结果，缓存，可以避免昂贵和重复的计算

acions：修改状态值的方法

**如何在组件中使用 store？**

在组件内引用创建的store 通过调用store中的actions方法

**Pinia 与组件组合函数（composables）如何配合？**

:

**如何在 Pinia 中进行异步操作？（示例）**

可以在actions定义的函数执行异步操作 （async await）

**如何持久化 Pinia 的 state？有什么常用方案？**

storage

**如何在组件中只监听 store 的某个字段变化？**

使用 watch

**Pinia 的热重载（HMR）如何工作？**

开发模式下 可以实现热重载 以来开发工具构建

**如何在多个组件间共享同一个 store 实例？**

在不同组件中都使用引入 useStore

**Pinia 是否支持模块化命名空间（namespaced）？**

天然支持模块化 每一个defineStore都是唯一的

**如何在 setup 外部使用 store（例如在普通 JS 文件）？**

在注册完成组件实例后就可以调用

**如何在 Pinia 中实现依赖注入（store 之间互用）？**

可以通过$subscribe订阅其他store 变化 参数（mutation,state）

**Pinia 的 `mapState` / `mapActions` 如何在 Options API 中使用？**

mapState和mapActions 适用于组合式api的结构
mapState 将getters 映射为compute
mapActions 将actions映射为methods

**Pinia 与 Vue 组件的 devtools 集成如何开启？**

:

**如何在 SSR 场景下使用 Pinia？**

与nuxt组合

**什么是 `storeToRefs`？为什么要使用？**

将store中的reactive和ref转位refs，便于解构并保持响应性

**如何对 Pinia 的 state 进行类型约束（TypeScript）？**
:

**Pinia 的插件机制是如何工作的？**

通过.use一个包含可选上下文context {pinia,app,state,options} 的函数来实现对store的修改和扩展
