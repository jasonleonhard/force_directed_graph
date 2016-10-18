// force directed graph

// // basic height and width
// var   h = 350,
//       w = 600;

// dynamic sizing by window
// var w = screen.width;
    // h = screen.height;

// advanced height and width
// dynamic sizing by window, ie full screen is one, and 1/4 screen is another size
var w = width();
    h = height();

function width() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
}

function height() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
}

var circleWidth = 1.1,
          links = [];

// colors ease without sass
var palette = {
    "aqua": "aqua",
    "deepskyblue": "#00bfff",
    "lightgray": "#819090",
    "lightergray": "#ddd",
    "gray": "#708284",
    "mediumgray": "#536870",
    "darkgray": "#475B62",
    "darkblue": "#0A2933",
    "purple": "#595AB7",
    "blue": "#2176C7"
}

// first node aka [0] is parent, the rest are children.
// target links the current node to its respective node
var nodes = [
    { name: "Jason Leonhard" }, // 0
    { name: "JasonLeonhard.com", target: [0] },
    { name: "Geminate", target: [0] },
    { name: "Desire-wire", target: [0] },
    { name: "YouTube Speed Slider", target: [0, 1] },
    { name: "Geterdones", target: [0, 1, 6] }, // 5
    { name: "Getrdone", target: [0, 1, 3, 5] },
    { name: "Devise-Cancan", target: [0, 1] },
    { name: "Talkey", target: [0, 1] },
    { name: "Bar Graph", target: [0, 10] },
    { name: "Force Directed Graph", target: [0, 9, 11] }, // 10
    { name: "Pie Graph", target: [0, 9, 10] },
    { name: "Ruby Online", target: [0] },
    { name: "Ionictonic", target: [0] }
];

// WIP load in data from csv
// var nodes = [];
// d3.csv('data.csv', function(data) { // reading in data from data.csv
//   console.log(data);
//   for (key in data) {
//       nodes.push(data[key].value)
//   }

// loop to determine if the target nodes are linked
// by checking array length and pushing the source and target nodes
// building two arrays
for (var i = 0; i < nodes.length; i++) {
    // console.log(nodes[i]);
    if (nodes[i].target !== undefined) {
        // console.log(nodes[i].target);
        for (var x = 0; x < nodes[i].target.length; x++) {
            links.push({
                source: nodes[i],
                target: nodes[nodes[i].target[x]]
            })
        }
    }
}
// console.log(links); // full info

// attach graph
var graph = d3.select('#force_directed_graph')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .gravity(0.25) // 0.3
    .charge(-1100) // -1300
    .size([w, h])

// grab all lines, pass in data, append lines, choose color
var link = graph.selectAll('line')
    .data(links).enter().append('line')
    .attr('stroke', palette.lightergray) // link color

// grab all nodes/circles and pass in data,
// appending, and calling the force animation
var node = graph.selectAll('circle')
    .data(nodes).enter()
    .append('g')
    .call(force.drag);

// set attribultes of circles
node.append('circle')
    .attr('r', circleWidth)
    .attr('cy', function(d) {
        return d.y; })
    .attr('cx', function(d) {
        return d.x; })
    .attr('fill', function(d, i) {
        if (i > 0) {
            return palette.aqua }        // child node color
        else {
            return palette.deepskyblue } // parent node color [0]
    })

// append name to nodes and set attributes
node.append('text')
    .text(function(d) {
        return d.name })
    // .attr('font-family', 'Roboto Slab')
    .attr('font-family', 'Tangerine')
    // .attr('font-family', "Helvetica Neue")
    // .attr('font-family', 'Serif')
    .attr('fill', function(d, i) {
        if (i > 0) {
            return palette.gray }        // child nodes name color
        else {
            return palette.lightergray } // parent node name color [0]
    })
    .attr('x', function(d, i) {
        if (i > 0) {
            return circleWidth + 4 } else { // + 4 adjust x text of child
            return circleWidth - 0 }        // -15
    })
    .attr('y', function(d, i) {
        if (i > 0) {
            return circleWidth + 4 } else {
            return 8 }
    })
    .attr('text-anchor', function(d, i) {
        if (i > 0) {
            return 'beginning' } else {
            return 'end' }
    })
    .attr('font-size', function(d, i) {
        if (i > 0) {
            return '0.8em' } else { // Child node text
            return '1em' }          // Parent node text
    })

// as time/tick passes, set attributes to move to x y position
// set attributes of links,
force.on('tick', function(e) {
    node.attr('transform', function(d, i) {
        return 'translate(' + d.x + ', ' + d.y + ')';
    })
    link
        .attr('x1', function(d) {
            return d.source.x })
        .attr('y1', function(d) {
            return d.source.y })
        .attr('x2', function(d) {
            return d.target.x })
        .attr('y2', function(d) {
            return d.target.y })
})

// use the force!
force.start();
