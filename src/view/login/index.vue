<template>

  <div class="relative min-h-screen flex">
    <div class="
                    flex flex-col
                    sm:flex-row
                    items-center
                    md:items-start
                    sm:justify-center
                    md:justify-start
                    flex-auto
                    min-w-0
                    bg-white
                ">
      <div class="
                        bg-image
                        sm:w-1/2
                        xl:w-3/5
                        h-full
                        hidden
                        md:flex
                        flex-auto
                        items-center
                        justify-center
                        p-10
                        overflow-hidden
                        bg-purple-900
                        text-white
                        bg-no-repeat bg-cover
                        relative
                    ">
        <div class="
                            absolute
                            bg-gradient-to-b
                            from-indigo-600
                            to-blue-500
                            opacity-75
                            inset-0
                            z-0
                        "></div>
        <div class="w-full max-w-md z-10">
          <div class="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">AvengerS Gaming</div>
          <div class="sm:text-sm xl:text-md text-gray-200 font-normal">
            第五人格ASG赛事后台管理系统，致力于结合数字化时代，多措并举，创办高效、高质量第五人格民间比赛。</div>
        </div>
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="
                        md:flex md:items-center md:justify-center
                        w-full
                        sm:w-auto
                        md:h-full
                        w-2/5
                        xl:w-2/5
                        p-8
                        md:p-10
                        lg:p-14
                        sm:rounded-lg
                        md:rounded-none
                        bg-white
                    ">
        <div class="max-w-md w-full mx-auto space-y-8">
          <div class="text-center">
            <h2 class="mt-6 text-3xl font-bold text-gray-900">欢迎登录!</h2>
          </div>
          <div class="flex flex-row justify-center items-center space-x-3">
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="
                                    w-11
                                    h-11
                                    items-center
                                    justify-center
                                    inline-flex
                                    rounded-2xl
                                    font-bold
                                    text-lg
                                    bg-blue-900
                                    hover:shadow-lg
                                    cursor-pointer
                                    transition
                                    ease-in
                                    duration-300
                                "><img class="w-4 h-4" src="../../assets/images/person.png" /></a>
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="
                                    w-11
                                    h-11
                                    items-center
                                    justify-center
                                    inline-flex
                                    rounded-2xl
                                    font-bold
                                    text-lg text-white
                                    bg-blue-400
                                    hover:shadow-lg
                                    cursor-pointer
                                    transition
                                    ease-in
                                    duration-300
                                "><img class="w-4 h-4" src="../../assets/images/logo_black.png" /></a>
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="
                                    w-11
                                    h-11
                                    items-center
                                    justify-center
                                    inline-flex
                                    rounded-2xl
                                    font-bold
                                    text-lg text-white
                                    bg-blue-500
                                    hover:shadow-lg
                                    cursor-pointer
                                    transition
                                    ease-in
                                    duration-300
                                "><img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0yMy45OTQgMjR2LS4wMDFoLjAwNnYtOC44MDJjMC00LjMwNi0uOTI3LTcuNjIzLTUuOTYxLTcuNjIzLTIuNDIgMC00LjA0NCAxLjMyOC00LjcwNyAyLjU4N2gtLjA3di0yLjE4NWgtNC43NzN2MTYuMDIzaDQuOTd2LTcuOTM0YzAtMi4wODkuMzk2LTQuMTA5IDIuOTgzLTQuMTA5IDIuNTQ5IDAgMi41ODcgMi4zODQgMi41ODcgNC4yNDN2Ny44MDF6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtLjM5NiA3Ljk3N2g0Ljk3NnYxNi4wMjNoLTQuOTc2eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIuODgyIDBjLTEuNTkxIDAtMi44ODIgMS4yOTEtMi44ODIgMi44ODJzMS4yOTEgMi45MDkgMi44ODIgMi45MDkgMi44ODItMS4zMTggMi44ODItMi45MDljLS4wMDEtMS41OTEtMS4yOTItMi44ODItMi44ODItMi44ODJ6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PC9nPjwvc3ZnPg=="
                class="w-4 h-4" /></a>
          </div>
          <div class="flex items-center justify-center space-x-2">
            <span class="h-px w-16 bg-gray-200"></span>
            <span class="text-gray-300 font-normal">使用用户名登录</span>
            <span class="h-px w-16 bg-gray-200"></span>
          </div>
          <div class="mt-8 space-y-6">
            <input type="hidden" name="remember" value="true" />
            <div class="relative">
              <label class="ml-3 text-sm font-bold text-gray-700 tracking-wide">用户名</label>
              <input v-model="userform.username" @focus="isError = false" :class="isError ? 'error-input' : ''" class="
                                        w-full
                                        text-base
                                        px-4
                                        py-2
                                        border-b border-gray-300
                                        focus:outline-none
                                        rounded-2xl
                                        focus:border-indigo-500
                                    " type="" placeholder="请输入用户名" />
            </div>
            <div class="mt-8 content-center">
              <label class="ml-3 text-sm font-bold text-gray-700 tracking-wide">密码</label>
              <input v-model="userform.password" @focus="isError = false" :class="isError ? 'error-input' : ''" class="
                                        w-full
                                        content-center
                                        text-base
                                        px-4
                                        py-2
                                        border-b
                                        rounded-2xl
                                        border-gray-300
                                        focus:outline-none focus:border-indigo-500
                                    " type="password" placeholder="请输入密码" />
            </div>
          </div>
          <!-- 底部按钮 -->
          <div>
            <div class="my-12">
              <button @click="handleLogin" class="
                                        w-full
                                        flex
                                        justify-center
                                        bg-gradient-to-r
                                        from-indigo-500
                                        to-blue-600
                                        hover:bg-gradient-to-l
                                        hover:from-blue-500
                                        hover:to-indigo-600
                                        text-gray-100
                                        p-4
                                        rounded-full
                                        tracking-wide
                                        font-semibold
                                        shadow-lg
                                        cursor-pointer
                                        transition
                                        ease-in
                                        duration-500
                                    ">登 录<div v-show="gettersLoading" class="ml-2 loader"></div></button>
            </div>
            <p class="
                                    items-center
                                    justify-center
                                    mt-10
                                    text-center text-md text-gray-500
                                ">
              <span>还没有账号？</span>
              <a href="https://commentary.idvasg.cn/#/" target="_blank" class="
                                        text-indigo-400
                                        hover:text-blue-500
                                        no-underline
                                        hover:underline
                                        cursor-pointer
                                        transition
                                        ease-in
                                        duration-300
                                    ">立即注册</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "@/api/login/index";
import { getByTitle } from "@/api/config";
import { mapGetters } from "vuex";
import { isMobile } from '@/utils/index';
export default {
  name: "LoginComp",
  computed: {
    ...mapGetters(['gettersLoading'])
  },
  data() {
    return {
      userform: {
        username: "",
        password: "",
      },
      inputtype: "password",
      isError: false,
      isMobile: false,
    };
  },
  created() {
    this.isMobile = isMobile();
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
        const path = isMobile() ? '/mobileGuide' : '/guide';
        this.$router.push(path);
      } catch (error) {
        this.$store.commit("SET_FULL_LOADING", false);
        if (error.response?.data?.message) {
          return this.$message.error(error.response.data.message);
        }
        return this.$message.error(error.message);
      }
    },
    toggleEye() {
      if (this.eye_status === "el-icon-lock") {
        this.eye_status = "el-icon-unlock";
        this.inputtype = "text";
      } else {
        this.eye_status = "el-icon-lock";
        this.inputtype = "password";
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
};
</script>

<style scoped lang="less">
@import url('../../assets/mobileStyles/login/style.css');
</style>
