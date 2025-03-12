<template>
    <div class="wrap-flex">
        <div class="flex__content--between">
            <slot name="top"></slot>
            <div class="operation" @click="foldIcon = !foldIcon;">
                <p>更多操作</p>
                <i ref="foldIcon" :style="{ transform: foldIcon ? 'rotate(90deg)' : 'rotate(0deg)' }"
                    class="el-icon-arrow-right foldIcon"></i>
            </div>
        </div>
        <transition name="el-fade-in-linear">
            <div v-show="foldIcon" class="operation_list" :style="{
                'top':this.foldTop
            }">
                <div class="grid__container">
                    <div :class="isCustomRow ? '' : 'search_content'">
                        <slot name="search"></slot>
                    </div>
                    <div class="button--right">
                        <slot name="btnList"></slot>
                    </div>
                </div>
                <template v-if="showOperation">
                    <el-divider content-position="left">操作</el-divider>
                    <div class="operation__button">
                        <slot name="operation"></slot>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>

<script>
import { isDescendant } from '@/utils/index';
export default {
    name: 'AsgHighSearch',
    props:{
        // 是否展示操作按钮
        showOperation:{
            type:Boolean,
            default:false
        },
        // 是否自定义搜索布局样式
        isCustomRow:{
            type:Boolean,
            default:false
        },
        foldTop:{
            type:String,
            defautl:'44px'
        },
    },
    data() {
        return {
            foldIcon: false
        };
    },
    methods:{
        handleClick(e){
            if(!this.foldIcon) return;
            const parent = document.querySelector('.wrap-flex');
            const child = e.target;
            if(!isDescendant(child,parent)){
                this.foldIcon = false;
            }
        }
    },
    mounted(){
        window.addEventListener('click',this.handleClick)
    },
    beforeDestroy(){
        window.removeEventListener('click',this.handleClick)
    }
}
</script>
<style lang='less' scoped>
@import url('../assets/mobileStyles/common/asghighSeach.less');
.wrap-flex {
    position: relative;
    .flex__content--between {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        .high-light {
            color: #f40;
            font-size: 14px;
            font-weight: 500;
        }

        .operation {
            display: flex;
            align-items: center;
            font-weight: 500;
            border: 1px solid #e7e7e7;
            cursor: pointer;
            font-size: 13px;
            padding: 6px 10px;
            border-radius: 4px;
            gap: 4px;
            height:20px;
            &:hover {
                color: #4090ef;
                border-color: #4090ef;
            }
        }
    }

    .operation_list {
        transition: 0.4s;
        padding: 24px;
        border: 1px solid #d2d2d2;
        border-top: 2px solid #f5f5f5;
        box-shadow: 1px 5px 5px #eee;
        box-sizing: border-box;
        margin-bottom: 12px;
        width: 100%;
        position: absolute;
        background: #FFF;
        z-index:999;

        .operation__button {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 24px;
        }

        .grid__container {
            display: grid;
            grid-template-columns: 70% auto;
            gap: 12px;
            .search_content{
                display: grid;
                align-items: center;
                grid-template-columns: repeat(3, 1fr);
                gap:12px 24px;
                width:100%
            }
            .button--right {
                text-align: right;
            }
        }
    }
}
</style>