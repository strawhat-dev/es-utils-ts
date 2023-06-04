import type { Path } from './types.js';
import type { Fn } from '../type-utils.js';
export declare const toUnix: Path['toUnix'];
/** @internal */
export declare const unixify: <T extends Fn>(fn: T) => T;
/** @internal */
export declare const isValidExt: (ext?: string, { ignore, maxLength }?: {
    ignore?: string[] | undefined;
    maxLength?: number | undefined;
}) => boolean | "";
/** @internal */
export declare const _format: Path['format'];
/** @internal */
export declare const _parse: Path['parse'];
