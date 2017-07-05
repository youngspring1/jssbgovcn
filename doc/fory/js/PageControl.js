var repairColor = {
	drak:"#4786b2",
	light:"#5eb2ec"
}
var provisionColor = {
	drak:"#539ba2",
	light:"#68d2db"
}
var scrapColor = {
	drak:"#65a559",
	light:"#82d872"
}
var lineColor = {
	drak:"#896a00",
	light:"#e9b500"
}


function Initialize_Cockpit() {
	//change year
	yeartxt = d3.select("#dashboard_title_year").text();
	
	if(yeartxt ==null || yeartxt == "" ){
		change_dashboard_title_year(new Date().getFullYear());
	}
	year = d3.select("#dashboard_title_year").text();
	
	checkYearData(year);

	//data prepare
	pie_data = "../json/cost-pie-"+year+".json";
	line_data = "../json/cost-line-"+year+".json";
	table_data = "../json/cost-table-"+year+".json";
	//date display
	startUpdateTimeTimer();
    
    $.getJSON(pie_data, function(data){
    	PieData = data.PieData;
    	//make pie legend
	    Bigpie_data_Month = [PieData.domestic_product_repair_cost_target + PieData.domestic_product_provision_cost_target + PieData.domestic_scrap_cost_target, PieData.domestic_product_repair_cost_completed+PieData.domestic_product_provision_cost_completed+PieData.domestic_scrap_cost_completed];
	    window.setTimeout(MakeSmallPieLegend("month_big_pie_legend", Bigpie_data_Month,30), 100);
	
	    Smallpie_data1 = [PieData.domestic_product_repair_cost_target, PieData.domestic_product_repair_cost_completed]
	    window.setTimeout(MakeSmallPieLegend("month_product_repair_pie_legend", Smallpie_data1), 100);
	
	    Smallpie_data2 = [PieData.domestic_product_provision_cost_target, PieData.domestic_product_provision_cost_completed]
	    window.setTimeout(MakeSmallPieLegend("month_product_provision_pie_legend",Smallpie_data2), 100);
	
	    Smallpie_data3 = [PieData.domestic_scrap_cost_target, PieData.domestic_scrap_cost_completed]
	    window.setTimeout(MakeSmallPieLegend("month_scrap_pie_legend",Smallpie_data3), 100);
	
	    //make pie chart
	    data1_total = PieData.domestic_product_repair_cost_target + PieData.domestic_product_provision_cost_target + PieData.domestic_scrap_cost_target;
	    data1_target = [PieData.domestic_product_repair_cost_target, PieData.domestic_product_provision_cost_target, PieData.domestic_scrap_cost_target];
	    ColCat1_target = [repairColor.drak, provisionColor.drak, scrapColor.drak];
	    window.setTimeout(drawDonutChart("month_big_pie", ColCat1_target, data1_target, data1_total, 126, 53, 40, 63), 100);
	
	    data1_completed = [PieData.domestic_product_repair_cost_completed, PieData.domestic_product_provision_cost_completed, PieData.domestic_scrap_cost_completed];
	    ColCat1_completed = [repairColor.light, provisionColor.light, scrapColor.light];
	    window.setTimeout(drawDonutChart("month_big_pie_completed", ColCat1_completed, data1_completed, data1_total, 126, 63, 45, 63, "Total1"), 100);
	
	    data2_total = PieData.domestic_product_repair_cost_target;
	    data2_target = [PieData.domestic_product_repair_cost_target];
	    ColCat2_target = [repairColor.drak];
	    window.setTimeout(drawDonutChart("month_product_repair_pie",ColCat2_target, data2_target, data2_total, 82, 41, 29, 41), 100);
	
	    data2_completed = [PieData.domestic_product_repair_cost_completed];
	    ColCat2_completed = [repairColor.light];
	    window.setTimeout(drawDonutChart("month_product_repair_pie_completed",ColCat2_completed, data2_completed, data2_total, 82, 41, 29, 41), 100);
	
	    data3_total = PieData.domestic_product_provision_cost_target;
	    data3_target = [PieData.domestic_product_provision_cost_target];
	    ColCat3_target = [provisionColor.drak];
	    window.setTimeout(drawDonutChart("month_product_provision_pie",ColCat3_target, data3_target, data3_total, 82, 41, 29, 41), 100);
	
	    data3_completed = [PieData.domestic_product_provision_cost_completed];
	    ColCat3_completed = [provisionColor.light];
	    window.setTimeout(drawDonutChart("month_product_provision_pie_completed",ColCat3_completed, data3_completed, data3_total, 82, 41, 29, 41), 100);
	
	    data4_total = PieData.domestic_scrap_cost_target;
	    data4_target = [PieData.domestic_scrap_cost_target];
	    ColCat4_target = [scrapColor.drak];
	    window.setTimeout(drawDonutChart("month_scrap_pie",ColCat4_target, data4_target, data4_total, 82, 41, 29, 41), 100);
	
	 	data4_completed = [PieData.domestic_scrap_cost_completed];
	    ColCat4_completed = [scrapColor.light];
	    window.setTimeout(drawDonutChart("month_scrap_pie_completed",ColCat4_completed, data4_completed, data4_total, 82, 41, 29, 41), 100);

		$('#td_japan_total_cost').text(d3.format(",.1f")(data1_total));
		$('#td_japan_repair_cost').text(d3.format(",.1f")(data2_total));
		$('#td_japan_provision_cost').text(d3.format(",.1f")(data3_total));
		$('#td_japan_scrap_cost').text(d3.format(",.1f")(data4_total));

    });
   
	//make line chart	
	$.getJSON(line_data, function(data){
		color = [lineColor.drak,lineColor.light];
		window.setTimeout(MakeLineChart("patent_reg_line_chart", data.LineData1, color, 563, 156, 532, 144, 5, "./img/patent_R.png",545), 100);
	});
	
    //make table in scrollbar
    $.getJSON(table_data, function(data){
    	var table_header = createTableHeader();
	    $('#table_header_tr').html(table_header);

	    dataMax = getDataMax(data);
	    
	    var table_body = createTableBody(data.companyData,dataMax,135,repairColor,provisionColor,scrapColor);
	    $("#cost_table_context").html(table_body);
  		scrollfunction();
    });

	window.setTimeout(scrollfunction(),100);
	
}

function getDataMax(data){
	
	monthMax = 0;
	totalMax = 0;
	
	for(var i=0; i<data.companyData.length; i++){
		companyData=data.companyData[i];
		
		var companydetail_0 = companyData.companydetail[0];
        var companydetail_1 =companyData.companydetail[1];
        
        for(var j=0; j<companydetail_0.perioddetail.length;j++){
        	
        	monthtemp_1 = companydetail_0.perioddetail[j].typedetail[0];
        	monthtemp_2 = companydetail_0.perioddetail[j].typedetail[1];
        	
        	if(monthtemp_1>monthMax){
        		monthMax = monthtemp_1;
        	}else if(monthtemp_2>monthMax){
        		monthMax = monthtemp_2;
        	}
        	
       		totaltemp_1 = companydetail_1.perioddetail[j].typedetail[0];
       		totaltemp_2 = companydetail_1.perioddetail[j].typedetail[1];
       		
       		if(totaltemp_1>totalMax){
        		totalMax = totaltemp_1;
        	}else if(totaltemp_2>totalMax){
        		totalMax = totaltemp_2;
        	}
        }
        
	}
	
	dataMax = [monthMax,totalMax];
	return dataMax;
}

function scrollfunction(){
	$(document).ready(function(){
		$('#scrollbararea').tinyscrollbar();
	});
}

function startUpdateTimeTimer() {
    setDateTime();
    updateTimeTimer = setInterval("setDateTime()", 30*1000); //30秒毎に更新
}


<!--syw-->
function mouseover(id) {
    d3.select("#" + id).transition().duration(200).ease('ease-out').style("opacity", "1.0");
    d3.select("#" + id + "_area_hover").transition().duration(200).ease('ease-out').style("opacity", "1.0");
    d3.select("#" + id + "_area").transition().duration(200).ease('ease-out').style("opacity", "0.0");
    d3.select("#fjgroup").transition().duration(200).ease('ease-out').style("opacity", "0.5");    
}
function mouseout(id) {
    d3.select("#" + id).transition().duration(200).ease('ease-out').style("opacity", "0.0");
    d3.select("#" + id + "_area_hover").transition().duration(200).ease('ease-out').style("opacity", "0.0");
    d3.select("#" + id + "_area").transition().duration(200).ease('ease-out').style("opacity", "1.0");
    d3.select("#fjgroup").transition().duration(200).ease('ease-out').style("opacity", "1.0");    
}
<!--syw-->

function changeSelect() {
	var flag = document.getElementById("selector_op").checked

	if(flag){
		window.location="../index2/index.html";
	}	
}

function getLastYearData() {
	year = d3.select("#dashboard_title_year").text();
	regions_data = "../json/risk-regions-"+(parseInt(year)-1)+".json";
	
	$.getJSON(regions_data, function(data){
		d3.select("#dashboard_title_year").text(parseInt(year)-1);
		Initialize_Cockpit();
		d3.select("#year_select_right").style("opacity", "1.0");
	});
}

function getNextYearData() {
	year = d3.select("#dashboard_title_year").text();
	regions_data = "../json/risk-regions-"+(parseInt(year)+1)+".json";
	
	$.getJSON(regions_data, function(data){
	d3.select("#dashboard_title_year").text(parseInt(year)+1);
	Initialize_Cockpit();
	d3.select("#year_select_left").style("opacity", "1.0");
	});
	
}

function checkYearData(year){
	try{
		//next year
		regions_data = "../json/risk-regions-"+(parseInt(year)+1)+".json";
		$.getJSON(regions_data, function(data){
			d3.select("#year_select_right").attr("onclick","getNextYearData()");
		}).fail(function(){
			d3.select("#year_select_right").attr("onclick",null);
			d3.select("#year_select_right").style("opacity", "0.5");
		});
		//last year
		regions_data = "../json/risk-regions-"+(parseInt(year)-1)+".json";
		$.getJSON(regions_data, function(data){
			d3.select("#year_select_left").attr("onclick","getLastYearData()");
		}).fail(function(){
			d3.select("#year_select_left").attr("onclick",null);
			d3.select("#year_select_left").style("opacity", "0.5");
		});
	}catch(e){
		
	}
}
