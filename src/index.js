const margin = { top: 0, right: 30, bottom: 20, left: 10 },
  width = 960,
  height = 960;

// ajout du svg à une 'div id="matrice"' déjà créee dans la page html
var svg = d3
  .select("#visu-tp4")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "https://lyondataviz.github.io/teaching/lyon1-m2/2021/data/got_social_graph.json"
).then(function (json) {
  nodes = json.nodes;
  edges = json.links;


  adjancencymatrix = createAdjacencyMatrix(nodes, edges, undefined, true);

  const maxWeigth = Math.max.apply(Math, nodes.map(function(o) { return o.influence; }));

  var scale = d3.scaleQuantize()
	.domain([0, maxWeigth]) // TODO
	.range(d3.schemeBlues[9]); // donné par D3

  var zoneScale = d3.scaleOrdinal(d3.schemeCategory10);



  var positionsPersonnages =
  	d3.range(nodes.length);	// un tableau d'autant d'element que de personnages
  					// [0, 1, ..., 106]
    console.log(nodes)
  var echellexy = d3.scaleBand()
  	.range([0,width]) // TODO correspond [0, largeur du dessin]
  	.domain(positionsPersonnages)
  	.paddingInner(0.1)
  	.align(0)
  	.round(true);



  var labels = d3.select("svg")
    	.append("g")
    	.attr("transform", "translate(60, 50)")
    	.style("font-size", "8px")
    	.style("font-family", "sans-serif");
  var columns = labels
    	.append("g")
    	.selectAll()
    	.data(nodes)
    	.join("text")
      .text((d) => d.character)
      .attr("dy", function (d) {
      		return echellexy(d.id)+5
      	})
    	.attr("transform", "rotate(-90)"); // on tourne tout l'axe de 90°

  var rows = labels
    	.append("g")
    	.selectAll()
    	.data(nodes)
    	.join("text")
      .attr("text-anchor","end")
      .text((d)=> d.character)
      .attr("dy", function (d) {
        return (echellexy(d.id) +5)
      });

  matrixViz = svg.selectAll("rect")
	.data(adjancencymatrix)
	.join("rect")
	.attr("width", 5)
	.attr("height", 5)
	.attr("x", function (d) {
		return  echellexy(d.x)+50
	})
	.attr("y", function (d) {
		return  echellexy(d.y)+50
	})
	.style("stroke", "black")
	.style("stroke-width", ".2px")
	.style("fill", function (d) {
    if(d.zone_s==d.zone_t) {return zoneScale(d.zone_s)}
    else {
      return "#eee"
    }

	}).attr("text-align", "right")
  .attr("opacity", (d)=> (d.weight*10)/100);


  function update (newPositions) {
  	echellexy.domain(newPositions) // ici on met à jour la fonction de calcul des positions qui nous permettra de repositionner.

    console.log(newPositions)
    console.log(nodes)

  	rows
    .transition()
    .delay(100)
    .duration(500)
  		.attr("dy", function (d) {
        return echellexy(d.id)+5
      });

  	columns
    .transition()
    .delay(100)
    .duration(500)
  		.attr("dy", function (d) {
      		return  echellexy(d.id)+5
      	});

  	matrixViz
    .transition()
    .delay(100)
    .duration(500)
    .attr("x", function (d) {
    		return  echellexy(d.x) +50
    	})
    	.attr("y", function (d) {
    		return  echellexy(d.y) +50
    	})
}

  d3.select('#mode-select').on('change', function() {
    if(this.value == "zones"){
      nodes.sort((a, b) => {
        return a.zone - b.zone;
      });
    }else
    if (this.value == "appearances") {
      nodes.sort((a, b) => {
        return a.id - b.id;
      });
    }else
    if (this.value == "influences") {
      nodes.sort((a, b) => {
        return b.influence - a.influence ;
      });
    }
    var position = [];
    for (i in nodes){
      position[i] = nodes[i].id
    }
    update(position)
  });



});
