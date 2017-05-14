import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import random from 'lodash/random';
import uniqueId from 'lodash/uniqueId';

import 'styles/core';
import 'styles/apps/showcase.scss';

import ShowcaseContainer from './ShowcaseContainer';

import Form from 'components/Form2';
import Input from 'components/Input';
import Select from 'components/Select';
import RadioGroup from 'components/RadioGroup';
import Table from 'components/Table';
import Animate from 'components/Animate';
import NotificationBar from 'components/NotificationBar';
import Scrollable from 'components/Scrollable';
import Draggable from 'components/Draggable';

const defaultFormProps = {
  labelWidth: 100,
  vertical: false
};

const TestForm = Form.create(defaultFormProps)(
  (props) => {
    const {
      form,
      onSubmit = () => null
    } = props;

    return (
      <Form { ...defaultFormProps } >
        <Form.Group required label="Name" helpBlock="123">
        {form.getFieldDecorator(
          <Form.Item
            required
            keyName="name"
          >
            <Input
              type="text"
            />              
          </Form.Item>
        )}
          <div className="btn btn-primary">haha</div>
        </Form.Group>

        <Form.Group label="IsCheck">
        {form.getFieldDecorator(
          <Form.Item
            keyName="isCheck"
          >
            <Input type="checkbox" />              
          </Form.Item>
        )}
        </Form.Group>

        <Form.Group label="Gender">
        {form.getFieldDecorator(
          <Form.Item
            keyName="gender"
          >
            <Select
              options={[
                { value: 'male', title: 'Male' },
                { value: 'female', title: 'Female'}
              ]}
            />              
          </Form.Item>
        )}
        </Form.Group>

        <Form.Group label="Category">
        {form.getFieldDecorator(
          <Form.Item
            keyName="category"
          >
            <Select
              options={[
                { value: 'worker', title: 'Worker' },
                { value: 'student', title: 'Student'}
              ]}
            />              
          </Form.Item>
        )}
        </Form.Group>

        <Form.Group label="ratio">
        {form.getFieldDecorator(
          <Form.Item
            keyName="ratio"
          >
            <RadioGroup
              options={[
                { value: 'worker', title: 'Worker' },
                { value: 'student', title: 'Student'}
              ]}
            />              
          </Form.Item>
        )}
        </Form.Group>

        <div className="form-actions">
          <div
            className="btn btn-primary"
            onClick={() => {
              if (!form.validate()) {
                onSubmit();
              }
            }}
          >
            Submit
          </div>
        </div>
      </Form>
    );
  }
);

const maxColumns = 20;

const columns = (() => {
  const rt = [];

  for (let i = 0; i < maxColumns; i++) {
    rt.push({
      key: `${i}`,
      title: `${random(0, 1000)}`
    });
  }

  return rt;
})();

const rows = (() => {
  const rt = [];
  const maxRows = 50;

  for (let i = 0; i < maxRows; i++) {
    const row = {};
    for (let j = 0; j < maxColumns; j++) {
      row[`${j}`] = `${random(0, 1000)}`;
    }
    rt.push(row);
  }

  return rt;
})();

class Showcase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formError: {},
      formDataSource: {
        name: 'mefive',
        isCheck: true,
        gender: 'male',
        ratio: 'worker'
      },
      animates: [],
      notifications: [],
      scrollBlockHeight: 800,
    }
  }

  render() {
    return (
      <div className="container">
        {/**<ShowcaseContainer title="Form">
          <TestForm
            dataSource={this.state.formDataSource}
            onChange={(key, value) => this.setState({
              formDataSource: {
                ...this.state.formDataSource,
                [key]: value
              }
            })}
            onSubmit={() => console.log('submit')}
          />

          {JSON.stringify(this.state.formDataSource)}
        </ShowcaseContainer>

        <ShowcaseContainer title="Table">
          <div className="big-column-table-wrapper">
            <Table
              className="big-column-table"
              columns={columns}
              dataSource={rows}
              fixColumnCount={2}
            />
          </div>
        </ShowcaseContainer>

        <ShowcaseContainer title="Animate">
          <Select
            options={[
              { title: '1', value: '1' },
              { title: '2', value: '2' },
              { title: '3', value: '3' },
              { title: '4', value: '4' },
            ]}
          />
          <div className="row">
            <div className="col col-width-6">
              <div
                className="btn btn-primary"
                onClick={() => this.setState({
                  animates: [...this.state.animates, {
                    key: uniqueId(),
                    message: `message${random(0, 1000)}`
                  }]
                })}
              >
                Push Animate Item
              </div>
            </div>

            <div className="col col-width-6">
              <div
                className="btn btn-default"
                onClick={() => this.setState({
                  animates: this.state.animates
                    .slice(0, this.state.animates.length - 1)
                })}
              >
                Pop Animate Item
              </div>
            </div>
          </div>

          <div>
            <Animate>
              {this.state.animates.map(item => (
                <div key={item.key}>
                  {item.message}
                </div>
              ))}
            </Animate>
          </div>

          <div style={{marginTop: 20}}>
            {JSON.stringify(this.state.animates)}
          </div>
        </ShowcaseContainer>

        <ShowcaseContainer title="Notification Bar">
          <NotificationBar
            dataSource={this.state.notifications}
            onRemove={index => {
              console.log('onRemove', index);
              const notifications = [ ...this.state.notifications ];
              notifications.splice(index, 1);
              this.setState({ notifications });
            }}
          />

          <div className="actions">
            <div
              className="btn btn-primary"
              onClick={() => {
                this.setState({
                  notifications:
                    [
                      ...this.state.notifications,
                      {
                        message: 'test',
                        id: uniqueId(),
                        type:
                          [
                            NotificationBar.Notification.type.SUCC,
                            NotificationBar.Notification.type.ERROR
                          ][random(0, 1)]
                      }
                    ]
                })
              }}
            >
              Push
            </div>

            <div
              className="btn btn-default"
              onClick={() => {
                const index = this.state.notifications.length - 1;
                const notifications = [ ...this.state.notifications ];
                notifications.splice(index, 1);
                this.setState({ notifications });
              }}
            >
              Pop
            </div>
          </div>
        </ShowcaseContainer>**/}
        <ShowcaseContainer title="Scrollable">
          <div>
            <div
              className="btn btn-default"
              onClick={() => this.setState({ scrollBlockHeight: random(400, 800) })}
            >
              Shrink
            </div>
          </div>
          <Scrollable
            height={400}
          >
            <div
              className="scroll-block"
              style={{
                height: this.state.scrollBlockHeight,
                width: 200,
                backgroundColor: 'black',
                color: 'white',
                lineHeight: '400px',
                textAglin: 'center',
                padding: 20,
              }}
            >
              123
            </div>
          </Scrollable>
        </ShowcaseContainer>

        <ShowcaseContainer title="Draggable">
          <div
            style={{
              width: 400,
              height: 400,
              outline: '1px solid',
              position: 'relative',
            }}
          >
            <Draggable
              containerWidth={400}
              containerHeight={400}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  outline: '1px solid blue',
                  cursor: 'pointer',
                  position: 'absolute',
                }}
              />
            </Draggable>
          </div>
        </ShowcaseContainer>
      </div>
    );
  }
}

ReactDOM.render(
  <Showcase />,
  document.getElementById('main')
);
