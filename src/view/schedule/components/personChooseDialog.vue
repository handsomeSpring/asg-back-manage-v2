<template>
    <el-dialog title="选择人员" top="5vh" :visible="visible" :close-on-click-modal="false" width="40%" @close="handleClose"
        @open="initRoles">
        <el-radio-group style="margin-bottom: 12px;" size="small" v-model="personType">
            <el-radio-button label="1">职位库选择</el-radio-button>
            <el-radio-button label="2">自定义名称</el-radio-button>
        </el-radio-group>
        <div class="dialog__main--grid" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
            <template v-if="personType === '1'">
                <div class="person__chose">
                    <el-scrollbar style="height:400px">
                        <li class="title" @click="refereeVisible = !refereeVisible">
                            <div>导播列表</div>
                            <div class="icon__div" :class="refereeVisible ? 'rotate__icon' : ''"><i
                                    class="el-icon-arrow-up"></i></div>
                        </li>
                        <el-collapse-transition>
                            <div v-show="refereeVisible">
                                <li v-for="(item, index) in refereeOptions" :key="`${index}-referee`">
                                    <el-checkbox v-model="item.isCheck"
                                        @input="handleCheck($event, item)"></el-checkbox>
                                    <p>{{ item.chinaname }}</p>
                                </li>
                            </div>
                        </el-collapse-transition>
                        <li class="title" @click="judgeVisible = !judgeVisible">
                            <div>裁判列表</div>
                            <div class="icon__div" :class="judgeVisible ? 'rotate__icon' : ''"><i
                                    class="el-icon-arrow-up"></i></div>
                        </li>
                        <el-collapse-transition>
                            <div v-show="judgeVisible">
                                <li v-for="(item, index) in judgetOptions" :key="`${index}-judge`">
                                    <el-checkbox v-model="item.isCheck"
                                        @input="handleCheck($event, item)"></el-checkbox>
                                    <p>{{ item.chinaname }}</p>
                                </li>
                            </div>
                        </el-collapse-transition>
                    </el-scrollbar>
                </div>
                <div class="choose__item">
                    <li class="title">选取人物</li>
                    <li v-if="!!choosePerson.chinaname">
                        <p>{{ choosePerson.chinaname }}</p>
                        <p>{{ choosePerson.id }}</p>
                    </li>
                    <li class="no-choose" v-else>未选取人物</li>
                </div>
            </template>
            <template v-else>
                <el-input size="small" v-model="choosePerson.chinaname" placeholder="请输入人员中文名" clearable></el-input>
                <el-input size="small" v-model="choosePerson.id" placeholder="用户id/不清楚可以输入0"></el-input>
            </template>
        </div>
        <span slot="footer">
            <el-button plain size="small" @click="handleClose">关 闭</el-button>
            <el-button type="primary" size="small" @click="handleChoose">确定人员</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getUserRoles } from "@/api/schedule/index";
export default {
    name: 'personChooseDialog',
    data() {
        return {
            refereeOptions: [], //导播选项
            judgetOptions: [], //裁判选项
            personType: '1', // 人员形式
            choosePerson: {
                chinaname: '',
                id: 0
            },
            refereeVisible: false,
            judgeVisible: false,
            loading: false,
        };
    },
    watch: {
        personType: {
            handler() {
                this.handleReset();
            }
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        checkId: {
            type: Number | null,
            default: -1
        }
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible;
            },
            set(value) {
                this.$emit('update:dialogVisible', value);
            }
        }
    },
    methods: {
        handleReset() {
            this.refereeOptions.forEach(role => {
                role.isCheck = false;
            });
            this.judgetOptions.forEach(role => {
                role.isCheck = false;
            });
            this.choosePerson.chinaname = '';
            this.choosePerson.id = 0;
        },
        handleClose() {
            this.visible = false;
            this.handleReset();
        },
        handleChoose() {
            if (!this.choosePerson.chinaname) {
                return this.$message.error('未选择人员！');
            }
            this.$emit('finish', this.choosePerson);
            this.handleClose();
        },
        handleCheck(value, item) {
            this.choosePerson.chinaname = value ? item.chinaname : '';
            this.choosePerson.id = value ? item.id : 0;
            this.refereeOptions.forEach(role => {
                if (role.id === item.id && value) {
                    role.isCheck = true;
                } else {
                    role.isCheck = false;
                }
            });
            this.judgetOptions.forEach(role => {
                if (role.id === item.id && value) {
                    role.isCheck = true;
                } else {
                    role.isCheck = false;
                }
            })
        },
        async initRoles() {
            try {
                this.loading = true;
                const { data } = await getUserRoles({ opname: 'Anchor' });
                this.refereeOptions = data.map(item => {
                    if (item.id === this.checkId) {
                        this.choosePerson.id = item.id;
                        this.choosePerson.chinaname = item.chinaname
                    }
                    return {
                        ...item,
                        isCheck: item.id === this.checkId
                    }
                });
                const { data: judge } = await getUserRoles({ opname: 'Judge' });
                this.judgetOptions = judge.map(item => {
                    if (item.id === this.checkId) {
                        this.choosePerson.id = item.id;
                        this.choosePerson.chinaname = item.chinaname
                    }
                    return {
                        ...item,
                        isCheck: item.id === this.checkId
                    }
                });
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>
<style lang='less' scoped>
.dialog__main--grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    .person__chose {
        cursor: pointer;
        border: 1px solid #e7e7e7;
        height: 400px;
        border-radius: 3px;
        overflow: auto;

        li {
            padding: 6px 24px;
            border-bottom: 1px solid #e7e7e7;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &.title {
                background: #f2f6fd;
            }

            &:hover {
                background: #f2f6fd;
                ;
            }
        }

    }

    .choose__item {
        border: 1px solid #e7e7e7;
        height: 400px;
        border-radius: 3px;
        overflow: auto;

        li {
            padding: 6px 24px;
            border-bottom: 1px solid #e7e7e7;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &.title {
                background: #f2f6fd;
            }

            &.no-choose {
                font-size: 12px;
                color: #979797;
            }
        }
    }
}

.icon__div {
    transition: .28s all;
    cursor: pointer;

    &.rotate__icon {
        transform: rotate(180deg);
    }

    &:hover {
        color: #4090EF;
    }
}

.slide-fade-enter-active {
    transition: all 0.23s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-leave-active {
    transition: all 0.23s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>