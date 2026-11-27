# 前端知识库 · PDF 四版本

由 `~/Documents/ks` 的融合知识库生成，按大章节输出四种粒度，共 **60 份 PDF / 1992 页**。

| 版本 | 目录 | 页数 | 占原版 | 体积 | 说明 |
|---|---|---:|---:|---:|---|
| 原版 | `原版/` | 1194 | 100% | 8.0 MB | 全部字段、代码、示例与出处 |
| 标准版 | `标准版/` | 463 | **38.8%** | 4.7 MB | 按价值精选约 36% 条目，每条保留完整字段与代码 |
| 精简版 | `精简版/` | 250 | 20.9% | 5.4 MB | 全部条目，每题核心答案（≤130 字）+ 坑 |
| 最精简版 | `最精简版/` | 85 | 7.1% | 3.4 MB | 精选高频条目，单行问答，约为精简版的 1/3 |

## 字体与排版

| 用途 | 字体 |
|---|---|
| 正文（拉丁） | iA Writer Quattro S（回退 Avenir Next / Helvetica Neue） |
| 正文（中文） | Songti SC |
| 标题（拉丁 / 中文） | iA Writer Quattro S Bold / PingFang SC Semibold |
| 引用、坑点 | iA Writer Quattro S Italic（中文 Kaiti SC） |
| 标记、页眉、页码 | iA Writer Mono S |
| 代码块 | iA Writer Mono S（回退 JetBrains Mono / Menlo） |

版式：A4、封面、可点击目录（带页码）、页眉（当前子主题 / 页码）、PDF 书签（按子主题）。

## 表格与代码处理

- **表格列宽**：Pandoc 默认按 Markdown 分隔线短横数量分配列宽，原表常把「是否类型转换」这类列压成一字一行。构建时按每列实际内容宽度重写分隔线，并设置 `\arraystretch=1.28`、表格用 `\footnotesize`、`\LTleft=0pt`。
- **代码换行**：`fvextra` 开启 `breaklines,breakanywhere`，长代码行在页宽内折行（续行以 `↳` 标识），不再被裁切。
- **缺字**：表情、制表符（`─│┌`）、数学粗体字母在构建时映射为 ASCII/中文字符，避免 PDF 出现空白方块。

## 目录

```
ks-pdf/
├── 原版/           15 份
├── 标准版/         15 份
├── 精简版/         15 份
├── 最精简版/        15 份
├── md/{full,standard,refined,minimal}/
├── tex/{full,standard,refined,minimal}/
└── tools/
    ├── build.sh
    ├── build_docs.py
    └── header.tex
```

## 构建

```bash
bash tools/build.sh full        # 原版
bash tools/build.sh standard    # 标准版（38.8%）
bash tools/build.sh refined     # 精简版
bash tools/build.sh minimal     # 最精简版

# 单章
bash tools/build.sh standard 05-浏览器与网络
```

## 提炼规则

**标准版**
- 从每章全部条目中按「有代码 / 有坑点 / 已准入 / 篇幅」打分，精选约 36%；
- 每条保留完整字段（问题、意图、答案、边界、误区、追问）与代码；
- 目标为原版正文的 36%，实际页数 38.8%。

**精简版**
- 全部条目；保留核心答案（≤130 字）与常见误区（≤55 字）；
- 丢弃代码、来源、审校、追问、项目表达。

**最精简版**
- 按价值精选约 40% 条目；每题一行：`**问题** 答案（坑：……）`；
- 目标为精简版的 40%，实际页数 34%。

## 依赖

- Pandoc 3.14
- TinyTeX / XeLaTeX（`~/Library/TinyTeX`）
- 宏包：`ctex xeCJK zhnumber soul caption booktabs longtable fvextra microtype unicode-math bookmark xurl upquote enumitem titlesec fancyhdr xcolor hyperref geometry fontspec amsmath etoolbox array`
- 字体：`~/Library/Fonts` 下的 iA Writer Quattro S / Mono S，系统 Avenir Next、Helvetica Neue、Songti SC、PingFang SC

## 已知限制

- 章节内子主题沿用原文档归类，少数跨领域条目位置可能不理想。
- 标准版是精选子集，不覆盖全部条目；需要全量覆盖请用原版或精简版。
- 精简版为抽取式截取，不是重写；极少数答案会在字数上限处截断（以「…」标记）。
- 原版包含长代码行，已自动折行，个别标识符会在任意位置断行。
