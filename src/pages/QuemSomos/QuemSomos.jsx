import './QuemSomos.css'

function QuemSomos({ onNavigate, onOpenMenu, isLoggedIn }) {
  return (
    <div className="page-shell page-shell--home">
      <main className="home-main" id="inicio">
        <section className="about" id="sobre" aria-labelledby="about-title">
          <h1 className="about__heading" id="about-title">
            <img className="about__logo" src="/bussola.png" alt="" aria-hidden="true" />
            <span>Quem somos?</span>
          </h1>

          <div className="about__content">
            <p className="about__description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.
            </p>

            <div className="about__actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() =>
                  isLoggedIn
                    ? onNavigate('encontrar-orientacao')
                    : onOpenMenu()
                }
              >
                Consultar Bússola
              </button>
              <button className="button" type="button" onClick={onOpenMenu}>
                Entrar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default QuemSomos
