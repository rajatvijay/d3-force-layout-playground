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
  node = svg
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 8)
    .style("fill", function(d) {
      return color(d.group);
    })
    .call(force.drag);

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

    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
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
