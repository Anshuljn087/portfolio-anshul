'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { ArchitectureCaseStudy, ArchitectureEdge, ArchitectureNode } from '@/types/architecture'

const layerStyles = {
  client: 'border-cyan-400/70 bg-cyan-400/10 shadow-[0_0_36px_rgba(34,211,238,0.12)]',
  api: 'border-violet-400/70 bg-violet-400/10 shadow-[0_0_36px_rgba(139,92,246,0.12)]',
  event: 'border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_36px_rgba(34,211,238,0.18)]',
  service: 'border-indigo-400/70 bg-indigo-400/10 shadow-[0_0_36px_rgba(99,102,241,0.12)]',
  database: 'border-slate-500/70 bg-slate-500/10 shadow-[0_0_36px_rgba(100,116,139,0.12)]',
  external: 'border-amber-400/70 bg-amber-400/10 shadow-[0_0_36px_rgba(245,158,11,0.12)]',
  monitoring: 'border-emerald-400/70 bg-emerald-400/10 shadow-[0_0_36px_rgba(16,185,129,0.12)]',
} as const

export function ArchitectureDiagram({ study }: { study: ArchitectureCaseStudy }) {
  const [selected, setSelected] = useState<ArchitectureNode | null>(study.nodes[0] ?? null)
  const [nodePositions, setNodePositions] = useState(() =>
    Object.fromEntries(study.nodes.map((node) => [node.id, { x: node.x, y: node.y }]))
  )
  const [zoom, setZoom] = useState(0.45)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const nodeDragStart = useRef<{ x: number; y: number; nodeX: number; nodeY: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const getNodePosition = (node: ArchitectureNode) => nodePositions[node.id] ?? { x: node.x, y: node.y }
  const nodesById = useMemo(
    () =>
      Object.fromEntries(
        study.nodes.map((node) => [node.id, { ...node, ...getNodePosition(node) }])
      ),
    [study.nodes, nodePositions]
  )

  function resetView() {
    setZoom(0.45)
    setPan({ x: 0, y: 0 })
  }

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (draggingNodeId && nodeDragStart.current) {
        const nextX = (event.clientX - nodeDragStart.current.x) / zoom + nodeDragStart.current.nodeX
        const nextY = (event.clientY - nodeDragStart.current.y) / zoom + nodeDragStart.current.nodeY

        setNodePositions((current) => ({
          ...current,
          [draggingNodeId]: {
            x: Math.max(20, Number(nextX.toFixed(1))),
            y: Math.max(20, Number(nextY.toFixed(1))),
          },
        }))
        return
      }

      if (!dragging || !dragStart.current) return
      setPan({
        x: event.clientX - dragStart.current.x,
        y: event.clientY - dragStart.current.y,
      })
    }

    const handlePointerUp = () => {
      setDragging(false)
      setDraggingNodeId(null)
      dragStart.current = null
      nodeDragStart.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragging, draggingNodeId, zoom])

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1020]/70 p-3 shadow-[0_24px_80px_-48px_rgba(34,211,238,0.35)] backdrop-blur-2xl sm:p-4">
        <div className="relative rounded-[1.5rem] border border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(11,16,32,0.96))]">
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#111827]/90 p-2 shadow-lg backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(0.45, Number((value - 0.1).toFixed(2))))}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-200 transition-colors hover:bg-white/[0.08]"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-14 text-center text-xs font-medium text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(1.1, Number((value + 0.1).toFixed(2))))}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-200 transition-colors hover:bg-white/[0.08]"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetView}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200 transition-colors hover:bg-cyan-300/15"
              aria-label="Reset view"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={canvasRef}
            className="relative hidden h-[760px] w-full cursor-grab active:cursor-grabbing md:block"
            onPointerDown={(event) => {
              ;(event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId)
              dragStart.current = { x: event.clientX - pan.x, y: event.clientY - pan.y }
              setDragging(true)
            }}
            onPointerMove={(event) => {
              if (!dragging || !dragStart.current) return
              setPan({
                x: event.clientX - dragStart.current.x,
                y: event.clientY - dragStart.current.y,
              })
            }}
            onPointerUp={() => {
              setDragging(false)
              dragStart.current = null
            }}
            onWheel={(event) => {
              event.preventDefault()
              setZoom((value) => {
                const next = event.deltaY > 0 ? value - 0.05 : value + 0.05
                return Math.min(1.1, Math.max(0.35, Number(next.toFixed(2))))
              })
            }}
          >
            <div
              className="absolute left-0 top-0 h-[1320px] w-[2200px] origin-top-left"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'top left',
              }}
            >
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 2200 1320" fill="none">
                <defs>
                  <linearGradient id="glow" x1="0" x2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
                  </linearGradient>
                  <filter id="edgeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {study.edges.map((edge) => renderEdge(edge, nodesById))}
              </svg>

              {study.nodes.map((node, index) => (
                <motion.button
                  key={node.id}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.04, duration: 0.45 }}
                  onClick={() => setSelected(node)}
                  onMouseEnter={() => setSelected(node)}
                  onPointerDown={(event) => {
                    event.stopPropagation()
                    ;(event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId)
                    setDraggingNodeId(node.id)
                    nodeDragStart.current = {
                      x: event.clientX,
                      y: event.clientY,
                      nodeX: getNodePosition(node).x,
                      nodeY: getNodePosition(node).y,
                    }
                    setSelected(node)
                  }}
                  className={[
                    'absolute w-[240px] select-none rounded-[1.35rem] border px-4 py-4 text-left backdrop-blur-xl transition-all duration-300',
                    layerStyles[node.layer],
                    selected?.id === node.id ? 'ring-2 ring-cyan-300/70 scale-[1.02]' : 'hover:-translate-y-1',
                  ].join(' ')}
                  style={{ left: getNodePosition(node).x, top: getNodePosition(node).y }}
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-300">{node.subtitle}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-50">{node.label}</h3>
                  <div className="mt-3 flex flex-col gap-1 text-sm leading-6 text-slate-300">
                    {node.details.slice(0, 2).map((detail) => (
                      <span key={detail}>{detail}</span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-4 md:hidden">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Mobile flow</p>
            <div className="space-y-3">
              {study.nodes.map((node, index) => (
                <div key={node.id} className="relative rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
                  {index < study.nodes.length - 1 ? (
                    <span className="absolute left-5 top-full h-3 w-px bg-white/15" aria-hidden="true" />
                  ) : null}
                  <div className="flex items-start gap-3">
                    <div className={['rounded-2xl border px-3 py-2 text-[0.62rem] uppercase tracking-[0.24em]', layerStyles[node.layer]].join(' ')}>
                      {node.subtitle}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-slate-50">{node.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{node.details.slice(0, 2).join(' • ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs leading-6 text-slate-400">
              Swipe through the desktop canvas on larger screens. The mobile view shows the same system as a compact flow to keep it readable.
            </p>
          </div>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Selected Node</p>
        {selected ? (
          <>
            <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">{selected.label}</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.24em] text-slate-400">{selected.subtitle}</p>
            <div className="mt-6 space-y-3">
              {selected.details.map((detail) => (
                <p key={detail} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-slate-300">
                  {detail}
                </p>
              ))}
            </div>
          </>
        ) : (
        <p className="mt-4 text-sm text-slate-400">Hover or click a node to inspect system behavior.</p>
        )}
      </aside>
    </div>
  )
}

function renderEdge(edge: ArchitectureEdge, nodesById: Record<string, ArchitectureNode>) {
  const source = nodesById[edge.source]
  const target = nodesById[edge.target]
  if (!source || !target) return null

  const nodeWidth = 240
  const nodeHeight = 132

  const sourceAnchor = getAnchorPoint(source, target, nodeWidth, nodeHeight, true)
  const targetAnchor = getAnchorPoint(source, target, nodeWidth, nodeHeight, false)
  const sx = sourceAnchor.x
  const sy = sourceAnchor.y
  const tx = targetAnchor.x
  const ty = targetAnchor.y
  const mx = (sx + tx) / 2

  const stroke =
    edge.style === 'success'
      ? '#10B981'
      : edge.style === 'retry'
      ? '#F59E0B'
      : edge.style === 'observability'
        ? '#64748B'
        : edge.style === 'bidirectional'
          ? '#8B5CF6'
          : '#22D3EE'

  const dash = edge.style === 'retry' ? '10 8' : edge.style === 'observability' ? '3 8' : undefined
  const path = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`
  const labelY = (sy + ty) / 2
  const labelWidth = Math.max(132, edge.label.length * 8)

  return (
    <g key={edge.id} filter="url(#edgeGlow)">
      <path
        d={path}
        stroke={stroke}
        strokeWidth="2.8"
        strokeDasharray={dash}
        fill="none"
        opacity={edge.style === 'observability' ? 0.45 : 0.95}
      />
      <path
        d={path}
        stroke={stroke}
        strokeWidth="16"
        opacity="0.08"
        fill="none"
      />
      <circle cx={tx} cy={ty} r="4" fill={stroke}>
        <animate attributeName="r" values="3;5;3" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <rect
        x={mx - labelWidth / 2}
        y={labelY - 13}
        rx="999"
        ry="999"
        width={labelWidth}
        height="24"
        fill="rgba(17,24,39,0.92)"
        stroke={stroke}
        strokeOpacity="0.75"
      />
      <text
        x={mx}
        y={labelY + 4}
        textAnchor="middle"
        fill="#E2E8F0"
        fontSize="12"
        fontWeight="500"
      >
        {edge.label}
      </text>
    </g>
  )
}

function getAnchorPoint(
  source: ArchitectureNode,
  target: ArchitectureNode,
  nodeWidth: number,
  nodeHeight: number,
  sourceSide: boolean
) {
  const sourceCenter = {
    x: source.x + nodeWidth / 2,
    y: source.y + nodeHeight / 2,
  }
  const targetCenter = {
    x: target.x + nodeWidth / 2,
    y: target.y + nodeHeight / 2,
  }

  const dx = targetCenter.x - sourceCenter.x
  const dy = targetCenter.y - sourceCenter.y

  if (Math.abs(dx) > Math.abs(dy)) {
    return sourceSide
      ? {
          x: dx >= 0 ? source.x + nodeWidth : source.x,
          y: sourceCenter.y,
        }
      : {
          x: dx >= 0 ? target.x : target.x + nodeWidth,
          y: targetCenter.y,
        }
  }

  return sourceSide
    ? {
        x: sourceCenter.x,
        y: dy >= 0 ? source.y + nodeHeight : source.y,
      }
    : {
        x: targetCenter.x,
        y: dy >= 0 ? target.y : target.y + nodeHeight,
      }
}
