import type { PartialDeep } from 'type-fest';
import type {
  JsObject,
  KeyOf,
  KeyOfDeep,
  Multi,
  Nullish,
  Type,
  Union,
  ValueOf,
  ValueOfDeep,
} from '@/types';

export type MapArgs<T, Deep extends boolean> = Type<
  [MapFn<T, Deep>] | [{ deep?: Deep }, MapFn<T, Deep>]
>;

export type FilterArgs<
  T,
  Deep extends boolean,
  WithRest extends boolean
> = Type<
  | []
  | [FilterFn<T, Deep>]
  | [{ deep?: Deep; withRest?: WithRest }, FilterFn<T, Deep>]
>;

export type MappedResult<T, Deep> = Type<
  (Deep extends true ? PartialDeep<T> : Partial<T>) & JsObject
>;

export type FilteredResult<T, Deep, WithRest> = Type<
  WithRest extends true
    ? [MappedResult<T, Deep>, MappedResult<T, Deep>]
    : MappedResult<T, Deep>
>;

export type MapFn<T, Deep> = (
  key: Union<Deep extends true ? KeyOfDeep<T> : KeyOf<T>>,
  value: Union<Deep extends true ? ValueOfDeep<T> : ValueOf<T>>
) => (false | Nullish) | Multi<JsObject> | Multi<[unknown, unknown]>;

export type FilterFn<T, Deep> = (entry: {
  key: Union<Deep extends true ? KeyOfDeep<T> : KeyOf<T>>;
  value: Union<Deep extends true ? ValueOfDeep<T> : ValueOf<T>>;
}) => unknown;

export type FindKeyFn<T> = (
  value: Union<ValueOf<T>>,
  key: Union<KeyOf<T>>
) => unknown;
