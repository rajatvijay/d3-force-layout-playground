import React, { Component } from "react";
import GRAPH_DATA from "../../dataForMoviesAndActors";
import {
  generateBasicGraph,
  threshold,
  enableHighlighting,
  disableHighlighting,
  showLabels,
  disableLabels,
  searchNode,
  enableTooltip,
  disableTooltip
} from "../../core";
import "./Main.css";
import Autocomplete from "./Autocomplete";

class Main extends Component {
  state = {
    autocompleteOptions: GRAPH_DATA.nodes.map(d => d.name)
  };

  componentDidMount() {
    generateBasicGraph(
      GRAPH_DATA,
      "force-graph",
      window.innerWidth - 20,
      window.innerHeight - 20
    );
    enableTooltip();
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
      disableTooltip();
    } else {
      disableLabels();
      enableTooltip();
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
              placeholder="Search Node: "
              className="autocomplete-root"
              options={autocompleteOptions}
              onSelect={this.handleSearch}
            />
          </div>
          <div>
            <span>Breaklink: 0 </span>
            <input
              type="range"
              name="points"
              min="0"
              max="100"
              onChange={this.handleThresholdChange}
            />
            <span> 100</span>
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
