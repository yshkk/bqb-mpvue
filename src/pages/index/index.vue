<template>
  <div class="wrapper">
    <!-- mpvue对v-show支持得不太好，这里又不太想用v-if。只能这样绕一下了 https://github.com/Meituan-Dianping/mpvue/issues/178 -->
    <view :style="{display:current==='homepage'?'block':'none'}">
      <homepage />
    </view>
    <view :style="{display:current==='make'?'block':'none'}">
      <make />
    </view>
    <like v-if="current==='like'"/>
    <div>
      <!-- 点击区域有点小 不是很方便 https://github.com/TalkingData/iview-weapp/issues/5 -->
      <i-tab-bar :current="current" @change="handleChange" class="tab-bar" fixed color="#2d8cf0">
        <i-tab-bar-item key="homepage" icon="homepage" current-icon="homepage_fill" title="首页"></i-tab-bar-item>
        <i-tab-bar-item key="make" icon="brush" current-icon="brush_fill" title="制作"></i-tab-bar-item>
        <i-tab-bar-item key="like" icon="like" current-icon="like_fill" title="收藏"></i-tab-bar-item>
      </i-tab-bar>
    </div>
  </div>
</template>

<script>
import homepage from '../../components/homepage'
import make from '../../components/make'
import like from '../../components/like'
export default {
  components: {
    'homepage': homepage,
    'make': make,
    'like': like
  },
  data () {
    return {
      current: 'homepage'
    }
  },
  methods: {
    handleChange ({ mp }) {
      this.current = mp.detail.key
    }
  }
}
</script>

<style scoped>
.tab-bar {
  width: 100%;
}
</style>
