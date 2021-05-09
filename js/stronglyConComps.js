let components = [];

// simple dfs that pushes nodes into a stack when there's nowhere left to go
function dfs_init(i, visited, stack, adjList) {
  visited[i] = true;

  for (let j = 0; j < adjList[i].length; j++) {
    if (!visited[adjList[i][j]])
      dfs_init(adjList[i][j], visited, stack, adjList);
  }

  stack.push(i);
}

// classic dfs, only pushed nodes into components array
function dfs_scc(i, visited, revAdjList) {
  visited[i] = true;

  components[components.length - 1].push(i);

  for (let j = 0; j < revAdjList[i].length; j++) {
    if (!visited[revAdjList[i][j]])
      dfs_scc(revAdjList[i][j], visited, revAdjList);
  }
}

// searches through links
function searchLinksDIRECTED(links, start, end) {
  for (let i = 0; i < NumberOfRealLinks; i++) {
    if (links[i].source === start && links[i].target === end) return links[i];
  }

  return { source: -5, target: -5, capacity: -5, flow: -5 };
}

// Kosaraju algo for finding SCCs
function kosaraju(links) {
  (components = []), (adjList = []), (revAdjList = []); // array of arrays containing nodes, adj lists

  for (let i = 0; i < NumberOfRealNodes; i++) {
    // make adj lists 2d
    adjList.push([]);
    revAdjList.push([]);
  }

  let visited = Array(NumberOfRealNodes).fill(false); // array to keep track of visited nodes
  let stack = []; // stack

  createAdjLists(links, false, true, adjList, revAdjList); // creating adj lists

  for (let i = 0; i < NumberOfRealNodes; i++) {
    // see dfs_init()
    if (!visited[i]) dfs_init(i, visited, stack, adjList);
  }

  for (let i = 0; i < NumberOfRealNodes; i++) visited[i] = false; // resetting bool array to use 2nd dfs

  while (stack.length) {
    // while stack isn't empty, pop top of stack and perform dfs. for every dfs performed, there is a SCC
    let curentNode = stack[stack.length - 1];
    stack.pop();

    if (!visited[curentNode]) {
      components.push([]); // push array into components for every SCC
      dfs_scc(curentNode, visited, revAdjList);
    }
  }

  for (
    let i = 0;
    i < components.length;
    i++ // set node group & link flow to color them later. see index.js D3 part
  )
    for (let j = 0; j < components[i].length; j++) {
      let tempNode = components[i][j];

      nodes[tempNode].group = i + 1;

      for (let k = 0; k < components[i].length; k++)
        searchLinksDIRECTED(links, components[i][j], components[i][k]).flow =
          i + 1;
    }
}

/* A little bit about the algorithm:
    So how it works is kinda simple:
    1. perform a dfs, pushing nodes into a stack when there is nowhere else to go from them -- aka when you come back from the recursion
    2. reverse the graph (here I've ommited this step cause I create reverse adj lists with the normal one)
    3. while stack isn't empty, pop top element and perform a dfs on it if it isn't visited. 
    each time the dfs is performed, there will be +1 SCC and the nodes visited are part of that SCC.
    
    Why does this work?
    A simple principle -- if there is a SCC, it will remain an SCC even in a reversed graph (all nodes are reachable anyway)
    Then, when you reverse a graph, SCCs remain SCCs, while the links connecting them get reversed(meaning you can't go from SCC to SCC anymore),
    so you have to manually "jump" from SCC to SCC. 
    every time you jump, consider previous nodes as part of an SCC. "Jumping" is done using the stack.*/
