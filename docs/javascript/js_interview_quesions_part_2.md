## ES6+新特性

### let、const和块级作用域（8道）

# **046. [初级]** `let`、`const`和`var`的区别

都是js中定义变量关键字

- let 声明的变量只在当前作用域内有效
- const 声明的变量只在当前作用域内有效，且不能修改
- var 声明的变量在函数作用域内有效，没有块级作用域

## 深度分析与补充

**问题本质解读：** 这道题考察ES6变量声明的核心差异，面试官想了解你是否理解现代JavaScript变量声明的最佳实践。

**技术错误纠正：**

1. "const不能修改"表述不准确，应该是"const不能重新赋值，但对象内容可以修改"
2. 缺少提升行为、暂时性死区等重要差异的说明

**知识点系统梳理：**

**三种声明方式的对比：**

- **作用域**：var（函数作用域）、let/const（块级作用域）
- **提升行为**：var（提升并初始化为undefined）、let/const（提升但不初始化，存在TDZ）
- **重复声明**：var（允许）、let/const（不允许）
- **重新赋值**：var/let（允许）、const（不允许）

**实战应用举例：**

```javascript
// 1. 作用域差异演示
function scopeDemo() {
  console.log('=== 作用域差异 ===')

  // var的函数作用域
  if (true) {
    var varVariable = 'var value'
    let letVariable = 'let value'
    const constVariable = 'const value'
  }

  console.log(varVariable) // 'var value' - 可访问
  // console.log(letVariable); // ReferenceError - 块级作用域外不可访问
  // console.log(constVariable); // ReferenceError - 块级作用域外不可访问
}

// 2. 循环中的差异（经典面试题）
function loopDemo() {
  console.log('=== 循环中的差异 ===')

  // var的问题
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log('var:', i), 100) // 输出: 3, 3, 3
  }

  // let的解决方案
  for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log('let:', j), 200) // 输出: 0, 1, 2
  }
}
```

```javascript
// 3. const的特殊性
function constDemo() {
  console.log('=== const的特殊性 ===')

  // 基本类型不可修改
  const num = 42
  // num = 43; // TypeError: Assignment to constant variable

  // 对象内容可以修改
  const obj = { name: 'John', age: 25 }
  obj.age = 26 // 有效
  obj.city = 'NYC' // 有效
  console.log(obj) // { name: 'John', age: 26, city: 'NYC' }

  // 但不能重新赋值整个对象
  // obj = {}; // TypeError: Assignment to constant variable

  // 数组同理
  const arr = [1, 2, 3]
  arr.push(4) // 有效
  arr[0] = 0 // 有效
  console.log(arr) // [0, 2, 3, 4]
}
```

**记忆要点总结：**

- **var**：函数作用域，存在提升，可重复声明和赋值
- **let**：块级作用域，暂时性死区，可重新赋值但不可重复声明
- **const**：块级作用域，暂时性死区，不可重新赋值，对象内容可修改
- **最佳实践**：优先使用const，需要重新赋值时使用let，避免使用var

# **047. [初级]** 什么是块级作用域？

用{} 包裹的代码代码块形成的作用域

## 深度分析与补充

**问题本质解读：** 这道题考察ES6引入的块级作用域概念，面试官想了解你是否理解作用域的层次结构和实际应用。

**知识点系统梳理：**

**块级作用域的定义：**

- 由花括号{}包围的代码区域形成的作用域
- ES6之前JavaScript只有全局作用域和函数作用域
- let和const声明的变量具有块级作用域特性

**形成块级作用域的情况：**

- if/else语句块
- for/while循环体
- try/catch语句块
- 单独的代码块{}

**实战应用举例：**

```javascript
// 1. 不同语句块中的作用域
function blockScopeDemo() {
  let globalVar = 'global'

  // if语句块
  if (true) {
    let blockVar = 'if block'
    console.log(globalVar) // 'global' - 可访问外层
    console.log(blockVar) // 'if block'
  }
  // console.log(blockVar); // ReferenceError - 块外不可访问

  // for循环块
  for (let i = 0; i < 2; i++) {
    let loopVar = `loop ${i}`
    console.log(loopVar) // 'loop 0', 'loop 1'
  }
  // console.log(i); // ReferenceError - 循环变量块外不可访问

  // 独立代码块
  {
    let isolatedVar = 'isolated'
    console.log(isolatedVar) // 'isolated'
  }
  // console.log(isolatedVar); // ReferenceError
}
```

```javascript
// 2. 块级作用域的实际应用
function practicalExample() {
  const users = ['Alice', 'Bob', 'Charlie']

  // 使用块级作用域避免变量污染
  {
    let processedCount = 0
    let errors = []

    for (let user of users) {
      try {
        // 模拟处理用户数据
        if (user.length < 4) {
          throw new Error(`Name too short: ${user}`)
        }
        processedCount++
      } catch (error) {
        errors.push(error.message)
      }
    }

    console.log(`Processed: ${processedCount}, Errors: ${errors.length}`)
    // processedCount和errors只在这个块中有效
  }

  // 这里无法访问processedCount和errors，避免了变量污染
  console.log('Processing complete')
}
```

**记忆要点总结：**

- **定义**：花括号{}包围的代码区域形成的作用域
- **特点**：内部可访问外部变量，外部不能访问内部变量
- **应用场景**：if/for/while语句、try/catch块、独立代码块
- **实际价值**：避免变量污染、提高代码可维护性、减少命名冲突

# **048. [中级]** 什么是暂时性死区（TDZ）？

在块级作用域内，使用let和const声明的变量在声明之前是不可以访问的，这个区域被称为暂时性死区

## 深度分析与补充

**问题本质解读：** 这道题考察ES6变量声明的重要特性，面试官想了解你是否理解TDZ的机制和实际影响。

**知识点系统梳理：**

**暂时性死区（TDZ）的定义：**

- Temporal Dead Zone的缩写
- 从块级作用域开始到变量声明语句之间的区域
- 在此区域内访问变量会抛出ReferenceError

**TDZ的特点：**

- 只影响let和const声明的变量
- var声明的变量不存在TDZ（会提升并初始化为undefined）
- 即使外层作用域有同名变量，TDZ内也不能访问

**实战应用举例：**

```javascript
// 1. TDZ的基本演示
function tdzDemo() {
  console.log('=== TDZ演示 ===')

  // 这里是TDZ的开始
  console.log(typeof varVariable) // 'undefined' - var被提升
  // console.log(typeof letVariable); // ReferenceError - 在TDZ中
  // console.log(typeof constVariable); // ReferenceError - 在TDZ中

  var varVariable = 'var value'
  let letVariable = 'let value' // TDZ结束
  const constVariable = 'const value' // TDZ结束

  console.log(letVariable) // 'let value' - 现在可以访问
  console.log(constVariable) // 'const value' - 现在可以访问
}
```

```javascript
// 2. TDZ的实际影响和陷阱
function tdzTraps() {
  console.log('=== TDZ陷阱 ===')

  let x = 'outer x'

  function innerFunction() {
    // 即使外层有x，这里也不能访问，因为内层声明了let x
    // console.log(x); // ReferenceError - TDZ

    let x = 'inner x' // 这里TDZ结束
    console.log(x) // 'inner x'
  }

  innerFunction()

  // typeof在TDZ中的特殊行为
  function typeofInTDZ() {
    // console.log(typeof undeclaredVar); // 'undefined' - 未声明的变量
    // console.log(typeof declaredLater); // ReferenceError - TDZ中的变量

    let declaredLater = 'value'
  }

  // 参数默认值和TDZ
  function defaultParams(a = b, b = 2) {
    // 参数a的默认值引用了b，但b还在TDZ中
    return [a, b]
  }

  console.log(defaultParams(undefined, 3)) // [3, 3] - b被传入值
  // console.log(defaultParams()); // ReferenceError - b在TDZ中
}
```

**记忆要点总结：**

- **定义**：从块级作用域开始到let/const声明之间的区域
- **影响**：在TDZ中访问变量会抛出ReferenceError
- **范围**：只影响let和const，不影响var
- **实际意义**：防止在变量初始化前使用，提高代码安全性
- **注意事项**：typeof操作符在TDZ中也会报错，与未声明变量不同

# **049. [中级]** `const`声明的对象可以修改吗？

const声明的对象不可以整体赋值修改，但是对象内的属性和方法可以修改

## 深度分析与补充

**问题本质解读：** 这道题考察const的深层机制，面试官想了解你是否理解引用类型和值类型在const中的不同表现。

**知识点系统梳理：**

**const的约束机制：**

- const约束的是变量的绑定，不是值本身
- 对于基本类型：值不可变
- 对于引用类型：引用不可变，但内容可变

**const与不可变性：**

- const ≠ 不可变（immutable）
- 真正的不可变需要Object.freeze()等方法

**实战应用举例：**

```javascript
// 1. const对不同数据类型的影响
function constBehavior() {
  console.log('=== const行为演示 ===')

  // 基本类型 - 完全不可变
  const num = 42
  const str = 'hello'
  // num = 43; // TypeError: Assignment to constant variable
  // str = 'world'; // TypeError: Assignment to constant variable

  // 对象 - 引用不可变，内容可变
  const obj = { name: 'John', age: 25 }
  obj.age = 26 // 有效 - 修改属性
  obj.city = 'NYC' // 有效 - 添加属性
  delete obj.name // 有效 - 删除属性
  console.log(obj) // { age: 26, city: 'NYC' }

  // obj = {}; // TypeError - 不能重新赋值引用

  // 数组 - 同样的规则
  const arr = [1, 2, 3]
  arr.push(4) // 有效 - 修改内容
  arr[0] = 0 // 有效 - 修改元素
  console.log(arr) // [0, 2, 3, 4]

  // arr = []; // TypeError - 不能重新赋值引用
}
```

```javascript
// 2. 实现真正的不可变对象
function immutableDemo() {
  console.log('=== 不可变对象演示 ===')

  // 浅层冻结
  const shallowFrozen = Object.freeze({
    name: 'John',
    age: 25,
    address: { city: 'NYC', country: 'USA' },
  })

  // shallowFrozen.age = 26; // 静默失败（严格模式下报错）
  shallowFrozen.address.city = 'LA' // 有效 - 嵌套对象未冻结
  console.log(shallowFrozen.address.city) // 'LA'

  // 深层冻结
  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(prop => {
      const value = obj[prop]
      if (value && typeof value === 'object') {
        deepFreeze(value)
      }
    })
    return Object.freeze(obj)
  }

  const deepFrozen = deepFreeze({
    name: 'Jane',
    age: 30,
    address: { city: 'Boston', country: 'USA' },
  })

  // deepFrozen.age = 31; // 静默失败
  // deepFrozen.address.city = 'Miami'; // 静默失败
  console.log(deepFrozen.address.city) // 'Boston' - 未改变
}
```

**记忆要点总结：**

- **const约束**：变量绑定不可变，不是值不可变
- **基本类型**：const声明后完全不可修改
- **引用类型**：不能重新赋值，但内容可以修改
- **真正不可变**：需要Object.freeze()或深度冻结
- **实际应用**：配置对象、状态管理中需要注意这个特性

# **050. [初级]** 在什么情况下使用`let`、`const`、`var`？

- let 在块级作用域内声明变量 可以整体赋值修改的使用
- const 在块级作用域内声明不可以整体赋值修改的对象 或者常量
  ~~- var 在函数作用域内声明一个全局可以使用和修改的对象或者变量~~

## 深度分析与补充

**问题本质解读：** 这道题考察变量声明的最佳实践，面试官想了解你是否掌握现代JavaScript的编码规范。

**技术错误纠正：**

1. "var声明全局变量"表述不准确，var是函数作用域，不一定是全局
2. 缺少具体的使用场景和最佳实践指导

**知识点系统梳理：**

**现代JavaScript变量声明最佳实践：**

1. **优先使用const** - 默认选择，表明变量不会重新赋值
2. **需要重新赋值时使用let** - 明确表示变量会改变
3. **避免使用var** - 除非需要兼容老版本浏览器

**具体使用场景：**

- **const**：常量、配置对象、函数声明、不变的引用
- **let**：循环变量、条件变量、需要重新赋值的变量
- **var**：兼容性需求、特殊的函数作用域需求

**实战应用举例：**

```javascript
// 1. 推荐的使用模式
function bestPractices() {
  // 常量和配置 - 使用const
  const API_URL = 'https://api.example.com'
  const CONFIG = {
    timeout: 5000,
    retries: 3,
  }

  // 函数声明 - 使用const
  const calculateTotal = items => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }

  // 不会重新赋值的变量 - 使用const
  const users = ['Alice', 'Bob', 'Charlie']
  const userCount = users.length

  // 需要重新赋值的变量 - 使用let
  let currentUser = null
  let isLoading = false

  // 循环变量 - 使用let
  for (let i = 0; i < users.length; i++) {
    currentUser = users[i]
    console.log(`Processing user: ${currentUser}`)
  }

  // 条件赋值 - 使用let
  let message
  if (userCount > 0) {
    message = `Found ${userCount} users`
  } else {
    message = 'No users found'
  }
}
```

```javascript
// 2. 避免的反模式和常见错误
function antiPatterns() {
  // ❌ 避免：不必要的let
  let name = 'John' // 如果不会重新赋值，应该用const

  // ✅ 推荐：使用const
  const name = 'John'

  // ❌ 避免：使用var（除非有特殊需求）
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100) // 输出3,3,3
  }

  // ✅ 推荐：使用let
  for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 200) // 输出0,1,2
  }

  // ❌ 避免：过度使用let
  let result = processData() // 如果result不会改变，用const

  // ✅ 推荐：根据是否重新赋值选择
  const result = processData()

  function processData() {
    return { status: 'success', data: [] }
  }
}
```

**记忆要点总结：**

- **const优先**：默认使用const，表明变量不会重新赋值
- **let次之**：只在需要重新赋值时使用let
- **避免var**：现代JavaScript中应避免使用var
- **实际好处**：提高代码可读性、减少bug、明确变量意图
- **团队规范**：建议在ESLint中配置prefer-const规则

# **051. [中级]** for循环中使用`let`和`var`的区别

for循环中使用let会形成块级作用域 每一次循环都是一个块级作用域

## 深度分析与补充

**问题本质解读：** 这道题考察循环中变量声明的经典问题，面试官想了解你是否理解闭包和作用域在循环中的表现。

**知识点系统梳理：**

**for循环中的作用域差异：**

- **var**：函数作用域，所有循环共享同一个变量
- **let**：块级作用域，每次循环创建新的变量绑定

**经典问题：**

- setTimeout在循环中的表现差异
- 事件监听器绑定中的闭包问题
- 循环变量的生命周期

**实战应用举例：**

```javascript
// 1. 经典的setTimeout问题
function timeoutDemo() {
  console.log('=== setTimeout循环问题 ===')

  // var的问题：所有setTimeout共享同一个i
  console.log('使用var:')
  for (var i = 0; i < 3; i++) {
    setTimeout(
      () => {
        console.log('var i:', i) // 输出: 3, 3, 3
      },
      100 * (i + 1),
    )
  }

  // let的解决方案：每次循环创建新的j
  console.log('使用let:')
  for (let j = 0; j < 3; j++) {
    setTimeout(
      () => {
        console.log('let j:', j) // 输出: 0, 1, 2
      },
      100 * (j + 4),
    )
  }

  // var的解决方案：使用IIFE创建闭包
  console.log('var + IIFE:')
  for (var k = 0; k < 3; k++) {
    ;(function (index) {
      setTimeout(
        () => {
          console.log('IIFE index:', index) // 输出: 0, 1, 2
        },
        100 * (index + 7),
      )
    })(k)
  }
}
```

```javascript
// 2. 事件监听器中的应用
function eventListenerDemo() {
  console.log('=== 事件监听器问题 ===')

  // 模拟创建按钮
  const buttons = []
  for (let i = 0; i < 3; i++) {
    buttons[i] = { id: i, click: null }
  }

  // var的问题
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].click = function () {
      console.log('var - Button clicked:', i) // 总是输出最后的i值
    }
  }

  // let的解决方案
  for (let j = 0; j < buttons.length; j++) {
    buttons[j].click = function () {
      console.log('let - Button clicked:', j) // 输出正确的索引
    }
  }

  // 测试点击
  buttons.forEach((button, index) => {
    console.log(`Button ${index} click result:`)
    button.click()
  })
}
```

```javascript
// 3. 循环中的异步操作
async function asyncLoopDemo() {
  console.log('=== 异步循环问题 ===')

  const data = ['A', 'B', 'C']

  // var的问题：异步操作中变量值不符合预期
  console.log('使用var处理异步:')
  for (var i = 0; i < data.length; i++) {
    // 模拟异步操作
    Promise.resolve().then(() => {
      console.log(`var - Processing ${data[i]}`) // 可能输出undefined
    })
  }

  // let的解决方案：每次循环保持正确的变量值
  console.log('使用let处理异步:')
  for (let j = 0; j < data.length; j++) {
    Promise.resolve().then(() => {
      console.log(`let - Processing ${data[j]}`) // 输出正确的值
    })
  }
}
```

**记忆要点总结：**

- **var问题**：函数作用域导致循环变量被共享，异步操作中值不符合预期
- **let解决方案**：块级作用域为每次循环创建新的变量绑定
- **经典场景**：setTimeout、事件监听器、异步操作中的循环
- **替代方案**：var + IIFE、forEach等数组方法
- **最佳实践**：在循环中优先使用let，避免闭包陷阱

# **052. [中级]** 如何理解变量提升在ES6中的变化？

~~let和const改变了之前var声明变量方式，防止变量提升到全局，在修改单个数据或者声明新的数据时发生意想不到的结果。使得数据源追踪可以得到确定~~

- 引入暂时性死区，防止未初始化访问
- 块级作用域，减少变量污染
- 更严格的重复声明检查

## 深度分析与补充

**问题本质解读：** 这道题考察ES6对变量提升机制的改进，面试官想了解你是否理解现代JavaScript的安全性提升。

**技术错误纠正：**

1. "防止变量提升到全局"表述不准确，let/const仍有提升，但有暂时性死区
2. "数据源追踪可以得到确定"表述不清楚，应该说明具体的改进点

**知识点系统梳理：**

**ES6前后变量提升的对比：**

- **var**：提升并初始化为undefined，可在声明前访问
- **let/const**：提升但不初始化，存在暂时性死区
- **function**：完全提升，可在声明前调用

**ES6的改进：**

1. 引入暂时性死区，防止未初始化访问
2. 块级作用域，减少变量污染
3. 更严格的重复声明检查

**实战应用举例：**

```javascript
// 1. 提升行为的对比
function hoistingComparison() {
  console.log('=== 提升行为对比 ===')

  // var的提升行为
  console.log('var variable:', varVariable) // undefined - 已提升但未赋值
  var varVariable = 'var value'

  // let的提升行为
  // console.log('let variable:', letVariable); // ReferenceError - TDZ
  let letVariable = 'let value'

  // const的提升行为
  // console.log('const variable:', constVariable); // ReferenceError - TDZ
  const constVariable = 'const value'

  // 函数声明的提升
  console.log('function result:', hoistedFunction()) // 'I am hoisted' - 完全提升

  function hoistedFunction() {
    return 'I am hoisted'
  }
}
```

```javascript
// 2. ES6改进带来的安全性提升
function safetyImprovements() {
  console.log('=== 安全性改进 ===')

  // 防止意外的全局变量
  function oldWay() {
    // 在ES5中，忘记声明变量会创建全局变量
    // accidentalGlobal = 'oops'; // 创建全局变量（严格模式下报错）
  }

  function newWay() {
    // ES6中必须明确声明
    let properVariable = 'safe'
    const anotherVariable = 'also safe'
    // 不能意外创建全局变量
  }

  // 防止重复声明
  function duplicateDeclaration() {
    var oldVar = 'first'
    var oldVar = 'second' // 允许，但可能导致混淆

    let newLet = 'first'
    // let newLet = 'second'; // SyntaxError - 不允许重复声明

    const newConst = 'first'
    // const newConst = 'second'; // SyntaxError - 不允许重复声明
  }

  // 块级作用域的好处
  function blockScopeBenefits() {
    if (true) {
      var functionScoped = 'visible outside'
      let blockScoped = 'only visible inside'
      const alsoBlockScoped = 'only visible inside'
    }

    console.log(functionScoped) // 'visible outside'
    // console.log(blockScoped); // ReferenceError
    // console.log(alsoBlockScoped); // ReferenceError
  }
}
```

**记忆要点总结：**

- **提升变化**：let/const仍有提升但存在暂时性死区，不能提前访问
- **安全性提升**：防止未初始化访问、减少意外全局变量、禁止重复声明
- **作用域改进**：块级作用域减少变量污染和命名冲突
- **开发体验**：更早发现错误，提高代码可预测性
- **最佳实践**：优先使用let/const，利用ES6的安全特性

# **053. [高级]** 解释ES6中函数声明在块级作用域中的行为

函数声明在块级作用域内，内部可以访问外部，外部不能访问内部，块级作用域内函数提升

## 深度分析与补充

**问题本质解读：** 这道题考察ES6中函数声明的复杂行为，面试官想了解你是否理解块级函数声明的特殊规则。

**知识点系统梳理：**

**ES6中函数声明的行为：**

- 在块级作用域中，函数声明有特殊的提升行为
- 严格模式和非严格模式下行为不同
- 函数表达式不受此规则影响

**块级函数声明的规则：**

1. 函数声明在块内提升到块的顶部
2. 在非严格模式下，函数名也会在外层作用域创建变量
3. 严格模式下，函数只在块内可见

**实战应用举例：**

```javascript
// 1. 块级函数声明的基本行为
function blockFunctionDemo() {
  'use strict' // 严格模式
  console.log('=== 块级函数声明 ===')

  console.log(typeof outerFunction) // 'undefined' - 外层不可见

  if (true) {
    console.log(typeof innerFunction) // 'function' - 块内提升

    function innerFunction() {
      return 'I am in block'
    }

    console.log(innerFunction()) // 'I am in block'
  }

  // console.log(innerFunction()); // ReferenceError - 块外不可见
}

// 2. 严格模式 vs 非严格模式
function modeComparison() {
  console.log('=== 模式对比 ===')

  // 非严格模式
  function nonStrictMode() {
    console.log('非严格模式:')
    console.log(typeof blockFunc) // 'undefined' - 变量已创建但未赋值

    if (true) {
      function blockFunc() {
        return 'non-strict block function'
      }
    }

    console.log(typeof blockFunc) // 'function' - 现在可以访问
    console.log(blockFunc()) // 'non-strict block function'
  }

  // 严格模式
  function strictMode() {
    'use strict'
    console.log('严格模式:')
    // console.log(typeof blockFunc); // ReferenceError - 变量不存在

    if (true) {
      function blockFunc() {
        return 'strict block function'
      }
      console.log(blockFunc()) // 'strict block function' - 块内可用
    }

    // console.log(blockFunc()); // ReferenceError - 块外不可见
  }

  nonStrictMode()
  strictMode()
}
```

```javascript
// 3. 最佳实践和替代方案
function bestPractices() {
  console.log('=== 最佳实践 ===')

  // ❌ 避免：块级函数声明（行为复杂）
  if (true) {
    function problematicFunction() {
      return 'avoid this pattern'
    }
  }

  // ✅ 推荐：使用函数表达式
  let recommendedFunction
  if (true) {
    recommendedFunction = function () {
      return 'use this pattern'
    }
  }

  // ✅ 推荐：使用const + 箭头函数
  if (true) {
    const arrowFunction = () => {
      return 'even better pattern'
    }
    console.log(arrowFunction())
  }

  // ✅ 推荐：条件性函数定义
  const conditionalFunction = condition => {
    if (condition) {
      return function () {
        return 'conditional function'
      }
    }
    return null
  }

  const myFunc = conditionalFunction(true)
  if (myFunc) {
    console.log(myFunc())
  }
}
```

**记忆要点总结：**

- **块级提升**：函数声明在块内提升到块顶部
- **模式差异**：严格模式下函数只在块内可见，非严格模式下外层也会创建变量
- **复杂性**：块级函数声明行为复杂，容易产生混淆
- **最佳实践**：避免块级函数声明，使用函数表达式或箭头函数
- **实际建议**：在条件语句中定义函数时，优先使用函数表达式

### 箭头函数（8道）

# **054. [初级]** 箭头函数的基本语法是什么？

```javascript
const sayHello = () => {
  console.log('hello')
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6箭头函数的语法基础，面试官想了解你是否掌握箭头函数的各种语法形式。

**知识点系统梳理：**

**箭头函数的语法形式：**

1. **无参数**：`() => expression`
2. **单参数**：`param => expression`（可省略括号）
3. **多参数**：`(param1, param2) => expression`
4. **函数体**：`() => { statements }`
5. **返回对象**：`() => ({ key: value })`

**语法特点：**

- 更简洁的函数表达式语法
- 隐式返回（单表达式时）
- 词法this绑定

**实战应用举例：**

```javascript
// 1. 各种语法形式演示
function syntaxDemo() {
  console.log('=== 箭头函数语法 ===')

  // 无参数
  const greet = () => 'Hello World'
  const getCurrentTime = () => new Date().toISOString()

  // 单参数（可省略括号）
  const square = x => x * x
  const double = num => num * 2

  // 多参数
  const add = (a, b) => a + b
  const multiply = (x, y, z) => x * y * z

  // 函数体（需要显式return）
  const processData = data => {
    const processed = data.map(item => item.toUpperCase())
    return processed.join(', ')
  }

  // 返回对象（需要括号包裹）
  const createUser = (name, age) => ({ name, age, id: Date.now() })

  // 测试
  console.log(greet()) // 'Hello World'
  console.log(square(5)) // 25
  console.log(add(3, 4)) // 7
  console.log(processData(['a', 'b'])) // 'A, B'
  console.log(createUser('John', 25)) // { name: 'John', age: 25, id: ... }
}
```

```javascript
// 2. 实际应用场景
function practicalUsage() {
  console.log('=== 实际应用 ===')

  const numbers = [1, 2, 3, 4, 5]

  // 数组方法中的应用
  const doubled = numbers.map(n => n * 2)
  const evens = numbers.filter(n => n % 2 === 0)
  const sum = numbers.reduce((acc, n) => acc + n, 0)

  console.log('Doubled:', doubled) // [2, 4, 6, 8, 10]
  console.log('Evens:', evens) // [2, 4]
  console.log('Sum:', sum) // 15

  // Promise链中的应用
  const fetchUserData = userId => {
    return Promise.resolve({ id: userId, name: `User${userId}` })
      .then(user => ({ ...user, processed: true }))
      .then(user => {
        console.log('Processed user:', user)
        return user
      })
      .catch(error => console.error('Error:', error))
  }

  // 事件处理（注意this绑定）
  const button = {
    text: 'Click me',
    handleClick: function () {
      // 使用箭头函数保持this指向
      setTimeout(() => {
        console.log('Button text:', this.text)
      }, 100)
    },
  }

  fetchUserData(1)
  button.handleClick()
}
```

**记忆要点总结：**

- **基本语法**：`(params) => expression` 或 `(params) => { statements }`
- **简化规则**：单参数可省略括号，单表达式可省略return
- **返回对象**：需要用括号包裹对象字面量
- **常用场景**：数组方法、Promise链、事件处理、回调函数
- **注意事项**：this绑定、不能作为构造函数、没有arguments对象

# **055. [中级]** 箭头函数和普通函数的区别

- 箭头函数没有this；内部this绑定外部作用域
- 箭头函数不可以new
- 箭头函数没有~~augments~~ arguments
- ~~箭头函数不存在函数提升~~ 箭头函数是表达式，不提升
- 箭头函数没有prototype

## 深度分析与补充

**问题本质解读：** 这道题考察箭头函数与普通函数的核心差异，面试官想了解你是否理解何时使用箭头函数。

**技术错误纠正：**

1. "augments"拼写错误，应为"arguments"
2. "不存在函数提升"不准确，箭头函数是表达式，不是声明

**知识点系统梳理：**

**箭头函数 vs 普通函数的主要区别：**

1. **this绑定**：箭头函数词法绑定，普通函数动态绑定
2. **构造函数**：箭头函数不能用new，普通函数可以
3. **arguments对象**：箭头函数没有，普通函数有
4. **原型属性**：箭头函数没有prototype，普通函数有
5. **提升行为**：箭头函数是表达式不提升，函数声明会提升

**实战应用举例：**

```javascript
// 1. this绑定的差异
function thisBindingDemo() {
  console.log('=== this绑定差异 ===')

  const obj = {
    name: 'MyObject',

    // 普通函数：this动态绑定
    regularMethod: function () {
      console.log('Regular method this:', this.name)

      // 内部普通函数：this指向全局或undefined
      function innerRegular() {
        console.log('Inner regular this:', this?.name || 'undefined')
      }

      // 内部箭头函数：this继承外层
      const innerArrow = () => {
        console.log('Inner arrow this:', this.name)
      }

      innerRegular() // undefined
      innerArrow() // 'MyObject'
    },

    // 箭头函数：this词法绑定（指向外层作用域）
    arrowMethod: () => {
      console.log('Arrow method this:', this?.name || 'global/undefined')
    },
  }

  obj.regularMethod() // this指向obj
  obj.arrowMethod() // this指向全局或undefined
}
```

```javascript
// 2. 构造函数和arguments的差异
function constructorAndArgumentsDemo() {
  console.log('=== 构造函数和arguments差异 ===')

  // 普通函数可以作为构造函数
  function RegularConstructor(name) {
    this.name = name
    console.log('Arguments in regular:', arguments.length)
  }

  // 箭头函数不能作为构造函数
  const ArrowConstructor = name => {
    this.name = name // this不指向新对象
    // console.log('Arguments in arrow:', arguments); // ReferenceError
  }

  // 测试构造函数
  const regular = new RegularConstructor('John', 'extra') // 正常工作
  console.log('Regular instance:', regular)

  try {
    const arrow = new ArrowConstructor('Jane') // TypeError
  } catch (error) {
    console.log('Arrow constructor error:', error.message)
  }

  // 箭头函数获取参数的方法
  const arrowWithParams = (...args) => {
    console.log('Arrow function args:', args)
    return args.length
  }

  console.log('Arrow params count:', arrowWithParams(1, 2, 3))
}
```

```javascript
// 3. 实际使用场景对比
function usageScenarios() {
  console.log('=== 使用场景对比 ===')

  class EventHandler {
    constructor(name) {
      this.name = name
      this.count = 0
    }

    // ✅ 使用箭头函数：保持this绑定
    handleClick = () => {
      this.count++
      console.log(`${this.name} clicked ${this.count} times`)
    }

    // ❌ 普通方法在事件中会丢失this
    handleClickRegular() {
      this.count++
      console.log(`${this.name} clicked ${this.count} times`)
    }

    // ✅ 普通方法：需要动态this
    processItems(items, callback) {
      return items.map(callback)
    }
  }

  const handler = new EventHandler('Button')

  // 模拟事件绑定
  const clickHandler = handler.handleClick
  clickHandler() // 正常工作，this仍指向handler

  // 数组处理：普通函数更灵活
  const numbers = [1, 2, 3]
  const doubled = handler.processItems(numbers, function (n) {
    return n * 2 // 这里的this可以根据调用方式改变
  })

  console.log('Doubled:', doubled)
}
```

**记忆要点总结：**

- **this绑定**：箭头函数词法绑定（继承外层），普通函数动态绑定
- **构造函数**：箭头函数不能用new，普通函数可以
- **arguments**：箭头函数没有arguments，使用...rest参数
- **使用场景**：箭头函数适合回调和事件处理，普通函数适合方法定义
- **选择原则**：需要动态this用普通函数，需要保持this用箭头函数

# **056. [中级]** 箭头函数中的`this`指向问题

- ~~箭头函数没有this；内部this绑定外部作用域~~
- this在定义时确定
- 从外部作用域继承this
- 无法通过call apply bind改变this指向

## 深度分析与补充

**问题本质解读：** 这道题考察箭头函数this绑定的核心机制，面试官想了解你是否理解词法作用域的概念。

**知识点系统梳理：**

**箭头函数this的特点：**

- 词法绑定：this值在定义时确定，不是调用时
- 继承外层：从包含它的作用域继承this值
- 不可改变：call、apply、bind无法改变箭头函数的this

**与普通函数的对比：**

- 普通函数：this在调用时确定
- 箭头函数：this在定义时确定

**实战应用举例：**

```javascript
// 1. 词法绑定演示
function lexicalBindingDemo() {
  console.log('=== 词法绑定演示 ===')

  const globalObj = {
    name: 'Global',

    testMethods: function () {
      console.log('Outer this:', this.name) // 'Global'

      // 普通函数：this取决于调用方式
      const regularFunc = function () {
        console.log('Regular function this:', this?.name || 'undefined')
      }

      // 箭头函数：this继承外层
      const arrowFunc = () => {
        console.log('Arrow function this:', this.name)
      }

      regularFunc() // undefined（严格模式）或global（非严格模式）
      arrowFunc() // 'Global'

      // 即使改变调用方式，箭头函数this不变
      const anotherObj = { name: 'Another' }
      regularFunc.call(anotherObj) // 'Another'
      arrowFunc.call(anotherObj) // 'Global' - 无法改变
    },
  }

  globalObj.testMethods()
}
```

```javascript
// 2. 实际应用场景
function practicalScenarios() {
  console.log('=== 实际应用场景 ===')

  class Timer {
    constructor(name) {
      this.name = name
      this.seconds = 0
    }

    // ✅ 箭头函数：保持this指向实例
    start() {
      this.intervalId = setInterval(() => {
        this.seconds++
        console.log(`${this.name}: ${this.seconds}s`)
      }, 1000)
    }

    // ❌ 如果使用普通函数会丢失this
    startProblematic() {
      this.intervalId = setInterval(function () {
        // this指向全局对象或undefined
        console.log(`${this?.name || 'unknown'}: ${this?.seconds || 0}s`)
      }, 1000)
    }

    stop() {
      clearInterval(this.intervalId)
    }
  }

  // React组件中的常见用法
  const ReactComponent = {
    state: { count: 0 },

    // ✅ 箭头函数：自动绑定this
    handleClick: () => {
      // 注意：在实际React中，这里的this不会指向组件实例
      // 这只是演示语法，实际React使用Hooks
      console.log('Clicked')
    },

    // 传统方法需要手动绑定
    handleClickTraditional: function () {
      console.log('Traditional click')
    },
  }

  const timer = new Timer('MyTimer')
  timer.start()
  setTimeout(() => timer.stop(), 3000)
}
```

**记忆要点总结：**

- **词法绑定**：箭头函数的this在定义时确定，继承外层作用域
- **不可改变**：call、apply、bind无法改变箭头函数的this指向
- **适用场景**：回调函数、事件处理器、定时器中保持this指向
- **注意事项**：在对象方法中使用箭头函数可能导致this指向错误
- **最佳实践**：需要保持this指向时使用箭头函数，需要动态this时使用普通函数

# **057. [初级]** 箭头函数可以作为构造函数吗？

- 不可以

## 深度分析与补充

**问题本质解读：** 这道题考察箭头函数的限制，面试官想了解你是否理解箭头函数不能作为构造函数的原因。

**知识点系统梳理：**

**箭头函数不能作为构造函数的原因：**

1. 没有自己的this绑定
2. 没有prototype属性
3. 没有[[Construct]]内部方法
4. 无法创建新的对象实例

**构造函数的要求：**

- 必须有prototype属性
- 必须能够绑定this到新对象
- 必须有[[Construct]]内部方法

**实战应用举例：**

```javascript
// 1. 箭头函数作为构造函数的错误演示
function constructorDemo() {
  console.log('=== 构造函数演示 ===')

  // 普通函数可以作为构造函数
  function RegularConstructor(name) {
    this.name = name
    this.greet = function () {
      return `Hello, I'm ${this.name}`
    }
  }

  // 添加原型方法
  RegularConstructor.prototype.sayHi = function () {
    return `Hi from ${this.name}`
  }

  // 箭头函数不能作为构造函数
  const ArrowConstructor = name => {
    this.name = name // this不会指向新对象
  }

  // 测试普通构造函数
  const person1 = new RegularConstructor('John')
  console.log(person1.greet()) // "Hello, I'm John"
  console.log(person1.sayHi()) // "Hi from John"
  console.log(person1 instanceof RegularConstructor) // true

  // 测试箭头函数构造函数（会报错）
  try {
    const person2 = new ArrowConstructor('Jane')
  } catch (error) {
    console.log('Error:', error.message) // "ArrowConstructor is not a constructor"
  }

  // 检查prototype属性
  console.log('Regular has prototype:', 'prototype' in RegularConstructor) // true
  console.log('Arrow has prototype:', 'prototype' in ArrowConstructor) // false
}
```

```javascript
// 2. 正确的替代方案
function alternatives() {
  console.log('=== 替代方案 ===')

  // ✅ 使用class语法（推荐）
  class ModernPerson {
    constructor(name) {
      this.name = name
    }

    greet() {
      return `Hello, I'm ${this.name}`
    }

    // 箭头函数作为实例方法（自动绑定this）
    getGreeting = () => {
      return `Greeting from ${this.name}`
    }
  }

  // ✅ 工厂函数模式
  const createPerson = name => {
    return {
      name,
      greet() {
        return `Hello, I'm ${this.name}`
      },
      // 箭头函数在对象中的正确用法
      getInfo: () => `Person object created`,
    }
  }

  // ✅ 函数式构造模式
  const PersonFactory = name => {
    const state = { name }

    return {
      getName: () => state.name,
      setName: newName => {
        state.name = newName
      },
      greet: () => `Hello, I'm ${state.name}`,
    }
  }

  // 测试替代方案
  const modern = new ModernPerson('Alice')
  const factory = createPerson('Bob')
  const functional = PersonFactory('Charlie')

  console.log(modern.greet()) // "Hello, I'm Alice"
  console.log(factory.greet()) // "Hello, I'm Bob"
  console.log(functional.greet()) // "Hello, I'm Charlie"
}
```

**记忆要点总结：**

- **不能作为构造函数**：箭头函数没有[[Construct]]方法，使用new会报错
- **缺少prototype**：箭头函数没有prototype属性，无法添加原型方法
- **this绑定问题**：箭头函数的this不会指向新创建的对象
- **替代方案**：使用class语法、工厂函数或函数式构造模式
- **最佳实践**：构造对象时使用class或普通函数，箭头函数用于方法和回调

# **058. [中级]** 箭头函数没有哪些特性？

- 箭头函数不可以new
- 箭头函数没有自己的this
- 箭头函数没有arguments对象
- 箭头函数没有prototype属性
- 箭头函数没有super
- 箭头函数没有new.target

## 深度分析与补充

**问题本质解读：** 这道题考察箭头函数缺失的特性，面试官想了解你是否全面理解箭头函数的限制。

**技术错误纠正：**

1. "augments"拼写错误，应为"arguments"
2. "不存在函数提升"表述不准确，箭头函数是表达式，不是声明

**知识点系统梳理：**

**箭头函数缺失的特性：**

1. **没有自己的this** - 词法绑定外层this
2. **没有arguments对象** - 使用rest参数替代
3. **没有prototype属性** - 不能作为构造函数
4. **没有super** - 不能在类继承中使用
5. **没有new.target** - 无法检测构造调用

**实战应用举例：**

```javascript
// 1. 缺失特性的演示
function missingFeaturesDemo() {
  console.log('=== 箭头函数缺失特性 ===')

  // 普通函数拥有的特性
  function regularFunction() {
    console.log('this:', this)
    console.log('arguments:', arguments)
    console.log('prototype:', regularFunction.prototype)
    console.log('new.target:', new.target)
  }

  // 箭头函数缺失的特性
  const arrowFunction = () => {
    console.log('this:', this) // 继承外层this
    // console.log('arguments:', arguments); // ReferenceError
    // console.log('super:', super); // SyntaxError
    // console.log('new.target:', new.target); // SyntaxError
  }

  console.log('Regular function prototype:', regularFunction.prototype)
  console.log('Arrow function prototype:', arrowFunction.prototype) // undefined

  // 测试arguments
  function testArguments() {
    console.log('=== Arguments测试 ===')

    function regularWithArgs() {
      console.log('Regular arguments:', Array.from(arguments))
    }

    const arrowWithArgs = (...args) => {
      console.log('Arrow rest params:', args)
    }

    regularWithArgs(1, 2, 3) // [1, 2, 3]
    arrowWithArgs(1, 2, 3) // [1, 2, 3]
  }

  testArguments()
}
```

```javascript
// 2. 替代方案和最佳实践
function alternativesAndBestPractices() {
  console.log('=== 替代方案 ===')

  // ✅ 使用rest参数替代arguments
  const sumNumbers = (...numbers) => {
    return numbers.reduce((sum, num) => sum + num, 0)
  }

  // ✅ 使用普通函数需要动态this时
  const calculator = {
    value: 0,

    // 普通方法：this指向对象
    add: function (num) {
      this.value += num
      return this
    },

    // 箭头函数：保持外层this（可能不是期望的）
    multiply: num => {
      // this不指向calculator对象
      console.log('Arrow this:', this)
      return num * 2 // 只能返回计算结果，无法修改对象状态
    },

    // ✅ 正确使用箭头函数：回调中保持this
    processAsync: function (callback) {
      setTimeout(() => {
        // 箭头函数保持this指向calculator
        this.value *= 2
        callback(this.value)
      }, 100)
    },
  }

  // ✅ 类中的正确使用
  class DataProcessor {
    constructor() {
      this.data = []
    }

    // 普通方法
    addData(item) {
      this.data.push(item)
    }

    // 箭头函数作为实例属性（自动绑定this）
    processData = () => {
      return this.data.map(item => item.toString().toUpperCase())
    }

    // 普通方法中使用箭头函数
    asyncProcess(callback) {
      setTimeout(() => {
        const result = this.processData()
        callback(result)
      }, 100)
    }
  }

  // 测试
  console.log(sumNumbers(1, 2, 3, 4)) // 10

  calculator.add(5).add(3)
  console.log('Calculator value:', calculator.value) // 8

  const processor = new DataProcessor()
  processor.addData('hello')
  processor.addData('world')
  console.log('Processed:', processor.processData()) // ['HELLO', 'WORLD']
}
```

**记忆要点总结：**

- **缺失特性**：this、arguments、prototype、super、new.target
- **替代方案**：rest参数替代arguments，普通函数处理动态this
- **使用原则**：需要这些特性时使用普通函数，否则优先箭头函数
- **最佳实践**：在回调、事件处理中使用箭头函数保持this绑定
- **注意事项**：在对象方法中使用箭头函数要谨慎，可能导致this指向错误

# **059. [中级]** 什么时候不应该使用箭头函数 ➜ 什么时候应该使用箭头函数

**不应该使用箭头函数的场景：**

- 构造类
- 类的方法
- 原型方法
- 事件处理器
- 需要arguments的场景

**应该使用箭头函数的场景：**

- 回调函数、数组方法、Promise链
- 需要保持外层this的场景

## 深度分析与补充

**问题本质解读：** 这道题考察箭头函数的适用场景，面试官想了解你是否能正确选择函数类型。

**知识点系统梳理：**

**不应该使用箭头函数的场景：**

1. **构造函数** - 无法使用new操作符
2. **对象方法** - this指向可能错误
3. **原型方法** - 需要动态this绑定
4. **事件处理器** - 需要this指向DOM元素
5. **需要arguments的场景** - 箭头函数没有arguments

**应该使用箭头函数的场景：**

- 回调函数、数组方法、Promise链
- 需要保持外层this的场景

**实战应用举例：**

```javascript
// 1. 不应该使用箭头函数的场景
function inappropriateUsage() {
  console.log('=== 不当使用场景 ===')

  // ❌ 对象方法中使用箭头函数
  const person = {
    name: 'John',

    // 错误：this不指向person对象
    greetArrow: () => {
      console.log(`Hello, I'm ${this?.name || 'unknown'}`) // 'unknown'
    },

    // 正确：this指向person对象
    greetRegular: function () {
      console.log(`Hello, I'm ${this.name}`) // 'Hello, I'm John'
    },
  }

  person.greetArrow() // 输出错误
  person.greetRegular() // 输出正确

  // ❌ 原型方法中使用箭头函数
  function Person(name) {
    this.name = name
  }

  // 错误：this不指向实例
  Person.prototype.introduceArrow = () => {
    console.log(`I'm ${this?.name || 'unknown'}`)
  }

  // 正确：this指向实例
  Person.prototype.introduceRegular = function () {
    console.log(`I'm ${this.name}`)
  }

  const john = new Person('John')
  john.introduceArrow() // 'I'm unknown'
  john.introduceRegular() // 'I'm John'
}
```

```javascript
// 2. 正确的使用场景
function appropriateUsage() {
  console.log('=== 正确使用场景 ===')

  class EventEmitter {
    constructor() {
      this.events = {}
      this.id = Math.random()
    }

    // ✅ 普通方法：需要this指向实例
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = []
      }
      this.events[event].push(callback)
    }

    // ✅ 箭头函数：保持this绑定
    emit = (event, data) => {
      if (this.events[event]) {
        this.events[event].forEach(callback => callback(data))
      }
    }

    // ✅ 普通方法中使用箭头函数
    delayedEmit(event, data, delay) {
      setTimeout(() => {
        // 箭头函数保持this指向实例
        this.emit(event, data)
      }, delay)
    }

    // ✅ 数组方法中使用箭头函数
    getEventNames() {
      return Object.keys(this.events)
        .filter(name => this.events[name].length > 0)
        .map(name => name.toUpperCase())
    }
  }

  // 使用示例
  const emitter = new EventEmitter()
  emitter.on('test', data => console.log('Received:', data))

  emitter.emit('test', 'Hello') // 立即触发
  emitter.delayedEmit('test', 'Delayed Hello', 1000) // 延迟触发
}
```

```javascript
// 3. 特殊场景的处理
function specialCases() {
  console.log('=== 特殊场景 ===')

  // DOM事件处理
  const button = {
    element: { addEventListener: () => {} }, // 模拟DOM元素
    clickCount: 0,

    // ❌ 如果需要this指向DOM元素
    handleClickWrong: () => {
      // this不指向DOM元素
      console.log('Wrong this:', this)
    },

    // ✅ 需要访问组件状态时
    handleClickRight: function (event) {
      this.clickCount++
      console.log(`Clicked ${this.clickCount} times`)

      // 内部使用箭头函数保持this
      setTimeout(() => {
        console.log(`Count after delay: ${this.clickCount}`)
      }, 100)
    },
  }

  // 高阶函数场景
  const createMultiplier = factor => {
    // ✅ 箭头函数：简洁的工厂函数
    return num => num * factor
  }

  const double = createMultiplier(2)
  const triple = createMultiplier(3)

  console.log('Double 5:', double(5)) // 10
  console.log('Triple 4:', triple(4)) // 12
}
```

**记忆要点总结：**

- **避免场景**：构造函数、对象方法、原型方法、需要动态this的场景
- **适用场景**：回调函数、数组方法、需要保持外层this的场景
- **判断原则**：需要动态this用普通函数，需要词法this用箭头函数
- **最佳实践**：在类中，方法用普通函数，回调用箭头函数
- **记忆技巧**：箭头函数适合"向上"继承this，普通函数适合"当前"绑定this

# **060. [高级]** 箭头函数在事件处理中的注意事项

- 需要导出

## 深度分析与补充

**问题本质解读：** 这道题考察箭头函数在事件处理中的特殊考虑，面试官想了解你是否理解this绑定在事件处理中的重要性。

**技术错误纠正：**

1. "需要导出"表述不清楚，应该说明具体的注意事项
2. 缺少事件处理中this绑定的关键问题说明

**知识点系统梳理：**

**箭头函数在事件处理中的注意事项：**

1. **this指向问题** - 不指向事件目标元素
2. **移除事件监听器** - 需要保持函数引用
3. **性能考虑** - 避免在渲染中创建新函数
4. **调试困难** - 匿名函数难以调试

**实战应用举例：**

```javascript
// 1. 事件处理中的this指向问题
function eventThisBinding() {
  console.log('=== 事件this绑定 ===')

  class ButtonHandler {
    constructor(element) {
      this.element = element
      this.clickCount = 0
      this.setupEvents()
    }

    setupEvents() {
      // ❌ 箭头函数：this不指向DOM元素
      this.element.addEventListener('click', event => {
        console.log('Arrow - this:', this) // ButtonHandler实例
        console.log('Arrow - event.target:', event.target) // DOM元素
        this.clickCount++ // 可以访问实例属性
      })

      // ✅ 普通函数：this指向DOM元素
      this.element.addEventListener('dblclick', function (event) {
        console.log('Regular - this:', this) // DOM元素
        console.log('Regular - event.target:', event.target) // DOM元素
        // 无法直接访问ButtonHandler实例
      })

      // ✅ 混合方案：保存实例引用
      const self = this
      this.element.addEventListener('mouseenter', function (event) {
        console.log('DOM element:', this) // DOM元素
        console.log('Instance:', self) // ButtonHandler实例
        self.clickCount++
      })
    }
  }
}
```

```javascript
// 2. 事件监听器的移除问题
function eventRemoval() {
  console.log('=== 事件移除问题 ===')

  class ComponentManager {
    constructor() {
      this.isActive = true

      // ❌ 问题：每次都创建新函数，无法移除
      this.setupProblematic()

      // ✅ 解决方案：保持函数引用
      this.setupCorrect()
    }

    setupProblematic() {
      const button = document.createElement('button')

      // 每次调用都是新函数，无法移除
      button.addEventListener('click', () => {
        console.log('Problematic click')
      })

      // 无法移除上面的监听器
      // button.removeEventListener('click', ???); // 没有引用
    }

    setupCorrect() {
      const button = document.createElement('button')

      // 保持函数引用
      this.handleClick = () => {
        if (this.isActive) {
          console.log('Correct click')
        }
      }

      button.addEventListener('click', this.handleClick)

      // 可以正确移除
      setTimeout(() => {
        button.removeEventListener('click', this.handleClick)
        console.log('Event listener removed')
      }, 5000)
    }

    destroy() {
      this.isActive = false
      // 清理所有事件监听器
    }
  }
}
```

```javascript
// 3. React/Vue中的最佳实践
function frameworkBestPractices() {
  console.log('=== 框架中的最佳实践 ===')

  // React组件示例
  class ReactComponent {
    constructor(props) {
      this.state = { count: 0 }

      // ✅ 在构造函数中绑定，避免重复创建
      this.handleClick = this.handleClick.bind(this)

      // ✅ 或使用箭头函数属性（推荐）
      this.handleClickArrow = () => {
        this.setState({ count: this.state.count + 1 })
      }
    }

    handleClick() {
      this.setState({ count: this.state.count + 1 })
    }

    render() {
      return {
        // ❌ 避免：在render中创建新函数
        onClick1: () => this.handleClick(), // 每次render都创建新函数

        // ✅ 推荐：使用预绑定的函数
        onClick2: this.handleClick,
        onClick3: this.handleClickArrow,
      }
    }
  }

  // Vue组件示例
  const VueComponent = {
    data() {
      return { count: 0 }
    },

    methods: {
      // ✅ 普通方法：this自动绑定到组件实例
      handleClick() {
        this.count++
      },

      // ❌ 箭头函数：this不指向组件实例
      handleClickArrow: () => {
        // this不指向组件实例
        console.log('Wrong this:', this)
      },
    },

    mounted() {
      // ✅ 生命周期中使用箭头函数保持this
      setTimeout(() => {
        this.count = 10 // this正确指向组件实例
      }, 1000)
    },
  }
}
```

**记忆要点总结：**

- **this指向**：箭头函数this不指向DOM元素，指向定义时的上下文
- **事件移除**：需要保持函数引用才能正确移除事件监听器
- **性能考虑**：避免在渲染过程中重复创建箭头函数
- **框架使用**：React中用箭头函数属性，Vue中用普通方法
- **最佳实践**：根据需要访问的this选择合适的函数类型

# **061. [中级]** 如何在箭头函数中访问`arguments`对象？

可以通过在参数中使用 (...args)

## 深度分析与补充

**问题本质解读：** 这道题考察箭头函数参数处理的替代方案，面试官想了解你是否掌握现代JavaScript的参数处理方式。

**知识点系统梳理：**

**箭头函数访问参数的方法：**

1. **Rest参数** - `...args`收集所有参数
2. **解构参数** - 直接解构需要的参数
3. **默认参数** - 设置参数默认值
4. **外层arguments** - 访问外层函数的arguments

**与普通函数arguments的对比：**

- arguments是类数组对象，rest参数是真正的数组
- rest参数更现代、更灵活

**实战应用举例：**

```javascript
// 1. Rest参数的基本使用
function restParametersDemo() {
  console.log('=== Rest参数演示 ===')

  // 普通函数的arguments
  function regularFunction() {
    console.log('arguments:', arguments)
    console.log('arguments type:', typeof arguments)
    console.log('is array:', Array.isArray(arguments)) // false

    // 转换为数组
    const argsArray = Array.from(arguments)
    console.log('converted array:', argsArray)
  }

  // 箭头函数的rest参数
  const arrowFunction = (...args) => {
    console.log('rest args:', args)
    console.log('args type:', typeof args)
    console.log('is array:', Array.isArray(args)) // true

    // 直接使用数组方法
    const doubled = args.map(x => x * 2)
    console.log('doubled:', doubled)
  }

  regularFunction(1, 2, 3)
  arrowFunction(1, 2, 3)
}
```

```javascript
// 2. 高级参数处理技巧
function advancedParameterHandling() {
  console.log('=== 高级参数处理 ===')

  // 命名参数 + rest参数
  const processData = (operation, ...values) => {
    console.log(`Operation: ${operation}`)
    console.log(`Values: ${values}`)

    switch (operation) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0)
      case 'multiply':
        return values.reduce((a, b) => a * b, 1)
      case 'max':
        return Math.max(...values)
      default:
        return values
    }
  }

  // 解构 + rest参数
  const analyzeNumbers = ([first, second, ...rest]) => {
    return {
      first,
      second,
      remaining: rest,
      total: [first, second, ...rest].length,
      sum: [first, second, ...rest].reduce((a, b) => a + b, 0),
    }
  }

  // 对象解构 + rest
  const processUser = ({ name, age, ...otherProps }) => {
    return {
      displayName: name.toUpperCase(),
      isAdult: age >= 18,
      metadata: otherProps,
    }
  }

  // 测试
  console.log(processData('sum', 1, 2, 3, 4)) // 10
  console.log(analyzeNumbers([1, 2, 3, 4, 5]))
  console.log(processUser({ name: 'John', age: 25, city: 'NYC', country: 'USA' }))
}
```

```javascript
// 3. 实际应用场景
function practicalApplications() {
  console.log('=== 实际应用场景 ===')

  // 日志函数
  const logger = (level, ...messages) => {
    const timestamp = new Date().toISOString()
    const formattedMessages = messages.map(msg =>
      typeof msg === 'object' ? JSON.stringify(msg) : String(msg),
    )
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${formattedMessages.join(' ')}`)
  }

  // 数学工具函数
  const mathUtils = {
    average: (...numbers) => {
      if (numbers.length === 0) return 0
      return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
    },

    range: (start, end, ...steps) => {
      const step = steps.length > 0 ? steps[0] : 1
      const result = []
      for (let i = start; i <= end; i += step) {
        result.push(i)
      }
      return result
    },
  }

  // API调用包装器
  const apiCall = (endpoint, method = 'GET', ...middlewares) => {
    console.log(`Calling ${method} ${endpoint}`)

    // 应用中间件
    middlewares.forEach((middleware, index) => {
      console.log(`Applying middleware ${index + 1}`)
      middleware()
    })

    return Promise.resolve({ status: 'success', data: {} })
  }

  // 测试
  logger('info', 'User logged in', { userId: 123, timestamp: Date.now() })
  console.log('Average:', mathUtils.average(1, 2, 3, 4, 5)) // 3
  console.log('Range:', mathUtils.range(1, 10, 2)) // [1, 3, 5, 7, 9]

  apiCall(
    '/users',
    'GET',
    () => console.log('Auth middleware'),
    () => console.log('Logging middleware'),
  )
}
```

**记忆要点总结：**

- **Rest参数**：使用`...args`收集所有参数，返回真正的数组
- **优势**：比arguments更现代，支持数组方法，类型更明确
- **组合使用**：可与命名参数、解构参数、默认参数组合
- **实际应用**：日志函数、数学工具、API包装器等变参函数
- **最佳实践**：箭头函数中优先使用rest参数，避免访问外层arguments

### 解构赋值（10道）

# **062. [初级]** 什么是解构赋值？基本语法是什么？

解构赋值是将一个对象拆解并直接定义其中的键的方式

```javascript
const obj = {
  a: 1,
  bb: 2,
  c: () => {
    return 3
  },
  d: `hello`,
  e: { f: [4, 5, 6] },
}

const {
  a,
  bb: b,
  c,
  e: { f: fArr },
} = obj
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6解构赋值的基础语法，面试官想了解你是否掌握现代JavaScript的数据提取方式。

**知识点系统梳理：**

**解构赋值的定义：**

- 从数组或对象中提取值，赋给变量的语法糖
- 使代码更简洁、可读性更强
- 支持嵌套解构、默认值、重命名等高级特性

**基本语法形式：**

1. **数组解构** - `[a, b] = array`
2. **对象解构** - `{a, b} = object`
3. **嵌套解构** - `{a: {b}} = object`
4. **重命名** - `{a: newName} = object`

**实战应用举例：**

```javascript
// 1. 基础解构语法演示
function basicDestructuring() {
  console.log('=== 基础解构语法 ===')

  // 数组解构
  const numbers = [1, 2, 3, 4, 5]
  const [first, second, ...rest] = numbers
  console.log('First:', first) // 1
  console.log('Second:', second) // 2
  console.log('Rest:', rest) // [3, 4, 5]

  // 对象解构
  const user = {
    name: 'John',
    age: 25,
    email: 'john@example.com',
    address: {
      city: 'New York',
      country: 'USA',
    },
  }

  const { name, age, email } = user
  console.log('Name:', name) // 'John'
  console.log('Age:', age) // 25
  console.log('Email:', email) // 'john@example.com'

  // 重命名
  const { name: userName, age: userAge } = user
  console.log('User Name:', userName) // 'John'
  console.log('User Age:', userAge) // 25

  // 嵌套解构
  const {
    address: { city, country },
  } = user
  console.log('City:', city) // 'New York'
  console.log('Country:', country) // 'USA'
}
```

```javascript
// 2. 实际应用场景
function practicalUsage() {
  console.log('=== 实际应用场景 ===')

  // 函数参数解构
  const createUser = ({ name, age, email = 'no-email' }) => {
    return {
      id: Date.now(),
      name: name.toUpperCase(),
      age,
      email,
      createdAt: new Date(),
    }
  }

  // API响应处理
  const handleApiResponse = response => {
    const {
      data: { users, pagination },
      status,
      message,
    } = response

    console.log(`Status: ${status}`)
    console.log(`Message: ${message}`)
    console.log(`Users count: ${users.length}`)
    console.log(`Total pages: ${pagination.totalPages}`)

    return users.map(({ id, name, email }) => ({ id, name, email }))
  }

  // 交换变量
  let a = 1,
    b = 2
  ;[a, b] = [b, a]
  console.log('After swap - a:', a, 'b:', b) // a: 2, b: 1

  // 测试
  const newUser = createUser({ name: 'Alice', age: 30 })
  console.log('New user:', newUser)

  const mockResponse = {
    status: 'success',
    message: 'Data fetched successfully',
    data: {
      users: [
        { id: 1, name: 'John', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane', email: 'jane@example.com', role: 'user' },
      ],
      pagination: { page: 1, totalPages: 5, total: 50 },
    },
  }

  const processedUsers = handleApiResponse(mockResponse)
  console.log('Processed users:', processedUsers)
}
```

**记忆要点总结：**

- **基本语法**：数组用[]，对象用{}，支持嵌套和重命名
- **核心优势**：代码简洁、可读性强、减少临时变量
- **常用场景**：函数参数、API响应处理、变量交换、模块导入
- **注意事项**：解构时要确保结构匹配，避免undefined错误
- **最佳实践**：结合默认值使用，提高代码健壮性

# **063. [初级]** 数组解构赋值的常见用法

数据常见的解构是解构其中前几个或者后几个，其他值可以使用...rest 代替

## 深度分析与补充

**问题本质解读：** 这道题考察数组解构的具体用法，面试官想了解你是否掌握数组解构的各种实用技巧。

**知识点系统梳理：**

**数组解构的常见模式：**

1. **基础解构** - 按位置提取元素
2. **跳过元素** - 使用空位跳过不需要的元素
3. **Rest参数** - 收集剩余元素
4. **默认值** - 处理undefined情况
5. **嵌套解构** - 处理多维数组

**实战应用举例：**

```javascript
// 1. 数组解构的各种用法
function arrayDestructuringPatterns() {
  console.log('=== 数组解构模式 ===')

  const numbers = [1, 2, 3, 4, 5, 6]

  // 基础解构
  const [first, second] = numbers
  console.log('First two:', first, second) // 1, 2

  // 跳过元素
  const [, , third, , fifth] = numbers
  console.log('Third and fifth:', third, fifth) // 3, 5

  // Rest参数
  const [head, ...tail] = numbers
  console.log('Head:', head) // 1
  console.log('Tail:', tail) // [2, 3, 4, 5, 6]

  // 组合使用
  const [a, b, ...rest] = numbers
  console.log('a:', a, 'b:', b, 'rest:', rest) // 1, 2, [3, 4, 5, 6]

  // 默认值
  const [x = 0, y = 0, z = 0] = [10, 20]
  console.log('With defaults:', x, y, z) // 10, 20, 0

  // 嵌套数组解构
  const matrix = [
    [1, 2],
    [3, 4],
    [5, 6],
  ]
  const [[a1, a2], [b1, b2]] = matrix
  console.log('Matrix elements:', a1, a2, b1, b2) // 1, 2, 3, 4
}
```

```javascript
// 2. 实际应用场景
function practicalArrayDestructuring() {
  console.log('=== 实际应用场景 ===')

  // 函数返回多个值
  const getCoordinates = () => [10, 20, 30]
  const [x, y, z] = getCoordinates()
  console.log('Coordinates:', { x, y, z })

  // 字符串分割
  const fullName = 'John Doe Smith'
  const [firstName, lastName, ...middleNames] = fullName.split(' ')
  console.log('Name parts:', { firstName, lastName, middleNames })

  // 数组方法结合
  const users = [
    ['John', 25, 'Engineer'],
    ['Jane', 30, 'Designer'],
    ['Bob', 35, 'Manager'],
  ]

  const processedUsers = users.map(([name, age, role]) => ({
    name: name.toUpperCase(),
    age,
    role,
    isAdult: age >= 18,
  }))

  console.log('Processed users:', processedUsers)

  // 交换变量（经典用法）
  let a = 1,
    b = 2
  console.log('Before swap:', { a, b })
  ;[a, b] = [b, a]
  console.log('After swap:', { a, b })

  // 从数组中提取特定位置的元素
  const colors = ['red', 'green', 'blue', 'yellow', 'purple']
  const [primary, , tertiary, ...others] = colors
  console.log('Colors:', { primary, tertiary, others })

  // 处理函数参数
  const calculateStats = numbers => {
    const sorted = [...numbers].sort((a, b) => a - b)
    const [min, ...middle] = sorted
    const max = middle.pop() || min
    const median = middle.length > 0 ? middle[Math.floor(middle.length / 2)] : min

    return [min, max, median]
  }

  const [min, max, median] = calculateStats([5, 2, 8, 1, 9, 3])
  console.log('Stats:', { min, max, median })
}
```

**记忆要点总结：**

- **基础模式**：按位置解构，使用空位跳过元素
- **Rest参数**：`...rest`收集剩余元素，必须在最后
- **默认值**：`[a = defaultValue]`处理undefined情况
- **实用场景**：变量交换、函数返回值、字符串分割、数据处理
- **最佳实践**：结合数组方法使用，提高代码简洁性和可读性

# **064. [中级]** 对象解构赋值如何设置默认值？

在解构中使用 = 为解构的键赋值默认值

## 深度分析与补充

**问题本质解读：** 这道题考察对象解构中默认值的设置，面试官想了解你是否掌握处理缺失属性的安全方法。

**知识点系统梳理：**

**默认值的设置方式：**

1. **简单默认值** - `{a = defaultValue} = obj`
2. **重命名+默认值** - `{a: newName = defaultValue} = obj`
3. **嵌套默认值** - `{a: {b = defaultValue}} = obj`
4. **函数默认值** - 计算默认值

**默认值的触发条件：**

- 属性不存在时
- 属性值为undefined时
- null值不会触发默认值

**实战应用举例：**

```javascript
// 1. 各种默认值设置方式
function defaultValuePatterns() {
  console.log('=== 默认值设置模式 ===')

  const user = {
    name: 'John',
    age: 25,
    // email 属性不存在
  }

  // 简单默认值
  const { name, age, email = 'no-email@example.com' } = user
  console.log('Basic defaults:', { name, age, email })

  // 重命名 + 默认值
  const {
    name: userName = 'Anonymous',
    age: userAge = 0,
    email: userEmail = 'default@example.com',
  } = user
  console.log('Renamed with defaults:', { userName, userAge, userEmail })

  // 嵌套对象默认值
  const config = {
    api: {
      baseUrl: 'https://api.example.com',
      // timeout 属性不存在
    },
  }

  const {
    api: { baseUrl = 'http://localhost', timeout = 5000, retries = 3 } = {}, // 防止api属性不存在时报错
  } = config

  console.log('Nested defaults:', { baseUrl, timeout, retries })

  // 函数计算默认值
  const getCurrentTimestamp = () => {
    console.log('Computing default timestamp...')
    return Date.now()
  }

  const event = { name: 'Click Event' }
  const {
    name: eventName,
    timestamp = getCurrentTimestamp(), // 只在需要时计算
  } = event

  console.log('Computed default:', { eventName, timestamp })
}
```

```javascript
// 2. 实际应用场景
function practicalDefaultValues() {
  console.log('=== 实际应用场景 ===')

  // API配置处理
  const createApiClient = (options = {}) => {
    const {
      baseUrl = 'https://api.example.com',
      timeout = 10000,
      headers = {},
      auth: { type = 'none', token = null } = {},
      retry: { attempts = 3, delay = 1000 } = {},
    } = options

    return {
      baseUrl,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      auth: { type, token },
      retry: { attempts, delay },
    }
  }

  // 用户偏好设置
  const applyUserPreferences = (userPrefs = {}) => {
    const {
      theme = 'light',
      language = 'en',
      notifications: { email = true, push = false, sms = false } = {},
      privacy: { analytics = false, cookies = true } = {},
    } = userPrefs

    return {
      theme,
      language,
      notifications: { email, push, sms },
      privacy: { analytics, cookies },
    }
  }

  // 表单数据处理
  const processFormData = formData => {
    const {
      personalInfo: { firstName = '', lastName = '', email = '', phone = null } = {},
      preferences: { newsletter = false, marketing = false } = {},
      metadata: { source = 'direct', campaign = null, timestamp = Date.now() } = {},
    } = formData

    return {
      fullName: `${firstName} ${lastName}`.trim() || 'Anonymous',
      contact: { email, phone },
      preferences: { newsletter, marketing },
      metadata: { source, campaign, timestamp },
    }
  }

  // 测试
  const apiClient1 = createApiClient()
  console.log('Default API client:', apiClient1)

  const apiClient2 = createApiClient({
    baseUrl: 'https://custom-api.com',
    auth: { type: 'bearer', token: 'abc123' },
  })
  console.log('Custom API client:', apiClient2)

  const prefs = applyUserPreferences({
    theme: 'dark',
    notifications: { email: false },
  })
  console.log('User preferences:', prefs)

  const form = processFormData({
    personalInfo: { firstName: 'John', email: 'john@example.com' },
    preferences: { newsletter: true },
  })
  console.log('Processed form:', form)
}
```

**记忆要点总结：**

- **基本语法**：`{prop = defaultValue} = obj`设置默认值
- **触发条件**：属性不存在或值为undefined时使用默认值
- **嵌套处理**：`{a: {b = default} = {}} = obj`防止嵌套错误
- **计算默认值**：支持函数调用，只在需要时执行
- **实际应用**：API配置、用户偏好、表单处理等场景

# **065. [中级]** 如何解构嵌套对象？

使用{} 展开

## 深度分析与补充

**问题本质解读：** 这道题考察嵌套对象解构的技巧，面试官想了解你是否掌握复杂数据结构的解构方法。

**技术错误纠正：**

1. "使用{}展开"表述不准确，应该是"使用嵌套的{}语法"
2. 缺少具体的语法说明和实际应用

**知识点系统梳理：**

**嵌套解构的语法模式：**

1. **基础嵌套** - `{a: {b}} = obj`
2. **重命名嵌套** - `{a: {b: newName}} = obj`
3. **默认值嵌套** - `{a: {b = default} = {}} = obj`
4. **深层嵌套** - 多层级对象解构
5. **数组对象混合** - 复杂结构解构

**实战应用举例：**

```javascript
// 1. 嵌套对象解构的各种模式
function nestedDestructuringPatterns() {
  console.log('=== 嵌套解构模式 ===')

  const user = {
    id: 1,
    name: 'John',
    profile: {
      avatar: 'avatar.jpg',
      bio: 'Software Developer',
      social: {
        twitter: '@john',
        github: 'john-dev',
      },
    },
    settings: {
      theme: 'dark',
      notifications: {
        email: true,
        push: false,
      },
    },
  }

  // 基础嵌套解构
  const {
    name,
    profile: {
      avatar,
      bio,
      social: { twitter, github },
    },
  } = user

  console.log('Basic nested:', { name, avatar, bio, twitter, github })

  // 重命名 + 嵌套
  const {
    profile: {
      avatar: userAvatar,
      social: { twitter: twitterHandle, github: githubUsername },
    },
  } = user

  console.log('Renamed nested:', { userAvatar, twitterHandle, githubUsername })

  // 默认值 + 嵌套（防止属性不存在）
  const {
    settings: {
      theme = 'light',
      notifications: { email = false, push = false, sms = false } = {},
    } = {},
  } = user

  console.log('With defaults:', { theme, email, push, sms })
}
```

```javascript
// 2. 复杂数据结构的实际应用
function complexDataStructures() {
  console.log('=== 复杂数据结构解构 ===')

  // API响应数据解构
  const apiResponse = {
    status: 'success',
    data: {
      users: [
        {
          id: 1,
          name: 'Alice',
          address: {
            street: '123 Main St',
            city: 'New York',
            coordinates: { lat: 40.7128, lng: -74.006 },
          },
        },
        {
          id: 2,
          name: 'Bob',
          address: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            coordinates: { lat: 34.0522, lng: -118.2437 },
          },
        },
      ],
      pagination: {
        page: 1,
        totalPages: 5,
        hasNext: true,
      },
    },
  }

  // 解构API响应
  const {
    status,
    data: {
      users: [
        {
          name: firstName,
          address: {
            city: firstCity,
            coordinates: { lat: firstLat, lng: firstLng },
          },
        },
        {
          name: secondName,
          address: { city: secondCity },
        },
      ],
      pagination: { page, totalPages, hasNext },
    },
  } = apiResponse

  console.log('API data:', {
    status,
    firstName,
    firstCity,
    coordinates: { lat: firstLat, lng: firstLng },
    secondName,
    secondCity,
    pagination: { page, totalPages, hasNext },
  })

  // 配置对象解构
  const appConfig = {
    api: {
      endpoints: {
        users: '/api/users',
        posts: '/api/posts',
      },
      auth: {
        type: 'jwt',
        config: {
          secret: 'secret-key',
          expiresIn: '1h',
        },
      },
    },
    ui: {
      theme: {
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
        },
      },
    },
  }

  const {
    api: {
      endpoints: { users: usersEndpoint, posts: postsEndpoint },
      auth: {
        type: authType,
        config: { secret, expiresIn },
      },
    },
    ui: {
      theme: {
        colors: { primary: primaryColor, secondary: secondaryColor },
      },
    },
  } = appConfig

  console.log('Config:', {
    endpoints: { users: usersEndpoint, posts: postsEndpoint },
    auth: { type: authType, secret, expiresIn },
    colors: { primary: primaryColor, secondary: secondaryColor },
  })
}
```

**记忆要点总结：**

- **语法规则**：使用嵌套的{}语法，层级对应对象结构
- **安全解构**：使用`= {}`防止中间层级不存在时报错
- **组合使用**：可与重命名、默认值、数组解构组合
- **实际应用**：API响应处理、配置对象解构、复杂数据提取
- **最佳实践**：保持解构层级清晰，避免过度嵌套影响可读性

# **066. [中级]** 解构赋值在函数参数中的应用

为参数设置默认值

## 深度分析与补充

**问题本质解读：** 这道题考察函数参数解构的实用技巧，面试官想了解你是否掌握现代函数参数处理方式。

**知识点系统梳理：**

**函数参数解构的优势：**

1. **命名参数** - 提高函数调用的可读性
2. **默认值** - 简化参数验证逻辑
3. **可选参数** - 灵活的参数传递
4. **参数验证** - 结构化的参数检查

**常见模式：**

- 对象参数解构
- 数组参数解构
- 嵌套参数解构
- Rest参数结合

**实战应用举例：**

```javascript
// 1. 函数参数解构的基本模式
function functionParameterDestructuring() {
  console.log('=== 函数参数解构 ===')

  // 对象参数解构
  const createUser = ({ name, age, email = 'no-email', role = 'user' }) => {
    return {
      id: Date.now(),
      name: name.toUpperCase(),
      age,
      email,
      role,
      createdAt: new Date().toISOString(),
    }
  }

  // 数组参数解构
  const calculateDistance = ([x1, y1], [x2, y2]) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // 嵌套参数解构
  const processOrder = ({
    customer: { name, email },
    items,
    shipping: { address, method = 'standard' } = {},
    payment: { type, amount },
  }) => {
    return {
      customerInfo: { name, email },
      itemCount: items.length,
      shippingInfo: { address, method },
      paymentInfo: { type, amount },
      total: amount,
    }
  }

  // 测试
  const user = createUser({ name: 'John', age: 25 })
  console.log('Created user:', user)
  // { id: 1633036800000, name: 'JOHN', age: 25, email: 'no-email', role: 'user', createdAt: '2021-10-01T00:00:00.000Z' }

  const distance = calculateDistance([0, 0], [3, 4])
  console.log('Distance:', distance) // 5

  const order = processOrder({
    customer: { name: 'Alice', email: 'alice@example.com' },
    items: ['item1', 'item2'],
    shipping: { address: '123 Main St' },
    payment: { type: 'credit', amount: 99.99 },
  })
  console.log('Processed order:', order) // { customerInfo: { name: 'Alice', email: 'alice@example.com' }, itemCount: 2, shippingInfo: { address: '123 Main St', method: 'standard' }, paymentInfo: { type: 'credit', amount: 99.99 }, total: 99.99 }
}
```

```javascript
// 2. 高级应用场景
function advancedParameterDestructuring() {
  console.log('=== 高级参数解构应用 ===')

  // API端点函数
  const apiRequest = async ({
    url,
    method = 'GET',
    headers = {},
    body = null,
    timeout = 5000,
    retries = 3,
  }) => {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout,
      retries,
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    console.log(`Making ${method} request to ${url}`, config)
    return { status: 'success', data: {} }
  }

  // 数据库查询函数
  const queryDatabase = ({
    table,
    select = ['*'],
    where = {},
    orderBy = [],
    limit = null,
    offset = 0,
  }) => {
    const query = {
      table,
      select: Array.isArray(select) ? select : [select],
      where,
      orderBy: Array.isArray(orderBy) ? orderBy : [orderBy],
      limit,
      offset,
    }

    console.log('Database query:', query)
    return { rows: [], count: 0 }
  }

  // React组件风格的函数
  const renderUserCard = ({
    user: { name, avatar, bio },
    settings: { showBio = true, theme = 'light' } = {},
    onClick = () => {},
    className = '',
  }) => {
    return {
      type: 'UserCard',
      props: {
        name,
        avatar,
        bio: showBio ? bio : null,
        theme,
        onClick,
        className,
      },
    }
  }

  // 测试
  apiRequest({
    url: '/api/users',
    method: 'POST',
    body: { name: 'John' },
    headers: { Authorization: 'Bearer token' },
  })

  queryDatabase({
    table: 'users',
    select: ['id', 'name', 'email'],
    where: { active: true },
    orderBy: ['created_at'],
    limit: 10,
  })

  const userCard = renderUserCard({
    user: { name: 'John', avatar: 'avatar.jpg', bio: 'Developer' },
    settings: { showBio: true, theme: 'dark' },
    onClick: () => console.log('Card clicked'),
  })
  console.log('User card:', userCard)
}
```

**记忆要点总结：**

- **命名参数**：使用对象解构实现命名参数，提高可读性
- **默认值**：在解构中设置默认值，简化参数处理
- **可选参数**：通过解构实现灵活的可选参数
- **实际应用**：API函数、数据库查询、组件渲染等场景
- **最佳实践**：合理使用默认值，保持参数结构清晰

# **067. [中级]** 如何交换两个变量的值（使用解构）？

```javascript
;[x, y] = [y, x]
```

## 深度分析与补充

**问题本质解读：** 这道题考察解构赋值的经典应用，面试官想了解你是否掌握变量交换的现代方法。

**技术错误纠正：**

1. 代码示例中应该使用`let`而不是`const`，因为要重新赋值
2. 正确语法应该是`[x, y] = [y, x]`

**知识点系统梳理：**

**变量交换的方法对比：**

1. **传统方法** - 使用临时变量
2. **算术方法** - 加减法交换（有溢出风险）
3. **位运算方法** - 异或操作
4. **解构方法** - 现代推荐方式

**解构交换的优势：**

- 代码简洁明了
- 不需要临时变量
- 支持多个变量同时交换

**实战应用举例：**

```javascript
// 1. 各种变量交换方法对比
function variableSwapMethods() {
  console.log('=== 变量交换方法对比 ===')

  // 传统方法：临时变量
  let a1 = 1,
    b1 = 2
  console.log('Before traditional swap:', { a1, b1 })
  let temp = a1
  a1 = b1
  b1 = temp
  console.log('After traditional swap:', { a1, b1 }) // { a1: 2, b1: 1 }

  // 解构方法（推荐）
  let a2 = 1,
    b2 = 2
  console.log('Before destructuring swap:', { a2, b2 })
  ;[a2, b2] = [b2, a2]
  console.log('After destructuring swap:', { a2, b2 })

  // 多变量交换
  let x = 1,
    y = 2,
    z = 3
  console.log('Before multi-swap:', { x, y, z })
  ;[x, y, z] = [z, x, y] // 循环交换
  console.log('After multi-swap:', { x, y, z })
  // { x: 3, y: 1, z: 2 }

  // 数组元素交换
  const arr = [1, 2, 3, 4, 5]
  console.log('Before array swap:', arr)
  ;[arr[0], arr[4]] = [arr[4], arr[0]] // 交换首尾元素
  console.log('After array swap:', arr)
  // { arr: [5, 2, 3, 4, 1] }
}
```

```javascript
// 2. 实际应用场景
function practicalSwapApplications() {
  console.log('=== 实际应用场景 ===')

  // 排序算法中的元素交换
  const bubbleSort = arr => {
    const result = [...arr] // 创建副本
    const n = result.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          // 使用解构交换元素
          ;[result[j], result[j + 1]] = [result[j + 1], result[j]]
        }
      }
    }

    return result
  }

  // 数组随机打乱（Fisher-Yates算法）
  const shuffleArray = arr => {
    const result = [...arr]

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }

    return result
  }

  // 对象属性交换
  const swapObjectProperties = (obj, key1, key2) => {
    ;[obj[key1], obj[key2]] = [obj[key2], obj[key1]]
    return obj
  }

  // 坐标点交换
  const swapCoordinates = point => {
    ;[point.x, point.y] = [point.y, point.x]
    return point
  }

  // 测试
  const numbers = [64, 34, 25, 12, 22, 11, 90]
  console.log('Original array:', numbers) // [64, 34, 25, 12, 22, 11, 90]
  console.log('Sorted array:', bubbleSort(numbers)) // [11, 12, 22, 25, 34, 64, 90]
  console.log('Shuffled array:', shuffleArray(numbers)) // [25, 12, 90, 64, 34, 11, 22]

  const user = { name: 'John', role: 'admin' }
  console.log('Before property swap:', user)
  swapObjectProperties(user, 'name', 'role')
  console.log('After property swap:', user) // { name: 'admin', role: 'John' }

  const point = { x: 10, y: 20 }
  console.log('Before coordinate swap:', point)
  swapCoordinates(point)
  console.log('After coordinate swap:', point) // { x: 20, y: 10 }
}
```

**记忆要点总结：**

- **基本语法**：`[a, b] = [b, a]`实现两个变量交换
- **多变量交换**：`[x, y, z] = [z, x, y]`支持多个变量
- **数组元素交换**：`[arr[i], arr[j]] = [arr[j], arr[i]]`
- **实际应用**：排序算法、数组打乱、属性交换等场景
- **优势**：代码简洁、无需临时变量、支持复杂交换模式

# **068. [中级]** 字符串解构赋值的用法

```javascript
let str = 'abcdefghijklnmopqrstvuwxyz'
const [...keys] = str
```

## 深度分析与补充

**问题本质解读：** 这道题考察字符串解构的特殊用法，面试官想了解你是否理解字符串的类数组特性。

**技术错误纠正：**

1. 代码示例有误，字符串解构应该使用数组语法`[...]`而不是对象语法`{...}`
2. 正确的语法应该是`const [...chars] = str`或`const [a, b, c] = str`

**知识点系统梳理：**

**字符串解构的特点：**

- 字符串具有类数组特性，可以按索引访问
- 支持数组解构语法
- 可以结合rest参数使用
- 支持默认值和跳过字符

**常见用法：**

1. 提取特定位置字符
2. 分离首字符和剩余字符
3. 字符串转数组
4. 模式匹配

**实战应用举例：**

```javascript
// 1. 字符串解构的基本用法
function stringDestructuringBasics() {
  console.log('=== 字符串解构基础 ===')

  const str = 'Hello World'

  // 提取特定位置的字符
  const [first, second, third] = str
  console.log('First three chars:', { first, second, third }) // 'H', 'e', 'l'

  // 跳过字符
  const [, , , , , space, w] = str
  console.log('Space and W:', { space, w }) // ' ', 'W'

  // 使用rest参数
  const [firstChar, ...restChars] = str
  console.log('First char:', firstChar) // 'H'
  console.log('Rest chars:', restChars) // ['e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd']

  // 提取前几个字符
  const [a, b, c, ...remaining] = str
  console.log('ABC and remaining:', { a, b, c, remaining })
  // { a: 'H', b: 'e', c: 'l', remaining: ['l', 'o', ' ', 'W', 'o', 'r', 'l', 'd'] }

  // 默认值（当字符串长度不足时）
  const shortStr = 'Hi'
  const [x, y, z = '?'] = shortStr
  console.log('With default:', { x, y, z }) // 'H', 'i', '?'
}
```

```javascript
// 2. 实际应用场景
function stringDestructuringApplications() {
  console.log('=== 字符串解构应用 ===')

  // 文件扩展名提取
  const extractFileInfo = filename => {
    const parts = filename.split('.')
    const [name, ...extensionParts] = parts
    const extension = extensionParts.join('.')

    // 提取文件名首字母
    const [firstLetter] = name

    return {
      name,
      extension,
      firstLetter: firstLetter.toUpperCase(),
      isImage: ['jpg', 'png', 'gif', 'webp'].includes(extension.toLowerCase()),
    }
  }

  // 版本号解析
  const parseVersion = version => {
    const [major, minor, patch, ...prerelease] = version.split(/[.-]/)

    return {
      major: parseInt(major) || 0,
      minor: parseInt(minor) || 0,
      patch: parseInt(patch) || 0,
      prerelease: prerelease.join('-') || null,
    }
  }

  // 首字母缩写生成
  const generateInitials = fullName => {
    const words = fullName.trim().split(/\s+/)
    const initials = words.map(word => {
      const [firstChar] = word
      return firstChar.toUpperCase()
    })

    return initials.join('')
  }

  // 字符串模式匹配
  const analyzeString = input => {
    const [first, second, ...rest] = input

    return {
      startsWithVowel: 'aeiouAEIOU'.includes(first),
      secondChar: second,
      length: input.length,
      restLength: rest.length,
      pattern: `${first}${second || ''}${rest.length > 0 ? '...' : ''}`,
    }
  }

  // 测试
  console.log('File info:', extractFileInfo('document.pdf'))
  console.log('File info:', extractFileInfo('image.jpg'))

  console.log('Version:', parseVersion('1.2.3-beta.1'))
  console.log('Version:', parseVersion('2.0.0'))

  console.log('Initials:', generateInitials('John Doe Smith'))
  console.log('Initials:', generateInitials('Alice'))

  console.log('String analysis:', analyzeString('Hello'))
  console.log('String analysis:', analyzeString('A'))
  console.log('String analysis:', analyzeString(''))
}
```

**记忆要点总结：**

- **基本语法**：`const [a, b, c] = string`按位置提取字符
- **Rest参数**：`const [first, ...rest] = string`分离首字符和剩余
- **跳过字符**：使用空位跳过不需要的字符
- **实际应用**：文件名解析、版本号处理、首字母提取、模式匹配
- **注意事项**：字符串解构使用数组语法，不是对象语法

# **069. [高级]** 解构赋值的剩余模式（rest pattern）

将对象的其他内容（除解构的部分的键值）全部归到剩余对象中

- rest参数必须是最后一个，使用`...`语法

## 深度分析与补充

**问题本质解读：** 这道题考察rest模式的高级用法，面试官想了解你是否掌握剩余参数在解构中的应用。

**知识点系统梳理：**

**Rest模式的语法：**

1. **对象rest** - `const {a, ...rest} = obj`
2. **数组rest** - `const [first, ...rest] = arr`
3. **嵌套rest** - 在嵌套解构中使用rest
4. **函数参数rest** - 在参数解构中使用

**Rest模式的特点：**

- 必须是最后一个元素
- 收集剩余的属性/元素
- 创建新的对象/数组
- 支持深拷贝效果

**实战应用举例：**

```javascript
// 1. Rest模式的基本用法
function restPatternBasics() {
  console.log('=== Rest模式基础 ===')

  // 对象rest模式
  const user = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    age: 25,
    role: 'admin',
    lastLogin: '2023-01-01',
  }

  // 提取特定属性，其余放入rest
  const { id, name, ...userDetails } = user
  console.log('ID and name:', { id, name })
  console.log('User details:', userDetails) // { email, age, role, lastLogin }

  // 数组rest模式
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [first, second, ...remaining] = numbers
  console.log('First two:', { first, second })
  console.log('Remaining:', remaining) // [3, 4, 5, 6, 7, 8, 9, 10]

  // 嵌套对象中的rest
  const config = {
    api: {
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
      headers: { 'Content-Type': 'application/json' },
    },
    ui: {
      theme: 'dark',
      language: 'en',
    },
  }

  const {
    api: { baseUrl, ...apiConfig },
    ...otherConfig
  } = config

  console.log('Base URL:', baseUrl)
  console.log('API config:', apiConfig)
  console.log('Other config:', otherConfig)
}
```

```javascript
// 2. 实际应用场景
function restPatternApplications() {
  console.log('=== Rest模式实际应用 ===')

  // 属性过滤和清理
  const sanitizeUser = user => {
    const { password, internalId, ...publicUser } = user
    return publicUser
  }

  // 表单数据处理
  const processFormData = formData => {
    const { submit, reset, ...actualData } = formData

    return {
      data: actualData,
      hasSubmitAction: Boolean(submit),
      hasResetAction: Boolean(reset),
    }
  }

  // 配置合并
  const mergeConfigs = (defaultConfig, userConfig) => {
    const { override, ...userSettings } = userConfig

    if (override) {
      return userSettings
    }

    return { ...defaultConfig, ...userSettings }
  }

  // 数组分组
  const groupArray = (arr, groupSize) => {
    const groups = []
    let remaining = [...arr]

    while (remaining.length > 0) {
      const group = remaining.splice(0, groupSize)
      groups.push(group)
    }

    return groups
  }

  // 对象属性分类
  const categorizeProperties = obj => {
    const stringProps = {}
    const numberProps = {}
    const otherProps = {}

    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        stringProps[key] = value
      } else if (typeof value === 'number') {
        numberProps[key] = value
      } else {
        otherProps[key] = value
      }
    })

    return { stringProps, numberProps, otherProps }
  }

  // 测试
  const rawUser = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    password: 'secret123',
    internalId: 'internal-123',
  }

  console.log('Sanitized user:', sanitizeUser(rawUser))

  const formData = {
    name: 'John',
    email: 'john@example.com',
    age: 25,
    submit: true,
    reset: false,
  }

  console.log('Processed form:', processFormData(formData))

  const defaultConfig = { theme: 'light', timeout: 5000 }
  const userConfig = { theme: 'dark', language: 'en', override: false }

  console.log('Merged config:', mergeConfigs(defaultConfig, userConfig))

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  console.log('Grouped array:', groupArray(numbers, 3))

  const mixedObj = {
    name: 'John',
    age: 25,
    active: true,
    score: 95.5,
    tags: ['user', 'premium'],
  }

  console.log('Categorized props:', categorizeProperties(mixedObj))
}
```

**记忆要点总结：**

- **语法规则**：rest参数必须是最后一个，使用`...`语法
- **对象rest**：收集剩余属性到新对象中
- **数组rest**：收集剩余元素到新数组中
- **实际应用**：属性过滤、数据清理、配置合并、数组分组
- **注意事项**：rest操作创建新对象/数组，不影响原始数据

# **070. [中级]** 如何解构赋值并重命名变量？

将解构的值使用 ： 冒号后面的键就是重命名的键

## 深度分析与补充

**问题本质解读：** 这道题考察解构重命名的语法，面试官想了解你是否掌握变量重命名的技巧。

**知识点系统梳理：**

**重命名语法：**

- **基本重命名** - `{oldName: newName} = obj`
- **重命名+默认值** - `{oldName: newName = default} = obj`
- **嵌套重命名** - `{obj: {prop: newName}} = data`
- **数组重命名** - 数组解构不支持重命名，只能按位置

**重命名的使用场景：**

1. 避免变量名冲突
2. 使用更语义化的变量名
3. 适配不同的命名规范
4. 简化长属性名

**实战应用举例：**

```javascript
// 1. 重命名的基本用法
function renamingBasics() {
  console.log('=== 重命名基础用法 ===')

  const user = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    created_at: '2023-01-01',
    is_active: true,
  }

  // 基本重命名
  const { id: userId, name: userName, email: userEmail } = user

  console.log('Renamed variables:', { userId, userName, userEmail })

  // 重命名 + 默认值
  const {
    created_at: createdDate = 'unknown',
    is_active: isActive = false,
    last_login: lastLogin = null,
  } = user

  console.log('With defaults:', { createdDate, isActive, lastLogin })

  // 嵌套对象重命名
  const response = {
    data: {
      user: {
        profile: {
          first_name: 'John',
          last_name: 'Doe',
        },
      },
    },
    meta: {
      total_count: 100,
    },
  }

  const {
    data: {
      user: {
        profile: { first_name: firstName, last_name: lastName },
      },
    },
    meta: { total_count: totalUsers },
  } = response

  console.log('Nested renamed:', { firstName, lastName, totalUsers })
}
```

```javascript
// 2. 实际应用场景
function renamingApplications() {
  console.log('=== 重命名实际应用 ===')

  // API响应数据转换
  const transformApiResponse = apiData => {
    const {
      user_id: id,
      user_name: name,
      email_address: email,
      phone_number: phone,
      created_timestamp: createdAt,
      is_verified: verified = false,
    } = apiData

    return {
      id,
      name,
      email,
      phone,
      createdAt: new Date(createdAt),
      verified,
    }
  }

  // 配置对象重命名
  const processConfig = config => {
    const {
      api_base_url: baseUrl,
      request_timeout: timeout,
      max_retries: retries,
      enable_logging: logging = false,
      cache_duration: cacheTTL = 300,
    } = config

    return {
      api: { baseUrl, timeout, retries },
      features: { logging },
      cache: { ttl: cacheTTL },
    }
  }

  // 数据库查询结果处理
  const processDbResult = row => {
    const {
      id: recordId,
      title: postTitle,
      content: postContent,
      author_id: authorId,
      created_at: publishedDate,
      updated_at: lastModified,
      view_count: views = 0,
      like_count: likes = 0,
    } = row

    return {
      id: recordId,
      title: postTitle,
      content: postContent,
      author: { id: authorId },
      dates: {
        published: publishedDate,
        modified: lastModified,
      },
      stats: { views, likes },
    }
  }

  // 表单数据标准化
  const normalizeFormData = formData => {
    const {
      firstName: first,
      lastName: last,
      emailAddress: email,
      phoneNumber: phone,
      dateOfBirth: birthDate,
      agreeToTerms: termsAccepted = false,
    } = formData

    return {
      personalInfo: {
        name: { first, last },
        contact: { email, phone },
        birthDate,
      },
      consent: { termsAccepted },
    }
  }

  // 测试
  const apiData = {
    user_id: 123,
    user_name: 'john_doe',
    email_address: 'john@example.com',
    phone_number: '+1234567890',
    created_timestamp: '2023-01-01T00:00:00Z',
    is_verified: true,
  }

  console.log('Transformed API data:', transformApiResponse(apiData))

  const config = {
    api_base_url: 'https://api.example.com',
    request_timeout: 5000,
    max_retries: 3,
    enable_logging: true,
  }

  console.log('Processed config:', processConfig(config))

  const dbRow = {
    id: 1,
    title: 'Sample Post',
    content: 'This is a sample post content',
    author_id: 123,
    created_at: '2023-01-01',
    updated_at: '2023-01-02',
    view_count: 150,
    like_count: 25,
  }

  console.log('Processed DB result:', processDbResult(dbRow))
}
```

**记忆要点总结：**

- **基本语法**：`{oldName: newName} = obj`进行属性重命名
- **组合使用**：可与默认值、嵌套解构组合使用
- **实际应用**：API数据转换、配置处理、数据库结果映射
- **命名规范**：从snake_case转camelCase，简化长属性名
- **注意事项**：数组解构不支持重命名，只能按位置解构

# **071. [中级]** 解构赋值在React props中的应用

## 深度分析与补充

**问题本质解读：** 这道题考察解构在React开发中的实际应用，面试官想了解你是否掌握现代React开发的最佳实践。

**知识点系统梳理：**

**React中解构的应用场景：**

1. **Props解构** - 简化组件参数访问
2. **State解构** - 简化状态管理
3. **Hook解构** - useState、useEffect等
4. **Event解构** - 事件对象属性提取

**解构的优势：**

- 代码更简洁
- 提高可读性
- 减少重复代码
- 明确依赖关系

**实战应用举例：**

```javascript
// 1. React组件中的Props解构
function ReactPropsDestructuring() {
  console.log('=== React Props解构 ===')

  // 函数组件Props解构
  const UserCard = ({
    user: { name, email, avatar },
    settings: { showEmail = true, theme = 'light' } = {},
    onEdit,
    onDelete,
    className = '',
    ...otherProps
  }) => {
    return {
      type: 'div',
      className: `user-card ${theme} ${className}`,
      children: [
        { type: 'img', src: avatar, alt: name },
        { type: 'h3', children: name },
        showEmail && { type: 'p', children: email },
        {
          type: 'div',
          className: 'actions',
          children: [
            { type: 'button', onClick: onEdit, children: 'Edit' },
            { type: 'button', onClick: onDelete, children: 'Delete' },
          ],
        },
      ],
      ...otherProps,
    }
  }

  // 类组件Props解构
  class UserProfile {
    render() {
      const {
        user: { id, name, bio },
        permissions: { canEdit, canDelete } = {},
        onUpdate = () => {},
        children,
        ...restProps
      } = this.props

      return {
        type: 'div',
        className: 'user-profile',
        children: [
          { type: 'h2', children: name },
          { type: 'p', children: bio },
          canEdit && {
            type: 'button',
            onClick: () => onUpdate(id),
            children: 'Edit Profile',
          },
          children,
        ],
        ...restProps,
      }
    }
  }

  // Hook中的解构
  const useUserData = userId => {
    // 模拟useState和useEffect
    const [state, setState] = [
      { user: null, loading: true, error: null },
      newState => console.log('State updated:', newState),
    ]

    const { user, loading, error } = state

    return { user, loading, error, refetch: () => {} }
  }

  // 使用示例
  const userData = {
    user: { name: 'John', email: 'john@example.com', avatar: 'avatar.jpg' },
    settings: { showEmail: true, theme: 'dark' },
  }

  const userCard = UserCard({
    ...userData,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  })

  console.log('User card component:', userCard)
}
```

```javascript
// 2. 高级React模式中的解构
function advancedReactPatterns() {
  console.log('=== 高级React解构模式 ===')

  // 自定义Hook中的解构
  const useApi = (url, options = {}) => {
    const { method = 'GET', headers = {}, body = null, autoFetch = true } = options

    // 模拟API状态
    const state = {
      data: null,
      loading: false,
      error: null,
    }

    const { data, loading, error } = state

    const fetchData = async (overrideOptions = {}) => {
      const { method: overrideMethod = method, body: overrideBody = body } = overrideOptions

      console.log(`Fetching ${overrideMethod} ${url}`, {
        headers,
        body: overrideBody,
      })

      return { success: true, data: {} }
    }

    return { data, loading, error, fetchData, refetch: fetchData }
  }

  // Context Provider中的解构
  const createThemeProvider = initialTheme => {
    return ({ children, ...props }) => {
      const [theme, setTheme] = [
        initialTheme,
        newTheme => {
          console.log('Theme changed to:', newTheme)
        },
      ]

      const value = {
        theme,
        setTheme,
        toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
      }

      return {
        type: 'ThemeContext.Provider',
        value,
        children,
        ...props,
      }
    }
  }

  // 表单处理中的解构
  const useForm = (initialValues = {}) => {
    const [values, setValues] = [
      initialValues,
      newValues => {
        console.log('Form values updated:', newValues)
      },
    ]

    const handleChange = ({ target: { name, value, type, checked } }) => {
      const newValue = type === 'checkbox' ? checked : value
      setValues({ ...values, [name]: newValue })
    }

    const handleSubmit = onSubmit => event => {
      event.preventDefault()
      const { target } = event
      const formData = new FormData(target)

      // 解构表单数据
      const data = {}
      for (const [key, value] of formData.entries()) {
        data[key] = value
      }

      onSubmit(data)
    }

    return { values, handleChange, handleSubmit }
  }

  // 测试
  const { data, loading, error, fetchData } = useApi('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  console.log('API hook result:', { data, loading, error })

  const ThemeProvider = createThemeProvider('light')
  const provider = ThemeProvider({ children: 'App content' })
  console.log('Theme provider:', provider)

  const form = useForm({ name: '', email: '' })
  console.log('Form hook:', form)
}
```

**记忆要点总结：**

- **Props解构**：在函数组件参数中直接解构props，提高可读性
- **嵌套解构**：解构复杂的props结构，如user对象、settings对象
- **默认值**：为可选props设置默认值，增强组件健壮性
- **Rest参数**：使用...otherProps传递剩余属性
- **Hook解构**：useState、useEffect等Hook返回值的解构使用

### 模板字符串（6道）

# **072. [初级]** 什么是模板字符串？如何使用？

```javascript
let key = 'world'
const hello = key => `hello ${key}`
const arr = [5, 2, 8, 3, 12, 100]
const maxAndMinNum = (arr = []) =>
  `max number is ${Math.max(...arr)}; min number is ${Math.min(...arr)}`
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6模板字符串的基础语法，面试官想了解你是否掌握现代字符串处理方式。

**技术错误纠正：**

1. `Math.max(arr)`和`Math.min(arr)`有误，应该使用展开运算符：`Math.max(...arr)`
2. 缺少模板字符串的完整特性说明

**知识点系统梳理：**

**模板字符串的特点：**

1. **反引号语法** - 使用``包围字符串
2. **变量插值** - `${expression}`插入表达式
3. **多行支持** - 保持换行和缩进
4. **表达式计算** - 支持任意JavaScript表达式
5. **标签模板** - 高级用法，自定义处理逻辑

**实战应用举例：**

```javascript
// 1. 模板字符串的基本用法
function templateStringBasics() {
  console.log('=== 模板字符串基础 ===')

  const name = 'John'
  const age = 25
  const city = 'New York'

  // 基本变量插值
  const greeting = `Hello, my name is ${name}`
  console.log(greeting)

  // 表达式计算
  const info = `I am ${age} years old, born in ${2024 - age}`
  console.log(info)

  // 函数调用
  const location = `I live in ${city.toUpperCase()}`
  console.log(location)

  // 复杂表达式
  const numbers = [1, 2, 3, 4, 5]
  const stats = `Array: [${numbers.join(', ')}], Sum: ${numbers.reduce((a, b) => a + b, 0)}`
  console.log(stats)
  // Array: [1, 2, 3, 4, 5], Sum: 15

  // 条件表达式
  const status = `User is ${age >= 18 ? 'adult' : 'minor'}`
  console.log(status)

  // 对象属性访问
  const user = { name: 'Alice', role: 'admin' }
  const userInfo = `Welcome ${user.name}, you are logged in as ${user.role}`
  console.log(userInfo)
}
```

```javascript
// 2. 实际应用场景
function templateStringApplications() {
  console.log('=== 模板字符串实际应用 ===')

  // HTML模板生成
  const createUserCard = user => {
    return `
      <div class="user-card">
        <img src="${user.avatar}" alt="${user.name}">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <span class="role ${user.role}">${user.role.toUpperCase()}</span>
        <div class="stats">
          <span>Posts: ${user.posts || 0}</span>
          <span>Followers: ${user.followers || 0}</span>
        </div>
      </div>
    `
  }

  // SQL查询构建
  const buildQuery = ({ table, fields = ['*'], where = {}, limit = null }) => {
    const fieldList = Array.isArray(fields) ? fields.join(', ') : fields
    const whereClause =
      Object.keys(where).length > 0
        ? `WHERE ${Object.entries(where)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(' AND ')}`
        : ''
    const limitClause = limit ? `LIMIT ${limit}` : ''

    return `SELECT ${fieldList} FROM ${table} ${whereClause} ${limitClause}`.trim()
  }

  // API URL构建
  const buildApiUrl = (baseUrl, endpoint, params = {}) => {
    const queryString =
      Object.keys(params).length > 0
        ? `?${Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')}`
        : ''

    return `${baseUrl}${endpoint}${queryString}`
  }

  // 日志格式化
  const formatLog = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString()
    const metaString = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : ''

    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`
  }

  // 错误消息生成
  const createErrorMessage = (error, context = {}) => {
    const { file, line, function: func } = context
    const location = file ? ` at ${file}:${line}` : ''
    const functionInfo = func ? ` in ${func}()` : ''

    return `Error: ${error.message}${location}${functionInfo}
Stack: ${error.stack || 'No stack trace available'}
Timestamp: ${new Date().toISOString()}`
  }

  // 测试
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'avatar.jpg',
    role: 'admin',
    posts: 15,
    followers: 120,
  }

  console.log('User card HTML:')
  console.log(createUserCard(user))

  const query = buildQuery({
    table: 'users',
    fields: ['id', 'name', 'email'],
    where: { active: true, role: 'admin' },
    limit: 10,
  })
  console.log('SQL Query:', query)
  // SELECT id, name, email FROM users WHERE active = 'true' AND role = 'admin' LIMIT 10

  const apiUrl = buildApiUrl('https://api.example.com', '/users', {
    page: 1,
    limit: 20,
    search: 'john doe',
  })
  console.log('API URL:', apiUrl) // https://api.example.com/users?page=1&limit=20&search=john%20doe

  const logMessage = formatLog('error', 'Database connection failed', {
    host: 'localhost',
    port: 5432,
    retries: 3,
  })
  console.log('Log message:', logMessage)
}
```

**记忆要点总结：**

- **基本语法**：使用反引号``和${expression}进行变量插值
- **表达式支持**：可以插入任意JavaScript表达式，包括函数调用
- **多行支持**：自然支持多行字符串，保持格式
- **实际应用**：HTML模板、SQL构建、URL生成、日志格式化
- **优势**：比字符串拼接更简洁、可读性更强、支持复杂表达式

# **073. [初级]** 模板字符串支持多行吗？

支持

```javascript
function talk(you, fine) {
  return `how
are
${you}
?

i
am
${fine}

thank you
`
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察模板字符串的多行特性，面试官想了解你是否理解多行字符串的处理方式。

**知识点系统梳理：**

**多行字符串的特点：**

1. **自然换行** - 保持源码中的换行格式
2. **缩进保持** - 保留空格和制表符
3. **无需转义** - 不需要\n等转义字符
4. **格式控制** - 可以控制输出格式

**与传统方法的对比：**

- 传统方法需要使用\n或字符串拼接
- 模板字符串更直观、更易维护

**实战应用举例：**

```javascript
// 1. 多行字符串的基本用法
function multilineStringBasics() {
  console.log('=== 多行字符串基础 ===')

  // 传统方法（不推荐）
  const traditionalMultiline = 'Line 1\n' + 'Line 2\n' + 'Line 3'

  // 模板字符串方法（推荐）
  const templateMultiline = `Line 1
Line 2
Line 3`

  console.log('Traditional method:')
  console.log(traditionalMultiline)

  console.log('Template string method:')
  console.log(templateMultiline)

  // 带缩进的多行字符串
  const indentedText = `
    This is indented text
      This is more indented
    Back to original indent
  `

  console.log('Indented text:')
  console.log(indentedText)

  // 混合变量和多行
  const name = 'John'
  const age = 25
  const multilineWithVars = `
    User Information:
    Name: ${name}
    Age: ${age}
    Status: ${age >= 18 ? 'Adult' : 'Minor'}
  `

  console.log('With variables:')
  console.log(multilineWithVars)
}
```

```javascript
// 2. 实际应用场景
function multilineApplications() {
  console.log('=== 多行字符串实际应用 ===')

  // HTML模板
  const createEmailTemplate = (user, order) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background-color: #f0f0f0; padding: 20px; }
        .content { padding: 20px; }
        .footer { background-color: #333; color: white; padding: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Order Confirmation</h1>
    </div>
    <div class="content">
        <p>Dear ${user.name},</p>
        <p>Thank you for your order #${order.id}!</p>
        <h3>Order Details:</h3>
        <ul>
            ${order.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
        </ul>
        <p><strong>Total: $${order.total}</strong></p>
        <p>Estimated delivery: ${order.deliveryDate}</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 Our Company. All rights reserved.</p>
    </div>
</body>
</html>`
  }

  // SQL查询
  const createComplexQuery = filters => {
    return `
SELECT
    u.id,
    u.name,
    u.email,
    p.title as profile_title,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN orders o ON u.id = o.user_id
WHERE 1=1
    ${filters.active ? 'AND u.active = true' : ''}
    ${filters.minAge ? `AND u.age >= ${filters.minAge}` : ''}
    ${filters.city ? `AND u.city = '${filters.city}'` : ''}
GROUP BY u.id, u.name, u.email, p.title
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT ${filters.limit || 50};`
  }

  // 配置文件生成
  const generateConfig = (env, options) => {
    return `
# Application Configuration
# Environment: ${env}
# Generated: ${new Date().toISOString()}

[database]
host = ${options.db.host}
port = ${options.db.port}
name = ${options.db.name}
user = ${options.db.user}
password = ${options.db.password}

[redis]
host = ${options.redis.host}
port = ${options.redis.port}
ttl = ${options.redis.ttl}

[api]
base_url = ${options.api.baseUrl}
timeout = ${options.api.timeout}
rate_limit = ${options.api.rateLimit}

[logging]
level = ${env === 'production' ? 'warn' : 'debug'}
file = ${options.logging.file}
max_size = ${options.logging.maxSize}
`
  }

  // 测试数据
  const user = { name: 'John Doe', email: 'john@example.com' }
  const order = {
    id: 'ORD-12345',
    items: [
      { name: 'Product A', price: 29.99 },
      { name: 'Product B', price: 49.99 },
    ],
    total: 79.98,
    deliveryDate: '2024-01-15',
  }

  const filters = {
    active: true,
    minAge: 18,
    city: 'New York',
    limit: 25,
  }

  const configOptions = {
    db: { host: 'localhost', port: 5432, name: 'myapp', user: 'admin', password: 'secret' },
    redis: { host: 'localhost', port: 6379, ttl: 3600 },
    api: { baseUrl: 'https://api.example.com', timeout: 5000, rateLimit: 100 },
    logging: { file: '/var/log/app.log', maxSize: '10MB' },
  }

  // 输出示例
  console.log('Email template:')
  console.log(createEmailTemplate(user, order))

  console.log('\nSQL query:')
  console.log(createComplexQuery(filters))

  console.log('\nConfig file:')
  console.log(generateConfig('production', configOptions))
}
```

**记忆要点总结：**

- **多行支持**：模板字符串天然支持多行，保持源码格式
- **缩进保持**：会保留所有空格和制表符，需要注意格式
- **实际应用**：HTML模板、SQL查询、配置文件、文档生成
- **优势**：比传统\n拼接更直观，代码可读性更强
- **注意事项**：注意缩进控制，避免不必要的空格影响输出

# **074. [中级]** 如何在模板字符串中执行函数？

```javascript
const arr = [5, 2, 8, 3, 12, 100]
const maxAndMinNum = (arr = []) =>
  `max number is ${Math.max(...arr)}; min number is ${Math.min(...arr)}`
```

## 深度分析与补充

**问题本质解读：** 这道题考察模板字符串中函数调用的方法，面试官想了解你是否掌握表达式插值的高级用法。

**技术错误纠正：**

1. `Math.max(arr)`和`Math.min(arr)`有误，应该使用展开运算符：`Math.max(...arr)`
2. 缺少更多函数调用的示例和最佳实践

**知识点系统梳理：**

**模板字符串中的函数调用：**

1. **直接调用** - `${functionName()}`
2. **带参数调用** - `${functionName(param1, param2)}`
3. **链式调用** - `${obj.method().anotherMethod()}`
4. **立即执行函数** - `${(() => { /* logic */ })()}`
5. **条件函数调用** - `${condition ? func1() : func2()}`

**实战应用举例：**

```javascript
// 1. 各种函数调用方式
function functionCallsInTemplates() {
  console.log('=== 模板字符串中的函数调用 ===')

  // 工具函数
  const formatDate = date => date.toLocaleDateString()
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
  const formatCurrency = amount => `$${amount.toFixed(2)}`

  // 数组处理函数
  const getStats = numbers => ({
    max: Math.max(...numbers),
    min: Math.min(...numbers),
    avg: numbers.reduce((a, b) => a + b, 0) / numbers.length,
    sum: numbers.reduce((a, b) => a + b, 0),
  })

  const numbers = [5, 2, 8, 3, 12, 100]
  const user = { name: 'john doe', balance: 1234.56 }
  const currentDate = new Date()

  // 基本函数调用
  const basicCalls = `
User: ${capitalize(user.name)}
Balance: ${formatCurrency(user.balance)}
Date: ${formatDate(currentDate)}
Random: ${Math.random().toFixed(3)}
`

  // 复杂函数调用
  const stats = getStats(numbers)
  const complexCalls = `
Array: [${numbers.join(', ')}]
Max: ${Math.max(...numbers)}
Min: ${Math.min(...numbers)}
Average: ${(numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2)}
Stats: ${JSON.stringify(stats, null, 2)}
`

  // 条件函数调用
  const conditionalCalls = `
Status: ${user.balance > 1000 ? 'Premium' : 'Standard'}
Greeting: ${new Date().getHours() < 12 ? 'Good morning' : 'Good afternoon'}
Account: ${user.balance > 0 ? formatCurrency(user.balance) : 'No funds'}
`

  console.log('Basic calls:', basicCalls)
  console.log('Complex calls:', complexCalls)
  console.log('Conditional calls:', conditionalCalls)
}
```

```javascript
// 2. 高级应用场景
function advancedFunctionCalls() {
  console.log('=== 高级函数调用应用 ===')

  // 数据处理管道
  const processData = data => {
    return data
      .filter(item => item.active)
      .map(item => ({ ...item, name: item.name.toUpperCase() }))
      .sort((a, b) => b.score - a.score)
  }

  // 异步函数模拟（实际中需要await）
  const fetchUserData = id => {
    return Promise.resolve({ id, name: `User${id}`, score: Math.floor(Math.random() * 100) })
  }

  // 验证函数
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validateAge = age => age >= 18 && age <= 120

  // 格式化函数
  const formatList = (items, formatter = item => item) => {
    return items.map(formatter).join(', ')
  }

  const truncate = (str, length = 50) => {
    return str.length > length ? str.substring(0, length) + '...' : str
  }

  // 测试数据
  const users = [
    { id: 1, name: 'alice', active: true, score: 85 },
    { id: 2, name: 'bob', active: false, score: 92 },
    { id: 3, name: 'charlie', active: true, score: 78 },
  ]

  const emails = ['user@example.com', 'invalid-email', 'test@domain.org']
  const ages = [25, 17, 45, 150]

  // 复杂模板
  const report = `
Data Processing Report
=====================

Active Users: ${processData(users).length}
Processed Data: ${JSON.stringify(processData(users), null, 2)}

Email Validation:
${emails.map(email => `${email}: ${validateEmail(email) ? '✓ Valid' : '✗ Invalid'}`).join('\n')}

Age Validation:
${ages.map(age => `${age}: ${validateAge(age) ? '✓ Valid' : '✗ Invalid'}`).join('\n')}

User List: ${formatList(users, user => user.name.toUpperCase())}

Long Text: ${truncate('This is a very long text that should be truncated because it exceeds the maximum length limit', 30)}

Timestamp: ${new Date().toISOString()}
Random ID: ${Math.random().toString(36).substring(2, 15)}
`

  // 立即执行函数
  const iife = `
Result: ${(() => {
    const temp = users.filter(u => u.active)
    return temp.length > 0 ? `Found ${temp.length} active users` : 'No active users'
  })()}
`

  // 错误处理
  const safeCall = `
Safe Division: ${(() => {
    try {
      return (10 / 0).toString()
    } catch (error) {
      return 'Error: ' + error.message
    }
  })()}
`

  console.log('Complex report:', report)
  console.log('IIFE example:', iife)
  console.log('Safe call:', safeCall)
}
```

**记忆要点总结：**

- **基本语法**：在`${}`中可以调用任意JavaScript函数
- **参数传递**：支持传递参数，包括变量和表达式
- **链式调用**：支持方法链和复杂表达式
- **立即执行**：可以使用IIFE执行复杂逻辑
- **实际应用**：数据格式化、条件处理、计算结果、验证逻辑

# **075. [中级]** 什么是标签模板字符串？

标签模版是函数的一种调用方式

```javascript
alert('hello')
// 标签模版为 alert`hello`
```

## 深度分析与补充

**问题本质解读：** 这道题考察标签模板字符串的高级特性，面试官想了解你是否理解模板字符串的自定义处理机制。

**知识点系统梳理：**

**标签模板字符串的定义：**

- 函数名紧跟模板字符串的特殊调用方式
- 函数接收模板字符串的各个部分作为参数
- 可以自定义模板字符串的处理逻辑

**参数结构：**

1. **strings** - 模板字符串的静态部分数组
2. **...values** - 插值表达式的值数组

**实战应用举例：**

```javascript
// 1. 标签模板字符串的基本用法
function taggedTemplateBasics() {
  console.log('=== 标签模板字符串基础 ===')

  // 基础标签函数
  function highlight(strings, ...values) {
    console.log('Strings:', strings)
    console.log('Values:', values)

    return strings.reduce((result, string, i) => {
      const value = values[i] ? `<mark>${values[i]}</mark>` : ''
      return result + string + value
    }, '')
  }

  const name = 'John'
  const age = 25

  // 使用标签模板
  const result = highlight`Hello ${name}, you are ${age} years old!`
  console.log('Result:', result) // "Hello <mark>John</mark>, you are <mark>25</mark> years old!"

  // 安全HTML标签函数
  function safeHtml(strings, ...values) {
    const escapeHtml = str => {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    return strings.reduce((result, string, i) => {
      const value = values[i] ? escapeHtml(values[i]) : ''
      return result + string + value
    }, '')
  }

  const userInput = '<script>alert("xss")</script>'
  const safeOutput = safeHtml`User input: ${userInput}`
  console.log('Safe HTML:', safeOutput)
}
```

```javascript
// 2. 实际应用场景
function taggedTemplateApplications() {
  console.log('=== 标签模板实际应用 ===')

  // SQL查询构建器
  function sql(strings, ...values) {
    const escapeValue = value => {
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`
      }
      if (value === null || value === undefined) {
        return 'NULL'
      }
      return String(value)
    }

    return strings.reduce((query, string, i) => {
      const value = values[i] ? escapeValue(values[i]) : ''
      return query + string + value
    }, '')
  }

  // 国际化标签函数
  function i18n(strings, ...values) {
    const translations = {
      Hello: '你好',
      Welcome: '欢迎',
      Goodbye: '再见',
    }

    return strings.reduce((result, string, i) => {
      let translatedString = string
      Object.keys(translations).forEach(key => {
        translatedString = translatedString.replace(key, translations[key])
      })

      const value = values[i] || ''
      return result + translatedString + value
    }, '')
  }

  // 样式化输出标签函数
  function styled(strings, ...values) {
    const styles = {
      bold: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      reset: '\x1b[0m',
    }

    return strings.reduce((result, string, i) => {
      let styledString = string
      Object.keys(styles).forEach(style => {
        const regex = new RegExp(`\\{${style}\\}`, 'g')
        styledString = styledString.replace(regex, styles[style])
      })

      const value = values[i] || ''
      return result + styledString + value
    }, '')
  }

  // 测试
  const userId = 123
  const userName = "John O'Connor"
  const query = sql`SELECT * FROM users WHERE id = ${userId} AND name = ${userName}`
  console.log('SQL Query:', query) // SELECT * FROM users WHERE id = 123 AND name = 'John O''Connor'

  const greeting = i18n`Hello ${userName}, Welcome to our site!`
  console.log('I18n:', greeting)

  const styledText = styled`{bold}{red}Error:{reset} Something went wrong with user ${userName}`
  console.log('Styled:', styledText)
}
```

**记忆要点总结：**

- **语法形式**：`tagFunction`templateString`，函数名紧跟模板字符串
- **参数结构**：第一个参数是字符串数组，后续参数是插值值
- **实际应用**：HTML转义、SQL构建、国际化、样式化输出
- **优势**：可以自定义模板字符串的处理逻辑，增强安全性
- **使用场景**：需要对模板字符串进行特殊处理的场合

# **076. [高级]** 如何实现一个简单的模板字符串处理函数？

```javascript
function simpleTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match
  })
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察模板引擎的实现原理，面试官想了解你是否理解字符串模板处理的核心机制。

**技术错误纠正：**

1. `data[key] !== 'undefined'`应该是`data[key] !== undefined`或`typeof data[key] !== 'undefined'`
2. 缺少对嵌套属性、函数调用等高级特性的支持

**知识点系统梳理：**

**模板引擎的核心功能：**

1. **变量替换** - 基础的占位符替换
2. **表达式计算** - 支持简单的表达式
3. **条件渲染** - if/else逻辑
4. **循环渲染** - 数组遍历
5. **函数调用** - 支持辅助函数

**实战应用举例：**

```javascript
// 1. 基础模板引擎实现
function basicTemplateEngine() {
  console.log('=== 基础模板引擎 ===')

  // 修正后的简单模板函数
  function simpleTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match
    })
  }

  // 支持嵌套属性的模板函数
  function advancedTemplate(template, data) {
    return template.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
      const value = path.split('.').reduce((obj, key) => {
        return obj && obj[key] !== undefined ? obj[key] : undefined
      }, data)

      return value !== undefined ? value : match
    })
  }

  // 支持表达式的模板函数
  function expressionTemplate(template, data) {
    return template.replace(/\{\{(.+?)\}\}/g, (match, expression) => {
      try {
        // 创建安全的执行环境
        const func = new Function('data', `with(data) { return ${expression}; }`)
        const result = func(data)
        return result !== undefined ? result : match
      } catch (error) {
        console.warn('Template expression error:', error.message)
        return match
      }
    })
  }

  // 测试数据
  const data = {
    name: 'John',
    age: 25,
    user: {
      profile: {
        email: 'john@example.com',
      },
    },
    items: ['apple', 'banana', 'orange'],
  }

  // 测试
  const simple = simpleTemplate('Hello {{name}}, you are {{age}} years old!', data)
  console.log('Simple:', simple)

  const nested = advancedTemplate('Email: {{user.profile.email}}', data)
  console.log('Nested:', nested)

  const expression = expressionTemplate('{{name.toUpperCase()}} has {{items.length}} items', data)
  console.log('Expression:', expression)
}
```

```javascript
// 2. 完整的模板引擎实现
function fullTemplateEngine() {
  console.log('=== 完整模板引擎 ===')

  class TemplateEngine {
    constructor() {
      this.helpers = {
        uppercase: str => String(str).toUpperCase(),
        lowercase: str => String(str).toLowerCase(),
        capitalize: str => String(str).charAt(0).toUpperCase() + String(str).slice(1),
        formatDate: date => new Date(date).toLocaleDateString(),
        formatCurrency: amount => `$${Number(amount).toFixed(2)}`,
      }
    }

    // 注册辅助函数
    registerHelper(name, fn) {
      this.helpers[name] = fn
    }

    // 渲染模板
    render(template, data) {
      let result = template

      // 处理条件语句 {{#if condition}}...{{/if}}
      result = this.processConditions(result, data)

      // 处理循环 {{#each array}}...{{/each}}
      result = this.processLoops(result, data)

      // 处理变量和表达式
      result = this.processVariables(result, data)

      return result
    }

    processConditions(template, data) {
      return template.replace(
        /\{\{#if\s+(.+?)\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (match, condition, content) => {
          try {
            const func = new Function('data', 'helpers', `with(data) { return ${condition}; }`)
            const result = func(data, this.helpers)
            return result ? content : ''
          } catch (error) {
            console.warn('Condition error:', error.message)
            return ''
          }
        },
      )
    }

    processLoops(template, data) {
      return template.replace(
        /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
        (match, arrayName, content) => {
          const array = data[arrayName]
          if (!Array.isArray(array)) return ''

          return array
            .map((item, index) => {
              return content
                .replace(/\{\{this\}\}/g, item)
                .replace(/\{\{@index\}\}/g, index)
                .replace(/\{\{(\w+)\}\}/g, (m, key) => item[key] || m)
            })
            .join('')
        },
      )
    }

    processVariables(template, data) {
      return template.replace(/\{\{(.+?)\}\}/g, (match, expression) => {
        try {
          // 检查是否是辅助函数调用
          const helperMatch = expression.match(/(\w+)\s+(.+)/)
          if (helperMatch && this.helpers[helperMatch[1]]) {
            const helperName = helperMatch[1]
            const arg = helperMatch[2]
            const func = new Function('data', 'helpers', `with(data) { return ${arg}; }`)
            const value = func(data, this.helpers)
            return this.helpers[helperName](value)
          }

          // 普通表达式
          const func = new Function('data', 'helpers', `with(data) { return ${expression}; }`)
          const result = func(data, this.helpers)
          return result !== undefined ? result : match
        } catch (error) {
          console.warn('Variable error:', error.message)
          return match
        }
      })
    }
  }

  // 使用示例
  const engine = new TemplateEngine()

  const template = `
<div class="user-profile">
  <h1>{{uppercase name}}</h1>
  <p>Age: {{age}}</p>
  <p>Email: {{email}}</p>

  {{#if isActive}}
    <span class="status active">Active User</span>
  {{/if}}

  <h3>Items:</h3>
  <ul>
    {{#each items}}
      <li>{{@index}}: {{this}}</li>
    {{/each}}
  </ul>

  <p>Total: {{formatCurrency total}}</p>
</div>`

  const data = {
    name: 'john doe',
    age: 25,
    email: 'john@example.com',
    isActive: true,
    items: ['Apple', 'Banana', 'Orange'],
    total: 29.99,
  }

  const result = engine.render(template, data)
  console.log('Rendered template:', result)
}
```

**记忆要点总结：**

- **基础实现**：使用正则表达式替换占位符，支持简单变量替换
- **高级特性**：嵌套属性访问、表达式计算、条件渲染、循环处理
- **安全考虑**：使用Function构造器时要注意安全性，避免代码注入
- **实际应用**：邮件模板、HTML生成、配置文件处理
- **扩展性**：支持辅助函数、自定义语法、插件机制

# **077. [中级]** 模板字符串与字符串拼接的性能比较

## 深度分析与补充

**问题本质解读：** 这道题考察不同字符串处理方式的性能差异，面试官想了解你是否理解性能优化的考虑因素。

**知识点系统梳理：**

**字符串处理方式对比：**

1. **字符串拼接** - 使用+操作符
2. **模板字符串** - 使用``和${}语法
3. **数组join** - 使用数组join方法
4. **StringBuilder模式** - 累积后一次性构建

**性能影响因素：**

- 字符串长度和复杂度
- 变量数量和类型
- JavaScript引擎优化
- 使用频率和场景

**实战应用举例：**

```javascript
// 1. 性能测试对比
function performanceComparison() {
  console.log('=== 字符串性能对比 ===')

  const iterations = 100000
  const name = 'John'
  const age = 25
  const city = 'New York'

  // 字符串拼接测试
  console.time('String Concatenation')
  for (let i = 0; i < iterations; i++) {
    const result = 'Hello ' + name + ', you are ' + age + ' years old and live in ' + city
  }
  console.timeEnd('String Concatenation')

  // 模板字符串测试
  console.time('Template Literals')
  for (let i = 0; i < iterations; i++) {
    const result = `Hello ${name}, you are ${age} years old and live in ${city}`
  }
  console.timeEnd('Template Literals')

  // 数组join测试
  console.time('Array Join')
  for (let i = 0; i < iterations; i++) {
    const result = ['Hello ', name, ', you are ', age, ' years old and live in ', city].join('')
  }
  console.timeEnd('Array Join')

  // StringBuilder模式测试
  console.time('StringBuilder Pattern')
  for (let i = 0; i < iterations; i++) {
    const parts = []
    parts.push('Hello ')
    parts.push(name)
    parts.push(', you are ')
    parts.push(age)
    parts.push(' years old and live in ')
    parts.push(city)
    const result = parts.join('')
  }
  console.timeEnd('StringBuilder Pattern')
}
```

```javascript
// 2. 不同场景的最佳实践
function bestPracticesForScenarios() {
  console.log('=== 不同场景最佳实践 ===')

  // 简单字符串拼接 - 模板字符串更优
  const simpleCase = (name, age) => {
    // ✅ 推荐：模板字符串（可读性好）
    return `Hello ${name}, age: ${age}`

    // ❌ 不推荐：字符串拼接（可读性差）
    // return 'Hello ' + name + ', age: ' + age;
  }

  // 复杂HTML生成 - 根据情况选择
  const complexHtmlGeneration = users => {
    // 小量数据：模板字符串
    if (users.length < 100) {
      return users
        .map(
          user => `
        <div class="user">
          <h3>${user.name}</h3>
          <p>Age: ${user.age}</p>
          <p>Email: ${user.email}</p>
        </div>
      `,
        )
        .join('')
    }

    // 大量数据：StringBuilder模式
    const parts = []
    for (const user of users) {
      parts.push('<div class="user">')
      parts.push('<h3>')
      parts.push(user.name)
      parts.push('</h3>')
      parts.push('<p>Age: ')
      parts.push(user.age)
      parts.push('</p>')
      parts.push('<p>Email: ')
      parts.push(user.email)
      parts.push('</p>')
      parts.push('</div>')
    }
    return parts.join('')
  }

  // 动态SQL构建 - 安全性优先
  const buildSqlQuery = (table, conditions, limit) => {
    // 使用模板字符串但要注意SQL注入
    const whereClause = Object.entries(conditions)
      .map(([key, value]) => `${key} = ?`)
      .join(' AND ')

    return `SELECT * FROM ${table} WHERE ${whereClause} LIMIT ${limit}`
  }

  // 日志格式化 - 性能和可读性平衡
  const formatLog = (level, message, meta) => {
    const timestamp = new Date().toISOString()

    // 简单情况：模板字符串
    if (!meta || Object.keys(meta).length === 0) {
      return `[${timestamp}] ${level}: ${message}`
    }

    // 复杂情况：StringBuilder
    const parts = ['[', timestamp, '] ', level, ': ', message]
    if (meta) {
      parts.push(' | ')
      parts.push(JSON.stringify(meta))
    }
    return parts.join('')
  }

  // 测试
  console.log('Simple case:', simpleCase('John', 25))

  const users = [
    { name: 'Alice', age: 30, email: 'alice@example.com' },
    { name: 'Bob', age: 25, email: 'bob@example.com' },
  ]
  console.log('HTML generation:', complexHtmlGeneration(users))

  console.log('SQL query:', buildSqlQuery('users', { active: true, role: 'admin' }, 10))

  console.log(
    'Log format:',
    formatLog('ERROR', 'Database connection failed', { host: 'localhost', port: 5432 }),
  )
}
```

**记忆要点总结：**

- **简单场景**：模板字符串通常性能相当且可读性更好
- **复杂场景**：大量字符串操作时考虑StringBuilder模式
- **现代引擎**：JavaScript引擎对字符串操作有很多优化
- **实际建议**：优先考虑可读性和维护性，性能问题出现时再优化
- **测试重要性**：具体性能差异需要在实际环境中测试验证

### 函数增强（8道）

# **078. [初级]** ES6函数参数默认值的用法

```javascript
const func = (a = 0, b = 10) => {
  return a + b
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6函数参数默认值的语法和应用，面试官想了解你是否掌握现代函数参数处理方式。

**知识点系统梳理：**

**默认参数的特点：**

1. **惰性求值** - 只在需要时计算默认值
2. **作用域** - 默认参数有自己的作用域
3. **顺序依赖** - 后面的参数可以引用前面的参数
4. **类型支持** - 支持任意类型的默认值

**与传统方法的对比：**

- ES5：`a = a || defaultValue`（有问题）
- ES6：`a = defaultValue`（更准确）

**实战应用举例：**

```javascript
// 1. 默认参数的基本用法
function defaultParametersBasics() {
  console.log('=== 默认参数基础 ===')

  // 基础默认值
  function greet(name = 'Guest', greeting = 'Hello') {
    return `${greeting}, ${name}!`
  }

  // 函数作为默认值
  function getCurrentTime() {
    return new Date().toISOString()
  }

  function logMessage(message, timestamp = getCurrentTime()) {
    console.log(`[${timestamp}] ${message}`)
  }

  // 对象作为默认值
  function createUser(name, options = { role: 'user', active: true }) {
    return {
      id: Date.now(),
      name,
      ...options,
    }
  }

  // 参数间的依赖关系
  function createRange(start = 0, end = start + 10, step = 1) {
    const result = []
    for (let i = start; i < end; i += step) {
      result.push(i)
    }
    return result
  }

  // 测试
  console.log(greet()) // "Hello, Guest!"
  console.log(greet('John')) // "Hello, John!"
  console.log(greet('Alice', 'Hi')) // "Hi, Alice!"

  logMessage('System started') // 使用当前时间

  console.log(createUser('John')) // 使用默认options
  console.log(createUser('Jane', { role: 'admin' })) // 自定义options

  console.log(createRange()) // [0,1,2,3,4,5,6,7,8,9]
  console.log(createRange(5)) // [5,6,7,8,9,10,11,12,13,14]
  console.log(createRange(0, 5, 2)) // [0,2,4]
}
```

```javascript
// 2. 高级应用场景
function advancedDefaultParameters() {
  console.log('=== 默认参数高级应用 ===')

  // API请求函数
  async function apiRequest(
    url,
    method = 'GET',
    headers = { 'Content-Type': 'application/json' },
    timeout = 5000,
    retries = 3,
  ) {
    const config = {
      method,
      headers,
      timeout,
      retries,
    }

    console.log(`Making ${method} request to ${url}`, config)
    return { status: 'success', data: {} }
  }

  // 数据验证函数
  function validateInput(
    value,
    type = 'string',
    required = true,
    minLength = 0,
    maxLength = Infinity,
    pattern = null,
  ) {
    const errors = []

    if (required && (value === undefined || value === null || value === '')) {
      errors.push('Field is required')
    }

    if (value && typeof value !== type) {
      errors.push(`Expected ${type}, got ${typeof value}`)
    }

    if (type === 'string' && value) {
      if (value.length < minLength) {
        errors.push(`Minimum length is ${minLength}`)
      }
      if (value.length > maxLength) {
        errors.push(`Maximum length is ${maxLength}`)
      }
      if (pattern && !pattern.test(value)) {
        errors.push('Pattern validation failed')
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // 配置合并函数
  function mergeConfig(
    userConfig = {},
    defaultConfig = {
      theme: 'light',
      language: 'en',
      timeout: 30000,
      retries: 3,
    },
  ) {
    return {
      ...defaultConfig,
      ...userConfig,
      // 确保某些关键配置有合理的默认值
      timeout: userConfig.timeout || defaultConfig.timeout,
      retries: userConfig.retries ?? defaultConfig.retries,
    }
  }

  // 分页函数
  function paginate(data = [], page = 1, pageSize = 10, sortBy = 'id', sortOrder = 'asc') {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    // 排序
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return {
      data: sortedData.slice(startIndex, endIndex),
      pagination: {
        page,
        pageSize,
        total: data.length,
        totalPages: Math.ceil(data.length / pageSize),
        hasNext: endIndex < data.length,
        hasPrev: page > 1,
      },
    }
  }

  // 测试
  apiRequest('/api/users') // 使用所有默认值
  apiRequest('/api/users', 'POST', { Authorization: 'Bearer token' })

  console.log(
    'Validation:',
    validateInput('test@example.com', 'string', true, 5, 50, /\S+@\S+\.\S+/),
  )

  console.log('Config merge:', mergeConfig({ theme: 'dark', newOption: true }))

  const testData = [
    { id: 3, name: 'Charlie' },
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]
  console.log('Pagination:', paginate(testData, 1, 2, 'name'))
}
```

**记忆要点总结：**

- **基本语法**：`function(param = defaultValue)`设置默认值
- **惰性求值**：默认值表达式只在参数为undefined时计算
- **参数依赖**：后面的参数可以引用前面的参数
- **实际应用**：API函数、配置处理、数据验证、分页等场景
- **最佳实践**：合理设置默认值，提高函数的易用性和健壮性

# **079. [中级]** 剩余参数（rest parameters）和扩展运算符的区别

```javascript
function fun(context, ...args) {
  const arr = [1, 2, 3, 4, 5, ...args]
  return arr.join(' ')
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察rest参数和spread运算符的区别，面试官想了解你是否理解这两个相似语法的不同用途。

**知识点系统梳理：**

**Rest参数 vs Spread运算符：**

- **Rest参数**：收集多个元素到数组中（`...args`）
- **Spread运算符**：展开数组/对象到多个元素（`...array`）
- **语法相同**：都使用`...`，但作用相反

**使用场景对比：**

1. **Rest**：函数参数、解构赋值中收集剩余元素
2. **Spread**：函数调用、数组/对象字面量中展开元素

**实战应用举例：**

```javascript
// 1. Rest参数和Spread运算符的基本对比
function restVsSpreadBasics() {
  console.log('=== Rest vs Spread 基础对比 ===')

  // Rest参数：收集参数到数组
  function collectArgs(first, ...restArgs) {
    console.log('First:', first)
    console.log('Rest args:', restArgs)
    console.log('Rest is array:', Array.isArray(restArgs))
    return restArgs.length
  }

  // Spread运算符：展开数组到参数
  function spreadExample() {
    const numbers = [1, 2, 3, 4, 5]

    // 展开数组作为函数参数
    console.log('Max:', Math.max(...numbers))
    console.log('Min:', Math.min(...numbers))

    // 展开数组到新数组
    const newArray = [0, ...numbers, 6, 7]
    console.log('New array:', newArray)

    // 展开对象到新对象
    const user = { name: 'John', age: 25 }
    const extendedUser = { ...user, city: 'NYC', age: 26 }
    console.log('Extended user:', extendedUser)
  }

  // 解构中的Rest
  function destructuringRest() {
    const [first, second, ...rest] = [1, 2, 3, 4, 5]
    console.log('Destructuring - first:', first, 'second:', second, 'rest:', rest)

    const { name, age, ...otherProps } = {
      name: 'Alice',
      age: 30,
      city: 'Boston',
      country: 'USA',
    }
    console.log('Object destructuring - name:', name, 'age:', age, 'other:', otherProps)
  }

  // 测试
  collectArgs('hello', 'world', 'test', 123)
  spreadExample()
  destructuringRest()
}
```

```javascript
// 2. 实际应用场景
function practicalApplications() {
  console.log('=== 实际应用场景 ===')

  // 工具函数：使用Rest收集参数
  const createLogger = (level, ...messages) => {
    const timestamp = new Date().toISOString()
    const formattedMessages = messages.map(msg =>
      typeof msg === 'object' ? JSON.stringify(msg) : String(msg),
    )
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${formattedMessages.join(' ')}`)
  }

  // 数学工具：使用Rest和Spread
  const mathUtils = {
    // Rest：收集所有数字
    sum: (...numbers) => numbers.reduce((a, b) => a + b, 0),
    average: (...numbers) => (numbers.length > 0 ? mathUtils.sum(...numbers) / numbers.length : 0),

    // Spread：展开数组进行计算
    range: (start, end, step = 1) => {
      const result = []
      for (let i = start; i < end; i += step) {
        result.push(i)
      }
      return result
    },
  }

  // 数组操作：组合Rest和Spread
  const arrayUtils = {
    // 合并多个数组
    merge: (...arrays) => {
      return arrays.reduce((result, arr) => [...result, ...arr], [])
    },

    // 去重
    unique: (...arrays) => {
      const merged = arrayUtils.merge(...arrays)
      return [...new Set(merged)]
    },

    // 分组
    chunk: (array, size) => {
      const chunks = []
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
      }
      return chunks
    },
  }

  // 对象操作：使用Spread进行不可变更新
  const objectUtils = {
    // 深度合并对象
    deepMerge: (target, ...sources) => {
      if (!sources.length) return target
      const source = sources.shift()

      if (typeof target === 'object' && typeof source === 'object') {
        for (const key in source) {
          if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {}
            objectUtils.deepMerge(target[key], source[key])
          } else {
            target[key] = source[key]
          }
        }
      }

      return objectUtils.deepMerge(target, ...sources)
    },

    // 选择特定属性
    pick: (obj, ...keys) => {
      return keys.reduce((result, key) => {
        if (key in obj) {
          result[key] = obj[key]
        }
        return result
      }, {})
    },

    // 排除特定属性
    omit: (obj, ...keys) => {
      const { ...result } = obj
      keys.forEach(key => delete result[key])
      return result
    },
  }

  // 测试
  createLogger('info', 'User logged in', { userId: 123, timestamp: Date.now() })

  console.log('Sum:', mathUtils.sum(1, 2, 3, 4, 5)) // 15
  console.log('Average:', mathUtils.average(10, 20, 30)) // 20

  const arr1 = [1, 2, 3]
  const arr2 = [3, 4, 5]
  const arr3 = [5, 6, 7]
  console.log('Merged:', arrayUtils.merge(arr1, arr2, arr3))
  console.log('Unique:', arrayUtils.unique(arr1, arr2, arr3))

  const user = { name: 'John', age: 25, email: 'john@example.com', password: 'secret' }
  console.log('Picked:', objectUtils.pick(user, 'name', 'email'))
  console.log('Omitted:', objectUtils.omit(user, 'password'))
}
```

**记忆要点总结：**

- **Rest参数**：`...args`收集多个参数到数组，用于函数定义
- **Spread运算符**：`...array`展开数组/对象，用于函数调用和字面量
- **记忆技巧**：Rest是"收集"，Spread是"展开"
- **实际应用**：Rest用于可变参数函数，Spread用于数组合并、对象复制
- **组合使用**：可以在同一个函数中同时使用Rest和Spread

# **080. [中级]** 如何使用扩展运算符合并数组？

```javascript
const arr1 = [1, 2, 3, 4, 5]
const arr2 = ['a', 'b', 'c', 'd']
const _arr = [...arr1, ...arr2]
```

## 深度分析与补充

**问题本质解读：** 这道题考察扩展运算符在数组操作中的应用，面试官想了解你是否掌握现代数组处理方式。

**知识点系统梳理：**

**数组合并的方法对比：**

1. **扩展运算符** - `[...arr1, ...arr2]`（推荐）
2. **concat方法** - `arr1.concat(arr2)`
3. **push.apply** - `arr1.push.apply(arr1, arr2)`（修改原数组）

**扩展运算符的优势：**

- 语法简洁直观
- 支持多个数组合并
- 创建新数组，不修改原数组
- 可以在任意位置插入元素

**实战应用举例：**

```javascript
// 1. 数组合并的各种方式
function arrayMergingMethods() {
  console.log('=== 数组合并方法对比 ===')

  const arr1 = [1, 2, 3]
  const arr2 = [4, 5, 6]
  const arr3 = [7, 8, 9]

  // 扩展运算符（推荐）
  const merged1 = [...arr1, ...arr2, ...arr3]
  console.log('Spread operator:', merged1)

  // concat方法
  const merged2 = arr1.concat(arr2, arr3)
  console.log('Concat method:', merged2)

  // 在特定位置插入
  const insertedArray = [...arr1, 'inserted', ...arr2]
  console.log('With insertion:', insertedArray)

  // 条件合并
  const condition = true
  const conditionalMerge = [...arr1, ...(condition ? arr2 : []), ...arr3]
  console.log('Conditional merge:', conditionalMerge)

  // 扁平化一层
  const nestedArray = [
    [1, 2],
    [3, 4],
    [5, 6],
  ]
  const flattened = [].concat(...nestedArray)
  console.log('Flattened:', flattened)

  // 使用扩展运算符扁平化
  const flattenedSpread = [...nestedArray[0], ...nestedArray[1], ...nestedArray[2]]
  console.log('Flattened with spread:', flattenedSpread)
}
```

```javascript
// 2. 实际应用场景
function practicalArrayMerging() {
  console.log('=== 实际应用场景 ===')

  // 数据处理：合并API响应
  const processApiResponses = (...responses) => {
    const allData = responses.reduce((acc, response) => {
      return [...acc, ...response.data]
    }, [])

    return {
      totalItems: allData.length,
      data: allData,
      sources: responses.length,
    }
  }

  // 购物车操作
  const shoppingCartUtils = {
    // 添加商品
    addItems: (cart, ...newItems) => {
      return [...cart, ...newItems]
    },

    // 合并购物车
    mergeCarts: (...carts) => {
      const allItems = carts.reduce((acc, cart) => [...acc, ...cart], [])

      // 去重并合并数量
      const itemMap = new Map()
      allItems.forEach(item => {
        const existing = itemMap.get(item.id)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          itemMap.set(item.id, { ...item })
        }
      })

      return Array.from(itemMap.values())
    },
  }

  // 数组工具函数
  const arrayUtils = {
    // 去重合并
    uniqueMerge: (...arrays) => {
      const merged = arrays.reduce((acc, arr) => [...acc, ...arr], [])
      return [...new Set(merged)]
    },

    // 交替合并
    interleave: (arr1, arr2) => {
      const result = []
      const maxLength = Math.max(arr1.length, arr2.length)

      for (let i = 0; i < maxLength; i++) {
        if (i < arr1.length) result.push(arr1[i])
        if (i < arr2.length) result.push(arr2[i])
      }

      return result
    },

    // 分组合并
    groupMerge: (arrays, groupSize) => {
      const allItems = arrays.reduce((acc, arr) => [...acc, ...arr], [])
      const groups = []

      for (let i = 0; i < allItems.length; i += groupSize) {
        groups.push(allItems.slice(i, i + groupSize))
      }

      return groups
    },
  }

  // 测试数据
  const response1 = {
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
  }
  const response2 = { data: [{ id: 3, name: 'Item 3' }] }
  const response3 = {
    data: [
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ],
  }

  console.log('API responses merged:', processApiResponses(response1, response2, response3))

  const cart1 = [{ id: 1, name: 'Apple', quantity: 2 }]
  const cart2 = [
    { id: 1, name: 'Apple', quantity: 1 },
    { id: 2, name: 'Banana', quantity: 3 },
  ]

  console.log('Merged carts:', shoppingCartUtils.mergeCarts(cart1, cart2))

  const nums1 = [1, 2, 3, 2, 1]
  const nums2 = [3, 4, 5, 4]
  const nums3 = [5, 6, 7]

  console.log('Unique merge:', arrayUtils.uniqueMerge(nums1, nums2, nums3))
  console.log('Interleaved:', arrayUtils.interleave([1, 3, 5], [2, 4, 6]))
  console.log(
    'Group merge:',
    arrayUtils.groupMerge(
      [
        [1, 2],
        [3, 4],
        [5, 6, 7],
      ],
      3,
    ),
  )
}
```

**记忆要点总结：**

- **基本语法**：`[...arr1, ...arr2]`合并数组，创建新数组
- **多数组合并**：支持同时合并多个数组
- **灵活插入**：可以在任意位置插入元素或数组
- **实际应用**：API数据合并、购物车操作、数组工具函数
- **性能考虑**：对于大数组，考虑使用concat或其他优化方法

# **081. [中级]** 扩展运算符在对象中的应用

```javascript
const obj = {
  a: 1,
  b: 2,
  c: { d: [3, 4, 5], f: (...args) => args.join('-') },
  e: new Map(),
  g: new Set(),
}
const { c: _cObj, f: fun, ...others } = obj
```

## 深度分析与补充

**问题本质解读：** 这道题考察扩展运算符在对象操作中的应用，面试官想了解你是否掌握对象的现代处理方式。

**知识点系统梳理：**

**对象扩展运算符的用途：**

1. **对象合并** - `{...obj1, ...obj2}`
2. **对象复制** - `{...originalObj}`
3. **属性覆盖** - 后面的属性覆盖前面的
4. **条件属性** - 动态添加属性

**注意事项：**

- 只进行浅拷贝
- 不会复制原型链上的属性
- 只复制可枚举属性

**实战应用举例：**

```javascript
// 1. 对象扩展运算符的基本用法
function objectSpreadBasics() {
  console.log('=== 对象扩展运算符基础 ===')

  const user = { name: 'John', age: 25 }
  const location = { city: 'NYC', country: 'USA' }
  const preferences = { theme: 'dark', language: 'en' }

  // 对象合并
  const userProfile = { ...user, ...location, ...preferences }
  console.log('Merged profile:', userProfile)

  // 属性覆盖
  const updatedUser = { ...user, age: 26, status: 'active' }
  console.log('Updated user:', updatedUser)
  // { name: 'John', age: 26, status: 'active' }

  // 对象复制（浅拷贝）
  const userCopy = { ...user }
  console.log('User copy:', userCopy)
  console.log('Same reference?', user === userCopy) // false

  // 条件属性添加
  const isAdmin = true
  const userWithRole = {
    ...user,
    ...(isAdmin && { role: 'admin', permissions: ['read', 'write'] }),
  }
  console.log('User with conditional role:', userWithRole)

  // 嵌套对象的浅拷贝问题
  const complexObj = {
    name: 'Test',
    nested: { value: 1 },
  }

  const shallowCopy = { ...complexObj }
  shallowCopy.nested.value = 2
  console.log('Original nested value:', complexObj.nested.value) // 2 - 被修改了！
}
```

```javascript
// 2. 实际应用场景
function objectSpreadApplications() {
  console.log('=== 对象扩展运算符实际应用 ===')

  // 状态管理（类似Redux）
  const stateManager = {
    initialState: {
      user: null,
      isLoading: false,
      error: null,
      preferences: { theme: 'light' },
    },

    // 不可变状态更新
    updateState: (currentState, action) => {
      switch (action.type) {
        case 'SET_USER':
          return {
            ...currentState,
            user: action.payload,
            isLoading: false,
          }

        case 'SET_LOADING':
          return {
            ...currentState,
            isLoading: action.payload,
          }

        case 'UPDATE_PREFERENCES':
          return {
            ...currentState,
            preferences: {
              ...currentState.preferences,
              ...action.payload,
            },
          }

        default:
          return currentState
      }
    },
  }

  // API响应处理
  const apiUtils = {
    // 标准化API响应
    normalizeResponse: (response, metadata = {}) => {
      return {
        ...response,
        timestamp: Date.now(),
        ...metadata,
      }
    },

    // 合并配置
    mergeConfig: (defaultConfig, userConfig = {}) => {
      return {
        ...defaultConfig,
        ...userConfig,
        headers: {
          ...defaultConfig.headers,
          ...userConfig.headers,
        },
      }
    },
  }

  // 表单数据处理
  const formUtils = {
    // 创建表单数据
    createFormData: (baseData, ...updates) => {
      return updates.reduce(
        (acc, update) => ({
          ...acc,
          ...update,
        }),
        { ...baseData },
      )
    },

    // 验证并清理数据
    validateAndClean: (data, schema) => {
      const cleaned = {}
      const errors = {}

      Object.keys(schema).forEach(key => {
        const rule = schema[key]
        const value = data[key]

        if (rule.required && !value) {
          errors[key] = 'Required field'
        } else if (value && rule.validate && !rule.validate(value)) {
          errors[key] = rule.message || 'Invalid value'
        } else if (value) {
          cleaned[key] = rule.transform ? rule.transform(value) : value
        }
      })

      return {
        data: cleaned,
        errors,
        isValid: Object.keys(errors).length === 0,
      }
    },
  }

  // 深度合并工具
  const deepMerge = (target, ...sources) => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          deepMerge(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }

    return deepMerge(target, ...sources)
  }

  const isObject = item => {
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  // 测试
  let state = stateManager.initialState
  state = stateManager.updateState(state, {
    type: 'SET_USER',
    payload: { id: 1, name: 'John' },
  })
  console.log('Updated state:', state)

  const defaultConfig = {
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
  }
  const userConfig = {
    timeout: 10000,
    headers: { Authorization: 'Bearer token' },
  }
  console.log('Merged config:', apiUtils.mergeConfig(defaultConfig, userConfig))

  const formData = formUtils.createFormData(
    { name: '', email: '' },
    { name: 'John' },
    { email: 'john@example.com', age: 25 },
  )
  console.log('Form data:', formData)
}
```

**记忆要点总结：**

- **基本语法**：`{...obj1, ...obj2}`合并对象，创建新对象
- **属性覆盖**：后面的属性会覆盖前面的同名属性
- **浅拷贝**：只复制第一层属性，嵌套对象仍共享引用
- **实际应用**：状态管理、配置合并、表单处理、API响应标准化
- **注意事项**：需要深拷贝时使用专门的深拷贝函数

# **082. [中级]** 函数的`name`属性在ES6中的变化

返回该函数名

```javascript
function foo() {
  return 'name this foo'
}
foo.name // foo
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6中函数name属性的增强，面试官想了解你是否理解函数元信息的改进。

**知识点系统梳理：**

**ES6中name属性的改进：**

1. **匿名函数** - 根据上下文推断名称
2. **箭头函数** - 支持name属性
3. **方法定义** - 正确显示方法名
4. **绑定函数** - 显示"bound"前缀
5. **构造函数** - 显示构造函数名

**name属性的规则：**

- 函数声明：返回函数名
- 函数表达式：返回变量名或空字符串
- 箭头函数：返回变量名
- 方法：返回方法名

**实战应用举例：**

```javascript
// 1. 各种函数的name属性
function functionNameExamples() {
  console.log('=== 函数name属性示例 ===')

  // 函数声明
  function namedFunction() {}
  console.log('Named function:', namedFunction.name) // "namedFunction"

  // 函数表达式
  const anonymousFunc = function () {}
  console.log('Anonymous function:', anonymousFunc.name) // "anonymousFunc"

  const namedExpr = function myFunc() {}
  console.log('Named expression:', namedExpr.name) // "myFunc"

  // 箭头函数
  const arrowFunc = () => {}
  console.log('Arrow function:', arrowFunc.name) // "arrowFunc"

  // 对象方法
  const obj = {
    method() {},
    arrowMethod: () => {},
    funcProperty: function () {},
  }
  console.log('Object method:', obj.method.name) // "method"
  console.log('Arrow method:', obj.arrowMethod.name) // "arrowMethod"
  console.log('Function property:', obj.funcProperty.name) // "funcProperty"

  // 类方法
  class MyClass {
    constructor() {}
    method() {}
    static staticMethod() {}
  }
  console.log('Constructor:', MyClass.name) // "MyClass"
  console.log('Class method:', MyClass.prototype.method.name) // "method"
  console.log('Static method:', MyClass.staticMethod.name) // "staticMethod"

  // 绑定函数
  const boundFunc = namedFunction.bind(null)
  console.log('Bound function:', boundFunc.name) // "bound namedFunction"

  // 生成器函数
  function* generatorFunc() {}
  console.log('Generator:', generatorFunc.name) // "generatorFunc"

  // 异步函数
  async function asyncFunc() {}
  console.log('Async function:', asyncFunc.name) // "asyncFunc"
}
```

```javascript
// 2. 实际应用场景
function practicalNameUsage() {
  console.log('=== name属性实际应用 ===')

  // 调试和日志
  const createLogger = func => {
    return function (...args) {
      console.log(`Calling function: ${func.name}`)
      const start = performance.now()
      const result = func.apply(this, args)
      const end = performance.now()
      console.log(`Function ${func.name} took ${end - start} milliseconds`)
      return result
    }
  }

  // 函数注册系统
  class FunctionRegistry {
    constructor() {
      this.functions = new Map()
    }

    register(func, customName = null) {
      const name = customName || func.name || 'anonymous'
      this.functions.set(name, func)
      console.log(`Registered function: ${name}`)
    }

    call(name, ...args) {
      const func = this.functions.get(name)
      if (func) {
        console.log(`Executing: ${name}`)
        return func(...args)
      } else {
        throw new Error(`Function ${name} not found`)
      }
    }

    list() {
      return Array.from(this.functions.keys())
    }
  }

  // 中间件系统
  class MiddlewareManager {
    constructor() {
      this.middlewares = []
    }

    use(middleware) {
      const name = middleware.name || `middleware_${this.middlewares.length}`
      this.middlewares.push({ name, func: middleware })
      console.log(`Added middleware: ${name}`)
    }

    execute(context) {
      console.log('Executing middleware chain:')
      return this.middlewares.reduce((promise, { name, func }) => {
        return promise.then(ctx => {
          console.log(`Running: ${name}`)
          return func(ctx)
        })
      }, Promise.resolve(context))
    }
  }

  // 函数缓存系统
  const createMemoized = func => {
    const cache = new Map()
    const memoized = function (...args) {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
        console.log(`Cache hit for ${func.name}`)
        return cache.get(key)
      }

      console.log(`Computing ${func.name}`)
      const result = func.apply(this, args)
      cache.set(key, result)
      return result
    }

    // 保持原函数名
    Object.defineProperty(memoized, 'name', {
      value: `memoized_${func.name}`,
      configurable: true,
    })

    return memoized
  }

  // 测试函数
  function expensiveCalculation(n) {
    let result = 0
    for (let i = 0; i < n; i++) {
      result += i
    }
    return result
  }

  function simpleAdd(a, b) {
    return a + b
  }

  // 测试
  const loggedAdd = createLogger(simpleAdd)
  loggedAdd(2, 3)

  const registry = new FunctionRegistry()
  registry.register(simpleAdd)
  registry.register(expensiveCalculation)
  console.log('Registered functions:', registry.list())

  const middleware = new MiddlewareManager()
  middleware.use(function authMiddleware(ctx) {
    ctx.authenticated = true
    return ctx
  })
  middleware.use(ctx => {
    ctx.processed = true
    return ctx
  })

  const memoizedCalc = createMemoized(expensiveCalculation)
  console.log('Memoized function name:', memoizedCalc.name)
  memoizedCalc(1000)
  memoizedCalc(1000) // 缓存命中
}
```

**记忆要点总结：**

- **ES6增强**：匿名函数能根据上下文推断名称
- **箭头函数**：支持name属性，返回变量名
- **绑定函数**：显示"bound"前缀
- **实际应用**：调试日志、函数注册、中间件系统、缓存系统
- **注意事项**：name属性是只读的，但可以通过defineProperty修改

# **083. [高级]** 如何使用参数默认值实现必需参数检查？

~~可以使用typescript~~

## 深度分析与补充

**问题本质解读：** 这道题考察参数默认值的高级应用，面试官想了解你是否掌握使用默认值进行参数验证的技巧。

**技术错误纠正：**

1. "可以使用typescript"回答不准确，这是JavaScript语言特性，不需要TypeScript
2. 缺少具体的实现方法和代码示例

**知识点系统梳理：**

**必需参数检查的实现方式：**

1. **抛出错误函数** - 默认值调用抛出错误的函数
2. **参数验证** - 结合默认值进行类型和值验证
3. **条件检查** - 使用逻辑运算符进行检查`

**核心原理：**

- 当参数为undefined时，会使用默认值
- 默认值可以是函数调用，包括抛出错误的函数

**实战应用举例：**

```javascript
// 1. 基础必需参数检查
function requiredParameterBasics() {
  console.log('=== 必需参数检查基础 ===')

  // 创建抛出错误的函数
  const required = paramName => {
    throw new Error(`Parameter '${paramName}' is required`)
  }

  // 使用默认值实现必需参数检查
  function createUser(name = required('name'), email = required('email'), age = 18, role = 'user') {
    return {
      id: Date.now(),
      name,
      email,
      age,
      role,
      createdAt: new Date().toISOString(),
    }
  }

  // 带类型检查的必需参数
  const requiredString = paramName => {
    throw new Error(`String parameter '${paramName}' is required`)
  }

  const requiredNumber = paramName => {
    throw new Error(`Number parameter '${paramName}' is required`)
  }

  function calculateArea(
    width = requiredNumber('width'),
    height = requiredNumber('height'),
    unit = 'px',
  ) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('Width and height must be numbers')
    }

    return {
      area: width * height,
      unit,
      dimensions: `${width}${unit} × ${height}${unit}`,
    }
  }

  // 测试
  try {
    const user1 = createUser('John', 'john@example.com')
    console.log('Valid user:', user1)

    // 这会抛出错误
    const user2 = createUser('Jane') // 缺少email参数
  } catch (error) {
    console.log('Error caught:', error.message)
  }

  try {
    const area = calculateArea(10, 20)
    console.log('Area calculation:', area)

    // 这会抛出错误
    const invalidArea = calculateArea(10) // 缺少height参数
  } catch (error) {
    console.log('Error caught:', error.message)
  }
}
```

```javascript
// 2. 高级参数验证系统
function advancedParameterValidation() {
  console.log('=== 高级参数验证 ===')

  // 创建验证器工厂
  const createValidator = (type, paramName, customValidator = null) => {
    return () => {
      const error = new Error(`Invalid or missing parameter '${paramName}'`)
      error.paramName = paramName
      error.expectedType = type
      throw error
    }
  }

  // 类型验证函数
  const validators = {
    string: paramName => createValidator('string', paramName),
    number: paramName => createValidator('number', paramName),
    email: paramName => () => {
      throw new Error(`Valid email required for parameter '${paramName}'`)
    },
    positiveNumber: paramName => () => {
      throw new Error(`Positive number required for parameter '${paramName}'`)
    },
  }

  // API端点函数
  function apiEndpoint(
    endpoint = validators.string('endpoint')(),
    method = 'GET',
    data = null,
    timeout = validators.positiveNumber('timeout')(),
    headers = {},
  ) {
    // 运行时验证
    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      throw new Error('Endpoint must be a non-empty string')
    }

    if (typeof timeout !== 'number' || timeout <= 0) {
      throw new Error('Timeout must be a positive number')
    }

    return {
      config: {
        endpoint: endpoint.trim(),
        method: method.toUpperCase(),
        data,
        timeout,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      },
      timestamp: Date.now(),
    }
  }

  // 数据库查询函数
  function dbQuery(
    table = validators.string('table')(),
    conditions = {},
    limit = validators.positiveNumber('limit')(),
    offset = 0,
  ) {
    // 参数验证
    if (typeof table !== 'string') {
      throw new Error('Table name must be a string')
    }

    if (typeof limit !== 'number' || limit <= 0) {
      throw new Error('Limit must be a positive number')
    }

    return {
      query: `SELECT * FROM ${table}`,
      conditions,
      limit,
      offset,
      generatedAt: new Date().toISOString(),
    }
  }

  // 测试
  try {
    const api1 = apiEndpoint('/api/users', 'GET', null, 5000)
    console.log('Valid API config:', api1)

    const query1 = dbQuery('users', { active: true }, 10)
    console.log('Valid query:', query1)

    // 测试错误情况
    const invalidApi = apiEndpoint() // 缺少必需参数
  } catch (error) {
    console.log('Validation error:', error.message)
  }
}
```

**记忆要点总结：**

- **核心技巧**：使用抛出错误的函数作为参数默认值
- **触发条件**：只有当参数为undefined时才会调用默认值函数
- **实际应用**：API函数、数据库操作、配置验证等场景
- **扩展用法**：结合类型检查、自定义验证器、错误信息定制
- **最佳实践**：提供清晰的错误信息，包含参数名和期望类型

# **084. [中级]** 剩余参数与arguments对象的区别

- 剩余参数是一个数组，可以直接调用数组方法

- arguments 是一个类数组

## 深度分析与补充

**问题本质解读：** 这道题考察ES6 rest参数与传统arguments的区别，面试官想了解你是否理解现代JavaScript参数处理的优势。

**知识点系统梳理：**

**剩余参数 vs arguments对象：**

1. **类型差异**：rest参数是真正的数组，arguments是类数组对象
2. **方法支持**：rest参数支持所有数组方法，arguments需要转换
3. **作用域**：rest参数在箭头函数中可用，arguments不可用
4. **性能**：rest参数通常性能更好
5. **可读性**：rest参数语义更清晰

**实战应用举例：**

```javascript
// 1. 基本差异对比
function argumentsVsRestComparison() {
  console.log('=== arguments vs rest参数对比 ===')

  // 使用arguments的传统函数
  function traditionalSum() {
    console.log('arguments type:', typeof arguments)
    console.log('arguments is array:', Array.isArray(arguments))
    console.log('arguments object:', arguments)

    // 需要转换为数组才能使用数组方法
    const argsArray = Array.from(arguments)
    return argsArray.reduce((sum, num) => sum + num, 0)
  }

  // 使用rest参数的现代函数
  function modernSum(...numbers) {
    console.log('numbers type:', typeof numbers)
    console.log('numbers is array:', Array.isArray(numbers))
    console.log('numbers array:', numbers)

    // 直接使用数组方法
    return numbers.reduce((sum, num) => sum + num, 0)
  }

  // 箭头函数中的差异
  const arrowSum = (...numbers) => {
    // 箭头函数中没有arguments对象
    // console.log(arguments); // ReferenceError
    return numbers.reduce((sum, num) => sum + num, 0)
  }

  // 测试
  console.log('Traditional sum:', traditionalSum(1, 2, 3, 4))
  console.log('Modern sum:', modernSum(1, 2, 3, 4))
  console.log('Arrow sum:', arrowSum(1, 2, 3, 4))
}
```

```javascript
// 2. 实际应用场景对比
function practicalUsageComparison() {
  console.log('=== 实际应用场景对比 ===')

  // 日志函数 - arguments版本
  function loggerOld(level) {
    const messages = Array.prototype.slice.call(arguments, 1)
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${level.toUpperCase()}:`, ...messages)
  }

  // 日志函数 - rest参数版本
  function loggerNew(level, ...messages) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${level.toUpperCase()}:`, ...messages)
  }

  // 数学工具函数 - arguments版本
  function mathUtilsOld() {
    const numbers = Array.from(arguments)

    return {
      sum: numbers.reduce((a, b) => a + b, 0),
      average: numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0,
      max: Math.max.apply(null, numbers),
      min: Math.min.apply(null, numbers),
      count: numbers.length,
    }
  }

  // 数学工具函数 - rest参数版本
  function mathUtilsNew(...numbers) {
    return {
      sum: numbers.reduce((a, b) => a + b, 0),
      average: numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0,
      max: Math.max(...numbers),
      min: Math.min(...numbers),
      count: numbers.length,
    }
  }

  // 函数组合 - 展示rest参数的优势
  const createPipeline = (...functions) => {
    return input => {
      return functions.reduce((result, fn) => fn(result), input)
    }
  }

  // 中间件系统
  const createMiddleware = (...middlewares) => {
    return async context => {
      for (const middleware of middlewares) {
        context = await middleware(context)
      }
      return context
    }
  }

  // 测试
  loggerOld('info', 'User logged in', { userId: 123 })
  loggerNew('info', 'User logged in', { userId: 123 })

  console.log('Math utils (old):', mathUtilsOld(1, 2, 3, 4, 5))
  console.log('Math utils (new):', mathUtilsNew(1, 2, 3, 4, 5))

  // 函数管道示例
  const double = x => x * 2
  const addTen = x => x + 10
  const square = x => x * x

  const pipeline = createPipeline(double, addTen, square)
  console.log('Pipeline result:', pipeline(5)) // ((5 * 2) + 10)² = 400
}
```

**记忆要点总结：**

- **类型差异**：rest参数是真数组，arguments是类数组对象
- **方法支持**：rest参数直接支持数组方法，arguments需要转换
- **箭头函数**：rest参数在箭头函数中可用，arguments不可用
- **现代推荐**：优先使用rest参数，代码更简洁、性能更好
- **向后兼容**：arguments仍然存在，但在新代码中应避免使用

# **085. [中级]** 扩展运算符的实际应用场景

- 剩余参数
- 解构

## 深度分析与补充

**问题本质解读：** 这道题考察扩展运算符的实际应用，面试官想了解你是否掌握这个强大特性的各种用法。

**技术错误纠正：**

1. 原答案过于简单，缺少具体的应用场景说明
2. "剩余参数"和"解构"只是语法层面，缺少实际业务场景

**知识点系统梳理：**

**扩展运算符的主要应用场景：**

1. **数组操作** - 合并、复制、转换
2. **函数调用** - 展开参数
3. **对象操作** - 合并、复制、更新
4. **字符串处理** - 转换为字符数组
5. **数据结构转换** - Set、Map等转换

**实战应用举例：**

```javascript
// 1. 数组和函数调用中的应用
function arrayAndFunctionApplications() {
  console.log('=== 数组和函数调用应用 ===')

  // 数组合并和操作
  const fruits = ['apple', 'banana']
  const vegetables = ['carrot', 'broccoli']
  const dairy = ['milk', 'cheese']

  // 合并多个数组
  const groceries = [...fruits, ...vegetables, ...dairy]
  console.log('Merged groceries:', groceries)

  // 数组复制（浅拷贝）
  const fruitsCopy = [...fruits]
  fruitsCopy.push('orange')
  console.log('Original fruits:', fruits)
  console.log('Copied fruits:', fruitsCopy)

  // 在数组中插入元素
  const numbers = [1, 2, 3]
  const extendedNumbers = [0, ...numbers, 4, 5]
  console.log('Extended numbers:', extendedNumbers)

  // 函数参数展开
  const mathOperations = {
    max: (...nums) => Math.max(...nums),
    min: (...nums) => Math.min(...nums),
    sum: (...nums) => nums.reduce((a, b) => a + b, 0),
  }

  const scores = [85, 92, 78, 96, 88]
  console.log('Max score:', mathOperations.max(...scores))
  console.log('Min score:', mathOperations.min(...scores))
  console.log('Total score:', mathOperations.sum(...scores))

  // 数组去重
  const duplicates = [1, 2, 2, 3, 3, 4, 5, 5]
  const unique = [...new Set(duplicates)]
  console.log('Unique numbers:', unique)
}
```

```javascript
// 2. 对象操作和实际业务场景
function objectAndBusinessApplications() {
  console.log('=== 对象操作和业务应用 ===')

  // 状态管理（类似Redux）
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    preferences: {
      theme: 'light',
      language: 'en',
    },
  }

  // 不可变状态更新
  const updateUser = (state, user) => ({
    ...state,
    user,
    isLoading: false,
    error: null,
  })

  const updatePreferences = (state, newPrefs) => ({
    ...state,
    preferences: {
      ...state.preferences,
      ...newPrefs,
    },
  })

  // API配置合并
  const defaultApiConfig = {
    baseURL: 'https://api.example.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const createApiConfig = (customConfig = {}) => ({
    ...defaultApiConfig,
    ...customConfig,
    headers: {
      ...defaultApiConfig.headers,
      ...customConfig.headers,
    },
  })

  // 表单数据处理
  const processFormData = (baseData, ...updates) => {
    return updates.reduce(
      (acc, update) => ({
        ...acc,
        ...update,
      }),
      { ...baseData },
    )
  }

  // 购物车操作
  const cartOperations = {
    addItem: (cart, item) => [...cart, item],
    removeItem: (cart, itemId) => cart.filter(item => item.id !== itemId),
    updateItem: (cart, itemId, updates) =>
      cart.map(item => (item.id === itemId ? { ...item, ...updates } : item)),
    mergeCarts: (...carts) => carts.reduce((acc, cart) => [...acc, ...cart], []),
  }

  // 测试
  let state = updateUser(initialState, { id: 1, name: 'John' })
  state = updatePreferences(state, { theme: 'dark' })
  console.log('Updated state:', state)

  const apiConfig = createApiConfig({
    timeout: 10000,
    headers: { Authorization: 'Bearer token' },
  })
  console.log('API config:', apiConfig)

  const formData = processFormData(
    { name: '', email: '' },
    { name: 'John' },
    { email: 'john@example.com', age: 25 },
  )
  console.log('Form data:', formData)

  let cart = []
  cart = cartOperations.addItem(cart, { id: 1, name: 'Apple', price: 1.99 })
  cart = cartOperations.addItem(cart, { id: 2, name: 'Banana', price: 0.99 })
  console.log('Cart after adding items:', cart)
}
```

**记忆要点总结：**

- **数组操作**：合并、复制、去重、插入元素
- **函数调用**：展开数组作为参数传递
- **对象操作**：合并、复制、不可变更新
- **状态管理**：Redux风格的不可变状态更新
- **实际应用**：购物车、表单处理、API配置、数据转换

### Class类（12道）

# **086. [初级]** ES6中如何定义一个类？

```javascript
class Student {
  constructor() {
    this.name = ''
    this.age = ''
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6类的基本语法，面试官想了解你是否掌握现代JavaScript面向对象编程的基础。

**知识点系统梳理：**

**ES6类的基本语法：**

1. **class关键字** - 定义类
2. **constructor方法** - 构造函数
3. **实例方法** - 类的方法
4. **静态方法** - 类级别的方法
5. **getter/setter** - 属性访问器

**类的特点：**

- 类声明不会提升
- 类内部默认严格模式
- 类方法不可枚举
- 必须使用new调用

**实战应用举例：**

```javascript
// 1. 完整的类定义示例
function completeClassDefinition() {
  console.log('=== 完整类定义 ===')

  class Student {
    // 静态属性
    static schoolName = 'JavaScript Academy'
    static studentCount = 0

    // 构造函数
    constructor(name, age, grade) {
      this.name = name
      this.age = age
      this.grade = grade
      this.id = ++Student.studentCount
      this.courses = []
    }

    // 实例方法
    introduce() {
      return `Hi, I'm ${this.name}, ${this.age} years old, in grade ${this.grade}`
    }

    addCourse(course) {
      this.courses.push(course)
      return this
    }

    getCourses() {
      return this.courses.slice() // 返回副本
    }

    // Getter
    get fullInfo() {
      return {
        id: this.id,
        name: this.name,
        age: this.age,
        grade: this.grade,
        courseCount: this.courses.length,
      }
    }

    // Setter
    set studentGrade(newGrade) {
      if (newGrade >= 1 && newGrade <= 12) {
        this.grade = newGrade
      } else {
        throw new Error('Grade must be between 1 and 12')
      }
    }

    // 静态方法
    static createFromString(studentString) {
      const [name, age, grade] = studentString.split(',')
      return new Student(name.trim(), parseInt(age), parseInt(grade))
    }

    static getSchoolInfo() {
      return {
        name: Student.schoolName,
        totalStudents: Student.studentCount,
      }
    }
  }

  // 测试
  const student1 = new Student('Alice', 16, 10)
  const student2 = new Student('Bob', 17, 11)

  console.log(student1.introduce())
  console.log(student1.fullInfo)

  student1.addCourse('Math').addCourse('Science')
  console.log('Courses:', student1.getCourses())

  const student3 = Student.createFromString('Charlie, 15, 9')
  console.log('Created from string:', student3.introduce())

  console.log('School info:', Student.getSchoolInfo())
}
```

```javascript
// 2. 实际应用场景
function practicalClassApplications() {
  console.log('=== 实际应用场景 ===')

  // 数据模型类
  class User {
    constructor(data) {
      this.id = data.id
      this.name = data.name
      this.email = data.email
      this.createdAt = data.createdAt || new Date()
      this.updatedAt = new Date()
    }

    update(data) {
      Object.assign(this, data)
      this.updatedAt = new Date()
      return this
    }

    toJSON() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      }
    }

    static fromJSON(json) {
      return new User(json)
    }
  }

  // API客户端类
  class ApiClient {
    constructor(baseURL, options = {}) {
      this.baseURL = baseURL
      this.timeout = options.timeout || 5000
      this.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    }

    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`
      const config = {
        method: 'GET',
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      }

      console.log(`Making ${config.method} request to ${url}`)
      // 模拟API调用
      return { status: 'success', data: {} }
    }

    get(endpoint, params = {}) {
      const queryString = new URLSearchParams(params).toString()
      const url = queryString ? `${endpoint}?${queryString}` : endpoint
      return this.request(url)
    }

    post(endpoint, data) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    }
  }

  // 测试
  const userData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  }

  const user = new User(userData)
  console.log('User created:', user.toJSON())

  user.update({ name: 'John Smith' })
  console.log('User updated:', user.toJSON())

  const api = new ApiClient('https://api.example.com', {
    headers: { Authorization: 'Bearer token' },
  })

  api.get('/users', { page: 1, limit: 10 })
  api.post('/users', { name: 'New User', email: 'new@example.com' })
}
```

**记忆要点总结：**

- **基本语法**：使用class关键字定义类，constructor定义构造函数
- **方法定义**：直接在类体内定义方法，不需要function关键字
- **静态成员**：使用static关键字定义类级别的属性和方法
- **访问器**：使用get/set定义属性的访问器
- **实际应用**：数据模型、API客户端、工具类等场景

# **087. [中级]** 类的构造函数如何定义？

```javascript
class Student {
  constructor() {
    this.name = ''
    this.age = ''
  }

  sayName() {
    return `hello ${this.name}`
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6类构造函数的定义方式，面试官想了解你是否掌握类的初始化机制。

**知识点系统梳理：**

**构造函数的特点：**

1. **constructor关键字** - 定义构造函数
2. **参数接收** - 接收实例化时的参数
3. **属性初始化** - 设置实例属性
4. **唯一性** - 每个类只能有一个constructor
5. **自动调用** - new实例时自动执行

**构造函数的作用：**

- 初始化实例属性
- 执行初始化逻辑
- 接收外部参数
- 设置默认值

**实战应用举例：**

```javascript
// 1. 构造函数的完整用法
function constructorCompleteUsage() {
  console.log('=== 构造函数完整用法 ===')

  class User {
    constructor(name, email, options = {}) {
      // 参数验证
      if (!name || !email) {
        throw new Error('Name and email are required')
      }

      // 基本属性初始化
      this.id = Date.now() + Math.random()
      this.name = name
      this.email = email
      this.createdAt = new Date()

      // 可选参数处理
      this.role = options.role || 'user'
      this.isActive = options.isActive !== undefined ? options.isActive : true
      this.preferences = {
        theme: 'light',
        language: 'en',
        ...options.preferences,
      }

      // 私有属性（使用约定）
      this._password = null
      this._loginAttempts = 0

      // 初始化方法调用
      this.init()
    }

    init() {
      console.log(`User ${this.name} initialized`)
      this.updateLastActivity()
    }

    updateLastActivity() {
      this.lastActivity = new Date()
    }

    setPassword(password) {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      this._password = password // 实际应用中应该加密
    }

    login(password) {
      if (this._password === password) {
        this._loginAttempts = 0
        this.updateLastActivity()
        return true
      } else {
        this._loginAttempts++
        return false
      }
    }

    getProfile() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        role: this.role,
        isActive: this.isActive,
        createdAt: this.createdAt,
        lastActivity: this.lastActivity,
      }
    }
  }

  // 测试
  const user1 = new User('John Doe', 'john@example.com')
  console.log('User 1 profile:', user1.getProfile())

  const user2 = new User('Jane Smith', 'jane@example.com', {
    role: 'admin',
    preferences: { theme: 'dark', language: 'zh' },
  })
  console.log('User 2 profile:', user2.getProfile())

  user2.setPassword('secret123')
  console.log('Login success:', user2.login('secret123'))
}
```

```javascript
// 2. 实际应用场景 - 配置类和工具类
function practicalConstructorApplications() {
  console.log('=== 实际应用场景 ===')

  // 数据库连接类
  class DatabaseConnection {
    constructor(config) {
      // 配置验证
      this.validateConfig(config)

      // 连接配置
      this.host = config.host
      this.port = config.port || 5432
      this.database = config.database
      this.username = config.username
      this.password = config.password

      // 连接选项
      this.options = {
        maxConnections: 10,
        timeout: 30000,
        retryAttempts: 3,
        ...config.options,
      }

      // 状态管理
      this.isConnected = false
      this.connectionPool = []
      this.stats = {
        totalQueries: 0,
        successfulQueries: 0,
        failedQueries: 0,
      }

      // 自动连接
      if (config.autoConnect !== false) {
        this.connect()
      }
    }

    validateConfig(config) {
      const required = ['host', 'database', 'username', 'password']
      for (const field of required) {
        if (!config[field]) {
          throw new Error(`Database config missing required field: ${field}`)
        }
      }
    }

    connect() {
      console.log(`Connecting to ${this.database} at ${this.host}:${this.port}`)
      this.isConnected = true
      return this
    }

    query(sql, params = []) {
      if (!this.isConnected) {
        throw new Error('Database not connected')
      }

      this.stats.totalQueries++
      console.log(`Executing query: ${sql}`)

      // 模拟查询
      try {
        this.stats.successfulQueries++
        return { success: true, data: [] }
      } catch (error) {
        this.stats.failedQueries++
        throw error
      }
    }

    getStats() {
      return { ...this.stats }
    }
  }

  // HTTP客户端类
  class HttpClient {
    constructor(baseURL, defaultOptions = {}) {
      this.baseURL = baseURL.replace(/\/$/, '') // 移除末尾斜杠
      this.defaultHeaders = {
        'Content-Type': 'application/json',
        'User-Agent': 'CustomHttpClient/1.0',
        ...defaultOptions.headers,
      }

      this.timeout = defaultOptions.timeout || 5000
      this.retries = defaultOptions.retries || 0

      // 拦截器
      this.requestInterceptors = []
      this.responseInterceptors = []

      // 添加默认拦截器
      if (defaultOptions.auth) {
        this.addAuthInterceptor(defaultOptions.auth)
      }
    }

    addAuthInterceptor(auth) {
      this.requestInterceptors.push(config => {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${auth.token}`,
        }
        return config
      })
    }

    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`
      let config = {
        method: 'GET',
        headers: { ...this.defaultHeaders },
        timeout: this.timeout,
        ...options,
      }

      // 应用请求拦截器
      for (const interceptor of this.requestInterceptors) {
        config = interceptor(config)
      }

      console.log(`Making ${config.method} request to ${url}`)
      return { status: 200, data: {} } // 模拟响应
    }
  }

  // 测试
  const db = new DatabaseConnection({
    host: 'localhost',
    database: 'myapp',
    username: 'admin',
    password: 'secret',
    options: { maxConnections: 20 },
  })

  db.query('SELECT * FROM users WHERE active = ?', [true])
  console.log('DB Stats:', db.getStats())

  const httpClient = new HttpClient('https://api.example.com', {
    timeout: 10000,
    auth: { token: 'abc123' },
  })

  httpClient.request('/users')
}
```

**记忆要点总结：**

- **基本语法**：使用constructor关键字定义构造函数
- **参数处理**：接收参数、设置默认值、参数验证
- **属性初始化**：设置实例属性、调用初始化方法
- **实际应用**：数据库连接、HTTP客户端、配置类等场景
- **最佳实践**：参数验证、错误处理、合理的默认值设置

# **088. [中级]** 如何实现类的继承？

```javascript
class Personal {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  eat() {
    return this.name + ' can eat'
  }

  walk() {
    return `${this.name} can walk`
  }
}

class Child extends Personal {
  constructor(name, age) {
    super(name, age)
    this.hobbies = []
  }

  read() {
    return `${this.name} can read`
  }
}

const xiaoMin = new Child('xiaoMin', 12)
xiaoMin.eat()
xiaoMin.read()
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6类继承的实现方式，面试官想了解你是否掌握现代JavaScript继承机制。

**技术错误纠正：**

1. 代码示例中`this.hobies`拼写错误，应为`this.hobbies`
2. `return this.name+'can eat'`缺少空格，应为`return this.name + ' can eat'`

**知识点系统梳理：**

**类继承的关键要素：**

1. **extends关键字** - 建立继承关系
2. **super()调用** - 调用父类构造函数
3. **方法重写** - 覆盖父类方法
4. **super.method()** - 调用父类方法
5. **静态方法继承** - 子类继承父类静态方法

**实战应用举例：**

```javascript
// 1. 完整的类继承示例
function completeClassInheritance() {
  console.log('=== 完整类继承示例 ===')

  // 基类 - 动物
  class Animal {
    static kingdom = 'Animalia'

    constructor(name, species) {
      this.name = name
      this.species = species
      this.energy = 100
      this.age = 0
    }

    eat(food) {
      this.energy += 10
      return `${this.name} is eating ${food}`
    }

    sleep() {
      this.energy += 20
      return `${this.name} is sleeping`
    }

    move() {
      this.energy -= 5
      return `${this.name} is moving`
    }

    getInfo() {
      return `${this.name} (${this.species}) - Energy: ${this.energy}`
    }

    static getKingdom() {
      return Animal.kingdom
    }
  }

  // 子类 - 哺乳动物
  class Mammal extends Animal {
    constructor(name, species, furColor) {
      super(name, species) // 必须调用父类构造函数
      this.furColor = furColor
      this.bodyTemperature = 37
    }

    // 重写父类方法
    move() {
      this.energy -= 3 // 哺乳动物移动消耗更少能量
      return `${this.name} (mammal) is walking gracefully`
    }

    // 新增方法
    regulateTemperature() {
      return `${this.name} maintains body temperature at ${this.bodyTemperature}°C`
    }

    // 重写getInfo，调用父类方法
    getInfo() {
      const baseInfo = super.getInfo()
      return `${baseInfo}, Fur: ${this.furColor}`
    }
  }

  // 孙子类 - 狗
  class Dog extends Mammal {
    constructor(name, breed, furColor) {
      super(name, 'Canis lupus', furColor)
      this.breed = breed
      this.loyalty = 100
      this.tricks = []
    }

    // 重写eat方法
    eat(food) {
      const result = super.eat(food)
      if (food === 'bone') {
        this.energy += 5
        this.loyalty += 10
      }
      return result + ` (${this.breed} loves it!)`
    }

    // 狗特有的方法
    bark() {
      this.energy -= 2
      return `${this.name} the ${this.breed} barks: Woof!`
    }

    learnTrick(trick) {
      this.tricks.push(trick)
      this.loyalty += 5
      return `${this.name} learned ${trick}`
    }

    performTrick(trick) {
      if (this.tricks.includes(trick)) {
        this.energy -= 5
        return `${this.name} performs ${trick}!`
      }
      return `${this.name} doesn't know ${trick}`
    }
  }

  // 测试
  const dog = new Dog('Buddy', 'Golden Retriever', 'golden')

  console.log(dog.getInfo())
  console.log(dog.eat('bone'))
  console.log(dog.bark())
  console.log(dog.learnTrick('sit'))
  console.log(dog.performTrick('sit'))
  console.log(dog.regulateTemperature())

  // 静态方法继承
  console.log('Kingdom:', Dog.getKingdom())
}
```

```javascript
// 2. 实际应用场景 - UI组件继承
function uiComponentInheritance() {
  console.log('=== UI组件继承应用 ===')

  // 基础组件
  class Component {
    constructor(element, options = {}) {
      this.element = element
      this.options = {
        className: '',
        visible: true,
        ...options,
      }
      this.events = new Map()
      this.init()
    }

    init() {
      this.applyOptions()
      this.bindEvents()
    }

    applyOptions() {
      if (this.options.className) {
        this.element.className = this.options.className
      }
      this.setVisible(this.options.visible)
    }

    bindEvents() {
      // 基础事件绑定
    }

    setVisible(visible) {
      this.element.style.display = visible ? 'block' : 'none'
      this.options.visible = visible
    }

    on(event, handler) {
      if (!this.events.has(event)) {
        this.events.set(event, [])
      }
      this.events.get(event).push(handler)
    }

    emit(event, data) {
      if (this.events.has(event)) {
        this.events.get(event).forEach(handler => handler(data))
      }
    }

    destroy() {
      this.events.clear()
      this.element.remove()
    }
  }

  // 表单组件
  class FormComponent extends Component {
    constructor(element, options = {}) {
      super(element, {
        required: false,
        disabled: false,
        ...options,
      })
      this.value = ''
      this.isValid = true
      this.errors = []
    }

    bindEvents() {
      super.bindEvents()

      this.element.addEventListener('change', e => {
        this.setValue(e.target.value)
      })

      this.element.addEventListener('blur', () => {
        this.validate()
      })
    }

    setValue(value) {
      this.value = value
      this.element.value = value
      this.emit('change', { value, component: this })
    }

    validate() {
      this.errors = []

      if (this.options.required && !this.value) {
        this.errors.push('This field is required')
      }

      this.isValid = this.errors.length === 0
      this.emit('validate', { isValid: this.isValid, errors: this.errors })

      return this.isValid
    }

    setDisabled(disabled) {
      this.options.disabled = disabled
      this.element.disabled = disabled
    }
  }

  // 输入框组件
  class InputComponent extends FormComponent {
    constructor(element, options = {}) {
      super(element, {
        type: 'text',
        placeholder: '',
        maxLength: null,
        ...options,
      })
    }

    applyOptions() {
      super.applyOptions()

      this.element.type = this.options.type
      this.element.placeholder = this.options.placeholder

      if (this.options.maxLength) {
        this.element.maxLength = this.options.maxLength
      }
    }

    validate() {
      // 调用父类验证
      super.validate()

      // 添加输入框特定验证
      if (this.options.type === 'email' && this.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(this.value)) {
          this.errors.push('Please enter a valid email address')
        }
      }

      if (this.options.maxLength && this.value.length > this.options.maxLength) {
        this.errors.push(`Maximum length is ${this.options.maxLength} characters`)
      }

      this.isValid = this.errors.length === 0
      this.emit('validate', { isValid: this.isValid, errors: this.errors })

      return this.isValid
    }
  }

  // 使用示例（模拟DOM元素）
  const inputElement = {
    style: {},
    addEventListener: () => {},
    remove: () => {},
    value: '',
  }

  const emailInput = new InputComponent(inputElement, {
    type: 'email',
    required: true,
    placeholder: 'Enter your email',
  })

  emailInput.on('change', data => {
    console.log('Input changed:', data.value)
  })

  emailInput.setValue('test@example.com')
  console.log('Validation result:', emailInput.validate())
}
```

**记忆要点总结：**

- **基本语法**：使用extends关键字建立继承关系
- **super调用**：构造函数中必须调用super()，且在使用this之前
- **方法重写**：子类可以重写父类方法，使用super.method()调用父类方法
- **静态继承**：子类自动继承父类的静态方法和属性
- **实际应用**：动物分类、UI组件、错误处理等场景的继承设计

# **089. [中级]** 类中的静态方法如何定义和使用？

```javascript
class Dog {
  static methodA(arr = []) {
    // return this.name + arr.join('_')
    return arr.join('_')
  }
  constructor() {
    this.name = ''
  }

  methodB(...args) {
    return Dog.methodA(args)
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察ES6类中静态方法的定义和使用，面试官想了解你是否理解静态方法与实例方法的区别。

**技术错误纠正：**

1. 代码示例中`this.name`在静态方法中指向类，而不是实例
2. `methodB`中调用`methodA`应该使用`Dog.methodA`或`this.constructor.methodA`

**知识点系统梳理：**

**静态方法的特点：**

1. **static关键字** - 定义静态方法
2. **类级别调用** - 通过类名调用，不是实例
3. **无this绑定** - 静态方法中的this指向类本身
4. **工具函数** - 通常用作工具函数或工厂方法
5. **继承性** - 子类继承父类的静态方法

**实战应用举例：**

```javascript
// 1. 静态方法的正确用法
function staticMethodsCorrectUsage() {
  console.log('=== 静态方法正确用法 ===')

  class User {
    static userCount = 0

    constructor(name, email) {
      this.id = ++User.userCount
      this.name = name
      this.email = email
      this.createdAt = new Date()
    }

    // 实例方法
    getProfile() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
      }
    }

    // 静态工厂方法
    static createAdmin(name, email) {
      const user = new User(name, email)
      user.role = 'admin'
      return user
    }

    static createGuest() {
      return new User('Guest', 'guest@example.com')
    }

    // 静态工具方法
    static validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    static formatName(firstName, lastName) {
      return `${firstName} ${lastName}`.trim()
    }

    // 静态查询方法
    static findById(users, id) {
      return users.find(user => user.id === id)
    }

    static filterByRole(users, role) {
      return users.filter(user => user.role === role)
    }

    // 静态统计方法
    static getTotalUsers() {
      return User.userCount
    }

    static getUserStats(users) {
      return {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        regular: users.filter(u => !u.role || u.role === 'user').length,
      }
    }
  }

  // 测试
  const user1 = new User('John', 'john@example.com')
  const admin = User.createAdmin('Alice', 'alice@example.com')
  const guest = User.createGuest()

  console.log('User profile:', user1.getProfile())
  console.log('Admin profile:', admin.getProfile())

  console.log('Email validation:', User.validateEmail('test@example.com'))
  console.log('Name formatting:', User.formatName('John', 'Doe'))
  console.log('Total users:', User.getTotalUsers())

  const users = [user1, admin, guest]
  console.log('User stats:', User.getUserStats(users))
}
```

```javascript
// 2. 实际应用场景 - 数学工具类
function mathUtilsStatic() {
  console.log('=== 数学工具类静态方法 ===')

  class MathUtils {
    // 静态常量
    static PI = 3.14159265359
    static E = 2.71828182846

    // 基础数学运算
    static add(...numbers) {
      return numbers.reduce((sum, num) => sum + num, 0)
    }

    static multiply(...numbers) {
      return numbers.reduce((product, num) => product * num, 1)
    }

    static power(base, exponent) {
      return Math.pow(base, exponent)
    }

    // 几何计算
    static circleArea(radius) {
      return MathUtils.PI * MathUtils.power(radius, 2)
    }

    static rectangleArea(width, height) {
      return width * height
    }

    static triangleArea(base, height) {
      return 0.5 * base * height
    }

    // 统计函数
    static average(numbers) {
      if (!Array.isArray(numbers) || numbers.length === 0) {
        return 0
      }
      return MathUtils.add(...numbers) / numbers.length
    }

    static median(numbers) {
      if (!Array.isArray(numbers) || numbers.length === 0) {
        return 0
      }

      const sorted = [...numbers].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)

      return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
    }

    static standardDeviation(numbers) {
      const avg = MathUtils.average(numbers)
      const squaredDiffs = numbers.map(num => MathUtils.power(num - avg, 2))
      return Math.sqrt(MathUtils.average(squaredDiffs))
    }

    // 随机数生成
    static randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    static randomFloat(min, max, decimals = 2) {
      const random = Math.random() * (max - min) + min
      return parseFloat(random.toFixed(decimals))
    }

    // 数组工具
    static shuffle(array) {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = MathUtils.randomInt(0, i)
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    static range(start, end, step = 1) {
      const result = []
      for (let i = start; i < end; i += step) {
        result.push(i)
      }
      return result
    }
  }

  // 测试
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  console.log('Sum:', MathUtils.add(...numbers))
  console.log('Average:', MathUtils.average(numbers))
  console.log('Median:', MathUtils.median(numbers))
  console.log('Standard Deviation:', MathUtils.standardDeviation(numbers))

  console.log('Circle area (r=5):', MathUtils.circleArea(5))
  console.log('Random int (1-100):', MathUtils.randomInt(1, 100))
  console.log('Random float (0-1):', MathUtils.randomFloat(0, 1, 3))

  console.log('Shuffled array:', MathUtils.shuffle(numbers))
  console.log('Range 1-10:', MathUtils.range(1, 11))
}
```

**记忆要点总结：**

- **定义语法**：使用static关键字定义静态方法
- **调用方式**：通过类名调用，不是通过实例
- **this指向**：静态方法中的this指向类本身
- **常见用途**：工厂方法、工具函数、验证方法、查询方法
- **继承特性**：子类自动继承父类的静态方法

# **090. [中级]** 类的私有属性如何实现？

```javascript
class Cat {
  static color = 'yellow_while_black'

  constructor(name) {
    this.name = name
  }

  tellColor() {
    return `${this.name} 's color is ${this.color}`
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript类的私有属性实现方式，面试官想了解你是否掌握现代JavaScript的封装特性。

**技术错误纠正：**

1. 代码示例展示的是静态属性，不是私有属性
2. 缺少私有属性的实际实现方法

**知识点系统梳理：**

**私有属性的实现方式：**

1. **#语法** - ES2022原生私有字段（推荐）
2. **\_约定** - 使用下划线前缀的约定
3. **WeakMap** - 使用WeakMap存储私有数据
4. **闭包** - 使用闭包隐藏私有数据

**实战应用举例：**

```javascript
// 1. 现代私有属性语法（#）
function modernPrivateFields() {
  console.log('=== 现代私有属性语法 ===')

  class BankAccount {
    // 私有字段
    #balance = 0
    #accountNumber
    #pin

    // 公共字段
    accountHolder

    constructor(accountHolder, initialBalance = 0, pin) {
      this.accountHolder = accountHolder
      this.#balance = initialBalance
      this.#accountNumber = this.#generateAccountNumber()
      this.#pin = pin
    }

    // 私有方法
    #generateAccountNumber() {
      return 'ACC' + Date.now() + Math.floor(Math.random() * 1000)
    }

    #validatePin(inputPin) {
      return this.#pin === inputPin
    }

    // 公共方法
    deposit(amount, pin) {
      if (!this.#validatePin(pin)) {
        throw new Error('Invalid PIN')
      }

      if (amount <= 0) {
        throw new Error('Amount must be positive')
      }

      this.#balance += amount
      return this.#balance
    }

    withdraw(amount, pin) {
      if (!this.#validatePin(pin)) {
        throw new Error('Invalid PIN')
      }

      if (amount > this.#balance) {
        throw new Error('Insufficient funds')
      }

      this.#balance -= amount
      return this.#balance
    }

    getBalance(pin) {
      if (!this.#validatePin(pin)) {
        throw new Error('Invalid PIN')
      }
      return this.#balance
    }
  }

  // 测试
  const account = new BankAccount('John Doe', 1000, '1234')
  console.log('Balance:', account.getBalance('1234'))
  account.deposit(500, '1234')

  // 无法访问私有属性
  // console.log(account.#balance); // SyntaxError
}
```

```javascript
// 2. 传统私有属性实现方式
function traditionalPrivateImplementations() {
  console.log('=== 传统私有属性实现 ===')

  // WeakMap实现真正私有
  const privateData = new WeakMap()

  class User {
    constructor(name, email, password) {
      this.name = name
      this.email = email

      // 使用WeakMap存储私有数据
      privateData.set(this, {
        password: password,
        id: Date.now(),
        loginAttempts: 0,
      })
    }

    login(password) {
      const data = privateData.get(this)
      if (data.password === password) {
        data.loginAttempts = 0
        return true
      } else {
        data.loginAttempts++
        return false
      }
    }

    getLoginAttempts() {
      return privateData.get(this).loginAttempts
    }

    changePassword(oldPassword, newPassword) {
      const data = privateData.get(this)
      if (data.password === oldPassword) {
        data.password = newPassword
        return true
      }
      return false
    }
  }

  // 约定式私有属性（_前缀）
  class Product {
    constructor(name, price) {
      this.name = name
      this._price = price // 约定为私有
      this._id = Date.now()
    }

    _calculateTax() {
      return this._price * 0.1
    }

    getPrice() {
      return this._price + this._calculateTax()
    }

    setPrice(newPrice) {
      if (newPrice > 0) {
        this._price = newPrice
      }
    }
  }

  // 测试
  const user = new User('Alice', 'alice@example.com', 'secret')
  console.log('Login success:', user.login('secret'))
  console.log('Login attempts:', user.getLoginAttempts())

  const product = new Product('Laptop', 1000)
  console.log('Product price with tax:', product.getPrice())
  console.log('Can still access _price:', product._price) // 仍可访问
}
```

**记忆要点总结：**

- **现代语法**：使用#定义私有字段和方法，提供真正的封装
- **约定方式**：使用\_前缀表示私有，但仍可被外部访问
- **WeakMap方式**：使用WeakMap存储私有数据，提供真正的私有性
- **最佳实践**：优先使用#语法，在不支持的环境中使用WeakMap
- **封装原则**：私有属性只能在类内部访问，提供更好的数据安全性

# **091. [高级]** super关键字的作用和用法

- ~~实现父属性的超类，调用父属性的方法和属性~~ 访问父类的属性和方法

## 深度分析与补充

**问题本质解读：** 这道题考察super关键字在类继承中的作用，面试官想了解你是否掌握JavaScript继承机制中的关键概念。

**技术错误纠正：**

1. "实现父属性的超类"表述不准确，应该是"访问父类的属性和方法"
2. 缺少super在构造函数中的必要性说明

**知识点系统梳理：**

**super关键字的作用：**

1. **调用父类构造函数** - 在子类constructor中必须调用
2. **访问父类方法** - 通过super.methodName()调用
3. **访问父类属性** - 通过super.propertyName访问
4. **方法重写** - 在重写方法中调用父类原方法
5. **静态方法中使用** - 在静态方法中访问父类静态方法

**super的使用规则：**

- 必须在使用this之前调用super()
- 只能在类的constructor和方法中使用
- 不能在箭头函数中使用

**实战应用举例：**

```javascript
// 1. super在继承中的完整用法
function superInInheritance() {
  console.log('=== super在继承中的用法 ===')

  // 基类 - 车辆
  class Vehicle {
    constructor(brand, model, year) {
      this.brand = brand
      this.model = model
      this.year = year
      this.speed = 0
      this.isRunning = false
    }

    start() {
      this.isRunning = true
      console.log(`${this.brand} ${this.model} started`)
      return this
    }

    stop() {
      this.isRunning = false
      this.speed = 0
      console.log(`${this.brand} ${this.model} stopped`)
      return this
    }

    accelerate(increment) {
      if (this.isRunning) {
        this.speed += increment
        console.log(`Speed: ${this.speed} km/h`)
      } else {
        console.log('Vehicle is not running')
      }
      return this
    }

    getInfo() {
      return `${this.year} ${this.brand} ${this.model}`
    }

    static getVehicleType() {
      return 'Generic Vehicle'
    }
  }

  // 子类 - 汽车
  class Car extends Vehicle {
    constructor(brand, model, year, doors, fuelType) {
      // 必须先调用super()
      super(brand, model, year)
      this.doors = doors
      this.fuelType = fuelType
      this.gear = 'P' // 停车档
    }

    // 重写父类方法，并调用父类方法
    start() {
      console.log('Checking car systems...')
      super.start() // 调用父类的start方法
      this.gear = 'D'
      console.log('Car is ready to drive')
      return this
    }

    // 重写stop方法
    stop() {
      this.gear = 'P'
      super.stop() // 调用父类的stop方法
      console.log('Car parked')
      return this
    }

    // 重写accelerate方法
    accelerate(increment) {
      if (this.gear === 'P') {
        console.log('Cannot accelerate in Park gear')
        return this
      }

      // 调用父类方法并添加额外逻辑
      super.accelerate(increment)

      if (this.speed > 120) {
        console.log('Warning: High speed!')
      }

      return this
    }

    // 重写getInfo方法
    getInfo() {
      const baseInfo = super.getInfo() // 调用父类方法
      return `${baseInfo} - ${this.doors} doors, ${this.fuelType}`
    }

    // 汽车特有方法
    changeGear(newGear) {
      this.gear = newGear
      console.log(`Gear changed to: ${newGear}`)
      return this
    }

    // 静态方法中使用super
    static getVehicleType() {
      const parentType = super.getVehicleType() // 调用父类静态方法
      return `${parentType} -> Car`
    }
  }

  // 孙子类 - 电动车
  class ElectricCar extends Car {
    constructor(brand, model, year, doors, batteryCapacity) {
      // 调用父类构造函数
      super(brand, model, year, doors, 'Electric')
      this.batteryCapacity = batteryCapacity
      this.batteryLevel = 100
    }

    // 重写start方法
    start() {
      if (this.batteryLevel < 10) {
        console.log('Battery too low to start')
        return this
      }

      console.log('Electric motor initializing...')
      super.start() // 调用父类（Car）的start方法
      console.log('Electric car ready')
      return this
    }

    // 重写accelerate方法
    accelerate(increment) {
      super.accelerate(increment) // 调用父类方法

      // 电动车特有的电池消耗
      this.batteryLevel -= increment * 0.1
      console.log(`Battery level: ${this.batteryLevel.toFixed(1)}%`)

      return this
    }

    // 重写getInfo方法
    getInfo() {
      const baseInfo = super.getInfo() // 调用父类方法
      return `${baseInfo}, Battery: ${this.batteryCapacity}kWh`
    }

    // 电动车特有方法
    charge() {
      this.batteryLevel = 100
      console.log('Battery fully charged')
      return this
    }
  }

  // 测试
  const tesla = new ElectricCar('Tesla', 'Model 3', 2023, 4, 75)

  console.log('Car info:', tesla.getInfo()) // Car info: 2023 Tesla Model 3 - 4 doors, Electric
  console.log('Vehicle type:', ElectricCar.getVehicleType()) // Vehicle type: Generic Vehicle -> Car -> Electric Car

  tesla.start().changeGear('D').accelerate(30).accelerate(50).stop()
}
```

```javascript
// 2. super在方法重写中的高级应用
function superInMethodOverriding() {
  console.log('=== super在方法重写中的应用 ===')

  // 基础API客户端
  class ApiClient {
    constructor(baseURL, options = {}) {
      this.baseURL = baseURL
      this.timeout = options.timeout || 5000
      this.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    }

    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`
      const config = {
        method: 'GET',
        timeout: this.timeout,
        headers: { ...this.headers },
        ...options,
      }

      console.log(`Making ${config.method} request to ${url}`)

      // 模拟API调用
      return {
        status: 200,
        data: { message: 'Success' },
        headers: { 'content-type': 'application/json' },
      }
    }

    get(endpoint, params = {}) {
      const queryString = new URLSearchParams(params).toString()
      const url = queryString ? `${endpoint}?${queryString}` : endpoint
      return this.request(url)
    }

    post(endpoint, data) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    }
  }

  // 认证API客户端
  class AuthenticatedApiClient extends ApiClient {
    constructor(baseURL, token, options = {}) {
      // 调用父类构造函数
      super(baseURL, options)
      this.token = token
      this.refreshToken = options.refreshToken
    }

    // 重写request方法，添加认证逻辑
    async request(endpoint, options = {}) {
      // 添加认证头
      const authOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.token}`,
        },
      }

      try {
        // 调用父类的request方法
        const response = await super.request(endpoint, authOptions)

        // 检查认证状态
        if (response.status === 401) {
          console.log('Token expired, attempting refresh...')
          await this.refreshAccessToken()

          // 重新调用父类方法
          authOptions.headers['Authorization'] = `Bearer ${this.token}`
          return super.request(endpoint, authOptions)
        }

        return response
      } catch (error) {
        console.error('Request failed:', error.message)
        throw error
      }
    }

    async refreshAccessToken() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      console.log('Refreshing access token...')
      // 模拟token刷新
      this.token = 'new_access_token_' + Date.now()
    }

    // 重写post方法，添加额外验证
    async post(endpoint, data) {
      // 数据验证
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data for POST request')
      }

      console.log('Validating POST data...')

      // 调用父类的post方法
      return super.post(endpoint, data)
    }
  }

  // 缓存API客户端
  class CachedApiClient extends AuthenticatedApiClient {
    constructor(baseURL, token, options = {}) {
      super(baseURL, token, options)
      this.cache = new Map()
      this.cacheTimeout = options.cacheTimeout || 300000 // 5分钟
    }

    // 重写get方法，添加缓存逻辑
    async get(endpoint, params = {}) {
      const cacheKey = `${endpoint}_${JSON.stringify(params)}`
      const cached = this.cache.get(cacheKey)

      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('Returning cached response')
        return cached.data
      }

      console.log('Cache miss, making request...')

      // 调用父类的get方法
      const response = await super.get(endpoint, params)

      // 缓存响应
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      })

      return response
    }

    clearCache() {
      this.cache.clear()
      console.log('Cache cleared')
    }
  }

  // 测试
  const client = new CachedApiClient('https://api.example.com', 'access_token_123', {
    cacheTimeout: 60000,
  })

  client.get('/users', { page: 1 })
  client.post('/users', { name: 'John', email: 'john@example.com' })
}
```

**记忆要点总结：**

- **构造函数中**：必须调用super()，且在使用this之前
- **方法重写**：使用super.methodName()调用父类方法
- **静态方法**：使用super.staticMethod()调用父类静态方法
- **属性访问**：通过super访问父类属性和方法
- **实际应用**：继承链中的方法增强、API客户端扩展、组件继承

# **092. [中级]** 类表达式和类声明的区别

```javascript
const MyClass = class My {
  getName() {
    return My.name
  }
}

class MY {
  sayName() {
    return 'say my name'
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察类表达式和类声明的区别，面试官想了解你是否理解JavaScript中定义类的不同方式。

**知识点系统梳理：**

**类声明 vs 类表达式：**

1. **语法形式** - class声明 vs const/let/var赋值
2. **提升行为** - 类声明不提升，类表达式也不提升
3. **命名方式** - 类表达式可以是匿名的或命名的
4. **作用域** - 类声明创建块级作用域绑定
5. **使用时机** - 类表达式更灵活，可用于条件创建

**主要区别：**

- 类声明：在整个作用域内可见
- 类表达式：只在赋值后可用
- 命名类表达式：内部可以引用自己的名称

**实战应用举例：**

```javascript
// 1. 类声明和类表达式的基本区别
function classDeclarationVsExpression() {
  console.log('=== 类声明 vs 类表达式 ===')

  // 类声明
  class UserDeclaration {
    constructor(name) {
      this.name = name
    }

    greet() {
      return `Hello, I'm ${this.name}`
    }
  }

  // 匿名类表达式
  const UserExpression = class {
    constructor(name) {
      this.name = name
    }

    greet() {
      return `Hi, I'm ${this.name}`
    }
  }

  // 命名类表达式
  const UserNamed = class User {
    constructor(name) {
      this.name = name
    }

    greet() {
      return `Hey, I'm ${this.name}`
    }

    getClassName() {
      return User.name // 可以在内部引用类名
    }
  }

  // 测试
  const user1 = new UserDeclaration('Alice')
  const user2 = new UserExpression('Bob')
  const user3 = new UserNamed('Charlie')

  console.log(user1.greet()) // Hello, I'm Alice
  console.log(user2.greet()) // Hi, I'm Bob
  console.log(user3.greet()) // Hey, I'm Charlie
  console.log('Named class internal name:', user3.getClassName()) // User

  // 提升行为测试
  console.log('Declaration available:', typeof UserDeclaration) // "function"
  console.log('Expression available:', typeof UserExpression) // "function"

  // 类声明和表达式都不会提升到声明之前
  // console.log(new EarlyClass()); // ReferenceError

  class EarlyClass {
    constructor() {
      this.created = true
    }
  }
}
```

```javascript
// 2. 实际应用场景
function practicalClassExpressionUsage() {
  console.log('=== 类表达式实际应用 ===')

  // 工厂函数 - 根据条件创建不同的类
  function createUserClass(type) {
    if (type === 'admin') {
      return class AdminUser {
        constructor(name) {
          this.name = name
          this.role = 'admin'
          this.permissions = ['read', 'write', 'delete']
        }

        hasPermission(action) {
          return this.permissions.includes(action)
        }

        getInfo() {
          return `Admin: ${this.name}`
        }
      }
    } else if (type === 'guest') {
      return class GuestUser {
        constructor(name = 'Guest') {
          this.name = name
          this.role = 'guest'
          this.permissions = ['read']
        }

        hasPermission(action) {
          return this.permissions.includes(action)
        }

        getInfo() {
          return `Guest: ${this.name}`
        }
      }
    } else {
      return class RegularUser {
        constructor(name) {
          this.name = name
          this.role = 'user'
          this.permissions = ['read', 'write']
        }

        hasPermission(action) {
          return this.permissions.includes(action)
        }

        getInfo() {
          return `User: ${this.name}`
        }
      }
    }
  }

  // 混入模式 - 动态创建带有特定功能的类
  function withLogging(BaseClass) {
    return class extends BaseClass {
      constructor(...args) {
        super(...args)
        this.logs = []
      }

      log(message) {
        this.logs.push({
          message,
          timestamp: new Date().toISOString(),
        })
        console.log(`[${this.constructor.name}] ${message}`)
      }

      getLogs() {
        return this.logs.slice()
      }
    }
  }

  function withValidation(BaseClass) {
    return class extends BaseClass {
      constructor(...args) {
        super(...args)
        this.validate()
      }

      validate() {
        if (!this.name || this.name.trim() === '') {
          throw new Error('Name is required')
        }
      }

      setName(newName) {
        if (!newName || newName.trim() === '') {
          throw new Error('Name cannot be empty')
        }
        this.name = newName
      }
    }
  }

  // 配置驱动的类创建
  function createConfigurableClass(config) {
    const methods = {}

    // 动态添加方法
    if (config.methods) {
      Object.assign(methods, config.methods)
    }

    return class ConfigurableClass {
      constructor(data = {}) {
        Object.assign(this, config.defaultProps || {})
        Object.assign(this, data)

        // 动态绑定方法
        Object.keys(methods).forEach(methodName => {
          this[methodName] = methods[methodName].bind(this)
        })
      }

      getConfig() {
        return config
      }
    }
  }

  // 测试
  const AdminClass = createUserClass('admin')
  const GuestClass = createUserClass('guest')

  const admin = new AdminClass('Alice')
  const guest = new GuestClass()

  console.log(admin.getInfo())
  console.log('Admin can delete:', admin.hasPermission('delete'))
  console.log(guest.getInfo())
  console.log('Guest can write:', guest.hasPermission('write'))

  // 使用混入
  const BaseUser = createUserClass('user')
  const LoggingUser = withLogging(BaseUser)
  const ValidatedLoggingUser = withValidation(LoggingUser)

  const user = new ValidatedLoggingUser('Bob')
  user.log('User created')
  user.log('User logged in')
  console.log('User logs:', user.getLogs()) // [ { message: 'User created', timestamp: '...' }, { message: 'User logged in', timestamp: '...' } ]

  // 配置驱动的类
  const ProductClass = createConfigurableClass({
    defaultProps: {
      price: 0,
      category: 'general',
    },
    methods: {
      getDisplayPrice() {
        return `$${this.price.toFixed(2)}`
      },
      applyDiscount(percentage) {
        this.price *= 1 - percentage / 100
        return this
      },
    },
  })

  const product = new ProductClass({ name: 'Laptop', price: 999.99 })
  console.log('Product price:', product.getDisplayPrice())
  product.applyDiscount(10)
  console.log('Discounted price:', product.getDisplayPrice())
}
```

**记忆要点总结：**

- **类声明**：使用class关键字声明，在整个作用域内可见
- **类表达式**：赋值给变量，可以是匿名或命名的
- **提升行为**：两者都不会提升，必须先声明后使用
- **实际应用**：工厂模式、条件创建、混入模式、配置驱动
- **灵活性**：类表达式更适合动态创建和函数式编程场景

# **093. [高级]** 如何在类中定义getter和setter？

```javascript
class Count {
  constructor() {
    this.count = 0
  }

  set count(value) {
    // this.count = count
    this.count = value
  }

  get count() {
    return this.count
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察类中getter和setter的定义方式，面试官想了解你是否掌握JavaScript属性访问器的使用。

**技术错误纠正：**

1. 代码示例中存在严重错误：setter中`this.count = count`会导致无限递归
2. getter和setter同时定义会与constructor中的`this.count = 0`冲突
3. 应该使用私有属性或不同的属性名来避免冲突

**知识点系统梳理：**

**Getter和Setter的特点：**

1. **get关键字** - 定义属性的读取访问器
2. **set关键字** - 定义属性的写入访问器
3. **计算属性** - 可以基于其他属性计算值
4. **数据验证** - 在setter中进行数据验证
5. **副作用控制** - 在访问时执行额外逻辑

**实战应用举例：**

```javascript
// 1. 正确的getter和setter实现
function correctGetterSetter() {
  console.log('=== 正确的getter和setter实现 ===')

  class Temperature {
    constructor(celsius = 0) {
      this._celsius = celsius // 使用私有属性
    }

    // Celsius的getter和setter
    get celsius() {
      return this._celsius
    }

    set celsius(value) {
      if (typeof value !== 'number') {
        throw new Error('Temperature must be a number')
      }
      if (value < -273.15) {
        throw new Error('Temperature cannot be below absolute zero')
      }
      this._celsius = value
    }

    // Fahrenheit的getter和setter（计算属性）
    get fahrenheit() {
      return (this._celsius * 9) / 5 + 32
    }

    set fahrenheit(value) {
      if (typeof value !== 'number') {
        throw new Error('Temperature must be a number')
      }
      this.celsius = ((value - 32) * 5) / 9 // 使用celsius setter进行验证
    }

    // Kelvin的getter和setter
    get kelvin() {
      return this._celsius + 273.15
    }

    set kelvin(value) {
      if (typeof value !== 'number') {
        throw new Error('Temperature must be a number')
      }
      this.celsius = value - 273.15 // 使用celsius setter进行验证
    }

    // 只读属性
    get description() {
      if (this._celsius < 0) return 'Freezing'
      if (this._celsius < 10) return 'Cold'
      if (this._celsius < 25) return 'Cool'
      if (this._celsius < 35) return 'Warm'
      return 'Hot'
    }

    toString() {
      return `${this._celsius}°C (${this.fahrenheit.toFixed(1)}°F)`
    }
  }

  // 用户类 - 展示数据验证
  class User {
    constructor(name, email) {
      this._name = name
      this._email = email
      this._age = null
      this._lastLogin = null
    }

    get name() {
      return this._name
    }

    set name(value) {
      if (!value || typeof value !== 'string') {
        throw new Error('Name must be a non-empty string')
      }
      if (value.length < 2) {
        throw new Error('Name must be at least 2 characters long')
      }
      this._name = value.trim()
    }

    get email() {
      return this._email
    }

    set email(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        throw new Error('Invalid email format')
      }
      this._email = value.toLowerCase()
    }

    get age() {
      return this._age
    }

    set age(value) {
      if (value !== null && (typeof value !== 'number' || value < 0 || value > 150)) {
        throw new Error('Age must be a number between 0 and 150')
      }
      this._age = value
    }

    // 计算属性
    get isAdult() {
      return this._age !== null && this._age >= 18
    }

    get displayName() {
      return this._name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
    }

    // 带副作用的setter
    set lastLogin(value) {
      this._lastLogin = value
      console.log(`User ${this._name} logged in at ${value}`)
    }

    get lastLogin() {
      return this._lastLogin
    }

    get profile() {
      return {
        name: this.displayName,
        email: this._email,
        age: this._age,
        isAdult: this.isAdult,
        lastLogin: this._lastLogin,
      }
    }
  }

  // 测试
  const temp = new Temperature(25)
  console.log('Temperature:', temp.toString())
  console.log('Description:', temp.description)

  temp.fahrenheit = 86
  console.log('After setting Fahrenheit:', temp.toString())

  const user = new User('john doe', 'JOHN@EXAMPLE.COM')
  user.age = 25
  user.lastLogin = new Date()

  console.log('User profile:', user.profile) // { name: 'John Doe', email: 'john@example.com', age: 25, isAdult: true, lastLogin: ... }
  console.log('Display name:', user.displayName) // John Doe
  console.log('Is adult:', user.isAdult) // true
}
```

```javascript
// 2. 高级应用场景
function advancedGetterSetterUsage() {
  console.log('=== 高级getter和setter应用 ===')

  // 响应式数据类
  class ReactiveData {
    constructor(data = {}) {
      this._data = {}
      this._watchers = new Map()

      // 为每个属性创建getter和setter
      Object.keys(data).forEach(key => {
        this._data[key] = data[key]
        this._createReactiveProperty(key)
      })
    }

    _createReactiveProperty(key) {
      Object.defineProperty(this, key, {
        get() {
          return this._data[key]
        },
        set(value) {
          const oldValue = this._data[key]
          this._data[key] = value
          this._notify(key, value, oldValue)
        },
        enumerable: true,
        configurable: true,
      })
    }

    _notify(key, newValue, oldValue) {
      if (this._watchers.has(key)) {
        this._watchers.get(key).forEach(callback => {
          callback(newValue, oldValue)
        })
      }
    }

    watch(key, callback) {
      if (!this._watchers.has(key)) {
        this._watchers.set(key, [])
      }
      this._watchers.get(key).push(callback)
    }

    addProperty(key, value) {
      this._data[key] = value
      this._createReactiveProperty(key)
    }
  }

  // 配置管理类
  class ConfigManager {
    constructor(defaultConfig = {}) {
      this._config = { ...defaultConfig }
      this._validators = new Map()
      this._transformers = new Map()
    }

    // 动态创建配置属性的getter和setter
    defineConfig(key, options = {}) {
      const { validator, transformer, defaultValue } = options

      if (defaultValue !== undefined) {
        this._config[key] = defaultValue
      }

      if (validator) {
        this._validators.set(key, validator)
      }

      if (transformer) {
        this._transformers.set(key, transformer)
      }

      Object.defineProperty(this, key, {
        get() {
          return this._config[key]
        },
        set(value) {
          // 验证
          if (this._validators.has(key)) {
            const isValid = this._validators.get(key)(value)
            if (!isValid) {
              throw new Error(`Invalid value for ${key}: ${value}`)
            }
          }

          // 转换
          let finalValue = value
          if (this._transformers.has(key)) {
            finalValue = this._transformers.get(key)(value)
          }

          this._config[key] = finalValue
        },
        enumerable: true,
        configurable: true,
      })
    }

    get allConfig() {
      return { ...this._config }
    }

    reset() {
      Object.keys(this._config).forEach(key => {
        delete this[key]
      })
      this._config = {}
      this._validators.clear()
      this._transformers.clear()
    }
  }

  // 测试响应式数据
  const reactive = new ReactiveData({ count: 0, name: 'Test' })

  reactive.watch('count', (newVal, oldVal) => {
    console.log(`Count changed from ${oldVal} to ${newVal}`)
  })

  reactive.count = 5 // 触发watcher
  reactive.count = 10 // 再次触发watcher

  // 测试配置管理
  const config = new ConfigManager()

  config.defineConfig('port', {
    validator: value => typeof value === 'number' && value > 0 && value < 65536,
    defaultValue: 3000,
  })

  config.defineConfig('host', {
    transformer: value => value.toLowerCase(),
    defaultValue: 'localhost',
  })

  console.log('Default config:', config.allConfig)

  config.port = 8080
  config.host = 'EXAMPLE.COM'

  console.log('Updated config:', config.allConfig)

  try {
    config.port = -1 // 会抛出错误
  } catch (error) {
    console.log('Validation error:', error.message)
  }
}
```

**记忆要点总结：**

- **基本语法**：使用get和set关键字定义属性访问器
- **避免冲突**：使用私有属性（\_前缀）存储实际值
- **数据验证**：在setter中进行输入验证和类型检查
- **计算属性**：getter可以基于其他属性计算返回值
- **实际应用**：数据验证、单位转换、响应式系统、配置管理

# **094. [中级]** 类的实例方法和原型方法的区别

## 深度分析与补充

**问题本质解读：** 这道题考察类中实例方法和原型方法的区别，面试官想了解你是否理解JavaScript类的方法定义机制。

**知识点系统梳理：**

**实例方法 vs 原型方法：**

1. **定义位置** - 实例方法在constructor中定义，原型方法在类体中定义
2. **存储位置** - 实例方法存储在每个实例上，原型方法存储在原型上
3. **内存占用** - 实例方法每个实例都有副本，原型方法共享
4. **访问方式** - 都通过实例访问，但查找机制不同
5. **this绑定** - 实例方法this绑定更稳定，原型方法依赖调用方式

**实战应用举例：**

```javascript
// 1. 实例方法和原型方法的基本区别
function instanceVsPrototypeMethods() {
  console.log('=== 实例方法 vs 原型方法 ===')

  class Calculator {
    constructor(initialValue = 0) {
      this.value = initialValue
      this.history = []

      // 实例方法 - 每个实例都有自己的副本
      this.logOperation = function (operation, operand, result) {
        this.history.push({
          operation,
          operand,
          result,
          timestamp: new Date(),
        })
        console.log(`${operation} ${operand} = ${result}`)
      }

      // 实例箭头函数 - this绑定更稳定
      this.reset = () => {
        this.value = 0
        this.history = []
        console.log('Calculator reset')
      }
    }

    // 原型方法 - 所有实例共享
    add(num) {
      const result = this.value + num
      this.logOperation('add', num, result)
      this.value = result
      return this
    }

    subtract(num) {
      const result = this.value - num
      this.logOperation('subtract', num, result)
      this.value = result
      return this
    }

    multiply(num) {
      const result = this.value * num
      this.logOperation('multiply', num, result)
      this.value = result
      return this
    }

    // 原型方法
    getHistory() {
      return this.history.slice() // 返回副本
    }

    // 原型方法
    getValue() {
      return this.value
    }

    // 静态方法 - 属于类，不是实例
    static create(initialValue) {
      return new Calculator(initialValue)
    }
  }

  // 测试
  const calc1 = new Calculator(10)
  const calc2 = new Calculator(20)

  console.log('calc1 === calc2:', calc1 === calc2) // false
  console.log('calc1.add === calc2.add:', calc1.add === calc2.add) // true (原型方法)
  console.log(
    'calc1.logOperation === calc2.logOperation:',
    calc1.logOperation === calc2.logOperation,
  ) // false (实例方法)
  console.log('calc1.reset === calc2.reset:', calc1.reset === calc2.reset) // false (实例箭头函数)

  calc1.add(5).multiply(2)
  console.log('calc1 value:', calc1.getValue())
  console.log('calc1 history length:', calc1.getHistory().length)

  calc2.subtract(5).multiply(3)
  console.log('calc2 value:', calc2.getValue())
  console.log('calc2 history length:', calc2.getHistory().length)

  // 方法绑定测试
  const addMethod = calc1.add
  const resetMethod = calc1.reset

  try {
    // addMethod(10); // 会出错，因为this丢失
  } catch (error) {
    console.log('Prototype method binding error')
  }

  resetMethod() // 箭头函数，this绑定稳定
  console.log('After reset, calc1 value:', calc1.getValue())
}
```

```javascript
// 2. 实际应用场景对比
function practicalMethodComparison() {
  console.log('=== 实际应用场景对比 ===')

  // 事件处理器类 - 展示实例方法的优势
  class EventHandler {
    constructor(element) {
      this.element = element
      this.listeners = new Map()

      // 实例方法 - 每个处理器有自己的绑定逻辑
      this.handleClick = event => {
        console.log(`Click handled by ${this.constructor.name}`)
        this.triggerCustomEvent('click', event)
      }

      this.handleKeydown = event => {
        console.log(`Keydown handled: ${event.key}`)
        this.triggerCustomEvent('keydown', event)
      }
    }

    // 原型方法 - 所有实例共享的通用逻辑
    addEventListener(eventType, callback) {
      if (!this.listeners.has(eventType)) {
        this.listeners.set(eventType, [])
      }
      this.listeners.get(eventType).push(callback)

      // 绑定原生事件
      if (eventType === 'click') {
        this.element.addEventListener('click', this.handleClick)
      } else if (eventType === 'keydown') {
        this.element.addEventListener('keydown', this.handleKeydown)
      }
    }

    removeEventListener(eventType, callback) {
      if (this.listeners.has(eventType)) {
        const callbacks = this.listeners.get(eventType)
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }

    triggerCustomEvent(eventType, originalEvent) {
      if (this.listeners.has(eventType)) {
        this.listeners.get(eventType).forEach(callback => {
          callback(originalEvent)
        })
      }
    }

    destroy() {
      this.listeners.clear()
      this.element.removeEventListener('click', this.handleClick)
      this.element.removeEventListener('keydown', this.handleKeydown)
    }
  }

  // 数据模型类 - 展示原型方法的优势
  class DataModel {
    constructor(data = {}) {
      this.data = { ...data }
      this.changes = []

      // 实例方法 - 特定于实例的状态管理
      this.trackChange = (field, oldValue, newValue) => {
        this.changes.push({
          field,
          oldValue,
          newValue,
          timestamp: Date.now(),
        })
      }
    }

    // 原型方法 - 通用的数据操作
    get(field) {
      return this.data[field]
    }

    set(field, value) {
      const oldValue = this.data[field]
      this.data[field] = value
      this.trackChange(field, oldValue, value)
      return this
    }

    update(updates) {
      Object.keys(updates).forEach(field => {
        this.set(field, updates[field])
      })
      return this
    }

    toJSON() {
      return { ...this.data }
    }

    getChanges() {
      return this.changes.slice()
    }

    hasChanged() {
      return this.changes.length > 0
    }

    // 静态工厂方法
    static fromJSON(json) {
      return new DataModel(json)
    }

    static merge(...models) {
      const mergedData = {}
      models.forEach(model => {
        Object.assign(mergedData, model.toJSON())
      })
      return new DataModel(mergedData)
    }
  }

  // 性能对比类
  class PerformanceTest {
    constructor(name) {
      this.name = name
      this.results = []

      // 实例方法 - 每个实例独立的计时器
      this.startTime = null
      this.start = () => {
        this.startTime = performance.now()
      }

      this.end = () => {
        if (this.startTime) {
          const duration = performance.now() - this.startTime
          this.results.push(duration)
          this.startTime = null
          return duration
        }
        return 0
      }
    }

    // 原型方法 - 共享的分析逻辑
    getAverageTime() {
      if (this.results.length === 0) return 0
      return this.results.reduce((sum, time) => sum + time, 0) / this.results.length
    }

    getMinTime() {
      return this.results.length > 0 ? Math.min(...this.results) : 0
    }

    getMaxTime() {
      return this.results.length > 0 ? Math.max(...this.results) : 0
    }

    reset() {
      this.results = []
      this.startTime = null
    }

    getReport() {
      return {
        name: this.name,
        tests: this.results.length,
        average: this.getAverageTime(),
        min: this.getMinTime(),
        max: this.getMaxTime(),
      }
    }
  }

  // 测试
  const model1 = new DataModel({ name: 'John', age: 25 })
  const model2 = new DataModel({ name: 'Jane', age: 30 })

  model1.set('email', 'john@example.com')
  model2.set('city', 'New York')

  console.log('Model1 changes:', model1.getChanges().length)
  console.log('Model2 changes:', model2.getChanges().length)

  // 验证原型方法共享
  console.log('Models share get method:', model1.get === model2.get)
  console.log('Models have different trackChange:', model1.trackChange === model2.trackChange)

  const perf = new PerformanceTest('Array Operations')
  perf.start()
  // 模拟一些操作
  const arr = new Array(1000).fill(0).map((_, i) => i)
  perf.end()

  console.log('Performance report:', perf.getReport())
}
```

**记忆要点总结：**

- **实例方法**：在constructor中定义，每个实例都有副本，this绑定稳定
- **原型方法**：在类体中定义，所有实例共享，节省内存
- **使用场景**：实例方法适合特定于实例的逻辑，原型方法适合通用功能
- **性能考虑**：原型方法内存效率更高，实例方法this绑定更安全
- **最佳实践**：优先使用原型方法，特殊情况下使用实例方法

# **095. [高级]** 类的继承如何实现方法重写？

```javascript
class Parent {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  sayHello() {
    return `hi~ ${this.name}`
  }
}

class Child extends Parent {
  constructor(name, age = 0, friends) {
    super(name, age)
    this.friends = friends
  }

  sayHello() {
    super.sayHello()
    return `hello~ my friends ${this.friends.join(' ')}`
  }
}

const xiaoMin = new Child('xiaomin', ['alice', 'jone', 'mike'])
xiaoMin.sayHello()
```

## 深度分析与补充

**问题本质解读：** 这道题考察类继承中的方法重写机制，面试官想了解你是否掌握面向对象编程中的多态性实现。

**技术错误纠正：**

1. 代码示例中`firends`拼写错误，应为`friends`
2. 构造函数中缺少age参数的处理
3. 缺少super调用父类方法的示例

**知识点系统梳理：**

**方法重写的特点：**

1. **同名方法** - 子类定义与父类同名的方法
2. **覆盖行为** - 子类方法会覆盖父类方法
3. **super调用** - 可以通过super调用父类被重写的方法
4. **多态性** - 同一接口的不同实现
5. **运行时绑定** - 根据实际对象类型调用相应方法

**实战应用举例：**

```javascript
// 1. 完整的方法重写示例
function methodOverridingComplete() {
  console.log('=== 完整的方法重写示例 ===')

  // 基类 - 形状
  class Shape {
    constructor(color = 'black') {
      this.color = color
      this.created = new Date()
    }

    // 基础方法
    getInfo() {
      return `A ${this.color} shape created at ${this.created.toLocaleTimeString()}`
    }

    // 将被重写的方法
    calculateArea() {
      throw new Error('calculateArea must be implemented by subclass')
    }

    calculatePerimeter() {
      throw new Error('calculatePerimeter must be implemented by subclass')
    }

    draw() {
      console.log(`Drawing a ${this.color} shape`)
    }

    // 通用方法
    changeColor(newColor) {
      const oldColor = this.color
      this.color = newColor
      console.log(`Color changed from ${oldColor} to ${newColor}`)
    }
  }

  // 子类 - 圆形
  class Circle extends Shape {
    constructor(radius, color = 'red') {
      super(color)
      this.radius = radius
    }

    // 重写getInfo方法，并调用父类方法
    getInfo() {
      const baseInfo = super.getInfo() // 调用父类方法
      return `${baseInfo} - Circle with radius ${this.radius}`
    }

    // 重写抽象方法
    calculateArea() {
      return Math.PI * this.radius * this.radius
    }

    calculatePerimeter() {
      return 2 * Math.PI * this.radius
    }

    // 重写draw方法
    draw() {
      super.draw() // 调用父类方法
      console.log(`Drawing circle with radius ${this.radius}`)
    }

    // 圆形特有方法
    getDiameter() {
      return this.radius * 2
    }
  }

  // 子类 - 矩形
  class Rectangle extends Shape {
    constructor(width, height, color = 'blue') {
      super(color)
      this.width = width
      this.height = height
    }

    // 重写getInfo方法
    getInfo() {
      const baseInfo = super.getInfo()
      return `${baseInfo} - Rectangle ${this.width}x${this.height}`
    }

    // 重写抽象方法
    calculateArea() {
      return this.width * this.height
    }

    calculatePerimeter() {
      return 2 * (this.width + this.height)
    }

    // 重写draw方法
    draw() {
      super.draw()
      console.log(`Drawing rectangle ${this.width}x${this.height}`)
    }

    // 矩形特有方法
    isSquare() {
      return this.width === this.height
    }
  }

  // 孙子类 - 正方形
  class Square extends Rectangle {
    constructor(side, color = 'green') {
      super(side, side, color) // 调用父类构造函数
      this.side = side
    }

    // 重写getInfo方法
    getInfo() {
      const baseInfo = super.getInfo()
      return baseInfo.replace('Rectangle', 'Square')
    }

    // 重写draw方法
    draw() {
      console.log(`Drawing a ${this.color} square`)
      console.log(`Square with side ${this.side}`)
    }

    // 重写父类的特有方法
    isSquare() {
      return true // 正方形总是正方形
    }
  }

  // 测试多态性
  const shapes = [new Circle(5, 'red'), new Rectangle(4, 6, 'blue'), new Square(3, 'green')]

  shapes.forEach(shape => {
    console.log('\n--- Shape Info ---')
    console.log(shape.getInfo())
    console.log(`Area: ${shape.calculateArea().toFixed(2)}`)
    console.log(`Perimeter: ${shape.calculatePerimeter().toFixed(2)}`)
    shape.draw()
  })
}
```

```javascript
// 2. 实际应用场景 - 数据处理管道
function dataProcessingPipeline() {
  console.log('=== 数据处理管道方法重写 ===')

  // 基础数据处理器
  class DataProcessor {
    constructor(name) {
      this.name = name
      this.processedCount = 0
      this.errors = []
    }

    // 基础处理流程
    process(data) {
      console.log(`${this.name} processing data...`)

      try {
        // 验证数据
        this.validate(data)

        // 转换数据
        const transformed = this.transform(data)

        // 后处理
        const result = this.postProcess(transformed)

        this.processedCount++
        return result
      } catch (error) {
        this.errors.push({
          error: error.message,
          data,
          timestamp: new Date(),
        })
        throw error
      }
    }

    // 将被子类重写的方法
    validate(data) {
      if (!data) {
        throw new Error('Data is required')
      }
    }

    transform(data) {
      return data // 默认不转换
    }

    postProcess(data) {
      return data // 默认不后处理
    }

    // 通用方法
    getStats() {
      return {
        name: this.name,
        processed: this.processedCount,
        errors: this.errors.length,
      }
    }

    reset() {
      this.processedCount = 0
      this.errors = []
    }
  }

  // 用户数据处理器
  class UserDataProcessor extends DataProcessor {
    constructor() {
      super('User Data Processor')
    }

    // 重写验证方法
    validate(data) {
      super.validate(data) // 调用父类验证

      if (!data.name || typeof data.name !== 'string') {
        throw new Error('Valid name is required')
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Valid email is required')
      }
    }

    // 重写转换方法
    transform(data) {
      const baseTransform = super.transform(data)

      return {
        ...baseTransform,
        id: Date.now() + Math.random(),
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        createdAt: new Date().toISOString(),
        isActive: true,
      }
    }

    // 重写后处理方法
    postProcess(data) {
      const processed = super.postProcess(data)

      // 添加用户特定的后处理
      processed.displayName = processed.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')

      return processed
    }
  }

  // 产品数据处理器
  class ProductDataProcessor extends DataProcessor {
    constructor() {
      super('Product Data Processor')
    }

    // 重写验证方法
    validate(data) {
      super.validate(data)

      if (!data.name || typeof data.name !== 'string') {
        throw new Error('Product name is required')
      }

      if (typeof data.price !== 'number' || data.price < 0) {
        throw new Error('Valid price is required')
      }
    }

    // 重写转换方法
    transform(data) {
      const baseTransform = super.transform(data)

      return {
        ...baseTransform,
        id: `PROD_${Date.now()}`,
        name: data.name.trim(),
        price: parseFloat(data.price.toFixed(2)),
        category: data.category || 'general',
        inStock: data.quantity > 0,
        createdAt: new Date().toISOString(),
      }
    }

    // 重写后处理方法
    postProcess(data) {
      const processed = super.postProcess(data)

      // 计算税后价格
      processed.priceWithTax = processed.price * 1.1

      // 生成SKU
      processed.sku = `${processed.category.toUpperCase()}_${processed.id}`

      return processed
    }
  }

  // 测试
  const userProcessor = new UserDataProcessor()
  const productProcessor = new ProductDataProcessor()

  // 处理用户数据
  try {
    const userData = {
      name: 'john doe',
      email: 'JOHN@EXAMPLE.COM',
    }

    const processedUser = userProcessor.process(userData)
    console.log('Processed user:', processedUser)
  } catch (error) {
    console.log('User processing error:', error.message)
  }

  // 处理产品数据
  try {
    const productData = {
      name: 'laptop computer',
      price: 999.99,
      category: 'electronics',
      quantity: 10,
    }

    const processedProduct = productProcessor.process(productData)
    console.log('Processed product:', processedProduct)
  } catch (error) {
    console.log('Product processing error:', error.message)
  }

  // 显示统计信息
  console.log('User processor stats:', userProcessor.getStats())
  console.log('Product processor stats:', productProcessor.getStats())
}
```

**记忆要点总结：**

- **基本语法**：子类中定义与父类同名的方法即可实现重写
- **super调用**：使用super.methodName()调用父类被重写的方法
- **多态性**：同一方法在不同子类中有不同的实现
- **实际应用**：数据处理、图形绘制、事件处理、业务逻辑定制
- **最佳实践**：重写时考虑是否需要调用父类方法，保持接口一致性

# **096. [中级]** 抽象类在JavaScript中如何模拟？

- 抽象类是一种不能直接被实例化的类，通常包含一个或者多个抽象方法，主要是用作其他类的基类

```javascript
class Shape {
  constructor(color) {
    if (this.constructor === Shape) {
      throw new Error('抽象类Shape不能被直接实例化')
    }
    this.color = color
  }

  getColor() {
    return this.color
  }

  setColor(color) {
    this.color = color
  }

  getArea() {
    throw new Error(`抽象类getArea方法必须在子类中实现`)
  }
}

class NShape extends Shape {
  constructor(color, width, height) {
    super(color)
    this.width = width
    this.height = height
  }

  getArea() {
    return this.width * this.height
  }
}

const area = new NShape('red', 100, 200)
area.getArea()
```

## 深度分析与补充

**问题本质解读：** 这道题考察在JavaScript中模拟抽象类的方法，面试官想了解你是否理解面向对象设计模式和抽象概念的实现。

**知识点系统梳理：**

**抽象类的特点：**

1. **不能实例化** - 只能作为基类被继承
2. **抽象方法** - 定义接口但不实现具体逻辑
3. **具体方法** - 可以包含已实现的通用方法
4. **强制实现** - 子类必须实现所有抽象方法
5. **设计约束** - 提供统一的接口规范

**JavaScript中的实现方式：**

- 构造函数检查
- 抽象方法抛出错误
- 使用Symbol标记
- 静态检查方法

**实战应用举例：**

```javascript
// 1. 基础抽象类实现
function basicAbstractClass() {
  console.log('=== 基础抽象类实现 ===')

  // 抽象基类 - 数据库连接
  class AbstractDatabase {
    constructor() {
      // 防止直接实例化抽象类
      if (this.constructor === AbstractDatabase) {
        throw new Error('Abstract class cannot be instantiated directly')
      }

      this.connected = false
      this.connectionTime = null
    }

    // 具体方法 - 已实现的通用逻辑
    isConnected() {
      return this.connected
    }

    getConnectionTime() {
      return this.connectionTime
    }

    // 抽象方法 - 必须由子类实现
    connect() {
      throw new Error('connect() method must be implemented by subclass')
    }

    disconnect() {
      throw new Error('disconnect() method must be implemented by subclass')
    }

    query(sql) {
      throw new Error('query() method must be implemented by subclass')
    }

    // 模板方法 - 定义算法骨架
    executeTransaction(operations) {
      console.log('Starting transaction...')

      try {
        this.beginTransaction()

        const results = []
        for (const operation of operations) {
          const result = this.query(operation)
          results.push(result)
        }

        this.commitTransaction()
        console.log('Transaction completed successfully')
        return results
      } catch (error) {
        this.rollbackTransaction()
        console.log('Transaction rolled back due to error:', error.message)
        throw error
      }
    }

    // 抽象的事务方法
    beginTransaction() {
      throw new Error('beginTransaction() must be implemented by subclass')
    }

    commitTransaction() {
      throw new Error('commitTransaction() must be implemented by subclass')
    }

    rollbackTransaction() {
      throw new Error('rollbackTransaction() must be implemented by subclass')
    }
  }

  // 具体实现 - MySQL数据库
  class MySQLDatabase extends AbstractDatabase {
    constructor(config) {
      super()
      this.config = config
      this.transactionActive = false
    }

    // 实现抽象方法
    connect() {
      console.log(`Connecting to MySQL at ${this.config.host}:${this.config.port}`)
      this.connected = true
      this.connectionTime = new Date()
      return this
    }

    disconnect() {
      console.log('Disconnecting from MySQL')
      this.connected = false
      this.connectionTime = null
      return this
    }

    query(sql) {
      if (!this.connected) {
        throw new Error('Database not connected')
      }

      console.log(`Executing MySQL query: ${sql}`)
      // 模拟查询结果
      return { success: true, rows: [], affectedRows: 0 }
    }

    beginTransaction() {
      console.log('BEGIN TRANSACTION (MySQL)')
      this.transactionActive = true
    }

    commitTransaction() {
      console.log('COMMIT (MySQL)')
      this.transactionActive = false
    }

    rollbackTransaction() {
      console.log('ROLLBACK (MySQL)')
      this.transactionActive = false
    }
  }

  // 具体实现 - MongoDB数据库
  class MongoDatabase extends AbstractDatabase {
    constructor(config) {
      super()
      this.config = config
      this.session = null
    }

    // 实现抽象方法
    connect() {
      console.log(`Connecting to MongoDB at ${this.config.host}:${this.config.port}`)
      this.connected = true
      this.connectionTime = new Date()
      return this
    }

    disconnect() {
      console.log('Disconnecting from MongoDB')
      this.connected = false
      this.connectionTime = null
      return this
    }

    query(operation) {
      if (!this.connected) {
        throw new Error('Database not connected')
      }

      console.log(`Executing MongoDB operation: ${JSON.stringify(operation)}`)
      // 模拟查询结果
      return { acknowledged: true, insertedId: 'ObjectId(...)' }
    }

    beginTransaction() {
      console.log('Starting session (MongoDB)')
      this.session = 'session_' + Date.now()
    }

    commitTransaction() {
      console.log('Committing session (MongoDB)')
      this.session = null
    }

    rollbackTransaction() {
      console.log('Aborting session (MongoDB)')
      this.session = null
    }
  }

  // 测试
  try {
    // 尝试实例化抽象类（会失败）
    const abstractDb = new AbstractDatabase()
  } catch (error) {
    console.log('Abstract class error:', error.message)
  }

  // 使用具体实现
  const mysql = new MySQLDatabase({ host: 'localhost', port: 3306 })
  mysql.connect()
  mysql.query('SELECT * FROM users')

  const mongo = new MongoDatabase({ host: 'localhost', port: 27017 })
  mongo.connect()
  mongo.query({ collection: 'users', operation: 'find', query: {} })

  // 测试事务
  mysql.executeTransaction([
    'INSERT INTO users (name) VALUES ("John")',
    'UPDATE users SET active = 1 WHERE name = "John"',
  ])
}
```

```javascript
// 2. 高级抽象类模式
function advancedAbstractPatterns() {
  console.log('=== 高级抽象类模式 ===')

  // 使用Symbol创建更严格的抽象类
  const ABSTRACT_CLASS = Symbol('AbstractClass')

  // 抽象形状类
  class AbstractShape {
    constructor() {
      if (!this.constructor[ABSTRACT_CLASS]) {
        throw new Error(`${this.constructor.name} must implement abstract methods`)
      }

      this.id = Math.random().toString(36).substr(2, 9)
      this.created = new Date()
    }

    // 抽象方法检查
    static checkAbstractMethods(subclass, requiredMethods) {
      for (const method of requiredMethods) {
        if (typeof subclass.prototype[method] !== 'function') {
          throw new Error(`${subclass.name} must implement ${method}() method`)
        }
      }
      subclass[ABSTRACT_CLASS] = true
    }

    // 具体方法
    getId() {
      return this.id
    }

    getAge() {
      return Date.now() - this.created.getTime()
    }

    // 抽象方法
    calculateArea() {
      throw new Error('calculateArea() must be implemented')
    }

    calculatePerimeter() {
      throw new Error('calculatePerimeter() must be implemented')
    }

    draw(context) {
      throw new Error('draw() must be implemented')
    }

    // 模板方法
    render(context) {
      console.log(`Rendering ${this.constructor.name} (ID: ${this.id})`)

      // 预处理
      this.beforeDraw(context)

      // 绘制（由子类实现）
      this.draw(context)

      // 后处理
      this.afterDraw(context)

      console.log(`Area: ${this.calculateArea()}, Perimeter: ${this.calculatePerimeter()}`)
    }

    beforeDraw(context) {
      console.log('Preparing to draw...')
    }

    afterDraw(context) {
      console.log('Drawing completed')
    }
  }

  // 具体实现 - 圆形
  class Circle extends AbstractShape {
    constructor(radius) {
      super()
      this.radius = radius
    }

    calculateArea() {
      return Math.PI * this.radius * this.radius
    }

    calculatePerimeter() {
      return 2 * Math.PI * this.radius
    }

    draw(context) {
      console.log(`Drawing circle with radius ${this.radius}`)
    }
  }

  // 具体实现 - 矩形
  class Rectangle extends AbstractShape {
    constructor(width, height) {
      super()
      this.width = width
      this.height = height
    }

    calculateArea() {
      return this.width * this.height
    }

    calculatePerimeter() {
      return 2 * (this.width + this.height)
    }

    draw(context) {
      console.log(`Drawing rectangle ${this.width}x${this.height}`)
    }
  }

  // 注册具体类（检查抽象方法实现）
  AbstractShape.checkAbstractMethods(Circle, ['calculateArea', 'calculatePerimeter', 'draw'])
  AbstractShape.checkAbstractMethods(Rectangle, ['calculateArea', 'calculatePerimeter', 'draw'])

  // 抽象工厂模式
  class AbstractShapeFactory {
    constructor() {
      if (this.constructor === AbstractShapeFactory) {
        throw new Error('Abstract factory cannot be instantiated')
      }
    }

    // 抽象工厂方法
    createCircle(radius) {
      throw new Error('createCircle() must be implemented')
    }

    createRectangle(width, height) {
      throw new Error('createRectangle() must be implemented')
    }

    createTriangle(base, height) {
      throw new Error('createTriangle() must be implemented')
    }
  }

  // 具体工厂
  class StandardShapeFactory extends AbstractShapeFactory {
    createCircle(radius) {
      return new Circle(radius)
    }

    createRectangle(width, height) {
      return new Rectangle(width, height)
    }

    createTriangle(base, height) {
      // 简化的三角形实现
      return {
        calculateArea: () => 0.5 * base * height,
        calculatePerimeter: () => base + 2 * Math.sqrt((base / 2) ** 2 + height ** 2),
        draw: () => console.log(`Drawing triangle with base ${base} and height ${height}`),
      }
    }
  }

  // 测试
  const factory = new StandardShapeFactory()

  const circle = factory.createCircle(5)
  const rectangle = factory.createRectangle(4, 6)

  circle.render('canvas')
  console.log('---')
  rectangle.render('canvas')

  // 验证抽象类不能实例化
  try {
    const abstractShape = new AbstractShape()
  } catch (error) {
    console.log('Abstract shape error:', error.message)
  }

  try {
    const abstractFactory = new AbstractShapeFactory()
  } catch (error) {
    console.log('Abstract factory error:', error.message)
  }
}
```

**记忆要点总结：**

- **实例化检查**：在构造函数中检查this.constructor防止直接实例化
- **抽象方法**：定义接口但抛出错误，强制子类实现
- **模板方法**：定义算法骨架，具体步骤由子类实现
- **Symbol标记**：使用Symbol创建更严格的抽象类检查
- **实际应用**：数据库抽象层、图形系统、工厂模式、框架设计

# **097. [高级]** 类的装饰器（decorator）概念及用法

## 深度分析与补充

**问题本质解读：** 这道题考察装饰器模式在JavaScript中的应用，面试官想了解你是否掌握高级设计模式和元编程概念。

**知识点系统梳理：**

**装饰器的概念：**

1. **设计模式** - 在不修改原有代码的情况下扩展功能
2. **元编程** - 在编译时或运行时修改类和方法的行为
3. **语法糖** - 使用@符号的简洁语法（提案阶段）
4. **函数式实现** - 使用高阶函数模拟装饰器
5. **AOP编程** - 面向切面编程的实现方式

**装饰器的类型：**

- 类装饰器
- 方法装饰器
- 属性装饰器
- 参数装饰器

**实战应用举例：**

```javascript
// 1. 函数式装饰器实现
function functionalDecorators() {
  console.log('=== 函数式装饰器实现 ===')

  // 日志装饰器
  function logMethod(target, propertyName, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args) {
      console.log(`Calling ${propertyName} with arguments:`, args)
      const result = originalMethod.apply(this, args)
      console.log(`${propertyName} returned:`, result)
      return result
    }

    return descriptor
  }

  // 性能监控装饰器
  function performance(target, propertyName, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args) {
      const start = performance.now()
      const result = originalMethod.apply(this, args)
      const end = performance.now()
      console.log(`${propertyName} execution time: ${(end - start).toFixed(2)}ms`)
      return result
    }

    return descriptor
  }

  // 缓存装饰器
  function memoize(target, propertyName, descriptor) {
    const originalMethod = descriptor.value
    const cache = new Map()

    descriptor.value = function (...args) {
      const key = JSON.stringify(args)

      if (cache.has(key)) {
        console.log(`Cache hit for ${propertyName}`)
        return cache.get(key)
      }

      const result = originalMethod.apply(this, args)
      cache.set(key, result)
      console.log(`Cache miss for ${propertyName}, result cached`)
      return result
    }

    return descriptor
  }

  // 验证装饰器
  function validate(validationRules) {
    return function (target, propertyName, descriptor) {
      const originalMethod = descriptor.value

      descriptor.value = function (...args) {
        // 验证参数
        for (let i = 0; i < validationRules.length; i++) {
          const rule = validationRules[i]
          const arg = args[i]

          if (rule && !rule(arg)) {
            throw new Error(`Validation failed for parameter ${i} in ${propertyName}`)
          }
        }

        return originalMethod.apply(this, args)
      }

      return descriptor
    }
  }

  // 使用装饰器的类
  class Calculator {
    constructor() {
      this.history = []
    }

    // 手动应用装饰器
    add(a, b) {
      const result = a + b
      this.history.push({ operation: 'add', args: [a, b], result })
      return result
    }

    multiply(a, b) {
      const result = a * b
      this.history.push({ operation: 'multiply', args: [a, b], result })
      return result
    }

    fibonacci(n) {
      if (n <= 1) return n
      return this.fibonacci(n - 1) + this.fibonacci(n - 2)
    }
  }

  // 手动应用装饰器
  const addDescriptor = Object.getOwnPropertyDescriptor(Calculator.prototype, 'add')
  logMethod(Calculator.prototype, 'add', addDescriptor)
  Object.defineProperty(Calculator.prototype, 'add', addDescriptor)

  const multiplyDescriptor = Object.getOwnPropertyDescriptor(Calculator.prototype, 'multiply')
  performance(Calculator.prototype, 'multiply', multiplyDescriptor)
  Object.defineProperty(Calculator.prototype, 'multiply', multiplyDescriptor)

  const fibDescriptor = Object.getOwnPropertyDescriptor(Calculator.prototype, 'fibonacci')
  memoize(Calculator.prototype, 'fibonacci', fibDescriptor)
  Object.defineProperty(Calculator.prototype, 'fibonacci', fibDescriptor)

  // 测试
  const calc = new Calculator()

  calc.add(5, 3)
  calc.multiply(4, 6)
  calc.fibonacci(10)
  calc.fibonacci(10) // 应该命中缓存
}
```

```javascript
// 2. 高级装饰器模式
function advancedDecoratorPatterns() {
  console.log('=== 高级装饰器模式 ===')

  // 装饰器工厂
  function createDecorator(options = {}) {
    return function (target, propertyName, descriptor) {
      const originalMethod = descriptor.value
      const { beforeHook, afterHook, errorHandler, timeout = 0 } = options

      descriptor.value = async function (...args) {
        try {
          // 前置钩子
          if (beforeHook) {
            await beforeHook.call(this, propertyName, args)
          }

          let result

          // 超时处理
          if (timeout > 0) {
            result = await Promise.race([
              originalMethod.apply(this, args),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Method timeout')), timeout),
              ),
            ])
          } else {
            result = await originalMethod.apply(this, args)
          }

          // 后置钩子
          if (afterHook) {
            await afterHook.call(this, propertyName, args, result)
          }

          return result
        } catch (error) {
          if (errorHandler) {
            return errorHandler.call(this, error, propertyName, args)
          }
          throw error
        }
      }

      return descriptor
    }
  }

  // 权限检查装饰器
  function requirePermission(permission) {
    return function (target, propertyName, descriptor) {
      const originalMethod = descriptor.value

      descriptor.value = function (...args) {
        if (!this.hasPermission || !this.hasPermission(permission)) {
          throw new Error(`Permission '${permission}' required for ${propertyName}`)
        }

        return originalMethod.apply(this, args)
      }

      return descriptor
    }
  }

  // 重试装饰器
  function retry(maxAttempts = 3, delay = 1000) {
    return function (target, propertyName, descriptor) {
      const originalMethod = descriptor.value

      descriptor.value = async function (...args) {
        let lastError

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            return await originalMethod.apply(this, args)
          } catch (error) {
            lastError = error
            console.log(`Attempt ${attempt} failed for ${propertyName}:`, error.message)

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

  // 类装饰器
  function singleton(target) {
    let instance = null

    return class extends target {
      constructor(...args) {
        if (instance) {
          return instance
        }

        super(...args)
        instance = this
        return instance
      }

      static getInstance(...args) {
        if (!instance) {
          instance = new this(...args)
        }
        return instance
      }
    }
  }

  // 使用装饰器的服务类
  class ApiService {
    constructor() {
      this.permissions = new Set(['read', 'write'])
    }

    hasPermission(permission) {
      return this.permissions.has(permission)
    }

    async fetchData(url) {
      console.log(`Fetching data from ${url}`)
      // 模拟网络请求
      if (Math.random() < 0.3) {
        throw new Error('Network error')
      }
      return { data: 'sample data', url }
    }

    async saveData(data) {
      console.log('Saving data:', data)
      return { success: true, id: Date.now() }
    }

    async deleteData(id) {
      console.log(`Deleting data with id: ${id}`)
      return { success: true }
    }
  }

  // 应用装饰器
  const fetchDescriptor = Object.getOwnPropertyDescriptor(ApiService.prototype, 'fetchData')
  retry(3, 500)(ApiService.prototype, 'fetchData', fetchDescriptor)
  Object.defineProperty(ApiService.prototype, 'fetchData', fetchDescriptor)

  const saveDescriptor = Object.getOwnPropertyDescriptor(ApiService.prototype, 'saveData')
  requirePermission('write')(ApiService.prototype, 'saveData', saveDescriptor)
  Object.defineProperty(ApiService.prototype, 'saveData', saveDescriptor)

  const deleteDescriptor = Object.getOwnPropertyDescriptor(ApiService.prototype, 'deleteData')
  requirePermission('admin')(ApiService.prototype, 'deleteData', deleteDescriptor)
  Object.defineProperty(ApiService.prototype, 'deleteData', deleteDescriptor)

  // 应用类装饰器
  const SingletonApiService = singleton(ApiService)

  // 测试
  const service1 = new SingletonApiService()
  const service2 = new SingletonApiService()

  console.log('Same instance:', service1 === service2)

  // 测试方法装饰器
  service1.fetchData('https://api.example.com/data')
  service1.saveData({ name: 'test' })

  try {
    service1.deleteData(123) // 会失败，因为没有admin权限
  } catch (error) {
    console.log('Permission error:', error.message)
  }
}
```

**记忆要点总结：**

- **设计模式**：在不修改原代码的情况下扩展功能
- **实现方式**：使用高阶函数包装原方法，修改descriptor
- **应用场景**：日志记录、性能监控、权限检查、缓存、重试机制
- **类装饰器**：可以修改整个类的行为，如单例模式
- **未来语法**：ES装饰器提案将提供@符号的原生语法支持

### Symbol数据类型（6道）

# **098. [中级]** 什么是Symbol？它的特点是什么？

- Symbol是javascript基本数据类型之一
- 独一无二的值

## 深度分析与补充

**问题本质解读：** 这道题考察Symbol数据类型的基本概念，面试官想了解你是否理解ES6新增的原始数据类型。

**知识点系统梳理：**

**Symbol的特点：**

1. **原始数据类型** - ES6新增的第7种原始数据类型
2. **唯一性** - 每个Symbol值都是唯一的，即使描述相同
3. **不可变性** - Symbol值不可被修改
4. **不可枚举** - 作为对象属性时默认不可枚举
5. **类型转换** - 不能被隐式转换为字符串或数字

**Symbol的用途：**

- 创建私有属性
- 避免属性名冲突
- 定义常量
- 实现迭代器
- 元编程

**实战应用举例：**

```javascript
// 1. Symbol的基本特性
function symbolBasics() {
  console.log('=== Symbol基本特性 ===')

  // 创建Symbol
  const sym1 = Symbol()
  const sym2 = Symbol()
  const sym3 = Symbol('description')
  const sym4 = Symbol('description')

  console.log('Symbol类型:', typeof sym1) // "symbol"
  console.log('Symbol唯一性:', sym1 === sym2) // false
  console.log('相同描述的Symbol:', sym3 === sym4) // false
  console.log('Symbol描述:', sym3.toString()) // "Symbol(description)"

  // Symbol不能被隐式转换
  try {
    console.log('Symbol + 字符串:', sym1 + 'test') // TypeError
  } catch (error) {
    console.log('转换错误:', error.message)
  }

  // 显式转换
  console.log('Symbol转字符串:', String(sym3)) // "Symbol(description)"
  console.log('Symbol描述属性:', sym3.description) // "description"

  // Symbol作为对象属性
  const obj = {}
  const symbolKey = Symbol('key')

  obj[symbolKey] = 'symbol value'
  obj.normalKey = 'normal value'

  console.log('Symbol属性值:', obj[symbolKey])
  console.log('对象键:', Object.keys(obj)) // 只显示普通键
  console.log('Symbol键:', Object.getOwnPropertySymbols(obj))
  console.log('所有键:', Reflect.ownKeys(obj))

  // Symbol不可枚举
  for (const key in obj) {
    console.log('可枚举键:', key) // 只有normalKey
  }
}
```

```javascript
// 2. Symbol的实际应用场景
function symbolApplications() {
  console.log('=== Symbol实际应用 ===')

  // 1. 创建私有属性
  const _private = Symbol('private')
  const _id = Symbol('id')

  class User {
    constructor(name, email) {
      this.name = name
      this.email = email
      this[_private] = { password: null, loginAttempts: 0 }
      this[_id] = Date.now() + Math.random()
    }

    setPassword(password) {
      this[_private].password = password
    }

    login(password) {
      if (this[_private].password === password) {
        this[_private].loginAttempts = 0
        return true
      } else {
        this[_private].loginAttempts++
        return false
      }
    }

    getId() {
      return this[_id]
    }

    getLoginAttempts() {
      return this[_private].loginAttempts
    }
  }

  // 2. 避免属性名冲突
  const LIBRARY_A_METHOD = Symbol('libraryA.method')
  const LIBRARY_B_METHOD = Symbol('libraryB.method')

  class MyClass {
    constructor() {
      this[LIBRARY_A_METHOD] = () => 'Library A implementation'
      this[LIBRARY_B_METHOD] = () => 'Library B implementation'
    }

    callLibraryA() {
      return this[LIBRARY_A_METHOD]()
    }

    callLibraryB() {
      return this[LIBRARY_B_METHOD]()
    }
  }

  // 3. 定义常量
  const STATUS = {
    PENDING: Symbol('pending'),
    FULFILLED: Symbol('fulfilled'),
    REJECTED: Symbol('rejected'),
  }

  class Promise {
    constructor() {
      this.state = STATUS.PENDING
      this.value = undefined
    }

    fulfill(value) {
      if (this.state === STATUS.PENDING) {
        this.state = STATUS.FULFILLED
        this.value = value
      }
    }

    reject(reason) {
      if (this.state === STATUS.PENDING) {
        this.state = STATUS.REJECTED
        this.value = reason
      }
    }

    getState() {
      switch (this.state) {
        case STATUS.PENDING:
          return 'pending'
        case STATUS.FULFILLED:
          return 'fulfilled'
        case STATUS.REJECTED:
          return 'rejected'
        default:
          return 'unknown'
      }
    }
  }

  // 4. 实现迭代器
  const ITERATOR = Symbol('iterator')

  class Range {
    constructor(start, end) {
      this.start = start
      this.end = end
    }

    [ITERATOR]() {
      let current = this.start
      const end = this.end

      return {
        next() {
          if (current < end) {
            return { value: current++, done: false }
          } else {
            return { done: true }
          }
        },
      }
    }
  }

  // 测试
  const user = new User('John', 'john@example.com')
  user.setPassword('secret123')

  console.log('User ID:', user.getId())
  console.log('Login success:', user.login('secret123'))
  console.log('Login attempts:', user.getLoginAttempts())

  // 私有属性无法直接访问
  console.log('User keys:', Object.keys(user)) // ['name', 'email']
  console.log('User symbols:', Object.getOwnPropertySymbols(user)) // [Symbol(private), Symbol(id), Symbol(password), Symbol(email), Symbol(loginAttempts)]

  const myClass = new MyClass()
  console.log('Library A:', myClass.callLibraryA())
  console.log('Library B:', myClass.callLibraryB())

  const promise = new Promise()
  console.log('Initial state:', promise.getState())
  promise.fulfill('success')
  console.log('After fulfill:', promise.getState())

  const range = new Range(1, 4)
  const iterator = range[ITERATOR]()

  console.log('Iterator results:')
  let result = iterator.next()
  while (!result.done) {
    console.log('Value:', result.value)
    result = iterator.next()
  }
}
```

**记忆要点总结：**

- **唯一性**：每个Symbol都是独一无二的，即使描述相同
- **原始类型**：Symbol是第7种原始数据类型，不是对象
- **不可枚举**：作为对象属性时不会出现在for...in循环中
- **实际应用**：私有属性、避免冲突、常量定义、迭代器实现
- **访问方式**：使用Object.getOwnPropertySymbols()获取Symbol属性

# **099. [中级]** 如何创建Symbol？Symbol的用途有哪些？

```javascript
let s = Symbol()
const ss = Symbol('foo')
```

## 深度分析与补充

**问题本质解读：** 这道题考察Symbol的创建方法和实际用途，面试官想了解你是否掌握Symbol在实际开发中的应用场景。

**知识点系统梳理：**

**Symbol的创建方式：**

1. **Symbol()** - 创建新的Symbol值
2. **Symbol(description)** - 创建带描述的Symbol
3. **Symbol.for(key)** - 创建全局Symbol注册表中的Symbol
4. **Symbol.keyFor(symbol)** - 获取全局Symbol的key

**Symbol的主要用途：**

1. **对象属性键** - 创建不会冲突的属性名
2. **私有成员** - 模拟私有属性和方法
3. **常量定义** - 创建唯一的常量值
4. **协议实现** - 实现迭代器、异步迭代器等
5. **元编程** - 自定义对象行为

**实战应用举例：**

```javascript
// 1. Symbol的创建和全局注册
function symbolCreationMethods() {
  console.log('=== Symbol创建方法 ===')

  // 基本创建
  const sym1 = Symbol()
  const sym2 = Symbol('description')

  console.log('基本Symbol:', sym1.toString())
  console.log('带描述Symbol:', sym2.toString())
  console.log('描述属性:', sym2.description)

  // 全局Symbol注册表
  const globalSym1 = Symbol.for('app.config')
  const globalSym2 = Symbol.for('app.config')

  console.log('全局Symbol相等:', globalSym1 === globalSym2) // true
  console.log('全局Symbol的key:', Symbol.keyFor(globalSym1)) // "app.config"

  // 普通Symbol不在全局注册表中
  console.log('普通Symbol的key:', Symbol.keyFor(sym2)) // undefined

  // 内置Symbol
  console.log('内置Symbol示例:')
  console.log('Symbol.iterator:', Symbol.iterator)
  console.log('Symbol.toStringTag:', Symbol.toStringTag)
  console.log('Symbol.hasInstance:', Symbol.hasInstance)

  // Symbol作为对象属性
  const config = {}
  const CONFIG_KEY = Symbol('config')
  const GLOBAL_CONFIG = Symbol.for('global.config')

  config[CONFIG_KEY] = { theme: 'dark', language: 'en' }
  config[GLOBAL_CONFIG] = { version: '1.0.0' }
  config.publicSetting = 'visible'

  console.log('配置对象:', config)
  console.log('Symbol属性:', config[CONFIG_KEY])
  console.log('全局Symbol属性:', config[GLOBAL_CONFIG])

  // 属性枚举
  console.log('普通属性:', Object.keys(config)) // ['publicSetting']
  console.log('Symbol属性:', Object.getOwnPropertySymbols(config)) // [Symbol(config), Symbol(global.config)]
  console.log('所有属性:', Reflect.ownKeys(config)) // ['publicSetting', Symbol(config), Symbol(global.config)]
}
```

```javascript
// 2. Symbol的实际应用场景
function symbolPracticalUsage() {
  console.log('=== Symbol实际应用场景 ===')

  // 1. 创建私有成员
  const _privateData = Symbol('privateData')
  const _privateMethod = Symbol('privateMethod')

  class BankAccount {
    constructor(accountNumber, initialBalance) {
      this.accountNumber = accountNumber
      this[_privateData] = {
        balance: initialBalance,
        pin: null,
        transactions: [],
      }
    }

    [_privateMethod](type, amount) {
      this[_privateData].transactions.push({
        type,
        amount,
        timestamp: new Date(),
        balance: this[_privateData].balance,
      })
    }

    setPin(pin) {
      this[_privateData].pin = pin
    }

    deposit(amount, pin) {
      if (this[_privateData].pin !== pin) {
        throw new Error('Invalid PIN')
      }

      this[_privateData].balance += amount
      this[_privateMethod]('deposit', amount)
      return this[_privateData].balance
    }

    withdraw(amount, pin) {
      if (this[_privateData].pin !== pin) {
        throw new Error('Invalid PIN')
      }

      if (this[_privateData].balance < amount) {
        throw new Error('Insufficient funds')
      }

      this[_privateData].balance -= amount
      this[_privateMethod]('withdrawal', amount)
      return this[_privateData].balance
    }

    getBalance(pin) {
      if (this[_privateData].pin !== pin) {
        throw new Error('Invalid PIN')
      }
      return this[_privateData].balance
    }

    getTransactionHistory(pin) {
      if (this[_privateData].pin !== pin) {
        throw new Error('Invalid PIN')
      }
      return this[_privateData].transactions.slice()
    }
  }

  // 2. 实现迭代器协议
  class NumberSequence {
    constructor(start, end, step = 1) {
      this.start = start
      this.end = end
      this.step = step
    }

    [Symbol.iterator]() {
      let current = this.start
      const end = this.end
      const step = this.step

      return {
        next() {
          if (current < end) {
            const value = current
            current += step
            return { value, done: false }
          }
          return { done: true }
        },
      }
    }
  }

  // 3. 自定义对象转换行为
  class Temperature {
    constructor(celsius) {
      this.celsius = celsius
    }

    [Symbol.toPrimitive](hint) {
      switch (hint) {
        case 'number':
          return this.celsius
        case 'string':
          return `${this.celsius}°C`
        default:
          return this.celsius
      }
    }

    [Symbol.toStringTag] = 'Temperature'

    toString() {
      return `${this.celsius}°C (${((this.celsius * 9) / 5 + 32).toFixed(1)}°F)`
    }
  }

  // 4. 创建枚举常量
  const HTTP_STATUS = {
    OK: Symbol('200'),
    NOT_FOUND: Symbol('404'),
    INTERNAL_ERROR: Symbol('500'),

    // 添加描述方法
    getDescription(status) {
      switch (status) {
        case this.OK:
          return 'OK'
        case this.NOT_FOUND:
          return 'Not Found'
        case this.INTERNAL_ERROR:
          return 'Internal Server Error'
        default:
          return 'Unknown Status'
      }
    },
  }

  // 5. 实现观察者模式
  const OBSERVERS = Symbol('observers')

  class Observable {
    constructor() {
      this[OBSERVERS] = new Set()
    }

    subscribe(observer) {
      this[OBSERVERS].add(observer)
    }

    unsubscribe(observer) {
      this[OBSERVERS].delete(observer)
    }

    notify(data) {
      this[OBSERVERS].forEach(observer => {
        if (typeof observer === 'function') {
          observer(data)
        } else if (observer.update) {
          observer.update(data)
        }
      })
    }
  }

  // 测试
  const account = new BankAccount('123456789', 1000)
  account.setPin('1234')

  console.log('Initial balance:', account.getBalance('1234'))
  account.deposit(500, '1234')
  account.withdraw(200, '1234')
  console.log('Final balance:', account.getBalance('1234'))
  console.log('Transactions:', account.getTransactionHistory('1234').length)

  // 测试迭代器
  const sequence = new NumberSequence(1, 10, 2)
  console.log('Number sequence:')
  for (const num of sequence) {
    console.log(num) // 1, 3, 5, 7, 9
  }

  // 测试自定义转换
  const temp = new Temperature(25)
  console.log('Temperature string:', String(temp)) // "25°C (77.0°F)"
  console.log('Temperature number:', Number(temp)) // 25
  console.log('Temperature object tag:', Object.prototype.toString.call(temp)) // "[object Temperature]"

  // 测试枚举
  const status = HTTP_STATUS.OK
  console.log('Status description:', HTTP_STATUS.getDescription(status)) // "OK"

  // 测试观察者
  const observable = new Observable()
  observable.subscribe(data => console.log('Observer 1:', data))
  observable.subscribe(data => console.log('Observer 2:', data))
  observable.notify('Hello observers!')
}
```

**记忆要点总结：**

- **创建方式**：Symbol()创建唯一值，Symbol.for()创建全局注册的Symbol
- **私有成员**：使用Symbol作为属性键创建私有属性和方法
- **迭代器**：实现Symbol.iterator定义自定义迭代行为
- **元编程**：使用内置Symbol自定义对象的默认行为
- **常量定义**：创建不会冲突的枚举常量值

- 可以作为对象的键

# **100. [中级]** Symbol.iterator的作用是什么？

- 定义一个可迭代对象 结合generator 可以让对象通过forof循环遍历

## 深度分析与补充

**问题本质解读：** 这道题考察Symbol.iterator的作用和迭代器协议，面试官想了解你是否理解JavaScript中的迭代机制。

**知识点系统梳理：**

**Symbol.iterator的作用：**

1. **迭代器协议** - 定义对象如何被迭代
2. **for...of循环** - 使对象可以被for...of遍历
3. **解构赋值** - 支持数组解构语法
4. **扩展运算符** - 支持...操作符
5. **内置方法** - Array.from()、Promise.all()等方法的支持

**迭代器接口：**

- next()方法返回{value, done}对象
- value：当前迭代值
- done：是否迭代完成

**实战应用举例：**

```javascript
// 1. Symbol.iterator的基本实现
function symbolIteratorBasics() {
  console.log('=== Symbol.iterator基础实现 ===')

  // 自定义可迭代对象
  class NumberRange {
    constructor(start, end, step = 1) {
      this.start = start
      this.end = end
      this.step = step
    }

    // 实现Symbol.iterator方法
    [Symbol.iterator]() {
      let current = this.start
      const end = this.end
      const step = this.step

      return {
        next() {
          if (current < end) {
            const value = current
            current += step
            return { value, done: false }
          } else {
            return { done: true }
          }
        },
      }
    }
  }

  // 使用生成器简化实现
  class SimpleRange {
    constructor(start, end) {
      this.start = start
      this.end = end
    }

    *[Symbol.iterator]() {
      for (let i = this.start; i < this.end; i++) {
        yield i
      }
    }
  }

  // 字符串迭代器
  class StringIterator {
    constructor(str) {
      this.str = str
    }

    [Symbol.iterator]() {
      let index = 0
      const str = this.str

      return {
        next() {
          if (index < str.length) {
            return { value: str[index++], done: false }
          } else {
            return { done: true }
          }
        },
      }
    }
  }

  // 测试
  const range1 = new NumberRange(1, 5)
  console.log('NumberRange with for...of:')
  for (const num of range1) {
    console.log(num)
  }

  const range2 = new SimpleRange(10, 13)
  console.log('SimpleRange with for...of:')
  for (const num of range2) {
    console.log(num)
  }

  // 使用扩展运算符
  console.log('Range as array:', [...new NumberRange(1, 4)])

  // 使用解构赋值
  const [first, second, ...rest] = new SimpleRange(20, 25)
  console.log('Destructured:', { first, second, rest }) // { first: 20, second: 21, rest: [22, 23, 24] }

  // 字符串迭代
  const strIter = new StringIterator('Hello')
  console.log('String iteration:')
  for (const char of strIter) {
    console.log(char)
  }
}
```

```javascript
// 2. 高级迭代器应用
function advancedIteratorApplications() {
  console.log('=== 高级迭代器应用 ===')

  // 树结构迭代器
  class TreeNode {
    constructor(value) {
      this.value = value
      this.children = []
    }

    addChild(child) {
      this.children.push(child)
      return this
    }

    // 深度优先遍历
    *[Symbol.iterator]() {
      yield this.value
      for (const child of this.children) {
        yield* child
      }
    }

    // 广度优先遍历
    *breadthFirst() {
      const queue = [this]

      while (queue.length > 0) {
        const node = queue.shift()
        yield node.value
        queue.push(...node.children)
      }
    }
  }

  // 分页数据迭代器
  class PaginatedData {
    constructor(fetchFunction, pageSize = 10) {
      this.fetchFunction = fetchFunction
      this.pageSize = pageSize
    }

    async *[Symbol.asyncIterator]() {
      let page = 1
      let hasMore = true

      while (hasMore) {
        try {
          const data = await this.fetchFunction(page, this.pageSize)

          if (data.items && data.items.length > 0) {
            for (const item of data.items) {
              yield item
            }
            hasMore = data.hasMore
            page++
          } else {
            hasMore = false
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          hasMore = false
        }
      }
    }
  }

  // 无限序列迭代器
  class InfiniteSequence {
    constructor(generator) {
      this.generator = generator
    }

    *[Symbol.iterator]() {
      let index = 0
      while (true) {
        yield this.generator(index++)
      }
    }

    take(count) {
      const result = []
      let index = 0

      for (const value of this) {
        if (index >= count) break
        result.push(value)
        index++
      }

      return result
    }
  }

  // 链式迭代器
  class ChainIterator {
    constructor(...iterables) {
      this.iterables = iterables
    }

    *[Symbol.iterator]() {
      for (const iterable of this.iterables) {
        yield* iterable
      }
    }
  }

  // 过滤迭代器
  class FilterIterator {
    constructor(iterable, predicate) {
      this.iterable = iterable
      this.predicate = predicate
    }

    *[Symbol.iterator]() {
      for (const item of this.iterable) {
        if (this.predicate(item)) {
          yield item
        }
      }
    }
  }

  // 测试树结构
  const root = new TreeNode('root')
  const child1 = new TreeNode('child1')
  const child2 = new TreeNode('child2')
  const grandchild1 = new TreeNode('grandchild1')

  root.addChild(child1).addChild(child2)
  child1.addChild(grandchild1)

  console.log('Tree depth-first traversal:')
  for (const value of root) {
    console.log(value) // root, child1, grandchild1, child2
  }

  console.log('Tree breadth-first traversal:')
  for (const value of root.breadthFirst()) {
    console.log(value) // root, child1, child2, grandchild1
  }

  // 测试无限序列
  const fibonacci = new InfiniteSequence(n => {
    if (n <= 1) return n
    let a = 0,
      b = 1
    for (let i = 2; i <= n; i++) {
      ;[a, b] = [b, a + b]
    }
    return b
  })

  console.log('First 10 Fibonacci numbers:', fibonacci.take(10))

  // 测试链式迭代器
  const chain = new ChainIterator([1, 2, 3], ['a', 'b', 'c'], [true, false])
  console.log('Chained iteration:', [...chain]) // [1, 2, 3, 'a', 'b', 'c', true, false]

  // 测试过滤迭代器
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const evenNumbers = new FilterIterator(numbers, x => x % 2 === 0)
  console.log('Even numbers:', [...evenNumbers])

  // 测试分页数据（模拟）
  const mockFetch = async (page, pageSize) => {
    console.log(`Fetching page ${page} with size ${pageSize}`)
    const start = (page - 1) * pageSize
    const items = Array.from({ length: pageSize }, (_, i) => `Item ${start + i + 1}`)
    return {
      items: page <= 3 ? items : [], // 模拟3页数据
      hasMore: page < 3,
    }
  }

  const paginatedData = new PaginatedData(mockFetch, 5)

  // 异步迭代（在实际环境中使用）
  console.log('Paginated data iteration would work with async/await')
}
```

**记忆要点总结：**

- **核心作用**：Symbol.iterator定义对象的默认迭代行为
- **迭代器协议**：next()方法返回{value, done}对象
- **生成器简化**：使用生成器函数可以简化迭代器实现
- **实际应用**：自定义数据结构、分页数据、无限序列、树遍历
- **内置支持**：for...of、解构赋值、扩展运算符都依赖此协议

# **101. [高级]** 如何使用Symbol创建对象的私有属性？

```javascript
// 创建私有属性的Symbol
const privateProperty = Symbol('privateProperty')
const privateMethod = Symbol('privateMethod')

class MyClass {
  constructor(value) {
    this.publicProperty = value
    this[privateProperty] = 'This is private'
  }

  // 私有方法
  [privateMethod]() {
    return 'This is a private method'
  }

  // 公共方法访问私有属性
  getPrivateProperty() {
    return this[privateProperty]
  }

  setPrivateProperty(value) {
    this[privateProperty] = value
  }

  callPrivateMethod() {
    return this[privateMethod]()
  }
}

const instance = new MyClass('public value')

console.log(instance.publicProperty) // "public value"
console.log(instance.getPrivateProperty()) // "This is private"
console.log(instance.callPrivateMethod()) // "This is a private method"

// 无法直接访问私有属性（除非知道Symbol）
console.log(instance.privateProperty) // undefined
console.log(Object.keys(instance)) // ['publicProperty'] - 不包含Symbol属性
```

## 深度分析与补充

**问题本质解读：** 这道题考察使用Symbol创建私有属性的方法，面试官想了解你是否掌握JavaScript中模拟私有成员的技巧。

**知识点系统梳理：**

**Symbol私有属性的特点：**

1. **作用域隔离** - Symbol在模块外部不可访问
2. **不可枚举** - 不会出现在Object.keys()中
3. **类型安全** - 只能通过特定Symbol访问
4. **调试友好** - 可以通过Object.getOwnPropertySymbols()查看
5. **性能优良** - 比WeakMap方案性能更好

**实战应用举例：**

```javascript
// 1. 完整的Symbol私有属性实现
function symbolPrivatePropertiesComplete() {
  console.log('=== Symbol私有属性完整实现 ===')

  // 在模块作用域中定义私有Symbol
  const _balance = Symbol('balance')
  const _pin = Symbol('pin')
  const _transactions = Symbol('transactions')
  const _validatePin = Symbol('validatePin')

  class BankAccount {
    constructor(accountNumber, initialBalance, pin) {
      this.accountNumber = accountNumber // 公共属性

      // 私有属性
      this[_balance] = initialBalance
      this[_pin] = pin
      this[_transactions] = []
    }

    // 私有方法 - PIN验证
    [_validatePin](inputPin) {
      return this[_pin] === inputPin
    }

    // 公共方法 - 存款
    deposit(amount, pin) {
      if (!this[_validatePin](pin)) {
        throw new Error('Invalid PIN')
      }

      this[_balance] += amount
      this[_transactions].push({ type: 'deposit', amount, balance: this[_balance] })
      return this[_balance]
    }

    // 公共方法 - 取款
    withdraw(amount, pin) {
      if (!this[_validatePin](pin)) {
        throw new Error('Invalid PIN')
      }

      if (amount > this[_balance]) {
        throw new Error('Insufficient funds')
      }

      this[_balance] -= amount
      this[_transactions].push({ type: 'withdraw', amount, balance: this[_balance] })
      return this[_balance]
    }

    // 公共方法 - 查询余额
    getBalance(pin) {
      if (!this[_validatePin](pin)) {
        throw new Error('Invalid PIN')
      }
      return this[_balance]
    }

    // 公共方法 - 获取交易历史
    getTransactions(pin) {
      if (!this[_validatePin](pin)) {
        throw new Error('Invalid PIN')
      }
      return this[_transactions].slice() // 返回副本
    }
  }

  // 测试
  const account = new BankAccount('123456', 1000, '1234')

  console.log('Initial balance:', account.getBalance('1234'))
  account.deposit(500, '1234')
  account.withdraw(200, '1234')
  console.log('Final balance:', account.getBalance('1234'))

  // 验证私有属性的隔离性
  console.log('Public properties:', Object.keys(account))
  console.log('Symbol properties:', Object.getOwnPropertySymbols(account).length)
}
```

```javascript
// 2. Symbol私有属性的高级模式
function advancedSymbolPrivatePatterns() {
  console.log('=== Symbol私有属性高级模式 ===')

  // 私有属性工厂
  function createPrivateProperties(...names) {
    const symbols = {}
    names.forEach(name => {
      symbols[name] = Symbol(name)
    })
    return symbols
  }

  // 使用私有属性工厂
  const UserPrivates = createPrivateProperties('id', 'password', 'email', 'loginAttempts')

  class User {
    constructor(username, email, password) {
      this.username = username // 公共属性
      this.isActive = true // 公共属性

      // 私有属性
      this[UserPrivates.id] = Date.now() + Math.random()
      this[UserPrivates.email] = email
      this[UserPrivates.password] = this._hashPassword(password)
      this[UserPrivates.loginAttempts] = 0
    }

    // 私有方法模拟
    _hashPassword(password) {
      return 'hashed_' + password
    }

    // 公共方法
    login(password) {
      const hashedPassword = this._hashPassword(password)

      if (this[UserPrivates.password] === hashedPassword) {
        this[UserPrivates.loginAttempts] = 0
        return { success: true, message: 'Login successful' }
      } else {
        this[UserPrivates.loginAttempts]++
        return { success: false, message: 'Invalid password' }
      }
    }

    getProfile() {
      return {
        id: this[UserPrivates.id],
        username: this.username,
        email: this[UserPrivates.email],
        isActive: this.isActive,
        loginAttempts: this[UserPrivates.loginAttempts],
      }
    }
  }

  // 测试
  const user = new User('john_doe', 'john@example.com', 'password123')
  console.log('User profile:', user.getProfile())
  console.log('Login result:', user.login('password123'))

  // 验证私有属性无法直接访问
  console.log('Cannot access private email:', user[UserPrivates.email]) // undefined in external scope
}
```

**记忆要点总结：**

- **作用域隔离**：Symbol在模块外部不可访问，提供真正的私有性
- **语法简洁**：比WeakMap方案语法更简洁，比#私有字段兼容性更好
- **调试友好**：可以通过Object.getOwnPropertySymbols()查看Symbol属性
- **最佳实践**：在模块顶部定义私有Symbol，使用描述性名称便于调试
- **性能优势**：访问速度快，内存占用少

# **102. [中级]** Symbol.for()和Symbol()的区别

- Symbol.for() 接收一个字符串作为参数，并搜索是否已经存在以该字符串定义的Symbol值，如果有则返回这个Symbol值，如果没有就以该字符串创建一个Symbol值并注册到全局。
- Symbol() 定义一个独一无二的Symbol值

## 深度分析与补充

**问题本质解读：** 这道题考察Symbol.for()和Symbol()的区别，面试官想了解你是否理解Symbol的全局注册机制。

**知识点系统梳理：**

**Symbol() vs Symbol.for()：**

1. **唯一性** - Symbol()每次都创建新的唯一值，Symbol.for()可能返回已存在的值
2. **全局注册** - Symbol.for()使用全局Symbol注册表，Symbol()不使用
3. **跨模块共享** - Symbol.for()可以跨模块共享，Symbol()不能
4. **key查询** - Symbol.for()创建的Symbol可以通过Symbol.keyFor()查询key
5. **性能考虑** - Symbol.for()需要查询注册表，Symbol()直接创建

**实战应用举例：**

```javascript
// 1. Symbol() vs Symbol.for() 基本对比
function symbolComparisonBasics() {
  console.log('=== Symbol() vs Symbol.for() 基本对比 ===')

  // Symbol() - 每次创建唯一值
  const sym1 = Symbol('test')
  const sym2 = Symbol('test')
  console.log('Symbol() 唯一性:', sym1 === sym2) // false

  // Symbol.for() - 全局注册表
  const globalSym1 = Symbol.for('test')
  const globalSym2 = Symbol.for('test')
  console.log('Symbol.for() 相等性:', globalSym1 === globalSym2) // true

  // 混合比较
  const localSym = Symbol('global_test')
  const globalSym = Symbol.for('global_test')
  console.log('本地 vs 全局:', localSym === globalSym) // false

  // 查询Symbol的key
  console.log('Symbol() 的 key:', Symbol.keyFor(sym1)) // undefined
  console.log('Symbol.for() 的 key:', Symbol.keyFor(globalSym1)) // "test"

  // 描述 vs key
  console.log('Symbol() 描述:', sym1.description) // "test"
  console.log('Symbol.for() 描述:', globalSym1.description) // "test"

  // 全局注册表是跨realm的
  console.log('全局Symbol注册表演示:')
  const appConfig = Symbol.for('app.config')
  const sameConfig = Symbol.for('app.config')
  console.log('跨模块共享:', appConfig === sameConfig) // true
}
```

```javascript
// 2. 实际应用场景
function symbolPracticalApplications() {
  console.log('=== Symbol实际应用场景 ===')

  // 1. 跨模块常量定义
  const EVENTS = {
    USER_LOGIN: Symbol.for('app.events.user.login'),
    USER_LOGOUT: Symbol.for('app.events.user.logout'),
    DATA_LOADED: Symbol.for('app.events.data.loaded'),
    ERROR_OCCURRED: Symbol.for('app.events.error.occurred'),
  }

  // 事件管理器
  class EventManager {
    constructor() {
      this.listeners = new Map()
    }

    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, [])
      }
      this.listeners.get(event).push(callback)
    }

    emit(event, data) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(callback => callback(data))
      }
    }

    off(event, callback) {
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event)
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // 2. 插件系统中的钩子
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

      // 注册插件的钩子
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

  // 3. 配置系统
  const CONFIG_KEYS = {
    DATABASE_URL: Symbol.for('config.database.url'),
    API_KEY: Symbol.for('config.api.key'),
    DEBUG_MODE: Symbol.for('config.debug.mode'),
    CACHE_TTL: Symbol.for('config.cache.ttl'),
  }

  class ConfigManager {
    constructor() {
      this.config = new Map()
      this.defaults = new Map([
        [CONFIG_KEYS.DEBUG_MODE, false],
        [CONFIG_KEYS.CACHE_TTL, 3600],
      ])
    }

    set(key, value) {
      this.config.set(key, value)
    }

    get(key) {
      return this.config.has(key) ? this.config.get(key) : this.defaults.get(key)
    }

    has(key) {
      return this.config.has(key) || this.defaults.has(key)
    }

    // 从环境变量加载配置
    loadFromEnv() {
      const envMappings = {
        DATABASE_URL: CONFIG_KEYS.DATABASE_URL,
        API_KEY: CONFIG_KEYS.API_KEY,
        DEBUG: CONFIG_KEYS.DEBUG_MODE,
      }

      Object.entries(envMappings).forEach(([envKey, configKey]) => {
        const envValue = process?.env?.[envKey]
        if (envValue !== undefined) {
          this.set(configKey, envValue)
        }
      })
    }
  }

  // 测试
  const eventManager = new EventManager()

  // 使用全局Symbol作为事件类型
  eventManager.on(EVENTS.USER_LOGIN, data => {
    console.log('User logged in:', data)
  })

  eventManager.emit(EVENTS.USER_LOGIN, { userId: 123, timestamp: Date.now() })

  // 插件系统测试
  const pluginSystem = new PluginSystem()

  const samplePlugin = {
    name: 'SamplePlugin',

    [PLUGIN_HOOKS.BEFORE_INIT](context) {
      console.log('SamplePlugin: Before init', context)
    },

    [PLUGIN_HOOKS.AFTER_INIT](context) {
      console.log('SamplePlugin: After init', context)
    },
  }

  pluginSystem.registerPlugin(samplePlugin)
  pluginSystem.init()

  // 配置管理测试
  const configManager = new ConfigManager()
  configManager.set(CONFIG_KEYS.DATABASE_URL, 'mongodb://localhost:27017')

  console.log('Database URL:', configManager.get(CONFIG_KEYS.DATABASE_URL))
  console.log('Debug mode:', configManager.get(CONFIG_KEYS.DEBUG_MODE))

  // 验证跨模块Symbol共享
  const sameEvent = Symbol.for('app.events.user.login')
  console.log('跨模块事件Symbol相等:', EVENTS.USER_LOGIN === sameEvent)
}
```

**记忆要点总结：**

- **Symbol()**：每次创建唯一值，不使用全局注册表，适合私有标识
- **Symbol.for()**：使用全局注册表，相同key返回相同Symbol，适合跨模块共享
- **Symbol.keyFor()**：只能查询通过Symbol.for()创建的Symbol的key
- **实际应用**：事件系统、插件钩子、配置管理、跨模块常量
- **选择原则**：需要跨模块共享时用Symbol.for()，需要唯一性时用Symbol()

# **103. [中级]** 内置Symbol有哪些？举例说明

- Symbol.hasInstance 当其他对象使用`instanceof`运算符，判断是否为该对象的实例时，会调用这个方法
- Symbol.isConcatSpreadable 连接两个数组时是否展开
- Symbol.species 衍生对象时控制实例的继承对象

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript内置Symbol的种类和用法，面试官想了解你是否掌握元编程和自定义对象行为的高级特性。

**知识点系统梳理：**

**主要内置Symbol：**

1. **Symbol.iterator** - 定义对象的默认迭代器
2. **Symbol.hasInstance** - 自定义instanceof行为
3. **Symbol.isConcatSpreadable** - 控制数组concat时的展开行为
4. **Symbol.species** - 控制衍生对象的构造函数
5. **Symbol.toPrimitive** - 自定义类型转换行为
6. **Symbol.toStringTag** - 自定义Object.prototype.toString的返回值

**实战应用举例：**

```javascript
// 1. 常用内置Symbol的基本用法
function builtInSymbolsBasics() {
  console.log('=== 内置Symbol基本用法 ===')

  // Symbol.hasInstance - 自定义instanceof行为
  class MyArray {
    static [Symbol.hasInstance](instance) {
      return Array.isArray(instance)
    }
  }

  console.log([1, 2, 3] instanceof MyArray) // true
  console.log('string' instanceof MyArray) // false

  // Symbol.isConcatSpreadable - 控制数组展开
  const arr1 = [1, 2, 3]
  const arr2 = [4, 5, 6]
  arr2[Symbol.isConcatSpreadable] = false

  console.log('Normal concat:', [0].concat(arr1)) // [0, 1, 2, 3]
  console.log('Non-spreadable concat:', [0].concat(arr2)) // [0, [4, 5, 6]]

  // Symbol.species - 控制衍生对象
  class MyArrayExtended extends Array {
    static get [Symbol.species]() {
      return Array // 返回普通Array而不是MyArrayExtended
    }
  }

  const myArr = new MyArrayExtended(1, 2, 3)
  const mapped = myArr.map(x => x * 2)

  console.log('Original type:', myArr.constructor.name) // MyArrayExtended
  console.log('Mapped type:', mapped.constructor.name) // Array (因为Symbol.species)

  // Symbol.toPrimitive - 自定义类型转换
  class Temperature {
    constructor(celsius) {
      this.celsius = celsius
    }

    [Symbol.toPrimitive](hint) {
      switch (hint) {
        case 'number':
          return this.celsius
        case 'string':
          return `${this.celsius}°C`
        default:
          return this.celsius
      }
    }
  }

  const temp = new Temperature(25)
  console.log('Number conversion:', +temp) // 25
  console.log('String conversion:', `Temperature: ${temp}`) // "Temperature: 25°C"

  // Symbol.toStringTag - 自定义toString标签
  class CustomClass {
    get [Symbol.toStringTag]() {
      return 'CustomClass'
    }
  }

  const custom = new CustomClass()
  console.log('toString tag:', Object.prototype.toString.call(custom)) // [object CustomClass]
}
```

```javascript
// 2. 高级内置Symbol应用
function advancedBuiltInSymbols() {
  console.log('=== 高级内置Symbol应用 ===')

  // 自定义集合类
  class CustomCollection {
    constructor(...items) {
      this.items = items
      this.size = items.length
    }

    // Symbol.iterator - 使对象可迭代
    *[Symbol.iterator]() {
      for (const item of this.items) {
        yield item
      }
    }

    // Symbol.hasInstance - 自定义instanceof检查
    static [Symbol.hasInstance](instance) {
      return instance && typeof instance.items === 'object' && Array.isArray(instance.items)
    }

    // Symbol.species - 控制衍生对象类型
    static get [Symbol.species]() {
      return this
    }

    // Symbol.toPrimitive - 自定义转换
    [Symbol.toPrimitive](hint) {
      switch (hint) {
        case 'number':
          return this.size
        case 'string':
          return `Collection(${this.items.join(', ')})`
        default:
          return this.size
      }
    }

    // Symbol.toStringTag - 自定义类型标签
    get [Symbol.toStringTag]() {
      return 'CustomCollection'
    }

    // 返回新集合的方法
    map(callback) {
      const Constructor = this.constructor[Symbol.species]
      return new Constructor(...this.items.map(callback))
    }

    filter(callback) {
      const Constructor = this.constructor[Symbol.species]
      return new Constructor(...this.items.filter(callback))
    }
  }

  // 特殊数组类 - 演示Symbol.isConcatSpreadable
  class SpecialArray extends Array {
    constructor(...args) {
      super(...args)
      this.name = 'SpecialArray'
    }

    // 控制是否在concat时展开
    get [Symbol.isConcatSpreadable]() {
      return this.shouldSpread !== false
    }

    setSpreadable(value) {
      this.shouldSpread = value
      return this
    }
  }

  // 自定义错误类
  class CustomError extends Error {
    constructor(message, code) {
      super(message)
      this.code = code
      this.timestamp = new Date()
    }

    get [Symbol.toStringTag]() {
      return 'CustomError'
    }

    [Symbol.toPrimitive](hint) {
      if (hint === 'string') {
        return `${this.name}: ${this.message} (Code: ${this.code})`
      }
      return this.code
    }
  }

  // 测试自定义集合
  const collection = new CustomCollection(1, 2, 3, 4, 5)

  console.log('Collection iteration:')
  for (const item of collection) {
    console.log(item)
  }

  console.log('Collection instanceof:', collection instanceof CustomCollection) // true
  console.log('Array instanceof CustomCollection:', [1, 2, 3] instanceof CustomCollection) // true

  console.log('Collection as number:', Number(collection)) // 5
  console.log('Collection as string:', String(collection)) // "Collection(1, 2, 3, 4, 5)"
  console.log('Collection toString:', Object.prototype.toString.call(collection)) // [object CustomCollection]

  const doubled = collection.map(x => x * 2)
  console.log('Mapped collection type:', doubled.constructor.name) // CustomCollection

  // 测试特殊数组
  const specialArr1 = new SpecialArray(1, 2, 3)
  const specialArr2 = new SpecialArray(4, 5, 6).setSpreadable(false)

  console.log('Spreadable concat:', [0].concat(specialArr1)) // [0, 1, 2, 3]
  console.log('Non-spreadable concat:', [0].concat(specialArr2)) // [0, SpecialArray(3)]

  // 测试自定义错误
  const error = new CustomError('Something went wrong', 500)
  console.log('Error as string:', String(error))
  console.log('Error as number:', Number(error)) // 500
  console.log('Error toString:', Object.prototype.toString.call(error)) // [object CustomError]
}
```

**记忆要点总结：**

- **Symbol.iterator**：定义对象的默认迭代行为，支持for...of循环
- **Symbol.hasInstance**：自定义instanceof运算符的行为
- **Symbol.isConcatSpreadable**：控制对象在Array.concat()时是否展开
- **Symbol.species**：控制衍生对象的构造函数类型
- **Symbol.toPrimitive**：自定义对象到原始值的转换规则
- **Symbol.toStringTag**：自定义Object.prototype.toString()的返回值
- Symbol.match
- Symbol.replace
- Symbol.search
- Symbol.split
- Symbol.iterator
- Symbol.toPrimitive
- Symbol.toStringTag
- Symbol.unscopables

### Set和Map（8道）

# **104. [初级]** Set数据结构的特点和基本用法

- 存储单个值且不重复

```javascript
let set = new Set(['1', 'a'])
set.add(2, 3, 5)
set.size()
set.delete('a')
set.has('abc')
set.clear()
set.forEach(item => console.log(item))
```

## 深度分析与补充

**问题本质解读：** 这道题考察Set数据结构的基本概念和用法，面试官想了解你是否掌握ES6新增的集合数据类型。

**技术错误纠正：**

1. `set.add(2,3,5)`语法错误，add方法只接受一个参数，应该分别调用
2. `set.size()`错误，size是属性不是方法，应该是`set.size`

**知识点系统梳理：**

**Set的特点：**

1. **值的唯一性** - 不允许重复值
2. **任意类型** - 可以存储任意类型的值
3. **插入顺序** - 保持插入时的顺序
4. **NaN处理** - NaN被认为是相等的
5. **对象引用** - 对象按引用比较

**Set的主要方法：**

- add(value)：添加值
- delete(value)：删除值
- has(value)：检查是否存在
- clear()：清空所有值
- forEach()：遍历所有值

**实战应用举例：**

```javascript
// 1. Set的基本用法和特性
function setBasicsAndFeatures() {
  console.log('=== Set基本用法和特性 ===')

  // 创建Set
  const set1 = new Set()
  const set2 = new Set([1, 2, 3, 4, 4, 5]) // 重复值会被去除
  const set3 = new Set('hello') // 字符串会被拆分

  console.log('Empty set:', set1)
  console.log('Array to set:', set2) // Set(5) {1, 2, 3, 4, 5}
  console.log('String to set:', set3) // Set(4) {'h', 'e', 'l', 'o'}

  // 添加值
  set1.add(1)
  set1.add(2)
  set1.add(2) // 重复值不会被添加
  set1.add('2') // 字符串'2'和数字2是不同的

  console.log('After adding:', set1) // Set(3) {1, 2, '2'}
  console.log('Set size:', set1.size) // 3 (注意：size是属性，不是方法)

  // 检查值是否存在
  console.log('Has 1:', set1.has(1)) // true
  console.log('Has 3:', set1.has(3)) // false

  // 删除值
  console.log('Delete 2:', set1.delete(2)) // true
  console.log('Delete 10:', set1.delete(10)) // false
  console.log('After deletion:', set1) // Set(2) {1, '2'}

  // 特殊值处理
  const specialSet = new Set()
  specialSet.add(NaN)
  specialSet.add(NaN) // NaN被认为是相等的
  specialSet.add(undefined)
  specialSet.add(null)
  specialSet.add(0)
  specialSet.add(-0) // +0和-0被认为是相等的

  console.log('Special values:', specialSet) // Set(4) {NaN, undefined, null, 0}

  // 对象引用
  const obj1 = { name: 'Alice' }
  const obj2 = { name: 'Alice' }
  const objSet = new Set()
  objSet.add(obj1)
  objSet.add(obj2) // 不同的对象引用
  objSet.add(obj1) // 相同引用，不会重复添加

  console.log('Object set size:', objSet.size) // 2

  // 遍历Set
  console.log('Set iteration:')
  set2.forEach((value, valueAgain, set) => {
    console.log(`Value: ${value}, Same value: ${valueAgain}`)
  })

  // 使用for...of遍历
  console.log('For...of iteration:')
  for (const value of set2) {
    console.log(value)
  }

  // 清空Set
  const tempSet = new Set([1, 2, 3])
  console.log('Before clear:', tempSet.size) // 3
  tempSet.clear()
  console.log('After clear:', tempSet.size) // 0
}
```

```javascript
// 2. Set的实际应用场景
function setPracticalApplications() {
  console.log('=== Set实际应用场景 ===')

  // 1. 数组去重
  function arrayDeduplication() {
    const numbers = [1, 2, 3, 4, 4, 5, 3, 2, 1]
    const strings = ['a', 'b', 'c', 'a', 'b', 'd']
    const mixed = [1, '1', 2, '2', true, 'true', null, undefined]

    console.log('Original numbers:', numbers)
    console.log('Deduplicated numbers:', [...new Set(numbers)])

    console.log('Original strings:', strings)
    console.log('Deduplicated strings:', [...new Set(strings)])

    console.log('Original mixed:', mixed)
    console.log('Deduplicated mixed:', [...new Set(mixed)])
  }

  // 2. 权限管理
  class PermissionManager {
    constructor() {
      this.permissions = new Set()
    }

    addPermission(permission) {
      this.permissions.add(permission)
      return this
    }

    removePermission(permission) {
      return this.permissions.delete(permission)
    }

    hasPermission(permission) {
      return this.permissions.has(permission)
    }

    hasAllPermissions(requiredPermissions) {
      return requiredPermissions.every(permission => this.permissions.has(permission))
    }

    hasAnyPermission(requiredPermissions) {
      return requiredPermissions.some(permission => this.permissions.has(permission))
    }

    getAllPermissions() {
      return Array.from(this.permissions)
    }

    clearAllPermissions() {
      this.permissions.clear()
    }
  }

  // 3. 标签系统
  class TagManager {
    constructor() {
      this.tags = new Set()
    }

    addTag(tag) {
      this.tags.add(tag.toLowerCase())
      return this
    }

    addTags(tags) {
      tags.forEach(tag => this.addTag(tag))
      return this
    }

    removeTag(tag) {
      return this.tags.delete(tag.toLowerCase())
    }

    hasTag(tag) {
      return this.tags.has(tag.toLowerCase())
    }

    getTagCount() {
      return this.tags.size
    }

    getAllTags() {
      return Array.from(this.tags).sort()
    }

    filterByTags(items, requiredTags) {
      const requiredSet = new Set(requiredTags.map(tag => tag.toLowerCase()))

      return items.filter(item => {
        const itemTags = new Set(item.tags.map(tag => tag.toLowerCase()))
        return [...requiredSet].every(tag => itemTags.has(tag))
      })
    }
  }

  // 4. 访客追踪
  class VisitorTracker {
    constructor() {
      this.visitors = new Set()
      this.dailyVisitors = new Map() // 按日期分组
    }

    addVisitor(visitorId) {
      this.visitors.add(visitorId)

      const today = new Date().toDateString()
      if (!this.dailyVisitors.has(today)) {
        this.dailyVisitors.set(today, new Set())
      }
      this.dailyVisitors.get(today).add(visitorId)
    }

    getTotalUniqueVisitors() {
      return this.visitors.size
    }

    getDailyUniqueVisitors(date = new Date().toDateString()) {
      const dayVisitors = this.dailyVisitors.get(date)
      return dayVisitors ? dayVisitors.size : 0
    }

    isReturningVisitor(visitorId) {
      return this.visitors.has(visitorId)
    }

    getVisitorStats() {
      const stats = {}
      for (const [date, visitors] of this.dailyVisitors) {
        stats[date] = visitors.size
      }
      return stats
    }
  }

  // 测试应用
  arrayDeduplication()

  // 权限管理测试
  const permManager = new PermissionManager()
  permManager.addPermission('read').addPermission('write').addPermission('delete')

  console.log('Has read permission:', permManager.hasPermission('read'))
  console.log('Has all permissions:', permManager.hasAllPermissions(['read', 'write']))
  console.log('All permissions:', permManager.getAllPermissions())

  // 标签系统测试
  const tagManager = new TagManager()
  tagManager.addTags(['JavaScript', 'React', 'Node.js', 'javascript']) // 重复会被去除

  console.log('All tags:', tagManager.getAllTags())
  console.log('Tag count:', tagManager.getTagCount())

  // 访客追踪测试
  const tracker = new VisitorTracker()
  tracker.addVisitor('user1')
  tracker.addVisitor('user2')
  tracker.addVisitor('user1') // 重复访客

  console.log('Total unique visitors:', tracker.getTotalUniqueVisitors())
  console.log('Is user1 returning:', tracker.isReturningVisitor('user1'))
}
```

**记忆要点总结：**

- **唯一性**：Set自动去除重复值，基于SameValueZero算法
- **基本操作**：add()添加、delete()删除、has()检查、clear()清空
- **size属性**：获取Set中值的数量（注意不是方法）
- **遍历方式**：forEach()、for...of、扩展运算符
- **实际应用**：数组去重、权限管理、标签系统、访客追踪

# **105. [中级]** 如何使用Set进行数组去重？

```javascript
let arr = [1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 'a', 'b', 'a', 'c']
let nArr = [...new Set(arr)]
```

## 深度分析与补充

**问题本质解读：** 这道题考察使用Set进行数组去重的方法，面试官想了解你是否掌握Set的实际应用和去重的各种场景。

**知识点系统梳理：**

**Set去重的原理：**

1. **SameValueZero算法** - Set使用此算法判断值是否相等
2. **自动去重** - 添加重复值时会被忽略
3. **类型敏感** - 不同类型的相同值被认为是不同的
4. **NaN处理** - 多个NaN被认为是相同的
5. **对象引用** - 对象按引用地址比较

**去重的局限性：**

- 只能去除基本类型的重复
- 对象需要按引用比较
- 无法处理深层对象的重复

**实战应用举例：**

```javascript
// 1. 各种类型的数组去重
function arrayDeduplicationTypes() {
  console.log('=== 各种类型数组去重 ===')

  // 基本类型去重
  const numbers = [1, 2, 3, 2, 1, 4, 5, 4]
  const strings = ['a', 'b', 'c', 'b', 'a', 'd']
  const booleans = [true, false, true, false, true]
  const mixed = [1, '1', 2, '2', true, 'true', null, undefined, null]

  console.log('Numbers:', [...new Set(numbers)])
  console.log('Strings:', [...new Set(strings)])
  console.log('Booleans:', [...new Set(booleans)])
  console.log('Mixed types:', [...new Set(mixed)])

  // 特殊值处理
  const specialValues = [NaN, NaN, 0, -0, +0, undefined, null, undefined]
  console.log('Special values:', [...new Set(specialValues)])
  // 结果: [NaN, 0, undefined, null] (NaN被去重，+0和-0被认为相等)

  // 对象去重的局限性
  const objects = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 1, name: 'Alice' }, // 内容相同但引用不同
    { id: 3, name: 'Charlie' },
  ]

  console.log('Objects (no deduplication):', [...new Set(objects)])
  // 所有对象都会保留，因为它们是不同的引用

  // 对象引用去重
  const obj1 = { id: 1, name: 'Alice' }
  const obj2 = { id: 2, name: 'Bob' }
  const objectRefs = [obj1, obj2, obj1, obj2] // 相同引用

  console.log('Object references:', [...new Set(objectRefs)])
  // 只保留两个对象，因为引用相同
}
```

```javascript
// 2. 高级去重场景和解决方案
function advancedDeduplication() {
  console.log('=== 高级去重场景 ===')

  // 1. 对象数组按属性去重
  function deduplicateByProperty(array, property) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[property]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }

  // 2. 对象数组按多个属性去重
  function deduplicateByMultipleProperties(array, properties) {
    const seen = new Set()
    return array.filter(item => {
      const key = properties.map(prop => item[prop]).join('|')
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  // 3. 深度对象去重
  function deepObjectDeduplication(array) {
    const seen = new Set()
    return array.filter(item => {
      const key = JSON.stringify(item)
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  // 4. 自定义比较函数去重
  function deduplicateByComparator(array, compareFn) {
    const result = []
    const seen = new Set()

    for (const item of array) {
      let isDuplicate = false
      for (const seenItem of seen) {
        if (compareFn(item, seenItem)) {
          isDuplicate = true
          break
        }
      }
      if (!isDuplicate) {
        result.push(item)
        seen.add(item)
      }
    }

    return result
  }

  // 5. 性能优化的去重工具类
  class DeduplicationUtils {
    // 基本类型去重
    static basic(array) {
      return [...new Set(array)]
    }

    // 按属性去重
    static byProperty(array, property) {
      const map = new Map()
      for (const item of array) {
        const key = item[property]
        if (!map.has(key)) {
          map.set(key, item)
        }
      }
      return Array.from(map.values())
    }

    // 按函数结果去重
    static byFunction(array, keyFn) {
      const map = new Map()
      for (const item of array) {
        const key = keyFn(item)
        if (!map.has(key)) {
          map.set(key, item)
        }
      }
      return Array.from(map.values())
    }

    // 保持最后出现的元素
    static keepLast(array, keyFn = x => x) {
      const map = new Map()
      for (const item of array) {
        const key = keyFn(item)
        map.set(key, item) // 覆盖之前的值
      }
      return Array.from(map.values())
    }

    // 两个数组的交集
    static intersection(arr1, arr2) {
      const set2 = new Set(arr2)
      return [...new Set(arr1.filter(item => set2.has(item)))]
    }

    // 两个数组的差集
    static difference(arr1, arr2) {
      const set2 = new Set(arr2)
      return arr1.filter(item => !set2.has(item))
    }

    // 两个数组的并集
    static union(arr1, arr2) {
      return [...new Set([...arr1, ...arr2])]
    }
  }

  // 测试数据
  const users = [
    { id: 1, name: 'Alice', age: 25, department: 'IT' },
    { id: 2, name: 'Bob', age: 30, department: 'HR' },
    { id: 3, name: 'Alice', age: 25, department: 'IT' }, // 完全重复
    { id: 4, name: 'Charlie', age: 35, department: 'IT' },
    { id: 5, name: 'Alice', age: 28, department: 'Finance' }, // 名字重复但其他不同
  ]

  // 测试各种去重方法
  console.log('Original users:', users.length)

  console.log('By ID:', deduplicateByProperty(users, 'id').length)
  console.log('By name:', deduplicateByProperty(users, 'name').length)
  console.log('By name and age:', deduplicateByMultipleProperties(users, ['name', 'age']).length)
  console.log('Deep deduplication:', deepObjectDeduplication(users).length)

  // 使用工具类
  console.log('Utils by name:', DeduplicationUtils.byProperty(users, 'name').length)
  console.log('Utils by department:', DeduplicationUtils.byProperty(users, 'department').length)

  // 集合操作
  const arr1 = [1, 2, 3, 4, 5]
  const arr2 = [4, 5, 6, 7, 8]

  console.log('Intersection:', DeduplicationUtils.intersection(arr1, arr2))
  console.log('Difference:', DeduplicationUtils.difference(arr1, arr2))
  console.log('Union:', DeduplicationUtils.union(arr1, arr2))

  // 性能测试示例
  function performanceTest() {
    const largeArray = Array.from({ length: 100000 }, (_, i) => i % 1000)

    console.time('Set deduplication')
    const deduplicated = [...new Set(largeArray)]
    console.timeEnd('Set deduplication')

    console.log('Original length:', largeArray.length)
    console.log('Deduplicated length:', deduplicated.length)
  }

  performanceTest()
}
```

**记忆要点总结：**

- **基本用法**：`[...new Set(array)]`是最简单的去重方法
- **类型敏感**：不同类型的相同值不会被去重（如1和'1'）
- **对象局限**：只能去重相同引用的对象，不能去重内容相同的对象
- **高级场景**：需要自定义去重逻辑处理复杂对象
- **性能优势**：Set去重比传统方法（如filter+indexOf）性能更好

# **106. [中级]** Map和Object的区别是什么？

- Map 存储键值对，键可以是任意值，不能重复，没有原型链

## 深度分析与补充

**问题本质解读：** 这道题考察Map和Object的区别，面试官想了解你是否理解ES6新增的Map数据结构相比传统Object的优势。

**知识点系统梳理：**

**Map vs Object 主要区别：**

1. **键的类型** - Map的键可以是任意类型，Object的键只能是字符串或Symbol
2. **原型链** - Map没有默认键，Object有原型链上的默认键
3. **大小获取** - Map有size属性，Object需要手动计算
4. **迭代顺序** - Map保证插入顺序，Object在某些情况下不保证
5. **性能** - Map在频繁增删时性能更好

**实战应用举例：**

```javascript
// 1. Map和Object的基本区别对比
function mapVsObjectBasics() {
  console.log('=== Map vs Object 基本区别 ===')

  // 键的类型差异
  const map = new Map()
  const obj = {}

  // Map可以使用任意类型作为键
  const keyString = 'string'
  const keyNumber = 42
  const keyObject = { id: 1 }
  const keyFunction = function () {}
  const keySymbol = Symbol('key')

  map.set(keyString, 'string value')
  map.set(keyNumber, 'number value')
  map.set(keyObject, 'object value')
  map.set(keyFunction, 'function value')
  map.set(keySymbol, 'symbol value')

  console.log('Map with different key types:')
  console.log('String key:', map.get(keyString))
  console.log('Number key:', map.get(keyNumber))
  console.log('Object key:', map.get(keyObject))
  console.log('Function key:', map.get(keyFunction))
  console.log('Symbol key:', map.get(keySymbol))

  // Object只能使用字符串或Symbol作为键
  obj[keyString] = 'string value'
  obj[keyNumber] = 'number value' // 数字会被转换为字符串
  obj[keySymbol] = 'symbol value'
  // obj[keyObject] = 'object value'; // 对象会被转换为字符串 "[object Object]"

  console.log('Object keys:', Object.keys(obj)) // ['string', '42']
  console.log('Number key as string:', obj['42']) // 'number value'

  // 大小获取
  console.log('Map size:', map.size) // 5
  console.log('Object size:', Object.keys(obj).length) // 2 (不包括Symbol键)

  // 原型链差异
  console.log('Map has toString:', map.has('toString')) // false
  console.log('Object has toString:', 'toString' in obj) // true (继承自原型)

  // 迭代顺序
  const testMap = new Map()
  const testObj = {}

  // 添加不同类型的键
  testMap.set('2', 'two')
  testMap.set('1', 'one')
  testMap.set('10', 'ten')

  testObj['2'] = 'two'
  testObj['1'] = 'one'
  testObj['10'] = 'ten'

  console.log('Map iteration order:', [...testMap.keys()]) // ['2', '1', '10'] - 插入顺序
  console.log('Object keys order:', Object.keys(testObj)) // 可能是 ['1', '2', '10'] - 数字键会排序
}
```

```javascript
// 2. Map和Object的实际应用场景
function mapVsObjectApplications() {
  console.log('=== Map vs Object 实际应用 ===')

  // 1. 缓存系统 - Map更适合
  class CacheManager {
    constructor() {
      this.cache = new Map()
      this.maxSize = 100
    }

    set(key, value) {
      // Map可以使用任意类型作为键
      if (this.cache.size >= this.maxSize) {
        // 删除最早的条目
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
      }

      this.cache.set(key, {
        value,
        timestamp: Date.now(),
        accessCount: 0,
      })
    }

    get(key) {
      const item = this.cache.get(key)
      if (item) {
        item.accessCount++
        item.lastAccess = Date.now()
        return item.value
      }
      return undefined
    }

    has(key) {
      return this.cache.has(key)
    }

    delete(key) {
      return this.cache.delete(key)
    }

    clear() {
      this.cache.clear()
    }

    size() {
      return this.cache.size
    }

    // 获取统计信息
    getStats() {
      const stats = {
        totalItems: this.cache.size,
        items: [],
      }

      for (const [key, item] of this.cache) {
        stats.items.push({
          key: typeof key === 'object' ? '[Object]' : key,
          accessCount: item.accessCount,
          timestamp: item.timestamp,
          lastAccess: item.lastAccess,
        })
      }

      return stats
    }
  }

  // 2. 配置管理 - Object更适合
  class ConfigManager {
    constructor() {
      this.config = {
        database: {
          host: 'localhost',
          port: 5432,
          name: 'myapp',
        },
        api: {
          baseUrl: 'https://api.example.com',
          timeout: 5000,
          retries: 3,
        },
        features: {
          enableLogging: true,
          enableCache: true,
          maxUploadSize: 10485760,
        },
      }
    }

    get(path) {
      return path.split('.').reduce((obj, key) => obj?.[key], this.config)
    }

    set(path, value) {
      const keys = path.split('.')
      const lastKey = keys.pop()
      const target = keys.reduce((obj, key) => {
        if (!(key in obj)) obj[key] = {}
        return obj[key]
      }, this.config)

      target[lastKey] = value
    }

    merge(newConfig) {
      this.config = this.deepMerge(this.config, newConfig)
    }

    deepMerge(target, source) {
      const result = { ...target }

      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key])
        } else {
          result[key] = source[key]
        }
      }

      return result
    }

    toJSON() {
      return JSON.stringify(this.config, null, 2)
    }
  }

  // 3. 性能对比测试
  function performanceComparison() {
    console.log('=== 性能对比测试 ===')

    const iterations = 100000

    // Map性能测试
    console.time('Map operations')
    const map = new Map()

    // 插入
    for (let i = 0; i < iterations; i++) {
      map.set(i, `value${i}`)
    }

    // 查找
    for (let i = 0; i < iterations; i++) {
      map.get(i)
    }

    // 删除
    for (let i = 0; i < iterations; i += 2) {
      map.delete(i)
    }

    console.timeEnd('Map operations')

    // Object性能测试
    console.time('Object operations')
    const obj = {}

    // 插入
    for (let i = 0; i < iterations; i++) {
      obj[i] = `value${i}`
    }

    // 查找
    for (let i = 0; i < iterations; i++) {
      obj[i]
    }

    // 删除
    for (let i = 0; i < iterations; i += 2) {
      delete obj[i]
    }

    console.timeEnd('Object operations')

    console.log('Map final size:', map.size)
    console.log('Object final size:', Object.keys(obj).length)
  }

  // 测试缓存管理器
  const cache = new CacheManager()

  // 使用不同类型的键
  cache.set('string-key', 'string value')
  cache.set(42, 'number value')
  cache.set({ id: 1 }, 'object value')

  console.log('Cache get string:', cache.get('string-key'))
  console.log('Cache get number:', cache.get(42))
  console.log('Cache stats:', cache.getStats())

  // 测试配置管理器
  const config = new ConfigManager()
  console.log('Database host:', config.get('database.host'))

  config.set('api.version', 'v2')
  config.merge({
    features: {
      enableAnalytics: true,
    },
  })

  console.log('Updated config:', config.get('features'))

  // 运行性能测试
  performanceComparison()
}
```

**记忆要点总结：**

- **键类型**：Map支持任意类型键，Object只支持字符串和Symbol
- **原型链**：Map没有默认键，Object继承原型链上的属性
- **大小获取**：Map有size属性，Object需要Object.keys().length
- **迭代顺序**：Map保证插入顺序，Object的数字键会被排序
- **使用场景**：Map适合缓存、频繁增删，Object适合配置、结构化数据

# **107. [中级]** WeakSet和WeakMap的特点和用途

- WeakSet 成员只能是对象和Symbol值
- WeakMap 成员键的值只能是对象或者Symbol值
- 自动垃圾回收
- Vue的依赖收集和响应触发依赖WeakMap
- 对象的深拷贝依赖WeakMap

## 深度分析与补充

**问题本质解读：** 这道题考察WeakSet和WeakMap的特点，面试官想了解你是否理解弱引用集合的特殊性和应用场景。

**知识点系统梳理：**

**WeakSet和WeakMap的特点：**

1. **弱引用** - 不阻止垃圾回收
2. **键的限制** - 只能使用对象或Symbol作为键/值
3. **不可枚举** - 无法遍历，没有size属性
4. **自动清理** - 当引用的对象被回收时自动删除
5. **内存友好** - 避免内存泄漏

**主要用途：**

- 对象元数据存储
- 防止内存泄漏
- 私有数据关联
- 依赖追踪

**实战应用举例：**

```javascript
// 1. WeakSet和WeakMap的基本特性
function weakCollectionsBasics() {
  console.log('=== WeakSet和WeakMap基本特性 ===')

  // WeakSet基本用法
  const weakSet = new WeakSet()
  const obj1 = { id: 1 }
  const obj2 = { id: 2 }

  weakSet.add(obj1)
  weakSet.add(obj2)

  console.log('WeakSet has obj1:', weakSet.has(obj1)) // true
  console.log('WeakSet has obj2:', weakSet.has(obj2)) // true

  // 删除对象
  weakSet.delete(obj1)
  console.log('After delete, has obj1:', weakSet.has(obj1)) // false

  // WeakMap基本用法
  const weakMap = new WeakMap()
  const keyObj1 = { name: 'key1' }
  const keyObj2 = { name: 'key2' }

  weakMap.set(keyObj1, 'value1')
  weakMap.set(keyObj2, 'value2')

  console.log('WeakMap get keyObj1:', weakMap.get(keyObj1)) // 'value1'
  console.log('WeakMap has keyObj2:', weakMap.has(keyObj2)) // true

  // 删除键值对
  weakMap.delete(keyObj1)
  console.log('After delete, has keyObj1:', weakMap.has(keyObj1)) // false

  // 无法枚举
  console.log('WeakSet size:', weakSet.size) // undefined
  console.log('WeakMap size:', weakMap.size) // undefined

  // 尝试使用原始值（会报错）
  try {
    weakSet.add('string') // TypeError
  } catch (error) {
    console.log('WeakSet error:', error.message)
  }

  try {
    weakMap.set('string', 'value') // TypeError
  } catch (error) {
    console.log('WeakMap error:', error.message)
  }
}
```

```javascript
// 2. WeakSet和WeakMap的实际应用场景
function weakCollectionsApplications() {
  console.log('=== WeakSet和WeakMap实际应用 ===')

  // 1. 对象标记系统 - WeakSet
  class ObjectMarker {
    constructor() {
      this.processedObjects = new WeakSet()
      this.validatedObjects = new WeakSet()
    }

    markAsProcessed(obj) {
      this.processedObjects.add(obj)
    }

    isProcessed(obj) {
      return this.processedObjects.has(obj)
    }

    markAsValidated(obj) {
      this.validatedObjects.add(obj)
    }

    isValidated(obj) {
      return this.validatedObjects.has(obj)
    }

    processObject(obj) {
      if (this.isProcessed(obj)) {
        console.log('Object already processed')
        return
      }

      // 模拟处理逻辑
      console.log('Processing object:', obj.id)
      this.markAsProcessed(obj)

      if (obj.isValid) {
        this.markAsValidated(obj)
      }
    }
  }

  // 2. 私有数据存储 - WeakMap
  const privateData = new WeakMap()

  class User {
    constructor(name, email, password) {
      this.name = name
      this.email = email

      // 使用WeakMap存储私有数据
      privateData.set(this, {
        password: this.hashPassword(password),
        loginAttempts: 0,
        lastLogin: null,
        secretKey: Math.random().toString(36),
      })
    }

    hashPassword(password) {
      // 简单的哈希模拟
      return 'hashed_' + password
    }

    login(password) {
      const data = privateData.get(this)
      const hashedPassword = this.hashPassword(password)

      if (data.password === hashedPassword) {
        data.loginAttempts = 0
        data.lastLogin = new Date()
        return { success: true, message: 'Login successful' }
      } else {
        data.loginAttempts++
        return {
          success: false,
          message: `Invalid password. Attempts: ${data.loginAttempts}`,
        }
      }
    }

    getLoginInfo() {
      const data = privateData.get(this)
      return {
        lastLogin: data.lastLogin,
        loginAttempts: data.loginAttempts,
      }
    }

    // 私有数据在对象被回收时自动清理
    static getPrivateDataSize() {
      // 无法直接获取WeakMap大小，这只是演示
      return 'WeakMap size is not accessible'
    }
  }

  // 3. DOM元素元数据 - WeakMap
  class DOMMetadata {
    constructor() {
      this.elementData = new WeakMap()
    }

    setData(element, data) {
      this.elementData.set(element, data)
    }

    getData(element) {
      return this.elementData.get(element)
    }

    hasData(element) {
      return this.elementData.has(element)
    }

    removeData(element) {
      return this.elementData.delete(element)
    }

    // 为元素添加事件监听器和数据
    attachListener(element, eventType, handler, metadata = {}) {
      element.addEventListener(eventType, handler)

      const existingData = this.getData(element) || {}
      this.setData(element, {
        ...existingData,
        ...metadata,
        listeners: [...(existingData.listeners || []), { eventType, handler }],
      })
    }

    // 清理元素的所有监听器
    cleanup(element) {
      const data = this.getData(element)
      if (data && data.listeners) {
        data.listeners.forEach(({ eventType, handler }) => {
          element.removeEventListener(eventType, handler)
        })
      }
      this.removeData(element)
    }
  }

  // 4. 循环引用检测 - WeakSet
  function deepClone(obj, visited = new WeakSet()) {
    // 检查循环引用
    if (visited.has(obj)) {
      throw new Error('Circular reference detected')
    }

    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    // 标记当前对象为已访问
    visited.add(obj)

    let cloned

    if (Array.isArray(obj)) {
      cloned = obj.map(item => deepClone(item, visited))
    } else {
      cloned = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = deepClone(obj[key], visited)
        }
      }
    }

    // 处理完成后从访问集合中移除
    visited.delete(obj)

    return cloned
  }

  // 测试对象标记系统
  const marker = new ObjectMarker()
  const testObj1 = { id: 1, isValid: true }
  const testObj2 = { id: 2, isValid: false }

  marker.processObject(testObj1)
  marker.processObject(testObj2)
  marker.processObject(testObj1) // 已处理，不会重复处理

  console.log('Object 1 processed:', marker.isProcessed(testObj1))
  console.log('Object 1 validated:', marker.isValidated(testObj1))

  // 测试用户私有数据
  const user = new User('John', 'john@example.com', 'password123')
  console.log('Login result:', user.login('password123'))
  console.log('Login info:', user.getLoginInfo())

  // 测试深拷贝循环引用检测
  const circularObj = { name: 'test' }
  circularObj.self = circularObj

  try {
    deepClone(circularObj)
  } catch (error) {
    console.log('Circular reference error:', error.message)
  }

  // 正常对象深拷贝
  const normalObj = { a: 1, b: { c: 2, d: [3, 4] } }
  const cloned = deepClone(normalObj)
  console.log('Deep clone successful:', cloned)
}
```

**记忆要点总结：**

- **弱引用**：不阻止垃圾回收，当对象没有其他引用时会被自动清理
- **键值限制**：只能使用对象或Symbol，不能使用原始值
- **不可枚举**：无法遍历，没有size属性，无法获取所有键值
- **内存安全**：自动清理，避免内存泄漏
- **实际应用**：私有数据存储、DOM元数据、循环引用检测、对象标记

# **108. [中级]** 如何遍历Set和Map？

- Map/Set .keys() .values() .entries() forEach()

## 深度分析与补充

**问题本质解读：** 这道题考察Set和Map的遍历方法，面试官想了解你是否掌握ES6集合数据结构的各种迭代方式。

**知识点系统梳理：**

**Set和Map的遍历方法：**

1. **forEach()** - 回调函数遍历
2. **for...of** - 直接遍历值或键值对
3. **keys()** - 返回键的迭代器
4. **values()** - 返回值的迭代器
5. **entries()** - 返回键值对的迭代器

**遍历特点：**

- 保持插入顺序
- 支持迭代器协议
- 可以使用扩展运算符
- 支持解构赋值

**实战应用举例：**

```javascript
// 1. Set的各种遍历方式
function setIterationMethods() {
  console.log('=== Set遍历方式 ===')

  const fruits = new Set(['apple', 'banana', 'orange', 'apple']) // 重复会被去除

  console.log('Set contents:', fruits)

  // 1. forEach遍历
  console.log('1. forEach遍历:')
  fruits.forEach((value, valueAgain, set) => {
    console.log(`Value: ${value}, Same value: ${valueAgain}`)
    // 注意：Set的forEach中，第一个和第二个参数都是值
  })

  // 2. for...of遍历（最常用）
  console.log('2. for...of遍历:')
  for (const fruit of fruits) {
    console.log(`Fruit: ${fruit}`)
  }

  // 3. keys()方法（Set中keys()和values()返回相同结果）
  console.log('3. keys()遍历:')
  for (const key of fruits.keys()) {
    console.log(`Key: ${key}`)
  }

  // 4. values()方法
  console.log('4. values()遍历:')
  for (const value of fruits.values()) {
    console.log(`Value: ${value}`)
  }

  // 5. entries()方法
  console.log('5. entries()遍历:')
  for (const [key, value] of fruits.entries()) {
    console.log(`Entry: [${key}, ${value}]`) // key和value相同
  }

  // 6. 使用扩展运算符
  console.log('6. 扩展运算符:')
  const fruitsArray = [...fruits]
  console.log('Set to Array:', fruitsArray)

  // 7. 使用Array.from()
  console.log('7. Array.from():')
  const fruitsArray2 = Array.from(fruits)
  console.log('Array.from result:', fruitsArray2)

  // 8. 迭代器手动遍历
  console.log('8. 手动迭代器:')
  const iterator = fruits.values()
  let result = iterator.next()
  while (!result.done) {
    console.log(`Iterator value: ${result.value}`)
    result = iterator.next()
  }
}
```

```javascript
// 2. Map的各种遍历方式
function mapIterationMethods() {
  console.log('=== Map遍历方式 ===')

  const userRoles = new Map([
    ['alice', 'admin'],
    ['bob', 'user'],
    ['charlie', 'moderator'],
    ['diana', 'user'],
  ])

  console.log('Map contents:', userRoles)

  // 1. forEach遍历
  console.log('1. forEach遍历:')
  userRoles.forEach((value, key, map) => {
    console.log(`User: ${key}, Role: ${value}`)
  })

  // 2. for...of遍历（默认遍历entries）
  console.log('2. for...of遍历:')
  for (const [user, role] of userRoles) {
    console.log(`${user} is ${role}`)
  }

  // 3. keys()方法
  console.log('3. keys()遍历:')
  for (const user of userRoles.keys()) {
    console.log(`User: ${user}`)
  }

  // 4. values()方法
  console.log('4. values()遍历:')
  for (const role of userRoles.values()) {
    console.log(`Role: ${role}`)
  }

  // 5. entries()方法（与默认for...of相同）
  console.log('5. entries()遍历:')
  for (const [user, role] of userRoles.entries()) {
    console.log(`Entry: ${user} -> ${role}`)
  }

  // 6. 转换为数组
  console.log('6. 转换为数组:')
  const usersArray = [...userRoles.keys()]
  const rolesArray = [...userRoles.values()]
  const entriesArray = [...userRoles.entries()]

  console.log('Users:', usersArray)
  console.log('Roles:', rolesArray)
  console.log('Entries:', entriesArray)

  // 7. 解构赋值
  console.log('7. 解构赋值:')
  const [[firstUser, firstRole], [secondUser, secondRole]] = userRoles
  console.log(`First: ${firstUser} -> ${firstRole}`)
  console.log(`Second: ${secondUser} -> ${secondRole}`)

  // 8. 过滤和映射
  console.log('8. 过滤和映射:')

  // 过滤管理员
  const admins = new Map([...userRoles].filter(([user, role]) => role === 'admin'))
  console.log('Admins:', admins)

  // 映射为新格式
  const userInfo = new Map(
    [...userRoles].map(([user, role]) => [
      user,
      { role, permissions: role === 'admin' ? ['read', 'write', 'delete'] : ['read'] },
    ]),
  )
  console.log('User info:', userInfo.get('alice'))
}
```

```javascript
// 3. 实际应用场景中的遍历
function practicalIterationScenarios() {
  console.log('=== 实际应用场景遍历 ===')

  // 1. 统计分析
  function analyzeData() {
    const salesData = new Map([
      ['Q1', 150000],
      ['Q2', 180000],
      ['Q3', 165000],
      ['Q4', 200000],
    ])

    // 计算总销售额
    let totalSales = 0
    for (const [quarter, sales] of salesData) {
      totalSales += sales
    }

    // 找出最高销售额的季度
    let maxQuarter = ''
    let maxSales = 0
    salesData.forEach((sales, quarter) => {
      if (sales > maxSales) {
        maxSales = sales
        maxQuarter = quarter
      }
    })

    // 计算平均值
    const avgSales = totalSales / salesData.size

    console.log('Sales Analysis:')
    console.log(`Total: $${totalSales.toLocaleString()}`)
    console.log(`Average: $${avgSales.toLocaleString()}`)
    console.log(`Best quarter: ${maxQuarter} ($${maxSales.toLocaleString()})`)

    return { totalSales, avgSales, maxQuarter, maxSales }
  }

  // 2. 数据转换
  function transformData() {
    const rawData = new Set([
      { id: 1, name: 'Alice', department: 'IT' },
      { id: 2, name: 'Bob', department: 'HR' },
      { id: 3, name: 'Charlie', department: 'IT' },
      { id: 4, name: 'Diana', department: 'Finance' },
    ])

    // 按部门分组
    const departmentGroups = new Map()

    for (const employee of rawData) {
      const dept = employee.department
      if (!departmentGroups.has(dept)) {
        departmentGroups.set(dept, [])
      }
      departmentGroups.get(dept).push(employee)
    }

    console.log('Department Groups:')
    departmentGroups.forEach((employees, department) => {
      console.log(`${department}: ${employees.map(e => e.name).join(', ')}`)
    })

    return departmentGroups
  }

  // 3. 缓存清理
  function cacheCleanup() {
    const cache = new Map([
      ['user:1', { data: 'Alice', timestamp: Date.now() - 3600000 }], // 1小时前
      ['user:2', { data: 'Bob', timestamp: Date.now() - 1800000 }], // 30分钟前
      ['user:3', { data: 'Charlie', timestamp: Date.now() - 300000 }], // 5分钟前
      ['user:4', { data: 'Diana', timestamp: Date.now() - 60000 }], // 1分钟前
    ])

    const maxAge = 30 * 60 * 1000 // 30分钟
    const now = Date.now()

    console.log('Cache before cleanup:', cache.size)

    // 清理过期缓存
    for (const [key, value] of cache) {
      if (now - value.timestamp > maxAge) {
        cache.delete(key)
        console.log(`Removed expired cache: ${key}`)
      }
    }

    console.log('Cache after cleanup:', cache.size)

    return cache
  }

  // 4. 配置验证
  function validateConfig() {
    const requiredSettings = new Set(['database.host', 'database.port', 'api.key', 'api.secret'])

    const currentConfig = new Map([
      ['database.host', 'localhost'],
      ['database.port', 5432],
      ['api.key', 'abc123'],
      ['cache.ttl', 3600],
      // 缺少 api.secret
    ])

    const missing = []
    const present = []

    for (const setting of requiredSettings) {
      if (currentConfig.has(setting)) {
        present.push(setting)
      } else {
        missing.push(setting)
      }
    }

    console.log('Config Validation:')
    console.log('Present settings:', present)
    console.log('Missing settings:', missing)

    return { isValid: missing.length === 0, missing, present }
  }

  // 执行测试
  analyzeData()
  transformData()
  cacheCleanup()
  validateConfig()
}
```

**记忆要点总结：**

- **Set遍历**：keys()和values()返回相同结果，entries()返回[value, value]
- **Map遍历**：keys()返回键，values()返回值，entries()返回[key, value]
- **for...of**：最常用的遍历方式，Map默认遍历entries
- **forEach**：提供回调函数方式，参数顺序不同（Set: value, value, set; Map: value, key, map）
- **实际应用**：数据分析、转换、缓存管理、配置验证等场景

# **109. [高级]** 什么情况下使用WeakMap比Map更合适？

- WeakMap 的成员键值只能是对象或者Symbol，所以在考虑自动垃圾回收时使用WeakMap比Map更合适

## 深度分析与补充

**问题本质解读：** 这道题考察WeakMap相比Map的优势场景，面试官想了解你是否理解弱引用的实际应用价值。

**知识点系统梳理：**

**WeakMap比Map更合适的场景：**

1. **避免内存泄漏** - 对象被回收时自动清理关联数据
2. **私有数据存储** - 为对象关联私有信息
3. **DOM元素元数据** - 避免DOM节点内存泄漏
4. **缓存系统** - 对象缓存自动清理
5. **依赖追踪** - 框架中的响应式系统

**WeakMap的优势：**

- 弱引用，不阻止垃圾回收
- 自动清理，防止内存泄漏
- 真正的私有性
- 适合临时关联数据

**实战应用举例：**

```javascript
// 1. 内存泄漏对比演示
function memoryLeakComparison() {
  console.log('=== 内存泄漏对比 ===')

  // 使用Map可能导致内存泄漏
  class ComponentManagerWithMap {
    constructor() {
      this.componentData = new Map() // 强引用
    }

    registerComponent(component, data) {
      this.componentData.set(component, data)
    }

    getComponentData(component) {
      return this.componentData.get(component)
    }

    // 需要手动清理，否则会内存泄漏
    unregisterComponent(component) {
      this.componentData.delete(component)
    }

    getSize() {
      return this.componentData.size
    }
  }

  // 使用WeakMap自动清理
  class ComponentManagerWithWeakMap {
    constructor() {
      this.componentData = new WeakMap() // 弱引用
    }

    registerComponent(component, data) {
      this.componentData.set(component, data)
    }

    getComponentData(component) {
      return this.componentData.get(component)
    }

    // 不需要手动清理，对象被回收时自动清理
    // 无法获取size，因为WeakMap不可枚举
  }

  // 模拟组件创建和销毁
  function simulateComponentLifecycle() {
    const mapManager = new ComponentManagerWithMap()
    const weakMapManager = new ComponentManagerWithWeakMap()

    // 创建组件
    let component1 = { id: 1, name: 'Header' }
    let component2 = { id: 2, name: 'Footer' }

    mapManager.registerComponent(component1, { props: {}, state: {} })
    mapManager.registerComponent(component2, { props: {}, state: {} })

    weakMapManager.registerComponent(component1, { props: {}, state: {} })
    weakMapManager.registerComponent(component2, { props: {}, state: {} })

    console.log('Map manager size after registration:', mapManager.getSize())

    // 模拟组件销毁（移除引用）
    component1 = null
    component2 = null

    // 强制垃圾回收（在实际环境中由引擎自动处理）
    if (global.gc) {
      global.gc()
    }

    // Map仍然持有引用，需要手动清理
    console.log('Map manager size after component destruction:', mapManager.getSize())
    // WeakMap会自动清理，但无法直接观察到size变化

    return { mapManager, weakMapManager }
  }

  simulateComponentLifecycle()
}
```

```javascript
// 2. WeakMap的实际应用场景
function weakMapPracticalScenarios() {
  console.log('=== WeakMap实际应用场景 ===')

  // 1. 私有数据存储
  const privateData = new WeakMap()

  class BankAccount {
    constructor(accountNumber, initialBalance) {
      this.accountNumber = accountNumber

      // 使用WeakMap存储敏感数据
      privateData.set(this, {
        balance: initialBalance,
        pin: null,
        transactions: [],
        secretKey: Math.random().toString(36),
      })
    }

    setPin(pin) {
      const data = privateData.get(this)
      data.pin = pin
    }

    getBalance(pin) {
      const data = privateData.get(this)
      if (data.pin !== pin) {
        throw new Error('Invalid PIN')
      }
      return data.balance
    }

    transfer(amount, pin, targetAccount) {
      const data = privateData.get(this)
      if (data.pin !== pin) {
        throw new Error('Invalid PIN')
      }

      if (data.balance < amount) {
        throw new Error('Insufficient funds')
      }

      data.balance -= amount
      data.transactions.push({
        type: 'transfer',
        amount,
        target: targetAccount.accountNumber,
        timestamp: new Date(),
      })

      return data.balance
    }
  }

  // 2. DOM元素元数据管理
  class DOMElementManager {
    constructor() {
      this.elementMetadata = new WeakMap()
      this.eventListeners = new WeakMap()
    }

    attachMetadata(element, metadata) {
      this.elementMetadata.set(element, {
        ...metadata,
        createdAt: new Date(),
        id: Math.random().toString(36),
      })
    }

    getMetadata(element) {
      return this.elementMetadata.get(element)
    }

    addEventListener(element, eventType, handler, options = {}) {
      element.addEventListener(eventType, handler, options)

      if (!this.eventListeners.has(element)) {
        this.eventListeners.set(element, [])
      }

      this.eventListeners.get(element).push({
        eventType,
        handler,
        options,
      })
    }

    removeAllListeners(element) {
      const listeners = this.eventListeners.get(element)
      if (listeners) {
        listeners.forEach(({ eventType, handler, options }) => {
          element.removeEventListener(eventType, handler, options)
        })
        this.eventListeners.delete(element)
      }
    }

    // 当DOM元素被移除时，WeakMap会自动清理相关数据
  }

  // 3. 对象缓存系统
  class ObjectCache {
    constructor() {
      this.cache = new WeakMap()
    }

    computeExpensiveOperation(obj) {
      // 检查缓存
      if (this.cache.has(obj)) {
        console.log('Cache hit')
        return this.cache.get(obj)
      }

      console.log('Cache miss, computing...')

      // 模拟昂贵的计算
      const result = {
        hash: this.computeHash(obj),
        processedAt: new Date(),
        metadata: this.extractMetadata(obj),
      }

      // 缓存结果
      this.cache.set(obj, result)

      return result
    }

    computeHash(obj) {
      return JSON.stringify(obj)
        .split('')
        .reduce((hash, char) => {
          return (hash << 5) - hash + char.charCodeAt(0)
        }, 0)
    }

    extractMetadata(obj) {
      return {
        keys: Object.keys(obj),
        type: typeof obj,
        size: JSON.stringify(obj).length,
      }
    }
  }

  // 4. 依赖追踪系统（类似Vue的响应式）
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

    reactive(obj) {
      return new Proxy(obj, {
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

  // 测试私有数据存储
  const account = new BankAccount('123456789', 1000)
  account.setPin('1234')

  console.log('Account balance:', account.getBalance('1234'))

  // 测试对象缓存
  const cache = new ObjectCache()
  const testObj = { name: 'test', value: 42 }

  console.log('First call:', cache.computeExpensiveOperation(testObj))
  console.log('Second call:', cache.computeExpensiveOperation(testObj)) // 应该命中缓存

  // 测试响应式系统
  const reactive = new ReactiveSystem()
  const state = reactive.reactive({ count: 0 })

  reactive.effect(() => {
    console.log('Count changed:', state.count)
  })

  state.count = 1 // 触发effect
  state.count = 2 // 再次触发effect
}
```

**记忆要点总结：**

- **内存管理**：WeakMap不阻止键对象被垃圾回收，避免内存泄漏
- **私有数据**：为对象关联私有信息，对象销毁时自动清理
- **DOM管理**：管理DOM元素元数据，避免DOM节点内存泄漏
- **缓存系统**：对象缓存自动清理，无需手动管理
- **框架应用**：响应式系统、依赖追踪等框架内部实现

# **110. [中级]** Map的键可以是什么类型？

- 任意类型

## 深度分析与补充

**问题本质解读：** 这道题考察Map键的类型范围，面试官想了解你是否理解Map相比Object在键类型方面的优势。

**知识点系统梳理：**

**Map键的类型：**

1. **原始类型** - 字符串、数字、布尔值、null、undefined、Symbol
2. **对象类型** - 普通对象、数组、函数、Date、RegExp等
3. **特殊值** - NaN、+0/-0的处理
4. **键的比较** - 使用SameValueZero算法
5. **键的唯一性** - 相同键只能存在一个

**实战应用举例：**

```javascript
// 1. Map键类型的完整演示
function mapKeyTypesDemo() {
  console.log('=== Map键类型演示 ===')

  const map = new Map()

  // 原始类型作为键
  map.set('string', 'String key')
  map.set(42, 'Number key')
  map.set(true, 'Boolean key')
  map.set(null, 'Null key')
  map.set(undefined, 'Undefined key')
  map.set(Symbol('sym'), 'Symbol key')

  // 特殊数值
  map.set(NaN, 'NaN key')
  map.set(0, 'Zero key')
  map.set(-0, 'Negative zero key') // 与+0相同

  // 对象类型作为键
  const objKey = { id: 1 }
  const arrKey = [1, 2, 3]
  const funcKey = function () {
    return 'hello'
  }
  const dateKey = new Date()
  const regexKey = /pattern/

  map.set(objKey, 'Object key')
  map.set(arrKey, 'Array key')
  map.set(funcKey, 'Function key')
  map.set(dateKey, 'Date key')
  map.set(regexKey, 'RegExp key')

  // 显示所有键值对
  console.log('Map contents:')
  map.forEach((value, key) => {
    console.log(`${typeof key} key:`, key, '=>', value)
  })

  // 特殊情况验证
  console.log('NaN key exists:', map.has(NaN)) // true
  console.log('0 and -0 are same:', map.get(0) === map.get(-0)) // true
  console.log('Object key by reference:', map.get(objKey)) // 'Object key'
  console.log('Different object with same content:', map.get({ id: 1 })) // undefined

  return map
}
```

```javascript
// 2. Map键类型的实际应用场景
function mapKeyApplications() {
  console.log('=== Map键类型实际应用 ===')

  // 1. 使用对象作为键 - 元数据管理
  class MetadataManager {
    constructor() {
      this.metadata = new Map()
    }

    setMetadata(obj, data) {
      this.metadata.set(obj, {
        ...data,
        createdAt: new Date(),
        id: Math.random().toString(36),
      })
    }

    getMetadata(obj) {
      return this.metadata.get(obj)
    }

    hasMetadata(obj) {
      return this.metadata.has(obj)
    }

    removeMetadata(obj) {
      return this.metadata.delete(obj)
    }

    getAllMetadata() {
      return Array.from(this.metadata.entries())
    }
  }

  // 2. 使用函数作为键 - 缓存系统
  class FunctionCache {
    constructor() {
      this.cache = new Map()
    }

    memoize(fn) {
      if (this.cache.has(fn)) {
        return this.cache.get(fn)
      }

      const memoizedFn = (...args) => {
        const key = JSON.stringify(args)
        const fnCache = this.cache.get(fn) || new Map()

        if (fnCache.has(key)) {
          console.log('Cache hit for:', fn.name)
          return fnCache.get(key)
        }

        const result = fn.apply(this, args)
        fnCache.set(key, result)
        this.cache.set(fn, fnCache)

        console.log('Cache miss for:', fn.name)
        return result
      }

      return memoizedFn
    }

    clearCache(fn) {
      return this.cache.delete(fn)
    }

    getCacheSize() {
      return this.cache.size
    }
  }

  // 3. 使用Symbol作为键 - 私有属性模拟
  const PRIVATE_PROPS = {
    balance: Symbol('balance'),
    pin: Symbol('pin'),
    transactions: Symbol('transactions'),
  }

  class SecureAccount {
    constructor(initialBalance, pin) {
      const accountData = new Map()

      accountData.set(PRIVATE_PROPS.balance, initialBalance)
      accountData.set(PRIVATE_PROPS.pin, pin)
      accountData.set(PRIVATE_PROPS.transactions, [])

      // 将Map存储为实例的私有属性
      Object.defineProperty(this, '_data', {
        value: accountData,
        writable: false,
        enumerable: false,
        configurable: false,
      })
    }

    getBalance(pin) {
      if (this._data.get(PRIVATE_PROPS.pin) !== pin) {
        throw new Error('Invalid PIN')
      }
      return this._data.get(PRIVATE_PROPS.balance)
    }

    deposit(amount, pin) {
      if (this._data.get(PRIVATE_PROPS.pin) !== pin) {
        throw new Error('Invalid PIN')
      }

      const currentBalance = this._data.get(PRIVATE_PROPS.balance)
      const newBalance = currentBalance + amount

      this._data.set(PRIVATE_PROPS.balance, newBalance)

      const transactions = this._data.get(PRIVATE_PROPS.transactions)
      transactions.push({
        type: 'deposit',
        amount,
        balance: newBalance,
        timestamp: new Date(),
      })

      return newBalance
    }
  }

  // 4. 复合键策略
  class MultiKeyMap {
    constructor() {
      this.map = new Map()
    }

    // 使用数组作为复合键
    setByCompositeKey(keys, value) {
      const compositeKey = JSON.stringify(keys)
      this.map.set(compositeKey, value)
    }

    getByCompositeKey(keys) {
      const compositeKey = JSON.stringify(keys)
      return this.map.get(compositeKey)
    }

    // 使用对象作为结构化键
    setByStructuredKey(keyObj, value) {
      this.map.set(keyObj, value)
    }

    getByStructuredKey(keyObj) {
      return this.map.get(keyObj)
    }

    // 查找具有相似键结构的条目
    findSimilarKeys(targetKey) {
      const results = []

      for (const [key, value] of this.map) {
        if (typeof key === 'object' && key !== null) {
          const keyProps = Object.keys(key)
          const targetProps = Object.keys(targetKey)

          const hasCommonProps = keyProps.some(
            prop => targetProps.includes(prop) && key[prop] === targetKey[prop],
          )

          if (hasCommonProps) {
            results.push({ key, value })
          }
        }
      }

      return results
    }
  }

  // 测试元数据管理
  const metaManager = new MetadataManager()
  const user1 = { name: 'Alice' }
  const user2 = { name: 'Bob' }

  metaManager.setMetadata(user1, { role: 'admin', permissions: ['read', 'write'] })
  metaManager.setMetadata(user2, { role: 'user', permissions: ['read'] })

  console.log('User1 metadata:', metaManager.getMetadata(user1))
  console.log('User2 metadata:', metaManager.getMetadata(user2))

  // 测试函数缓存
  const fnCache = new FunctionCache()

  function expensiveCalculation(n) {
    let result = 0
    for (let i = 0; i < n; i++) {
      result += i
    }
    return result
  }

  const memoizedCalc = fnCache.memoize(expensiveCalculation)

  console.log('First call:', memoizedCalc(1000))
  console.log('Second call:', memoizedCalc(1000)) // 应该命中缓存

  // 测试安全账户
  const account = new SecureAccount(1000, '1234')
  console.log('Initial balance:', account.getBalance('1234'))
  console.log('After deposit:', account.deposit(500, '1234'))

  // 测试复合键
  const multiMap = new MultiKeyMap()

  const structuredKey1 = { userId: 1, sessionId: 'abc123' }
  const structuredKey2 = { userId: 2, sessionId: 'def456' }

  multiMap.setByStructuredKey(structuredKey1, 'User 1 session data')
  multiMap.setByStructuredKey(structuredKey2, 'User 2 session data')

  console.log('Structured key lookup:', multiMap.getByStructuredKey(structuredKey1))

  const similarKeys = multiMap.findSimilarKeys({ userId: 1 })
  console.log('Similar keys found:', similarKeys.length)
}
```

**记忆要点总结：**

- **任意类型**：Map的键可以是任意JavaScript值，包括原始类型和对象
- **引用比较**：对象键按引用比较，相同内容的不同对象是不同的键
- **特殊值处理**：NaN被认为等于自身，+0和-0被认为相等
- **实际应用**：元数据管理、函数缓存、私有属性、复合键策略
- **优势体现**：相比Object，Map在键类型方面更加灵活和强大

# **111. [中级]** 如何将Map转换为数组？

```javascript
const myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc'])
;[...myMap]
```

## 深度分析与补充

**问题本质解读：** 这道题考察Map转数组的方法，面试官想了解你是否掌握Map的各种转换技巧和应用场景。

**知识点系统梳理：**

**Map转数组的方法：**

1. **扩展运算符** - [...map] 转为键值对数组
2. **Array.from()** - Array.from(map) 同样效果
3. **keys()方法** - [...map.keys()] 获取键数组
4. **values()方法** - [...map.values()] 获取值数组
5. **entries()方法** - [...map.entries()] 获取键值对数组

**实战应用举例：**

```javascript
// 1. Map转数组的各种方法
function mapToArrayMethods() {
  console.log('=== Map转数组方法 ===')

  const userMap = new Map([
    ['alice', { age: 25, role: 'admin' }],
    ['bob', { age: 30, role: 'user' }],
    ['charlie', { age: 35, role: 'moderator' }],
  ])

  // 方法1：扩展运算符（最常用）
  const entriesArray1 = [...userMap]
  console.log('扩展运算符:', entriesArray1)

  // 方法2：Array.from()
  const entriesArray2 = Array.from(userMap)
  console.log('Array.from():', entriesArray2)

  // 方法3：获取键数组
  const keysArray = [...userMap.keys()]
  console.log('键数组:', keysArray)

  // 方法4：获取值数组
  const valuesArray = [...userMap.values()]
  console.log('值数组:', valuesArray)

  // 方法5：显式调用entries()
  const entriesArray3 = [...userMap.entries()]
  console.log('entries()方法:', entriesArray3)

  // 方法6：使用forEach手动构建
  const manualArray = []
  userMap.forEach((value, key) => {
    manualArray.push([key, value])
  })
  console.log('手动构建:', manualArray)

  return { entriesArray1, keysArray, valuesArray }
}
```

```javascript
// 2. Map转数组的实际应用场景
function mapToArrayApplications() {
  console.log('=== Map转数组实际应用 ===')

  // 1. 数据排序
  function sortMapData() {
    const salesMap = new Map([
      ['Q1', 150000],
      ['Q3', 165000],
      ['Q2', 180000],
      ['Q4', 200000],
    ])

    // 按值排序
    const sortedByValue = [...salesMap.entries()].sort(([, a], [, b]) => b - a)

    // 按键排序
    const sortedByKey = [...salesMap.entries()].sort(([a], [b]) => a.localeCompare(b))

    console.log('按销售额排序:', sortedByValue)
    console.log('按季度排序:', sortedByKey)

    // 转回Map
    const sortedMap = new Map(sortedByValue)
    console.log('排序后的Map:', sortedMap)

    return { sortedByValue, sortedByKey, sortedMap }
  }

  // 2. 数据过滤和映射
  function filterAndMapData() {
    const employeeMap = new Map([
      ['emp001', { name: 'Alice', salary: 75000, department: 'IT' }],
      ['emp002', { name: 'Bob', salary: 65000, department: 'HR' }],
      ['emp003', { name: 'Charlie', salary: 85000, department: 'IT' }],
      ['emp004', { name: 'Diana', salary: 70000, department: 'Finance' }],
    ])

    // 过滤IT部门员工
    const itEmployees = [...employeeMap.entries()]
      .filter(([id, emp]) => emp.department === 'IT')
      .map(([id, emp]) => ({ id, ...emp }))

    // 获取高薪员工
    const highSalaryEmployees = [...employeeMap.entries()]
      .filter(([id, emp]) => emp.salary > 70000)
      .map(([id, emp]) => emp.name)

    // 部门统计
    const departmentStats = [...employeeMap.values()].reduce((stats, emp) => {
      const dept = emp.department
      if (!stats[dept]) {
        stats[dept] = { count: 0, totalSalary: 0 }
      }
      stats[dept].count++
      stats[dept].totalSalary += emp.salary
      return stats
    }, {})

    console.log('IT部门员工:', itEmployees)
    console.log('高薪员工:', highSalaryEmployees)
    console.log('部门统计:', departmentStats)

    return { itEmployees, highSalaryEmployees, departmentStats }
  }

  // 3. 数据导出和序列化
  function exportMapData() {
    const configMap = new Map([
      ['database.host', 'localhost'],
      ['database.port', 5432],
      ['api.timeout', 5000],
      ['cache.ttl', 3600],
    ])

    // 转为对象格式
    const configObject = Object.fromEntries(configMap)

    // 转为JSON
    const configJSON = JSON.stringify(configObject, null, 2)

    // 转为CSV格式
    const configCSV = [...configMap.entries()].map(([key, value]) => `${key},${value}`).join('\n')

    // 转为环境变量格式
    const envFormat = [...configMap.entries()]
      .map(([key, value]) => `${key.toUpperCase().replace(/\./g, '_')}=${value}`)
      .join('\n')

    console.log('对象格式:', configObject)
    console.log('JSON格式:', configJSON)
    console.log('CSV格式:', configCSV)
    console.log('环境变量格式:', envFormat)

    return { configObject, configJSON, configCSV, envFormat }
  }

  // 4. 数据分析工具
  class MapAnalyzer {
    static analyze(map) {
      const entries = [...map.entries()]
      const keys = [...map.keys()]
      const values = [...map.values()]

      return {
        size: map.size,
        keyTypes: this.analyzeTypes(keys),
        valueTypes: this.analyzeTypes(values),
        duplicateValues: this.findDuplicateValues(values),
        keyStatistics: this.getKeyStatistics(keys),
        valueStatistics: this.getValueStatistics(values),
      }
    }

    static analyzeTypes(array) {
      const types = {}
      array.forEach(item => {
        const type = typeof item
        types[type] = (types[type] || 0) + 1
      })
      return types
    }

    static findDuplicateValues(values) {
      const counts = new Map()
      values.forEach(value => {
        const key = JSON.stringify(value)
        counts.set(key, (counts.get(key) || 0) + 1)
      })

      return [...counts.entries()]
        .filter(([key, count]) => count > 1)
        .map(([key, count]) => ({ value: JSON.parse(key), count }))
    }

    static getKeyStatistics(keys) {
      const stringKeys = keys.filter(k => typeof k === 'string')
      return {
        totalKeys: keys.length,
        stringKeys: stringKeys.length,
        averageKeyLength:
          stringKeys.length > 0
            ? stringKeys.reduce((sum, key) => sum + key.length, 0) / stringKeys.length
            : 0,
      }
    }

    static getValueStatistics(values) {
      const numberValues = values.filter(v => typeof v === 'number')
      return {
        totalValues: values.length,
        numberValues: numberValues.length,
        averageNumber:
          numberValues.length > 0
            ? numberValues.reduce((sum, num) => sum + num, 0) / numberValues.length
            : 0,
        maxNumber: numberValues.length > 0 ? Math.max(...numberValues) : null,
        minNumber: numberValues.length > 0 ? Math.min(...numberValues) : null,
      }
    }
  }

  // 执行测试
  sortMapData()
  filterAndMapData()
  exportMapData()

  // 分析示例Map
  const testMap = new Map([
    ['name', 'Test'],
    ['count', 42],
    ['active', true],
    ['score', 85],
    ['category', 'A'],
  ])

  const analysis = MapAnalyzer.analyze(testMap)
  console.log('Map分析结果:', analysis)
}
```

**记忆要点总结：**

- **基本转换**：[...map] 是最简洁的转换方法，返回键值对数组
- **分别获取**：[...map.keys()] 获取键，[...map.values()] 获取值
- **数据处理**：转为数组后可以使用数组的排序、过滤、映射等方法
- **实际应用**：数据排序、过滤统计、格式转换、数据分析
- **性能考虑**：大数据量时注意内存使用，考虑流式处理

### 迭代器和生成器（4道）

# **112. [中级]** 什么是迭代器？如何自定义迭代器？

内部实现了[Symbol.iterator] 并且可以使用for...of 遍历的就时迭代器

## 深度分析与补充

**问题本质解读：** 这道题考察迭代器的概念和自定义实现，面试官想了解你是否理解JavaScript的迭代协议。

**技术错误纠正：**

1. "就时迭代器"应为"就是迭代器"

**知识点系统梳理：**

**迭代器协议：**

1. **可迭代协议** - 对象实现Symbol.iterator方法
2. **迭代器协议** - 对象实现next()方法，返回{value, done}
3. **内置可迭代对象** - Array、String、Map、Set等
4. **for...of循环** - 自动调用迭代器
5. **扩展运算符** - 也使用迭代器协议

**实战应用举例：**

```javascript
// 1. 迭代器基础概念和实现
function iteratorBasics() {
  console.log('=== 迭代器基础 ===')

  // 简单的迭代器实现
  function createNumberIterator(start, end) {
    let current = start

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false }
        } else {
          return { done: true }
        }
      },
    }
  }

  // 使用迭代器
  const iterator = createNumberIterator(1, 3)

  console.log('手动调用迭代器:')
  console.log(iterator.next()) // { value: 1, done: false }
  console.log(iterator.next()) // { value: 2, done: false }
  console.log(iterator.next()) // { value: 3, done: false }
  console.log(iterator.next()) // { done: true }

  // 可迭代对象实现
  class NumberRange {
    constructor(start, end) {
      this.start = start
      this.end = end
    }

    // 实现Symbol.iterator方法
    [Symbol.iterator]() {
      let current = this.start
      const end = this.end

      return {
        next() {
          if (current <= end) {
            return { value: current++, done: false }
          } else {
            return { done: true }
          }
        },
      }
    }
  }

  // 使用可迭代对象
  const range = new NumberRange(5, 8)

  console.log('for...of遍历:')
  for (const num of range) {
    console.log(num)
  }

  console.log('扩展运算符:', [...range])

  return { iterator, range }
}
```

```javascript
// 2. 高级迭代器应用
function advancedIteratorApplications() {
  console.log('=== 高级迭代器应用 ===')

  // 1. 无限序列迭代器
  class InfiniteSequence {
    constructor(generator) {
      this.generator = generator
    }

    [Symbol.iterator]() {
      let index = 0
      const generator = this.generator

      return {
        next() {
          return { value: generator(index++), done: false }
        },
      }
    }

    // 获取前n个元素
    take(n) {
      const result = []
      let count = 0

      for (const value of this) {
        if (count >= n) break
        result.push(value)
        count++
      }

      return result
    }

    // 跳过前n个元素
    skip(n) {
      const iterator = this[Symbol.iterator]()
      for (let i = 0; i < n; i++) {
        iterator.next()
      }
      return iterator
    }
  }

  // 2. 树结构迭代器
  class TreeNode {
    constructor(value) {
      this.value = value
      this.children = []
    }

    addChild(child) {
      this.children.push(child)
      return this
    }

    // 深度优先遍历
    *[Symbol.iterator]() {
      yield this.value
      for (const child of this.children) {
        yield* child
      }
    }

    // 广度优先遍历
    *breadthFirst() {
      const queue = [this]

      while (queue.length > 0) {
        const node = queue.shift()
        yield node.value
        queue.push(...node.children)
      }
    }

    // 层级遍历（带深度信息）
    *levelOrder() {
      const queue = [{ node: this, level: 0 }]

      while (queue.length > 0) {
        const { node, level } = queue.shift()
        yield { value: node.value, level }

        node.children.forEach(child => {
          queue.push({ node: child, level: level + 1 })
        })
      }
    }
  }

  // 3. 分页数据迭代器
  class PaginatedIterator {
    constructor(fetchFunction, pageSize = 10) {
      this.fetchFunction = fetchFunction
      this.pageSize = pageSize
    }

    async *[Symbol.asyncIterator]() {
      let page = 1
      let hasMore = true

      while (hasMore) {
        try {
          const data = await this.fetchFunction(page, this.pageSize)

          if (data.items && data.items.length > 0) {
            for (const item of data.items) {
              yield item
            }
            hasMore = data.hasMore
            page++
          } else {
            hasMore = false
          }
        } catch (error) {
          console.error('Error fetching page:', error)
          hasMore = false
        }
      }
    }
  }

  // 4. 链式迭代器
  class ChainIterator {
    constructor(...iterables) {
      this.iterables = iterables
    }

    *[Symbol.iterator]() {
      for (const iterable of this.iterables) {
        yield* iterable
      }
    }
  }

  // 5. 过滤迭代器
  class FilterIterator {
    constructor(iterable, predicate) {
      this.iterable = iterable
      this.predicate = predicate
    }

    *[Symbol.iterator]() {
      for (const item of this.iterable) {
        if (this.predicate(item)) {
          yield item
        }
      }
    }
  }

  // 测试无限序列
  const fibonacci = new InfiniteSequence(n => {
    if (n <= 1) return n
    let a = 0,
      b = 1
    for (let i = 2; i <= n; i++) {
      ;[a, b] = [b, a + b]
    }
    return b
  })

  console.log('前10个斐波那契数:', fibonacci.take(10))

  // 测试树遍历
  const root = new TreeNode('root')
  const child1 = new TreeNode('child1')
  const child2 = new TreeNode('child2')
  const grandchild = new TreeNode('grandchild')

  root.addChild(child1).addChild(child2)
  child1.addChild(grandchild)

  console.log('深度优先遍历:', [...root])
  console.log('广度优先遍历:', [...root.breadthFirst()])
  console.log('层级遍历:', [...root.levelOrder()])

  // 测试链式迭代器
  const chain = new ChainIterator([1, 2], ['a', 'b'], [true, false])
  console.log('链式迭代:', [...chain])

  // 测试过滤迭代器
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const evenNumbers = new FilterIterator(numbers, x => x % 2 === 0)
  console.log('偶数过滤:', [...evenNumbers])
}
```

**记忆要点总结：**

- **迭代器协议**：实现next()方法，返回{value, done}对象
- **可迭代协议**：实现Symbol.iterator方法，返回迭代器
- **自定义实现**：可以创建自己的迭代逻辑，如无限序列、树遍历
- **实际应用**：分页数据、树结构、链式操作、数据过滤
- **异步迭代**：使用Symbol.asyncIterator实现异步迭代器

# **113. [中级]** 生成器函数的语法和特点

- [Symbol.iterator]
- generator
- yelled next

## 深度分析与补充

**问题本质解读：** 这道题考察生成器函数的语法和特点，面试官想了解你是否掌握ES6生成器的核心概念。

**技术错误纠正：**

1. "yelled next"应为"yield next"，yield是关键字不是yelled

**知识点系统梳理：**

**生成器函数的特点：**

1. **function\*语法** - 使用function\*声明生成器函数
2. **yield关键字** - 暂停执行并返回值
3. **惰性求值** - 按需生成值，不是一次性生成所有值
4. **状态保持** - 函数执行状态在yield之间保持
5. **双向通信** - 可以通过next()传递值给生成器

**生成器的方法：**

- next()：继续执行到下一个yield
- return()：提前结束生成器
- throw()：向生成器抛出异常

**实战应用举例：**

```javascript
// 1. 生成器函数基础语法和特点
function generatorBasics() {
  console.log('=== 生成器函数基础 ===')

  // 基本生成器函数
  function* simpleGenerator() {
    console.log('生成器开始执行')
    yield 1
    console.log('第一个yield后继续')
    yield 2
    console.log('第二个yield后继续')
    yield 3
    console.log('生成器执行完毕')
    return 'done'
  }

  const gen = simpleGenerator()

  console.log('调用生成器函数返回:', typeof gen) // object
  console.log('生成器是迭代器:', typeof gen.next) // function

  console.log('第一次调用next():', gen.next())
  console.log('第二次调用next():', gen.next())
  console.log('第三次调用next():', gen.next())
  console.log('第四次调用next():', gen.next())

  // 生成器的双向通信
  function* communicatingGenerator() {
    const a = yield 'First yield'
    console.log('接收到的值:', a)

    const b = yield 'Second yield'
    console.log('接收到的值:', b)

    return a + b
  }

  const commGen = communicatingGenerator()

  console.log('双向通信示例:')
  console.log(commGen.next()) // { value: 'First yield', done: false }
  console.log(commGen.next(10)) // 传递10给第一个yield
  console.log(commGen.next(20)) // 传递20给第二个yield

  // 无限序列生成器
  function* infiniteSequence() {
    let i = 0
    while (true) {
      yield i++
    }
  }

  const infinite = infiniteSequence()
  console.log('无限序列前5个值:')
  for (let i = 0; i < 5; i++) {
    console.log(infinite.next().value)
  }
}
```

```javascript
// 2. 生成器的高级应用
function advancedGeneratorApplications() {
  console.log('=== 生成器高级应用 ===')

  // 1. 斐波那契数列生成器
  function* fibonacci() {
    let a = 0,
      b = 1
    while (true) {
      yield a
      ;[a, b] = [b, a + b]
    }
  }

  // 2. 树遍历生成器
  function* traverseTree(node) {
    yield node.value
    if (node.children) {
      for (const child of node.children) {
        yield* traverseTree(child)
      }
    }
  }

  // 3. 异步数据处理生成器
  async function* asyncDataProcessor(urls) {
    for (const url of urls) {
      try {
        // 模拟异步请求
        const data = await new Promise(resolve => {
          setTimeout(() => resolve(`Data from ${url}`), 100)
        })
        yield { url, data, status: 'success' }
      } catch (error) {
        yield { url, error: error.message, status: 'error' }
      }
    }
  }

  // 4. 分页数据生成器
  function* paginatedData(totalItems, pageSize) {
    for (let i = 0; i < totalItems; i += pageSize) {
      const page = []
      for (let j = i; j < Math.min(i + pageSize, totalItems); j++) {
        page.push(`Item ${j + 1}`)
      }
      yield {
        page: Math.floor(i / pageSize) + 1,
        items: page,
        hasMore: i + pageSize < totalItems,
      }
    }
  }

  // 5. 状态机生成器
  function* stateMachine() {
    let state = 'idle'
    let data = null

    while (true) {
      const action = yield { state, data }

      switch (state) {
        case 'idle':
          if (action?.type === 'START') {
            state = 'loading'
            data = null
          }
          break

        case 'loading':
          if (action?.type === 'SUCCESS') {
            state = 'success'
            data = action.payload
          } else if (action?.type === 'ERROR') {
            state = 'error'
            data = action.error
          }
          break

        case 'success':
        case 'error':
          if (action?.type === 'RESET') {
            state = 'idle'
            data = null
          }
          break
      }
    }
  }

  // 6. 数据流处理生成器
  function* dataStream(source) {
    for (const item of source) {
      // 数据转换
      const transformed = typeof item === 'string' ? item.toUpperCase() : item * 2

      // 数据验证
      if (transformed !== null && transformed !== undefined) {
        yield transformed
      }
    }
  }

  // 7. 组合生成器
  function* combineGenerators(...generators) {
    for (const gen of generators) {
      yield* gen
    }
  }

  // 测试斐波那契
  const fib = fibonacci()
  const fibNumbers = []
  for (let i = 0; i < 10; i++) {
    fibNumbers.push(fib.next().value)
  }
  console.log('斐波那契数列前10项:', fibNumbers)

  // 测试树遍历
  const tree = {
    value: 'root',
    children: [
      {
        value: 'child1',
        children: [{ value: 'grandchild1' }, { value: 'grandchild2' }],
      },
      { value: 'child2' },
    ],
  }

  console.log('树遍历结果:', [...traverseTree(tree)])

  // 测试分页数据
  const pages = [...paginatedData(25, 10)]
  console.log('分页数据:', pages)

  // 测试状态机
  const sm = stateMachine()
  console.log('状态机测试:')
  console.log('初始状态:', sm.next().value)
  console.log('开始加载:', sm.next({ type: 'START' }).value)
  console.log('加载成功:', sm.next({ type: 'SUCCESS', payload: 'data' }).value)
  console.log('重置状态:', sm.next({ type: 'RESET' }).value)

  // 测试数据流
  const sourceData = [1, 2, 'hello', null, 3, 'world', undefined, 4]
  const processedData = [...dataStream(sourceData)]
  console.log('数据流处理:', processedData)

  // 测试组合生成器
  function* gen1() {
    yield 1
    yield 2
  }
  function* gen2() {
    yield 'a'
    yield 'b'
  }

  const combined = [...combineGenerators(gen1(), gen2())]
  console.log('组合生成器:', combined)

  // 异步生成器测试（需要在async函数中调用）
  return { asyncDataProcessor }
}
```

**记忆要点总结：**

- **语法特点**：function\*声明，yield关键字暂停执行
- **惰性求值**：按需生成值，节省内存和计算资源
- **状态保持**：函数执行状态在yield之间保持
- **双向通信**：通过next()参数向生成器传递值
- **实际应用**：无限序列、树遍历、异步处理、状态机、数据流

# **114. [高级]** 生成器的实际应用场景有哪些？

## 深度分析与补充

**问题本质解读：** 这道题考察生成器在实际开发中的应用场景，面试官想了解你是否理解生成器的实用价值和最佳实践。

**知识点系统梳理：**

**生成器的主要应用场景：**

1. **惰性求值** - 按需生成大量数据，节省内存
2. **异步流控制** - 简化异步操作的流程控制
3. **状态机实现** - 管理复杂的状态转换
4. **数据流处理** - 处理连续的数据流
5. **协程模拟** - 实现协作式多任务

**实战应用举例：**

```javascript
// 1. 数据分页和懒加载
function* paginatedDataLoader(apiEndpoint, pageSize = 20) {
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const response = yield fetch(`${apiEndpoint}?page=${page}&size=${pageSize}`)
      const data = yield response.json()

      if (data.items && data.items.length > 0) {
        yield* data.items // 逐个yield每个item
        hasMore = data.hasMore
        page++
      } else {
        hasMore = false
      }
    } catch (error) {
      console.error('Failed to load page:', error)
      hasMore = false
    }
  }
}

// 2. 异步任务队列处理
function* taskProcessor(tasks) {
  for (const task of tasks) {
    try {
      console.log(`Processing task: ${task.id}`)
      const result = yield task.execute()

      if (result.success) {
        yield { taskId: task.id, status: 'completed', result: result.data }
      } else {
        yield { taskId: task.id, status: 'failed', error: result.error }
      }
    } catch (error) {
      yield { taskId: task.id, status: 'error', error: error.message }
    }
  }
}
```

```javascript
// 3. 实时数据流处理
function* dataStreamProcessor(dataSource) {
  let buffer = []
  const batchSize = 10

  for (const data of dataSource) {
    // 数据预处理
    const processed = {
      ...data,
      timestamp: Date.now(),
      processed: true,
    }

    buffer.push(processed)

    // 批量处理
    if (buffer.length >= batchSize) {
      yield buffer.splice(0, batchSize)
    }
  }

  // 处理剩余数据
  if (buffer.length > 0) {
    yield buffer
  }
}

// 4. 状态机实现
function* stateMachine(initialState = 'idle') {
  let currentState = initialState
  let context = {}

  while (true) {
    const action = yield { state: currentState, context }

    switch (currentState) {
      case 'idle':
        if (action.type === 'START') {
          currentState = 'loading'
          context = { startTime: Date.now() }
        }
        break

      case 'loading':
        if (action.type === 'SUCCESS') {
          currentState = 'success'
          context.data = action.payload
          context.endTime = Date.now()
        } else if (action.type === 'ERROR') {
          currentState = 'error'
          context.error = action.error
        }
        break

      case 'success':
      case 'error':
        if (action.type === 'RESET') {
          currentState = 'idle'
          context = {}
        }
        break
    }
  }
}
```

**记忆要点总结：**

- **惰性求值**：处理大数据集时按需生成，节省内存
- **异步控制**：简化复杂的异步操作流程
- **状态管理**：实现清晰的状态机逻辑
- **数据流处理**：处理连续的数据流和批量操作
- **性能优化**：避免一次性加载大量数据造成的性能问题

# **115. [高级]** 如何使用生成器实现无限序列？

## 深度分析与补充

**问题本质解读：** 这道题考察使用生成器实现无限序列的技巧，面试官想了解你是否掌握生成器的惰性求值特性。

**知识点系统梳理：**

**无限序列的特点：**

1. **惰性生成** - 只在需要时计算下一个值
2. **内存效率** - 不存储所有值，只保存当前状态
3. **可组合性** - 可以与其他序列组合
4. **可控制性** - 可以随时停止或跳过
5. **数学序列** - 实现各种数学序列

**实战应用举例：**

```javascript
// 1. 基础无限序列实现
function* infiniteCounter(start = 0, step = 1) {
  let current = start
  while (true) {
    yield current
    current += step
  }
}

// 2. 数学序列生成器
function* fibonacciSequence() {
  let a = 0,
    b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

function* primeNumbers() {
  const primes = []
  let candidate = 2

  while (true) {
    let isPrime = true
    for (const prime of primes) {
      if (prime * prime > candidate) break
      if (candidate % prime === 0) {
        isPrime = false
        break
      }
    }

    if (isPrime) {
      primes.push(candidate)
      yield candidate
    }
    candidate++
  }
}
```

```javascript
// 3. 高级无限序列工具
class InfiniteSequence {
  constructor(generator) {
    this.generator = generator
  }

  static from(generator) {
    return new InfiniteSequence(generator)
  }

  take(n) {
    const result = []
    const iterator = this.generator()

    for (let i = 0; i < n; i++) {
      const { value, done } = iterator.next()
      if (done) break
      result.push(value)
    }

    return result
  }

  skip(n) {
    const iterator = this.generator()
    for (let i = 0; i < n; i++) {
      iterator.next()
    }
    return new InfiniteSequence(() => iterator)
  }

  filter(predicate) {
    const originalGenerator = this.generator
    return new InfiniteSequence(function* () {
      for (const value of originalGenerator()) {
        if (predicate(value)) {
          yield value
        }
      }
    })
  }

  map(transform) {
    const originalGenerator = this.generator
    return new InfiniteSequence(function* () {
      for (const value of originalGenerator()) {
        yield transform(value)
      }
    })
  }
}

// 使用示例
const fibonacci = InfiniteSequence.from(fibonacciSequence)
const evenFibs = fibonacci.filter(n => n % 2 === 0)
const squaredEvenFibs = evenFibs.map(n => n * n)

console.log('前10个偶数斐波那契数的平方:', squaredEvenFibs.take(10))
```

**记忆要点总结：**

- **while(true)循环**：创建真正的无限序列
- **惰性求值**：只在调用next()时计算下一个值
- **状态保持**：生成器自动保存计算状态
- **组合操作**：可以对无限序列进行过滤、映射等操作
- **实际应用**：数学序列、数据流、ID生成器等场景
