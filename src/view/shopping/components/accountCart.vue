<template>
    <el-dialog title="采购清单" :visible="computedDialog" @close="computedDialog = false" width="60%">
        <el-table :data="cartInfo">
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column label="商品展示" width="120" align="center">
              <template #default="{row}">
                <img class="image_icon" src="@/assets/images/goodsImg.png">
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name" width="120" align="center"></el-table-column>
            <el-table-column label="商品描述/商品信息" prop="name" width="auto" align="center">
                <template #default="{row}">
                    <p class="description">{{ row.description }}</p>
                    <p class="introduction">{{ row.information }}</p>
                </template>
            </el-table-column>
            <el-table-column label="商品加个" prop="name" width="120" align="center">
                <template #default="{row}">
                 <p>￥{{ row.price }}</p>
                </template>
            </el-table-column>
        </el-table>
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
.image_icon{
    width:90px;
    height:90px;
}
.footer{
    text-align: center;
    margin:12px 0;
}
</style>