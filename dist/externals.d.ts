export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';
export { default as range } from 'just-range';
export { default as inspect } from 'object-inspect';
export { default as escapeRegex } from 'escape-string-regexp';

declare const deepclone: <T>(source: T) => T;
declare const deepcompare: (a: unknown, b: unknown, { strict }?: {
    strict?: boolean | undefined;
}) => boolean;

export { deepclone, deepcompare };
