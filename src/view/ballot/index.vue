<template>
  <div>
    <el-container>
      <el-aside width="200px" style="height: 70vh">
        <el-steps direction="vertical" :active="activeName">
          <el-step title="选择战队" description="选择若干个需要抽签的战队">
            <template slot="icon">
              <svg-icon
                iconClass="choice"
                width="20px"
                height="20px"
              ></svg-icon>
            </template>
          </el-step>
          <el-step title="洗牌环节" description="打乱所选取战队的顺序">
            <template slot="icon">
              <svg-icon
                iconClass="shuffle"
                width="20px"
                height="20px"
              ></svg-icon>
            </template>
          </el-step>
          <el-step title="比赛模式" description="小组赛、淘汰赛模式">
            <template slot="icon">
              <svg-icon iconClass="text" width="20px" height="20px"></svg-icon>
            </template>
          </el-step>
          <el-step
            icon="el-icon-menu"
            title="翻牌环节"
            description="翻牌随机选择战队"
          >
            <template slot="icon">
              <svg-icon iconClass="view" width="20px" height="20px"></svg-icon>
            </template>
          </el-step>
        </el-steps>
      </el-aside>
      <el-main>
        <!-- 填入战队 -->
        <div v-if="activeName === 1" class="first">
          <el-container>
            <el-aside width="300px">
              <el-input
                style="width: 250px"
                v-model="nowTeam"
                size="small"
                @keyup.enter.native="addNew"
              >
                <el-button size="small" slot="append" @click="addNew"
                  >添加</el-button
                >
              </el-input>
              <div class="number-count">
                <p>目前已添加战队数：</p>
                <p class="fontWeight">{{ teamList.length }}个</p>
              </div>
            </el-aside>
            <el-main>
              <div class="wrap">
                <div v-if="teamList.length !== 0" class="tag-wrap">
                  <el-tag
                    v-for="(tag, index) in teamList"
                    :key="index"
                    closable
                    @close="closeTag(index)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <el-empty v-else description="请选择抽取的队伍"></el-empty>
              </div>
            </el-main>
          </el-container>
        </div>
        <!-- 抽签 -->
        <div v-if="activeName === 2" class="second">
          <Second
            ref="secondRef"
            @finish="finish"
            :url="url"
            :time="time"
            @loadingStart="loadingStart"
            @loadingEnd="loadingEnd"
          >
          </Second>
        </div>
        <!-- 选择翻牌模式 -->
        <div v-if="activeName === 3" class="cq_mode">
          <BallotModeChoose ref="BallotModeChoose" :mode.sync="ballotMode"></BallotModeChoose>
        </div>
        <!-- 最后一组 -->
        <div v-if="activeName === 4" class="third">
          <div class="card-wrap">
            <Card
              :maxTeamNum="maxTeamNum"
              :groups="groups"
              :groupIndex="groupIndex"
              @addItem="addInGroup"
              v-for="(item, index) in teamList"
              :key="index"
              :back="item"
            ></Card>
          </div>
          <div class="group-wrap">
            <div
              :class="{ active: groupIndex === index }"
              class="group"
              v-for="(item, index) in groups"
              :key="index"
              @click="handleChooseGroup(index)"
            >
              <div class="title">第{{ index + 1 }}组</div>
              <div class="team-wrap">
                <p v-for="el in groups[index]">{{ el }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      <el-dialog
        title="设置时间(秒)"
        width="30%"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
      >
        <el-input-number
          size="small"
          v-model.number="time"
          :min="5"
          :max="60"
          label="请填写抽签时间"
        ></el-input-number>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="
              dialogVisible = false;
              time = 5;
            "
            size="small"
            >取 消</el-button
          >
          <el-button size="small" type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-container>
    <button-fix>
      <div class="btn_list">
        <div v-if="activeName === 1">
          <el-button size="small" type="primary" @click="inBallot"
            >选取完毕，进入下一步</el-button
          >
        </div>
        <div v-if="activeName !== 1">
          <el-button size="small" @click="returnBack" plain
            ><i class="el-icon-arrow-left"></i>返回上一步</el-button
          >
        </div>
        <div class="btn_list" v-if="activeName === 2">
          <el-button size="small" type="warning" @click="setTime"
            >抽取时间(默认5秒)</el-button
          >
          <el-upload
            class="upload-demo"
            action="/"
            :show-file-list="false"
            :on-change="handleUpload"
            accept="jpg"
            :before-upload="beforeAvatarUpload"
            :limit="1"
          >
            <el-button size="small" type="primary"> 选择音乐 </el-button>
          </el-upload>
          <el-button
            class="extract-wrap"
            size="small"
            type="primary"
            :loading="loading"
            @click="shuffle"
            >洗牌</el-button
          >
        </div>
        <div v-if="activeName === 3">
          <el-button size="small" type="primary" @click="inLastCur"
            >进入翻拍环节</el-button
          >
        </div>
      </div>
    </button-fix>
  </div>
</template>

<script>
import Card from "./components/Card";
import BallotModeChoose from "./components/BallotModeChoose.vue";
import Second from "./components/Second";
import { shuffle } from "@/utils/index";
export default {
  name: "ballot",
  components: {
    Card,
    Second,
    BallotModeChoose,
  },
  data() {
    return {
      activeName: 1,
      nowTeam: "", //现在输入的队伍名
      teamList: [], //所有待抽签的队伍名
      url: "",
      loading: false,
      dialogVisible: false,
      time: 5,
      teamNum: 1,
      groups: [],
      groupIndex: null,
      hasRotate: false, //是否已被反派
      ballotMode: "", //抽签模式 '1' 淘汰赛 '2' 小组赛
    };
  },
  computed: {
    maxTeamNum() {
      return Math.floor(this.teamList.length / this.teamNum);
    },
  },
  methods: {
    addNew() {
      if (!this.nowTeam) {
        this.$message.error("请输入战队名");
        return;
      }
      this.teamList.push(this.nowTeam);
      this.nowTeam = "";
    },
    closeTag(index) {
      this.teamList.splice(index, 1);
    },
    inBallot() {
      if (this.teamList.length % 2 === 0 && this.teamList.length !== 0) {
        this.activeName = 2;
      } else {
        this.$message.error("请选择至少两支队伍，且队伍的数量为双数！");
      }
    },
    // 第三步进入第四步
    inLastCur() {
      if (!this.ballotMode) return this.$message.error("请选择比赛模式！");
      this.teamNum = this.$refs?.BallotModeChoose?.groupNumber ?? 1;
      this.handleSetGroup();
      this.activeName = 4;
    },
    finish() {
      this.activeName = 3;
      this.teamList = shuffle(this.teamList);
    },
    returnBack() {
      const messageList = {
        1: "确定返回到上一步吗?",
        2: "确定返回到上一步吗?",
        3: "确定返回到上一步吗?",
        4: "您确定返回到上一步吗?一旦确认，您的翻牌结果将会被重置。",
      };
      this.$confirm(
        messageList[this.activeName],
        "确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // 第四步需要重置信息
        if (this.activeName === 4) {
          this.hasRotate = false;
          this.groups = [];
          this.teamNum = 1;
          this.groupIndex = null;
        }
        this.activeName -= 1;
      });
    },
    handleUpload(e) {
      const url = URL.createObjectURL(e.raw);
      this.url = url;
      const h = this.$createElement;
      this.$notify({
        title: "上传成功",
        message: h("i", { style: "color: teal" }, `您上传的音乐是${e.name}`),
      });
    },
    beforeAvatarUpload(file) {
      const isMusic = [
        "audio/mpeg",
        "audio/ogg",
        "audio/mp4",
        "audio/mp3",
      ].includes(file.type);
      if (!isMusic) {
        this.$message.error("请上传音频文件!");
      }
      return isMusic;
    },
    shuffle() {
      this.$refs.secondRef?.beforePlay();
    },
    loadingStart() {
      this.loading = true;
    },
    loadingEnd() {
      this.loading = false;
    },
    setTime() {
      this.dialogVisible = true;
    },
    addInGroup(team) {
      if (!this.hasRotate) {
        this.hasRotate = true;
      }
      this.groups[this.groupIndex].push(team);
    },
    handleSetGroup() {
      for (let i = 0; i < this.teamNum; i++) {
        this.groups.push([]);
      }
    },
    handleChooseGroup(index) {
      this.groupIndex = index;
    },
  },
};
</script>

<style scoped lang="less">
.tag-wrap {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  .el-tag {
    width: calc(50% - 20px);
    text-align: center;
  }
}

.wrap {
  height: 70vh;
  overflow-y: auto;
}

.card-wrap {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  height: 40vh;
  overflow-y: scroll;
}

.el-aside {
  padding: 20px;
}

/deep/.el-step__icon.is-text {
  border-radius: 0% !important;
  border: none;
}

.number-count {
  display: flex;
  justify-content: start;
  align-items: center;
  margin: 24px 0;
}

.fontWeight {
  font-weight: bold;
}

.group-wrap {
  display: flex;
  gap: 12px;
  width: calc(100% - 24px);
  padding: 12px;
  flex-wrap: wrap;
  .group {
    padding-top: 6px;
    box-sizing: border-box;
    width: 240px;
    flex-shrink: 0;
    border: 2px solid #e7e7e7;
    border-radius: 6px;
    min-height: 30vh;
    background:linear-gradient( 180deg, #EFF7FF 0%, #FEFEFF 100%);
    box-shadow: 0px 2px 6px 0px rgba(220,231,241,0.7);
    &.active {
      border: 2px solid #0089f3;
    }

    .title {
      width: 100%;
      color:#0C80E5;
      text-align: center;
    }

    .team-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
      width: 100%;

      p {
        width: 100%;
        text-align: center;
        background-color: #EBF3FE;
        color: #0C80E5;
        margin: 6px;
        padding: 6px 0;
      }
    }
  }
}
.btn_list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
</style>
