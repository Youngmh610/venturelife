// âââ HELPERS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function fmt(n) {
  if (n === undefined || n === null) return '$0'
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${n < 0 ? '-' : ''}$${(abs / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000)     return `${n < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000)         return `${n < 0 ? '-' : ''}$${(abs / 1_000).toFixed(0)}K`
  return `${n < 0 ? '-' : ''}$${abs.toFixed(0)}`
}

export function pct(n) { return `${n > 0 ? '+' : ''}${n}%` }

export const monthNames = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
]

// âââ INDUSTRIES âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const INDUSTRIES = [
  { id: 'tech',      name: 'Technology',   icon: 'ð»', baseRev: 12000,  baseCost: 7000,  color: '#60A5FA' },
  { id: 'retail',    name: 'Retail',       icon: 'ðï¸', baseRev: 8000,   baseCost: 5500,  color: '#F472B6' },
  { id: 'food',      name: 'Food & Bev',   icon: 'ð', baseRev: 7000,   baseCost: 5000,  color: '#FBBF24' },
  { id: 'media',     name: 'Media',        icon: 'ðº', baseRev: 10000,  baseCost: 6000,  color: '#A78BFA' },
  { id: 'fintech',   name: 'FinTech',      icon: 'ð³', baseRev: 15000,  baseCost: 9000,  color: '#34D399' },
  { id: 'health',    name: 'Healthcare',   icon: 'ð¥', baseRev: 13000,  baseCost: 10000, color: '#F87171' },
  { id: 'realestate',name: 'Real Estate',  icon: 'ðï¸', baseRev: 20000,  baseCost: 15000, color: '#FB923C' },
  { id: 'mfg',       name: 'Manufacturing',icon: 'ð­', baseRef: 9000,   baseCost: 7000,  color: '#94A3B8' },
  { id: 'fashion',   name: 'Fashion',      icon: 'ð', baseRev: 11000,  baseCost: 7500,  color: '#E879F9' },
  { id: 'gaming',    name: 'Gaming',       icon: 'ð®', baseRev: 14000,  baseCost: 8000,  color: '#38BDF8' },
]

// âââ PROPERTY TYPES âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const PROPERTY_TYPES = {
  hq: {
    name: 'Headquarters',
    baseCost: 0,
    description: 'Your main office',
    levels: [
      { cost: 0,      revenue: 0, label: 'Starter HQ' },
      { cost: 50000,  revenue: 0, label: 'Expanded HQ' },
      { cost: 200000, revenue: 0, label: 'Campus' },
    ]
  },
  store: {
    name: 'Retail Store',
    baseCost: 15000,
    description: 'Sells directly to customers',
    levels: [
      { cost: 0,      revenue: 3000,  label: 'Small Shop' },
      { cost: 25000,  revenue: 7000,  label: 'Mid Store' },
      { cost: 60000,  revenue: 14000, label: 'Flagship' },
      { cost: 120000, revenue: 25000, label: 'Mega Store' },
    ]
  },
  office: {
    name: 'Office Building',
    baseCost: 30000,
    description: 'Reduces operating costs',
    levels: [
      { cost: 0,      costReduction: 0.05, revenue: 0, label: 'Shared Office' },
      { cost: 45000,  costReduction: 0.10, revenue: 0, label: 'Full Floor' },
      { cost: 90000,  costReduction: 0.18, revenue: 0, label: 'Tower Suite' },
    ]
  },
  housing: {
    name: 'Employee Housing',
    baseCost: 20000,
    description: 'Boosts morale, reduces turnover',
    levels: [
      { cost: 0,      morale: 5,  revenue: 500,  label: 'Apartments' },
      { cost: 35000,  morale: 10, revenue: 1200, label: 'Complex' },
      { cost: 80000,  morale: 18, revenue: 2500, label: 'Campus Living' },
    ]
  },
  warehouse: {
    name: 'Warehouse',
    baseCost: 25000,
    description: 'Cuts supply chain costs',
    levels: [
      { cost: 0,      costReduction: 0.06, revenue: 0, label: 'Small Depot' },
      { cost: 40000,  costReduction: 0.12, revenue: 0, label: 'Regional Hub' },
      { cost: 85000,  costReduction: 0.20, revenue: 0, label: 'Distribution Center' },
    ]
  },
}

// âââ CITIES âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const CITIES = [
  { id: 'riverside', name: 'Riverside',   country: 'USA',        tier: 1, unlockCost: 0,       marketMult: 1.0,  grid: 7  },
  { id: 'chicago',   name: 'Chicago',     country: 'USA',        tier: 2, unlockCost: 75000,   marketMult: 1.2,  grid: 8  },
  { id: 'nyc',       name: 'New York',    country: 'USA',        tier: 2, unlockCost: 200000,  marketMult: 1.4,  grid: 9  },
  { id: 'london',    name: 'London',      country: 'UK',         tier: 3, unlockCost: 500000,  marketMult: 1.5,  grid: 9  },
  { id: 'tokyo',     name: 'Tokyo',       country: 'Japan',      tier: 3, unlockCost: 750000,  marketMult: 1.6,  grid: 10 },
  { id: 'dubai',     name: 'Dubai',       country: 'UAE',        tier: 4, unlockCost: 1500000, marketMult: 1.8,  grid: 10 },
  { id: 'singapore', name: 'Singapore',   country: 'Singapore',  tier: 4, unlockCost: 2000000, marketMult: 1.9,  grid: 11 },
  { id: 'saopaulo',  name: 'SÃ£o Paulo',   country: 'Brazil',     tier: 3, unlockCost: 600000,  marketMult: 1.35, grid: 9  },
]

// âââ DEPARTMENTS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const DEPARTMENTS = [
  { id: 'sales',    name: 'Sales',      exec: 'VP of Sales',       upgradeCost: 5000,  execSalary: 12000 },
  { id: 'ops',      name: 'Operations', exec: 'COO',               upgradeCost: 6000,  execSalary: 15000 },
  { id: 'mktg',     name: 'Marketing',  exec: 'CMO',               upgradeCost: 5500,  execSalary: 13000 },
  { id: 'finance',  name: 'Finance',    exec: 'CFO',               upgradeCost: 7000,  execSalary: 16000 },
  { id: 'tech',     name: 'Technology', exec: 'CTO',               upgradeCost: 8000,  execSalary: 18000 },
  { id: 'hr',       name: 'HR',         exec: 'Chief People Officer', upgradeCost: 4500, execSalary: 11000 },
]

// âââ STARTING SCENARIOS âââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const STARTS = [
  {
    id: 'bootstrap',
    name: 'Bootstrapped',
    capital: 10000,
    skill: 60,
    connections: 20,
    description: 'Started with your savings and a dream. Lean, scrappy, and hungry.',
  },
  {
    id: 'garage',
    name: 'Garage Genius',
    capital: 5000,
    skill: 85,
    connections: 15,
    description: 'Your product is brilliant â but your wallet is nearly empty.',
  },
  {
    id: 'corporate',
    name: 'Corporate Refugee',
    capital: 60000,
    skill: 75,
    connections: 60,
    description: 'Left a cushy job to bet on yourself. You know the playbook.',
  },
  {
    id: 'family',
    name: 'Family Money',
    capital: 250000,
    skill: 50,
    connections: 80,
    description: 'Seed capital from family plus their network. Can you live up to it?',
  },
  {
    id: 'serial',
    name: 'Serial Entrepreneur',
    capital: 80000,
    skill: 90,
    connections: 70,
    description: 'Your last company sold. Now you\'re building smarter, faster.',
  },
]

// âââ RANDOM EVENTS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const EVENTS = [
  {
    id: 'press_hit',
    title: 'Media Spotlight',
    category: 'Media',
    description: 'A major publication wants to run a profile on your company. How do you play it?',
    choices: [
      {
        id: 'grant',
        text: 'Grant full access â let them tell your story.',
        outcomes: [
          { chance: 0.7, text: 'Glowing coverage! Brand skyrockets.', effects: { brand: 20, revenue: 0.08 } },
          { chance: 0.3, text: 'They found some dirt. Awkward.', effects: { brand: -8, prestige: -5 } },
        ]
      },
      {
        id: 'decline',
        text: 'Politely decline â stay under the radar.',
        effects: { brand: 2, morale: 3 },
        text: 'Kept focus. Missed the buzz.',
      },
    ]
  },
  {
    id: 'talent_poach',
    title: 'Talent Poaching',
    category: 'Talent',
    description: 'A competitor is aggressively recruiting your star team. Your HR lead wants to act.',
    choices: [
      {
        id: 'raise',
        text: 'Give the team a significant raise â retain at all costs.',
        effects: { cash: -30000, morale: 20, employees: 0 },
      },
      {
        id: 'ignore',
        text: 'Let the market decide. Talent stays if they want to.',
        outcomes: [
          { chance: 0.5, text: 'They stayed â loyalty runs deep.', effects: { morale: 5 } },
          { chance: 0.5, text: 'Three key people walked out.', effects: { employees: -3, morale: -15, revenue: -0.07 } },
        ]
      },
    ]
  },
  {
    id: 'investor_offer',
    title: 'VC Term Sheet',
    category: 'Finance',
    description: 'A venture firm offers $500K in exchange for 15% equity. Your runway is your leverage.',
    choices: [
      {
        id: 'accept',
        text: 'Take the deal â fuel growth.',
        effects: { cash: 500000, equity: -15, prestige: 10 },
      },
      {
        id: 'negotiate',
        text: 'Counter at 8% equity.',
        outcomes: [
          { chance: 0.45, text: 'They agreed! Less dilution.', effects: { cash: 500000, equity: -8, prestige: 8 } },
          { chance: 0.55, text: 'They walked. Back to bootstrapping.', effects: { brand: -3 } },
        ]
      },
      {
        id: 'reject',
        text: 'Decline â keep full ownership.',
        effects: { equity: 0, morale: 5, prestige: 3 },
      }
    ]
  },
  {
    id: 'lawsuit',
    title: 'Patent Lawsuit',
    category: 'Legal',
    description: 'A patent troll is claiming one of your core features infringes their IP. Your lawyer is waiting.',
    choices: [
      {
        id: 'settle',
        text: 'Settle quickly to avoid distraction.',
        effects: { cash: -80000, morale: -5 },
      },
      {
        id: 'fight',
        text: 'Fight it in court â it\'s bogus.',
        outcomes: [
          { chance: 0.6, text: 'Case dismissed! You won.', effects: { cash: -25000, prestige: 15, brand: 10 } },
          { chance: 0.4, text: 'Lost in court. Expensive lesson.', effects: { cash: -200000, prestige: -10 } },
        ]
      },
    ]
  },
  {
    id: 'competitor_stumbles',
    title: 'Competitor in Crisis',
    category: 'Competition',
    description: 'Your biggest competitor just had a public scandal. Their customers are up for grabs.',
    choices: [
      {
        id: 'market',
        text: 'Double ad spend and poach their customers.',
        effects: { cash: -40000, revenue: 0.12, brand: 8 },
      },
      {
        id: 'wait',
        text: 'Stay quiet â don\'t kick them while they\'re down.',
        effects: { prestige: 10, revenue: 0.04, brand: 5 },
      },
    ]
  },
  {
    id: 'recession',
    title: 'Economic Slowdown',
    category: 'Economy',
    description: 'Consumer spending is contracting. Economists are calling it a mild recession.',
    choices: [
      {
        id: 'cut',
        text: 'Cut costs aggressively â weather the storm lean.',
        effects: { cash: 20000, employees: -5, morale: -20, revenue: -0.10 },
      },
      {
        id: 'invest',
        text: 'Double down â expand while others retreat.',
        effects: { cash: -60000, revenue: 0.15, prestige: 8, brand: 5 },
      },
      {
        id: 'hold',
        text: 'Hold steady and ride it out.',
        effects: { revenue: -0.05, morale: -5 },
      },
    ]
  },
  {
    id: 'viral_moment',
    title: 'Went Viral',
    category: 'Media',
    description: 'A customer video featuring your product is going viral on social media.',
    choices: [
      {
        id: 'amplify',
        text: 'Boost it with paid ads â ride the wave.',
        effects: { cash: -15000, brand: 25, revenue: 0.15 },
      },
      {
        id: 'organic',
        text: 'Engage authentically â let it grow naturally.',
        effects: { brand: 15, morale: 8, revenue: 0.07 },
      },
    ]
  },
  {
    id: 'data_breach',
    title: 'Security Incident',
    category: 'Legal',
    description: 'Your IT team detected unauthorized access to customer data. Contained, but you need to decide on disclosure.',
    choices: [
      {
        id: 'disclose',
        text: 'Full public disclosure immediately â transparency first.',
        effects: { brand: -10, prestige: 5, morale: -5, cash: -30000 },
      },
      {
        id: 'quiet',
        text: 'Handle it quietly â fix the issue, say nothing.',
        outcomes: [
          { chance: 0.5, text: 'Nobody noticed. Crisis averted.', effects: { cash: -20000 } },
          { chance: 0.5, text: 'A journalist found out. Major scandal.', effects: { brand: -35, prestige: -20, cash: -100000 } },
        ]
      },
    ]
  },
  {
    id: 'key_hire',
    title: 'Dream Candidate',
    category: 'Talent',
    description: 'An ex-Google executive is open to joining your company â but they want top-of-market comp.',
    choices: [
      {
        id: 'hire',
        text: 'Make the offer. Elite talent is worth it.',
        effects: { cash: -90000, employees: 1, prestige: 15, revenue: 0.10, brand: 8 },
      },
      {
        id: 'pass',
        text: 'Pass â you\'ll develop talent internally.',
        effects: { morale: 5 },
      },
    ]
  },
  {
    id: 'supply_shock',
    title: 'Supply Chain Disruption',
    category: 'Economy',
    description: 'A global shortage is hitting your supply chain. Costs are spiking across the board.',
    choices: [
      {
        id: 'absorb',
        text: 'Absorb the costs â don\'t pass them to customers.',
        effects: { cash: -50000, brand: 10, morale: 3 },
      },
      {
        id: 'raise_prices',
        text: 'Raise prices 12% to protect margins.',
        effects: { revenue: 0.08, brand: -12, morale: -5 },
      },
      {
        id: 'diversify',
        text: 'Invest in finding alternate suppliers.',
        effects: { cash: -35000, revenue: -0.03, morale: 5, prestige: 5 },
      },
    ]
  },
  {
    id: 'board_pressure',
    title: 'Board Pressure',
    category: 'Finance',
    description: 'Your board is pushing for immediate profitability and wants to cut R&D by 40%.',
    minRevenue: 500000,
    choices: [
      {
        id: 'comply',
        text: 'Comply â cut R&D and focus on profit now.',
        effects: { cash: 60000, revenue: 0.05, morale: -15, prestige: -5 },
      },
      {
        id: 'pushback',
        text: 'Push back hard â protect long-term vision.',
        outcomes: [
          { chance: 0.6, text: 'Board backed down. Vision intact.', effects: { prestige: 10, morale: 10 } },
          { chance: 0.4, text: 'Board voted to replace you. You survived but lost equity.', effects: { equity: -10, morale: -20 } },
        ]
      },
    ]
  },
  {
    id: 'employee_protest',
    title: 'Employee Walkout',
    category: 'Talent',
    description: 'Staff are demanding better work-life balance and equity options. Tensions are boiling.',
    choices: [
      {
        id: 'meet',
        text: 'Meet all demands â equity pool + 4-day week.',
        effects: { equity: -5, cash: -20000, morale: 30, employees: 2 },
      },
      {
        id: 'partial',
        text: 'Offer partial concessions â compromise.',
        effects: { cash: -10000, morale: 12, equity: -2 },
      },
      {
        id: 'hard',
        text: 'Hold the line. Business comes first.',
        outcomes: [
          { chance: 0.4, text: 'Most stayed. Morale is tense but stable.', effects: { morale: -10 } },
          { chance: 0.6, text: 'Mass resignations. This will hurt for months.', effects: { employees: -8, morale: -30, revenue: -0.12 } },
        ]
      },
    ]
  },
  {
    id: 'acquisition_offer',
    title: 'Acquisition Offer',
    category: 'Finance',
    description: 'A Fortune 500 company just offered to acquire you at 3x your annual revenue.',
    minRevenue: 2000000,
    choices: [
      {
        id: 'sell',
        text: 'Take the offer. You\'ve earned it.',
        effects: { cash: 5000000, equity: -100, prestige: 30 },
      },
      {
        id: 'decline',
        text: 'Decline. You\'re building something bigger.',
        effects: { prestige: 20, brand: 10, morale: 15 },
      },
      {
        id: 'counter',
        text: 'Counter at 5x. Go bold.',
        outcomes: [
          { chance: 0.3, text: 'They agreed! Incredible exit.', effects: { cash: 8000000, equity: -100, prestige: 40 } },
          { chance: 0.7, text: 'They walked. But your prestige is sky-high.', effects: { prestige: 15, brand: 15 } },
        ]
      },
    ]
  },
  {
    id: 'government_contract',
    title: 'Government Contract',
    category: 'Finance',
    description: 'Your city is offering a lucrative government contract â reliable revenue but heavy compliance.',
    choices: [
      {
        id: 'bid',
        text: 'Bid aggressively â guaranteed revenue is golden.',
        effects: { cash: -25000, revenue: 0.20, prestige: 10 },
      },
      {
        id: 'skip',
        text: 'Skip it â compliance overhead isn\'t worth it.',
        effects: { morale: 5 },
      },
    ]
  },
  {
    id: 'product_launch',
    title: 'Product Launch Window',
    category: 'Competition',
    description: 'Your team is ready to ship a new product line â but your competitor is launching next month too.',
    choices: [
      {
        id: 'rush',
        text: 'Rush it out next week â beat them to market.',
        outcomes: [
          { chance: 0.55, text: 'First-mover advantage! Revenue surges.', effects: { revenue: 0.20, brand: 15, cash: -20000 } },
          { chance: 0.45, text: 'Bugs at launch. Press was brutal.', effects: { brand: -20, revenue: -0.05, cash: -20000 } },
        ]
      },
      {
        id: 'polish',
        text: 'Take 6 more weeks â ship it right.',
        effects: { revenue: 0.14, brand: 20, morale: 10, cash: -10000 },
      },
    ]
  },
  {
    id: 'influencer',
    title: 'Influencer Partnership',
    category: 'Media',
    description: 'A social media star with 10M followers wants to partner with your brand.',
    choices: [
      {
        id: 'sponsor',
        text: 'Sign the deal â big reach.',
        effects: { cash: -60000, brand: 30, revenue: 0.12 },
      },
      {
        id: 'gifting',
        text: 'Send product only, no paid deal.',
        outcomes: [
          { chance: 0.5, text: 'They loved it and posted organically. Free exposure!', effects: { brand: 15, revenue: 0.06 } },
          { chance: 0.5, text: 'Never posted. Nothing happened.', effects: {} },
        ]
      },
    ]
  },
]

// âââ MILESTONES âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const MILESTONES = [
  { id: 'rev_100k',   label: 'First $100K Revenue',   description: 'Earn $100K in total revenue',   target: { totalRevenue: 100000 } },
  { id: 'rev_500k',   label: 'Half a Million',         description: 'Earn $500K in total revenue',   target: { totalRevenue: 500000 } },
  { id: 'rev_1m',     label: 'First Million',          description: 'Earn $1M in total revenue',     target: { totalRevenue: 1000000 } },
  { id: 'rev_5m',     label: 'Five Million',           description: 'Earn $5M in total revenue',     target: { totalRevenue: 5000000 } },
  { id: 'rev_10m',    label: 'Ten Million',            description: 'Earn $10M in total revenue',    target: { totalRevenue: 10000000 } },
  { id: 'rev_50m',    label: 'Fifty Million',          description: 'Earn $50M in total revenue',    target: { totalRevenue: 50000000 } },
  { id: 'city_2',     label: 'Multi-City',             description: 'Expand to a second city',       target: { citiesOwned: 2 } },
  { id: 'city_4',     label: 'National Presence',      description: 'Operate in 4 cities',           target: { citiesOwned: 4 } },
  { id: 'props_10',   label: 'Property Baron',         description: 'Own 10 buildings',              target: { totalProperties: 10 } },
  { id: 'execs_3',    label: 'C-Suite Assembled',      description: 'Hire 3 executives',             target: { execsHired: 3 } },
]

// âââ TILE TYPES (for reference) âââââââââââââââââââââââââââââââââââââââââââââââ
export const TILE_TYPES = {
  empty:     { label: 'Empty Lot',  purchasable: true },
  road:      { label: 'Road',       purchasable: false },
  park:      { label: 'Park',       purchasable: false },
  hq:        { label: 'HQ',         purchasable: false },
  store:     { label: 'Store',      purchasable: false },
  office:    { label: 'Office',     purchasable: false },
  housing:   { label: 'Housing',    purchasable: false },
  warehouse: { label: 'Warehouse',  purchasable: false },
  npc:       { label: 'NPC Bldg',   purchasable: false },
  locked:    { label: 'Locked',     purchasable: false },
}
