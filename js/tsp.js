const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };
  permute(inputArr);

  return result;
};

function TSP(links, s) {
  let adjMatrix = Array(NumberOfRealNodes)
    .fill()
    .map(() => Array(NumberOfRealNodes).fill(Number.MAX_SAFE_INTEGER));

  var vertex = [],
    currentPath = [],
    savearr = [];

  for (let i = 0; i < NumberOfRealNodes; i++) {
    if (i != s) vertex.push(i);
  }

  for (let i = 0; i < NumberOfRealLinks; i++) {
    adjMatrix[links[i].source][links[i].target] = links[i].capacity;
    adjMatrix[links[i].target][links[i].source] = links[i].capacity;
  }

  var permutations = permutator(vertex);

  var min_path = Number.MAX_SAFE_INTEGER;

  for (j = 0; j < permutations.length; j++) {
    currentPath = permutations[j];

    var current_pathweight = 0;
    var k = s;

    for (let i = 0; i < currentPath.length; i++) {
      current_pathweight += adjMatrix[k][currentPath[i]];
      k = currentPath[i];
    }

    current_pathweight += adjMatrix[k][s];

    if (min_path >= current_pathweight) {
      min_path = current_pathweight;
      for (let index = 0; index < currentPath.length; index++) {
        savearr[index] = currentPath[index];
      }
    }

    // min_path = Math.min(min_path, current_pathweight);
  }
  savearr.push(s);
  savearr.unshift(s);
  for (let ie = 0; ie < savearr.length - 1; ie++) {
    for (let q = 0; q < links.length; q++) {
      if (
        (links[q].source == savearr[ie] &&
          links[q].target == savearr[ie + 1]) ||
        (links[q].target == savearr[ie] && links[q].source == savearr[ie + 1])
      )
        links[q].flow = 1;
    }
  }
  return min_path;
}
