export * from './range.js';
export * from './promises.js';

// prettier-ignore
/** trims a given string while also removing all empty lines */
export const trimLines = (s: string) => s.split(/\r?\n/).filter((line) => line.trim()).join('\n');

// functional operators
export const add = (a: number, b: number) => a + b;
export const sub = (a: number, b: number) => a - b;
export const mult = (a: number, b: number) => a * b;
export const div = (a: number, b: number) => a / b;
export const mod = (a: number, b: number) => a % b;
export const lt = (a: number, b: number) => a < b;
export const gt = (a: number, b: number) => a > b;
export const lte = (a: number, b: number) => a <= b;
export const gte = (a: number, b: number) => a >= b;
