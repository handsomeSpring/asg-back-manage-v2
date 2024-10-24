import echarts from "echarts"
import { toThousands } from "@/utils/index"
const colorListArr = [
  {
    c1: '#ced8fe',
    c2: '#a7b9fd',
    c3: '#6e7cb1'
  },
  {
    c1: '#f1d6a5',
    c2: '#e7b861',
    c3: '#b07a17'
  },
  {
    c1: '#f1dad1',
    c2: '#e2b5a4',
    c3: '#cf8367'
  },
  {
    c1: '#eaf4ef',
    c2: '#d5e9df',
    c3: '#a0cdb6'
  },
  {
    c1: '#d2e3e5',
    c2: '#86b3b9',
    c3: '#538086'
  },
  {
    c1: '#e5e9fd',
    c2: '#bdc9fb',
    c3: '#6276c5'
  }
]
export function enrollOptions() {
  return {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['高校赛', '众创赛', '赛事热度'],
      textStyle: {
        color: '#fff'
      },
    },
    xAxis: [
      {
        type: 'category',
        data: ['1st', '2nd', '3rd', '4th', '5th', '6th'],
        axisLine: {
          textStyle: {
            color: "#fff", // 设置坐标轴颜色
          },
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '参赛队伍',
        min: 0,
        max: 100,
        interval: 20,
        nameTextStyle: {//y轴上方单位的颜色
          color: '#fff'
        },
        axisLabel: {//y轴文字的配置
          textStyle: {
            show: true,
            color: "#fff",
          },
          formatter: '{value} 队'
        },
        axisLine: {
          textStyle: {
            color: "#d7d7d7", // 设置坐标轴颜色
          },
        },
      },
      {
        type: 'value',
        name: '热度',
        min: 0,
        max: 100,
        interval: 20,
        nameTextStyle: {//y轴上方单位的颜色
          color: '#fff'
        },
        axisLabel: {//y轴文字的配置
          textStyle: {
            show: true,
            color: "#fff"
          },
          formatter: '{value} %'
        },
        axisLine: {
          textStyle: {
            color: "#d7d7d7", // 设置坐标轴颜色
          },
        },
      }
    ],
    series: [
      {
        name: '众创赛',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 队';
          }
        },
        data: [
          8, 16, 32, 64, 64, 32
        ],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#c5d5fe'
            },
            {
              offset: 0.2,
              color: '#b7cafe'
            },
            {
              offset: 0.4,
              color: '#8caafd'
            },
            {
              offset: 0.6,
              color: '#6f95fd'
            },
            {
              offset: 0.8,
              color: '#5977ca'
            },
            {
              offset: 1,
              color: '#2c3c65'
            },
          ]),
          barBorderRadius: [6, 6, 0, 0],
        },

      },
      {
        name: '高校赛',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 队';
          }
        },
        data: [
          8, 16, 12, 12, 12, 12
        ],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#f8e1b9'
            },
            {
              offset: 0.2,
              color: '#f4cd8a'
            },
            {
              offset: 0.4,
              color: '#edaf43'
            },
            {
              offset: 0.6,
              color: '#e89b14'
            },
            {
              offset: 0.8,
              color: '#d18c12'
            },
            {
              offset: 1,
              color: '#ba7c10'
            },
          ]),
          barBorderRadius: [6, 6, 0, 0],
        }
      },
      {
        name: '热度',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 人气';
          }
        },
        data: [1, 12, 33, 38, 40, 52]
      }
    ]
  }
}
// 监管者
export function hunterOptions() {
  return {
    tooltip: {
      trigger: 'item',
      format: '{a} <br/>{b}: {c}次 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      textStyle: {
        color: '#fff'
      },
      data: [
        '歌剧演员',
        '佣兵',
        '守夜人',
        '鹿头',
        '律师',
        '祭司'
      ]
    },
    series: [
      {
        name: '禁用角色',
        type: 'pie',
        radius: ['30%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        center: ['50%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 10,
          color: function (params) {
            return new echarts.graphic.LinearGradient(1, 0, 0, 0,
              [
                {
                  offset: 0,
                  color: colorListArr[params.dataIndex]?.c1 ?? ('#' + Math.random().toString(16).substr(2, 6))
                }, {
                  offset: 0.5,
                  color: colorListArr[params.dataIndex]?.c2 ?? ('#' + Math.random().toString(16).substr(2, 6))
                }, {
                  offset: 1,
                  color: colorListArr[params.dataIndex]?.c3 ?? ('#' + Math.random().toString(16).substr(2, 6))
                }
              ])
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 100, name: '歌剧演员' },
          { value: 88, name: '佣兵' },
          { value: 77, name: '守夜人' },
          { value: 99, name: '鹿头' },
          { value: 67, name: '律师' },
          { value: 58, name: '祭司' }
        ]
      }
    ]
  };
}

// 人员
export function personOptions(obj) {
  const data = Object.values(obj)
  return {
    xAxis: {
      type: "category",
      data: ["表单数", "参赛人数", "赛程数", "战队数", "官网用户量"],
      axisLine: {
        lineStyle: {
          color: "#fff", // 设置坐标轴颜色
        },
      },
      axisLabel: {
        rotate: 45, // 设置标签倾斜角度，单位为度
      },
      color: "#fff",
    },
    tooltip: {
      trigger: 'axis'
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#fff", // 设置坐标轴颜色
        },
      },
      name: "队数（个）",
      nameTextStyle: {
        color: "#aaa",
        nameLocation: "start",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#e7e7e7"],
          width: 1,
          type: "dotted",
        },
      },
    },
    series: [
      {
        color: "#62f8fa",
        data: data,
        type: "bar",
        barWidth: "40%",
        // showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#c5d5fe'
            },
            {
              offset: 0.2,
              color: '#b7cafe'
            },
            {
              offset: 0.4,
              color: '#8caafd'
            },
            {
              offset: 0.6,
              color: '#6f95fd'
            },
            {
              offset: 0.8,
              color: '#5977ca'
            },
            {
              offset: 1,
              color: '#2c3c65'
            },
          ]),
          barBorderRadius: [6, 6, 0, 0]
        }
      },
    ],
  };
}


// 赛季对比
export function budgetOptions(data) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return params.name + '：￥' + toThousands(params.value) + '元'
      }
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'bottom',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '预算统计图',
        type: 'pie',
        data,
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        label: {
          show: false,
          position: 'center'
        },
        itemStyle: {
          borderRadius: 10,
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: function (params) {
                return new echarts.graphic.LinearGradient(1, 0, 0, 0,
                  [
                    {
                      offset: 0,
                      color: colorListArr[params.dataIndex]?.c1 ?? ('#' + Math.random().toString(16).substr(2, 6))
                    }, {
                      offset: 0.5,
                      color: colorListArr[params.dataIndex]?.c2 ?? ('#' + Math.random().toString(16).substr(2, 6))
                    }, {
                      offset: 1,
                      color: colorListArr[params.dataIndex]?.c3 ?? ('#' + Math.random().toString(16).substr(2, 6))
                    }
                  ])
              }
            }
          },
          normal: {
            color: function (params) {
              return new echarts.graphic.LinearGradient(1, 0, 0, 0,
                [
                  {
                    offset: 0,
                    color: colorListArr[params.dataIndex]?.c1 ?? ('#' + Math.random().toString(16).substr(2, 6))
                  }, {
                    offset: 0.5,
                    color: colorListArr[params.dataIndex]?.c2 ?? ('#' + Math.random().toString(16).substr(2, 6))
                  }, {
                    offset: 1,
                    color: colorListArr[params.dataIndex]?.c3 ?? ('#' + Math.random().toString(16).substr(2, 6))
                  }
                ])
            }
          }
        },

      }
    ]
  };
}

// 人员构成
export function orgNameOptions() {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (!params[0].value) return '无信息统计';
        return '截止' + params[0].data[0] + ':' + params[0].data[1] + '人';
      }
    },
    xAxis: {
      type: 'category',
      name: '时间/年',
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#e7e7e7",
          width: 0
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '人员数量/个',
      boundaryGap: [0, '30%'],
      axisLine: {
        show: true,
        lineStyle: {
          color: "#e7e7e7",
          width: 0
        }
      }
    },
    visualMap: {
      type: 'piecewise',
      show: false,
      dimension: 0,
      seriesIndex: 0,
      pieces: [
        {
          gt: 1,
          lt: 2,
          color: 'rgba(0, 0, 180, 0.4)'
        },
        {
          gt: 3,
          lt: 4,
          color: 'rgba(0, 0, 180, 0.4)'
        }
      ]
    },
    series: [
      {
        type: 'line',
        smooth: 0.6,
        symbol: 'none',
        lineStyle: {
          color: '#5470C6',
          width: 5
        },
        markLine: {
          symbol: ['none', 'none'],
          label: { show: false },
          data: [{ xAxis: 1 }, { xAxis: 3 }, { xAxis: 5 }, { xAxis: 7 }]
        },
        areaStyle: {},
        data: [
          ['2022-01', 2],
          ['2022-06', 8],
          ['2023-01', 13],
          ['2023-06', 7],
          ['2024-01', 32],
          ['2024-06', 44],
        ]
      }
    ]
  };
}


