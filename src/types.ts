/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type {
  IsLiteral as LiteralCheck,
  LiteralToPrimitive,
  OmitIndexSignature,
  Simplify,
} from 'type-fest';

// common type utilities
export type Multi<T> = T | T[];
export type Numeric = number | bigint;
export type NumberLike = number | `${number}`;
export type Maybe<T> = T | undefined;
export type Nullable<T> = T | null;
export type Nullish = null | undefined;
export type NullishFalse = Simplify<Nullish | false>;

/** any non-nullish value */
export interface Unknown {}

/** any non-object value */
export type primitive = Simplify<Primitive | symbol>;

/** js primitves (without symbol) */
export type Primitive = Simplify<string | boolean | Numeric | Nullish>;

/** objects or primitves (without symbol) */
export type JsValue = Simplify<Primitive | object>;

/** plain js objects */
export type JsObject<value = JsValue> = { [key: string]: value };

/**
 * If possible, creates a union type from a given object's keys;
 * else falls back to `string` by default.
 */
export type KeyOf<T, Fallback = string> = Type<
  keyof T extends never
    ? Fallback
    : keyof OmitIndexSignature<T> extends never
    ? keyof T
    : keyof OmitIndexSignature<T>
>;

/**
 * If possible, creates a union type from a given object's values;
 * else falls back to any js value.
 */
export type ValueOf<T, Fallback = JsValue> = Type<
  keyof T extends never
    ? Fallback
    : T[keyof T] extends never
    ? Fallback
    : T[keyof T]
>;

/**
 * Generic that allows for both the literal
 * and base types without sacrificing completions.
 * (base type automatically inferred from given literal)
 */
export type Union<T> = Type<
  T | (IsLiteral<T> extends true ? LiteralToPrimitive<T> & Unknown : Narrow<T>)
>;

/**
 * Narrows down a type to its base type as much as possible.
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
    : Unknown
>;

/**
 * @internal
 * Utility type that is only used to contain long type definitions
 * within angle brackets without leaving hanging indents.
 */
export type Type<T> = T;

/**
 * @internal
 * Wrapped `IsLiteral` from type-fest
 */
type IsLiteral<T> = T extends primitive ? LiteralCheck<T> : false;
