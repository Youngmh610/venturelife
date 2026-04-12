import { useState, useRef, useEffect } from 'react'
import { PROPERTY_TYPES, TILE_TYPES } from '../game/constants'

// âââ ISO PROJECTION âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const TW = 64   // tile width
const TH = 32   // tile height
const BORDER = 4

function toIso(row, col, gridSize) {
  const cx = (gridSize * TW) / 2
  const x = cx + (col - row) * (TW / 2)
  const y = (col + row) * (TH / 2) + TH
  return { x, y }
}

function isoWidth(gridSize) { return gridSize * TW + TW }
function isoHeight(gridSize) { return gridSize * TH + TH * 2 }

// âââ TILE COLORS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const TILE_STYLES = {
  empty:     { top: '#C8D6C0', left: '#A0B495', right: '#B8C8AE', stroke: '#8EA885' },
  road:      { top: '#6B7280', left: '#4B5563', right: '#374151', stroke: '#374151' },
  park:      { top: '#4ADE80', left: '#16A34A', right: '#22C55E', stroke: '#15803D' },
  hq:        { top: '#FCD34D', left: '#D97706', right: '#F59E0B', stroke: '#B45309' },
  store:     { top: '#60A5FA', left: '#2563EB', right: '#3B82F6', stroke: '#1D4ED8' },
  office:    { top: '#A78BFA', left: '#7C3AED', right: '#8B5CF6', stroke: '#6D28D9' },
  housing:   { top: '#F9A8D4', left: '#DB2777', right: '#EC4899', stroke: '#BE185D' },
  warehouse: { top: '#FCA5A5', left: '#DC2626', right: '#EF4444', stroke: '#B91C1C' },
  npc:       { top: '#CBD5E1', left: '#64748B', right: '#94A3B8', stroke: '#475569' },
  locked:    { top: '#1F2937', left: '#111827', right: '#1F2937', stroke: '#374151' },
}

const BUILDING_HEIGHT = {
  hq: 28, store: 20, office: 24, housing: 18, warehouse: 14, npc: 12,
}

// âââ SINGLE TILE ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function IsoTile({ tile, x, y, selected, onClick, property }) {
  const tw = TW
  const th = TH
  const bh = BUILDING_HEIGHT[tile.type] || 0
  const style = TILE_STYLES[tile.type] || TILE_STYLES.empty
  const canClick = tile.type !== 'road' && tile.type !== 'park' && tile.type !== 'npc'
  const isInteractive = canClick

  // Diamond points (top face)
  const topPoints = [
    `${x},${y - th / 2}`,
    `${x + tw / 2},${y}`,
    `${x},${y + th / 2}`,
    `${x - tw / 2},${y}`,
  ].join(' ')

  // Left face (if building)
  const leftPoints = bh > 0 ? [
    `${x - tw / 2},${y}`,
    `${x},${y + th / 2}`,
    `${x},${y + th / 2 + bh}`,
    `${x - tw / 2},${y + bh}`,
  ].join(' ') : null

  // Right face (if building)
  const rightPoints = bh > 0 ? [
    `${x},${y + th / 2}`,
    `${x + tw / 2},${y}`,
    `${x + tw / 2},${y + bh}`,
    `${x},${y + th / 2 + bh}`,
  ].join(' ') : null

  // Highlight for selected
  const glow = selected ? 'drop-shadow(0 0 6px #FBBF24)' : undefined

  return (
    <g
      style={{ cursor: isInteractive ? 'pointer' : 'default', filter: glow }}
      onClick={isInteractive ? onClick : undefined}
    >
      {/* Building faces (rendered before top so top is "on top") */}
      {leftPoints && (
        <polygon points={leftPoints} fill={selected ? '#FEF9C3' : style.left} stroke={style.stroke} strokeWidth="0.5" />
      )}
      {rightPoints && (
        <polygon points={rightPoints} fill={selected ? '#FDE68A' : style.right} stroke={style.stroke} strokeWidth="0.5" />
      )}
      {/* Top face */}
      <polygon
        points={topPoints}
        fill={selected ? '#FEF08A' : style.top}
        stroke={style.stroke}
        strokeWidth="0.5"
        style={{ opacity: tile.type === 'locked' ? 0.5 : 1 }}
      />
      {/* Level indicator dot */}
      {property && property.level > 1 && (
        <circle cx={x} cy={y - th / 2 - bh} r={5} fill="#FBBF24" stroke="#92400E" strokeWidth="1" />
      )}
      {/* + indicator on empty purchasable lots */}
      {tile.type === 'empty' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="14" fill="#4B7A3F" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>
          +
        </text>
      )}
    </g>
  )
}

// âââ LEGEND âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Legend() {
  const items = [
    { type: 'empty', label: 'Empty lot' },
    { type: 'hq', label: 'HQ' },
    { type: 'store', label: 'Store' },
    { type: 'office', label: 'Office' },
    { type: 'housing', label: 'Housing' },
    { type: 'warehouse', label: 'Warehouse' },
    { type: 'npc', label: 'NPC' },
    { type: 'park', label: 'Park' },
  ]
  return (
    <div className="flex flex-wrap gap-2 mt-2 justify-center">
      {items.map(i => (
        <div key={i.type} className="flex items-center gap-1 text-xs text-gray-400">
          <div className="w-3 h-3 rounded-sm" style={{ background: TILE_STYLES[i.type]?.top }} />
          {i.label}
        </div>
      ))}
    </div>
  )
}

// âââ MAIN COMPONENT âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function IsoCityMap({ city, onSelectTile, selectedTile }) {
  const { grid, properties = [] } = city
  const gridSize = city.grid_size || Math.round(Math.sqrt(grid.length))
  const svgW = isoWidth(gridSize)
  const svgH = isoHeight(gridSize)

  // Build property lookup
  const propByLot = {}
  properties.forEach(p => { propByLot[p.lotIndex] = p })

  // Sort tiles for painter's algorithm (back-to-front)
  const sorted = [...grid].sort((a, b) => (a.row + a.col) - (b.row + b.col))

  return (
    <div className="flex flex-col items-center">
      <div className="overflow-auto max-w-full">
        <svg
          width={svgW}
          height={svgH}
          style={{ display: 'block' }}
        >
          {sorted.map(tile => {
            const { x, y } = toIso(tile.row, tile.col, gridSize)
            const prop = propByLot[tile.idx]
            return (
              <IsoTile
                key={tile.idx}
                tile={tile}
                x={x}
                y={y}
                selected={selectedTile === tile.idx}
                property={prop}
                onClick={() => onSelectTile && onSelectTile(tile, prop)}
              />
            )
          })}
        </svg>
      </div>
      <Legend />
    </div>
  )
}
