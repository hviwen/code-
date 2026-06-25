# 如何实现基于 `meta` 的权限路由（示例流程）？

> 来源：`docs/vue-router/vue_router_part_2_answer.md`

## 问题本质解读

这道题考察前端权限控制系统的设计和实现，面试官想了解你是否掌握基于路由的权限管理、用户认证流程和安全防护机制。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 路由路径 `/user:id` 应为 `/user/:id`，缺少参数前的斜杠
- meta 中不应该直接调用 `getToken()`，应该定义静态的权限配置
- 导航守卫参数错误，应该是 `(to, from, next)` 三个参数
- 方法名错误：`router.redrite` 应为 `next('/login')`
- 逻辑错误：应该检查需要权限但没有 token 的情况

## 知识点系统梳理

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

### 问题本质解读 这道题考察前端权限控制系统的设计和实现，面试官想了解你是否掌握基于路由的权限管理、用户认证流程和安全防护机制。

### 技术错误纠正

- 路由路径 `/user:id` 应为 `/user/:id`，缺少参数前的斜杠
- meta 中不应该直接调用 `getToken()`，应该定义静态的权限配置
- 导航守卫参数错误，应该是 `(to, from, next)` 三个参数
- 方法名错误：`router.redrite` 应为 `next('/login')`
- 逻辑错误：应该检查需要权限但没有 token 的情况

### 知识点系统梳理

**权限路由核心概念：**

- 基于 meta 字段定义路由级权限信息
- 在导航守卫中进行统一的权限验证
- 支持角色权限、功能权限等多维度控制
- 提供友好的权限不足提示和重定向

**改进版本：**

基于 `meta` 的权限路由需要在路由配置中定义权限信息，然后在导航守卫中进行权限验证：

```TypeScript
// TypeScript 类型定义
interface RouteMeta {
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  title?: string;
  keepAlive?: boolean;
  layout?: string;
}

// 扩展 Vue Router 的类型定义
declare module "Vue Router" {
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

### 记忆要点总结

- Meta 配置：requiresAuth、roles、permissions
- 守卫参数：(to, from, next) 或 (to, from)
- 权限验证：token 检查、角色匹配、权限验证
- 错误处理：网络异常、token 过期、权限不足
- 安全原则：前端验证 + 后端验证双重保障

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何实现基于 `meta` 的权限路由（示例流程）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
