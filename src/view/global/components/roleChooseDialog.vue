<template>
  <el-dialog title="人员选择" :visible="visible" @close="closeDialog" @open="openDialog">
    <div class="head__content">
      <el-select size="small" v-model="role" @change="getList">
        <el-option v-for="(item, index) in roleOptions" :key="index" :value="item.value"
          :label="item.label"></el-option>
      </el-select>
      <div class="operation__btn">
        <el-radio-group v-model="checkInfo.isAllowReturn">
          <el-radio label="1">该节点允许退回</el-radio>
          <el-radio label="0">不允许退回</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-table :data="tableList" height="40vh" v-loading="loading">
      <el-table-column label="选择" width="80px" align="center">
        <template #default="{ row, $index }">
          <el-checkbox v-model="row.isCheck" @input="handleCheck($event, $index, row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" prop="chinaname">
      </el-table-column>
      <el-table-column label="用户id" align="center" prop="id">
      </el-table-column>
    </el-table>
    <p class="choose_name">该节点审批用户：{{ this.checkInfo.chinaname || '未选择' }}</p>
    <el-button size="small" type="primary" @click="handleConfirm">确 认</el-button>
    <el-button size="small" plain @click="closeDialog">关 闭</el-button>
  </el-dialog>
</template>

<script>
import { getByTitle } from '@/api/config';
import { getUserRoles } from '@/api/schedule/index.js';
import { deepClone } from '@/utils';
export default {
  name: "roleChooseDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    personInfo: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      tableList: [],
      role: "",
      roleOptions: [],
      checkInfo: {
        id: '',
        chinaname: '',
        isAllowReturn:''
      },
      loading:false,
    };
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
  created() {
    getByTitle('roleList').then(res => {
      this.roleOptions = res.data.filter(item => Boolean(item.value));
      this.role = this.roleOptions.at(-1).value;
      this.checkInfo = deepClone(this.personInfo);
      this.getList();
    })
  },
  methods: {
    handleConfirm(){
      const {isCheck, ...remain } = this.checkInfo;
      this.$emit('finish',remain);
    },
    handleCheck($event, index, row) {
      if ($event) {
        this.tableList.forEach(item => {
          item.isCheck = false
        });
        this.tableList[index].isCheck = true;
        this.checkInfo = {
          ...this.checkInfo,
          ...row
        };
      } else {
        this.tableList[index].isCheck = false;
        this.checkInfo = {
          ...this.checkInfo,
          id: '',
          chinaname: ''
        }
      }
    },
    closeDialog() {
      this.visible = false;
      this.checkInfo = {
        id: '',
        chinaname: '',
        isAllowReturn:''
      }
    },
    openDialog() {
      this.checkInfo = deepClone(this.personInfo);
      if(this.role){
        this.getList();
      }
    },
    async getList() {
      try {
        this.loading = true;
        if (!this.role) throw new Error('没有选择职位！');
        const { data, status } = await getUserRoles({ opname: this.role });
        if (status !== 200) throw new Error('服务端异常，请联系网站管理员！');
        this.tableList = data.map(item => {
          return {
            id: item.id,
            chinaname: item.chinaname,
            isCheck: this.checkInfo.id === item.id,
          }
        })
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped lang="less">
.head__content {
  padding: 12px 0;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.choose_name{
  color:#4090EF;
  font-weight: 400;
  font-size: 16px;
  margin:6px 0;
  font-family: 'hk';
}
</style>
