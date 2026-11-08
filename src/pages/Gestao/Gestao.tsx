import { useState, type FormEvent } from 'react'
import './Gestao.css'
import type { NavigateToPage } from '../../types'
import { getTeacherAvailability } from '../../data/teacherAvailability'

const teachers = [
  { name: 'Ana Beatriz', topics: 3, available: true, updated: '08/11/2026' },
  { name: 'Marcos Silva', topics: 1, available: false, updated: '06/11/2026' },
  { name: 'Sofia Martins', topics: 5, available: true, updated: '05/11/2026' },
  { name: 'Rafael Costa', topics: 2, available: true, updated: '03/11/2026' },
  { name: 'Laura Mendes', topics: 4, available: false, updated: '01/11/2026' },
  { name: 'Pedro Almeida', topics: 3, available: true, updated: '28/10/2026' },
]

function Gestao({ onNavigate }: { onNavigate: NavigateToPage }) {
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState('todas')
  const [anaAvailable] = useState(getTeacherAvailability)
  const departmentTeachers = teachers.map((teacher) =>
    teacher.name === 'Ana Beatriz'
      ? { ...teacher, available: anaAvailable }
      : teacher,
  )
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
  const filteredTeachers = departmentTeachers.filter((teacher) => {
    const matchesName = teacher.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
    const matchesAvailability =
      availability === 'todas' ||
      (availability === 'sim' && teacher.available) ||
      (availability === 'nao' && !teacher.available)
    return matchesName && matchesAvailability
  })
  const availableCount = departmentTeachers.filter((teacher) => teacher.available).length
  const topicCount = departmentTeachers.reduce((total, teacher) => total + teacher.topics, 0)
  const availabilityRate = Math.round((availableCount / departmentTeachers.length) * 100)

  return (
    <main className="gestao-dashboard" id="main-content" tabIndex={-1}>
      <section className="management-panel" aria-labelledby="management-title">
        <header className="management-heading">
          <div className="management-heading__identity">
            <img src="/bussola.png" alt="" aria-hidden="true" />
            <div>
              <h1 id="management-title">Coordenação de orientação</h1>
              <p>Indicadores dos docentes do departamento DAINF.</p>
            </div>
          </div>
        </header>

        <div className="management-stats" role="group" aria-label="Indicadores do departamento DAINF">
          <article className="management-stat">
            <div className="management-stat__heading"><h2>Taxa de disponibilidade</h2></div>
            <p className="management-stat__value">{availabilityRate}%</p>
            <p className="management-stat__description">
              {availableCount} de {departmentTeachers.length} docentes disponíveis para orientação.
            </p>
          </article>
          <article className="management-stat">
            <div className="management-stat__heading"><h2>Docentes cadastrados</h2></div>
            <p className="management-stat__value">{departmentTeachers.length}</p>
            <p className="management-stat__description">Docentes do departamento no painel.</p>
          </article>
          <article className="management-stat">
            <div className="management-stat__heading"><h2>Temas ofertados</h2></div>
            <p className="management-stat__value">{topicCount}</p>
            <p className="management-stat__description">Quantidade de temas de TCC cadastrados pelos docentes.</p>
          </article>
        </div>

        <form
          className="management-filters"
          role="search"
          onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
        >
          <label className="management-search" htmlFor="management-search">
            <span className="visually-hidden">Buscar docente</span>
            <input
              id="management-search"
              type="search"
              name="q"
              placeholder="Buscar por docente..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="visually-hidden" htmlFor="availability-filter">
            Filtrar por disponibilidade para orientação
          </label>
          <select
            id="availability-filter"
            name="disponibilidade"
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          >
            <option value="todas">Disponibilidade: Todas</option>
            <option value="sim">Disponível: Sim</option>
            <option value="nao">Disponível: Não</option>
          </select>
        </form>
        <p className="sr-only" role="status" aria-live="polite">
          {filteredTeachers.length}{' '}
          {filteredTeachers.length === 1 ? 'docente encontrado' : 'docentes encontrados'}.
        </p>

        <div
          className="teacher-table-wrapper"
          role="region"
          aria-label="Docentes, temas ofertados e disponibilidade"
          tabIndex={0}
        >
          <table className="teacher-table">
            <caption className="visually-hidden">
              Quantidade de temas, disponibilidade e última atualização de cada docente.
            </caption>
            <thead>
              <tr>
                <th scope="col">Docente</th>
                <th scope="col">Temas ofertados</th>
                <th scope="col">Disponibilidade</th>
                <th scope="col">Última atualização</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.name}>
                  <th scope="row">{teacher.name}</th>
                  <td>{teacher.topics}</td>
                  <td>
                    <span className={`vacancy-badge${teacher.available ? '' : ' vacancy-badge--muted'}`}>
                      {teacher.available ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td><time dateTime={teacher.updated.split('/').reverse().join('-')}>{teacher.updated}</time></td>
                  <td>
                    <div className="teacher-actions">
                      <button
                        type="button"
                        aria-label={`Ver perfil de ${teacher.name}${teacher.name === 'Ana Beatriz' ? '' : ', perfil indisponível'}`}
                        disabled={teacher.name !== 'Ana Beatriz'}
                        onClick={() => onNavigate('perfil-docente')}
                      >
                        Ver perfil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTeachers.length === 0 && (
            <p className="teacher-table__empty">Nenhum docente corresponde aos filtros selecionados.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default Gestao
