# Synthesis Raw — 4-way 对比 matrix（未核验态）

**状态：草稿 / 未独立核验任何 source URL**

**目的：** 把 4 份 research 的 claim 按维度横向铺开，标置信等级 + 列出对应该去核验的 official source 候选。下一步是对每条 ⭐⭐⭐ claim 做 WebFetch 反向核验 → `synthesis.md`。

**置信等级定义：**
- **⭐⭐⭐ 高置信**：3+ 家共识 + 都指向同一权威源（NACAC / 顶校 admissions 页 / Common App / College Board / IBO / NAEYC / AAP 等）
- **⭐⭐ 中置信**：2 家共识 OR 1 家 + 给了明确机构 source
- **⭐ 低置信**：单家独说 / 无 source / 各家冲突
- **🔴 高风险**：单家给了具体数字但没 source，且其他家明确说"这类数字不公开"

> **⚠️ ⭐ 等级是 raw 初筛标记**：在 audit 过程中发现本文件多处把"2 家共识 + 强官方 source"标成了 ⭐⭐⭐（按严格定义应是 ⭐⭐）。这种误差在 raw matrix 阶段保留，**最终置信等级以 `synthesis.md` 中 WebFetch 核验后的结果为准**。Raw 文件的 ⭐ 仅用于决定核验优先级，不是终极判决。Audit 主要修正的是 **claim 归属和具体数字**（哪条 claim 在哪份 report 出现 / 04 与三家对立等方向性差异），而非 ⭐ 等级的精确度。

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
| Common App **8/1 开放新一轮申请**；Coalition 8/15 开放 | [01][02] | ⭐⭐⭐ | commonapp.org |
| 顶校 ED/EA 集中在 **11/1-11/15**；ED II / RD 多在 **1/1-1/15** | [01][02][03a] 三家共识，[01][02] 引 Common App Requirements Grid + Harvard 官网，[03a] 引 Common App | ⭐⭐⭐ | commonapp.org Requirements Grid |
| NACAC 标准：**10/15 不应早于最早 deadline**；**5/1 是最早统一答复日** | [02][03a] | ⭐⭐⭐ | nacacnet.org |
| Andover 申请截止 **2/1**（区别于其他寄宿）；Exeter/Choate/Deerfield/Lawrenceville/Hotchkiss **1/15** | [01][03a] 明确分开列出 Andover 单独 2/1；[02][04] 笼统说"大多数 1/15"未单列 Andover | ⭐⭐⭐ | andover.edu/admission, exeter.edu, deerfield.edu, lawrenceville.org, hotchkiss.org |
| 寄宿美高决定释放：**3/10 前后**；回复截止 **4/10** | [01][02][03a] | ⭐⭐⭐ | 同上 |
| SAT/ACT 主要 testing window：**junior spring 到 senior fall**（密集备考 3-6 个月） | [01][02][03a][04] 四家共识，[04] 多处批"早开始"焦虑营销 | ⭐⭐⭐ | College Board SAT dates, NACAC junior/senior checklist |
| **顶校 testing policy 回潮趋势**：Dartmouth 已恢复（Class of 2029）；Harvard / Yale / Brown 已恢复或宣布恢复；Princeton 宣布 **2027-28 周期起恢复** | [01][02] 都覆盖 testing 回潮，[01] 详列 Harvard/Dartmouth/UC；[02] 详列 Dartmouth/Yale/Brown/Harvard Class of 2029；[03b] 单独点 Princeton 2027-28 | ⭐⭐⭐ | college.harvard.edu, admissions.yale.edu, princeton.edu, admissions.dartmouth.edu, brown.edu/admission |
| MIT 明确要求 SAT/ACT；Yale test-flexible（ACT/SAT/AP/IB） | [03b] | ⭐⭐ | mitadmissions.org, admissions.yale.edu |
| Harvard 当前要求 SAT/ACT；无法接触时可用 AP/IB/A-Level | [01][03b] | ⭐⭐⭐ | college.harvard.edu admissions |

### Elastic / 营销建构（多家共识警示）

| Claim | 来源 | 置信 |
|---|---|---|
| **低龄 (G7-G9) 一对一标化辅导**没有 admission impact 证据 | [01][02][03a][04] 四家共识；[04] 用"完全反智且违背教育规律的投资"措辞 | ⭐⭐⭐ |
| **5 年长期顾问合约**无独立研究支持其边际回报；服务于中介现金流 | [02][03a][04] 三家明确批；[01] 提"G4-G5 甚至 G1-G3 就签 5 年美高规划合同通常不是必要支出"（针对美高规划合同语境） | ⭐⭐⭐ |
| **付费高端"名校夏校"** admission signal 接近零；只有 highly selective（RSI / SSP / TASP / PROMYS / 1-5% 录取率）才有意义 | [02][04] | ⭐⭐ |
| **国际游学 / 海外义工**几乎无招生官公开承认权重 | [02][04] | ⭐⭐ |
| **Common App 允许填 10 项 activities，不是必填满**；Harvard / MIT 明说看质量不看数量 | [02][03a] | ⭐⭐⭐ |
| **过早 specialization / "兴趣堆量"**：钢琴+小提琴+网球+击剑+机器人+辩论+编程 每样 1-2 年后弃掉，留下疲惫不是 spike | [02][04] | ⭐⭐ |

**待核验 source：**
- Common App activities section guidance → commonapp.org
- MIT "quality over quantity" 原句 → mitadmissions.org blogs
- Harvard "activities" 描述 → college.harvard.edu

---

## 维度 3：大学最看重什么（admission factors）

| Claim | 来源 | 置信 | 待核验 source |
|---|---|---|---|
| NACAC 2023 admission factors：**college prep grades / 总成绩 / 课程强度** 列最重要；SAT/ACT "considerable importance" 显著下降 | [03a] 明确引 NACAC 2023 | ⭐⭐⭐ | nacacnet.org State of College Admission 2023 |
| Yale: transcript = "**single most important document**" | [03a] | ⭐⭐⭐ | admissions.yale.edu what yale looks for |
| Harvard: 最强申请者 = 在本校可获得范围内修读最有挑战性课程 | [03a] | ⭐⭐⭐ | college.harvard.edu |
| 推荐信主要来自**最近的核心学科老师**（junior/senior year）| [02][03a] | ⭐⭐⭐ | admissions.yale.edu recommendation letters |
| Stanford 看 **grades 9-12**；Yale 看完整 transcript | [03a] | ⭐⭐⭐ | admission.stanford.edu, admissions.yale.edu |
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
| **美高 = 自动 domestic 池**（中国生申美本自动避开国际池）| ❌ 反对 | ❌ 反对（section 三明确："美高路径**不会自动**把孩子从'国际生池'切换到'美国本土池'——录取池切分是按公民身份/居住国，不是学校所在地"）| ❌ 反对（引 Harvard "regardless of citizenship"）| ✅ 主张（section 3："美高中国学生... 大部分大学会将其档案直接划入'就读于美国本土高中的申请池'... 巧妙且合法地避开了... 中国大陆国际生申请池"）|

**[04] 与其他三家直接对立**。这是 mockup v3 必须 surface 的核心争议点，**不能简单偏向任何一方而不标注证据来源**。三家明确说"按 citizenship 切分"，但都没给"美高生中国籍 vs 国内国际学校生中国籍"在 admission rate 上的对比数据，所以**真相的真相也未完全解决**：池切分是按 citizenship，但 school context / counselor / teacher recommendation 质量差异可能间接影响 admission outcome。

### 待核验 source
- Deerfield college advising 页面：`deerfield.edu` 找 "college counseling"
- Andover college counseling 流程：`andover.edu` 找 11 年级时间点
- Harvard "regardless of citizenship" 原文：college.harvard.edu international applicants

### 单家 / 存疑
| Claim | 来源 | 置信 |
|---|---|---|
| 国际学校只录持外国护照学生（部分学校）| [02][04] | ⭐⭐ |
| Andover 接受率约 13% / Exeter 约 13% / 等具体接受率数字 | [01][04] | ⭐ 各家数字略有出入，需核 boardingschoolreview.com 或学校自报 |
| Vericant / InitialView 第三方预审是顶尖美高对大中华区申请者的常规要求 | [02][04] | ⭐⭐ |

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
| Open Doors 2025：中国留美生 265,919 人（-4%）；印度 363,019 (+10%) 首次超中国成最大生源国 | [02] 详引；[04] 也提"美国大学在2024/2025学年接待近117万名国际学生 / 新入学国际生总数实际下降了7%" | ⭐⭐ |
| Harvard Class of 2028 整体录取率 **3.59%**（54,008 申/1,937 录） | [02] 引 The Harvard Crimson 2024-03-29 | ⭐⭐ |

### 高风险（单家具体数字 + 无可核 source）
| Claim | 来源 | 置信 |
|---|---|---|
| 🔴 "顶尖常春藤对中国籍非美高申请者**有效录取率 1.5%**" | [04] section 4 | 🔴 [02] section 5.5 明确说"中国籍配额的具体数字没有任何顶校公开过... 按'无定论'处理"|
| 🔴 "NYU 单一学年新注册中国学生曾高达 **1481 人**" | [04] section 4 | 🔴 单家无 source |
| 🔴 "国别配额是否真实存在" | [02] 明确列入"我们不知道" | — |
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
| 学校体系本质问题 = 能否提供"**连续 G9-G12 学术表现 + 可信教师评价 + 英文工作能力 + 清楚 school context**" | [03a] | ⭐⭐⭐（基于大学端公开标准推断）|
| 公立路径**主要风险不在难度，在转轨成本**（英文学术写作 / 英文推荐信 / G9 transcript 取回） | [03a] | ⭐⭐ |
| NACAC 提醒：很多文化里 9 年级属 middle school，但大学仍要 9 年级成绩 | [03a] | ⭐⭐ |
| **三体系无标准化对照录取率研究** — 中介声称的"我们国际学校 X% 进藤校"几乎都是分母选择性问题 | [02] 明确说 | ⭐⭐ |

---

## 维度 8：低龄阶段（G1-G6）该做什么

### 共识：发展为主，不是 application-building
| Claim | 来源 | 置信 |
|---|---|---|
| NAEYC: **play is essential for all children, birth through age 8** | [03a] | ⭐⭐⭐ |
| NAEYC: play 促进 self-regulation / language / cognitive / social competencies | [03a] | ⭐⭐⭐ |
| Harvard 儿童发展中心: 执行功能与自我调节 = 脑内空管系统 | [03a] | ⭐⭐⭐ |
| AAP: recess 对社会情绪 / 身体 / 认知发展是必要休息 | [01][03a] | ⭐⭐⭐ |
| AAP: 睡眠指导建议夜间屏幕至少在睡前 **1 小时** 关闭；CDC/AASM 6-12 岁需 **9-12 小时**，13-18 岁 **8-10 小时** | [01][03a] | ⭐⭐⭐ |
| **元分析：家长介入作业与成绩总体呈弱负相关**（middle school 文献里 "help with homework" 是明显例外）| [03a] | ⭐⭐ 一手研究，待核作者 |
| AAP: 青春期前避免**单一运动专项化**；multi-sport 参与有利长期表现 | [01][03a] 都引 AAP 临床报告 | ⭐⭐⭐ |
| Piaget concrete operational：约 7-11 岁 — 对具体问题逻辑推理上升 | [01][02][03a][04] 四家共识 | ⭐⭐⭐ |
| Erikson Identity vs Role Confusion 12-18 岁：青春期 = 身份认同关键期 | [02][04] | ⭐⭐⭐ |
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
| **IECA Professional 门槛（[02] 版）**：硕士学位 + 3 年专业经验（其中至少 1 年独立顾问执业）+ 推荐人 + 定期校访 + 不接学校 placement 佣金 | [02] 引 iecaonline.com | ⭐⭐⭐ |
| **IECA Professional 门槛（[03a] 版）**：至少 3 年咨询经验 + 已与大量学生工作过 + college 顾问要在过去 **5 年内完成至少 50 次 evaluative campus visits** | [03a] | ⭐⭐ |
| IECA 现有 **2,800+ Professional 注册顾问** | [02] 引 iecaonline.com 官方数字 | ⭐⭐ |
| IECA Principles of Good Practice：**禁止 ghostwriting**；不接学校 placement 佣金 | [01][02][03a] 三家共识 | ⭐⭐⭐ |
| AICEP CEP 认证：通常 2-5 年从业经验 + 通过考试 | [02][03a] | ⭐⭐⭐ |
| HECA 平行 IECA 的同类协会，标准类似 | [01][02] | ⭐⭐ |
| **顾问真正高价值阶段 = G10 末-G12 春（约 2 年）** | [01][02][03a] 三家共识；[04] 提"放手式指导 Hands-off approach" | ⭐⭐⭐ |
| EducationUSA: 提供 accurate / comprehensive / current 信息；**不背书排名**；至少免费一般性介绍 | [03a] | ⭐⭐⭐ |
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
| SAT/ACT 不是今天最重要的东西（成绩 + 课程强度更重要）| ✅ | ✅ | ✅ | ❌ **反对**（认为标化"饱和"，言下 SAT/ACT 仍重要 + 是"敲门砖"）|
| 美高 ≠ 自动 domestic 池 | ✅ | ✅ | ✅ | ❌ **反对**（主张美高生避开国际池）|
| 5 年长顾问合约无独立研究支持 | ✅（限"美高 5 年合同"语境）| ✅ | ✅ | ✅ |
| 付费高端夏校 admission signal 弱 | ⚠️（提"不必要的高端夏校"）| ✅（详引 RSI/TASP 例外）| ⚠️ | ✅ |
| 早期单一运动专项化有害（AAP 临床报告）| ✅ | — | ✅ | — |
| 顶级美高 ≠ 藤校保证 | ✅（坑 6）| ✅ | ✅ | ⚠️（语境含混）|

---

## 维度 12：我们不知道（明确承认的数据空白）

[02] 列了 9 项 "我们不知道"，[03a]/[03b] 也明确说类似几类，[01] section 13 也承认证据薄弱处：

1. 中国籍学生在各顶校国际生池的**具体录取率**（[02] [03a] 都明确）
2. **国别"配额"** 是否真实存在（[02] [01] 都列）
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
3. 顶级美高 deadline（Andover 2/1 / 其他 1/15 / 3/10 释放）
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

---

## 状态总结

| 维度 | 高置信 claim 数 | 中置信 | 低置信 / 高风险 |
|---|---|---|---|
| 阶段切分 | 2 | 1 | 1 |
| 硬节点 | ~10 | ~2 | — |
| Admission factors | 5 | — | 1 |
| 美高分支 | 4（+ 1 家间对立标记）| 2 | 2 |
| 课程体系 | 3 | 1 | 2 |
| 国际生身份 | 10 | 1 | 4 🔴 |
| 学校体系 | 1 | 3 | — |
| G1-G6 发展 | 9 | 2 | — |
| 顾问 | 7 | 3 | — |
| 预算 | 2 | — | 2 🔴 |
| **合计** | **~53** | **~15** | **~12** |

下一动作：把 Tier A 的 ~15-20 条 claim 逐条 WebFetch 核验 → 写进 `synthesis.md`。

---

## 🚨 04 Gemini 与其他三家的方向性偏差汇总

Audit 发现 [04] 在三个核心点上跟 [01][02][03a] 直接对立，且其立场支持产品后续被中介话术裹挟的风险：

1. **美高 = 自动 domestic 池**（[04] ✅ vs 其他三家 ❌）
2. **SAT/ACT 重要性**（[04] 实际主张标化仍是核心"敲门砖" vs 其他三家说重要性下降）
3. **具体国别录取率 / 大学池饱和度 / 中国家庭教育支出比例 等数字**（[04] 给具体数字 vs [02] 明确说这些数字顶校不公布或市场上是虚构）

**处理原则：** 在 synthesis.md 和 mockup v3 里，[04] 的独家数字 / 与三家对立 claim **一律标 🔴 不直接进 product 文案**；但 [04] 在中国 context 叙事、return-to-US 差异表达、伪需求识别等表述层面的内容可参考。

Audit 修正记录见 git commit。
