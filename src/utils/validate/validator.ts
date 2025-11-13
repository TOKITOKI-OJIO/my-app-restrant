const isPsdComplex = (password: string) =>
  new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![0-9\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$)(?![a-z\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$)(?![A-Z\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$)[0-9a-zA-Z\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$/
  ).test(password);

const isAddNodePsdComplex = (password: string) =>
  new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![0-9\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$)(?![a-z\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$)(?![A-Z\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$)[0-9a-zA-Z\!\@\%\^\-\_\=\+\[\{\}\]\:\,\.\/\?]+$/
  ).test(password);

const isPsdLenCorrect = (password, min, max) => {
  return password && password.length >= min && password.length <= max;
};

const isIpv4Cidr = (cidr: string) => {
  const rule = new RegExp(
    /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/
  );
  return rule.test(cidr);
};
export const isIpv6Cidr = (cidr: string) => {
  const rule = new RegExp(
    /^((\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)(\/(([1-9])|([1-9][0-9])|(1[0-1][0-9]|12[0-8]))){0,1})*$/
  );
  return rule.test(cidr);
};

const isIp = (ip: string) => {
  const rule = new RegExp(
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
  );
  return rule.test(ip);
};

const isDomain = (host: string) => {
  const rule = new RegExp(
    /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63}(?<!-)){0,}$/
  );
  return rule.test(host);
};

const isDockerImage = (image) => {
  const rule = new RegExp(/^[\w.-]+(:)?([\w.-]+)?\/[\w.\-\@\/]+(:[\w.-]+)?$/);
  return rule.test(image);
};

function GetChinese(strValue) {
  // eslint-disable-line
  if (strValue !== null && strValue !== '') {
    const reg = /[\u4e00-\u9fa5]/g;
    const chinese = strValue.match(reg) || [''];

    return chinese.join('');
  }
  return '';
}

function validator(t) {
  return {
    isRequired(label = '') {
      return [
        {
          required: true,
          message: t('请输入') + label,
          validateTrigger: ['onBlur', 'onChange'],
        },
      ];
    },
    selectRequired(label = '') {
      return [
        {
          required: true,
          message: t('请选择') + label,
          validateTrigger: ['onBlur', 'onChange'],
        },
      ];
    },

    isPhone() {
      return [
        {
          validator: async (value, callback: any) => {
            const reg = /^1[3-9]\d{9}$/;
            if (value && !reg.test(value)) {
              return callback(t('请填写正确的手机号'));
            }
            return callback();
          },
          validateTrigger: ['onBlur', 'onChange'],
        },
      ];
    },
    isMail() {
      return [
        {
          validator: async (value, callback: any) => {
            const reg =
              /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/;

            if (value && !reg.test(value)) {
              return callback(t('请填写正确的邮箱'));
            }
            return callback();
          },
          validateTrigger: ['onBlur', 'onChange'],
        },
      ];
    },
  };
}
export default validator;
