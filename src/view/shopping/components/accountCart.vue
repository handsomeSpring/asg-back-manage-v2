<template>
    <el-dialog title="采购清单" :visible="computedDialog" @close="computedDialog = false" width="60%">
        <div class="main-body" v-if="cartInfo.length > 0">
            <li v-for="item in cartInfo" :key="item.id">
                <img src="@/assets/goodsImg.png">
                <div class="left-container">
                    <p class="title">{{ item.name }}</p>
                    <p class="description">{{ item.description }}</p>
                    <p class="introduction">{{ item.information }}</p>
                    <p>{{ item.price }}</p>
                </div>
            </li>
        </div>
        <el-empty description="暂无商品"></el-empty>
        <div class="footer">
            <el-button size="small" @click="confirmItem" :disabled="cartInfo.length === 0">确认购买</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
  name:'accountCart',
  props:{
    dialogVisible:{
        type:Boolean,
        default:false
    },
    cartInfo:{
        type:Array,
        default:()=>[]
    }
  },
    data() {
      return {

      };
    },
  methods: {
    confirmItem(){
        this.$emit('onSuccess');
    }
  },
  computed:{
    computedDialog:{
        get(){
            return this.dialogVisible
        },
        set(val){
            this.$emit('update:dialogVisible',val);
        }
    }
  },
  created() {

  },
}
</script>
<style lang='less' scoped>
.main-body{
    li{
        display:grid;
        grid-template-columns: 150px auto;
        gap:12px;
        padding:12px 0;
        border-bottom: 1px solid #e7e7e7;
        img{
            width: 100%;
            background-size: contain;
        }
        .left-container{

        }
    }
    margin-bottom: 12px;
}
.footer{
    text-align: center;
}
</style>