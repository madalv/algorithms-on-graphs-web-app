/* Notes: algo = 1 for maxflow, 2 for shortest path, 3 for minspan tree, 4 for strongly connected comps*/

///////////////    Our Graph    ////////////////

// Graph Nodes
let nodes = [
  { name: "s", group: "" },
  { name: "t", group: "" },
  { name: "a", group: "" },
  { name: "b", group: "" },
  { name: "c", group: "" },
  { name: "d", group: "" },
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

//////////////////   Some Variables    ////////////////////
let NumberOfRealLinks = links.length;
let NumberOfRealNodes = nodes.length;

// Sources and Targets of our flow, here can go any number of nodes
let s = [];
let t = [];

//colors from text areas, at first default
let nodeColor, linkColor, checkBox;

var result = document.getElementById("result");

// here will be the adjacency lists. to create them see createAdjLists func below.
// ! don't forget to empty them & make 'em 2d arrays before filling
let adjList = [],
  revAdjList = [];
//////////////////    Text area / Editor input    //////////////////

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

//////////////////    Functions     ////////////////////

//clears links of colors aka sets flow to 0
function clearColorLinks() {
  for (let i = 0; i < links.length; i++) {
    links[i].flow = 0;
  }
}

// Removes fake link nodes
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

// ... gets random color ...
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// this if for creating adjacency lists. to create adj list for undirected graph, pass undirected = true; to create reverse adj lists
// pass reverse = true.
function createAdjLists(links, undirected, reverse, adjList, revAdjList) {
  for (let i = 0; i < NumberOfRealLinks; i++) {
    u = links[i].source;
    v = links[i].target;

    adjList[u].push(v);
    if (undirected) adjList[v].push(u);

    if (reverse) revAdjList[v].push(u);
  }
}
/////////////////   Buttons functionality    ///////////////////

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

document.getElementById("sccBtn").onclick = function () {
  clearColorLinks();
  kosaraju(links);
  result.innerHTML = "The graph has " + components.length + " component(s)";
  graphRemove();
  graphInit(4);
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

//for tooltips on the page
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

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
  // reads link & node color from text areas under Colors every time graph updates
  nodeColor = document.getElementById("inputNodeColor").value;
  linkColor = document.getElementById("inputLinkColor").value;

  // here will be the random colors generator for displaying result for SCC algorithm
  let SCC_colors = [];

  // generating random colors for SCCs
  if (algo === 4) {
    for (let i = 0; i < components.length + 1; i++)
      SCC_colors[i] = getRandomColor();
  }

  // checks out if the checkbox is checked
  checkBox = document.getElementById("arcLinkcheck");

  d3links = JSON.parse(JSON.stringify(links));
  d3nodes = JSON.parse(JSON.stringify(nodes));

  // Screen width to make the app more responsive
  var swidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  // When the number of nodes will increase, the svg size will increase as well
  document.getElementById("svgID").setAttribute("height", d3nodes.length * 100);
  document.getElementById("svgID").setAttribute("width", swidth * 0.8);

  svg = d3.select("svg");
  var colors = [
      d3.scaleOrdinal(d3.schemeCategory10),
      d3.scaleOrdinal(d3.schemePastel2),
      d3.scaleOrdinal(d3.schemeDark2),
      d3.scaleOrdinal(d3.schemeSet3),
      d3.scaleOrdinal(d3.schemeTableau10),
    ],
    width = swidth * 0.8,
    height = d3nodes.length * 100,
    node,
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
    .attr("fill-opacity", "0.9")
    .style("stroke", "none");

  /** A note about forces:
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

  /* note about edgepaths & edgelabels:
      they are not obligatory. BUT because we want edgelabels,
      we need edge paths. Edgepaths are nothing but paths (read about D3 paths)
      which follow the original links. Aka have the same shape.
      Here they are set to invisible because we only need them for labels.
      Now edgelabels are simply a text element which is mapped to the id of an
      edgepath which in this case display the weight of the link (or capacity).
      Most of the attributes are prety self-explanatory, but the
      "xlink:href" one is what maps the label to the path aka assures that it's 
      in the right place.
      
    *!edit: before the edgepaths were invisible & we used lines as links. now I
    *!realized we could only have edgepaths without links. so now they're vital to the graph
*/

  edgepaths = svg
    .selectAll(".edgepath")
    .data(d3links)
    .enter()
    .append("path")
    .attr("class", "edgepath")
    .attr("fill-opacity", 0)
    .attr("id", (d, i) => "edgepath" + i)
    .style("pointer-events", "none")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("stroke-width", 4)
    .attr("stroke", function (d) {
      if (d.capacity === INF && algo === 1) return "lime"; // for FF algo (1) fake links are colored lime

      if (algo === 4) {
        // for Kosaraju algo (4), if links are part of components, color them as such. if not, gray
        let f = d.flow;
        if (f) return SCC_colors[f];
        else return "lightgray";
      }
      if (d.flow > 0 && (algo === 2 || algo === 3 || algo === 1))
        // if we're talking MinSpan, FF, or Dijkstra, color them if they're "active" -- aka have non-zero flow
        return linkColor;
      else return "lightgray";
    })
    .attr("stroke-opacity", "0.5")
    .attr("class", "link")
    .attr("marker-end", function () {
      if (algo === 1 || algo === 4) return "url(#arrowhead)";
      // if it's an algo for dir graphs, show arrow head
      else return " ";
    });

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

  // if it's the FF algorithm, show flow + capacity. else show only the capacity as link weight
  edgelabels
    .append("textPath")
    .attr("xlink:href", (d, i) => "#edgepath" + i)
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text(function (d) {
      if (algo === 3 || algo === 2 || algo === 4) return d.capacity;
      if (d.capacity === INF) {
        return d.flow + " / INF";
      }
      if (d.flow) {
        return d.flow + " / " + d.capacity;
      } else {
        return 0 + " / " + d.capacity;
      }
    });

  // REMOVED LINKS -- I've realized they're useless

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
    // if it's for Kosaraju algorithm (4), fill each node according to group. else if user has typed custom color/scheme, color them that
    .style("fill", (d, i) => {
      if (algo === 4) {
        let g = d.group;
        let cc = SCC_colors[g];
        return cc;
      }
      if (+nodeColor >= 0 && +nodeColor < 5) return colors[nodeColor](i);

      return nodeColor;
    })
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

  /*   A note about ticked:
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
    if (checkBox.checked == true) {
      // if checkbox for curvy links are checked, links are updated as arcs. if not, as straight lines
      edgepaths.attr("d", function (d) {
        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return (
          "M" +
          d.source.x +
          "," +
          d.source.y +
          "A" +
          dr +
          "," +
          dr +
          " 0 0,1 " +
          d.target.x +
          "," +
          d.target.y
        );
      });
    } else {
      edgepaths.attr(
        "d",
        (d) => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`
      );
    }
    node.attr("transform", (d) => "translate(" + d.x + ", " + d.y + ")");
  }
}

// The firs graph render
graphInit(1);

// Scroll to the top of the window when page is loaded
window.scrollTo(0, 0);
