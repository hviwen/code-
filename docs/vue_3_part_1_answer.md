**什么是 `ref`，与 `reactive` 的区别？**

~~Ref是vue中响应式声明的一个函数，它接收一个原始值作为参数，返回一个带有。value的响应式值。这个值在计算时需要使用。value，在模板中可以自动解包。~~

~~reactive也是响应式声明的函数。它接收的是一个对象。~~

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

~~computed 是vue中创建计算属性的函数，它自动返回响应式计算的结果。包含get和set两个内置方法可以定义。set在修改这计算值时使用，get在获取计算值时使用。~~

~~watch时vue中的监听器，他监听一个响应式值的改变，而做出相应的改变。可以在第一次定义时监听，立即；也可以是监听响应式值的内部结构的变化，深度；也可以在实现延迟反应、提前反应。可以接受监听值更新时新旧两个值。~~

~~computed 只是根据多个响应式值变化，做出对应变化后的计算结果。~~

~~watch可以监听任意单个或者多个响应式值的变化，而做出响应的处理。~~

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

setup() ~~是vue3选项式api结构中的内容~~，可以接受props和上下文对象。在页面创建之初执行。不能访问this，因为组件实例还没有创建

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

循环相同结构的组件，需要对每个组件标识身份，以提高dom操作的可靠性。~~key要避免是一个对象类型，会被解析成字符串结构。导致每一个key都相同。~~~~key可以是遍历中的顺序编号，或者遍历内容的id。~~

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
2. ~~provide inject~~

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
app.directive('focus',{
  mounted(el){
    el.focus()
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

~~teleport用于将内层组件指向外部组件渲染。通常在内层组件布局结构较小，需要展示更大的组件空间时使用。~~

~~可以通过to指向到外层任意节点上~~

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

suspense组件主要是为其内部子组件提供等待显示，当内容子组件内容没有加载完成时为pending状态，显示loading状态。当加载完成后为resolve，显示子组件内容。当子组件加载错误时，状态为rejected，显示fallback 错误提示内容。主要作用为提升交互体验。

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

~~在输入型组件：input，textarea、radio、select等组件中通过v-model将值绑定，就实现了双向绑定。~~

~~本质上是简化了props和emits的传递和事件响应。~~

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

~~可以通过 useRefs定一个refs，然后通过在组件中ref绑定该值，就可以获取到该组件的实例，就可以通过ref来调用该组件的方法。~~

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

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3 Composition API中两种不同的响应式监听机制，面试官想了解你是否理解它们的执行时机、依赖收集方式和适用场景的差异。

**技术错误纠正：**
1. "显示监听源"应为"显式监听源"
2. 原答案过于简略，缺少关键的技术细节和使用场景

**知识点系统梳理：**

**watchEffect特点：**
- 自动依赖收集：函数内部使用的响应式数据会被自动追踪
- 立即执行：组件创建时会立即执行一次
- 无新旧值：回调函数不接收新旧值参数
- 简洁语法：适合简单的副作用操作

**watch特点：**
- 显式依赖声明：需要明确指定监听的数据源
- 惰性执行：默认不会立即执行（除非设置immediate: true）
- 提供新旧值：回调函数接收新值和旧值参数
- 更多配置选项：支持deep、immediate、flush等选项

**实战应用举例：**
```javascript
import { ref, reactive, watch, watchEffect, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const user = reactive({ name: 'John', age: 25 })
    const doubleCount = computed(() => count.value * 2)

    // watchEffect - 自动依赖收集
    watchEffect(() => {
      // 自动追踪 count 和 user.name 的变化
      console.log(`Count: ${count.value}, User: ${user.name}`)
      // 当 count 或 user.name 变化时，这个函数会重新执行
    })

    // watch - 显式监听单个源
    watch(count, (newValue, oldValue) => {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    })

    // watch - 监听多个源
    watch([count, () => user.name], ([newCount, newName], [oldCount, oldName]) => {
      console.log('Multiple sources changed:', {
        count: { old: oldCount, new: newCount },
        name: { old: oldName, new: newName }
      })
    })

    // watch - 监听响应式对象
    watch(user, (newUser, oldUser) => {
      console.log('User object changed:', newUser)
    }, { deep: true }) // 需要deep选项来监听对象内部变化

    // watch - 监听计算属性
    watch(doubleCount, (newValue) => {
      console.log('Double count changed:', newValue)
    })

    // 条件性的watchEffect
    const isEnabled = ref(true)
    watchEffect(() => {
      if (isEnabled.value) {
        console.log('Enabled count:', count.value)
      }
      // 当 isEnabled 为 false 时，count 的变化不会触发日志
    })

    // 异步操作示例
    watchEffect(async () => {
      if (user.name) {
        try {
          const userData = await fetchUserData(user.name)
          console.log('User data loaded:', userData)
        } catch (error) {
          console.error('Failed to load user data:', error)
        }
      }
    })

    // 停止监听
    const stopWatching = watchEffect(() => {
      console.log('This will stop after 5 seconds')
    })

    setTimeout(() => {
      stopWatching() // 停止监听
    }, 5000)

    // 清理副作用
    watchEffect((onInvalidate) => {
      const timer = setTimeout(() => {
        console.log('Timer executed')
      }, 1000)

      // 清理函数，在下次执行前或组件卸载时调用
      onInvalidate(() => {
        clearTimeout(timer)
        console.log('Timer cleared')
      })
    })

    return {
      count,
      user,
      doubleCount
    }
  }
}

// 高级用法：自定义监听器
function useDebounceWatch(source, callback, delay = 300) {
  let timer

  watch(source, (newVal, oldVal) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      callback(newVal, oldVal)
    }, delay)
  })
}

// 使用自定义监听器
const searchQuery = ref('')
useDebounceWatch(searchQuery, (newQuery) => {
  console.log('Debounced search:', newQuery)
})
```

**使用场景对比：**

| 场景 | 推荐使用 | 原因 |
|------|----------|------|
| 简单的响应式日志记录 | watchEffect | 自动依赖收集，代码简洁 |
| 需要新旧值对比 | watch | 提供新旧值参数 |
| 监听特定数据源 | watch | 明确的监听目标，性能更好 |
| 复杂的依赖关系 | watchEffect | 自动处理复杂依赖 |
| 需要配置选项（deep、immediate） | watch | 更多配置选项 |
| API调用和副作用 | watchEffect | 自然的响应式编程模式 |

**性能考虑：**
```javascript
// ❌ 避免在watchEffect中进行昂贵操作
watchEffect(() => {
  // 每次count变化都会执行昂贵计算
  const result = expensiveCalculation(count.value)
  console.log(result)
})

// ✅ 使用computed缓存昂贵计算
const expensiveResult = computed(() => expensiveCalculation(count.value))
watchEffect(() => {
  console.log(expensiveResult.value) // 只有结果变化时才执行
})

// ✅ 使用watch进行精确控制
watch(count, (newCount) => {
  if (newCount > 10) { // 条件执行
    performExpensiveOperation(newCount)
  }
})
```

**记忆要点总结：**
- **watchEffect**：自动依赖 + 立即执行 + 无新旧值 + 简洁语法
- **watch**：显式依赖 + 惰性执行 + 有新旧值 + 更多选项
- **选择原则**：简单副作用用watchEffect，需要精确控制用watch
- **性能优化**：避免在监听器中进行昂贵操作，善用computed缓存

---

**什么是 `shallowRef` 和 `shallowReactive`？**

shalowRef 是定义浅层响应式原始值

shallowReactive 是定义浅层响应式对象

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3响应式系统的性能优化API，面试官想了解你是否理解浅层响应式的工作原理和使用场景，以及何时选择性能优化方案。

**技术错误纠正：**
1. 拼写错误："shalowRef"应为"shallowRef"
2. 原答案过于简单，没有说明"浅层"的具体含义
3. 缺少与深层响应式的对比和使用场景

**知识点系统梳理：**

**shallowRef特点：**
- 只有.value的赋值是响应式的
- 对象内部属性的变化不会触发更新
- 适用于包装大型数据结构或第三方库实例
- 性能优于普通ref（对于复杂对象）

**shallowReactive特点：**
- 只有根级别属性是响应式的
- 嵌套对象的属性变化不会触发更新
- 适用于只需要监听对象第一层属性的场景
- 避免深层代理的性能开销

**实战应用举例：**
```javascript
import { ref, reactive, shallowRef, shallowReactive, triggerRef } from 'vue'

// 1. shallowRef 基础用法
const normalRef = ref({ count: 1, nested: { value: 2 } })
const shallowRefObj = shallowRef({ count: 1, nested: { value: 2 } })

// 普通ref - 深层响应式
normalRef.value.count = 2 // ✅ 触发更新
normalRef.value.nested.value = 3 // ✅ 触发更新

// shallowRef - 浅层响应式
shallowRefObj.value.count = 2 // ❌ 不触发更新
shallowRefObj.value.nested.value = 3 // ❌ 不触发更新
shallowRefObj.value = { count: 2, nested: { value: 3 } } // ✅ 触发更新

// 2. shallowReactive 基础用法
const normalReactive = reactive({
  count: 1,
  user: { name: 'John', age: 25 },
  items: [1, 2, 3]
})

const shallowReactiveObj = shallowReactive({
  count: 1,
  user: { name: 'John', age: 25 },
  items: [1, 2, 3]
})

// 普通reactive - 深层响应式
normalReactive.count = 2 // ✅ 触发更新
normalReactive.user.name = 'Jane' // ✅ 触发更新
normalReactive.items.push(4) // ✅ 触发更新

// shallowReactive - 浅层响应式
shallowReactiveObj.count = 2 // ✅ 触发更新
shallowReactiveObj.user.name = 'Jane' // ❌ 不触发更新
shallowReactiveObj.items.push(4) // ❌ 不触发更新
shallowReactiveObj.user = { name: 'Jane', age: 30 } // ✅ 触发更新

// 3. 手动触发更新
const data = shallowRef({ list: [1, 2, 3] })

const addItem = (item) => {
  data.value.list.push(item) // 修改内部数据
  triggerRef(data) // 手动触发更新
}

// 4. 大型数据结构优化
const largeDataSet = shallowRef({
  users: new Array(10000).fill(null).map((_, i) => ({
    id: i,
    name: `User ${i}`,
    profile: { /* 复杂对象 */ }
  })),
  metadata: { /* 其他数据 */ }
})

// 只有整体替换才会触发更新，避免深层遍历的性能开销
const updateUsers = (newUsers) => {
  largeDataSet.value = {
    ...largeDataSet.value,
    users: newUsers
  }
}

// 5. 第三方库集成
const chartInstance = shallowRef(null)

onMounted(() => {
  // 第三方图表库实例
  chartInstance.value = new Chart(canvasRef.value, {
    type: 'bar',
    data: chartData.value,
    options: chartOptions
  })
})

// 更新图表数据
const updateChart = (newData) => {
  if (chartInstance.value) {
    chartInstance.value.data = newData
    chartInstance.value.update()
    // 不需要Vue的响应式系统追踪图表内部状态
  }
}

// 6. 状态管理优化
const appState = shallowReactive({
  currentUser: null,
  settings: {},
  cache: new Map(),
  notifications: []
})

// 只监听根级别属性变化
watch(() => appState.currentUser, (newUser) => {
  console.log('User changed:', newUser)
})

// 7. 性能对比示例
const createLargeObject = () => ({
  data: new Array(1000).fill(null).map((_, i) => ({
    id: i,
    items: new Array(100).fill(null).map((_, j) => ({ value: j }))
  }))
})

// 深层响应式 - 会代理所有嵌套对象
const deepReactive = reactive(createLargeObject()) // 较慢

// 浅层响应式 - 只代理根级别
const shallowData = shallowReactive(createLargeObject()) // 较快

// 8. 组合使用场景
const useOptimizedStore = () => {
  // 使用shallowReactive存储状态
  const state = shallowReactive({
    data: null,
    loading: false,
    error: null
  })

  // 使用普通ref存储需要深度监听的数据
  const filters = ref({
    category: '',
    dateRange: { start: null, end: null }
  })

  const updateData = (newData) => {
    // 整体替换，触发更新
    state.data = newData
    state.loading = false
  }

  return {
    state: readonly(state), // 防止外部直接修改
    filters,
    updateData
  }
}

// 9. 类型安全的浅层响应式（TypeScript）
interface UserData {
  id: number
  profile: {
    name: string
    settings: Record<string, any>
  }
}

const userData = shallowRef<UserData>({
  id: 1,
  profile: {
    name: 'John',
    settings: {}
  }
})

// 类型安全的更新方法
const updateUserProfile = (newProfile: UserData['profile']) => {
  userData.value = {
    ...userData.value,
    profile: newProfile
  }
}
```

**使用场景对比：**

| 场景 | 推荐使用 | 原因 |
|------|----------|------|
| 大型数据集合 | shallowRef/shallowReactive | 避免深层代理的性能开销 |
| 第三方库实例 | shallowRef | 不需要Vue追踪库内部状态 |
| 只关心根级属性 | shallowReactive | 精确控制响应式范围 |
| 频繁整体替换的数据 | shallowRef | 避免不必要的深层比较 |
| 需要深层监听 | ref/reactive | 完整的响应式支持 |
| 复杂嵌套状态 | reactive | 自动处理所有层级变化 |

**性能优化建议：**
```javascript
// ❌ 避免：对大型对象使用深层响应式
const largeState = reactive({
  massiveArray: new Array(10000).fill({}),
  deepNested: { /* 深层嵌套对象 */ }
})

// ✅ 推荐：使用浅层响应式 + 手动控制
const optimizedState = shallowReactive({
  massiveArray: [],
  deepNested: {}
})

// 需要更新时整体替换
const updateMassiveArray = (newArray) => {
  optimizedState.massiveArray = newArray
}
```

**记忆要点总结：**
- **shallowRef**：只有.value赋值响应式，内部属性变化不响应
- **shallowReactive**：只有根级属性响应式，嵌套属性变化不响应
- **使用场景**：大型数据、第三方库、性能优化
- **手动触发**：使用triggerRef强制触发shallowRef更新
- **选择原则**：性能敏感场景用浅层，需要深层监听用普通响应式

---

**如何将响应式对象解构而不丢失响应性？**

可以在解构时使用 toRef将解构后的内容包装 不会丢失响应式

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3响应式系统中的一个重要陷阱，面试官想了解你是否理解解构操作对响应性的影响，以及如何正确处理这种情况。

**技术错误纠正：**
1. 原答案只提到了toRef，没有说明toRefs的批量处理功能
2. 缺少解构失去响应性的原理解释
3. 没有提供具体的使用语法和场景示例

**知识点系统梳理：**

**解构失去响应性的原理：**
- 解构操作会提取对象的属性值，而不是属性的引用
- 响应式对象的响应性依赖于对象本身的代理
- 解构后得到的是普通值，失去了与原对象的响应式连接

**解决方案：**
- `toRef`：为单个属性创建响应式引用
- `toRefs`：为对象的所有属性创建响应式引用
- `storeToRefs`：专门用于Pinia store的解构

**实战应用举例：**
```javascript
import { reactive, ref, toRef, toRefs, computed, watch } from 'vue'

// 1. 问题演示：解构失去响应性
const state = reactive({
  count: 1,
  name: 'Vue',
  user: {
    id: 1,
    profile: { email: 'user@example.com' }
  }
})

// ❌ 错误：直接解构失去响应性
const { count, name } = state
console.log(count) // 1 (普通值)
state.count = 2
console.log(count) // 仍然是 1，没有响应性

// 2. 解决方案一：toRefs 批量处理
const { count: reactiveCount, name: reactiveName } = toRefs(state)

// 现在是响应式的
console.log(reactiveCount.value) // 1
state.count = 2
console.log(reactiveCount.value) // 2

// 在模板中自动解包
// <template>{{ reactiveCount }}</template> // 显示 2，无需 .value

// 3. 解决方案二：toRef 单个处理
const count2 = toRef(state, 'count')
const name2 = toRef(state, 'name')

// 响应式引用
watch(count2, (newVal) => {
  console.log('Count changed to:', newVal)
})

// 4. 嵌套属性的处理
const userEmail = toRef(state.user.profile, 'email')
// 或者使用路径方式（Vue 3.3+）
const userEmail2 = toRef(() => state.user.profile.email)

// 5. 组合式函数中的应用
function useCounter() {
  const state = reactive({
    count: 0,
    step: 1,
    history: []
  })

  const increment = () => {
    state.count += state.step
    state.history.push(state.count)
  }

  const decrement = () => {
    state.count -= state.step
    state.history.push(state.count)
  }

  // ✅ 正确：使用toRefs返回响应式引用
  return {
    ...toRefs(state),
    increment,
    decrement
  }
}

// 使用组合式函数
const { count, step, history, increment, decrement } = useCounter()

// 这些都是响应式的
watch(count, (newCount) => {
  console.log('Counter changed:', newCount)
})

// 6. 计算属性的解构
const computedState = reactive({
  firstName: 'John',
  lastName: 'Doe'
})

const fullName = computed(() => `${computedState.firstName} ${computedState.lastName}`)

// 解构计算属性和响应式状态
const { firstName, lastName } = toRefs(computedState)
const nameInfo = {
  firstName,
  lastName,
  fullName // 计算属性本身就是ref，不需要toRef
}

// 7. 条件性解构
function useConditionalState(enabled) {
  const state = reactive({
    data: null,
    loading: false,
    error: null
  })

  if (enabled) {
    // 只在需要时解构
    return {
      ...toRefs(state),
      isEnabled: ref(true)
    }
  }

  return {
    isEnabled: ref(false)
  }
}

// 8. 类型安全的解构（TypeScript）
interface UserState {
  id: number
  name: string
  email: string
  preferences: {
    theme: string
    language: string
  }
}

const userState = reactive<UserState>({
  id: 1,
  name: 'John',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    language: 'en'
  }
})

// 类型安全的解构
const { id, name, email } = toRefs(userState)
// id, name, email 都是 Ref<T> 类型

// 嵌套对象的类型安全解构
const theme = toRef(userState.preferences, 'theme')
// theme 是 Ref<string> 类型

// 9. 与Pinia store的结合使用
import { storeToRefs } from 'pinia'

// 假设有一个Pinia store
const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  const login = async (credentials) => {
    // 登录逻辑
  }

  return { user, isLoggedIn, login }
})

// 在组件中使用
const userStore = useUserStore()

// ❌ 错误：直接解构失去响应性
const { user, isLoggedIn } = userStore

// ✅ 正确：使用storeToRefs
const { user, isLoggedIn } = storeToRefs(userStore)
const { login } = userStore // 方法不需要响应性

// 10. 性能优化：选择性解构
const largeState = reactive({
  // 大量属性
  prop1: 'value1',
  prop2: 'value2',
  // ... 更多属性
  prop100: 'value100'
})

// ❌ 避免：解构所有属性
const allProps = toRefs(largeState) // 创建100个ref

// ✅ 推荐：只解构需要的属性
const { prop1, prop2 } = toRefs(largeState)
// 或者
const prop1 = toRef(largeState, 'prop1')
const prop2 = toRef(largeState, 'prop2')

// 11. 动态属性解构
const dynamicState = reactive({
  data: {},
  meta: {}
})

const createDynamicRefs = (keys) => {
  return keys.reduce((refs, key) => {
    refs[key] = toRef(dynamicState.data, key)
    return refs
  }, {})
}

// 根据需要创建响应式引用
const dynamicRefs = createDynamicRefs(['name', 'age', 'email'])

// 12. 解构的最佳实践
function useOptimizedState() {
  const state = reactive({
    // 经常变化的数据
    count: 0,
    status: 'idle',

    // 不经常变化的配置
    config: {
      theme: 'light',
      locale: 'en'
    },

    // 大型数据
    items: []
  })

  // 选择性解构：只解构经常使用的属性
  const { count, status } = toRefs(state)

  // 配置数据使用单独的ref
  const theme = toRef(state.config, 'theme')

  // 大型数据保持原始引用
  const items = toRef(state, 'items')

  return {
    count,
    status,
    theme,
    items,
    // 提供原始state的只读访问
    state: readonly(state)
  }
}
```

**使用场景对比：**

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 组合式函数返回 | toRefs | 批量处理，使用方便 |
| 单个属性提取 | toRef | 性能更好，按需创建 |
| Pinia store解构 | storeToRefs | 专门优化，区分状态和方法 |
| 嵌套属性访问 | toRef + 路径 | 支持深层属性 |
| 大型对象 | 选择性toRef | 避免创建过多ref |
| 动态属性 | 编程式toRef | 灵活处理动态场景 |

**常见陷阱和解决方案：**
```javascript
// ❌ 陷阱1：解构后修改失效
const { count } = toRefs(state)
count = ref(999) // 错误！破坏了响应式连接

// ✅ 正确：修改.value
count.value = 999

// ❌ 陷阱2：重复解构
const { count: count1 } = toRefs(state)
const { count: count2 } = toRefs(state)
// count1 和 count2 是不同的ref实例

// ✅ 正确：复用解构结果
const stateRefs = toRefs(state)
const count1 = stateRefs.count
const count2 = stateRefs.count // 同一个ref

// ❌ 陷阱3：解构非响应式对象
const plainObject = { count: 1 }
const { count } = toRefs(plainObject) // 警告：不是响应式对象

// ✅ 正确：先转换为响应式
const reactiveObject = reactive(plainObject)
const { count } = toRefs(reactiveObject)
```

**记忆要点总结：**
- **问题原因**：解构提取值而非引用，失去响应式连接
- **toRefs**：批量解构，适合组合式函数返回
- **toRef**：单个解构，性能更好，支持嵌套路径
- **storeToRefs**：专门用于Pinia store解构
- **最佳实践**：按需解构，避免过度创建ref，注意性能影响

---

**`isRef`、`unref`、`toRaw` 分别是什么？**

isRef 判断是否是响应式值

unref 返回响应式值或者原始值

toRaw 返回响应式包装对象的原始对象

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3响应式系统的工具函数，面试官想了解你是否掌握响应式数据的类型判断、值提取和原始对象访问的方法。

**技术错误纠正：**
1. "isRef 判断是否是响应式值"不够准确，应该是"判断是否是ref对象"
2. 原答案过于简单，缺少具体用法和使用场景
3. 没有说明这些工具函数的实际应用价值

**知识点系统梳理：**

**isRef - 类型判断：**
- 判断一个值是否是ref对象
- 返回boolean值
- 用于类型守卫和条件判断

**unref - 安全取值：**
- 如果参数是ref，返回.value
- 如果参数不是ref，直接返回原值
- 等价于：`isRef(val) ? val.value : val`

**toRaw - 原始对象访问：**
- 返回reactive或readonly对象的原始版本
- 对ref对象无效（需要先.value）
- 用于性能优化和第三方库集成

**实战应用举例：**
```javascript
import { ref, reactive, readonly, isRef, unref, toRaw, computed } from 'vue'

// 1. isRef - 类型判断和守卫
const count = ref(1)
const name = 'Vue'
const user = reactive({ id: 1 })

console.log(isRef(count)) // true
console.log(isRef(name)) // false
console.log(isRef(user)) // false

// 类型守卫函数
function getValue(maybeRef) {
  if (isRef(maybeRef)) {
    return maybeRef.value
  }
  return maybeRef
}

// 更好的方式是使用unref
function getValueBetter(maybeRef) {
  return unref(maybeRef)
}

// 2. unref - 统一值提取
const refValue = ref(42)
const plainValue = 42

console.log(unref(refValue)) // 42
console.log(unref(plainValue)) // 42

// 实用工具函数
function createFormatter(template) {
  return (value) => {
    const actualValue = unref(value)
    return template.replace('{value}', actualValue)
  }
}

const formatter = createFormatter('Value: {value}')
console.log(formatter(refValue)) // "Value: 42"
console.log(formatter(plainValue)) // "Value: 42"

// 3. toRaw - 原始对象访问
const reactiveUser = reactive({
  id: 1,
  name: 'John',
  preferences: {
    theme: 'dark',
    notifications: true
  }
})

const rawUser = toRaw(reactiveUser)
console.log(rawUser === reactiveUser) // false
console.log(rawUser) // 原始对象，修改不会触发响应式更新

// 性能优化：避免响应式开销
function performHeavyOperation(data) {
  const rawData = toRaw(data)
  // 对原始数据进行大量操作，不触发响应式更新
  return processLargeDataSet(rawData)
}

// 4. 组合使用场景
function useFlexibleState(initialValue) {
  // 可以接受ref或普通值
  const state = isRef(initialValue) ? initialValue : ref(initialValue)

  const getValue = () => unref(state)
  const setValue = (newValue) => {
    state.value = unref(newValue) // 支持设置ref或普通值
  }

  return {
    state,
    getValue,
    setValue
  }
}

// 使用示例
const { state: state1 } = useFlexibleState(ref(1))
const { state: state2 } = useFlexibleState(2)

// 5. 第三方库集成
function integrateWithThirdPartyLib(reactiveData) {
  // 第三方库通常不理解Vue的响应式对象
  const rawData = toRaw(reactiveData)

  // 传递原始数据给第三方库
  const libInstance = new ThirdPartyLib(rawData)

  // 监听变化并同步到第三方库
  watch(reactiveData, (newData) => {
    libInstance.updateData(toRaw(newData))
  }, { deep: true })

  return libInstance
}

// 6. 深度比较工具
function deepEqual(a, b) {
  // 获取原始值进行比较
  const rawA = isRef(a) ? unref(a) : toRaw(a) || a
  const rawB = isRef(b) ? unref(b) : toRaw(b) || b

  return JSON.stringify(rawA) === JSON.stringify(rawB)
}

// 7. 序列化工具
function serialize(data) {
  const processValue = (value) => {
    if (isRef(value)) {
      return { __type: 'ref', value: unref(value) }
    }

    if (typeof value === 'object' && value !== null) {
      const raw = toRaw(value)
      if (raw !== value) {
        return { __type: 'reactive', value: raw }
      }
    }

    return value
  }

  return JSON.stringify(data, (key, value) => processValue(value))
}

// 8. 类型安全的工具函数（TypeScript）
function isRefOfType<T>(value: unknown): value is Ref<T> {
  return isRef(value)
}

function unrefSafe<T>(value: T | Ref<T>): T {
  return unref(value)
}

// 使用类型守卫
const maybeRefString: string | Ref<string> = ref('hello')

if (isRefOfType<string>(maybeRefString)) {
  // TypeScript知道这里是Ref<string>
  console.log(maybeRefString.value.toUpperCase())
}

// 9. 调试工具
function debugReactiveValue(value, label = 'Value') {
  console.group(label)
  console.log('Is ref:', isRef(value))
  console.log('Unref value:', unref(value))

  if (typeof value === 'object' && value !== null && !isRef(value)) {
    const raw = toRaw(value)
    console.log('Is reactive:', raw !== value)
    console.log('Raw object:', raw)
  }

  console.groupEnd()
}

// 使用调试工具
const debugData = reactive({ count: 1 })
debugReactiveValue(debugData, 'Debug Data')

// 10. 性能监控
function measureReactivePerformance(reactiveObj, operation) {
  const startTime = performance.now()

  // 使用原始对象进行操作，避免响应式开销
  const rawObj = toRaw(reactiveObj)
  const result = operation(rawObj)

  const endTime = performance.now()
  console.log(`Operation took ${endTime - startTime} milliseconds`)

  return result
}

// 11. 条件响应式包装
function maybeReactive(value, shouldBeReactive = true) {
  if (shouldBeReactive) {
    return isRef(value) ? value : ref(value)
  }
  return unref(value)
}

// 12. 响应式状态克隆
function cloneReactiveState(source) {
  if (isRef(source)) {
    return ref(unref(source))
  }

  if (typeof source === 'object' && source !== null) {
    const raw = toRaw(source)
    return reactive(JSON.parse(JSON.stringify(raw)))
  }

  return source
}

// 13. 批量处理工具
function batchProcess(items, processor) {
  return items.map(item => {
    const value = unref(item)
    return processor(value)
  })
}

// 使用示例
const refItems = [ref(1), ref(2), ref(3)]
const plainItems = [4, 5, 6]
const mixedItems = [...refItems, ...plainItems]

const processed = batchProcess(mixedItems, x => x * 2)
console.log(processed) // [2, 4, 6, 8, 10, 12]

// 14. 响应式数据验证
function validateReactiveData(data, schema) {
  const rawData = isRef(data) ? unref(data) : toRaw(data) || data

  // 使用原始数据进行验证，避免响应式干扰
  return validateSchema(rawData, schema)
}
```

**使用场景对比：**

| 工具函数 | 主要用途 | 使用场景 |
|----------|----------|----------|
| isRef | 类型判断 | 类型守卫、条件逻辑、工具函数 |
| unref | 安全取值 | 统一处理ref和普通值 |
| toRaw | 原始对象 | 性能优化、第三方库集成、序列化 |

**性能考虑：**
```javascript
// ❌ 避免：频繁调用toRaw
function inefficientOperation(reactiveData) {
  for (let i = 0; i < 1000; i++) {
    const raw = toRaw(reactiveData) // 每次都调用toRaw
    processData(raw)
  }
}

// ✅ 推荐：缓存原始对象
function efficientOperation(reactiveData) {
  const raw = toRaw(reactiveData) // 只调用一次
  for (let i = 0; i < 1000; i++) {
    processData(raw)
  }
}

// ❌ 避免：不必要的unref调用
function unnecessaryUnref(value) {
  if (typeof value === 'string') {
    return unref(value) // 如果已知是字符串，不需要unref
  }
}

// ✅ 推荐：智能判断
function smartUnref(value) {
  return isRef(value) ? value.value : value
}
```

**记忆要点总结：**
- **isRef**：类型判断，返回boolean，用于类型守卫
- **unref**：安全取值，等价于`isRef(val) ? val.value : val`
- **toRaw**：获取原始对象，用于性能优化和第三方库集成
- **使用原则**：按需使用，注意性能影响，结合类型系统使用
- **常见场景**：工具函数、第三方库集成、性能优化、调试工具

---

**如何防止子组件暴露过多内部实现？（组件封装）**

可以使用Expose()在setup显示暴露方法和属性

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3组件封装的最佳实践，面试官想了解你是否理解组件接口设计原则和如何控制组件的公共API。

**技术错误纠正：**
1. 函数名错误："Expose()"应为"defineExpose"
2. 原答案过于简单，缺少封装原则和具体实现
3. 没有说明为什么需要限制暴露和如何设计良好的组件接口

**知识点系统梳理：**

**组件封装原则：**
- 最小暴露原则：只暴露必要的接口
- 接口稳定性：避免暴露易变的内部实现
- 职责单一：每个暴露的方法都有明确的职责
- 向后兼容：接口变更要考虑兼容性

**defineExpose的作用：**
- 在`<script setup>`中显式控制组件暴露的属性和方法
- 替代Options API中的自动暴露机制
- 提供更精确的接口控制

**实战应用举例：**
```javascript
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

// 公共方法
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const refresh = async () => {
  await fetchUserData()
}

const exportUserData = () => {
  if (!userData.value?.id) {
    throw new Error('用户数据无效')
  }

  return {
    id: userData.value.id,
    name: userData.value.name,
    email: userData.value.email,
    exportTime: new Date().toISOString()
  }
}

// 计算属性
const name = computed(() => userData.value?.name || '未知用户')
const email = computed(() => userData.value?.email || '')
const avatar = computed(() => userData.value?.avatar || '/default-avatar.png')

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
  // error,              // 内部错误状态
  // formatDate          // 工具方法
})
</script>
```

**封装最佳实践：**
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
  search: (query) => { /* 实现 */ },
  sort: (key, direction) => { /* 实现 */ }
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

**记忆要点总结：**
- **封装原则**：最小暴露、接口稳定、职责单一、向后兼容
- **defineExpose**：显式控制组件公共API，替代自动暴露
- **暴露内容**：公共方法、只读状态、计算属性
- **不暴露内容**：内部状态、私有方法、工具函数、配置对象
- **最佳实践**：清晰命名、类型约束、文档化、版本兼容

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3组件封装的最佳实践，面试官想了解你是否理解组件接口设计原则和如何控制组件的公共API。

**技术错误纠正：**
1. 函数名错误："Expose()"应为"defineExpose"
2. 原答案过于简单，缺少封装原则和具体实现
3. 没有说明为什么需要限制暴露和如何设计良好的组件接口

**知识点系统梳理：**

**组件封装原则：**
- 最小暴露原则：只暴露必要的接口
- 接口稳定性：避免暴露易变的内部实现
- 职责单一：每个暴露的方法都有明确的职责
- 向后兼容：接口变更要考虑兼容性

**defineExpose的作用：**
- 在`<script setup>`中显式控制组件暴露的属性和方法
- 替代Options API中的自动暴露机制
- 提供更精确的接口控制

**实战应用举例：**
```javascript
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

**记忆要点总结：**
- **封装原则**：最小暴露、接口稳定、职责单一、向后兼容
- **defineExpose**：显式控制组件公共API，替代自动暴露
- **暴露内容**：公共方法、只读状态、计算属性
- **不暴露内容**：内部状态、私有方法、工具函数、配置对象
- **最佳实践**：清晰命名、类型约束、文档化、版本兼容

---

**什么是 `defineAsyncComponent`？什么时候使用？**

动态加载异步组件，用于性能优化。当某个组件暂时不在渲染内容中时，先不需要将可能用到的所有组件全部加载，而是在当需要显示的时候按需加载。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3的异步组件机制和代码分割策略，面试官想了解你是否掌握前端性能优化的重要手段。

**知识点系统梳理：**

**defineAsyncComponent的作用：**
- 创建异步加载的组件
- 支持代码分割和懒加载
- 提供加载状态和错误处理
- 优化首屏加载性能

**使用场景：**
- 大型组件的懒加载
- 路由级别的代码分割
- 条件性加载的组件
- 第三方库的按需加载

**实战应用举例：**
```javascript
import { defineAsyncComponent } from 'vue'

// 1. 基础用法
const AsyncComponent = defineAsyncComponent(() => import('./MyComponent.vue'))

// 2. 带选项的异步组件
const AsyncComponentWithOptions = defineAsyncComponent({
  // 加载函数
  loader: () => import('./HeavyComponent.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingSpinner,

  // 展示加载组件前的延迟时间，默认200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,

  // 如果提供了timeout，并且加载组件的时间超过了设定值，将显示错误组件
  timeout: 3000,

  // 定义组件是否可挂起，默认true
  suspensible: false,

  // 错误处理函数
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      // 请求发生错误时重试，最多可尝试3次
      retry()
    } else {
      // 注意，retry/fail就像promise的resolve/reject一样：
      // 必须调用其中一个才能继续错误处理。
      fail()
    }
  }
})

// 3. 路由级别的异步组件
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: defineAsyncComponent(() => import('@/views/Dashboard.vue'))
  },
  {
    path: '/admin',
    name: 'Admin',
    component: defineAsyncComponent({
      loader: () => import('@/views/Admin.vue'),
      loadingComponent: () => import('@/components/PageLoading.vue'),
      errorComponent: () => import('@/components/PageError.vue'),
      delay: 200,
      timeout: 5000
    })
  }
]

// 4. 条件性异步加载
<template>
  <div>
    <button @click="showChart = !showChart">
      {{ showChart ? '隐藏' : '显示' }}图表
    </button>

    <!-- 只有在需要时才加载图表组件 -->
    <Suspense v-if="showChart">
      <template #default>
        <AsyncChart :data="chartData" />
      </template>
      <template #fallback>
        <div class="loading">加载图表中...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const showChart = ref(false)
const chartData = ref([])

// 图表组件只在需要时加载
const AsyncChart = defineAsyncComponent({
  loader: () => import('./Chart.vue'),
  delay: 100
})
</script>

// 5. 第三方库的异步加载
const AsyncEditor = defineAsyncComponent({
  loader: async () => {
    // 动态导入第三方库
    const [{ default: Editor }, monaco] = await Promise.all([
      import('./Editor.vue'),
      import('monaco-editor')
    ])

    // 可以在这里进行库的初始化
    return Editor
  },
  loadingComponent: {
    template: '<div class="loading">加载编辑器中...</div>'
  },
  errorComponent: {
    template: '<div class="error">编辑器加载失败</div>'
  },
  timeout: 10000
})

// 6. 高级用法：动态组件工厂
function createAsyncComponent(componentPath, options = {}) {
  return defineAsyncComponent({
    loader: () => import(componentPath),
    loadingComponent: options.loading || DefaultLoading,
    errorComponent: options.error || DefaultError,
    delay: options.delay || 200,
    timeout: options.timeout || 3000,
    ...options
  })
}

// 使用工厂函数
const AsyncUserProfile = createAsyncComponent('./UserProfile.vue', {
  delay: 100,
  timeout: 5000
})

// 7. 与Suspense结合使用
<template>
  <div class="app">
    <Suspense>
      <template #default>
        <AsyncDashboard />
      </template>
      <template #fallback>
        <div class="app-loading">
          <div class="spinner"></div>
          <p>应用加载中...</p>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
const AsyncDashboard = defineAsyncComponent(() => import('./Dashboard.vue'))
</script>

// 8. 错误重试机制
const AsyncComponentWithRetry = defineAsyncComponent({
  loader: () => import('./UnstableComponent.vue'),

  onError(error, retry, fail, attempts) {
    console.log(`加载失败，尝试次数: ${attempts}`)

    if (attempts <= 3) {
      // 延迟重试
      setTimeout(() => {
        console.log('重试加载组件...')
        retry()
      }, 1000 * attempts) // 递增延迟
    } else {
      console.error('组件加载最终失败:', error)
      fail()
    }
  }
})

// 9. 预加载策略
function preloadComponent(componentLoader) {
  // 在空闲时间预加载组件
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      componentLoader()
    })
  } else {
    // 降级方案
    setTimeout(() => {
      componentLoader()
    }, 2000)
  }
}

// 预加载重要组件
preloadComponent(() => import('./ImportantComponent.vue'))

// 10. 组件缓存策略
const componentCache = new Map()

function createCachedAsyncComponent(componentPath) {
  if (componentCache.has(componentPath)) {
    return componentCache.get(componentPath)
  }

  const asyncComponent = defineAsyncComponent(() => import(componentPath))
  componentCache.set(componentPath, asyncComponent)

  return asyncComponent
}

// 11. TypeScript支持
interface AsyncComponentOptions {
  delay?: number
  timeout?: number
  retries?: number
}

function createTypedAsyncComponent<T = any>(
  loader: () => Promise<T>,
  options: AsyncComponentOptions = {}
) {
  return defineAsyncComponent({
    loader,
    delay: options.delay || 200,
    timeout: options.timeout || 3000,
    onError(error, retry, fail, attempts) {
      if (attempts <= (options.retries || 3)) {
        retry()
      } else {
        fail()
      }
    }
  })
}

// 12. 性能监控
const AsyncComponentWithMetrics = defineAsyncComponent({
  loader: async () => {
    const startTime = performance.now()

    try {
      const component = await import('./Component.vue')
      const loadTime = performance.now() - startTime

      // 发送性能指标
      analytics.track('component_load_time', {
        component: 'Component',
        loadTime,
        success: true
      })

      return component
    } catch (error) {
      const loadTime = performance.now() - startTime

      analytics.track('component_load_time', {
        component: 'Component',
        loadTime,
        success: false,
        error: error.message
      })

      throw error
    }
  }
})
```

**使用场景对比：**

| 场景 | 推荐使用 | 原因 |
|------|----------|------|
| 大型组件 | defineAsyncComponent | 减少初始包大小 |
| 路由组件 | 异步组件 + 路由懒加载 | 按页面分割代码 |
| 条件性组件 | 异步组件 + v-if | 只在需要时加载 |
| 第三方库 | 异步组件 + 动态导入 | 避免库的初始加载 |
| 低频功能 | 异步组件 | 优化主要功能的加载速度 |

**性能优化建议：**
```javascript
// ✅ 推荐：合理的代码分割
const AsyncChart = defineAsyncComponent(() => import('./Chart.vue'))
const AsyncEditor = defineAsyncComponent(() => import('./Editor.vue'))

// ❌ 避免：过度分割
const AsyncButton = defineAsyncComponent(() => import('./Button.vue')) // 小组件不需要异步

// ✅ 推荐：预加载关键组件
const preloadCriticalComponents = () => {
  import('./CriticalComponent.vue')
  import('./ImportantFeature.vue')
}

// 在合适的时机预加载
onMounted(() => {
  setTimeout(preloadCriticalComponents, 2000)
})
```

**记忆要点总结：**
- **作用**：创建异步加载的组件，支持代码分割和懒加载
- **配置选项**：loader、loadingComponent、errorComponent、delay、timeout
- **使用场景**：大型组件、路由组件、条件性组件、第三方库
- **性能优化**：减少初始包大小、按需加载、预加载策略
- **最佳实践**：合理分割、错误处理、性能监控、缓存策略

---

**如何在模板中绑定 class 和 style（双向/多值）？**

可以使用 :calss，：style 动态属性，以数组的方式传入多个值

## 深度分析与补充

**问题本质解读：** 这道题考察Vue模板中动态样式绑定的各种方式，面试官想了解你是否掌握灵活的样式控制技巧和最佳实践。

**技术错误纠正：**
1. 拼写错误：":calss"应为":class"
2. 原答案过于简单，没有涵盖所有绑定方式
3. 缺少具体的语法示例和使用场景

**知识点系统梳理：**

**class绑定方式：**
- 对象语法：`{ className: condition }`
- 数组语法：`[class1, class2]`
- 混合语法：`[class1, { class2: condition }]`
- 计算属性和方法

**style绑定方式：**
- 对象语法：`{ property: value }`
- 数组语法：`[style1, style2]`
- CSS变量绑定
- 动态样式计算

**实战应用举例：**
```vue
<template>
  <div class="demo-container">
    <!-- 1. class对象语法 -->
    <div
      :class="{
        active: isActive,
        disabled: isDisabled,
        'has-error': hasError,
        'text-large': fontSize === 'large'
      }"
    >
      对象语法示例
    </div>

    <!-- 2. class数组语法 -->
    <div :class="[baseClass, themeClass, sizeClass]">
      数组语法示例
    </div>

    <!-- 3. class混合语法 -->
    <div :class="[
      baseClass,
      {
        active: isActive,
        disabled: isDisabled
      },
      conditionalClass
    ]">
      混合语法示例
    </div>

    <!-- 4. 计算属性的class -->
    <div :class="computedClasses">
      计算属性示例
    </div>

    <!-- 5. style对象语法 -->
    <div
      :style="{
        color: textColor,
        fontSize: fontSize + 'px',
        backgroundColor: bgColor,
        transform: `translateX(${offsetX}px) translateY(${offsetY}px)`,
        '--custom-property': customValue
      }"
    >
      样式对象语法
    </div>

    <!-- 6. style数组语法 -->
    <div :style="[baseStyles, themeStyles, responsiveStyles]">
      样式数组语法
    </div>

    <!-- 7. 条件样式 -->
    <div
      :style="{
        display: isVisible ? 'block' : 'none',
        opacity: isLoading ? 0.5 : 1,
        cursor: isClickable ? 'pointer' : 'default'
      }"
    >
      条件样式
    </div>

    <!-- 8. 动态主题切换 -->
    <div :class="themeClasses" :style="themeStyles">
      <h2>主题切换示例</h2>
      <button @click="toggleTheme">切换主题</button>
    </div>

    <!-- 9. 响应式样式 -->
    <div
      :class="responsiveClasses"
      :style="responsiveStyles"
    >
      响应式布局
    </div>

    <!-- 10. 动画相关样式 -->
    <div
      :class="{
        'fade-in': shouldFadeIn,
        'slide-up': shouldSlideUp,
        'bounce': shouldBounce
      }"
      :style="animationStyles"
    >
      动画元素
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'

// 基础响应式数据
const isActive = ref(true)
const isDisabled = ref(false)
const hasError = ref(false)
const isVisible = ref(true)
const isLoading = ref(false)
const isClickable = ref(true)

// 样式相关数据
const textColor = ref('#333')
const fontSize = ref(16)
const bgColor = ref('#f0f0f0')
const offsetX = ref(0)
const offsetY = ref(0)
const customValue = ref('10px')

// 类名数据
const baseClass = ref('base-component')
const themeClass = ref('theme-light')
const sizeClass = ref('size-medium')

// 主题系统
const currentTheme = ref('light')
const themes = reactive({
  light: {
    classes: ['theme-light', 'bg-white', 'text-dark'],
    styles: {
      backgroundColor: '#ffffff',
      color: '#333333',
      borderColor: '#e0e0e0'
    }
  },
  dark: {
    classes: ['theme-dark', 'bg-dark', 'text-light'],
    styles: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      borderColor: '#404040'
    }
  }
})

// 计算属性 - 复杂class逻辑
const computedClasses = computed(() => {
  const classes = ['computed-component']

  if (isActive.value) classes.push('active')
  if (isDisabled.value) classes.push('disabled')
  if (hasError.value) classes.push('error')

  // 根据不同条件添加不同类名
  if (fontSize.value > 18) classes.push('large-text')
  if (fontSize.value < 14) classes.push('small-text')

  return classes
})

// 计算属性 - 主题相关
const themeClasses = computed(() => {
  return ['themed-component', ...themes[currentTheme.value].classes]
})

const themeStyles = computed(() => {
  return {
    ...themes[currentTheme.value].styles,
    transition: 'all 0.3s ease'
  }
})

// 计算属性 - 响应式样式
const responsiveClasses = computed(() => {
  const classes = ['responsive-component']

  // 模拟屏幕尺寸检测
  const screenWidth = window.innerWidth || 1024

  if (screenWidth < 768) {
    classes.push('mobile')
  } else if (screenWidth < 1024) {
    classes.push('tablet')
  } else {
    classes.push('desktop')
  }

  return classes
})

const responsiveStyles = computed(() => {
  const screenWidth = window.innerWidth || 1024

  return {
    padding: screenWidth < 768 ? '10px' : '20px',
    fontSize: screenWidth < 768 ? '14px' : '16px',
    maxWidth: screenWidth < 768 ? '100%' : '800px'
  }
})

// 基础样式对象
const baseStyles = reactive({
  padding: '20px',
  margin: '10px',
  borderRadius: '8px'
})

// 动画样式
const shouldFadeIn = ref(false)
const shouldSlideUp = ref(false)
const shouldBounce = ref(false)

const animationStyles = computed(() => ({
  animationDuration: '0.3s',
  animationTimingFunction: 'ease-in-out',
  animationFillMode: 'both'
}))

// 条件样式计算
const conditionalClass = computed(() => {
  if (isLoading.value) return 'loading'
  if (hasError.value) return 'error'
  if (isActive.value) return 'success'
  return 'default'
})

// 方法
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

const updatePosition = (x, y) => {
  offsetX.value = x
  offsetY.value = y
}

const triggerAnimation = (type) => {
  // 重置所有动画
  shouldFadeIn.value = false
  shouldSlideUp.value = false
  shouldBounce.value = false

  // 触发指定动画
  setTimeout(() => {
    switch (type) {
      case 'fade':
        shouldFadeIn.value = true
        break
      case 'slide':
        shouldSlideUp.value = true
        break
      case 'bounce':
        shouldBounce.value = true
        break
    }
  }, 50)
}

// 高级样式绑定示例
const createDynamicStyles = (config) => {
  return computed(() => {
    const styles = {}

    // 根据配置生成样式
    if (config.gradient) {
      styles.background = `linear-gradient(${config.gradient.direction}, ${config.gradient.colors.join(', ')})`
    }

    if (config.shadow) {
      styles.boxShadow = `${config.shadow.x}px ${config.shadow.y}px ${config.shadow.blur}px ${config.shadow.color}`
    }

    if (config.transform) {
      const transforms = []
      if (config.transform.scale) transforms.push(`scale(${config.transform.scale})`)
      if (config.transform.rotate) transforms.push(`rotate(${config.transform.rotate}deg)`)
      if (transforms.length) styles.transform = transforms.join(' ')
    }

    return styles
  })
}

// 使用动态样式
const dynamicConfig = reactive({
  gradient: {
    direction: '45deg',
    colors: ['#ff6b6b', '#4ecdc4']
  },
  shadow: {
    x: 0,
    y: 4,
    blur: 8,
    color: 'rgba(0,0,0,0.1)'
  },
  transform: {
    scale: 1,
    rotate: 0
  }
})

const dynamicStyles = createDynamicStyles(dynamicConfig)

// CSS-in-JS 样式生成
const generateUtilityClasses = (utilities) => {
  return Object.entries(utilities).map(([key, value]) => {
    if (value) return `u-${key}`
    return null
  }).filter(Boolean)
}

const utilities = reactive({
  'text-center': true,
  'margin-auto': false,
  'full-width': true,
  'shadow-lg': false
})

const utilityClasses = computed(() => generateUtilityClasses(utilities))

// 监听样式变化
watch([textColor, fontSize], ([newColor, newSize], [oldColor, oldSize]) => {
  console.log('样式发生变化:', {
    color: { old: oldColor, new: newColor },
    size: { old: oldSize, new: newSize }
  })
})

// 生命周期中的样式初始化
onMounted(() => {
  // 初始化动画
  setTimeout(() => {
    shouldFadeIn.value = true
  }, 500)

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    // 触发响应式样式重新计算
    // Vue的响应式系统会自动处理
  })
})
</script>

<style scoped>
/* 基础样式类 */
.base-component {
  transition: all 0.3s ease;
}

.active {
  border: 2px solid #007bff;
  background-color: #e7f3ff;
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.has-error {
  border-color: #dc3545;
  background-color: #f8d7da;
}

/* 主题样式 */
.theme-light {
  --primary-color: #007bff;
  --background-color: #ffffff;
  --text-color: #333333;
}

.theme-dark {
  --primary-color: #0d6efd;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}

/* 响应式样式 */
.responsive-component.mobile {
  flex-direction: column;
}

.responsive-component.tablet {
  flex-direction: row;
  flex-wrap: wrap;
}

.responsive-component.desktop {
  flex-direction: row;
  flex-wrap: nowrap;
}

/* 动画样式 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

.bounce {
  animation: bounce 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-10px); }
  70% { transform: translateY(-5px); }
  90% { transform: translateY(-2px); }
}

/* 工具类 */
.u-text-center { text-align: center; }
.u-margin-auto { margin: 0 auto; }
.u-full-width { width: 100%; }
.u-shadow-lg { box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
</style>
```

**使用场景对比：**

| 绑定方式 | 适用场景 | 优势 |
|----------|----------|------|
| 对象语法 | 条件性类名 | 清晰的条件逻辑 |
| 数组语法 | 多个固定类名 | 简洁的语法 |
| 混合语法 | 复杂的类名逻辑 | 灵活性最高 |
| 计算属性 | 复杂的样式计算 | 缓存和响应式 |
| 方法调用 | 动态样式生成 | 最大的灵活性 |

**性能优化建议：**
```javascript
// ✅ 推荐：使用计算属性缓存复杂计算
const complexClasses = computed(() => {
  // 复杂的类名计算逻辑
  return calculateClasses(props, state)
})

// ❌ 避免：在模板中进行复杂计算
// <div :class="calculateClasses(props, state)">

// ✅ 推荐：合理使用CSS变量
const dynamicStyles = computed(() => ({
  '--primary-color': primaryColor.value,
  '--font-size': fontSize.value + 'px'
}))

// ✅ 推荐：避免频繁的样式对象创建
const memoizedStyles = computed(() => ({
  color: textColor.value,
  fontSize: fontSize.value + 'px'
}))
```

**记忆要点总结：**
- **class绑定**：对象语法（条件）、数组语法（多值）、混合语法（灵活）
- **style绑定**：对象语法（属性值）、数组语法（多对象）、CSS变量
- **计算属性**：缓存复杂的样式计算，提供响应式更新
- **性能优化**：避免模板中复杂计算，合理使用CSS变量
- **最佳实践**：语义化类名、响应式设计、动画过渡、主题系统

---

**组件的 `emits` 选项有什么作用？**

用于接收父组件传递的事件方法，以数组的方式接收多个，返回一个emit可以在事件执行时调用

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3组件事件系统的声明机制，面试官想了解你是否理解emits的作用和正确的事件处理方式。

**技术错误纠正：**
1. 概念理解错误：emits不是"接收父组件传递的事件方法"，而是声明组件可以触发的事件
2. 原答案混淆了props和emits的概念
3. 缺少事件验证和TypeScript支持的说明

**知识点系统梳理：**

**emits选项的作用：**
- 声明组件可以触发的自定义事件
- 提供事件参数验证
- 改善开发体验和IDE支持
- 与TypeScript集成提供类型安全

**声明方式：**
- 数组形式：简单事件名列表
- 对象形式：带验证函数的事件声明
- TypeScript形式：类型安全的事件声明

**实战应用举例：**
```javascript
// 1. 基础的emits声明
<template>
  <div class="custom-button">
    <button @click="handleClick" :disabled="disabled">
      <slot>{{ label }}</slot>
    </button>
  </div>
</template>

<script setup>
// 数组形式 - 简单声明
const emit = defineEmits(['click', 'focus', 'blur'])

const props = defineProps({
  label: String,
  disabled: Boolean
})

const handleClick = (event) => {
  if (!props.disabled) {
    // 触发自定义事件
    emit('click', {
      originalEvent: event,
      timestamp: Date.now(),
      buttonLabel: props.label
    })
  }
}
</script>

// 2. 对象形式 - 带验证
<script setup>
// 对象形式 - 带验证函数
const emit = defineEmits({
  // 无验证的事件
  click: null,

  // 带验证的事件
  'update:value': (value) => {
    // 验证value是否为字符串且长度不超过100
    return typeof value === 'string' && value.length <= 100
  },

  // 复杂验证
  'user-action': (action, payload) => {
    const validActions = ['create', 'update', 'delete']
    return validActions.includes(action) && payload && typeof payload === 'object'
  },

  // 数值验证
  'range-change': (min, max) => {
    return typeof min === 'number' &&
           typeof max === 'number' &&
           min >= 0 &&
           max <= 100 &&
           min < max
  }
})

const updateValue = (newValue) => {
  // 验证通过才会触发事件
  emit('update:value', newValue)
}

const handleUserAction = (action, data) => {
  emit('user-action', action, data)
}
</script>

// 3. TypeScript支持
<script setup lang="ts">
// TypeScript接口定义
interface EmitEvents {
  (e: 'click', payload: { id: number; name: string }): void
  (e: 'update:value', value: string): void
  (e: 'change', oldValue: string, newValue: string): void
  (e: 'error', error: Error): void
}

const emit = defineEmits<EmitEvents>()

// 类型安全的事件触发
const handleClick = () => {
  emit('click', { id: 1, name: 'test' }) // ✅ 类型正确
  // emit('click', 'invalid') // ❌ TypeScript错误
}

const updateValue = (value: string) => {
  emit('update:value', value)
}
</script>

// 4. v-model的实现
<template>
  <div class="custom-input">
    <input
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  placeholder: String
})

// v-model需要的事件
const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  // 触发v-model更新
  emit('update:modelValue', event.target.value)
}

const handleBlur = () => {
  // 可以触发其他事件
  emit('blur')
}
</script>

// 使用组件
<template>
  <CustomInput v-model="inputValue" @blur="handleBlur" />
</template>

// 5. 多个v-model
<template>
  <div class="user-form">
    <input
      :value="name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="姓名"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="邮箱"
    />
    <input
      type="number"
      :value="age"
      @input="$emit('update:age', parseInt($event.target.value))"
      placeholder="年龄"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  email: String,
  age: Number
})

const emit = defineEmits({
  'update:name': (value) => typeof value === 'string',
  'update:email': (value) => typeof value === 'string' && value.includes('@'),
  'update:age': (value) => typeof value === 'number' && value >= 0 && value <= 150
})
</script>

// 使用多个v-model
<template>
  <UserForm
    v-model:name="user.name"
    v-model:email="user.email"
    v-model:age="user.age"
  />
</template>

// 6. 事件修饰符的处理
<template>
  <div class="custom-input">
    <input
      :value="modelValue"
      @input="handleInput"
      @keyup.enter="handleEnter"
      @keyup.esc="handleEscape"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'enter', 'escape'])

const handleInput = (event) => {
  let value = event.target.value

  // 处理修饰符
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }

  if (props.modelModifiers.trim) {
    value = value.trim()
  }

  emit('update:modelValue', value)
}

const handleEnter = () => {
  emit('enter')
}

const handleEscape = () => {
  emit('escape')
}
</script>

// 使用修饰符
<template>
  <CustomInput
    v-model.capitalize.trim="inputValue"
    @enter="handleEnter"
    @escape="handleEscape"
  />
</template>

// 7. 复杂组件的事件管理
<template>
  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            <button @click="handleSort(column.key)">
              {{ column.title }}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          :key="item.id"
          @click="handleRowClick(item)"
          @dblclick="handleRowDoubleClick(item)"
        >
          <td v-for="column in columns" :key="column.key">
            {{ item[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Array,
  columns: Array
})

const emit = defineEmits({
  // 排序事件
  'sort-change': (column, direction) => {
    return typeof column === 'string' && ['asc', 'desc'].includes(direction)
  },

  // 行选择事件
  'row-click': (item) => item && typeof item === 'object',
  'row-double-click': (item) => item && typeof item === 'object',

  // 选择事件
  'selection-change': (selectedItems) => Array.isArray(selectedItems),

  // 分页事件
  'page-change': (page) => typeof page === 'number' && page > 0,
  'page-size-change': (size) => typeof size === 'number' && size > 0
})

const currentSort = ref({ column: null, direction: 'asc' })

const handleSort = (column) => {
  if (currentSort.value.column === column) {
    currentSort.value.direction = currentSort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort.value = { column, direction: 'asc' }
  }

  emit('sort-change', column, currentSort.value.direction)
}

const handleRowClick = (item) => {
  emit('row-click', item)
}

const handleRowDoubleClick = (item) => {
  emit('row-double-click', item)
}
</script>

// 8. 事件的异步处理
<script setup>
const emit = defineEmits(['async-action', 'loading-change', 'error'])

const handleAsyncAction = async (actionType, payload) => {
  try {
    emit('loading-change', true)

    // 触发异步事件
    emit('async-action', actionType, payload)

    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000))

  } catch (error) {
    emit('error', error)
  } finally {
    emit('loading-change', false)
  }
}
</script>

// 9. 事件的条件触发
<script setup>
const props = defineProps({
  disabled: Boolean,
  readonly: Boolean
})

const emit = defineEmits(['change', 'focus', 'blur'])

const handleChange = (value) => {
  // 只在非禁用和非只读状态下触发事件
  if (!props.disabled && !props.readonly) {
    emit('change', value)
  }
}
</script>

// 10. 调试和开发工具
<script setup>
const emit = defineEmits(['debug-event'])

// 开发环境下的事件调试
const debugEmit = (eventName, ...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Event] ${eventName}:`, args)
  }
  emit(eventName, ...args)
}

// 使用调试版本的emit
const handleAction = () => {
  debugEmit('debug-event', { action: 'test', timestamp: Date.now() })
}
</script>
```

**使用场景对比：**

| 声明方式 | 适用场景 | 优势 |
|----------|----------|------|
| 数组形式 | 简单事件声明 | 语法简洁 |
| 对象形式 | 需要参数验证 | 运行时验证 |
| TypeScript形式 | 类型安全要求 | 编译时检查 |

**最佳实践：**
```javascript
// ✅ 推荐：清晰的事件命名
const emit = defineEmits([
  'user-login',      // 动词-名词
  'data-loaded',     // 状态变化
  'form-submitted'   // 动作完成
])

// ❌ 避免：模糊的事件名
const emit = defineEmits([
  'action',          // 太模糊
  'handle',          // 不清楚
  'do'              // 无意义
])

// ✅ 推荐：提供有用的事件数据
emit('user-login', {
  user: userInfo,
  timestamp: Date.now(),
  method: 'password'
})

// ❌ 避免：无用的事件数据
emit('user-login', true)
```

**记忆要点总结：**
- **作用**：声明组件可触发的事件，提供验证和类型支持
- **声明方式**：数组（简单）、对象（验证）、TypeScript（类型安全）
- **事件触发**：使用emit函数，可传递参数和载荷
- **v-model**：通过update:propName事件实现双向绑定
- **最佳实践**：清晰命名、参数验证、类型安全、调试支持

---

**如何在 Vue 3 中使用 TypeScript 定义组件 props？**

使用defineComponent 或者 defineProps

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3与TypeScript的集成使用，面试官想了解你是否掌握类型安全的组件开发方式。

**技术错误纠正：**
1. 原答案过于简单，没有说明具体的使用方式
2. 缺少类型定义的最佳实践和高级用法
3. 没有涵盖不同场景下的类型定义方法

**知识点系统梳理：**

**TypeScript中props定义方式：**
- 运行时声明：defineProps with runtime declaration
- 类型声明：defineProps with type-only declaration
- 接口定义：使用interface定义props类型
- 默认值处理：withDefaults的使用

**实战应用举例：**
```typescript
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
```typescript
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
```typescript
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

**记忆要点总结：**
- **类型声明**：defineProps<Interface>() 提供编译时类型检查
- **默认值**：withDefaults() 为可选属性提供默认值
- **复杂类型**：使用interface、type、泛型定义复杂结构
- **工具类型**：Partial、Pick、Omit、Record等提供类型变换
- **最佳实践**：类型优先、接口复用、全局类型声明

---

**`watch` 的 `immediate` 与 `deep` 选项分别做什么？**

immediate 是监听ref getter 数组的第一次时立即执行一次，此时的oldValue为undefined

deep时监听reactive 内嵌套属性的变化，也发生响应

## 深度分析与补充

**问题本质解读：** 这道题考察Vue 3 watch API的配置选项，面试官想了解你是否理解不同监听模式的使用场景和性能影响。

**技术错误纠正：**
1. "监听ref getter 数组"表述不准确，immediate是指组件创建时立即执行监听回调
2. 原答案缺少具体的使用场景和注意事项
3. 没有说明这些选项的性能影响和最佳实践

**知识点系统梳理：**

**immediate选项：**
- 作用：组件创建时立即执行一次监听回调
- 场景：需要在组件初始化时就执行逻辑
- 注意：首次执行时oldValue为undefined

**deep选项：**
- 作用：深度监听对象内部属性的变化
- 场景：监听复杂对象或数组的内部变化
- 注意：会影响性能，谨慎使用

**实战应用举例：**
```javascript
import { ref, reactive, watch, computed } from 'vue'

// 1. immediate选项的基础使用
const count = ref(0)

// 立即执行的监听器
watch(count, (newValue, oldValue) => {
  console.log('Count changed:', { newValue, oldValue })
  // 首次执行时：newValue = 0, oldValue = undefined
}, { immediate: true })

// 2. deep选项的基础使用
const user = reactive({
  name: 'John',
  profile: {
    age: 25,
    address: {
      city: 'Beijing',
      street: 'Main St'
    }
  },
  hobbies: ['reading', 'coding']
})

// 深度监听对象
watch(user, (newValue, oldValue) => {
  console.log('User object changed:', newValue)
  // 注意：newValue和oldValue在深度监听中通常是同一个对象
}, { deep: true })

// 3. 组合使用immediate和deep
const settings = reactive({
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: false
  }
})

watch(settings, (newSettings) => {
  // 组件创建时立即执行，并且深度监听所有属性变化
  console.log('Settings updated:', newSettings)

  // 保存到localStorage
  localStorage.setItem('userSettings', JSON.stringify(newSettings))
}, {
  immediate: true,  // 组件创建时立即保存当前设置
  deep: true        // 监听所有嵌套属性变化
})

// 4. 性能优化：选择性深度监听
const largeObject = reactive({
  data: new Array(1000).fill(null).map((_, i) => ({ id: i, value: Math.random() })),
  config: {
    pageSize: 10,
    sortBy: 'id',
    filters: {}
  }
})

// ❌ 避免：监听整个大对象
// watch(largeObject, callback, { deep: true }) // 性能差

// ✅ 推荐：只监听需要的部分
watch(() => largeObject.config, (newConfig) => {
  console.log('Config changed:', newConfig)
}, { deep: true })

// 5. 监听数组变化
const items = ref([
  { id: 1, name: 'Item 1', completed: false },
  { id: 2, name: 'Item 2', completed: true }
])

// 监听数组内容变化
watch(items, (newItems) => {
  console.log('Items changed:', newItems)

  // 计算完成的任务数量
  const completedCount = newItems.filter(item => item.completed).length
  console.log('Completed tasks:', completedCount)
}, { deep: true })

// 6. 表单验证示例
const formData = reactive({
  username: '',
  email: '',
  profile: {
    firstName: '',
    lastName: ''
  }
})

const validationErrors = ref({})

// 实时表单验证
watch(formData, (newFormData) => {
  const errors = {}

  if (!newFormData.username) {
    errors.username = '用户名不能为空'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!newFormData.email) {
    errors.email = '邮箱不能为空'
  } else if (!emailRegex.test(newFormData.email)) {
    errors.email = '邮箱格式不正确'
  }

  validationErrors.value = errors
}, {
  deep: true,      // 监听所有字段变化
  immediate: true  // 立即验证初始状态
})
```

**使用场景对比：**

| 选项 | 使用场景 | 性能影响 | 注意事项 |
|------|----------|----------|----------|
| immediate: true | 初始化逻辑、数据预处理 | 无 | oldValue为undefined |
| deep: true | 复杂对象监听 | 高 | 谨慎使用，考虑性能 |
| 组合使用 | 表单验证、设置保存 | 中等 | 平衡功能和性能 |

**性能优化建议：**
```javascript
// ❌ 避免：监听大对象的深层变化
watch(massiveObject, callback, { deep: true })

// ✅ 推荐：监听特定属性
watch(() => massiveObject.specificProperty, callback)

// ✅ 推荐：使用计算属性缓存
const specificData = computed(() => massiveObject.specificProperty)
watch(specificData, callback)
```

**记忆要点总结：**
- **immediate: true**：组件创建时立即执行，首次oldValue为undefined
- **deep: true**：深度监听对象内部属性，会影响性能
- **性能考虑**：deep选项谨慎使用，优先监听特定属性
- **组合使用**：适合表单验证、设置保存等场景
- **最佳实践**：按需选择选项，使用防抖优化，监控性能影响

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
