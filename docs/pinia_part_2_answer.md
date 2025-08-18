**如何给 Pinia 写一个插件（插件 API 简述）？**

```javascript
const piniaPlugin = ({store,app,pinia,options}) => {
  //
  
  return {
    store.hello = 'world'
  }
}

pinia.use(piniaPlugin)
```



**如何为 Pinia 实现持久化插件（大概思路）？**

可以通过实现组合函数，在localStorage/SessionStorage 中实现数据的本地化存储。

也可以使用 pinia-plugin-persistedstate 来实现



**如何在服务端渲染中同步 Pinia 状态（hydrate）？**

：使用nuxt



**Pinia 中如何实现模块之间的依赖注入且避免循环依赖？**

将复用逻辑抽离封装到组合函数中，每一个store id只维护当前组件的状态数据。

如果需要监听其他store的数据变化，可以使用订阅（$subsurice)的方式来获取其他store中数据的变化



**如何对 Pinia store 做权限/隔离（多租户或不同用户）？**

根据身份建立多个不同的store，然后将身份切换的逻辑抽离成公共部分，并监听身份状态的变化



**如何对 Pinia 的 actions 做事务化（批量回滚）？**

可以实现序列化缓存 根据cacheKey，回滚到相应的节点



**在大型项目中，如何组织 Pinia 的 store 文件结构？**

每个单独的组件使用一个单独的store，公共部分抽离出来，index中id化



**如何为 Pinia store 编写单元测试？（思路）**

：



**如何在 Pinia 中监听 state 变化并触发副作用（subscribe）？**

通过

```javascript
store.$subscribe((mutation，state)=>{

  // mutation包含：type paylod storeId
  // 接收到这些变化后可以更新state
})
```



**Pinia 如何支持按需加载 store（动态注册）？**

defineStore是惰性注册的
