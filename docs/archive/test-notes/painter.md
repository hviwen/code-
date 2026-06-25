# RBAC 架构图与设计流程图

该文档包含两个图：

1. **RBAC 系统架构图（Architecture Diagram）** — 显示用户、角色、权限、内容分配、缓存与审计的整体关系与数据流。
2. **RBAC 权限判断与内容访问流程图（Design Flowchart）** — 展示从请求到授权决策到内容查询的详细步骤（包括 token、角色切换、缓存与 DB 回退）。

> 下面图可直接复制 SVG 源码或在画布中查看与放大。

---

## 一、架构图（Architecture Diagram）

<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="520" viewBox="0 0 1000 520">
  <style> .box{fill:#f8fafc;stroke:#1f2937;stroke-width:1.2px;} .title{font: bold 14px sans-serif; fill:#0f172a;} .small{font: 12px sans-serif; fill:#0f172a;} .link{stroke:#6b7280;stroke-width:1.2px;fill:none;} </style>

  <!-- Users -->

  <rect x="20" y="20" width="200" height="110" class="box" rx="8"/>
  <text x="30" y="45" class="title">客户端 / 小程序</text>
  <text x="30" y="70" class="small">- 游客</text>
  <text x="30" y="90" class="small">- 普通客户</text>
  <text x="30" y="110" class="small">- 经理（可多角色、可切换）</text>

  <!-- API Gateway -->

  <rect x="260" y="20" width="220" height="90" class="box" rx="8"/>
  <text x="270" y="45" class="title">API Gateway / Auth</text>
  <text x="270" y="70" class="small">- 验证 token</text>
  <text x="270" y="90" class="small">- 解析 active_role / perm_ver</text>

  <line x1="220" y1="75" x2="260" y2="75" class="link" marker-end="url(#arrow)"/>

  <!-- Backend services -->

  <rect x="520" y="10" width="440" height="220" rx="10" fill="#ffffff" stroke="#111827"/>
  <text x="540" y="35" class="title">后端服务层</text>

  <!-- Auth & RBAC service -->

  <rect x="540" y="50" width="180" height="70" class="box" rx="6"/>
  <text x="555" y="72" class="small">Auth / RBAC Service</text>
  <text x="555" y="92" class="small">- user_roles, role_permissions</text>

  <!-- Content service -->

  <rect x="760" y="50" width="200" height="70" class="box" rx="6"/>
  <text x="775" y="72" class="small">Content Service</text>
  <text x="775" y="92" class="small">- contents, assignments</text>

  <!-- Manager relation -->

  <rect x="540" y="140" width="420" height="70" class="box" rx="6"/>
  <text x="555" y="162" class="small">Manager Relationships</text>
  <text x="555" y="182" class="small">- manager_customers</text>
  <text x="655" y="202" class="small">- manager_channels / institutions</text>

  <!-- Cache -->

  <rect x="120" y="160" width="220" height="100" class="box" rx="8"/>
  <text x="135" y="185" class="title">Redis Cache</text>
  <text x="135" y="205" class="small">- role:perms:<roleId></text>
  <text x="135" y="225" class="small">- user:roles:<userId></text>
  <text x="135" y="245" class="small">- content:assignments:<contentId></text>

  <line x1="360" y1="75" x2="520" y2="75" class="link"/>
  <line x1="360" y1="190" x2="520" y2="190" class="link"/>
  <line x1="740" y1="75" x2="760" y2="75" class="link"/>

  <!-- DB -->

  <rect x="540" y="240" width="420" height="140" class="box" rx="8"/>
  <text x="555" y="265" class="title">关系型数据库 (Postgres/MySQL)</text>
  <text x="555" y="290" class="small">- users, roles, permissions</text>
  <text x="555" y="310" class="small">- user_roles, role_permissions</text>
  <text x="555" y="330" class="small">- contents, content_assignments</text>
  <text x="555" y="350" class="small">- audit_logs, manager_customers</text>

  <!-- Audit logging -->

  <rect x="260" y="240" width="220" height="80" class="box" rx="8"/>
  <text x="275" y="265" class="title">Audit / Admin</text>
  <text x="275" y="290" class="small">- 变更记录查看</text>
  <text x="275" y="310" class="small">- 角色/权限管理控制台</text>

  <!-- arrows -->

  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#6b7280"/>
    </marker>
  </defs>

  <line x1="220" y1="210" x2="120" y2="210" class="link" marker-end="url(#arrow)"/>
  <line x1="340" y1="210" x2="520" y2="210" class="link" marker-end="url(#arrow)"/>
  <line x1="760" y1="120" x2="760" y2="140" class="link" marker-end="url(#arrow)"/>
  <line x1="760" y1="210" x2="760" y2="240" class="link" marker-end="url(#arrow)"/>

</svg>

---

## 二、设计流程图（权限判断与内容访问决策）

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="820" viewBox="0 0 900 820">
  <style> .rect{fill:#fff;stroke:#0f172a;stroke-width:1.2px;rx:6;} .title{font: bold 13px sans-serif; fill:#0f172a;} .txt{font:12px sans-serif; fill:#0f172a;} .arrow{stroke:#6b7280;stroke-width:1.2px;fill:none;} </style>

  <!-- Start -->

  <rect x="320" y="20" width="260" height="44" rx="8" fill="#eef2ff" stroke="#6366f1"/>
  <text x="420" y="50" class="title">1. 客户端发起请求（含 JWT）</text>

  <!-- Step: API Gateway -->

  <rect x="280" y="90" width="340" height="60" rx="8" class="rect"/>
  <text x="300" y="118" class="title">2. API Gateway / Auth</text>
  <text x="300" y="138" class="txt">解析 token -> sub, active_role, perm_ver</text>

  <line x1="420" y1="64" x2="420" y2="90" class="arrow" marker-end="url(#a)"/>

  <!-- Step: Check perm_ver -->

  <rect x="140" y="180" width="260" height="60" rx="8" class="rect"/>
  <text x="160" y="208" class="title">3a. 检查 perm_ver 与缓存</text>
  <text x="160" y="228" class="txt">- 若一致：使用 Redis 权限/role 缓存</text>

  <rect x="500" y="180" width="260" height="60" rx="8" class="rect"/>
  <text x="520" y="208" class="title">3b. perm_ver 不一致或缓存缺失</text>
  <text x="520" y="228" class="txt">- 回 DB 合并 role -> permissions</text>

  <line x1="360" y1="150" x2="360" y2="180" class="arrow" marker-end="url(#a)"/>
  <line x1="480" y1="150" x2="520" y2="180" class="arrow" marker-end="url(#a)"/>

  <!-- merge perms -->

  <rect x="300" y="260" width="300" height="64" rx="8" class="rect"/>
  <text x="320" y="290" class="title">4. 合并权限集（roles -> perms）</text>
  <text x="320" y="310" class="txt">- 包括 role_inherit, explicit user perms</text>

  <line x1="280" y1="210" x2="380" y2="260" class="arrow" marker-end="url(#a)"/>
  <line x1="660" y1="210" x2="520" y2="260" class="arrow" marker-end="url(#a)"/>

  <!-- Check permission existence -->

  <rect x="280" y="350" width="340" height="60" rx="8" class="rect"/>
  <text x="300" y="378" class="title">5. 检查是否拥有目标 permission</text>
  <text x="300" y="398" class="txt">- 否 -> 返回 403</text>

  <line x1="450" y1="324" x2="450" y2="350" class="arrow" marker-end="url(#a)"/>

  <!-- If has permission: check scope -->

  <rect x="80" y="440" width="340" height="84" rx="8" class="rect"/>
  <text x="100" y="470" class="title">6a. 若需要 scope 校验（如内容访问）</text>
  <text x="100" y="490" class="txt">- 获取 content_assignments -> 判断 active_role/manager 管辖范围</text>

  <rect x="460" y="440" width="340" height="84" rx="8" class="rect"/>
  <text x="480" y="470" class="title">6b. 若为管理操作（管理客户）</text>
  <text x="480" y="490" class="txt">- 检查 manager_customers 关联</text>

  <line x1="450" y1="410" x2="200" y2="440" class="arrow" marker-end="url(#a)"/>
  <line x1="450" y1="410" x2="720" y2="440" class="arrow" marker-end="url(#a)"/>

  <!-- final decision -->

  <rect x="260" y="560" width="380" height="64" rx="8" class="rect"/>
  <text x="300" y="590" class="title">7. 决策：允许访问或拒绝（403）</text>
  <text x="300" y="614" class="txt">- 若允许：Content Service 返回数据（已按 scope 过滤）</text>

  <line x1="340" y1="524" x2="340" y2="560" class="arrow" marker-end="url(#a)"/>
  <line x1="560" y1="524" x2="560" y2="560" class="arrow" marker-end="url(#a)"/>

  <!-- back to client -->

  <line x1="420" y1="624" x2="420" y2="700" class="arrow" marker-end="url(#a)"/>
  <rect x="320" y="700" width="260" height="44" rx="8" fill="#ecfdf5" stroke="#10b981"/>
  <text x="390" y="730" class="title">响应：200 / 403 / 401</text>

  <defs>
    <marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#6b7280"/>
    </marker>
  </defs>

</svg>

---

## 使用建议

* 你可以用这两个图作为开发文档直接贴入工程文档或设计稿中。SVG 可复制修改（例如替换 scope 名称、角色命名）以匹配你的真实业务。
* 如果你需要，我可以把 SVG 导出为单独的文件（如 `rbac-architecture.svg` / `rbac-flowchart.svg`），或按你的品牌色和图标改版。

---

*文档生成于系统，根据你提供的项目信息可以进一步定制图内的角色、scope 与数据流。*
