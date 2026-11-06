import { useState } from 'react'
import './CadastrarTema.css'

const initialForm = {
  teacherName: 'Prof. Dr. João Silva',
  email: 'joao.silva@universidade.edu.br',
  department: 'dainf',
  departmentOther: '',
  title: 'Inteligência Artificial para apoiar a acessibilidade no ensino superior',
  areas: ['ia', 'ihc'],
  customArea: '',
  description: '',
  vacancies: '2',
  audience: 'ambos',
}

const researchAreas = [
  { id: 'ia', label: 'Inteligência Artificial' },
  { id: 'software', label: 'Engenharia de Software' },
  { id: 'dados', label: 'Ciência de Dados' },
  { id: 'ihc', label: 'Interação Humano-Computador' },
  { id: 'redes', label: 'Redes de Computadores' },
  { id: 'seguranca', label: 'Segurança da Informação' },
]

const validateForm = (form) => {
  const errors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const vacancyCount = Number(form.vacancies)

  if (!form.teacherName.trim()) {
    errors.teacherName = 'Informe o nome do docente.'
  }
  if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Informe um e-mail válido, como nome@universidade.edu.br.'
  }
  if (!form.department) {
    errors.department = 'Selecione um departamento.'
  }
  if (form.department === 'outro' && !form.departmentOther.trim()) {
    errors.departmentOther = 'Informe o nome do departamento.'
  }
  if (!form.title.trim()) {
    errors.title = 'Informe o título ou tema provável.'
  }
  if (form.areas.length === 0 && form.customAreas.length === 0) {
    errors.areas = 'Selecione ou adicione ao menos uma área de conhecimento.'
  }
  if (!Number.isInteger(vacancyCount) || vacancyCount < 1) {
    errors.vacancies = 'Informe um número inteiro maior ou igual a 1.'
  }
  if (!form.audience) {
    errors.audience = 'Escolha para quais cursos a proposta será anunciada.'
  }

  return errors
}

function CadastrarTema({ onNavigate }) {
  const [form, setForm] = useState(initialForm)
  const [customAreas, setCustomAreas] = useState([
    'Tecnologia Assistiva',
    'Acessibilidade Digital',
  ])
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState('')
  const errors = validateForm({ ...form, customAreas })

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setSubmissionStatus('')
  }

  const showError = (field) =>
    Boolean(errors[field] && (submitted || touched[field]))

  const markTouched = (field) =>
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }))

  const handleAreaChange = (areaId, isChecked) => {
    setForm((currentForm) => ({
      ...currentForm,
      areas: isChecked
        ? [...currentForm.areas, areaId]
        : currentForm.areas.filter((area) => area !== areaId),
    }))
    setSubmissionStatus('')
  }

  const addCustomArea = () => {
    const area = form.customArea.trim()

    if (!area) {
      return
    }

    const alreadyAdded = customAreas.some(
      (existingArea) => existingArea.toLocaleLowerCase('pt-BR') === area.toLocaleLowerCase('pt-BR'),
    )
    if (!alreadyAdded) {
      setCustomAreas((currentAreas) => [...currentAreas, area])
    }
    updateField('customArea', '')
  }

  const removeCustomArea = (areaToRemove) => {
    setCustomAreas((currentAreas) =>
      currentAreas.filter((area) => area !== areaToRemove),
    )
    setSubmissionStatus('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setSubmissionStatus('')

    const validationErrors = validateForm({ ...form, customAreas })
    if (Object.keys(validationErrors).length > 0) {
      const firstInvalidField = [
        ['teacherName', 'topic-teacherName'],
        ['email', 'topic-email'],
        ['department', 'topic-department'],
        ['departmentOther', 'topic-departmentOther'],
        ['title', 'topic-title'],
        ['areas', 'topic-area-ia'],
        ['vacancies', 'topic-vacancies'],
        ['audience', 'topic-audience-sistemas'],
      ].find(([field]) => validationErrors[field])

      if (firstInvalidField) document.getElementById(firstInvalidField[1])?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      setSubmissionStatus(
        'Proposta validada. Nenhum dado foi enviado nesta demonstração.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => onNavigate('docentes')

  return (
    <main className="topic-registration" id="inicio">
      <nav className="topic-breadcrumb" aria-label="Trilha de navegação">
        <button type="button" onClick={handleCancel}>Painel docente</button>
        <span aria-hidden="true">›</span>
        <button type="button" onClick={handleCancel}>Temas de TCC</button>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Cadastrar tema</span>
      </nav>

      <header className="topic-page-heading">
        <h1 id="topic-page-title">Cadastro de Temas de TCC</h1>
        <p>Apresente sua proposta de pesquisa e encontre estudantes para desenvolver o TCC.</p>
      </header>

      <div className="topic-registration__layout">
        <form
          className="topic-form"
          aria-labelledby="topic-page-title"
          noValidate
          onSubmit={handleSubmit}
        >
          <p className="topic-form__required-note">
            Campos com <span aria-hidden="true">*</span> são obrigatórios. A descrição é opcional.
          </p>

          <fieldset className="topic-form__section">
            <legend>
              <span className="topic-step" aria-hidden="true">1</span>
              <span>Dados do Docente</span>
            </legend>

            <div className="topic-teacher-fields">
              <div className="topic-field">
                <label htmlFor="topic-teacherName">Nome do Docente <span aria-hidden="true">*</span></label>
                <input
                  autoComplete="name"
                  id="topic-teacherName"
                  name="nome-docente"
                  required
                  aria-required="true"
                  aria-invalid={showError('teacherName') || undefined}
                  aria-describedby={showError('teacherName') ? 'topic-teacherName-error' : undefined}
                  value={form.teacherName}
                  onChange={(event) => updateField('teacherName', event.target.value)}
                  onBlur={() => markTouched('teacherName')}
                />
                <p className="topic-field__error" id="topic-teacherName-error">
                  {showError('teacherName') ? errors.teacherName : ''}
                </p>
              </div>

              <div className="topic-field">
                <label htmlFor="topic-email">E-mail Institucional <span aria-hidden="true">*</span></label>
                <input
                  autoComplete="email"
                  id="topic-email"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={showError('email') || undefined}
                  aria-describedby={showError('email') ? 'topic-email-error' : undefined}
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  onBlur={() => markTouched('email')}
                />
                <p className="topic-field__error" id="topic-email-error">
                  {showError('email') ? errors.email : ''}
                </p>
              </div>

              <div className="topic-field">
                <label htmlFor="topic-department">Departamento <span aria-hidden="true">*</span></label>
                <select
                  id="topic-department"
                  name="departamento"
                  required
                  aria-required="true"
                  aria-invalid={showError('department') || undefined}
                  aria-describedby={showError('department') ? 'topic-department-error' : undefined}
                  value={form.department}
                  onChange={(event) => updateField('department', event.target.value)}
                  onBlur={() => markTouched('department')}
                >
                  <option value="">Selecione o departamento</option>
                  <option value="dainf">DAINF</option>
                  <option value="outro">Outro</option>
                </select>
                <p className="topic-field__error" id="topic-department-error">
                  {showError('department') ? errors.department : ''}
                </p>
              </div>
              {form.department === 'outro' && (
                <div className="topic-field topic-field--wide">
                  <label htmlFor="topic-departmentOther">Nome do Departamento <span aria-hidden="true">*</span></label>
                  <input
                    id="topic-departmentOther"
                    name="outro-departamento"
                    required
                    aria-required="true"
                    aria-invalid={showError('departmentOther') || undefined}
                    aria-describedby={showError('departmentOther') ? 'topic-departmentOther-error' : undefined}
                    value={form.departmentOther}
                    onChange={(event) => updateField('departmentOther', event.target.value)}
                    onBlur={() => markTouched('departmentOther')}
                  />
                  <p className="topic-field__error" id="topic-departmentOther-error">
                    {showError('departmentOther') ? errors.departmentOther : ''}
                  </p>
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="topic-form__section topic-form__section--details">
            <legend>
              <span className="topic-step" aria-hidden="true">2</span>
              <span>Detalhes do Tema</span>
            </legend>

            <div className="topic-field">
              <label htmlFor="topic-title">Tema / Provável Título <span aria-hidden="true">*</span></label>
              <input
                id="topic-title"
                name="titulo"
                required
                aria-required="true"
                aria-invalid={showError('title') || undefined}
                aria-describedby={showError('title') ? 'topic-title-error' : undefined}
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                onBlur={() => markTouched('title')}
              />
              <p className="topic-field__error" id="topic-title-error">
                {showError('title') ? errors.title : ''}
              </p>
            </div>

            <fieldset
              className="topic-area-group"
              aria-describedby={showError('areas') ? 'topic-areas-error' : 'topic-areas-hint'}
              aria-required="true"
            >
              <legend>Áreas de Conhecimento da Computação <span aria-hidden="true">*</span></legend>
              <p className="topic-field__hint" id="topic-areas-hint">
                Selecione uma ou mais áreas relacionadas à proposta.
              </p>
              <div className="topic-area-grid">
                {researchAreas.map((area) => (
                  <label className="topic-choice" key={area.id} htmlFor={`topic-area-${area.id}`}>
                    <input
                      id={`topic-area-${area.id}`}
                      name="areas"
                      type="checkbox"
                      value={area.id}
                      checked={form.areas.includes(area.id)}
                      aria-invalid={showError('areas') || undefined}
                      onChange={(event) => handleAreaChange(area.id, event.target.checked)}
                      onBlur={() => markTouched('areas')}
                    />
                    <span>{area.label}</span>
                  </label>
                ))}
              </div>
              <p className="topic-field__error" id="topic-areas-error">
                {showError('areas') ? errors.areas : ''}
              </p>
            </fieldset>

            <div className="topic-field topic-custom-area">
              <label htmlFor="topic-customArea">Outros (Inserções Múltiplas)</label>
              <span className="topic-field__label">Adicionar outra área de conhecimento</span>
              <div className="topic-custom-area__entry">
                <input
                  id="topic-customArea"
                  name="area-personalizada"
                  placeholder="Ex.: Computação afetiva"
                  value={form.customArea}
                  onChange={(event) => updateField('customArea', event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addCustomArea()
                    }
                  }}
                />
                <button
                  className="topic-add-area"
                  type="button"
                  aria-label="Adicionar área de conhecimento personalizada"
                  onClick={addCustomArea}
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
              <p className="topic-field__hint">Adicione uma área por vez. Use + ou Enter para incluir outros termos.</p>
              <ul className="topic-area-tags" aria-label="Áreas personalizadas adicionadas">
                {customAreas.map((area) => (
                  <li className="topic-area-tag" key={area}>
                    <span>{area}</span>
                    <button
                      type="button"
                      aria-label={`Remover área ${area}`}
                      onClick={() => removeCustomArea(area)}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {customAreas.length} {customAreas.length === 1 ? 'área personalizada adicionada' : 'áreas personalizadas adicionadas'}.
              </p>
            </div>

            <div className="topic-field">
              <label htmlFor="topic-description">Descrição – opcional</label>
              <textarea
                id="topic-description"
                name="descricao"
                rows="3"
                placeholder="Descreva o problema de pesquisa, os objetivos e os resultados esperados para o TCC."
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
            </div>
          </fieldset>

          <fieldset className="topic-form__section topic-form__section--publishing">
            <legend>
              <span className="topic-step" aria-hidden="true">3</span>
              <span>Vagas e Divulgação</span>
            </legend>
            <div className="topic-publishing-fields">
              <div className="topic-field topic-vacancies">
                <label htmlFor="topic-vacancies">Número de Vagas / Tamanho da Equipe <span aria-hidden="true">*</span></label>
                <input
                  id="topic-vacancies"
                  name="vagas"
                  type="number"
                  min="1"
                  step="1"
                  required
                  aria-required="true"
                  aria-invalid={showError('vacancies') || undefined}
                  aria-describedby={showError('vacancies') ? 'topic-vacancies-error' : 'topic-vacancies-hint'}
                  value={form.vacancies}
                  onChange={(event) => updateField('vacancies', event.target.value)}
                  onBlur={() => markTouched('vacancies')}
                />
                <p className="topic-field__hint" id="topic-vacancies-hint">
                  Número de estudantes que poderão participar desta proposta.
                </p>
                <p className="topic-field__error" id="topic-vacancies-error">
                  {showError('vacancies') ? errors.vacancies : ''}
                </p>
              </div>

              <fieldset
                className="topic-audience"
                aria-describedby={showError('audience') ? 'topic-audience-error' : 'topic-audience-hint'}
              >
                <legend>Anunciar esta proposta para: <span aria-hidden="true">*</span></legend>
                <p className="topic-field__hint" id="topic-audience-hint">Escolha uma opção de divulgação.</p>
                <div className="topic-audience__options">
                  {[
                    ['sistemas', 'Sistemas de Informação'],
                    ['computacao', 'Engenharia de Computação'],
                    ['ambos', 'Ambos os Cursos'],
                  ].map(([value, label]) => (
                    <label className="topic-choice topic-choice--radio" htmlFor={`topic-audience-${value}`} key={value}>
                      <input
                        id={`topic-audience-${value}`}
                        name="publico"
                        type="radio"
                        value={value}
                        checked={form.audience === value}
                        required
                        aria-required="true"
                        aria-invalid={showError('audience') || undefined}
                        onChange={(event) => updateField('audience', event.target.value)}
                        onBlur={() => markTouched('audience')}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <p className="topic-field__error" id="topic-audience-error">
                  {showError('audience') ? errors.audience : ''}
                </p>
              </fieldset>
            </div>
          </fieldset>

          <div className="topic-form__footer">
            <p>Revise os dados antes de anunciar sua proposta.</p>
            <div className="topic-form__actions">
              <button
                className="topic-button topic-button--secondary"
                type="button"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Cancelar/Voltar
              </button>
              <button
                className="topic-button topic-button--primary"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && <span className="topic-spinner" aria-hidden="true" />}
                {isSubmitting ? 'Enviando...' : 'Anunciar Proposta'}
              </button>
            </div>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {isSubmitting ? 'Enviando dados...' : submissionStatus}
            </p>
            {submissionStatus && (
              <p className="topic-submit-status">
                {submissionStatus}
              </p>
            )}
          </div>
        </form>

        <aside className="topic-registration__sidebar" aria-label="Orientações para publicar o tema">
          <section className="topic-info-card" aria-labelledby="topic-before-title">
            <h2 id="topic-before-title">Antes de anunciar</h2>
            <h3>Defina um título claro</h3>
            <p>Indique o problema ou a oportunidade que o trabalho pretende investigar.</p>
            <h3>Escolha as áreas</h3>
            <p>As áreas de conhecimento ajudam estudantes a encontrar sua proposta.</p>
            <h3>Confira o público</h3>
            <p>Verifique o tamanho da equipe e os cursos que poderão visualizar o tema.</p>
          </section>
          <section className="topic-info-card topic-info-card--note" aria-labelledby="topic-disclosure-title">
            <h2 id="topic-disclosure-title">Divulgação do tema</h2>
            <p>Ao anunciar, a proposta ficará disponível para estudantes dos cursos selecionados. O cadastro do tema não confirma uma orientação.</p>
          </section>
        </aside>
      </div>
    </main>
  )
}

export default CadastrarTema
