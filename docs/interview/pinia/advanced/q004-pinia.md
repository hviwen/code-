# 原题：Pinia 中如何实现模块之间的依赖注入且避免循环依赖？

> 来源：`docs/pinia/pinia_part_2_answer.md`

## 问题本质解读

考察 store 间依赖管理和循环依赖的预防策略（抽离、延迟、订阅）。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 拼写错误 `$subsurice` → `$subscribe`。
- 不应该建议为每个组件创建独立 store；应按业务域设计 store。

## 知识点系统梳理

### 原始答案（保留，不作修改）

将复用逻辑抽离封装到组合函数中~~，每一个store id只维护当前组件的状态数据。~~

如果需要监听其他store的数据变化，可以使用订阅（$subsurice)的方式来获取其他store中数据的变化

### 问题本质解读 考察 store 间依赖管理和循环依赖的预防策略（抽离、延迟、订阅）。

### 技术错误纠正

- 拼写错误 `$subsurice` → `$subscribe`。
- 不应该建议为每个组件创建独立 store；应按业务域设计 store。

### 知识点系统梳理
- 避免循环依赖：抽离到 composable、延迟 `useOtherStore()`（在函数内）、使用订阅事件或中介者。
- `defineStore` 的惰性特性可用来按需获取实例。

### 实战应用举例
```ts
// 1. 问题示例：循环依赖
// userStore.js
import { useCartStore } from './cartStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    // ...
  }),
  actions: {
    checkout() {
      // 直接引用可能导致循环依赖
      const cartStore = useCartStore()
      // ...
    }
  }
})

// cartStore.js
import { useUserStore } from './userStore'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // ...
  }),
  actions: {
    addToCart() {
      // 直接引用导致循环依赖
      const userStore = useUserStore()
      // ...
    }
  }
})

// 2. 解决方案一：延迟引用 - 在方法内部引用
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    addToCart(product) {
      // 仅在需要时引用，避免模块顶层循环依赖
      const userStore = useUserStore()
      
      // 检查用户权限
      if (!userStore.isLoggedIn) {
        userStore.redirectToLogin()
        return
      }
      
      this.items.push(product)
    }
  }
})

// 3. 解决方案二：共享逻辑抽离到组合函数
// shared/useAuth.js
export function useAuth() {
  return {
    checkPermission(permission) {
      // 权限检查逻辑
    },
    // 其他共享逻辑
  }
}

// userStore.js - 不再直接引用 cartStore
export const useUserStore = defineStore('user', {
  // ...
  actions: {
    checkout() {
      // 使用共享逻辑
      const { checkPermission } = useAuth()
      if (!checkPermission('checkout')) return false
      
      // 操作自身状态
      this.lastCheckout = new Date()
      // ...
    }
  }
})

// 4. 解决方案三：使用事件机制解耦
// 创建一个事件总线
export const storeBus = mitt()

// userStore.js - 通过事件响应而非直接引用
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    login(credentials) {
      // 登录逻辑...
      this.user = await api.login(credentials)
      
      // 发出登录成功事件，而非直接调用其他 store
      storeBus.emit('user:login', this.user)
    }
  }
})

// cartStore.js - 监听事件
export const useCartStore = defineStore('cart', () => {
  // store 状态...
  
  // 设置事件监听
  onMounted(() => {
    storeBus.on('user:login', (user) => {
      // 响应用户登录事件
      fetchSavedCart(user.id)
    })
  })
  
  // 记得清理
  onUnmounted(() => {
    storeBus.off('user:login')
  })
  
  // ...
})

// 5. 解决方案四：使用依赖注入模式
// storeContainer.js
export const stores = {
  user: null,
  cart: null,
  // 其他 store
}

// userStore.js
export const useUserStore = defineStore('user', {
  // ...
})

// 注册 store 到容器
stores.user = useUserStore()

// 在需要时从容器中获取
function someFunction() {
  const userStore = stores.user
  const cartStore = stores.cart
  // ...
}
```

**依赖关系设计模式对比：**

| 设计模式 | 优点 | 缺点 | 适用场景 |
|---------|-----|-----|---------|
| **延迟引用** | 简单直接<br>保留TypeScript类型 | 只解决循环导入<br>不解决逻辑耦合 | 简单项目<br>依赖关系较少 |
| **组合函数抽离** | 高度复用<br>逻辑解耦 | 可能过度抽象<br>状态分散 | 多个store共享逻辑<br>需要跨组件复用 |
| **事件驱动** | 完全解耦<br>可扩展性高 | 追踪流程困难<br>隐式依赖 | 复杂交互<br>多个模块响应同一事件 |
| **依赖注入容器** | 显式依赖<br>可控制注入时机 | 额外复杂度<br>容器管理 | 大型应用<br>需要可测试性 |
| **中介者模式** | 集中控制<br>可追踪性好 | 中介者复杂化<br>单点故障 | 多对多依赖<br>需要协调多个store |

### 记忆要点总结
- **循环依赖问题本质**：Store A 引用 Store B，同时 Store B 引用 Store A，导致初始化死锁
- **解决策略**：
  - **代码组织层面**：
    - 将共享逻辑抽离到独立的组合函数
    - 在函数内部而非模块顶层引用其他 store
    - 按领域正确划分 store 责任边界
  - **架构设计层面**：
    - 使用事件总线实现 store 间通信，解除直接依赖
    - 采用依赖注入容器统一管理 store 实例
    - 使用中介者模式处理复杂的 store 交互
- **最佳实践**：
  - 避免 store 之间过度耦合，每个 store 专注于自己的职责
  - 状态共享优先使用 getters，而非直接引用
  - 复杂交互考虑引入专门的协调器 store

----

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：原题：Pinia 中如何实现模块之间的依赖注入且避免循环依赖？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
