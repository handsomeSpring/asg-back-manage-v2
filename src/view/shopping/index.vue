<template>
  <div>
    <header>
      <p class="title__show--orange"><i class="el-icon-sunset"></i>赛事组-商品展示</p>
    </header>
    <main>
      <div class="main__left--grid">
        <li class="item__box--radius" :class="item.isCheck ? 'active' : ''" v-for="(item, index) in goodsData"
          :key="index">
          <img src="../../assets/images/goodsImg.png">
          <h4 class="title">{{ item.name }}</h4>
          <p class="description"><el-tag size="small" type="danger">特价</el-tag>{{ item.description }}</p>
          <footer>
            <p class="money__footer--orange"><span style="font-size: 0.7rem">￥</span>{{ item.price }}</p>
            <el-checkbox v-model="item.isCheck">{{ item.isCheck ? '取消' : '加入购物车' }}</el-checkbox>
          </footer>
        </li>
      </div>
      <div class="main__right--grid">
        <el-steps direction="vertical" :active="4">
          <el-step title="选择商品" description="选择心仪的商品加入购物车中"></el-step>
          <el-step title="结算" description="用积分兑换奖励，结算商品"></el-step>
          <el-step title="等待管理员核销" description="等待管理员对账审核，核销商品，即可获得。"></el-step>
          <el-step title="完单" description="管理员已核销"></el-step>
        </el-steps>
      </div>
    </main>
    <button-fix :customHeight="50">
      <el-button size="small" icon="el-icon-arrow-left" @click="$router.back()">返 回</el-button>
      <el-popover placement="top-start" :title="`购物车信息(我的积分:${myMoney})`" width="300" trigger="click">
        <div class="popover__container" v-if="cartData.length > 0">
          <li v-for="(item, index) in cartData" :key="index">
            <p class="title"><i @click="handleDelete(item)" class="el-icon-delete-solid dash"></i>{{ item.name }}</p>
            <p class="money">{{ item.price }}</p>
          </li>
        </div>
        <p v-else>暂无购物信息</p>
        <el-button slot="reference" size="small" type="warning">
          <i class="el-icon-shopping-cart-full"></i>({{ cartData.length }})
        </el-button>
      </el-popover>
      <el-button size="small" type="primary" @click="showAccount">结 账</el-button>

    </button-fix>
    <!-- 组件弹窗 -->
    <accountCart :cartInfo="cartData" :dialogVisible.sync="dialogVisible" @onSuccess="handleBuy"></accountCart>
  </div>
</template>

<script>
import { getStore, buyGoods } from '@/api/storeManager/index.js';
import accountCart from './components/accountCart.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'shopping-class',
  components: {
    accountCart
  },
  data() {
    return {
      goodsData: [],
      dialogVisible: false
    };
  },
  methods: {
    initData() {
      getStore().then(res => {
        const filterArr = res.data.filter(item => item.type === 'teamLead');
        this.goodsData = filterArr.map(el => {
          return {
            ...el,
            isCheck: false,
          }
        })
      })
    },
    showAccount() {
      if (this.totalMoney > this.myMoney) {
        return this.$message.error('操作失败，您的积分不足，请核对');
      }
      this.dialogVisible = true;
    },
    async handleBuy() {
      try {
        const goodsId = this.cartData.map(goods => goods.id);
        const { status, message } = await buyGoods(goodsId);
        if (status !== 200) throw new Error(message);
        this.goodsData.forEach(item => item.isCheck = false);
        this.$message.success('购买成功！');
      } catch (error) {
        if (
          error instanceof Object
          && 'data' in error
          && error.data instanceof Object
          && 'message' in error.data
          && typeof error.data.message === 'string'
        ) {
          throw new Error(error.data.message)
        }
        if (error instanceof Object && 'status' in error && error.status === 500) {
          throw new Error('服务端错误，请联系网站管理员')
        }
        this.$message.error('未知错误，请联系网站管理员')
      }
    },
    handleDelete(item) {
      const row = this.goodsData.find(goods => goods.id === item.id);
      row.isCheck = false;
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    cartData() {
      return this.goodsData.filter(item => item.isCheck)
    },
    myMoney() {
      return this.userInfo.money || Number(window.sessionStorage.getItem('money')) || 0;
    },
    totalMoney() {
      return this.cartData.reduce((pre, next) => pre + next.price, 0);
    }
  },
  created() {
    this.initData();
  },
}
</script>
<style lang='less' scoped>
header {
  margin: 12px 0;

  .title__show--orange {
    color: #f76b38;
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 3px solid #f76b38;
    width: fit-content;
    font-weight: 600;
  }
}

main {
  display: grid;
  grid-template-columns: auto 25%;
  gap: 20px;
  margin-bottom: 20px;

  .main__left--grid {
    background-color: #f7f7f7;
    display: grid;
    grid-template-columns: 21% 21% 21% 21%;
    gap: 12px;

    .item__box--radius {
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #f7f7f7;

      &:hover {
        border: 1px solid #f76b38;
      }

      &.active {
        border: 1px solid #f76b38;
      }

      img {
        width: 99%;
        background-size: cover;
        border-radius: 8px;
      }

      .title {
        padding: 0 6px;
        width: calc(100% - 12px);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .description {
        padding: 0 6px;
        width: calc(100% - 12px);
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 0.8rem;
        color: #494949;
        height: 4rem;
      }

      footer {
        padding: 0 6px;
        margin: 36px 0 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .money__footer--orange {

          color: #f76b38;
          font-weight: 600;
        }
      }

    }
  }

  .main__right--grid {
    background-color: #f7f7f7;
    padding:12px;
  }
}

.popover__container li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
  border-bottom: 1px solid #e1e1e1;

  .title {
    width: 220px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.dash {
  color: #f40;
  cursor: pointer;

  &:hover {
    color: #f76b38
  }
}
</style>