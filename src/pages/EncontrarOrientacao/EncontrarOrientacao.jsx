import { useState } from 'react'
import './EncontrarOrientacao.css'

function EncontrarOrientacao({ profile, onNavigate }) {
  const isStudent = profile === 'student'
  const [searchStatus, setSearchStatus] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    setSearchStatus(
      'Pesquisa demonstrativa enviada. Os resultados exibidos são exemplos e não foram filtrados.',
    )
  }

  return (
    <main className="student-match" id="inicio">
      <header className="student-match__heading">
        <img src="/bussola.png" alt="" aria-hidden="true" />
        <div>
          <h1 id="match-title">
            {isStudent ? 'Encontrar orientação' : 'Explorar docentes'}
          </h1>
          <p>
            {isStudent
              ? 'Busca semântica por docente e área de pesquisa'
              : 'Consulte docentes, áreas de pesquisa e temas de orientação'}
          </p>
        </div>
      </header>

      <div className="student-match__layout">
        <aside className="match-search-panel" aria-labelledby="semantic-search-title">
          <h2 id="semantic-search-title">Busca semântica</h2>
          <p className="match-panel-description">
            {isStudent
              ? 'Descreva o docente ou a área de pesquisa que você procura.'
              : 'Pesquise docentes por nome ou área de pesquisa.'}
          </p>

          <form
            className="match-form"
            role="search"
            onSubmit={handleSearch}
          >
            <div className="match-field">
              <label htmlFor="teacher-query">Docente</label>
              <span className="match-input">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <circle cx="10.8" cy="10.8" r="7.2" />
                  <path d="m16.2 16.2 5 5" />
                </svg>
                <input id="teacher-query" name="docente" type="search" placeholder="Ex: Ana Beatriz" />
              </span>
            </div>

            <div className="match-field">
              <label htmlFor="area-query">Área de interesse</label>
              <span className="match-input">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <circle cx="10.8" cy="10.8" r="7.2" />
                  <path d="m16.2 16.2 5 5" />
                </svg>
                <input id="area-query" name="area" type="search" defaultValue="Metodologia de Pesquisa" />
              </span>
            </div>

            <fieldset className="match-filters">
              <legend>Filtros</legend>
              <div className="match-filter-row">
                <span className="match-filter-label">Titulação</span>
                <div className="match-filter-options">
                  <span>Mestrado</span>
                  <span>Doutorado</span>
                </div>
              </div>
              <div className="match-filter-row">
                <span className="match-filter-label">Idioma</span>
                <div className="match-filter-options">
                  <span>Inglês</span>
                </div>
              </div>
              <div className="match-filter-row">
                <span className="match-filter-label">Área de pesquisa</span>
                <div className="match-filter-options">
                  <span>Metodologia</span>
                </div>
              </div>
              <div className="match-filter-row">
                <span className="match-filter-label">Vagas</span>
                <div className="match-filter-options">
                  <span className="available-filter">Com vagas</span>
                </div>
              </div>
            </fieldset>

            <button className="match-clear-filters" type="reset">Limpar busca</button>
            <button className="match-submit" type="submit">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="10.8" cy="10.8" r="7.2" />
                <path d="m16.2 16.2 5 5" />
              </svg>
              Buscar docentes
            </button>
            <p className="match-search-status" role="status" aria-live="polite">
              {searchStatus}
            </p>
          </form>

          <div className="match-quick-actions">
            <h3>Ações rápidas</h3>
            <button
              type="button"
              onClick={() => onNavigate('grafo')}
              aria-label="Explorar grafo de conhecimento"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15" />
              </svg>
              Explorar grafo de conhecimento
            </button>
          </div>
        </aside>

        <section className="match-results" aria-labelledby="results-heading">
          <header className="match-results__heading">
            <div>
              <h2 id="results-heading">Resultados para "Metodologia de Pesquisa"</h2>
              <p>1 docente encontrado com afinidade alta</p>
            </div>
            <span className="demonstrative-badge">Demonstrativo</span>
          </header>

          <article className="match-result-card" aria-labelledby="teacher-name">
            <span className="match-avatar" aria-hidden="true">AB</span>

            <div className="match-result-card__profile">
              <div className="match-teacher-title">
                <h3 id="teacher-name">Ana Beatriz</h3>
                <span className="teacher-vacancies">3 vagas</span>
              </div>
              <p className="teacher-qualification">Doutora em Metodologia de Pesquisa Aplicada</p>
              <p className="teacher-bio">
                Especializada em métodos qualitativos, análise de discurso e pesquisa-ação.
              </p>
            </div>

            <div className="affinity-score" role="group" aria-label="Afinidade alta: 92 por cento">
              <span>
                92% <span className="sr-only">de afinidade</span>
              </span>
              <strong>Afinidade alta</strong>
              <small>4 critérios</small>
            </div>

            <div className="match-result-actions">
              <button
                className="match-action-button"
                type="button"
                aria-label="Ver perfil de Ana Beatriz"
                onClick={() => onNavigate('perfil-docente')}
              >
                Ver perfil
              </button>
              {isStudent && (
                <button
                  className="match-action-button match-action-button--primary"
                  type="button"
                  aria-label="Candidatar-se à orientação com Ana Beatriz"
                  onClick={() => onNavigate('candidatura')}
                >
                  Candidatar-se
                </button>
              )}
            </div>
          </article>

          <div className="match-details">
            <section className="match-detail-card" aria-labelledby="topics-title">
              <h2 id="topics-title">Temas de TCC</h2>
              <ul className="thesis-topics">
                <li>Análise de Discurso em Redes Sociais</li>
                <li>Metodologia de Pesquisa Qualitativa</li>
                <li>Etnografia Digital</li>
              </ul>
            </section>

            <section className="match-detail-card affinity-explanation" aria-labelledby="affinity-title">
              <h2 id="affinity-title">Sobre a afinidade</h2>
              <p>
                Afinidade demonstrativa de 92%, baseada em tema, área,
                palavras-chave e métodos de pesquisa. Indica alinhamento temático
                com sua busca, não probabilidade de aceitação.
              </p>
              <details className="affinity-help">
                <summary>Saiba mais sobre o cálculo</summary>
                <p>
                A afinidade é uma estimativa demonstrativa de alinhamento entre os
                termos pesquisados e as informações públicas do docente; ela não prevê
                aprovação de candidatura.
                </p>
              </details>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default EncontrarOrientacao
