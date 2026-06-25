# 031. [初级] 如何创建一个对象？有几种方式？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

创建对象不只有 `{}`。不同方式的差异在于：原型是谁、是否需要初始化逻辑、是否要复用方法、是否需要精确控制属性。

一句话答法：普通数据用对象字面量，需要批量实例用构造函数或 class，需要指定原型用 `Object.create()`。

## 问题意图

这道题考察对象基础、构造函数、class、原型链和工厂函数的取舍。面试官不只想听“有几种”，还想知道每种方式适合什么场景。

## 考察范围

- 对象字面量 `{}`。
- `new Object()`。
- 工厂函数。
- 构造函数和 `new`。
- ES6 class。
- `Object.create()`。
- 原型、实例方法和初始化逻辑。

## 技术错误纠正

`new Object()` 可以创建对象，但业务代码一般不优先使用；对象字面量更简洁。`Object.create()` 创建对象时关注的是原型，不会执行构造函数。

## 知识点系统梳理

| 方式 | 示例 | 特点 |
| --- | --- | --- |
| 对象字面量 | `{ name: 'Ada' }` | 最常用，适合单个普通对象 |
| `new Object()` | `new Object()` | 冗余，少用 |
| 工厂函数 | `createUser(name)` | 可封装创建逻辑，不依赖 `new` |
| 构造函数 | `new User(name)` | 旧式实例化，方法放 `prototype` |
| class | `new User(name)` | 现代构造函数语法 |
| `Object.create(proto)` | `Object.create(base)` | 精确指定原型 |

## 实战应用举例

### 示例 1：工厂函数封装创建逻辑

```js
function createUser(name, role = 'viewer') {
  return {
    name,
    role,
    canEdit() {
      return role === 'admin' || role === 'editor'
    },
  }
}

const user = createUser('Ada', 'editor')
console.log(user.canEdit()) // true
```

工厂函数适合不想暴露 `new`，又需要统一初始化对象的场景。

### 示例 2：class 创建多个实例

```js
class User {
  constructor(name) {
    this.name = name
  }

  sayName() {
    return this.name
  }
}

const ada = new User('Ada')
console.log(ada.sayName()) // Ada
```

class 适合有明确实例行为和共享方法的对象模型。

## 使用场景说明和对比

| 场景 | 推荐方式 | 原因 |
| --- | --- | --- |
| 简单配置对象 | 对象字面量 | 最短最清晰 |
| 需要统一加工输入 | 工厂函数 | 可隐藏创建细节 |
| 多实例共享方法 | class | 原型方法复用 |
| 精确控制原型 | `Object.create` | 不执行构造逻辑 |
| 字典对象 | `Object.create(null)` | 避免继承属性干扰 |

## 易错点提示

- `{}` 的原型是 `Object.prototype`。
- `Object.create(null)` 没有 `hasOwnProperty`。
- 工厂函数每次可能创建新的方法函数，注意内存和性能。
- 构造函数忘记 `new` 会变成普通调用。
- class 本质仍基于原型，但语法更严格。

## 记忆要点总结

- 单个对象：字面量。
- 批量实例：class。
- 不想用 `new`：工厂函数。
- 控制原型：`Object.create`。
- 字典对象：`Object.create(null)`。

## 延伸问题

1. 工厂函数和构造函数有什么区别？
2. class 和构造函数是什么关系？
3. `Object.create(null)` 适合什么场景？
4. 方法写在实例上和原型上有什么区别？

## 可能类似的问题及简要参考答案

**Q：对象字面量和 `new Object()` 有什么区别？**  
A：结果相近，但对象字面量更简洁，业务代码通常优先使用 `{}`。

**Q：工厂函数的优点是什么？**  
A：不用 `new`，可以封装创建逻辑，返回任意结构对象。

**Q：class 创建对象时方法在哪里？**  
A：定义在 class 方法区的方法会放在构造函数的 `prototype` 上，被实例共享。

## 辅助记忆总结

记成一句话：创建对象先问“简单数据、批量实例，还是指定原型”。
