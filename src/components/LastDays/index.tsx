import { DatePicker, Space } from "@arco-design/web-react";

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  ReactElement,
} from "react";
import dayjs, { ManipulateType } from "dayjs";
import { ConfigContext } from "../ConfigProvider";
import { UNIT_MAP } from "./constant";
import { GroupType, ITime, LastDaysType, BtnIndex } from "./interface";
import useMergeProps from "../../utils/useMergeValue";
import ButtonGroup from "./type/button";
import RadioGroup from "./type/radio";
import SelectGroup from "./type/select";

const { RangePicker } = DatePicker;

// type Unit = keyof typeof UNIT_MAP;

// 合并事件
function combineEvent(...funcList) {
  return (...args) => {
    funcList.forEach((func) => {
      if (typeof func === "function") {
        func(...args);
      }
    });
  };
}

function LastDays(props: LastDaysType): ReactElement {
  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("last-days");
  const {
    id = "",
    className = "",
    updateNum = 0,
    days = [1, 7, 14, 30],
    format = "YYYY-MM-DD HH:mm:ss",
    defaultBtn = 0,
    type = GroupType.button,
    showPicker = true,
    date = {
      startTime: "",
      endTime: "",
    },
    value,
    rangePickerProps = {},
    onChange = () => {
      // 默认的函数
    },
  }: LastDaysType = props;
  const GroupMap = new Map([
    [GroupType.button, ButtonGroup],
    [GroupType.radio, RadioGroup],
    [GroupType.select, SelectGroup],
  ]);
  const GroupComp = GroupMap.get(type);
  const [activeIndex, setActiveIndex] = useMergeProps(0, {
    defaultValue: defaultBtn,
    value,
  });
  const _date = useRef({
    startTime: "",
    endTime: "",
  });
  const [pickerValue, setPickerValue] = useState([]);

  useEffect(() => {
    if (activeIndex || activeIndex === 0) {
      setPickerValue([]);
    }
  }, [activeIndex]);

  useEffect(() => {
    refreshLeftTime();
  }, [updateNum]);

  useEffect(() => {
    if (!activeIndex && activeIndex !== 0) {
      _date.current = date;
      setPickerValue([date.startTime, date.endTime]);
      setActiveIndex(false);
      onChange(_date.current, false, false);
      return;
    }
    setActiveIndex(activeIndex);
    const currentBtn = arrayAt(days, activeIndex);
    const currentDate = getCurrentDate(currentBtn);
    _date.current = currentDate;
    onChange(_date.current, false, activeIndex);
  }, []);

  function arrayAt(arr, index) {
    if (typeof index !== "number") {
      return new Error("index must be number!");
    }
    if (index >= 0) {
      return arr[index];
    }
    return arr[arr.length + index];
  }

  function getCurrentDate(item: ITime) {
    let num = 0;
    let unit: ManipulateType = "day";
    if (typeof item === "object") {
      num = item.num;
      unit = item.unit as ManipulateType;
    } else {
      num = item;
    }
    const startTime = dayjs().subtract(num, unit).format(format);
    const endTime = dayjs().format(format);
    return {
      startTime,
      endTime,
    };
  }

  function handleActiveBtn(item: ITime, index: BtnIndex) {
    if (!("value" in props)) {
      setActiveIndex(index);
    }
    const currentDate = getCurrentDate(item);
    _date.current = currentDate;
    // setPickerValue([]);
    onChange(_date.current, true, index);
  }

  function refreshLeftTime() {
    if (activeIndex !== false) {
      setActiveIndex(activeIndex);
      const currentBtn = arrayAt(days, activeIndex);
      const currentDate = getCurrentDate(currentBtn);
      _date.current = currentDate;
      onChange(_date.current, false, activeIndex);
    }
  }

  function handlePickerChange(value) {
    if (!value || value.length === 0) {
      handlePickerClear();
      return;
    }
    _date.current = {
      startTime: value[0],
      endTime: value[1],
    };
    setPickerValue(value);
    setActiveIndex(false);
    onChange(_date.current, true, false);
  }

  function handlePickerClear() {
    const btnIndex = defaultBtn || 0;
    const currentBtn = arrayAt(days, btnIndex);
    handleActiveBtn(currentBtn, btnIndex);
  }

  function getButtonLabel(item) {
    if (typeof item === "object") {
      return item.label || `近${item.num}${UNIT_MAP[item.unit]}`;
    }
    return `近${item}天`;
  }

  return (
    <div className={`${prefixCls} ${className}`} id={id}>
      <Space>
        <GroupComp
          days={days}
          defaultBtn={defaultBtn}
          activeIndex={activeIndex}
          arrayAt={arrayAt}
          handleActiveBtn={handleActiveBtn}
          getButtonLabel={getButtonLabel}
        />
        {showPicker && (
          <RangePicker
            format={format}
            showTime
            value={pickerValue}
            {...rangePickerProps}
            // onClear={combineEvent(handlePickerClear, rangePickerProps.onClear)}
            onChange={combineEvent(
              handlePickerChange,
              rangePickerProps.onChange
            )}
          />
        )}
      </Space>
    </div>
  );
}

export default LastDays;
