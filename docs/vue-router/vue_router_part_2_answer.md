# Vue Router 面试题答案集（第二部分）

> **说明**：本文档包含原始学习答案和深度技术分析两部分。原始答案保留了完整的学习轨迹，深度分析部分提供了准确的技术参考和最佳实践，适合面试前复习使用。本部分重点关注 Vue Router 的高级特性和复杂应用场景。

---

### **路由懒加载与 webpack chunk name 的关系如何控制？**

路由懒加载主要通过动态 `import()` 实现，与 webpack 的代码分割功能结合使用。~~通过 defineAsyncComponent 和 动态import() 结合实现~~ 直接在路由配置中使用 `() => import()` 即可。

~~webpack 中通过tree-sharking（树摇）将并没有实际使用到的组件过滤~~ webpack 通过代码分割（Code Splitting）将不同路由的组件打包成独立的 chunk，可以通过 webpackChunkName 注释控制 chunk 名称和分组策略。

## 深度分析与补充

**问题本质解读：** 这道题考察前端性能优化中的代码分割和懒加载技术，面试官想了解你是否掌握大型应用的资源加载优化策略和 webpack 构建配置。

**技术错误纠正：**

- 路由懒加载不需要 defineAsyncComponent，直接使用动态 import() 即可
- Tree-shaking 是用于移除未使用代码的技术，与代码分割是不同的概念
- 正确的概念是通过 webpack 的代码分割功能实现按需加载

**知识点系统梳理：**

**路由懒加载核心原理：**

- 利用 ES6 动态 import() 语法实现按需加载
- webpack 自动将动态导入的模块分割成独立的 chunk
- 浏览器在需要时才下载对应的 chunk 文件
- 减少初始包体积，提升首屏加载速度

**webpackChunkName 的作用：**

- 控制生成的 chunk 文件名称
- 将相关组件打包到同一个 chunk 中
- 便于缓存管理和调试分析
- 支持预加载和预获取优化

**技术补充：**

路由懒加载主要通过动态 `import()` 实现，与 webpack 的代码分割功能结合使用。可以通过 webpack 魔法注释来精确控制 chunk name：

```javascript
// 1. 基础懒加载
const routes = [
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/User.vue"),
  },
];

// 2. 使用 webpackChunkName 控制 chunk 名称
const routes = [
  {
    path: "/user",
    name: "User",
    component: () => import(/* webpackChunkName: "user" */ "@/views/User.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/Admin.vue"),
  },
];

// 3. 按功能模块分组（相同 chunk name 会打包到一起）
const routes = [
  {
    path: "/user/profile",
    component: () =>
      import(/* webpackChunkName: "user-module" */ "@/views/UserProfile.vue"),
  },
  {
    path: "/user/settings",
    component: () =>
      import(/* webpackChunkName: "user-module" */ "@/views/UserSettings.vue"),
  },
];

// 4. 动态 chunk name（根据路由参数）
const routes = [
  {
    path: "/module/:name",
    component: (route) =>
      import(
        /* webpackChunkName: "module-[request]" */ `@/views/${route.params.name}.vue`
      ),
  },
];

// 5. 预加载和预获取
const routes = [
  {
    path: "/important",
    component: () =>
      import(
        /* webpackChunkName: "important" */
        /* webpackPreload: true */
        "@/views/Important.vue"
      ),
  },
  {
    path: "/optional",
    component: () =>
      import(
        /* webpackChunkName: "optional" */
        /* webpackPrefetch: true */
        "@/views/Optional.vue"
      ),
  },
];
```

**使用场景对比：**

- **基础懒加载**: 适用于所有路由组件，减少初始包体积
- **分组打包**: 将相关功能的组件打包到同一个 chunk，减少 HTTP 请求
- **预加载**: 重要页面使用 webpackPreload，与父 chunk 并行加载
- **预获取**: 次要页面使用 webpackPrefetch，在空闲时预先加载

**记忆要点总结：**

- 懒加载语法：`() => import('./Component.vue')`
- Chunk 命名：`/* webpackChunkName: "chunk-name" */`
- 预加载：`/* webpackPreload: true */`
- 预获取：`/* webpackPrefetch: true */`
- 最佳实践：合理分组，避免过度分割

### **如何实现基于 `meta` 的权限路由（示例流程）？**

在路由配置中通过 `meta` 字段定义权限信息，然后在导航守卫中进行权限验证和访问控制。

```javascript
// 原始答案存在多个技术错误
const routes = [
  { path: "/", name: "home", component: HomeView },
  {
    path: "/user/:id", // 修正：缺少冒号前的斜杠
    name: "user",
    component: UserView,
    meta: {
      requiresAuth: true, // 修正：不应该在路由配置时调用 getToken()
    },
  },
  { path: "/login", name: "login", component: LoginView },
];

// Vue Router 3 语法（仍然支持）
router.beforeEach((to, from, next) => {
  // 修正：参数应该是 (to, from, next)
  if (to.meta.requiresAuth && !getToken()) {
    // 修正：逻辑错误和方法名错误
    next("/login"); // 修正：应该使用 next() 而不是 router.redirect()
  } else {
    next();
  }
});

// Vue Router 4 推荐语法（返回值方式）
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !getToken()) {
    return "/login"; // 返回重定向路径
  }
  // 返回 undefined 或 true 表示继续导航
});
```

## 深度分析与补充

**问题本质解读：** 这道题考察前端权限控制系统的设计和实现，面试官想了解你是否掌握基于路由的权限管理、用户认证流程和安全防护机制。

**技术错误纠正：**

- 路由路径 `/user:id` 应为 `/user/:id`，缺少参数前的斜杠
- meta 中不应该直接调用 `getToken()`，应该定义静态的权限配置
- 导航守卫参数错误，应该是 `(to, from, next)` 三个参数
- 方法名错误：`router.redrite` 应为 `next('/login')`
- 逻辑错误：应该检查需要权限但没有 token 的情况

**知识点系统梳理：**

**权限路由核心概念：**

- 基于 meta 字段定义路由级权限信息
- 在导航守卫中进行统一的权限验证
- 支持角色权限、功能权限等多维度控制
- 提供友好的权限不足提示和重定向

**改进版本：**

基于 `meta` 的权限路由需要在路由配置中定义权限信息，然后在导航守卫中进行权限验证：

```typescript
// TypeScript 类型定义
interface RouteMeta {
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  title?: string;
  keepAlive?: boolean;
  layout?: string;
}

// 扩展 vue-router 的类型定义
declare module "vue-router" {
  interface RouteMeta extends RouteMeta {}
}

// 用户信息类型
interface User {
  id: string;
  username: string;
  roles: string[];
  permissions: string[];
}
```

```javascript
// 必要的导入语句
import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useRouteStore } from "@/stores/route";
import { useCacheStore } from "@/stores/cache";
import { useUserListStore } from "@/stores/userList";

// 1. 路由配置 - 定义权限信息
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: "/user/:id",
    name: "User",
    component: UserView,
    meta: {
      requiresAuth: true,
      roles: ["user", "admin"],
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      permissions: ["admin:read", "admin:write"],
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/403",
    name: "Forbidden",
    component: ForbiddenView,
  },
];

// 2. 认证状态管理 Store
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    permissions: [],
    roles: [],
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasRole: (state) => (role) => state.roles.includes(role),
    hasPermission: (state) => (permission) =>
      state.permissions.includes(permission),
  },

  actions: {
    setUserInfo(userInfo) {
      this.user = userInfo;
      this.roles = userInfo.roles || [];
      this.permissions = userInfo.permissions || [];
    },

    setToken(token) {
      this.token = token;
    },

    setLoading(loading) {
      this.loading = loading;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.roles = [];
      this.permissions = [];
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
  },
});

// 3. 权限验证工具函数
const authUtils = {
  // 获取用户token
  getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  },

  // 获取用户信息
  async getUserInfo() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch("/api/user/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error("获取用户信息失败:", error);
      return null;
    }
  },

  // 检查用户角色
  hasRole(userRoles, requiredRoles) {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some((role) => userRoles.includes(role));
  },

  // 检查用户权限
  hasPermission(userPermissions, requiredPermissions) {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );
  },
};

// 4. 全局前置守卫 - 权限验证
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 显示加载状态
  authStore.setLoading(true);

  try {
    // 检查是否需要认证
    if (to.meta.requiresAuth) {
      const token = authUtils.getToken();

      // 未登录，重定向到登录页
      if (!token) {
        next({
          path: "/login",
          query: { redirect: to.fullPath }, // 保存原始目标路径
        });
        return;
      }

      // 获取用户信息进行权限验证
      const userInfo = await authUtils.getUserInfo();
      if (!userInfo) {
        // token 无效，清除并重定向到登录页
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
        return;
      }

      // 检查角色权限
      if (to.meta.roles && !authUtils.hasRole(userInfo.roles, to.meta.roles)) {
        next("/403");
        return;
      }

      // 检查具体权限
      if (
        to.meta.permissions &&
        !authUtils.hasPermission(userInfo.permissions, to.meta.permissions)
      ) {
        next("/403");
        return;
      }

      // 权限验证通过，保存用户信息到 store
      authStore.setUserInfo(userInfo);
    }

    next();
  } catch (error) {
    console.error("路由权限验证失败:", error);
    next("/login");
  }
});

// 5. Vue Router 4 推荐语法（返回值方式）
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // 显示加载状态
  authStore.setLoading(true);

  try {
    // 检查是否需要认证
    if (to.meta.requiresAuth) {
      const token = authUtils.getToken();

      // 未登录，返回登录页路由对象
      if (!token) {
        return {
          path: "/login",
          query: { redirect: to.fullPath },
        };
      }

      // 获取用户信息进行权限验证
      const userInfo = await authUtils.getUserInfo();
      if (!userInfo) {
        // token 无效，清除并返回登录页
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        return {
          path: "/login",
          query: { redirect: to.fullPath },
        };
      }

      // 检查角色权限
      if (to.meta.roles && !authUtils.hasRole(userInfo.roles, to.meta.roles)) {
        return "/403"; // 权限不足
      }

      // 检查具体权限
      if (
        to.meta.permissions &&
        !authUtils.hasPermission(userInfo.permissions, to.meta.permissions)
      ) {
        return "/403";
      }

      // 权限验证通过，保存用户信息到 store
      authStore.setUserInfo(userInfo);
    }

    // 返回 true 表示继续导航
    return true;
  } catch (error) {
    console.error("路由权限验证失败:", error);
    return "/login";
  } finally {
    authStore.setLoading(false);
  }
});

// 6. 后置守卫 - 清理加载状态
router.afterEach(() => {
  const authStore = useAuthStore();
  authStore.setLoading(false);
});

// 7. 动态路由权限（可选）
const dynamicRoutes = [
  {
    path: "/dynamic",
    name: "Dynamic",
    component: () => import("@/views/Dynamic.vue"),
    meta: {
      requiresAuth: true,
      dynamic: true, // 标记为动态权限路由
    },
    beforeEnter: async (to, from, next) => {
      // 动态权限检查
      const hasAccess = await checkDynamicPermission(to.params.id);
      if (hasAccess) {
        next();
      } else {
        next("/403");
      }
    },
  },
];
```

**使用场景对比：**

- **基础权限控制**: 简单的登录/未登录状态检查
- **角色权限**: 基于用户角色的页面访问控制
- **功能权限**: 细粒度的功能点权限控制
- **动态权限**: 根据业务逻辑动态计算的权限验证

**记忆要点总结：**

- Meta 配置：requiresAuth、roles、permissions
- 守卫参数：(to, from, next) 或 (to, from)
- 权限验证：token 检查、角色匹配、权限验证
- 错误处理：网络异常、token 过期、权限不足
- 安全原则：前端验证 + 后端验证双重保障

### **解释路由守卫中异步验证的正确使用方式（避免导航闪烁）。**

路由守卫中的异步验证容易导致页面闪烁，需要通过合理的加载状态管理、过渡动画和组件设计来解决用户体验问题。

## 深度分析与补充

**问题本质解读：** 这道题考察异步操作对用户体验的影响和优化策略，面试官想了解你是否掌握如何在保证功能正确性的同时提供流畅的用户体验。

**技术错误纠正：**

- 原答案提到的解决方案过于简单，缺少具体的实现细节
- 需要区分不同类型的异步验证场景和对应的优化策略
- 应该包含错误处理和超时机制

**知识点系统梳理：**

**导航闪烁产生的原因：**

- 异步验证期间页面状态不确定
- 组件在验证完成前就开始渲染
- 缺少合适的加载状态指示
- 验证失败时的突然跳转

**解决方案分类：**

- 全局加载状态管理
- 路由级别的加载控制
- 组件级别的异步处理
- 用户体验优化策略

**改进版本：**

路由守卫中的异步验证容易导致页面闪烁，需要通过合理的加载状态管理和组件设计来解决：

```javascript
// 1. 全局加载状态管理
import { defineStore } from "pinia";

// 使用 Pinia 定义路由状态 store
export const useRouteStore = defineStore("route", {
  state: () => ({
    isRouteLoading: false,
    routeError: null,
  }),
  actions: {
    setRouteLoading(loading) {
      this.isRouteLoading = loading;
    },
    setRouteError(error) {
      this.routeError = error;
    },
  },
});

// 创建 store 实例（在 main.js 中使用）
const routeStore = useRouteStore();

// 2. 路由守卫中的异步验证
router.beforeEach(async (to, from, next) => {
  const routeStore = useRouteStore();

  // 开始加载
  routeStore.setRouteLoading(true);
  routeStore.setRouteError(null);

  try {
    // 异步验证逻辑
    if (to.meta.requiresAuth) {
      const isValid = await validateUserAuth();
      if (!isValid) {
        next("/login");
        return;
      }
    }

    // 数据预取（可选）
    if (to.meta.prefetch) {
      await prefetchRouteData(to);
    }

    next();
  } catch (error) {
    console.error("路由验证失败:", error);
    routeStore.setRouteError(error.message);
    next("/error");
  }
});

// 3. 路由完成后清理加载状态
router.afterEach(() => {
  const routeStore = useRouteStore();
  routeStore.setRouteLoading(false);
});

// 4. 路由错误处理
router.onError((error) => {
  const routeStore = useRouteStore();
  routeStore.setRouteLoading(false);
  routeStore.setRouteError(error.message);
});
```

```vue
<!-- 5. App.vue 中的加载状态处理 -->
<template>
  <div id="app">
    <!-- 全局加载指示器 -->
    <div v-if="isRouteLoading" class="route-loading">
      <div class="loading-spinner"></div>
      <p>页面加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="routeError" class="route-error">
      <p>加载失败: {{ routeError }}</p>
      <button @click="retry">重试</button>
    </div>

    <!-- 路由视图 -->
    <router-view v-else v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <Suspense>
          <template #default>
            <component :is="Component" :key="route.fullPath" />
          </template>
          <template #fallback>
            <div class="component-loading">
              <div class="loading-spinner"></div>
            </div>
          </template>
        </Suspense>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouteStore } from "@/stores/route";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

export default {
  name: "App",
  setup() {
    const routeStore = useRouteStore();
    const router = useRouter();

    // 使用 storeToRefs 保持响应性
    const { isRouteLoading, routeError } = storeToRefs(routeStore);

    const retry = () => {
      routeStore.setRouteError(null);
      router.go(0); // 重新加载当前路由
    };

    return {
      isRouteLoading,
      routeError,
      retry,
    };
  },
};
</script>

<style>
.route-loading,
.route-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

```javascript
// 6. 组件级别的异步验证（避免闪烁）- Options API
export default {
  name: "UserProfile",
  async beforeRouteEnter(to, from, next) {
    try {
      // 预加载数据，避免组件渲染后再加载
      const userData = await fetchUserData(to.params.id);
      next((vm) => {
        vm.userData = userData;
        vm.loading = false;
      });
    } catch (error) {
      next("/error");
    }
  },

  async beforeRouteUpdate(to, from) {
    // 路由参数变化时的处理
    this.loading = true;
    try {
      this.userData = await fetchUserData(to.params.id);
    } catch (error) {
      this.$router.push("/error");
    } finally {
      this.loading = false;
    }
  },

  data() {
    return {
      userData: null,
      loading: true,
    };
  },
};
```

```vue
<!-- 7. Composition API 版本（推荐） -->
<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="userData">
    <UserProfileContent :user="userData" />
  </div>
  <div v-else>用户不存在</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

const route = useRoute();
const router = useRouter();

const userData = ref(null);
const loading = ref(true);

// 加载用户数据
const loadUserData = async (userId) => {
  loading.value = true;
  try {
    userData.value = await fetchUserData(userId);
  } catch (error) {
    console.error("加载用户数据失败:", error);
    router.push("/error");
  } finally {
    loading.value = false;
  }
};

// 路由参数变化时重新加载数据
onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    await loadUserData(to.params.id);
  }
});

// 初始加载
loadUserData(route.params.id);
</script>
```

**使用场景对比：**

- **全局加载状态**: 适用于需要统一管理的应用级加载状态
- **路由级加载**: 适用于特定路由的异步验证和数据预取
- **组件级加载**: 适用于组件内部的异步操作和状态管理
- **Suspense 组件**: 适用于异步组件的加载状态处理

**记忆要点总结：**

- 加载状态：全局状态管理，统一控制
- 过渡动画：transition + mode="out-in"
- 异步组件：Suspense + fallback 模板
- 错误处理：try-catch + 重试机制
- 用户体验：骨架屏、进度条、平滑过渡

### **如何在路由导航时实现数据预取（prefetch）？**

通过 `beforeRouteEnter` 导航守卫在进入路由组件之前预取数据，可以在 `next` 回调中将数据传递给组件实例，提升用户体验。

## 深度分析与补充

**问题本质解读：** 这道题考察数据预取策略和性能优化技术，面试官想了解你是否掌握如何在路由切换过程中提前加载数据，减少用户等待时间。

**技术错误纠正：**

- 原答案描述过于简单，缺少具体的实现细节和错误处理
- 需要补充多种数据预取的实现方式和适用场景
- 应该包含缓存策略和性能优化考虑

**知识点系统梳理：**

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
import { useRoute, onBeforeRouteUpdate } from "vue-router";

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
import { useRoute, useRouter } from "vue-router";

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

**记忆要点总结：**

- 组件守卫：beforeRouteEnter、beforeRouteUpdate
- 全局守卫：beforeResolve + meta 配置
- 数据传递：next(vm => vm.data = data)
- 并行加载：Promise.all([fetch1, fetch2])
- 缓存优化：TTL、去重、清理机制

### **解释 `history` 模式的差异（HTML5 history vs hash vs Web History）以及服务端配置注意点。**

Vue Router 4 提供了三种历史模式：HTML5 History 模式（createWebHistory）、Hash 模式（createWebHashHistory）和 Memory 模式（createMemoryHistory），每种都有不同的特点和适用场景。

## 深度分析与补充

**问题本质解读：** 这道题考察前端路由的底层实现原理和部署配置，面试官想了解你是否掌握不同路由模式的技术特点、适用场景和服务端配置要求。

**技术错误纠正：**

- 原答案过于简单，缺少对不同模式的详细对比和分析
- 需要补充服务端配置的具体实现和注意事项
- 应该包含实际项目中的部署考虑和最佳实践

**知识点系统梳理：**

**三种历史模式对比：**

- **HTML5 History**: 使用 pushState/replaceState API，URL 美观，需要服务端配置
- **Hash 模式**: 使用 URL hash，兼容性好，无需服务端配置
- **Memory 模式**: 内存中管理历史记录，主要用于 SSR 和测试

**服务端配置要求：**

- HTML5 History 模式需要服务器支持 fallback 到 index.html
- 需要正确处理 API 路由和静态资源
- 考虑 SEO、缓存和安全性配置

**改进版本：**

Vue Router 4 提供了三种历史模式，每种都有不同的特点和适用场景：

```javascript
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  createMemoryHistory,
} from "vue-router";

// 1. HTML5 History 模式（推荐用于生产环境）
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 2. Hash 模式（兼容性最好）
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 3. Memory 模式（用于 SSR 或测试环境）
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
```

**各模式详细对比：**

| 特性         | HTML5 History | Hash          | Memory |
| ------------ | ------------- | ------------- | ------ |
| URL 格式     | `/user/123`   | `/#/user/123` | 内存中 |
| SEO 友好     | ✅            | ❌            | ❌     |
| 服务器配置   | 需要          | 不需要        | 不适用 |
| 浏览器兼容性 | IE10+         | 所有浏览器    | 不适用 |
| 原生分享     | ✅            | ⚠️            | ❌     |

**服务端配置示例：**

```nginx
# Nginx 配置
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;

    # HTML5 History 模式配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 路由不受影响
    location /api {
        proxy_pass http://backend;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```apache
# Apache 配置 (.htaccess)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # 处理 SPA 路由
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

```javascript
// Express.js 服务器配置
const express = require("express");
const path = require("path");
const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, "dist")));

// API 路由
app.use("/api", apiRouter);

// SPA 路由回退
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(3000);
```

```yaml
# Docker + Nginx 配置
version: "3"
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
```

**开发环境 vs 生产环境配置：**

```javascript
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === "production" ? "/my-app/" : "/",
  server: {
    historyApiFallback: true, // 开发环境支持 History 模式
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});

// router/index.js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
```

**常见问题和解决方案：**

```javascript
// 1. 子路径部署配置
const router = createRouter({
  history: createWebHistory("/my-app/"), // 部署在子路径
  routes,
});

// 2. 动态 base URL
const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "/";
  }
  return window.location.pathname.split("/").slice(0, -1).join("/") + "/";
};

const router = createRouter({
  history: createWebHistory(getBaseURL()),
  routes,
});

// 3. 条件性使用不同模式
const createAppRouter = () => {
  const isElectron = window.navigator.userAgent.includes("Electron");
  const isFile = window.location.protocol === "file:";

  if (isElectron || isFile) {
    // Electron 或本地文件使用 Hash 模式
    return createRouter({
      history: createWebHashHistory(),
      routes,
    });
  } else {
    // Web 环境使用 History 模式
    return createRouter({
      history: createWebHistory(),
      routes,
    });
  }
};
```

**实际项目注意事项：**

1. **子路径部署**：正确配置 base URL 避免资源加载失败
2. **API 路由优先级**：确保 API 路由在 SPA 回退规则之前处理
3. **静态资源处理**：正确配置静态资源的缓存和压缩
4. **错误页面**：配置适当的 404 和 500 错误页面处理

**使用场景对比：**

- **HTML5 History**: 生产环境推荐，SEO 友好，需要服务端配置
- **Hash 模式**: 兼容性要求高的项目，无需服务端配置
- **Memory 模式**: SSR、测试环境、Electron 应用

**记忆要点总结：**

- 三种模式：createWebHistory、createWebHashHistory、createMemoryHistory
- URL 格式：/user/123 vs /#/user/123 vs 内存中
- 服务端配置：try_files $uri $uri/ /index.html
- 部署考虑：base URL、API 路由、静态资源
- 选择原则：SEO 需求、兼容性要求、部署环境

### **如何缓存路由组件（keep-alive）并控制哪些路由被缓存？**

Vue 3 中使用 `<KeepAlive>` 组件缓存路由组件，可以通过 `include`、`exclude` 属性或路由 `meta` 配置精确控制缓存策略。

## 深度分析与补充

**问题本质解读：** 这道题考察组件缓存机制和性能优化策略，面试官想了解你是否掌握如何合理使用缓存提升用户体验，同时避免内存泄漏等问题。

**技术错误纠正：**

- 原答案过于简单，缺少具体的实现方式和控制策略
- 需要补充缓存的生命周期管理和状态保存
- 应该包含缓存策略的最佳实践和注意事项

**知识点系统梳理：**

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
import { useRoute } from "vue-router";
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

checkDataFreshness = () => {
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

**记忆要点总结：**

- 基础用法：`<KeepAlive><router-view /></KeepAlive>`
- 控制属性：include、exclude、max
- 生命周期：activated、deactivated
- 动态控制：基于 route.meta 或 store 状态
- 最佳实践：合理选择、内存管理、状态保存

### **路由重定向和导航守卫中如何传递原始目标（用于登录后回跳）？**

通过 query 参数或 sessionStorage 存储原始目标路径，在登录成功后读取并跳转到目标页面，需要注意安全性验证和数据清理。

## 深度分析与补充

**问题本质解读：** 这道题考察用户认证流程中的路由状态管理，面试官想了解你是否掌握如何在保证安全性的前提下提供良好的用户体验。

**技术错误纠正：**

- 不建议将敏感信息存储在 meta 中，应该使用更安全的方式
- 需要对重定向路径进行安全性验证，防止开放重定向攻击
- 应该包含数据过期和清理机制

**知识点系统梳理：**

**重定向信息传递方式：**

- Query 参数：简单直接，但有长度限制和安全考虑
- SessionStorage：支持复杂数据，会话级别存储
- LocalStorage：持久化存储，需要手动清理
- 状态管理：集中管理，便于复杂场景处理

**安全性考虑：**

- 防止开放重定向攻击
- 验证重定向路径的合法性
- 设置合理的过期时间
- 清理敏感信息

**改进版本：**

在路由重定向和导航守卫中传递原始目标路径，实现登录后回跳功能有多种实现方式：

```javascript
// 1. 通过 query 参数传递原始目标
router.beforeEach((to, from, next) => {
  const token = getToken()

  if (to.meta.requiresAuth && !token) {
    // 将原始目标路径作为 query 参数传递
    next({
      path: '/login',
      query: {
        redirect: to.fullPath,
        // 可以传递额外的上下文信息
        from: from.fullPath
      }
    })
  } else {
    next()
  }
})

// 2. 登录组件中处理回跳
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },

  methods: {
    async handleLogin() {
      try {
        await this.login(this.username, this.password)

        // 获取原始目标路径
        const redirect = this.$route.query.redirect || '/'

        // 验证重定向路径的安全性
        const safeRedirect = this.validateRedirectPath(redirect)

        // 跳转到原始目标或默认页面
        this.$router.push(safeRedirect)
      } catch (error) {
        this.handleLoginError(error)
      }
    },

    // 验证重定向路径安全性
    validateRedirectPath(path) {
      // 防止开放重定向攻击
      if (!path || path.startsWith('http') || path.startsWith('//')) {
        return '/'
      }

      // 检查路径是否在允许的路由中
      const allowedPaths = this.$router.getRoutes().map(route => route.path)
      const pathWithoutQuery = path.split('?')[0]

      if (allowedPaths.some(allowedPath => {
        // 支持动态路由匹配
        const regex = new RegExp('^' + allowedPath.replace(/:\w+/g, '[^/]+') + '$')
        return regex.test(pathWithoutQuery)
      })) {
        return path
      }

      return '/'
    }
  }
}

// 3. 使用 sessionStorage 存储复杂的重定向信息
class RedirectManager {
  constructor() {
    this.storageKey = 'vue_router_redirect'
  }

  // 保存重定向信息
  saveRedirect(to, from, context = {}) {
    const redirectInfo = {
      to: {
        path: to.path,
        fullPath: to.fullPath,
        params: to.params,
        query: to.query,
        meta: to.meta
      },
      from: {
        path: from.path,
        fullPath: from.fullPath
      },
      context,
      timestamp: Date.now()
    }

    sessionStorage.setItem(this.storageKey, JSON.stringify(redirectInfo))
  }

  // 获取重定向信息
  getRedirect() {
    try {
      const stored = sessionStorage.getItem(this.storageKey)
      if (!stored) return null

      const redirectInfo = JSON.parse(stored)

      // 检查是否过期（30分钟）
      if (Date.now() - redirectInfo.timestamp > 30 * 60 * 1000) {
        this.clearRedirect()
        return null
      }

      return redirectInfo
    } catch (error) {
      console.error('获取重定向信息失败:', error)
      this.clearRedirect()
      return null
    }
  }

  // 清除重定向信息
  clearRedirect() {
    sessionStorage.removeItem(this.storageKey)
  }

  // 执行重定向
  executeRedirect(router, fallback = '/') {
    const redirectInfo = this.getRedirect()

    if (redirectInfo && redirectInfo.to) {
      this.clearRedirect()

      // 重建路由对象
      const targetRoute = {
        path: redirectInfo.to.path,
        query: redirectInfo.to.query,
        params: redirectInfo.to.params
      }

      return router.push(targetRoute)
    }

    return router.push(fallback)
  }
}

// 全局实例
const redirectManager = new RedirectManager()

// 4. 在路由守卫中使用 RedirectManager
router.beforeEach((to, from, next) => {
  const token = getToken()

  if (to.meta.requiresAuth && !token) {
    // 保存完整的重定向信息
    redirectManager.saveRedirect(to, from, {
      reason: 'authentication_required',
      userAgent: navigator.userAgent
    })

    next('/login')
  } else {
    next()
  }
})

// 5. 登录成功后的处理
export default {
  name: 'Login',
  methods: {
    async handleLogin() {
      try {
        const result = await this.login(this.username, this.password)

        // 执行重定向
        await redirectManager.executeRedirect(this.$router, '/dashboard')

        // 显示成功消息
        this.$message.success('登录成功')
      } catch (error) {
        this.handleLoginError(error)
      }
    }
  }
}

// 6. 高级场景：多步骤流程中的重定向
class MultiStepRedirectManager extends RedirectManager {
  constructor() {
    super()
    this.stepStorageKey = 'vue_router_multi_step'
  }

  // 保存多步骤流程信息
  saveMultiStepFlow(steps, currentStep = 0, originalTarget = null) {
    const flowInfo = {
      steps,
      currentStep,
      originalTarget,
      timestamp: Date.now()
    }

    sessionStorage.setItem(this.stepStorageKey, JSON.stringify(flowInfo))
  }

  // 获取当前步骤
  getCurrentStep() {
    try {
      const stored = sessionStorage.getItem(this.stepStorageKey)
      if (!stored) return null

      return JSON.parse(stored)
    } catch (error) {
      return null
    }
  }

  // 进入下一步
  nextStep(router) {
    const flowInfo = this.getCurrentStep()
    if (!flowInfo) return false

    const nextStepIndex = flowInfo.currentStep + 1

    if (nextStepIndex < flowInfo.steps.length) {
      flowInfo.currentStep = nextStepIndex
      sessionStorage.setItem(this.stepStorageKey, JSON.stringify(flowInfo))

      const nextStep = flowInfo.steps[nextStepIndex]
      router.push(nextStep.path)
      return true
    } else {
      // 流程完成，跳转到原始目标
      sessionStorage.removeItem(this.stepStorageKey)

      if (flowInfo.originalTarget) {
        router.push(flowInfo.originalTarget)
      } else {
        this.executeRedirect(router)
      }
      return true
    }
  }
}

// 7. 使用示例：需要完善个人信息才能访问某些页面
router.beforeEach(async (to, from, next) => {
  const token = getToken()

  if (!token) {
    redirectManager.saveRedirect(to, from)
    next('/login')
    return
  }

  // 检查是否需要完善个人信息
  if (to.meta.requiresCompleteProfile) {
    const userProfile = await getUserProfile()

    if (!userProfile.isComplete) {
      const multiStepManager = new MultiStepRedirectManager()
      multiStepManager.saveMultiStepFlow([
        { path: '/profile/basic', name: '基本信息' },
        { path: '/profile/contact', name: '联系方式' },
        { path: '/profile/preferences', name: '偏好设置' }
      ], 0, to.fullPath)

      next('/profile/basic')
      return
    }
  }

  next()
})
```

**使用场景对比：**

- **Query 参数**: 简单场景，路径较短，便于调试
- **SessionStorage**: 复杂数据，会话级别，安全性较好
- **状态管理**: 复杂流程，多步骤操作，集中管理
- **多步骤流程**: 需要完善信息才能访问的场景

**记忆要点总结：**

- 保存方式：query 参数、sessionStorage、状态管理
- 安全验证：路径合法性、防开放重定向
- 数据管理：过期时间、清理机制
- 用户体验：流程指示、错误处理
- 最佳实践：简单用 query，复杂用 storage

### **如何处理多个并发导航（重复点击）导致的导航取消错误？**

通过防抖函数、导航状态管理、错误分类处理等多种方式来解决并发导航问题，确保用户体验的流畅性。

## 深度分析与补充

**问题本质解读：** 这道题考察并发控制和错误处理机制，面试官想了解你是否掌握如何在复杂的用户交互场景下保证应用的稳定性和用户体验。

**技术错误纠正：**

- 原答案中的解决方案不够全面，缺少具体的实现细节
- 需要区分不同类型的导航错误和对应的处理策略
- 应该包含超时机制和错误恢复策略

**知识点系统梳理：**

**并发导航问题的根源：**

- 用户快速重复点击导航按钮
- 异步验证期间的重复导航请求
- 网络延迟导致的导航堆积
- 组件销毁时的导航冲突

**解决方案分类：**

- 防抖和节流：限制导航频率
- 状态管理：跟踪导航状态
- 错误分类：区分不同错误类型
- 队列管理：有序处理导航请求

**改进版本：**

处理多个并发导航和重复点击导致的导航取消错误需要从多个层面来解决：

```javascript
// 1. 使用防抖函数限制导航频率
import { debounce } from 'lodash-es'

// 创建防抖的导航函数
const debouncedPush = debounce((router, location) => {
  router.push(location).catch(err => {
    // 忽略导航重复错误
    if (err.name !== 'NavigationDuplicated') {
      console.error('导航错误:', err)
    }
  })
}, 300)

// 在组件中使用
export default {
  methods: {
    navigateToUser(userId) {
      debouncedPush(this.$router, `/user/${userId}`)
    }
  }
}

// 2. 全局导航状态管理
class NavigationManager {
  constructor() {
    this.pendingNavigation = null
    this.isNavigating = false
  }

  async navigate(router, location, options = {}) {
    const { force = false, timeout = 5000 } = options

    // 如果正在导航且不是强制导航，则忽略
    if (this.isNavigating && !force) {
      console.warn('导航正在进行中，忽略重复请求')
      return Promise.resolve()
    }

    // 取消之前的导航
    if (this.pendingNavigation) {
      this.pendingNavigation.abort()
    }

    // 创建可取消的导航
    const abortController = new AbortController()
    this.pendingNavigation = abortController
    this.isNavigating = true

    try {
      // 设置超时
      const timeoutId = setTimeout(() => {
        abortController.abort()
      }, timeout)

      const result = await router.push(location)

      clearTimeout(timeoutId)

      // 检查是否被取消
      if (abortController.signal.aborted) {
        throw new Error('Navigation was aborted')
      }

      return result
    } catch (error) {
      // 处理各种导航错误
      if (error.name === 'NavigationDuplicated') {
        console.warn('重复导航被忽略')
        return Promise.resolve()
      } else if (error.name === 'NavigationCancelled') {
        console.warn('导航被取消')
        return Promise.resolve()
      } else if (error.message === 'Navigation was aborted') {
        console.warn('导航被中止')
        return Promise.resolve()
      } else {
        console.error('导航失败:', error)
        throw error
      }
    } finally {
      this.isNavigating = false
      this.pendingNavigation = null
    }
  }

  // 取消当前导航
  cancelNavigation() {
    if (this.pendingNavigation) {
      this.pendingNavigation.abort()
    }
  }

  // 检查是否正在导航
  isNavigationPending() {
    return this.isNavigating
  }
}

// 全局导航管理器实例
const navigationManager = new NavigationManager()

// 3. 路由守卫中的并发控制
let currentNavigation = null

router.beforeEach(async (to, from, next) => {
  // 如果有正在进行的导航，取消它
  if (currentNavigation) {
    currentNavigation.cancel()
  }

  // 创建新的导航上下文
  currentNavigation = {
    id: Date.now(),
    cancelled: false,
    cancel() {
      this.cancelled = true
    }
  }

  const navigation = currentNavigation

  try {
    // 执行异步验证
    if (to.meta.requiresAuth) {
      const isValid = await validateAuth()

      // 检查导航是否被取消
      if (navigation.cancelled) {
        return // 不调用 next()，导航被取消
      }

      if (!isValid) {
        next('/login')
        return
      }
    }

    // 检查导航是否被取消
    if (navigation.cancelled) {
      return
    }

    next()
  } catch (error) {
    if (!navigation.cancelled) {
      console.error('导航验证失败:', error)
      next('/error')
    }
  } finally {
    // 清理当前导航
    if (currentNavigation === navigation) {
      currentNavigation = null
    }
  }
})

// 4. 组件级别的导航控制
export default {
  name: 'UserList',
  data() {
    return {
      isNavigating: false,
      lastNavigationTime: 0
    }
  },

  methods: {
    async navigateToUser(userId) {
      // 防止快速重复点击
      const now = Date.now()
      if (now - this.lastNavigationTime < 500) {
        return
      }
      this.lastNavigationTime = now

      // 防止重复导航
      if (this.isNavigating) {
        return
      }

      this.isNavigating = true

      try {
        await navigationManager.navigate(this.$router, `/user/${userId}`)
      } catch (error) {
        this.$message.error('导航失败，请重试')
      } finally {
        this.isNavigating = false
      }
    },

    // 批量导航处理
    async handleBatchNavigation(items) {
      for (const item of items) {
        if (navigationManager.isNavigationPending()) {
          break // 如果有导航正在进行，停止批量处理
        }

        try {
          await this.navigateToUser(item.id)
          await new Promise(resolve => setTimeout(resolve, 100)) // 短暂延迟
        } catch (error) {
          console.error(`导航到用户 ${item.id} 失败:`, error)
        }
      }
    }
  },

  // 组件销毁时取消导航
  beforeUnmount() {
    navigationManager.cancelNavigation()
  }
}

// 5. 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)

  // 根据错误类型进行不同处理
  if (error.name === 'ChunkLoadError') {
    // 代码分割加载失败，刷新页面
    window.location.reload()
  } else if (error.name === 'NavigationDuplicated') {
    // 忽略重复导航错误
    return
  } else {
    // 其他错误，显示错误提示
    // 这里可以集成全局错误处理系统
    console.error('未处理的路由错误:', error)
  }
})

// 6. 高级场景：路由队列管理
class NavigationQueue {
  constructor(router) {
    this.router = router
    this.queue = []
    this.isProcessing = false
  }

  // 添加导航到队列
  enqueue(location, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        location,
        options,
        resolve,
        reject,
        timestamp: Date.now()
      })

      this.processQueue()
    })
  }

  // 处理队列
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.queue.length > 0) {
      const navigation = this.queue.shift()

      // 检查导航是否过期（5秒）
      if (Date.now() - navigation.timestamp > 5000) {
        navigation.reject(new Error('Navigation timeout'))
        continue
      }

      try {
        const result = await this.router.push(navigation.location)
        navigation.resolve(result)

        // 导航间隔
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        navigation.reject(error)
      }
    }

    this.isProcessing = false
  }

  // 清空队列
  clear() {
    this.queue.forEach(navigation => {
      navigation.reject(new Error('Navigation queue cleared'))
    })
    this.queue = []
  }
}

// 使用导航队列
const navigationQueue = new NavigationQueue(router)

// 在组件中使用
export default {
  methods: {
    async navigateWithQueue(location) {
      try {
        await navigationQueue.enqueue(location)
      } catch (error) {
        console.error('队列导航失败:', error)
      }
    }
  }
}
```

**使用场景对比：**

- **防抖函数**: 适用于用户快速点击的场景
- **状态管理**: 适用于复杂的导航状态控制
- **错误分类**: 适用于需要精细化错误处理的场景
- **队列管理**: 适用于需要有序处理导航的场景

**记忆要点总结：**

- 防抖控制：debounce + 时间间隔限制
- 状态管理：isNavigating 标志位
- 错误处理：NavigationDuplicated、NavigationCancelled
- 超时机制：AbortController + setTimeout
- 用户体验：加载状态、错误提示、重试机制

### **如何实现路由级别的滚动恢复（back/forward）？**

Vue Router 提供了内置的 `scrollBehavior` 配置，结合自定义的滚动位置管理可以实现完善的滚动恢复功能。

## 深度分析与补充

**问题本质解读：** 这道题考察用户体验优化中的滚动行为管理，面试官想了解你是否掌握如何在路由切换时保持良好的浏览体验。

**技术错误纠正：**

- 原答案描述不够准确，Vue Router 有内置的 scrollBehavior 支持
- 不需要手动修改 scrollBehavior 配置，应该利用其回调机制
- 需要考虑异步组件加载和渲染时机

**知识点系统梳理：**

**滚动恢复的实现层次：**

- 浏览器原生：history.scrollRestoration
- Vue Router：scrollBehavior 配置
- 自定义管理：位置缓存和恢复逻辑
- 组件级别：activated/deactivated 钩子

**滚动恢复的挑战：**

- 异步组件加载时机
- 动态内容高度变化
- 锚点定位和偏移计算
- 缓存过期和清理机制

**改进版本：**

Vue Router 提供了内置的滚动行为控制功能，可以实现路由级别的滚动恢复：

```javascript
// 1. 基础滚动行为配置
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退）
    if (savedPosition) {
      return savedPosition;
    }

    // 如果有锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }

    // 默认滚动到顶部
    return { top: 0 };
  },
});

// 2. 高级滚动行为控制
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      // 等待页面渲染完成后再滚动
      setTimeout(() => {
        if (savedPosition) {
          // 浏览器前进/后退时恢复位置
          resolve(savedPosition);
        } else if (to.hash) {
          // 锚点滚动
          const element = document.querySelector(to.hash);
          if (element) {
            resolve({
              el: to.hash,
              behavior: "smooth",
              // 偏移量，考虑固定头部
              top: element.offsetTop - 80,
            });
          } else {
            resolve({ top: 0 });
          }
        } else if (to.meta.scrollToTop !== false) {
          // 默认滚动到顶部（除非路由配置了不滚动）
          resolve({ top: 0 });
        } else {
          // 保持当前位置
          resolve(false);
        }
      }, 300); // 等待过渡动画完成
    });
  },
});

// 3. 自定义滚动位置管理
class ScrollPositionManager {
  constructor() {
    this.positions = new Map();
    this.storageKey = "vue_router_scroll_positions";
    this.loadFromStorage();
  }

  // 保存滚动位置
  savePosition(routeKey, position) {
    this.positions.set(routeKey, {
      ...position,
      timestamp: Date.now(),
    });
    this.saveToStorage();
  }

  // 获取滚动位置
  getPosition(routeKey) {
    const position = this.positions.get(routeKey);

    // 检查是否过期（30分钟）
    if (position && Date.now() - position.timestamp > 30 * 60 * 1000) {
      this.positions.delete(routeKey);
      this.saveToStorage();
      return null;
    }

    return position;
  }

  // 生成路由唯一键
  generateRouteKey(route) {
    // 对于列表页面，可能需要包含查询参数
    if (route.meta.includeQueryInScrollKey) {
      return `${route.path}?${new URLSearchParams(route.query).toString()}`;
    }
    return route.path;
  }

  // 保存到本地存储
  saveToStorage() {
    try {
      const data = Array.from(this.positions.entries());
      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("保存滚动位置失败:", error);
    }
  }

  // 从本地存储加载
  loadFromStorage() {
    try {
      const data = sessionStorage.getItem(this.storageKey);
      if (data) {
        const entries = JSON.parse(data);
        this.positions = new Map(entries);
      }
    } catch (error) {
      console.error("加载滚动位置失败:", error);
      this.positions = new Map();
    }
  }

  // 清理过期数据
  cleanup() {
    const now = Date.now();
    for (const [key, position] of this.positions.entries()) {
      if (now - position.timestamp > 30 * 60 * 1000) {
        this.positions.delete(key);
      }
    }
    this.saveToStorage();
  }
}

const scrollManager = new ScrollPositionManager();

// 4. 在路由守卫中保存滚动位置
router.beforeEach((to, from, next) => {
  // 保存当前页面的滚动位置
  if (from.name) {
    const routeKey = scrollManager.generateRouteKey(from);
    const scrollPosition = {
      top: window.pageYOffset || document.documentElement.scrollTop,
      left: window.pageXOffset || document.documentElement.scrollLeft,
    };
    scrollManager.savePosition(routeKey, scrollPosition);
  }

  next();
});

// 5. 增强的滚动行为
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      // 等待路由组件加载完成
      this.app.$nextTick(() => {
        setTimeout(() => {
          let scrollTarget = { top: 0 };

          // 1. 优先使用浏览器保存的位置
          if (savedPosition) {
            scrollTarget = savedPosition;
          }
          // 2. 检查自定义保存的位置
          else {
            const routeKey = scrollManager.generateRouteKey(to);
            const customPosition = scrollManager.getPosition(routeKey);

            if (customPosition) {
              scrollTarget = {
                top: customPosition.top,
                left: customPosition.left,
              };
            }
            // 3. 处理锚点
            else if (to.hash) {
              const element = document.querySelector(to.hash);
              if (element) {
                const headerHeight =
                  document.querySelector(".header")?.offsetHeight || 0;
                scrollTarget = {
                  el: to.hash,
                  behavior: "smooth",
                  top: element.offsetTop - headerHeight - 20,
                };
              }
            }
            // 4. 根据路由配置决定是否滚动到顶部
            else if (to.meta.scrollToTop !== false) {
              scrollTarget = { top: 0 };
            }
            // 5. 保持当前位置
            else {
              scrollTarget = false;
            }
          }

          resolve(scrollTarget);
        }, to.meta.scrollDelay || 100);
      });
    });
  },
});

// 6. 组件内的滚动控制
export default {
  name: "ProductList",
  data() {
    return {
      products: [],
      loading: false,
    };
  },

  async created() {
    await this.loadProducts();
  },

  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        this.products = await fetchProducts();
      } finally {
        this.loading = false;
      }
    },

    // 手动保存滚动位置
    saveScrollPosition() {
      const routeKey = scrollManager.generateRouteKey(this.$route);
      const position = {
        top: window.pageYOffset,
        left: window.pageXOffset,
      };
      scrollManager.savePosition(routeKey, position);
    },

    // 恢复滚动位置
    restoreScrollPosition() {
      const routeKey = scrollManager.generateRouteKey(this.$route);
      const position = scrollManager.getPosition(routeKey);

      if (position) {
        this.$nextTick(() => {
          window.scrollTo({
            top: position.top,
            left: position.left,
            behavior: "smooth",
          });
        });
      }
    },
  },

  // 组件激活时恢复滚动位置（用于 keep-alive）
  activated() {
    this.restoreScrollPosition();
  },

  // 组件失活时保存滚动位置
  deactivated() {
    this.saveScrollPosition();
  },

  // 组件销毁前保存滚动位置
  beforeUnmount() {
    this.saveScrollPosition();
  },
};

// 7. 路由配置示例
const routes = [
  {
    path: "/products",
    name: "ProductList",
    component: ProductList,
    meta: {
      scrollToTop: true, // 进入时滚动到顶部
      includeQueryInScrollKey: true, // 查询参数变化时重新计算滚动位置
      scrollDelay: 200, // 滚动延迟
    },
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    meta: {
      scrollToTop: true,
    },
  },
  {
    path: "/user/profile",
    name: "UserProfile",
    component: UserProfile,
    meta: {
      scrollToTop: false, // 保持当前滚动位置
      keepScrollPosition: true,
    },
  },
];
```

**使用场景对比：**

- **浏览器前进/后退**: 使用 savedPosition 参数恢复位置
- **锚点导航**: 使用 to.hash 进行锚点定位
- **列表页面**: 缓存滚动位置，保持用户浏览状态
- **详情页面**: 通常滚动到顶部，提供清晰的阅读体验

**记忆要点总结：**

- 配置方式：router 的 scrollBehavior 选项
- 参数类型：(to, from, savedPosition)
- 返回值：{ top, left } 或 Promise
- 锚点处理：to.hash + 偏移计算
- 缓存策略：sessionStorage + TTL 机制

### **Vue Router 中如何处理动态匹配优先级？例如 `/user/:id` 与 `/user/profile` 的匹配顺序。**

Vue Router 的路由匹配遵循定义顺序，静态路由应该放在动态路由之前，可以通过正则表达式和路由守卫进一步控制匹配精度。

## 深度分析与补充

**问题本质解读：** 这道题考察路由匹配算法和优先级控制，面试官想了解你是否掌握如何设计合理的路由结构，避免匹配冲突和歧义。

**技术错误纠正：**

- 原答案过于简单，缺少具体的实现方式和最佳实践
- 需要强调路由定义顺序的重要性
- 应该包含正则表达式的具体用法和参数验证

**知识点系统梳理：**

**路由匹配原理：**

- Vue Router 按照路由定义的顺序进行匹配
- 第一个匹配成功的路由会被选中
- 静态路由优先级高于动态路由
- 可以通过正则表达式精确控制匹配规则

**优先级控制策略：**

- 定义顺序：静态路由在前，动态路由在后
- 正则约束：限制参数格式和范围
- 路由守卫：动态验证和重定向
- 参数验证：确保参数的有效性

**改进版本：**

Vue Router 中的路由匹配遵循定义顺序，但可以通过多种方式控制动态路由的匹配优先级：

```javascript
// 1. 路由定义顺序控制优先级（最重要的原则）
const routes = [
  // 静态路由优先级最高，应该放在前面
  {
    path: "/user/profile",
    name: "UserProfile",
    component: UserProfile,
  },
  {
    path: "/user/settings",
    name: "UserSettings",
    component: UserSettings,
  },
  {
    path: "/user/create",
    name: "CreateUser",
    component: CreateUser,
  },
  // 动态路由放在后面
  {
    path: "/user/:id",
    name: "UserDetail",
    component: UserDetail,
    // 可以添加参数验证
    beforeEnter: (to, from, next) => {
      // 验证 id 是否为数字
      if (!/^\d+$/.test(to.params.id)) {
        next("/404");
        return;
      }
      next();
    },
  },
];

// 2. 使用正则表达式精确控制匹配
const routes = [
  {
    path: "/user/profile",
    name: "UserProfile",
    component: UserProfile,
  },
  // 只匹配数字 ID
  {
    path: "/user/:id(\\d+)",
    name: "UserDetail",
    component: UserDetail,
  },
  // 匹配字符串 slug
  {
    path: "/user/:slug([a-zA-Z0-9-_]+)",
    name: "UserBySlug",
    component: UserBySlug,
  },
  // 捕获所有其他情况
  {
    path: "/user/:pathMatch(.*)*",
    name: "UserNotFound",
    component: NotFound,
  },
];

// 3. 高级路由匹配策略
const routes = [
  // 精确匹配特定路径
  {
    path: "/api/user/profile",
    name: "ApiUserProfile",
    component: ApiUserProfile,
  },
  // 匹配 UUID 格式
  {
    path: "/user/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})",
    name: "UserByUUID",
    component: UserDetail,
  },
  // 匹配数字 ID（1-9999999）
  {
    path: "/user/:id(\\d{1,7})",
    name: "UserById",
    component: UserDetail,
  },
  // 匹配用户名格式（字母开头，包含字母数字下划线）
  {
    path: "/user/:username([a-zA-Z][a-zA-Z0-9_]*)",
    name: "UserByUsername",
    component: UserProfile,
  },
];

// 4. 动态路由优先级管理器
class RoutePriorityManager {
  constructor(router) {
    this.router = router;
    this.dynamicRoutes = new Map();
  }

  // 注册动态路由及其优先级
  registerDynamicRoute(pattern, priority, handler) {
    this.dynamicRoutes.set(pattern, {
      priority,
      handler,
      regex: this.patternToRegex(pattern),
    });
  }

  // 将路径模式转换为正则表达式
  patternToRegex(pattern) {
    return new RegExp("^" + pattern.replace(/:\w+/g, "([^/]+)") + "$");
  }

  // 根据优先级匹配路由
  matchRoute(path) {
    const matches = [];

    for (const [pattern, config] of this.dynamicRoutes) {
      const match = path.match(config.regex);
      if (match) {
        matches.push({
          pattern,
          config,
          params: match.slice(1),
        });
      }
    }

    // 按优先级排序
    matches.sort((a, b) => b.config.priority - a.config.priority);

    return matches[0] || null;
  }
}

// 使用示例
const priorityManager = new RoutePriorityManager(router);

// 注册不同优先级的路由处理
priorityManager.registerDynamicRoute("/user/:id", 100, (params) => {
  if (/^\d+$/.test(params[0])) {
    return { name: "UserById", params: { id: params[0] } };
  }
  return null;
});

priorityManager.registerDynamicRoute("/user/:username", 50, (params) => {
  if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(params[0])) {
    return { name: "UserByUsername", params: { username: params[0] } };
  }
  return null;
});

// 5. 路由守卫中的动态匹配处理
router.beforeEach((to, from, next) => {
  // 处理用户路由的特殊逻辑
  if (to.path.startsWith("/user/") && to.name === "UserDetail") {
    const userId = to.params.id;

    // 根据 ID 类型进行不同处理
    if (/^\d+$/.test(userId)) {
      // 数字 ID，检查用户是否存在
      checkUserExists(userId).then((exists) => {
        if (exists) {
          next();
        } else {
          next("/404");
        }
      });
    } else if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(userId)) {
      // 用户名格式，重定向到用户名路由
      next({
        name: "UserByUsername",
        params: { username: userId },
      });
    } else {
      // 无效格式
      next("/404");
    }
  } else {
    next();
  }
});

// 6. 复杂的嵌套路由优先级
const routes = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      // 静态路由优先
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
      },
      {
        path: "users",
        name: "AdminUsers",
        component: AdminUsers,
      },
      // 动态路由
      {
        path: "user/:id(\\d+)",
        name: "AdminUserDetail",
        component: AdminUserDetail,
      },
      // 捕获所有
      {
        path: ":pathMatch(.*)*",
        name: "AdminNotFound",
        component: AdminNotFound,
      },
    ],
  },
  {
    path: "/user",
    component: UserLayout,
    children: [
      {
        path: "",
        name: "UserIndex",
        component: UserIndex,
      },
      {
        path: "profile",
        name: "UserProfile",
        component: UserProfile,
      },
      {
        path: ":id(\\d+)",
        name: "UserDetail",
        component: UserDetail,
      },
    ],
  },
];

// 7. 路由匹配测试工具
class RouteMatchTester {
  constructor(routes) {
    this.routes = routes;
  }

  // 测试路径匹配
  testMatch(path) {
    const results = [];

    const testRoute = (routes, basePath = "") => {
      for (const route of routes) {
        const fullPath = basePath + route.path;
        const regex = this.routeToRegex(fullPath);

        if (regex.test(path)) {
          results.push({
            path: fullPath,
            name: route.name,
            component: route.component?.name || "Anonymous",
            params: this.extractParams(fullPath, path),
          });
        }

        // 递归测试子路由
        if (route.children) {
          testRoute(route.children, fullPath + "/");
        }
      }
    };

    testRoute(this.routes);
    return results;
  }

  // 路由路径转正则表达式
  routeToRegex(path) {
    const regexStr = path
      .replace(/:\w+\([^)]+\)/g, "($1)") // 处理带正则的参数
      .replace(/:\w+/g, "([^/]+)") // 处理普通参数
      .replace(/\*/g, ".*"); // 处理通配符

    return new RegExp("^" + regexStr + "$");
  }

  // 提取路由参数
  extractParams(routePath, actualPath) {
    const paramNames = routePath.match(/:(\w+)/g) || [];
    const regex = this.routeToRegex(routePath);
    const match = actualPath.match(regex);

    if (!match) return {};

    const params = {};
    paramNames.forEach((param, index) => {
      const paramName = param.slice(1); // 移除冒号
      params[paramName] = match[index + 1];
    });

    return params;
  }
}

// 使用测试工具
const tester = new RouteMatchTester(routes);
console.log(tester.testMatch("/user/123")); // 测试数字 ID
console.log(tester.testMatch("/user/profile")); // 测试静态路径
console.log(tester.testMatch("/user/john")); // 测试用户名
```

**动态路由匹配最佳实践：**

1. **静态路由优先**：将静态路由放在动态路由之前，确保精确匹配
2. **使用正则约束**：通过正则表达式限制参数格式，提高匹配精度
3. **参数验证**：在路由守卫中验证参数的有效性
4. **错误处理**：为无效路径提供适当的 404 处理
5. **性能考虑**：避免过于复杂的正则表达式，影响路由匹配性能

**使用场景对比：**

- **定义顺序控制**: 适用于简单的优先级需求
- **正则表达式约束**: 适用于需要精确参数格式控制的场景
- **路由守卫验证**: 适用于需要动态验证的复杂业务逻辑
- **优先级管理器**: 适用于大型应用的复杂路由匹配需求

**记忆要点总结：**

- 匹配原则：按定义顺序，第一个匹配成功的路由被选中
- 优先级：静态路由 > 动态路由 > 通配符路由
- 正则约束：`:id(\\d+)` 数字，`:slug([a-zA-Z0-9-]+)` 字符串
- 参数验证：beforeEnter 守卫中验证参数有效性
- 最佳实践：合理排序、精确约束、错误处理
