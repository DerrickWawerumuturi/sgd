export interface IScope<T> {
  /**
   * get scope value
   */
  (): T;

  /**
   * pass down scope value to specified func
   * @param func
   * @param args
   * @param context
   */
  <U>(func: () => U, args?: IArguments | any[], context?: any): U;

  /**
   * change value of scope and pass down that value to specified func
   * @param value
   * @param func
   * @param args
   * @param context
   */
  <U>(value: T, func: () => U, args?: IArguments | any[], context?: any): U;
}

export type IScopeItem = [IScope<any>, any];

/**
 * get current value of default scope
 */
declare function iscope(): any;

declare function iscope<T>(
  value: IScopeItem[],
  func: () => T,
  args?: IArguments | any[],
  context?: any,
): T;

/**
 * change value of default scope and pass down that value to specified func
 * @param value
 * @param func
 * @param args
 * @param context
 */
declare function iscope<T>(
  value: any,
  func: () => T,
  args?: IArguments | any[],
  context?: any,
): T;

/**
 * create a iscope with specified initial value
 * @param init
 */
declare function iscope<T>(init: Initializer<T> | T): IScope<T>;

type Initializer<T> = () => T;

export default iscope;
