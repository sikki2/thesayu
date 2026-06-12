/* ============================================================
   생각PT — 마인드 대시보드 모듈 (dashboard.js) v1.0
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

  /* 비교 모드 상태: 'now'(현재) | 'compare'(첫 진단 대비) */
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

  /* ---------- HTML 이스케이프 (훈련 회고 등 사용자 입력 표시용) ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
    var hasCompare = history.length >= 2;
    var comparing = mode === 'compare' && hasCompare;
    var max = latest.maxPossible || 13;

    /* 유형 선언 */
    var typeName = latest.primaryArea && (latest.primaryArea.typeName || latest.primaryArea.name) || '—';
    var dateStr = latest.date ? new Date(latest.date).toLocaleDateString('ko-KR') : '';

    /* 영역별 점수 스트립 (비교 모드 시 변화량) */
    var strip = AREA_KEYS.map(function (k) {
      var now = (latest.scores && latest.scores[k]) || 0;
      var delta = '';
      if (comparing) {
        var diff = now - ((first.scores && first.scores[k]) || 0);
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
        ? '<div class="dash-toggle" role="tablist" aria-label="훈련 전후 비교">' +
          '<button data-action="mode-now" class="' + (comparing ? '' : 'on') + '">현재</button>' +
          '<button data-action="mode-compare" class="' + (comparing ? 'on' : '') + '">첫 진단 대비</button></div>'
        : '') +
      '</div>' +
      '<div class="dash-grid">' +
      '  <section class="dash-card">' +
      '    <h3 class="dash-card-label">마인드 인바디</h3>' +
           buildDashboardDiamond(latest.scores || {}, comparing ? (first.scores || {}) : null, max) +
      (comparing
        ? '<p class="dash-legend"><i class="dash-sw now"></i>현재&nbsp;&nbsp;<i class="dash-sw ghost"></i>첫 진단</p>'
        : '') +
      '    <div class="dash-strip">' + strip + '</div>' + weakChip +
      '  </section>' +
      '  <section class="dash-card">' +
      '    <h3 class="dash-card-label">위인 싱크로율 TOP 3</h3>' +
      '    <div class="dash-sync-list">' + (syncRows || '<p class="dash-muted">데이터 없음</p>') + '</div>' +
      '    <p class="dash-hint">카드를 누르면 해당 위인 렌즈 훈련으로 이동합니다</p>' +
      '    <h3 class="dash-card-label" style="margin-top:18px">생각 깊이 4지표</h3>' +
      '    <p class="dash-pending"><span class="diag-pending-badge">측정 대기</span> 신선도·구체도·연결도·실행도는 훈련 답변 기반 AI 분석 연동 후 제공됩니다.</p>' +
      '  </section>' +
      '</div>' +
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
    if (action === 'mode-compare') { mode = 'compare'; render(); return; }

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
