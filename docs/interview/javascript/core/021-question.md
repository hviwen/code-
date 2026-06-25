# 021. [高级] 解释闭包可能导致的内存泄漏问题

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

闭包本身不会自动造成内存泄漏。问题出在闭包被长期持有时，它引用的外层变量也会被长期保留；如果这些变量里有大对象、DOM 节点、定时器状态或请求缓存，就可能让本该释放的内存无法释放。

一句话答法：闭包导致泄漏的根因是“长生命周期函数引用了短生命周期数据”。

## 问题意图

这道题考察你是否理解闭包和垃圾回收的关系，能不能从事件监听、定时器、缓存、组件卸载这些真实场景判断泄漏风险。

## 考察范围

- 闭包引用外层变量导致变量生命周期延长。
- 垃圾回收的可达性判断。
- 事件监听器、定时器、Promise 回调、全局缓存中的闭包。
- DOM 引用、大对象引用、组件实例引用的释放。
- 清理函数、取消订阅、`WeakMap`、缓存淘汰等手段。

## 技术错误纠正

原始说法“函数一直持有外部数据导致垃圾回收不了”方向正确，但需要补充边界：只要闭包本身不可达，它引用的数据也能被回收；只有闭包仍被可达对象持有时，引用链才会保留。

## 知识点系统梳理

垃圾回收通常看对象是否仍可达：

```text
window
  -> event listener
  -> handler 闭包
  -> outer scope
  -> largeData / DOM / component
```

只要这条链还存在，`largeData` 就不能被回收。

高风险场景：

| 场景 | 泄漏原因 | 处理方式 |
| --- | --- | --- |
| DOM 事件监听 | handler 闭包引用大对象，监听未移除 | `removeEventListener` |
| 定时器 | 回调闭包持续执行，引用组件状态 | `clearTimeout/clearInterval` |
| 全局缓存 | 闭包或缓存表无上限增长 | 限制容量、TTL、手动清理 |
| 订阅/消息总线 | 回调注册后未取消订阅 | 返回 unsubscribe |
| Promise 回调 | 长请求完成前引用组件实例 | 取消请求或忽略过期结果 |

## 实战应用举例

### 示例 1：事件监听器持有大对象

```js
function mountPanel(button) {
  const largeData = new Array(100000).fill('row')

  function handleClick() {
    console.log(largeData.length)
  }

  button.addEventListener('click', handleClick)

  return function unmountPanel() {
    button.removeEventListener('click', handleClick)
  }
}

const cleanup = mountPanel(document.querySelector('#load'))
cleanup()
```

这个例子证明：只要事件监听器还在，`handleClick` 就还可达，`largeData` 也会跟着可达。卸载时移除监听器能断开引用链。

### 示例 2：缓存闭包需要淘汰策略

```js
function createMemo(maxSize = 100) {
  const cache = new Map()

  return function memo(key, compute) {
    if (cache.has(key)) return cache.get(key)

    const value = compute()
    cache.set(key, value)

    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    return value
  }
}
```

闭包缓存不是不能用，而是不能无限增长。给缓存加容量限制，是比“禁用闭包”更实际的解决方案。

## 使用场景说明和对比

| 做法 | 适合 | 注意点 |
| --- | --- | --- |
| 返回清理函数 | 组件、弹窗、页面模块 | 卸载时必须调用 |
| `WeakMap` | key 是对象且不想阻止 key 回收 | 不能遍历，不适合需要统计容量的缓存 |
| 缓存容量限制 | 计算结果可复用 | 需要淘汰策略 |
| 手动置空引用 | 大对象确实不再需要 | 优先断开外部持有链 |
| 避免闭包 | 极简单函数 | 不要为了避免闭包牺牲清晰性 |

## 易错点提示

- 闭包不是泄漏的充分条件；长期可达的闭包才危险。
- `removeEventListener` 需要传入同一个函数引用，匿名函数无法直接移除。
- `setInterval` 比 `setTimeout` 更容易遗忘清理。
- 闭包里引用整个组件实例比只引用必要字段风险更大。
- 缓存要有上限，否则闭包里的 `Map` 会越长越大。
- DevTools 里可通过 Memory 快照查看 retained by 引用链。

## 记忆要点总结

- 泄漏根因：长生命周期闭包引用短生命周期数据。
- 常见来源：事件、定时器、订阅、全局缓存。
- 修复思路：移除监听、清定时器、取消订阅、限制缓存。
- 判断标准：看闭包是否仍从全局或长期对象可达。
- 优化目标不是不用闭包，而是管理生命周期。

## 延伸问题

1. 为什么匿名事件监听函数难以清理？
2. `WeakMap` 为什么能降低某些缓存泄漏风险？
3. React/Vue 组件卸载时哪些闭包需要清理？
4. 如何用 Chrome DevTools 定位闭包持有的大对象？
5. Promise 回调引用组件状态会不会造成泄漏？

## 可能类似的问题及简要参考答案

**Q：闭包一定会导致内存泄漏吗？**  
A：不会。只有闭包长期可达，并引用本该释放的数据时，才可能泄漏。

**Q：如何避免闭包泄漏？**  
A：管理生命周期：移除事件监听、清理定时器、取消订阅、限制缓存大小，避免闭包引用不必要的大对象。

**Q：闭包缓存为什么危险？**  
A：缓存保存在闭包作用域里，如果没有淘汰策略，`Map` 会持续增长，里面的值都无法释放。

## 辅助记忆总结

记成一句话：泄漏不是因为“闭包存在”，而是因为“闭包还活着，里面还拽着大对象”。
