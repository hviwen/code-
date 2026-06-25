# store 的 `state`、`getters`、`actions` 分别是什么角色？

> 来源：`docs/pinia/pinia_part_1_answer.md`

## 问题本质解读

这道题考察Pinia store架构的核心概念，面试官想了解你是否理解状态管理的基本模式。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. "acions"应为"actions"
2. 缺少具体的使用场景和代码示例

## 知识点系统梳理

State : 维护一个组件树的状态值

getters：返回一个状态值的计算结果，缓存，可以避免昂贵和重复的计算

acions：修改状态值的方法

### 问题本质解读 这道题考察Pinia store架构的核心概念，面试官想了解你是否理解状态管理的基本模式。

### 技术错误纠正
1. "acions"应为"actions"
2. 缺少具体的使用场景和代码示例

### 知识点系统梳理

**State（状态）：**
- 存储应用的数据
- 必须是函数返回对象（支持SSR）
- 响应式的，变化会自动更新视图

**Getters（计算属性）：**
- 基于state计算衍生数据
- 具有缓存特性，依赖不变时不重新计算
- 可以访问其他getters
- 支持传参（返回函数）

**Actions（动作）：**
- 修改state的唯一方式
- 支持异步操作
- 可以调用其他actions
- 可以访问整个store实例

### 实战应用举例
```javascript
export const useShoppingCartStore = defineStore('shoppingCart', {
  // State - 存储购物车数据
  state: () => ({
    items: [], // 商品列表
    isLoading: false, // 加载状态
    discount: 0, // 折扣
    shippingFee: 10 // 运费
  }),

  // Getters - 计算衍生数据
  getters: {
    // 商品总数
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    // 商品总价
    subtotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    // 折扣金额
    discountAmount() {
      return this.subtotal * this.discount
    },

    // 最终总价
    total() {
      return this.subtotal - this.discountAmount + this.shippingFee
    },

    // 带参数的getter - 查找特定商品
    getItemById: (state) => (id) => {
      return state.items.find(item => item.id === id)
    },

    // 访问其他getter
    formattedTotal() {
      return `$${this.total.toFixed(2)}`
    }
  },

  // Actions - 修改状态的方法
  actions: {
    // 添加商品
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        })
      }
    },

    // 移除商品
    removeItem(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    // 更新数量
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    // 异步操作 - 应用优惠券
    async applyCoupon(couponCode) {
      this.isLoading = true

      try {
        const response = await api.validateCoupon(couponCode)
        this.discount = response.discount
        return { success: true, message: 'Coupon applied successfully' }
      } catch (error) {
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // 清空购物车
    clearCart() {
      this.items = []
      this.discount = 0
    },

    // 调用其他actions
    async checkout() {
      if (this.totalItems === 0) {
        throw new Error('Cart is empty')
      }

      try {
        const orderData = {
          items: this.items,
          total: this.total,
          discount: this.discountAmount
        }

        const order = await api.createOrder(orderData)
        this.clearCart() // 调用其他action
        return order
      } catch (error) {
        throw new Error(`Checkout failed: ${error.message}`)
      }
    }
  }
})
```

**使用场景对比：**

| 概念 | 适用场景 | 示例 | 
|------|----------|------|
| **State** | 应用全局状态 | 用户信息、主题设置、购物车数据 |
| | 多组件共享数据 | 产品列表、通知消息、系统配置 |
| | 持久化数据 | 用户偏好、表单暂存、应用设置 |
| **Getters** | 数据过滤和转换 | 过滤待办事项、格式化日期 |
| | 复杂计算 | 购物车总价、统计数据、图表数据 |
| | 组合多个状态 | 用户权限检查、数据聚合 |
| **Actions** | API交互 | 数据获取、表单提交、认证操作 |
| | 复杂业务逻辑 | 结账流程、多步操作、状态机 |
| | 异步操作 | 定时任务、WebSocket、批量处理 |

### 记忆要点总结
- **State**: 响应式数据存储，函数返回对象，修改会触发视图更新
- **Getters**: 计算属性，自动缓存，可组合，可传参，不修改state
- **Actions**: 业务逻辑容器，异步操作处理，直接修改state，可互相调用
- **数据流向**: State → Getters → 组件 → Actions → State（单向数据流）
- **命名规范**: state用名词，getters用形容词/is前缀，actions用动词

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

可以继续追问：store 的 `state`、`getters`、`actions` 分别是什么角色？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
