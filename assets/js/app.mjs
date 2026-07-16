import { situations, profileDoctors, ratings } from './content.mjs';
import { toggleExclusive, clampPercent, pairPageCount, movePage, activateStep, nextFactIndex } from './ui-state.mjs';

const situationGrid = document.querySelector('#situation-grid');
let activeSituation = null;

const rotatingFacts = document.querySelector('[data-rotating-facts]');
if (rotatingFacts) {
  const factItems = [...rotatingFacts.querySelectorAll('[data-fact]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let factIndex = 0;
  let factTimer = null;
  const renderFact = () => {
    rotatingFacts.style.setProperty('--fact-index', factIndex);
    factItems.forEach((item, index) => item.classList.toggle('is-active', index === factIndex));
  };
  const stopFacts = () => { clearInterval(factTimer); factTimer = null; };
  const startFacts = () => {
    if (reducedMotion || factTimer || document.hidden) return;
    factTimer = setInterval(() => { factIndex = nextFactIndex(factIndex, factItems.length); renderFact(); }, 2000);
  };
  rotatingFacts.addEventListener('mouseenter', stopFacts);
  rotatingFacts.addEventListener('mouseleave', startFacts);
  rotatingFacts.addEventListener('focusin', stopFacts);
  rotatingFacts.addEventListener('focusout', event => { if (!rotatingFacts.contains(event.relatedTarget)) startFacts(); });
  document.addEventListener('visibilitychange', () => document.hidden ? stopFacts() : startFacts());
  renderFact();
  startFacts();
}

if (situationGrid) {
  situationGrid.innerHTML = situations.map(item => `
    <button class="situation-card" type="button" aria-expanded="false" data-situation="${item.id}">
      <span class="situation-card__front"><span class="situation-card__title">${item.title}</span><span class="situation-card__photo" aria-hidden="true"><img src="${item.image}" alt=""></span></span>
      <span class="situation-card__back"><strong>${item.title}</strong><span>${item.text}</span></span>
    </button>`).join('');
  situationGrid.addEventListener('click', event => {
    const card = event.target.closest('[data-situation]');
    if (!card) return;
    activeSituation = toggleExclusive(activeSituation, card.dataset.situation);
    for (const item of situationGrid.querySelectorAll('[data-situation]')) item.setAttribute('aria-expanded', String(item.dataset.situation === activeSituation));
  });
}

const dialog = document.querySelector('#consult-dialog');
for (const trigger of document.querySelectorAll('[data-open-consultation]')) trigger.addEventListener('click', () => dialog?.showModal());
document.querySelector('[data-close-consultation]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
for (const form of document.querySelectorAll('[data-demo-form]')) form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  form.querySelector('.form-status').textContent = 'Спасибо! Это демонстрационный макет формы.';
});

for (const comparison of document.querySelectorAll('.comparison')) {
  const range = comparison.querySelector('input[type="range"]');
  range?.addEventListener('input', () => comparison.style.setProperty('--position', `${clampPercent(range.value)}%`));
}

const stepRoute = document.querySelector('.steps-route');
if (stepRoute) {
  const stepButtons = [...stepRoute.querySelectorAll('[data-step]')];
  const stepPanels = [...stepRoute.querySelectorAll('[data-step-panel]')];
  let activeStep = 0;
  const renderStep = requestedIndex => {
    activeStep = activateStep(activeStep, requestedIndex, stepButtons.length);
    stepRoute.style.setProperty('--step-progress', `${stepButtons.length > 1 ? activeStep / (stepButtons.length - 1) * 100 : 0}%`);
    stepButtons.forEach((button, index) => {
      const selected = index === activeStep;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    stepPanels.forEach((panel, index) => { panel.hidden = index !== activeStep; });
  };
  stepButtons.forEach((button, index) => {
    button.addEventListener('click', () => renderStep(index));
    button.addEventListener('keydown', event => {
      const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!delta) return;
      event.preventDefault();
      const next = (activeStep + delta + stepButtons.length) % stepButtons.length;
      renderStep(next);
      stepButtons[next].focus();
    });
  });
  renderStep(0);
}

const faqItems = [...document.querySelectorAll('[data-faq]')];
for (const button of faqItems) button.addEventListener('click', () => {
  const wasOpen = button.getAttribute('aria-expanded') === 'true';
  for (const item of faqItems) {
    item.setAttribute('aria-expanded', 'false');
    item.nextElementSibling.hidden = true;
  }
  if (!wasOpen) { button.setAttribute('aria-expanded', 'true'); button.nextElementSibling.hidden = false; }
});

const teamMobileSlides = [...document.querySelectorAll('.team-mobile-slide')];
const teamMobileTrack = document.querySelector('#team-mobile-track');
if (teamMobileTrack && teamMobileSlides.length) {
  let teamMobilePage = 0;
  const renderTeamMobilePage = () => {
    teamMobileTrack.style.transform = `translateX(-${teamMobilePage * 100}%)`;
    document.querySelector('#team-mobile-count').textContent = `${teamMobilePage + 1} / ${teamMobileSlides.length}`;
  };
  document.querySelector('[data-team-mobile-prev]')?.addEventListener('click', () => {
    teamMobilePage = movePage(teamMobilePage, -1, teamMobileSlides.length);
    renderTeamMobilePage();
  });
  document.querySelector('[data-team-mobile-next]')?.addEventListener('click', () => {
    teamMobilePage = movePage(teamMobilePage, 1, teamMobileSlides.length);
    renderTeamMobilePage();
  });
  renderTeamMobilePage();
}

const doctorTrack = document.querySelector('#doctor-track');
if (doctorTrack) {
  doctorTrack.innerHTML = profileDoctors.map(doctor => `<a class="doctor-card" href="${doctor.href}"><img src="${doctor.image}" alt="${doctor.name}"><strong>${doctor.name}</strong><span>${doctor.role}</span></a>`).join('');
  let doctorPage = 0;
  const perPage = () => innerWidth <= 480 ? 1 : innerWidth <= 767 ? 2 : 4;
  const renderDoctors = () => {
    const pages = pairPageCount(profileDoctors.length, perPage());
    doctorPage %= pages;
    doctorTrack.style.transform = `translateX(-${doctorPage * 100}%)`;
    document.querySelector('#doctor-progress').style.width = `${100 / pages}%`;
    document.querySelector('#doctor-progress').style.transform = `translateX(${doctorPage * 100}%)`;
  };
  document.querySelector('[data-doctor-prev]')?.addEventListener('click', () => { doctorPage = movePage(doctorPage, -1, pairPageCount(profileDoctors.length, perPage())); renderDoctors(); });
  document.querySelector('[data-doctor-next]')?.addEventListener('click', () => { doctorPage = movePage(doctorPage, 1, pairPageCount(profileDoctors.length, perPage())); renderDoctors(); });
  addEventListener('resize', renderDoctors); renderDoctors();
}

const ratingsGrid = document.querySelector('#ratings-grid');
if (ratingsGrid) ratingsGrid.innerHTML = ratings.map(item => `<a class="rating-card" href="https://www.mc-podmoskovie.ru/otzyvy/"><h3>${item.name}</h3><div><strong>${item.score}</strong> <span class="stars" aria-label="5 звёзд">★★★★★</span><small>${item.reviews}</small></div></a>`).join('');

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.08});
  for (const section of document.querySelectorAll('main > section:not(#hero)')) { section.classList.add('reveal'); observer.observe(section); }
}
