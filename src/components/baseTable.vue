<!-- eslint-disable vue/require-v-for-key -->
<template>
  <table :key="reload" class="tl-el-table-list">
    <thead>
      <tr class="tl-el-table-list_title">
        <th v-for="item in column" :style="[item.style, { textAlign: 'center' }]">{{ item.label }}</th>
      </tr>
    </thead>
    <tbody class="tl-el-table-list_tbody">
      <tr v-if="!data.length">
        <td :colspan="column.length">
          <div class="data-empty">
            暂无数据
          </div>
        </td>
      </tr>
      <template v-else v-for="(item, index) of data">
        <tr>
          <td>
            <div style="height: 20px;"></div>
          </td>
        </tr>
        <tr :class="{ 'is-hover': hoverIndex === index}" @mouseover="hoverIndex = index" @mouseleave="hoverIndex = null">
          <td :colspan="column.length" class="project-header__border">
            <div class="project-head">
              <slot name="projectHeader" :data="item"></slot>
            </div>
          </td>
        </tr>
        <template v-if="isNested">
          <tr v-for="(child, idx) of item.goodsList || item.goods || []" :key="child.id || idx"
              @mouseover="hoverIndex = index" @mouseleave="hoverIndex = null">
            <td v-for="subItem in column" class="project-content__border">
              <div v-if="subItem.slot" class="project-content" :style="subItem.style">
                <slot :name="subItem.prop" :data="child"></slot>
              </div>
              <div v-else :style="subItem.style" class="project-content">
                <div v-if="subItem.type === 'index'">{{ idx + 1 }}</div>
                <div v-else-if="subItem.type === 'projInfo'">
                  <p>预算项目名称：{{ child.budgetName }}</p>
                  <p>资金性质：{{ child.fundSourceName }}</p>
                  <p>指标类型：{{ child.budgetIndexName }}</p>
                  <p>指标管理处室：{{ child.indexManageOfficeName }}</p>
                </div>
                <div v-else-if="subItem.type === 'goodsInfo'">
                  <p>预算金额：{{ child.initialBudget }}</p>
                  <p>数量(单位)：{{ child.quantity }}({{ child.unit }})</p>
                  <p>单价(元)：{{ child.unitPrice }}</p>
                  <p>采购品目：{{ child.catalogCode || "" }}{{ child.catalogName || "" }}</p>
                </div>
                <div v-else-if="subItem.type === 'plan'">
                  <p>项目名称：{{ child.planName }}</p>
                  <p>涉及进口：{{ child.hasImportedProduct === "1" ? "是" : "否" }}</p>
                  <p>采购分类：{{ child.projTypeName }}</p>
                  <p>备注：{{ child.remarks }}</p>
                </div>
                <div v-else-if="subItem.type === 'purchaseImplType'">
                  <p>{{ child.implFormName }}</p>
                </div>
                <div v-else-if="subItem.type === 'budgetMoney'">
                  <p>{{ child.planTotal | moneyFormat }}</p>
                </div>
                <div v-else>
                  {{ child[subItem.prop] }}
                </div>
              </div>
            </td>
          </tr>
        </template>
        <tr v-else
            @mouseover="hoverIndex = index" @mouseleave="hoverIndex = null">
          <td v-for="subItem in column" class="project-content__border">
            <div v-if="subItem.slot" class="project-content" :style="subItem.style">
              <slot :name="subItem.prop" :data="item"></slot>
            </div>
            <div v-else :style="subItem.style" class="project-content">
              <div v-if="subItem.type === 'index'">{{ index + 1 }}</div>
              <div v-else-if="subItem.type === 'projInfo'">
                <p>预算项目名称：{{ item.budgetName }}</p>
                <p>资金性质：{{ item.fundSourceName }}</p>
                <p>指标类型：{{ item.budgetIndexName }}</p>
                <p>指标管理处室：{{ item.indexManageOfficeName }}</p>
              </div>
              <div v-else-if="subItem.type === 'biddingInfo'">
                <p>项目名称：{{ item.budgetName }}</p>
                <div class="bidding-info-item">
                  <p>采购分类：{{ item.fundSourceName }}</p>
                  <p>实施形式：{{ item.indexManageOfficeName }}</p>
                </div>
                <div class="bidding-info-item">
                  <p>组织形式：{{ item.budgetIndexName }}</p>
                  <p>拟采用采购方式：{{ item.indexManageOfficeName }}</p>
                </div>
              </div>
              <div v-else-if="subItem.type === 'goodsInfo'">
                <p>预算金额(元)：{{ item.initialBudget | moneyFormat }}</p>
                <p>数量(单位)：{{ item.quantity }}({{ item.unit }})</p>
                <p>单价(元)：{{ item.unitPrice | moneyFormat }}</p>
                <p>采购品目：{{ item.catalogCode || "" }}-{{ item.catalogName || "" }}</p>
              </div>
              <div v-else-if="subItem.type === 'biddingContent'">
                <el-popover placement="bottom" trigger="click">
                  <el-table>
                    <el-table-column label="序号" width="50"></el-table-column>
                    <el-table-column label="采购内容" width="150"></el-table-column>
                    <el-table-column label="计量单位" width="150"></el-table-column>
                    <el-table-column label="价格(元)" width="150"></el-table-column>
                  </el-table>
                  <span slot="reference" class="bidding-content">
                    <p>共{{ 1 }}项</p>
                  </span>
                </el-popover>
              </div>
              <div v-else-if="subItem.type === 'plan'">
                <p>项目名称：{{ item.planName }}</p>
                <p>涉及进口：{{ item.hasImportedProduct === "1" ? "是" : "否" }}</p>
                <p>采购分类：{{ item.projTypeName }}</p>
                <p>备注：{{ item.remarks }}</p>
              </div>
              <div v-else-if="subItem.type === 'purchaseImplType'">
                <p>{{ item.implFormName }}</p>
              </div>
              <div v-else-if="subItem.type === 'budgetMoney'">
                <p>{{ item.planTotal | moneyFormat }}</p>
              </div>
              <div v-else-if="subItem.type === 'contractDetails'">
                <p>合同名称：{{ item.business.contractName }}</p>
                <p>合同金额(元)：{{ item.business.totalContractAmount || 0 }}</p>
                <p>已支付金额(元)：{{ item.business.payAmountTotal || 0 }}</p>
                <p>合同签订日期：{{ item.business.signDate ? item.business.signDate.split(" ")[0] : "" }}</p>
              </div>
              <div v-else-if="subItem.type === 'performanceAcceptanceStatus'">
                <p>本次验收金额(元)：{{ item.business.acceptanceMoney || 0 }}</p>
                <p>验收日期：{{ item.business.acceptanceDate ? item.business.acceptanceDate.split(" ")[0] : "" }}</p>
                <p>验收结论：{{ item.business.acceptanceResultTeam }}</p>
              </div>
              <div v-else-if="subItem.type === 'supplierInfo'">
                <p>{{ item.business.supplierName }}</p>
              </div>
              <div v-else-if="subItem.type === 'contractDetailList'" class="flex-item">
                <div>
                  <p>合同名称：{{ item.business.contractName }}</p>
                  <p>合同备案编号：{{ item.business.contractFilingNo }}</p>
                  <p>合同金额(元)：{{ item.business.totalContractAmount }}</p>
                </div>
                <div>
                  <p>备案日期：{{ item.business.filingDate ? item.business.filingDate.split(" ")[0] : '' }}</p>
                  <p>收款方：{{ item.business.supplierName }}</p>
                </div>
              </div>
              <div v-else-if="subItem.type === 'historyPayInfo'">
                <p>已支付金额(元)：{{ item.business.payAmountTotal }}</p>
                <p>已支付笔数：{{ item.business.payNum }}笔</p>
                <p>已支付比例：{{ (Number(item.business.payAmountTotalProportion) * 100).toFixed(2) }}%</p>
              </div>
              <div v-else-if="subItem.type === 'payInfo'">
                <p>本次支付金额(元)：{{ item.business.payAmount }}</p>
                <p>本次支付比例：{{ (Number(item.business.payAmountProportion) * 100).toFixed(2) }}%</p>
              </div>
              <div v-else>
                {{ item[subItem.prop] }}
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "BaseTable",
  props: {
    column: {
      required: true,
      type: Array,
      default: () => []
    },
    data: {
      required: true,
      type: Array,
      default: () => []
    },
    isNested: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hoverIndex: null,
      reload: new Date().getTime(),
      showBiddingContentDialog: false
    };
  },
  computed: {
    tableData() {
      const { column, data } = this;
      return {
        column,
        data
      };
    }
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler() {
        this.reload = new Date().getTime();
      }
    }
  }
};
</script>

<style lang="less" scoped>
table {
  width: 100%;
  border-spacing: 0;
  font-size: 14px;

  tr th {
    background: #f2f6fd;
    padding: 12px 0;
    border: 1px solid #fafafa;
  }
  tr th:first-child {
    width: 50px;
  }
}
.project-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 28px;
  background: #f1f1f1;
  &:hover{
    background: #f2f6fd;
  }
  div > span {
    margin-right: 15px;
  }
}
.project-header__border {
  border: 1px solid #eee;
}

.project-content {
  padding: 12px;
  div {
    padding: 5px 0;
  }
}
.project-content__border {
  border: 1px solid #eee;
  border-top: transparent;
  border-left: transparent;
}
.project-content__border:first-child {
  border-left: 1px solid #eee;
}

.data-empty {
  padding: 30px 0;
  border: 1px solid #fafafa;
  border-top: transparent;
  text-align: center;
  color: #aaa;
}

.bidding-info-item {
  display: flex;
  p {
    width: 50%;
  }
}

.bidding-content {
  text-align: center;
  cursor: pointer;
  color: #0e82e5;
  text-decoration: underline;
}

.flex-item {
  display: flex;
  justify-content: space-between;
  & > div {
    width: 45%;
  }
}
</style>
