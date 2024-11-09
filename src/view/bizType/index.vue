<template>
  <div>
    <list v-if="isPageIndex"></list>
    <detail v-else></detail>
  </div>

</template>

<script>
import list from './components/list.vue';
import detail from './components/detail.vue'
export default {
  name: 'test-1',
  components: {
    list,
    detail
  },
  data() {
    return {
      isPageIndex:true,
    };
  },
}
</script>
<style lang='less' scoped></style>