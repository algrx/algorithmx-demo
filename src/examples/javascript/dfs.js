// Depth First Search

// Generate a random graph
Math.seed(28);
const G = jsnx.fastGnpRandomGraph(10, 0.3);
for (let n of G) G.node[n] = { seen: false };

// Render graph
canvas.nodes(G.nodes()).add().label().text('');
canvas.edges(G.edges()).add();
canvas.pause(1);

// Recursive DFS function
function dfs(n) {
    G.node[n].seen = true;

    canvas.node(n).highlight().size('1.25x');
    canvas.node(n).color('blue');
    canvas.pause(0.5);

    for (let n2 of G.neighbors(n)) {
        if (G.node[n2].seen) continue;
        canvas.edge([n, n2]).traverse().color('red').pause(0.5);
        dfs(n2); // DFS on neighbor
        canvas.edge([n2, n]).traverse().color('blue').pause(0.5);
        canvas.node(n).highlight().size('1.25x').pause(0.5);
    }
}

dfs(0);
