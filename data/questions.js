const QUESTION_BANK = [
  {
    id: "q001",
    category: "language",
    title: "材料理解 001",
    stem: "有研究者认为，清晰的笔记并不一定越长越好。真正有帮助的记录往往能留下关键判断、背景线索和后续行动。以下哪项最符合这段文字的重点？",
    options: {
      A: "笔记应强调关键内容与行动线索",
      B: "笔记越详细越能提升效率",
      C: "记录背景信息没有实际意义",
      D: "所有笔记都应采用同一模板"
    },
    answer: "A",
    explanation: "材料强调有帮助的记录在于关键判断、背景线索和后续行动，而不是篇幅长短。",
    difficulty: "easy"
  },
  {
    id: "q002",
    category: "language",
    title: "材料理解 002",
    stem: "一项流程改进若只关注速度，可能会牺牲稳定性；若只关注稳定性，又可能压低响应效率。因此，成熟的流程管理需要在两者之间建立动态平衡。最适合作为这段文字标题的是：",
    options: {
      A: "速度是流程优化的唯一指标",
      B: "流程管理需要兼顾效率与稳定",
      C: "稳定性会阻碍组织发展",
      D: "流程越复杂越容易成功"
    },
    answer: "B",
    explanation: "文段围绕速度与稳定性的关系展开，核心观点是建立动态平衡。",
    difficulty: "easy"
  },
  {
    id: "q003",
    category: "language",
    title: "材料理解 003",
    stem: "许多工具在刚出现时会被过度关注，但真正决定其价值的，往往不是新奇程度，而是能否长期解决具体问题。下列理解正确的是：",
    options: {
      A: "新工具都不值得尝试",
      B: "工具价值取决于持续解决问题的能力",
      C: "新奇程度比实用性更重要",
      D: "所有问题都能通过工具解决"
    },
    answer: "B",
    explanation: "材料明确指出决定工具价值的是长期解决具体问题的能力。",
    difficulty: "easy"
  },
  {
    id: "q004",
    category: "language",
    title: "材料理解 004",
    stem: "在信息过载环境中，筛选能力比收集能力更稀缺。因为未经筛选的信息越多，越容易稀释注意力，并增加决策成本。文段意在说明：",
    options: {
      A: "信息越多决策越准确",
      B: "筛选信息有助于降低注意力负担",
      C: "收集信息没有任何价值",
      D: "决策成本与信息无关"
    },
    answer: "B",
    explanation: "文段强调筛选能力的重要性，原因在于减少注意力稀释和决策成本。",
    difficulty: "easy"
  },
  {
    id: "q005",
    category: "language",
    title: "材料理解 005",
    stem: "团队沟通中，最容易被忽略的不是表达观点，而是确认对方是否真正理解了观点。缺少确认环节，信息看似传达，执行却可能偏离。以下最符合文意的是：",
    options: {
      A: "沟通只需表达充分",
      B: "确认理解是有效沟通的重要环节",
      C: "执行偏离只与能力有关",
      D: "观点越多沟通越有效"
    },
    answer: "B",
    explanation: "材料指出沟通中需要确认对方理解，否则执行可能偏离。",
    difficulty: "easy"
  },
  {
    id: "q006",
    category: "language",
    title: "材料理解 006",
    stem: "长期计划的意义，不在于精确预测每一个结果，而在于帮助人们在变化中保持方向感。根据这句话，长期计划更强调：",
    options: {
      A: "完全消除变化",
      B: "准确预测所有细节",
      C: "提供持续的方向参考",
      D: "避免调整原有安排"
    },
    answer: "C",
    explanation: "文段明确说长期计划帮助人在变化中保持方向感。",
    difficulty: "easy"
  },
  {
    id: "q007",
    category: "logic",
    title: "关系判断 001",
    stem: "所有需要归档的材料都应编号；部分蓝色标签材料需要归档。因此，可以推出：",
    options: {
      A: "所有蓝色标签材料都应编号",
      B: "部分蓝色标签材料应编号",
      C: "不需要归档的材料都不用编号",
      D: "所有编号材料都是蓝色标签材料"
    },
    answer: "B",
    explanation: "部分蓝色标签材料需要归档，而所有需要归档的材料都应编号，所以部分蓝色标签材料应编号。",
    difficulty: "easy"
  },
  {
    id: "q008",
    category: "logic",
    title: "关系判断 002",
    stem: "如果资料已复核，则可以发布。某份资料不能发布。若前提为真，可以推出：",
    options: {
      A: "这份资料已复核",
      B: "这份资料未复核",
      C: "所有资料都不能发布",
      D: "未复核资料一定可以发布"
    },
    answer: "B",
    explanation: "这是充分条件推理的逆否命题：已复核则可发布，不能发布则未复核。",
    difficulty: "easy"
  },
  {
    id: "q009",
    category: "logic",
    title: "关系判断 003",
    stem: "甲、乙、丙三人分别负责整理、校对、归档三项任务。甲不负责整理，乙不负责校对，丙不负责归档。若乙负责整理，则丙负责：",
    options: {
      A: "整理",
      B: "校对",
      C: "归档",
      D: "无法确定"
    },
    answer: "B",
    explanation: "乙负责整理后，剩余校对和归档。丙不负责归档，因此丙负责校对。",
    difficulty: "easy"
  },
  {
    id: "q010",
    category: "logic",
    title: "关系判断 004",
    stem: "某资料室有三类文件：电子稿、纸质稿、影印稿。已知所有电子稿都可检索，部分纸质稿可检索，所有影印稿都不可检索。下列一定为真的是：",
    options: {
      A: "可检索文件都是电子稿",
      B: "部分纸质稿可检索",
      C: "影印稿可能可检索",
      D: "纸质稿都不可检索"
    },
    answer: "B",
    explanation: "题干直接给出部分纸质稿可检索，其他选项均无法必然推出或与题干矛盾。",
    difficulty: "easy"
  },
  {
    id: "q011",
    category: "logic",
    title: "关系判断 005",
    stem: "若上午有例会，则下午整理纪要；若下午整理纪要，则晚上更新归档。今天晚上没有更新归档。可以推出：",
    options: {
      A: "上午有例会",
      B: "上午没有例会",
      C: "下午整理了纪要",
      D: "明天一定有例会"
    },
    answer: "B",
    explanation: "连续条件可得上午有例会则晚上更新归档。晚上没有更新归档，因此上午没有例会。",
    difficulty: "medium"
  },
  {
    id: "q012",
    category: "logic",
    title: "关系判断 006",
    stem: "某书架上 A、B、C 三本资料从左到右排列。A 不在最左边，B 不在最右边，C 不在中间。则从左到右的顺序是：",
    options: {
      A: "A-B-C",
      B: "B-A-C",
      C: "C-A-B",
      D: "B-C-A"
    },
    answer: "B",
    explanation: "C 不在中间，若 C 在左，则 B 不能在右，剩余无法满足；所以 C 在右，B 在左，A 在中间。",
    difficulty: "medium"
  },
  {
    id: "q013",
    category: "data",
    title: "数据材料 001",
    stem: "某小组周一至周五分别整理 8、10、12、10、15 份材料。本周平均每天整理多少份？",
    options: {
      A: "10",
      B: "11",
      C: "12",
      D: "13"
    },
    answer: "B",
    explanation: "总数为 8+10+12+10+15=55，平均每天 55÷5=11。",
    difficulty: "easy"
  },
  {
    id: "q014",
    category: "data",
    title: "数据材料 002",
    stem: "某资料库上月有 200 条记录，本月增加到 250 条。本月较上月增长了多少？",
    options: {
      A: "20%",
      B: "25%",
      C: "30%",
      D: "35%"
    },
    answer: "B",
    explanation: "增长量为 50，50÷200=25%。",
    difficulty: "easy"
  },
  {
    id: "q015",
    category: "data",
    title: "数据材料 003",
    stem: "一份清单中，已处理 36 项，占全部事项的 60%。全部事项共有多少项？",
    options: {
      A: "54",
      B: "60",
      C: "66",
      D: "72"
    },
    answer: "B",
    explanation: "全部事项为 36÷60%=60。",
    difficulty: "easy"
  },
  {
    id: "q016",
    category: "data",
    title: "数据材料 004",
    stem: "某月第一周访问量为 1200，第二周为 1500。第二周比第一周多多少？",
    options: {
      A: "200",
      B: "250",
      C: "300",
      D: "350"
    },
    answer: "C",
    explanation: "1500-1200=300。",
    difficulty: "easy"
  },
  {
    id: "q017",
    category: "data",
    title: "数据材料 005",
    stem: "A 类材料 40 份，B 类材料 60 份。A 类占两类总数的比例为：",
    options: {
      A: "30%",
      B: "40%",
      C: "50%",
      D: "60%"
    },
    answer: "B",
    explanation: "总数为 100，A 类占 40÷100=40%。",
    difficulty: "easy"
  },
  {
    id: "q018",
    category: "data",
    title: "数据材料 006",
    stem: "某项目计划 10 天完成，实际 8 天完成。实际用时比计划减少了：",
    options: {
      A: "10%",
      B: "20%",
      C: "25%",
      D: "30%"
    },
    answer: "B",
    explanation: "减少 2 天，2÷10=20%。",
    difficulty: "easy"
  },
  {
    id: "q019",
    category: "common",
    title: "通用材料 001",
    stem: "会议纪要通常不包括以下哪项内容？",
    options: {
      A: "会议时间",
      B: "主要结论",
      C: "后续行动",
      D: "个人无关日记"
    },
    answer: "D",
    explanation: "会议纪要应记录与会议相关的信息，个人无关日记不属于纪要内容。",
    difficulty: "easy"
  },
  {
    id: "q020",
    category: "common",
    title: "通用材料 002",
    stem: "下列做法最有利于保护个人浏览数据的是：",
    options: {
      A: "随意安装未知插件",
      B: "定期检查隐私设置",
      C: "共享所有账号密码",
      D: "关闭所有系统更新"
    },
    answer: "B",
    explanation: "定期检查隐私设置有助于减少不必要的数据暴露。",
    difficulty: "easy"
  },
  {
    id: "q021",
    category: "common",
    title: "通用材料 003",
    stem: "在公共场合使用无线网络时，较稳妥的做法是：",
    options: {
      A: "处理敏感账户操作",
      B: "连接来源不明的热点",
      C: "避免传输重要敏感信息",
      D: "关闭设备安全功能"
    },
    answer: "C",
    explanation: "公共无线网络存在风险，应避免传输重要敏感信息。",
    difficulty: "easy"
  },
  {
    id: "q022",
    category: "common",
    title: "通用材料 004",
    stem: "下列哪项属于良好的文件命名习惯？",
    options: {
      A: "新建文档最终最终版2",
      B: "2026-06-项目纪要-v1",
      C: "随便起名",
      D: "只使用空格"
    },
    answer: "B",
    explanation: "包含日期、主题和版本的信息更便于检索和管理。",
    difficulty: "easy"
  },
  {
    id: "q023",
    category: "common",
    title: "通用材料 005",
    stem: "当多个任务同时出现时，较合理的第一步是：",
    options: {
      A: "全部同时开始",
      B: "先判断轻重缓急",
      C: "只处理最容易的任务",
      D: "等待任务自行消失"
    },
    answer: "B",
    explanation: "任务并发时先判断优先级，有助于合理分配时间和注意力。",
    difficulty: "easy"
  },
  {
    id: "q024",
    category: "common",
    title: "通用材料 006",
    stem: "撰写说明文档时，最应避免的是：",
    options: {
      A: "结构清晰",
      B: "术语前后一致",
      C: "关键步骤可复现",
      D: "故意省略必要条件"
    },
    answer: "D",
    explanation: "说明文档应帮助读者理解和复现，故意省略必要条件会降低可用性。",
    difficulty: "easy"
  },
  {
    id: "q025",
    category: "basic",
    title: "基础资料 001",
    stem: "某制度文件通常由标题、正文和落款等部分构成。标题的主要作用是：",
    options: {
      A: "概括文件主题",
      B: "替代正文内容",
      C: "隐藏发布主体",
      D: "记录个人感受"
    },
    answer: "A",
    explanation: "标题主要用于概括文件主题，帮助读者快速识别内容。",
    difficulty: "easy"
  },
  {
    id: "q026",
    category: "basic",
    title: "基础资料 002",
    stem: "在资料整理中，建立统一编码规则的主要目的是什么？",
    options: {
      A: "增加查找难度",
      B: "便于分类、检索和维护",
      C: "减少内容准确性",
      D: "让文件无法共享"
    },
    answer: "B",
    explanation: "统一编码能提升分类、检索和后续维护效率。",
    difficulty: "easy"
  },
  {
    id: "q027",
    category: "basic",
    title: "基础资料 003",
    stem: "下列哪项更适合作为正式通知的语言风格？",
    options: {
      A: "随意口语化",
      B: "准确、简洁、明确",
      C: "大量使用夸张语气",
      D: "故意模糊重点"
    },
    answer: "B",
    explanation: "正式通知强调准确、简洁和明确。",
    difficulty: "easy"
  },
  {
    id: "q028",
    category: "basic",
    title: "基础资料 004",
    stem: "需要多人协作维护的文档，较好的做法是：",
    options: {
      A: "不记录修改来源",
      B: "保留版本和变更说明",
      C: "随意覆盖他人内容",
      D: "禁止任何反馈"
    },
    answer: "B",
    explanation: "版本和变更说明有助于协作追踪与质量控制。",
    difficulty: "easy"
  },
  {
    id: "q029",
    category: "basic",
    title: "基础资料 005",
    stem: "归纳一段资料时，以下哪项最重要？",
    options: {
      A: "抓住核心观点",
      B: "逐字重复全部内容",
      C: "删除所有背景",
      D: "加入无关信息"
    },
    answer: "A",
    explanation: "归纳重在提炼核心观点，而不是机械重复或加入无关信息。",
    difficulty: "easy"
  },
  {
    id: "q030",
    category: "basic",
    title: "基础资料 006",
    stem: "当资料来源存在差异时，较稳妥的处理方式是：",
    options: {
      A: "只选择最先看到的内容",
      B: "记录来源并进行交叉核对",
      C: "忽略所有来源信息",
      D: "直接删除全部材料"
    },
    answer: "B",
    explanation: "记录来源并交叉核对能提高资料可靠性。",
    difficulty: "medium"
  }
];
