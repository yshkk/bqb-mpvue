<template>
  <div class="wrapper">
    <div class="content-area">
      <div class="query-area">
        <div class="input-area">
        <i-input :value="query" @change="updateQuery" placeholder="模版不是很多，别搜了" mode="wrapped" maxlength="-1" class='query-input'/>
        <!-- mpvue里用v-show会有问题，所以只能v-if  https://github.com/Meituan-Dianping/mpvue/issues/178 -->
        <i-icon type="delete_fill" size="25" @click="deleteQuery" class="delete-query-btn" v-if="query!==''"/>
        </div>
        <i-button @click="search" type="primary" class='search-btn'>搜索模版</i-button>
      </div>
      <view class="page-component">
        <i-page :current="current" :total="total" mode="number"  />
      </view>
      <div class="result-area" @touchstart="touchStart" @touchmove="touchMove">
          <i-spin size="large" fix v-if="spinShow"></i-spin>
          <!-- todo 这里image-favorite一直绑定不上去 不知什么情况 -->
          <image v-for="img in templateList" :src="img.url" :data-url="img.url" :alt="img.desc" class="image" @click="clickImage" :key="img.url" />
          <!-- 占位符 https://stackoverflow.com/questions/16377972/how-to-align-left-last-row-line-in-multiple-line-flexbox -->
          <image class="hidden" key="hidden-image-1"/>
          <image class="hidden" key="hidden-image-2"/>
          <image class="hidden" key="hidden-image-3"/>
      </div>
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
      templateList: [],
      spinShow: true,
      current: 1, // 当前页
      count: 1 // 总页数
    }
  },
  computed: {
    total () {
      return Math.floor(this.count / 20) + 1
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
    clickImage ({mp}) {
      wx.navigateTo({
        url: `/pages/maker/main?url=${mp.target.dataset.url}`
      })
    },
    longpressImage (e) {
      const selectedUrl = e.target.dataset.url
      const selectedUrlIndex = this.favoriteList.findIndex(item => item === selectedUrl)
      // 如果存在selectedUrlIndex 则将选中url删除（清除收藏）；不存在则将其加入数组（增加收藏）
      if (selectedUrlIndex > -1) {
        this.favoriteList.splice(selectedUrlIndex, 1)
      } else {
        this.favoriteList.push(selectedUrl)
      }
    },
    getPics () {
      this.spinShow = true
      fly
        .get(
          'https://leancloud.cn/1.1/classes/template',
          {
            where: { desc: { $regex: `\\Q${this.query}\\E` } },
            limit: 18,
            skip: (this.current - 1) * 20,
            order: '-updatedAt',
            count: 1
          },
          {
            headers: {
              'X-LC-Id': '6wgcT04xxbLvwUHQPQcUhY5k-gzGzoHsz',
              'X-LC-Key': 't9RqvSNXPvF94vr002Y171hH'
            }
          }
        )
        .then(response => {
          if (response.data) {
            this.templateList = response.data.results
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

<style scoped>
.page-component::before{
  content:'对 GIF 图支持有限';
  color: #80848f;
  font-size: 20rpx;
  position: absolute;
  left: 100rpx;
  top: 36rpx;
}
.image {
  width: 230rpx;
  height: 230rpx;
}
</style>
