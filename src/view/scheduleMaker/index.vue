<template>
    <div class="grid__container">
        <el-card class="card__left" shadow="none">
            <p class="asg__title--primary">操作区域</p>
            <el-scrollbar style="height:70vh">
                <el-collapse accordion>
                    <el-collapse-item title="赛事信息" name="1">
                        <label class="asg__label">赛事名称</label>
                        <input class="asg__input--primary" v-model="gameInfo.name"
                            @focus="handleFocus('gameName', $event)" @blur="handleBlur('gameName', $event)">
                        <label class="asg__label">第一阶段比赛时间</label>
                        <input class="asg__input--primary" v-model="gameInfo.firstDate"
                            @focus="handleFocus('firstDate', $event)" @blur="handleBlur('firstDate', $event)">
                        <label class="asg__label">第一阶段比赛标题</label>
                        <input class="asg__input--primary" v-model="gameInfo.firstContent"
                            @focus="handleFocus('firstContent', $event)" @blur="handleBlur('firstContent', $event)">
                        <label class="asg__label">第二阶段比赛时间</label>
                        <input class="asg__input--primary" v-model="gameInfo.secondDate"
                            @focus="handleFocus('secondDate', $event)" @blur="handleBlur('secondDate', $event)">
                        <label class="asg__label">第二阶段比赛标题</label>
                        <input class="asg__input--primary" v-model="gameInfo.secondContent"
                            @focus="handleFocus('secondContent', $event)" @blur="handleBlur('secondContent', $event)">
                        <label class="asg__label">比赛日期</label>
                        <input class="asg__input--primary" v-model="gameInfo.time" @focus="handleFocus('time', $event)"
                            @blur="handleBlur('time', $event)">
                    </el-collapse-item>
                    <el-collapse-item title="赛程信息" name="2">
                        <template v-if="scheduleData.length > 0">
                            <li v-for="(item, index) in scheduleData" :key="index">
                                <el-divider>赛程{{ index + 1 }}</el-divider>
                                <label class="asg__label">比赛时间</label>
                                <input class="asg__input--primary" v-model="item.time"
                                    @focus="handleFocus(`gameTime-${index.toString()}`, $event)"
                                    @blur="handleBlur(`gameTime-${index.toString()}`, $event)">
                                <label class="asg__label">左战队LOGO</label>
                                <input type="file" @input="handleChange($event, 'teamLogoLeft', index)">
                                <label class="asg__label">右战队LOGO</label>
                                <input type="file" @input="handleChange($event, 'teamLogoRight', index)">
                                <label class="asg__label">左战队名</label>
                                <input class="asg__input--primary" v-model="item.teamNameLeft"
                                    @focus="handleFocus(`teamLeft-${index.toString()}`, $event)"
                                    @blur="handleBlur(`teamLeft-${index.toString()}`, $event)">
                                <label class="asg__label">右战队名</label>
                                <input class="asg__input--primary" v-model="item.teamNameRight"
                                    @focus="handleFocus(`teamRight-${index.toString()}`, $event)"
                                    @blur="handleBlur(`teamRight-${index.toString()}`, $event)">
                                <br>
                                <el-button style="margin-top:12px;" type="danger" size="small"
                                    @click="deleteItem(index)">删除赛程</el-button>
                            </li>
                        </template>
                        <el-empty v-else description="请添加赛程"></el-empty>
                    </el-collapse-item>
                    <el-collapse-item title="操作" name="3">
                        <el-button size="small" type="primary" @click="pushSchedule">添加赛程</el-button>
                        <el-button size="small" @click="handleOnExport">导出赛程图</el-button>
                    </el-collapse-item>
                </el-collapse>
            </el-scrollbar>
        </el-card>
        <div ref="imageWrapper" class="model__content--right">
            <div id="gameName" class="name__content">{{ gameInfo.name }}</div>
            <div id="firstDate" class="first__date golden">{{ gameInfo.firstDate }}</div>
            <div id="firstContent" class="first__content golden">{{ gameInfo.firstContent }}</div>
            <div id="secondDate" class="second__date golden">{{ gameInfo.secondDate }}</div>
            <div id="secondContent" class="second__content golden">{{ gameInfo.secondContent }}</div>
            <div id="time" class="time__content">{{ gameInfo.time }}</div>
            <div class="list" v-for="(item, index) in scheduleData" :key="index" :style="{
                '--top': item.percent
            }">
                <div :id="`gameTime-${index.toString()}`" class="game__time team__name--color">{{ item.time }}</div>
                <div :id="`teamLeft-${index.toString()}`" class="game__name__left team__name--color">{{
                    item.teamNameLeft }}</div>
                <div class="game__logo__left">
                    <img :src="item.teamLogoLeft">
                </div>
                <div class="game__logo__right">
                    <img :src="item.teamLogoRight">
                </div>
                <div :id="`teamRight-${index.toString()}`" class="game__name__right team__name--color">{{
                    item.teamNameRight }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas';
export default {
    name: 'scheduleMaker',
    data() {
        return {
            scheduleData: [],
            gameInfo: {
                time: '10月7日 星期天',
                name: '第四届ASG高校赛',
                firstDate: '10.03-10.07',
                firstContent: '海选赛',
                secondDate: '10.14-10.24',
                secondContent: '淘汰赛'
            },
        };
    },
    methods: {
        handleOnExport() {
            const clientWidth = this.$refs.imageWrapper.offsetWidth;
            const clientHeight = this.$refs.imageWrapper.offsetHeight;
            const kh = [clientWidth, clientHeight];
            html2canvas(this.$refs.imageWrapper,
                {
                    useCORS: true,
                    logging: true,
                    allowTaint: true,
                    background: null, // 一定要添加背景颜色，否则出来的图片，背景全部都是透明的
                    scale: 2, // 处理模糊问题
                    dpi: 360, // 处理模糊问题
                }).then((canvas) => {
                    const dataURL = canvas.toDataURL('image/png');
                    this.download(dataURL, kh);
                });
        },
        download(imgUrl, kh) {
            this.getUrlBase64(imgUrl, kh).then((base64) => {
                const link = document.createElement('a');
                link.href = base64;
                link.download = '赛程模板图';
                link.click();
            });
        },
        getUrlBase64(url, kh) {
            return new Promise((resolve) => {
                let canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.crossOrigin = window.SERVE_IP; // 允许跨域
                img.src = url;
                img.onload = () => {
                    // eslint-disable-next-line prefer-destructuring
                    canvas.height = kh[1];
                    // eslint-disable-next-line prefer-destructuring
                    canvas.width = kh[0];
                    ctx.drawImage(img, 0, 0, kh[0], kh[1]);
                    const dataURL = canvas.toDataURL('image/png');
                    canvas = null;
                    resolve(dataURL);
                };
            });
        },
        deleteItem(index) {
            this.scheduleData.splice(index, 1)
        },
        handleFocus(id, e) {
            const dom = document.getElementById(id);
            dom.style.border = '2px dashed yellow';
        },
        handleBlur(id, e) {
            const dom = document.getElementById(id);
            dom.style.border = '';
        },
        handleChange(e, prop, index) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            const self = this;
            reader.onload = function (e) {
                const imgUrl = e.target.result;
                self.$set(self.scheduleData[index], prop, imgUrl);
            }

        },
        pushSchedule() {
            this.scheduleData.push({
                time: '01-01',
                teamLogoLeft: '',
                teamLogoRight: '',
                teamNameLeft: '待填写',
                teamNameRight: '待填写',
                percent: (45 + this.scheduleData.length * 9) + '%'
            })
        }
    },
}
</script>
<style lang='less' scoped>
.grid__container {
    display: grid;
    align-items: flex-start;
    grid-template-columns: 300px auto;
    gap: 24px;
    height: 80vh;

    .card__left {
        height: 70vh;
        padding-bottom: 64px;
    }

    .model__content--right {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: url('../.././assets/images/gamePic.jpg');
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;

        .team__name--color {
            color: #678da5;
            font-size: 18px;
            font-weight: bold;
        }

        .name__content {
            position: absolute;
            color: #7b898e;
            font-weight: bold;
            font-size: 1.2rem;
            top: 5%;
            left: 50%;
            transform: translate(-50%, 0);
        }

        .golden {
            color: #dfcf9e;
            font-size: 16px;
        }

        .first__date {
            width:100px;
            text-align: center;
            position: absolute;
            left: 27%;
            top: 18%;
        }

        .first__content {
            width:100px;
            text-align: center;
            position: absolute;
            left: 27%;
            top: 24%;
        }

        .second__date {
            width:100px;
            text-align: center;
            position: absolute;
            left: 65%;
            top: 18%;
        }

        .second__content {
            width:100px;
            text-align: center;
            position: absolute;
            left: 65%;
            top: 24%;
        }

        .time__content {
            position: absolute;
            color: #7b898e;
            font-weight: bold;
            font-size: 1.5rem;
            left: 49%;
            top: 36%;
            transform: translate(-50%, 0);
        }

        .game__time {
            position: absolute;
            left: 10%;
            top: var(--top);
        }

        .game__name__left {
            position: absolute;
            left: 20%;
            width: 15%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-align: right;
            top: var(--top);
        }

        .game__name__right {
            position: absolute;
            left: 79%;
            width: 15%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            top: var(--top);
            transform: translate(-100%, 0);
        }

        .game__logo__left {
            position: absolute;
            left: 41%;
            top: calc(var(--top) - 8px);

            img {
                width: 40px;
                height: 40px;
            }
        }

        .game__logo__right {
            position: absolute;
            left: 58%;
            top: calc(var(--top) - 8px);
            transform: translate(-100%, 0);

            img {
                width: 40px;
                height: 40px;
            }
        }
    }
}
</style>