# Path Explorer v0.1 — Source Manifest

**用途**：v0.6 Path Explorer v0.1 小升初 literacy cards 的内容生产锚点。
每张卡片的 fact 必须 trace 到本文件里的 primary 或 secondary source，
否则标注 `[未核实]`。

**范围**：上海地区国际学校 / 双语学校（pre-vet 友好路径），对 G4-G7 过
渡（小升初）的家长。v0.1 覆盖 **3 所学校**（分属不同 tier + 两种学校类
别，见下），v0.2 根据 Kailing 反馈决定是否扩展。

**原则**（来自 CLAUDE.md `content-quality-three-standards`）：
1. 数据正确——每条事实可回溯到真实 source
2. 推理有效——source 的 claim 和 card 的 claim 之间有因果链
3. 无 AI slop——删掉信息量为零的引用

---

## 为什么是这 3 所（Selection philosophy）

Path Explorer v0.1 是 **literacy funnel 的顶部**，不是 personalized
matching。我们选的 3 所学校**分属不同 tier**，并且**跨两种学校类别**
（外籍学校 vs 双语学校），因为：

1. **不同 tier 让不同资源水平的家长看到自己的 reference point**。只写
   top-tier，mid-tier 家庭会觉得"这不是给我看的"；只写 mid，top-tier
   家庭会觉得"层次不够"。
2. **跨类别反映 Shanghai 真实 landscape**。顶级 pre-vet feeder 多数住在
   **外籍学校**（比如 SHSID、SAS），双语学校里最强的占据 top-mid 位置。
   只放双语学校会漏掉最关键的 anchor。
3. **跨类别还揭示一个对没概念的家长很重要的 literacy**：**外籍学校 vs
   双语学校是体制级差别**（招生身份、课程体系、升学去向分布都不同），
   不是 tier 差别。v0.1 content 里要明说。
4. **v0.7 的 1-on-1 定制层会基于 v0.6 的 literacy 基础做深度推荐**
   （forward-compat）。v0.1 的任务是让家长知道 "pre-vet 路径在上海的大
   致分布 shape"，不是替家长做选择。

**⚠️ 明确声明**（写进 v0.1 UI 顶部）：本 v0.1 **不对比、不排名**三所学校
之间的优劣，只选取 3 个有代表性的 tier + 类别样本。家长最终选校需结合
自身资源、身份、地域、孩子匹配度综合判断。

## Selection criteria（公开可追溯）

每所候选必须同时满足：

- 上海地区的国际学校（外籍）或双语学校
- IB / AP / A-Level 其中至少一个体系
- **外籍护照 accessible**（覆盖台湾 / 美国 / 其他外籍情况——**大陆籍 not
  our primary concern**，因为 Ethan 不是大陆籍。外籍专属学校中国籍不
  能读但台/美籍可以读）
- G5 / G6 转学 entry 公开可报（非 G1-only）
- 有 biology / STEM 项目记录
- 升学去向包含 US STEM undergrad

三所学校还需满足：

- 学费 tier 明显不同（梯度 clarity）
- 类别代表性（至少 1 所外籍 + 至少 1 所双语）
- 分属不同区或体系
- 公开信息足够做 v0.1 content（官方 admission page 可访问 + 至少 1
  个 secondary source）

## Shortlist（Tier + 类别 明确标注）

### Tier 1 Top（外籍学校）：上海中学国际部 SHSID

**一句话定位**：上海外籍学校 pre-vet 经典 feeder，学术顶级，国际课程与
中国数学基础相结合的代表。

| 维度 | 数据 | 状态 |
|------|------|------|
| 类别 | 外籍学校（foreign-passport-only） | 已知 |
| 区域 | 徐汇 | 已知 |
| 体系 | IB DP + AP 混合 | [待核实最新课程结构] |
| 学费 | ~25-30 万/年 | [待核实 - 查官网] |
| 入学阶段 | 小学 / 初中 / 高中分 section，分段入学 | [待核实 G5/G6 转学开放] |
| 入学身份限制 | 外籍护照 (US / 台湾 / 日 / 韩 / 其他) — **大陆籍不可读** | [待核实最新政策] |
| STEM 配置 | 实验室 + 学术竞赛训练体系 | [待核实] |
| 生物课程 | IB Biology HL、AP Biology 可选 | [待核实] |
| Pre-vet 升学样例 | Cornell / UC Davis / Johns Hopkins / Duke 等（alumni 档案） | [待核实] |
| 官方 URL | https://www.shsid.org | [待访问核实] |

**Secondary sources 候选**：
- 上海中学官网 alumni 去向页
- 外籍学校榜单（Forbes China / Hurun）
- 家长社群对 SHSID 的 curriculum 描述（筛选后引用）

**Tier rationale**：外籍学校里数学 / 科学底子最硬的一所（因为继承上海
中学本部 legacy），pre-vet + US STEM undergrad 走向明显高于其他外籍学校。
如果 Ethan 是外籍（台 or 美），这是**真顶配路径**的 anchor。

**⚠️ 候选 Tier 1 备选**：如果 SHSID admission 对 Ethan 的 passport 类型
（台湾 vs 美国）有 differential access，考虑换为：
- **上海美国学校 SAS**（US curriculum + AP，对 US passport 最顺）
- **Dulwich Shanghai**（British curriculum + IB + IGCSE，passport
  agnostic）

---

### Tier 2 Top-mid（双语学校）：包玉刚实验学校 YK Pao

**一句话定位**：双语学校里的 top，学费比外籍学校低一截但学术 + 升学
稳定，资源丰富家庭 mixed 选择里的主流。

| 维度 | 数据 | 状态 |
|------|------|------|
| 类别 | 双语学校（Chinese + foreign passport 都收） | 已知 |
| 区域 | 徐汇（G1-G8）/ 松江（G9-G12） | 已知 |
| 体系 | IB PYP + MYP + DP | 已知 |
| 学费 | ~30-35 万/年 | [待核实 - 查官网] |
| 入学阶段 | G1 / G5 / G9 | [待核实转学开放度] |
| 入学身份 | 中外籍都收 | 已知 |
| STEM 配置 | SEED Program + 独立科学实验室 | [待核实当前状态] |
| 生物课程 | IB Biology HL | [待核实] |
| Pre-vet 升学样例 | 有 US STEM undergrad 记录 | [待核实具体学校+频次] |
| 官方 URL | https://www.ykpaoschool.cn | [待访问核实] |

**Tier rationale**：双语学校顶端代表，外籍家庭也会选它（尤其 English-
dominant + 想保留中文深度的家庭）。学费比 SHSID 略高但体系差异大
（IB pure vs IB+AP mix）。跟 SHSID 放一起，content 可以讲"双语学校顶端 vs
外籍学校顶端是 two different games"。

---

### Tier 3 Mid（双语学校）：星河湾双语学校

**一句话定位**：闵行 IB 双语扎实，学费更可达，中产家庭主力选项。

| 维度 | 数据 | 状态 |
|------|------|------|
| 类别 | 双语学校（Chinese + foreign passport 都收） | 已知 |
| 区域 | 闵行 | 已知 |
| 体系 | IB PYP + MYP + DP | 已知 |
| 学费 | ~15-20 万/年 | [待核实 - 查官网] |
| 入学阶段 | G1 / G5 / G9 | [待核实转学开放度] |
| 入学身份 | 中外籍都收 | 已知 |
| STEM 配置 | 标配实验室 | [待核实 specific] |
| 生物课程 | IB Biology SL/HL | [待核实] |
| Pre-vet 升学样例 | Top-100 US / 澳新 / 港校 | [待核实] |
| 官方 URL | https://www.ssbs.sh.cn/ | [待访问核实] |

**Tier rationale**：闵行地区 IB 代表，学费比包玉刚再低 50%+，覆盖预算
15-20 万区间的家庭。pre-vet alumni 数据少于 Tier 1/2，但 biology / STEM
有进 Top-100 US 的 track record（需核实）。对中产家庭是一个真实可达的
anchor。

**⚠️ Tier 3 备选**：如果 Day 1 核实发现星河湾数据不足，换 anchor：
- **上海协和双语某校区**（多校区，多 tier 覆盖）
- **SMIC International Section**（张江，STEM 方向对口）

---

## Per-school research matrix（Day 1 content 作者填表）

每所学校必须 filled-in 以下信息后才能进入 content authoring：

```yaml
school:
  name_zh: <中文名>
  name_en: <英文名>
  category: <foreign_only | bilingual>
  tier: <top | top-mid | mid>
  district: <区>
  curriculum:
    systems: [IB, AP, A-Level, ...]
    languages: [zh, en, ...]
  tuition:
    range_cny: <金额区间>
    source_url: <official page or verified secondary>
    fetched_at: <YYYY-MM-DD>
  admission:
    entry_grades: [G1, G5, G9, ...]
    passport_requirements: <foreign_only | both | chinese_preferred>
    taiwan_us_accessible: true
    application_window: <月份>
    source_url: <URL>
    fetched_at: <YYYY-MM-DD>
  stem_profile:
    biology_tier: <HL available | SL only | combined sciences>
    labs: <short description>
    notable_programs: [<program names>]
    source_url: <URL>
  college_outcomes:
    us_stem_undergrads: [<example schools>]
    pre_vet_alumni_count: <if available>
    source_url: <URL or "anecdotal / social media">
    fetched_at: <YYYY-MM-DD>
  secondary_sources:
    - type: <ranking | parent community | media>
      url: <URL>
      note: <why this source is admissible>
```

---

## 跨校 Supplementary Sources（literacy card 里引用的上海本地 anchor）

Kailing-facing roadmap 示例里用到的 Shanghai-native resources，Day 1
开始 content authoring 时每个必须做 primary source 验证：

| 资源 | 类型 | 官方入口（待验证） | 用途 | 状态 |
|------|------|-------------------|------|------|
| 上海动物园 | 机构 | shanghaizoo.cn | 低年龄段 observation | [待访问] |
| 上海自然博物馆 | 机构 | www.snhm.org.cn | 低年龄段 observation + 夏令营 | [待访问] |
| 上海野生动物园 | 机构 | www.shwzoo.com | 低年龄段 observation | [待访问] |
| 上海海洋水族馆 | 机构 | sh-soa.com | 低年龄段 observation | [待访问] |
| 崇明东滩鸟类国家级自然保护区 | 机构 | www.dongtan.cn | 鸟类迁徙观察 | [待访问] |
| 上海观鸟会 | 民间 | www.shwbs.org | 家庭公开观鸟活动 | [待访问] |
| 《博物》杂志 | 出版物 | www.dili360.com/nh/ | 中文少年科普 | [待访问] |
| B 站 "无穷小亮" | UP 主 | space.bilibili.com/14804670 | 科普视频 | [待访问] |
| B 站 "星球研究所" | UP 主 | space.bilibili.com/326427334 | 地理/生态 | [待访问] |
| iNaturalist APP | 工具 | inaturalist.org | 物种观察日志 | [待访问] |
| 中国观鸟记录中心 | 工具 | birdreport.cn | 本地物种记录 | [待访问] |
| 英才计划 | 项目 | www.ycjh.org.cn | 高中生科研入口 | [待访问] |
| 丘成桐中学生科学奖 | 项目 | www.yau-awards.com | 中学生科研赛道 | [待访问] |
| Johns Hopkins CTY | 项目 | cty.jhu.edu | 海外 summer program | [待访问] |
| Cornell Summer College | 项目 | sce.cornell.edu/precollege | 海外 summer program | [待访问] |

---

## Open questions（Day 0 阶段先不 resolve，写入 followup）

1. **Ethan 具体护照（台湾 vs 美国）对 SHSID admission 的 impact**：SHSID
   历史上对非大陆外籍都开放，但 passport tier 内部有没有差别政策 Day 1
   核实。
2. **Tier 3 用星河湾还是备选**（协和 / SMIC）：Day 1 核实环节 flag，看
   哪所公开数据支撑度更足。
3. **Kailing 真实 reference group**（她中介小姐妹的客户家长）里是否有
   更具代表性的学校？4/16 或晚上深聊之后再决定是否扩展 v0.2 shortlist，
   **不 block v0.1**。
4. **上海本地机构的年度活动时间窗**（夏令营、观鸟季）是否稳定？不稳
   定的改用"关注官方公众号"软表述，不硬编码日期。

---

## Day 0 完成标准

- [x] 3 所 shortlist 明确 + tier + 类别 标注 + selection philosophy 落纸
- [x] Selection criteria 公开可追溯（已改为 "外籍护照 accessible"）
- [x] 跨类别（外籍 vs 双语）rationale 写清楚
- [ ] 三所学校官方 URL 访问验证（Day 1 作者做）
- [ ] 三所学校学费 / 入学阶段 / STEM 配置 at minimum 有一条 secondary
      source（Day 1 作者做）
- [ ] 跨校 supplementary sources 每条 URL 访问验证（Day 1 作者做）
- [x] Forward-compat 到 v0.7 option3 的 contentVariant 映射已在 philosophy
      段标注

Day 0 现在的产出是 **structural manifest**（shortlist + 理由 + criteria）。
**facts 核实 = Day 1 content authoring 阶段的 TDD 前置步骤**，不是 Day 0
范围。

---

## Next step

进入 **Day 1 Prisma schema 扩展**。manifest 不会 block Day 1 schema 工作
（schema 是 content-agnostic）。facts 验证与 schema 开发可并行。

Ethan 确切 passport 类型确认后，回来 review Tier 1 的 SHSID vs 备选
（SAS / Dulwich）——但 v0.1 shortlist 即使 SHSID 需要换，manifest
structure 不变。
