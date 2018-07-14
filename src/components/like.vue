<template>
  <div class="wrapper">
      <view v-if="favoriteList.length===0" class="empty-favorite">暂无收藏</view>
      <div class="result-area">
          <image v-for="url in favoriteList" :src="url" :data-url="url" class="image" @click="clickImage" @longpress="longpressImage" :key="url" />
          <!-- 占位符 https://stackoverflow.com/questions/16377972/how-to-align-left-last-row-line-in-multiple-line-flexbox -->
          <image class="hidden" key="hidden-image-1"/>
          <image class="hidden" key="hidden-image-2"/>
          <image class="hidden" key="hidden-image-3"/>
      </div>
      <i-modal title="删除收藏" :visible="showConfirm"  @ok="confirm" @cancel="cancel">
        <view>确认删除该收藏的表情？</view>
      </i-modal>
  </div>
</template>

<script>
// import homepage from '../homepage'
// import like from '../like'
export default {

  data () {
    return {
      favoriteList: wx.getStorageSync('USER_FAVORITE') || [],
      showConfirm: false
    }
  },
  methods: {
    clickImage (e) {
      const selectedUrl = e.target.dataset.url
      wx.previewImage({
        current: selectedUrl, // 当前显示图片的http链接
        urls: [selectedUrl] // 需要预览的图片http链接列表
      })
    },
    confirm () {
      if (this.selectedUrlIndex > -1) {
        this.favoriteList.splice(this.selectedUrlIndex, 1)
        wx.setStorage({
          key: 'USER_FAVORITE',
          data: this.favoriteList.slice()
        })
      }
      this.showConfirm = false
    },
    cancel () {
      this.showConfirm = false
    },
    longpressImage (e) {
      const selectedUrl = e.target.dataset.url
      this.showConfirm = true
      this.selectedUrlIndex = this.favoriteList.findIndex(item => item === selectedUrl)
    }
  }
}
</script>

<style scoped>
  .empty-favorite{
      color: #bbbec4;
      margin:300rpx auto;
      text-align: center;
  }
</style>
