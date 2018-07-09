<template>
  <div>
    <i-tab-bar :current="current" @change="handleChange" class="tab-bar" fixed color="#2d8cf0">
      <i-tab-bar-item key="homepage" icon="homepage" current-icon="homepage_fill" title="首页"></i-tab-bar-item>
      <i-tab-bar-item key="make" icon="brush" current-icon="brush_fill" title="制作"></i-tab-bar-item>
      <i-tab-bar-item key="like" icon="like" current-icon="like_fill" title="收藏"></i-tab-bar-item>
    </i-tab-bar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 'homepage'
    }
  },
  methods: {
    handleChange ({ mp }) {
      this.current = mp.detail.key
      wx.navigateTo({ url: mp.detail.key })
    }
  }
}
</script>

<style scoped>
.tab-bar {
  width: 100%;
}
</style>
