**什么是 `ref`，与 `reactive` 的区别？**

Ref是vue中响应式声明的一个函数，它接收一个原始值作为参数，返回一个带有。value的响应式值。这个值在计算时需要使用。value，在模板中可以自动解包。

reactive也是响应式声明的函数。它接收的是一个对象。



**如何创建一个计算属性（computed）？它与 `watch` 的区别是什么？**

computed 是vue中创建计算属性的函数，它自动返回响应式计算的结果。包含get和set两个内置方法可以定义。set在修改这计算值时使用，get在获取计算值时使用。

watch时vue中的监听器，他监听一个响应式值的改变，而做出相应的改变。可以在第一次定义时监听，立即；也可以是监听响应式值的内部结构的变化，深度；也可以在实现延迟反应、提前反应。可以接受监听值更新时新旧两个值。

computed 只是根据多个响应式值变化，做出对应变化后的计算结果。

watch可以监听任意单个或者多个响应式值的变化，而做出响应的处理。



**`setup()` 的执行时机是什么？能访问 `this` 吗？**

setup() 是vue3选项式api结构中的内容，可以接受props和上下文对象。在页面创建之初执行。不能访问this，因为实例还没有加载



**如何在 `script setup` 中定义 props 和 emits？**

可以使用 defineProps 和 defineEmits 中以对象和数组的形式来定义



**`v-if` 与 `v-show` 的区别？**

v-if用于逻辑判断，逻辑为false的组件将不展示。dom不渲染。变换为true时将重新渲染dom

v-show用于组件的展示和隐藏。隐藏时视觉上看不到，但是dom结构依然存在。



**`v-for` 上为什么需要 `key`？如何选择 key？**

循环相同结构的组件，需要对每个组件标识身份，以提高dom操作的可靠性。key要避免是一个对象类型，会被解析成字符串结构。导致每一个key都相同。key可以是遍历中的顺序编号，或者遍历内容的id。



**如何在父组件向子组件传入回调事件？（基本 props & emit）**

1. 通过 v-on （@）
2. provide inject



**什么是 `provide` / `inject`？有什么使用场景？**

provide 和 inject 是vue中突破祖孙组件数据逐层传递的方式，可以在祖父组件中通过provide传递任意类型的值，在任意子孙组件中通过inject接收。

场景：多级嵌套的部门选择组件可以使用以上方式。



**如何创建一个自定义指令（directive）？举例 `v-focus`。**



```javascript
app.dirrective('focus',{
  mounted(el){
    el.foucs()
  }
})
```



**`nextTick` 有什么用途？什么时候使用？**

nextTick() 是DOM更新完成后的回调方法。用于修改数据后计算新的DOM或者操作DOM



**`teleport` 的用途是什么？如何使用？**

teleport用于将内层组件指向外部组件渲染。通常在内层组件布局结构较小，需要展示更大的组件空间时使用。

可以通过to指向到外层任意节点上



**`Suspense` 组件的基本作用是什么？**

suspense组件主要是为其内部子组件提供等待显示，当内容子组件内容没有加载完成时为pending状态，显示loading状态。当加载完成后为resolve，显示子组件内容。当子组件加载错误时，状态为fall，显示fallback 错误提示内容。主要作用为提升交互体验。



**模板中如何使用 `v-model` 在子组件进行双向绑定？**

在输入型组件：input，textarea、radio、select等组件中通过v-model将值绑定，就实现了双向绑定。

本质上是简化了props和emits的传递和事件响应。



**如何在组件中访问模板引用（template refs）？**

可以通过 useRefs定一个refs，然后通过在组件中ref绑定该值，就可以获取到该组件的实例，就可以通过ref来调用该组件的方法。



**`watchEffect` 与 `watch` 的区别？**

都是vue中作为监听响应式值变化的函数。

watchEffect：自动收集依赖并立即执行副作用
watch：显示监听源，并提供新旧值，用于更精准的副作用控制



**什么是 `shallowRef` 和 `shallowReactive`？**

shalowRef 是定义浅层响应式原始值

shallowReactive 是定义浅层响应式对象



**如何将响应式对象解构而不丢失响应性？**

可以在解构时使用 toRef将解构后的内容包装 不会丢失响应式



**`isRef`、`unref`、`toRaw` 分别是什么？**

isRef 判断是否是响应式值

unref 返回响应式值或者原始值

toRaw 返回响应式包装对象的原始对象



**如何防止子组件暴露过多内部实现？（组件封装）**

可以使用Expose()在setup显示暴露方法和属性



**什么是 `defineAsyncComponent`？什么时候使用？**

动态加载异步组件，用于性能优化。当某个组件暂时不在渲染内容中时，先不需要将可能用到的所有组件全部加载，而是在当需要显示的时候按需加载。



**如何在模板中绑定 class 和 style（双向/多值）？**

可以使用 :calss，：style 动态属性，以数组的方式传入多个值



**组件的 `emits` 选项有什么作用？**

用于接收父组件传递的事件方法，以数组的方式接收多个，返回一个emit可以在事件执行时调用



**如何在 Vue 3 中使用 TypeScript 定义组件 props？**

使用defineComponent 或者 defineProps



**`watch` 的 `immediate` 与 `deep` 选项分别做什么？**

immediate 是监听ref getter 数组的第一次时立即执行一次，此时的oldValue为undefined

deep时监听reactive 内嵌套属性的变化，也发生响应



**Vue 3 中如何实现组件懒加载？**

使用动态 import（）或者 defineAsyncComponent



**为什么尽量避免在模板中进行昂贵计算？有什么替代方案？**

模版中进行昂贵的计算会导致DOM更新效率变低，使得交互卡顿。

可以使用 computed 将计算结果缓存。



**如何在组件间共享逻辑（composition vs mixin）？**

可以使用组合式函数



**`Fragment` 在 Vue 3 中是什么？有什么好处？**

空标签
好处：



**如何处理表单输入与双向绑定复杂场景（自定义 `v-model`）？**

在有输入型组件如input textarea select 中使用v-model将值绑定 就可以实现双向绑定



**`effectScope` 的用途是什么？**

用途：收集暴露出来的副作用



**如何在 Vue 中捕获错误（错误边界）？**

在app中可以注册 app.config.throwUnhandledErrorInProduction 可以捕获全局抛出的异常



**什么是 `markRaw`？什么时候使用？**

讲一个对象标记为不可转为代理,返回该对象本身

有些值不需要被转为响应式的时候



**如何在模板或 setup 中调用父组件方法？**

1. 通过调用emits传递的事件方法，可以将参数传入
2. 通过父组件provide 传递事件方法，在子组件通过inject取得响应的方法并执行



**如何实现跨组件的事件总线（建议方式）？**

（是否在问数据状态同步？）

通过将状态提升到单独的store中维护 通过调用store中修改状态的方法实现状态同步

通过第三方库实现状态同步 pinia



**`v-once` 有什么作用？什么时候用？**

只执行一次

什么时候用：



**如何在组件中使用 CSS Modules 或 Scoped CSS？**

在style中使用 scoped 实现当前的样式只在当前单页组件的作用域内



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



**如何创建 Vue Router 实例（基本示例）？**

使用vue-router中的createRouter 创建

```javascript
import HomeView form './HomeView';
import AboutView form './AboutView'

const routes= [{
  path:'/',name:'home',component:HomeView,
  path:'/about',name:'about',component:AboutView
}]

const router = createRouter({
  history: createWebHistory,
  routes
})
```



**`router-link` 与 `router.push` 的区别？**

Router-link: 直接在组件上定义路由跳转，可以预加载下一页的内容。如果当前的路由栈中存在则不会重复创建

router.push：将一下页的内容推入到当前的路由栈中，不论路由栈中是否已经存在



**什么是动态路由？如何定义路由参数？**

动态路由就是相同的页面，只是由于参数不同需要在定义的路径后面加：来增加参数.

通过冒号：来提供不同的参数；也可以是自定义正则匹配

也可以通过router.addRoute() 添加新的路由地址.通过替换路由的方式实现导航。

router.removeRoute() 



**如何将路由参数作为组件 props 传入？**

当配置路由时将属性props设置为true，可以在组件中将传入内容视为参数，通过$route获取。

也可以通过命令视图、对象视图、函数视图传递props参数

也可以通过RouteView的插槽传递任意参数



**如何配置嵌套路由？举例简单结构。**

在需要嵌套父组件中添加router-view，在需要嵌套的父组件的路由配置中添加children

```javascript
<!-- App.vue -->
<template>
  <router-view />
</template>

<!-- User.vue -->
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view />
  </div>
</template>

const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```



**如何实现路由懒加载？**

在配置路由时 使用()=>import() 动态导入的方式，实现路由懒加载

也可以使用构建工具将其分组



**`beforeEach` 全局守卫的用途？它的参数是什么？**

全局守卫是路由导航前置的判断，通常用于检查是否满足导航条件

参数 （to，form，next）

返回值：boolean 、路由地址{name:'xxx'}

Next()严格只调用一次



**如何处理 404（找不到路由）？**

可以在配置路由信息中添加一个正则匹配，当不符合当前项目结构的时候，通过配置重定向到404页面



**路由中 `meta` 的作用？怎么在守卫中使用它？**

可以在配置路由信息中添加meta属性参数，通过在导航守卫中to.route.meta 来读取



**`replace` 与 `push` 的区别？**

replace 替换当前页面栈

push 添加新的页面到导航栈中



**如何在路由中控制滚动行为？**

createRouter 函数的参数中有一个 scrollBehavior,接收三个参数 to form savePosition;

然后通过返回位置对象或者位置信息来确定滚动的位置



**如何在导航失败（navigation failure）时做错误处理？**

通过全局导航守卫,检查到导航失败时留在当前页面或者重定向到首页



**`router.isReady()` 有什么用途？**

:



**如何实现命名路由并用其跳转？**

在路由注册时将name属性进行命名

Router-link : 使用to=‘name’

router.push({name:'name'})



**`alias` 与 `redirect` 的区别？**

Alias: 定义别名，可以是多个

Redirect: 重定向



**路由导航守卫的执行顺序（全局、路由独享、组件内）？**

1. 导航被触发
2. 在失活的组件里面调用 beforeRouterLeave
3. 全局导航守卫 beforEach
4. 重用的组件调用 beforeRouterUpdate
5. 在路由配置中的 beforeEnter
6. 解析异步组件
7. 在被激活的组件里调用 befroeRouterEnter
8. 调用全局的 beforeRosolve
9. 导航被确认
10. 调用全局的afterEach
11. 触发DOM更新
12. 调用beforeRouterEnter中导航守卫的next



**如何在 `<router-link>` 中设置 active-class？**

使用active-class 或者全局配置 linkActiveClass



**解释 Vue 3 响应式系统中 `track` 与 `trigger` 的作用。**

trigger 和 track 通过收集和触发依赖的配合，来实现核心的响应式监听作用。使用WeakMap Map 和Set组合的数据结构



**如何实现一个可复用的 `useFetch` composable？要考虑哪些边界情况？**

可以通过结合使用pinia的状态管理和useFetch逻辑复用实现

要考虑：

1. 加载状态
2. 请求结构 （mothod header json/form）
3. 数据返回 （数据转化 加工 过滤）
4. 错误处理（超时 异常 权限 ）
5. 缓存（重复请求，相同结构返回）

```javascript
export const useFetch = (url='',options={}){
  const data = ref(null)
  const isloading = ref(true)
  const error = ref(null)
  
  const getInfo = async () =>{
    try{
      const response = await fetch(url,options)
      if(!response.ok){
        throw new Error('Network response was not ok')
      }
      data.value = response.json()
      
    }catch(err){
      error.value = err;
    }finally{
    	isloading.value = false;
    }
  }
  getInfo()
  
  return {
    data,
    isloading,
    error
  }
}
```



`computed` 的缓存失效有哪些触发条件？

当其依赖的任意一项响应式源发生改变，computed的缓存将失效

