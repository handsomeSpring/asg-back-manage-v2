<template>
    <div class="meeting--container">
        <div v-show="allSrcLoad" class="meeting_header">
            <div class="choose--item" :class="type === item.typeCode ? 'active' : ''" v-for="item in allTypes"
                :key="item.typeCode" @click="getChoose(item)">
                {{ item.typeName }}
            </div>
        </div>
        <template v-if="loading">
            <el-skeleton :loading="loading" animated>
                <template slot="template">
                    <div class="ske-tag">
                        <el-skeleton-item variant="text" style="width: 120px;height:32px" />
                        <el-skeleton-item variant="text" style="width:  120px;height:32px" />
                        <el-skeleton-item variant="text" style="width:  120px;height:32px" />
                        <el-skeleton-item variant="text" style="width:  120px;height:32px" />
                    </div>
                    <div class="ske-template">
                        <el-skeleton-item style="width: 100%; height: 240px;" variant="image" />
                        <el-skeleton-item style="width: 100%; height: 240px;" variant="image" />
                        <el-skeleton-item style="width: 100%; height: 240px;" variant="image" />
                    </div>
                </template>
            </el-skeleton>
        </template>
        <div v-show="allSrcLoad" class="video-container">
            <li v-show="type === item.typeCode || type === 'all'" v-for="(item, index) in allVideos" :key="index">
                <div class="video-wrap">
                    <img src="../../assets/images/videoPoster.png" @click="handleOpenVideo(item)">
                    <div class="video-mask">
                        <i class="el-icon-video-play"></i>
                    </div>
                </div>
                <div class="intro_wrap">{{ item.intro || '介绍视频' }}</div>
            </li>
            <el-empty v-show="nowVideoCount === 0" description="暂无视频"></el-empty>
        </div>
        <videoPlayer v-if="!isIndex" @goBack="goHome" :videoInfo="videoInfo"></videoPlayer>
    </div>
</template>

<script>
import videoPlayer from './videoPlayer.vue';
import { getByTitle } from '@/api/config';
export default {
    name: 'VideoMetting',
    components: {
        videoPlayer
    },
    data() {
        return {
            allTypes: [],
            type: 'all',
            allVideos: [],
            loading: true,
            allSrcLoad: false,
            isIndex: true,
            videoInfo: {}
        };
    },
    computed: {
        baseUrl() {
            return window.SERVE_IP + '/video/';
        },
        nowVideoCount() {
            return this.type === 'all' ? this.allVideos.length : this.allVideos.filter(item => item.typeCode === this.type).length;
        }
    },
    methods: {
        goHome() {
            this.isIndex = true;
        },
        getChoose(choose) {
            this.type = choose.typeCode;
        },
        handleOpenVideo(row) {
            this.videoInfo = row;
            this.isIndex = false;
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
            } finally {
                this.loading = false;
                this.allSrcLoad = true;
            }
        },
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

.ske-tag {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    gap: 12px;
}

.meeting--container {
    min-height: 70dvh;

    .meeting_header {
        display: flex;
        align-items: center;
        margin-bottom: 1em;
        flex-wrap: wrap;
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
            flex-shrink: 0;

            &:hover {
                color: #4090EF;
                border: 1px solid #4090EF;
            }

            &.active {
                color: #4090EF;
                border: 1px solid #4090EF;
            }
        }
    }

    .video-container {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 16px;

        li {
            box-sizing: border-box;
            .video-wrap {
                width: 100%;
                aspect-ratio: 16 / 9;
                border-radius: 12px 12px 0 0;
                overflow: hidden;
                position: relative;
                cursor: pointer;

                img {
                    width: 100%;
                    display: block;
                    height: 100%
                }

                .video-mask {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 20px;
                    background-color: rgba(0, 0, 0, 0.5);
                    /* 半透明黑色背景 */
                    z-index: 1;
                    /* 确保蒙层在视频上方 */
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;

                    i {
                        color: #fff;
                        font-size: 5rem;
                        pointer-events: none;
                    }
                }
            }

            .intro_wrap {
                border: 1px solid #61666D;
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
        grid-template-columns: repeat(1, 1fr) !important;
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