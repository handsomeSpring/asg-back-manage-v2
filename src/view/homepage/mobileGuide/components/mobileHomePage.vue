<template>
  <div class="mobile-homepage-container">
    <div class="main-content">
      <AsgTipComponent type="primary">
        <p class="tip-comp-text">
          <i class="el-icon-chat-line-round"></i>欢迎来到第五人格ASG赛事后台管理系统移动端，本系统主要用于管理赛事和导播\裁判选班，若有问题，请反馈给QQ：793651012。
        </p>
      </AsgTipComponent>
      <div class="mobile-info">
        <h2 class="management-text">ASG后台管理系统</h2>
        <p class="management-info">第五人格ASG赛事自主研发办赛辅助系统，引领民间比赛技术革新。</p>
      </div>
      <div class="list-comp">
        <div class="item-comp" @click="routerToNew('https://commentary.idvasg.cn/')">
          <p>ASG解说端</p>
          <svg-icon class="icon-my" iconClass="myWork" height="80px" width="80px"></svg-icon>
        </div>
        <div class="item-comp" @click="routerToNew('https://idvasg.cn/')">
          <p>ASG赛事官网</p>
          <svg-icon class="icon-my" iconClass="myWork" height="80px" width="80px"></svg-icon>
        </div>
      </div>
      <el-divider content-position="center">ASG合作伙伴</el-divider>
      <el-skeleton :rows="6" :loading="loading" animated />
      <template v-if="!loading">
        <div class="grid-coperation-container">
          <div class="item" v-for="(item, index) in coperationData" :key="index">
            <img :src="item.logo">
          </div>
          <div class="item" @click="beSponsor">
            <p class="info">成为赞助商</p>
          </div>
        </div>
      </template>
    </div>
    <!-- 底部展示 -->
    <div class="mobile-homepage-footer">
      <div class="center-text--wrap">
        <p>© 2024 - 2025 Avengers Gaming CopyRight</p>
        <p><a style="color:#111" href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2024037646号-1</a></p>
      </div>
    </div>
    <el-drawer title="赞助ASG赛事" :visible.sync="drawer" direction="ttb" size="100%">
      <div class="main-draw-body">
        联系QQ：3124961425--星宇
      </div>
    </el-drawer>
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
      coperationData: [],
      drawer:false
    };
  },
  created() {
    this.initFriends()
  },
  methods: {
    beSponsor(){
      this.drawer = true;
    },
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
  overflow: hidden;
  min-height: 100%;
  background: #fff;

  .main-content {
    padding: 0 1em;

    .tip-comp-text {
      font-size: 0.9em;
      color: #5E6D82;
      line-height: 1.3em;
      text-indent: 1em;

      i {
        color: #E6A23C;
        margin-right: 0.3em;
      }
    }

    .mobile-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 30px;
      margin: 2em 0;

      .management-text {
        background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
      }

      .management-info {
        text-align: center;
        font-size: 1em;
        font-weight: 500;
        color: rgba(60, 60, 60, .7);
        line-height: 2em;
      }
    }


    .list-comp {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5em;

      .item-comp {
        border-radius: 0.7em;
        border: 1px solid #f9fcff;
        width: 50%;
        padding: 2em;
        background: linear-gradient(173deg, #b3d4ff, #fff0 93%);
        position: relative;
        text-align: center;
        overflow: hidden;
        transform: translateX(-100vw);
        animation: moveIn 480ms forwards;

        p {
          position: relative;
          z-index: 2;
          color: #0089f3;
          font-size: 14px;
          font-weight: bold;
          font-family: 'hk';
        }

        .icon-my {
          position: absolute;
          right: -10px;
          bottom: -20px;
          z-index: 0;
        }
      }
    }

    @keyframes moveIn {
      0% {
        transform: translateX(-100vw);
      }

      60% {
        transform: translateX(5vw) skewX(-25deg);
      }

      100% {
        transform: translateX(0) skewX(0);
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

  // 底部
  .mobile-homepage-footer {
    height: 120px;
    width: 100vw;
    margin-top: 2em;
    background: #f5f7f8;

    .center-text--wrap {
      height: 60px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 0.3em;
      border-top: 1px solid #e7e7e7;

      p {
        font-size: 13px;
        color: #303030;
      }
    }
  }


  // 弹出层
  .main-draw-body{
    padding:2em;
  }
}
</style>