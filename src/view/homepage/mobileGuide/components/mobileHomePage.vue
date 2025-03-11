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
      <el-divider content-position="center">ASG团队成员</el-divider>
      <el-skeleton :rows="6" :loading="loading" animated />
      <template v-if="!loading">
        <div class="orgList-container">
          <div v-for="(item, index) in orgList" class="org-item" :key="index">
            <div class="card-header">
              <h2><i class="el-icon-s-custom"></i>{{ item.name }}</h2>
              <el-tag size="mini">{{ item.role }}</el-tag>
              <p class="role-text"><i class="el-icon-s-cooperation"></i>{{ item.worker }}</p>
            </div>
            <div class="card-main">
              <div class="nav-text">{{ item.description }}</div>
            </div>
            <div class="card-footer">
              <div class="audio-box37">
                <div class="audio37-block">
                </div>
                <div class="audio37-block">
                </div>
                <div class="audio37-block">
                </div>
                <div class="audio37-block">
                </div>
                <div class="audio37-block">
                </div>
                <div class="audio37-block">
                </div>
                <div class="audio37-block">
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="digital-container">
        <p class="digital-text">数字办赛  引领时代</p>
        <div class="loading79">
          <p class="p79">4rs<span class="i79-1">b</span>h<span class="i79">k</span>r</p>
          <p class="p79">_7u<span class="i79">i</span>90<span class="i79">@</span>v</p>
          <p class="p79">_7,=<span class="i79-1">j</span>ud<span class="i79">i</span>y</p>
          <p class="p79">d8<span class="i79-1">%</span>rg</p>
          <p class="p79">
            <span class="i79">d</span>oopd<span class="i79-1">e</span>g
          </p>
          <p class="p79">c4*<span class="i79-1">h</span>ld</p>
          <p class="p79">u<span class="i79">g</span>_^43<span class="i79">2</span>iu</p>
          <p class="p79">+o<span class="i79-1">0</span>u-i,</p>
        </div>
      </div>
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
        {{ cooperationNotice }}
      </div>
    </el-drawer>
  </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import { getFriendList } from '@/api/admin/index.js';
import { getByTitle } from '@/api/config';
export default {
  name: 'mobileHomePage',
  components: {
    AsgTipComponent
  },
  data() {
    return {
      loading: false,
      coperationData: [],
      drawer: false,
      cooperationNotice: '',
      orgList: []
    };
  },
  created() {
    this.$toast('登录成功', 1700);
    this.initFriends()
  },
  methods: {
    beSponsor() {
      this.drawer = true;
    },
    routerToNew(link) {
      window.open(link, '_blank')
    },
    async initFriends() {
      try {
        this.loading = true;
        const orgList = await getByTitle('orgConfig');
        this.orgList = orgList?.data ?? [];
        const result = await getByTitle('cooperationNotice');
        this.cooperationNotice = result?.data || '无内容'
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
        this.$toast.error(error.message);
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

    //组织成员介绍
    .orgList-container {
      width: 100%;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .org-item {
        width: 100%;
        padding: 30px 0;
        background: #fff;
        border-radius: 4px;
        /* 溢出隐藏 */
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        /* 阴影 */
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;

          i {
            margin-right: 0.2rem;
          }

          h2 {
            color: #303133;
            font-size: 1.2rem;
          }

          .role-text {
            font-size: 0.9rem;
            font-weight: bold;
            color: rgb(94, 109, 130);
          }
        }

        .card-main {
          margin: 40px auto 20px;
          width: 70%;

          .nav-text {
            text-indent: 2rem;
            font-size: 1rem;
          }
        }

        .card-footer {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .audio-box37 {
            width: 84px;
            height: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }

          .audio37-block {
            width: 6px;
            box-sizing: border-box;
            background-color: #97E138;
            animation: audio37-eff 2s linear infinite;
            box-shadow: 0 -1px 0 #ffffff, 0 -2px 0 #97E138;
          }

          .audio37-block:nth-of-type(2) {
            background-color: #FF3A85;
            animation-delay: .3s;
            animation-duration: 2.4s;
            box-shadow: 0 -1px 0 #ffffff, 0 -2px 0 #FF3A85;
          }

          .audio37-block:nth-of-type(3) {
            background-color: #A2DAF6;
            animation-delay: .38s;
            box-shadow: 0 -1px 0 #ffffff, 0 -2px 0 #A2DAF6;
          }

          .audio37-block:nth-of-type(4) {
            background-color: #FFD6D0;
            animation-delay: .5s;
            box-shadow: 0 -1px 0 #ffffff, 0 -2px 0 #FFD6D0;
          }

          .audio37-block:nth-of-type(5) {
            background-color: #FF472C;
            animation-duration: 2.7s;
            box-shadow: 0 -1px 0 #ffffff, 0 -2px 0 #FF472C;
          }

          .audio37-block:nth-of-type(6) {
            background-color: #DE74CE;
            animation-delay: .6s;
            animation-duration: 1.4s;
            box-shadow: 0 -1px 0 #ffffff, 0 -2px 0 #DE74CE;
          }

          .audio37-block:nth-of-type(7) {
            background-color: #36AFCA;
            animation-delay: .8s;
            box-shadow: 0 -1px 0 #ffffff, 0 -2px 0 #36AFCA;
          }

          @keyframes audio37-eff {
            0% {
              height: 0;
            }

            50% {
              height: 32px;
            }

            100% {
              height: 0;
            }
          }

        }
      }
    }

    // 数字化
    .digital-container {
      flex-direction: column;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .digital-text{
        background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin:1rem 0;
      }
      .loading79 {
        width: 100%;
        height: 88px;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 4px;
        background-color: transparent;
        position: relative;
        overflow: hidden;
      }

      .p79 {
        writing-mode: vertical-rl;
        font-size: 14px;
        line-height: 2;
        margin: 0;
        padding: 0;
        position: absolute;
        color: #43ff85;
        --left-79: 22px;
        --delay-79: 1s;
        animation: eff79 2.6s linear infinite;
      }

      .i79 {
        color: #6c72fe;
      }

      .i79-1 {
        color: #f7e543;
      }

      .p79:nth-child(1) {
        left: var(--left-79);
      }

      .p79:nth-child(2) {
        left: calc(var(--left-79)*3);
        animation-delay: var(--delay-79);
      }

      .p79:nth-child(3) {
        left: calc(var(--left-79)*5);
        animation-delay: calc(var(--delay-79)*2);
      }

      .p79:nth-child(4) {
        left: calc(var(--left-79)*7);
      }

      .p79:nth-child(5) {
        left: calc(var(--left-79)*9);
      }

      .p79:nth-child(6) {
        left: calc(var(--left-79)*11);
        animation-delay: calc(var(--delay-79)*3);
      }

      .p79:nth-child(7) {
        left: calc(var(--left-79)*13);
      }

      .p79:nth-child(8) {
        left: calc(var(--left-79)*15);
        animation-delay: calc(var(--delay-79)*4);
      }

      @keyframes eff79 {
        0% {
          transform: translateY(-40%);
        }

        100% {
          transform: translateY(140%);
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
  .main-draw-body {
    padding: 2em;
    color: #72767b;
    text-indent: 2em;
  }
}
</style>