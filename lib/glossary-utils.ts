import type { GlossaryTerm } from '@/types/glossary'

export function groupTermsByLetter(terms: GlossaryTerm[]): Record<string, GlossaryTerm[]> {
  const map: Record<string, GlossaryTerm[]> = {}
  for (const term of terms) {
    const letter = term.title[0].toUpperCase()
    if (!map[letter]) map[letter] = []
    map[letter].push(term)
  }
  return map
}
