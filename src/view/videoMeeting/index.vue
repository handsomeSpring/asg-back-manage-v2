<template>
    <div class="meeting--container">
        <div  v-show="allSrcLoad" class="meeting_header">
            <div class="choose--item" :class="type === item.typeCode ? 'active' : ''" v-for="item in allTypes"
                :key="item.typeCode" @click="getChoose(item)">
                {{ item.typeName }}
            </div>
        </div>
        <template v-if="loading">
            <el-skeleton :loading="loading" animated>
                <template slot="template">
                    <div class="ske-tag">
                        <el-skeleton-item variant="text" style="width: 120px;height:32px"  />
                        <el-skeleton-item variant="text" style="width:  120px;height:32px" />
                        <el-skeleton-item variant="text" style="width:  120px;height:32px" />
                        <el-skeleton-item variant="text" style="width:  120px;height:32px" />
                    </div>
                    <div class="ske-template">
                        <el-skeleton-item style="width: 240px; height: 140px;" variant="image" />
                        <el-skeleton-item style="width: 240px; height: 140px;" variant="image" />
                        <el-skeleton-item style="width: 240px; height: 140px;" variant="image" />
                    </div>
                </template>
            </el-skeleton>
        </template>
        <div v-show="allSrcLoad" class="video-container">
            <li v-show="type === item.typeCode || type === 'all'" v-for="(item, index) in allVideos" :key="index">
                <video controls @loadeddata="videoLoaded">
                    <source :src="item.url" :type="item.videoType" />
                </video>
                <div class="intro_wrap">{{ item.intro || '介绍视频' }}</div>
            </li>
            <el-empty v-show="nowVideoCount === 0" description="暂无视频"></el-empty>
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
            loading: true,
            loadedVideoCount: 0, // 记录已加载完成的视频数量
            allSrcLoad: false
        };
    },
    computed: {
        baseUrl() {
            return window.SERVE_IP + '/video/';
        },
        nowVideoCount(){
            return this.type === 'all' ? this.allVideos.length : this.allVideos.filter(item => item.typeCode === this.type).length;
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
                this.loadedVideoCount = 0;
                if (this.allVideos.length === 0) {
                    this.loading = false;
                    this.allSrcLoad = true;
                }
            } catch (error) {
                this.$toast(error.message);
            }
        },
        videoLoaded() {
            this.loadedVideoCount++;
            console.log(this.loadedVideoCount, 'loadedVideoCount');
            if (this.loadedVideoCount === this.allVideos.length) {
                this.loading = false;
                this.allSrcLoad = true;
            }
        }
    },
    created() {
        this.init();
    },
};
</script>
<style lang='less' scoped>
.ske-template {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 2rem;
    height: 180px;
}
.ske-tag{
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    gap:12px;
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
            background-color: #f5f6f8;
            color: #61666D;
            text-align: center;
            padding: 0.35em 1rem;
            font-size: 0.85rem;
            transition: background-color .3s, color .3s;
            font-weight: 500;

            &:hover {
                background: #cbced1;
                color: #18191C
            }

            &.active {
                color: #4090EF;
                border: 1px solid #4090EF;
                box-sizing: border-box;
            }
        }
    }

    .video-container {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 16px;

        li {
            box-sizing: border-box;

            video {
                width: 100%;
                border-radius: 12px 12px 0 0;
            }

            .intro_wrap {
                border: 1px solid #61666D;
                margin-top: -4px;
                font-size: 0.85rem;
                padding: 0.5em;
                font-weight: 500;
                color: #61666D;
                border-radius: 0 0 12px 12px;
            }
        }

    }

}

@media (max-width: 1024px) {
    .ske-template {
        grid-template-columns: repeat(2, 1fr) !important;
    }

    .meeting--container {
        height: calc(100dvh - 50px - 2em);
        overflow: auto;
        padding: 1em;

        .video-container {
            grid-template-columns: repeat(1, 1fr) !important;
        }
    }
}
</style>