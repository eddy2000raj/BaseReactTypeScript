import { ReactNode, useMemo, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import debounce from 'lodash.debounce';
//import SEARCH_API from '../../api/searchAPI';
import { formatArray } from '@services/utils';

export interface AsyncSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  url: string;
  debounceTimeout?: number;
}

const AsyncSelect = <
  ValueType extends {
    key?: string;
    label: ReactNode;
    name: string | number;
    id: string | number;
  } = any
>({
  debounceTimeout = 500,
  url,
  ...props
}: AsyncSelectProps) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      setOptions([]);
      if (value) {
        setFetching(true);
      }

      // SEARCH_API.searchGeneric(`${url}/${value}`).then(response => {
      //   setOptions(formatArray(response.data.data));
      //   setFetching(false);
      // });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout]);
  const onSelect = () => {
    setOptions([]);
  };
  return (
    <Select<ValueType>
      showSearch
      labelInValue
      allowClear
      showArrow={false}
      filterOption={false}
      onSelect={onSelect}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map(value => (
        <Select.Option key={value.key} value={value.key}>
          {value.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default AsyncSelect;

AsyncSelect.defaultProps = {
  debounceTimeout: Number,
};
