const fs = require('fs')
const path = require('path')

const root = process.cwd()
const interviewDir = path.join(root, 'docs/interview')
const reportFile = path.join(root, 'docs/notes/interview-audit-report.md')
const scopeArgs = process.argv.slice(2)

const requiredSections = [
  '问题本质解读',
  '问题意图',
  '考察范围',
  '技术错误纠正',
  '知识点系统梳理',
  '实战应用举例',
  '使用场景说明和对比',
  '易错点提示',
  '记忆要点总结',
  '延伸问题',
  '可能类似的问题及简要参考答案',
  '辅助记忆总结',
]

const weights = {
  问题本质解读: 10,
  问题意图: 10,
  考察范围: 10,
  技术错误纠正: 10,
  知识点系统梳理: 20,
  实战应用举例: 15,
  使用场景说明和对比: 10,
  易错点提示: 10,
  记忆要点总结: 2,
  延伸问题: 1,
  可能类似的问题及简要参考答案: 1,
  辅助记忆总结: 1,
}

const thinPatterns = [
  /待补充/,
  /原文已包含代码示例，见「知识点系统梳理」中的示例代码/,
  /重点关注术语表述、边界条件、运行时行为和浏览器\/框架版本差异/,
  /记住主线：定义\s*->\s*原理\s*->\s*边界\s*->\s*实战取舍/,
  /类似问题通常会换一种问法考察同一机制/,
  /用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错/,
]

const qualityRules = [
  {
    issue: '考察范围过泛',
    penalty: 6,
    test: sections => /^主要覆盖：(?:深度分析与补充|[^，。]+（\d+道）)。?$/.test(sections.考察范围),
  },
  {
    issue: '知识梳理混入模板标题',
    penalty: 8,
    test: sections =>
      /^###\s+(问题本质解读|技术错误纠正|知识点系统梳理|实战应用举例|记忆要点总结)/m.test(
        sections.知识点系统梳理,
      ),
  },
  {
    issue: '模板化占位表述',
    penalty: 8,
    test: (_sections, text) =>
      [
        /面试中通常用于判断候选人是否只会背结论/,
        /围绕「.+?」补场景时，不写泛泛的/,
        /示例必须回答三个问题/,
        /复习「.+?」时按这条线背/,
        /类似题不要只换问法，要换边界/,
        /记法：结论先行，规则随后，边界兜底，场景收尾/,
      ].some(pattern => pattern.test(text)),
  },
  {
    issue: '实战示例不可独立复习',
    penalty: 6,
    test: sections =>
      /原文已包含代码示例|需要补一个最小可运行示例/.test(sections.实战应用举例),
  },
  {
    issue: '场景对比不可迁移',
    penalty: 5,
    test: sections => !sections.使用场景说明和对比.includes('|'),
  },
  {
    issue: '正文过长需拆例',
    penalty: 3,
    test: (_sections, text) => Buffer.byteLength(text, 'utf8') > 14000,
  },
]

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(file)
    return entry.isFile() && entry.name.endsWith('.md') ? [file] : []
  })
}

function sectionBody(text, section) {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Match section body between ## header and next ## header or end of file.
  // Without 'm' flag so $ only matches true EOF (not line endings).
  const match = text.match(new RegExp(`(?:^|\\n)##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, ''))
  return match ? match[1].trim() : ''
}

function grade(score) {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

function isIndexFile(file) {
  return path.basename(file).toLowerCase() === 'readme.md'
}

function isAggregateFile(file) {
  return path.relative(root, file).split(path.sep).some(part => part.startsWith('question-bank'))
}

function resolveScope(arg) {
  const abs = path.resolve(root, arg)
  if (!fs.existsSync(abs)) {
    throw new Error(`Scope not found: ${arg}`)
  }
  return abs
}

function audit(file) {
  const text = fs.readFileSync(file, 'utf8')
  const missing = []
  const thin = []
  const sections = {}
  let score = 0

  for (const section of requiredSections) {
    const body = sectionBody(text, section)
    sections[section] = body
    if (!body) {
      missing.push(section)
      continue
    }

    const minLength = section === '知识点系统梳理' ? 120 : 24
    if (body.length < minLength || thinPatterns.some(pattern => pattern.test(body))) {
      thin.push(section)
      score += Math.floor(weights[section] * 0.4)
      continue
    }

    score += weights[section]
  }

  const qualityIssues = qualityRules
    .filter(rule => rule.test(sections, text))
    .map(rule => ({ issue: rule.issue, penalty: rule.penalty }))
  score = Math.max(0, score - qualityIssues.reduce((sum, item) => sum + item.penalty, 0))

  return {
    file: path.relative(root, file),
    score,
    grade: grade(score),
    missing,
    thin,
    qualityIssues: qualityIssues.map(item => item.issue),
  }
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1
    return acc
  }, {})
}

function topSectionGaps(results, key) {
  const counts = new Map()
  for (const result of results) {
    for (const section of result[key]) {
      counts.set(section, (counts.get(section) || 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function topQualityIssues(results) {
  const counts = new Map()
  for (const result of results) {
    for (const issue of result.qualityIssues) {
      counts.set(issue, (counts.get(issue) || 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function directorySummary(results) {
  const summary = new Map()
  for (const result of results) {
    const parts = result.file.split('/')
    const dir = parts.slice(0, Math.max(0, parts.length - 1)).join('/')
    if (!summary.has(dir)) summary.set(dir, { count: 0, A: 0, B: 0, C: 0, D: 0 })
    const item = summary.get(dir)
    item.count += 1
    item[result.grade] += 1
  }
  return [...summary.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

function render(results, skipped, scopes) {
  const gradeCounts = countBy(results, 'grade')
  const needsWork = results
    .filter(item => item.grade !== 'A')
    .sort(
      (a, b) =>
        a.score - b.score ||
        b.qualityIssues.length - a.qualityIssues.length ||
        a.file.localeCompare(b.file),
    )
    .slice(0, 30)

  const missingGaps = topSectionGaps(results, 'missing').slice(0, 12)
  const thinGaps = topSectionGaps(results, 'thin').slice(0, 12)
  const qualityGaps = topQualityIssues(results).slice(0, 12)

  const lines = [
    '# Interview 内容审计报告',
    '',
    `生成时间：${new Date().toISOString().slice(0, 10)}`,
    `审计范围：${scopes.map(scope => `\`${path.relative(root, scope) || '.'}\``).join('、')}`,
    '',
    '## 总览',
    '',
    `- 审计文件数：${results.length}`,
    `- 跳过索引/题库聚合文件：${skipped.length}`,
    `- A：${gradeCounts.A || 0}`,
    `- B：${gradeCounts.B || 0}`,
    `- C：${gradeCounts.C || 0}`,
    `- D：${gradeCounts.D || 0}`,
    '',
    '## 目录分布',
    '',
    '| 目录 | 文件数 | A | B | C | D |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...directorySummary(results).map(([dir, item]) => {
      return `| \`${dir}\` | ${item.count} | ${item.A} | ${item.B} | ${item.C} | ${item.D} |`
    }),
    '',
    '## 最常缺失的章节',
    '',
    '| 章节 | 文件数 |',
    '| --- | ---: |',
    ...missingGaps.map(([section, count]) => `| ${section} | ${count} |`),
    '',
    '## 最常偏薄的章节',
    '',
    '| 章节 | 文件数 |',
    '| --- | ---: |',
    ...thinGaps.map(([section, count]) => `| ${section} | ${count} |`),
    '',
    '## 最常见的质量问题',
    '',
    '| 问题 | 文件数 |',
    '| --- | ---: |',
    ...qualityGaps.map(([issue, count]) => `| ${issue} | ${count} |`),
    '',
    '## 优先优化文件',
    '',
    '| 文件 | 等级 | 分数 | 缺失 | 偏薄 | 质量问题 |',
    '| --- | --- | ---: | --- | --- | --- |',
    ...needsWork.map(item => {
      const missing = item.missing.length ? item.missing.join('、') : '-'
      const thin = item.thin.length ? item.thin.join('、') : '-'
      const qualityIssues = item.qualityIssues.length ? item.qualityIssues.join('、') : '-'
      return `| \`${item.file}\` | ${item.grade} | ${item.score} | ${missing} | ${thin} | ${qualityIssues} |`
    }),
    '',
    '## 使用建议',
    '',
    '1. 先处理质量问题，不要只补章节标题。',
    '2. 对 B 级文件优先清理模板化表述和无效范围；对 C/D 级文件再重写核心段落。',
    '3. 单题优化时使用 `docs/templates/interview-answer-evaluator.md`。',
  ]

  return lines.join('\n') + '\n'
}

const scopes = scopeArgs.length ? scopeArgs.map(resolveScope) : [interviewDir]
const allFiles = scopes.flatMap(scope => (fs.statSync(scope).isDirectory() ? walk(scope) : [scope]))
const skipped = allFiles.filter(file => isIndexFile(file) || isAggregateFile(file))
const files = allFiles.filter(file => file.endsWith('.md') && !isIndexFile(file) && !isAggregateFile(file))
const results = files.map(audit)
fs.mkdirSync(path.dirname(reportFile), { recursive: true })
fs.writeFileSync(reportFile, render(results, skipped, scopes))
console.log(`Audited ${results.length} files -> ${path.relative(root, reportFile)}`)
