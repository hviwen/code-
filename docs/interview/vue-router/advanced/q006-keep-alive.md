# 如何缓存路由组件（keep-alive）并控制哪些路由被缓存？

> 来源：`docs/vue-router/vue_router_part_2_answer.md`

## 问题本质解读

这道题考察组件缓存机制和性能优化策略，面试官想了解你是否掌握如何合理使用缓存提升用户体验，同时避免内存泄漏等问题。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案过于简单，缺少具体的实现方式和控制策略
- 需要补充缓存的生命周期管理和状态保存
- 应该包含缓存策略的最佳实践和注意事项

## 知识点系统梳理

Vue 3 中使用 `<KeepAlive>` 组件缓存路由组件，可以通过 `include`、`exclude` 属性或路由 `meta` 配置精确控制缓存策略。

### 问题本质解读 这道题考察组件缓存机制和性能优化策略，面试官想了解你是否掌握如何合理使用缓存提升用户体验，同时避免内存泄漏等问题。

### 技术错误纠正

- 原答案过于简单，缺少具体的实现方式和控制策略
- 需要补充缓存的生命周期管理和状态保存
- 应该包含缓存策略的最佳实践和注意事项

### 知识点系统梳理

**KeepAlive 核心特性：**

- 缓存组件实例，避免重复创建和销毁
- 支持 include/exclude 精确控制缓存范围
- 提供 activated/deactivated 生命周期钩子
- 支持最大缓存数量限制（max 属性）

**缓存控制策略：**

- 基于组件名称的静态控制
- 基于路由 meta 的动态控制
- 基于业务逻辑的条件控制
- 结合状态管理的集中控制

**改进版本：**

Vue 3 中使用 `<KeepAlive>` 组件来缓存路由组件，可以通过多种方式精确控制缓存策略：

```vue
<!-- 1. 基础用法 - 缓存所有路由组件 -->
<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive>
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
  </router-view>
</template>

<!-- 2. 通过 include/exclude 控制缓存 -->
<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews" :exclude="excludedViews">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
  </router-view>
</template>

<script>
export default {
  data() {
    return {
      // 需要缓存的组件名称数组
      cachedViews: ["UserList", "ProductList"],
      // 不需要缓存的组件名称数组
      excludedViews: ["Login", "Register"],
    };
  },
};
</script>

<!-- 3. 基于路由 meta 的动态缓存控制 -->
<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="route.meta.keepAlive ? [route.name] : []">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
  </router-view>
</template>
```

```javascript
// 4. 路由配置中定义缓存策略
const routes = [
  {
    path: "/user",
    name: "UserList",
    component: UserList,
    meta: {
      keepAlive: true,
      title: "用户列表",
    },
  },
  {
    path: "/user/:id",
    name: "UserDetail",
    component: UserDetail,
    meta: {
      keepAlive: false, // 用户详情不缓存，确保数据实时性
      title: "用户详情",
    },
  },
  {
    path: "/product",
    name: "ProductList",
    component: ProductList,
    meta: {
      keepAlive: true,
      cacheTtl: 5 * 60 * 1000, // 缓存5分钟
    },
  },
];

// 5. 用户列表状态管理 Store
// stores/userList.js
export const useUserListStore = defineStore("userList", {
  state: () => ({
    users: [],
    lastUpdate: null,
    savedState: null,
  }),

  actions: {
    setUsers(users) {
      this.users = users;
      this.lastUpdate = Date.now();
    },

    saveState(state) {
      this.savedState = state;
    },

    clearSavedState() {
      this.savedState = null;
    },
  },
});

// 6. 使用 Pinia 管理缓存状态
// stores/cache.js
export const useCacheStore = defineStore("cache", {
  state: () => ({
    cachedViews: [],
    visitedViews: [],
  }),

  actions: {
    addCachedView(view) {
      if (this.cachedViews.includes(view.name)) return;
      if (view.meta && view.meta.keepAlive) {
        this.cachedViews.push(view.name);
      }
    },

    delCachedView(view) {
      const index = this.cachedViews.indexOf(view.name);
      if (index > -1) {
        this.cachedViews.splice(index, 1);
      }
    },

    delAllCachedViews() {
      this.cachedViews = [];
    },

    addVisitedView(view) {
      if (this.visitedViews.some((v) => v.path === view.path)) return;
      this.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta?.title || view.name,
      });
    },
  },
});

// 在路由守卫中管理缓存
router.beforeEach((to, from, next) => {
  const cacheStore = useCacheStore();

  // 添加到缓存
  if (to.meta.keepAlive) {
    cacheStore.addCachedView(to);
  }

  // 添加到访问历史
  cacheStore.addVisitedView(to);

  next();
});
```

```vue
<!-- 7. 高级缓存控制组件 -->
<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive
      :include="cachedViews"
      :max="maxCacheCount"
      @activated="onActivated"
      @deactivated="onDeactivated">
      <component
        :is="Component"
        :key="getComponentKey(route)"
        @cache-clear="clearCache" />
    </KeepAlive>
  </router-view>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useCacheStore } from "@/stores/cache";
import { useRoute } from "Vue Router";
import { storeToRefs } from "pinia";

export default {
  name: "CachedRouterView",
  setup() {
    const cacheStore = useCacheStore();
    const route = useRoute();
    const maxCacheCount = ref(10); // 最大缓存组件数量

    const { cachedViews } = storeToRefs(cacheStore);

    // 生成组件缓存 key
    const getComponentKey = (route) => {
      // 对于需要根据参数区分的路由，使用完整路径作为 key
      if (route.meta.cacheByParams) {
        return route.fullPath;
      }
      return route.name;
    };

    // 组件激活时的处理
    const onActivated = (component) => {
      console.log("组件激活:", component.$options.name);
      // 可以在这里触发数据刷新等操作
      if (component.onCacheActivated) {
        component.onCacheActivated();
      }
    };

    // 组件失活时的处理
    const onDeactivated = (component) => {
      console.log("组件失活:", component.$options.name);
      // 可以在这里保存状态等操作
      if (component.onCacheDeactivated) {
        component.onCacheDeactivated();
      }
    };

    // 清除指定缓存
    const clearCache = (viewName) => {
      cacheStore.delCachedView({ name: viewName });
    };

    // 监听路由变化，自动管理缓存
    watch(
      () => route.name,
      (newName, oldName) => {
        // 离开页面时，根据条件决定是否保持缓存
        if (oldName && route.meta.keepAlive === false) {
          clearCache(oldName);
        }
      }
    );

    return {
      cachedViews,
      maxCacheCount,
      getComponentKey,
      onActivated,
      onDeactivated,
      clearCache,
    };
  },
};
</script>
```

```javascript
// 8. 组件内的缓存生命周期处理
export default {
  name: "UserList",
  data() {
    return {
      users: [],
      searchQuery: "",
      currentPage: 1,
    };
  },

  // 组件被缓存激活时调用
  activated() {
    console.log("UserList 组件被激活");
    // 检查是否需要刷新数据
    this.checkDataFreshness();
  },

  // 组件被缓存失活时调用
  deactivated() {
    console.log("UserList 组件被失活");
    // 保存当前状态
    this.saveCurrentState();
  },
};
```

```vue
<!-- Composition API 版本 -->
<template>
  <div class="user-list">
    <div v-if="loading">加载中...</div>
    <div v-else>
      <UserItem v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated, onDeactivated } from "vue";

const users = ref([]);
const loading = ref(false);
const scrollPosition = ref(0);

// 检查数据新鲜度
const checkDataFreshness = () => {
  const lastUpdate = localStorage.getItem("userListLastUpdate");
  const now = Date.now();

  // 如果数据超过5分钟，重新获取
  if (!lastUpdate || now - parseInt(lastUpdate) > 5 * 60 * 1000) {
    fetchUsers();
  }
};

// 获取用户数据
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.getUsers();
    users.value = response.data;
    localStorage.setItem("userListLastUpdate", Date.now().toString());
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 保存当前状态
const saveCurrentState = () => {
  // 保存滚动位置
  scrollPosition.value =
    window.pageYOffset || document.documentElement.scrollTop;
  sessionStorage.setItem(
    "userListScrollPosition",
    scrollPosition.value.toString()
  );

  // 保存其他状态...
};

// 恢复状态
const restoreState = () => {
  // 恢复滚动位置
  const savedPosition = sessionStorage.getItem("userListScrollPosition");
  if (savedPosition) {
    nextTick(() => {
      window.scrollTo(0, parseInt(savedPosition));
    });
  }
};

// 组件被缓存激活时调用
onActivated(() => {
  console.log("UserList 组件被激活");
  checkDataFreshness();
  restoreState();
});

// 组件被缓存失活时调用
onDeactivated(() => {
  console.log("UserList 组件被失活");
  saveCurrentState();
});

const checkDataFreshness = () => {
  const userListStore = useUserListStore();
  const lastUpdate = userListStore.lastUpdate;
  const now = Date.now();
  const ttl = 5 * 60 * 1000; // 5分钟

  if (!lastUpdate || now - lastUpdate > ttl) {
    this.fetchUsers();
  }
};

// 保存当前状态
((saveCurrentState = () => {
  const userListStore = useUserListStore();
  userListStore.saveState({
    searchQuery: this.searchQuery,
    currentPage: this.currentPage,
    scrollPosition: document.documentElement.scrollTop,
  });
}),
  // 恢复状态
  (restoreState = () => {
    const userListStore = useUserListStore();
    const savedState = userListStore.savedState;
    if (savedState) {
      this.searchQuery = savedState.searchQuery;
      this.currentPage = savedState.currentPage;
      this.$nextTick(() => {
        document.documentElement.scrollTop = savedState.scrollPosition;
      });
    }
  }),
  // 手动清除缓存
  (clearSelfCache = () => {
    this.$emit("cache-clear", this.$options.name);
  }));

// 初始数据加载
fetchUsers();
</script>
```

**使用场景对比：**

- **列表页面**: 适合缓存，保持用户浏览状态和滚动位置
- **详情页面**: 通常不缓存，确保数据实时性
- **表单页面**: 谨慎缓存，需要处理数据状态和验证
- **静态页面**: 适合缓存，减少重复渲染开销

### 记忆要点总结

- 基础用法：`<KeepAlive><router-view /></KeepAlive>`
- 控制属性：include、exclude、max
- 生命周期：activated、deactivated
- 动态控制：基于 route.meta 或 store 状态
- 最佳实践：合理选择、内存管理、状态保存

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何缓存路由组件（keep-alive）并控制哪些路由被缓存？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
