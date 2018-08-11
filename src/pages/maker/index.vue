<template>
  <div class="maker-container">
    <canvas canvas-id="maker" class="maker" style="width: 300px; height: 300px;" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"/>
    <div class="maker-area">
      <i-tabs :current="selectedIndex" @change="changeSelectedIndex">
        <i-tab v-for="(item,index) in userText" :key="index" :title="'文本'+(index+1)"></i-tab>
      </i-tabs>
      <i-input :value="userText[selectedIndex].txt" @change="changeTxt" placeholder="输入文字"  maxlength="-1" class="input"/>
      <i-divider content="可拖动文字进行位移" height="32" class="divider-txt"></i-divider>
      <div class="setting">
        <span class="label">颜色</span>
        <color-selector @changeColor="changeColor" :currentColor="userText[selectedIndex].currentColor"/>
      </div>
      <div class="setting">
        <span class="label">字号</span>
        <i-input-number min="10" max="50" :value="userText[selectedIndex].fontSize" @change="changeFontsize" class="input-number"/>
      </div>
      <div class="btn-area">
        <i-button open-type="share" type="ghost" class="button share-button">分享模版</i-button>
        <i-button @click="doMake" type="primary" class="button">生成表情</i-button>
      </div>
    </div>
  </div>
</template>

<script>
import colorSelector from '../../components/color-selector'
import {doAnimationFrame, abortAnimationFrame} from '../../utils'
let ctx
const initText = [{
  txt: '输入文字',
  currentColor: '#000',
  fontSize: 20,
  x: 150,
  y: 270
}, {
  txt: '',
  currentColor: '#000',
  fontSize: 20,
  x: 150,
  y: 270
}, {
  txt: '',
  currentColor: '#000',
  fontSize: 20,
  x: 150,
  y: 270
}]
export default {
  components: {
    'color-selector': colorSelector
  },
  data () {
    return {
      userText: initText.map(item => ({...item})),
      selectedIndex: 0, // 当前操作的文本index
      path: ''// 加载下来的模版的temp path，要想在canvas里面绘制img，必须加载到本地，不能直接引用远程地址
    }
  },
  watch: {
    userText: {
      handler: function () {
        this.updateCanvas()
      },
      deep: true
    }
  },
  methods: {
    touchstart (e) {
      this.userText[this.selectedIndex].x = e.x
      this.userText[this.selectedIndex].y = e.y
      this.updateCanvas()
    },
    touchmove (e) {
      this.userText[this.selectedIndex].x = e.x
      this.userText[this.selectedIndex].y = e.y
      doAnimationFrame(this.updateCanvas) // touch move的时候节流一下 可能性能会好些（心理作用😂 ）
    },
    touchend (e) {
      abortAnimationFrame()
    },
    changeTxt ({mp}) {
      this.userText[this.selectedIndex]['txt'] = mp.detail.detail.value
    },
    changeColor (color) {
      this.userText[this.selectedIndex]['currentColor'] = color
    },
    changeFontsize ({mp}) {
      this.userText[this.selectedIndex]['fontSize'] = mp.detail.value
    },
    changeSelectedIndex ({mp}) {
      this.selectedIndex = mp.detail.key
    },
    updateCanvas () {
      ctx.drawImage(this.path, 0, 0, 300, 300)
      ctx.setTextAlign('center') // 必须每次在updateCanvas重新设置，否则模拟器上生效但真机下不会生效
      this.userText.forEach(item => {
        ctx.font = `bold ${item.fontSize}px/${item.fontSize}px sans-serif`
        ctx.setFillStyle(item.currentColor)
        ctx.fillText(item.txt, item.x, item.y)
      })
      ctx.draw()
    },
    doMake () {
      wx.canvasToTempFilePath({
        canvasId: 'maker',
        success: function (res) {
          wx.previewImage({
            current: res.tempFilePath,
            urls: [res.tempFilePath]
          })
        }
      })
    },
    share () {

    }
  },
  onLoad () {
    ctx = wx.createCanvasContext('maker')
    const imageResource = this.$root.$mp.query.url
    wx.getImageInfo({
      src: imageResource,
      success: (res) => {
        // 重置文本
        this.userText = initText.map(item => ({...item}))
        this.selectedIndex = 0
        this.path = res.path
      }
    })
  },
  onShareAppMessage () {
    return {
      title: `表情制作 - 熊猫斗图助手`,
      path: `/pages/index/main?url=${this.$root.$mp.query.url}`
    }
  }
}
</script>

<style>
.maker-container{
  margin-top: 30rpx;
}
.maker{
  /* width: 300px; */
  /* height: 300px; */
  margin: 0 auto;
  background-size: contain;
  border: 1px solid #dddee1;
}
.maker-area{
  width: 300px;
  margin: 0 auto;
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
.btn-area{
  display: flex;
  justify-content: space-between;
}
.button{
  flex: 1;
}
.divider-txt{
  top:-10rpx;
  position:relative;

}
.share-button{
  margin-right: 20rpx;
}
.button button{
  margin: 0;
}
.setting{
  display: flex;
  justify-content:space-between;
  margin-bottom: 30rpx;
}
</style>
