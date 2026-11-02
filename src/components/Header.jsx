import { useEffect, useRef } from 'react'
import Menu from './Menu.jsx'
import './Header.css'

function Header({
  pages,
  currentPage,
  onNavigate,
  profile,
  onProfileChange,
  isLoggedIn,
  isMenuOpen,
  onMenuOpen,
  onMenuClose,
}) {
  const menuButtonRef = useRef(null)
  const menuDialogRef = useRef(null)

  const profileOptions = [
    { value: 'guest', label: 'Visitante' },
    { value: 'student', label: 'Estudante' },
    { value: 'docente', label: 'Docente' },
    { value: 'coordenador', label: 'Coordenação' },
  ]

  useEffect(() => {
    const dialog = menuDialogRef.current

    if (isMenuOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }

      dialog.querySelector('button, select, a')?.focus()
    } else if (dialog.open) {
      dialog.close()
      menuButtonRef.current?.focus()
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const handleOutsidePointerDown = (event) => {
      const dialog = menuDialogRef.current
      const bounds = dialog?.getBoundingClientRect()

      if (
        bounds &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      ) {
        onMenuClose()
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown, true)
    }
  }, [isMenuOpen, onMenuClose])

  const handleProfileChange = (nextProfile) => {
    onProfileChange(nextProfile)
    onNavigate('sobre')
    onMenuClose()
  }

  const handleMenuClose = () => {
    onMenuClose()
    menuButtonRef.current?.focus()
  }

  return (
    <header className="app-header">
      <button
        className="app-brand"
        type="button"
        aria-label="Ir para a página Quem somos?"
        aria-controls="page-content"
        onClick={() => onNavigate('sobre')}
      >
        <img className="app-brand__image" src="/bussola.png" alt="" aria-hidden="true" />
        <span className="app-brand__text">Bússola</span>
      </button>

      <nav className="header-actions" aria-label="Ações do cabeçalho">
        <button
          className="icon-button"
          type="button"
          aria-label={
            isLoggedIn
              ? 'Pesquisar orientações'
              : 'Entrar para pesquisar orientações'
          }
          onClick={() =>
            isLoggedIn
              ? onNavigate('encontrar-orientacao')
              : onMenuOpen()
          }
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="10.8" cy="10.8" r="7.2" />
            <path d="m16.2 16.2 5 5" />
          </svg>
        </button>
        <button
          ref={menuButtonRef}
          className="icon-button icon-button--profile"
          type="button"
          aria-label="Abrir menu de opções"
          aria-expanded={isMenuOpen}
          aria-controls="profile-menu"
          aria-haspopup="dialog"
          onClick={isMenuOpen ? handleMenuClose : onMenuOpen}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <dialog
        className="app-header__popover"
        id="profile-menu"
        ref={menuDialogRef}
        aria-label="Menu de opções"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleMenuClose()
          }
        }}
        onCancel={(event) => {
          event.preventDefault()
          handleMenuClose()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            onMenuClose()
          }
        }}
        onClose={() => {
          if (isMenuOpen) {
            onMenuClose()
          }
          menuButtonRef.current?.focus()
        }}
      >
        <Menu
          pages={pages}
          currentPage={currentPage}
          onNavigate={(pageId) => {
            onNavigate(pageId)
            handleMenuClose()
          }}
        />
        <div className="app-header__account">
          <button
            type="button"
            className="google-login-button"
            onClick={() => handleProfileChange(isLoggedIn ? 'guest' : 'student')}
          >
            {isLoggedIn ? 'Sair' : 'Entrar com Google'}
          </button>
          <label className="profile-selector" htmlFor="profile-selector">
            <span className="sr-only">Selecionar perfil</span>
            <select
              id="profile-selector"
              value={profile}
              onChange={(event) => handleProfileChange(event.target.value)}
            >
              {profileOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </dialog>
    </header>
  )
}

export default Header
