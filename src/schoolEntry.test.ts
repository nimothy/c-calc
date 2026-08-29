import { describe, expect, it } from 'vitest'
import {
  calculateSchoolEntry,
  formatCohortRange,
  getCohortStartYear,
  getEntryYear,
} from './schoolEntry'

describe('getCohortStartYear', () => {
  it('groups September birthdays with the cohort starting that year', () => {
    expect(getCohortStartYear(2023, 9)).toBe(2023)
  })

  it('groups August birthdays with the cohort starting the previous September', () => {
    expect(getCohortStartYear(2023, 8)).toBe(2022)
  })
})

describe('school entry schedule', () => {
  it('maps 31 August 2023 to pre-nursery, nursery, then reception', () => {
    const result = calculateSchoolEntry(new Date(2023, 7, 31), new Date(2026, 7, 29))

    expect(formatCohortRange(result.cohortStartYear)).toBe(
      '1 September 2022 – 31 August 2023',
    )
    expect(result.firstPointOfEntry.yearGroup).toBe('Pre-nursery')
    expect(result.firstPointOfEntry.entryYear).toBe(2025)
    expect(getEntryYear(2023, 1)).toBe(2026)
    expect(getEntryYear(2023, 2)).toBe(2027)
    expect(result.nextPointOfEntry?.yearGroup).toBe('Nursery')
    expect(result.nextPointOfEntry?.entryYear).toBe(2026)
  })

  it('places a June 2016 birth across the full schedule through Year 8', () => {
    const result = calculateSchoolEntry(new Date(2016, 5, 15), new Date(2026, 0, 1))

    expect(result.cohortStartYear).toBe(2015)
    expect(getEntryYear(2016, 0)).toBe(2018)
    expect(getEntryYear(2016, 2)).toBe(2020)
    expect(result.allEntryPoints[10].yearGroup).toBe('Year 8')
    expect(result.allEntryPoints[10].entryYear).toBe(2028)
  })
})
