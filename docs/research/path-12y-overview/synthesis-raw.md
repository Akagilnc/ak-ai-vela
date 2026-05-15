# Synthesis Raw — 4-way 对比 matrix（未核验态）

**状态：草稿 / 未独立核验任何 source URL**

**目的：** 把 4 份 research 的 claim 按维度横向铺开，标置信等级 + 列出对应该去核验的 official source 候选。下一步是对每条 ⭐⭐⭐ claim 做 WebFetch 反向核验 → `synthesis.md`。

**置信等级定义：**
- **⭐⭐⭐ 高置信**：3+ 家共识 + 都指向同一权威源（NACAC / 顶校 admissions 页 / Common App / College Board / IBO / NAEYC / AAP 等）
- **⭐⭐ 中置信**：2 家共识 OR 1 家 + 给了明确机构 source
- **⭐ 低置信**：单家独说 / 无 source / 各家冲突
- **🔴 高风险**：单家给了具体数字但没 source，且其他家明确说"这类数字不公开"

> **⚠️ ⭐ 等级演化**：本文件经过两轮 audit：
> - **第一轮（self-audit）**：发现并修正 E1-E11 归属错误，但 ⭐ 等级偏松未实际降级（仅加 disclaimer）
> - **第二轮（cross-model review，v3 1+1+1：codex + Claude opus + Gemini）**：3/3 concur ⭐ 等级仍偏松，已实际降级多处 2 家共识 ⭐⭐⭐ → ⭐⭐
>
> **本文件仍是 raw 初筛**。最终置信等级以 `synthesis.md` 中 WebFetch 核验后的结果为准。

> **🚨 4 个未解决的家间冲突**（mockup v3 前必须 WebFetch 解决，cross-review R2 修正后）：
> 1. Andover 申请截止：[01][03a] 明确 2/1 vs [02][04] 笼统说"大多数 1/15"（不单列 Andover）— R2 修正：[04] 实际不属"明确 2/1"组，跟 [02] 一致
> 2. Harvard 当前 SAT/ACT 政策：[01][03b] "当前要求" vs [02] "Class of 2030 前 test-optional"
> 3. IECA Professional 门槛数字：[02] 版 vs [03a] 版不一致
> 4. 美高 = domestic 池：[02][03a] 反对 vs [04] 主张（[01] 未表态）
>
> **R2 删除的两个伪冲突**：
> - ~~Open Doors 2025 国际生方向~~：[02] 整体 +5% vs [04] 新入学 -7% — R2 grep verified [02] 整体 +5% / 国际本科生 +4%，[04] 是新入学新生增量。**两家是不同度量口径，不是实质冲突**
> - ~~AP/IB/A-Level 顶校偏好~~：[04] 明确限定"**对于美籍学生而言**"AP 有战略意义（[04] section 2 line 53），论域是 return-to-US 不是顶校偏好层面。**论域不同非实质对立**（R2 Codex 触发 target drift，Claude Opus 触发类别 drift）

**报告别名：**
- `[01]` = ChatGPT 5.5 Pro Desktop（无 URL，inline citation marker）
- `[02]` = Claude Research（域名级 source 列表）
- `[03a]` = ChatGPT Deep Research 终稿（citeturn ID，无 URL）
- `[03b]` = ChatGPT Deep Research 大纲 + source 清单（最完整的机构名 inventory）
- `[04]` = Gemini Deep Research（几乎无引用）

---

## 维度 1：阶段切分方式

| 切分方式 | 来源 | 置信 |
|---|---|---|
| **5 段（自称）/ 6 段（实际展开）**：声称 G1-G5 / G6-G8 / G9-G10 / G11 / G12，内文展开为 G1-G3 / G4-G5 / G6-G8 / G9-G10 / G11 / G12（内部不一致） | [01] | ⭐⭐ |
| **NACAC 4 段框架**：K-5 / G6-G8 / G9-G11 上半 / G11-G12（[01] 用此 4 段；[02] 用 G1-G5 / G6-G8 / G9-G10 / G11-G12 的同源 4 段） | [01][02][03a] 三家都直接引用 NACAC Step by Step | ⭐⭐⭐ |
| **不硬切年级，按"决策点"组织**：学校体系 / 课程体系 / 美高 / 标化 / 顾问 / 财务 | [02][03a][03b] 都倾向此 framing；[02] section 6.3 明确说"分阶段本身是 marketing 简化" | ⭐⭐⭐ |
| **7 章主题切分**（学校 / 课程 / 美高 / 申请池 / 身份 / 财务 / 结论） | [04] | ⭐ |

**Synthesis 判断：** [02][03a] 都明确说"按年级硬切是营销简化"。但 NACAC 框架是行业基线，可作为骨架引用。Mockup v3 可考虑混合 —— 大骨架按 NACAC 4 段，每段内部按"决策点"列内容，**不强调精确年级切分**。

**待核验 source：** NACAC "Step by Step" framework — https://www.nacacnet.org/

---

## 维度 2：硬节点 vs 弹性节点

### 真正硬截止（多家共识）

| Claim | 来源 | 置信 | 待核验 source |
|---|---|---|---|
| Common App **8/1 开放新一轮申请** | [01][02] 两家 | ⭐⭐ | commonapp.org |
| Coalition 8/15 开放 | [01] 单家（[02] 不提 Coalition — cross-review verified） | ⭐ | commonapp.org |
| 顶校 ED/EA 集中在 **11/1-11/15**；ED II / RD 多在 **1/1-1/15** | [01][02][03a] 三家共识，[01][02] 引 Common App Requirements Grid + Harvard 官网，[03a] 引 Common App | ⭐⭐⭐ | commonapp.org Requirements Grid |
| NACAC 标准：**10/15 不应早于最早 deadline**；**5/1 是最早统一答复日** | [03a] 单家明确 10/15+5/1；[02] 只列 5/1 不列 10/15（cross-review verified） | ⭐⭐ | nacacnet.org |
| **Andover 申请截止日期 — 家间实质冲突**：[01][03a] 明确说 **2/1**；[02] section 三第一条**明确把 Andover 也归入 1/15**（与 Exeter 并列）；[04] line 59 笼统说"1月15日是绝大多数顶尖美高"未单列 Andover — 实质冲突在 [01][03a] vs [02][04]，**R2 修正：[04] 不属"明确 2/1"组**，mockup v3 之前必须 WebFetch andover.edu 解决 | [01][03a] vs [02][04] | 🚨 **家间冲突未解决** | **andover.edu/admission（必核）** |
| 其他顶级寄宿：Exeter/Choate/Deerfield/Lawrenceville/Hotchkiss **1/15** | [01][02][03a]；[04] 笼统说"大多数 1/15" | ⭐⭐⭐ | exeter.edu, deerfield.edu, lawrenceville.org, hotchkiss.org |
| 寄宿美高决定释放：**3/10 前后**；回复截止 **4/10** | [01][02][03a] | ⭐⭐⭐ | 同上 |
| SAT/ACT 主要 testing window：**junior spring 到 senior fall**（密集备考 3-6 个月） | [01][02][03a][04] 四家共识，[04] 多处批"早开始"焦虑营销 | ⭐⭐⭐ | College Board SAT dates, NACAC junior/senior checklist |
| **顶校 testing policy 回潮趋势**：Dartmouth 已恢复（Class of 2029）；Yale / Brown 已恢复或宣布恢复；Princeton 宣布 **2027-28 周期起恢复** | [01][02][03b] 三家共识趋势 | ⭐⭐⭐ | admissions.dartmouth.edu, princeton.edu, brown.edu/admission |
| **Harvard 当前 SAT/ACT 政策 — 家间冲突**：[01] 明确说"Harvard 要求 SAT 或 ACT"；[03b] 也说"Harvard 当前要求"；但 [02] line 18 引 Crimson 说"Harvard 在 **Class of 2030 之前继续保持 test-optional**" — 实质冲突 | [01][03b] vs [02] | 🚨 **家间冲突未解决** | **college.harvard.edu/admissions（必核）** |
| MIT 明确要求 SAT/ACT；Yale test-flexible（ACT/SAT/AP/IB） | [03b] | ⭐⭐ | mitadmissions.org, admissions.yale.edu |
| Harvard：无法接触 SAT/ACT 时可用 AP/IB/A-Level/国家毕业考替代 | [01][03b] | ⭐⭐ | college.harvard.edu admissions |

### Elastic / 营销建构（多家共识警示）

| Claim | 来源 | 置信 |
|---|---|---|
| **低龄 (G7-G9) 一对一标化辅导**没有 admission impact 证据 | [01][02][03a][04] 四家共识；[04] 用"完全反智且违背教育规律的投资"措辞 | ⭐⭐⭐ |
| **5 年长期顾问合约**无独立研究支持其边际回报；服务于中介现金流 | [02][03a][04] 三家明确批；[01] 提"G4-G5 甚至 G1-G3 就签 5 年美高规划合同通常不是必要支出"（针对美高规划合同语境） | ⭐⭐⭐ |
| **付费高端"名校夏校"** admission signal 接近零；只有 highly selective（RSI / SSP / TASP / PROMYS / 1-5% 录取率）才有意义 | [02][04] | ⭐⭐ |
| **国际游学 / 海外义工**几乎无招生官公开承认权重 | [02][04] | ⭐⭐ |
| **Common App 允许填 10 项 activities，不是必填满**；Harvard / MIT 明说看质量不看数量 | [02][03a] | ⭐⭐⭐ |
| **过早 specialization / "兴趣堆量"**：钢琴+小提琴+网球+击剑+机器人+辩论+编程 每样 1-2 年后弃掉，留下疲惫不是 spike | [02][04] | ⭐⭐ |
| **Sean Logan 招生分桶引言**（Andover 现任 college counseling director）：顶校招生官把申请分"桶"，"标化分数高得离谱"并不在任何能产生显著差异的桶里 | [02] line 281 引 WBUR News 2013-12-26 | ⭐⭐ |
| **FERPA waiver**：Common App 强烈建议学生勾选"放弃查看推荐信权"以增加推荐信公信力 | [02] line 53 | ⭐⭐ |

**待核验 source：**
- Common App activities section guidance → commonapp.org
- MIT "quality over quantity" 原句 → mitadmissions.org blogs
- Harvard "activities" 描述 → college.harvard.edu

---

## 维度 3：大学最看重什么（admission factors）

| Claim | 来源 | 置信 | 待核验 source |
|---|---|---|---|
| NACAC 2023 admission factors：**college prep grades / 总成绩 / 课程强度** 列最重要；SAT/ACT "considerable importance" 显著下降 | [01][03a] 都引 NACAC 2023（[01] section 0 + section 1 "76.8% 受访大学列 considerable importance / overall 74.1% / 课程强度 63.8%"，[03a] 引同源）| ⭐⭐ | nacacnet.org State of College Admission 2023 |
| Yale: transcript = "**single most important document**" | [03a] 单家 + 引 Yale 官网 | ⭐⭐ | admissions.yale.edu what yale looks for |
| Harvard: 最强申请者 = 在本校可获得范围内修读最有挑战性课程 | [01][03a] 都引 Harvard 官网 | ⭐⭐ | college.harvard.edu |
| 推荐信主要来自**最近的核心学科老师**（junior/senior year）| [01][02][03a] 三家共识；[01] 引 Stanford "G11/G12 老师 / G10 老师只有课程足够 advanced 时才可考虑" + Harvard "两个不同学科了解学生的老师" | ⭐⭐⭐ | admissions.yale.edu recommendation letters |
| Stanford 看 **grades 9-12**；Yale 看完整 transcript | [01][03a] | ⭐⭐ | admission.stanford.edu, admissions.yale.edu |
| 推荐信"老师需要认识学生 **12-18 个月以上**"才能写强推 | [02] 单家 | ⭐ | 无 institutional source，可能 derived from practice |

---

## 维度 4：美高分支（G7-G9 转轨窗口）

### 高置信共识
| Claim | 来源 | 置信 |
|---|---|---|
| 美高是**可选分支不是必经路径** | [01][02][03a][04] 4 家都把它处理成分支 | ⭐⭐⭐ |
| 美高准备合理窗口 = **G7-G8 启动**（不是小学低龄）| [01][03a][04] 三家都引学校 deadline 推断 | ⭐⭐⭐ |
| 顶级寄宿 college counseling **junior year 才真正进入高频** | [01][03a] 都引 Deerfield "not in earnest until junior year" + Andover "11 年级 12 月正式启动 / 1 月分配 counselor" | ⭐⭐⭐ |

### 🚨 维度内的家间对立
| Claim | [01] | [02] | [03a] | [04] |
|---|---|---|---|---|
| **美高 = 自动 domestic 池**（中国生申美本自动避开国际池）| — **未明确表态**（cross-review verified：[01] 只讲美国护照 vs 中国护照 citizenship 差异，未单独针对"美高中国生 vs 国内中国生"做 pool 论述）| ❌ 反对（section 三明确："美高路径**不会自动**把孩子从'国际生池'切换到'美国本土池'——录取池切分是按公民身份/居住国，不是学校所在地"）| ❌ 反对（引 Harvard "regardless of citizenship"）| ✅ 主张（section 3："美高中国学生... 大部分大学会将其档案直接划入'就读于美国本土高中的申请池'... 巧妙且合法地避开了... 中国大陆国际生申请池"）|

**[04] 与 [02][03a] 两家明确对立**（[01] 在这点未表态）。这是 mockup v3 必须 surface 的核心争议点，**不能简单偏向任何一方而不标注证据来源**。[02][03a] 明确说"按 citizenship 切分"，但都没给"美高生中国籍 vs 国内国际学校生中国籍"在 admission rate 上的对比数据，所以**真相的真相也未完全解决**：池切分是按 citizenship，但 school context / counselor / teacher recommendation 质量差异可能间接影响 admission outcome。

### 待核验 source
- Deerfield college advising 页面：`deerfield.edu` 找 "college counseling"
- Andover college counseling 流程：`andover.edu` 找 11 年级时间点
- Harvard "regardless of citizenship" 原文：college.harvard.edu international applicants

### 单家 / 存疑
| Claim | 来源 | 置信 |
|---|---|---|
| 国际学校只录持外国护照学生（部分学校）| [02][04] | ⭐⭐ |
| ~~Andover 接受率约 13% / Exeter 约 13%~~ | ❌ **3/3 cross-review concur：4 份原始 report 全部 grep 不到 13% 这个数字。删除（之前是 raw matrix 瞎编）** | — |
| Vericant / InitialView 第三方预审是顶尖美高对大中华区申请者的常规要求 | [01][04]（cross-review verified：[02] 不提 Vericant/InitialView）| ⭐⭐ |

---

## 维度 5：课程体系 AP / IB / A-Level

| Claim | 来源 | 置信 |
|---|---|---|
| **没有任何顶校公开偏好**某一体系 | [01][02][03a] 三家共识 | ⭐⭐⭐ |
| Stanford 把 A-Level / national curriculum / IB Diploma **并列**接受 | [03a] | ⭐⭐⭐ |
| Princeton：评估 "项目本身的 curriculum 上下文"（IB / A-Level / AP 并列）| [02] | ⭐⭐ |
| 关键评估维度："**在你所在学校的提供选项里，是否选了最难的课**" | [02][03a] | ⭐⭐⭐ |
| AP / IB 学分置换差异（Stanford 给 IB HL Chem 高分 10 quarter units / AP Chem 5 分 5 units）| [02] 转引 PrepScholar | ⭐ 二手，需核 Stanford 官方 credit policy |
| "IB Diploma 生在顶校录取率上略高于非 IB 同行"（self-selection bias 严重）| [02] 转引 tutelaprep.com，标注未严格验证 | ⭐ |

**待核验 source：**
- admission.stanford.edu international applicants 段落（AP/IB/A-Level 并列引用）
- princeton.edu/admission/apply academic preparation 段落

---

## 维度 6：国际生身份 vs 美籍护照

### 高置信
| Claim | 来源 | 置信 |
|---|---|---|
| 申请池按 **citizenship 切分**，不按"你在哪个国家读高中" | [01][02][03a] 三家共识；[04] 在 G7-G9 美高节点反对此论 (见维度 4) 但在 return-to-US 段又承认 | ⭐⭐⭐ |
| Yale / Princeton 对国际生公开 **need-blind + meet full need** | [01][02][03a] | ⭐⭐⭐ |
| Harvard 对国际生同样 need-blind | [02] | ⭐⭐⭐ |
| **本科国际生奖助学金整体仍有限** — NAFSA 总判断 | [03a] | ⭐⭐ |
| Yale: 英语非母语 + 未在英语授课中完成至少 **2 年中学教育** → 须提交英语成绩 | [01][03a] | ⭐⭐⭐ |
| Princeton: 母语非英语 + 学校非英语授课 → 须 TOEFL/IELTS/DET/PTE；**3 年以上英语授课可豁免** | [03a] | ⭐⭐ |
| Yale: 所有非英文材料须 **certified translation** | [01][03a] | ⭐⭐⭐ |
| Need-blind for international 完整名单（2025）：Harvard / Yale / Princeton / MIT / Amherst / Bowdoin / Dartmouth / Brown / Notre Dame = 9 所 | [02] 给完整列表；[01] 提 Yale "少数 need-blind 学校之一"；[03a] 提 Princeton/Yale | ⭐⭐⭐ |
| **Need-aware ≠ 不发钱 nuance**：need-aware 只是把援助申请者池单独考虑；家庭如完全自费，则与 need-blind 等同对待 | [02] section 5.4 | ⭐⭐ |
| **Open Doors 2025 数据 — 度量口径不同非实质冲突**（R2 修正）：[02] 引 IIE 2025 详细数字：1,177,766 整体国际生 **同比增长 5%** / 国际本科生 **同比增长 4%** / 中国 265,919 (-4%) / 印度 363,019 (+10%)；[04] 给"美国大学接待近117万 / **新入学国际生总数下降 7%**"。**R2 grep verified [02] 整体存量 +5% vs [04] 新入学增量 -7% 是不同度量口径，两数可同时成立** | [02] +5%/+4% 存量 + [04] -7% 新入学增量 | ⭐⭐（不算冲突）| nafsa.org, opendoorsdata.org（如需 mockup 引用具体数字仍建议核验当时口径） |
| Harvard Class of 2028 整体录取率 **3.59%**（54,008 申/1,937 录） | [02] 引 The Harvard Crimson 2024-03-29 | ⭐⭐ |

### 高风险（单家具体数字 + 无可核 source）
| Claim | 来源 | 置信 |
|---|---|---|
| 🔴 "顶尖常春藤对中国籍非美高申请者**有效录取率 1.5%**" | [04] section 4 | 🔴 [02] section 5.5 明确说"中国籍配额的具体数字没有任何顶校公开过... 按'无定论'处理"|
| 🔴 "NYU 单一学年新注册中国学生曾高达 **1481 人**" | [04] section 4 | 🔴 单家无 source |
| 🔴 "国别配额是否真实存在" | [02] 明确列入"我们不知道"（cross-review verified：[01] 未提"配额"概念，之前 raw matrix 标 [01][02] 是错的，已修正为仅 [02]）| — |
| 🔴 "中国家庭年收入 **17.1%** 用于教育；低收入家庭 **56.8%**；收入弹性系数 **0.306**" | [04] section 6 | 🔴 单家无 source |
| 🔴 "Andover 国际生 TOEFL 参考线 ≥ 100 / IELTS ≥ 7.5 / Duolingo ≥ 135"| [02] 引 Andover 官网 admissions FAQ 2024-25 | ⭐⭐ 二家但只 [02] 明确数字 |

**待核验 source：**
- admissions.yale.edu international applicants — 英语 2 年要求
- admission.princeton.edu international students — TOEFL 3 年豁免
- college.harvard.edu international — citizenship 池规则
- nafsa.org 国际生 financial aid 报告

---

## 维度 7：学校体系选择（公立 vs 双语 vs 国际学校）

| Claim | 来源 | 置信 |
|---|---|---|
| 学校体系本质问题 = 能否提供"**连续 G9-G12 学术表现 + 可信教师评价 + 英文工作能力 + 清楚 school context**" | [03a] | ⭐⭐（基于大学端公开标准推断 / 单家 + 强 source）|
| 公立路径**主要风险不在难度，在转轨成本**（英文学术写作 / 英文推荐信 / G9 transcript 取回） | [03a] | ⭐⭐ |
| NACAC 提醒：很多文化里 9 年级属 middle school，但大学仍要 9 年级成绩 | [03a] | ⭐⭐ |
| **三体系无标准化对照录取率研究** — 中介声称的"我们国际学校 X% 进藤校"几乎都是分母选择性问题 | [02] 明确说 | ⭐⭐ |
| **中国大陆 SAT 考点仅向就读中国教育部认证的国际学校的学生开放**；其他学生须出境到香港 / 澳门 / 新加坡 / 韩国 / 日本 / 台湾 | [02] section 4.1 引 College Board | ⭐⭐ |
| **Digital SAT 转轨时间**：2023/3 起国际考场全面机考；2024/3 起美国本土也全面机考 | [02] section 4.1 | ⭐⭐ |

### 走读私校分支（[01] 独家详述，synthesis-raw 之前漏掉）
| Claim | 来源 | 置信 |
|---|---|---|
| Horace Mann 2026-27 cycle：申请 2025/8/4 开放；9/10 面试开始；10/15 保证面试截止；11/15 application + financial aid；1/15 完整材料 | [01] section 3.2 | ⭐⭐ |
| Trinity NYC：**不发 visa/I-20**；国际学生必须随父母迁居并读到 G12；所有申请者必须具英语读写说能力 | [01] | ⭐⭐ |
| 走读私校多数不能为国际学生签发 I-20，家庭须解决居住和签证身份 | [01] | ⭐⭐ |

---

## 维度 8：低龄阶段（G1-G6）该做什么

### 共识：发展为主，不是 application-building
| Claim | 来源 | 置信 |
|---|---|---|
| NAEYC: **play is essential for all children, birth through age 8** | [03a] 单家 + 强 source（NAEYC DAP statement）| ⭐⭐ |
| NAEYC: play 促进 self-regulation / language / cognitive / social competencies | [03a] | ⭐⭐ |
| Harvard 儿童发展中心: 执行功能与自我调节 = 脑内空管系统 | [03a] 单家 + 引 developingchild.harvard.edu | ⭐⭐ |
| AAP: recess 对社会情绪 / 身体 / 认知发展是必要休息 | [01][03a] 都引 AAP | ⭐⭐ |
| AAP: 睡眠指导建议夜间屏幕至少在睡前 **1 小时** 关闭；CDC/AASM 6-12 岁需 **9-12 小时**，13-18 岁 **8-10 小时** | [01][03a] | ⭐⭐ |
| **元分析：家长介入作业与成绩总体呈弱负相关**（middle school 文献里 "help with homework" 是明显例外）| [03a] | ⭐⭐ 一手研究，待核作者 |
| AAP: 青春期前避免**单一运动专项化**；multi-sport 参与有利长期表现 | [01][03a] 都引 AAP 临床报告（[02] 未提此条 — cross-review verified） | ⭐⭐ |
| Piaget concrete operational：约 7-11 岁 — 对具体问题逻辑推理上升 | [01][02][03a][04] 四家共识 | ⭐⭐⭐ |
| Erikson Identity vs Role Confusion 12-18 岁：青春期 = 身份认同关键期 | [02][04] | ⭐⭐ |
| Steinberg Age of Opportunity：青春期 = 大脑可塑性第二高峰窗口，从约 10 岁延伸到约 25 岁 | [02] 详引 (p.22) | ⭐⭐ |
| Madeline Levine: 过早成就驱动抚养与儿童期焦虑/抑郁正相关 | [02][04] 都引 The Price of Privilege | ⭐⭐ |

**待核验 source：**
- naeyc.org DAP position statement
- developingchild.harvard.edu executive function
- aap.org sleep guidance + sports specialization
- pediatrics.aappublications.org "Power of Play" policy statement

---

## 维度 9：顾问 / 外援

| Claim | 来源 | 置信 |
|---|---|---|
| **IECA Professional 门槛（[02] 版）**：硕士学位 + 3 年专业经验（其中至少 1 年独立顾问执业）+ 推荐人 + 定期校访 + 不接学校 placement 佣金 | [02] 引 iecaonline.com（单家但强 source） | ⭐⭐ |
| **IECA Professional 门槛（[03a] 版）**：至少 3 年咨询经验 + 已与大量学生工作过 + college 顾问要在过去 **5 年内完成至少 50 次 evaluative campus visits** | [03a] | ⭐⭐ |
| ⚠️ **两版门槛数字不一致** — mockup v3 前必须 WebFetch iecaonline.com 解决 | — | 🚨 待核 |
| IECA 现有 **2,800+ Professional 注册顾问** | [02] 引 iecaonline.com 官方数字（单家）| ⭐⭐ |
| IECA Principles of Good Practice：**禁止 ghostwriting**；不接学校 placement 佣金 | [01][02][03a] 三家共识 | ⭐⭐⭐ |
| AICEP CEP 认证：通常 2-5 年从业经验 + 通过考试 | [02][03a] 两家 | ⭐⭐ |
| HECA 平行 IECA 的同类协会，标准类似 | [01][02] 两家 | ⭐⭐ |
| **顾问真正高价值阶段 = G10 末-G12 春（约 2 年）** | [01][02][03a] 三家共识；[04] 提"放手式指导 Hands-off approach" | ⭐⭐⭐ |
| EducationUSA: 提供 accurate / comprehensive / current 信息；**不背书排名**；至少免费一般性介绍 | [03a] 单家 + 强 source（educationusa.state.gov）| ⭐⭐ |
| **美国本土顾问 vs 国内中介**没有 outcome study 证明哪类更好 | [03a] 明确承认 | ⭐⭐ |
| **靠谱顾问识别红线**：不保证录取；不代写文书；以 fit 为核心；尊重学生主体性 | [01] 引 IECA/HECA；[02] 用 IECA 伦理框架；[03a] 用 NACAC SPGP | ⭐⭐⭐ |

**待核验 source：**
- iecaonline.com Principles of Good Practice + member requirements
- nacacnet.org Statement of Principles of Good Practice
- aicep.org CEP 资格
- educationusa.state.gov adviser standards

---

## 维度 10：预算结构

| Claim | 来源 | 置信 |
|---|---|---|
| **Inelastic（必须花）**：Common App 申请费 (每校 $50-110) / SAT/ACT / 托福或 IELTS / AP/IB 考试费 / CSS Profile / 翻译件 / 签证 | [01][02][03a][04] 四家共识 | ⭐⭐⭐ |
| **Elastic（可省）**：低龄一对一标化 / 5 年长合约 / 付费高端夏校 / 活动堆量 | [01][02][03a][04] 四家共识 | ⭐⭐⭐ |
| 🔴 "中国家庭收入 **17.1%** 用于教育；低收入 **56.8%**；收入弹性系数 0.306" | [04] section 6 | 🔴 单家 + 无可核 source |
| 🔴 "NYU/UIUC 中国学生池饱和（NYU 1481 人/年）；Vanderbilt/Rice/Notre Dame 未饱和" | [04] section 4 | 🔴 selection strategy claim，单家无 source |

**待核验 source：**
- commonapp.org application fees + fee waivers
- collegeboard.org SAT registration fees
- ets.org TOEFL fees
- IB exam fees official
- cssprofile.collegeboard.org international + fee waiver

---

## 维度 11：反共识警示（多家共识）

| 反共识 | [01] | [02] | [03a] | [04] |
|---|---|---|---|---|
| "低龄越早越好" 没有证据支持 | ✅ | ✅ | ✅ | ✅（用"病态焦虑营销"措辞）|
| 活动数量不重要，质量 + 持续度 + 真实性才是 | ✅ | ✅ | ✅ | ⚠️（提"伪人设"但没明确数量 vs 质量）|
| SAT/ACT 在 admission factor 里重要性下降（成绩 + 课程强度更重要）| ✅ | ✅ | ✅ | ⚠️ **语境不同但结论部分一致**（cross-review concur：[04] 说"标化是敲门砖"+"分数饱和失去区分度"，与三家"标化重要性下降"是异曲同工 — 不是反对而是 framing 不同）|
| 美高 ≠ 自动 domestic 池 | — 未明确表态 | ✅ | ✅ | ❌ **反对**（主张美高生避开国际池 — 这条 [04] 确实直接对立 [02][03a]）|
| 5 年长顾问合约无独立研究支持 | ✅（限"美高 5 年合同"语境）| ✅ | ✅ | ✅ |
| 付费高端夏校 admission signal 弱 | ⚠️（提"不必要的高端夏校"）| ✅（详引 RSI/TASP 例外）| ⚠️ | ✅ |
| 早期单一运动专项化有害（AAP 临床报告）| ✅ | — | ✅ | — |
| 顶级美高 ≠ 藤校保证 | ✅（坑 6）| ✅ | ✅ | ⚠️（语境含混）|

---

## 维度 12：我们不知道（明确承认的数据空白）

[02] 列了 9 项 "我们不知道"，[03a]/[03b] 也明确说类似几类，[01] section 13 也承认证据薄弱处：

1. 中国籍学生在各顶校国际生池的**具体录取率**（[02] [03a] 都明确）
2. **国别"配额"** 是否真实存在（仅 [02] 列；cross-review verified [01] 未提此概念）
3. 5 年合约 vs 短期合约的 **admission outcome 差距**（[02][03a]）
4. AP vs IB 在顶校录取率上的**实际差距**（[02] 仅 self-selection 数据）
5. **低龄 SAT 备考与最终分数**的关系（[02]）
6. 夏校的 **admission lift** 量化数据（[02]）
7. 国际学校 vs 双语 vs 公立**录取概率对比**（[02][01] 都明确无标准化研究）
8. 文书辅导的**边际回报**量化（[02]）
9. **国际生池 SAT/ACT 中位数**（[02] [03a] 都说各校 CDS 不按国籍 breakdown）
10. 美国本土顾问 vs 国内中介的 outcome 因果差异（[03a]）
11. 中国大陆考点紧张 / 寄递 / 网络等 operational 障碍的精细一手数据（[03a][02]）
12. 美高对美本录取的因果效应（[01] section 13 明确：公开 matriculation 不能证明"同一个孩子去了美高就一定比留在中国更容易进顶校"）
13. Damour / Madeline Levine / Bruni / Deresiewicz 等标杆性著作的**具体章节引用**（[02] 多次标"本研究边界声明"，搜索预算限制未深入核对原文）

**Synthesis 处理：** Mockup v3 里这 13 项**必须明确标"未知 / 不公开 / 行业无共识"**，不能伪装有数据。这本身就是产品价值（[02] 明确说：诚实标"不知道"比假装有数据更负责）。

---

## 下一步：核验优先级

### Tier A — 直接进 mockup v3 的核心 claim（必须核验）
约 15-20 条 ⭐⭐⭐ 共识 claim，逐条做 1 次 WebFetch 确认 source 在那里：
1. NACAC 4 段框架 + 2023 admission factors
2. Common App ED/EA/RD 时间窗
3. 顶级美高 deadline（**Andover 2/1 vs 1/15 家间冲突待 WebFetch andover.edu** / 其他 1/15 / 3/10 释放）
4. 顶校 testing policy 现状（Princeton 2027-28 恢复 / MIT 要求 / Yale flexible / Harvard 要求）
5. 顶校国际生英语要求（Yale 2 年 / Princeton 3 年豁免 / certified translation）
6. AP/IB/A-Level 并列被接受（Stanford / Princeton 引用）
7. 顶级寄宿 college counseling 在 junior year 才真正启动（Deerfield / Andover 原文）
8. NAEYC + AAP + Harvard Child Development 关于早期发展的 official statement
9. IECA Professional 门槛 + Principles of Good Practice
10. Harvard "regardless of citizenship" 原文

### Tier B — 二手转引或 derived，可降权使用
- IECA 2,800+ 数字
- IB Diploma 录取相关性数据
- Stanford IB HL credit 数字
- 推荐信 12-18 个月关系数字

### Tier C — 标 🔴 不进 product
- 04 Gemini 所有具体百分比数字（1.5% 录取率 / 17.1% 收入占比 / 56.8% / NYU 饱和等）
- 各家未给 source 的 admission rate 数字
- ~~Andover/Exeter 13% 接受率~~ —— 已删（cross-review 3/3 concur：原始 4 份 report 全部没有 13% 这个数字，是 raw matrix 瞎编）

### Tier D — Cross-review meta-finding（保留作为 process learning）
- Cross-model review v3 1+1+1（codex / claude opus / gemini）的 single-source 发现里：
  - **3/3 concur 发现** 高度可信（如 13% 是瞎编）
  - **2/3 concur 发现** 可信（如 R1 [04] SAT 立场被夸大、R2 AP/IB 第 6 冲突被夸大）
  - **1/3 single-source 发现** 必须 grep verify — 实测 Gemini 的 4 个 single-source 发现里只有 1 个对，1 个混淆，2 个 hallucination
- 这条本身是 cross-model review 流程的 process learning：**不能盲采纳 single-source finding**

---

## 状态总结（cross-review 修正后）

| 维度 | 高置信 ⭐⭐⭐ | 中置信 ⭐⭐ | 低置信 / 高风险 / 冲突 |
|---|---|---|---|
| 阶段切分 | 2 | 1 | 1 |
| 硬节点 | ~6 | ~6 | 2 家间冲突未解决 🚨 |
| Admission factors | 1 | 4 | 1 |
| 美高分支 | 4（+ 1 家间对立标记）| 2 | 1 实质对立 + 1 已删瞎编 |
| 课程体系 | 2 | 2 | 2 |
| 国际生身份 | 6 | 3 | 4 🔴 + 0 家间冲突（R2 删除 Open Doors 伪冲突）|
| 学校体系 | — | 6 | — |
| G1-G6 发展 | 2 | 7 | — |
| 顾问 | 3 | 5 | 1 家间冲突 🚨 |
| 预算 | 2 | — | 2 🔴 |
| **合计** | **~28** | **~36** | **~12 + 4 家间冲突**（R2 修正后）|

⭐⭐⭐ 数从第一轮的 53 降到 28（实际反映 cross-review concordance）。R2 把家间冲突从 R1 的 6 个缩减到 4 个（删除 2 个伪冲突：Open Doors 度量差 + AP/IB 论域差）。下一动作：把所有 ⭐⭐⭐ 级 + **4 个**家间冲突的 source URL 逐条 WebFetch 核验 → 写进 `synthesis.md`。

---

## 🚨 04 Gemini 与其他三家的方向性偏差汇总（cross-review 修正后）

经 cross-model review（codex + claude opus + gemini concordance）修正后，[04] 与其他三家的对立**比之前 audit 时弱**，但仍有实质冲突：

1. **美高 = 自动 domestic 池**（[04] ✅ 主张 vs [02][03a] ❌ 反对；[01] 未表态）— **仍是实质对立**
2. ~~**SAT/ACT 重要性**~~ — cross-review 修正：[04] 立场是"标化分数饱和失去区分度但仍是敲门槛"，与三家"重要性下降"**异曲同工**，不构成实质对立
3. **具体国别录取率 / 大学池饱和度 / 中国家庭教育支出比例等数字**（[04] 给具体数字 vs [02] 明确说这些数字顶校不公布或市场上是虚构）— **仍是实质对立**

**处理原则：** 在 synthesis.md 和 mockup v3 里，[04] 的独家数字 / 与 [02][03a] 对立 claim **一律标 🔴 不直接进 product 文案**；但 [04] 在中国 context 叙事、return-to-US 差异表达、伪需求识别等表述层面的内容可参考。

## 🚨 R1 surface 的家间冲突（经 R2 修正后保留的）

Cross-review R1 surface 的 6 个候选冲突里，R2 验证后**保留 4 个真实质冲突 + 删除 2 个伪冲突**：

保留 4 个待 WebFetch 解决（与文件顶部一致）：
- **Andover 申请截止日期**：[01][03a] 明确说 **2/1** vs [02] 把 Andover 归入 **1/15** / [04] 笼统"大多数 1/15"
- **Harvard 当前 SAT/ACT 政策**：[01][03b] 说"当前要求" vs [02] 引 Crimson 说"**Class of 2030 之前继续保持 test-optional**"
- **IECA Professional 门槛数字**：[02] 版（硕士 + 3 年 + 1 年独立执业 + 校访）vs [03a] 版（3 年 + 5 年内 50 次 evaluative campus visits）不一致
- **美高 = domestic 池**：[02][03a] 反对 vs [04] 主张（[01] 未表态）

**R2 删除的 2 个伪冲突**：
- ~~Open Doors 2025 方向~~（[02] 整体存量 +5% vs [04] 新入学增量 -7% 是度量口径不同，不是冲突）
- ~~AP/IB/A-Level 顶校偏好~~（[04] 明确限定"对于美籍学生"，论域是 return-to-US 不是顶校偏好）

Audit + R1 + R2 修正记录见 git commit。
