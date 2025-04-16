<template>
    <div class="scienceTitle">
        <div class="content">
            <dv-decoration-8 class="dv"/>
        </div>
        <div class="title-text">{{ title }}</div>
        <div class="content">
            <dv-decoration-8 :reverse="true"  class="dv"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ScienceTitle',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
}
</script>
<style lang='less' scoped>
.scienceTitle{
  display: grid;
  align-items: center;
  grid-template-columns: auto 100px auto;
  width: 100%;
  .content{
    width:100%;
    .dv{
        width:100%;
        height:30px
    }
  }
  .title-text{
    text-align: center;
    color:#fff;
  }
}
</style>