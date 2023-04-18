import type { Merge } from 'type-fest';
import type {
  JsObject,
  KeyOf,
  Maybe,
  Multi,
  NullishFalse,
  Type,
  Union,
  ValueOf,
} from '@/types';

export type MappedResult<T, WithChainedMethods> = ExtendedObject<
  Partial<T>,
  WithChainedMethods
>;

export type FilteredResult<
  T,
  WithRest,
  WithChainedMethods,
  Result = ExtendedObject<Partial<T>, WithChainedMethods>
> = WithRest extends true ? [Result, Result] : Result;

export type MapArgs<
  T,
  WithChainedMethods extends boolean,
  Options = {
    deep?: boolean;
    chainMethods?: WithChainedMethods;
  }
> = [MapFn<T>] | [Options, MapFn<T>];

export type FilterArgs<
  T,
  WithRest extends boolean,
  WithChainedMethods extends boolean,
  Options = {
    deep?: boolean;
    withRest?: WithRest;
    chainMethods?: WithChainedMethods;
  }
> = [] | [FilterFn<T>] | [Options, FilterFn<T>];

export type MapFn<T> = (
  key: Union<KeyOf<T>>,
  value: ValueOf<T>
) => NullishFalse | Multi<JsObject> | Multi<[unknown, unknown]>;

export type FilterFn<T> = (entry: {
  key: Union<KeyOf<T>>;
  value: ValueOf<T>;
}) => unknown;

export type FindKeyFn<T> = (value: ValueOf<T>, key: Union<KeyOf<T>>) => unknown;

export type ExtendedObject<T, WithChainedMethods = true> = Type<
  WithChainedMethods extends true
    ? Merge<ObjectMethods<T>, T & JsObject>
    : T & JsObject
>;

/** @internal */
type ObjectMethods<T> = {
  findkey: <T extends object>(
    obj: T,
    predicate?: FindKeyFn<T>
  ) => Maybe<KeyOf<T>>;
  map: <WithChainedMethods extends boolean = true>(
    ...args: MapArgs<T, WithChainedMethods>
  ) => MappedResult<T, WithChainedMethods>;
  filter: <
    WithRest extends boolean = false,
    WithChainedMethods extends boolean = true
  >(
    ...args: FilterArgs<T, WithRest, WithChainedMethods>
  ) => FilteredResult<T, WithRest, WithChainedMethods>;
};
