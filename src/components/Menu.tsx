import './Menu.css'
import { NavLink } from 'react-router-dom'
import { PAGE_PATHS } from '../routes'
import type { NavigationPage } from '../types'

interface MenuProps {
  pages: readonly NavigationPage[]
  pathname: string
}

function Menu({ pages, pathname }: MenuProps) {
  return (
    <nav className="screen-nav" aria-label="Navegação principal">
      <ul className="screen-nav__list">
        {pages.map((page) => (
          <li key={page.id}>
            <NavLink
              className="screen-nav__button"
              to={PAGE_PATHS[page.id]}
              end={page.id === 'sobre'}
              aria-current={pathname === PAGE_PATHS[page.id] ? 'page' : undefined}
            >
              {page.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
