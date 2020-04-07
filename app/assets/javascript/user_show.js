
document.getElementById("selectButton_syear").disabled = true;

var publishing_breakdown = JSON.parse(gon.publishing_breakdown);
var publishing_breakdown_ce = JSON.parse(gon.publishing_breakdown_ce);

var seasonal_breakdown = JSON.parse(gon.seasonal, function(key, value){
	if (key == "date_finished")
		return new Date(value);
	else
		return value;
	});
var seasonal_breakdown_year = JSON.parse(gon.seasonal_year, function(key, value){
	if (key == "date_finished")
		return new Date(value);
	else
		return value;
	});
var taste = JSON.parse(gon.taste, function(key, value){
	if (key == "date_finished")
		return new Date(value);
	else
		return value;
	});

taste_nested = d3.nest()
	.key(function(d) { return d.shelf; })
	.entries(taste);

//Most Read Authors
var most_author_row = document.getElementsByClassName("most-read-authors");
var most_author_max = most_author_row[0].innerText;


var x_most_author = d3.scaleLinear()
    .domain([0, most_author_max]) //return max pages
    .range([ 0, 450]);

var i;
for (i = 0; i < most_author_row.length; i++) {
  most_author_row[i].style.backgroundColor = "gray";
  var width = x_most_author(most_author_row[i].innerText);
  most_author_row[i].style.width = width + "px";
  if (i ==0){
  	var first_row = document.getElementsByClassName("bar-value most-author")[0];
  	first_row.innerText  = first_row.innerText+ " times read";
  }
} 

//Most Read
var most_read_row = document.getElementsByClassName("most-read-books");
var most_read_max = most_read_row[0].innerText;


var x_most_read = d3.scaleLinear()
    .domain([0, most_read_max]) 
    .range([ 0, 450]);

var i;
for (i = 0; i < most_read_row.length; i++) {
  most_read_row[i].style.backgroundColor = "gray";
  var width = x_most_read(most_read_row[i].innerText);
  most_read_row[i].style.width = width + "px";
  if (i ==0){
  	var first_row = document.getElementsByClassName("bar-value most-read")[0];
  	first_row.innerText  = first_row.innerText+ " times read";
  }
} 

//Longest Read
var longest_books_row = document.getElementsByClassName("longest-books-bar");
var longest_read_max = longest_books_row[0].innerText;
var x = d3.scaleLinear()
    .domain([0, longest_read_max]) //return max pages
    .range([ 0, 500]);

var i;
for (i = 0; i < longest_books_row.length; i++) {
  longest_books_row[i].style.backgroundColor = "gray";
  var width = x(longest_books_row[i].innerText);
  longest_books_row[i].style.width = width + "px";
  if (i ==0){
  	var first_row = document.getElementsByClassName("bar-value longest")[0];
  	first_row.innerText  = first_row.innerText+ " pages";
  }
} 

//Formats Read
var format_row = document.getElementsByClassName("format");
var format_max = format_row[0].innerText;


var x_format = d3.scaleLinear()
    .domain([0, format_max]) //return max pages
    .range([ 0, 450]);

var i;
for (i = 0; i < format_row.length; i++) {
  format_row[i].style.backgroundColor = "gray";
  var width = x_format(format_row[i].innerText);
  format_row[i].style.width = width + "px";
  if (i ==0){
  	var first_row = document.getElementsByClassName("bar-value format")[0];
  	first_row.innerText  = first_row.innerText+ " times read";
  }
} 

//Seasonal Breakdown
	var bisectDate = d3.bisector(function(d) { return d.date_finished; }).left;
	var allGroup = ["All"];
    // List of groups (here I have one group per column)
    var years = [...new Set(seasonal_breakdown.map(function(d){ return d.date_finished.getFullYear(); })) ]

    allGroup.push(...years);
    // add the options to the button
    d3.select("#selectButton_syear")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

	// set the dimensions and margins of the graph
	var margin_seasonal = {top: 20, right: 20, bottom: 140, left: 40},
		margin_seasonal2 = {top: 500, right: 20, bottom: 40, left: 40},
	    width_seasonal = 960 - margin_seasonal.left - margin_seasonal.right,
	    height_seasonal = 600 - margin_seasonal.top - margin_seasonal.bottom,
	    height_seasonal2 = 600- margin_seasonal2.top - margin_seasonal2.bottom;

// append the svg object to the body of the page

  var x_seasonal = d3.scaleTime()
  		.range([0, width_seasonal]);
    x_seasonal2 = d3.scaleTime()
    	.range([0, width_seasonal]);
    y_seasonal = d3.scaleLinear()
    	.range([height_seasonal, 0]);
    y_seasonal2 = d3.scaleLinear()
    	.range([height_seasonal2, 0]);

var xAxis_seasonal = d3.axisBottom(x_seasonal), //make sure values don't repeat
    xAxis2_seasonal = d3.axisBottom(x_seasonal2),
    yAxis_seasonal = d3.axisLeft(y_seasonal).tickFormat(d3.format("d"));

var brush_s = d3.brushX()
    .extent([[0, 0], [width_seasonal, height_seasonal2]])
    .on("brush end", brushed_s);

var zoom_s = d3.zoom()
    .scaleExtent([1, 300])
    .translateExtent([[0, 0], [width_seasonal, height_seasonal]])
    .extent([[0, 0], [width_seasonal, height_seasonal]])
    .on("zoom", zoomed_s);

var svg_seasonal = d3.select("#seasonal_breakdown")
  .append("svg")
    .attr("width", width_seasonal + margin_seasonal.left + margin_seasonal.right)
    .attr("height", height_seasonal + margin_seasonal.top + margin_seasonal.bottom)
    .call(zoom_s);

var line_s = d3.line()
        .x(function (d) { return x_seasonal(d.date_finished); })
        .y(function (d) { return y_seasonal(d.read_count); });

    var line_s2 = d3.line()
        .x(function (d) { return x_seasonal2(d.date_finished); })
        .y(function (d) { return y_seasonal2(d.read_count); });

    var clip_s = svg_seasonal.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width_seasonal)
        .attr("height", height_seasonal)
        .attr("x", 0)
        .attr("y", 0); 

    var line_chart_s = svg_seasonal.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin_seasonal.left + "," + margin_seasonal.top + ")")
        .attr("clip-path", "url(#clip)");

    var focus_s = svg_seasonal.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin_seasonal.left + "," + margin_seasonal.top + ")");

	    var context_s = svg_seasonal.append("g")
	    .attr("class", "context")
	    .attr("transform", "translate(" + margin_seasonal2.left + "," + margin_seasonal2.top + ")");

    focus_s.append("g")
	        .attr("class", "axis axis--x")
	        .attr("transform", "translate(0," + height_seasonal + ")");

	focus_s.append("g")
	        .attr("class", "axis axis--y");

	context_s.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height_seasonal2 + ")");

  	context_s.append("g")
      .attr("class", "brush")
      .call(brush_s)
      .call(brush_s.move, x_seasonal.range());

    line_chart_s
        .append("path")
        .attr("class", "line")
        .attr("stroke", "gray")
      	.attr("stroke-width", 2)
      	.attr("fill", "none");

     context_s
    	.append("path")
        .attr("class", "line")
        .attr("stroke", "gray")
      	.attr("stroke-width", 2)
      	.attr("fill", "none");

    var tooltip_s = d3.select("#tooltip_s")
    .style("display", "none");

    svg_seasonal
     	.append("rect")
        .attr("class", "overlay-tooltip")
        .attr("width", width_seasonal)
        .attr("height", height_seasonal)
        .attr("transform", "translate(" + margin_seasonal.left + "," + margin_seasonal.top + ")")
        .style("fill","none")
        .style("pointer-events", "all");
       

	function brushed_s() {
	  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; 
	  var s = d3.event.selection || x_seasonal2.range();
	  x_seasonal.domain(s.map(x_seasonal2.invert, x_seasonal2));
	  line_chart_s.select(".line").attr("d", line_s);
	  focus_s.select(".axis--x").call(xAxis_seasonal);
	  svg_seasonal.select(".zoom").call(zoom_s.transform, d3.zoomIdentity
	      .scale(width_seasonal / (s[1] - s[0]))
	      .translate(-s[0], 0));

	  line_chart_s.select("#tooltip-dot").remove();

	  line_chart_s
        .selectAll("circle")
        .attr("cx", function(d) { return x_seasonal(d.date_finished); })
   		.attr("cy", function(d) { return y_seasonal(d.read_count); });

	}

	function zoomed_s() {
	  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
	  var t = d3.event.transform;
	  x_seasonal.domain(t.rescaleX(x_seasonal2).domain());
	  line_chart_s.select(".line").attr("d", line_s);
	  focus_s.select(".axis--x").call(xAxis_seasonal);
	  context_s.select(".brush").call(brush_s.move, x_seasonal.range().map(t.invertX, t));

	  line_chart_s.select("#tooltip-dot").remove();

	  line_chart_s
        .selectAll("circle")
        .attr("cx", function(d) { return x_seasonal(d.date_finished); })
   		.attr("cy", function(d) { return y_seasonal(d.read_count); });

	}

	// Create a function that takes a dataset as input and update the plot:
function update_s(data, year) {

    x_seasonal.domain(d3.extent(data, function(d) { return d.date_finished; }));
    x_seasonal2.domain(x_seasonal.domain());
    y_seasonal.domain([0, d3.max(data, function(d) { return d.read_count + 3; }) ]);
    y_seasonal2.domain(y_seasonal.domain());

	focus_s.selectAll(".axis--x").transition()
	    .duration(2000)
	    .call(xAxis_seasonal);

	  focus_s.selectAll(".axis--y")
	    .transition()
	    .duration(2000)
	    .call(yAxis_seasonal);

	  context_s.select(".axis--x").call(xAxis2_seasonal);

	  line_chart_s
        .select(".line")
        .datum(data)
        .attr("d", line_s);

    line_chart_s.selectAll("circle").remove();

    line_chart_s
    .append("g")
    .selectAll("circle")
    .data(data)
      .enter()
      .append("circle")
      	.attr("class","dot")
        .attr("cx", function(d) { return x_seasonal(d.date_finished) } )
        .attr("cy", function(d) { return y_seasonal(d.read_count) } )
        .attr("r", 5)
        .attr("fill", "gray")
        .attr("stroke", "white");

     if (year == true){
     	svg_seasonal.select(".overlay-tooltip")
	    .on("mouseover", function() { tooltip_s.style("display", null); })
	    .on("mouseout", function() { tooltip_s.style("display", "none"); })
	    .on("mousemove", function(){
	        var x0 = x_seasonal.invert(d3.mouse(this)[0]),
	          i = bisectDate(data, x0, 1),
	          d0 = data[i - 1],
	          d1 = data[i],
		      d = x0 - d0.date_finished > d1.date_finished - x0 ? d1 : d0;
		      tooltip_s
		      	.html("<strong>"+ d.date_finished.toLocaleString('default', { month: 'long' })+ "</strong> " + "<br><strong>Books:</strong> "+ d.read_count )
		      	.style("transform", "translate(" + (x_seasonal(d.date_finished)+ 50 )+ "px," + (y_seasonal(d.read_count)-40) + "px)");
		      
		      line_chart_s.select("#tooltip-dot").remove();

		      line_chart_s.append("circle")
		            	.attr("id","tooltip-dot")
				        .attr("cx", x_seasonal(d.date_finished) )
				        .attr("cy", y_seasonal(d.read_count))
				        .attr("r", 7)
				        .attr("fill", "red")
				        .attr("stroke", "white");
	        }); 

     }

     else{
     	 svg_seasonal.select(".overlay-tooltip")
	    .on("mouseover", function() { tooltip_s.style("display", null); })
	    .on("mouseout", function() { 
	    	tooltip_s.style("display", "none");
	    	})
	    .on("mousemove", function(){
	        var x0 = x_seasonal.invert(d3.mouse(this)[0]),
	          i = bisectDate(data, x0, 1),
	          d0 = data[i - 1],
	          d1 = data[i],
		      d = x0 - d0.date_finished > d1.date_finished - x0 ? d1 : d0;
		      tooltip_s
		      	.html("<strong>" + d.date_finished.getFullYear() + "</strong>" + "<br><strong>Books:</strong> "+ d.read_count)
		      	.style("transform", "translate(" + (x_seasonal(d.date_finished)+ 50 )+ "px," + (y_seasonal(d.read_count)-40) + "px)");

		      line_chart_s.select("#tooltip-dot").remove();

		      line_chart_s.append("circle")
		            	.attr("id","tooltip-dot")
				        .attr("cx", x_seasonal(d.date_finished) )
				        .attr("cy", y_seasonal(d.read_count))
				        .attr("r", 7)
				        .attr("fill", "red")
				        .attr("stroke", "white");
	        }); 
     }

    context_s
    	.select(".line")
    	.datum(data)
        .attr("d", line_s2);

	}

	function select_button(choice){
		if (choice == "month"){
		document.getElementById("selectButton_syear").disabled = false;
		year_change();

		} else {
		document.getElementById("selectButton_syear").disabled = true;
		update_s(seasonal_breakdown_year, false); 
		}
	}

	function year_change(){
		var selectedYear = d3.select("#selectButton_syear").property("value")
		if (selectedYear == "All"){
			update_s(seasonal_breakdown, true);
		}
		else{
        var dataFilter = seasonal_breakdown.filter(function(d){ 
        	if(d.date_finished.getFullYear() == selectedYear) return d; } );
		update_s(dataFilter, true);
		}
	}

	d3.select("#selectButton_syear").on("change", function(d){
		year_change();
	});

// At the beginning, I run the update function on the first dataset:
update_s(seasonal_breakdown_year);

//Publishing Date

	var tooltip_pub = d3.select("#tooltip_pub").style("display", "none");

	var bisect = d3.bisector(function(d) { return d.year_pub; }).left;

	// set the dimensions and margins of the graph
	var margin_publishing = {top: 20, right: 20, bottom: 140, left: 40},
		margin_publishing2 = {top: 500, right: 20, bottom: 40, left: 40},
	    width_publishing = 960 - margin_publishing.left - margin_publishing.right,
	    height_publishing = 600 - margin_publishing.top - margin_publishing.bottom,
	    height_publishing2 = 600- margin_publishing2.top - margin_publishing2.bottom;

	// append the svg object to the body of the page
	  var x_publishing = d3.scaleLinear()
	  		.range([0, width_publishing]);
	    x_publishing2 = d3.scaleLinear()
	    	.range([0, width_publishing]);
	    y_publishing = d3.scaleLinear()
	    	.range([height_publishing, 0]);
	    y_publishing2 = d3.scaleLinear()
	    	.range([height_publishing2, 0]);

	var xAxis_publishing = d3.axisBottom(x_publishing).tickFormat(d3.format("d")), //make sure values don't repeat
	    xAxis2_publishing = d3.axisBottom(x_publishing2).tickFormat(d3.format("d")),
	    yAxis_publishing = d3.axisLeft(y_publishing);

	var brush = d3.brushX()
	    .extent([[0, 0], [width_publishing, height_publishing2]])
	    .on("brush end", brushed);

	var zoom = d3.zoom()
	    .scaleExtent([1, 300])
	    .translateExtent([[0, 0], [width_publishing, height_publishing]])
	    .extent([[0, 0], [width_publishing, height_publishing]])
	    .on("zoom", zoomed);

	var svg_publishing = d3.select("#publishing_breakdown")
	  .append("svg")
	    .attr("width", width_publishing + margin_publishing.left + margin_publishing.right)
	    .attr("height", height_publishing + margin_publishing.top + margin_publishing.bottom)
	    .call(zoom);

	var line = d3.line()
	        .x(function (d) { return x_publishing(d.year_pub); })
	        .y(function (d) { return y_publishing(d.total_read_count); });

	    var line2 = d3.line()
	        .x(function (d) { return x_publishing2(d.year_pub); })
	        .y(function (d) { return y_publishing2(d.total_read_count); });

	    var clip = svg_publishing.append("defs").append("svg:clipPath")
	        .attr("id", "clip")
	        .append("svg:rect")
	        .attr("width", width_publishing)
	        .attr("height", height_publishing)
	        .attr("x", 0)
	        .attr("y", 0); 


	    var line_chart = svg_publishing.append("g")
	        .attr("class", "focus")
	        .attr("transform", "translate(" + margin_publishing.left + "," + margin_publishing.top + ")")
	        .attr("clip-path", "url(#clip)");

	        var focus = svg_publishing.append("g")
	        .attr("class", "focus")
	        .attr("transform", "translate(" + margin_publishing.left + "," + margin_publishing.top + ")");

		    var context = svg_publishing.append("g")
		    .attr("class", "context")
		    .attr("transform", "translate(" + margin_publishing2.left + "," + margin_publishing2.top + ")");

	    focus.append("g")
		        .attr("class", "axis axis--x")
		        .attr("transform", "translate(0," + height_publishing + ")");

		focus.append("g")
		        .attr("class", "axis axis--y");


	   	context.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + height_publishing2 + ")");

	  	context.append("g")
	      .attr("class", "brush")
	      .call(brush)
	      .call(brush.move, x_publishing.range());


	    line_chart.append("path")
	        .attr("class", "line")
	        .attr("stroke", "gray")
	      	.attr("stroke-width", 2)
	      	.attr("fill", "none");

	    context.append("path")
	        .attr("class", "line")
	        .attr("stroke", "gray")
	      	.attr("stroke-width", 2)
	      	.attr("fill", "none");

	   svg_publishing
	     	.append("rect")
	        .attr("class", "overlay-tooltip-pub")
	        .attr("width", width_publishing)
	        .attr("height", height_publishing)
	        .attr("transform", "translate(" + margin_publishing.left + "," + margin_publishing.top + ")")
	        .style("fill","none")
	        .style("pointer-events", "all");


		function brushed() {
		  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; 
		  var s = d3.event.selection || x_publishing2.range();
		  x_publishing.domain(s.map(x_publishing2.invert, x_publishing2));
		  line_chart.select(".line").attr("d", line);
		  focus.select(".axis--x").call(xAxis_publishing);
		  svg_publishing.select(".zoom").call(zoom.transform, d3.zoomIdentity
		      .scale(width_publishing / (s[1] - s[0]))
		      .translate(-s[0], 0));

		  line_chart.select("#tooltip-dot").remove();

		  line_chart
	        .selectAll("circle")
	        .attr("cx", function(d) { return x_publishing(d.year_pub); })
	   		.attr("cy", function(d) { return y_publishing(d.total_read_count); })

		}

		function zoomed() {
		  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
		  var t = d3.event.transform;
		  x_publishing.domain(t.rescaleX(x_publishing2).domain());
		  line_chart.select(".line").attr("d", line);
		  focus.select(".axis--x").call(xAxis_publishing);
		  context.select(".brush").call(brush.move, x_publishing.range().map(t.invertX, t));

		  line_chart.select("#tooltip-dot").remove();

		  line_chart
	        .selectAll("circle")
	        .attr("cx", function(d) { return x_publishing(d.year_pub); })
	   		.attr("cy", function(d) { return y_publishing(d.total_read_count); });
		}

	function update_pub(data) {

	    x_publishing.domain([ d3.min(data, function(d) { return d.year_pub; }), 
	  			d3.max(data, function(d) { return d.year_pub; })]);
	    x_publishing2.domain(x_publishing.domain());
	    y_publishing.domain([0, d3.max(data, function(d) { return d.total_read_count; }) ]);
	    y_publishing2.domain(y_publishing.domain());

		focus.selectAll(".axis--x").transition()
		    .duration(2000)
		    .call(xAxis_publishing);

		focus.selectAll(".axis--y")
		    .transition()
		    .duration(2000)
		    .call(yAxis_publishing);

		context.select(".axis--x").call(xAxis2_publishing);

		line_chart
	        .select(".line")
	        .datum(data)
	        .attr("d", line);

	    line_chart.selectAll("circle").remove();

	    line_chart
	    .append("g")
	    .selectAll("circle")
	    .data(data)
	      .enter()
	      .append("circle")
	      	.attr("class","dot")
	        .attr("cx", function(d) { return x_publishing(d.year_pub) } )
	        .attr("cy", function(d) { return y_publishing(d.total_read_count) } )
	        .attr("r", 3)
	        .attr("fill", "gray");

	    context
	    	.select(".line")
	    	.datum(data)
	        .attr("d", line2);

	     svg_publishing.select(".overlay-tooltip-pub")
		    .on("mouseover", function() { tooltip_pub.style("display", null); })
		    .on("mouseout", function() { tooltip_pub.style("display", "none"); })
		    .on("mousemove", function(){
		        var x0 = x_publishing.invert(d3.mouse(this)[0]),
		          i = bisect(data, x0, 1),
		          d0 = data[i - 1],
		          d1 = data[i],
			      d = x0 - d0.year_pub > d1.year_pub - x0 ? d1 : d0;
			      tooltip_pub
			      	.html("<strong>" + d.year_pub + "</strong>" + "<br><strong>Books:</strong> "+ d.total_read_count )
			      	.style("transform", "translate(" + (x_publishing(d.year_pub)+ 50 )+ "px," + (y_publishing(d.total_read_count)-40 ) + "px)");

			      line_chart.select("#tooltip-dot").remove();

		    	  line_chart.append("circle")
		            	.attr("id","tooltip-dot")
				        .attr("cx", x_publishing(d.year_pub) )
				        .attr("cy", y_publishing(d.total_read_count))
				        .attr("r", 5)
				        .attr("fill", "red")
				        .attr("stroke", "white");

			      
		        }); 

      }

	function button_pub_year(){
		update_pub(publishing_breakdown);
	}

	function button_pub_century(){
		update_pub(publishing_breakdown_ce);
	}

update_pub(publishing_breakdown);

//Shelves


	var margin_taste = {top: 10, right: 30, bottom: 30, left: 60},
	    width_taste = 700 - margin_taste.left - margin_taste.right,
	    margin_taste2 = {top: 10, right: width_taste + 10, bottom: 30, left: 60},
	    width_taste2 = 300 - margin_taste.left - margin_taste.right,
	    height_taste = 400 - margin_taste.top - margin_taste.bottom;

	// append the svg object to the body of the page
	var svg_taste = d3.select("#tastes")
	  .append("svg")
	    .attr("width", width_taste + margin_taste.left + margin_taste.right + width_taste2)
	    .attr("height", height_taste + margin_taste.top + margin_taste.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin_taste.left + "," + margin_taste.top + ")");

	  var x_taste = d3.scaleTime()
	    .domain(d3.extent(taste, function(d) { return d.date_finished; }))
	    .range([ 0, width_taste ]);
	  svg_taste.append("g")
	    .attr("transform", "translate(0," + height_taste + ")")
	    .call(d3.axisBottom(x_taste))
	    .attr("class","axis--x");

	  // Add Y axis
	  var y_taste = d3.scaleLinear()
	    .domain([0, d3.max(taste, function(d) { return d.read_count; })])
	    .range([ height_taste, 0 ]);
	  svg_taste.append("g")
	    .call(d3.axisLeft(y_taste).tickFormat(d3.format("d")).ticks(5))
	    .attr("class","axis--y");

	  // color palette
	  var res = taste_nested.map(function(d){ return d.key }) // list of group names
	  var color = d3.scaleOrdinal()
	    .domain(res)
	    .range(d3.schemeSet2);

	 var line_taste = d3.line()
	            .x(function(d) { return x_taste(d.date_finished); })
	            .y(function(d) { return y_taste(d.read_count); });

	  // Draw the line
	  svg_taste.selectAll(".line")
	      .data(taste_nested)
	      .enter()
	      .append("path")
	        .attr("fill", "none")
	        .attr("stroke", function(d){ return color(d.key) } ) //function(d){ return color(d.key) }
	        .attr("stroke-width", 2)
	        .attr("d", function(d){ return line_taste(d.values); })
	        .attr("class", function(d){ return d.key });

	var tooltip_taste = d3.select("#tastes")
	      .append("div")
	      .style("opacity", 0)
	      .attr("class", "tooltip")
	      .style("background-color", "black")
	      .style("color", "white")
	      .style("border", "solid")
	      .style("border-width", "2px")
	      .style("border-radius", "5px")
	      .style("padding", "5px");

	  	svg_taste
	  	.selectAll("dot-group")
	      .data(taste_nested)
	      .enter()
	        .append('g')
	        .style("fill", function(d){ return color(d.key) })
	        .attr("class", function(d){ return d.key })
	  	.selectAll("dot")
		    .data(function(d){ return d.values })
		    .enter()
		    .append("circle")
		        .attr("cx", function(d) { return x_taste(d.date_finished) } )
		        .attr("cy", function(d) { return y_taste(d.read_count) } )
		        .attr("r", 5)
		        .attr("stroke", "white")
			     .on('mouseover', function (d) {
			       tooltip_taste.transition()
			         .style('opacity', .9);
			       tooltip_taste.html("<b>Year:</b> " + d.date_finished.getFullYear()  + "<br><b>Read:</b> " + d.read_count)
			         .style('left', `${d3.event.pageX + 2}px`)
			         .style('top', `${d3.event.pageY - 18}px`);

			        d3.select(this).transition()
				          .attr("r", 10);

			     })
			     .on('mouseout', function (d) {
			       tooltip_taste.transition()
			         .style('opacity', 0);

			      d3.select(this).transition()
				          .attr("r", 5);
			     });

    // Add a legend (interactive)
    svg_taste
      .selectAll("myLegend")
      .data(taste_nested)
      .enter()
        .append('g')
        .append("text")
          .attr('x', width_taste + 35)
          .attr('y', function(d,i){ return 6 + i*30})
          .text(function(d) { return d.key; })
          .style("fill", function(d){ return color(d.key) })
          .style("font-size", 15)
        .on("click", function(d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.key).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.key).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })