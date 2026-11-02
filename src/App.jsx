import { useState } from 'react'
import Header from './components/Header.jsx'
import QuemSomos from './pages/QuemSomos/QuemSomos.jsx'
import PainelDocente from './pages/PainelDocente/PainelDocente.jsx'
import Candidatura from './pages/Candidatura/Candidatura.jsx'
import GrafoConhecimento from './pages/GrafoConhecimento/GrafoConhecimento.jsx'
import EncontrarOrientacao from './pages/EncontrarOrientacao/EncontrarOrientacao.jsx'
import PerfilDocente from './pages/PerfilDocente/PerfilDocente.jsx'
import Gestao from './pages/Gestao/Gestao.jsx'
import './App.css'

const pages = [
  {
    id: 'sobre',
    label: 'Quem somos?',
    title: 'Quem somos?',
    access: ['guest', 'student', 'docente', 'coordenador'],
  },
  {
    id: 'docentes',
    label: 'Painel docente',
    title: 'Painel docente',
    access: ['docente', 'coordenador'],
  },
  {
    id: 'candidatura',
    label: 'Candidatura',
    title: 'Enviar candidatura para orientação',
    access: ['student'],
    showInMenu: false,
  },
  {
    id: 'grafo',
    label: 'Grafo de conhecimento',
    title: 'Explorar grafo de conhecimento',
    access: ['student', 'docente', 'coordenador'],
  },
  {
    id: 'encontrar-orientacao',
    label: 'Encontrar orientação',
    title: 'Encontrar orientação',
    access: ['student', 'docente', 'coordenador'],
  },
  {
    id: 'perfil-docente',
    label: 'Perfil docente',
    title: 'Perfil docente e temas de TCC',
    access: ['student', 'docente', 'coordenador'],
    showInMenu: false,
  },
  {
    id: 'gestao',
    label: 'Gestão',
    title: 'Coordenação de orientação',
    access: ['coordenador'],
  },
]

function App() {
  const [currentPage, setCurrentPage] = useState('sobre')
  const [profile, setProfile] = useState('guest')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isLoggedIn = profile !== 'guest'

  const canAccessPage = (pageId, role) => {
    const page = pages.find((item) => item.id === pageId)
    if (!page) {
      return false
    }

    return page.access.includes(role)
  }

  const safeCurrentPage = canAccessPage(currentPage, profile)
    ? currentPage
    : 'sobre'

  const visiblePages = pages
    .filter((page) => page.access.includes(profile) && page.showInMenu !== false)
    .map((page) =>
      profile !== 'student' && page.id === 'encontrar-orientacao'
        ? { ...page, label: 'Explorar docentes' }
        : page,
    )
  const activePage =
    pages.find((page) => page.id === safeCurrentPage) ?? pages[0]

  const renderCurrentPage = () => {
    if (safeCurrentPage === 'sobre') {
      return (
        <QuemSomos
          onNavigate={setCurrentPage}
          onOpenMenu={() => setIsMenuOpen(true)}
          isLoggedIn={isLoggedIn}
        />
      )
    }

    if (safeCurrentPage === 'docentes') {
      return <PainelDocente />
    }

    if (safeCurrentPage === 'candidatura') {
      return <Candidatura onNavigate={setCurrentPage} />
    }

    if (safeCurrentPage === 'grafo') {
      return <GrafoConhecimento profile={profile} onNavigate={setCurrentPage} />
    }

    if (safeCurrentPage === 'encontrar-orientacao') {
      return <EncontrarOrientacao profile={profile} onNavigate={setCurrentPage} />
    }

    if (safeCurrentPage === 'perfil-docente') {
      return <PerfilDocente profile={profile} onNavigate={setCurrentPage} />
    }

    if (safeCurrentPage === 'gestao') {
      return <Gestao onNavigate={setCurrentPage} />
    }

    return (
      <main className="page-content" aria-labelledby="page-title">
        <h1 id="page-title">{activePage.title}</h1>
        <p>
          Esta tela será migrada na próxima etapa. Use a navegação acima para
          alternar entre as sete páginas.
        </p>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <Header
        pages={visiblePages}
        currentPage={safeCurrentPage}
        onNavigate={setCurrentPage}
        profile={profile}
        onProfileChange={setProfile}
        isLoggedIn={isLoggedIn}
        isMenuOpen={isMenuOpen}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
      />

      <div id="page-content" className="page-content-wrapper">
        {renderCurrentPage()}
      </div>
    </div>
  )
}

export default App
