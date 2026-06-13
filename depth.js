/* ============================================================
   생각PT — 생각 깊이 4지표 모듈 (depth.js) v1.0
   ------------------------------------------------------------
   사업계획서 2-5 '생각 깊이 정량화' 1차 구현:
   - 신선도 / 구체도 / 연결도 / 실행도 (각 0~100)
   - 기본 엔진: 규칙 기반(한국어 휴리스틱) — 오프라인·무비용·즉시 동작
   - LLM 어댑터: 골격만 탑재(기본 비활성). 활성화 조건과 제약:
       · DEPTH_LLM.enabled=true + endpoint 설정 시에만 시도
       · 세션당 최대 2회 (sessionStorage 카운터 — 사업계획서 2-5)
       · 5초 타임아웃 / 실패 시 항상 규칙 기반 결과로 폴백 (비차단)
   - 데이터 소비: thesayu_blank_logs **읽기 전용** (절대 규칙 5 준수)
   - 캐시: 신규 키 thinkpt_depth_cache_v1 에만 쓰기 (logId → metrics)
   - 외부 공개 API (전부 window.* — 소비처는 typeof 가드 필수):
       window.computeThinkingDepth(text)  → {fresh,concrete,connect,action}|null
       window.getDepthSummary(limit=5)    → {count, metrics, method}|null
       window.getDepthForLog(id)          → metrics|null
   - app.js / diagnosis.js / dashboard.js 전역을 일절 참조하지 않음 (독립 모듈)
   ============================================================ */
(function () {
  'use strict';

  var KEY_LOGS = 'thesayu_blank_logs';        // 읽기 전용
  var KEY_CACHE = 'thinkpt_depth_cache_v1';   // 본 모듈 전용 신규 키
  var CACHE_MAX = 50;

  /* ---------- LLM 어댑터 설정 (기본 비활성 — GitHub Pages에는 키 없음) ----------
     활성화하려면 enabled=true + 프록시 endpoint 지정. 직접 키 노출 금지. */
  var DEPTH_LLM = {
    enabled: false,
    endpoint: '',            // 예: 자체 프록시 '/api/depth-score'
    model: 'claude-haiku',   // 저비용 모델 (사업계획서 2-5)
    sessionLimit: 2,         // 세션당 호출 상한
    timeoutMs: 5000
  };
  var SESSION_KEY = 'thinkpt_depth_llm_calls';

  /* ---------- 공통 유틸 ---------- */
  function readJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || 'null');
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }

  /* ---------- 규칙 기반 채점기 (한국어 휴리스틱) ----------
     형태소 분석 없이 어휘·표지 패턴으로 근사. 20자 미만은 측정 불가(null). */

  var RE_TOKEN = /[가-힣a-zA-Z0-9]+/g;

  // 구체도: 숫자·단위·예시 표지·인용/괄호 표기
  var RE_NUMBER = /[0-9０-９]+|[일이삼사오육칠팔구십백천만억]+\s*(개|명|번|배|원|년|월|일|시간|분|퍼센트|%)/g;
  var RE_EXAMPLE = /예를\s*들|예컨대|가령|구체적으로|실제로|사례|케이스/g;
  var RE_QUOTE = /[「」『』""''()<>]/g;

  // 연결도: 접속·인과·대조·비유 표지
  var RE_CONNECT = /그래서|따라서|왜냐하면|때문에|반면|한편|그런데|하지만|마치|처럼|같이|비유|연결|결합|융합|즉|다시\s*말해|이를\s*통해/g;

  // 실행도: 행동·계획·시점 표지
  var RE_ACTION = /해보|적용|시도|실험|계획|실행|시작|만들|바꾸|개선|도입|먼저|다음\s*단계|단계적|오늘|내일|이번\s*주|당장|바로/g;

  // 신선도: 질문·가정·전환 표지(가점) / 상투어(감점)
  var RE_NOVEL = /만약|어떨까|왜\s|거꾸로|반대로|뒤집|새로운\s*관점|다르게|낯설|엉뚱/g;
  var RE_CLICHE = /좋다|좋은\s|중요하다|중요한\s|많다|많은\s|필요하다|열심히|노력/g;

  function countMatches(text, re) {
    var m = text.match(re);
    return m ? m.length : 0;
  }

  function computeThinkingDepth(text) {
    var t = String(text == null ? '' : text).trim();
    if (t.length < 20) return null; // 측정 불가

    var tokens = t.match(RE_TOKEN) || [];
    var nTok = tokens.length || 1;
    var uniq = {};
    tokens.forEach(function (w) { uniq[w] = 1; });
    var ttr = Object.keys(uniq).length / nTok; // 어휘 다양성 0~1

    var sentences = t.split(/[.!?。\n]+/).filter(function (s) { return s.trim().length > 1; });
    var nSent = sentences.length || 1;
    var lenNorm = Math.min(t.length / 300, 1); // 길이 보정(300자에서 만점)

    // 밀도 = 표지 수 / 문장 수 (문장당 표지 비율로 정규화)
    function density(re, perSentFull) {
      return Math.min(countMatches(t, re) / nSent / perSentFull, 1);
    }

    var concrete = clamp(
      55 * density(RE_NUMBER, 0.8) +
      30 * density(RE_EXAMPLE, 0.5) +
      15 * Math.min(countMatches(t, RE_QUOTE) / 4, 1)
    );
    var connect = clamp(
      80 * density(RE_CONNECT, 1.0) +
      20 * Math.min((nSent - 1) / 5, 1) // 다문장 전개 가점
    );
    var action = clamp(
      85 * density(RE_ACTION, 0.9) +
      15 * lenNorm
    );
    var fresh = clamp(
      55 * Math.min(Math.max(ttr - 0.45, 0) / 0.35, 1) + // TTR 0.45~0.8 구간 환산
      35 * density(RE_NOVEL, 0.5) +
      10 * lenNorm -
      15 * density(RE_CLICHE, 0.8) // 상투어 감점
    );

    return { fresh: fresh, concrete: concrete, connect: connect, action: action };
  }

  /* ---------- 캐시 (신규 키에만 쓰기) ---------- */
  function readCache() { return readJSON(KEY_CACHE, {}); }
  function writeCache(cache) {
    try {
      var ids = Object.keys(cache);
      if (ids.length > CACHE_MAX) { // 오래된 항목(작은 id=과거) 정리
        ids.sort(function (a, b) { return Number(a) - Number(b); });
        ids.slice(0, ids.length - CACHE_MAX).forEach(function (id) { delete cache[id]; });
      }
      localStorage.setItem(KEY_CACHE, JSON.stringify(cache));
    } catch (e) { /* 저장 실패 시 무시 (비차단) */ }
  }

  function getDepthForLog(id) {
    var logs = readJSON(KEY_LOGS, []);
    var log = logs.find ? logs.find(function (l) { return Number(l.id) === Number(id); }) : null;
    if (!log) return null;
    var cache = readCache();
    var hit = cache[String(log.id)];
    if (hit && hit.metrics) return hit.metrics;
    var metrics = computeThinkingDepth(log.content);
    if (metrics) {
      cache[String(log.id)] = { metrics: metrics, method: 'rule', at: Date.now() };
      writeCache(cache);
    }
    return metrics;
  }

  /* ---------- 요약: 최근 N건 훈련의 평균 지표 ---------- */
  function getDepthSummary(limit) {
    var n = Number(limit) > 0 ? Number(limit) : 5;
    var logs = readJSON(KEY_LOGS, []);
    if (!logs.length) return { count: 0, metrics: null, method: 'rule' };
    var cache = readCache(), dirty = false;
    var acc = { fresh: 0, concrete: 0, connect: 0, action: 0 }, used = 0;
    logs.slice(0, n).forEach(function (log) {
      var hit = cache[String(log.id)];
      var m = hit && hit.metrics ? hit.metrics : computeThinkingDepth(log.content);
      if (!m) return; // 20자 미만 등 측정 불가 건 제외
      if (!hit || !hit.metrics) {
        cache[String(log.id)] = { metrics: m, method: 'rule', at: Date.now() };
        dirty = true;
      }
      acc.fresh += m.fresh; acc.concrete += m.concrete;
      acc.connect += m.connect; acc.action += m.action;
      used++;
    });
    if (dirty) writeCache(cache);
    if (!used) return { count: 0, metrics: null, method: 'rule' };
    return {
      count: used,
      metrics: {
        fresh: Math.round(acc.fresh / used),
        concrete: Math.round(acc.concrete / used),
        connect: Math.round(acc.connect / used),
        action: Math.round(acc.action / used)
      },
      method: 'rule' // LLM 활성·성공 시 'llm' (refreshDepthWithLLM 참조)
    };
  }

  /* ---------- LLM 어댑터 (골격 — 기본 비활성, 호출 안 해도 무해) ----------
     성공 시 캐시에 method:'llm'으로 갱신만 하고, 실패·한도 초과·비활성 시
     아무 것도 바꾸지 않음 → 소비처는 항상 규칙 기반 값으로 즉시 렌더 가능 */
  function llmCallsUsed() {
    try { return Number(sessionStorage.getItem(SESSION_KEY) || '0'); }
    catch (e) { return DEPTH_LLM.sessionLimit; } // 접근 불가 시 호출 봉인
  }
  function refreshDepthWithLLM(logId) {
    if (!DEPTH_LLM.enabled || !DEPTH_LLM.endpoint) return Promise.resolve(null);
    if (llmCallsUsed() >= DEPTH_LLM.sessionLimit) return Promise.resolve(null);
    var logs = readJSON(KEY_LOGS, []);
    var log = logs.find ? logs.find(function (l) { return Number(l.id) === Number(logId); }) : null;
    if (!log || !log.content) return Promise.resolve(null);

    try { sessionStorage.setItem(SESSION_KEY, String(llmCallsUsed() + 1)); } catch (e) {}
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, DEPTH_LLM.timeoutMs) : null;

    return fetch(DEPTH_LLM.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: DEPTH_LLM.model, text: log.content }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error('bad status');
      return res.json();
    }).then(function (data) {
      // 기대 형식: {fresh,concrete,connect,action} 각 0~100
      var ks = ['fresh', 'concrete', 'connect', 'action'];
      var ok = data && ks.every(function (k) { return typeof data[k] === 'number'; });
      if (!ok) return null;
      var metrics = {};
      ks.forEach(function (k) { metrics[k] = clamp(data[k]); });
      var cache = readCache();
      cache[String(log.id)] = { metrics: metrics, method: 'llm', at: Date.now() };
      writeCache(cache);
      return metrics;
    }).catch(function () {
      return null; // 장애 시 규칙 기반 폴백 (캐시 미변경)
    }).finally(function () {
      if (timer) clearTimeout(timer);
    });
  }

  /* ---------- 공개 ---------- */
  window.computeThinkingDepth = computeThinkingDepth;
  window.getDepthSummary = getDepthSummary;
  window.getDepthForLog = getDepthForLog;
  window.refreshDepthWithLLM = refreshDepthWithLLM; // 현재 빌드에서는 미호출 (어댑터 예비)
})();
