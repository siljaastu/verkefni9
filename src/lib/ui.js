import { getLaunch, searchLaunches } from './api.js';
import { el } from './elements.js';

/**
 * Býr til leitarform.
 * @param {(e: SubmitEvent) => void} searchHandler Fall sem keyrt er þegar leitað er.
 * @param {string | undefined} query Leitarstrengur.
 * @returns {HTMLElement} Leitarform.
 */
export function renderSearchForm(searchHandler, query = undefined) {
  /* TODO útfæra */

  const form = el(
    'form',
    { id: 'search-form' },
    el('input', { name: 'query', value: query ?? '' }),
    el('button', { class: 'button' }, 'Leita'),
  );

  form.addEventListener('submit', searchHandler);

  return form;
}

/**
 * Setur „loading state“ skilabað meðan gögn eru sótt.
 * @param {HTMLElement} parentElement Element sem á að birta skilbaoð í.
 * @param {Element | undefined} searchForm Leitarform sem á að gera óvirkt.
 */
function setLoading(parentElement, searchForm = undefined) {
  /* TODO útfæra */

  parentElement.appendChild(el('p', { id: 'loading' }, 'Sæki gögn...'));

  if (searchForm) {
    searchForm.querySelector('button').setAttribute('disabled', 'disabled');
  }
}

/**
 * Fjarlægir „loading state“.
 * @param {HTMLElement} parentElement Element sem inniheldur skilaboð.
 * @param {Element | undefined} searchForm Leitarform sem á að gera virkt.
 */
function setNotLoading(parentElement, searchForm = undefined) {
  /* TODO útfæra */

  const child = parentElement.querySelector('#loading');
  if (child) {
    parentElement.removeChild(child);
  }

  if (searchForm) {
    searchForm.querySelector('button[disabled]').removeAttribute('disabled');
  }
}

/**
 * Birta niðurstöður úr leit.
 * @param {import('./api.types.js').Launch[] | null} results Niðurstöður úr leit
 * @param {string} query Leitarstrengur.
 */
function createSearchResults(results, query) {
  /* TODO útfæra */

  const list = el('ul', { class: 'search-results' });

  if (!results) {
    list.appendChild(el('li', {}, 'Villa kom upp við leit'));
  } else if (results.length === 0) {
    list.appendChild(el('li', {}, `Engar niðurstöður fundust fyrir: ${query}`));
  } else {
    results.forEach((result) => {
      const url = new URL(window.location.origin);
      url.searchParams.set('id', result.id);

      list.appendChild(
        el(
          'li',
          { class: 'search-result' },
          el('a', { href: url }, result.name),
          el(
            'div',
            {},
            el('span', { class: 'mission' }, result.mission),
            el('span', { class: 'status' }, ` - ${result.status.name}`),
          ),
        ),
      );
    });
  }

  return list;
}

/**
 *
 * @param {HTMLElement} parentElement Element sem á að birta niðurstöður í.
 * @param {Element} searchForm Form sem á að gera óvirkt.
 * @param {string} query Leitarstrengur.
 */
export async function searchAndRender(parentElement, searchForm, query) {
  /* TODO útfæra */

  const oldResults = parentElement.querySelector('.search-results');
  if (oldResults) {
    parentElement.removeChild(oldResults);
  }

  setLoading(parentElement, searchForm);
  const results = await searchLaunches(query);
  setNotLoading(parentElement, searchForm);

  parentElement.appendChild(createSearchResults(results, query));
}

/**
 * Sýna forsíðu, hugsanlega með leitarniðurstöðum.
 * @param {HTMLElement} parentElement Element sem á að innihalda forsíðu.
 * @param {(e: SubmitEvent) => void} searchHandler Fall sem keyrt er þegar leitað er.
 * @param {string | undefined} query Leitarorð, ef eitthvað, til að sýna niðurstöður fyrir.
 */
export function renderFrontpage(
  parentElement,
  searchHandler,
  query = undefined,
) {
  const heading = el('h1', {}, 'Geimskotaleitin 🚀');
  const searchForm = renderSearchForm(searchHandler, query);
  const container = el('main', {}, heading, searchForm);
  parentElement.appendChild(container);

  if (!query) {
    return;
  }

  searchAndRender(container, searchForm, query);
}

/**
 * Sýna geimskot.
 * @param {HTMLElement} parentElement Element sem á að innihalda geimskot.
 * @param {string} id Auðkenni geimskots.
 */
export async function renderDetails(parentElement, id) {
  const container = el('main', {});
  const backElement = el(
    'div',
    { class: 'back' },
    el('a', { href: '/' }, 'Til baka'),
  );

  backElement.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back();
  });

  container.appendChild(backElement);
  parentElement.appendChild(container);

  /* TODO setja loading state og sækja gögn */
  setLoading(container);
  const result = await getLaunch(id);
  setNotLoading(container);

  // Tómt og villu state, við gerum ekki greinarmun á þessu tvennu, ef við
  // myndum vilja gera það þyrftum við að skilgreina stöðu fyrir niðurstöðu
  if (!result) {
    /* TODO útfæra villu og tómt state */
    container.appendChild(el('p', {}, 'Villa við að sækja gögn!'));
  }

  /* TODO útfæra ef gögn */

  container.appendChild(
    el(
      'div',
      { class: 'launch-details' },
      el('h1', { class: 'launch-name' }, result?.name ?? ''),
      el('p', { class: 'window' }, `Gluggi opnast: ${result?.window_start}`),
      el('p', { class: 'window' }, `Gluggi lokast: ${result?.window_end}`),
      el('h3', { class: 'mission-name' }, `Geimferð: ${result?.mission.name}`),
      el(
        'p',
        { class: 'mission-description' },
        result?.mission.description ?? '',
      ),
      el('h3', { class: 'status-name' }, `Staða: ${result?.status.name}`),
      el(
        'p',
        { class: 'status-description' },
        result?.status.description ?? '',
      ),
      el('img', { src: result?.image }),
    ),
  );
}
