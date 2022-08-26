/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable prefer-const */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  Table,
  DatePicker,
  Input,
  Select,
  Space,
  Row,
  Button,
  Col,
} from 'antd';
import styled from 'styled-components';
import { TableProps } from 'antd/lib/table/Table';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { formatArray, generateFilterString } from '@services/utils';

interface CustomTableProps {
  defaultProps?: Partial<TableProps<any>>;
  columns: any;
  page?: number;
  total?: number;
  showPagination?: boolean;
  assignedKeys?: any;
  getData?: (params: any) => void;
  onChange?: (
    pagination: any,
    filters: any,
    sorter: any,
    searchHeaders?: any
  ) => void;
}
interface TableState {
  page: number;
  ordering: any;
  searchHeaders: any;
  pageSize: number;
}

const CardTableWrapper = styled.div`
  @keyframes fadeRow {
    from {
      background-color: rgba(224, 248, 232, 1);
    }
    to {
      background-color: transparent;
    }
  }

  .ant-table {
    table-layout: auto;
    .ant-table-thead {
      > tr > th {
        font-weight: 500;
        border-bottom: none;
        text-transform: capitalize !important;
        padding: 15px;
        white-space: nowrap;
      }
    }
    .ant-table-tbody {
      > tr > td {
        padding: 12px 12px;
        font-size: 12px;
        white-space: word-break;
      }
      > tr.fade-out {
        animation: 3s fadeRow forwards;
      }
    }
  }
`;
class Cardtable extends React.Component<CustomTableProps, TableState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      ordering: null,
      searchHeaders: {},
      pageSize: 20,
    };
  }

  componentDidMount() {
    const { getData } = this.props;
    const { pageSize, page } = this.state;
    if (getData) getData({ limit: pageSize, page });
  }

  handleChange = (pagination: any, filters: any, sorter: any) => {
    const { getData, onChange } = this.props;
    let { ordering, searchHeaders }: any = this.state;
    if (sorter && sorter.order) {
      ordering = sorter.order === 'descend' ? '-' : '';
      ordering += sorter.field;
    } else ordering = null;

    this.setState(
      { page: pagination.current, pageSize: pagination.pageSize, ordering },
      () => {
        let params = {
          page: pagination.current,
          limit: pagination.pageSize,
          ordering,
        };
        params = Object.assign(params, {
          filters: generateFilterString(searchHeaders),
        });

        if (getData) getData(params);
      }
    );
    if (onChange) onChange(pagination, filters, sorter, searchHeaders);
  };

  onSearch = (searchHeaders: any) => {
    const { getData } = this.props;
    const params = {
      page: 1,
      limit: this.state.pageSize,
      ordering: this.state.ordering,
      filters: generateFilterString(searchHeaders),
    };
    if (getData) getData(params);
  };

  handleSearch = (selectedKeys: any, dataIndex: any) => {
    this.setState(prevState => ({
      searchHeaders: {
        ...prevState.searchHeaders,
        [dataIndex]:
          selectedKeys[0] && selectedKeys[0].length === 2
            ? `date:${moment(selectedKeys[0][0]).format('YYYY-MM-DD')}~${moment(
                selectedKeys[0][1]
              ).format('YYYY-MM-DD')}`
            : `like:${selectedKeys[0]}`,
      },
    }));
    setTimeout(() => {
      let { searchHeaders } = this.state;
      this.onSearch(searchHeaders);
    }, 10);
  };

  handleReset = (dataIndex: string, confirm: any, clearFilters: any) => {
    clearFilters();
    this.setState(prevState => ({
      searchHeaders: {
        ...prevState.searchHeaders,
        [dataIndex]: undefined,
      },
    }));
    setTimeout(() => {
      let { searchHeaders } = this.state;
      this.onSearch(searchHeaders);
    }, 10);
    confirm();
  };

  getColumnSearchProps = (dataIndex: string, type: string, options?: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: any;
      selectedKeys: any;
      confirm: any;
      clearFilters: any;
    }) => (
      <Space style={{ padding: 10 }} direction="vertical" size="middle">
        {[
          type === 'input' && (
            <Input
              key="input"
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              allowClear
            />
          ),
          type === 'select' && (
            <Select
              style={{ width: '100%' }}
              key="select"
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={value => {
                setSelectedKeys(value ? [value] : []);
              }}
              dropdownStyle={{ textTransform: 'capitalize' }}
              allowClear
            >
              {options &&
                options.map((option: any, index: number) => (
                  <Select.Option key={option.key} value={option.key}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          ),
          type === 'date' && (
            <DatePicker.RangePicker
              key="date"
              placeholder={['From date', 'To date']}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e ? [e] : [])}
              allowClear
              style={{ marginBottom: 8, display: 'block' }}
            />
          ),
        ]}
        <Row gutter={16}>
          <Col sm={12}>
            <Button
              onClick={() => {
                this.handleSearch(selectedKeys, dataIndex);
              }}
              type="primary"
              block
            >
              Search
            </Button>
          </Col>
          <Col sm={12}>
            <Button
              onClick={() => this.handleReset(dataIndex, confirm, clearFilters)}
              type="default"
              block
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Space>
    ),
    filterIcon: (filtered: any) => {
      const { searchHeaders } = this.state;
      return (
        <SearchOutlined
          style={{ color: searchHeaders[dataIndex] ? '#1890ff' : undefined }}
        />
      );
    },
  });

  render() {
    const showTotal = (total: number, range: string[]) =>
      `${range[0]}-${range[1]} of ${total} items`;
    const { showPagination, total } = this.props;
    let { columns, assignedKeys } = this.props;
    const { page, pageSize } = this.state;
    if (assignedKeys)
      columns = columns.map((item: any) =>
        Object.assign(item, {
          search: assignedKeys.find((o: any) => o.key === item.dataIndex),
        })
      );

    columns = columns.map((column: any) =>
      column.showSearch
        ? {
            ...column,
            ...this.getColumnSearchProps(
              column.search && column.search.dataIndex,
              column.type,
              formatArray(column.options)
            ),
          }
        : column
    );
    const paginationProps: any = {
      current: page,
      total,
      pageSize,
      showTotal,
      defaultPageSize: pageSize,
      showSizeChanger: true,
      size: 'small',
    };
    return (
      <CardTableWrapper>
        <Table
          {...this.props}
          columns={columns}
          onChange={this.handleChange}
          pagination={showPagination ? paginationProps : false}
        />
      </CardTableWrapper>
    );
  }
}

export default Cardtable;
