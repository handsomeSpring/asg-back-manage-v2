<template>
    <el-scrollbar class="comp__container--absolute">
        <TextTitle titleName="我的战队"></TextTitle>
        <el-skeleton v-if="isLoading" :rows="6" />
        <template v-else>
            <div v-if="hasTeam" class="team__container">
                <header>
                    <img :src="teamLogo">
                    <div style="display: flex;flex-direction: column;justify-content: space-around;height:80px">
                        <p class="main__title">{{ myTeam.team_name }}</p>
                        <p class="sub__title">{{ myTeam.team_tel }}</p>
                    </div>
                </header>
                <div class="table__header">
                    <li>选手名称</li>
                    <li>常用角色</li>
                    <li>历史段位</li>
                </div>
                <el-divider>求生者</el-divider>
                <li class="grid-show" v-for="(item, index) in myTeam.role.filter(role => role.role_lin === '求生者')"
                    :key="item.id">
                    <p>{{ item.role_name }}</p>
                    <p>{{ item.common_Roles }}</p>
                    <p>{{ computedRanks(item.historical_Ranks) }}</p>
                </li>
                <el-divider>监管者</el-divider>
                <li class="grid-show" v-for="(item, index) in myTeam.role.filter(role => role.role_lin === '监管者')"
                    :key="item.id">
                    <p>{{ item.role_name }}</p>
                    <p>{{ item.common_Roles }}</p>
                    <p>{{ computedRanks(item.historical_Ranks) }}</p>
                </li>
            </div>
            <el-empty v-else description="您还未创建战队">
                <el-button type="primary" size="small" @click="createTeam">前往创建</el-button>
            </el-empty>
        </template>
    </el-scrollbar>
</template>

<script>
import TextTitle from "@/components/TextTitle.vue";
import { getDetailForm } from "@/api/enroll/index.js";
import { getByTitle } from '@/api/config';
export default {
    name: 'asgMyTeam',
    text: '我的战队',
    components: {
        TextTitle
    },
    data() {
        return {
            isLoading: false,
            myTeam: {},
            historyRanks: [],
            hasTeam:false
        };
    },
    computed: {
        teamLogo() {
            return window.SERVE_IP + this.myTeam.logo_uri;
        }
    },
    methods: {
        computedRanks(val) {
            return this.historyRanks.find(item => item.value === val.toString())?.label ?? '未知段位';
        },
        createTeam(){
            window.open('https://idvasg.cn/#/','_blank')
        }
    },
    async created() {
        try {
            this.isLoading = true;
            const res = await getByTitle('historyRank');
            this.historyRanks = res.data;
            const { data, status } = await getDetailForm();
            console.log(data,'data');
            if(status !== 200) throw new Error('服务端异常！');
            this.myTeam = data;
            this.hasTeam = true;
        } catch (error) {
           if(error.response?.data?.code === 400){
            this.hasTeam = false;
            this.$message.error(error.response?.data?.message ?? '未知错误');
            return;
           }
           this.$message.error(error.message);
        } finally {
            this.isLoading = false;
        }

    },
}
</script>

<style lang='less' scoped>
.comp__container--absolute {
    width: 100%;
    height: 100%;
}

.team__container {
    margin: 12px;

    header {
        display: flex;
        align-items: center;

        img {
            width: 80px;
            height: 80px;
            margin-right: 16px;
            border-radius: 4px;
        }

        .main__title {
            font-size: 1.25em;
            font-weight: 700;
        }

        .sub__title {
            color: #64748B;
            font-size: 1em;
        }
    }
}

.grid-show {
    display: grid;
    grid-template-columns: 30% 50% 20%;
    margin: 6px 0;

    p {
        width: 100%;
        text-align: center
    }
}

.table__header {
    display: grid;
    grid-template-columns: 30% 50% 20%;
    margin: 12px 0 6px;
    height: 24px;
    background: #f1f5fd;
    border-radius: 4px;
    padding: 6px 0;
    align-items: center;

    li {
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
    }
}
</style>