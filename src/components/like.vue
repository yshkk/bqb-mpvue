<template>
  <div class="wrapper content-area">
    <i-panel title="我的收藏">
      <view v-if="favoriteList.length===0" class="empty-favorite">暂无收藏</view>
      <div class="result-area">
          <image v-for="url in favoriteList" :src="url" :data-url="url" class="image" @click="clickImage" @longpress="longpressImage" :key="url" />
          <!-- 占位符 https://stackoverflow.com/questions/16377972/how-to-align-left-last-row-line-in-multiple-line-flexbox -->
          <image class="hidden" key="hidden-image-1"/>
          <image class="hidden" key="hidden-image-2"/>
          <image class="hidden" key="hidden-image-3"/>
      </div>
    </i-panel>
    <i-panel title="联系作者">
      <div class="contact-txt">小程序所有表情包来自互联网，如若有侵权之处请联系作者进行删除。</div>
      <div class="contact-txt"><i-icon type="mail" /> yangshuang220@gmail.com</div>
      <image src='../../static/assets/zan.png' class="zan" @click="zan"/>
    </i-panel>
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
    },
    zan () {
      // wx.navigateToMiniProgram({
      //   appId: '',
      //   path: 'pages/apps/largess/detail?id=0Jx2B0GFjYs%3D'
      // })
      wx.previewImage({
        current: 'https://wx2.sinaimg.cn/large/005zWjpngy1ftd5jn7gitj311s11s1al.jpg',
        urls: ['https://wx2.sinaimg.cn/large/005zWjpngy1ftd5jn7gitj311s11s1al.jpg']
      })
    }
  }
}
</script>

<style scoped>
  .empty-favorite{
      color: #bbbec4;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%)
  }
  .zan{
    height:250rpx;
    width:300rpx;
    margin-bottom:50rpx;
    margin: 0 auto;
    display: block;
  }
  .contact-txt{
    color:#80848f;
    font-size:20rpx;
    margin:30rpx 20rpx;
    text-align:center;
  }
</style>
