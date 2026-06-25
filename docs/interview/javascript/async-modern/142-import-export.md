# 142. [中级]** import和export的各种用法

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察ES6模块系统的完整语法，面试官想了解你是否掌握各种导入导出方式的使用场景和最佳实践。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- `import * as from './xxx.js'` 应该是 `import * as moduleName from './xxx.js'`
- 需要补充更多实际使用场景和语法变体

## 知识点系统梳理

- import Xxx from './xxx.js' 导入类或者函数； 需要在文件中导出 export default Xxx
- import {a,b,c} from './xxx.js' 导入多个方法； 在文件中可以定义多个导出内容 export const a = 1； export function b(){}
- import \* as moduleName from './xxx.js' 导入整个模块并重新命名
- import './style.js'
- export {Xxx} from './xxx.js'

### 问题本质解读 这道题考察ES6模块系统的完整语法，面试官想了解你是否掌握各种导入导出方式的使用场景和最佳实践。

### 技术错误纠正

- `import * as from './xxx.js'` 应该是 `import * as moduleName from './xxx.js'`
- 需要补充更多实际使用场景和语法变体

### 知识点系统梳理

**export导出的各种方式：**

1. **命名导出（Named Exports）**：可以有多个
2. **默认导出（Default Export）**：每个模块只能有一个
3. **重新导出（Re-exports）**：从其他模块导出
4. **混合导出**：同时使用命名和默认导出

**import导入的各种方式：**

1. **默认导入**：导入默认导出
2. **命名导入**：导入指定的命名导出
3. **命名空间导入**：导入整个模块
4. **副作用导入**：只执行模块代码
5. **动态导入**：运行时导入

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. export的各种用法

// === 命名导出 (utils.js) ===
// 方式1: 声明时导出
export const PI = 3.14159;
export let counter = 0;
export var name = 'Utils';

export function add(a, b) {
  return a + b;
}

export class Calculator {
  constructor() {
    this.result = 0;
  }

  add(value) {
    this.result += value;
    return this;
  }
}

// 方式2: 声明后导出
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

export { subtract, multiply, divide };

// 方式3: 重命名导出
const internalFunction = () => 'internal';
export { internalFunction as publicFunction };

// === 默认导出 (math.js) ===
// 方式1: 直接导出值
export default function(x, y) {
  return x + y;
}

// 方式2: 导出变量
const defaultCalculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
export default defaultCalculator;

// 方式3: 导出类
export default class MathUtils {
  static square(x) {
    return x * x;
  }
}

// === 混合导出 (advanced.js) ===
export const version = '1.0.0';
export const author = 'Developer';

export default class AdvancedMath {
  static factorial(n) {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }
}

// 2. import的各种用法

// === 默认导入 ===
import MathUtils from './math.js';
import Calculator from './advanced.js'; // 导入默认导出的类
import defaultCalc from './math.js'; // 可以重命名

// === 命名导入 ===
import { PI, add, Calculator } from './utils.js';
import { subtract, multiply } from './utils.js';

// === 重命名导入 ===
import { add as sum, subtract as minus } from './utils.js';
import { Calculator as Calc } from './utils.js';

// === 混合导入 ===
import AdvancedMath, { version, author } from './advanced.js';

// === 命名空间导入 ===
import * as Utils from './utils.js';
// 使用: Utils.PI, Utils.add(), new Utils.Calculator()

import * as MathLib from './math.js';
// 使用: MathLib.default() 访问默认导出

// === 副作用导入 ===
import './polyfills.js'; // 只执行模块代码，不导入任何值
import './styles.css'; // 在构建工具中导入样式

// === 动态导入 ===
const mathModule = await import('./math.js');
const utils = await import('./utils.js');

// 条件导入
if (needAdvancedFeatures) {
  const advanced = await import('./advanced.js');
  const AdvancedMath = advanced.default;
}

// 3. 重新导出（Re-exports）

// === 基础重新导出 (index.js) ===
// 导出其他模块的命名导出
export { PI, add, Calculator } from './utils.js';
export { version, author } from './advanced.js';

// 重命名重新导出
export { add as sum } from './utils.js';

// 导出默认导出为命名导出
export { default as MathUtils } from './math.js';
export { default as AdvancedMath } from './advanced.js';

// === 命名空间重新导出 ===
export * from './utils.js'; // 导出所有命名导出
export * as Utils from './utils.js'; // 作为命名空间导出

// === 混合重新导出 ===
// 既重新导出又添加新的导出
export { PI, add } from './utils.js';
export const LIBRARY_VERSION = '2.0.0';
export default class MathLibrary {
  // 新的默认导出
}

// 4. 高级用法和模式

// === 条件导出 ===
// config.js
const isDevelopment = process.env.NODE_ENV === 'development';

export const config = isDevelopment
  ? await import('./config.dev.js')
  : await import('./config.prod.js');

// === 懒加载模式 ===
// components.js
export const LazyComponent = () => import('./LazyComponent.js');
export const HeavyLibrary = () => import('./heavy-library.js');

// === 插件系统 ===
// plugin-loader.js
const plugins = [];

export async function loadPlugin(pluginName) {
  try {
    const plugin = await import(`./plugins/${pluginName}.js`);
    plugins.push(plugin.default);
    return plugin.default;
  } catch (error) {
    console.error(`Failed to load plugin: ${pluginName}`, error);
  }
}

export function getLoadedPlugins() {
  return plugins;
}

// === 模块聚合器 ===
// api/index.js - 统一API入口
export { UserAPI } from './user.js';
export { ProductAPI } from './product.js';
export { OrderAPI } from './order.js';
export { default as BaseAPI } from './base.js';

// 提供便捷的统一接口
export const API = {
  User: UserAPI,
  Product: ProductAPI,
  Order: OrderAPI
};
```

**Vue 3框架应用示例：**

```javascript
// === Vue 3项目中的import/export应用 ===

// composables/index.js - 组合式函数聚合
export { useCounter } from './useCounter.js'
export { useLocalStorage } from './useLocalStorage.js'
export { useAsync } from './useAsync.js'
export { useFetch } from './useFetch.js'

// 默认导出常用组合
export { default as useCommon } from './useCommon.js'

// utils/index.js - 工具函数聚合
export * from './format.js'
export * from './validation.js'
export * from './date.js'

// 重新导出并重命名
export { debounce as delay } from './performance.js'
export { throttle as limit } from './performance.js'

// components/base/index.js - 基础组件导出
export { default as BaseButton } from './BaseButton.vue'
export { default as BaseInput } from './BaseInput.vue'
export { default as BaseModal } from './BaseModal.vue'

// 批量导出
const components = {
  BaseButton: () => import('./BaseButton.vue'),
  BaseInput: () => import('./BaseInput.vue'),
  BaseModal: () => import('./BaseModal.vue'),
}

export default components

// stores/index.js - Pinia状态管理聚合
export { useUserStore } from './user.js'
export { useCartStore } from './cart.js'
export { useSettingsStore } from './settings.js'

// 提供统一的store访问
export const stores = {
  user: useUserStore,
  cart: useCartStore,
  settings: useSettingsStore,
}

// router/modules/index.js - 路由模块聚合
export { default as userRoutes } from './user.js'
export { default as productRoutes } from './product.js'
export { default as adminRoutes } from './admin.js'

// 合并所有路由
import userRoutes from './user.js'
import productRoutes from './product.js'
import adminRoutes from './admin.js'

export const allRoutes = [...userRoutes, ...productRoutes, ...adminRoutes]

// plugins/index.js - 插件系统
export { default as i18nPlugin } from './i18n.js'
export { default as routerPlugin } from './router.js'
export { default as storePlugin } from './store.js'

// 插件安装器
export function installPlugins(app) {
  const plugins = [
    () => import('./i18n.js'),
    () => import('./router.js'),
    () => import('./store.js'),
  ]

  return Promise.all(
    plugins.map(async pluginLoader => {
      const plugin = await pluginLoader()
      app.use(plugin.default)
    }),
  )
}

// main.js - 应用入口的导入使用
import { createApp } from 'vue'
import App from './App.vue'

// 静态导入
import router from './router'
import { createPinia } from 'pinia'

// 动态导入
const { installPlugins } = await import('./plugins')

// 条件导入
if (import.meta.env.DEV) {
  const { setupDevtools } = await import('./devtools')
  setupDevtools()
}

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

await installPlugins(app)

app.mount('#app')
```

**使用场景和最佳实践：**

| 导入/导出方式 | 使用场景                 | 最佳实践             |
| ------------- | ------------------------ | -------------------- |
| 默认导出      | 模块主要功能、类、组件   | 每个模块只有一个     |
| 命名导出      | 工具函数、常量、多个功能 | 明确的命名，避免冲突 |
| 命名空间导入  | 大型库、工具集合         | 避免命名冲突         |
| 重新导出      | 模块聚合、API统一        | 创建清晰的模块边界   |
| 动态导入      | 代码分割、懒加载         | 性能优化，按需加载   |
| 副作用导入    | 样式、polyfill、初始化   | 确保执行顺序         |

### 记忆要点总结

- export有命名导出和默认导出两种主要方式
- import支持多种导入模式：默认、命名、命名空间、动态
- 重新导出用于模块聚合和API统一
- 动态import()支持代码分割和懒加载
- 副作用导入用于执行模块代码而不导入值
- 合理使用不同方式可以优化代码结构和性能

## 实战应用举例

工具函数库优先使用命名导出，调用方可以按需导入。

```javascript
// utils/format.js
export function formatDate(value) {}
export function formatMoney(value) {}

// page.js
import { formatMoney } from './utils/format.js'
```

## 使用场景说明和对比

| 写法 | 适合场景 | 注意点 |
| --- | --- | --- |
| 命名导出 | 工具函数、常量、多个能力 | 名称稳定，利于按需导入 |
| 默认导出 | 单一组件、单一类、主功能 | 重命名自由，但团队命名可能不统一 |
| 重新导出 | 统一模块入口 | 避免 barrel 文件造成循环依赖 |
| 动态导入 | 懒加载、按需加载 | 返回 Promise，要处理失败 |

## 易错点提示

1. 命名导入必须用导出时的名字，除非用 `as` 重命名。
2. 一个模块只能有一个默认导出。
3. `export *` 不会重新导出 default。
4. 静态 `import` 只能写在模块顶层。
5. 动态 `import()` 返回 Promise。

## 记忆要点总结

- 多能力用命名导出。
- 单一主能力可用默认导出。
- 聚合入口用重新导出。
- 懒加载用动态导入。

## 延伸问题

可以继续追问：142. [中级]** import和export的各种用法 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：命名导出和默认导出怎么选？**  
A：工具函数和多个 API 用命名导出；组件或模块唯一主能力可以用默认导出。

**Q：`import * as utils` 适合什么时候？**  
A：适合需要整体命名空间避免命名冲突的场景，但可能不如按需导入清晰。

## 辅助记忆总结

一句话记：多个能力点名导出，一个主角默认导出，懒加载用 import()。
