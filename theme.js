/* ============================================================
   생각PT — 테마 모듈 (theme.js v1.1)
   - 모드 3종: 'auto'(기본) | 'light' | 'dark'
       · auto  : 시간대 기반 — 오전~저녁(07:00~18:59) 라이트, 밤(19:00~06:59) 다크
       · light : 항상 라이트 / dark : 항상 다크
   - [v1.1 변경] 클릭은 항상 '지금 보이는 테마'를 뒤집도록 동작.
       내부적으로 auto→dark→light→auto 순환을 돌되, 화면 변화가 없는(보이는 테마가
       그대로인) 단계는 건너뜀 → "눌렀는데 그대로"인 낮 시간대 먹통 현상 제거.
       클릭마다 작은 토스트로 현재 모드를 명시.
   - 설정은 localStorage 전용 신규 키 'thesayu_theme_pref'에만 저장(기존 키 무접촉)
   - app.js·diagnosis.js·dashboard.js·depth.js 전역 미참조, 외부 호출 0
   ============================================================ */
(function () {
  'use strict';

  var PREF_KEY = 'thesayu_theme_pref';
  var MODES = ['auto', 'light', 'dark'];
  var DAY_START = 7, DAY_END = 19; // 07:00~18:59 라이트

  function readPref() {
    try { var v = localStorage.getItem(PREF_KEY); return MODES.indexOf(v) >= 0 ? v : 'auto'; }
    catch (e) { return 'auto'; }
  }
  function writePref(m) { try { localStorage.setItem(PREF_KEY, m); } catch (e) {} }

  // 모드 → 실제 표시 테마('light'|'dark')
  function resolveTheme(pref) {
    if (pref === 'light') return 'light';
    if (pref === 'dark') return 'dark';
    var h = new Date().getHours();
    return (h >= DAY_START && h < DAY_END) ? 'light' : 'dark';
  }
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); }
  function shownTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }

  // 버튼 아이콘은 '지금 보이는 테마' 기준(해=라이트, 달=다크), data-mode는 실제 모드(자동 점 표식용)
  function updateButton(btn, shown, pref) {
    if (!btn) return;
    btn.setAttribute('data-mode', pref);
    var icon = shown === 'dark' ? 'fa-moon' : 'fa-sun';
    var label = pref === 'auto'
      ? ('자동(시간대) · 현재 ' + (shown === 'dark' ? '다크' : '라이트') + ' — 클릭 시 전환')
      : (pref === 'dark' ? '다크 고정 — 클릭 시 전환' : '라이트 고정 — 클릭 시 전환');
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    var i = btn.querySelector('i');
    if (i) i.className = 'fa-solid ' + icon;
  }

  // 자체 토스트(앱 토스트와 분리, 충돌 0). 인라인 스타일로 CSS 추가 불필요
  var toastEl = null, toastTimer = null;
  function showToast(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.style.cssText =
        'position:fixed;left:50%;top:74px;transform:translateX(-50%) translateY(-8px);' +
        'z-index:1100;padding:8px 16px;border-radius:18px;font-size:12.5px;font-weight:500;' +
        'font-family:var(--font-sans);pointer-events:none;opacity:0;' +
        'transition:opacity .25s ease, transform .25s ease;' +
        'background:var(--card-bg-active);color:var(--text-primary);' +
        'border:1px solid var(--card-border-hover);box-shadow:0 8px 24px rgba(0,0,0,.18);' +
        'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    requestAnimationFrame(function () {
      toastEl.style.opacity = '1';
      toastEl.style.transform = 'translateX(-50%) translateY(0)';
    });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(-50%) translateY(-8px)';
    }, 1400);
  }
  function modeToast(pref, shown) {
    if (pref === 'auto') return '자동 (시간대) · 지금은 ' + (shown === 'dark' ? '다크' : '라이트');
    return pref === 'dark' ? '다크 모드' : '라이트 모드';
  }

  function withTransition(fn) {
    var root = document.documentElement;
    root.classList.add('theme-transition');
    fn();
    setTimeout(function () { root.classList.remove('theme-transition'); }, 450);
  }

  var pref = readPref();
  var btn = null, autoTimer = null;

  function startAutoWatch() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    if (pref !== 'auto') return;
    autoTimer = setInterval(function () {
      var next = resolveTheme('auto');
      if (shownTheme() !== next) withTransition(function () { applyTheme(next); updateButton(btn, next, pref); });
    }, 10 * 60 * 1000);
  }

  function nextMode(m) { return m === 'auto' ? 'dark' : (m === 'dark' ? 'light' : 'auto'); }

  // 클릭: 보이는 테마가 실제로 바뀌는 다음 모드까지 진행(변화 없는 단계는 건너뜀)
  function cycle() {
    var cur = resolveTheme(pref);   // 지금 보이는 테마
    var m = pref, t = cur, guard = 0;
    do { m = nextMode(m); t = resolveTheme(m); guard++; } while (t === cur && guard < 3);
    pref = m; writePref(pref);
    withTransition(function () { applyTheme(t); });
    updateButton(btn, t, pref);
    showToast(modeToast(pref, t));
    startAutoWatch();
  }

  function init() {
    btn = document.getElementById('btn-theme-toggle');
    var t = resolveTheme(pref);
    applyTheme(t);
    updateButton(btn, t, pref);
    startAutoWatch();
    if (btn) btn.addEventListener('click', cycle);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && pref === 'auto') {
        var next = resolveTheme('auto');
        if (shownTheme() !== next) withTransition(function () { applyTheme(next); updateButton(btn, next, pref); });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
