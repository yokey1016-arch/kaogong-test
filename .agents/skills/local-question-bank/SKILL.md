---
name: local-question-bank
description: Use this skill when implementing or modifying an offline question bank, localStorage learning records, marked items, review items, progress tracking, JSON import, JSON export, or record reset features.
---

# Local Question Bank Skill

This skill is used to build and maintain an offline-first local review system.

The application must work without backend services, accounts, cloud storage, external APIs, analytics, or network requests.

All user data must stay inside the browser through localStorage.

## Core principles

- Offline-first
- No login
- No backend
- No database server
- No external analytics
- No third-party tracking
- No upload of user activity
- All records stored locally
- Question content separated from user records
- Stable question IDs
- Safe import/export behavior

## File structure

Recommended structure:

- `index.html`
- `styles.css`
- `app.js`
- `data/questions.js`
- `README.md`

Question bank should be defined in `data/questions.js`.

Example structure:

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
````

## Category mapping

Internal category names:

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

Do not expose internal category names directly in the UI.

## localStorage data

Use namespaced localStorage keys.

Recommended keys:

* `quietStudy.records`
* `quietStudy.marked`
* `quietStudy.review`
* `quietStudy.daily`
* `quietStudy.settings`
* `quietStudy.importedQuestions`
* `quietStudy.lastActiveDate`

Recommended user record shape:

```js
{
  questionId: "q001",
  selected: "A",
  correct: true,
  answeredAt: "2026-06-12T12:00:00.000Z",
  category: "language"
}
```

Recommended settings shape:

```js
{
  theme: "light",
  minimalMode: false,
  dailyTarget: 5
}
```

## Required features

The app should support:

1. Answering a card
2. Immediate feedback
3. Explanation display
4. Mark/unmark
5. Add/remove review item
6. Daily progress
7. Total completed count
8. Record quality by category
9. Streak calculation
10. JSON import
11. JSON export
12. Reset local records after confirmation

## Import rules

When importing JSON:

1. Validate that the imported value is an array.
2. Validate each item has:

   * `id`
   * `category`
   * `title`
   * `stem`
   * `options`
   * `answer`
   * `explanation`
3. Validate options include A/B/C/D.
4. Validate answer is one of A/B/C/D.
5. Reject malformed imports with a clear message.
6. If a question ID already exists, update the question content.
7. Preserve existing user records for matching IDs.
8. Store imported questions separately from built-in questions.
9. Merge built-in and imported questions at runtime.

## Export rules

The export file should include:

```js
{
  exportedAt: "ISO date string",
  records: [],
  marked: [],
  review: [],
  daily: {},
  settings: {}
}
```

Visible UI label should be `导出记录`.

Do not call it `导出成绩`.

## Reset rules

Before clearing local records:

1. Show confirmation.
2. Explain that only local browser data will be cleared.
3. Do not clear built-in question data.
4. Clear:

   * records
   * marked
   * review
   * daily progress
   * settings if user chooses full reset

## Record calculation

Total completed:

* count unique answered question IDs or total answer attempts depending on UI context
* prefer unique completed count for summary cards

Record quality:

* correct answers / answered attempts
* show as percentage
* label as `记录质量`

Daily progress:

* based on local date
* count unique answered question IDs for the current day

Streak:

* count consecutive dates with at least one completed item
* do not require the daily target to be met unless explicitly configured

## UI wording

Use:

* 导入资料
* 导出记录
* 清空本地记录
* 复看内容
* 标记内容
* 阅读记录
* 记录质量
* 完成进度

Avoid:

* 导入题库
* 导出成绩
* 错题
* 刷题记录
* 考试成绩
* 分数

## Error handling

Provide calm, clear errors:

* `导入失败：文件格式不符合要求。`
* `导入失败：部分资料缺少必要字段。`
* `本地记录已清空。`
* `没有可导出的记录。`

## Output expectations

When changing data logic:

1. Keep user data local.
2. Do not add backend services.
3. Do not add external libraries unless explicitly requested.
4. Keep question data and user records separate.
5. Preserve existing records during question updates.
6. Test import/export and localStorage persistence.

````
