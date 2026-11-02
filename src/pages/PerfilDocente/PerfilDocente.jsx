import './PerfilDocente.css'

function PerfilDocente({ profile, onNavigate }) {
  const isStudent = profile === 'student'

  return (
    <main className="student-profile" id="inicio">
      <section className="profile-shell" aria-labelledby="profile-page-title">
        <header className="profile-page-heading">
          <div className="profile-page-heading__identity">
            <img src="/bussola.png" alt="" aria-hidden="true" />
            <div>
              <h1 id="profile-page-title">Perfil docente e temas de TCC</h1>
              <p>
                {isStudent
                  ? 'Conheça a docente e escolha um tema de TCC para sua candidatura.'
                  : 'Conheça a docente, sua área de pesquisa e os temas de orientação.'}
              </p>
            </div>
          </div>

          <nav className="profile-page-actions" aria-label="Ações do perfil">
            <button type="button" onClick={() => onNavigate('encontrar-orientacao')}>
              Voltar à busca
            </button>
            <button type="button" onClick={() => onNavigate('grafo')}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="5" r="2.5" />
                <circle cx="6" cy="18" r="2.5" />
                <circle cx="18" cy="18" r="2.5" />
                <path d="M12 7.5v4m0 0-6 4m6-4 6 4M6 15.5v-4h12v4" />
              </svg>
              Explorar grafo
            </button>
            <span className="profile-demo-badge">Dados demonstrativos</span>
          </nav>
        </header>

        <div className="profile-content">
          <aside className="faculty-profile-card" aria-labelledby="faculty-name">
            <div className="faculty-identity">
              <span className="faculty-avatar" aria-hidden="true">AB</span>
              <div>
                <h2 id="faculty-name">Ana Beatriz</h2>
                <p>Docente · orientação de TCC</p>
              </div>
            </div>

            <p className="faculty-degree">Doutora em Metodologia de Pesquisa Aplicada</p>

            <section className="availability-callout" aria-label="Disponibilidade para orientação">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              <div>
                <h3>3 vagas disponíveis</h3>
                <p>Disponibilidade demonstrativa, sujeita à confirmação da docente.</p>
              </div>
            </section>

            <section className="faculty-research-area" aria-labelledby="faculty-area-title">
              <h3 id="faculty-area-title">Área de pesquisa</h3>
              <p>Metodologia de Pesquisa</p>
            </section>

            <section className="faculty-about" aria-labelledby="faculty-about-title">
              <h3 id="faculty-about-title">Sobre a orientação</h3>
              <p>
                Investiga formas de compreender fenômenos sociais e digitais a partir
                de abordagens qualitativas. Acompanha projetos da definição do problema
                à análise e interpretação dos dados.
              </p>
            </section>

            <section className="faculty-methods" aria-labelledby="faculty-methods-title">
              <h3 id="faculty-methods-title">Métodos e especialidades</h3>
              <ul aria-label="Métodos e especialidades da docente">
                <li>Métodos qualitativos</li>
                <li>Análise de discurso</li>
                <li>Pesquisa-ação</li>
              </ul>
            </section>

            <p className="faculty-disclaimer">Perfil e informações de pesquisa apresentados apenas para demonstração.</p>
          </aside>

          <div className="profile-main-content">
            <section className="affinity-overview" aria-labelledby="affinity-overview-title">
              <div className="affinity-overview__summary">
                <span className="affinity-overview__score">
                  92% <span className="sr-only">de afinidade alta</span>
                </span>
                <div>
                  <h2 id="affinity-overview-title">
                    {isStudent
                      ? 'Afinidade alta com os seus interesses'
                      : 'Afinidade alta com o tema selecionado'}
                  </h2>
                  <p>
                    A correspondência considera 4 critérios da busca: tema, área,
                    palavras-chave e métodos. É um indicador de alinhamento temático,
                    não uma probabilidade de aceitação.
                  </p>
                </div>
              </div>

              <dl className="affinity-criteria-grid">
                <div>
                  <dt>Tema</dt>
                  <dd>Discurso em redes sociais</dd>
                </div>
                <div>
                  <dt>Área</dt>
                  <dd>Metodologia de Pesquisa</dd>
                </div>
                <div>
                  <dt>Palavras-chave</dt>
                  <dd>Redes sociais e narrativas</dd>
                </div>
                <div>
                  <dt>Métodos</dt>
                  <dd>Qualitativos e discurso</dd>
                </div>
              </dl>
            </section>

            <section className="thesis-topics-section" aria-labelledby="thesis-topics-title">
              <header className="thesis-topics-heading">
                <h2 id="thesis-topics-title">Temas de TCC</h2>
                <p>
                  {isStudent
                    ? '3 temas · escolha o que deseja desenvolver'
                    : '3 temas de orientação disponíveis'}
                </p>
              </header>

              <ul className="faculty-thesis-topics">
                <li>
                  <article className="faculty-thesis-topic">
                    <div className="faculty-thesis-topic__content">
                      <h3>Análise de Discurso em Redes Sociais</h3>
                      <p>
                        Investigue como narrativas, identidades e sentidos são
                        construídos em publicações e interações nas redes sociais.
                      </p>
                      <ul className="topic-keywords" aria-label="Palavras-chave do tema">
                        <li>Análise de discurso</li>
                        <li>Redes sociais · Narrativas digitais</li>
                      </ul>
                    </div>
                    {isStudent && (
                      <button
                        type="button"
                        aria-label="Candidatar-se ao tema Análise de Discurso em Redes Sociais"
                        onClick={() => onNavigate('candidatura')}
                      >
                        Candidatar-se neste tema
                      </button>
                    )}
                  </article>
                </li>

                <li>
                  <article className="faculty-thesis-topic">
                    <div className="faculty-thesis-topic__content">
                      <h3>Metodologia de Pesquisa Qualitativa</h3>
                      <p>
                        Explore estratégias de coleta e interpretação de dados para
                        compreender experiências e contextos sociais.
                      </p>
                      <ul className="topic-keywords" aria-label="Palavras-chave do tema">
                        <li>Métodos qualitativos</li>
                        <li>Entrevistas · Pesquisa-ação</li>
                      </ul>
                    </div>
                    {isStudent && (
                      <button
                        type="button"
                        aria-label="Candidatar-se ao tema Metodologia de Pesquisa Qualitativa"
                        onClick={() => onNavigate('candidatura')}
                      >
                        Candidatar-se neste tema
                      </button>
                    )}
                  </article>
                </li>

                <li>
                  <article className="faculty-thesis-topic">
                    <div className="faculty-thesis-topic__content">
                      <h3>Etnografia Digital</h3>
                      <p>
                        Estude práticas e culturas de comunidades on-line com observação
                        participante e registro de campo digital.
                      </p>
                      <ul className="topic-keywords" aria-label="Palavras-chave do tema">
                        <li>Observação participante</li>
                        <li>Comunidades on-line · Cultura digital</li>
                      </ul>
                    </div>
                    {isStudent && (
                      <button
                        type="button"
                        aria-label="Candidatar-se ao tema Etnografia Digital"
                        onClick={() => onNavigate('candidatura')}
                      >
                        Candidatar-se neste tema
                      </button>
                    )}
                  </article>
                </li>
              </ul>
              {isStudent && (
                <p className="application-notice">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 11v5m0-8h.01" />
                  </svg>
                  A candidatura será avaliada pela docente. Tema e disponibilidade
                  devem ser confirmados antes da orientação.
                </p>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PerfilDocente
