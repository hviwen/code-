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
- Composition API与Options API演进
- 编译&运行时性能优化（Tree-shaking、多根、TS）

#### 💼 实际应用场景
1. 旧项目升级评估、迁移策略制定
2. 新项目技术选型、性能预算
3. 跨版本库兼容性检查

#### ⚠️ 技术纠正（如有）
❌ **错误示例：** 生命周期“setup和onUnmounted代替beforeCreate/created”

✅ **正确示例：** Vue3仍保留beforeCreate/created，新增setup并推荐组合式写法

**问题说明：** 混淆了组合式API与生命周期，可能在迁移时遗漏钩子导致逻辑缺失。

#### 🔗 知识关联
- 所属模块：响应式系统、编译优化、组件化
- 相关知识点：Fragment、多v-model、Teleport/Suspense
- 前置要求：熟悉Vue2选项式API

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

// Proxy 驱动的响应式
const state = reactive({ visits: 1 })
const user = reactive({ name: 'Vue3' })
const count = computed(() => state.visits * 2)

const title = ref('hello') // 多 v-model 支持

const increment = () => {
  state.visits++ // 直接修改即可触发更新
}
</script>
<style scoped>
section { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
button { margin-top: 8px; }
</style>
```
**最佳实践：**
- 迁移时优先改写成组合式API方便逻辑拆分
- 利用多根节点减少无意义包裹元素

#### 📝 记忆要点
- **响应式升级**：Proxy、可监听新增/删除
- **性能**：编译缓存 + Tree-shaking
- **API形态**：Options→Composition
- **新内置**：Teleport/Suspense/Fragment

#### ✅ 快速自测
- [ ] Proxy相较defineProperty解决了哪些问题？
- [ ] Vue3如何支持多v-model？

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
- 解构丢失响应性与toRefs

#### 💼 实际应用场景
1. 表单字段（字符串/数字）与复杂表单对象并存
2. 定时器/异步状态（loading/error）管理
3. 组件对外暴露的简单状态与内部复合状态

#### ⚠️ 技术纠正（如有）
- ✅ 说明基本正确，补充：ref可包装对象但引用替换才触发；reactive不支持直接替换整体对象保持响应。

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

const name = ref('Alice') // 基本类型
const profile = reactive({ age: 18, city: 'SZ' }) // 对象

const { age } = toRefs(profile) // 解构保持响应

const greeting = computed(() => `${name.value} - ${age.value}岁`)

const replaceProfile = () => {
  // ❌ profile = { age: 20 } // reactive整体替换丢失响应
  Object.assign(profile, { age: 20, city: 'SH' }) // ✅ 局部更新
}
</script>
```
**最佳实践：**
- 基本类型优先ref，对象优先reactive，解构后用toRefs
- 需要整体替换的复杂数据可用ref包装对象

#### 📝 记忆要点
- **ref**：.value，基本类型
- **reactive**：对象直接用
- **toRefs**：解构保持响应
- **ref包装对象**：替换引用

#### ✅ 快速自测
- [ ] 何时选择ref包装对象而非reactive？
- [ ] reactive整体替换为何丢响应？

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
- computed懒执行与缓存
- getter/setter可读写场景
- 与methods的职责差异

#### 💼 实际应用场景
1. 价格/折扣等派生数据计算
2. 表单校验状态聚合
3. 复杂筛选结果缓存

#### ⚠️ 技术纠正（如有）
- 补充：computed可以包含同步副作用但不推荐；异步应使用watch或async computed库。

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：watch、watchEffect、memoization
- 前置要求：ref/reactive基础

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
  set(val) {
    // 简单示例：允许向下修正数量
    count.value = Math.max(1, Math.floor(val / price.value))
  },
})
</script>
```
**最佳实践：**
- 纯派生逻辑用computed，副作用用watch
- 需要双向派生时使用getter/setter

#### 📝 记忆要点
- **缓存**：依赖不变不重新算
- **同步**：不处理异步
- **可写**：get/set支持双向

#### ✅ 快速自测
- [ ] 何时用computed而非method？
- [ ] computed中写异步会怎样？

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
- setup调用顺序与实例创建时机
- this不可用的真实原因
- props/context获取方式

#### 💼 实际应用场景
1. 组合式函数初始化、注入依赖
2. SSR中避免访问window/DOM
3. 提前注册副作用（watch/onMounted等）

#### ⚠️ 技术纠正（如有）
❌ **错误示例：** “不能访问this因为DOM未构建”

✅ **正确示例：** setup在组件实例创建前执行，实例尚未绑定到this。

**问题说明：** 错误理解会导致在setup里误用this读取全局实例方法。

#### 🔗 知识关联
- 所属模块：Composition API、生命周期
- 相关知识点：beforeCreate/created、expose、context参数
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
  // 此时才能安全访问DOM/模板引用
  console.log('mounted with title', props.title)
})
</script>
```
**最佳实践：**
- 所有需要的实例能力通过setup参数获取，不依赖this
- DOM操作放在onMounted/nextTick中

#### 📝 记忆要点
- **时机**：beforeCreate之前
- **无this**：实例未创建
- **入口**：props/context作为参数

#### ✅ 快速自测
- [ ] setup中能否访问attrs/slots？如何获取？
- [ ] setup和beforeCreate谁先执行？

---

**5.** 如何在 `<script setup>` 中定义 props 和 emits？

- defineProps() 宏
- defineEmits() 宏

---

## 5. <script setup> 定义props/emits ⭐⭐ 💡

### 原始答案
- defineProps() 宏
- defineEmits() 宏

---

### 📊 技术点评

#### 🎯 核心考点
- 编译时宏用法与类型推断
- emits显式声明的好处

#### 💼 实际应用场景
1. TypeScript组件签名声明
2. IDE自动补全、事件校验

#### ⚠️ 技术纠正（如有）
- 补充：宏只能在顶层调用；emits声明可校验事件名与参数。

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：defineExpose、emits选项、TS类型推断
- 前置要求：SFC编译流程

#### 💡 实战示例（重点题目）
未提供（难度中等且已有示例覆盖）

#### 📝 记忆要点
- **defineProps**：顶层调用，返回响应式只读对象
- **defineEmits**：顶层调用，校验事件
- **类型**：配合TS接口/类型别名

#### ✅ 快速自测
- [ ] defineEmits如何做参数校验？
- [ ] defineProps返回值是否可解构？

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

#### 💼 实际应用场景
1. 权限控制视图（偶尔变化）
2. 折叠面板/弹窗频繁切换

#### ⚠️ 技术纠正（如有）
- 补充：v-show不支持template和v-else；首次渲染v-show一定创建DOM。

#### 🔗 知识关联
- 所属模块：模板指令、性能优化
- 相关知识点：lazy mount、keep-alive
- 前置要求：虚拟DOMdiff

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
- 频繁显隐用v-show，条件渲染或懒加载用v-if
- 大组件首屏性能敏感时用v-if并配合异步组件

#### 📝 记忆要点
- **创建成本**：if懒渲染，show立即
- **切换成本**：if重建，show样式切换
- **限制**：show无v-else/模板

#### ✅ 快速自测
- [ ] v-show会触发生命周期吗？
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
- Diff过程中节点复用与状态错位
- key选择策略（稳定唯一）

#### 💼 实际应用场景
1. 表格/列表行的增删改
2. 表单列表（避免输入框错位）

#### ⚠️ 技术纠正（如有）
- 补充：不建议用index作为可变列表的key；key作用于同级节点。

#### 🔗 知识关联
- 所属模块：模板指令、虚拟DOM
- 相关知识点：patch算法、fragment
- 前置要求：Diff原理

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
- key使用稳定业务id，避免index
- 同级唯一，避免复用导致状态串行

#### 📝 记忆要点
- **唯一稳定**：业务id优先
- **防错位**：避免index
- **同级生效**：跨层无效

#### ✅ 快速自测
- [ ] 为什么index会导致输入框错乱？
- [ ] key作用于哪些节点范围？

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
- 子组件禁止直接修改props

#### 💼 实际应用场景
1. 表单组件封装（v-model语义）
2. 状态提升与全局状态管理

#### ⚠️ 技术纠正（如有）
- 补充：可通过派生computed或拷贝本地状态避免直接修改props。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、受控组件、不可变数据
- 前置要求：props/emit基础

#### 💡 实战示例（重点题目）
未提供（难度中等且已有相关示例）

#### 📝 记忆要点
- **父管源**：数据归父
- **子不改**：props只读
- **事件上行**：emit更新

#### ✅ 快速自测
- [ ] 子组件想改props应怎么做？
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

#### 💼 实际应用场景
1. UI原子组件、业务组件划分
2. 插件形式全局注册

#### ⚠️ 技术纠正（如有）
- 补充：Vue3移除functional标记，函数式组件用普通函数返回render。

#### 🔗 知识关联
- 所属模块：组件化
- 相关知识点：SFC、全局/局部注册、异步组件
- 前置要求：模板语法

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **SFC**：template+script+style
- **注册**：app.component/局部import
- **通信**：props/emit/slots

#### ✅ 快速自测
- [ ] Vue3函数式组件如何写？
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
- SFC概念与编译流程
- 关注点分离与工程化

#### 💼 实际应用场景
1. 大型项目模块化开发
2. 支持语言预处理（TS/SCSS）

#### ⚠️ 技术纠正（如有）
- 补充：SFC=Single File Component；支持script setup、scoped样式、CSS vars。

#### 🔗 知识关联
- 所属模块：组件化、构建工具
- 相关知识点：Vite/SFC编译、script setup
- 前置要求：基础HTML/CSS/JS

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **一体化**：模板/逻辑/样式同文件
- **编译**：由@vue/compiler-sfc处理
- **扩展**：lang="ts/scss"等

#### ✅ 快速自测
- [ ] scoped样式如何避免穿透？
- [ ] script setup的编译优势？

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
- 简写语法(:/@)与对象绑定

#### 💼 实际应用场景
1. 批量传递props/attrs
2. 事件对象与修饰符组合

#### ⚠️ 技术纠正（如有）
- 补充：v-bind可传对象(:class/:style)；v-on支持对象/数组写法，Vue3移除.native。

#### 🔗 知识关联
- 所属模块：模板语法
- 相关知识点：修饰符、透传属性
- 前置要求：指令基础

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **属性绑定**：v-bind或:
- **事件监听**：v-on或@
- **对象语法**：class/style/事件批量

#### ✅ 快速自测
- [ ] 如何同时绑定多个事件处理？
- [ ] v-on.native在Vue3如何替换？

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
- onMounted后安全使用

#### 💼 实际应用场景
1. 聚焦输入框、滚动控制
2. 调用子组件公开方法

#### ⚠️ 技术纠正（如有）
- 拼写/命名需一致；推荐<script setup>写法并使用可选链。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：defineExpose、onMounted
- 前置要求：ref基础

#### 💡 实战示例（重点题目）
未提供（相关示例已在其他题）

#### 📝 记忆要点
- **创建ref**：const el = ref(null)
- **绑定**：ref="el"
- **访问时机**：onMounted后

#### ✅ 快速自测
- [ ] 组件ref默认暴露什么？
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

#### 💼 实际应用场景
1. TS组件签名与IDE提示
2. 事件白名单控制，减少误绑

#### ⚠️ 技术纠正（如有）
- 补充：只能在<script setup>顶层调用；支持默认值/校验函数。

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：defineExpose、emits选项、TS接口
- 前置要求：SFC编译

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **顶层宏**：编译期消解
- **类型友好**：推断props/emit类型
- **安全**：限制可触发事件

#### ✅ 快速自测
- [ ] 如何对事件参数做类型校验？
- [ ] defineProps的默认值写法？

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
- 多v-model与参数修饰符
- Vue2的.sync差异

#### 💼 实际应用场景
1. 表单组件封装（输入框/选择器）
2. 支持双向绑定的复杂组件（Dialog可见性+数据）

#### ⚠️ 技术纠正（如有）
- 补充：Vue3支持`v-model:title`等多模型；修饰符通过emits参数接收。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、受控属性、sync迁移
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
- 封装组件时明确model字段名，支持多模型
- 不直接修改props，统一用update事件

#### 📝 记忆要点
- **协议**：modelValue + update:modelValue
- **多模型**：v-model:xxx
- **修饰符**：通过emits入参传递

#### ✅ 快速自测
- [ ] Vue3多v-model如何声明emits？
- [ ] v-model修饰符如何在子组件拿到？

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
- template条件包裹与动态组件

#### 💼 实际应用场景
1. 首屏懒加载、权限控制
2. Tab/弹窗显隐切换

#### ⚠️ 技术纠正（如有）
- 补充：可结合Suspense、异步组件；v-show不支持template。

#### 🔗 知识关联
- 所属模块：模板指令
- 相关知识点：v-slot条件、动态组件
- 前置要求：v-if/v-show基础

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **v-if链**：条件渲染
- **v-show**：频繁切换
- **动态组件**：component is

#### ✅ 快速自测
- [ ] v-if与v-show选择依据？
- [ ] template结合v-if的作用？

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
- props是首选通道
- provide/inject适合跨层共享

#### 💼 实际应用场景
1. 基础组件配置下发
2. 全局主题/上下文共享

#### ⚠️ 技术纠正（如有）
- eventBus不推荐，Vue3建议状态管理或provide/inject。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、inject、全局状态
- 前置要求：props定义

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **props首选**，类型校验
- **跨级**：provide/inject
- **总线替代**：Pinia/库

#### ✅ 快速自测
- [ ] provide的数据是响应式吗？
- [ ] props更新如何触发子组件？

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
- emit事件上行
- v-model语法糖

#### 💼 实际应用场景
1. 表单子项通知父级提交
2. 弹窗关闭/确认事件

#### ⚠️ 技术纠正（如有）
- inject不用于上行；eventBus不推荐。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits声明、v-model
- 前置要求：事件机制

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **emit**：事件上行
- **v-model**：update:modelValue
- **总线慎用**：优先状态管理

#### ✅ 快速自测
- [ ] emit如何做类型校验？
- [ ] v-model的事件名是什么？

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

#### 💼 实际应用场景
1. 主题、国际化上下文
2. 表单/表格上下文共享

#### ⚠️ 技术纠正（如有）
- 补充：注入的响应式对象需保持引用；可用readonly限制修改。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：作用域、状态管理替代
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **祖先provide**，后代inject
- **保持引用**：对象共享
- **默认值**：inject(key, default)

#### ✅ 快速自测
- [ ] provide传基本类型为何不响应？
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

#### 💼 实际应用场景
1. UI组件库通信模式
2. 中大型应用状态设计

#### ⚠️ 技术纠正（如有）
- 补充：兄弟通信建议用状态管理（Pinia）或上提状态，不推荐eventBus。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：slots、全局store、Router事件
- 前置要求：props/emit基础

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **父子**：props/emit
- **跨级**：provide/inject
- **兄弟/全局**：store

#### ✅ 快速自测
- [ ] 事件总线在Vue3为何不推荐？
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
- 状态提升与共享store
- 避免事件总线副作用

#### 💼 实际应用场景
1. Tab切换共享状态
2. 通知中心/消息状态共享

#### ⚠️ 技术纠正（如有）
- 首选上提状态或Pinia；provide/inject仅适用于有共同祖先。

#### 🔗 知识关联
- 所属模块：组件通信、状态管理
- 相关知识点：Pinia、context提升
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **上提**：父级管理
- **store**：Pinia共享
- **总线慎用**：调试困难

#### ✅ 快速自测
- [ ] 兄弟通信为何推荐状态管理？
- [ ] provide/inject适合什么层级关系？

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
- Vue3合并attrs/listeners

#### 💼 实际应用场景
1. 基础组件封装，透传原生属性
2. 高阶组件包装

#### ⚠️ 技术纠正（如有）
- Vue3已移除$listeners，事件也包含在attrs；inheritAttrs默认为true。

#### 🔗 知识关联
- 所属模块：透传属性
- 相关知识点：useAttrs、emits、fallthrough
- 前置要求：组件封装

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **Vue3**：attrs含事件
- **控制**：inheritAttrs=false自定义透传
- **工具**：useAttrs读取

#### ✅ 快速自测
- [ ] Vue3事件为什么会出现在attrs？
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
- 未声明props/事件自动落到根元素
- inheritAttrs控制

#### 💼 实际应用场景
1. 基础Button/Input组件透传原生属性

#### ⚠️ 技术纠正（如有）
- 补充：多根节点需手动使用v-bind="attrs"分发。

#### 🔗 知识关联
- 所属模块：透传属性
- 相关知识点：useAttrs、emits
- 前置要求：props

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **未声明自动透传**
- **多根需手动分发**
- **inheritAttrs**可关闭

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
- 模板ref与defineExpose
- 避免直接$parent/$children

#### 💼 实际应用场景
1. 父组件调用子组件方法（校验、重置）
2. 自定义可控组件暴露API

#### ⚠️ 技术纠正（如有）
- expose在<script setup>中使用defineExpose；避免越级访问破坏封装。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：template refs、expose
- 前置要求：ref/onMounted

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **子->父**：emit
- **父->子**：ref+defineExpose
- **谨慎越级**：保持封装

#### ✅ 快速自测
- [ ] defineExpose不写会怎样？
- [ ] 如何在父组件等待子组件ref可用？

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
- 总线在Vue3中的替代方案

#### 💼 实际应用场景
1. 老项目跨层通信
2. 快速原型的轻量通信

#### ⚠️ 技术纠正（如有）
- 推荐替代：Pinia/全局事件库或provide/inject；总线易调试困难、内存泄漏。

#### 🔗 知识关联
- 所属模块：组件通信、状态管理
- 相关知识点：mitt、Pinia
- 前置要求：事件模型

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **模式**：pub-sub
- **风险**：调试难、泄漏
- **替代**：Pinia/提供注入

#### ✅ 快速自测
- [ ] 事件总线常见问题？
- [ ] mitt相比Vue2总线优势？

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

#### 💼 实际应用场景
1. 封装输入组件/选择器
2. 支持多v-model的复合组件

#### ⚠️ 技术纠正（如有）
- 补充：需要在emits中声明update:modelValue；多模型对应prop/事件名保持一致。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、修饰符透传
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
未提供（已在题14示例覆盖）

#### 📝 记忆要点
- **prop名**：modelValue
- **事件名**：update:modelValue
- **多模型**：v-model:xxx

#### ✅ 快速自测
- [ ] 自定义组件如何拿到修饰符？
- [ ] emits不声明update事件会怎样？

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

#### 💼 实际应用场景
1. DOM依赖逻辑放置位置
2. 清理副作用、防泄漏

#### ⚠️ 技术纠正（如有）
- 拼写修正：befroeCreate→beforeCreate；补充activated/deactivated/errorCaptured。

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

onMounted(() => {
  console.log('mounted', box.value)
})

onActivated(() => console.log('keep-alive激活'))
onDeactivated(() => console.log('keep-alive失活'))

onBeforeUnmount(() => {
  console.log('即将卸载，移除监听')
})
</script>
```
**最佳实践：**
- DOM/订阅操作放onMounted；清理在onBeforeUnmount/onUnmounted
- 缓存组件关注activated/deactivated

#### 📝 记忆要点
- **创建**：setup→beforeCreate→created
- **挂载**：beforeMount→mounted
- **更新**：beforeUpdate→updated
- **卸载**：beforeUnmount→unmounted
- **缓存**：activated/deactivated

#### ✅ 快速自测
- [ ] errorCaptured何时触发？
- [ ] keep-alive下mounted会重复吗？

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
- DOM可用时机

#### 💼 实际应用场景
1. SSR/水合前避免DOM访问
2. 初始化异步数据加载位置

#### ⚠️ 技术纠正（如有）
- Vue3中created用onBeforeMount替代？实际仍支持；onMounted仅在客户端执行。

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：setup、onBeforeMount
- 前置要求：生命周期顺序

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **created**：数据就绪，无DOM
- **mounted**：DOM可操作
- **SSR**：mounted仅客户端

#### ✅ 快速自测
- [ ] created里能访问refs吗？
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
- keep-alive与卸载差异

#### 💼 实际应用场景
1. 解绑事件/定时器
2. 取消网络请求

#### ⚠️ 技术纠正（如有）
- 补充：keep-alive失活不会触发unmounted；需用deactivated。

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：activated/deactivated
- 前置要求：副作用管理

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **before**：清理/提示
- **unmounted**：释放资源
- **缓存**：用deactivated

#### ✅ 快速自测
- [ ] keep-alive关闭时哪个钩子触发？
- [ ] 如何在卸载时取消fetch？

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
- 与setup返回无关

#### 💼 实际应用场景
1. 组合式函数内复用生命周期

#### ⚠️ 技术纠正（如有）
- 补充：hook必须在setup同步调用；不要在条件/回调中调用。

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：hooks设计、依赖注入
- 前置要求：setup函数

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **import使用**：onXxx
- **顶层调用**：不可放条件
- **组合式**：自定义hook内再注册

#### ✅ 快速自测
- [ ] 为什么hook不能放在if里？
- [ ] 如何在自定义hook里暴露生命周期？

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

#### 💼 实际应用场景
1. 依赖父数据的子初始化
2. 测试挂载顺序避免空ref

#### ⚠️ 技术纠正（如有）
- 补充：更新阶段子beforeUpdate在父之前；卸载阶段父beforeUnmount→子→父。

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：更新/卸载顺序
- 前置要求：基础生命周期

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **挂载**：父创建→子创建→子挂载→父挂载
- **更新**：父更新→子更新→父updated
- **卸载**：父beforeUnmount→子卸载→父unmounted

#### ✅ 快速自测
- [ ] 更新阶段顺序？
- [ ] keep-alive对子钩子影响？

---

**31.** 在哪个生命周期钩子中可以访问 DOM？

- onMounted

---

## 31. DOM访问时机 ⭐ 📌

### 原始答案
- onMounted

---

### 📊 技术点评

#### 🎯 核心考点
- DOM可用时机

#### 💼 实际应用场景
1. 第三方库初始化

#### ⚠️ 技术纠正（如有）
- 可配合nextTick在更新后访问；SSR中mounted仅客户端执行。

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：nextTick、onUpdated
- 前置要求：模板引用

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **初次**：onMounted
- **更新后**：nextTick/onUpdated
- **SSR**：仅客户端

#### ✅ 快速自测
- [ ] 更新后的DOM读取用什么？
- [ ] onMounted在SSR何时触发？

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
- KeepAlive缓存钩子
- 状态恢复/暂停

#### 💼 实际应用场景
1. 缓存列表的滚动位置恢复
2. 暂停/恢复定时器

#### ⚠️ 技术纠正（如有）
- keep-alive包裹的组件才触发；不会触发unmounted。

#### 🔗 知识关联
- 所属模块：生命周期、性能
- 相关知识点：keep-alive、状态持久化
- 前置要求：组件缓存概念

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **激活**：onActivated
- **失活**：onDeactivated
- **场景**：缓存组件状态恢复

#### ✅ 快速自测
- [ ] keep-alive失活会触发unmounted吗？
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

#### 💼 实际应用场景
1. 自动聚焦、权限隐藏
2. 图片懒加载

#### ⚠️ 技术纠正（如有）
- 补充：Vue3指令钩子名称与组件生命周期一致；组件内局部指令在directives选项或setup返回。

#### 🔗 知识关联
- 所属模块：指令
- 相关知识点：指令钩子、binding参数
- 前置要求：模板指令

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **注册**：app.directive或组件内
- **钩子**：created/mounted/updated等
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

#### 💼 实际应用场景
1. 懒加载、拖拽指令时机选择

#### ⚠️ 技术纠正（如有）
- 无明显错误，补充：beforeMount常用初始化，unmounted清理。

#### 🔗 知识关联
- 所属模块：指令
- 相关知识点：binding、cleanup
- 前置要求：指令注册

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **创建**：created
- **挂载/更新/卸载**：与组件同步
- **清理**：unmounted

#### ✅ 快速自测
- [ ] 指令中何时添加监听？
- [ ] 为什么要在unmounted移除？

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

#### 💼 实际应用场景
1. 阻止冒泡/默认行为
2. 捕获阶段监听

#### ⚠️ 技术纠正（如有）
- 补充：按键修饰符（.enter/.esc）；v-model修饰符（.lazy/.number/.trim）。

#### 🔗 知识关联
- 所属模块：模板指令
- 相关知识点：事件模型
- 前置要求：DOM事件

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **事件**：stop/prevent/once
- **按键**：enter/esc
- **v-model**：lazy/number/trim

#### ✅ 快速自测
- [ ] .passive适用场景？
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
- component is切换组件
- keep-alive配合缓存

#### 💼 实际应用场景
1. Tab页切换不同子组件
2. 表单步骤组件切换

#### ⚠️ 技术纠正（如有）
- 补充：需提供唯一key避免状态串；is可接受异步组件。

#### 🔗 知识关联
- 所属模块：组件化
- 相关知识点：异步组件、keep-alive
- 前置要求：组件注册

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **component is**：动态渲染
- **key**：保持状态
- **缓存**：配合keep-alive

#### ✅ 快速自测
- [ ] is可否传异步组件？
- [ ] key缺失会怎样？

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

#### 💼 实际应用场景
1. 列表/表格列渲染定制
2. 卡片/弹窗内容扩展

#### ⚠️ 技术纠正（如有）
- 补充：作用域插槽通过v-slot/ # 接收slotProps。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：v-slot、动态插槽名
- 前置要求：组件封装

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **默认/具名/作用域**
- **语法**：v-slot:#
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

#### 💼 实际应用场景
1. 表格列slot
2. 卡片header/footer自定义

#### ⚠️ 技术纠正（如有）
- 补充：默认插槽简写v-slot默认；多插槽时需要template包裹。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：动态插槽名、fallback内容
- 前置要求：slot基础

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **name**：指定插槽
- **v-slot/#**：接受slotProps
- **模板包裹**：多slot需要

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

#### 💼 实际应用场景
1. 静态大DOM块
2. 依赖条件切换时避免重复渲染

#### ⚠️ 技术纠正（如有）
- 补充：v-memo接收依赖数组；v-once后续更新不再渲染。

#### 🔗 知识关联
- 所属模块：性能优化
- 相关知识点：compile cache、静态提升
- 前置要求：模板指令

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **v-once**：首渲染后跳过
- **v-memo**：依赖不变跳过
- **场景**：静态/昂贵片段

#### ✅ 快速自测
- [ ] v-memo依赖变了会怎样？
- [ ] v-once能与v-if共存吗？

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

#### 💼 实际应用场景
1. 简单计算/过滤

#### ⚠️ 技术纠正（如有）
- 不能使用控制流/声明；避免复杂逻辑放模板。

#### 🔗 知识关联
- 所属模块：模板语法
- 相关知识点：计算属性/方法
- 前置要求：指令基础

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **表达式**：无语句
- **作用域**：组件上下文
- **复杂逻辑**：移至computed/method

#### ✅ 快速自测
- [ ] 模板能写if语句吗？
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
- TS/Tree-shaking友好性

#### 💼 实际应用场景
1. 跨组件逻辑复用（hooks）
2. 大型组件拆分关注点

#### ⚠️ 技术纠正（如有）
- 补充：Composition API不依赖this，更利于类型推断；Options在Vue3仍可用。

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：setup、组合式函数、script setup
- 前置要求：Options API理解

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

// 组合式函数复用逻辑
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
- 将可复用逻辑抽成hooks；保持单一职责
- Options迁移时先提取data/method到setup再重构

#### 📝 记忆要点
- **无this**：函数式组织
- **高复用**：hooks抽取
- **类型友好**：TS推断好

#### ✅ 快速自测
- [ ] 组合式函数与mixins差异？
- [ ] 如何在hook中注册生命周期？

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

#### 💼 实际应用场景
1. 更简洁的SFC编写体验
2. TS类型推断+顶层await支持

#### ⚠️ 技术纠正（如有）
- 补充：无需return；组件名称自动推导；与普通setup不可混用同文件。

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：defineProps/Emits/Expose宏
- 前置要求：setup基础

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **更少样板**：无需export default
- **类型好**：自动推断
- **宏**：defineProps/Emits/Expose

#### ✅ 快速自测
- [ ] script setup能与普通script共存吗？
- [ ] 顶层await何时可用？

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

#### 💼 实际应用场景
1. 精确监听某字段触发请求
2. 自动依赖的调试逻辑/日志

#### ⚠️ 技术纠正（如有）
- watchEffect默认立即执行且无旧值；应处理stop/cleanup。

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：computed、flush时机、stop
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
```vue
<script setup>
import { ref, watch, watchEffect, onUnmounted } from 'vue'

const keyword = ref('')
const result = ref('')

// 精确监听
const stopWatch = watch(keyword, async (val) => {
  if (!val) return
  result.value = `fetch:${val}` // 模拟请求
}, { flush: 'post' })

// 自动依赖
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
- 需要旧值/精确源用watch；自动收集小型副作用用watchEffect
- 使用onCleanup/stop避免泄漏

#### 📝 记忆要点
- **源**：watch指定，effect自动
- **时机**：watch默认懒，effect立即
- **旧值**：仅watch

#### ✅ 快速自测
- [ ] watchEffect如何清理副作用？
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

#### 💼 实际应用场景
1. 大体积数据（图表配置、地图实例）
2. 外部库实例存储

#### ⚠️ 技术纠正（如有）
- 更新深层需手动triggerRef/重赋值；shallowReactive无法追踪子属性。

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：markRaw, triggerRef
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **浅层**：只跟踪第一层
- **深变更需手动触发**
- **适用**：大对象/实例

#### ✅ 快速自测
- [ ] shallowRef深层变更如何触发？
- [ ] markRaw和shallowReactive区别？

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
- 绑定ref到对象属性

#### 💼 实际应用场景
1. 组合式函数暴露响应式字段
2. 解构store/state

#### ⚠️ 技术纠正（如有）
- toRef可绑定不存在属性并保持与源同步；勿对非响应对象使用期望响应。

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：ref/reactive、computed
- 前置要求：解构语法

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **解构**：toRefs
- **单属性**：toRef(source, key)
- **同步**：与源绑定

#### ✅ 快速自测
- [ ] toRef绑定不存在属性会怎样？
- [ ] 解构reactive为何丢响应？

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

#### 💼 实际应用场景
1. Modal/Toast渲染到body
2. 固定层级的浮层/Popover

#### ⚠️ 技术纠正（如有）
- 目标容器需存在；适当清理避免残留DOM。

#### 🔗 知识关联
- 所属模块：组件高级特性
- 相关知识点：Teleport target、disable
- 前置要求：DOM层级

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **to**：指定目标选择器/节点
- **逻辑不变**：事件/状态保留
- **场景**：模态/提示

#### ✅ 快速自测
- [ ] Teleport目标不存在会怎样？
- [ ] 如何禁用Teleport暂时回原地？

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

#### 💼 实际应用场景
1. 首屏异步数据组件
2. 懒加载路由组件

#### ⚠️ 技术纠正（如有）
- 补充：支持error/timeout插槽；仅在异步依赖未就绪时触发fallback。

#### 🔗 知识关联
- 所属模块：组件高级特性
- 相关知识点：异步组件、Promise、错误处理
- 前置要求：异步setup

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **fallback**：加载占位
- **异步setup**：支持
- **错误插槽**：onErrorCaptured

#### ✅ 快速自测
- [ ] Suspense何时不生效？
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
- script setup中控制暴露
- 限制可访问面，增强封装

#### 💼 实际应用场景
1. 父组件通过ref调用子方法
2. 限制仅暴露必要API

#### ⚠️ 技术纠正（如有）
- 仅<script setup>需要；否则默认全部暴露。

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：template ref
- 前置要求：setup封装

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **控制暴露**：defineExpose({ fn })
- **默认不暴露**：script setup
- **封装**：仅公开必要

#### ✅ 快速自测
- [ ] defineExpose不写会怎样？
- [ ] 如何结合ref使用？

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
- 微任务队列、DOM更新时机
- 更新后获取最新布局/状态

#### 💼 实际应用场景
1. 表格列显隐后重新计算宽度
2. 动画/滚动位置更新

#### ⚠️ 技术纠正（如有）
- 补充：await nextTick()即可；避免滥用增加额外微任务。

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：flush模式、DOM更新
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
- 在数据更新后且需要读取DOM时使用
- 尽量批量更新后一次nextTick，避免重复

#### 📝 记忆要点
- **等待**：DOM刷新
- **使用**：await nextTick()
- **场景**：读取尺寸/聚焦

#### ✅ 快速自测
- [ ] nextTick基于什么队列？
- [ ] 更新频繁时如何减少nextTick次数？

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

#### 💼 实际应用场景
1. 旧项目迁移排查
2. 第三方库兼容性评估

#### ⚠️ 技术纠正（如有）
- 错误：transition-group、v-once、v-memo未被移除；filters移除但可用computed/方法替代；.native移除。

#### 🔗 知识关联
- 所属模块：迁移指南
- 相关知识点：v-model变更、全局API调整
- 前置要求：Vue2经验

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **移除**：filters、.native、$on/$off、内联模板
- **保留**：transition-group/v-once
- **迁移**：用computed/method替代filters

#### ✅ 快速自测
- [ ] .native被什么替代？
- [ ] filters迁移方案？

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
- DOM结构优化

#### 💼 实际应用场景
1. 表格行/列表项无需包裹
2. 组件返回平级元素

#### ⚠️ 技术纠正（如有）
- 无明显错误，补充：v-if/v-for仍需单一模板根。

#### 🔗 知识关联
- 所属模块：编译优化
- 相关知识点：模板编译、虚拟DOM
- 前置要求：SFC结构

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **多根**：无需额外div
- **虚拟节点**：Fragment包装
- **限制**：指令需作用于具体元素

#### ✅ 快速自测
- [ ] 多根组件如何添加transition？
- [ ] v-if作用于多根怎么办？

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

#### 💼 实际应用场景
1. 对外暴露状态时防止修改
2. 组合式函数返回值保护

#### ⚠️ 技术纠正（如有）
- readonly仍可通过原始对象修改；const仅限制变量绑定。

#### 🔗 知识关联
- 所属模块：响应式工具
- 相关知识点：shallowReadonly、toRaw
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **readonly**：代理只读
- **const**：绑定不可重指
- **绕过**：原始对象可改

#### ✅ 快速自测
- [ ] readonly包装reactive后还能修改源吗？
- [ ] const能否阻止对象属性变更？

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
- SFC类型支持
- 组件props/emits类型声明

#### 💼 实际应用场景
1. 组件库的类型导出
2. 业务组件参数安全

#### ⚠️ 技术纠正（如有）
- 推荐<script setup lang="ts">；可用DefineComponent/PropType/EmitsOptions。

#### 🔗 知识关联
- 所属模块：类型系统
- 相关知识点：volar类型推断、泛型组件
- 前置要求：TS基础

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **lang="ts"**：启用TS
- **类型**：PropType/Emit类型
- **工具**：defineComponent/script setup

#### ✅ 快速自测
- [ ] props的TS类型如何声明？
- [ ] defineEmits如何声明类型？

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

#### 💼 实际应用场景
1. 处理第三方库要求原始对象
2. 统一获取ref或普通值

#### ⚠️ 技术纠正（如有）
- toRaw返回非响应对象，勿长期持有用于修改后再回写。

#### 🔗 知识关联
- 所属模块：响应式工具
- 相关知识点：markRaw、shallowReactive
- 前置要求：ref/reactive

#### 💡 实战示例（重点题目）
未提供

#### 📝 记忆要点
- **isRef**：判定
- **unref**：提值
- **toRaw**：取原对象

#### ✅ 快速自测
- [ ] toRaw返回值修改会触发视图吗？
- [ ] unref在模板中等价于什么？

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
- 类型安全与IDE提示

#### 💼 实际应用场景
1. 组件库对外事件规范化
2. 自定义v-model事件声明

#### ⚠️ 技术纠正（如有）
- 补充：未声明事件会在开发模式警告；emits与inheritAttrs分离。

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
- 声明确切事件与参数类型；自定义v-model必须声明update事件
- 结合TS接口提升IDE提示与防误拼

#### 📝 记忆要点
- **白名单**：限制可触发事件
- **校验**：可函数校验参数
- **TS友好**：类型推断

#### ✅ 快速自测
- [ ] emits未声明事件触发会怎样？
- [ ] 如何为update:modelValue声明类型？

---
