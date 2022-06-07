var body = d3.select('body')
var left_part = body.select('#leftPart');
var rank = left_part.select('#rank');
var stack = left_part.select('#stack');
var scatter = left_part.select('#scatter');
var classification = left_part.select('#classification');

const huabei = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区']
const dongbei = ['辽宁省', '吉林省', '黑龙江省']
const huadong = ['上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '台湾省']
const huazhong = ['河南省', '湖北省', '湖南省']
const huanan = ['广东省', '广西壮族自治区', '海南省', '香港特别行政区', '澳门特别行政区']
const xinan = ['重庆市', '四川省', '贵州省', '云南省', '西藏自治区']
const xibei = ['陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区']

time = '2013'
choose_list = []
time_length = time.length
search_obj = layer_geo == 1 ? 'province' : (layer_geo == 2 ? 'city' : undefined)
search_time = time_length == 10 ? 'day' : (time_length == 6 ? 'month' : (time_length == 4 ? 'year' : undefined))




// part1 rank
// 啥都不选的时候(无论是中国地图还是省级地图) rank图默认比较 新出台的七大地理分区规划
// 只能在同一层级上做rank（省之间rank、市之间rank）
// 需要传入的参数
// layer_geo：一个int 此刻地图显示在哪一层级。layer_geo=1 表示 省 province, layer_geo=2 表示 市 city
// choose_list：一个list，里面存着需要比较的对象  e.g. ['浙江省', '江苏省'] or ['杭州市', '湖州市']
// time: 一个string 目前选中的日期  e.g. '2013010100' or '201301' or '2013'
// var doc_rank = document.querySelector('#rank')
// console.log(doc_rank, typeof(doc_rank))
// const width_rank = getComputedStyle(doc_rank, null)['width'].slice(0, -2);
const width_rank = 291;
// const height_rank = getComputedStyle(doc_rank, null)['height'].slice(0, -2);
const height_rank = 140;
const margin_rank = { top: 5, right: 5, bottom: 2, left: 90 };
const innerWidth_rank = width_rank - margin_rank.left - margin_rank.right;
const innerHeight_rank = height_rank - margin_rank.top - margin_rank.bottom;

const render_rank = function (data, obj) {
    console.log(data, obj)
    // Linear Scale: Data Space -> Screen Space; 
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, (datum) => {
            return datum.AQI
        })])
        .range([0, innerWidth_rank]);

    // Introducing y-Scale; 
    const yScale = d3.scaleBand()
        .domain(data.map((datum) => {
            return datum[obj]
        }))
        .range([0, innerHeight_rank])
        .padding(0.2);
    // y-axis
    const y_axis = d3.axisLeft(yScale)

    // The reason of using group is that nothing is rendered outside svg, so margin of svg is always blank while margin of group is rendered inside svg; 
    console.log(rank)
    const g = rank.append('g')
        .attr('transform', `translate(${margin_rank.left}, ${margin_rank.top})`);
    // Do the data join (Enter)
    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('y', datum => yScale(datum[obj]))
        .attr('width', (datum) => { return xScale(datum['AQI']) }) // use xSacle to re-scale data space (domain) and return the rescaled population; 
        .attr('height', yScale.bandwidth())
        .attr('fill', 'steelblue')

    // Adding axis
    g.append('g').call(y_axis);
}

if (choose_list.length == 0) {
    // 没有选择，则展示默认的七大地区
    var seven_geo_data = [
        { division: '华北地区', AQI: 0, 'PM2.5_IAQI': 0, PM10_IAQI: 0, SO2_IAQI: 0, NO2_IAQI: 0, CO_IAQI: 0, O3_IAQI: 0},
        { division: '东北地区', AQI: 0, 'PM2.5_IAQI': 0, PM10_IAQI: 0, SO2_IAQI: 0, NO2_IAQI: 0, CO_IAQI: 0, O3_IAQI: 0},
        { division: '华东地区', AQI: 0, 'PM2.5_IAQI': 0, PM10_IAQI: 0, SO2_IAQI: 0, NO2_IAQI: 0, CO_IAQI: 0, O3_IAQI: 0},
        { division: '华中地区', AQI: 0, 'PM2.5_IAQI': 0, PM10_IAQI: 0, SO2_IAQI: 0, NO2_IAQI: 0, CO_IAQI: 0, O3_IAQI: 0},
        { division: '华南地区', AQI: 0, 'PM2.5_IAQI': 0, PM10_IAQI: 0, SO2_IAQI: 0, NO2_IAQI: 0, CO_IAQI: 0, O3_IAQI: 0},
        { division: '西南地区', AQI: 0, 'PM2.5_IAQI': 0, PM10_IAQI: 0, SO2_IAQI: 0, NO2_IAQI: 0, CO_IAQI: 0, O3_IAQI: 0},
        { division: '西北地区', AQI: 0, 'PM2.5_IAQI': 0, PM10_IAQI: 0, SO2_IAQI: 0, NO2_IAQI: 0, CO_IAQI: 0, O3_IAQI: 0},
    ];

    d3.csv(`/static/innerData/province_AQI_IAQI/${search_time}/${time}.csv`).then(function (data) {
        // console.log(data)
        data.forEach(item => {
            // console.log(item)
            var division = 10;
            if (huabei.indexOf(item['province']) != -1) {
                division = 0
            } else if(dongbei.indexOf(item['province']) != -1) {
                division = 1
            } else if(huadong.indexOf(item['province']) != -1) {
                division = 2
            } else if(huazhong.indexOf(item['province']) != -1) {
                division = 3
            } else if(huanan.indexOf(item['province']) != -1) {
                division = 4
            } else if(xinan.indexOf(item['province']) != -1) {
                division = 5
            } else if(xibei.indexOf(item['province']) != -1) {
                division = 6
            }
            // console.log(division)
            if (division != 10) {   // 即确实是 中国的省份
                // console.log(item['AQI'])
                // console.log(division)
                // console.log(seven_geo_data[division])
                // console.log(seven_geo_data[division]['AQI'])
                seven_geo_data[division]['AQI'] = +(seven_geo_data[division]['AQI']) + +(item['AQI'])
                seven_geo_data[division]['PM2.5_IAQI'] = +(seven_geo_data[division]['PM2.5_IAQI']) + +(item['PM2.5_IAQI'])
                seven_geo_data[division]['PM10_IAQI'] = +(seven_geo_data[division]['PM10_IAQI']) + +(item['PM10_IAQI'])
                seven_geo_data[division]['SO2_IAQI'] = +(seven_geo_data[division]['SO2_IAQI']) + +(item['SO2_IAQI'])
                seven_geo_data[division]['NO2_IAQI'] = +(seven_geo_data[division]['NO2_IAQI']) + +(item['NO2_IAQI'])
                seven_geo_data[division]['CO_IAQI'] = +(seven_geo_data[division]['CO_IAQI']) + +(item['CO_IAQI'])
                seven_geo_data[division]['O3_IAQI'] = +(seven_geo_data[division]['O3_IAQI']) + +(item['O3_IAQI'])
            }
            
        })
        console.log(seven_geo_data)
        seven_geo_data.sort((a,b) => {
            return b.AQI - a.AQI
        })
        seven_geo_data.forEach(datum => {
            datum['AQI'] = +(datum['AQI'])
        })
        render_rank(seven_geo_data, 'division')
    });
} else {
    // 有选择
    d3.csv(`static/innerData/${search_obj}_AQI_IAQI/${search_time}/${time}.csv`).then(function (data) {
        console.log(data)
        choose_list_data = []
        choose_list.forEach(objName => {
            console.log(objName)
            objAQI = data.find(datum => datum[search_obj] == objName)['AQI']
            buf = new Object()
            buf[`${search_obj}`] = objName
            buf['AQI'] = objAQI
            choose_list_data.push(buf)
        })
        choose_list_data.sort((a,b) => {
            return b['AQI'] - a['AQI']
        })
        console.log(choose_list_data)
        choose_list_data.forEach(datum => {
            datum['AQI'] = +(datum['AQI'])
        })
        render_rank(choose_list_data, search_obj)
    })
}




// part2 stack
// 啥都不选的时候(无论是中国地图还是省级地图) stack图默认比较 新出台的七大地理分区规划
// 只能在同一层级上做stack
// 需要传入的参数 与part1共享参数
// var doc_stack = document.getElementById('stack')
// const width_stack = getComputedStyle(doc_stack, null)['width'].slice(0, -2);
const width_stack = 291;
// const height_stack = getComputedStyle(doc_stack, null)['height'].slice(0, -2);
const height_stack = 160;
const margin_stack = { top: 5, right: 5, bottom: 20, left: 30 };
const innerWidth_stack = width_stack - margin_stack.left - margin_stack.right;
const innerHeight_stack = height_stack - margin_stack.top - margin_stack.bottom;

const render_stack = function (naiveData, naiveStack, naiveKeys, search_obj) {
    // 创建scale
    const xScale = d3.scaleBand()
    .domain(naiveData.map(d => d[search_obj]))
    .range([0, innerWidth_stack])
    .padding(0.5)
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(naiveStack, d => d3.max(d, subd => subd[1]))])
        .range([innerHeight_stack, 0]).nice();

    const g = stack.append('g')
        .attr('transform', `translate(${margin_stack.left}, ${margin_stack.top})`);

    // 创建坐标轴
    const xAxis = d3.axisBottom(xScale)
    const xAxisGroup = g.append('g')
        .attr('id', 'xAxis')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight_stack})`)
    const yAxis = d3.axisLeft(yScale)
        // .tickSize(-innerWidth_stack)
    const yAxisGroup = g.append('g')
        .attr('id', 'yAxis')
        .call(yAxis)

    const color = d3.scaleOrdinal()
        .domain(naiveKeys)
        .range(d3.schemeSet3)

    
    // start to do data-join; 
    g.selectAll('.datagroup').data(naiveStack).join('g')
        .attr('class', 'datagroup')
        .attr('fill', d => color(d.key))
        .selectAll('.datarect').data(d => d).join('rect')
            .attr('class', 'datarect')
            .attr('y', d => yScale(d[1]))
            .attr('x', d => xScale(d.data[search_obj]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth());
    d3.selectAll('.tick text').attr('font-size', '0.7em');
}

if (choose_list.length == 0) {
    // 没有选择，则展示默认的七大地区
    d3.csv(`/static/innerData/province_AQI_IAQI/${search_time}/${time}.csv`).then(function (naiveData) {
        // 处理数据
        // console.log(naiveData)
        const naiveKeys = naiveData.columns.splice(1, );
        // console.log(naiveKeys)

        // 做stack
        var my_Stack = d3.stack()
            .keys(naiveKeys)
            .order(d3.stackOrderNone);
        var naiveStack = my_Stack(seven_geo_data);
        // console.log(naiveStack)
        const last_IAQI = naiveStack[naiveStack.length - 1]
        const max_value = d3.max(last_IAQI, datum => datum[1])
        const IAQI_sum = []
        last_IAQI.forEach(every_province => {
            IAQI_sum.push(every_province[1])
        })
        for (var day = 0; day < seven_geo_data.length; day++) {
            naiveStack.forEach(every_IAQI => {
                IAQI_height = every_IAQI[day][1] - every_IAQI[day][0]
                start = every_IAQI[day][0] / IAQI_sum[day] * max_value
                IAQI_height_per = IAQI_height / IAQI_sum[day] * max_value
                end = start + IAQI_height_per
                every_IAQI[day][0] = start
                every_IAQI[day][1] = end
            })
        }

        // render
        render_stack(seven_geo_data, naiveStack, naiveKeys, 'division')
    });
} else {
    // 有选择
    d3.csv(`/static/innerData/${search_obj}_AQI_IAQI/${search_time}/${time}.csv`).then(function (naiveData) {
        console.log(naiveData)
        const naiveKeys = naiveData.columns.splice(1, );
        console.log(naiveKeys)

        choose_list_data = []
        choose_list.forEach(objName => {
            obj = naiveData.find(datum => datum[search_obj] == objName) 
            buf = new Object()
            buf[`${search_obj}`] = objName
            buf['PM2.5_IAQI'] = obj['PM2.5_IAQI']
            buf['PM10_IAQI'] = obj['PM10_IAQI']
            buf['SO2_IAQI'] = obj['SO2_IAQI']
            buf['NO2_IAQI'] = obj['NO2_IAQI']
            buf['CO_IAQI'] = obj['CO_IAQI']
            buf['O3_IAQI'] = obj['O3_IAQI']
            choose_list_data.push(buf)
        })
        console.log(choose_list_data)
        choose_list_data.forEach(datum => {
            naiveKeys.forEach(item => {
                datum[item] = +(datum[item])
            })
        })

        var my_Stack = d3.stack()
            .keys(naiveKeys)
            .order(d3.stackOrderNone);
        var naiveStack = my_Stack(choose_list_data);
        // console.log(naiveStack)
        const last_IAQI = naiveStack[naiveStack.length - 1]
        const max_value = d3.max(last_IAQI, datum => datum[1])
        const IAQI_sum = []
        last_IAQI.forEach(every_province => {
            IAQI_sum.push(every_province[1])
        })
        for (var day = 0; day < choose_list_data.length; day++) {
            naiveStack.forEach(every_IAQI => {
                IAQI_height = every_IAQI[day][1] - every_IAQI[day][0]
                start = every_IAQI[day][0] / IAQI_sum[day] * max_value
                IAQI_height_per = IAQI_height / IAQI_sum[day] * max_value
                end = start + IAQI_height_per
                every_IAQI[day][0] = start
                every_IAQI[day][1] = end
            })
        }

        render_stack(choose_list_data, naiveStack, naiveKeys, search_obj)
    })
}