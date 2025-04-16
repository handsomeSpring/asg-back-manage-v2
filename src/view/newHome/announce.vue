<template>
  <div>222</div>
</template>

<script>
export default {
  name: 'Announce-index',
  data() {
    return {

    };
  },
  methods: {

  },
  created() {

  },
}
</script>
<style lang='less' scoped></style>
<!-- <template>
  <div class="geo"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "echartMap",
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      const myChart = echarts.init(document.querySelector('.geo'));
      myChart.showLoading();
      const resp = await fetch('/static/china.json').then((resp) => resp.json());
      const users = await fetch('/static/user.json').then((resp) => resp.json());
      echarts.registerMap('China', resp);
      myChart.setOption({
        tooltip: { formatter: '{b} 参赛用户 {c} 人' },
        visualMap: {
          left: '0',
          top: 'bottom',
          min: 0,
          max: 10000,
          text: ['高', '低'],
          calculable: true,
          textStyle: {
            color: '#fff'
          },
          inRange: {
            color: [
              '#99CCFF',
              '#66CCFF',
              '#3366FF',
              '#FFFFCC',
              '#FFCC66',
              '#FFCC00',
              '#FF9900',
              '#FF6633',
              '#FF3333',
              '#CC3333',
              '#CC0000',
              '#FF0000'
            ]
          }
        },
        series: [
          {
            left: '-20%',
            top: '35%',
            type: 'map',
            map: 'China',
            zoom: 1.9,
            roam: true,
            color: '#fff',
            scaleLimit: {
              min: 1,
              max: 3
            },
            data: users
          }
        ]
      });
      setTimeout(() => {
        myChart.hideLoading()
      }, 800);
    }
  }
};
</script>

<style scoped lang="less">
.geo {
  width: 100%;
  height: 100%;
}
</style> -->
