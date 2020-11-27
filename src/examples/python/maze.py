# Maze Solver

maze = [
    'x....x..',
    '..xx...x',
    'x...xxxx',
    '.xx.x...',
    '......x.',
    'x.xxx.x.',
    'x...x.xx',
    '..x.x..x'
]
maze_width, maze_height = len(maze[0]), len(maze)
maze_path_char = '.'
maze_start, maze_end = (0, maze_height - 1), (maze_width - 1, 0)

def node_pos(coords):
    x = (coords[0] - (maze_width - 1) / 2) * 50
    y = -(coords[1] - (maze_height - 1) / 2) * 50
    return (x, y)

def get_adjacent(coords):
    x, y = coords[0], coords[1]
    adjacent = []

    if x < maze_width - 1 and maze[y][x + 1] == maze_path_char:
        adjacent.append((x + 1, y))
    if x > 0 and maze[y][x - 1] == maze_path_char:
        adjacent.append((x - 1, y))
    if y < maze_height - 1 and maze[y + 1][x] == maze_path_char:
        adjacent.append((x, y + 1))
    if y > 0 and maze[y - 1][x] == maze_path_char:
        adjacent.append((x, y - 1))

    return adjacent

def animate_dfs():
    stack = get_adjacent(maze_start)

    seen = {(x, y): False for x in range(maze_width)
        for y in range(maze_height)}

    canvas.duration(1).pan(node_pos(maze_start)).zoom(2)
    canvas.pause(1)

    prev = maze_start
    cur = None
    seen[prev] = True
    while len(stack) > 0:
        cur = stack[len(stack) - 1]
        seen[cur] = True

        if prev != maze_start:
            canvas.node(prev).color('green').pause(0.3)

        edge = (prev, cur)
        canvas.edge(edge).traverse('green')
        canvas.pan(node_pos(cur))
        canvas.pause(0.3)

        if cur == maze_end:
            break

        adjacent = [n for n in get_adjacent(cur) if not seen[n]]
        while len(adjacent) == 0:
            stack = stack[0:len(stack) - 1]
            prev = stack[len(stack) - 1]

            canvas.node(cur).color('red').pause(0.3)
            canvas.edge((cur, prev)).traverse('red')
            canvas.pan(node_pos(prev))
            canvas.pause(0.3)

            adjacent = [n for n in get_adjacent(prev) if not seen[n]]
            cur = prev

        stack.append(adjacent[0])
        prev = cur

    canvas.pause(0.5)
    canvas.duration(2).pan((0, 0)).zoom(1)

def create_graph():
    node_coords = [(x, y) for x in range(maze_width)
        for y in range(maze_height)]

    canvas.nodes(node_coords).add(
        fixed=True,
        pos=lambda n: node_pos(n),
        labels={0: {'remove': True}}
    )

    canvas.nodes([maze_start, maze_end]).duration(0).color('blue')

    edge_ids = []
    for x, y in node_coords:
        if maze[y][x] == maze_path_char:
            for x2, y2 in get_adjacent((x, y)):
                if x2 >= x and y2 >= y:
                    edge_ids.append(((x, y), (x2, y2)))

    canvas.edges(edge_ids).add()

canvas.pause(0.1)
create_graph()
canvas.pause(1)
animate_dfs()
