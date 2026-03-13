/**
 * 公共的实用函数
 */

import dayjs from 'dayjs';

import qs from 'query-string';

export function parseUrl(url) {
  const localObj = {
    host: '',
    hash: '',
    path: '/',
    query: {},
    hashPath: '/',
    hashQuery: {},
  };
  const protocolIndex = url.indexOf('//') + 2;
  let hashIndex = url.indexOf('#');
  if (hashIndex === -1) {
    url = url + '#/?';
    hashIndex = url.indexOf('#');
  }
  localObj.hash = url.substring(hashIndex);
  url = url.substring(protocolIndex, hashIndex);
  let pathIndex = url.indexOf('/');
  let queryIndex = url.indexOf('?');
  if (queryIndex === -1) {
    if (pathIndex === -1) {
      url = url + '/';
      pathIndex = url.indexOf('/');
    }
    url = url + '?';
    queryIndex = url.indexOf('?');
  } else {
    if (pathIndex === -1) {
      url =
        url.substring(0, url.indexOf('?')) +
        '/' +
        url.substring(url.indexOf('?'));
      pathIndex = url.indexOf('/');
      queryIndex = url.indexOf('?');
    }
  }
  localObj.host = url.substring(0, pathIndex);
  localObj.path = url.substring(pathIndex, queryIndex);
  localObj.query = qs.parse(url.substring(queryIndex + 1, hashIndex));
  if (localObj.hash) {
    let hashQueryIndex = localObj.hash.indexOf('?');
    if (hashQueryIndex === -1) {
      localObj.hash = localObj.hash + '?';
      hashQueryIndex = localObj.hash.indexOf('?');
    }
    localObj.hashQuery = qs.parse(localObj.hash.substring(hashQueryIndex + 1));
    localObj.hashPath = localObj.hash.substring(1, hashQueryIndex);
  }
  return localObj;
}

const ONE_DAY_TIME = 1 * 24 * 60 * 60 * 1000;

/**
 * 用于将值进行string化，场景是用来将数字 0 转为 字符串 '0'，从而避免 0 被当做了false，其实是存在值，其值为0
 * @param value
 * @returns
 */
export const valueToString = (value) => {
  let res = '';
  if (value === undefined || value === null) {
    res = '';
  }

  try {
    res = value.toString();
  } catch (error) {
    res = value;
  }
  return res;
};

/**
 * 格式化数字的方法
 * @param num 值
 * @param placeholder num为undefined, null, '' 时候，占位符，默认是 '--
 * @param transformUnit 转换单位，支持W
 * @returns
 */
export const formatValue = (
  val: number | string,
  placeholder = '--',
  transformUnit = '',
  language = 'en'
) => {
  let res = valueToString(val);

  if (transformUnit && !isNaN(Number(res))) {
    const _num = Number(res);
    if (transformUnit?.toLocaleUpperCase() === 'W') {
      res =
        _num >= 10000
          ? `${formatDecimal(_num / 10000)}${language === 'en' ? 'W' : '万'}`
          : `${_num}`;
    }
  }
  return res || placeholder;
};

/**
 * 格式化数字的方法
 * @param total 值
 * @returns
 */

interface UnitConversionResult {
  num: string;
  unit?: string;
}

export const getUnitConversion = (
  total: string | number
): UnitConversionResult => {
  //避免了total为undefined、NAN的情况,其他情况（null、""）Number具备转换能力
  if (isNaN(Number(total))) {
    return { num: '-', unit: '-' };
  }
  const number = Number(total);
  if (number >= 100000000) {
    const num = (number / 100000000).toFixed(3);
    return {
      num: num.substring(0, num.lastIndexOf('.') + 3),
      unit: '亿',
    };
  } else if (number >= 10000000) {
    const num = (number / 10000000).toFixed(3);
    return {
      num: num.substring(0, num.lastIndexOf('.') + 3),
      unit: '千万',
    };
  } else if (number >= 1000000) {
    const num = (number / 1000000).toFixed(3);
    return {
      num: num.substring(0, num.lastIndexOf('.') + 3),
      unit: '百万',
    };
  } else if (number >= 100000) {
    const num = (number / 10000).toFixed(3);
    return {
      num: num.substring(0, num.lastIndexOf('.') + 3),
      unit: '万',
    };
  } else {
    return { num: number.toString() };
  }
};

/**
 * 格式化数值，保留最多几位小数
 * @param value 需要格式化的值
 * @param decimalNum 最多保留小数位数
 * @returns 格式化之后的值
 */

export const formatDecimal = (value: number | string, decimalNum = 2) => {
  if (window.isNaN(Number(value))) {
    return value;
  }
  // const str = value?.toString() || '';
  // const isDecimal = str?.indexOf('.') > -1;
  // if (isDecimal) {
  //   const integer = str.split('.')[0];
  //   const decimal = str.split('.')[1];
  //   return `${integer}.${decimal.substring(0, decimalNum || 2)}`;
  // } else {
  //   return value;
  // }
  const roundedValue = Number(value).toFixed(decimalNum);
  const trimmedValue = roundedValue.replace(/\.?0+$/, '');
  return trimmedValue;
};

// echarts图中的颜色  不支持css变量， 必须计算具体的值
export const getColor = (color) => {
  const colorBoxId = 'cpm-bfsw-console-plugin-box';
  if (!document.getElementById(colorBoxId)) {
    const span = document.createElement('span');
    span.id = colorBoxId;
    document.getElementsByTagName('body')[0].append(span);
  }
  document.getElementById(colorBoxId).style.color = color;
  const colorValue = getComputedStyle(
    document.getElementById(colorBoxId)
  ).getPropertyValue('color');
  return colorValue;
};
/**
 * 入参传入时间转为零时区
 */
export const setCorrectTime = (oldDate) => {
  if (oldDate === '' || !oldDate) {
    return '';
  }
  const date = new Date(oldDate);
  date.setHours(date.getHours());
  const yy = date.getFullYear();
  const mm =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const m =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const s =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${yy}-${mm}-${dd} ${h}:${m}:${s}`;
};

export const getDecimalPart = (number, transformReturn = null) => {
  if (!number) {
    return '';
  }
  // 将数字转换为字符串
  const str = number.toString();
  // 找到小数点的位置
  const dotIndex = str.indexOf('.');
  // 如果存在小数点，则提取小数部分
  if (dotIndex !== -1) {
    // 提取小数点后的字符串
    const decimalPart = str.substring(dotIndex + 1);
    // 返回小数部分
    return decimalPart;
  }
  // 如果没有小数点，返回空字符串
  return transformReturn || '';
};

// 获取过X天前的时间
export const getPastTime = (pastDays = 0, current = 0) => {
  const startTime =
    dayjs().subtract(pastDays, 'day').startOf('date').valueOf() + ONE_DAY_TIME;
  const endTime = dayjs().endOf('date').valueOf();
  const now = current || endTime;
  const pastTime = startTime;
  return {
    currentTime: now.toString(),
    pastTime: pastTime.toString(),
  };
};
