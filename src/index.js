import {empty} from './lib/elements.js';
import {renderDetails, renderFrontpage, searchAndRender} from './lib/ui.js';

/**
 * Fall sem keyrir við leit.
 * @param {SubmitEvent} e
 * @returns {Promise<void>}
 */
async function onSearch(e) {
    /* TODO útfæra */
    e.preventDefault();

    const {target} = e;
    const formData = new FormData(target);
    const query = formData.get('query');

    if (query) {
        await searchAndRender(
            document.querySelector('main'), 
            document.querySelector('#search-form'), 
            query
        );

        window.history.pushState({}, '', `?query=${query}`)
    }
}

/**
 * Athugar hvaða síðu við erum á út frá query-string og birtir.
 * Ef `id` er gefið er stakt geimskot birt, annars er forsíða birt með
 * leitarniðurstöðum ef `query` er gefið.
 */
function route() {
    /* TODO athuga hvaða síðu á að birta og birta */

    const {search} = document.location;
    const params = new URLSearchParams(search);

    if (params.has('id')) {
        renderDetails(document.body, params.get('id'));
    } else {
        renderFrontpage(document.body, onSearch, params.get('query') ?? undefined);
    }
}

// Bregst við því þegar við notum vafra til að fara til baka eða áfram.
window.onpopstate = () => {
    /* TODO bregðast við */
    console.log('pop state')
};

// Athugum í byrjun hvað eigi að birta.
route();
