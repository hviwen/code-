# 005. [初级]** JavaScript中`undefined`和`null`的区别是什么？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript中两个特殊值的语义差异，面试官想了解你是否理解它们的产生场景和正确使用方式。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道），包括 undefined 和 null 的语义差异、产生场景、typeof 返回值、JSON 序列化行为差异、ES2020 可选链与空值合并操作符，以及类型守卫和默认值处理模式。

## 技术错误纠正

1. "通过作用域查找找不到该值的定义的位置"表述不准确，undefined不是作用域查找的结果
2. "null表示为空，没有任何意义"过于简单，缺少具体的语义说明
3. 没有说明两者的产生场景和使用建议

## 知识点系统梳理

都是原始数据类型

undefined 是指未定义/缺少值; 系统自动赋予的值

null 表示为空/无对象; 程序员主动赋予的值


**undefined的含义：**
- 表示"未定义"或"缺少值"
- 是变量的默认值
- 系统自动赋予的值

**null的含义：**
- 表示"空值"或"无对象"
- 是程序员主动赋予的值
- 表示"这里应该有一个对象，但现在没有"

### 实战应用举例
```javascript
// undefined的产生场景
let uninitialized; // 声明但未赋值
console.log(uninitialized); // undefined

function noReturn() {
  // 没有return语句
}
console.log(noReturn()); // undefined

function withReturn() {
  return; // 空return
}
console.log(withReturn()); // undefined

const obj = {};
console.log(obj.nonExistent); // undefined - 访问不存在的属性

function func(a, b) {
  console.log(b); // undefined - 未传递的参数
}
func(1);

// 数组的稀疏元素
const arr = [1, , 3]; // 中间元素是undefined
console.log(arr[1]); // undefined

// null的使用场景
let user = null; // 明确表示"暂时没有用户"

function findUser(id) {
  // 找不到用户时返回null，而不是undefined
  return users.find(u => u.id === id) || null;
}

// DOM API中的null
const element = document.getElementById('nonexistent'); // null

// 重置对象引用
let data = { name: 'John' };
data = null; // 明确清空引用，帮助垃圾回收

// 类型检测和比较
console.log(typeof undefined); // 'undefined'
console.log(typeof null); // 'object' (历史bug)

console.log(undefined == null); // true - 抽象相等
console.log(undefined === null); // false - 严格相等

console.log(undefined == 0); // false
console.log(null == 0); // false
console.log(undefined == false); // false
console.log(null == false); // false

// 转换为布尔值
console.log(Boolean(undefined)); // false
console.log(Boolean(null)); // false
console.log(!undefined); // true
console.log(!null); // true

// 转换为数字
console.log(Number(undefined)); // NaN
console.log(Number(null)); // 0
console.log(+undefined); // NaN
console.log(+null); // 0

// 转换为字符串
console.log(String(undefined)); // 'undefined'
console.log(String(null)); // 'null'
console.log(undefined + ''); // 'undefined'
console.log(null + ''); // 'null'

// 实际项目中的应用

// 1. 参数默认值处理
function greet(name) {
  // ES5方式
  if (name === undefined) {
    name = 'Guest';
  }

  // 或者使用 || 操作符（注意会把所有falsy值都替换）
  name = name || 'Guest';

  return `Hello, ${name}!`;
}

// ES6默认参数（只处理undefined）
function greetES6(name = 'Guest') {
  return `Hello, ${name}!`;
}

console.log(greet()); // 'Hello, Guest!'
console.log(greet(null)); // 'Hello, null!' - 注意差异
console.log(greetES6()); // 'Hello, Guest!'
console.log(greetES6(null)); // 'Hello, null!'

// 2. 安全的属性访问
function safeGet(obj, path, defaultValue = undefined) {
  if (obj === null || obj === undefined) {
    return defaultValue;
  }

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

// 使用示例
const user = {
  profile: {
    name: 'John',
    address: null
  }
};

console.log(safeGet(user, 'profile.name')); // 'John'
console.log(safeGet(user, 'profile.age')); // undefined
console.log(safeGet(user, 'profile.address.street')); // undefined
console.log(safeGet(user, 'profile.age', 0)); // 0

// 3. 空值检查工具函数
const NullishUtils = {
  // 检查是否为null或undefined
  isNullish(value) {
    return value === null || value === undefined;
  },

  // 检查是否为undefined
  isUndefined(value) {
    return value === undefined;
  },

  // 检查是否为null
  isNull(value) {
    return value === null;
  },

  // 提供默认值（只处理null和undefined）
  defaultValue(value, defaultVal) {
    return this.isNullish(value) ? defaultVal : value;
  },

  // 空值合并（类似ES2020的??操作符）
  coalesce(...values) {
    return values.find(val => !this.isNullish(val));
  }
};

// 使用示例
console.log(NullishUtils.isNullish(null)); // true
console.log(NullishUtils.isNullish(undefined)); // true
console.log(NullishUtils.isNullish(0)); // false
console.log(NullishUtils.isNullish('')); // false

console.log(NullishUtils.defaultValue(null, 'default')); // 'default'
console.log(NullishUtils.defaultValue(0, 'default')); // 0

console.log(NullishUtils.coalesce(null, undefined, 0, 'first')); // 0

// 4. 现代JavaScript的解决方案（ES2020+）
// 可选链操作符
console.log(user?.profile?.address?.street); // undefined

// 空值合并操作符
const userName = user?.profile?.name ?? 'Anonymous';
console.log(userName); // 'John'

const userAge = user?.profile?.age ?? 18;
console.log(userAge); // 18

// 5. JSON序列化中的差异
const data = {
  a: undefined,
  b: null,
  c: 'value'
};

console.log(JSON.stringify(data)); // '{"b":null,"c":"value"}'
// 注意：undefined属性会被忽略，null会被保留

// 6. 函数参数的最佳实践
function processData(data, options = {}) {
  // 明确区分未传递和传递null
  if (data === undefined) {
    throw new Error('Data is required');
  }

  if (data === null) {
    console.log('Data is explicitly null, using empty dataset');
    data = [];
  }

  // 处理options
  const config = {
    format: 'json',
    validate: true,
    ...options
  };

  return { data, config };
}
```

**使用建议对比：**

| 场景 | 使用undefined | 使用null |
|------|---------------|----------|
| 变量初始化 | let x; | let x = null; |
| 函数返回值 | 表示没有返回值 | 表示明确的空结果 |
| 对象属性 | 属性不存在 | 属性存在但值为空 |
| 函数参数 | 参数未传递 | 明确传递空值 |
| API设计 | 可选字段 | 可空字段 |

### 记忆要点总结
- **undefined**：系统默认值，表示"未定义"或"缺少值"
- **null**：程序员主动赋值，表示"空值"或"无对象"
- **类型检测**：typeof undefined为'undefined'，typeof null为'object'
- **相等比较**：undefined == null为true，undefined === null为false
- **现代解决方案**：可选链(?.)和空值合并(??)操作符
- **最佳实践**：明确区分两者的语义，合理选择使用场景

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**undefined vs null 语义对比：**

| 维度 | undefined | null |
|------|-----------|------|
| 语义 | 系统级"未定义/缺失" | 开发者主动设置"空值" |
| 产生方式 | 变量未赋值、属性不存在、参数未传递 | 程序员显式赋值 `= null` |
| typeof | `'undefined'` | `'object'`（历史bug） |
| 转为数字 | `NaN` | `0` |
| JSON序列化 | **被丢弃** | **被保留** |
| ES6默认参数 | **触发默认值** | **不触发** |

**前端业务中的使用约定：**

```javascript
// 场景1：React/Vue状态初始化
const [user, setUser] = useState(null)     // null表示"尚未加载"
// user === null → 显示loading
// user === undefined → 不应该出现（是bug）
// user是对象 → 显示用户信息

// 场景2：API设计 — 可选字段 vs 可空字段
interface UserProfile {
  name: string          // 必填
  bio?: string          // 可选 → 值可能是undefined（字段不存在）
  avatar: string | null // 可空 → null表示"用户主动删除了头像"
}

// 场景3：组件props默认值
function Button({ size = 'medium', icon }) {
  // size未传 → undefined → 触发默认值 'medium'
  // size传null → 不触发默认值 → size是null ← 注意！
  // icon未传 → undefined → 不渲染图标
}

// 场景4：清空引用帮助GC
let cache = buildHeavyData()
cache = null  // ✅ 明确释放引用
// cache = undefined // ❌ 语义不清晰
```

## 易错点提示

**1. `JSON.stringify` 对undefined和null的处理完全不同：**
```javascript
JSON.stringify({ a: undefined, b: null, c: 1 })
// '{"b":null,"c":1}' ← undefined属性被丢弃，null被保留

// 数组中undefined变成null
JSON.stringify([1, undefined, 3])
// '[1,null,3]'
```

**2. ES6默认参数只对undefined生效，null不触发：**
```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}`
}
greet()         // 'Hello, Guest'  ← undefined触发默认值
greet(undefined)// 'Hello, Guest'  ← 同上
greet(null)     // 'Hello, null'   ← null不触发！
```

**3. `typeof null` 是 `'object'`，容易与对象混淆：**
```javascript
function processData(data) {
  if (typeof data === 'object') {
    // ❌ null也会进入这个分支！
    data.name // TypeError: Cannot read property 'name' of null
  }
}
```

**4. null和undefined在数值运算中结果不同：**
```javascript
null + 1      // 1  ← null转为0
undefined + 1 // NaN ← undefined转为NaN
null * 5      // 0
undefined * 5 // NaN
```

## 记忆要点总结

- **undefined**：系统默认的"缺失值"（未赋值、未传参、属性不存在）
- **null**：开发者主动设置的"空值"（清空引用、API返回空、DOM查找失败）
- **JSON差异**：`undefined` 被丢弃，`null` 被保留 — 影响前后端数据传输
- **默认参数**：ES6默认参数只对 `undefined` 生效，`null` 不触发
- **数值转换**：`Number(null)` 是 `0`，`Number(undefined)` 是 `NaN`

## 延伸问题

可选链操作符 `?.` 和空值合并操作符 `??` 是如何处理null和undefined的？它们与 `&&` 和 `||` 有什么区别？

## 可能类似的问题及简要参考答案

**Q：应该用undefined还是null来初始化变量？**
A：对象类型用 `null`（表示"将来会赋值一个对象"），原始类型让系统保持 `undefined` 即可。不要主动赋值 `= undefined`，这会和"从未赋值"的语义混淆。

**Q：`??` 和 `||` 的区别是什么？**
A：`||` 对所有falsy值（0、''、false、null、undefined）生效，`??` 只对 `null` 和 `undefined` 生效。所以 `0 || 10` 是 `10`（可能不符预期），`0 ?? 10` 是 `0`（保留了0）。

## 辅助记忆总结

undefined是系统级"没给值"，null是开发者"主动清空"；JSON丢undefined留null，默认参数只接undefined，数值转换null→0但undefined→NaN。
