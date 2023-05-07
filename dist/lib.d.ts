/** trims a given string while also removing all empty lines */
declare const trimLines: (s: string) => string;
declare const add: (a: number, b: number) => number;
declare const sub: (a: number, b: number) => number;
declare const mult: (a: number, b: number) => number;
declare const div: (a: number, b: number) => number;
declare const mod: (a: number, b: number) => number;
declare const lt: (a: number, b: number) => boolean;
declare const gt: (a: number, b: number) => boolean;
declare const lte: (a: number, b: number) => boolean;
declare const gte: (a: number, b: number) => boolean;

export { add, div, gt, gte, lt, lte, mod, mult, sub, trimLines };
