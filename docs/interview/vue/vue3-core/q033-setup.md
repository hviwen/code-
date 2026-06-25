# 如何在模板或 setup 中调用父组件方法？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题核心是在确认对「如何在模板或 setup 中调用父组件方法？」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

1. ~~通过 emits 传递事件方法，子组件调用时传递参数。~~
2. ~~父组件通过 provide 提供方法，子组件 inject 获取并调用。~~

- defineEmits defineExpose
- proive / inject

问题本质解读： 此问题考察 Vue 3组件间通信机制的理解，特别是子组件向父组件传递数据和调用父组件方法的能力。面试官主要关注候选人对事件系统、依赖注入模式的掌握以及在不同场景下选择合适通信方式的判断力。

技术错误纠正：
- 原答案过于简略，缺少具体的实现细节和语法示例
- 未说明 emits 的正确声明方式和类型安全
- 缺少 Composition API 中的具体用法
- 未提及 defineEmits 和 defineExpose 等 Vue 3 特有的 API

知识点系统梳理：
- Vue 3 事件系统：emit/emits 声明、事件监听器
- 依赖注入：provide/inject 的基本概念和高级用法
- 组件实例方法暴露：defineExpose 的使用场景
- 类型安全：TypeScript 中的事件类型定义
- 性能考虑：避免深层 prop drilling

实战应用举例：

```vue
// 方式1：通过 emits 传递事件（推荐）
// 父组件
<template>
  <div>
    <h1>用户管理</h1>
    <UserForm @save-user="handleSaveUser" @cancel="handleCancel" />
    <UserList :users="users" @delete-user="handleDeleteUser" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserForm from './components/UserForm.vue'
import UserList from './components/UserList.vue'

const users = ref([])

// 处理保存用户
const handleSaveUser = async (userData) => {
  try {
    const response = await api.saveUser(userData)
    users.value.push(response.data)
    console.log('用户保存成功:', userData)
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 处理取消操作
const handleCancel = () => {
  console.log('操作已取消')
}

// 处理删除用户
const handleDeleteUser = async (userId) => {
  try {
    await api.deleteUser(userId)
    users.value = users.value.filter(user => user.id !== userId)
  } catch (error) {
    console.error('删除失败:', error)
  }
}
</script>

// 子组件 UserForm.vue
<template>
  <form @submit.prevent="submitForm">
    <input v-model="form.name" placeholder="用户名" required />
    <input v-model="form.email" placeholder="邮箱" type="email" required />
    <button type="submit">保存</button>
    <button type="button" @click="cancelForm">取消</button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 声明组件可以触发的事件
const emit = defineEmits({
  'save-user': (userData) => {
    // 事件验证
    return userData && userData.name && userData.email
  },
  'cancel': null // 无参数事件
})

const form = reactive({
  name: '',
  email: ''
})

const submitForm = () => {
  // 触发父组件方法
  emit('save-user', { ...form })

  // 重置表单
  form.name = ''
  form.email = ''
}

const cancelForm = () => {
  emit('cancel')
}
</script>

// 方式2：通过 provide/inject（跨层级通信）
// 祖先组件
<script setup>
import { provide, ref } from 'vue'

const userList = ref([])

// 提供用户管理方法
const userService = {
  addUser: (user) => {
    userList.value.push({ ...user, id: Date.now() })
  },
  removeUser: (userId) => {
    const index = userList.value.findIndex(user => user.id === userId)
    if (index > -1) {
      userList.value.splice(index, 1)
    }
  },
  updateUser: (userId, updates) => {
    const user = userList.value.find(user => user.id === userId)
    if (user) {
      Object.assign(user, updates)
    }
  },
  getUsers: () => userList.value
}

// 注入用户服务
provide('userService', userService)
provide('users', readonly(userList))
</script>

// 后代组件（任意层级）
<script setup>
import { inject } from 'vue'

// 注入父组件提供的服务
const userService = inject('userService')
const users = inject('users')

const addNewUser = () => {
  userService.addUser({
    name: 'New User',
    email: 'newuser@example.com'
  })
}

const deleteUser = (userId) => {
  userService.removeUser(userId)
}
</script>

// 方式3：通过 defineExpose 暴露组件方法（不推荐用于父子通信）
// 子组件
<script setup>
import { ref } from 'vue'

const count = ref(0)
const message = ref('Hello')

const increment = () => {
  count.value++
}

const updateMessage = (newMessage) => {
  message.value = newMessage
}

// 暴露方法供父组件调用
defineExpose({
  increment,
  updateMessage,
  count: readonly(count)
})
</script>

// 父组件
<template>
  <div>
    <ChildComponent ref="childRef" />
    <button @click="callChildMethod">调用子组件方法</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref()

const callChildMethod = () => {
  if (childRef.value) {
    childRef.value.increment()
    childRef.value.updateMessage('Updated from parent')
  }
}
</script>

// 类型安全的事件定义（TypeScript）
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

// 定义事件类型
const emit = defineEmits<{
  (e: 'save-user', user: Omit<User, 'id'>): void
  (e: 'delete-user', userId: number): void
  (e: 'update-user', userId: number, updates: Partial<User>): void
}>()

const handleSave = (userData: Omit<User, 'id'>) => {
  emit('save-user', userData)
}
</script>

```

使用场景对比：

- Emits 事件系统：适用于直接的父子组件通信，事件驱动的交互，符合 Vue 的设计哲学
- Provide/Inject：适用于跨多层级的组件通信，共享状态或服务，避免 prop drilling
- defineExpose：仅在需要命令式调用子组件方法时使用，不推荐作为主要通信方式
- 选择建议：优先使用 emits，需要跨层级时使用 provide/inject，避免使用 ref 直接调用

记忆要点总结：

- 子调父：优先使用 emit('event-name', data)
- 事件声明：defineEmits(['event1', 'event2']) 或对象形式验证
- 跨层级：provide('key', value) + inject('key')
- 类型安全：使用 TypeScript 定义明确的事件参数类型
- 最佳实践：事件命名使用 kebab-case，数据单向流动

----

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在模板或 setup 中调用父组件方法？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
