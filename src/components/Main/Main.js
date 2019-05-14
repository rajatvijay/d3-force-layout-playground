import React, { Component } from "react";
import GRAPH_DATA from "../../data";
import {
  generateBasicGraph,
  threshold,
  enableHighlighting,
  disableHighlighting,
  showLabels,
  disableLabels,
  searchNode
} from "../../core";
import "./Main.css";
import Autocomplete from "./Autocomplete";

class Main extends Component {
  state = {
    // data: GRAPH_DATA,
    autocompleteOptions: GRAPH_DATA.nodes.map(d => d.name)
  };

  componentDidMount() {
    // const { data } = this.state;
    generateBasicGraph(GRAPH_DATA, "force-graph");
  }

  handleThresholdChange = e => {
    const { value } = e.target;
    threshold(value);
  };

  handleToggleHighlighting = e => {
    const { checked } = e.target;
    if (checked) {
      enableHighlighting();
    } else {
      disableHighlighting();
    }
  };

  handleToggleLabels = e => {
    const { checked } = e.target;
    if (checked) {
      showLabels();
    } else {
      disableLabels();
    }
  };

  handleSearch = selectedOption => {
    searchNode(selectedOption);
  };

  render() {
    const { autocompleteOptions } = this.state;
    return (
      <div className="root">
        <div id="force-graph" />
        <div className="settings">
          <div>
            <Autocomplete
              options={autocompleteOptions}
              onSelect={this.handleSearch}
            />
          </div>
          <div>
            <span>0 </span>
            <input
              type="range"
              name="points"
              min="0"
              max="10"
              onChange={this.handleThresholdChange}
            />
            <span>10 </span>
          </div>
          <div>
            <input type="checkbox" onChange={this.handleToggleHighlighting} />
            <span>Enable highlighting</span>
          </div>
          <div>
            <input type="checkbox" onChange={this.handleToggleLabels} />
            <span>Enable Lables</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
