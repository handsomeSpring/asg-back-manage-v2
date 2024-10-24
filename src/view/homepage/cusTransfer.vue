<!--
* @Description: 工作台添加自定义穿梭框
* @Version: v1.0
* @Author: fangyunong
* @Date: 2023-12-12 16:46:48
* @LastEditors: Please set LastEditors
* @LastEditTime: 2023-12-12 16:46:48
-->
<template>
  <div class="big-wrap">
    <div class="item-box">
      <header>
        <p class="title">选择功能</p>
        <el-input placeholder="请输入" v-model="keyword">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleQuery"></i>
        </el-input>
      </header>
      <div class="table-wrap">
        <el-table ref="leftTable" :data="queryNoSelected" height="400px" style="width:100%" row-key="id" @selection-change="handleLeftSelect">
          <el-table-column type="selection" width="50px" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column label="功能" align="left" prop="title"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="arrow-flex">
      <el-button block size="small" icon="el-icon-arrow-right" type="primary" @click="handleLtoR"></el-button>
      <el-button block size="small" icon="el-icon-arrow-left" type="primary" @click="handleLRtoL"></el-button>
    </div>
    <div class="item-box">
      <header>
        <p class="title">已添加列表</p>
        <div class="tag">
          <i class="el-icon-info icon-color"></i>
          已添加
          <span class="icon-color">{{ querySelected.length }}</span>
        </div>
      </header>
      <div class="table-wrap">
        <el-table ref="tableRef" :data="querySelected" style="width:100%" height="400" row-key="id" @selection-change="handleRightSelect">
          <el-table-column type="selection" width="50px" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column label="功能" align="left">
            <template #default="{row}">
              <span>{{row.title}}</span>
              <span style="float:right"><i class="el-icon-s-operation"></i></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { transferData } from "@/view/homepage/transferData.js";
import { menuOptions } from "@/assets/json/menu";
export default {
  name: "cusTransfer",
  props: {
    // 已添加的数组对象
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      queryNoSelected: [], //查询出来的所有数据
      querySelected: [], //已添加到列表的所有数据
      leftSelected: [], //左侧选择的数据
      rightSelected: [], //右侧选择的数据
      keyword: "" //关键字
    };
  },
  created() {
    menuOptions.forEach(item => {
      if(item.children && item.children.length > 0){
        this.queryNoSelected = this.queryNoSelected.concat(item.children);
      }
    })
    this.querySelected = JSON.parse(localStorage.getItem("asgshortcut-v2") || "[]");
  },
  mounted() {
    this.setCheckedRows();
  },
  methods: {
    handleQuery() {
      this.queryNoSelected = transferData.filter(el => el["name"].indexOf(this.keyword) !== -1);
    },
    handleLeftSelect(leftSelected) {
      this.leftSelected = leftSelected;
    },
    handleRightSelect(rightSelected) {
      this.rightSelected = rightSelected;
    },
    // 处理左到右
    handleLtoR() {
      const ids = this.querySelected.map(item => item.id);
      this.leftSelected.forEach(select => {
        if (ids.includes(select.id)) {
          return;
        } else {
          this.querySelected.push(select);
        }
      });
    },
    handleLRtoL() {
      const ids = this.rightSelected.map(item => item.id);
      this.querySelected = this.querySelected.filter(right => !ids.includes(right.id));
      this.setCheckedRows();
    },

    save() {
      localStorage.setItem("asgshortcut-v2", JSON.stringify(this.querySelected));
      return this.querySelected;
    },
    // 回显已勾选的数据
    setCheckedRows() {
      if (!this.$refs.leftTable) {
        return;
      }
      this.$refs.leftTable.clearSelection();
      this.queryNoSelected.forEach(item => {
        if (this.querySelected.length === 0) {
          this.$refs.leftTable.clearSelection();
        } else {
          this.querySelected.forEach(el => {
            if (item.id === el.id) {
              this.$refs.leftTable.toggleRowSelection(item, true);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.big-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-box {
  width: 40%;
  border: 1px solid #e7e7e7;
}
header {
  padding: 12px;
}
.arrow-flex {
  display: flex;
  gap: 20px;
  justify-items: center;
  align-items: center;
  flex-direction: column;
}
.title {
  padding-left: 5px;
  border-left: 3px solid #147aff;
  color: #147aff;
  font-size: 12px;
  margin-bottom: 12px;
}
.tag {
  background-color: #ebf3ff;
  border: 1px solid #bfdbff;
  border-radius: 3px;
  padding: 6px 12px;
  .icon-color {
    margin: 0 3px;
    color: #147aff;
    font-weight: bold;
  }
}
.table-wrap {
  min-height: 370px;
}
::v-deep.el-button + .el-button {
  margin: 0 5px;
}
</style>
