'use client'

import { useCallback, useMemo, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export interface UseFiltersReturn<T> {
  filters: T
  setFilter: <K extends keyof T>(key: K, value: T[K] | undefined) => void
  setFilters: (next: Partial<T>) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
  isPending: boolean
}

/**
 * Generic URL-aware filter hook.
 * Reads the current filter state from URL search params (via fromParams),
 * and writes back to the URL whenever filters change (via toParams).
 *
 * Filters are the source of truth — page data is re-fetched by the Server
 * Component when the URL changes.
 */
export function useFilters<T extends Record<string, unknown>>(
  defaults: T,
  toParams: (filters: T) => URLSearchParams,
  fromParams: (sp: URLSearchParams) => T,
  countActive: (filters: T, defaults: T) => number = defaultCount
): UseFiltersReturn<T> {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const filters = useMemo(() => fromParams(searchParams), [searchParams, fromParams])

  const push = useCallback(
    (next: T) => {
      const params = toParams(next)
      const qs = params.toString()
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      })
    },
    [router, pathname, toParams]
  )

  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K] | undefined) => {
      push({ ...filters, [key]: value } as T)
    },
    [filters, push]
  )

  const setFilters = useCallback(
    (next: Partial<T>) => {
      push({ ...filters, ...next } as T)
    },
    [filters, push]
  )

  const clearFilters = useCallback(() => {
    push(defaults)
  }, [defaults, push])

  const activeFilterCount = useMemo(() => countActive(filters, defaults), [filters, defaults, countActive])
  const hasActiveFilters = activeFilterCount > 0

  return { filters, setFilter, setFilters, clearFilters, hasActiveFilters, activeFilterCount, isPending }
}

function defaultCount<T extends Record<string, unknown>>(filters: T, defaults: T): number {
  return Object.keys(filters).filter((k) => {
    const v = filters[k]
    const d = defaults[k]
    return v !== undefined && v !== false && v !== '' && v !== d
  }).length
}
