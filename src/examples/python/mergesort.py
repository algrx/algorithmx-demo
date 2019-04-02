x = 4
y = 2
print(x + y)
canvas.nodes([1, 2]).add()
canvas.edge((1, 2)).add()
canvas.pause(1)
canvas.edge((1, 2)).traverse().color('red')
