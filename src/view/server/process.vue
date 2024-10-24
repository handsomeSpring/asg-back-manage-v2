<template>
  <div>
    <el-table :data="inPageData">
      <el-table-column label="进程ID" width="120" prop="id"></el-table-column>
      <el-table-column label="进程名" prop="processName"></el-table-column>
      <el-table-column label="内存占用" width="220">
        <template #default="{ row }">
          <el-progress
            :percentage="handleComputed(row.workingSet64)"
            :color="customColors"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template #default="{ row }">
          <el-button size="small" type="text" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="center">
      <i ref="loading" class="el-icon-loading"></i>加载中......
    </div>
  </div>
</template>

<script>
import { getProcess, closeProcess } from "@/api/server/index.js";
export default {
  name: "process",
  data() {
    return {
      allProcess: [],
      inPageData: [],
      observe: null,
      customColors: [
        { color: "#6cf587", percentage: 20 },
        { color: "#9ae63c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#ecb023", percentage: 80 },
        { color: "#fa351b", percentage: 100 },
      ],
    };
  },
  async mounted() {
    const { data } = await getProcess();
    this.allProcess = data;
    this.observe = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting) {
        if (this.inPageData.length >= this.allProcess.length) {
          return;
        }
        const sliceArr = this.allProcess.slice(
          this.inPageData.length,
          this.inPageData.length + 20
        );
        setTimeout(() => {
          sliceArr.forEach((ele) => {
            this.inPageData.push(ele);
          });
          this.$nextTick(() => {
            const dom = document.querySelector(".el-scrollbar__wrap");
            dom.scrollBy({ top: -300, behavior: "smooth" });
          });
          // 再次开启监听，以防用户的加载停留在页面中，但是无法触发intersectionObserver
          const loading = this.$refs.loading;
          this.observe.observe(loading);
        }, 1000);
      }
    });
    const loading = this.$refs.loading;
    this.observe.observe(loading);
  },
  beforeDestroy() {
    this.observe.disconnect();
  },
  methods: {
    initProcess() {
      getProcess()
        .then((res) => {
          this.allProcess = Object.freeze(res.data);
          this.$nextTick(() => {
            const loading = this.$refs.loading;
            this.observe.observe(loading);
          });
        })
        .catch(() => {
          this.$message.error("你没有权限！");
        });
    },
    handleComputed(set) {
      return +(set / 4194304).toFixed(1);
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          closeProcess(id).then(() => {
            this.$message.success("关闭成功！");
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
.center {
  text-align: center;
  color: #d7d7d7;
}
</style>
