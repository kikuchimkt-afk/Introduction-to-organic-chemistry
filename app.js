// ============================================================
//  有機化学予習アプリ — Application Logic
// ============================================================

// --- Helper ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const on = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

// --- State ---
let currentModule = 'module1';
let fcMode = 'prefix'; // 'prefix' or 'carbon'
let fcIndex = 0;
let fcOrder = [...Array(PREFIXES.length).keys()];
let currentHCType = 'all';

// Quiz state
let quizCategory = 'all';
let quizQuestions = [];
let quizIndex = 0;
let quizCorrect = 0;
let quizAnswered = false;
const QUIZ_COUNT = 10;

// Progress (localStorage)
const STORAGE_KEY = 'organic-chem-progress';
let progress = loadProgress();

// ============================================================
//  Navigation
// ============================================================
function initNav() {
  $$('.nav-tab').forEach(tab => {
    on(tab, 'click', () => {
      const moduleId = tab.dataset.module;
      switchModule(moduleId);
    });
  });
}

function switchModule(moduleId) {
  currentModule = moduleId;
  
  $$('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.module === moduleId);
    t.setAttribute('aria-selected', t.dataset.module === moduleId);
  });
  
  $$('.module').forEach(m => {
    m.classList.toggle('active', m.id === moduleId);
  });

  // Auto-start quiz when switching to module4
  if (moduleId === 'module4') {
    startQuiz();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  Module 1: Prefix Table & Flashcards
// ============================================================
function renderPrefixTable() {
  const tbody = $('#prefixTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = PREFIXES.map(p => `
    <tr>
      <td>C${p.carbon}</td>
      <td>${p.prefix}</td>
      <td>${p.jpName}</td>
      <td>
        <span class="origin-text">${p.origin}</span>
        <span class="mnemonic">💡 ${p.mnemonic}</span>
      </td>
    </tr>
  `).join('');
}

function setFlashcardMode(mode) {
  fcMode = mode;
  fcIndex = 0;
  $('#fcModePrefix').classList.toggle('btn-primary', mode === 'prefix');
  $('#fcModeCarbon').classList.toggle('btn-primary', mode === 'carbon');
  updateFlashcard();
}

function updateFlashcard() {
  const fc = $('#flashcard');
  if (fc.classList.contains('flipped')) fc.classList.remove('flipped');
  
  const p = PREFIXES[fcOrder[fcIndex]];
  
  if (fcMode === 'prefix') {
    $('#fcFrontLabel').textContent = '接頭辞';
    $('#fcFrontValue').textContent = p.prefix;
    $('#fcBackValue').textContent = `C${p.carbon}`;
    $('#fcBackDetail').textContent = `${p.jpName} — ${p.mnemonic}`;
  } else {
    $('#fcFrontLabel').textContent = '炭素数';
    $('#fcFrontValue').textContent = `C${p.carbon}`;
    $('#fcBackValue').textContent = p.prefix;
    $('#fcBackDetail').textContent = `${p.jpName} — ${p.mnemonic}`;
  }
  
  $('#fcCounter').textContent = `${fcIndex + 1} / ${PREFIXES.length}`;
}

function flipFlashcard() {
  $('#flashcard').classList.toggle('flipped');
}

function nextFlashcard() {
  fcIndex = (fcIndex + 1) % PREFIXES.length;
  updateFlashcard();
}

function prevFlashcard() {
  fcIndex = (fcIndex - 1 + PREFIXES.length) % PREFIXES.length;
  updateFlashcard();
}

function shuffleFlashcards() {
  fcOrder = shuffleArray([...Array(PREFIXES.length).keys()]);
  fcIndex = 0;
  updateFlashcard();
}

// ============================================================
//  Module 2: Suffix Cards, Naming Rules, Hydrocarbon Grid
// ============================================================
function renderSuffixGrid() {
  const grid = $('#suffixGrid');
  if (!grid) return;
  
  grid.innerHTML = SUFFIXES.map(s => `
    <div class="suffix-card">
      <div class="suffix-name">${s.suffix}</div>
      <div class="suffix-jp">${s.jpSuffix} ― ${s.category}</div>
      <span class="bond-badge">${s.bondType} (結合次数: ${s.bondOrder})</span>
      <div class="formula">一般式: ${s.generalFormula}</div>
      <div class="description">${s.description}</div>
      <div class="tip-box">${s.tip}</div>
    </div>
  `).join('');
}

function renderNamingRules() {
  const container = $('#ruleSteps');
  if (!container) return;
  
  container.innerHTML = NAMING_RULES.map(r => `
    <div class="rule-step">
      <div class="step-num">${r.step}</div>
      <div class="step-content">
        <h4>${r.title}</h4>
        <p>${r.description}</p>
        <span class="step-tip">${r.tip}</span>
      </div>
    </div>
  `).join('');
}

function renderHydrocarbonGrid() {
  const grid = $('#hydrocarbonGrid');
  if (!grid) return;
  
  const filtered = currentHCType === 'all' 
    ? HYDROCARBONS 
    : HYDROCARBONS.filter(h => h.type === currentHCType);
  
  grid.innerHTML = filtered.map(h => `
    <div class="naming-quiz-item ${h.type}">
      <div>
        <span class="hc-name">${h.name}</span>
        <span style="font-size:12px; color: var(--text-muted); display: block;">${h.jpName}</span>
      </div>
      <span class="hc-formula">${h.formula}</span>
    </div>
  `).join('');
}

function filterHydrocarbons(type) {
  currentHCType = type;
  $$('.type-filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.type === type);
  });
  renderHydrocarbonGrid();
}

// ============================================================
//  Module 2: Hydrocarbon Classification
// ============================================================
function renderHCClassification() {
  // Intro
  const intro = $('#hcClassIntro');
  if (intro) intro.textContent = HC_CLASSIFICATION.intro;

  // Principle
  const principle = $('#hcClassPrinciple');
  if (principle) {
    principle.innerHTML = `<p style="font-size:13px; line-height:1.7; color: var(--text-secondary);">${HC_CLASSIFICATION.principle}</p>`;
  }

  // Axes cards
  const axesContainer = $('#hcClassAxes');
  if (axesContainer) {
    axesContainer.innerHTML = HC_CLASSIFICATION.axes.map(axis => `
      <div class="glass-card">
        <h4 style="font-size:14px; color: var(--accent-cyan); margin-bottom: 10px;">🔀 ${axis.name}</h4>
        ${axis.options.map(o => `
          <div style="display:flex; gap:8px; align-items:flex-start; margin-bottom: 8px;">
            <span style="font-size:18px; flex-shrink:0;">${o.icon}</span>
            <div>
              <div style="font-size:14px; font-weight:600;">${o.label}
                <span style="font-size:11px; color:var(--text-muted); font-weight:400; margin-left:6px;">${o.en}</span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary);">${o.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // Matrix cells
  const matrixMap = {
    'matrixChainSat': c => c.skeleton === '鎖状' && c.saturation === '飽和',
    'matrixChainUnsat': c => c.skeleton === '鎖状' && c.saturation === '不飽和',
    'matrixCycleSat': c => c.skeleton === '環状' && c.saturation === '飽和',
    'matrixCycleUnsat': c => c.skeleton === '環状' && c.saturation === '不飽和',
  };
  for (const [id, filter] of Object.entries(matrixMap)) {
    const cell = $(`#${id}`);
    if (!cell) continue;
    const cats = HC_CLASSIFICATION.categories.filter(filter);
    cell.innerHTML = cats.map(c => `
      <div style="margin-bottom: 4px;">
        <span style="font-weight:700; color:${c.color};">${c.name}</span>
        <span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted); margin-left:4px;">${c.suffix}</span>
        <div style="font-family:var(--font-mono); font-size:13px; font-weight:600; color:${c.color};">${c.generalFormula}</div>
      </div>
    `).join('');
  }

  // Category detail cards
  const cardsContainer = $('#hcCategoryCards');
  if (cardsContainer) {
    cardsContainer.innerHTML = HC_CLASSIFICATION.categories.map(c => `
      <div class="glass-card" style="margin-bottom: 12px; border-left: 3px solid ${c.color};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom: 10px;">
          <div>
            <div style="font-size:16px; font-weight:700; color:${c.color};">${c.name}
              <span style="font-size:13px; font-weight:400; color:var(--text-muted); margin-left:6px;">${c.en}</span>
            </div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${c.skeleton} ／ ${c.saturation}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-size:18px; font-weight:700; color:${c.color};">${c.generalFormula}</div>
            <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">${c.suffix}</div>
          </div>
        </div>
        <div style="font-size:13px; color:var(--text-secondary); margin-bottom: 8px;">結合: ${c.bond}</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom: 10px;">
          ${c.examples.map(ex => `
            <div style="flex:1; min-width:160px; padding:8px 10px; border-radius:var(--radius-sm); background:rgba(0,0,0,0.15); font-size:12px;">
              <div style="font-family:var(--font-mono); font-weight:600; color:${c.color};">${ex.name}</div>
              <div>${ex.jp}　<span style="color:var(--text-muted);">${ex.formula}</span></div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${ex.note}</div>
            </div>
          `).join('')}
        </div>
        <div class="tip-box" style="border-left-color:${c.color}; font-size:12px;">🧪 ${c.tip}</div>
      </div>
    `).join('');
  }

  // DBE section
  const dbeEl = $('#dbeSection');
  if (dbeEl) {
    const d = HC_CLASSIFICATION.dbe;
    dbeEl.innerHTML = `
      <h4 style="font-size:15px; margin-bottom: 8px;">📐 ${d.title}</h4>
      <div style="text-align:center; margin-bottom:12px;">
        <span style="font-family:var(--font-mono); font-size:16px; font-weight:700; color:var(--accent-cyan); padding:6px 16px; border-radius:var(--radius-sm); background:rgba(34,211,238,0.08); border:1px solid rgba(34,211,238,0.2);">${d.formula}</span>
      </div>
      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">${d.explanation}</p>
      <table class="prefix-table">
        <thead><tr><th>化合物</th><th>DBE</th><th>意味</th></tr></thead>
        <tbody>
          ${d.examples.map(ex => `
            <tr>
              <td style="font-family:var(--font-mono); font-size:13px;">${ex.compound}</td>
              <td style="font-weight:700; color:var(--accent-cyan); font-size:16px;">${ex.dbe}</td>
              <td style="font-size:12px; color:var(--text-secondary);">${ex.meaning}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

// ============================================================
//  Module 2: Aromatic Hydrocarbons
// ============================================================
function renderAromatic() {
  const A = AROMATIC_HC;

  // Intro & Principle
  const intro = $('#aromaticIntro');
  if (intro) intro.textContent = A.intro;
  const principle = $('#aromaticPrinciple');
  if (principle) principle.innerHTML = `<p style="font-size:13px; line-height:1.7; color:var(--text-secondary);">${A.principle}</p>`;

  // Benzene features
  const benz = $('#benzeneFeatures');
  if (benz) {
    const b = A.benzene;
    benz.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <h4 style="font-size:15px;">⬡ ${b.title}</h4>
        <div style="text-align:right;">
          <span style="font-family:var(--font-mono); font-size:18px; font-weight:700; color:#f472b6;">${b.formula}</span>
          <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">DBE = ${b.dbe}</span>
        </div>
      </div>
      ${b.points.map(p => `
        <div style="display:flex; gap:8px; margin-bottom:8px; align-items:flex-start;">
          <span style="font-size:12px; font-weight:600; color:#f472b6; min-width:70px; flex-shrink:0;">${p.label}</span>
          <span style="font-size:13px; color:var(--text-secondary);">${p.text}</span>
        </div>
      `).join('')}
    `;
  }

  // Naming rules
  const naming = $('#aromaticNaming');
  if (naming) {
    const n = A.naming;
    naming.innerHTML = `
      <h4 style="font-size:15px; margin-bottom:12px;">🏷️ ${n.title}</h4>
      <div class="rule-steps">
        ${n.rules.map((r, i) => `
          <div class="rule-step">
            <div class="step-num">${i + 1}</div>
            <div class="step-content">
              <h4>${r.rule}</h4>
              <p>${r.desc}</p>
              <div style="font-size:12px; color:var(--accent-green); font-family:var(--font-mono);">${r.example}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Ortho/Meta/Para
  const omp = $('#orthoMetaPara');
  if (omp) {
    const d = A.orthoMetaPara;
    omp.innerHTML = `
      <h4 style="font-size:15px; margin-bottom:12px;">📍 ${d.title}</h4>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:12px;">
        ${d.positions.map(p => `
          <div style="text-align:center; padding:12px; border-radius:var(--radius-sm); background:rgba(0,0,0,0.15); border:1px solid ${p.color}33;">
            <div style="font-family:var(--font-mono); font-size:15px; font-weight:700; color:${p.color}; margin-bottom:4px;">${p.prefix}</div>
            <div style="font-family:var(--font-mono); font-size:14px; color:var(--text-secondary);">${p.position}</div>
            <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">${p.meaning}</div>
          </div>
        `).join('')}
      </div>
      <div class="tip-box" style="border-left-color:var(--accent-cyan); font-size:12px;">💡 ${d.tip}</div>
    `;
  }

  // Compound cards
  const compounds = $('#aromaticCompounds');
  if (compounds) {
    compounds.innerHTML = A.compounds.map(c => `
      <div class="glass-card" style="margin-bottom:12px; border-left:3px solid ${c.color};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
          <div>
            <div style="font-size:16px; font-weight:700; color:${c.color};">
              ${c.name}
              <span style="font-size:13px; font-weight:400; color:var(--text-muted); margin-left:6px;">${c.jp}</span>
            </div>
            ${c.iupac ? `<div style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">IUPAC: ${c.iupac}</div>` : ''}
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-size:15px; font-weight:600; color:${c.color};">${c.formula}</div>
            <div style="font-size:18px;">${c.structure}</div>
          </div>
        </div>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">${c.desc}</p>
        <div class="tip-box" style="border-left-color:${c.color}; font-size:12px;">🧪 ${c.tip}</div>
      </div>
    `).join('');
  }
}

// ============================================================
//  Module 2 Extension: Branched Chain Nomenclature
// ============================================================
function renderBranchedNaming() {
  // Intro text
  const intro = $('#branchedIntro');
  if (intro) intro.textContent = BRANCHED_NAMING.intro;

  // Substituent rule
  const rule = $('#substituentRule');
  if (rule) rule.textContent = BRANCHED_NAMING.substituentRule;

  // Substituent table (expanded with structure column)
  const tbody = $('#substituentTableBody');
  if (tbody) {
    tbody.innerHTML = SUBSTITUENTS.map(s => `
      <tr>
        <td style="font-family: var(--font-mono); color: var(--accent-green);">${s.name.replace('yl','ane').replace('sec-butane','butane').replace('tert-butane','2-methylpropane').replace('vinylane','ethene').replace('phenylane','benzene')}</td>
        <td style="font-family: var(--font-mono); font-weight: 600; color: var(--accent-orange);">${s.name} (${s.jp})</td>
        <td style="font-family: var(--font-mono);">${s.formula}</td>
        <td style="font-size: 12px; color: var(--text-secondary);">${s.origin}</td>
      </tr>
    `).join('');
  }

  // Alkyl group classification
  renderAlkylGroups();

  // Branched naming steps
  const stepsContainer = $('#branchedSteps');
  if (stepsContainer) {
    stepsContainer.innerHTML = BRANCHED_NAMING.steps.map(s => `
      <div class="rule-step">
        <div class="step-num">${s.step}</div>
        <div class="step-content">
          <h4>${s.title}</h4>
          <p>${s.description}</p>
          <p style="font-size:12px; color: var(--text-muted); margin-bottom: 6px;">${s.detail}</p>
          ${s.example.wrong ? `<div style="font-size:12px; color: var(--accent-red); margin-bottom: 2px;">${s.example.wrong}</div>` : ''}
          <div style="font-size:12px; color: var(--accent-green);">${s.example.right}</div>
        </div>
      </div>
    `).join('');
  }

  // Branched examples
  const examplesContainer = $('#branchedExamples');
  if (examplesContainer) {
    examplesContainer.innerHTML = BRANCHED_NAMING.examples.map(ex => `
      <div class="branched-example glass-card" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div style="flex: 1; min-width: 200px;">
            <div style="font-size: 16px; font-weight: 700; font-family: var(--font-mono); color: var(--accent-green); margin-bottom: 4px;">${ex.name}</div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">${ex.jp}</div>
            <div style="font-size: 12px; margin-bottom: 4px;"><span style="color: var(--text-muted);">主鎖:</span> <span style="color: var(--accent-blue);">${ex.mainChain}</span></div>
            <div style="font-size: 12px; margin-bottom: 8px;"><span style="color: var(--text-muted);">置換基:</span> <span style="color: var(--accent-orange);">${ex.substituent}</span></div>
            <div class="tip-box" style="border-left-color: var(--accent-cyan); font-size: 12px;">${ex.tip}</div>
          </div>
          <div style="flex-shrink: 0;">
            <pre class="structure-diagram">${ex.structureDiagram.join('\n')}</pre>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderAlkylGroups() {
  const intro = $('#alkylGroupIntro');
  if (intro) intro.textContent = ALKYL_GROUP_RULES.intro;
  
  const formula = $('#alkylGroupFormula');
  if (formula) formula.textContent = ALKYL_GROUP_RULES.generalFormula;
  
  const types = $('#alkylGroupTypes');
  if (types) {
    const colors = ['var(--accent-green)', 'var(--accent-blue)', 'var(--accent-purple)'];
    types.innerHTML = ALKYL_GROUP_RULES.types.map((t, i) => `
      <div style="padding:10px; border-radius:8px; background:rgba(0,0,0,0.08); margin-bottom:8px; border-left:3px solid ${colors[i]};">
        <div style="font-size:14px; font-weight:600; color:${colors[i]}; margin-bottom:4px;">${t.type}</div>
        <div style="font-size:12px; color:var(--text-secondary); margin-bottom:4px;">${t.desc}</div>
        <div style="font-size:12px; font-family:var(--font-mono); color:var(--text-muted);">例: ${t.example}</div>
      </div>
    `).join('');
  }
  
  const tip = $('#alkylGroupTip');
  if (tip) tip.textContent = ALKYL_GROUP_RULES.tip;
}

// ============================================================
//  Module 2 Extension: FG Nomenclature
// ============================================================
function renderFGNaming() {
  // Intro text
  const intro = $('#fgNamingIntro');
  if (intro) intro.textContent = FG_NAMING_RULES.intro;

  // Principle box
  const principle = $('#fgNamingPrinciple');
  if (principle) {
    principle.innerHTML = `<div class="tip-box" style="border-left-color: var(--accent-cyan);">${FG_NAMING_RULES.principle}</div>`;
  }

  // Suffix type cards
  const suffixContainer = $('#fgNamingSuffixCards');
  if (suffixContainer) {
    suffixContainer.innerHTML = FG_NAMING_RULES.suffixType.map(item => `
      <div class="fg-naming-card glass-card" style="border-left: 3px solid ${item.color}; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h5 style="font-size:15px; color: ${item.color};">${item.fg}</h5>
          <span class="fg-badge" style="border-color: ${item.color}44; color: ${item.color}; font-size: 14px; font-family: var(--font-mono); font-weight: 600;">${item.suffix}</span>
        </div>
        <p style="font-size:13px; color: var(--text-secondary); margin-bottom: 10px;">${item.rule}</p>
        <div class="fg-naming-examples">
          ${item.examples.map(ex => `
            <div class="fg-naming-example">
              <span class="fg-naming-name" style="color: ${item.color};">${ex.name}</span>
              <span class="fg-naming-jp">${ex.jp}</span>
              ${ex.structure ? `<span class="fg-naming-structure">${ex.structure}</span>` : ''}
              <span class="fg-naming-detail">${ex.detail}</span>
            </div>
          `).join('')}
        </div>
        <div class="tip-box" style="border-left-color: ${item.color}; margin-top: 10px;">${item.tip}</div>
      </div>
    `).join('');
  }

  // Prefix type cards
  const prefixContainer = $('#fgNamingPrefixCards');
  if (prefixContainer) {
    prefixContainer.innerHTML = FG_NAMING_RULES.prefixType.map(item => `
      <div class="fg-naming-card glass-card" style="border-left: 3px solid ${item.color}; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h5 style="font-size:15px; color: ${item.color};">${item.fg}</h5>
          <span class="fg-badge" style="border-color: ${item.color}44; color: ${item.color}; font-size: 13px; font-family: var(--font-mono);">${item.prefix}</span>
        </div>
        <p style="font-size:13px; color: var(--text-secondary); margin-bottom: 10px;">${item.rule}</p>
        <div class="fg-naming-examples">
          ${item.examples.map(ex => `
            <div class="fg-naming-example">
              <span class="fg-naming-name" style="color: ${item.color};">${ex.name}</span>
              <span class="fg-naming-jp">${ex.jp}</span>
              <span class="fg-naming-detail">${ex.detail}</span>
            </div>
          `).join('')}
        </div>
        <div class="tip-box" style="border-left-color: ${item.color}; margin-top: 10px;">${item.tip}</div>
      </div>
    `).join('');
  }

  // Priority table
  const priorityBody = $('#priorityTableBody');
  if (priorityBody) {
    priorityBody.innerHTML = FG_NAMING_RULES.priorityOrder.map(p => `
      <tr>
        <td style="font-weight: 700; color: var(--accent-green);">${p.rank}</td>
        <td style="font-weight: 600;">${p.fg}</td>
        <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${p.suffix}</td>
        <td style="color: var(--text-secondary); font-size: 12px;">${p.note}</td>
      </tr>
    `).join('');
  }
}

// ============================================================
//  Module 3: Functional Groups
// ============================================================
function renderFunctionalGroups() {
  const container = $('#fgContainer');
  if (!container) return;
  
  let html = '';
  
  FG_CATEGORIES.forEach(cat => {
    const groups = FUNCTIONAL_GROUPS.filter(fg => fg.category === cat.name);
    if (groups.length === 0) return;
    
    html += `
      <div class="fg-category-header">
        <div class="cat-icon" style="background: ${cat.color}22; color: ${cat.color};">${cat.icon}</div>
        <div>
          <h3 style="color: ${cat.color};">${cat.name}</h3>
          <span class="cat-desc">${cat.description}</span>
        </div>
      </div>
      <div class="fg-grid">
        ${groups.map(fg => renderFGCard(fg)).join('')}
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Add click handlers for expanding cards
  $$('.fg-card').forEach(card => {
    on(card, 'click', () => {
      card.classList.toggle('expanded');
    });
  });
}

function renderFGCard(fg) {
  return `
    <div class="fg-card" data-fg-id="${fg.id}">
      <div class="fg-card-header">
        <span class="fg-structure" style="color: ${fg.categoryColor};">${fg.structure}</span>
        <span class="fg-suffix">${fg.suffix}</span>
      </div>
      <div class="fg-card-body">
        <div class="fg-name">${fg.name}</div>
        <div class="fg-name-en">${fg.nameEn}</div>
        <div class="fg-desc">${fg.description}</div>
        <div class="fg-property">
          <span class="fg-badge" style="border-color: ${fg.categoryColor}44; color: ${fg.categoryColor};">${fg.electronProperty}</span>
          ${fg.polarity ? `<span class="fg-badge">${fg.polarity}</span>` : ''}
          ${fg.acidity && fg.acidity !== '—' ? `<span class="fg-badge">${fg.acidity}</span>` : ''}
        </div>
      </div>
      <div class="fg-card-detail">
        <div class="fg-detail-section">
          <h5>代表的な反応</h5>
          <ul>${fg.reactions.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
        <div class="fg-detail-section">
          <h5>身近な例</h5>
          <ul>${fg.examples.map(e => `<li>${e}</li>`).join('')}</ul>
        </div>
        <div class="fg-tip" style="border-left-color: ${fg.categoryColor};">
          ${fg.tip}
        </div>
      </div>
    </div>
  `;
}

function renderTransformationMap() {
  const grid = $('#transformGrid');
  if (!grid) return;
  
  grid.innerHTML = TRANSFORMATION_MAP.map(t => {
    const fromFG = FUNCTIONAL_GROUPS.find(f => f.id === t.from);
    const toFG = FUNCTIONAL_GROUPS.find(f => f.id === t.to);
    if (!fromFG || !toFG) return '';
    
    return `
      <div class="transform-item">
        <span class="transform-from" style="color: ${fromFG.categoryColor};">${fromFG.name}</span>
        <span class="transform-arrow">→</span>
        <span class="transform-to" style="color: ${toFG.categoryColor};">${toFG.name}</span>
        <span class="transform-reagent">${t.reagent}</span>
      </div>
    `;
  }).join('');
}

// ============================================================
//  Module 4: Quiz Engine
// ============================================================
const CATEGORY_LABELS = {
  prefix: '接頭辞',
  suffix: '語尾・分類',
  formula: '分子式',
  functional_group: '官能基',
  reaction: '反応',
  fg_naming: '官能基命名法',
  branched: '分岐鎖命名法',
  aromatic: '芳香族'
};

function setQuizCategory(cat) {
  quizCategory = cat;
  $$('.quiz-cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  startQuiz();
}

function startQuiz() {
  // Combine all quiz pools
  const allQuestions = [...QUIZ_QUESTIONS, ...FG_NAMING_QUIZ, ...BRANCHED_QUIZ, ...AROMATIC_QUIZ];
  
  // Filter questions by category
  let pool = quizCategory === 'all' 
    ? allQuestions
    : allQuestions.filter(q => q.category === quizCategory);
  
  // Shuffle and take QUIZ_COUNT
  quizQuestions = shuffleArray(pool).slice(0, QUIZ_COUNT);
  quizIndex = 0;
  quizCorrect = 0;
  quizAnswered = false;
  
  // Show quiz area, hide result
  $('#quizArea').style.display = 'block';
  $('#quizResult').style.display = 'none';
  
  showQuizQuestion();
}

function showQuizQuestion() {
  if (quizIndex >= quizQuestions.length) {
    showQuizResult();
    return;
  }
  
  const q = quizQuestions[quizIndex];
  quizAnswered = false;
  
  // Update progress bar
  const pct = (quizIndex / quizQuestions.length) * 100;
  $('#quizProgressFill').style.width = pct + '%';
  $('#quizProgressText').textContent = `${quizIndex} / ${quizQuestions.length}`;
  
  // Display question
  $('#quizCatLabel').textContent = CATEGORY_LABELS[q.category] || q.category;
  $('#quizQuestionText').textContent = q.question;
  
  // Display options
  const options = q.options();
  const optionsContainer = $('#quizOptions');
  optionsContainer.innerHTML = options.map((opt, i) => `
    <button class="quiz-option" data-index="${i}" data-value="${escapeHtml(opt)}">${opt}</button>
  `).join('');
  
  // Add click handlers
  $$('.quiz-option').forEach(btn => {
    on(btn, 'click', () => handleQuizAnswer(btn, q));
  });
  
  // Hide explanation and next button
  $('#quizExplanation').classList.remove('visible');
  $('#quizNextBtn').style.display = 'none';
}

function handleQuizAnswer(btn, question) {
  if (quizAnswered) return;
  quizAnswered = true;
  
  const selected = btn.dataset.value;
  const correct = question.answer;
  
  // Mark all options
  $$('.quiz-option').forEach(o => {
    o.classList.add('disabled');
    if (o.dataset.value === escapeHtml(correct)) {
      o.classList.add('correct');
    }
  });
  
  if (selected === escapeHtml(correct)) {
    btn.classList.add('correct');
    quizCorrect++;
  } else {
    btn.classList.add('incorrect');
  }
  
  // Show explanation
  $('#quizExplanationText').textContent = question.explanation;
  $('#quizExplanation').classList.add('visible');
  
  // Show next button
  $('#quizNextBtn').style.display = 'inline-flex';
}

function nextQuizQuestion() {
  quizIndex++;
  showQuizQuestion();
}

function showQuizResult() {
  $('#quizArea').style.display = 'none';
  $('#quizResult').style.display = 'block';
  
  const total = quizQuestions.length;
  const pct = Math.round((quizCorrect / total) * 100);
  
  $('#quizScoreDisplay').textContent = pct + '%';
  $('#quizCorrectCount').textContent = quizCorrect;
  $('#quizWrongCount').textContent = total - quizCorrect;
  $('#quizTotalCount').textContent = total;
  
  // Update progress bar to full
  $('#quizProgressFill').style.width = '100%';
  $('#quizProgressText').textContent = `${total} / ${total}`;
  
  // Result message
  let msg = '';
  if (pct === 100) msg = '🎉 パーフェクト！完璧です！';
  else if (pct >= 80) msg = '👏 素晴らしい！よく理解できています。';
  else if (pct >= 60) msg = '📖 あと少し！間違えた問題を復習しましょう。';
  else msg = '💪 各モジュールの内容を見直して再チャレンジ！';
  
  $('#quizResultText').textContent = msg;
  
  // Save progress
  saveProgress(quizCategory, pct, quizCorrect, total);
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
//  Progress Persistence
// ============================================================
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { sessions: [], bestScores: {} };
  } catch {
    return { sessions: [], bestScores: {} };
  }
}

function saveProgress(category, pct, correct, total) {
  progress.sessions.push({
    date: new Date().toISOString(),
    category,
    score: pct,
    correct,
    total
  });
  
  const key = category || 'all';
  if (!progress.bestScores[key] || pct > progress.bestScores[key]) {
    progress.bestScores[key] = pct;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* ignore */ }
  
  updateProgressBadge();
}

function updateProgressBadge() {
  const badge = $('#progressText');
  if (!badge) return;
  
  if (progress.sessions.length === 0) {
    badge.textContent = '学習を始めましょう';
    return;
  }
  
  const totalSessions = progress.sessions.length;
  const avgScore = Math.round(
    progress.sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions
  );
  badge.textContent = `テスト${totalSessions}回 | 平均${avgScore}%`;
}

// ============================================================
//  Theme Toggle
// ============================================================
function initTheme() {
  const saved = localStorage.getItem('organic-chem-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    const btn = $('#themeToggle');
    if (btn) btn.textContent = '☀️';
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const btn = $('#themeToggle');
  if (html.getAttribute('data-theme') === 'light') {
    html.removeAttribute('data-theme');
    if (btn) btn.textContent = '🌙';
    localStorage.setItem('organic-chem-theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    if (btn) btn.textContent = '☀️';
    localStorage.setItem('organic-chem-theme', 'light');
  }
}

// ============================================================
//  Progress Dashboard
// ============================================================
function renderProgressDashboard() {
  const el = $('#progressStats');
  if (!el) return;
  if (progress.sessions.length === 0) return;

  const sessions = progress.sessions;
  const total = sessions.length;
  const avg = Math.round(sessions.reduce((s, x) => s + x.score, 0) / total);
  const best = Math.max(...sessions.map(s => s.score));
  const recent = sessions.slice(-5);

  // Category breakdown
  const cats = {};
  sessions.forEach(s => {
    const k = s.category || 'all';
    if (!cats[k]) cats[k] = { count: 0, totalScore: 0, best: 0 };
    cats[k].count++;
    cats[k].totalScore += s.score;
    if (s.score > cats[k].best) cats[k].best = s.score;
  });

  el.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:16px;">
      <div style="text-align:center; padding:12px; border-radius:8px; background:rgba(0,0,0,0.1);">
        <div style="font-size:24px; font-weight:700; color:var(--accent-cyan);">${total}</div>
        <div style="font-size:11px; color:var(--text-muted);">受験回数</div>
      </div>
      <div style="text-align:center; padding:12px; border-radius:8px; background:rgba(0,0,0,0.1);">
        <div style="font-size:24px; font-weight:700; color:var(--accent-green);">${avg}%</div>
        <div style="font-size:11px; color:var(--text-muted);">平均スコア</div>
      </div>
      <div style="text-align:center; padding:12px; border-radius:8px; background:rgba(0,0,0,0.1);">
        <div style="font-size:24px; font-weight:700; color:var(--accent-orange);">${best}%</div>
        <div style="font-size:11px; color:var(--text-muted);">最高スコア</div>
      </div>
    </div>
    <div style="font-size:12px; color:var(--text-muted);">
      <strong>カテゴリ別:</strong>
      ${Object.entries(cats).map(([k, v]) => {
        const label = CATEGORY_LABELS[k] || k;
        return `<span style="margin-right:12px;">${label}: 平均${Math.round(v.totalScore / v.count)}% (${v.count}回)</span>`;
      }).join('')}
    </div>
    <div style="font-size:12px; color:var(--text-muted); margin-top:8px;">
      <strong>直近5回:</strong> ${recent.map(s => `${s.score}%`).join(' → ')}
    </div>
  `;
}

// ============================================================
//  Reaction Pathway
// ============================================================
function renderReactionPathway() {
  const intro = $('#pathwayIntro');
  if (intro) intro.textContent = REACTION_PATHWAY.intro;

  const el = $('#reactionPathway');
  if (!el) return;

  const steps = REACTION_PATHWAY.steps;
  const arrows = REACTION_PATHWAY.arrows;

  el.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:20px;">
      ${steps.map(s => `
        <div style="text-align:center; padding:10px 14px; border-radius:10px; background:rgba(0,0,0,0.12); border:1px solid ${s.color}33; min-width:100px;">
          <div style="font-size:14px; font-weight:700; color:${s.color};">${s.name}</div>
          <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary);">${s.formula}</div>
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted);">${s.suffix}</div>
          <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${s.example}</div>
        </div>
      `).join('')}
    </div>
    <h4 style="font-size:14px; margin-bottom:10px;">⚗️ 変換反応一覧</h4>
    <div style="display:grid; gap:6px;">
      ${arrows.map(a => {
        const fromStep = steps.find(s => s.name === a.from);
        const toStep = steps.find(s => s.name === a.to);
        return `
          <div style="display:flex; align-items:center; gap:6px; font-size:12px; padding:6px 10px; border-radius:6px; background:rgba(0,0,0,0.08);">
            <span style="font-weight:600; color:${fromStep?.color || '#fff'};">${a.from}</span>
            <span style="color:var(--accent-cyan);">→</span>
            <span style="font-weight:600; color:${toStep?.color || '#fff'};">${a.to}</span>
            <span style="color:var(--text-muted); margin-left:auto; font-size:11px;">${a.reagent}</span>
            <span style="font-size:10px; padding:2px 6px; border-radius:4px; background:rgba(34,211,238,0.1); color:var(--accent-cyan);">${a.type}</span>
          </div>
        `;
      }).join('')}
    </div>
    <div class="tip-box" style="margin-top:12px; font-size:12px; border-left-color:var(--accent-cyan);">
      🔬 酸化段階: アルカン(0) → アルコール(1) → アルデヒド/ケトン(2) → カルボン酸(3)。数字が大きいほど酸化が進んでいる。還元は逆方向。
    </div>
  `;
}

// ============================================================
//  Isomers
// ============================================================
function renderIsomers() {
  const intro = $('#isomerIntro');
  if (intro) intro.textContent = ISOMERS.intro;

  const el = $('#isomerCards');
  if (!el) return;

  el.innerHTML = ISOMERS.types.map(t => `
    <div class="glass-card" style="margin-bottom:12px; border-left:3px solid ${t.color};">
      <div style="margin-bottom:10px;">
        <span style="font-size:16px; font-weight:700; color:${t.color};">${t.name}</span>
        <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">${t.en}</span>
      </div>
      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:10px;">${t.desc}</p>
      ${t.examples.map(ex => `
        <div style="padding:10px; border-radius:8px; background:rgba(0,0,0,0.1); margin-bottom:8px;">
          <div style="font-family:var(--font-mono); font-size:13px; font-weight:600; color:${t.color}; margin-bottom:4px;">${ex.formula} <span style="font-size:11px; color:var(--text-muted);">(${ex.type})</span></div>
          <ul style="margin:0; padding-left:20px; font-size:12px; color:var(--text-secondary);">
            ${ex.compounds.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `).join('');
}

// ============================================================
//  Reaction Mechanisms
// ============================================================
function renderReactionMechanisms() {
  const el = $('#reactionMechanisms');
  if (!el) return;

  el.innerHTML = REACTION_MECHANISMS.map(r => `
    <div class="glass-card" style="margin-bottom:12px; border-left:3px solid ${r.color};">
      <div style="margin-bottom:8px;">
        <span style="font-size:15px; font-weight:700; color:${r.color};">${r.name}</span>
        <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">${r.en}</span>
      </div>
      <div style="text-align:center; padding:10px; margin-bottom:8px; border-radius:8px; background:rgba(0,0,0,0.12); font-family:var(--font-mono); font-size:14px; color:${r.color}; font-weight:600;">${r.equation}</div>
      <div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">触媒: ${r.catalyst}</div>
      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">${r.desc}</p>
      <div style="padding:8px 10px; border-radius:6px; background:rgba(0,0,0,0.08); font-size:12px; font-family:var(--font-mono); color:var(--text-secondary); white-space:pre-line; margin-bottom:8px;">${r.example}</div>
      <div class="tip-box" style="border-left-color:${r.color}; font-size:12px;">🧪 ${r.tip}</div>
    </div>
  `).join('');
}

// ============================================================
//  FG Flashcards
// ============================================================
let fgFcCards = [...FG_FLASHCARDS];
let fgFcIndex = 0;
let fgFcFlipped = false;

function updateFGFlashcard() {
  const card = fgFcCards[fgFcIndex];
  $('#fgFcFront').textContent = card.front;
  $('#fgFcBack').textContent = card.back;
  $('#fgFcCounter').textContent = `${fgFcIndex + 1} / ${fgFcCards.length}`;
  fgFcFlipped = false;
  const el = $('#fgFlashcard');
  if (el) el.classList.remove('flipped');
}

function flipFGFlashcard() {
  fgFcFlipped = !fgFcFlipped;
  const el = $('#fgFlashcard');
  if (el) el.classList.toggle('flipped', fgFcFlipped);
}

function nextFGFlashcard() {
  fgFcIndex = (fgFcIndex + 1) % fgFcCards.length;
  updateFGFlashcard();
}

function prevFGFlashcard() {
  fgFcIndex = (fgFcIndex - 1 + fgFcCards.length) % fgFcCards.length;
  updateFGFlashcard();
}

function shuffleFGFlashcards() {
  fgFcCards = shuffleArray([...FG_FLASHCARDS]);
  fgFcIndex = 0;
  updateFGFlashcard();
}

// ============================================================
//  Fill-in Test (Multiple Choice)
// ============================================================
function renderFillIn() {
  const el = $('#fillInTest');
  if (!el) return;
  const allAnswers = FILL_IN_TEST.map(q => q.answer);
  const questions = shuffleArray([...FILL_IN_TEST]).slice(0, 8);
  
  el.innerHTML = questions.map((q, i) => {
    // Generate 3 wrong options from other answers
    const wrongOptions = shuffleArray(allAnswers.filter(a => a !== q.answer)).slice(0, 3);
    const options = shuffleArray([q.answer, ...wrongOptions]);
    
    return `
      <div style="margin-bottom:12px; padding:12px; border-radius:10px; background:rgba(0,0,0,0.06);" data-answer="${q.answer}" class="fill-in-item">
        <div style="font-size:13px; color:var(--text-primary); margin-bottom:8px; font-weight:500;">${i + 1}. ${q.q}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          ${options.map(opt => `
            <button class="fill-in-option btn" onclick="selectFillInOption(this)" data-value="${opt}" style="font-size:12px; padding:8px; text-align:left; cursor:pointer; border:1px solid var(--border-glass); border-radius:6px; background:var(--bg-glass); color:var(--text-primary);">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div class="fill-in-feedback" style="font-size:12px; margin-top:6px;"></div>
      </div>
    `;
  }).join('');
}

function selectFillInOption(btn) {
  // Deselect siblings
  btn.parentElement.querySelectorAll('.fill-in-option').forEach(b => {
    b.style.borderColor = 'var(--border-glass)';
    b.style.background = 'var(--bg-glass)';
    b.style.fontWeight = 'normal';
  });
  // Select this
  btn.style.borderColor = 'var(--accent-cyan)';
  btn.style.background = 'rgba(34,211,238,0.08)';
  btn.style.fontWeight = '600';
  btn.parentElement.dataset.selected = btn.dataset.value;
}

function checkFillIn() {
  const items = document.querySelectorAll('.fill-in-item');
  let correct = 0;
  items.forEach(item => {
    const answer = item.dataset.answer;
    const selected = item.querySelector('.fill-in-option[style*="font-weight: 600"], .fill-in-option[style*="font-weight:600"]');
    const fb = item.querySelector('.fill-in-feedback');
    const userAnswer = selected ? selected.dataset.value : '';
    
    // Highlight all options
    item.querySelectorAll('.fill-in-option').forEach(btn => {
      if (btn.dataset.value === answer) {
        btn.style.borderColor = 'var(--accent-green)';
        btn.style.background = 'rgba(74,222,128,0.12)';
      } else if (btn === selected) {
        btn.style.borderColor = 'var(--accent-red)';
        btn.style.background = 'rgba(239,68,68,0.08)';
      }
      btn.style.pointerEvents = 'none';
    });
    
    if (userAnswer === answer) {
      correct++;
      fb.innerHTML = `<span style="color:var(--accent-green);">✅ 正解！</span>`;
    } else if (userAnswer) {
      fb.innerHTML = `<span style="color:var(--accent-red);">❌ 正解: <strong>${answer}</strong></span>`;
    } else {
      fb.innerHTML = `<span style="color:var(--text-muted);">未回答 → 正解: <strong>${answer}</strong></span>`;
    }
  });
  
  const result = $('#fillInResult');
  if (result) {
    result.innerHTML = `<div style="font-size:14px; font-weight:600; color:var(--accent-cyan);">結果: ${correct} / ${items.length} 正解 (${Math.round(correct / items.length * 100)}%)</div>`;
  }
}

function resetFillIn() {
  renderFillIn();
  const result = $('#fillInResult');
  if (result) result.innerHTML = '';
}

// ============================================================
//  Reverse Naming
// ============================================================
function renderReverse() {
  const el = $('#reverseNaming');
  if (!el) return;
  const questions = shuffleArray([...REVERSE_NAMING]);
  el.innerHTML = questions.map((q, i) => `
    <div style="margin-bottom:10px; padding:10px; border-radius:8px; background:rgba(0,0,0,0.06);" data-answer="${q.answer}" class="reverse-item">
      <div style="font-size:13px; color:var(--text-primary); margin-bottom:6px;">${i + 1}. <span style="font-family:var(--font-mono); font-weight:600; color:var(--accent-cyan);">${q.structure}</span> → ?</div>
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="text" class="reverse-input" placeholder="化合物名を入力..." style="flex:1; padding:6px 10px; border-radius:6px; border:1px solid var(--border-glass); background:var(--bg-glass); color:var(--text-primary); font-size:13px; outline:none;">
        <button class="btn btn-sm" onclick="this.previousElementSibling.placeholder='💡 ${q.hint}'" style="font-size:11px;">ヒント</button>
      </div>
      <div class="reverse-feedback" style="font-size:12px; margin-top:4px;"></div>
    </div>
  `).join('');
}

function checkReverse() {
  const items = document.querySelectorAll('.reverse-item');
  let correct = 0;
  items.forEach(item => {
    const answer = item.dataset.answer;
    const input = item.querySelector('.reverse-input');
    const fb = item.querySelector('.reverse-feedback');
    const userAnswer = input.value.trim();
    
    const normalize = s => s.toLowerCase().replace(/[\s　\-\(\)（）]/g, '');
    const answerParts = answer.split(/[\s\/\(\)（）]/).filter(Boolean);
    const isCorrect = userAnswer.length > 0 && answerParts.some(p => normalize(userAnswer).includes(normalize(p)) || normalize(p).includes(normalize(userAnswer)));
    
    if (isCorrect) {
      correct++;
      fb.innerHTML = `<span style="color:var(--accent-green);">✅ 正解！ ${answer}</span>`;
      input.style.borderColor = 'var(--accent-green)';
    } else {
      fb.innerHTML = `<span style="color:var(--accent-red);">❌ 正解: <strong>${answer}</strong></span>`;
      input.style.borderColor = 'var(--accent-red)';
    }
  });
  
  const result = $('#reverseResult');
  if (result) {
    result.innerHTML = `<div style="font-size:14px; font-weight:600; color:var(--accent-cyan);">結果: ${correct} / ${items.length} 正解 (${Math.round(correct / items.length * 100)}%)</div>`;
  }
}

function resetReverse() {
  renderReverse();
  const result = $('#reverseResult');
  if (result) result.innerHTML = '';
}

// ============================================================
//  Initialization
// ============================================================
function init() {
  initTheme();
  initNav();
  renderPrefixTable();
  setFlashcardMode('prefix');
  renderSuffixGrid();
  renderNamingRules();
  renderHCClassification();
  renderAromatic();
  renderBranchedNaming();
  renderFGNaming();
  renderHydrocarbonGrid();
  renderFunctionalGroups();
  renderTransformationMap();
  renderReactionPathway();
  renderIsomers();
  renderReactionMechanisms();
  renderProgressDashboard();
  updateFGFlashcard();
  renderFillIn();
  renderReverse();
  updateProgressBadge();
}

// Launch
document.addEventListener('DOMContentLoaded', init);
