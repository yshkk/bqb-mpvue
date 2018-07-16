<template>
  <div class="maker-container">
    <canvas canvas-id="maker" class="maker" style="width: 300px; height: 300px;" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"/>
    <div class="maker-area">
      <span class="tips">可拖动文字进行位移</span>
      <i-input :value="txt" @change="changeTxt" placeholder="输入文字"  maxlength="-1" class="input"/>
      <div class="setting">
       <span class="label">颜色</span>
       <color-selector @changeColor="changeColor" :currentColor="currentColor"/>
      </div>
      <div class="setting">
        <span class="label">字号</span>
        <i-input-number min="10" max="50" :value="fontSize" @change="changeFontsize" class="input-number"/>
      </div>
      <i-button @click="doMake" type="primary" class="button">生成表情</i-button>
    </div>
  </div>
</template>

<script>
import colorSelector from '../../components/color-selector'
import {doAnimationFrame, abortAnimationFrame} from '../../utils'
let ctx
export default {
  components: {
    'color-selector': colorSelector
  },
  data () {
    return {
      txt: '输入文字',
      currentColor: '#000',
      fontSize: 20,
      x: 150,
      y: 270,
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
    touchstart (e) {
      this.x = e.x
      this.y = e.y
      this.updateCanvas()
    },
    touchmove (e) {
      this.x = e.x
      this.y = e.y
      doAnimationFrame(this.updateCanvas) // touch move的时候节流一下 可能性能会好些（心理作用😂 ）
    },
    touchend (e) {
      abortAnimationFrame()
    },
    changeTxt ({mp}) {
      this.txt = mp.detail.detail.value
    },
    changeColor (color) {
      this.currentColor = color
      this.updateCanvas()
    },
    changeFontsize ({mp}) {
      this.fontSize = mp.detail.value
      this.updateCanvas()
    },
    updateCanvas () {
      ctx.drawImage(this.path, 0, 0, 300, 300)
      ctx.setFontSize(this.fontSize)
      ctx.setFillStyle(this.currentColor)
      ctx.fillText(this.txt, this.x, this.y)
      ctx.draw()
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
    const imageResource = this.$root.$mp.query.url
    console.log(imageResource)
    wx.getImageInfo({
      src: imageResource,
      success: (res) => {
        console.log(res)
        this.path = res.path
        ctx.setTextAlign('center')
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
  background-size: contain;
  border: 1px solid #dddee1;
}
.maker-area{
  width: 300px;
  margin: 40rpx auto 0 ;
  padding: 30rpx 0;
  border-top: 1px solid #e9eaec;
  position: relative;
}

.input view{
  margin: 20rpx 0;
  border:1px solid #dddee1;
}
.label{
  font-size: 14px;
  color:#80848f;
  width: 100rpx;
  display: inline-block;
  line-height: 60rpx;
}
.input-number{
  display: inline-block;
}
.button button{
  margin: 0;
}
.tips{
  color:#80848f;
  font-size: 10px;
  position:absolute;
  top:-14rpx;
  left:50%;
  transform:translateX(-50%);
  background: #fff;
}
.setting{
  display: flex;
  justify-content:space-between;
  margin-bottom: 30rpx;
}
</style>
