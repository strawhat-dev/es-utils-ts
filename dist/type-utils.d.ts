import { Spreadable } from 'type-fest/source/spread.js';
import { Primitive, OmitIndexSignature, UnionToIntersection, EmptyObject, ConditionalKeys, ConditionalExcept, Spread as Spread$1, PickIndexSignature } from 'type-fest';

interface NonNullish {
}
type Nullish = null | undefined;
type NullishOrFalse = null | undefined | false;
type Maybe<T> = T | undefined;
type Nullable<T> = T | null;
type Multi<T> = T | T[];
type Numeric = number | bigint;
type NumberLike = number | `${number}`;
type Value = Primitive | object;
type JsObject<value = Value> = {
    [key: string]: value;
};
type AsyncFunction = (...args: any[]) => Promise<any>;
type Fn<T extends {
    args?: readonly Value[];
    returns?: Value;
} = {
    args: any[];
    returns: any;
}> = (...args: T['args'] extends any[] ? T['args'] : any[]) => T extends {
    returns: infer R;
} ? R : void;
type KeyOf<T, Explicit = OmitIndexSignature<Readonly<UnionToIntersection<T>>>, Key = keyof (Explicit extends EmptyObject ? T : Explicit)> = Key extends keyof (IsUnion<T> extends true ? Explicit : T) ? `${Exclude<Key, symbol>}` : never;
type KeyOfDeep<T, current = OmitIndexSignature<Readonly<T>>, nested extends keyof current = ConditionalKeys<current, JsObject<any>>> = KeyOf<current> | (nested extends never ? never : KeyOfDeep<current[nested]>);
type ValueOf<T, Key = KeyOf<T>> = Key extends keyof T ? T[Key] : {};
type ValueOfDeep<T, current = OmitIndexSignature<Readonly<T>>, nested extends keyof current = ConditionalKeys<current, JsObject<any>>> = current[KeysExcept<current, JsObject<any>>] | (nested extends never ? never : ValueOfDeep<current[nested]>);
type KeysExcept<T, ExcludedTypes> = keyof ConditionalExcept<T, ExcludedTypes>;
type Union<T> = IsLiteral<T> extends true ? T | (Narrow<T> & NonNullish) : T;
type Spread<T1, T2, Fallback extends Spreadable = EmptyOf<T1> extends Spreadable ? EmptyOf<T1> : EmptyOf<T2> extends Spreadable ? EmptyOf<T2> : {}> = Spread$1<T1 extends Spreadable ? T1 : Fallback, T2 extends Spreadable ? T2 : Fallback>;
type Narrow<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends undefined ? undefined : T extends null ? null : T extends readonly (infer Item)[] ? Narrow<Item>[] : T extends ReadonlySet<infer Item> ? Set<Narrow<Item>> : T extends ReadonlyMap<infer K, infer V> ? Map<Narrow<K>, Narrow<V>> : T extends Promise<infer Resolved> ? Promise<Narrow<Resolved>> : T extends JsObject<infer Values> ? JsObject<Narrow<Values>> : T extends object ? object : {};
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type IsLiteral<T> = string extends T ? false : number extends T ? false : boolean extends T ? false : object extends T ? false : Function extends T ? false : [T] extends [never] ? false : T extends readonly (infer Item)[] ? IsLiteral<Item> : T extends JsObject ? Extends<PickIndexSignature<T>, EmptyObject> : Extends<T, Primitive>;
type Extends<T1, T2> = [T1] extends [never] ? false : [T2] extends [never] ? false : T1 extends T2 ? true : false;
type SimplifyDeep<T> = T extends Function | Iterable<unknown> ? T : T extends object ? {
    [key in keyof T]: SimplifyDeep<T[key]>;
} : T;
type EmptyOf<T> = T extends string ? '' : T extends number ? 0 : T extends readonly any[] ? [] : {};
type HTMLTag = keyof HTMLElementTagNameMap;
type HTMLElementProps<T extends HTMLTag = 'div'> = ConditionalExcept<HTMLElementTagNameMap[T], Function>;

export { AsyncFunction, EmptyOf, Extends, Fn, HTMLElementProps, HTMLTag, IsLiteral, IsUnion, JsObject, KeyOf, KeyOfDeep, KeysExcept, Maybe, Multi, Narrow, NonNullish, Nullable, Nullish, NullishOrFalse, NumberLike, Numeric, SimplifyDeep, Spread, Union, Value, ValueOf, ValueOfDeep };
