import { Composition } from 'remotion'
import { AgentGroupFilm } from './AgentGroupFilm.tsx'
import { FILM } from './film.ts'

export function FilmRoot() {
  return <Composition {...FILM} component={AgentGroupFilm} />
}
