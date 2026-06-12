(function () {
  "use strict";

  const KEYS = {
    records: "quietStudy.records",
    marked: "quietStudy.marked",
    review: "quietStudy.review",
    daily: "quietStudy.daily",
    settings: "quietStudy.settings",
    imported: "quietStudy.importedQuestions",
    lastActive: "quietStudy.lastActiveDate"
  };

  const CATEGORY_LABELS = {
    language: "语言材料",
    logic: "逻辑材料",
    data: "数据材料",
    common: "通用材料",
    basic: "基础资料"
  };

  const VIEW_META = {
    today: ["今日阅读", "安静整理今天的 5 张材料卡片"],
    quick: ["快速卡片", "按分类和状态抽取一张材料卡片"],
    archive: ["资料归档", "检索和查看全部材料卡片"],
    marked: ["标记内容", "集中处理已标记与需要复看的内容"],
    stats: ["统计概览", "用工作面板方式查看本地记录"],
    settings: ["设置", "管理显示方式、资料导入与本地记录"]
  };

  const state = {
    view: "today",
    todayIndex: 0,
    quickQuestionId: null,
    quickFilters: {
      category: "all",
      undone: false,
      review: false,
      marked: false
    },
    search: "",
    modalQuestionId: null
  };

  const store = {
    records: read(KEYS.records, {}),
    marked: read(KEYS.marked, []),
    review: read(KEYS.review, []),
    daily: read(KEYS.daily, {}),
    settings: Object.assign({ theme: "light", minimal: false }, read(KEYS.settings, {})),
    imported: read(KEYS.imported, []),
    lastActive: read(KEYS.lastActive, "")
  };

  const root = document.getElementById("viewRoot");
  const title = document.getElementById("viewTitle");
  const subtitle = document.getElementById("viewSubtitle");
  const todayProgress = document.getElementById("todayProgress");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function todayKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function allQuestions() {
    const byId = new Map();
    QUESTION_BANK.concat(store.imported).forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  }

  function getQuestion(id) {
    return allQuestions().find((item) => item.id === id) || null;
  }

  function seededDailyQuestions() {
    const key = todayKey();
    if (!Array.isArray(store.daily[key]) || store.daily[key].length !== 5) {
      const list = allQuestions();
      let seed = Number(key.replaceAll("-", ""));
      const ranked = list
        .map((item, index) => {
          seed = (seed * 9301 + 49297 + index) % 233280;
          return { item, score: seed };
        })
        .sort((a, b) => a.score - b.score)
        .slice(0, 5)
        .map((entry) => entry.item.id);
      store.daily[key] = ranked;
      write(KEYS.daily, store.daily);
    }
    return store.daily[key].map(getQuestion).filter(Boolean);
  }

  function markActiveDate() {
    const key = todayKey();
    if (store.lastActive !== key) {
      store.lastActive = key;
      write(KEYS.lastActive, key);
    }
  }

  function isMarked(id) {
    return store.marked.includes(id);
  }

  function needsReview(id) {
    return store.review.includes(id);
  }

  function completed(id) {
    return Boolean(store.records[id]);
  }

  function saveRecords() {
    write(KEYS.records, store.records);
  }

  function setList(key, list) {
    store[key] = Array.from(new Set(list));
    write(KEYS[key], store[key]);
  }

  function toggleMarked(id) {
    if (isMarked(id)) {
      setList("marked", store.marked.filter((item) => item !== id));
    } else {
      setList("marked", store.marked.concat(id));
    }
    render();
  }

  function removeReview(id) {
    setList("review", store.review.filter((item) => item !== id));
    render();
  }

  function answerQuestion(question, choice) {
    const ok = question.answer === choice;
    store.records[question.id] = {
      selected: choice,
      ok,
      updatedAt: new Date().toISOString()
    };
    saveRecords();
    if (!ok && !needsReview(question.id)) {
      setList("review", store.review.concat(question.id));
    }
    markActiveDate();
    render();
  }

  function statusFor(id) {
    if (needsReview(id)) return ["需要复看", "status-review"];
    if (completed(id)) return ["已记录", "status-done"];
    return ["未完成", ""];
  }

  function renderQuestionCard(question, options = {}) {
    if (!question) return `<div class="empty">暂无可显示的材料卡片</div>`;
    const record = store.records[question.id];
    const [statusText, statusClass] = statusFor(question.id);
    const disableNext = options.next ? "" : "hidden";
    const feedback = record
      ? `<div class="feedback"><strong>${record.ok ? "已记录" : "需要复看"}</strong>${record.ok ? "这张材料已完成记录。" : `正确答案：${question.answer}。${escapeHtml(question.explanation)}`}</div>`
      : "";
    const optionHtml = ["A", "B", "C", "D"].map((key) => {
      const selected = record && record.selected === key;
      const cls = selected ? (record.ok ? "selected good" : "selected needs-review") : "";
      return `<button class="option-btn ${cls}" data-answer="${key}" data-id="${question.id}" type="button"><strong>${key}.</strong> ${escapeHtml(question.options[key])}</button>`;
    }).join("");
    return `
      <article class="panel question-card" data-current-question="${question.id}">
        <div class="question-head">
          <div>
            <h2>${escapeHtml(question.title)}</h2>
            <div class="meta-row">
              <span class="tag">${CATEGORY_LABELS[question.category] || question.category}</span>
              <span class="tag ${statusClass}">${statusText}</span>
              <span class="tag">${difficultyLabel(question.difficulty)}</span>
            </div>
          </div>
          <button class="ghost-btn" data-toggle-mark="${question.id}" type="button">${isMarked(question.id) ? "取消标记" : "标记"}</button>
        </div>
        <p class="stem">${escapeHtml(question.stem)}</p>
        <div class="options">${optionHtml}</div>
        ${feedback}
        <div class="action-row" style="margin-top: 14px;">
          <button class="primary-btn ${disableNext}" data-next-card type="button">下一张</button>
          ${needsReview(question.id) ? `<button class="ghost-btn" data-remove-review="${question.id}" type="button">移出复看</button>` : ""}
        </div>
      </article>
    `;
  }

  function difficultyLabel(value) {
    return { easy: "轻量", medium: "进阶", hard: "深入" }[value] || "常规";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function updateProgress() {
    const today = seededDailyQuestions();
    const done = today.filter((item) => completed(item.id)).length;
    todayProgress.textContent = `${done}/5`;
  }

  function render() {
    applySettings();
    const meta = VIEW_META[state.view];
    title.textContent = meta[0];
    subtitle.textContent = meta[1];
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === state.view);
    });
    updateProgress();
    const renderers = {
      today: renderToday,
      quick: renderQuick,
      archive: renderArchive,
      marked: renderMarked,
      stats: renderStats,
      settings: renderSettings
    };
    root.innerHTML = renderers[state.view]();
    if (state.modalQuestionId) {
      const question = getQuestion(state.modalQuestionId);
      modalBody.innerHTML = renderQuestionCard(question);
      modal.classList.remove("hidden");
    }
  }

  function renderToday() {
    const today = seededDailyQuestions();
    const question = today[state.todayIndex] || today[0];
    const cards = today.map((item, index) => {
      const [text, cls] = statusFor(item.id);
      return `<button class="chip ${index === state.todayIndex ? "active" : ""}" data-today-index="${index}" type="button">${index + 1}. ${text}</button>`;
    }).join("");
    return `
      <div class="grid two">
        ${renderQuestionCard(question, { next: true })}
        <aside class="panel">
          <h2>今日列表</h2>
          <p>每天自动抽取 5 张材料卡片，记录会保存在当前浏览器。</p>
          <div class="meta-row">${cards}</div>
        </aside>
      </div>
    `;
  }

  function filteredQuickList() {
    return allQuestions().filter((item) => {
      if (state.quickFilters.category !== "all" && item.category !== state.quickFilters.category) return false;
      if (state.quickFilters.undone && completed(item.id)) return false;
      if (state.quickFilters.review && !needsReview(item.id)) return false;
      if (state.quickFilters.marked && !isMarked(item.id)) return false;
      return true;
    });
  }

  function pickQuick() {
    const list = filteredQuickList();
    if (!list.length) {
      state.quickQuestionId = null;
      return;
    }
    const next = list[Math.floor(Math.random() * list.length)];
    state.quickQuestionId = next.id;
  }

  function renderQuick() {
    if (!state.quickQuestionId || !getQuestion(state.quickQuestionId)) pickQuick();
    const categoryOptions = [`<option value="all">全部分类</option>`].concat(Object.keys(CATEGORY_LABELS).map((key) => `<option value="${key}" ${state.quickFilters.category === key ? "selected" : ""}>${CATEGORY_LABELS[key]}</option>`)).join("");
    return `
      <div class="grid two">
        <section class="panel">
          <div class="filter-row">
            <select data-quick-category aria-label="分类筛选">${categoryOptions}</select>
            <button class="chip ${state.quickFilters.undone ? "active" : ""}" data-filter="undone" type="button">只看未完成</button>
            <button class="chip ${state.quickFilters.review ? "active" : ""}" data-filter="review" type="button">只看复看内容</button>
            <button class="chip ${state.quickFilters.marked ? "active" : ""}" data-filter="marked" type="button">只看标记内容</button>
            <button class="primary-btn" data-random-card type="button">随机抽取</button>
          </div>
        </section>
        <section class="panel">
          <h2>当前范围</h2>
          <p>共有 ${filteredQuickList().length} 张材料卡片符合条件。</p>
        </section>
      </div>
      <div style="height: 16px;"></div>
      ${renderQuestionCard(getQuestion(state.quickQuestionId))}
    `;
  }

  function renderArchive() {
    const q = state.search.trim().toLowerCase();
    const list = allQuestions().filter((item) => {
      const haystack = `${item.title} ${item.stem} ${item.explanation} ${CATEGORY_LABELS[item.category]}`.toLowerCase();
      return haystack.includes(q);
    });
    const groups = Object.keys(CATEGORY_LABELS).map((category) => {
      const items = list.filter((item) => item.category === category);
      if (!items.length) return "";
      return `<section class="panel"><h2>${CATEGORY_LABELS[category]}</h2><div class="archive-list">${items.map(renderListItem).join("")}</div></section>`;
    }).join("");
    return `
      <div class="panel">
        <div class="control">
          <label for="archiveSearch">搜索关键词</label>
          <input id="archiveSearch" data-search value="${escapeHtml(state.search)}" placeholder="输入标题、正文或说明">
        </div>
      </div>
      <div style="height: 16px;"></div>
      <div class="grid">${groups || `<div class="empty">没有匹配的材料卡片</div>`}</div>
    `;
  }

  function renderListItem(item) {
    const [text, cls] = statusFor(item.id);
    return `
      <div class="list-item">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <div class="meta-row" style="margin-top: 8px;">
            <span class="tag">${CATEGORY_LABELS[item.category]}</span>
            <span class="tag ${cls}">${text}</span>
          </div>
        </div>
        <button class="ghost-btn" data-open="${item.id}" type="button">查看</button>
      </div>
    `;
  }

  function renderMarked() {
    const markedItems = store.marked.map(getQuestion).filter(Boolean);
    const reviewItems = store.review.map(getQuestion).filter(Boolean);
    const block = (heading, items, type) => `
      <section class="panel">
        <h2>${heading}</h2>
        <div class="archive-list">
          ${items.length ? items.map((item) => `
            <div class="list-item">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <div class="meta-row" style="margin-top: 8px;"><span class="tag">${CATEGORY_LABELS[item.category]}</span></div>
              </div>
              <div class="action-row">
                <button class="ghost-btn" data-open="${item.id}" type="button">重新阅读</button>
                ${type === "marked" ? `<button class="ghost-btn" data-toggle-mark="${item.id}" type="button">取消标记</button>` : `<button class="ghost-btn" data-remove-review="${item.id}" type="button">移出复看</button>`}
              </div>
            </div>
          `).join("") : `<div class="empty">暂无内容</div>`}
        </div>
      </section>
    `;
    return `<div class="grid two">${block("已标记内容", markedItems, "marked")}${block("复看内容", reviewItems, "review")}</div>`;
  }

  function renderStats() {
    const questions = allQuestions();
    const totalDone = Object.keys(store.records).length;
    const goodCount = Object.values(store.records).filter((item) => item.ok).length;
    const quality = totalDone ? Math.round((goodCount / totalDone) * 100) : 0;
    const today = seededDailyQuestions();
    const todayDone = today.filter((item) => completed(item.id)).length;
    const categoryCards = Object.keys(CATEGORY_LABELS).map((category) => {
      const ids = questions.filter((item) => item.category === category).map((item) => item.id);
      const done = ids.filter((id) => store.records[id]).length;
      const good = ids.filter((id) => store.records[id] && store.records[id].ok).length;
      const rate = done ? Math.round((good / done) * 100) : 0;
      return `<div class="card"><h3>${CATEGORY_LABELS[category]}</h3><div class="bar"><span style="width:${rate}%"></span></div><p class="stat-number">${rate}%</p><p>${done} 条已记录</p></div>`;
    }).join("");
    return `
      <div class="grid three">
        <div class="card"><h3>总完成数</h3><p class="stat-number">${totalDone}</p><p>累计记录的材料卡片</p></div>
        <div class="card"><h3>记录质量</h3><p class="stat-number">${quality}%</p><p>已记录内容中的稳定比例</p></div>
        <div class="card"><h3>连续天数</h3><p class="stat-number">${streakDays()}</p><p>保持使用的连续日期</p></div>
      </div>
      <div style="height: 16px;"></div>
      <div class="grid two">
        <section class="panel"><h2>今日完成情况</h2><div class="bar"><span style="width:${todayDone * 20}%"></span></div><p class="stat-number">${todayDone}/5</p></section>
        <section class="panel"><h2>本地状态</h2><p>标记内容 ${store.marked.length} 条，复看内容 ${store.review.length} 条，资料总量 ${questions.length} 条。</p></section>
      </div>
      <div style="height: 16px;"></div>
      <section class="grid three">${categoryCards}</section>
    `;
  }

  function streakDays() {
    const dates = Object.values(store.records).map((item) => item.updatedAt.slice(0, 10));
    const set = new Set(dates);
    let count = 0;
    const cursor = new Date();
    while (set.has(cursor.toISOString().slice(0, 10))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function renderSettings() {
    return `
      <div class="grid two">
        <section class="panel">
          <h2>显示方式</h2>
          <div class="action-row">
            <button class="chip ${store.settings.theme === "light" ? "active" : ""}" data-theme="light" type="button">浅色模式</button>
            <button class="chip ${store.settings.theme === "dark" ? "active" : ""}" data-theme="dark" type="button">深色模式</button>
            <button class="chip ${store.settings.minimal ? "active" : ""}" data-minimal type="button">极简模式</button>
          </div>
        </section>
        <section class="panel">
          <h2>本地记录</h2>
          <div class="action-row">
            <button class="primary-btn" data-export type="button">导出记录</button>
            <button class="danger-btn" data-clear type="button">清空本地记录</button>
          </div>
        </section>
      </div>
      <div style="height: 16px;"></div>
      <section class="panel">
        <h2>导入资料</h2>
        <div class="control">
          <label for="importJson">粘贴 JSON 数组</label>
          <textarea id="importJson" data-import-text placeholder='[{"id":"custom001","category":"basic","title":"基础资料","stem":"内容","options":{"A":"一","B":"二","C":"三","D":"四"},"answer":"A","explanation":"说明"}]'></textarea>
        </div>
        <div class="action-row" style="margin-top: 12px;">
          <button class="primary-btn" data-import type="button">导入资料</button>
        </div>
      </section>
    `;
  }

  function validateImported(items) {
    if (!Array.isArray(items)) throw new Error("导入内容必须是 JSON 数组。");
    return items.map((item, index) => {
      const required = ["id", "category", "title", "stem", "options", "answer", "explanation"];
      required.forEach((field) => {
        if (!item || item[field] === undefined || item[field] === "") throw new Error(`第 ${index + 1} 条缺少 ${field} 字段。`);
      });
      ["A", "B", "C", "D"].forEach((key) => {
        if (!item.options || item.options[key] === undefined || item.options[key] === "") throw new Error(`第 ${index + 1} 条 options 缺少 ${key}。`);
      });
      if (!["A", "B", "C", "D"].includes(item.answer)) throw new Error(`第 ${index + 1} 条 answer 必须是 A/B/C/D。`);
      if (!CATEGORY_LABELS[item.category]) throw new Error(`第 ${index + 1} 条 category 不在支持范围内。`);
      return {
        id: String(item.id),
        category: item.category,
        title: String(item.title),
        stem: String(item.stem),
        options: { A: String(item.options.A), B: String(item.options.B), C: String(item.options.C), D: String(item.options.D) },
        answer: item.answer,
        explanation: String(item.explanation),
        difficulty: item.difficulty || "medium"
      };
    });
  }

  function importQuestions() {
    const textarea = document.querySelector("[data-import-text]");
    try {
      const parsed = JSON.parse(textarea.value);
      const items = validateImported(parsed);
      const byId = new Map(store.imported.map((item) => [item.id, item]));
      items.forEach((item) => byId.set(item.id, item));
      store.imported = Array.from(byId.values());
      write(KEYS.imported, store.imported);
      toast(`导入完成：${items.length} 条资料已更新。`);
      render();
    } catch (error) {
      toast(error.message || "导入失败，请检查 JSON 内容。");
    }
  }

  function exportRecords() {
    const payload = {
      exportedAt: new Date().toISOString(),
      records: store.records,
      marked: store.marked,
      review: store.review,
      daily: store.daily,
      settings: store.settings
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reading-desk-records-${todayKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function clearLocalRecords() {
    if (!confirm("确认清空本地记录？此操作不会删除内置材料。")) return;
    [KEYS.records, KEYS.marked, KEYS.review, KEYS.daily, KEYS.settings, KEYS.imported, KEYS.lastActive].forEach((key) => localStorage.removeItem(key));
    store.records = {};
    store.marked = [];
    store.review = [];
    store.daily = {};
    store.settings = { theme: "light", minimal: false };
    store.imported = [];
    store.lastActive = "";
    render();
  }

  function applySettings() {
    document.body.classList.toggle("dark", store.settings.theme === "dark");
    document.body.classList.toggle("minimal", Boolean(store.settings.minimal));
    write(KEYS.settings, store.settings);
  }

  function openModal(id) {
    state.modalQuestionId = id;
    render();
  }

  function closeModal() {
    state.modalQuestionId = null;
    modal.classList.add("hidden");
    modalBody.innerHTML = "";
  }

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2800);
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, [data-search], select");
    if (!target) return;
    if (target.matches(".nav-btn")) {
      state.view = target.dataset.view;
      render();
    }
    if (target.dataset.answer) answerQuestion(getQuestion(target.dataset.id), target.dataset.answer);
    if (target.dataset.toggleMark) toggleMarked(target.dataset.toggleMark);
    if (target.dataset.removeReview) removeReview(target.dataset.removeReview);
    if (target.dataset.nextCard !== undefined) {
      const today = seededDailyQuestions();
      state.todayIndex = (state.todayIndex + 1) % today.length;
      render();
    }
    if (target.dataset.todayIndex) {
      state.todayIndex = Number(target.dataset.todayIndex);
      render();
    }
    if (target.dataset.randomCard !== undefined) {
      pickQuick();
      render();
    }
    if (target.dataset.filter) {
      state.quickFilters[target.dataset.filter] = !state.quickFilters[target.dataset.filter];
      pickQuick();
      render();
    }
    if (target.dataset.open) openModal(target.dataset.open);
    if (target.dataset.export !== undefined) exportRecords();
    if (target.dataset.import !== undefined) importQuestions();
    if (target.dataset.clear !== undefined) clearLocalRecords();
    if (target.dataset.theme) {
      store.settings.theme = target.dataset.theme;
      render();
    }
    if (target.dataset.minimal !== undefined) {
      store.settings.minimal = !store.settings.minimal;
      render();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-quick-category]")) {
      state.quickFilters.category = event.target.value;
      pickQuick();
      render();
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-search]")) {
      state.search = event.target.value;
      renderArchiveDebounced();
    }
  });

  let searchTimer = null;
  function renderArchiveDebounced() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(render, 120);
  }

  document.getElementById("quickFloat").addEventListener("click", () => {
    const list = allQuestions();
    const question = list[Math.floor(Math.random() * list.length)];
    openModal(question.id);
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea, select")) return;
    if (event.key === "Escape") closeModal();
    const activeCard = document.querySelector("[data-current-question]");
    const currentId = activeCard && activeCard.dataset.currentQuestion;
    const current = currentId ? getQuestion(currentId) : null;
    const map = { "1": "A", "2": "B", "3": "C", "4": "D" };
    if (current && map[event.key]) answerQuestion(current, map[event.key]);
    if (current && event.key.toLowerCase() === "m") toggleMarked(current.id);
    if (event.key.toLowerCase() === "n") {
      if (state.view === "quick") pickQuick();
      if (state.view === "today") state.todayIndex = (state.todayIndex + 1) % seededDailyQuestions().length;
      render();
    }
  });

  markActiveDate();
  render();
}());
