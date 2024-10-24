<template>
  <div>
    <el-scrollbar
      :native="false"
      wrapStyle=""
      wrapClass=""
      viewClass=""
      viewStyle=""
      :noresize="false"
      tag="section"
      style="height: calc(77vh - 46px); margin-bottom: 10px"
    >
      <baseTable :data="tableData" :column="tableProps">
        <template #projectHeader="{ data }">
          <div>
            <span>
              <span class="fontWeight">{{
                new Date(data.comTime) | parseTime("{y}-{m}-{d}")
              }}</span>
            </span>
            <span>
              合作类型：
              <span class="fontWeight">{{ data.comType }}</span>
            </span>
          </div>
          <div>
            <span
              ><i
                class="el-icon-edit"
                style="
                  color: rgb(91, 182, 242);
                  font-size: 16px;
                  cursor: pointer;
                "
                @click="addOrEdit(data)"
              ></i></span>
            <i
              class="el-icon-delete"
              style="color: red; font-size: 16px; cursor: pointer"
              @click="handleDelete(data)"
            ></i>
          </div>
        </template>
        <template #LOGO="{ data }">
          <img class="img-wrap" :src="`${urlApi}${data.orgName}.png`" />
        </template>
        <template #leaderName="{ data }">
          <p class="orgName">{{ data.orgName }}</p>
        </template>
        <template #teamMakeDetail="{ data }">
          {{ data.comMsg }}
        </template>
        <template #tel="{ data }">
          <p>合作负责人姓名：{{ data.headName }}</p>
          <p>负责人联系方式：{{ data.headTel }}</p>
          <p>合作方社交账号：{{ data.account }}</p>
        </template>
      </baseTable>
    </el-scrollbar>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 30, 100]"
      :page-size="listQuery.page_long"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import baseTable from "@/components/baseTable.vue";
export default {
  name: "white",
  components: {
    baseTable,
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    listQuery: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      urlApi: `${window.SERVE_IP}/loge/friend-`,
      tableProps: [
        {
          type: "index",
          label: "序号",
          props: "index",
          style: {
            textAlign: "center",
            minWidth: "80px",
          },
        },
        {
          type: "LOGO",
          label: "合作方LOGO",
          prop: "LOGO",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "120px",
          },
        },
        {
          type: "leaderName",
          label: "合作组织全称",
          prop: "leaderName",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "100px",
          },
        },
        {
          type: "teamMakeDetail",
          label: "合作内容",
          prop: "teamMakeDetail",
          slot: true,
          style: {
            textAlign: "left",
            width: "400px",
          },
        },
        {
          type: "tel",
          label: "合作方社群",
          prop: "tel",
          slot: true,
          style: {
            textAlign: "left",
            minWidth: "250px",
          },
        },
      ],
    };
  },
  computed:{

  },
  methods: {
    // 删除冠军
    handleDelete(data) {
      this.$confirm("此操作将删除该用户名单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$emit("deleteWhite", data.id);
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.$emit("sizechange", val);
    },
    handleCurrentChange(val) {
      this.$emit("pagechange", val);
    },
    addOrEdit(row){
       this.$emit('edit',row)
    },
    priority(degree){
      if(degree<4){
        return 'normal'
      }else if(degree>=4 && degree <8){
        return 'important'
      }else{
        return 'super'
      }
    }
  },
};
</script>

<style scoped lang="less">
.fontWeight {
  font-size: 16px;
  font-weight: bold;
}
.img-wrap {
  height: 60px;
  width: 60px;
}
.orgName {
  font-size: 16px;
  font-weight: bold;
  color: #00ccff;
}
i{
  font-size: 16px;
}
.normal{
  color:brown;
}
.important{
  color:rgb(100, 246, 248);
}
.super{
  color:rgb(251, 239, 134);
}
</style>
