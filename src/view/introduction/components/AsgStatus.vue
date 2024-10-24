<template>
    <div class="status__container">
        <li>
            <i style="color:#97979F" class="el-icon-user-solid"></i>
            <p class="title__label--weight">普通用户执行</p>
        </li>
        <li>
            <i style="color:#4090EF" class="el-icon-s-custom"></i>
            <p class="title__label--weight">管理员审批</p>
        </li>
        <li>
            <i style="color:#fb0" class="el-icon-caret-right"></i>
            <p class="title__label--weight">管理用户执行</p>
        </li>
        <li>
            <i style="color:#20da7d" class="el-icon-refresh"></i>
            <p class="title__label--weight">循环流程</p>
        </li>
        <li>
            <i style="color:#f40" class="el-icon-folder-checked"></i>
            <p class="title__label--weight">备案</p>
        </li>
    </div>
</template>

<script>
export default {
  name:'AsgStatus',
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
.status__container{
    margin:12px 0;
    display: grid;
    grid-template-columns: repeat(5,fit-content(100%));
    width:600px;
    gap:12px;
    li{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.9rem;
        i {
            font-size: 1rem;
        }
        .title__label--weight{
            margin-left:9px;
            color:#303030;
        }
    }
}
</style>