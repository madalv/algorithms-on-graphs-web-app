const graphCenter = (links, nodes) => {
  n = nodes.length;
  dMatrix = []

  let myFunc = num => Number(num);

  for (let i = 0; i < n; ++i) {
    let intArr = Array.from(String(i), myFunc);
    dMatrix.push(Dijkstra(links, nodes, intArr, intArr, true).array)
  }

  let currentMin = Infinity;

  for (let i = 0; i < n; ++i) {
    let sum = dMatrix[i].reduce((a, b) => a + b, 0)
    if (sum < currentMin) {
      currentMin = sum;
    }
  }

  let centers = [];

  for (let i = 0; i < n; ++i) {
    let sum = dMatrix[i].reduce((a, b) => a + b, 0)
    if (sum === currentMin) {
      centers.push(nodes[i].name);
    }
  }

  return centers;
}
