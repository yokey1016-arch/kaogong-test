# AGENTS.md

## 项目目标

Reading Desk 是一个部署在 GitHub Pages 根目录的纯前端静态网页，用于个人知识卡片、碎片化阅读和本地记录管理。页面气质应接近普通知识看板、阅读桌面、工作资料卡片站和企业知识库。

## 技术约束

- 不创建二级项目文件夹。
- 网页入口文件直接放在仓库根目录。
- 必须保留 `index.html`、`styles.css`、`app.js`、`data/questions.js`、`README.md`、`AGENTS.md`。
- 不使用 React、Vue、Vite、Webpack 或 Node 构建工具。
- 不运行依赖安装。
- 不使用外部 CDN。
- 不发起联网请求。
- 页面应能通过静态文件直接访问。

## UI 中性表达规则

- 可见界面使用知识管理、阅读记录、资料整理语境。
- 推荐表达：材料卡片、今日阅读、快速卡片、资料归档、标记内容、复看内容、统计概览、记录质量、完成进度、导入资料、导出记录、清空本地记录。
- 避免强测评、高压力、排名化和游戏化表达。
- 不添加排行榜、倒计时、夸张动画或强刺激色彩。

## localStorage 规则

所有用户记录只保存在浏览器 localStorage 中，key 必须使用 `quietStudy` 命名空间：

- `quietStudy.records`
- `quietStudy.marked`
- `quietStudy.review`
- `quietStudy.daily`
- `quietStudy.settings`
- `quietStudy.importedQuestions`
- `quietStudy.lastActiveDate`

导入资料时，相同 `id` 更新材料内容，但不得清除既有本地记录。

## GitHub Pages 路径规则

- 部署目标为 `main` 分支根目录。
- `index.html` 必须使用相对路径：
  - `./styles.css`
  - `./data/questions.js`
  - `./app.js`
- 不使用以 `/` 开头的绝对静态资源路径。

## 修改后的验收清单

- 根目录结构符合要求。
- `node --check app.js` 通过。
- `node --check data/questions.js` 通过。
- `index.html` 包含 `name="viewport"`。
- `index.html` 包含 `./styles.css`、`./data/questions.js`、`./app.js`。
- 不存在以站点根路径开头的静态资源引用。
- 可见界面保持中性知识管理表达。
- 不留下未处理的占位事项。
- 本地预览地址为 `http://127.0.0.1:4173/index.html`。
