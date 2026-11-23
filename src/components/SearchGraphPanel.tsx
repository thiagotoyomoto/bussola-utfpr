import { useMemo, useState, type FormEvent } from 'react'
import ApiGraphView from './ApiGraphView'
import { getApiBaseUrl, isCanonicalUuid, normalizeUuid } from '../lib/api'
import { API_NODE_LABELS_PT } from '../lib/apiGraph'
import type { KnowledgeArea, SearchGraphFilters } from '../lib/types'
import { useKnowledgeAreas } from '../hooks/useKnowledgeAreas'
import { useOrganizations } from '../hooks/useOrganizations'
import { useOrganizationalUnits } from '../hooks/useOrganizationalUnits'
import { useSearchGraph } from '../hooks/useSearchGraph'

const EMPTY_FILTERS: SearchGraphFilters = {
  knowledgeAreaIds: [],
  organizationIds: [],
  organizationalUnitIds: [],
  available: null,
}

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const MAX_REPEATABLE = 20

function orgLabel(org: { acronym: string; name: string }): string {
  if (org.acronym && org.name && org.acronym !== org.name) return `${org.acronym} — ${org.name}`
  return org.name || org.acronym || 'Sem nome'
}

export default function SearchGraphPanel() {
  /** Organização única e obrigatória (dropdown). */
  const [draftOrgId, setDraftOrgId] = useState<string | null>(null)
  /** Unidades opcionais e múltiplas (dropdown) da organização selecionada. */
  const [draftUnitIds, setDraftUnitIds] = useState<string[]>([])
  const [draftAvailable, setDraftAvailable] = useState<boolean | null>(null)
  const [draftKnowledgeIds, setDraftKnowledgeIds] = useState<string[]>([])
  const [knowledgeInput, setKnowledgeInput] = useState('')
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null)
  const [knowledgeById, setKnowledgeById] = useState<Record<string, KnowledgeArea>>({})
  const [draftPageSize, setDraftPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [pageSizeError, setPageSizeError] = useState<string | null>(null)

  const [appliedFilters, setAppliedFilters] = useState<SearchGraphFilters>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [appliedPageSize, setAppliedPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [reloadToken, setReloadToken] = useState(0)

  const { organizations, loading: orgsLoading, error: orgsError, reload: reloadOrgs } = useOrganizations()
  const {
    units,
    loading: unitsLoading,
    error: unitsError,
  } = useOrganizationalUnits(draftOrgId ? [draftOrgId] : [])
  const knowledgeInputIsUuid = isCanonicalUuid(knowledgeInput)
  const {
    areas: knowledgeOptions,
    total: knowledgeTotal,
    loading: knowledgeLoading,
    error: knowledgeSearchError,
  } = useKnowledgeAreas({
    query: knowledgeInput,
    page: 1,
    pageSize: 10,
    enabled: !knowledgeInputIsUuid,
  })
  const showKnowledgeAutocomplete =
    !knowledgeInputIsUuid && knowledgeInput.trim().length >= 2

  const graphEnabled = appliedFilters.organizationIds.length > 0
  const { nodes, edges, metadata, loading, error, requestPath } = useSearchGraph({
    filters: appliedFilters,
    page,
    pageSize: appliedPageSize,
    reloadToken,
    enabled: graphEnabled,
  })

  const toggleId = (list: string[], id: string): string[] =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id]

  const handleSelectOrg = (organizationId: string | null) => {
    setDraftOrgId(organizationId)
    // Unidades pertencem à organização; trocar de organização limpa a seleção.
    setDraftUnitIds([])
  }

  const handleAddKnowledgeId = () => {
    const normalized = normalizeUuid(knowledgeInput)
    if (!normalized) {
      setKnowledgeError('Informe um UUID de área de conhecimento.')
      return
    }
    if (!isCanonicalUuid(knowledgeInput)) {
      setKnowledgeError('UUID inválido. Use o formato canônico em minúsculas (8-4-4-4-12 hex).')
      return
    }
    if (draftKnowledgeIds.includes(normalized)) {
      setKnowledgeError('Este UUID já foi adicionado.')
      return
    }
    if (draftKnowledgeIds.length >= MAX_REPEATABLE) {
      setKnowledgeError(`Limite de ${MAX_REPEATABLE} áreas de conhecimento atingido.`)
      return
    }
    setDraftKnowledgeIds((previous) => [...previous, normalized])
    setKnowledgeInput('')
    setKnowledgeError(null)
  }

  const handleSelectKnowledgeArea = (area: KnowledgeArea) => {
    const normalized = normalizeUuid(area.id)
    if (draftKnowledgeIds.includes(normalized)) {
      setKnowledgeError('Esta área já foi adicionada.')
      return
    }
    if (draftKnowledgeIds.length >= MAX_REPEATABLE) {
      setKnowledgeError(`Limite de ${MAX_REPEATABLE} áreas de conhecimento atingido.`)
      return
    }
    setDraftKnowledgeIds((previous) => [...previous, normalized])
    setKnowledgeById((previous) => ({ ...previous, [normalized]: area }))
    setKnowledgeInput('')
    setKnowledgeError(null)
  }

  const handleRemoveKnowledgeId = (id: string) => {
    setDraftKnowledgeIds((previous) => previous.filter((item) => item !== id))
    setKnowledgeById((previous) => {
      if (!(id in previous)) return previous
      const next = { ...previous }
      delete next[id]
      return next
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draftOrgId) {
      return
    }
    if (draftUnitIds.length > MAX_REPEATABLE) {
      return
    }
    if (!Number.isInteger(draftPageSize) || draftPageSize < 1 || draftPageSize > MAX_PAGE_SIZE) {
      setPageSizeError(`page_size deve ser inteiro de 1 a ${MAX_PAGE_SIZE}.`)
      return
    }
    setPageSizeError(null)
    // Trocar filtro reseta para a página 1. O token garante que todo clique
    // em Buscar dispara uma requisição, mesmo sem mudança nos filtros.
    setAppliedFilters({
      knowledgeAreaIds: [...draftKnowledgeIds],
      organizationIds: draftOrgId ? [draftOrgId] : [],
      organizationalUnitIds: [...draftUnitIds],
      available: draftAvailable,
    })
    setAppliedPageSize(draftPageSize)
    setPage(1)
    setReloadToken((token) => token + 1)
  }

  const handleClear = () => {
    setDraftOrgId(null)
    setDraftUnitIds([])
    setDraftAvailable(null)
    setDraftKnowledgeIds([])
    setKnowledgeInput('')
    setKnowledgeError(null)
    setKnowledgeById({})
    setDraftPageSize(DEFAULT_PAGE_SIZE)
    setPageSizeError(null)
    setAppliedFilters(EMPTY_FILTERS)
    setAppliedPageSize(DEFAULT_PAGE_SIZE)
    setPage(1)
    setReloadToken((token) => token + 1)
  }

  const totalPages = useMemo(() => {
    const size = metadata.page_size > 0 ? metadata.page_size : appliedPageSize
    return Math.max(1, Math.ceil(metadata.total / size))
  }, [metadata.page_size, metadata.total, appliedPageSize])

  const currentPage = metadata.page || page
  const apiBase = getApiBaseUrl()
  const overLimit = draftUnitIds.length > MAX_REPEATABLE
  const canSearch = draftOrgId !== null && !overLimit
  const professorNodes = useMemo(() => nodes.filter((node) => node.type === 'professor'), [nodes])

  return (
    <section className="api-search-panel" aria-labelledby="api-search-title">
      <div className="api-search-panel__heading">
        <div>
          <h2 id="api-search-title">Explorar dados da API</h2>
          <p>
            Consulta ao vivo em <code>GET /search/v1/graph</code> com filtros de organização,
            unidade organizacional e área de conhecimento. Selecione a organização (obrigatória)
            para carregar suas unidades (opcionais), busque áreas por nome e gere a busca.
          </p>
        </div>
      </div>

      <p className="api-search-panel__meta">
        API base: <code>{apiBase || '(mesma origem — proxy de dev)'}</code>
        {requestPath && (
          <>
            {' · '}Última requisição: <code className="api-search-panel__url">{requestPath}</code>
          </>
        )}
      </p>

      <div className="api-search-panel__layout">
      <form className="api-search-filters" onSubmit={handleSubmit} aria-label="Filtros da busca no grafo">
        <div className="api-search-field api-search-field--inline">
          <label htmlFor="api-organization">
            Organização <span aria-hidden="true">*</span>
            <span className="visually-hidden">(obrigatória)</span>
          </label>
          {orgsLoading && (
            <p role="status" className="api-search-hint">
              Carregando organizações...
            </p>
          )}
          {orgsError && !orgsLoading && (
            <p role="alert" className="api-search-error">
              {orgsError.message}{' '}
              <button type="button" onClick={reloadOrgs}>
                Tentar novamente
              </button>
            </p>
          )}
          {!orgsLoading && !orgsError && organizations.length === 0 && (
            <p className="api-search-hint">Nenhuma organização encontrada.</p>
          )}
          {!orgsLoading && !orgsError && organizations.length > 0 && (
            <select
              id="api-organization"
              className="api-search-select"
              required
              value={draftOrgId ?? ''}
              onChange={(event) => handleSelectOrg(event.target.value === '' ? null : event.target.value)}
            >
              <option value="">Selecione uma organização</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id} title={org.id}>
                  {orgLabel(org)} · {org.kind}
                </option>
              ))}
            </select>
          )}
          <p className="api-search-hint">Filtro obrigatório e único: define a organização da busca.</p>
        </div>

        <fieldset className="api-search-field">
          <legend>
            Unidades organizacionais (opcional){' '}
            {draftUnitIds.length > 0 && (
              <span className="api-search-count">
                {draftUnitIds.length} selecionada{draftUnitIds.length === 1 ? '' : 's'}
              </span>
            )}
          </legend>
          {!draftOrgId && (
            <p className="api-search-hint">
              Selecione uma organização para carregar suas unidades.
            </p>
          )}
          {draftOrgId && unitsLoading && (
            <p role="status" className="api-search-hint">
              Carregando unidades da organização selecionada...
            </p>
          )}
          {draftOrgId && unitsError && !unitsLoading && (
            <p role="alert" className="api-search-error">
              {unitsError.message} (resultados parciais podem estar listados abaixo).
            </p>
          )}
          {draftOrgId && !unitsLoading && !unitsError && units.length === 0 && (
            <p className="api-search-hint">
              Nenhuma unidade encontrada para a organização selecionada.
            </p>
          )}
          {draftOrgId && units.length > 0 && (
            <details className="api-search-dropdown">
              <summary>
                {draftUnitIds.length === 0
                  ? 'Todas as unidades (nenhum filtro)'
                  : `${draftUnitIds.length} unidade${draftUnitIds.length === 1 ? '' : 's'} selecionada${draftUnitIds.length === 1 ? '' : 's'}`}
              </summary>
              <div className="api-search-dropdown__actions">
                <button type="button" onClick={() => setDraftUnitIds(units.map((unit) => unit.id))}>
                  Selecionar todas
                </button>
                <button type="button" onClick={() => setDraftUnitIds([])}>
                  Desmarcar todas
                </button>
              </div>
              <ul className="api-search-checklist">
                {units.map((unit) => (
                  <li key={unit.id}>
                    <label title={unit.id}>
                      <input
                        type="checkbox"
                        checked={draftUnitIds.includes(unit.id)}
                        onChange={() => setDraftUnitIds((previous) => toggleId(previous, unit.id))}
                      />
                      <span>
                        <strong>{unit.acronym && unit.acronym !== unit.name ? `${unit.acronym} — ${unit.name}` : unit.name || unit.acronym || 'Sem nome'}</strong>{' '}
                        <small>
                          <code>{unit.id.slice(0, 8)}…</code>
                        </small>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </fieldset>

        <fieldset className="api-search-field">
          <legend>Disponibilidade</legend>
          <div className="api-search-radio-group" role="radiogroup" aria-label="Filtro de disponibilidade">
            <label>
              <input
                type="radio"
                name="api-available"
                checked={draftAvailable === null}
                onChange={() => setDraftAvailable(null)}
              />
              Todos
            </label>
            <label>
              <input
                type="radio"
                name="api-available"
                checked={draftAvailable === true}
                onChange={() => setDraftAvailable(true)}
              />
              Disponível (true)
            </label>
            <label>
              <input
                type="radio"
                name="api-available"
                checked={draftAvailable === false}
                onChange={() => setDraftAvailable(false)}
              />
              Indisponível (false)
            </label>
          </div>
        </fieldset>

        <fieldset className="api-search-field">
          <legend>
            Áreas de conhecimento (UUID){' '}
            {draftKnowledgeIds.length > 0 && (
              <span className="api-search-count">{draftKnowledgeIds.length}/20</span>
            )}
          </legend>
          <p className="api-search-hint">
            Busque por nome ou caminho (ex.: <code>ciencia</code>,{' '}
            <code>ciencias-exatas/ciencia</code>) e selecione para obter o UUID. Ou cole um
            UUID canônico e clique em Adicionar.
          </p>
          <div className="api-search-uuid-row">
            <label className="visually-hidden" htmlFor="api-knowledge-input">
              Buscar área de conhecimento por nome ou UUID
            </label>
            <input
              id="api-knowledge-input"
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              maxLength={100}
              placeholder="ex.: ciencia ou 123e4567-e89b-12d3-a456-426614174000"
              value={knowledgeInput}
              onChange={(event) => {
                setKnowledgeInput(event.target.value)
                if (knowledgeError) setKnowledgeError(null)
              }}
              role="combobox"
              aria-expanded={showKnowledgeAutocomplete}
              aria-controls="api-knowledge-options"
              aria-autocomplete="list"
            />
            <button type="button" onClick={handleAddKnowledgeId}>
              Adicionar
            </button>
          </div>
          {showKnowledgeAutocomplete && (
            <div id="api-knowledge-options" className="api-search-autocomplete">
              {knowledgeLoading && (
                <p role="status" className="api-search-hint">
                  Buscando áreas em <code>GET /registry/v1/knowledge-area</code>...
                </p>
              )}
              {!knowledgeLoading && knowledgeSearchError && (
                <p role="alert" className="api-search-error">
                  {knowledgeSearchError.message}
                </p>
              )}
              {!knowledgeLoading && !knowledgeSearchError && knowledgeOptions.length > 0 && (
                <ul role="listbox" aria-label="Áreas de conhecimento encontradas" className="api-search-autocomplete__list">
                  {knowledgeOptions.map((area) => (
                    <li key={area.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={draftKnowledgeIds.includes(normalizeUuid(area.id))}
                        disabled={draftKnowledgeIds.includes(normalizeUuid(area.id))}
                        onClick={() => handleSelectKnowledgeArea(area)}
                        title={area.id}
                      >
                        <strong>{area.name}</strong>
                        <small className="api-search-autocomplete__path">
                          <code>{area.path}</code>
                        </small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!knowledgeLoading && !knowledgeSearchError && knowledgeOptions.length === 0 && (
                <p className="api-search-hint">
                  Nenhuma área encontrada para &ldquo;{knowledgeInput.trim()}&rdquo; (total: {knowledgeTotal}).
                </p>
              )}
            </div>
          )}
          {knowledgeError && (
            <p role="alert" className="api-search-error">
              {knowledgeError}
            </p>
          )}
          {draftKnowledgeIds.length > 0 && (
            <ul className="api-search-uuid-list">
              {draftKnowledgeIds.map((id) => {
                const details = knowledgeById[id]
                return (
                  <li key={id}>
                    {details ? (
                      <span title={id}>
                        <strong>{details.name}</strong>{' '}
                        <small>
                          <code>{details.path}</code>
                        </small>{' '}
                        <code>{id}</code>
                      </span>
                    ) : (
                      <code title={id}>{id}</code>
                    )}{' '}
                    <button
                      type="button"
                      aria-label={`Remover área ${details ? `${details.name} (${id})` : id}`}
                      onClick={() => handleRemoveKnowledgeId(id)}
                    >
                      Remover
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </fieldset>

        <div className="api-search-field api-search-field--inline">
          <label htmlFor="api-page-size">
            page_size (1–{MAX_PAGE_SIZE}, padrão {DEFAULT_PAGE_SIZE})
          </label>
          <input
            id="api-page-size"
            type="number"
            min={1}
            max={MAX_PAGE_SIZE}
            step={1}
            value={draftPageSize}
            onChange={(event) => {
              setDraftPageSize(Number(event.target.value))
              if (pageSizeError) setPageSizeError(null)
            }}
          />
          {pageSizeError && (
            <p role="alert" className="api-search-error">
              {pageSizeError}
            </p>
          )}
        </div>

        <div className="api-search-actions">
          <button className="api-search-submit" type="submit" disabled={!canSearch}>
            Buscar
          </button>
          <button className="api-search-clear" type="button" onClick={handleClear}>
            Limpar
          </button>
          {!draftOrgId && (
            <p role="alert" className="api-search-error">
              Selecione uma organização para buscar.
            </p>
          )}
          {overLimit && (
            <p role="alert" className="api-search-error">
              Máximo de {MAX_REPEATABLE} unidades organizacionais.
            </p>
          )}
        </div>
      </form>

      <div className="api-search-results" aria-live="polite">
        {!graphEnabled && (
          <p className="graph-empty-state">
            Selecione uma organização (obrigatória) e clique em Buscar para carregar o grafo.
          </p>
        )}
        {graphEnabled && loading && (
          <p role="status" className="api-search-status">
            Carregando grafo da API...
          </p>
        )}

        {!loading && error && graphEnabled && (
          <div role="alert" className="api-search-error-box">
            <p>
              <strong>{error.status === 400 ? 'Parâmetros inválidos.' : 'Falha ao carregar o grafo.'}</strong>{' '}
              {error.status === 400 && error.backendMessage
                ? error.backendMessage
                : error.message}
            </p>
            {error.status !== null && error.status !== 400 && (
              <p className="api-search-hint">
                Status HTTP {error.status}. Verifique os filtros ou tente novamente.
              </p>
            )}
            <button type="button" onClick={() => setReloadToken((token) => token + 1)}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && graphEnabled && (
          <>
            <p className="api-search-status">
              {metadata.total} resultado{metadata.total === 1 ? '' : 's'}
            </p>
            {nodes.length === 0 ? (
              <p className="graph-empty-state">
                Nenhum nó retornado para os filtros atuais. Ajuste os filtros e clique em Buscar.
              </p>
            ) : (
              <>
                <ApiGraphView nodes={nodes} edges={edges} />
                {edges.length === 0 && (
                  <p className="api-search-hint">O grafo não possui arestas para exibir.</p>
                )}
                <section className="api-search-result-list" aria-labelledby="api-result-list-title">
                  <div className="api-search-result-list__heading">
                    <h2 id="api-result-list-title">Docentes encontrados</h2>
                    <span>{professorNodes.length} resultados</span>
                  </div>
                  {professorNodes.length === 0 ? (
                    <p className="graph-empty-state">
                      Nenhum docente retornado para os filtros atuais.
                    </p>
                  ) : (
                    <ul className="api-result-list">
                      {professorNodes.map((node) => (
                        <li key={node.id}>
                          <article className="api-result-card" title={node.id}>
                            <div className="api-result-card__header">
                              <span className="api-result-card__type">
                                {API_NODE_LABELS_PT[node.type] ?? node.type}
                              </span>
                            </div>
                            <h3>{node.label || node.id}</h3>
                            <p>
                              <code>{node.id}</code>
                            </p>
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}

            <nav className="api-search-pagination" aria-label="Paginação do grafo">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              >
                Página anterior
              </button>
              <span aria-live="polite">
                Página {currentPage} de {totalPages} · {metadata.total} no total
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => setPage((previous) => previous + 1)}
              >
                Próxima página
              </button>
            </nav>
          </>
        )}
      </div>
      </div>
    </section>
  )
}
