import { useState } from 'react'
import IsoCityMap from '../components/IsoCityMap'
import PropertyModal from '../components/PropertyModal'
import { PROPERTY_TYPES, fmt } from '../game/constants'

export default function CityScreen({ state, dispatch, onBack }) {
  const [selectedTile, setSelectedTile] = useState(null)
  const [selectedProp, setSelectedProp] = useState(null)

  const city = state.cities[state.activeCityId]
  if (!city) return null

  function handleSelectTile(tile, property) {
    if (tile.type === 'hq') return // HQ can't be modified
    setSelectedTile(tile)
    setSelectedProp(property || null)
  }

  function handleBuy(cityId, lotIdx, propertyType) {
    dispatch({ type: 'BUY_PROPERTY', cityId, lotIdx, propertyType })
    setSelectedTile(null)
    setSelectedProp(null)
  }

  function handleUpgrade(cityId, propertyId) {
    dispatch({ type: 'UPGRADE_PROPERTY', cityId, propertyId })
    setSelectedTile(null)
    setSelectedProp(null)
  }

  // City property summary
  const props = city.properties || []
  const storeCount = props.filter(p => p.type === 'store').length
  const officeCount = props.filter(p => p.type === 'office').length
  const housingCount = props.filter(p => p.type === 'housing').length
  const warehouseCount = props.filter(p => p.type === 'warehouse').length

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Header */}
      <div className="bg-navy-900/80 border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
          â Back
        </button>
        <div className="text-center">
          <div className="font-bold text-white">{city.name}</div>
          <div className="text-xs text-gray-400">{city.country}</div>
        </div>
        <div className="text-right">
          <div className="text-amber-400 font-bold text-sm">{fmt(state.cash)}</div>
          <div className="text-xs text-gray-500">cash</div>
        </div>
      </div>

      {/* Property summary strip */}
      <div className="px-4 py-2 flex gap-3 overflow-x-auto border-b border-white/5">
        {[
          { label: 'Stores', count: storeCount, color: 'text-blue-400' },
          { label: 'Offices', count: officeCount, color: 'text-purple-400' },
          { label: 'Housing', count: housingCount, color: 'text-pink-400' },
          { label: 'Warehouses', count: warehouseCount, color: 'text-red-400' },
        ].map(item => (
          <div key={item.label} className="flex-shrink-0 bg-white/5 rounded-lg px-3 py-1.5 text-center">
            <div className={`font-bold text-sm ${item.color}`}>{item.count}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
        <div className="flex-shrink-0 bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-1.5 text-center ml-auto">
          <div className="text-amber-400 font-bold text-sm">{props.length}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* City map */}
      <div className="flex-1 overflow-auto p-4">
        <IsoCityMap
          city={{ ...city, grid_size: city.grid || Math.round(Math.sqrt(city.grid?.length || 49)) }}
          onSelectTile={handleSelectTile}
          selectedTile={selectedTile?.idx}
        />
      </div>

      {/* Tip */}
      {!selectedTile && (
        <div className="px-4 pb-4 text-center text-xs text-gray-600">
          Tap an empty lot (+) to build â¢ Tap buildings to upgrade
        </div>
      )}

      {/* Property modal */}
      {selectedTile && (
        <PropertyModal
          tile={selectedTile}
          property={selectedProp}
          cityId={state.activeCityId}
          cash={state.cash}
          onBuy={handleBuy}
          onUpgrade={handleUpgrade}
          onClose={() => { setSelectedTile(null); setSelectedProp(null) }}
        />
      )}
    </div>
  )
}
