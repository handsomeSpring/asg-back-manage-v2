
<template>
  <el-dialog title="人员选择" :visible="visible" @click="closeDialog">
    <div class="head__content">
      <el-select v-model="role">
        <el-option
          v-for="(item, index) in roleOptions"
          :key="index"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </div>
  </el-dialog>
</template>

<script>
import { getByTitle } from '@/api/config';
export default {
  name: "roleChooseDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    personInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableList: [],
      role: "",
      roleOptions: [],
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
  created(){
    getByTitle('roleList').then(res=>{
        this.roleOptions = res.data;
    })
  },
  methods: {
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="less">
.head__content {
  padding: 12px 0;
  border-bottom: 1px solid #e7e7e7;
}
</style>
