import { describe, expect, it } from 'vitest'
import {
  calculateSchoolEntry,
  formatCohortRange,
  getCohortStartYear,
  getEntryYear,
  parseDateOfBirth,
} from './schoolEntry'

describe('getCohortStartYear', () => {
  it('groups September birthdays with the cohort starting that year', () => {
    expect(getCohortStartYear(2023, 9)).toBe(2023)
  })

  it('groups August birthdays with the cohort starting the previous September', () => {
    expect(getCohortStartYear(2023, 8)).toBe(2022)
  })
})

describe('parseDateOfBirth', () => {
  it('parses UK typed dates', () => {
    expect(parseDateOfBirth('29/08/2023')?.getDate()).toBe(29)
    expect(parseDateOfBirth('29-08-2023')?.getMonth()).toBe(7)
    expect(parseDateOfBirth('29.08.2023')?.getFullYear()).toBe(2023)
  })

  it('still parses ISO dates', () => {
    expect(parseDateOfBirth('2023-08-29')?.getDate()).toBe(29)
  })

  it('rejects invalid UK dates', () => {
    expect(parseDateOfBirth('31/02/2023')).toBeNull()
  })
})

describe('school entry schedule', () => {
  it('puts 29 August and 29 September 2023 in different cohorts with different nursery years', () => {
    const august = calculateSchoolEntry(new Date(2023, 7, 29), new Date(2026, 7, 29))
    const september = calculateSchoolEntry(new Date(2023, 8, 29), new Date(2026, 7, 29))

    expect(august.cohortStartYear).toBe(2022)
    expect(september.cohortStartYear).toBe(2023)

    expect(formatCohortRange(august.cohortStartYear)).toBe(
      '1 September 2022 – 31 August 2023',
    )
    expect(formatCohortRange(september.cohortStartYear)).toBe(
      '1 September 2023 – 31 August 2024',
    )

    expect(getEntryYear(august.cohortStartYear, 1)).toBe(2026)
    expect(getEntryYear(september.cohortStartYear, 1)).toBe(2027)

    expect(august.nextPointOfEntry?.yearGroup).toBe('Nursery')
    expect(august.nextPointOfEntry?.entryYear).toBe(2026)
    expect(september.nextPointOfEntry?.yearGroup).toBe('Pre-nursery')
    expect(september.nextPointOfEntry?.entryYear).toBe(2026)
  })

  it('maps 31 August 2023 through pre-nursery, nursery, then reception', () => {
    const result = calculateSchoolEntry(new Date(2023, 7, 31), new Date(2026, 7, 29))

    expect(result.cohortStartYear).toBe(2022)
    expect(result.firstPointOfEntry.yearGroup).toBe('Pre-nursery')
    expect(result.firstPointOfEntry.entryYear).toBe(2025)
    expect(getEntryYear(result.cohortStartYear, 1)).toBe(2026)
    expect(getEntryYear(result.cohortStartYear, 2)).toBe(2027)
  })

  it('places a June 2016 birth across the full schedule through Year 8', () => {
    const result = calculateSchoolEntry(new Date(2016, 5, 15), new Date(2026, 0, 1))

    expect(result.cohortStartYear).toBe(2015)
    expect(getEntryYear(result.cohortStartYear, 0)).toBe(2018)
    expect(getEntryYear(result.cohortStartYear, 2)).toBe(2020)
    expect(result.allEntryPoints[10].yearGroup).toBe('Year 8')
    expect(result.allEntryPoints[10].entryYear).toBe(2028)
  })
})
