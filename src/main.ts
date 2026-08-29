import './style.css'
import {
  calculateSchoolEntry,
  formatAcademicYear,
  formatDisplayDate,
  parseDateOfBirth,
  type SchoolEntryResult,
} from './schoolEntry'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <main class="page">
    <header class="hero">
      <p class="eyebrow">British school admissions</p>
      <h1>School entry calculator</h1>
      <p class="intro">
        Enter your child&apos;s date of birth to see their academic cohort and when they
        can enter from Pre-nursery through Year 8. Academic years run from
        <strong>1 September</strong> to <strong>31 August</strong>.
      </p>
    </header>

    <section class="card input-card">
      <label class="field-label" for="dob">Child&apos;s date of birth</label>
      <input id="dob" class="dob-input" type="date" />
      <p class="hint">
        Example: a child born on 29 August 2023 is in the 2022/23 cohort and enters
        Nursery in September 2026. A child born on 29 September 2023 is in the
        2023/24 cohort and enters Nursery in September 2027.
      </p>
    </section>

    <section id="results" class="results hidden" aria-live="polite"></section>

    <footer class="footer">
      <p>
        Based on standard England school admissions: children normally enter
        Pre-nursery in the September after they turn two, Nursery in the September
        they turn three, and Reception in the September they turn four, grouped by
        the September&ndash;August academic year. Summer-born deferral rules are not
        included here.
      </p>
    </footer>
  </main>
`

const dobInput = document.querySelector<HTMLInputElement>('#dob')!
const resultsSection = document.querySelector<HTMLDivElement>('#results')!

function renderResults(result: SchoolEntryResult): void {
  const { nextPointOfEntry, firstPointOfEntry } = result

  resultsSection.classList.remove('hidden')
  resultsSection.innerHTML = `
    <section class="card highlight-card">
      <h2>Next point of entry</h2>
      ${
        nextPointOfEntry
          ? `
        <p class="big-result">
          <span class="year-group">${nextPointOfEntry.yearGroup}</span>
          <span class="entry-year">September ${nextPointOfEntry.entryYear}</span>
        </p>
        <p class="subtle">
          Academic year ${nextPointOfEntry.academicYearLabel}
        </p>
      `
          : `
        <p class="big-result muted">
          All standard entry points through Year 8 have passed for this date of birth.
        </p>
      `
      }
    </section>

    <section class="card">
      <h2>First point of entry</h2>
      <p class="summary-line">
        <strong>${firstPointOfEntry.yearGroup}</strong> in September
        ${firstPointOfEntry.entryYear}
        <span class="pill">${firstPointOfEntry.academicYearLabel}</span>
      </p>
    </section>

    <section class="card">
      <h2>Cohort details</h2>
      <dl class="details-grid">
        <div>
          <dt>Date of birth</dt>
          <dd>${formatDisplayDate(result.dateOfBirth)}</dd>
        </div>
        <div>
          <dt>Academic cohort</dt>
          <dd>${result.cohortLabel}</dd>
        </div>
        <div>
          <dt>Current academic year</dt>
          <dd>${formatAcademicYear(result.currentAcademicYearStart)}</dd>
        </div>
      </dl>
    </section>

    <section class="card">
      <h2>All entry points (Pre-nursery to Year 8)</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Year group</th>
              <th scope="col">Entry September</th>
              <th scope="col">Academic year</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            ${result.allEntryPoints
              .map((entry) => {
                const isNext = nextPointOfEntry?.yearGroup === entry.yearGroup
                const isPast = entry.entryDate < new Date(new Date().toDateString())
                const status = isNext
                  ? 'Next entry'
                  : isPast
                    ? 'Past'
                    : 'Upcoming'

                return `
                  <tr class="${isNext ? 'row-next' : ''}">
                    <td>${entry.yearGroup}</td>
                    <td>${entry.entryYear}</td>
                    <td>${entry.academicYearLabel}</td>
                    <td><span class="status status-${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
                  </tr>
                `
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `
}

function updateResults(): void {
  const date = parseDateOfBirth(dobInput.value)

  if (!date) {
    resultsSection.classList.add('hidden')
    resultsSection.innerHTML = ''
    return
  }

  renderResults(calculateSchoolEntry(date))
}

dobInput.addEventListener('input', updateResults)
dobInput.addEventListener('change', updateResults)
