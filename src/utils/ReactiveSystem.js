class ReactiveSystem {
  constructor() {
    this.dependencies = new WeakMap()
    this.currentEffect = null
  }

  track(target, key) {
    if (!this.currentEffect) return

    if (!this.dependencies.has(target)) {
      this.dependencies.set(target, new Map())
    }

    const depsMap = this.dependencies.get(target)
    if (!depsMap.has(key)) {
      depsMap.set(key, new Set())
    }

    depsMap.get(key).add(this.currentEffect)
  }

  trigger(target, key) {
    const depsMap = this.dependencies.get(target)
    if (!depsMap) return

    const effects = depsMap.get(key)
    if (effects) {
      effects.forEach(effect => effect())
    }
  }

  effect(fn) {
    this.currentEffect = fn
    fn()
    this.currentEffect = null
  }

  reactive(target) {
    return new Proxy(target, {
      get: (target, key) => {
        this.track(target, key)
        return target[key]
      },
      set: (target, key, value) => {
        target[key] = value
        this.trigger(target, key)
        return true
      },
    })
  }
}

export default ReactiveSystem
