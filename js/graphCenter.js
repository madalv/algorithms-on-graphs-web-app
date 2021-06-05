const maxFunction = (array) => {
  let currentMax = -1;
  for (let i = 0; i < array.length; ++i) {
    if (currentMax < array[i]) {
      currentMax = array[i];
    }
  }
  return currentMax;
};

const graphCenter = (links, nodes) => {
  n = nodes.length;
  dMatrix = [];

  let myFunc = (num) => Number(num);

  for (let i = 0; i < n; ++i) {
    let intArr = Array.from(String(i), myFunc);
    dMatrix.push(Dijkstra(links, nodes, intArr, intArr, true).array);
  }

  let maxs = [];

  for (let i = 0; i < n; ++i) {
    let max = maxFunction(dMatrix[i]);
    maxs.push(max);
  }

  let centers = [];
  let currentMin = Infinity;

  for (let i = 0; i < n; ++i) {
    if (maxs[i] <= currentMin) {
      currentMin = maxs[i];
    }
  }

  for (let i = 0; i < n; ++i) {
    if (maxs[i] === currentMin) {
      centers.push(nodes[i].name);
    }
  }

  return centers;
};
