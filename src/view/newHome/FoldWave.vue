<template>
    <div class="foldwave" id="folewave"></div>
</template>

<script>
import echarts from "echarts";
export default {
    name: 'FoldWave',
    data() {
        return {
            options: {},
            colorList: ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
        };
    },
    methods: {
        initChart(chart) {
            chart.dom = chart.dom || document.getElementById(chart.id);
            if (chart.dom) {
                let newChart = echarts.init(chart.dom);
                if (chart.option) {
                    // 确认获取到option
                    newChart.setOption(chart.option);
                    chart.isCreated = true;
                }
                return chart;
            } else {
                return chart;
            }
        }
    },
    created() {
        this.options = {
            id: "folewave",
            dom: "",
            option: {
                backgroundColor: 'transparent',
                legend: {
                    icon: 'circle',
                    top: '5%',
                    right: '5%',
                    itemWidth: 6,
                    itemGap: 20,
                    textStyle: {
                        color: '#556677'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        label: {
                            show: true,
                            backgroundColor: '#fff',
                            color: '#556677',
                            borderColor: 'rgba(0,0,0,0)',
                            shadowColor: 'rgba(0,0,0,0)',
                            shadowOffsetY: 0
                        },
                        lineStyle: {
                            width: 0
                        }
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: '#5c6c7c'
                    },
                    padding: [10, 10],
                    extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
                },
                grid: {
                    top: '20%'
                },
                xAxis: [{
                    type: 'category',
                    data: ['北京', '上海', '广州', '深圳', '香港', '澳门', '台湾'],
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            color: '#fff'
                        },
                        // 默认x轴字体大小
                        fontSize: 12,
                        // margin:文字到x轴的距离
                        margin: 15
                    },
                    axisPointer: {
                        label: {
                            padding: [0, 0, 10, 0],
                            margin: 15,
                            // 移入时的字体大小
                            fontSize: 12,
                            backgroundColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#fff' // 0% 处的颜色
                                }, {
                                    offset: 0.86,
                                    color: '#fff' // 0% 处的颜色
                                }, {
                                    offset: 0.86,
                                    color: '#33c0cd' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#33c0cd' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        }
                    },
                    boundaryGap: false
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    position: 'right',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                }],
                series: [{
                    name: '男性',
                    type: 'line',
                    data: [10, 10, 30, 12, 15, 3, 7],
                    symbolSize: 1,
                    symbol: 'circle',
                    smooth: true,
                    yAxisIndex: 0,
                    showSymbol: false,
                    lineStyle: {
                        width: 5,
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: '#9effff'
                        },
                        {
                            offset: 1,
                            color: '#9E87FF'
                        }
                        ]),
                        shadowColor: 'rgba(158,135,255, 0.3)',
                        shadowBlur: 10,
                        shadowOffsetY: 20
                    },
                    itemStyle: {
                        normal: {
                            color: this.colorList[0],
                            borderColor: this.colorList[0]
                        }
                    }
                }, {
                    name: '女性',
                    type: 'line',
                    data: [5, 12, 11, 14, 25, 16, 10],
                    symbolSize: 1,
                    symbol: 'circle',
                    smooth: true,
                    yAxisIndex: 0,
                    showSymbol: false,
                    lineStyle: {
                        width: 5,
                        color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                            offset: 0,
                            color: '#73DD39'
                        },
                        {
                            offset: 1,
                            color: '#73DDFF'
                        }
                        ]),
                        shadowColor: 'rgba(115,221,255, 0.3)',
                        shadowBlur: 10,
                        shadowOffsetY: 20
                    },
                    itemStyle: {
                        normal: {
                            color: this.colorList[1],
                            borderColor: this.colorList[1]
                        }
                    }
                },
                {
                    name: '未知',
                    type: 'line',
                    data: [150, 120, 170, 140, 500, 160, 110],
                    symbolSize: 1,
                    yAxisIndex: 1,
                    symbol: 'circle',
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 5,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#fe9a'
                        },
                        {
                            offset: 1,
                            color: '#fe9a8b'
                        }
                        ]),
                        shadowColor: 'rgba(254,154,139, 0.3)',
                        shadowBlur: 10,
                        shadowOffsetY: 20
                    },
                    itemStyle: {
                        normal: {
                            color: this.colorList[2],
                            borderColor: this.colorList[2]
                        }
                    }
                }
                ]
            }
        }
    },
    mounted() {
        this.initChart(this.options);
    }
}
</script>
<style lang='less' scoped>
.foldwave {
    width: 100%;
    height: 100%;
}
</style>