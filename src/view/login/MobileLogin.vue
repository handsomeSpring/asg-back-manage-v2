<template>
    <div class="mobile-login--warp">
        <!-- logo要换成那个蓝狐上的 -->
        <img class="mobile-login-logo" src="@/assets/images/logo.png">
        <!-- 这里html你可以修改他的层级，不一定要按我的来 -->
        <div class="login-form--wrap">
            <div class="login-item--custom" >
                <input v-model="form.userName"/>
            </div>
            <div class="login-item--custom" >
                <input v-model="form.password"/>
            </div>
            <div class="login-item--custom" >
              <button class="my-button">登录</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MobileLogin',
    data() {
        return {
            form: {}
        };
    },
    methods: {

    },
    created() {

    },
}
</script>
<style lang='less' scoped>
@--main-color: #0089f3;
//主蓝色色调
// 备注：使用em、rem为单位，不要使用px，
//多使用flex 和 grid布局，少使用float
// 蓝湖上面的图下载了放src\assets\images目录下
// 主体框架
.mobile-login--warp {
    height:100dvh;
    width: 100vw;
    overflow: hidden;
    .mobile-login-logo{
        // logo
    }
    // 登录主体区域
    .login-form--wrap {

        // 每一项
        .login-item--custom{

        }
    }
}
</style>