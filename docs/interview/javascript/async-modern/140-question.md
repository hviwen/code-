# 140. [高级]** 如何理解事件循环的执行栈、任务队列和微任务队列？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察事件循环的完整机制，面试官想了解你是否深度理解JavaScript单线程异步执行的核心架构。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- "setInteral"应该是"setInterval"
- "queueMicotask"应该是"queueMicrotask"

## 知识点系统梳理

- 宏任务：setTimeout setInterval UI事件 XHR的回调；每次事件循环从宏任务队列中取一个到执行完成
- 微任务：Promise.then queueMicrotask的回调；事件循环中微任务优先于下一个宏任务，会将微任务队列中的全部微任务执行清空，再执行下一个宏任务
- 调用栈：存储正在执行的函数帧。同步代码直接进栈，执行完出栈
- 事件循环：不断重复：从宏任务中取出一个执行，执行完后清空微任务队列，执行渲染，执行下一个宏任务

### 问题本质解读 这道题考察事件循环的完整机制，面试官想了解你是否深度理解JavaScript单线程异步执行的核心架构。

### 技术错误纠正

- "setInteral"应该是"setInterval"
- "queueMicotask"应该是"queueMicrotask"

### 知识点系统梳理

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

### 实战应用举例

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

### 记忆要点总结

- 执行栈存储当前执行的函数调用
- 微任务队列优先级高于宏任务队列
- 事件循环：同步代码 → 微任务队列 → 一个宏任务
- 微任务队列必须完全清空才会执行宏任务
- 理解这个机制对性能优化和调试至关重要

---

## 现代JavaScript特性

### 模块化（5道）

## 实战应用举例

分析复杂异步题时，把每一步写到对应队列里。

```javascript
console.log('A')

setTimeout(() => {
  console.log('B')
  Promise.resolve().then(() => console.log('C'))
}, 0)

Promise.resolve().then(() => console.log('D'))

console.log('E')

// 栈：A、E
// 微任务：D
// 第一轮宏任务：B，然后产生微任务 C
// 输出：A -> E -> D -> B -> C
```

## 使用场景说明和对比

| 结构 | 作用 | 调试线索 |
| --- | --- | --- |
| 执行栈 | 当前正在执行的同步函数 | 堆栈过深、长任务 |
| 宏任务队列 | 定时器、事件、I/O 回调 | 下一轮事件循环 |
| 微任务队列 | Promise、queueMicrotask | 当前宏任务结束后清空 |
| Web APIs | 浏览器托管异步能力 | 定时器、网络、事件监听 |

## 易错点提示

1. 执行栈不空时，不会执行队列里的任务。
2. 微任务队列会在当前宏任务结束后清空。
3. 宏任务每轮通常取一个执行。
4. 微任务里产生的微任务仍会在本轮继续执行。
5. 长同步任务会阻塞用户交互和渲染。

## 记忆要点总结

- 栈执行同步代码。
- 微任务做本轮收尾。
- 宏任务进入下一轮。
- 分析输出题就把代码归类到栈、微任务、宏任务。

## 延伸问题

可以继续追问：140. [高级]** 如何理解事件循环的执行栈、任务队列和微任务队列？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：为什么长同步代码会让页面卡住？**  
A：执行栈一直被占用，事件回调、微任务和渲染都无法及时执行。

**Q：微任务和宏任务都在任务队列里吗？**  
A：可以都理解为队列，但优先级不同；当前宏任务结束后先清空微任务，再进入下一轮宏任务。

## 辅助记忆总结

一句话记：栈里先跑同步，微任务本轮清，宏任务下一轮。
