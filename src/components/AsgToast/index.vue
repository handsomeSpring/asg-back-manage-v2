<template>
    <transition name="toast-fade">
      <!-- 去掉 toast-overlay 背景样式，添加 pointer-events: none -->
      <div v-if="visible" class="toast-overlay">
        <!-- 恢复内容区域的点击事件 -->
        <div class="toast-content" style="pointer-events: auto;">
          {{ message }}
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'ASG-Toast',
    data() {
      return {
        visible: false,
        message: ''
      };
    },
    methods: {
      show(message, duration = 2000) {
        this.message = message;
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, duration);
      }
    }
  };
  </script>
  
  <style scoped>
  /* 去掉背景样式，设置 pointer-events: none 让点击穿透 */
  .toast-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    pointer-events: none;
  }
  
  /* Toast 内容样式 */
  .toast-content {
    background-color: rgba(0, 0, 0, 0.65);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-size: 16px;
    max-width: 80%;
    text-align: center;
  }
  
  /* 从中间弹出的动画效果 */
  .toast-fade-enter-active,
  .toast-fade-leave-active {
    transition: all 0.3s ease;
  }
  
  .toast-fade-enter,
  .toast-fade-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
  </style>