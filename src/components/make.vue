<template>
  <div class="wrapper">
      <img :src="bannerImg" class="banner" @click="goMaker"/>
  </div>
</template>

<script>
// import homepage from '../homepage'
// import like from '../like'
import bannerImg from '../../static/assets/banner.png'

export default {

  data () {
    return {
      bannerImg
    }
  },
  methods: {
    goMaker () {
      wx.navigateTo({
        url: '/pages/maker/main?url=http://wx1.sinaimg.cn/large/006APoFYly1fqbj5f9i05j302c01w0sh.jpg'
      })
    }
  }
}
</script>

<style scoped>

</style>
