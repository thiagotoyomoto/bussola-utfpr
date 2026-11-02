import { useState } from 'react'
import './Candidatura.css'

function Candidatura({ onNavigate }) {
  const [submissionStatus, setSubmissionStatus] = useState('Nenhuma candidatura foi enviada.')

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmissionStatus(
      'Formulário demonstrativo validado. Nenhum dado foi enviado.',
    )
  }

  return (
    <main className="student-application" id="inicio">
      <nav className="application-breadcrumb" aria-label="Trilha de navegação">
        <button type="button" onClick={() => onNavigate('encontrar-orientacao')}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m15 18-6-6 6-6M9 12h12" />
          </svg>
          Voltar à busca
        </button>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={() => onNavigate('perfil-docente')}>
          Ana Beatriz
        </button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Candidatura</span>
      </nav>

      <header className="application-heading">
        <div>
          <h1 id="application-title">Enviar candidatura para orientação</h1>
          <p>
            Apresente sua ideia e conte à docente por que deseja desenvolver esse
            tema.
          </p>
        </div>

        <div className="application-heading__actions">
          <button
            className="return-profile-link"
            type="button"
            onClick={() => onNavigate('perfil-docente')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m15 18-6-6 6-6M9 12h12" />
            </svg>
            Voltar ao perfil
          </button>
          <span className="application-demo-badge">Dados demonstrativos</span>
        </div>
      </header>

      <div className="application-layout">
      <form
        className="application-form"
        aria-labelledby="application-title"
        onSubmit={handleSubmit}
      >
          <section className="application-section" aria-labelledby="academic-info-title">
            <div className="application-section__heading">
              <h2 id="academic-info-title">Identificação acadêmica</h2>
              <p>
                <span aria-hidden="true">*</span> Campos obrigatórios
              </p>
            </div>

            <div className="academic-fields">
              <div className="application-field">
                <label htmlFor="student-name">
                  Nome completo <span aria-hidden="true">*</span>
                </label>
                <input id="student-name" name="nome" type="text" autoComplete="name" required />
              </div>
              <div className="application-field">
                <label htmlFor="student-id">
                  Matrícula <span aria-hidden="true">*</span>
                </label>
                <input id="student-id" name="matricula" type="text" required />
              </div>
              <div className="application-field">
                <label htmlFor="student-course">
                  Curso <span aria-hidden="true">*</span>
                </label>
                <input id="student-course" name="curso" type="text" required />
              </div>
              <div className="application-field">
                <label htmlFor="student-period">
                  Período <span aria-hidden="true">*</span>
                </label>
                <input id="student-period" name="periodo" type="text" required />
              </div>
              <div className="application-field">
                <label htmlFor="student-email">
                  E-mail acadêmico <span aria-hidden="true">*</span>
                </label>
                <input id="student-email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>
          </section>

          <section className="application-section proposal-section" aria-labelledby="proposal-title">
            <h2 id="proposal-title">Sua proposta e interesses</h2>
            <div className="application-field">
              <label htmlFor="proposal-subject">
                Título provisório da proposta <span aria-hidden="true">*</span>
              </label>
              <input id="proposal-subject" name="titulo" type="text" required />
            </div>
            <div className="application-field">
              <label htmlFor="research-interests">
                Proposta e interesses de pesquisa <span aria-hidden="true">*</span>
              </label>
              <textarea id="research-interests" name="proposta" rows="3" required />
            </div>
            <div className="application-field">
              <label htmlFor="orientation-motivation">
                Motivação para a orientação <span aria-hidden="true">*</span>
              </label>
              <textarea id="orientation-motivation" name="motivacao" rows="3" required />
            </div>
          </section>

          <div className="application-consent">
            <input id="application-consent" name="consentimento" type="checkbox" required />
            <label htmlFor="application-consent">
              Revisei minha proposta e autorizo o compartilhamento destes dados
              acadêmicos com a docente para avaliação da candidatura.{' '}
              <span aria-hidden="true">*</span>
            </label>
          </div>

          <div className="application-submit-row">
            <p role="status" aria-live="polite" aria-atomic="true">
              {submissionStatus}
            </p>
            <button type="submit">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" />
              </svg>
              Validar formulário demonstrativo
            </button>
          </div>
        </form>

        <aside className="application-sidebar" aria-label="Resumo da candidatura e informações">
          <section className="application-summary" aria-labelledby="application-summary-title">
            <div className="application-summary__heading">
              <h2 id="application-summary-title">Sua candidatura</h2>
              <span>Não enviada</span>
            </div>

            <div className="application-faculty">
              <span className="application-faculty__avatar" aria-hidden="true">AB</span>
              <div>
                <h3>Ana Beatriz</h3>
                <p>Doutora em Metodologia de Pesquisa Aplicada</p>
              </div>
            </div>

            <div className="application-topic">
              <h3>Tema de TCC</h3>
              <p>Análise de Discurso em Redes Sociais</p>
              <span>Área: Metodologia de Pesquisa</span>
            </div>

            <div
              className="application-summary__badges"
              role="group"
              aria-label="Indicadores da candidatura"
            >
              <span>92% de afinidade</span>
              <span>3 vagas disponíveis</span>
            </div>

            <p className="application-affinity-note">
              Afinidade demonstrativa por tema, área, palavras-chave e métodos. Não
              indica probabilidade de aceitação.
            </p>
          </section>

          <section className="application-warning" aria-labelledby="before-submit-title">
            <h2 id="before-submit-title">Antes de enviar</h2>
            <p>
              Revise seu tema, objetivos, métodos e a adequação ao perfil docente.
              A docente pode solicitar ajustes antes de aprovar a orientação.
            </p>
          </section>
        </aside>
      </div>
    </main>
  )
}

export default Candidatura
