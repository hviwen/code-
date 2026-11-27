---
lang: zh-CN
---

> 从本章 66 条中精选 28 条（约 42%），原文约 24k 字，最精简版约 3k 字。
> 只保留高频结论与坑点；完整内容见 `~/Documents/ks`。

# 响应式与调度

- **React/Vue 高频事件如何避免卡顿？** 合并同一帧/短窗口内事件、虚拟化、局部不可变更新；React 对低优先级列表用 startTransition，Vue 避免深层 watch 带来的全量遍历。（坑：给所有组件套 memo/computed。）
- **Vue computed 与 watch 在门禁逻辑中的分工？** 机制与工程边界；computed 表达无副作用派生状态；watch 只处理确需副作用的同步，如重取、埋点或取消任务。（坑：用 watch 复制 computed 值。）
- **Vue 更新队列** Vue 批处理响应式更新与 watcher，减少重复渲染。状态先变化，DOM 在后续更新周期刷新；nextTick 等待本轮 DOM 更新。（坑：Vue 3 仍靠 Object.definePro…）
- **Vue 测试中 nextTick 与 flushPromises 如何选择** nextTick 等待 Vue 已排队的 DOM 更新，不知道 axios/fetch Mock 的未决 Promise…（坑：循环 nextTick、全局 sleep 或 sh…）
- **哪些 watcher 会自动停止，哪些不会？** 在 setup() 同步创建并归属组件实例的 watcher 会在卸载时停止；异步回调、计时器或组件外创建的 watcher 可能没有该归属…（坑：认为任何 watch() 都会自动回收。）
- **异步 watcher 如何取消过期请求？** 在回调同步阶段注册 onWatcherCleanup（或第三参 onCleanup），用 AbortController 中止旧 fetch…（坑：await 之后才调用 onWatcherClea…）

# 组件与生命周期

- **Composable 如何管理监听器、请求与 watcher 生命周期** 同步创建 composable；用 toValue/getter 明确响应式输入；watch callback 的 cleanup 或 AbortControl…（坑：watcher 自动取消所有异步任务…）
- **KeepAlive 的停用不等于卸载** 被 KeepAlive 缓存的组件切走时进入 deactivated，实例和状态保留；淘汰或真正卸载时才 unmounted。（坑：路由切走一定触发 onUnmounted…）
- **受控组件怎样避免 prop/local 双写循环？** 机制/边界；以 prop 为真值，内部发 update 事件；需要草稿时使用独立 draft 并在明确时机同步。（坑：watch 双向复制。）

# 状态与路由

- **SSE 历史/实时切换如何做状态机？** loading-history 后依据 currentRound 决定 ready 或 connecting/streaming；错误与取消独立…（坑：一个 loading boolean。）
- **SSE 历史/实时切换如何做状态机？｜状态与接口契约** 在“技能页规则、流式续传与保存确认”中，先明确状态所有者与契约，再落实：Tab 可见性应复用页面已有节点分类真相并处理深链非法值。（坑：名称相同即可判断节点层级。）
- **删除状态机｜状态与接口契约** 在“删除弹窗、领域徽标与 Safari 兼容”中，先明确状态所有者与契约，再落实：删除流程至少包含 idle、confirming、submitting…（坑：一个 loading 布尔值足够描述所有状态。）
- **树搜索｜性能安全取舍** 在“拓扑画布、领域树搜索与流式阶段”中，先明确状态所有者与契约，再落实：搜索命中应定义父子展示、展开与清除行为，异步节点需补加载。（坑：只过滤当前已加载数组即可。）
- **模态流程应是显式状态机** idle/loading-options/choosing/submitting/success/error 比多个 boolean 更能避免非法组合。（坑：visible 和 loading 两个布尔足够所…）
- **确认后请求失败怎样恢复？** 机制/边界；保留用户选择与错误原因，解除提交锁并提供显式重试；若结果未知先查询状态，避免重复创建。 取舍：乐观关闭更快但失败恢复复杂。（坑：失败后直接重置全部输入。）
- **编辑草稿｜状态与接口契约** 在“业务域编辑、同步确认与路由状态”中，先明确状态所有者与契约，再落实：表单草稿应与服务端快照分离，保存成功后再提升为已提交状态。（坑：输入框变化即等于保存成功。）
- **如何设计会话标题的编辑状态？** 区分 persistedTitle、draft、saving、error；输入只改 draft，确认后调用一次保存，成功更新共享真值。（坑：每次 keypress 都写服务端。）
- **配置归属｜失败路径** 在“双栏评审对比与 Tiptap 迁移”中，先明确状态所有者与契约，再落实：编辑器公共配置应在共享层统一，页面只注入业务差异。（坑：复制配置比追踪依赖更安全。）
- **领域树｜性能安全取舍** 在“需求卡片、领域树与资产抽屉”中，先明确状态所有者与契约，再落实：树选择需区分展开、选中、当前上下文和祖先路径。（坑：一个 selectedKeys 覆盖所有语义。）

# 列表与交互

- **SSE 消息与列表缓存如何合并？** 按 messageId/sequence 归一化写缓存，partial/final 更新同一实体，视图从派生选择器读取。（坑：直接 push 到当前组件数组。）

# 性能与边界

- **Extension、NodeView 与 renderHTML 如何分工** Extension 负责注册能力/命令；Node schema 定义 attrs、parseHTML/renderHTML；NodeView 负责编辑器内交互。（坑：NodeView DOM 就是最终 HTML。）
- **useCurrentRequirementId 应解决什么问题？** 机制与工程边界；统一解析路由参数、上下文与回退逻辑，并暴露只读结果；调用方不再复制优先级判断。 取舍：共享 hook 仍需明确无 ID、切换和权限场景。（坑：封装后继续让调用方传多个冲突 ID。）
- **异步 sessionId 到达前，ChatPanel 应如何建模？** 机制与工程边界；区分 uninitialized、loading-history、ready-empty、ready-data、streaming、error…（坑：把空 history 等同于未初始化。）
- **扩展注册顺序会影响什么？** 机制/边界；可能影响插件优先级、输入规则、键盘快捷键与 schema 合并；冲突时应明确 priority 和覆盖意图。（坑：顺序永远无关。）
- **确认弹窗应放在哪个流程边界？** 机制与工程边界；放在不可逆或高成本副作用之前；收集参数后确认，确认后再创建任务，并防双击与可取消。 取舍：预加载只允许无副作用数据。（坑：弹窗 mounted 就生成。）
- **风险分析卡从 Mock 到生产需要哪些边界** 拆出风险实体和服务契约；服务端生成风险 ID、版本与权限；前端区分 loading/empty/error/stale；复查使用幂等任务；保留证据、模型版本…（坑：把 setTimeout 换成 fetch 就完成…）
- **风险分析卡片如何展示异步工具结果？** 机制/边界；用 pending/success/empty/error/partial 判别状态，内容安全渲染并保留来源、时间与重试；旧会话结果需隔离。（坑：直接 innerHTML 工具输出。）
- **默认领域｜性能安全取舍** 在“技能市场、默认领域与编辑态清理”中，先明确状态所有者与契约，再落实：默认选择应基于用户/业务上下文并在无权限时降级。（坑：写死第一个节点即可。）