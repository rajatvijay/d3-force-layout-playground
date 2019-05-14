import React, { Component } from "react";
import "./Autocomplete.css";

class Autocomplete extends Component {
  state = {
    filteredOptions: [],
    inputValue: "",
    showOptions: false
  };
  handleInputChange = e => {
    const { value } = e.target;
    const filteredOptions = getFilteredOptions(value, this.props.options);
    this.setState({
      inputValue: value,
      filteredOptions: filteredOptions,
      showOptions: !!(filteredOptions && filteredOptions.length)
    });
  };
  handleOptionSelect = e => {
    const { innerText } = e.target;
    this.setState({
      inputValue: innerText,
      showOptions: false
    });
    this.props.onSelect(innerText);
  };
  render() {
    const { filteredOptions, inputValue, showOptions } = this.state;
    return (
      <div className="root">
        <input
          type="text"
          value={inputValue}
          onChange={this.handleInputChange}
        />
        {showOptions && (
          <ul className="options-list">
            {filteredOptions.map(option => (
              <li onClick={this.handleOptionSelect}>{option}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Autocomplete;

// Should ideally be taken from the props
function getFilteredOptions(value, options) {
  if (!value) {
    return [];
  }
  return options.filter(option => option.includes(value));
}
