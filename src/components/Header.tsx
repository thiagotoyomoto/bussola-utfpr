import { Link } from 'react-router-dom'
import type { NavigationPage, UserProfile } from '../types'
import Menu from './Menu'
import './Header.css'

interface HeaderProps {
  pages: readonly NavigationPage[]
  profile: UserProfile
  onProfileChange: (profile: UserProfile) => void
  onSignIn: () => void
  pathname: string
}

function Header({ pages, profile, onProfileChange, onSignIn, pathname }: HeaderProps) {
  const profileOptions: { value: UserProfile; label: string }[] = [
    { value: 'guest', label: 'Visitante' },
    { value: 'student', label: 'Estudante' },
    { value: 'docente', label: 'Docente' },
    { value: 'coordenador', label: 'Coordenação' },
  ]

  const isLoggedIn = profile !== 'guest'

  return (
    <header className="app-header">
      <Link className="app-brand" to="/" aria-label="Bússola — início">
        <img className="app-brand__image" src="/bussola.png" alt="" />
        <span className="app-brand__text">Bússola</span>
      </Link>

      <Menu pages={pages} pathname={pathname} />

      <div className="header-account">
        <button
          type="button"
          className="google-login-button"
          onClick={onSignIn}
        >
          {isLoggedIn ? 'Sair' : 'Entrar'}
        </button>
        <label className="profile-selector" htmlFor="profile-selector">
          Perfil
          <select
            id="profile-selector"
            value={profile}
            onChange={(event) => {
              const nextProfile = profileOptions.find(
                (option) => option.value === event.currentTarget.value,
              )?.value
              if (nextProfile) onProfileChange(nextProfile)
            }}
          >
            {profileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  )
}

export default Header
