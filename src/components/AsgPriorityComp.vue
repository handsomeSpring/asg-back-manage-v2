<template>
  <div class="pro__content">
    <div class="item" :class="priority === '0' ? 'level-0' : ''" @click="setPriority('0')">不急</div>
    <div class="item" :class="priority === '1' ? 'level-1' : ''" @click="setPriority('1')">轻微</div>
    <div class="item" :class="priority === '2' ? 'level-2' : ''" @click="setPriority('2')">一般</div>
    <div class="item" :class="priority === '3' ? 'level-3' : ''" @click="setPriority('3')">紧需</div>
    <div class="item" :class="priority === '4' ? 'level-4' : ''" @click="setPriority('4')">致命</div>
  </div>
</template>

<script>
export default {
  name: "asg-priority-comp",
  props:{
    priority:{
        type:String,
        required:true
    }
  },
  methods:{
    setPriority(p){
        this.$emit('update:priority',p);
    }
  }
};
</script>

<style scoped lang="less">
.pro__content{
    display: flex;
    align-items: center;
    gap:4px;
    .item{
       border:1px solid #e7e7e7;
       padding:4px 8px;
       font-size: 14px;
       color:#b4b4b4;
       border-radius: 3px;
       cursor: pointer;
       &.level-0{
        color:#cddc39;
        border:1px solid #cddc39;
       }
       &.level-1{
        color:#8bc34a;
        border:1px solid #8bc34a;
       }
       &.level-2{
        color:#fdd835;
        border:1px solid #fdd835;
       }
       &.level-3{
        color:#ff8f00;
        border:1px solid #ff8f00;
       }
       &.level-4{
        color:#c62828;
        border:1px solid #c62828;
       }
    }
}
</style>
