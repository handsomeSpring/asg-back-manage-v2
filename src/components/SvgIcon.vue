<template>
  <svg :style="{ width, height }" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>
 
<script>
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
    },
    //   图标的颜色
    color: {
      type: String,
      default: "",
    },
    //   接收父组件传递过来图标的宽高
    width: {
      type: String,
      default: "16px",
    },
    height: {
      type: String,
      default: "16px",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
  },
};
</script>
 
<style scoped></style>

  