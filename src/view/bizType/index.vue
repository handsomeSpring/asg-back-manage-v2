<template>
  <div>
    <list v-if="isPageIndex" @toDeTail="handleToDetail"></list>
    <detail v-else :info="info" :type="type" @returnBack="isPageIndex = true" :bizTypeOptions="bizTypeOptions"></detail>
  </div>

</template>

<script>
import list from './components/list.vue';
import detail from './components/detail.vue'
import { getByTitle } from '@/api/config';

export default {
  name: 'test-1',
  components: {
    list,
    detail
  },
  data() {
    return {
      isPageIndex: true,
      type: '',
      info: {},
      bizTypeOptions:[]
    };
  },
  methods: {
    handleToDetail(type, row) {
      this.info = row;
      this.type = type
      this.isPageIndex = false;
    }
  },
  created() {
    getByTitle('ruleConfig').then(res => {
      this.bizTypeOptions = res.data;
    })
  }
}
</script>
<style lang='less' scoped></style>