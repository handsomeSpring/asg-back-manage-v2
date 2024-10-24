<template>
    <HomeDesign :setting-form="settingForm" :design="false"></HomeDesign>
</template>

<script>
import HomeDesign from "../customWorker/components/HomeDesign.vue";
export default {
  name:'HomeDisign',
  components: {
    HomeDesign
  },
  data() {
    return {
      // 后续更新的
      settingForm:{}
    };
  },
  created() {
    try {
      if(!window.localStorage.getItem('customWorker-asg')) return;
      const json = JSON.parse(window.localStorage.getItem('customWorker-asg'));
      this.settingForm = json.settingForm || {};
    } catch (error) {
      this.$message.error(error.message);
    }
  },
};
</script>
