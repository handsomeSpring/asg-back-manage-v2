<template>
    <div class="liquidFill" id="barWave"></div>
</template>

<script>
import echarts from "echarts";
export default {
    name: 'BarWave',
    data() {
        return {
            options: {
                id: "barWave",
                dom: "",
                option: {
                    backgroundColor: 'transparent',
                    tooltip: {},
                    xAxis: {
                        data: ["总部", "办事人", "合作方"],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            textStyle: {
                                color: '#e54035'
                            }
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        }
                    },
                    series: [{
                        name: '预算使用',
                        type: 'pictorialBar',
                        symbolSize: [20, 10],
                        symbolOffset: [0, -5],
                        z: 12,
                        itemStyle: {
                            normal: {
                                color: '#14b1eb'
                            }
                        },
                        data: [{
                            value: 100,
                            symbolPosition: 'end'
                        }, {
                            value: 50,
                            symbolPosition: 'end'
                        }, {
                            value: 20,
                            symbolPosition: 'end'
                        }]
                    }, {
                        name: '二次使用率',
                        type: 'pictorialBar',
                        symbolSize: [20, 10],
                        symbolOffset: [0, 5],
                        z: 12,
                        itemStyle: {
                            normal: {
                                color: '#14b1eb'
                            }
                        },
                        data: [100, 50, 20]
                    }, {
                        name: '预算结余率',
                        type: 'pictorialBar',
                        symbolSize: [30, 20],
                        symbolOffset: [0, 15],
                        z: 11,
                        itemStyle: {
                            normal: {
                                color: 'transparent',
                                borderColor: '#14b1eb',
                                borderWidth: 5
                            }
                        },
                        data: [100, 50, 20]
                    }, {
                        name: '上报使用率',
                        type: 'pictorialBar',
                        symbolSize: [40, 30],
                        symbolOffset: [0, 25],
                        z: 10,
                        itemStyle: {
                            normal: {
                                color: 'transparent',
                                borderColor: '#14b1eb',
                                borderType: 'dashed',
                                borderWidth: 5
                            }
                        },
                        data: [100, 50, 20]
                    }, {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#14b1eb',
                                opacity: .7
                            }
                        },
                        silent: true,
                        barWidth: 20,
                        barGap: '-100%', // Make series be overlap
                        data: [100, 50, 20]
                    }]
                }
            }
        }
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
    mounted() {
        this.initChart(this.options);
    }
}
</script>
<style lang='less' scoped>
.liquidFill{
    width: 100%;
    height: 100%;
}
</style>