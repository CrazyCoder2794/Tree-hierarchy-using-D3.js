//defining some global variable
var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;
	
var tree = d3.layout.tree()
			 .size([1000,1000]);
//this variable will used to draw links between nodes of tree
var diagonal = d3.svg.diagonal()
					 .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("body").append("svg")
			.attr("width",1500)
			.attr("height",1500)
			.append("g")
				.attr("transform","translate(" + margin.left + "," + margin.top + ")");
				
var i=0,duration=750;

//root is a global variable that will point to starting node of the tree
var root 
d3.json("mydata.json",function(data){
	root = data[0]
})

//readJson() is a method which is reading our Json file and calling updateTree() to draw tree
readJson()

function updateTree(branch)
{
	//nodes will have all the nodes of tree
	var nodes = tree.nodes(root)
	//links form link between each node
	var links = tree.links(nodes);
	
	//this is just to control the depth of the tree
	nodes.forEach(function(d) { d.y = d.depth * 180; });
	
	
	var node = svg.selectAll("g.node")
				 .data(nodes,function(d){return d.id });
	
	//this variable will enter all the nodes on click
	var nodeEnter = node.enter().append("g")
						.attr("class","node")
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
						.on("click",click)
						
						nodeEnter.append("circle")
								 .attr("r",1e-6)
		
						nodeEnter.append("text")
								 .attr("x", 10)
								 .attr("y", -10)
								 .text(function(d) { return d.name; })
								 
	//this variable will update the position of each nodes 			 
	var nodeUpdate = node.transition()
						 .duration(duration)
						 .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

					 nodeUpdate.select("circle")
							   .attr("r", 10)
							   .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

					 nodeUpdate.select("text")
	
	//this will remove nodes on click
	var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.x + "," +d.y+ ")"; })
	  .remove();

				   nodeExit.select("circle")
						   .attr("r", 1e-6);

				   nodeExit.select("text")
						   .style("fill-opacity", 1e-6);

  // Update the links…
	var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
			  .attr("class", "link")
			  .attr("d", function(d) {
	var o = {x: branch.x0, y: branch.y0};
				return diagonal({source: o, target: o});
				});

  // Transition links to their new position.
	link.transition()
		.duration(duration)
		.attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
	link.exit().transition()
		.duration(duration)
		.attr("d", function(d) {
			var o = {x: branch.x, y: branch.y};
			return diagonal({source: o, target: o});
		})
		.remove();
}

function readJson()
{
	
	 d3.json("mydata.json",function(data){
		 updateTree(data[0])
	 })
}

function click(d)
{
	
	if(d.children)
	{
		d._children = d.children
		d.children = null
	}
	else
	{
		d.children = d._children
		d._children = null
		
	}
	(d.id = ++i)

	updateTree(d)
}
