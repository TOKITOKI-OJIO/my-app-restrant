import { isObject, isArray } from './is';

// 对象是否相等
export const isObjectEqual = function (obj1, obj2): boolean {
  const isObjectA = isObject(obj1);
  const isObjectB = isObject(obj2);
  if (!isObjectA || !isObjectB) {
    return false;
  }
  // 判断两个对象的长度是否相等，不相等则直接返回 fase
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  // 判断两个对象的每个属性值是否相等，只遍历自身的可枚举属性，不包括原型链上的和不可枚举的
  for (const key of Object.keys(obj1)) {
    // 判断两个对象的键是否相等
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      const obj1Type = toString.call(obj1[key]);
      const obj2Type = toString.call(obj2[key]);
      // 如果值是对象，则递归
      if (obj1Type === '[object Object]' || obj2Type === '[object Object]') {
        if (!isObjectEqual(obj1[key], obj2[key])) {
          return false;
        }
      } else if (obj1[key] !== obj2[key]) {
        return false; // 如果不是对象，则判断值是否相等
      }
    } else {
      return false;
    }
  }
  return true; // 上面条件都通过，则返回 true
};

// 判断数组相等
export function isArrayEqual(arr1, arr2): boolean {
  if (!isArray(arr1) || !isArray(arr2)) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!isEqual(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
}

// 两个值相等，支持基础数据类型，对象，数组
export function isEqual(a, b): boolean {
  if (typeof a !== typeof b) {
    return false;
  }
  if (isObject(a)) {
    return isObjectEqual(a, b);
  }
  if (isArray(a)) {
    return isArrayEqual(a, b);
  }
  return a === b;
}
