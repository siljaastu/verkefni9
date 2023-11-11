/**
 * API föll.
 * @see https://lldev.thespacedevs.com/2.2.0/swagger/
 */

/**
 * Sækjum týpurnar okkar.
 * @typedef {import('./api.types.js').Launch} Launch
 * @typedef {import('./api.types.js').LaunchDetail} LaunchDetail
 * @typedef {import('./api.types.js').LaunchSearchResults} LaunchSearchResults
 */

/** Grunnslóð á API (DEV útgáfa) */
const API_URL = 'https://lldev.thespacedevs.com/2.2.0/';

/**
 * Skilar Promise sem bíður í gefnar millisekúndur.
 * Gott til að prófa loading state, en einnig hægt að nota `throttle` í
 * DevTools.
 * @param {number} ms Tími til að sofa í millisekúndum.
 * @returns {Promise<void>}
 */
export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), ms);
  });
}

/**
 * Leita í geimskota API eftir leitarstreng.
 * @param {string} query Leitarstrengur.
 * @returns {Promise<Launch[] | null>} Fylki af geimskotum eða `null` ef villa
 *  kom upp.
 */
export async function searchLaunches(query) {
  /* TODO útfæra */

  const url = new URL('launch', API_URL);
  url.searchParams.set('mode', 'list');
  url.searchParams.set('search', query);

  try {
    const response = await fetch(url);

    if (!response.ok) {
        console.error('Villa kom upp við að sækja gögn, ekki 200 staða');
        return null;
    }

    if (response.ok) {
        const launches = await response.json();

        return launches.results.map((launch) => {
            const { id, name, status, mission } = launch;
            const { name: statusName, description, abbrev } = status;

            return {
            id,
            name,
            status: {
                name: statusName,
                description,
                abbrev,
            },
            mission,
            };
        });
    } 
  } catch (e) {
    console.error('Villa kom upp við að sækja gögn');
  }

  return null;
}

/**
 * Skilar stöku geimskoti eftir auðkenni eða `null` ef ekkert fannst.
 * @param {string} id Auðkenni geimskots.
 * @returns {Promise<LaunchDetail | null>} Geimskot.
 */
export async function getLaunch(id) {
  /* TODO útfæra */

  const url = new URL(`launch/${id}`, API_URL);

  const res = await fetch(url);
  const details = await res.json();

  const { name, status, mission, window_start, window_end, image } = details;
  const { name: status_name, description: status_description, abbrev } = status;
  const { name: mission_name, description: mission_description } = mission;

  return {
    name,
    status: {
      name: status_name,
      description: status_description,
      abbrev,
    },
    mission: {
      name: mission_name,
      description: mission_description,
    },
    window_start,
    window_end,
    image,
  };
}
