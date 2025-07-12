<template>
  <div>
    <div ref="container" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<script>
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import { DagreLayout } from '@antv/layout'
import Cell from './Cell.vue'

export default {
  name: 'TreeGraph',
  data() {
    return {
      graph: null,
      nodeWidth: 160,
      nodeHeight: 40,
      isLock: false,
      list: [
        {
          id: 1,
          title: 'node1',
          parentId: null,
          children: [
            {
              id: 2,
              parentId: 1,
              title: 'child-node-1',
              children: [
                {
                  id: 4,
                  parentId: 2,
                  title: 'son-node-1',
                  children: []
                },
                {
                  id: 5,
                  parentId: 2,
                  title: 'son-node-2',
                  children: [
                    {
                      id: 8,
                      parentId: 5,
                      title: 'grand-son-node-1',
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              id: 3,
              parentId: 1,
              title: 'child-node-2',
              children: [
                {
                  id: 6,
                  parentId: 3,
                  title: 'son-node-3',
                  children: []
                },
                {
                  id: 7,
                  parentId: 3,
                  title: 'son-node-4',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.initGraph()
    this.renderTree();
    this.graph.getNodes().forEach(node => {
      const pos = node.getPosition()
      node.setData({
        ...node.getData(),
        collapse: true,
        originalX: pos.x,
        originalY: pos.y
      }, { silent: true })
    })
    this.$nextTick(() => {
      this.graph.on('node:click', ({ e, x, y, node, view }) => {
        try {
          if (!node.data.parentId || this.isLock) return;
          this.isLock = true;
          const children = this.graph.getSuccessors(node, { deep: true });
          if (!children || children.length === 0) return;
          children.forEach(nodeItem => {
            if (node.data.collapse) {
              // 隐藏动画：移动到父节点位置
              nodeItem.transition('position/x', node.data.originalX, {
                duration: 360,
                timing: 'linear'
              })
              nodeItem.transition('position/y', node.data.originalY, {
                duration: 360,
                timing: 'linear',
                complete: () => nodeItem.hide()
              })
            } else {
              // 显示动画：从父节点回到原位
              nodeItem.show()
              nodeItem.transition('position/x', nodeItem.data.originalX, {
                duration: 360,
                timing: 'linear'
              })
              nodeItem.transition('position/y', nodeItem.data.originalY, {
                duration: 360,
                timing: 'linear'
              })
            }
          });
          node.setData({
            ...node.data,
            collapse: !node.data.collapse,
          }, { silent: true })
        } finally {
          this.isLock = false;
        }
      })
    })
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.dispose()
    }
  },
  methods: {
    initGraph() {
      // 注册自定义Vue节点
      register({
        shape: 'custom-vue-node',
        width: this.nodeWidth,
        height: this.nodeHeight,
        component: Cell,
      })

      this.graph = new Graph({
        container: this.$refs.container,
        width: '100%',
        height: '100%',
        grid: true,
        interacting: {
          nodeMovable: false // 禁止所有节点拖拽
        },
        // 配置不能拖拽
        connecting: {
          router: {
            name: 'orth', //warning警告屏蔽就是orth manhattan
            args: {
              startDirections: ['top'],
              endDirections: ['bottom'],
            },
            args: {
              padding: 10
            },
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 8,
            },
          },
          anchor: 'center',
          connectionPoint: 'anchor',
        }
      })
    },

    renderTree() {
      // 使用 DagreLayout 布局
      const dagreLayout = new DagreLayout({
        type: 'dagre',
        rankdir: 'LR',
        ranksep: 60,
        nodesep: 20,
        controlPoints: true,
        acyclicer: 'greedy',
        ranker: 'LR'  // 这个算法会自动平衡父节点位置
      })

      // 转换数据格式
      const data = this.convertToGraphData(this.list[0])
      const layoutData = dagreLayout.layout(data)

      // 渲染节点
      layoutData.nodes.forEach(node => {
        this.graph.addNode({
          id: node.id,
          x: node.x,
          y: node.y,
          shape: 'custom-vue-node',
          data: {
            label: node.label,
            parentId: node.parentId,
            id: node.id,
          },
          attrs: {
            opacity: 0
          },
          ports: {
            groups: {
              right: {
                position: {
                  name: 'absolute',
                  args: {
                    x: this.nodeWidth,
                    y: this.nodeHeight / 2
                  }
                },
                attrs: {
                  circle: {
                    r: 4,
                    magnet: false, // 关键设置：禁止拖拽出线
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff'
                  }
                }
              },
              left: {
                position: {
                  name: 'absolute',
                  args: {
                    x: 0,
                    y: this.nodeHeight / 2
                  }
                },
                attrs: {
                  circle: {
                    r: 4,
                    magnet: false, // 关键设置：禁止拖拽出线
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff'
                  }
                }
              }
            },
            items: [
              ...(node.hasChildren ? [{ id: `${node.id}-right`, group: 'right' }] : []),
              ...(node.parentId !== 'null' ? [{ id: `${node.id}-left`, group: 'left' }] : [])
            ].filter(Boolean) // 确保过滤掉空项（实际上展开运算符已经处理了，这里双重保险）
          }
        })
      })

      // 渲染边
      layoutData.edges.forEach(edge => {
        this.graph.addEdge({
          source: { cell: edge.source, port: `${edge.source}-right` },
          target: { cell: edge.target, port: `${edge.target}-left` },
          attrs: {
            line: {
              stroke: '#1890FF',  // 改为蚂蚁线常用蓝色
              strokeDasharray: '5, 3',  // 虚线样式（5px实线，3px间隙）
              strokeWidth: 1,
              targetMarker: null,
              style: {
                animation: 'ant-line 30s infinite linear'  // 添加动画
              }
            }
          },
          zIndex: 0
        })
      })

      // 居中显示
      this.graph.centerContent()
    },

    convertToGraphData(node, parentId = null) {
      console.log(node, 'node');
      const nodes = []
      const edges = []

      nodes.push({
        id: String(node.id),
        hasChildren: node.children && node.children.length > 0,
        parentId: String(node.parentId),
        label: node.title
      })

      if (parentId !== null) {
        edges.push({
          source: String(parentId),
          target: String(node.id)
        })
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          const childData = this.convertToGraphData(child, node.id)
          nodes.push(...childData.nodes)
          edges.push(...childData.edges)
        })
      }

      return { nodes, edges }
    }
  }
}
</script>