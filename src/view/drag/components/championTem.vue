<template>
  <div>
    <p style="color: #fff">待发布</p>
  </div>
</template>

<script>
export default {
  name: "championTem",
  data() {
    return {
      promChart: {
        componentName: "sixteenTem",
      },
    };
  },
  // created() {
  //   const propProm = JSON.parse(this.propPromChart);
  //   if (
  //     !this.propPromChart ||
  //     this.promChart.componentName !== propProm.componentName
  //   ) {
  //     return;
  //   }
  //   this.$set(this, "promChart", propProm);
  // },
};
</script>

<style scoped lang="less"></style>
