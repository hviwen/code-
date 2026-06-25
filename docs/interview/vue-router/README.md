# Vue Router 面试复习

Vue Router 题目按基础和进阶拆分，默认按 Vue Router 4 语义复习。

## 学习顺序

1. 先读题目或索引，确认考察范围。
2. 再读拆分后的答案文件，按 12 段结构复习。
3. 最后回到练习目录做代码题或手写实现。

## 文件索引

- [如何创建 Vue Router 实例（基本示例）？](core/q001-vue-router.md)
- [`router-link` 与 `router.push` 的区别？](core/q002-router-link-router-push.md)
- [什么是动态路由？如何定义路由参数？](core/q003-topic.md)
- [如何将路由参数作为组件 props 传入？](core/q004-props.md)
- [如何配置嵌套路由？举例简单结构。](core/q005-topic.md)
- [如何实现路由懒加载？](core/q006-topic.md)
- [`beforeEach` 全局守卫的用途？它的参数是什么？](core/q007-beforeeach.md)
- [如何处理 404（找不到路由）？](core/q008-404.md)
- [路由中 `meta` 的作用？怎么在守卫中使用它？](core/q009-meta.md)
- [`replace` 与 `push` 的区别？](core/q010-replace-push.md)
- [如何在路由中控制滚动行为？](core/q011-topic.md)
- [如何在导航失败（navigation failure）时做错误处理？](core/q012-navigation-failure.md)
- [`router.isReady()` 有什么用途？](core/q013-router-isready.md)
- [如何实现命名路由并用其跳转？](core/q014-topic.md)
- [`alias` 与 `redirect` 的区别？](core/q015-alias-redirect.md)
- [路由导航守卫的执行顺序（全局、路由独享、组件内）？](core/q016-topic.md)
- [如何在 `<router-link>` 中设置 active-class？](core/q017-router-link-active-class.md)
- [路由懒加载与 webpack chunk name 的关系如何控制？](advanced/q001-webpack-chunk-name.md)
- [如何实现基于 `meta` 的权限路由（示例流程）？](advanced/q002-meta.md)
- [解释路由守卫中异步验证的正确使用方式（避免导航闪烁）。](advanced/q003-topic.md)
- [如何在路由导航时实现数据预取（prefetch）？](advanced/q004-prefetch.md)
- [解释 `history` 模式的差异（HTML5 history vs hash vs Web History）以及服务端配置注意点。](advanced/q005-history-html5-history-vs-hash-vs-web-history.md)
- [如何缓存路由组件（keep-alive）并控制哪些路由被缓存？](advanced/q006-keep-alive.md)
- [路由重定向和导航守卫中如何传递原始目标（用于登录后回跳）？](advanced/q007-topic.md)
- [如何处理多个并发导航（重复点击）导致的导航取消错误？](advanced/q008-topic.md)
- [如何实现路由级别的滚动恢复（back/forward）？](advanced/q009-back-forward.md)
- [Vue Router 中如何处理动态匹配优先级？例如 `/user/:id` 与 `/user/profile` 的匹配顺序。](advanced/q010-vue-router-user-id-user-profile.md)
