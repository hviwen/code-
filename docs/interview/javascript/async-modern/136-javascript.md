# 136. [中级]** JavaScript的事件循环机制是什么？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察JavaScript异步执行机制的核心原理，面试官想了解你是否理解单线程JavaScript如何处理异步操作。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：事件循环和微任务（5道）。

## 技术错误纠正

- "setInteral"应该是"setInterval"
- "queueMicotask"应该是"queueMicrotask"

## 知识点系统梳理

- 单线程：JS单线程一个任务接一个任务执行
- 宏任务：setTimeout setInterval UI事件 XHR的回调；每次事件循环从宏任务队列中取一个到执行完成
- 微任务：Promise.then queueMicrotask的回调；事件循环中微任务优先于下一个宏任务，会将微任务队列中的全部微任务执行清空，再执行下一个宏任务
- 调用栈：存储正在执行的函数帧。同步代码直接进栈，执行完出栈
- 事件循环：不断重复：从宏任务中取出一个执行，执行完后清空微任务队列，执行渲染，执行下一个宏任务

### 问题本质解读 这道题考察JavaScript异步执行机制的核心原理，面试官想了解你是否理解单线程JavaScript如何处理异步操作。

### 技术错误纠正

- "setInteral"应该是"setInterval"
- "queueMicotask"应该是"queueMicrotask"

### 知识点系统梳理

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

### 实战应用举例

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

### 记忆要点总结

- 调用栈执行同步代码，清空后处理异步任务
- 微任务优先级高于宏任务，会清空整个微任务队列
- 每次事件循环：同步代码 → 微任务队列 → 一个宏任务
- 常见宏任务：setTimeout、setInterval、I/O、UI事件
- 常见微任务：Promise.then、queueMicrotask、MutationObserver

## 实战应用举例

排查输出顺序题时，先把同步代码、微任务、宏任务分组。

```javascript
console.log('sync 1')

setTimeout(() => console.log('timeout'), 0)

Promise.resolve().then(() => console.log('promise'))

console.log('sync 2')

// 输出：sync 1 -> sync 2 -> promise -> timeout
```

## 使用场景说明和对比

| 阶段/队列 | 典型 API | 用途 | 风险 |
| --- | --- | --- | --- |
| 调用栈 | 普通函数调用 | 执行同步代码 | 长任务阻塞页面 |
| 微任务 | `Promise.then`、`queueMicrotask` | 当前任务结束后立即补充逻辑 | 过多会延迟渲染和宏任务 |
| 宏任务 | `setTimeout`、事件回调、I/O | 下一轮事件循环执行 | 定时器不是精准时间 |
| 渲染 | rAF、浏览器绘制 | 更新页面视觉结果 | 被长任务和微任务拖延 |

前端排查“为什么 Promise 比 setTimeout 先执行”“为什么 DOM 更新后才能读尺寸”“为什么页面卡顿”时，都要回到事件循环模型。

## 易错点提示

1. 同步代码先于所有异步回调执行。
2. 当前宏任务结束后会清空所有微任务，再进入下一轮宏任务。
3. `setTimeout(fn, 0)` 不是立即执行，只是尽快进入宏任务队列。
4. 微任务过多会造成饥饿，延迟定时器、用户事件和渲染。
5. 浏览器和 Node 的事件循环细节不同，面试默认浏览器时要说明前提。

## 记忆要点总结

- JS 同步代码在调用栈里一次执行完。
- Promise 回调是微任务，定时器回调是宏任务。
- 每轮宏任务后清空微任务，再考虑渲染和下一轮任务。
- 事件循环解释异步顺序，也解释 UI 卡顿。

## 延伸问题

1. 为什么 Promise 回调通常比 `setTimeout(..., 0)` 先执行？
2. `requestAnimationFrame` 和微任务、宏任务的关系是什么？
3. Vue 的 `nextTick` 为什么能等到 DOM 更新后再执行回调？
4. 长任务如何影响页面交互和渲染？

## 可能类似的问题及简要参考答案

**Q：事件循环一轮大概做什么？**  
A：执行一个宏任务中的同步代码，清空微任务队列，浏览器按需渲染，然后进入下一轮宏任务。

**Q：微任务一定比宏任务快吗？**  
A：在同一轮事件循环中，当前宏任务结束后微任务会先于下一轮宏任务执行；但“快”不是耗时短，而是调度优先级高。

## 辅助记忆总结

一句话记：同步先跑完，微任务清空，再轮到下一个宏任务。
