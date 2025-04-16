<template>
     <div class="liquidFill" id="hunter"></div>
</template>

<script>
import echarts from "echarts";
import 'echarts-liquidfill';
export default {
    name: 'WaveLeft',
    data() {
        return {
            options: {
                id: "hunter",
                dom: "", 
                option: {
                    backgroundColor: 'transparent',
                    title: {
                        text: '',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 14,
                            color: 'rgb(97, 142, 205)',
                        },
                    },
                    series: [
                        {
                            type: 'liquidFill',
                            radius: '45%',
                            center: ['50%', '50%'],
                            data: [0.7, 0.8, 0.6], // data个数代表波浪数
                            backgroundStyle: {
                                borderWidth: 1,
                                color: 'rgb(255,0,255,0.1)',
                            },
                            // 修改波浪颜色
                            // color:['yellow'], 所有波浪一个颜色
                            // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
                            label: {
                                normal: {
                                    formatter: (0.8 * 100).toFixed(2) + '%',
                                    textStyle: {
                                        fontSize: 18,
                                    },
                                },
                            },
                            outline: {
                                show: false,
                            },
                        },
                        {
                            type: 'pie',
                            center: ['50%', '50%'],
                            radius: ['50%', '52%'],
                            hoverAnimation: false,
                            data: [
                                {
                                    name: '',
                                    value: 500,
                                    labelLine: {
                                        show: false,
                                    },
                                    itemStyle: {
                                        color: '#5886f0',
                                    },
                                    emphasis: {
                                        labelLine: {
                                            show: false,
                                        },
                                        itemStyle: {
                                            color: '#5886f0',
                                        },
                                    },
                                },
                                {
                                    //画中间的图标
                                    name: '',
                                    value: 4,
                                    labelLine: {
                                        show: false,
                                    },
                                    itemStyle: {
                                        color: '#ffffff',
                                        normal: {
                                            color: '#5886f0',
                                            borderColor: '#5886f0',
                                            borderWidth: 20,
                                            // borderRadius: '100%'
                                        },
                                    },
                                    label: {
                                        borderRadius: '100%',
                                    },
                                    emphasis: {
                                        labelLine: {
                                            show: false,
                                        },
                                        itemStyle: {
                                            color: '#5886f0',
                                        },
                                    },
                                },
                                {
                                    // 解决圆点过大后续部分显示明显的问题
                                    name: '',
                                    value: 4,
                                    labelLine: {
                                        show: false,
                                    },
                                    itemStyle: {
                                        color: '#5886f0',
                                    },
                                    emphasis: {
                                        labelLine: {
                                            show: false,
                                        },
                                        itemStyle: {
                                            color: '#5886f0',
                                        },
                                    },
                                },
                                {
                                    //画剩余的刻度圆环
                                    name: '',
                                    value: 88,
                                    itemStyle: {
                                        color: '#050038',
                                    },
                                    label: {
                                        show: false,
                                    },
                                    labelLine: {
                                        show: false,
                                    },
                                    emphasis: {
                                        labelLine: {
                                            show: false,
                                        },
                                        itemStyle: {
                                            color: 'rgba(255,255,255,0)',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                }
            },

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