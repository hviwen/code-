# `effectScope` 的用途是什么？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3响应式系统的高级特性，面试官想了解你是否理解副作用管理和内存泄漏防护的重要性。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案缺少具体的使用场景和代码示例
- 没有说明effectScope与组件生命周期的关系
- 缺少与手动管理副作用的对比

## 知识点系统梳理

effectScope 用于收集和管理一组响应式副作用（如 watch、computed 等），便于统一停止和释放资源，提升代码的可维护性。

### 问题本质解读 这道题考察Vue 3响应式系统的高级特性，面试官想了解你是否理解副作用管理和内存泄漏防护的重要性。

### 技术错误纠正
- 原答案缺少具体的使用场景和代码示例
- 没有说明effectScope与组件生命周期的关系
- 缺少与手动管理副作用的对比

### 知识点系统梳理

**effectScope的核心作用：**
- 收集在作用域内创建的响应式副作用
- 统一停止和清理这些副作用
- 防止内存泄漏，特别是在动态创建/销毁场景中

### 实战应用举例
```javascript
import { effectScope, ref, watch, computed, onScopeDispose } from 'vue'

// 1. 基础用法
const scope = effectScope()

scope.run(() => {
  const count = ref(0)
  
  // 这些副作用会被scope收集
  const doubled = computed(() => count.value * 2)
  
  watch(count, (newVal) => {
    console.log('count changed:', newVal)
  })
  
  // 在scope内注册清理函数
  onScopeDispose(() => {
    console.log('scope disposed')
  })
})

// 停止scope，清理所有副作用
scope.stop() // 所有watch、computed都会被停止

// 2. 实际应用场景 - 插件系统
class PluginManager {
  constructor() {
    this.plugins = new Map()
  }

  installPlugin(name, plugin) {
    // 为每个插件创建独立的scope
    const scope = effectScope()
    
    scope.run(() => {
      plugin.setup()
    })
    
    this.plugins.set(name, {
      plugin,
      scope
    })
  }

  uninstallPlugin(name) {
    const pluginInfo = this.plugins.get(name)
    if (pluginInfo) {
      // 停止插件的所有副作用
      pluginInfo.scope.stop()
      this.plugins.delete(name)
    }
  }

  destroy() {
    // 清理所有插件
    this.plugins.forEach(({ scope }) => {
      scope.stop()
    })
    this.plugins.clear()
  }
}

// 插件示例
const analyticsPlugin = {
  setup() {
    const pageViews = ref(0)
    const userActions = ref([])

    // 监听路由变化
    watch(() => router.currentRoute.value, (route) => {
      pageViews.value++
      track('page_view', { path: route.path })
    })

    // 监听用户行为
    watch(userActions, (actions) => {
      if (actions.length > 0) {
        sendAnalytics(actions)
      }
    }, { deep: true })

    // 清理函数
    onScopeDispose(() => {
      console.log('Analytics plugin disposed')
    })
  }
}

// 使用插件管理器
const pluginManager = new PluginManager()
pluginManager.installPlugin('analytics', analyticsPlugin)
// 后续卸载时会自动清理所有副作用
pluginManager.uninstallPlugin('analytics')

// 3. 动态组件管理
const DynamicComponentManager = {
  setup() {
    const components = ref(new Map())
    const componentScopes = new Map()

    const createComponent = (id, componentDef) => {
      // 为每个动态组件创建scope
      const scope = effectScope()
      
      const componentInstance = scope.run(() => {
        // 在scope内运行组件setup
        return componentDef.setup()
      })

      components.value.set(id, componentInstance)
      componentScopes.set(id, scope)
    }

    const destroyComponent = (id) => {
      const scope = componentScopes.get(id)
      if (scope) {
        scope.stop() // 清理组件的所有副作用
        components.value.delete(id)
        componentScopes.delete(id)
      }
    }

    const destroyAll = () => {
      componentScopes.forEach(scope => scope.stop())
      components.value.clear()
      componentScopes.clear()
    }

    return {
      components,
      createComponent,
      destroyComponent,
      destroyAll
    }
  }
}

// 4. 条件性副作用管理
const useConditionalEffect = (condition, effectFn) => {
  let currentScope = null

  watch(condition, (shouldRun) => {
    // 清理之前的副作用
    if (currentScope) {
      currentScope.stop()
      currentScope = null
    }

    // 条件满足时创建新的副作用
    if (shouldRun) {
      currentScope = effectScope()
      currentScope.run(effectFn)
    }
  }, { immediate: true })

  // 组件卸载时清理
  onScopeDispose(() => {
    if (currentScope) {
      currentScope.stop()
    }
  })
}

// 使用条件性副作用
const ConditionalDemo = {
  setup() {
    const isFeatureEnabled = ref(false)

    useConditionalEffect(
      () => isFeatureEnabled.value,
      () => {
        // 只有当功能启用时才运行这些副作用
        const data = ref([])
        
        watch(data, (newData) => {
          console.log('Feature data updated:', newData)
        })

        const processedData = computed(() => {
          return data.value.map(item => processItem(item))
        })

        console.log('Feature effects created')
      }
    )

    return { isFeatureEnabled }
  }
}

// 5. 嵌套scope
const createNestedScope = () => {
  const parentScope = effectScope()

  parentScope.run(() => {
    const parentData = ref('parent')

    // 嵌套的子scope
    const childScope = effectScope()

    childScope.run(() => {
      const childData = ref('child')
      
      watch([parentData, childData], ([parent, child]) => {
        console.log('Parent:', parent, 'Child:', child)
      })
    })

    // 可以独立停止子scope
    setTimeout(() => {
      childScope.stop() // 只停止子scope的副作用
    }, 5000)
  })

  return parentScope
}

// 6. 与Composables结合使用
const useUserData = (userId) => {
  const scope = effectScope(true) // detached scope
  
  return scope.run(() => {
    const userData = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const fetchUser = async () => {
      loading.value = true
      try {
        const response = await fetch(`/api/users/${userId}`)
        userData.value = await response.json()
      } catch (err) {
        error.value = err
      } finally {
        loading.value = false
      }
    }

    watch(() => userId, fetchUser, { immediate: true })

    // 返回数据和清理函数
    return {
      userData,
      loading,
      error,
      cleanup: () => scope.stop()
    }
  })
}

// 在组件中使用
export default {
  setup() {
    const userId = ref(1)
    let userDataScope = null

    const loadUser = (id) => {
      // 清理之前的用户数据scope
      if (userDataScope) {
        userDataScope.cleanup()
      }

      userDataScope = useUserData(id)
    }

    onUnmounted(() => {
      if (userDataScope) {
        userDataScope.cleanup()
      }
    })

    return { loadUser }
  }
}
```

**使用场景对比：**
```javascript
const usageScenarios = {
  必要场景: [
    '动态创建/销毁组件',
    '插件系统',
    '条件性副作用',
    '手动管理生命周期'
  ],
  
  非必要场景: [
    '普通组件内的副作用（自动清理）',
    '简单的watch和computed',
    '短期存在的副作用'
  ]
}
```

### 记忆要点总结
- 作用：统一管理和清理响应式副作用
- 核心API：`effectScope()` 创建、`scope.run()` 执行、`scope.stop()` 清理
- 应用场景：动态组件、插件系统、条件性副作用
- 与组件的区别：组件自动管理，effectScope需手动管理
- 最佳实践：结合`onScopeDispose`注册清理逻辑

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

可以继续追问：`effectScope` 的用途是什么？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
