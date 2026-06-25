# 141. [中级]** ES6模块与CommonJS模块的区别

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察两种主要模块系统的差异，面试官想了解你是否理解现代JavaScript模块化的发展和实际应用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：模块化（5道）。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- Es6 module 是采用 import 和 export 的方式；模块内的作用域不提升到外部；可以动态导入；可以导出任何值
- commonJs 是采用 require的方式

### 问题本质解读 这道题考察两种主要模块系统的差异，面试官想了解你是否理解现代JavaScript模块化的发展和实际应用场景。

### 知识点系统梳理

**ES6模块（ESM）特点：**

1. **静态结构**：编译时确定依赖关系
2. **异步加载**：支持动态import()
3. **严格模式**：默认运行在严格模式下
4. **顶层this**：顶层this是undefined
5. **Tree-shaking友好**：支持静态分析

**CommonJS模块特点：**

1. **动态加载**：运行时确定依赖关系
2. **同步加载**：require()是同步的
3. **缓存机制**：模块会被缓存
4. **顶层this**：顶层this指向module.exports
5. **Node.js原生支持**：Node.js的默认模块系统

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. ES6模块 vs CommonJS 基础对比

// === ES6模块 (math-esm.js) ===
// 命名导出
export const PI = 3.14159
export function add(a, b) {
  return a + b
}

// 默认导出
export default function multiply(a, b) {
  return a * b
}

// 重新导出
export { subtract } from './utils.js'

// === CommonJS模块 (math-cjs.js) ===
const PI = 3.14159
function add(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

// 导出方式1
module.exports = {
  PI,
  add,
  multiply,
}

// 导出方式2
exports.PI = PI
exports.add = add
exports.multiply = multiply

// 2. 导入方式对比

// === ES6模块导入 ===
// 默认导入
import multiply from './math-esm.js'

// 命名导入
import { PI, add } from './math-esm.js'

// 混合导入
import multiply, { PI, add } from './math-esm.js'

// 重命名导入
import { add as sum } from './math-esm.js'

// 命名空间导入
import * as math from './math-esm.js'

// 动态导入
const mathModule = await import('./math-esm.js')

// === CommonJS导入 ===
// 整体导入
const math = require('./math-cjs.js')

// 解构导入
const { PI, add } = require('./math-cjs.js')

// 重命名导入
const { add: sum } = require('./math-cjs.js')

// 3. 加载时机差异
console.log('=== 加载时机对比 ===')

// ES6模块 - 静态分析
// 以下代码在编译时就能确定依赖关系
import { config } from './config.js' // 提升到顶部

if (false) {
  // 这个import仍然会被执行，因为是静态的
  import { unused } from './unused.js'
}

// CommonJS - 动态加载
// 以下代码在运行时才确定依赖关系
if (process.env.NODE_ENV === 'development') {
  const devTools = require('./dev-tools.js') // 条件加载
}

// 4. 循环依赖处理差异

// === ES6模块循环依赖 ===
// a-esm.js
import { b } from './b-esm.js'
export const a = 'a'
console.log('a.js:', b) // undefined (TDZ)

// b-esm.js
import { a } from './a-esm.js'
export const b = 'b'
console.log('b.js:', a) // undefined (TDZ)

// === CommonJS循环依赖 ===
// a-cjs.js
const { b } = require('./b-cjs.js')
module.exports = { a: 'a' }
console.log('a.js:', b) // undefined

// b-cjs.js
const { a } = require('./a-cjs.js')
module.exports = { b: 'b' }
console.log('b.js:', a) // undefined

// 5. 实际应用场景对比

// === ES6模块适用场景 ===
// 现代前端项目
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

// 工具库开发
// utils.js
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

export const throttle = (fn, delay) => {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

// === CommonJS适用场景 ===
// Node.js服务器
// server.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const config = require('./config')

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

// 动态加载中间件
if (config.isDevelopment) {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

module.exports = app

// 6. 性能和优化差异

// === ES6模块优化 ===
// Tree-shaking友好
import { specific } from 'large-library' // 只导入需要的部分

// 代码分割
const LazyComponent = () => import('./LazyComponent.vue')

// === CommonJS优化 ===
// 条件加载
const heavyModule =
  process.env.NODE_ENV === 'production'
    ? require('./heavy-module-prod')
    : require('./heavy-module-dev')

// 缓存利用
const cache = require('./cache')
if (!cache.has('expensive-data')) {
  const expensiveModule = require('./expensive-module')
  cache.set('expensive-data', expensiveModule.getData())
}
```

**Vue 3框架应用示例：**

```javascript
// === ES6模块在Vue 3中的应用 ===

// composables/useCounter.js - 组合式函数
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => (count.value = initialValue)

  const isEven = computed(() => count.value % 2 === 0)
  const isPositive = computed(() => count.value > 0)

  return {
    count,
    increment,
    decrement,
    reset,
    isEven,
    isPositive,
  }
}
```

```vue
// components/Counter.vue
<template>
  <div class="counter">
    <h2>计数器: {{ count }}</h2>
    <p>状态: {{ isEven ? '偶数' : '奇数' }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
// ES6模块导入组合式函数
import { useCounter } from '@/composables/useCounter.js'

const { count, increment, decrement, reset, isEven } = useCounter(10)
</script>
```

```javascript
// utils/api.js - API工具模块
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 命名导出
export const get = (url, config) => api.get(url, config)
export const post = (url, data, config) => api.post(url, data, config)
export const put = (url, data, config) => api.put(url, data, config)
export const del = (url, config) => api.delete(url, config)

// 默认导出
export default api

// stores/user.js - Pinia状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { get, post } from '@/utils/api.js'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '游客')

  const login = async credentials => {
    try {
      const response = await post('/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
    } catch (error) {
      throw new Error('登录失败')
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isLoggedIn,
    userName,
    login,
    logout,
  }
})

// === Node.js中的CommonJS应用 ===

// config/database.js
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectDB

// middleware/auth.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: '无访问权限' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: '用户不存在' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: '无效的token' })
  }
}

module.exports = auth
```

**核心差异对比表：**

| 特性         | ES6模块               | CommonJS               |
| ------------ | --------------------- | ---------------------- |
| 语法         | import/export         | require/module.exports |
| 加载时机     | 编译时静态分析        | 运行时动态加载         |
| 加载方式     | 异步加载              | 同步加载               |
| 顶层this     | undefined             | module.exports         |
| 严格模式     | 默认严格模式          | 非严格模式             |
| Tree-shaking | 支持                  | 不支持                 |
| 循环依赖     | TDZ处理               | 返回部分导出           |
| 动态导入     | import()              | require()              |
| 浏览器支持   | 现代浏览器原生支持    | 需要打包工具           |
| Node.js支持  | 需要.mjs或type:module | 原生支持               |

### 记忆要点总结

- ES6模块是静态的，编译时确定依赖关系
- CommonJS是动态的，运行时加载模块
- ES6模块支持Tree-shaking，有利于代码优化
- CommonJS在Node.js中原生支持，ES6模块需要配置
- 现代前端开发推荐使用ES6模块
- 服务端开发CommonJS仍然广泛使用

## 实战应用举例

前端业务代码优先使用 ES Module，方便 Vite/Rollup 做静态分析和 tree-shaking。

```javascript
// services/user.js
export async function getUser(id) {
  return fetch(`/api/users/${id}`).then(res => res.json())
}

// page.js
import { getUser } from './services/user.js'
```

## 使用场景说明和对比

| 对比点 | ES Module | CommonJS |
| --- | --- | --- |
| 加载时机 | 静态，编译期可分析 | 动态，运行时执行 |
| 导出值 | live binding | 导出值拷贝/对象引用 |
| 典型环境 | 现代前端、Vite、Rollup | 传统 Node.js |
| 优化能力 | 更利于 tree-shaking | 静态优化困难 |

新前端项目默认 ES Module；维护老 Node 项目或历史包时才会大量遇到 CommonJS。

## 易错点提示

1. ES Module 的 `import` 必须在顶层静态声明，动态加载用 `import()`。
2. CommonJS 的 `require` 可以写在条件分支里。
3. ES Module 默认严格模式，顶层 `this` 是 `undefined`。
4. Node 中混用 ESM/CJS 要注意 `type: module`、`.mjs`、`.cjs`。
5. tree-shaking 主要依赖 ES Module 的静态结构。

## 记忆要点总结

- ESM 静态，CJS 动态。
- ESM 适合现代前端构建优化。
- CJS 是 Node 历史主流。
- 混用时重点看运行环境和包格式。

## 延伸问题

可以继续追问：141. [中级]** ES6模块与CommonJS模块的区别 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：为什么 ES Module 更适合 tree-shaking？**  
A：因为 import/export 是静态结构，构建工具能在编译期分析哪些导出未被使用。

**Q：CommonJS 能不能动态加载？**  
A：可以，`require()` 是运行时函数调用，可以出现在条件分支里。

## 辅助记忆总结

一句话记：ESM 编译前看清依赖，CJS 跑起来才 require。
