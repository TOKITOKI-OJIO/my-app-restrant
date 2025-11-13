import React, { ReactElement } from 'react';
import { Button, Space } from '@arco-design/web-react';
import { isEqual } from '../../../utils/equal';

export default function ButtonGroup(props: any): ReactElement {
  const { days = [], arrayAt, activeIndex, handleActiveBtn, getButtonLabel } = props;
  const buttonGroup = days.map((item, index) => {
    return (
      <Button
        key={index}
        type={isEqual(arrayAt(days, activeIndex), item) ? 'secondary' : 'outline'}
        onClick={() => handleActiveBtn(item, index)}
      >
        {getButtonLabel(item)}
      </Button>
    );
  });
  return <Space>{buttonGroup}</Space>;
}
