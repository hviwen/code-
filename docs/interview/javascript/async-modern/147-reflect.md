# 147. [高级]** Reflect对象提供了哪些方法？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Reflect API的完整性，面试官想了解你是否理解反射机制和函数式编程风格的对象操作。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- 提供了和Proxy相同的方法
- 13个静态方法
  - Reflect.apply(target, thisArg, args)
  - Reflect.construct(target, args)
  - Reflect.get(target, name, receiver)
  - Reflect.set(target, name, value, receiver)
  - Reflect.defineProperty(target, name, desc)
  - Reflect.deleteProperty(target, name)
  - Reflect.has(target, name)
  - Reflect.ownKeys(target)
  - Reflect.isExtensible(target)
  - Reflect.preventExtensions(target)
  - Reflect.getOwnPropertyDescriptor(target, name)
  - Reflect.getPrototypeOf(target)
  - Reflect.setPrototypeOf(target, prototype)

### 问题本质解读 这道题考察Reflect API的完整性，面试官想了解你是否理解反射机制和函数式编程风格的对象操作。

### 知识点系统梳理

**Reflect的设计目标：**

1. **统一API**：将Object上的方法迁移到Reflect
2. **函数式风格**：所有操作都是函数调用
3. **返回值规范**：统一返回布尔值或合理的结果
4. **与Proxy配合**：提供默认行为的实现

**Reflect方法详解：**

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. Reflect.apply - 函数调用
function greet(greeting, name) {
  return `${greeting}, ${name}!`
}

// 传统方式
const result1 = greet.apply(null, ['Hello', 'World'])

// Reflect方式
const result2 = Reflect.apply(greet, null, ['Hello', 'World'])

console.log(result1) // "Hello, World!"
console.log(result2) // "Hello, World!"

// 更安全的函数调用
function safeApply(fn, thisArg, args) {
  try {
    return Reflect.apply(fn, thisArg, args)
  } catch (error) {
    console.error('Function call failed:', error)
    return null
  }
}

// 2. Reflect.construct - 构造函数调用
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

// 传统方式
const person1 = new Person('Alice', 30)

// Reflect方式
const person2 = Reflect.construct(Person, ['Bob', 25])

console.log(person1) // Person { name: 'Alice', age: 30 }
console.log(person2) // Person { name: 'Bob', age: 25 }

// 动态构造函数调用
function createInstance(Constructor, ...args) {
  if (typeof Constructor !== 'function') {
    throw new Error('Constructor must be a function')
  }
  return Reflect.construct(Constructor, args)
}

// 3. Reflect.get/set - 属性访问
const obj = { x: 1, y: 2 }

// 获取属性
console.log(Reflect.get(obj, 'x')) // 1
console.log(Reflect.get(obj, 'z', { z: 'default' })) // undefined

// 设置属性
Reflect.set(obj, 'z', 3)
console.log(obj) // { x: 1, y: 2, z: 3 }

// 安全的属性操作
function safeGet(target, property, defaultValue = undefined) {
  try {
    return Reflect.get(target, property) ?? defaultValue
  } catch (error) {
    console.error('Property access failed:', error)
    return defaultValue
  }
}

// 4. Reflect.has - 属性检查
const target = { a: 1, b: 2 }

console.log(Reflect.has(target, 'a')) // true
console.log(Reflect.has(target, 'c')) // false

// 比in操作符更安全
function hasProperty(obj, prop) {
  if (obj == null) return false
  return Reflect.has(obj, prop)
}

// 5. Reflect.deleteProperty - 属性删除
const data = { name: 'John', age: 30, temp: 'delete me' }

// 传统方式
delete data.temp

// Reflect方式
const deleted = Reflect.deleteProperty(data, 'temp')
console.log(deleted) // true
console.log(data) // { name: 'John', age: 30 }

// 6. Reflect.ownKeys - 获取所有键
const example = {
  a: 1,
  b: 2,
  [Symbol('c')]: 3,
}

console.log(Reflect.ownKeys(example)) // ['a', 'b', Symbol(c)]
console.log(Object.keys(example)) // ['a', 'b'] (不包含Symbol)

// 7. Reflect.defineProperty - 定义属性
const target2 = {}

const success = Reflect.defineProperty(target2, 'name', {
  value: 'John',
  writable: true,
  enumerable: true,
  configurable: true,
})

console.log(success) // true
console.log(target2.name) // 'John'

// 8. Reflect.getOwnPropertyDescriptor - 获取属性描述符
const descriptor = Reflect.getOwnPropertyDescriptor(target2, 'name')
console.log(descriptor)
// { value: 'John', writable: true, enumerable: true, configurable: true }

// 9. Reflect.getPrototypeOf/setPrototypeOf - 原型操作
const proto = { type: 'prototype' }
const child = {}

Reflect.setPrototypeOf(child, proto)
console.log(Reflect.getPrototypeOf(child) === proto) // true

// 10. Reflect.isExtensible/preventExtensions - 扩展性控制
const extensible = {}
console.log(Reflect.isExtensible(extensible)) // true

Reflect.preventExtensions(extensible)
console.log(Reflect.isExtensible(extensible)) // false

// 11. 实用工具函数集合
class ReflectUtils {
  static isObject(obj) {
    return obj !== null && typeof obj === "object";
  }

  static isValidKey(key) {
    return !["__proto__", "constructor", "prototype"].includes(key);
  }

  static deepGet(obj, path, defaultValue = undefined) {
    if (!this.isObject(obj)) {
      return defaultValue;
    }
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (!this.isValidKey(key)) return defaultValue;
      if (current === null || !Reflect.has(current, key)) {
        return defaultValue;
      }
      current = Reflect.get(current, key);
    }
    return current;
  }

  static deepSet(obj, path, value) {
    if (!this.isObject(obj)) return false;
    const keys = path.split(".");
    const lastKey = keys.pop();
    let current = obj;

    if (!this.isValidKey(lastKey)) return false;

    for (const key of keys) {
      if (!this.isValidKey(key)) return false;

      if (!this.isObject(current[key])) {
        Reflect.set(current, key, {});
      }
      current = Reflect.get(current, key);
    }
    return Reflect.set(current, lastKey, value);
  }

  static clone(obj, hash = new WeakMap()) {
    if (!this.isObject(obj)) return obj;

    if (hash.has(obj)) return hash.get(obj);

    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);

    const cloned = Array.isArray(obj)
      ? []
      : Object.create(Reflect.getPrototypeOf(obj));
    hash.set(obj, cloned);
    const keys = Reflect.ownKeys(obj);

    for (const key of keys) {
      const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
      if (descriptor) {
        Reflect.defineProperty(cloned, key, {
          ...descriptor,
          value: this.clone(descriptor.value, hash),
        });
      }
    }
    return cloned;
  }

  static merge(target, ...sources) {
    if (!this.isObject(target)) return target;

    for (const source of sources) {
      if (!this.isObject(source)) continue;

      const keys = Reflect.ownKeys(source);
      for (const key of keys) {
        if (typeof key === "string" && !this.isValidKey(key)) continue;
        const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
        if (descriptor) {
          Reflect.defineProperty(target, key, descriptor);
        }
      }
    }
    return target;
  }
}

// 使用示例
const nested = { a: { b: { c: 'deep value' } } }
console.log(ReflectUtils.deepGet(nested, 'a.b.c')) // 'deep value'

ReflectUtils.deepSet(nested, 'x.y.z', 'new value')
console.log(nested.x.y.z) // 'new value'

// 12. Reflect与Proxy的完美配合
function createReactiveObject(target) {
  return new Proxy(target, {
    get(target, property, receiver) {
      console.log(`Getting ${String(property)}`)
      return Reflect.get(target, property, receiver)
    },

    set(target, property, value, receiver) {
      console.log(`Setting ${String(property)} = ${value}`)
      return Reflect.set(target, property, value, receiver)
    },

    has(target, property) {
      console.log(`Checking ${String(property)}`)
      return Reflect.has(target, property)
    },

    deleteProperty(target, property) {
      console.log(`Deleting ${String(property)}`)
      return Reflect.deleteProperty(target, property)
    },

    ownKeys(target) {
      console.log('Getting own keys')
      return Reflect.ownKeys(target)
    },

    defineProperty(target, property, descriptor) {
      console.log(`Defining ${String(property)}`)
      return Reflect.defineProperty(target, property, descriptor)
    },
  })
}
```

**Reflect vs 传统方法对比：**

| 操作     | 传统方法                 | Reflect方法                          | 优势         |
| -------- | ------------------------ | ------------------------------------ | ------------ |
| 函数调用 | fn.apply(thisArg, args)  | Reflect.apply(fn, thisArg, args)     | 更清晰的语义 |
| 属性访问 | obj.prop 或 obj[prop]    | Reflect.get(obj, prop)               | 统一的API    |
| 属性设置 | obj.prop = value         | Reflect.set(obj, prop, value)        | 返回布尔值   |
| 属性检查 | prop in obj              | Reflect.has(obj, prop)               | 更安全       |
| 属性删除 | delete obj.prop          | Reflect.deleteProperty(obj, prop)    | 返回布尔值   |
| 构造调用 | new Constructor(...args) | Reflect.construct(Constructor, args) | 更灵活       |

### 记忆要点总结

- Reflect提供13个静态方法，对应Proxy的13个陷阱
- 所有方法都是函数式的，避免了操作符的限制
- 返回值更加规范，便于错误处理
- 与Proxy配合使用，提供默认行为
- 适合元编程和动态操作对象
- 比传统Object方法更加安全和一致

## 实战应用举例

在 Proxy trap 中调用默认行为时，Reflect 能让语义更清楚。

```javascript
const state = new Proxy({ count: 0 }, {
  set(target, key, value, receiver) {
    console.log('set', key, value)
    return Reflect.set(target, key, value, receiver)
  },
})
```

## 使用场景说明和对比

| Reflect 方法 | 对应传统写法 | 优势 |
| --- | --- | --- |
| `Reflect.get` | `obj[key]` | 函数式，可传 receiver |
| `Reflect.set` | `obj[key] = value` | 返回布尔值 |
| `Reflect.has` | `key in obj` | 函数式表达 |
| `Reflect.deleteProperty` | `delete obj[key]` | 返回布尔值 |
| `Reflect.apply` | `fn.apply(thisArg, args)` | 语义统一 |

## 易错点提示

1. Reflect 不是构造函数，不能 `new Reflect()`。
2. Reflect 方法多用于元编程和 Proxy 默认转发。
3. `Reflect.set` 返回布尔值，赋值表达式返回赋的值。
4. `Reflect.get` 的 receiver 会影响 getter 中的 `this`。
5. 普通业务代码不必为了“高级”强行用 Reflect。

## 记忆要点总结

- Reflect 是对象操作的函数式 API。
- 和 Proxy trap 一一对应。
- 常用于保留默认行为。
- 返回值更规范，适合元编程。

## 延伸问题

可以继续追问：147. [高级]** Reflect对象提供了哪些方法？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：Proxy 里为什么常用 Reflect？**  
A：Reflect 提供对应默认操作，避免手写默认行为出错。

**Q：Reflect 和 Object 方法有什么区别？**  
A：Reflect 更偏底层操作，返回值更统一，并与 Proxy trap 对齐。

## 辅助记忆总结

一句话记：Proxy 负责拦，Reflect 负责按默认规则放行。
