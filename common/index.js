export function createDecorator(options = {}) {
  return function (target, propertyName, descriptor) {
    let originMethod = descriptor.value
    const { beforeHook, afterHook, errorHandler, timeout = 0 } = options

    descriptor.value = async function (...args) {
      try {
        if (beforeHook) {
          await beforeHook.call(this, propertyName, args)
        }
        let result

        if (timeout > 0) {
          result = await Promise.race([
            originMethod.apply(this, args),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Method timeout')), timeout),
            ),
          ])
        } else {
          result = await originMethod.apply(this, args)
        }

        if (afterHook) {
          await afterHook.call(this, propertyName, args, result)
        }

        return result
      } catch (err) {
        if (errorHandler) {
          return errorHandler.call(this, err, propertyName, args)
        }
        throw err
      }
    }

    return descriptor
  }
}

export function requirePermission(permission) {
  return function (target, propertyName, descriptor) {
    const originMethod = descriptor.value

    descriptor.value = function (...args) {
      if (!this.hasPermission || !this.hasPermission(permission)) {
        throw new Error(`Permission '${permission}' required for ${propertyName}`)
      }

      return originMethod.apply(this, args)
    }

    return descriptor
  }
}

export function retry(maxAttempts = 3, delay = 1000) {
  return function (target, propertyName, descriptor) {
    const originMethod = descriptor.value

    descriptor.value = async function (...args) {
      let lastError

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originMethod.apply(this, args)
        } catch (error) {
          lastError = error
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }

      throw lastError
    }

    return descriptor
  }
}

const PLUGIN_HOOKS = {
  BEFORE_INIT: Symbol.for('plugin.hooks.before_init'),
  AFTER_INIT: Symbol.for('plugin.hooks.after_init'),
  BEFORE_RENDER: Symbol.for('plugin.hooks.before_render'),
  AFTER_RENDER: Symbol.for('plugin.hooks.after_render'),
}

class PluginSystem {
  constructor() {
    this.plugins = []
    this.hooks = new Map()
  }

  registerPlugin(plugin) {
    this.plugins.push(plugin)

    Object.values(PLUGIN_HOOKS).forEach(hook => {
      if (typeof plugin[hook] === 'function') {
        if (!this.hooks.has(hook)) {
          this.hooks.set(hook, [])
        }
        this.hooks.get(hook).push(plugin[hook].bind(plugin))
      }
    })
  }

  async executeHook(hook, context) {
    if (this.hooks.has(hook)) {
      for (const hookFn of this.hooks.get(hook)) {
        await hookFn(context)
      }
    }
  }
  async init() {
    const context = { timestamp: Date.now() }

    await this.executeHook(PLUGIN_HOOKS.BEFORE_INIT, context)
    console.log('System initializing...')
    await this.executeHook(PLUGIN_HOOKS.AFTER_INIT, context)
  }
}
