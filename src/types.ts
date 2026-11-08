export type UserProfile = 'guest' | 'student' | 'docente' | 'coordenador'

export type PageId =
  | 'sobre'
  | 'docentes'
  | 'candidatura'
  | 'grafo'
  | 'encontrar-orientacao'
  | 'perfil-docente'
  | 'cadastrar-tema'
  | 'gestao'

export interface NavigationState {
  topicTitle?: string
  topicDescription?: string
  topicAreas?: string[]
}

export type NavigateToPage = (page: PageId, state?: NavigationState) => void

export interface NavigationPage {
  id: PageId
  label: string
  access: readonly UserProfile[]
  showInMenu?: boolean
}
