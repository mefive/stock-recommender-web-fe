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
          {this.props.children}
        </div>
      </div>
    );
  }
}

class FormItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    errorClass: PropTypes.string,
    error: PropTypes.string,
    helpBlock: PropTypes.string,
    onChange: PropTypes.func,
    labelWidth: PropTypes.number,
    keyName: PropTypes.string
  }

  static defaultProps = {
    errorClass: 'has-error',
    onChange: () => null,
    labelWidth: 120,
    vertical: false,
  }

  render() {
    const {
      className,
      errorClass,
      required,
      onChange,
      labelWidth,
      vertical,
      label,
      error,
      children,
      value,
      helpBlock,
      keyName
    } = this.props;

    return (
      <div
        className={classNames(
          'form-group',
          { [className]: !!className },
          { [errorClass]: !!error }
        )}
        data-field={keyName}
      >
        <label
          style={{ width: vertical ? null : labelWidth }}
          className={classNames(
            { 'vertical': !!vertical }
          )}
        >
        {required && (
          <span className="required">*</span>
        )}
          {label}
        </label>

        <div
          className="form-control"
          style={{
            marginLeft: vertical ? null : labelWidth
          }}
        >
          {React.Children.map(children, child => {
            return React.cloneElement(
              child,
              {
                onChange: value => onChange(keyName, value),
                value
              }
            )
          })}
        </div>

        {helpBlock && (
          <div
            className="help-block"
            style={{
              marginLeft: labelWidth
            }}
          >
            {helpBlock}
          </div>
        )}

        {error && (
          <div
            className="error-tip"
            style={{
              marginLeft: labelWidth
            }}
          >
            {error}
            <i className="icon icon-times-circle-o"></i>
          </div>
        )}
      </div>
    )
  }
}

Form.Item = FormItem;

Form.create = function (defaultProps) {
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
          ...defaultProps,
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

        const labelWidth = this.state.labelWidth || formItem.props.labelWidth;

        const {
          errors,
          onChange,
          dataSource,
          vertical
        } = this.state;
        const error = errors[keyName];

        const rule = pick(
          formItem.props,
          ['required', 'max', 'min', 'maxLength', 'minLength', 'regex', 'getError']
        );

        if (Object.keys(rule).length > 0) {
          this.rules[keyName] = rule;
        }

        const children
          = React.Children.only(formItem.props.children);

        return React.cloneElement(
          formItem,
          {
            onChange,
            value: dataSource[keyName],
            error,
            labelWidth,
            vertical,
            children: React.cloneElement(
              children,
              {
                onFocus: () => {
                  const { onFocus } = children.props;
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
                  error.push('大于' + maxLength + '个字符');
                }

                if (value.length < minLength) {
                  error.push('小于' + minLength + '个字符');
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
          ...this.props
        };

        return <WrappedComponent { ...props } />;
      }
    }

    return DecoratedForm;
  }
}

export default Form;
