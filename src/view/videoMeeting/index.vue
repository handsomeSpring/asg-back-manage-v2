<template>
    <div class="meeting--container">
        <div class="meeting_header">
            <div class="choose--item" :class="type === item.typeCode ? 'active' : ''" v-for="item in allTypes"
                :key="item.typeCode" @click="getChoose(item)">
                {{ item.typeName }}
            </div>
        </div>
        <template v-if="loading">
                <el-skeleton :loading="loading" animated>
                    <template slot="template">
                        <div class="ske-template">
                            <el-skeleton-item style="width: 240px; height: 140px;"  variant="image" />
                            <el-skeleton-item style="width: 240px; height: 140px;" variant="image" />
                            <el-skeleton-item style="width: 240px; height: 140px;"  variant="image" />
                        </div>
                    </template>
                </el-skeleton>
            </template>
        <div  v-else class="video-container">
            <template>
                <video controls v-for="(item, index) in nowChooseVideo" :key="index">
                    <source :src="item.url" :type="item.videoType" />
                </video>
            </template>
        </div>
    </div>
</template>

<script>
import { getByTitle } from '@/api/config';
export default {
    name: 'VideoMetting',
    data() {
        return {
            allTypes: [],
            type: 'all',
            allVideos: [],
            loading:true,
        };
    },
    computed: {
        baseUrl() {
            return window.SERVE_IP + '/video/';
        },
        nowChooseVideo() {
            if (this.type === 'all') {
                return this.allVideos;
            } else {
                return this.allVideos.filter(item => item.typeCode === this.type);
            }
        }
    },
    methods: {
        getChoose(choose) {
            this.type = choose.typeCode;
        },
        async init() {
            try {
                this.loading = true;
                const [r1, r2] = await Promise.all([getByTitle('videoType'), getByTitle('videoUrl')]);
                if (r1.status !== 200 || r2.status !== 200) throw new Error('获取videoType，videoUrl全局参数失败！');
                this.allTypes = r1.data;
                this.allVideos = r2.data;
            } catch (error) {
                this.$toast(error.message);
            }finally{
                 this.$nextTick(()=>{
                    this.loading = false;
                 })
            }

        }
    },
    created() {
        this.init();
    },
}
</script>
<style lang='less' scoped>
.ske-template{
    display: grid;
    grid-template-columns: repeat(6,1fr);
    gap:2rem;
    height: 180px;
}
.meeting--container {
    min-height: 70dvh;

    .meeting_header {
        display: flex;
        align-items: center;
        margin-bottom: 1em;
        gap: 1rem;

        .choose--item {
            cursor: pointer;
            display: inline-block;
            box-sizing: content-box;
            width: fit-content;
            border: 1px solid #F1F2F3;
            border-radius: 6px;
            background-color: #F6F7F8;
            color: #61666D;
            text-align: center;
            padding: 0.2em 1rem;
            font-size: 0.85rem;
            transition: background-color .3s, color .3s;
            font-weight: 500;

            &:hover {
                background: #E3E5E7;
                color: #18191C
            }

            &.active {
                color: #4090EF;
            }
        }
    }

    .video-container {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 16px;

        video {
            width: 100%;
            border-radius: 12px;
        }
    }

}
</style>