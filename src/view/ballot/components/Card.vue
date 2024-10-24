<template>
  <div class="card" @click="handleRotate">
    <div class="cover" ref="cover">ASG</div>
    <div class="back" ref="back">{{ back }}</div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    cover: {
      type: String,
      default: "",
    },
    back: {
      type: String,
      default: "",
    },
    groupIndex:{
      type:Number,
      required:true
    },
    maxTeamNum:{
      type:Number,
      default:0
    },
    groups:{
      type:Array,
      required:true
    }
  },
  data(){
    return{
      coverDeg:0,
      backDeg:-180
    }
  },
  mounted(){
    this.$refs.cover.style.transform = `rotateY(${this.coverDeg}deg)`
    this.$refs.back.style.transform = `rotateY(${this.backDeg}deg)`
  },
  methods:{
    handleRotate(){
      if(this.groupIndex === null){
        this.$message.error("请先选择组别！");
        return;
      }
      if(this.groups[this.groupIndex].length >=this.maxTeamNum){
        this.$message.error("该组已抽满，请换一个组别！");
        return;
      }
      if(this.coverDeg === 0){
        this.$emit("addItem",this.back);
        this.coverDeg += 180
        this.backDeg += 180
      }else{
        return;
      }
      // if(this.coverDeg === 0){
      //   this.coverDeg += 180
      //   this.backDeg += 180
      // }else{
      //   this.coverDeg -= 180
      //   this.backDeg -= 180
      // }
     
      this.$refs.cover.style.transform = `rotateY(${this.coverDeg}deg)`
      this.$refs.back.style.transform = `rotateY(${this.backDeg}deg)`
    }
  }
};
</script>

<style scoped lang="less">
 .card{
    box-sizing: border-box;
    position: relative;
    width:200px;
    height:40px;
    perspective: 1000px;
 }
 .card:hover .back{
    background-color: rgb(136, 149, 214)
 }
 .cover, .back{
    background-color: rgba(193,203,233,0.5);
    position: absolute;
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
    transition:all 0.7s ease-in-out;
    cursor:pointer
 }
 .cover{
  font-size: 24px;
  font-weight: bold;
  color:#fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #333;
 }

</style>
