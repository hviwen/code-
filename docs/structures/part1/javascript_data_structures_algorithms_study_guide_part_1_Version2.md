');
const greetWithHi = createGreeter('Hi');

console.log(greetWithHello('Alice')); // "Hello, Alice!"
console.log(greetWithHi('Bob')); // "Hi, Bob!"

// 即使 createGreeter 函数已执行完毕，
// 返回的函数仍然可以访问 greeting 变量
```

闭包的常见用途：
- 数据封装和信息隐藏（模块模式）
- 创建函数工厂
- 实现回调和事件处理
- 实现柯里化（Currying）和函数组合
- 在异步编程中保存状态

**问题3：let、const 和 var 的作用域区别是什么？**

答：let、const 和 var 在 JavaScript 中的作用域行为有显著差异：

**var 特性**：
- 函数作用域：var 声明的变量只在函数内部可见，或者在全局作用域可见
- 变量提升：声明会被提升到作用域顶部，但初始值不会
- 可重复声明：同一作用域内可重复声明同名变量
- 没有块级作用域：在 if、for 等块中声明的变量在块外仍可访问

**let 特性**：
- 块级作用域：变量只在声明它的块 `{}` 内可见
- 暂时性死区：在声明前访问变量会抛出 ReferenceError
- 不可重复声明：同一作用域内不能重复声明同名变量
- 循环中的特殊绑定：在循环中，每次迭代都会创建新的绑定

**const 特性**：
- 与 let 相同的作用域规则（块级作用域）
- 必须在声明时初始化
- 不允许重新赋值（但对象和数组的内容可以修改）
- 同样有暂时性死区

代码对比：
```javascript
// var 的函数作用域
function varExample() {
  var x = 1;
  if (true) {
    var x = 2;  // 同一个 x
    console.log(x);  // 2
  }
  console.log(x);  // 2 (受内部块的修改影响)
}

// let 的块级作用域
function letExample() {
  let y = 1;
  if (true) {
    let y = 2;  // 不同的 y
    console.log(y);  // 2
  }
  console.log(y);  // 1 (不受内部块影响)
}

// 循环中的 var
function varLoop() {
  var funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(function() { console.log(i); });
  }
  funcs.forEach(func => func());  // 输出: 3, 3, 3
}

// 循环中的 let
function letLoop() {
  let funcs = [];
  for (let i = 0; i < 3; i++) {
    funcs.push(function() { console.log(i); });
  }
  funcs.forEach(func => func());  // 输出: 0, 1, 2
}
```

**问题4：解释 JavaScript 中的作用域链（Scope Chain）。**

答：作用域链是 JavaScript 查找变量时遵循的路径。当在代码中引用变量时，JavaScript 引擎会按照以下顺序查找变量：

1. 首先在当前作用域中查找
2. 如果未找到，则在外层作用域中查找
3. 依次向外查找，直到全局作用域
4. 如果在全局作用域中也未找到，则抛出 ReferenceError

作用域链的关键点：

- 链是由代码的词法结构确定的（即写代码时的嵌套结构）
- 每个函数在创建时保存其词法环境引用
- 内部作用域可以访问外部作用域的变量，但反之不行
- 作用域链的查找过程是单向的，从内到外

例子：
```javascript
const global = 'I am global';

function outer() {
  const outerVar = 'I am from outer';
  
  function middle() {
    const middleVar = 'I am from middle';
    
    function inner() {
      const innerVar = 'I am from inner';
      
      // 这里可以访问所有变量
      console.log(innerVar); // 从当前作用域
      console.log(middleVar); // 从 middle 作用域
      console.log(outerVar); // 从 outer 作用域
      console.log(global); // 从全局作用域
    }
    
    inner();
    // 这里无法访问 innerVar
  }
  
  middle();
  // 这里无法访问 middleVar 和 innerVar
}

outer();
// 这里只能访问 global
```

闭包和作用域链：
- 闭包记住的正是它的作用域链
- 即使外部函数执行完毕，内部函数仍持有对整个作用域链的引用
- 这使得闭包可以访问创建时环境中的变量

**问题5：解释 "this" 关键字在不同作用域中的行为。**

答：在 JavaScript 中，`this` 关键字的值取决于函数的调用方式，而不是函数的声明位置。这与词法作用域的规则不同，因此经常导致混淆。

`this` 的不同绑定规则：

1. 默认绑定：
   - 在非严格模式下，独立函数调用中 `this` 指向全局对象（浏览器中的 `window`）
   - 在严格模式下，独立函数调用中 `this` 为 `undefined`

2. 隐式绑定：
   - 当函数作为对象的方法调用时，`this` 绑定到该对象
   - 只有最后一层调用会影响 `this` 的值

3. 显式绑定：
   - 使用 `call`、`apply` 或 `bind` 方法显式设置 `this` 的值
   - `call` 和 `apply` 立即调用函数，`bind` 返回新函数

4. 构造函数绑定：
   - 使用 `new` 关键字调用函数时，`this` 绑定到新创建的对象

5. 箭头函数：
   - 箭头函数没有自己的 `this`，继承外围作用域的 `this` 值
   - 不受上述规则影响，不能被 `call`、`apply` 或 `bind` 改变

示例代码：
```javascript
// 默认绑定
function showThis() {
  console.log(this);
}
showThis(); // window (非严格模式) 或 undefined (严格模式)

// 隐式绑定
const obj = {
  name: 'Example',
  showThis() {
    console.log(this.name);
  }
};
obj.showThis(); // 'Example'

// 丢失隐式绑定
const unboundFunc = obj.showThis;
unboundFunc(); // undefined (this 是 window 或 undefined)

// 显式绑定
const anotherObj = { name: 'Another' };
obj.showThis.call(anotherObj); // 'Another'

// bind 方法
const boundFunc = obj.showThis.bind(anotherObj);
boundFunc(); // 'Another' (即使是独立调用)

// 构造函数绑定
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // 'John'

// 箭头函数
const arrowObj = {
  name: 'Arrow',
  showThis: () => {
    console.log(this); // 不是 arrowObj
  },
  regularFunc() {
    // 这里的 this 是 arrowObj
    
    setTimeout(() => {
      // 箭头函数继承外部 this
      console.log(this.name); // 'Arrow'
    }, 100);
    
    setTimeout(function() {
      // 普通函数有自己的 this
      console.log(this.name); // undefined (this 是 window)
    }, 100);
  }
};
```

使用箭头函数解决 `this` 问题：
```javascript
// 传统写法
function Traditional() {
  this.value = 42;
  const self = this; // 保存 this 引用
  
  setTimeout(function() {
    console.log(self.value); // 42
  }, 1000);
}

// 箭头函数写法
function Modern() {
  this.value = 42;
  
  setTimeout(() => {
    console.log(this.value); // 42
  }, 1000);
}
```

### 使用场景选择指南

**何时使用 var、let 和 const**：

**var**：
- 几乎没有理由使用 var，除非是为了兼容旧环境
- 可能的情况：需要在整个函数内共享变量，且需要变量提升行为

**let**：
- 声明会变化的变量
- 循环计数器（如 for 循环中的 i）
- 临时变量
- 需要重新赋值的变量

**const**：
- 默认选择，除非有特定理由使用 let
- 函数声明（使用函数表达式时）
- 不变的配置值和常量
- 对象和数组引用（即使内容可能变化）

**作用域设计策略**：

**全局作用域**：
- 尽量减少全局变量使用
- 适用于应用级配置和常量
- 考虑使用命名空间模式或模块化

**函数作用域**：
- 将变量限制在函数内，减少副作用
- 使用闭包封装私有状态
- 考虑函数参数默认值代替内部变量

**块级作用域**：
- 限制变量生命周期，提高内存效率
- 避免临时变量污染外部作用域
- 特别适用于循环和条件语句

**优缺点对比**：

块级作用域（let/const）优点：
- 更精确的变量生命周期控制
- 减少意外变量提升导致的错误
- 通过暂时性死区防止使用未初始化的变量
- 在循环中创建独立绑定，解决闭包常见陷阱

函数作用域（var）优点：
- 在整个函数中访问变量
- 变量提升行为有时有用

块级作用域缺点：
- 旧浏览器兼容性问题
- 代码可能需要更多的变量声明

函数作用域缺点：
- 变量提升行为容易引起混淆
- 缺乏块级作用域可能导致意外错误
- 临时变量的生命周期过长

**闭包使用场景**：
- 数据封装和私有变量实现
- 事件处理器和回调函数
- 柯里化和函数工厂
- 模块化模式
- 记忆化（Memoization）优化

**模块化与作用域**：
- ES 模块（ESM）提供文件级作用域
- CommonJS 模块（Node.js）也提供文件级隔离
- 两者都比全局作用域和 IIFE 更清晰和可维护

### 记忆要点总结

- **作用域基础**：
  - 作用域是变量的可访问范围
  - JavaScript 有全局作用域、函数作用域和块级作用域
  - 词法作用域（静态作用域）由代码结构决定，不是运行时决定

- **变量声明**：
  - 使用 `const` 作为默认选择
  - 只有当变量需要重新赋值时，才使用 `let`
  - 避免使用 `var`，除非有兼容性需求
  - 声明变量时始终使用关键字，避免意外创建全局变量

- **作用域链**：
  - 变量查找从当前作用域开始，逐级向外查找
  - 内部作用域可以访问外部，外部不能访问内部
  - 查找顺序：当前作用域 → 外部作用域 → ... → 全局作用域

- **闭包**：
  - 闭包是函数及其引用的外部变量的组合
  - 闭包可以访问创建它的函数作用域中的变量
  - 即使外部函数执行完毕，这些变量也不会被垃圾回收
  - 常用于数据封装、回调函数和函数工厂

- **this 关键字**：
  - `this` 是基于函数如何调用决定的，而非函数在哪里定义
  - 箭头函数继承外围作用域的 `this` 值
  - 可以使用 `call`、`apply` 和 `bind` 显式设置 `this` 值
  - 类方法中的 `this` 指向实例对象（除非方法被单独调用）