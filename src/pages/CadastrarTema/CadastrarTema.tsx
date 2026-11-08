import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import './CadastrarTema.css'
import type { NavigateToPage, NavigationState } from '../../types'

const audiences = [
  { value: 'sistemas', label: 'Sistemas de Informação' },
  { value: 'computacao', label: 'Engenharia de Computação' },
]

function CadastrarTema({ onNavigate }: { onNavigate: NavigateToPage }) {
  const location = useLocation()
  const routeState: NavigationState | null =
    typeof location.state === 'object' && location.state !== null
      ? location.state
      : null
  const isEditing = Boolean(routeState?.topicTitle)
  const [title, setTitle] = useState(routeState?.topicTitle ?? '')
  const [description, setDescription] = useState(routeState?.topicDescription ?? '')
  const [areas, setAreas] = useState<string[]>(routeState?.topicAreas ?? [])
  const [areaEntry, setAreaEntry] = useState('')
  const [defineTeamSize, setDefineTeamSize] = useState(false)
  const [teamMin, setTeamMin] = useState('')
  const [teamMax, setTeamMax] = useState('')
  const [defineTeamCount, setDefineTeamCount] = useState(false)
  const [teamCount, setTeamCount] = useState('')
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])
  const [status, setStatus] = useState('')

  const addArea = () => {
    const newArea = areaEntry.trim()
    if (
      newArea &&
      !areas.some((area) => area.toLocaleLowerCase('pt-BR') === newArea.toLocaleLowerCase('pt-BR'))
    ) {
      setAreas((current) => [...current, newArea])
      setAreaEntry('')
    }
  }

  const toggleAudience = (value: string) => {
    setSelectedAudiences((selected) =>
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (areas.length === 0) {
      setStatus('Adicione ao menos uma área de conhecimento.')
      document.getElementById('topic-area-entry')?.focus()
      return
    }
    if (selectedAudiences.length === 0) {
      setStatus('Selecione ao menos um curso para divulgar a proposta.')
      document.querySelector<HTMLDetailsElement>('.audience-dropdown')?.querySelector('summary')?.focus()
      return
    }
    setStatus(
      `${isEditing ? 'Alterações do tema' : 'Proposta'} validadas. A integração de envio ainda não está configurada.`,
    )
  }

  const selectedAudienceLabel =
    selectedAudiences.length === 0
      ? 'Selecionar cursos'
      : `${selectedAudiences.length} ${selectedAudiences.length === 1 ? 'curso selecionado' : 'cursos selecionados'}`

  return (
    <main className="topic-registration" id="main-content" tabIndex={-1}>
      <nav className="topic-breadcrumb" aria-label="Trilha de navegação">
        <button type="button" onClick={() => onNavigate('docentes')}>Painel docente</button>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{isEditing ? 'Editar tema' : 'Adicionar tema'}</span>
      </nav>

      <header className="topic-page-heading">
        <h1 id="topic-page-title">{isEditing ? 'Editar tema de TCC' : 'Adicionar tema de TCC'}</h1>
        <p>Apresente sua proposta de pesquisa e encontre estudantes para desenvolver o TCC.</p>
      </header>

      <div className="topic-registration__layout">
        <form className="topic-form" aria-labelledby="topic-page-title" onSubmit={handleSubmit}>
          <p className="topic-form__required-note">
            Campos com <span aria-hidden="true">*</span> são obrigatórios. A descrição é opcional.
          </p>

          <fieldset className="topic-form__section">
            <legend><span className="topic-step" aria-hidden="true">1</span> Dados do docente</legend>
            <div className="topic-teacher-fields">
              <div className="topic-field">
                <label htmlFor="topic-teacher-name">Nome do docente</label>
                <input id="topic-teacher-name" name="docente" value="Prof. Dr. João Silva" readOnly />
              </div>
              <div className="topic-field">
                <label htmlFor="topic-email">E-mail institucional</label>
                <input id="topic-email" name="email" type="email" value="joao.silva@universidade.edu.br" readOnly />
              </div>
              <div className="topic-field">
                <label htmlFor="topic-department">Departamento</label>
                <input id="topic-department" name="departamento" value="DAINF" readOnly />
              </div>
            </div>
          </fieldset>

          <fieldset className="topic-form__section topic-form__section--details">
            <legend><span className="topic-step" aria-hidden="true">2</span> Detalhes do tema</legend>
            <div className="topic-field">
              <label htmlFor="topic-title">Tema / provável título <span aria-hidden="true">*</span></label>
              <input
                id="topic-title"
                name="titulo"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <fieldset className="topic-area-group">
              <legend>Áreas de conhecimento <span aria-hidden="true">*</span></legend>
              <p className="topic-field__hint" id="topic-areas-hint">
                Digite uma área por vez e adicione quantas forem necessárias.
              </p>
              <div className="topic-custom-area__entry">
                <input
                  id="topic-area-entry"
                  aria-label="Nova área de conhecimento"
                  placeholder="Ex.: Inteligência Artificial"
                  value={areaEntry}
                  onChange={(event) => setAreaEntry(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addArea()
                    }
                  }}
                />
                <button className="topic-add-area" type="button" onClick={addArea}>
                  Adicionar área
                </button>
              </div>
              <ul className="topic-area-tags" aria-label="Áreas adicionadas">
                {areas.map((area) => (
                  <li className="topic-area-tag" key={area}>
                    <span>{area}</span>
                    <button
                      type="button"
                      aria-label={`Remover área ${area}`}
                      onClick={() => setAreas((current) => current.filter((item) => item !== area))}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </li>
                ))}
              </ul>
              {areas.length === 0 && (
                <p className="topic-field__hint">Adicione ao menos uma área de conhecimento.</p>
              )}
            </fieldset>

            <div className="topic-field">
              <label htmlFor="topic-description">Descrição – opcional</label>
              <textarea
                id="topic-description"
                name="descricao"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descreva o problema, objetivos e resultados esperados."
              />
            </div>
          </fieldset>

          <fieldset className="topic-form__section topic-form__section--publishing">
            <legend><span className="topic-step" aria-hidden="true">3</span> Vagas e divulgação</legend>
            <fieldset className="topic-radio-group">
              <legend>Definir número de vagas?</legend>
              <label>
                <input
                  type="radio"
                  name="define-team-size"
                  checked={defineTeamSize}
                  onChange={() => setDefineTeamSize(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="define-team-size"
                  checked={!defineTeamSize}
                  onChange={() => setDefineTeamSize(false)}
                />
                Não, manter negociável
              </label>
            </fieldset>

            {defineTeamSize && (
              <div className="team-size-fields">
                <div className="topic-field">
                  <label htmlFor="team-min">Tamanho da equipe — mín. (opcional)</label>
                  <input
                    id="team-min"
                    type="number"
                    min="1"
                    value={teamMin}
                    onChange={(event) => setTeamMin(event.target.value)}
                  />
                </div>
                <div className="topic-field">
                  <label htmlFor="team-max">Tamanho da equipe — máx.</label>
                  <input
                    id="team-max"
                    type="number"
                    min={teamMin || 1}
                    required
                    value={teamMax}
                    onChange={(event) => setTeamMax(event.target.value)}
                  />
                </div>
              </div>
            )}

            {defineTeamSize && (
              <fieldset className="topic-radio-group">
                <legend>Definir quantidade de equipes?</legend>
                <label>
                  <input
                    type="radio"
                    name="define-team-count"
                    checked={defineTeamCount}
                    onChange={() => setDefineTeamCount(true)}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="define-team-count"
                    checked={!defineTeamCount}
                    onChange={() => setDefineTeamCount(false)}
                  />
                  Não, manter negociável
                </label>
              </fieldset>
            )}

            {defineTeamSize && defineTeamCount && (
              <div className="topic-field">
                <label htmlFor="team-count">Quantidade de equipes (máximo 30)</label>
                <input
                  id="team-count"
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={teamCount}
                  onChange={(event) => setTeamCount(event.target.value)}
                />
              </div>
            )}

            <div className="topic-field">
              <span className="topic-field__label">Anunciar esta proposta para</span>
              <details className="audience-dropdown">
                <summary>{selectedAudienceLabel}</summary>
                <div className="audience-dropdown__options">
                  {audiences.map((audience) => (
                    <label key={audience.value}>
                      <input
                        type="checkbox"
                        checked={selectedAudiences.includes(audience.value)}
                        onChange={() => toggleAudience(audience.value)}
                      />
                      {audience.label}
                    </label>
                  ))}
                </div>
              </details>
            </div>
          </fieldset>

          <div className="topic-form__footer">
            <p>Revise os dados antes de anunciar sua proposta.</p>
            <div className="topic-form__actions">
              <button
                className="topic-button topic-button--secondary"
                type="button"
                onClick={() => onNavigate('docentes')}
              >
                Cancelar
              </button>
              <button className="topic-button topic-button--primary" type="submit">
                {isEditing ? 'Salvar alterações' : 'Anunciar proposta'}
              </button>
            </div>
            <p className="topic-submit-status" role="status" aria-live="polite">{status}</p>
          </div>
        </form>

        <aside className="topic-registration__sidebar" aria-label="Orientações para publicar o tema">
          <section className="topic-info-card" aria-labelledby="topic-before-title">
            <h2 id="topic-before-title">Antes de anunciar</h2>
            <h3>Defina um título claro</h3>
            <p>Indique o problema ou oportunidade que o trabalho pretende investigar.</p>
            <h3>Escolha as áreas</h3>
            <p>As áreas de conhecimento ajudam estudantes a encontrar sua proposta.</p>
            <h3>Confira o público</h3>
            <p>Selecione os cursos que poderão visualizar o tema.</p>
          </section>
          <section className="topic-info-card topic-info-card--note">
            <h2>Divulgação do tema</h2>
            <p>O cadastro do tema não confirma uma orientação.</p>
          </section>
        </aside>
      </div>
    </main>
  )
}

export default CadastrarTema
