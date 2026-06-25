# Interview 内容分阶段优化计划

本计划基于：

- [Interview 内容审计报告](interview-audit-report.md)
- [前端面试答案增强判别模板](../templates/interview-answer-evaluator.md)
- [30 天前端面试复习路线](../roadmap/frontend-30-days.md)

目标不是一次性重写 `docs/interview/`，而是按复习价值和缺口类型分批优化。

## 当前结论

审计文件数：337。

| 等级 | 文件数 | 处理策略 |
| --- | ---: | --- |
| A | 3 | 暂不处理，只在发现错误时小修 |
| B | 306 | 主力优化对象，补薄弱章节 |
| C | 0 | 暂无 |
| D | 28 | 多为聚合题库或 raw 文件，先决定保留、拆分或归档 |

最常见缺口：

1. `使用场景说明和对比` 偏薄：309 个文件。
2. `知识点系统梳理` 偏薄：306 个文件。
3. `考察范围` 偏薄：142 个文件。
4. `实战应用举例` 偏薄：45 个文件。
5. `技术错误纠正` 偏薄：24 个文件。

## 优化原则

- 先优化复习路线中的高频题，不按文件名从头到尾机械推进。
- B 级文件只补缺口，不重写全文。
- D 级聚合题库先做归类决策，不直接改成 12 段结构。
- 每批最多处理 8-12 个文件，便于复查质量。
- 每批完成后运行 `pnpm audit:interview`，观察分数和缺口变化。
- 涉及代码示例的答案，示例要能复制运行或能清楚说明运行条件。

## 单题优化流程

每个文件按这个顺序处理：

1. 判断题型：概念题、机制题、手写题、场景题、框架题。
2. 对照 [判别模板](../templates/interview-answer-evaluator.md) 找缺口。
3. 优先补三块：
   - `知识点系统梳理`
   - `使用场景说明和对比`
   - `实战应用举例`
4. 保留已有正确内容，删除明显重复或空泛的“待补充”。
5. 更新后运行审计脚本。

单题完成标准：

- 结论能在 30 秒内口述。
- 原理能讲清关键机制和边界。
- 至少有一个贴近前端工作的例子。
- 有 3-5 个易错点。
- 延伸问题能自然引出相邻知识点。

## 阶段 1：路线高频题优先优化

目标：先让 30 天路线里每天会看的题变成高质量复习材料。

### 批次 1.1：JavaScript 基础类型

范围：

- `docs/interview/javascript/core/001-javascript.md`
- `docs/interview/javascript/core/002-typeof-null.md`
- `docs/interview/javascript/core/003-question.md`
- `docs/interview/javascript/core/004-question.md`
- `docs/interview/javascript/core/005-javascript-undefined-null.md`
- `docs/interview/javascript/core/006-question.md`

重点补强：

- 类型判断边界：`typeof null`、数组、`NaN`、包装对象。
- 场景对比：`typeof`、`instanceof`、`Object.prototype.toString.call`。
- 实战例子：表单值判断、接口字段兜底、运行时类型保护。

验收：

- 每题都有清晰的一句话答案。
- `使用场景说明和对比` 不再只是泛泛描述。
- 每题至少补 3 个易错点。

### 批次 1.2：作用域、闭包、this

范围：

- `docs/interview/javascript/core/016-question.md`
- `docs/interview/javascript/core/017-hoisting.md`
- `docs/interview/javascript/core/018-javascript.md`
- `docs/interview/javascript/core/019-question.md`
- `docs/interview/javascript/core/022-this.md`
- `docs/interview/javascript/core/023-call-apply-bind.md`

重点补强：

- 执行上下文、词法作用域、作用域链。
- 闭包的真实用途和内存风险。
- `this` 的绑定优先级。
- `call/apply/bind` 的手写和边界。

验收：

- `知识点系统梳理` 能按执行流程讲清。
- 有至少一个可运行代码示例。
- 能区分“定义时决定”和“调用时决定”的机制。

### 批次 1.3：对象、原型、继承、new

范围：

- `docs/interview/javascript/core/031-question.md`
- `docs/interview/javascript/core/032-question.md`
- `docs/interview/javascript/core/033-proto-prototype.md`
- `docs/interview/javascript/core/036-question.md`
- `docs/interview/javascript/core/042-javascript.md`
- `docs/interview/javascript/core/044-new.md`

重点补强：

- 原型链查找流程。
- 构造函数、实例、原型对象之间的关系。
- 深拷贝边界：循环引用、Date、RegExp、Map、Set、函数。
- `new` 的执行步骤和手写实现。

验收：

- 有原型关系图或 ASCII 示意。
- 手写题给出边界用例。
- 不把“继承方式列表”写成死记硬背。

### 批次 1.4：异步和事件循环

范围：

- `docs/interview/javascript/async-modern/116-promise.md`
- `docs/interview/javascript/async-modern/117-promise.md`
- `docs/interview/javascript/async-modern/120-promise.md`
- `docs/interview/javascript/async-modern/128-async-await.md`
- `docs/interview/javascript/async-modern/136-javascript.md`
- `docs/interview/javascript/async-modern/137-question.md`

重点补强：

- Promise 状态、链式调用、错误传播。
- `async/await` 和 Promise 的关系。
- 宏任务、微任务、调用栈、渲染时机。
- 常见输出顺序题。

验收：

- 至少一个事件循环执行顺序示例。
- 能说明为什么 `await` 后续代码进入微任务。
- 能区分同步异常和异步拒绝。

## 阶段 2：Vue 主线优化

目标：让 Vue 3、Pinia、Vue Router 的核心题可以支撑真实项目面试。

### 批次 2.1：Vue 响应式核心

范围：

- `docs/interview/vue/vue3-core/q001-ref-reactive.md`
- `docs/interview/vue/vue3-core/q002-computed-watch.md`
- `docs/interview/vue/vue3-core/q015-watcheffect-watch.md`
- `docs/interview/vue/vue3-core/q016-shallowref-shallowreactive.md`
- `docs/interview/vue/vue3-advanced/q002-computed.md`
- `docs/interview/vue/vue3-advanced/q006-watch-flush-pre-post-sync.md`

重点补强：

- `ref`、`reactive` 的代理和 `.value` 边界。
- `computed` 缓存和失效条件。
- `watch`、`watchEffect`、`flush` 的差异。
- 深层响应式和浅层响应式的性能取舍。

验收：

- 能从“依赖收集 -> 触发更新”讲清响应式。
- 对比表要覆盖 API、触发时机、适用场景。
- 示例贴近表单、接口请求、列表渲染。

### 批次 2.2：组件和模板机制

范围：

- `docs/interview/vue/vue3-core/q003-setup-this.md`
- `docs/interview/vue/vue3-core/q004-script-setup-props-emits.md`
- `docs/interview/vue/vue3-core/q005-v-if-v-show.md`
- `docs/interview/vue/vue3-core/q006-v-for-key-key.md`
- `docs/interview/vue/vue3-core/q007-props-emit.md`
- `docs/interview/vue/vue3-core/q010-nexttick.md`

重点补强：

- `setup` 执行时机和不能访问 `this` 的原因。
- `script setup` 编译期宏。
- `v-if` 和 `v-show` 的渲染成本。
- `key` 对 diff 的影响。
- `nextTick` 和 DOM 更新队列。

验收：

- 每题都能落到组件渲染或更新机制。
- 有真实组件代码片段。
- 易错点覆盖“能用但不该这么用”的场景。

### 批次 2.3：Vue 进阶和组合式封装

范围：

- `docs/interview/vue/vue3-advanced/q001-usefetch-composable.md`
- `docs/interview/vue/vue3-advanced/q003-composable.md`
- `docs/interview/vue/vue3-advanced/q004-markraw-toraw.md`
- `docs/interview/vue/vue3-advanced/q005-topic.md`
- `docs/interview/vue/vue3-advanced/q007-topic.md`
- `docs/interview/vue/vue3-advanced/q008-reactive.md`

重点补强：

- composable 的输入、输出、清理、取消、错误处理。
- 请求取消、竞态、缓存、重试。
- 大列表性能优化。
- `markRaw`、`toRaw` 的使用边界。

验收：

- 示例要优先关联 `src/composables/useFetch.ts` 或已有练习代码。
- 说明工程取舍，不只讲 API。

### 批次 2.4：Pinia

范围：

- `docs/interview/pinia/core/q001-pinia-vuex.md`
- `docs/interview/pinia/core/q002-store-state-getters-actions.md`
- `docs/interview/pinia/core/q016-storetorefs.md`
- `docs/interview/pinia/advanced/q001-pinia-api.md`
- `docs/interview/pinia/advanced/q006-pinia-actions.md`
- `docs/interview/pinia/advanced/q009-pinia-state-subscribe.md`

重点补强：

- Pinia 和 Vuex 的设计差异。
- Setup Store 和 Option Store。
- `storeToRefs` 为什么保留响应性。
- action 异步、订阅、持久化、测试。

验收：

- 每题都有项目中的使用场景。
- 对比不只停留在“更简单”。

### 批次 2.5：Vue Router

范围：

- `docs/interview/vue-router/core/q001-vue-router.md`
- `docs/interview/vue-router/core/q002-router-link-router-push.md`
- `docs/interview/vue-router/core/q004-props.md`
- `docs/interview/vue-router/core/q007-beforeeach.md`
- `docs/interview/vue-router/core/q009-meta.md`
- `docs/interview/vue-router/core/q012-navigation-failure.md`

重点补强：

- 路由匹配、跳转、导航守卫流程。
- query、params、props 的差异。
- meta 在权限、布局、埋点中的用途。
- 导航失败和重复跳转处理。

验收：

- 有完整导航流程说明。
- 场景对比覆盖后台系统、权限路由、详情页参数。

## 阶段 3：B 级文件共性补薄

目标：解决审计报告中最普遍的薄弱章节。

### 批次 3.1：补 `使用场景说明和对比`

范围：

- 审计报告中 B 级且偏薄项包含 `使用场景说明和对比` 的文件。

做法：

- 概念题补“什么时候用、什么时候不用、替代方案”。
- API 题补“相近 API 对比表”。
- 框架题补“项目场景和反例”。

验收：

- 每题至少一个对比表或三段式场景说明。

### 批次 3.2：补 `知识点系统梳理`

范围：

- 审计报告中 B 级且偏薄项包含 `知识点系统梳理` 的文件。

做法：

- 机制题按“定义 -> 原理 -> 关键机制 -> 边界 -> 对比 -> 影响”补齐。
- 输出顺序题用步骤编号。
- 框架题用生命周期或数据流说明。

验收：

- 不再只有一句泛泛解释。
- 读者能照着这一节口述答案。

### 批次 3.3：补 `实战应用举例`

范围：

- 审计报告中 B 级且偏薄项包含 `实战应用举例` 的文件。

做法：

- JavaScript 手写题补可运行 JS。
- Vue 题补组件或 composable 示例。
- 工程题补真实业务场景，如表单、列表、权限、接口请求、性能优化。

验收：

- 实现题至少一个完整代码块。
- 非实现题至少一个项目场景例子。

## 阶段 4：D 级文件处理

目标：减少聚合题库和 raw 文件对主复习路径的干扰。

### 批次 4.1：JavaScript 聚合题库

范围：

- `docs/interview/javascript/question-bank-150.md`
- `docs/interview/javascript/question-bank-300.md`

处理建议：

- 保留为索引或备用题库，不强行改成 12 段结构。
- 如果某题在路线中高频出现，再拆成单题文件。
- README 中标注“聚合题库，不参与结构评分”。

### 批次 4.2：Vue 聚合题库和 raw 文件

范围：

- `docs/interview/vue/question-bank-110/`
- `docs/interview/vue/question-bank-extra-65/`
- `docs/interview/vue/question-bank-extra-65-raw/`
- `docs/interview/vue/question-bank-2025.md`
- `docs/interview/vue/question-bank-2025-with-answers.md`

处理建议：

- raw 文件优先归档或标记为来源材料。
- 已拆分成单题的内容优先优化单题文件。
- 不重复维护同一题的多个版本。

验收：

- 主路线不直接链接 D 级聚合文件。
- 聚合文件有明确说明：来源、用途、是否参与复习。

## 阶段 5：自动审计和复盘

每完成一个批次执行：

```sh
pnpm audit:interview
```

记录：

- A/B/C/D 数量变化。
- 本批处理文件列表。
- 仍然偏薄的章节。
- 下一批优先级。

建议把批次复盘写入：

```text
docs/notes/weekly-review.md
```

## 执行顺序

1. 阶段 1：路线高频 JavaScript 题。
2. 阶段 2：Vue 主线题。
3. 阶段 3：按共性薄弱章节扫 B 级文件。
4. 阶段 4：处理 D 级聚合/raw 文件。
5. 阶段 5：每批审计和复盘。

## 暂不做

- 不批量重写全部 `docs/interview/`。
- 不把聚合题库全部拆成单题。
- 不为了评分机械扩写空话。
- 不新增复杂生成器；现阶段 `pnpm audit:interview` 足够。

## 第一批建议启动清单

优先处理这 6 个文件：

1. `docs/interview/javascript/core/001-javascript.md`
2. `docs/interview/javascript/core/002-typeof-null.md`
3. `docs/interview/javascript/core/003-question.md`
4. `docs/interview/javascript/core/004-question.md`
5. `docs/interview/javascript/core/005-javascript-undefined-null.md`
6. `docs/interview/javascript/core/006-question.md`

处理完成后运行：

```sh
pnpm audit:interview
```

如果这批文件都达到 A 或接近 A，再进入批次 1.2。
