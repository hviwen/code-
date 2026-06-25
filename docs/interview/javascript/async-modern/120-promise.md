# 120. [中级]** Promise的链式调用如何工作？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise链式调用的内部机制，面试官想了解你是否理解Promise链的工作原理、值传递和状态转换规则。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- 不是"promise的thenable"，而是每个then方法都返回一个新的Promise对象
- 链式调用的核心是Promise的状态传递和值转换机制

## 知识点系统梳理

- 通过返回一个~~promise的thenable~~新的promise对象 在下一个then中接收到上一个then的结果，继续执行下一步的操作
- 核心是Promise的状态传递和值转换机制

### 问题本质解读 这道题考察Promise链式调用的内部机制，面试官想了解你是否理解Promise链的工作原理、值传递和状态转换规则。

### 技术错误纠正

- 不是"promise的thenable"，而是每个then方法都返回一个新的Promise对象
- 链式调用的核心是Promise的状态传递和值转换机制

### 知识点系统梳理

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

### 实战应用举例

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

### 记忆要点总结

- 每个then/catch/finally都返回新的Promise对象
- 前一个Promise的结果决定下一个Promise的状态
- 支持四种值传递：普通值、Promise、异常、undefined
- 错误会沿链传播，直到被catch捕获
- 所有回调都异步执行，保证执行顺序
- 链式调用是Promise强大功能的核心体现

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

| 写法 | 适合场景 | 注意点 |
| --- | --- | --- |
| `.then().then()` | 数据管道、每一步依赖上一步结果 | 每一步要 `return` |
| `.catch()` 结尾 | 统一处理链路错误 | 捕获后若不抛出，会恢复为 fulfilled |
| 第二个参数 `then(onFulfilled, onRejected)` | 就近处理当前一步失败 | 容易分散错误处理 |
| `async/await` | 分支多、流程长、需要 try/catch | 注意并行任务别误写成串行 |

链式调用适合“前一步结果喂给下一步”的流程，例如登录后取用户信息、再取权限、再进入页面。多个互不依赖的请求不要写成长链，直接用 `Promise.all`。

## 易错点提示

1. 每个 `then` 都返回新的 Promise，不是修改原 Promise。
2. `then` 里返回普通值会让下一个 Promise fulfilled。
3. `then` 里抛异常会让下一个 Promise rejected。
4. `catch` 里返回普通值会“吞掉”错误，让后续链恢复成功。
5. 忘记返回内层 Promise 会导致后续步骤拿不到真正的异步结果。

## 记忆要点总结

- Promise 链靠“每一步返回新 Promise”串起来。
- 返回值决定下一步状态：普通值成功、Promise 跟随、异常失败。
- 错误会沿链冒泡到最近的失败处理。
- 可并行的任务用 `Promise.all`，不要硬串联。

## 延伸问题

1. `then` 里返回一个 rejected Promise，下一步会发生什么？
2. `catch` 后面继续 `then` 为什么还能执行？
3. `finally` 如何影响 Promise 链的值和错误？

## 可能类似的问题及简要参考答案

**Q：为什么 Promise 可以链式调用？**  
A：因为 `then/catch/finally` 都返回新的 Promise，新 Promise 的状态由回调返回值或抛出的异常决定。

**Q：Promise 链里错误是怎么传播的？**  
A：某一步 rejected 或抛异常后，会跳过后续成功回调，直到遇到失败处理函数；处理函数返回普通值后链路恢复成功。

## 辅助记忆总结

一句话记：`then` 接上一步，`return` 决定下一步，`throw` 交给 `catch`。
