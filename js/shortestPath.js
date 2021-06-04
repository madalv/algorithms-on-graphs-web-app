function searchLinks(links, start, end) {
  for (let i = 0; i < NumberOfRealLinks; i++) {
    if (
      (links[i].source === start && links[i].target === end) ||
      (links[i].source === end && links[i].target === start)
    ) {
      return links[i];
    }
  }
  return { source: -5, target: -5, capacity: -5, flow: -5 };
}

function searchLinksDirected(links, start, end) {
  for (let i = 0; i < NumberOfRealLinks; i++) {
    if (links[i].source === start && links[i].target === end) {
      return links[i];
    }
  }
  return { source: -5, target: -5, capacity: -5, flow: -5 };
}

function Dijkstra(links, nodes, s, t, undirected) {
  var nrOfNodes = nodes.length;

  //initialization

  const infSum = Number.MAX_SAFE_INTEGER;
  var nodePath = Array(nrOfNodes).fill(-1);
  var distances = Array(nrOfNodes).fill(infSum);
  var states = Array(nrOfNodes).fill(0);

  var source = s[0];
  var target = t[0];

  var currWeight;

  states[source] = 1;
  distances[source] = 0;

  var notFin = true;
  var minDist = infSum,
    minNode;

  while (notFin) {
    notFin = false;
    minDist = infSum;

    for (let i = 0; i < nrOfNodes; i++) {
      if (states[i] === 1) {
        if (distances[i] < minDist) {
          minDist = distances[i];
          minNode = i;
          notFin = true;
        }
      }
    }

    if (!notFin) break;

    states[minNode] = 2;

    for (let i = 0; i < nrOfNodes; i++) {
      if (undirected) currWeight = searchLinks(links, i, minNode).capacity;
      else currWeight = searchLinksDirected(links, minNode, i).capacity;

      if (currWeight != -5 && states[i] != 2) {
        if (distances[i] > distances[minNode] + currWeight) {
          distances[i] = distances[minNode] + currWeight;
          nodePath[i] = minNode;
        }
        states[i] = 1;
      }
    }
  }

  nodePath[source] = source;

  var tempNode = target,
    start,
    end;

  if (nodePath[target] === -1) return { distance: 0, array: distances };

  while (tempNode != source) {
    start = tempNode;
    end = nodePath[tempNode];

    if (!undirected) {
      // ughhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh kill meeeeeeeeeeeeee
      searchLinksDirected(links, end, start).flow = 1;
    } else {
      let w1 = searchLinksDirected(links, start, end).capacity;
      let w2 = searchLinksDirected(links, end, start).capacity;

      if (w2 === -5) searchLinksDirected(links, start, end).flow = 1;
      else if (w1 === -5) searchLinksDirected(links, end, start).flow = 1;
      else if (w1 < w2) searchLinksDirected(links, start, end).flow = 1;
      else searchLinksDirected(links, end, start).flow = 1;
    }
    tempNode = end;
  }

  return { distance: distances[target], array: distances };
}
