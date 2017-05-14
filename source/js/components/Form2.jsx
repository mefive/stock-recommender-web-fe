import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash/pick';
import isFunction from 'lodash/isFunction';

import 'styles/components/form.scss';

import Input from './Input';
import Select from './Select';

function isHasValue(type) {
  return [Input, Select].indexOf(type) !== -1;
}

class Form extends Component {
  static propTypes = {
    classNames: PropTypes.string,
  }

  render() {
    const {
      className,
      children,
    } = this.props;

    return (
      <div
        className={classNames(
          'form',
          { [className]: !!className }
        )}
      >
        <div className="form-group-container">
          {React.Children.map(
            this.props.children,
            (child) => {
              if (child && child.type === FormGroup) {
                return React.cloneElement(
                  child,
                  {
                    vertical: this.props.vertical,
                    labelWidth: this.props.labelWidth
                  }
                );
              }

              return child;
            }
          )}
        </div>
      </div>
    );
  }
}

class FormGroup extends Component {
  render() {
    const { className, vertical, label, labelWidth, helpBlock } = this.props;

    return (
      <div
        className={classNames(
          "form-group",
          { [className]: !!className } 
        )}
      >
        {label && (
          <label
            style={{ width: vertical ? null : labelWidth }}
            className={classNames(
              { 'vertical': !!vertical }
            )}
          >
          {this.props.required && (
            <span className="required">*</span>
          )}
            {label}
          </label>
        )}

        <div
          style={{
            marginLeft: vertical || !label ? null : labelWidth
          }}
        >
        {this.props.children}
        </div>

        {helpBlock && (
          <div
            className="help-block"
            style={{
              marginLeft: vertical || !label ? null : labelWidth
            }}
          >
            {helpBlock}
          </div>
        )}
      </div>
    );
  }
}

FormGroup.defaultProps = {
  labelWidth: 120,
  vertical: false,
};

Form.Group = FormGroup;

class FormItem extends Component {
  render() {
    const { error } = this.props;

    return (
      <div
        className={classNames(
          "form-control",
          { [this.props.errorClass]: error } 
        )}
        data-key={this.props.keyName}
      >
        {React.Children.map(this.props.children, child => {
          return React.cloneElement(
            child,
            {
              onChange: value => this.props.onChange(this.props.keyName, value),
              value: this.props.value
            }
          )
        })}

        {error && (
          <div
            className="error-tip"
          >
            {error}
            <i className="icon icon-times-circle-o"></i>
          </div>
        )}
      </div>
    )
  }
}

FormItem.defaultProps = {
  errorClass: 'has-error',
  onChange: () => null,
}

Form.Item = FormItem;

Form.create = function (defaultProps = {}) {
  return WrappedComponent => {
    class DecoratedForm extends Component {
      constructor(props) {
        super(props);

        this.rules = {};

        this.clearRules = ::this.clearRules;
        this.getFieldDecorator = ::this.getFieldDecorator;
        this.validate = ::this.validate;

        this.state = {
          errors: {},
          ...props
        }
      }

      componentWillReceiveProps(nextProps) {
        this.setState({
          ...nextProps
        });
      }

      clearRules() {
        this.rules = {};
      }

      getFieldDecorator(formItem) {
        const { keyName } = formItem.props;

        const { errors, onChange, dataSource } = this.state;

        const error = errors[keyName];

        const rule = pick(
          formItem.props,
          ['required', 'max', 'min', 'maxLength', 'minLength', 'regex', 'getError']
        );

        if (Object.keys(rule).length > 0) {
          this.rules[keyName] = rule;
        }

        return React.cloneElement(
          formItem,
          {
            onChange,
            value: dataSource[keyName],
            error,
            children: React.Children.map(formItem.props.children, child =>
              React.cloneElement(
              child,
                {
                  onFocus: () => {
                    const { onFocus } = child.props;

                    if (onFocus) {
                      onFocus();
                    }

                    if (error) {
                      delete errors[keyName];
                      this.setState({ errors });
                    }
                  }
                }
              )
            )
          }
        );
      }

      validate(fields) {
        const { dataSource } = this.state;
        const errors = {};

        if (typeof fields === 'string') {
          fields = [fields];
        }

        Object.keys(this.rules).forEach(keyName => {
          const value = dataSource[keyName];

          const { required, maxLength, minLength, regex, getError }
            = this.rules[keyName];

          const error = [];

          if (!fields || fields.indexOf(keyName) !== -1) {
            if (isFunction(getError)) {
              const customError = getError(value);

              if (customError) {
                error.push(customError);
              }
            }
            else {
              if (!value) {
                if (required) {
                  error.push('必填项不能为空');
                }
              }
              else if (typeof value === 'string' && !value.trim()) {
                if (required) {
                  error.push('必填项不能为空');
                }
              }
              else {
                if (value.length > maxLength) {
                  error.push('不得大于' + maxLength + '个字符');
                }

                if (value.length < minLength) {
                  error.push('不得小于' + minLength + '个字符');
                }
              }

              if (value && value.length > 0 && regex && !regex.test(value)) {
                error.push('格式不正确');
              }
            }

            if (error.length > 0) {
              errors[keyName] = error.join(',');
            }
          }
          else {
            delete errors[keyName];
          }
        });

        this.setState({ errors });

        return Object.keys(errors).length === 0;
      }

      render() {
        const { validate, getFieldDecorator, clearRules } = this;

        const props = {
          form: {
            validate,
            getFieldDecorator,
            clearRules,
          },
          ...this.props,
          ...defaultProps
        };

        return <WrappedComponent { ...props } />;
      }
    }

    return DecoratedForm;
  }
}

export default Form;
