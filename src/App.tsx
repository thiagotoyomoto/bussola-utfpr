import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import QuemSomos from './pages/QuemSomos/QuemSomos'
import PainelDocente from './pages/PainelDocente/PainelDocente'
import Candidatura from './pages/Candidatura/Candidatura'
import GrafoConhecimento from './pages/GrafoConhecimento/GrafoConhecimento'
import PerfilDocente from './pages/PerfilDocente/PerfilDocente'
import Gestao from './pages/Gestao/Gestao'
import CadastrarTema from './pages/CadastrarTema/CadastrarTema'
import {
  ForbiddenPage,
  InternalServerErrorPage,
  NotFoundPage,
} from './pages/Errors/ErrorPages'
import type { NavigationPage, NavigationState, PageId, UserProfile } from './types'
import { PAGE_PATHS } from './routes'
import './App.css'

const pageTitles: Record<string, string> = {
  '/': 'Quem somos?',
  '/docentes': 'Painel docente',
  '/candidatura': 'Candidatura para orientação',
  '/grafo': 'Grafo de conhecimento',
  '/perfil-docente': 'Perfil docente',
  '/cadastrar-tema': 'Cadastrar tema',
  '/gestao': 'Gestão',
  '/403': 'Acesso não autorizado',
  '/404': 'Página não encontrada',
  '/500': 'Erro interno',
}

const pages: readonly NavigationPage[] = [
  {
    id: 'sobre',
    label: 'Quem somos?',
    access: ['guest', 'student', 'docente', 'coordenador'],
    showInMenu: false,
  },
  {
    id: 'docentes',
    label: 'Painel docente',
    access: ['docente', 'coordenador'],
  },
  {
    id: 'candidatura',
    label: 'Candidatura',
    access: ['student'],
    showInMenu: false,
  },
  {
    id: 'grafo',
    label: 'Grafo de conhecimento',
    access: ['student', 'docente', 'coordenador'],
    showInMenu: false,
  },
  {
    id: 'encontrar-orientacao',
    label: 'Encontrar orientação',
    access: ['student', 'docente', 'coordenador'],
  },
  {
    id: 'perfil-docente',
    label: 'Perfil docente',
    access: ['student', 'docente', 'coordenador'],
    showInMenu: false,
  },
  {
    id: 'cadastrar-tema',
    label: 'Cadastrar tema',
    access: ['docente'],
    showInMenu: false,
  },
  {
    id: 'gestao',
    label: 'Gestão',
    access: ['coordenador'],
  },
]

function RouteFocusManager() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    const heading = document
      .querySelector('#main-content h1')
      ?.textContent?.trim()
    document.title = `Bússola | ${heading ?? pageTitles[pathname] ?? 'Página não encontrada'}`
    if (previousPath.current !== pathname) {
      previousPath.current = pathname
      window.scrollTo(0, 0)
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
  }, [pathname])

  return null
}

interface ProtectedPageProps {
  page: PageId
  profile: UserProfile
  children: ReactNode
  onSignIn: (profile: UserProfile) => void
}

function ProtectedPage({ page, profile, children, onSignIn }: ProtectedPageProps) {
  const allowedProfiles = pages.find((item) => item.id === page)?.access ?? []
  const canAccess = allowedProfiles.includes(profile)
  const signInProfile = allowedProfiles.find((item) => item !== 'guest')

  if (!canAccess) {
    return (
      <ForbiddenPage
        onSignIn={() => {
          if (signInProfile) onSignIn(signInProfile)
        }}
      />
    )
  }

  return children
}

function AppRoutes({
  profile,
  onProfileChange,
}: {
  profile: UserProfile
  onProfileChange: (profile: UserProfile) => void
}) {
  const navigate = useNavigate()
  const goTo = useCallback(
    (page: PageId, state?: NavigationState) =>
      navigate(PAGE_PATHS[page], state ? { state } : undefined),
    [navigate],
  )
  const signIn = useCallback(
    (nextProfile: UserProfile) => {
      onProfileChange(nextProfile)
    },
    [onProfileChange],
  )

  return (
    <Routes>
      <Route
        path="/"
        element={
          <QuemSomos
            onNavigate={goTo}
            onSignIn={() => onProfileChange('student')}
            isLoggedIn={profile !== 'guest'}
          />
        }
      />
      <Route
        path="/docentes"
        element={
          <ProtectedPage page="docentes" profile={profile} onSignIn={signIn}>
            <PainelDocente onNavigate={goTo} />
          </ProtectedPage>
        }
      />
      <Route
        path="/candidatura"
        element={
          <ProtectedPage page="candidatura" profile={profile} onSignIn={signIn}>
            <Candidatura onNavigate={goTo} />
          </ProtectedPage>
        }
      />
      <Route
        path="/grafo"
        element={
          <ProtectedPage page="grafo" profile={profile} onSignIn={signIn}>
            <GrafoConhecimento />
          </ProtectedPage>
        }
      />
      <Route
        path="/encontrar-orientacao"
        element={<Navigate to="/grafo" replace />}
      />
      <Route
        path="/perfil-docente"
        element={
          <ProtectedPage page="perfil-docente" profile={profile} onSignIn={signIn}>
            <PerfilDocente profile={profile} onNavigate={goTo} />
          </ProtectedPage>
        }
      />
      <Route
        path="/cadastrar-tema"
        element={
          <ProtectedPage page="cadastrar-tema" profile={profile} onSignIn={signIn}>
            <CadastrarTema onNavigate={goTo} />
          </ProtectedPage>
        }
      />
      <Route
        path="/gestao"
        element={
          <ProtectedPage page="gestao" profile={profile} onSignIn={signIn}>
            <Gestao onNavigate={goTo} />
          </ProtectedPage>
        }
      />
      <Route path="/403" element={<ForbiddenPage onSignIn={() => onProfileChange('student')} />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/500" element={<InternalServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState<UserProfile>('guest')
  const visiblePages = pages
    .filter((page) => page.access.includes(profile) && page.showInMenu !== false)
    .map((page) =>
      profile !== 'student' && page.id === 'encontrar-orientacao'
        ? { ...page, label: 'Explorar docentes' }
        : page,
    )

  const handleProfileChange = (nextProfile: UserProfile) => {
    setProfile(nextProfile)
    navigate('/')
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo principal
      </a>
      <RouteFocusManager />
      <Header
        pages={visiblePages}
        profile={profile}
        onProfileChange={handleProfileChange}
        onSignIn={() => handleProfileChange(profile === 'guest' ? 'student' : 'guest')}
        pathname={location.pathname}
      />

      <div className="page-content-wrapper">
        <AppRoutes profile={profile} onProfileChange={handleProfileChange} />
      </div>
    </div>
  )
}

export default App
