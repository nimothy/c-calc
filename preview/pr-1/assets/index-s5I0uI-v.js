(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`Pre-nursery`,`Nursery`,`Reception`,`Year 1`,`Year 2`,`Year 3`,`Year 4`,`Year 5`,`Year 6`,`Year 7`,`Year 8`];function t(e,t){return t>=9?e:e-1}function n(e){let t=e+1;return`${e}/${String(t).slice(-2)}`}function r(e){return`1 September ${e} – 31 August ${e+1}`}function i(e=new Date){let t=e.getMonth()+1,n=e.getFullYear();return t>=9?n:n-1}function a(e){return e+3}function o(e,t){return a(e)+t}function s(t,r){let i=e[r],a=o(t,r);return{yearGroup:i,entryYear:a,academicYearLabel:n(a),entryDate:new Date(a,8,1)}}function c(n,a=new Date){let o=t(n.getFullYear(),n.getMonth()+1),c=o+1,l=e.map((e,t)=>s(o,t)),u=l[0],d=new Date(a.getFullYear(),a.getMonth(),a.getDate()),f=l.find(e=>e.entryDate>=d)??null;return{dateOfBirth:n,cohortStartYear:o,cohortEndYear:c,cohortLabel:r(o),firstPointOfEntry:u,allEntryPoints:l,nextPointOfEntry:f,currentAcademicYearStart:i(a)}}function l(e){let t=e.trim();if(!t)return null;let n=t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);if(n)return u(Number(n[1]),Number(n[2]),Number(n[3]));let r=t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);return r?u(Number(r[3]),Number(r[2]),Number(r[1])):null}function u(e,t,n){if(!e||!t||!n)return null;let r=new Date(e,t-1,n);return r.getFullYear()!==e||r.getMonth()!==t-1||r.getDate()!==n?null:r}function d(e){let t=e.trim();return t?/^\d{4}-\d{1,2}-\d{1,2}$/.test(t)||/^\d{1,2}[/.-]\d{1,2}[/.-]\d{4}$/.test(t):!1}function f(e){return e.toLocaleDateString(`en-GB`,{day:`numeric`,month:`long`,year:`numeric`})}var p=document.querySelector(`#app`);p.innerHTML=`
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
      <input
        id="dob"
        class="dob-input"
        type="text"
        inputmode="numeric"
        placeholder="DD/MM/YYYY"
        autocomplete="bday"
        spellcheck="false"
        aria-describedby="dob-hint dob-error"
      />
      <p id="dob-error" class="input-error hidden" role="alert"></p>
      <p id="dob-hint" class="hint">
        Type the date as <strong>DD/MM/YYYY</strong>, for example <strong>29/08/2023</strong>.
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
`;var m=document.querySelector(`#dob`),h=document.querySelector(`#dob-error`),g=document.querySelector(`#results`);function _(e){if(!e){h.textContent=``,h.classList.add(`hidden`),m.classList.remove(`dob-input-invalid`),m.removeAttribute(`aria-invalid`);return}h.textContent=e,h.classList.remove(`hidden`),m.classList.add(`dob-input-invalid`),m.setAttribute(`aria-invalid`,`true`)}function v(){let e=m.value,t=l(e);if(!e.trim()){_(``),g.classList.add(`hidden`),g.innerHTML=``;return}if(!t&&d(e)){_(`Please enter a valid date, for example 29/08/2023.`),g.classList.add(`hidden`),g.innerHTML=``;return}if(!t){_(``),g.classList.add(`hidden`),g.innerHTML=``;return}_(``),y(c(t))}function y(e){let{nextPointOfEntry:t,firstPointOfEntry:r}=e;g.classList.remove(`hidden`),g.innerHTML=`
    <section class="card highlight-card">
      <h2>Next point of entry</h2>
      ${t?`
        <p class="big-result">
          <span class="year-group">${t.yearGroup}</span>
          <span class="entry-year">September ${t.entryYear}</span>
        </p>
        <p class="subtle">
          Academic year ${t.academicYearLabel}
        </p>
      `:`
        <p class="big-result muted">
          All standard entry points through Year 8 have passed for this date of birth.
        </p>
      `}
    </section>

    <section class="card">
      <h2>First point of entry</h2>
      <p class="summary-line">
        <strong>${r.yearGroup}</strong> in September
        ${r.entryYear}
        <span class="pill">${r.academicYearLabel}</span>
      </p>
    </section>

    <section class="card">
      <h2>Cohort details</h2>
      <dl class="details-grid">
        <div>
          <dt>Date of birth</dt>
          <dd>${f(e.dateOfBirth)}</dd>
        </div>
        <div>
          <dt>Academic cohort</dt>
          <dd>${e.cohortLabel}</dd>
        </div>
        <div>
          <dt>Current academic year</dt>
          <dd>${n(e.currentAcademicYearStart)}</dd>
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
            ${e.allEntryPoints.map(e=>{let n=t?.yearGroup===e.yearGroup,r=e.entryDate<new Date(new Date().toDateString()),i=n?`Next entry`:r?`Past`:`Upcoming`;return`
                  <tr class="${n?`row-next`:``}">
                    <td>${e.yearGroup}</td>
                    <td>${e.entryYear}</td>
                    <td>${e.academicYearLabel}</td>
                    <td><span class="status status-${i.toLowerCase().replace(` `,`-`)}">${i}</span></td>
                  </tr>
                `}).join(``)}
          </tbody>
        </table>
      </div>
    </section>
  `}m.addEventListener(`input`,v),m.addEventListener(`change`,v);