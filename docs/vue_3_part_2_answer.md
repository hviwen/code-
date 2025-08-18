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



**解释 `reactive` 与 `Proxy` 的实现优势与限制。**

vue3采用Proxy实现代理的底层逻辑，通过对数据的代理在数据读取或者修改时做时时监听，收集依赖。reactive包装一个对象实现响应式，深层递归对象的每个子属性实现响应式。
优势：

限制：



**如何实现防抖/节流的 composable？要注意依赖问题吗？**

组合函数实现逻辑复用，可以在组合函数内部函数调用上使用节流和防抖，实现调用优化。
依赖问题：



**如何用 `markRaw` 或 `toRaw` 优化性能或避免代理问题？**

markRaw：为标记数据禁止被包装为代理对象，通常用引入第三方库时，不改变其对象数据

toRaw：将响应式数据转为非代理对象

优化性能：

避免代理：



**解释 `render` 函数与 JSX 的应用场景及优缺点。**

Render 出现在选项式api中，是字符串模版的一种代替

JSX 为单文件系统结构，聚合结构更加明显



**如何避免大型列表渲染的性能问题？有什么技巧？**

1. 可以将重复的计算放置到computed中缓存
2. 可以使用虚拟列表
3. 引入更成熟的第三方库 vue-virtual-scroller



**解释 `watch` 中的 `flush` 选项（pre/post/sync）有何不同？**

flush:

pre： 组件首次加载完更新完DOM后调用

post：在监听器回调中访问被Vue更新之后的DOM

sync：在监听器回调中访问被Vue更新之前的DOM



**如何实现一个带取消功能的异步操作（例如按键触发的请求）？**

可以实现一个异步调用的组合函数，在其中使用 AbortCtrollor，可以根据不同的情况来出发请求终止



**当一个 reactive 对象的属性被替换时（整体赋值），如何保证视图更新？**

:



**如何测试 Vue 3 组件（单元测试）？常用工具和策略。**

[Vitest](https://vitest.dev/)



