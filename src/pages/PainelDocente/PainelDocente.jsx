import './PainelDocente.css'

function PainelDocente() {
  return (
    <main className="docentes-dashboard" id="inicio">
      <header className="docentes-heading">
        <div>
          <h1 id="dashboard-title">Painel docente</h1>
          <p>
            Dados demonstrativos · Gerencie horários, vagas, temas de TCC e
            métricas de busca
          </p>
        </div>
        <span className="demo-badge">
          <span aria-hidden="true" />
          Dados demonstrativos
        </span>
      </header>

      <div className="docentes-layout">
        <div className="docentes-main-column">
          <section
            className="dashboard-card availability-card"
            aria-labelledby="availability-title"
          >
            <div className="dashboard-card__heading">
              <div>
                <h2 id="availability-title">Disponibilidade para orientação</h2>
                <p>Defina horários e vagas disponíveis.</p>
              </div>

              <button
                className="dashboard-button dashboard-button--primary"
                type="button"
                aria-label="Salvar alterações na disponibilidade"
                disabled
              >
                Salvar alterações
              </button>
            </div>

            <ul className="availability-days" aria-label="Horários de orientação">
              <li className="availability-day">
                <div>
                  <h3>Segunda-feira</h3>
                  <span className="time-badge">14:00 – 18:00</span>
                </div>
                <p>Horário de orientação</p>
              </li>
              <li className="availability-day">
                <div>
                  <h3>Quarta-feira</h3>
                  <span className="time-badge">09:00 – 12:00</span>
                </div>
                <p>Horário de orientação</p>
              </li>
              <li className="availability-day">
                <div>
                  <h3>Sexta-feira</h3>
                  <span className="time-badge">10:00 – 13:00</span>
                </div>
                <p>Horário de orientação</p>
              </li>
            </ul>

            <div className="availability-details">
              <section className="info-card" aria-labelledby="vacancies-title">
                <div className="info-card__heading">
                  <h3 id="vacancies-title">Vagas disponíveis</h3>
                  <span className="time-badge">12 vagas</span>
                </div>
                <p className="vacancies-count">12</p>
                <p>Vagas disponíveis para orientação no período atual.</p>
              </section>

              <section
                className="info-card research-areas"
                aria-labelledby="research-areas-title"
              >
                <div className="info-card__heading">
                  <h3 id="research-areas-title">Áreas de pesquisa</h3>
                  <span className="outline-badge">3 áreas</span>
                </div>
                <p className="research-areas__list">IA, UX, Data Science</p>
                <p>Áreas de pesquisa disponíveis para orientação.</p>
              </section>
            </div>
          </section>

          <section className="dashboard-card topics-card" aria-labelledby="topics-title">
            <div className="dashboard-card__heading">
              <div>
                <h2 id="topics-title">Temas de TCC</h2>
                <p>Adicione, edite e remova temas propostos.</p>
              </div>

              <button
                className="dashboard-button dashboard-button--primary"
                type="button"
                aria-label="Adicionar novo tema de TCC"
                disabled
              >
                Adicionar tema
              </button>
            </div>

            <ul className="topic-list" aria-label="Temas de TCC propostos">
              <li className="topic-item">
                <div>
                  <h3>Inteligência Artificial em Saúde</h3>
                  <p>Autor: Prof. Dr. João Silva</p>
                </div>
                <div
                  className="topic-actions"
                  role="group"
                  aria-label="Ações para Inteligência Artificial em Saúde"
                >
                  <button className="topic-action" type="button" disabled>
                    Editar
                  </button>
                  <button
                    className="topic-action topic-action--remove"
                    type="button"
                    disabled
                  >
                    Remover
                  </button>
                </div>
              </li>

              <li className="topic-item">
                <div>
                  <h3>UX em Ambientes de Realidade Virtual</h3>
                  <p>Autor: Prof. Dr. João Silva</p>
                </div>
                <div
                  className="topic-actions"
                  role="group"
                  aria-label="Ações para UX em Ambientes de Realidade Virtual"
                >
                  <button className="topic-action" type="button" disabled>
                    Editar
                  </button>
                  <button
                    className="topic-action topic-action--remove"
                    type="button"
                    disabled
                  >
                    Remover
                  </button>
                </div>
              </li>

              <li className="topic-item">
                <div>
                  <h3>Análise de Dados em Educação</h3>
                  <p>Autor: Prof. Dr. João Silva</p>
                </div>
                <div
                  className="topic-actions"
                  role="group"
                  aria-label="Ações para Análise de Dados em Educação"
                >
                  <button className="topic-action" type="button" disabled>
                    Editar
                  </button>
                  <button
                    className="topic-action topic-action--remove"
                    type="button"
                    disabled
                  >
                    Remover
                  </button>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <aside className="dashboard-card metrics-card" aria-labelledby="metrics-title">
          <div className="dashboard-card__heading metrics-card__heading">
            <div>
              <h2 id="metrics-title">Métricas de busca de temas</h2>
              <p>Visualização do interesse dos alunos.</p>
            </div>
          </div>

          <label className="period-select-label" htmlFor="metrics-period">
            Período das métricas
          </label>
          <select className="period-select" id="metrics-period">
            <option>Últimos 30 dias</option>
          </select>

          <figure className="search-chart" aria-labelledby="chart-caption">
            <figcaption id="chart-caption">
              <span>Buscas por Tópico</span>
              <span>Total: 1.2k</span>
            </figcaption>

            <ul className="chart-list">
              <li>
                <span>IA em Saúde</span>
                <span>620</span>
              </li>
              <li>
                <span>UX em Realidade Virtual</span>
                <span>410</span>
              </li>
              <li>
                <span>Dados em Educação</span>
                <span>280</span>
              </li>
            </ul>
          </figure>
        </aside>
      </div>
    </main>
  )
}

export default PainelDocente
