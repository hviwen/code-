# JavaScript 数据结构与算法学习手册（第 3 版）- Part 12

> 参考书目：学习 JavaScript 数据结构与算法（第 3 版）。本文档以原创方式系统梳理，按书籍顺序每次只覆盖一个主要章节，兼顾初学者与有经验开发者。

## 目录

- [第 12 章：字符串算法（String Algorithms）](#第-12-章字符串算法string-algorithms)
  - [字符串算法｜知识点介绍](#字符串算法知识点介绍)
  - [字符串算法｜系统梳理](#字符串算法系统梳理)
  - [字符串算法｜使用示例](#字符串算法使用示例)
  - [字符串算法｜实战应用举例](#字符串算法实战应用举例)
  - [字符串算法｜常见面试问题](#字符串算法常见面试问题)
  - [字符串算法｜使用场景选择指南](#字符串算法使用场景选择指南)
  - [字符串算法｜记忆要点总结](#字符串算法记忆要点总结)

---

## 第 12 章：字符串算法（String Algorithms）

> 字符串算法关心“模式匹配”“相似性”“结构分析”。核心工具：KMP（线性匹配）、Rolling Hash/Rabin–Karp（哈希滑窗）、Z/Prefix 函数（自匹配）、Boyer–Moore（启发式跳跃）、Manacher（最长回文）。

### 字符串算法｜知识点介绍

- 字符表示：JS 字符串按 UTF-16 存储，存在代理对与组合字符问题；遍历时建议使用 for...of（按 Unicode 码点）。
- 核心问题：
  - 子串查找：KMP、Rabin–Karp、Boyer–Moore、Z 算法。
  - 回文检测：中心扩展、Manacher（线性）。
  - 多模式匹配：Trie/Aho–Corasick（见第 6 章 Trie 可做基础）。
  - 相似性：编辑距离（第 10 章）与最长公共子串/子序列。
- 复杂度概览：
  - KMP/Z：O(n + m)
  - Rabin–Karp：均摊 O(n + m)，最坏 O(nm)，双哈希可降碰撞概率。
  - Boyer–Moore：平均快，最坏 O(nm)。
  - Manacher：O(n)。

### 字符串算法｜系统梳理

- 选择依据：
  - 单模式匹配：先选 KMP/Z；非常长文本多次查询可用 RK 预处理滚动哈希加速；实际工程常用内置 indexOf + 兜底算法。
  - 多模式：Aho–Corasick（Trie+失败指针）；或多次 KMP（较慢）。
  - 回文：需要全局最长选 Manacher；仅判断或输出一个可中心扩展。
- 与其他主题的关系：
  - 与 DP：编辑距离、LCS 属于 DP（见第 10 章）。
  - 与 Trie：前缀检索、多关键词过滤（第 6 章）。
  - 与哈希：Rolling Hash 提供子串 O(1) 对比能力（均摊）。

> 设计小抄
>
> - 明确字符集与大小写/归一化需求（NFC/NFKC）。
> - 长文本多次查询：预处理（哈希/索引）。
> - 对回文/自匹配问题，用“扩展”或“Manacher/Z/Prefix”。

### 字符串算法｜使用示例

```js
// 1) KMP：前缀函数（最长相等前后缀 LPS）+ 线性匹配
function kmpBuildLPS(p) {
  const lps = Array(p.length).fill(0)
  for (let i = 1, len = 0; i < p.length; ) {
    if (p[i] === p[len]) {
      lps[i++] = ++len
    } else if (len) {
      len = lps[len - 1]
    } else {
      lps[i++] = 0
    }
  }
  return lps
}
function kmpSearch(s, p) {
  // 返回所有起点索引
  if (!p.length) return [0]
  const lps = kmpBuildLPS(p)
  const res = []
  for (let i = 0, j = 0; i < s.length; ) {
    if (s[i] === p[j]) {
      i++
      j++
      if (j === p.length) {
        res.push(i - j)
        j = lps[j - 1]
      }
    } else if (j) {
      j = lps[j - 1]
    } else {
      i++
    }
  }
  return res
}

// 2) Rabin–Karp：双哈希（BigInt），降低碰撞
function rkSearch(text, pattern) {
  if (!pattern.length) return [0]
  const base1 = 131n,
    mod1 = 1000000007n
  const base2 = 137n,
    mod2 = 1000000009n
  const m = BigInt(pattern.length)
  const n = BigInt(text.length)
  const pows1 = [1n],
    pows2 = [1n]
  for (let i = 1; i <= Number(n); i++) {
    pows1[i] = (pows1[i - 1] * base1) % mod1
    pows2[i] = (pows2[i - 1] * base2) % mod2
  }
  const pref1 = [0n],
    pref2 = [0n]
  for (let i = 0; i < Number(n); i++) {
    const x = BigInt(text.codePointAt(i))
    pref1[i + 1] = (pref1[i] * base1 + x) % mod1
    pref2[i + 1] = (pref2[i] * base2 + x) % mod2
  }
  let hp1 = 0n,
    hp2 = 0n
  for (let i = 0; i < Number(m); i++) {
    const x = BigInt(pattern.codePointAt(i))
    hp1 = (hp1 * base1 + x) % mod1
    hp2 = (hp2 * base2 + x) % mod2
  }
  const res = []
  for (let i = 0; i + Number(m) <= Number(n); i++) {
    const j = i + Number(m)
    const hs1 = (pref1[j] - ((pref1[i] * pows1[Number(m)]) % mod1) + mod1) % mod1
    const hs2 = (pref2[j] - ((pref2[i] * pows2[Number(m)]) % mod2) + mod2) % mod2
    if (hs1 === hp1 && hs2 === hp2) {
      // 由于有极小概率碰撞，做一次确认
      if (text.slice(i, j) === pattern) res.push(i)
    }
  }
  return res
}

// 3) Z-Algorithm：Z 数组（s 与 s[i..] 的最长公共前缀）
function zArray(s) {
  const n = s.length,
    Z = Array(n).fill(0)
  for (let l = 0, r = 0, i = 1; i < n; i++) {
    if (i <= r) Z[i] = Math.min(r - i + 1, Z[i - l])
    while (i + Z[i] < n && s[Z[i]] === s[i + Z[i]]) Z[i]++
    if (i + Z[i] - 1 > r) {
      l = i
      r = i + Z[i] - 1
    }
  }
  Z[0] = n
  return Z
}
function zSearch(text, pattern) {
  // 在 pattern+# + text 上做 Z
  const concat = pattern + '#' + text
  const Z = zArray(concat)
  const m = pattern.length
  const res = []
  for (let i = m + 1; i < concat.length; i++) if (Z[i] >= m) res.push(i - m - 1)
  return res
}

// 4) 最长回文子串：Manacher（O(n)）
function longestPalindrome(s) {
  if (s.length <= 1) return s
  const t = '^#' + s.split('').join('#') + '#$' // 统一奇偶长度
  const n = t.length
  const p = Array(n).fill(0)
  let center = 0,
    right = 0
  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * center - i
    if (i < right) p[i] = Math.min(right - i, p[mirror])
    while (t[i + (p[i] + 1)] === t[i - (p[i] + 1)]) p[i]++
    if (i + p[i] > right) {
      center = i
      right = i + p[i]
    }
  }
  let maxLen = 0,
    idx = 0
  for (let i = 1; i < n - 1; i++)
    if (p[i] > maxLen) {
      maxLen = p[i]
      idx = i
    }
  const start = (idx - maxLen) >> 1
  return s.slice(start, start + maxLen)
}
```

### 字符串算法｜实战应用举例

1. 关键字高亮（多出现位置）

```js
function highlightAll(text, query) {
  const hits = kmpSearch(text, query)
  let res = ''
  let last = 0
  for (const i of hits) {
    res += text.slice(last, i) + '<mark>' + text.slice(i, i + query.length) + '</mark>'
    last = i + query.length
  }
  res += text.slice(last)
  return res
}
```

2. 近似重复文本检测（Shingling + Rolling Hash）

```js
function shingles(text, k = 5) {
  // 句法简化：对码点切片
  const arr = Array.from(text)
  const res = []
  for (let i = 0; i + k <= arr.length; i++) res.push(arr.slice(i, i + k).join(''))
  return res
}
function jaccardSimilarity(a, b) {
  const sa = new Set(a),
    sb = new Set(b)
  let inter = 0
  for (const x of sa) if (sb.has(x)) inter++
  return inter / (sa.size + sb.size - inter)
}
// 用 Rolling Hash 可替代子串拷贝，以提升大文本性能（此处演示简版）。
```

3. 日志流实时检测关键词（Rabin–Karp 滑窗版本）

```js
function rkStream(pattern) {
  // 返回 push(chunk) => indices
  const base = 256n,
    mod = 1000000007n
  const m = BigInt(pattern.length)
  let powm = 1n
  for (let i = 0; i < Number(m) - 1; i++) powm = (powm * base) % mod
  let hp = 0n
  for (let i = 0; i < pattern.length; i++) hp = (hp * base + BigInt(pattern.charCodeAt(i))) % mod
  let buf = ''
  let hs = 0n
  let idx = 0
  return function push(chunk) {
    const res = []
    for (const ch of chunk) {
      const code = BigInt(ch.charCodeAt(0))
      buf += ch
      hs = (hs * base + code) % mod
      if (buf.length > Number(m)) {
        const out = BigInt(buf.charCodeAt(buf.length - Number(m) - 1))
        hs = (hs - ((out * powm) % mod) + mod) % mod
        buf = buf.slice(1)
      }
      if (buf.length === Number(m) && hs === hp) {
        // 低概率碰撞，做一次确认
        if (buf === pattern) res.push(idx - Number(m) + 1)
      }
      idx++
    }
    return res
  }
}
```

### 字符串算法｜常见面试问题

1. KMP 与 Rabin–Karp 的主要差异？
   - 答：KMP 通过部分匹配表避免回退文本指针，最坏线性；RK 用滚动哈希快速比较窗口，均摊好但需处理碰撞。
2. Z 与 KMP 有何联系？
   - 答：Prefix 函数与 Z 函数可互相转换，均反映字符串自匹配结构，用于线性模式匹配。
3. 为什么 Manacher 能 O(n)？
   - 答：利用回文对称性和当前最右回文边界，复用半径信息，摊还 O(1) 扩展。
4. Boyer–Moore 在工程中的作用？
   - 答：启发式坏字符/好后缀跳跃，平均性能好；现代库常综合多种策略。
5. JS 处理 Unicode 时要注意什么？
   - 答：UTF-16 代理对、组合字符、大小写规范化；按码点遍历（for...of/Array.from）更稳妥。

### 字符串算法｜使用场景选择指南

- 高可靠单模式匹配（最坏线性）：KMP/Z。
- 需要快速多次窗口对比：Rabin–Karp（可双哈希 + 位置确认）。
- 回文结构分析：Manacher。
- 多关键字过滤/审查：Trie + Aho–Corasick（或先用 Trie 粗过滤）。
- 简单/一次性：内置 indexOf/includes，必要时兜底为上述算法。

### 字符串算法｜记忆要点总结

- KMP：lps/next 表是灵魂；匹配失败不回退文本指针。
- RK：滑窗哈希，注意碰撞与溢出（可 BigInt + 双模）。
- Z/Prefix：刻画自匹配；能线性地做查找。
- Manacher：回文半径、中心与最右边界，统一奇偶长度后线性求解。

---

> 下一篇（Part 13，单独文件）将覆盖：并查集/区间结构（Union-Find、线段树/Fenwick 树）与前端性能/可视化中的应用。
