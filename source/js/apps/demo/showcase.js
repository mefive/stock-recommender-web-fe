import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import 'styles/core';
import 'styles/apps/showcase.scss';

import Trigger from 'components/Trigger';
import Popover from 'components/Popover';
import Select from 'components/Select';
import Modal from 'components/Modal';
import Alert from 'components/Alert';
import Calendar from 'components/Calendar';
import DatePicker from 'components/DatePicker';
import DateRangeSelect from 'components/DateRangeSelect';
import Table from 'components/Table';
import ShowcaseContainer from './ShowcaseContainer';
import Tooltip from 'components/Tooltip';

const GridItem = (props) => (
  <div className="col col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-1">
    <div className="item-wrapper">
      <div className="item">
        {props.children}
      </div>
    </div>
  </div>
);

class Showcase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nameSelectValue: [1, 2, 3],
      showModal: true,
      showAlert: false,
      calendarValue: moment().format('YYYY-MM-DD'),
      datePickerValue: moment().format('YYYY-MM-DD'),
      dateRangeSelectStartValue: moment().format('YYYY-MM-DD'),
      dateRangeSelectEndValue: moment().format('YYYY-MM-DD'),
      tableDataSource: [
        {
          name: 'mefive',
          age: 31,
          gender: 'male',
          birthDate: '1985-12-20',
          two: '123',
          three: '123',
          description: 'Programmer, has been burning for a chance to make the world a better place.'
        },
        {
          name: 'lalasheep',
          age: 30,
          gender: 'female',
          birthDate: '1986-03-07',
          description: 'Painter, dedicate life to drawing.'
        }
      ],
      tableSelectedRowKeys: [0]
    };
  }

  render() {
    return (
      <div className="container">
        <ShowcaseContainer title="Trigger">
          <Trigger
            popover={(
              <Popover className="trigger-popover">
                <div>Popover</div>
                <div>
                  <div className="btn btn-primary">
                    Click
                  </div>
                </div>
              </Popover>
            )}
            enterClassName="slide-up-in"
            leaveClassName="slide-up-out"
          >
            <div className="btn btn-primary">
              Top
            </div>
          </Trigger>
        </ShowcaseContainer>

        <ShowcaseContainer title="Select">
          <label>
            <Select
              options={(() => {
                const ops = [];

                for (let i = 0; i < 20; i++) {
                  ops.push({ value: i, title: `${i}` });
                }

                return ops;
              })()}
              multiple
              value={this.state.nameSelectValue}
              max={5}
              onChange={nameSelectValue => this.setState({ nameSelectValue })}
            />
          </label>
        </ShowcaseContainer>

        <ShowcaseContainer title="Modal">
          <div
            className="btn btn-primary"
            onClick={() => this.setState({
              showModal: true
            })}
          >
            Show Modal
          </div>

          <Modal
            onClose={() => this.setState({
              showModal: false
            })}
            title="Test"
            visible={this.state.showModal}
          >
            <div className="dialog-content">
              123
            </div>

            <div className="dialog-actions">
              <div
                className="btn btn-normal btn-primary"
                onClick={() => this.setState({
                  showModal: false
                })}
              >
                确定
              </div>
            </div>
          </Modal>
          <div
            className="btn btn-primary"
            onClick={() => this.setState({
              showAlert: true
            })}
          >
            Show Alert
          </div>
          <Alert
            onClose={() => this.setState({
              showAlert: false
            })}
            visible={this.state.showAlert}
          >
            Error!
          </Alert>
        </ShowcaseContainer>

        <ShowcaseContainer title="Calendar">
          <Calendar
            value={this.state.calendarValue}
            max={moment().format('YYYY-MM-DD')}
            onChange={value => this.setState({ calendarValue: value })}
          />
        </ShowcaseContainer>

        <ShowcaseContainer title="DatePicker">
          <DatePicker
            value={this.state.datePickerValue}
            onChange={value => this.setState({ datePickerValue: value })}
          />
        </ShowcaseContainer>

        <ShowcaseContainer title="DateRangeSelect">
          <DateRangeSelect
            start={this.state.dateRangeSelectStartValue}
            end={this.state.dateRangeSelectEndValue}
            onChange={value => {
              const { start, end } = value;

              this.setState({
                dateRangeSelectStartValue: start,
                dateRangeSelectEndValue: end
              });
            }}
          />
        </ShowcaseContainer>

        <ShowcaseContainer title="Table">
          <Table
            columns={[
              {
                key: 'index',
                title: 'index',
                render: (record, index) => index
              },
              {
                title: 'One',
                key: 'one',
                align: 'center',
                children: [
                  { key: 'two', title: 'Two' },
                  { key: 'three', title: 'Three' },
                  { key: 'four', title: 'Four' }
                ]
              },
              {
                key: 'name',
                title: 'Name',
                sortKey: 'name'
              },
              {
                key: 'age',
                title: 'Age',
                width: 100,
                sortKey: 'age'
              },
              {
                key: 'birthDate',
                title: 'Birthdate',
                render: record => (
                  <DatePicker
                    value={record.birthDate}
                    onChange={value => {
                      record['birthDate'] = value;
                      record['age'] = moment.duration(moment() - moment(value)).years();

                      this.setState({ tableDataSource: this.state.tableDataSource });
                    }}
                  />
                )
              },
              {
                key: 'gender',
                title: 'Gender',
                align: 'center',
                render: (record, recordIndex) => (
                  <Select
                    options={[
                      { value: 'male', title: 'Male' },
                      { value: 'female', title: 'Female'}
                    ]}
                    value={record.gender}
                    onChange={value => {
                      record['gender'] = value;
                      this.setState({ tableDataSource: this.state.tableDataSource });
                    }}
                  />
                )
              }
            ]}
            dataSource={this.state.tableDataSource}
            expandedRowRender={record => (
              <div className="description">
                {record.description}
              </div>
            )}
            rowSelection={{
              onChange: selectedRowKeys =>
                this.setState({ tableSelectedRowKeys: selectedRowKeys }),
              selectedRowKeys: this.state.tableSelectedRowKeys
            }}
            defaultSort={{
              key: 'name',
              direction: Table.ASC
            }}
          />
        </ShowcaseContainer>

        <ShowcaseContainer title="Grid">
          <div id="grid">
            <div className="row">
              <GridItem>1</GridItem>
              <GridItem>2</GridItem>
              <GridItem>3</GridItem>
              <GridItem>4</GridItem>
              <GridItem>5</GridItem>
              <GridItem>6</GridItem>
              <GridItem>7</GridItem>
              <GridItem>8</GridItem>
              <GridItem>9</GridItem>
              <GridItem>10</GridItem>
              <GridItem>11</GridItem>
              <GridItem>12</GridItem>
            </div>
          </div>
        </ShowcaseContainer>
        <ShowcaseContainer title="Tooltip" className="showcase-tooltip">
          <Tooltip title="message" placement={Popover.placement.BOTTOM}>
            <div>Bottom</div>
          </Tooltip>
          <Tooltip title="message" placement={Popover.placement.TOP}>
            <div>Top</div>
          </Tooltip>
          <Tooltip title="message" placement={Popover.placement.RIGHT}>
            <div>Right</div>
          </Tooltip>
          <Tooltip title="message" placement={Popover.placement.LEFT}>
            <div>Left</div>
          </Tooltip>
        </ShowcaseContainer>
      </div>
    )
  }
}

ReactDOM.render(
  <Showcase />,
  document.getElementById('main')
);
