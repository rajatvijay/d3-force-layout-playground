import React, { Component } from "react";
import GRAPH_DATA from "../../data";
import { generateBasicGraph, threshold } from "../../core";
import "./Main.css";

class Main extends Component {
  state = {
    data: GRAPH_DATA
  };

  componentDidMount() {
    const { data } = this.state;
    generateBasicGraph(data, "force-graph");
  }

  handleThresholdChange = e => {
    const { value } = e.target;
    threshold(value);
  };

  render() {
    return (
      <div className="root">
        <div id="force-graph" />
        <div className="settings">
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
        </div>
      </div>
    );
  }
}

export default Main;