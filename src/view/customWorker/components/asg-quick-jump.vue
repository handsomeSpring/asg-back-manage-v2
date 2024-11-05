<template>
    <el-scrollbar class="comp__container--absolute">
        <TextTitle titleName="快捷跳转"></TextTitle>
        <el-button v-show="design" type="primary" size="small" @click="transferVisible = true">配置（设计可见）</el-button>
        <ul class="container__flex" v-if="multipleSelection.length > 0">
            <li v-for="(item,index) in multipleSelection" :key="index" @click="routePath(item.path)">
                <svg-icon color="#4090EF" style="margin-right: 5px" :iconClass="item.iconClass" width="80px" height="80px"></svg-icon>
                <p>{{ item.title }}</p>
            </li>
        </ul>
        <el-empty v-else description="暂未配置快捷跳转"></el-empty>
        <el-dialog :visible.sync="transferVisible" title="配置快捷权限" append-to-body>
            <curTransfer ref="curTransfer"></curTransfer>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="handleSaveShort">保 存</el-button>
            </div>
        </el-dialog>
    </el-scrollbar>
</template>

<script>
import curTransfer from "@/view/homepage/cusTransfer.vue";
import TextTitle from "@/components/TextTitle.vue";
export default {
    name: 'asgQuickJump',
    text:'快捷跳转',
    components: {
        curTransfer,
        TextTitle
    },
    props:{
        design:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            transferVisible: false,
            multipleSelection:[]
        };
    },
    created(){
        this.multipleSelection = JSON.parse(localStorage.getItem("asgshortcut-v3")) ?? [];
    },
    methods: {
        handleSaveShort() {
            this.transferVisible = false;
            this.multipleSelection = this.$refs.curTransfer.save();
        },
        routePath(path){
            this.$router.push({path});
        }
    }
}
</script>
<style lang='less' scoped>
.comp__container--absolute {
    width: 100%;
    height: 100%;
    .container__flex{
        display:flex;
        flex-wrap:wrap;
        width: 100%;
        li{
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin:12px;
            &:hover p{
                color:#4090EE;
            }
            img{
                border-radius: 10px;
                border:1px solid #979797;
                width:80px;
                height:80px;
                margin:6px 0;
            }
            p{
                color:#303030;
                font-weight: 600;
                font-size: 0.8rem;
                margin-top: 12px;
            }
        }
    }
}
</style>