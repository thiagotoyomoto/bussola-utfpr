import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import type { GraphCanvasRef } from 'reagraph'
import './GrafoConhecimento.css'
import type { NavigateToPage, UserProfile } from '../../types'
import {
  createReagraphData,
  GRAPH_NODE_POSITIONS,
  graphFaculty,
  type GraphFaculty,
} from './graphData'
import { getTeacherAvailability } from '../../data/teacherAvailability'

const ReagraphCanvas = lazy(() => import('./ReagraphCanvas'))

function GrafoConhecimento({
  profile,
  onNavigate,
}: {
  profile: UserProfile
  onNavigate: NavigateToPage
}) {
  const isStudent = profile === 'student'
  const [teacherQuery, setTeacherQuery] = useState('')
  const [areaQuery, setAreaQuery] = useState('')
  const [draftAvailable, setDraftAvailable] = useState(false)
  const [filters, setFilters] = useState({
    teacher: '',
    area: '',
    availableOnly: false,
  })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchStatus, setSearchStatus] = useState('')
  const [compactGraph, setCompactGraph] = useState(false)
  const [anaAvailable] = useState(getTeacherAvailability)
  const graphRef = useRef<GraphCanvasRef>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 40rem)')
    const updateLayout = () => setCompactGraph(mediaQuery.matches)

    updateLayout()
    mediaQuery.addEventListener('change', updateLayout)
    return () => mediaQuery.removeEventListener('change', updateLayout)
  }, [])
  const currentFaculty = useMemo<GraphFaculty[]>(
    () =>
      graphFaculty.map((faculty) =>
        faculty.id === 'ana-beatriz'
          ? {
              ...faculty,
              availability: anaAvailable ? 'available' : 'unavailable',
            }
          : faculty,
      ),
    [anaAvailable],
  )

  const filteredFaculty = useMemo(() => {
    const normalizedTeacher = filters.teacher.trim().toLocaleLowerCase('pt-BR')
    const normalizedArea = filters.area.trim().toLocaleLowerCase('pt-BR')

    return currentFaculty.filter((faculty) => {
      const teacherMatches =
        !normalizedTeacher ||
        faculty.name.toLocaleLowerCase('pt-BR').includes(normalizedTeacher)
      const areaMatches =
        !normalizedArea ||
        faculty.areas.some((area) =>
          area.toLocaleLowerCase('pt-BR').includes(normalizedArea),
        )
      return (
        teacherMatches &&
        areaMatches &&
        (!filters.availableOnly || faculty.availability === 'available')
      )
    })
  }, [currentFaculty, filters])

  const graphData = useMemo(() => createReagraphData(filteredFaculty), [filteredFaculty])
  const graphNodes = useMemo(() => {
    return graphData.nodes.map((node) => {
      const { x, y } = GRAPH_NODE_POSITIONS[node.data.kind]

      return {
        ...node,
        fx: x,
        fy: y,
        size: ['institution', 'department', 'faculty', 'topic'].includes(node.data.kind)
          ? 20
          : 15,
        labelVisible: true,
      }
    })
  }, [graphData])

  const handleGraphReady = useCallback((graph: GraphCanvasRef | null) => {
    graphRef.current = graph
  }, [])

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFilters({
      teacher: teacherQuery,
      area: areaQuery,
      availableOnly: draftAvailable,
    })
    setSearchStatus('Filtros aplicados.')
    setFiltersOpen(false)
  }

  const handleClearFilters = () => {
    setTeacherQuery('')
    setAreaQuery('')
    setDraftAvailable(false)
    setFilters({ teacher: '', area: '', availableOnly: false })
    setSearchStatus('Filtros removidos. Todas as conexões estão sendo exibidas.')
  }

  const resetGraphView = () => {
    const graph = graphRef.current
    if (!graph) return

    graph.fitNodesInView(undefined, { animated: false })
    const controls = graph.getControls()
    controls.setTarget(0, 0, 0, true)
    controls.dollyTo(controls.distance * 1.2, true)
  }

  return (
    <main className="student-graph" id="main-content" tabIndex={-1}>
      <header className="student-graph__heading">
        <div>
          <h1 id="graph-page-title">Grafo de Conhecimento</h1>
          <p>
            Explore docentes, áreas de conhecimento e temas relacionados para
            encontrar conexões com sua pesquisa.
          </p>
        </div>
      </header>

      <div className="student-graph__layout">
        <section className="knowledge-panel" aria-label="Grafo e conexões acadêmicas">
          <form className="knowledge-tools" role="search" onSubmit={handleApplyFilters}>
            <label className="knowledge-search" htmlFor="graph-teacher-search">
              <span className="visually-hidden">Buscar docente</span>
              <input
                id="graph-teacher-search"
                name="docente"
                type="search"
                placeholder="Docente"
                value={teacherQuery}
                onChange={(event) => setTeacherQuery(event.target.value)}
              />
            </label>
            <label className="knowledge-search" htmlFor="graph-area-search">
              <span className="visually-hidden">Buscar área de interesse</span>
              <input
                id="graph-area-search"
                name="area"
                type="search"
                placeholder="Área de interesse"
                value={areaQuery}
                onChange={(event) => setAreaQuery(event.target.value)}
              />
            </label>
            <button
              className="knowledge-filter-button"
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="graph-extra-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 6h16M7 12h10m-7 6h4" />
                <circle cx="8" cy="6" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
              Filtros
            </button>
            <button className="knowledge-search-submit" type="submit">
              Aplicar
            </button>
            <button className="knowledge-clear-button" type="button" onClick={handleClearFilters}>
              Limpar
            </button>
            <fieldset
              className="graph-extra-filters"
              id="graph-extra-filters"
              hidden={!filtersOpen}
            >
              <legend>Disponibilidade</legend>
              <label>
                <input
                  type="checkbox"
                  checked={draftAvailable}
                  onChange={(event) => setDraftAvailable(event.target.checked)}
                />
                Disponível para TCC
              </label>
            </fieldset>
          </form>

          <p className="knowledge-search-status" role="status" aria-live="polite">
            {searchStatus}
          </p>
          <p className="knowledge-results-count" aria-live="polite">
            {filteredFaculty.length}{' '}
            {filteredFaculty.length === 1 ? 'docente encontrado' : 'docentes encontrados'}
          </p>

          {filteredFaculty.length > 0 ? (
            <section className="knowledge-graph" aria-label="Visualização das conexões">
              {!compactGraph && (
                <p className="visually-hidden">
                  Grafo de conhecimento da UTFPR e do DAINF. Apresenta as relações entre
                  instituição, departamento, docentes, áreas de conhecimento, temas de TCC,
                  disciplinas, período acadêmico e disponibilidade de orientação. Nome e código
                  de disciplina, ano e semestre não estão informados. Os registros detalhados
                  estão disponíveis na lista de docentes.
                </p>
              )}
              {compactGraph ? (
                <p className="graph-mobile-alternative">
                  Para uma leitura melhor em telas pequenas, consulte os docentes e suas conexões
                  na lista abaixo.
                </p>
              ) : (
                <>
                  <div className="graph-zoom-controls" aria-label="Controles de zoom do grafo">
                    <button type="button" onClick={() => graphRef.current?.zoomIn()}>
                      Aumentar zoom
                    </button>
                    <button type="button" onClick={() => graphRef.current?.zoomOut()}>
                      Diminuir zoom
                    </button>
                    <button type="button" onClick={resetGraphView}>
                      Ajustar à tela
                    </button>
                  </div>
                  <ul className="graph-legend" aria-label="Tipos de entidade do grafo">
                    <li className="graph-legend__institution">Instituição</li>
                    <li className="graph-legend__department">Departamento</li>
                    <li className="graph-legend__faculty">Docente</li>
                    <li className="graph-legend__area">Área</li>
                    <li className="graph-legend__topic">Tema de TCC</li>
                    <li className="graph-legend__discipline">Disciplina</li>
                    <li className="graph-legend__period">Período</li>
                    <li className="graph-legend__availability">Disponibilidade</li>
                  </ul>
                  <div
                    className="graph-canvas"
                    role="group"
                    aria-label={`Modelo de conhecimento com ${graphData.nodes.length} entidades e ${graphData.edges.length} relações`}
                  >
                    <Suspense
                      fallback={
                        <p className="graph-loading" role="status">
                          Carregando visualização interativa...
                        </p>
                      }
                    >
                      <ReagraphCanvas
                        key={graphData.nodes.map((node) => node.id).join('|')}
                        nodes={graphNodes}
                        edges={graphData.edges}
                        layoutType="forceDirected2d"
                        labelType="nodes"
                        minDistance={200}
                        animated={false}
                        draggable
                        edgeInterpolation="curved"
                        edgeArrowPosition="end"
                        initialTargetX={0}
                        onGraphReady={handleGraphReady}
                      />
                    </Suspense>
                  </div>
                </>
              )}
            </section>
          ) : (
            <p className="graph-empty-state">
              Nenhum docente corresponde aos filtros selecionados.
            </p>
          )}

          {filteredFaculty.length > 0 && (
            <section className="found-faculty" aria-labelledby="found-faculty-title">
              <div className="found-faculty__heading">
                <h2 id="found-faculty-title">Docentes encontrados</h2>
                <span>{filteredFaculty.length} resultados</span>
              </div>
              <ul className="found-faculty__list">
                {filteredFaculty.map((faculty) => (
                  <li key={faculty.id}>
                    <article className="found-faculty-card">
                      <div className="found-faculty-card__identity">
                        <div className="graph-faculty__header">
                          <span className="graph-node__kind">Docente</span>
                          <button
                            className="teacher-profile-link"
                            type="button"
                            aria-label={`Ver perfil de ${faculty.name}`}
                            onClick={() => onNavigate('perfil-docente')}
                          >
                            Ver perfil
                          </button>
                        </div>
                        <h3>{faculty.name}</h3>
                        <p>{faculty.qualification}</p>
                      </div>
                      <div className="found-faculty-card__areas">
                        <h4>Áreas de conhecimento</h4>
                        <ul>
                          {faculty.areas.map((area) => <li key={area}>{area}</li>)}
                        </ul>
                      </div>
                      <div className="found-faculty-card__availability">
                        <h4>Disponibilidade</h4>
                        <span
                          className={`graph-availability graph-availability--${faculty.availability}`}
                        >
                          {{
                            available: 'Disponível',
                            unavailable: 'Indisponível',
                            unconfirmed: 'Não confirmada',
                          }[faculty.availability]}
                        </span>
                      </div>
                      <div className="found-faculty-card__topics">
                        <h4>Temas de TCC</h4>
                        <ul>
                          {faculty.topics.map((topic) => (
                            <li key={topic.id}>
                              <div>
                                <strong>{topic.title}</strong>
                                <p>{topic.description}</p>
                              </div>
                              {isStudent && (
                                <button
                                  type="button"
                                  aria-label={`Candidatar-se ao tema ${topic.title}`}
                                  onClick={() =>
                                    onNavigate('candidatura', { topicTitle: topic.title })
                                  }
                                >
                                  Candidatar-se
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </div>
    </main>
  )
}

export default GrafoConhecimento
