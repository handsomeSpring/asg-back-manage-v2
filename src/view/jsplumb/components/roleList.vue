<template>
    <div class="flex-container">
        <!-- 开始节点 -->
        <li ref="liList" v-for="(item, index) in roles" :key="index" @click="handleClick(item, index)">
            <p><i class="el-icon-user-solid"></i>{{ item.name }}</p>
            <p>{{ item.role }}</p>
        </li>
        <el-input size="small" v-model="func" placeholder="请输入职责说明"></el-input>
        <el-radio-group v-model="handler" size="small">
            <el-radio-button label="1" :disabled="!isDis">发起</el-radio-button>
            <el-radio-button label="2" :disabled="isDis">审批</el-radio-button>
            <el-radio-button label="3" :disabled="isDis">送审</el-radio-button>
            <el-radio-button label="4" :disabled="isDis">决策</el-radio-button>
            <el-radio-button label="5" :disabled="isDis">审阅结束</el-radio-button>
        </el-radio-group>
        <el-button type="primary" style="width:100%" size="small" @click="confirm">确 定</el-button>
    </div>
</template>
  
<script>
import { getByTitle } from "@/api/config";
export default {
    name: "roleList",
    props:{
        allData:{
            type:Array,
            default:()=>[]
        }
    },
    data() {
        return {
            roles: [],
            activeItem: {},
            func: "",//职责说明
            handler:"",//处理说明
            isDis:false,
        }
    },
    created() {
        this.initRoles();
    },
    watch:{
        allData:{
            handler(arr){
               if(arr.length === 0) {
                this.handler = "1"
                this.isDis = true;
               }else{
                this.handler = ""
                this.isDis = false;
               }
            },
            deep:true,
            immediate:true
        }
    },
    methods: {
        initRoles() {
            getByTitle("userRole")
                .then((res) => {
                    this.roles = res.data;
                })
                .catch((err) => {
                    this.$message.error("获取云端配置失败！");
                });
        },
        handleClick(item, index) {
            this.activeItem = item;
            this.removeAllActive();
            this.$refs.liList[index].classList.add('active')
        },
        removeAllActive() {
            this.$refs.liList.forEach(ele => {
                ele.classList.remove('active');
            });
        },
        confirm() {
            this.$emit("createNode", this.activeItem, this.func,this.handler);
            this.activeItem = {};
            this.func = "";
            this.handler = "";
            this.removeAllActive();
        }
    }
}
</script>
  
<style scoped lang="less">
@color: #409EEF;

.flex-container {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: space-around;
}

li {
    width: 200px;
    border: 1px solid #e7e7e7;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    position: relative;
    border-radius: 5px 0 0 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.13);

    &::after {
        content: "";
        background-color: @color;
        height: 100%;
        width: 5px;
        position: absolute;
        right: 0;
        top: 0;
    }
}

.active {
    background-color: @color;
    color: #f7e157;
}
</style>