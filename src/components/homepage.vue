<template>
  <div class="wrapper">
    <div class="content-area">
      <img src="../../static/assets/banner.png" class="banner"/>
      <div class="query-area">
        <div class="input-area">
        <i-input :value="query" @change="updateQuery" placeholder="搜索表情包" mode="wrapped" maxlength="-1" class='query-input'/>
        <!-- mpvue里用v-show会有问题，所以只能v-if  https://github.com/Meituan-Dianping/mpvue/issues/178 -->
        <i-icon type="delete_fill" size="25" @click="deleteQuery" class="delete-query-btn" v-if="query!==''"/>
        </div>
        <i-button @click="search" type="primary" class='search-btn'>搜索</i-button>
      </div>
      <view class="page-component">
        <i-page :current="current" :total="total" mode="number"  />
      </view>
      <div class="result-area" @touchstart="touchStart" @touchmove="touchMove">
          <i-spin size="large" fix v-if="spinShow"></i-spin>
          <!-- 模板的数据绑定里面,没办法在模板语法里面调用methods方法 (或者说没办法调用computed以外的函数)，所以只能曲线救国 https://github.com/noahlam/articles/blob/master/%E7%BE%8E%E5%9B%A2%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%A1%86%E6%9E%B6mpvue%E8%B9%B2%E5%9D%91%E6%8C%87%E5%8D%97.md-->
          <image v-for="img in imageListWithFavorite" :src="img.url" :data-url="img.url" :alt="img.desc" :class="img.isFavorite?'image image-favorite':'image'" @tap="clickImage" @longpress="longpressImage" :key="img.origin" />
          <!-- 占位符 https://stackoverflow.com/questions/16377972/how-to-align-left-last-row-line-in-multiple-line-flexbox -->
          <image class="hidden" key="hidden-image-1"/>
          <image class="hidden" key="hidden-image-2"/>
          <image class="hidden" key="hidden-image-3"/>
      </div>
      <view class="ad">
        <ad unit-id="adunit-b897ee6ac4c939d0" ></ad>
      </view>
      <i-message id="message" />
    </div>
  </div>
</template>

<script>
import Fly from 'flyio/dist/npm/wx'
var fly = new Fly()
const {$Message} = require('../../static/iview/base/index')
export default {
  data () {
    return {
      query: '熊猫',
      imageList: [],
      actions: [{ name: '分享' }, { name: '收藏' }],
      selectedUrl: '',
      spinShow: true,
      current: 1, // 当前页
      count: 1, // 总页数
      startTouchPosition: null,
      favoriteList: wx.getStorageSync('USER_FAVORITE') || []
    }
  },
  computed: {
    total () {
      return Math.floor(this.count / 20) + 1
    },
    imageListWithFavorite () {
      return this.imageList.map((item, index) => {
        if (this.favoriteList.includes(item.url)) {
          return {...item, isFavorite: true}
        } else if (item.isFavorite === true) {
          return {...item, isFavorite: false}
        }
        return item
      })
    }
  },
  watch: {
    'favoriteList.length': {
      // 将变化更新到本地存储
      handler: function (val, oldval) {
        this.updateStorage({method: val > oldval ? 'ADD' : 'DELETE'})
      }
    }
  },
  methods: {
    updateQuery (e) {
      // 按理说这里可以直接用v-model双向绑定的，不知为啥不行，就只能通过手动update的方式了
      this.query = e.target.detail.value
    },
    deleteQuery (e) {
      this.query = ''
    },
    search () {
      // 重置翻页
      this.current = 1
      this.getPics()
    },
    clickImage (e) {
      const selectedUrl = e.target.dataset.url
      wx.previewImage({
        current: selectedUrl, // 当前显示图片的http链接
        urls: [selectedUrl] // 需要预览的图片http链接列表
      })
    },
    longpressImage (e) {
      const selectedUrl = e.target.dataset.url
      console.log(selectedUrl)
      const selectedUrlIndex = this.favoriteList.findIndex(item => item === selectedUrl)
      // 如果存在selectedUrlIndex 则将选中url删除（清除收藏）；不存在则将其加入数组（增加收藏）
      if (selectedUrlIndex > -1) {
        this.favoriteList.splice(selectedUrlIndex, 1)
      } else {
        this.favoriteList.push(selectedUrl)
      }
    },
    updateStorage ({method}) {
      const txt = method === 'DELETE' ? '删除' : '收藏'
      wx.setStorage({
        key: 'USER_FAVORITE',
        data: this.favoriteList.slice(),
        // success: function () {
        //   $Message({
        //     content: `表情${txt}成功`,
        //     type: 'success'
        //   })
        // },
        fail: function () {
          $Message({
            content: `表情${txt}失败`,
            type: 'error'
          })
        }
      })
    },
    getPics () {
      this.spinShow = true
      fly
        .get(
          'https://leancloud.cn/1.1/classes/pics',
          {
            where: { desc: { $regex: `\\Q${this.query}\\E` } },
            limit: 20,
            skip: (this.current - 1) * 20,
            order: '-updatedAt',
            count: 1
          },
          {
            headers: {
              'X-LC-Id': 'fgRtP5u0BmznRY36lHCEPquL-gzGzoHsz',
              'X-LC-Key': 'tAEeCDEKV46YALkSQIkQW239'
            }
          }
        )
        .then(response => {
          if (response.data) {
            this.imageList = response.data.results
            this.count = response.data.count
            this.spinShow = false
          }
        })
        .catch(function () {
          $Message({
            content: `获取表情包失败，请重试`,
            type: 'error'
          })
          this.spinShow = false
        })
    },
    touchStart (e) {
      this.startTouchPosition = e.clientX
    },
    touchMove (e) {
      if (this.startTouchPosition === null) return
      if (e.clientX - this.startTouchPosition > 80) {
        // console.info('左滑')
        if (this.current > 1) {
          this.current--
          this.getPics()
          this.startTouchPosition = null
        }
      } else if (this.startTouchPosition - e.clientX > 80) {
        // console.info('右滑')
        if (this.current * 20 < this.count) {
          this.current++
          this.getPics()
          this.startTouchPosition = null
        }
      }
    }
  },
  created () {
    this.getPics()
  }
}
</script>

<style>
.banner{
  width: 100%;
  height:250rpx;
}
.content-area {
  background-color: #f8f8f9;
  height: calc(100vh - 100rpx);
  overflow: auto;
}
.query-area {
  display: flex;
  position: relative;
  padding:20rpx;
}
.input-area{
  position: relative;
  width: 100%;
}
.query-input {
  width: 100%;
}
.query-input view{
  margin: 0;
  padding:4px 20px;
}
.delete-query-btn{
  position: absolute;
  right:20rpx;
  top:50%;
  opacity:.5;
  z-index:2;
  transform:translateY(-50%);
}
.search-btn{
  margin-left: 20rpx;
}
.info-text{
  text-align: center;
  color: #80848f;
  font-size: 20rpx;
}
.page-component{
  color: #80848f;
  font-size: 30rpx;
  position: relative;
  height: 40rpx;
  margin-top: -24rpx;
}
.page-component::before{
  content:'长按可添加到收藏';
  color: #80848f;
  font-size: 20rpx;
  position: absolute;
  left: 100rpx;
  top: 36rpx;
}
.page-component::after{
  content:'左右滑动翻页';
  color: #80848f;
  font-size: 20rpx;
  position: absolute;
  right: 100rpx;
  top: 36rpx;
}
.result-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20rpx;
  position:relative;
  min-height: 340rpx;
  margin-top:38rpx;
  padding-top:0;

}
.result-area::after {
  flex: auto;
  content: "";
  height: 0;
}
.image {
  width: 166rpx;
  height: 166rpx;
  border: 2rpx solid #dddee1;
  margin-top: 10rpx;
  position: relative;
}
.image.image-favorite{
  border: 2rpx solid rgba(255,163,158,.3);
}
.image-favorite:after{
  content: '♥︎';
  position: absolute;
  bottom: 0;
  left: 0;
  color: #ffa39e;
  opacity: 0.5;
}
.image-icon{
  position: absolute;
  top: -10rpx;
  right: 0;
}
.hidden {
  visibility: hidden;
  height: 0;
  width: 166rpx;
}
.modal-image {
  width: 90%;
}
.ad{
  padding: 0 20rpx;
}
</style>
