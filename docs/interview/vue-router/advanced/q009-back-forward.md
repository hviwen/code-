# 如何实现路由级别的滚动恢复（back/forward）？

> 来源：`docs/vue-router/vue_router_part_2_answer.md`

## 问题本质解读

这道题考察用户体验优化中的滚动行为管理，面试官想了解你是否掌握如何在路由切换时保持良好的浏览体验。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案描述不够准确，Vue Router 有内置的 scrollBehavior 支持
- 不需要手动修改 scrollBehavior 配置，应该利用其回调机制
- 需要考虑异步组件加载和渲染时机

## 知识点系统梳理

Vue Router 提供了内置的 `scrollBehavior` 配置，结合自定义的滚动位置管理可以实现完善的滚动恢复功能。

### 问题本质解读 这道题考察用户体验优化中的滚动行为管理，面试官想了解你是否掌握如何在路由切换时保持良好的浏览体验。

### 技术错误纠正

- 原答案描述不够准确，Vue Router 有内置的 scrollBehavior 支持
- 不需要手动修改 scrollBehavior 配置，应该利用其回调机制
- 需要考虑异步组件加载和渲染时机

### 知识点系统梳理

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

### 记忆要点总结

- 配置方式：router 的 scrollBehavior 选项
- 参数类型：(to, from, savedPosition)
- 返回值：{ top, left } 或 Promise
- 锚点处理：to.hash + 偏移计算
- 缓存策略：sessionStorage + TTL 机制

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何实现路由级别的滚动恢复（back/forward）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
