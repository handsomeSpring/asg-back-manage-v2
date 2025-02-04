<template>
  <div>
    <header>
      <el-select size="small" v-model="chooseType" @change="initStoreList" clearable>
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary"  icon="el-icon-plus" size="small" @click="openDialog('add')">新增商品</el-button>
    </header>
    <div class="asg-table-main">
      <el-table v-loading="loading" border :data="tableData" style="width:100%" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="所需积分" prop="price" width="120px" align="center">
        <template #default="{row}">
          <span>{{ row.price === 0 ? '免费' :row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" prop="description" min-width="240px"></el-table-column>
      <el-table-column label="商品介绍" prop="information" min-width="240px"></el-table-column>
      <el-table-column label="商品分类" prop="type" align="center">
        <template #default="{row}">
          <div class="table__container">
            <p class="my-task-auth margin-icon">
              <i class="el-icon-s-goods"></i> {{ keyMap[row.type] }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="70px" align="center">
        <template #default="{ row }">
            <i class="el-icon-edit" style="
                  color: rgb(91, 182, 242);
                  font-size: 16px;
                  cursor: pointer;
                  margin-right: 24px;
                " @click="openDialog('edit', row)"
            ></i>
            <i class="el-icon-delete" style="color: red; font-size: 16px; cursor: pointer"
            @click="deleteItem(row.id)"></i>
        </template>
      </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input size="small" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品类型" prop="type">
              <el-select size="small" v-model="form.type">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品价格" prop="price">
          <asg-money-input size="small" v-model="form.price"> </asg-money-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input size="small" v-model="form.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="商品信息" prop="information">
          <el-input size="small" v-model="form.information" type="textarea" :rows="3"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addNew, getStore, editGoods, deleteItem } from "@/api/storeManager/index";
import { getByTitle } from "@/api/config";
import { deepClone } from "@/utils";
import AsgMoneyInput from "@/components/AsgMoneyInput.vue";
export default {
  name: 'storeManager',
  components:{
    AsgMoneyInput
  },
  data() {
    return {
      type: '',
      title: '',
      dialogVisible: false,
      chooseType:"",
      form: {},
      saveUrl: {
        'add': addNew,
        'edit': editGoods
      },
      tableData: [],
      typeOptions: [],
      keyMap:{},
      rules:{
        name:{required:true,message:'请输入商品名称',trigger:'blur'},
        type:{required:true,message:'请选择商品类型',trigger:'change'},
        price:{required:true,message:'请输入价格',trigger:'blur'},
        description:{required:true,message:'请输入商品描述',trigger:'blur'},
        information:{required:true,message:'请输入商品介绍',trigger:'blur'},
      }
    };
  },
  created() {
    this.initStoreList();
    this.initGoodsType();
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    openDialog(type, row = {}) {
      this.type = type;
      this.form = deepClone(row);
      this.title = type === 'add' ? '新增商品' : '编辑商品';
      this.dialogVisible = true;
    },
    async handleSave() {
      try {
        const result = await this.$refs.form.validate();
        if(!result){
          return this.$message.error('请完整填写商品表单');
        }
        const postParams = this.form;
        if ('buyer' in postParams) {
          Reflect.deleteProperty(postParams, 'buyer');
        }
        const { status, message } = await this.saveUrl[this.type](postParams);
        if (status !== 200) throw new Error(message);
        this.$message.success(`${this.type === 'add' ? '新增' : '变更'}成功！`);
        this.initStoreList();
      } catch (error) {
        if (
          error instanceof Object
          && 'response' in error
          && error.response instanceof Object
          && 'data' in error.response
          && !!error.response.data
        ) {
          return this.$message.error(error.response.data.message);
        }
        this.$message.error('服务端异常，请联系网站管理员');
      } finally {
        this.dialogVisible = false;
      }
    },
    async initStoreList() {
      this.loading = true;
      try {
        const { data, message, status } = await getStore();
        if (status !== 200) throw new Error(message);
        this.tableData = !this.chooseType ? data : data.filter(item => item.type === this.chooseType);
      } catch (error) {
        this.$message.error(error instanceof error ? error.response.data.message : error);
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(id) {
      try {
        const { status, message } = await deleteItem(id);
        if (status !== 200) throw new Error(message);
        this.$message.success('删除成功');
        this.initStoreList();
      } catch (error) {
        if (
          error instanceof Object
          && 'response' in error
          && error.response instanceof Object
          && 'data' in error.response
          && !!error.response.data
        ) {
          return this.$message.error(error.response.data.message);
        }
        this.$message.error('服务端异常，请联系网站管理员');
      }
    },
    initGoodsType() {
      getByTitle("goodsType")
        .then((res) => {
          this.typeOptions = res.data;
          const keyMap = {};
          const keys = res.data.map(el => el.value);
          for (const key of keys) {
            keyMap[key] = res.data.find(item => item.value === key).label;
          }
          this.keyMap = keyMap;
        })
        .catch((err) => {
          this.$message.error("云端配置未配置该参数goodsType！");
        });
    }
  },
}
</script>
<style lang='less' scoped>
header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 12px 0;
}
.table__container{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>