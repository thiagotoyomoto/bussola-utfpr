import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './ErrorPages.css'

interface ErrorPageLayoutProps {
  code: string
  title: string
  description: string
  children: ReactNode
}

function ErrorPageLayout({
  code,
  title,
  description,
  children,
}: ErrorPageLayoutProps) {
  useEffect(() => {
    document.title = `Bússola | ${title}`
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [title])

  return (
    <main
      className="error-page"
      id="main-content"
      tabIndex={-1}
      aria-labelledby="error-title"
    >
      <section className="error-card">
        <p className="error-code" aria-hidden="true">{code}</p>
        <h1 id="error-title">{title}</h1>
        <p className="error-description">{description}</p>
        <div className="error-actions">{children}</div>
      </section>
    </main>
  )
}

export function NotFoundPage() {
  return (
    <ErrorPageLayout
      code="404"
      title="Não encontramos esta página"
      description="O endereço pode estar incorreto ou o conteúdo pode ter sido removido."
    >
      <Link className="error-button error-button--primary" to="/">
        Voltar para o início
      </Link>
    </ErrorPageLayout>
  )
}

export function ForbiddenPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <ErrorPageLayout
      code="403"
      title="Você não tem acesso a esta página"
      description="Entre com um perfil autorizado ou volte ao início para continuar navegando."
    >
      <button className="error-button error-button--primary" type="button" onClick={onSignIn}>
        Entrar
      </button>
      <Link className="error-button" to="/">
        Voltar para o início
      </Link>
    </ErrorPageLayout>
  )
}

export function InternalServerErrorPage() {
  return (
    <ErrorPageLayout
      code="500"
      title="Algo deu errado"
      description="Não foi possível concluir esta operação. Tente novamente; nenhum detalhe técnico foi exibido."
    >
      <button
        className="error-button error-button--primary"
        type="button"
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </button>
      <Link className="error-button" to="/">
        Voltar para o início
      </Link>
    </ErrorPageLayout>
  )
}
