const HIDDEN_VALUES = new Set([
  'not publicly disclosed', 'npd', 'unknown', 'n/a', 'na', 'nan', 'none',
  'tbd', 'tba', 'pending', '—', '-', 'not available', 'not disclosed', 'unavailable',
])

export function cleanDisplayText(text: string | null | undefined): string | null {
  if (!text) return null
  const cleaned = text.replace(/\[needs-review\]/gi, '').trim()
  return cleaned || null
}

export function displayOrNull(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = cleanDisplayText(value)
  if (!cleaned) return null
  if (HIDDEN_VALUES.has(cleaned.toLowerCase())) return null
  return cleaned
}

export function capabilityDisplay(value: boolean | null | undefined): boolean {
  return value === true
}

export function openSourceLabel(
  value: string | boolean | null | undefined,
): 'Open Source' | 'Closed Source' | 'Mixed' | null {
  if (value === true) return 'Open Source'
  if (typeof value === 'string') {
    const v = value.toLowerCase().trim()
    if (v === 'open source') return 'Open Source'
    if (v === 'closed source') return 'Closed Source'
    if (v === 'mixed') return 'Mixed'
  }
  return null
}

export function parseBenchmarks(
  value: string | null | undefined,
): Array<{ key: string; value: string }> {
  if (!displayOrNull(value)) return []
  return value!
    .split('|')
    .map((s) => {
      const [k, ...v] = s.split(':')
      return { key: k?.trim() ?? '', value: v.join(':').trim() }
    })
    .filter((b) => b.key && b.value)
}

export function parseList(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((s) => cleanDisplayText(s) ?? '')
    .filter(Boolean)
}

export function isApiAvailable(
  value: boolean | string | null | undefined,
): boolean | null {
  if (value === true || value === 'Yes' || value === 'yes' || value === 'Available' || value === 'available') return true
  if (value === false || value === 'No' || value === 'no' || value === 'Not available') return false
  return null
}
