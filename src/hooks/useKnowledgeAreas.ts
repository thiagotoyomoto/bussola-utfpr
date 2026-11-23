import { useEffect, useRef, useState } from 'react'
import { ApiError, buildKnowledgeAreaListPath, fetchJson } from '../lib/api'
import type { KnowledgeArea, KnowledgeAreaList } from '../lib/types'

interface UseKnowledgeAreasArgs {
  /** Texto livre digitado no filtro (nome ou caminho parcial). */
  query: string
  page?: number
  /** Default 10 (autocomplete). */
  pageSize?: number
  /** Quando `false`, nenhuma requisição é feita. */
  enabled?: boolean
}

interface UseKnowledgeAreasResult {
  areas: KnowledgeArea[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: ApiError | null
}

const AUTOCOMPLETE_DEBOUNCE_MS = 250
const MIN_QUERY_LENGTH = 2

/**
 * Autocomplete de áreas via `GET /registry/v1/knowledge-area`.
 *
 * - Só dispara com `q.trim().length >= 2` (0–1 char: limpa sem request).
 * - Debounce de ~250ms, cancela a request anterior via `AbortController`
 *   (padrão de `fetchJson` em `lib/api.ts`) e ignora respostas stale.
 * - `data` nunca é `null` no contrato; normaliza para `[]` por segurança.
 */
export function useKnowledgeAreas({
  query,
  page = 1,
  pageSize = 10,
  enabled = true,
}: UseKnowledgeAreasArgs): UseKnowledgeAreasResult {
  const trimmed = query.trim()
  const shouldFetch = enabled && trimmed.length >= MIN_QUERY_LENGTH
  // Chave estável para o efeito; evita refetch por identidade de `query`.
  const requestKey = shouldFetch ? `${trimmed}|${page}|${pageSize}` : ''

  const [areas, setAreas] = useState<KnowledgeArea[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const requestId = useRef(0)

  // Ajuste de estado na fase de render (padrão usado nos demais hooks):
  // com 0–1 char, limpa resultados sem request.
  const [prevKey, setPrevKey] = useState(requestKey)
  if (prevKey !== requestKey) {
    setPrevKey(requestKey)
    setAreas([])
    setTotal(0)
    setError(null)
    setLoading(requestKey !== '')
  }

  useEffect(() => {
    if (requestKey === '') return

    const current = ++requestId.current
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      const path = buildKnowledgeAreaListPath({ q: trimmed, page, pageSize })

      fetchJson<KnowledgeAreaList>(path, { signal: controller.signal })
        .then((response) => {
          if (controller.signal.aborted || current !== requestId.current) return
          const list = Array.isArray(response?.data) ? response.data : []
          setAreas(list)
          setTotal(Number(response?.meta?.total ?? 0))
          setError(null)
          setLoading(false)
        })
        .catch((fetchError: unknown) => {
          if (controller.signal.aborted) return
          if (current !== requestId.current) return
          if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
          setAreas([])
          setTotal(0)
          setError(
            fetchError instanceof ApiError
              ? fetchError
              : new ApiError(null, 'Não foi possível carregar as áreas de conhecimento.'),
          )
          setLoading(false)
        })
    }, AUTOCOMPLETE_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [requestKey, trimmed, page, pageSize])

  return { areas, total, page, pageSize, loading, error }
}
