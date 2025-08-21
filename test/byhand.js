// 白板题：手写一个最简版的 watchEffect（只需展示依赖收集思想、weakmap -> set）。
// 要点：展示 effect 注册、依赖收集、触发流程。

const targetMap = new WeakMap()
let activeEffect = null

/**
 * 依赖收集
 * @param target
 * @param key
 */
const track = (target, key) => {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)

  activeEffect.deps.push(dep)
  console.log('track', target, key, dep)
}

/**
 * 触发依赖
 */
const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (!dep) return
  dep.forEach(effect => {
    if (effect !== activeEffect) {
      effect()
    }
  })
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


/**
 * 注册副作用
 * @param fn
 */
const watchEffect = (fn) => {
  const effect = () => {
    activeEffect = effect
    fn()
    activeEffect = null
  }
  effect()
}

const obj = {foo: 1}

watchEffect(() => {
  console.log(obj.foo)
})

obj.foo = 3
