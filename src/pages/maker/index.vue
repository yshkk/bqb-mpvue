<template>
  <div class="counter-warp">
    <canvas canvas-id="maker" class="maker" style="width: 300px; height: 300px;"/>
    <i-input :value="txt" @change="changeTxt" placeholder="输入文字" mode="wrapped" maxlength="-1"/>
    <i-button @click="doMake">生成图片</i-button>
  </div>
</template>

<script>
// Use Vuex
let ctx
export default {
  data () {
    return {
      txt: '输入文字',
      path: ''// 加载下来的模版的temp path，要想在canvas里面绘制img，必须加载到本地，不能直接引用远程地址
    }
  },
  computed: {
    count () {
      return 0
    }
  },
  watch: {
    txt: function (val) {
      this.updateCanvas()
    }
  },
  methods: {
    changeTxt ({mp}) {
      this.txt = mp.detail.detail.value
    },
    updateCanvas () {
      ctx.drawImage(this.path, 0, 0, 300, 300)
      ctx.setFontSize(20)
      ctx.setFillStyle('red')
      ctx.fillText(this.txt, 100, 270)
      ctx.draw(true)
    },
    doMake () {
      wx.canvasToTempFilePath({
        canvasId: 'maker',
        success: function (res) {
          console.log(res.tempFilePath)
          wx.previewImage({
            current: res.tempFilePath,
            urls: [res.tempFilePath]
          })
        }
      })
    }
  },
  onLoad () {
    ctx = wx.createCanvasContext('maker')
    // const imageResource = this.$root.$mp.query.url
    wx.getImageInfo({
      src: 'https://wx2.sinaimg.cn/large/005zWjpngy1ft9m2bqzxyj30k00jxtaa.jpg',
      success: (res) => {
        console.log(res)
        this.path = res.path
        this.updateCanvas()
      }
    })
  }
}
</script>

<style>
.maker{
  /* width: 300px; */
  /* height: 300px; */
  margin: 0 auto;
  background-size: contain
}
</style>
