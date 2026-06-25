# 如何实现跨组件的事件总线（建议方式）？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题核心是在确认对「如何实现跨组件的事件总线（建议方式）？」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

推荐通过状态提升到独立的 store（如 Pinia）统一管理，实现跨组件通信和状态同步。

问题本质解读： 此问题考察候选人对 Vue 3 应用架构的理解，特别是大型应用中组件通信的最佳实践。面试官关注的是候选人是否理解传统事件总线的问题，以及现代 Vue 3应用中推荐的状态管理方案。

技术错误纠正：

- 原答案正确但过于简略，缺少具体实现和对比分析
- **未说明为什么不推荐全局事件总线**
- 缺少 Pinia 的具体使用示例
- 未提及其他可选方案和适用场景

知识点系统梳理：

- Vue 3 中移除了 $bus 的内置支持
- 状态管理库：Pinia、Vuex 的对比和选择
- 组合式 API 中的状态共享模式
- 依赖注入在跨组件通信中的应用
- 自定义 Composables 的设计原则

实战应用举例：

```javascript
// 方式1：使用 Pinia 进行状态管理（推荐）
// stores/notification.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
  )

  // 添加通知
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    notifications.value.unshift(newNotification)

    // 自动清理旧通知（保留最新100条）
    if (notifications.value.length > 100) {
      notifications.value = notifications.value.slice(0, 100)
    }
  }

  // 标记为已读
  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  // 清除所有通知
  const clearAll = () => {
    notifications.value = []
  }

  // 删除特定通知
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    notifications: readonly(notifications),
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
    removeNotification
  }
})
```

```vue
// 在组件中使用
// ComponentA.vue - 发送通知
<template>
  <div>
    <button @click="sendNotification">发送通知</button>
    <button @click="sendErrorNotification">发送错误通知</button>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const sendNotification = () => {
  notificationStore.addNotification({
    type: 'success',
    title: '操作成功',
    message: '数据已保存成功',
    duration: 3000
  })
}

const sendErrorNotification = () => {
  notificationStore.addNotification({
    type: 'error',
    title: '操作失败',
    message: '网络连接错误，请重试',
    duration: 5000
  })
}
</script>

// ComponentB.vue - 接收和显示通知
<template>
  <div class="notification-center">
    <div class="notification-header">
      <h3>通知中心</h3>
      <span class="badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
    </div>

    <div class="notification-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification-item', notification.type, { unread: !notification.read }]"
        @click="markAsRead(notification.id)"
      >
        <h4>{{ notification.title }}</h4>
        <p>{{ notification.message }}</p>
        <span class="timestamp">{{ formatTime(notification.timestamp) }}</span>
        <button @click.stop="removeNotification(notification.id)">删除</button>
      </div>
    </div>

    <button @click="clearAll" v-if="notifications.length > 0">
      清空所有通知
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const markAsRead = (id) => {
  notificationStore.markAsRead(id)
}

const removeNotification = (id) => {
  notificationStore.removeNotification(id)
}

const clearAll = () => {
  notificationStore.clearAll()
}

const formatTime = (timestamp) => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}
</script>
```

```javascript
// 方式2：使用 Composables 进行状态共享
// composables/useEventBus.js
import { ref, readonly } from 'vue'

class EventBus {
  constructor() {
    this.events = new Map()
  }

  // 订阅事件
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)

    // 返回取消订阅函数
    return () => {
      const callbacks = this.events.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // 触发事件
  emit(event, ...args) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`事件处理器执行失败 [${event}]:`, error)
        }
      })
    }
  }

  // 一次性订阅
  once(event, callback) {
    const unsubscribe = this.on(event, (...args) => {
      unsubscribe()
      callback(...args)
    })
    return unsubscribe
  }

  // 清除所有事件监听器
  clear() {
    this.events.clear()
  }

  // 清除特定事件的所有监听器
  off(event) {
    this.events.delete(event)
  }
}

// 创建全局事件总线实例
const globalEventBus = new EventBus()

export const useEventBus = () => {
  return {
    on: globalEventBus.on.bind(globalEventBus),
    emit: globalEventBus.emit.bind(globalEventBus),
    once: globalEventBus.once.bind(globalEventBus),
    off: globalEventBus.off.bind(globalEventBus),
    clear: globalEventBus.clear.bind(globalEventBus)
  }
}
```

```vue
// 在组件中使用事件总线
// ComponentC.vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useEventBus } from '@/composables/useEventBus'

const eventBus = useEventBus()
const unsubscribeCallbacks = []

onMounted(() => {
  // 订阅用户登录事件
  const unsubscribeLogin = eventBus.on('user:login', (user) => {
    console.log('用户登录:', user)
  })

  // 订阅数据更新事件
  const unsubscribeDataUpdate = eventBus.on('data:update', (data) => {
    console.log('数据更新:', data)
  })

  // 保存取消订阅函数
  unsubscribeCallbacks.push(unsubscribeLogin, unsubscribeDataUpdate)
})

onUnmounted(() => {
  // 组件销毁时取消所有订阅
  unsubscribeCallbacks.forEach(unsubscribe => unsubscribe())
})

const triggerEvent = () => {
  eventBus.emit('data:update', { id: 1, name: 'Updated Data' })
}
</script>
```

```javascript
// 方式3：使用 provide/inject 创建局部事件系统
// composables/useLocalEventBus.js
import { inject, provide, reactive } from 'vue'

const EVENT_BUS_KEY = Symbol('eventBus')

export const provideEventBus = () => {
  const eventBus = reactive({
    events: new Map(),

    on(event, callback) {
      if (!this.events.has(event)) {
        this.events.set(event, [])
      }
      this.events.get(event).push(callback)
    },

    emit(event, data) {
      const callbacks = this.events.get(event)
      if (callbacks) {
        callbacks.forEach(callback => callback(data))
      }
    },

    off(event, callback) {
      const callbacks = this.events.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  })

  provide(EVENT_BUS_KEY, eventBus)
  return eventBus
}

export const useLocalEventBus = () => {
  const eventBus = inject(EVENT_BUS_KEY)
  if (!eventBus) {
    throw new Error('useLocalEventBus must be used within a component that provides eventBus')
  }
  return eventBus
}
```

```vue
// 使用局部事件总线
// ParentComponent.vue
<template>
  <div>
    <ChildA />
    <ChildB />
  </div>
</template>

<script setup>
import { provideEventBus } from '@/composables/useLocalEventBus'
import ChildA from './ChildA.vue'
import ChildB from './ChildB.vue'

// 在父组件中提供事件总线
const eventBus = provideEventBus()

// 父组件也可以监听事件
eventBus.on('child:action', (data) => {
  console.log('子组件触发了行动:', data)
})
</script>

// ChildA.vue
<template>
  <button @click="triggerAction">触发行动</button>
</template>

<script setup>
import { useLocalEventBus } from '@/composables/useLocalEventBus'

const eventBus = useLocalEventBus()

const triggerAction = () => {
  eventBus.emit('child:action', { id: 1, name: 'Child A Action' })
}
</script>

// ChildB.vue
<template>
  <p>收到行动: {{ actionData.name }}</p>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocalEventBus } from '@/composables/useLocalEventBus'

const eventBus = useLocalEventBus()
const actionData = ref(null)

const handleAction = (data) => {
  actionData.value = data
}

onMounted(() => {
  eventBus.on('child:action', handleAction)
})

onUnmounted(() => {
  eventBus.off('child:action', handleAction)
})
</script>
```

```javascript
// 方式4：高级状态管理模式
// stores/modules/chat.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const rooms = ref([])
  const currentRoomId = ref(null)
  const messages = ref([])
  const onlineUsers = ref([])

  const currentRoom = computed(() =>
    rooms.value.find(room => room.id === currentRoomId.value)
  )

  const roomMessages = computed(() =>
    messages.value.filter(msg => msg.roomId === currentRoomId.value)
  )

  // WebSocket 连接管理
  const socket = ref(null)
  const isConnected = ref(false)

  const connect = () => {
    socket.value = new WebSocket('ws://localhost:8080/chat')

    socket.value.onopen = () => {
      isConnected.value = true
      console.log('聊天连接已建立')
    }

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleSocketMessage(data)
    }

    socket.value.onclose = () => {
      isConnected.value = false
      console.log('聊天连接已断开')
    }
  }

  const handleSocketMessage = (data) => {
    switch (data.type) {
      case 'new_message':
        messages.value.push(data.message)
        break
      case 'user_joined':
        onlineUsers.value.push(data.user)
        break
      case 'user_left':
        onlineUsers.value = onlineUsers.value.filter(u => u.id !== data.userId)
        break
    }
  }

  const sendMessage = (content) => {
    if (socket.value && isConnected.value) {
      const message = {
        type: 'send_message',
        roomId: currentRoomId.value,
        content,
        timestamp: new Date()
      }
      socket.value.send(JSON.stringify(message))
    }
  }

  const joinRoom = (roomId) => {
    currentRoomId.value = roomId
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify({
        type: 'join_room',
        roomId
      }))
    }
  }

  return {
    rooms: readonly(rooms),
    currentRoom,
    messages: readonly(messages),
    roomMessages,
    onlineUsers: readonly(onlineUsers),
    isConnected: readonly(isConnected),
    connect,
    sendMessage,
    joinRoom
  }
})

```

使用场景对比：
- Pinia Store：适用于需要持久化、复杂状态逻辑的全局状态管理
- Composables EventBus：适用于简单的跨组件事件通信，不需要状态持久化
- Provide/Inject：适用于组件树内的局部通信，避免全局污染
- 选择建议：优先使用 Pinia，简单场景用 Composables，避免传统的全局事件总线

记忆要点总结：
- Vue 3 移除了内置事件总线，推荐使用状态管理库
- Pinia 是官方推荐的状态管理解决方案，比 Vuex 更简洁
- 使用 defineStore 创建 store，支持 Composition API 风格
- 事件总线适合临时通信，状态管理适合持久化数据
- 组件销毁时记得清理事件监听器，避免内存泄漏

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

可以继续追问：如何实现跨组件的事件总线（建议方式）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
