export { default as deepclone } from 'rfdc/default';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

declare const deepcompare: (a: unknown, b: unknown, { strict }?: {
    strict?: boolean | undefined;
}) => boolean;

export { deepcompare };
