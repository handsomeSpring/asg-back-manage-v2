<template>
  <div>
    <list
      v-if="isPageIndex"
      @toDeTail="handleToDetail"
      :bizTypeOptions="bizTypeOptions"
    ></list>
    <detail
      v-else
      :info="info"
      :type="type"
      @returnBack="isPageIndex = true"
      :bizTypeOptions="bizTypeOptions"
      @toList="toList"
    ></detail>
  </div>
</template>

<script>
import list from "./components/list.vue";
import detail from "./components/detail.vue";
import { getByTitle } from "@/api/config";

export default {
  name: "bizTypeAuth",
  components: {
    list,
    detail,
  },
  data() {
    return {
      isPageIndex: true,
      type: "",
      info: {},
      bizTypeOptions: [],
    };
  },
  methods: {
    handleToDetail(type, row) {
      this.info = row;
      this.type = type;
      this.isPageIndex = false;
    },
    toList(){
      this.isPageIndex = true;
    }
  },
  created() {
    getByTitle("ruleConfig").then((res) => {
      this.bizTypeOptions = res.data;
    });
  },
};
</script>
<style lang="less" scoped></style>
