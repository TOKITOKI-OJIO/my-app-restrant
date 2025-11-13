// import { useTranslation } from 'react-i18next';
// // eslint-disable-next-line react-hooks/rules-of-hooks
// const { t } = useTranslation('plugin__cpm-bfsw-console-plugin');
export const OtherNameRegObj = {
  reg: /^[a-zA-Z\u4e00-\u9fa5][\w\u4e00-\u9fa5-.]{0,126}$/,
  text: 'Supports 1-127 characters, only allowing input of letters, Chinese characters, numbers, underscores (_), midlines (-), dots (.), and must start with a letter or Chinese character',
};
export const deptNameRegObj = {
  reg: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_.-]{0,126}$/,
  text: 'Supports 1-127 characters, only allowing input of letters, Chinese characters, numbers, underscores (_), midlines (-), dots (.), and must start with a letter or Chinese character',
};
export const tenantNameRegObj = {
  reg: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_.-]{0,126}$/,
  text: 'Supports 1-127 characters, only allowing input of letters, Chinese characters, numbers, underscores (_), midlines (-), dots (.), and must start with a letter or Chinese character',
};
export const idpNameRegObj = {
  reg: /^[\u4e00-\u9fa5a-zA-Z0-9_\-.\(\)]{1,32}$/,
  text: 'Supports a length of 1-32 characters, including Chinese, English letters, numbers, and _ - ()',
};
export const websiteRegObj = {
  reg: /^(http:\/\/|https:\/\/).+/,
  text: 'http://url or https://url',
};
export const PhoneRegObj = {
  reg: /^[0-9]*$/,
  // text: 'Mobile phone number needs to be 11 digits',
  text: '请输入 the correct phone number',
};
export const EmailRegObj = {
  reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // text: 'The email must contain @, with characters before @ and characters after @',
  text: '请输入 the correct email address',
};
export const PasswordRegObj = {
  reg: /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![\@\#\$\%\^\&\*\(\)\<\>\/\+\-\_\.\?\=\,\\\[\]\{\}]+$)(?![\da-z]+$)(?![\dA-Z]+$)(?![\d\@\#\$\%\^\&\*\(\)\<\>\/\+\-\_\.\?\=\,\\\[\]\{\}]+$)(?![a-zA-Z]+$).{8,16}$/,
  text: '8-16 digits, including at least 3 types of numbers, letters, and special characters, including! @ # $%^&* ()<>/+-_. ? =, []{}',
};
export const StrongPwdRegObj = (val) => {
  console.log(val);
  return {
    // reg: new RegExp(`/^(?!.*${val})(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=])[^\s]{8,16}$/`),
    reg: new RegExp(
      `^(?!.*${val})(?!.*${
        val?.split('')?.reverse()?.join('') || ''
      })(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![\@\#\$\%\^\&\*\(\)\<\>\/\+\-\_\.\?\=\,\\\[\]\{\}]+$)(?![\da-z]+$)(?![\dA-Z]+$)(?![\d\@\#\$\%\^\&\*\(\)\<\>\/\+\-\_\.\?\=\,\\\[\]\{\}]+$)(?![a-zA-Z]+$).{8,16}$`
    ),
    text: 'At least 8 digits and at most 16 digits, including at least 3 types of numbers, letters, and special symbols. Special characters include! @ # $%^&* ()_+-= Does not include spaces, does not include positive or negative usernames, and does not duplicate the previous password.',
  };
};
