<template>
    <div class="page-container-mobile">
        <el-button size="small" :disabled="page === 1" @click="goLast">上一页</el-button>
        <p class="center">{{ page }}</p>
        <el-button size="small" :disabled="disabledNext" @click="goNext">下一页</el-button>
    </div>
</template>

<script>
export default {
  name:'mobilePage',
  props:{
    page:{
        type:Number,
        required:true
    },
    limit:{
        type:Number,
        required:true
    },
    total:{
        type:Number | null,
        required:true
    }
  },
  computed:{
    disabledNext(){
        return this.page * this.limit > this.total;
    },
  },
  methods: {
    goLast(){
        const total = this.page - 1;
        this.$emit('current-change',total);
    },
    goNext(){
        const total = this.page + 1;
        this.$emit('current-change',total);
    }
  },
  created() {

  },
}
</script>
<style lang='less' scoped>
.page-container-mobile{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap:2em;
    margin:1em 0;
    .center{
        text-align: center;
        color:#4090EF;
        font-weight: bold;
    }
}
</style>