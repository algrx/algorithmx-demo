// Merge Sort

const unsorted = [7, 3, 2, 6, 8, 5, 1, 4];

const nodeStyle = {
    shape: 'rect',
    size: [30, 15],
    fixed: true,
};

function nodePos(i, level) {
    const x = (i - (unsorted.length - 1) / 2) * 80;
    const y = -(level - Math.ceil(Math.log2(unsorted.length)) / 2) * 120;
    return [x, y];
}
function nodeId(i, level) {
    return String(i) + '_' + String(level);
}

function animateMergeEdge(nodePrev, nodeCur, number, color) {
    const edge = [nodePrev, nodeCur];

    canvas.node(nodePrev).color(color);
    canvas.edge(edge).add().directed(true);
    canvas.pause(0.5);

    canvas.edge(edge).traverse().duration(0.8).color(color).pause(0.2);
    canvas.node(nodeCur).label().text(number).visible(true);
    canvas.pause(0.5);
}

function animateMerge(left, right, index, level) {
    const totalLen = left.length + right.length;
    const prevIds = Array(totalLen)
        .fill(0)
        .map((_, i) => nodeId(index + i, level - 1));
    const curIds = Array(totalLen)
        .fill(0)
        .map((_, i) => nodeId(index + i, level));

    canvas
        .nodes(curIds)
        .add()
        .set(nodeStyle)
        .pos((n, i) => nodePos(index + i, level))
        .label()
        .visible(false);

    canvas
        .edges(
            Array(totalLen - 1)
                .fill(0)
                .map((_, i) => [curIds[i], curIds[i + 1]])
        )
        .add();

    canvas.pause(0.8);

    let li = 0;
    let ri = 0;
    let result = [];
    for (let i = 0; i < totalLen; i++) {
        if (ri === right.length || (li < left.length && left[li] < right[ri])) {
            result.push(left[li]);
            animateMergeEdge(prevIds[li], curIds[i], left[li], 'green');
            li += 1;
        } else {
            result.push(right[ri]);
            animateMergeEdge(prevIds[left.length + ri], curIds[i], right[ri], 'red');
            ri += 1;
        }
    }
    return result;
}

function mergeSort(array, index = 0, level = null) {
    level = level === null ? Math.ceil(Math.log2(array.length)) : level;

    if (array.length == 1) {
        if (level !== 0) animateMerge(array, [], index, level);
        return array;
    }
    const splitIndex = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, splitIndex), index, level - 1);
    const right = mergeSort(array.slice(splitIndex), index + splitIndex, level - 1);

    return animateMerge(left, right, index, level);
}

canvas.pause(0.1);
const topIds = Array(unsorted.length)
    .fill(0)
    .map((_, i) => nodeId(i, 0));
canvas
    .nodes(topIds)
    .add()
    .set(nodeStyle)
    .pos((n, i) => nodePos(i, 0))
    .data(unsorted)
    .label()
    .text((n) => n);

canvas.pause(1);
mergeSort(unsorted);
