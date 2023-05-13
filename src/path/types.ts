import type { PlatformPath } from 'path/posix';

export interface Path extends PlatformPath {
  posix: Path;
  win32: Path;
  /**
   * Converts **all** `\` to `/` and consolidates
   * duplicates without performing any normalization.
   */
  toUnix(path: string): string;
  /**
   * Trims a path's extension.
   */
  trimExt(path: string, options?: ExtOptions): string;
  /**
   * Adds a given extension,
   * *but only if the path provided doesn't already have the exact extension*.
   */
  addExt(path: string, ext: string): string;
  /**
   * Remove a given extension if possible
   * *(otherwise left as is)*.
   */
  removeExt(path: string, ext: string): string;
  /**
   * Changes an extension given the `ext` provided. \
   * *(Extension added if no valid extension already available)*
   */
  changeExt(path: string, ext: string, options?: ExtOptions): string;
  /**
   * Adds a given extension,
   * *but only if the path provided did not already have any extensions before*.
   */
  defaultExt(path: string, ext: string, options?: ExtOptions): string;
}

type ExtOptions = {
  /**
   * Do not the consider extensions listed, if provided.
   */
  ignore?: string[];
  /**
   * Consider extensions up to `maxLength` long *(counting the `.`)*.
   * @defaultValue `7`
   */
  maxLength?: number;
};
