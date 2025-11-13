import { ManipulateType } from "dayjs";
import { RangePickerProps } from "@arco-design/web-react";

export interface TimeObj {
  num: number;
  unit: ManipulateType;
  label?: string;
}

export type ITime = TimeObj | number;

export type Date = {
  startTime: string;
  endTime: string;
};

export enum GroupType {
  button = "button",
  radio = "radio",
  select = "select",
}

export type BtnIndex = number | boolean;

export interface LastDaysType {
  id?: string;
  className?: string;
  updateNum?: number;
  value?: BtnIndex;
  days?: ITime[];
  format?: string;
  defaultBtn?: BtnIndex;
  type?: GroupType;
  date?: Date;
  showPicker?: boolean;
  rangePickerProps?: RangePickerProps;
  onChange?: (date?: Date, hasMounted?: boolean, index?: BtnIndex) => void;
}
