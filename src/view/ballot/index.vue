<template>
  <div>
    <el-container>
      <el-aside width="200px" style="height: 60vh">
        <el-steps direction="vertical" :active="activeName">
          <el-step title="选择战队" description="选择若干个需要抽签的战队">
            <template slot="icon">
              <svg-icon iconClass="choice" width="20px" height="20px"></svg-icon>
            </template>
          </el-step>
          <el-step title="洗牌环节" description="打乱所选取战队的顺序">
            <template slot="icon">
              <svg-icon iconClass="shuffle" width="20px" height="20px"></svg-icon>
            </template>
          </el-step>
          <el-step icon="el-icon-menu" title="翻牌环节" description="翻牌随机选择战队">
            <template slot="icon">
              <svg-icon iconClass="view" width="20px" height="20px"></svg-icon>
            </template>
          </el-step>
        </el-steps>
      </el-aside>
      <el-main>
        <!-- 第一组 -->
        <div v-if="activeName === 1" class="first">
          <el-container>
            <el-aside width="300px">
              <el-input style="width: 250px" v-model="nowTeam" @keyup.enter.native="addNew">
                <el-button slot="append" @click="addNew">添加</el-button>
              </el-input>
              <div class="number-count">
                <p>目前已添加战队数：</p>
                <p class="fontWeight">{{ teamList.length }}个</p>
              </div>
            </el-aside>
            <el-main>
              <div class="wrap">
                <div v-if="teamList.length !== 0" class="tag-wrap">
                  <el-tag v-for="(tag, index) in teamList" :key="index" closable @close="closeTag(index)">
                    {{ tag }}
                  </el-tag>
                </div>
                <el-empty v-else description="请选择抽取的队伍"></el-empty>
              </div>
            </el-main>
          </el-container>
        </div>
        <!-- 第二组 -->
        <div v-if="activeName === 2" class="second">
          <Second ref="secondRef" @finish="finish" :url="url" :time="time" @loadingStart="loadingStart"
            @loadingEnd="loadingEnd">
          </Second>
        </div>
        <!-- 最后一组 -->
        <div v-if="activeName === 3" class="third">
          <div class="card-wrap">
            <Card :maxTeamNum="maxTeamNum" :groups="groups" :groupIndex="groupIndex" @addItem="addInGroup"
              v-for="(item, index) in teamList" :key="index" :back="item"></Card>
          </div>
          <div class="setting">
            <label>抽取的组数:</label>
            <span v-show="isFinalSetting">{{ teamNum }}</span>
            <el-input-number v-show="!isFinalSetting" size="small" v-model="teamNum" :min="1" label="请输入分组数量"
              style="margin:0 24px"></el-input-number>
            <el-button v-show="!isFinalSetting" type="primary" size="small" @click="handleSetGroup">保存分组</el-button>
            <el-button v-show="isFinalSetting" plain size="small" @click="handleReset">返回重设</el-button>
          </div>
          <div class="group-wrap">
            <div :class="{ active: groupIndex === index }" class="group" v-for="(item, index) in groups" :key="index"
              @click="handleChooseGroup(index)">
              <div class="title">第{{ index + 1 }}组</div>
              <div class="team-wrap">
                <p v-for="el in groups[index]">{{ el }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      <el-dialog title="设置时间" width="30%" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <el-input placeholder="填写时间" v-model.number="time">
          <el-button slot="append">秒</el-button>
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false; time = 0" size="mini">取 消</el-button>
          <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
    <button-fix>
      <div v-if="activeName === 1">
        <el-button size="mini" class="firstStep" type="primary" @click="inBallot">选取完毕，进入下一步</el-button>
      </div>
      <div v-if="activeName !== 1">
        <el-button size="mini" @click="returnBack" plain><i class="el-icon-arrow-left"></i>返回上一步</el-button>
      </div>
      <div v-if="activeName === 2">
        <el-button style="width: 200px" class="extract-wrap" size="mini" type="primary" plain v-loading="loading"
          element-loading-text="战队洗牌中，请稍等~~" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)" @click="shuffle">洗牌</el-button>
      </div>
      <div v-if="activeName === 2">
        <el-button size="mini" type="warning" plain @click="setTime">设置抽取时间</el-button>
      </div>
      <div v-if="activeName === 2">
        <el-upload class="upload-demo" action="/" :show-file-list="false" :on-change="handleUpload" accept="jpg"
          :before-upload="beforeAvatarUpload" :limit="1">
          <el-button size="mini" type="primary" plain>
            选择音乐
          </el-button>
        </el-upload>
      </div>
    </button-fix>
  </div>
</template>

<script>
import Card from "./components/Card";
import Second from "./components/Second";
import { shuffle } from "@/utils/index";
export default {
  name: "ballot",
  components: {
    Card,
    Second,
  },
  data() {
    return {
      activeName: 1,
      nowTeam: "", //现在输入的队伍名
      teamList: [], //所有待抽签的队伍名
      url: "",
      loading: false,
      dialogVisible: false,
      time: 0,
      isFinalSetting: false,
      teamNum: 1,
      groups: [],
      groupIndex: null,
      hasRotate: false, //是否已被反派
    };
  },
  computed: {
    maxTeamNum() {
      return Math.floor(this.teamList.length / this.teamNum);
    }
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
    finish() {
      this.activeName = 3;
      this.teamList = shuffle(this.teamList);
    },
    returnBack() {
      this.$confirm("确定返回到上一步吗?", "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.activeName -= 1;
          if (this.activeName === 2) {
            this.hasRotate = false;
            this.groups = [];
            this.teamNum = 1;
            this.groupIndex = null;
            this.isFinalSetting = false;
          }
        })
        .catch(() => { });
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
      const isMusic = ["audio/mpeg", "audio/ogg", "audio/mp4", "audio/mp3"].includes(file.type);
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
        this.groups.push([])
      }
      this.isFinalSetting = true;

    },
    handleReset() {
      if (this.hasRotate) {
        return this.$message.warning('已经翻牌了，无法重设组别，请返回到上一步');
      }
      this.groups = [];
      this.teamNum = 1;
      this.groupIndex = null;
      this.isFinalSetting = false;
    },
    handleChooseGroup(index) {
      console.log(index, "激活了");
      this.groupIndex = index;
    }
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

.firstStep {
  width: 200px;
  margin: 20px 0;
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
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(8,1fr);
  width: calc(100% - 24px);
  align-items: flex-start;
  padding: 12px;

  .group {
    padding-top: 6px;
    box-sizing: border-box;
    width: 100%;
    border: 2px solid #e7e7e7;
    border-radius: 5px;
    min-height: 30vh;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &.active {
      border: 2px solid #0089F3;
    }

    .title {
      width: 100%;
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
        background-color: #0089F3;
        color: #e7e7e7;
        margin: 6px;
        padding: 6px 0;
      }
    }
  }
}
</style>
