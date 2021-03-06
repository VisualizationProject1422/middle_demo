var centerMap = document.getElementById('centerMap');
var chart_map = echarts.init(centerMap, null, {
    renderer: 'canvas',
    useDirtyRect: false
});

var timeLine = document.getElementById('timeLine');
var chart_timeline = echarts.init(timeLine, null, {
    renderer: 'svg',
    useDirtyRect: false
});

var themeRiver = document.getElementById('themeRiver');
var chart_river = echarts.init(themeRiver, null, {
    renderer: 'svg',
    useDirtyRect: false
});

option_timeline = {
    universalTransition: true,
    tooltip: {},
    visualMap: {
        pieces: [
            { min: 300, color: "#d73027" },
            { min: 200, max: 300, color: "#fc8d59" },
            { min: 150, max: 200, color: "#fee08b" },
            { min: 100, max: 150, color: "#d9ef8b" },
            { min: 50, max: 100, color: "#91cf60" },
            { max: 50, color: "#1a9850" }
        ],
        type: 'piecewise',
        selectmode: false,
        show: false,
        symbolSize: [0, 15],
    },
    singleAxis: {
        type: 'time',
        left: 5,
        right: 5,
        top: 72,
        height: 0,
        boundaryGap: ['8%', '8%'],
        axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [5, 5],
        },
        axisTick: {
            show: false,
        }
    },
    calendar: {
        top: 15,
        left: 15,
        right: 5,
        range: '2013',
        cellSize: 6,
        itemStyle: {
            borderWidth: 0.7
        },
        dayLabel: {
            show: true,
            fontSize: 6,
            firstDay: 1, // 从周一开始
            nameMap: 'ZH'

        },
        monthLabel: {
            show: true,
            fontSize: 8,
            nameMap: 'ZH'
        },
        yearLabel: { show: false },
    },
    series: [
        {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            highLight: {
                itemStyle: {
                    color: 'red'
                }
            }
        },
        {
            name: 'timeHeatMap',
            type: 'heatmap',
            coordinateSystem: 'singleAxis',
        },
        {
            name: 'timeScatter',
            type: 'scatter',
            coordinateSystem: 'singleAxis',
            tooltip: {
                show: false,
            }
        }],

};

option_themeriver = {
    color: ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"],
    dataZoom: {
        id: 'dataZoomX',
        type: 'slider',
        top: 195,
        bottom: 10
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: 'rgba(0,0,0,0.2)',
                width: 1,
                type: 'solid'
            }
        }
    },
    // legend: {
    //     top: 'bottom',
    //     data: ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']
    // },
    singleAxis: {
        bottom: 50,
        top: 0,
        left: 5,
        right: 5,
        axisTick: {},
        axisLabel: {},
        type: 'time',
        axisPointer: {
            animation: true,
            label: {
                show: true
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                opacity: 0.2
            }
        }
    },
    series: [
        {
            type: 'themeRiver',
            top: 0,
            bottom: -10,
            left: 5,
            right: 5,
            boundaryGap: [0, 0],
            label: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.8)'
                }
            },

        }
    ]
}

chart_timeline.setOption(option_timeline);
chart_river.setOption(option_themeriver);
ThemeRiverSetUp();
TimelineSetUp();
mapInit();



chart_map.on('click', function (param) {

    choose_list[0] = param.name;
    if (layer_geo == 'province') {
        TimelineSetUp();
    }
    else {
        CalenderSetUp();
    }
    if (choose_geo.indexOf(param.name) == -1) {
        choose_geo.push(param.name);
        pushtext1(choose_geo);
    }
    else {
        choose_geo.pop(param.name);
        pushtext1(choose_geo);
    }
});

chart_map.on('dblclick', function (param) {
    temp_adcode = getAdcode(param.name);
    layer_geo = 'city';
    $.get('https://geo.datav.aliyun.com/areas_v3/bound/' + temp_adcode + '_full.json').done(function (map) {  //读取json文件
        data_map = map;
        echarts.registerMap(param.name, map);
        chart_map.setOption({
            series: {
                map: param.name,
                top: 40,
                zoom: 1,
            },
        });
        MapSetUp(map, year_current);
        layer_geo = 'city';
    });

});

chart_timeline.on('click', { seriesIndex: 2 }, function (param) {
    console.log(param);
    year_current = param.data[0].toString();
    CalenderSetUp(param.data[0].toString());
    MapSetUp(data_map, param.data[0].toString());
});
chart_timeline.on('click', { seriesIndex: 0 }, function (param) {
    var time = +echarts.number.parseDate(param.data[0]);
    date_2 = echarts.format.formatTime('yyyyMMdd00', time)
    if (!choose_time[0]) {
        layer_time = 'day'
        choose_time.push(date_2);
        pushtext2(choose_time);
    }
    else if (layer_time == 'day') {
        if (choose_time.indexOf(date_2) == -1) {
            choose_time.push(date_2);
            pushtext2(choose_time);
        }
        else {
            choose_time.pop(date_2);
            pushtext2(choose_time);
        }
    }
    if (mapIndex == 2) {
        WindSetUp(date_2);
    }
});
chart_timeline.getZr().on('click', function (param) {
    console.log(param)
    if (param.target) {
        if (param.target.style.text) {
            temp = param.target.style.text;
            switch (temp.length) {
                case 3:
                    t = year_current + temp.slice(0, 2)
                    if (!choose_time[0]) {
                        layer_time = 'month'
                        choose_time.push(t);
                        pushtext2(choose_time);
                    }
                    else if (layer_time == 'month') {
                        if (choose_time.indexOf(t) == -1) {
                            choose_time.push(t);
                            pushtext2(choose_time);
                        }
                        else {
                            choose_time.pop(t);
                            pushtext2(choose_time);
                        }
                    }
                    break;
                case 2:
                    t = year_current + '0' + temp.slice(0, 1)
                    if (!choose_time[0]) {
                        layer_time = 'month'
                        choose_time.push(t);
                        pushtext2(choose_time);
                    }
                    else if (layer_time == 'month') {
                        if (choose_time.indexOf(t) == -1) {
                            choose_time.push(t);
                            pushtext2(choose_time);
                        }
                        else {
                            choose_time.pop(t);
                            pushtext2(choose_time);
                        }
                    }
                    break;
                case 4:
                    console.log('tosee')
                    console.log(choose_time)
                    if (!choose_time[0]) {
                        layer_time = 'year'
                        choose_time.push(temp);
                        pushtext2(choose_time);
                    }
                    else if (layer_time == 'year') {
                        if (choose_time.indexOf(temp) == -1) {
                            choose_time.push(temp);
                            pushtext2(choose_time);
                        }
                        else {
                            choose_time.pop(temp);
                            pushtext2(choose_time);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

})

chart_map.getZr().on('click', function (event) {
    console.log(event)
    // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
    if (!event.target && layer_geo == 'city') {
        layer_geo = 'province';
        mapInit();
    }
});
