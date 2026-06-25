# 139. [中级]** setTimeout(0)和Promise.resolve()的执行顺序

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察宏任务和微任务的执行优先级，面试官想了解你是否理解事件循环中任务调度的精确机制。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- setTimeout是宏任务
- Promise.resolve() 直接执行是同步任务 先于setTimeout； Promise.resolve().then() 是微任务，在某次宏任务执行完成后末尾一次性执行完全部微任务队列内的微任务

### 问题本质解读 这道题考察宏任务和微任务的执行优先级，面试官想了解你是否理解事件循环中任务调度的精确机制。

### 知识点系统梳理

**执行优先级规则：**

1. **同步代码** → **微任务队列** → **宏任务队列**
2. **微任务队列必须清空**才会执行下一个宏任务
3. **setTimeout(0)最小延迟**通常是4ms（浏览器限制）
4. **Promise.resolve()立即进入**微任务队列

### 实战应用举例

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

### 记忆要点总结

- Promise.resolve()总是优先于setTimeout(0)执行
- 微任务队列必须完全清空才会执行宏任务
- setTimeout(0)实际延迟通常是4ms
- 嵌套微任务会延迟宏任务的执行
- 理解这个顺序对性能优化很重要

## 实战应用举例

判断输出顺序时，先执行同步代码，再清空 Promise 微任务，最后执行定时器宏任务。

```javascript
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('sync')

// 输出：sync -> promise -> timeout
```

## 使用场景说明和对比

| API | 队列 | 适合用途 |
| --- | --- | --- |
| `Promise.resolve().then(fn)` | 微任务 | 当前任务后立即收尾 |
| `queueMicrotask(fn)` | 微任务 | 明确投递微任务 |
| `setTimeout(fn, 0)` | 宏任务 | 让出当前轮，延迟到下一轮 |
| `requestAnimationFrame(fn)` | 渲染前回调 | 动画和布局读写 |

## 易错点提示

1. `setTimeout(0)` 不是 0ms 立即执行。
2. Promise 微任务会先于下一轮定时器宏任务。
3. 微任务中继续添加微任务，会继续在本轮清空。
4. 定时器回调之间还可能穿插微任务。
5. 浏览器可能对嵌套定时器做最小延迟限制。

## 记忆要点总结

- 同步代码最先。
- Promise 回调是微任务。
- setTimeout 是宏任务。
- 本轮微任务清空后才进入下一轮宏任务。

## 延伸问题

可以继续追问：139. [中级]** setTimeout(0)和Promise.resolve()的执行顺序 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`setTimeout(fn, 0)` 为什么不立刻执行？**  
A：它只是把回调放入宏任务队列，必须等当前同步代码和微任务执行完。

**Q：Promise 回调一定比所有 setTimeout 快吗？**  
A：同一轮中注册的 Promise 微任务会先于下一轮 setTimeout；不同轮次要按实际调度分析。

## 辅助记忆总结

一句话记：同步先说话，Promise 插队收尾，timeout 下一轮再来。
