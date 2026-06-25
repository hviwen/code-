# 如何用 `markRaw` 或 `toRaw` 优化性能或避免代理问题？

> 来源：`docs/vue/vue_3_part_2_answer.md`

## 问题本质解读

这道题考察Vue 3响应式系统的性能优化技巧，面试官想了解你是否能在合适的场景下避免不必要的响应式开销。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

markRaw：为标记数据禁止被包装为代理对象，通常用引入第三方库时，不改变其对象数据,

toRaw：将响应式数据转为非代理对象

### 问题本质解读 这道题考察Vue 3响应式系统的性能优化技巧，面试官想了解你是否能在合适的场景下避免不必要的响应式开销。

### 知识点系统梳理

**markRaw的作用和使用场景：**
```javascript
import { reactive, markRaw } from 'vue'

// 1. 第三方库实例
const state = reactive({
  // ❌ 不好的做法 - 第三方库被代理
  map: new google.maps.Map(),

  // ✅ 好的做法 - 标记为原始对象
  map: markRaw(new google.maps.Map()),

  // 其他第三方库示例
  chart: markRaw(new Chart()),
  editor: markRaw(new Monaco.Editor()),
  player: markRaw(new VideoPlayer())
})

// 2. 大型数据结构
const largeDataSet = markRaw({
  // 10万条数据，不需要响应式
  records: new Array(100000).fill(0).map((_, i) => ({
    id: i,
    data: `record-${i}`
  }))
})

const state = reactive({
  currentPage: 1,
  pageSize: 20,
  data: largeDataSet // 不会被代理
})

// 3. 配置对象
const config = markRaw({
  apiEndpoints: {
    users: '/api/users',
    posts: '/api/posts'
  },
  constants: {
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    SUPPORTED_FORMATS: ['jpg', 'png', 'gif']
  }
})

// 4. 缓存对象
const cache = markRaw(new Map())
const state = reactive({
  data: null,
  cache // Map不需要响应式
})
```

**toRaw的作用和使用场景：**
```javascript
import { reactive, toRaw } from 'vue'

const state = reactive({
  user: {
    name: 'John',
    age: 25,
    hobbies: ['reading', 'coding']
  },
  settings: {
    theme: 'dark',
    language: 'en'
  }
})

// 1. 性能优化 - 避免深层遍历
const optimizedOperation = () => {
  const rawUser = toRaw(state.user)

  // 对原始对象进行大量操作，避免触发响应式
  for (let i = 0; i < 10000; i++) {
    // 复杂计算，不需要响应式
    processUserData(rawUser)
  }
}

// 2. 第三方库集成
const integrateWithLibrary = () => {
  const rawSettings = toRaw(state.settings)

  // 传递给第三方库，避免代理对象问题
  thirdPartyLib.configure(rawSettings)
}

// 3. 序列化
const saveToStorage = () => {
  const rawState = toRaw(state)

  // 序列化原始对象，避免代理属性
  localStorage.setItem('appState', JSON.stringify(rawState))
}

// 4. 深拷贝
const cloneState = () => {
  const rawState = toRaw(state)

  // 深拷贝原始对象
  return JSON.parse(JSON.stringify(rawState))
}
```

**性能优化实战示例：**
```javascript
// 大型表格组件优化
export default {
  setup() {
    // 表格数据使用markRaw，避免每行数据都被代理
    const tableData = ref(markRaw([]))

    // 只有必要的状态使用响应式
    const tableState = reactive({
      loading: false,
      selectedRows: [],
      currentPage: 1,
      pageSize: 50
    })

    // 加载数据
    const loadData = async () => {
      tableState.loading = true
      try {
        const response = await fetchTableData()
        // 标记大量数据为原始对象
        tableData.value = markRaw(response.data)
      } finally {
        tableState.loading = false
      }
    }

    // 选择行时只更新必要的响应式状态
    const selectRow = (rowIndex) => {
      const rawData = toRaw(tableData.value)
      const row = rawData[rowIndex]

      if (tableState.selectedRows.includes(row.id)) {
        tableState.selectedRows = tableState.selectedRows.filter(
          id => id !== row.id
        )
      } else {
        tableState.selectedRows.push(row.id)
      }
    }

    return {
      tableData,
      tableState,
      loadData,
      selectRow
    }
  }
}

// 图表组件优化
export function useChart(container) {
  const chartInstance = ref(null)
  const chartData = ref(markRaw([])) // 图表数据不需要响应式

  const initChart = () => {
    // 创建图表实例并标记为原始对象
    chartInstance.value = markRaw(new Chart(container.value))
  }

  const updateChart = (newData) => {
    // 更新原始数据
    chartData.value = markRaw(newData)

    // 直接操作图表实例
    const chart = toRaw(chartInstance.value)
    chart.setData(toRaw(chartData.value))
  }

  onUnmounted(() => {
    // 清理图表实例
    const chart = toRaw(chartInstance.value)
    chart?.destroy()
  })

  return {
    chartData,
    initChart,
    updateChart
  }
}
```

**使用原则和最佳实践：**
```javascript
// ✅ 适合使用markRaw的场景
const goodUseCases = {
  // 第三方库实例
  thirdPartyInstances: markRaw(new SomeLibrary()),

  // 大型静态数据
  staticData: markRaw(largeDataArray),

  // 配置对象
  config: markRaw(appConfig),

  // 缓存对象
  cache: markRaw(new Map())
}

// ❌ 不适合使用markRaw的场景
const badUseCases = {
  // 需要响应式的UI状态
  uiState: reactive({
    isVisible: true, // 不要markRaw
    selectedItem: null // 不要markRaw
  }),

  // 表单数据
  formData: reactive({
    username: '', // 不要markRaw
    email: '' // 不要markRaw
  })
}
```

### 记忆要点总结
- markRaw：标记对象不被代理，用于第三方库、大型数据、配置
- toRaw：获取原始对象，用于性能优化、序列化、第三方集成
- 优化场景：大量数据、频繁操作、第三方库集成
- 使用原则：只对不需要响应式的数据使用

---

**解释 `render` 函数与 JSX 的应用场景及优缺点。**

Render 出现在选项式api中，是字符串模版的一种代替

JSX 为单文件系统结构，聚合结构更加明显

### 问题本质解读 这道题考察Vue的渲染方式选择，面试官想了解你是否理解不同渲染方式的适用场景和权衡。

### 知识点系统梳理

**render函数特点：**
- 使用JavaScript编写，提供完整的编程能力
- 更接近Vue的底层实现
- 适合复杂的条件渲染和动态组件创建

**JSX特点：**
- 类似HTML的语法，更直观
- 需要babel插件转换
- 结合了模板的直观性和JavaScript的灵活性

### 实战应用举例
```javascript
// 1. render函数实现
import { h, ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const items = ref(['apple', 'banana', 'orange'])

    return { count, items }
  },

  render() {
    const { count, items } = this

    // 动态标签
    const Tag = count > 5 ? 'h1' : 'h2'

    return h('div', { class: 'container' }, [
      h(Tag, `Count: ${count}`),
      h('button', {
        onClick: () => this.count++
      }, 'Increment'),

      // 条件渲染
      count > 0 && h('div', { class: 'items' },
        items.map((item, index) =>
          h('div', {
            key: item,
            class: { active: index === 0 }
          }, item)
        )
      ),

      // 插槽渲染
      this.$slots.default?.()
    ])
  }
}

// 2. JSX实现（需要@vitejs/plugin-vue-jsx）
export default {
  setup() {
    const count = ref(0)
    const items = ref(['apple', 'banana', 'orange'])

    const increment = () => count.value++

    return { count, items, increment }
  },

  render() {
    const { count, items, increment } = this
    const Tag = count > 5 ? 'h1' : 'h2'

    return (
      <div class="container">
        <Tag>Count: {count}</Tag>
        <button onClick={increment}>Increment</button>

        {count > 0 && (
          <div class="items">
            {items.map((item, index) => (
              <div
                key={item}
                class={{ active: index === 0 }}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {this.$slots.default?.()}
      </div>
    )
  }
}

// 3. 复杂动态组件示例
const DynamicForm = {
  props: ['schema'],

  render() {
    const renderField = (field) => {
      const { type, name, label, options } = field

      switch (type) {
        case 'input':
          return h('input', {
            type: 'text',
            name,
            placeholder: label
          })

        case 'select':
          return h('select', { name }, [
            h('option', { value: '' }, `Select ${label}`),
            ...options.map(opt =>
              h('option', { value: opt.value }, opt.label)
            )
          ])

        case 'checkbox':
          return h('label', [
            h('input', { type: 'checkbox', name }),
            label
          ])

        default:
          return null
      }
    }

    return h('form', { class: 'dynamic-form' },
      this.schema.map(field =>
        h('div', { key: field.name, class: 'field' }, [
          h('label', field.label),
          renderField(field)
        ])
      )
    )
  }
}
```

**应用场景对比：**
```javascript
// 适合render函数的场景
const scenarios = {
  // 1. 高度动态的组件
  dynamicComponent: {
    render() {
      const components = {
        text: TextComponent,
        image: ImageComponent,
        video: VideoComponent
      }

      return this.blocks.map(block =>
        h(components[block.type], {
          key: block.id,
          ...block.props
        })
      )
    }
  },

  // 2. 复杂的条件渲染
  conditionalRender: {
    render() {
      if (this.loading) return h(LoadingSpinner)
      if (this.error) return h(ErrorMessage, { error: this.error })
      if (!this.data.length) return h(EmptyState)

      return h(DataList, { data: this.data })
    }
  },

  // 3. 递归组件
  treeNode: {
    render() {
      const renderChildren = (children) =>
        children.map(child =>
          h(TreeNode, {
            key: child.id,
            node: child
          })
        )

      return h('div', { class: 'tree-node' }, [
        h('div', { class: 'node-content' }, this.node.label),
        this.node.children && h('div', { class: 'children' },
          renderChildren(this.node.children)
        )
      ])
    }
  }
}
```

**优缺点对比：**
```javascript
// render函数
const renderFunction = {
  优点: [
    '完整的JavaScript编程能力',
    '更接近Vue底层，性能更好',
    '适合复杂逻辑和动态组件',
    '更好的TypeScript支持'
  ],
  缺点: [
    '语法相对复杂，学习成本高',
    '可读性不如模板直观',
    '调试相对困难',
    '团队协作成本高'
  ]
}

// JSX
const jsx = {
  优点: [
    '语法类似HTML，更直观',
    '结合了模板和JavaScript的优势',
    'React开发者容易上手',
    '支持完整的JavaScript表达式'
  ],
  缺点: [
    '需要额外的构建配置',
    'Vue生态支持不如模板完善',
    '与Vue的指令系统不兼容',
    '文件大小可能更大'
  ]
}

// 模板（对比参考）
const template = {
  优点: [
    '语法简单，学习成本低',
    '更好的IDE支持和语法高亮',
    '编译时优化更好',
    'Vue生态完整支持'
  ],
  缺点: [
    'JavaScript能力受限',
    '复杂逻辑表达困难',
    '动态性不如render函数',
    '某些场景需要额外的计算属性'
  ]
}
```

### 记忆要点总结
- render函数：完整JS能力，适合复杂动态场景
- JSX：类HTML语法，平衡直观性和灵活性
- 选择原则：简单用模板，复杂用render，团队熟悉React用JSX
- 性能：render函数 > JSX > 模板（编译优化后差距很小）

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何用 `markRaw` 或 `toRaw` 优化性能或避免代理问题？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
