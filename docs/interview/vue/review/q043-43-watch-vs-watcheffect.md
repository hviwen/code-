# 43. watch vs watchEffect ⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「43. watch vs watchEffect ⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

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

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：43. watch vs watchEffect ⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
