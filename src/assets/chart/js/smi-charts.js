(function ( $ ) {
 
    $.fn.smiCharts = function(options) {
	    var defaults = {
	        colorTheme: ["#8BA9D0", "#6A90C1", "#066CA9", "#004B8C"],
	        ticks: 5,
	        url: "",
			data: [],
			chartData: [],
			scale: [],
			xAxis: "System Pressure",
			yAxis: "Adsorption",
			lineAxis: "System Temperature",
	        type: "scatter" // scatter, line, multiline
		};
		
		var defaultValues = {
			data : {

			}
		}
		plugin = this
	    var settings = $.extend( {}, defaults, options );
	 	
	    return this.each(function() {
	    	ele = this
	        
	        switch (settings.type) {
			    case "scatter":
			        renderScatter(settings.data,ele)
			        break;
			    case "line":
			        renderLine(settings.data, settings.chartData, ele, plugin, settings)
			        break;
			}

	        
	        //callback complete()
	        if ( $.isFunction( settings.complete, plugin ) ) {
		        settings.complete.call(this, plugin );
		    }
	    });
    };
	
	/* getOuterWidth = function() {
		return 700
	}
	getOuterHeight = function(data) {
		return 390
	}

	getInnerWidth = function() {
		return 700 - left - right
	}
	getInnerHeight = function(data) {
		return 390 - top - bottom
	}

	getAroundMargins = function(data) {
		return { left: 80, top: 35, right: 100, bottom: 60 }
	}
	getLegendAxis = function(data) {
		return "System Temperature";
	}
	getXAxisData = function(data) {
		return { "name" : data.conditionalProperties[1].name, "label" : data.conditionalProperties[1].name, "offset" : 48 }
	}
	getYAxisData = function(data) {
		return { "name" : data.property.name, "label" : data.property.name, "offset" : 60 }
	}

	createSVGElement = function(ele, outerWidth, outerHeight) {
		return d3.select(ele).append("svg")
					.attr("width", outerWidth)
					.attr("height", outerHeight);
	}

	createLegendGroup = function(svg, innerWidth) {
		return svg.append("g")
							.attr("width", innerWidth);
	}

	createGroupElement = function() {
		return svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}

	createXAxisGroup = function() {
		return g.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + innerHeight + ")")
	}

	createXAxisLabel = function() {
		return xAxisG.append("text")
					.style("text-anchor", "middle")
					.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
					.attr("class", "label")
					.text(xAxisLabelText);
	}

	createYAxisGroup = function() {
		g.append("g")
			.attr("class", "y axis");
	}

	createYAxisLabel = function() {
		return yAxisG.append("text")
					.style("text-anchor", "middle")
					.attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
					.attr("class", "label")
					.text(yAxisLabelText);
	}

	getXScale = function() {
		d3.scaleLinear().range([0, innerWidth]);
	}

	getYScale = function() {
		d3.scaleLinear().range([innerHeight, 0]);
	}

	createXAxis = function() {
		d3.axisBottom(xScale)
			.tickSize(0-innerHeight)
			.tickPadding(8)
			.ticks(5);
	}

	createYAxis = function() {
		d3.axisLeft(yScale)
			.tickSize(0-innerWidth)
			.tickPadding(8)
			.ticks(5);
	}

	drawIsoTherms = function() {
		var line =	  d3.line()
							.x(function(d) { return xScale(d[xColumn]); })
							.y(function(d) { return yScale(d[yColumn]); });
	} */

	function renderLine(data, chartData, ele, plugin, settings){
		var outerWidth = 700;
		var outerHeight = 500;
		var margin = { left: 80, top: 35, right: 100, bottom: 120 };

		var xAxisLabelText = settings.xAxis;
		var xAxisLabelOffset = 48;

		var yAxisLabelText = settings.yAxis;
		var yAxisLabelOffset = 60;

		var innerWidth  = outerWidth  - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top  - margin.bottom;

		$(ele).empty()

		var svg = d3.select(ele).append("svg")
					.attr("width", outerWidth)
					.attr("height", outerHeight);

		var legendGroup =  svg.append("g")
							.attr('class', 'legend-group')
							.attr("width", innerWidth);

		
		
		var nested = d3.nest()
			.key(function (d){ return d.substance; })
			.key(function (d){ return d[settings.lineAxis] + d["unit"]; }).sortValues(function(a, b) { return a[settings.xAxis] - b[settings.xAxis]})
			.entries(chartData);

		legend = legendGroup.selectAll('.legend')
			.data(nested)
			.enter()
			.append('g')
			.attr('class', 'legend');

		legend.append('circle')
	        .attr('cx', 10)
	        .attr('cy', function (d,i) { return 25 * (i+1)  })
	        .attr('r', 4)
			.style('fill', function(d, i){ return settings.colorTheme[i]; });
			
		

		//d3.select(legendGroup).nodes()[0].getBBox()
		//add the legend text
	    legend.append('text')
			.text(function(d, i){ return d.key; })
			.attr("x", 20)
			.attr("y" , function (d,i) { return 25 * (i+1)  })
			.attr("dy", "0.35em")
			//.call(wrap, 2);
			
		var g =  svg.append("g")
					.attr("class","chart-area")
					.attr("transform", "translate(" + margin.left + "," + (Number(margin.top) + Number($('.legend-group').get(0).getBBox().height)) + ")");
	    //legend.call(resetLegends)

		var xAxisG =   g.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + innerHeight + ")")

		var xAxisLabel =  xAxisG.append("text")
								.style("text-anchor", "middle")
								.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
								.attr("class", "label")
								.attr("fill", "#000")
								.text(xAxisLabelText);

		var yAxisG =   g.append("g")
						.attr("class", "y axis");

		var yAxisLabel =  yAxisG.append("text")
								.style("text-anchor", "middle")
								.attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
								.attr("class", "label")
								.attr("fill", "#000")
								.text(yAxisLabelText);

		//var xScale = d3.scaleLinear().range([0, innerWidth]).nice();
		//var yScale = d3.scaleLinear().range([innerHeight, 0]).nice();

		var xScale = d3.scaleLinear()
		               .domain(d3.extent(chartData, function (d){  return d[settings.xAxis]; }))
		               .range([0, innerWidth])
		               .nice();

		var yScale = d3.scaleLinear()
		               .domain([0, d3.max(chartData, function (d){ return d[settings.yAxis]; })])
		               .range([innerHeight, 0])
					   .nice();
					   
		plugin.scale = [xScale, yScale]
		
		

		var line =	  d3.line()
							.x(function(d) { return xScale(d[settings.xAxis]); })
							.y(function(d) { return yScale(d[settings.yAxis]); });
							var xAxis = d3.axisBottom(xScale)
							.tickSize(0-innerHeight)
							.tickPadding(8)
							.ticks(5);
			
		
			var yAxis = d3.axisLeft(yScale)
							.tickSize(0-innerWidth)
							.tickPadding(8)
							.ticks(5);
        //xScale.domain(d3.extent(chartData, function (d){  return d[settings.xAxis]; }));
        //yScale.domain([0, d3.max(chartData, function (d){ return d[settings.yAxis]; })]);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        
            
        $.each(nested, function(k, v){
	        var chartLines = g.selectAll(".chart-lines" + k)
			      	.data(v.values)
			    	.enter().append("g")
			      	.attr("class", "chartlines")
			      	.style("stroke-width",'2px')
			      	.on("mouseover", function (d) {                                  
						d3.select(this)
						.style("stroke-width",'3px')
						.style("font-weight",700)
						.selectAll('circle') 
							.attr('r', 4)

		          	})
					.on("mouseout",	function(d) {        //undo everything on the mouseout
						d3.select(this)
						.style("stroke-width",'2px')
						.style("font-weight",400)
						.selectAll('circle') 
							.attr('r', 3);

					});

			  chartLines.append("path")
			      .attr("class", "line")
			      .attr("d", function(d) { return line(d.values); })
			      .style("stroke", settings.colorTheme[k]);

			  chartLines.append("text")
			      .datum(function(d) { return {name: d.key , value: d.values[d.values.length - 1]}; })
			      .attr("transform", function(d) { return "translate(" + xScale(d.value[settings.xAxis]) + "," + yScale(d.value[settings.yAxis]) + ")"; })
			      .attr("x", 5)
			      .attr("dy", ".35em")
			      .style("fill", settings.colorTheme[k])
			      .text(function(d) { return d.name; });

			  // add circles
			chartLines.selectAll('circle')
				.data(function (d) { return d.values; })
				.enter().append('circle')
				.attr('cx', function (d) { return xScale(d[settings.xAxis]); })
				.attr('cy', function (d) { return yScale(d[settings.yAxis]); })
				.style("fill", settings.colorTheme[k])
				.attr('r', 3)
				.on("click", function (d) {                                  
		      		console.log(d, this)
		        }) 			
		})
		
		
      }

    function wrap(text, column) {
		legendWidth = outerWidth/column;
		x =20,
		legendIndex = 0;
		lineHeight = 1.2;
		limit = Math.ceil(text.size()/ column)
		  
		text.each(function(v, k) {
			var text = d3.select(this),
		    	previousN = d3.select(this.previousSibling),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 1;
			var dy = parseFloat(text.attr("dy")) || lineHeight;

		    if (k > 0) {
		    	if(!previousN.attr("y")) {
		        y = lineHeight;
		      } else {
		         y = parseInt(previousN.attr("y")) + previousN.node().getBoundingClientRect().height
		      }
		    } else {
		    	y = lineHeight;
		    }
			    
		    if(k%limit == 0) {
		      x = legendIndex * legendWidth
		      y = lineHeight;
		      legendIndex ++ 
		    }
			    
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > legendWidth) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", (lineNumber * lineHeight + dy) + "em").text(word);
	        		lineNumber ++ 
				}
			}
		    text.attr('x', x)
		    text.attr("y", y + 10)
		});
	}

	function resetLegends(legends) {		
		legends.each(function(values, keys) {
			//console.log(legend.select("circle"))
		});
	}
}( jQuery ));

