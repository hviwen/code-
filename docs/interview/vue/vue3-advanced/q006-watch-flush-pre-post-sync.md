# 解释 `watch` 中的 `flush` 选项（pre/post/sync）有何不同？

> 来源：`docs/vue/vue_3_part_2_answer.md`

## 问题本质解读

这道题考察Vue 3的watch执行时机控制，面试官想了解你是否理解Vue的更新周期和DOM操作时机。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. pre的描述不准确，应该是在组件更新之前执行
2. 缺少具体的使用场景和代码示例

## 知识点系统梳理

~~flush:~~

~~pre： 组件首次加载完更新完DOM后调用~~

~~post：在监听器回调中访问被Vue更新之后的DOM~~

~~sync：在监听器回调中访问被Vue更新之前的DOM~~

### 问题本质解读 这道题考察Vue 3的watch执行时机控制，面试官想了解你是否理解Vue的更新周期和DOM操作时机。

### 技术错误纠正
1. pre的描述不准确，应该是在组件更新之前执行
2. 缺少具体的使用场景和代码示例

### 知识点系统梳理

**flush选项详解：**
- **pre（默认）**: 在组件更新之前执行，此时DOM还未更新
- **post**: 在组件更新之后执行，可以访问更新后的DOM
- **sync**: 同步执行，在响应式数据变化时立即执行

### 实战应用举例
```javascript
export default {
  setup() {
    const count = ref(0)
    const message = ref('Hello')
    const elementRef = ref(null)

    // 1. pre（默认）- 组件更新前执行
    watch(count, (newVal, oldVal) => {
      console.log('pre: count changed', newVal)
      // 此时DOM还未更新，elementRef.value.textContent还是旧值
      console.log('DOM content:', elementRef.value?.textContent)
    }, { flush: 'pre' })

    // 2. post - 组件更新后执行
    watch(count, (newVal, oldVal) => {
      console.log('post: count changed', newVal)
      // 此时DOM已更新，可以访问新的DOM状态
      console.log('Updated DOM content:', elementRef.value?.textContent)

      // 适合做DOM操作
      if (newVal > 5) {
        elementRef.value.style.color = 'red'
      }
    }, { flush: 'post' })

    // 3. sync - 同步执行
    watch(message, (newVal, oldVal) => {
      console.log('sync: message changed immediately', newVal)
      // 在数据变化的同一个tick内执行
      // 注意：可能会影响性能，谨慎使用
    }, { flush: 'sync' })

    // 实际应用场景
    const handleCountChange = () => {
      count.value++
      console.log('After count++')
      // 执行顺序：sync -> pre -> 组件更新 -> post
    }

    return {
      count,
      message,
      elementRef,
      handleCountChange
    }
  }
}

// 具体使用场景
const practicalExamples = {
  // 场景1：表单验证（pre）
  formValidation: {
    setup() {
      const formData = reactive({ email: '', password: '' })
      const errors = reactive({})

      watch(formData, (newData) => {
        // 在DOM更新前验证，避免闪烁
        errors.email = validateEmail(newData.email)
        errors.password = validatePassword(newData.password)
      }, { flush: 'pre', deep: true })

      return { formData, errors }
    }
  },

  // 场景2：DOM操作（post）
  domManipulation: {
    setup() {
      const items = ref([])
      const containerRef = ref(null)

      watch(items, () => {
        // DOM更新后计算容器高度
        nextTick(() => {
          const height = containerRef.value.scrollHeight
          console.log('Container height:', height)
        })
      }, { flush: 'post' })

      return { items, containerRef }
    }
  },

  // 场景3：性能监控（sync）
  performanceMonitoring: {
    setup() {
      const apiCalls = ref(0)

      watch(apiCalls, (newCount) => {
        // 立即记录API调用次数
        performance.mark(`api-call-${newCount}`)

        if (newCount > 100) {
          console.warn('API calls exceeded limit')
        }
      }, { flush: 'sync' })

      return { apiCalls }
    }
  }
}
```

**执行时机对比：**
```javascript
// 执行顺序演示
export default {
  setup() {
    const data = ref(0)

    // 同步执行
    watch(data, () => console.log('1. sync'), { flush: 'sync' })

    // 组件更新前
    watch(data, () => console.log('2. pre'), { flush: 'pre' })

    // 组件更新后
    watch(data, () => console.log('4. post'), { flush: 'post' })

    const updateData = () => {
      console.log('开始更新数据')
      data.value++
      console.log('3. 组件更新中...')
      // 输出顺序：
      // 开始更新数据
      // 1. sync
      // 2. pre
      // 3. 组件更新中...
      // 4. post
    }

    return { data, updateData }
  }
}
```

### 记忆要点总结
- pre：组件更新前，适合数据预处理、验证
- post：组件更新后，适合DOM操作、尺寸计算
- sync：立即执行，适合性能监控、日志记录
- 选择原则：根据是否需要访问更新后的DOM来选择

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

可以继续追问：解释 `watch` 中的 `flush` 选项（pre/post/sync）有何不同？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
