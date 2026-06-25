# 如何在模板中绑定 class 和 style（双向/多值）？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue模板中动态样式绑定的各种方式，面试官想了解你是否掌握灵活的样式控制技巧和最佳实践。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 拼写错误：":calss"应为":class"
2. 原答案过于简单，没有涵盖所有绑定方式
3. 缺少具体的语法示例和使用场景

## 知识点系统梳理

可以使用 :class，:style 动态属性，以数组或者对象的方式传入多个值

### 问题本质解读 这道题考察Vue模板中动态样式绑定的各种方式，面试官想了解你是否掌握灵活的样式控制技巧和最佳实践。

### 技术错误纠正
1. 拼写错误：":calss"应为":class"
2. 原答案过于简单，没有涵盖所有绑定方式
3. 缺少具体的语法示例和使用场景

### 知识点系统梳理

**class绑定方式：**
- 对象语法：`{ className: condition }`
- 数组语法：`[class1, class2]`
- 混合语法：`[class1, { class2: condition }]`
- 计算属性和方法

**style绑定方式：**
- 对象语法：`{ property: value }`
- 数组语法：`[style1, style2]`
- CSS变量绑定
- 动态样式计算

### 实战应用举例
```vue
<template>
  <div class="demo-container">
    <!-- 1. class对象语法 -->
    <div
      :class="{
        active: isActive,
        disabled: isDisabled,
        'has-error': hasError,
        'text-large': fontSize === 'large'
      }"
    >
      对象语法示例
    </div>

    <!-- 2. class数组语法 -->
    <div :class="[baseClass, themeClass, sizeClass]">
      数组语法示例
    </div>

    <!-- 3. class混合语法 -->
    <div :class="[
      baseClass,
      {
        active: isActive,
        disabled: isDisabled
      },
      conditionalClass
    ]">
      混合语法示例
    </div>

    <!-- 4. 计算属性的class -->
    <div :class="computedClasses">
      计算属性示例
    </div>

    <!-- 5. style对象语法 -->
    <div
      :style="{
        color: textColor,
        fontSize: fontSize + 'px',
        backgroundColor: bgColor,
        transform: `translateX(${offsetX}px) translateY(${offsetY}px)`,
        '--custom-property': customValue
      }"
    >
      样式对象语法
    </div>

    <!-- 6. style数组语法 -->
    <div :style="[baseStyles, themeStyles, responsiveStyles]">
      样式数组语法
    </div>

    <!-- 7. 条件样式 -->
    <div
      :style="{
        display: isVisible ? 'block' : 'none',
        opacity: isLoading ? 0.5 : 1,
        cursor: isClickable ? 'pointer' : 'default'
      }"
    >
      条件样式
    </div>

    <!-- 8. 动态主题切换 -->
    <div :class="themeClasses" :style="themeStyles">
      <h2>主题切换示例</h2>
      <button @click="toggleTheme">切换主题</button>
    </div>

    <!-- 9. 响应式样式 -->
    <div
      :class="responsiveClasses"
      :style="responsiveStyles"
    >
      响应式布局
    </div>

    <!-- 10. 动画相关样式 -->
    <div
      :class="{
        'fade-in': shouldFadeIn,
        'slide-up': shouldSlideUp,
        'bounce': shouldBounce
      }"
      :style="animationStyles"
    >
      动画元素
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'

// 基础响应式数据
const isActive = ref(true)
const isDisabled = ref(false)
const hasError = ref(false)
const isVisible = ref(true)
const isLoading = ref(false)
const isClickable = ref(true)

// 样式相关数据
const textColor = ref('#333')
const fontSize = ref(16)
const bgColor = ref('#f0f0f0')
const offsetX = ref(0)
const offsetY = ref(0)
const customValue = ref('10px')

// 类名数据
const baseClass = ref('base-component')
const themeClass = ref('theme-light')
const sizeClass = ref('size-medium')

// 主题系统
const currentTheme = ref('light')
const themes = reactive({
  light: {
    classes: ['theme-light', 'bg-white', 'text-dark'],
    styles: {
      backgroundColor: '#ffffff',
      color: '#333333',
      borderColor: '#e0e0e0'
    }
  },
  dark: {
    classes: ['theme-dark', 'bg-dark', 'text-light'],
    styles: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      borderColor: '#404040'
    }
  }
})

// 计算属性 - 复杂class逻辑
const computedClasses = computed(() => {
  const classes = ['computed-component']

  if (isActive.value) classes.push('active')
  if (isDisabled.value) classes.push('disabled')
  if (hasError.value) classes.push('error')

  // 根据不同条件添加不同类名
  if (fontSize.value > 18) classes.push('large-text')
  if (fontSize.value < 14) classes.push('small-text')

  return classes
})

// 计算属性 - 主题相关
const themeClasses = computed(() => {
  return ['themed-component', ...themes[currentTheme.value].classes]
})

const themeStyles = computed(() => {
  return {
    ...themes[currentTheme.value].styles,
    transition: 'all 0.3s ease'
  }
})

// 计算属性 - 响应式样式
const responsiveClasses = computed(() => {
  const classes = ['responsive-component']

  // 模拟屏幕尺寸检测
  const screenWidth = window.innerWidth || 1024

  if (screenWidth < 768) {
    classes.push('mobile')
  } else if (screenWidth < 1024) {
    classes.push('tablet')
  } else {
    classes.push('desktop')
  }

  return classes
})

const responsiveStyles = computed(() => {
  const screenWidth = window.innerWidth || 1024

  return {
    padding: screenWidth < 768 ? '10px' : '20px',
    fontSize: screenWidth < 768 ? '14px' : '16px',
    maxWidth: screenWidth < 768 ? '100%' : '800px'
  }
})

// 基础样式对象
const baseStyles = reactive({
  padding: '20px',
  margin: '10px',
  borderRadius: '8px'
})

// 动画样式
const shouldFadeIn = ref(false)
const shouldSlideUp = ref(false)
const shouldBounce = ref(false)

const animationStyles = computed(() => ({
  animationDuration: '0.3s',
  animationTimingFunction: 'ease-in-out',
  animationFillMode: 'both'
}))

// 条件样式计算
const conditionalClass = computed(() => {
  if (isLoading.value) return 'loading'
  if (hasError.value) return 'error'
  if (isActive.value) return 'success'
  return 'default'
})

// 方法
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

const updatePosition = (x, y) => {
  offsetX.value = x
  offsetY.value = y
}

const triggerAnimation = (type) => {
  // 重置所有动画
  shouldFadeIn.value = false
  shouldSlideUp.value = false
  shouldBounce.value = false

  // 触发指定动画
  setTimeout(() => {
    switch (type) {
      case 'fade':
        shouldFadeIn.value = true
        break
      case 'slide':
        shouldSlideUp.value = true
        break
      case 'bounce':
        shouldBounce.value = true
        break
    }
  }, 50)
}

// 高级样式绑定示例
const createDynamicStyles = (config) => {
  return computed(() => {
    const styles = {}

    // 根据配置生成样式
    if (config.gradient) {
      styles.background = `linear-gradient(${config.gradient.direction}, ${config.gradient.colors.join(', ')})`
    }

    if (config.shadow) {
      styles.boxShadow = `${config.shadow.x}px ${config.shadow.y}px ${config.shadow.blur}px ${config.shadow.color}`
    }

    if (config.transform) {
      const transforms = []
      if (config.transform.scale) transforms.push(`scale(${config.transform.scale})`)
      if (config.transform.rotate) transforms.push(`rotate(${config.transform.rotate}deg)`)
      if (transforms.length) styles.transform = transforms.join(' ')
    }

    return styles
  })
}

// 使用动态样式
const dynamicConfig = reactive({
  gradient: {
    direction: '45deg',
    colors: ['#ff6b6b', '#4ecdc4']
  },
  shadow: {
    x: 0,
    y: 4,
    blur: 8,
    color: 'rgba(0,0,0,0.1)'
  },
  transform: {
    scale: 1,
    rotate: 0
  }
})

const dynamicStyles = createDynamicStyles(dynamicConfig)

// CSS-in-JS 样式生成
const generateUtilityClasses = (utilities) => {
  return Object.entries(utilities).map(([key, value]) => {
    if (value) return `u-${key}`
    return null
  }).filter(Boolean)
}

const utilities = reactive({
  'text-center': true,
  'margin-auto': false,
  'full-width': true,
  'shadow-lg': false
})

const utilityClasses = computed(() => generateUtilityClasses(utilities))

// 监听样式变化
watch([textColor, fontSize], ([newColor, newSize], [oldColor, oldSize]) => {
  console.log('样式发生变化:', {
    color: { old: oldColor, new: newColor },
    size: { old: oldSize, new: newSize }
  })
})

// 生命周期中的样式初始化
onMounted(() => {
  // 初始化动画
  setTimeout(() => {
    shouldFadeIn.value = true
  }, 500)

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    // 触发响应式样式重新计算
    // Vue的响应式系统会自动处理
  })
})
</script>

<style scoped>
/* 基础样式类 */
.base-component {
  transition: all 0.3s ease;
}

.active {
  border: 2px solid #007bff;
  background-color: #e7f3ff;
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.has-error {
  border-color: #dc3545;
  background-color: #f8d7da;
}

/* 主题样式 */
.theme-light {
  --primary-color: #007bff;
  --background-color: #ffffff;
  --text-color: #333333;
}

.theme-dark {
  --primary-color: #0d6efd;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}

/* 响应式样式 */
.responsive-component.mobile {
  flex-direction: column;
}

.responsive-component.tablet {
  flex-direction: row;
  flex-wrap: wrap;
}

.responsive-component.desktop {
  flex-direction: row;
  flex-wrap: nowrap;
}

/* 动画样式 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

.bounce {
  animation: bounce 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-10px); }
  70% { transform: translateY(-5px); }
  90% { transform: translateY(-2px); }
}

/* 工具类 */
.u-text-center { text-align: center; }
.u-margin-auto { margin: 0 auto; }
.u-full-width { width: 100%; }
.u-shadow-lg { box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
</style>
```

**使用场景对比：**

| 绑定方式 | 适用场景 | 优势 |
|----------|----------|------|
| 对象语法 | 条件性类名 | 清晰的条件逻辑 |
| 数组语法 | 多个固定类名 | 简洁的语法 |
| 混合语法 | 复杂的类名逻辑 | 灵活性最高 |
| 计算属性 | 复杂的样式计算 | 缓存和响应式 |
| 方法调用 | 动态样式生成 | 最大的灵活性 |

**性能优化建议：**
```javascript
// ✅ 推荐：使用计算属性缓存复杂计算
const complexClasses = computed(() => {
  // 复杂的类名计算逻辑
  return calculateClasses(props, state)
})

// ❌ 避免：在模板中进行复杂计算
// <div :class="calculateClasses(props, state)">

// ✅ 推荐：合理使用CSS变量
const dynamicStyles = computed(() => ({
  '--primary-color': primaryColor.value,
  '--font-size': fontSize.value + 'px'
}))

// ✅ 推荐：避免频繁的样式对象创建
const memoizedStyles = computed(() => ({
  color: textColor.value,
  fontSize: fontSize.value + 'px'
}))
```

### 记忆要点总结
- **class绑定**：对象语法（条件）、数组语法（多值）、混合语法（灵活）
- **style绑定**：对象语法（属性值）、数组语法（多对象）、CSS变量
- **计算属性**：缓存复杂的样式计算，提供响应式更新
- **性能优化**：避免模板中复杂计算，合理使用CSS变量
- **最佳实践**：语义化类名、响应式设计、动画过渡、主题系统

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

可以继续追问：如何在模板中绑定 class 和 style（双向/多值）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
