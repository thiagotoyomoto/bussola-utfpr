import { useEffect, useRef, useState } from 'react'
import { ApiError, fetchJson } from '../lib/api'
import type { Organization } from '../lib/types'

interface UseOrganizationsResult {
  organizations: Organization[]
  loading: boolean
  error: ApiError | null
  reload: () => void
}

/**
 * Lista organizações via `GET /registry/v1/organization` (público).
 * Normaliza `null` para `[]` e cancela a requisição ao desmontar.
 */
export function useOrganizations(): UseOrganizationsResult {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const requestId = useRef(0)

  // Ajuste de estado na fase de render (padrão recomendado pelo React para
  // reagir à troca de `reloadToken` sem `setState` síncrono dentro do efeito).
  const [prevToken, setPrevToken] = useState(reloadToken)
  if (prevToken !== reloadToken) {
    setPrevToken(reloadToken)
    setLoading(true)
    setError(null)
  }

  const reload = () => setReloadToken((token) => token + 1)

  useEffect(() => {
    const controller = new AbortController()
    const current = ++requestId.current

    fetchJson<Organization[] | null>('/registry/v1/organization', { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted || current !== requestId.current) return
        setOrganizations(Array.isArray(data) ? data : [])
        setError(null)
        setLoading(false)
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return
        if (current !== requestId.current) return
        setOrganizations([])
        setError(
          fetchError instanceof ApiError
            ? fetchError
            : new ApiError(null, 'Não foi possível carregar as organizações.'),
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [reloadToken])

  return { organizations, loading, error, reload }
}
