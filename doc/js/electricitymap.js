

function initPage() {
	initMap(2);

}

function initMap(mon) {
	// 基于准备好的dom，初始化echarts实例
	var myMapChart = echarts.init(document.getElementById('jsmap'), 'dark');
	//myMapChart.showLoading();

    $.get('./map/jiangsu.json', function (geoJson) {

        myMapChart.hideLoading();

        echarts.registerMap('jiangsu', geoJson);

        myMapChart.setOption(option = {
            title: {
                text: '江苏省各市每月用电量',
                // subtext: '江苏省统计局',
                sublink: 'http://www.jssb.gov.cn/tjxxgk/tjsj/jdsj/2016/'
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
            series: [
                {
                    name: '江苏省各市每月用电量',
                    type: 'map',
                    mapType: 'jiangsu', // 自定义扩展图表类型
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    // 异步数据加载:
                    data: [],
                    // before hardcode here:
                    // data:[
                    //     {name: '南京市', value: 18.14},
                    //     {name: '无锡市', value: 22.51},
                    //     {name: '徐州市', value: 15.24},
                    //     {name: '常州市', value: 16.55},
                    //     {name: '苏州市', value: 56.12},
                    //     {name: '南通市', value: 13.48},
                    //     {name: '连云港市', value: 5.80},
                    //     {name: '淮安市', value: 5.83},
                    //     {name: '盐城市', value: 11.57},
                    //     {name: '扬州市', value: 8.46},
                    //     {name: '镇江市', value: 8.36},
                    //     {name: '泰州市', value: 8.25},
                    //     {name: '宿迁市', value: 5.04}
                    // ],

                    // 自定义名称映射
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
                }
            ]
        });
        // var mon = document.getElementById('mselect').value;
        // 异步加载数据
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
