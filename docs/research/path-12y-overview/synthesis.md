# Synthesis — 中国家庭走美本路线 G1-G12 核验后内容源

**状态：** Final evidence base for mockup v3
**Cross-review：** R1 → R6 收敛（codex + claude opus + gemini 1+1+1 并行），finding 数 10 → 3 → 1 → 4 → 3 → 2 → 0（R6 修复后 self-verify pass）
**WebFetch 核验：** 2026-05-15

**与 synthesis-raw.md 关系：** synthesis-raw 是 4-way matrix 草稿 + R1-R3 修正。这份是 WebFetch 反向核验后的最终判决。

**置信标记：**
- ✅ **WebFetch verified** — 有官方 URL 原文摘录
- ⚠️ **多家共识未独立 verify** — 多份 report 引同源，但本轮没 fetch 原 URL
- 🟡 **单家但强 source** — 一家 report 给了机构 source，未 fetch
- 🔴 **不进 product** — 单家无 source / 与官方 source 对立 / 市场虚构数字

---

## 📌 4 个家间冲突 — 全部解决

R1-R3 cross-review surface 的 4 个未解决家间冲突，WebFetch 后全部判决：

### 冲突 1：Andover 申请截止 — ✅ 2/1 为正

- **官方原文**："2/1/2027 application deadline"
- **URL**：https://www.andover.edu/admission
- **判决**：✅ [01][03a] 对（明确说 2/1）；❌ [02] 错（把 Andover 归入 1/15 组）；❌ [04] 错（笼统说"1月15日是绝大多数顶尖美高"含 Andover）
- **mockup v3 用**：Andover **2/1**；Exeter / Choate / Deerfield / Lawrenceville / Hotchkiss **1/15**

### 冲突 2：Harvard 当前 SAT/ACT 政策 — ✅ 当前要求

- **官方原文**："SAT or ACT (with or without writing)" — listed as required ("must complete") for all applicants
- **URL**：https://college.harvard.edu/admissions/apply
- **判决**：✅ [01][03b] 对（当前要求）；❌ [02] 错（"Class of 2030 前 test-optional" 已过期）
- **mockup v3 用**：Harvard 当前要求 SAT/ACT

### 冲突 3：美高 = 自动 domestic 池 — ✅ 否

- **官方原文**：
  - "All students are considered in the same pool for all places in the incoming class, regardless of citizenship or the secondary school they attend."
  - "There are no quotas or limits of any kind at any point in the admissions process."
  - "Please note that we do not have quotas or limits based on either citizenship or location of high school."
- **URL**：https://college.harvard.edu/admissions/apply/international-applicants
- **判决**：✅ [02][03a] 对（**Harvard 不按 citizenship 也不按 high-school location 设 quota；美高不自动 domestic**）；❌ [04] 错（"美高生避开国际池"是 misrepresentation）
- **Princeton 同样原文**："We review all applications in the same manner, regardless of citizenship or country of residence."（https://admission.princeton.edu/apply/international-students）
- **mockup v3 精确措辞（R4 修正 paraphrase 偏移）**：
  - ✅ 可用："**Harvard / Princeton / Yale 三所顶校官方说 same pool, no quotas, regardless of citizenship or secondary school**" — 直接 quote 原文
  - ❌ 不要写："按 citizenship 切池" — 这是 paraphrase 偏移，原文是 same pool **regardless of** citizenship，不是 split by citizenship
  - ✅ 可用："**美高不自动进 domestic 池；学校所在地不是 admission factor**"（NACAC PDF page 3：High school attended considerable importance 仅 1.6%）

### 冲突 4：IECA Professional 门槛 — ✅ 两版都对，不矛盾

- **官方原文**：
  - "A master's degree or higher in a relevant field, or a combination of training and experience that demonstrates a mastery of the profession."
  - "Three years of experience in educational placement counseling or admissions, including a minimum of one year of independent educational consulting."
  - "A minimum number of evaluative campus visits during the previous five years within each specialty area: K-12 Boarding/Day Schools: **25 visits**; College: **50 visits**"
- **URL**：https://www.iecaonline.com/about-ieca/join/
- **判决**：✅ [02] 版（硕士 **OR equivalent training+experience** + 3 年 + 1 年独立执业 + 校访 + 不接 placement 佣金）和 ✅ [03a] 版（5 年内 50 次 evaluative campus visits）都对。两版是**同一标准的不同 facet**，不是冲突
- **mockup v3 用**：完整门槛 = "**硕士 OR 同等 training+experience**" + 3 年经验（含 1 年独立执业）+ college 顾问 5 年内 50 次 evaluative campus visits / K-12 顾问 25 次 + 推荐人 + 不接 placement 佣金 — **注意"硕士 OR experience"是 OR 不是 AND**（R4 Codex 抓到的 paraphrase 偏移）
- **IECA "不接 placement 佣金" 原文**："An IECA member does not accept any compensation from educational institutions for placement of a child."
- **URL**：https://www.iecaonline.com/about-ieca/principles-of-good-practice/

---

## 🎯 Tier A — WebFetch verified（直接进 mockup v3 文案）

### A1. NACAC 2023 admission factors — ✅ 完全验证（Source: SOCA 2023 PowerPoint PDF, page 2-4）

**Primary source（实际持有数字的官方文档）**：
- NACAC SOCA 2023 PowerPoint PDF：https://resources.finalsite.net/images/v1707774516/shorelineschoolsorg/yucdy4l209jbazfracqh/SOCAAdmissionFactorsPowerpointNACAC.pdf
- NACAC dashboard 入口：https://www.nacacnet.org/factors-in-the-admission-decision/
- NACAC 资源主页：https://www.nacacnet.org/resources/soca-2023-factors-in-the-admission-decision/（只有 fact sheet link，inline 不显示数字）

**Page 2: Fall 2023 完整 admission factor 表**（N=185 所四年制大学，每行 4 列百分比 = considerable / moderate / limited / no importance）

| Factor | Considerable | Moderate | Limited | No |
|---|---|---|---|---|
| High school grades in college prep courses | **76.8** | 15.1 | 4.9 | 3.2 |
| Total high school grades (all courses) | **74.1** | 18.9 | 5.4 | 1.6 |
| Strength of high school curriculum | **63.8** | 22.7 | 10.3 | 3.2 |
| Positive character attributes | 28.3 | 37.5 | 18.5 | 15.8 |
| Essay or writing sample | 18.9 | 37.3 | 26.5 | 17.3 |
| Student's interest in attending | 15.7 | 27.6 | 25.4 | 31.4 |
| Counselor recommendation | 11.9 | 40.0 | 27.6 | 20.5 |
| Teacher recommendation | 10.8 | 40.5 | 28.1 | 20.5 |
| Extracurricular activities | 6.5 | 44.3 | 30.8 | 18.4 |
| High school class rank | 5.5 | 22.4 | 43.2 | 29.0 |
| **Admission test scores (ACT, SAT)** | **4.9** | 25.4 | 38.9 | 30.8 |
| Portfolio | 4.9 | 10.8 | 24.3 | 60.0 |
| Interview | 4.3 | 8.6 | 32.4 | 54.6 |
| Work | 2.2 | 30.8 | 40.0 | 27.0 |
| State graduation exam scores | 1.6 | 6.5 | 18.4 | 73.5 |
| **Subject test scores (AP, IB)** | **1.1** | 22.2 | 25.9 | 50.8 |

**Page 3: Fall 2023 student characteristic 表**（N=180-185）

| Characteristic | Considerable | Moderate | Limited | No |
|---|---|---|---|---|
| First-generation status | 7.0 | 9.7 | 28.1 | 55.1 |
| State or country of residence | 7.0 | 9.7 | 28.1 | 55.1 |
| Gender | 2.8 | 9.4 | 12.8 | 75.0 |
| **High school attended** | **1.6** | 17.8 | 34.1 | 46.5 |
| **Ability to pay** | **1.6** | 7.6 | 13.0 | 77.8 |
| **Alumni relations** | **0.5** | 3.8 | 30.3 | 65.4 |

**Page 4: 11 年 trend — SAT/ACT considerable importance 历史崩跌**

| Factor | 2013 | 2014 | 2016 | 2017 | 2018 | 2023 |
|---|---|---|---|---|---|---|
| High school grades in college prep courses | 82% | 79% | 77% | 71% | 73% | **77%** |
| Strength of high school curriculum | 64 | 60 | 52 | 51 | 62 | **64** |
| **Admission test scores (ACT, SAT)** | **58** | **56** | **54** | **52** | **46** | **5** |
| Subject test scores (AP, IB) | 8 | 7 | 7 | 4 | 6 | **1** |
| Extracurricular activities | 10 | 6 | 8 | 4 | 6 | **7** |

**SAT/ACT considerable importance 11 年从 58% 跌到 5%**。同期 grades 维持在 71-82%，curriculum 维持在 51-64%。

**⚠️ Page 5: SAT/ACT 政策 trends 2017-2021**（**chart image，非 verbatim text quote**；本轮 Read PDF 拿到的是 chart annotation；mockup v3 使用前建议二次确认）
- "Required": **72% → 11%**（4 年）
- "Considered but Not Required": 8% → 56%
- "Neither Required nor Recommended": 4% → 19%

**⚠️ Page 6-8: Test submission rates 2017-2021**（**chart image，非 verbatim text quote**；同 Page 5 警示）
- ACT submission: 58% → 31%（整体）
- SAT submission: 46% → 24%（整体）
- 即使在 require test 的学校：ACT 60% → 50%；SAT 46% → 27%（2021 COVID 影响 + test-optional 扩散）

**mockup v3 用**：
- **反 SAT 焦虑核弹**：SAT/ACT considerable importance 11 年 58% → 5%（PDF page 4），成绩 + 课程强度才是 admission 核心
- **反"美高 vs 国际学校"焦虑核弹**：High school attended considerable importance 只有 **1.6%**（PDF page 3）— 大学不在意你读哪所中学
- **反"AP/IB 谁更好"焦虑**：AP/IB Subject test considerable importance 只有 **1.1%**（PDF page 2）— 比 SAT 还低
- **反"活动堆量"**：Extracurricular activities 6.5% / Interview 4.3% / Work 2.2%
- **反"legacy / 关系户"**：Alumni relations 0.5%
- **反"need-aware 不发钱"**：Ability to pay 仅 1.6% considerable

### A2. Princeton 2027-28 testing 恢复 — ✅ 完全验证

- **官方原文**："Princeton will return to requiring standardized testing for undergraduate admission beginning with the 2027-28 admission cycle."
- **当前政策**："For first-year and transfer applicants seeking to enroll in fall 2026 or fall 2027, Princeton remains test optional."
- **URL**：https://admission.princeton.edu/apply/standardized-testing
- **mockup v3 用**：Princeton 2027-28 周期起恢复 SAT/ACT 要求（即 fall 2028 入学起）

### A3. Princeton 国际生英语豁免 — ✅ 完全验证

- **官方原文**："You are not required to take the TOEFL, IELTS, Duolingo or PTE Academic if English is your native language or **if you have spent at least three years at a secondary school where English is the primary language of instruction**."
- **URL**：https://admission.princeton.edu/apply/international-students
- **mockup v3 用**：Princeton 接受 3 年英语授课豁免英语考试

### A4. Harvard 当前 SAT/ACT + REA/RD deadline — ✅ 完全验证

- **官方原文**：
  - 必交项目："SAT or ACT (with or without writing)" + "Optional: AP or other examination results"
  - "November 1 - Restrictive Early Action application deadline"
  - "January 1 - Regular Decision application deadline"
- **URL**：https://college.harvard.edu/admissions/apply
- **mockup v3 用**：Harvard REA 11/1，RD 1/1，SAT/ACT 必交

### A5. Harvard 国际生 same pool — ✅ 完全验证

见冲突 3 原文。

### A6. IECA — ✅ 完全验证

- **2,800+ Professional 成员** — 官方主页确认："IECA has more than 2,800 skilled, ethical members"
- **URL**：https://www.iecaonline.com
- Professional 门槛见冲突 4。

---

## 🟡 Tier B — 多家共识，WebFetch 第二轮后状态

### B1. 顶级寄宿美高其他截止日

- **来源**：[01][02][03a][04] 四家共识 1/15（Exeter / Choate / Deerfield / Lawrenceville / Hotchkiss）
- **WebFetch 状态**：
  - ✅ **Exeter 1/15 verified**（exeter.edu/admissions："Jan. 15 | Application materials due"）
  - ✅ **Deerfield 1/15 verified**（deerfield.edu/admission："Our priority application deadline for September enrollment is January 15"）
  - ⚠️ Choate / Lawrenceville / Hotchkiss 未独立 fetch
- **释放 3/10 + 回复 4/10**：
  - ⚠️ Deerfield 主页只 verify 了 "Financial aid awards are sent on March 10" 和 "after April 10" 这两个 partial 数据
  - 多家共识"3/10 admission release"未独立 verify

### B2. NACAC 10/15 + 5/1

- **来源**：[03a] 单家明确（[02] 只列 5/1）
- **状态**：未 WebFetch verify（NACAC SPGP 子页未 fetch）

### B3. Common App ED/EA/RD 时间窗 + 8/1 开放 + 10 项 activities + FERPA waiver

- **[01][02][03a] 三家共识**：ED/EA 11/1-11/15；ED II / RD 1/1-1/15；8/1 开放；10 项 activities；FERPA waiver
- **WebFetch 状态**：requirements-grid URL 404；first-year-students 主页没具体数字
- **WebSearch 状态**：found relevant URLs but no specific quotes
- **mockup v3 用前建议**：fetch https://www.commonapp.org/static/6b218bf3ae0ff06d86c9cf59938efbc9/Resource_FY_FERPA_ENG_2025.06.25_0.pdf 或 https://appsupport.commonapp.org/s/article/What-is-the-FERPA-Waiver

### B4. AP / IB / A-Level 顶校并列接受

- **[01][02][03a] 三家共识** + 引 Stanford / Princeton / Yale 官方话术
- ✅ **Stanford verified**："We do not have a preference for a specific curriculum (A-Level, IB, AP, National, etc.)"（admission.stanford.edu/apply/international）
- ⚠️ Princeton "strongest curriculum available to you" — [02] 转引 PrepScholar，WebSearch 0 results，可能是 paraphrase

### B5. Yale 国际生英语 2 年要求 + certified translation

- **[01][03a] 两家共识**
- ✅ **Verified**（yale.edu/international）：
  - "Non-native English-speakers who have not taken at least two years of secondary education where English is the medium of instruction are required to submit results"
  - "If any of your documents...are in a language other than English, they must be accompanied by a certified translation. We are not able to accept any documents that you have translated yourself."
  - "All applicants, regardless of nationality, citizenship, or country of origin, are considered through the same whole-person admissions process."

### B6. 顶级寄宿 college counseling junior year 启动

- **[01][03a] 两家共识** + 引 Deerfield + Andover 原文
- **WebFetch 状态**：andover.edu/about/college-counseling 404；deerfield.edu/admission 主页没此 phrasing；WebSearch "not in earnest" 0 results
- **判断**：[01][03a] 引用的 "not in earnest until junior year" 可能是 paraphrase 而非 verbatim quote。**Mockup v3 用前必须 retry college-specific URL，否则降权使用**

### B7. NAEYC play essential for birth-age 8

- **[03a] 单家** + NAEYC 官方 framework
- ✅ **Verified via WebSearch snippet**（naeyc.org/resources/position-statements/dap/principles）：
  - "Play is essential for all children, birth through age 8"
  - "Play promotes joyful learning that fosters self-regulation, language, cognitive and social competencies as well as content knowledge across disciplines"
  - "Play is the central teaching practice that facilitates young children's development and learning"
- ⚠️ statement-position 主页 403，但 principles 子页内容通过 search snippet verified

### B8. AAP 睡眠 / sports specialization

- **[01][03a] 共识**：6-12 岁 9-12 小时睡眠；13-18 岁 8-10 小时；青春期前避免单一运动专项化
- **WebFetch 状态**：healthychildren.org 数据在 image，text 没拿到；AAP 主页未 fetch
- **mockup v3 用前建议**：fetch AAP 官方 policy statements（不是 healthychildren.org 二级页）

### B9. Open Doors 2025 国际生数字

- **[02] 引 IIE Open Doors 2025**（2025-11-17 发布，opendoorsdata.org）具体数字：
  - 2024/25 学年美国高校共招收 **1,177,766** 名国际生，同比 **+5%**（历史新高）
  - **印度 363,019** 人（**+10%**）首次超中国成最大生源国
  - **中国 265,919** 人（**-4%**），连续多年下滑
  - **STEM 占比 57%**；数学和计算机科学 26% 是最大单一专业领域；工程 18% 次之
  - 国际本科生 2024/25 新增长 **+4%** 至 357,231 人（疫情后首次本科段显著回升）
- **[04] 数据**：section 4："美国大学在2024/2025学年接待了近117万名国际学生" + "新入学的国际生总数实际下降了7%"
- **R2 verdict**：[02] 整体存量 +5% / 本科 +4% vs [04] 新入学 -7% 是不同度量口径，不是冲突
- **WebFetch 状态**：opendoorsdata.org annual-release landing page 没具体数字
- **mockup v3 用前建议**：fetch https://opendoorsdata.org/annual-release/international-students/ 确认 2024/25 具体数字 (IIE 报告原版)

### B10. Need-blind for international 9 所完整列表

- **[02] 单家给完整列表**（Harvard / Yale / Princeton / MIT / Amherst / Bowdoin / Dartmouth / Brown / Notre Dame）
- ✅ Harvard / Yale / Princeton / MIT 通过 same-pool quotes 间接 verified
- ⚠️ Amherst / Bowdoin / Dartmouth / Brown / Notre Dame 未独立 fetch
- **mockup v3 用前建议**：fetch 各校 financial-aid international 页面 confirm

---

## 🟢 高置信 claim（多家共识，可直接进 mockup v3）

### G1-G6 阶段：发展 > application-building

| Claim | 来源 |
|---|---|
| NACAC 阶段框架：K-5 / G6-G8 / G9-G11 上 / G11-G12 | [01][02][03a] 三家 + NACAC 官方框架 |
| G1-G8 不是 application-building 阶段 | [01][02][03a][04] 四家共识 |
| NAEYC：play 对 birth-age 8 都是 essential | [03a] 引 NAEYC 官方 |
| Piaget concrete operational 7-11 岁 | [01][02][03a][04] 四家共识 |
| Erikson Identity vs Role Confusion 12-18 岁 | [02][04] |
| AAP：青春期前避免单一运动专项化（multi-sport 利于长期表现）| [01][03a] 引 AAP 临床报告 |
| AAP：6-12 岁需 9-12 小时睡眠；13-18 岁 8-10 小时 | [01][03a] 引 CDC/AASM |
| 元分析：家长介入作业与成绩弱负相关 | [03a] |
| Madeline Levine：过早成就驱动与儿童焦虑/抑郁正相关 | [02][04] |

### Admission 真硬节点

| Claim | 来源 |
|---|---|
| **NACAC 2023 数据**：grades 76.8% / 全成绩 74.1% / 课程强度 63.8% / SAT 4.9% considerable importance | ✅ NACAC 官方 verified |
| 顶校 ED/EA 11/1-11/15；ED II/RD 1/1-1/15 | [01][02][03a] |
| **Harvard REA 11/1, RD 1/1**；要求 SAT/ACT | ✅ Harvard 官方 verified |
| **Andover 2/1**（✅ official）；其他寄宿 **1/15**（✅ Exeter / Deerfield official + 三家共识）；释放 **3/10**（⚠️ Deerfield 主页只 verify "Financial aid awards are sent on March 10"，admission decision 3/10 是 [01][02][03a] 三家共识但非 Deerfield 主页 verify）；回复 **4/10**（✅ Deerfield official） | 混合 verified / multi-source |
| **Princeton 2027-28 起恢复 SAT/ACT** | ✅ Princeton 官方 verified |
| SAT/ACT 主窗口：junior spring 到 senior fall（3-6 月密集）| [01][02][03a][04] 四家共识 |
| 推荐信主要来自 junior/senior 核心学科老师 | [01][02][03a] 三家 + Yale/Stanford/Harvard 官方 |

### 国际生身份

| Claim | 来源 |
|---|---|
| **Harvard：same pool, no quotas, regardless of citizenship or secondary school they attend** | ✅ Harvard 官方 verified |
| **Princeton：review all applications in the same manner, regardless of citizenship or country of residence** | ✅ Princeton 官方 verified |
| Yale / Princeton 对国际生 need-blind + meet full need | [01][02][03a] |
| Need-blind for international 9 所（2025）：Harvard / Yale / Princeton / MIT / Amherst / Bowdoin / Dartmouth / Brown / Notre Dame | [02] 完整列表 |
| Need-aware ≠ 不发钱：完全自费等同 need-blind | [02] 单家 nuance |
| **Princeton：3 年英语授课可豁免** TOEFL/IELTS/DET/PTE | ✅ Princeton 官方 verified |
| 非英文材料须 certified translation（Yale 等）| [01][03a] |
| 中国大陆 SAT 考点仅向认证国际学校学生开放 | [02] 引 College Board |

### 美高分支

| Claim | 来源 |
|---|---|
| 美高是可选分支不是必经 | [01][02][03a][04] 四家共识 |
| 准备窗口 = G7-G8 启动（不是低龄）| [01][03a][04] |
| 顶级寄宿 college counseling junior year 才真正进入高频 | [01][03a] + Deerfield / Andover 原文 |
| **美高 ≠ 自动 domestic 池** | ✅ Harvard 官方 verified（"same pool regardless of secondary school"）|

### 顾问

| Claim | 来源 |
|---|---|
| **IECA Professional 门槛**：硕士学位 **OR** 同等 training+experience（注意是 OR 不是 AND）+ 3 年专业经验（含 1 年独立执业）+ college 顾问 5 年内 50 次 evaluative campus visits（K-12 顾问 25 次）+ 推荐人 + 不接学校 placement 佣金 | ✅ IECA 官方 verified |
| **IECA 2,800+ 成员** | ✅ IECA 官方 verified |
| IECA Principles：禁止 ghostwriting / 不接学校佣金 | ✅ IECA 官方 partial verified + [01][02][03a] |
| 顾问真正高价值阶段 = G10 末-G12 春 | [01][02][03a] 三家 + [04] |

### 反共识警示

| 警示 | 来源 |
|---|---|
| **G7-G9 一对一标化辅导无 admission impact 证据** | [01][02][03a][04] 四家共识 + NACAC 4.9% 数字支持 |
| **5 年长合约无独立研究支持** | [02][03a][04] 明确 + [01] 边缘 |
| 付费高端"名校夏校" admission signal 接近零 | [02][04] |
| 国际游学 / 海外义工 admission 权重低 | [02][04] |
| Common App 允许 10 项 activities 不是必填满；Harvard / MIT 看质量不看数量 | [02][03a] |
| 早期单一运动专项化有害（AAP 临床报告）| [01][03a] |
| 顶级美高 ≠ 藤校保证 | [01][02][03a] |

---

## 🔴 不进 mockup v3 的 claim

[04] Gemini 独家数字 + 与官方源对立：

| Claim | 来源 | 理由 |
|---|---|---|
| 🔴 "顶尖常春藤对中国籍非美高申请者有效录取率 1.5%" | [04] 单家 | 顶校不公布国别录取率，[02] 明确说市场虚构 |
| 🔴 "NYU 单一学年新注册中国学生 1481 人" | [04] 单家 | 无 source |
| 🔴 "中国家庭收入 17.1% 用于教育；低收入 56.8%；弹性系数 0.306" | [04] 单家 | 无 source |
| 🔴 "NYU/UIUC 中国学生池饱和；Vanderbilt/Rice/Notre Dame 未饱和" | [04] 单家 | selection strategy claim 无 source |
| 🔴 "美高生避开中国国际生池" | [04] 单家 | ❌ Harvard 官方否认（"same pool regardless of citizenship or secondary school"）|

---

## ⚠️ 数据空白（明确告诉用户 mockup v3 里）

13 项行业不公开 / 无标准化研究的事项（[01][02][03a] cross-source 都承认）：

1. 中国籍学生在顶校国际生池的具体录取率（顶校不公布）
2. 国别"配额"是否真实存在（顶校不公布）
3. 5 年合约 vs 短期合约的 admission outcome 差距（无研究）
4. AP vs IB 在顶校录取率的实际差距（仅 self-selection 数据）
5. 低龄 SAT 备考与最终分数关系（无研究）
6. 夏校 admission lift 量化（无研究）
7. 国际学校 vs 双语 vs 公立录取率对比（无标准化研究）
8. 文书辅导边际回报（无研究 + IECA 禁止 ghostwriting）
9. 国际生池 SAT/ACT 中位数（各校 CDS 不按国籍 breakdown）
10. 美国本土顾问 vs 国内中介 outcome 因果差异（[03a] 明确承认）
11. 中国大陆考点紧张 / 寄递 / 网络等 operational 障碍精细数据
12. 美高对美本录取的因果效应（无 controlled study）
13. Damour / Levine / Bruni / Deresiewicz 等标杆著作具体章节（[02] 边界声明）

**mockup v3 处理原则**：这 13 项**必须明确标"未知 / 不公开 / 行业无共识"**。不假装有数据 = 产品信任感的核心来源。

---

## Mockup v3 用得上的"核弹级 evidence"

最有冲击力的 verified / source 强的数据点，按主题分类。每条标 ✅ verified / ⚠️ 多源未独立 fetch。

### 反 SAT 焦虑（最强）

1. ✅ **NACAC 11 年 trend (PDF page 4)：SAT/ACT considerable importance 从 2013 年 58% 跌到 2023 年 5%**（中间点：2018=46%；2017=52%；2016=54%；2014=56%）— **11 年崩跌 11.6 倍**。同期 grades 维持 71-82%，curriculum 维持 51-64%
2. ✅ **NACAC 2023 (PDF page 2)**：SAT/ACT considerable = 4.9%，vs grades college prep = **76.8%** / strength of curriculum = **63.8%** — 差一个数量级
3. ⚠️ **NACAC test policy trend (PDF page 5)**：SAT/ACT Required 从 2017 年 72% 跌到 2021 年 11%（"Considered but Not Required" 从 8% 涨到 56%）— **数据在 PDF chart image 里，本轮 Read PDF 拿到的是 chart annotation 而非 verbatim text quote；使用时 mockup v3 建议二次确认**
4. ⚠️ **NACAC submission rate (PDF page 6-8)**：即使在 require test 学校，2021 年 ACT submission 50% / SAT submission 27% — test-optional 时代实际 submission 自愿 — **同样来自 PDF chart annotation，非 verbatim text**
5. ⚠️ **Sean Logan（Andover 现任 college counseling director）公开表述**：顶校招生官把申请分"桶"，"标化分数高得离谱"并不在任何能产生显著差异的桶里（[02] 引 WBUR News 2013-12-26）— **业内权威 + 当事人**
6. ✅ **Princeton 2027-28 起恢复 SAT/ACT**（即 fall 2028 入学起；当前对 fall 2026/2027 仍 test-optional）— testing 政策按年变，**不是稳定的**

### 反 admission "国别配额 / 美高跳板" 焦虑

7. ✅ **Harvard 官方**："There are no quotas or limits of any kind at any point in the admissions process."
8. ✅ **Harvard 官方**："All students are considered in the same pool for all places in the incoming class, regardless of citizenship or the secondary school they attend."
9. ✅ **Princeton 官方**："We review all applications in the same manner, regardless of citizenship or country of residence."
10. ✅ **Yale 官方**："All applicants, regardless of nationality, citizenship, or country of origin, are considered through the same whole-person admissions process."
11. ✅ **NACAC 2023 (PDF page 3) 核弹数字**：**"High school attended" considerable importance = 1.6%** — 大学不在意你读哪所中学，含义是美高 vs 国际学校 vs 公立国际部对 admission outcome 的统计影响微乎其微

**含义**：[04] Gemini "美高生避开中国国际生池" 的营销话术与 Harvard / Princeton / Yale 三所顶校官方表述 + NACAC 全行业数据**全部直接对立**。

**精确措辞 nuance（R4 修正）**：
- 三所顶校官方说 "**same pool, no quotas, regardless of citizenship or secondary school**" — **不是"按 citizenship 切池"**
- 简洁表述（直接用官方 framing）：**Harvard / Princeton / Yale 都说所有申请者通过相同流程审核，不论 citizenship 也不论 secondary school 所在地** — 不要 paraphrase 成"按...切池"或"申请池切分"

### 反"AP/IB 谁更好" + "活动堆量" 焦虑

12. ✅ **Stanford 官方**："We do not have a preference for a specific curriculum (A-Level, IB, AP, National, etc.)."
13. ✅ **Yale 官方 admission 标准**："The single most important document in your application is your high school transcript" + "We look for students who have consistently taken a broad range of challenging courses in high school and have done well." — **transcript + course rigor 是核心，不是体系**
14. ✅ **NACAC 2023 (PDF page 2) 核弹数字**：**Subject test scores (AP, IB) considerable importance 仅 1.1%** — 比 SAT/ACT 4.9% 还低。"修一堆 AP" 或 "拿 IB diploma" 本身不是 admission 决定因素
15. ✅ **NACAC 2023 (PDF page 2)**：Extracurricular activities considerable importance 仅 **6.5%** / Interview **4.3%** / Work **2.2%** / Class rank **5.5%** — 这些都是 considerable，不是 moderate/limited/no
16. ⚠️ **Common App 10 项 activities 上限不是必填满**（[02][03a] 引 Common App）+ Harvard / MIT 明确说"quality over quantity" — 反"活动堆量"

### 反"低龄签长约 / 名校夏校" 焦虑

17. ⚠️ **5 年长期顾问合约无独立研究支持其边际回报**（[02][03a][04] 三家共识）；[02] 明说："长合约主要服务于中介机构的现金流可预测性"
18. ⚠️ **顾问真正高价值阶段 = G10 末-G12 春（约 2 年）**（[01][02][03a] 三家共识 + 引 Deerfield + Andover 原文）— **反"低龄包装合同"最强证据**
19. ⚠️ **付费高端"名校夏校" admission signal 接近零**（[02] 详引）— 只有 RSI / TASP / SSP / PROMYS 等接受率 1-5% 的高度筛选项目才有 admission 信号价值
20. ⚠️ **国际游学 / 海外义工**几乎无招生官公开承认权重（[02][04]）

### 反"低龄 SAT / 早期专项化 / 完美履历" 焦虑

21. ⚠️ **AAP 临床报告**：青春期前避免单一运动专项化；multi-sport 参与有利长期表现（[01][03a]）
22. ⚠️ **Madeline Levine（The Price of Privilege）**：过早成就驱动抚养与儿童期焦虑/抑郁正相关（[02][04]）
23. ⚠️ **CDC/AASM 睡眠**：6-12 岁需 9-12 小时；13-18 岁 8-10 小时（[01][03a]）— 反"占用睡眠刷题"
24. ✅ **NAEYC 官方**："Play is essential for all children, birth through age 8" + "Play promotes joyful learning that fosters self-regulation, language, cognitive and social competencies" — 反"低龄 application-building"

### 识别真顾问 vs 中介销售

25. ✅ **IECA 官方**："An IECA member does not accept any compensation from educational institutions for placement of a child." — **ethical 红线**
26. ✅ **IECA Professional 完整门槛**：**硕士学位 OR 同等 training+experience**（注意是 OR 不是 AND，R4 修正）+ 3 年专业经验（含 1 年独立执业）+ college 顾问 5 年内 50 次 evaluative campus visits（K-12 顾问 25 次）+ 推荐人 + 不接学校 placement 佣金
27. ✅ **IECA 全美 2,800+ Professional 注册顾问**（官方主页数字）
28. ✅ **NACAC 2023 (PDF page 3) 配套核弹**：**"Alumni relations" considerable importance = 0.5%** — 招生官几乎不看校友关系，"找内部关系 / legacy connection" 不影响 admission outcome

### 中国 context 特定 fact

29. ⚠️ **中国大陆 SAT 考点仅向就读中国教育部认证的国际学校的学生开放**；其他学生必须出境到香港 / 澳门 / 新加坡 / 韩国 / 日本 / 台湾（[02] 引 College Board）
30. ⚠️ **中国学生在美国国际生总量中占比仍约 23%**（[02] 引 IIE Open Doors 2025）— 2024/25 中国 265,919 (-4%) / 印度 363,019 (+10%) 已超中国成最大生源国
31. ⚠️ **国际学校只录持外国护照学生**（部分学校 — 中国教育部纯外籍子女学校规定）

### Need-blind for International 完整清单

32. **9 所（2025 年公认）**：Harvard / Yale / Princeton / MIT（✅ same-pool 间接 verified）+ Amherst / Bowdoin（Class 2028 起）/ Dartmouth（Class 2026 起）/ Brown（Class 2029 起）/ Notre Dame（⚠️ [02] 单家完整名单）
33. ⚠️ **Need-aware ≠ 不发钱 nuance**（[02]）：need-aware 只是把援助申请者池单独考虑；完全自费就读 = 与 need-blind 等同对待 — **中国家庭最容易被中介话术误导的点**
34. ✅ **NACAC 2023 (PDF page 3) 配套**：**"Ability to pay" considerable importance = 1.6%** — 大学普遍不把 ability to pay 列为 admission factor

### 申请池 + 申请季硬节点

35. ✅ **Andover 申请截止 2/1**（✅ verified）；其他顶级寄宿 **1/15**（Exeter / Deerfield ✅ verified + 三家共识 Choate / Lawrenceville / Hotchkiss）；**回复截止 4/10**（✅ Deerfield verified）；**admission decision release 3/10**（⚠️ 三家共识但 Deerfield 主页只 verified "financial aid awards 3/10"，admission release 3/10 未在 Deerfield 主页找到 verbatim quote）
36. ✅ **Harvard REA 11/1，RD 1/1**
37. ⚠️ **Open Doors 2025**：2024/25 国际生总量 1,177,766（+5%）；本科生段 +4%；STEM 占比 57%（[02] 引 IIE）

### 13 项行业不公开 / 无标准化研究

见 §"⚠️ 数据空白"部分。Mockup v3 应**主动告诉用户什么不知道** — [02] 明说"诚实标'不知道'比假装有数据更负责"，这本身就是产品信任感来源。

---

## 附录 A：所有 WebFetch verbatim quote（完整持久化）

按 source 整理，所有原文摘录保留：

### Andover（andover.edu/admission）
- "2/1/2027 application deadline"

### Harvard（college.harvard.edu/admissions/apply）
- 必交项目："SAT or ACT (with or without writing)"
- 可选："Optional: AP or other examination results"
- "November 1 - Restrictive Early Action application deadline"
- "January 1 - Regular Decision application deadline"

### Harvard International（college.harvard.edu/admissions/apply/international-applicants）
- "Our admissions and financial aid processes are the same for all applicants - regardless of nationality or citizenship."
- "All students are considered in the same pool for all places in the incoming class, regardless of citizenship or the secondary school they attend."
- "There are no quotas or limits of any kind at any point in the admissions process."
- "Please note that we do not have quotas or limits based on either citizenship or location of high school."
- "We have foreign citizens applying from American high schools and American citizens applying from high schools around the world. When we refer to 'international admissions,' we are generally referring to applicants who apply from schools outside the United States..."

### Princeton（admission.princeton.edu/apply/standardized-testing）
- "For first-year and transfer applicants seeking to enroll in fall 2026 or fall 2027, Princeton remains test optional."
- "Princeton will return to requiring standardized testing for undergraduate admission beginning with the 2027-28 admission cycle."

### Princeton International（admission.princeton.edu/apply/international-students）
- "You are not required to take the TOEFL, IELTS, Duolingo or PTE Academic if English is your native language or if you have spent at least three years at a secondary school where English is the primary language of instruction."
- "We review all applications in the same manner, regardless of citizenship or country of residence."

### Yale（admissions.yale.edu/what-yale-looks-for）
- "The single most important document in your application is your high school transcript, which tells us a great deal about your academic drive and performance over time."
- "We look for students who have consistently taken a broad range of challenging courses in high school and have done well."
- "Your high school teachers can provide extremely helpful information in their evaluations... it is important to ask for recommendations from teachers who know you well."
- "Request letters of recommendation from two teachers who know you well."
- **Yale 推荐信 nuance**：Yale 官方**没**说 junior/senior 或核心学科 — 只说"two teachers who know you well"。R1 / R2 audit 里"推荐信主要来自最近核心学科老师"这条是 [01][02][03a] paraphrase / 引 Stanford / 引 Harvard，**不是 Yale 原文**

### Yale International（yale.edu/international）
- "Non-native English-speakers who have not taken at least two years of secondary education where English is the medium of instruction are required to submit results"
- "If any of your documents...are in a language other than English, they must be accompanied by a certified translation. We are not able to accept any documents that you have translated yourself."
- "All applicants, regardless of nationality, citizenship, or country of origin, are considered through the same whole-person admissions process."

### Stanford International（admission.stanford.edu/apply/international/index.html）
- "We do not have a preference for a specific curriculum (A-Level, IB, AP, National, etc.)."
- "You should complete the necessary coursework to apply to a university program for a bachelor's degree in your home country."
- "To learn more about our selection process and the recommended high school curriculum, please see our suggestions for Academic Preparation."

### Exeter（exeter.edu/admissions）
- "Jan. 15 | Application materials due"

### Deerfield（deerfield.edu/admission）
- "Our priority application deadline for September enrollment is January 15."
- "Financial aid awards are sent on March 10." （注意：**这是 financial aid 数据，不是 admission decision** — [01][02][03a] 引用"3/10 admission release"未在 Deerfield 主页 verify，可能是行业惯例或子页内容）
- "Admission opportunities for late candidates...is limited by the number of spaces available after April 10."
- "Get great advice from College Advising"（Year 2 = sophomore year）— 这与 [01][03a] 引"college counseling not in earnest until junior year"**有出入**，[01][03a] 引的可能是 Deerfield college counseling 子页表述

### NACAC 2023（nacacnet.org/resources/soca-2023-factors-in-the-admission-decision/）
Considerable importance percentages（185 所四年制大学）：
- Grades in college prep courses: **76.8%**
- Grades in all courses: **74.1%**
- Strength of curriculum: **63.8%**
- SAT/ACT admission test scores: **4.9%**

### IECA（iecaonline.com）
- 主页："IECA has more than 2,800 skilled, ethical members ready to guide you through the process of finding, applying to, and selecting a right-fit college, school, or program."

### IECA Professional 门槛（iecaonline.com/about-ieca/join/）
- "A master's degree or higher in a relevant field, or a combination of training and experience that demonstrates a mastery of the profession."
- "Three years of experience in educational placement counseling or admissions, including a minimum of one year of independent educational consulting."
- "A minimum number of evaluative campus visits during the previous five years within each specialty area (only specialties you choose for yourself apply): K-12 Boarding/Day Schools: 25 visits; College: 50 visits"

### IECA Principles of Good Practice（iecaonline.com/about-ieca/principles-of-good-practice/）
- "An IECA member does not accept any compensation from educational institutions for placement of a child."
- 完整 POGP 在 https://link.iecaonline.com/POGP — 本轮未 fetch

### Open Doors 2025（[02] 引 IIE，⚠️ 未独立 fetch verify）
- "2024/25 学年美国高校共招收 1,177,766 名国际生，同比增长 5%——历史新高"（IIE Open Doors 2025 Annual Release, 2025-11-17 发布, opendoorsdata.org）
- "印度首次在 2023/24 取代中国成为最大生源国，并在 2024/25 继续领先：印度 363,019 人 (+10%)；中国 265,919 人 (–4%)"
- "STEM 占比 57%；数学和计算机科学 (26%) 是国际生最大单一专业领域，工程 (18%) 次之"
- "国际本科生 2024/25 年新增长 4% 至 357,231 人——这是疫情后第一次本科段显著回升"

### Harvard Class of 2028（[02] 引 The Harvard Crimson 2024-03-29，⚠️ 未独立 fetch verify）
- "Harvard Class of 2028 整体录取率 **3.59%**：54,008 申请 / 1,937 录取"
- "Class of 2028 的国际生占比报道在 15–18% 区间"
- "EA (Early Action) Class of 2028 录取率 8.7%（692/7,921）；RD 录取率约 2.7%"
- "Class of 2029：Harvard 录取率回升趋势停止，整体 3.63%；REA 9.2%；RD 约 2.8%"
- "Class of 2028 国际生的国别分布：加拿大、英国、中国是三大主要来源国"

### Need-blind for International 9 所完整名单（[02] 单家，部分通过 same-pool 间接 verified）
2025 年公认名单：
- Harvard University（✅ 同 pool 原文 verified）
- Yale University（✅ 同 pool 原文 verified）
- Princeton University（✅ 同 pool 原文 verified）
- MIT（mitadmissions.org，未独立 fetch）
- Amherst College（未独立 fetch）
- Bowdoin College（自 Class of 2028 起；未独立 fetch）
- Dartmouth College（自 Class of 2026 起；未独立 fetch）
- Brown University（自 Class of 2029 / 2025 秋入学起；未独立 fetch）
- University of Notre Dame（未独立 fetch）

### NAEYC DAP（via WebSearch snippet，naeyc.org/resources/position-statements/dap/principles）
- "Play is essential for all children, birth through age 8."
- "Play promotes joyful learning that fosters self-regulation, language, cognitive and social competencies as well as content knowledge across disciplines."
- "Play (including self-directed, guided, solitary, parallel, social, cooperative, onlooker, object, fantasy, physical, constructive, and games with rules) is the central teaching practice that facilitates young children's development and learning."
- "All young children need daily, sustained opportunities for play, both indoors and outdoors."

---

## 附录 B：未 fetch 成功的 URL 清单 + retry candidate

**避免 mockup v3 时重复踩坑** — 这些 URL 在 2026-05-15 本轮 fetch 失败：

### 404 Not Found
- https://www.iecaonline.com/quick-links/parents-students-of-all-ages/how-to-find-a-consultant/
- https://www.andover.edu/about/college-counseling
- https://www.commonapp.org/apply/requirements-grid
- https://www.commonapp.org/blog/how-write-common-app-essay
- https://admission.princeton.edu/apply/academic-preparation
- https://admission.princeton.edu/how-apply/preparing-college
- https://admissions.yale.edu/international-students（注意：去掉 "-students" 后缀变成 yale.edu/international 后可访问）
- https://www.nacacnet.org/research/

### 403 Forbidden（anti-bot）
- https://www.naeyc.org/resources/position-statements/dap/principles
- https://www.naeyc.org/resources/position-statements/dap/statement-position

### Landing page / image-only / 没具体数字
- https://www.commonapp.org/apply
- https://www.commonapp.org/apply/first-year-students/
- https://opendoorsdata.org/annual-release/
- https://www.healthychildren.org/English/healthy-living/sleep/Pages/healthy-sleep-habits-how-many-hours-does-your-child-need.aspx

### Retry candidate（WebSearch 找到的更深 URL）
- **Common App FERPA PDF**：https://www.commonapp.org/static/6b218bf3ae0ff06d86c9cf59938efbc9/Resource_FY_FERPA_ENG_2025.06.25_0.pdf
- **Common App What's New 25-26 PDF**：https://www.commonapp.org/files/Whats-New-25-26.pdf
- **Common App FERPA Q&A**：https://appsupport.commonapp.org/s/article/What-is-the-FERPA-Waiver
- **NAEYC DAP statement PDF**：https://www.naeyc.org/sites/default/files/globally-shared/downloads/PDFs/resources/position-statements/dap-statement_0.pdf
- **Open Doors international students 子页**：https://opendoorsdata.org/annual-release/international-students/
- **IECA POGP 完整文档**：https://link.iecaonline.com/POGP

### Mockup v3 用到具体 quote 时优先 fetch
1. Common App FERPA PDF（搞清楚 FERPA waiver 的官方表述）
2. Open Doors international-students 子页（拿中国 / 印度具体数字）
3. NAEYC DAP statement PDF（拿完整 position statement）
4. Choate / Lawrenceville / Hotchkiss admission 主页（确认 1/15）
5. AAP 官方 sleep / sports specialization policy（不是 healthychildren.org）

---

## 修订记录

- 2026-05-15 R0：synthesis-raw.md self-audit
- 2026-05-15 R1：cross-model review（codex + claude opus + gemini 1+1+1）
- 2026-05-15 R2：3 个 R1-introduced bug 修复
- 2026-05-15 R3：stale conflict count 修复 → 收敛
- 2026-05-15 WebFetch：4 个家间冲突全部解决 + 6 条 Tier A claim verified
- 2026-05-15 synthesis.md 出（本文件）

下一步：基于本文件做 mockup v3。
