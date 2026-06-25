# `computed` 的缓存失效有哪些触发条件？

> 来源：`docs/vue/vue_3_part_2_answer.md`

## 问题本质解读

这道题考察computed的缓存机制和依赖追踪，面试官想了解你是否理解Vue的性能优化原理。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案过于简化，需要详细说明依赖收集的具体机制
- 缺少条件依赖、深层依赖等复杂场景的说明
- 没有提及computed的惰性计算特性

## 知识点系统梳理

当其依赖的任意一项响应式源发生改变，computed的缓存将失效

### 问题本质解读 这道题考察computed的缓存机制和依赖追踪，面试官想了解你是否理解Vue的性能优化原理。

### 技术错误纠正
- 原答案过于简化，需要详细说明依赖收集的具体机制
- 缺少条件依赖、深层依赖等复杂场景的说明
- 没有提及computed的惰性计算特性

### 知识点系统梳理

**computed缓存失效的触发条件：**
1. **直接依赖变化**：computed函数中直接使用的响应式数据发生变化
2. **间接依赖变化**：依赖的其他computed或响应式数据发生变化
3. **深层依赖变化**：对象或数组的嵌套属性发生变化（如果被访问）
4. **条件依赖变化**：在条件分支中访问的响应式数据发生变化
5. **动态依赖变化**：运行时动态访问的响应式数据发生变化

**缓存机制原理：**
- **惰性计算**：只有在被访问时才执行计算
- **脏标记**：依赖变化时标记为"脏"，下次访问时重新计算
- **依赖追踪**：自动收集计算过程中访问的响应式数据
- **缓存复用**：依赖未变化时直接返回缓存值

### 实战应用举例
```javascript
import { ref, reactive, computed, watch } from 'vue'

export default {
  setup() {
    const user = reactive({
      firstName: 'John',
      lastName: 'Doe',
      profile: {
        age: 25,
        email: 'john@example.com',
        settings: {
          theme: 'dark',
          notifications: true
        }
      },
      hobbies: ['reading', 'coding'],
      posts: [
        { id: 1, title: 'Vue 3 Guide', likes: 10 },
        { id: 2, title: 'Composition API', likes: 15 }
      ]
    })

    const showAge = ref(true)
    const multiplier = ref(2)
    const filter = ref('all')

    // 1. 直接依赖 - firstName, lastName变化时失效
    const fullName = computed(() => {
      console.log('fullName computed')
      return `${user.firstName} ${user.lastName}`
    })

    // 2. 间接依赖 - fullName变化时失效
    const greeting = computed(() => {
      console.log('greeting computed')
      return `Hello, ${fullName.value}!`
    })

    // 3. 条件依赖 - showAge或user.profile.age变化时失效
    const userInfo = computed(() => {
      console.log('userInfo computed')
      let info = fullName.value
      if (showAge.value) {
        // 只有当showAge为true时，age才会成为依赖
        info += ` (${user.profile.age} years old)`
      }
      return info
    })

    // 4. 深层依赖 - 嵌套对象属性变化
    const userSettings = computed(() => {
      console.log('userSettings computed')
      return {
        theme: user.profile.settings.theme,
        notifications: user.profile.settings.notifications,
        email: user.profile.email
      }
    })

    // 5. 数组依赖 - 数组内容变化时失效
    const hobbyCount = computed(() => {
      console.log('hobbyCount computed')
      return user.hobbies.length
    })

    // 6. 复杂数组操作 - 数组元素属性变化
    const totalLikes = computed(() => {
      console.log('totalLikes computed')
      return user.posts.reduce((sum, post) => sum + post.likes, 0)
    })

    // 7. 动态依赖 - 根据条件访问不同属性
    const dynamicValue = computed(() => {
      console.log('dynamicValue computed')
      if (filter.value === 'age') {
        return user.profile.age * multiplier.value
      } else if (filter.value === 'posts') {
        return user.posts.length * multiplier.value
      } else {
        return user.hobbies.length * multiplier.value
      }
    })

    // 8. 计算属性链 - 多层依赖
    const userSummary = computed(() => {
      console.log('userSummary computed')
      return {
        name: fullName.value,
        info: userInfo.value,
        stats: {
          hobbies: hobbyCount.value,
          likes: totalLikes.value
        }
      }
    })

    // 测试缓存失效的函数
    const testCacheInvalidation = () => {
      console.log('=== 测试开始 ===')

      // 第一次访问，会执行计算
      console.log('1. 首次访问:', fullName.value) // 执行计算
      console.log('2. 再次访问:', fullName.value) // 使用缓存

      // 修改直接依赖，缓存失效
      user.firstName = 'Jane'
      console.log('3. 修改firstName后:', fullName.value) // 重新计算
      console.log('4. 再次访问:', fullName.value) // 使用新缓存

      // 修改无关数据，缓存不失效
      user.profile.email = 'jane@example.com'
      console.log('5. 修改email后:', fullName.value) // 使用缓存

      // 条件依赖测试
      console.log('6. 首次访问userInfo:', userInfo.value) // 执行计算
      showAge.value = false
      console.log('7. showAge改为false:', userInfo.value) // 重新计算
      user.profile.age = 26
      console.log('8. 修改age:', userInfo.value) // 使用缓存（age不再被访问）

      // 深层依赖测试
      console.log('9. 首次访问userSettings:', userSettings.value)
      user.profile.settings.theme = 'light'
      console.log('10. 修改theme:', userSettings.value) // 重新计算

      // 数组依赖测试
      console.log('11. 首次访问hobbyCount:', hobbyCount.value)
      user.hobbies.push('swimming')
      console.log('12. 添加hobby:', hobbyCount.value) // 重新计算

      // 数组元素属性变化
      console.log('13. 首次访问totalLikes:', totalLikes.value)
      user.posts[0].likes = 20
      console.log('14. 修改likes:', totalLikes.value) // 重新计算

      // 动态依赖测试
      filter.value = 'age'
      console.log('15. filter=age:', dynamicValue.value) // 执行计算
      user.profile.age = 30
      console.log('16. 修改age:', dynamicValue.value) // 重新计算

      filter.value = 'posts'
      console.log('17. filter=posts:', dynamicValue.value) // 重新计算
      user.profile.age = 35 // 此时age不再是依赖
      console.log('18. 再次修改age:', dynamicValue.value) // 使用缓存
    }

    // 监听computed变化
    watch(fullName, (newVal, oldVal) => {
      console.log(`fullName changed: ${oldVal} -> ${newVal}`)
    })

    watch(userSummary, (newVal, oldVal) => {
      console.log('userSummary changed:', newVal)
    }, { deep: true })

    return {
      user,
      showAge,
      multiplier,
      filter,
      fullName,
      greeting,
      userInfo,
      userSettings,
      hobbyCount,
      totalLikes,
      dynamicValue,
      userSummary,
      testCacheInvalidation
    }
  }
}
```

**缓存失效的内部机制：**
```javascript
// 简化版computed实现原理
function computed(getter) {
  let value
  let dirty = true // 脏标记
  const deps = new Set() // 依赖集合

  const computedRef = {
    get value() {
      if (dirty) {
        // 清除旧依赖
        deps.forEach(dep => dep.removeEffect(effect))
        deps.clear()

        // 收集新依赖
        const prevActiveEffect = activeEffect
        activeEffect = effect

        try {
          value = getter()
        } finally {
          activeEffect = prevActiveEffect
        }

        dirty = false
      }
      return value
    }
  }

  const effect = () => {
    dirty = true // 标记为脏
    // 触发依赖此computed的其他effect
    triggerEffects(computedRef)
  }

  return computedRef
}

// 依赖收集示例
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }

    dep.add(activeEffect)
    activeEffect.deps.add(dep)
  }
}
```

**性能优化技巧：**
```javascript
// 1. 避免在computed中进行昂贵操作
const expensiveComputed = computed(() => {
  // ❌ 避免在computed中进行网络请求
  // return await fetchData()

  // ✅ 使用缓存的数据进行计算
  return cachedData.value.map(item => item.processed)
})

// 2. 合理使用shallowRef避免深层响应式
const largeData = shallowRef({
  items: new Array(10000).fill(0).map((_, i) => ({ id: i, value: i }))
})

const processedData = computed(() => {
  // 只有largeData的引用变化才会重新计算
  return largeData.value.items.filter(item => item.value > 100)
})

// 3. 使用computed缓存复杂计算
const filteredAndSortedItems = computed(() => {
  return items.value
    .filter(item => item.active)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 10)
})
```

### 记忆要点总结
- **触发条件**：任何被访问的响应式数据发生变化
- **缓存机制**：脏标记（dirty flag）+ 依赖追踪
- **性能优化**：只有依赖变化时才重新计算
- **条件依赖**：只有在当前执行路径中访问的数据才会建立依赖
- **深层依赖**：嵌套对象属性变化会触发重新计算
- **最佳实践**：避免在computed中进行副作用操作

---

**解释 `reactive` 与 `Proxy` 的实现优势与限制。**

vue3采用Proxy实现代理的底层逻辑，通过对数据的代理在数据读取或者修改时做时时监听，收集依赖。reactive包装一个对象实现响应式，深层递归对象的每个子属性实现响应式。

### 问题本质解读 这道题考察Vue 3响应式系统的底层实现原理，面试官想了解你是否理解Proxy相比Vue 2的Object.defineProperty的改进。

### 技术错误纠正
- 原答案过于简化，缺少具体的优势和限制说明
- 需要补充与Vue 2的对比和具体的使用场景
- 缺少性能优化策略和最佳实践

### 知识点系统梳理

**Proxy的优势：**
1. **完整的拦截能力**：可以拦截13种操作（get、set、has、deleteProperty等）
2. **动态属性支持**：可以拦截新增属性，无需预先定义
3. **数组操作优化**：直接支持数组索引和length属性的监听
4. **更好的性能**：避免了递归遍历所有属性
5. **原生支持**：浏览器原生实现，性能更好

**Proxy的限制：**
1. **浏览器兼容性**：IE不支持，无法polyfill
2. **嵌套对象处理**：需要递归代理嵌套对象
3. **内存占用**：每个响应式对象都需要创建Proxy
4. **调试困难**：代理对象在调试器中显示复杂

### 实战应用举例
```javascript
// Vue 3 reactive的简化实现
const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
const shallowReactiveMap = new WeakMap()

// 判断是否为对象
function isObject(val) {
  return val !== null && typeof val === 'object'
}

// 判断是否为数组
function isArray(val) {
  return Array.isArray(val)
}

// 响应式实现
function reactive(target) {
  // 基本类型直接返回
  if (!isObject(target)) {
    console.warn('reactive() can only be called on objects')
    return target
  }

  // 避免重复代理
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target)
  }

  // 已经是代理对象
  if (target.__v_isReactive) {
    return target
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // 特殊key处理
      if (key === '__v_isReactive') return true
      if (key === '__v_raw') return target

      const result = Reflect.get(target, key, receiver)

      // 依赖收集
      track(target, key)

      // 嵌套对象递归代理
      if (isObject(result)) {
        return reactive(result)
      }

      return result
    },

    set(target, key, value, receiver) {
      const oldValue = target[key]
      const hadKey = hasOwn(target, key)
      const result = Reflect.set(target, key, value, receiver)

      // 避免原型链上的设置触发更新
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          // 新增属性
          trigger(target, 'add', key, value)
        } else if (hasChanged(value, oldValue)) {
          // 修改属性
          trigger(target, 'set', key, value, oldValue)
        }
      }

      return result
    },

    has(target, key) {
      const result = Reflect.has(target, key)
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, key)
      }
      return result
    },

    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key)
      const oldValue = target[key]
      const result = Reflect.deleteProperty(target, key)

      if (result && hadKey) {
        trigger(target, 'delete', key, undefined, oldValue)
      }

      return result
    },

    ownKeys(target) {
      track(target, isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    }
  })

  reactiveMap.set(target, proxy)
  return proxy
}

// 浅层响应式实现
function shallowReactive(target) {
  if (!isObject(target)) {
    return target
  }

  if (shallowReactiveMap.has(target)) {
    return shallowReactiveMap.get(target)
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === '__v_isReactive') return true
      if (key === '__v_raw') return target

      const result = Reflect.get(target, key, receiver)
      track(target, key)

      // 浅层响应式不递归代理嵌套对象
      return result
    },

    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)

      if (hasChanged(value, oldValue)) {
        trigger(target, 'set', key, value, oldValue)
      }

      return result
    }
  })

  shallowReactiveMap.set(target, proxy)
  return proxy
}

// 只读代理实现
function readonly(target) {
  if (!isObject(target)) {
    return target
  }

  if (readonlyMap.has(target)) {
    return readonlyMap.get(target)
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === '__v_isReadonly') return true
      if (key === '__v_raw') return target

      const result = Reflect.get(target, key, receiver)

      // 只读对象也需要依赖收集
      track(target, key)

      // 递归只读
      if (isObject(result)) {
        return readonly(result)
      }

      return result
    },

    set() {
      console.warn('Set operation on readonly object is not allowed')
      return true
    },

    deleteProperty() {
      console.warn('Delete operation on readonly object is not allowed')
      return true
    }
  })

  readonlyMap.set(target, proxy)
  return proxy
}

// 使用示例
const state = reactive({
  count: 0,
  user: {
    name: 'John',
    hobbies: ['reading']
  },
  items: [1, 2, 3]
})

// 1. 动态属性添加 - Vue 2中需要Vue.set
state.newProp = 'new value' // ✅ 自动响应式
console.log('Added new property:', state.newProp)

// 2. 数组操作 - Vue 2中需要特殊处理
state.user.hobbies.push('coding') // ✅ 自动响应式
state.user.hobbies[0] = 'writing' // ✅ 自动响应式
state.items[0] = 10 // ✅ 自动响应式

// 3. 属性删除
delete state.newProp // ✅ 自动响应式

// 4. 嵌套对象
state.user.profile = { age: 25 } // ✅ 自动响应式
state.user.profile.age = 26 // ✅ 自动响应式

// 5. 数组方法
state.items.push(4) // ✅ 自动响应式
state.items.splice(1, 1) // ✅ 自动响应式
```

**与Vue 2的对比：**
```javascript
// Vue 2 - Object.defineProperty的限制
const data = {
  count: 0,
  items: ['a', 'b']
}

// ❌ 新增属性不响应
data.newProp = 'value' // 需要Vue.set(data, 'newProp', 'value')

// ❌ 数组索引不响应
data.items[0] = 'new value' // 需要Vue.set(data.items, 0, 'new value')

// ❌ 数组长度不响应
data.items.length = 0 // 需要特殊处理

// ❌ 属性删除不响应
delete data.count // 需要Vue.delete(data, 'count')

// Vue 3 - Proxy的改进
const state = reactive({
  count: 0,
  items: ['a', 'b']
})

// ✅ 全部自动响应式
state.newProp = 'value'
state.items[0] = 'new value'
state.items.length = 0
delete state.count
```

**性能优化策略：**
```javascript
// 1. 使用shallowReactive避免深层代理
const shallowState = shallowReactive({
  count: 0,
  largeObject: { /* 大量数据 */ }
})

// 2. 使用markRaw标记不需要响应式的对象
const state = reactive({
  data: markRaw({
    thirdPartyLib: new SomeLibrary(),
    largeDataSet: new Array(10000).fill(0)
  })
})

// 3. 使用readonly创建只读代理
const readonlyState = readonly(state)

// 4. 使用toRaw获取原始对象
const rawState = toRaw(state)

// 5. 条件性响应式
const conditionalReactive = (data, shouldBeReactive) => {
  return shouldBeReactive ? reactive(data) : markRaw(data)
}
```

**调试技巧：**
```javascript
// 1. 检查对象是否为响应式
function isReactive(obj) {
  return !!(obj && obj.__v_isReactive)
}

// 2. 检查对象是否为只读
function isReadonly(obj) {
  return !!(obj && obj.__v_isReadonly)
}

// 3. 获取原始对象
function toRaw(obj) {
  return obj && obj.__v_raw || obj
}

// 4. 调试响应式对象
const debugReactive = (obj, label = 'reactive') => {
  console.log(`${label}:`, {
    isReactive: isReactive(obj),
    isReadonly: isReadonly(obj),
    raw: toRaw(obj)
  })
}

// 使用示例
const state = reactive({ count: 0 })
debugReactive(state, 'state')
```

### 记忆要点总结
- **优势**：完整拦截、动态属性、数组支持、更好性能
- **限制**：IE兼容性、嵌套处理、内存占用、调试复杂
- **改进**：相比Vue 2解决了动态属性和数组监听问题
- **优化**：shallowReactive、markRaw、readonly等API
- **最佳实践**：根据需求选择合适的响应式API

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

可以继续追问：`computed` 的缓存失效有哪些触发条件？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
