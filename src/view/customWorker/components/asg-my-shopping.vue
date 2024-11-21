<template>
    <el-scrollbar class="comp__container--absolute">
        <TextTitle titleName="我的购物"></TextTitle>
        <el-skeleton v-if="isLoading" :rows="6" />
        <div v-else>
            <ul v-if="shoppingList.length > 0">
                <li class="shopping__box" v-for="item in shoppingList" :key="item.id">
                    <header>
                        <p class="goods__title">{{ item.name }}</p>
                        <p :class="item.isVerification ? 'goods__success' : 'goods__error'">{{ item.isVerification ? '已核验' : '待核验' }}</p>
                    </header>
                    <main>
                        <img src="@/assets/images/logo.png">
                        <div class="left__container">
                            <div class="first__line">
                                <p class="des__title">{{ item.description }}</p>
                                <p><span class="tag">￥</span>{{ item.money || 10 }}</p>
                            </div>
                            <p class="second__line">{{ item.information }}</p>
                            <div class="third__line">
                                <el-tag size="small" type="primary">亲测有效</el-tag>
                                <el-tag size="small" type="success">多人好评</el-tag>
                                <el-tag size="small" type="danger">高回头</el-tag>
                            </div>
                        </div>
                    </main>
                </li>
            </ul>
            <el-empty v-else description="暂无购物信息"></el-empty>
        </div>
    </el-scrollbar>
</template>

<script>
import { getMyShopping } from "@/api/home";
import TextTitle from '@/components/TextTitle.vue';
export default {
    name: 'asgMyShopping',
    text: '我的购物',
    components: {
        TextTitle
    },
    data() {
        return {
            isLoading: false,
            shoppingList: []
        };
    },
    methods: {
        async initMyShopping() {
            try {
                this.isLoading = true;
                const { data, status, message } = await getMyShopping();
                if (status !== 200) throw new Error(message);
                this.shoppingList = data;
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                this.isLoading = false;
            }
        }
    },
    created() {
        this.initMyShopping();
    },
}
</script>
<style lang='less' scoped>
.comp__container--absolute {
    width: 100%;
    height: 100%;

    .shopping__box {
        border: 1px solid #e7e7e7;
        width: calc(98% - 24px);
        padding: 12px;
        box-sizing: border-box;
        border-radius: 4px;
        margin: 12px 0;
        &:hover{
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            font-weight: bold;
            margin:6px 0;
            .goods__title {
                width:70%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .goods__error{
                color:#f40;
            }
            .goods__success{
                color:#67C23A;
            }
        }
        main {
            display: grid;
            grid-template-columns: 80px auto;
            align-items: center;
            gap:0 20px;
            img{
                width: 80px;
                height: 80px;
                border-radius: 10px;
                border:1px solid #efefef;
            }
            .left__container{
                width: calc(100% - 40px);
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                height:80px;
                gap:5px;
                .first__line{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    .des__title{
                        font-weight: bold;
                        width:80%;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .tag{
                        font-size: 0.5rem;
                    }
                }
                .second__line{
                    font-size: 0.8rem;
                    color:#909090;
                }
                .third__line{
                    display: flex;
                    gap:6px;
                    align-items: center;
                    justify-content: flex-start;
                }
            }
        }
    }
}
</style>