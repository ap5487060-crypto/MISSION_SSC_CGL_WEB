// Distinctive, crisp SVG Book & Study Material Covers for default products
const createCoverSvg = (
  bgGradient: [string, string],
  accentColor: string,
  topTag: string,
  titleLines: string[],
  subtitle: string,
  badgeText: string,
  iconSymbol: string,
  footerNote: string
) => {
  const [bg1, bg2] = bgGradient;
  const titleSvg = titleLines
    .map((line, i) => `<text x="50%" y="${185 + i * 28}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">${line}</text>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#FDE047" />
      </linearGradient>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.06" />
      </pattern>
    </defs>
    
    <!-- Background Frame -->
    <rect width="320" height="440" rx="14" fill="url(#bg)" />
    <rect width="320" height="440" fill="url(#grid)" />
    
    <!-- Outer Border -->
    <rect x="8" y="8" width="304" height="424" rx="10" fill="none" stroke="${accentColor}" stroke-width="1.5" opacity="0.4" />
    <rect x="14" y="14" width="292" height="412" rx="8" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.12" />

    <!-- Spine effect -->
    <rect x="8" y="8" width="12" height="424" fill="#000000" opacity="0.25" />
    <line x1="20" y1="8" x2="20" y2="432" stroke="#FFFFFF" stroke-width="0.5" opacity="0.2" />

    <!-- Top Badge / Header -->
    <rect x="40" y="32" width="240" height="26" rx="13" fill="${accentColor}" opacity="0.2" />
    <rect x="40" y="32" width="240" height="26" rx="13" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.6" />
    <text x="50%" y="49" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="10" fill="${accentColor}" text-anchor="middle" letter-spacing="1.2">${topTag}</text>

    <!-- Center Icon Symbol / Emblem -->
    <circle cx="160" cy="115" r="38" fill="${accentColor}" opacity="0.15" />
    <circle cx="160" cy="115" r="38" fill="none" stroke="${accentColor}" stroke-width="1.5" opacity="0.5" />
    <text x="160" y="125" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="28" fill="#F8FAFC" text-anchor="middle">${iconSymbol}</text>

    <!-- Main Title -->
    ${titleSvg}

    <!-- Divider Line -->
    <line x1="80" y1="${200 + titleLines.length * 28}" x2="240" y2="${200 + titleLines.length * 28}" stroke="${accentColor}" stroke-width="2" opacity="0.6" />

    <!-- Subtitle / Key Highlights -->
    <text x="50%" y="${225 + titleLines.length * 28}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="600" font-size="11" fill="#CBD5E1" text-anchor="middle">${subtitle}</text>

    <!-- Feature Badge Pill -->
    <rect x="60" y="340" width="200" height="32" rx="16" fill="url(#gold)" />
    <text x="50%" y="360" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="11" fill="#0F172A" text-anchor="middle" letter-spacing="0.5">${badgeText}</text>

    <!-- Footer Branding -->
    <text x="50%" y="405" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="9" fill="#94A3B8" text-anchor="middle" letter-spacing="1">MISSION_SSC_CGL • ${footerNote}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const COVER_IMAGES = {
  mathsHandbook: createCoverSvg(
    ['#07192F', '#0C3559'],
    '#38BDF8',
    'SSC CGL • TIER 1 & TIER 2',
    ['MATHS FORMULA', '& SHORT TRICKS'],
    '500+ Shortcuts • Geometry • Trig • Algebra',
    '⚡ MASTER HANDBOOK',
    '∑ π',
    'QUANTITATIVE APTITUDE'
  ),
  englishRules: createCoverSvg(
    ['#1A102F', '#3B185F'],
    '#F59E0B',
    'SSC CGL • CHSL • CPO • MTS',
    ['100 GOLDEN RULES', 'OF ENGLISH GRAMMAR'],
    'Spotting Errors • Vocab • Comprehension',
    '⭐ MUST-HAVE HANDBOOK',
    'Aa',
    'ENGLISH LANGUAGE'
  ),
  staticGk: createCoverSvg(
    ['#06281E', '#0D4E3A'],
    '#34D399',
    'EXAM-REPEATED HIGH YIELD',
    ['STATIC GK MINDMAPS', '& VISUAL BOOSTER'],
    'Polity • Folk Dances • River Systems • History',
    '🎯 VISUAL RETENTION NOTES',
    '🗺️',
    'GENERAL AWARENESS'
  ),
  freeTrigSheet: createCoverSvg(
    ['#111827', '#1E3A8A'],
    '#60A5FA',
    '100% FREE REVISION PDF',
    ['GEOMETRY & TRIG', 'QUICK FORMULA SHEET'],
    'Circle Theorems • Triangle Incenters • Max-Min',
    '📥 FREE CHEATSHEET',
    '⊿ θ',
    'FREE STUDY VAULT'
  ),
  freeVocabPyq: createCoverSvg(
    ['#18181B', '#27272A'],
    '#FACC15',
    '100% FREE VAULT DOWNLOAD',
    ['500 MOST REPEATED', 'ONE WORD SUBSTITUTIONS'],
    '2018-2025 TCS Repeated Questions',
    '📥 FREE PDF DOWNLOAD',
    '📖',
    'FREE STUDY VAULT'
  ),
  freePolitySheet: createCoverSvg(
    ['#1C1917', '#44403C'],
    '#FB923C',
    '100% FREE REVISION PDF',
    ['INDIAN CONSTITUTION', 'IMPORTANT ARTICLES'],
    'Articles 1-395 • Amendments • Rights (12-35)',
    '📥 FREE PDF SUMMARY',
    '⚖️',
    'FREE STUDY VAULT'
  ),
  pinnacleMaths: createCoverSvg(
    ['#8B0000', '#B22222'],
    '#FDE047',
    'OFFICIAL PRINTED BOOK',
    ['PINNACLE SSC MATHS', '6800+ TCS PYQ BANK'],
    'Chapterwise & Typewise • Bilingual Solutions',
    '🔥 BUY ORIGINAL ON AMAZON/FLIPKART',
    '📚',
    'CHECK WEBSITE FOR LIVE PRICE'
  ),
  blackBookVocab: createCoverSvg(
    ['#050505', '#171717'],
    '#F59E0B',
    'OFFICIAL PRINTED BOOK',
    ['BLACK BOOK OF', 'ENGLISH VOCABULARY'],
    'By Nikhil Gupta • 10,000+ Words & Idioms',
    '🔥 BUY ORIGINAL ON AMAZON/FLIPKART',
    '📕',
    'CHECK WEBSITE FOR LIVE PRICE'
  ),
  reasoningPuzzles: createCoverSvg(
    ['#0F172A', '#1E1B4B'],
    '#A855F7',
    'SSC CGL • CHSL • CPO',
    ['REASONING 500+', 'MASTER PUZZLES & TRICKS'],
    'Blood Relations • Syllogism • Coding-Decoding',
    '🧩 COMPLETE SHORTCUTS',
    '🎯',
    'GENERAL INTELLIGENCE & REASONING'
  ),
  idiomsPocket: createCoverSvg(
    ['#18181B', '#312E81'],
    '#38BDF8',
    'HIGH FREQUENCY REVISION',
    ['1000+ IDIOMS & PHRASES', 'POCKET BOOSTER'],
    'With Hindi Meaning & TCS Exam Examples',
    '⚡ QUICK REVISION BOOSTER',
    '💡',
    'ENGLISH VOCABULARY'
  )
};
