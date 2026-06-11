// Thinkers Catalog mapped by category-driven keys
const THINKERS_CATALOG = {
  "creative_jobs": {
    category: "creative",
    title: "Steve Jobs",
    koreanTitle: "창의사고 (Steve Jobs)",
    tagline: "서로 다른 분야를 연결하여 세상에 없던 새로운 가치를 만듭니다.",
    desc: "기술과 인문학의 교차점에서 예술적인 직관과 과학적 이성을 결합해 세상을 바꾸는 혁신을 창조합니다.",
    imgPosY: "20%",
    steps: [
      { num: "01", title: "도메인 해체", desc: "분석하고자 하는 핵심 아이디어와 완전히 무관한 분야를 선정하세요." },
      { num: "02", title: "본질적 특성 연결", desc: "선택한 두 분야의 고유한 장점과 본질을 나열한 뒤 교차시켜 보세요." },
      { num: "03", title: "창조적 융합", desc: "다르게 생각하기(Think Different)의 시선으로 새로운 인터페이스나 가치를 제안하세요." }
    ]
  },
  "creative_chanel": {
    category: "creative",
    title: "Coco Chanel",
    koreanTitle: "창의사고 (Coco Chanel)",
    tagline: "불편하고 관습적인 형식을 걷어내고 움직임의 자유를 디자인합니다.",
    desc: "여성을 코르셋에서 해방시키고 실용성과 우아함을 동시에 갖춘 현대적인 스타일의 시대를 열었습니다.",
    imgPosY: "15%",
    steps: [
      { num: "01", title: "고정관념 발견", desc: "사회가 당연시하는 불편하고 거추장스러운 관습을 식별하세요." },
      { num: "02", title: "본질과 단순화", desc: "장식적인 요소를 배제하고 기능과 활동성에 맞춘 본질만 남기세요." },
      { num: "03", title: "독립적 가치 제안", desc: "남의 시선이 아닌 스스로 당당하고 편안한 새로운 표준을 정의하세요." }
    ]
  },
  "logic_turing": {
    category: "logic",
    title: "Alan Turing",
    koreanTitle: "논리사고 (Alan Turing)",
    tagline: "복잡한 연산과 사고의 과정을 명확한 규칙과 기계적 절차로 공식화합니다.",
    desc: "인간의 인지 과정을 기계적 상태 전이로 단순화하여 컴퓨터의 사상적 초석을 다지고 난제를 해결합니다.",
    imgPosY: "25%",
    steps: [
      { num: "01", title: "상태와 기호 정의", desc: "당면한 문제를 처리 가능한 가장 단순한 상태와 기호로 쪼개어 나타내세요." },
      { num: "02", title: "상태 전이 규칙 설계", desc: "입력 값에 따라 상태가 어떻게 변해야 하는지 명확한 단계별 논리 규칙을 만드세요." },
      { num: "03", title: "한계와 검증", desc: "이 시스템이 멈추지 않고 영원히 돌 수 있는지, 혹은 해결 불가능한 지점이 어디인지 검증하세요." }
    ]
  },
  "meta_beauvoir": {
    category: "meta",
    title: "Simone de Beauvoir",
    koreanTitle: "메타인지 (Beauvoir)",
    tagline: "주어진 운명이나 타인의 시선에서 벗어나 주체로서 자신을 인식합니다.",
    desc: "사회가 규정한 굴레와 본질을 거부하고, 스스로 행동하고 선택하는 단독자로서의 자아를 성찰합니다.",
    imgPosY: "20%",
    steps: [
      { num: "01", title: "사회적 프레임 자각", desc: "타인이나 사회가 나에게 부여한 역할과 편견을 객관적으로 인식하세요." },
      { num: "02", title: "실존적 질문 던지기", desc: "'주어진 본질'을 걷어냈을 때 나에게 남는 주체적인 열망이 무엇인지 물으세요." },
      { num: "03", title: "자유와 책임의 기획", desc: "스스로 선택한 행동에 책임을 지며 자신만의 삶을 설계해 나가는 길을 그리세요." }
    ]
  },
  "critical_sagan": {
    category: "critical",
    title: "Carl Sagan",
    koreanTitle: "비판사고 (Sagan)",
    tagline: "우주를 향한 호기심과 과학적 합리성으로 큰 그림을 그립니다.",
    desc: "우주와 과학의 심오한 연결을 통해 인류적 시각을 넓힙니다.",
    imgPosY: "12%",
    imgScale: "190%",
    steps: [
      { num: "01", title: "우주적 관점", desc: "더 넓은 시간과 공간의 스케일로 문제를 재정의하세요." },
      { num: "02", title: "증거 기반 호기심", desc: "주장에 대해 실험적/관측적 근거를 요구하세요." },
      { num: "03", title: "대중적 설명", desc: "복잡한 개념을 명확하고 공감하게 전달하는 연습을 하세요." }
    ]
  },
  "empathy_mandela": {
    category: "empathy",
    title: "Nelson Mandela",
    koreanTitle: "공감사고 (Mandela)",
    tagline: "적대적 관계마저 포용하는 깊은 공감과 용서로 갈등의 뿌리를 치유합니다.",
    desc: "분노와 복수를 넘어 상대방의 상처와 두려움을 이해하고, 평화로운 공존을 위한 화해의 다리를 놓습니다.",
    imgPosY: "20%",
    steps: [
      { num: "01", title: "감정과 두려움 경청", desc: "상대방(혹은 반대 진영)이 느끼는 분노와 두려움의 진짜 원인을 들어보세요." },
      { num: "02", title: "공동의 기반 탐색", desc: "양측이 모두 공감할 수 있는 가장 인간적이고 보편적인 목표를 찾아내세요." },
      { num: "03", title: "용서와 통합의 연대", desc: "과거의 잘못을 심판하기보다 미래의 평화적 공존을 위한 협력 방안을 제시하세요." }
    ]
  },
  "creative_harakenya": {
    category: "creative",
    title: "Kenya Hara",
    koreanTitle: "창의사고 (Kenya Hara)",
    tagline: "비어 있음(Emptiness)을 디자인하여 사용자의 다양한 생각을 담습니다.",
    desc: "불필요한 가식을 버리고 백색의 여백(Emptiness)을 디자인함으로써, 무엇이든 수용하고 연결할 수 있는 궁극의 단순함을 창조합니다.",
    imgPosY: "15%",
    imgScale: "160%", // Increased zoom to focus on face
    steps: [
      { num: "01", title: "정보와 가식 비우기", desc: "보여주고자 하는 핵심 정보 외의 장식적인 요소를 철저히 비워내세요." },
      { num: "02", title: "여백의 수용력 설계", desc: "비워진 영역에 대중의 생각과 상상력이 머물고 어우러질 수 있게 설계하세요." },
      { num: "03", title: "단순함의 재정의", desc: "미니멀리즘을 넘어 다목적인 가치를 지닌 '비어있는 그릇'을 제시하세요." }
    ]
  },
  "creative_curie": {
    category: "creative",
    title: "Marie Curie",
    koreanTitle: "창의사고 (Curie)",
    tagline: "실험과 관찰을 통해 원소의 본질을 드러냅니다.",
    desc: "치밀한 실험과 집요한 관찰로 과학의 경계를 확장했습니다.",
    imgPosY: "15%",
    imgScale: "170%",
    steps: [
      { num: "01", title: "세부 관찰", desc: "작은 신호와 차이를 놓치지 마세요." },
      { num: "02", title: "엄격한 실험", desc: "반복 가능한 측정과 통제된 절차를 설계하세요." },
      { num: "03", title: "결과의 해석", desc: "데이터가 말하는 바를 정직하게 해석하세요." }
    ]
  },
  "creative_picasso": {
    category: "creative",
    title: "Pablo Picasso",
    koreanTitle: "창의사고 (Picasso)",
    tagline: "대상을 다각도에서 관찰하고 분해하여 고정관념 너머의 본질을 병치합니다.",
    desc: "입체주의 기법으로 사물을 한 시점이 아닌 여러 각도에서 동시에 해체하고 결합해 새로운 다차원적 현실을 제시합니다.",
    imgPosY: "70%", // Move further up for top-frame portrait
    imgScale: "170%", // Optimized zoom factor
    steps: [
      { num: "01", title: "다중 관점 해체", desc: "대상을 하나의 고정된 방향이 아니라 360도 모든 시점에서 쪼개어 관찰하세요." },
      { num: "02", title: "기하학적 파편화", desc: "해체한 대상에서 고유한 본질을 대변하는 핵심 선과 면의 파편들을 골라내세요." },
      { num: "03", title: "입체적 재합성", desc: "이 본질 파편들을 왜곡과 병치를 통해 한 도화지 위에 유기적으로 조립해 표현하세요." }
    ]
  },
  "creative_curie": {
    category: "creative",
    title: "Marie Curie",
    koreanTitle: "창의사고 (Curie)",
    tagline: "실험과 관찰을 통해 원소의 본질을 드러냅니다.",
    desc: "치밀한 실험과 집요한 관찰로 과학의 경계를 확장했습니다.",
    imgPosY: "28%",
    imgPosX: "35%",
    imgScale: "150%",
    steps: [
      { num: "01", title: "세부 관찰", desc: "작은 신호와 차이를 놓치지 마세요." },
      { num: "02", title: "엄격한 실험", desc: "반복 가능한 측정과 통제된 절차를 설계하세요." },
      { num: "03", title: "결과의 해석", desc: "데이터가 말하는 바를 정직하게 해석하세요." }
    ]
  },
  "empathy_mlk": {
    category: "empathy",
    title: "Martin Luther King",
    koreanTitle: "공감사고 (Martin Luther King)",
    tagline: "평등과 화해의 메시지로 사회적 공감과 연대를 촉진합니다.",
    desc: "비폭력과 연대로 사회적 불의에 맞서며 모두가 인간으로서 존엄하게 대우받는 세상을 지향합니다.",
    imgPosY: "45%",
    imgPosX: "50%",
    imgScale: "200%",
    steps: [
      { num: "01", title: "목소리로 연결", desc: "포용의 메시지를 명확하게 전할 수 있는 언어를 연습하세요." },
      { num: "02", title: "비폭력 실천", desc: "대화와 행동으로 갈등을 평화롭게 해결하는 방법을 모색하세요." },
      { num: "03", title: "연대 구축", desc: "공동체의 다양한 목소리를 모아 지속 가능한 변화를 설계하세요." }
    ]
  },
  "meta_cobain": {
    category: "meta",
    title: "Kurt Cobain",
    koreanTitle: "메타인지 (Cobain)",
    tagline: "내면의 불안을 음악으로 해석하는 독창적 직관을 가집니다.",
    desc: "강렬한 감성과 자기 성찰을 음악적으로 풀어내는 방식이 특징입니다.",
    imgPosY: "22%",
    imgPosX: "50%",
    imgScale: "110%",
    steps: [
      { num: "01", title: "내면 관찰", desc: "자신의 감정적 패턴과 반복되는 생각을 기록하세요." },
      { num: "02", title: "감성 해석", desc: "감정적 반응을 의미 구조로 전환해 보세요." },
      { num: "03", title: "표현과 이완", desc: "표현을 통해 내적 긴장을 외부로 해소하는 연습을 하세요." }
    ]
  },
  "empathy_tupac": {
    category: "empathy",
    title: "Tupac Shakur",
    koreanTitle: "공감사고 (Tupac)",
    tagline: "거리의 삶과 고난을 예리하게 공감하는 목소리를 냅니다.",
    desc: "현장의 이야기를 생생하게 전달하며 사회적 경험을 공감으로 전환합니다.",
    imgPosY: "35%",
    imgPosX: "50%",
    imgScale: "cover",
    steps: [
      { num: "01", title: "현장 감수성", desc: "사람들이 겪는 현실적 문제를 직접 듣고 기록하세요." },
      { num: "02", title: "공감적 서사", desc: "경험을 이야기로 풀어 공감의 연결을 만드세요." },
      { num: "03", title: "연대 실천", desc: "공감한 경험을 기반으로 작은 행동부터 실천해 보세요." }
    ]
  },
  "critical_popper": {
    category: "critical",
    title: "Karl Popper",
    koreanTitle: "비판사고 (Karl Popper)",
    tagline: "이론의 타당성을 증명하기보다, 그것을 반증할 오류를 적극적으로 찾습니다.",
    desc: "완벽해 보이는 지식이라도 반증 가능성을 열어두고 끊임없이 의심하며 참된 진리에 다가섭니다.",
    imgPosY: "20%",
    steps: [
      { num: "01", title: "가설의 명료화", desc: "확실하다고 믿는 가설이나 전제를 누구나 검증할 수 있게 구체적으로 적으세요." },
      { num: "02", title: "반증 조건 설정", desc: "이 가설이 '틀렸음'을 입증할 수 있는 단 하나의 예외 상황이나 증거를 기획하세요." },
      { num: "03", title: "열린 비판과 보완", desc: "동료들의 비판을 수용하고 오류를 수정해 가며 지식을 정교하게 다듬어 가세요." }
    ]
  },
  "logic_kant": {
    category: "logic",
    title: "Immanuel Kant",
    koreanTitle: "논리사고 (Kant)",
    tagline: "경험을 조직하는 이성의 보편적 형식과 한계를 철저히 규정합니다.",
    desc: "우리가 대상을 있는 그대로 아는 것이 아니라, 우리 이성의 틀을 통해 어떻게 인식하는지 탐구합니다.",
    imgPosY: "20%",
    steps: [
      { num: "01", title: "인식 도구 검토", desc: "대상을 판단할 때 작용하는 시공간적 조건이나 인지적 선입견을 파악하세요." },
      { num: "02", title: "도덕적 보편 법칙", desc: "나의 행동 원칙이 전 인류의 보편적 법칙이 될 수 있는지 자문하세요." },
      { num: "03", title: "한계 설정", desc: "인간 이성이 알 수 있는 영역과 알 수 없는 선험적 영역의 경계를 그으세요." }
    ]
  },
  "meta_socrates": {
    category: "meta",
    title: "Socrates",
    koreanTitle: "메타인지 (Socrates)",
    tagline: "자신의 무지를 자각하는 것에서부터 참된 지혜의 탐구를 시작합니다.",
    desc: "끊임없는 질문과 대화를 통해 상대방이 스스로 지닌 편견과 모순을 깨닫고 진리에 이르도록 돕습니다.",
    imgPosY: "15%",
    steps: [
      { num: "01", title: "무지의 고백", desc: "내가 이 개념(예: 정의, 선, 행복)에 대해 정말로 알고 있는지 질문해 보세요." },
      { num: "02", title: "산파술적 문답", desc: "당연하다고 생각했던 정의에 꼬리 질문을 던지며 논리적 허점을 찾아내세요." },
      { num: "03", title: "개념의 재정의", desc: "모순을 걸러내고 더 깊은 본질에 닿은 명확한 자신만의 개념을 세우세요." }
    ]
  }
  ,"meta_camus": {
    category: "meta",
    title: "Albert Camus",
    koreanTitle: "메타인지 (Camus)",
    tagline: "부조리와 실존을 날카롭게 성찰하는 사유를 전개합니다.",
    desc: "일상의 모순과 인간 존재의 부조리를 직시하고 타자와 세계를 성찰합니다.",
    imgPosY: "14%",
    imgPosX: "50%",
    imgScale: "140%",
    steps: [
      { num: "01", title: "부조리 인식", desc: "일상에 숨어있는 의미의 부조리를 찾아 기록하세요." },
      { num: "02", title: "자기-타자 성찰", desc: "나와 타자의 갈등 속에서 보이는 윤리적 선택을 분석하세요." },
      { num: "03", title: "의미의 재구성", desc: "부조리 속에서 작은 의미를 만들어내는 실천을 고안하세요." }
    ]
  }
};

// Default figure files to fall back on if dynamic scanning fails
const DEFAULT_FIGURES = [
  "creative_curie.webp",
  "creative_davinci.webp",
  "creative_edison.webp",
  "creative_einstein.webp",
  "creative_gogh.webp",
  "creative_tesla.webp",
  "creative_picasso.webp",
  "creative_dyson.webp",
  "creative_jobs.webp",
  "empathy_mandela.webp",
  "logic_turing.webp",
  "meta_beauvoir.webp",
  // Added by dev: allow user-uploaded critical thinker
  "critical_sagan.webp"
];

// Predefined spacing slots for the scattered state (18 unique slots, non-overlapping)
const SCATTER_SLOTS = [
  { left: "8%", top: "18%", scale: 0.8 },
  { left: "23%", top: "13%", scale: 1.05 },
  { left: "38%", top: "12%", scale: 0.9 },
  { left: "50%", top: "11%", scale: 1.0 },
  { left: "62%", top: "12%", scale: 0.95 },
  { left: "77%", top: "13%", scale: 1.1 },
  { left: "92%", top: "18%", scale: 0.85 },
  
  { left: "7%", top: "48%", scale: 1.0 },
  { left: "20%", top: "45%", scale: 0.9 },
  { left: "80%", top: "45%", scale: 1.05 },
  { left: "93%", top: "48%", scale: 0.95 },
  
  { left: "10%", top: "78%", scale: 1.1 },
  { left: "24%", top: "80%", scale: 0.85 },
  { left: "38%", top: "82%", scale: 1.0 },
  { left: "50%", top: "83%", scale: 0.9 },
  { left: "62%", top: "82%", scale: 1.05 },
  { left: "76%", top: "80%", scale: 0.95 },
  { left: "90%", top: "78%", scale: 1.15 }
];

let mentalModels = [];
let selectedModelIndex = 0;
let activeCardIndex = 0; // Tracks the card index (0 to 17) active at the top of the wheel
let logs = [];
let cards = [];
let carouselModelIndices = [];
let carouselTimer = null;
let cardEnterTimer = null; // 카드 클릭 → 회전 후 자동 진입 타이머
let modelNameTimer = null;
let pendingModelIndex = null;

// DOM Elements
const arcContainer = document.getElementById('arc-container');
const carouselModelName = document.getElementById('carousel-model-name');
const activeModelTitle = document.getElementById('active-model-title');
const activeModelDesc = document.getElementById('active-model-desc');
const btnEngageMind = document.getElementById('btn-engage-mind');

// Exercise Overlay Elements
const exerciseOverlay = document.getElementById('exercise-overlay');
const btnCloseExercise = document.getElementById('btn-close-exercise');
const exTitle = document.getElementById('ex-title');
const exSub = document.getElementById('ex-sub');
const exStepsContainer = document.getElementById('ex-steps-container');
const thinkingTextarea = document.getElementById('thinking-textarea');
const wordCountDisplay = document.getElementById('word-count');
const btnClearWorkspace = document.getElementById('btn-clear-workspace');
const btnSubmitThinking = document.getElementById('btn-submit-thinking');

// Logs Drawer Elements
const btnHeaderLogTrigger = document.getElementById('btn-header-log-trigger');
const btnHeaderLaunchTrigger = document.getElementById('btn-header-launch-trigger');
const appDrawer = document.getElementById('app-drawer');
const btnCloseDrawer = document.getElementById('btn-close-drawer');
const drawerContent = document.getElementById('drawer-content');
const toastNotification = document.getElementById('toast-notification');

// Scan and load figure files from the figures directory
async function getFigureFiles() {
  // Tier 1: Try fetching manifest.json with a cache buster query parameter
  try {
    const res = await fetch('figures/manifest.json?v=' + Date.now());
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (e) {
    console.warn("manifest.json fetch failed, trying HTML directory scan...", e);
  }

  // Tier 2: Try parsing HTML directory listing (works on most local development servers)
  try {
    const res = await fetch('figures/');
    if (res.ok) {
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      const files = links
        .map(a => a.getAttribute('href'))
        .filter(href => href && href.match(/\.(webp|png|jpe?g)$/i))
        .map(href => {
          const parts = href.split('/');
          return decodeURIComponent(parts[parts.length - 1]);
        });
      // Filter out hidden/system metadata files
      const cleanFiles = files.filter(f => !f.startsWith('.'));
      if (cleanFiles.length > 0) {
        return [...new Set(cleanFiles)];
      }
    }
  } catch (e) {
    console.warn("figures directory fetch failed, using default thinkers list...", e);
  }

  // Tier 3: Return hardcoded default figures
  return DEFAULT_FIGURES;
}

// Build the mentalModels database using scanned files and catalog mappings
function buildMentalModels(files) {
  const models = [];
  let index = 0;

  files.forEach(filename => {
    // Filename convention: category_name.extension
    const match = filename.match(/^([a-z]+)_(.+)\.(webp|png|jpe?g)$/i);
    if (!match) return;

    const categoryKey = match[1].toLowerCase();
    let rawName = match[2];
    // If rawName mistakenly contains an extra extension (e.g. 'sagan.webp'), strip it
    rawName = rawName.replace(/\.(webp|png|jpe?g)$/i, '');
    const key = `${categoryKey}_${rawName}`;

    // Clean name for display: replace dashes/underscores with spaces & capitalize
    const displayName = rawName
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const categoryTitleMap = {
      logic: "논리사고",
      creative: "창의사고",
      meta: "메타인지",
      empathy: "공감사고",
      critical: "비판사고"
    };
    const categoryTitle = categoryTitleMap[categoryKey] || "사고분석";

    let modelData = THINKERS_CATALOG[key];

    if (!modelData) {
      // Fallback data system for unknown thinker images added dynamically
      modelData = {
        category: categoryKey,
        title: displayName,
        koreanTitle: `${categoryTitle} (${displayName})`,
        tagline: `${displayName}의 독창적인 시선에서 사고방식을 확장합니다.`,
        desc: `${displayName}의 고유한 통찰 패턴을 분석하고 스스로의 질문 구조를 혁신해 보세요.`,
        imgPosY: "20%",
        steps: [
          { num: "01", title: "당연함 의심하기", desc: "이 모델이 다루는 영역에서 보편적으로 정답이라 믿어왔던 규칙을 비판적으로 파악하세요." },
          { num: "02", title: "본질 법칙 재결합", desc: "선입견을 제외한 본질 원리들을 나열하고 이들을 관점을 비틀어 재정립해 봅니다." },
          { num: "03", title: "혁신적 대안 구상", desc: "고정관념을 벗어난 단 하나의 새로운 설계 방향이나 아이디어를 글로 표현하세요." }
        ]
      };
    }

    models.push({
      id: index++,
      key: key,
      imageFile: filename,
      category: categoryKey,
      title: modelData.title,
      koreanTitle: modelData.koreanTitle,
      tagline: modelData.tagline,
      desc: modelData.desc,
      steps: modelData.steps,
      imgPosY: modelData.imgPosY || "20%"
    });
  });

  return models;
}

// Render dynamic card templates inside the arc-container DOM
function renderCards(files = DEFAULT_FIGURES) {
  if (!arcContainer) return;
  arcContainer.innerHTML = '';

  const STACK_POSITIONS = {
    creative: { left: "18%", top: "25%", title: "창의사고" },
    logic: { left: "82%", top: "25%", title: "논리사고" },
    meta: { left: "22%", top: "68%", title: "메타인지" },
    empathy: { left: "50%", top: "72%", title: "공감사고" },
    critical: { left: "78%", top: "68%", title: "비판사고" }
  };

  const categoryCounts = {};
  const totalSlots = 18; // 18 slots to form a complete 360-degree circle with excellent curvature spacing

  // Ensure we have files to choose from
  if (!files || files.length === 0) {
    files = DEFAULT_FIGURES.slice();
  }

  // Shuffle helper to build a non-repeating selection pool
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Build a pool large enough to provide unique files for each slot (minimizes repeats)
  let pool = shuffleArray(files.slice());
  while (pool.length < totalSlots) {
    pool = pool.concat(shuffleArray(files.slice()));
  }
  const selectedFiles = pool.slice(0, totalSlots);

  for (let i = 0; i < totalSlots; i++) {
    // Pick from the precomputed selection to avoid duplicate images
    const randomFile = selectedFiles[i];

    // Auto face-crop and zoom alignment based on the random image filename
    let imgScale = "cover";
    let imgPosY = "20%";
    let imgPosX = "center";
    let model = mentalModels[i % mentalModels.length]; // Fallback default
    let fileKey = null;

    const fileMatch = randomFile.match(/^([a-z]+)_(.+)\.(webp|png|jpe?g)$/i);
    if (fileMatch) {
      const categoryKey = fileMatch[1].toLowerCase();
      const rawName = fileMatch[2];
      const key = `${categoryKey}_${rawName}`;
      fileKey = key;
      
      // Look up matching catalog data for scale/crop coordinates
      const catalogData = THINKERS_CATALOG[key];
      if (catalogData) {
        imgScale = catalogData.imgScale || "cover";
        imgPosY = catalogData.imgPosY || "20%";
        imgPosX = catalogData.imgPosX || "center";
      }

      // Sync the card's metadata model with the random image to align text perfectly
      const matchedModel = mentalModels.find(m => m.key === key);
      if (matchedModel) {
        model = matchedModel;
      }
    }

    // Special-case flags for visual tuning
    const isTupac = (fileKey === 'empathy_tupac') || randomFile.includes('empathy_tupac');
    const isMLK = (fileKey === 'empathy_mlk') || randomFile.includes('empathy_mlk');

    // For Tupac: do NOT stretch vertically — extend only horizontally (preserve aspect ratio)
    // For MLK: prefer a tighter face crop like a passport/photo (more zoom, center Y)
    if (isMLK) {
      const catalogData = THINKERS_CATALOG[fileKey];
      imgScale = (catalogData && catalogData.imgScale) ? catalogData.imgScale : "180%";
      imgPosY = (catalogData && catalogData.imgPosY) ? catalogData.imgPosY : "40%";
      imgPosX = (catalogData && catalogData.imgPosX) ? catalogData.imgPosX : "50%";
    }

    // 1. Scatter variables
    const slot = SCATTER_SLOTS[i % SCATTER_SLOTS.length];
    const scatterDelay = `${i * 60}ms`;
    const gatherDelay = `${(totalSlots - 1 - i) * 60}ms`;

    // Randomize sticker-like rotation for scatter state (-12..12 deg)
    const scatterRotate = (Math.random() * 24 - 12).toFixed(2);
    // Small random pixel offsets to avoid perfectly aligned stickers
    const scatterOffsetX = Math.floor(Math.random() * 17 - 8) + 'px';
    const scatterOffsetY = Math.floor(Math.random() * 17 - 8) + 'px';

    // 2. Bobbing variables
    const floatDuration = `${5.5 + (i * 0.45) % 2.5}s`;
    const floatDelay = `${i * -0.8}s`;
    const floatAmplitude = `${-5 - (i * 1.5) % 5}px`;

    // 3. Stack variables
    const cat = model.category;
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = 0;
    }
    const indexInCat = categoryCounts[cat]++;
    const stackPos = STACK_POSITIONS[cat] || { left: "50%", top: "50%" };
    
    // Natural card overlapping angles
    const angles = [-3, 4, -1, 3, -2];
    const rotate = angles[indexInCat % angles.length];
    
    // Offset card stack positions
    const offsetX = `${indexInCat * 4}px`;
    const offsetY = `${indexInCat * -4}px`;

    const cardHTML = `
      <div class="wireframe-card" 
           data-model="${model.id}" 
           data-card-index="${i}"
           aria-label="${model.koreanTitle}"
           style="
             --scatter-left: ${slot.left};
             --scatter-top: ${slot.top};
             --scatter-scale: ${slot.scale};
             --scatter-delay: ${scatterDelay};
             --scatter-rotate: ${scatterRotate};
             --scatter-offset-x: ${scatterOffsetX};
             --scatter-offset-y: ${scatterOffsetY};
             --gather-delay: ${gatherDelay};
             --stack-left: ${stackPos.left};
             --stack-top: ${stackPos.top};
             --stack-rotate: ${rotate};
             --stack-offset-x: ${offsetX};
             --stack-offset-y: ${offsetY};
           "
      >
        <div class="card-inner" 
             style="
               --float-duration: ${floatDuration};
               --float-delay: ${floatDelay};
               --float-amplitude: ${floatAmplitude};
             "
        >
          <!-- Wireframe placeholder outline (윤곽) -->
          <div class="card-image-placeholder-outline">
            <div class="placeholder-diagonal-1"></div>
            <div class="placeholder-diagonal-2"></div>
          </div>
          <!-- Random figure image loaded behind the outline with auto-alignment variables -->
          <div class="card-image-bg" 
               style="
                 --bg-extend-url: url('figures/${randomFile}');
                 --bg-main-url: url('figures/${randomFile}');
                 background-image: var(--bg-extend-url, none), var(--bg-main-url, none);
                 --bg-extend-size: ${ isTupac ? '160% auto' : 'var(--img-scale, cover)'};
                 --bg-extend-pos: center center;
                 --img-scale: ${imgScale};
                 --img-pos-y: ${imgPosY};
                 --img-pos-x: ${imgPosX};
               "
          ></div>
        </div>
      </div>
    `;
    arcContainer.insertAdjacentHTML('beforeend', cardHTML);
  }

  // Render dynamic labels for stacks
  renderCategoryLabels(STACK_POSITIONS, categoryCounts);
}

function renderCategoryLabels(stackPositions, categoryCounts) {
  const container = document.getElementById('category-labels-container');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(stackPositions).forEach(cat => {
    const hasCards = categoryCounts[cat] > 0;
    if (!hasCards) return;

    const pos = stackPositions[cat];
    // Position sits offset below the 3:4 portrait card stack center (height is 240px, so +145px)
    const labelHTML = `
      <div class="category-stack-label has-cards" 
           data-category="${cat}"
           style="left: ${pos.left}; top: calc(${pos.top} + 145px);"
      >
        ${pos.title}
      </div>
    `;
    container.insertAdjacentHTML('beforeend', labelHTML);
  });
}

// Runtime refresh: re-scan figures and re-render cards without reattaching global listeners
async function refreshFigures() {
  try {
    const files = await getFigureFiles();
    mentalModels = buildMentalModels(files);
    renderCards(files);
    bindCards();
    // Reinitialize positions/layout without re-binding global listeners
    initCardPositions();
    updateCarouselLayout(activeCardIndex);
  } catch (e) {
    console.warn('refreshFigures failed', e);
  }
}

// Bind rendered card elements and setup indices
function bindCards() {
  cards = document.querySelectorAll('.wireframe-card');
  carouselModelIndices = [...cards].map(card => Number(card.dataset.model));
  
  // Clean default starting index if out of bounds
  if (mentalModels.length > 0) {
    if (selectedModelIndex >= mentalModels.length) {
      selectedModelIndex = Math.floor(mentalModels.length / 2);
    }
  }
}


/* =========================================
   Responsive Premium Arc Carousel
   ========================================= */

function updateCarouselLayout(activeCardIdx = activeCardIndex) {
  const visibleCards = cards.length;
  if (!visibleCards) return;

  // Normalize active index
  let centerIdx = Number(activeCardIdx) || 0;
  centerIdx = Math.max(0, Math.min(centerIdx, visibleCards - 1));

  if (window.innerWidth <= 768) {
    cards.forEach((card, idx) => {
      card.style.removeProperty('left');
      card.style.removeProperty('top');
      card.style.removeProperty('--card-scale');
      card.style.removeProperty('--card-rotate');
      card.style.removeProperty('--angle');
      card.style.removeProperty('--radius');
      card.style.removeProperty('--origin-y');
      card.style.removeProperty('z-index');
      card.classList.toggle('active', idx === centerIdx);
    });
    return;
  }

  const containerWidth = arcContainer.offsetWidth || window.innerWidth;
  const containerHeight = arcContainer.offsetHeight || window.innerHeight;

  const radius = Math.max(720, Math.min(820, containerWidth * 0.58));
  const peakY = Math.max(520, containerHeight * 0.38 + 280);

  const cardWidth = cards[0].offsetWidth || 180;
  const angularSpacing = 360 / visibleCards;

  // Update global active index
  activeCardIndex = centerIdx;

  cards.forEach((card, idx) => {
    let slotOffset = idx - centerIdx;
    if (slotOffset > visibleCards / 2) slotOffset -= visibleCards;
    if (slotOffset < -visibleCards / 2) slotOffset += visibleCards;

    const angle = slotOffset * angularSpacing;

    const prevAngle = parseFloat(card.style.getPropertyValue('--angle') || '0');
    const angleDiff = Math.abs(angle - prevAngle);

    if (angleDiff > angularSpacing * 1.5) {
      card.classList.add('no-transition');
    } else {
      card.classList.remove('no-transition');
    }

    const scale = 1.0;

    card.style.left = '50%';
    card.style.top = `${peakY}px`;
    card.style.setProperty('--angle', angle.toFixed(2));
    card.style.setProperty('--origin-y', `${radius + 120}px`);
    card.style.setProperty('--card-scale', scale);
    card.style.zIndex = 10 - Math.abs(slotOffset);

    card.classList.toggle('active', idx === centerIdx);

    if (angleDiff > angularSpacing * 1.5) {
      card.offsetHeight;
      window.setTimeout(() => {
        card.classList.remove('no-transition');
      }, 50);
    }
  });

  // Sync selected model id to the centered card (do not auto-update DOM text here)
  try {
    const centerCard = cards[centerIdx];
    if (centerCard) {
      const centerModelId = Number(centerCard.dataset.model);
      if (!isNaN(centerModelId)) {
        selectedModelIndex = centerModelId;
      }
    }
  } catch (e) {
    // keep prior selection on error
  }
}

function initCardPositions() {
  // Initialize the active card to the visual center of the rendered cards
  if (cards.length === 0) return;
  activeCardIndex = Math.floor(cards.length / 2);
  activeCardIndex = Math.max(0, Math.min(activeCardIndex, cards.length - 1));

  // Ensure selectedModelIndex matches the centered card's model id
  const centerCard = cards[activeCardIndex];
  selectedModelIndex = Number(centerCard.dataset.model);

  updateCarouselLayout(activeCardIndex);
  updateCarouselModelName(selectedModelIndex, false);
}

function rotateDial(modelIndex) {
  const targetCardIndex = findClosestCardWithModel(modelIndex);
  rotateDialToCard(targetCardIndex);
}

function rotateDialToCard(cardIndex) {
  if (cards.length === 0) return;
  activeCardIndex = (cardIndex + cards.length) % cards.length;
  const card = cards[activeCardIndex];
  const modelIndex = Number(card.dataset.model);
  selectedModelIndex = modelIndex;

  fadeUpdateContent(modelIndex);
  updateCarouselModelName(modelIndex);
  updateCarouselLayout(activeCardIndex);
}

function findClosestCardWithModel(modelIndex) {
  let closestIndex = activeCardIndex;
  let minDiff = Infinity;

  cards.forEach((card, idx) => {
    if (Number(card.dataset.model) === modelIndex) {
      let diff = idx - activeCardIndex;
      if (diff > cards.length / 2) diff -= cards.length;
      if (diff < -cards.length / 2) diff += cards.length;
      
      const absDiff = Math.abs(diff);
      if (absDiff < minDiff) {
        minDiff = absDiff;
        closestIndex = idx;
      }
    }
  });

  return closestIndex;
}

function updateCarouselModelName(modelIndex, animate = true) {
  if (!carouselModelName) return;

  // Safely resolve model by id (modelIndex is an id stored on cards)
  const model = mentalModels.find(m => Number(m.id) === Number(modelIndex));
  if (!model) return;
  const nextName = model.title;

  window.clearTimeout(modelNameTimer);

  // If caller wants no animation but an animation is in progress, queue the update
  if (!animate) {
    if (carouselModelName.classList.contains('is-changing')) {
      pendingModelIndex = modelIndex;
      return;
    }
    carouselModelName.textContent = nextName;
    carouselModelName.classList.remove('is-changing');
    return;
  }

  // Animated update. If another animated update is already running, replace pending.
  pendingModelIndex = null;
  carouselModelName.classList.add('is-changing');
  modelNameTimer = window.setTimeout(() => {
    carouselModelName.textContent = nextName;
    carouselModelName.classList.remove('is-changing');
    // If there is a queued update, run it after finishing this animation
    if (pendingModelIndex !== null) {
      const queued = pendingModelIndex;
      pendingModelIndex = null;
      updateCarouselModelName(queued, true);
    }
  }, 220);
}

function showNextCarouselModel() {
  rotateDialToCard(activeCardIndex + 1);
}

function startCarouselAutoplay() {
  stopCarouselAutoplay();
  carouselTimer = window.setInterval(showNextCarouselModel, 3500);
}

function stopCarouselAutoplay() {
  if (!carouselTimer) return;
  window.clearInterval(carouselTimer);
  carouselTimer = null;
}

function fadeUpdateContent(index) {
  if (!activeModelTitle || !activeModelDesc) return;
  const model = mentalModels.find(m => Number(m.id) === Number(index));
  if (!model) return;

  // Fade out
  activeModelTitle.style.opacity = 0;
  activeModelDesc.style.opacity = 0;

  setTimeout(() => {
    activeModelTitle.textContent = model.koreanTitle;
    activeModelDesc.textContent = model.tagline;

    // Fade in
    activeModelTitle.style.opacity = 1;
    activeModelDesc.style.opacity = 1;
  }, 250);
}

// --- 2. Interactive Background Floating Blobs ---
function initBackgroundInteractions() {
  const blob1 = document.getElementById('blob-1');
  const blob2 = document.getElementById('blob-2');
  const blob3 = document.getElementById('blob-3');

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Scale mouse coordinates relative to viewport size
    const moveX = (mouseX / window.innerWidth - 0.5) * 45; // max 45px shift
    const moveY = (mouseY / window.innerHeight - 0.5) * 45;

    // Apply smooth transform to blobs
    if (blob1) blob1.style.transform = `translate(${moveX}px, ${moveY}px)`;
    if (blob2) blob2.style.transform = `translate(${-moveX * 1.2}px, ${-moveY * 1.2}px)`;
    if (blob3) blob3.style.transform = `translate(${moveY * 0.8}px, ${moveX * 0.8}px)`;
  });
}

// --- 3. Thought Expansion Exercise Workspace ---
function openExerciseWorkspace(index) {
  const model = mentalModels.find(m => Number(m.id) === Number(index));
  if (!model) return;
  exTitle.textContent = model.koreanTitle;
  exSub.textContent = model.tagline;

  // Render step guidelines
  exStepsContainer.innerHTML = '';
  model.steps.forEach(step => {
    const stepMarkup = `
      <div class="step-item">
        <div class="step-num">${step.num}</div>
        <div class="step-content">
          <h4>${step.title}</h4>
          <p>${step.desc}</p>
        </div>
      </div>
    `;
    exStepsContainer.insertAdjacentHTML('beforeend', stepMarkup);
  });

  // Initialize workspace
  thinkingTextarea.value = '';
  thinkingTextarea.placeholder = `여기에 [${model.title}] 트레이닝으로 떠오른 생각을 그대로 기록해 보세요.\n\n정답보다 과정이 중요합니다. 1단계부터 차근차근, 사고의 근육이 단련되는 순간을 남겨주세요.`;
  updateWordCount();

  // Open modal overlay
  exerciseOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateWordCount() {
  const length = thinkingTextarea.value.length;
  wordCountDisplay.textContent = `${length} characters`;
}

function showToast() {
  toastNotification.classList.add('show');
  setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3000);
}

// --- 4. Reflection Logs Management (localStorage) ---
function loadLogs() {
  const saved = localStorage.getItem('thesayu_blank_logs');
  if (saved) {
    logs = JSON.parse(saved);
  } else {
    logs = [];
  }
  renderLogs();
}

function saveLog(modelIndex, content) {
  const model = mentalModels.find(m => Number(m.id) === Number(modelIndex));
  if (!model) return;
  const newLog = {
    id: Date.now(),
    modelTitle: model.koreanTitle,
    content: content,
    date: new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  logs.unshift(newLog);
  localStorage.setItem('thesayu_blank_logs', JSON.stringify(logs));
  renderLogs();
  showToast();
}

function deleteLog(id) {
  logs = logs.filter(log => log.id !== id);
  localStorage.setItem('thesayu_blank_logs', JSON.stringify(logs));
  renderLogs();
}

function renderLogs() {
  if (logs.length === 0) {
    drawerContent.innerHTML = `
      <div class="empty-log-state">
        <div class="empty-icon"><i class="fa-solid fa-pen-nib"></i></div>
        <p>아직 쌓인 기록이 없습니다. 첫 번째 사고 단련을 마치고, 성장의 첫 페이지를 남겨보세요.</p>
      </div>
    `;
    return;
  }

  drawerContent.innerHTML = '';
  logs.forEach(log => {
    const logMarkup = `
      <div class="log-item" data-id="${log.id}">
        <div class="log-header">
          <span class="log-tag">${log.modelTitle}</span>
          <span class="log-date">${log.date}</span>
        </div>
        <div class="log-body">${escapeHTML(log.content)}</div>
        <button class="btn-delete-log" onclick="deleteLogEntry(${log.id})">
          <i class="fa-solid fa-trash-can"></i> Delete
        </button>
      </div>
    `;
    drawerContent.insertAdjacentHTML('beforeend', logMarkup);
  });
}

// Global hook for dynamic deletion via onclick attribute
window.deleteLogEntry = function (id) {
  if (confirm('이 기록을 성장 아카이브에서 삭제하시겠습니까?')) {
    deleteLog(id);
  }
};

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let gatherTimer = null;
let scatterTimerId = null;

function enterScatterState() {
  const playground = document.querySelector('.main-playground');
  if (playground) {
    window.clearTimeout(gatherTimer);
    window.clearTimeout(scatterTimerId);
    playground.classList.remove('state-gather', 'state-stacked');
    playground.classList.add('state-scatter');

    // After 2.5 seconds, transition to the stacked category piles
    scatterTimerId = window.setTimeout(() => {
      if (playground.classList.contains('state-scatter')) {
        playground.classList.add('state-stacked');
      }
    }, 2500);
  }
}

function exitScatterState() {
  const playground = document.querySelector('.main-playground');
  if (playground) {
    window.clearTimeout(scatterTimerId);
    playground.classList.remove('state-scatter', 'state-stacked');
    playground.classList.add('state-gather');
    
    // Remove state-gather after transition delay + transition completes (~1.7s)
    window.clearTimeout(gatherTimer);
    gatherTimer = window.setTimeout(() => {
      playground.classList.remove('state-gather');
    }, 1700);
  }
}

// --- 5. Event Listeners & Binding ---
function setupEventListeners() {
  // Card click triggers Dial rotation or opens Workspace directly if scattered
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cardIndex = Number(card.dataset.cardIndex);
      const modelIndex = Number(card.dataset.model);
      const playground = document.querySelector('.main-playground');
      if (playground && playground.classList.contains('state-scatter')) {
        openExerciseWorkspace(modelIndex);
      } else if (card === cards[activeCardIndex] || cardIndex === activeCardIndex) {
        // 중앙 카드 클릭: 즉시 훈련 워크스페이스 진입
        stopCarouselAutoplay();
        window.clearTimeout(cardEnterTimer);
        selectedModelIndex = modelIndex;
        openExerciseWorkspace(modelIndex);
      } else {
        // 비중앙 카드 클릭: 자동 회전을 멈추고, 회전 연출 후 자동 진입
        stopCarouselAutoplay();
        rotateDialToCard(cardIndex);
        window.clearTimeout(cardEnterTimer);
        cardEnterTimer = window.setTimeout(() => {
          selectedModelIndex = modelIndex;
          openExerciseWorkspace(modelIndex);
        }, 700);
      }
    });
  });

  arcContainer.addEventListener('pointerenter', stopCarouselAutoplay);
  arcContainer.addEventListener('pointerleave', startCarouselAutoplay);

  // Action Button to engage workspace
  if (btnEngageMind) {
    btnEngageMind.addEventListener('click', () => {
      stopCarouselAutoplay();
      // 진단 모듈이 로드된 경우: 진단 → 훈련 성장 루프로 진입
      if (typeof window.openDiagnosisOverlay === 'function') {
        window.openDiagnosisOverlay();
      } else {
        enterScatterState();
      }
    });
  }

  // Back Button to exit scatter state
  const btnBackCarousel = document.getElementById('btn-back-carousel');
  if (btnBackCarousel) {
    btnBackCarousel.addEventListener('click', () => {
      exitScatterState();
      startCarouselAutoplay();
    });
  }

  // Close workspace overlay
  btnCloseExercise.addEventListener('click', () => {
    exerciseOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
    exitScatterState();
    startCarouselAutoplay();
  });

  // Character count track
  thinkingTextarea.addEventListener('input', updateWordCount);

  // Clear workspace
  btnClearWorkspace.addEventListener('click', () => {
    if (confirm('작성 중인 내용을 모두 지우시겠습니까?')) {
      thinkingTextarea.value = '';
      updateWordCount();
    }
  });

  // Submit thinking reflection
  btnSubmitThinking.addEventListener('click', () => {
    const text = thinkingTextarea.value.trim();
    if (!text) {
      alert('오늘의 사고 단련 내용을 먼저 기록해 주세요.');
      return;
    }

    saveLog(selectedModelIndex, text);
    exerciseOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
    exitScatterState();

    // Open drawer to show the new log
    appDrawer.classList.add('open');
    stopCarouselAutoplay();
  });

  // Logs Drawer Control
  btnHeaderLogTrigger.addEventListener('click', () => {
    appDrawer.classList.add('open');
    stopCarouselAutoplay();
  });

  btnHeaderLaunchTrigger.addEventListener('click', () => {
    stopCarouselAutoplay();
    openExerciseWorkspace(selectedModelIndex);
  });

  btnCloseDrawer.addEventListener('click', () => {
    appDrawer.classList.remove('open');
    startCarouselAutoplay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCarouselAutoplay();
    } else {
      startCarouselAutoplay();
    }
  });

  // Explore button trigger
  const btnHeaderExplore = document.querySelector('.btn-outline-pill[data-target]');
  if (btnHeaderExplore) {
    btnHeaderExplore.addEventListener('click', (e) => {
      e.preventDefault();
      rotateDial(0);
    });
  }

  // Handle responsive layout resizing
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      // Clear inline layout properties on mobile to avoid artifacts
      cards.forEach(card => {
        card.style.removeProperty('--card-rotation');
        card.style.removeProperty('--card-rotate');
        card.style.removeProperty('--angle');
        card.style.removeProperty('--radius');
        card.style.removeProperty('--origin-y');
        card.style.removeProperty('left');
        card.style.removeProperty('top');
        card.style.removeProperty('--card-scale');
        card.style.removeProperty('z-index');
      });
      arcContainer.style.transform = 'none';
    } else {
      // Re-apply rotation
      rotateDial(selectedModelIndex);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Scan figures folder
  const files = await getFigureFiles();
  
  // 2. Build the mentalModels database
  mentalModels = buildMentalModels(files);
  
  // 3. Render cards into the DOM
  renderCards(files);
  
  // 4. Bind the DOM cards references
  bindCards();

  // 5. Initialize the positions, logs, and events
  initCardPositions();
  initBackgroundInteractions();
  setupEventListeners();
  loadLogs();
  startCarouselAutoplay();

  // Re-scan figures at runtime (captures newly uploaded images without full page reload)
  try {
    await refreshFigures();
  } catch (e) {
    // ignore
  }

  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      updateCarouselLayout(activeCardIndex);
    });
  });

  if (document.fonts) {
    document.fonts.ready.then(() => {
      updateCarouselLayout(activeCardIndex);
    });
  }
});
