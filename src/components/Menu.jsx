import './Menu.css'

function Menu({ pages, currentPage, onNavigate }) {
  return (
    <nav className="screen-nav" aria-label="Navegação entre telas">
      <ul className="screen-nav__list">
        {pages.map((page) => (
          <li key={page.id}>
            <button
              className="screen-nav__button"
              type="button"
              aria-controls="page-content"
              aria-current={currentPage === page.id ? 'page' : undefined}
              onClick={() => onNavigate(page.id)}
            >
              {page.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
