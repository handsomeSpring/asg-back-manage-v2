<template>
    <div class="main-table">
        <header>
            <p>
                <span style="color:#4090EF">总贡献率：{{ contributionCount }}%</span>
                <span style="color:#F40">（请准确核实贡献率，赛事组计算工资会用到！）</span>
            </p>
            <el-button size="small" type="primary" @click="openDialog('add', -1, {})">新增人员</el-button>
        </header>
        <el-table :data="propTableData" border stripe :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <el-table-column label="序号" type="index" width="60%" align="center"></el-table-column>
            <el-table-column label="成员名称" prop="name" align="center"></el-table-column>
            <el-table-column label="赛季职责" prop="role" align="center"></el-table-column>
            <el-table-column label="贡献占比" prop="contribution" align="center">
                <template #default="{ row }">
                    {{ row.contribution }}%
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row, $index }">
                    <el-button type="text" @click="openDialog('edit', $index, row)">更新</el-button>
                    <el-button type="text" @click="deleteItem($index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" :title="title" :close-on-click-modal="false" width="30%">
            <el-form ref="form" :model="form" label-position="right" label-width="100px" :rules="rules">
                <el-form-item label="人员名称" prop="name">
                    <el-input size="small" v-model="form.name" placeholder="请输入成员名称"></el-input>
                </el-form-item>
                <el-form-item label="人员职责" prop="role">
                    <el-input size="small" v-model="form.role" placeholder="请输入角色职位"></el-input>
                </el-form-item>
                <el-form-item label="人员贡献率" prop="contribution">
                    <el-input-number size="small" v-model="form.contribution" :min="1" :max="100"
                        label="请填写贡献率"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" type="primary" @click="updateTable">{{ editIndex === -1 ? '新增' : '更新'
                    }}</el-button>
                <el-button size="small" plain @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { deepClone } from '@/utils';
export default {
    name: 'person-table',
    props: {
        tableData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogVisible: false,
            editIndex: -1,
            title: '新增人员',
            form: {
                name: '',
                role: '',
                contribution: 1,
            },
            rules: {
                name: [{ required: true, message: "请输入人员名称", trigger: "blur" }],
                role: [{ required: true, message: "请输入人员职责", trigger: "blur" }],
                contribution: [
                    { required: true, message: "请输入人员贡献率", trigger: "change" },
                ],
            }
        }
    },
    computed: {
        contributionCount(){
            return this.propTableData.reduce((pre, next)=> pre + Number(next.contribution),0)
        },
        propTableData: {
            get() {
                return this.tableData;
            },
            set(val) {
                console.log(val, 'val');
                this.$emit('update:tableData', val);
            },
        }
    },
    methods: {
        openDialog(type, index, row) {
            this.title = type === 'add' ? '新增人员信息' : '更新人员信息';
            this.editIndex = index;
            if (type === 'edit') {
                this.form = deepClone(row);
            }
            this.dialogVisible = true;
        },
        updateTable() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const remainCount = this.propTableData.reduce((pre, next)=> pre + Number(next.contribution),0);
                    const count = this.editIndex === -1 ? remainCount + Number(this.form.contribution) : remainCount;
                    if(count > 100) return this.$message.error('贡献率合计超过了一百，请重新赋值！');
                    this.dialogVisible = false;
                    if (this.editIndex === -1) {
                        this.propTableData.push(this.form)
                    } else {
                        this.$set(this.propTableData, this.editIndex, this.form);
                    }
                    this.form = {
                        name: '',
                        role: '',
                        contribution: 1,
                    }
                }
            })

        },
        deleteItem(index) {
            this.propTableData.splice(index, 1);
        }
    }
}
</script>
<style lang="less" scoped>
.main-table {
    width: 90%;

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 1em 0;
    }
}
</style>