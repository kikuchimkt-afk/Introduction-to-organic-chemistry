// ============================================================
//  有機化学予習アプリ — データモジュール
//  Designed from an organic synthesis chemist's perspective
// ============================================================

// --------------------------------------------------
//  Module 1: C1〜C10 接頭辞データ
// --------------------------------------------------
const PREFIXES = [
  { carbon: 1,  prefix: "meth-",  jpName: "メタン", origin: "ギリシャ語 methy (酒) + hyle (木) — 木材の乾留で得られたことから", mnemonic: "メタンガス（都市ガス）" },
  { carbon: 2,  prefix: "eth-",   jpName: "エタン", origin: "ラテン語 aether (エーテル) — エタノールから作られるエーテルに由来", mnemonic: "エタノール（消毒液）" },
  { carbon: 3,  prefix: "prop-",  jpName: "プロパン", origin: "ギリシャ語 pro (最初) + pion (脂肪) — 脂肪酸の最初の酸", mnemonic: "プロパンガス（家庭用）" },
  { carbon: 4,  prefix: "but-",   jpName: "ブタン", origin: "ラテン語 butyrum (バター) — バターの臭い成分に由来", mnemonic: "ブタンガス（ライター）" },
  { carbon: 5,  prefix: "pent-",  jpName: "ペンタン", origin: "ギリシャ語 pente (5) — ここからギリシャ数詞", mnemonic: "ペンタゴン（五角形）" },
  { carbon: 6,  prefix: "hex-",   jpName: "ヘキサン", origin: "ギリシャ語 hex (6)", mnemonic: "ヘキサゴン（六角形）" },
  { carbon: 7,  prefix: "hept-",  jpName: "ヘプタン", origin: "ギリシャ語 hepta (7)", mnemonic: "G7（七か国）" },
  { carbon: 8,  prefix: "oct-",   jpName: "オクタン", origin: "ギリシャ語 okto (8)", mnemonic: "オクトパス（たこ=8本足）" },
  { carbon: 9,  prefix: "non-",   jpName: "ノナン", origin: "ラテン語 nonus (9番目)", mnemonic: "ノナゴン（九角形）" },
  { carbon: 10, prefix: "dec-",   jpName: "デカン", origin: "ギリシャ語 deka (10)", mnemonic: "デカスロン（十種競技）" },
];

// --------------------------------------------------
//  Module 2: 炭化水素の命名体系 — 語尾ルール
// --------------------------------------------------
const SUFFIXES = [
  { 
    suffix: "-ane", 
    jpSuffix: "〜アン",
    bondType: "単結合のみ", 
    bondOrder: 1,
    generalFormula: "CₙH₂ₙ₊₂", 
    category: "アルカン (飽和炭化水素)",
    description: "すべての炭素間結合が単結合。最も安定で反応性が低い。",
    tip: "🧪 合成化学者の視点: アルカンは反応性が低いため、溶媒としてよく使われます（ヘキサンなど）。反応しにくい＝安定している、ということです。"
  },
  { 
    suffix: "-ene", 
    jpSuffix: "〜エン",
    bondType: "二重結合を含む", 
    bondOrder: 2,
    generalFormula: "CₙH₂ₙ", 
    category: "アルケン (不飽和炭化水素)",
    description: "炭素間に二重結合(C=C)を1つ含む。付加反応を起こしやすい。",
    tip: "🧪 合成化学者の視点: 二重結合は電子が豊富な場所。求電子試薬（HBrなど）が近づくと、π電子が反応して付加反応が起きます。"
  },
  { 
    suffix: "-yne", 
    jpSuffix: "〜イン",
    bondType: "三重結合を含む", 
    bondOrder: 3,
    generalFormula: "CₙH₂ₙ₋₂", 
    category: "アルキン (不飽和炭化水素)",
    description: "炭素間に三重結合(C≡C)を1つ含む。直線型構造をとる。",
    tip: "🧪 合成化学者の視点: 末端アルキン(R-C≡C-H)の水素は弱い酸性を示します。これはsp混成軌道のs性が高く、電子を引きつけるためです。"
  }
];

// 命名法クイズ用: 全炭化水素リスト (C1〜C10 × ane/ene/yne)
function generateHydrocarbons() {
  const list = [];
  PREFIXES.forEach(p => {
    // アルカン (C1〜)
    list.push({
      name: p.prefix + "ane",
      jpName: p.jpName.replace(/ン$/, '') + "ン",   // already correct for most
      carbon: p.carbon,
      type: "alkane",
      formula: `C${subscript(p.carbon)}H${subscript(2*p.carbon+2)}`,
      rawFormula: { C: p.carbon, H: 2*p.carbon+2 }
    });
    // アルケン (C2〜)
    if (p.carbon >= 2) {
      const eneName = p.prefix + "ene";
      const jpEne = p.jpName.replace(/ン$/, '') + "ン";
      list.push({
        name: eneName.replace(/eth-ene/, "ethene").replace(/prop-ene/, "propene"),
        jpName: jpEne.replace(/アン$/, 'エン').replace(/エタン/, 'エテン').replace(/プロパン/, 'プロペン'),
        carbon: p.carbon,
        type: "alkene",
        formula: `C${subscript(p.carbon)}H${subscript(2*p.carbon)}`,
        rawFormula: { C: p.carbon, H: 2*p.carbon }
      });
    }
    // アルキン (C2〜)
    if (p.carbon >= 2) {
      const yneName = p.prefix + "yne";
      list.push({
        name: yneName.replace(/eth-yne/, "ethyne").replace(/prop-yne/, "propyne"),
        jpName: p.jpName.replace(/アン$/, 'イン').replace(/エタン/, 'エチン').replace(/プロパン/, 'プロピン'),
        carbon: p.carbon,
        type: "alkyne",
        formula: `C${subscript(p.carbon)}H${subscript(2*p.carbon-2)}`,
        rawFormula: { C: p.carbon, H: 2*p.carbon-2 }
      });
    }
  });
  return list;
}

function subscript(n) {
  const subs = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉' };
  return String(n).split('').map(c => subs[c] || c).join('');
}

const HYDROCARBONS = generateHydrocarbons();

// --------------------------------------------------
//  Module 2 追加: 命名法の「ルール」整理
// --------------------------------------------------
const NAMING_RULES = [
  {
    step: 1,
    title: "主鎖を見つける",
    description: "最も長い炭素鎖を主鎖とする。主鎖の炭素数で接頭辞が決まる。",
    tip: "🧪 「最長鎖」を選ぶのがポイント。分岐があっても、最も長い連続した炭素鎖を探しましょう。"
  },
  {
    step: 2,
    title: "語尾を決める",
    description: "主鎖の結合の種類で語尾が決まる。単結合のみ→ -ane、二重結合→ -ene、三重結合→ -yne",
    tip: "🧪 結合の種類は分子の反応性を決める最も重要な要素。語尾を見れば反応性がわかります。"
  },
  {
    step: 3,
    title: "置換基に番号をつける",
    description: "置換基の位置番号が最小になるように主鎖に番号をつける。",
    tip: "🧪 IUPAC命名法は世界共通の「分子の住所」。番号は住所の番地のようなものです。"
  },
  {
    step: 4, 
    title: "名前を組み立てる",
    description: "位置番号-置換基名 + 主鎖接頭辞 + 語尾 の順で名前を組み立てる。",
    tip: "🧪 例: 2-メチルブタン = 2番目の炭素にメチル基がついた4炭素のアルカン"
  }
];

// --------------------------------------------------
//  Module 2: 炭化水素の分類体系
// --------------------------------------------------
const HC_CLASSIFICATION = {
  intro: '炭化水素は「骨格の形（鎖状 vs 環状）」と「結合の種類（飽和 vs 不飽和）」の2軸で体系的に分類されます。この2×2のマトリクスを理解することが、有機化学の命名法の基礎になります。',
  
  principle: '🔬 合成化学者の視点: 飽和・不飽和の違いは「反応性」に直結します。不飽和結合（二重結合・三重結合）は電子密度が高く、求電子付加反応の場になります。これが有機合成で最も基本的な反応パターンです。',

  axes: [
    {
      name: '骨格の形',
      options: [
        { label: '鎖状（開鎖）', en: 'acyclic / open-chain', desc: '炭素原子が直線状または分岐した鎖を形成', icon: '📏' },
        { label: '環状（閉鎖）', en: 'cyclic', desc: '炭素原子が環（リング）を形成 → 接頭辞 cyclo- を付加', icon: '⭕' }
      ]
    },
    {
      name: '結合の種類',
      options: [
        { label: '飽和', en: 'saturated', desc: 'すべて単結合 (C-C)。Hの数が最大', icon: '🔗' },
        { label: '不飽和', en: 'unsaturated', desc: '二重結合(C=C)か三重結合(C≡C)を含む。Hの数が少ない', icon: '⚡' }
      ]
    }
  ],

  categories: [
    {
      type: 'alkane',
      name: 'アルカン',
      en: 'Alkane',
      skeleton: '鎖状',
      saturation: '飽和',
      suffix: '-ane',
      generalFormula: 'CₙH₂ₙ₊₂',
      bond: 'すべて単結合 (C−C)',
      color: '#4ade80',
      examples: [
        { name: 'methane', jp: 'メタン', formula: 'CH₄', note: '最も単純な有機化合物。天然ガスの主成分' },
        { name: 'propane', jp: 'プロパン', formula: 'C₃H₈', note: 'LPガス。3炭素の直鎖' },
        { name: 'octane', jp: 'オクタン', formula: 'C₈H₁₈', note: 'ガソリンの主成分。オクタン価の基準' }
      ],
      tip: 'アルカンは安定で反応性が低い。「パラフィン(paraffin)=反応しにくい」の語源通り、強い条件(高温・紫外線)でのみ置換反応が起きる。'
    },
    {
      type: 'cycloalkane',
      name: 'シクロアルカン',
      en: 'Cycloalkane',
      skeleton: '環状',
      saturation: '飽和',
      suffix: '-ane（cyclo- 接頭辞付き）',
      generalFormula: 'CₙH₂ₙ',
      bond: 'すべて単結合（環状）',
      color: '#2dd4bf',
      examples: [
        { name: 'cyclopropane', jp: 'シクロプロパン', formula: 'C₃H₆', note: '3員環。ひずみが大きく反応性が高い' },
        { name: 'cyclohexane', jp: 'シクロヘキサン', formula: 'C₆H₁₂', note: '6員環。いす型配座で最も安定' }
      ],
      tip: '環を作るためにH₂を2つ失う → 一般式がアルケンと同じCₙH₂ₙ。でも結合はすべて単結合で「飽和」。不飽和度の計算で環=二重結合1つ分と数えるのはこのため。'
    },
    {
      type: 'alkene',
      name: 'アルケン',
      en: 'Alkene',
      skeleton: '鎖状',
      saturation: '不飽和',
      suffix: '-ene',
      generalFormula: 'CₙH₂ₙ (n≧2)',
      bond: '二重結合 (C=C) を1つ含む',
      color: '#60a5fa',
      examples: [
        { name: 'ethene', jp: 'エテン(エチレン)', formula: 'C₂H₄', note: '最も単純なアルケン。果物の成熟ホルモン' },
        { name: 'propene', jp: 'プロペン(プロピレン)', formula: 'C₃H₆', note: 'ポリプロピレンの原料' }
      ],
      tip: '二重結合は付加反応の「入口」。H₂, HBr, H₂O などを付加でき、有機合成の最重要反応パターン。Markovnikov則で位置選択性を予測する。'
    },
    {
      type: 'alkyne',
      name: 'アルキン',
      en: 'Alkyne',
      skeleton: '鎖状',
      saturation: '不飽和',
      suffix: '-yne',
      generalFormula: 'CₙH₂ₙ₋₂ (n≧2)',
      bond: '三重結合 (C≡C) を1つ含む',
      color: '#c084fc',
      examples: [
        { name: 'ethyne', jp: 'エチン(アセチレン)', formula: 'C₂H₂', note: '溶接に使われる。非常に高温で燃焼' },
        { name: 'propyne', jp: 'プロピン', formula: 'C₃H₄', note: '3炭素のアルキン' }
      ],
      tip: '三重結合は2段階の付加が可能。まずアルケンに、さらにアルカンに変換できる。末端アルキン(R-C≡C-H)は弱い酸性を示し、金属アセチリドを形成。'
    },
    {
      type: 'cycloalkene',
      name: 'シクロアルケン',
      en: 'Cycloalkene',
      skeleton: '環状',
      saturation: '不飽和',
      suffix: '-ene（cyclo- 接頭辞付き）',
      generalFormula: 'CₙH₂ₙ₋₂ (n≧3)',
      bond: '環状 + 二重結合 (C=C)',
      color: '#818cf8',
      examples: [
        { name: 'cyclohexene', jp: 'シクロヘキセン', formula: 'C₆H₁₀', note: '6員環に二重結合1つ' }
      ],
      tip: '環＋二重結合で不飽和度が2。一般式がアルキンと同じCₙH₂ₙ₋₂になる。不飽和度(DBE) = 環の数 + 二重結合の数 + 2×三重結合の数。'
    }
  ],

  // 不飽和度(DBE)の解説
  dbe: {
    title: '不飽和度（DBE: Double Bond Equivalent）',
    formula: 'DBE = (2C + 2 + N − H − X) / 2',
    explanation: '分子式から環・二重結合・三重結合の合計数を計算。飽和アルカン(CₙH₂ₙ₊₂)からHが2つ減るごとにDBEが1増える。',
    examples: [
      { compound: 'C₆H₁₄ (ヘキサン)', dbe: 0, meaning: '完全飽和・鎖状' },
      { compound: 'C₆H₁₂ (シクロヘキサン or ヘキセン)', dbe: 1, meaning: '環1つ or 二重結合1つ' },
      { compound: 'C₆H₆ (ベンゼン)', dbe: 4, meaning: '環1つ + 二重結合3つ' }
    ]
  }
};

// --------------------------------------------------
//  Module 2: 芳香族炭化水素
// --------------------------------------------------
const AROMATIC_HC = {
  intro: '芳香族炭化水素は、ベンゼン環（6つの炭素が正六角形を形成する特殊な環構造）を含む炭化水素です。脂肪族炭化水素とは異なる特殊な安定性（芳香族性）を示し、有機化学において極めて重要な化合物群です。',

  principle: '🔬 合成化学者の視点: 芳香族化合物は「求電子置換反応」で反応するのが最大の特徴。アルケンのような付加反応ではなく、Hを別の基に置換する形で進行し、芳香族性(安定性)が保たれます。Friedel-Crafts反応はその代表例です。',

  benzene: {
    title: 'ベンゼン環の特徴',
    formula: 'C₆H₆',
    dbe: 4,
    points: [
      { label: '構造', text: '6個のCが正六角形。全C-C結合が等価（1.5重結合）。π電子が非局在化（共鳴）' },
      { label: '安定性', text: '共鳴安定化エネルギー ≈ 150 kJ/mol。付加反応よりも置換反応が優先される' },
      { label: 'Hückel則', text: '4n+2個のπ電子(n=1→6個)を持つ平面環状化合物が芳香族性を示す' },
      { label: '表記', text: '六角形の中に○を描く。または交互に二重結合(ケクレ構造)で表す' }
    ]
  },

  naming: {
    title: '芳香族炭化水素の命名法',
    rules: [
      { rule: '一置換ベンゼン', desc: 'ベンゼン環にひとつの置換基が付いた化合物。置換基名 + benzene。', example: 'methylbenzene (= toluene), chlorobenzene' },
      { rule: '二置換ベンゼンの位置', desc: '2つの置換基の相対位置を接頭辞で表す。', example: '1,2- = ortho-(オルト, o-), 1,3- = meta-(メタ, m-), 1,4- = para-(パラ, p-)' },
      { rule: '慣用名', desc: '歴史的に確立された名前が多い。IUPAC名と併記されることが多い。', example: 'toluene, xylene, styrene, phenol, aniline' },
      { rule: 'フェニル基', desc: 'ベンゼン環が置換基として扱われる場合、C₆H₅- = phenyl(フェニル)基と呼ぶ。', example: 'phenyl = C₆H₅-, benzyl = C₆H₅CH₂-' }
    ]
  },

  compounds: [
    {
      name: 'benzene',
      jp: 'ベンゼン',
      formula: 'C₆H₆',
      structure: '⬡',
      desc: '最も基本的な芳香族化合物。無色の液体で甘い匂い。',
      tip: 'DBE=4。ケクレ(1865)が夢の中で蛇が輪を作る姿を見て環構造を着想したという逸話が有名。',
      color: '#f472b6'
    },
    {
      name: 'toluene',
      jp: 'トルエン',
      iupac: 'methylbenzene',
      formula: 'C₆H₅CH₃ (C₇H₈)',
      structure: '⬡-CH₃',
      desc: 'ベンゼンのHをメチル基に置換。溶媒として広く使用。',
      tip: 'トルバルサム(天然樹脂)から発見されたのが名前の由来。IUPACではmethylbenzeneだが慣用名が一般的。',
      color: '#fb923c'
    },
    {
      name: 'xylene',
      jp: 'キシレン',
      iupac: 'dimethylbenzene',
      formula: 'C₆H₄(CH₃)₂ (C₈H₁₀)',
      structure: '⬡-(CH₃)₂',
      desc: 'メチル基2つ。位置により o-, m-, p-キシレンの3種類の異性体が存在。',
      tip: 'オルト(隣接,1,2-)・メタ(1つ飛ばし,1,3-)・パラ(対角,1,4-)の位置関係は置換ベンゼンの基本。',
      color: '#a78bfa'
    },
    {
      name: 'styrene',
      jp: 'スチレン',
      iupac: 'ethenylbenzene',
      formula: 'C₆H₅CH=CH₂ (C₈H₈)',
      structure: '⬡-CH=CH₂',
      desc: 'ビニル基を持つ。重合によりポリスチレン(発泡スチロール)になる。',
      tip: '工業的に極めて重要な芳香族化合物。付加重合の代表的モノマー。',
      color: '#38bdf8'
    },
    {
      name: 'naphthalene',
      jp: 'ナフタレン',
      formula: 'C₁₀H₈',
      structure: '⬡⬡',
      desc: '2つのベンゼン環が辺を共有して縮合。防虫剤(樟脳に代替される前)として有名。',
      tip: '多環芳香族炭化水素(PAH)の最も単純な例。アントラセン(3環),フェナントレン(3環)へと拡張される。',
      color: '#4ade80'
    },
    {
      name: 'phenol',
      jp: 'フェノール',
      formula: 'C₆H₅OH',
      structure: '⬡-OH',
      desc: 'ベンゼン環に-OHが直結。弱酸性を示す（アルコールより酸性が強い）。',
      tip: '芳香環の電子が-OHの安定化に寄与し、酸性度が増す。消毒薬として歴史的に重要。厳密には「芳香族アルコール」ではなく「フェノール類」に分類。',
      color: '#f87171'
    },
    {
      name: 'aniline',
      jp: 'アニリン',
      formula: 'C₆H₅NH₂',
      structure: '⬡-NH₂',
      desc: 'ベンゼン環に-NH₂が直結。染料(アゾ染料)の原料として重要。',
      tip: 'アニリンは弱い塩基性。芳香環のπ電子がN上の電子対を非局在化させるため、脂肪族アミンより塩基性が弱い。',
      color: '#facc15'
    }
  ],

  orthoMetaPara: {
    title: 'オルト・メタ・パラ — 二置換ベンゼンの位置表記',
    positions: [
      { prefix: 'ortho- (o-)', position: '1,2-', meaning: '隣接', jp: 'オルト', color: '#f472b6' },
      { prefix: 'meta- (m-)', position: '1,3-', meaning: '1つ飛ばし', jp: 'メタ', color: '#60a5fa' },
      { prefix: 'para- (p-)', position: '1,4-', meaning: '対角(向かい)', jp: 'パラ', color: '#4ade80' }
    ],
    tip: 'o-, m-, p- は日常的に使われる表記。IUPAC推奨は位置番号(1,2- 等)だが、慣用的にortho/meta/paraが広く使われる。'
  }
};

const AROMATIC_QUIZ = [
  { q: 'ベンゼンの分子式は？', options: ['C₅H₆', 'C₆H₆', 'C₆H₈', 'C₇H₈'], answer: 1, explanation: 'ベンゼンはC₆H₆。6個のCと6個のHで構成。DBE=4。', category: 'aromatic' },
  { q: 'トルエンのIUPAC名は？', options: ['ethylbenzene', 'methylbenzene', 'phenylmethane', 'benzaldehyde'], answer: 1, explanation: 'トルエン(toluene)のIUPAC名はmethylbenzene。ベンゼンにメチル基が1つ。', category: 'aromatic' },
  { q: 'パラ(para-)はベンゼン環の何位と何位？', options: ['1,2-', '1,3-', '1,4-', '1,5-'], answer: 2, explanation: 'para-(パラ)は1,4-位。対角の位置関係。', category: 'aromatic' },
  { q: '芳香族性を示す条件(Hückel則)のπ電子数は？', options: ['2n個', '4n個', '4n+2個', '6n個'], answer: 2, explanation: 'Hückel則: 4n+2個のπ電子を持つ平面環状化合物が芳香族性を示す。ベンゼン(n=1)は6個。', category: 'aromatic' },
  { q: 'ナフタレンの構造は？', options: ['ベンゼン環1つ', 'ベンゼン環2つが縮合', 'ベンゼン環3つが直線状', 'ベンゼン環2つが単結合で接続'], answer: 1, explanation: 'ナフタレン(C₁₀H₈)は2つのベンゼン環が辺を共有して縮合した構造。', category: 'aromatic' },
  { q: 'フェニル基の構造式は？', options: ['C₆H₅-', 'C₆H₆', 'C₆H₅CH₂-', '-C₆H₄-'], answer: 0, explanation: 'フェニル基(phenyl)はC₆H₅-。ベンゼンからH1つを除いた残基。ベンジル基(benzyl)はC₆H₅CH₂-と区別する。', category: 'aromatic' }
];

// --------------------------------------------------
//  Module 2 追加: 分岐鎖（枝分かれ）の命名法
// --------------------------------------------------
const SUBSTITUENTS = [
  { carbon: 1, name: "methyl", jp: "メチル基", formula: "-CH₃", origin: "メタン(methane)から水素1つ除いたもの" },
  { carbon: 2, name: "ethyl", jp: "エチル基", formula: "-C₂H₅", origin: "エタン(ethane)から水素1つ除いたもの" },
  { carbon: 3, name: "propyl", jp: "プロピル基", formula: "-C₃H₇", origin: "プロパン(propane)から水素1つ除いたもの" },
  { carbon: 3, name: "isopropyl", jp: "イソプロピル基", formula: "-CH(CH₃)₂", origin: "枝分かれした3炭素の置換基" },
];

const BRANCHED_NAMING = {
  intro: "直鎖だけでなく、枝分かれ（分岐）した炭化水素も体系的に命名できます。置換基の「名前」「位置番号」「数」を主鎖名の前に付けるのがルールです。",
  
  // 置換基の命名ルール
  substituentRule: "置換基（枝）の名前は、対応するアルカンの語尾 -ane を -yl に変えて作ります。",
  
  // 命名手順の詳細
  steps: [
    {
      step: 1,
      title: "最長鎖（主鎖）を見つける",
      description: "すべての方向を確認し、最も長い連続した炭素鎖を主鎖とする。",
      detail: "直線に見えなくても、折れ曲がった最長鎖が正解の場合があります。",
      example: {
        wrong: "CH₃-CH(CH₃)-CH₃ を「エタン+メチル基」と見るのは❌",
        right: "最長鎖はC3（プロパン）、1つのメチル基が枝として分岐 ✅"
      }
    },
    {
      step: 2,
      title: "主鎖に番号をつける",
      description: "置換基の位置番号が最も小さくなるように、主鎖の端から番号をつける。",
      detail: "どちらの端から数えても主鎖の長さは同じ。置換基が近い方の端から1,2,3…と番号をつけます。",
      example: {
        wrong: "3-メチルブタン ❌（3番目より2番目の方が小さい）",
        right: "2-メチルブタン ✅（位置番号が最小）"
      }
    },
    {
      step: 3,
      title: "置換基の名前・数・位置を決める",
      description: "置換基名は -yl 語尾。同じ置換基が複数ある場合は di-(2個), tri-(3個) をつける。",
      detail: "異なる置換基が複数ある場合は、アルファベット順に並べます。",
      example: {
        wrong: "",
        right: "2,3-ジメチル = 2番と3番にメチル基が1個ずつ"
      }
    },
    {
      step: 4,
      title: "名前を組み立てる",
      description: "位置番号-置換基名 + 主鎖名 の形で組み立てる。",
      detail: "数字とアルファベットの間にはハイフン(-)、数字と数字の間にはカンマ(,)を使います。",
      example: {
        wrong: "",
        right: "2-methylbutane（2-メチルブタン）= 主鎖4C + 2番目にメチル基"
      }
    }
  ],

  // 具体的な命名例
  examples: [
    {
      name: "2-methylpropane",
      jp: "2-メチルプロパン",
      structure: "CH₃-CH(CH₃)-CH₃",
      mainChain: "C3 (プロパン)",
      substituent: "2番にメチル基",
      structureDiagram: [
        "    CH₃",
        "     |",
        "CH₃-CH-CH₃",
        " 1   2   3" 
      ],
      tip: "慣用名「イソブタン」。C4H₁₀のアルカンだが、直鎖ブタンとは異なる構造異性体。"
    },
    {
      name: "2-methylbutane",
      jp: "2-メチルブタン",
      structure: "CH₃-CH(CH₃)-CH₂-CH₃",
      mainChain: "C4 (ブタン)",
      substituent: "2番にメチル基",
      structureDiagram: [
        "    CH₃",
        "     |",
        "CH₃-CH-CH₂-CH₃",
        " 1   2   3   4"
      ],
      tip: "慣用名「イソペンタン」。なぜ3-メチルブタンではないか？→右から数えると3番だが、左から数えると2番。2が小さいので2-メチルブタン。"
    },
    {
      name: "2,2-dimethylpropane",
      jp: "2,2-ジメチルプロパン",
      structure: "C(CH₃)₄",
      mainChain: "C3 (プロパン)",
      substituent: "2番にメチル基×2個",
      structureDiagram: [
        "     CH₃",
        "      |",
        "CH₃-C-CH₃",
        "      |",
        "     CH₃",
        " 1   2   3"
      ],
      tip: "慣用名「ネオペンタン」。中心の炭素に4つのメチル基が付いた対称的な構造。C5H₁₂。"
    },
    {
      name: "3-ethylpentane",
      jp: "3-エチルペンタン",
      structure: "CH₃-CH₂-CH(C₂H₅)-CH₂-CH₃",
      mainChain: "C5 (ペンタン)",
      substituent: "3番にエチル基",
      structureDiagram: [
        "         C₂H₅",
        "          |",
        "CH₃-CH₂-CH-CH₂-CH₃",
        " 1   2    3   4   5"
      ],
      tip: "メチル基だけでなく、エチル基(-C₂H₅)も置換基になれる。"
    },
    {
      name: "2,3-dimethylbutane",
      jp: "2,3-ジメチルブタン",
      structure: "CH₃-CH(CH₃)-CH(CH₃)-CH₃",
      mainChain: "C4 (ブタン)",
      substituent: "2番と3番にメチル基×各1個",
      structureDiagram: [
        "    CH₃  CH₃",
        "     |    |",
        "CH₃-CH--CH-CH₃",
        " 1   2    3   4"
      ],
      tip: "同じ置換基が2つ → di-（ジ）をつける。2,3の位置番号はカンマで区切る。"
    },
    {
      name: "2-methyl-3-ethylpentane",
      jp: "2-メチル-3-エチルペンタン",
      structure: "CH₃-CH(CH₃)-CH(C₂H₅)-CH₂-CH₃",
      mainChain: "C5 (ペンタン)",
      substituent: "2番にメチル基 + 3番にエチル基",
      structureDiagram: [
        "    CH₃  C₂H₅",
        "     |    |",
        "CH₃-CH--CH-CH₂-CH₃",
        " 1   2    3   4   5"
      ],
      tip: "異なる置換基が複数 → アルファベット順！ethyl(E)がmethyl(M)より先。ただし日本語では「メチル, エチル」の順も使われる。"
    }
  ],

  // クイズ問題
  quizQuestions: [
    {
      category: "branched",
      question: "アルカンの語尾 -ane を -yl に変えると何になる？",
      answer: "置換基（アルキル基）の名前",
      options: () => shuffleArray(["置換基（アルキル基）の名前", "アルケンの名前", "官能基の名前", "溶媒の名前"]),
      explanation: "methane → methyl, ethane → ethyl のように、-ane を -yl に変えると置換基名になる。"
    },
    {
      category: "branched",
      question: "CH₃-CH(CH₃)-CH₃ の IUPAC名は？",
      answer: "2-methylpropane",
      options: () => shuffleArray(["2-methylpropane", "1-methylpropane", "methylpropane", "dimethylethane"]),
      explanation: "最長鎖はC3(プロパン)。2番目のCにメチル基 → 2-methylpropane。"
    },
    {
      category: "branched",
      question: "位置番号をつけるときの原則は？",
      answer: "置換基の位置番号が最小になるように番号をつける",
      options: () => shuffleArray([
        "置換基の位置番号が最小になるように番号をつける",
        "左からつねに1,2,3と番号をつける",
        "置換基の位置番号が最大になるように番号をつける",
        "どちらから数えても同じ"
      ]),
      explanation: "IUPAC命名法では、置換基の位置番号が最小になる番号の付け方を採用する。"
    },
    {
      category: "branched",
      question: "同じ置換基が2つ付いている場合、名前の前に何をつける？",
      answer: "di- (ジ)",
      options: () => shuffleArray(["di- (ジ)", "bi- (ビ)", "two- (トゥー)", "duo- (デュオ)"]),
      explanation: "同じ置換基の数: 2個→di-, 3個→tri-, 4個→tetra-"
    },
    {
      category: "branched",
      question: "メチル基(-CH₃)はどのアルカンから導かれる？",
      answer: "メタン (methane)",
      options: () => shuffleArray(["メタン (methane)", "エタン (ethane)", "プロパン (propane)", "ブタン (butane)"]),
      explanation: "methane → methyl。アルカンの -ane を -yl に変えると置換基名。"
    },
    {
      category: "branched",
      question: "2,3-ジメチルブタンには何個のメチル基がある？",
      answer: "2個",
      options: () => shuffleArray(["2個", "1個", "3個", "4個"]),
      explanation: "「ジ(di-)」は2個を意味する。2番と3番の炭素にそれぞれ1個ずつのメチル基。"
    },
    {
      category: "branched",
      question: "異なる種類の置換基が複数ある場合、どの順で並べる？",
      answer: "アルファベット順",
      options: () => shuffleArray(["アルファベット順", "分子量順", "炭素数の多い順", "つけた順"]),
      explanation: "IUPAC命名法では、ethyl(E)→methyl(M)のようにアルファベット順に並べる。di-やtri-はアルファベット順に影響しない。"
    },
    {
      category: "branched",
      question: "「3-methylbutane」の命名は正しい？",
      answer: "正しくない（2-methylbutaneが正しい）",
      options: () => shuffleArray([
        "正しくない（2-methylbutaneが正しい）",
        "正しい",
        "正しいが別名もある",
        "分岐がないので命名できない"
      ]),
      explanation: "反対側から番号を付ければ2番になる。位置番号が最小の「2-methylbutane」が正しい。"
    }
  ]
};

// 分岐鎖クイズ問題
const BRANCHED_QUIZ = BRANCHED_NAMING.quizQuestions;

// --------------------------------------------------
//  Module 2 追加: 官能基を含む化合物の命名法
// --------------------------------------------------
const FG_NAMING_RULES = {
  intro: "官能基を含む化合物の命名法は、炭化水素の命名法の拡張です。官能基の種類によって「接尾辞として語尾を変える」か「接頭辞として前に付ける」かが決まります。",
  principle: "🧪 合成化学者の視点: 命名法の優先順位は酸化段階の高さと対応しています。カルボン酸 > アルデヒド > ケトン > アルコール。これは偶然ではなく、化学的な重要性に基づいています。",
  
  // 接尾辞型（語尾が変わる官能基）
  suffixType: [
    {
      fg: "アルコール (-OH)",
      suffix: "-ol",
      rule: "主鎖の語尾 -e を -ol に変える。OH基の位置番号を付ける。",
      examples: [
        { name: "methanol", jp: "メタノール", structure: "CH₃OH", detail: "meth(C1) + anol → methanol" },
        { name: "ethanol", jp: "エタノール", structure: "C₂H₅OH", detail: "eth(C2) + anol → ethanol" },
        { name: "propan-1-ol", jp: "1-プロパノール", structure: "CH₃CH₂CH₂OH", detail: "prop(C3) + an + 1-ol → 1番目のCにOH" },
        { name: "propan-2-ol", jp: "2-プロパノール", structure: "CH₃CH(OH)CH₃", detail: "prop(C3) + an + 2-ol → 2番目のCにOH" },
        { name: "butan-1-ol", jp: "1-ブタノール", structure: "CH₃CH₂CH₂CH₂OH", detail: "but(C4) + an + 1-ol" },
      ],
      tip: "🧪 位置番号がつくのはC3以降。C1, C2は位置が一意なので番号不要。「OHの位置番号が最小になる」ように番号をつけます。",
      color: "#60a5fa"
    },
    {
      fg: "アルデヒド (-CHO)",
      suffix: "-al",
      rule: "主鎖の語尾 -e を -al に変える。CHO基は必ず端にあるため位置番号は不要。",
      examples: [
        { name: "methanal", jp: "メタナール (ホルムアルデヒド)", structure: "HCHO", detail: "meth(C1) + anal → methanal" },
        { name: "ethanal", jp: "エタナール (アセトアルデヒド)", structure: "CH₃CHO", detail: "eth(C2) + anal → ethanal" },
        { name: "propanal", jp: "プロパナール", structure: "CH₃CH₂CHO", detail: "prop(C3) + anal → propanal" },
      ],
      tip: "🧪 アルデヒド基(-CHO)は必ず炭素鎖の末端にあるため、位置番号は常に1。だから省略できます。慣用名(ホルムアルデヒド、アセトアルデヒドなど)も重要です。",
      color: "#60a5fa"
    },
    {
      fg: "ケトン (>C=O)",
      suffix: "-one",
      rule: "主鎖の語尾 -e を -one に変える。C=O基の位置番号を付ける。",
      examples: [
        { name: "propan-2-one", jp: "プロパン-2-オン (アセトン)", structure: "CH₃COCH₃", detail: "prop(C3) + an + 2-one → 2番目のCにC=O" },
        { name: "butan-2-one", jp: "ブタン-2-オン", structure: "CH₃COCH₂CH₃", detail: "but(C4) + an + 2-one" },
        { name: "pentan-3-one", jp: "ペンタン-3-オン", structure: "CH₃CH₂COCH₂CH₃", detail: "pent(C5) + an + 3-one" },
      ],
      tip: "🧪 最小のケトンはC3（プロパノン=アセトン）。C1, C2ではケトンを作れません（両側に炭素が必要だから）。",
      color: "#60a5fa"
    },
    {
      fg: "カルボン酸 (-COOH)",
      suffix: "-oic acid",
      rule: "主鎖の語尾 -e を -oic acid に変える。COOH基は必ず端にあるため位置番号は不要。",
      examples: [
        { name: "methanoic acid", jp: "メタン酸 (ギ酸)", structure: "HCOOH", detail: "meth(C1) + anoic acid" },
        { name: "ethanoic acid", jp: "エタン酸 (酢酸)", structure: "CH₃COOH", detail: "eth(C2) + anoic acid" },
        { name: "propanoic acid", jp: "プロパン酸", structure: "CH₃CH₂COOH", detail: "prop(C3) + anoic acid" },
      ],
      tip: "🧪 カルボン酸は命名法の優先順位が最も高い！複数の官能基がある場合、カルボン酸の-COOH基を含む最長鎖が主鎖になります。慣用名(ギ酸、酢酸)も頻出です。",
      color: "#60a5fa"
    },
    {
      fg: "アミン (-NH₂)",
      suffix: "-amine",
      rule: "主鎖の語尾 -e を -amine に変える。NH₂基の位置番号を付ける。",
      examples: [
        { name: "methanamine", jp: "メタンアミン (メチルアミン)", structure: "CH₃NH₂", detail: "meth(C1) + anamine" },
        { name: "ethanamine", jp: "エタンアミン (エチルアミン)", structure: "C₂H₅NH₂", detail: "eth(C2) + anamine" },
        { name: "propan-1-amine", jp: "プロパン-1-アミン", structure: "CH₃CH₂CH₂NH₂", detail: "prop(C3) + an + 1-amine" },
      ],
      tip: "🧪 アミンの命名法はアルコールと同じパターン！ -ol → -amine に変わるだけ。OHがNH₂に置き換わったと思えばOK。",
      color: "#c084fc"
    }
  ],
  
  // 接頭辞型（前に付ける官能基）
  prefixType: [
    {
      fg: "ハロゲン (-F, -Cl, -Br, -I)",
      prefix: "fluoro-, chloro-, bromo-, iodo-",
      rule: "ハロゲンの位置番号と接頭辞を主鎖名の前に付ける。",
      examples: [
        { name: "chloromethane", jp: "クロロメタン", detail: "chloro + methane" },
        { name: "2-bromopropane", jp: "2-ブロモプロパン", detail: "2-bromo + propane" },
        { name: "1,2-dichloroethane", jp: "1,2-ジクロロエタン", detail: "1,2-dichloro + ethane" },
      ],
      tip: "🧪 ハロゲンは接頭辞型！語尾は変えず、「◯-ハロ + 親化合物名」の形。複数ある場合はdi-, tri-をつけます。",
      color: "#fb923c"
    },
    {
      fg: "ニトロ基 (-NO₂)",
      prefix: "nitro-",
      rule: "ニトロ基の位置番号と nitro- を主鎖名の前に付ける。",
      examples: [
        { name: "nitrobenzene", jp: "ニトロベンゼン", detail: "nitro + benzene" },
        { name: "2,4,6-trinitrotoluene", jp: "2,4,6-トリニトロトルエン (TNT)", detail: "2,4,6-trinitro + toluene" },
      ],
      tip: "🧪 ニトロ基も接頭辞型。芳香族化合物（ベンゼン環）への命名が特に重要です。",
      color: "#c084fc"
    }
  ],

  // 優先順位表
  priorityOrder: [
    { rank: 1, fg: "カルボン酸", suffix: "-oic acid", note: "最優先 — 主鎖決定に使う" },
    { rank: 2, fg: "エステル", suffix: "-oate", note: "" },
    { rank: 3, fg: "アミド", suffix: "-amide", note: "" },
    { rank: 4, fg: "アルデヒド", suffix: "-al", note: "端の官能基" },
    { rank: 5, fg: "ケトン", suffix: "-one", note: "" },
    { rank: 6, fg: "アルコール", suffix: "-ol", note: "" },
    { rank: 7, fg: "アミン", suffix: "-amine", note: "" },
    { rank: 8, fg: "C=C", suffix: "-ene", note: "不飽和結合" },
    { rank: 9, fg: "C≡C", suffix: "-yne", note: "不飽和結合" },
  ],

  // 命名法クイズ用の問題追加
  quizQuestions: [
    {
      category: "fg_naming",
      question: "エタノール(C₂H₅OH)のIUPAC名の語尾は？",
      answer: "-ol",
      options: () => shuffleArray(["-ol", "-al", "-one", "-ane"]),
      explanation: "アルコール(-OH)を含む化合物の語尾は -ol。ethane → ethanol"
    },
    {
      category: "fg_naming",
      question: "CH₃CHO のIUPAC名は？",
      answer: "ethanal",
      options: () => shuffleArray(["ethanal", "ethanol", "ethanone", "ethanoic acid"]),
      explanation: "C2のアルデヒド。eth(C2) + an + al → ethanal（慣用名: アセトアルデヒド）"
    },
    {
      category: "fg_naming",
      question: "CH₃COCH₃ のIUPAC名は？",
      answer: "propan-2-one",
      options: () => shuffleArray(["propan-2-one", "propan-2-ol", "propanal", "propanoic acid"]),
      explanation: "C3のケトン(2番目のCにC=O)。prop + an + 2-one（慣用名: アセトン）"
    },
    {
      category: "fg_naming",
      question: "CH₃COOH のIUPAC名は？",
      answer: "ethanoic acid",
      options: () => shuffleArray(["ethanoic acid", "ethanal", "ethanol", "methanal"]),
      explanation: "C2のカルボン酸。eth + anoic acid（慣用名: 酢酸）"
    },
    {
      category: "fg_naming",
      question: "アルコールの命名で語尾 -e を何に変える？",
      answer: "-ol",
      options: () => shuffleArray(["-ol", "-al", "-one", "-oic acid"]),
      explanation: "アルコール(-OH)の語尾は -ol。例: methane → methanol"
    },
    {
      category: "fg_naming",
      question: "カルボン酸の命名で語尾 -e を何に変える？",
      answer: "-oic acid",
      options: () => shuffleArray(["-oic acid", "-ol", "-al", "-one"]),
      explanation: "カルボン酸(-COOH)の語尾は -oic acid。例: ethane → ethanoic acid"
    },
    {
      category: "fg_naming",
      question: "ハロゲンを含む化合物の命名法はどのタイプ？",
      answer: "接頭辞型 (前に付ける)",
      options: () => shuffleArray(["接頭辞型 (前に付ける)", "接尾辞型 (語尾を変える)", "慣用名のみ", "番号のみ"]),
      explanation: "ハロゲンは接頭辞型。chloro-, bromo-などを化合物名の前に付ける。"
    },
    {
      category: "fg_naming",
      question: "命名法の優先順位が最も高い官能基は？",
      answer: "カルボン酸",
      options: () => shuffleArray(["カルボン酸", "アルコール", "ケトン", "アルデヒド"]),
      explanation: "カルボン酸 > アルデヒド > ケトン > アルコール の順。複数の官能基がある場合、最も優先順位の高いものが語尾を決める。"
    },
  ]
};

// クイズ問題にFG命名法問題を追加
const FG_NAMING_QUIZ = FG_NAMING_RULES.quizQuestions;

// --------------------------------------------------
//  Module 3: 官能基データ — 体系的分類
// --------------------------------------------------
const FUNCTIONAL_GROUPS = [
  // === 炭化水素系 ===
  {
    id: "cc_double",
    name: "C=C 二重結合",
    nameEn: "Alkene",
    category: "炭化水素系",
    categoryColor: "#4ade80",
    structure: "C=C",
    structureDisplay: "R₁R₂C=CR₃R₄",
    suffix: "-ene",
    electronProperty: "π電子が豊富 → 求電子付加反応",
    acidity: "—",
    polarity: "非極性",
    description: "π電子を持つため、求電子試薬が付加する反応を起こしやすい。",
    reactions: ["付加反応 (HBr, H₂O, H₂)", "酸化反応", "重合反応"],
    examples: ["エチレン(果物の成熟ホルモン)", "プロピレン(プラスチック原料)"],
    tip: "🧪 二重結合はまるで「電子のお店」。電子を欲しがる試薬（求電子試薬）が寄ってきて反応します。",
    relatedGroups: ["cc_triple"],
    level: 1
  },
  {
    id: "cc_triple",
    name: "C≡C 三重結合",
    nameEn: "Alkyne",
    category: "炭化水素系",
    categoryColor: "#4ade80",
    structure: "C≡C",
    structureDisplay: "RC≡CR'",
    suffix: "-yne",
    electronProperty: "π電子がさらに豊富 → 付加反応(2回可能)",
    acidity: "末端アルキンは弱酸性",
    polarity: "非極性",
    description: "2組のπ電子を持ち、付加反応を2段階で起こせる。直線形。",
    reactions: ["付加反応(2段階)", "末端アルキンの酸性反応", "リンドラー触媒による半還元"],
    examples: ["アセチレン(溶接ガス)", "医薬品の構造要素"],
    tip: "🧪 三重結合は2回付加できる。1回で止める（半還元）とcisアルケンが得られる有用な反応があります。",
    relatedGroups: ["cc_double"],
    level: 1
  },
  // === 含酸素系 ===
  {
    id: "hydroxyl",
    name: "ヒドロキシ基",
    nameEn: "Hydroxyl (Alcohol)",
    category: "含酸素系",
    categoryColor: "#60a5fa",
    structure: "-OH",
    structureDisplay: "R-OH",
    suffix: "-ol",
    electronProperty: "O上に非共有電子対 → 水素結合形成",
    acidity: "弱い酸性（水より弱い）",
    polarity: "極性（水素結合可能）",
    description: "水素結合を形成し、水との相溶性を高める。級数（第一/第二/第三級）で反応性が異なる。",
    reactions: ["酸化反応(→アルデヒド/ケトン/カルボン酸)", "脱水反応(→アルケン)", "エステル化"],
    examples: ["エタノール(お酒)", "メタノール(燃料)", "グリセリン(保湿剤)"],
    tip: "🧪 アルコールの「級」が重要！1級 → アルデヒド → カルボン酸、2級 → ケトン、3級 → 酸化されにくい。この酸化の段階は有機化学の柱です。",
    relatedGroups: ["aldehyde", "ketone", "carboxyl"],
    level: 1
  },
  {
    id: "ether",
    name: "エーテル結合",
    nameEn: "Ether",
    category: "含酸素系",
    categoryColor: "#60a5fa",
    structure: "-O-",
    structureDisplay: "R-O-R'",
    suffix: "—（慣用名が多い）",
    electronProperty: "O上に非共有電子対あるが反応性は低い",
    acidity: "—",
    polarity: "弱い極性",
    description: "比較的安定で反応性が低い。溶媒としてよく使われる。",
    reactions: ["酸による開裂（強酸条件）"],
    examples: ["ジエチルエーテル(溶媒)", "テトラヒドロフラン(THF, 溶媒)"],
    tip: "🧪 エーテルは反応性が低いので実験室の溶媒として超重要！ただし引火性が高いので取り扱い注意。",
    relatedGroups: ["hydroxyl"],
    level: 2
  },
  {
    id: "aldehyde",
    name: "アルデヒド基",
    nameEn: "Aldehyde",
    category: "含酸素系",
    categoryColor: "#60a5fa",
    structure: "-CHO",
    structureDisplay: "R-CHO",
    suffix: "-al",
    electronProperty: "C=Oの分極 → 求核付加反応",
    acidity: "α水素がやや酸性",
    polarity: "極性",
    description: "カルボニル基(C=O)の炭素に水素が結合。還元性を持つ（銀鏡反応、フェーリング反応）。",
    reactions: ["酸化(→カルボン酸)", "還元(→アルコール)", "銀鏡反応", "アルドール反応"],
    examples: ["ホルムアルデヒド(ホルマリン)", "アセトアルデヒド(二日酔いの原因)"],
    tip: "🧪 アルデヒドは「酸化段階の中間地点」。アルコール → アルデヒド → カルボン酸 と段階的に酸化されます。",
    relatedGroups: ["hydroxyl", "carboxyl", "ketone"],
    level: 1
  },
  {
    id: "ketone",
    name: "ケトン基",
    nameEn: "Ketone",
    category: "含酸素系",
    categoryColor: "#60a5fa",
    structure: ">C=O",
    structureDisplay: "R-CO-R'",
    suffix: "-one",
    electronProperty: "C=Oの分極 → 求核付加反応（アルデヒドより弱い）",
    acidity: "α水素がやや酸性",
    polarity: "極性",
    description: "カルボニル基の炭素に2つの炭素基が結合。アルデヒドより反応性が低い（還元性なし）。",
    reactions: ["還元(→2級アルコール)", "求核付加反応"],
    examples: ["アセトン(除光液)", "シクロヘキサノン(ナイロン原料)"],
    tip: "🧪 アルデヒドとケトンの違いは入試頻出！アルデヒドは銀鏡反応・フェーリング反応が陽性、ケトンは陰性。Rが1つか2つかの違いです。",
    relatedGroups: ["aldehyde", "hydroxyl"],
    level: 1
  },
  {
    id: "carboxyl",
    name: "カルボキシ基",
    nameEn: "Carboxylic Acid",
    category: "含酸素系",
    categoryColor: "#60a5fa",
    structure: "-COOH",
    structureDisplay: "R-COOH",
    suffix: "-oic acid",
    electronProperty: "共鳴安定化 → プロトンを放出（酸性）",
    acidity: "酸性（有機酸）",
    polarity: "極性（水素結合+イオン化）",
    description: "有機酸。カルボニル基とヒドロキシ基が共鳴で安定化し、プロトン(H⁺)を放出しやすい。",
    reactions: ["中和反応", "エステル化(+アルコール)", "還元(→アルデヒド→アルコール)"],
    examples: ["酢酸(お酢)", "クエン酸(レモン)", "乳酸(筋肉疲労)"],
    tip: "🧪 なぜカルボン酸は酸性？ H⁺が取れた後のカルボキシラートイオン(COO⁻)が共鳴で安定化するからです。共鳴安定化は有機化学の超重要概念！",
    relatedGroups: ["hydroxyl", "aldehyde", "ester"],
    level: 1
  },
  {
    id: "ester",
    name: "エステル結合",
    nameEn: "Ester",
    category: "含酸素系",
    categoryColor: "#60a5fa",
    structure: "-COO-",
    structureDisplay: "R-COO-R'",
    suffix: "-oate",
    electronProperty: "カルボニルの求電子性 → 加水分解",
    acidity: "—",
    polarity: "中程度の極性",
    description: "カルボン酸とアルコールの脱水縮合で生成。果実の香り成分に多い。",
    reactions: ["加水分解(→カルボン酸+アルコール)", "けん化(NaOH水溶液)"],
    examples: ["酢酸エチル(果実の香り)", "油脂(エステルの一種)", "PET(ポリエステル)"],
    tip: "🧪 カルボン酸 + アルコール ⇌ エステル + 水 という平衡反応。この反応を「逆向き」に行えば石鹸ができます（けん化）。",
    relatedGroups: ["carboxyl", "hydroxyl"],
    level: 2
  },
  // === 含窒素系 ===
  {
    id: "amino",
    name: "アミノ基",
    nameEn: "Amine",
    category: "含窒素系",
    categoryColor: "#c084fc",
    structure: "-NH₂",
    structureDisplay: "R-NH₂",
    suffix: "-amine",
    electronProperty: "N上に非共有電子対 → 塩基性・求核性",
    acidity: "塩基性",
    polarity: "極性（水素結合可能）",
    description: "窒素の非共有電子対がプロトンを受け取り塩基として働く。アミノ酸の構成要素。",
    reactions: ["塩生成(+酸)", "アミド結合形成(+カルボン酸)", "ジアゾ化(芳香族アミン)"],
    examples: ["アニリン(染料原料)", "アミノ酸(タンパク質の構成単位)"],
    tip: "🧪 アミノ基は「電子の供給者」。塩基性と求核性は表裏一体 — 非共有電子対がH⁺にも、炭素にも攻撃できます。",
    relatedGroups: ["amide", "nitro"],
    level: 1
  },
  {
    id: "amide",
    name: "アミド結合",
    nameEn: "Amide",
    category: "含窒素系",
    categoryColor: "#c084fc",
    structure: "-CONH-",
    structureDisplay: "R-CO-NHR'",
    suffix: "-amide",
    electronProperty: "共鳴でN上の電子がC=Oに非局在化",
    acidity: "中性（共鳴で塩基性低下）",
    polarity: "極性（水素結合可能）",
    description: "カルボン酸とアミンの脱水縮合。ペプチド結合はアミド結合の一種。",
    reactions: ["加水分解(→カルボン酸+アミン)"],
    examples: ["ペプチド結合(タンパク質)", "ナイロン(ポリアミド)", "尿素"],
    tip: "🧪 アミド結合 = ペプチド結合！タンパク質はアミノ酸がアミド結合で連なったもの。生化学と有機化学の接点です。",
    relatedGroups: ["amino", "carboxyl"],
    level: 2
  },
  {
    id: "nitro",
    name: "ニトロ基",
    nameEn: "Nitro",
    category: "含窒素系",
    categoryColor: "#c084fc",
    structure: "-NO₂",
    structureDisplay: "R-NO₂",
    suffix: "nitro- (接頭辞)",
    electronProperty: "強い電子吸引基",
    acidity: "—（ただし芳香環の酸性を高める）",
    polarity: "極性",
    description: "強い電子吸引基。芳香環上では他の置換基の反応性に大きく影響する。",
    reactions: ["還元(→アミノ基)", "芳香環のニトロ化"],
    examples: ["ニトロベンゼン", "TNT(火薬)", "ニトログリセリン"],
    tip: "🧪 ニトロ基の還元でアミノ基が得られる！ -NO₂ → -NH₂ は工業的にも重要な変換。染料の合成に使われます。",
    relatedGroups: ["amino"],
    level: 2
  },
  // === 含ハロゲン系 ===
  {
    id: "halide",
    name: "ハロゲン化アルキル",
    nameEn: "Alkyl Halide",
    category: "含ハロゲン系",
    categoryColor: "#fb923c",
    structure: "-X (F, Cl, Br, I)",
    structureDisplay: "R-X",
    suffix: "halo- (接頭辞)",
    electronProperty: "C-X結合の分極 → 求核置換・脱離反応",
    acidity: "—",
    polarity: "極性（C-X結合）",
    description: "炭素-ハロゲン結合は分極しており、求核置換反応(Sₙ)と脱離反応(E)を起こす。",
    reactions: ["求核置換反応(SN1, SN2)", "脱離反応(E1, E2)", "グリニャール試薬の調製"],
    examples: ["クロロホルム", "フロン(規制物質)", "塩化ビニル(PVC原料)"],
    tip: "🧪 C-X結合の反応性はハロゲンによって変わる: C-F(非常に強い) < C-Cl < C-Br < C-I(弱い=反応しやすい)。結合が弱いほど脱離しやすい！",
    relatedGroups: [],
    level: 1
  }
];

// 官能基カテゴリの定義
const FG_CATEGORIES = [
  { name: "炭化水素系", color: "#4ade80", icon: "⬡", description: "C-C結合の種類で分類" },
  { name: "含酸素系", color: "#60a5fa", icon: "O", description: "酸素を含む官能基。酸化段階で整理" },
  { name: "含窒素系", color: "#c084fc", icon: "N", description: "窒素を含む官能基。塩基性が特徴" },
  { name: "含ハロゲン系", color: "#fb923c", icon: "X", description: "ハロゲンを含む。置換・脱離反応の起点" },
];

// --------------------------------------------------
//  官能基変換ロードマップ（合成化学的つながり）
// --------------------------------------------------
const TRANSFORMATION_MAP = [
  { from: "hydroxyl", to: "aldehyde", reagent: "酸化 [O]", condition: "1級アルコール" },
  { from: "hydroxyl", to: "ketone", reagent: "酸化 [O]", condition: "2級アルコール" },
  { from: "aldehyde", to: "carboxyl", reagent: "酸化 [O]", condition: "" },
  { from: "aldehyde", to: "hydroxyl", reagent: "還元 [H]", condition: "" },
  { from: "ketone", to: "hydroxyl", reagent: "還元 [H]", condition: "→2級アルコール" },
  { from: "carboxyl", to: "ester", reagent: "+ アルコール (脱水縮合)", condition: "酸触媒" },
  { from: "ester", to: "carboxyl", reagent: "加水分解 / けん化", condition: "" },
  { from: "carboxyl", to: "amide", reagent: "+ アミン (脱水縮合)", condition: "" },
  { from: "nitro", to: "amino", reagent: "還元 [H]", condition: "Sn/HCl など" },
  { from: "cc_double", to: "hydroxyl", reagent: "水和 (H₂O付加)", condition: "酸触媒" },
  { from: "cc_double", to: "halide", reagent: "HX 付加", condition: "" },
  { from: "hydroxyl", to: "halide", reagent: "HX / PBr₃", condition: "" },
  { from: "halide", to: "hydroxyl", reagent: "NaOH (置換反応)", condition: "" },
  { from: "cc_triple", to: "cc_double", reagent: "H₂ (リンドラー触媒)", condition: "半還元" },
];

// --------------------------------------------------
//  Module 4: クイズ問題データ
// --------------------------------------------------
const QUIZ_QUESTIONS = [
  // --- 接頭辞クイズ ---
  ...PREFIXES.map(p => ({
    category: "prefix",
    question: `炭素数 ${p.carbon} の炭化水素に使われる接頭辞は？`,
    answer: p.prefix,
    options: () => shuffleArray([p.prefix, ...getRandomPrefixes(p.prefix, 3)]),
    explanation: p.origin
  })),
  ...PREFIXES.map(p => ({
    category: "prefix",
    question: `接頭辞「${p.prefix}」は炭素数いくつを表す？`,
    answer: String(p.carbon),
    options: () => {
      const wrong = new Set();
      while (wrong.size < 3) {
        const n = Math.floor(Math.random() * 10) + 1;
        if (n !== p.carbon) wrong.add(String(n));
      }
      return shuffleArray([String(p.carbon), ...wrong]);
    },
    explanation: p.origin
  })),
  // --- 語尾クイズ ---
  {
    category: "suffix",
    question: "アルカン（飽和炭化水素）の語尾は？",
    answer: "-ane",
    options: () => ["-ane", "-ene", "-yne", "-ol"],
    explanation: "アルカンはすべて単結合で、語尾は -ane。"
  },
  {
    category: "suffix",
    question: "二重結合(C=C)を含む炭化水素の語尾は？",
    answer: "-ene",
    options: () => ["-ane", "-ene", "-yne", "-al"],
    explanation: "アルケン(二重結合)の語尾は -ene。"
  },
  {
    category: "suffix",
    question: "三重結合(C≡C)を含む炭化水素の語尾は？",
    answer: "-yne",
    options: () => ["-ane", "-ene", "-yne", "-one"],
    explanation: "アルキン(三重結合)の語尾は -yne。"
  },
  {
    category: "suffix",
    question: "一般式 CₙH₂ₙ₊₂ で表される炭化水素の種類は？",
    answer: "アルカン",
    options: () => ["アルカン", "アルケン", "アルキン", "芳香族"],
    explanation: "CₙH₂ₙ₊₂ はアルカンの一般式。全て単結合なので水素数が最大。"
  },
  {
    category: "suffix",
    question: "一般式 CₙH₂ₙ で表される炭化水素の種類は？",
    answer: "アルケン",
    options: () => ["アルカン", "アルケン", "アルキン", "シクロアルカン"],
    explanation: "CₙH₂ₙ はアルケンの一般式（シクロアルカンも同じ式）。"
  },
  // --- 分子式クイズ ---
  ...PREFIXES.slice(0, 5).map(p => ({
    category: "formula",
    question: `${p.jpName}(${p.prefix}ane)の分子式は？`,
    answer: `C${p.carbon}H${2*p.carbon+2}`,
    options: () => shuffleArray([
      `C${p.carbon}H${2*p.carbon+2}`,
      `C${p.carbon}H${2*p.carbon}`,
      `C${p.carbon}H${2*p.carbon-2}`,
      `C${p.carbon+1}H${2*(p.carbon+1)+2}`
    ]),
    explanation: `アルカン CₙH₂ₙ₊₂ に n=${p.carbon} を代入: C${p.carbon}H${2*p.carbon+2}`
  })),
  // --- 官能基クイズ ---
  ...FUNCTIONAL_GROUPS.filter(fg => fg.level === 1).map(fg => ({
    category: "functional_group",
    question: `「${fg.structure}」で表される官能基の名前は？`,
    answer: fg.name,
    options: () => {
      const others = FUNCTIONAL_GROUPS.filter(f => f.id !== fg.id).map(f => f.name);
      return shuffleArray([fg.name, ...others.slice(0, 3)]);
    },
    explanation: fg.description
  })),
  ...FUNCTIONAL_GROUPS.filter(fg => fg.level === 1).map(fg => ({
    category: "functional_group",
    question: `${fg.name}の構造式は？`,
    answer: fg.structure,
    options: () => {
      const others = FUNCTIONAL_GROUPS.filter(f => f.id !== fg.id).map(f => f.structure);
      return shuffleArray([fg.structure, ...others.slice(0, 3)]);
    },
    explanation: fg.description
  })),
  // 反応に関するクイズ
  {
    category: "reaction",
    question: "1級アルコール(R-CH₂OH)を酸化すると何になる？",
    answer: "アルデヒド",
    options: () => ["アルデヒド", "ケトン", "カルボン酸", "エステル"],
    explanation: "1級アルコール → アルデヒド → カルボン酸 と段階的に酸化される。"
  },
  {
    category: "reaction",
    question: "2級アルコール(R₂CHOH)を酸化すると何になる？",
    answer: "ケトン",
    options: () => ["アルデヒド", "ケトン", "カルボン酸", "エーテル"],
    explanation: "2級アルコール → ケトン。ケトンはそれ以上酸化されにくい。"
  },
  {
    category: "reaction",
    question: "カルボン酸 + アルコール で生成されるものは？",
    answer: "エステル",
    options: () => ["エステル", "エーテル", "アミド", "アルデヒド"],
    explanation: "カルボン酸とアルコールの脱水縮合反応でエステルが生成。"
  },
  {
    category: "reaction",
    question: "銀鏡反応・フェーリング反応が陽性になるのは？",
    answer: "アルデヒド",
    options: () => ["アルデヒド", "ケトン", "カルボン酸", "アルコール"],
    explanation: "アルデヒドには還元性があるため、銀鏡反応・フェーリング反応が陽性。ケトンには還元性がない。"
  },
  {
    category: "reaction",
    question: "ニトロ基(-NO₂)を還元すると何が得られる？",
    answer: "アミノ基(-NH₂)",
    options: () => ["アミノ基(-NH₂)", "ヒドロキシ基(-OH)", "カルボキシ基(-COOH)", "アルデヒド基(-CHO)"],
    explanation: "-NO₂ → -NH₂ の還元反応。染料合成（アゾ染料）の重要なステップ。"
  },
];

// ユーティリティ関数
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandomPrefixes(exclude, count) {
  const others = PREFIXES.filter(p => p.prefix !== exclude).map(p => p.prefix);
  return shuffleArray(others).slice(0, count);
}

// --------------------------------------------------
//  反応系統図 — 酸化段階
// --------------------------------------------------
const REACTION_PATHWAY = {
  title: '有機化合物の酸化段階と変換経路',
  intro: 'アルカンから出発して徐々に酸化していくと、アルコール→アルデヒド→カルボン酸の順に変化します。これは有機合成の基本骨格です。',
  steps: [
    { name: 'アルカン', en: 'Alkane', formula: 'R-H', suffix: '-ane', stage: 0, color: '#4ade80', example: 'メタン CH₄' },
    { name: 'アルケン', en: 'Alkene', formula: 'R=R\'', suffix: '-ene', stage: 0.5, color: '#60a5fa', example: 'エテン CH₂=CH₂' },
    { name: 'アルコール', en: 'Alcohol', formula: 'R-OH', suffix: '-ol', stage: 1, color: '#22d3ee', example: 'エタノール CH₃CH₂OH' },
    { name: 'アルデヒド', en: 'Aldehyde', formula: 'R-CHO', suffix: '-al', stage: 2, color: '#fb923c', example: 'アセトアルデヒド CH₃CHO' },
    { name: 'ケトン', en: 'Ketone', formula: 'R-CO-R\'', suffix: '-one', stage: 2, color: '#f472b6', example: 'アセトン CH₃COCH₃' },
    { name: 'カルボン酸', en: 'Carboxylic acid', formula: 'R-COOH', suffix: '-oic acid', stage: 3, color: '#f87171', example: '酢酸 CH₃COOH' },
    { name: 'エステル', en: 'Ester', formula: 'R-COO-R\'', suffix: '-oate', stage: 3.5, color: '#a78bfa', example: '酢酸エチル CH₃COOC₂H₅' }
  ],
  arrows: [
    { from: 'アルカン', to: 'アルケン', reagent: '脱水素 / 高温', type: '脱離' },
    { from: 'アルケン', to: 'アルコール', reagent: 'H₂O (H⁺触媒)', type: '付加' },
    { from: 'アルコール', to: 'アルデヒド', reagent: '穏やかな酸化 (CrO₃)', type: '酸化' },
    { from: 'アルコール', to: 'ケトン', reagent: '第2級アルコールの酸化', type: '酸化' },
    { from: 'アルデヒド', to: 'カルボン酸', reagent: '酸化 (KMnO₄)', type: '酸化' },
    { from: 'カルボン酸', to: 'エステル', reagent: 'アルコール + H⁺ (脱水縮合)', type: 'エステル化' },
    { from: 'アルデヒド', to: 'アルコール', reagent: '還元 (NaBH₄)', type: '還元' },
    { from: 'カルボン酸', to: 'アルデヒド', reagent: '還元', type: '還元' }
  ]
};

// --------------------------------------------------
//  異性体
// --------------------------------------------------
const ISOMERS = {
  title: '異性体 — 同じ分子式、異なる構造',
  intro: '有機化合物では、同じ分子式でも構造の違いにより異なる化合物になることがあります。これを異性体(isomer)と呼びます。',
  types: [
    {
      name: '構造異性体',
      en: 'Structural isomer',
      desc: '原子の結合順序が異なる異性体。炭素骨格の分岐や官能基の位置の違い。',
      color: '#4ade80',
      examples: [
        { formula: 'C₄H₁₀', compounds: ['ブタン (n-butane): 直鎖', '2-メチルプロパン (isobutane): 分岐'], type: '骨格異性体' },
        { formula: 'C₃H₈O', compounds: ['1-プロパノール: OH が端', '2-プロパノール: OH が中央', 'メチルエチルエーテル: エーテル結合'], type: '位置/官能基異性体' }
      ]
    },
    {
      name: '幾何異性体 (cis/trans)',
      en: 'Geometric isomer',
      desc: '二重結合やシクロ環の回転が制限されるため、置換基の空間配置が異なる。',
      color: '#60a5fa',
      examples: [
        { formula: 'C₄H₈', compounds: ['cis-2-ブテン: 同じ側にCH₃', 'trans-2-ブテン: 反対側にCH₃'], type: 'cis/trans' }
      ]
    },
    {
      name: '光学異性体(鏡像異性体)',
      en: 'Optical isomer (enantiomer)',
      desc: '不斉炭素(4つの異なる置換基が付いたC)を持ち、鏡像が重ならない。',
      color: '#c084fc',
      examples: [
        { formula: 'C₃H₇NO₂', compounds: ['L-アラニン: 天然型', 'D-アラニン: 鏡像'], type: '鏡像異性体' }
      ]
    }
  ]
};

// --------------------------------------------------
//  官能基フラッシュカード
// --------------------------------------------------
const FG_FLASHCARDS = [
  { front: '-OH', back: 'ヒドロキシ基 / アルコール (-ol)' },
  { front: '-COOH', back: 'カルボキシ基 / カルボン酸 (-oic acid)' },
  { front: '-CHO', back: 'アルデヒド基 (-al)' },
  { front: '>C=O', back: 'カルボニル基 / ケトン (-one)' },
  { front: '-NH₂', back: 'アミノ基 / アミン (-amine)' },
  { front: '-O-', back: 'エーテル結合 (ether)' },
  { front: '-COO-', back: 'エステル結合 (-oate)' },
  { front: '-CONH₂', back: 'アミド結合 (-amide)' },
  { front: '-NO₂', back: 'ニトロ基 (nitro-)' },
  { front: '-SO₃H', back: 'スルホ基 (-sulfonic acid)' },
  { front: 'C₆H₅-', back: 'フェニル基 (phenyl)' },
  { front: 'ベンゼン', back: 'C₆H₆ / 芳香族の基本骨格' },
  { front: 'トルエン', back: 'C₆H₅CH₃ / methylbenzene' },
  { front: 'ナフタレン', back: 'C₁₀H₈ / 縮合二環式芳香族' }
];

// --------------------------------------------------
//  穴埋めテスト
// --------------------------------------------------
const FILL_IN_TEST = [
  { q: 'エタノールの分子式は □', answer: 'C₂H₅OH', hint: '炭素2個のアルコール', category: 'formula' },
  { q: 'アセトアルデヒドの構造式は □', answer: 'CH₃CHO', hint: '炭素2個のアルデヒド', category: 'structure' },
  { q: '酢酸のIUPAC名は □', answer: 'ethanoic acid', hint: '炭素2個のカルボン酸', category: 'naming' },
  { q: 'C₃H₈ の名前は □', answer: 'プロパン (propane)', hint: 'C3のアルカン', category: 'naming' },
  { q: 'アルカンの一般式は □', answer: 'CₙH₂ₙ₊₂', hint: '飽和鎖状炭化水素', category: 'formula' },
  { q: 'アルケンの一般式は □', answer: 'CₙH₂ₙ', hint: '二重結合を1つ含む', category: 'formula' },
  { q: 'ベンゼンの分子式は □', answer: 'C₆H₆', hint: '最も単純な芳香族', category: 'formula' },
  { q: 'カルボン酸の接尾辞は □', answer: '-oic acid', hint: 'R-COOH', category: 'suffix' },
  { q: 'アルコールの接尾辞は □', answer: '-ol', hint: 'R-OH', category: 'suffix' },
  { q: 'para- は □ 位と □ 位', answer: '1,4', hint: '対角の位置', category: 'position' },
  { q: 'C₅の接頭辞は □', answer: 'pent', hint: 'ギリシャ数詞の5', category: 'prefix' },
  { q: 'エステル化は □ と □ の反応', answer: 'カルボン酸 + アルコール', hint: '脱水縮合', category: 'reaction' }
];

// --------------------------------------------------
//  エステル化・重合反応
// --------------------------------------------------
const REACTION_MECHANISMS = [
  {
    name: 'エステル化（脱水縮合）',
    en: 'Fischer Esterification',
    equation: 'R-COOH + R\'-OH ⇌ R-COO-R\' + H₂O',
    catalyst: 'H⁺（濃硫酸）',
    desc: 'カルボン酸とアルコールが脱水縮合してエステルを生成。可逆反応。',
    example: 'CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O\n（酢酸 + エタノール → 酢酸エチル + 水）',
    tip: '果実の香り成分の多くがエステル。酢酸エチル(接着剤の匂い)、酪酸エチル(パイナップルの匂い)など。',
    color: '#a78bfa'
  },
  {
    name: '加水分解（けん化）',
    en: 'Hydrolysis / Saponification',
    equation: 'R-COO-R\' + NaOH → R-COONa + R\'-OH',
    catalyst: 'NaOH（水酸化ナトリウム）',
    desc: 'エステルにNaOHを加えて加熱するとカルボン酸のナトリウム塩(石鹸)とアルコールに分解。',
    example: '油脂 + 3NaOH → グリセリン + 石鹸(脂肪酸Na)',
    tip: '「けん化」は石鹸を作る反応そのもの。油脂(トリグリセリド)の加水分解。',
    color: '#22d3ee'
  },
  {
    name: '付加重合',
    en: 'Addition Polymerization',
    equation: 'n CH₂=CH₂ → -(CH₂-CH₂)ₙ-',
    catalyst: 'ラジカル開始剤 / 高圧',
    desc: 'アルケン(モノマー)の二重結合が開いて次々と結合し、高分子(ポリマー)を形成。',
    example: 'エチレン → ポリエチレン\nスチレン → ポリスチレン\n塩化ビニル → ポリ塩化ビニル(PVC)',
    tip: '二重結合を持つモノマーが特徴。「ポリ + モノマー名」で命名される。',
    color: '#4ade80'
  },
  {
    name: '縮合重合',
    en: 'Condensation Polymerization',
    equation: 'n HO-R-COOH + n H₂N-R\'-NH₂ → -(CO-R-CONH-R\'-NH)ₙ- + 2n H₂O',
    catalyst: '加熱',
    desc: '2つの官能基を持つモノマーが水などの小分子を脱離しながら結合。',
    example: 'ナイロン6,6: ヘキサメチレンジアミン + アジピン酸\nPET: テレフタル酸 + エチレングリコール',
    tip: 'ペプチド結合(タンパク質)もアミノ酸の縮合重合。アミド結合(-CONH-)の繰り返し。',
    color: '#f472b6'
  }
];

// --------------------------------------------------
//  逆引き練習（構造式→名前）
// --------------------------------------------------
const REVERSE_NAMING = [
  { structure: 'CH₃-CH₂-CH₂-CH₃', answer: 'ブタン (butane)', hint: 'C4のアルカン' },
  { structure: 'CH₂=CH-CH₃', answer: 'プロペン (propene)', hint: 'C3のアルケン' },
  { structure: 'CH≡CH', answer: 'エチン (ethyne)', hint: 'C2のアルキン' },
  { structure: 'CH₃-OH', answer: 'メタノール (methanol)', hint: 'C1のアルコール' },
  { structure: 'CH₃-CHO', answer: 'エタナール (ethanal)', hint: 'C2のアルデヒド' },
  { structure: 'CH₃-COOH', answer: 'エタン酸 (ethanoic acid)', hint: 'C2のカルボン酸(酢酸)' },
  { structure: 'CH₃-CO-CH₃', answer: 'プロパノン (propanone)', hint: 'C3のケトン(アセトン)' },
  { structure: 'CH₃-COO-C₂H₅', answer: '酢酸エチル (ethyl acetate)', hint: 'エステル' },
  { structure: 'C₆H₅-CH₃', answer: 'トルエン (toluene)', hint: 'ベンゼン+メチル基' },
  { structure: 'C₆H₅-OH', answer: 'フェノール (phenol)', hint: 'ベンゼン+OH' }
];
