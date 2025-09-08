// 白板题：手写一个最简版的 watchEffect（只需展示依赖收集思想、weakmap -> set）。
// 要点：展示 effect 注册、依赖收集、触发流程。

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
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

const ITERATE_KEY = Symbol('iterate')

function reactive(target) {
  if (typeof target !== 'object' || target === null) {
    return target
  }

  if (reactiveMap.has(target)) {
    return reactiveMap.get(target)
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === '__v_isReactive') return true
      if (key === '__v_raw') return target

      const result = Reflect.get(target, key, receiver)
      track(target, key)

      if (typeof result === 'object' && result !== null) {
        return reactive(result)
      }

      return result
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)

      if (oldValue !== value) {
        trigger(target, key, value, oldValue)
      }

      return result
    },

    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },

    deleteProperty(target, p) {
      const hadKey = Object.hasOwn(target, p)
      const result = Reflect.deleteProperty(target, p)
      if (hadKey) {
        trigger(target, p, undefined, target[p])
      }
      return result
    },

    ownKeys(target){
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    }
  })

  reactiveMap.set(target, proxy)
  return proxy
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

const obj = {
  foo: 1,
  user: {
    name: 'Jone',
    hobbies: ['reading', 'coding']
  }
}

watchEffect(() => {
  console.log(obj.foo)
})

const state = reactive(obj)

obj.foo = 3
