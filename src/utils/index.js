function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
var lastFrameTime = 0
// 模拟 requestAnimationFrame   copied from https://www.dennic365.com/blog/?p=87
export function doAnimationFrame (fn) {
  var currTime = new Date().getTime()
  var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime))
  var id = setTimeout(function () {
    fn(currTime + timeToCall)
  }, timeToCall)
  lastFrameTime = currTime + timeToCall
  return id
}
// 模拟 cancelAnimationFrame
export function abortAnimationFrame (id) {
  clearTimeout(id)
}

export default {
  formatNumber,
  formatTime,
  doAnimationFrame,
  abortAnimationFrame
}
