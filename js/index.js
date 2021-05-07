///////////////    Our Graph    ////////////////

// Graph Nodes
let nodes = [
  { name: "s" },
  { name: "t" },
  { name: "a" },
  { name: "b" },
  { name: "c" },
  { name: "d" },
];

// Graph Links/Eadges
let links = [
  { source: 0, target: 2, capacity: 10, flow: 0 },
  { source: 0, target: 3, capacity: 10, flow: 0 },
  { source: 2, target: 3, capacity: 2, flow: 0 },
  { source: 2, target: 4, capacity: 4, flow: 0 },
  { source: 2, target: 5, capacity: 8, flow: 0 },
  { source: 3, target: 5, capacity: 9, flow: 0 },
  { source: 4, target: 1, capacity: 10, flow: 0 },
  { source: 5, target: 4, capacity: 6, flow: 0 },
  { source: 5, target: 1, capacity: 10, flow: 0 },
];

let NumberOfRealLinks = links.length;
let NumberOfRealNodes = nodes.length;

// Sources and Targets of our flow, here can go any number of nodes
let s = [];
let t = [];

//////////////////    Text area / Editor input    ////////////////////

// Adds start end nodes from DOM
function addStartEndNodes() {
  let start = document.getElementById("startData").value;
  let end = document.getElementById("endData").value;

  s = [];
  t = [];

  start = start.split(" ");
  end = end.split(" ");

  for (let i = 0; i < start.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (start[i] == nodes[j].name) {
        s.push(j);
      }
    }
  }

  for (let i = 0; i < end.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (end[i] == nodes[j].name) {
        t.push(j);
      }
    }
  }
}

// Adds a new edge
function addEdge(s, t, c) {
  for (let i = 0; i < links.length; i++) {
    if (links[i].source === s && links[i].target === t) {
      links[i].capacity = c;
      return;
    }
  }
  links.push({ source: s, target: t, capacity: c, flow: 0 });
  NumberOfRealLinks = links.length;
  NumberOfRealNodes = nodes.length;
}

// Gets the node index if it exists else a new node is created
function getNode(name) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].name == name) {
      return i;
    }
  }
  nodes.push({ name: name });
  return nodes.length - 1;
}

// Gets the text from editor and passes it to the required functions
function getText() {
  let lines = document.getElementById("textAreaID").value.split("\n");
  let edgeData;
  for (let i = 0; i < lines.length; i++) {
    edgeData = lines[i].split(" ");
    if (edgeData.length >= 3) {
      let c = parseInt(edgeData[2], 10);
      if (isNaN(c)) {
        alert("Invalid edge data on line " + (i + 1));
      } else {
        let s = getNode(edgeData[0]);
        let t = getNode(edgeData[1]);
        addEdge(s, t, c);
      }
    }
  }
}

function clearColorLinks() {
  for (let i = 0; i < links.length; i++) {
    links[i].flow = 0;
  }
}

function removeFakeLinksNodes() {
  let excessLinks = links.length - NumberOfRealLinks;
  let excessNodes = nodes.length - NumberOfRealNodes;
  for (let i = 0; i < excessLinks; i++) {
    links.pop();
  }
  for (let i = 0; i < excessNodes; i++) {
    nodes.pop();
  }
}
/////////////////   Buttons functionality    ///////////////////

var result = document.getElementById("result");

// Max Flow Button
document.getElementById("maxFlowBtn").onclick = function () {
  addStartEndNodes();
  if (s.length != 0 && t.length != 0) {
    result.innerHTML = "Maximum flow is " + multiFord(links, nodes, s, t);
  } else {
    alert("Add valid start and end nodes.");
  }

  graphRemove();
  graphInit(1);
  removeFakeLinksNodes();
};

//Shortest Path Button
document.getElementById("shortPathBtn").onclick = function () {
  addStartEndNodes();
  clearColorLinks();
  if (s.length != 0 && t.length != 0) {
    result.innerHTML = "Shortest path is " + Dijkstra(links, nodes, s, t);
  } else {
    alert("Add valid start and end nodes.");
  }
  graphRemove();
  graphInit(2);
};

// Min Tree Button
document.getElementById("minTreeBtn").onclick = function () {
  clearColorLinks();
  result.innerHTML = "Minimum spanning tree weight is " + minTree(links, nodes);
  graphRemove();
  graphInit(3);
};

// Add Edge Button
document.getElementById("addEdgesBtn").onclick = function () {
  clearColorLinks();
  getText();
  graphRemove();
  graphInit(1);
};

// Delete Graph Button
document.getElementById("deleteGraphBtn").onclick = function () {
  nodes = [];
  links = [];
  graphRemove();
  graphInit(1);
};

// Load File Button
document.getElementById("input-file").addEventListener("change", getFile);

function getFile(event) {
  const input = event.target;
  if ("files" in input && input.files.length > 0) {
    readFileContent(input.files[0]);
  }
}

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) =>
      (document.getElementById("textAreaID").value = event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

/////////////////////////    D3.js    ////////////////////////////

// Credit to Vlada for the big comments on D3.js

// These copies are created because D3.js changes some esential object proprieties and max flow algorithm won't work
let d3links; // Here will be a copy of links
let d3nodes; // Here will be a copy of nodes
let svg;

// Removes the existing graph
function graphRemove() {
  svg.selectAll("*").remove();
  d3nodes = [];
  d3links = [];
}

// Draws a new graph
function graphInit(algo) {
  d3links = JSON.parse(JSON.stringify(links));
  d3nodes = JSON.parse(JSON.stringify(nodes));

  // Screen width to make the app more responsive
  var swidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  // When the number of nodes will increase, the svg size will increase as well
  document.getElementById("svgID").setAttribute("height", d3nodes.length * 100);
  document.getElementById("svgID").setAttribute("width", swidth * 0.8);

  svg = d3.select("svg");
  var colors = d3.scaleOrdinal(d3.schemeCategory10),
    width = swidth * 0.8,
    height = d3nodes.length * 100,
    node,
    link,
    edgepaths,
    edgelabels;

  // All the code below is for arow head
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 13)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#999")
    .attr("fill-opacity", "0.8")
    .style("stroke", "none");

  /* A note about forces:
    D3 force simulation works like this:
    the basic stuff is forceManyBody, which makes nodes spring apart
    or get together, centerForce, which pulls the graph towards a given
    center, and linkForce, which sets the distance between nodes, etc.
    For a more in-depth analysis, read D3 API. :) */

  var simulation = d3
    .forceSimulation(d3nodes)
    .force("link", d3.forceLink().links(d3links).distance(50).strength(0.85))
    .force("charge", d3.forceManyBody().strength(-2500))
    .force("center", d3.forceCenter(width / 2, height / 2));

  link = svg
    .selectAll(".link")
    .data(d3links)
    .enter()
    .append("line")
    .attr("stroke-width", 5)
    .attr("stroke", function (d) {
      if (d.capacity === INF && algo === 1) return "lime";
      if (d.flow > 0) return "yellow";
      else return "lightgray";
    })
    .attr("stroke-opacity", "0.5")
    .attr("class", "link")
    .attr("marker-end", function () {
      if (algo === 1) return "url(#arrowhead)";
      else return " ";
    });

  /* 
  A note about edgepaths & edgelabels:
    they are not obligatory. BUT because we want edgelabels,
    we need edge paths. Edgepaths are nothing but paths (read about D3 paths)
    which follow the original links. Aka have the same shape.
    Here they are set to invisible because we only need them for labels.
    Now edgelabels are simply a text element which is mapped to the id of an
    edgepath which in this case display the weight of the link (or capacity).
    Most of the attributes are prety self-explanatory, but the
    "xlink:href" one is what maps the label to the path aka assures that it's 
    in the right place. 
    */

  edgepaths = svg
    .selectAll(".edgepath")
    .data(d3links)
    .enter()
    .append("path")
    .attr("class", "edgepath")
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .attr("id", (d, i) => "edgepath" + i)
    .style("pointer-events", "none");

  edgelabels = svg
    .selectAll(".edgelabel")
    .data(d3links)
    .enter()
    .append("text")
    .style("pointer-events", "none")
    .attr("class", "edgelabel")
    .attr("id", (d, i) => "edgelabel" + i)
    .attr("writing-mode", "vertical-rl")
    .attr("font-size", 11)
    .attr("fill", "white");

  edgelabels
    .append("textPath")
    .attr("xlink:href", (d, i) => "#edgepath" + i)
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text(function (d) {
      if (algo === 3 || algo === 2) return d.capacity;
      if (d.capacity === INF) {
        return d.flow + " / INF";
      }
      if (d.flow) {
        return d.flow + " / " + d.capacity;
      } else {
        return 0 + " / " + d.capacity;
      }
    });

  node = svg
    .selectAll(".node")
    .data(d3nodes)
    .enter()
    .append("g")
    .attr("class", "node");

  node
    .append("circle")
    .attr("r", (d) => {
      if (d.name === "fakeS" || d.name === "fakeT") {
        return 9;
      } else {
        return 7;
      }
    })
    .style("fill", (d, i) => colors(i))
    .attr("stroke", (d) => {
      if (d.name === "fakeS" || d.name === "fakeT") {
        return "lime";
      } else {
        return "white";
      }
    })
    .attr("stroke-width", (d) => {
      if (d.name === "fakeS" || d.name === "fakeT") {
        return 3;
      } else {
        return 2;
      }
    });

  node.append("title").text((d) => {
    return d.name;
  });

  node
    .append("text")
    .attr("dy", -10)
    .text((d) => {
      if (d.name === "fakeS") {
        return "S";
      } else if (d.name === "fakeT") {
        return "T";
      } else {
        return d.name;
      }
    })
    .attr("fill", "white");

  /* A note about ticked:
  To be honest I don't fully understand it myself :D
  But, the basics of it is that it's needed for the graph to
  set the right positions and maintain said positions for 
  the nodes, links and paths. Because the nodes in this case are
  represented by a group, their position is updated with the
  transform attribute (read about SVG groups and transform!).
  
  The links, because they are only lines(read about SVG lines!)
  are updated by changing their initial and finishing x,y coord.
  
  And paths, because they are paths (read about D3 paths!)
  are updated using M and L commands + link coordinates. Whew.
  */

  simulation.nodes(d3nodes).on("tick", ticked);

  simulation.force("link").links(d3links);

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => "translate(" + d.x + ", " + d.y + ")");

    edgepaths.attr(
      "d",
      (d) => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`
    );
  }
}

// The firs graph render
graphInit(1);

// Scroll to the top of the window when page is loaded
window.scrollTo(0, 0);
