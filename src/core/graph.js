// TODO: Fix it later
const d3 = window.d3;
const WIDTH = 500;
const HEIGHT = 500;

//Set up the colour scale
const color = d3.scale.category20();

//Set up the force layout
const force = d3.layout
  .force()
  .charge(-120)
  .linkDistance(50)
  .size([WIDTH, HEIGHT]);

let svg;
let graph, graphRec;
let link;
let node;
let nodeDrag;
let linkedByIndex = {};

export function generateBasicGraph(data, containerId) {
  graph = data;
  graphRec = JSON.parse(JSON.stringify(graph));

  //Append a SVG to the body of the html page. Assign this SVG as an object to svg
  svg = d3
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  //Create all the line svgs but without locations yet
  link = svg
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) {
      return Math.sqrt(d.value);
    });

  //Do the same with the circles for the nodes - no
  node = node = svg
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(force.drag);
  node
    .append("circle")
    .attr("r", 8)
    .style("fill", function(d) {
      return color(d.group);
    });

  node
    .append("text")
    .attr("dx", 10)
    .attr("dy", ".35em")
    .text(function(d) {
      return d.name;
    })
    .style("stroke", "gray")
    .style("display", "none");

  nodeDrag = d3.behavior
    .drag()
    .on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);

  function dragstart(d, i) {
    force.stop(); // stops the force auto positioning before you start dragging
  }
  function dragmove(d, i) {
    d.px += d3.event.dx;
    d.py += d3.event.dy;
    d.x += d3.event.dx;
    d.y += d3.event.dy;
  }
  function dragend(d, i) {
    d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
    force.resume();
  }
  function releasenode(d) {
    d.fixed = false; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
    //force.resume();
  }

  node.on("dblclick", releasenode).call(nodeDrag);

  //Creates the graph data structure out of the json data
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
  force.on("tick", function() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });
    d3.selectAll("circle")
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
    d3.selectAll("text")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });
  });
}

export function threshold(thresh) {
  graph.links.splice(0, graph.links.length);

  for (var i = 0; i < graphRec.links.length; i++) {
    if (graphRec.links[i].value > thresh) {
      graph.links.push(graphRec.links[i]);
    }
  }
  restart();
}

// Toggle code
export function enableHighlighting() {
  //Create an array logging what is connected to what
  for (let i = 0; i < graph.nodes.length; i++) {
    linkedByIndex[i + "," + i] = 1;
  }
  graph.links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  node.on("dblclick", toggleHighlight());
}

export function disableHighlighting() {
  linkedByIndex = {};
  node.on("dblclick", null);
}

//This function looks up whether a pair are neighbours
function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}

function toggleHighlight() {
  let isHighlighting = true;
  return function onHighlight() {
    if (isHighlighting) {
      //Reduce the opacity of all but the neighbouring nodes
      const d = d3.select(this).node().__data__;
      node.style("opacity", function(o) {
        return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
      });
      link.style("opacity", function(o) {
        return (d.index === o.source.index) | (d.index === o.target.index)
          ? 1
          : 0.1;
      });
      // //Reduce the op
      // toggle = 1;
      isHighlighting = false;
    } else {
      //Put them back to opacity=1
      node.style("opacity", 1);
      link.style("opacity", 1);
      // toggle = 0;
      isHighlighting = true;
    }
  };
}

//Restart the visualisation after any node and link changes
function restart() {
  link = link.data(graph.links);
  link.exit().remove();
  link
    .enter()
    .insert("line", ".node")
    .attr("class", "link");
  node = node.data(graph.nodes);
  node
    .enter()
    .insert("circle", ".cursor")
    .attr("class", "node")
    .attr("r", 5)
    .call(force.drag);
  force.start();
}

export function showLabels() {
  node.selectAll("text").style("display", "block");
}

export function disableLabels() {
  node.selectAll("text").style("display", "none");
}

export function searchNode(selectedVal) {
  //find the node
  const node = svg.selectAll(".node");
  if (!selectedVal) {
    node.style("stroke", "white").style("stroke-width", "1");
  } else {
    const selected = node.filter(function(d, i) {
      return d.name !== selectedVal;
    });
    selected.style("opacity", "0");
    var link = svg.selectAll(".link");
    link.style("opacity", "0");
    d3.selectAll(".node, .link")
      .transition()
      .duration(5000)
      .style("opacity", 1);
  }
}
