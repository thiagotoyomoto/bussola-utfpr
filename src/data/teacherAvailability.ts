const STORAGE_KEY = 'bussola:docente:disponivel-para-tcc'

export function getTeacherAvailability(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(STORAGE_KEY) !== 'false'
}

export function setTeacherAvailability(available: boolean): void {
  window.localStorage.setItem(STORAGE_KEY, String(available))
}
