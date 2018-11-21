<template>
  <div class="color-container">
    <div v-for="color in colors" :style="{'background-color':color}" :class="{'color-item':true,'selected':currentColor===color}" :data-color="color" @click="handleClick" :key="color"></div>
  </div>
</template>

<script>
export default {
  props: ['currentColor'],
  data () {
    return {
      colors: ['#000', '#fff', '#2d8cf0', '#19be6b', '#ff9900', '#ed3f14', '#80848f']
    }
  },
  methods: {
    handleClick (e) {
      const color = e.target.dataset.color
      this.$emit('changeColor', color)
    }
  }

}
</script>

<style>
.color-container{
  display: flex;
  justify-content: space-between;
  flex: 1;

}
.color-item {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: inline-block;
  border: 2rpx solid #dddee1;
}
.selected{
  /* border:2rpx solid #495060; */
  box-shadow:0px 0px 20rpx #495060
}
</style>
