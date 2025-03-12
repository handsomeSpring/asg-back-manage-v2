<template>
  <div>
    <AsgHighSearch>
      <template #top>
        <div>
          <div class="itemlist">
            <div class="item-row" :class="activeName === '1' ? 'active' : ''" @click="handleClick('1')">官网用户管理</div>
            <div class="item-row" :class="activeName === '2' ? 'active' : ''" @click="handleClick('2')">解说人员管理</div>
            <div class="item-row" :class="activeName === '3' ? 'active' : ''" @click="handleClick('3')">裁判人员管理</div>
            <div class="item-row" :class="activeName === '4' ? 'active' : ''" @click="handleClick('4')">导播人员管理</div>
          </div>
        </div>
      </template>
      <template #search>
        <template v-if="activeName === '1'">
          <el-input style="margin-right:12px" size="small" v-model="keyword" clearable
            placeholder="请输入用户名/中文名进行搜索">
          </el-input>
          <el-select v-model="officium" size="small" placeholder="请选择职位进行检索">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="(role, index) in roleOptions" :key="index" :label="role.label"
              :value="role.value"></el-option>
          </el-select>
        </template>
      </template>
      <template #btnList>
        <el-button size="small" type="primary" v-show="activeName === '1'" @click="initGetUsers" icon="el-icon-search">查询</el-button>
        <el-button size="small" type="primary" v-show="activeName !== '1'" @click="refreshData" icon="el-icon-search">刷新</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </template>
    </AsgHighSearch>
    <Suvivors ref="survivors" v-if="activeName === '1'" :keyword="keyword" :officium="officium"></Suvivors>
    <rolePersonMange v-if="activeName !== '1'" :loading="loading" :tableData="tableData" @refresh="refreshData" :activeName="activeName">
    </rolePersonMange>
  </div>
</template>

<script>
import AsgHighSearch from '@/components/AsgHighSearch.vue';
import Suvivors from './components/suvivors.vue';
import rolePersonMange from './components/rolePersonMange.vue';
import { getUserRoles } from "@/api/schedule/index";
import { getByTitle } from '@/api/config';
export default {
  name: 'user-manager',
  components: {
    AsgHighSearch,
    Suvivors,
    rolePersonMange
  },
  data() {
    return {
      keyword: "",
      officium: "",
      roleOptions: [],
      tableData: [],
      activeName: '1',
      loading:false,
    }
  },
  async created() {
    const result = await getByTitle('roleList');
    this.roleOptions = result.data.filter(item => Boolean(item.value));
  },
  methods: {
    resetForm() {
      this.keyword = '';
      this.officium = '';
      this.activeName = '1';
    },
    initGetUsers() {
      this.$refs.survivors?.initGetUsers(true);
    },
    handleClick(active) {
      this.activeName = active;
      if (active !== '1') {
        const mapList = {
          '2': "Commentator",
          '3': 'Judge',
          '4': 'Anchor',
        }
        this.initData(mapList[active]);
      }
    },
    // 刷新解说、裁判、导播列表
    refreshData(){
      const mapList = {
          '2': "Commentator",
          '3': 'Judge',
          '4': 'Anchor',
        }
        this.initData(mapList[this.activeName]);
    },
    async initData(role) {
      try {
        this.loading = true;
        const { data, status } = await getUserRoles({ opname: role });
        if (status !== 200) throw new Error('获取失败');
        this.tableData = data;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped lang="less">
.itemlist {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  margin: 1em 0 0;

  .item-row {
    border-radius: 4px;
    border: 1px solid #e7e7e7;
    padding: 0.3em 0.7em;
    cursor: pointer;
    font-size: 13px;
    font-weight: 400;
    color: #494949;
    transition: .27s all;

    &:hover {
      background: #ecf5ff;
      border-color: #c6e2ff;
    }

    &.active {
      background: #4090EF;
      color: #fff;
    }
  }
}
</style>
