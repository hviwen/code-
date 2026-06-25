# 如何在组件中使用 CSS Modules 或 Scoped CSS？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题核心是在确认对「如何在组件中使用 CSS Modules 或 Scoped CSS？」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

在style标签中添加 scoped 属性，实现样式只作用于当前单文件组件。
使用 CSS Modules 时，通过 module 属性和 :class 绑定实现样式隔离。

问题本质解读： 此问题考察候选人对 Vue 单文件组件样式隔离机制的理解，以及在实际项目中如何避免 CSS 样式冲突。面试官关注候选人是否了解不同样式隔离方案的原理、优缺点和适用场景。

技术错误纠正：
- 原答案基本正确但过于简略，缺少具体的语法示例和配置
- 未说明 Scoped CSS 的工作原理（属性选择器）
- 缺少 CSS Modules 的完整配置和使用方式
- 未提及深度选择器、全局样式等高级用法
- 没有对比两种方案的优缺点和选择建议

知识点系统梳理：
- Scoped CSS：通过 data-v-hash 属性实现样式隔离
- CSS Modules：通过类名 hash 化实现样式隔离
- 深度选择器：::v-deep、:deep() 的使用
- 全局样式：:global() 选择器的应用
- 样式传递：组件间样式继承和覆盖策略

实战应用举例：
```vue
<!-- 1. Scoped CSS 基础用法 -->
<template>
  <div class="user-card">
    <div class="header">
      <img :src="user.avatar" alt="avatar" class="avatar" />
      <div class="user-info">
        <h3 class="username">{{ user.name }}</h3>
        <p class="email">{{ user.email }}</p>
      </div>
    </div>

    <div class="content">
      <p class="description">{{ user.description }}</p>
      <div class="tags">
        <span v-for="tag in user.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary">编辑</button>
      <button class="btn btn-secondary">删除</button>
    </div>
  </div>
</template>

<script setup>
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatars/john.jpg',
  description: '前端开发工程师，专注于 Vue.js 开发',
  tags: ['Vue.js', 'JavaScript', 'CSS']
}
</script>

<!-- Scoped CSS - 样式只作用于当前组件 -->
<style scoped>
.user-card {
  max-width: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 18px;
}

.email {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.content {
  margin-bottom: 16px;
}

.description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}
</style>

<!-- 2. CSS Modules 用法 -->
<template>
  <div :class="$style.container">
    <h2 :class="$style.title">产品列表</h2>

    <div :class="$style.filters">
      <select :class="$style.select" v-model="selectedCategory">
        <option value="">所有分类</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <input
        :class="$style.searchInput"
        type="text"
        placeholder="搜索产品..."
        v-model="searchQuery"
      />
    </div>

    <div :class="$style.productGrid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        :class="[$style.productCard, { [$style.featured]: product.featured }]"
      >
        <img :src="product.image" :alt="product.name" :class="$style.productImage" />
        <div :class="$style.productInfo">
          <h3 :class="$style.productName">{{ product.name }}</h3>
          <p :class="$style.productPrice">${{ product.price }}</p>
          <button :class="[$style.btn, $style.btnPrimary]">
            加入购物车
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('')
const searchQuery = ref('')

const products = ref([
  { id: 1, name: 'iPhone 15', price: 999, category: '手机', featured: true, image: '/phones/iphone15.jpg' },
  { id: 2, name: 'MacBook Pro', price: 1999, category: '电脑', featured: false, image: '/laptops/macbook.jpg' },
  // ... 更多产品
])

const categories = computed(() =>
  [...new Set(products.value.map(p => p.category))]
)

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    const matchesSearch = !searchQuery.value ||
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})
</script>

<!-- CSS Modules - 通过 module 属性启用 -->
<style module>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
}

.select, .searchInput {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.select {
  min-width: 150px;
}

.searchInput {
  min-width: 200px;
}

.productGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.productCard {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.productCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.featured {
  border-color: #ffc107;
  position: relative;
}

.featured::before {
  content: '推荐';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ffc107;
  color: #333;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1;
}

.productImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.productInfo {
  padding: 16px;
}

.productName {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.productPrice {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.btn {
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btnPrimary {
  background: #007bff;
  color: white;
}

.btnPrimary:hover {
  background: #0056b3;
}
</style>

<!-- 3. 深度选择器和全局样式 -->
<template>
  <div class="form-container">
    <h2>用户注册</h2>

    <!-- 第三方组件，需要覆盖其内部样式 -->
    <ThirdPartyDatePicker
      v-model="birthDate"
      class="date-picker"
    />

    <!-- 自定义表单组件 -->
    <FormInput
      v-model="username"
      label="用户名"
      placeholder="请输入用户名"
      required
    />

    <FormInput
      v-model="email"
      label="邮箱"
      type="email"
      placeholder="请输入邮箱"
      required
    />

    <!-- 全局样式的按钮 -->
    <button class="global-submit-btn">提交注册</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ThirdPartyDatePicker from '@/components/ThirdPartyDatePicker.vue'
import FormInput from '@/components/FormInput.vue'

const birthDate = ref('')
const username = ref('')
const email = ref('')
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 32px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

/* 使用深度选择器修改第三方组件内部样式 */
.date-picker :deep(.date-input) {
  border-color: #007bff;
  border-radius: 6px;
}

.date-picker :deep(.date-calendar) {
  border: 2px solid #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

/* 修改子组件的样式 */
:deep(.form-input-wrapper) {
  margin-bottom: 20px;
}

:deep(.form-input-label) {
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

:deep(.form-input-field) {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  transition: border-color 0.2s;
}

:deep(.form-input-field:focus) {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

:deep(.form-input-error) {
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
}
</style>

<!-- 全局样式 -->
<style>
/* 不使用 scoped，样式会全局生效 */
.global-submit-btn {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
}

.global-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.global-submit-btn:active {
  transform: translateY(0);
}
</style>

<!-- 4. 动态类名和样式绑定 -->
<template>
  <div :class="$style.themeContainer" :data-theme="currentTheme">
    <div :class="$style.themeSelector">
      <button
        v-for="theme in themes"
        :key="theme.name"
        :class="[
          $style.themeBtn,
          { [$style.active]: currentTheme === theme.name }
        ]"
        :style="{ backgroundColor: theme.primary }"
        @click="setTheme(theme.name)"
      >
        {{ theme.label }}
      </button>
    </div>

    <div :class="$style.content">
      <h1 :class="$style.heading">动态主题示例</h1>
      <p :class="$style.text">当前主题：{{ currentTheme }}</p>

      <div :class="$style.cardGrid">
        <div
          v-for="card in cards"
          :key="card.id"
          :class="[
            $style.card,
            {
              [$style.highlighted]: card.highlighted,
              [$style.urgent]: card.urgent
            }
          ]"
          :style="getCardStyle(card)"
        >
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentTheme = ref('blue')

const themes = [
  { name: 'blue', label: '蓝色', primary: '#007bff', secondary: '#6c757d' },
  { name: 'green', label: '绿色', primary: '#28a745', secondary: '#6c757d' },
  { name: 'purple', label: '紫色', primary: '#6f42c1', secondary: '#6c757d' },
  { name: 'orange', label: '橙色', primary: '#fd7e14', secondary: '#6c757d' }
]

const cards = ref([
  { id: 1, title: '卡片1', description: '这是第一张卡片', highlighted: true, urgent: false },
  { id: 2, title: '卡片2', description: '这是第二张卡片', highlighted: false, urgent: true },
  { id: 3, title: '卡片3', description: '这是第三张卡片', highlighted: false, urgent: false }
])

const currentThemeData = computed(() =>
  themes.find(theme => theme.name === currentTheme.value)
)

const setTheme = (themeName) => {
  currentTheme.value = themeName
}

const getCardStyle = (card) => {
  const baseStyle = {}

  if (card.highlighted) {
    baseStyle.borderColor = currentThemeData.value.primary
    baseStyle.boxShadow = `0 0 0 2px ${currentThemeData.value.primary}33`
  }

  if (card.urgent) {
    baseStyle.backgroundColor = '#fff3cd'
    baseStyle.borderLeftColor = '#ffc107'
    baseStyle.borderLeftWidth = '4px'
  }

  return baseStyle
}
</script>

<style module>
.themeContainer {
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s;
}

.themeContainer[data-theme="blue"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.themeContainer[data-theme="green"] {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.themeContainer[data-theme="purple"] {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.themeContainer[data-theme="orange"] {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.themeSelector {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.themeBtn {
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.themeBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.themeBtn.active {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.content {
  max-width: 1000px;
  margin: 0 auto;
}

.heading {
  text-align: center;
  color: white;
  margin-bottom: 8px;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text {
  text-align: center;
  color: white;
  margin-bottom: 32px;
  font-size: 1.2rem;
  opacity: 0.9;
}

.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card.highlighted {
  border-left-width: 4px;
  border-left-style: solid;
}

.card.urgent {
  position: relative;
}

.card.urgent::before {
  content: '紧急';
  position: absolute;
  top: -8px;
  right: 16px;
  background: #dc3545;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.card h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.card p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}
</style>

```

使用场景对比：
- Scoped CSS：适合大多数组件样式隔离，语法简单，开发效率高
- CSS Modules：适合需要动态类名、严格样式隔离的场景
- 深度选择器：修改第三方组件内部样式，谨慎使用避免破坏封装
- 全局样式：通用样式、重置样式、主题变量等全局生效的样式

记忆要点总结：
- <style scoped> 通过 data-v-hash 属性实现样式隔离
- <style module> 通过 $style 对象访问 hash 化的类名
- 深度选择器 :deep() 可以影响子组件样式
- 动态类名绑定：[className, { conditionalClass: condition }]
- 样式和逻辑分离：使用计算属性生成动态样式对象

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

可以继续追问：如何在组件中使用 CSS Modules 或 Scoped CSS？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
