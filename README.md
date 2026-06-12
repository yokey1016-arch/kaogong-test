# Reading Desk

Reading Desk 是一个纯前端的个人知识卡片与碎片化阅读记录网页。它适合放在 GitHub Pages 上作为个人阅读桌面、工作资料卡片站或轻量知识看板使用。

## 本地预览方式

在仓库根目录运行：

```bash
python3 -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173/index.html
```

也可以直接打开 `index.html`，但本地服务更接近 GitHub Pages 的访问方式。

## GitHub Pages 部署方式

1. 将本仓库推送到 GitHub。
2. 进入仓库 Settings。
3. 打开 Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 Pages 生成访问地址。

本项目入口文件全部位于仓库根目录，适配 `main` 分支根目录部署。

## 如何替换 data/questions.js

`data/questions.js` 中定义了全局常量 `QUESTION_BANK`。保持如下结构即可替换或扩展材料卡片：

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
    explanation: "说明内容",
    difficulty: "easy"
  }
];
```

支持的分类为：

- `language`：语言材料
- `logic`：逻辑材料
- `data`：数据材料
- `common`：通用材料
- `basic`：基础资料

## 如何导入 JSON

在“设置”页面的“导入资料”区域粘贴 JSON 数组并点击“导入资料”。导入内容会校验：

- 必须是 JSON 数组。
- 每条必须包含 `id`、`category`、`title`、`stem`、`options`、`answer`、`explanation`。
- `options` 必须包含 `A`、`B`、`C`、`D`。
- `answer` 必须是 `A`、`B`、`C`、`D` 之一。
- 若 `id` 已存在，会更新材料内容，并保留浏览器中的本地记录。

## localStorage 数据说明

所有用户数据只保存在当前浏览器的 localStorage 中，使用 `quietStudy` 命名空间：

- `quietStudy.records`：阅读选择与记录状态。
- `quietStudy.marked`：已标记内容。
- `quietStudy.review`：复看内容。
- `quietStudy.daily`：每日 5 张材料卡片列表。
- `quietStudy.settings`：主题、极简模式等设置。
- `quietStudy.importedQuestions`：导入的资料。
- `quietStudy.lastActiveDate`：最近使用日期。

## 快捷键说明

- `1`：选择 A
- `2`：选择 B
- `3`：选择 C
- `4`：选择 D
- `N`：下一张
- `M`：标记或取消标记
- `Esc`：关闭弹窗

## 常见问题

**记录会同步到云端吗？**  
不会。所有记录只保存在当前浏览器。

**为什么换浏览器后看不到记录？**  
localStorage 按浏览器和站点保存，换浏览器等于换了一个本地空间。

**导入后原有记录会丢失吗？**  
不会。相同 `id` 的材料会更新内容，但本地记录会保留。

**清空本地记录会删除内置材料吗？**  
不会。清空只影响浏览器保存的记录、设置和导入资料。
