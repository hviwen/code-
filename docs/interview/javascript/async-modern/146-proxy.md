# 146. [中级]** Proxy对象的作用和基本用法

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Proxy的元编程能力，面试官想了解你是否理解拦截器模式和对象行为的自定义。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：新API和特性（5道）。

## 技术错误纠正

- "Reflcet"应该是"Reflect"
- set方法的参数应该是(target, propKey, value, receiver)
- 缺少语法错误修正和完整的handler方法

## 知识点系统梳理

```javascript
const obj = {
  a: 1,
  b: [2, 3, 4],
  c: 'hello',
  d: true,
  e: { x: Symbol('x'), y: new Date() },
  f: x => `${x}`,
}

const proxy = new Proxy(obj, {
  get(target, propKey, receiver) {
    return Reflect.get(target, propKey, receiver)
  },
  set(target, propKey, value, receiver) {
    return Reflect.set(target, propKey, value, receiver)
  },
})
```

### 问题本质解读 这道题考察Proxy的元编程能力，面试官想了解你是否理解拦截器模式和对象行为的自定义。

### 技术错误纠正

- "Reflcet"应该是"Reflect"
- set方法的参数应该是(target, propKey, value, receiver)
- 缺少语法错误修正和完整的handler方法

### 知识点系统梳理

**Proxy的核心概念：**

1. **目标对象（target）**：被代理的原始对象
2. **处理器（handler）**：定义拦截操作的对象
3. **陷阱（trap）**：处理器中的方法
4. **不变量（invariant）**：语义保证的约束

**Proxy支持的陷阱方法：**

1. **get(target, property, receiver)**：拦截属性读取
2. **set(target, property, value, receiver)**：拦截属性设置
3. **has(target, property)**：拦截in操作符
4. **deleteProperty(target, property)**：拦截delete操作
5. **ownKeys(target)**：拦截Object.keys()等
6. **getOwnPropertyDescriptor(target, property)**：拦截属性描述符获取
7. **defineProperty(target, property, descriptor)**：拦截属性定义
8. **preventExtensions(target)**：拦截Object.preventExtensions()
9. **getPrototypeOf(target)**：拦截Object.getPrototypeOf()
10. **isExtensible(target)**：拦截Object.isExtensible()
11. **setPrototypeOf(target, prototype)**：拦截Object.setPrototypeOf()
12. **apply(target, thisArg, argumentsList)**：拦截函数调用
13. **construct(target, argumentsList, newTarget)**：拦截new操作

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. 基础Proxy用法（修正版）

const obj = {
  a: 1,
  b: [2, 3, 4],
  c: 'hello',
  d: true,
  e: { x: Symbol('x'), y: new Date() },
  f: x => `${x}`,
}

const proxy = new Proxy(obj, {
  get(target, propKey, receiver) {
    console.log(`Getting property: ${String(propKey)}`)
    return Reflect.get(target, propKey, receiver)
  },

  set(target, propKey, value, receiver) {
    console.log(`Setting property: ${String(propKey)} = ${value}`)
    return Reflect.set(target, propKey, value, receiver)
  },

  has(target, propKey) {
    console.log(`Checking if property exists: ${String(propKey)}`)
    return Reflect.has(target, propKey)
  },

  deleteProperty(target, propKey) {
    console.log(`Deleting property: ${String(propKey)}`)
    return Reflect.deleteProperty(target, propKey)
  },
})

// 2. 数据验证代理
class ValidatedUser {
  constructor(data = {}) {
    this._data = data

    return new Proxy(this, {
      set(target, property, value, receiver) {
        // 验证规则
        const validators = {
          name: val => typeof val === 'string' && val.length > 0,
          age: val => typeof val === 'number' && val >= 0 && val <= 150,
          email: val => typeof val === 'string' && /\S+@\S+\.\S+/.test(val),
        }

        if (property in validators) {
          if (!validators[property](value)) {
            throw new Error(`Invalid value for ${property}: ${value}`)
          }
        }

        target._data[property] = value
        return true
      },

      get(target, property, receiver) {
        if (property in target._data) {
          return target._data[property]
        }
        return Reflect.get(target, property, receiver)
      },
    })
  }
}

// 使用示例
const user = new ValidatedUser()
user.name = 'John' // 正常
user.age = 25 // 正常
// user.age = -5; // 抛出错误

// 3. 属性访问日志记录
function createLoggingProxy(target, logPrefix = '') {
  return new Proxy(target, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver)
      console.log(`${logPrefix}[GET] ${String(property)}: ${value}`)

      // 如果值是对象，递归创建代理
      if (typeof value === 'object' && value !== null) {
        return createLoggingProxy(value, `${logPrefix}${String(property)}.`)
      }

      return value
    },

    set(target, property, value, receiver) {
      console.log(`${logPrefix}[SET] ${String(property)}: ${value}`)
      return Reflect.set(target, property, value, receiver)
    },
  })
}

// 4. 默认值代理
function createDefaultProxy(target, defaults = {}) {
  return new Proxy(target, {
    get(target, property, receiver) {
      if (property in target) {
        return Reflect.get(target, property, receiver)
      }

      if (property in defaults) {
        return defaults[property]
      }

      return undefined
    },
  })
}

const config = createDefaultProxy(
  {
    theme: 'dark',
  },
  {
    theme: 'light',
    language: 'en',
    timeout: 5000,
  },
)

console.log(config.theme) // 'dark'
console.log(config.language) // 'en' (默认值)
console.log(config.timeout) // 5000 (默认值)

// 5. 函数调用拦截
function createTimingProxy(fn) {
  return new Proxy(fn, {
    apply(target, thisArg, argumentsList) {
      const start = performance.now()
      const result = Reflect.apply(target, thisArg, argumentsList)
      const end = performance.now()

      console.log(`Function ${target.name} took ${end - start} milliseconds`)
      return result
    },
  })
}

const slowFunction = createTimingProxy(function calculate(n) {
  let sum = 0
  for (let i = 0; i < n; i++) {
    sum += i
  }
  return sum
})

// 6. 数组负索引支持
function createNegativeIndexArray(arr) {
  return new Proxy(arr, {
    get(target, property, receiver) {
      if (typeof property === 'string' && /^-\d+$/.test(property)) {
        const index = target.length + parseInt(property)
        return target[index]
      }
      return Reflect.get(target, property, receiver)
    },

    set(target, property, value, receiver) {
      if (typeof property === 'string' && /^-\d+$/.test(property)) {
        const index = target.length + parseInt(property)
        target[index] = value
        return true
      }
      return Reflect.set(target, property, value, receiver)
    },
  })
}

const arr = createNegativeIndexArray([1, 2, 3, 4, 5])
console.log(arr[-1]) // 5
console.log(arr[-2]) // 4

// 7. 对象属性变更通知
class ObservableObject {
  constructor(target = {}) {
    this._target = target
    this._listeners = new Map()

    return new Proxy(this._target, {
      set: (target, property, value, receiver) => {
        const oldValue = target[property]
        const result = Reflect.set(target, property, value, receiver)

        if (result && oldValue !== value) {
          this._notifyListeners(property, value, oldValue)
        }

        return result
      },
    })
  }

  _notifyListeners(property, newValue, oldValue) {
    const listeners = this._listeners.get(property) || []
    listeners.forEach(listener => {
      listener(newValue, oldValue, property)
    })
  }

  on(property, listener) {
    if (!this._listeners.has(property)) {
      this._listeners.set(property, [])
    }
    this._listeners.get(property).push(listener)
  }

  off(property, listener) {
    const listeners = this._listeners.get(property)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }
}

const obj = new ObservableObject({ a: 1, b: 2 })
obj.on('a', (newValue, oldValue, property) => {
  console.log(`Property ${property} changed from ${oldValue} to ${newValue}`)
})
obj.a = 10
obj.b = 20

// 8. 单例模式代理
function createSingleton(constructor) {
  let instance = null

  return new Proxy(constructor, {
    construct(target, argumentsList, newTarget) {
      if (instance === null) {
        instance = Reflect.construct(target, argumentsList, newTarget)
      }
      return instance
    },
  })
}

const SingletonClass = createSingleton(
  class {
    constructor(name) {
      this.name = name
    }
  },
)

const obj1 = new SingletonClass('first')
const obj2 = new SingletonClass('second')
console.log(obj1 === obj2) // true
console.log(obj1.name) // 'first'
```

### 记忆要点总结

- Proxy提供了元编程能力，可以拦截对象的各种操作
- 13种陷阱方法覆盖了对象的所有基本操作
- 常与Reflect配合使用，保持默认行为
- 适用于数据验证、日志记录、属性监听等场景
- 性能开销相对较大，需要谨慎使用
- 不能代理基本类型，只能代理对象

## 实战应用举例

表单模型可以用 Proxy 做简单写入校验，但生产中更常放到表单校验库或 schema。

```javascript
const user = new Proxy({}, {
  set(target, key, value) {
    if (key === 'age' && value < 0) throw new Error('age 不能小于 0')
    target[key] = value
    return true
  },
})
```

## 使用场景说明和对比

| 方案 | 适合场景 | 注意点 |
| --- | --- | --- |
| Proxy | 拦截对象读取、写入、删除、函数调用 | 有运行时开销 |
| Object.defineProperty | 兼容旧环境的属性拦截 | 只能拦截已有属性访问器 |
| 普通函数封装 | 明确 API 操作 | 拦截不到直接属性操作 |
| Vue 3 reactive | 响应式状态 | 框架封装，不等同裸 Proxy |

## 易错点提示

1. Proxy 只能代理对象，不能直接代理原始值。
2. Proxy 不改变原对象，返回的是代理对象。
3. trap 需要返回符合规范的值，例如 `set` 返回布尔值。
4. 性能敏感路径不要滥用 Proxy。
5. 与 Reflect 配合可保留默认行为。

## 记忆要点总结

- Proxy 是对象操作拦截器。
- 可拦截 get、set、delete、has 等。
- 常配合 Reflect 调默认逻辑。
- 适合元编程，不适合普通业务过度使用。

## 延伸问题

可以继续追问：146. [中级]** Proxy对象的作用和基本用法 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：Proxy 和 defineProperty 的主要区别是什么？**  
A：Proxy 代理整个对象且 trap 更完整；defineProperty 主要定义单个属性的访问器。

**Q：Vue 3 为什么用 Proxy？**  
A：它能拦截新增属性、删除属性、数组索引等更多操作，弥补 Vue 2 defineProperty 的限制。

## 辅助记忆总结

一句话记：Proxy 像对象门卫，读写删查都能先经过它。
