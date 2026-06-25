# Changelog

## 2026-06-24 第一轮优化

- 新增 `docs/notes/interview-optimization-plan.md`，按审计报告和判别模板规划 `docs/interview/` 分阶段优化批次。
- 新增 `docs/templates/interview-answer-evaluator.md`，基于 `$frontend-tech-answer` 提供面试答案增强判别模板。
- 新增 `scripts/audit-interview-content.cjs` 和 `pnpm audit:interview`，用于审计 `docs/interview/` 内容结构并生成报告。
- 新增 `docs/roadmap/` 复习路线，包括 30 天路线、JavaScript、Vue 和手写题路线。
- 新增 `docs/templates/` 题目模板和练习题模板。
- 新增错题记录和周复盘入口：`docs/notes/wrong-answers.md`、`docs/notes/weekly-review.md`。
- 更新 README 和目录说明，明确 `docs/interview`、`docs/practice`、`docs/notes`、`src`、`practice`、`tests` 的边界。
- 接入 Node 内置 test runner，修复 `pnpm test` 测试入口，并调整 `useFetch` 测试。
- 修复 `useFetch` pending request 清理在拒绝时可能产生未处理拒绝的问题。
- 将包类型调整为 ESM，并把 Markdown 重组脚本改为 `.cjs` 保留 CommonJS 运行方式。

## 2026-06-24 初始迁移

- 重组 Markdown 知识库为 `docs/interview`、`docs/practice`、`docs/notes`、`docs/archive`。
- 将 JavaScript、Vue、Pinia、Vue Router 大答案文件拆分为逐题 Markdown。
- 按 `frontend-tech-answer` 结构补齐答案文件的 12 个学习章节。
- 批量修正 `bigInt`、`mountion`、`带有。value`、Vue `Suspense` fallback 状态等明显错误。
- 删除已拆分或迁移的原大文件，不保留重复全文。

## 删除的原文件

- `docs/javascript/js_interview_quesions_part_1.md`
- `docs/javascript/js_interview_quesions_part_2.md`
- `docs/javascript/js_interview_quesions_part_3.md`
- `docs/vue/vue_3_part_1_answer.md`
- `docs/vue/vue_3_part_2_answer.md`
- `docs/vue/vue_3_part_3_answer.md`
- `review/vue/part/vue-review-part-1.md`
- `docs/pinia/pinia_part_1_answer.md`
- `docs/pinia/pinia_part_2_answer.md`
- `docs/vue-router/vue_router_part_1_answer.md`
- `docs/vue-router/vue_router_part_2_answer.md`
- `docs/questions/vue_3_pinia_vue_router_面试题库（_110_题）.md`
- `docs/questions/vue_3_补充面试题库_新增65题.md`
- `docs/vue/vue_3_part_4_answer.md`
- `docs/questions/4_week_tech_interview_plan_详细题目.md`
- `docs/javascript/js_interview_questions_all_300.md`
- `docs/javascript/js_interview_questions_150.md`
- `docs/javascript/javascript-practice-problems-zh.md`
- `docs/javascript/javascript-practice-problems-frontend-supplement-zh.md`
- `docs/javascript/algo/javascript_sorting_algorithms_interview_guide.md`
- `docs/javascript/algo/sorting_algorithms_cheat_sheet.md`
- `stack/sorting/动画详解十大经典排序算法（JS语言版）.md`
- `composable/useFetch.README.md`
- `git/0506/review-rebase.md`
- `test/painter.md`
- `test/flow1.md`
- `docs/first_week_summary.md`
- `docs/vue_3_answer_example.md`
- `docs/vue_3_pinia_vue_router_110-answer.md`
- `review/vue/vue-interview-answer.md`
- `review/vue/vue-interview-questions copy.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_1.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_2.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_3.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_4.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_5.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_6.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_7.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_8.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_9.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_10.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_11.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_12.md`
- `docs/ebooks/javascript_data_structures_algorithms_study_guide_part_13.md`
- `docs/ebooks/学习JavaScript数据结构与算法（第3版）.pdf`
- `docs/structures/part1/javascript_data_structures_algorithms_study_guide_part_1_Version1.md`
- `docs/structures/part1/javascript_data_structures_algorithms_study_guide_part_1_Version2.md`
- `docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version1.md`
- `docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version2.md`
- `docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version3.md`
- `docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version4.md`
- `docs/javascript/review/javascript-review-materials.md`
- `docs/javascript/review/javascript-review-materials-part2.md`
- `docs/javascript/review/javascript-practice-retry.md`
- `docs/javascript/review/javascript-practice-retry-part2.md`
