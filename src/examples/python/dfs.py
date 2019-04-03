# Depth First Search
import networkx as nx

# Generate a random graph
G = nx.fast_gnp_random_graph(10, 0.3, seed=50)
nx.set_node_attributes(G, False, 'seen')

# Render graph
canvas.nodes(G.nodes).add().label().text('')
canvas.edges(G.edges).add()
canvas.pause(1)

# Recursive DFS function
def dfs(n):
    G.node[n]['seen'] = True

    canvas.node(n).highlight().size('1.25x')
    canvas.node(n).color('blue')
    canvas.pause(0.5)

    for n2 in G.neighbors(n):
        if G.node[n2]['seen']:
            continue
        canvas.edge((n, n2)).traverse().color('red').pause(0.5)
        dfs(n2) # DFS on neighbor
        canvas.edge((n2, n)).traverse().color('blue').pause(0.5)
        canvas.node(n).highlight().size('1.25x').pause(0.5)
        
dfs(0)
