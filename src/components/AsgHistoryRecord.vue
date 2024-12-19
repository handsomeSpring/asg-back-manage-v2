<!-- ASG流程跟踪组件 -->
<template>
  <el-dialog
    :visible="visible"
    title="流程跟踪"
    width="50%"
    append-to-body
    :fullscreen="isMobile"
    @close="handleClose"
  >
    <el-table :data="tableData" border>
      <el-table-column
        label="人员信息"
        prop="person"
        :width="isMobile ? '120px' : '180px'"
        align="center"
      ></el-table-column>
      <el-table-column label="节点动态" align="center" >
        <template #default="{ row }">
          <span
            :style="{
              color: computedText(row.choose),
            }"
            >{{ row.choose | filterChoose }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间"
        prop="time"
        align="center"
        width="auto"
      ></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { isMobile } from '@/utils';
export default {
  name: "AsgHistoryRecord",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data(){
    return {
      isMobile:false,
    }
  },
  created(){
    this.isMobile = isMobile();
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  filters: {
    filterChoose(val) {
      const mapList = {
        '0': "发起",
        '1': "同意",
        '2': "不同意/退回",
        '3': "办结",
        '4': '办结-同意申请',
        '5': '办结-驳回申请',
        '6': "终止申请"
      };
      return mapList[val];
    },
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    computedText(choose) {
      const mapList = {
        '0': "#1E87E3",
        '1': "#429F46",
        '2': "#FF3C00",
        '3': "#1E87E3",
        '4': "#429F46",
        '5': "#FF3C00",
        '6': "#FF3C00",
      };
      return mapList[choose];
    },
  },
};
</script>
