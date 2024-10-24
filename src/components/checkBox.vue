<template>
    <div ref="switch" class="switch__container">
        <div ref="slider" class="slider"></div>
        <div ref="option" class="switch__option" :class="activeIndex ? 'active' : ''" @click="handleClick($event, true)">{{ activeText }}</div>
        <div ref="option" class="switch__option" :class="!activeIndex ? 'active' : ''" @click="handleClick($event, false)">{{ inactiveText }}</div>
    </div>
</template>

<script>
export default {
    name: 'CheckBox',
    data() {
        return {
            activeIndex:true
        };
    },
    props:{
        value:{
            required:true
        },
        activeText:{
            type:String,
            default:'查看'
        },
        inactiveText:{
            type:String,
            default:'编辑'
        }
    },
    mounted(){
         const options = this.$refs.option;
         const slider = this.$refs.slider;
         const { width } = options.getBoundingClientRect();
         slider.style.width = width  + 'px';
         console.log(' slider.style.width', slider.style.width);
    },
    methods:{
        handleClick(e ,index){
            this.activeIndex = index;
            const container = this.$refs.switch;
            const { left:containerLeft } = container.getBoundingClientRect();
            const { left:targetLeft, width } = e.target.getBoundingClientRect()
            console.log(containerLeft,targetLeft);
            const diff = targetLeft - containerLeft;
            const slider = this.$refs.slider;
            slider.style.left = diff - 6 + 'px';
            slider.style.width = width + 'px';
            this.$emit('update:value', index);
            
        }
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.switch__container{
    // height:34px;
    border-radius: 4px;
    background: #d4d4d4;
    display: flex;
    align-items: center;
    width: fit-content;
    padding:6px;
    z-index:0;
    position: relative;
    .slider{
        position: absolute;
        background: #fff;
        height:14px;
        z-index:1;
        padding:6px;
        left:6px;
        transition:all .3s ease-in-out;
        border-radius: 4px;
    }
    .switch__option{
        width:fit-content;
        padding:2px 12px;
        margin:0 6px;
        z-index:999;
        cursor:pointer;
        &.active{
            color:#4090EF;
        }
    }
}

</style>