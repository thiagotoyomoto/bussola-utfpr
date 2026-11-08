import { useState } from 'react'
import './PerfilDocente.css'
import type { NavigateToPage, UserProfile } from '../../types'
import { getTeacherAvailability } from '../../data/teacherAvailability'

const thesisTopics = [
  {
    title: 'Análise de Discurso em Redes Sociais',
    description:
      'Investigue como narrativas, identidades e sentidos são construídos em publicações e interações nas redes sociais.',
    area: 'Metodologia de Pesquisa',
    keywords: ['Análise de discurso', 'Redes sociais', 'Narrativas digitais'],
    team: 'Tamanho de equipe negociável',
    audience: 'Sistemas de Informação e Engenharia de Computação',
  },
  {
    title: 'Metodologia de Pesquisa Qualitativa',
    description:
      'Explore estratégias de coleta e interpretação de dados para compreender experiências e contextos sociais.',
    area: 'Metodologia de Pesquisa',
    keywords: ['Métodos qualitativos', 'Entrevistas', 'Pesquisa-ação'],
    team: 'Tamanho de equipe negociável',
    audience: 'Sistemas de Informação',
  },
  {
    title: 'Etnografia Digital',
    description:
      'Estude práticas e culturas de comunidades on-line com observação participante e registro de campo digital.',
    area: 'Pesquisa Digital',
    keywords: ['Observação participante', 'Comunidades on-line', 'Cultura digital'],
    team: 'Tamanho de equipe negociável',
    audience: 'Engenharia de Computação',
  },
]

function PerfilDocente({
  profile,
  onNavigate,
}: {
  profile: UserProfile
  onNavigate: NavigateToPage
}) {
  const isStudent = profile === 'student'
  const [availableForTcc] = useState(getTeacherAvailability)
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])

  const toggleTopicDescription = (title: string) => {
    setExpandedTopics((expanded) =>
      expanded.includes(title)
        ? expanded.filter((topicTitle) => topicTitle !== title)
        : [...expanded, title],
    )
  }

  return (
    <main className="student-profile" id="main-content" tabIndex={-1}>
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
                <h3>Disponível para orientação de TCC: {availableForTcc ? 'Sim' : 'Não'}</h3>
                <p>Estado de disponibilidade informado pela docente.</p>
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
                <div>
                  <h2 id="thesis-topics-title">Temas de TCC</h2>
                  <p>
                    {isStudent
                      ? `${thesisTopics.length} temas · escolha o que deseja desenvolver`
                      : `${thesisTopics.length} temas de orientação disponíveis`}
                  </p>
                </div>
                {isStudent && (
                  <button
                    className="new-topic-application"
                    type="button"
                    onClick={() => onNavigate('candidatura')}
                  >
                    Enviar candidatura para um novo tema
                  </button>
                )}
              </header>

              <ul className="faculty-thesis-topics">
                {thesisTopics.map((topic) => (
                  <li key={topic.title}>
                    <article className="faculty-thesis-topic">
                      <div className="faculty-thesis-topic__content">
                        <h3>{topic.title}</h3>
                        {!expandedTopics.includes(topic.title) && (
                          <p className="faculty-topic-summary">
                            {topic.description.slice(0, 100)}…
                          </p>
                        )}
                        <button
                          className="faculty-topic-toggle"
                          type="button"
                          aria-expanded={expandedTopics.includes(topic.title)}
                          aria-controls={`topic-description-${topic.title.replaceAll(' ', '-')}`}
                          onClick={() => toggleTopicDescription(topic.title)}
                        >
                          {expandedTopics.includes(topic.title) ? 'Ver menos' : 'Ver mais'}
                        </button>
                        {expandedTopics.includes(topic.title) && (
                          <div
                            className="faculty-topic-details"
                            id={`topic-description-${topic.title.replaceAll(' ', '-')}`}
                          >
                          <p>{topic.description}</p>
                          <dl>
                            <div><dt>Área de conhecimento</dt><dd>{topic.area}</dd></div>
                            <div><dt>Equipe</dt><dd>{topic.team}</dd></div>
                            <div><dt>Divulgação</dt><dd>{topic.audience}</dd></div>
                          </dl>
                          </div>
                        )}
                        <ul className="topic-keywords" aria-label="Palavras-chave do tema">
                          {topic.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
                        </ul>
                      </div>
                      {isStudent && (
                        <button
                          type="button"
                          aria-label={`Candidatar-se ao tema ${topic.title}`}
                          onClick={() =>
                            onNavigate('candidatura', { topicTitle: topic.title })
                          }
                        >
                          Candidatar-se neste tema
                        </button>
                      )}
                    </article>
                  </li>
                ))}
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
