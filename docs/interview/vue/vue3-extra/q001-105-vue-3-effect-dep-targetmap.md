# 105. **解释 Vue 3 响应式系统的核心数据结构（effect、dep、targetMap）。

> 来源：`docs/vue/vue_3_part_3_answer.md`

## 问题本质解读

这道题核心是在确认对「105. **解释 Vue 3 响应式系统的核心数据结构（effect、dep、targetMap）。」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- 响应式是通过Es6新增的Proxy代理在数据读写等操作情况下进行依赖收集和响应触发来实现数据的响应式

- effect 是副作用函数 用来触发响应时执行

```javascript
let activeEffect = null
const targetMap = new WeakMap()

function track(target, key) {
  if (!activeEffect) return

  let depMap = targetMap.get(target)
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()))
  }
  let dep = depMap.get(key)
  if (!dep) {
    depMap.set(key, (dep = new Set()))
  }
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

function trigger(target, key) {
  let depMap = targetMap.get(target)
  if (!depMap) return
  let dep = depMap.get(key)
  if (!dep) return

  dep.forEach(effect => {
    if (effect !== activeEffect) {
      effect()
    }
  })
}

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    effectFn.deps = []
    fn()
    activeEffect = null
  }
  effectFn()
  return effectFn
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    },
  })
}
```

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：105. **解释 Vue 3 响应式系统的核心数据结构（effect、dep、targetMap）。 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
