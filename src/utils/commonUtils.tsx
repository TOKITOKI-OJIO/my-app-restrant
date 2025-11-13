import ReactDOM from 'react-dom';
import { Spin } from '@arco-design/web-react';
import React from 'react';
import '@ccf2e/arco-material/lib/style/css.js';
import { IconFont } from '@ccf2e/arco-material';

let centerRegionId = ''; // 中心云管所在的regionId

export function setCenterRegionId(regionId) {
  centerRegionId = regionId;
}

export function getCenterRegionId() {
  return centerRegionId;
}

/**
 * 转换容量显示
 * @date 2022-04-28
 * @param {any} size:number 单位要求为Bytes
 * @param {any} fixed?:number 默认精确1位小数
 * @returns {any} [size, unit]
 */
export function convertSizeParts(size: number, fixed?: number) {
  if (!(fixed > 0)) {
    fixed = 1;
  }
  if (size === 0) {
    return ['0', 'B'];
  }
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const index: number = Math.floor(Math.log(size) / Math.log(1024));
  return [(size / Math.pow(1024, index)).toFixed(fixed), units[index]];
}
/**
 * 转换容量显示
 * @date 2022-03-18
 * @param {any} size:number 单位要求为Bytes
 * @param {any} fixed?:number 默认精确1位小数
 * @returns {any} 'size unit'
 */
export function convertSize(size: number, fixed?: number) {
  return convertSizeParts(size, fixed).join(' ');
}
export function convertCapacitySize(size: number) {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', , 'PiB', 'EiB', 'ZiB', 'YiB'];
  const index: number = Math.floor(Math.log(size) / Math.log(1024));
  return [(size / Math.pow(1024, index)).toFixed(4), units[index]].join(' ');
}
/**
 * @description: 数据库时间格式转化
 * @param fmt YYYY-mm-dd HH:MM
 * @param date
 * @return fmt date
 */
export function dateFormat(fmt: string, date: any) {
  let ret: any;
  date = new Date(date);
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
  };
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      );
    }
  }
  return fmt;
}

export function showLoading() {
  const dom = document.createElement('div');
  dom.setAttribute('id', 'loading');
  dom.style.width = '100%';
  dom.style.height = '100%';
  dom.style.position = 'absolute';
  dom.style.inset = '0px';
  dom.style['top'] = '0';
  dom.style['z-index'] = '9999';
  dom.style['display'] = 'flex';
  dom.style['position'] = 'fixed';
  dom.style['align-items'] = 'center';
  dom.style['justify-content'] = 'center';
  dom.style['background-color'] = 'var(--color-spin-layer-bg)';
  document.body.appendChild(dom);
  // eslint-disable-next-line react/react-in-jsx-scope
  ReactDOM.render(<Spin style={{ display: 'block' }} />, dom);
}

export function hideLoading() {
  const loadingDom = document.getElementById('loading');
  if (loadingDom) {
    document.body.removeChild(loadingDom);
  }
}

//宽带容量转换单位
export function convertSizeBandwidth(size: number, fixed?: number) {
  if (!(fixed > 0)) {
    fixed = 1;
  }
  if (size === 0) {
    return ['0', 'B'];
  }
  const units = ['B', 'Kib', 'Mib', 'Gib', 'Tib', 'Pib', 'Eib', 'Zib', 'Yib'];
  const index: number = Math.floor(Math.log(size) / Math.log(1024));
  return [(size / Math.pow(1024, index)).toFixed(fixed), units[index]];
}

export function generateUuid() {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
}

export function turntime(item) {
  const date = new Date(item);
  const y = date.getFullYear();
  let MM: string | number = date.getMonth() + 1;
  MM = MM < 10 ? '0' + MM : MM;
  let d: string | number = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h: string | number = date.getHours();
  h = h < 10 ? '0' + h : h;
  let m: string | number = date.getMinutes();
  m = m < 10 ? '0' + m : m;
  let s: string | number = date.getSeconds();
  s = s < 10 ? '0' + s : s;
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
}

export function isarrayequal(a, b) {
  const newA = new Set(a);
  const newB = new Set(b);
  if (a.length == b.length) {
    const differenceABSet = Array.from(
      new Set([...newA].filter((x) => !newB.has(x)))
    );
    if (differenceABSet.length == 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}



export function getUploadErrorCode(errorMessage) {
  let errorCode = '';
  const reg = /\<Code>(\S*)\<\/Code>/;
  const resultArr = errorMessage.match(reg);
  if (resultArr) {
    errorCode = resultArr[1];
  }
  return errorCode;
}

//按指定长度分割数组，size：要分割的长度
export function getNewArray(arr, size) {
  //
  const arrNum = Math.ceil(arr.length / size);
  let index = 0;
  let resIndex = 0;
  const result = [];
  while (index < arrNum) {
    result[index] = arr.slice(resIndex, size + resIndex);
    resIndex += size;
    index++;
  }
  return result;
}

// 检查对象是否为空
export function isEmpty(obj) {
  return Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;
}

export function treeToArr(data, key) {
  const result = [];
  data.forEach((item) => {
    const loop = (temp) => {
      result.push(temp);
      const child = temp[key];
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });
  return result;
}


// 字节转换成其他单位
export function bytesToUnit(size) {
  const result = {
    broadBand: 0,
    unit: 'B/s',
  };
  const B_PER_TB = 1024 ** 4;
  const B_PER_GB = 1024 ** 3;
  const B_PER_MB = 1024 ** 2;
  const B_PER_KB = 1024;
  if (size >= B_PER_TB && size % B_PER_TB === 0) {
    result.broadBand = size / B_PER_TB;
    result.unit = 'TB/s';
  } else if (size >= B_PER_GB && size % B_PER_GB === 0) {
    result.broadBand = size / B_PER_GB;
    result.unit = 'GB/s';
  } else if (size >= B_PER_MB && size % B_PER_MB === 0) {
    result.broadBand = size / B_PER_MB;
    result.unit = 'MB/s';
  } else if (size >= B_PER_KB && size % B_PER_KB === 0) {
    result.broadBand = size / B_PER_KB;
    result.unit = 'KB/s';
  } else if (size === 0) {
    result.broadBand = size;
    result.unit = 'KB/s';
  } else {
    result.broadBand = size;
    result.unit = 'B/s';
  }
  return result;
}

// 带宽单位转换
export function kbpsToUnit(size) {
  const result = {
    broadBand: 0,
    unit: 'Kbps',
  };
  const Gbps = 1000 ** 2;
  const Mbps = 1000;
  if (size >= Gbps && size % Gbps === 0) {
    result.broadBand = size / Gbps;
    result.unit = 'Gbps';
  } else if (size >= Mbps && size % Mbps === 0) {
    result.broadBand = size / Mbps;
    result.unit = 'Mbps';
  } else {
    result.broadBand = size;
    result.unit = 'Kbps';
  }
  return result;
}

// 字节转换成其他单位(最小展示KB）
export function quotaToUnit(size) {
  const result = {
    broadBand: 0,
    unit: 'B',
  };
  const B_PER_PB = 1024 ** 5;
  const B_PER_TB = 1024 ** 4;
  const B_PER_GB = 1024 ** 3;
  const B_PER_MB = 1024 ** 2;
  const B_PER_KB = 1024;
  if (size == 0) {
    result.broadBand = size;
    result.unit = 'KiB';
  } else if (size >= B_PER_PB && size % B_PER_PB === 0) {
    result.broadBand = size / B_PER_PB;
    result.unit = 'PiB';
  } else if (size >= B_PER_TB && size % B_PER_TB === 0) {
    result.broadBand = size / B_PER_TB;
    result.unit = 'TiB';
  } else if (size >= B_PER_GB && size % B_PER_GB === 0) {
    result.broadBand = size / B_PER_GB;
    result.unit = 'GiB';
  } else if (size >= B_PER_MB && size % B_PER_MB === 0) {
    result.broadBand = size / B_PER_MB;
    result.unit = 'MiB';
  } else {
    result.broadBand = size / B_PER_KB;
    result.unit = 'KiB';
  }
  return result;
}

// 个转换成其他单位
export function quotaToObjectsUnit(size) {
  const result = {
    broadBand: 0,
    unit: 'ge',
  };
  const ge_PER_zhao = 10000 ** 3;
  const ge_PER_yi = 10000 ** 2;
  const ge_PER_wan = 10000;
  if (size >= ge_PER_zhao && size % ge_PER_zhao === 0) {
    result.broadBand = size / ge_PER_zhao;
    result.unit = 'zhao';
  } else if (size >= ge_PER_yi && size % ge_PER_yi === 0) {
    result.broadBand = size / ge_PER_yi;
    result.unit = 'yi';
  } else if (size >= ge_PER_wan && size % ge_PER_wan === 0) {
    result.broadBand = size / ge_PER_wan;
    result.unit = 'wan';
  } else {
    result.broadBand = size;
    result.unit = 'ge';
  }
  return result;
}

export function getUrlParams2() {
  const url = window.location.href;
  const urlStr = url.split('?')[1];
  const urlSearchParams = new URLSearchParams(urlStr);
  const result = Object.fromEntries(urlSearchParams.entries());

  return result;
}

//utc时间  转北京时间显示
export function formatUtcTimeString(utcTimeString) {
  if (utcTimeString === '0001-01-01T00:00:00Z') {
    return '--';
  }
  if (!utcTimeString || utcTimeString === '--' || utcTimeString === '-') {
    return '--';
  }
  const beijingTimeString = new Date(utcTimeString).toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
  });

  return formatDateToCustomFormat(beijingTimeString);
}

export function formatDateToCustomFormat(originDate) {
  const date = new Date(originDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export function getLabelByValue(value, values) {
  const item = values?.find((item) => {
    return item.value === value;
  });
  return item?.text || value || '--';
}

// 北京时间转时间戳
export function bjHourToTimeStampTime(bjtime) {
  // 创建北京时间的Date对象
  const beijingDate = new Date(bjtime);

  // 获取北京时间的时间戳
  const beijingTimestamp = beijingDate.getTime() / 1000;

  return beijingTimestamp;
}
