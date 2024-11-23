<template>
  <div class="asg-table-main">
    <header>
      <p class="title__show--orange">
        <i class="el-icon-sunset"></i>赛事组-商品展示
      </p>
    </header>
    <main>
      <div class="main__left--grid">
        <li
          class="item__box--radius"
          :class="item.isCheck ? 'active' : ''"
          v-for="(item, index) in goodsData"
          :key="index"
        >
          <img src="../../assets/images/goodsImg.png" />
          <h4 class="title">{{ item.name }}</h4>
          <p class="description">
            <el-tag size="small" type="danger">特价</el-tag
            >{{ item.description }}
          </p>
          <footer>
            <p class="money__footer--orange">
              <span style="font-size: 0.7rem">￥</span>{{ item.price }}
            </p>
            <el-checkbox v-model="item.isCheck">{{
              item.isCheck ? "取消" : "加入购物车"
            }}</el-checkbox>
          </footer>
        </li>
      </div>
      <div class="main__right--grid">
        <div class="header">
          <p class="integral">购物车信息</p>
          <p class="integral">我的积分:{{ myMoney }}</p>
        </div>
        <div class="popover__container" v-if="cartData.length > 0">
          <li v-for="(item, index) in cartData" :key="index">
            <div class="title">
              <div style="cursor: pointer" @click="handleDelete(item)">
                <svg-icon
                  iconClass="deleteBash"
                  width="18px"
                  height="18px"
                  fill="#f40"
                ></svg-icon>
              </div>
              <p>{{ item.name }}</p>
            </div>
            <p class="money">{{ item.price }}</p>
          </li>
        </div>
        <p v-else>暂无购物信息</p>
      </div>
    </main>
    <button-fix :customHeight="50">
      <div class="flex-btnList">
        <el-button
          size="small"
          icon="el-icon-arrow-left"
          @click="$router.back()"
          >返 回</el-button
        >
        <el-button size="small" type="primary" @click="showAccount"
          >结 账</el-button
        >
      </div>
    </button-fix>
    <!-- 组件弹窗 -->
    <accountCart
      :cartInfo="cartData"
      :dialogVisible.sync="dialogVisible"
      @onSuccess="handleBuy"
    ></accountCart>
  </div>
</template>

<script>
import { getStore, buyGoods } from "@/api/storeManager/index.js";
import accountCart from "./components/accountCart.vue";
import { mapGetters } from "vuex";
export default {
  name: "shopping-class",
  components: {
    accountCart,
  },
  data() {
    return {
      goodsData: [],
      dialogVisible: false,
    };
  },
  methods: {
    initData() {
      getStore().then((res) => {
        const filterArr = res.data.filter((item) => item.type === "teamLead");
        this.goodsData = filterArr.map((el) => {
          return {
            ...el,
            isCheck: false,
          };
        });
      });
    },
    showAccount() {
      if (this.totalMoney > this.myMoney) {
        return this.$message.error("操作失败，您的积分不足，请核对");
      }
      this.dialogVisible = true;
    },
    async handleBuy() {
      try {
        const goodsId = this.cartData.map((goods) => goods.id);
        const { status, message } = await buyGoods(goodsId);
        if (status !== 200) throw new Error(message);
        this.goodsData.forEach((item) => (item.isCheck = false));
        this.$message.success("购买成功！");
      } catch (error) {
        if (
          error instanceof Object &&
          "data" in error &&
          error.data instanceof Object &&
          "message" in error.data &&
          typeof error.data.message === "string"
        ) {
          throw new Error(error.data.message);
        }
        if (
          error instanceof Object &&
          "status" in error &&
          error.status === 500
        ) {
          throw new Error("服务端错误，请联系网站管理员");
        }
        this.$message.error("未知错误，请联系网站管理员");
      }
    },
    handleDelete(item) {
      const row = this.goodsData.find((goods) => goods.id === item.id);
      row.isCheck = false;
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    cartData() {
      return this.goodsData.filter((item) => item.isCheck);
    },
    myMoney() {
      return (
        this.userInfo.money ||
        Number(window.sessionStorage.getItem("money")) ||
        0
      );
    },
    totalMoney() {
      return this.cartData.reduce((pre, next) => pre + next.price, 0);
    },
  },
  created() {
    this.initData();
  },
};
</script>
<style lang="less" scoped>
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
  background: linear-gradient(to right,rgba(255,255,255,0.8),rgba(243, 248, 252, 0.7));
  .main__left--grid {

    display: grid;
    grid-template-columns: 21% 21% 21% 21%;
    gap: 12px;
    align-items: self-start;

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
    padding: 12px;
    min-height: 1920px;
    border-radius: 4px;
    border:1px solid #a8c9f7;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .integral {
        font-size: 14px;
        font-family: "hk";
        color: #4090ef;
      }
    }
  }
}

.popover__container li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 6px;
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    p {
      width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      color: #494949;
    }
  }
  .money {
    color: #f76b38;
    font-size: 14px;
    font-weight: bold;
  }
}

.dash {
  color: #f40;
  cursor: pointer;

  &:hover {
    color: #f76b38;
  }
}
.flex-btnList {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
</style>
