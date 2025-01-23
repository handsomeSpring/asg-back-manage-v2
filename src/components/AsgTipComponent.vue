<template>
    <div class="asg-tip-component">
         <slot></slot>
    </div>
</template>

<script>
export default {
  name:'AsgTipComp',
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
<style lang='less' scoped>
.asg-tip-component{
    padding: 1em 2em;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 1em 0;
}
</style>