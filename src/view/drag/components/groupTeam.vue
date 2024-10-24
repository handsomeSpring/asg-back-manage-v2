<!-- 十六强模板 -->
<template>
  <div class="group-container">
    <main>
      <div class="group__container" v-for="(item, index) in promChart.dataResult" :key="index">
        <li class="groupTeam__title">第{{ item.groupName | toChies}}组<i v-show="!readOnly" class="el-icon-close closeIcon"
            @click="minusGroup(index)"></i></li>
        <li class="team__li" v-for="(team, i) in item.teamList" :key="`team-${i}`">
          <div class="paiming">
            <span v-if="i > 2">
              {{ i + 1 }}
            </span>
            <svg-icon v-else style="margin-right: 5px" :iconClass="computedIcon(i)" width="26px" height="26px"
              color="#e7e7e7"></svg-icon>
          </div>
          <input v-show="!readOnly" v-model="team.name" />
          <p class="overflow-hid" v-show="readOnly">{{ team.name }}</p>
        </li>
        <li class="operation" v-show="!readOnly">
          <i class="el-icon-remove-outline" @click="TeamMinus(index)"></i>
          <i class="el-icon-circle-plus-outline" @click="TeamAdd(index)"></i>
        </li>
      </div>
      <div class="group__container" v-show="!readOnly">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addGroup"></el-button>
      </div>
    </main>
  </div>
</template>

<script>
import { toChies } from '@/utils/filters';

export default {
  name: "sixteemTem",
  data() {
    return {
      promChart: {
        componentName: "groupTeam",
        dataResult: [
          {
            groupName: '1',
            teamList: [
              {
                name: 'TBD',
              }
            ]
          }
        ],
      },
    };
  },
  props: {
    propPromChart: {
      type: String,
      default: "",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const propProm = JSON.parse(this.propPromChart);
    if (!!this.propPromChart && this.promChart.componentName === propProm.componentName) {
      this.$set(this, 'promChart', propProm);
    };
  },
  methods: {
    computedIcon(i) {
      const iconMap = {
        0: 'gold',
        1: 'Silver',
        2: 'Bronze'
      }
      return iconMap[i];
    },
    TeamAdd(index) {
      this.promChart.dataResult[index].teamList.push({
        name: 'TBD'
      })
    },
    TeamMinus(index) {
      if (this.promChart.dataResult[index].teamList.length === 1) {
        return this.$message.error('每个小组至少保留一个元素');
      }
      this.promChart.dataResult[index].teamList.pop();
    },
    addGroup() {
      const groupNo = this.promChart.dataResult.length + 1;
      const obj = {
        groupName: groupNo,
        teamList: [
          {
            name: 'TBD',
          }
        ]
      }
      this.promChart.dataResult.push(obj)
    },
    minusGroup(index) {
      if (this.promChart.dataResult.length === 1) {
        return this.$message.error('至少保留一个组');
      }
      this.promChart.dataResult.splice(index, 1);
      this.promChart.dataResult.forEach((item, i) => {
        item.groupName = `${i + 1}组`
      })
    }
  },
};
</script>

<style scoped lang="less">
.group-container {
  padding: 30px;

  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px 20px;

    li {
      width: 190px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      background: #e7e7e7;
      border: 1px solid #b5b5b5;
      border-top: none;
      box-sizing: border-box;
      padding: 0 6px;

      input {
        width: 85%;
        height: 24px;
        border-radius: 5px;
        outline: none;
        border: 1px solid #e7e7e7;
        padding-left: 6px;
        margin-left: 6px;

        &:focus {
          outline: none;
          border: 1px solid #4090EF;
        }
      }
    }

    .team__li {
      display: grid;
      grid-template-columns: 40px 150px;

      .paiming {
        width: 39px;
        height: 39px;
        margin-left: 1px;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #676767;
        font-weight: bold;
      }
    }

    .groupTeam__title {
      height: 50px;
      background: #dce8fc;
      border: 1px solid #a4b3d6;
    }

    .operation {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;

      i {
        font-weight: bold;
        cursor: pointer;
        font-size: 1.1rem;

        &:hover {
          color: #4090EF;
        }
      }
    }
  }
}

.closeIcon {
  font-size: 1.1rem;
  margin-left: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #f40;

  &:hover {
    color: rgb(248, 166, 163);
  }
}

.overflow-hid {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  color: #515151;
  font-weight: bold;
  text-align: center;
}
</style>
