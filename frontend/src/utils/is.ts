export function isArray(val): boolean {
  return Object.prototype.toString.call(val) === '[object Array]';
}
export function isObject(val): boolean {
  return Object.prototype.toString.call(val) === '[object Object]';
}
export function isString(val): boolean {
  return Object.prototype.toString.call(val) === '[object String]';
}
export function isNull(val): boolean {
  return val === null;
}

export function isFunction(obj: any): boolean {
  return typeof obj === 'function';
}

export const isSSR = (function () {
  try {
    return !(typeof window !== 'undefined' && document !== undefined);
  } catch (e) {
    return true;
  }
})();

export function isExist(obj): boolean {
  return obj || obj === 0;
}

export function isUndefined(item): boolean {
  return item === undefined;
}
