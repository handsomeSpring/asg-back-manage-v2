<template>
    <div>
        <!-- 开始节点 -->
        <div class="start_wrap">
            <p id="start_point">开始</p>
            <div class=line></div>
        </div>
        <header>
            <el-popover v-model="visible" placement="right" width="500" trigger="click">
                <roleList @createNode="handleNode" :allData="allData"></roleList>
                <p slot="reference"><i class="el-icon-circle-plus "></i></p>
            </el-popover>
            <div class=line></div>
        </header>
        <div class="mainBody">
            <li v-for="(item,index) in allData" id="list_wrap">
                <div class="infos">{{ item.handler | filterRoles }}</div>
                <div class="roleLine">
                    <p>{{ item.name }}</p>
                    <p>{{ item.role }}</p>
                </div>
                <p style="word-break: break-all;width:250px;font-size: 14px;"><span class="fontWeight">说明：</span><span>{{ item.func
                }}</span>
                </p>
                <p class="delete_wrap" @click="handleDelete(index)"><i class="el-icon-delete"></i></p>
                <div class="line"></div>
            </li>
            <div class="overLi" @click="handleSave">保存流程</div>
          </div>
        </div>
</template>
  
<script>
import { addConfig,getByTitle } from "@/api/config/index.js"
import roleList from "./roleList"
export default {
    name: "jsplumb",
    props: {
        bizType: {
            type: String,
            default: ""
        },
        keyId:{
            type: Number,
            default: 15
        }
    },
    components: {
        roleList
    },
    data() {
        return {
            visible: false,
            allData: [],
        }
    },
    created(){
        getByTitle(this.bizType)
        .then(res =>{
           this.allData = res?.data ?? [];
        })
        .catch(()=>{
            this.allData = [];
            this.$message.error("获取云端配置失败！");
        })
    },
    methods: {
        handleNode(item, func, handler) {
            const items = {
                ...item,
                func,
                handler
            }
            this.allData.push(items);
            this.visible = false;
        },
        handleDelete(index){
           this.allData.splice(index,1);
        },
        handleSave(){
            if(this.allData.length === 0){
                this.$message.error("请配置发起人！");
                return;
            }
            const param = {
                id:this.keyId,
                msg:this.bizType,
                substance:JSON.stringify(this.allData),
                title:this.bizType
            }
            addConfig(param).then(res=>{
                this.$message.success("保存成功！")
            })
        }
    }
}
</script>
  
<style scoped lang="less">
@color: #0089f3;

.start_wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    margin-bottom: 12px;
    position:relative;

    #start_point {
        width: 200px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: @color;
        color: #e7e7e7;
        border-radius: 5px;
    }
    .line{
        z-index: -1;
        position: absolute;
        width:5px;
        height:50%;
        top:calc(50% + 12px);
        background-color: @color;
    }
}

header {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    p {
        font-size: 36px;
        color: @color;
        cursor: pointer;

        &:hover {
            color: lighten(@color, 15%);
        }
    }
    .line{
        z-index: -1;
        position: absolute;
        width:5px;
        height:100%;
        background-image: linear-gradient(to bottom, @color,#fff,@color);
    }
}

.mainBody {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    li {
        border: 1px solid #e7e7e7;
        border-radius: 5px 0 0 5px;
        width: 280px;
        margin: 12px auto;
        padding: 12px;
        position: relative;
        box-sizing: border-box;
        background-color:#fff;
        position:relative;

        .infos {
            background-color: #0089f3;
            border: 1px solid #0089f3;
            border-radius: 0 5px 5px 0;
            position: absolute;
            right: -24px;
            top: 0;
            width: 25px;
            height: 100%;
            display: flex;
            font-size:13px;
            align-items: center;
            text-align: center;
            color: #f7e157;
            font-weight: bold;
            writing-mode: lr-tb
        }

        .delete_wrap {
            position: absolute;
            left: -10px;
            top: -10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: red;
            color: #fff;
            cursor: pointer;

            &:hover {
                background-color: lighten(red, 20%);
            }

            i {
                display: block;
            }
        }

        .line{
           z-index: -1;
           position: absolute;
           width:5px;
           left:50% ;
           transform: translateX(-50%);
           height:calc(100% + 25px);
           top:-13px;
           background-color:@color;
        }
    }
}

.roleLine {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 5px;
    border-bottom: 1px dashed #e7e7e7;
}

.fontWeight {
    font-weight: bold;

}
.overLi{
    width:40px;
    height:40px;
    border-radius: 50%;
    border:1px solid #ccc;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow:hidden;
    background-color: #ccc;
    display: flex;
    cursor:pointer;
    align-items: center;
    justify-content: center;
    color:#ccc;
    transition: .2s;
    font-size: 14px;
    &:hover{
       width:140px;
       border-radius: 5px;
       background-color: @color;
       color:#e7e7e7;
    }
}
</style>