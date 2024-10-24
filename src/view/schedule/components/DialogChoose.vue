<template>
  <div>
    <el-dialog
      title="选择战队"
      width="60%"
      :visible="showChoose"
      @close="close"
      top="5vh"
    >
    <div style="display:flex;justify-content:space-between">
      <div>
      <el-select style="margin-bottom:10px" v-model="tag" size = "small" clearable placeholder="请输入赛程标签">
        <el-option
          v-for="(item, index) in tagOptions"
          :key="index"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
      <el-tag style="margin:0 20px;" v-if="tag">{{ tag }}</el-tag>
    </div>
      <div>已选取人数：<span style="color:#f11;font-size:16px;font-weight:bold">{{ selectedData.length }}</span></div>
    </div>
      <el-table
        loading="loading"
        ref="multipleTable"
        :data="tableData"
        border
        height="500"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <el-table-column
          reserve-selection
          width="55"
          align="center"
          type="selection"
        >
        </el-table-column>
        <el-table-column label="LOGO" align="center" prop="name">
          <template #default="{row}">
            <img class="img-warp" :src="`${serveIp}/loge/${eventName}/${row.team_name}.png`" />
          </template>
        </el-table-column>
        <el-table-column label="战队名" prop="team_name" align="center">
        </el-table-column>
        <el-table-column label="队长联系方式" prop="team_tel" align="center">
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 20px">
        <el-button size="small" plain @click="ballot"><i class="el-icon-refresh"></i>抽取</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPlayerDetails } from "@/api/gameSeason/index";
import { ballotSchedule } from "@/api/schedule/index";
export default {
  name: "DialogChoose",
  props: {
    showChoose: {
      type: Boolean,
      default: false,
    },
    eventName: {
      type: String,
      default: "",
    },
    tagOptions:{
      type:Array,
      default:(()=>[])
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      selectedData: [],
      tag: "",
    };
  },
  watch: {
    eventName: {
      immediate:true,
      handler(newValue) {
        getPlayerDetails(newValue).then((res) => {
          if (res.status === 200) {
            this.tableData = res.data;
          }
        });
      },
    },
  },
  computed:{
    serveIp(){
      return window.SERVE_IP
    }
  },
  methods: {
    close() {
      this.$emit("update:showChoose", false);
      this.$refs.multipleTable.clearSelection();
      this.selectedData = [];
    },
    handleSelectionChange(val) {
      this.selectedData = val;
    },
    handleSelectAll(selection){
      this.selectedData = selection
    },
    ballot() {
      this.$confirm("此操作抽取赛程，不可更改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.selectedData.length === 0 ||this.selectedData.length % 2 !== 0)
          return this.$message.error("请选择至少两个战队并且选择战队数量是双数");
        if(!this.tag){
          return this.$message.error("请选择抽签所属赛标...总决赛/八强赛等");
        }
        const Ids = this.selectedData.map((item) => item.id);
        ballotSchedule(this.tag, Ids).then((res) => {
          if (res.status === 200) {
            this.$message.success("抽取成功！");
            this.close();
            this.$emit("refresh");
          }
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
.img-warp {
  width: 50px;
  height: 50px;
}
</style>
