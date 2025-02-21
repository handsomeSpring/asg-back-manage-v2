<template>
  <div class="mobile-homepage-container">
    <AsgTipComponent type="primary">
      <p class="tip-comp-text">
        <i class="el-icon-chat-line-round"></i>欢迎来到第五人格ASG赛事后台管理系统移动端，本系统主要用于管理赛事和导播\裁判选班，若有问题，请反馈给QQ：793651012。
      </p>
    </AsgTipComponent>
    <el-divider content-position="center">ASG三大系统</el-divider>
    <div class="list-comp active">第五人格ASG后台管理系统</div>
    <div class="list-comp" @click="routerToNew('https://commentary.idvasg.cn/')">第五人格ASG解说端</div>
    <div class="list-comp" @click="routerToNew('https://idvasg.cn/')">第五人格ASG官网</div>
    <el-divider content-position="center">ASG合作伙伴</el-divider>
    <el-skeleton :rows="6" :loading="loading" animated />
    <template v-if="!loading">
      <div class="grid-coperation-container">
        <div class="item" v-for="(item, index) in coperationData" :key="index">
          <img :src="item.logo">
        </div>
        <div class="item">
          <p class="info">成为赞助商</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import { getFriendList } from '@/api/admin/index.js';
export default {
  name: 'mobileHomePage',
  components: {
    AsgTipComponent
  },
  data() {
    return {
      loading: false,
      coperationData: []
    };
  },
  created() {
    this.initFriends()
  },
  methods: {
    routerToNew(link) {
      window.open(link, '_blank')
    },
    async initFriends() {
      try {
        this.loading = true;
        const { data, status } = await getFriendList({
          page: 1,
          page_long: 20
        });
        if (status !== 200) throw new Error('后端服务器异常，获取合作伙伴失败！');
        this.coperationData = (data?.friend ?? []).map(item => {
          return {
            logo: `https://api.idvasg.cn/loge/friend-${item.orgName}.png`,
            ...item
          }
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.$nextTick(() => {
          this.loading = false;
        })
      }
    }
  }
}
</script>
<style lang='less' scoped>
.mobile-homepage-container {
  padding: 0 1em;
  padding-bottom: 65px;
  overflow: hidden;
  background: #fff;

  .tip-comp-text {
    font-size: 0.9em;
    color: #5E6D82;
    line-height: 1.3em;
    text-indent: 1em;
    i{
      color:#E6A23C;
      margin-right: 0.3em;
    }
  }

  .list-comp {
    width: 100%;
    border-radius: 12px;
    height: 120px;
    margin: 1.5em 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F2F6FC;
    color: #606266;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;

    &.active {
      background: #ECF8FF;
      border: 2px dashed #50bfff;
    }
  }

  // 合作伙伴
  .grid-coperation-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5em;

    .item {
      background: #f9f9f9;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }

      .info {
        color: #3c3c54;
        font-size: 0.8em;
      }
    }
  }
}
</style>