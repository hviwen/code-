# 137. [中级]** 宏任务和微任务的区别

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察异步任务的分类和优先级机制，面试官想了解你是否理解JavaScript异步执行的精细化控制。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- 宏任务：用于分发事件与任务
- 微任务：用于在当前任务（宏任务）末尾立即执行剩余逻辑，微任务会在渲染之前全部跑完

### 问题本质解读 这道题考察异步任务的分类和优先级机制，面试官想了解你是否理解JavaScript异步执行的精细化控制。

### 知识点系统梳理

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

### 实战应用举例

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

### 记忆要点总结

- 微任务优先级高于宏任务，会清空整个微任务队列
- 宏任务每次只执行一个，微任务会执行完所有
- 微任务适合状态同步，宏任务适合延迟操作
- 过多微任务会阻塞宏任务执行
- Vue的nextTick是微任务，确保DOM更新后执行

## 实战应用举例

Vue 的 `nextTick`、Promise 回调这类“本轮更新后马上执行”的逻辑通常属于微任务；定时器和用户事件回调属于宏任务。

```javascript
setTimeout(() => console.log('宏任务'), 0)

queueMicrotask(() => console.log('微任务'))

Promise.resolve().then(() => console.log('Promise 微任务'))

console.log('同步任务')

// 输出：同步任务 -> 微任务 -> Promise 微任务 -> 宏任务
```

## 使用场景说明和对比

| 任务类型 | 常见来源 | 执行时机 | 适合做什么 |
| --- | --- | --- | --- |
| 微任务 | `Promise.then`、`queueMicrotask`、`MutationObserver` | 当前宏任务结束后立即清空 | 状态收尾、Promise 链、框架内部批处理 |
| 宏任务 | `setTimeout`、`setInterval`、事件回调、I/O | 下一轮事件循环 | 延迟执行、分片任务、用户事件响应 |
| rAF | `requestAnimationFrame` | 浏览器绘制前 | 动画和读写布局协调 |

微任务适合“本轮任务结束前必须完成”的小逻辑；宏任务适合把工作让到下一轮，避免长时间占用当前调用栈。

## 易错点提示

1. 微任务会一次清空，微任务里继续添加微任务也会在本轮继续执行。
2. 过多微任务可能阻塞渲染和用户事件，不是越多越好。
3. 宏任务每轮通常只取一个执行，所以多个 `setTimeout` 会分轮处理。
4. `Promise.then` 是微任务，但 Promise 构造器本身同步执行。
5. Node.js 的 `process.nextTick` 优先级和浏览器微任务不完全一样，回答时要区分环境。

## 记忆要点总结

- 微任务：当前轮收尾，优先级高，会清空。
- 宏任务：下一轮执行，一次取一个。
- Promise 回调是微任务，定时器和事件回调是宏任务。
- 需要渲染前做小收尾用微任务，需要让出当前轮用宏任务。

## 延伸问题

1. 为什么微任务过多会导致页面无法及时渲染？
2. `queueMicrotask` 和 `Promise.resolve().then` 有什么区别？
3. `setTimeout(fn, 0)` 为什么不是精确 0ms？
4. 框架为什么常用微任务批量刷新状态？

## 可能类似的问题及简要参考答案

**Q：宏任务和微任务的最核心区别是什么？**  
A：调度时机不同。当前宏任务结束后会先清空微任务队列，然后才进入下一轮宏任务。

**Q：`Promise.then` 和 `setTimeout` 谁先执行？**  
A：同一轮同步代码中同时注册时，`Promise.then` 的微任务先执行，`setTimeout` 的宏任务后执行。

## 辅助记忆总结

一句话记：微任务是本轮收尾，宏任务是下轮再办。
