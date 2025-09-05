## 异步编程

### Promise基础（12道）

# **116. [初级]** 什么是Promise？它解决了什么问题？

promise es6新增的用于处理异步请求的新方式。通过链式调用解决了之前的回调地狱问题。promise 状态一旦发生变化就不会再改变

## 深度分析与补充

**问题本质解读：** 这道题考察对Promise核心概念的理解和异步编程发展历程的认知，面试官想了解你是否理解Promise的设计初衷和实际价值。

**知识点系统梳理：**

**Promise的本质：**

- Promise是一个代表异步操作最终完成或失败的对象
- 它是一个容器，保存着某个未来才会结束的事件的结果
- Promise提供统一的API，各种异步操作都可以用同样的方法进行处理

**解决的核心问题：**

1. **回调地狱（Callback Hell）**：多层嵌套回调导致代码难以维护
2. **错误处理困难**：传统回调中错误处理分散且容易遗漏
3. **控制反转**：将回调函数的控制权交给第三方库，缺乏可靠性保证
4. **缺乏组合性**：难以组合多个异步操作

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// ❌ 回调地狱示例
function getUserData(userId, callback) {
  getUser(userId, (err, user) => {
    if (err) {
      callback(err, null)
      return
    }
    getProfile(user.id, (err, profile) => {
      if (err) {
        callback(err, null)
        return
      }
      getPreferences(user.id, (err, preferences) => {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, { user, profile, preferences })
      })
    })
  })
}

// ✅ Promise链式调用解决方案
function getUserData(userId) {
  return getUser(userId)
    .then(user => {
      return Promise.all([user, getProfile(user.id), getPreferences(user.id)])
    })
    .then(([user, profile, preferences]) => {
      return { user, profile, preferences }
    })
    .catch(error => {
      console.error('获取用户数据失败:', error)
      throw error
    })
}

// ✅ 现代async/await写法
async function getUserData(userId) {
  try {
    const user = await getUser(userId)
    const [profile, preferences] = await Promise.all([getProfile(user.id), getPreferences(user.id)])
    return { user, profile, preferences }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    throw error
  }
}

// Promise基础创建和使用
const fetchData = () => {
  return new Promise((resolve, reject) => {
    // 模拟异步操作
    setTimeout(() => {
      const success = Math.random() > 0.5
      if (success) {
        resolve({ data: '请求成功', timestamp: Date.now() })
      } else {
        reject(new Error('网络请求失败'))
      }
    }, 1000)
  })
}

// 使用Promise
fetchData()
  .then(result => {
    console.log('成功:', result)
    return result.data
  })
  .then(data => {
    console.log('处理数据:', data)
  })
  .catch(error => {
    console.error('错误:', error.message)
  })
  .finally(() => {
    console.log('请求完成')
  })
```

**Vue 3框架应用示例：**

```vue
<template>
  <div class="user-profile">
    <div
      v-if="loading"
      class="loading"
    >
      加载中...
    </div>
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>
    <div
      v-else-if="userData"
      class="profile"
    >
      <h2>{{ userData.user.name }}</h2>
      <p>文章数量: {{ userData.posts.length }}</p>
      <p>好友数量: {{ userData.friends.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const userData = ref(null)
const loading = ref(false)
const error = ref(null)

// 使用Promise解决Vue组件中的异步数据加载
const fetchUserData = async userId => {
  loading.value = true
  error.value = null

  try {
    // Promise链式调用获取用户完整信息
    const user = await getUserAPI(userId)
    const [posts, friends] = await Promise.all([
      getUserPostsAPI(user.id),
      getUserFriendsAPI(user.id),
    ])

    userData.value = { user, posts, friends }
  } catch (err) {
    error.value = '获取用户数据失败: ' + err.message
  } finally {
    loading.value = false
  }
}

// 组合式函数：封装Promise逻辑
const useUserData = userId => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetch = () => {
    return fetchUserData(userId)
      .then(result => {
        data.value = result
        return result
      })
      .catch(err => {
        error.value = err.message
        throw err
      })
  }

  return { data, loading, error, fetch }
}

onMounted(() => {
  fetchUserData(123)
})
</script>
```

**Promise的核心特性：**

1. **状态不可逆**：pending → fulfilled/rejected，状态一旦改变就不会再变
2. **链式调用**：每个then方法返回新的Promise，支持链式操作
3. **错误传播**：错误会沿着Promise链向下传播，直到被catch捕获
4. **值传递**：resolve的值会传递给下一个then的回调函数

**记忆要点总结：**

- Promise是异步编程的解决方案，解决回调地狱问题
- 三个状态：pending（等待）、fulfilled（成功）、rejected（失败）
- 核心方法：then、catch、finally
- 状态不可逆，一旦改变就不会再变
- 支持链式调用，提供更好的错误处理机制

# **117. [初级]** Promise有哪几种状态？

- pending 等待
- fulfilled ~~执行成功的原因~~ 已成功
- rejected ~~执行拒绝的理由~~ 已拒绝

## 深度分析与补充

**问题本质解读：** 这道题考察Promise状态机制的理解，面试官想了解你是否掌握Promise的核心工作原理和状态转换规则。

**技术错误纠正：**

- fulfilled应该是"已成功"状态，不是"执行成功的原因"
- rejected应该是"已拒绝"状态，不是"执行拒绝的理由"

**知识点系统梳理：**

**Promise的三种状态：**

1. **pending（等待中）**：初始状态，既不是成功，也不是失败状态
2. **fulfilled（已成功）**：操作成功完成
3. **rejected（已拒绝）**：操作失败

**状态转换规则：**

- pending → fulfilled：通过调用resolve()
- pending → rejected：通过调用reject()或抛出异常
- 状态一旦改变就不可逆，不能从fulfilled或rejected再变回pending
- fulfilled和rejected之间不能相互转换

**实战应用举例：**

```javascript
// 演示Promise状态变化
function createPromiseDemo() {
  console.log('1. 创建Promise，初始状态为pending')

  const promise = new Promise((resolve, reject) => {
    console.log('2. Promise执行器立即执行')

    setTimeout(() => {
      const random = Math.random()
      if (random > 0.5) {
        console.log('3. 调用resolve，状态变为fulfilled')
        resolve(`成功结果: ${random}`)
      } else {
        console.log('3. 调用reject，状态变为rejected')
        reject(new Error(`失败原因: ${random}`))
      }
    }, 1000)
  })

  // 检查Promise状态的方法（仅用于演示，实际开发中不推荐）
  console.log('Promise状态:', getPromiseState(promise))

  return promise
}

// 辅助函数：获取Promise状态（仅用于演示）
function getPromiseState(promise) {
  const t = {}
  return Promise.race([promise, t]).then(
    v => (v === t ? 'pending' : 'fulfilled'),
    () => 'rejected',
  )
}

// 状态转换示例
const demo1 = new Promise((resolve, reject) => {
  // 状态：pending
  console.log('当前状态: pending')

  setTimeout(() => {
    resolve('成功')
    // 状态：fulfilled
    // 下面的调用将被忽略，因为状态已经确定
    reject('失败') // 无效
    resolve('再次成功') // 无效
  }, 1000)
})

// 错误处理导致状态变为rejected
const demo2 = new Promise((resolve, reject) => {
  try {
    // 模拟可能出错的操作
    const result = JSON.parse('invalid json')
    resolve(result)
  } catch (error) {
    reject(error) // 状态变为rejected
  }
})

// 使用Promise.resolve和Promise.reject创建特定状态的Promise
const fulfilledPromise = Promise.resolve('直接成功')
const rejectedPromise = Promise.reject(new Error('直接失败'))

// 状态检测和处理
demo1
  .then(value => {
    console.log('Promise已fulfilled，值为:', value)
  })
  .catch(error => {
    console.log('Promise已rejected，错误为:', error)
  })
  .finally(() => {
    console.log('Promise已settled（已敲定，不管是fulfilled还是rejected）')
  })
```

**状态相关的重要概念：**

1. **settled（已敲定）**：Promise已经fulfilled或rejected，不再是pending
2. **thenable**：具有then方法的对象，可以被Promise.resolve()处理
3. **状态检测**：无法直接同步检测Promise状态，需要通过then/catch异步处理

**常见面试追问：**

```javascript
// Q: 以下代码的执行结果是什么？
const p = new Promise((resolve, reject) => {
  resolve('first')
  resolve('second') // 无效
  reject('error') // 无效
})

p.then(value => console.log(value)) // 输出: "first"

// Q: Promise状态改变是同步还是异步的？
const p2 = new Promise(resolve => {
  console.log('1')
  resolve('2')
  console.log('3')
})
console.log('4')
p2.then(value => console.log(value))
console.log('5')
// 输出顺序: 1, 3, 4, 5, 2
```

**记忆要点总结：**

- 三种状态：pending（等待）→ fulfilled（成功）/rejected（失败）
- 状态转换不可逆，一次性的
- settled = fulfilled + rejected（已敲定状态）
- 状态改变是同步的，但then/catch回调是异步的
- 多次调用resolve/reject只有第一次有效

# **118. [中级]** 如何创建一个Promise？

- new Promise(executeor)
- Promise.resolve(value)
- Promise.reject(reason)
- Promise.all(iterable)
- Promise.race(iterable)
- Promise.allSettled(iterable)
- Promise.any(iterable)

## 深度分析与补充

**问题本质解读：** 这道题考察Promise的创建方式和构造函数的使用，面试官想了解你是否掌握Promise的各种创建方法和使用场景。

**技术错误纠正：**

- `Promise()`是错误的，Promise必须使用new关键字调用
- 除了new Promise外，还有多种其他创建方式

**知识点系统梳理：**

**Promise创建的多种方式：**

1. **new Promise(executor)** - 基础构造方式
2. **Promise.resolve(value)** - 创建已成功的Promise
3. **Promise.reject(reason)** - 创建已失败的Promise
4. **Promise.all(iterable)** - 组合多个Promise
5. **Promise.race(iterable)** - 竞争多个Promise
6. **Promise.allSettled(iterable)** - 等待所有Promise完成
7. **Promise.any(iterable)** - 任意一个成功即可

**实战应用举例：**

```javascript
// 1. 基础构造方式 - new Promise
const basicPromise = new Promise((resolve, reject) => {
  // executor函数立即执行
  const success = Math.random() > 0.5

  if (success) {
    resolve('操作成功')
  } else {
    reject(new Error('操作失败'))
  }
})

// 2. 创建已成功的Promise
const resolvedPromise = Promise.resolve('立即成功')
const resolvedWithPromise = Promise.resolve(basicPromise) // 如果参数是Promise，直接返回

// 3. 创建已失败的Promise
const rejectedPromise = Promise.reject(new Error('立即失败'))

// 4. 从回调函数转换为Promise（Promisify）
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

// 使用示例
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)

// 5. 延迟Promise（常用于测试和演示）
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// 6. 条件Promise创建
function createConditionalPromise(condition, value, error) {
  if (condition) {
    return Promise.resolve(value)
  } else {
    return Promise.reject(error)
  }
}

// 7. 从异步函数创建Promise
async function createFromAsync() {
  // async函数自动返回Promise
  await delay(1000)
  return '异步操作完成'
}

// 8. 链式Promise创建
function createChainedPromise(initialValue) {
  return Promise.resolve(initialValue)
    .then(value => value * 2)
    .then(value => value + 10)
    .then(value => `结果: ${value}`)
}

// 9. 错误处理的Promise创建
function createWithErrorHandling(operation) {
  return new Promise((resolve, reject) => {
    try {
      const result = operation()
      if (result instanceof Promise) {
        result.then(resolve).catch(reject)
      } else {
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// 10. 超时Promise
function createTimeoutPromise(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`操作超时: ${timeout}ms`))
    }, timeout)
  })

  return Promise.race([promise, timeoutPromise])
}

// 使用示例
const timeoutExample = createTimeoutPromise(
  delay(2000).then(() => '操作完成'),
  1500,
) // 1.5秒后超时
```

**创建Promise的最佳实践：**

1. **明确executor函数的同步性**：executor立即执行，不要在其中放置异步操作的逻辑
2. **正确处理异常**：在executor中使用try-catch捕获同步异常
3. **避免Promise构造函数反模式**：不要在已有Promise的基础上再包装Promise
4. **选择合适的创建方式**：根据场景选择最简洁的创建方法

**常见错误和陷阱：**

```javascript
// ❌ 错误：Promise构造函数反模式
function badExample() {
  return new Promise((resolve, reject) => {
    someAsyncFunction()
      .then(resolve) // 应该直接返回someAsyncFunction()
      .catch(reject)
  })
}

// ✅ 正确：直接返回Promise
function goodExample() {
  return someAsyncFunction()
}

// ❌ 错误：忘记处理异常
const riskyPromise = new Promise((resolve, reject) => {
  const result = JSON.parse(invalidJson) // 可能抛出异常
  resolve(result)
})

// ✅ 正确：处理异常
const safePromise = new Promise((resolve, reject) => {
  try {
    const result = JSON.parse(invalidJson)
    resolve(result)
  } catch (error) {
    reject(error)
  }
})
```

**记忆要点总结：**

- 主要创建方式：new Promise(executor)
- 快捷方式：Promise.resolve()、Promise.reject()
- 组合方式：Promise.all()、Promise.race()等
- executor函数立即执行，接收resolve和reject参数
- 必须使用new关键字，不能直接调用Promise()
- 根据场景选择最合适的创建方式

# **119. [中级]** Promise.then()方法的用法

- pormise.then() 参数是一个~~执行器方法~~ 回调函数，接收onFulfilled和onRejected两个回调函数，返回一个~~promise.thenable~~ 新的promise。
- ~~通常为：(resolve,reject) =>{ 执行成功的resolve 或者失败的reject }~~
- 当执行器函数只有一个参数时，默认为：resolve

## 深度分析与补充

**问题本质解读：** 这道题考察Promise.then()方法的核心机制，面试官想了解你是否理解then方法的参数、返回值和链式调用原理。

**技术错误纠正：**

- then()方法的参数不是"执行器方法"，而是回调函数
- then()接收两个参数：onFulfilled和onRejected，不是resolve和reject
- then()返回新的Promise，不是"promise.thenable"

**知识点系统梳理：**

**Promise.then()的完整语法：**

```javascript
promise.then(onFulfilled, onRejected)
```

**参数说明：**

1. **onFulfilled**：Promise成功时的回调函数，接收resolve的值
2. **onRejected**：Promise失败时的回调函数，接收reject的原因（可选）

**返回值：**

- 总是返回一个新的Promise对象，支持链式调用

**实战应用举例：**

```javascript
// 1. 基础用法
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('初始数据')
  }, 1000)
})

// 只处理成功情况
promise.then(value => {
  console.log('成功:', value) // "成功: 初始数据"
  return value.toUpperCase()
})

// 同时处理成功和失败
promise.then(
  value => {
    console.log('成功:', value)
    return value.toUpperCase()
  },
  error => {
    console.log('失败:', error)
    return '默认值'
  },
)

// 2. 链式调用详解
Promise.resolve(10)
  .then(value => {
    console.log('第一步:', value) // 10
    return value * 2 // 返回普通值
  })
  .then(value => {
    console.log('第二步:', value) // 20
    return Promise.resolve(value + 5) // 返回Promise
  })
  .then(value => {
    console.log('第三步:', value) // 25
    throw new Error('故意抛出错误') // 抛出异常
  })
  .then(
    value => {
      console.log('不会执行') // 不会执行
    },
    error => {
      console.log('捕获错误:', error.message) // "故意抛出错误"
      return '恢复正常'
    },
  )
  .then(value => {
    console.log('最后一步:', value) // "恢复正常"
  })

// 3. then方法的返回值处理
function demonstrateThenReturns() {
  // 返回普通值
  Promise.resolve('hello')
    .then(value => {
      return value + ' world' // 新Promise resolve为 "hello world"
    })
    .then(value => console.log(value)) // "hello world"

  // 返回Promise
  Promise.resolve('start')
    .then(value => {
      return new Promise(resolve => {
        setTimeout(() => resolve(value + ' delayed'), 1000)
      })
    })
    .then(value => console.log(value)) // 1秒后输出 "start delayed"

  // 不返回任何值（undefined）
  Promise.resolve('data')
    .then(value => {
      console.log(value) // "data"
      // 没有return语句
    })
    .then(value => console.log(value)) // undefined

  // 抛出异常
  Promise.resolve('normal')
    .then(value => {
      throw new Error('something wrong')
    })
    .then(
      value => console.log('不会执行'),
      error => console.log('错误:', error.message),
    )
}

// 4. 错误处理的传播
Promise.reject('初始错误')
  .then(
    value => console.log('成功:', value),
    error => {
      console.log('处理错误:', error) // "处理错误: 初始错误"
      return '已修复' // 返回正常值，后续then会成功
    },
  )
  .then(value => {
    console.log('恢复正常:', value) // "恢复正常: 已修复"
  })

// 5. then的异步特性
console.log('1')
Promise.resolve('2').then(value => console.log(value))
console.log('3')
// 输出顺序: 1, 3, 2

// 6. 复杂的链式调用场景
function fetchUserProfile(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return response.json()
    })
    .then(user => {
      // 获取用户详细信息
      return Promise.all([
        user,
        fetch(`/api/users/${user.id}/profile`).then(r => r.json()),
        fetch(`/api/users/${user.id}/settings`).then(r => r.json()),
      ])
    })
    .then(([user, profile, settings]) => {
      return {
        ...user,
        profile,
        settings,
        lastUpdated: new Date().toISOString(),
      }
    })
    .catch(error => {
      console.error('获取用户信息失败:', error)
      return null // 返回默认值
    })
}
```

**then方法的重要特性：**

1. **异步执行**：then的回调总是异步执行，即使Promise已经settled
2. **值穿透**：如果onFulfilled不是函数，值会穿透到下一个then
3. **错误传播**：如果onRejected不是函数，错误会传播到下一个catch
4. **新Promise返回**：每次调用then都返回新的Promise对象

**常见使用模式：**

```javascript
// 值穿透示例
Promise.resolve('hello')
  .then(null) // 值穿透
  .then(value => console.log(value)) // "hello"

// 错误传播示例
Promise.reject('error')
  .then(value => console.log(value)) // 跳过
  .then(value => console.log(value)) // 跳过
  .catch(error => console.log('捕获:', error)) // "捕获: error"

// 条件处理
function processData(data) {
  return Promise.resolve(data)
    .then(data => {
      if (!data) {
        throw new Error('数据为空')
      }
      return data
    })
    .then(data => {
      // 数据处理逻辑
      return data.map(item => ({ ...item, processed: true }))
    })
}
```

**记忆要点总结：**

- then(onFulfilled, onRejected)：两个回调函数参数
- 返回新Promise，支持链式调用
- onFulfilled接收resolve值，onRejected接收reject原因
- 回调函数的返回值决定新Promise的状态
- 异步执行，支持值穿透和错误传播
- 是Promise链式调用的核心方法

# **120. [中级]** Promise的链式调用如何工作？

- 通过返回一个~~promise的thenable~~新的promise对象 在下一个then中接收到上一个then的结果，继续执行下一步的操作
- 核心是Promise的状态传递和值转换机制

## 深度分析与补充

**问题本质解读：** 这道题考察Promise链式调用的内部机制，面试官想了解你是否理解Promise链的工作原理、值传递和状态转换规则。

**技术错误纠正：**

- 不是"promise的thenable"，而是每个then方法都返回一个新的Promise对象
- 链式调用的核心是Promise的状态传递和值转换机制

**知识点系统梳理：**

**Promise链式调用的工作原理：**

1. **新Promise返回**：每个then/catch/finally都返回新的Promise
2. **值传递规则**：前一个Promise的结果决定下一个Promise的状态
3. **异步队列**：所有then回调都在微任务队列中异步执行
4. **状态传播**：成功/失败状态沿着链条传播

**值传递的四种情况：**

1. **返回普通值**：新Promise以该值resolve
2. **返回Promise**：新Promise的状态跟随返回的Promise
3. **抛出异常**：新Promise以该异常reject
4. **无返回值**：新Promise以undefined resolve

**实战应用举例：**

```javascript
// 1. 基础链式调用机制演示
function demonstrateChaining() {
  console.log('=== Promise链式调用机制 ===')

  const promise1 = Promise.resolve('初始值')
  console.log('promise1:', promise1) // Promise对象

  const promise2 = promise1.then(value => {
    console.log('第一个then接收:', value) // "初始值"
    return value + ' -> 处理后'
  })
  console.log('promise2:', promise2) // 新的Promise对象
  console.log('promise1 === promise2:', promise1 === promise2) // false

  const promise3 = promise2.then(value => {
    console.log('第二个then接收:', value) // "初始值 -> 处理后"
    return value + ' -> 再次处理'
  })
  console.log('promise3:', promise3) // 又一个新的Promise对象

  return promise3
}

// 2. 详细的值传递示例
function valuePassingDemo() {
  console.log('=== 值传递机制 ===')

  // 情况1: 返回普通值
  Promise.resolve(10)
    .then(value => {
      console.log('接收到:', value) // 10
      return value * 2 // 返回普通值20
    })
    .then(value => {
      console.log('新Promise resolve为:', value) // 20
    })

  // 情况2: 返回Promise
  Promise.resolve('start')
    .then(value => {
      console.log('接收到:', value) // "start"
      return new Promise(resolve => {
        setTimeout(() => resolve(value + ' delayed'), 1000)
      })
    })
    .then(value => {
      console.log('1秒后接收到:', value) // "start delayed"
    })

  // 情况3: 抛出异常
  Promise.resolve('normal')
    .then(value => {
      console.log('正常处理:', value) // "normal"
      throw new Error('故意出错')
    })
    .then(
      value => {
        console.log('不会执行') // 跳过
      },
      error => {
        console.log('捕获异常:', error.message) // "故意出错"
        return '错误已处理' // 恢复正常流程
      },
    )
    .then(value => {
      console.log('恢复正常:', value) // "错误已处理"
    })

  // 情况4: 无返回值
  Promise.resolve('data')
    .then(value => {
      console.log('处理数据:', value) // "data"
      // 没有return语句
    })
    .then(value => {
      console.log('接收到undefined:', value) // undefined
    })
}

// 3. 复杂的链式调用场景
function complexChainExample() {
  console.log('=== 复杂链式调用 ===')

  return Promise.resolve({ userId: 123 })
    .then(data => {
      console.log('1. 获取用户ID:', data.userId)
      // 模拟异步获取用户信息
      return fetch(`/api/users/${data.userId}`)
    })
    .then(response => {
      console.log('2. 检查响应状态')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return response.json()
    })
    .then(user => {
      console.log('3. 解析用户数据:', user.name)
      // 并行获取相关数据
      return Promise.all([
        user,
        fetch(`/api/users/${user.id}/posts`).then(r => r.json()),
        fetch(`/api/users/${user.id}/friends`).then(r => r.json()),
      ])
    })
    .then(([user, posts, friends]) => {
      console.log('4. 组合所有数据')
      return {
        user,
        posts: posts.slice(0, 5), // 只取前5篇文章
        friendsCount: friends.length,
        lastUpdated: new Date().toISOString(),
      }
    })
    .catch(error => {
      console.error('链式调用中的错误:', error)
      // 返回默认数据
      return {
        user: null,
        posts: [],
        friendsCount: 0,
        error: error.message,
      }
    })
    .finally(() => {
      console.log('5. 链式调用完成')
    })
}

// 4. 错误传播机制
function errorPropagationDemo() {
  console.log('=== 错误传播机制 ===')

  Promise.resolve('开始')
    .then(value => {
      console.log('步骤1:', value)
      return value + ' -> 步骤1完成'
    })
    .then(value => {
      console.log('步骤2:', value)
      throw new Error('步骤2出错')
    })
    .then(value => {
      console.log('步骤3: 不会执行') // 跳过
      return value + ' -> 步骤3完成'
    })
    .then(value => {
      console.log('步骤4: 也不会执行') // 跳过
    })
    .catch(error => {
      console.log('错误处理:', error.message) // "步骤2出错"
      return '错误已修复'
    })
    .then(value => {
      console.log('恢复执行:', value) // "错误已修复"
    })
}

// 5. 条件链式调用
function conditionalChaining(shouldProcess) {
  return Promise.resolve('原始数据')
    .then(data => {
      if (shouldProcess) {
        return processData(data)
      }
      return data // 跳过处理
    })
    .then(data => {
      return validateData(data)
    })
    .then(data => {
      return saveData(data)
    })
}

function processData(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + ' [已处理]')
    }, 100)
  })
}

function validateData(data) {
  if (!data || data.length === 0) {
    throw new Error('数据验证失败')
  }
  return data + ' [已验证]'
}

function saveData(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data + ' [已保存]')
    }, 100)
  })
}
```

**链式调用的关键特性：**

1. **每个then返回新Promise**：保证链式调用的连续性
2. **异步执行**：所有回调都在微任务队列中执行
3. **状态传播**：错误会跳过后续的成功回调，直到遇到错误处理
4. **值转换**：支持同步值、Promise、异常的自动处理

**常见使用模式：**

```javascript
// 数据处理管道
function createDataPipeline(data) {
  return Promise.resolve(data)
    .then(validateInput)
    .then(transformData)
    .then(enrichData)
    .then(formatOutput)
    .catch(handleError)
}

// 重试机制
function retryOperation(operation, maxRetries = 3) {
  return operation().catch(error => {
    if (maxRetries > 0) {
      console.log(`重试剩余次数: ${maxRetries}`)
      return retryOperation(operation, maxRetries - 1)
    }
    throw error
  })
}

// 超时控制
function withTimeout(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作超时')), timeout)
  })

  return Promise.race([promise, timeoutPromise])
}
```

**记忆要点总结：**

- 每个then/catch/finally都返回新的Promise对象
- 前一个Promise的结果决定下一个Promise的状态
- 支持四种值传递：普通值、Promise、异常、undefined
- 错误会沿链传播，直到被catch捕获
- 所有回调都异步执行，保证执行顺序
- 链式调用是Promise强大功能的核心体现

# **121. [中级]** Promise.catch()和try-catch的区别

- ~~promise.catch 捕获Promise中异步操作的异常和then中异常~~
- ~~包含在promise外部的try catch 可以捕获promise执行中的异常~~
- try-catch 可以**捕获同步代码中的异常**
- promise.catch 可以**捕获异步代码中的异常**

## 深度分析与补充

**问题本质解读：** 这道题考察异步错误处理机制的差异，面试官想了解你是否理解同步和异步错误处理的不同方式和适用场景。

**技术错误纠正：**

- try-catch无法直接捕获Promise内部的异步异常
- 需要区分Promise构造函数中的同步异常和异步异常

**知识点系统梳理：**

**Promise.catch()特点：**

1. **异步错误处理**：专门处理Promise链中的异步错误
2. **错误传播**：捕获整个Promise链中的错误
3. **返回新Promise**：支持错误恢复和继续链式调用
4. **微任务执行**：在微任务队列中异步执行

**try-catch特点：**

1. **同步错误处理**：只能捕获同步代码中的异常
2. **立即执行**：同步捕获和处理异常
3. **无法处理异步**：对Promise内部异步异常无效
4. **阻塞执行**：异常会中断当前执行流程

**实战应用举例：**

```javascript
// 1. Promise.catch() vs try-catch 基础对比
console.log('=== 基础对比 ===')

// Promise.catch() - 正确捕获异步异常
Promise.resolve('data')
  .then(value => {
    throw new Error('异步操作中的错误')
  })
  .catch(error => {
    console.log('Promise.catch捕获:', error.message) // 能够捕获
  })

// try-catch - 无法捕获Promise异步异常
try {
  Promise.resolve('data').then(value => {
    throw new Error('异步操作中的错误')
  })
} catch (error) {
  console.log('try-catch捕获:', error.message) // 不会执行
}

// 2. 不同场景的错误处理
function errorHandlingScenarios() {
  console.log('=== 错误处理场景 ===')

  // 场景1: Promise构造函数中的同步异常
  try {
    const promise = new Promise((resolve, reject) => {
      throw new Error('构造函数中的同步异常') // try-catch可以捕获
    })

    promise.catch(error => {
      console.log('Promise.catch也能捕获构造函数异常:', error.message)
    })
  } catch (error) {
    console.log('try-catch捕获构造函数异常:', error.message)
  }

  // 场景2: Promise构造函数中的异步异常
  try {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        throw new Error('构造函数中的异步异常') // try-catch无法捕获
      }, 100)
    })

    promise.catch(error => {
      console.log('Promise.catch捕获异步异常:', error.message) // 也无法捕获
    })
  } catch (error) {
    console.log('try-catch无法捕获异步异常') // 不会执行
  }

  // 正确处理异步异常的方式
  const correctPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 可能出错的异步操作
        const result = riskyAsyncOperation()
        resolve(result)
      } catch (error) {
        reject(error) // 正确的异步错误处理
      }
    }, 100)
  })

  correctPromise.catch(error => {
    console.log('正确捕获异步异常:', error.message)
  })
}

// 3. async/await中的错误处理
async function asyncAwaitErrorHandling() {
  console.log('=== async/await错误处理 ===')

  // try-catch在async函数中可以捕获await的异常
  try {
    const result = await Promise.reject(new Error('await异常'))
    console.log(result)
  } catch (error) {
    console.log('async/await中try-catch捕获:', error.message)
  }

  // 混合使用
  try {
    const data = await fetchData()
    const processed = await processData(data)
    return processed
  } catch (error) {
    console.log('处理过程中的异常:', error.message)
    throw error // 重新抛出或处理
  }
}

// 4. 错误处理的最佳实践
function errorHandlingBestPractices() {
  console.log('=== 错误处理最佳实践 ===')

  // 方式1: Promise链式错误处理
  function promiseChainApproach() {
    return fetchUserData()
      .then(validateData)
      .then(processData)
      .then(saveData)
      .catch(error => {
        console.error('Promise链中的错误:', error)
        return handleError(error)
      })
  }

  // 方式2: async/await错误处理
  async function asyncAwaitApproach() {
    try {
      const userData = await fetchUserData()
      const validData = await validateData(userData)
      const processedData = await processData(validData)
      const result = await saveData(processedData)
      return result
    } catch (error) {
      console.error('async/await中的错误:', error)
      return handleError(error)
    }
  }

  // 方式3: 混合错误处理
  async function hybridApproach() {
    try {
      const userData = await fetchUserData().catch(error => {
        console.log('获取用户数据失败，使用默认数据')
        return getDefaultUserData()
      })

      const result = await processData(userData)
      return result
    } catch (error) {
      console.error('处理过程中的错误:', error)
      throw error
    }
  }
}

// 5. 全局错误处理
function globalErrorHandling() {
  console.log('=== 全局错误处理 ===')

  // 未捕获的Promise异常
  window.addEventListener('unhandledrejection', event => {
    console.error('未处理的Promise异常:', event.reason)
    event.preventDefault() // 阻止默认的错误处理
  })

  // 未捕获的同步异常
  window.addEventListener('error', event => {
    console.error('未处理的同步异常:', event.error)
  })

  // 示例：未处理的Promise异常
  Promise.reject(new Error('未处理的异常')) // 会触发unhandledrejection事件
}

// 辅助函数
function fetchUserData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3
      if (success) {
        resolve({ id: 1, name: 'John' })
      } else {
        reject(new Error('网络请求失败'))
      }
    }, 100)
  })
}

function validateData(data) {
  if (!data || !data.id) {
    throw new Error('数据验证失败')
  }
  return data
}

function processData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.name) {
        resolve({ ...data, processed: true })
      } else {
        reject(new Error('数据处理失败'))
      }
    }, 50)
  })
}

function saveData(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ...data, saved: true, timestamp: Date.now() })
    }, 50)
  })
}

function handleError(error) {
  return {
    error: true,
    message: error.message,
    timestamp: Date.now(),
  }
}

function getDefaultUserData() {
  return { id: 0, name: 'Guest', default: true }
}

function riskyAsyncOperation() {
  throw new Error('异步操作失败')
}
```

**使用场景对比：**

| 场景          | Promise.catch()       | try-catch    |
| ------------- | --------------------- | ------------ |
| Promise链错误 | ✅ 推荐               | ❌ 无效      |
| async/await   | ✅ 可用               | ✅ 推荐      |
| 同步代码异常  | ❌ 无效               | ✅ 推荐      |
| 异步回调异常  | ✅ 需配合reject       | ❌ 无效      |
| 全局错误处理  | ✅ unhandledrejection | ✅ error事件 |

**记忆要点总结：**

- Promise.catch()：处理异步Promise链中的错误
- try-catch：处理同步代码和async/await中的错误
- Promise构造函数中的同步异常两者都能捕获
- Promise构造函数中的异步异常需要手动reject
- async/await让try-catch可以处理异步异常
- 选择合适的错误处理方式提高代码健壮性

# **122. [中级]** 如何处理多个Promise？

- Promise.all([]) 可以通过数组的方式将多个异步操作同时并行请求，只有全部成功才成功，有一个失败都失败。返回全部请求执行结果
- Promise.race([]) 可以通过数组的方式将多个异步操作同时竞争请求，~~只有全部失败才都失败，返回最快完成请求的那个结果~~ 返回第一个settled的Promise结果
- Promise.allSettled([]) 可以通过数组的方式将多个异步操作同时并行请求,返回各个请求的结果（结果中包含结果状态和值）
- Promise.any([]) 可以通过数组的方式将多个异步操作同时竞争请求, 只要有一个请求成功，返回最先成功的那个，只有全部失败的时候才失败

## 深度分析与补充

**问题本质解读：** 这道题考察Promise并发处理的各种方法，面试官想了解你是否掌握不同场景下的Promise组合策略和性能优化。

**技术错误纠正：**

- Promise.race()不是"只有全部失败才都失败"，而是返回第一个settled的Promise结果
- 需要明确各个方法的具体行为差异和使用场景

**知识点系统梳理：**

**四种Promise组合方法对比：**

| 方法                 | 成功条件 | 失败条件   | 返回结果     | 使用场景  |
| -------------------- | -------- | ---------- | ------------ | --------- |
| Promise.all()        | 全部成功 | 任一失败   | 成功结果数组 | 全部依赖  |
| Promise.race()       | 任一完成 | 第一个失败 | 第一个结果   | 竞速/超时 |
| Promise.allSettled() | 全部完成 | 不会失败   | 状态结果数组 | 批量处理  |
| Promise.any()        | 任一成功 | 全部失败   | 第一个成功   | 容错处理  |

**实战应用举例：**

```javascript
// 1. Promise.all() - 全部成功才成功
async function demonstratePromiseAll() {
  console.log('=== Promise.all() 演示 ===')

  const promises = [
    fetch('/api/user/1').then(r => r.json()),
    fetch('/api/user/2').then(r => r.json()),
    fetch('/api/user/3').then(r => r.json()),
  ]

  try {
    const results = await Promise.all(promises)
    console.log('所有用户数据:', results)
    // 结果按原数组顺序返回，不是完成顺序
  } catch (error) {
    console.log('任一请求失败:', error)
    // 只要有一个失败，整个Promise.all就失败
  }

  // 实际应用：并行获取相关数据
  async function getUserProfile(userId) {
    const [user, posts, friends] = await Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
      fetchUserFriends(userId),
    ])

    return { user, posts, friends }
  }
}

// 2. Promise.race() - 第一个完成的结果
async function demonstratePromiseRace() {
  console.log('=== Promise.race() 演示 ===')

  const promises = [
    new Promise(resolve => setTimeout(() => resolve('慢速结果'), 2000)),
    new Promise(resolve => setTimeout(() => resolve('快速结果'), 1000)),
    new Promise((_, reject) => setTimeout(() => reject('错误'), 1500)),
  ]

  try {
    const result = await Promise.race(promises)
    console.log('最快完成:', result) // "快速结果"
  } catch (error) {
    console.log('最快失败:', error)
  }

  // 实际应用：请求超时控制
  function withTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), timeout)
    })

    return Promise.race([promise, timeoutPromise])
  }

  // 使用示例
  try {
    const data = await withTimeout(fetch('/api/slow-endpoint'), 5000)
    console.log('请求成功:', data)
  } catch (error) {
    console.log('请求超时或失败:', error.message)
  }
}

// 3. Promise.allSettled() - 等待全部完成
async function demonstratePromiseAllSettled() {
  console.log('=== Promise.allSettled() 演示 ===')

  const promises = [
    Promise.resolve('成功1'),
    Promise.reject('失败1'),
    Promise.resolve('成功2'),
    Promise.reject('失败2'),
  ]

  const results = await Promise.allSettled(promises)
  console.log('所有结果:', results)
  // [
  //   { status: 'fulfilled', value: '成功1' },
  //   { status: 'rejected', reason: '失败1' },
  //   { status: 'fulfilled', value: '成功2' },
  //   { status: 'rejected', reason: '失败2' }
  // ]

  // 处理结果
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)

  const failed = results.filter(result => result.status === 'rejected').map(result => result.reason)

  console.log('成功的:', successful)
  console.log('失败的:', failed)

  // 实际应用：批量操作
  async function batchUpdateUsers(userIds) {
    const updatePromises = userIds.map(id => updateUser(id))
    const results = await Promise.allSettled(updatePromises)

    const summary = {
      total: results.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      errors: results.filter(r => r.status === 'rejected').map(r => r.reason),
    }

    return summary
  }
}

// 4. Promise.any() - 任一成功即可
async function demonstratePromiseAny() {
  console.log('=== Promise.any() 演示 ===')

  const promises = [
    Promise.reject('服务器1失败'),
    Promise.reject('服务器2失败'),
    Promise.resolve('服务器3成功'),
    Promise.resolve('服务器4成功'),
  ]

  try {
    const result = await Promise.any(promises)
    console.log('第一个成功:', result) // "服务器3成功"
  } catch (error) {
    console.log('全部失败:', error) // AggregateError
  }

  // 实际应用：多服务器容错
  async function fetchFromMultipleServers(endpoint) {
    const servers = [
      'https://api1.example.com',
      'https://api2.example.com',
      'https://api3.example.com',
    ]

    const promises = servers.map(server => fetch(`${server}${endpoint}`).then(r => r.json()))

    try {
      return await Promise.any(promises)
    } catch (error) {
      throw new Error('所有服务器都不可用')
    }
  }
}

// 5. 复杂组合场景
async function complexCombinationScenarios() {
  console.log('=== 复杂组合场景 ===')

  // 场景1: 部分依赖 + 容错
  async function fetchUserDashboard(userId) {
    // 必需数据：用户信息（必须成功）
    const userPromise = fetchUser(userId)

    // 可选数据：统计信息（可以失败）
    const optionalPromises = [
      fetchUserStats(userId).catch(() => null),
      fetchUserNotifications(userId).catch(() => []),
      fetchUserRecommendations(userId).catch(() => []),
    ]

    const [user, ...optionalData] = await Promise.all([userPromise, ...optionalPromises])

    const [stats, notifications, recommendations] = optionalData

    return {
      user,
      stats,
      notifications,
      recommendations,
    }
  }

  // 场景2: 分层加载
  async function layeredLoading() {
    // 第一层：关键数据
    const criticalData = await Promise.all([fetchCriticalData1(), fetchCriticalData2()])

    // 第二层：重要数据（基于第一层）
    const importantPromises = criticalData.map(data => fetchImportantData(data.id))
    const importantData = await Promise.allSettled(importantPromises)

    // 第三层：可选数据（并行加载）
    const optionalPromises = [fetchOptionalData1(), fetchOptionalData2(), fetchOptionalData3()]
    const optionalData = await Promise.allSettled(optionalPromises)

    return {
      critical: criticalData,
      important: importantData,
      optional: optionalData,
    }
  }

  // 场景3: 智能重试
  async function smartRetry(operation, maxRetries = 3) {
    const attempts = Array.from(
      { length: maxRetries },
      (_, i) =>
        new Promise(resolve => {
          setTimeout(() => {
            operation()
              .then(resolve)
              .catch(error => resolve(Promise.reject(error)))
          }, i * 1000) // 递增延迟
        }),
    )

    try {
      return await Promise.any(attempts)
    } catch (error) {
      throw new Error(`操作失败，已重试${maxRetries}次`)
    }
  }
}

// 辅助函数
function fetchUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: `User${id}` }), 100)
  })
}

function fetchUserPosts(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve([`Post1 by User${id}`, `Post2 by User${id}`]), 150)
  })
}

function fetchUserFriends(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve([`Friend1 of User${id}`, `Friend2 of User${id}`]), 120)
  })
}

function updateUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve(`User${id} updated`)
      } else {
        reject(`Failed to update User${id}`)
      }
    }, 100)
  })
}
```

**使用场景选择指南：**

1. **Promise.all()**: 所有操作都必须成功，如获取用户完整信息
2. **Promise.race()**: 需要最快响应，如请求超时控制
3. **Promise.allSettled()**: 批量操作，需要知道每个结果，如批量更新
4. **Promise.any()**: 容错处理，任一成功即可，如多服务器请求

**记忆要点总结：**

- Promise.all()：全部成功才成功，快速失败
- Promise.race()：第一个完成就返回，竞速机制
- Promise.allSettled()：等待全部完成，不会失败
- Promise.any()：任一成功即可，全部失败才失败
- 根据业务需求选择合适的组合方法
- 注意错误处理和性能优化

# **123. [中级]** Promise.all()和Promise.allSettled()的区别

- Promise.all([]) 可以通过数组的方式将多个异步操作同时并行请求，只有全部成功才成功，有一个失败都失败。返回全部请求执行结果
- Promise.allSettled([]) 可以通过数组的方式将多个异步操作同时并行请求,返回各个请求的结果（结果中包含结果状态和值）
  1. 整体完成的时机不同：
     1. all 只要其中有一个失败就都失败
     2. allSettled 不论其中的失败和成功 全部执行
  2. 返回的结果的结构不同：
     1. all 根据数组顺序返回对应顺序的结果
     2. allSettled 根据数组顺序返回对应顺序的对象内容 包括了完成状态 status 和请求结果 value

## 深度分析与补充

**问题本质解读：** 这道题考察两种Promise组合方法的核心差异，面试官想了解你是否理解不同错误处理策略的适用场景。

**技术错误纠正：**

- 需要明确两者在错误处理、返回值结构、使用场景上的具体差异

**知识点系统梳理：**

**核心差异对比：**

| 特性     | Promise.all()         | Promise.allSettled() |
| -------- | --------------------- | -------------------- |
| 失败策略 | 快速失败（fail-fast） | 等待全部完成         |
| 返回时机 | 全部成功或首个失败    | 全部Promise settled  |
| 返回结果 | 成功值数组            | 状态对象数组         |
| 错误处理 | 抛出异常              | 不会抛出异常         |
| 适用场景 | 全部依赖              | 批量处理             |

**实战应用举例：**

```javascript
// 1. 基础行为对比
async function basicComparison() {
  console.log('=== Promise.all() vs Promise.allSettled() 基础对比 ===')

  const promises = [
    Promise.resolve('成功1'),
    Promise.reject('失败1'),
    Promise.resolve('成功2'),
    new Promise(resolve => setTimeout(() => resolve('延迟成功'), 1000)),
  ]

  // Promise.all() - 快速失败
  try {
    const allResults = await Promise.all(promises)
    console.log('Promise.all 结果:', allResults) // 不会执行
  } catch (error) {
    console.log('Promise.all 失败:', error) // "失败1"
  }

  // Promise.allSettled() - 等待全部完成
  const settledResults = await Promise.allSettled(promises)
  console.log('Promise.allSettled 结果:', settledResults)
  // [
  //   { status: 'fulfilled', value: '成功1' },
  //   { status: 'rejected', reason: '失败1' },
  //   { status: 'fulfilled', value: '成功2' },
  //   { status: 'fulfilled', value: '延迟成功' }
  // ]
}

// 2. 实际应用场景对比
async function practicalScenarios() {
  console.log('=== 实际应用场景对比 ===')

  // 场景1: 用户资料页面 - 使用Promise.all()
  // 所有数据都是必需的，任一失败都应该显示错误页面
  async function loadUserProfilePage(userId) {
    try {
      const [user, profile, settings] = await Promise.all([
        fetchUser(userId), // 必需：用户基本信息
        fetchUserProfile(userId), // 必需：用户详细资料
        fetchUserSettings(userId), // 必需：用户设置
      ])

      return {
        success: true,
        data: { user, profile, settings },
      }
    } catch (error) {
      return {
        success: false,
        error: '加载用户信息失败',
        details: error.message,
      }
    }
  }

  // 场景2: 数据同步 - 使用Promise.allSettled()
  // 需要知道每个操作的结果，部分失败不影响其他操作
  async function syncUserData(userId) {
    const syncOperations = [
      syncUserPosts(userId),
      syncUserPhotos(userId),
      syncUserContacts(userId),
      syncUserSettings(userId),
    ]

    const results = await Promise.allSettled(syncOperations)

    const summary = {
      total: results.length,
      successful: 0,
      failed: 0,
      details: [],
    }

    results.forEach((result, index) => {
      const operation = ['posts', 'photos', 'contacts', 'settings'][index]

      if (result.status === 'fulfilled') {
        summary.successful++
        summary.details.push({
          operation,
          status: 'success',
          data: result.value,
        })
      } else {
        summary.failed++
        summary.details.push({
          operation,
          status: 'failed',
          error: result.reason,
        })
      }
    })

    return summary
  }
}

// 3. 错误处理策略对比
async function errorHandlingComparison() {
  console.log('=== 错误处理策略对比 ===')

  // Promise.all() 的错误处理
  async function allErrorHandling() {
    const promises = [fetchData('endpoint1'), fetchData('endpoint2'), fetchData('endpoint3')]

    try {
      const results = await Promise.all(promises)
      console.log('所有请求成功:', results)
      return { success: true, data: results }
    } catch (error) {
      console.log('有请求失败，全部中止:', error)
      // 无法知道哪些成功了，哪些失败了
      return { success: false, error: error.message }
    }
  }

  // Promise.allSettled() 的错误处理
  async function allSettledErrorHandling() {
    const promises = [fetchData('endpoint1'), fetchData('endpoint2'), fetchData('endpoint3')]

    const results = await Promise.allSettled(promises)

    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)

    const failed = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => ({
        index,
        error: result.reason,
      }))

    console.log('成功的请求:', successful)
    console.log('失败的请求:', failed)

    return {
      success: failed.length === 0,
      data: successful,
      errors: failed,
      partial: successful.length > 0 && failed.length > 0,
    }
  }
}

// 4. 性能和资源使用对比
async function performanceComparison() {
  console.log('=== 性能和资源使用对比 ===')

  // Promise.all() - 快速失败，节省资源
  async function fastFailExample() {
    const startTime = Date.now()

    const promises = [
      new Promise(resolve => setTimeout(() => resolve('快速成功'), 100)),
      new Promise((_, reject) => setTimeout(() => reject('快速失败'), 200)),
      new Promise(resolve => setTimeout(() => resolve('慢速成功'), 2000)), // 不会等待
    ]

    try {
      await Promise.all(promises)
    } catch (error) {
      const endTime = Date.now()
      console.log(`Promise.all 失败用时: ${endTime - startTime}ms`) // 约200ms
      console.log('第三个Promise可能仍在执行，但结果被忽略')
    }
  }

  // Promise.allSettled() - 等待全部完成
  async function waitAllExample() {
    const startTime = Date.now()

    const promises = [
      new Promise(resolve => setTimeout(() => resolve('快速成功'), 100)),
      new Promise((_, reject) => setTimeout(() => reject('快速失败'), 200)),
      new Promise(resolve => setTimeout(() => resolve('慢速成功'), 2000)), // 会等待
    ]

    await Promise.allSettled(promises)
    const endTime = Date.now()
    console.log(`Promise.allSettled 完成用时: ${endTime - startTime}ms`) // 约2000ms
  }
}

// 5. 实用工具函数
function createPromiseUtils() {
  // 将Promise.all()行为改为类似allSettled()
  async function allWithDetails(promises) {
    try {
      const results = await Promise.all(promises)
      return {
        success: true,
        results: results.map(value => ({ status: 'fulfilled', value })),
      }
    } catch (error) {
      // 无法获取部分成功的结果
      return {
        success: false,
        error,
        results: [],
      }
    }
  }

  // 将Promise.allSettled()行为改为类似all()
  async function allSettledWithThrow(promises) {
    const results = await Promise.allSettled(promises)

    const firstRejected = results.find(result => result.status === 'rejected')
    if (firstRejected) {
      throw firstRejected.reason
    }

    return results.map(result => result.value)
  }

  // 部分成功也算成功的版本
  async function allWithPartialSuccess(promises, minSuccessCount = 1) {
    const results = await Promise.allSettled(promises)

    const successful = results.filter(result => result.status === 'fulfilled')

    if (successful.length >= minSuccessCount) {
      return {
        success: true,
        data: successful.map(result => result.value),
        failed: results.filter(result => result.status === 'rejected').length,
      }
    } else {
      throw new Error(`至少需要${minSuccessCount}个成功，实际成功${successful.length}个`)
    }
  }

  return {
    allWithDetails,
    allSettledWithThrow,
    allWithPartialSuccess,
  }
}

// 辅助函数
function fetchData(endpoint) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve(`${endpoint} 数据`)
      } else {
        reject(new Error(`${endpoint} 请求失败`))
      }
    }, Math.random() * 1000)
  })
}

function fetchUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: `User${id}` }), 100)
  })
}

function fetchUserProfile(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ userId: id, bio: 'User bio' }), 150)
  })
}

function fetchUserSettings(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ userId: id, theme: 'dark' }), 120)
  })
}

function syncUserPosts(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2 ? resolve(`Posts synced for user ${id}`) : reject('Posts sync failed')
    }, 200)
  })
}

function syncUserPhotos(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2 ? resolve(`Photos synced for user ${id}`) : reject('Photos sync failed')
    }, 300)
  })
}

function syncUserContacts(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2
        ? resolve(`Contacts synced for user ${id}`)
        : reject('Contacts sync failed')
    }, 250)
  })
}

function syncUserSettings(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2
        ? resolve(`Settings synced for user ${id}`)
        : reject('Settings sync failed')
    }, 180)
  })
}
```

**使用场景选择指南：**

1. **Promise.all()**: 全部依赖场景，如页面初始化数据加载
2. **Promise.allSettled()**: 批量操作场景，如数据同步、批量更新

**记忆要点总结：**

- Promise.all()：快速失败，返回成功值数组，适合全部依赖
- Promise.allSettled()：等待全部完成，返回状态对象数组，适合批量处理
- all()节省资源但信息有限，allSettled()消耗更多资源但信息完整
- 根据业务需求选择：是否需要部分成功的结果
- 错误处理策略不同：中止 vs 继续

# **124. [高级]** Promise.race()的使用场景

- 用于包装请求函数中的超时操作。可以在Promise.all 中包含一个异步请求的同时可以再加入一个Promise.race 包含的超时操作

## 深度分析与补充

**问题本质解读：** 这道题考察Promise.race()的实际应用场景，面试官想了解你是否能在实际项目中合理运用竞速机制解决问题。

**知识点系统梳理：**

**Promise.race()的核心特性：**

- 返回第一个settled（fulfilled或rejected）的Promise结果
- 其他Promise继续执行但结果被忽略
- 适用于需要"最快响应"的场景

**实战应用举例：**

```javascript
// 1. 请求超时控制（最常见场景）
function withTimeout(promise, timeout, timeoutMessage = '请求超时') {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeout)
  })

  return Promise.race([promise, timeoutPromise])
}

// 使用示例
async function fetchWithTimeout() {
  try {
    const data = await withTimeout(
      fetch('/api/slow-endpoint').then(r => r.json()),
      5000,
      '请求超时，请稍后重试',
    )
    console.log('请求成功:', data)
  } catch (error) {
    console.log('请求失败:', error.message)
  }
}

// 2. 多服务器竞速请求
async function fastestServerRequest(endpoint) {
  const servers = [
    'https://api1.example.com',
    'https://api2.example.com',
    'https://api3.example.com',
  ]

  const requests = servers.map(server =>
    fetch(`${server}${endpoint}`).then(response => ({
      server,
      data: response.json(),
    })),
  )

  try {
    const fastest = await Promise.race(requests)
    console.log(`最快响应来自: ${fastest.server}`)
    return fastest.data
  } catch (error) {
    console.log('所有服务器请求失败')
    throw error
  }
}

// 3. 用户交互竞速
function waitForUserAction(timeout = 10000) {
  const userClick = new Promise(resolve => {
    document.addEventListener('click', () => resolve('用户点击'), { once: true })
  })

  const userKeypress = new Promise(resolve => {
    document.addEventListener('keypress', () => resolve('用户按键'), { once: true })
  })

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('用户无响应')), timeout)
  })

  return Promise.race([userClick, userKeypress, timeoutPromise])
}
```

**记忆要点总结：**

- 超时控制：防止请求无限等待
- 多源竞速：选择最快的数据源
- 用户交互：等待用户操作但设置超时
- 性能优化：选择最快的计算结果

# **125. [中级]** 如何取消一个Promise？

无法取消promise

## 深度分析与补充

**问题本质解读：** 这道题考察Promise的限制和替代方案，面试官想了解你是否理解Promise的设计原理和如何实现类似取消的效果。

**技术错误纠正：**

- Promise本身确实无法取消，但可以通过其他方式实现类似效果

**知识点系统梳理：**

**Promise无法取消的原因：**

- Promise代表一个已经开始的异步操作
- 状态一旦改变就不可逆
- 设计上追求简单性和可预测性

**替代方案：**

```javascript
// 1. 使用AbortController（现代方案）
function cancellableRequest(url) {
  const controller = new AbortController()

  const promise = fetch(url, {
    signal: controller.signal,
  }).then(response => response.json())

  return {
    promise,
    cancel: () => controller.abort(),
  }
}

// 2. 手动实现取消机制
function createCancellablePromise(executor) {
  let isCancelled = false

  const promise = new Promise((resolve, reject) => {
    executor(
      value => {
        if (!isCancelled) resolve(value)
      },
      reason => {
        if (!isCancelled) reject(reason)
      },
    )
  })

  return {
    promise,
    cancel: () => {
      isCancelled = true
    },
  }
}

// 3. 使用竞速机制模拟取消
function raceWithCancel(promise) {
  let cancelReject

  const cancelPromise = new Promise((_, reject) => {
    cancelReject = reject
  })

  const racePromise = Promise.race([promise, cancelPromise])

  return {
    promise: racePromise,
    cancel: () => cancelReject(new Error('操作已取消')),
  }
}
```

**记忆要点总结：**

- Promise本身不支持取消
- 使用AbortController处理网络请求取消
- 通过标志位和竞速机制实现类似效果
- 现代API设计中考虑取消机制

# **126. [高级]** 如何实现一个简单的Promise？

```javascript
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

function MyPromise(exectue) {
  this.state = PENDING
  this.reason = null
  this.value = null

  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  const that = this
  function resolve(value) {
    if (this.state === PENDING) {
      this.value = value
      this.state = FULFILLED
      that.onFulfilledCallbacks.forEach(fn => fn(that.value))
    }
  }

  function reject(reason) {
    if (this.state === PENDING) {
      this.reason = resaon
      this.state = REJECTED
      that.onRejectedCallbacks.forEach(fn => fn(that.resaon))
    }
  }

  try {
    exectue(resolve, reject)
  } catch (err) {
    reject(err)
  }
}
MyPromise.prototype.then = function (onFullfilled, onRejected) {
  if (typeof onFullfilled !== 'function') {
    onFullfilled = function (value) {
      return value
    }
  }

  if (typeof onRejected !== 'function') {
    onRejected = function (reason) {
      throw reason
    }
  }

  const that = this

  if (this.state === FULFILLED) {
    const promise2 = new MyPromiose((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onFullfilled !== 'function') {
            resolve(that.value)
          } else {
            const x = onFullfilled(that.value)
            resoveMyPromise(promise2, x, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      }, 0)
    })
    return promise2
  }

  if (this.state === REJECTED) {
    const promise2 = new MyPromiose((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(that.reason)
          } else {
            const x = onRejected(that.reason)
            resoveMyPromise(promise2, x, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      }, 0)
    })
    return promise2
  }

  if (this.state === PENDING) {
    const promise2 = new MyPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onFullfilled !== 'function') {
              resolve(that.value)
            } else {
              const x = onFullfilled(that.value)
              resoveMyPromise(promise2, x, resolve, reject)
            }
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(that.reason)
            } else {
              const x = onRejected(that.reason)
              resoveMyPromise(promise2, x, resolve, reject)
            }
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
    })
    return promise2
  }
}

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

MyPromise.prototype.finally = function (onFinally) {
  return this.then(onFinally, onFinally)
}

MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) {
    return value
  }

  return new MyPromise((resolve, reject) => {
    resolve(value)
  })
}

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}

MyPromise.prototype.all = function (promises = []) {
  return new MyPromise((resolve, reject) => {
    const result = []
    let count = 0

    if (promises.length === 0) {
      resolve(result)
    }

    for (const promise of promises) {
      MyPromise.resolve(promise).then(
        value => {
          count++
          result.push(value)
          if (count === promises.length) {
            resolve(reslut)
          }
        },
        reason => {
          reject(reason)
        },
      )
    }
  })
}

function resolveMyPromise(promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError('promise and x is same value'))
  }

  if (x instanceof MyPromise) {
    x.then(y => {
      resolveMyPromise(promise, y, resolve, reject)
    }, reject)
  } else if (typeof x === 'object' || typeof x === 'function') {
    if (x === null) {
      return resolve(x)
    }

    try {
      var then = x.then
    } catch (err) {
      reject(err)
    }

    if (typeof then === 'function') {
      let called = false

      try {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolveMyPromise(promise, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          },
        )
      } catch (e) {
        if (called) return
        reject(e)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察对Promise内部实现机制的深度理解，面试官想了解你是否掌握Promise的核心原理和状态管理。

**技术错误纠正：**

- `exectue`应该是`executor`
- `resaon`应该是`reason`
- `resoveMyPromise`应该是`resolveMyPromise`
- `MyPromiose`应该是`MyPromise`
- `reslut`应该是`result`
- resolve和reject函数中的`this`指向问题需要修正

**完整的Promise实现：**

```javascript
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

function MyPromise(executor) {
  this.state = PENDING
  this.value = null
  this.reason = null

  // 存储异步情况下的回调函数
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  const self = this

  function resolve(value) {
    if (self.state === PENDING) {
      self.state = FULFILLED
      self.value = value
      // 执行所有成功回调
      self.onFulfilledCallbacks.forEach(callback => callback())
    }
  }

  function reject(reason) {
    if (self.state === PENDING) {
      self.state = REJECTED
      self.reason = reason
      // 执行所有失败回调
      self.onRejectedCallbacks.forEach(callback => callback())
    }
  }

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

// then方法实现
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 参数校验，确保是函数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : reason => {
          throw reason
        }

  const self = this

  // 返回新的Promise，支持链式调用
  const promise2 = new MyPromise((resolve, reject) => {
    if (self.state === FULFILLED) {
      // 异步执行，确保promise2已经创建
      setTimeout(() => {
        try {
          const x = onFulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }

    if (self.state === REJECTED) {
      setTimeout(() => {
        try {
          const x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }

    if (self.state === PENDING) {
      // 异步情况，将回调存储起来
      self.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      })

      self.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
    }
  })

  return promise2
}

// 处理Promise解析过程
function resolvePromise(promise2, x, resolve, reject) {
  // 避免循环引用
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  let called = false

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then

      if (typeof then === 'function') {
        // x是thenable对象
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          },
        )
      } else {
        // x是普通对象
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    // x是普通值
    resolve(x)
  }
}

// catch方法
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

// finally方法
MyPromise.prototype.finally = function (onFinally) {
  return this.then(
    value => MyPromise.resolve(onFinally()).then(() => value),
    reason =>
      MyPromise.resolve(onFinally()).then(() => {
        throw reason
      }),
  )
}

// 静态方法
MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) {
    return value
  }
  return new MyPromise(resolve => resolve(value))
}

MyPromise.reject = function (reason) {
  return new MyPromise((_, reject) => reject(reason))
}

MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'))
    }

    const results = []
    let completedCount = 0

    if (promises.length === 0) {
      return resolve(results)
    }

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          results[index] = value
          completedCount++
          if (completedCount === promises.length) {
            resolve(results)
          }
        },
        reason => reject(reason),
      )
    })
  })
}

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'))
    }

    promises.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject)
    })
  })
}
```

**实现要点总结：**

- 状态管理：pending → fulfilled/rejected
- 回调队列：处理异步情况
- then方法：返回新Promise，支持链式调用
- 值处理：普通值、Promise、thenable对象
- 错误处理：try-catch和reject机制
- 静态方法：resolve、reject、all、race

# **127. [中级]** Promise中的错误传播机制

~~.catch()~~

- 错误会沿着Promise链向下传播，直到被catch捕获
- catch可以捕获之前链条中的任何错误
- catch处理后可以返回正常值，恢复Promise链
- 跳过then的成功回调

## 深度分析与补充

**问题本质解读：** 这道题考察Promise错误传播的机制，面试官想了解你是否理解Promise链中错误如何传播和处理。

**知识点系统梳理：**

**Promise错误传播的核心机制：**

1. **错误冒泡**：错误会沿着Promise链向下传播
2. **跳过成功回调**：错误状态会跳过then的成功回调
3. **catch捕获**：catch可以捕获之前链条中的任何错误
4. **错误恢复**：catch处理后可以返回正常值，恢复Promise链

**实战应用举例：**

```javascript
// 1. 基础错误传播
Promise.resolve('开始')
  .then(value => {
    console.log('步骤1:', value)
    throw new Error('步骤1出错')
  })
  .then(value => {
    console.log('步骤2: 不会执行') // 跳过
    return value + ' -> 步骤2'
  })
  .catch(error => {
    console.log('捕获错误:', error.message) // "步骤1出错"
    return '错误已处理' // 恢复正常流程
  })
  .then(value => {
    console.log('恢复执行:', value) // "错误已处理"
  })

// 2. 错误类型和处理策略
function handleDifferentErrors() {
  return Promise.resolve()
    .then(() => {
      const errorType = Math.floor(Math.random() * 3)
      switch (errorType) {
        case 0:
          throw new TypeError('类型错误')
        case 1:
          throw new ReferenceError('引用错误')
        case 2:
          throw new Error('普通错误')
      }
    })
    .catch(error => {
      if (error instanceof TypeError) {
        return '类型错误已修复'
      } else if (error instanceof ReferenceError) {
        return '引用错误已修复'
      } else {
        return '普通错误已修复'
      }
    })
}

// 3. 分层错误处理
function processUserData(userId) {
  return fetchUser(userId)
    .catch(error => {
      console.log('获取用户失败，使用默认用户')
      return { id: userId, name: 'Unknown User' }
    })
    .then(user => processUser(user))
    .catch(error => {
      console.log('处理用户失败，返回错误信息')
      return { error: true, message: error.message }
    })
}
```

**记忆要点总结：**

- 错误自动向下传播，跳过成功回调
- catch可以捕获之前链条中的任何错误
- catch处理后可以恢复正常流程
- 合理使用分层错误处理和重试机制

### async/await（8道）

# **128. [初级]** async/await的基本用法

```javascript
try {
  async function getUserInfo() {
    const response = await fetch('/get/github/user=pan')

    if (!response.ok) {
      throw new Error('请求失败')
    }

    const data = await response.json()
    return data
  }
} catch (error) {
  console.log(error)
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察async/await的基础语法和使用方式，面试官想了解你是否掌握现代JavaScript异步编程的核心语法。

**技术错误纠正：**

- 函数缺少函数名
- 可以直接await fetch的结果，不需要额外的then
- 应该有返回值或错误处理

**知识点系统梳理：**

**async/await基础语法：**

1. **async函数**：声明异步函数，自动返回Promise
2. **await表达式**：等待Promise完成，获取resolved值
3. **错误处理**：使用try-catch捕获异步异常
4. **返回值**：async函数总是返回Promise

**实战应用举例：**

```javascript
// 1. 基础用法示例
async function fetchUserData() {
  try {
    // await等待Promise完成
    const response = await fetch('/api/user/123')

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // 解析JSON数据
    const userData = await response.json()

    console.log('用户数据:', userData)
    return userData
  } catch (error) {
    console.error('获取用户数据失败:', error)
    throw error // 重新抛出错误
  }
}

// 2. 多个异步操作
async function getUserProfile(userId) {
  try {
    // 串行执行
    const user = await fetchUser(userId)
    const posts = await fetchUserPosts(user.id)
    const friends = await fetchUserFriends(user.id)

    return {
      user,
      posts,
      friends,
      loadTime: new Date().toISOString(),
    }
  } catch (error) {
    console.error('获取用户资料失败:', error)
    return null
  }
}

// 3. 并行执行多个异步操作
async function getUserProfileParallel(userId) {
  try {
    // 并行执行，提高性能
    const [user, posts, friends] = await Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
      fetchUserFriends(userId),
    ])

    return { user, posts, friends }
  } catch (error) {
    console.error('获取用户资料失败:', error)
    return null
  }
}

// 4. 条件异步操作
async function processUserData(userId, includeDetails = false) {
  const user = await fetchUser(userId)

  if (includeDetails) {
    // 条件性执行额外的异步操作
    user.details = await fetchUserDetails(user.id)
    user.preferences = await fetchUserPreferences(user.id)
  }

  return user
}

// 5. 异步迭代
async function processMultipleUsers(userIds) {
  const results = []

  for (const userId of userIds) {
    try {
      const user = await fetchUser(userId)
      results.push(user)
    } catch (error) {
      console.error(`处理用户${userId}失败:`, error)
      results.push(null)
    }
  }

  return results
}

// 6. 使用async/await的工具函数
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryOperation(operation, maxRetries = 3, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error // 最后一次重试失败，抛出错误
      }

      console.log(`操作失败，${delayMs}ms后重试 (${i + 1}/${maxRetries})`)
      await delay(delayMs)
    }
  }
}

// 7. 复杂的异步流程控制
async function complexAsyncFlow() {
  try {
    // 步骤1：初始化
    console.log('开始复杂异步流程')
    const config = await loadConfiguration()

    // 步骤2：验证配置
    if (!validateConfig(config)) {
      throw new Error('配置验证失败')
    }

    // 步骤3：并行执行多个初始化任务
    const [database, cache, logger] = await Promise.all([
      initializeDatabase(config.db),
      initializeCache(config.cache),
      initializeLogger(config.logging),
    ])

    // 步骤4：依次执行依赖任务
    const services = await initializeServices(database, cache)
    const routes = await setupRoutes(services)
    const server = await startServer(routes, config.port)

    console.log('复杂异步流程完成')
    return {
      server,
      services,
      config,
    }
  } catch (error) {
    console.error('复杂异步流程失败:', error)
    throw error
  }
}

// 辅助函数
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('用户不存在')
  return response.json()
}

async function fetchUserPosts(id) {
  const response = await fetch(`/api/users/${id}/posts`)
  return response.json()
}

async function fetchUserFriends(id) {
  const response = await fetch(`/api/users/${id}/friends`)
  return response.json()
}
```

**async/await的核心特性：**

1. **同步风格**：以同步代码的方式编写异步逻辑
2. **错误处理**：使用try-catch统一处理异步错误
3. **自动Promise包装**：async函数自动返回Promise
4. **顺序执行**：await会暂停函数执行，等待Promise完成

**常见使用模式：**

```javascript
// 模式1：基础异步函数
async function basicAsync() {
  const result = await someAsyncOperation()
  return result
}

// 模式2：错误处理
async function withErrorHandling() {
  try {
    const result = await riskyOperation()
    return result
  } catch (error) {
    console.error('操作失败:', error)
    return null
  }
}

// 模式3：并行执行
async function parallelExecution() {
  const [result1, result2] = await Promise.all([operation1(), operation2()])
  return { result1, result2 }
}

// 模式4：条件异步
async function conditionalAsync(condition) {
  const baseData = await getBaseData()

  if (condition) {
    baseData.extra = await getExtraData()
  }

  return baseData
}
```

**记忆要点总结：**

- async声明异步函数，await等待Promise完成
- 以同步风格编写异步代码，提高可读性
- 使用try-catch处理异步错误
- async函数自动返回Promise
- 合理使用并行和串行执行优化性能

# **129. [中级]** async函数返回什么？

- 返回一个promise

## 深度分析与补充

**问题本质解读：** 这道题考察async函数的返回值机制，面试官想了解你是否理解async函数与Promise的关系和自动包装机制。

**知识点系统梳理：**

**async函数返回值的处理规则：**

1. **自动Promise包装**：无论返回什么，都会被包装成Promise
2. **返回普通值**：Promise.resolve(value)
3. **返回Promise**：直接返回该Promise
4. **抛出异常**：Promise.reject(error)
5. **无返回值**：Promise.resolve(undefined)

**实战应用举例：**

```javascript
// 1. 返回普通值
async function returnValue() {
  return 'hello world'
}
// 等价于：Promise.resolve('hello world')

returnValue().then(value => {
  console.log(value) // "hello world"
})

// 2. 返回Promise
async function returnPromise() {
  return Promise.resolve('from promise')
}
// 直接返回Promise，不会双重包装

returnPromise().then(value => {
  console.log(value) // "from promise"
})

// 3. 抛出异常
async function throwError() {
  throw new Error('something went wrong')
}
// 等价于：Promise.reject(new Error('something went wrong'))

throwError().catch(error => {
  console.log(error.message) // "something went wrong"
})

// 4. 无返回值
async function noReturn() {
  console.log('执行一些操作')
  // 没有return语句
}
// 等价于：Promise.resolve(undefined)

noReturn().then(value => {
  console.log(value) // undefined
})

// 5. 复杂返回值处理
async function complexReturn(type) {
  switch (type) {
    case 'object':
      return { data: 'object data', timestamp: Date.now() }
    case 'array':
      return [1, 2, 3, 4, 5]
    case 'promise':
      return fetch('/api/data').then(r => r.json())
    case 'async':
      const result = await someAsyncOperation()
      return result
    case 'error':
      throw new Error('Intentional error')
    default:
      return null
  }
}

// 使用示例
async function demonstrateReturns() {
  try {
    const obj = await complexReturn('object')
    console.log('对象:', obj)

    const arr = await complexReturn('array')
    console.log('数组:', arr)

    const promiseResult = await complexReturn('promise')
    console.log('Promise结果:', promiseResult)

    const asyncResult = await complexReturn('async')
    console.log('异步结果:', asyncResult)
  } catch (error) {
    console.log('捕获错误:', error.message)
  }
}
```

**async函数返回值的特殊情况：**

```javascript
// 1. 返回thenable对象
async function returnThenable() {
  return {
    then(resolve, reject) {
      setTimeout(() => resolve('thenable result'), 1000)
    },
  }
}

// 2. 返回另一个async函数的调用
async function innerAsync() {
  return 'inner result'
}

async function outerAsync() {
  return innerAsync() // 返回Promise
}

// 3. 条件返回
async function conditionalReturn(condition) {
  if (condition) {
    return await fetchData()
  } else {
    return 'default value'
  }
}

// 4. 在try-catch中的返回
async function returnInTryCatch() {
  try {
    const data = await riskyOperation()
    return data
  } catch (error) {
    console.error('操作失败:', error)
    return null // 返回默认值
  }
}
```

**与Promise的对比：**

```javascript
// Promise写法
function promiseFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('promise result')
    }, 1000)
  })
}

// async/await写法
async function asyncFunction() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'async result'
}

// 两者都返回Promise
console.log(promiseFunction()) // Promise对象
console.log(asyncFunction()) // Promise对象
```

**记忆要点总结：**

- async函数总是返回Promise对象
- 返回值自动被Promise.resolve()包装
- 抛出异常会变成Promise.reject()
- 无返回值等于返回Promise.resolve(undefined)
- 返回Promise不会双重包装

# **130. [中级]** 如何在async函数中处理错误？

- ~~在外部包一个try-catch 捕获异常~~

## 深度分析与补充

**问题本质解读：** 这道题考察async/await中的错误处理机制，面试官想了解你是否掌握异步错误处理的最佳实践。

**技术错误纠正：**

- 不是"在外部包一个try-catch"，而是在async函数内部使用try-catch
- 还有其他多种错误处理方式

**知识点系统梳理：**

**async/await错误处理的多种方式：**

1. **try-catch块**：在async函数内部捕获错误
2. **Promise.catch()**：链式调用处理错误
3. **混合方式**：结合try-catch和.catch()
4. **全局错误处理**：unhandledRejection事件

**实战应用举例：**

```javascript
// 1. 基础try-catch错误处理
async function basicErrorHandling() {
  try {
    const response = await fetch('/api/data')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('请求失败:', error.message)
    throw error // 重新抛出或返回默认值
  }
}

// 2. 多层错误处理
async function multiLevelErrorHandling(userId) {
  try {
    // 第一层：获取用户基本信息
    const user = await fetchUser(userId)

    try {
      // 第二层：获取用户详细信息
      const profile = await fetchUserProfile(user.id)
      user.profile = profile
    } catch (profileError) {
      console.warn('获取用户资料失败，使用默认资料:', profileError.message)
      user.profile = getDefaultProfile()
    }

    try {
      // 第三层：获取用户设置
      const settings = await fetchUserSettings(user.id)
      user.settings = settings
    } catch (settingsError) {
      console.warn('获取用户设置失败，使用默认设置:', settingsError.message)
      user.settings = getDefaultSettings()
    }

    return user
  } catch (error) {
    console.error('获取用户信息失败:', error.message)
    return null
  }
}

// 3. 条件错误处理
async function conditionalErrorHandling(operation, fallbackOperation) {
  try {
    return await operation()
  } catch (error) {
    console.log('主操作失败，尝试备用操作:', error.message)

    if (fallbackOperation) {
      try {
        return await fallbackOperation()
      } catch (fallbackError) {
        console.error('备用操作也失败:', fallbackError.message)
        throw new Error('所有操作都失败了')
      }
    } else {
      throw error
    }
  }
}

// 4. 批量操作的错误处理
async function batchOperationWithErrorHandling(items) {
  const results = []
  const errors = []

  for (const item of items) {
    try {
      const result = await processItem(item)
      results.push({ item, result, status: 'success' })
    } catch (error) {
      errors.push({ item, error: error.message, status: 'failed' })
      console.error(`处理项目${item.id}失败:`, error.message)
    }
  }

  return {
    results,
    errors,
    summary: {
      total: items.length,
      successful: results.length,
      failed: errors.length,
    },
  }
}

// 5. 超时和重试的错误处理
async function withTimeoutAndRetry(operation, timeout = 5000, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 添加超时控制
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('操作超时')), timeout)
      })

      const result = await Promise.race([operation(), timeoutPromise])
      return result
    } catch (error) {
      console.log(`第${attempt}次尝试失败:`, error.message)

      if (attempt === maxRetries) {
        throw new Error(`操作失败，已重试${maxRetries}次: ${error.message}`)
      }

      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

// 6. 使用Promise.catch()的错误处理
async function promiseCatchErrorHandling() {
  const userData = await fetchUser(123).catch(error => {
    console.error('获取用户失败:', error)
    return getDefaultUser() // 返回默认用户
  })

  const userPosts = await fetchUserPosts(userData.id).catch(error => {
    console.error('获取用户文章失败:', error)
    return [] // 返回空数组
  })

  return {
    user: userData,
    posts: userPosts,
  }
}

// 7. 混合错误处理策略
async function hybridErrorHandling(userId) {
  try {
    // 关键操作使用try-catch
    const user = await fetchUser(userId)

    // 可选操作使用.catch()
    const [posts, friends, settings] = await Promise.all([
      fetchUserPosts(userId).catch(() => []),
      fetchUserFriends(userId).catch(() => []),
      fetchUserSettings(userId).catch(() => getDefaultSettings()),
    ])

    return {
      user,
      posts,
      friends,
      settings,
      loadedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    throw new Error(`无法加载用户${userId}的数据: ${error.message}`)
  }
}

// 8. 错误分类处理
async function categorizedErrorHandling() {
  try {
    const data = await fetchSensitiveData()
    return data
  } catch (error) {
    if (error.name === 'NetworkError') {
      console.error('网络错误，请检查网络连接')
      throw new Error('网络连接失败，请稍后重试')
    } else if (error.status === 401) {
      console.error('认证失败，需要重新登录')
      throw new Error('认证失败，请重新登录')
    } else if (error.status === 403) {
      console.error('权限不足')
      throw new Error('您没有权限访问此资源')
    } else if (error.status >= 500) {
      console.error('服务器错误')
      throw new Error('服务器暂时不可用，请稍后重试')
    } else {
      console.error('未知错误:', error)
      throw new Error('操作失败，请联系技术支持')
    }
  }
}

// 9. 资源清理的错误处理
async function resourceCleanupErrorHandling() {
  let connection = null
  let transaction = null

  try {
    connection = await createDatabaseConnection()
    transaction = await connection.beginTransaction()

    const result = await performDatabaseOperations(transaction)
    await transaction.commit()

    return result
  } catch (error) {
    console.error('数据库操作失败:', error)

    if (transaction) {
      try {
        await transaction.rollback()
      } catch (rollbackError) {
        console.error('回滚失败:', rollbackError)
      }
    }

    throw error
  } finally {
    // 确保资源被清理
    if (connection) {
      try {
        await connection.close()
      } catch (closeError) {
        console.error('关闭连接失败:', closeError)
      }
    }
  }
}
```

**错误处理最佳实践：**

1. **明确错误边界**：在合适的层级处理错误
2. **提供有意义的错误信息**：帮助调试和用户理解
3. **优雅降级**：提供默认值或备用方案
4. **资源清理**：使用finally确保资源释放
5. **错误分类**：根据错误类型采取不同策略

**记忆要点总结：**

- 在async函数内部使用try-catch捕获await的错误
- 可以结合Promise.catch()进行链式错误处理
- 支持多层错误处理和条件错误处理
- 使用finally进行资源清理
- 根据错误类型制定不同的处理策略

# **131. [中级]** async/await相比Promise的优势

- async await 本质上是 generator和promise 结合的语法糖，使用更加简洁，心智模型更加简单，以同步（类似）的方式来执行异步操作，可维护性更强

## 深度分析与补充

**问题本质解读：** 这道题考察async/await与Promise的对比，面试官想了解你是否理解两种异步编程方式的差异和各自的优势。

**知识点系统梳理：**

**async/await相比Promise的核心优势：**

1. **代码可读性**：同步风格的异步代码，更易理解
2. **错误处理**：统一的try-catch错误处理机制
3. **调试友好**：更好的堆栈跟踪和断点调试
4. **条件逻辑**：更容易处理复杂的条件异步逻辑
5. **中间值处理**：避免Promise链中的中间值传递问题

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 代码可读性对比
// Promise链式调用
function fetchUserDataPromise(userId) {
  return fetchUser(userId)
    .then(user => {
      return fetchUserProfile(user.id).then(profile => {
        return fetchUserSettings(user.id).then(settings => {
          return {
            user,
            profile,
            settings,
            timestamp: Date.now(),
          }
        })
      })
    })
    .catch(error => {
      console.error('获取用户数据失败:', error)
      throw error
    })
}

// async/await写法
async function fetchUserDataAsync(userId) {
  try {
    const user = await fetchUser(userId)
    const profile = await fetchUserProfile(user.id)
    const settings = await fetchUserSettings(user.id)

    return {
      user,
      profile,
      settings,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    throw error
  }
}

// 2. 错误处理对比
// Promise错误处理
function processDataPromise(data) {
  return validateData(data)
    .then(validData => {
      return transformData(validData)
    })
    .then(transformedData => {
      return saveData(transformedData)
    })
    .catch(validationError => {
      if (validationError.type === 'VALIDATION_ERROR') {
        console.error('数据验证失败:', validationError)
        return getDefaultData()
      }
      throw validationError
    })
    .catch(transformError => {
      if (transformError.type === 'TRANSFORM_ERROR') {
        console.error('数据转换失败:', transformError)
        return getRawData()
      }
      throw transformError
    })
    .catch(saveError => {
      console.error('数据保存失败:', saveError)
      throw saveError
    })
}

// async/await错误处理
async function processDataAsync(data) {
  try {
    const validData = await validateData(data)
    const transformedData = await transformData(validData)
    const result = await saveData(transformedData)
    return result
  } catch (error) {
    if (error.type === 'VALIDATION_ERROR') {
      console.error('数据验证失败:', error)
      return getDefaultData()
    } else if (error.type === 'TRANSFORM_ERROR') {
      console.error('数据转换失败:', error)
      return getRawData()
    } else {
      console.error('数据保存失败:', error)
      throw error
    }
  }
}

// 3. 条件逻辑处理对比
// Promise条件逻辑
function conditionalProcessPromise(userId, includeDetails) {
  return fetchUser(userId)
    .then(user => {
      if (includeDetails) {
        return fetchUserDetails(user.id).then(details => {
          user.details = details
          return user
        })
      }
      return user
    })
    .then(user => {
      if (user.isPremium) {
        return fetchPremiumFeatures(user.id).then(features => {
          user.premiumFeatures = features
          return user
        })
      }
      return user
    })
}

// async/await条件逻辑
async function conditionalProcessAsync(userId, includeDetails) {
  const user = await fetchUser(userId)

  if (includeDetails) {
    user.details = await fetchUserDetails(user.id)
  }

  if (user.isPremium) {
    user.premiumFeatures = await fetchPremiumFeatures(user.id)
  }

  return user
}
```

**Vue 3框架应用示例：**

```vue
<template>
  <div class="data-processor">
    <button
      @click="processWithPromise"
      :disabled="processing"
    >
      Promise方式处理
    </button>
    <button
      @click="processWithAsync"
      :disabled="processing"
    >
      async/await方式处理
    </button>

    <div
      v-if="processing"
      class="loading"
    >
      处理中...
    </div>
    <div
      v-if="result"
      class="result"
    >
      <h3>处理结果:</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
    <div
      v-if="error"
      class="error"
    >
      错误: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const processing = ref(false)
const result = ref(null)
const error = ref(null)

// Promise方式的数据处理
const processWithPromise = () => {
  processing.value = true
  error.value = null

  fetchUserAPI(123)
    .then(user => {
      return Promise.all([user, fetchUserPostsAPI(user.id), fetchUserStatsAPI(user.id)])
    })
    .then(([user, posts, stats]) => {
      return processUserDataAPI({
        user,
        posts,
        stats,
      })
    })
    .then(processedData => {
      result.value = processedData
    })
    .catch(err => {
      error.value = err.message
    })
    .finally(() => {
      processing.value = false
    })
}

// async/await方式的数据处理
const processWithAsync = async () => {
  processing.value = true
  error.value = null

  try {
    const user = await fetchUserAPI(123)
    const [posts, stats] = await Promise.all([
      fetchUserPostsAPI(user.id),
      fetchUserStatsAPI(user.id),
    ])

    const processedData = await processUserDataAPI({
      user,
      posts,
      stats,
    })

    result.value = processedData
  } catch (err) {
    error.value = err.message
  } finally {
    processing.value = false
  }
}

// 组合式函数：展示async/await的优势
const useAsyncDataProcessor = () => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const processData = async config => {
    loading.value = true
    error.value = null

    try {
      // 复杂的条件逻辑用async/await更清晰
      let result = await fetchInitialData(config.source)

      if (config.transform) {
        result = await transformData(result, config.transformOptions)
      }

      if (config.validate) {
        const isValid = await validateData(result)
        if (!isValid) {
          throw new Error('数据验证失败')
        }
      }

      if (config.enrich) {
        const enrichedData = await enrichData(result)
        result = { ...result, ...enrichedData }
      }

      data.value = result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, processData }
}
</script>
```

**优势对比总结：**

| 特性       | Promise             | async/await        |
| ---------- | ------------------- | ------------------ |
| 代码可读性 | 链式调用，嵌套复杂  | 同步风格，线性阅读 |
| 错误处理   | 多个catch，分散处理 | 统一try-catch      |
| 调试体验   | 堆栈跟踪困难        | 清晰的堆栈信息     |
| 条件逻辑   | 嵌套复杂            | 自然的if/else      |
| 中间值     | 需要传递或嵌套      | 直接使用变量       |
| 学习成本   | 需要理解链式概念    | 接近同步代码思维   |

**记忆要点总结：**

- async/await是Promise的语法糖，提供更好的开发体验
- 代码可读性和维护性显著提升
- 错误处理更加统一和直观
- 调试和堆栈跟踪更加友好
- 复杂条件逻辑处理更加自然
- 本质上仍然是Promise，性能相当

# **132. [中级]** 如何并发执行多个async操作？

- Promise.all
- Promise.race

## 深度分析与补充

**问题本质解读：** 这道题考察async/await中的并发处理，面试官想了解你是否理解如何在async函数中实现真正的并发执行。

**知识点系统梳理：**

**async/await并发执行的核心方法：**

1. **Promise.all()**：等待所有操作完成
2. **Promise.allSettled()**：等待所有操作结束（不管成功失败）
3. **Promise.race()**：返回最快完成的操作
4. **Promise.any()**：返回最快成功的操作
5. **手动并发控制**：控制并发数量

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础并发执行
// ❌ 串行执行（慢）
async function serialExecution() {
  const start = Date.now()

  const user = await fetchUser(1) // 1秒
  const posts = await fetchPosts(1) // 1秒
  const comments = await fetchComments(1) // 1秒

  console.log(`串行执行耗时: ${Date.now() - start}ms`) // 约3000ms
  return { user, posts, comments }
}

// ✅ 并发执行（快）
async function concurrentExecution() {
  const start = Date.now()

  const [user, posts, comments] = await Promise.all([
    fetchUser(1), // 并发执行
    fetchPosts(1), // 并发执行
    fetchComments(1), // 并发执行
  ])

  console.log(`并发执行耗时: ${Date.now() - start}ms`) // 约1000ms
  return { user, posts, comments }
}

// 2. 混合串行和并发
async function hybridExecution(userId) {
  // 第一步：获取用户信息（必须先执行）
  const user = await fetchUser(userId)

  // 第二步：基于用户信息并发获取相关数据
  const [profile, posts, friends, settings] = await Promise.all([
    fetchUserProfile(user.id),
    fetchUserPosts(user.id),
    fetchUserFriends(user.id),
    fetchUserSettings(user.id),
  ])

  // 第三步：基于前面的数据进行后续处理
  const [analytics, recommendations] = await Promise.all([
    generateAnalytics(user, posts),
    generateRecommendations(user, friends),
  ])

  return {
    user,
    profile,
    posts,
    friends,
    settings,
    analytics,
    recommendations,
  }
}

// 3. 错误处理的并发执行
async function concurrentWithErrorHandling() {
  try {
    const results = await Promise.allSettled([
      fetchCriticalData(),
      fetchOptionalData1(),
      fetchOptionalData2(),
      fetchOptionalData3(),
    ])

    const [critical, optional1, optional2, optional3] = results

    // 检查关键数据
    if (critical.status === 'rejected') {
      throw new Error('关键数据获取失败: ' + critical.reason.message)
    }

    // 处理可选数据
    const optionalData = [optional1, optional2, optional3]
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)

    return {
      critical: critical.value,
      optional: optionalData,
      errors: results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason.message),
    }
  } catch (error) {
    console.error('并发执行失败:', error)
    throw error
  }
}

// 4. 控制并发数量
async function limitedConcurrency(tasks, limit = 3) {
  const results = []

  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit)
    const batchResults = await Promise.all(batch.map(task => task().catch(error => ({ error }))))
    results.push(...batchResults)
  }

  return results
}

// 使用示例
async function processManyItems(items) {
  const tasks = items.map(item => () => processItem(item))
  return await limitedConcurrency(tasks, 5) // 最多5个并发
}

// 5. 超时控制的并发执行
async function concurrentWithTimeout(operations, timeout = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作超时')), timeout)
  })

  const operationsWithTimeout = operations.map(op => Promise.race([op, timeoutPromise]))

  return await Promise.allSettled(operationsWithTimeout)
}
```

**Vue 3框架应用示例：**

```vue
<template>
  <div class="concurrent-demo">
    <div class="controls">
      <button
        @click="loadDataSerial"
        :disabled="loading"
      >
        串行加载 (慢)
      </button>
      <button
        @click="loadDataConcurrent"
        :disabled="loading"
      >
        并发加载 (快)
      </button>
      <button
        @click="loadDataWithErrorHandling"
        :disabled="loading"
      >
        容错并发加载
      </button>
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      加载中... {{ loadingProgress }}%
    </div>

    <div
      v-if="data"
      class="results"
    >
      <h3>加载结果 (耗时: {{ loadTime }}ms)</h3>
      <div class="data-section">
        <h4>用户信息</h4>
        <p>{{ data.user?.name || '加载失败' }}</p>
      </div>
      <div class="data-section">
        <h4>文章数量</h4>
        <p>{{ data.posts?.length || 0 }}</p>
      </div>
      <div class="data-section">
        <h4>好友数量</h4>
        <p>{{ data.friends?.length || 0 }}</p>
      </div>
    </div>

    <div
      v-if="errors.length > 0"
      class="errors"
    >
      <h4>错误信息:</h4>
      <ul>
        <li
          v-for="error in errors"
          :key="error"
        >
          {{ error }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const loadingProgress = ref(0)
const data = ref(null)
const errors = ref([])
const loadTime = ref(0)

// 串行加载数据
const loadDataSerial = async () => {
  const startTime = Date.now()
  loading.value = true
  loadingProgress.value = 0
  errors.value = []

  try {
    loadingProgress.value = 25
    const user = await fetchUserAPI(123)

    loadingProgress.value = 50
    const posts = await fetchUserPostsAPI(user.id)

    loadingProgress.value = 75
    const friends = await fetchUserFriendsAPI(user.id)

    loadingProgress.value = 100
    data.value = { user, posts, friends }
  } catch (error) {
    errors.value = [error.message]
  } finally {
    loading.value = false
    loadTime.value = Date.now() - startTime
  }
}

// 并发加载数据
const loadDataConcurrent = async () => {
  const startTime = Date.now()
  loading.value = true
  loadingProgress.value = 0
  errors.value = []

  try {
    // 先获取用户信息
    loadingProgress.value = 25
    const user = await fetchUserAPI(123)

    // 并发获取相关数据
    loadingProgress.value = 50
    const [posts, friends, settings] = await Promise.all([
      fetchUserPostsAPI(user.id),
      fetchUserFriendsAPI(user.id),
      fetchUserSettingsAPI(user.id),
    ])

    loadingProgress.value = 100
    data.value = { user, posts, friends, settings }
  } catch (error) {
    errors.value = [error.message]
  } finally {
    loading.value = false
    loadTime.value = Date.now() - startTime
  }
}

// 容错并发加载
const loadDataWithErrorHandling = async () => {
  const startTime = Date.now()
  loading.value = true
  loadingProgress.value = 0
  errors.value = []

  try {
    loadingProgress.value = 25
    const user = await fetchUserAPI(123)

    loadingProgress.value = 50
    const results = await Promise.allSettled([
      fetchUserPostsAPI(user.id),
      fetchUserFriendsAPI(user.id),
      fetchUserSettingsAPI(user.id),
      fetchUserStatsAPI(user.id),
    ])

    loadingProgress.value = 100

    // 处理结果
    const [postsResult, friendsResult, settingsResult, statsResult] = results

    data.value = {
      user,
      posts: postsResult.status === 'fulfilled' ? postsResult.value : [],
      friends: friendsResult.status === 'fulfilled' ? friendsResult.value : [],
      settings: settingsResult.status === 'fulfilled' ? settingsResult.value : null,
      stats: statsResult.status === 'fulfilled' ? statsResult.value : null,
    }

    // 收集错误
    errors.value = results
      .filter(result => result.status === 'rejected')
      .map(result => result.reason.message)
  } catch (error) {
    errors.value = [error.message]
  } finally {
    loading.value = false
    loadTime.value = Date.now() - startTime
  }
}

// 组合式函数：并发数据加载
const useConcurrentDataLoader = () => {
  const data = ref({})
  const loading = ref(false)
  const errors = ref([])

  const loadMultipleResources = async resources => {
    loading.value = true
    errors.value = []

    try {
      const results = await Promise.allSettled(
        resources.map(async resource => {
          const result = await resource.loader()
          return { key: resource.key, data: result }
        }),
      )

      // 处理成功的结果
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          data.value[result.value.key] = result.value.data
        } else {
          errors.value.push(`${resources[index].key}: ${result.reason.message}`)
        }
      })
    } finally {
      loading.value = false
    }
  }

  return { data, loading, errors, loadMultipleResources }
}
</script>
```

**并发控制的最佳实践：**

```javascript
// 1. 智能并发控制
class ConcurrencyController {
  constructor(limit = 3) {
    this.limit = limit
    this.running = 0
    this.queue = []
  }

  async execute(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this._tryProcess()
    })
  }

  async _tryProcess() {
    if (this.running >= this.limit || this.queue.length === 0) {
      return
    }

    this.running++
    const { task, resolve, reject } = this.queue.shift()

    try {
      const result = await Promise.resolve().then(() => task())
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      this.running--
      if (this.queue.length > 0) this._tryProcess()
    }
  }
}

// 2. 批量处理工具
async function batchProcess(items, processor, batchSize = 10) {
  const results = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(item => processor(item).catch(error => ({ error, item }))),
    )
    results.push(...batchResults)
  }

  return results
}
```

**记忆要点总结：**

- 使用Promise.all()实现真正的并发执行
- 区分串行和并发的性能差异
- Promise.allSettled()用于容错并发处理
- 合理控制并发数量避免资源过载
- 结合超时机制提高系统稳定性

# **133. [高级]** async/await在循环中的使用注意事项

## 深度分析与补充

**问题本质解读：** 这道题考察async/await在循环中的正确使用方式，面试官想了解你是否理解串行、并发执行的差异以及性能优化策略。

**知识点系统梳理：**

**async/await在循环中的核心问题：**

1. **串行 vs 并发**：不同循环方式的执行顺序
2. **性能影响**：串行执行导致的性能问题
3. **错误处理**：循环中的异常处理策略
4. **内存管理**：大量异步操作的内存控制
5. **并发限制**：避免过多并发请求

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 常见错误：forEach中使用async/await
// ❌ 错误用法 - forEach不会等待async函数
async function wrongForEach(userIds) {
  const results = []

  userIds.forEach(async id => {
    const user = await fetchUser(id) // 并发执行，但无法控制
    results.push(user)
  })

  console.log(results) // 可能为空数组，因为没有等待
  return results
}

// ✅ 正确用法1 - for...of 串行执行
async function correctForOf(userIds) {
  const results = []

  for (const id of userIds) {
    const user = await fetchUser(id) // 串行执行，一个接一个
    results.push(user)
  }

  return results
}

// ✅ 正确用法2 - Promise.all 并发执行
async function correctPromiseAll(userIds) {
  const promises = userIds.map(id => fetchUser(id))
  const results = await Promise.all(promises) // 并发执行
  return results
}

// 2. 不同循环方式的对比
async function loopComparison(items) {
  console.log('=== 循环方式对比 ===')

  // for循环 - 串行执行
  console.time('for loop')
  for (let i = 0; i < items.length; i++) {
    await processItem(items[i])
  }
  console.timeEnd('for loop')

  // for...of循环 - 串行执行
  console.time('for...of')
  for (const item of items) {
    await processItem(item)
  }
  console.timeEnd('for...of')

  // map + Promise.all - 并发执行
  console.time('Promise.all')
  await Promise.all(items.map(item => processItem(item)))
  console.timeEnd('Promise.all')

  // reduce - 串行执行（高级用法）
  console.time('reduce')
  await items.reduce(async (previousPromise, item) => {
    await previousPromise
    return processItem(item)
  }, Promise.resolve())
  console.timeEnd('reduce')
}

// 3. 错误处理策略
async function errorHandlingInLoops(items) {
  // 策略1：遇到错误立即停止
  async function stopOnError() {
    try {
      for (const item of items) {
        await processItem(item) // 任一失败都会停止
      }
    } catch (error) {
      console.error('处理停止:', error)
      throw error
    }
  }

  // 策略2：收集所有错误，继续处理
  async function collectErrors() {
    const results = []
    const errors = []

    for (const item of items) {
      try {
        const result = await processItem(item)
        results.push({ item, result, status: 'success' })
      } catch (error) {
        errors.push({ item, error, status: 'failed' })
      }
    }

    return { results, errors }
  }

  // 策略3：使用Promise.allSettled
  async function useAllSettled() {
    const promises = items.map(async item => {
      try {
        const result = await processItem(item)
        return { item, result, status: 'fulfilled' }
      } catch (error) {
        return { item, error, status: 'rejected' }
      }
    })

    return await Promise.allSettled(promises)
  }

  return { stopOnError, collectErrors, useAllSettled }
}

// 4. 并发控制
async function concurrencyControl(items, limit = 3) {
  const results = []

  // 方法1：分批处理
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit)
    const batchResults = await Promise.all(
      batch.map(item => processItem(item).catch(error => ({ error, item }))),
    )
    results.push(...batchResults)
  }

  return results
}

// 5. 高级并发控制类
class AsyncIterator {
  constructor(concurrency = 3) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  async process(items, processor) {
    const results = []
    let index = 0

    const processNext = async () => {
      if (index >= items.length) return

      const currentIndex = index++
      const item = items[currentIndex]

      this.running++

      try {
        const result = await processor(item, currentIndex)
        results[currentIndex] = { success: true, result }
      } catch (error) {
        results[currentIndex] = { success: false, error }
      } finally {
        this.running--

        if (index < items.length) {
          processNext()
        }
      }
    }

    // 启动初始并发任务
    const initialTasks = Math.min(this.concurrency, items.length)
    await Promise.all(
      Array(initialTasks)
        .fill()
        .map(() => processNext()),
    )

    // 等待所有任务完成
    while (this.running > 0) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    return results
  }
}

// 6. 实际应用场景
async function realWorldScenarios() {
  // 场景1：批量用户数据处理
  async function batchUserProcessing(userIds) {
    const BATCH_SIZE = 5
    const results = []

    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batch = userIds.slice(i, i + BATCH_SIZE)

      console.log(
        `处理批次 ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(userIds.length / BATCH_SIZE)}`,
      )

      const batchResults = await Promise.allSettled(
        batch.map(async userId => {
          const user = await fetchUser(userId)
          const profile = await fetchUserProfile(userId)
          return { user, profile }
        }),
      )

      results.push(...batchResults)

      // 批次间延迟，避免服务器压力
      if (i + BATCH_SIZE < userIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  }

  // 场景2：文件批量上传
  async function batchFileUpload(files) {
    const MAX_CONCURRENT = 3
    const results = []

    for (let i = 0; i < files.length; i += MAX_CONCURRENT) {
      const batch = files.slice(i, i + MAX_CONCURRENT)

      const batchPromises = batch.map(async (file, index) => {
        try {
          console.log(`上传文件: ${file.name}`)
          const result = await uploadFile(file)
          return { file: file.name, result, status: 'success' }
        } catch (error) {
          console.error(`上传失败: ${file.name}`, error)
          return { file: file.name, error: error.message, status: 'failed' }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    return results
  }

  return { batchUserProcessing, batchFileUpload }
}
```

**Vue 3框架应用示例：**

```vue
<template>
  <div class="async-loop-demo">
    <div class="controls">
      <button
        @click="processSerial"
        :disabled="processing"
      >
        串行处理 (慢但稳定)
      </button>
      <button
        @click="processConcurrent"
        :disabled="processing"
      >
        并发处理 (快但可能过载)
      </button>
      <button
        @click="processControlled"
        :disabled="processing"
      >
        受控并发 (平衡)
      </button>
    </div>

    <div
      v-if="processing"
      class="progress"
    >
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <p>处理进度: {{ progress }}% ({{ processedCount }}/{{ totalCount }})</p>
    </div>

    <div
      v-if="results.length > 0"
      class="results"
    >
      <h3>处理结果</h3>
      <div class="summary">
        <span class="success">成功: {{ successCount }}</span>
        <span class="failed">失败: {{ failedCount }}</span>
        <span class="time">耗时: {{ processingTime }}ms</span>
      </div>

      <div class="result-list">
        <div
          v-for="(result, index) in results.slice(0, 10)"
          :key="index"
          :class="['result-item', result.status]"
        >
          <span>项目 {{ index + 1 }}: </span>
          <span v-if="result.status === 'success'">{{ result.data }}</span>
          <span v-else>{{ result.error }}</span>
        </div>
        <div
          v-if="results.length > 10"
          class="more"
        >
          还有 {{ results.length - 10 }} 个结果...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const processing = ref(false)
const progress = ref(0)
const processedCount = ref(0)
const totalCount = ref(0)
const results = ref([])
const processingTime = ref(0)

const successCount = computed(() => results.value.filter(r => r.status === 'success').length)

const failedCount = computed(() => results.value.filter(r => r.status === 'failed').length)

// 模拟数据
const generateItems = (count = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    shouldFail: Math.random() < 0.2, // 20% 失败率
  }))
}

// 模拟异步处理函数
const processItem = async item => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

  if (item.shouldFail) {
    throw new Error(`处理项目 ${item.name} 失败`)
  }

  return `${item.name} 处理完成`
}

// 串行处理
const processSerial = async () => {
  const items = generateItems()
  const startTime = Date.now()

  processing.value = true
  progress.value = 0
  processedCount.value = 0
  totalCount.value = items.length
  results.value = []

  try {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      try {
        const data = await processItem(item)
        results.value.push({
          id: item.id,
          status: 'success',
          data,
        })
      } catch (error) {
        results.value.push({
          id: item.id,
          status: 'failed',
          error: error.message,
        })
      }

      processedCount.value = i + 1
      progress.value = Math.round(((i + 1) / items.length) * 100)
    }
  } finally {
    processing.value = false
    processingTime.value = Date.now() - startTime
  }
}

// 并发处理
const processConcurrent = async () => {
  const items = generateItems()
  const startTime = Date.now()

  processing.value = true
  progress.value = 0
  processedCount.value = 0
  totalCount.value = items.length
  results.value = []

  try {
    const promises = items.map(async item => {
      try {
        const data = await processItem(item)
        processedCount.value++
        progress.value = Math.round((processedCount.value / items.length) * 100)
        return { id: item.id, status: 'success', data }
      } catch (error) {
        processedCount.value++
        progress.value = Math.round((processedCount.value / items.length) * 100)
        return { id: item.id, status: 'failed', error: error.message }
      }
    })

    results.value = await Promise.all(promises)
  } finally {
    processing.value = false
    processingTime.value = Date.now() - startTime
  }
}

// 受控并发处理
const processControlled = async () => {
  const items = generateItems()
  const startTime = Date.now()
  const BATCH_SIZE = 3

  processing.value = true
  progress.value = 0
  processedCount.value = 0
  totalCount.value = items.length
  results.value = []

  try {
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE)

      const batchPromises = batch.map(async item => {
        try {
          const data = await processItem(item)
          return { id: item.id, status: 'success', data }
        } catch (error) {
          return { id: item.id, status: 'failed', error: error.message }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.value.push(...batchResults)

      processedCount.value = Math.min(i + BATCH_SIZE, items.length)
      progress.value = Math.round((processedCount.value / items.length) * 100)
    }
  } finally {
    processing.value = false
    processingTime.value = Date.now() - startTime
  }
}
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.result-item.success {
  color: #4caf50;
}

.result-item.failed {
  color: #f44336;
}
</style>
```

**最佳实践总结：**

1. **避免在forEach中使用async/await**
2. **根据需求选择串行或并发执行**
3. **使用批处理控制并发数量**
4. **合理处理循环中的错误**
5. **考虑内存和性能影响**

**记忆要点总结：**

- forEach不等待async函数，使用for...of进行串行
- Promise.all实现并发，但要注意资源限制
- 使用Promise.allSettled处理部分失败场景
- 分批处理大量数据，避免内存溢出
- 根据业务需求选择合适的并发策略

# **134. [中级]** 顶层await的概念和用法

- 可以单独使用 await
- 只能在es module中使用
- 会阻塞其他模块的加载

## 深度分析与补充

**问题本质解读：** 这道题考察ES2022新特性顶层await，面试官想了解你是否理解模块级异步操作和现代JavaScript的发展趋势。

**知识点系统梳理：**

**顶层await的核心特性：**

1. **模块级异步**：在模块顶层直接使用await
2. **ES Module限制**：只能在ES模块中使用
3. **模块加载阻塞**：会阻塞模块的加载完成
4. **依赖传播**：影响导入该模块的其他模块
5. **错误处理**：需要合理处理顶层异步错误

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// config.js - 配置模块
// ✅ 顶层await加载配置
const response = await fetch('/api/config');
const config = await response.json();

export default config;
export const { apiUrl, timeout, retries } = config;

// database.js - 数据库连接模块
// ✅ 顶层await初始化数据库连接
import { createConnection } from './db-driver.js';

const connection = await createConnection({
  host: 'localhost',
  port: 5432,
  database: 'myapp'
});

// 确保连接成功后再导出
export default connection;

// utils.js - 工具模块
// ✅ 顶层await加载外部依赖
const { default: dayjs } = await import('dayjs');
const { default: customParseFormat } = await import('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

export { dayjs };

// ❌ 错误用法 - 在CommonJS中使用
// const fs = require('fs');
// const data = await fs.promises.readFile('config.json'); // SyntaxError

// ✅ 正确的CommonJS异步处理
// const fs = require('fs');
// (async () => {
//   const data = await fs.promises.readFile('config.json');
//   module.exports = JSON.parse(data);
// })();

// 实际应用场景
// 1. 环境配置加载
const isDevelopment = process.env.NODE_ENV === 'development';
const envConfig = await import(isDevelopment ? './config.dev.js' : './config.prod.js');

export const appConfig = {
  ...envConfig.default,
  loadedAt: new Date().toISOString()
};

// 2. 动态功能检测
let cryptoModule;
try {
  cryptoModule = await import('crypto');
} catch (error) {
  // 降级到Web Crypto API
  cryptoModule = { webcrypto: globalThis.crypto };
}

export const crypto = cryptoModule;

// 3. 条件性模块加载
const features = await fetch('/api/features').then(r => r.json());

const modules = {};
if (features.analytics) {
  modules.analytics = await import('./analytics.js');
}
if (features.chat) {
  modules.chat = await import('./chat.js');
}

export { modules };

// 4. 资源预加载
const criticalResources = await Promise.all([
  fetch('/api/user/current').then(r => r.json()),
  fetch('/api/app/settings').then(r => r.json()),
  import('./critical-components.js')
]);

export const [currentUser, appSettings, criticalComponents] = criticalResources;
```

**Vue 3框架应用示例：**

```javascript
// main.js - Vue应用入口
import { createApp } from 'vue'
import App from './App.vue'

// ✅ 顶层await加载应用配置
const config = await fetch('/api/app-config').then(r => r.json())

// 根据配置动态加载路由
const routerModule = config.useHashRouter
  ? await import('./router/hash.js')
  : await import('./router/history.js')

// 动态加载状态管理
const storeModule = config.useVuex
  ? await import('./store/vuex.js')
  : await import('./store/pinia.js')

// 创建应用实例
const app = createApp(App)

// 配置应用
app.use(routerModule.default)
app.use(storeModule.default)

// 全局配置
app.config.globalProperties.$config = config

// 挂载应用
app.mount('#app')

// plugins/auth.js - 认证插件
// ✅ 顶层await初始化认证状态
let authToken = localStorage.getItem('auth-token')
let currentUser = null

if (authToken) {
  try {
    const response = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (response.ok) {
      currentUser = await response.json()
    } else {
      localStorage.removeItem('auth-token')
      authToken = null
    }
  } catch (error) {
    console.error('认证验证失败:', error)
    localStorage.removeItem('auth-token')
    authToken = null
  }
}

export const authPlugin = {
  install(app) {
    app.config.globalProperties.$auth = {
      token: authToken,
      user: currentUser,
      isAuthenticated: !!currentUser,
    }
  },
}

// composables/useAsyncData.js - 组合式函数
import { ref, onMounted } from 'vue'

// ✅ 顶层await加载默认配置
const defaultConfig = await fetch('/api/default-config').then(r => r.json())

export function useAsyncData(url, options = {}) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const config = { ...defaultConfig, ...options }

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        timeout: config.timeout,
        retries: config.retries,
        ...config.fetchOptions,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)

  return { data, loading, error, refetch: fetchData }
}

// utils/feature-flags.js - 功能开关
// ✅ 顶层await加载功能开关配置
const featureFlags = await fetch('/api/feature-flags')
  .then(r => r.json())
  .catch(() => ({})) // 降级到空对象

export const isFeatureEnabled = feature => {
  return featureFlags[feature] === true
}

export const getFeatureConfig = feature => {
  return featureFlags[feature] || null
}

// 条件性功能加载
const enabledFeatures = {}

if (isFeatureEnabled('analytics')) {
  enabledFeatures.analytics = await import('./analytics.js')
}

if (isFeatureEnabled('experiments')) {
  enabledFeatures.experiments = await import('./experiments.js')
}

export { enabledFeatures }
```

**顶层await的注意事项：**

```javascript
// 1. 模块加载顺序影响
// moduleA.js
console.log('Module A: 开始加载')
await new Promise(resolve => setTimeout(resolve, 1000))
console.log('Module A: 加载完成')
export const dataA = 'A'

// moduleB.js
console.log('Module B: 开始加载')
import { dataA } from './moduleA.js' // 会等待moduleA完成
console.log('Module B: 加载完成', dataA)
export const dataB = 'B'

// 2. 错误处理
// errorModule.js
try {
  const data = await fetch('/api/critical-data').then(r => r.json())
  export const criticalData = data
} catch (error) {
  console.error('加载关键数据失败:', error)
  export const criticalData = null
}

// 3. 性能考虑
// 避免阻塞关键路径
const [essentialData, optionalData] = await Promise.allSettled([
  fetch('/api/essential').then(r => r.json()),
  fetch('/api/optional').then(r => r.json()),
])

export const essential = essentialData.status === 'fulfilled' ? essentialData.value : null

export const optional = optionalData.status === 'fulfilled' ? optionalData.value : null

// 4. 条件加载优化
const shouldLoadHeavyModule = await fetch('/api/should-load-heavy')
  .then(r => r.json())
  .then(data => data.shouldLoad)
  .catch(() => false)

export const heavyModule = shouldLoadHeavyModule ? await import('./heavy-module.js') : null
```

**浏览器兼容性和Polyfill：**

```javascript
// 检测顶层await支持
const supportsTopLevelAwait = (() => {
  try {
    new Function('await Promise.resolve()')
    return true
  } catch {
    return false
  }
})()

// 降级方案
if (!supportsTopLevelAwait) {
  // 使用IIFE包装
  ;(async () => {
    const config = await fetch('/api/config').then(r => r.json())
    // 处理配置...
  })()
}
```

**记忆要点总结：**

- 只能在ES模块中使用，不支持CommonJS
- 会阻塞模块加载，影响依赖该模块的其他模块
- 适用于模块初始化、配置加载、条件性导入
- 需要考虑错误处理和性能影响
- 现代构建工具和运行时环境支持良好

# **135. [高级]** 如何实现async/await的polyfill原理？

## 深度分析与补充

**问题本质解读：** 这道题考察async/await的底层实现原理，面试官想了解你是否理解Generator函数、Promise和自动执行器的关系。

**知识点系统梳理：**

**async/await的实现原理：**

1. **Generator函数**：提供暂停和恢复执行的能力
2. **Promise包装**：自动将返回值包装为Promise
3. **自动执行器**：自动执行Generator函数
4. **错误处理**：统一的异常处理机制
5. **状态管理**：维护异步操作的状态

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础的async/await polyfill实现
function asyncToGenerator(generatorFunction) {
  return function (...args) {
    const generator = generatorFunction.apply(this, args)

    return new Promise((resolve, reject) => {
      function step(key, arg) {
        try {
          const info = generator[key](arg)
          const { value, done } = info

          if (done) {
            // Generator执行完成
            resolve(value)
          } else {
            // 将value包装为Promise并继续执行
            Promise.resolve(value).then(
              result => step('next', result),
              error => step('throw', error),
            )
          }
        } catch (error) {
          reject(error)
        }
      }

      step('next')
    })
  }
}

// 使用示例
function* fetchUserGenerator(userId) {
  try {
    const user = yield fetch(`/api/users/${userId}`).then(r => r.json())
    const posts = yield fetch(`/api/users/${userId}/posts`).then(r => r.json())
    return { user, posts }
  } catch (error) {
    throw new Error(`获取用户数据失败: ${error.message}`)
  }
}

// 转换为async函数
const fetchUserAsync = asyncToGenerator(fetchUserGenerator)

// 2. 更完整的实现
class AsyncFunction {
  constructor(generatorFunction) {
    this.generatorFunction = generatorFunction
  }

  call(thisArg, ...args) {
    const generator = this.generatorFunction.apply(thisArg, args)

    return new Promise((resolve, reject) => {
      const step = (method, value) => {
        let result

        try {
          result = generator[method](value)
        } catch (error) {
          return reject(error)
        }

        const { value: stepValue, done } = result

        if (done) {
          return resolve(stepValue)
        }

        // 确保返回值是Promise
        const promise = Promise.resolve(stepValue)

        promise.then(
          value => step('next', value),
          error => step('throw', error),
        )
      }

      step('next')
    })
  }
}

// 3. Babel风格的转换实现
function _asyncToGenerator(fn) {
  return function () {
    const self = this
    const args = arguments

    return new Promise((resolve, reject) => {
      const gen = fn.apply(self, args)

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }

      _next(undefined)
    })
  }
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    const info = gen[key](arg)
    const { value, done } = info

    if (done) {
      resolve(value)
    } else {
      Promise.resolve(value).then(_next, _throw)
    }
  } catch (error) {
    reject(error)
  }
}

// 4. 支持并发的实现
function createAsyncFunction(generatorFunction) {
  const asyncFn = function (...args) {
    const generator = generatorFunction.apply(this, args)

    return new Promise((resolve, reject) => {
      const pending = new Map() // 跟踪并发操作
      let stepCount = 0

      function step(method, value) {
        const currentStep = ++stepCount

        try {
          const result = generator[method](value)
          const { value: stepValue, done } = result

          if (done) {
            resolve(stepValue)
            return
          }

          // 处理并发Promise
          if (Array.isArray(stepValue)) {
            Promise.all(stepValue).then(
              results => step('next', results),
              error => step('throw', error),
            )
          } else {
            Promise.resolve(stepValue).then(
              result => step('next', result),
              error => step('throw', error),
            )
          }
        } catch (error) {
          reject(error)
        }
      }

      step('next')
    })
  }

  // 保持原函数的属性
  Object.defineProperty(asyncFn, 'name', {
    value: generatorFunction.name,
    configurable: true,
  })

  return asyncFn
}

// 5. 实际转换示例
// 原始async函数
async function originalAsync(userId) {
  const user = await fetchUser(userId)
  const posts = await fetchPosts(user.id)
  return { user, posts }
}

// 转换后的Generator + 执行器
function* generatorVersion(userId) {
  const user = yield fetchUser(userId)
  const posts = yield fetchPosts(user.id)
  return { user, posts }
}

const polyfillAsync = _asyncToGenerator(generatorVersion)

// 6. 错误处理的完整实现
function robustAsyncToGenerator(generatorFunction) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const generator = generatorFunction.apply(this, args)
      let isSettled = false

      function settle(method, value) {
        if (isSettled) return

        try {
          const result = generator[method](value)

          if (result.done) {
            isSettled = true
            resolve(result.value)
          } else {
            Promise.resolve(result.value)
              .then(
                value => settle('next', value),
                error => settle('throw', error),
              )
              .catch(error => {
                if (!isSettled) {
                  isSettled = true
                  reject(error)
                }
              })
          }
        } catch (error) {
          if (!isSettled) {
            isSettled = true
            reject(error)
          }
        }
      }

      settle('next')
    })
  }
}

// 7. 性能优化版本
function optimizedAsyncToGenerator(generatorFunction) {
  const cache = new WeakMap()

  return function (...args) {
    // 缓存Generator实例
    let generator = cache.get(this)
    if (!generator) {
      generator = generatorFunction.apply(this, args)
      cache.set(this, generator)
    }

    return new Promise((resolve, reject) => {
      const step = (method, value) => {
        // 使用微任务优化
        queueMicrotask(() => {
          try {
            const { value: stepValue, done } = generator[method](value)

            if (done) {
              resolve(stepValue)
            } else {
              Promise.resolve(stepValue).then(
                result => step('next', result),
                error => step('throw', error),
              )
            }
          } catch (error) {
            reject(error)
          }
        })
      }

      step('next')
    })
  }
}
```

**Vue 3框架应用示例：**

```javascript
// composables/useAsyncPolyfill.js
import { ref, onMounted } from 'vue'

// 检测async/await支持
const supportsAsyncAwait = (() => {
  try {
    new Function('async () => {}')
    return true
  } catch {
    return false
  }
})()

// Polyfill实现
function createAsyncPolyfill() {
  if (supportsAsyncAwait) {
    return fn => fn // 原生支持，直接返回
  }

  return function asyncPolyfill(generatorFunction) {
    return function (...args) {
      const generator = generatorFunction.apply(this, args)

      return new Promise((resolve, reject) => {
        function step(method, value) {
          try {
            const result = generator[method](value)
            const { value: stepValue, done } = result

            if (done) {
              resolve(stepValue)
            } else {
              Promise.resolve(stepValue).then(
                result => step('next', result),
                error => step('throw', error),
              )
            }
          } catch (error) {
            reject(error)
          }
        }

        step('next')
      })
    }
  }
}

// 使用组合式函数
export function useAsyncData(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const asyncPolyfill = createAsyncPolyfill()

  // Generator版本的数据获取
  function* fetchDataGenerator() {
    loading.value = true
    error.value = null

    try {
      const response = yield fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const result = yield response.json()
      data.value = result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 转换为async函数
  const fetchData = asyncPolyfill(fetchDataGenerator)

  onMounted(() => {
    fetchData()
  })

  return { data, loading, error, refetch: fetchData }
}

// utils/asyncTransform.js - 转换工具
export class AsyncTransformer {
  static transform(generatorFunction) {
    return function (...args) {
      const generator = generatorFunction.apply(this, args)

      return new Promise((resolve, reject) => {
        const step = (method, value) => {
          try {
            const result = generator[method](value)

            if (result.done) {
              resolve(result.value)
            } else {
              Promise.resolve(result.value).then(
                value => step('next', value),
                error => step('throw', error),
              )
            }
          } catch (error) {
            reject(error)
          }
        }

        step('next')
      })
    }
  }

  // 批量转换
  static transformObject(obj) {
    const transformed = {}

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function' && value.constructor.name === 'GeneratorFunction') {
        transformed[key] = this.transform(value)
      } else {
        transformed[key] = value
      }
    }

    return transformed
  }
}

// 使用示例
const apiMethods = {
  *fetchUser(id) {
    const response = yield fetch(`/api/users/${id}`)
    return yield response.json()
  },

  *updateUser(id, data) {
    const response = yield fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return yield response.json()
  },
}

// 转换为async方法
const asyncApiMethods = AsyncTransformer.transformObject(apiMethods)
```

**实现原理总结：**

1. **Generator函数**：提供yield暂停点
2. **自动执行器**：递归调用next()方法
3. **Promise包装**：将yield的值包装为Promise
4. **错误传播**：通过throw()方法传播错误
5. **状态管理**：跟踪Generator的执行状态

**记忆要点总结：**

- async/await本质是Generator + Promise + 自动执行器
- yield相当于await，暂停函数执行
- 自动执行器负责递归调用Generator的next()
- 错误通过Generator的throw()方法传播
- 现代转译工具如Babel使用类似原理进行转换

### 事件循环和微任务（5道）

# **136. [中级]** JavaScript的事件循环机制是什么？

- 单线程：JS单线程一个任务接一个任务执行
- 宏任务：setTimeout setInterval UI事件 XHR的回调；每次事件循环从宏任务队列中取一个到执行完成
- 微任务：Promise.then queueMicrotask的回调；事件循环中微任务优先于下一个宏任务，会将微任务队列中的全部微任务执行清空，再执行下一个宏任务
- 调用栈：存储正在执行的函数帧。同步代码直接进栈，执行完出栈
- 事件循环：不断重复：从宏任务中取出一个执行，执行完后清空微任务队列，执行渲染，执行下一个宏任务

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript异步执行机制的核心原理，面试官想了解你是否理解单线程JavaScript如何处理异步操作。

**技术错误纠正：**

- "setInteral"应该是"setInterval"
- "queueMicotask"应该是"queueMicrotask"

**知识点系统梳理：**

**事件循环的核心组件：**

1. **调用栈（Call Stack）**：执行同步代码的地方
2. **宏任务队列（Macrotask Queue）**：存储宏任务的队列
3. **微任务队列（Microtask Queue）**：存储微任务的队列
4. **Web APIs**：浏览器提供的异步API
5. **事件循环（Event Loop）**：协调各组件的执行机制

**事件循环执行流程：**

1. 执行调用栈中的同步代码
2. 调用栈清空后，执行所有微任务
3. 执行一个宏任务
4. 重复步骤2-3

```arduino
循环开始:
  ├─ 取一个宏任务并执行（比如用户点击或 setTimeout）
  │    └─ 执行同步代码（可能产生微任务）
  ├─ 宏任务结束
  ├─ 清空并执行所有微任务（直到队列为空）
  ├─ 执行 rAF 回调（若有）
  ├─ 浏览器渲染/绘制（若需要）
  └─ 下一轮循环（处理下一个宏任务）
```

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础事件循环演示
console.log('1') // 同步代码

setTimeout(() => {
  console.log('2') // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('3') // 微任务
})

console.log('4') // 同步代码

// 输出顺序: 1, 4, 3, 2

// 2. 复杂的执行顺序分析
function eventLoopDemo() {
  console.log('开始')

  setTimeout(() => console.log('宏任务1'), 0)

  Promise.resolve()
    .then(() => {
      console.log('微任务1')
      return Promise.resolve()
    })
    .then(() => {
      console.log('微任务2')
    })

  setTimeout(() => console.log('宏任务2'), 0)

  Promise.resolve().then(() => {
    console.log('微任务3')
    setTimeout(() => console.log('宏任务3'), 0)
  })

  console.log('结束')
}

// 输出顺序: 开始, 结束, 微任务1, 微任务3, 微任务2, 宏任务1, 宏任务2, 宏任务3

// 3. 微任务队列清空机制
function microtaskClearDemo() {
  setTimeout(() => console.log('宏任务'), 0)

  Promise.resolve().then(() => {
    console.log('微任务1')
    // 在微任务中添加新的微任务
    Promise.resolve().then(() => console.log('微任务1.1'))
    queueMicrotask(() => console.log('微任务1.2'))
  })

  Promise.resolve().then(() => {
    console.log('微任务2')
    Promise.resolve().then(() => console.log('微任务2.1'))
  })
}

// 输出: 微任务1, 微任务2, 微任务1.1, 微任务1.2, 微任务2.1, 宏任务

// 4. 不同类型任务的分类
function taskClassificationDemo() {
  // 宏任务
  setTimeout(() => console.log('setTimeout'), 0)
  setInterval(() => console.log('setInterval'), 100)
  setImmediate(() => console.log('setImmediate')) // Node.js

  // 微任务
  Promise.resolve().then(() => console.log('Promise.then'))
  queueMicrotask(() => console.log('queueMicrotask'))

  // 同步代码
  console.log('同步代码')
}

// 5. 事件循环可视化工具
class EventLoopVisualizer {
  constructor() {
    this.callStack = []
    this.macrotaskQueue = []
    this.microtaskQueue = []
    this.step = 0
  }

  log(message, type = 'sync') {
    this.step++
    console.log(`步骤${this.step}: [${type}] ${message}`)
    this.printState()
  }

  addMacrotask(task, delay = 0) {
    setTimeout(() => {
      this.macrotaskQueue.push(task)
      this.log(`添加宏任务: ${task.name}`, 'macrotask')
    }, delay)
  }

  addMicrotask(task) {
    this.microtaskQueue.push(task)
    this.log(`添加微任务: ${task.name}`, 'microtask')
  }

  executeSync(fn) {
    this.callStack.push(fn.name)
    this.log(`执行同步代码: ${fn.name}`, 'sync')
    fn()
    this.callStack.pop()
  }

  printState() {
    console.log('当前状态:', {
      callStack: this.callStack,
      macrotaskQueue: this.macrotaskQueue.map(t => t.name),
      microtaskQueue: this.microtaskQueue.map(t => t.name),
    })
  }
}

// 6. 实际应用场景
function realWorldScenarios() {
  // 场景1: 数据获取和UI更新
  function fetchAndUpdate() {
    console.log('开始获取数据')

    fetch('/api/data')
      .then(response => response.json()) // 微任务
      .then(data => {
        console.log('数据获取完成')
        // 使用setTimeout确保DOM更新在下一个事件循环
        setTimeout(() => {
          updateUI(data)
        }, 0)
      })

    console.log('请求已发送')
  }

  // 场景2: 批量操作优化
  function batchOperations() {
    const operations = []

    // 收集操作
    for (let i = 0; i < 1000; i++) {
      operations.push(() => console.log(`操作${i}`))
    }

    // 分批执行，避免阻塞
    function executeBatch(startIndex = 0) {
      const batchSize = 10
      const endIndex = Math.min(startIndex + batchSize, operations.length)

      for (let i = startIndex; i < endIndex; i++) {
        operations[i]()
      }

      if (endIndex < operations.length) {
        setTimeout(() => executeBatch(endIndex), 0)
      }
    }

    executeBatch()
  }

  // 场景3: 状态同步
  function stateSync() {
    let state = { count: 0 }
    const listeners = []

    function setState(newState) {
      state = { ...state, ...newState }

      // 使用微任务确保状态更新的同步性
      Promise.resolve().then(() => {
        listeners.forEach(listener => listener(state))
      })
    }

    function subscribe(listener) {
      listeners.push(listener)
    }

    return { setState, subscribe }
  }
}
```

**Vue 3框架应用示例：**

```vue
<template>
  <div class="event-loop-demo">
    <div class="controls">
      <button @click="demonstrateEventLoop">演示事件循环</button>
      <button @click="clearLogs">清空日志</button>
    </div>

    <div class="visualization">
      <div class="section">
        <h3>调用栈</h3>
        <div class="stack">
          <div
            v-for="(item, index) in callStack"
            :key="index"
            class="stack-item"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="section">
        <h3>微任务队列</h3>
        <div class="queue">
          <div
            v-for="(task, index) in microtaskQueue"
            :key="index"
            class="task-item microtask"
          >
            {{ task }}
          </div>
        </div>
      </div>

      <div class="section">
        <h3>宏任务队列</h3>
        <div class="queue">
          <div
            v-for="(task, index) in macrotaskQueue"
            :key="index"
            class="task-item macrotask"
          >
            {{ task }}
          </div>
        </div>
      </div>
    </div>

    <div class="logs">
      <h3>执行日志</h3>
      <div class="log-container">
        <div
          v-for="(log, index) in logs"
          :key="index"
          :class="['log-item', log.type]"
        >
          <span class="step">{{ log.step }}</span>
          <span class="type">[{{ log.type }}]</span>
          <span class="message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const callStack = ref([])
const microtaskQueue = ref([])
const macrotaskQueue = ref([])
const logs = ref([])
let stepCounter = 0

const addLog = (message, type = 'sync') => {
  stepCounter++
  logs.value.push({
    step: stepCounter,
    type,
    message,
    timestamp: Date.now(),
  })
}

const demonstrateEventLoop = async () => {
  stepCounter = 0
  logs.value = []
  callStack.value = []
  microtaskQueue.value = []
  macrotaskQueue.value = []

  addLog('开始演示事件循环', 'sync')

  // 模拟调用栈
  callStack.value.push('demonstrateEventLoop')

  // 添加宏任务
  setTimeout(() => {
    addLog('执行宏任务1: setTimeout', 'macrotask')
    macrotaskQueue.value.shift()
  }, 0)
  macrotaskQueue.value.push('setTimeout-1')
  addLog('添加宏任务: setTimeout', 'schedule')

  // 添加微任务
  Promise.resolve().then(() => {
    addLog('执行微任务1: Promise.then', 'microtask')
    microtaskQueue.value.shift()

    // 在微任务中添加新的微任务
    Promise.resolve().then(() => {
      addLog('执行微任务1.1: 嵌套Promise.then', 'microtask')
      microtaskQueue.value.shift()
    })
    microtaskQueue.value.push('nested-promise')
  })
  microtaskQueue.value.push('promise-1')
  addLog('添加微任务: Promise.then', 'schedule')

  // 添加更多任务
  queueMicrotask(() => {
    addLog('执行微任务2: queueMicrotask', 'microtask')
    microtaskQueue.value.shift()
  })
  microtaskQueue.value.push('queueMicrotask')
  addLog('添加微任务: queueMicrotask', 'schedule')

  setTimeout(() => {
    addLog('执行宏任务2: setTimeout', 'macrotask')
    macrotaskQueue.value.shift()
  }, 0)
  macrotaskQueue.value.push('setTimeout-2')
  addLog('添加宏任务: setTimeout', 'schedule')

  addLog('同步代码执行完成', 'sync')
  callStack.value.pop()

  // 使用nextTick观察Vue的更新时机
  await nextTick()
  addLog('Vue nextTick 执行', 'vue')
}

const clearLogs = () => {
  logs.value = []
  callStack.value = []
  microtaskQueue.value = []
  macrotaskQueue.value = []
  stepCounter = 0
}

// 组合式函数：事件循环调试工具
const useEventLoopDebugger = () => {
  const taskQueue = ref([])

  const scheduleTask = (task, type = 'macrotask', delay = 0) => {
    const taskInfo = {
      id: Date.now() + Math.random(),
      name: task.name || 'anonymous',
      type,
      scheduled: Date.now(),
      delay,
    }

    taskQueue.value.push(taskInfo)

    if (type === 'macrotask') {
      setTimeout(() => {
        task()
        removeTask(taskInfo.id)
      }, delay)
    } else if (type === 'microtask') {
      Promise.resolve().then(() => {
        task()
        removeTask(taskInfo.id)
      })
    }
  }

  const removeTask = taskId => {
    const index = taskQueue.value.findIndex(task => task.id === taskId)
    if (index > -1) {
      taskQueue.value.splice(index, 1)
    }
  }

  return { taskQueue, scheduleTask }
}
</script>

<style scoped>
.event-loop-demo {
  padding: 20px;
}

.visualization {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.section {
  flex: 1;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

.stack,
.queue {
  min-height: 100px;
  border: 1px dashed #ccc;
  padding: 10px;
}

.stack-item,
.task-item {
  background: #f0f0f0;
  padding: 5px;
  margin: 2px 0;
  border-radius: 3px;
}

.task-item.microtask {
  background: #e3f2fd;
}

.task-item.macrotask {
  background: #fff3e0;
}

.logs {
  margin-top: 20px;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
}

.log-item {
  padding: 2px 0;
  font-family: monospace;
}

.log-item.sync {
  color: #333;
}
.log-item.microtask {
  color: #1976d2;
}
.log-item.macrotask {
  color: #f57c00;
}
.log-item.schedule {
  color: #666;
}
.log-item.vue {
  color: #4caf50;
}

.step {
  display: inline-block;
  width: 30px;
  font-weight: bold;
}

.type {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}
</style>
```

**记忆要点总结：**

- 调用栈执行同步代码，清空后处理异步任务
- 微任务优先级高于宏任务，会清空整个微任务队列
- 每次事件循环：同步代码 → 微任务队列 → 一个宏任务
- 常见宏任务：setTimeout、setInterval、I/O、UI事件
- 常见微任务：Promise.then、queueMicrotask、MutationObserver

# **137. [中级]** 宏任务和微任务的区别

- 宏任务：用于分发事件与任务
- 微任务：用于在当前任务（宏任务）末尾立即执行剩余逻辑，微任务会在渲染之前全部跑完

## 深度分析与补充

**问题本质解读：** 这道题考察异步任务的分类和优先级机制，面试官想了解你是否理解JavaScript异步执行的精细化控制。

**知识点系统梳理：**

**宏任务（Macrotask）特点：**

1. **任务来源**：I/O操作、定时器、UI事件等
2. **执行时机**：每次事件循环只执行一个宏任务
3. **执行优先级**：低于微任务
4. **典型API**：setTimeout、setInterval、setImmediate、I/O、UI渲染

**微任务（Microtask）特点：**

1. **任务来源**：Promise回调、queueMicrotask等
2. **执行时机**：当前宏任务结束后立即执行所有微任务
3. **执行优先级**：高于宏任务
4. **典型API**：Promise.then、queueMicrotask、MutationObserver

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础优先级演示
console.log('=== 宏任务 vs 微任务优先级 ===')

setTimeout(() => console.log('宏任务1'), 0)
Promise.resolve().then(() => console.log('微任务1'))
setTimeout(() => console.log('宏任务2'), 0)
Promise.resolve().then(() => console.log('微任务2'))

// 输出: 微任务1, 微任务2, 宏任务1, 宏任务2

// 2. 微任务队列清空机制
function microtaskExhaustionDemo() {
  console.log('开始')

  setTimeout(() => console.log('宏任务'), 0)

  Promise.resolve().then(() => {
    console.log('微任务1')
    // 在微任务中添加新的微任务
    Promise.resolve().then(() => {
      console.log('微任务1.1')
      Promise.resolve().then(() => console.log('微任务1.1.1'))
    })
    queueMicrotask(() => console.log('微任务1.2'))
  })

  Promise.resolve().then(() => console.log('微任务2'))

  console.log('结束')
}
// 输出: 开始, 结束, 微任务1, 微任务2, 微任务1.1, 微任务1.2, 微任务1.1.1, 宏任务

// 3. 不同API的任务分类
function taskClassificationDemo() {
  console.log('=== 任务分类演示 ===')

  // 宏任务
  setTimeout(() => console.log('setTimeout - 宏任务'), 0)
  setInterval(() => {
    console.log('setInterval - 宏任务')
    clearInterval(this)
  }, 0)

  // 微任务
  Promise.resolve().then(() => console.log('Promise.then - 微任务'))
  queueMicrotask(() => console.log('queueMicrotask - 微任务'))

  // Node.js环境
  if (typeof setImmediate !== 'undefined') {
    setImmediate(() => console.log('setImmediate - 宏任务'))
  }
  if (typeof process !== 'undefined') {
    process.nextTick(() => console.log('process.nextTick - 微任务'))
  }
}

// 4. 实际应用场景对比
function practicalScenarios() {
  // 场景1: 状态更新和UI渲染
  function updateStateAndRender() {
    let state = { count: 0 }

    // 使用微任务确保状态更新的原子性
    function updateState(newState) {
      state = { ...state, ...newState }
      Promise.resolve().then(() => {
        console.log('状态已更新:', state)
        // 微任务中的DOM操作会在渲染前完成
        updateDOM(state)
      })
    }

    // 使用宏任务延迟非关键操作
    function scheduleAnalytics() {
      setTimeout(() => {
        console.log('发送分析数据')
        sendAnalytics(state)
      }, 0)
    }

    updateState({ count: 1 })
    scheduleAnalytics()
  }

  // 场景2: 批量DOM操作优化
  function batchDOMOperations() {
    const elements = document.querySelectorAll('.item')

    // 使用微任务批量处理DOM读取
    Promise.resolve().then(() => {
      const measurements = []
      elements.forEach(el => {
        measurements.push({
          width: el.offsetWidth,
          height: el.offsetHeight,
        })
      })

      // 使用宏任务进行DOM写入，避免布局抖动
      setTimeout(() => {
        elements.forEach((el, index) => {
          el.style.transform = `scale(${measurements[index].width / 100})`
        })
      }, 0)
    })
  }

  // 场景3: 错误处理策略
  function errorHandlingStrategies() {
    // 微任务中的错误处理
    Promise.resolve()
      .then(() => {
        throw new Error('微任务中的错误')
      })
      .catch(error => {
        console.error('微任务错误被捕获:', error.message)
      })

    // 宏任务中的错误处理
    setTimeout(() => {
      try {
        throw new Error('宏任务中的错误')
      } catch (error) {
        console.error('宏任务错误被捕获:', error.message)
      }
    }, 0)
  }
}

// 5. 性能对比分析
function performanceComparison() {
  const iterations = 1000

  // 微任务性能测试
  console.time('微任务执行时间')
  for (let i = 0; i < iterations; i++) {
    Promise.resolve().then(() => {
      // 微任务操作
    })
  }
  Promise.resolve().then(() => {
    console.timeEnd('微任务执行时间')
  })

  // 宏任务性能测试
  console.time('宏任务执行时间')
  let completed = 0
  for (let i = 0; i < iterations; i++) {
    setTimeout(() => {
      completed++
      if (completed === iterations) {
        console.timeEnd('宏任务执行时间')
      }
    }, 0)
  }
}
```

**任务类型对比表：**

| 特性     | 宏任务              | 微任务                |
| -------- | ------------------- | --------------------- |
| 执行时机 | 每轮循环一个        | 当前轮全部执行        |
| 优先级   | 低                  | 高                    |
| 典型用途 | I/O、定时器、UI事件 | Promise回调、状态同步 |
| 性能影响 | 可能阻塞渲染        | 执行过多会延迟宏任务  |
| 错误处理 | 独立的错误边界      | 可能影响后续微任务    |

**记忆要点总结：**

- 微任务优先级高于宏任务，会清空整个微任务队列
- 宏任务每次只执行一个，微任务会执行完所有
- 微任务适合状态同步，宏任务适合延迟操作
- 过多微任务会阻塞宏任务执行
- Vue的nextTick是微任务，确保DOM更新后执行

# **138. [高级]** Promise.resolve()在事件循环中的执行时机

- ~~如果是单个参数之间运行 属于同步代码 直接执行；~~ Promise.resolve()本身是同步执行的，但其then回调是异步的微任务
- ~~如果是后续的then方法运行 属于异步代码 是微任务 在某次微任务队列中按照顺序执行~~ 需要区分Promise创建、状态改变和回调执行的不同时机

## 深度分析与补充

**问题本质解读：** 这道题考察Promise.resolve()的执行机制，面试官想了解你是否理解Promise创建和回调执行的时机差异。

**技术错误纠正：**

- Promise.resolve()本身是同步执行的，但其then回调是异步的微任务
- 需要区分Promise创建、状态改变和回调执行的不同时机

**知识点系统梳理：**

**Promise.resolve()的执行阶段：**

1. **Promise创建**：同步执行，立即返回resolved状态的Promise
2. **then回调注册**：同步执行，将回调函数加入微任务队列
3. **回调执行**：异步执行，在微任务阶段执行

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. Promise.resolve()执行时机分析
console.log('=== Promise.resolve()执行时机 ===')

console.log('1. 开始')

const promise = Promise.resolve('resolved value')
console.log('2. Promise.resolve()已执行') // 同步执行

promise.then(value => {
  console.log('4. then回调执行:', value) // 微任务
})

console.log('3. then已注册') // 同步执行

// 输出顺序: 1, 2, 3, 4

// 2. 不同参数类型的处理
function resolveParameterTypes() {
  console.log('=== 不同参数类型处理 ===')

  // 普通值
  const p1 = Promise.resolve(42)
  console.log('普通值Promise已创建')

  // Promise对象
  const existingPromise = Promise.resolve('existing')
  const p2 = Promise.resolve(existingPromise)
  console.log('Promise对象Promise已创建')
  console.log('p2 === existingPromise:', p2 === existingPromise) // true

  // thenable对象
  const thenable = {
    then(resolve, reject) {
      console.log('thenable.then执行') // 同步执行
      resolve('thenable value')
    },
  }
  const p3 = Promise.resolve(thenable)
  console.log('thenable Promise已创建')

  // 验证执行顺序
  p1.then(value => console.log('p1 then:', value))
  p2.then(value => console.log('p2 then:', value))
  p3.then(value => console.log('p3 then:', value))
}

// 3. 与其他异步操作的时机对比
function timingComparison() {
  console.log('=== 执行时机对比 ===')

  console.log('1. 同步开始')

  // 宏任务
  setTimeout(() => console.log('5. setTimeout'), 0)

  // Promise.resolve - 同步创建，异步回调
  Promise.resolve().then(() => console.log('4. Promise.resolve().then'))

  // 立即resolved的Promise
  const immediatePromise = Promise.resolve('immediate')
  immediatePromise.then(value => console.log('3. immediate then:', value))

  console.log('2. 同步结束')

  // 输出: 1, 2, 3, 4, 5
}

// 4. 复杂的嵌套场景
function nestedScenarios() {
  console.log('=== 嵌套场景分析 ===')

  Promise.resolve().then(() => {
    console.log('微任务1开始')

    // 在微任务中创建新的Promise.resolve
    Promise.resolve('nested').then(value => {
      console.log('嵌套微任务:', value)
    })

    console.log('微任务1结束')
  })

  Promise.resolve().then(() => {
    console.log('微任务2')
  })

  console.log('同步代码结束')
}

// 5. 状态传播机制
function statePropagation() {
  console.log('=== 状态传播机制 ===')

  // 链式调用中的状态传播
  Promise.resolve('initial')
    .then(value => {
      console.log('第一个then:', value)
      return Promise.resolve('second') // 返回新的resolved Promise
    })
    .then(value => {
      console.log('第二个then:', value)
      return 'third' // 返回普通值
    })
    .then(value => {
      console.log('第三个then:', value)
    })

  // 错误状态的传播
  Promise.resolve('start')
    .then(value => {
      console.log('正常处理:', value)
      return Promise.reject('error occurred')
    })
    .then(value => {
      console.log('不会执行') // 跳过
    })
    .catch(error => {
      console.log('错误捕获:', error)
      return Promise.resolve('recovered')
    })
    .then(value => {
      console.log('恢复执行:', value)
    })
}

// 6. 性能优化应用
function performanceOptimization() {
  console.log('=== 性能优化应用 ===')

  // 批量处理优化
  function batchProcess(items) {
    return Promise.resolve().then(() => {
      console.log('开始批量处理')

      // 使用微任务确保批量操作的原子性
      const results = items.map(item => processItem(item))

      return Promise.all(results)
    })
  }

  // 状态同步优化
  function syncState(updates) {
    return Promise.resolve().then(() => {
      console.log('同步状态更新')

      // 确保所有状态更新在同一个微任务中完成
      updates.forEach(update => applyUpdate(update))

      return getCurrentState()
    })
  }

  // 缓存优化
  const cache = new Map()
  function getCachedData(key) {
    if (cache.has(key)) {
      // 即使是缓存命中，也返回Promise保持接口一致性
      return Promise.resolve(cache.get(key))
    }

    return fetchData(key).then(data => {
      cache.set(key, data)
      return data
    })
  }
}

// 辅助函数
function processItem(item) {
  return `processed-${item}`
}

function applyUpdate(update) {
  console.log('应用更新:', update)
}

function getCurrentState() {
  return { timestamp: Date.now() }
}

function fetchData(key) {
  return Promise.resolve(`data-for-${key}`)
}
```

**执行时机总结：**

| 操作              | 执行时机       | 说明                          |
| ----------------- | -------------- | ----------------------------- |
| Promise.resolve() | 同步           | 立即创建resolved状态的Promise |
| .then()注册       | 同步           | 将回调加入微任务队列          |
| .then()回调       | 异步（微任务） | 在微任务阶段执行              |
| 链式.then()       | 异步（微任务） | 按顺序在微任务队列中执行      |

**记忆要点总结：**

- Promise.resolve()本身是同步的，立即返回resolved Promise
- then回调的注册是同步的，但执行是异步的微任务
- 即使Promise已经resolved，then回调仍然是异步执行
- 多个Promise.resolve().then()按注册顺序在微任务队列中执行
- 理解同步创建vs异步回调的区别是关键

# **139. [中级]** setTimeout(0)和Promise.resolve()的执行顺序

- setTimeout是宏任务
- Promise.resolve() 直接执行是同步任务 先于setTimeout； Promise.resolve().then() 是微任务，在某次宏任务执行完成后末尾一次性执行完全部微任务队列内的微任务

## 深度分析与补充

**问题本质解读：** 这道题考察宏任务和微任务的执行优先级，面试官想了解你是否理解事件循环中任务调度的精确机制。

**知识点系统梳理：**

**执行优先级规则：**

1. **同步代码** → **微任务队列** → **宏任务队列**
2. **微任务队列必须清空**才会执行下一个宏任务
3. **setTimeout(0)最小延迟**通常是4ms（浏览器限制）
4. **Promise.resolve()立即进入**微任务队列

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础执行顺序演示
console.log('=== 基础执行顺序 ===')

console.log('1. 同步代码开始')

setTimeout(() => {
  console.log('4. setTimeout(0) - 宏任务')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.resolve() - 微任务')
})

console.log('2. 同步代码结束')

// 输出顺序: 1, 2, 3, 4

// 2. 复杂嵌套场景
function complexNestingDemo() {
  console.log('=== 复杂嵌套场景 ===')

  setTimeout(() => {
    console.log('宏任务1')
    Promise.resolve().then(() => {
      console.log('宏任务1中的微任务')
    })
  }, 0)

  Promise.resolve().then(() => {
    console.log('微任务1')
    setTimeout(() => {
      console.log('微任务1中的宏任务')
    }, 0)

    Promise.resolve().then(() => {
      console.log('微任务1中的微任务')
    })
  })

  setTimeout(() => {
    console.log('宏任务2')
  }, 0)

  Promise.resolve().then(() => {
    console.log('微任务2')
  })
}

// 输出: 微任务1, 微任务2, 微任务1中的微任务, 宏任务1, 宏任务2, 宏任务1中的微任务, 微任务1中的宏任务
```

**记忆要点总结：**

- Promise.resolve()总是优先于setTimeout(0)执行
- 微任务队列必须完全清空才会执行宏任务
- setTimeout(0)实际延迟通常是4ms
- 嵌套微任务会延迟宏任务的执行
- 理解这个顺序对性能优化很重要

# **140. [高级]** 如何理解事件循环的执行栈、任务队列和微任务队列？

- 宏任务：setTimeout setInterval UI事件 XHR的回调；每次事件循环从宏任务队列中取一个到执行完成
- 微任务：Promise.then queueMicrotask的回调；事件循环中微任务优先于下一个宏任务，会将微任务队列中的全部微任务执行清空，再执行下一个宏任务
- 调用栈：存储正在执行的函数帧。同步代码直接进栈，执行完出栈
- 事件循环：不断重复：从宏任务中取出一个执行，执行完后清空微任务队列，执行渲染，执行下一个宏任务

## 深度分析与补充

**问题本质解读：** 这道题考察事件循环的完整机制，面试官想了解你是否深度理解JavaScript单线程异步执行的核心架构。

**技术错误纠正：**

- "setInteral"应该是"setInterval"
- "queueMicotask"应该是"queueMicrotask"

**知识点系统梳理：**

**事件循环的核心组件：**

1. **执行栈（Call Stack）**：存储当前执行的函数调用
2. **宏任务队列（Macrotask Queue）**：存储宏任务的FIFO队列
3. **微任务队列（Microtask Queue）**：存储微任务的FIFO队列
4. **Web APIs**：浏览器提供的异步API接口
5. **事件循环（Event Loop）**：协调各组件的调度机制

**事件循环的完整流程：**

1. 执行调用栈中的同步代码
2. 调用栈清空后，检查微任务队列
3. 执行所有微任务，直到微任务队列清空
4. 执行一个宏任务
5. 重复步骤2-4

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 事件循环完整流程演示
function eventLoopDemo() {
  console.log('=== 事件循环完整流程 ===')

  console.log('1. 执行栈：同步代码开始')

  // 添加宏任务到队列
  setTimeout(() => {
    console.log('5. 宏任务队列：setTimeout执行')
  }, 0)

  // 添加微任务到队列
  Promise.resolve().then(() => {
    console.log('3. 微任务队列：Promise.then执行')
  })

  queueMicrotask(() => {
    console.log('4. 微任务队列：queueMicrotask执行')
  })

  console.log('2. 执行栈：同步代码结束')

  // 执行顺序：1 → 2 → 3 → 4 → 5
}

// 2. 调用栈深度演示
function callStackDemo() {
  console.log('=== 调用栈演示 ===')

  function a() {
    console.log('函数a进入调用栈')
    b()
    console.log('函数a即将出栈')
  }

  function b() {
    console.log('函数b进入调用栈')
    c()
    console.log('函数b即将出栈')
  }

  function c() {
    console.log('函数c进入调用栈')
    console.log('函数c即将出栈')
  }

  a()
}

// 3. 复杂的队列交互
function complexQueueInteraction() {
  console.log('=== 复杂队列交互 ===')

  // 第一轮事件循环
  console.log('第一轮：同步代码')

  setTimeout(() => {
    console.log('第二轮：宏任务1')
    Promise.resolve().then(() => {
      console.log('第二轮：宏任务1中的微任务')
    })
  }, 0)

  Promise.resolve()
    .then(() => {
      console.log('第一轮：微任务1')
      setTimeout(() => {
        console.log('第三轮：微任务1中的宏任务')
      }, 0)

      return Promise.resolve()
    })
    .then(() => {
      console.log('第一轮：微任务2')
    })

  setTimeout(() => {
    console.log('第四轮：宏任务2')
  }, 0)
}

// 4. 事件循环可视化工具
class EventLoopVisualizer {
  constructor() {
    this.callStack = []
    this.macrotaskQueue = []
    this.microtaskQueue = []
    this.currentPhase = 'idle'
  }

  // 模拟同步函数调用
  executeSync(fn) {
    this.callStack.push(fn.name)
    this.currentPhase = 'executing'
    console.log(`[执行栈] 执行: ${fn.name}`)

    try {
      fn()
    } finally {
      this.callStack.pop()
      if (this.callStack.length === 0) {
        this.currentPhase = 'stack-empty'
        this.processMicrotasks()
      }
    }
  }

  // 添加宏任务
  addMacrotask(task) {
    this.macrotaskQueue.push(task)
    console.log(`[宏任务队列] 添加: ${task.name}`)
  }

  // 添加微任务
  addMicrotask(task) {
    this.microtaskQueue.push(task)
    console.log(`[微任务队列] 添加: ${task.name}`)
  }

  // 处理微任务队列
  processMicrotasks() {
    this.currentPhase = 'microtasks'
    console.log('[事件循环] 开始处理微任务队列')

    while (this.microtaskQueue.length > 0) {
      const task = this.microtaskQueue.shift()
      console.log(`[微任务队列] 执行: ${task.name}`)
      task()
    }

    console.log('[事件循环] 微任务队列已清空')
    this.processMacrotask()
  }

  // 处理宏任务
  processMacrotask() {
    if (this.macrotaskQueue.length > 0) {
      this.currentPhase = 'macrotask'
      const task = this.macrotaskQueue.shift()
      console.log(`[宏任务队列] 执行: ${task.name}`)

      this.executeSync(task)
    } else {
      this.currentPhase = 'idle'
      console.log('[事件循环] 进入空闲状态')
    }
  }

  // 获取当前状态
  getState() {
    return {
      phase: this.currentPhase,
      callStack: [...this.callStack],
      macrotaskQueue: this.macrotaskQueue.map(t => t.name),
      microtaskQueue: this.microtaskQueue.map(t => t.name),
    }
  }
}

// 5. 性能监控和优化
function performanceMonitoring() {
  console.log('=== 性能监控 ===')

  // 监控长任务
  function detectLongTasks() {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 50) {
          console.warn(`长任务检测: ${entry.name} 耗时 ${entry.duration}ms`)
        }
      })
    })

    observer.observe({ entryTypes: ['longtask'] })
  }

  // 优化微任务批处理
  function batchMicrotasks(tasks) {
    return new Promise(resolve => {
      queueMicrotask(() => {
        const results = tasks.map(task => {
          try {
            return task()
          } catch (error) {
            return { error }
          }
        })
        resolve(results)
      })
    })
  }

  // 时间切片优化
  function timeSlicing(tasks, timeSlice = 5) {
    return new Promise(resolve => {
      let index = 0
      const results = []

      function processChunk() {
        const start = performance.now()

        while (index < tasks.length && performance.now() - start < timeSlice) {
          results.push(tasks[index]())
          index++
        }

        if (index < tasks.length) {
          setTimeout(processChunk, 0) // 让出控制权
        } else {
          resolve(results)
        }
      }

      processChunk()
    })
  }
}

// 6. 实际应用场景
function realWorldApplications() {
  // 场景1: 响应式数据更新
  class ReactiveSystem {
    constructor() {
      this.pendingUpdates = new Set()
      this.isFlushPending = false
    }

    scheduleUpdate(component) {
      this.pendingUpdates.add(component)

      if (!this.isFlushPending) {
        this.isFlushPending = true
        queueMicrotask(() => {
          this.flushUpdates()
        })
      }
    }

    flushUpdates() {
      this.pendingUpdates.forEach(component => {
        component.update()
      })
      this.pendingUpdates.clear()
      this.isFlushPending = false
    }
  }

  // 场景2: 事件处理优化
  class EventHandler {
    constructor() {
      this.pendingEvents = []
      this.isProcessing = false
    }

    handleEvent(event) {
      this.pendingEvents.push(event)

      if (!this.isProcessing) {
        this.isProcessing = true
        queueMicrotask(() => {
          this.processEvents()
        })
      }
    }

    processEvents() {
      while (this.pendingEvents.length > 0) {
        const event = this.pendingEvents.shift()
        this.processEvent(event)
      }
      this.isProcessing = false
    }

    processEvent(event) {
      console.log('处理事件:', event.type)
    }
  }
}
```

**记忆要点总结：**

- 执行栈存储当前执行的函数调用
- 微任务队列优先级高于宏任务队列
- 事件循环：同步代码 → 微任务队列 → 一个宏任务
- 微任务队列必须完全清空才会执行宏任务
- 理解这个机制对性能优化和调试至关重要

---

## 现代JavaScript特性

### 模块化（5道）

# **141. [中级]** ES6模块与CommonJS模块的区别

- Es6 module 是采用 import 和 export 的方式；模块内的作用域不提升到外部；可以动态导入；可以导出任何值
- commonJs 是采用 require的方式

## 深度分析与补充

**问题本质解读：** 这道题考察两种主要模块系统的差异，面试官想了解你是否理解现代JavaScript模块化的发展和实际应用场景。

**知识点系统梳理：**

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

**实战应用举例：**

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

**记忆要点总结：**

- ES6模块是静态的，编译时确定依赖关系
- CommonJS是动态的，运行时加载模块
- ES6模块支持Tree-shaking，有利于代码优化
- CommonJS在Node.js中原生支持，ES6模块需要配置
- 现代前端开发推荐使用ES6模块
- 服务端开发CommonJS仍然广泛使用

# **142. [中级]** import和export的各种用法

- import Xxx from './xxx.js' 导入类或者函数； 需要在文件中导出 export default Xxx
- import {a,b,c} from './xxx.js' 导入多个方法； 在文件中可以定义多个导出内容 export const a = 1； export function b(){}
- import \* as moduleName from './xxx.js' 导入整个模块并重新命名
- import './style.js'
- export {Xxx} from './xxx.js'

## 深度分析与补充

**问题本质解读：** 这道题考察ES6模块系统的完整语法，面试官想了解你是否掌握各种导入导出方式的使用场景和最佳实践。

**技术错误纠正：**

- `import * as from './xxx.js'` 应该是 `import * as moduleName from './xxx.js'`
- 需要补充更多实际使用场景和语法变体

**知识点系统梳理：**

**export导出的各种方式：**

1. **命名导出（Named Exports）**：可以有多个
2. **默认导出（Default Export）**：每个模块只能有一个
3. **重新导出（Re-exports）**：从其他模块导出
4. **混合导出**：同时使用命名和默认导出

**import导入的各种方式：**

1. **默认导入**：导入默认导出
2. **命名导入**：导入指定的命名导出
3. **命名空间导入**：导入整个模块
4. **副作用导入**：只执行模块代码
5. **动态导入**：运行时导入

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. export的各种用法

// === 命名导出 (utils.js) ===
// 方式1: 声明时导出
export const PI = 3.14159;
export let counter = 0;
export var name = 'Utils';

export function add(a, b) {
  return a + b;
}

export class Calculator {
  constructor() {
    this.result = 0;
  }

  add(value) {
    this.result += value;
    return this;
  }
}

// 方式2: 声明后导出
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

export { subtract, multiply, divide };

// 方式3: 重命名导出
const internalFunction = () => 'internal';
export { internalFunction as publicFunction };

// === 默认导出 (math.js) ===
// 方式1: 直接导出值
export default function(x, y) {
  return x + y;
}

// 方式2: 导出变量
const defaultCalculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
export default defaultCalculator;

// 方式3: 导出类
export default class MathUtils {
  static square(x) {
    return x * x;
  }
}

// === 混合导出 (advanced.js) ===
export const version = '1.0.0';
export const author = 'Developer';

export default class AdvancedMath {
  static factorial(n) {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }
}

// 2. import的各种用法

// === 默认导入 ===
import MathUtils from './math.js';
import Calculator from './advanced.js'; // 导入默认导出的类
import defaultCalc from './math.js'; // 可以重命名

// === 命名导入 ===
import { PI, add, Calculator } from './utils.js';
import { subtract, multiply } from './utils.js';

// === 重命名导入 ===
import { add as sum, subtract as minus } from './utils.js';
import { Calculator as Calc } from './utils.js';

// === 混合导入 ===
import AdvancedMath, { version, author } from './advanced.js';

// === 命名空间导入 ===
import * as Utils from './utils.js';
// 使用: Utils.PI, Utils.add(), new Utils.Calculator()

import * as MathLib from './math.js';
// 使用: MathLib.default() 访问默认导出

// === 副作用导入 ===
import './polyfills.js'; // 只执行模块代码，不导入任何值
import './styles.css'; // 在构建工具中导入样式

// === 动态导入 ===
const mathModule = await import('./math.js');
const utils = await import('./utils.js');

// 条件导入
if (needAdvancedFeatures) {
  const advanced = await import('./advanced.js');
  const AdvancedMath = advanced.default;
}

// 3. 重新导出（Re-exports）

// === 基础重新导出 (index.js) ===
// 导出其他模块的命名导出
export { PI, add, Calculator } from './utils.js';
export { version, author } from './advanced.js';

// 重命名重新导出
export { add as sum } from './utils.js';

// 导出默认导出为命名导出
export { default as MathUtils } from './math.js';
export { default as AdvancedMath } from './advanced.js';

// === 命名空间重新导出 ===
export * from './utils.js'; // 导出所有命名导出
export * as Utils from './utils.js'; // 作为命名空间导出

// === 混合重新导出 ===
// 既重新导出又添加新的导出
export { PI, add } from './utils.js';
export const LIBRARY_VERSION = '2.0.0';
export default class MathLibrary {
  // 新的默认导出
}

// 4. 高级用法和模式

// === 条件导出 ===
// config.js
const isDevelopment = process.env.NODE_ENV === 'development';

export const config = isDevelopment
  ? await import('./config.dev.js')
  : await import('./config.prod.js');

// === 懒加载模式 ===
// components.js
export const LazyComponent = () => import('./LazyComponent.js');
export const HeavyLibrary = () => import('./heavy-library.js');

// === 插件系统 ===
// plugin-loader.js
const plugins = [];

export async function loadPlugin(pluginName) {
  try {
    const plugin = await import(`./plugins/${pluginName}.js`);
    plugins.push(plugin.default);
    return plugin.default;
  } catch (error) {
    console.error(`Failed to load plugin: ${pluginName}`, error);
  }
}

export function getLoadedPlugins() {
  return plugins;
}

// === 模块聚合器 ===
// api/index.js - 统一API入口
export { UserAPI } from './user.js';
export { ProductAPI } from './product.js';
export { OrderAPI } from './order.js';
export { default as BaseAPI } from './base.js';

// 提供便捷的统一接口
export const API = {
  User: UserAPI,
  Product: ProductAPI,
  Order: OrderAPI
};
```

**Vue 3框架应用示例：**

```javascript
// === Vue 3项目中的import/export应用 ===

// composables/index.js - 组合式函数聚合
export { useCounter } from './useCounter.js'
export { useLocalStorage } from './useLocalStorage.js'
export { useAsync } from './useAsync.js'
export { useFetch } from './useFetch.js'

// 默认导出常用组合
export { default as useCommon } from './useCommon.js'

// utils/index.js - 工具函数聚合
export * from './format.js'
export * from './validation.js'
export * from './date.js'

// 重新导出并重命名
export { debounce as delay } from './performance.js'
export { throttle as limit } from './performance.js'

// components/base/index.js - 基础组件导出
export { default as BaseButton } from './BaseButton.vue'
export { default as BaseInput } from './BaseInput.vue'
export { default as BaseModal } from './BaseModal.vue'

// 批量导出
const components = {
  BaseButton: () => import('./BaseButton.vue'),
  BaseInput: () => import('./BaseInput.vue'),
  BaseModal: () => import('./BaseModal.vue'),
}

export default components

// stores/index.js - Pinia状态管理聚合
export { useUserStore } from './user.js'
export { useCartStore } from './cart.js'
export { useSettingsStore } from './settings.js'

// 提供统一的store访问
export const stores = {
  user: useUserStore,
  cart: useCartStore,
  settings: useSettingsStore,
}

// router/modules/index.js - 路由模块聚合
export { default as userRoutes } from './user.js'
export { default as productRoutes } from './product.js'
export { default as adminRoutes } from './admin.js'

// 合并所有路由
import userRoutes from './user.js'
import productRoutes from './product.js'
import adminRoutes from './admin.js'

export const allRoutes = [...userRoutes, ...productRoutes, ...adminRoutes]

// plugins/index.js - 插件系统
export { default as i18nPlugin } from './i18n.js'
export { default as routerPlugin } from './router.js'
export { default as storePlugin } from './store.js'

// 插件安装器
export function installPlugins(app) {
  const plugins = [
    () => import('./i18n.js'),
    () => import('./router.js'),
    () => import('./store.js'),
  ]

  return Promise.all(
    plugins.map(async pluginLoader => {
      const plugin = await pluginLoader()
      app.use(plugin.default)
    }),
  )
}

// main.js - 应用入口的导入使用
import { createApp } from 'vue'
import App from './App.vue'

// 静态导入
import router from './router'
import { createPinia } from 'pinia'

// 动态导入
const { installPlugins } = await import('./plugins')

// 条件导入
if (import.meta.env.DEV) {
  const { setupDevtools } = await import('./devtools')
  setupDevtools()
}

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

await installPlugins(app)

app.mount('#app')
```

**使用场景和最佳实践：**

| 导入/导出方式 | 使用场景                 | 最佳实践             |
| ------------- | ------------------------ | -------------------- |
| 默认导出      | 模块主要功能、类、组件   | 每个模块只有一个     |
| 命名导出      | 工具函数、常量、多个功能 | 明确的命名，避免冲突 |
| 命名空间导入  | 大型库、工具集合         | 避免命名冲突         |
| 重新导出      | 模块聚合、API统一        | 创建清晰的模块边界   |
| 动态导入      | 代码分割、懒加载         | 性能优化，按需加载   |
| 副作用导入    | 样式、polyfill、初始化   | 确保执行顺序         |

**记忆要点总结：**

- export有命名导出和默认导出两种主要方式
- import支持多种导入模式：默认、命名、命名空间、动态
- 重新导出用于模块聚合和API统一
- 动态import()支持代码分割和懒加载
- 副作用导入用于执行模块代码而不导入值
- 合理使用不同方式可以优化代码结构和性能

# **143. [中级]** 动态import()的用法和应用场景

```javascript
const MyComponent = await import('./xxx.js')
```

## 深度分析与补充

**问题本质解读：** 这道题考察动态导入的实际应用，面试官想了解你是否理解代码分割、懒加载和性能优化的实现方式。

**技术错误纠正：**

- "cosnt"应该是"const"
- 需要补充更多实际应用场景和错误处理

**知识点系统梳理：**

**动态import()特点：**

1. **返回Promise**：异步加载模块
2. **运行时解析**：可以使用变量和表达式
3. **代码分割**：自动创建独立的chunk
4. **条件加载**：根据条件动态加载
5. **错误处理**：支持try/catch和.catch()

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础动态导入用法

// === 基本语法 ===
// 使用await
const module = await import('./module.js')
const { namedExport } = await import('./utils.js')
const defaultExport = (await import('./component.js')).default

// 使用Promise
import('./module.js')
  .then(module => {
    console.log(module.default)
  })
  .catch(error => {
    console.error('模块加载失败:', error)
  })

// 2. 条件动态导入
async function loadFeature(featureName) {
  try {
    switch (featureName) {
      case 'advanced':
        const advanced = await import('./features/advanced.js')
        return advanced.default

      case 'premium':
        const premium = await import('./features/premium.js')
        return premium.default

      default:
        const basic = await import('./features/basic.js')
        return basic.default
    }
  } catch (error) {
    console.error(`加载功能 ${featureName} 失败:`, error)
    // 降级到基础功能
    const fallback = await import('./features/fallback.js')
    return fallback.default
  }
}

// 3. 环境相关的动态导入
async function loadEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development'

  try {
    const config = await import(`./config/${env}.js`)
    return config.default
  } catch (error) {
    console.warn(`加载 ${env} 配置失败，使用默认配置`)
    const defaultConfig = await import('./config/default.js')
    return defaultConfig.default
  }
}

// 4. 用户交互触发的动态导入
class FeatureLoader {
  constructor() {
    this.loadedFeatures = new Map()
  }

  async loadOnDemand(featureId) {
    // 检查是否已加载
    if (this.loadedFeatures.has(featureId)) {
      return this.loadedFeatures.get(featureId)
    }

    try {
      // 显示加载状态
      this.showLoading(featureId)

      const feature = await import(`./features/${featureId}.js`)
      const instance = new feature.default()

      // 缓存已加载的功能
      this.loadedFeatures.set(featureId, instance)

      this.hideLoading(featureId)
      return instance
    } catch (error) {
      this.hideLoading(featureId)
      this.showError(featureId, error)
      throw error
    }
  }

  showLoading(featureId) {
    console.log(`正在加载功能: ${featureId}...`)
  }

  hideLoading(featureId) {
    console.log(`功能 ${featureId} 加载完成`)
  }

  showError(featureId, error) {
    console.error(`功能 ${featureId} 加载失败:`, error)
  }
}

// 5. 路由级别的代码分割
class Router {
  constructor() {
    this.routes = new Map()
    this.currentRoute = null
  }

  // 注册路由
  addRoute(path, componentLoader) {
    this.routes.set(path, {
      component: null,
      loader: componentLoader,
      loading: false,
    })
  }

  // 导航到路由
  async navigate(path) {
    const route = this.routes.get(path)
    if (!route) {
      throw new Error(`路由 ${path} 不存在`)
    }

    // 如果组件未加载，动态加载
    if (!route.component && !route.loading) {
      route.loading = true

      try {
        const module = await route.loader()
        route.component = module.default
        route.loading = false
      } catch (error) {
        route.loading = false
        throw new Error(`加载路由组件失败: ${error.message}`)
      }
    }

    this.currentRoute = route
    return route.component
  }
}

// 使用示例
const router = new Router()

router.addRoute('/home', () => import('./pages/Home.js'))
router.addRoute('/about', () => import('./pages/About.js'))
router.addRoute('/contact', () => import('./pages/Contact.js'))

// 6. 插件系统的动态加载
class PluginManager {
  constructor() {
    this.plugins = new Map()
    this.hooks = new Map()
  }

  // 动态加载插件
  async loadPlugin(pluginName, options = {}) {
    try {
      const pluginModule = await import(`./plugins/${pluginName}/index.js`)
      const PluginClass = pluginModule.default

      const plugin = new PluginClass(options)

      // 初始化插件
      if (typeof plugin.init === 'function') {
        await plugin.init()
      }

      // 注册插件钩子
      if (plugin.hooks) {
        Object.entries(plugin.hooks).forEach(([hookName, handler]) => {
          this.registerHook(hookName, handler)
        })
      }

      this.plugins.set(pluginName, plugin)
      console.log(`插件 ${pluginName} 加载成功`)

      return plugin
    } catch (error) {
      console.error(`插件 ${pluginName} 加载失败:`, error)
      throw error
    }
  }

  // 卸载插件
  async unloadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) return

    // 清理插件钩子
    if (plugin.hooks) {
      Object.keys(plugin.hooks).forEach(hookName => {
        this.unregisterHook(hookName, plugin.hooks[hookName])
      })
    }

    // 销毁插件
    if (typeof plugin.destroy === 'function') {
      await plugin.destroy()
    }

    this.plugins.delete(pluginName)
    console.log(`插件 ${pluginName} 已卸载`)
  }

  registerHook(name, handler) {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, [])
    }
    this.hooks.get(name).push(handler)
  }

  unregisterHook(name, handler) {
    const handlers = this.hooks.get(name)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
}

// 7. 国际化的动态加载
class I18n {
  constructor(defaultLocale = 'en') {
    this.currentLocale = defaultLocale
    this.messages = new Map()
    this.loadingPromises = new Map()
  }

  async loadLocale(locale) {
    // 避免重复加载
    if (this.messages.has(locale)) {
      return this.messages.get(locale)
    }

    // 避免并发加载同一语言
    if (this.loadingPromises.has(locale)) {
      return this.loadingPromises.get(locale)
    }

    const loadingPromise = this.doLoadLocale(locale)
    this.loadingPromises.set(locale, loadingPromise)

    try {
      const messages = await loadingPromise
      this.messages.set(locale, messages)
      this.loadingPromises.delete(locale)
      return messages
    } catch (error) {
      this.loadingPromises.delete(locale)
      throw error
    }
  }

  async doLoadLocale(locale) {
    try {
      const module = await import(`./locales/${locale}.js`)
      return module.default
    } catch (error) {
      console.warn(`加载语言包 ${locale} 失败，尝试加载备用语言包`)

      // 尝试加载语言的基础版本（如 zh-CN -> zh）
      const baseLocale = locale.split('-')[0]
      if (baseLocale !== locale) {
        const baseModule = await import(`./locales/${baseLocale}.js`)
        return baseModule.default
      }

      throw error
    }
  }

  async setLocale(locale) {
    await this.loadLocale(locale)
    this.currentLocale = locale
  }

  t(key, params = {}) {
    const messages = this.messages.get(this.currentLocale)
    if (!messages) {
      return key
    }

    let message = messages[key] || key

    // 简单的参数替换
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, value)
    })

    return message
  }
}
```

**Vue 3框架应用示例：**

```vue
<!-- 动态组件加载示例 -->
<template>
  <div class="dynamic-component-demo">
    <div class="component-selector">
      <button
        v-for="component in availableComponents"
        :key="component.name"
        @click="loadComponent(component.name)"
        :disabled="loading"
      >
        {{ component.label }}
      </button>
    </div>

    <div class="component-container">
      <div
        v-if="loading"
        class="loading"
      >
        正在加载组件...
      </div>

      <div
        v-else-if="error"
        class="error"
      >
        加载失败: {{ error.message }}
        <button @click="retry">重试</button>
      </div>

      <component
        v-else-if="currentComponent"
        :is="currentComponent"
        v-bind="componentProps"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'

const availableComponents = [
  { name: 'chart', label: '图表组件' },
  { name: 'table', label: '表格组件' },
  { name: 'form', label: '表单组件' },
  { name: 'calendar', label: '日历组件' },
]

const currentComponent = shallowRef(null)
const loading = ref(false)
const error = ref(null)
const componentProps = ref({})
const lastComponentName = ref('')

// 动态加载组件
const loadComponent = async componentName => {
  if (loading.value) return

  loading.value = true
  error.value = null
  lastComponentName.value = componentName

  try {
    // 动态导入组件
    const module = await import(`@/components/dynamic/${componentName}.vue`)
    currentComponent.value = module.default

    // 根据组件设置不同的props
    componentProps.value = getComponentProps(componentName)
  } catch (err) {
    error.value = err
    currentComponent.value = null
  } finally {
    loading.value = false
  }
}

// 重试加载
const retry = () => {
  if (lastComponentName.value) {
    loadComponent(lastComponentName.value)
  }
}

// 获取组件props
const getComponentProps = componentName => {
  const propsMap = {
    chart: { type: 'line', data: [] },
    table: { columns: [], data: [] },
    form: { fields: [] },
    calendar: { events: [] },
  }
  return propsMap[componentName] || {}
}

// 组合式函数：动态组件加载器
const useDynamicComponent = () => {
  const componentCache = new Map()

  const loadComponent = async path => {
    // 检查缓存
    if (componentCache.has(path)) {
      return componentCache.get(path)
    }

    try {
      const module = await import(path)
      const component = module.default

      // 缓存组件
      componentCache.set(path, component)

      return component
    } catch (error) {
      console.error(`加载组件失败: ${path}`, error)
      throw error
    }
  }

  const preloadComponent = path => {
    // 预加载组件但不返回
    loadComponent(path).catch(() => {
      // 忽略预加载错误
    })
  }

  const clearCache = () => {
    componentCache.clear()
  }

  return {
    loadComponent,
    preloadComponent,
    clearCache,
  }
}

// 路由级代码分割
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/users',
    component: () => import('@/views/Users.vue'),
  },
  {
    path: '/settings',
    component: () => import('@/views/Settings.vue'),
  },
]

// 条件性功能加载
const loadFeatureModule = async featureName => {
  const features = {
    analytics: () => import('@/features/analytics/index.js'),
    reporting: () => import('@/features/reporting/index.js'),
    admin: () => import('@/features/admin/index.js'),
  }

  const loader = features[featureName]
  if (!loader) {
    throw new Error(`未知功能: ${featureName}`)
  }

  return await loader()
}
</script>

<style scoped>
.dynamic-component-demo {
  padding: 20px;
}

.component-selector {
  margin-bottom: 20px;
}

.component-selector button {
  margin-right: 10px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
}

.component-selector button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.component-container {
  min-height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #e74c3c;
}

.error button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

**应用场景总结：**

| 应用场景       | 优势           | 注意事项         |
| -------------- | -------------- | ---------------- |
| 路由级代码分割 | 减少初始包大小 | 处理加载状态     |
| 条件功能加载   | 按需加载功能   | 错误处理和降级   |
| 插件系统       | 动态扩展能力   | 插件生命周期管理 |
| 国际化         | 减少语言包大小 | 缓存和并发控制   |
| 主题切换       | 动态样式加载   | 样式冲突处理     |
| A/B测试        | 动态实验功能   | 实验配置管理     |

**记忆要点总结：**

- 动态import()返回Promise，支持async/await
- 主要用于代码分割和懒加载
- 可以使用变量和表达式构建模块路径
- 需要处理加载失败的情况
- 适合大型应用的性能优化
- Vue 3中常用于路由和组件的懒加载

# **144. [高级]** 模块的循环依赖问题如何解决？

- 依赖注入
- 事件驱动
- 延迟导入
- 接口抽象
- 模块聚合器

## 深度分析与补充

**问题本质解读：** 这道题考察模块系统中的循环依赖处理，面试官想了解你是否理解模块加载机制和解决循环依赖的最佳实践。

**知识点系统梳理：**

**循环依赖的类型：**

1. **直接循环依赖**：A依赖B，B依赖A
2. **间接循环依赖**：A依赖B，B依赖C，C依赖A
3. **自循环依赖**：模块依赖自身

**不同模块系统的处理方式：**

1. **ES6模块**：使用TDZ（暂时性死区）处理
2. **CommonJS**：返回部分导出的对象
3. **AMD/RequireJS**：支持循环依赖检测

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 循环依赖问题演示

// === ES6模块循环依赖 ===
// userService.js
import { logActivity } from './activityService.js'

export class UserService {
  constructor() {
    this.users = []
  }

  createUser(userData) {
    const user = { id: Date.now(), ...userData }
    this.users.push(user)

    // 这里会导致循环依赖
    logActivity('user_created', user.id)

    return user
  }

  getUser(id) {
    return this.users.find(user => user.id === id)
  }
}

// activityService.js
import { UserService } from './userService.js'

const userService = new UserService() // 可能导致问题

export function logActivity(action, userId) {
  const user = userService.getUser(userId)
  console.log(`Activity: ${action} for user ${user?.name || 'Unknown'}`)
}

// === CommonJS循环依赖 ===
// a.js
const b = require('./b.js')
console.log('a.js:', b.value) // undefined

module.exports = {
  value: 'from a',
  getB: () => b,
}

// b.js
const a = require('./a.js')
console.log('b.js:', a.value) // undefined

module.exports = {
  value: 'from b',
  getA: () => a,
}

// 2. 解决方案1：依赖注入

// === 重构后的用户服务 ===
// userService.js
export class UserService {
  constructor(activityLogger = null) {
    this.users = []
    this.activityLogger = activityLogger
  }

  setActivityLogger(logger) {
    this.activityLogger = logger
  }

  createUser(userData) {
    const user = { id: Date.now(), ...userData }
    this.users.push(user)

    // 使用注入的依赖
    if (this.activityLogger) {
      this.activityLogger.log('user_created', user.id)
    }

    return user
  }

  getUser(id) {
    return this.users.find(user => user.id === id)
  }
}

// activityService.js
export class ActivityLogger {
  constructor(userService = null) {
    this.userService = userService
  }

  setUserService(userService) {
    this.userService = userService
  }

  log(action, userId) {
    const user = this.userService?.getUser(userId)
    console.log(`Activity: ${action} for user ${user?.name || 'Unknown'}`)
  }
}

// main.js - 组装依赖
import { UserService } from './userService.js'
import { ActivityLogger } from './activityService.js'

const userService = new UserService()
const activityLogger = new ActivityLogger()

// 设置相互依赖
userService.setActivityLogger(activityLogger)
activityLogger.setUserService(userService)

export { userService, activityLogger }

// 3. 解决方案2：事件驱动架构

// eventBus.js
class EventBus {
  constructor() {
    this.events = new Map()
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
  }

  off(event, callback) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, ...args) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }
}

export const eventBus = new EventBus()

// userService.js - 使用事件
import { eventBus } from './eventBus.js'

export class UserService {
  constructor() {
    this.users = []
  }

  createUser(userData) {
    const user = { id: Date.now(), ...userData }
    this.users.push(user)

    // 发布事件而不是直接调用
    eventBus.emit('user:created', user)

    return user
  }

  getUser(id) {
    return this.users.find(user => user.id === id)
  }
}

// activityService.js - 监听事件
import { eventBus } from './eventBus.js'

export class ActivityLogger {
  constructor() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    eventBus.on('user:created', user => {
      this.log('user_created', user.id)
    })

    eventBus.on('user:updated', user => {
      this.log('user_updated', user.id)
    })
  }

  log(action, userId) {
    console.log(`Activity: ${action} for user ${userId}`)
  }
}

// 4. 解决方案3：延迟导入

// userService.js
export class UserService {
  constructor() {
    this.users = []
  }

  async createUser(userData) {
    const user = { id: Date.now(), ...userData }
    this.users.push(user)

    // 延迟导入避免循环依赖
    const { logActivity } = await import('./activityService.js')
    logActivity('user_created', user.id)

    return user
  }

  getUser(id) {
    return this.users.find(user => user.id === id)
  }
}

// activityService.js
export async function logActivity(action, userId) {
  // 延迟导入
  const { UserService } = await import('./userService.js')
  const userService = new UserService()

  const user = userService.getUser(userId)
  console.log(`Activity: ${action} for user ${user?.name || 'Unknown'}`)
}

// 5. 解决方案4：接口抽象

// interfaces.js
export class IUserService {
  getUser(id) {
    throw new Error('Method must be implemented')
  }

  createUser(userData) {
    throw new Error('Method must be implemented')
  }
}

export class IActivityLogger {
  log(action, userId) {
    throw new Error('Method must be implemented')
  }
}

// userService.js
import { IUserService } from './interfaces.js'

export class UserService extends IUserService {
  constructor(activityLogger = null) {
    super()
    this.users = []
    this.activityLogger = activityLogger
  }

  setActivityLogger(logger) {
    this.activityLogger = logger
  }

  createUser(userData) {
    const user = { id: Date.now(), ...userData }
    this.users.push(user)

    if (this.activityLogger) {
      this.activityLogger.log('user_created', user.id)
    }

    return user
  }

  getUser(id) {
    return this.users.find(user => user.id === id)
  }
}

// activityService.js
import { IActivityLogger } from './interfaces.js'
import { IUserService } from './interfaces.js'

export class ActivityLogger extends IActivityLogger {
  constructor(userService = null) {
    super()
    this.userService = userService
  }

  setUserService(userService) {
    this.userService = userService
  }

  log(action, userId) {
    const user = this.userService?.getUser(userId)
    console.log(`Activity: ${action} for user ${user?.name || 'Unknown'}`)
  }
}

// main.js - 组装依赖
import { UserService } from './userService.js'
import { ActivityLogger } from './activityService.js'

const userService = new UserService()
const activityLogger = new ActivityLogger()

// 设置相互依赖
userService.setActivityLogger(activityLogger)
activityLogger.setUserService(userService)

export { userService, activityLogger }

// 6. 解决方案5：模块聚合器

// services/index.js - 统一服务入口
import { UserService } from './userService.js'
import { ActivityLogger } from './activityService.js'
import { NotificationService } from './notificationService.js'

// 创建服务实例
const userService = new UserService()
const activityLogger = new ActivityLogger()
const notificationService = new NotificationService()

// 设置依赖关系
userService.setActivityLogger(activityLogger)
userService.setNotificationService(notificationService)

activityLogger.setUserService(userService)
notificationService.setUserService(userService)

// 导出配置好的服务
export { userService, activityLogger, notificationService }

// 使用时只需要导入配置好的服务
// main.js
import { userService } from './services/index.js'

const user = userService.createUser({ name: 'John' })

// 7. 循环依赖检测工具

class CircularDependencyDetector {
  constructor() {
    this.dependencies = new Map()
    this.visiting = new Set()
    this.visited = new Set()
  }

  addDependency(from, to) {
    if (!this.dependencies.has(from)) {
      this.dependencies.set(from, [])
    }
    this.dependencies.get(from).push(to)
  }

  detectCircularDependencies() {
    const cycles = []

    for (const module of this.dependencies.keys()) {
      if (!this.visited.has(module)) {
        const cycle = this.dfs(module, [])
        if (cycle.length > 0) {
          cycles.push(cycle)
        }
      }
    }

    return cycles
  }

  dfs(module, path) {
    if (this.visiting.has(module)) {
      // 找到循环依赖
      const cycleStart = path.indexOf(module)
      return path.slice(cycleStart).concat(module)
    }

    if (this.visited.has(module)) {
      return []
    }

    this.visiting.add(module)
    path.push(module)

    const dependencies = this.dependencies.get(module) || []
    for (const dep of dependencies) {
      const cycle = this.dfs(dep, [...path])
      if (cycle.length > 0) {
        return cycle
      }
    }

    this.visiting.delete(module)
    this.visited.add(module)

    return []
  }
}

// 使用示例
const detector = new CircularDependencyDetector()
detector.addDependency('A', 'B')
detector.addDependency('B', 'C')
detector.addDependency('C', 'A') // 循环依赖

const cycles = detector.detectCircularDependencies()
console.log('检测到的循环依赖:', cycles)
```

**解决方案对比表：**

| 解决方案 | 优点         | 缺点         | 适用场景     |
| -------- | ------------ | ------------ | ------------ |
| 依赖注入 | 解耦，易测试 | 需要手动组装 | 复杂业务逻辑 |
| 事件驱动 | 完全解耦     | 调试困难     | 松耦合系统   |
| 延迟导入 | 简单直接     | 异步复杂性   | 简单循环依赖 |
| 接口抽象 | 类型安全     | 增加复杂性   | 大型项目     |
| 模块聚合 | 集中管理     | 单点依赖     | 服务层架构   |

**记忆要点总结：**

- 循环依赖是模块设计问题的表现
- ES6模块和CommonJS处理循环依赖的方式不同
- 依赖注入是最常用的解决方案
- 事件驱动可以完全解耦模块
- 延迟导入适合简单的循环依赖
- 良好的架构设计可以避免循环依赖

# **145. [中级]** Tree-shaking的原理是什么？

- tree-shaking 将没有引用但是没有实际使用的组件移除，以减轻包体积和提高代码编译速度
- es6模块静态结构是tree-shaking的基础

## 深度分析与补充

**问题本质解读：** 这道题考察Tree-shaking的工作机制，面试官想了解你是否理解静态分析、死代码消除和模块优化的原理。

**技术错误纠正：**

- Tree-shaking不仅仅是"注释"代码，而是完全移除未使用的代码
- 需要理解ES6模块的静态结构是Tree-shaking的基础

**知识点系统梳理：**

**Tree-shaking的工作原理：**

1. **静态分析**：分析ES6模块的导入导出关系
2. **依赖图构建**：构建模块依赖关系图
3. **标记阶段**：标记所有被使用的代码
4. **清除阶段**：移除未被标记的死代码
5. **优化输出**：生成优化后的bundle

**Tree-shaking的前提条件：**

1. **ES6模块**：必须使用import/export语法
2. **静态结构**：导入导出必须是静态的
3. **无副作用**：代码执行不能有副作用
4. **构建工具支持**：Webpack、Rollup等

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. Tree-shaking基础示例

// === utils.js - 工具库 ===
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  return a / b;
}

// 这个函数有副作用，可能影响Tree-shaking
export function logOperation(operation, result) {
  console.log(`Operation ${operation}: ${result}`);
}

// === main.js - 只使用部分功能 ===
import { add, multiply } from './utils.js';

// 只使用了add和multiply
const result1 = add(5, 3);
const result2 = multiply(4, 6);

console.log(result1, result2);

// 经过Tree-shaking后，subtract、divide和logOperation会被移除

// 2. Tree-shaking友好的代码写法

// === 好的写法 - 支持Tree-shaking ===
// math.js
export const PI = 3.14159;

export function calculateArea(radius) {
  return PI * radius * radius;
}

export function calculateCircumference(radius) {
  return 2 * PI * radius;
}

// 纯函数，无副作用
export function formatNumber(num, decimals = 2) {
  return Number(num.toFixed(decimals));
}

// === 不好的写法 - 阻碍Tree-shaking ===
// problematic.js

// 立即执行的代码（副作用）
console.log('Module loaded'); // 这会阻止Tree-shaking

// 动态导出
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// 这种方式不利于Tree-shaking
export default operations;

// 3. 副作用的处理

// === 有副作用的模块 ===
// analytics.js
let initialized = false;

export function init() {
  if (!initialized) {
    console.log('Analytics initialized');
    initialized = true;
  }
}

export function track(event) {
  if (!initialized) {
    init(); // 副作用：自动初始化
  }
  console.log(`Tracking: ${event}`);
}

// === 无副作用的重构版本 ===
// analytics-pure.js
export class Analytics {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (!this.initialized) {
      console.log('Analytics initialized');
      this.initialized = true;
    }
  }

  track(event) {
    if (!this.initialized) {
      this.init();
    }
    console.log(`Tracking: ${event}`);
  }
}

// 4. 条件导入和Tree-shaking

// === 条件导入示例 ===
// features.js
export function basicFeature() {
  return 'Basic functionality';
}

export function advancedFeature() {
  return 'Advanced functionality';
}

export function premiumFeature() {
  return 'Premium functionality';
}

// main.js
import { basicFeature } from './features.js';

// 根据条件动态导入（不利于Tree-shaking）
if (userLevel === 'premium') {
  import('./features.js').then(({ premiumFeature }) => {
    premiumFeature();
  });
}

// 更好的方式：静态导入 + 条件使用
import { basicFeature, premiumFeature } from './features.js';

if (userLevel === 'premium') {
  premiumFeature();
} else {
  basicFeature();
}

// 5. 第三方库的Tree-shaking

// === Lodash的Tree-shaking ===
// 不好的方式 - 导入整个库
import _ from 'lodash';
const result = _.debounce(fn, 300);

// 好的方式 - 按需导入
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// 更好的方式 - 使用ES6模块版本
import { debounce } from 'lodash-es';
const result = debounce(fn, 300);

// === 自定义库的Tree-shaking优化 ===
// ui-library/index.js
export { Button } from './components/Button.js';
export { Input } from './components/Input.js';
export { Modal } from './components/Modal.js';
export { Table } from './components/Table.js';

// 使用时只导入需要的组件
import { Button, Input } from 'ui-library';

// 6. Tree-shaking配置和优化

// === Webpack配置 ===
// webpack.config.js
module.exports = {
  mode: 'production', // 启用Tree-shaking
  optimization: {
    usedExports: true, // 标记未使用的导出
    sideEffects: false, // 声明代码无副作用
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false // 保持ES6模块语法
              }]
            ]
          }
        }
      }
    ]
  }
};

// === package.json配置 ===
{
  "name": "my-library",
  "sideEffects": false, // 声明整个包无副作用
  // 或者指定有副作用的文件
  "sideEffects": [
    "*.css",
    "./src/polyfills.js"
  ]
}

// 7. Tree-shaking分析工具

// === Webpack Bundle Analyzer ===
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};

// === 自定义Tree-shaking分析器 ===
class TreeShakingAnalyzer {
  constructor() {
    this.exports = new Map();
    this.imports = new Map();
    this.usedExports = new Set();
  }

  analyzeModule(moduleCode, modulePath) {
    // 分析导出
    const exportMatches = moduleCode.match(/export\s+(?:const|let|var|function|class)\s+(\w+)/g);
    if (exportMatches) {
      exportMatches.forEach(match => {
        const name = match.split(/\s+/).pop();
        this.exports.set(`${modulePath}:${name}`, {
          module: modulePath,
          name,
          used: false
        });
      });
    }

    // 分析导入
    const importMatches = moduleCode.match(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const [, imports, from] = match.match(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/);
        const importNames = imports.split(',').map(name => name.trim());

        importNames.forEach(name => {
          this.imports.set(`${modulePath}:${name}`, {
            module: modulePath,
            name,
            from
          });
          this.usedExports.add(`${from}:${name}`);
        });
      });
    }
  }

  getUnusedExports() {
    const unused = [];

    for (const [key, exportInfo] of this.exports) {
      if (!this.usedExports.has(key)) {
        unused.push(exportInfo);
      }
    }

    return unused;
  }

  generateReport() {
    const unused = this.getUnusedExports();
    const totalExports = this.exports.size;
    const usedExports = totalExports - unused.length;

    return {
      totalExports,
      usedExports,
      unusedExports: unused.length,
      efficiency: (usedExports / totalExports * 100).toFixed(2) + '%',
      unusedList: unused
    };
  }
}

// 8. 实际项目中的Tree-shaking优化

// === 组件库的Tree-shaking优化 ===
// components/index.js
// 避免使用 export * from，这会导致所有组件被打包
// export * from './Button';
// export * from './Input';

// 推荐的方式：明确导出
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';

// === 工具函数的Tree-shaking优化 ===
// utils/index.js
export { default as debounce } from './debounce';
export { default as throttle } from './throttle';
export { default as deepClone } from './deepClone';

// utils/debounce.js
export default function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// === CSS的Tree-shaking ===
// 使用PurgeCSS移除未使用的CSS
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    purgecss({
      content: ['./src/**/*.html', './src/**/*.js'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};
```

**Tree-shaking效果对比：**

| 场景           | 优化前 | 优化后 | 减少比例 |
| -------------- | ------ | ------ | -------- |
| Lodash全量导入 | 70KB   | 5KB    | 93%      |
| UI组件库       | 200KB  | 50KB   | 75%      |
| 工具函数库     | 30KB   | 8KB    | 73%      |
| 第三方库       | 150KB  | 45KB   | 70%      |

**记忆要点总结：**

- Tree-shaking基于ES6模块的静态结构分析
- 需要代码无副作用才能有效工作
- 构建工具需要正确配置才能启用
- 第三方库需要支持ES6模块才能被Tree-shake
- 合理的代码组织可以提高Tree-shaking效果
- 分析工具可以帮助识别优化机会
- 原理：标记清除

### 新API和特性（5道）

# **146. [中级]** Proxy对象的作用和基本用法

```javascript
const obj = {
  a: 1,
  b: [2, 3, 4],
  c: 'hello',
  d: true,
  e: { x: Symbol('x'), y: new Date() },
  f: x => `${x}`,
}

const proxy = new Proxy(obj, {
  get(target, propKey, receiver) {
    return Reflect.get(target, propKey, receiver)
  },
  set(target, propKey, value, receiver) {
    return Reflect.set(target, propKey, value, receiver)
  },
})
```

## 深度分析与补充

**问题本质解读：** 这道题考察Proxy的元编程能力，面试官想了解你是否理解拦截器模式和对象行为的自定义。

**技术错误纠正：**

- "Reflcet"应该是"Reflect"
- set方法的参数应该是(target, propKey, value, receiver)
- 缺少语法错误修正和完整的handler方法

**知识点系统梳理：**

**Proxy的核心概念：**

1. **目标对象（target）**：被代理的原始对象
2. **处理器（handler）**：定义拦截操作的对象
3. **陷阱（trap）**：处理器中的方法
4. **不变量（invariant）**：语义保证的约束

**Proxy支持的陷阱方法：**

1. **get(target, property, receiver)**：拦截属性读取
2. **set(target, property, value, receiver)**：拦截属性设置
3. **has(target, property)**：拦截in操作符
4. **deleteProperty(target, property)**：拦截delete操作
5. **ownKeys(target)**：拦截Object.keys()等
6. **getOwnPropertyDescriptor(target, property)**：拦截属性描述符获取
7. **defineProperty(target, property, descriptor)**：拦截属性定义
8. **preventExtensions(target)**：拦截Object.preventExtensions()
9. **getPrototypeOf(target)**：拦截Object.getPrototypeOf()
10. **isExtensible(target)**：拦截Object.isExtensible()
11. **setPrototypeOf(target, prototype)**：拦截Object.setPrototypeOf()
12. **apply(target, thisArg, argumentsList)**：拦截函数调用
13. **construct(target, argumentsList, newTarget)**：拦截new操作

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础Proxy用法（修正版）

const obj = {
  a: 1,
  b: [2, 3, 4],
  c: 'hello',
  d: true,
  e: { x: Symbol('x'), y: new Date() },
  f: x => `${x}`,
}

const proxy = new Proxy(obj, {
  get(target, propKey, receiver) {
    console.log(`Getting property: ${String(propKey)}`)
    return Reflect.get(target, propKey, receiver)
  },

  set(target, propKey, value, receiver) {
    console.log(`Setting property: ${String(propKey)} = ${value}`)
    return Reflect.set(target, propKey, value, receiver)
  },

  has(target, propKey) {
    console.log(`Checking if property exists: ${String(propKey)}`)
    return Reflect.has(target, propKey)
  },

  deleteProperty(target, propKey) {
    console.log(`Deleting property: ${String(propKey)}`)
    return Reflect.deleteProperty(target, propKey)
  },
})

// 2. 数据验证代理
class ValidatedUser {
  constructor(data = {}) {
    this._data = data

    return new Proxy(this, {
      set(target, property, value, receiver) {
        // 验证规则
        const validators = {
          name: val => typeof val === 'string' && val.length > 0,
          age: val => typeof val === 'number' && val >= 0 && val <= 150,
          email: val => typeof val === 'string' && /\S+@\S+\.\S+/.test(val),
        }

        if (property in validators) {
          if (!validators[property](value)) {
            throw new Error(`Invalid value for ${property}: ${value}`)
          }
        }

        target._data[property] = value
        return true
      },

      get(target, property, receiver) {
        if (property in target._data) {
          return target._data[property]
        }
        return Reflect.get(target, property, receiver)
      },
    })
  }
}

// 使用示例
const user = new ValidatedUser()
user.name = 'John' // 正常
user.age = 25 // 正常
// user.age = -5; // 抛出错误

// 3. 属性访问日志记录
function createLoggingProxy(target, logPrefix = '') {
  return new Proxy(target, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver)
      console.log(`${logPrefix}[GET] ${String(property)}: ${value}`)

      // 如果值是对象，递归创建代理
      if (typeof value === 'object' && value !== null) {
        return createLoggingProxy(value, `${logPrefix}${String(property)}.`)
      }

      return value
    },

    set(target, property, value, receiver) {
      console.log(`${logPrefix}[SET] ${String(property)}: ${value}`)
      return Reflect.set(target, property, value, receiver)
    },
  })
}

// 4. 默认值代理
function createDefaultProxy(target, defaults = {}) {
  return new Proxy(target, {
    get(target, property, receiver) {
      if (property in target) {
        return Reflect.get(target, property, receiver)
      }

      if (property in defaults) {
        return defaults[property]
      }

      return undefined
    },
  })
}

const config = createDefaultProxy(
  {
    theme: 'dark',
  },
  {
    theme: 'light',
    language: 'en',
    timeout: 5000,
  },
)

console.log(config.theme) // 'dark'
console.log(config.language) // 'en' (默认值)
console.log(config.timeout) // 5000 (默认值)

// 5. 函数调用拦截
function createTimingProxy(fn) {
  return new Proxy(fn, {
    apply(target, thisArg, argumentsList) {
      const start = performance.now()
      const result = Reflect.apply(target, thisArg, argumentsList)
      const end = performance.now()

      console.log(`Function ${target.name} took ${end - start} milliseconds`)
      return result
    },
  })
}

const slowFunction = createTimingProxy(function calculate(n) {
  let sum = 0
  for (let i = 0; i < n; i++) {
    sum += i
  }
  return sum
})

// 6. 数组负索引支持
function createNegativeIndexArray(arr) {
  return new Proxy(arr, {
    get(target, property, receiver) {
      if (typeof property === 'string' && /^-\d+$/.test(property)) {
        const index = target.length + parseInt(property)
        return target[index]
      }
      return Reflect.get(target, property, receiver)
    },

    set(target, property, value, receiver) {
      if (typeof property === 'string' && /^-\d+$/.test(property)) {
        const index = target.length + parseInt(property)
        target[index] = value
        return true
      }
      return Reflect.set(target, property, value, receiver)
    },
  })
}

const arr = createNegativeIndexArray([1, 2, 3, 4, 5])
console.log(arr[-1]) // 5
console.log(arr[-2]) // 4

// 7. 对象属性变更通知
class ObservableObject {
  constructor(target = {}) {
    this._target = target
    this._listeners = new Map()

    return new Proxy(this._target, {
      set: (target, property, value, receiver) => {
        const oldValue = target[property]
        const result = Reflect.set(target, property, value, receiver)

        if (result && oldValue !== value) {
          this._notifyListeners(property, value, oldValue)
        }

        return result
      },
    })
  }

  _notifyListeners(property, newValue, oldValue) {
    const listeners = this._listeners.get(property) || []
    listeners.forEach(listener => {
      listener(newValue, oldValue, property)
    })
  }

  on(property, listener) {
    if (!this._listeners.has(property)) {
      this._listeners.set(property, [])
    }
    this._listeners.get(property).push(listener)
  }

  off(property, listener) {
    const listeners = this._listeners.get(property)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }
}

const obj = new ObservableObject({ a: 1, b: 2 })
obj.on('a', (newValue, oldValue, property) => {
  console.log(`Property ${property} changed from ${oldValue} to ${newValue}`)
})
obj.a = 10
obj.b = 20


// 8. 单例模式代理
function createSingleton(constructor) {
  let instance = null

  return new Proxy(constructor, {
    construct(target, argumentsList, newTarget) {
      if (instance === null) {
        instance = Reflect.construct(target, argumentsList, newTarget)
      }
      return instance
    },
  })
}

const SingletonClass = createSingleton(
  class {
    constructor(name) {
      this.name = name
    }
  },
)

const obj1 = new SingletonClass('first')
const obj2 = new SingletonClass('second')
console.log(obj1 === obj2) // true
console.log(obj1.name) // 'first'
```

**记忆要点总结：**

- Proxy提供了元编程能力，可以拦截对象的各种操作
- 13种陷阱方法覆盖了对象的所有基本操作
- 常与Reflect配合使用，保持默认行为
- 适用于数据验证、日志记录、属性监听等场景
- 性能开销相对较大，需要谨慎使用
- 不能代理基本类型，只能代理对象

# **147. [高级]** Reflect对象提供了哪些方法？

- 提供了和Proxy相同的方法
- 13个静态方法
  - Reflect.apply(target, thisArg, args)
  - Reflect.construct(target, args)
  - Reflect.get(target, name, receiver)
  - Reflect.set(target, name, value, receiver)
  - Reflect.defineProperty(target, name, desc)
  - Reflect.deleteProperty(target, name)
  - Reflect.has(target, name)
  - Reflect.ownKeys(target)
  - Reflect.isExtensible(target)
  - Reflect.preventExtensions(target)
  - Reflect.getOwnPropertyDescriptor(target, name)
  - Reflect.getPrototypeOf(target)
  - Reflect.setPrototypeOf(target, prototype)

## 深度分析与补充

**问题本质解读：** 这道题考察Reflect API的完整性，面试官想了解你是否理解反射机制和函数式编程风格的对象操作。

**知识点系统梳理：**

**Reflect的设计目标：**

1. **统一API**：将Object上的方法迁移到Reflect
2. **函数式风格**：所有操作都是函数调用
3. **返回值规范**：统一返回布尔值或合理的结果
4. **与Proxy配合**：提供默认行为的实现

**Reflect方法详解：**

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. Reflect.apply - 函数调用
function greet(greeting, name) {
  return `${greeting}, ${name}!`
}

// 传统方式
const result1 = greet.apply(null, ['Hello', 'World'])

// Reflect方式
const result2 = Reflect.apply(greet, null, ['Hello', 'World'])

console.log(result1) // "Hello, World!"
console.log(result2) // "Hello, World!"

// 更安全的函数调用
function safeApply(fn, thisArg, args) {
  try {
    return Reflect.apply(fn, thisArg, args)
  } catch (error) {
    console.error('Function call failed:', error)
    return null
  }
}

// 2. Reflect.construct - 构造函数调用
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

// 传统方式
const person1 = new Person('Alice', 30)

// Reflect方式
const person2 = Reflect.construct(Person, ['Bob', 25])

console.log(person1) // Person { name: 'Alice', age: 30 }
console.log(person2) // Person { name: 'Bob', age: 25 }

// 动态构造函数调用
function createInstance(Constructor, ...args) {
  if (typeof Constructor !== 'function') {
    throw new Error('Constructor must be a function')
  }
  return Reflect.construct(Constructor, args)
}

// 3. Reflect.get/set - 属性访问
const obj = { x: 1, y: 2 }

// 获取属性
console.log(Reflect.get(obj, 'x')) // 1
console.log(Reflect.get(obj, 'z', { z: 'default' })) // undefined

// 设置属性
Reflect.set(obj, 'z', 3)
console.log(obj) // { x: 1, y: 2, z: 3 }

// 安全的属性操作
function safeGet(target, property, defaultValue = undefined) {
  try {
    return Reflect.get(target, property) ?? defaultValue
  } catch (error) {
    console.error('Property access failed:', error)
    return defaultValue
  }
}

// 4. Reflect.has - 属性检查
const target = { a: 1, b: 2 }

console.log(Reflect.has(target, 'a')) // true
console.log(Reflect.has(target, 'c')) // false

// 比in操作符更安全
function hasProperty(obj, prop) {
  if (obj == null) return false
  return Reflect.has(obj, prop)
}

// 5. Reflect.deleteProperty - 属性删除
const data = { name: 'John', age: 30, temp: 'delete me' }

// 传统方式
delete data.temp

// Reflect方式
const deleted = Reflect.deleteProperty(data, 'temp')
console.log(deleted) // true
console.log(data) // { name: 'John', age: 30 }

// 6. Reflect.ownKeys - 获取所有键
const example = {
  a: 1,
  b: 2,
  [Symbol('c')]: 3,
}

console.log(Reflect.ownKeys(example)) // ['a', 'b', Symbol(c)]
console.log(Object.keys(example)) // ['a', 'b'] (不包含Symbol)

// 7. Reflect.defineProperty - 定义属性
const target2 = {}

const success = Reflect.defineProperty(target2, 'name', {
  value: 'John',
  writable: true,
  enumerable: true,
  configurable: true,
})

console.log(success) // true
console.log(target2.name) // 'John'

// 8. Reflect.getOwnPropertyDescriptor - 获取属性描述符
const descriptor = Reflect.getOwnPropertyDescriptor(target2, 'name')
console.log(descriptor)
// { value: 'John', writable: true, enumerable: true, configurable: true }

// 9. Reflect.getPrototypeOf/setPrototypeOf - 原型操作
const proto = { type: 'prototype' }
const child = {}

Reflect.setPrototypeOf(child, proto)
console.log(Reflect.getPrototypeOf(child) === proto) // true

// 10. Reflect.isExtensible/preventExtensions - 扩展性控制
const extensible = {}
console.log(Reflect.isExtensible(extensible)) // true

Reflect.preventExtensions(extensible)
console.log(Reflect.isExtensible(extensible)) // false

// 11. 实用工具函数集合
class ReflectUtils {
  // 深度获取嵌套属性
  static deepGet(obj, path, defaultValue = undefined) {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
      if (current == null || !Reflect.has(current, key)) {
        return defaultValue
      }
      current = Reflect.get(current, key)
    }

    return current
  }

  // 深度设置嵌套属性
  static deepSet(obj, path, value) {
    const keys = path.split('.')
    const lastKey = keys.pop()
    let current = obj

    for (const key of keys) {
      if (!Reflect.has(current, key) || typeof current[key] !== 'object') {
        Reflect.set(current, key, {})
      }
      current = Reflect.get(current, key)
    }

    return Reflect.set(current, lastKey, value)
  }

  // 对象克隆
  static clone(obj) {
    if (obj == null || typeof obj !== 'object') {
      return obj
    }

    const cloned = Array.isArray(obj) ? [] : {}
    const keys = Reflect.ownKeys(obj)

    for (const key of keys) {
      const descriptor = Reflect.getOwnPropertyDescriptor(obj, key)
      if (descriptor) {
        Reflect.defineProperty(cloned, key, {
          ...descriptor,
          value: this.clone(descriptor.value),
        })
      }
    }

    return cloned
  }

  // 对象合并
  static merge(target, ...sources) {
    for (const source of sources) {
      if (source == null) continue

      const keys = Reflect.ownKeys(source)
      for (const key of keys) {
        const descriptor = Reflect.getOwnPropertyDescriptor(source, key)
        if (descriptor) {
          Reflect.defineProperty(target, key, descriptor)
        }
      }
    }

    return target
  }

  // 属性映射
  static mapProperties(obj, mapper) {
    const result = {}
    const keys = Reflect.ownKeys(obj)

    for (const key of keys) {
      const value = Reflect.get(obj, key)
      const mapped = mapper(value, key, obj)
      Reflect.set(result, key, mapped)
    }

    return result
  }
}

// 使用示例
const nested = { a: { b: { c: 'deep value' } } }
console.log(ReflectUtils.deepGet(nested, 'a.b.c')) // 'deep value'

ReflectUtils.deepSet(nested, 'x.y.z', 'new value')
console.log(nested.x.y.z) // 'new value'

// 12. Reflect与Proxy的完美配合
function createReactiveObject(target) {
  return new Proxy(target, {
    get(target, property, receiver) {
      console.log(`Getting ${String(property)}`)
      return Reflect.get(target, property, receiver)
    },

    set(target, property, value, receiver) {
      console.log(`Setting ${String(property)} = ${value}`)
      return Reflect.set(target, property, value, receiver)
    },

    has(target, property) {
      console.log(`Checking ${String(property)}`)
      return Reflect.has(target, property)
    },

    deleteProperty(target, property) {
      console.log(`Deleting ${String(property)}`)
      return Reflect.deleteProperty(target, property)
    },

    ownKeys(target) {
      console.log('Getting own keys')
      return Reflect.ownKeys(target)
    },

    defineProperty(target, property, descriptor) {
      console.log(`Defining ${String(property)}`)
      return Reflect.defineProperty(target, property, descriptor)
    },
  })
}
```

**Reflect vs 传统方法对比：**

| 操作     | 传统方法                 | Reflect方法                          | 优势         |
| -------- | ------------------------ | ------------------------------------ | ------------ |
| 函数调用 | fn.apply(thisArg, args)  | Reflect.apply(fn, thisArg, args)     | 更清晰的语义 |
| 属性访问 | obj.prop 或 obj[prop]    | Reflect.get(obj, prop)               | 统一的API    |
| 属性设置 | obj.prop = value         | Reflect.set(obj, prop, value)        | 返回布尔值   |
| 属性检查 | prop in obj              | Reflect.has(obj, prop)               | 更安全       |
| 属性删除 | delete obj.prop          | Reflect.deleteProperty(obj, prop)    | 返回布尔值   |
| 构造调用 | new Constructor(...args) | Reflect.construct(Constructor, args) | 更灵活       |

**记忆要点总结：**

- Reflect提供13个静态方法，对应Proxy的13个陷阱
- 所有方法都是函数式的，避免了操作符的限制
- 返回值更加规范，便于错误处理
- 与Proxy配合使用，提供默认行为
- 适合元编程和动态操作对象
- 比传统Object方法更加安全和一致

# **148. [中级]** 可选链操作符(?.)的用法

- 代替 && 前段确认链

```javascript
const obj = {
  a:{
    b:{
      c:{
        d:1234,
        e:[5,6,7],
        f:x => x+2
      }
    }
  }
}

const e2 = obj?.a?.b?.c?.e?.[2]
const foo = obj?.a?.b?.c?.f
obj?.a?.b?.c?.f?.(3)
```

## 深度分析与补充

**问题本质解读：** 这道题考察可选链的安全访问机制，面试官想了解你是否理解如何优雅地处理深层嵌套对象的属性访问。

**技术错误纠正：**

- `obj?.a?.b?.c?.e?[2]` 应该是 `obj?.a?.b?.c?.e?.[2]`（数组访问需要点）

**知识点系统梳理：**

**可选链的三种形式：**

1. **属性访问**：`obj?.prop`
2. **数组访问**：`obj?.[index]` 或 `obj?.[key]`
3. **函数调用**：`func?.(args)`

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础用法（修正版）
const obj = {
  a: {
    b: {
      c: {
        d: 1234,
        e: [5, 6, 7],
        f: x => x + 2,
      },
    },
  },
}

// 正确的语法
const e2 = obj?.a?.b?.c?.e?.[2] // 7
const foo = obj?.a?.b?.c?.f
const result = obj?.a?.b?.c?.f?.(3) // 5

// 2. 与传统方法对比
// 传统方法
const traditionalAccess = obj && obj.a && obj.a.b && obj.a.b.c && obj.a.b.c.e && obj.a.b.c.e[2]

// 可选链方法
const optionalChainAccess = obj?.a?.b?.c?.e?.[2]

// 3. 实际应用场景
// API响应处理
const apiResponse = {
  data: {
    user: {
      profile: {
        name: 'John',
        avatar: 'avatar.jpg',
      },
      settings: {
        theme: 'dark',
        notifications: {
          email: true,
          push: false,
        },
      },
    },
  },
}

// 安全访问嵌套属性
const userName = apiResponse?.data?.user?.profile?.name ?? 'Unknown'
const emailNotifications = apiResponse?.data?.user?.settings?.notifications?.email ?? false

// 4. 数组和对象混合访问
const complexData = {
  items: [
    {
      id: 1,
      details: {
        specs: ['spec1', 'spec2'],
        metadata: {
          tags: ['tag1', 'tag2'],
        },
      },
    },
  ],
}

const firstTag = complexData?.items?.[0]?.details?.metadata?.tags?.[0]
console.log(firstTag) // 'tag1'

// 5. 函数调用的可选链
const utils = {
  math: {
    calculate: (a, b) => a + b,
    advanced: {
      factorial: n => (n <= 1 ? 1 : n * utils.math.advanced.factorial(n - 1)),
    },
  },
}

// 安全的函数调用
const sum = utils?.math?.calculate?.(5, 3) // 8
const fact = utils?.math?.advanced?.factorial?.(5) // 120
const nonExistent = utils?.math?.nonExistent?.(1, 2) // undefined

// 6. 动态属性访问
function safeGet(obj, path) {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    current = current?.[key]
    if (current === undefined) break
  }

  return current
}

// 使用示例
const data = { a: { b: { c: 'value' } } }
console.log(safeGet(data, 'a.b.c')) // 'value'
console.log(safeGet(data, 'a.b.x')) // undefined
```

# **149. [中级]** 空值合并操作符(??)的作用

- 仅判断前置是否为 undefined 和 null

## 深度分析与补充

**问题本质解读：** 这道题考察空值合并操作符的精确语义，面试官想了解你是否理解它与逻辑或操作符的区别。

**知识点系统梳理：**

**空值合并操作符的特点：**

1. **只检查null和undefined**：不像||操作符检查所有falsy值
2. **短路求值**：左侧不为null/undefined时不计算右侧
3. **优先级**：比||和&&低，需要注意运算顺序

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 与||操作符的区别
const value1 = 0
const value2 = ''
const value3 = false
const value4 = null
const value5 = undefined

// 使用||操作符
console.log(value1 || 'default') // 'default' (0是falsy)
console.log(value2 || 'default') // 'default' (''是falsy)
console.log(value3 || 'default') // 'default' (false是falsy)

// 使用??操作符
console.log(value1 ?? 'default') // 0 (0不是null/undefined)
console.log(value2 ?? 'default') // '' (''不是null/undefined)
console.log(value3 ?? 'default') // false (false不是null/undefined)
console.log(value4 ?? 'default') // 'default' (null)
console.log(value5 ?? 'default') // 'default' (undefined)

// 2. 实际应用场景
function processConfig(config = {}) {
  // 使用??确保只有真正缺失的值才使用默认值
  const settings = {
    timeout: config.timeout ?? 5000,
    retries: config.retries ?? 3,
    debug: config.debug ?? false,
    apiUrl: config.apiUrl ?? 'https://api.example.com',
  }

  return settings
}

// 测试
console.log(processConfig({ timeout: 0, debug: false }))
// { timeout: 0, retries: 3, debug: false, apiUrl: 'https://api.example.com' }

// 3. 与可选链结合使用
const user = {
  profile: {
    name: 'John',
    settings: {
      theme: null, // 用户明确设置为null
      language: undefined, // 未设置
    },
  },
}

const theme = user?.profile?.settings?.theme ?? 'light'
const language = user?.profile?.settings?.language ?? 'en'
console.log(theme) // 'light'
console.log(language) // 'en'
```

# **150. [中级]** BigInt数据类型的特点和用法

- 用于表示number不能表示的数字 进行计算操作
- 数字后面跟一个n

## 深度分析与补充

**问题本质解读：** 这道题考察BigInt的使用场景，面试官想了解你是否理解JavaScript数值精度限制和大整数处理。

**知识点系统梳理：**

**BigInt的特点：**

1. **任意精度**：可以表示任意大的整数
2. **类型安全**：不能与Number直接运算
3. **性能考虑**：比Number运算慢
4. **JSON序列化**：需要特殊处理

**实战应用举例：**

**通用JavaScript示例：**

```javascript
// 1. 基础用法
const bigInt1 = 123456789012345678901234567890n
const bigInt2 = BigInt('987654321098765432109876543210')
const bigInt3 = BigInt(123) // 从Number转换

console.log(bigInt1) // 123456789012345678901234567890n
console.log(typeof bigInt1) // 'bigint'

// 2. Number精度限制演示
console.log(Number.MAX_SAFE_INTEGER) // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER + 1) // 9007199254740992
console.log(Number.MAX_SAFE_INTEGER + 2) // 9007199254740992 (精度丢失!)

// 使用BigInt避免精度问题
const safeBigInt = BigInt(Number.MAX_SAFE_INTEGER) + 2n
console.log(safeBigInt) // 9007199254740993n

// 3. BigInt运算
const a = 123n
const b = 456n

console.log(a + b) // 579n
console.log(a * b) // 56088n
console.log(b / a) // 3n (整数除法)
console.log(b % a) // 87n

// 4. 类型转换和比较
// BigInt与Number不能直接运算
// console.log(123n + 456); // TypeError!

// 正确的方式
console.log(123n + BigInt(456)) // 579n
console.log(Number(123n) + 456) // 579

// 比较操作
console.log(123n === 123) // false (类型不同)
console.log(123n == 123) // true (值相等)
console.log(123n > 100) // true

// 5. 实际应用场景
// 加密货币计算
class CryptoCurrency {
  constructor(amount) {
    this.amount = BigInt(amount)
  }

  add(other) {
    return new CryptoCurrency(this.amount + other.amount)
  }

  multiply(factor) {
    return new CryptoCurrency(this.amount * BigInt(factor))
  }

  toString() {
    return this.amount.toString()
  }

  toNumber() {
    if (this.amount > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error('Value too large for Number type')
    }
    return Number(this.amount)
  }
}

// 时间戳处理
const timestamp = BigInt(Date.now()) * 1000000n // 纳秒级时间戳
console.log(timestamp)

// 6. JSON序列化处理
const data = {
  id: 123456789012345678901234567890n,
  value: 999999999999999999999n,
}

// 自定义序列化
JSON.stringify(data, (key, value) => {
  return typeof value === 'bigint' ? value.toString() + 'n' : value
})

// 自定义反序列化
function reviver(key, value) {
  if (typeof value === 'string' && value.endsWith('n')) {
    return BigInt(value.slice(0, -1))
  }
  return value
}
```

**新API特性总结表：**

| 特性         | 主要用途         | 优势                     | 注意事项       |
| ------------ | ---------------- | ------------------------ | -------------- | --- | ------ |
| Proxy        | 元编程、拦截操作 | 强大的自定义能力         | 性能开销       |
| Reflect      | 反射操作         | 统一API、函数式          | 学习成本       |
| 可选链(?.)   | 安全属性访问     | 简洁、避免错误           | 浏览器兼容性   |
| 空值合并(??) | 默认值处理       | 精确的null/undefined检查 | 与             |     | 的区别 |
| BigInt       | 大整数运算       | 任意精度                 | 类型隔离、性能 |

**记忆要点总结：**

- 可选链只在null/undefined时短路，其他falsy值会继续
- 空值合并只检查null和undefined，不检查其他falsy值
- BigInt不能与Number直接运算，需要显式转换
- 这些特性都是为了解决JavaScript的历史局限性
- 现代开发中这些特性大大提升了代码的安全性和可读性

---
