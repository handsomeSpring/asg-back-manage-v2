<template>
    <div class="mobile-user-info-container">
        <header>
            <el-image :src="avatar" class="user-avatar" @click="uploadAvatar">
                <div slot="error">
                    <img class="error-image" src="@/assets/images/logo.png" @click="uploadAvatar"/>
                </div>
            </el-image>
            <p class="avatar-click" @click="uploadAvatar">点击修改头像</p>
        </header>
        <input id="avatar" type="file" style="display: none" @input="beforeInputAvatar" />
        <main>
            <li class="list-item">
                <p class="title">中文名</p>
                <p class="user-text">{{ userInfo.chinaname }}</p>
            </li>
            <li class="list-item">
                <p class="title">序编号</p>
                <p class="user-text">{{ userInfo.id }}</p>
            </li>
            <li class="list-item">
                <p class="title">职位</p>
                <p class="user-text">{{ userInfo.officium | filterRole }}</p>
            </li>
            <li class="list-item">
                <p class="title">积分</p>
                <p class="user-text active">{{ userInfo.money ?? "未开启积分" }}</p>
            </li>
            <li class="list-item">
                <p class="title">菜单权限</p>
                <p class="user-text">{{ userInfo.roleListName || '游客' }}</p>
            </li>
        </main>
    </div>
</template>

<script>
import { uploadImg } from "@/api/home/index.js";
import { mapGetters } from 'vuex';
export default {
    name: 'userInfo',
    computed: {
        ...mapGetters(['userInfo']),
        avatar() {
            return this.userInfo.base64 || sessionStorage.getItem("baseImg");
        },
    },
    methods: {
        uploadAvatar() {
            const ipt = document.getElementById("avatar");
            ipt.click();
        },
        beforeInputAvatar(e) {
            try {
                const fileTypes = ["JPEG", "JPEG", "PNG"]; //文件后缀只能是这五类
                const maxSize = 1024;
                const file = e.target.files[0];
                const fileType = file.type.split("/").at(-1).toUpperCase();
                const fileSize = file.size / 1024;
                if (!fileTypes.includes(fileType))
                    throw new Error("头像只允许是JPG、JPEG、或者是PNG类型");
                if (fileSize > maxSize) throw new Error("图片不能超过1MB");
                const reader = new FileReader();
                reader.readAsDataURL(file);
                const vue = this;
                reader.onload = async function (event) {
                    const fileBase = event.target.result;
                    const { status } = await uploadImg(fileBase);
                    if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
                    vue.$toast("上传成功");
                    vue.$store.commit("SET_LOGO", fileBase);
                };
            } catch (error) {
                this.$message.error(error.message);
            }
        },
    }
}
</script>
<style lang='less' scoped>
.mobile-user-info-container {
    height: 100%;
    width: 100vw;

    header {
        height: 30%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;

        // 头像
        .user-avatar {
            width: 10vh;
            height: 10vh;
            border-radius: 50%;
            border: 2px solid #e7e7e7;
        }

        .error-image {
            width: 10vh;
            height: 10vh;
            background-color: #e7e7e7;
        }

        .avatar-click {
            color: #aeb2b6;
            font-size: 0.9em;
        }
    }

    main {
        padding: 0 1em;

        .list-item {
            display: flex;
            align-items: center;
            padding: 1em 0;
            border-bottom: 1px solid #e7e7e7;

            .title {
                color: #858a8e;
                font-size: 0.8em;
                width: 20%;
            }

            .user-text {
                color: #333;
                font-size: 0.9em;
                font-family: 'hk';
                &.active{
                    color:#0089f3;
                }
            }
        }
    }
}
</style>