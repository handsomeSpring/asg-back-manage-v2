<template>
  <div class="cell_component" :style="{ opacity: isCollapse ? 1 : 0 }">
    <div class="component_icon">
      <svg-icon color="#fff" iconClass="json" width="20px" height="20px"></svg-icon>
    </div>
    <div class="text-info">
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Count",
  inject: ["getGraph", "getNode"],
  data() {
    return {
      text: '1',
      isCollapse: true,
    };
  },
  mounted() {
    const myNode = this.getNode()
    this.text = myNode?.data?.label
    const graph = this.getGraph();
    graph.on('node:click', ({ node }) => {
      const children = graph.getSuccessors(node, { deep: true });
      const index = children.findIndex(child => child.data.id === myNode.data.id);
      if (index !== -1) {
        this.isCollapse = node.data.collapse;
      }
    });
  },
  methods: {
    add() {
    },
  },
};
</script>
<style lang="less">
.cell_component {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: opacity 0.27s linear;
  &:hover{
    box-shadow: 0 0 10px rgba(144,144,144,0.5);
  }
  .component_icon {
    border-radius: 8px 0 0 8px;
    border: 1px solid #4090EF;
    width: 20%;
    background: #4090EF;
    height: calc(100% - 2px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text-info {
    border: 1px solid #4090EF;
    border-radius: 0 8px 8px 0;
    width: 80%;
    height: calc(100% - 2px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>