<template>
  <div class="visual__screen--container">
    <header></header>
    <main>
      <div class="leftPart__container">
        <dv-border-box-3>
          <div class="leftPart--inner">
            <div class="inner-item">
              <div class="left-nav--inner">
                <div class="content_wrap">
                  <ScienceTitle title="服务器内存" />
                  <WaveLeft />
                </div>
                <dv-decoration-2 :dur="2" style="width:100%;height:5px;" />
              </div>
            </div>
            <div class="inner-item">
              <div class="left-nav--inner">
                <div class="content_wrap">
                  <ScienceTitle title="合作伙伴" />
                  <div class="dv-container--content">
                    <dv-decoration-12 style="width:150px;height:150px;" />
                  </div>
                </div>
                <dv-decoration-2 :dur="2" style="width:100%;height:5px;" />
              </div>
            </div>
            <div class="inner-item">
              <div class="left-nav--inner">
                <div class="content_wrap">
                  <ScienceTitle title="CPU使用占比" />
                  <div class="dv-container--content ">
                    <dv-decoration-9 class="content">
                      <span class="pointer-text">44%</span>
                    </dv-decoration-9>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dv-border-box-3>
      </div>
      <div class="mainPart__container">
        <dv-border-box-3>
          <div class="main-content">
            <ScienceTitle title="预算金额" />
            <div class="number__info--wrap">
              <div class="number__icon" v-for="(number, index) in budgetNumber" :key="index">
                {{ number }}
              </div>
              <div class="number__icon">
                元
              </div>
            </div>
            <div class="rank__scroll--wrap">
              <dv-scroll-ranking-board :key="reload" :config="config" style="width:80%;height:100%" />
            </div>
          </div>
        </dv-border-box-3>
      </div>
      <div class="rightPart__container">
        <div class="right-top--container">
          <dv-border-box-8>
            <div class="pai__container">
              <ScienceTitle title="赛事举办次数" />
              <dv-active-ring-chart :config="configRight2" style="width:100%;height:100%" />
            </div>
          </dv-border-box-8>
        </div>
        <div class="right-top--container">
          <dv-border-box-4 :reverse="true">
            <div class="pai__container">
              <ScienceTitle title="剩余预算" />
              <dv-percent-pond :config="{
                value: 19,
                colors: ['#01c4f9', '#c135ff'],
              }" style="width:60%;height:40%;margin-top:10%" />
            </div>
          </dv-border-box-4>
        </div>
      </div>
      <div class="footerPart__container">
        <dv-border-box-4>
          <div class="footer--wrap">
            <div class="footer__item--content">
              <BarWave />
            </div>
            <dv-decoration2 :dur="2" :reverse="true" style="width:5px;height:100%;" />
            <div class="footer__item--content">
              <FoldWave />
            </div>
            <dv-decoration2 :dur="2" :reverse="true" style="width:5px;height:100%;" />
            <div class="footer__item--content">
                <dv-capsule-chart :key="reload" :config="staticConfig" style="width:100%;height:100%" />
            </div>
          </div>
        </dv-border-box-4>
      </div>
    </main>
  </div>
</template>

<script>
import { countBudgetTotal } from '@/api/budget/index';
import ScienceTitle from './scienceTitle.vue';
import WaveLeft from './WaveLeft.vue';
import BarWave from './BarWave.vue';
import FoldWave from './FoldWave.vue';
import { getStatic } from "@/api/admin/index";
export default {
  name: 'visualScreen',
  components: {
    ScienceTitle,
    WaveLeft,
    BarWave,
    FoldWave
  },
  data() {
    return {
      config: {
        data: [],
        unit: '元'
      },
      staticConfig:{
        data:[],
        unit:'个'
      },
      loading: false,
      budgetNumber: [],
      reload: new Date().toString(),
      configRight2: {
        data: [
          {
            name: '高校赛',
            value: 4
          },
          {
            name: '众创赛',
            value: 7
          },
          {
            name: '联赛',
            value: 2
          },
          {
            name: '神将赛',
            value: 1
          }
        ],
      }
    };
  },
  methods: {
    async initData() {
      try {
        this.loading = true;
        const { data: { code, data, message } } = await countBudgetTotal();
        if (code !== 200) throw new Error(message);
        let count = 0;
        data.forEach(item => {
          count += item.budgetTotalMoney;
          this.config.data.push({
            value: item.budgetTotalMoney,
            name: item.sourceEventName
          })
        });
        this.budgetNumber = [];
        if (count > 99999) {
          const digitCount = 5;
          this.budgetNumber.push(...Array(digitCount).fill(9));
        } else {
          // Push each digit of count into budgetNumber
          const countStr = Math.floor(count).toString().padStart(5, '0');
          for (const digit of countStr) {
            this.budgetNumber.push(parseInt(digit, 10));
          }
        }
      } catch (error) {
        this.$message.error(error instanceof Error ? error.message : error);
      } finally {
        this.$nextTick(() => {
          this.loading = false;
          this.reload = new Date().toString() + '1';
        })
      }
    },
    transFormToChines(key){
      const mapList = {
         'form_t':'报名表',
         'role_t':'选手表',
         'sh_log_t':'日志表',
         'sh_t':'赛程表',
         'user_t':'用户表'
      };
      return mapList[key] || key;
    },
    async initStatic(){
      try {
        const { data } = await getStatic();
        if(data && data instanceof Object){
          for (const key in data) {
              const element = data[key];
              this.staticConfig.data.push({
                name: this.transFormToChines(key),
                value: element
              })
          }
        }
      } catch (error) {
        console.error(error);
        this.$message.error('获取统计数据失败');
      }
    }
  },
  mounted() {
    this.initData();
    this.initStatic();
  },
}
</script>

<style scoped lang="less">
.visual__screen--container {
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
  box-sizing: border-box;
  background-image: url('../../assets/images/visualScreen_bg.png');

  header {
    height: 80px;
    width: 100%;
    background-image: url("../../assets/images/dataBackground.jpg");
    background-size: 100% 100%;
  }

  main {
    width: 100%;
    height: calc(100% - 80px);
    display: grid;
    grid-template-columns: 25% 50% 25%;
    grid-template-rows: 33% 33% 33%;
    grid-template-areas:
      "leftPart mainPart rightPart"
      "leftPart mainPart rightPart"
      "leftPart footerPart footerPart";

    .leftPart__container {
      grid-area: leftPart;
      height: 100%;

      .leftPart--inner {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 25px;
        width: calc(100% - 50px);
        height: calc(100% - 50px);

        .inner-item {
          width: 100%;
          height: 100%;

          .left-nav--inner {
            width: 100%;
            height: 100%;

            .content_wrap {
              height: calc(100% - 5px);

              .dv-container--content {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .content {
                  width: 150px;
                  height: 150px;

                  .pointer-text {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #08e5ff;
                  }
                }
              }
            }
          }
        }
      }
    }

    .mainPart__container {
      grid-area: mainPart;
      height: 100%;

      .main-content {
        padding: 25px;
        width: calc(100% - 50px);
        height: calc(100% - 50px);

        .number__info--wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 1em 0;

          .number__icon {
            background-color: #04318099;
            color: #08e5ff;
            height: 60px;
            width: 70px;
            font-size: 35px;
            font-weight: 700;
            line-height: 60px;
            text-align: center;
          }
        }

        .rank__scroll--wrap {
          width: 100%;
          margin: 1rem 0;
          height: calc(100% - 70px - 50px - 1rem - 2rem);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .rightPart__container {
      height: 100%;
      grid-area: rightPart;
      display: grid;
      grid-template-rows: repeat(2, 1fr);

      .right-top--container {
        width: 100%;
        height: 100%;

        .pai__container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }

    .footerPart__container {
      grid-area: footerPart;
      height: 100%;

      .footer--wrap {
        display: flex;
        padding: 20px;
        height: calc(100% - 40px);
        width: calc(100% - 40px);

        .footer__item--content {
          height: 100%;
          width: 33%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
      }
    }
  }
}
</style>
