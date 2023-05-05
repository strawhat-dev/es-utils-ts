// prettier-ignore
/** trims a given string while also removing all empty lines */
export const trimLines = (s: string) => s.split(/\r?\n/).filter((line) => line.trim()).join('\n');
