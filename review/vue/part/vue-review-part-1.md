**1.** Vue 2 和 Vue 3 的主要区别有哪些？

- vue2 和 vue3的底层实现方式不同，vue2为兼顾老版本浏览器采用 Object.definePrototype 的方式对数据进行geter/setter ,需要使用 vue.set的方式来更新数据。相比Vue3 采用ES6中的Proxy对数据做响应式，通过track和tigger来对数据的读取，写入，删除，不存在数据访问等做监听完成响应式操作。
- 生命周期不同，在vue2版本中 有beforeCreate和create 和 destroy等生命周期，在vue3中使用 setup 和 onUnMounted代替
- vue3新增了组合式API 选项式API的写法和组合式函数
- Vue3 支持typescript
- vue3 新增了Teleport Suspense Transiion等内置组件
- vue3 新增tree-Sharking 更小的包体积和运行速度
- vue3 支持多根节点
- vue3 新增v-model 数据双向绑定

---

## 1. Vue 2 vs Vue 3 ⭐⭐⭐ 🔥

### 原始答案
- vue2 和 vue3的底层实现方式不同，vue2为兼顾老版本浏览器采用 Object.definePrototype 的方式对数据进行geter/setter ,需要使用 vue.set的方式来更新数据。相比Vue3 采用ES6中的Proxy对数据做响应式，通过track和tigger来对数据的读取，写入，删除，不存在数据访问等做监听完成响应式操作。
- 生命周期不同，在vue2版本中 有beforeCreate和create 和 destroy等生命周期，在vue3中使用 setup 和 onUnMounted代替
- vue3新增了组合式API 选项式API的写法和组合式函数
- Vue3 支持typescript
- vue3 新增了Teleport Suspense Transiion等内置组件
- vue3 新增tree-Sharking 更小的包体积和运行速度
- vue3 支持多根节点
- vue3 新增v-model 数据双向绑定

---

### 📊 技术点评

#### 🎯 核心考点
- 响应式实现差异（Proxy vs Object.defineProperty）
- Composition API 与 Options API 演进
- 编译&运行时性能优化（Tree-shaking、多根、TS）
- 面试意图：评估迁移经验、底层理解和性能思维

#### ✅ 正确答案/参考答案
- Vue2 基于 Object.defineProperty，需 Vue.set 处理新增属性；Vue3 基于 Proxy，可监听增删、数组索引等
- Vue3 增加 Composition API，保留 Options API，生命周期新增 setup、onBeforeUnmount 等组合式钩子
- Vue3 支持 Fragment、多 v-model、Teleport、Suspense，打包 Tree-shaking 更好、TS 体验提升

#### 💼 实际应用场景
1. 旧项目升级评估、迁移策略制定
2. 新项目技术选型、性能预算
3. 跨版本库兼容性检查

#### ⚠️ 技术纠正（如有）
❌ **错误示例：** 生命周期“setup 和 onUnmounted 代替 beforeCreate/created”

✅ **正确示例：** Vue3 仍保留 beforeCreate/created，新增 setup 并推荐组合式写法

**问题说明：** 混淆了组合式 API 与生命周期，可能在迁移时遗漏钩子导致逻辑缺失。

#### 🔗 知识关联
- 所属模块：响应式系统、编译优化、组件化
- 相关知识点：Fragment、多 v-model、Teleport/Suspense
- 前置要求：熟悉 Vue2 选项式 API

#### 💡 实战示例（重点题目）
```vue
<template>
  <section>
    <p>用户名：{{ user.name }}</p>
    <button @click="increment">点击 {{ count }}</button>
    <Child v-model:title="title" />
  </section>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import Child from './Child.vue'

const state = reactive({ visits: 1 })
const user = reactive({ name: 'Vue3' })
const count = computed(() => state.visits * 2)
const title = ref('hello')
const increment = () => { state.visits++ }
</script>
<style scoped>
section { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
button { margin-top: 8px; }
</style>
```
**最佳实践：**
- 迁移时优先改写成组合式 API 方便逻辑拆分
- 利用多根节点减少无意义包裹元素

#### 📈 面试延伸
- 追问 Proxy 相较 defineProperty 具体解决的痛点（数组变更、动态键）
- 询问迁移过程中 tree-shaking、按需加载、类型改造的实战经验

#### 📝 记忆要点
- **响应式升级**：Proxy、可监听新增/删除
- **性能**：编译缓存 + Tree-shaking
- **API 形态**：Options→Composition
- **新内置**：Teleport/Suspense/Fragment

#### ✅ 快速自测
- [ ] Proxy 相较 defineProperty 解决了哪些问题？
- [ ] Vue3 如何支持多 v-model？

---

**2.** 什么是 `ref`，与 `reactive` 的区别是什么？

- ref是vue中可以定义响应式数据的函数。通常用于将原始类型数据转为响应式对象。在javascript中可以通过访问响应式对象的.value 访问到其真值。也可以传入非原始类型数据，但是在其内部使用reactive来对非原始类型数据进行包装。在模版中可以自动解包。
- reactive同样是用于定义响应式数据的函数，但与ref不同的是他用于包装非原始类型数据。返回对象同样具有响应式。可以直接通过对象访问其真实值。

---

## 2. ref 与 reactive ⭐⭐ 🔥

### 原始答案
- ref是vue中可以定义响应式数据的函数。通常用于将原始类型数据转为响应式对象。在javascript中可以通过访问响应式对象的.value 访问到其真值。也可以传入非原始类型数据，但是在其内部使用reactive来对非原始类型数据进行包装。在模版中可以自动解包。
- reactive同样是用于定义响应式数据的函数，但与ref不同的是他用于包装非原始类型数据。返回对象同样具有响应式。可以直接通过对象访问其真实值。

---

### 📊 技术点评

#### 🎯 核心考点
- 基本类型与对象类型的响应式封装
- 模板自动解包 vs JS 中 .value 访问
- 解构丢失响应性与 toRefs
- 面试意图：考察响应式 API 选型与踩坑经验

#### ✅ 正确答案/参考答案
- `ref` 适合基本类型或需要整体替换的引用；在 JS 中通过 `.value` 访问，在模板中自动解包
- `reactive` 适合对象/数组，直接访问属性；解构后需 `toRefs` 保持响应
- 需要整体替换对象时，用 `ref` 包装对象比 `reactive` 直接替换更安全

#### 💼 实际应用场景
1. 表单字段（字符串/数字）与复杂表单对象并存
2. 定时器/异步状态（loading/error）管理
3. 组件对外暴露的简单状态与内部复合状态

#### ⚠️ 技术纠正（如有）
- ref 包装对象只有引用替换才会触发；reactive 不适合整体替换

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：toRef/toRefs、shallowRef、readonly
- 前置要求：ES Proxy/引用类型基础

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <input v-model="name" placeholder="姓名" />
    <input type="number" v-model.number="profile.age" placeholder="年龄" />
    <p>{{ greeting }}</p>
    <button @click="replaceProfile">替换对象</button>
  </div>
</template>
<script setup>
import { ref, reactive, computed, toRefs } from 'vue'

const name = ref('Alice')
const profile = reactive({ age: 18, city: 'SZ' })
const { age } = toRefs(profile)
const greeting = computed(() => `${name.value} - ${age.value}岁`)
const replaceProfile = () => { Object.assign(profile, { age: 20, city: 'SH' }) }
</script>
```
**最佳实践：**
- 基本类型优先 ref，对象优先 reactive，解构后用 toRefs
- 需要整体替换的复杂数据用 ref 包装对象

#### 📈 面试延伸
- 追问 shallowRef/triggerRef 在大数据或第三方实例场景的使用
- 询问解构丢失响应性的源码原因（Ref unwrap、Proxy unwrap）

#### 📝 记忆要点
- **ref**：.value，基本类型
- **reactive**：对象直接用
- **toRefs**：解构保持响应
- **ref 包装对象**：替换引用

#### ✅ 快速自测
- [ ] 何时选择 ref 包装对象而非 reactive？
- [ ] reactive 整体替换为何丢响应？

---

**3.** 如何创建一个计算属性（computed）？它与普通函数有什么区别？

- 计算属性默认通过一个getter()函数来根据内部响应式值的变化自动更新其结果，返回一个ref类型的值。也可以为其设置get/set函数。set函数可以改变对应的响应式数
- 与普通函数不同的是：
  1. 计算属性可以缓存计算值，在响应式数据没有发生改变时其计算结果不改变且不用重复计算。
  2. 计算属性只能是同步的，不可以执行异步操作
  3. 计算属性根据响应式值的变化自动计算结果并返回一个ref类型的值

---

## 3. 计算属性 ⭐⭐ 💡

### 原始答案
- 计算属性默认通过一个getter()函数来根据内部响应式值的变化自动更新其结果，返回一个ref类型的值。也可以为其设置get/set函数。set函数可以改变对应的响应式数
- 与普通函数不同的是：
  1. 计算属性可以缓存计算值，在响应式数据没有发生改变时其计算结果不改变且不用重复计算。
  2. 计算属性只能是同步的，不可以执行异步操作
  3. 计算属性根据响应式值的变化自动计算结果并返回一个ref类型的值

---

### 📊 技术点评

#### 🎯 核心考点
- computed 懒执行与缓存
- getter/setter 可读写场景
- 与 methods 的职责差异
- 面试意图：区分派生状态与副作用的能力

#### ✅ 正确答案/参考答案
- `computed(fn)` 创建只读计算属性，依赖变更才重新计算；返回 ref
- `computed({get,set})` 支持双向派生，set 用于反向写入依赖
- 与普通函数不同：有缓存、依赖驱动、必须同步、适合派生值

#### 💼 实际应用场景
1. 价格/折扣等派生数据计算
2. 表单校验状态聚合
3. 复杂筛选结果缓存

#### ⚠️ 技术纠正（如有）
- 异步请用 watch / async computed 库

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：watch、watchEffect、memoization
- 前置要求：ref/reactive 基础

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <input v-model.number="price" type="number" />
    <input v-model.number="count" type="number" />
    <p>总价（含税）：{{ total }}</p>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const price = ref(100)
const count = ref(2)
const total = computed({
  get: () => (price.value * count.value * 1.06).toFixed(2),
  set(val) { count.value = Math.max(1, Math.floor(val / price.value)) },
})
</script>
```
**最佳实践：**
- 纯派生逻辑用 computed，副作用用 watch
- 需要双向派生时使用 getter/setter

#### 📈 面试延伸
- 询问 computed 缓存失效的边界（含可变引用依赖）
- 追问 watchEffect 与 computed 的性能/语义差异

#### 📝 记忆要点
- **缓存**：依赖不变不重新算
- **同步**：不处理异步
- **可写**：get/set 支持双向

#### ✅ 快速自测
- [ ] 何时用 computed 而非 method？
- [ ] computed 中写异步会怎样？

---

**4.** `setup()` 的执行时机是什么？能访问 `this` 吗？

- setup() 执行在初始化构建期间，此时DOM还没有构建，props刚传入。这个期间在执行数据的初始化状态设置。
- 不能访问this，因为dom还没有构建

---

## 4. setup 执行时机 ⭐⭐ 🔥

### 原始答案
- setup() 执行在初始化构建期间，此时DOM还没有构建，props刚传入。这个期间在执行数据的初始化状态设置。
- 不能访问this，因为dom还没有构建

---

### 📊 技术点评

#### 🎯 核心考点
- setup 调用顺序与实例创建时机
- this 不可用的真实原因
- props/context 获取方式
- 面试意图：检查对组合式 API 生命周期的认知

#### ✅ 正确答案/参考答案
- setup 在组件实例创建前、beforeCreate 之前执行，props 已解析
- setup 内没有 this（实例未创建），需要通过参数获取 props/emit/attrs/slots/expose
- DOM 访问需放在 onMounted 或 nextTick

#### 💼 实际应用场景
1. 组合式函数初始化、注入依赖
2. SSR 中避免访问 window/DOM
3. 提前注册副作用（watch/onMounted 等）

#### ⚠️ 技术纠正（如有）
❌ “不能访问 this 因为 DOM 未构建”

✅ 实例未创建，与 DOM 无关

#### 🔗 知识关联
- 所属模块：Composition API、生命周期
- 相关知识点：beforeCreate/created、expose、context 参数
- 前置要求：组件实例化流程

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <p>props.title: {{ props.title }}</p>
    <button @click="emitSave">保存</button>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'

const props = defineProps({ title: { type: String, default: 'Demo' } })
const emit = defineEmits(['save'])
const emitSave = () => emit('save', Date.now())

onMounted(() => {
  console.log('mounted with title', props.title)
})
</script>
```
**最佳实践：**
- 所有需要的实例能力通过 setup 参数获取
- DOM 操作放在 onMounted/nextTick 中

#### 📈 面试延伸
- 追问 setup 在 SSR 中的行为以及何时执行
- 询问 defineExpose 的作用与默认暴露差异

#### 📝 记忆要点
- **时机**：beforeCreate 之前
- **无 this**：实例未创建
- **入口**：props/context 作为参数

#### ✅ 快速自测
- [ ] setup 中能否访问 attrs/slots？如何获取？
- [ ] setup 和 beforeCreate 谁先执行？

---

**5.** 如何在 `<script setup>` 中定义 props 和 emits？

- defineProps() 宏
- defineEmits() 宏

---

## 5. <script setup> 定义 props/emits ⭐⭐ 💡

### 原始答案
- defineProps() 宏
- defineEmits() 宏

---

### 📊 技术点评

#### 🎯 核心考点
- 编译时宏用法与类型推断
- emits 显式声明的好处
- 面试意图：检查是否熟悉 script setup 规范与类型约束

#### ✅ 正确答案/参考答案
- `const props = defineProps({...})` 顶层调用，返回响应式只读对象；可声明类型/默认值/验证
- `const emit = defineEmits(['event'] | { event: (payload)=>boolean })` 顶层调用，限制可触发的事件
- 宏在编译期消除，不能放在条件或函数内

#### 💼 实际应用场景
1. TypeScript 组件签名声明
2. IDE 自动补全、事件校验

#### ⚠️ 技术纠正（如有）
- 宏必须顶层调用；emits 声明可校验事件名与参数

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：defineExpose、emits 选项、TS 类型推断
- 前置要求：SFC 编译流程

#### 💡 实战示例（重点题目）
未提供（难度中等且已有示例覆盖）

#### 📈 面试延伸
- 询问 props 默认值在 TS 下如何声明（withDefaults）
- 追问 emit 类型声明的两种写法（数组 vs 回调签名）

#### 📝 记忆要点
- **defineProps**：顶层调用，返回只读
- **defineEmits**：顶层调用，校验事件
- **类型**：配合 TS 接口/类型别名

#### ✅ 快速自测
- [ ] defineEmits 如何做参数校验？
- [ ] defineProps 返回值是否可解构？

---

**6.** `v-if` 与 `v-show` 的区别是什么？各自适用什么场景？

- v-if和v-show都是vue中的指令
- v-if 在于判断组件/标签是否存在，如果为false则不做任何事情，为true则按照正常规则创建。切换v-if的值可以造成对应组件/标签的销毁和重建，频繁切换开销比较大
- v-show 只控制对应组件/标签块的css中的display是否为none ，切换不会操成组件的销毁和重建。更适合需要频繁切换的场景

---

## 6. v-if vs v-show ⭐⭐ 🔥

### 原始答案
- v-if和v-show都是vue中的指令
- v-if 在于判断组件/标签是否存在，如果为false则不做任何事情，为true则按照正常规则创建。切换v-if的值可以造成对应组件/标签的销毁和重建，频繁切换开销比较大
- v-show 只控制对应组件/标签块的css中的display是否为none ，切换不会操成组件的销毁和重建。更适合需要频繁切换的场景

---

### 📊 技术点评

#### 🎯 核心考点
- 条件渲染 vs 条件展示
- 初始渲染与切换成本
- 生命周期触发差异
- 面试意图：考察对性能和渲染时机的判断

#### ✅ 正确答案/参考答案
- `v-if`：条件为真才创建/销毁 DOM，切换成本高但首屏成本低
- `v-show`：始终渲染，通过 display 切换，切换成本低但首屏一定渲染
- 选择依据：条件变化频率、初始渲染需求，v-show 不支持 template/v-else

#### 💼 实际应用场景
1. 权限控制视图（偶尔变化）
2. 折叠面板/弹窗频繁切换

#### ⚠️ 技术纠正（如有）
- v-show 不支持 template 和 v-else；首次渲染必创建 DOM

#### 🔗 知识关联
- 所属模块：模板指令、性能优化
- 相关知识点：lazy mount、keep-alive
- 前置要求：虚拟 DOM diff

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <ProfileCard v-if="isAdmin" />
    <Tooltip v-show="hovered" text="提示" />
    <button @click="toggle">切换</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import ProfileCard from './ProfileCard.vue'
import Tooltip from './Tooltip.vue'

const isAdmin = ref(false)
const hovered = ref(false)
const toggle = () => {
  isAdmin.value = !isAdmin.value
  hovered.value = !hovered.value
}
</script>
```
**最佳实践：**
- 频繁显隐用 v-show，懒加载/条件创建用 v-if
- 大组件首屏性能敏感时用 v-if 并配合异步组件

#### 📈 面试延伸
- 追问 keep-alive 与 v-if/v-show 的组合策略
- 询问动画/transition 与二者搭配的差异

#### 📝 记忆要点
- **创建成本**：if 懒渲染，show 立即
- **切换成本**：if 重建，show 样式切换
- **限制**：show 无 v-else/模板

#### ✅ 快速自测
- [ ] v-show 会触发生命周期吗？
- [ ] 首屏性能敏感选哪个？

---

**7.** `v-for` 上为什么需要 `key`？如何选择合适的 key？

- key用于标记vDOM结构的item，在diff过程中用于判断是哪些组件在更新和变动，只针对变更的部分做更新。
- key用于标记子组件唯一身份，建议是唯一id值，可以是string和number

---

## 7. v-for 的 key ⭐⭐ 🔥

### 原始答案
- key用于标记vDOM结构的item，在diff过程中用于判断是哪些组件在更新和变动，只针对变更的部分做更新。
- key用于标记子组件唯一身份，建议是唯一id值，可以是string和number

---

### 📊 技术点评

#### 🎯 核心考点
- Diff 过程中节点复用与状态错位
- key 选择策略（稳定唯一）
- 面试意图：排查候选人是否理解虚拟 DOM 复用机制

#### ✅ 正确答案/参考答案
- key 用于标识同级节点，帮助 diff 准确复用/移动节点，避免状态错位
- 优先使用业务唯一 id（字符串/数字），不要用随机数或可变 index
- 在多根/动态组件也需配合 key 以确保稳定

#### 💼 实际应用场景
1. 表格/列表行的增删改
2. 表单列表（避免输入框错位）

#### ⚠️ 技术纠正（如有）
- 避免 index 作为 key 在可变列表中引发状态串行

#### 🔗 知识关联
- 所属模块：模板指令、虚拟 DOM
- 相关知识点：patch 算法、fragment
- 前置要求：Diff 原理

#### 💡 实战示例（重点题目）
```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <input v-model="item.name" />
      <button @click="remove(item.id)">删除</button>
    </li>
  </ul>
</template>
<script setup>
import { reactive } from 'vue'

const items = reactive([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
])
const remove = (id) => {
  const idx = items.findIndex(i => i.id === id)
  if (idx > -1) items.splice(idx, 1)
}
</script>
```
**最佳实践：**
- key 使用稳定业务 id，避免 index
- 同级唯一，避免复用导致状态串行

#### 📈 面试延伸
- 追问 Vue diff 与 React diff 在 key 处理上的差异
- 询问 keyed/非 keyed 列表在性能与正确性上的取舍

#### 📝 记忆要点
- **唯一稳定**：业务 id 优先
- **防错位**：避免 index
- **同级生效**：跨层无效

#### ✅ 快速自测
- [ ] 为什么 index 会导致输入框错乱？
- [ ] key 作用于哪些节点范围？

---

**8.** Vue 中的单向数据流是什么意思？

- 是指数据由父组件传递到子组件时，禁止子组件直接修改props数据。而是由子组件触发事件更新，父组件中做数据处理，更新数据后重新将数据传入到子组件中触发渲染更新。

---

## 8. 单向数据流 ⭐⭐ 💡

### 原始答案
- 是指数据由父组件传递到子组件时，禁止子组件直接修改props数据。而是由子组件触发事件更新，父组件中做数据处理，更新数据后重新将数据传入到子组件中触发渲染更新。

---

### 📊 技术点评

#### 🎯 核心考点
- 数据流向与状态归属
- 子组件禁止直接修改 props
- 面试意图：确认架构思维与可维护性意识

#### ✅ 正确答案/参考答案
- 父组件持有源数据，子组件通过 props 接收，禁止直接改 props
- 子组件通过 emit/v-model 通知父级更新，再下发到子组件
- 需要本地可变副本时拷贝到本地 state 或使用派生 computed

#### 💼 实际应用场景
1. 表单组件封装（v-model 语义）
2. 状态提升与全局状态管理

#### ⚠️ 技术纠正（如有）
- 可通过派生 computed 或拷贝本地状态避免直接修改 props

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、受控组件、不可变数据
- 前置要求：props/emit 基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问深层对象 props 的修改策略（浅拷贝/深拷贝/readonly）
- 询问在 Vuex/Pinia 下如何保持单向数据流

#### 📝 记忆要点
- **父管源**：数据归父
- **子不改**：props 只读
- **事件上行**：emit 更新

#### ✅ 快速自测
- [ ] 子组件想改 props 应怎么做？
- [ ] 单向数据流的好处？

---

**9.** 什么是 Vue 组件？如何定义一个组件？

- vue组件可以由单文件组件构成也可以是无渲染组件。
- 可以通过app.component 声明组件，被其他组件调用，可以包含内部自有的值和外部传入的属性props，通过事件响应等方式与父组件通讯

---

## 9. Vue 组件定义 ⭐⭐ 💡

### 原始答案
- vue组件可以由单文件组件构成也可以是无渲染组件。
- 可以通过app.component 声明组件，被其他组件调用，可以包含内部自有的值和外部传入的属性props，通过事件响应等方式与父组件通讯

---

### 📊 技术点评

#### 🎯 核心考点
- 组件基本概念与注册方式
- 无渲染组件/函数式组件
- 面试意图：确认组件抽象与封装意识

#### ✅ 正确答案/参考答案
- 组件是可复用的 UI 单元，通常由 SFC（template/script/style）定义，也可用 render 函数组件
- 注册方式：`app.component` 全局注册，或在局部 components 中/直接 import 使用（<script setup> 自动）
- Vue3 函数组件直接导出渲染函数，无需 functional 标记

#### 💼 实际应用场景
1. UI 原子组件、业务组件划分
2. 插件形式全局注册

#### ⚠️ 技术纠正（如有）
- Vue3 移除 functional 标记，函数式组件用普通函数返回 render

#### 🔗 知识关联
- 所属模块：组件化
- 相关知识点：SFC、全局/局部注册、异步组件
- 前置要求：模板语法

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问全局注册对打包/按需加载的影响
- 询问无渲染组件的使用场景（如 Provider、RouterView）

#### 📝 记忆要点
- **SFC**：template+script+style
- **注册**：app.component/局部 import
- **通信**：props/emit/slots

#### ✅ 快速自测
- [ ] Vue3 函数组件如何写？
- [ ] 全局注册与局部注册差异？

---

**10.** 什么是 SFC（单文件组件）？它有什么优势？

- 全称single function component，通过template script style 将组件结构 逻辑 样式集中到一起。
- 降低开发心智模型，更好的组织结构，将关注点聚焦。

---

## 10. SFC 优势 ⭐ 💡

### 原始答案
- 全称single function component，通过template script style 将组件结构 逻辑 样式集中到一起。
- 降低开发心智模型，更好的组织结构，将关注点聚焦。

---

### 📊 技术点评

#### 🎯 核心考点
- SFC 概念与编译流程
- 关注点分离与工程化
- 面试意图：考察对 Vue 工程化链路的熟悉

#### ✅ 正确答案/参考答案
- SFC = Single File Component，使用 `<template>/<script>/<style>` 同文件组织
- 编译由 @vue/compiler-sfc 处理，支持 `<script setup>`、scoped、CSS vars、预处理器
- 优点：更好的可维护性、类型支持、热更新体验

#### 💼 实际应用场景
1. 大型项目模块化开发
2. 支持语言预处理（TS/SCSS）

#### ⚠️ 技术纠正（如有）
- 补充 SFC 编译产物：渲染函数、样式 scope id、ts 转译

#### 🔗 知识关联
- 所属模块：组件化、构建工具
- 相关知识点：Vite/SFC 编译、script setup
- 前置要求：基础 HTML/CSS/JS

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 SFC 与 JSX/Render 函数的取舍
- 询问 scoped 与 CSS Modules 在 SFC 中的差异

#### 📝 记忆要点
- **一体化**：模板/逻辑/样式同文件
- **编译**：@vue/compiler-sfc
- **扩展**：lang="ts/scss" 等

#### ✅ 快速自测
- [ ] scoped 样式如何避免穿透？
- [ ] script setup 的编译优势？

---

**11.** `v-bind` 和 `v-on` 的作用分别是什么？有什么简写形式？

- v-bind 用于动态属性绑定 简写为：
- v-on 用于绑定事件 简写为@

---

## 11. v-bind 与 v-on ⭐ 💡

### 原始答案
- v-bind 用于动态属性绑定 简写为：
- v-on 用于绑定事件 简写为@

---

### 📊 技术点评

#### 🎯 核心考点
- 动态属性绑定与事件监听
- 简写语法 (:/@) 与对象绑定
- 面试意图：基础语法熟练度与批量绑定技巧

#### ✅ 正确答案/参考答案
- `v-bind` 绑定属性/props，可简写 `:`；支持对象语法（:class/:style、:="object"）
- `v-on` 绑定事件，可简写 `@`；支持对象语法、修饰符；Vue3 无 .native，需在子组件 emits 中声明或用 attrs 透传
- 可与修饰符组合（@click.stop、:class="['a',{b:bool}]")

#### 💼 实际应用场景
1. 批量传递 props/attrs
2. 事件对象与修饰符组合

#### ⚠️ 技术纠正（如有）
- Vue3 移除 .native，使用透传或显式 emit

#### 🔗 知识关联
- 所属模块：模板语法
- 相关知识点：修饰符、透传属性
- 前置要求：指令基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问事件对象/修饰符优先级，及 passive/capture 的使用场景
- 询问如何给动态组件批量绑定 attrs/事件

#### 📝 记忆要点
- **属性绑定**：v-bind 或 :
- **事件监听**：v-on 或 @
- **对象语法**：class/style/事件批量

#### ✅ 快速自测
- [ ] 如何同时绑定多个事件处理？
- [ ] v-on.native 在 Vue3 如何替换？

---

**12.** 什么是模板引用（template refs）？如何使用？

- 模版引用 可以用过定义同名响应性数据，然后通过ref绑定组件，就可以调用被绑定组件的所有实例

- ```vue
  <script>
  const chilldref = ref(null)
  </script>

  <template>
    <Child ref="childref" />
  </template>
  ```

---

## 12. 模板引用 ⭐⭐ 💡

### 原始答案
- 模版引用 可以用过定义同名响应性数据，然后通过ref绑定组件，就可以调用被绑定组件的所有实例

- ```vue
  <script>
  const chilldref = ref(null)
  </script>

  <template>
    <Child ref="childref" />
  </template>
  ```

---

### 📊 技术点评

#### 🎯 核心考点
- DOM/组件实例访问
- onMounted 后安全使用
- 面试意图：考察组件 API 暴露与封装意识

#### ✅ 正确答案/参考答案
- 在 `<script setup>` 中：`const childRef = ref(null)`；模板：`<Child ref="childRef" />`
- DOM/组件实例需在 onMounted 后访问；子组件需 `defineExpose` 才能在 script setup 暴露自定义方法
- 使用可选链避免空值；多根组件需指向具体元素

#### 💼 实际应用场景
1. 聚焦输入框、滚动控制
2. 调用子组件公开方法

#### ⚠️ 技术纠正（如有）
- 命名需一致；暴露 API 需 defineExpose

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：defineExpose、onMounted
- 前置要求：ref 基础

#### 💡 实战示例（重点题目）
未提供（相关示例已在其他题）

#### 📈 面试延伸
- 追问在 TS 下如何声明子组件实例类型
- 询问模板 ref 与 getCurrentInstance 直接访问的取舍

#### 📝 记忆要点
- **创建 ref**：const el = ref(null)
- **绑定**：ref="el"
- **访问时机**：onMounted 后

#### ✅ 快速自测
- [ ] 组件 ref 默认暴露什么？
- [ ] 如何限制对外暴露的方法？

---

**13.** Vue 3 中的 `defineProps` 和 `defineEmits` 是什么？

- defineProps 定义组件属性
- defineEmits 定义组件事件

---

## 13. defineProps & defineEmits ⭐⭐ 💡

### 原始答案
- defineProps 定义组件属性
- defineEmits 定义组件事件

---

### 📊 技术点评

#### 🎯 核心考点
- 编译宏作用与类型推断
- 事件显式声明的必要性
- 面试意图：确认 script setup 能力与类型安全意识

#### ✅ 正确答案/参考答案
- `defineProps` 顶层调用，支持类型/默认值，返回响应式只读 props
- `defineEmits` 顶层调用，声明可触发事件并可校验参数
- 仅在 `<script setup>` 使用，编译期消除

#### 💼 实际应用场景
1. TS 组件签名与 IDE 提示
2. 事件白名单控制，减少误绑

#### ⚠️ 技术纠正（如有）
- 仅可在顶层；支持回调校验函数

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：defineExpose、emits 选项、TS 接口
- 前置要求：SFC 编译

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 withDefaults 的用法与编译产物
- 询问 emits 与 attrs/fallthrough 的关系

#### 📝 记忆要点
- **顶层宏**：编译期消解
- **类型友好**：推断 props/emit 类型
- **安全**：限制可触发事件

#### ✅ 快速自测
- [ ] 如何对事件参数做类型校验？
- [ ] defineProps 的默认值写法？

---

**14.** 什么是 `v-model`？在 Vue 3 中有什么变化？

- v-model 双向数据绑定
- 本质为 v-bind:"modelValue" v-on:"update:modelValue" 的结合体
- 通常在input textArea select等组件中使用

---

## 14. v-model 原理与变化 ⭐⭐ 🔥

### 原始答案
- v-model 双向数据绑定
- 本质为 v-bind:"modelValue" v-on:"update:modelValue" 的结合体
- 通常在input textArea select等组件中使用

---

### 📊 技术点评

#### 🎯 核心考点
- 受控组件协议（modelValue/update:modelValue）
- 多 v-model 与参数修饰符
- Vue2 的 .sync 差异
- 面试意图：考察封装组件的抽象能力

#### ✅ 正确答案/参考答案
- v-model 等价于 `:modelValue="val" @update:modelValue="val=$event"`
- Vue3 支持多 v-model：`v-model:propName` 对应 `propName`/`update:propName`
- 修饰符通过 emits 回调第二参数传递（如 `emit('update:modelValue', value, { trim: true })`）

#### 💼 实际应用场景
1. 表单组件封装（输入框/选择器）
2. 支持双向绑定的复杂组件（Dialog 可见性+数据）

#### ⚠️ 技术纠正（如有）
- 必须在 emits 中声明 update 事件；多模型需匹配 prop/事件名

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、受控属性、sync 迁移
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
```vue
<template>
  <Modal v-model:visible="visible" v-model:title="title" />
  <button @click="visible = true">打开</button>
</template>
<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'

const visible = ref(false)
const title = ref('编辑用户')
</script>
```
```vue
<!-- Modal.vue -->
<template>
  <div v-if="visible" class="modal">
    <h3>{{ title }}</h3>
    <button @click="close">关闭</button>
  </div>
</template>
<script setup>
const props = defineProps({ visible: Boolean, title: String })
const emit = defineEmits(['update:visible', 'update:title'])
const close = () => emit('update:visible', false)
</script>
```
**最佳实践：**
- 封装组件时明确 model 字段名，支持多模型
- 不直接修改 props，统一用 update 事件

#### 📈 面试延伸
- 追问自定义修饰符在子组件中的获取与处理
- 询问 v-model 与受控/非受控组件的区别

#### 📝 记忆要点
- **协议**：modelValue + update:modelValue
- **多模型**：v-model:xxx
- **修饰符**：通过 emits 入参传递

#### ✅ 快速自测
- [ ] Vue3 多 v-model 如何声明 emits？
- [ ] v-model 修饰符如何在子组件拿到？

---

**15.** Vue 中如何实现条件渲染？有哪些方式？

-

---

## 15. 条件渲染方式 ⭐⭐ 📌

### 原始答案
-

---

### 📊 技术点评

#### 🎯 核心考点
- v-if/v-else-if/v-else 与 v-show
- template 条件包裹与动态组件
- 面试意图：考察对渲染性能和可读性的平衡

#### ✅ 正确答案/参考答案
- 使用 `v-if/v-else-if/v-else` 控制创建销毁，`v-show` 控制 display
- `<template v-if>` 包裹多元素；动态组件 `<component :is="">` 条件渲染不同组件
- Suspense/异步组件可用于等待数据时的占位

#### 💼 实际应用场景
1. 首屏懒加载、权限控制
2. Tab/弹窗显隐切换

#### ⚠️ 技术纠正（如有）
- v-show 不支持 template；频繁切换用 v-show

#### 🔗 知识关联
- 所属模块：模板指令
- 相关知识点：v-slot 条件、动态组件
- 前置要求：v-if/v-show 基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问何时用 Suspense/异步组件提升体验
- 询问条件渲染与 transition 的结合注意点

#### 📝 记忆要点
- **v-if 链**：条件渲染
- **v-show**：频繁切换
- **动态组件**：component is

#### ✅ 快速自测
- [ ] v-if 与 v-show 选择依据？
- [ ] template 结合 v-if 的作用？

---

**16.** 父组件如何向子组件传递数据？

- 使用绑定属性通过props向子组件传递数据
- 也可以通过provide inject的方式
- 也可以通过 eventBus的方式

---

## 16. 父传子 ⭐⭐ 💡

### 原始答案
- 使用绑定属性通过props向子组件传递数据
- 也可以通过provide inject的方式
- 也可以通过 eventBus的方式

---

### 📊 技术点评

#### 🎯 核心考点
- props 是首选通道
- provide/inject 适合跨层共享
- 面试意图：考察通信手段选择与约束

#### ✅ 正确答案/参考答案
- 父组件通过 props 向子组件下发数据，支持类型/默认值校验
- 跨多层共享用 provide/inject；全局共享用状态管理（Pinia）
- 不推荐 eventBus，新项目用 store/依赖注入

#### 💼 实际应用场景
1. 基础组件配置下发
2. 全局主题/上下文共享

#### ⚠️ 技术纠正（如有）
- eventBus 不推荐，Vue3 建议状态管理或 provide/inject

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、inject、全局状态
- 前置要求：props 定义

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 provide/inject 与全局 store 在 SSR 下的注意点
- 询问 props 深层对象的不可变策略

#### 📝 记忆要点
- **props 首选**，类型校验
- **跨级**：provide/inject
- **总线替代**：Pinia/库

#### ✅ 快速自测
- [ ] provide 的数据是响应式吗？
- [ ] props 更新如何触发子组件？

---

**17.** 子组件如何向父组件传递数据？

- 通过绑定注册事件回调的方式 emit
- 也可以通过 inject
- 也可以通过 eventBus

---

## 17. 子传父 ⭐⭐ 💡

### 原始答案
- 通过绑定注册事件回调的方式 emit
- 也可以通过 inject
- 也可以通过 eventBus

---

### 📊 技术点评

#### 🎯 核心考点
- emit 事件上行
- v-model 语法糖
- 面试意图：验证受控组件思维

#### ✅ 正确答案/参考答案
- 子组件通过 `emit('event', payload)` 通知父组件；需在 emits 声明事件
- v-model 本质是 `update:modelValue` 事件 + prop
- 不用 inject 上行；兄弟/全局用 store 或事件库

#### 💼 实际应用场景
1. 表单子项通知父级提交
2. 弹窗关闭/确认事件

#### ⚠️ 技术纠正（如有）
- inject 不用于上行；eventBus 不推荐

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits 声明、v-model
- 前置要求：事件机制

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 emit 的类型声明与参数校验
- 询问在组合式函数中如何封装 emit

#### 📝 记忆要点
- **emit**：事件上行
- **v-model**：update:modelValue
- **总线慎用**：优先状态管理

#### ✅ 快速自测
- [ ] emit 如何做类型校验？
- [ ] v-model 的事件名是什么？

---

**18.** 什么是 `provide` / `inject`？有什么使用场景？

- vue中的注入与依赖
- 祖父组件或者全局使用 provide（key，value）的方式注入，在任意子孙组件中通过 const value = inject(key)的方式接收传入的数据
- 常见场景有主题色控制、角色或者权限切换

---

## 18. provide / inject ⭐⭐ 💡

### 原始答案
- vue中的注入与依赖
- 祖父组件或者全局使用 provide（key，value）的方式注入，在任意子孙组件中通过 const value = inject(key)的方式接收传入的数据
- 常见场景有主题色控制、角色或者权限切换

---

### 📊 技术点评

#### 🎯 核心考点
- 跨层级依赖注入
- 默认值与响应式传递
- 面试意图：了解依赖注入在解耦/可测试性上的作用

#### ✅ 正确答案/参考答案
- 祖先组件 `provide(key, value)`，后代组件 `inject(key, default?)`
- 提供响应式对象时保持引用；可用 readonly 限制修改
- 支持 Symbol key，避免冲突

#### 💼 实际应用场景
1. 主题、国际化上下文
2. 表单/表格上下文共享

#### ⚠️ 技术纠正（如有）
- 提供基本类型不会自动深层响应；建议提供 reactive/readonly 对象

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：作用域、状态管理替代
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 provide/inject 在 SSR 与异步数据场景的使用
- 询问与全局 store 的选择标准

#### 📝 记忆要点
- **祖先 provide**，后代 inject
- **保持引用**：对象共享
- **默认值**：inject(key, default)

#### ✅ 快速自测
- [ ] provide 传基本类型为何不响应？
- [ ] 如何防止子组件修改共享对象？

---

**19.** Vue 中有哪些组件通信方式？请列举并简述。

- 父子组件 props emits
- 祖孙组件 provide inject
- 兄弟组件（无共同祖父组件） eventBus 或者 pinia。
- 兄弟组件（有共同祖父组件）可以通过provide inject 更改响应式数据到达传递数据到兄弟组件的效果

---

## 19. 组件通信方式 ⭐⭐ 💡

### 原始答案
- 父子组件 props emits
- 祖孙组件 provide inject
- 兄弟组件（无共同祖父组件） eventBus 或者 pinia。
- 兄弟组件（有共同祖父组件）可以通过provide inject 更改响应式数据到达传递数据到兄弟组件的效果

---

### 📊 技术点评

#### 🎯 核心考点
- 通信手段分类与适用范围
- 事件总线替代方案
- 面试意图：考察架构能力与合理选型

#### ✅ 正确答案/参考答案
- 父子：props/emit 或 v-model
- 跨级：provide/inject；全局/兄弟：Pinia/状态管理
- 事件总线仅限小型/临时场景，Vue3 官方不推荐

#### 💼 实际应用场景
1. UI 组件库通信模式
2. 中大型应用状态设计

#### ⚠️ 技术纠正（如有）
- 兄弟通信建议用状态管理或上提状态，不推荐 eventBus

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：slots、全局 store、Router 事件
- 前置要求：props/emit 基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问何时使用 eventBus/mitt，以及如何避免内存泄漏
- 询问 store 与 provide/inject 的取舍和性能

#### 📝 记忆要点
- **父子**：props/emit
- **跨级**：provide/inject
- **兄弟/全局**：store

#### ✅ 快速自测
- [ ] 事件总线在 Vue3 为何不推荐？
- [ ] 何时应上提状态？

---

**20.** 如何在兄弟组件之间通信？

- 兄弟组件（无共同祖父组件） eventBus 或者 pinia。
- 兄弟组件（有共同祖父组件）可以通过provide inject 更改响应式数据到达传递数据到兄弟组件的效果

---

## 20. 兄弟通信 ⭐⭐ 📌

### 原始答案
- 兄弟组件（无共同祖父组件） eventBus 或者 pinia。
- 兄弟组件（有共同祖父组件）可以通过provide inject 更改响应式数据到达传递数据到兄弟组件的效果

---

### 📊 技术点评

#### 🎯 核心考点
- 状态提升与共享 store
- 避免事件总线副作用
- 面试意图：判断通信方案选型是否成熟

#### ✅ 正确答案/参考答案
- 有共同父级：上提状态到父级，通过 props/emit 分发
- 跨层/无公共父级：使用状态管理（Pinia/Vuex）或 mitt 等事件库（慎用）
- provide/inject 可用于有共同祖先的跨级共享

#### 💼 实际应用场景
1. Tab 切换共享状态
2. 通知中心/消息状态共享

#### ⚠️ 技术纠正（如有）
- 首选上提状态或 Pinia；provide/inject 仅适用于有共同祖先

#### 🔗 知识关联
- 所属模块：组件通信、状态管理
- 相关知识点：Pinia、context 提升
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问使用 mitt 时的清理与解耦方式
- 询问在微前端/模块隔离场景下的通信方案

#### 📝 记忆要点
- **上提**：父级管理
- **store**：Pinia 共享
- **总线慎用**：调试困难

#### ✅ 快速自测
- [ ] 兄弟通信为何推荐状态管理？
- [ ] provide/inject 适合什么层级关系？

---

**21.** `$attrs` 和 `$listeners` 的作用是什么？（Vue 3 中有何变化？）

- `$attrs` 属性透传，没有在子组件上定义的属性的其他属性数据，可以透传到子组件的根结点上。
- `$listeners` 事件透传
- 可以通过设置inheritattrs 来控制是否继续传递
- Vue3 中可以使用 useAttrs来获取

---

## 21. $attrs / $listeners ⭐⭐ 💡

### 原始答案
- `$attrs` 属性透传，没有在子组件上定义的属性的其他属性数据，可以透传到子组件的根结点上。
- `$listeners` 事件透传
- 可以通过设置inheritattrs 来控制是否继续传递
- Vue3 中可以使用 useAttrs来获取

---

### 📊 技术点评

#### 🎯 核心考点
- 透传属性与事件
- Vue3 合并 attrs/listeners
- 面试意图：考察组件封装与透传策略

#### ✅ 正确答案/参考答案
- Vue3 将事件也包含在 `$attrs`，已无 `$listeners`；可通过 `useAttrs()` 获取
- `inheritAttrs` 默认 true，可设为 false 手动分发 attrs
- 透传到根元素，多个根需手动 `v-bind="attrs"`

#### 💼 实际应用场景
1. 基础组件封装，透传原生属性
2. 高阶组件包装

#### ⚠️ 技术纠正（如有）
- Vue3 移除 $listeners；事件透传同样走 attrs

#### 🔗 知识关联
- 所属模块：透传属性
- 相关知识点：useAttrs、emits、fallthrough
- 前置要求：组件封装

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 inheritAttrs=false 后如何精细控制透传
- 询问多根节点的 attrs 分发策略

#### 📝 记忆要点
- **Vue3**：attrs 含事件
- **控制**：inheritAttrs=false 自定义透传
- **工具**：useAttrs 读取

#### ✅ 快速自测
- [ ] Vue3 事件为什么会出现在 attrs？
- [ ] 如何屏蔽透传到根节点？

---

**22.** 什么是透传 Attributes（Fallthrough Attributes）？

- 没有在子组件上定义的属性的其他属性数据，可以透传到子组件的根结点上。

---

## 22. 透传 Attributes ⭐ 📌

### 原始答案
- 没有在子组件上定义的属性的其他属性数据，可以透传到子组件的根结点上。

---

### 📊 技术点评

#### 🎯 核心考点
- 未声明 props/事件自动落到根元素
- inheritAttrs 控制
- 面试意图：评估封装组件时的透传处理

#### ✅ 正确答案/参考答案
- 子组件未声明的 attributes 会自动透传到根元素
- 多根组件需要手动 `v-bind="attrs"` 分发到各元素
- 可通过 `inheritAttrs: false` 禁止默认透传

#### 💼 实际应用场景
1. 基础 Button/Input 组件透传原生属性

#### ⚠️ 技术纠正（如有）
- 多根需手动分发，否则属性丢失

#### 🔗 知识关联
- 所属模块：透传属性
- 相关知识点：useAttrs、emits
- 前置要求：props

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问如何在封装组件时过滤敏感属性
- 询问透传与类型声明的结合（attrs 的类型收窄）

#### 📝 记忆要点
- **未声明自动透传**
- **多根需手动分发**
- **inheritAttrs** 可关闭

#### ✅ 快速自测
- [ ] 多根组件如何透传？
- [ ] 事件也会透传吗？

---

**23.** 如何在组件中访问父组件或子组件实例？

- 可以通过模版引用ref的方式
- 可以通过子组件暴露属性 expose属性或者方法

---

## 23. 访问父子实例 ⭐⭐ 📌

### 原始答案
- 可以通过模版引用ref的方式
- 可以通过子组件暴露属性 expose属性或者方法

---

### 📊 技术点评

#### 🎯 核心考点
- 模板 ref 与 defineExpose
- 避免直接 $parent/$children
- 面试意图：考察封装边界与 API 设计

#### ✅ 正确答案/参考答案
- 父访问子：模板 ref + `defineExpose` 暴露方法/数据
- 子访问父：应通过 props/emit/slots，避免 $parent 破坏封装
- getCurrentInstance 仅在极少数场景使用（插件/调试）

#### 💼 实际应用场景
1. 父组件调用子组件方法（校验、重置）
2. 自定义可控组件暴露 API

#### ⚠️ 技术纠正（如有）
- 避免越级访问破坏封装

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：template refs、expose
- 前置要求：ref/onMounted

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 defineExpose 的 TS 类型声明
- 询问如何在组合式函数中封装对外暴露的 API

#### 📝 记忆要点
- **子->父**：emit
- **父->子**：ref + defineExpose
- **谨慎越级**：保持封装

#### ✅ 快速自测
- [ ] defineExpose 不写会怎样？
- [ ] 如何在父组件等待子组件 ref 可用？

---

**24.** 事件总线（Event Bus）的原理是什么？Vue 3 中推荐用什么替代？

- 本质上是订阅发布模式 通过订阅收集依赖，在调用时将收集的依赖执行
- provide inject

---

## 24. 事件总线 ⭐⭐ 💡

### 原始答案
- 本质上是订阅发布模式 通过订阅收集依赖，在调用时将收集的依赖执行
- provide inject

---

### 📊 技术点评

#### 🎯 核心考点
- 发布订阅模式
- 总线在 Vue3 中的替代方案
- 面试意图：确认对解耦和可维护性的关注

#### ✅ 正确答案/参考答案
- Event Bus 基于发布订阅：on 订阅、emit 发布
- Vue3 推荐使用状态管理（Pinia）或 provide/inject/mitt 等，而非全局总线
- 总线需注意解绑防泄漏，调试困难

#### 💼 实际应用场景
1. 老项目跨层通信
2. 快速原型的轻量通信

#### ⚠️ 技术纠正（如有）
- 推荐替代：Pinia/全局事件库或 provide/inject；总线易调试困难、内存泄漏

#### 🔗 知识关联
- 所属模块：组件通信、状态管理
- 相关知识点：mitt、Pinia
- 前置要求：事件模型

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 mitt 的使用方式与清理
- 询问何时该把总线迁移到 store

#### 📝 记忆要点
- **模式**：pub-sub
- **风险**：调试难、泄漏
- **替代**：Pinia/提供注入

#### ✅ 快速自测
- [ ] 事件总线常见问题？
- [ ] mitt 相比 Vue2 总线优势？

---

**25.** `v-model` 在自定义组件中是如何工作的？

- v-bind:"modelValue" v-on:"update:modelValue"
- 在子组件中 使用事件emit("update:modelValue",e.target.value) 的方式将更新值传递到父组件

---

## 25. 自定义组件的 v-model ⭐⭐ 💡

### 原始答案
- v-bind:"modelValue" v-on:"update:modelValue"
- 在子组件中 使用事件emit("update:modelValue",e.target.value) 的方式将更新值传递到父组件

---

### 📊 技术点评

#### 🎯 核心考点
- 受控属性协议
- 事件命名规范
- 面试意图：验证组件封装能力

#### ✅ 正确答案/参考答案
- 父：`v-model="value"` 等价于 `:modelValue="value" @update:modelValue="value=$event"`
- 子：声明 prop `modelValue` 与 emits `update:modelValue`，在交互时 emit 更新
- 多模型使用 `v-model:xxx` 对应 prop/事件名

#### 💼 实际应用场景
1. 封装输入组件/选择器
2. 支持多 v-model 的复合组件

#### ⚠️ 技术纠正（如有）
- 需在 emits 中声明 update 事件

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、修饰符透传
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
已在题 14 示例覆盖

#### 📈 面试延伸
- 追问如何处理 v-model 修饰符传递与消费
- 询问在 TS 下如何声明 update 事件类型

#### 📝 记忆要点
- **prop 名**：modelValue
- **事件名**：update:modelValue
- **多模型**：v-model:xxx

#### ✅ 快速自测
- [ ] 自定义组件如何拿到修饰符？
- [ ] emits 不声明 update 事件会怎样？

---

**26.** Vue 3 组件的生命周期钩子有哪些？按顺序列出。

- setup
- befroeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

---

## 26. 生命周期顺序 ⭐⭐ 🔥

### 原始答案
- setup
- befroeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

---

### 📊 技术点评

#### 🎯 核心考点
- 完整生命周期顺序
- KeepAlive/错误捕获钩子
- 面试意图：验证对钩子时机的精确掌握

#### ✅ 正确答案/参考答案
- 创建：setup → beforeCreate → created
- 挂载：beforeMount → mounted
- 更新：beforeUpdate → updated
- 卸载：beforeUnmount → unmounted
- keep-alive：activated/deactivated；错误：errorCaptured

#### 💼 实际应用场景
1. DOM 依赖逻辑放置位置
2. 清理副作用、防泄漏

#### ⚠️ 技术纠正（如有）
- 拼写：befroeCreate → beforeCreate；补充 activated/deactivated/errorCaptured

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：onMounted/onUnmounted、keep-alive
- 前置要求：组件实例流程

#### 💡 实战示例（重点题目）
```vue
<template>
  <div ref="box">生命周期示例</div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'

const box = ref(null)

onMounted(() => { console.log('mounted', box.value) })
onActivated(() => console.log('keep-alive 激活'))
onDeactivated(() => console.log('keep-alive 失活'))
onBeforeUnmount(() => { console.log('即将卸载，移除监听') })
</script>
```
**最佳实践：**
- DOM/订阅操作放 onMounted；清理在 onBeforeUnmount/onUnmounted
- 缓存组件关注 activated/deactivated

#### 📈 面试延伸
- 追问 keep-alive 场景下 mounted/activated 调用次数
- 询问 errorCaptured 的使用与冒泡规则

#### 📝 记忆要点
- **创建**：setup→beforeCreate→created
- **挂载**：beforeMount→mounted
- **更新**：beforeUpdate→updated
- **卸载**：beforeUnmount→unmounted
- **缓存**：activated/deactivated

#### ✅ 快速自测
- [ ] errorCaptured 何时触发？
- [ ] keep-alive 下 mounted 会重复吗？

---

**27.** `onMounted` 和 `onCreated`（beforeCreate/created）有什么区别？

- onMounted 在dom挂载完成后执行
- onCreated 在dom挂载前执行

---

## 27. onMounted vs created ⭐⭐ 💡

### 原始答案
- onMounted 在dom挂载完成后执行
- onCreated 在dom挂载前执行

---

### 📊 技术点评

#### 🎯 核心考点
- 创建阶段与挂载阶段的能力差异
- DOM 可用时机
- 面试意图：确认钩子放置逻辑

#### ✅ 正确答案/参考答案
- created/beforeCreate（组合式对应 setup）在实例初始化完成但 DOM 未生成时执行
- onMounted 在首次 DOM 渲染完成后执行，可安全访问模板 ref
- SSR 中 mounted 只在客户端执行

#### 💼 实际应用场景
1. SSR/水合前避免 DOM 访问
2. 初始化异步数据加载位置

#### ⚠️ 技术纠正（如有）
- Vue3 仍有 created，setup 先执行

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：setup、onBeforeMount
- 前置要求：生命周期顺序

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问数据请求放 created 还是 mounted 的考量（SSR/SEO/闪烁）
- 询问 onMounted 在 keep-alive 下的调用

#### 📝 记忆要点
- **created**：数据就绪，无 DOM
- **mounted**：DOM 可操作
- **SSR**：mounted 仅客户端

#### ✅ 快速自测
- [ ] created 里能访问 refs 吗？
- [ ] 数据请求放在哪更合适？

---

**28.** 什么时候应该使用 `onBeforeUnmount` 和 `onUnmounted`？

- onBeforeUnmount 在组件卸载前执行
- onUnmounted 在组件卸载后执行

---

## 28. 卸载阶段钩子 ⭐⭐ 📌

### 原始答案
- onBeforeUnmount 在组件卸载前执行
- onUnmounted 在组件卸载后执行

---

### 📊 技术点评

#### 🎯 核心考点
- 清理副作用时机
- keep-alive 与卸载差异
- 面试意图：检查资源释放意识

#### ✅ 正确答案/参考答案
- onBeforeUnmount：组件卸载前调用，适合清理监听、提示用户
- onUnmounted：卸载后调用，确保释放资源；keep-alive 失活不会触发
- keep-alive 使用 onDeactivated/onActivated 处理暂停/恢复

#### 💼 实际应用场景
1. 解绑事件/定时器
2. 取消网络请求

#### ⚠️ 技术纠正（如有）
- keep-alive 失活不会触发 unmounted，需要 deactivated

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：activated/deactivated
- 前置要求：副作用管理

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问在组合式函数中统一清理的模式（返回 cleanup）
- 询问与 AbortController 结合取消请求

#### 📝 记忆要点
- **before**：清理/提示
- **unmounted**：释放资源
- **缓存**：用 deactivated

#### ✅ 快速自测
- [ ] keep-alive 关闭时哪个钩子触发？
- [ ] 如何在卸载时取消 fetch？

---

**29.** `<script setup>` 中如何使用生命周期钩子？

- 通过import { onMounted } from 'vue' 的方式引入

---

## 29. script setup 生命周期 ⭐⭐ 💡

### 原始答案
- 通过import { onMounted } from 'vue' 的方式引入

---

### 📊 技术点评

#### 🎯 核心考点
- 顶层调用、自动注册
- 与 setup 返回无关
- 面试意图：考察对组合式 hook 的使用规范

#### ✅ 正确答案/参考答案
- 直接 import 对应钩子（onMounted/onUpdated 等），在 `<script setup>` 顶层调用
- 不可在条件、循环或回调中调用；可在自定义 hook 内再注册
- 返回值无需显式暴露

#### 💼 实际应用场景
1. 组合式函数内复用生命周期

#### ⚠️ 技术纠正（如有）
- hook 必须在 setup 同步调用

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：hooks 设计、依赖注入
- 前置要求：setup 函数

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问为什么 hook 不能放在条件里（调用顺序、依赖追踪）
- 询问如何在自定义 hook 内暴露清理逻辑

#### 📝 记忆要点
- **import 使用**：onXxx
- **顶层调用**：不可放条件
- **组合式**：自定义 hook 内再注册

#### ✅ 快速自测
- [ ] 为什么 hook 不能放在 if 里？
- [ ] 如何在自定义 hook 里暴露生命周期？

---

**30.** 父子组件的生命周期钩子执行顺序是怎样的？

- 父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

---

## 30. 父子生命周期顺序 ⭐⭐ 💡

### 原始答案
- 父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

---

### 📊 技术点评

#### 🎯 核心考点
- 父子钩子穿插顺序
- keep-alive/异步组件影响
- 面试意图：验证对嵌套组件渲染流程的掌握

#### ✅ 正确答案/参考答案
- 挂载：父 beforeCreate → 父 created → 父 beforeMount → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted → 父 mounted
- 更新：父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
- 卸载：父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted

#### 💼 实际应用场景
1. 依赖父数据的子初始化
2. 测试挂载顺序避免空 ref

#### ⚠️ 技术纠正（如有）
- 补充更新/卸载阶段顺序

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：更新/卸载顺序
- 前置要求：基础生命周期

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 keep-alive/异步组件对顺序的影响
- 询问 suspense 包裹时的顺序变化

#### 📝 记忆要点
- **挂载**：父创建→子创建→子挂载→父挂载
- **更新**：父更新→子更新→父 updated
- **卸载**：父 beforeUnmount→子卸载→父 unmounted

#### ✅ 快速自测
- [ ] 更新阶段顺序？
- [ ] keep-alive 对子钩子影响？

---

**31.** 在哪个生命周期钩子中可以访问 DOM？

- onMounted

---

## 31. DOM 访问时机 ⭐ 📌

### 原始答案
- onMounted

---

### 📊 技术点评

#### 🎯 核心考点
- DOM 可用时机
- 面试意图：确认候选人避免 SSR/首屏异常

#### ✅ 正确答案/参考答案
- 初次渲染后的 DOM 访问放在 onMounted
- 更新后的 DOM 读取使用 nextTick 或 onUpdated
- SSR 中 onMounted 仅在客户端执行

#### 💼 实际应用场景
1. 第三方库初始化

#### ⚠️ 技术纠正（如有）
- 更新后需 nextTick/updated 才有新 DOM

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：nextTick、onUpdated
- 前置要求：模板引用

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 DOM 读取与 flush 时机（pre/post/Sync）的关系
- 询问在异步渲染或 Suspense 下的 DOM 访问注意事项

#### 📝 记忆要点
- **初次**：onMounted
- **更新后**：nextTick/onUpdated
- **SSR**：仅客户端

#### ✅ 快速自测
- [ ] 更新后的 DOM 读取用什么？
- [ ] onMounted 在 SSR 何时触发？

---

**32.** `onActivated` 和 `onDeactivated` 是什么？什么场景下使用？

- onActivated 在keep-alive组件被激活时调用
- onDeactivated 在keep-alive组件被失活时调用

---

## 32. onActivated / onDeactivated ⭐⭐ 📌

### 原始答案
- onActivated 在keep-alive组件被激活时调用
- onDeactivated 在keep-alive组件被失活时调用

---

### 📊 技术点评

#### 🎯 核心考点
- KeepAlive 缓存钩子
- 状态恢复/暂停
- 面试意图：考察对缓存组件行为的了解

#### ✅ 正确答案/参考答案
- keep-alive 包裹的组件在激活时触发 onActivated，失活时触发 onDeactivated
- 失活不会触发 unmounted；适合恢复滚动、重启定时器，失活时暂停请求
- 与 Suspense/异步组件配合时，关注激活时机

#### 💼 实际应用场景
1. 缓存列表的滚动位置恢复
2. 暂停/恢复定时器

#### ⚠️ 技术纠正（如有）
- 仅 keep-alive 包裹的组件触发

#### 🔗 知识关联
- 所属模块：生命周期、性能
- 相关知识点：keep-alive、状态持久化
- 前置要求：组件缓存概念

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 keep-alive 的 include/exclude/max 参数
- 询问与路由缓存（vue-router keep-alive）结合时的行为

#### 📝 记忆要点
- **激活**：onActivated
- **失活**：onDeactivated
- **场景**：缓存组件状态恢复

#### ✅ 快速自测
- [ ] keep-alive 失活会触发 unmounted 吗？
- [ ] 滚动位置应在哪个钩子恢复？

---

**33.** 如何创建一个自定义指令（directive）？举例说明。

- 通过app.directive('focus', { mounted(el) { el.focus() } })的方式创建

---

## 33. 自定义指令 ⭐⭐ 💡

### 原始答案
- 通过app.directive('focus', { mounted(el) { el.focus() } })的方式创建

---

### 📊 技术点评

#### 🎯 核心考点
- 指令注册与钩子
- 场景适配（聚焦/权限/懒加载）
- 面试意图：判断指令是否为首选方案而非组件

#### ✅ 正确答案/参考答案
- 全局：`app.directive('focus', { mounted(el){ el.focus() } })`
- 局部：在组件 `directives` 选项或 `<script setup>` 返回对象中注册
- 指令钩子与组件生命周期同名：created/mounted/updated/beforeUnmount/unmounted 等

#### 💼 实际应用场景
1. 自动聚焦、权限隐藏
2. 图片懒加载

#### ⚠️ 技术纠正（如有）
- 补充指令钩子名称与 binding 参数

#### 🔗 知识关联
- 所属模块：指令
- 相关知识点：指令钩子、binding 参数
- 前置要求：模板指令

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问指令与组件的取舍：复用 vs 渲染
- 询问如何在指令中访问组件实例（binding.instance）

#### 📝 记忆要点
- **注册**：app.directive 或 组件内
- **钩子**：created/mounted/updated 等
- **binding**：value/oldValue/arg/modifiers

#### ✅ 快速自测
- [ ] 指令中如何访问组件实例？
- [ ] 局部指令如何定义？

---

**34.** 自定义指令的生命周期钩子有哪些？

- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

---

## 34. 指令生命周期 ⭐ 📌

### 原始答案
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

---

### 📊 技术点评

#### 🎯 核心考点
- 与组件钩子对应关系
- 面试意图：考察正确选择钩子时机的能力

#### ✅ 正确答案/参考答案
- Vue3 指令钩子：created → beforeMount → mounted → beforeUpdate → updated → beforeUnmount → unmounted
- binding.instance 可访问组件实例；cleanup 放在 beforeUnmount/unmounted

#### 💼 实际应用场景
1. 懒加载、拖拽指令时机选择

#### ⚠️ 技术纠正（如有）
- 无明显错误

#### 🔗 知识关联
- 所属模块：指令
- 相关知识点：binding、cleanup
- 前置要求：指令注册

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问指令在模板 refs/组件更新时的执行顺序
- 询问指令与过渡动画的配合

#### 📝 记忆要点
- **创建**：created
- **挂载/更新/卸载**：与组件同步
- **清理**：unmounted

#### ✅ 快速自测
- [ ] 指令中何时添加监听？
- [ ] 为什么要在 unmounted 移除？

---

**35.** 什么是修饰符（Modifier）？举例说明常用的事件修饰符。

- 修饰符是用于修饰指令的行为的特殊后缀
- 事件修饰符 .stop .prevent .capture .self .once .passive

---

## 35. 修饰符 ⭐ 📌

### 原始答案
- 修饰符是用于修饰指令的行为的特殊后缀
- 事件修饰符 .stop .prevent .capture .self .once .passive

---

### 📊 技术点评

#### 🎯 核心考点
- 指令/事件行为调整
- 语法顺序
- 面试意图：确认对事件模型与可读性的掌握

#### ✅ 正确答案/参考答案
- 修饰符是指令后缀调整行为，如 `@click.stop.prevent`
- 常见事件修饰符：stop/prevent/capture/self/once/passive；按键修饰符：enter/esc；v-model 修饰符：lazy/number/trim
- 修饰符执行顺序从左到右

#### 💼 实际应用场景
1. 阻止冒泡/默认行为
2. 捕获阶段监听

#### ⚠️ 技术纠正（如有）
- 补充按键与 v-model 修饰符

#### 🔗 知识关联
- 所属模块：模板指令
- 相关知识点：事件模型
- 前置要求：DOM 事件

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 passive 在滚动性能中的作用
- 询问修饰符顺序对行为的影响

#### 📝 记忆要点
- **事件**：stop/prevent/once
- **按键**：enter/esc
- **v-model**：lazy/number/trim

#### ✅ 快速自测
- [ ] .passive 适用场景？
- [ ] 修饰符顺序影响吗？

---

**36.** 动态组件是什么？如何使用 `<component :is="...">`？

- 通过:is绑定组件的方式实现动态组件的切换

---

## 36. 动态组件 ⭐⭐ 📌

### 原始答案
- 通过:is绑定组件的方式实现动态组件的切换

---

### 📊 技术点评

#### 🎯 核心考点
- component is 切换组件
- keep-alive 配合缓存
- 面试意图：考察组件动态渲染与状态保持

#### ✅ 正确答案/参考答案
- 使用 `<component :is="comp" :key="comp">` 渲染不同组件，`comp` 可为组件对象/名称/异步组件
- 配合 keep-alive 缓存组件状态；使用 key 避免状态串
- 动态 props/attrs 透传与 emits 需与具体组件匹配

#### 💼 实际应用场景
1. Tab 页切换不同子组件
2. 表单步骤组件切换

#### ⚠️ 技术纠正（如有）
- 需提供 key 保持状态；is 可接受异步组件

#### 🔗 知识关联
- 所属模块：组件化
- 相关知识点：异步组件、keep-alive
- 前置要求：组件注册

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问动态组件与 Suspense/异步组件的组合
- 询问 keep-alive 的 include/exclude 配置

#### 📝 记忆要点
- **component is**：动态渲染
- **key**：保持状态
- **缓存**：配合 keep-alive

#### ✅ 快速自测
- [ ] is 可否传异步组件？
- [ ] key 缺失会怎样？

---

**37.** 什么是插槽（Slot）？有哪些类型的插槽？

- 插槽是用于在组件中定义内容的占位符
- 默认插槽 具名插槽 作用域插槽

---

## 37. 插槽类型 ⭐⭐ 💡

### 原始答案
- 插槽是用于在组件中定义内容的占位符
- 默认插槽 具名插槽 作用域插槽

---

### 📊 技术点评

#### 🎯 核心考点
- 内容分发机制
- 作用域插槽数据下行
- 面试意图：评估组件可扩展性设计

#### ✅ 正确答案/参考答案
- 插槽允许父组件向子组件传递内容
- 类型：默认插槽、具名插槽、作用域插槽（子提供数据，父消费）
- Vue3 使用 `v-slot`/`#` 语法声明插槽

#### 💼 实际应用场景
1. 列表/表格列渲染定制
2. 卡片/弹窗内容扩展

#### ⚠️ 技术纠正（如有）
- 作用域插槽通过 slotProps 提供数据

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：v-slot、动态插槽名
- 前置要求：组件封装

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问作用域插槽与 render props 的比较
- 询问 slot props 的类型声明方式

#### 📝 记忆要点
- **默认/具名/作用域**
- **语法**：v-slot/#
- **数据流**：父提供内容，子提供数据

#### ✅ 快速自测
- [ ] 作用域插槽数据方向？
- [ ] 动态插槽名如何写？

---

**38.** 如何使用具名插槽和作用域插槽？

- 具名插槽通过name属性定义
- 作用域插槽通过v-slot:slotName="slotProps"的方式定义，也可以使用#slotName="slotProps"的简写方式

---

## 38. 具名与作用域插槽 ⭐⭐ 💡

### 原始答案
- 具名插槽通过name属性定义
- 作用域插槽通过v-slot:slotName="slotProps"的方式定义，也可以使用#slotName="slotProps"的简写方式

---

### 📊 技术点评

#### 🎯 核心考点
- 插槽声明与消费
- 数据作用域传递
- 面试意图：考察插槽语法熟练度

#### ✅ 正确答案/参考答案
- 子组件：`<slot name="header" />`；父组件：`<template #header>...</template>`
- 作用域插槽：子 `slot` 提供 props，父通过 `v-slot:default="slotProps"` 或 `#default="slotProps"` 接收
- 默认插槽可用缩写 `#default`

#### 💼 实际应用场景
1. 表格列 slot
2. 卡片 header/footer 自定义

#### ⚠️ 技术纠正（如有）
- 多插槽需 template 包裹

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：动态插槽名、fallback 内容
- 前置要求：slot 基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问作用域插槽与 props drilling 的区别
- 询问在 TS 下如何为 slot props 声明类型

#### 📝 记忆要点
- **name**：指定插槽
- **v-slot/#**：接受 slotProps
- **模板包裹**：多 slot 需要

#### ✅ 快速自测
- [ ] 如何接收作用域插槽参数？
- [ ] 默认插槽的写法？

---

**39.** `v-once` 和 `v-memo` 的作用是什么？

- v-once 用于只渲染一次的组件
- v-memo 用于缓存组件

---

## 39. v-once / v-memo ⭐⭐ 📌

### 原始答案
- v-once 用于只渲染一次的组件
- v-memo 用于缓存组件

---

### 📊 技术点评

#### 🎯 核心考点
- 静态渲染与条件缓存
- 面试意图：考察性能优化手段

#### ✅ 正确答案/参考答案
- `v-once`：首次渲染后跳过后续更新，适合完全静态内容
- `v-memo="[deps]"`：依赖不变则跳过渲染，依赖变化才更新
- 需谨慎使用以避免数据不更新

#### 💼 实际应用场景
1. 静态大 DOM 块
2. 依赖条件切换时避免重复渲染

#### ⚠️ 技术纠正（如有）
- v-memo 接收依赖数组；v-once 后续更新不再渲染

#### 🔗 知识关联
- 所属模块：性能优化
- 相关知识点：compile cache、静态提升
- 前置要求：模板指令

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 v-memo 与纯组件/shouldComponentUpdate 思路对比
- 询问静态提升在编译时已做哪些优化

#### 📝 记忆要点
- **v-once**：首渲染后跳过
- **v-memo**：依赖不变跳过
- **场景**：静态/昂贵片段

#### ✅ 快速自测
- [ ] v-memo 依赖变了会怎样？
- [ ] v-once 能与 v-if 共存吗？

---

**40.** 如何在模板中使用 JavaScript 表达式？有什么限制？

- 可以在模板中使用JavaScript表达式
- 不能使用赋值语句

---

## 40. 模板表达式限制 ⭐ 📌

### 原始答案
- 可以在模板中使用JavaScript表达式
- 不能使用赋值语句

---

### 📊 技术点评

#### 🎯 核心考点
- 仅支持单个表达式，禁止语句
- 访问范围（组件实例+全局可用）
- 面试意图：确认模板复杂度控制

#### ✅ 正确答案/参考答案
- 模板允许简单表达式：三元、函数调用、算术等
- 禁止语句（赋值、if/for）、访问全局需显式导入
- 复杂逻辑移至 computed/method，保持模板简洁

#### 💼 实际应用场景
1. 简单计算/过滤

#### ⚠️ 技术纠正（如有）
- 不能使用控制流/声明；避免复杂逻辑放模板

#### 🔗 知识关联
- 所属模块：模板语法
- 相关知识点：计算属性/方法
- 前置要求：指令基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问模板表达式的安全性（XSS、防止 eval）
- 询问模板复杂度对可维护性的影响

#### 📝 记忆要点
- **表达式**：无语句
- **作用域**：组件上下文
- **复杂逻辑**：移至 computed/method

#### ✅ 快速自测
- [ ] 模板能写 if 语句吗？
- [ ] 复杂表达式应放哪？

---

**41.** 什么是 Composition API？与 Options API 有什么区别？

- Composition API 是一种新的组件逻辑组织方式，将组件的逻辑按照功能进行分割，可以将多个功能组合到一个组件中
- Options API 是一种基于选项的组件逻辑组织方式，将组件的逻辑按照数据、方法、生命周期等进行分割

---

## 41. Composition API ⭐⭐⭐ 🔥

### 原始答案
- Composition API 是一种新的组件逻辑组织方式，将组件的逻辑按照功能进行分割，可以将多个功能组合到一个组件中
- Options API 是一种基于选项的组件逻辑组织方式，将组件的逻辑按照数据、方法、生命周期等进行分割

---

### 📊 技术点评

#### 🎯 核心考点
- 逻辑组织与复用方式对比
- TS/Tree-shaking 友好性
- 面试意图：评估大规模组件重构/复用能力

#### ✅ 正确答案/参考答案
- Composition API 使用函数组织逻辑，无 this，便于提取复用（hooks）
- Options API 按 data/methods 等分组，易读但跨逻辑分散；Vue3 仍支持
- Composition 在类型、Tree-shaking、逻辑聚合上更优

#### 💼 实际应用场景
1. 跨组件逻辑复用（hooks）
2. 大型组件拆分关注点

#### ⚠️ 技术纠正（如有）
- 补充 Composition 不依赖 this，类型推断更好

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：setup、组合式函数、script setup
- 前置要求：Options API 理解

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <p>窗口宽度：{{ width }}</p>
    <p>计数：{{ count }}</p>
    <button @click="inc">+</button>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const useWindowWidth = () => {
  const width = ref(window.innerWidth)
  const handler = () => (width.value = window.innerWidth)
  onMounted(() => window.addEventListener('resize', handler))
  onUnmounted(() => window.removeEventListener('resize', handler))
  return width
}

const width = useWindowWidth()
const count = ref(0)
const inc = () => count.value++
</script>
```
**最佳实践：**
- 将可复用逻辑抽成 hooks；保持单一职责
- Options 迁移时先提取 data/method 到 setup 再重构

#### 📈 面试延伸
- 追问 mixin 与组合式函数的差异与迁移方式
- 询问 Composition API 对 Tree-shaking 的帮助

#### 📝 记忆要点
- **无 this**：函数式组织
- **高复用**：hooks 抽取
- **类型友好**：TS 推断好

#### ✅ 快速自测
- [ ] 组合式函数与 mixins 差异？
- [ ] 如何在 hook 中注册生命周期？

---

**42.** `<script setup>` 语法糖有什么优势？

- 可以更方便的使用Composition API
- 可以更方便的使用TypeScript
- 可以更方便的使用模板引用

---

## 42. script setup 优势 ⭐⭐ 💡

### 原始答案
- 可以更方便的使用Composition API
- 可以更方便的使用TypeScript
- 可以更方便的使用模板引用

---

### 📊 技术点评

#### 🎯 核心考点
- 编译时宏简化代码
- 自动注册返回、性能更好
- 面试意图：确认新特性掌握度

#### ✅ 正确答案/参考答案
- 无需 return，顶层声明自动暴露给模板
- 支持编译期宏（defineProps/Emits/Expose），类型推断更优
- 支持顶层 await；与普通 setup 不可同文件共存

#### 💼 实际应用场景
1. 更简洁的 SFC 编写体验
2. TS 类型推断 + 顶层 await 支持

#### ⚠️ 技术纠正（如有）
- 宏必须顶层；script setup 不能与普通 script 同时存在（除非 script setup + script 普通用于选项）

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：defineProps/Emits/Expose 宏
- 前置要求：setup 基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问顶层 await 的使用限制与 SSR 影响
- 询问 script setup 在 HMR/性能上的优势

#### 📝 记忆要点
- **更少样板**：无需 export default
- **类型好**：自动推断
- **宏**：defineProps/Emits/Expose

#### ✅ 快速自测
- [ ] script setup 能与普通 script 共存吗？
- [ ] 顶层 await 何时可用？

---

**43.** `watch` 和 `watchEffect` 的区别是什么？

- watch 需要手动指定监听的响应式数据，有新旧值，可以指定多个，可以指定时机
- watchEffect 会自动收集依赖，自动执行

---

## 43. watch vs watchEffect ⭐⭐ 🔥

### 原始答案
- watch 需要手动指定监听的响应式数据，有新旧值，可以指定多个，可以指定时机
- watchEffect 会自动收集依赖，自动执行

---

### 📊 技术点评

#### 🎯 核心考点
- 依赖收集方式、懒执行
- 副作用场景选择
- 面试意图：区分副作用与派生逻辑

#### ✅ 正确答案/参考答案
- watch：显式指定源（ref/getter/数组），默认懒执行，可拿新旧值，支持 flush 控制
- watchEffect：自动依赖收集，立即执行，无旧值，可注册 cleanup
- 需要精确控制与新旧值用 watch，复杂依赖/调试用 watchEffect

#### 💼 实际应用场景
1. 精确监听某字段触发请求
2. 自动依赖的调试逻辑/日志

#### ⚠️ 技术纠正（如有）
- watchEffect 默认立即执行且无旧值；应处理 stop/cleanup

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：computed、flush 时机、stop
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
```vue
<script setup>
import { ref, watch, watchEffect, onUnmounted } from 'vue'

const keyword = ref('')
const result = ref('')
const stopWatch = watch(keyword, async (val) => {
  if (!val) return
  result.value = `fetch:${val}`
}, { flush: 'post' })

const stopEffect = watchEffect((onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  console.log('title', document.title)
})

onUnmounted(() => {
  stopWatch()
  stopEffect()
})
</script>
```
**最佳实践：**
- 需要旧值/精确源用 watch；自动收集小型副作用用 watchEffect
- 使用 onCleanup/stop 避免泄漏

#### 📈 面试延伸
- 追问 flush 选项（pre/post/sync）对副作用时机的影响
- 询问 watchEffect 与 computed 在依赖收集上的区别

#### 📝 记忆要点
- **源**：watch 指定，effect 自动
- **时机**：watch 默认懒，effect 立即
- **旧值**：仅 watch

#### ✅ 快速自测
- [ ] watchEffect 如何清理副作用？
- [ ] 哪个支持多个源？

---

**44.** 什么是 `shallowRef` 和 `shallowReactive`？什么场景下使用？

- shallowRef 只有.value的赋值是响应式的 浅层响应式
- shallowReactive 只有根级别属性是响应式的 浅层响应式
- 适用于包装大型数据结构或第三方库实例

---

## 44. 浅层响应式 ⭐⭐ 💡

### 原始答案
- shallowRef 只有.value的赋值是响应式的 浅层响应式
- shallowReactive 只有根级别属性是响应式的 浅层响应式
- 适用于包装大型数据结构或第三方库实例

---

### 📊 技术点评

#### 🎯 核心考点
- 浅层监听行为
- 性能/与第三方实例结合
- 面试意图：确认性能优化意识

#### ✅ 正确答案/参考答案
- shallowRef：仅 .value 变更触发；深层对象变更需 triggerRef 或重新赋值
- shallowReactive：只跟踪第一层属性，深层非响应
- 适合大对象、第三方实例、频繁深层变更场景的性能优化

#### 💼 实际应用场景
1. 大体积数据（图表配置、地图实例）
2. 外部库实例存储

#### ⚠️ 技术纠正（如有）
- 更新深层需手动 triggerRef/重赋值；shallowReactive 无法追踪子属性

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：markRaw, triggerRef
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 shallowRef 与 markRaw 的区别及组合使用
- 询问何时应使用 customRef 自定义触发逻辑

#### 📝 记忆要点
- **浅层**：只跟踪第一层
- **深变更需手动触发**
- **适用**：大对象/实例

#### ✅ 快速自测
- [ ] shallowRef 深层变更如何触发？
- [ ] markRaw 和 shallowReactive 区别？

---

**45.** 如何使用 `toRef` 和 `toRefs`？它们解决什么问题？

- toRef 为单个属性创建响应式引用
- toRefs 为多个属性创建响应式引用
- 解决了解构响应式对象后失去响应性的问题

---

## 45. toRef / toRefs ⭐⭐ 💡

### 原始答案
- toRef 为单个属性创建响应式引用
- toRefs 为多个属性创建响应式引用
- 解决了解构响应式对象后失去响应性的问题

---

### 📊 技术点评

#### 🎯 核心考点
- 解构保持响应
- 绑定 ref 到对象属性
- 面试意图：考察对响应式引用传递的理解

#### ✅ 正确答案/参考答案
- `toRef(obj, key)` 为对象属性创建 ref，保持与源同步
- `toRefs(obj)` 将对象属性批量转为 ref，解决解构丢失响应
- 对非响应对象使用不会自动变响应

#### 💼 实际应用场景
1. 组合式函数暴露响应式字段
2. 解构 store/state

#### ⚠️ 技术纠正（如有）
- toRef 可绑定不存在属性并保持与源同步

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：ref/reactive、computed
- 前置要求：解构语法

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 toRef 在解构 Pinia state 时的作用
- 询问 toRef 与 computed(get/set) 的区别

#### 📝 记忆要点
- **解构**：toRefs
- **单属性**：toRef(source, key)
- **同步**：与源绑定

#### ✅ 快速自测
- [ ] toRef 绑定不存在属性会怎样？
- [ ] 解构 reactive 为何丢响应？

---

**46.** `Teleport` 组件的用途是什么？如何使用？

- Teleport 用于将组件的HTML渲染到DOM树的其他位置
- 保持组件的逻辑关系不变
- 解决CSS层级和定位问题

---

## 46. Teleport ⭐⭐ 💡

### 原始答案
- Teleport 用于将组件的HTML渲染到DOM树的其他位置
- 保持组件的逻辑关系不变
- 解决CSS层级和定位问题

---

### 📊 技术点评

#### 🎯 核心考点
- 逻辑与渲染位置分离
- 场景：全局层级内容
- 面试意图：考察全局浮层/可访问性处理

#### ✅ 正确答案/参考答案
- 语法：`<Teleport to="body">...</Teleport>` 将渲染移动到目标节点
- 组件逻辑、状态、事件不变；需确保目标节点存在
- 可通过 `:disabled` 控制是否传送

#### 💼 实际应用场景
1. Modal/Toast 渲染到 body
2. 固定层级的浮层/Popover

#### ⚠️ 技术纠正（如有）
- 目标容器需存在；适当清理避免残留 DOM

#### 🔗 知识关联
- 所属模块：组件高级特性
- 相关知识点：Teleport target、disable
- 前置要求：DOM 层级

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 Teleport 对样式/事件捕获的影响
- 询问在 SSR/Portal 场景的限制

#### 📝 记忆要点
- **to**：指定目标选择器/节点
- **逻辑不变**：事件/状态保留
- **场景**：模态/提示

#### ✅ 快速自测
- [ ] Teleport 目标不存在会怎样？
- [ ] 如何禁用 Teleport 暂时回原地？

---

**47.** `Suspense` 组件的基本作用是什么？

- 用于等待异步子组件（或 `async setup`）完成渲染，并显示 fallback，占位或加载状态

---

## 47. Suspense ⭐⭐ 💡

### 原始答案
- 用于等待异步子组件（或 `async setup`）完成渲染，并显示 fallback，占位或加载状态

---

### 📊 技术点评

#### 🎯 核心考点
- 异步组件的占位与错误边界
- 面试意图：考察异步渲染体验优化

#### ✅ 正确答案/参考答案
- Suspense 包裹异步组件/async setup，未就绪时渲染 fallback，完成后显示 default
- 支持 error/timeout 插槽处理错误或超时
- fallback 只在有未就绪异步依赖时生效

#### 💼 实际应用场景
1. 首屏异步数据组件
2. 懒加载路由组件

#### ⚠️ 技术纠正（如有）
- 仅异步依赖未就绪时生效；同步组件无 fallback

#### 🔗 知识关联
- 所属模块：组件高级特性
- 相关知识点：异步组件、Promise、错误处理
- 前置要求：异步 setup

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 Suspense 与 async setup 的实现细节
- 询问超时/错误处理与用户体验优化

#### 📝 记忆要点
- **fallback**：加载占位
- **异步 setup**：支持
- **错误插槽**：onErrorCaptured

#### ✅ 快速自测
- [ ] Suspense 何时不生效？
- [ ] 如何显示加载超时？

---

**48.** 什么是 `defineExpose`？为什么需要它？

- 暴露组件的属性和方法给父组件
- 替代Options API中的自动暴露机制

---

## 48. defineExpose ⭐⭐ 📌

### 原始答案
- 暴露组件的属性和方法给父组件
- 替代Options API中的自动暴露机制

---

### 📊 技术点评

#### 🎯 核心考点
- script setup 中控制暴露
- 限制可访问面，增强封装
- 面试意图：确认封装与 API 设计意识

#### ✅ 正确答案/参考答案
- 在 `<script setup>` 中使用 `defineExpose({ method })` 控制父组件通过 ref 可访问的属性/方法
- 未调用时默认不暴露任何 setup 作用域变量
- 有助于封装，避免泄露内部实现

#### 💼 实际应用场景
1. 父组件通过 ref 调用子方法
2. 限制仅暴露必要 API

#### ⚠️ 技术纠正（如有）
- 仅 `<script setup>` 需要；普通 script 默认全暴露

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：template ref
- 前置要求：setup 封装

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 defineExpose 在 TS 下的类型写法
- 询问暴露过多 API 的风险

#### 📝 记忆要点
- **控制暴露**：defineExpose({ fn })
- **默认不暴露**：script setup
- **封装**：仅公开必要

#### ✅ 快速自测
- [ ] defineExpose 不写会怎样？
- [ ] 如何结合 ref 使用？

---

**49.** `nextTick` 有什么用途？什么时候使用？

- 等待DOM更新完成后执行回调
- 修改数据后计算新的DOM或者操作DOM

---

## 49. nextTick 用途 ⭐⭐ 🔥

### 原始答案
- 等待DOM更新完成后执行回调
- 修改数据后计算新的DOM或者操作DOM

---

### 📊 技术点评

#### 🎯 核心考点
- 微任务队列、DOM 更新时机
- 更新后获取最新布局/状态
- 面试意图：确认对事件循环和渲染时机的理解

#### ✅ 正确答案/参考答案
- `await nextTick()` 在 DOM 更新后执行回调/后续逻辑
- 适合在数据变更后读取 DOM 尺寸、滚动、聚焦
- 避免滥用导致额外微任务，建议批量更新后一次调用

#### 💼 实际应用场景
1. 表格列显隐后重新计算宽度
2. 动画/滚动位置更新

#### ⚠️ 技术纠正（如有）
- 使用 await 形式更直观；避免频繁调用

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：flush 模式、DOM 更新
- 前置要求：事件循环

#### 💡 实战示例（重点题目）
```vue
<template>
  <div ref="panel" class="panel" v-show="open">内容</div>
  <button @click="toggle">切换</button>
</template>
<script setup>
import { ref, nextTick } from 'vue'

const open = ref(false)
const panel = ref(null)
const toggle = async () => {
  open.value = !open.value
  await nextTick()
  if (open.value) {
    console.log('height', panel.value?.offsetHeight)
  }
}
</script>
```
**最佳实践：**
- 在数据更新后且需要读取 DOM 时使用
- 尽量批量更新后一次 nextTick，避免重复

#### 📈 面试延伸
- 追问 flush: 'post' 的 watch 与 nextTick 的关系
- 询问 Vue DOM 更新相对微任务/宏任务的顺序

#### 📝 记忆要点
- **等待**：DOM 刷新
- **使用**：await nextTick()
- **场景**：读取尺寸/聚焦

#### ✅ 快速自测
- [ ] nextTick 基于什么队列？
- [ ] 更新频繁时如何减少 nextTick 次数？

---

**50.** Vue 3 中移除了哪些 Vue 2 的特性或 API？

- 移除了filter
- 移除了transition-group
- 移除了v-on.native
- 移除了v-once
- 移除了v-memo

---

## 50. Vue3 移除的特性 ⭐⭐⭐ 💡

### 原始答案
- 移除了filter
- 移除了transition-group
- 移除了v-on.native
- 移除了v-once
- 移除了v-memo

---

### 📊 技术点评

#### 🎯 核心考点
- 破坏性变更识别
- 迁移策略
- 面试意图：验证迁移实践与踩坑

#### ✅ 正确答案/参考答案
- 移除：filters、`v-on.native`、`$on/$off/$once`、内联模板、实例事件总线
- 保留：transition-group、v-once、v-memo（新增）；部分全局 API 改为应用实例方法
- 迁移：filters → computed/方法；.native → 组件 emit 或 attrs 透传

#### 💼 实际应用场景
1. 旧项目迁移排查
2. 第三方库兼容性评估

#### ⚠️ 技术纠正（如有）
- transition-group/v-once 未被移除；v-memo 是新增

#### 🔗 知识关联
- 所属模块：迁移指南
- 相关知识点：v-model 变更、全局 API 调整
- 前置要求：Vue2 经验

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问迁移工具（@vue/compat）与策略
- 询问 filter 替换方案的落地经验

#### 📝 记忆要点
- **移除**：filters、.native、$on/$off、内联模板
- **保留**：transition-group/v-once
- **迁移**：用 computed/method 替代 filters

#### ✅ 快速自测
- [ ] .native 被什么替代？
- [ ] filters 迁移方案？

---

**51.** 什么是 `Fragment`（片段）？Vue 3 中有什么变化？

- Fragment 是 Vue 3 中用于支持组件返回多个根节点的特性。它允许组件模板中不需要额外的包裹元素，减少无意义的 DOM 层级。

---

## 51. Fragment ⭐ 📌

### 原始答案
- Fragment 是 Vue 3 中用于支持组件返回多个根节点的特性。它允许组件模板中不需要额外的包裹元素，减少无意义的 DOM 层级。

---

### 📊 技术点评

#### 🎯 核心考点
- 多根节点支持
- DOM 结构优化
- 面试意图：了解编译/渲染改进

#### ✅ 正确答案/参考答案
- Vue3 支持组件有多个根节点，通过 Fragment 包装虚拟节点
- 减少无意义包裹元素，提升结构语义与样式灵活性
- v-if/v-for 仍需单一模板根（可用 <template> 包裹）

#### 💼 实际应用场景
1. 表格行/列表项无需包裹
2. 组件返回平级元素

#### ⚠️ 技术纠正（如有）
- 需注意指令/attrs 作用的目标元素

#### 🔗 知识关联
- 所属模块：编译优化
- 相关知识点：模板编译、虚拟 DOM
- 前置要求：SFC 结构

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 Fragment 对 diff 性能的影响
- 询问在 transition/teleport 下的行为

#### 📝 记忆要点
- **多根**：无需额外 div
- **虚拟节点**：Fragment 包装
- **限制**：指令需作用于具体元素

#### ✅ 快速自测
- [ ] 多根组件如何添加 transition？
- [ ] v-if 作用于多根怎么办？

---

**52.** `readonly` 的作用是什么？与 `const` 有什么区别？

- readonly 用于创建一个只读的响应式对象
- const 用于创建一个常量

---

## 52. readonly vs const ⭐⭐ 📌

### 原始答案
- readonly 用于创建一个只读的响应式对象
- const 用于创建一个常量

---

### 📊 技术点评

#### 🎯 核心考点
- 运行时只读代理 vs 编译时绑定
- 面试意图：确认类型/运行时语义区分

#### ✅ 正确答案/参考答案
- `readonly(obj)` 返回只读响应式代理，阻止通过代理修改（控制台警告）
- `const` 约束变量绑定不可重新赋值，但对象属性仍可修改
- readonly 包装 reactive 仍可通过原始对象修改

#### 💼 实际应用场景
1. 对外暴露状态时防止修改
2. 组合式函数返回值保护

#### ⚠️ 技术纠正（如有）
- readonly 仍可通过原始对象修改；shallowReadonly 仅首层只读

#### 🔗 知识关联
- 所属模块：响应式工具
- 相关知识点：shallowReadonly、toRaw
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问如何在 TS 中声明只读响应式（Readonly/DeepReadonly）
- 询问 readonly 与 markRaw 的组合使用场景

#### 📝 记忆要点
- **readonly**：代理只读
- **const**：绑定不可重指
- **绕过**：原始对象可改

#### ✅ 快速自测
- [ ] readonly 包装 reactive 后还能修改源吗？
- [ ] const 能否阻止对象属性变更？

---

**53.** 如何在 Vue 3 中使用 TypeScript？

- 使用defineComponent 或者 defineProps
- 在script标签中添加lang="ts"

---

## 53. Vue3 + TypeScript ⭐⭐ 💡

### 原始答案
- 使用defineComponent 或者 defineProps
- 在script标签中添加lang="ts"

---

### 📊 技术点评

#### 🎯 核心考点
- SFC 类型支持
- 组件 props/emits 类型声明
- 面试意图：验证类型系统落地能力

#### ✅ 正确答案/参考答案
- 使用 `<script setup lang="ts">` 获取最佳推断；或 defineComponent/defineProps/defineEmits 指定类型
- 使用 PropType/接口定义 props 类型；emits 可用函数签名声明
- 配合 Volar/TSX 提升 DX；类型工具：InstanceType<typeof Comp>

#### 💼 实际应用场景
1. 组件库的类型导出
2. 业务组件参数安全

#### ⚠️ 技术纠正（如有）
- 推荐 script setup；可用 withDefaults 指定默认值类型

#### 🔗 知识关联
- 所属模块：类型系统
- 相关知识点：volar 类型推断、泛型组件
- 前置要求：TS 基础

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问在组合式函数中使用泛型/ReturnType 等类型工具
- 询问 defineEmits TS 写法的两种形式

#### 📝 记忆要点
- **lang="ts"**：启用 TS
- **类型**：PropType/Emit 类型
- **工具**：defineComponent/script setup

#### ✅ 快速自测
- [ ] props 的 TS 类型如何声明？
- [ ] defineEmits 如何声明类型？

---

**54.** 什么是 `isRef`、`unref`、`toRaw`？分别用于什么场景？

- isRef 判断是否是ref对象
- unref 返回ref对象的值或者普通值
- toRaw 返回reactive对象的原始对象

---

## 54. isRef / unref / toRaw ⭐⭐ 📌

### 原始答案
- isRef 判断是否是ref对象
- unref 返回ref对象的值或者普通值
- toRaw 返回reactive对象的原始对象

---

### 📊 技术点评

#### 🎯 核心考点
- 工具函数用途
- 绕过代理/判断响应性
- 面试意图：确认调试与集成第三方库的能力

#### ✅ 正确答案/参考答案
- isRef：判断值是否为 ref
- unref：返回 ref 的 value 或原值（等价于 isRef ? val.value : val）
- toRaw：返回 reactive 代理的原始对象，修改原始对象不会触发响应

#### 💼 实际应用场景
1. 处理第三方库要求原始对象
2. 统一获取 ref 或普通值

#### ⚠️ 技术纠正（如有）
- toRaw 返回非响应对象，勿长期持有用于修改后再回写

#### 🔗 知识关联
- 所属模块：响应式工具
- 相关知识点：markRaw、shallowReactive
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📈 面试延伸
- 追问 markRaw 与 toRaw 的区别
- 询问 unref 与模板自动解包的关系

#### 📝 记忆要点
- **isRef**：判定
- **unref**：提值
- **toRaw**：取原对象

#### ✅ 快速自测
- [ ] toRaw 返回值修改会触发视图吗？
- [ ] unref 在模板中等价于什么？

---

**55.** Vue 3 的 `emits` 选项有什么作用？为什么推荐声明 emits？

- 声明组件可以触发的事件
- 提供事件参数验证
- 改善开发体验和IDE支持
- 与TypeScript集成提供类型安全

---

## 55. emits 选项 ⭐⭐ 🔥

### 原始答案
- 声明组件可以触发的事件
- 提供事件参数验证
- 改善开发体验和IDE支持
- 与TypeScript集成提供类型安全

---

### 📊 技术点评

#### 🎯 核心考点
- 事件白名单与校验
- 类型安全与 IDE 提示
- 面试意图：确认组件 API 设计与类型意识

#### ✅ 正确答案/参考答案
- 在组件选项或 `<script setup>` 中声明 emits 列表或校验函数
- 未声明的事件在开发模式会警告，声明有助于类型推断与 IDE 补全
- 自定义 v-model 需声明对应 update 事件

#### 💼 实际应用场景
1. 组件库对外事件规范化
2. 自定义 v-model 事件声明

#### ⚠️ 技术纠正（如有）
- emits 与 inheritAttrs 分离；未声明事件会 warn

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：defineEmits、v-model、attrs
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
```vue
<template>
  <button @click="submit">提交</button>
</template>
<script setup lang="ts">
const emit = defineEmits<{ (e: 'submit', payload: { id: number }): void }>()
const submit = () => emit('submit', { id: Date.now() })
</script>
```
**最佳实践：**
- 声明确切事件与参数类型；自定义 v-model 必须声明 update 事件
- 结合 TS 接口提升 IDE 提示与防误拼

#### 📈 面试延伸
- 追问 emits 校验函数的用法与错误提示
- 询问 emit 事件名大小写约定及与 DOM 事件的区别

#### 📝 记忆要点
- **白名单**：限制可触发事件
- **校验**：可函数校验参数
- **TS 友好**：类型推断

#### ✅ 快速自测
- [ ] emits 未声明事件触发会怎样？
- [ ] 如何为 update:modelValue 声明类型？

---
