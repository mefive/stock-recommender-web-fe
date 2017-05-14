import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

import 'styles/components/table.scss';

function toggleSortDirection(origin) {
  return origin === Table.ASC
    ? Table.DESC : Table.ASC;
}

const propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  expandedRowRender: PropTypes.func,
  rowSelection: PropTypes.object,
  rowKey: PropTypes.string,
  defaultSort: PropTypes.object,
  fixColumnCount: PropTypes.number
};

const defaultProps = {
  rowClassName: () => null,
  onRowClick: () => null,
  onRowExpandChange: () => null,
  columns: [],
  fixColumnCount: 0
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnsWidth: {},
      rowsHeight: {},
      rowsState: {},
    };

    const { defaultSort } = this.props;

    if (defaultSort) {
      this.state.sort = { ...defaultSort };
    }
  }

  componentDidMount() {
    this.resizeHeader();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.columns !== this.props.columns) {
      this.resizeHeader();
    }

    if (!prevProps.dataSource && this.props.dataSource) {
      this.setState({ rowsState: {} });
    }

    if (prevProps.dataSource !== this.props.dataSource) {
      this.resizeHeader();
      this.resizeRow();
    }
  }

  resizeRow() {
    const { flowTable } = this.refs;

    if (this.props.fixColumnCount) {
      const rowsHeight = [];

      [].forEach.call(
        flowTable.querySelectorAll('.row-container'),
        i => rowsHeight.push(i.offsetHeight)
      );

      this.setState({ rowsHeight });
    }
  }

  resizeHeader() {
    const columnsWidth = [];
    const { fixColumnCount } = this.props;

    const { fixTable, flowTable } = this.refs;

    if (fixColumnCount) {
      [].forEach.call(
        fixTable.querySelectorAll('th'),
        i => columnsWidth.push(i.offsetWidth)
      );
    }

    [].forEach.call(
      flowTable.querySelectorAll('th'),
      i => columnsWidth.push(i.offsetWidth)
    );

    this.setState({ columnsWidth });
  }

  getRowKey(record, recordIndex) {
    const { rowKey } = this.props;

    return rowKey ? record[rowKey] : recordIndex;
  }

  getRows(startColIndex, endColIndex) {
    const {
      expandedRowRender,
      rowSelection,
      rowKey
    } = this.props;

    const columns = this.props.columns.slice(startColIndex, endColIndex);
    const isLeftTable = startColIndex === 0;

    const { sort } = this.state;

    let { dataSource = [] } = this.props;

    if (sort && sort.key) {
      dataSource = sortBy(dataSource, [sort.key]);

      if (sort.direction === Table.DESC) {
        dataSource = dataSource.reverse();
      }
    }

    const { rowsState } = this.state;
    let columnsLength = columns.length;

    columns.forEach(i => {
      if (i.children) {
        columnsLength += i.children.length - 1;
      }
    });

    const rows = [];

    dataSource.forEach((record, recordIndex) => {
      const rowState = rowsState[`${recordIndex}`];
      const key = this.getRowKey(record, recordIndex);

      const rowHeight = this.state.rowsHeight[recordIndex] || null;

      const row = (
        <tr
          key={key}
          className={classNames(
            'row-container',
            this.props.rowClassName(record),
            { 'expanded': rowState && rowState.expanded },
            { 'hover': rowState && rowState.hover }
          )}
          onClick={() => this.props.onRowClick(record)}
          style={{
            height: isLeftTable
              ? rowHeight
              : null
          }}
          onMouseOver={() => {
            if (rowState) {
              rowState.hover = true;
            }
            else {
              rowsState[`${recordIndex}`] = { hover: true };
            }

            this.setState({ rowsState }); 
          }}
          onMouseOut={() => {
            if (rowState) {
              rowState.hover = false;
              this.setState({ rowsState });
            }
          }}
        >
        {rowSelection && (
          <td
            key="row-select"
            className="row-select"
          >
            <input
              type="checkbox"
              checked={rowSelection.selectedRowKeys
                && rowSelection.selectedRowKeys.indexOf(key) !== -1
              }
              onChange={e => {
                const { checked } = e.target;

                const newSelectedRowKeys = [...rowSelection.selectedRowKeys];

                if (checked) {
                  newSelectedRowKeys.push(key);
                }
                else {
                  remove(newSelectedRowKeys, i => i === key);
                }

                rowSelection.onChange(newSelectedRowKeys);
              }}
            />
          </td>
        )}

        {isFunction(expandedRowRender) && (
          <td
            key="detail-trigger"
            className="detail-trigger-cell"
            onClick={() => {
              let expanded = false;

              if (rowState == null) {
                expanded = true;
                rowsState[`${recordIndex}`] = {
                  expanded
                };
              }
              else {
                rowState.expanded = !rowState.expanded;
                expanded = rowState.expanded;
              }

              this.setState({ rowsState });

              this.props.onRowExpandChange(expanded, record);
            }}
          >
            {expandedRowRender(record) && (
            <i
              className={classNames(
                'icon',
                { 'icon-plus': !(rowState && rowState.expanded) },
                { 'icon-minus': rowState && rowState.expanded }
              )}
            />
            )}
          </td>
        )}

        {columns.map((column) => {
          if (column.children && column.children.length > 0) {
            return column.children.map(child => (
              <td
                key={child.key}
                style={{
                  textAlign: child.align
                    ? child.align : null,
                  paddingLeft: child.align === 'center' ? 0 : 20,
                  paddingRight: child.align === 'center' ? 0 : 20
                }}
                data-key={child.key}
              >
                {isFunction(child.render)
                  ? child.render(record, recordIndex)
                  : record[child.key]
                }
              </td>
            ));
          }
          else {
            return (
              <td
                key={column.key}
                style={{
                  textAlign: column.align
                    ? column.align : null,
                  paddingLeft: column.align === 'center' ? 0 : 20,
                  paddingRight: column.align === 'center' ? 0 : 20
                }}
                data-key={column.key}
              >
                {(() => {
                  const cell = isFunction(column.render)
                    ? column.render(record, recordIndex)
                    : record[column.key];

                  return cell;
                })()}

              </td>
            );
          }
        })}
        </tr>
      );

      rows.push(row);

      if (expandedRowRender && rowState && rowState.expanded) {
        let colSpan = columnsLength + 1;

        if (rowSelection) {
          colSpan = colSpan + 1;
        }

        const detailRow = (
          <tr
            key={`${recordIndex}_detail`}
          >
            <td colSpan={colSpan} className="detail-container">
              {expandedRowRender(record)}
            </td>
          </tr>
        );

        rows.push(detailRow);
      }
    });

    return rows;
  }

  getTable(ref, startColIndex, endColIndex, className) {
    const { rowSelection, expandedRowRender, dataSource } = this.props;
    const { sort } = this.state;

    const isLeftTable = startColIndex === 0;

    const columns = this.props.columns.slice(startColIndex, endColIndex);

    let childColumns = [];

    columns.forEach(column => {
      if (column.children) {
        childColumns = childColumns.concat(column.children);
      }
    });

    const childColumnsLength = childColumns.length;

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        className={className}
        ref={ref}
      >
        <colgroup>
        {isLeftTable && rowSelection && (
          <col key="row-select" width={50} />
        )}

        {isLeftTable && isFunction(expandedRowRender) && (
          <col key="detail-trigger" width={50} />
        )}

        {columns.map((column, columnIndex) => {
          if (column.children && column.children.length > 0) {
            return column.children.map(child => (
              <col key={child.key} width={child.width || null} />
            ));
          }
          else {
            return (
              <col key={column.key} width={column.width || null}/>
            );
          }
        })}
        </colgroup>
        <thead ref="head">
          <tr>
          {isLeftTable && rowSelection && (
            <th
              key="row-select"
              className="row-select"
              rowSpan={childColumnsLength > 0 ? 2 : null}
            >
              <input
                type="checkbox"
                checked={(() => {
                  let checked = true;

                  dataSource.forEach((record, recordIndex) => {
                    const key = this.getRowKey(record, recordIndex);

                    if (rowSelection
                      .selectedRowKeys.indexOf(key) === -1
                    ) {
                      checked = false;
                      return false;
                    }
                  });

                  return checked;
                })()}
                onChange={e => {
                  const { checked } = e.target;

                  if (checked) {
                    rowSelection.onChange(
                      dataSource.map(
                        (record, recordIndex) => 
                          this.getRowKey(record, recordIndex)
                      )
                    );
                  }
                  else {
                    rowSelection.onChange([]);
                  }
                }}
              />
            </th>
          )}

          {isLeftTable && isFunction(expandedRowRender) && (
            <th
              key="detail-trigger"
              rowSpan={childColumnsLength > 0 ? 2 : null}
            />
          )}

          {columns.map((column) => (
            <th
              data-key={column.key}
              data-column
              className={classNames(
                { sortable: !!column.sortKey }
              )}
              key={column.key}
              style={{
                textAlign: column.align ? column.align : null,
                paddingLeft: column.align === 'center' ? 0 : 20,
                paddingRight: column.align === 'center' ? 0 : 20
              }}
              rowSpan={childColumnsLength > 0
                ? (column.children ? 1 : 2 )
                : null}
              colSpan={column.children ? column.children.length : null}
              onClick={() => {
                if (column.sortKey) {
                  this.setState({
                    sort: {
                      key: column.sortKey,
                      direction: sort.key === column.sortKey
                        ? toggleSortDirection(sort.direction)
                        : Table.DESC
                    }
                  })
                }
              }}
            >
              <div>
                {column.title}

                {column.sortKey && column.sortKey === sort.key && (
                <span>
                  {sort.direction === Table.ASC
                    ? (
                      <i className="icon icon-arrow-up" />
                    )
                    : (
                      <i className="icon icon-arrow-down" />
                    )
                  }
                </span>
                )}
              </div>
            </th>
          ))}
          </tr>

          {childColumnsLength > 0 && (
            <tr>
            {childColumns.map(column => (
              <th
                data-key={column.key}
                data-column
                key={column.key}
                style={{
                  textAlign: column.align ? column.align : null,
                  paddingLeft: column.align === 'center' ? 0 : 20,
                  paddingRight: column.align === 'center' ? 0 : 20
                }}
                rowSpan={1}
              >
                {column.title}
              </th>
            ))}
            </tr>
          )}
        </thead>

        {!this.props.loading && Array.isArray(dataSource) && dataSource.length > 0 && (
        <tbody>
          {this.getRows(startColIndex, endColIndex)}
        </tbody>
        )}
      </table>
    );
  }

  render() {
    const {
      className,
      columns = [],
      dataSource,
      fixHeader,
      expandedRowRender,
      rowSelection,
      rowKey,
      fixColumnCount
    } = this.props;

    const { columnsWidth } = this.state;

    return (
      <div
        className={classNames(
          'table',
          { [className]: !!className }
        )}
      >
        <div
          className="table-wrapper"
          style={{
            paddingLeft: (fixColumnCount && columnsWidth.length > 0)
              ? columnsWidth.slice(0, fixColumnCount).reduce((prev, current) => prev + current, 0)
              : null
          }}
        >
          {this.getTable('flowTable', fixColumnCount, columns.length, 'flow-table')}

          {(this.props.loading || dataSource == null) && (
          <div className="loading">
            <div className="default-loading">
              加载中...
            </div>
          </div> 
          )}

          {dataSource && dataSource.length === 0 && (
          <div className="no-data">
          {isFunction(this.props.noDataRender)
            ? (
              this.props.noDataRender()
            )
            : (
              <div className="default-no-data">
                没有数据
              </div>
            )
          }
          </div>
          )}

          {fixColumnCount ? this.getTable('fixTable', 0, fixColumnCount, 'fix-table') : null}
        </div>
      </div>
    );
  }
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;
Table.ASC = 'asc';
Table.DESC = 'desc';

export default Table;
