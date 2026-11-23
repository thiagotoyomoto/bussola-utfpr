import type { SearchGraphFilters } from './types'

/**
 * Base da API sem hardcode.
 *
 * - `VITE_API_BASE_URL` trocável sem rebuild de lógica (apenas env).
 * - Default: `http://localhost:8080`.
 * - Se configurado como string vazia (`VITE_API_BASE_URL=`), usa origem
 *   relativa (mesma origem), o que permite usar o proxy de dev do Vite
 *   (`/search`, `/registry` -> `http://localhost:8080`) sem CORS.
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (raw !== undefined && raw.trim() === '') return ''
  if (!raw || !raw.trim()) return 'http://localhost:8080'
  return raw.trim().replace(/\/+$/, '')
}

export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!base) return normalized
  return `${base}${normalized}`
}

/** UUID canônico (minúsculo, com hífens). */
const CANONICAL_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export function normalizeUuid(value: string): string {
  return value.trim().toLowerCase()
}

export function isCanonicalUuid(value: string): boolean {
  return CANONICAL_UUID_RE.test(normalizeUuid(value))
}

export class ApiError extends Error {
  status: number | null
  backendMessage: string | null

  constructor(status: number | null, message: string, backendMessage?: string | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.backendMessage = backendMessage ?? null
  }

  get isBadRequest(): boolean {
    return this.status === 400
  }

  get isServiceUnavailable(): boolean {
    return this.status === 503 || this.status === 504
  }
}

function friendlyMessageForStatus(status: number | null, backendMessage: string | null): string {
  if (status === 400) {
    return backendMessage || 'Parâmetros de busca inválidos. Revise os filtros e tente novamente.'
  }
  if (status === 503) {
    return 'Serviço de busca indisponível (Fuseki). Tente novamente em instantes.'
  }
  if (status === 504) {
    return 'A busca demorou demais para responder (timeout). Tente novamente ou reduza os filtros.'
  }
  if (status === 500) {
    return 'Erro inesperado no servidor. Tente novamente em instantes.'
  }
  if (status !== null) {
    return backendMessage || `A API respondeu com status ${status}. Tente novamente.`
  }
  return 'Não foi possível alcançar a API. Verifique VITE_API_BASE_URL, rede ou CORS.'
}

export interface FetchJsonOptions extends Omit<RequestInit, 'signal'> {
  signal?: AbortSignal
  /** Timeout em ms (default 20000). `0` desabilita. */
  timeoutMs?: number
}

/**
 * `fetch` com `AbortController` + timeout e tratamento de `{ error }`.
 *
 * - `2xx`: retorna o JSON (ou `null` para 204).
 * - `400/500/503/504`: extrai `{ error }` do corpo e lança `ApiError`
 *   com a mensagem do back-end preservada (`backendMessage`).
 * - Falha de rede/CORS/abort por timeout: lança `ApiError` com `status: null`.
 */
export async function fetchJson<T>(pathOrUrl: string, options: FetchJsonOptions = {}): Promise<T> {
  const { timeoutMs = 20000, signal: externalSignal, ...init } = options
  const url = pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') ? pathOrUrl : buildApiUrl(pathOrUrl)

  const controller = new AbortController()
  const onExternalAbort = () => controller.abort(externalSignal?.reason)
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort(externalSignal.reason)
    else externalSignal.addEventListener('abort', onExternalAbort, { once: true })
  }

  const timeoutId = timeoutMs > 0 ? window.setTimeout(() => controller.abort(new DOMException('Timeout', 'TimeoutError')), timeoutMs) : null

  try {
    let response: Response
    try {
      response = await fetch(url, { ...init, signal: controller.signal })
    } catch (error) {
      if (controller.signal.aborted && !externalSignal?.aborted) {
        throw new ApiError(null, 'A busca demorou demais para responder (timeout). Tente novamente ou reduza os filtros.')
      }
      if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
        if (externalSignal?.aborted) throw error
        throw new ApiError(null, 'A busca demorou demais para responder (timeout). Tente novamente ou reduza os filtros.')
      }
      throw new ApiError(
        null,
        'Não foi possível alcançar a API. Verifique VITE_API_BASE_URL, rede ou CORS.',
      )
    }

    let body: unknown = null
    const text = await response.text().catch(() => '')
    if (text) {
      try {
        body = JSON.parse(text) as unknown
      } catch {
        body = null
      }
    }

    if (!response.ok) {
      const backendMessage =
        typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error: unknown }).error === 'string'
          ? ((body as { error: string }).error as string)
          : null
      throw new ApiError(response.status, friendlyMessageForStatus(response.status, backendMessage), backendMessage)
    }

    return body as T
  } finally {
    if (timeoutId !== null) window.clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', onExternalAbort)
  }
}

export interface SearchGraphQuery {
  filters: SearchGraphFilters
  page: number
  pageSize: number
}

/**
 * Constrói a query de `/search/v1/graph` com `URLSearchParams.append()`
 * para chaves repetidas (`knowledge_area`, `organization`, `organizational_unit`).
 *
 * Ex: `/search/v1/graph?organization=<uuid>&organizational_unit=<uuid>&organizational_unit=<uuid>&page=1&page_size=20`
 */
export function buildSearchGraphQuery({ filters, page, pageSize }: SearchGraphQuery): string {
  const params = new URLSearchParams()
  for (const id of filters.knowledgeAreaIds) params.append('knowledge_area', id)
  for (const id of filters.organizationIds) params.append('organization', id)
  for (const id of filters.organizationalUnitIds) params.append('organizational_unit', id)
  if (filters.available !== null) params.append('available', String(filters.available))
  params.append('page', String(page))
  params.append('page_size', String(pageSize))
  return params.toString()
}

export function buildSearchGraphPath(query: SearchGraphQuery): string {
  const qs = buildSearchGraphQuery(query)
  return `/search/v1/graph${qs ? `?${qs}` : ''}`
}

export function buildSearchGraphUrl(query: SearchGraphQuery): string {
  return buildApiUrl(buildSearchGraphPath(query))
}

export interface KnowledgeAreaListQuery {
  q?: string
  page?: number
  pageSize?: number
}

/**
 * Constrói a query de `GET /registry/v1/knowledge-area` com `set()`
 * (parâmetros não repetíveis: repetir `q`/`page`/`page_size` → 400).
 *
 * Ex: `/registry/v1/knowledge-area?q=ciencia&page=1&page_size=10`
 */
export function buildKnowledgeAreaListQuery({ q = '', page = 1, pageSize = 20 }: KnowledgeAreaListQuery = {}): string {
  const params = new URLSearchParams()
  const trimmed = q.trim()
  if (trimmed) params.set('q', trimmed)
  params.set('page', String(page))
  params.set('page_size', String(pageSize))
  return params.toString()
}

export function buildKnowledgeAreaListPath(query: KnowledgeAreaListQuery = {}): string {
  const qs = buildKnowledgeAreaListQuery(query)
  return `/registry/v1/knowledge-area${qs ? `?${qs}` : ''}`
}

export function buildKnowledgeAreaListUrl(query: KnowledgeAreaListQuery = {}): string {
  return buildApiUrl(buildKnowledgeAreaListPath(query))
}
