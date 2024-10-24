<template>
  <div>
    <el-dialog class="template" :visible="dialogVisible" width="60%" :title="title" :close-on-click-modal="true"
      @close="close">
      <el-timeline>
        <el-timeline-item :class="{highlight:color1 !== ''}" :color="color1"  timestamp="1.请选择一个模板" placement="top">
          <el-card>
            <div class="bus">
              <div class="box" 
                :class="{active:activeIndex === index}"
                :style="{ backgroundColor: item.color }"
                v-for="(item,index) in promTem" :key="item.id"
                @click="handleActive(item,index)">
                <p>{{ item.name }}</p>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :color="color2" placement="top" :timestamp="`您选择的模板是：${activeItem.name || '未选择'}`">
          <div style="text-align: center;">
            <el-button size="small" :disabled="Object.keys(activeItem).length === 0" plain @click="changeTemplate">下一步</el-button>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TemplateVue",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "请选择模板",
      promTem: [
        { name: "小组赛模板", component: "groupTeam", color: "#fde7cc" },
        { name: "八强模板", component: "eightTem", color: "#f5cecc" },
      ],
      activeIndex:null,
      activeItem:{},
      color1:"",
      color2:""
    };
  },
  methods: {
    close() {
      this.$emit("update:dialogVisible", false);
      this.activeIndex = null,
      this.activeItem = {},
      this.color1 = "",
      this.color2 = ""
    },
    changeTemplate() {
      this.$emit('changeName', this.activeItem.component);
      this.close();
    },
    handleActive(item,index){
      this.activeIndex = index;
      this.activeItem = item;
      this.color1 = 'rgb(36, 86, 195)'
      this.color2 = 'rgb(38, 222, 81)'
    }
  },
};
</script>

<style scoped lang="less">
@blueColor:rgb(36, 86, 195);
.bus {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
}

.box {
  border: 1px solid #e7e7e7;
  height: 100px;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  &.active{
    border:2px solid @blueColor;
  }
}

.template /deep/.el-dialog__body {
  background-color: #fff;
}
.highlight /deep/.el-timeline-item__tail{
  border-color:@blueColor;
}
</style>
