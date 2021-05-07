// Adds an edge s -> t to the list of edges or changes the capacity of existing edge
function addLink(links, s, t, c) {
    for (let i = 0; i < links.length; i++) {
        if (links[i].source === s && links[i].target === t) {
            links[i].capacity = c;
            return;
        }
    }
    links.push({ source: s, target: t, capacity: c, flow: 0 });
}

// Returns the capacity of an edge s -> t from a list of edges
function getCapacity(links, s, t) {
    for (let i = 0; i < links.length; i++) {
        if (links[i].source === s && links[i].target === t) {
            return links[i].capacity;
        }
    }
    return 0;
}

// Breadth-first search
function bfs(links, nodes, s, t, parent) {
    let visited = new Array(nodes.length).fill(0);
    let queue = [];
    queue.push(s);
    visited[s] = 1;
    parent[s] = -1;

    while (queue.length != 0) {
        let u = queue[0];
        for (let i = 0; i < links.length; i++) {
            if (
                links[i].source === u &&
                visited[links[i].target] === 0 &&
                links[i].capacity > 0
            ) {
                queue.push(links[i].target);
                parent[links[i].target] = u;
                visited[links[i].target] = 1;
            }
        }
        queue.shift();
    }
    return visited[t] === 1;
}

// Ford–Fulkerson algorithm
function ford(links, nodes, s, t) {
    // Residual Graph
    let rLinks = JSON.parse(JSON.stringify(links));

    let parent = [];
    let maxFlow = 0;
    let v, u;

    while (bfs(rLinks, nodes, s, t, parent)) {
        let flow = Number.MAX_SAFE_INTEGER;

        for (v = t; v != s; v = parent[v]) {
            u = parent[v];
            flow = Math.min(flow, getCapacity(rLinks, u, v));
        }

        for (v = t; v != s; v = parent[v]) {
            u = parent[v];
            addLink(rLinks, u, v, getCapacity(rLinks, u, v) - flow);
            addLink(rLinks, v, u, getCapacity(rLinks, v, u) + flow);
        }

        maxFlow = maxFlow + flow;
    }

    // Adding the flow in the main graph
    for (let i = 0; i < links.length; i++) {
        links[i].flow = links[i].capacity - rLinks[i].capacity;
    }

    return maxFlow;
}

const INF = 900719925474099;

// Implementation of Ford–Fulkerson algorithm for multiple source and target nodes
function multiFord(links, nodes, s, t) {
    nodes.push({ name: "fakeS" });
    nodes.push({ name: "fakeT" });
    let fakeS = nodes.length - 2;
    let fakeT = nodes.length - 1;

    for (let i = 0; i < s.length; i++) {
        links.push({
            source: fakeS,
            target: s[i],
            capacity: INF,
            flow: 0,
        });
    }

    for (let i = 0; i < t.length; i++) {
        links.push({
            source: t[i],
            target: fakeT,
            capacity: INF,
            flow: 0,
        });
    }

    let maxFlow = ford(links, nodes, fakeS, fakeT);

    return maxFlow;
}