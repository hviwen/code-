# 093. [高级] 如何在类中定义 getter 和 setter？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

getter/setter 本质是拦截属性读写操作的访问器（accessor），定义在 class 原型上，不是定义在实例上。面试问这个是在考察你是否理解访问器的工作原理、与普通属性的差异、以及如何避免常见陷阱（如递归、冲突）。

一句话答法：用 `get` 和 `set` 关键字在 class 中定义访问器，通过不同内部存储名（如 `_prop`）避免递归；getter 可计算派生属性，setter 可做验证和副作用。

## 问题意图

1. 是否能在 class 中正确写出 getter/setter 语法（`get prop()` / `set prop(v)`）。
2. 是否理解 `this.prop = v` 在 setter 中会导致无限递归，以及如何用 `_prop` 避免。
3. 是否知道 getter/setter 的实际用途：数据验证、计算属性、只读属性、响应式连接。
4. 是否了解 getter/setter 与 `Object.defineProperty` 定义访问器的关系。

## 考察范围

- `get` / `set` 语法在 class 中的定义方式。
- setter 中 `this._prop = value` 与 `this.prop = value` 的区别——前者赋值给存储属性，后者触发 setter 递归。
- getter 实现只读属性（有 get 无 set）。
- getter 实现计算属性（如 `fahrenheit` 从 `_celsius` 计算）。
- setter 中做数据验证和类型检查。
- getter/setter 在父类定义、子类继承时的行为。
- 访问器与普通属性的优先级：访问器先于同名字段。
- getter/setter 与 `Object.defineProperty` 的等价关系。

## 技术错误纠正

- 原始代码中 `set count(value) { this.count = value }` 会导致无限递归——setter 内部不能直接 `this.prop = v`（同名时），必须用存储属性 `_count`。
- class 中 getter/setter 定义在原型上，而 `constructor` 中的 `this.prop = v` 定义在实例上，有字段声明时字段会覆盖原型访问器。

## 知识点系统梳理

### 基本语法

```js
class Product {
  constructor(price) {
    this._price = price // 存储属性
  }

  // Getter
  get price() {
    return this._price
  }

  // Setter（带验证）
  set price(val) {
    if (val < 0) throw new Error('price cannot be negative')
    this._price = val
  }

  // 只读属性（有 get 无 set）
  get taxIncluded() {
    return this._price * 1.1
  }

  // 计算属性
  get displayPrice() {
    return `¥${this._price.toFixed(2)}`
  }
}
```

### 不要踩递归陷阱

```js
// ❌ 错误：setter 内 this.price = val → 又调自己 → 无限递归
class Bad {
  set price(val) { this.price = val }
}

// ✅ 正确：用 _price 做存储
class Good {
  set price(val) { this._price = val }
  get price() { return this._price }
}
```

### getter/setter 在原型上的位置

```js
class User {
  get name() { return this._name }
  set name(v) { this._name = v }
}

// getter/setter 定义在 User.prototype 上
Object.getOwnPropertyDescriptor(User.prototype, 'name')
// { get: [Function], set: [Function], enumerable: false, configurable: true }
```

### 使用 `Object.defineProperty` 的等价写法

```js
function User(name) {
  this._name = name
}
Object.defineProperty(User.prototype, 'name', {
  get() { return this._name },
  set(v) { this._name = v },
})
```

### 访问器 vs 数据属性冲突

class 中同名的 getter 和数据属性（`constructor` 中赋值）会冲突。字段声明会覆盖访问器：

```js
class Demo {
  get count() { return this._count || 0 }
  // 字段声明优先于访问器
  count = 10 // 这里 count 变成数据属性，覆盖 getter
}
// 如果同时需要：用不同属性名
```

## 实战应用举例

### 示例 1：温度转换（计算属性）

```js
class Temperature {
  constructor(celsius = 0) {
    this._celsius = celsius
  }

  get celsius() { return this._celsius }
  set celsius(v) {
    if (v < -273.15) throw new Error('below absolute zero')
    this._celsius = v
  }

  // 计算属性：从 _celsius 推导
  get fahrenheit() { return (this._celsius * 9) / 5 + 32 }
  get kelvin() { return this._celsius + 273.15 }

  // 只读描述
  get description() {
    if (this._celsius < 0) return 'Freezing'
    if (this._celsius < 15) return 'Cold'
    if (this._celsius < 25) return 'Warm'
    return 'Hot'
  }
}
```

### 示例 2：用户输入验证

```js
class User {
  constructor(name) { this._name = name }

  get name() { return this._name }
  set name(v) {
    if (!v || v.trim().length < 2) throw new Error('name too short')
    this._name = v.trim()
  }

  get age() { return this._age }
  set age(v) {
    if (v < 0 || v > 150) throw new Error('invalid age')
    this._age = v
  }
}
```

## 使用场景说明和对比

| 场景 | 推荐 | 替代方案 |
| --- | --- | --- |
| 数据验证（年龄、邮箱） | setter | 验证函数调用 |
| 计算/派生属性（含税价） | getter | 方法 `calcPrice()` |
| 只读属性 | getter（仅 get） | 无 setter 即可 |
| 响应式变更通知 | setter + 回调 | Proxy 代理 |
| 日志/埋点 | setter 内记录 | 装饰器 / AOP |

getter/setter vs 普通方法的选择：getter 适合"像属性一样读取"的场景（计算轻量、无副作用、每次调用返回一致结果）；需要传参或异步时用方法。

## 易错点提示

- 最大陷阱：setter 内写 `this.prop = v`（同名）导致无限递归，用 `_prop` 做存储。
- class 中 getter/setter 定义在原型上，不在实例上。
- 字段声明（`count = 0`）优先级高于原型上的同名访问器——冲突时字段胜出。
- getter 应无副作用，setter 内不要做重操作（如 HTTP 请求）。
- getter/setter 不支持 async，异步计算必须用方法。

## 记忆要点总结

- getter/setter = 属性读写的拦截器，定义在原型上。
- 递归陷阱：setter 内用 `_prop` 存值。
- 三种用途：验证、计算属性、只读属性。
- 与 `Object.defineProperty` 等价。

## 延伸问题

1. getter/setter 和 `Proxy` 在拦截属性操作上有什么不同？
2. 为什么字段声明（`count = 0`）会覆盖原型上的 getter？
3. getter 中可以做异步操作吗？如果不能，怎么替代？

## 可能类似的问题及简要参考答案

**Q：getter/setter 定义在实例上还是原型上？**
A：用 `get/set` 语法定义在原型上，用 `Object.defineProperty` 在构造函数里定义在实例上。

**Q：setter 中 `this.prop = v` 为什么会导致递归？**
A：因为 setter 内部赋值会再次触发同一个 setter，形成无限递归。用 `_prop` 做存储。

**Q：getter 和普通方法有什么区别？**
A：getter 像属性一样访问（无括号），适合轻量计算；方法可传参、可异步、适合复杂操作。

## 辅助记忆总结

记成一句话：getter/setter 是属性操作的"门卫"——setter 验证输入，getter 计算输出，存储用 `_prop` 防递归。
