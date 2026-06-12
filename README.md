# quiet-study-dashboard

`quiet-study-dashboard` 是一个纯前端、离线优先的个人知识看板与碎片化阅读工具。页面风格接近普通工作知识库、信息看板和文档阅读站，适合放在 GitHub Pages 上作为轻量个人学习页面使用。

项目不需要后端、数据库、登录系统、构建工具或外部 CDN。所有交互状态都保存在当前浏览器的 `localStorage` 中。

## 本地运行方式

方式一：直接打开

1. 下载或克隆本项目。
2. 在文件管理器中双击 `index.html`。
3. 浏览器会直接加载 `styles.css`、`app.js` 和 `data/questions.js`。

方式二：VS Code Live Server

1. 使用 VS Code 打开项目目录。
2. 安装并启用 Live Server 插件。
3. 右键 `index.html`，选择 `Open with Live Server`。

## GitHub Pages 部署方式

1. 将项目推送到 GitHub 仓库。
2. 打开 GitHub 仓库页面。
3. 进入 `Settings`。
4. 打开 `Pages`。
5. 在 `Build and deployment` 中选择 `Deploy from a branch`。
6. 选择 `main` 分支和根目录。
7. 保存设置。
8. 等待 GitHub 生成 Pages 地址后访问。

项目使用相对路径：

```html
<link rel="stylesheet" href="./styles.css">
<script src="./data/questions.js"></script>
<script src="./app.js"></script>
```

因此既可以直接打开 `index.html`，也可以部署到 GitHub Pages 项目站点。

## 如何替换题库

内置数据位于：

```txt
data/questions.js
```

数据格式如下：

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

可用分类：

| 内部分类 | 页面显示 |
| --- | --- |
| `language` | 语言材料 |
| `logic` | 逻辑材料 |
| `data` | 数据材料 |
| `common` | 通用材料 |
| `basic` | 基础资料 |

替换时请保持每条数据的 `id` 稳定。若修改已有 `id` 的内容，浏览器中的历史记录仍可对应到同一条资料。

## 如何导入 JSON 题库

页面内进入 `设置`，选择 JSON 文件后点击 `导入资料`。导入文件必须是数组，且每条资料包含：

- `id`
- `category`
- `title`
- `stem`
- `options`
- `answer`
- `explanation`

其中 `options` 必须包含 `A`、`B`、`C`、`D`，`answer` 必须是 `A/B/C/D` 之一。

导入内容会保存在 `localStorage` 的 `quietStudy.importedQuestions` 中，并在运行时与内置数据合并。如果导入内容与已有 `id` 重复，会更新该条资料内容，并保留已有阅读记录。

## 数据保存在 localStorage 的说明

本项目不会联网请求，不会上传任何个人记录，也不会接入第三方统计。所有状态只保存在当前浏览器中。

使用的本地键名包括：

- `quietStudy.records`：阅读记录
- `quietStudy.marked`：标记内容
- `quietStudy.review`：复看内容
- `quietStudy.daily`：每日进度
- `quietStudy.settings`：外观与显示设置
- `quietStudy.importedQuestions`：导入资料
- `quietStudy.lastActiveDate`：最近活跃日期

清理浏览器数据、更换浏览器或更换设备后，本地记录不会自动同步。需要迁移时，可以在 `设置` 中点击 `导出记录`，保存当前浏览器中的记录 JSON。

## 主要功能

- 今日阅读：每天展示 5 张材料卡片。
- 快速卡片：随机抽取材料，支持分类和状态筛选。
- 资料归档：按分类与关键词查找资料。
- 标记内容：查看已标记和需要复看的资料。
- 统计概览：展示总完成、记录质量、连续天数与分类概览。
- 设置：支持深色模式、极简模式、JSON 导入、记录导出和清空本地记录。

## 键盘快捷键

- `1` / `2` / `3` / `4`：选择 A / B / C / D
- `N`：下一张或随机一张
- `M`：标记或取消标记
- `Esc`：关闭快速卡片弹窗

## 文件结构

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
```
