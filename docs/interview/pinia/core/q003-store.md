# 如何在组件中使用 store？

> 来源：`docs/pinia/pinia_part_1_answer.md`

## 问题本质解读

这道题考察Pinia在Vue组件中的具体使用方法，面试官想了解你是否掌握不同的使用模式。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

在组件内引用创建的store 通过调用store中的actions方法

### 问题本质解读 这道题考察Pinia在Vue组件中的具体使用方法，面试官想了解你是否掌握不同的使用模式。

### 知识点系统梳理

**基本使用方式：**
```vue
<template>
  <div class="shopping-cart">
    <!-- 直接访问store -->
    <h2>购物车 ({{ store.totalItems }} 件商品)</h2>
    <p>总价: {{ store.formattedTotal }}</p>

    <!-- 使用解构的响应式数据 -->
    <div v-for="item in items" :key="item.id" class="cart-item">
      <span>{{ item.name }}</span>
      <span>${{ item.price }}</span>
      <input
        v-model.number="item.quantity"
        @change="updateQuantity(item.id, item.quantity)"
        type="number"
        min="1"
      />
      <button @click="removeItem(item.id)">删除</button>
    </div>

    <button @click="handleCheckout" :disabled="isLoading">
      {{ isLoading ? '处理中...' : '结账' }}
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useShoppingCartStore } from '@/stores/shoppingCart'

// 获取store实例
const store = useShoppingCartStore()

// 解构响应式数据（必须使用storeToRefs）
const { items, isLoading, totalItems } = storeToRefs(store)

// 解构actions（不需要storeToRefs）
const { addItem, removeItem, updateQuantity, checkout } = store

// 使用actions
const handleCheckout = async () => {
  try {
    const order = await checkout()
    console.log('Order created:', order)
  } catch (error) {
    console.error('Checkout failed:', error.message)
  }
}
</script>
```

**不同使用模式：**
```javascript
// 1. 直接使用store实例
export default {
  setup() {
    const cartStore = useShoppingCartStore()

    // 直接访问
    const addProduct = (product) => {
      cartStore.addItem(product)
    }

    return {
      cartStore,
      addProduct
    }
  }
}

// 2. 解构使用（推荐）
export default {
  setup() {
    const cartStore = useShoppingCartStore()

    // 响应式数据需要storeToRefs
    const { items, totalItems, total } = storeToRefs(cartStore)

    // actions直接解构
    const { addItem, removeItem } = cartStore

    return {
      items,
      totalItems,
      total,
      addItem,
      removeItem
    }
  }
}

// 3. 在Options API中使用
import { mapState, mapActions } from 'pinia'
import { useShoppingCartStore } from '@/stores/shoppingCart'

export default {
  computed: {
    // 映射state和getters
    ...mapState(useShoppingCartStore, ['items', 'totalItems', 'total']),

    // 或者使用对象形式重命名
    ...mapState(useShoppingCartStore, {
      cartItems: 'items',
      itemCount: 'totalItems'
    })
  },

  methods: {
    // 映射actions
    ...mapActions(useShoppingCartStore, ['addItem', 'removeItem']),

    // 或者重命名
    ...mapActions(useShoppingCartStore, {
      add: 'addItem',
      remove: 'removeItem'
    })
  }
}
```

**使用场景对比：**

| 使用模式 | 适用场景 | 优缺点 |
|----------|----------|--------|
| **直接使用整个store** | 简单组件，操作较少 | ✅ 简单直观<br>❌ 模板中引用冗长 |
| **解构store** | 复杂组件，频繁操作 | ✅ 代码精简，使用方便<br>❌ 需要记住storeToRefs |
| **使用mapState/mapActions** | Options API组件 | ✅ 与Vue 2风格一致<br>❌ 不如Composition API灵活 |
| **在Composables中使用** | 业务逻辑复用 | ✅ 高度可复用<br>✅ 关注点分离 |

### 记忆要点总结
- **导入方式**: import { useXxxStore } from '@/stores/xxx'
- **实例获取**: const store = useXxxStore()
- **响应式解构**: storeToRefs(store) 保持响应性
- **方法解构**: 直接从store解构actions
- **组合使用**: 可以在一个组件中使用多个store
- **映射方法**: mapState、mapActions 用于Options API

### 记忆要点总结
- 基本用法：const store = useStore()
- 解构数据：storeToRefs(store) 保持响应性
- 解构方法：直接从store解构actions
- Options API：使用mapState和mapActions

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

可以继续追问：如何在组件中使用 store？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
