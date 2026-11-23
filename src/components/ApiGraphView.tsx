import { Suspense, lazy, useCallback, useMemo, useRef, useState } from 'react'
import type { GraphCanvasRef } from 'reagraph'
import type { GraphEdge, GraphNode } from '../lib/types'
import {
  API_NODE_COLORS,
  API_NODE_LABELS_PT,
  edgeLabelInfo,
  toApiReagraphEdges,
  toApiReagraphNodes,
} from '../lib/apiGraph'

const ReagraphCanvas = lazy(() => import('../pages/GrafoConhecimento/ReagraphCanvas'))

export default function ApiGraphView({
  nodes,
  edges,
}: {
  nodes: GraphNode[]
  edges: GraphEdge[]
}) {
  const graphRef = useRef<GraphCanvasRef>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const safeNodes = useMemo(() => (Array.isArray(nodes) ? nodes : []), [nodes])
  const safeEdges = useMemo(() => (Array.isArray(edges) ? edges : []), [edges])

  const reagraphNodes = useMemo(() => toApiReagraphNodes(safeNodes), [safeNodes])
  const reagraphEdges = useMemo(() => toApiReagraphEdges(safeNodes, safeEdges), [safeNodes, safeEdges])
  const graphKey = useMemo(
    () => [...reagraphNodes.map((n) => n.id), ...reagraphEdges.map((e) => e.id)].join('|'),
    [reagraphNodes, reagraphEdges],
  )

  const selected = useMemo(
    () => safeNodes.find((node) => node.id === selectedId) ?? null,
    [safeNodes, selectedId],
  )

  const edgeLabelsInUse = useMemo(() => {
    const labels = new Set(safeEdges.map((edge) => edge.label).filter(Boolean))
    return [...labels].sort()
  }, [safeEdges])

  // Identidade estável: `layoutOverrides` inline recriaria o objeto a cada
  // render e o `useGraph` do Reagraph refaria o layout, desfazendo o arraste.
  const layoutOverrides = useMemo(() => ({ radius: 80, concentricSpacing: 150 }), [])

  const handleGraphReady = useCallback((graph: GraphCanvasRef | null) => {
    graphRef.current = graph
  }, [])

  if (safeNodes.length === 0) return null

  return (
    <div className="api-graph-view">
      <ul className="api-graph-legend" aria-label="Tipos de nó do grafo da API">
        {(Object.keys(API_NODE_COLORS) as Array<keyof typeof API_NODE_COLORS>).map((type) => (
          <li key={type}>
            <span
              className="api-graph-legend__swatch"
              style={{ backgroundColor: API_NODE_COLORS[type] }}
              aria-hidden="true"
            />
            {API_NODE_LABELS_PT[type]}
          </li>
        ))}
      </ul>

      {edgeLabelsInUse.length > 0 && (
        <ul className="api-graph-legend api-graph-legend--edges" aria-label="Rótulos das arestas em português">
          {edgeLabelsInUse.map((label) => {
            const info = edgeLabelInfo(label)
            return (
              <li key={label}>
                <strong>{info.name}</strong>
                {` — ${info.purpose} `}
                <code>({label})</code>
              </li>
            )
          })}
        </ul>
      )}

      <div className="graph-zoom-controls" aria-label="Controles de zoom do grafo da API">
        <button type="button" onClick={() => graphRef.current?.zoomIn()}>
          Aumentar zoom
        </button>
        <button type="button" onClick={() => graphRef.current?.zoomOut()}>
          Diminuir zoom
        </button>
        <button
          type="button"
          onClick={() => graphRef.current?.fitNodesInView(undefined, { animated: false })}
        >
          Ajustar à tela
        </button>
      </div>

      <div
        className="graph-canvas"
        role="group"
        aria-label={`Grafo da API com ${safeNodes.length} nós e ${safeEdges.length} arestas`}
      >
        <p className="visually-hidden" role="status">
          Layout concêntrico 2D: organização ao centro, seguida por unidades
          organizacionais, docentes, áreas de conhecimento e temas de TCC nos raios externos.
        </p>
        <Suspense
          fallback={
            <p className="graph-loading" role="status">
              Carregando visualização interativa...
            </p>
          }
        >
          <ReagraphCanvas
            key={graphKey}
            nodes={reagraphNodes}
            edges={reagraphEdges}
            selections={selectedId ? [selectedId] : []}
            onNodeClick={(node) => setSelectedId(node.id)}
            layoutType="concentric2d"
            layoutOverrides={layoutOverrides}
            labelType="all"
            edgeLabelPosition="inline"
            minDistance={200}
            animated={false}
            draggable
            edgeInterpolation="linear"
            edgeArrowPosition="end"
            initialTargetX={0}
            onGraphReady={handleGraphReady}
          />
        </Suspense>
      </div>

      <div className="api-graph-selection" aria-live="polite">
        {selected ? (
          <p title={`${selected.label} (${selected.id})`}>
            <strong>{selected.label}</strong> <code>{selected.id}</code>{' '}
            <span className="api-graph-selection__type">
              {API_NODE_LABELS_PT[selected.type] ?? selected.type}
            </span>{' '}
            <button type="button" onClick={() => setSelectedId(null)}>
              Limpar seleção
            </button>
          </p>
        ) : (
          <p className="api-graph-selection__hint">
            Clique em um nó para ver rótulo (`label`) e identificador (`id`) — tooltip textual.
          </p>
        )}
      </div>
    </div>
  )
}
