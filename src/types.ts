/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type {
  ConditionalKeys,
  IsLiteral as LiteralCheck,
  LiteralToPrimitive,
  OmitIndexSignature,
  Simplify,
  StringKeyOf,
  UnionToIntersection,
} from 'type-fest';

// simple common type utilities
export type Numeric = number | bigint;
export type NumberLike = number | `${number}`;
export type Nullish = null | undefined;
export type Nullable<T> = T | null;
export type Maybe<T> = T | Nullish;
export type Multi<T> = T | T[];

/**
 * *common primitves*
 * (may be serializable or literally typed).
 * @see {@link primitive} for any primitives
 */
export type Primitive = Simplify<string | boolean | number | Nullish>;

/** any **non-nullish** value. */
export interface Defined {}

/** any **non-object** value. */
export type primitive = Simplify<Primitive | bigint | symbol>;

/** any js value *(primitves or objects)*. */
export type JsValue = Simplify<primitive | object>;

/** **plain** js objects. */
export type JsObject<value = unknown> = { [key: string]: value };

/**
 * More reliably extract and create types from a given type's keys by joining
 * any union types into an intersection (so that `never` is not returned)
 * and omitting the index signature (so that literal keys may be resolved).
 */
export type KeyOf<
  T,
  Fallback = string,
  Target = Normalize<T>
> = StringKeyOf<Target> extends never ? Fallback : StringKeyOf<Target>;

/**
 * Create a union type from a given object's values if possible;
 * else falls back to any js value by default.
 */
export type ValueOf<
  T,
  Fallback = JsValue,
  Target = Normalize<T>
> = KeyOf<T> extends keyof Target ? Target[KeyOf<T>] : Fallback;

/**
 * Like {@link KeyOf}, but recursively extracts all keys, including nested ones.
 */
export type KeyOfDeep<
  T,
  Current = Normalize<T>,
  Nested extends keyof Current = ConditionalKeys<Current, JsObject>
> = KeyOf<T> | (Nested extends never ? never : KeyOfDeep<Current[Nested]>);

/**
 * Like {@link ValueOf}, but recursively extracts all value types, including nested ones.
 */
export type ValueOfDeep<
  T,
  Current = Normalize<T>,
  Nested extends keyof Current = ConditionalKeys<Current, JsObject>
> = ValueOf<T> | (Nested extends never ? never : ValueOfDeep<Current[Nested]>);

/**
 * Generic that allows for both the literal and
 * base types without sacrificing completions.
 * (base type automatically inferred from given literal)
 */
export type Union<T> = Type<
  T | (IsLiteral<T> extends true ? LiteralToPrimitive<T> & Defined : Narrow<T>)
>;

/**
 * Narrow down a type to a base type.
 */
export type Narrow<T> = Type<
  T extends Promise<infer Resolved>
    ? Promise<Narrow<Resolved>>
    : T extends (infer Item)[]
    ? Narrow<Item>[]
    : T extends Set<infer Item>
    ? Set<Narrow<Item>>
    : T extends Map<infer K, infer V>
    ? Map<Narrow<K>, Narrow<V>>
    : T extends Function
    ? Function
    : T extends JsObject
    ? JsObject
    : T extends object
    ? object
    : T extends primitive
    ? LiteralToPrimitive<T>
    : Defined
>;

/**
 * @internal
 * Utility type only used to contain long type definitions
 * within angle brackets without leaving hanging indents.
 */
export type Type<T> = T;

/**
 * @internal
 * Utility type to quickly check whether `T1` extends `T2`.
 */
export type Extends<T1, T2> = T1 extends T2 ? true : false;

/**
 * @internal
 * Ensure a type can be resolved as a single type by joining
 * any unions into intersections, and omits the index signature
 */
type Normalize<T> = OmitIndexSignature<UnionToIntersection<T>>;

/**
 * @internal
 * Wrapped `IsLiteral` from type-fest
 */
type IsLiteral<T> = T extends primitive ? LiteralCheck<T> : false;
