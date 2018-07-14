<template>
  <div class="wrapper">
    <homepage v-if="current==='homepage'"/>
    <make v-if="current==='make'"/>
    <like v-if="current==='like'"/>
    <div>
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
      current: 'make'
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
