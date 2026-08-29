export type YearGroup =
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
 * Standard first entry: Reception in the September of the calendar year
 * the child turns four (for example, June 2016 → Reception September 2020).
 */
export function getReceptionEntryYear(birthYear: number): number {
  return birthYear + 4
}

export function getEntryYear(birthYear: number, yearGroupIndex: number): number {
  return getReceptionEntryYear(birthYear) + yearGroupIndex
}

export function buildEntryPoint(
  birthYear: number,
  yearGroupIndex: number,
): EntryPoint {
  const yearGroup = YEAR_GROUPS[yearGroupIndex]
  const entryYear = getEntryYear(birthYear, yearGroupIndex)

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
    buildEntryPoint(birthYear, index),
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
  if (!value) return null

  const parts = value.split('-').map(Number)
  if (parts.length !== 3) return null

  const [year, month, day] = parts
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

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
