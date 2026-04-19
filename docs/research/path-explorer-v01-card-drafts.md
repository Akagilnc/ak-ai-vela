# Path Explorer v0.1 — 3 卡密度验证草稿

**用途**：在 Day 1 Prisma migration 之前，用 3 张代表性卡片（Stage 1 / 2 / 3 各一张）验证"私人管家密度"是否能在 founder 键盘下稳定产出。

**检查标准**：
- ✅ 私人管家密度 = 具体到地址 / 电话 / 项目名 / 竞赛名，有 decision logic，有避坑，有心法，source 可追溯
- ❌ 小红书密度 = 泛化推荐，没 differentiation，没避坑，空洞"要重视"

**3 张卡选的理由**：横跨 3 个 stage，各 stage 选一张"内容最重最难写"的（不是 wrapper 类）：
- Card 1 (Stage 1 代表): 场馆月轮 + 观察本
- Card 10 (Stage 2 代表): 心法 + portfolio 取证
- Card 11 (Stage 3 代表): 国际学校 biology shortlist

**本文件与 Prisma seed 的关系**：Day 3-4 content authoring 时，下面三段 markdown 会 mapped 成 3 条 `PathCardContent` 行（`bodyMarkdown` + `keyFacts` + `sources`）。现在只是 markdown 原文，不做 Prisma schema shape，保持 founder 改写成本低。

---

## Card 1 · 场馆月轮 + 观察本（G1-G3，6-9 岁）

**Stage**：Stage 1 — 好奇心扎根期

**一句话**：这个年龄不追成果，好奇心要扎根在她**每天能看到摸到**的真实世界里。

**怎么做**：

上海有 4 个场馆都值得带她去——西郊动物园看本土物种，南汇野生动物园看散养动物的真实行为，静安自然博物馆看整个生态链怎么串起来，陆家嘴海洋水族馆看水下世界。周末有空就去一个，一两年下来每个场馆都能去几趟。给她带个小本子，画点什么写点什么都行，不用规定——她自己愿意动笔才是这个年龄段要保护的状态。

别去报"小小科学家"那种辅导班。多数是室内放 PPT 讲动物分类的课。6-9 岁最不该做的就是先学分类再看动物，顺序反了她会觉得分类无聊。让她先在场馆里见过真的动物，再读书上的分类，那时候她自己会觉得有意思。

**4 个场馆**：

| 场馆 | 位置 | 电话 | 核心价值 |
|---|---|---|---|
| 上海动物园（西郊）| 长宁虹桥路 2381 号 | 021-62687775 | 中国本土物种为主，孩子"动物不在电视里"的起点 |
| 上海野生动物园 | 浦东南六公路 178 号 | 021-58036000 | 散养 + 笼养混合，看动物**行为**不是 pose |
| 上海自然博物馆（新馆）| 静安北京西路 510 号 | 021-62620116 | 复原生态展陈 + 主题季，看**整个生态链**不是单只动物 |
| 上海海洋水族馆 | 浦东陆家嘴环路 1388 号 | 021-58779988 | 海洋 + 淡水双线，一年级最容易共鸣的"水下世界" |

**Sources**：

1. [shanghaizoo.cn](https://shanghaizoo.cn) — 上海动物园官网（地址 / 开放时间 / 门票）
2. [shwzoo.com](https://shwzoo.com) — 上海野生动物园官网
3. [snhm.org.cn](https://www.snhm.org.cn) — 上海自然博物馆官网（预约系统 / 主题季）
4. [sh-soa.com](https://sh-soa.com) — 上海海洋水族馆官网

---

## Card 10 · 心法 + portfolio 取证（G4-G6，10-12 岁）

**Stage**：Stage 2 — 目的性探索期

**一句话**：10-12 岁所有观察 log 都不是童年回忆，是 3 年后国际学校申请 portfolio 里"**兴趣真实性**"的硬证据。

**为什么 portfolio 要从 10 岁开始**：

国际学校（尤其是 IB / AP 体系的生物方向）在 G9 申请 interview 时问的第一个问题是：**"Why biology?"** 回答有两种：

- **空答案**：从小喜欢动物。（每个家庭都这么说。招生官心里 = 包装了。）
- **实答案**：我从 9 岁开始在 iNaturalist 上记了 247 条物种观察，包括 2025 年春崇明东滩记录到一群反嘴鹬……（有日期、地点、频次。招生官心里 = 真的。）

差别不在孩子更聪明，差别在**时间戳**。9 岁开始的 log，3 年后天然具有 unfakeable 属性。11 年级突击补录的"我一直喜欢动物"无法伪造出 3 年的真实时间线。

**4 个必做的 portfolio 资产**：

| 动作 | 产出（可验证的）| 申请时用于 |
|---|---|---|
| iNaturalist 本地物种观察 | 地理定位 + 时间戳 + 物种 ID + 照片 | 证明"持续 N 年观察 M 种" |
| 中国观鸟记录中心 records | 鸟种清单 + 观察地点 + 频次 | portfolio 里 "systematic effort" 证据 |
| 深度自然体验（成都熊猫基地 / 西双版纳）| 照片 + 视频 + 游记（她自己写）| Interview 里的具体 story 素材 |
| 半学术阅读（《第六次大灭绝》等）| 读书笔记 + 她提出的 3 个问题 | 证明"读过书、有 critical thinking，不只看科普视频" |

**心法 1 · 所有东西打时间戳**：

iNaturalist 自动打。观察本每次写日期。读书笔记标年月日。拍照不修 EXIF。3 年后她打开任何一份材料，招生官能看到"这是 2025 年 4 月她 9 岁时写的"。

**心法 2 · 不要"补拍"**：

11 年级为了申请补拍的 3 年 log 不可信，招生官看多了能识破。现在真实做，从**今天**的 log 起。密度可以低（一个月 3-5 条都行），但要连续。

**暑期重要时间窗**：

- 6 月初：上海自然博物馆、上海动物园官方公众号**暑期科学营报名开放**——每年 6 月初关注，名额秒光
- 7-8 月：深度自然体验档期（成都基地 / 西双版纳一年一次）
- 9 月开学前：复盘暑期 log，补进 portfolio

**Sources**：

1. [inaturalist.org](https://inaturalist.org) — iNaturalist 全球生物观察平台
2. [birdreport.cn](https://birdreport.cn) — 中国观鸟记录中心
3. [panda.org.cn](http://www.panda.org.cn) — 中国大熊猫保护研究中心（成都基地 + 都江堰基地）
4. 《第六次大灭绝》Elizabeth Kolbert · 中信出版社 · 2015（中文版）· ISBN 978-7-5086-5177-2

---

## Card 11 · 国际学校 biology shortlist（G7-G9，13-15 岁）

**Stage**：Stage 3 — 理解转换期

**一句话**：G7 转学时不要问"哪所学校排名最高"，要问"哪所的生物实验室和生态社团能让她**有原创研究产出**"。

**对 biology 方向的上海 4 所 shortlist**：

| 学校 | 体系 | biology 特色 | 生物研究硬信号 |
|---|---|---|---|
| **上海平和双语学校**（浦东金桥）| IB Diploma + AP | IB Biology 正式课程 | **iGEM 团队持续参赛**（2018、2022）——合成生物学高中 track。**4 所里最强生物研究信号** |
| **上外附中国际部**（长宁 / 虹口）| IB + AP | "五大学科特长生七年一贯培养"（数/物/化/生/信息）| "青少年科学家培养基地"合作高校，biology 作为 5 大学科专项培养 |
| **SMIC Private School**（浦东青桐路）| AP + WASC 认证 | 生物 / 物理 / 化学独立实验室 + 天文台 | 中国大陆仅 13 所 **AP Capstone** 之一，160+ 学生/年 AP 考试平均 4.0+ |
| **WLSA 上海学校**（原复旦附中合作）| AP + A-Level | AP Biology + IB HL/SL Biology 可选 | G10-12 两个校区，生物 SL/HL 灵活 [待 Day 3 确认复旦 affiliation 现状] |

**选哪所的决策 logic**：

- 她**要做原创研究 / 投 iGEM / 丘奖**（深度路径）→ **平和** 最直接，有现成 team 和 mentor
- 她**要全面发展 + 科学 × 外语双线**（广度路径）→ **上外附中** 五大学科培养最系统
- 她**要系统 AP 训练 + 美高衔接**（北美直通路径）→ **SMIC** AP Capstone + WASC 认证
- 她**要 IB/AP 混合 + 两校区小规模**（灵活路径）→ **WLSA**

**G7 转学同期必做的 3 件事**：

1. **申请"英才计划"**（中国科协 + 教育部联合项目，上海交大 / 复旦 / 上纽大高中生科研入口）——**免费**，需学校推荐，9-10 月开始申报
2. 海外 summer program：**Johns Hopkins CTY Biology** 或 **Cornell Summer College** pre-college 课程（G8-G9 暑假，3-6 周），这是美本 biology 方向的 demonstrated interest 金标准
3. 启动**原创研究项目**：上海本地鸟类多样性调查 / 长江口湿地生态监测 / 崇明东滩迁徙鸟类 count。目标投稿 **丘成桐中学生科学奖生物组**（每年 9-10 月启动）

**避坑**：

**不要只看"tier 排名"榜单**。这些学校在 pre-vet / 动物科学方向的 biology 强度是**不同 feature 的学校**。一个"排名高"的学校如果生物实验室弱、没 research 导师、没 iGEM 类 team，对她没用——她要的不是"好学校"，是"能让她的研究成形的学校"。

**心法**：

初中是从"喜欢动物"→"理解动物科学"的转换期。**这 3 年的实验室时间和社团时间，直接等于她 G12 申请季"demonstrated interest"的厚度**。做扎实 → 高中 IB Biology HL / AP Biology + 原创研究 portfolio = 金标准。

**Sources**：

1. [wlsashanghaiacademy.com](https://www.wlsashanghaiacademy.com) — WLSA 上海官网
2. [shphschool.com](http://www.shphschool.com) / [en.shphschool.com](https://en.shphschool.com) — 上海平和学校官网
3. [2022.igem.wiki/pinghe/team](https://2022.igem.wiki/pinghe/team) — 平和 iGEM 2022 团队页（生物研究硬信号）
4. [sfls.cn](https://www.sfls.cn) — 上海外国语大学附属外国语学校
5. [smicschool.com](https://www.smicschool.com) — SMIC Private School
6. [ycjh.org.cn](https://www.ycjh.org.cn) — 英才计划全国官网
7. [cty.jhu.edu](https://cty.jhu.edu) — Johns Hopkins CTY
8. [sce.cornell.edu/precollege](https://sce.cornell.edu/precollege) — Cornell Summer College
9. [yau-awards.com](https://www.yau-awards.com) — 丘成桐中学科学奖

---

## 密度自检清单

写完后自己问：

- [ ] 我读完这 3 张，是**"哦这些我/周围家长都想过"**，还是**"这个密度我给朋友讲我讲不到这么清楚"**？
- [ ] 每张卡有没有**至少 1 个非常具体的决策 logic**（不是建议清单）？
- [ ] 避坑项写了**为什么是坑**（机制），还是只说了"别这么做"（规则）？
- [ ] Sources 是否每条都能点开验证？（Card 11 的 [待 Day 3 确认复旦 affiliation] 是坦率的 caveat，不是 AI slop）
- [ ] 一个没 Vela 的家长看到这 3 张，会不会愿意把 `/path/little-animal-scientist` 链接截图发她家长群？

如果 4 条以上 yes → 密度到了，Day 1 migration 开干。
如果 < 4 条 yes → scope 可能需要调整，回来讨论。
