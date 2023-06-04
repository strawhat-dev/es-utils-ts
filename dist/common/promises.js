const ESM_CDN_URL = 'https://esm.run';
/**
 * Schedules a `Promise` that resolves after a delay of `ms` milliseconds.
 */
// prettier-ignore
export const sleep = async (ms) => (new Promise((res) => setTimeout(res, +ms)));
/**
 * Dynamically import any *esm* module using a cdn (jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
export const cdn = async (name) => {
    const mod = await import(`${ESM_CDN_URL}/${name}`);
    return mod?.default || mod;
};
