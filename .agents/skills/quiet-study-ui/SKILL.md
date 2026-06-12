---
name: quiet-study-ui
description: Use this skill when building or modifying a low-distraction study dashboard that should look like a professional knowledge base, reading desk, work notes site, or information dashboard rather than an exam or quiz app.
---

# Quiet Study UI Skill

This skill is used to design and refine the interface of a quiet, low-distraction personal study dashboard.

The product should look like an ordinary knowledge-management, notes, reading, or productivity website. It should not look like an online exam system, quiz platform, or training app.

## Core design goal

Build interfaces that look like:

- Notion-style knowledge base
- Feishu/Lark-style document center
- internal work notes
- daily reading dashboard
- personal information board
- lightweight productivity tool

Avoid visual patterns associated with:

- exam platforms
- question banks
- online tests
- score dashboards
- competitive ranking systems
- gamified learning apps

## Visual style

Use a calm and professional visual language.

Recommended style:

- white or off-white background
- light gray surfaces
- blue-gray or slate accents
- soft card shadows
- clean typography
- compact but readable spacing
- document-like layout
- subtle dividers
- minimal animation

Avoid:

- bright red and green exam styling
- loud success/failure effects
- countdown timers
- large scoreboards
- ranking boards
- medal icons
- aggressive progress bars
- game-like animations
- cartoon visuals
- overly colorful buttons

## Naming rules

The visible UI should use neutral wording.

Preferred names:

- Daily Brief
- Reading Desk
- Knowledge Board
- Work Notes
- 今日阅读
- 快速卡片
- 资料归档
- 标记内容
- 复看内容
- 统计概览
- 设置
- 记录质量
- 完成进度
- 今日资料
- 材料卡片
- 继续阅读

Avoid visible words:

- 公考
- 考编
- 行测
- 申论
- 刷题
- 题库
- 考试
- 试卷
- 错题
- 分数
- 成绩
- 模考
- 备考
- 答题系统

## Term replacement

Use these replacements in the UI:

- 题目 -> 材料卡片
- 题库 -> 资料归档
- 刷题 -> 阅读 / 快速卡片
- 错题 -> 复看内容
- 收藏题 -> 标记内容
- 正确率 -> 记录质量
- 答题记录 -> 阅读记录
- 考试进度 -> 完成进度
- 解析 -> 说明
- 选项 -> 内容项
- 分数 -> 记录表现

Code variables can still use clear technical names such as `questions`, `answer`, `correct`, and `wrong`. The restriction mainly applies to visible UI text.

## Layout rules

The app should have these sections:

1. 今日阅读
2. 快速卡片
3. 资料归档
4. 标记内容
5. 统计概览
6. 设置

Use card-based layouts.

For desktop:

- left sidebar or top navigation is acceptable
- main content should be centered
- right-side summary panel is acceptable
- avoid dense exam-like grids

For mobile:

- use bottom navigation or compact top navigation
- one card per screen is preferred
- buttons must be touch-friendly
- avoid tiny text
- avoid hover-only interactions

## Card design

Each review card should feel like a document excerpt.

Recommended structure:

- small category label
- title
- main content
- four selectable rows if needed
- subtle status label
- explanation area after selection
- secondary action buttons

Button labels:

- 标记
- 取消标记
- 下一张
- 继续
- 加入复看
- 移出复看
- 查看说明
- 随机一张

Status labels:

- 已记录
- 需要复看
- 已标记
- 未完成
- 已完成

## Interaction rules

- Keep interactions simple.
- Show immediate feedback after selecting an option.
- Do not show dramatic visual effects.
- Use subtle border or background changes.
- Use small status text rather than large banners.
- Keep keyboard shortcuts available on desktop.
- Maintain mobile usability.

Recommended shortcuts:

- 1 / 2 / 3 / 4: select A / B / C / D
- N: next card
- M: mark or unmark
- Esc: close modal

## Accessibility

- Ensure sufficient contrast.
- Make buttons keyboard accessible.
- Use semantic HTML where possible.
- Do not rely on color alone to indicate state.
- Keep font size readable on mobile.

## Output expectations

When modifying UI:

1. Update HTML, CSS, and JavaScript consistently.
2. Ensure all visible wording follows the neutral naming rules.
3. Ensure mobile layout remains usable.
4. Do not introduce external CDN dependencies.
5. Do not add frameworks unless explicitly requested.
6. Keep the site calm, professional, and ordinary-looking.
