/**
 * Tipos que espelham os JSONs do back-end.
 *
 * Fontes do contrato (quando o back-end Go está disponível):
 * - `GET /search/v1/graph` -> `{ metadata, data: { nodes, edges } }`
 * - `GET /registry/v1/organization` -> `Organization[]`
 * - `GET /registry/v1/organization/{id}/organizational-unit` -> `OrganizationalUnit[]`
 *
 * Listas nunca são `null` no contrato; a normalização em `src/lib/api.ts`
 * e nos hooks garante `[]` mesmo quando o servidor retorna `null`.
 */

export type GraphNodeType =
  | 'professor'
  | 'organizational_unit'
  | 'organization'
  | 'knowledge_area'
  | 'tcc_theme'

export type GraphEdgeLabel =
  | 'facultyMemberIn'
  | 'organizationalUnitOf'
  | 'hasKnowledgeArea'
  | 'broader'
  | 'subject'

export interface GraphNode {
  id: string
  type: GraphNodeType
  label: string
}

export interface GraphEdge {
  /** `source-target`, deduplicada pelo back-end. */
  id: string
  source: string
  target: string
  label: GraphEdgeLabel | string
}

export interface PageMetadata {
  total: number
  page: number
  page_size: number
}

export interface SearchGraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface SearchGraphResponse {
  metadata: PageMetadata
  data: SearchGraphData
}

export type OrganizationKind =
  | 'university'
  | 'research_center'
  | 'institute'
  | 'college'
  | 'other'

export interface Organization {
  id: string
  kind: OrganizationKind | string
  name: string
  acronym: string
  description: string
  created_at: string
  updated_at: string
}

export interface OrganizationalUnit {
  id: string
  organization_id: string
  parent_id: string | null
  type_id: string
  name: string
  acronym: string
  description: string
  created_at: string
  updated_at: string
}

/** Área de conhecimento do `GET /registry/v1/knowledge-area`. */
export interface KnowledgeArea {
  id: string
  normalized: string
  name: string
  parent_id: string | null
  level: number
  path: string
  created_at: string
  /** Omitido quando `null` no back-end. */
  updated_at?: string | null
}

export interface KnowledgeAreaListMeta {
  page: number
  page_size: number
  total: number
}

export interface KnowledgeAreaList {
  meta: KnowledgeAreaListMeta
  /** Sempre array, `[]` quando vazio. */
  data: KnowledgeArea[]
}

/** Filtros aplicados ao `GET /search/v1/graph`. */
export interface SearchGraphFilters {
  knowledgeAreaIds: string[]
  organizationIds: string[]
  organizationalUnitIds: string[]
  /** `null` = sem filtro (todos). */
  available: boolean | null
}
