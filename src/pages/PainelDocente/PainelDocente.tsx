import { useEffect, useRef, useState } from 'react'
import './PainelDocente.css'
import type { NavigateToPage } from '../../types'
import { getTeacherAvailability, setTeacherAvailability } from '../../data/teacherAvailability'

const topics = [
  {
    id: 'ia-acessibilidade',
    title: 'Inteligência Artificial em Saúde',
    description: 'Uso de inteligência artificial para apoiar a acessibilidade no ensino superior.',
    areas: ['Inteligência Artificial', 'Interação Humano-Computador'],
  },
  {
    id: 'ux-vr',
    title: 'UX em Ambientes de Realidade Virtual',
    description: 'Pesquisa de experiência do usuário em ambientes imersivos.',
    areas: ['Interação Humano-Computador', 'Realidade Virtual'],
  },
  {
    id: 'dados-educacao',
    title: 'Análise de Dados em Educação',
    description: 'Análise de dados acadêmicos para compreensão de contextos educacionais.',
    areas: ['Ciência de Dados', 'Educação'],
  },
]

function PainelDocente({ onNavigate }: { onNavigate: NavigateToPage }) {
  const [visibleTopics, setVisibleTopics] = useState(topics)
  const [savedAvailability, setSavedAvailability] = useState(getTeacherAvailability)
  const [available, setAvailable] = useState(savedAvailability)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [confirmRemoval, setConfirmRemoval] = useState(false)
  const [status, setStatus] = useState('')
  const removeDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (confirmRemoval && removeDialogRef.current && !removeDialogRef.current.open) {
      removeDialogRef.current.showModal()
    }
  }, [confirmRemoval])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((selected) =>
      selected.includes(topicId)
        ? selected.filter((id) => id !== topicId)
        : [...selected, topicId],
    )
    setStatus('')
  }

  const saveAvailability = () => {
    try {
      setTeacherAvailability(available)
      setSavedAvailability(available)
      setStatus(`Disponibilidade salva: ${available ? 'Sim' : 'Não'}.`)
    } catch (error) {
      if (!(error instanceof DOMException)) throw error
      setStatus('Não foi possível salvar a disponibilidade. Tente novamente.')
    }
  }

  const removeSelectedTopics = () => {
    setStatus(
      `${selectedTopics.length} ${selectedTopics.length === 1 ? 'tema removido' : 'temas removidos'}.`,
    )
    setVisibleTopics((current) =>
      current.filter((topic) => !selectedTopics.includes(topic.id)),
    )
    setSelectedTopics([])
    setConfirmRemoval(false)
  }

  return (
    <main className="docentes-dashboard" id="main-content" tabIndex={-1}>
      <header className="docentes-heading">
        <div>
          <h1 id="dashboard-title">Painel docente</h1>
          <p>Gerencie sua disponibilidade para orientação, temas de TCC e métricas.</p>
        </div>
      </header>

      <div className="docentes-layout">
        <div className="docentes-main-column">
          <section className="dashboard-card availability-card" aria-labelledby="availability-title">
            <div className="dashboard-card__heading">
              <div>
                <h2 id="availability-title">Disponibilidade para orientação de TCC</h2>
                <p id="availability-help">Informe se está disponível para receber novas orientações.</p>
              </div>
            </div>
            <fieldset className="availability-choice">
              <legend>Disponível para orientação?</legend>
              <label>
                <input
                  type="radio"
                  name="availability"
                  checked={available}
                  onChange={() => {
                    setAvailable(true)
                    setStatus('')
                  }}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="availability"
                  checked={!available}
                  onChange={() => {
                    setAvailable(false)
                    setStatus('')
                  }}
                />
                Não
              </label>
            </fieldset>
            <button
              className="dashboard-button dashboard-button--primary availability-save"
              type="button"
              aria-describedby="availability-help"
              disabled={available === savedAvailability}
              onClick={saveAvailability}
            >
              Salvar
            </button>
            <p className="dashboard-status" role="status" aria-live="polite">{status}</p>
          </section>

          <section className="dashboard-card topics-card" aria-labelledby="topics-title">
            <div className="dashboard-card__heading">
              <div>
                <h2 id="topics-title">Temas de TCC</h2>
                <p>Selecione temas para edição ou remoção.</p>
              </div>
              <div className="topic-toolbar">
                <button
                  className="dashboard-button dashboard-button--danger"
                  type="button"
                  disabled={selectedTopics.length === 0}
                  onClick={() => setConfirmRemoval(true)}
                >
                  Remover selecionados ({selectedTopics.length})
                </button>
                <button
                  className="dashboard-button dashboard-button--primary"
                  type="button"
                  onClick={() => onNavigate('cadastrar-tema')}
                >
                  Adicionar tema
                </button>
              </div>
            </div>

            <ul className="topic-list" aria-label="Temas de TCC propostos">
              {visibleTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id)
                return (
                  <li className="topic-item" key={topic.id}>
                    <label className="topic-select">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTopic(topic.id)}
                        aria-label={`Selecionar ${topic.title}`}
                      />
                    </label>
                    <div className="topic-item__details">
                      <h3>{topic.title}</h3>
                      <p>{topic.description}</p>
                      <ul className="topic-area-tags" aria-label={`Áreas de ${topic.title}`}>
                        {topic.areas.map((area) => <li key={area}>{area}</li>)}
                      </ul>
                    </div>
                    <div className="topic-actions">
                      <button
                        className="topic-action"
                        type="button"
                        onClick={() =>
                          onNavigate('cadastrar-tema', {
                            topicTitle: topic.title,
                            topicDescription: topic.description,
                            topicAreas: topic.areas,
                          })
                        }
                      >
                        Editar
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            {confirmRemoval && (
                <dialog
                  ref={removeDialogRef}
                  className="topic-confirm-dialog"
                  aria-labelledby="remove-topics-title"
                  aria-describedby="remove-topics-description"
                  onCancel={(event) => {
                    event.preventDefault()
                    setConfirmRemoval(false)
                  }}
                >
                  <h2 id="remove-topics-title">Remover temas selecionados?</h2>
                  <p id="remove-topics-description">
                    Esta ação removerá {selectedTopics.length}{' '}
                    {selectedTopics.length === 1 ? 'tema' : 'temas'} da lista.
                    Você pode cancelar e manter os temas.
                  </p>
                  <div className="topic-confirm-actions">
                    <button type="button" onClick={() => setConfirmRemoval(false)}>
                      Cancelar
                    </button>
                    <button type="button" onClick={removeSelectedTopics}>
                      Confirmar remoção
                    </button>
                  </div>
                </dialog>
            )}
          </section>
        </div>

        <aside className="dashboard-card metrics-card" aria-labelledby="metrics-title">
          <div className="dashboard-card__heading metrics-card__heading">
            <div>
              <h2 id="metrics-title">Métricas de busca de temas</h2>
              <p>Visão geral do interesse dos alunos.</p>
            </div>
          </div>
          <label className="period-select-label" htmlFor="metrics-period">Período das métricas</label>
          <select className="period-select" id="metrics-period">
            <option>Últimos 30 dias</option>
          </select>
          <figure className="search-chart" aria-labelledby="chart-caption">
            <figcaption id="chart-caption">
              <span>Buscas por tópico</span><span>Total: 1.2k</span>
            </figcaption>
            <ul className="chart-list">
              <li><span>IA em Saúde</span><span>620</span></li>
              <li><span>UX em Realidade Virtual</span><span>410</span></li>
              <li><span>Dados em Educação</span><span>280</span></li>
            </ul>
          </figure>
        </aside>
      </div>
    </main>
  )
}

export default PainelDocente
