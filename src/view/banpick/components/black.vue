<template>
  <div>
    <!--使用draggable组件-->
    <div class="itxst">
      <div>自定义拖拽分区功能</div>
      <div class="col">
        众创区
        <draggable
          v-model="arr1"
          group="itxst"
          ghostClass="ghost"
          chosenClass="chosen"
          filter=".forbid"
          animation="300"
          :move="onMove"
        >
          <transition-group>
            <div
              :class="item.id == 1 ? 'item forbid' : 'item'"
              v-for="item in arr1"
              :key="item.id"
            >
              {{ item.name }}
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="col">
        高校区
        <draggable
          v-model="arr2"
          group="itxst"
          ghostClass="ghost"
          chosenClass="chosen"
          filter=".forbid"
          animation="300"
          :move="onMove"
        >
          <transition-group>
            <div
              :class="item.id == 1 ? 'item forbid' : 'item'"
              v-for="item in arr2"
              :key="item.id"
            >
              {{ item.name }}
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="col">
        赛事组剩余成员
        <draggable
          v-model="arr3"
          group="itxst"
          ghostClass="ghost"
          chosenClass="chosen"
          filter=".forbid"
          animation="300"
          :move="onMove"
        >
          <transition-group>
            <div class="item" v-for="item in arr3" :key="item.id">
              {{ item.name }}
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
//导入draggable组件
import draggable from "vuedraggable";
export default {
  //注册draggable组件
  components: {
    draggable,
  },
  data() {
    return {
      //定义要被拖拽对象的数组
      arr1: [
        { id: 1, name: "落梨" },
        { id: 2, name: "落雪" },
        { id: 3, name: "PLFJY" },
        { id: 5, name: "星辰" },
        { id: 4, name: "雨翞" },
      ],
      arr2: [
        { id: 1, name: "星宇" },
        { id: 12, name: "果汁" },
        { id: 13, name: "葵籽" },
        { id: 15, name: "罗澜" },
        { id: 14, name: "念夏" },
      ],
      arr3: [
        { id: 1, name: "置顶区域" },
        { id: 15, name: "础砜" },
        { id: 16, name: "瞬" },
        { id: 17, name: "鹅鹅鹅" },
        { id: 18, name: "阿陆" },
        { id: 19, name: "星夜" },
      ],
    };
  },
  methods: {
    //move回调方法
    onMove(e) {
      //不允许拖拽
      if (e.draggedContext.element.id == 1) return false;
      return true;
    },
  },
};
</script>
<style scoped>
/*定义要拖拽元素的样式*/
.drag {
  background-color: blue !important;
  border: solid 3px red;
}
.chosen {
  background-color: #000 !important;
  color: #fff;
}
.ghost {
  background-color: red !important;
}
.itxst {
  margin: 10px;
  text-align: left;
}
.col {
  width: 30%;
  flex: 1;
  padding: 10px;
  border: solid 1px #eee;
  border-radius: 5px;
  float: left;
}
.col + .col {
  margin-left: 10px;
}
.item {
  padding: 6px 12px;
  margin: 0px 10px 0px 10px;
  border: solid 1px #eee;
  background-color: #f1f1f1;
  text-align: left;
}
.item + .item {
  border-top: none;
  margin-top: 6px;
}
.item:hover {
  background-color: #fdfdfd;
  cursor: move;
}

</style>
