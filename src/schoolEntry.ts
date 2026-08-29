export type YearGroup =
  | 'Pre-nursery'
  | 'Nursery'
  | 'Reception'
  | 'Year 1'
  | 'Year 2'
  | 'Year 3'
  | 'Year 4'
  | 'Year 5'
  | 'Year 6'
  | 'Year 7'
  | 'Year 8'

export const YEAR_GROUPS: YearGroup[] = [
  'Pre-nursery',
  'Nursery',
  'Reception',
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Year 5',
  'Year 6',
  'Year 7',
  'Year 8',
]

export interface EntryPoint {
  yearGroup: YearGroup
  entryYear: number
  academicYearLabel: string
  entryDate: Date
}

export interface SchoolEntryResult {
  dateOfBirth: Date
  cohortStartYear: number
  cohortEndYear: number
  cohortLabel: string
  firstPointOfEntry: EntryPoint
  allEntryPoints: EntryPoint[]
  nextPointOfEntry: EntryPoint | null
  currentAcademicYearStart: number
}

/**
 * Academic cohort for school year groups in England.
 * Children born 1 September–31 August share a year group once in school.
 */
export function getCohortStartYear(birthYear: number, birthMonth: number): number {
  return birthMonth >= 9 ? birthYear : birthYear - 1
}

export function formatAcademicYear(startYear: number): string {
  const end = startYear + 1
  return `${startYear}/${String(end).slice(-2)}`
}

export function formatCohortRange(cohortStartYear: number): string {
  const cohortEndYear = cohortStartYear + 1
  return `1 September ${cohortStartYear} – 31 August ${cohortEndYear}`
}

export function getCurrentAcademicYearStart(referenceDate: Date = new Date()): number {
  const month = referenceDate.getMonth() + 1
  const year = referenceDate.getFullYear()
  return month >= 9 ? year : year - 1
}

/**
 * Entry years are based on academic cohort, not calendar birth year alone.
 * A cohort (1 Sept Y – 31 Aug Y+1) enters each stage together each September.
 */
export function getFirstEntryYear(cohortStartYear: number): number {
  return cohortStartYear + 3
}

export function getEntryYear(
  cohortStartYear: number,
  yearGroupIndex: number,
): number {
  return getFirstEntryYear(cohortStartYear) + yearGroupIndex
}

export function buildEntryPoint(
  cohortStartYear: number,
  yearGroupIndex: number,
): EntryPoint {
  const yearGroup = YEAR_GROUPS[yearGroupIndex]
  const entryYear = getEntryYear(cohortStartYear, yearGroupIndex)

  return {
    yearGroup,
    entryYear,
    academicYearLabel: formatAcademicYear(entryYear),
    entryDate: new Date(entryYear, 8, 1),
  }
}

export function calculateSchoolEntry(
  dateOfBirth: Date,
  referenceDate: Date = new Date(),
): SchoolEntryResult {
  const birthYear = dateOfBirth.getFullYear()
  const birthMonth = dateOfBirth.getMonth() + 1
  const cohortStartYear = getCohortStartYear(birthYear, birthMonth)
  const cohortEndYear = cohortStartYear + 1

  const allEntryPoints = YEAR_GROUPS.map((_, index) =>
    buildEntryPoint(cohortStartYear, index),
  )

  const firstPointOfEntry = allEntryPoints[0]

  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  )

  const nextPointOfEntry =
    allEntryPoints.find((entry) => entry.entryDate >= today) ?? null

  return {
    dateOfBirth,
    cohortStartYear,
    cohortEndYear,
    cohortLabel: formatCohortRange(cohortStartYear),
    firstPointOfEntry,
    allEntryPoints,
    nextPointOfEntry,
    currentAcademicYearStart: getCurrentAcademicYearStart(referenceDate),
  }
}

export function parseDateOfBirth(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (isoMatch) {
    return buildValidatedDate(
      Number(isoMatch[1]),
      Number(isoMatch[2]),
      Number(isoMatch[3]),
    )
  }

  const ukMatch = trimmed.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (ukMatch) {
    return buildValidatedDate(
      Number(ukMatch[3]),
      Number(ukMatch[2]),
      Number(ukMatch[1]),
    )
  }

  return null
}

function buildValidatedDate(year: number, month: number, day: number): Date | null {
  if (!year || !month || !day) return null

  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function looksLikeCompleteDateInput(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false

  return (
    /^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed) ||
    /^\d{1,2}[/.-]\d{1,2}[/.-]\d{4}$/.test(trimmed)
  )
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
