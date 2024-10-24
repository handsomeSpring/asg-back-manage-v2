<template>
  <div>
    <el-row>
      <el-col :span="24">
        <all-team @searchteam="search" />
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="60%">
      <el-scrollbar :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section"
        style="height: calc(60vh - 30px); margin-bottom: 10px">
        <div style="margin:10px 0;" v-for="item in teamInfo" :key="item.id">
          <el-tag size="small">{{ item.name }}</el-tag>
          <el-table :data="item.role">
            <el-table-column label="选手名" prop="role_name">
            </el-table-column>
            <el-table-column label="选手ID" prop="role_id">
            </el-table-column>
            <el-table-column label="阵营" prop="role_lin">
            </el-table-column>
            <el-table-column label="历史段位">
              <template #default="{ row }">
                <el-tag type="success" size="small">{{ computedRank(row.historical_Ranks) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="常用角色" prop="common_Roles">
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { searchInfo } from '@/api/enroll/index'
import { getByTitle } from '@/api/config';
const AllTeam = () => import('./component/AllTeam.vue');
export default {
  name: "enrollDialog",
  components: {
    AllTeam
  },
  methods: {
    search(name) {
      this.dialogVisible = true;
      searchInfo(name)
        .then(res => {
          this.teamInfo = res.data
        })
        .catch(() => {
          this.$message.error('未寻找到该战队！')
        })
    },
    computedRank(rank){
      return this.historyRank.find(item => item.value === rank)?.label ?? '未知段位'
    }
  },
  data() {
    return {
      teamInfo: [],
      historyRank:[],
      //加载
      dialogVisible: false,
      title: '搜索战队弹窗'
    }
  },
  created() {
      getByTitle("historyRank").then(({data})=>{
        this.historyRank = data;
      })
  },
};
</script>

<style scoped lang="less">
.el-row {
  margin-bottom: 10px;
}

.el-col {
  margin-right: 10px;
}

.topSearch {
  padding: 10px;
  border-bottom: 1px solid #ddd;

  h3 {
    margin-bottom: 5px;
  }
}

.showTeam {
  li {
    box-sizing: border-box;
    list-style: none;
    width: 100%;
    height: 58px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-around;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
