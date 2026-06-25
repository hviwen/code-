# 019. [初级]** 什么是闭包？请举一个简单的例子

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript最重要的概念之一，面试官想了解你是否真正理解闭包的形成机制、作用和实际应用。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：函数与作用域（15道），包括闭包的定义与形成条件、词法作用域与闭包的关系、闭包的内存回收机制与内存泄漏风险、闭包的实际应用（工厂函数、模块模式、柯里化），以及 React Hooks 中闭包的陷阱。

## 技术错误纠正

1. "函数指可以访问函数外部的数据"表述不准确，应该是"函数能够访问其词法作用域外的变量"
2. 代码示例有问题：`a++`是后置递增，返回的是递增前的值，且每次都重新声明`a`
3. 缺少闭包形成的核心条件说明

## 知识点系统梳理

闭包是一个函数指~~可以访问函数外部的数据，并持有该数据~~能够访问其词法作用域外的变量

```javascript
function fun(){
  let count = 0
  return function(){
    return ++count
  }
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

### 问题本质解读 这道题考察JavaScript最重要的概念之一，面试官想了解你是否真正理解闭包的形成机制、作用和实际应用。

### 技术错误纠正
1. "函数指可以访问函数外部的数据"表述不准确，应该是"函数能够访问其词法作用域外的变量"
2. 代码示例有问题：`a++`是后置递增，返回的是递增前的值，且每次都重新声明`a`
3. 缺少闭包形成的核心条件说明

### 知识点系统梳理

**闭包的定义：**
- 闭包是函数和其词法环境的组合
- 内部函数可以访问外部函数的变量
- 即使外部函数已经执行完毕，内部函数仍能访问这些变量

**闭包形成的条件：**
1. 函数嵌套（内部函数引用外部函数的变量）
2. 内部函数被外部引用（通常是返回或赋值给外部变量）
3. 外部函数执行完毕后，内部函数仍然存在

### 实战应用举例
```javascript
// 1. 基础闭包示例
function createCounter() {
  let count = 0;

  return function() {
    return ++count; // 正确的递增方式
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 每次调用createCounter都会创建新的闭包
const counter2 = createCounter();
console.log(counter2()); // 1 - 独立的计数器

// 2. 闭包的词法作用域演示
function outerFunction(x) {
  // 外部函数的变量
  const outerVariable = x;

  function innerFunction(y) {
    // 内部函数可以访问外部函数的变量
    console.log(`Outer: ${outerVariable}, Inner: ${y}`);
    return outerVariable + y;
  }

  return innerFunction;
}

const closure = outerFunction(10);
console.log(closure(5)); // "Outer: 10, Inner: 5" 然后返回 15

// 3. 多个闭包共享同一个环境
function createMultipleCounters() {
  let count = 0;

  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

const counters = createMultipleCounters();
console.log(counters.increment()); // 1
console.log(counters.increment()); // 2
console.log(counters.decrement()); // 1
console.log(counters.getCount()); // 1

// 4. 闭包在循环中的经典问题
// ❌ 错误示例
function createFunctionsWrong() {
  const functions = [];

  for (var i = 0; i < 3; i++) {
    functions.push(function() {
      console.log(i); // 所有函数都会打印3
    });
  }

  return functions;
}

const wrongFunctions = createFunctionsWrong();
wrongFunctions[0](); // 3
wrongFunctions[1](); // 3
wrongFunctions[2](); // 3

// ✅ 正确示例1：使用IIFE
function createFunctionsCorrect1() {
  const functions = [];

  for (var i = 0; i < 3; i++) {
    functions.push((function(index) {
      return function() {
        console.log(index);
      };
    })(i));
  }

  return functions;
}

// ✅ 正确示例2：使用let
function createFunctionsCorrect2() {
  const functions = [];

  for (let i = 0; i < 3; i++) {
    functions.push(function() {
      console.log(i);
    });
  }

  return functions;
}

// 5. 实际应用：模块模式
const Calculator = (function() {
  // 私有变量
  let result = 0;
  let history = [];

  // 私有方法
  function addToHistory(operation, value) {
    history.push(`${operation}: ${value}`);
  }

  // 公共接口
  return {
    add(value) {
      result += value;
      addToHistory('add', value);
      return this;
    },

    subtract(value) {
      result -= value;
      addToHistory('subtract', value);
      return this;
    },

    multiply(value) {
      result *= value;
      addToHistory('multiply', value);
      return this;
    },

    getResult() {
      return result;
    },

    getHistory() {
      return [...history]; // 返回副本，保护内部数据
    },

    reset() {
      result = 0;
      history = [];
      return this;
    }
  };
})();

// 使用模块
Calculator.add(10).multiply(2).subtract(5);
console.log(Calculator.getResult()); // 15
console.log(Calculator.getHistory()); // ['add: 10', 'multiply: 2', 'subtract: 5']

// 6. 函数工厂模式
function createValidator(rules) {
  return function(value) {
    for (const rule of rules) {
      if (!rule.test(value)) {
        return {
          valid: false,
          message: rule.message
        };
      }
    }
    return { valid: true };
  };
}

const emailValidator = createValidator([
  {
    test: (value) => value && value.length > 0,
    message: 'Email is required'
  },
  {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Invalid email format'
  }
]);

console.log(emailValidator('test@example.com')); // { valid: true }
console.log(emailValidator('invalid')); // { valid: false, message: 'Invalid email format' }

// 7. 防抖和节流函数
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let inThrottle;

  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 100);

// 8. 缓存函数（记忆化）
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Cache hit');
      return cache.get(key);
    }

    console.log('Computing result');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFunction = memoize((n) => {
  // 模拟耗时计算
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += i;
  }
  return result;
});

console.log(expensiveFunction(100)); // Computing result
console.log(expensiveFunction(100)); // Cache hit
```

**闭包的优缺点：**

**优点：**
- 数据封装和私有性
- 创建专用函数和模块
- 保持状态
- 函数式编程支持

**缺点：**
- 内存占用（变量不会被垃圾回收）
- 可能导致内存泄漏
- 性能开销

### 记忆要点总结
- **定义**：函数 + 词法环境的组合，内部函数访问外部变量
- **形成条件**：函数嵌套 + 内部函数被外部引用 + 外部函数执行完毕
- **实际应用**：模块模式、工厂函数、防抖节流、缓存函数
- **注意事项**：避免内存泄漏，注意循环中的闭包陷阱
- **最佳实践**：合理使用，及时清理不需要的引用

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**闭包在前端中的典型使用场景：**

| 场景 | 说明 | 示例 |
|------|------|------|
| 数据私有化 | 函数内部状态不被外部直接修改 | composable 中的 `let count = 0` |
| 工厂函数 | 批量生成带有独立状态的函数 | `useDebounce(fn, delay)` 返回防抖函数 |
| 模块模式 | 暴露最小化接口，隐藏实现细节 | 工具库的 `export` 封装 |
| 事件绑定的回调 | 捕获循环中的变量值 | for 循环中使用 let 或闭包绑定点击回调 |
| React Hooks | 闭包陷阱（stale closure） | `useEffect` 中回调访问旧的 state 值 |

**何时避免闭包：**
- 大数组/长生命周期中闭包引用外层大对象会导致内存泄漏。
- 不需要状态隔离的纯函数场景不需要闭包。

## 易错点提示

1. 闭包不是“函数里再写函数”本身，而是函数保留并使用了外层词法环境。
2. `for (var i...)` 绑定事件会共享同一个 `i`，用 `let` 或立即执行函数能隔离每轮变量。
3. 闭包引用大对象、DOM 节点、定时器回调时，如果生命周期过长，可能阻止垃圾回收。
4. React/Vue 回调里闭包拿到旧状态时，通常要检查依赖数组、响应式引用或最新值读取方式。
5. 闭包适合封装状态，但不该替代清晰的数据流；共享状态复杂时应交给模块、store 或类实例。

## 记忆要点总结

- 闭包 = 函数 + 它能访问的词法环境。
- 常见用途：私有变量、计数器、防抖节流、缓存、工厂函数。
- 主要风险：状态过期、循环变量共享、长生命周期引用导致内存占用。
- 面试回答要同时说“为什么能访问”和“什么时候该清理”。

## 延伸问题

1. 闭包和作用域链是什么关系？
2. 如何解释 `for` 循环中 `var` 和 `let` 捕获变量的差异？
3. 防抖、节流为什么通常会用到闭包？
4. React Hook 中 stale closure 是什么，如何避免？

## 可能类似的问题及简要参考答案

**Q：闭包会不会造成内存泄漏？**  
A：闭包本身不会必然泄漏，但它会延长被引用变量的生命周期；如果闭包长期持有不再需要的大对象或 DOM 节点，就可能造成内存无法释放。

**Q：为什么 `let` 能解决循环闭包问题？**  
A：`let` 在每轮循环创建新的块级绑定，回调捕获的是当前轮次的独立变量。

## 辅助记忆总结

一句话记：闭包让函数“带着出生地的变量一起走”。
