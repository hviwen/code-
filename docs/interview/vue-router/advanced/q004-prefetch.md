# 如何在路由导航时实现数据预取（prefetch）？

> 来源：`docs/vue-router/vue_router_part_2_answer.md`

## 问题本质解读

这道题考察数据预取策略和性能优化技术，面试官想了解你是否掌握如何在路由切换过程中提前加载数据，减少用户等待时间。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案描述过于简单，缺少具体的实现细节和错误处理
- 需要补充多种数据预取的实现方式和适用场景
- 应该包含缓存策略和性能优化考虑

## 知识点系统梳理

通过 `beforeRouteEnter` 导航守卫在进入路由组件之前预取数据，可以在 `next` 回调中将数据传递给组件实例，提升用户体验。

### 问题本质解读 这道题考察数据预取策略和性能优化技术，面试官想了解你是否掌握如何在路由切换过程中提前加载数据，减少用户等待时间。

### 技术错误纠正

- 原答案描述过于简单，缺少具体的实现细节和错误处理
- 需要补充多种数据预取的实现方式和适用场景
- 应该包含缓存策略和性能优化考虑

### 知识点系统梳理

**数据预取的实现方式：**

- 组件内守卫：beforeRouteEnter、beforeRouteUpdate
- 全局守卫：beforeResolve 结合路由配置
- Composition API：setup 函数中的异步数据获取
- 高级策略：缓存机制、并行加载、错误处理

**数据预取的优势：**

- 减少组件渲染后的等待时间
- 提供更流畅的用户体验
- 支持加载状态的统一管理
- 便于实现复杂的数据依赖关系

**改进版本：**

数据预取可以在路由导航过程中提前加载数据，提升用户体验。有多种实现方式：

```javascript
// 1. 组件内守卫实现数据预取 - Options API
export default {
  name: "UserProfile",
  data() {
    return {
      user: null,
      posts: [],
      loading: true,
      error: null,
    };
  },

  // 进入路由前预取数据
  async beforeRouteEnter(to, from, next) {
    try {
      // 并行获取用户信息和文章列表
      const [userData, postsData] = await Promise.all([
        fetchUser(to.params.id),
        fetchUserPosts(to.params.id),
      ]);

      // 将数据传递给组件实例
      next((vm) => {
        vm.user = userData;
        vm.posts = postsData;
        vm.loading = false;
      });
    } catch (error) {
      console.error("数据预取失败:", error);
      next((vm) => {
        vm.error = error.message;
        vm.loading = false;
      });
    }
  },

  // 路由参数变化时更新数据
  async beforeRouteUpdate(to, from) {
    if (to.params.id !== from.params.id) {
      this.loading = true;
      this.error = null;

      try {
        const [userData, postsData] = await Promise.all([
          fetchUser(to.params.id),
          fetchUserPosts(to.params.id),
        ]);

        this.user = userData;
        this.posts = postsData;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  },
};
```

```vue
<!-- 1.1 Composition API 版本（推荐） -->
<template>
  <div v-if="loading">
    <div class="loading-spinner">加载中...</div>
  </div>
  <div v-else-if="error" class="error-message">
    <p>加载失败: {{ error }}</p>
    <button @click="retry">重试</button>
  </div>
  <div v-else>
    <UserInfo :user="user" />
    <UserPosts :posts="posts" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, onBeforeRouteUpdate } from "Vue Router";

const route = useRoute();

const user = ref(null);
const posts = ref([]);
const loading = ref(true);
const error = ref(null);

// 数据预取函数
const prefetchData = async (userId) => {
  loading.value = true;
  error.value = null;

  try {
    // 并行获取用户信息和文章列表
    const [userData, postsData] = await Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
    ]);

    user.value = userData;
    posts.value = postsData;
  } catch (err) {
    console.error("数据预取失败:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 路由参数变化时重新预取数据
onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    await prefetchData(to.params.id);
  }
});

// 重试函数
const retry = () => {
  prefetchData(route.params.id);
};

// 初始数据预取
prefetchData(route.params.id);
</script>
```

```javascript
// 2. 全局守卫实现数据预取
router.beforeResolve(async (to, from, next) => {
  // 检查路由是否需要数据预取
  if (to.meta.prefetch) {
    try {
      // 根据路由配置预取数据
      const prefetchPromises = to.meta.prefetch.map(async (config) => {
        const data = await config.fetch(to.params, to.query);
        // 将数据存储到 Pinia store 或路由 meta 中
        if (config.store) {
          // 使用 Pinia store action 存储数据
          const store =
            config.storeInstance || eval(`use${config.store}Store()`);
          if (store && store[config.action]) {
            store[config.action](data);
          }
        }
        return { key: config.key, data };
      });

      const results = await Promise.all(prefetchPromises);

      // 将预取的数据附加到路由对象上
      to.meta.prefetchedData = results.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});

      next();
    } catch (error) {
      console.error("全局数据预取失败:", error);
      next(); // 即使预取失败也继续导航
    }
  } else {
    next();
  }
});

// 3. 路由配置中定义预取规则
const routes = [
  {
    path: "/user/:id",
    name: "UserProfile",
    component: UserProfile,
    meta: {
      prefetch: [
        {
          key: "user",
          fetch: (params) => fetchUser(params.id),
          store: "User",
          action: "setCurrentUser",
        },
        {
          key: "posts",
          fetch: (params) => fetchUserPosts(params.id),
          store: "User",
          action: "setUserPosts",
        },
      ],
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      prefetch: [
        {
          key: "stats",
          fetch: () => fetchDashboardStats(),
          store: "Dashboard",
          action: "setStats",
        },
      ],
    },
  },
];

// 4. 使用 Composition API 的数据预取
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "Vue Router";

export default {
  name: "ProductDetail",
  async setup() {
    const route = useRoute();
    const router = useRouter();

    const product = ref(null);
    const reviews = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // 数据预取函数
    const fetchData = async (productId) => {
      try {
        loading.value = true;
        error.value = null;

        const [productData, reviewsData] = await Promise.all([
          fetchProduct(productId),
          fetchProductReviews(productId),
        ]);

        product.value = productData;
        reviews.value = reviewsData;
      } catch (err) {
        error.value = err.message;
        console.error("获取产品数据失败:", err);
      } finally {
        loading.value = false;
      }
    };

    // 初始化时获取数据
    await fetchData(route.params.id);

    // 监听路由参数变化
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          fetchData(newId);
        }
      }
    );

    return {
      product,
      reviews,
      loading,
      error,
    };
  },
};

// 5. 高级数据预取策略
class DataPrefetcher {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  // 带缓存的数据预取
  async prefetch(key, fetcher, options = {}) {
    const { ttl = 5 * 60 * 1000, force = false } = options;

    // 检查缓存
    if (!force && this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }

    // 避免重复请求
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // 发起新请求
    const promise = fetcher()
      .then((data) => {
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
        });
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // 清除缓存
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// 全局数据预取器实例
const dataPrefetcher = new DataPrefetcher();

// 在路由守卫中使用
router.beforeResolve(async (to, from, next) => {
  if (to.meta.prefetchKey) {
    try {
      const data = await dataPrefetcher.prefetch(
        to.meta.prefetchKey,
        () => to.meta.prefetchFn(to.params, to.query),
        { ttl: to.meta.cacheTtl }
      );
      to.meta.prefetchedData = data;
    } catch (error) {
      console.error("数据预取失败:", error);
    }
  }
  next();
});
```

**使用场景对比：**

- **组件内守卫**: 适用于单个组件的数据预取，控制粒度精细
- **全局守卫**: 适用于统一的数据预取策略，便于管理和配置
- **Composition API**: 适用于现代 Vue 3 项目，代码更简洁
- **缓存策略**: 适用于数据变化不频繁的场景，提升性能

### 记忆要点总结

- 组件守卫：beforeRouteEnter、beforeRouteUpdate
- 全局守卫：beforeResolve + meta 配置
- 数据传递：next(vm => vm.data = data)
- 并行加载：Promise.all([fetch1, fetch2])
- 缓存优化：TTL、去重、清理机制

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在路由导航时实现数据预取（prefetch）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
