import { IPv6 } from 'ip-matching';
import ipAddr from 'ipaddr.js';

export function Valiate() {
  const t = (a) => a;
  const requiredRule = {
    required: true,
    message: t('CannotBeEmpty'),
  };
  const requiredInputRule = {
    required: true,
    message: t('InputCannotBeEmpty'),
  };
  const requiredSelectRule = {
    required: true,
    message: t('SelectCannotBeEmpty'),
  };
  const nameRule = (value: any, callback: any, showTip = false) => {
    if (value) {
      const nameReg = /^[\u4e00-\u9fa5A-Za-z][\u4e00-\u9fa5\5A-Za-z0-9-\_\.]*$/;
      const strLen = value.replace(/[^\x00-\xff]/g, 'aa').length;
      if (!nameReg.test(value) || strLen > 127) {
        if (showTip) {
          return callback(`${t('NameRuleErrorTip')},${t('oss.lifeCycleTip')}`);
        }
        return callback(t('NameRuleErrorTip'));
      } else {
        if (strLen < 1 || strLen > 127) {
          return callback(t('NameLengthErrorTip'));
        } else {
          return callback();
        }
      }
    }
    return callback();
  };
  const descRule = (value: any, callback: any) => {
    const strLen = value && value.replace(/[^\x00-\xff]/g, 'aa').length;
    if (value) {
      if (strLen < 2 || strLen > 255) {
        return callback(t('DescLengthErrorTip'));
      } else if (/^(http:\/\/|https:\/\/)/.test(value)) {
        return callback(t('DescErrorTip'));
      }
      return callback();
    }
    return callback();
  };
  const macRule = (value: any, callback: any) => {
    if (value) {
      // mac地址只支持一种格式，就是带冒号得形式，不支持减号的形式
      const macReg = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/;
      if (!macReg.test(value)) {
        return callback(t('MacErrorTip'));
      }
      // 不允许输入组播mac地址
      // A：MAC地址的第八位二进制数字为0代表单播地址，为1代表组播地址。 以01-00-5E开头的MAC地址是大家公认的组播MAC地址，但是除了01-00-5E开头的组播MAC地址外，还存在其他的组播MAC地址，即MAC地址中第八位二进制数字为1的MAC地址均为组播MAC地址。更简单的判断方法是，以16进制中第一字节第二个数字是偶数还是奇数来判断是单播地址还是组播地址，第二个数字是偶数，则代表单播地址，即0、2、4、6、8、A、C、E中的一个；如果是奇数的话，则代表组播地址，即1、3、5、7、9、B、D、F中的一个。 举例： MAC地址01-00-5E-01-00-01对应16进制中第一字节第二个数字是1，为奇数，则该MAC地址是一个组播MAC地址
      const h = parseInt(value.slice(0, 2), 16);
      const b: any = h.toString(2);
      if (b % 2 === 1) {
        return callback(t('MultIMacErrorTip'));
      }
      return callback();
    }
  };
  const ipv4Rule = (value: any, callback: any) => {
    if (value) {
      const ipv4Reg =
        /^(127\.0\.0\.1)|(localhost)|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.((1[6-9])|(2\d)|(3[01]))\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})$/;
      if (ipv4Reg.test(value)) {
        return callback();
      } else {
        return callback(t('IPv4AddressErrorTip'));
      }
    }
  };
  const ipv4RulePort = (value: any, callback: any) => {
    if (value) {
      const ipv4Reg =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)$/;
      if (ipv4Reg.test(value)) {
        const valueArr = value.split('.');
        // 不能设置组播地址，组播地址范围224.0.0.0以上，0开头的也不行，127开头的也不行
        if (valueArr[0] === 0 || valueArr[0] === 127 || valueArr[0] >= 224) {
          return callback(t('IPv4AddressErrorTip'));
        } else {
          return callback();
        }
      } else {
        return callback(t('IPv4AddressErrorTip'));
      }
    }
  };
  const ipv4GatewayRulePort = (
    value: any,
    callback: any,
    ipv4Addr?: any,
    ipv4Mask?: any
  ) => {
    if (value) {
      const ipv4Reg =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)$/;
      if (ipv4Reg.test(value)) {
        const valueArr = value.split('.');
        // 不能设置组播地址，组播地址范围224.0.0.0以上，0开头的也不行，127开头的也不行
        if (valueArr[0] === 0 || valueArr[0] === 127 || valueArr[0] >= 224) {
          return callback(t('IPv4GatewayErrorTip'));
        } else {
          //校验ip、掩码、网关的合法性
          if (ipv4Addr == ipv4Mask || ipv4Addr == value || ipv4Mask == value) {
            return callback(t('IPv4AddressIPv4MaskIPv4GatewayNotSame')); //3个地址不能相同
          } else {
            let ipv4Addr_arr = [];
            let ipv4Mask_arr = [];
            let value_arr = [];
            ipv4Addr_arr = ipv4Addr.split('.');
            ipv4Mask_arr = ipv4Mask.split('.');
            value_arr = value.split('.');
            const res0 = parseInt(ipv4Addr_arr[0]) & parseInt(ipv4Mask_arr[0]);
            const res1 = parseInt(ipv4Addr_arr[1]) & parseInt(ipv4Mask_arr[1]);
            const res2 = parseInt(ipv4Addr_arr[2]) & parseInt(ipv4Mask_arr[2]);
            const res3 = parseInt(ipv4Addr_arr[3]) & parseInt(ipv4Mask_arr[3]);
            const res0_gw = parseInt(value_arr[0]) & parseInt(ipv4Mask_arr[0]);
            const res1_gw = parseInt(value_arr[1]) & parseInt(ipv4Mask_arr[1]);
            const res2_gw = parseInt(value_arr[2]) & parseInt(ipv4Mask_arr[2]);
            const res3_gw = parseInt(value_arr[3]) & parseInt(ipv4Mask_arr[3]);
            if (
              res0 == res0_gw &&
              res1 == res1_gw &&
              res2 == res2_gw &&
              res3 == res3_gw
            ) {
              return callback();
            } else {
              return callback(t('IPv4AddressIPv4MaskIPv4GatewayNotMatch'));
            }
          }
        }
      } else {
        return callback(t('IPv4GatewayErrorTip'));
      }
    }
  };
  const ipv4MaskRulePort = (value: any, callback: any) => {
    if (value) {
      const ipv4Reg =
        /^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
      if (ipv4Reg.test(value)) {
        return callback();
      } else {
        return callback('请填写正确的IPv4掩码');
      }
    }
  };
  const ipv4MaskRule = (value: any, callback: any) => {
    const reg =
      /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2]\d|3[0-2])$/;
    if (value) {
      if (reg.test(value)) {
        callback();
      } else {
        callback('请填写正确的IPV4 CIDR地址，形如：10.1.1.0/24');
      }
    }
  };
  const ipv6Rule = (value: any, callback: any) => {
    if (value) {
      const ipv6Reg =
        /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?((\/(1[01][0-9]|12[0-8]|[0-9]{1,2})){1}|[0-9]{1})\s*$/;
      if (ipv6Reg.test(value)) {
        if (value.includes('::') && value.includes('/')) {
          const ipAdress = value.split('::')[0].split(':');
          const segment = +value.split('::')[1].substr(1);
          if (ipAdress.length * 16 > segment && value !== '::/0') {
            return callback('ipv6地址不合法');
          }
        }
        return callback();
      } else {
        return callback(
          '请填写正确的CIDR地址，如：10.1.1.0/24 或 2001:dddd::/64'
        );
      }
    }
  };
  const securityGroupRule = (value: any, callback: any) => {
    if (value && value.length > 5) {
      return callback('绑定的安全组不能超过5个');
    }
    return callback();
  };
  const newMacRule = (value: any, callback: any) => {
    if (value) {
      // mac地址只支持一种格式，就是带冒号得形式，不支持减号的形式
      const macReg = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/;
      if (!macReg.test(value)) {
        return callback(t('MacErrorTip'));
      }
      if (value === '00:00:00:00:00:00') {
        return callback(t('LimitMacAllZeroTip'));
      }
      // 手动指定MAC地址仅支持单播地址，第一个字节最末位为0
      const v = parseInt(value.slice(1, 2), 16);
      const binaryValue = v.toString(2);
      if (binaryValue.slice(-1) !== '0') {
        return callback(t('LimitStartMacErrorTipNew'));
      }
      return callback();
    } else {
      return callback('请填写MAC地址');
    }
  };
  // ipv6中间段校验
  /**
   * @param ipv6Mask ipv6掩码
   * @param ipv6Prefix ipv6前缀
   * @param ipv6Mid ipv6中间段
   * @param ipv4Suffix ipv4后缀
   * @param callback callback函数
   */
  const ipv6MidRule = (
    ipv6Mask: number,
    ipv6Prefix: string,
    ipv6Mid: string,
    ipv4Suffix: string,
    callback: any
  ) => {
    const ipv6 = ipv6Prefix + ':' + ipv6Mid + ':' + ipv4Suffix;
    try {
      const ipv6Full = new IPv6(ipv6).toFullString();
      if (!ipAddr.IPv6.isValid(ipv6Full)) {
        callback(
          `${t('PleaseEnter')}${t('Correct')}${96 - ipv6Mask}${t('Digit')}${t(
            'Hexadecimal'
          )}`
        );
      } else {
        callback();
      }
    } catch (err) {
      console.log(err);
      callback(
        `${t('PleaseEnter')}${t('Correct')}${96 - ipv6Mask}${t('Digit')}${t(
          'Hexadecimal'
        )}`
      );
    }
  };

  // ipv6后缀格式校验
  /**
   * @param ipv6Prefix ipv6前缀
   * @param ipv6Suffix ipv6后缀
   * @param callback callback函数
   */
  const ipv6SuffixRule = (
    ipv6Prefix: string,
    ipv6Suffix: string,
    callback: any
  ) => {
    const ipv6 = ipv6Prefix + ':' + ipv6Suffix;
    try {
      const ipv6Full = new IPv6(ipv6).toFullString();
      if (!ipAddr.IPv6.isValid(ipv6Full)) {
        callback(`${t('PleaseEnter')}正确的16进制后缀`);
      } else {
        callback();
      }
    } catch (err) {
      console.log(err);
      callback(`${t('PleaseEnter')}正确的16进制后缀`);
    }
  };

  const hostNameRule = (hostNameLen) => (value: any, callback: any) => {
    if (value) {
      const nameReg = /^(?!-)(?!.*-$)(?!.*--)(?=.*[a-z-])[a-z0-9-]+$/;
      const len = value.length;
      if (len < hostNameLen.min || len > hostNameLen.max) {
        return callback(t('NameRuleErrorTip'));
      }
      if (!nameReg.test(value)) {
        return callback(t('NameRuleErrorTip'));
      } else {
        return callback();
      }
    }
    return callback(t('NameLengthErrorTip'));
  };

  // ecs名称规则
  const ecsNameRule = (value: any, callback: any) => {
    if (value) {
      const nameReg = /^[\u4E00-\u9FA5A-Za-z0-9][\u4E00-\u9FA5A-Za-z0-9._-]*$/;
      const strLen = value.length;
      if (!nameReg.test(value) || strLen > 127) {
        return callback(
          '支持 1～127 位字符，必须以字母、中文或者数字开头，可以包含字母、数字、下划线（_）、中划线（-）、点(.)'
        );
      } else {
        if (strLen < 1 || strLen > 127) {
          return callback(t('NameLengthErrorTip'));
        } else {
          return callback();
        }
      }
    }
    return callback();
  };

  return {
    requiredRule,
    requiredInputRule,
    requiredSelectRule,
    ipv4MaskRule,
    ipv4MaskRulePort,
    nameRule,
    descRule,
    macRule,
    ipv4Rule,
    ipv4RulePort,
    ipv4GatewayRulePort,
    ipv6Rule,
    securityGroupRule,
    newMacRule,
    ipv6MidRule,
    ipv6SuffixRule,
    hostNameRule,
    ecsNameRule,
  };
}
