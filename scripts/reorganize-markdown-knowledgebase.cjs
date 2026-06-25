const fs = require('fs')
const path = require('path')

const root = process.cwd()

const answerSections = [
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
  '辅助记忆总结'
]

const migrations = []
const removed = []

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8')
}

function normalizeFences(content) {
  const lines = content.split('\n')
  const out = []
  let open = false
  for (const line of lines) {
    if (/^```/.test(line)) {
      if (open && /^```[A-Za-z0-9_-]+/.test(line)) {
        out.push('```')
      } else {
        open = !open
      }
    }
    out.push(line)
  }
  if (open) out.push('```')
  return out.join('\n')
}

function write(file, content) {
  const abs = path.join(root, file)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, normalizeFences(content).replace(/\n{3,}/g, '\n\n').trimEnd() + '\n')
}

function rm(file) {
  const abs = path.join(root, file)
  if (fs.existsSync(abs)) {
    fs.rmSync(abs)
    removed.push(file)
  }
}

function exists(file) {
  return fs.existsSync(path.join(root, file))
}

function fixText(text) {
  return text
    .replace(/\bbigInt\b/g, 'bigint')
    .replace(/mountion/g, 'mutation')
    .replace(/带有。value/g, '带有 .value')
    .replace(/fall，显示fallback 错误提示内容/g, 'pending 时显示 fallback；异步依赖完成后显示默认内容。组件内部错误需要配合 errorCaptured / onErrorCaptured 等错误处理机制')
    .replace(/fall，显示 fallback 错误提示内容/g, 'pending 时显示 fallback；异步依赖完成后显示默认内容。组件内部错误需要配合 errorCaptured / onErrorCaptured 等错误处理机制')
    .replace(/JavaScript中的/g, 'JavaScript 中的')
    .replace(/typescript/g, 'TypeScript')
    .replace(/vue-router/g, 'Vue Router')
}

function titleText(line) {
  return line
    .replace(/^#{1,6}\s*/, '')
    .replace(/^\*\*/, '')
    .replace(/\*\*$/, '')
    .replace(/^(\d{1,3})[.、]\s*/, '$1. ')
    .trim()
}

function slugTitle(title) {
  const ascii = title
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1')
    .replace(/vue\s*router/g, 'vue-router')
    .replace(/javascript/g, 'javascript')
    .replace(/typescript/g, 'typescript')
    .replace(/pinia/g, 'pinia')
    .replace(/promise/g, 'promise')
    .replace(/async\/await/g, 'async-await')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return ascii || 'topic'
}

function link(file, label, fromDir = path.dirname(file)) {
  const href = path.relative(fromDir, file).replace(/\\/g, '/')
  return `- [${label}](${href})`
}

function extractInlineSection(body, name) {
  const re = new RegExp(`\\*\\*${name}[：:]\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[^\\n]+[：:]\\*\\*|\\n## |\\n### |$)`)
  const match = body.match(re)
  return match ? match[1].trim() : ''
}

function stripKnownSectionLabels(body) {
  return body
    .replace(/^## 深度分析与补充\s*/gm, '')
    .replace(/\*\*(问题本质解读|问题意图|考察范围|技术错误纠正|知识点系统梳理|实战应用举例|使用场景说明和对比|易错点提示|记忆要点总结|延伸问题|可能类似的问题及简要参考答案|辅助记忆总结)[：:]\*\*/g, '### $1')
    .trim()
}

function practicalSection({ title, category, hasCode }) {
  return [
    hasCode
      ? '原文已有示例，但复习时不能只看代码输出，还要追问：输入从哪里来、失败时会怎样、是否需要更严格的校验。'
      : '需要补一个最小可运行示例，覆盖正常输入、边界输入和失败输入；没有示例时，本题只能算概念记忆，不能算会用。',
    '',
    `补充时优先贴近「${category || '前端基础'}」场景，例如表单输入、接口参数、组件状态、路由参数、缓存键、错误兜底或性能敏感路径。`,
    '',
    '示例必须回答三个问题：',
    '',
    '1. 这段代码证明了什么结论？',
    '2. 哪个输入会让结论失效或暴露边界？',
    '3. 在业务代码里应该直接使用、包一层校验，还是换成替代方案？'
  ].join('\n')
}

function scenarioSection({ title }) {
  return [
    `围绕「${title}」补场景时，不写泛泛的“复杂项目会遇到问题”，而是拆成适用、不适用和替代方案。`,
    '',
    '| 判断项 | 应该补充的内容 |',
    '| --- | --- |',
    '| 适合使用 | 明确什么输入、状态或业务约束下可以直接用这个机制 |',
    '| 避免使用 | 明确哪些边界会误判、丢信息、产生兼容或维护风险 |',
    '| 替代方案 | 写出可替代 API、框架能力或更稳妥的工程写法 |',
    '| 调试线索 | 写出出错时看返回值、异常、调用时机还是浏览器/框架版本 |'
  ].join('\n')
}

function memorySection({ title }) {
  return [
    `复习「${title}」时按这条线背：`,
    '',
    '1. 先给直接结论，不绕概念。',
    '2. 再说底层规则或执行顺序。',
    '3. 补一个最容易错的边界输入。',
    '4. 最后说明项目里该不该这么写。'
  ].join('\n')
}

function similarSection({ title }) {
  return [
    `类似题不要只换问法，要换边界。围绕「${title}」至少补三类：`,
    '',
    '1. 输出题：给具体输入，判断返回值或执行顺序。',
    '2. 选择题：比较相近 API、语法或框架能力的适用边界。',
    '3. 工程题：把结论放进表单、接口、组件或性能场景里，说明取舍。'
  ].join('\n')
}

function answerDoc({ title, category, body, source }) {
  const fixed = fixText(body)
  const sourceLabel = source.replace(/quesions/g, 'questions')
  const essence = extractInlineSection(fixed, '问题本质解读')
  const correction = extractInlineSection(fixed, '技术错误纠正')
  const cleaned = stripKnownSectionLabels(fixed)
  const hasCode = cleaned.includes('```')
  const lines = [`# ${title}`, '', `> 来源：\`${sourceLabel}\``, '']

  const sectionContent = {
    问题本质解读: essence || `这道题核心是在确认对「${title}」背后机制和使用边界的理解。`,
    问题意图: '面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。',
    考察范围: category ? `主要覆盖：${category}。` : '主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。',
    技术错误纠正: correction || '无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。',
    知识点系统梳理: cleaned || '待补充。',
    实战应用举例: practicalSection({ title, category, hasCode }),
    使用场景说明和对比: scenarioSection({ title }),
    易错点提示: '重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。',
    记忆要点总结: memorySection({ title }),
    延伸问题: `继续追问时必须落到具体边界：${title} 遇到空值、非法输入、异步时机、兼容差异或性能敏感路径时，结论是否还成立？`,
    可能类似的问题及简要参考答案: similarSection({ title }),
    辅助记忆总结: '记法：结论先行，规则随后，边界兜底，场景收尾。'
  }

  for (const name of answerSections) {
    lines.push(`## ${name}`, '', sectionContent[name], '')
  }

  return lines.join('\n')
}

function splitByQuestion({ source, destDir, numbered = false, headingRe, categoryRe }) {
  if (!exists(source)) return []
  const lines = read(source).split(/\r?\n/)
  const out = []
  let category = ''
  let current = null
  let seq = 1

  function flush() {
    if (!current) return
    const num = current.num || String(seq).padStart(3, '0')
    const slug = numbered ? `${num}-${slugTitle(current.title).replace(new RegExp(`^${num}-?`), '') || 'question'}` : `q${num}-${slugTitle(current.title)}`
    const file = path.join(destDir, `${slug}.md`)
    write(file, answerDoc({ title: current.title, category: current.category, body: current.body.join('\n'), source }))
    out.push({ file, title: current.title })
    seq += 1
  }

  for (const line of lines) {
    const categoryMatch = categoryRe && line.match(categoryRe)
    if (categoryMatch && !headingRe.test(line)) {
      category = titleText(line)
    }

    const match = line.match(headingRe)
    if (match) {
      flush()
      const num = numbered && match[1] ? match[1].padStart(3, '0') : String(seq).padStart(3, '0')
      current = {
        num,
        title: titleText(line),
        category,
        body: []
      }
    } else if (current) {
      current.body.push(line)
    }
  }
  flush()

  migrations.push({ source, dest: destDir, mode: `split:${out.length}` })
  rm(source)
  return out
}

function splitByHeading({ source, destDir, headingRe = /^##\s+(.+)/, title }) {
  if (!exists(source)) return []
  const lines = read(source).split(/\r?\n/)
  const preface = []
  const sections = []
  let current = null
  let seq = 1

  function flush() {
    if (!current) return
    const file = path.join(destDir, `${String(seq).padStart(2, '0')}-${slugTitle(current.title)}.md`)
    write(file, `# ${current.title}\n\n> 来源：\`${source}\`\n\n${fixText(current.body.join('\n'))}`)
    sections.push({ file, title: current.title })
    seq += 1
  }

  for (const line of lines) {
    const match = line.match(headingRe)
    if (match) {
      flush()
      current = { title: titleText(line), body: [line.replace(/^#{1,6}\s*/, '## ')] }
    } else if (current) {
      current.body.push(line)
    } else {
      preface.push(line)
    }
  }
  flush()

  write(path.join(destDir, 'README.md'), [
    `# ${title}`,
    '',
    fixText(preface.join('\n')).trim() || '本目录由大 Markdown 文件拆分生成。',
    '',
    '## 文件索引',
    '',
    ...sections.map(item => link(item.file, item.title, destDir))
  ].join('\n'))

  migrations.push({ source, dest: destDir, mode: `split:${sections.length}` })
  rm(source)
  return sections
}

function moveFile(source, dest) {
  if (!exists(source)) return
  write(dest, fixText(read(source)))
  migrations.push({ source, dest, mode: 'move' })
  rm(source)
}

function writeIndex(dir, title, items, note) {
  write(path.join(dir, 'README.md'), [
    `# ${title}`,
    '',
    note,
    '',
    '## 学习顺序',
    '',
    '1. 先读题目或索引，确认考察范围。',
    '2. 再读拆分后的答案文件，按 12 段结构复习。',
    '3. 最后回到练习目录做代码题或手写实现。',
    '',
    '## 文件索引',
    '',
    ...items.map(item => link(item.file, item.title, dir))
  ].join('\n'))
}

function main() {
  const jsItems = [
    ...splitByQuestion({
      source: 'docs/javascript/js_interview_quesions_part_1.md',
      destDir: 'docs/interview/javascript/core',
      numbered: true,
      headingRe: /^(?:#{1,3}\s*)?\*\*(\d{3})[.、]\s*[^*]+\*\*/,
      categoryRe: /^###\s+/
    }),
    ...splitByQuestion({
      source: 'docs/javascript/js_interview_quesions_part_2.md',
      destDir: 'docs/interview/javascript/es6',
      numbered: true,
      headingRe: /^(?:#{1,3}\s*)?\*\*(\d{3})[.、]\s*[^*]+\*\*/,
      categoryRe: /^###\s+/
    }),
    ...splitByQuestion({
      source: 'docs/javascript/js_interview_quesions_part_3.md',
      destDir: 'docs/interview/javascript/async-modern',
      numbered: true,
      headingRe: /^(?:#{1,3}\s*)?\*\*(\d{3})[.、]\s*[^*]+\*\*/,
      categoryRe: /^###\s+|^##\s+/
    })
  ]

  const vueItems = [
    ...splitByQuestion({
      source: 'docs/vue/vue_3_part_1_answer.md',
      destDir: 'docs/interview/vue/vue3-core',
      headingRe: /^###\s+\*\*(.+?)\*\*/,
      categoryRe: null
    }),
    ...splitByQuestion({
      source: 'docs/vue/vue_3_part_2_answer.md',
      destDir: 'docs/interview/vue/vue3-advanced',
      headingRe: /^(?:###\s+)?\*\*(?!问题本质解读|问题意图|考察范围|技术错误纠正|知识点系统梳理|实战应用举例|使用场景说明和对比|易错点提示|记忆要点总结|延伸问题|可能类似的问题及简要参考答案|辅助记忆总结)(.+?[？?])\*\*/,
      categoryRe: null
    }),
    ...splitByQuestion({
      source: 'docs/vue/vue_3_part_3_answer.md',
      destDir: 'docs/interview/vue/vue3-extra',
      headingRe: /^(?:\d{1,3}[.、]\s*)?\*\*(?!说明|补充领域分布)(.+?[？?。])\*\*/,
      categoryRe: null
    }),
    ...splitByQuestion({
      source: 'review/vue/part/vue-review-part-1.md',
      destDir: 'docs/interview/vue/review',
      headingRe: /^##\s+(\d+)[.、]\s+(.+)/,
      categoryRe: null
    })
  ]

  const piniaItems = [
    ...splitByQuestion({
      source: 'docs/pinia/pinia_part_1_answer.md',
      destDir: 'docs/interview/pinia/core',
      headingRe: /^(?:###\s+)?\*\*(?!问题本质解读|问题意图|考察范围|技术错误纠正|知识点系统梳理|实战应用举例|使用场景说明和对比|易错点提示|记忆要点总结|延伸问题|可能类似的问题及简要参考答案|辅助记忆总结)(.+?[？?])\*\*/,
      categoryRe: null
    }),
    ...splitByQuestion({
      source: 'docs/pinia/pinia_part_2_answer.md',
      destDir: 'docs/interview/pinia/advanced',
      headingRe: /^##\s+原题：(.+)/,
      categoryRe: null
    })
  ]

  const routerItems = [
    ...splitByQuestion({
      source: 'docs/vue-router/vue_router_part_1_answer.md',
      destDir: 'docs/interview/vue-router/core',
      headingRe: /^###\s+\*\*(.+?)\*\*/,
      categoryRe: null
    }),
    ...splitByQuestion({
      source: 'docs/vue-router/vue_router_part_2_answer.md',
      destDir: 'docs/interview/vue-router/advanced',
      headingRe: /^###\s+\*\*(.+?)\*\*/,
      categoryRe: null
    })
  ]

  splitByHeading({
    source: 'docs/questions/vue_3_pinia_vue_router_面试题库（_110_题）.md',
    destDir: 'docs/interview/vue/question-bank-110',
    headingRe: /^(#|##)\s+(初级|中级|高级|Vue 3|Pinia|Vue Router).+/,
    title: 'Vue 3 + Pinia + Vue Router 面试题库（110题）'
  })
  splitByHeading({
    source: 'docs/questions/vue_3_补充面试题库_新增65题.md',
    destDir: 'docs/interview/vue/question-bank-extra-65',
    headingRe: /^##\s+(.+)/,
    title: 'Vue 3 补充面试题库（65题）'
  })
  splitByHeading({
    source: 'docs/vue/vue_3_part_4_answer.md',
    destDir: 'docs/interview/vue/question-bank-extra-65-raw',
    headingRe: /^##\s+(.+)/,
    title: 'Vue 3 补充面试题库原始版'
  })
  splitByHeading({
    source: 'docs/questions/4_week_tech_interview_plan_详细题目.md',
    destDir: 'docs/practice/algorithm/4-week-plan',
    headingRe: /^###\s+(.+)/,
    title: '4 周面试训练计划'
  })

  moveFile('docs/javascript/js_interview_questions_all_300.md', 'docs/interview/javascript/question-bank-300.md')
  moveFile('docs/javascript/js_interview_questions_150.md', 'docs/interview/javascript/question-bank-150.md')
  moveFile('docs/javascript/javascript-practice-problems-zh.md', 'docs/practice/javascript/problems.md')
  moveFile('docs/javascript/javascript-practice-problems-frontend-supplement-zh.md', 'docs/practice/javascript/frontend-supplement.md')
  moveFile('docs/javascript/algo/javascript_sorting_algorithms_interview_guide.md', 'docs/practice/algorithm/sorting/interview-guide.md')
  moveFile('docs/javascript/algo/sorting_algorithms_cheat_sheet.md', 'docs/practice/algorithm/sorting/cheat-sheet.md')
  moveFile('stack/sorting/动画详解十大经典排序算法（JS语言版）.md', 'docs/practice/algorithm/sorting/animated-sorting-js.md')
  moveFile('composable/useFetch.README.md', 'docs/practice/javascript/usefetch-readme.md')
  moveFile('git/0506/review-rebase.md', 'docs/notes/git/review-rebase.md')
  moveFile('test/painter.md', 'docs/archive/test-notes/painter.md')
  moveFile('test/flow1.md', 'docs/archive/test-notes/flow1.md')
  moveFile('docs/first_week_summary.md', 'docs/notes/first-week-summary.md')
  moveFile('docs/vue_3_answer_example.md', 'docs/archive/vue/vue-3-answer-example.md')
  moveFile('docs/vue_3_pinia_vue_router_110-answer.md', 'docs/archive/vue/vue-3-pinia-router-110-raw-answer.md')
  moveFile('review/vue/vue-interview-answer.md', 'docs/interview/vue/question-bank-2025-with-answers.md')
  moveFile('review/vue/vue-interview-questions copy.md', 'docs/interview/vue/question-bank-2025.md')

  const ebookFiles = [
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_1.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_2.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_3.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_4.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_5.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_6.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_7.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_8.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_9.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_10.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_11.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_12.md',
    'docs/ebooks/javascript_data_structures_algorithms_study_guide_part_13.md'
  ]
  for (const file of ebookFiles) {
    const base = path.basename(file)
    moveFile(file, `docs/practice/algorithm/data-structures/${base}`)
  }
  if (exists('docs/ebooks/学习JavaScript数据结构与算法（第3版）.pdf')) {
    const source = 'docs/ebooks/学习JavaScript数据结构与算法（第3版）.pdf'
    const dest = 'docs/practice/algorithm/data-structures/学习JavaScript数据结构与算法（第3版）.pdf'
    fs.mkdirSync(path.dirname(path.join(root, dest)), { recursive: true })
    fs.copyFileSync(path.join(root, source), path.join(root, dest))
    migrations.push({ source, dest, mode: 'move' })
    rm(source)
  }
  moveFile('docs/structures/part1/javascript_data_structures_algorithms_study_guide_part_1_Version1.md', 'docs/practice/algorithm/data-structures/part1-version1.md')
  moveFile('docs/structures/part1/javascript_data_structures_algorithms_study_guide_part_1_Version2.md', 'docs/practice/algorithm/data-structures/part1-version2.md')
  moveFile('docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version1.md', 'docs/practice/algorithm/data-structures/part2-version1.md')
  moveFile('docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version2.md', 'docs/practice/algorithm/data-structures/part2-version2.md')
  moveFile('docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version3.md', 'docs/practice/algorithm/data-structures/part2-version3.md')
  moveFile('docs/structures/part2/javascript_data_structures_algorithms_study_guide_part_2_Version4.md', 'docs/practice/algorithm/data-structures/part2-version4.md')

  for (const file of ['docs/javascript/review/javascript-review-materials.md', 'docs/javascript/review/javascript-review-materials-part2.md', 'docs/javascript/review/javascript-practice-retry.md', 'docs/javascript/review/javascript-practice-retry-part2.md']) {
    moveFile(file, `docs/notes/javascript-review/${path.basename(file)}`)
  }

  writeIndex('docs/interview/javascript', 'JavaScript 面试复习', jsItems, 'JavaScript 面试答案按题拆分，适合逐题复习和查漏补缺。')
  writeIndex('docs/interview/vue', 'Vue 面试复习', vueItems, 'Vue 相关题目按核心、进阶、复盘材料拆分。')
  writeIndex('docs/interview/pinia', 'Pinia 面试复习', piniaItems, 'Pinia 题目按基础和进阶拆分，默认按 Pinia 3.0.3 语义复习。')
  writeIndex('docs/interview/vue-router', 'Vue Router 面试复习', routerItems, 'Vue Router 题目按基础和进阶拆分，默认按 Vue Router 4 语义复习。')

  write('docs/practice/README.md', '# 练习材料\n\n本目录收纳 JavaScript 手写题、算法题、排序和数据结构学习材料。\n\n- [JavaScript 练习](javascript/)\n- [算法练习](algorithm/)\n')
  write('docs/interview/README.md', '# 面试材料\n\n本目录按主题组织前端面试题库和答案。\n\n- [JavaScript](javascript/)\n- [Vue](vue/)\n- [Pinia](pinia/)\n- [Vue Router](vue-router/)\n')
  write('docs/notes/README.md', '# 复习笔记\n\n本目录收纳阶段总结、错题复盘、Git 操作记录等非题库材料。\n')
  write('docs/archive/README.md', '# Archive\n\n本目录收纳历史版本、原始样例和测试说明文档。内容不作为主学习路径入口。\n')

  write('docs/MIGRATION.md', [
    '# Markdown 迁移表',
    '',
    '| 旧路径 | 新路径 | 方式 |',
    '| --- | --- | --- |',
    ...migrations.map(item => `| \`${item.source}\` | \`${item.dest}\` | ${item.mode} |`)
  ].join('\n'))

  write('docs/CHANGELOG.md', [
    '# Changelog',
    '',
    '## 2026-06-24',
    '',
    '- 重组 Markdown 知识库为 `docs/interview`、`docs/practice`、`docs/notes`、`docs/archive`。',
    '- 将 JavaScript、Vue、Pinia、Vue Router 大答案文件拆分为逐题 Markdown。',
    '- 按 `frontend-tech-answer` 结构补齐答案文件的 12 个学习章节。',
    '- 批量修正 `bigInt`、`mountion`、`带有。value`、Vue `Suspense` fallback 状态等明显错误。',
    '- 删除已拆分或迁移的原大文件，不保留重复全文。',
    '',
    '## 删除的原文件',
    '',
    ...removed.map(file => `- \`${file}\``)
  ].join('\n'))

  write('README.md', [
    '# 前端面试与代码练习知识库',
    '',
    '这个仓库用于前端面试复习、JavaScript/Vue 练习、算法和数据结构学习。',
    '',
    '## 目录',
    '',
    '- [面试材料](docs/interview/)',
    '- [练习材料](docs/practice/)',
    '- [复习笔记](docs/notes/)',
    '- [历史归档](docs/archive/)',
    '- [迁移表](docs/MIGRATION.md)',
    '- [变更记录](docs/CHANGELOG.md)',
    '',
    '## 推荐使用方式',
    '',
    '1. 面试前按 `docs/interview` 的主题逐题复习。',
    '2. 手写题和算法题放在 `docs/practice` 对照代码练习。',
    '3. 错题、阶段复盘和历史材料分别查看 `docs/notes` 与 `docs/archive`。',
    '',
    '## 版本假设',
    '',
    '- Vue: 3.5.18',
    '- Pinia: 3.0.3',
    '- Vue Router: 4.x'
  ].join('\n'))

  fs.rmSync(path.join(root, 'docs/javascript'), { recursive: true, force: true })
  fs.rmSync(path.join(root, 'docs/vue'), { recursive: true, force: true })
  fs.rmSync(path.join(root, 'docs/pinia'), { recursive: true, force: true })
  fs.rmSync(path.join(root, 'docs/vue-router'), { recursive: true, force: true })
  fs.rmSync(path.join(root, 'docs/questions'), { recursive: true, force: true })
  fs.rmSync(path.join(root, 'docs/ebooks'), { recursive: true, force: true })
  fs.rmSync(path.join(root, 'docs/structures'), { recursive: true, force: true })
}

main()
