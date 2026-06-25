# 原题：如何为 Pinia store 编写单元测试？（思路）

> 来源：`docs/pinia/pinia_part_2_answer.md`

## 问题本质解读

这道题考察测试驱动开发和质量保障能力，面试官想了解你是否掌握状态管理的测试策略和最佳实践。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案为空，需要补充完整的测试策略和实现方案
- 需要考虑store的隔离性、依赖注入、异步操作测试等关键问题
- 应该区分单元测试、集成测试和端到端测试的不同场景

## 知识点系统梳理

### 原始答案（保留，不作修改）

：无

### 问题本质解读 这道题考察测试驱动开发和质量保障能力，面试官想了解你是否掌握状态管理的测试策略和最佳实践。

### 技术错误纠正
- 原答案为空，需要补充完整的测试策略和实现方案
- 需要考虑store的隔离性、依赖注入、异步操作测试等关键问题
- 应该区分单元测试、集成测试和端到端测试的不同场景

### 知识点系统梳理

**Pinia测试核心概念：**
- **测试隔离**：每个测试用例使用独立的Pinia实例
- **依赖模拟**：Mock外部API、服务和其他store
- **状态断言**：验证actions执行后的状态变化
- **异步测试**：处理包含异步操作的actions

**测试环境配置：**
- **测试框架**：Vitest、Jest等
- **Vue测试工具**：@vue/test-utils
- **Mock工具**：MSW、vi.mock等
- **断言库**：内置断言或专用断言库

### 实战应用举例
```TypeScript
// 1. 测试环境配置
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})

// src/test/setup.ts
import { beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// 每个测试前创建新的Pinia实例
beforeEach(() => {
  setActivePinia(createPinia())
})

// 2. 基础store测试
// stores/user.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'
import * as userApi from '@/api/user'

// Mock API模块
vi.mock('@/api/user', () => ({
  fetchUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn()
}))

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      const store = useUserStore()

      expect(store.users).toEqual([])
      expect(store.currentUser).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    it('activeUsers应该返回激活的用户', () => {
      const store = useUserStore()

      // 设置测试数据
      store.users = [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
        { id: 3, name: 'Charlie', active: true }
      ]

      expect(store.activeUsers).toHaveLength(2)
      expect(store.activeUsers.map(u => u.name)).toEqual(['Alice', 'Charlie'])
    })

    it('userCount应该返回正确的用户数量', () => {
      const store = useUserStore()

      store.users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]

      expect(store.userCount).toBe(2)
    })
  })

  describe('actions', () => {
    it('fetchUsers应该成功获取用户列表', async () => {
      const mockUsers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]

      vi.mocked(userApi.fetchUser).mockResolvedValue({
        data: mockUsers,
        total: 2
      })

      const store = useUserStore()
      await store.fetchUsers()

      expect(store.users).toEqual(mockUsers)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(userApi.fetchUser).toHaveBeenCalledOnce()
    })

    it('fetchUsers应该处理错误情况', async () => {
      const errorMessage = '网络错误'
      vi.mocked(userApi.fetchUser).mockRejectedValue(new Error(errorMessage))

      const store = useUserStore()

      await expect(store.fetchUsers()).rejects.toThrow(errorMessage)
      expect(store.users).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })

    it('updateUser应该更新用户信息', async () => {
      const userId = 1
      const updateData = { name: 'Alice Updated' }
      const updatedUser = { id: userId, ...updateData }

      vi.mocked(userApi.updateUser).mockResolvedValue({
        data: updatedUser
      })

      const store = useUserStore()
      // 设置初始用户
      store.users = [{ id: 1, name: 'Alice' }]

      await store.updateUser(userId, updateData)

      expect(store.users[0]).toEqual(updatedUser)
      expect(userApi.updateUser).toHaveBeenCalledWith(userId, updateData)
    })

    it('deleteUser应该删除用户', async () => {
      const userId = 1

      vi.mocked(userApi.deleteUser).mockResolvedValue({ success: true })

      const store = useUserStore()
      store.users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]

      await store.deleteUser(userId)

      expect(store.users).toHaveLength(1)
      expect(store.users[0].id).toBe(2)
      expect(userApi.deleteUser).toHaveBeenCalledWith(userId)
    })
  })

  describe('状态变更', () => {
    it('setCurrentUser应该设置当前用户', () => {
      const store = useUserStore()
      const user = { id: 1, name: 'Alice' }

      store.setCurrentUser(user)

      expect(store.currentUser).toEqual(user)
    })

    it('clearError应该清除错误状态', () => {
      const store = useUserStore()
      store.error = '某个错误'

      store.clearError()

      expect(store.error).toBeNull()
    })
  })
})

// 3. 多store交互测试
// stores/integration.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'
import { useUserStore } from './user'
import { useCartStore } from './cart'

describe('Store集成测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('登录成功后应该初始化用户信息', async () => {
    const authStore = useAuthStore()
    const userStore = useUserStore()

    // Mock登录API
    vi.mocked(authApi.login).mockResolvedValue({
      token: 'mock-token',
      user: { id: 1, name: 'Alice' }
    })

    // Mock用户资料API
    vi.mocked(userApi.fetchProfile).mockResolvedValue({
      data: { id: 1, name: 'Alice', email: 'alice@example.com' }
    })

    await authStore.login({ username: 'alice', password: 'password' })

    expect(authStore.isAuthenticated).toBe(true)
    expect(userStore.profile).toBeTruthy()
    expect(userStore.profile.email).toBe('alice@example.com')
  })

  it('登出时应该清理所有相关状态', async () => {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const cartStore = useCartStore()

    // 设置初始状态
    authStore.token = 'mock-token'
    userStore.profile = { id: 1, name: 'Alice' }
    cartStore.items = [{ id: 1, name: 'Product' }]

    await authStore.logout()

    expect(authStore.token).toBeNull()
    expect(userStore.profile).toBeNull()
    expect(cartStore.items).toEqual([])
  })
})

// 4. 组件中store的测试
// components/UserProfile.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import UserProfile from './UserProfile.vue'
import { useUserStore } from '@/stores/user'

describe('UserProfile组件', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该显示用户信息', async () => {
    const wrapper = mount(UserProfile)
    const store = useUserStore()

    // 设置store状态
    store.currentUser = {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com'
    }

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('alice@example.com')
  })

  it('应该处理加载状态', async () => {
    const wrapper = mount(UserProfile)
    const store = useUserStore()

    store.loading = true

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('应该调用store的action', async () => {
    const wrapper = mount(UserProfile)
    const store = useUserStore()

    // Spy store方法
    const updateSpy = vi.spyOn(store, 'updateProfile')

    await wrapper.find('form').trigger('submit')

    expect(updateSpy).toHaveBeenCalled()
  })
})

// 5. 异步操作和错误处理测试
describe('异步操作测试', () => {
  it('应该正确处理并发请求', async () => {
    const store = useUserStore()

    // Mock API返回不同的延迟
    vi.mocked(userApi.fetchUser)
      .mockImplementationOnce(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: [{ id: 1 }] }), 100))
      )
      .mockImplementationOnce(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: [{ id: 2 }] }), 50))
      )

    // 同时发起两个请求
    const [result1, result2] = await Promise.all([
      store.fetchUsers(),
      store.fetchUsers()
    ])

    // 验证最后的状态是正确的
    expect(store.users).toBeDefined()
    expect(store.loading).toBe(false)
  })

  it('应该正确处理请求取消', async () => {
    const store = useUserStore()
    const abortController = new AbortController()

    vi.mocked(userApi.fetchUser).mockImplementation(() =>
      new Promise((_, reject) => {
        abortController.signal.addEventListener('abort', () => {
          reject(new Error('Request cancelled'))
        })
      })
    )

    const fetchPromise = store.fetchUsers({ signal: abortController.signal })
    abortController.abort()

    await expect(fetchPromise).rejects.toThrow('Request cancelled')
    expect(store.loading).toBe(false)
  })
})

// 6. 性能测试
describe('性能测试', () => {
  it('大量数据操作应该在合理时间内完成', async () => {
    const store = useUserStore()
    const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `User ${i}`
    }))

    const startTime = performance.now()

    store.users = largeDataSet
    const activeUsers = store.activeUsers

    const endTime = performance.now()
    const duration = endTime - startTime

    expect(duration).toBeLessThan(100) // 应该在100ms内完成
    expect(activeUsers).toBeDefined()
  })
})
```

**测试策略对比：**

| 测试类型 | 测试范围 | 优点 | 缺点 | 适用场景 |
|---------|---------|------|------|----------|
| **单元测试** | 单个store的actions/getters | 快速<br>隔离性好 | 覆盖面有限<br>可能遗漏集成问题 | 核心业务逻辑<br>复杂计算 |
| **集成测试** | 多个store交互 | 真实场景<br>发现集成问题 | 复杂度高<br>调试困难 | 跨模块操作<br>数据流验证 |
| **组件测试** | 组件+store交互 | 用户视角<br>UI逻辑验证 | 环境复杂<br>维护成本高 | 关键用户流程<br>UI状态管理 |
| **端到端测试** | 完整用户流程 | 最真实<br>全链路验证 | 慢<br>脆弱<br>调试困难 | 核心业务流程<br>回归测试 |

### 记忆要点总结
- **测试隔离**：每个测试用例使用独立的Pinia实例
- **依赖模拟**：Mock外部API和服务，确保测试可控
- **状态断言**：验证actions执行后的状态变化
- **异步处理**：正确测试包含异步操作的actions
- **错误场景**：测试错误处理和边界情况
- **性能考虑**：对大数据量操作进行性能测试

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

可以继续追问：原题：如何为 Pinia store 编写单元测试？（思路） 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
