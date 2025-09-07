# JavaScript 数据结构与算法学习指南（第一章）

## 目录

- [JavaScript 基础](#javascript-基础)
  - [知识点介绍](#知识点介绍)
  - [知识点系统梳理](#知识点系统梳理)
  - [使用示例](#使用示例)
  - [实战应用举例](#实战应用举例)
  - [常见面试问题](#常见面试问题)
  - [使用场景选择指南](#使用场景选择指南)
  - [记忆要点总结](#记忆要点总结)
- [JavaScript 数据类型](#javascript-数据类型)
  - [知识点介绍](#知识点介绍-1)
  - [知识点系统梳理](#知识点系统梳理-1)
  - [使用示例](#使用示例-1)
  - [实战应用举例](#实战应用举例-1)
  - [常见面试问题](#常见面试问题-1)
  - [使用场景选择指南](#使用场景选择指南-1)
  - [记忆要点总结](#记忆要点总结-1)
- [变量作用域](#变量作用域)
  - [知识点介绍](#知识点介绍-2)
  - [知识点系统梳理](#知识点系统梳理-2)
  - [使用示例](#使用示例-2)
  - [实战应用举例](#实战应用举例-2)
  - [常见面试问题](#常见面试问题-2)
  - [使用场景选择指南](#使用场景选择指南-2)
  - [记忆要点总结](#记忆要点总结-2)

## JavaScript 基础

### 知识点介绍

JavaScript 是一种高级的、解释型的编程语言，最初被设计用来为网页添加交互性。如今，它已经发展成为一种功能强大的通用编程语言，不仅可以在浏览器中运行，还可以在服务器端（Node.js）和各种应用程序中使用。JavaScript 是实现数据结构与算法的重要工具，掌握其基础对于后续学习至关重要。

### 知识点系统梳理

**在知识体系中的位置**：
- JavaScript 是前端开发的核心语言之一
- 在数据结构与算法学习中，JavaScript 是实现工具
- 是构建复杂应用的基础编程语言

**与其他概念的关联关系**：
- 与 HTML 和 CSS 协同工作，实现网页功能
- 作为实现数据结构与算法的载体
- 与 ECMAScript 标准密切相关（JavaScript 是 ECMAScript 的实现）

**核心特性和属性列表**：
- 动态类型：变量类型在运行时确定
- 基于原型的面向对象编程
- 函数是一等公民（可以作为变量传递）
- 事件驱动编程模型
- 单线程执行模型（配合事件循环）
- 支持闭包（closure）
- 支持异步编程（回调、Promise、async/await）

### 使用示例

基本语法示例：

```javascript
// 变量声明
let name = "JavaScript";
const version = "ES2021";
var legacy = "旧式声明"; // 不推荐使用

// 函数声明
function greet(name) {
  return `Hello, ${name}!`;
}

// 箭头函数
const greetArrow = (name) => `Hello, ${name}!`;

// 条件语句
if (version.includes("ES")) {
  console.log("This is ECMAScript");
} else {
  console.log("This is something else");
}

// 循环
for (let i = 0; i < 3; i++) {
  console.log(`Iteration ${i}`);
}

// 数组操作
const fruits = ["Apple", "Banana", "Cherry"];
fruits.forEach(fruit => console.log(fruit));

// 对象操作
const person = {
  name: "Alice",
  age: 25,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};
console.log(person.greet());
```

### 实战应用举例

**实例1：动态表单验证**

```javascript
/**
 * 实时表单验证
 * 应用场景：用户注册表单
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submitButton');
  
  // 验证规则
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  // 实时验证
  const validateInputs = () => {
    const isEmailValid = validateEmail(emailInput.value);
    const isPasswordValid = validatePassword(passwordInput.value);
    
    // 视觉反馈
    emailInput.className = isEmailValid ? 'valid' : 'invalid';
    passwordInput.className = isPasswordValid ? 'valid' : 'invalid';
    
    // 启用/禁用提交按钮
    submitButton.disabled = !(isEmailValid && isPasswordValid);
  };
  
  // 绑定事件
  emailInput.addEventListener('input', validateInputs);
  passwordInput.addEventListener('input', validateInputs);
  
  // 表单提交处理
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateEmail(emailInput.value) && validatePassword(passwordInput.value)) {
      console.log('Form submitted:', {
        email: emailInput.value,
        password: '********' // 实际应用中应安全处理密码
      });
      // 这里可以添加 API 调用提交数据
    }
  });
});
```

**实例2：数据过滤与排序**

```javascript
/**
 * 商品列表的过滤和排序功能
 * 应用场景：电子商务网站的商品展示
 */
class ProductList {
  constructor(products) {
    this.originalProducts = [...products]; // 保存原始数据
    this.products = [...products]; // 工作副本
  }
  
  // 按价格过滤
  filterByPriceRange(min, max) {
    this.products = this.originalProducts.filter(product => 
      product.price >= min && product.price <= max
    );
    return this;
  }
  
  // 按类别过滤
  filterByCategory(category) {
    if (category === 'all') {
      this.products = [...this.originalProducts];
    } else {
      this.products = this.originalProducts.filter(product => 
        product.category === category
      );
    }
    return this;
  }
  
  // 按不同字段排序
  sortBy(field, ascending = true) {
    const direction = ascending ? 1 : -1;
    
    this.products.sort((a, b) => {
      if (a[field] < b[field]) return -1 * direction;
      if (a[field] > b[field]) return 1 * direction;
      return 0;
    });
    
    return this;
  }
  
  // 获取处理后的产品列表
  getProducts() {
    return this.products;
  }
}

// 使用示例
const products = [
  { id: 1, name: "Laptop", price: 1200, category: "electronics" },
  { id: 2, name: "Headphones", price: 100, category: "electronics" },
  { id: 3, name: "Coffee Mug", price: 15, category: "kitchenware" },
  { id: 4, name: "Book", price: 25, category: "books" },
  { id: 5, name: "Smartphone", price: 800, category: "electronics" }
];

const productList = new ProductList(products);

// 过滤电子产品并按价格降序排列
const filteredAndSorted = productList
  .filterByCategory("electronics")
  .sortBy("price", false)
  .getProducts();

console.log(filteredAndSorted);
/* 输出:
[
  { id: 1, name: "Laptop", price: 1200, category: "electronics" },
  { id: 5, name: "Smartphone", price: 800, category: "electronics" },
  { id: 2, name: "Headphones", price: 100, category: "electronics" }
]
*/
```

### 常见面试问题

**问题1：JavaScript 中的基本数据类型有哪些？它们与引用类型有什么区别？**

答：JavaScript 中有 7 种基本数据类型：
- String（字符串）
- Number（数字）
- Boolean（布尔值）
- null（空值）
- undefined（未定义）
- Symbol（ES6 新增，表示唯一值）
- BigInt（ES2020 新增，表示任意精度整数）

引用类型主要是 Object（包括 Array, Function, Date 等）。

区别：
- 基本类型存储在栈内存中，按值访问
- 引用类型存储在堆内存中，栈内存中保存的是引用地址
- 基本类型的赋值是值的复制，引用类型的赋值是引用的复制（指向同一对象）
- 基本类型比较的是值，引用类型比较的是引用（内存地址）

**问题2：解释一下 JavaScript 中的闭包（Closure）及其应用场景。**

答：闭包是指一个函数可以访问其词法作用域外的变量，即使在其外部函数执行完毕后仍然可以访问。本质上，闭包是由函数以及声明该函数的词法环境组合而成。

主要应用场景：
- 数据封装和私有变量
- 函数工厂和柯里化（Currying）
- 模块化模式
- 事件处理和回调函数
- 防抖和节流函数的实现

例如：
```javascript
function createCounter() {
  let count = 0; // 私有变量
  return {
    increment: function() { return ++count; },
    decrement: function() { return --count; },
    getValue: function() { return count; }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getValue());  // 2
```

**问题3：请解释 JavaScript 中的事件循环（Event Loop）机制。**

答：JavaScript 是单线程的，事件循环是其实现异步编程的核心机制。

事件循环主要组件：
- 调用栈（Call Stack）：执行代码的地方
- 任务队列（Task Queue）：存放待执行的回调函数
- 微任务队列（Microtask Queue）：优先级高于任务队列
- Web API：提供异步功能的接口（如 setTimeout, fetch 等）

工作流程：
1. 执行调用栈中的代码
2. 当调用栈为空时，检查微任务队列，将其中的任务依次加入调用栈执行
3. 微任务队列清空后，从任务队列中取出一个任务执行
4. 重复步骤 2-3

这种机制使 JavaScript 能够处理 I/O 操作而不阻塞执行线程，是实现非阻塞 I/O 的关键。

**问题4：let、const 和 var 关键字有什么区别？**

答：主要区别在于作用域、提升行为和重新赋值能力：

- var：
  - 函数作用域或全局作用域
  - 存在变量提升（声明提升，但不初始化）
  - 可以重新声明和赋值
  - 在全局作用域声明会成为 window 对象的属性

- let：
  - 块级作用域
  - 存在"暂时性死区"（声明前使用会报错）
  - 不能重新声明，但可以重新赋值
  - 不会成为全局对象的属性

- const：
  - 块级作用域
  - 存在"暂时性死区"
  - 声明时必须初始化值
  - 不能重新声明或重新赋值（但对象属性可以修改）
  - 不会成为全局对象的属性

**问题5：如何在 JavaScript 中实现继承？**

答：JavaScript 中实现继承的主要方式：

1. 原型链继承：
```javascript
function Parent() { this.name = 'Parent'; }
Parent.prototype.sayHello = function() { return `Hello from ${this.name}`; };

function Child() { this.name = 'Child'; }
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

2. 构造函数继承：
```javascript
function Parent() { this.names = ['Parent']; }
function Child() {
  Parent.call(this); // 调用父构造函数
}
```

3. 组合继承：
```javascript
function Parent(name) { this.name = name; }
Parent.prototype.sayHello = function() { return `Hello, ${this.name}`; };

function Child(name, age) {
  Parent.call(this, name); // 继承属性
  this.age = age;
}
Child.prototype = Object.create(Parent.prototype); // 继承方法
Child.prototype.constructor = Child;
```

4. ES6 class 继承：
```javascript
class Parent {
  constructor(name) { this.name = name; }
  sayHello() { return `Hello, ${this.name}`; }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }
}
```

### 使用场景选择指南

**何时使用 JavaScript**：
- 网页交互开发：DOM 操作、事件处理
- 前端应用开发：单页面应用（SPA）
- 服务器端开发：使用 Node.js
- 移动应用开发：使用框架如 React Native、Ionic
- 桌面应用开发：使用 Electron
- 数据可视化：使用 D3.js 等库
- 游戏开发：使用 Canvas、WebGL

**优缺点对比**：

优点：
- 跨平台：几乎所有浏览器都支持
- 生态系统丰富：大量库和框架
- 非阻塞异步编程模型
- 灵活的类型系统
- 低门槛入门

缺点：
- 动态类型可能导致隐藏的类型错误
- 单线程模型对 CPU 密集型任务不友好
- 浏览器兼容性问题
- 代码组织需要额外设计
- 安全性问题（如 XSS）

**与替代方案的比较**：

JavaScript vs TypeScript：
- TypeScript 提供静态类型检查
- TypeScript 增加了接口、枚举等特性
- TypeScript 需要编译步骤，JavaScript 可直接运行
- TypeScript 适合大型项目，JavaScript 适合小型项目和快速原型开发

JavaScript vs Python（服务端）：
- JavaScript 适合异步 I/O 密集型应用
- Python 有更多的科学计算和数据分析库
- JavaScript 在前后端统一技术栈方面有优势
- Python 的语法更简洁，学习曲线平缓

### 记忆要点总结

- **基础语法**：
  - 使用 `let` 和 `const` 声明变量，避免 `var`
  - 函数是一等公民，可以作为参数传递
  - 支持面向对象编程和函数式编程范式

- **数据类型**：
  - 7 种基本类型：String, Number, Boolean, null, undefined, Symbol, BigInt
  - 引用类型：Object 及其派生类型（Array, Function 等）
  - 动态类型系统，运行时确定类型

- **核心机制**：
  - 事件循环处理异步操作
  - 原型链实现对象继承
  - 闭包保持对外部变量的引用

- **现代特性**：
  - 箭头函数简化函数语法和 this 绑定
  - 解构赋值快速提取对象/数组中的值
  - Promise 和 async/await 处理异步操作
  - 模块系统组织代码

- **最佳实践**：
  - 使用严格模式 (`'use strict'`)
  - 优先使用 const，其次是 let
  - 适当使用析构、展开运算符简化代码
  - 使用现代异步处理方式（Promise、async/await）

## JavaScript 数据类型

### 知识点介绍

JavaScript 中的数据类型是编程中最基础的概念之一，它定义了数据的性质以及可以对其执行的操作。JavaScript 是一种弱类型（动态类型）语言，这意味着变量的类型可以在运行时改变。理解 JavaScript 的数据类型是掌握数据结构与算法的前提条件。

### 知识点系统梳理

**在知识体系中的位置**：
- 是 JavaScript 语言的基础组成部分
- 为数据结构实现提供基础类型支持
- 是理解内存管理和值传递/引用传递的关键

**与其他概念的关联关系**：
- 与变量声明和作用域紧密相关
- 影响操作符的行为和类型转换
- 决定方法的可用性和行为
- 与内存管理模型直接相关

**核心特性和属性列表**：

1. 基本数据类型（原始类型）：
   - String：文本数据
   - Number：整数和浮点数
   - Boolean：true/false
   - null：表示空值
   - undefined：未定义的值
   - Symbol：唯一且不可变的数据类型（ES6）
   - BigInt：任意精度整数（ES2020）

2. 引用数据类型：
   - Object：对象类型，包括：
     - 普通对象（Object）
     - 数组对象（Array）
     - 函数对象（Function）
     - 日期对象（Date）
     - 正则对象（RegExp）
     - Map、Set、WeakMap、WeakSet
     - 等其他内置对象

### 使用示例

```javascript
// 基本数据类型示例
const stringValue = "Hello, World";  // 字符串
const numberValue = 42;              // 数字
const booleanValue = true;           // 布尔值
const nullValue = null;              // 空值
let undefinedValue;                  // undefined
const symbolValue = Symbol('description'); // 符号
const bigIntValue = 9007199254740991n; // BigInt

// 引用数据类型示例
const objectValue = { name: "John", age: 30 }; // 对象
const arrayValue = [1, 2, 3, 4, 5];           // 数组
const functionValue = function() { return "Hello"; }; // 函数
const dateValue = new Date();                 // 日期对象
const regexValue = /[a-z]+/;                  // 正则表达式
const mapValue = new Map();                   // Map
const setVaule = new Set();                   // Set

// 类型检查
console.log(typeof stringValue);    // 'string'
console.log(typeof numberValue);    // 'number'
console.log(typeof booleanValue);   // 'boolean'
console.log(typeof nullValue);      // 'object' (这是 JavaScript 的一个历史 bug)
console.log(typeof undefinedValue); // 'undefined'
console.log(typeof symbolValue);    // 'symbol'
console.log(typeof bigIntValue);    // 'bigint'
console.log(typeof objectValue);    // 'object'
console.log(typeof arrayValue);     // 'object'
console.log(typeof functionValue);  // 'function'
console.log(typeof dateValue);      // 'object'
console.log(typeof regexValue);     // 'object'
console.log(typeof mapValue);       // 'object'
console.log(typeof setVaule);       // 'object'

// 更精确的类型检查
console.log(Object.prototype.toString.call(arrayValue)); // '[object Array]'
console.log(Array.isArray(arrayValue)); // true
```

### 实战应用举例

**实例1：数据验证与类型转换**

```javascript
/**
 * 表单数据验证与类型转换
 * 应用场景：处理用户提交的表单数据
 */
class FormValidator {
  constructor(formData) {
    this.formData = formData;
    this.errors = [];
  }
  
  // 验证字符串字段
  validateString(field, minLength = 1, maxLength = 255) {
    const value = this.formData[field];
    
    // 类型检查
    if (typeof value !== 'string') {
      this.errors.push(`${field} must be a string`);
      return false;
    }
    
    // 长度检查
    if (value.length < minLength || value.length > maxLength) {
      this.errors.push(`${field} must be between ${minLength} and ${maxLength} characters`);
      return false;
    }
    
    return true;
  }
  
  // 验证并转换数字字段
  validateNumber(field, min = null, max = null) {
    let value = this.formData[field];
    
    // 类型转换
    if (typeof value === 'string') {
      value = Number(value);
      
      // 检查转换是否成功
      if (isNaN(value)) {
        this.errors.push(`${field} must be a valid number`);
        return false;
      }
      
      // 更新转换后的值
      this.formData[field] = value;
    } else if (typeof value !== 'number') {
      this.errors.push(`${field} must be a number`);
      return false;
    }
    
    // 范围检查
    if (min !== null && value < min) {
      this.errors.push(`${field} must be at least ${min}`);
      return false;
    }
    
    if (max !== null && value > max) {
      this.errors.push(`${field} must be at most ${max}`);
      return false;
    }
    
    return true;
  }
  
  // 验证日期字段并转换为 Date 对象
  validateDate(field) {
    const value = this.formData[field];
    
    // 检查是否已经是 Date 对象
    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        this.errors.push(`${field} is an invalid date`);
        return false;
      }
      return true;
    }
    
    // 转换字符串为日期
    if (typeof value === 'string') {
      const dateObj = new Date(value);
      
      if (isNaN(dateObj.getTime())) {
        this.errors.push(`${field} must be a valid date`);
        return false;
      }
      
      // 更新转换后的值
      this.formData[field] = dateObj;
      return true;
    }
    
    this.errors.push(`${field} must be a valid date`);
    return false;
  }
  
  // 验证并转换布尔字段
  validateBoolean(field) {
    let value = this.formData[field];
    
    // 如果是布尔类型，无需转换
    if (typeof value === 'boolean') {
      return true;
    }
    
    // 转换字符串表示的布尔值
    if (value === 'true' || value === '1' || value === 1) {
      this.formData[field] = true;
      return true;
    } else if (value === 'false' || value === '0' || value === 0) {
      this.formData[field] = false;
      return true;
    }
    
    this.errors.push(`${field} must be a boolean value`);
    return false;
  }
  
  // 获取验证错误
  getErrors() {
    return this.errors;
  }
  
  // 获取转换后的数据
  getData() {
    return this.formData;
  }
  
  // 检查是否有错误
  hasErrors() {
    return this.errors.length > 0;
  }
}

// 使用示例
const formData = {
  name: "John Doe",
  age: "25",
  email: "john@example.com",
  birthdate: "1990-01-01",
  subscribe: "true"
};

const validator = new FormValidator(formData);

validator.validateString('name', 2, 50);
validator.validateNumber('age', 18, 120);
validator.validateString('email', 5, 100);
validator.validateDate('birthdate');
validator.validateBoolean('subscribe');

if (!validator.hasErrors()) {
  console.log("Form data is valid!");
  console.log(validator.getData());
  // 输出转换后的数据：
  // {
  //   name: "John Doe",
  //   age: 25,          // 已转换为数字类型
  //   email: "john@example.com",
  //   birthdate: Date,  // 已转换为 Date 对象
  //   subscribe: true   // 已转换为布尔类型
  // }
} else {
  console.log("Form validation failed:");
  console.log(validator.getErrors());
}
```

**实例2：数据类型安全的缓存系统**

```javascript
/**
 * 类型安全的本地缓存系统
 * 应用场景：在浏览器端缓存各种类型的数据，并保持类型完整性
 */
class TypedCache {
  constructor(namespace = 'app-cache') {
    this.namespace = namespace;
  }
  
  /**
   * 存储带类型信息的值
   * @param {string} key - 缓存键
   * @param {any} value - 要缓存的值
   * @param {number} [expiry] - 过期时间（毫秒）
   */
  set(key, value, expiry = null) {
    const fullKey = `${this.namespace}:${key}`;
    
    // 确定值的类型
    let type = typeof value;
    let storedValue = value;
    
    // 特殊类型处理
    if (value === null) {
      type = 'null';
    } else if (value instanceof Date) {
      type = 'date';
      storedValue = value.toISOString();
    } else if (Array.isArray(value)) {
      type = 'array';
      storedValue = JSON.stringify(value);
    } else if (type === 'object') {
      type = 'object';
      storedValue = JSON.stringify(value);
    } else if (type === 'bigint') {
      storedValue = value.toString();
    } else if (type === 'symbol') {
      // Symbol 不能被序列化，存储其描述
      type = 'symbol';
      storedValue = value.description || '';
    }
    
    // 创建包含类型信息和过期时间的存储对象
    const data = {
      type,
      value: storedValue,
      expiry: expiry ? Date.now() + expiry : null
    };
    
    // 存入本地存储
    localStorage.setItem(fullKey, JSON.stringify(data));
  }
  
  /**
   * 获取值并恢复其原始类型
   * @param {string} key - 缓存键
   * @param {any} defaultValue - 如果键不存在或已过期，返回的默认值
   * @return {any} 恢复类型后的值
   */
  get(key, defaultValue = null) {
    const fullKey = `${this.namespace}:${key}`;
    const storedData = localStorage.getItem(fullKey);
    
    if (!storedData) {
      return defaultValue;
    }
    
    try {
      const data = JSON.parse(storedData);
      
      // 检查是否过期
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(fullKey);
        return defaultValue;
      }
      
      // 根据存储的类型信息恢复原始类型
      switch (data.type) {
        case 'string':
          return data.value;
        case 'number':
          return Number(data.value);
        case 'boolean':
          return Boolean(data.value);
        case 'null':
          return null;
        case 'undefined':
          return undefined;
        case 'date':
          return new Date(data.value);
        case 'array':
          return JSON.parse(data.value);
        case 'object':
          return JSON.parse(data.value);
        case 'bigint':
          return BigInt(data.value);
        case 'symbol':
          return Symbol(data.value);
        default:
          return data.value;
      }
    } catch (error) {
      console.error('Error retrieving cached data:', error);
      return defaultValue;
    }
  }
  
  /**
   * 移除缓存的键
   * @param {string} key - 要移除的缓存键
   */
  remove(key) {
    const fullKey = `${this.namespace}:${key}`;
    localStorage.removeItem(fullKey);
  }
  
  /**
   * 清除当前命名空间下的所有缓存
   */
  clear() {
    const keys = Object.keys(localStorage);
    const prefix = `${this.namespace}:`;
    
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
  
  /**
   * 获取所有缓存的键
   * @return {string[]} 当前命名空间下的所有键
   */
  keys() {
    const keys = Object.keys(localStorage);
    const prefix = `${this.namespace}:`;
    
    return keys
      .filter(key => key.startsWith(prefix))
      .map(key => key.slice(prefix.length));
  }
}

// 使用示例
const cache = new TypedCache('user-prefs');

// 存储不同类型的数据
cache.set('username', 'john_doe');
cache.set('age', 25);
cache.set('lastLogin', new Date());
cache.set('settings', { theme: 'dark', notifications: true });
cache.set('favorites', [1, 2, 3, 4, 5]);
cache.set('premium', true);
cache.set('sessionToken', null);
cache.set('uniqueId', Symbol('user-1234'));
cache.set('accountBalance', BigInt('9007199254740991'));

// 设置带过期时间的缓存（1小时）
cache.set('temporaryData', { status: 'pending' }, 60 * 60 * 1000);

// 获取并使用缓存的数据（类型已恢复）
const username = cache.get('username');           // string: 'john_doe'
const age = cache.get('age');                     // number: 25
const lastLogin = cache.get('lastLogin');         // Date object
const settings = cache.get('settings');           // object: { theme: 'dark', notifications: true }
const favorites = cache.get('favorites');         // array: [1, 2, 3, 4, 5]
const isPremium = cache.get('premium');           // boolean: true
const token = cache.get('sessionToken');          // null
const uniqueId = cache.get('uniqueId');           // Symbol: Symbol(user-1234)
const balance = cache.get('accountBalance');      // BigInt: 9007199254740991n

console.log('User data:', {
  username,
  age,
  lastLogin: lastLogin.toISOString(),
  settings,
  favorites,
  isPremium,
  token,
  uniqueId: uniqueId.toString(),
  balance: balance.toString()
});
```

### 常见面试问题

**问题1：JavaScript 中的基本数据类型和引用数据类型有什么区别？**

答：JavaScript 中的数据类型可分为基本类型和引用类型。

基本数据类型（原始类型）：
- 直接存储在栈内存中，占用空间小、大小固定
- 包括：String、Number、Boolean、null、undefined、Symbol、BigInt
- 赋值操作会创建一个独立的副本
- 按值比较

引用数据类型：
- 存储在堆内存中，栈内存中只存储指向堆内存的引用
- 包括：Object 及其派生类型（Array、Function、Date 等）
- 赋值操作只复制引用，而不复制对象
- 按引用比较（比较地址，而非值）

举例说明：
```javascript
// 基本类型
let a = 1;
let b = a;
b = 2;
console.log(a); // 1 (a 不受影响)

// 引用类型
let obj1 = { name: 'Alice' };
let obj2 = obj1;
obj2.name = 'Bob';
console.log(obj1.name); // 'Bob' (obj1 也被修改)
```

**问题2：请解释 JavaScript 中的类型转换机制。**

答：JavaScript 有两种类型转换：显式转换（手动）和隐式转换（自动）。

显式转换：
- 使用 String()、Number()、Boolean() 等转换函数
- 使用 parseInt()、parseFloat() 等解析函数
- 使用 .toString()、.valueOf() 等对象方法

隐式转换：
- 在操作符作用于不同类型的值时自动发生
- 在条件语句中自动将表达式转换为布尔值
- 在使用 + 运算符时，如果一个操作数是字符串，另一个会被转换为字符串
- 在使用 - * / % 等算术运算符时，操作数会被转换为数字

类型转换规则：
- 转换为字符串：String(value) 或 value.toString()
- 转换为数字：Number(value)、+value、parseInt(value) 等
- 转换为布尔值：Boolean(value) 或 !!value
  - falsy 值：false、0、''、null、undefined、NaN
  - truthy 值：其他所有值

例子：
```javascript
console.log(1 + '2');          // '12' (数字转为字符串)
console.log('3' * '4');        // 12 (字符串转为数字)
console.log(Boolean([]));      // true (空数组是 truthy)
console.log(Number('123'));    // 123
console.log(String(123));      // '123'
console.log([] + {});          // '[object Object]'
```

**问题3：在 JavaScript 中，如何安全地检测值的类型？**

答：JavaScript 中有多种检测类型的方法，但每种方法都有其局限性：

1. `typeof` 操作符：
   - 适用于检测基本类型：string、number、boolean、undefined、symbol、bigint
   - 对于 function 类型也返回 'function'
   - 但 typeof null 返回 'object'（这是一个历史 bug）
   - 对所有对象（Array、Date 等）都返回 'object'

2. `instanceof` 操作符：
   - 检测对象是否为特定构造函数的实例
   - 无法正确检测跨窗口（iframe）的对象
   - 不适用于基本类型

3. `Object.prototype.toString.call()`：
   - 最可靠的类型检测方法
   - 返回形如 '[object Type]' 的字符串
   - 能够区分所有内置类型

4. 特定类型的检测方法：
   - Array.isArray() 检测数组
   - Number.isNaN() 检测 NaN
   - Number.isFinite() 检测有限数字

安全检测类型的最佳实践：

```javascript
// 检测函数
function getType(value) {
  // 处理原始类型和 null
  if (value === null) return 'null';
  if (typeof value !== 'object') return typeof value;
  
  // 处理对象类型
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 类型检测示例
console.log(getType('hello'));       // 'string'
console.log(getType(123));           // 'number'
console.log(getType(true));          // 'boolean'
console.log(getType(undefined));     // 'undefined'
console.log(getType(null));          // 'null'
console.log(getType(Symbol('id')));  // 'symbol'
console.log(getType(BigInt(123)));   // 'bigint'
console.log(getType({}));            // 'object'
console.log(getType([]));            // 'array'
console.log(getType(() => {}));      // 'function'
console.log(getType(new Date()));    // 'date'
console.log(getType(/regex/));       // 'regexp'
console.log(getType(new Map()));     // 'map'
console.log(getType(new Set()));     // 'set'
```

**问题4：JavaScript 中的 == 和 === 操作符有什么区别？**

答：`==`（相等）和 `===`（严格相等）是 JavaScript 中两种比较操作符，主要区别在于类型转换：

`==` 相等操作符：
- 在比较前进行类型转换（隐式转换）
- 比较值是否相等
- 遵循一套复杂的转换规则

`===` 严格相等操作符：
- 不进行类型转换
- 比较值和类型是否都相等
- 更快、更可预测

比较行为示例：
```javascript
console.log(5 == '5');      // true（字符串 '5' 转换为数字 5）
console.log(5 === '5');     // false（类型不同）

console.log(0 == false);    // true（布尔值 false 转换为数字 0）
console.log(0 === false);   // false（类型不同）

console.log(null == undefined); // true（特殊规则）
console.log(null === undefined); // false（类型不同）

console.log(NaN == NaN);    // false（NaN 不等于任何值，包括它自己）
console.log(NaN === NaN);   // false（同上）

console.log({} == {});      // false（引用不同）
console.log({} === {});     // false（引用不同）
```

最佳实践：
- 优先使用 `===`（严格相等），它更可预测、更安全
- 只在明确需要类型转换的情况下使用 `==`
- 检查 null 或 undefined 时可以用 `x == null`

**问题5：解释 JavaScript 中的 Symbol 类型及其主要用例。**

答：Symbol 是 ES6 引入的一种原始数据类型，表示唯一且不可变的值。每个 Symbol 值都是唯一的，即使它们具有相同的描述。

Symbol 的主要特性：
- 唯一性：每个 Symbol 值都是唯一的
- 不可变性：Symbol 值一旦创建，不能被修改
- 可选描述：创建时可以提供描述，但仅用于调试
- 不会自动转换为字符串：需要显式调用 toString() 方法

创建 Symbol：
```javascript
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description'); // 与 sym2 不同

console.log(sym2 === sym3); // false，尽管描述相同
console.log(Symbol.for('shared') === Symbol.for('shared')); // true，使用全局 Symbol 注册表
```

主要用例：

1. 对象的唯一属性键：
```javascript
const uniqueKey = Symbol('key');
const obj = {
  [uniqueKey]: 'Hidden value'
};
console.log(obj[uniqueKey]); // 'Hidden value'
console.log(Object.keys(obj)); // [] (Symbol 键不出现在常规枚举中)
```

2. 防止属性名冲突：
```javascript
function component1(obj) {
  obj[Symbol('id')] = 12345;
}

function component2(obj) {
  obj[Symbol('id')] = 67890; // 不会覆盖 component1 的 id
}

const shared = {};
component1(shared);
component2(shared);
// 两个 ID 属性可以共存，不会冲突
```

3. 定义对象的内部行为（Well-known Symbols）：
```javascript
// 自定义迭代行为
const collection = {
  items: ['A', 'B', 'C'],
  [Symbol.iterator]: function* () {
    for (let item of this.items) {
      yield item;
    }
  }
};

for (let item of collection) {
  console.log(item); // 'A', 'B', 'C'
}
```

4. 元编程和钩子：
```javascript
class MyClass {
  // 自定义 instanceof 行为
  static [Symbol.hasInstance](instance) {
    return instance.isMyClass === true;
  }
  
  // 自定义转换为原始值的行为
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 42;
    if (hint === 'string') return 'MyClass instance';
    return true;
  }
}
```

### 使用场景选择指南

**何时使用不同的数据类型**：

**String**：
- 表示文本数据
- 存储用户输入
- 构建 HTML 或其他格式化输出
- 处理 URL、文件路径等

**Number**：
- 进行算术计算
- 存储数值数据（价格、数量、尺寸等）
- 处理索引和计数
- 注意：避免使用 Number 进行货币计算（精度问题）

**BigInt**：
- 处理超出 Number 精度范围的整数
- 处理大整数运算（如加密）
- 处理 64 位整数 ID

**Boolean**：
- 控制流程（条件语句）
- 存储标志和状态
- 表示二元选择（是/否、开/关）

**Object**：
- 存储关联数据（键值对）
- 创建复杂数据结构
- 封装相关功能和属性
- 实现面向对象编程

**Array**：
- 存储有序集合
- 队列和栈的实现
- 列表数据的迭代和处理
- 二维数组表示表格数据

**Symbol**：
- 创建唯一属性键
- 防止对象属性名冲突
- 定义对象的内部行为
- 实现元编程功能

**Map vs Object**：
- Map：
  - 键可以是任何类型
  - 保持插入顺序
  - 设计用于频繁添加/删除键值对
  - 直接提供大小属性
- Object：
  - 键只能是字符串或 Symbol
  - 有原型，可能存在键名冲突
  - 更适合静态结构

**Set vs Array**：
- Set：
  - 存储唯一值
  - 高效的查找、添加和删除操作
  - 直接提供大小属性
  - 不能通过索引访问
- Array：
  - 允许重复值
  - 保持元素顺序
  - 可通过索引访问
  - 提供更多操作方法

**优缺点对比**：

基本数据类型：
- 优点：
  - 内存效率高
  - 复制和比较速度快
  - 不可变性，提高代码可靠性
- 缺点：
  - 功能有限，不支持方法
  - 一些操作需要装箱/拆箱（自动）

引用数据类型：
- 优点：
  - 可以存储复杂数据结构
  - 支持方法和属性
  - 可扩展和可变
- 缺点：
  - 内存开销较大
  - 复制和比较操作需要特殊处理
  - 可变性可能导致意外的副作用

### 记忆要点总结

- **基本类型**：
  - JavaScript 有 7 种基本类型：String、Number、Boolean、null、undefined、Symbol、BigInt
  - 基本类型存储在栈内存中，按值传递
  - null 的 typeof 结果是 'object'（JavaScript 的历史 bug）
  - Symbol 创建唯一标识符，用于对象属性和元编程

- **引用类型**：
  - 所有非基本类型都是 Object 的子类型
  - 包括 Array、Function、Date、RegExp 等
  - 存储在堆内存中，栈中只保存引用地址
  - 按引用传递，修改会影响所有引用该对象的变量

- **类型检测**：
  - 使用 typeof 检测基本类型（除了 null）
  - 使用 instanceof 检测对象类型
  - 使用 Object.prototype.toString.call() 最可靠
  - 使用 Array.isArray() 专门检测数组

- **类型转换**：
  - == 执行隐式类型转换，=== 不执行
  - Boolean 转换中，0、''、null、undefined、NaN 转为 false
  - 数字和字符串相加会进行字符串连接
  - 使用 Number()、String()、Boolean() 进行显式转换

- **现代类型用法**：
  - 使用 Map 代替对象存储键值对
  - 使用 Set 存储唯一值集合
  - 使用 BigInt 处理大整数
  - Symbol 用于创建私有或唯一属性

## 变量作用域

### 知识点介绍

JavaScript 中的变量作用域是指变量在代码中的可访问性或可见性范围。作用域决定了变量在程序的哪些部分可以被访问和修改。理解作用域对于编写可维护的代码、避免变量命名冲突以及控制变量的生命周期至关重要。JavaScript 有几种不同类型的作用域，包括全局作用域、函数作用域和块级作用域（ES6 引入）。

### 知识点系统梳理

**在知识体系中的位置**：
- 是 JavaScript 语言的核心概念之一
- 与变量声明、闭包、执行上下文紧密相关
- 是内存管理和变量生命周期的基础
- 对实现算法和数据结构有重要影响

**与其他概念的关联关系**：
- 执行上下文：作用域与执行上下文密切相关，但不同
- 闭包：闭包是基于词法作用域和函数作用域的特性
- 变量提升：变量的声明提升受作用域规则影响
- this 关键字：与作用域不同，但常一起讨论
- 垃圾回收：作用域结束时，其中的变量通常会被回收

**核心特性和属性列表**：

1. 作用域类型：
   - 全局作用域：在整个程序中都可访问的变量
   - 函数作用域：在函数内部声明的变量只在函数内可见
   - 块级作用域：ES6 引入，由 {} 定义的代码块形成的作用域
   
2. 变量声明方式与作用域：
   - var：函数作用域，存在变量提升
   - let 和 const：块级作用域，有"暂时性死区"
   
3. 作用域链：
   - 当访问变量时，先在当前作用域查找
   - 如果未找到，则向外层作用域查找
   - 直到全局作用域为止
   
4. 词法作用域（静态作用域）：
   - 作用域由代码结构（编写时）决定，而非运行时决定
   - 函数的作用域取决于函数定义的位置，而非调用位置

### 使用示例

```javascript
// 全局作用域
const globalVar = "I'm global";

// 函数作用域
function outerFunction() {
  const outerVar = "I'm from outer";
  
  // 内部函数
  function innerFunction() {
    const innerVar = "I'm from inner";
    
    // 可以访问全部三个变量
    console.log(globalVar);  // "I'm global"
    console.log(outerVar);   // "I'm from outer"
    console.log(innerVar);   // "I'm from inner"
  }
  
  // 只能访问 globalVar 和 outerVar
  console.log(globalVar);  // "I'm global"
  console.log(outerVar);   // "I'm from outer"
  // console.log(innerVar); // ReferenceError: innerVar is not defined
  
  innerFunction();
}

// 只能访问 globalVar
console.log(globalVar);  // "I'm global"
// console.log(outerVar); // ReferenceError: outerVar is not defined

outerFunction();

// 块级作用域 (ES6)
{
  var varVariable = "I'm var";
  let letVariable = "I'm let";
  const constVariable = "I'm const";
}

console.log(varVariable);    // "I'm var" - var 不受块级作用域限制
// console.log(letVariable);   // ReferenceError: letVariable is not defined
// console.log(constVariable); // ReferenceError: constVariable is not defined

// 循环中的块级作用域
for (let i = 0; i < 3; i++) {
  // i 只在循环块内可用
}
// console.log(i); // ReferenceError: i is not defined

// 对比 var 在循环中的行为
for (var j = 0; j < 3; j++) {
  // j 在循环外仍然可用
}
console.log(j); // 3 - var 不遵循块级作用域
```

### 实战应用举例

**实例1：模块化模式实现私有变量**

```javascript
/**
 * 模块化模式实现计数器
 * 应用场景：创建具有私有状态的模块
 */
const counter = (function() {
  // 私有变量 - 外部无法直接访问
  let count = 0;
  
  // 返回公共 API，闭包保持对私有变量的访问
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getValue() {
      return count;
    },
    reset() {
      count = 0;
      return count;
    }
  };
})(); // 立即调用函数表达式 (IIFE)

// 使用公共 API
console.log(counter.getValue()); // 0
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.reset()); // 0

// 无法直接访问私有变量
// console.log(count); // ReferenceError: count is not defined
// counter.count = 10; // 不会影响内部状态
```

**实例2：基于作用域的回调函数去抖**

```javascript
/**
 * 函数去抖实现
 * 应用场景：处理频繁触发的事件（如滚动、调整窗口大小、输入）
 */
function debounce(func, delay) {
  // 闭包中保存定时器 ID
  let timerId;
  
  // 返回闭包函数
  return function(...args) {
    // 保存 this 上下文
    const context = this;
    
    // 清除之前的定时器
    clearTimeout(timerId);
    
    // 设置新的定时器
    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// 使用示例：处理搜索输入
class SearchComponent {
  constructor() {
    this.searchResults = [];
    
    // 使用去抖函数包装实际的搜索函数
    this.debouncedSearch = debounce(this.performSearch, 300);
    
    // 绑定事件处理器
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        const query = event.target.value;
        this.debouncedSearch(query);
      });
    }
  }
  
  // 执行实际搜索（假设这是一个耗时操作）
  performSearch(query) {
    console.log(`Searching for: ${query}`);
    
    // 模拟 API 调用
    // 在实际应用中，这里会是一个 API 请求
    if (query) {
      // 假设的搜索结果
      this.searchResults = [
        `Result 1 for ${query}`,
        `Result 2 for ${query}`,
        `Result 3 for ${query}`
      ];
      console.log('Search results:', this.searchResults);
    } else {
      this.searchResults = [];
      console.log('Search cleared');
    }
    
    // 更新 UI（略）
  }
}

// 创建搜索组件
const searchComponent = new SearchComponent();
```

### 常见面试问题

**问题1：请解释 JavaScript 中的变量提升（Hoisting）机制。**

答：变量提升是 JavaScript 中的一种行为，指在代码执行前，变量和函数声明会被移动到其所在作用域的顶部。

变量提升的关键点：

1. var 声明的变量：
   - 声明会被提升，但初始化不会
   - 提升后的值为 undefined
   
2. 函数声明：
   - 整个函数声明（包括函数体）都会被提升
   - 可以在声明前调用
   
3. let/const 声明的变量：
   - 技术上也会被提升，但存在"暂时性死区"
   - 在声明之前访问会引发 ReferenceError
   
4. 函数表达式：
   - 如果使用 var 声明，变量提升，但函数体不提升
   - 使用 let/const 声明则受暂时性死区限制

例子：
```javascript
// 变量提升
console.log(x); // undefined (而非 ReferenceError)
var x = 5;

// 相当于：
// var x;
// console.log(x);
// x = 5;

// 函数声明提升
sayHello(); // "Hello" - 可以正常工作
function sayHello() {
  console.log("Hello");
}

// 函数表达式不会被完全提升
// sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
  console.log("Hi");
};

// let/const 有暂时性死区
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

**问题2：解释 JavaScript 中的闭包（Closure）及其工作原理。**

答：闭包是指一个函数可以访问并记住其创建时所在的词法作用域，即使该函数在其原始作用域之外执行也是如此。简单来说，闭包使函数能够保留对其词法作用域的引用。

闭包的核心概念：
1. 函数可以访问其定义时所在的作用域中的变量
2. 即使外部函数执行完毕，内部函数仍可访问外部函数的变量
3. 这些变量会一直保存在内存中，直到没有对闭包的引用

闭包的工作原理：
- 当创建函数时，会创建一个与之相关的词法环境
- 该环境包含函数声明时可访问的所有变量
- 当函数作为值返回或传递到其他地方时，它会保留对该环境的引用
- JavaScript 的垃圾回收机制不会回收仍被闭包引用的变量

典型例子：
```javascript
function createGreeter(greeting) {
  // greeting 变量在返回的函数中形成闭包
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const greetWithHello = createGreeter('Hello