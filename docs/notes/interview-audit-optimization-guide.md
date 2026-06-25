# Interview Audit Optimization Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 `docs/notes/interview-audit-report.md` 的当前审计结果，分批把 `docs/interview/` 从“结构达标但大量模板化”优化为可口述、可练习、可复盘的面试材料。

**Architecture:** 以审计脚本 `scripts/audit-interview-content.cjs` 作为机器门禁，以 `docs/templates/interview-answer-evaluator.md` 作为人工质量标准。执行时每批处理 8-12 个单题文件，只补当前薄弱章节，不批量重写已有正确内容；聚合题库先标注用途，不强行改成单题答案。

**Tech Stack:** Markdown、Node.js、`pnpm audit:interview`、`pnpm test`、`rg`。

---

## 1. 当前审计结论

本次重新运行：

```sh
pnpm audit:interview
```

当前 `docs/notes/interview-audit-report.md` 总览：

| 等级 | 文件数 | 处理判断 |
| --- | ---: | --- |
| A | 35 | 只抽查质量，不优先处理 |
| B | 165 | 内容基本可用，重点清理模板化尾段和薄弱章节 |
| C | 109 | 主力优化对象，多数是有主体内容但多个章节仍是模板占位 |
| D | 28 | 多为聚合题库/raw 资料，先做用途决策 |

按目录复核后的风险分布：

| 目录 | A | B | C | D | 主要问题 |
| --- | ---: | ---: | ---: | ---: | --- |
| `docs/interview/javascript/` | 31 | 10 | 109 | 2 | JS 单题数量最多，C 级集中在 `async-modern/`、`core/`、`es6/` |
| `docs/interview/vue/` | 4 | 100 | 0 | 26 | 单题多为 B，聚合题库占 D |
| `docs/interview/pinia/` | 0 | 28 | 0 | 0 | 全部 B，主要是模板化尾段 |
| `docs/interview/vue-router/` | 0 | 27 | 0 | 0 | 全部 B，主要是模板化尾段 |

最常见薄弱章节：

| 薄弱章节 | 文件数 | 处理方式 |
| --- | ---: | --- |
| `实战应用举例` | 303 | 补一个贴近前端项目的例子；实现题给可运行代码 |
| `辅助记忆总结` | 273 | 改成题目专属记忆句，不保留泛化模板 |
| `易错点提示` | 272 | 补 3-5 个真实边界，不写泛泛提示 |
| `记忆要点总结` | 272 | 压缩成 4-6 条可口述要点 |
| `可能类似的问题及简要参考答案` | 272 | 写 2-3 个相邻追问和短答 |
| `使用场景说明和对比` | 264 | 至少补一个对比表或“适合/不适合/替代方案” |
| `考察范围` | 130 | 补面试考察点和相邻追问范围 |

## 2. 审计报告审查结论

### 2.1 报告可信部分

- `pnpm audit:interview` 已把模板化句子纳入薄弱识别，例如“原文已包含代码示例”“重点关注术语表述”“记住主线”等。
- 当前 C 级文件并不一定完全不可用，很多是主体内容够长，但尾部 6-7 个章节仍是模板化内容。
- D 级主要是聚合题库或 raw 文件，不应直接按单题答案模板改写。

### 2.2 报告局限

- 审计脚本只能判断章节存在、长度和模板化句子，不能判断技术正确性。
- “A 级”只代表机器评分通过，不代表答案已经适合口述。
- “实战应用举例”被判薄最多，是因为很多文件用“原文已包含代码示例”代替了真正的项目例子。
- “考察范围”薄弱的文件通常还需要补相邻追问，否则复习时无法串联知识点。

### 2.3 执行原则

1. 不为了分数扩写空话。
2. 不重写已有正确主干，只替换模板化尾段和薄弱章节。
3. 单批 8-12 个文件，便于复查。
4. JS 高频路线优先，框架目录随后处理。
5. 聚合题库先做用途说明，不纳入单题质量改写。

## 3. 单题优化标准

每个单题文件完成后必须满足：

- 30 秒内能说出一句话结论。
- `考察范围` 能列出当前题和 2-4 个相邻追问点。
- `实战应用举例` 至少有一个真实前端场景；手写题要有可复制运行代码。
- `使用场景说明和对比` 要说明什么时候用、什么时候不用、替代方案是什么。
- `易错点提示` 至少 3 条，必须是具体边界。
- `辅助记忆总结` 是题目专属句子，不使用通用模板。

### 3.1 可复用改写模板

`使用场景说明和对比`：

```md
| 方案/概念 | 适合场景 | 不适合场景 | 注意点 |
| --- | --- | --- | --- |
| `Promise.all` | 多个任务互不依赖且都必须成功 | 允许部分失败的批量任务 | 一个失败会让整体 rejected |
| `Promise.allSettled` | 批量任务允许部分失败 | 后续逻辑依赖全部成功结果 | 需要逐项判断 status |

实际项目中，请求用户信息和权限都必须成功时用 `Promise.all`；批量上传文件允许部分失败时用 `Promise.allSettled`。
```

`易错点提示`：

```md
1. `Promise.all` 不是串行执行，Promise 创建后会并发推进。
2. `Promise.all` 任意一个 rejected，整体立即 rejected。
3. `Promise.allSettled` 不会进入 catch，需要检查每一项 `status`。
4. 传入的不是 Promise 时会被 `Promise.resolve` 包装。
5. 大量并发请求要配合并发控制，不能直接把几百个请求丢进 `Promise.all`。
```

`可能类似的问题及简要参考答案`：

```md
**Q：`Promise.all` 和 `Promise.race` 的区别是什么？**  
A：`all` 等所有任务成功，`race` 只跟随最先 settled 的任务。

**Q：批量请求部分失败时如何处理？**  
A：用 `Promise.allSettled` 收集所有结果，再分别处理 fulfilled 和 rejected 项。
```

`辅助记忆总结`：

```md
一句话记：`all` 要全成，`allSettled` 全记录，`race` 抢第一个。
```

## 4. 分阶段执行计划

### Phase 0：审计基线固定

**目标：** 确保后续批次都基于同一审计口径。

**Files:**
- Read: `scripts/audit-interview-content.cjs`
- Read: `docs/notes/interview-audit-report.md`
- Modify: `docs/notes/weekly-review.md`

- [ ] Step 1: 运行审计。

```sh
pnpm audit:interview
```

Expected:

```text
Audited 337 files -> docs/notes/interview-audit-report.md
```

- [ ] Step 2: 记录本轮基线。

在 `docs/notes/weekly-review.md` 追加：

```md
### Interview 审计优化基线

- 审计命令：`pnpm audit:interview`
- 当前基线：A 35 / B 165 / C 109 / D 28
- 优先处理：C 级单题文件、B 级模板化尾段、D 级聚合文件用途标注
```

### Phase 1：JavaScript C 级单题优先

**目标：** 先处理 `docs/interview/javascript/` 下 C 级文件，因为它们数量最多且复习路线依赖最高。

**Files:**
- Modify: `docs/interview/javascript/async-modern/*.md`
- Modify: `docs/interview/javascript/core/*.md`
- Modify: `docs/interview/javascript/es6/*.md`

执行批次：

| 批次 | 文件范围 | 处理重点 |
| --- | --- | --- |
| 1.1 | `async-modern/118-127` | Promise API、错误传播、组合方法 |
| 1.2 | `async-modern/129-140` | async/await、事件循环输出题 |
| 1.3 | `async-modern/141-150` | 模块化、tree-shaking、Proxy/Reflect、BigInt |
| 1.4 | `core/020-030` | 函数、IIFE、柯里化、回调地狱 |
| 1.5 | `core/034-045` | 对象 API、属性判断、new、原型相关补漏 |
| 1.6 | `es6/046-070` | let/const、箭头函数、解构、默认参数、rest |
| 1.7 | `es6/071-097` | class、模块语法、getter/setter、decorator |
| 1.8 | `es6/098-115` | Symbol、Iterator、Set、Map、WeakMap |

每批执行步骤：

- [ ] Step 1: 找出本批模板化章节。

```sh
rg -n "待补充|原文已包含代码示例|重点关注术语表述|记住主线|类似问题通常|用一句话记：先说" docs/interview/javascript/async-modern
rg -n "待补充|原文已包含代码示例|重点关注术语表述|记住主线|类似问题通常|用一句话记：先说" docs/interview/javascript/core
rg -n "待补充|原文已包含代码示例|重点关注术语表述|记住主线|类似问题通常|用一句话记：先说" docs/interview/javascript/es6
```

- [ ] Step 2: 对每个文件只替换薄弱章节。

替换顺序：

1. `考察范围`
2. `实战应用举例`
3. `使用场景说明和对比`
4. `易错点提示`
5. `记忆要点总结`
6. `可能类似的问题及简要参考答案`
7. `辅助记忆总结`

- [ ] Step 3: 跑审计。

```sh
pnpm audit:interview
```

Expected:

```text
Audited 337 files -> docs/notes/interview-audit-report.md
```

- [ ] Step 4: 本批不应再包含模板化句子。

```sh
rg -n "待补充|原文已包含代码示例|重点关注术语表述|记住主线|类似问题通常|用一句话记：先说" docs/interview/javascript/async-modern/118-promise.md docs/interview/javascript/async-modern/119-promise-then.md docs/interview/javascript/async-modern/121-promise-catch-try-catch.md docs/interview/javascript/async-modern/122-promise.md docs/interview/javascript/async-modern/123-promise-all-promise-allsettled.md docs/interview/javascript/async-modern/124-promise-race.md docs/interview/javascript/async-modern/125-promise.md docs/interview/javascript/async-modern/126-promise.md docs/interview/javascript/async-modern/127-promise.md
```

Expected for the completed batch: no matches. For later batches, use the exact file list from the batch table before running this command.

### Phase 2：框架目录 B 级尾段清理

**目标：** Vue、Pinia、Vue Router 多数是 B 级，主要问题是尾部章节模板化。这里不重写主体，只补真实场景。

**Files:**
- Modify: `docs/interview/vue/vue3-core/*.md`
- Modify: `docs/interview/vue/vue3-advanced/*.md`
- Modify: `docs/interview/pinia/**/*.md`
- Modify: `docs/interview/vue-router/**/*.md`

执行批次：

| 批次 | 文件范围 | 场景要求 |
| --- | --- | --- |
| 2.1 | Vue 响应式核心 | 表单、接口请求、列表渲染、性能取舍 |
| 2.2 | Vue 组件和模板 | props/emit、key、nextTick、条件渲染 |
| 2.3 | Vue 进阶 composable | 取消请求、竞态、清理副作用、复用边界 |
| 2.4 | Pinia core/advanced | store 设计、异步 action、持久化、测试 |
| 2.5 | Vue Router core | 权限路由、详情页参数、导航失败、meta |

每批验收：

```sh
pnpm audit:interview
rg -n "重点关注术语表述|记住主线|类似问题通常|用一句话记：先说" docs/interview/vue docs/interview/pinia docs/interview/vue-router
```

Expected: 本批文件 no matches。

### Phase 3：D 级聚合题库用途决策

**目标：** 让聚合题库不干扰主复习路径。

**Files:**
- Modify: `docs/interview/javascript/question-bank-150.md`
- Modify: `docs/interview/javascript/question-bank-300.md`
- Modify: `docs/interview/vue/question-bank-110/**/*.md`
- Modify: `docs/interview/vue/question-bank-extra-65/**/*.md`
- Modify: `docs/interview/vue/question-bank-extra-65-raw/**/*.md`
- Modify: `docs/interview/vue/question-bank-2025.md`
- Modify: `docs/interview/vue/question-bank-2025-with-answers.md`

每个聚合文件顶部追加说明：

```md
> 说明：本文件是聚合题库/来源材料，不按单题答案结构维护。主复习路径优先使用已拆分的 `docs/interview/**` 单题文件；只有当某题尚未拆分或需要查原始上下文时再回到本文件。
```

验收：

```sh
rg -n "聚合题库/来源材料" docs/interview/javascript/question-bank-150.md docs/interview/javascript/question-bank-300.md docs/interview/vue
pnpm audit:interview
```

## 5. 质量门禁

每完成一个批次必须运行：

```sh
pnpm audit:interview
pnpm test
```

每完成一个批次必须记录到 `docs/notes/weekly-review.md`：

```md
### YYYY-MM-DD Interview 优化批次 N

- 范围：
- 修改文件数：
- 审计结果：
- 仍然偏薄：
- 下一批：
```

## 6. 不做事项

- 不把 337 个文件一次性重写。
- 不把聚合题库全部拆成单题。
- 不新增复杂生成器。
- 不为了 A 级评分扩写空话。
- 不在不了解题意时机械替换模板。

## 7. 完成标准

整体完成需要同时满足：

1. `pnpm audit:interview` 中 C 级单题归零。
2. B 级文件不再包含模板化尾段。
3. D 级聚合文件都有用途说明。
4. `docs/roadmap/frontend-30-days.md` 涉及的复习题达到可口述标准。
5. `pnpm test` 通过。
