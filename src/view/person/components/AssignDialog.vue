<template>
    <el-dialog :visible="visible" top="5vh" title="菜单权限分配" @close="closeDialog" @open="openDialog">
        <el-tag type="warning" style="margin-right: 12px;" size="small">{{ tableItem.chinaname || '未知中文名' }}</el-tag>
        <el-tag size="small">{{ tableItem.id }}</el-tag>
        <el-divider></el-divider>
        <div class="grid-container">
            <div class="role__list">
                <header>权限选择</header>
                <li v-for="item in roleList" :key="item.value">
                    <el-checkbox v-model="item.isCheck" @input="handleCheck($event, item)"></el-checkbox>
                    <div>{{ item.label }}</div>
                </li>
            </div>
            <div class="has__permission">
                <header>已分配权限</header>
                <template v-if="hasResult.length > 0">
                    <li v-for="item in hasResult" :key="item.value">
                        <div>{{ item.value }}</div>
                        <div>{{ item.label }}</div>
                    </li>
                </template>
                <el-empty v-else description="该用户无任何权限"></el-empty>
            </div>
        </div>
        <span slot="footer">
            <el-button size="small" type="primary" @click="handleMenu">分配菜单权限</el-button>
            <el-button v-if="!tableItem.isAdmin" :loading="adminLoading" size="small" type="primary" @click="handleSetAdmin">设置为后台管理员</el-button>
            <el-button size="small" @click="closeDialog">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { setAdmin } from "@/api/home";
import { setRight } from "@/api/home";
export default {
    name: 'AssignDialog',
    props: {
        tableItem: {
            type: Object,
            default: () => { }
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        menuPermission: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible;
            },
            set(val) {
                this.$emit('update:dialogVisible', val);
            }
        }
    },
    data() {
        return {
            roleList: [],
            hasResult: [],
            adminLoading: false,
        };
    },
    methods: {
        async handleMenu() {
            try {
                const req = {
                    userId: this.tableItem.id,
                    roleListName: '',
                    roleListCode: ''
                }
                req.roleListName = this.hasResult.map(item => item.label).join(',');
                req.roleListCode = this.hasResult.map(item => item.value).join(',');
                const { status, data } = await setRight(req);
                if(status !== 200) throw new Error('服务端异常，请联系网站管理员');
                if(data && data.code && data.code === 401) throw new Error(data.message ?? '没有权限');
                this.$message.success('操作成功！');
                this.$emit('refresh');
                this.closeDialog();
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        handleCheck($event, obj) {
            const index = this.hasResult.findIndex(item => item.value === obj.value);
            if ($event) {
                if (index === -1) {
                    this.hasResult.push(obj)
                }
            } else {
                if (index !== -1) {
                    this.hasResult.splice(index, 1)
                }
            }
        },
        openDialog() {
            this.hasResult = [];
            const userRoles = this.tableItem?.roleListCode ? this.tableItem?.roleListCode.split(',') : [];
            this.roleList = this.menuPermission.map(item => {
                if (userRoles.includes(item.value)) {
                    this.hasResult.push(item)
                }
                return {
                    ...item,
                    isCheck: userRoles.includes(item.value)
                }
            })
        },
        closeDialog() {
            this.visible = false;
        },
        // 设置管理员
        async handleSetAdmin() {
            try {
                const flag = await this.$confirm(`您确定要设置该用户为管理员吗？`, "确认", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                if (flag === 'confirm') {
                    this.adminLoading = true;
                    const { status } = await setAdmin(this.tableItem.id);
                    if (status !== 200) throw new Error('设置失败，服务端异常');
                    this.$store.commit('ADD_ADMIN', this.tableItem.id);
                    this.$emit('refresh');
                    this.$message.success("设置成功！");
                    this.closeDialog();
                }
            } catch (error) {
                if (typeof error === 'string') {
                    return;
                }
                this.$message.error(error.message);
            } finally {
                this.adminLoading = false;
            }
        },
    },
}
</script>
<style lang='less' scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .has__permission,
    .role__list {
        height: 500px;
        overflow-y: scroll;

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 6px;
            background: linear-gradient(90deg, #77A2F3 0%, #1891FD 47%, #145BCF 100%);
            color: #fff;
        }

        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 6px;
            box-sizing: border-box;
            border-bottom: 1px solid #e7e7e7;

            &:hover {
                background: rgba(26, 107, 241, 0.08);
                color: #1B8CFD;
            }
        }
    }
}

::-webkit-scrollbar {
    display: none !important;
}
</style>