import React, { ReactElement } from "react";
import { Select } from "@arco-design/web-react";
import { isEqual } from "../../../utils/equal";
import { ITime } from "../interface";

export default function SelectGroup(props: any): ReactElement {
  const {
    days = [],
    defaultBtn = 0,
    arrayAt,
    activeIndex,
    handleActiveBtn,
    getButtonLabel,
  } = props;
  const index = days.findIndex((item: ITime) =>
    isEqual(arrayAt(days, activeIndex), item)
  );
  const value = index > -1 ? index : defaultBtn;

  return (
    <Select value={value}>
      {days.map((item: ITime, index: number) => (
        <Select.Option
          key={index}
          value={index}
          onClick={() => handleActiveBtn(item, index)}
        >
          {getButtonLabel(item)}
        </Select.Option>
      ))}
    </Select>
  );
}
