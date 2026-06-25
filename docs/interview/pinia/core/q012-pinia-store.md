# 如何在 Pinia 中实现依赖注入（store 之间互用）？

> 来源：`docs/pinia/pinia_part_1_answer.md`

## 问题本质解读

这道题考察Pinia中store间的依赖关系处理，面试官想了解你是否掌握复杂状态管理的设计模式。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. $subscribe主要用于监听变化，不是依赖注入的主要方式
2. 缺少store间直接调用的说明

## 知识点系统梳理

~~可以通过$subscribe订阅其他store 变化 参数（mutation,state）~~

### 问题本质解读 这道题考察Pinia中store间的依赖关系处理，面试官想了解你是否掌握复杂状态管理的设计模式。

### 技术错误纠正

1. $subscribe主要用于监听变化，不是依赖注入的主要方式
2. 缺少store间直接调用的说明

### 实战应用举例
```javascript
// 1. 直接在store中使用其他store
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  actions: {
    async addItem(productId, quantity) {
      // 直接使用其他store
      const productStore = useProductStore()
      const userStore = useUserStore()

      // 检查用户权限
      if (!userStore.isLoggedIn) {
        throw new Error('Please login first')
      }

      // 获取产品信息
      const product = await productStore.getProduct(productId)

      // 检查库存
      if (product.stock < quantity) {
        throw new Error('Insufficient stock')
      }

      // 添加到购物车
      this.items.push({
        productId,
        quantity,
        price: product.price,
        name: product.name
      })

      // 更新产品库存
      productStore.updateStock(productId, -quantity)
    }
  }
})

// 2. 使用组合式函数封装依赖关系
export function useOrderManagement() {
  const cartStore = useCartStore()
  const userStore = useUserStore()
  const paymentStore = usePaymentStore()
  const inventoryStore = useInventoryStore()

  const createOrder = async (orderData) => {
    // 验证用户
    if (!userStore.isLoggedIn) {
      throw new Error('User not logged in')
    }

    // 检查购物车
    if (cartStore.items.length === 0) {
      throw new Error('Cart is empty')
    }

    // 验证库存
    for (const item of cartStore.items) {
      const available = await inventoryStore.checkStock(item.productId)
      if (available < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`)
      }
    }

    // 处理支付
    const paymentResult = await paymentStore.processPayment({
      amount: cartStore.total,
      userId: userStore.user.id
    })

    if (paymentResult.success) {
      // 清空购物车
      cartStore.clear()

      // 更新库存
      for (const item of cartStore.items) {
        inventoryStore.reduceStock(item.productId, item.quantity)
      }

      return paymentResult.orderId
    }
  }

  return {
    createOrder
  }
}

// 3. 使用$subscribe实现store间通信
export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),

  actions: {
    init() {
      // 监听用户store的变化
      const userStore = useUserStore()
      userStore.$subscribe((mutation, state) => {
        if (mutation.type === 'direct' && mutation.events.key === 'isLoggedIn') {
          if (state.isLoggedIn) {
            this.addNotification({
              type: 'success',
              message: 'Welcome back!'
            })
          } else {
            this.addNotification({
              type: 'info',
              message: 'You have been logged out'
            })
          }
        }
      })

      // 监听购物车变化
      const cartStore = useCartStore()
      cartStore.$subscribe((mutation, state) => {
        if (mutation.type === 'direct' && mutation.events.key === 'items') {
          const itemCount = state.items.length
          if (itemCount > 0) {
            this.addNotification({
              type: 'info',
              message: `Cart updated: ${itemCount} items`
            })
          }
        }
      })
    }
  }
})
```

**使用场景对比：**

| 使用场景 | 推荐方案 | 优缺点 |
|----------|----------|--------|
| **简单的store互用** | 直接导入 | ✅ 简单直观<br>✅ 开发效率高<br>❌ 可能造成隐式依赖 |
| **复杂业务逻辑** | Composables封装 | ✅ 代码复用性高<br>✅ 关注点分离<br>✅ 测试友好 |
| **跨组件通信** | $subscribe机制 | ✅ 松耦合<br>✅ 响应式更新<br>❌ 间接性强 |
| **大型应用架构** | 分层设计 | ✅ 维护性好<br>✅ 可扩展性强<br>❌ 初始设计成本高 |

### 记忆要点总结
- **直接调用**: 在store的actions中直接使用其他store，最简单但要注意循环依赖
- **组合封装**: 使用composables封装复杂的store间交互，便于测试和复用
- **事件监听**: 使用$subscribe监听其他store的变化，实现松耦合通信
- **依赖管理**: 
  - 避免循环依赖问题
  - 考虑分层架构（数据层、领域层、UI层）
  - 使用依赖注入思想减少硬编码依赖
- **最佳实践**:
  - 明确store间的依赖关系
  - 在较大项目中绘制store依赖图
  - 考虑使用模块化设计减少耦合

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在 Pinia 中实现依赖注入（store 之间互用）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
