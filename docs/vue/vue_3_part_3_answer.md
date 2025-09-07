105. **解释 Vue 3 响应式系统的核心数据结构（effect、dep、targetMap）。**

- 响应式是通过Es6新增的Proxy代理在数据读写等操作情况下进行依赖收集和响应触发来实现数据的响应式

- effect 是副作用函数 用来触发响应时执行

```javascript
let activeEffect = null
const targetMap = new WeakMap()

function track(target, key) {
  if (!activeEffect) return

  let depMap = targetMap.get(target)
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()))
  }
  let dep = depMap.get(key)
  if (!dep) {
    depMap.set(key, (dep = new Set()))
  }
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

function trigger(target, key) {
  let depMap = targetMap.get(target)
  if (!depMap) return
  let dep = depMap.get(key)
  if (!dep) return

  dep.forEach(effect => {
    if (effect !== activeEffect) {
      effect()
    }
  })
}

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    effectFn.deps = []
    fn()
    activeEffect = null
  }
  effectFn()
  return effectFn
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    },
  })
}
```

105. **描述虚拟 DOM（VNode）在 Vue 中的生命周期，从创建到打补丁（patch）。**



105. **解释 Vue 的调度器（scheduler）与微任务队列，为什么 `nextTick` 有时表现为异步？**

106. **Vue 编译器如何处理模板指令（简述 transform & codegen 流程）？**

107. **描述 Pinia store 的内部注册与 state 响应化过程（高层次）。**

108. **Vue Router 的路由匹配（matcher）大致是如何实现的？（高层）**
