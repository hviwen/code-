# 如何防止子组件暴露过多内部实现？（组件封装）

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3组件封装的最佳实践，面试官想了解你是否理解组件接口设计原则和如何控制组件的公共API。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 函数名错误："Expose()"应为"defineExpose"
2. 原答案过于简单，缺少封装原则和具体实现
3. 没有说明为什么需要限制暴露和如何设计良好的组件接口

## 知识点系统梳理

可以使用defineExpose()在setup显式暴露方法和属性
- 只暴露必要接口
- 避免暴露内部实现
- 保持接口稳定性

### 问题本质解读 这道题考察Vue 3组件封装的最佳实践，面试官想了解你是否理解组件接口设计原则和如何控制组件的公共API。

### 技术错误纠正
1. 函数名错误："Expose()"应为"defineExpose"
2. 原答案过于简单，缺少封装原则和具体实现
3. 没有说明为什么需要限制暴露和如何设计良好的组件接口

### 知识点系统梳理

**组件封装原则：**
- 最小暴露原则：只暴露必要的接口
- 接口稳定性：避免暴露易变的内部实现
- 职责单一：每个暴露的方法都有明确的职责
- 向后兼容：接口变更要考虑兼容性

**defineExpose的作用：**
- 在`<script setup>`中显式控制组件暴露的属性和方法
- 替代Options API中的自动暴露机制
- 提供更精确的接口控制

### 实战应用举例
```vue
// 1. 基础的组件封装
<template>
  <div class="user-card">
    <img :src="avatar" :alt="name" />
    <h3>{{ name }}</h3>
    <p>{{ email }}</p>
    <button @click="toggleDetails">
      {{ showDetails ? '隐藏' : '显示' }}详情
    </button>
    <div v-if="showDetails" class="details">
      <p>注册时间: {{ formatDate(registerDate) }}</p>
      <p>最后登录: {{ formatDate(lastLogin) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props定义
const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

// 内部状态（私有）
const userData = ref(null)
const showDetails = ref(false)
const loading = ref(false)
const error = ref(null)

// 内部方法（私有）
const fetchUserData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.getUser(props.userId)
    userData.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const validateUserData = () => {
  return userData.value && userData.value.id
}

// 计算属性（部分可暴露）
const name = computed(() => userData.value?.name || '未知用户')
const email = computed(() => userData.value?.email || '')
const avatar = computed(() => userData.value?.avatar || '/default-avatar.png')
const registerDate = computed(() => userData.value?.createdAt)
const lastLogin = computed(() => userData.value?.lastLoginAt)

// 公共方法
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const refresh = async () => {
  await fetchUserData()
}

const exportUserData = () => {
  if (!validateUserData()) {
    throw new Error('用户数据无效')
  }

  return {
    id: userData.value.id,
    name: userData.value.name,
    email: userData.value.email,
    exportTime: new Date().toISOString()
  }
}

// 生命周期
onMounted(() => {
  fetchUserData()
})

// ✅ 只暴露必要的接口
defineExpose({
  // 公共方法
  refresh,
  toggleDetails,
  exportUserData,

  // 只读状态
  isLoading: readonly(loading),
  hasError: readonly(computed(() => !!error.value)),

  // 计算属性（只读）
  userName: name,
  userEmail: email

  // ❌ 不暴露内部实现
  // userData,           // 内部数据
  // fetchUserData,      // 内部方法
  // validateUserData,   // 内部验证
  // error,              // 内部错误状态
  // formatDate          // 工具方法
})
</script>
```

```vue
// 2. 复杂组件的分层暴露
<template>
  <div class="data-table">
    <div class="table-header">
      <input v-model="searchQuery" placeholder="搜索..." />
      <button @click="exportData">导出</button>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredData" :key="item.id">
          <td v-for="column in columns" :key="column.key">
            {{ formatCellValue(item[column.key], column.type) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script setup>
// 内部状态管理
const rawData = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const sortConfig = ref({ key: null, direction: 'asc' })

// 内部计算属性
const filteredData = computed(() => {
  let result = rawData.value

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
  }

  // 排序
  if (sortConfig.value.key) {
    result = [...result].sort((a, b) => {
      const aVal = a[sortConfig.value.key]
      const bVal = b[sortConfig.value.key]
      const direction = sortConfig.value.direction === 'asc' ? 1 : -1
      return aVal > bVal ? direction : -direction
    })
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(rawData.value.length / pageSize.value)
)

// 内部方法
const formatCellValue = (value, type) => {
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'currency':
      return `¥${value.toFixed(2)}`
    default:
      return value
  }
}

const validatePageNumber = (page) => {
  return page >= 1 && page <= totalPages.value
}

// 公共接口
const loadData = (data) => {
  rawData.value = Array.isArray(data) ? data : []
  currentPage.value = 1
}

const search = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

const sort = (key, direction = 'asc') => {
  sortConfig.value = { key, direction }
}

const goToPage = (page) => {
  if (validatePageNumber(page)) {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const exportData = () => {
  return {
    data: filteredData.value,
    meta: {
      total: rawData.value.length,
      filtered: filteredData.value.length,
      page: currentPage.value,
      pageSize: pageSize.value
    }
  }
}

const reset = () => {
  searchQuery.value = ''
  currentPage.value = 1
  sortConfig.value = { key: null, direction: 'asc' }
}

// 分层暴露：核心功能 + 扩展功能
defineExpose({
  // 核心数据操作
  loadData,
  exportData,
  reset,

  // 搜索功能
  search,
  clearSearch: () => search(''),

  // 分页功能
  goToPage,
  prevPage,
  nextPage,

  // 排序功能
  sort,
  clearSort: () => sort(null),

  // 只读状态
  currentPage: readonly(currentPage),
  totalPages: readonly(totalPages),
  hasData: readonly(computed(() => rawData.value.length > 0)),
  isFiltered: readonly(computed(() => !!searchQuery.value))

  // ❌ 不暴露内部实现
  // rawData,              // 原始数据
  // filteredData,         // 过滤后数据
  // formatCellValue,      // 格式化方法
  // validatePageNumber,   // 验证方法
  // sortConfig            // 排序配置
})
</script>
```

```javascript
// 3. 使用组合式函数的封装
function useFormValidation() {
  // 内部状态
  const errors = ref({})
  const touched = ref({})
  const validating = ref(false)

  // 内部方法
  const validateField = async (field, value, rules) => {
    // 复杂的验证逻辑
  }

  const clearFieldError = (field) => {
    delete errors.value[field]
  }

  // 公共接口
  const validate = async (formData, rules) => {
    validating.value = true
    // 验证逻辑
    validating.value = false
  }

  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const isValid = computed(() => !hasErrors.value && !validating.value)

  // 只暴露必要接口
  return {
    // 公共方法
    validate,
    clearErrors,

    // 只读状态
    errors: readonly(errors),
    hasErrors: readonly(hasErrors),
    isValid: readonly(isValid),
    isValidating: readonly(validating)

    // ❌ 不暴露内部方法
    // validateField,
    // clearFieldError,
    // touched
  }
}
```

```TypeScript
// 4. TypeScript中的接口定义
interface UserCardExposed {
  refresh(): Promise<void>
  toggleDetails(): void
  exportUserData(): UserExportData
  readonly isLoading: boolean
  readonly hasError: boolean
  readonly userName: string
  readonly userEmail: string
}

// 使用接口约束
const userCardRef = ref<UserCardExposed>()

// 5. 组件接口文档化
/**
 * DataTable组件
 *
 * 公共接口：
 * @method loadData(data: Array) - 加载数据
 * @method search(query: string) - 搜索数据
 * @method sort(key: string, direction: 'asc'|'desc') - 排序
 * @method goToPage(page: number) - 跳转页面
 * @method exportData() - 导出当前数据
 * @method reset() - 重置所有状态
 *
 * 只读属性：
 * @property currentPage - 当前页码
 * @property totalPages - 总页数
 * @property hasData - 是否有数据
 * @property isFiltered - 是否已过滤
 */
```

**封装最佳实践：**

1. **接口设计原则**
```javascript
// ✅ 好的接口设计
defineExpose({
  // 动词开头的方法名
  loadData,
  refreshData,
  exportData,

  // 布尔值用is/has开头
  isLoading: readonly(loading),
  hasError: readonly(computed(() => !!error.value)),

  // 只读状态
  currentUser: readonly(user),

  // 明确的方法签名
  search: (query: string) => void,
  sort: (key: string, direction: 'asc' | 'desc') => void
})

// ❌ 避免的接口设计
defineExpose({
  // 暴露内部状态
  _internalState,

  // 模糊的方法名
  doSomething,
  handle,

  // 可变的内部对象
  config,
  options
})
```

2. **版本兼容性**
```javascript
// 保持接口向后兼容
defineExpose({
  // 新接口
  loadData,

  // 保持旧接口（标记为废弃）
  /** @deprecated 使用 loadData 替代 */
  setData: loadData,

  // 版本化接口
  v2: {
    loadDataWithOptions,
    advancedSearch
  }
})
```

### 记忆要点总结
- **封装原则**：最小暴露、接口稳定、职责单一、向后兼容
- **defineExpose**：显式控制组件公共API，替代自动暴露
- **暴露内容**：公共方法、只读状态、计算属性
- **不暴露内容**：内部状态、私有方法、工具函数、配置对象
- **最佳实践**：清晰命名、类型约束、文档化、版本兼容

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

可以继续追问：如何防止子组件暴露过多内部实现？（组件封装） 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
