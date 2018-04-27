(function ( $ ) {
 
    $.fn.smiCharts = function(options) {
	    var defaults = {
	        colorTheme: ["#8BA9D0", "#6A90C1", "#066CA9", "#004B8C"],
	        ticks: 5,
	        url: "",
	        data: [],
	        type: "scatter" // scatter, line, multiline
	    };
	 
	    var settings = $.extend( {}, defaults, options );
	 	
	    return this.each(function() {
	    	ele = this
	        
	        switch (settings.type) {
			    case "scatter":
			        renderScatter(settings.data,ele)
			        break;
			    case "line":
			        renderLine(settings.data,ele)
			        break;
			}

	        
	        //callback complete()
	        if ( $.isFunction( settings.complete ) ) {
		        settings.complete.call(this, ele );
		    }
	    });
    };
		
    function renderScatter(data,ele) {
		var outerWidth = 700;
		var outerHeight = 380;
		var margin = { left: 80, top: 35, right: 100, bottom: 60 };
		console.log(data[0].conditionalProperties[0].name)
		var xColumn = data[0].conditionalProperties[0].name; //"System Pressure";
		var yColumn = data[0].property.name;
		var colorColumn = yColumn;
		var lineColumn = colorColumn;

		var xAxisLabelText = xColumn;
		var xAxisLabelOffset = 48;

		var yAxisLabelText = yColumn;
		var yAxisLabelOffset = 60;

		var innerWidth  = outerWidth  - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top  - margin.bottom;

		var svg = d3.select(ele).append("svg")
					.attr("width", outerWidth)
					.attr("height", outerHeight);

		var legendGroup =  svg.append("g")
							.attr("width", innerWidth);

		var g =  svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var xAxisG =   g.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + innerHeight + ")")

		var xAxisLabel =  xAxisG.append("text")
								.style("text-anchor", "middle")
								.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
								.attr("class", "label")
								.text(xAxisLabelText);

		var yAxisG =   g.append("g")
						.attr("class", "y axis");

		var yAxisLabel =  yAxisG.append("text")
								.style("text-anchor", "middle")
								.attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
								.attr("class", "label")
								.text(yAxisLabelText);

		var xScale = d3.scaleLinear().range([0, innerWidth]);
		var yScale = d3.scaleLinear().range([innerHeight, 0]);
		

		var xAxis = d3.axisBottom(xScale)
										.tickSize(0-innerHeight)
										.tickPadding(8)
										.ticks(5);

		var yAxis = d3.axisLeft(yScale)
									.tickSize(0-innerWidth)
									.tickPadding(8)
									.ticks(5);

		var line =	  d3.line()
							.x(function(d) { return xScale(d[xColumn]); })
							.y(function(d) { return yScale(d[yColumn]); });

    	var dataHeaders =[] 
		dataHeaders.push(data[0].property.name, data[0].conditionalProperties[0].name , "substance","unit")
		
		tempArr = []
		
		$.each(data, function(key, value) {
			abc = {}
			if(!tempArr[key]) {
				tempArr[key] = []
			}	
			
			primaryValue = value.property.value
			temperatureValue = conditionalPropertyValue = unit = null

			$.each(value.conditionalProperties, function(i, v){
				if(dataHeaders[1] == v.name) {
					conditionalPropertyValue = v.value
				}
			})

			abc[dataHeaders[1]] = parseFloat(conditionalPropertyValue);
			abc[dataHeaders[0]] = parseFloat(primaryValue);	
			abc[dataHeaders[2]] = value.substance;
			abc[dataHeaders[3]] = unit;	
			tempArr[key] = abc		 
		});
		

		colorArray = ["#7dc215", "#f5a623"]
		//console.log(xAxisG, xScale.domain(d3.extent(tempArr, function (d){  return d[xColumn]; })))

        xScale.domain(d3.extent(tempArr, function (d){  return d[xColumn]; }));
        yScale.domain([0, d3.max(tempArr, function (d){ return d[yColumn]; })]);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        var nested = d3.nest()
          .key(function (d){ return d.substance; })
          .key(function (d){ return d[lineColumn] + d["unit"]; })
          .entries(tempArr);

        g.selectAll("circle")
		  .data(tempArr)
		  .enter()
		  .append("circle")
		  .attr("cx", function(d) {
			  console.log(d[xColumn])
		    return xScale(d[xColumn]);
		  })
		  .attr("cy", function(d) {
			console.log(d[xColumn])
		    return yScale(d[yColumn]);
		  })
		  .attr("r", 3)
		  .attr("fill", "#00aa88");
	}
	
	/* let graphArray = {
		colorColumn : "Ssytem temerature",
		xColumn: "conditional property name",
		yColumn: "primaryProperty name",
		legendCoulmn: "other conditional propertyname(temperature)"
	} */

	function renderLine(data, ele){
		
		var outerWidth = 700;
		var outerHeight = 380;
		var margin = { left: 80, top: 35, right: 100, bottom: 60 };

		var colorColumn = "System Temperature";

		var xColumn = data[0].conditionalProperties[1].name;
		var yColumn = data[0].property.name;

		var lineColumn = colorColumn;

		var xAxisLabelText = xColumn;
		var xAxisLabelOffset = 48;

		var yAxisLabelText = yColumn;
		var yAxisLabelOffset = 60;

		var innerWidth  = outerWidth  - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top  - margin.bottom;

		var svg = d3.select(ele).append("svg")
					.attr("width", outerWidth)
					.attr("height", outerHeight);

		var legendGroup =  svg.append("g")
							.attr("width", innerWidth);

		var g =  svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var xAxisG =   g.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + innerHeight + ")")

		var xAxisLabel =  xAxisG.append("text")
								.style("text-anchor", "middle")
								.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
								.attr("class", "label")
								.text(xAxisLabelText);

		var yAxisG =   g.append("g")
						.attr("class", "y axis");

		var yAxisLabel =  yAxisG.append("text")
								.style("text-anchor", "middle")
								.attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
								.attr("class", "label")
								.text(yAxisLabelText);

		var xScale = d3.scaleLinear().range([0, innerWidth]);
		var yScale = d3.scaleLinear().range([innerHeight, 0]);
		

		var xAxis = d3.axisBottom(xScale)
										.tickSize(0-innerHeight)
										.tickPadding(8)
										.ticks(5);

		var yAxis = d3.axisLeft(yScale)
									.tickSize(0-innerWidth)
									.tickPadding(8)
									.ticks(5);

		var line =	  d3.line()
							.x(function(d) { return xScale(d[xColumn]); })
							.y(function(d) { return yScale(d[yColumn]); });
		var dataHeaders =[] 
		dataHeaders.push("System Temperature", data[0].conditionalProperties[1].name ,  data[0].property.name, "substance","unit")
		
		tempArr = []
		
		$.each(data, function(key, value) {
			abc = {}
			if(!tempArr[key]) {
				tempArr[key] = []
			}	
			
			primaryValue = value.property.value
			temperatureValue = conditionalPropertyValue = unit = null

			$.each(value.conditionalProperties, function(i, v){
				if(dataHeaders[1] == v.name) {
					conditionalPropertyValue = v.value
				}
				if(dataHeaders[0] == v.name) {
					temperatureValue = v.value
					unit = v.unit.symbol
				}
			})

			abc[dataHeaders[0]] = parseFloat(temperatureValue);
			abc[dataHeaders[1]] = parseFloat(conditionalPropertyValue);
			abc[dataHeaders[2]] = parseFloat(primaryValue);	
			abc[dataHeaders[3]] = value.substance;	
			abc[dataHeaders[4]] = unit;	
			tempArr[key] = abc		 
		});

		console.log(tempArr)

		colorArray = ["#7dc215", "#f5a623"]
		//console.log(xAxisG, xScale.domain(d3.extent(tempArr, function (d){  return d[xColumn]; })))

        xScale.domain(d3.extent(tempArr, function (d){  return d[xColumn]; }));
        yScale.domain([0, d3.max(tempArr, function (d){ return d[yColumn]; })]);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        var nested = d3.nest()
          .key(function (d){ return d.substance; })
          .key(function (d){ return d[lineColumn] + d["unit"]; }).sortValues(function(a, b) { return a['System Pressure'] - b['System Pressure']})
		  .entries(tempArr);
		  
		  console.log(nested)
            
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
			      .style("stroke", colorArray[k]);

			  chartLines.append("text")
			      .datum(function(d) { return {name: d.key , value: d.values[d.values.length - 1]}; })
			      .attr("transform", function(d) { return "translate(" + xScale(d.value["System Pressure"]) + "," + yScale(d.value["Adsorption"]) + ")"; })
			      .attr("x", 5)
			      .attr("dy", ".35em")
			      .style("fill", colorArray[k])
			      .text(function(d) { return d.name; });

			  // add circles
			chartLines.selectAll('circle')
				.data(function (d) { return d.values; })
				.enter().append('circle')
				.attr('cx', function (d) { return xScale(d["System Pressure"]); })
				.attr('cy', function (d) { return yScale(d["Adsorption"]); })
				.style("fill", colorArray[k])
				.attr('r', 3)
				.on("click", function (d) {                                  
		      		console.log(d, this)
		        }) 			
        })
			

		legend = legendGroup.selectAll('.legend')
    				.data(nested)
    				.enter()
			        .append('g')
			        .attr('class', 'legend');

		legend.append('circle')
	        .attr('cx', 10)
	        .attr('cy', 20)
	        .attr('r', 4)
	        .style('fill', function(d, i){  return colorArray[i]; });
	        	        	
		//add the legend text
	    legend.append('text')
	        .text(function(d, i){ return d.key; })
	        .call(wrap, 2);

	    legend.call(resetLegends)
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

