export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

declare const deepclone: <T>(source: T) => T;
declare const deepcompare: (a: unknown, b: unknown, { strict }?: {
    strict?: boolean | undefined;
}) => boolean;

export { deepclone, deepcompare };
