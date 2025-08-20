---

**`v-if` 与 `v-show` 的区别？**

v-if用于逻辑判断，逻辑为false的组件将不展示。dom不渲染。变换为true时将重新渲染dom

v-show用于组件的展示和隐藏。隐藏时视觉上看不到，但是dom结构依然存在。

## 深度分析与补充

**问题本质解读：** 这道题考察Vue模板指令的性能差异和使用场景，面试官想了解你是否能根据实际需求选择合适的显示/隐藏方式。

**知识点系统梳理：**

**v-if特点：**
- 条件性渲染，false时完全不渲染DOM
- 切换时会销毁和重建元素及其子组件
- 有更高的切换开销
- 支持v-else-if和v-else
- 惰性的，初始条件为false时不会渲染

**v-show特点：**
- 基于CSS的display属性切换
- 元素始终被渲染并保留在DOM中
- 有更高的初始渲染开销
- 不支持template元素
- 不支持v-else

**实战应用举例：**
```vue
<template>
  <!-- v-if - 条件渲染 -->
  <div v-if="userRole === 'admin'">
    <AdminPanel /> <!-- 只有管理员才渲染 -->
  </div>
  <div v-else-if="userRole === 'user'">
    <UserPanel />
  </div>
  <div v-else>
    <GuestPanel />
  </div>

  <!-- v-show - 显示/隐藏 -->
  <div v-show="isModalVisible" class="modal">
    <ModalContent /> <!-- 始终渲染，通过CSS控制显示 -->
  </div>

  <!-- 性能对比场景 -->
  <!-- 频繁切换 - 使用v-show -->
  <div v-show="activeTab === 'profile'">个人资料</div>

  <!-- 条件很少改变 - 使用v-if -->
  <div v-if="user.isPremium">高级功能</div>
</template>

<style>
/* v-show实际上是这样工作的 */
.v-show-hidden {
  display: none !important;
}
</style>
```

**使用场景选择：**
- **v-if**: 条件很少改变、初始条件为false、需要条件性加载组件
- **v-show**: 频繁切换显示状态、元素较简单、需要保持组件状态

**记忆要点总结：**
- v-if：真正的条件渲染，DOM增删
- v-show：CSS显示控制，DOM常驻
- 选择原则：频繁切换用v-show，条件渲染用v-if

---

**`v-for` 上为什么需要 `key`？如何选择 key？**

循环相同结构的组件，需要对每个组件标识身份，以提高dom操作的可靠性。~~key要避免是一个对象类型，会被解析成字符串结构。导致每一个key都相同。~~~~key可以是遍历中的顺序编号，或者遍历内容的id。~~

## 深度分析与补充

**问题本质解读：** 这道题考察Vue的虚拟DOM diff算法和列表渲染优化，面试官想了解你是否理解key的作用机制和性能影响。

**技术错误纠正：**
1. 不建议使用数组索引作为key，特别是在列表会发生增删改的情况下
2. 对象类型确实会被转换为字符串，但这不是主要问题

**知识点系统梳理：**

**key的作用机制：**
- Vue使用key来识别VNode，进行高效的diff算法
- 相同key的元素会被复用，不同key的元素会被重新创建
- 帮助Vue跟踪每个节点的身份，维护组件状态

**不使用key的问题：**
- Vue会使用就地更新策略，可能导致状态混乱
- 列表项的内部状态可能错乱
- 性能可能受到影响

**实战应用举例：**
```vue
<template>
  <!-- ❌ 错误示例 -->
  <div v-for="(item, index) in list" :key="index">
    <input v-model="item.name" />
    <button @click="deleteItem(index)">删除</button>
  </div>

  <!-- ❌ 更糟糕的示例 -->
  <div v-for="item in list">
    {{ item.name }}
  </div>

  <!-- ✅ 正确示例 -->
  <div v-for="item in list" :key="item.id">
    <input v-model="item.name" />
    <button @click="deleteItem(item.id)">删除</button>
  </div>

  <!-- ✅ 复杂对象的key -->
  <UserCard
    v-for="user in users"
    :key="`user-${user.id}-${user.version}`"
    :user="user"
  />

  <!-- ✅ 字符串列表的key -->
  <li v-for="(tag, index) in tags" :key="tag">
    {{ tag }}
  </li>
</template>

<script setup>
// 演示key的重要性
const list = ref([
  { id: 1, name: 'Alice', editing: false },
  { id: 2, name: 'Bob', editing: false },
  { id: 3, name: 'Charlie', editing: false }
])

// 删除中间项时，使用index作为key会导致状态错乱
const deleteItem = (id) => {
  const index = list.value.findIndex(item => item.id === id)
  list.value.splice(index, 1)
}
</script>
```

**key选择原则：**
1. **唯一性**: 在同一层级中必须唯一
2. **稳定性**: 同一个数据项的key不应该改变
3. **可预测性**: 相同的数据应该产生相同的key

**常见key选择策略：**
- **数据库ID**: `item.id` (最佳选择)
- **业务唯一标识**: `item.code`、`item.uuid`
- **组合key**: `${item.type}-${item.id}`
- **内容hash**: 适用于纯展示的静态内容

**记忆要点总结：**
- key的作用：帮助Vue识别和复用元素
- 选择原则：唯一、稳定、可预测
- 避免使用：数组索引（动态列表）、随机数
- 最佳实践：使用数据的唯一标识符

---