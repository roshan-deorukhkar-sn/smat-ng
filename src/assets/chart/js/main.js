$(document).ready(function(){
	$.ajax({
		url: "./json/ads-comparison.json",
		//url: "./json/line-chart.json",
		//url: "./json/scatter-data.json",
		success: function(response){
			//data = $.parseJSON(response)
			data = response
			$(".chart").smiCharts({
				data: data.rows,
				type:"line",
				complete: function(){
					//console.log("complete") 
				}
			});
		}
	})
});
	
	