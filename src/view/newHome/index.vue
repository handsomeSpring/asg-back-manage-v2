<template>
  <div class="toCover">
    <!-- 顶部标题 -->
    <div class="head-wrap"></div>
    <!-- 三栏布局 -->
    <div class="container">
      <div class="left">
        <!-- 参赛人数统计 -->
        <div class="enrollNumber">
          <div class="text-align">
            <svg-icon
              style="margin: 5px"
              iconClass="enrollPerson"
              width="20px"
              height="20px"
              color="#62f8fa"
            ></svg-icon>
            <p>ASG历届参赛人数</p>
          </div>
          <div class="chart">
            <div class="bar" id="enroll"></div>
          </div>
        </div>
        <!-- 使用率 -->
        <div class="hunterNumber">
          <div class="text-align">
            <svg-icon
              style="margin: 5px"
              iconClass="untitled"
              width="20px"
              height="20px"
              color="#62f8fa"
            ></svg-icon>
            <p>ASG赛场数据</p>
          </div>
          <div class="chart">
            <div class="bar" id="hunter"></div>
          </div>
        </div>
      </div>
            <!-- 中间 -->
            <div class="main">
        <div class="enrollNumber">
          <div class="text-align">
            <svg-icon
              style="margin: 5px"
              iconClass="map"
              width="20px"
              height="20px"
              color="#62f8fa"
            ></svg-icon>
            <p>ASG全国粉丝分布图</p>
          </div>
          <div class="chart">
            <announce></announce>
          </div>
        </div>
        <div class="hunterNumber">
          <div class="text-align">
            <svg-icon
              style="margin: 5px"
              iconClass="person"
              width="20px"
              height="20px"
              color="#62f8fa"
            ></svg-icon>
            <p>ASG赛事成员发展</p>
          </div>
          <div class="chart">
            <div class="bar" id="orgName"></div>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right">
        <!-- 参赛人数统计 -->
        <div class="enrollNumber">
          <div class="text-align">
            <svg-icon
              style="margin: 5px"
              iconClass="bar"
              width="20px"
              height="20px"
              color="#62f8fa"
            ></svg-icon>
            <p>ASG官方数据</p>
          </div>
          <div class="chart">
            <div class="bar" id="person"></div>
          </div>
        </div>
        <!-- 高校赛\众创赛 -->
        <div class="hunterNumber">
          <div class="text-align">
            <svg-icon
              style="margin: 5px"
              iconClass="budget"
              width="20px"
              height="20px"
              color="#62f8fa"
            ></svg-icon>
            <p>ASG季度预算汇总</p>
          </div>
          <div class="chart">
            <div class="bar" id="season"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import announce from "./announce.vue";
import {
  enrollOptions,
  hunterOptions,
  personOptions,
  budgetOptions,
  orgNameOptions
} from "./echartsInit";
import { getStatic } from "@/api/admin/index";
import { countBudgetTotal } from "@/api/budget/index.js";
export default {
  name: "newHome",
  components: {
    announce,
  },
  data() {
    return {
      static: {},
      enrollChart: { id: "enroll", dom: "", option: "", isCreated: false },
      hunterChart: { id: "hunter", dom: "", option: "", isCreated: false },
      personChart: { id: "person", dom: "", option: "", isCreated: false },
      seasonChart: { id: "season", dom: "", option: "", isCreated: false },
      orgNameChart: { id: "orgName", dom: "", option: "", isCreated: false },
    };
  },
  async mounted() {
    try {
      const { data } = await getStatic();
      this.static = data;
      const { data:budgetInfo } = await countBudgetTotal();
      if(budgetInfo && budgetInfo.code === 401) throw new Error(budgetInfo.message ?? '没有权限！');
      this.budgetInfo = budgetInfo.data.filter(item => Boolean(item.budgetTotalMoney)).map(el => {
        return {
          value:el.budgetTotalMoney,
          name:el.sourceEventName
        }
      })
    } catch (error) {
      this.$message.error(error.message);
    } finally{
      this.t();
    }
  },
  methods: {
    initEnrollData() {
      this.enrollChart.option = enrollOptions();
      this.initChart(this.enrollChart);
    },
    initHunterData() {
      this.hunterChart.option = hunterOptions();
      this.initChart(this.hunterChart);
    },
    initPersonData() {
      this.personChart.option = personOptions(this.static);
      this.initChart(this.personChart);
    },
    initSeasonData() {
      this.seasonChart.option = budgetOptions(this.budgetInfo);
      this.initChart(this.seasonChart);
    },
    initOrgNameData(){
      this.orgNameChart.option = orgNameOptions();
      this.initChart(this.orgNameChart);
    },
    t() {
      this.initEnrollData();
      this.initHunterData();
      this.initPersonData();
      this.initSeasonData();
      this.initOrgNameData()
    },
    // 初始化echarts
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
    },
  },
};
</script>

<style scoped lang="less">
@border-color: rgb(52, 41, 122);

.toCover {
  margin: -20px;
  width: calc(100% + 40px);
  min-height:calc(100vh - 60px);
  box-sizing: border-box;
  background-image: linear-gradient(
    90deg,
    rgb(0, 24, 74) 0%,
    rgb(12, 24, 74) 0%,
    rgb(33, 24, 74) 100%,
    rgb(54, 24, 74) 100%
  );
}
.head-wrap {
  height: 80px;
  width: 100%;
  background-image: url("../../assets/images/dataBackground.jpg");
  background-size: 101% 100%;
}

.container {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  // height: calc(100vh - 80px - 60px);
  height: auto;
  padding: 3px 24px;
}
.right {
  width: 98%;
  height: 100%;
}

.left {
  height: 100%;
  width: 98%;
}
.main {
  width: 98%;
  height: 100%;
}
.text-align {
  display: flex;
  align-items: center;
  color: #62f8fa;
  background: #0f4175;
  height: 30px;
  padding-left: 5px;
  font-size: 1.125rem;
}
.hunterNumber {
  border-radius: 2%;
  width: 100%;
  box-sizing: border-box;
  height: 40vh;
  margin: 6px 0;
  border: 2px solid @border-color;
}

.enrollNumber {
  border-radius: 2%;
  width: 100%;
  box-sizing: border-box;
  height: calc(53vh - 80px - 6px);
  border: 2px solid @border-color;
}
.chart {
  margin: 0 auto;
  overflow: hidden;
  height: calc(100% - 30px);
  width: 100%;
}
.bar {
  width: 100%;
  height: 100%;
}
</style>
