---
lang: zh-CN
---

> 本章 66 条，覆盖 5 个子主题。原文约 24k 字，精简版约 7k 字。
> 完整展开、代码与出处见 `~/Documents/ks`。

# 响应式与调度

## React/Vue 如何避免“慢旧响应覆盖快新响应”？

将查询参数和请求版本绑定；参数变更/卸载时 cleanup 旧请求并 abort，提交前确认仍为当前版本。React effect 需对称 cleanup；Vue watcher 在异步工作开始前注册 cleanup。

## React/Vue 高频事件如何避免卡顿？

合并同一帧/短窗口内事件、虚拟化、局部不可变更新；React 对低优先级列表用 startTransition，Vue 避免深层 watch 带来的全量遍历。先用 Profiler/Performance trace 定位再优化。

> 坑：给所有组件套 memo/computed。

## Vue DOM 更新是批处理

响应式写入会排队；nextTick 等待当前批次 DOM 刷新，不保证网络或浏览器绘制完成。

> 坑：把 nextTick 当通用延时器。

## Vue computed 与 watch 在门禁逻辑中的分工？

机制与工程边界；computed 表达无副作用派生状态；watch 只处理确需副作用的同步，如重取、埋点或取消任务。 取舍：watch 需清理异步副作用，并选择合适 flush。

> 坑：用 watch 复制 computed 值。

## Vue watcher 如何做异步清理？

每轮 watcher 创建 controller；在 cleanup abort 上一轮。Vue 3.5+ onWatcherCleanup 必须同步注册，不能放在 await 后；兼容写法使用回调传入的 onCleanup 并在启动异步工作前注册。

## Vue 为什么批处理更新， nextTick() 究竟等待什么？

同一轮同步状态修改会被 Vue 合并并调度组件更新，避免重复 patch。await nextTick() 等当前已排队的 Vue DOM 更新完成，适合读取更新后的 DOM 或衔接依赖它的逻辑。

## Vue 批处理、nextTick 与 watcher flush

Vue 会把同一轮中的组件更新和 watcher 任务批处理，避免重复渲染。

## Vue 更新队列

Vue 批处理响应式更新与 watcher，减少重复渲染。状态先变化，DOM 在后续更新周期刷新；nextTick 等待本轮 DOM 更新。

> 坑：Vue 3 仍靠 Object.defineProperty 递归响应式；已修正为 Proxy 模型。

## Vue 测试中 nextTick 与 flushPromises 如何选择

nextTick 等待 Vue 已排队的 DOM 更新，不知道 axios/fetch Mock 的未决 Promise；先等待外部 Promise（如 flushPromises），再在需要时等待 Vue 更新。

> 坑：循环 nextTick、全局 sleep 或 shallow mount 后声称集成链正确。

## computed 、 watch 、 watchEffect 如何分工？

computed 是可缓存的同步派生值，不做副作用；watch 显式声明源，适合比较新旧值、控制触发时机；watchEffect 自动收集其同步执行期间访问的依赖，适合短小、依赖自然变化的副作用。

> 坑：用 computed 发请求；认为 watchEffect 会追踪整段异步函数。

## computed 、普通方法和 watchEffect 分别适合什么？

computed 表达可由响应式输入同步推导的值并按依赖缓存；方法每次渲染都会执行，适合轻量无缓存计算；watchEffect 用于执行有副作用的响应式工作，并应让依赖读取清晰、清理资源。异步 watchEffect 只自动跟踪首个 await 前读取的依赖。

## watch 的 flush: 'pre' 'post' 'sync' 如何选？

默认 pre 在组件 DOM 更新前执行，适合通常的派生副作用；需要读取本组件更新后 DOM 时用 post；sync 对每次变更立即触发，适合极小、不可批处理的同步约束，滥用会放大频繁变更成本。异步副作用须用 cleanup 取消过期请求。

## sessionId 到达后自动打开怎样防重复？

用一次性 intent/token 或状态机，只在目标流程首次满足条件时消费；用户关闭后不因无关更新重开。

> 坑：watch immediate 每次赋 true。

## watcher 的异步竞态怎样终止旧请求？

每次源变化创建 AbortController，在 watcher invalidation cleanup 中 abort；提交前检查 signal/请求序号仍是最新。取消节约资源，但后端可能已经完成，因此写操作还要幂等键和状态查询。

## 哪些 watcher 会自动停止，哪些不会？

在 setup() 同步创建并归属组件实例的 watcher 会在卸载时停止；异步回调、计时器或组件外创建的 watcher 可能没有该归属，须保存 stop handle 或纳入 effectScope 并显式停止。

> 坑：认为任何 watch() 都会自动回收。

## 异步 watcher 如何取消过期请求？

在回调同步阶段注册 onWatcherCleanup（或第三参 onCleanup），用 AbortController 中止旧 fetch；同时只提交最新请求对应的数据，区分 AbortError 与真实失败。

> 坑：await 之后才调用 onWatcherCleanup；吞掉所有异常并显示空列表。

# 组件与生命周期

## Composable 如何管理监听器、请求与 watcher 生命周期

同步创建 composable；用 toValue/getter 明确响应式输入；watch callback 的 cleanup 或 AbortController 取消旧请求；mounted 建 DOM 资源，unmounted 对称释放…

> 坑：watcher 自动取消所有异步任务；把 reactive 返回对象解构后仍天然响应。

## Composable 是带所有权的状态逻辑

composable 是用 Composition API 封装并复用有状态逻辑的函数。在同步 setup/<script setup> 中注册 watcher 和生命周期钩子，使 Vue 能把它们绑定到组件实例并在卸载时停止。

> 坑：抽成 useX 就自动避免共享状态、竞态和泄漏。

## KeepAlive 与 Teleport 组合时如何定义可见性和资源存活

Teleport 不改变组件逻辑所有权；KeepAlive 切走触发 deactivated 而非卸载。

> 坑：Teleport DOM 仍在就代表组件仍激活；只写 onUnmounted 即可。

## KeepAlive 的停用不等于卸载

被 KeepAlive 缓存的组件切走时进入 deactivated，实例和状态保留；淘汰或真正卸载时才 unmounted。需要暂停的订阅、轮询和昂贵观察可在 onDeactivated 停止，在 onActivated 恢复。

> 坑：路由切走一定触发 onUnmounted，或 Teleport 到 body 后生命周期归 body 管。

## 上传组件如何建模四态？

用判别联合表示 idle/uploading/success/error，每支只暴露合法字段；事件驱动转移。

> 坑：isLoading、isSuccess、isError 可同时为真。

## 人员指派组件需要哪些契约？

输入候选范围、当前值、权限、加载/空/错误；输出稳定 userId，确认后提交并回写。

> 坑：提交姓名字符串。

## 受控组件怎样避免 prop/local 双写循环？

机制/边界；以 prop 为真值，内部发 update 事件；需要草稿时使用独立 draft 并在明确时机同步。 取舍：异步父更新可能造成短暂回弹，需定义 optimistic 语义。

> 坑：watch 双向复制。

## 如何让 Vue composable 不泄漏订阅、请求与监听器？

在组件 setup / <script setup> 中同步调用 composable，使 watcher 归属组件 scope；将 listener、timer…

# 状态与路由

## Pinia/Vue store 的网络状态如何避免“万能 store”？

只放跨页面共享、持久或业务核心状态；页面局部输入留组件内。网络状态至少建模 idle/loading/success/error、参数 key、更新时间与失效动作；写入成功后按资源身份精确失效或更新，避免全局刷新。

> 坑：把每个临时弹窗、DOM 引用和请求函数全塞入 store。

## SSE 历史/实时切换如何做状态机？

loading-history 后依据 currentRound 决定 ready 或 connecting/streaming；错误与取消独立，切会话带 epoch。

> 坑：一个 loading boolean。

## SSE 历史/实时切换如何做状态机？｜状态与接口契约

在“技能页规则、流式续传与保存确认”中，先明确状态所有者与契约，再落实：Tab 可见性应复用页面已有节点分类真相并处理深链非法值。

> 坑：名称相同即可判断节点层级。

## 分页状态｜项目落地

在“TRD 生成弹窗、评审徽标与分页”中，先明确状态所有者与契约，再落实：页码、总数、排序和筛选需共享请求契约。

> 坑：只加 Pagination 组件就完成分页。

## 分页状态｜可观测与回滚

以可复现输入验证“分页状态”：覆盖正常、空值、失败、并发或版本边界，并分别记录静态、网络和运行时证据。

> 坑：只加 Pagination 组件就完成分页。

## 删除当前会话后路由怎样处理？

服务端删除成功后清理实体/cache/连接，再 replace 到新建页或合法邻项，恢复焦点和空态。

> 坑：先导航再确认删除成功。

## 删除状态机｜机制与边界

删除流程至少包含 idle、confirming、submitting、success、failure。

> 坑：一个 loading 布尔值足够描述所有状态。

## 删除状态机｜状态与接口契约

在“删除弹窗、领域徽标与 Safari 兼容”中，先明确状态所有者与契约，再落实：删除流程至少包含 idle、confirming、submitting、success、failure。

> 坑：一个 loading 布尔值足够描述所有状态。

## 命令执行模式如何做能力门禁？

根据宿主能力与用户权限解析可用模式，默认拒绝非法组合；UI 和共享 command 同时校验。

> 坑：隐藏本地模式选项就足够。

## 子 PRD 创建需要哪些前置条件？

有效节点 ID、主文档/领域状态、用户权限和非处理中状态，统一由门禁解析器给出 action/reason。

> 坑：只判断按钮是否可见。

## 如何建模 QRD 技术域选择弹窗？

机制/边界；用判别联合表示加载选项、选择、提交、成功/错误；创建 QRD 的副作用只在合法选择确认后发生。 取舍：用户取消应回到可重试状态，不残留 submitting。

> 坑：visible + loading 任意组合。

## 树搜索｜验证真实性

以可复现输入验证“树搜索”：覆盖正常、空值、失败、并发或版本边界，并分别记录静态、网络和运行时证据。

> 坑：只过滤当前已加载数组即可。

## 树搜索｜性能安全取舍

在“拓扑画布、领域树搜索与流式阶段”中，先明确状态所有者与契约，再落实：搜索命中应定义父子展示、展开与清除行为，异步节点需补加载。

> 坑：只过滤当前已加载数组即可。

## 模态流程应是显式状态机

idle/loading-options/choosing/submitting/success/error 比多个 boolean 更能避免非法组合。

> 坑：visible 和 loading 两个布尔足够所有流程。

## 确认后请求失败怎样恢复？

机制/边界；保留用户选择与错误原因，解除提交锁并提供显式重试；若结果未知先查询状态，避免重复创建。 取舍：乐观关闭更快但失败恢复复杂。

> 坑：失败后直接重置全部输入。

## 编辑草稿｜机制与边界

表单草稿应与服务端快照分离，保存成功后再提升为已提交状态。

> 坑：输入框变化即等于保存成功。

## 编辑草稿｜状态与接口契约

在“业务域编辑、同步确认与路由状态”中，先明确状态所有者与契约，再落实：表单草稿应与服务端快照分离，保存成功后再提升为已提交状态。

> 坑：输入框变化即等于保存成功。

## 如何设计会话标题的编辑状态？

区分 persistedTitle、draft、saving、error；输入只改 draft，确认后调用一次保存，成功更新共享真值。

> 坑：每次 keypress 都写服务端。

## 配置归属｜失败路径

在“双栏评审对比与 Tiptap 迁移”中，先明确状态所有者与契约，再落实：编辑器公共配置应在共享层统一，页面只注入业务差异。

> 坑：复制配置比追踪依赖更安全。

## 配置归属｜反例与替代方案

以可复现输入验证“配置归属”：覆盖正常、空值、失败、并发或版本边界，并分别记录静态、网络和运行时证据。

> 坑：复制配置比追踪依赖更安全。

## 领域树｜验证真实性

以可复现输入验证“领域树”：覆盖正常、空值、失败、并发或版本边界，并分别记录静态、网络和运行时证据。

> 坑：一个 selectedKeys 覆盖所有语义。

## 领域树｜性能安全取舍

在“需求卡片、领域树与资产抽屉”中，先明确状态所有者与契约，再落实：树选择需区分展开、选中、当前上下文和祖先路径。

> 坑：一个 selectedKeys 覆盖所有语义。

# 列表与交互

## React/Vue 列表中用 Set 去重时有哪些更新陷阱？

React state 必须产生新 Set 后再 setState；Vue 中可追踪集合操作，但应避免在派生计算/渲染期间无边界 mutate。列表仍以持久 ID 作为 key；去重规则要明确是 ID、规范化文本还是内容哈希。

## SSE 消息与列表缓存如何合并？

按 messageId/sequence 归一化写缓存，partial/final 更新同一实体，视图从派生选择器读取。

> 坑：直接 push 到当前组件数组。

## Tab 规则｜问答

Tab 可见性应复用页面已有节点分类真相并处理深链非法值。

> 坑：名称相同即可判断节点层级。

## Tab 规则｜机制与边界

Tab 可见性应复用页面已有节点分类真相并处理深链非法值。

> 坑：名称相同即可判断节点层级。

## 历史折叠｜项目落地

在“评审侧栏、编辑深链与草稿交接”中，先明确状态所有者与契约，再落实：折叠历史不应卸载仍在提交或需要保持的状态。

> 坑：折叠等于安全销毁组件。

## 历史折叠｜可观测与回滚

以可复现输入验证“历史折叠”：覆盖正常、空值、失败、并发或版本边界，并分别记录静态、网络和运行时证据。

> 坑：折叠等于安全销毁组件。

## 聊天交互｜失败路径

在“统计口径、步骤重构与树折叠性能”中，先明确状态所有者与契约，再落实：聊天空态、生成中、历史加载与错误要分离。

> 坑：一个 loading 覆盖所有阶段最简单。

## 聊天交互｜反例与替代方案

以可复现输入验证“聊天交互”：覆盖正常、空值、失败、并发或版本边界，并分别记录静态、网络和运行时证据。

> 坑：一个 loading 覆盖所有阶段最简单。

# 性能与边界

## Extension、NodeView 与 renderHTML 如何分工

Extension 负责注册能力/命令；Node schema 定义 attrs、parseHTML/renderHTML；NodeView 负责编辑器内交互。业务数据应进入可序列化 attrs 或外部实体引用，不能只存在 Vue 局部状态。

> 坑：NodeView DOM 就是最终 HTML。

## Vue/React 中为什么不能仅靠类型避免异步竞态？

类型只能描述 signal、状态和返回值；参数变更、卸载、SSR/hydration 时序仍在运行时发生。为请求设置取消与“仅接收最新响应”的策略，清理 effect/watch；错误 UI 区分取消和失败。

> 坑：认为 AbortController 自动阻止所有副作用；把所有 abort 显示为错误 toast。

## 为什么 v-for 的稳定 key 同时是正确性和性能问题？

稳定且唯一的 key 让 Vue 将旧节点和同一逻辑实体对应，保留正确的局部状态、焦点与 DOM，并让差异更新更准确。应优先使用数据的持久 ID；排序、插入、删除的动态列表不应以 index 代表身份。

## useCurrentRequirementId 应解决什么问题？

机制与工程边界；统一解析路由参数、上下文与回退逻辑，并暴露只读结果；调用方不再复制优先级判断。 取舍：共享 hook 仍需明确无 ID、切换和权限场景。

> 坑：封装后继续让调用方传多个冲突 ID。

## 异步 sessionId 到达前，ChatPanel 应如何建模？

机制与工程边界；区分 uninitialized、loading-history、ready-empty、ready-data、streaming、error；只有有效 ID 才挂载数据拥有者。

> 坑：把空 history 等同于未初始化。

## 扩展注册顺序会影响什么？

机制/边界；可能影响插件优先级、输入规则、键盘快捷键与 schema 合并；冲突时应明确 priority 和覆盖意图。 取舍：具体语义以框架版本和扩展实现为准。

> 坑：顺序永远无关。

## 确认弹窗如何避免双击生成？

确认后原子进入 submitting，禁用所有触发入口并使用 idempotency key；结果未知先查询。

> 坑：按钮 disabled 足够。

## 确认弹窗应放在哪个流程边界？

机制与工程边界；放在不可逆或高成本副作用之前；收集参数后确认，确认后再创建任务，并防双击与可取消。 取舍：预加载只允许无副作用数据。

> 坑：弹窗 mounted 就生成。

## 风险分析卡从 Mock 到生产需要哪些边界

拆出风险实体和服务契约；服务端生成风险 ID、版本与权限；前端区分 loading/empty/error/stale；复查使用幂等任务；保留证据、模型版本、人工处置和审计日志；发布要有灰度与回滚。

> 坑：把 setTimeout 换成 fetch 就完成生产化。

## 风险分析卡片如何展示异步工具结果？

机制/边界；用 pending/success/empty/error/partial 判别状态，内容安全渲染并保留来源、时间与重试；旧会话结果需隔离。 取舍：流式展示更快但要处理 partial 合并与撤销。

> 坑：直接 innerHTML 工具输出。

## 默认领域｜验证真实性

以可复现输入验证“默认领域”：覆盖正常、空值、失败、并发或版本边界，并分别记录静态、网络和运行时证据。

> 坑：写死第一个节点即可。

## 默认领域｜性能安全取舍

在“技能市场、默认领域与编辑态清理”中，先明确状态所有者与契约，再落实：默认选择应基于用户/业务上下文并在无权限时降级。

> 坑：写死第一个节点即可。
