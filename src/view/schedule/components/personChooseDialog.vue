<template>
    <el-dialog title="选择人员" :visible="visible" width="40%" @close="handleClose">
        <el-radio-group style="margin-bottom: 12px;" size="small" v-model="personType">
            <el-radio-button label="1">职位库选择</el-radio-button>
            <el-radio-button label="2">自定义名称</el-radio-button>
        </el-radio-group>
        <div class="dialog__main--grid">
            <template v-if="personType === '1'">
                <div class="person__chose">
                    <li class="title">
                        <div>导播列表</div>
                        <div class="icon__div" :class="refereeVisible ? 'rotate__icon' : ''"
                            @click="refereeVisible = !refereeVisible"><i class="el-icon-arrow-up"></i></div>
                    </li>
                    <Transition name="slide-fade">
                        <div v-show="refereeVisible">
                            <li v-for="(item, index) in refereeOptions" :key="`${index}-referee`">
                                <el-checkbox v-model="item.isCheck" @input="handleCheck($event, item)"></el-checkbox>
                                <p>{{ item.chinaname }}</p>
                            </li>
                        </div>
                    </Transition>
                    <li class="title">
                        <div>裁判列表</div>
                        <div class="icon__div" :class="judgeVisible ? 'rotate__icon' : ''"
                            @click="judgeVisible = !judgeVisible"><i class="el-icon-arrow-up"></i></div>
                    </li>
                    <Transition name="slide-fade">
                        <div v-show="judgeVisible">
                            <li v-for="(item, index) in judgetOptions" :key="`${index}-judge`">
                                <el-checkbox v-model="item.isCheck" @input="handleCheck($event, item)"></el-checkbox>
                                <p>{{ item.chinaname }}</p>
                            </li>
                        </div>
                    </Transition>
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
            </template>
        </div>
        <span slot="footer">
            <el-button plain size="small" @click="handleChoose">确定人员</el-button>
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
                id: ''
            },
            refereeVisible: false,
            judgeVisible: false
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
            this.choosePerson.id = '';
        },
        handleClose() {
            this.visible = false;
            this.handleReset();
        },
        handleChoose() {
            if(!this.choosePerson.chinaname){
                return this.$message.error('未选择人员！');
            }
            this.$emit('finish', this.choosePerson);
            this.handleClose();
        },
        handleCheck(value, item) {
            this.choosePerson.chinaname = value ? item.chinaname : '';
            this.choosePerson.id = value ? item.id : '';
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
                const { data } = await getUserRoles({ opname: 'Anchor' });
                this.refereeOptions = data.map(item => {
                    return {
                        ...item,
                        isCheck: false
                    }
                });
                const { data: judge } = await getUserRoles({ opname: 'Judge' });
                this.judgetOptions = judge.map(item => {
                    return {
                        ...item,
                        isCheck: false
                    }
                });
            } catch (error) {
                this.$message.error(error.message);
            }
        }
    },
    created() {
        this.initRoles();
    },
}
</script>
<style lang='less' scoped>
.dialog__main--grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    .person__chose {
        border: 1px solid #e7e7e7;
        height: 500px;
        border-radius: 3px;
        overflow: auto;

        li {
            padding: 6px;
            border-bottom: 1px solid #e7e7e7;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &.title {
                background: #f2f6fd;
            }
        }
    }

    .choose__item {
        border: 1px solid #e7e7e7;
        height: 500px;
        border-radius: 3px;
        overflow: auto;

        li {
            padding: 6px;
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