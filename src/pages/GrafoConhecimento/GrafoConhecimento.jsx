import { useState } from 'react'
import './GrafoConhecimento.css'

function GrafoConhecimento({ profile, onNavigate }) {
  const isStudent = profile === 'student'
  const [searchStatus, setSearchStatus] = useState('')

  return (
    <main className="student-graph" id="inicio">
      <nav className="graph-breadcrumb" aria-label="Trilha de navegação">
        <button type="button" onClick={() => onNavigate('encontrar-orientacao')}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m15 18-6-6 6-6M9 12h12" />
          </svg>
          Voltar à busca
        </button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Grafo de conhecimento</span>
      </nav>

      <header className="student-graph__heading">
        <div>
          <h1 id="graph-page-title">Explorar grafo de conhecimento</h1>
          <p>
            {isStudent
              ? 'Descubra conexões entre docentes, áreas de pesquisa e possibilidades para o seu TCC.'
              : 'Explore conexões entre docentes, áreas de pesquisa e temas de orientação.'}
          </p>
        </div>
        <span className="graph-demo-badge">Dados demonstrativos</span>
      </header>

      <div className="student-graph__layout">
        <section className="knowledge-panel" aria-label="Grafo e conexões acadêmicas">
          <form
            className="knowledge-tools"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              setSearchStatus(
                'Pesquisa demonstrativa enviada. O grafo exibido contém dados de exemplo.',
              )
            }}
          >
            <label className="knowledge-search" htmlFor="graph-search">
              <span className="visually-hidden">Pesquisar no grafo</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="10.8" cy="10.8" r="7.2" />
                <path d="m16.2 16.2 5 5" />
              </svg>
              <input id="graph-search" type="search" name="q" defaultValue="Metodologia de Pesquisa" />
            </label>

            <span className="knowledge-filter-button">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 6h16M7 12h10m-7 6h4" />
                <circle cx="8" cy="6" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
              Filtros · 2
            </span>

            <div className="knowledge-view-switch" role="group" aria-label="Modo de visualização">
              <span className="knowledge-view-switch__current">Grafo</span>
              <a href="#connections-title" aria-label="Ir para relações em lista">
                Lista
              </a>
            </div>
            <button className="knowledge-search-submit" type="submit">
              Pesquisar
            </button>
            <p className="knowledge-search-status" role="status" aria-live="polite">
              {searchStatus}
            </p>
          </form>

          <div className="knowledge-summary" role="group" aria-label="Filtros ativos e resumo">
            <span>
              Incluir áreas relacionadas <span aria-hidden="true">×</span>
            </span>
            <span>
              Com vagas <span aria-hidden="true">×</span>
            </span>
            <p>2 docentes · 2 áreas · 4 temas</p>
          </div>

          <figure className="knowledge-graph" aria-labelledby="knowledge-graph-caption">
            <figcaption id="knowledge-graph-caption" className="visually-hidden">
              Grafo demonstrativo: Ana Beatriz relaciona-se à área Metodologia de
              Pesquisa, conectada aos temas Análise de Discurso em Redes Sociais,
              Metodologia de Pesquisa Qualitativa e Etnografia Digital. Marcos
              Oliveira relaciona-se à área Métodos Quantitativos, conectada ao tema
              Análise de Dados Educacionais.
            </figcaption>

            <div className="knowledge-column-headings" aria-hidden="true">
              <span>Docentes</span>
              <span>Atua em → Área</span>
              <span>Abrange → Tema de TCC</span>
            </div>

            <svg className="knowledge-edges" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M240 118H350" />
              <path d="M570 118C635 118 642 55 690 55" />
              <path d="M570 118H690V135" />
              <path d="M570 118C635 118 642 190 690 190" />
              <path d="M240 260H350" />
              <path d="M570 260H690" />
            </svg>

            <div className="knowledge-node knowledge-node--teacher knowledge-node--selected">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8" r="4" />
                <path d="M3 21c.8-4.2 4.2-6.5 9-6.5s8.2 2.3 9 6.5" />
              </svg>
              <span>
                <small>Docente · Selecionada</small>
                <strong>Ana Beatriz</strong>
              </span>
            </div>

            <div className="knowledge-node knowledge-node--area knowledge-node--area-one">
              <span className="knowledge-diamond" aria-hidden="true">◇</span>
              <span>
                <small>Área</small>
                <strong>Metodologia de Pesquisa</strong>
              </span>
            </div>

            <div className="knowledge-node knowledge-node--topic knowledge-node--topic-one">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 3h7l5 5v13H7zM14 3v6h5M10 13h6m-6 4h6" />
              </svg>
              <span>
                <small>Tema de TCC</small>
                <strong>Análise de Discurso em Redes Sociais</strong>
              </span>
            </div>

            <div className="knowledge-node knowledge-node--topic knowledge-node--topic-two">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 3h7l5 5v13H7zM14 3v6h5M10 13h6m-6 4h6" />
              </svg>
              <span>
                <small>Tema de TCC</small>
                <strong>Metodologia de Pesquisa Qualitativa</strong>
              </span>
            </div>

            <div className="knowledge-node knowledge-node--topic knowledge-node--topic-three">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 3h7l5 5v13H7zM14 3v6h5M10 13h6m-6 4h6" />
              </svg>
              <span>
                <small>Tema de TCC</small>
                <strong>Etnografia Digital</strong>
              </span>
            </div>

            <div className="knowledge-node knowledge-node--teacher knowledge-node--teacher-two">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8" r="4" />
                <path d="M3 21c.8-4.2 4.2-6.5 9-6.5s8.2 2.3 9 6.5" />
              </svg>
              <span>
                <small>Docente</small>
                <strong>Marcos Oliveira</strong>
              </span>
            </div>

            <div className="knowledge-node knowledge-node--area knowledge-node--area-two">
              <span className="knowledge-diamond" aria-hidden="true">◇</span>
              <span>
                <small>Área</small>
                <strong>Métodos Quantitativos</strong>
              </span>
            </div>

            <div className="knowledge-node knowledge-node--topic knowledge-node--topic-four">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 3h7l5 5v13H7zM14 3v6h5M10 13h6m-6 4h6" />
              </svg>
              <span>
                <small>Tema de TCC</small>
                <strong>Análise de Dados Educacionais</strong>
              </span>
            </div>
          </figure>

          <div className="knowledge-legend" role="group" aria-label="Legenda do grafo">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8" r="4" />
                <path d="M3 21c.8-4.2 4.2-6.5 9-6.5s8.2 2.3 9 6.5" />
              </svg>
              Docente
            </span>
            <span>
              <span className="knowledge-diamond" aria-hidden="true">◇</span> Área
            </span>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 3h7l5 5v13H7zM14 3v6h5M10 13h6m-6 4h6" />
              </svg>
              Tema de TCC
            </span>
            <span className="legend-line-description">Linha contínua = relação acadêmica</span>

            <p className="knowledge-zoom">
              <span>Zoom indisponível nesta demonstração</span>
            </p>
          </div>

          <section className="selected-connections" aria-labelledby="connections-title">
            <div>
              <h2 id="connections-title">Conexões da seleção · alternativa em lista</h2>
              <ul>
                <li>Ana Beatriz → Metodologia de Pesquisa</li>
                <li>Análise de Discurso em Redes Sociais</li>
                <li>Metodologia de Pesquisa Qualitativa</li>
                <li>Etnografia Digital</li>
              </ul>
            </div>
            <a href="#connections-title" className="full-list-link">
              Ver lista de conexões
            </a>
          </section>
        </section>

        <aside className="selected-teacher-panel" aria-labelledby="selected-teacher-title">
          <div className="selected-teacher-panel__status">
            <span>Docente selecionada</span>
            <span className="available-seats">3 vagas disponíveis</span>
          </div>

          <div className="selected-teacher">
            <span className="selected-teacher__avatar" aria-hidden="true">AB</span>
            <div>
              <h2 id="selected-teacher-title">Ana Beatriz</h2>
              <p>Doutora em Metodologia de Pesquisa Aplicada</p>
            </div>
          </div>

          <section className="teacher-affinity" aria-labelledby="teacher-affinity-title">
            <span className="teacher-affinity__score">
              92% <span className="sr-only">de afinidade</span>
            </span>
            <div>
              <h3 id="teacher-affinity-title">Afinidade alta</h3>
              <p>Alinhamento com a sua busca</p>
            </div>
          </section>

          <p className="affinity-criteria">4 critérios: tema, área, palavras-chave e métodos.</p>
          <p className="affinity-disclaimer">Afinidade demonstrativa. Não representa probabilidade de aceitação.</p>

          <section className="teacher-methods" aria-labelledby="methods-title">
            <h3 id="methods-title">Métodos e especialidades</h3>
            <p>Métodos qualitativos, análise de discurso e pesquisa-ação.</p>
          </section>

          <section className="related-topic" aria-labelledby="related-topic-title">
            <h3 id="related-topic-title">Tema relacionado à sua busca</h3>
            <p>Análise de Discurso em Redes Sociais</p>
            <p>Investigue narrativas e sentidos em ambientes digitais.</p>
          </section>

          <button
            className="teacher-profile-link"
            type="button"
            aria-label="Ver perfil e temas de Ana Beatriz"
            onClick={() => onNavigate('perfil-docente')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
            Ver perfil e temas
          </button>
          {isStudent && (
            <p className="profile-guidance">
              Explore o perfil antes de escolher um tema e preparar sua candidatura.
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}

export default GrafoConhecimento
