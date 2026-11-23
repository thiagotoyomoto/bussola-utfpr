import { useEffect, useRef, useState } from 'react'
import { ApiError, fetchJson } from '../lib/api'
import type { OrganizationalUnit } from '../lib/types'

interface UseOrganizationalUnitsResult {
  units: OrganizationalUnit[]
  loading: boolean
  error: ApiError | null
}

/**
 * Lista unidades via fan-out: `GET /registry/v1/organization/{id}/organizational-unit`
 * para cada `organizationId`, mesclando e deduplicando por `id`.
 *
 * - Sem organizações selecionadas: retorna `[]` sem requisição.
 * - Usa `allSettled`: mantém sucessos parciais e expõe o primeiro erro.
 */
export function useOrganizationalUnits(organizationIds: readonly string[]): UseOrganizationalUnitsResult {
  const key = [...new Set(organizationIds)].filter(Boolean).sort().join('|')
  const [units, setUnits] = useState<OrganizationalUnit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const requestId = useRef(0)

  // Ajuste de estado na fase de render (padrão recomendado pelo React):
  // reseta o status quando as organizações selecionadas mudam, sem
  // `setState` síncrono dentro do efeito.
  const [prevKey, setPrevKey] = useState(key)
  if (prevKey !== key) {
    setPrevKey(key)
    setUnits([])
    setError(null)
    setLoading(key !== '')
  }

  useEffect(() => {
    const ids = key === '' ? [] : key.split('|')
    const current = ++requestId.current
    const controller = new AbortController()

    if (ids.length === 0) return () => controller.abort()

    const requests = ids.map((organizationId) =>
      fetchJson<OrganizationalUnit[] | null>(
        `/registry/v1/organization/${encodeURIComponent(organizationId)}/organizational-unit`,
        { signal: controller.signal },
      ),
    )

    Promise.allSettled(requests)
      .then((results) => {
        if (controller.signal.aborted || current !== requestId.current) return
        const merged = new Map<string, OrganizationalUnit>()
        let firstError: ApiError | null = null
        for (const result of results) {
          if (result.status === 'fulfilled') {
            const list = Array.isArray(result.value) ? result.value : []
            for (const unit of list) {
              if (unit && typeof unit.id === 'string' && !merged.has(unit.id)) {
                merged.set(unit.id, unit)
              }
            }
          } else {
            const reason = result.reason as unknown
            if (!firstError) {
              firstError =
                reason instanceof ApiError
                  ? reason
                  : new ApiError(null, 'Não foi possível carregar as unidades organizacionais.')
            }
          }
        }
        setUnits(
          [...merged.values()].sort((a, b) =>
            (a.acronym || a.name || a.id).localeCompare(b.acronym || b.name || b.id, 'pt-BR'),
          ),
        )
        setError(firstError)
        setLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted || current !== requestId.current) return
        setUnits([])
        setError(new ApiError(null, 'Não foi possível carregar as unidades organizacionais.'))
        setLoading(false)
      })

    return () => controller.abort()
  }, [key])

  return { units, loading, error }
}
