<template>
    <label class="label47" @click="handleClick">
        <input type="checkbox" class="checkbox47" />
        <div class="status47">
        </div>
    </label>
</template>

<script>
export default {
    name: 'AsgLightDayChange',
    data() {
        return {

        };
    },
    methods: {
        handleClick($event){
            this.$emit('handleChange','5',$event);
        }
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.label47 {
    margin-right:16px;
    width: 30px;
    height: 30px;
    border: 2px solid #fff;
    position: relative;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: -6px 6px 0 #fff;
    box-sizing: border-box;
    transition: all 0.1s;
}

.checkbox47 {
    display: none;
}

.status47 {
    width: 15px;
    height: 15px;
    background-color: transparent;
    box-shadow: inset -6px -4px 0 #fff;
    border-radius: 50%;
    position: absolute;
    top: 6px;
    left: 6px;
    box-sizing: border-box;
    transition: all 0.4s;
}

.label47:active {
    box-shadow: 0px 0px #fff;
    transform: translate(-3px, 3px);
}

.checkbox47:checked+.status47 {
    width: 12px;
    height: 12px;
    box-shadow: inset -15px -15px 0 #fff;
    top: 8px;
    left: 8px;
}

.checkbox47:checked+.status47:after {
    content: "";
    width: 5px;
    height: 5px;
    background-color: #fff;
    box-shadow: 0 9px 0 -2px #fff, 9px 0 0 -2px #fff, 0 -9px 0 -2px #fff, -9px 0 0 -1px #fff, -6px 6px 0 -2px #fff, -6px -6px 0 -4px #fff, 6px -6px 0 -2px #fff, 6px 6px 0 -2px #fff;
    border-radius: 50%;
    position: absolute;
    top: 3.5px;
    left: 3.5px;
    box-sizing: border-box;
    animation: anieff47 0.4s ease-out forwards;
}

@keyframes anieff47 {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
</style>