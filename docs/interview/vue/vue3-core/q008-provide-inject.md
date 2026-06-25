# 什么是 `provide` / `inject`？有什么使用场景？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue的依赖注入系统，面试官想了解你是否理解跨层级组件通信的解决方案和适用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

provide 和 inject 是vue中突破祖孙组件数据逐层传递的方式，可以在祖父组件中通过provide传递任意类型的值，在任意子孙组件中通过inject接收。

场景：多级嵌套的部门选择组件可以使用以上方式。

### 问题本质解读 这道题考察Vue的依赖注入系统，面试官想了解你是否理解跨层级组件通信的解决方案和适用场景。

### 知识点系统梳理

**provide/inject特点：**
- 解决prop drilling问题（逐层传递props）
- 祖先组件提供数据，后代组件注入使用
- 支持响应式数据传递
- 不限制组件层级深度

**响应式provide/inject：**
- provide响应式数据时，inject的组件会自动更新
- 可以provide ref、reactive、computed等响应式数据

### 实战应用举例
```vue
<!-- 祖先组件 -->
<template>
  <div>
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  </div>
</template>

// 祖先组件 ThemeProvider
<script setup>
// 主题提供者
const theme = ref('dark')
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

provide('theme', {
  theme: readonly(theme), // 只读，防止子组件修改
  toggleTheme
})

// 用户信息提供者
const user = reactive({
  name: 'John Doe',
  role: 'admin',
  permissions: ['read', 'write', 'delete']
})

const updateUser = (newUser) => {
  Object.assign(user, newUser)
}

provide('user', {
  user: readonly(user),
  updateUser
})

// 提供配置信息
provide('config', {
  apiUrl: 'https://api.example.com',
  version: '1.0.0'
})
</script>

<!-- 深层子组件 -->
<template>
  <div :class="themeClass">
    <h1>欢迎, {{ user.name }}</h1>
    <button @click="toggleTheme">
      切换主题 (当前: {{ theme.theme }})
    </button>
    <div v-if="user.role === 'admin'">
      管理员功能
    </div>
  </div>
</template>

<script setup>
// 注入主题
const theme = inject('theme')
const themeClass = computed(() => `theme-${theme.theme.value}`)

// 注入用户信息
const { user } = inject('user')

// 注入配置（带默认值）
const config = inject('config', {
  apiUrl: 'https://default-api.com',
  version: '0.0.1'
})

// 类型安全的注入（TypeScript）
interface ThemeContext {
  theme: Readonly<Ref<string>>
  toggleTheme: () => void
}

const theme = inject<ThemeContext>('theme')
</script>
```

```javascript
// 1. 使用Symbol作为key，避免命名冲突
const ThemeKey = Symbol('theme')
provide(ThemeKey, themeData)
const theme = inject(ThemeKey)

// 2. 提供默认值
const theme = inject('theme', defaultTheme)

// 3. 使用readonly保护数据
provide('user', readonly(user))

// 4. 组合式函数封装
function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return theme
}
```

**常见使用场景：**
1. **主题系统**: 全局主题配置和切换
2. **用户认证**: 用户信息和权限管理
3. **国际化**: 语言包和切换功能
4. **配置管理**: 全局配置信息
5. **插件系统**: 插件注册和使用
6. **表单验证**: 表单上下文和验证规则

### 记忆要点总结
- 作用：跨层级组件通信，避免prop drilling
- 特点：祖先provide，后代inject
- 响应式：支持响应式数据自动更新
- 场景：主题、认证、配置、国际化等全局状态

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

可以继续追问：什么是 `provide` / `inject`？有什么使用场景？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
