<template>
  <span>
    <table v-if="!isMobile">
      <thead>
        <th width="20%">任务标题</th>
        <th width="50%">任务描述</th>
        <th width="10%">任务积分</th>
        <th width="10%">优先级</th>
        <th width="10%">完成状态</th>
      </thead>
      <tbody>
        <template v-if="taskList.length > 0">
          <tr v-for="(item, index) in taskList" :key="index">
            <td width="200">
              <el-tooltip class="item" effect="dark" :content="item.taskName" placement="top-start">
                <p class="ellipse">{{ item.taskName }}</p>
              </el-tooltip>
            </td>
            <td width="auto">
              <p class="multi__line" @click="upfoldItem">
                {{ item.taskDescription }}
              </p>
            </td>
            <td align="center" width="100">{{ item.money }}</td>
            <td align="center" width="100">
              <span class="circle_list" :class="`level-${item.priority}`">{{
                item.priority | filterPriority
              }}</span>
            </td>
            <td align="center" width="100">
              <el-tag size="small" :type="computedType(item.status)">
                {{ item.status | filterStatus }}
              </el-tag>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr align="center">
            <td width="20%" class="no__task" colspan="5">暂无任务</td>
          </tr>
        </template>
      </tbody>
    </table>
    <mobileTable v-else :table-data="taskList" :table-props="tableProps" :skeLoading="skeyLoading" minHeight="20vh">
      <template #priority="{ row }">
        <span class="circle_list" :class="`level-${row.priority}`">{{
          row.priority | filterPriority
        }}</span>
      </template>
      <template #status="{ row }">
        <el-tag size="small" :type="computedType(row.status)">
          {{ row.status | filterStatus }}
        </el-tag>
      </template>
    </mobileTable>
  </span>

</template>

<script>
import { getTask } from "@/api/admin/index.js";
import { isMobile } from "@/utils";
import mobileTable from "@/components/mobile/mobileTable.vue";
export default {
  name: "TaskDetails",
  components: {
    mobileTable
  },
  props: {
    user: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      taskList: [],
      isMobile: false,
      skeyLoading:false,
      tableProps: [{
        label: '序号',
        type: 'index'
      },
      {
        label: '任务标题',
        prop: 'taskName',
        type: 'prop'
      },
      {
        label: '任务描述',
        prop: 'taskDescription',
        type: 'prop'
      },
      {
        label: '任务积分',
        prop: 'money',
        type: 'prop'
      },
      {
        label: '优先级',
        prop: 'priority',
        type: 'slot'
      },
      {
        label: '完成状态',
        prop: 'status',
        type: 'slot'
      }
      ]
    };
  },
  filters: {
    filterStatus(val) {
      if (val === "0") {
        return "进行中";
      } else if (val === "1") {
        return "待审核";
      } else if (val === "2") {
        return "已完成";
      } else if (val === "3") {
        return "未通过";
      }
    },
    filterPriority(val) {
      const mapList = {
        0: "不急",
        1: "轻微",
        2: "一般",
        3: "紧需",
        4: "致命",
      };
      return mapList[val];
    },
  },
  watch: {
    "user.id": {
      handler(newVal) {
        this.initTask(newVal);
      },
    },
  },
  created() {
    this.isMobile = isMobile();
    this.initTask(this.user.id);
  },
  methods: {
    computedType(status) {
      if (status === "0") {
        return "info";
      } else if (status === "1") {
        return "warning";
      } else if (status === "2") {
        return "success";
      } else if (status === "3") {
        return "danger";
      }
    },
    async initTask(id) {
      try {
        this.skeyLoading = true;
        const { data, status, message } = await getTask(id);
        if (status !== 200) throw new Error(message);
        this.taskList = data;
      } catch (error) {
        this.$message.error(error.message);
      }finally{
        this.$nextTick(()=>{
          this.skeyLoading = false;
        })
      }
    },
    upfoldItem($event) {
      const dom = $event.target;
      console.log(dom, "dom");
      if (dom.classList.contains("multi__line")) {
        dom.classList.remove("multi__line");
      } else {
        dom.classList.add("multi__line");
      }
    },
  },
};
</script>
<style lang="less" scoped>
@borderColor: #e9e9e8;
@bgColor: #f2f6fd;

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid @borderColor;
  background: #fff;

  thead {
    background: linear-gradient(270deg, #4171F7 0%, #5095FA 100%);

    th {
      padding: 8px 0;
      font-size: 14px;
      color: #fff;
    }
  }

  tbody {
    tr {
      height: 50px;

      td {
        padding: 6px;
        border: 1px solid @borderColor;
        cursor: pointer;
        font-size: 15px;

        .ellipse {
          width: inherit;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .multi__line {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .no__task {
    font-size: 0.8rem;
    color: #717171;
  }
}

.circle_list {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 10px;

  &.level-0 {
    color: #cddc39;
    border: 1px solid #cddc39;
  }

  &.level-1 {
    color: #8bc34a;
    border: 1px solid #8bc34a;
  }

  &.level-2 {
    color: #fdd835;
    border: 1px solid #fdd835;
  }

  &.level-3 {
    color: #ff8f00;
    border: 1px solid #ff8f00;
  }

  &.level-4 {
    color: #c62828;
    border: 1px solid #c62828;
  }
}
</style>
