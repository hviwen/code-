

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
