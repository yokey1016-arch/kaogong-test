# AGENTS.md

## Project goal

This project is a static, offline-first personal knowledge and review dashboard.

It should look like a calm professional knowledge board, reading desk, work notes site, or information dashboard.

It should not look like an exam platform, quiz system, or public training website.

## User context

The user wants a lightweight web app that can be opened on desktop and mobile browsers.

Primary usage:

- short daily review
- quick knowledge cards
- local progress tracking
- marked content
- review content
- JSON data import/export

The app should be simple enough to deploy on GitHub Pages.

## Technical constraints

Use:

- HTML
- CSS
- vanilla JavaScript
- localStorage
- relative paths

Do not use:

- backend services
- login systems
- databases
- external analytics
- external CDN
- cloud sync
- complicated build tools
- npm dependencies unless explicitly requested

The app must work:

- by directly opening `index.html`
- through VS Code Live Server
- on GitHub Pages
- on mobile browsers

## Project structure

Recommended structure:

```txt
/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── questions.js
├── README.md
├── AGENTS.md
└── .agents/
    └── skills/
        ├── quiet-study-ui/
        │   └── SKILL.md
        ├── local-question-bank/
        │   └── SKILL.md
        └── github-pages-h5/
            └── SKILL.md
````

## UI direction

The interface should feel like:

* Notion
* Feishu/Lark Docs
* work notes
* personal dashboard
* internal knowledge base
* reading desk

Use:

* calm colors
* clean layout
* document-like cards
* neutral labels
* small status tags
* subtle interactions
* professional spacing
* readable typography

Avoid:

* exam-like page design
* loud scoreboards
* red/green exam feedback
* ranking features
* countdown timers
* game-like effects
* cartoon visuals
* large competitive progress indicators

## Visible wording rules

Avoid these visible words in the UI:

* 公考
* 考编
* 行测
* 申论
* 刷题
* 题库
* 考试
* 试卷
* 错题
* 分数
* 成绩
* 模考
* 备考
* 训练营

Use these alternatives:

* 今日阅读
* 快速卡片
* 资料归档
* 标记内容
* 复看内容
* 统计概览
* 设置
* 记录质量
* 完成进度
* 今日资料
* 材料卡片
* 继续阅读
* 查看说明
* 导入资料
* 导出记录
* 清空本地记录

## Functional requirements

The app should support:

1. Daily review cards
2. Random quick card
3. Category filtering
4. Search
5. Marked content
6. Review content
7. Progress overview
8. Record quality statistics
9. Local streak tracking
10. Light/dark mode
11. Minimal mode
12. JSON import
13. JSON export
14. Clear local records

## Question data

Built-in question data should live in:

```txt
data/questions.js
```

Use this structure:

```js
const QUESTION_BANK = [
  {
    id: "q001",
    category: "language",
    title: "材料理解 001",
    stem: "题干内容",
    options: {
      A: "选项A",
      B: "选项B",
      C: "选项C",
      D: "选项D"
    },
    answer: "A",
    explanation: "解析内容",
    difficulty: "easy"
  }
];
```

Allowed internal categories:

* `language`
* `logic`
* `data`
* `common`
* `basic`

Visible category names:

* `language` -> `语言材料`
* `logic` -> `逻辑材料`
* `data` -> `数据材料`
* `common` -> `通用材料`
* `basic` -> `基础资料`

## localStorage rules

All user data must be stored locally.

Use namespaced keys:

* `quietStudy.records`
* `quietStudy.marked`
* `quietStudy.review`
* `quietStudy.daily`
* `quietStudy.settings`
* `quietStudy.importedQuestions`
* `quietStudy.lastActiveDate`

Do not upload or transmit user records.

## Import/export rules

Import:

* label as `导入资料`
* accept JSON only
* validate structure
* merge imported questions with built-in questions
* preserve existing records when IDs match
* show clear error messages

Export:

* label as `导出记录`
* export local user records as JSON
* include timestamp
* do not call it score export

Reset:

* label as `清空本地记录`
* require confirmation
* clear only local progress and user records
* do not delete built-in question data

## Interaction rules

Supported keyboard shortcuts:

* `1` selects A
* `2` selects B
* `3` selects C
* `4` selects D
* `N` goes to next card
* `M` toggles marked status
* `Esc` closes dialogs or quick card modal

Mobile interactions must be touch-friendly.

## Development rules

When making changes:

1. Keep files readable.
2. Keep functions small and understandable.
3. Avoid unnecessary abstractions.
4. Do not add frameworks.
5. Do not add external dependencies.
6. Use relative paths.
7. Keep styling consistent.
8. Keep UI wording neutral.
9. Update README when usage changes.
10. Test localStorage after touching record logic.

## Verification checklist

After implementation or modification, verify:

* `index.html` loads
* CSS loads
* JavaScript loads
* built-in question data loads
* navigation works
* daily card flow works
* random card works
* marking works
* review content works
* records persist after refresh
* import validates JSON
* export downloads JSON
* reset clears local records
* mobile layout is usable
* GitHub Pages paths are relative
* console has no blocking errors

```
