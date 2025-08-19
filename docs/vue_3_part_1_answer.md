**什么是 `ref`，与 `reactive` 的区别？**

Ref是vue中响应式声明的一个函数，它接收一个原始值作为参数，返回一个带有。value的响应式值。这个值在计算时需要使用。value，在模板中可以自动解包。

reactive也是响应式声明的函数。它接收的是一个对象。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3响应式系统的核心概念，面试官想了解你是否理解两种不同的响应式API的适用场景和内部机制。

**技术错误纠正：**
1. 原答案中"带有。value"应为"带有.value"
2. 缺少重要的类型限制说明和使用场景对比

**知识点系统梳理：**

**ref特点：**
- 用于包装基本类型值（string、number、boolean等）
- 返回RefImpl对象，通过.value访问真实值
- 在模板中自动解包，无需.value
- 可以包装对象，但会调用reactive进行深层响应式转换

**reactive特点：**
- 只能用于对象类型（Object、Array、Map、Set等）
- 返回Proxy代理对象，直接访问属性
- 不能解构，解构后失去响应性
- 深层响应式，嵌套对象也会被转换

**实战应用举例：**
```javascript
// ref - 适用于基本类型和单一值
const count = ref(0)
const message = ref('Hello')
const user = ref({ name: 'John', age: 25 }) // 内部会调用reactive

// reactive - 适用于复杂对象
const state = reactive({
  count: 0,
  user: {
    name: 'John',
    profile: { email: 'john@example.com' }
  },
  todos: []
})

// 模板中使用
// {{ count }} - 自动解包，不需要count.value
// {{ state.user.name }} - 直接访问属性
```

**记忆要点总结：**
- ref：基本类型 + .value + 模板自动解包
- reactive：对象类型 + 直接访问 + 不可解构
- 选择原则：基本类型用ref，复杂对象用reactive

---

**如何创建一个计算属性（computed）？它与 `watch` 的区别是什么？**

computed 是vue中创建计算属性的函数，它自动返回响应式计算的结果。包含get和set两个内置方法可以定义。set在修改这计算值时使用，get在获取计算值时使用。

watch时vue中的监听器，他监听一个响应式值的改变，而做出相应的改变。可以在第一次定义时监听，立即；也可以是监听响应式值的内部结构的变化，深度；也可以在实现延迟反应、提前反应。可以接受监听值更新时新旧两个值。

computed 只是根据多个响应式值变化，做出对应变化后的计算结果。

watch可以监听任意单个或者多个响应式值的变化，而做出响应的处理。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3响应式系统中两个重要API的使用场景和内部机制差异，面试官想了解你是否能正确选择合适的API。

**技术错误纠正：**
1. 原答案语法有误："watch时vue中"应为"watch是vue中"
2. 缺少具体的创建语法和代码示例
3. 对两者的核心区别描述不够准确

**知识点系统梳理：**

**computed特点：**
- 基于依赖的缓存计算，只有依赖变化时才重新计算
- 返回值是响应式的，可以被其他computed或watch依赖
- 默认只读，可通过get/set定义可写计算属性
- 同步执行，不能处理异步操作

**watch特点：**
- 监听响应式数据变化，执行副作用操作
- 可以处理异步操作
- 提供新值和旧值参数
- 支持immediate、deep、flush等选项

**实战应用举例：**
```javascript
// computed - 计算属性
const firstName = ref('John')
const lastName = ref('Doe')

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 可写计算属性
const fullNameWritable = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

// watch - 监听器
const count = ref(0)

// 监听单个值
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})

// 监听多个值
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  // 处理姓名变化的副作用
  updateUserProfile(newFirst, newLast)
})

// 监听对象（需要deep选项）
const user = reactive({ name: 'John', age: 25 })
watch(user, (newUser, oldUser) => {
  // 深度监听对象变化
}, { deep: true })
```

**使用场景对比：**
- **computed**: 数据转换、格式化、过滤、计算衍生值
- **watch**: API调用、DOM操作、数据持久化、复杂业务逻辑

**记忆要点总结：**
- computed：计算 + 缓存 + 同步 + 返回值
- watch：监听 + 副作用 + 异步 + 无返回值
- 选择原则：需要计算结果用computed，需要执行操作用watch

---

**`setup()` 的执行时机是什么？能访问 `this` 吗？**

setup() 是vue3选项式api结构中的内容，可以接受props和上下文对象。在页面创建之初执行。不能访问this，因为实例还没有加载

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3组合式API的核心概念和生命周期理解，面试官想了解你是否理解setup的执行时机和限制。

**技术错误纠正：**
1. setup()不仅用于选项式API，也是组合式API的核心
2. 执行时机描述不够准确，应该是在组件实例创建之前

**知识点系统梳理：**

**setup()执行时机：**
- 在组件实例创建之前执行
- 在props解析之后，但在组件实例创建之前
- 比beforeCreate和created更早执行
- 只执行一次

**setup()参数：**
- 第一个参数：props（响应式的）
- 第二个参数：context对象（包含attrs、slots、emit、expose）

**为什么不能访问this：**
- setup执行时组件实例还未创建
- this指向undefined（严格模式下）
- 这是设计上的考虑，鼓励使用组合式API

**实战应用举例：**
```javascript
// 选项式API中的setup
export default {
  props: ['title'],
  setup(props, context) {
    console.log(props.title) // 可以访问props
    console.log(context.attrs) // 非prop属性
    console.log(context.slots) // 插槽
    console.log(context.emit) // 触发事件
    console.log(context.expose) // 暴露公共属性

    // console.log(this) // undefined，不能访问this

    const count = ref(0)

    return {
      count
    }
  }
}
```

**记忆要点总结：**
- 执行时机：组件实例创建之前
- 参数：props + context
- 限制：不能访问this
- 目的：提供组合式API的入口点

---

**如何在 `script setup` 中定义 props 和 emits？**

可以使用 defineProps 和 defineEmits 中以对象和数组的形式来定义

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3的`<script setup>`语法糖的使用，面试官想了解你是否掌握现代Vue开发的最佳实践。

**技术错误纠正：**
1. 原答案过于简略，缺少具体语法示例
2. 没有说明TypeScript支持和验证规则

**知识点系统梳理：**

**defineProps用法：**
- 数组形式：简单声明
- 对象形式：带类型和默认值
- TypeScript形式：类型推导

**defineEmits用法：**
- 数组形式：简单声明
- 对象形式：带验证
- TypeScript形式：类型约束

**实战应用举例：**
```vue
<script setup>
// 1. 数组形式 - 简单声明
const props = defineProps(['title', 'content'])
const emit = defineEmits(['update', 'delete'])

// 2. 对象形式 - 带验证和默认值
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits({
  update: (value) => {
    // 验证逻辑
    return typeof value === 'string'
  },
  delete: null // 无验证
})

// 3. TypeScript形式
interface Props {
  title: string
  count?: number
  user?: { name: string; age: number }
}

interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用
console.log(props.title)
emit('update', 'new value')
</script>
```

**记忆要点总结：**
- defineProps：声明接收的属性
- defineEmits：声明可触发的事件
- 支持数组、对象、TypeScript三种形式
- 编译时宏，无需导入

---

**`v-if` 与 `v-show` 的区别？**

v-if用于逻辑判断，逻辑为false的组件将不展示。dom不渲染。变换为true时将重新渲染dom

v-show用于组件的展示和隐藏。隐藏时视觉上看不到，但是dom结构依然存在。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue模板指令的性能差异和使用场景，面试官想了解你是否能根据实际需求选择合适的显示/隐藏方式。

**知识点系统梳理：**

**v-if特点：**
- 条件性渲染，false时完全不渲染DOM
- 切换时会销毁和重建元素及其子组件
- 有更高的切换开销
- 支持v-else-if和v-else
- 惰性的，初始条件为false时不会渲染

**v-show特点：**
- 基于CSS的display属性切换
- 元素始终被渲染并保留在DOM中
- 有更高的初始渲染开销
- 不支持template元素
- 不支持v-else

**实战应用举例：**
```vue
<template>
  <!-- v-if - 条件渲染 -->
  <div v-if="userRole === 'admin'">
    <AdminPanel /> <!-- 只有管理员才渲染 -->
  </div>
  <div v-else-if="userRole === 'user'">
    <UserPanel />
  </div>
  <div v-else>
    <GuestPanel />
  </div>

  <!-- v-show - 显示/隐藏 -->
  <div v-show="isModalVisible" class="modal">
    <ModalContent /> <!-- 始终渲染，通过CSS控制显示 -->
  </div>

  <!-- 性能对比场景 -->
  <!-- 频繁切换 - 使用v-show -->
  <div v-show="activeTab === 'profile'">个人资料</div>

  <!-- 条件很少改变 - 使用v-if -->
  <div v-if="user.isPremium">高级功能</div>
</template>

<style>
/* v-show实际上是这样工作的 */
.v-show-hidden {
  display: none !important;
}
</style>
```

**使用场景选择：**
- **v-if**: 条件很少改变、初始条件为false、需要条件性加载组件
- **v-show**: 频繁切换显示状态、元素较简单、需要保持组件状态

**记忆要点总结：**
- v-if：真正的条件渲染，DOM增删
- v-show：CSS显示控制，DOM常驻
- 选择原则：频繁切换用v-show，条件渲染用v-if

---

**`v-for` 上为什么需要 `key`？如何选择 key？**

循环相同结构的组件，需要对每个组件标识身份，以提高dom操作的可靠性。key要避免是一个对象类型，会被解析成字符串结构。导致每一个key都相同。key可以是遍历中的顺序编号，或者遍历内容的id。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue的虚拟DOM diff算法和列表渲染优化，面试官想了解你是否理解key的作用机制和性能影响。

**技术错误纠正：**
1. 不建议使用数组索引作为key，特别是在列表会发生增删改的情况下
2. 对象类型确实会被转换为字符串，但这不是主要问题

**知识点系统梳理：**

**key的作用机制：**
- Vue使用key来识别VNode，进行高效的diff算法
- 相同key的元素会被复用，不同key的元素会被重新创建
- 帮助Vue跟踪每个节点的身份，维护组件状态

**不使用key的问题：**
- Vue会使用就地更新策略，可能导致状态混乱
- 列表项的内部状态可能错乱
- 性能可能受到影响

**实战应用举例：**
```vue
<template>
  <!-- ❌ 错误示例 -->
  <div v-for="(item, index) in list" :key="index">
    <input v-model="item.name" />
    <button @click="deleteItem(index)">删除</button>
  </div>

  <!-- ❌ 更糟糕的示例 -->
  <div v-for="item in list">
    {{ item.name }}
  </div>

  <!-- ✅ 正确示例 -->
  <div v-for="item in list" :key="item.id">
    <input v-model="item.name" />
    <button @click="deleteItem(item.id)">删除</button>
  </div>

  <!-- ✅ 复杂对象的key -->
  <UserCard
    v-for="user in users"
    :key="`user-${user.id}-${user.version}`"
    :user="user"
  />

  <!-- ✅ 字符串列表的key -->
  <li v-for="(tag, index) in tags" :key="tag">
    {{ tag }}
  </li>
</template>

<script setup>
// 演示key的重要性
const list = ref([
  { id: 1, name: 'Alice', editing: false },
  { id: 2, name: 'Bob', editing: false },
  { id: 3, name: 'Charlie', editing: false }
])

// 删除中间项时，使用index作为key会导致状态错乱
const deleteItem = (id) => {
  const index = list.value.findIndex(item => item.id === id)
  list.value.splice(index, 1)
}
</script>
```

**key选择原则：**
1. **唯一性**: 在同一层级中必须唯一
2. **稳定性**: 同一个数据项的key不应该改变
3. **可预测性**: 相同的数据应该产生相同的key

**常见key选择策略：**
- **数据库ID**: `item.id` (最佳选择)
- **业务唯一标识**: `item.code`、`item.uuid`
- **组合key**: `${item.type}-${item.id}`
- **内容hash**: 适用于纯展示的静态内容

**记忆要点总结：**
- key的作用：帮助Vue识别和复用元素
- 选择原则：唯一、稳定、可预测
- 避免使用：数组索引（动态列表）、随机数
- 最佳实践：使用数据的唯一标识符

---

**如何在父组件向子组件传入回调事件？（基本 props & emit）**

1. 通过 v-on （@）
2. provide inject

## 深度分析与补充

**问题本质解读：** 这道题考察Vue组件通信的基本方式，面试官想了解你是否掌握父子组件事件传递的标准模式。

**技术错误纠正：**
1. 原答案过于简略，缺少具体实现方式
2. provide/inject不是传递回调事件的主要方式，主要用于跨层级数据传递

**知识点系统梳理：**

**标准的父子组件事件传递：**
1. 父组件通过props传递回调函数
2. 子组件通过emit触发自定义事件
3. 父组件监听子组件的自定义事件

**实战应用举例：**
```vue
<!-- 父组件 -->
<template>
  <div>
    <!-- 方式1: 直接传递回调函数 -->
    <ChildComponent :on-click="handleChildClick" />

    <!-- 方式2: 监听自定义事件 -->
    <ChildComponent @custom-event="handleCustomEvent" />

    <!-- 方式3: v-model双向绑定 -->
    <ChildComponent v-model:value="inputValue" />
  </div>
</template>

<script setup>
const inputValue = ref('')

// 处理子组件回调
const handleChildClick = (data) => {
  console.log('子组件点击:', data)
}

// 处理自定义事件
const handleCustomEvent = (payload) => {
  console.log('收到自定义事件:', payload)
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <!-- 调用props传递的回调 -->
    <button @click="onClick('button clicked')">
      点击调用回调
    </button>

    <!-- 触发自定义事件 -->
    <button @click="emitCustomEvent">
      触发自定义事件
    </button>

    <!-- v-model实现 -->
    <input
      :value="value"
      @input="$emit('update:value', $event.target.value)"
    />
  </div>
</template>

<script setup>
// 定义props
const props = defineProps({
  onClick: Function,
  value: String
})

// 定义emits
const emit = defineEmits(['custom-event', 'update:value'])

// 触发自定义事件
const emitCustomEvent = () => {
  emit('custom-event', { message: 'Hello from child' })
}
</script>
```

**记忆要点总结：**
- 主要方式：props传递回调 + emit触发事件
- 监听方式：@event-name 或 v-on:event-name
- 双向绑定：v-model + update:propName事件

---

**什么是 `provide` / `inject`？有什么使用场景？**

provide 和 inject 是vue中突破祖孙组件数据逐层传递的方式，可以在祖父组件中通过provide传递任意类型的值，在任意子孙组件中通过inject接收。

场景：多级嵌套的部门选择组件可以使用以上方式。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue的依赖注入系统，面试官想了解你是否理解跨层级组件通信的解决方案和适用场景。

**知识点系统梳理：**

**provide/inject特点：**
- 解决prop drilling问题（逐层传递props）
- 祖先组件提供数据，后代组件注入使用
- 支持响应式数据传递
- 不限制组件层级深度

**响应式provide/inject：**
- provide响应式数据时，inject的组件会自动更新
- 可以provide ref、reactive、computed等响应式数据

**实战应用举例：**
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

**常见使用场景：**
1. **主题系统**: 全局主题配置和切换
2. **用户认证**: 用户信息和权限管理
3. **国际化**: 语言包和切换功能
4. **配置管理**: 全局配置信息
5. **插件系统**: 插件注册和使用
6. **表单验证**: 表单上下文和验证规则

**最佳实践：**
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

**记忆要点总结：**
- 作用：跨层级组件通信，避免prop drilling
- 特点：祖先provide，后代inject
- 响应式：支持响应式数据自动更新
- 场景：主题、认证、配置、国际化等全局状态

---

**如何创建一个自定义指令（directive）？举例 `v-focus`。**



```javascript
app.dirrective('focus',{
  mounted(el){
    el.foucs()
  }
})
```

## 深度分析与补充

**问题本质解读：** 这道题考察Vue自定义指令的创建和使用，面试官想了解你是否能扩展Vue的模板功能。

**技术错误纠正：**
1. `app.dirrective` 应为 `app.directive`
2. `el.foucs()` 应为 `el.focus()`
3. 缺少完整的指令生命周期说明

**知识点系统梳理：**

**指令生命周期钩子：**
- `created`: 在绑定元素的attribute或事件监听器被应用之前调用
- `beforeMount`: 当指令第一次绑定到元素并且在挂载父组件之前调用
- `mounted`: 在绑定元素的父组件被挂载后调用
- `beforeUpdate`: 在更新包含组件的VNode之前调用
- `updated`: 在包含组件的VNode及其子组件的VNode更新后调用
- `beforeUnmount`: 在卸载绑定元素的父组件之前调用
- `unmounted`: 当指令与元素解除绑定且父组件已卸载时调用

**实战应用举例：**
```javascript
// 1. 全局注册自定义指令
const app = createApp({})

// v-focus指令 - 自动聚焦
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// v-color指令 - 动态颜色
app.directive('color', {
  mounted(el, binding) {
    el.style.color = binding.value
  },
  updated(el, binding) {
    el.style.color = binding.value
  }
})

// v-permission指令 - 权限控制
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding
    const userPermissions = getCurrentUser().permissions

    if (!userPermissions.includes(value)) {
      el.style.display = 'none'
      // 或者 el.remove()
    }
  }
})

// v-lazy指令 - 图片懒加载
app.directive('lazy', {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
  }
})

// v-debounce指令 - 防抖
app.directive('debounce', {
  mounted(el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
      }, binding.arg || 300)
    })
  }
})

// 2. 局部注册（组件内）
export default {
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  }
}

// 3. 组合式API中使用
<script setup>
// 必须以v开头
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <!-- 使用自定义指令 -->
  <input v-focus />
  <div v-color="'red'">红色文字</div>
  <button v-permission="'admin'">管理员按钮</button>
  <img v-lazy="imageUrl" />
  <button v-debounce:500="handleClick">防抖按钮</button>
</template>
```

**指令参数和修饰符：**
```javascript
// 复杂指令示例
app.directive('scroll', {
  mounted(el, binding) {
    const { value, arg, modifiers } = binding

    // v-scroll:y.passive="handleScroll"
    // arg: 'y'
    // modifiers: { passive: true }
    // value: handleScroll函数

    const options = {
      passive: modifiers.passive
    }

    const eventName = arg === 'y' ? 'scroll' : 'wheel'
    el.addEventListener(eventName, value, options)
  },

  beforeUnmount(el, binding) {
    const { value, arg } = binding
    const eventName = arg === 'y' ? 'scroll' : 'wheel'
    el.removeEventListener(eventName, value)
  }
})
```

**常见自定义指令场景：**
1. **DOM操作**: 聚焦、滚动、拖拽
2. **权限控制**: 按钮权限、内容显示
3. **性能优化**: 懒加载、防抖节流
4. **用户体验**: 点击外部关闭、长按事件
5. **数据处理**: 格式化显示、输入限制

**记忆要点总结：**
- 注册方式：全局app.directive()、局部directives选项
- 生命周期：mounted、updated、unmounted等
- 参数获取：binding.value、binding.arg、binding.modifiers
- 使用场景：DOM操作、权限控制、性能优化

---

**`nextTick` 有什么用途？什么时候使用？**

nextTick() 是DOM更新完成后的回调方法。用于修改数据后计算新的DOM或者操作DOM

## 深度分析与补充

**问题本质解读：** 这道题考察Vue的异步更新机制和DOM操作时机，面试官想了解你是否理解Vue的更新策略。

**知识点系统梳理：**

**nextTick的作用机制：**
- Vue的DOM更新是异步的，数据变化后不会立即更新DOM
- nextTick将回调推迟到下一个DOM更新周期之后执行
- 确保在回调中可以访问到更新后的DOM

**实战应用举例：**
```javascript
import { nextTick, ref } from 'vue'

export default {
  setup() {
    const message = ref('Hello')
    const inputRef = ref(null)

    // 场景1: 获取更新后的DOM尺寸
    const updateMessage = async () => {
      message.value = 'Hello World!'

      // 此时DOM还未更新
      console.log(inputRef.value.scrollHeight) // 旧的高度

      // 等待DOM更新
      await nextTick()
      console.log(inputRef.value.scrollHeight) // 新的高度
    }

    // 场景2: 聚焦新创建的元素
    const showList = ref(false)
    const focusInput = async () => {
      showList.value = true

      // 直接聚焦会失败，因为元素还未渲染
      // inputRef.value.focus() // 错误！

      await nextTick()
      inputRef.value.focus() // 正确！
    }

    // 场景3: 获取动态内容的尺寸
    const items = ref([])
    const containerRef = ref(null)

    const addItems = async () => {
      items.value = [1, 2, 3, 4, 5]

      await nextTick()
      // 现在可以获取容器的实际高度
      const height = containerRef.value.offsetHeight
      console.log('容器高度:', height)
    }

    return {
      message,
      inputRef,
      showList,
      items,
      containerRef,
      updateMessage,
      focusInput,
      addItems
    }
  }
}

// 在组合式API中使用
<script setup>
const count = ref(0)
const divRef = ref()

const increment = async () => {
  count.value++

  // 方式1: 使用await
  await nextTick()
  console.log('DOM已更新:', divRef.value.textContent)

  // 方式2: 使用回调
  nextTick(() => {
    console.log('DOM已更新:', divRef.value.textContent)
  })
}
</script>
```

**常见使用场景：**
1. **DOM操作**: 获取更新后的元素尺寸、位置
2. **聚焦元素**: 聚焦动态创建的输入框
3. **滚动操作**: 滚动到新添加的内容
4. **第三方库集成**: 确保DOM更新后再初始化插件
5. **测试**: 等待DOM更新后进行断言

**记忆要点总结：**
- 作用：等待DOM更新完成后执行回调
- 原因：Vue的DOM更新是异步的
- 用法：await nextTick() 或 nextTick(callback)
- 场景：DOM操作、元素聚焦、尺寸计算

---

**`teleport` 的用途是什么？如何使用？**

teleport用于将内层组件指向外部组件渲染。通常在内层组件布局结构较小，需要展示更大的组件空间时使用。

可以通过to指向到外层任意节点上

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3的Teleport组件，面试官想了解你是否掌握跨DOM层级渲染的解决方案。

**知识点系统梳理：**

**Teleport的作用：**
- 将组件的HTML渲染到DOM树的其他位置
- 保持组件的逻辑关系不变
- 解决CSS层级和定位问题

**实战应用举例：**
```vue
<!-- 模态框组件 -->
<template>
  <div class="modal-container">
    <button @click="showModal = true">打开模态框</button>

    <!-- 将模态框渲染到body下 -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <h2>模态框标题</h2>
          <p>这个模态框被渲染到了body下，而不是当前组件内</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const showModal = ref(false)
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
}
</style>

<!-- 通知组件 -->
<template>
  <div>
    <button @click="showNotification">显示通知</button>

    <!-- 渲染到指定容器 -->
    <Teleport to="#notification-container">
      <div v-if="visible" class="notification">
        {{ message }}
        <button @click="visible = false">×</button>
      </div>
    </Teleport>
  </div>
</template>

<!-- 条件渲染 -->
<template>
  <Teleport :to="isMobile ? '#mobile-menu' : '#desktop-menu'">
    <MenuComponent />
  </Teleport>
</template>

<!-- 禁用Teleport -->
<template>
  <Teleport to="body" :disabled="!shouldTeleport">
    <div class="content">
      <!-- 当disabled为true时，内容会渲染在原位置 -->
    </div>
  </Teleport>
</template>
```

**多个Teleport到同一目标：**
```vue
<!-- 组件A -->
<Teleport to="#modals">
  <div class="modal">Modal A</div>
</Teleport>

<!-- 组件B -->
<Teleport to="#modals">
  <div class="modal">Modal B</div>
</Teleport>

<!-- 结果：两个模态框都会渲染到#modals容器中 -->
<div id="modals">
  <div class="modal">Modal A</div>
  <div class="modal">Modal B</div>
</div>
```

**常见使用场景：**
1. **模态框/弹窗**: 避免z-index层级问题
2. **通知/提示**: 渲染到页面顶层
3. **下拉菜单**: 避免父容器overflow限制
4. **全屏组件**: 视频播放器、图片预览
5. **工具提示**: Tooltip组件
6. **侧边栏**: 移动端抽屉菜单

**注意事项：**
```vue
<script setup>
// 1. 确保目标元素存在
const targetExists = ref(false)

onMounted(() => {
  targetExists.value = !!document.querySelector('#target')
})

// 2. 处理服务端渲染
const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <!-- 条件渲染避免错误 -->
  <Teleport v-if="targetExists" to="#target">
    <div>内容</div>
  </Teleport>

  <!-- SSR兼容 -->
  <Teleport v-if="isClient" to="body">
    <div>客户端内容</div>
  </Teleport>
</template>
```

**记忆要点总结：**
- 作用：将组件渲染到DOM树的其他位置
- 语法：`<Teleport to="selector">content</Teleport>`
- 特点：保持组件逻辑关系，改变渲染位置
- 场景：模态框、通知、下拉菜单、全屏组件

---

**`Suspense` 组件的基本作用是什么？**

suspense组件主要是为其内部子组件提供等待显示，当内容子组件内容没有加载完成时为pending状态，显示loading状态。当加载完成后为resolve，显示子组件内容。当子组件加载错误时，状态为fall，显示fallback 错误提示内容。主要作用为提升交互体验。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3的异步组件处理机制，面试官想了解你是否掌握现代前端应用的异步加载和错误处理。

**技术错误纠正：**
1. 状态名称错误："fall"应为"rejected"
2. 缺少具体的使用语法和错误处理机制

**知识点系统梳理：**

**Suspense的三种状态：**
- **pending**: 等待异步组件加载
- **resolved**: 异步组件加载成功
- **rejected**: 异步组件加载失败

**实战应用举例：**
```vue
<!-- 基本用法 -->
<template>
  <Suspense>
    <!-- 异步组件 -->
    <template #default>
      <AsyncComponent />
    </template>

    <!-- 加载状态 -->
    <template #fallback>
      <div class="loading">
        <div class="spinner"></div>
        <p>正在加载...</p>
      </div>
    </template>
  </Suspense>
</template>

<!-- 复杂异步组件 -->
<script setup>
// 异步组件定义
const AsyncUserProfile = defineAsyncComponent({
  loader: () => import('./UserProfile.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorMessage,
  delay: 200, // 延迟显示loading
  timeout: 3000 // 超时时间
})

// 异步数据获取组件
const AsyncDataComponent = {
  async setup() {
    // 模拟异步数据获取
    const data = await fetch('/api/user').then(r => r.json())
    const user = ref(data)

    return { user }
  },
  template: `<div>{{ user.name }}</div>`
}
</script>

<!-- 嵌套Suspense -->
<template>
  <Suspense>
    <template #default>
      <UserDashboard>
        <Suspense>
          <template #default>
            <UserPosts />
          </template>
          <template #fallback>
            <PostsSkeleton />
          </template>
        </Suspense>
      </UserDashboard>
    </template>
    <template #fallback>
      <DashboardSkeleton />
    </template>
  </Suspense>
</template>

<!-- 错误处理 -->
<script setup>
import { onErrorCaptured } from 'vue'

// 捕获异步组件错误
onErrorCaptured((error, instance, info) => {
  console.error('异步组件错误:', error)
  console.log('错误信息:', info)

  // 返回false阻止错误继续传播
  return false
})
</script>
```

**与ErrorBoundary结合：**
```vue
<template>
  <ErrorBoundary>
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <LoadingComponent />
      </template>
    </Suspense>

    <template #error="{ error, retry }">
      <div class="error-state">
        <p>加载失败: {{ error.message }}</p>
        <button @click="retry">重试</button>
      </div>
    </template>
  </ErrorBoundary>
</template>
```

**记忆要点总结：**
- 作用：处理异步组件的加载状态
- 插槽：#default（内容）、#fallback（加载中）
- 状态：pending → resolved/rejected
- 场景：异步组件、数据获取、代码分割

---

**模板中如何使用 `v-model` 在子组件进行双向绑定？**

在输入型组件：input，textarea、radio、select等组件中通过v-model将值绑定，就实现了双向绑定。

本质上是简化了props和emits的传递和事件响应。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue的双向绑定机制和自定义组件的v-model实现，面试官想了解你是否掌握组件通信的高级用法。

**技术错误纠正：**
1. 原答案只提到了原生表单元素，缺少自定义组件的v-model实现
2. 没有说明Vue 3中v-model的新特性

**实战应用举例：**
```vue
<!-- 自定义输入组件 -->
<template>
  <div class="custom-input">
    <label>{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
// Vue 3中v-model默认使用modelValue和update:modelValue
defineProps({
  modelValue: String,
  label: String,
  placeholder: String
})

defineEmits(['update:modelValue'])
</script>

<!-- 使用自定义组件 -->
<template>
  <CustomInput
    v-model="username"
    label="用户名"
    placeholder="请输入用户名"
  />
</template>

<!-- 多个v-model -->
<template>
  <UserForm
    v-model:name="userName"
    v-model:email="userEmail"
    v-model:age="userAge"
  />
</template>

<script setup>
// UserForm组件
defineProps({
  name: String,
  email: String,
  age: Number
})

defineEmits([
  'update:name',
  'update:email',
  'update:age'
])
</script>

<!-- 自定义修饰符 -->
<template>
  <CustomInput v-model.capitalize="message" />
</template>

<script setup>
// 处理自定义修饰符
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<!-- 复杂组件的v-model -->
<template>
  <div class="date-picker">
    <input
      type="date"
      :value="formatDate(modelValue)"
      @change="handleDateChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [Date, String, null]
})

const emit = defineEmits(['update:modelValue'])

const formatDate = (date) => {
  if (!date) return ''
  return date instanceof Date ?
    date.toISOString().split('T')[0] :
    date
}

const handleDateChange = (event) => {
  const dateString = event.target.value
  const date = dateString ? new Date(dateString) : null
  emit('update:modelValue', date)
}
</script>
```

**记忆要点总结：**
- Vue 3默认：modelValue + update:modelValue
- 多个v-model：v-model:propName
- 自定义修饰符：modelModifiers
- 本质：props + emit的语法糖

---

**如何在组件中访问模板引用（template refs）？**

可以通过 useRefs定一个refs，然后通过在组件中ref绑定该值，就可以获取到该组件的实例，就可以通过ref来调用该组件的方法。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3中模板引用的使用方法，面试官想了解你是否掌握直接操作DOM和组件实例的技巧。

**技术错误纠正：**
1. 不是"useRefs"，应该是"ref"
2. 缺少具体的语法和使用场景

**实战应用举例：**
```vue
<template>
  <div>
    <!-- 元素引用 -->
    <input ref="inputRef" type="text" />
    <button @click="focusInput">聚焦输入框</button>

    <!-- 组件引用 -->
    <ChildComponent ref="childRef" />
    <button @click="callChildMethod">调用子组件方法</button>

    <!-- 循环中的引用 -->
    <div
      v-for="(item, index) in items"
      :key="item.id"
      :ref="el => setItemRef(el, index)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 元素引用
const inputRef = ref(null)

const focusInput = () => {
  inputRef.value.focus()
}

// 组件引用
const childRef = ref(null)

const callChildMethod = () => {
  childRef.value.someMethod()
}

// 循环引用
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])

const itemRefs = ref([])

const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value[index] = el
  }
}

// 生命周期中访问
onMounted(() => {
  console.log('输入框元素:', inputRef.value)
  console.log('子组件实例:', childRef.value)
})

// 动态引用
const dynamicRef = ref(null)
const showElement = ref(false)

const toggleElement = async () => {
  showElement.value = !showElement.value

  if (showElement.value) {
    await nextTick()
    console.log('动态元素:', dynamicRef.value)
  }
}
</script>

<!-- 子组件需要暴露方法 -->
<script setup>
// ChildComponent.vue
const count = ref(0)

const someMethod = () => {
  console.log('子组件方法被调用')
  count.value++
}

// 暴露给父组件
defineExpose({
  someMethod,
  count: readonly(count)
})
</script>

<!-- 函数式组件中的引用 -->
<script setup>
// 使用函数获取引用
const getRef = (name) => {
  const refMap = new Map()

  return (el) => {
    if (el) {
      refMap.set(name, el)
    } else {
      refMap.delete(name)
    }
  }
}

const buttonRef = getRef('button')
</script>

<template>
  <button :ref="buttonRef">按钮</button>
</template>
```

**TypeScript中的模板引用：**
```vue
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

// 元素引用类型
const inputRef = ref<HTMLInputElement | null>(null)

// 组件引用类型
interface ChildComponentInstance {
  someMethod: () => void
  count: number
}

const childRef = ref<ComponentPublicInstance<ChildComponentInstance> | null>(null)

// 或者直接使用组件类型
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)
</script>
```

**记忆要点总结：**
- 创建：const refName = ref(null)
- 绑定：ref="refName"
- 访问：refName.value
- 组件：需要defineExpose暴露方法

---

**`watchEffect` 与 `watch` 的区别？**

都是vue中作为监听响应式值变化的函数。

watchEffect：自动收集依赖并立即执行副作用
watch：显示监听源，并提供新旧值，用于更精准的副作用控制

---

**什么是 `shallowRef` 和 `shallowReactive`？**

shalowRef 是定义浅层响应式原始值

shallowReactive 是定义浅层响应式对象

---

**如何将响应式对象解构而不丢失响应性？**

可以在解构时使用 toRef将解构后的内容包装 不会丢失响应式

---

**`isRef`、`unref`、`toRaw` 分别是什么？**

isRef 判断是否是响应式值

unref 返回响应式值或者原始值

toRaw 返回响应式包装对象的原始对象

---

**如何防止子组件暴露过多内部实现？（组件封装）**

可以使用Expose()在setup显示暴露方法和属性

---

**什么是 `defineAsyncComponent`？什么时候使用？**

动态加载异步组件，用于性能优化。当某个组件暂时不在渲染内容中时，先不需要将可能用到的所有组件全部加载，而是在当需要显示的时候按需加载。

---

**如何在模板中绑定 class 和 style（双向/多值）？**

可以使用 :calss，：style 动态属性，以数组的方式传入多个值

---

**组件的 `emits` 选项有什么作用？**

用于接收父组件传递的事件方法，以数组的方式接收多个，返回一个emit可以在事件执行时调用

---

**如何在 Vue 3 中使用 TypeScript 定义组件 props？**

使用defineComponent 或者 defineProps

---

**`watch` 的 `immediate` 与 `deep` 选项分别做什么？**

immediate 是监听ref getter 数组的第一次时立即执行一次，此时的oldValue为undefined

deep时监听reactive 内嵌套属性的变化，也发生响应

---

**Vue 3 中如何实现组件懒加载？**

使用动态 import（）或者 defineAsyncComponent

---

**为什么尽量避免在模板中进行昂贵计算？有什么替代方案？**

模版中进行昂贵的计算会导致DOM更新效率变低，使得交互卡顿。

可以使用 computed 将计算结果缓存。

---

**如何在组件间共享逻辑（composition vs mixin）？**

可以使用组合式函数

---

**`Fragment` 在 Vue 3 中是什么？有什么好处？**

Fragment 是 Vue 3 中用于支持组件返回多个根节点的特性。它允许组件模板中不需要额外的包裹元素，减少无意义的 DOM 层级。

好处：
- 避免多余的 DOM 节点，优化渲染结构。
- 使模板结构更简洁，便于样式和布局管理。

---

**如何处理表单输入与双向绑定复杂场景（自定义 `v-model`）？**

在输入型组件如 input、textarea、select 等中使用 v-model 进行双向绑定。

对于自定义组件，可以通过 props 和 emits 实现自定义 v-model，简化父子通信。

---

**`effectScope` 的用途是什么？**

effectScope 用于收集和管理一组响应式副作用（如 watch、computed 等），便于统一停止和释放资源，提升代码的可维护性。

---

**如何在 Vue 中捕获错误（错误边界）？**

可以通过 app.config.errorHandler 注册全局错误处理函数，捕获运行时异常，实现错误边界。

---

**什么是 `markRaw`？什么时候使用？**

markRaw 用于将对象标记为不可被 Vue 响应式系统代理，返回原始对象。

适用于不需要响应式的对象（如第三方库实例、大型数据结构等）。

---

**如何在模板或 setup 中调用父组件方法？**

1. 通过 emits 传递事件方法，子组件调用时传递参数。
2. 父组件通过 provide 提供方法，子组件 inject 获取并调用。

---

**如何实现跨组件的事件总线（建议方式）？**

推荐通过状态提升到独立的 store（如 Pinia）统一管理，实现跨组件通信和状态同步。

---

**`v-once` 有什么作用？什么时候用？**

v-once 只渲染元素和组件一次，后续数据变化不会重新渲染。

适用于静态内容或不需要响应式更新的场景，提升渲染性能。

---

**如何在组件中使用 CSS Modules 或 Scoped CSS？**

在 <style scoped>  标签中添加 scoped 属性，实现样式只作用于当前单文件组件。

使用 CSS Modules 时，通过 module 属性和 :class 绑定实现样式隔离。
