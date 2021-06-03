function graphColoring(links, nodes) {
  adjList = [];

  for (let i = 0; i < NumberOfRealNodes; i++) {
    // make adj lists 2d
    adjList.push([]);
  }

  let availableColorIDs = Array(NumberOfRealNodes + 2).fill(true); // boolean array to check what colors are available
  let chromaticNr = 1;

  createAdjLists(links, true, false, adjList, revAdjList);

  let colorID = 1;
  nodes[0].group = colorID; // color starting node with color 1

  for (let i = 1; i < NumberOfRealNodes; i++) {
    for (let j = 0; j < adjList[i].length; j++) {
      if (nodes[adjList[i][j]].group != -5)
        availableColorIDs[nodes[[adjList[i][j]]].group] = false;
      // iterate thru adj list for current node i
      // if the group of the current node j from adj list is not assigned a color (aka it's -5)
      // then it means that node already has a color so node i can't have the same color as its neighbour
      // so we set the color id from node j as false in the availabe colors
    }

    for (let k = 1; k < availableColorIDs.length; k++) {
      if (availableColorIDs[k] === true) {
        colorID = k; // check for available colors and set color id for node i the smallest color available
        if (colorID > chromaticNr) chromaticNr = colorID; // update chromatic nr

        break;
      }
    }

    nodes[i].group = colorID; // assign colorID

    for (let i = 1; i < availableColorIDs.length; i++) {
      availableColorIDs[i] = true; // reset available colors for next node
    }
  }

  return chromaticNr;
}
