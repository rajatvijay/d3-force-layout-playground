import React, { Component } from "react";
import GRAPH_DATA from "../../dataForMoviesAndActorsWithLessData";
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

const AUTOCOMPLETE_OPTIONS = GRAPH_DATA.nodes.map(d => d.name);

class Main extends Component {
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
    return (
      <div className="root">
        <div id="force-graph" />

        {/* TODO: Move settings as a separate component */}
        <div className="settings">
          <div>
            <Autocomplete
              placeholder="Search Node: "
              className="autocomplete-root"
              options={AUTOCOMPLETE_OPTIONS}
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
              defaultValue="0"
              onChange={this.handleThresholdChange}
            />
            <span> 100</span>
          </div>
          <div>
            <input type="checkbox" onChange={this.handleToggleHighlighting} />
            <span> Enable highlighting</span>
          </div>
          <div>
            <input type="checkbox" onChange={this.handleToggleLabels} />
            <span> Enable Lables</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
