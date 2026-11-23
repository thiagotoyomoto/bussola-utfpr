import type { GraphEdge, GraphNode, GraphNodeType } from './types'

/**
 * Reagraph já é compatível com React 19 neste repositório
 * (`reagraph@4.32` com `peerDependencies.react >= 16`, em uso na página
 * `/grafo`), então não há necessidade de fallback para
 * `react-force-graph-2d`. Não criamos layout proprietário: usamos
 * `concentric2d` do Reagraph (Concentric 2D).
 */

export const API_NODE_COLORS: Record<GraphNodeType, string> = {
  organization: '#321e4b',
  organizational_unit: '#755493',
  professor: '#b7791f',
  knowledge_area: '#d8c3f4',
  tcc_theme: '#2e7d6f',
}

export const API_NODE_LABELS_PT: Record<GraphNodeType, string> = {
  organization: 'Organização',
  organizational_unit: 'Unidade organizacional',
  professor: 'Docente',
  knowledge_area: 'Área de conhecimento',
  tcc_theme: 'Tema de TCC',
}

export interface EdgeLabelInfo {
  /** Nome curto em PT-BR exibido na legenda. */
  name: string
  /** Texto direto que explica o objetivo da relação no grafo. */
  purpose: string
}

/**
 * Dicionário dos rótulos de aresta da API (`GET /search/v1/graph`),
 * traduzidos para o português do Brasil. Cobre os 5 rótulos emitidos
 * pelo back-end (ver `handler.go`/`result.go` em `services/api`):
 * `facultyMemberIn`, `organizationalUnitOf`, `hasKnowledgeArea`,
 * `broader` e `subject`.
 */
export const EDGE_LABELS_PT: Record<string, EdgeLabelInfo> = {
  facultyMemberIn: {
    name: 'Lotação',
    purpose: 'Mostra a unidade organizacional onde o docente está lotado.',
  },
  organizationalUnitOf: {
    name: 'Subordinação',
    purpose: 'Mostra a organização (ou unidade superior) à qual a unidade pertence.',
  },
  hasKnowledgeArea: {
    name: 'Área de atuação',
    purpose: 'Mostra as áreas de conhecimento em que o docente atua.',
  },
  broader: {
    name: 'Área mais ampla',
    purpose: 'Liga uma área específica à área mais ampla que a contém na hierarquia.',
  },
  subject: {
    name: 'Tema orientado',
    purpose: 'Mostra os temas de TCC que o docente orienta.',
  },
}

/** Devolve o verbete em PT-BR, com fallback para rótulos desconhecidos. */
export function edgeLabelInfo(label: string): EdgeLabelInfo {
  return (
    EDGE_LABELS_PT[label] ?? {
      name: label,
      purpose: 'Relação retornada pela API sem tradução cadastrada.',
    }
  )
}

export interface ApiReagraphNode {
  id: string
  label: string
  fill: string
  size: number
  labelVisible: boolean
  data: { kind: GraphNodeType | string; fullLabel: string; nodeId: string; level: number }
}

export interface ApiReagraphEdge {
  id: string
  source: string
  target: string
  label: string
}

export function toApiReagraphNodes(nodes: GraphNode[]): ApiReagraphNode[] {
  return (nodes ?? []).map((node) => ({
    id: node.id,
    label: node.label || node.id,
    fill: (API_NODE_COLORS[node.type] ?? '#6b7280') as string,
    size: node.type === 'professor' ? 18 : node.type === 'organization' ? 22 : 14,
    labelVisible: true,
    data: {
      kind: node.type,
      fullLabel: node.label || node.id,
      nodeId: node.id,
      level: levelForKind(node.type),
    },
  }))
}

/**
 * Anel do `concentric2d` por tipo de nó (lido via `data.level`):
 * organização no centro (0), unidades no 1º raio, docentes no 2º,
 * áreas de conhecimento no 3º e temas de TCC (ou tipos futuros) no 4º.
 */
export function levelForKind(kind: string): number {
  switch (kind) {
    case 'organization':
      return 0
    case 'organizational_unit':
      return 1
    case 'professor':
      return 2
    case 'knowledge_area':
      return 3
    default:
      return 4
  }
}

export function toApiReagraphEdges(nodes: GraphNode[], edges: GraphEdge[]): ApiReagraphEdge[] {
  const known = new Set((nodes ?? []).map((node) => node.id))
  const seen = new Set<string>()
  const out: ApiReagraphEdge[] = []
  for (const edge of edges ?? []) {
    if (!edge || typeof edge.source !== 'string' || typeof edge.target !== 'string') continue
    if (!known.has(edge.source) || !known.has(edge.target)) continue
    const id = edge.id || `${edge.source}-${edge.target}`
    if (seen.has(id)) continue
    seen.add(id)
    out.push({ id, source: edge.source, target: edge.target, label: edgeLabelInfo(edge.label || '').name })
  }
  return out
}
