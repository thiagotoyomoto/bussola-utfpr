import { useEffect, useRef, useState } from 'react'
import { ApiError, buildSearchGraphPath, fetchJson } from '../lib/api'
import type {
  PageMetadata,
  SearchGraphData,
  SearchGraphFilters,
  SearchGraphResponse,
} from '../lib/types'

interface UseSearchGraphArgs {
  /** Filtros já aplicados (confirmados via "Buscar"). */
  filters: SearchGraphFilters
  page: number
  pageSize: number
  /** Incrementado para forçar nova tentativa com os mesmos parâmetros. */
  reloadToken?: number
  /** Quando `false`, nenhuma requisição é feita e o resultado é vazio. */
  enabled?: boolean
}

interface UseSearchGraphResult {
  nodes: SearchGraphData['nodes']
  edges: SearchGraphData['edges']
  metadata: PageMetadata
  loading: boolean
  error: ApiError | null
  /** Caminho relativo da última requisição (exibe chaves repetidas). */
  requestPath: string
}

function stableFiltersKey(filters: SearchGraphFilters): string {
  return JSON.stringify([
    [...filters.knowledgeAreaIds].sort(),
    [...filters.organizationIds].sort(),
    [...filters.organizationalUnitIds].sort(),
    filters.available,
  ])
}

/**
 * Consulta `GET /search/v1/graph` (público) com cancelamento.
 * Listas `null` do back-end são normalizadas para `[]`.
 */
export function useSearchGraph({ filters, page, pageSize, reloadToken = 0, enabled = true }: UseSearchGraphArgs): UseSearchGraphResult {
  const filtersKey = stableFiltersKey(filters)
  const requestKey = `${filtersKey}|${page}|${pageSize}|${reloadToken}|${enabled ? 'on' : 'off'}`

  const [nodes, setNodes] = useState<SearchGraphData['nodes']>([])
  const [edges, setEdges] = useState<SearchGraphData['edges']>([])
  const [metadata, setMetadata] = useState<PageMetadata>({ total: 0, page, page_size: pageSize })
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<ApiError | null>(null)
  const [requestPath, setRequestPath] = useState(() =>
    enabled ? buildSearchGraphPath({ filters, page, pageSize }) : '',
  )
  const requestId = useRef(0)

  // Ajuste de estado na fase de render (padrão recomendado pelo React):
  // marca nova requisição pendente quando filtros/página/tamanho mudam,
  // sem `setState` síncrono dentro do efeito. Com `enabled === false`
  // o resultado é zerado sem nenhuma requisição.
  const [prevKey, setPrevKey] = useState(requestKey)
  if (prevKey !== requestKey) {
    setPrevKey(requestKey)
    setNodes([])
    setEdges([])
    setMetadata({ total: 0, page, page_size: pageSize })
    setLoading(enabled)
    setError(null)
    setRequestPath(enabled ? buildSearchGraphPath({ filters, page, pageSize }) : '')
  }

  useEffect(() => {
    const controller = new AbortController()
    if (!enabled) return () => controller.abort()

    const current = ++requestId.current
    const path = buildSearchGraphPath({ filters, page, pageSize })

    fetchJson<SearchGraphResponse>(path, { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted || current !== requestId.current) return
        setNodes(Array.isArray(response?.data?.nodes) ? response.data.nodes : [])
        setEdges(Array.isArray(response?.data?.edges) ? response.data.edges : [])
        setMetadata({
          total: Number(response?.metadata?.total ?? 0),
          page: Number(response?.metadata?.page ?? page),
          page_size: Number(response?.metadata?.page_size ?? pageSize),
        })
        setRequestPath(path)
        setError(null)
        setLoading(false)
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return
        if (current !== requestId.current) return
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
        setNodes([])
        setEdges([])
        setMetadata({ total: 0, page, page_size: pageSize })
        setRequestPath(path)
        setError(
          fetchError instanceof ApiError
            ? fetchError
            : new ApiError(null, 'Não foi possível carregar o grafo.'),
        )
        setLoading(false)
      })

    return () => controller.abort()
    // `filtersKey` representa `filters` de forma estável.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, page, pageSize, reloadToken, enabled])

  return { nodes, edges, metadata, loading, error, requestPath }
}
