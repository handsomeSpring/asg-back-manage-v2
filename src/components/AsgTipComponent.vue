<template>
  <div class="asg-tip-component" :class="`${type}-tip`">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AsgTipComp',
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  }
}
</script>
<style lang='less' scoped>
.asg-tip-component {
  padding: 1em 2em;
  border-radius: 4px;
  border-left: 5px solid;
  margin: 1em 0;

  &.primary-tip {
    border-color: #50bfff;
    background: #ecf8ff;
  }

  &.success-tip {
    background: #f0f9eb;
    border-color: #67c23a;
  }

  &.danger-tip {
    background: #fef0f0; 
    border-color: #f56c6c;;
  }

  &.warning-tip {
    background: #fdf6ec; 
    border-color: #e6a23c;
    
  }
}
</style>