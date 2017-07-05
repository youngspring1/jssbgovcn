function change_dashboard_title_year(year){
	d3.select("#dashboard_title_year").text(year);
}	
// get axis ceiling
function getAxisCeiling(maxValue, stick) {
	unitValue = parseInt(maxValue/stick);
	dataLength = (unitValue+"").length - 1;
	squareUnitValue = Math.ceil(unitValue/Math.pow(10,dataLength));
	return (squareUnitValue * stick * Math.pow(10,dataLength));
}

function store_data_in_cube(data){
	for(var item in data){
		$("#td_" + item).text(data[item]);
	}
}

function drawDonutChart(id, ColCat, dataset, total, diameter, outradius, innerradius, translate, label_name){
	label_name = arguments[8] ? arguments[8] : "Total2";
	var canvas = d3.select("#" + id);				
	var cScale = d3.scale.linear().domain([0, total]).range([0, 2 * Math.PI]);
	var data = new Array();
	var currval = 0;
	for(var i = 0; i < dataset.length; i++){
		var tmparray = new Array();
		tmparray.push(currval, currval + dataset[i], ColCat[i]);
		data.push(tmparray);
		currval = currval + dataset[i];
	}
	
	var svg = d3.select("#svg_" + id);
	if (svg != null) svg.remove();
	
	var svg = canvas.append("svg")
		.attr("id", "svg_" + id)
		.attr("width", diameter)
		.attr("height", diameter);
	

	var arc = d3.svg.arc()
			.innerRadius(innerradius)
			.outerRadius(outradius);
	
	svg.selectAll("path")
			.data(data)
			.enter()
			.append("path")
			.attr("d", arc)
			.style("fill", function(d){return d[2];})
			.attr("transform", "translate(" + translate+ "," + translate + ")")
	        .transition()   // トランジション開始
	        .duration(1000) // 1秒間でアニメーションさせる
	        .attrTween("d", function (d, i) {    // 指定した範囲で値を変化させアニメーションさせる
	            var interpolate = d3.interpolate(
	                { startAngle: 0, endAngle: 0 },   // 各円グラフの開始角度
	                { startAngle: cScale(d[0]), endAngle: cScale(d[1]) }    // 各円グラフの終了角度
	            );
	            return function (t) {
	                return arc(interpolate(t)); // 時間に応じて処理
	            }
	        });
	
	if (id.indexOf("completed") > -1) {		
		svg.append("text")
			.attr("transform", function(d) {return "translate(" + outradius + "," + outradius + ")";})
			.attr("text-anchor","middle")
			.attr("dy","0.25em")
			.attr("class",label_name)
			.style("fill","white")
			.text(d3.format(".1%")(d3.sum(dataset) / total));
	}else if (id.indexOf("2") > -1) {
		svg.append("text")
			.attr("transform", function(d) {return "translate(" + translate + "," + translate + ")";})
			.attr("text-anchor","middle")
			.attr("dy","0.25em")
			.attr("class",label_name)
			.style("fill","white")
			.text(total);
	}
}

function MakeSmallPieLegend (id, value, x, y) {
	x = arguments[2] ? arguments[2] : 5;
	y = arguments[3] ? arguments[3] : 12;
	var canvas = d3.select("#" + id);
	
	var svg = d3.select("#svg_" + id);
	if (svg != null) svg.remove();
	
	svg = canvas.append("svg")
		.attr("id", "svg_" + id)
		.attr("width", "100%")
		.attr("height", 45)
		
		
	textLen=d3.format(",.1f")(value[1]).length+d3.format(",.1f")(value[0].toFixed(1)).length;
	text = svg.append("text")
			.attr("x", x+60-textLen*4)
			.attr("y",y	)
			.attr("class","Basic")
	text.append("tspan")
			.style("fill","white")
			.style("font-weight","bold")
			.text(d3.format(",.1f")(value[1]) +"/");
	text.append("tspan")
			.attr("class","Basic")
			.style("fill","white")
			.style("opacity","0.5")
			.text(d3.format(",.1f")(value[0]) );
	
}

// draw line
function MakeLineChart(id, dataset,color, width, height, pwidth, pheight, y_stick, pic,xWidth) {
	var canvas = d3.select("#" + id);
	
	var cantainer = d3.select("#svg_" + id);
	if (cantainer != null) cantainer.remove();

	// set padding
	var margin = { top: 5, right: 15, bottom: 9, left: 45 };
	// create svg
	var cantainer = canvas.append("svg")
				.attr("id", "svg_" + id)
				.attr("width", width)
				.attr("height", height);
				
	// add back-ground picture
	cantainer.append("svg:image")
		.attr('x',25)
		.attr('y',1)
		.attr('width', pwidth)
		.attr('height', pheight)
		.attr("xlink:href",pic);
		
	var main = cantainer.append('g');
	var stageW = width - margin.left - margin.right;
	var stageH = height - margin.top - margin.bottom;

	var line_count = dataset.length;
	
	var lines=[];
	
	// domain
	var xDomainMin = 0;
	var xDomainMax = 0;
	var yDomainMin = 0;
	var yDomainMax = 0;
	
	// get domain edge
	for(var i=0 ; i<line_count ; i++){
		// get y max
		var curr_y_max = d3.max(dataset[i].gdp,function(d){
			return d[2];
		});
		if(curr_y_max > yDomainMax)
			yDomainMax = curr_y_max;
		// get x max
		var curr_x_max = d3.max(dataset[i].gdp,function(d){
			return d[1];
		});
		if(curr_x_max > xDomainMax)
			xDomainMax = curr_x_max;
		// get x min
		xDomainMin = xDomainMax
		var curr_x_min = d3.min(dataset[i].gdp,function(d){
			return d[1];
		});
		if(curr_x_min < xDomainMin)
			xDomainMin = curr_x_min;
	}
	xScale = xDomainMax - xDomainMin + 2;
	// y scale
	var yScale=d3.scale.linear()
				//.domain([0, yDomainMax*1.1])
				.domain([0, getAxisCeiling(yDomainMax, y_stick)])
				.range([stageH,0]);
	// y axis
	var yAxis=d3.svg.axis()
				.scale(yScale)
				.tickFormat(d3.format("d"))
				.ticks(y_stick)
				.tickSize(0,0)
				.orient("left");
	
	for (i=0;i<dataset[0].gdp.length;i++) {
		cantainer.append("text")
				.attr("class", "Graphscale")
				.attr("fill", "#a6a6a6")
				.attr("text-anchor", "middle")
				.attr("x", margin.left+16+i*xWidth/xScale)
				.attr("y", height)
				.text(dataset[0].gdp[i][0]);
	}
	
	var yBar = main.append("g")
		.attr("transform","translate("+margin.left+","+margin.top+")")
		.attr("class","axis")
		.call(yAxis);
	// draw lines
	lines=[];	
	for(i=0 ; i<line_count ; i++)
	{
		var newLine = new LineObject(xScale, color);
		newLine.init(i);
		lines.push(newLine);
	}
	// draw line
	function LineObject(xScale, color)
	{
		this.group=null;
		this.path=null;
		this.oldData=[];
		 
		this.init = function(idx)
		{
		var arr = dataset[idx].gdp;
		this.group = main.append("g");		 
		var line = d3.svg.line()
			//.x(function(d,i){return xScale(arr[i][1]);})			
			.x(function(d,i){return 16 + i*pwidth/xScale;})
			.y(function(d,i){return yScale(arr[i][2]);});

		xline = line(arr);
		this.path=this.group.append("path")
			.attr("d",line(arr))
			.style("fill","none")
			.style("stroke-width",4)
			.style("stroke",color[idx])			
			.attr("transform","translate("+margin.left+",0)")
			.style({ "opacity": "0.0" })
			.transition().duration(1000)
			.style({ "opacity": "1.0" });
		 
		};
		
		// remove line
		this.remove=function()
		{
			this.group.remove();
		};
	}
};

function createTableHeader(){
	table_header = wraptd("部門/会社", "cost_company_header") + wraptd("予実（当月）", "_month_header","1","3") + wraptd("予算比", "_month_rate_header")
	                    + wraptd("予実累計", "_total_header","1","3") + wraptd("予算比", "_total_rate_header")
						+ wraptd("売上高比","sales_rate_header", 1,1);
	return wraptr(table_header);

}

function createTableBody(data,dataMax,rectTdWidth,repairColor,provisionColor,scrapColor){

    var table_body = "";
    for(var i=0; i<data.length; i++){
		var td_temp1="";
        var td_temp2="";
        var td_temp3="";
        var td_temp4="";
        var td_temp5="";
        var td_temp6="";

        td_budget = wraptd("予算", "budget");
        td_results = wraptd("実績", "results");
        
        var companydetail_0 = data[i].companydetail[0];
        var companydetail_1 = data[i].companydetail[1];
        td_temp1 = wraptd(data[i].company.replace("(","</br>("),"company",6)
			+  wraptd(companydetail_0.perioddetail[0].type, "_type", 2)
			+  td_budget
			+  wraprecttd(companydetail_0.perioddetail[0].typedetail[0]*rectTdWidth/dataMax[0],repairColor.drak, "month_budget_rect")
			+  wraptd( d3.format(",.1%")(companydetail_0.perioddetail[0].typedetail[2]) , "rate",2)
			+  wraptd( companydetail_1.perioddetail[0].type, "_type", 2)
			+  td_budget
            +  wraprecttd(companydetail_1.perioddetail[0].typedetail[0]*rectTdWidth/dataMax[1], repairColor.drak, "total_budget_rect")
			+  wraptd( d3.format(",.1%")(companydetail_1.perioddetail[0].typedetail[2]) , "rate",2)
			+  wraptd( (data[i].companydetail[2].repair * 100 ).toFixed(1)+"%", "sales_rate", 2);
		td_temp2 = td_results
            +  wraprecttd(companydetail_0.perioddetail[0].typedetail[1]*rectTdWidth/dataMax[0], repairColor.light, "month_results_rect")
            +  td_results
            +  wraprecttd(companydetail_1.perioddetail[0].typedetail[1]*rectTdWidth/dataMax[1], repairColor.light, "total_results_rect");
        td_temp3 = wraptd(companydetail_0.perioddetail[1].type, "_type", 2)
            +  td_budget
            +  wraprecttd(companydetail_0.perioddetail[1].typedetail[0]*rectTdWidth/dataMax[0],provisionColor.drak, "month_budget_rect")
            +  wraptd( d3.format(",.1%")(companydetail_0.perioddetail[1].typedetail[2]) , "rate",2)
            +  wraptd(companydetail_1.perioddetail[1].type, "_type", 2)
            +  td_budget
            +  wraprecttd(companydetail_1.perioddetail[1].typedetail[0]*rectTdWidth/dataMax[1],provisionColor.drak, "total_budget_rect")
            +  wraptd( d3.format(",.1%")(companydetail_1.perioddetail[1].typedetail[2]) , "rate",2)
            +  wraptd( (data[i].companydetail[2].provision * 100 ).toFixed(1)+"%", "sales_rate", 2);
        td_temp4 = td_results
            +  wraprecttd(companydetail_0.perioddetail[1].typedetail[1]*rectTdWidth/dataMax[0],provisionColor.light, "month_results_rect")
            +  td_results	
            +  wraprecttd(companydetail_1.perioddetail[1].typedetail[1]*rectTdWidth/dataMax[1],provisionColor.light,"total_results_rect");
        td_temp5 = wraptd(companydetail_0.perioddetail[2].type, "_type", 2)
            +  td_budget
            +  wraprecttd(companydetail_0.perioddetail[2].typedetail[0]*rectTdWidth/dataMax[0],scrapColor.drak, "month_budget_rect")
            +  wraptd( d3.format(",.1%")(companydetail_0.perioddetail[2].typedetail[2]) , "rate",2)
            +  wraptd(companydetail_1.perioddetail[2].type, "_type", 2)
            +  td_budget
            +  wraprecttd(companydetail_1.perioddetail[2].typedetail[0]*rectTdWidth/dataMax[1],scrapColor.drak, "total_budget_rect")
            +  wraptd( d3.format(",.1%")(companydetail_1.perioddetail[2].typedetail[2]) , "rate",2)
           +  wraptd( (data[i].companydetail[2].scrap * 100 ).toFixed(1)+"%", "sales_rate", 2);
        td_temp6 = td_results
            +  wraprecttd(companydetail_0.perioddetail[2].typedetail[1]*rectTdWidth/dataMax[0],scrapColor.light, "month_results_rect")
            +  td_results
            +  wraprecttd(companydetail_1.perioddetail[2].typedetail[1]*rectTdWidth/dataMax[1],scrapColor.light, "total_results_rect");

    table_body += ( wraptr(td_temp1)+wraptr(td_temp2)+wraptr(td_temp3)+wraptr(td_temp4)+wraptr(td_temp5)+wraptr(td_temp6) );

    }
    return table_body;
}


function wraptd(content, tdclass, rowspan, colspan){
	var tdclass = arguments[1] ? arguments[1] : "";
	var rowspan = arguments[2] ? arguments[2] : 1;
	var colspan = arguments[3] ? arguments[3] : 1;
	if(tdclass == ""){
		return "<td rowspan='"+rowspan+"' colspan='"+colspan+"'><div>" + content + "</div></td>";
	}else{
		return "<td class='"+tdclass+"' rowspan='"+rowspan+"' colspan='"+colspan+"'><div>" + content + "</div></td>";
	}
}

function wraprecttd(width, color,tdclass, rowspan, colspan){
	var tdclass = arguments[2] ? arguments[2] : "";
    var rowspan = arguments[3] ? arguments[3] : 1;
    var colspan = arguments[4] ? arguments[4] : 1;

    if(tdclass == "") {
        if (width == 0) {
            return "<td rowspan='" + rowspan + "' colspan='" + colspan + "'><div></div></td>";
        } else {
        	return "<td rowspan='" + rowspan + "' colspan='" + colspan + "'><div style='background-color:" + color + ";width: " + width + "px;height: 7px'></div></td>";
    	}
    }else{
        if(width==0){
            return "<td class='"+tdclass+"' rowspan='"+rowspan+"' colspan='"+colspan+"'><div></div></td>";
        }else {
            return "<td class='" + tdclass + "' rowspan='" + rowspan + "' colspan='" + colspan + "'><div style='background-color:" + color + ";width: " + width + "px;height: 7px'></div></td>";
        }
    }
}

function wraptr(content){
	return "<tr>" + content + "</tr>";
}

function setDateTime(){
	var DateTime = new Date();
	//現在地の日付更新
	try {
		var MonthTbl = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	    var DateTbl = new Array("Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.");
	    var DateTime = new Date();
	
        var Today_Month = DateTime.getMonth();
        var Today_Date = DateTime.getDate();
        var Today_Day = DateTime.getDay();

        var DateString = DateTbl[Today_Day] + " " + MonthTbl[Today_Month] + " " + Today_Date;

        d3.select("#date").html(DateString);

		////時刻更新
		var UTCHours = DateTime.getUTCHours();
		var UTCMinutes = DateTime.getUTCMinutes();
		var UTCSeconds = DateTime.getUTCSeconds();
		d3.select("#time").html(DateTime.getHours() +":"+ DateTime.getMinutes());
	} catch(e) {}
}
//日付更新
function updateDate() {
    var MonthTbl = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var DateTbl = new Array("Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.");
    var DateTime = new Date();
    //現在地の日付更新
    try {
        var Today_Month = DateTime.getMonth();
        var Today_Date = DateTime.getDate();
        var Today_Day = DateTime.getDay();

        var DateString = DateTbl[Today_Day] + " " + MonthTbl[Today_Month] + " " + Today_Date;

        d3.select("#date").html(DateString);
    } catch(e) {}

    //東京の日付更新
    try {
        var utc = DateTime.getTime() + (DateTime.getTimezoneOffset() * 60000); 
        var TokyoDate = new Date(utc + (9 * 3600000));  //+09:00

        var Tokyo_Month = TokyoDate.getMonth();
        var Tokyo_Date = TokyoDate.getDate();
        var Tokyo_Day = TokyoDate.getDay();

        var TokyoDateString = DateTbl[Tokyo_Day] + " " + MonthTbl[Tokyo_Month] + " " + Tokyo_Date;

        d3.select("#Tokyo_Date").html(TokyoDateString);
    } catch(e) {}
}

//コンテンツサイズ設定
function setContentSize() {
var zoom = 1;
	var zoomY = document.documentElement.clientHeight / 768;
	var zoomX = document.documentElement.clientWidth / 1366;
	zoom = (zoomY > zoomX) ? zoomX : zoomY;

	d3.select("#content").style("left", ((document.documentElement.clientWidth - (1366 * zoom)) / 2) + "px")  //表示領域幅
						 .style("top", ((document.documentElement.clientHeight - (768 * zoom)) / 2) + "px")  //表示領域高
						 .style("zoom", zoom);
	d3.select("#BG").style("left", ((document.documentElement.clientWidth - (1366 * zoom)) / 2) + "px")  //表示領域幅
					.style("top", ((document.documentElement.clientHeight - (768 * zoom)) / 2) + (66 * zoom) + "px")  //表示領域高
					.style("zoom", zoom);

	$("#scrollbararea").tinyscrollbar_update();

	if(zoom <= 1.104){
		$(".cost_table_context").css("border-spacing", "3px");
		$(".table_header").css("border-spacing", "2px");
	}if(zoom <=0.494){
		$(".cost_table_context").css("border-spacing", "4px");
		$(".table_header").css("border-spacing", "2px");
	}
}