# JavaScript 前端核心概念练习题补充

本文档是对 `javascript-practice-problems-zh.md` 的重要补充，专注于前端开发中的核心JavaScript概念。

补充题目分布：

- 简单：15 题 (37.5%) - 基础概念理解
- 中等：20 题 (50%) - 实际应用场景
- 困难：5 题 (12.5%) - 复杂架构实现

## 简单题目 (15)

### 131. 实现简单的防抖函数

**描述**：实现一个防抖函数，在指定时间内多次调用只执行最后一次。

- 防抖常用于搜索框输入、按钮点击等场景。
- 每次调用都会重置计时器。

**输入**：函数 func，延迟时间 delay (毫秒)  
**输出**：防抖后的函数

**示例**：

```javascript
function debounce(func, delay) {
  // 实现防抖逻辑
}

const debouncedLog = debounce(() => console.log('执行'), 1000)
debouncedLog() // 不会立即执行
debouncedLog() // 重置计时器
debouncedLog() // 1秒后执行一次
```

### 132. 实现简单的节流函数

**描述**：实现一个节流函数，在指定时间间隔内最多执行一次。

- 节流常用于滚动事件、鼠标移动等高频事件。
- 保证函数在指定时间间隔内只执行一次。

**输入**：函数 func，时间间隔 interval (毫秒)  
**输出**：节流后的函数

**示例**：

```javascript
function throttle(func, interval) {
  // 实现节流逻辑
}

const throttledLog = throttle(() => console.log('执行'), 1000)
throttledLog() // 立即执行
throttledLog() // 被忽略
setTimeout(() => throttledLog(), 1100) // 1.1秒后执行
```

### 133. 深拷贝实现（基础版）

**描述**：实现一个深拷贝函数，能够复制对象和数组的所有层级。

- 处理基本数据类型、对象、数组。
- 不需要处理循环引用。

**输入**：任意值  
**输出**：深拷贝后的值

**示例**：

```javascript
function deepClone(obj) {
  // 实现深拷贝逻辑
}

const original = { a: 1, b: { c: 2, d: [3, 4] } }
const cloned = deepClone(original)
cloned.b.c = 999
console.log(original.b.c) // 应该仍然是 2
```

### 134. 简单闭包计数器

**描述**：使用闭包创建一个计数器函数。

- 每次调用返回递增的数字。
- 计数器状态应该被私有化。

**输入**：初始值 (可选，默认为0)  
**输出**：计数器函数

**示例**：

```javascript
function createCounter(initialValue = 0) {
  // 实现闭包计数器
}

const counter = createCounter(5)
console.log(counter()) // 返回 6
console.log(counter()) // 返回 7
console.log(counter()) // 返回 8
```

### 135. 实现简单的bind函数

**描述**：实现Function.prototype.bind的简化版本。

- 绑定this上下文和预设参数。
- 返回新的函数。

**输入**：目标函数，this上下文，预设参数  
**输出**：绑定后的新函数

**示例**：

```javascript
Function.prototype.myBind = function (context, ...args) {
  // 实现bind逻辑
}

const obj = { name: 'Alice' }
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`
}
const boundGreet = greet.myBind(obj, 'Hello')
console.log(boundGreet('!')) // "Hello, Alice!"
```

### 136. 对象属性访问器

**描述**：实现一个函数，通过字符串路径访问嵌套对象的属性。

- 支持点号分隔的路径，如 "user.profile.name"。
- 如果路径不存在，返回undefined。

**输入**：对象，属性路径字符串  
**输出**：属性值或undefined

**示例**：

```javascript
function getProperty(obj, path) {
  // 实现属性访问逻辑
}

const user = { profile: { name: 'John', age: 30 } }
console.log(getProperty(user, 'profile.name')) // "John"
console.log(getProperty(user, 'profile.email')) // undefined
```

### 137. 数组去重（多种方法）

**描述**：实现数组去重，要求提供至少3种不同的实现方法。

- 方法1：使用Set
- 方法2：使用filter和indexOf
- 方法3：使用reduce

**输入**：数组  
**输出**：去重后的数组

**示例**：

```javascript
function uniqueArray1(arr) {
  /* 使用Set */
}
function uniqueArray2(arr) {
  /* 使用filter */
}
function uniqueArray3(arr) {
  /* 使用reduce */
}

const arr = [1, 2, 2, 3, 3, 3, 4]
console.log(uniqueArray1(arr)) // [1, 2, 3, 4]
console.log(uniqueArray2(arr)) // [1, 2, 3, 4]
console.log(uniqueArray3(arr)) // [1, 2, 3, 4]
```

### 138. 简单的发布订阅模式

**描述**：实现一个简单的事件发布订阅系统。

- 支持订阅事件、发布事件、取消订阅。
- 一个事件可以有多个订阅者。

**输入**：事件名称，回调函数  
**输出**：事件管理器对象

**示例**：

```javascript
class EventEmitter {
  constructor() {
    // 初始化
  }

  on(event, callback) {
    // 订阅事件
  }

  emit(event, ...args) {
    // 发布事件
  }

  off(event, callback) {
    // 取消订阅
  }
}

const emitter = new EventEmitter()
emitter.on('test', data => console.log('收到:', data))
emitter.emit('test', 'hello') // 输出: 收到: hello
```

### 139. 柯里化函数实现

**描述**：实现一个柯里化函数，将多参数函数转换为单参数函数序列。

- 支持部分应用参数。
- 当参数收集完毕时自动执行原函数。

**输入**：多参数函数  
**输出**：柯里化后的函数

**示例**：

```javascript
function curry(fn) {
  // 实现柯里化逻辑
}

function add(a, b, c) {
  return a + b + c
}

const curriedAdd = curry(add)
console.log(curriedAdd(1)(2)(3)) // 6
console.log(curriedAdd(1, 2)(3)) // 6
console.log(curriedAdd(1)(2, 3)) // 6
```

### 140. 简单模板字符串解析

**描述**：实现一个简单的模板字符串解析器。

- 支持 {{variable}} 语法。
- 从提供的数据对象中替换变量。

**输入**：模板字符串，数据对象  
**输出**：解析后的字符串

**示例**：

```javascript
function parseTemplate(template, data) {
  // 实现模板解析逻辑
}

const template = 'Hello {{name}}, you are {{age}} years old.'
const data = { name: 'Alice', age: 25 }
console.log(parseTemplate(template, data))
// "Hello Alice, you are 25 years old."
```

### 141. 函数记忆化（Memoization）

**描述**：实现一个记忆化装饰器，缓存函数的计算结果。

- 相同参数的函数调用直接返回缓存结果。
- 提高递归函数的性能。

**输入**：函数  
**输出**：记忆化后的函数

**示例**：

```javascript
function memoize(fn) {
  // 实现记忆化逻辑
}

const fibonacci = memoize(function (n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
})

console.log(fibonacci(40)) // 快速计算结果
```

### 142. 对象扁平化

**描述**：将嵌套对象扁平化为单层对象，使用点号连接键名。

- 处理任意层级的嵌套。
- 数组索引也要包含在键名中。

**输入**：嵌套对象  
**输出**：扁平化对象

**示例**：

```javascript
function flattenObject(obj) {
  // 实现对象扁平化逻辑
}

const nested = {
  a: 1,
  b: { c: 2, d: { e: 3 } },
  f: [4, 5],
}
console.log(flattenObject(nested))
// { 'a': 1, 'b.c': 2, 'b.d.e': 3, 'f.0': 4, 'f.1': 5 }
```

### 143. 简单的类型检测

**描述**：实现一个精确的类型检测函数。

- 能够区分Array、Object、null、Date等类型。
- 返回具体的类型名称字符串。

**输入**：任意值  
**输出**：类型名称字符串

**示例**：

```javascript
function getType(value) {
  // 实现类型检测逻辑
}

console.log(getType([])) // "Array"
console.log(getType({})) // "Object"
console.log(getType(null)) // "Null"
console.log(getType(new Date())) // "Date"
console.log(getType(/regex/)) // "RegExp"
```

### 144. 简单的Promise实现

**描述**：实现一个简化版的Promise，支持基本的then和catch方法。

- 支持pending、fulfilled、rejected三种状态。
- 状态一旦改变就不能再变。

**输入**：executor函数  
**输出**：Promise实例

**示例**：

```javascript
class SimplePromise {
  constructor(executor) {
    // 实现Promise逻辑
  }

  then(onFulfilled, onRejected) {
    // 实现then方法
  }

  catch(onRejected) {
    // 实现catch方法
  }
}

const promise = new SimplePromise((resolve, reject) => {
  setTimeout(() => resolve('success'), 1000)
})
promise.then(result => console.log(result)) // 1秒后输出: success
```

### 145. 数组分块

**描述**：将数组分割成指定大小的块。

- 最后一块可能包含较少的元素。
- 如果数组为空，返回空数组。

**输入**：数组，块大小  
**输出**：分块后的二维数组

**示例**：

```javascript
function chunk(array, size) {
  // 实现数组分块逻辑
}

console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3))
// [[1, 2, 3], [4, 5, 6], [7]]
console.log(chunk(['a', 'b', 'c', 'd'], 2))
// [['a', 'b'], ['c', 'd']]
```

## 中等题目 (20)

### 146. Promise.all 实现

**描述**：实现Promise.all方法，等待所有Promise完成或任一Promise失败。

- 所有Promise成功时，返回结果数组。
- 任一Promise失败时，立即返回失败。
- 保持结果顺序与输入顺序一致。

**输入**：Promise数组  
**输出**：Promise

**示例**：

```javascript
function promiseAll(promises) {
  // 实现Promise.all逻辑
}

const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = Promise.resolve(3)

promiseAll([p1, p2, p3]).then(results => {
  console.log(results) // [1, 2, 3]
})
```

### 147. Promise.race 实现

**描述**：实现Promise.race方法，返回第一个完成的Promise结果。

- 无论成功还是失败，都返回第一个完成的结果。
- 其他Promise的结果被忽略。

**输入**：Promise数组  
**输出**：Promise

**示例**：

```javascript
function promiseRace(promises) {
  // 实现Promise.race逻辑
}

const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100))
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 500))

promiseRace([fast, slow]).then(result => {
  console.log(result) // 'fast'
})
```

### 148. 异步任务队列

**描述**：实现一个异步任务队列，支持并发控制。

- 限制同时执行的任务数量。
- 任务完成后自动执行队列中的下一个任务。
- 支持添加任务和获取执行结果。

**输入**：最大并发数  
**输出**：任务队列实例

**示例**：

```javascript
class TaskQueue {
  constructor(concurrency = 1) {
    // 初始化队列
  }

  add(task) {
    // 添加任务到队列
    return new Promise((resolve, reject) => {
      // 实现任务调度逻辑
    })
  }
}

const queue = new TaskQueue(2)
queue.add(() => fetch('/api/1'))
queue.add(() => fetch('/api/2'))
queue.add(() => fetch('/api/3')) // 等待前两个完成
```

### 149. 深拷贝实现（完整版）

**描述**：实现完整的深拷贝函数，处理循环引用和各种数据类型。

- 处理Date、RegExp、Function等特殊对象。
- 解决循环引用问题。
- 保持原型链。

**输入**：任意值  
**输出**：深拷贝后的值

**示例**：

```javascript
function deepCloneAdvanced(obj, visited = new WeakMap()) {
  // 实现完整深拷贝逻辑
}

const obj = { date: new Date(), regex: /test/g }
obj.self = obj // 循环引用
const cloned = deepCloneAdvanced(obj)
console.log(cloned.date instanceof Date) // true
console.log(cloned !== obj) // true
console.log(cloned.self === cloned) // true
```

### 150. 实现call、apply、bind

**描述**：分别实现Function.prototype的call、apply、bind方法。

- call：立即执行，参数逐个传递。
- apply：立即执行，参数以数组传递。
- bind：返回新函数，支持参数预设。

**输入**：this上下文，参数  
**输出**：执行结果或新函数

**示例**：

```javascript
Function.prototype.myCall = function (context, ...args) {
  // 实现call
}

Function.prototype.myApply = function (context, args) {
  // 实现apply
}

Function.prototype.myBind = function (context, ...args) {
  // 实现bind
}

function greet(greeting, name) {
  return `${greeting}, ${name}! I'm ${this.title}`
}

const person = { title: 'Mr. Smith' }
console.log(greet.myCall(person, 'Hello', 'John'))
// "Hello, John! I'm Mr. Smith"
```

### 151. 原型链继承实现

**描述**：实现多种JavaScript继承方式。

- 原型链继承
- 构造函数继承
- 组合继承
- ES6 class继承

**输入**：父类构造函数
**输出**：子类构造函数

**示例**：

```javascript
// 原型链继承
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`
}

function Dog(name, breed) {
  // 实现继承逻辑
}

// 设置原型链
// Dog.prototype = ...

const dog = new Dog('Buddy', 'Golden Retriever')
console.log(dog.speak()) // "Buddy makes a sound"
console.log(dog instanceof Animal) // true
```

### 152. 观察者模式实现

**描述**：实现观察者模式，支持主题和观察者的松耦合通信。

- 主题可以添加、删除观察者。
- 状态变化时自动通知所有观察者。
- 观察者可以接收更新通知。

**输入**：主题对象，观察者对象
**输出**：观察者模式实现

**示例**：

```javascript
class Subject {
  constructor() {
    // 初始化观察者列表
  }

  addObserver(observer) {
    // 添加观察者
  }

  removeObserver(observer) {
    // 移除观察者
  }

  notify(data) {
    // 通知所有观察者
  }
}

class Observer {
  update(data) {
    console.log('收到更新:', data)
  }
}

const subject = new Subject()
const observer1 = new Observer()
subject.addObserver(observer1)
subject.notify('状态改变') // 观察者收到通知
```

### 153. 单例模式实现

**描述**：实现单例模式，确保类只有一个实例。

- 提供全局访问点。
- 懒加载实例创建。
- 线程安全（在JavaScript中主要考虑异步场景）。

**输入**：类定义
**输出**：单例实例

**示例**：

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance
    }

    // 初始化逻辑
    this.data = 'singleton data'
    Singleton.instance = this
    return this
  }

  static getInstance() {
    // 实现获取实例逻辑
  }
}

const instance1 = new Singleton()
const instance2 = new Singleton()
console.log(instance1 === instance2) // true
```

### 154. 装饰器模式实现

**描述**：实现装饰器模式，动态地给对象添加新功能。

- 不改变原对象结构。
- 可以组合多个装饰器。
- 保持接口一致性。

**输入**：原始对象，装饰器函数
**输出**：装饰后的对象

**示例**：

```javascript
function withLogging(target) {
  return function (...args) {
    console.log(`调用 ${target.name}，参数:`, args)
    const result = target.apply(this, args)
    console.log(`${target.name} 返回:`, result)
    return result
  }
}

function withTiming(target) {
  return function (...args) {
    const start = Date.now()
    const result = target.apply(this, args)
    console.log(`${target.name} 耗时: ${Date.now() - start}ms`)
    return result
  }
}

function calculate(a, b) {
  return a + b
}

const decoratedCalculate = withTiming(withLogging(calculate))
decoratedCalculate(2, 3) // 输出日志和计时信息
```

### 155. 虚拟DOM简单实现

**描述**：实现一个简单的虚拟DOM系统。

- 创建虚拟节点。
- 渲染虚拟DOM到真实DOM。
- 简单的diff算法。

**输入**：虚拟DOM描述
**输出**：真实DOM元素

**示例**：

```javascript
function createElement(tag, props, ...children) {
  // 创建虚拟DOM节点
}

function render(vdom, container) {
  // 渲染虚拟DOM到容器
}

function diff(oldVdom, newVdom) {
  // 比较两个虚拟DOM树的差异
}

const vdom = createElement(
  'div',
  { class: 'container' },
  createElement('h1', null, 'Hello'),
  createElement('p', null, 'World'),
)

render(vdom, document.body)
```

### 156. 事件委托实现

**描述**：实现事件委托机制，在父元素上处理子元素事件。

- 利用事件冒泡机制。
- 支持动态添加的子元素。
- 提供事件过滤功能。

**输入**：父元素，事件类型，选择器，处理函数
**输出**：事件委托处理器

**示例**：

```javascript
function delegate(parent, eventType, selector, handler) {
  // 实现事件委托逻辑
}

// 使用示例
delegate(document.body, 'click', '.button', function (event) {
  console.log('按钮被点击:', event.target.textContent)
})

// 动态添加的按钮也会响应事件
document.body.innerHTML += '<button class="button">新按钮</button>'
```

### 157. 路由器实现

**描述**：实现一个简单的前端路由器，支持hash和history模式。

- 监听URL变化。
- 路由匹配和参数提取。
- 路由守卫功能。

**输入**：路由配置
**输出**：路由器实例

**示例**：

```javascript
class Router {
  constructor(mode = 'hash') {
    // 初始化路由器
  }

  route(path, handler) {
    // 注册路由
  }

  navigate(path) {
    // 导航到指定路径
  }

  start() {
    // 启动路由监听
  }
}

const router = new Router()
router.route('/home', () => console.log('首页'))
router.route('/user/:id', params => console.log('用户:', params.id))
router.start()
```

### 158. 状态管理器实现

**描述**：实现一个简单的状态管理器，类似Redux的核心功能。

- 单一状态树。
- 纯函数reducer。
- 订阅状态变化。

**输入**：初始状态，reducer函数
**输出**：store实例

**示例**：

```javascript
function createStore(reducer, initialState) {
  // 实现状态管理器
}

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}

const store = createStore(counterReducer)
store.subscribe(state => console.log('状态更新:', state))
store.dispatch({ type: 'INCREMENT' }) // 输出: 状态更新: { count: 1 }
```

### 159. 请求重试机制

**描述**：实现一个带重试机制的HTTP请求函数。

- 支持指定重试次数。
- 支持重试延迟策略（固定延迟、指数退避）。
- 只对特定错误进行重试。

**输入**：请求配置，重试选项
**输出**：Promise

**示例**：

```javascript
async function requestWithRetry(url, options = {}, retryOptions = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 'fixed', // 'fixed' | 'exponential'
    retryCondition = error => error.status >= 500,
  } = retryOptions

  // 实现重试逻辑
}

// 使用示例
requestWithRetry(
  '/api/data',
  {},
  {
    maxRetries: 3,
    delay: 1000,
    backoff: 'exponential',
  },
)
  .then(data => console.log(data))
  .catch(error => console.error('最终失败:', error))
```

### 160. 缓存管理器

**描述**：实现一个多级缓存管理器，支持内存缓存和本地存储。

- 支持TTL（生存时间）。
- LRU淘汰策略。
- 自动清理过期缓存。

**输入**：缓存配置
**输出**：缓存管理器实例

**示例**：

```javascript
class CacheManager {
  constructor(options = {}) {
    // 初始化缓存管理器
  }

  set(key, value, ttl) {
    // 设置缓存
  }

  get(key) {
    // 获取缓存
  }

  delete(key) {
    // 删除缓存
  }

  clear() {
    // 清空缓存
  }
}

const cache = new CacheManager({ maxSize: 100, defaultTTL: 60000 })
cache.set('user:1', { name: 'John' }, 30000) // 30秒后过期
console.log(cache.get('user:1')) // { name: 'John' }
```

### 161. 表单验证器

**描述**：实现一个灵活的表单验证器，支持多种验证规则。

- 内置常用验证规则（必填、邮箱、长度等）。
- 支持自定义验证规则。
- 支持异步验证。

**输入**：表单数据，验证规则
**输出**：验证结果

**示例**：

```javascript
class FormValidator {
  constructor() {
    // 初始化验证器
  }

  addRule(name, validator) {
    // 添加验证规则
  }

  validate(data, rules) {
    // 执行验证
  }
}

const validator = new FormValidator()
validator.addRule('email', value => /\S+@\S+\.\S+/.test(value))

const result = validator.validate(
  { email: 'test@example.com', age: 25 },
  {
    email: ['required', 'email'],
    age: ['required', 'min:18'],
  },
)
console.log(result) // { valid: true, errors: {} }
```

### 162. 图片懒加载实现

**描述**：实现图片懒加载功能，当图片进入视口时才开始加载。

- 使用Intersection Observer API。
- 支持占位图和加载状态。
- 支持预加载偏移量。

**输入**：图片元素选择器，配置选项
**输出**：懒加载实例

**示例**：

```javascript
class LazyLoader {
  constructor(selector, options = {}) {
    // 初始化懒加载
  }

  observe() {
    // 开始观察图片元素
  }

  unobserve() {
    // 停止观察
  }
}

const lazyLoader = new LazyLoader('img[data-src]', {
  rootMargin: '50px', // 提前50px开始加载
  threshold: 0.1,
})
lazyLoader.observe()

// HTML: <img data-src="image.jpg" src="placeholder.jpg" alt="图片">
```

### 163. 无限滚动实现

**描述**：实现无限滚动功能，当用户滚动到底部时自动加载更多内容。

- 监听滚动事件。
- 防抖优化性能。
- 支持加载状态和错误处理。

**输入**：容器元素，加载函数，配置选项
**输出**：无限滚动实例

**示例**：

```javascript
class InfiniteScroll {
  constructor(container, loadMore, options = {}) {
    // 初始化无限滚动
  }

  start() {
    // 开始监听滚动
  }

  stop() {
    // 停止监听
  }

  reset() {
    // 重置状态
  }
}

const infiniteScroll = new InfiniteScroll(
  document.getElementById('list'),
  async page => {
    const response = await fetch(`/api/items?page=${page}`)
    return response.json()
  },
  { threshold: 100 }, // 距离底部100px时触发
)
infiniteScroll.start()
```

### 164. 拖拽功能实现

**描述**：实现元素拖拽功能，支持拖拽排序和跨容器拖拽。

- 处理鼠标和触摸事件。
- 提供拖拽反馈效果。
- 支持拖拽约束和吸附。

**输入**：可拖拽元素，配置选项
**输出**：拖拽实例

**示例**：

```javascript
class Draggable {
  constructor(element, options = {}) {
    // 初始化拖拽功能
  }

  enable() {
    // 启用拖拽
  }

  disable() {
    // 禁用拖拽
  }

  destroy() {
    // 销毁拖拽实例
  }
}

const draggable = new Draggable(document.getElementById('item'), {
  containment: 'parent', // 限制在父元素内
  grid: [10, 10], // 网格吸附
  onDrag: (event, position) => console.log('拖拽中:', position),
})
draggable.enable()
```

### 165. 模块加载器实现

**描述**：实现一个简单的模块加载器，支持AMD规范。

- 异步加载模块。
- 依赖管理和解析。
- 循环依赖检测。

**输入**：模块名称，依赖列表，模块工厂函数
**输出**：模块加载器实例

**示例**：

```javascript
class ModuleLoader {
  constructor() {
    // 初始化模块加载器
  }

  define(name, dependencies, factory) {
    // 定义模块
  }

  require(dependencies, callback) {
    // 加载模块
  }

  load(url) {
    // 加载脚本文件
  }
}

const loader = new ModuleLoader()

// 定义模块
loader.define('math', [], function () {
  return {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b,
  }
})

// 使用模块
loader.require(['math'], function (math) {
  console.log(math.add(2, 3)) // 5
})
```

## 困难题目 (5)

### 166. 完整的Promise实现

**描述**：实现完整的Promise/A+规范，包括所有静态方法。

- 支持then、catch、finally方法。
- 实现Promise.all、Promise.race、Promise.allSettled等。
- 处理微任务队列。

**输入**：executor函数
**输出**：完整的Promise实现

**示例**：

```javascript
class FullPromise {
  constructor(executor) {
    // 实现完整Promise逻辑
  }

  then(onFulfilled, onRejected) {
    // 实现then方法
  }

  catch(onRejected) {
    // 实现catch方法
  }

  finally(onFinally) {
    // 实现finally方法
  }

  static resolve(value) {
    // 实现Promise.resolve
  }

  static reject(reason) {
    // 实现Promise.reject
  }

  static all(promises) {
    // 实现Promise.all
  }

  static race(promises) {
    // 实现Promise.race
  }
}

// 测试Promise链式调用
new FullPromise(resolve => resolve(1))
  .then(x => x + 1)
  .then(x => x * 2)
  .then(x => console.log(x)) // 4
  .catch(err => console.error(err))
```

### 167. 响应式数据系统

**描述**：实现一个响应式数据系统，类似Vue的响应式原理。

- 数据变化时自动更新依赖。
- 支持嵌套对象和数组。
- 依赖收集和派发更新。

**输入**：数据对象
**输出**：响应式代理对象

**示例**：

```javascript
function reactive(target) {
  // 实现响应式系统
}

function effect(fn) {
  // 实现副作用函数
}

const data = reactive({
  count: 0,
  user: { name: 'John' },
})

effect(() => {
  console.log('count changed:', data.count)
})

data.count++ // 自动触发副作用函数
data.user.name = 'Jane' // 嵌套对象变化也能监听
```

### 168. 虚拟滚动实现

**描述**：实现虚拟滚动组件，优化大量数据的渲染性能。

- 只渲染可视区域的元素。
- 支持动态高度的列表项。
- 平滑滚动和缓冲区管理。

**输入**：数据列表，容器配置
**输出**：虚拟滚动实例

**示例**：

```javascript
class VirtualScroll {
  constructor(container, options = {}) {
    // 初始化虚拟滚动
  }

  setData(data) {
    // 设置数据
  }

  scrollToIndex(index) {
    // 滚动到指定索引
  }

  refresh() {
    // 刷新视图
  }
}

const virtualScroll = new VirtualScroll(document.getElementById('list'), {
  itemHeight: 50, // 固定高度
  buffer: 5, // 缓冲区大小
  renderItem: (item, index) => `<div>Item ${index}: ${item.name}</div>`,
})

virtualScroll.setData(Array.from({ length: 10000 }, (_, i) => ({ name: `Item ${i}` })))
```

### 169. 微前端框架核心

**描述**：实现微前端框架的核心功能，支持多个子应用的加载和通信。

- 子应用的注册和生命周期管理。
- 沙箱隔离机制。
- 应用间通信。

**输入**：子应用配置
**输出**：微前端框架实例

**示例**：

```javascript
class MicroFrontend {
  constructor() {
    // 初始化微前端框架
  }

  registerApp(config) {
    // 注册子应用
  }

  loadApp(name) {
    // 加载子应用
  }

  unloadApp(name) {
    // 卸载子应用
  }

  createSandbox(appName) {
    // 创建沙箱环境
  }
}

const microApp = new MicroFrontend()

microApp.registerApp({
  name: 'app1',
  entry: 'http://localhost:3001',
  container: '#app1-container',
  activeWhen: '/app1',
})

microApp.loadApp('app1')
```

### 170. 编译器前端实现

**描述**：实现一个简单的编译器前端，包括词法分析、语法分析和AST生成。

- 词法分析器（Lexer）。
- 语法分析器（Parser）。
- 抽象语法树（AST）生成。

**输入**：源代码字符串
**输出**：AST对象

**示例**：

```javascript
class Compiler {
  constructor() {
    // 初始化编译器
  }

  tokenize(source) {
    // 词法分析，生成token流
  }

  parse(tokens) {
    // 语法分析，生成AST
  }

  compile(source) {
    // 完整编译流程
    const tokens = this.tokenize(source)
    const ast = this.parse(tokens)
    return ast
  }
}

const compiler = new Compiler()
const ast = compiler.compile('const x = 1 + 2 * 3;')
console.log(JSON.stringify(ast, null, 2))
// 输出AST结构
```

---

## 总结

本补充文档共包含40道题目，专注于前端开发中的核心JavaScript概念：

**简单题目 (15道)**：涵盖防抖节流、深拷贝、闭包、bind实现等基础概念。

**中等题目 (20道)**：包括Promise实现、设计模式、DOM操作、状态管理等实际应用场景。

**困难题目 (5道)**：涉及完整Promise实现、响应式系统、虚拟滚动、微前端等复杂架构。

这些题目与原有的130道算法题形成完美互补，为前端开发者提供全面的面试准备资源。建议按照优先级顺序学习，先掌握基础概念，再深入复杂应用场景。

### 学习建议

1. **基础概念优先**：先完成简单题目，确保对JavaScript核心概念有扎实理解。

2. **实践应用**：中等题目结合实际项目场景，建议在实际开发中尝试应用。

3. **架构思维**：困难题目涉及复杂系统设计，需要深入理解前端架构原理。

4. **循序渐进**：建议每天练习2-3道题目，保持持续学习的节奏。

5. **代码实现**：不仅要理解概念，更要动手实现每个题目的完整代码。

### 扩展方向

完成这些题目后，可以进一步学习：

- **性能优化**：Web性能监控、代码分割、懒加载策略
- **工程化工具**：Webpack、Vite、Babel等构建工具原理
- **测试驱动**：单元测试、集成测试、E2E测试
- **TypeScript**：类型系统、泛型、装饰器等高级特性
- **Node.js**：服务端JavaScript、API设计、数据库操作

通过系统性的学习和练习，相信能够显著提升前端开发技能和面试表现。

setData(data) {
// 设置数据
}

scrollToIndex(index) {
// 滚动到指定索引
}

refresh() {
// 刷新视图
}
}

const virtualScroll = new VirtualScroll(document.getElementById('list'), {
itemHeight: 50, // 固定高度
buffer: 5, // 缓冲区大小
renderItem: (item, index) => `<div>Item ${index}: ${item.name}</div>`,
})

virtualScroll.setData(Array.from({ length: 10000 }, (\_, i) => ({ name: `Item ${i}` })))

````

### 169. 微前端框架核心

**描述**：实现微前端框架的核心功能，支持多个子应用的加载和通信。

- 子应用的注册和生命周期管理。
- 沙箱隔离机制。
- 应用间通信。

**输入**：子应用配置
**输出**：微前端框架实例

**示例**：

```javascript
class MicroFrontend {
  constructor() {
    // 初始化微前端框架
  }

  registerApp(config) {
    // 注册子应用
  }

  loadApp(name) {
    // 加载子应用
  }

  unloadApp(name) {
    // 卸载子应用
  }

  createSandbox(appName) {
    // 创建沙箱环境
  }
}

const microApp = new MicroFrontend()

microApp.registerApp({
  name: 'app1',
  entry: 'http://localhost:3001',
  container: '#app1-container',
  activeWhen: '/app1',
})

microApp.loadApp('app1')
````

### 170. 编译器前端实现

**描述**：实现一个简单的编译器前端，包括词法分析、语法分析和AST生成。

- 词法分析器（Lexer）。
- 语法分析器（Parser）。
- 抽象语法树（AST）生成。

**输入**：源代码字符串
**输出**：AST对象

**示例**：

```javascript
class Compiler {
  constructor() {
    // 初始化编译器
  }

  tokenize(source) {
    // 词法分析，生成token流
  }

  parse(tokens) {
    // 语法分析，生成AST
  }

  compile(source) {
    // 完整编译流程
    const tokens = this.tokenize(source)
    const ast = this.parse(tokens)
    return ast
  }
}

const compiler = new Compiler()
const ast = compiler.compile('const x = 1 + 2 * 3;')
console.log(JSON.stringify(ast, null, 2))
// 输出AST结构
```

---

## 总结

本补充文档共包含40道题目，专注于前端开发中的核心JavaScript概念：

**简单题目 (15道)**：涵盖防抖节流、深拷贝、闭包、bind实现等基础概念。

**中等题目 (20道)**：包括Promise实现、设计模式、DOM操作、状态管理等实际应用场景。

**困难题目 (5道)**：涉及完整Promise实现、响应式系统、虚拟滚动、微前端等复杂架构。

这些题目与原有的130道算法题形成完美互补，为前端开发者提供全面的面试准备资源。建议按照优先级顺序学习，先掌握基础概念，再深入复杂应用场景。
