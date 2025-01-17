<template>
  <div>
    <list v-if="isIndex" @toDetail="toDetail"></list>
    <detail v-else :info="seasonForm" :type="type" @toList="toList"></detail>
  </div>
</template>

<script>
import list from "./components/list.vue";
import detail from "./components/detail.vue";
export default {
  name: "seasonManage",
  components: {
    list,
    detail
  },
  data() {
    return {
      isIndex: true,
    };
  },
  methods: {
    toList(){
      this.isIndex = true;
    },
    toDetail(type, obj) {
      this.type = type;
      if (type === 'add') {
        this.seasonForm = {
          status: "0",
          name: "",
          is_over: false,
          opentime: new Date(),
        }
      } else {
        this.seasonForm = obj;
      }
      this.isIndex = false;
    },
  },
};
</script>
