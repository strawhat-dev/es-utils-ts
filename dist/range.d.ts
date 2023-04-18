/**
 * Generates a range of numbers, however implemented as an iterator
 * and does not create a new array unlike most range implementations,
 * unless an array method is called. Trap for `in` operator via `Proxy`
 * is also implemented to allow for the "python-like" behavior of quickly
 * testing if a number falls between a range of numbers.
 * i.e.
 * ```ts
 * if (score in range(90, 100)) grade = 'A'
 * // instead of...
 * if (score >= 90 && score < 100) grade = 'A'
 * ```
 */
declare const range: (start?: number, stop?: number, step?: number) => {
    [x: number]: number;
    toString: (() => string) & (() => string);
    toLocaleString: (() => string) & (() => string);
    pop: () => number | undefined;
    push: (...items: number[]) => number;
    concat: {
        (...items: ConcatArray<number>[]): number[];
        (...items: (number | ConcatArray<number>)[]): number[];
    };
    join: (separator?: string | undefined) => string;
    reverse: () => number[];
    shift: () => number | undefined;
    slice: (start?: number | undefined, end?: number | undefined) => number[];
    sort: (compareFn?: ((a: number, b: number) => number) | undefined) => number[];
    splice: {
        (start: number, deleteCount?: number | undefined): number[];
        (start: number, deleteCount: number, ...items: number[]): number[];
    };
    unshift: (...items: number[]) => number;
    indexOf: (searchElement: number, fromIndex?: number | undefined) => number;
    lastIndexOf: (searchElement: number, fromIndex?: number | undefined) => number;
    every: {
        <S extends number>(predicate: (value: number, index: number, array: number[]) => value is S, thisArg?: any): this is S[];
        (predicate: (value: number, index: number, array: number[]) => unknown, thisArg?: any): boolean;
    };
    some: (predicate: (value: number, index: number, array: number[]) => unknown, thisArg?: any) => boolean;
    forEach: (callbackfn: (value: number, index: number, array: number[]) => void, thisArg?: any) => void;
    map: <U>(callbackfn: (value: number, index: number, array: number[]) => U, thisArg?: any) => U[];
    filter: {
        <S_1 extends number>(predicate: (value: number, index: number, array: number[]) => value is S_1, thisArg?: any): S_1[];
        (predicate: (value: number, index: number, array: number[]) => unknown, thisArg?: any): number[];
    };
    reduce: {
        (callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number): number;
        (callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number, initialValue: number): number;
        <U_1>(callbackfn: (previousValue: U_1, currentValue: number, currentIndex: number, array: number[]) => U_1, initialValue: U_1): U_1;
    };
    reduceRight: {
        (callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number): number;
        (callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number, initialValue: number): number;
        <U_2>(callbackfn: (previousValue: U_2, currentValue: number, currentIndex: number, array: number[]) => U_2, initialValue: U_2): U_2;
    };
    find: {
        <S_2 extends number>(predicate: (value: number, index: number, obj: number[]) => value is S_2, thisArg?: any): S_2 | undefined;
        (predicate: (value: number, index: number, obj: number[]) => unknown, thisArg?: any): number | undefined;
    };
    findIndex: (predicate: (value: number, index: number, obj: number[]) => unknown, thisArg?: any) => number;
    fill: (value: number, start?: number | undefined, end?: number | undefined) => number[];
    copyWithin: (target: number, start: number, end?: number | undefined) => number[];
    entries: () => IterableIterator<[number, number]>;
    keys: () => IterableIterator<number>;
    values: () => IterableIterator<number>;
    includes: (searchElement: number, fromIndex?: number | undefined) => boolean;
    flatMap: <U_3, This = undefined>(callback: (this: This, value: number, index: number, array: number[]) => U_3 | readonly U_3[], thisArg?: This | undefined) => U_3[];
    flat: <A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[];
    at: (index: number) => number | undefined;
    findLast: {
        <S_3 extends number>(predicate: (value: number, index: number, array: number[]) => value is S_3, thisArg?: any): S_3 | undefined;
        (predicate: (value: number, index: number, array: number[]) => unknown, thisArg?: any): number | undefined;
    };
    findLastIndex: (predicate: (value: number, index: number, array: number[]) => unknown, thisArg?: any) => number;
    [Symbol.iterator]: () => IterableIterator<number>;
    readonly [Symbol.unscopables]: {
        [x: number]: boolean | undefined;
        length?: boolean | undefined;
        toString?: boolean | undefined;
        toLocaleString?: boolean | undefined;
        pop?: boolean | undefined;
        push?: boolean | undefined;
        concat?: boolean | undefined;
        join?: boolean | undefined;
        reverse?: boolean | undefined;
        shift?: boolean | undefined;
        slice?: boolean | undefined;
        sort?: boolean | undefined;
        splice?: boolean | undefined;
        unshift?: boolean | undefined;
        indexOf?: boolean | undefined;
        lastIndexOf?: boolean | undefined;
        every?: boolean | undefined;
        some?: boolean | undefined;
        forEach?: boolean | undefined;
        map?: boolean | undefined;
        filter?: boolean | undefined;
        reduce?: boolean | undefined;
        reduceRight?: boolean | undefined;
        find?: boolean | undefined;
        findIndex?: boolean | undefined;
        fill?: boolean | undefined;
        copyWithin?: boolean | undefined;
        entries?: boolean | undefined;
        keys?: boolean | undefined;
        values?: boolean | undefined;
        includes?: boolean | undefined;
        flatMap?: boolean | undefined;
        flat?: boolean | undefined;
        at?: boolean | undefined;
        findLast?: boolean | undefined;
        findLastIndex?: boolean | undefined;
        [Symbol.iterator]?: boolean | undefined;
        readonly [Symbol.unscopables]?: boolean | undefined;
    };
    readonly start: number;
    readonly stop: number;
    readonly step: number;
    readonly length: number;
};

export { range };
