import { DEPARTMENTS, MILESTONES, CITIES, PROPERTY_TYPES, fmt } from './constants'

// âââ INITIAL STATE ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function createInitialState({ companyName, industryId, startId, industry, start }) {
  const startingCity = CITIES[0]
  const grid = generateCityGrid(startingCity)

  return {
    companyName,
    industryId,
    industryColor: industry.color,

    // Time
    month: 1,
    year: 2024,
    tickMs: 3000,

    // Financials
    cash: start.capital,
    debt: 0,
    totalRevenue: 0,
    monthlyRevenue: industry.baseRev * (start.skill / 100),
    monthlyExpenses: industry.baseCost * (start.skill / 100),

    // Company metrics
    brand: 20 + Math.floor(start.connections / 3),
    morale: 75,
    prestige: 10,
    equity: 100,
    employees: 3,
    execsHired: 0,
    totalProperties: 1,

    // Departments: level 1 by default, no exec
    departments: Object.fromEntries(
      DEPARTMENTS.map(d => [d.id, { level: 1, hasExec: false, autoManaged: false }])
    ),

    // Cities unlocked
    cities: {
      [startingCity.id]: {
        ...startingCity,
        unlocked: true,
        grid,
        properties: [
          { id: 'hq-0', type: 'hq', level: 1, lotIndex: getHQLotIndex(grid), cityId: startingCity.id }
        ],
      }
    },
    activeCityId: startingCity.id,

    // Milestones achieved
    milestonesAchieved: [],

    // Activity log
    log: [{ text: `${companyName} founded. Let's build something.`, t: Date.now() }],

    // Paused / event state (managed externally)
    paused: false,
  }
}

// âââ CITY GRID GENERATION âââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function generateCityGrid(city) {
  const size = city.grid
  const tiles = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col
      // Roads on edges and cross-streets
      const isRoad = row === 0 || col === 0 || row === size - 1 || col === size - 1
        || (row === Math.floor(size / 2) && col > 0 && col < size - 1)
        || (col === Math.floor(size / 2) && row > 0 && row < size - 1)
      // Small parks at corners
      const isPark = (row === 1 && col === 1) || (row === 1 && col === size - 2)
      // NPC buildings scattered
      const isNPC = !isRoad && !isPark && Math.random() < 0.25

      tiles.push({
        idx,
        row,
        col,
        type: isRoad ? 'road' : isPark ? 'park' : isNPC ? 'npc' : 'empty',
        propertyId: null,
      })
    }
  }
  // Place HQ at center-ish empty tile
  const center = Math.floor(size / 2)
  const hqTile = tiles.find(t => t.row === Math.floor(size / 3) && t.col === Math.floor(size / 3) && t.type === 'empty')
    || tiles.find(t => t.type === 'empty')
  if (hqTile) hqTile.type = 'hq'
  return tiles
}

function getHQLotIndex(grid) {
  const t = grid.find(t => t.type === 'hq')
  return t ? t.idx : 0
}

// âââ REDUCER ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function gameReducer(state, action) {
  switch (action.type) {

    case 'TICK': {
      const execCount = Object.values(state.departments).filter(d => d.hasExec).length
      const deptBonus = Object.values(state.departments).reduce((s, d) => s + (d.level - 1) * 0.025, 0)
      const execBonus = execCount * 0.06
      const cityCount = Object.values(state.cities).filter(c => c.unlocked).length
      const cityBonus = (cityCount - 1) * 0.10

      // Count all properties across all cities
      const allProps = Object.values(state.cities).flatMap(c => c.properties || [])
      const storeRevenue = allProps.filter(p => p.type === 'store')
        .reduce((s, p) => s + (PROPERTY_TYPES.store.levels[p.level - 1]?.revenue || 0), 0)
      const warehouseSaving = allProps.filter(p => p.type === 'warehouse')
        .reduce((s, p) => s + (PROPERTY_TYPES.warehouse.levels[p.level - 1]?.costReduction || 0), 0)

      const grossRev = (state.monthlyRevenue + storeRevenue) * (1 + deptBonus + execBonus + cityBonus)
      const grossExp = state.monthlyExpenses * (1 + execCount * 0.07) * (1 - warehouseSaving)
      const profit = grossRev - grossExp

      const newCash = state.cash + profit
      const newTotalRev = state.totalRevenue + grossRev

      // Advance time
      const newMonth = state.month === 12 ? 1 : state.month + 1
      const newYear = state.month === 12 ? state.year + 1 : state.year

      // Check milestones
      const newMilestones = [...state.milestonesAchieved]
      const citiesOwned = Object.values(state.cities).filter(c => c.unlocked).length
      const totalProperties = Object.values(state.cities).flatMap(c => c.properties || []).length
      const execsHired = Object.values(state.departments).filter(d => d.hasExec).length

      MILESTONES.forEach(m => {
        if (newMilestones.includes(m.id)) return
        const t = m.target
        const hit = (t.totalRevenue && newTotalRev >= t.totalRevenue)
          || (t.citiesOwned && citiesOwned >= t.citiesOwned)
          || (t.totalProperties && totalProperties >= t.totalProperties)
          || (t.execsHired && execsHired >= t.execsHired)
        if (hit) newMilestones.push(m.id)
      })

      const newLog = newMilestones.length > state.milestonesAchieved.length
        ? [{ text: `ð Milestone: ${MILESTONES.find(m => !state.milestonesAchieved.includes(m.id) && newMilestones.includes(m.id))?.label}!`, t: Date.now() }, ...state.log]
        : state.log

      return {
        ...state,
        cash: newCash,
        totalRevenue: newTotalRev,
        month: newMonth,
        year: newYear,
        milestonesAchieved: newMilestones,
        log: newLog.slice(0, 30),
        employees: state.employees,
        execsHired: execsHired,
        totalProperties: totalProperties,
      }
    }

    case 'BUY_PROPERTY': {
      const { cityId, lotIdx, propertyType } = action
      const propDef = PROPERTY_TYPES[propertyType]
      if (!propDef || state.cash < propDef.baseCost) return state

      const city = state.cities[cityId]
      const newGrid = city.grid.map(t =>
        t.idx === lotIdx ? { ...t, type: propertyType } : t
      )
      const newProp = {
        id: `${propertyType}-${Date.now()}`,
        type: propertyType,
        level: 1,
        lotIndex: lotIdx,
        cityId,
      }
      return {
        ...state,
        cash: state.cash - propDef.baseCost,
        cities: {
          ...state.cities,
          [cityId]: { ...city, grid: newGrid, properties: [...(city.properties || []), newProp] },
        },
        log: [{ text: `ðï¸ Built ${propDef.name} in ${city.name}`, t: Date.now() }, ...state.log].slice(0, 30),
        totalProperties: state.totalProperties + 1,
      }
    }

    case 'UPGRADE_PROPERTY': {
      const { cityId, propertyId } = action
      const city = state.cities[cityId]
      const prop = city.properties.find(p => p.id === propertyId)
      if (!prop) return state
      const propDef = PROPERTY_TYPES[prop.type]
      const nextLevel = propDef.levels[prop.level]
      if (!nextLevel || state.cash < nextLevel.cost) return state

      return {
        ...state,
        cash: state.cash - nextLevel.cost,
        cities: {
          ...state.cities,
          [cityId]: {
            ...city,
            properties: city.properties.map(p =>
              p.id === propertyId ? { ...p, level: p.level + 1 } : p
            ),
          },
        },
        log: [{ text: `â¬ï¸ Upgraded ${propDef.name} to Level ${prop.level + 1}`, t: Date.now() }, ...state.log].slice(0, 30),
      }
    }

    case 'UPGRADE_DEPT': {
      const { deptId, cost } = action
      if (state.cash < cost) return state
      const dept = state.departments[deptId]
      if (dept.level >= 10) return state
      return {
        ...state,
        cash: state.cash - cost,
        departments: {
          ...state.departments,
          [deptId]: { ...dept, level: dept.level + 1 },
        },
      }
    }

    case 'HIRE_EXEC': {
      const { deptId, cost } = action
      if (state.cash < cost) return state
      const dept = DEPARTMENTS.find(d => d.id === deptId)
      return {
        ...state,
        cash: state.cash - cost,
        departments: {
          ...state.departments,
          [deptId]: { ...state.departments[deptId], hasExec: true, autoManaged: true },
        },
        employees: state.employees + 1,
        log: [{ text: `ð¤ ${dept.exec} hired â ${dept.name} on autopilot`, t: Date.now() }, ...state.log].slice(0, 30),
      }
    }

    case 'UNLOCK_CITY': {
      const { cityId, cost } = action
      if (state.cash < cost) return state
      const cityDef = CITIES.find(c => c.id === cityId)
      const grid = generateCityGrid(cityDef)
      return {
        ...state,
        cash: state.cash - cost,
        cities: {
          ...state.cities,
          [cityId]: { ...cityDef, unlocked: true, grid, properties: [] },
        },
        log: [{ text: `ð Expanded to ${cityDef.name}, ${cityDef.country}!`, t: Date.now() }, ...state.log].slice(0, 30),
      }
    }

    case 'APPLY_EVENT': {
      const { effects } = action
      let ns = { ...state }
      if (effects.cash)      ns.cash      = Math.max(0, ns.cash + effects.cash)
      if (effects.revenue)   ns.monthlyRevenue = ns.monthlyRevenue * (1 + effects.revenue)
      if (effects.brand)     ns.brand     = Math.min(100, Math.max(0, ns.brand + effects.brand))
      if (effects.morale)    ns.morale    = Math.min(100, Math.max(0, ns.morale + effects.morale))
      if (effects.prestige)  ns.prestige  = Math.max(0, ns.prestige + effects.prestige)
      if (effects.equity)    ns.equity    = Math.max(0, ns.equity + effects.equity)
      if (effects.debt)      ns.debt      = ns.debt + effects.debt
      if (effects.employees) ns.employees = Math.max(1, ns.employees + effects.employees)
      return ns
    }

    case 'SET_ACTIVE_CITY':
      return { ...state, activeCityId: action.cityId }

    case 'ADD_LOG':
      return { ...state, log: [{ text: action.text, t: Date.now() }, ...state.log].slice(0, 30) }

    default:
      return state
  }
}
