# 原题：如何对 Pinia store 做权限/隔离（多租户或不同用户）？

> 来源：`docs/pinia/pinia_part_2_answer.md`

## 问题本质解读

这道题考察企业级应用中的多租户架构和权限隔离设计，面试官想了解你是否掌握大型应用的数据安全和访问控制策略。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案"根据身份建立多个不同的store"过于简化，实际应该是基于租户ID或用户权限进行数据隔离
- 需要结合后端API的权限控制，而不仅仅是前端store分离
- 应该考虑数据泄露风险和安全边界

## 知识点系统梳理

### 原始答案（保留，不作修改）

根据身份建立多个不同的store，然后将身份切换的逻辑抽离成公共部分，并监听身份状态的变化

### 问题本质解读 这道题考察企业级应用中的多租户架构和权限隔离设计，面试官想了解你是否掌握大型应用的数据安全和访问控制策略。

### 技术错误纠正
- 原答案"根据身份建立多个不同的store"过于简化，实际应该是基于租户ID或用户权限进行数据隔离
- 需要结合后端API的权限控制，而不仅仅是前端store分离
- 应该考虑数据泄露风险和安全边界

### 知识点系统梳理

**多租户隔离策略：**
- **数据库级隔离**：每个租户独立数据库
- **Schema级隔离**：共享数据库，独立Schema
- **行级隔离**：共享表，通过tenant_id字段隔离
- **应用级隔离**：前端根据租户ID过滤数据

**Pinia中的实现方式：**
- **插件注入**：通过插件统一注入租户上下文
- **Store命名空间**：基于租户ID创建独立store实例
- **权限装饰器**：在actions执行前进行权限校验
- **数据过滤**：在getters中根据权限过滤数据

### 实战应用举例
```TypeScript
// 1. 租户上下文管理
interface TenantContext {
  tenantId: string
  userId: string
  permissions: string[]
  roles: string[]
}

// 租户上下文store
export const useTenantStore = defineStore('tenant', () => {
  const context = ref<TenantContext | null>(null)

  const setContext = (newContext: TenantContext) => {
    context.value = newContext
  }

  const clearContext = () => {
    context.value = null
  }

  const hasPermission = (permission: string) => {
    return context.value?.permissions.includes(permission) ?? false
  }

  const hasRole = (role: string) => {
    return context.value?.roles.includes(role) ?? false
  }

  return {
    context: readonly(context),
    setContext,
    clearContext,
    hasPermission,
    hasRole
  }
})

// 2. 租户隔离插件
function createTenantPlugin() {
  return ({ store }: PiniaPluginContext) => {
    const tenantStore = useTenantStore()

    // 注入租户上下文到每个store
    store.$tenantContext = computed(() => tenantStore.context)

    // 添加权限检查方法
    store.$hasPermission = (permission: string) => {
      return tenantStore.hasPermission(permission)
    }

    // 添加角色检查方法
    store.$hasRole = (role: string) => {
      return tenantStore.hasRole(role)
    }

    // 拦截actions，进行权限校验
    store.$onAction(({ name, store, args, after, onError }) => {
      const actionConfig = store.$actionPermissions?.[name]

      if (actionConfig) {
        const { permissions, roles } = actionConfig

        // 检查权限
        if (permissions && !permissions.every(p => tenantStore.hasPermission(p))) {
          throw new Error(`权限不足：缺少权限 ${permissions.join(', ')}`)
        }

        // 检查角色
        if (roles && !roles.some(r => tenantStore.hasRole(r))) {
          throw new Error(`权限不足：需要角色 ${roles.join(' 或 ')}`)
        }
      }
    })
  }
}

// 3. 带权限控制的用户store
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const tenantStore = useTenantStore()

  // 定义action权限要求
  const $actionPermissions = {
    createUser: { permissions: ['user:create'] },
    updateUser: { permissions: ['user:update'] },
    deleteUser: { permissions: ['user:delete'], roles: ['admin'] },
    viewSensitiveData: { permissions: ['user:view:sensitive'] }
  }

  // 获取当前租户的用户列表
  const filteredUsers = computed(() => {
    const context = tenantStore.context
    if (!context) return []

    return users.value.filter(user =>
      user.tenantId === context.tenantId
    )
  })

  // 根据权限过滤用户字段
  const usersWithPermissionFilter = computed(() => {
    return filteredUsers.value.map(user => {
      const filteredUser = { ...user }

      // 敏感信息需要特殊权限
      if (!tenantStore.hasPermission('user:view:sensitive')) {
        delete filteredUser.email
        delete filteredUser.phone
        delete filteredUser.address
      }

      return filteredUser
    })
  })

  const createUser = async (userData: CreateUserRequest) => {
    const context = tenantStore.context
    if (!context) throw new Error('未设置租户上下文')

    const response = await api.post('/users', {
      ...userData,
      tenantId: context.tenantId
    })

    users.value.push(response.data)
    return response.data
  }

  return {
    users: usersWithPermissionFilter,
    createUser,
    $actionPermissions
  }
})
```

**使用场景对比：**

| 隔离策略 | 优点 | 缺点 | 适用场景 |
|---------|------|------|----------|
| **数据库级隔离** | 完全隔离<br>性能好<br>易于备份 | 成本高<br>维护复杂 | 大型企业客户<br>严格合规要求 |
| **Schema级隔离** | 较好隔离<br>成本适中 | 数据库依赖<br>迁移复杂 | 中型企业<br>数据敏感度高 |
| **行级隔离** | 成本低<br>易于实现 | 数据泄露风险<br>性能影响 | 小型应用<br>简单多租户 |
| **应用级隔离** | 灵活性高<br>易于开发 | 安全性依赖前端<br>容易绕过 | 内部系统<br>信任环境 |

**记忆要点总结（增强版）：**
- **核心原则**：前端隔离 + 后端验证，双重保障
- **实现方式**：插件注入租户上下文，actions权限校验
- **数据过滤**：在getters中根据权限过滤敏感数据
- **API安全**：请求头自动注入租户信息，响应拦截权限错误
- **最佳实践**：永远不要仅依赖前端权限控制

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

可以继续追问：原题：如何对 Pinia store 做权限/隔离（多租户或不同用户）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
