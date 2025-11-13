import React, { ReactElement } from 'react';
import { Radio } from '@arco-design/web-react';
import { isEqual } from '../../../utils/equal';
import { ITime } from '../interface';

export default function RadioGroup(props: any): ReactElement {
  const { days = [], arrayAt, activeIndex, handleActiveBtn, getButtonLabel } = props;
  const value = days.findIndex((item: ITime) => isEqual(arrayAt(days, activeIndex), item));
  return (
    <Radio.Group type="button" value={value}>
      {days.map((item: ITime, index: number) => (
        <Radio key={index} value={index} onChange={() => handleActiveBtn(item, index)}>
          {getButtonLabel(item)}
        </Radio>
      ))}
    </Radio.Group>
  );
}
