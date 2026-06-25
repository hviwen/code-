# 如何创建一个自定义指令（directive）？举例 `v-focus`。

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue自定义指令的创建和使用，面试官想了解你是否能扩展Vue的模板功能。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. `app.dirrective` 应为 `app.directive`
2. `el.foucs()` 应为 `el.focus()`
3. 缺少完整的指令生命周期说明

## 知识点系统梳理

```javascript
app.directive('focus',{
  mounted(el){
    el.focus()
  }
})
```

### 问题本质解读 这道题考察Vue自定义指令的创建和使用，面试官想了解你是否能扩展Vue的模板功能。

### 技术错误纠正
1. `app.dirrective` 应为 `app.directive`
2. `el.foucs()` 应为 `el.focus()`
3. 缺少完整的指令生命周期说明

### 知识点系统梳理

**指令生命周期钩子：**
- `created`: 在绑定元素的attribute或事件监听器被应用之前调用
- `beforeMount`: 当指令第一次绑定到元素并且在挂载父组件之前调用
- `mounted`: 在绑定元素的父组件被挂载后调用
- `beforeUpdate`: 在更新包含组件的VNode之前调用
- `updated`: 在包含组件的VNode及其子组件的VNode更新后调用
- `beforeUnmount`: 在卸载绑定元素的父组件之前调用
- `unmounted`: 当指令与元素解除绑定且父组件已卸载时调用

### 实战应用举例
```javascript
// 1. 全局注册自定义指令
const app = createApp({})

// v-focus指令 - 自动聚焦
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// v-color指令 - 动态颜色
app.directive('color', {
  mounted(el, binding) {
    el.style.color = binding.value
  },
  updated(el, binding) {
    el.style.color = binding.value
  }
})

// v-permission指令 - 权限控制
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding
    const userPermissions = getCurrentUser().permissions

    if (!userPermissions.includes(value)) {
      el.style.display = 'none'
      // 或者 el.remove()
    }
  }
})

// v-lazy指令 - 图片懒加载
app.directive('lazy', {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
  }
})

// v-debounce指令 - 防抖
app.directive('debounce', {
  mounted(el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
      }, binding.arg || 300)
    })
  }
})

// 2. 局部注册（组件内）
export default {
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  }
}
```

```vue
// 3. 组合式API中使用
<script setup>
// 必须以v开头
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <!-- 使用自定义指令 -->
  <input v-focus />
  <div v-color="'red'">红色文字</div>
  <button v-permission="'admin'">管理员按钮</button>
  <img v-lazy="imageUrl" />
  <button v-debounce:500="handleClick">防抖按钮</button>
</template>
```

**指令参数和修饰符：**
```javascript
// 复杂指令示例
app.directive('scroll', {
  mounted(el, binding) {
    const { value, arg, modifiers } = binding

    // v-scroll:y.passive="handleScroll"
    // arg: 'y'
    // modifiers: { passive: true }
    // value: handleScroll函数

    const options = {
      passive: modifiers.passive
    }

    const eventName = arg === 'y' ? 'scroll' : 'wheel'
    el.addEventListener(eventName, value, options)
  },

  beforeUnmount(el, binding) {
    const { value, arg } = binding
    const eventName = arg === 'y' ? 'scroll' : 'wheel'
    el.removeEventListener(eventName, value)
  }
})
```

**常见自定义指令场景：**
1. **DOM操作**: 聚焦、滚动、拖拽
2. **权限控制**: 按钮权限、内容显示
3. **性能优化**: 懒加载、防抖节流
4. **用户体验**: 点击外部关闭、长按事件
5. **数据处理**: 格式化显示、输入限制

### 记忆要点总结
- 注册方式：全局app.directive()、局部directives选项
- 生命周期：mounted、updated、unmounted等
- 参数获取：binding.value、binding.arg、binding.modifiers
- 使用场景：DOM操作、权限控制、性能优化

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

可以继续追问：如何创建一个自定义指令（directive）？举例 `v-focus`。 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
