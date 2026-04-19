# Office Hours Briefing — 2026-04-15

## Meta

**Purpose.** Pre-flight research dossier for the upcoming office hours session
that will decide priority and direction for Vela v0.6. Two candidates compete:
issue #24 (scientific trait quiz replacement) and issue #25 (Path Explorer,
the card-based literacy feature).

**What this is.** Facts collected from authoritative sources — frameworks,
instruments, licensing, timelines, costs, references. Organized so the office
hours session can skip the "gather information" phase and go straight into
judgment calls.

**What this is not.** Rankings, scores, recommendations, or decisions. Those
are the point of the office hours session. Where a claim is not sourced, it is
marked as **unverified** or **inference**. Treat everything else as something
that can be traced back to a cited URL.

**How to read.**
- Part 1 covers #24 (v0.6 trait quiz frameworks)
- Part 2 covers #25 (Path Explorer content + mechanics)
- Part 3 covers the shared decision (which one is v0.6, which is v0.7)
- Appendix lists every URL cited

---

## Part 1 — #24: v0.6 Scientific Trait Quiz

### The core tension

All four candidate frameworks were named in the issue. Research confirms a
**real tension between two dimensions** that the issue only hints at:

1. **Academic validity** — is the framework empirically validated as a
   cognitive taxonomy? (Big Five > Rothbart temperament > VIA > MI)
2. **Parent-facing legitimacy** — does the Chinese parent audience recognize
   and trust the framework? (MI ≫ Big Five ≈ Temperament > VIA)

The framework with the highest academic validity (Big Five) is the one Chinese
parents are least primed for. The framework with the highest parent recognition
(Multiple Intelligences) is the one the academic community most often
classifies as a neuromyth. **This is the central question office hours needs
to resolve**, not a detail.

### Open questions (lifted from the issue)

- Which of the 4 frameworks to adopt (one? a combination? none of these?)
- Licensing terms for commercial use
- Chinese translation validity and availability
- Age range handling (G1-G3 has no obvious framework fit)
- Psychometric vs consumer tradeoff (rigor vs resonance)
- Whether to consult a child psychologist in China before building

### Framework comparison table

| Dimension | Rothbart (CBQ/TMCQ) | VIA Character | Big Five / BFI-C | Gardner MI |
|---|---|---|---|---|
| **Academic validity** | High — gold standard in developmental temperament research | Moderate — positive psychology, Seligman-backed | High — gold standard in personality psychology | **Contested** — classified as neuromyth by many cognitive scientists |
| **Parent-facing legitimacy in China** | Low-moderate — academic awareness only | Low — not widely known | Moderate — 大五人格 has some recognition | **Very high** — 多元智能 is household term |
| **Chinese instruments available** | TMCQ Taiwan version (Lay/Sun/Chien); CBQ cross-culturally validated in China/Japan | Official Chinese Simplified VIA Youth-96 + peer-reviewed 2022 validation paper (n=959) | Multiple: CPBFI-C (pictorial, age 6+), Brief BFI for Chinese Children (Grade 4+, n=4000+), BFI-2 Chinese (4 samples) | Chinese MIDAS Form-B (junior high); 4031 elementary-student validation (Educational Media International 2025); SMIP (Chan, giftedness) |
| **Parent-report version exists?** | Yes — CBQ is explicitly caregiver-report, TMCQ includes parent version | CSI-EC (ages 3-6, parent-report); CSI-C (ages 7-12) self-report in simple language; VIA Youth 8-17 self-report | BFI-C has both self and parent-report; BFI-2 mostly self-report | MIDAS has parent-report + self-report forms |
| **Age range coverage** | CBQ: 3-7/8 · TMCQ: 7-10 · Rothbart has infant and adolescent variants too | CSI-EC: 3-6 · CSI-C: 7-12 · VIA-Youth: 8-17 (8-12 simplified; 10-17 standard) · 96 items = shortest validated | BFI-C parent-report: child-ages applicable · Chinese brief: Grade 4+ · CPBFI-C: ages 6+ | MIDAS-KIDS ages 4-14 (multiple forms) |
| **Item count options** | CBQ: 195 long / short / very short forms (~36 items) | 198-item full · **96-item validated short form** · even shorter research forms exist | BFI: 44 items · BFI-S: 15 · BFI-2: 60 · CBF-PI-15: 15 items | MIDAS-KIDS: 80 items |
| **Licensing for commercial use** | Carey scales (NYLS-derived): commercial, distributed via b-di.com and Lippincott — **not public domain**. Rothbart's CBQ/TMCQ: research-friendly, commercial needs verification | **Free for individuals via viacharacter.org; commercial use requires VIA Institute written approval.** Contact info@viacharacter.org | **BFI-2 is non-commercial only** (Soto & John copyright 2015) — commercial use requires negotiation with Chris Soto. Chinese CPBFI-C / Brief BFI for Chinese Children licensing not documented in sources | MIDAS distributed commercially via Buros / UNL Marketplace — **not public domain**; Gardner framework itself is described by Harvard GSE |
| **Factor structure** | 15 primary scales → 3 broad factors (Extraversion/Surgency, Negative Affectivity, Effortful Control); the 3-factor structure replicates in Chinese samples | 24 strengths within 6 virtues; Chinese Youth-96 study confirmed 4-factor higher-order structure | 5 factors (Extraversion, Agreeableness, Conscientiousness, Openness, Neuroticism); structure replicates across children self-report and parent-report | 8 intelligences in theory; **MIDAS-KIDS factor analysis reliably finds only 7 factors** — theory doesn't fully map to data |
| **Biggest gotcha** | Carey's scales (the most commonly cited "Thomas & Chess" instruments) are locked behind commercial distribution; Rothbart is more usable but less known to Chinese parents | Chinese-Simplified is one of only **3 officially supported languages** (EN, Chinese Simplified, Serbian) for the revised Youth assessment — this is the cleanest Chinese story of the four | BFI-2 is explicitly non-commercial until you negotiate directly with Soto; for Chinese, the better route is CPBFI-C or a homegrown brief version | Core validity dispute is not a fringe critique; multiple peer-reviewed papers (Waterhouse et al.) classify MI as a neuromyth. Gardner himself has backed away from calling it a scientific taxonomy |

### Detailed notes per framework

#### Framework 1 — Thomas & Chess temperament (and Rothbart successor)

**Known facts:**
- NYLS started 1956 with 138 middle-class white and 95 lower-SES Puerto Rican
  children, tracked from infancy to age 7-8. Thomas & Chess extracted the 9
  temperament dimensions from longitudinal observation.
- The "Thomas & Chess" original questionnaire is the NYLSQ. Most modern
  instruments traceable to this lineage are Carey's Temperament Scales
  (Lippincott / b-di.com commercial distribution) and Rothbart's CBQ family
  (Bowdoin research group).
- Rothbart's CBQ reliably recovers a 3-factor solution
  (Extraversion/Surgency, Negative Affectivity, Effortful Control) that
  **replicates in Chinese and Japanese samples** — this is the key
  cross-cultural validation finding.
- TMCQ has a Chinese (Taiwan usage) version translated by Lay, Sun, and
  Chien, but a Swedish validation found the original higher-order structure
  did not fully recover.
- Factor analyses of the TMCQ indicate 4 factors in some samples (Negative
  Affectivity, Surgency, Effortful Control, Sociability/Affiliation), not 3.

**Still unknown:**
- Exact commercial licensing terms for CBQ Very Short Form (Putnam & Rothbart)
- Whether anyone has published psychometric norms for the Taiwan TMCQ
- Licensing path to use Carey scales commercially for a Chinese consumer
  product (likely expensive, possibly not viable)

**Sources.** See Appendix A1.

#### Framework 2 — VIA Character Strengths

**Known facts:**
- VIA Institute on Character (founded by Seligman & Peterson) maintains the
  classification of 24 strengths across 6 virtues.
- **Chinese Simplified is officially supported** for the revised Youth
  assessment. Only 3 languages are supported at the time of writing (EN,
  Chinese Simplified, Serbian).
- **Peer-reviewed Chinese validation exists**: Frontiers in Psychology 2022,
  n=959 adolescents aged 10-17, confirmed 4-factor structure, criterion
  validity correlating with life satisfaction and self-efficacy. Internal
  consistency 0.54–0.86.
- Multiple age-appropriate instruments exist, covering Vela's target range
  with minor gaps:
  - **CSI-EC** (Character Strengths Inventory for Early Childhood): parent
    observation, ages 3-6
  - **CSI-C** (Character Strengths Inventory for Children): child self-report
    in simple language, ages 7-12
  - **VIA Youth-103** forms for 8-12 and 13-17
  - **VIA Youth-96** short form, ages 10-17, 4 items per strength, α = .69-.95,
    test-retest > .70 over 4 months
- **Individual use: free** via viacharacter.org.
- **Commercial use: requires VIA Institute approval.** Translation projects
  require emailing info@viacharacter.org.
- VIA Classification, VIA Reports, and work products are copyrighted. Free
  linking is fine. Reprinting the classification in publications requires
  approval.

**Still unknown:**
- Specific commercial licensing fee structure (requires direct contact)
- Whether the CSI-EC and CSI-C instruments have Chinese validation (the
  2022 paper is Youth-96 specific)
- Whether Vela can use VIA for free as a "free-to-user, subsidized by
  B2B" product, or whether any consumer product flow falls under
  "commercial" requiring permission

**Sources.** See Appendix A2.

#### Framework 3 — Big Five for Children

**Known facts:**
- Multiple Chinese instruments exist, more than the issue anticipated:
  - **CPBFI-C** (Chinese Pictorial Big Five Personality Inventory for
    Children): self-report, designed for ages 6+, uses pictures to
    accommodate younger readers
  - **Brief BFI for Chinese Children**: adapted and validated with
    Grade 4 samples, n = 1884 + 2245 (Du 2025, Social Development)
  - **CBF-PI** (134 items adult), **CBF-PI-B** (40 items), **CBF-PI-15**
    (15 items) — adult versions, homegrown Chinese
  - **BFI-2 Chinese**: translated and evaluated across 4 Chinese samples
    including adolescents, published in Assessment 2022
- **HiPIC** (Hierarchical Personality Inventory for Children, ages 8-12)
  has French, German, Italian, Australian-English validation but **no
  documented Chinese Mandarin validation**.
- **BFI-2 is copyright 2015 by Oliver P. John and Christopher J. Soto. It
  is explicitly non-commercial only** as of the search date. Commercial
  use requires negotiation with Soto directly at Colby College.
- Chinese-native instruments (CPBFI-C, CBF-PI family) have unknown
  licensing status from my searches — require direct contact with authors.
- Factor structure: 5 factors (Extraversion, Agreeableness,
  Conscientiousness, Openness, Neuroticism) replicate in children
  self-report and parent-report, across BFI-C and BFI-2 Chinese samples.
- **"Neuroticism" is the rename-for-Chinese concern**: raw translation
  (神经质) has clinical/pejorative undertones in Chinese; commercial
  product would have to reframe as "情绪稳定性" (Emotional Stability)
  reverse-coded.

**Still unknown:**
- Commercial licensing feasibility for any of the Chinese-native instruments
- Whether any BFI-C parent-report version has Chinese validation
- Item count for a consumer-product flow if adapted from BFI-2 or CPBFI-C
  (target 24-32 items per the issue)

**Sources.** See Appendix A3.

#### Framework 4 — Gardner Multiple Intelligences

**Known facts:**
- **Academic reception is contested.** Multiple peer-reviewed critiques
  classify MI as a **neuromyth**:
  - Cognitive psychologists (Waterhouse et al.) argue there is no solid
    empirical evidence MI are distinct entities
  - Factor analysis of cognitive test batteries consistently finds a
    strong general intelligence factor (g) that accounts for most variance
    across intelligence domains — undermining the core "multiple independent
    intelligences" claim
  - No widely accepted standardized assessment with established psychometric
    properties exists
  - Gardner himself has acknowledged MI is better understood as a
    "heuristic for educators" than a validated cognitive taxonomy
- Despite controversy, assessments exist:
  - **MIDAS-KIDS** (Shearer): 80 items, parent-report + self-report,
    validated with 2,100+ K-8 children across 5 states. **Factor analysis
    found 7 factors, not 8** — theory does not fully map to data.
  - Linguistic + Logical-mathematical MIDAS scales correlate **0.59 with
    estimated IQ** — a substantial chunk of what MIDAS measures is just g
  - **SMIP** (Student Multiple Intelligences Profile, Chan): self-report,
    used for Chinese gifted student assessment, α = .64-.76 (low-moderate)
  - **Chinese MIDAS Form-B**: junior-high school Chinese version exists
  - **4,031 Chinese elementary student validation** (Educational Media
    International 2025) claims to confirm 8 intelligences
- Parent recognition is the highest of the 4 frameworks — "多元智能" is
  a household term in the Chinese education market, reinforced decades of
  K-12 curriculum adoption
- MIDAS commercially published via Buros / UNL Marketplace — not public
  domain; licensing for commercial use unclear

**Still unknown:**
- Whether the Chan SMIP or Chinese MIDAS are licensable for commercial use
- Whether choosing MI despite academic concerns is actually a
  sophistication-signaling anti-pattern (parents may buy it, but serious
  educators and psychologists will question it)
- How Chinese child psychologists view MI vs alternatives (worth asking
  directly if consulting an expert)

**Sources.** See Appendix A4.

### Decisions the office hours needs to make

1. **Primary framework choice.** Pick one (or a combination) from the 4.
   This is the most consequential decision in the session.
2. **The tension call.** How do we weigh scientific rigor vs parent
   resonance? Founder principle "不造轮子，找有科学依据的现成框架"
   biases toward Big Five / Rothbart, but does nothing for the "parents
   don't recognize it" problem.
3. **Age range strategy.** All four frameworks have gaps. Do we cover
   G1-G12 with one framework (impossible), two stacked frameworks
   (complicated), or narrow Vela's target age range?
4. **Licensing path.** Every credible framework requires either free
   (with commercial caveats) or paid licensing. Do we accept the cost
   and complexity, or build on a homegrown Chinese instrument that
   has cleaner IP but less brand recognition?
5. **Expert consultation.** Worth reaching out to a Chinese child
   developmental psychologist before building? Yes/no?

---

## Part 2 — #25: Path Explorer

### The core gap this feature fills

Research confirmed a concrete structural gap in existing Chinese-market
resources:

- **CollegeBoard's official planning timeline starts at 9th grade** (with
  middle-school tangents for specific scholarship programs). There is no
  official "G1-G8 path" published by CollegeBoard or Common App.
- Chinese consulting firms (新东方前途, 翰林, 金吉列) publish their own
  grade-by-grade recommendations, but they're fragmented across dozens
  of blog posts, white papers, and social media. No single place walks a
  parent through G1 → US college.
- There is no "Princess Maker for college path" type product in the
  Chinese literacy space. The closest are white papers (too heavy),
  Zhihu threads (too scattered), and paid consulting (too expensive).

The opportunity space is real. The content volume is also larger than the
issue anticipated — covering G1 → G12 + college entry means spanning roughly
12 years of granular timeline with branching paths at G7 (US boarding vs
Chinese high school) and college entry.

### Open questions (lifted from the issue)

- Which universal path is the right first path? Top 30 generic, or a
  specific vertical like pre-vet?
- At G7 branching, force the user to pick a branch, or show both?
- Include 美专 (community college transfer) alternative?
- Extend beyond college entry to OPT/H1B/career?
- Text-heavy scene narration vs scannable facts?
- Target audience tone (just curious vs decided)?

### Authoritative source inventory

Sources are organized by role: **Primary** = official, canonical; **Secondary**
= reputable consulting / aggregator.

| Source | Role | Covers | Language | Cost | URL |
|---|---|---|---|---|---|
| **CollegeBoard BigFuture** | Primary | College planning 9-12, SAT, scholarship info | EN | Free | bigfuture.collegeboard.org |
| **Common App Member Support** | Primary | Application deadlines, admission plans, cycle dates | EN | Free | commonapp.org |
| **SSAT.org** | Primary | SSAT test dates, registration, boarding school admission | EN | Free | ssat.org |
| **ETS TOEFL / TOEFL Junior** | Primary | Language test info for applications | EN/CN | Free | ets.org/toefl |
| **UC Transfer Admission Guarantee (TAG)** | Primary | Community college → UC transfer agreements | EN | Free | admission.universityofcalifornia.edu (TAG page) |
| **AAVMC / individual vet schools** | Primary | DVM prerequisites, GPA minimums, pre-vet path | EN | Free | aavmc.org, individual college of veterinary medicine sites |
| **新东方《中国留学白皮书》** | Secondary | Market data, Chinese parent audience research, trends | CN | Free download | xdf.cn (via 前途出国) |
| **翰林国际教育 (hanlin.com)** | Secondary | 申请时间线, 标化考试策略, 美高/美本准备 | CN | Free blog | hanlin.com/archives |
| **新东方前途出国 blog** | Secondary | 申请流程, 材料清单, 时间节点 | CN | Free blog | liuxue.xdf.cn |
| **艾迪留学, 金吉列, 嘉华世达** | Secondary | 美本 Top 30 年度政策汇总, 时间线 | CN | Free | various |
| **FindingSchool (FS)** | Secondary | 美高排名, 家长真实经验, 申请数据 | CN | Free | findingschool.net |

Cross-sources frequently cited, useful as aggregators for initial research,
but final facts should trace back to primary sources.

### Canonical US Top 30 timeline (synthesized from primary sources)

| Stage | Grades | Ages | Key milestones | Typical cost | Primary source |
|---|---|---|---|---|---|
| Foundation | G1-G3 | 6-8 | Broad interest exploration, bilingual reading, no test prep | Inside normal K-12 tuition | No official guidance (gap) |
| Exploration | G4-G6 | 9-11 | Narrow interest areas, deepen extracurriculars, optional summer programs | 普通私立 10-30万/年 | No official guidance (gap) |
| Boarding decision | G7 | 12 | **Branch point**: commit to 美高 path OR stay in 国内 system | — | Various consulting guides |
| 美高 path — application year | G8 | 13 | SSAT prep + Sep-Dec test; TOEFL Junior; applications due Jan 15 / Feb 1 | SSAT prep + application fees | ssat.org, findingschool.net |
| 美高 path — HS years | G9-G12 | 14-17 | Boarding HS study, AP courses, SAT/ACT + TOEFL, college applications | **$75,420-$85,450/year (~53-60万 RMB/year)** | Aggregated from consulting sources |
| 国内 path — HS | G10-G12 | 15-17 | 国际部 or 国际学校 HS, IB/A-Level/AP, SAT/ACT + TOEFL | Varies by school, typically 20-50万/年 | Consulting sources |
| Standardized testing — critical window | G10-G11 | 15-16 | TOEFL target Feb-May G10, SAT summer G10 / G11 first sitting | Test prep + sitting fees | Aggregated |
| Applications | G11-G12 | 16-17 | Common App opens Aug 1, ED/EA Nov 1-15, RD Jan 1-15 | Application fees + consulting fees (if used) | commonapp.org |
| US undergrad | College years | 18-22 | 4-year degree at target institution | **~$460,000 total (~322万 RMB)** | Consulting aggregate |

**Score targets (Top 20 vs Top 30, widely cited)**:
- Top 20 target TOEFL: 110+
- Top 30 target TOEFL: 105+
- SAT/ACT competitive: consult specific school published ranges

**Total out-of-pocket estimate, 美高 + 美本 combined**: generally described
as **百万级别** (seven figures RMB) across 8 years when 美高 boarding is
included. Specific cost breakdowns vary widely by school selection and
extracurricular investment.

**Key activity spend** (commonly cited but unverified exact ranges):
Chinese consulting guides suggest an additional 20-30万 RMB/year across G7-G12
for competitions, summer programs, test prep, and portfolio-building activities
for students targeting Top 30.

### Path candidate comparison

This table represents the candidate paths that could be the "first path" in
Path Explorer v1. **No scoring intended** — just a side-by-side structural
comparison.

| Path | Target audience | Cost profile | Timeline complexity | Market coverage | Sources available |
|---|---|---|---|---|---|
| **美本 Top 30 generic** | High-investment families with decided goal | ~百万级 total | Most complex (美高 decision, standardized test sequence, competitive ECs) | Highest — this is the default assumption in Chinese consulting | Most abundant — consulting firms publish annual updates |
| **美本 Top 100 general (broader)** | Middle-investment, flexible goal | 几十万-百万 depending on 美高 | Moderate | High | Common |
| **美专 (Community College) 2+2** | Budget-constrained, flexible timeline | ~1/4 美本 tuition + UC TAG advantage | Lower (later decision point, lower entry bar) | Low recognition, under-covered | Some — primarily UC TAG documentation, a few Chinese consulting articles |
| **Pre-vet vertical** | Families with specific career anchor | Depends on target vet school | Moderate (DVM has stricter GPA + prereq requirements) | Niche | Some — individual vet school sites, AAVMC |
| **Pre-STEM / Pre-Med / Pre-Law** | Career-anchored families | Varies | Moderate-High | Niche | Aggregated from major-specific resources |

**Structural note on verticals (pre-vet, pre-STEM, etc.):** These are not
really "paths" in the Path Explorer sense — they're mostly branches inside
the 美本 generic path with specific undergraduate major and GPA targets.
The first version probably needs to pick either "show one canonical generic
path" or "show one vertical" — trying to show both at once would dilute the
story.

**Community college as the sleeper option:** The 2+2 path is genuinely
undercovered in Chinese consulting content, and the UC TAG transfer
guarantees provide a real structural advantage that most Chinese parents
don't know about. UCLA transfer admit rate (24%) vs first-year admit rate
(14%) is a surprising data point. This could be the differentiated story
if Vela wants to stand out from existing content.

### Key decision points in the path (useful for card design)

These are the moments in the timeline where parents have a real fork, with
durable downstream consequences. Card designs for Path Explorer would
probably want to emphasize these.

1. **G7 — Boarding decision.** Do you commit to the 美高 path (and start
   SSAT/TOEFL Junior prep immediately) or stay in the Chinese system?
   This is the highest-stakes fork because cost and timeline both jump an
   order of magnitude for the 美高 branch.
2. **G9 entry to G10 — Standardized testing start.** The window to start
   TOEFL prep is late G9 / early G10. Falling behind here compounds into
   insufficient retake opportunities.
3. **G11 summer — SAT first sitting.** If SAT first sitting is pushed past
   G11 summer, applying ED in G12 becomes risky.
4. **G12 November — ED/EA decision.** Early Decision commits you to a
   single school. Early Action doesn't, but has earlier deadlines than
   Regular Decision. Choice here affects application strategy for all
   other schools.
5. **Post-acceptance, Spring G12 — 美专 2+2 alternative.** If main-path
   admissions don't yield a target school, the community college transfer
   route can still land at a top UC (except Berkeley/UCLA/San Diego which
   don't participate in TAG).

### Game mechanics reference — Princess Maker (美少女梦工厂)

The issue names Princess Maker as the core metaphor. Understanding what
Princess Maker actually does mechanically matters for scoping Path Explorer.

- **Time unit**: monthly schedule (PM2) → weekly schedule (PM5). Finer
  granularity = more decisions to make = more engagement, but more content
  to author.
- **Parameter system**: Princess Maker tracks 10+ character stats (strength,
  intelligence, charm, morality, etc.) that rise and fall based on choices.
  **Not all stats are directly controllable** — some drift based on neglect,
  creating a feeling that time carries its own momentum.
- **Branching**: 53-70+ different endings depending on version, driven by
  stat thresholds + specific event flags. Princess Maker 2 had 70+, PM5 has
  53+ with 30 of those dependent on personality variants.
- **Annual harvest festival**: once-per-in-game-year competition where the
  player chooses a competition type (combat, cooking, art, royal ball).
  **This is the mechanical analog of G7 / Nov-of-G12 decision points in
  Path Explorer** — recurring forks that matter.
- **Rebellion / Motion of Emotion**: if the player neglects or mistreats
  the daughter, she becomes rebellious and harder to direct. For a Vela
  product this analog would be "if the parent doesn't engage with the
  child's interests, paths close off" — a soft consequence system.

**What to import for Path Explorer:**
- Scene-based time progression with visible progression marker
- Meaningful forks at realistic decision points
- Stats/properties that the card copy references (budget, readiness,
  alignment with a direction) even if not fully interactive in v1
- Emotional tone: parent-child relationship reflected in the narrative

**What to explicitly NOT import:**
- Full stat micromanagement (Vela is a literacy product, not a game)
- Win/lose states
- Game-theoretic optimization (you're not "beating" the path)
- Gamification of a serious decision (would undermine credibility)

### Decisions the office hours needs to make

1. **Which path is the first path?** 美本 Top 30 generic vs community
   college 2+2 vs pre-vet vertical. The research gives you structural
   material for all three, but pick one.
2. **Card count and scope for v1.** Issue suggests 3 cards (steady state,
   decision point, crunch). Research confirms at least 5 real decision
   points in the path — v1 might want 3 cards covering the whole path
   (G1-G6 / G7-G9 / G10-G12) with one example card per decision point.
3. **Text-to-data ratio on each card.** Issue shows mostly narrative
   with structured micro-info sidebars. Research found both parents who
   want "a feeling of the path" (narrative) and parents who want "the
   actual numbers" (data). Each card probably needs both. Decide ratio.
4. **End of path.** College entry? College graduation? Post-grad career?
   Each extension doubles the content authoring cost. v1 should probably
   stop at college entry.
5. **G7 fork handling.** Show both branches side-by-side? Or let the user
   choose one and follow it through?
6. **Content sourcing workflow.** Issue says "curated authoritative
   sources, LLM polishes narrative not generates facts." Research
   confirms the 10-15 primary + secondary sources listed above are a
   realistic starting pool. Need to decide: human author curates facts
   from these, LLM drafts narrative, human edits. Who does each step?

---

## Part 3 — Shared decision: which is v0.6?

### The two issues are not in natural competition

On closer reading, #24 and #25 solve different problems for different users
at different engagement depths. They could run in parallel rather than
sequence, but staffing-wise Vela can probably only deliver one at a time.

| Dimension | #24 (v0.6 trait quiz) | #25 (Path Explorer) |
|---|---|---|
| **What it answers** | "What kind of child do I have?" | "What does the path look like?" |
| **User at what stage** | Parent who wants personalization | Parent who wants literacy |
| **Research burden before building** | Very high — framework selection + instrument licensing + (possibly) expert consultation | Moderate — source curation + narrative authoring |
| **Implementation complexity** | High — new assessment flow, new scoring, result page redesign | Moderate — mostly content + card UI |
| **Content authoring volume** | Moderate — question adaptation + result descriptions | **Very high** — 10-15 cards of narrative + structured data |
| **External dependencies** | Framework licensing (could block) | Authoritative source access (manageable) |
| **Risk if wrong** | Rebuilding the core product with the wrong foundation | Shipping a card product that doesn't resonate with parents — low blast radius |
| **Can it ride on top of v0.5?** | No — replaces v0.5 trait quiz | Yes — standalone feature on homepage |
| **User signal for prioritization** | Strong negative signal: "看不出个所以然的个性" | Founder reflection: literacy-first is the actual first question |
| **Reversibility** | Low — commitment to a framework is costly to undo | Higher — can kill the feature with minimal harm |

### Factors that argue for #25 first

- **Lower research-to-ship ratio.** Research is mostly source curation;
  most of the cost is authoring, which is incremental and parallelizable.
- **Standalone, reversible.** Doesn't touch v0.5. If it flops, kill it.
  #24 replaces a core flow and is harder to undo.
- **User feedback more about literacy than personalization.** The
  feedback from v0.5 testing was "this doesn't show me what to do" more
  than "this doesn't understand my child." Path Explorer directly answers
  the "what to do" side.
- **More differentiated product.** The card-based literacy format has no
  direct Chinese competitor. A scientifically rigorous trait quiz would
  have to compete with 美中教育 / 留学中介 assessment tools, and "yet
  another personality quiz" risks being lost in noise.
- **Office hours has more design surface.** The visual / narrative /
  content-sourcing decisions in #25 have a lot of surface area that an
  office hours session can productively work through, while #24 mostly
  hinges on a licensing and expert-consultation call that may need to
  happen externally anyway.

### Factors that argue for #24 first

- **v0.5 trait quiz is actively generating negative signal.** Leaving it
  as-is risks parents forming a lasting "Vela is unserious" impression.
- **v0.6 direction needs to be decided before further v0.5 polish.**
  The P1 content pool work depends on whether we're keeping v0.5's
  framework or rebuilding.
- **User principle is more clearly stated for #24.** "不造轮子，找有
  科学依据的现成框架" is a strong, clearly articulated commitment.
  #25 has less-firm conviction from the founder side.
- **Real user told us v0.5 is broken.** Path Explorer is founder's own
  theory about what parents want; #24 is a direct response to a user who
  tried the product and said it didn't work.

### Factors that argue for running both

- They don't conflict technically
- They serve different user stages of the same journey
- Combined, they make Vela a more complete product than either alone
- Office hours could decide the sequence rather than treat them as
  mutually exclusive

### What I did not research

(Left intentionally for office hours to decide)
- Which framework choice is actually best
- Which path is actually the right first path
- Timeline estimates for any of the above
- Whether the founder should hire a content specialist for #25
- Whether either feature needs a separate v0.5 P1 content pool
  completion first

---

## Appendix A — Sources

### A1. Thomas & Chess / Rothbart Temperament

- [Thomas & Chess NYLS overview — age-of-the-sage.org](https://www.age-of-the-sage.org/psychology/chess_thomas_birch.html)
- [Temperament-Based Intervention (PMC) — background on NYLS and goodness-of-fit](https://pmc.ncbi.nlm.nih.gov/articles/PMC2846651/)
- [Temperament: Theory and Practice — American Journal of Psychiatry](https://psychiatryonline.org/doi/10.1176/ajp.155.1.144)
- [Children's Behavior Questionnaire (CBQ) — Rothbart lab, Bowdoin](https://research.bowdoin.edu/rothbart-temperament-questionnaires/instrument-descriptions/the-childrens-behavior-questionnaire/)
- [Temperament in Middle Childhood Questionnaire (TMCQ) — Rothbart lab](https://research.bowdoin.edu/rothbart-temperament-questionnaires/instrument-descriptions/the-temperament-in-middle-childhood-questionnaire/)
- [CBQ Development short forms — ResearchGate PDF](https://www.researchgate.net/publication/6928744_Development_of_Short_and_Very_Short_Form_of_the_Children's_Behavior_Questionnaire)
- [CBQ psychometric evaluation preschool — ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0885200612000774)
- [Higher- and Lower-Order Factor Analyses CBQ — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4666831/)
- [TMCQ psychometric Swedish sample — Wiley](https://onlinelibrary.wiley.com/doi/10.1111/sjop.12393)
- [Carey Temperament Scales — b-di.com commercial distribution](https://www.b-di.com/ctsinfo.html)

### A2. VIA Character Strengths

- [VIA Institute homepage](https://www.viacharacter.org/)
- [VIA Youth Character Strengths Report overview](https://www.viacharacter.org/reports/youth)
- [VIA Use & Interpretation Guidelines / permissions](https://www.viacharacter.org/faq/permissions-and-guidelines-for-use-and-interpretation)
- [VIA Assessments researcher page](https://www.viacharacter.org/researchers/assessments)
- [VIA Youth 8-12 assessment](https://www.viacharacter.org/researchers/assessments/via-youth-103-8-12)
- [VIA Youth 13-17 assessment](https://www.viacharacter.org/researchers/assessments/via-youth-103-13-17)
- [VIA Youth-96 short form](https://www.viacharacter.org/researchers/assessments/via-youth-96)
- [Character Strengths Inventory for Children (CSI-C)](https://www.viacharacter.org/researchers/assessments/character-strengths-inventory-for-children)
- [Youth VIA Survey translations page](https://www.viacharacter.org/about/translations/via-youth-survey-translations)
- [Initial validation Chinese VIA Youth-96 — Frontiers in Psychology 2022](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.906171/full)
- [Chinese VIA Youth-96 validation PMC mirror](https://pmc.ncbi.nlm.nih.gov/articles/PMC9595728/)
- [Construct validity of VIA measures — Tandfonline](https://www.tandfonline.com/doi/full/10.1080/00223891.2022.2120402)
- [EdInstruments VIA Youth Survey summary](https://edinstruments.org/instruments/youth-survey)

### A3. Big Five for Children

- [BFI-C Psychological Scales database](https://db.arabpsychology.com/scales/big-five-inventory-for-children-bfi-c/)
- [Self-Report Questionnaires for Big Five in Children — systematic review PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12423744/)
- [Big Five Inventory (BFI-2) — Colby College official page](https://www.colby.edu/academics/departments-and-programs/psychology/research-opportunities/personality-lab/the-bfi-2/)
- [BFI-2 form PDF](https://www.colby.edu/wp-content/uploads/2013/08/bfi2-form.pdf)
- [BFI-2 Short Form PDF](https://www.colby.edu/wp-content/uploads/2013/08/bfi2s-form.pdf)
- [Mapping Young Minds — Brief Big Five for Chinese Children — Wiley 2025](https://onlinelibrary.wiley.com/doi/10.1111/sode.70022)
- [Chinese Pictorial Big Five Personality Inventory for Children (CPBFI-C)](https://www.scidb.cn/en/detail?dataSetId=c20eced33f0f4a51896bcd2e0b8c3406)
- [Chinese Big Five Inventory-15 — PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0221621)
- [BFI-2 in China — Assessment journal / Zhang et al. 2022](https://journals.sagepub.com/doi/abs/10.1177/10731911211008245)
- [Hierarchical Personality Inventory for Children (HiPIC) questionnaires reference](https://lcbc-uio.github.io/questionnaires/articles/hipic.html)
- [HiPIC-30 short form — Wiley](https://onlinelibrary.wiley.com/doi/10.1002/pmh.1334)
- [French HiPIC validation — European Journal of Psychological Assessment](https://doi.org/10.1027/1015-5759.23.2.125)

### A4. Gardner Multiple Intelligences

- [MI Research / MIDAS profile homepage](https://miresearch.org/)
- [MIDAS-KIDS intro PDF](https://miresearch.org/wp-content/uploads/2023/05/MIDAS_KIDS_Intro.pdf)
- [MIDAS Kent State page](https://www.personal.kent.edu/~sbranton/MIDAS.htm)
- [MIDAS via Buros / UNL Marketplace (commercial)](https://marketplace.unl.edu/buros/midas-multiple-intelligences-developmental-assessment-scales-the-revised.html)
- [TEEN-MIDAS PDF — Scribd](https://www.scribd.com/document/95281074/Midas-Teen-Intro)
- [Development and Validation of MI Assessment Scale for Children — ERIC](https://files.eric.ed.gov/fulltext/ED463323.pdf)
- [Why Multiple Intelligences is a neuromyth — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10493274/)
- [Neuromyths and MI Theory — PMC comment on Gardner 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC8377349/)
- [A valid evaluation of MI is not yet possible — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0160289621000507)
- [Multiply Misleading — JSTOR critique](https://www.jstor.org/stable/1585790)
- [Theory of Multiple Intelligences — Wikipedia overview](https://en.wikipedia.org/wiki/Theory_of_multiple_intelligences)
- [MI validation study Chinese elementary students — Tandfonline 2025](https://www.tandfonline.com/doi/full/10.1080/09523987.2025.2588534)
- [MI in Teaching and Education — lessons from neuroscience PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6480719/)

### A5. Path Explorer — US Top 30 & Common App timeline

- [CollegeBoard BigFuture 11th Grade checklist](https://bigfuture.collegeboard.org/checklist)
- [CollegeBoard BigFuture 12th Grade application timeline](https://bigfuture.collegeboard.org/plan-for-college/apply-to-college/college-application-timeline-12th-grade)
- [CollegeBoard 11th Grade Planning Calendar PDF](https://secure-media.collegeboard.org/CollegePlanning/media/pdf/BigFuture-College-Planning-Calendar-Juniors.pdf)
- [CollegeBoard 12th Grade Planning Calendar PDF](https://secure-media.collegeboard.org/CollegePlanning/media/pdf/BigFuture-College-Planning-Calendar-Seniors.pdf)
- [Common App Application Deadlines official](https://membersupport.commonapp.org/s/article/Application-Deadlines-8730)
- [Common App Admission Plan overview](https://appsupport.commonapp.org/s/article/admission-plan-efyixrub)
- [翰林国际教育 — 美本申请高中三年时间规划](https://www.hanlin.com/archives/466723)
- [艾迪留学 — 美本Top30最新政策汇总](https://www.eduglobal.com/usa/Article/129204/)
- [新东方前途出国 — 美本申请流程时间线](https://liuxue.xdf.cn/blog/wangting63/blog/2248131.shtml)

### A6. Path Explorer — SSAT, 美高申请, 初中准备

- [SSAT Standard Paper Exam test dates](https://www.ssat.org/testing/paper/standard)
- [About the SSAT](https://www.ssat.org/about/about-the-ssat)
- [SSAT registration homepage for families](https://www.ssat.org)
- [Wikipedia SSAT overview](https://en.wikipedia.org/wiki/Secondary_School_Admission_Test)
- [Boarding School Application Deadlines — Cardinal Education](https://www.cardinaleducation.com/profiles/when-are-the-application-deadlines-for-top-u-s-boarding-schools/)
- [全球教育网 — 2025美高申请关键时间线](https://www.earthedu.com/a/106210.html)
- [翰林国际教育 — 美高标化考试](https://www.hanlin.com/archives/1127900)
- [IntEdu — SSAT、ISEE、TOEFL Junior 如何选择](https://www.inteducom.com/posts/4038)

### A7. Path Explorer — Alternative paths

- [UC Transfer Admission Guarantee (TAG) official](https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/uc-transfer-programs/transfer-admission-guarantee-tag.html)
- [UC TAG Requirements — UC Davis](https://www.ucdavis.edu/admissions/undergraduate/transfer/transfer-admission-guarantee/requirements)
- [UC TAG Matrix 23-24 PDF](https://admission.universityofcalifornia.edu/_assets/files/transfer-requirements/tag-matrix-23-24.pdf)
- [StudyUSA — Community College 2+2 Agreements](https://www.studyusa.com/en/a/1004/transferring-from-a-community-college-2-2-agreements)
- [求真教育 — 社区大学转学四年制名校](https://indeededu.com/communitycollege-2-2/)
- [Oklahoma State DVM Program Requirements](https://vetmed.okstate.edu/programs-and-admissions/dvm-requirements.html)
- [Missouri College of Veterinary Medicine DVM Prerequisites](https://cvm.missouri.edu/doctor-of-veterinary-medicine-program/prerequisites-for-the-dvm-program/)
- [Virginia Tech DVM Admissions Requirements](https://dvm.vetmed.vt.edu/dvm-admissions/requirements-new.html)
- [Michigan State DVM Academic Requirements](https://cvm.msu.edu/future-students/dvm/prerequisites)
- [Penn State Steps to Becoming a Veterinarian](https://vbs.psu.edu/undergraduate/resources/steps-to-becoming-a-veterinarian)

### A8. Path Explorer — Cost estimates & 白皮书

- [移路通 — 2025美高留学明细预算 TOP100](https://www.e-lu-tong.com/StudyAbroad/details_244_3203.html)
- [美国丽格教育 — 美国留学费用大起底](https://www.ivytalent.net/fees-for-study-abroad/)
- [新东方 — 美初/美高/美本/美研费用大起底](https://mtoutiao.xdf.cn/goabroad/202210/12412273.html)
- [新东方 2023中国留学白皮书](https://liuxue.xdf.cn/special_zonghe/2023_report/)
- [新东方 2024留学发展报告](https://liuxue.xdf.cn/special_zonghe/2024_report/)
- [2023中国留学白皮书发布说明 — xdf.cn](https://www.xdf.cn/info/202305/13278744.html)

### A9. Path Explorer — 美少女梦工厂 mechanics reference

- [美少女梦工厂系列 — 萌娘百科](https://zh.moegirl.org.cn/%E7%BE%8E%E5%B0%91%E5%A5%B3%E6%A2%A6%E5%B7%A5%E5%8E%82%E7%B3%BB%E5%88%97)
- [美少女梦工场 — 维基百科](https://zh.wikipedia.org/zh-hans/%E7%BE%8E%E5%B0%91%E5%A5%B3%E5%A4%A2%E5%B7%A5%E5%A0%B4)
- [Princess Maker 2 — CRPG Book 中文版](https://crpgbook.cn/2022/11/14/108-princess-maker-2/)
- [Princess Maker 2 Refine — Steam page](https://store.steampowered.com/app/523000/Princess_Maker_2_Refine/?l=schinese)

---

## Appendix B — What I did not cover

Things that are in scope for office hours but that I did not research. Flagged
so you can decide whether to research them separately before / during the
session.

- **Kailing-specific signal.** Kailing's call is tomorrow (4/16). Her
  feedback on v0.5 is the next real user signal. It may re-rank #24 and
  #25 in ways I can't predict.
- **Competitive landscape deep dive.** I looked for literacy-first
  precedents and found none. I did not do a full competitive analysis of
  trait quiz products in the Chinese market (e.g., 美中教育, 留学中介
  assessment tools, DISC products, MBTI derivatives).
- **Founder-side time budget.** Which v0.6 fits into actual available
  time depends on founder bandwidth and other commitments I don't know.
- **v0.5 content pool P1.** The 288-sentence rewrite TODO is still
  separate and may block either v0.6 or not, depending on the call.
- **Legal review of licensing.** I surfaced that BFI-2 is non-commercial
  and VIA requires approval for commercial use, but I did not contact
  either party for actual licensing terms. This is a real external
  dependency if #24 is chosen.
- **Pricing and business model implications.** Either feature could
  inform whether Vela is free-to-user / ad-supported / freemium /
  paid-consulting-adjacent. Not researched.
- **Expert consultation cost and availability.** The issue raised "consult
  a Chinese child psychologist" as a possible step. I did not identify
  candidate experts or estimate cost.

---

## Appendix C — How this document should age

This is a pre-flight briefing for a specific decision session (2026-04-15
office hours). After the session:

- If decisions land, update `docs/current-state.md` with the outcomes, and
  archive or delete this file (or move it to `docs/retrospectives/` with
  session notes appended).
- If decisions slip, the file is still valid as research. Do not overwrite;
  date the next briefing separately.
- If a framework or source URL above is later confirmed stale, add a dated
  correction line below the relevant section. Do not silently edit.

Research conducted: 2026-04-15. Vela version at time of research: v0.5.0.0
shipped. Next decision point: office hours session + Kailing call (4/16).
