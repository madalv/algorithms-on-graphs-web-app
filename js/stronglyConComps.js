let components = [];

function createAdjLists(links, undirected, reverse, adjList, revAdjList) {
    for (let i = 0; i < NumberOfRealLinks; i++) {
        u = links[i].source;
        v = links[i].target;

        adjList[u].push(v);
        if (undirected)
            adjList[v].push(u);

        if (reverse)
            revAdjList[v].push(u);
    }
}

function dfs_init(i, visited, stack, adjList) {
    visited[i] = true;

    for (let j = 0; j < adjList[i].length; j++) {
        if (!visited[adjList[i][j]]) dfs_init(adjList[i][j], visited, stack, adjList);
    }

    stack.push(i);
}

function dfs_scc(i, visited, revAdjList) {
    visited[i] = true;

    components[components.length - 1].push(i);

    for (let j = 0; j < revAdjList[i].length; j++) {
        if (!visited[revAdjList[i][j]])
            dfs_scc(revAdjList[i][j], visited, revAdjList);
    }

}

function searchLinksDIRECTED(links, start, end) {
    for (let i = 0; i < NumberOfRealLinks; i++) {
        if (links[i].source === start && links[i].target === end) return links[i];
    }

    return { source: -5, target: -5, capacity: -5, flow: -5 };
}

function kosaraju(links) {
    let adjList = [],
        revAdjList = [];

    components = [];


    for (let i = 0; i < NumberOfRealNodes; i++) {
        adjList.push([]);
        revAdjList.push([]);
    }

    let visited = Array(NumberOfRealNodes).fill(false);
    let stack = [];

    createAdjLists(links, false, true, adjList, revAdjList);

    for (let i = 0; i < NumberOfRealNodes; i++) {
        if (!visited[i])
            dfs_init(i, visited, stack, adjList);
    }

    for (let i = 0; i < NumberOfRealNodes; i++)
        visited[i] = false;

    while (stack.length) {
        let curentNode = stack[stack.length - 1];
        stack.pop();

        if (!visited[curentNode]) {
            components.push([]);
            dfs_scc(curentNode, visited, revAdjList);
        }
    }

    for (let i = 0; i < components.length; i++)
        for (let j = 0; j < components[i].length; j++) {
            let tempNode = components[i][j];

            nodes[tempNode].group = i + 1;

            for (let k = 0; k < components[i].length; k++)
                searchLinksDIRECTED(links, components[i][j], components[i][k]).flow = i + 1;
        }

}