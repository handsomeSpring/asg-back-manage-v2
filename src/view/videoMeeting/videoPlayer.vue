<template>
    <div class="video-player">
        <div class="mobile-layout__header">
            <div @click="handleRouterBack">
                <i class="el-icon-arrow-left"></i>
            </div>
            <h2>视频播放</h2>
        </div>
        <div class="video-container">
            <h2 class="video-title">{{ videoInfo.intro }}</h2>
            <p class="copyright-text"><i class="el-icon-warning"></i>未经作者授权，禁止转载</p>
            <div class="video-wrap">
                <div v-if="!isInit" class="video-mask">
                    <div class="loading26">
                        <span class="round26">
                        </span>
                        <span class="round26">
                        </span>
                        <span class="round26">
                        </span>
                        <span class="round26">
                        </span>
                    </div>
                    <p>视频缓冲中...</p>
                </div>
                <video muted autoplay controls @canplay="canPlayVideo">
                    <source :src="videoInfo.url" :type="videoInfo.videoType" />
                </video>
            </div>
            <div class="belong-container">
                <div class="tag">ASG内部培训视频</div>
                <div class="tag">{{ videoInfo.typeCode }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'videoPlayer',
    props: {
        videoInfo: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
           isInit:false
        };
    },
    methods: {
        handleRouterBack() {
            console.log('触发了吗！222');
            this.$emit('goBack');
        },
        canPlayVideo(){
            setTimeout(()=>{
               this.isInit = true;
            }, 2000)
        },
    }
}
</script>
<style lang='less' scoped>
@--main-color: #0089f3;

.video-player {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 888;
    overflow: auto;

    .mobile-layout__header {
        display: grid;
        align-items: center;
        grid-template-columns: 10% 80% 10%;
        height: 50px;
        background: @--main-color;

        i {
            color: #fff;
            margin-left: 1em;
            font-size: 1.1em;
        }

        h2 {
            color: #fff;
            font-size: 1.1em;
            font-family: 'hk';
            margin: 0 auto;
        }

        .asg-operation-icon {
            margin-right: 1em;
            font-size: 24px;
            color: #fff;
            cursor: pointer;
        }
    }

    .video-container {
        width: 95%;
        margin: 1em auto;

        .video-title {
            font-size: 20px;
            font-weight: 500;
            color: #18191C;
            line-height: 28px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .copyright-text {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            color: #9099A0;
            margin: 0.5rem 0;
            font-size: 0.85rem;
        }

        .video-wrap {
            position: relative;

            video {
                width: 100%;
                content-visibility: visible;
                aspect-ratio: 16 / 9;

            }

            .video-mask {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: #18191C;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap:1rem;
                p{
                    color:#fff;
                    font-size: 0.85rem;
                }

                .loading26 {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-content: space-between;
                    animation: loading26-eff 3s linear infinite;
                }

                @keyframes loading26-eff {
                    0% {
                        transform: scale(1) rotate(0);
                    }

                    20% {
                        transform: scale(1) rotate(72deg);
                    }

                    40% {
                        transform: scale(0.5) rotate(144deg);
                    }

                    60% {
                        transform: scale(0.5) rotate(216deg);
                    }

                    80% {
                        transform: scale(1) rotate(288deg);
                    }

                    100% {
                        transform: scale(1) rotate(360deg);
                    }
                }

                .round26 {
                    width: 20px;
                    height: 20px;
                    display: block;
                    border-radius: 20px 20px 20px 20px;
                    box-sizing: border-box;
                }

                .round26:nth-of-type(1) {
                    background-color: #4090EF;
                    animation: round-eff261 3s linear infinite;
                }

                .round26:nth-of-type(2) {
                    background-color: #4ba7ec;
                    animation: round-eff262 3s linear infinite;
                }

                .round26:nth-of-type(3) {
                    background-color: #5d9dec;
                    animation: round-eff263 3s linear infinite;
                }

                .round26:nth-of-type(4) {
                    background-color: #4057ef;
                    animation: round-eff264 3s linear infinite;
                }

                @keyframes round-eff261 {
                    0% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    20% {
                        border-radius: 20px 20px 20px 20px;
                    }

                    40% {
                        border-radius: 20px 20px 0 20px;
                    }

                    60% {
                        border-radius: 20px 20px 0 20px;
                    }

                    80% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    100% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }
                }

                @keyframes round-eff262 {
                    0% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    20% {
                        border-radius: 20px 20px 20px 20px;
                    }

                    40% {
                        border-radius: 20px 20px 20px 0;
                    }

                    60% {
                        border-radius: 20px 20px 20px 0;
                    }

                    80% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    100% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }
                }

                @keyframes round-eff263 {
                    0% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    20% {
                        border-radius: 20px 20px 20px 20px;
                    }

                    40% {
                        border-radius: 20px 0 20px 20px;
                    }

                    60% {
                        border-radius: 20px 0 20px 20px;
                    }

                    80% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    100% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }
                }

                @keyframes round-eff264 {
                    0% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    20% {
                        border-radius: 20px 20px 20px 20px;
                    }

                    40% {
                        border-radius: 0 20px 20px 20px;
                    }

                    60% {
                        border-radius: 0 20px 20px 20px;
                    }

                    80% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }

                    100% {
                        border-radius: 20px 20px 20px 20px 20px;
                    }
                }
            }
        }


        .belong-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 1em;
            padding: 1rem 0;
            border-bottom: 1px solid #61666D;

            .tag {
                color: #61666D;
                background: #F1F2F3;
                height: 28px;
                line-height: 28px;
                border-radius: 14px;
                font-size: 13px;
                padding: 0 12px;
                box-sizing: border-box;
                transition: all .3s;
                display: inline-flex;
                align-items: center;
                cursor: pointer;
            }
        }
    }
}
</style>