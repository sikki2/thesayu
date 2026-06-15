/* ============================================================
   생각PT — 마인드 대시보드 모듈 (dashboard.js) v1.5
   ------------------------------------------------------------
   v1.1 (7-2 고도화): ① 비교 기준 선택(첫 진단 대비 / 직전 진단 대비)
                      ② 시계열 성장 추이 그래프(진단 3건 이상 누적 시)
   v1.2: 생각 깊이 4지표 — depth.js(window.getDepthSummary) 연동.
         모듈 미로딩·기록 0건이면 기존 '측정 대기' 문구 유지 (하위 호환)
   v1.3: 성장 추이 그래프에 호버 툴팁 추가 — 컬럼별 가이드선 + 날짜·영역별 점수.
         CSS :hover 만으로 동작(새 JS 리스너 없음 → #dashboard-body 위임 1개 유지).
         신규 .dash-trend-{hit,guide,tip,col} 클래스만 사용, 기존 추이 렌더 무변경.
   v1.4: 추이선 강조 — 라인/범례 호버 시 해당 영역만 진하게, 나머지 흐리게.
         각 라인을 <g.dash-trend-series data-area>로 감싸고 범례에 data-area 부여.
         강조는 styles.css :has() 규칙만으로 동작(새 JS 리스너 0 — 절대 규칙 7 유지).
   v1.5: 생각 깊이 4지표 시계열(buildDepthTrend) — depth.js의 공개 순수함수
         window.computeThinkingDepth만 소비(typeof 가드). depth.js·캐시·fetch 무접촉
         (절대 규칙 12 유지). 추이 차트 시각 시스템(.dash-trend-*) 재사용해 툴팁·강조 공유,
         정의는 무수정. 측정 가능 훈련 3건 이상일 때만 노출. 신규 클래스는 .dash-dtrend-card 하나.
         ※ LLM 정밀 채점 재개(11절)는 dashboard를 v1.6 이상으로 부여할 것(버전 충돌 방지).
   ------------------------------------------------------------
   - 진단 기록(thinkpt_diagnosis_history)과 훈련 기록(thesayu_blank_logs)을
     "읽기 전용"으로 종합해 성장 대시보드 오버레이를 렌더링
   - app.js / diagnosis.js는 수정하지 않음 (전역 읽기·호출만):
       · DIAG_AREAS (diagnosis.js 전역 상수)
       · mentalModels, openExerciseWorkspace (app.js 전역)
       · window.openDiagnosisOverlay (diagnosis.js)
   - 차트 기하값(C=160, R=110, viewBox -30 16 380 288, 라벨 오프셋)은
     diagnosis.js v1.5에서 확정된 값을 그대로 사용 (임의 변경 금지 — 인계문서 7절)
   - 인터랙션은 #dashboard-body 이벤트 위임 1개로만 부착 (인계문서 절대 규칙 7)
   ============================================================ */
(function () {
  'use strict';

  var KEY_DIAG = 'thinkpt_diagnosis_history';
  var KEY_LOGS = 'thesayu_blank_logs';

  var overlay = document.getElementById('dashboard-overlay');
  var body = document.getElementById('dashboard-body');
  var btnOpen = document.getElementById('btn-header-dashboard-trigger');
  var btnClose = document.getElementById('btn-close-dashboard');
  if (!overlay || !body) return;

  /* 비교 모드 상태: 'now'(현재) | 'first'(첫 진단 대비) | 'prev'(직전 진단 대비)
     — v1.0의 'compare'는 'first'로 개명 (진단 2건일 때는 첫=직전이므로 'prev' 단일 노출) */
  var mode = 'now';

  /* ---------- 데이터 읽기 (읽기 전용, 실패 시 빈 배열) ---------- */
  function readJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch (e) { return []; }
  }

  /* ---------- 영역 메타 (diagnosis.js 미로딩 시 폴백) ---------- */
  var AREA_KEYS = ['conn', 'obs', 'simp', 'inv'];
  var AREA_FALLBACK = {
    conn: { name: '연결력', thinkerName: '다빈치', thinkerKey: 'creative_davinci' },
    obs: { name: '관찰력', thinkerName: '에디슨', thinkerKey: 'creative_edison' },
    simp: { name: '단순화력', thinkerName: '잡스', thinkerKey: 'creative_jobs' },
    inv: { name: '역발상력', thinkerName: '다이슨', thinkerKey: 'creative_dyson' }
  };
  function areaMeta(key) {
    if (typeof DIAG_AREAS !== 'undefined' && DIAG_AREAS[key]) return DIAG_AREAS[key];
    return AREA_FALLBACK[key] || { name: key, thinkerName: '', thinkerKey: '' };
  }

  /* ---------- 다이아몬드 차트 (v1.5 확정 기하값 + 고스트 폴리곤) ---------- */
  function buildDashboardDiamond(nowScores, beforeScores, maxPossible) {
    var C = 160, R = 110;
    var axes = [
      { key: 'conn', x: 0, y: -1, lx: 0, ly: -18, anchor: 'middle' },
      { key: 'obs', x: 1, y: 0, lx: 14, ly: 5, anchor: 'start' },
      { key: 'simp', x: 0, y: 1, lx: 0, ly: 26, anchor: 'middle' },
      { key: 'inv', x: -1, y: 0, lx: -14, ly: 5, anchor: 'end' }
    ];
    function pt(axis, ratio) {
      return (C + axis.x * R * ratio) + ',' + (C + axis.y * R * ratio);
    }
    var gridLevels = [0.25, 0.5, 0.75, 1].map(function (r) {
      return '<polygon points="' + axes.map(function (a) { return pt(a, r); }).join(' ') +
        '" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>';
    }).join('');
    var axisLines = axes.map(function (a) {
      return '<line x1="' + C + '" y1="' + C + '" x2="' + (C + a.x * R) + '" y2="' + (C + a.y * R) +
        '" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>';
    }).join('');
    function polyFor(scores) {
      return axes.map(function (a) {
        var ratio = Math.max((scores[a.key] || 0) / maxPossible, 0.04);
        return pt(a, ratio);
      }).join(' ');
    }
    var ghost = beforeScores
      ? '<polygon points="' + polyFor(beforeScores) + '" class="dash-ghost-shape"/>'
      : '';
    var dots = axes.map(function (a) {
      var ratio = Math.max((nowScores[a.key] || 0) / maxPossible, 0.04);
      var xy = pt(a, ratio).split(',');
      return '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="4" class="diag-value-dot"/>';
    }).join('');
    var labels = axes.map(function (a) {
      return '<text x="' + (C + a.x * R + a.lx) + '" y="' + (C + a.y * R + a.ly) +
        '" text-anchor="' + a.anchor + '" class="diag-chart-label">' + areaMeta(a.key).name +
        ' <tspan class="diag-chart-score">' + (nowScores[a.key] || 0) + '</tspan></text>';
    }).join('');
    return '<svg class="diag-diamond" viewBox="-30 16 380 288" style="overflow: visible;" ' +
      'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="마인드 인바디 차트">' +
      gridLevels + axisLines + ghost +
      '<polygon points="' + polyFor(nowScores) + '" class="diag-value-shape"/>' +
      dots + labels + '</svg>';
  }

  /* ---------- [v1.1 신규] 시계열 성장 추이 그래프 (진단 3건 이상) ----------
     - 최근 10건을 시간순(과거→현재)으로 정렬해 영역별 꺾은선 4개 렌더
     - 기존 다이아몬드 기하값과 무관한 신규 차트 — 신규 클래스(.dash-trend-*)만 사용 */
  var TREND_COLORS = { conn: '#8338ec', obs: '#00838c', simp: '#f7b32b', inv: '#e0356b' };

  function buildTrendChart(history, max) {
    var seq = history.slice(0, 10).reverse(); // 최신순 저장 → 시간순 표시
    if (seq.length < 3) return '';
    var W = 380, H = 196, PL = 30, PR = 14, PT = 14, PB = 28;
    var iw = W - PL - PR, ih = H - PT - PB;
    function x(i) { return PL + iw * i / (seq.length - 1); }
    function y(v) { return PT + ih * (1 - Math.min(Math.max(v, 0) / max, 1)); }
    function fmtDate(d) {
      var t = new Date(d);
      return isNaN(t) ? '' : (t.getMonth() + 1) + '.' + t.getDate();
    }
    /* 수평 그리드 + Y축 눈금 (0 / 절반 / 최대) */
    var grid = [0, 0.5, 1].map(function (r) {
      var gy = PT + ih * (1 - r);
      return '<line x1="' + PL + '" y1="' + gy + '" x2="' + (W - PR) + '" y2="' + gy +
        '" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>' +
        '<text x="' + (PL - 6) + '" y="' + (gy + 3.5) + '" text-anchor="end" class="dash-trend-tick">' +
        Math.round(max * r) + '</text>';
    }).join('');
    /* X축 날짜 라벨: 5건 이하 전부, 초과 시 처음·중간·끝만 */
    var labelIdx = seq.length <= 5
      ? seq.map(function (_, i) { return i; })
      : [0, Math.floor((seq.length - 1) / 2), seq.length - 1];
    var xLabels = labelIdx.map(function (i) {
      return '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" class="dash-trend-tick">' +
        fmtDate(seq[i].date) + '</text>';
    }).join('');
    /* 영역별 폴리라인 + 점 */
    /* [v1.4 추가] 각 영역 라인을 <g class="dash-trend-series" data-area>로 감싸 호버 강조 대상화.
       강조는 styles.css의 :has() 규칙만으로 동작(새 JS 리스너 0 — 절대 규칙 7 유지). */
    var lines = AREA_KEYS.map(function (k) {
      var pts = seq.map(function (r, i) {
        return x(i) + ',' + y((r.scores && r.scores[k]) || 0);
      }).join(' ');
      var dots = seq.map(function (r, i) {
        return '<circle cx="' + x(i) + '" cy="' + y((r.scores && r.scores[k]) || 0) +
          '" r="2.6" fill="' + TREND_COLORS[k] + '"/>';
      }).join('');
      return '<g class="dash-trend-series" data-area="' + k + '">' +
        '<polyline points="' + pts + '" fill="none" stroke="' + TREND_COLORS[k] +
        '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity="0.85"/>' + dots + '</g>';
    }).join('');
    var legend = AREA_KEYS.map(function (k) {
      return '<span class="dash-trend-key" data-area="' + k + '"><i style="background:' + TREND_COLORS[k] + '"></i>' +
        areaMeta(k).name + '</span>';
    }).join('');
    /* [v1.3 추가] 호버 인터랙션 오버레이 — 컬럼별 가이드선 + 툴팁.
       CSS :hover 만으로 동작(새 JS 리스너 없음 — 절대 규칙 7 유지). 신규 .dash-trend-* 클래스만 사용. */
    var tipW = 104, tipRowH = 15, tipH = 20 + AREA_KEYS.length * tipRowH + 6;
    function trendBand(i) {
      var left = i === 0 ? PL : (x(i - 1) + x(i)) / 2;
      var right = i === seq.length - 1 ? (W - PR) : (x(i) + x(i + 1)) / 2;
      return [left, right - left];
    }
    var cols = seq.map(function (r, i) {
      var cx = x(i), band = trendBand(i);
      var tipX = Math.min(Math.max(cx - tipW / 2, PL), W - PR - tipW);
      var tipY = PT + 2;
      var rows = AREA_KEYS.map(function (k, ri) {
        var ry = tipY + 20 + ri * tipRowH;
        var val = (r.scores && r.scores[k]) || 0;
        return '<circle cx="' + (tipX + 11) + '" cy="' + (ry - 3.5) + '" r="3" fill="' + TREND_COLORS[k] + '"/>' +
          '<text x="' + (tipX + 19) + '" y="' + ry + '" class="dash-trend-tip-row">' + areaMeta(k).name + '</text>' +
          '<text x="' + (tipX + tipW - 9) + '" y="' + ry + '" text-anchor="end" class="dash-trend-tip-val">' + val + '</text>';
      }).join('');
      var tip = '<g class="dash-trend-tip">' +
        '<rect class="dash-trend-tip-bg" x="' + tipX + '" y="' + tipY + '" width="' + tipW + '" height="' + tipH + '" rx="8"/>' +
        '<text class="dash-trend-tip-date" x="' + (tipX + 11) + '" y="' + (tipY + 15) + '">' + fmtDate(r.date) + ' 진단</text>' +
        rows + '</g>';
      return '<g class="dash-trend-col">' +
        '<line class="dash-trend-guide" x1="' + cx + '" y1="' + PT + '" x2="' + cx + '" y2="' + (PT + ih) + '"/>' +
        '<rect class="dash-trend-hit" x="' + band[0] + '" y="' + PT + '" width="' + band[1] + '" height="' + ih + '"/>' +
        tip + '</g>';
    }).join('');
    return '<section class="dash-card dash-card-wide dash-trend-card">' +
      '<h3 class="dash-card-label">성장 추이 <small class="dash-trend-count">최근 ' + seq.length + '회 진단</small></h3>' +
      '<svg class="dash-trend-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="진단 점수 시계열 추이">' + grid + lines + xLabels + cols + '</svg>' +
      '<div class="dash-trend-legend">' + legend + '</div>' +
      '</section>';
  }

  /* ---------- [v1.5 신규] 생각 깊이 4지표 시계열 (측정 가능 훈련 3건 이상) ----------
     - depth.js의 공개 순수함수 window.computeThinkingDepth(text)만 소비(typeof 가드).
       depth.js 내부/캐시/전역을 변경하지 않으며 fetch·LLM 경로 미접촉(절대 규칙 12 유지).
     - 시간축은 훈련 로그 자체의 시점(log.date, 폴백 log.id) — 성장 추이로서 더 정확.
     - 추이 차트(.dash-trend-*)의 시각 시스템을 그대로 재사용(클래스 정의 무수정) →
       호버 툴팁·라인 강조를 공유. 지표값은 0~100 고정 스케일.
     - 진단 시계열(buildTrendChart)과 독립: 측정 가능 훈련만으로 3건↑이면 노출. */
  var DEPTH_TREND = [
    { key: 'fresh', name: '신선도', color: '#0ea5e9' },
    { key: 'concrete', name: '구체도', color: '#f59e0b' },
    { key: 'connect', name: '연결도', color: '#8b5cf6' },
    { key: 'action', name: '실행도', color: '#ef4444' }
  ];
  function buildDepthTrend(logs) {
    if (typeof window.computeThinkingDepth !== 'function') return '';
    /* 최신순 로그 → 측정 가능 건만 시간순(과거→현재)으로 수집 (최근 10건) */
    var series = [];
    (logs || []).forEach(function (l) {
      var m = window.computeThinkingDepth(l && l.content);
      if (!m) return; // 20자 미만 등 측정 불가 제외
      var t = l.date ? Date.parse(l.date) : (Number(l.id) || 0);
      series.push({ ts: t, date: l.date || (Number(l.id) ? new Date(Number(l.id)) : ''), metrics: m });
    });
    series.sort(function (a, b) { return a.ts - b.ts; });
    if (series.length > 10) series = series.slice(series.length - 10);
    if (series.length < 3) return '';

    var max = 100;
    var W = 380, H = 196, PL = 30, PR = 14, PT = 14, PB = 28;
    var iw = W - PL - PR, ih = H - PT - PB;
    function x(i) { return PL + iw * i / (series.length - 1); }
    function y(v) { return PT + ih * (1 - Math.min(Math.max(v, 0) / max, 1)); }
    function fmtDate(d) {
      var t = new Date(d);
      return isNaN(t) ? '' : (t.getMonth() + 1) + '.' + t.getDate();
    }
    var grid = [0, 0.5, 1].map(function (r) {
      var gy = PT + ih * (1 - r);
      return '<line x1="' + PL + '" y1="' + gy + '" x2="' + (W - PR) + '" y2="' + gy +
        '" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>' +
        '<text x="' + (PL - 6) + '" y="' + (gy + 3.5) + '" text-anchor="end" class="dash-trend-tick">' +
        Math.round(max * r) + '</text>';
    }).join('');
    var labelIdx = series.length <= 5
      ? series.map(function (_, i) { return i; })
      : [0, Math.floor((series.length - 1) / 2), series.length - 1];
    var xLabels = labelIdx.map(function (i) {
      return '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" class="dash-trend-tick">' +
        fmtDate(series[i].date) + '</text>';
    }).join('');
    var lines = DEPTH_TREND.map(function (mt) {
      var pts = series.map(function (s, i) { return x(i) + ',' + y(s.metrics[mt.key] || 0); }).join(' ');
      var dots = series.map(function (s, i) {
        return '<circle cx="' + x(i) + '" cy="' + y(s.metrics[mt.key] || 0) + '" r="2.6" fill="' + mt.color + '"/>';
      }).join('');
      return '<g class="dash-trend-series" data-area="' + mt.key + '">' +
        '<polyline points="' + pts + '" fill="none" stroke="' + mt.color +
        '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity="0.85"/>' + dots + '</g>';
    }).join('');
    var legend = DEPTH_TREND.map(function (mt) {
      return '<span class="dash-trend-key" data-area="' + mt.key + '"><i style="background:' + mt.color + '"></i>' +
        mt.name + '</span>';
    }).join('');
    /* 호버 오버레이(가이드선 + 툴팁) — 추이 차트와 동일 클래스 재사용, CSS :hover 전용(JS 리스너 0) */
    var tipW = 104, tipRowH = 15, tipH = 20 + DEPTH_TREND.length * tipRowH + 6;
    function band(i) {
      var left = i === 0 ? PL : (x(i - 1) + x(i)) / 2;
      var right = i === series.length - 1 ? (W - PR) : (x(i) + x(i + 1)) / 2;
      return [left, right - left];
    }
    var cols = series.map(function (s, i) {
      var cx = x(i), bd = band(i);
      var tipX = Math.min(Math.max(cx - tipW / 2, PL), W - PR - tipW);
      var tipY = PT + 2;
      var rows = DEPTH_TREND.map(function (mt, ri) {
        var ry = tipY + 20 + ri * tipRowH;
        var val = s.metrics[mt.key] || 0;
        return '<circle cx="' + (tipX + 11) + '" cy="' + (ry - 3.5) + '" r="3" fill="' + mt.color + '"/>' +
          '<text x="' + (tipX + 19) + '" y="' + ry + '" class="dash-trend-tip-row">' + mt.name + '</text>' +
          '<text x="' + (tipX + tipW - 9) + '" y="' + ry + '" text-anchor="end" class="dash-trend-tip-val">' + val + '</text>';
      }).join('');
      var tip = '<g class="dash-trend-tip">' +
        '<rect class="dash-trend-tip-bg" x="' + tipX + '" y="' + tipY + '" width="' + tipW + '" height="' + tipH + '" rx="8"/>' +
        '<text class="dash-trend-tip-date" x="' + (tipX + 11) + '" y="' + (tipY + 15) + '">' + fmtDate(s.date) + ' 훈련</text>' +
        rows + '</g>';
      return '<g class="dash-trend-col">' +
        '<line class="dash-trend-guide" x1="' + cx + '" y1="' + PT + '" x2="' + cx + '" y2="' + (PT + ih) + '"/>' +
        '<rect class="dash-trend-hit" x="' + bd[0] + '" y="' + PT + '" width="' + bd[1] + '" height="' + ih + '"/>' +
        tip + '</g>';
    }).join('');
    return '<section class="dash-card dash-card-wide dash-trend-card dash-dtrend-card">' +
      '<h3 class="dash-card-label">생각 깊이 추이 <small class="dash-trend-count">측정 ' + series.length + '회 훈련 · 규칙 기반 베타</small></h3>' +
      '<svg class="dash-trend-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="생각 깊이 4지표 시계열 추이">' + grid + lines + xLabels + cols + '</svg>' +
      '<div class="dash-trend-legend">' + legend + '</div>' +
      '</section>';
  }

  /* ---------- HTML 이스케이프 (훈련 회고 등 사용자 입력 표시용) ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- [v1.2 신규] 생각 깊이 4지표 미니 블록 ----------
     depth.js의 window.getDepthSummary 소비 (typeof 가드).
     미로딩·측정 가능 기록 0건이면 기존 '측정 대기' 문구 그대로 반환 */
  var DEPTH_META = [
    { key: 'fresh', name: '신선도' }, { key: 'concrete', name: '구체도' },
    { key: 'connect', name: '연결도' }, { key: 'action', name: '실행도' }
  ];
  function buildDepthBlock() {
    var pending = '<p class="dash-pending"><span class="diag-pending-badge">측정 대기</span> 신선도·구체도·연결도·실행도는 훈련 답변 기반 AI 분석 연동 후 제공됩니다.</p>';
    if (typeof window.getDepthSummary !== 'function') return pending;
    var d = window.getDepthSummary(5);
    if (!d || !d.count || !d.metrics) return pending;
    var rows = DEPTH_META.map(function (m) {
      var v = d.metrics[m.key] || 0;
      return '<div class="dash-depth-row"><span class="k">' + m.name + '</span>' +
        '<span class="dash-depth-track"><i style="width:' + v + '%"></i></span>' +
        '<span class="v">' + v + '</span></div>';
    }).join('');
    return '<div class="dash-depth">' + rows + '</div>' +
      '<p class="dash-hint">최근 훈련 ' + d.count + '건 기준 · 규칙 기반 베타 (LLM 정밀 채점 고도화 예정)</p>';
  }

  /* ---------- 렌더 ---------- */
  function render() {
    var history = readJSON(KEY_DIAG); // 최신순
    var logs = readJSON(KEY_LOGS);    // 최신순

    if (!history.length) {
      body.innerHTML =
        '<div class="dash-empty">' +
        '  <div class="dash-empty-icon"><i class="fa-solid fa-chart-simple"></i></div>' +
        '  <h2>아직 마인드 인바디 데이터가 없습니다</h2>' +
        '  <p>3분 진단을 완료하면 사고 영역별 점수와 위인 싱크로율이<br>이 대시보드에 쌓이기 시작합니다.</p>' +
        '  <button class="btn-outline-pill dash-cta" data-action="go-diagnosis">내 사고력 진단하기</button>' +
        '</div>';
      return;
    }

    var latest = history[0];
    var first = history[history.length - 1];
    var prev = history[1] || null;
    var hasCompare = history.length >= 2;
    /* 비교 기준 레코드 선택: first(첫 진단) / prev(직전 진단) — 모드 무효 시 비교 안 함 */
    var baseRecord = mode === 'first' ? first : mode === 'prev' ? prev : null;
    var comparing = hasCompare && !!baseRecord;
    var baseLabel = mode === 'first' ? '첫 진단' : '직전 진단';
    var max = latest.maxPossible || 13;

    /* 유형 선언 */
    var typeName = latest.primaryArea && (latest.primaryArea.typeName || latest.primaryArea.name) || '—';
    var dateStr = latest.date ? new Date(latest.date).toLocaleDateString('ko-KR') : '';

    /* 영역별 점수 스트립 (비교 모드 시 변화량) */
    var strip = AREA_KEYS.map(function (k) {
      var now = (latest.scores && latest.scores[k]) || 0;
      var delta = '';
      if (comparing) {
        var diff = now - ((baseRecord.scores && baseRecord.scores[k]) || 0);
        delta = diff > 0 ? '<span class="dash-delta up">▲ ' + diff + '</span>'
          : diff < 0 ? '<span class="dash-delta down">▼ ' + (-diff) + '</span>'
            : '<span class="dash-delta">—</span>';
      }
      return '<div class="dash-strip-item"><span class="k">' + areaMeta(k).name +
        '</span><span class="v">' + now + '<small>/' + max + '</small></span>' + delta + '</div>';
    }).join('');

    /* 위인 싱크로율 TOP3 */
    var syncRows = (latest.synchroTop3 || []).map(function (s, i) {
      var a = s.area || {};
      var key = a.key || '';
      return '<button class="dash-sync-item" data-action="train" data-area="' + esc(key) + '">' +
        '<span class="dash-rank">' + (i + 1) + '</span>' +
        '<span class="dash-sync-main"><span class="dash-sync-name">' + esc(a.thinkerName || '') +
        ' <small>' + esc(a.name || '') + '</small></span>' +
        '<span class="dash-sync-bar"><i style="width:' + (s.pct || 0) + '%"></i></span></span>' +
        '<span class="dash-sync-pct">' + (s.pct || 0) + '<small>%</small></span></button>';
    }).join('');

    /* 추천 훈련(약점) 칩 */
    var rec = latest.recommendArea || {};
    var weakChip = rec.name
      ? '<div class="dash-weak"><i class="fa-solid fa-triangle-exclamation"></i>' +
        '<span>보완 영역은 <b>' + esc(rec.name) + '</b>입니다. <b>' + esc(rec.thinkerName || '') +
        '</b> 렌즈 훈련을 추천합니다.</span>' +
        '<button class="btn-outline-pill dash-weak-btn" data-action="train" data-area="' + esc(rec.key || '') +
        '">바로 훈련</button></div>'
      : '';

    /* 타임라인: 진단 + 훈련 병합 최근 5건 */
    var merged = [];
    history.forEach(function (r) {
      var t = Date.parse(r.date);
      var nm = r.primaryArea && (r.primaryArea.typeName || r.primaryArea.name) || '진단';
      merged.push({
        ts: isNaN(t) ? 0 : t, type: 'diag',
        title: '사고 스타일 진단 — ' + nm,
        time: r.date ? new Date(r.date).toLocaleDateString('ko-KR') : ''
      });
    });
    logs.forEach(function (l) {
      merged.push({
        ts: Number(l.id) || 0, type: 'train',
        title: l.modelTitle || '사고 훈련',
        time: l.date || ''
      });
    });
    merged.sort(function (a, b) { return b.ts - a.ts; });
    var tlRows = merged.slice(0, 5).map(function (m) {
      return '<li><span class="dash-tag ' + (m.type === 'diag' ? 'is-diag' : 'is-train') + '">' +
        (m.type === 'diag' ? '진단' : '훈련') + '</span>' +
        '<span class="dash-tl-title">' + esc(m.title) + '</span>' +
        '<time>' + esc(m.time) + '</time></li>';
    }).join('');

    body.innerHTML =
      '<div class="dash-head">' +
      '  <div><span class="exercise-badge">마인드 대시보드</span>' +
      '    <h2 class="dash-type">당신은 <b>' + esc(typeName) + '</b>에 가깝습니다</h2>' +
      '    <p class="dash-date">최근 진단 ' + esc(dateStr) + ' · 총 진단 ' + history.length + '회 · 훈련 ' + logs.length + '회</p>' +
      '  </div>' +
      (hasCompare
        ? '<div class="dash-toggle" role="tablist" aria-label="훈련 전후 비교 기준">' +
          '<button data-action="mode-now" class="' + (mode === 'now' ? 'on' : '') + '">현재</button>' +
          '<button data-action="mode-prev" class="' + (mode === 'prev' ? 'on' : '') + '">' +
          (history.length === 2 ? '이전 진단 대비' : '직전 대비') + '</button>' +
          (history.length >= 3
            ? '<button data-action="mode-first" class="' + (mode === 'first' ? 'on' : '') + '">첫 진단 대비</button>'
            : '') +
          '</div>'
        : '') +
      '</div>' +
      '<div class="dash-grid">' +
      '  <section class="dash-card">' +
      '    <h3 class="dash-card-label">마인드 인바디</h3>' +
           buildDashboardDiamond(latest.scores || {}, comparing ? (baseRecord.scores || {}) : null, max) +
      (comparing
        ? '<p class="dash-legend"><i class="dash-sw now"></i>현재&nbsp;&nbsp;<i class="dash-sw ghost"></i>' +
          baseLabel + (baseRecord.date ? ' (' + new Date(baseRecord.date).toLocaleDateString('ko-KR') + ')' : '') + '</p>'
        : '') +
      '    <div class="dash-strip">' + strip + '</div>' + weakChip +
      '  </section>' +
      '  <section class="dash-card">' +
      '    <h3 class="dash-card-label">위인 싱크로율 TOP 3</h3>' +
      '    <div class="dash-sync-list">' + (syncRows || '<p class="dash-muted">데이터 없음</p>') + '</div>' +
      '    <p class="dash-hint">카드를 누르면 해당 위인 렌즈 훈련으로 이동합니다</p>' +
      '    <h3 class="dash-card-label" style="margin-top:18px">생각 깊이 4지표</h3>' +
           buildDepthBlock() +
      '  </section>' +
      '</div>' +
      buildTrendChart(history, max) +
      buildDepthTrend(logs) +
      '<section class="dash-card dash-card-wide">' +
      '  <div class="dash-tl-head"><h3 class="dash-card-label">최근 기록</h3>' +
      '  <button class="btn-outline-pill dash-tl-more" data-action="open-archive">성장 아카이브 전체 보기</button></div>' +
      '  <ul class="dash-tl">' + (tlRows || '<li class="dash-muted">기록이 없습니다</li>') + '</ul>' +
      '</section>';
  }

  /* ---------- 열기 / 닫기 ---------- */
  function openDashboard() {
    mode = 'now';
    render();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDashboard() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  window.openDashboardOverlay = openDashboard; // 외부 진입점 (선택적 사용)

  /* ---------- 이벤트 (위임 1개 + 고정 셸 버튼) ---------- */
  if (btnOpen) btnOpen.addEventListener('click', openDashboard);
  if (btnClose) btnClose.addEventListener('click', closeDashboard);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeDashboard();
  });

  body.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');

    if (action === 'mode-now') { mode = 'now'; render(); return; }
    if (action === 'mode-first') { mode = 'first'; render(); return; }
    if (action === 'mode-prev') { mode = 'prev'; render(); return; }

    if (action === 'go-diagnosis') {
      closeDashboard();
      if (typeof window.openDiagnosisOverlay === 'function') window.openDiagnosisOverlay();
      return;
    }
    if (action === 'open-archive') {
      closeDashboard();
      var t = document.getElementById('btn-header-log-trigger');
      if (t) t.click();
      return;
    }
    if (action === 'train') {
      var areaKey = el.getAttribute('data-area');
      var meta = areaMeta(areaKey);
      if (typeof mentalModels !== 'undefined' && typeof openExerciseWorkspace === 'function' && meta.thinkerKey) {
        var model = mentalModels.find(function (m) { return m.key === meta.thinkerKey; });
        if (model) { closeDashboard(); openExerciseWorkspace(model.id); }
      }
      return;
    }
  });
})();
