export interface Flashcard {
  id: string;
  subject: 'maths' | 'english' | 'reasoning' | 'gk';
  category: string;
  front: string;
  back: string;
  tip?: string;
  pyqFrequency?: 'High' | 'Very High' | 'Frequent';
}

export const FLASHCARDS_DECK: Flashcard[] = [
  // ---------------- MATHS / QUANT FORMULAS ----------------
  {
    id: 'm1',
    subject: 'maths',
    category: 'Algebra',
    front: 'If x + 1/x = k, what is x² + 1/x² and x³ + 1/x³?',
    back: '• x² + 1/x² = k² - 2\n• x³ + 1/x³ = k³ - 3k\n• x⁴ + 1/x⁴ = (k² - 2)² - 2\n• x⁵ + 1/x⁵ = (k² - 2)(k³ - 3k) - k',
    tip: 'Special Case: If x + 1/x = √3, then x⁶ = -1 and x⁶ + 1 = 0.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'm2',
    subject: 'maths',
    category: 'Algebra',
    front: 'If a + b + c = 0, what is the value of a³ + b³ + c³?',
    back: 'a³ + b³ + c³ = 3abc\n\nGeneral formula:\na³ + b³ + c³ - 3abc = (a + b + c)(a² + b² + c² - ab - bc - ca)\n= 1/2(a + b + c)[(a - b)² + (b - c)² + (c - a)²]',
    tip: 'If a = b = c, then a³ + b³ + c³ - 3abc = 0 as well.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'm3',
    subject: 'maths',
    category: 'Geometry',
    front: 'Direct Common Tangent (DCT) vs Transverse Common Tangent (TCT)',
    back: 'Let d = distance between centres, r₁ and r₂ = radii.\n\n• Length of DCT = √(d² - (r₁ - r₂)²)\n• Length of TCT = √(d² - (r₁ + r₂)²)',
    tip: 'DCT is always longer than TCT since (r₁ - r₂)² < (r₁ + r₂)²',
    pyqFrequency: 'High'
  },
  {
    id: 'm4',
    subject: 'maths',
    category: 'Geometry',
    front: 'Inradius (r) and Circumradius (R) of a Right Angled Triangle',
    back: 'For a right triangle with legs a, b and hypotenuse c:\n\n• Inradius (r) = (a + b - c) / 2\n• Circumradius (R) = Hypotenuse / 2 = c / 2\n• Area = r × (r + 2R) = r × s',
    tip: 'Circumcentre always lies at the midpoint of hypotenuse.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'm5',
    subject: 'maths',
    category: 'Trigonometry',
    front: 'Maximum and Minimum values of a·sinθ ± b·cosθ',
    back: '• Maximum value = +√(a² + b²)\n• Minimum value = -√(a² + b²)\n\nFor a·sin²θ + b·cosec²θ (a, b > 0):\n• Minimum value = 2√(ab)',
    tip: 'For a·tan²θ + b·cot²θ, Minimum value = 2√(ab).',
    pyqFrequency: 'High'
  },
  {
    id: 'm6',
    subject: 'maths',
    category: 'Arithmetic (CI & SI)',
    front: 'Difference between CI and SI for 2 Years and 3 Years at Rate R%',
    back: '• For 2 Years: Diff = P × (R / 100)²\n\n• For 3 Years: Diff = P × (R / 100)² × (3 + R / 100)\n\nAlternatively for 3 Years: Diff = 3 × (2-yr diff) + P × (R / 100)³',
    tip: 'Direct 5-second calculation without calculating individual CI amounts.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'm7',
    subject: 'maths',
    category: 'Profit & Loss',
    front: 'Dishonest Dealer / Shopkeeper Weight Cheating Formula',
    back: 'Gain % = [ Error / (True Value - Error) ] × 100\n\nExample: If a shopkeeper uses 900g instead of 1000g:\nGain % = [ 100 / (1000 - 100) ] × 100 = (100 / 900) × 100 = 11.11%',
    tip: 'If he also sells at x% profit, use successive profit multiplication.',
    pyqFrequency: 'High'
  },
  {
    id: 'm8',
    subject: 'maths',
    category: 'Time & Work',
    front: 'Men, Days, Hours & Work (MDH Formula) and Efficiency',
    back: '(M₁ × D₁ × H₁ × E₁) / W₁ = (M₂ × D₂ × H₂ × E₂) / W₂\n\nTotal Work = Efficiency × Time\nEfficiency Ratio is always inversely proportional to Time Taken Ratio.',
    tip: 'If A is 3 times as efficient as B, Ratio of Time taken = 1 : 3.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'm9',
    subject: 'maths',
    category: 'Speed & Distance',
    front: 'Relative Speed & Average Speed Formulas',
    back: '• Same Direction: Relative Speed = |S₁ - S₂|\n• Opposite Direction: Relative Speed = S₁ + S₂\n\n• Average Speed (Equal Distance D): (2 × S₁ × S₂) / (S₁ + S₂)\n• Average Speed (General): Total Distance / Total Time',
    tip: 'For Trains crossing a pole: Distance = Length of Train. Crossing platform: Distance = Train + Platform.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'm10',
    subject: 'maths',
    category: 'Mensuration 3D',
    front: 'Volume & Curved Surface Area (CSA) of Cone, Sphere, Frustum',
    back: '• Cone: Vol = 1/3 πr²h, CSA = πrl (where l = √(r² + h²))\n• Sphere: Vol = 4/3 πr³, Surface Area = 4πr²\n• Hemisphere: Vol = 2/3 πr³, CSA = 2πr², TSA = 3πr²\n• Frustum: Vol = 1/3 πh(R² + r² + Rr)',
    tip: 'When sphere is melted into cylinders or cones, Volumes remain equal.',
    pyqFrequency: 'High'
  },

  // ---------------- ENGLISH GOLDEN GRAMMAR & VOCAB ----------------
  {
    id: 'e1',
    subject: 'english',
    category: 'Golden Grammar Rule',
    front: 'Rule on "Neither... nor", "Either... or", and "Not only... but also"',
    back: 'When two subjects are joined by:\n• Either... or\n• Neither... nor\n• Not only... but also\n• Or / Nor\n\nThe verb AGREES with the NEAREST (closest) subject.\n\nExample: Neither the teacher nor the students WERE present.',
    tip: 'If subjects are reversed: Neither the students nor the teacher WAS present.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'e2',
    subject: 'english',
    category: 'Golden Grammar Rule',
    front: 'Rule on "As well as", "Along with", "Together with", "In addition to"',
    back: 'When two subjects are joined by:\n• as well as, along with, together with, with, in addition to, accompanied by, like, unlike, except, rather than...\n\nThe verb agrees strictly with the FIRST SUBJECT.\n\nExample: The Captain along with all his players WAS honored.',
    tip: 'Don’t get confused by the plural noun right before the verb.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'e3',
    subject: 'english',
    category: 'Golden Grammar Rule',
    front: 'Rule on "Each of", "Either of", "Neither of", "One of"',
    back: 'Formula:\n[ Each / Either / Neither / One / None ] of + PLURAL NOUN + SINGULAR VERB\n\nExample: One of the students WAS absent (NOT were).\nExample: Each of the girls HAS submitted her assignment.',
    tip: 'Exception: "One of the + Plural Noun + THAT/WHO (Relative Pronoun) + PLURAL Verb".',
    pyqFrequency: 'Very High'
  },
  {
    id: 'e4',
    subject: 'english',
    category: 'Correlative Conjunctions',
    front: 'Fixed Conjunction Pairs: Hardly, Scarcely, No Sooner, Lest',
    back: '• Hardly / Scarcely → followed by WHEN (with Inversion: Hardly had he...)\n• No Sooner → followed by THAN (NOT then/when)\n• Lest → followed strictly by SHOULD (Never use not with lest)\n• Between → followed by AND (NOT to)\n• From → followed by TO',
    tip: 'No sooner did he see the police THAN he ran away.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'e5',
    subject: 'english',
    category: 'Conditional Sentences',
    front: 'The 3 Main Conditional Tense Structures',
    back: '1. Open Condition: If + Simple Present (V1), ... Will / Shall + V1\n   • If it rains, we will cancel the match.\n\n2. Imaginary Condition: If + Simple Past (V2 / WERE), ... Would + V1\n   • If I were a king, I would help the poor.\n\n3. Unfulfilled Past: If + Past Perfect (Had + V3), ... Would have + V3\n   • If he had studied, he would have passed.',
    tip: 'Never use "would have" in the "If" clause.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'e6',
    subject: 'english',
    category: 'Prepositions',
    front: 'Fixed Prepositions with "Prefer", "Senior", "Abide", "Refrain"',
    back: '• Senior, Junior, Prior, Superior, Inferior, Prefer → followed by TO (NOT than)\n• Abide → BY (abide by rules)\n• Abstain / Refrain / Prohibit / Prevent → FROM + V4 (Gerund)\n• Accused → OF | Charged → WITH\n• Congratulate → ON',
    tip: 'He prefers tea TO coffee (NOT than coffee).',
    pyqFrequency: 'Very High'
  },
  {
    id: 'e7',
    subject: 'english',
    category: 'Vocabulary & Root Words',
    front: 'High-Yield Root Word: "CIDE" (Killing / Murder)',
    back: '• Regicide = Murder of a King\n• Patricide = Murder of Father | Matricide = Murder of Mother\n• Fratricide = Murder of Brother | Sororicide = Murder of Sister\n• Uxoricide = Murder of Wife | Mariticide = Murder of Husband\n• Infanticide = Murder of an Infant | Genocide = Mass extermination',
    tip: 'Root word "CIDE" always relates to killing or termination.',
    pyqFrequency: 'High'
  },
  {
    id: 'e8',
    subject: 'english',
    category: 'Idioms & Phrases',
    front: 'Top Repeated TCS Idioms: "Once in a blue moon", "To burn the midnight oil"',
    back: '• Once in a blue moon = Very rarely / seldom\n• Burn the midnight oil = Work or study hard late into the night\n• A blessing in disguise = Something good that seemed bad at first\n• To spill the beans = Reveal a secret unintentionally\n• At the drop of a hat = Instantly, without any hesitation',
    tip: 'Frequent 2-mark direct question in Tier 1 & Tier 2.',
    pyqFrequency: 'Very High'
  },

  // ---------------- REASONING SHORTCUTS ----------------
  {
    id: 'r1',
    subject: 'reasoning',
    category: 'Alphabet Codes',
    front: 'EJOTY & Reverse Alphabet Pair Formulas (Sum = 27)',
    back: 'Forward Multiples of 5:\nE (5), J (10), O (15), T (20), Y (25)\n\nReverse Opposite Pairs (Sum of Positions = 27):\n• A-Z (Azad)       • B-Y (Boy)        • C-X (Crux)\n• D-W (Dew)        • E-V (Ev)         • F-U (Fun)\n• G-T (GT Road)    • H-S (High School)• I-R (Indian Rail)\n• J-Q (Jungle Queen)• K-P (Kurta Pyjama)• L-O (Love) • M-N (Man)',
    tip: 'Position of letter from Right = 27 - Position from Left.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'r2',
    subject: 'reasoning',
    category: 'Clock & Calendar',
    front: 'Angle between Hour Hand & Minute Hand at time H:M',
    back: 'Angle θ = |(30 × H) - (11/2 × M)|\n\nExample: At 4:20:\nθ = |(30 × 4) - (11/2 × 20)| = |120 - 110| = 10°\n\nMirror Image of Clock = Subtract time from 11:60 (or 23:60).',
    tip: 'Hands coincide 22 times in 24 hours, perpendicular 44 times in 24 hours.',
    pyqFrequency: 'High'
  },
  {
    id: 'r3',
    subject: 'reasoning',
    category: 'Syllogism',
    front: 'Core Syllogism Venn Deduction Rules',
    back: '• All A are B: A is completely inside B.\n• Some A are B: Overlapping circle.\n• No A is B: Separate circles with cross link.\n\nGolden Rule:\nIf Statements are purely POSITIVE, definite NEGATIVE conclusion can NEVER follow (only possibility may follow).',
    tip: 'Either/Or condition: 1 positive + 1 negative conclusion with same subject & predicate.',
    pyqFrequency: 'Very High'
  },

  // ---------------- GENERAL AWARENESS / POLITY / SCIENCE ----------------
  {
    id: 'g1',
    subject: 'gk',
    category: 'Indian Polity',
    front: 'Fundamental Rights Articles (Part III: Articles 12 to 35)',
    back: '• Right to Equality: Articles 14 to 18\n• Right to Freedom: Articles 19 to 22 (Art 21: Life & Liberty)\n• Right against Exploitation: Articles 23 & 24\n• Freedom of Religion: Articles 25 to 28\n• Cultural & Educational Rights: Articles 29 & 30\n• Right to Constitutional Remedies: Article 32 (Heart & Soul of Constitution)',
    tip: 'Article 20 & 21 cannot be suspended even during National Emergency (Art 352).',
    pyqFrequency: 'Very High'
  },
  {
    id: 'g2',
    subject: 'gk',
    category: 'Indian Polity',
    front: 'Constitutional Emergency Provisions & Writs',
    back: 'Emergencies:\n• Article 352 = National Emergency (War, External aggression, Armed rebellion)\n• Article 356 = President’s Rule (State Emergency)\n• Article 360 = Financial Emergency (Never imposed in India)\n\n5 Supreme Court Writs (Art 32) / High Court (Art 226):\n1. Habeas Corpus  2. Mandamus  3. Prohibition  4. Certiorari  5. Quo-Warranto',
    tip: 'High Court writ jurisdiction (Art 226) is wider than Supreme Court (Art 32).',
    pyqFrequency: 'Very High'
  },
  {
    id: 'g3',
    subject: 'gk',
    category: 'General Science',
    front: 'Common Chemical Names & Formulas',
    back: '• Baking Soda = Sodium Bicarbonate (NaHCO₃)\n• Washing Soda = Sodium Carbonate Decahydrate (Na₂CO₃·10H₂O)\n• Bleaching Powder = Calcium Hypochlorite (CaOCl₂)\n• Plaster of Paris = Calcium Sulphate Hemihydrate (CaSO₄·1/2H₂O)\n• Gypsum = Calcium Sulphate Dihydrate (CaSO₄·2H₂O)\n• Laughing Gas = Nitrous Oxide (N₂O)',
    tip: 'Heating Gypsum at 373K produces Plaster of Paris.',
    pyqFrequency: 'Very High'
  },
  {
    id: 'g4',
    subject: 'gk',
    category: 'Static GK',
    front: 'Classical Dances of India and their Origin States (8 Recognized)',
    back: '1. Bharatanatyam → Tamil Nadu\n2. Kathak → Uttar Pradesh / North India\n3. Kathakali → Kerala\n4. Kuchipudi → Andhra Pradesh\n5. Odissi → Odisha\n6. Sattriya → Assam (Founded by Srimanta Sankardev)\n7. Manipuri → Manipur\n8. Mohiniyattam → Kerala',
    tip: 'Sattriya was added latest in the year 2000.',
    pyqFrequency: 'Very High'
  }
];

/**
 * Returns daily rotation of flashcards based on date timestamp so every day user gets a freshly shuffled deck without requiring an external API.
 */
export function getDailyFlashcards(cards: Flashcard[], limit: number = 8): Flashcard[] {
  if (!cards || cards.length === 0) return [];
  
  // Deterministic seed based on day number since epoch (changes every midnight)
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Clone and pseudo-shuffle with daySeed
  const shuffled = [...cards].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) * 31 + a.id.charCodeAt(a.id.length - 1) + daySeed) % 100;
    const hashB = (b.id.charCodeAt(0) * 31 + b.id.charCodeAt(b.id.length - 1) + daySeed) % 100;
    return hashA - hashB;
  });
  
  return shuffled.slice(0, limit);
}
