# 如何在路由中控制滚动行为？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察用户体验优化中的滚动位置管理，面试官想了解你是否掌握单页应用中滚动行为的精细控制。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 参数应为 `(to, from, savedPosition)` 而不是 `(to, form, savePosition)`
- savedPosition只在通过浏览器前进/后退按钮触发时才有值

## 知识点系统梳理

~~createRouter 函数的参数中有一个 scrollBehavior,接收三个参数 to form savePosition;~~

createRouter 函数的参数中有一个 scrollBehavior 选项，接收三个参数 `(to, from, savedPosition)`，通过返回位置对象来控制滚动位置。

### 问题本质解读 这道题考察用户体验优化中的滚动位置管理，面试官想了解你是否掌握单页应用中滚动行为的精细控制。

### 技术错误纠正
- 参数应为 `(to, from, savedPosition)` 而不是 `(to, form, savePosition)`
- savedPosition只在通过浏览器前进/后退按钮触发时才有值

### 知识点系统梳理

**scrollBehavior 核心概念：**
- 控制路由切换时的滚动位置
- 支持异步滚动行为
- 可以根据路由信息定制滚动策略
- 提供平滑滚动和瞬间滚动选项

**参数详解：**
- **to**: 目标路由对象
- **from**: 来源路由对象
- **savedPosition**: 浏览器记录的滚动位置（仅在前进/后退时有值）

### 实战应用举例
```javascript
// 基础滚动行为配置
const router = createRouter({
  history: createWebHistory(),
  routes: [...],
  scrollBehavior(to, from, savedPosition) {
    // 1. 浏览器前进/后退时恢复位置
    if (savedPosition) {
      return savedPosition
    }

    // 2. 锚点滚动
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    // 3. 默认滚动到顶部
    return { top: 0 }
  }
})
```

```javascript
// 高级滚动行为配置
const router = createRouter({
  history: createWebHistory(),
  routes: [...],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      // 异步滚动处理
      setTimeout(() => {
        let position = { top: 0 }

        // 1. 恢复保存的位置
        if (savedPosition) {
          position = savedPosition
        }
        // 2. 锚点定位
        else if (to.hash) {
          const element = document.querySelector(to.hash)
          if (element) {
            position = {
              el: to.hash,
              behavior: 'smooth',
              // 偏移量，避免被固定头部遮挡
              top: -80
            }
          }
        }
        // 3. 特殊页面的滚动策略
        else if (to.meta.scrollToTop === false) {
          // 保持当前滚动位置
          position = {}
        }
        // 4. 相同路由不同参数时的处理
        else if (to.name === from.name && to.meta.keepScrollPosition) {
          // 保持滚动位置
          position = {}
        }
        // 5. 分页场景的处理
        else if (to.query.page && from.query.page) {
          // 分页切换时滚动到列表顶部
          const listElement = document.querySelector('.list-container')
          if (listElement) {
            position = {
              el: '.list-container',
              behavior: 'smooth'
            }
          }
        }

        resolve(position)
      }, 300) // 等待页面渲染完成
    })
  }
})
```

```javascript
// 复杂场景的滚动控制
const router = createRouter({
  history: createWebHistory(),
  routes: [...],
  scrollBehavior(to, from, savedPosition) {
    // 滚动位置缓存
    const scrollCache = new Map()

    return new Promise((resolve) => {
      // 等待路由组件加载完成
      router.app.$nextTick(() => {
        let scrollTarget = { top: 0, behavior: 'smooth' }

        // 1. 浏览器导航恢复位置
        if (savedPosition) {
          scrollTarget = {
            ...savedPosition,
            behavior: 'auto' // 瞬间恢复，不使用动画
          }
        }

        // 2. 锚点导航
        else if (to.hash) {
          const targetElement = document.querySelector(to.hash)
          if (targetElement) {
            // 计算偏移量
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0
            const offset = headerHeight + 20

            scrollTarget = {
              el: to.hash,
              top: -offset,
              behavior: 'smooth'
            }
          }
        }

        // 3. 缓存位置恢复
        else if (to.meta.restoreScroll && scrollCache.has(to.fullPath)) {
          scrollTarget = scrollCache.get(to.fullPath)
        }

        // 4. 模态框或抽屉导航
        else if (to.meta.modal || to.meta.drawer) {
          // 模态框不改变滚动位置
          scrollTarget = {}
        }

        // 5. 搜索结果页面
        else if (to.name === 'search' && to.query.q) {
          // 搜索时滚动到结果区域
          scrollTarget = {
            el: '.search-results',
            behavior: 'smooth'
          }
        }

        // 6. 无限滚动页面
        else if (from.meta.infiniteScroll && to.name === from.name) {
          // 保持当前位置
          scrollTarget = {}
        }

        // 缓存当前位置
        if (from.meta.cacheScroll) {
          const currentPosition = {
            top: window.pageYOffset,
            left: window.pageXOffset
          }
          scrollCache.set(from.fullPath, currentPosition)
        }

        resolve(scrollTarget)
      })
    })
  }
})
```

```vue
<!-- 组件中的滚动控制 -->
<template>
  <div class="page-container">
    <!-- 固定头部 -->
    <header class="header" ref="headerRef">
      <nav>
        <router-link to="#section1">章节1</router-link>
        <router-link to="#section2">章节2</router-link>
        <router-link to="#section3">章节3</router-link>
      </nav>
    </header>

    <!-- 内容区域 -->
    <main class="content">
      <section id="section1">章节1内容</section>
      <section id="section2">章节2内容</section>
      <section id="section3">章节3内容</section>
    </main>

    <!-- 回到顶部按钮 -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="back-to-top"
    >
      ↑
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'Vue Router'

const router = useRouter()
const route = useRoute()
const headerRef = ref(null)
const showBackToTop = ref(false)

// 平滑滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 滚动到指定元素
const scrollToElement = (selector, offset = 0) => {
  const element = document.querySelector(selector)
  if (element) {
    const top = element.offsetTop - offset
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
  }
}

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.pageYOffset > 300

  // 更新活跃的导航项
  updateActiveNavigation()
}

// 更新活跃导航
const updateActiveNavigation = () => {
  const sections = document.querySelectorAll('section[id]')
  const headerHeight = headerRef.value?.offsetHeight || 0

  sections.forEach(section => {
    const rect = section.getBoundingClientRect()
    const isVisible = rect.top <= headerHeight + 50 && rect.bottom > headerHeight

    if (isVisible) {
      // 更新URL hash但不触发滚动
      const hash = `#${section.id}`
      if (route.hash !== hash) {
        router.replace({ ...route, hash })
      }
    }
  })
}

// 处理锚点点击
const handleAnchorClick = (event, hash) => {
  event.preventDefault()

  const headerHeight = headerRef.value?.offsetHeight || 0
  scrollToElement(hash, headerHeight + 20)

  // 更新路由
  router.push({ ...route, hash })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // 页面加载时处理锚点
  if (route.hash) {
    nextTick(() => {
      const headerHeight = headerRef.value?.offsetHeight || 0
      scrollToElement(route.hash, headerHeight + 20)
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  background: white;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content {
  margin-top: 80px; /* 为固定头部留出空间 */
}

.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.back-to-top:hover {
  background: #0056b3;
  transform: translateY(-2px);
}
</style>
```

```javascript
// 滚动行为的工具函数
class ScrollManager {
  constructor() {
    this.scrollPositions = new Map()
    this.isScrolling = false
  }

  // 保存滚动位置
  saveScrollPosition(key) {
    this.scrollPositions.set(key, {
      top: window.pageYOffset,
      left: window.pageXOffset,
      timestamp: Date.now()
    })
  }

  // 恢复滚动位置
  restoreScrollPosition(key, animated = true) {
    const position = this.scrollPositions.get(key)
    if (position) {
      window.scrollTo({
        top: position.top,
        left: position.left,
        behavior: animated ? 'smooth' : 'auto'
      })
      return true
    }
    return false
  }

  // 平滑滚动到元素
  scrollToElement(selector, offset = 0, behavior = 'smooth') {
    const element = document.querySelector(selector)
    if (element) {
      const rect = element.getBoundingClientRect()
      const top = window.pageYOffset + rect.top - offset

      window.scrollTo({
        top,
        behavior
      })
      return true
    }
    return false
  }

  // 检查元素是否在视口中
  isElementInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight

    return (
      rect.top >= -threshold &&
      rect.bottom <= windowHeight + threshold
    )
  }

  // 等待滚动完成
  waitForScrollEnd() {
    return new Promise((resolve) => {
      let timeoutId

      const handleScroll = () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          window.removeEventListener('scroll', handleScroll)
          resolve()
        }, 100)
      }

      window.addEventListener('scroll', handleScroll)
      handleScroll() // 立即触发一次
    })
  }
}

// 全局使用
const scrollManager = new ScrollManager()

// 在路由守卫中使用
router.beforeEach((to, from) => {
  // 保存当前页面的滚动位置
  if (from.meta.saveScroll) {
    scrollManager.saveScrollPosition(from.fullPath)
  }
})
```

**使用场景总结：**
- **锚点导航**: 页面内跳转到特定章节
- **分页列表**: 切换页码时的滚动控制
- **搜索结果**: 滚动到结果区域
- **表单提交**: 滚动到错误字段或成功提示
- **无限滚动**: 保持当前滚动位置
- **模态框**: 不改变背景页面滚动位置

**性能优化建议：**
- 使用防抖处理滚动事件
- 合理设置滚动动画时长
- 避免在滚动过程中执行重计算
- 使用 Intersection Observer API 优化可见性检测

### 记忆要点总结
- scrollBehavior：控制路由切换时的滚动行为
- 参数：(to, from, savedPosition)
- 返回值：位置对象或Promise
- 常用场景：锚点、分页、位置恢复
- 最佳实践：考虑固定头部偏移、异步处理

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在路由中控制滚动行为？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
