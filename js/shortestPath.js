function searchLinks(links, start, end, nrOfLinks) {
  for (let i = 0; i < nrOfLinks; i++) {
    if (
      (links[i].source === start && links[i].target === end) ||
      (links[i].source === end && links[i].target === start)
    ) {
      return links[i];
    }
  }
  return { source: -5, target: -5, capacity: -5, flow: -5 };
}

function Dijkstra(links, nodes, s, t) {
  var nrOfNodes = nodes.length;
  var nrOfLinks = links.length;

  //initialization

  const infSum = Number.MAX_SAFE_INTEGER;
  var tempNodeList = [];
  var nodePath = Array(nrOfNodes).fill(-1);

  var source = s[0];
  var target = t[0];

  var currWeight;

  for (let i = 0; i < nrOfNodes; i++) {
    tempNodeList.push({ dist: infSum, state: 0 });
  }

  tempNodeList[source].state = 1;
  tempNodeList[source].dist = 0;

  var notFin = true;
  var minDist = infSum,
    minNode;

  while (notFin) {
    notFin = false;
    minDist = infSum;

    for (let i = 0; i < nrOfNodes; i++) {
      if (tempNodeList[i].state === 1) {
        if (tempNodeList[i].dist < minDist) {
          minDist = tempNodeList[i].dist;
          minNode = i;
          notFin = true;
        }
      }
    }

    if (!notFin) break;

    tempNodeList[minNode].state = 2;

    for (let i = 0; i < nrOfNodes; i++) {
      currWeight = searchLinks(links, i, minNode, nrOfLinks).capacity;

      if (currWeight != -5 && tempNodeList[i].state != 2) {
        if (tempNodeList[i].dist > tempNodeList[minNode].dist + currWeight) {
          tempNodeList[i].dist = tempNodeList[minNode].dist + currWeight;
          nodePath[i] = minNode;
        }
        tempNodeList[i].state = 1;
      }
    }
  }

  nodePath[source] = source;

  var tempNode = target,
    start,
    end;

  while (tempNode != source) {
    start = tempNode;
    end = nodePath[tempNode];
    searchLinks(links, start, end, nrOfLinks).flow = 1;
    tempNode = end;
  }

  return tempNodeList[target].dist;
}
