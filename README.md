# 前端面试与代码练习知识库

这个仓库用于前端面试复习、JavaScript/Vue 练习、算法和数据结构学习。

## 目录

- [面试材料](docs/interview/)
- [练习材料](docs/practice/)
- [复习笔记](docs/notes/)
- [历史归档](docs/archive/)
- [源码与示例](src/)
- [代码练习](practice/)
- [测试用例](tests/)
- [实施计划](docs/IMPLEMENTATION_PLAN.md)
- [迁移表](docs/MIGRATION.md)
- [变更记录](docs/CHANGELOG.md)

## 今日怎么用

1. 先从 [30 天复习路线](docs/roadmap/frontend-30-days.md) 选今天的任务。
2. 面试题先口述答案，再看标准答案。
3. 手写题先在 `practice/` 写一遍，再对照 `src/` 标准实现。
4. 错题和复盘写到 `docs/notes/`。
5. 可运行代码变更后执行 `pnpm test`。

## 推荐使用方式

1. 面试前按 `docs/interview` 的主题逐题复习。
2. 手写题和算法题放在 `docs/practice` 对照代码练习。
3. 错题、阶段复盘和历史材料分别查看 `docs/notes` 与 `docs/archive`。
4. 可复用代码从 `src` 查找，练习代码从 `practice` 查找。

## 目录边界

| 目录 | 用途 |
| --- | --- |
| `docs/interview/` | 标准答案、题库索引 |
| `docs/practice/` | 练习题说明、算法材料、解题思路 |
| `docs/notes/` | 错题、复盘、阶段总结 |
| `docs/archive/` | 迁移前材料和旧答案，不参与主复习路线 |
| `src/` | 整理后的标准实现和可测试代码 |
| `practice/` | 手写练习、草稿、阶段挑战 |
| `tests/` | 可运行测试 |

## 版本假设

- Vue: 3.5.18
- Pinia: 3.0.3
- Vue Router: 4.x
