const f = (x, y) => x + y
const z = f(6, 8)
console.log(z)
canvas.nodes([1, 2]).add()
canvas.node(1).click(() => console.log('click'))
canvas.edge([1, 2]).add()
canvas.pause(1)
canvas.edge([1, 2]).traverse().color('red')
