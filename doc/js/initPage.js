

function initPage() {
    initMap(2);
    initDepositloan();
    setDate();
}

function setDate() {
    var MonthTbl = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var DateTbl = new Array("Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.");
    var DateTime = new Date();

    var Today_Month = DateTime.getMonth();
    var Today_Date = DateTime.getDate();
    var Today_Day = DateTime.getDay();

    var DateString = DateTbl[Today_Day] + " " + MonthTbl[Today_Month] + " " + Today_Date;

    //date
    $("#date").text(DateString)

    //time
    var UTCHours = DateTime.getUTCHours();
    var UTCMinutes = DateTime.getUTCMinutes();
    var UTCSeconds = DateTime.getUTCSeconds();
    $("#time").text(DateTime.getHours() + ":" + DateTime.getMinutes());
}

function initDepositloan() {
    // 基于准备好的dom,初始化echarts实例
    var timelineChart = echarts.init(document.getElementById('timelinediv'));
    // timelineChart.showLoading();

    var option = {
        baseOption: {
            timeline: {
                axisType: 'category',
                show: true,
                autoPlay: true,
                playInterval: 1500,
                controlPosition: 'right',
                data: ['2016-01', '2016-02', '2016-03', '2016-04', '2016-05', '2016-06', '2016-07', '2016-08', '2016-09', '2016-10', '2016-11', '2016-12']
            },
            grid: {
                containLabel: true
            },
            xAxis: {  
                    type: 'category',
                    // name: '地级市',
                    data: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁']
            },  
            yAxis: { 
                    type: 'value', 
                    // name: '亿元'
                    max: 30000,
            },
            series: [
                {
                    name: '存款',
                    type: 'bar'
                },
                {
                    name: '贷款',
                    type: 'bar'
                }
            ],
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c} (亿元)'
            },
            legend: {
                x: 'right',
                data: ['存款', '贷款']
            },
            title: {
                text: '江苏省各市存贷款',
                textStyle: {  
                    fontWeight: 'normal',
                    color: 'white',
                },
                // subtext: '江苏省统计局',
                // sublink: 'http://www.jssb.gov.cn/tjxxgk/tjsj/jdsj/2016/'
            }
        },
        options:[]
    };
    // set option before read json data
    timelineChart.setOption(option);

    $.get('../data/2016_depositloan.json').done(function (data) {
        // console.log(data.monthlydata);
        // read json data
        var optiondata = {
            options:[
                {
                    series: [
                        {
                            data : data.depositloan[0].deposit
                        },
                        {
                            data : data.depositloan[0].loan
                        }
                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[1].deposit
                        },
                        {
                            data : data.depositloan[1].loan
                        }

                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[2].deposit
                        },
                        {
                            data : data.depositloan[2].loan
                        }

                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[3].deposit
                        },
                        {
                            data : data.depositloan[3].loan
                        }

                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[4].deposit
                        },
                        {
                            data : data.depositloan[4].loan
                        }

                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[5].deposit
                        },
                        {
                            data : data.depositloan[5].loan
                        }
                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[6].deposit
                        },
                        {
                            data : data.depositloan[6].loan
                        }
                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[7].deposit
                        },
                        {
                            data : data.depositloan[7].loan
                        }
                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[8].deposit
                        },
                        {
                            data : data.depositloan[8].loan
                        }
                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[9].deposit
                        },
                        {
                            data : data.depositloan[9].loan
                        }
                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[10].deposit
                        },
                        {
                            data : data.depositloan[10].loan
                        }
                    ]
                },
                {
                    series: [
                        {
                            data : data.depositloan[11].deposit
                        },
                        {
                            data : data.depositloan[11].loan
                        }
                    ]
                }
            ]
        };
        //set data
        timelineChart.setOption(optiondata);
    });
}

function initMap(mon) {
    // 基于准备好的dom，初始化echarts实例
    var myMapChart = echarts.init(document.getElementById('jsmap'));

    // load map
    $.get('./map/jiangsu.json', function (geoJson) {
        myMapChart.hideLoading();
        echarts.registerMap('jiangsu', geoJson);

        // load data
        $.get('../data/2016_map_electricity.json').done(function (data) {
            // console.log('in get json')
            // console.log(data.electricity)
            // console.log('electricity[1]:' + data.electricity[1].month[1])
            // console.log('electricity[1].month[1].name:' + data.electricity[1].month[1].name)
            // console.log('electricity[1].month[1].value:' + data.electricity[1].month[1].value)
            // console.log('month = ' + mon);
            // console.log(data.electricity[mon].month);

            // 填入数据
            myMapChart.setOption({
                title: {
                    text: '江苏省各市每月用电量',
                    // subtext: '江苏省统计局',
                    // sublink: 'http://www.jssb.gov.cn/tjxxgk/tjsj/jdsj/2016/'
                    textStyle: {  
                        fontWeight: 'normal',
                        color: 'white',
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c} (亿千瓦小时)'
                },
                toolbox: {
                    show: false,//true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    max: 120,
                    text:['High','Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['lightskyblue','yellow', 'orangered']
                        //color: ['#ffde33', '#ff9933', '#cc0033', '#660099']
                    }
                },
                series: [{
                    name: '江苏省各市每月用电量',
                    type: 'map',
                    mapType: 'jiangsu', // 自定义扩展图表类型
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data: data.electricity[mon].month,
                    nameMap: {
                        //map data: display name
                        '南京市': '南京市',
                        '无锡市': '无锡市',
                        '徐州市': '徐州市',
                        '常州市': '常州市',
                        '苏州市': '苏州市',
                        '南通市': '南通市',
                        '连云港市': '连云港市',
                        '淮安市': '淮安市',
                        '盐城市': '盐城市',
                        '扬州市': '扬州市',
                        '镇江市': '镇江市',
                        '泰州市': '泰州市',
                        '宿迁市': '宿迁市'
                    }
                }]
            });
        });




    });


}

function getLastYearData() {
    console.log("getLastYearData not yet...");
}

function getNextYearData() {
    console.log("getNextYearData not yet...");
}

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
