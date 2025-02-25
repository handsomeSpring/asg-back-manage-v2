<template>
    <div class="mobile-login--warp">
        <!-- logo要换成那个蓝狐上的 -->
        <img class="mobile-login-logo" src="@/assets/images/logo.png">
        <!-- 这里html你可以修改他的层级，不一定要按我的来 -->
        <div class="login-form--wrap">
            <div class="login-item--custom">
                <input class="mobile-login-input--relative" v-model="userform.username" />
            </div>
            <div class="login-item--custom">
                <input class="mobile-login-input--relative" v-model="userform.password" />
            </div>
            <div class="login-item--custom">
                <button class="mobile-login__button" @click="handleLogin">
                    登录
                    <div v-show="gettersLoading" class="loader"></div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { loginUser } from "@/api/login/index";
import { getByTitle } from "@/api/config";
import { mapGetters } from "vuex";
export default {
    name: 'MobileLogin',
    data() {
        return {
            userform: {
                username: "",
                password: "",
            }
        };
    },
    computed: {
        ...mapGetters(['gettersLoading'])
    },
    methods: {
        async login() {
            try {
                this.$store.commit("SET_FULL_LOADING", true);
                const { data, status, message } = await loginUser(this.userform);
                if (status !== 200) throw new Error(message);
                if (data.code && data.code === 404) throw new Error(data.message);
                this.$store.commit("setToken", data);
                await this.initRoles();
                this.$router.push('/mobileGuide');
            } catch (error) {
                this.$store.commit("SET_FULL_LOADING", false);
                if (error.response?.data?.message) {
                    return this.$message.error(error.response.data.message);
                }
                return this.$message.error(error.message);
            }
        },
        handleLogin() {
            if (this.gettersLoading) return;
            if (!this.userform.username || !this.userform.password) {
                this.isError = true;
                this.$toast('请完整输入账号和密码！');
                return;
            }
            this.login();
        },
        async initRoles() {
            const { data } = await getByTitle("roleList");
            this.$store.commit("initRoleList", data);
            localStorage.setItem("roleList", JSON.stringify(data));
        },
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
    height: 100dvh;
    width: 100vw;
    overflow: hidden;

    .mobile-login-logo {
        // logo
    }

    // 登录主体区域
    .login-form--wrap {

        // 每一项
        .login-item--custom {

            // 按钮类
            .mobile-login__button {}

            // 输入框类
            .mobile-login-input--relative {
                border: 1px solid #000;
                margin: 1em;
            }

        }
    }
}


// 动画loading
/* HTML: <div class="loader"></div> */
.loader {
    width: 24px;
    --b: 4px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, #c5dbeb) content-box;
    -webkit-mask: repeating-conic-gradient(#0000 0deg,
            #000 1deg 20deg,
            #0000 21deg 36deg),
        radial-gradient(farthest-side,
            #0000 calc(100% - var(--b) - 1px),
            #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: l4 1s infinite steps(10);
}

@keyframes l4 {
    to {
        transform: rotate(1turn);
    }
}

@keyframes showOpacity {
    0% {
        opacity: 0;
        transform: translateY(-80px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>