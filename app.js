(function () {
  "use strict";

  const KEYS = {
    records: "quietStudy.records",
    marked: "quietStudy.marked",
    review: "quietStudy.review",
    daily: "quietStudy.daily",
    settings: "quietStudy.settings",
    importedQuestions: "quietStudy.importedQuestions",
    lastActiveDate: "quietStudy.lastActiveDate"
  };

  const CATEGORY_LABELS = {
    all: "全部分类",
    language: "语言材料",
    logic: "逻辑材料",
    data: "数据材料",
    common: "通用材料",
    basic: "基础资料"
  };

  const DEFAULT_SETTINGS = {
    theme: "light",
    minimalMode: false,
    dailyTarget: 5
  };

  const state = {
    view: "daily",
    questions: [],
    records: readJSON(KEYS.records, []),
    marked: readJSON(KEYS.marked, []),
    review: readJSON(KEYS.review, []),
    daily: readJSON(KEYS.daily, {}),
    settings: Object.assign({}, DEFAULT_SETTINGS, readJSON(KEYS.settings, {})),
    importedQuestions: readJSON(KEYS.importedQuestions, []),
    dailyIds: [],
    dailyIndex: 0,
    quickQuestion: null,
    modalQuestion: null,
    archiveSelectedId: null
  };

  const nodes = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    collectNodes();
    mergeQuestions();
    state.dailyIds = getDailyIds();
    hydrateControls();
    bindEvents();
    applySettings();
    setActiveView("daily");
    renderAll();
    localStorage.setItem(KEYS.lastActiveDate, getLocalDateKey());
  }

  function collectNodes() {
    [
      "navList", "viewTitle", "todayPill", "dailyCounter", "dailyCard", "quickCategory",
      "archiveCategory", "archiveSearch", "archiveList", "archiveDetail", "markedList",
      "reviewList", "statsGrid", "categoryStats", "randomQuickButton", "quickCard",
      "filterUnfinished", "filterReview", "filterMarked", "floatingQuick", "quickModal",
      "closeModal", "modalCard", "themeToggle", "minimalToggle", "minimalModeSetting",
      "importFile", "importButton", "exportButton", "resetButton", "settingsMessage",
      "sidebarProgress"
    ].forEach((id) => {
      nodes[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    nodes.navList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-view]");
      if (button) setActiveView(button.dataset.view);
    });

    nodes.randomQuickButton.addEventListener("click", () => {
      state.quickQuestion = pickRandomQuestion(getQuickPool());
      renderQuickCard();
    });

    [nodes.quickCategory, nodes.filterUnfinished, nodes.filterReview, nodes.filterMarked].forEach((node) => {
      node.addEventListener("change", () => {
        state.quickQuestion = pickRandomQuestion(getQuickPool());
        renderQuickCard();
      });
    });

    nodes.archiveCategory.addEventListener("change", renderArchive);
    nodes.archiveSearch.addEventListener("input", renderArchive);
    nodes.floatingQuick.addEventListener("click", openQuickModal);
    nodes.closeModal.addEventListener("click", closeQuickModal);
    nodes.quickModal.addEventListener("click", (event) => {
      if (event.target === nodes.quickModal) closeQuickModal();
    });

    nodes.themeToggle.addEventListener("change", () => {
      state.settings.theme = nodes.themeToggle.checked ? "dark" : "light";
      saveSettings();
      applySettings();
    });

    nodes.minimalToggle.addEventListener("click", () => {
      state.settings.minimalMode = !state.settings.minimalMode;
      saveSettings();
      applySettings();
    });

    nodes.minimalModeSetting.addEventListener("change", () => {
      state.settings.minimalMode = nodes.minimalModeSetting.checked;
      saveSettings();
      applySettings();
    });

    nodes.importButton.addEventListener("click", importQuestions);
    nodes.exportButton.addEventListener("click", exportRecords);
    nodes.resetButton.addEventListener("click", resetLocalRecords);
    document.addEventListener("keydown", handleKeydown);
  }

  function hydrateControls() {
    fillCategorySelect(nodes.quickCategory, true);
    fillCategorySelect(nodes.archiveCategory, true);
  }

  function fillCategorySelect(select, includeAll) {
    select.innerHTML = "";
    const keys = includeAll ? ["all", "language", "logic", "data", "common", "basic"] : ["language", "logic", "data", "common", "basic"];
    keys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = CATEGORY_LABELS[key];
      select.appendChild(option);
    });
  }

  function setActiveView(view) {
    state.view = view;
    document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
    document.getElementById(`view-${view}`).classList.add("active");
    document.querySelectorAll(".nav-item").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === view);
    });
    const titles = {
      daily: "今日阅读",
      quick: "快速卡片",
      archive: "资料归档",
      marked: "标记内容",
      stats: "统计概览",
      settings: "设置"
    };
    nodes.viewTitle.textContent = titles[view];
    renderAll();
  }

  function renderAll() {
    renderProgressPills();
    renderDaily();
    renderQuickCard();
    renderArchive();
    renderMarkedReview();
    renderStats();
  }

  function mergeQuestions() {
    const map = new Map();
    QUESTION_BANK.forEach((item) => map.set(item.id, item));
    state.importedQuestions.forEach((item) => map.set(item.id, item));
    state.questions = Array.from(map.values());
  }

  function renderProgressPills() {
    const todayCount = getTodayCompletedIds().length;
    const target = state.settings.dailyTarget;
    nodes.todayPill.textContent = `今日 ${Math.min(todayCount, target)}/${target}`;
    nodes.dailyCounter.textContent = `${Math.min(todayCount, target)}/${target}`;
    nodes.sidebarProgress.textContent = `${getCompletedIds().size} 项`;
  }

  function renderDaily() {
    if (!state.dailyIds.length) {
      nodes.dailyCard.innerHTML = emptyHTML("暂无可用材料。");
      return;
    }
    const completed = getTodayCompletedIds();
    const firstOpenIndex = state.dailyIds.findIndex((id) => !completed.includes(id));
    if (firstOpenIndex >= 0 && state.dailyIndex < firstOpenIndex) {
      state.dailyIndex = firstOpenIndex;
    }
    state.dailyIndex = Math.min(state.dailyIndex, state.dailyIds.length - 1);
    const question = getQuestionById(state.dailyIds[state.dailyIndex]);
    renderQuestionCard(nodes.dailyCard, question, {
      source: "daily",
      onNext: nextDaily,
      nextLabel: state.dailyIndex >= state.dailyIds.length - 1 ? "继续" : "下一张"
    });
  }

  function nextDaily() {
    state.dailyIndex = Math.min(state.dailyIndex + 1, state.dailyIds.length - 1);
    renderDaily();
  }

  function renderQuickCard() {
    if (!state.quickQuestion || !getQuickPool().some((item) => item.id === state.quickQuestion.id)) {
      state.quickQuestion = pickRandomQuestion(getQuickPool());
    }
    if (!state.quickQuestion) {
      nodes.quickCard.innerHTML = emptyHTML("当前筛选下没有材料。");
      return;
    }
    renderQuestionCard(nodes.quickCard, state.quickQuestion, {
      source: "quick",
      onNext: () => {
        state.quickQuestion = pickRandomQuestion(getQuickPool(), state.quickQuestion.id);
        renderQuickCard();
      },
      nextLabel: "随机一张"
    });
  }

  function renderArchive() {
    const category = nodes.archiveCategory.value || "all";
    const query = nodes.archiveSearch.value.trim().toLowerCase();
    const filtered = state.questions.filter((item) => {
      const categoryMatch = category === "all" || item.category === category;
      const text = `${item.title} ${item.stem} ${Object.values(item.options).join(" ")}`.toLowerCase();
      return categoryMatch && (!query || text.includes(query));
    });

    if (!filtered.length) {
      nodes.archiveList.innerHTML = emptyHTML("没有匹配的材料。");
      nodes.archiveDetail.innerHTML = "请选择一条材料查看详情。";
      return;
    }

    if (!state.archiveSelectedId || !filtered.some((item) => item.id === state.archiveSelectedId)) {
      state.archiveSelectedId = filtered[0].id;
    }

    nodes.archiveList.innerHTML = filtered.map((item) => {
      const status = getQuestionStatus(item.id);
      return `<button class="list-item ${item.id === state.archiveSelectedId ? "active" : ""}" type="button" data-id="${item.id}">
        <h4>${escapeHTML(item.title)}</h4>
        <p>${CATEGORY_LABELS[item.category]} · ${status}</p>
      </button>`;
    }).join("");

    nodes.archiveList.querySelectorAll(".list-item").forEach((button) => {
      button.addEventListener("click", () => {
        state.archiveSelectedId = button.dataset.id;
        renderArchive();
      });
    });

    renderQuestionCard(nodes.archiveDetail, getQuestionById(state.archiveSelectedId), {
      source: "archive",
      onNext: () => {
        const index = filtered.findIndex((item) => item.id === state.archiveSelectedId);
        state.archiveSelectedId = filtered[(index + 1) % filtered.length].id;
        renderArchive();
      },
      nextLabel: "继续阅读"
    });
  }

  function renderMarkedReview() {
    nodes.markedList.innerHTML = renderCompactList(state.marked, "暂无标记内容。", true);
    nodes.reviewList.innerHTML = renderCompactList(state.review, "暂无复看内容。", false);
    bindCompactList(nodes.markedList);
    bindCompactList(nodes.reviewList);
  }

  function renderCompactList(ids, emptyText, isMarkedList) {
    const items = ids.map(getQuestionById).filter(Boolean);
    if (!items.length) return emptyHTML(emptyText);
    return items.map((item) => `<div class="list-item">
      <h4>${escapeHTML(item.title)}</h4>
      <p>${CATEGORY_LABELS[item.category]} · ${getQuestionStatus(item.id)}</p>
      <div class="button-row">
        <button class="card-action" type="button" data-open="${item.id}">重新阅读</button>
        <button class="card-action" type="button" data-remove-${isMarkedList ? "marked" : "review"}="${item.id}">${isMarkedList ? "取消标记" : "移出复看"}</button>
      </div>
    </div>`).join("");
  }

  function bindCompactList(root) {
    root.querySelectorAll("[data-open]").forEach((button) => {
      button.addEventListener("click", () => {
        state.modalQuestion = getQuestionById(button.dataset.open);
        renderQuestionCard(nodes.modalCard, state.modalQuestion, {
          source: "modal",
          onNext: openQuickModal,
          nextLabel: "随机一张"
        });
        nodes.quickModal.hidden = false;
      });
    });
    root.querySelectorAll("[data-remove-marked]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleInList("marked", button.dataset.removeMarked, false);
        renderAll();
      });
    });
    root.querySelectorAll("[data-remove-review]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleInList("review", button.dataset.removeReview, false);
        renderAll();
      });
    });
  }

  function renderStats() {
    const totalCompleted = getCompletedIds().size;
    const quality = getQuality(state.records);
    const streak = getStreak();
    const todayCount = getTodayCompletedIds().length;
    const cards = [
      ["总完成", `${totalCompleted}`],
      ["记录质量", `${quality}%`],
      ["连续天数", `${streak}`],
      ["今日完成", `${Math.min(todayCount, state.settings.dailyTarget)}/${state.settings.dailyTarget}`]
    ];
    nodes.statsGrid.innerHTML = cards.map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`).join("");

    nodes.categoryStats.innerHTML = ["language", "logic", "data", "common", "basic"].map((category) => {
      const records = state.records.filter((record) => record.category === category);
      const value = getQuality(records);
      const countText = records.length ? `${records.length} 次记录` : "暂无记录";
      return `<div class="bar-row">
        <div class="bar-label"><span>${CATEGORY_LABELS[category]}</span><span>${value}% · ${countText}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div>
      </div>`;
    }).join("");
  }

  function renderQuestionCard(container, question, options) {
    if (!question) {
      container.innerHTML = emptyHTML("暂无可用材料。");
      return;
    }
    const latest = getLatestRecord(question.id);
    const status = getQuestionStatus(question.id);
    const marked = state.marked.includes(question.id);
    const inReview = state.review.includes(question.id);
    const selected = latest ? latest.selected : "";
    const isAnswered = Boolean(latest);
    const feedbackTitle = latest ? (latest.correct ? "已记录" : "需要复看") : "";
    const feedbackText = latest ? (latest.correct ? "选择已保存到本地阅读记录。" : `参考项 ${question.answer}。${question.explanation}`) : "";

    container.innerHTML = `<div class="card-meta">
      <span class="category-tag">${CATEGORY_LABELS[question.category]}</span>
      <span class="status-tag">${status}</span>
    </div>
    <h3 class="card-title">${escapeHTML(question.title)}</h3>
    <p class="card-stem">${escapeHTML(question.stem)}</p>
    <div class="options-grid">
      ${["A", "B", "C", "D"].map((key) => {
        const isSelected = selected === key;
        const isReference = isAnswered && !latest.correct && question.answer === key;
        const className = ["option-button", isSelected ? "selected" : "", isSelected && latest.correct ? "correct" : "", isSelected && !latest.correct ? "review" : "", isReference ? "reference" : ""].filter(Boolean).join(" ");
        return `<button class="${className}" type="button" data-option="${key}">
          <span class="option-key">${key}</span>
          <span>${escapeHTML(question.options[key])}</span>
        </button>`;
      }).join("")}
    </div>
    <div class="feedback-box ${latest ? "show" : ""}">
      <strong>${feedbackTitle}</strong>
      <span>${escapeHTML(feedbackText)}</span>
    </div>
    <div class="card-actions">
      <button class="card-action" type="button" data-toggle-marked>${marked ? "取消标记" : "标记"}</button>
      <button class="card-action" type="button" data-toggle-review>${inReview ? "移出复看" : "加入复看"}</button>
      <button class="primary-button" type="button" data-next>${options.nextLabel || "下一张"}</button>
    </div>`;

    container.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => answerQuestion(question, button.dataset.option));
    });
    container.querySelector("[data-toggle-marked]").addEventListener("click", () => {
      toggleInList("marked", question.id);
      renderAll();
      if (options.source === "modal") renderModalCard();
    });
    container.querySelector("[data-toggle-review]").addEventListener("click", () => {
      toggleInList("review", question.id);
      renderAll();
      if (options.source === "modal") renderModalCard();
    });
    container.querySelector("[data-next]").addEventListener("click", options.onNext);
  }

  function answerQuestion(question, selected) {
    const record = {
      questionId: question.id,
      selected,
      correct: selected === question.answer,
      answeredAt: new Date().toISOString(),
      category: question.category
    };
    state.records.push(record);
    writeJSON(KEYS.records, state.records);
    saveDailyRecord(question.id);
    if (!record.correct) toggleInList("review", question.id, true);
    localStorage.setItem(KEYS.lastActiveDate, getLocalDateKey());
    renderAll();
    if (!nodes.quickModal.hidden) renderModalCard();
  }

  function saveDailyRecord(questionId) {
    const dateKey = getLocalDateKey();
    const list = state.daily[dateKey] || [];
    if (!list.includes(questionId)) list.push(questionId);
    state.daily[dateKey] = list;
    writeJSON(KEYS.daily, state.daily);
  }

  function toggleInList(name, id, force) {
    const list = state[name];
    const exists = list.includes(id);
    if (force === true && !exists) list.push(id);
    if (force === false && exists) list.splice(list.indexOf(id), 1);
    if (force === undefined) {
      exists ? list.splice(list.indexOf(id), 1) : list.push(id);
    }
    writeJSON(KEYS[name], list);
  }

  function getQuickPool() {
    const category = nodes.quickCategory.value || "all";
    return state.questions.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (nodes.filterUnfinished.checked && getLatestRecord(item.id)) return false;
      if (nodes.filterReview.checked && !state.review.includes(item.id)) return false;
      if (nodes.filterMarked.checked && !state.marked.includes(item.id)) return false;
      return true;
    });
  }

  function openQuickModal() {
    state.modalQuestion = pickRandomQuestion(state.questions, state.modalQuestion && state.modalQuestion.id);
    renderModalCard();
    nodes.quickModal.hidden = false;
  }

  function renderModalCard() {
    renderQuestionCard(nodes.modalCard, state.modalQuestion, {
      source: "modal",
      onNext: openQuickModal,
      nextLabel: "随机一张"
    });
  }

  function closeQuickModal() {
    nodes.quickModal.hidden = true;
  }

  function importQuestions() {
    const file = nodes.importFile.files[0];
    if (!file) {
      showSettingsMessage("请先选择 JSON 文件。");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const validated = validateImport(parsed);
        const map = new Map(state.importedQuestions.map((item) => [item.id, item]));
        validated.forEach((item) => map.set(item.id, item));
        state.importedQuestions = Array.from(map.values());
        writeJSON(KEYS.importedQuestions, state.importedQuestions);
        mergeQuestions();
        state.dailyIds = getDailyIds();
        showSettingsMessage(`导入完成：${validated.length} 条资料已保存。`);
        renderAll();
      } catch (error) {
        showSettingsMessage(error.message || "导入失败：文件格式不符合要求。");
      }
    };
    reader.onerror = () => showSettingsMessage("导入失败：文件格式不符合要求。");
    reader.readAsText(file);
  }

  function validateImport(value) {
    if (!Array.isArray(value)) throw new Error("导入失败：文件格式不符合要求。");
    const required = ["id", "category", "title", "stem", "options", "answer", "explanation"];
    const categories = ["language", "logic", "data", "common", "basic"];
    return value.map((item) => {
      const missing = required.some((key) => !Object.prototype.hasOwnProperty.call(item, key));
      if (missing || typeof item.options !== "object" || item.options === null) {
        throw new Error("导入失败：部分资料缺少必要字段。");
      }
      const hasOptions = ["A", "B", "C", "D"].every((key) => typeof item.options[key] === "string");
      if (!hasOptions || !["A", "B", "C", "D"].includes(item.answer) || !categories.includes(item.category)) {
        throw new Error("导入失败：文件格式不符合要求。");
      }
      return {
        id: String(item.id),
        category: item.category,
        title: String(item.title),
        stem: String(item.stem),
        options: {
          A: String(item.options.A),
          B: String(item.options.B),
          C: String(item.options.C),
          D: String(item.options.D)
        },
        answer: item.answer,
        explanation: String(item.explanation),
        difficulty: item.difficulty ? String(item.difficulty) : "easy"
      };
    });
  }

  function exportRecords() {
    const hasData = state.records.length || state.marked.length || state.review.length || Object.keys(state.daily).length;
    if (!hasData) {
      showSettingsMessage("没有可导出的记录。");
      return;
    }
    const payload = {
      exportedAt: new Date().toISOString(),
      records: state.records,
      marked: state.marked,
      review: state.review,
      daily: state.daily,
      settings: state.settings
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiet-study-records-${getLocalDateKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showSettingsMessage("导出记录已生成。");
  }

  function resetLocalRecords() {
    const confirmed = window.confirm("将清空当前浏览器中的本地记录，不会删除内置资料。是否继续？");
    if (!confirmed) return;
    state.records = [];
    state.marked = [];
    state.review = [];
    state.daily = {};
    [KEYS.records, KEYS.marked, KEYS.review, KEYS.daily].forEach((key) => localStorage.removeItem(key));
    showSettingsMessage("本地记录已清空。");
    renderAll();
  }

  function handleKeydown(event) {
    if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
    if (event.key === "Escape" && !nodes.quickModal.hidden) {
      closeQuickModal();
      return;
    }
    const optionMap = { "1": "A", "2": "B", "3": "C", "4": "D" };
    if (optionMap[event.key]) {
      const question = getCurrentQuestion();
      if (question) answerQuestion(question, optionMap[event.key]);
    }
    if (event.key.toLowerCase() === "n") {
      const button = getActiveCard().querySelector("[data-next]");
      if (button) button.click();
    }
    if (event.key.toLowerCase() === "m") {
      const question = getCurrentQuestion();
      if (question) {
        toggleInList("marked", question.id);
        renderAll();
        if (!nodes.quickModal.hidden) renderModalCard();
      }
    }
  }

  function getCurrentQuestion() {
    if (!nodes.quickModal.hidden) return state.modalQuestion;
    if (state.view === "daily") return getQuestionById(state.dailyIds[state.dailyIndex]);
    if (state.view === "quick") return state.quickQuestion;
    if (state.view === "archive") return getQuestionById(state.archiveSelectedId);
    return null;
  }

  function getActiveCard() {
    if (!nodes.quickModal.hidden) return nodes.modalCard;
    if (state.view === "daily") return nodes.dailyCard;
    if (state.view === "quick") return nodes.quickCard;
    return nodes.archiveDetail;
  }

  function applySettings() {
    document.body.classList.toggle("dark", state.settings.theme === "dark");
    document.body.classList.toggle("minimal", state.settings.minimalMode);
    nodes.themeToggle.checked = state.settings.theme === "dark";
    nodes.minimalModeSetting.checked = state.settings.minimalMode;
    nodes.minimalToggle.textContent = state.settings.minimalMode ? "退出极简" : "极简模式";
  }

  function saveSettings() {
    writeJSON(KEYS.settings, state.settings);
  }

  function getDailyIds() {
    const sorted = [...state.questions].sort((a, b) => a.id.localeCompare(b.id));
    const seed = Number(getLocalDateKey().replace(/-/g, ""));
    const offset = sorted.length ? seed % sorted.length : 0;
    const rotated = sorted.slice(offset).concat(sorted.slice(0, offset));
    return rotated.slice(0, state.settings.dailyTarget).map((item) => item.id);
  }

  function getTodayCompletedIds() {
    return state.daily[getLocalDateKey()] || [];
  }

  function getCompletedIds() {
    return new Set(state.records.map((record) => record.questionId));
  }

  function getLatestRecord(id) {
    for (let index = state.records.length - 1; index >= 0; index -= 1) {
      if (state.records[index].questionId === id) return state.records[index];
    }
    return null;
  }

  function getQuestionStatus(id) {
    if (state.review.includes(id)) return "需要复看";
    if (state.marked.includes(id)) return "已标记";
    if (getLatestRecord(id)) return "已记录";
    return "未完成";
  }

  function getQuestionById(id) {
    return state.questions.find((item) => item.id === id);
  }

  function getQuality(records) {
    if (!records.length) return 0;
    const correct = records.filter((record) => record.correct).length;
    return Math.round((correct / records.length) * 100);
  }

  function getStreak() {
    const dates = Array.from(new Set(state.records.map((record) => record.answeredAt.slice(0, 10))));
    if (!dates.length) return 0;
    const set = new Set(dates);
    let count = 0;
    let cursor = new Date(`${getLocalDateKey()}T00:00:00`);
    while (set.has(formatDate(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function pickRandomQuestion(list, avoidId) {
    if (!list.length) return null;
    const pool = list.length > 1 ? list.filter((item) => item.id !== avoidId) : list;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getLocalDateKey() {
    return formatDate(new Date());
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      "\"": "&quot;"
    }[char]));
  }

  function emptyHTML(text) {
    return `<div class="empty-state">${escapeHTML(text)}</div>`;
  }

  function showSettingsMessage(message) {
    nodes.settingsMessage.textContent = message;
  }
}());
