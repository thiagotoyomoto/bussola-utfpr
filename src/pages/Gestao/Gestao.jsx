import { useMemo, useState } from 'react'
import './Gestao.css'

const teachers = [
  {
    name: 'Ana Beatriz',
    area: 'Metodologia de Pesquisa',
    vacancies: '3 vagas',
    muted: false,
  },
  {
    name: 'Marcos Silva',
    area: 'Inteligência Artificial',
    vacancies: '1 vaga',
    muted: true,
  },
  {
    name: 'Sofia Martins',
    area: 'Design de Experiência',
    vacancies: '5 vagas',
    muted: false,
  },
  {
    name: 'Rafael Costa',
    area: 'Sistemas Distribuídos',
    vacancies: '2 vagas',
    muted: false,
  },
  {
    name: 'Laura Mendes',
    area: 'Dados Educacionais',
    vacancies: '4 vagas',
    muted: false,
  },
  {
    name: 'Pedro Almeida',
    area: 'UX e Pesquisa',
    vacancies: '3 vagas',
    muted: false,
  },
]

function Gestao({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState('todas')

  const filteredTeachers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')

    return teachers.filter((teacher) => {
      const matchesQuery =
        !normalizedQuery ||
        `${teacher.name} ${teacher.area}`
          .toLocaleLowerCase('pt-BR')
          .includes(normalizedQuery)
      const matchesAvailability =
        availability === 'todas' ||
        (availability === 'com-vagas' &&
          Number.parseInt(teacher.vacancies, 10) > 0) ||
        (availability === 'sem-vagas' &&
          Number.parseInt(teacher.vacancies, 10) === 0)

      return matchesQuery && matchesAvailability
    })
  }, [availability, query])

  return (
    <main className="gestao-dashboard" id="inicio">
      <section className="management-panel" aria-labelledby="management-title">
        <header className="management-heading">
          <div className="management-heading__identity">
            <img src="/bussola.png" alt="" aria-hidden="true" />
            <div>
              <h1 id="management-title">Coordenação de orientação</h1>
              <p>Dados demonstrativos · Relatório: professores e adesão dos últimos 30 dias</p>
            </div>
          </div>

          <button
            className="report-button"
            type="button"
            disabled
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 16v4h14v-4" />
            </svg>
            Gerar relatório PDF (indisponível nesta demonstração)
          </button>
        </header>

        <div className="management-stats" role="group" aria-label="Indicadores dos últimos 30 dias">
          <article className="management-stat">
            <div className="management-stat__heading">
              <h2>Taxa de adesão</h2>
              <span className="stat-badge">Últimos 30 dias</span>
            </div>
            <p className="management-stat__value">35%</p>
            <p className="management-stat__description">
              42 alunos confirmaram orientação entre 120 solicitantes elegíveis.
            </p>
          </article>

          <article className="management-stat">
            <div className="management-stat__heading">
              <h2>Alunos elegíveis</h2>
              <span className="stat-badge stat-badge--outline">Graduação</span>
            </div>
            <p className="management-stat__value">120</p>
            <p className="management-stat__description">
              Alunos elegíveis para orientação no período analisado.
            </p>
          </article>

          <article className="management-stat">
            <div className="management-stat__heading">
              <h2>Vagas abertas</h2>
              <span className="stat-badge">18 vagas</span>
            </div>
            <p className="management-stat__value">18</p>
            <p className="management-stat__description">
              Distribuídas entre 6 professores disponíveis para orientação.
            </p>
          </article>
        </div>

        <form
          className="management-filters"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="management-search" htmlFor="management-search">
            <span className="visually-hidden">Buscar professor ou área</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="10.8" cy="10.8" r="7.2" />
              <path d="m16.2 16.2 5 5" />
            </svg>
            <input
              id="management-search"
              type="search"
              name="q"
              placeholder="Buscar por nome ou área..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label className="visually-hidden" htmlFor="availability-filter">Filtrar por disponibilidade</label>
          <select
            id="availability-filter"
            name="disponibilidade"
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          >
            <option value="todas">Disponibilidade: Todas</option>
            <option value="com-vagas">Com vagas</option>
            <option value="sem-vagas">Sem vagas</option>
          </select>
        </form>
        <p className="sr-only" role="status" aria-live="polite">
          {filteredTeachers.length}{' '}
          {filteredTeachers.length === 1 ? 'docente encontrado' : 'docentes encontrados'}.
        </p>

        <div className="teacher-table-wrapper" role="region" aria-label="Docentes e disponibilidade" tabIndex={0}>
          <table className="teacher-table">
            <caption className="visually-hidden">Docentes, áreas de pesquisa, vagas disponíveis e ações</caption>
            <thead>
              <tr>
                <th scope="col">Docente</th>
                <th scope="col">Área</th>
                <th scope="col">Disponibilidade</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.name}>
                  <th scope="row">
                    <span className="teacher-name">
                      <span className="teacher-avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M3 21c.8-4.2 4.2-6.5 9-6.5s8.2 2.3 9 6.5" />
                        </svg>
                      </span>
                      {teacher.name}
                    </span>
                  </th>
                  <td>{teacher.area}</td>
                  <td>
                    <span className={`vacancy-badge${teacher.muted ? ' vacancy-badge--muted' : ''}`}>
                      {teacher.vacancies}
                    </span>
                  </td>
                  <td>
                    <div className="teacher-actions">
                      <button
                        type="button"
                        aria-label={`Ver perfil de ${teacher.name}${teacher.name === 'Ana Beatriz' ? '' : ', indisponível nesta demonstração'}`}
                        disabled={teacher.name !== 'Ana Beatriz'}
                        onClick={() => onNavigate('perfil-docente')}
                      >
                        Ver perfil
                      </button>
                      <button
                        type="button"
                        aria-label={`Ver orientações de ${teacher.name}${teacher.name === 'Ana Beatriz' ? '' : ', indisponível nesta demonstração'}`}
                        disabled={teacher.name !== 'Ana Beatriz'}
                        onClick={() => onNavigate('encontrar-orientacao')}
                      >
                        Ver orientações
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTeachers.length === 0 && (
            <p className="teacher-table__empty">
              Nenhum docente corresponde aos filtros selecionados.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default Gestao
