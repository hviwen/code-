# 如何在 Vue 3 中使用 TypeScript 定义组件 props？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3与TypeScript的集成使用，面试官想了解你是否掌握类型安全的组件开发方式。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 原答案过于简单，没有说明具体的使用方式
2. 缺少类型定义的最佳实践和高级用法
3. 没有涵盖不同场景下的类型定义方法

## 知识点系统梳理

使用defineComponent 或者 defineProps

### 问题本质解读 这道题考察Vue 3与TypeScript的集成使用，面试官想了解你是否掌握类型安全的组件开发方式。

### 技术错误纠正
1. 原答案过于简单，没有说明具体的使用方式
2. 缺少类型定义的最佳实践和高级用法
3. 没有涵盖不同场景下的类型定义方法

### 知识点系统梳理

**TypeScript中props定义方式：**
- 运行时声明：defineProps with runtime declaration
- 类型声明：defineProps with type-only declaration
- 接口定义：使用interface定义props类型
- 默认值处理：withDefaults的使用

### 实战应用举例
```TypeScript
// 1. 基础的TypeScript props定义
<script setup lang="ts">
// 方式一：类型声明（推荐）
interface Props {
  title: string
  count?: number
  isVisible?: boolean
  items: string[]
  user: {
    id: number
    name: string
    email?: string
  }
}

const props = defineProps<Props>()

// 方式二：内联类型声明
const props = defineProps<{
  title: string
  count?: number
  callback?: (value: string) => void
}>()
</script>

// 2. 带默认值的props定义
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  isVisible?: boolean
  theme?: 'light' | 'dark'
  options?: {
    autoSave: boolean
    timeout: number
  }
}

// 使用withDefaults提供默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isVisible: true,
  theme: 'light',
  options: () => ({
    autoSave: true,
    timeout: 5000
  })
})
</script>

// 3. 复杂类型定义
<script setup lang="ts">
// 定义复杂的类型
type Status = 'loading' | 'success' | 'error' | 'idle'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  roles: string[]
  preferences: {
    theme: 'light' | 'dark'
    language: string
    notifications: boolean
  }
}

interface ApiResponse<T> {
  data: T
  status: number
  message: string
  timestamp: number
}

interface Props {
  // 基础类型
  title: string
  count: number

  // 联合类型
  status: Status

  // 对象类型
  user: User

  // 泛型类型
  response: ApiResponse<User[]>

  // 函数类型
  onUpdate: (user: User) => void
  onError?: (error: Error) => void

  // 数组类型
  tags: string[]
  users: User[]

  // 可选的复杂类型
  config?: {
    apiUrl: string
    timeout: number
    retries: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  status: 'idle',
  tags: () => [],
  users: () => [],
  config: () => ({
    apiUrl: '/api',
    timeout: 5000,
    retries: 3
  })
})
</script>

// 4. 运行时验证与类型结合
<script setup lang="ts">
import { PropType } from 'vue'

// 复杂类型定义
interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean
}

interface FormField {
  name: string
  type: 'text' | 'email' | 'password' | 'number'
  label: string
  placeholder?: string
  rules?: ValidationRule[]
}

// 结合运行时验证的props定义
const props = defineProps({
  // 基础类型with验证
  title: {
    type: String as PropType<string>,
    required: true,
    validator: (value: string) => value.length > 0
  },

  // 数字类型with范围验证
  count: {
    type: Number as PropType<number>,
    default: 0,
    validator: (value: number) => value >= 0 && value <= 1000
  },

  // 复杂对象类型
  formFields: {
    type: Array as PropType<FormField[]>,
    required: true,
    validator: (fields: FormField[]) => {
      return fields.every(field =>
        field.name &&
        field.type &&
        field.label
      )
    }
  },

  // 函数类型
  onSubmit: {
    type: Function as PropType<(data: Record<string, any>) => Promise<void>>,
    required: true
  }
})
</script>

// 5. 泛型组件的props定义
<script setup lang="ts" generic="T extends Record<string, any>">
interface Props<T> {
  items: T[]
  keyField: keyof T
  displayField: keyof T
  onSelect?: (item: T) => void
  onDelete?: (item: T) => void
  renderItem?: (item: T) => string
}

const props = defineProps<Props<T>>()

// 使用泛型props
const handleSelect = (item: T) => {
  props.onSelect?.(item)
}

const getDisplayValue = (item: T): string => {
  if (props.renderItem) {
    return props.renderItem(item)
  }
  return String(item[props.displayField])
}
</script>

// 6. 条件类型和高级类型
<script setup lang="ts">
// 条件类型定义
type ComponentMode = 'view' | 'edit' | 'create'

type PropsForMode<T extends ComponentMode> = T extends 'view'
  ? {
      mode: 'view'
      data: User
      readonly: true
    }
  : T extends 'edit'
  ? {
      mode: 'edit'
      data: User
      onSave: (user: User) => void
      onCancel: () => void
    }
  : {
      mode: 'create'
      onSave: (user: Omit<User, 'id'>) => void
      onCancel: () => void
    }

// 使用条件类型
const props = defineProps<PropsForMode<ComponentMode>>()

// 7. 工具类型的使用
interface BaseUser {
  id: number
  name: string
  email: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

interface Props {
  // 使用Partial使所有属性可选
  userDefaults?: Partial<BaseUser>

  // 使用Pick选择特定属性
  userSummary: Pick<BaseUser, 'id' | 'name' | 'avatar'>

  // 使用Omit排除特定属性
  userInput: Omit<BaseUser, 'id' | 'createdAt' | 'updatedAt'>

  // 使用Record定义键值对
  userPreferences: Record<string, string | number | boolean>

  // 使用Required使所有属性必需
  requiredConfig: Required<{
    apiUrl?: string
    timeout?: number
    debug?: boolean
  }>
}

const props = withDefaults(defineProps<Props>(), {
  userDefaults: () => ({}),
  userPreferences: () => ({}),
  requiredConfig: () => ({
    apiUrl: '/api',
    timeout: 5000,
    debug: false
  })
})

// 8. 响应式props的类型推导
<script setup lang="ts">
interface Props {
  initialValue: string
  options: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

// props是响应式的，类型会被正确推导
const computedValue = computed(() => {
  // props.initialValue 的类型是 string
  // props.options 的类型是 Array<{ label: string; value: string }>
  return props.options.find(option => option.value === props.initialValue)
})

// 监听props变化
watch(() => props.initialValue, (newValue: string, oldValue: string) => {
  console.log('Value changed:', { oldValue, newValue })
})
</script>

// 9. 组件实例类型定义
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

interface Props {
  title: string
  items: string[]
}

const props = defineProps<Props>()

// 定义组件暴露的接口
interface ComponentExposed {
  refresh: () => void
  getItems: () => string[]
  focus: () => void
}

const refresh = () => {
  // 刷新逻辑
}

const getItems = () => props.items

const focus = () => {
  // 聚焦逻辑
}

defineExpose<ComponentExposed>({
  refresh,
  getItems,
  focus
})
</script>

// 10. 父组件中的类型使用
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import MyComponent from './MyComponent.vue'

// 组件引用的类型
type MyComponentInstance = ComponentPublicInstance<typeof MyComponent>

const componentRef = ref<MyComponentInstance>()

const handleClick = () => {
  // TypeScript会提供正确的类型提示
  componentRef.value?.refresh()
  const items = componentRef.value?.getItems()
}
</script>

// 11. 全局类型声明
// types/global.d.ts
declare global {
  interface User {
    id: number
    name: string
    email: string
  }

  interface ApiResponse<T = any> {
    data: T
    message: string
    status: number
  }
}

// 在组件中使用全局类型
<script setup lang="ts">
interface Props {
  user: User  // 使用全局类型
  response: ApiResponse<User[]>
}

const props = defineProps<Props>()
</script>
```

**最佳实践总结：**

1. **类型定义优先级**
```TypeScript
// ✅ 推荐：使用interface定义复杂类型
interface Props {
  title: string
  count?: number
}

// ✅ 可以：简单类型使用内联
const props = defineProps<{ title: string }>()

// ❌ 避免：运行时声明（除非需要验证）
const props = defineProps({
  title: String,
  count: Number
})
```

2. **默认值处理**
```TypeScript
// ✅ 推荐：使用withDefaults
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  options: () => ({})
})

// ❌ 避免：在接口中使用默认值
interface Props {
  count: number = 0  // 错误语法
}
```

### 记忆要点总结
- **类型声明**：defineProps<Interface>() 提供编译时类型检查
- **默认值**：withDefaults() 为可选属性提供默认值
- **复杂类型**：使用interface、type、泛型定义复杂结构
- **工具类型**：Partial、Pick、Omit、Record等提供类型变换
- **最佳实践**：类型优先、接口复用、全局类型声明

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

可以继续追问：如何在 Vue 3 中使用 TypeScript 定义组件 props？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
