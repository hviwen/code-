# 前端面试复习仓库实施计划

## 目标

把当前仓库整理成一个个人前端面试复习和练习系统，优先保证：

- 入口清晰：打开仓库后知道今天从哪里开始。
- 路线明确：JavaScript、Vue、Pinia、Vue Router、手写题、算法各有复习路径。
- 练习可跑：关键代码和手写题能用命令验证。
- 内容可扩展：新增题目、错题、练习代码时有固定位置。
- 不过度建设：暂不做复杂站点、搜索系统、自动化平台。

## 当前结构判断

| 区域 | 现状 | 定位 |
| --- | --- | --- |
| `README.md` | 已有目录和推荐使用方式 | 仓库总入口，需要补“今日怎么用”和路线链接 |
| `docs/interview/` | 面试题主体，内容最多 | 标准答案和主题索引 |
| `docs/practice/` | 练习材料和算法资料 | 题目说明、解题笔记、复盘材料 |
| `docs/notes/` | 阶段复盘和笔记 | 错题、复盘、临时总结 |
| `docs/archive/` | 历史归档 | 不参与主复习路线 |
| `src/` | 可复用代码、示例、数据结构 | 标准实现和可测试代码 |
| `practice/` | 练习代码 | 草稿、重写、阶段挑战 |
| `tests/` | 已有 `useFetch` 测试 | 需要接入真实测试命令 |

## 阶段 1：修复仓库入口

### 1.1 更新根 README

修改文件：`README.md`

新增内容：

```md
## 今日怎么用

1. 先从 `docs/roadmap/frontend-30-days.md` 选今天的任务。
2. 面试题先口述答案，再看标准答案。
3. 手写题先在 `practice/` 写一遍，再对照 `src/` 标准实现。
4. 错题和复盘写到 `docs/notes/`。
5. 可运行代码变更后执行 `pnpm test`。
```

验收标准：

- 根 README 能回答“我今天该看什么、写什么、验证什么”。
- README 不复制大段题目内容，只链接到路线和目录。

### 1.2 明确目录边界

修改文件：

- `README.md`
- `src/README.md`
- `practice/README.md`
- `docs/practice/README.md`

建议边界：

| 目录 | 放什么 | 不放什么 |
| --- | --- | --- |
| `docs/interview/` | 标准答案、题库索引 | 临时练习代码 |
| `docs/practice/` | 练习题说明、算法材料、解题思路 | 可执行草稿 |
| `docs/notes/` | 错题、复盘、阶段总结 | 标准题库正文 |
| `docs/archive/` | 迁移前材料、旧答案 | 主路线入口 |
| `src/` | 整理后的标准实现 | 临时试错代码 |
| `practice/` | 手写练习、草稿、挑战代码 | 最终可复用实现 |
| `tests/` | 可运行测试 | 学习笔记 |

验收标准：

- 新增内容时不用猜放哪里。
- 归档内容不会进入主复习路径。

## 阶段 2：增加复习路线

### 2.1 新建路线目录

新增目录：

```text
docs/roadmap/
```

新增文件：

```text
docs/roadmap/README.md
docs/roadmap/frontend-30-days.md
docs/roadmap/javascript-core.md
docs/roadmap/vue-core.md
docs/roadmap/handwrite-practice.md
```

### 2.2 路线文件职责

`docs/roadmap/README.md`

- 说明每条路线适合什么场景。
- 链接到 30 天路线、JavaScript 路线、Vue 路线、手写题路线。

`docs/roadmap/frontend-30-days.md`

- 每天只列 3 类任务：面试题、代码练习、复盘。
- 不复制答案，只链接现有文件。

示例：

```md
## Day 1：JavaScript 数据类型和判断

- [ ] 复习：`docs/interview/javascript/core/001-javascript.md`
- [ ] 复习：`docs/interview/javascript/core/002-typeof-null.md`
- [ ] 练习：手写 `typeOf` 辅助函数，放到 `practice/javascript/`
- [ ] 复盘：错题写到 `docs/notes/`
```

`docs/roadmap/javascript-core.md`

- 按主题组织 JavaScript：数据类型、作用域、原型、异步、模块、浏览器机制。
- 链接到 `docs/interview/javascript/` 下已有题目。

`docs/roadmap/vue-core.md`

- 按主题组织 Vue：响应式、组件通信、生命周期、Composition API、性能、工程实践。
- 链接到 `docs/interview/vue/`、`docs/interview/pinia/`、`docs/interview/vue-router/`。

`docs/roadmap/handwrite-practice.md`

- 手写题路线：防抖、节流、深拷贝、Promise、new、call/apply/bind、排序、数据结构。
- 每题同时链接题目文档和练习代码位置。

验收标准：

- 路线文件只做导航和状态记录。
- 不生成重复答案。
- 每个任务都能落到一个现有文档或代码目录。

## 阶段 3：修复可运行测试

### 3.1 当前问题

`package.json` 当前 `test` 脚本固定失败：

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

但 `tests/useFetch.test.ts` 已存在测试，并使用 Jest 风格 API。

### 3.2 最小实施方案

优先使用 Node 内置 test runner，避免为个人练习仓库引入额外测试框架和原生依赖链。

需要变更：

- `package.json`
- `tests/useFetch.test.ts`
- `tests/setup.ts`

建议脚本：

```json
"scripts": {
  "test": "node --experimental-strip-types --test tests/*.test.ts"
}
```

测试文件改动方向：

- 从 `node:test` 引入 `describe`、`it`、`beforeEach`。
- 使用 `node:assert/strict` 做断言。
- 使用本地最小 fetch mock，不新增测试依赖。
- 在 `tests/setup.ts` 提供测试用 `localStorage`。

验收命令：

```sh
pnpm test
```

验收标准：

- `pnpm test` 不再固定失败。
- `useFetch` 现有测试能被运行。
- 如果测试暴露实现问题，先修实现，不跳过测试。

## 阶段 4：增加题目模板

### 4.1 新增模板目录

新增目录：

```text
docs/templates/
```

新增文件：

```text
docs/templates/interview-question.md
docs/templates/practice-problem.md
```

### 4.2 面试题模板

`docs/templates/interview-question.md`

```md
# 题目

## 一句话答案

## 核心原理

## 示例代码

## 易错点

## 关联题目
```

### 4.3 练习题模板

`docs/templates/practice-problem.md`

```md
# 题目

## 要求

## 输入输出

## 解题思路

## 代码位置

## 自测用例

## 复盘
```

验收标准：

- 新题可以直接复制模板创建。
- 模板短，不强迫所有旧题迁移。

## 阶段 5：建立错题和复盘闭环

### 5.1 新增错题文件

新增文件：

```text
docs/notes/wrong-answers.md
docs/notes/weekly-review.md
```

`docs/notes/wrong-answers.md` 建议格式：

```md
# 错题记录

## 2026-06-24

| 题目 | 问题 | 修正 | 下次复习 |
| --- | --- | --- | --- |
| 链接 | 没讲清原理 | 补充核心机制 | 2026-06-27 |
```

`docs/notes/weekly-review.md` 建议格式：

```md
# 周复盘

## 本周完成

## 不熟的问题

## 下周重点
```

验收标准：

- 每天复习后的错题有固定入口。
- 周复盘不散落在多个临时文件。

## 阶段 6：补齐练习代码验证方式

### 6.1 标准实现和练习草稿对应

推荐对应关系：

| 类型 | 标准实现 | 练习草稿 |
| --- | --- | --- |
| 防抖/节流 | `src/utils/`、`src/composables/` | `practice/javascript/` |
| 数据结构 | `src/data-structures/` | `practice/challenge/` |
| 排序算法 | `src/algorithms/sorting/` | `practice/challenge/sort.js` |
| Vue composable | `src/composables/` | `src/examples/vue/` |

### 6.2 每个核心实现至少一个自检

优先级：

1. 已有测试框架能覆盖的，放 `tests/`。
2. 不值得上测试框架的，文件末尾保留简单 `demo()` 或 `assert`。
3. 纯文档题不强制测试。

验收标准：

- 新增核心实现时能用一个命令或一个 demo 验证。
- 不为了覆盖率创建大量空测试。

## 阶段 7：更新变更记录

每完成一个阶段，更新：

```text
docs/CHANGELOG.md
```

建议格式：

```md
## 2026-06-24

- 新增复习路线目录 `docs/roadmap/`。
- 修复 `pnpm test` 测试入口。
- 新增题目模板和练习题模板。
```

验收标准：

- 只记录实际完成的变更。
- 不把计划项提前写成已完成。

## 推荐执行顺序

1. 阶段 1：修复入口和目录边界。
2. 阶段 3：让 `pnpm test` 可运行。
3. 阶段 2：新增路线目录和 30 天计划。
4. 阶段 4：新增模板。
5. 阶段 5：新增错题和复盘文件。
6. 阶段 6：逐步给核心练习补验证。
7. 阶段 7：同步变更记录。

## 暂不做

- 暂不做完整前端站点。
- 暂不做搜索系统。
- 暂不批量重写 300 多个题目文件。
- 暂不引入新的文档框架。
- 暂不追求测试覆盖率指标。

这些事情等路线文件和测试入口稳定后，再根据真实使用痛点决定。

## 最小完成定义

第一轮优化完成时，至少满足：

- 根 README 能指导当天复习。
- `docs/roadmap/frontend-30-days.md` 存在，并链接到现有题目。
- `pnpm test` 能运行。
- `docs/templates/` 有题目模板。
- `docs/notes/wrong-answers.md` 有错题记录格式。
- `docs/CHANGELOG.md` 记录本轮实际变更。
