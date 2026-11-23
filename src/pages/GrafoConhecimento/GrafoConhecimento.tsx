import './GrafoConhecimento.css'
import SearchGraphPanel from '../../components/SearchGraphPanel'
import '../../components/SearchGraphPanel.css'

function GrafoConhecimento() {
  return (
    <main className="student-graph" id="main-content" tabIndex={-1}>
      <header className="student-graph__heading">
        <div>
          <h1 id="graph-page-title">Grafo de Conhecimento</h1>
          <p>
            Explore docentes, áreas de conhecimento e temas relacionados para
            encontrar conexões com sua pesquisa.
          </p>
        </div>
      </header>

      <div className="student-graph__layout">
        <SearchGraphPanel />
      </div>
    </main>
  )
}

export default GrafoConhecimento
