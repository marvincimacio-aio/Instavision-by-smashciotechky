javascript: (function () {
    if (window.igOverlay) {
        document.body.removeChild(window.igOverlay);
        delete window.igOverlay;
    }

    /* ---------------- CSS ---------------- */
        const css = `
#igPopup{ position:fixed;inset:8px;margin:auto;width:56%;max-height:88%;height:auto;background:var(--ig-bg);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.28);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial;overflow:auto;animation:igFadeIn .18s ease-out;padding-bottom:6px;font-size:13px;max-width:920px}
:root{--ig-bg:#fff;--ig-input-bg:#f7f7f7;--ig-text:#111;--ig-border:#dfe3e8;}
@media(prefers-color-scheme:dark){:root{--ig-bg:#141414;--ig-input-bg:#1f1f1f;--ig-text:#eee;--ig-border:#333;}}
/* allow explicit theme override via data-theme on the popup */
#igPopup[data-theme="dark"]{--ig-bg:#141414;--ig-input-bg:#1f1f1f;--ig-text:#eee;--ig-border:#333}
#igPopup[data-theme="light"]{--ig-bg:#fff;--ig-input-bg:#f7f7f7;--ig-text:#111;--ig-border:#dfe3e8}
#igHeader{background:linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:#fff;padding:10px 12px;text-align:center;font-size:16px;font-weight:700;border-top-left-radius:10px;border-top-right-radius:10px;display:flex;flex-direction:column;gap:8px;align-items:center;position:relative}
#igContainer{padding:12px 12px;color:var(--ig-text); height: auto}
/* Top row: separate left (input) and right (buttons) areas for better alignment */
#igTopRow{display:flex;gap:8px;align-items:center;margin:4px 0 10px 0;justify-content:flex-end;}
#igBtns{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:0;align-items:center;justify-content:flex-end}
.igBtn.secondary{padding:6px 8px;font-size:12px}
/* Instagram-like button styling: neutral by default, gradient for primary */
.igBtn{padding:8px 10px;border-radius:999px;border:1px solid rgba(0,0,0,0.06);cursor:pointer;background:transparent;color:var(--ig-text);font-weight:600;font-size:12px}
.igBtn.primary{background:linear-gradient(90deg,#405de6,#5851db);color:#fff;border:none;box-shadow:0 6px 18px rgba(88,81,219,0.12)}

/* Header input styling (moved username input into header) */
#igHeader .hdrInput{width:100%;max-width:460px;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.22);background:rgba(255,255,255,0.06);color:#fff;font-size:13px;outline:none}
#igHeader .hdrInput::placeholder{color:rgba(255,255,255,0.85)}

/* Username input wrapper and helpers */
.inputWrap{position:relative;display:flex;flex-direction:column;align-items:stretch;width:100%;max-width:460px}
.inputPrefix{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.9);font-weight:700;pointer-events:none}
.hdrInput.hasPrefix{padding-left:28px}
.hdrInput.hasClear{padding-right:34px}
.hdrClearBtn{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:rgba(255,255,255,0.95);font-size:16px;line-height:1;padding:6px;border-radius:6px;cursor:pointer}
.hdrClearBtn.hidden{display:none}
.inputHelper{font-size:11px;opacity:0.9;margin-top:6px;color:rgba(255,255,255,0.95)}
#igHeader .hdrTitle{font-size:15px;font-weight:800;letter-spacing:0.2px}
#igHeader .hdrSub{font-size:11px;opacity:0.85}
/* Fetch button responsive labels */
.btnFetchText .btnShort{display:none}
.btnFetchText .btnFull{display:inline}
.loadingText{font-weight:700}
@media (max-width: 900px) {
    .btnFetchText .btnFull{display:none}
    .btnFetchText .btnShort{display:inline}
}

/* medium screens: make popup a bit narrower and stack progress vertically on small widths */
@media (max-width: 900px) {
    #igPopup{ width:80%; max-height:92%; }
}

/* Small hint under top row */
.fetchHint{font-size:12px;opacity:0.8;text-align:center;margin-top:8px;color:var(--ig-text)}

/* When input is shown inline with buttons on wide screens */
#igTopRow .hdrInput.in-toprow{max-width:360px;flex:0 0 360px;margin-right:8px}

/* Header close icon (small X) */
.hdrClose{position:absolute;right:10px;top:10px;background:transparent;border:none;color:rgba(255,255,255,0.95);padding:6px;border-radius:8px;cursor:pointer}
.hdrClose svg{display:block}
.hdrClose:active{transform:scale(.98)}
@media (max-width:600px){.hdrClose{right:8px;top:8px;padding:10px}} 
/* Focus styles for accessibility */
.igBtn:focus{outline:none;box-shadow:0 0 0 3px rgba(0,149,246,0.18)}
.hdrInput:focus{box-shadow:0 0 0 3px rgba(255,255,255,0.12)}

/* Status area for aria-live updates */
#igStatus{font-size:13px;opacity:0.95;text-align:center;margin-top:6px;color:var(--ig-text)}
button.igBtn{padding:8px 10px;border-radius:8px;border:none;cursor:pointer;background:#0095f6;color:#fff;font-weight:700;font-size:12px;}
button.gray{background:#444;}
button.warn{background:#ff7043;}
#progressWrap{margin-top:8px;display:flex;gap:10px;align-items:center;justify-content:space-between}
/* Compact inline progress mini-cards */
.compactProgress{display:flex;gap:8px;width:100%;align-items:center}
.progressMini{display:flex;align-items:center;gap:8px;flex:1;min-width:0}
.progressLabel{min-width:76px;font-size:12px;font-weight:600;opacity:0.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.progressBarSmall{flex:1;height:8px;background:var(--ig-input-bg);border-radius:8px;overflow:hidden;position:relative;border:1px solid rgba(0,0,0,0.04)}
.progressFill{width:0%;height:100%;transition:width .18s linear;background:linear-gradient(90deg,#62a6ff,#2b7cff);border-radius:8px;box-shadow:inset 0 -6px 12px rgba(0,0,0,0.03)}
.progressPercent{min-width:40px;text-align:right;font-weight:700;font-size:12px;color:var(--ig-text);opacity:0.75;padding:2px 6px;border-radius:8px;background:rgba(0,0,0,0.04)}
.progressMini[title]{cursor:help}
.progressMini[title]{cursor:help}
#igPopup, #igHeader, #igContainer, .list-row { transition: background-color .18s ease, color .18s ease }
#tabButtons{display:flex;gap:6px;margin:8px 0;}
.tabBtn{flex:1;padding:6px 6px;border-radius:8px;border:none;background:#444;color:#fff;cursor:pointer;font-weight:600;font-size:12px}
.tabBtn.active{background:#0095f6;}
#compareListView{padding:10px 10px 20px 10px;overflow-y:auto;max-height:60vh}
.list-row{display:flex;align-items:center;padding:6px 8px;border-bottom:1px solid #2b2b2b;font-size:13px;color:#eee;gap:8px;cursor:pointer;}
.list-row:hover{background:rgba(255,255,255,0.04);transition:.12s;}
.number{width:30px;text-align:right;opacity:.6;font-family:monospace;}
.username{font-weight:700;}
.fullname{opacity:.55;margin-left:6px;font-size:12px;}
.label{margin-left:auto;font-size:12px;padding:2px 6px;border-radius:6px;font-weight:600;}
.label.red{background:#ff4c4c;color:#fff;}
.label.green{background:#4cff7a;color:#000;}
.btn-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:igSpin .8s linear infinite;margin-right:8px;vertical-align:middle}
.hidden{display:none;}
.igBtn[disabled]{opacity:.6;cursor:not-allowed}
.empty{text-align:center;padding:28px 10px;opacity:.6;}
.hidden{display:none;}
#igFooter{text-align:center;margin-top:10px;font-size:12px;color:var(--ig-text);opacity:.6;padding-bottom:8px;}
@keyframes igFadeIn{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes igSpin{to{transform:rotate(360deg)}}

/* Responsive tweaks for small screens */
@media (max-width: 600px) {
    /* Fullscreen-friendlier popup */
    #igPopup{ width:98%; inset:4px; max-height:96%; border-radius:10px; padding-bottom:12px }
    /* Header tweaks */
    #igHeader{ font-size:15px; padding:12px 14px; gap:8px }
    #igHeader .hdrInput{ max-width:100%; padding:12px 14px; font-size:15px; border-radius:10px }
    #igContainer{ padding:10px; }

    /* Stack buttons and make them full-width for easy tapping */
    #igTopRow{ flex-direction:column; align-items:stretch; gap:8px; margin:8px 0 }
    #igBtns{ display:flex; flex-direction:column; gap:8px; }
    #igBtns .igBtn, #igBtns .igBtn.gray, #igBtns .igBtn.warn { width:100%; padding:12px 14px; font-size:15px; border-radius:10px }

    /* make the input wrapper full width and helper visible on mobile */
    #igUserWrap{ width:100%; max-width:100%; }
    #igUserHelper{ display:block }

    /* Make progress bars taller for readability */
    .progressBarSmall{ height:12px; border-radius:10px }
    .progressPercent{ font-size:13px }

    /* Tabs: allow horizontal scrolling when buttons overflow */
    #tabButtons{ display:flex; gap:8px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:6px }
    .tabBtn{ flex:0 0 auto; min-width:120px; padding:10px 12px; font-size:14px }

    /* List rows: bigger touch targets and wrapping */
    .list-row{ font-size:15px; padding:12px; align-items:flex-start; gap:12px }
    .number{ width:36px; flex:0 0 36px }
    .fullname{ display:block; margin-left:0; opacity:0.75 }

    /* Fetch button label handling already defined; ensure spinner spacing */
    .btn-spinner{ margin-right:10px }

    /* Hint spacing */
    .fetchHint{ font-size:13px; margin-top:10px }
}

/* very small devices: stack progress cards vertically for clarity */
@media (max-width: 460px) {
    #progressWrap .compactProgress{ flex-direction:column; gap:10px }
    .progressMini{ width:100%; }
}

/* Wide-screen layout: allow input to sit inline with buttons */
@media (min-width: 992px) {
    #igHeader{flex-direction:row;align-items:center;justify-content:space-between}
    #igHeader .hdrTitle, #igHeader .hdrSub{ text-align:left }
    /* when input stays in header on wide screens it should be smaller */
    #igHeader .hdrInput{max-width:360px}
    /* ensure compact top row alignment */
    #igTopRow{align-items:center}
}

/* Avatar and list-row responsiveness */
.avatar{width:36px;height:36px;flex:0 0 36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:#fff;background:linear-gradient(90deg,#405de6,#5851db);margin-right:8px}
.list-row{align-items:center}
.list-row .username{max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.list-row .fullname{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media (max-width: 600px){
    .avatar{width:44px;height:44px;font-size:16px}
    .list-row .username{max-width:140px}
}

/* Ensure input wrapper can be inline in top row */
#igTopRow .inputWrap.in-toprow{max-width:420px;flex:1 1 420px;margin-right:8px}

/* When the wrapper is placed inline in the top row, lay out horizontally and let the input grow */
.inputWrap.in-toprow{flex-direction:row;align-items:center}
.inputWrap.in-toprow .inputHelper{display:none}
.inputWrap.in-toprow .inputPrefix{left:12px}
.inputWrap.in-toprow .hdrClearBtn{right:8px}

/* allow the input to flex and shrink properly when inside the top row */
#igTopRow .hdrInput.in-toprow{max-width:none;flex:1 1 auto;min-width:140px;box-sizing:border-box}
#igHeader .hdrInput{min-width:0}

/* Slightly larger touch targets for primary buttons */
.igBtn{min-height:40px;padding-left:12px;padding-right:12px}
.tabBtn{padding:8px 10px}
`;
    const st = document.createElement("style");
    st.innerHTML = css;
    document.body.appendChild(st);

    /* ---------------- UI ---------------- */
        const popup = document.createElement("div");
        popup.id = "igPopup";
                popup.innerHTML = `
<div id="igHeader">
    <button id="btnHeaderClose" class="hdrClose" aria-label="Close Instavision">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button id="btnThemeToggle" class="hdrClose" aria-label="Toggle theme" title="Toggle theme" style="right:44px;">🌙</button>
    <div id="igUserWrap" class="inputWrap">
        <span class="inputPrefix">@</span>
        <input id="igUser" class="hdrInput hasPrefix hasClear" placeholder="Enter username (without @)" aria-label="Instagram username" aria-describedby="igUserHelper">
        <button id="btnClearUser" class="hdrClearBtn hidden" aria-label="Clear username">×</button>
        <div id="igUserHelper" class="inputHelper">Enter username (without @)</div>
    </div>
    <div class="hdrTitle" style="display:flex;align-items:center;gap:10px">
        <svg class="hdrLogo" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="11" r="3" stroke="currentColor" stroke-width="1.2"/></svg>
        <div style="display:flex;flex-direction:column;line-height:1">
            <span style="font-weight:800">Instavision</span>
            <span style="font-size:11px;opacity:.9;margin-top:1px">by smashciotechky</span>
        </div>
    </div>
    <div class="hdrSub">Fetch followers & following, save sessions, and compare</div>
    <div id="igStatus" role="status" aria-live="polite" class="fetchHint"></div>
</div>
<div id="igContainer">
        <div id="igTopRow">
        <div id="igBtns">
                            <button class="igBtn primary" id="btnFetch" title="Fetch followers and following"><span class="btn-spinner hidden" id="btnFetchSpinner"></span><span class="btnFetchText"><span class="btnFull">Fetch Followers & Following</span><span class="btnShort">Fetch</span></span></button>
                        <button class="igBtn warn secondary" id="btnCompare" title="Compare followers and following">Compare</button>
                        <button class="igBtn secondary" id="btnSaveSession" title="Save current fetched lists">Save</button>
                        <button class="igBtn gray secondary hidden" id="btnCancel" title="Cancel ongoing fetch">Cancel</button>
                        <button class="igBtn gray secondary" id="btnClose" title="Close overlay">Close</button>
        </div>
    </div>
        <div class="fetchHint">Tip: click <strong>Compare</strong> to compute diffs (Don’t Follow Me Back / I Don’t Follow Back)</div>
        <div id="progressWrap">
            <div class="compactProgress" role="group" aria-label="Fetch progress">
                <div class="progressMini" id="progFollowers" title="Idle">
                    <div class="progressLabel">Followers</div>
                    <div class="progressBarSmall" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="progressFillFollowers" class="progressFill"></div></div>
                    <div id="progressPercentFollowers" class="progressPercent">0%</div>
                </div>
                <div class="progressMini" id="progFollowing" title="Idle">
                    <div class="progressLabel">Following</div>
                    <div class="progressBarSmall" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="progressFillFollowing" class="progressFill"></div></div>
                    <div id="progressPercentFollowing" class="progressPercent">0%</div>
                </div>
            </div>
        </div>
    <div id="tabButtons">
    <button class="tabBtn active" data-tab="followersBox">Followers</button>
    <button class="tabBtn" data-tab="followingBox">Following</button>
    <button class="tabBtn" data-tab="dontFollowMeBackBox">Don't Follow Me Back</button>
    <button class="tabBtn" data-tab="iDontFollowBackBox">I Don't Follow Back</button>
        <button class="tabBtn" data-tab="sessionsBox">Sessions</button>
  </div>
    <div id="compareListView">
    <div id="followersBox"></div>
    <div id="followingBox" class="hidden"></div>
    <div id="dontFollowMeBackBox" class="hidden"></div>
    <div id="iDontFollowBackBox" class="hidden"></div>
        <div id="sessionsBox" class="hidden"></div>
  </div>
  <div id="igFooter">Instavision by smashciotechky• smashciotechky</div>
</div>`;
    document.body.appendChild(popup);
    window.igOverlay = popup;

    // Reflow helper: move the username input into #igTopRow on wide screens
    (function setupHeaderReflow() {
        const mqWidth = 992;
        let resizeTimer = null;
        function reflow() {
            try {
                const input = document.getElementById('igUser');
                const inputWrap = document.getElementById('igUserWrap') || input;
                const topRow = document.getElementById('igTopRow');
                const header = document.getElementById('igHeader');
                if (!input || !topRow || !header) return;
                const wide = window.innerWidth >= mqWidth;
                if (wide && !topRow.contains(inputWrap)) {
                    // move wrapper (keeps helper + clear button) into top row, before the buttons
                    input.classList.add('in-toprow');
                    if (inputWrap && inputWrap.classList) inputWrap.classList.add('in-toprow');
                    // preserve focus / selection when moving
                    const hadFocus = document.activeElement === input;
                    topRow.insertBefore(inputWrap, topRow.firstChild);
                    if (hadFocus) try { input.focus({ preventScroll: true }); } catch (e) {}
                } else if (!wide && !header.contains(inputWrap)) {
                    // move wrapper back into header, before title
                    input.classList.remove('in-toprow');
                    if (inputWrap && inputWrap.classList) inputWrap.classList.remove('in-toprow');
                    const title = header.querySelector('.hdrTitle');
                    const hadFocus = document.activeElement === input;
                    header.insertBefore(inputWrap, title || header.firstChild);
                    if (hadFocus) try { input.focus({ preventScroll: true }); } catch (e) {}
                }
            } catch (e) {}
        }
        // initial placement
        reflow();
        // debounced resize listener
        window.addEventListener('resize', () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { reflow(); resizeTimer = null; }, 120);
        });
    })();

    // Theme toggle: persist and apply dark/light mode via data-theme on popup
    (function setupThemeToggle() {
        try {
            const popupEl = window.igOverlay || document.getElementById('igPopup');
            const btn = document.getElementById('btnThemeToggle');
            if (!popupEl || !btn) return;

            function applyTheme(t) {
                try {
                    popupEl.setAttribute('data-theme', t);
                    localStorage.setItem('ig_theme', t);
                    // update button visual
                    btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
                    btn.title = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
                    btn.textContent = t === 'dark' ? '🌙' : '☀️';
                } catch (e) {}
            }

            // initial: prefer saved, else system preference
            const saved = localStorage.getItem('ig_theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = saved || (prefersDark ? 'dark' : 'light');
            applyTheme(initial);

            btn.onclick = () => {
                const cur = popupEl.getAttribute('data-theme') || 'light';
                applyTheme(cur === 'dark' ? 'light' : 'dark');
            };
        } catch (e) {}
    })();

    // UX improvements: autofocus input, clear button, and keyboard shortcuts
    try {
        const userInput = document.getElementById('igUser');
        const clearBtn = document.getElementById('btnClearUser');
        const helper = document.getElementById('igUserHelper');
        if (userInput) {
            userInput.focus({ preventScroll: true });
            // Enter to fetch (convenience)
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // trigger combined fetch
                    const btn = document.getElementById('btnFetch');
                    if (btn && !btn.disabled) btn.click();
                }
            });

            // strip a leading @ automatically while user types so existing code can read value directly
            userInput.addEventListener('input', (e) => {
                try {
                    const v = e.target.value || '';
                    if (v.startsWith('@')) {
                        e.target.value = v.slice(1);
                        return;
                    }
                    // toggle clear button
                    if (clearBtn) {
                        clearBtn.classList.toggle('hidden', !e.target.value);
                    }
                    // small helper feedback
                    if (helper) {
                        if (!e.target.value) helper.textContent = 'Enter username (without @)';
                        else if (e.target.value.length < 3) helper.textContent = 'Username looks short';
                        else helper.textContent = '';
                    }
                } catch (ex) {}
            });

            // clear button
            if (clearBtn) {
                clearBtn.onclick = (ev) => {
                    ev.preventDefault();
                    try { userInput.value = ''; userInput.focus(); } catch (e) {}
                    if (helper) helper.textContent = 'Enter username (without @)';
                    clearBtn.classList.add('hidden');
                };
                // initialize visibility
                clearBtn.classList.toggle('hidden', !userInput.value);
            }
        }

        // Esc to close overlay
        document.addEventListener('keydown', function escClose(e) {
            if (e.key === 'Escape') {
                try { document.body.removeChild(window.igOverlay); delete window.igOverlay; }
                catch (ex) {}
            }
        });
    } catch (e) {}

    // show logged-in session info (best-effort detection)
    function getLoggedInUsername() {
        try {
            // try legacy shared data
            const sd = window._sharedData || window.__initialData || window.__INITIAL_STATE__;
            if (sd) {
                // common locations
                if (sd.config && sd.config.viewer && sd.config.viewer.username) return sd.config.viewer.username;
                if (sd.config && sd.config.viewer_username) return sd.config.viewer_username;
                if (sd.viewer && sd.viewer.username) return sd.viewer.username;
                // entry_data may contain profile info
                if (sd.entry_data) {
                    for (const k in sd.entry_data) {
                        const v = sd.entry_data[k];
                        if (Array.isArray(v) && v[0] && v[0].graphql && v[0].graphql.user && v[0].graphql.user.username) return v[0].graphql.user.username;
                    }
                }
            }
        } catch (e) {}

        // cookie fallback: Instagram stores username in `ds_user` cookie when logged in
        try {
            const m = document.cookie.match(/(?:^|;\s*)ds_user=([^;]+)/);
            if (m && m[1]) return decodeURIComponent(m[1]);
        } catch (e) {}

        // DOM heuristics: find a profile link in the header/nav
        try {
            const sel = document.querySelector('header a[href^="/"]') || document.querySelector('nav a[href^="/"]');
            if (sel) {
                const href = sel.getAttribute('href') || '';
                if (href && href.length > 1) {
                    // exclude common app routes that are not usernames
                    const reserved = new Set(['explore','accounts','notifications','direct','p','tags','about','settings','stories','activity','graphql','developer']);
                    // /username/ -> extract username but avoid reserved names
                    const m = href.match(/^\/(?!p\/|explore|accounts|notifications|direct|tags|about|settings|stories|activity|graphql|developer)([A-Za-z0-9._]+)\/?$/);
                    if (m) {
                        const cand = m[1];
                        if (!reserved.has(cand.toLowerCase())) return cand;
                    }
                }
                const img = sel.querySelector('img');
                if (img && img.alt) {
                    // alt might contain username or "username's profile photo"
                    const a = img.alt.split("'")[0].trim();
                    if (a) {
                        const low = a.toLowerCase();
                        if (!['notifications','activity','messages','home','search'].includes(low)) return a;
                    }
                }
            }
        } catch (e) {}

        // meta description fallback
        try {
            const desc = document.querySelector('meta[name="description"]')?.content || document.querySelector('meta[property="og:description"]')?.content;
            if (desc) {
                const m = desc.match(/@?([A-Za-z0-9._]{3,30})\b/);
                if (m) return m[1];
            }
        } catch (e) {}

        return null;
    }

    // Session info removed: do not show detected logged-in username in the UI

    /* ---------------- Helpers ---------------- */
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let currentAbortController = null; // current running fetch controller
    let statusClearTimeout = null;
    // show/hide loading spinner in the Fetch button and manage cancel/status
    function setFetchLoading(loading) {
        const btn = document.getElementById('btnFetch');
        const spinner = document.getElementById('btnFetchSpinner');
        const txt = btn ? btn.querySelector('.btnFetchText') : null;
        const cancelBtn = document.getElementById('btnCancel');
        if (!btn || !spinner || !txt) return;
        // clear any pending status clear timeout
        if (statusClearTimeout) { clearTimeout(statusClearTimeout); statusClearTimeout = null; }
        if (loading) {
            spinner.classList.remove('hidden');
            btn.disabled = true;
            txt.innerHTML = '<span class="loadingText">Fetching...</span>';
            if (cancelBtn) cancelBtn.classList.remove('hidden');
            const st = document.getElementById('igStatus'); if (st) st.textContent = 'Fetching lists…';
        } else {
            spinner.classList.add('hidden');
            btn.disabled = false;
            txt.innerHTML = '<span class="btnFull">Fetch Followers & Following</span><span class="btnShort">Fetch</span>';
            if (cancelBtn) cancelBtn.classList.add('hidden');
            const st = document.getElementById('igStatus'); if (st) {
                // leave a short success message then clear
                st.textContent = 'Done';
                statusClearTimeout = setTimeout(() => { st.textContent = ''; statusClearTimeout = null; }, 3000);
            }
        }
    }
    function setProgress(type, p, text) {
        if (type === "followers") {
            const pct = Math.min(100, Math.round(p || 0));
            const fill = $("#progressFillFollowers"); if (fill) fill.style.width = pct + "%";
            const pctEl = $("#progressPercentFollowers"); if (pctEl) { pctEl.textContent = pct + "%"; pctEl.style.opacity = pct === 100 ? '0.95' : '0.75'; }
            const wrapper = $("#progFollowers"); if (wrapper) { wrapper.title = text || `${pct}%`; const bar = wrapper.querySelector('.progressBarSmall'); if (bar) bar.setAttribute('aria-valuenow', String(pct)); }
        } else if (type === "following") {
            const pct = Math.min(100, Math.round(p || 0));
            const fill = $("#progressFillFollowing"); if (fill) fill.style.width = pct + "%";
            const pctEl = $("#progressPercentFollowing"); if (pctEl) { pctEl.textContent = pct + "%"; pctEl.style.opacity = pct === 100 ? '0.95' : '0.75'; }
            const wrapper = $("#progFollowing"); if (wrapper) { wrapper.title = text || `${pct}%`; const bar = wrapper.querySelector('.progressBarSmall'); if (bar) bar.setAttribute('aria-valuenow', String(pct)); }
        }
    }

    /* ---------------- Networking ---------------- */
    // safeFetch accepts an optional AbortSignal to allow cancellation
    async function safeFetch(url, retries = 2, signal) {
        for (let i = 0; i <= retries; i++) {
            try {
                const r = await fetch(url, signal ? { signal } : undefined);
                if (!r.ok) throw new Error("HTTP " + r.status);
                return await r.json();
            } catch (e) {
                if (e && e.name === 'AbortError') throw e;
                if (i === retries) throw e;
                await sleep(200 + i * 200);
            }
        }
    }

    async function getUserMeta(u, signal) {
        const s = await safeFetch("https://www.instagram.com/web/search/topsearch/?query=" + encodeURIComponent(u), 2, signal);
        if (!s?.users?.length) throw new Error("User not found");
        const pk = s.users[0].user.pk;
        const jf = await safeFetch(
            "https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=" +
                encodeURIComponent(JSON.stringify({ id: pk, first: 1 })),
            2,
            signal
        );
        const followersCount = jf?.data?.user?.edge_followed_by?.count || 0;
        const jg = await safeFetch(
            "https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=" +
                encodeURIComponent(JSON.stringify({ id: pk, first: 1 })),
            2,
            signal
        );
        const followingCount = jg?.data?.user?.edge_follow?.count || 0;
        return { pk, followersCount, followingCount };
    }

    async function fetchListAll(pk, type, totalEstimate, signal) {
        const hash = type === "followers" ? "c76146de99bb02f6415203be841dd25a" : "d04b0a864b4b54837c0d870b0e77e076";
        const pageSize = 100;
        let after = null,
            hasNext = true,
            out = [],
            fetched = 0;
        while (hasNext) {
            const vars = { id: pk, include_reel: true, fetch_mutual: false, first: pageSize, after };
            const url =
                "https://www.instagram.com/graphql/query/?query_hash=" +
                hash +
                "&variables=" +
                encodeURIComponent(JSON.stringify(vars));
            const j = await safeFetch(url, 2, signal);
            const edges = type === "followers" ? j?.data?.user?.edge_followed_by : j?.data?.user?.edge_follow;
            if (!edges) break;
            const nodes = edges.edges.map((e) => ({ usern: e.node?.username || "", full_name: e.node?.full_name || "" }));
            out.push(...nodes);
            fetched += nodes.length;
            if (totalEstimate) {
                setProgress(
                    type,
                    (fetched / totalEstimate) * 100,
                    `${type.charAt(0).toUpperCase() + type.slice(1)}: ${fetched}/${totalEstimate}`
                );
            } else {
                setProgress(type, fetched % 100, `${type.charAt(0).toUpperCase() + type.slice(1)}: ${fetched} fetched`);
            }
            hasNext = edges.page_info.has_next_page;
            after = edges.page_info.end_cursor;
            await sleep(120);
        }
        setProgress(type, 100, `${type.charAt(0).toUpperCase() + type.slice(1)} fetched: ${out.length}`);
        return out;
    }

    /* ---------------- Renderers ---------------- */
    let followers = [],
        followings = [],
        dontFollowMeBack = [],
        iDontFollowBack = [];
    function renderList(containerId, dataArray, title, labelType) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        const header = document.createElement("div");
        header.style.cssText =
            "font-size:16px;font-weight:700;padding:10px 0;margin-bottom:8px;border-bottom:1px solid #444;color:#fff;";
        header.innerText = `${title} (${dataArray.length})`;

        // Search input wrapper
        const searchWrap = document.createElement("div");
        searchWrap.style.cssText = "margin:8px 0;";
        const searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.placeholder = "Filter by username or name";
        searchInput.style.cssText =
            "width:100%;padding:8px;border-radius:8px;border:1px solid var(--ig-border);background:var(--ig-input-bg);color:var(--ig-text);box-sizing:border-box;";
        searchWrap.appendChild(searchInput);

        container.appendChild(header);
        container.appendChild(searchWrap);

        const listContent = document.createElement("div");
        listContent.className = "list-content";
        container.appendChild(listContent);

        const makeRows = (arr) => {
            listContent.innerHTML = "";
            header.innerText = `${title} (${arr.length})`;
            if (!arr || !arr.length) {
                listContent.innerHTML = '<div class="empty">No data found</div>';
                return;
            }
            arr.forEach((item, index) => {
                const row = document.createElement("div");
                row.className = "list-row";
                let label = "";
                if (labelType === "followers" && iDontFollowBack.some((u) => u.usern === item.usern))
                    label = '<span class="label red">I Don\'t Follow Back</span>';
                if (labelType === "following" && dontFollowMeBack.some((u) => u.usern === item.usern))
                    label = '<span class="label red">Don\'t Follow Me Back</span>';
                // preserve original fetched index when showing filtered results
                const originalIndex = dataArray.findIndex((u) => u.usern === item.usern);
                const displayIndex = originalIndex >= 0 ? originalIndex + 1 : index + 1;
                const initial = (item.usern || '').charAt(0).toUpperCase() || '?';
                row.innerHTML = `<span class="avatar">${initial}</span><div style="flex:1;display:flex;gap:8px;align-items:center"><span class="number">${displayIndex}.</span><div style="display:flex;flex-direction:column;min-width:0"><span class="username">${item.usern}</span><span class="fullname">${item.full_name}</span></div></div>${label}`;
                row.onclick = () => window.open("https://instagram.com/" + item.usern, "_blank");
                listContent.appendChild(row);
            });
        };

        // initial render
        makeRows(dataArray);

        // live filtering
        searchInput.addEventListener("input", (e) => {
            const q = (e.target.value || "").trim().toLowerCase();
            if (!q) return makeRows(dataArray);
            const filtered = dataArray.filter((item) => {
                const uname = (item.usern || "").toLowerCase();
                const fname = (item.full_name || "").toLowerCase();
                return uname.includes(q) || fname.includes(q);
            });
            makeRows(filtered);
        });
    }

    function showCompareLists() {
        renderList("followersBox", followers, "Followers", "followers");
        renderList("followingBox", followings, "Following", "following");
        renderList("dontFollowMeBackBox", dontFollowMeBack, "Don’t Follow Me Back");
        renderList("iDontFollowBackBox", iDontFollowBack, "I Don’t Follow Back");
        updateTabCounts();
    }

    // Programmatically activate a tab by its content box id (e.g. 'followersBox')
    function setActiveTab(targetId) {
        // hide all content panels
        $$('div#compareListView > div').forEach((div) => div.classList.add('hidden'));
        // show target panel
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
        // update tab button active state
        $$('.tabBtn').forEach((b) => b.classList.remove('active'));
        const btn = Array.from($$('.tabBtn')).find((b) => b.dataset.tab === targetId);
        if (btn) btn.classList.add('active');
    }

    // Render only the fetched lists (used after fetch completes).
    // This intentionally does NOT compute or display the compare results
    // (Don't Follow Me Back / I Don't Follow Back). The Compare action
    // will run only when the user clicks the Compare button.
    function renderFetchedLists() {
        renderList("followersBox", followers, "Followers", "followers");
        renderList("followingBox", followings, "Following", "following");
        updateTabCounts();
        // After fetching, automatically switch the UI to show Followers
        setActiveTab('followersBox');
    }

    function updateTabCounts() {
        $$(".tabBtn").forEach((b) => {
            const t = b.dataset.tab;
            if (t === "followersBox") b.textContent = `Followers (${followers.length})`;
            else if (t === "followingBox") b.textContent = `Following (${followings.length})`;
            
            else if (t === "dontFollowMeBackBox") b.textContent = `Don't Follow Me Back (${dontFollowMeBack.length})`;
            else if (t === "iDontFollowBackBox") b.textContent = `I Don't Follow Back (${iDontFollowBack.length})`;
        });
    }

    /* ---------------- Sessions (localStorage) ---------------- */
    const SESS_KEY = 'ig_sessions_v1';

    function getSessions() {
        try {
            const raw = localStorage.getItem(SESS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function persistSessions(sessions) {
        localStorage.setItem(SESS_KEY, JSON.stringify(sessions || []));
    }

    function saveSession() {
        if ((!followers || !followers.length) && (!followings || !followings.length)) return alert('Nothing to save — fetch followers or following first');
        const name = prompt('Session name (optional)', new Date().toLocaleString());
        const sessions = getSessions();
        const id = Date.now().toString(36);
        // capture detected logged-in username (if any) so sessions show which account created them
        const detectedUser = (typeof getLoggedInUsername === 'function') ? getLoggedInUsername() : null;
        sessions.unshift({ id, name: name || '', ts: Date.now(), username: detectedUser || '', followers: followers.slice(), followings: followings.slice() });
        persistSessions(sessions);
        renderSessions();
        alert('Session saved' + (detectedUser ? ` (as @${detectedUser})` : ''));
    }

    function deleteSession(id) {
        let sessions = getSessions();
        sessions = sessions.filter((s) => s.id !== id);
        persistSessions(sessions);
        renderSessions();
    }

    function loadSession(id) {
        const sessions = getSessions();
        const s = sessions.find((x) => x.id === id);
        if (!s) return alert('Session not found');
        followers = s.followers.slice();
        followings = s.followings.slice();
        showCompareLists();
        alert('Session loaded: ' + (s.name || new Date(s.ts).toLocaleString()));
    }

    function renderSessions() {
        const box = document.getElementById('sessionsBox');
        box.innerHTML = '';
        const hdr = document.createElement('div');
        hdr.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';
        const chkInfo = document.createElement('div');
        chkInfo.textContent = 'Select two sessions to compare';
        chkInfo.style.opacity = '.8';
        hdr.appendChild(chkInfo);
        const btnCompareSel = document.createElement('button');
        btnCompareSel.className = 'igBtn';
        btnCompareSel.textContent = 'Compare Selected';
        btnCompareSel.onclick = () => compareSelectedSessions();
        hdr.appendChild(btnCompareSel);
        const btnClearAll = document.createElement('button');
        btnClearAll.className = 'igBtn gray';
        btnClearAll.textContent = 'Clear All';
        btnClearAll.onclick = () => {
            if (!confirm('Delete all saved sessions?')) return;
            persistSessions([]);
            renderSessions();
        };
        hdr.appendChild(btnClearAll);
        box.appendChild(hdr);

        const sessions = getSessions();
        if (!sessions.length) {
            box.innerHTML += '<div class="empty">No saved sessions</div>';
            return;
        }

        const list = document.createElement('div');
        list.style.display = 'flex';
        list.style.flexDirection = 'column';
        list.style.gap = '8px';

        sessions.forEach((s) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.gap = '8px';
            row.style.alignItems = 'center';
            row.style.padding = '8px';
            row.style.border = '1px solid rgba(255,255,255,0.04)';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.dataset.sid = s.id;
            row.appendChild(cb);
            const meta = document.createElement('div');
            meta.style.flex = '1';
            const titleLine = `<div style="font-weight:700">${s.name || 'Session'}${s.username ? ' — @'+s.username : ''}</div>`;
            const infoLine = `<div style="font-size:12px;opacity:.7">${new Date(s.ts).toLocaleString()} — Followers: ${s.followers.length} · Following: ${s.followings.length}</div>`;
            meta.innerHTML = titleLine + infoLine;
            row.appendChild(meta);
            const btnLoad = document.createElement('button');
            btnLoad.className = 'igBtn';
            btnLoad.textContent = 'Load';
            btnLoad.onclick = () => loadSession(s.id);
            row.appendChild(btnLoad);
            const btnDel = document.createElement('button');
            btnDel.className = 'igBtn gray';
            btnDel.textContent = 'Delete';
            btnDel.onclick = () => { if (confirm('Delete this session?')) deleteSession(s.id); };
            row.appendChild(btnDel);
            list.appendChild(row);
        });

        box.appendChild(list);
        const out = document.createElement('div');
        out.id = 'sessionCompareResult';
        out.style.marginTop = '12px';
        box.appendChild(out);
    }

    function compareSelectedSessions() {
        const box = document.getElementById('sessionsBox');
        const checked = Array.from(box.querySelectorAll('input[type=checkbox]:checked')).map((c) => c.dataset.sid);
        if (checked.length !== 2) return alert('Please select exactly two sessions to compare');
        compareSessions(checked[0], checked[1]);
    }

    function compareSessions(idA, idB) {
        const sessions = getSessions();
        const A = sessions.find((s) => s.id === idA);
        const B = sessions.find((s) => s.id === idB);
        if (!A || !B) return alert('Sessions not found');

        // Followers diff
        const aFollowersSet = new Set(A.followers.map((u) => u.usern));
        const bFollowersSet = new Set(B.followers.map((u) => u.usern));
        const addedFollowers = B.followers.filter((u) => !aFollowersSet.has(u.usern));
        const removedFollowers = A.followers.filter((u) => !bFollowersSet.has(u.usern));

        // Followings diff
        const aFollowingsSet = new Set(A.followings.map((u) => u.usern));
        const bFollowingsSet = new Set(B.followings.map((u) => u.usern));
        const addedFollowings = B.followings.filter((u) => !aFollowingsSet.has(u.usern));
        const removedFollowings = A.followings.filter((u) => !bFollowingsSet.has(u.usern));

        const out = document.getElementById('sessionCompareResult');
        out.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Comparing '${A.name||new Date(A.ts).toLocaleString()}' → '${B.name||new Date(B.ts).toLocaleString()}'</div>`;
        const wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.gap = '12px';
        wrap.style.flexWrap = 'wrap';

        const makeCol = (title, arr) => {
            const c = document.createElement('div');
            c.style.minWidth = '220px';
            c.innerHTML = `<div style="font-weight:700">${title} (${arr.length})</div>`;
            if (!arr.length) { c.innerHTML += '<div class="empty">None</div>'; return c; }
            const ul = document.createElement('div');
            ul.style.marginTop = '6px';
            arr.slice(0, 500).forEach((it, i) => { // limit to first 500
                const r = document.createElement('div');
                r.style.padding = '4px 0';
                r.style.borderBottom = '1px dotted rgba(255,255,255,0.03)';
                r.textContent = `${i+1}. ${it.usern} ${it.full_name?(' — '+it.full_name):''}`;
                ul.appendChild(r);
            });
            c.appendChild(ul);
            return c;
        };

        // Followers section (Added / Removed)
        const followersSection = document.createElement('div');
        followersSection.style.minWidth = '280px';
        followersSection.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Followers</div>`;
        const fWrap = document.createElement('div'); fWrap.style.display = 'flex'; fWrap.style.gap = '12px';
        fWrap.appendChild(makeCol('Added in B', addedFollowers));
        fWrap.appendChild(makeCol('Removed from A', removedFollowers));
        followersSection.appendChild(fWrap);

        // Followings section (Added / Removed)
        const followingsSection = document.createElement('div');
        followingsSection.style.minWidth = '280px';
        followingsSection.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Following</div>`;
        const gWrap = document.createElement('div'); gWrap.style.display = 'flex'; gWrap.style.gap = '12px';
        gWrap.appendChild(makeCol('Added in B', addedFollowings));
        gWrap.appendChild(makeCol('Removed from A', removedFollowings));
        followingsSection.appendChild(gWrap);

        wrap.appendChild(followersSection);
        wrap.appendChild(followingsSection);
        out.appendChild(wrap);
    }

    // initial render of sessions
    renderSessions();

    /* ---------------- Actions ---------------- */
    async function actionFetchFollowers() {
        const username = $("#igUser").value.trim();
        if (!username) return alert("Enter username");
        setProgress("followers", 0, "Fetching Followers...");
        // make this fetch cancelable
        currentAbortController = new AbortController();
        setFetchLoading(true);
        try {
            const meta = await getUserMeta(username, currentAbortController.signal);
            followers = await fetchListAll(meta.pk, "followers", meta.followersCount, currentAbortController.signal);
            // Render only fetched lists; do not auto-run Compare
            renderFetchedLists();
        } catch (err) {
            if (err && err.name === 'AbortError') {
                const st = document.getElementById('igStatus'); if (st) st.textContent = 'Fetch cancelled';
            } else {
                console.error(err);
                alert('Error fetching followers: ' + (err && err.message ? err.message : String(err)));
            }
        } finally {
            currentAbortController = null;
            setFetchLoading(false);
            setProgress("followers", 0, "Idle");
        }
    }
    async function actionFetchFollowing() {
        const username = $("#igUser").value.trim();
        if (!username) return alert("Enter username");
        setProgress("following", 0, "Fetching Following...");
        // make this fetch cancelable
        currentAbortController = new AbortController();
        setFetchLoading(true);
        try {
            const meta = await getUserMeta(username, currentAbortController.signal);
            followings = await fetchListAll(meta.pk, "following", meta.followingCount, currentAbortController.signal);
            // Render only fetched lists; do not auto-run Compare
            renderFetchedLists();
        } catch (err) {
            if (err && err.name === 'AbortError') {
                const st = document.getElementById('igStatus'); if (st) st.textContent = 'Fetch cancelled';
            } else {
                console.error(err);
                alert('Error fetching following: ' + (err && err.message ? err.message : String(err)));
            }
        } finally {
            currentAbortController = null;
            setFetchLoading(false);
            setProgress("following", 0, "Idle");
        }
    }
    function actionCompare() {
        if (!followers.length || !followings.length) return alert("Fetch both lists first!");
        const fSet = new Set(followers.map((u) => u.usern));
        const gSet = new Set(followings.map((u) => u.usern));
        dontFollowMeBack = followings.filter((u) => !fSet.has(u.usern));
        iDontFollowBack = followers.filter((u) => !gSet.has(u.usern));
        showCompareLists();
    }

    /* ---------------- Tab Buttons ---------------- */
    $$(".tabBtn").forEach((btn) => {
        btn.onclick = () => {
            $$("div#compareListView > div").forEach((div) => div.classList.add("hidden"));
            const target = btn.dataset.tab;
            document.getElementById(target).classList.remove("hidden");
            $$(".tabBtn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
        };
    });

    /* ---------------- Button Wiring ---------------- */
    $("#btnFetch").onclick = actionFetchBoth;
    $("#btnSaveSession").onclick = saveSession;
    $("#btnCompare").onclick = actionCompare;
    $("#btnClose").onclick = () => {
        try {
            document.body.removeChild(window.igOverlay);
            delete window.igOverlay;
        } catch (e) {}
    };
    // header close (small X) — wire to same close behavior for quick dismissal
    const hdrCloseBtn = document.getElementById('btnHeaderClose');
    if (hdrCloseBtn) hdrCloseBtn.onclick = $("#btnClose").onclick;
    // Cancel button wiring (abort ongoing fetch)
    const cancelBtn = document.getElementById('btnCancel');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            if (currentAbortController) {
                try { currentAbortController.abort(); } catch (e) {}
            }
            // update UI
            setFetchLoading(false);
            const st = document.getElementById('igStatus'); if (st) st.textContent = 'Cancelled';
        };
        // hide by default
        cancelBtn.classList.add('hidden');
    }

    setProgress("followers", 0, "Idle");
    setProgress("following", 0, "Idle");

    // Combined fetch: fetch followers then following for the given username
    async function actionFetchBoth() {
        const username = $("#igUser").value.trim();
        if (!username) return alert("Enter username");
        setProgress("followers", 0, "Fetching Followers...");
        setProgress("following", 0, "Fetching Following...");
        // make combined fetch cancelable
        currentAbortController = new AbortController();
        setFetchLoading(true);
        try {
            const meta = await getUserMeta(username, currentAbortController.signal);
            // fetch followers first (so progress fills independently)
            followers = await fetchListAll(meta.pk, "followers", meta.followersCount, currentAbortController.signal);
            // then fetch following
            followings = await fetchListAll(meta.pk, "following", meta.followingCount, currentAbortController.signal);
            // Render only fetched lists; user must click Compare to compute diffs
            renderFetchedLists();
        } catch (err) {
            if (err && err.name === 'AbortError') {
                const st = document.getElementById('igStatus'); if (st) st.textContent = 'Fetch cancelled';
            } else {
                console.error(err);
                alert('Error fetching lists: ' + (err && err.message ? err.message : String(err)));
            }
            setProgress("followers", 0, "Idle");
            setProgress("following", 0, "Idle");
        } finally {
            currentAbortController = null;
            setFetchLoading(false);
        }
    }
})();
