<template>
    <div>
        <div class="warning-wrap">
            ★注意！！！请审批完成后点击右上角的保存修改！！
        </div>
        <header>
            <el-button id="step1" type="primary" size="small" @click="addNewProcess"><i
                    class="el-icon-plus"></i>添加新流程</el-button>
            <el-button id="step4" type="primary" size="small" @click="handleSave">保存修改</el-button>
        </header>
        <main>
            <table>
                <thead>
                    <th id="step2" width="70%">进程</th>
                    <th width="15%">当前流程执行人</th>
                    <th id="step3" width="10%">最终结论</th>
                    <th>操作</th>
                </thead>
                <tbody v-if="tableData.length !== 0" v-for="(item, index) in tableData" :key="index"
                    @mouseenter="handleMouseEnter($event, index)">
                    <tr>
                        <td>
                            <div class="process-wrap">
                                <li :class="i === 0 ? 'start_point' : 'normal_point'" v-for="(el, i) in item.process">
                                    <el-popover placement="top-start" :title="`执行人:${el.name}`" width="200"
                                        trigger="hover" :content="`审核备注:${el.content}`">
                                        <span slot="reference">
                                            <i v-show="item.finalStatus === '0'"
                                                class="el-icon-delete-solid delete-child-icon"
                                                @click="deleteChild(item, i)"></i>
                                            <span :style="{ 'color': el.node === '退回' ? 'red' : '' }">{{ el.node
                                                }}</span>
                                        </span>
                                    </el-popover>
                                </li>
                                <li @click="setCheck(item, index)" class="checkIcon" v-if="item.finalStatus === '0'"><i
                                        class="el-icon-s-check"></i></li>
                            </div>
                        </td>
                        <td align="center">
                            <span class="node-check">{{ item.checkName }}</span>
                        </td>
                        <td align="center">
                            <span class="node-check"
                                :style="{ 'color': item.finalStatus === '0' ? 'gray' : (item.finalStatus === '1' ? 'green' : 'red') }">{{
                item.finalStatus | filterStatus }}</span>
                        </td>
                        <td align="center">
                            <i class="el-icon-delete-solid delete-main-icon" @click="handleDeleteParent(index)"></i>
                        </td>
                    </tr>
                    <tr v-show="showIndex === index">
                        <td style="text-align: left;" colspan="2">
                            <el-steps :active="item.process.length" align-center>
                                <el-step v-for="(step, stepI) in item.process" :key="stepI"
                                    :title="`${step.node}:${step.name}`" :description="step.content"></el-step>
                            </el-steps>
                        </td>
                        <td colspan="2">
                            <div style="color:#666;font-size: 14px;">
                                <span v-if="item.finalStatus === '0'">
                                    暂时没有审批结论
                                </span>
                                <span v-else>
                                    {{ item.finalStatus === '1' ? '同意理由' : '不同意理由' }}:
                                    {{ item.reason }}
                                </span>
                            </div>
                        </td>
                    </tr>

                </tbody>
                <tbody v-else>
                    <tr>暂无数据</tr>
                </tbody>
            </table>
            <!-- 弹窗 -->
            <el-dialog :visible.sync="checkVisible" title="审核" :close-on-click-modal="false" @close="clean">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="完成最终审核" name="first">
                        <el-input style="width:200px;margin-bottom: 12px;margin-right:24px" size="small"
                            v-model="checkPerson" placeholder="请输入审核人姓名" disabled></el-input>
                        <el-radio v-model="checkStatus" label="1">同意</el-radio>
                        <el-radio v-model="checkStatus" label="2">不同意</el-radio>
                        <el-input type="textarea" :rows="3" v-model="reason"
                            style="margin-bottom: 12px;margin-right:24px" size="small" placeholder="请输入审批理由"></el-input>
                        <div class="center-box">
                            <el-button v-loading="addLoading" type="primary" size="small"
                                @click="handleCheckOver">完成审批</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="添加审核节点" name="second">
                        <el-form ref="form" :model="form" label-width="150px">
                            <el-form-item label="当前审批人姓名">
                                <span style="font-weight: bold;">{{ form.name }}</span>
                                <!-- <el-select v-model="form.name" placeholder="请填写当前审批人姓名">
                                    <el-option v-for="item in user" :key="item.value" :label="item.name"
                                        :value="item.name" disabled>
                                    </el-option>
                                </el-select> -->
                            </el-form-item>
                            <el-form-item label="当前节点类型">
                                <el-row type="flex" justify="start">
                                    <el-select style="width:200px" v-if="nodeType" v-model="form.node"
                                        placeholder="请选择当前节点类型">
                                        <el-option label="同意" value="同意"></el-option>
                                        <el-option label="决策" value="决策"></el-option>
                                        <el-option label="送审" value="送审"></el-option>
                                        <el-option label="退回" value="退回"></el-option>
                                    </el-select>
                                    <el-input v-else style="width:200px" v-model="form.node" placeholder="请选择当前节点类型">
                                    </el-input>
                                    <el-radio-group style="margin-left:24px" v-model="nodeType">
                                        <el-radio-button :label="true">通用类型节点</el-radio-button>
                                        <el-radio-button :label="false">自定义节点</el-radio-button>
                                    </el-radio-group>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="审批内容（备注）">
                                <el-input type="textarea" :rows="3" v-model="form.content"
                                    placeholder="请填写审批内容"></el-input>
                            </el-form-item>
                            <el-form-item label="下一个节点审批人">
                                <el-select v-model="nextNodeCheckPerson" placeholder="请填写当前审批人姓名" clearable>
                                    <el-option v-for="item in user" :disabled="item.name === form.name"
                                        :key="item.value" :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div class="center-box">
                            <el-button v-loading="addLoading" type="primary" size="small"
                                @click="addChildNode">添加节点</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>
            <!-- 发起新流程弹窗 -->
            <el-dialog :visible.sync="newVisible" title="新流程发起" :close-on-click-modal="false" @close="clean">
                <el-form ref="newForm" :model="newForm" label-width="150px">
                    <el-form-item label="发起人姓名">
                        <el-select v-model="newForm.name" placeholder="请填写发起人姓名" clearable>
                            <el-option v-for="item in user" :disabled="item.name === checkPerson" :key="item.value"
                                :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="当前节点类型">
                        <el-select disabled v-model="newForm.node" placeholder="请选择当前节点类型">
                            <el-option label="发起人" value="发起人"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="需要进行审批内容（发起内容）">
                        <el-input type="textarea" :rows="5" v-model="newForm.content"
                            placeholder="请填写流程审批内容"></el-input>
                    </el-form-item>
                    <el-form-item label="下一节点审批人">
                        <el-select v-model="checkPerson" placeholder="请选择审批人" clearable>
                            <el-option v-for="item in user" :disabled="item.name === newForm.name" :key="item.value"
                                :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="center-box">
                    <el-button v-loading="startLoading" type="primary" size="small"
                        @click="startProcess">发起流程</el-button>
                </div>
            </el-dialog>
        </main>
    </div>
</template>

<script>
import { addConfig, getByTitle } from "@/api/config/index.js"
import { introOption } from "../tool"
import { sendqqMsg } from "@/api/admin/index.js"
export default {
    name: "assignPage",
    props: {
        bizType: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            parentIndex: 0,
            checkStatus: "",
            checkPerson: "",
            newVisible: false,
            form: {
                node: "",
                name: "",
                content: ""
            },
            newForm: {
                node: "发起人"
            },
            showIndex: null,
            tableData: [],
            checkVisible: false,
            activeName: "first",
            reason: "",
            user: [],
            nextNodeCheckPerson: "",//下一个节点审批人
            nodeType: true,
            introOption: {},
            qqList: [],
            qqConfig: {
                group: "860395385"
            },
            startLoading: false,//开始流程的加载
            addLoading: false
        }
    },
    created() {
        getByTitle(this.bizType).then(res => {
            this.tableData = res?.data ?? [];
        })
        getByTitle("userRole").then(res => {
            this.user = res?.data ?? [];
        })
        getByTitle("teamqq").then(res => {
            this.qqList = res?.data ?? [];
        })
            .catch(() => {
                this.tableData = [];
                this.$message.error("获取云端配置失败！");
            })
    },
    mounted() {
        this.initGuide();
    },
    filters: {
        filterStatus(value) {
            if (value === "0") {
                return "待审批"
            } else if (value === "1") {
                return "同意：接受"
            } else {
                return "拒绝：驳回"
            }
        }
    },
    methods: {
        initGuide() {
            this.introOption = introOption;
            if (localStorage.getItem("introOver") === "1") {
                return;
            }
            // 绑定标签元素的选择器数组
            this.$intro()
                .setOptions(this.introOption)
                // 点击结束按钮后执行的事件
                .oncomplete(() => {
                    localStorage.setItem("introOver", "1");
                })
                // 点击跳过按钮后执行的事件
                .onexit(() => {
                    localStorage.setItem("introOver", "1");
                })
                // 确认完毕之后执行的事件
                .onbeforeexit(() => {
                    console.log("确认完毕之后执行的事件");
                })
                .start();
        },
        setCheck(item, index) {
            this.checkPerson = item.checkName;
            this.$set(this.form, "name", item.checkName);
            this.parentIndex = index;
            this.checkVisible = true;
        },
        async handleCheckOver() {
            try {
                if (!this.checkStatus || !this.checkPerson || !this.reason) {
                    this.$message.error("请填写审批信息！");
                    this.addLoading = false;
                    return;
                }
                this.addLoading = true;
                let lastCheckPerson = this.tableData[this.parentIndex]?.process[this.tableData[this.parentIndex].process.length - 1]?.name || "浊泉";
                const checkResult = this.checkStatus === "2" ? "不同意" : "同意";
                let qqObj = this.qqList.find(p => p.name === lastCheckPerson) ?? { qq: "3175691147" };
                const msg = this.checkPerson + "<" + checkResult + ">:" + lastCheckPerson + "的流程申请，理由是：" + this.reason + "请" + lastCheckPerson + "上后台查看！"
                this.qqConfig = {
                    ...this.qqConfig,
                    qq: qqObj.qq,
                    msg: msg
                }
                const { status } = await sendqqMsg(this.qqConfig);
                if (status === 200) {
                    this.$message.success(`已通知${lastCheckPerson}查看结果，请注意保存修改！`)
                    this.tableData[this.parentIndex].checkName = this.checkPerson;
                    this.tableData[this.parentIndex].finalStatus = this.checkStatus;
                    this.tableData[this.parentIndex].reason = this.reason;
                    this.addLoading = false;
                    this.checkVisible = false;
                } else {
                    this.$message.error("服务端错误，通知失败，请自行通知！");
                    this.addLoading = false;
                    this.checkVisible = false;
                }
            } finally {
                this.checkStatus = "";
                this.checkPerson = "";
                this.reason = ""
                this.parentIndex = 0;
                this.addLoading = false;
                this.checkVisible = false;
            }

        },
        async addChildNode() {
            try {
                if (!this.form.node || !this.form.content || !this.form.name) {
                    this.$message.error("请完整填写审批信息");
                    return;
                }
                this.addLoading = true;
                let qqObj = this.qqList.find(p => p.name === this.nextNodeCheckPerson) ?? { qq: "3175691147" };
                const msg = "<" + this.form.node + ">" + this.form.name + ":" + this.form.content + "。请" + this.nextNodeCheckPerson + "上后台审批！"
                this.qqConfig = {
                    ...this.qqConfig,
                    qq: qqObj.qq,
                    msg: msg
                }
                const { status } = await sendqqMsg(this.qqConfig);
                if (status === 200) {
                    this.$message.success(`已通知${this.checkPerson}审批，请注意保存修改！`)
                    this.tableData[this.parentIndex].process.push(this.form);
                    this.tableData[this.parentIndex].checkName = this.nextNodeCheckPerson;
                    this.addLoading = false;
                    this.checkVisible = false;
                } else {
                    this.$message.error("服务端错误，通知失败，请自行通知！");
                    this.newVisible = false;
                }
            } finally {
                this.form = {};
                this.parentIndex = 0;
                this.checkVisible = false;
                this.nextNodeCheckPerson = "";
            }
        },
        addNewProcess() {
            this.newVisible = true;
        },
        async startProcess() {
            try {
                if (!this.newForm.name || !this.newForm.content || !this.newForm.node) {
                    this.$message.error("请完整填写流程发起信息！");
                    return;
                }
                this.startLoading = true;
                let qqObj = this.qqList.find(p => p.name === this.checkPerson) ?? { qq: "3175691147" };
                const msg = "<" + this.newForm.node + ">" + this.newForm.name + ":" + this.newForm.content + "。请" + this.checkPerson + "上后台审批！"
                this.qqConfig = {
                    ...this.qqConfig,
                    qq: qqObj.qq,
                    msg: msg
                }
                const { status } = await sendqqMsg(this.qqConfig);
                this.startLoading = false;
                if (status === 200) {
                    this.$message.success(`已通知${this.checkPerson}审批，请注意保存修改！`)
                    let process = [];
                    process.push(this.newForm);
                    let startObj = {
                        process: process,
                        checkName: this.checkPerson,
                        finalStatus: "0"
                    }
                    this.tableData.push(startObj);

                } else {
                    this.$message.error("服务端错误，通知失败，请自行通知！");
                    this.newVisible = false;
                }
            } finally {
                this.newForm = {
                    node: "发起人"
                }
                this.newVisible = false;
            }

        },
        handleSave() {
            if (this.tableData.length === 0) {
                this.$message.error("请配置至少一条流程再保存！");
                return;
            }
            const param = {
                id: 21,
                msg: this.bizType,
                substance: JSON.stringify(this.tableData),
                title: this.bizType
            }
            addConfig(param).then(res => {
                this.$message.success("保存成功！")
            })
        },
        deleteChild(item, i) {
            if (i === 0) {
                this.$message.error("开始节点不允许删除！")
            } else {
                this.$confirm('此操作将删除该节点以及该节点以后的所有节点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.process.splice(i, item.process.length - i);
                    this.$message.success("删除成功！");
                }).catch(() => {
                    this.$message.info("已取消删除！");
                });

            }
        },
        handleDeleteParent(index) {
            this.$confirm('此操作将永久删除该流程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.tableData.splice(index, 1);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleMouseEnter(e, index) {
            this.showIndex = index
        },
        clean() {
            this.form = {};
            this.newForm = {
                node: "发起人"
            };
            this.checkStatus = "";
            this.checkPerson = "";
            this.reason = ""
            this.parentIndex = 0;
            this.nextNodeCheckPerson = "";
        }
    }
}
</script>

<style lang="less" scoped>
@startColor: #409EFF;
@border-color: #ddd;

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
}

table {
    border: 1px solid @border-color;
    border-collapse: collapse;
    width: 100%;

    thead {
        background-color: #ddd;
    }

    th {
        padding: 12px;
        border: 1px solid @border-color;
    }

    td {
        border: 1px solid @border-color;
        padding: 12px;
    }

    tr:hover {
        background-color: #efefef;
    }
}

.process-wrap {
    display: flex;
    justify-content: start;
    align-items: center;

    li {
        cursor: pointer;
        margin-right: 42px;
        position: relative;
    }
}

.checkIcon {
    font-size: 2rem;
    margin: 0 24px;
    color: @startColor;

    &:hover {
        color: lighten(@startColor, 20%)
    }

}

.start_point {
    width: 80px;
    height: 40px;
    position: relative;
    background-color: @startColor;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 5px 0 0 5px;
    font-size: 14px;

    &::after {
        position: absolute;
        content: '';
        right: -20px;
        top: 0px;
        border-left: 20px solid @startColor;
        border-bottom: 20px solid transparent;
        border-top: 20px solid transparent;
    }
}

.normal_point {
    width: 80px;
    height: 40px;
    position: relative;
    background-color: @startColor;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 13px;

    &::before {
        position: absolute;
        content: "";
        left: -20px;
        border-left: 20px solid transparent;
        border-bottom: 20px solid @startColor;
        border-top: 20px solid @startColor;

    }

    &::after {
        position: absolute;
        content: "";
        right: -20px;
        top: 0px;
        border-left: 20px solid @startColor;
        border-bottom: 20px solid transparent;
        border-top: 20px solid transparent;
    }
}

/deep/.el-steps--horizontal {
    margin: 12px 24px;
}

.node-check {
    font-size: 14px;
    font-weight: bold;
    color: #666;
}

.delete-main-icon {
    color: red;
    cursor: pointer;

    &:hover {
        color: lighten(red, 20%);
    }
}

.delete-child-icon {
    color: rgb(223, 53, 53);
    margin-right: 4px;
    cursor: pointer;

    &:hover {
        color: lighten(red, 20%);
    }
}

.warning-wrap {
    border: 1px solid #fde2e2;
    border-radius: 5px;
    height: 35px;
    width: calc(100% - 24px);
    display: flex;
    justify-content: start;
    padding-left: 24px;
    font-weight: bold;
    align-items: center;
    color: #f56c6c;
    background-color: #fef0f0;
}

.center-box {
    text-align: center;
}
</style>