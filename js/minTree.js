// Minimum Spanning Tree function made by Vlada =D
function minTree(links, nodes) {
  var nrOfNodes = nodes.length;
  var nrofLinks = links.length;

  var nodesList = new Array(nrOfNodes);

  for (let i = 0; i < nrOfNodes; i++) {
    nodesList[i] = i;
  }

  links.sort((a, b) => {
    return a.capacity - b.capacity;
  });

  var flagM = true,
    fincapacity = 0,
    id;

  for (let i = 0; i < nrofLinks; i++) {
    flagM = true;

    if (
      nodesList[links[i].target] != nodesList[links[i].source] &&
      links[i].target != links[i].source
    ) {
      fincapacity += links[i].capacity;
      links[i].flow = 1;

      id = nodesList[links[i].target];

      for (let j = 0; j < nrOfNodes; j++) {
        if (nodesList[j] === id) nodesList[j] = nodesList[links[i].source];
      }
    }

    for (let k = 0; k < nrOfNodes - 1; k++)
      if (nodesList[k] != nodesList[k + 1]) {
        flagM = false;
        break;
      }

    if (flagM) break;
  }

  return fincapacity;
}
