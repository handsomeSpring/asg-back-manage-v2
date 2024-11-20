<template>
  <div class="money_container">
    <div class="one-line">
      <div class="grid-item">
        <Card roleLabel="网易激励金" curStep="100%"></Card>
      </div>
      =
      <div class="grid-item">
        <Card roleLabel="主策划留余" curStep="激励金1/8"></Card>
      </div>
      +
      <div class="grid-item">
        <Card roleLabel="外部工资奖金" curStep="激励金3/4"></Card>
      </div>
      +
      <div class="grid-item">
        <Card roleLabel="赛事组按劳分配" curStep="激励金1/8"></Card>
      </div>
      +
      <div class="grid-item">
        <Card roleLabel="剩余预算库存" curStep="0%"></Card>
      </div>
    </div>
    <!-- 第二行 -->
    <div class="one-line">
      <div class="grid-item">
        <Card roleLabel="赞助金" curStep="100%"></Card>
      </div>
      =
      <div class="grid-item">
        <Card roleLabel="招赞人" curStep="赞助金1/4"></Card>
      </div>
      +
      <div class="grid-item">
        <Card roleLabel="工作广告组" curStep="赞助金1/2"></Card>
      </div>
      +
      <div class="grid-item">
        <Card roleLabel="预算库存" curStep="赞助金1/4"></Card>
      </div>
    </div>
    <!-- 第三行 -->
    <div class="one-line">
      <div class="grid-item">
        <Card roleLabel="稿件、礼物收益" curStep="100%"></Card>
      </div>
      =
      <div class="grid-item">
        <Card roleLabel="预算库存" curStep="收益1/2"></Card>
      </div>
      +
      <div class="grid-item">
        <Card roleLabel="合作提取" curStep="收益1/2"></Card>
      </div>
    </div>
    <!-- 第四行 -->
    <div class="one-line">
      <div class="grid-item">
        <Card roleLabel="其他收益" curStep="100%"></Card>
      </div>
      =
      <div class="grid-item">
        <Card roleLabel="预算库存" curStep="100%"></Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "./Card.vue";
export default {
  name: "FouthCur",
  components: {
    Card,
  },
};
</script>

<style scoped lang="less">
.money_container {
  .one-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px;
    width: 100%;
    padding:18px 0;
    border-bottom: 1px solid #e7e7e7;
    .grid-item {
      flex-shrink: 0;
    }
  }
}
</style>
