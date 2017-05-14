import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

const propTypes = {
  candidates: PropTypes.array,
  maxHeight: PropTypes.number,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

const defaultProps = {
  candidates: [],
  maxHeight: 200,
  onBlur: () => null,
  onChange: () => null,
  onFocus: () => null,
  onSelect: () => null,
  placeholder: '',
  value: '',
};

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      overIndex: -1,
    };
  }

  render() {
    const {
      candidates,
      maxHeight,
      onBlur,
      onChange,
      onFocus,
      onSelect,
      placeholder,
      value } = this.props;
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <Input
          placeholder={placeholder}
          onBlur={() => setTimeout(() => {
            onBlur();
            this.setState({
              display: false,
            });
          }, 100)}
          onChange={onChange}
          onFocus={() => {
            onFocus();
            this.setState({
              display: true,
            });
          }}
          value={value}
        />
      <ul
          style={{
            position: 'absolute',
            maxHeight: `${maxHeight}px`,
            width: '100%',
            marginTop: '2px',
            border: '1px solid #E0E7EB',
            borderRadius: '2px',
            backgroundColor: '#fff',
            overflow: 'auto',
            transition: 'all .2s ease',
            transform: `scaleY(${this.state.display ? '1' : '0'})`,
            transformOrigin: '0 0',
          }}
        >
          {candidates.map((element, index) => (
            <li
              key={index}
              style={{
                cursor: 'pointer',
                padding: '4px 6px',
                color: this.state.overIndex === index ? '#fff' : null,
                backgroundColor: this.state.overIndex === index ? '#0080ec' : null,
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(element.value);
                }}
                onMouseOver={() => this.setState({
                  overIndex: index,
                })}
                onMouseOut={() => this.setState({
                  overIndex: -1,
                })}
              >
                {element.title}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Search.propTypes = propTypes;

Search.defaultProps = defaultProps;

export default Search;
