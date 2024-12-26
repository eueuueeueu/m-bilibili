// tab栏下方滑块
let line = document.querySelector('.line')
// tab栏
let tabs = document.querySelector('.tabs')
// tab栏内容
let tabsList = document.querySelector('.tabs-list')
// tab栏内容右方展开小图标
let afterIcon = document.querySelector('.after')
// tab栏内容右方收起小图标
let rotateIco = document.querySelector('.rotate-ico')
// tab栏展开的内容
let tabsBody = document.querySelector('.tabsbody')
// tab栏展开时的遮罩层
let maskLayer = document.querySelector('.maskLayer')
// tab栏内容下方滑块移动逻辑
tabsList.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    line.style.transform = `translateX(${e.target.offsetLeft}px)`
  }
})
// tab栏内容移动逻辑
tabsList.addEventListener('touchstart', e => {
  // 每一次按下的初始移动值，第一次为0，后面的是基于上一次按下
  let initTranslateXValue = (tabsList.style.transform).slice(11, -3) ? parseInt((tabsList.style.transform).slice(11, -3)) : 0
  // 第一次按下的位置，第一次是e.changedTouches[0].pageX，后面每次都要减去每一次按下的初始移动值
  let startX = e.changedTouches[0].pageX - initTranslateXValue
  // 最大移动的位置，最多只能移动 (tabsList的长度-tabs的长度)
  let maxTranslateXValue = tabsList.scrollWidth - tabs.offsetWidth
  function tabsListTouchmove(e) {
    // 移动的距离 = 鼠标移动的位置 - 第一次按下的位置
    let moveDistance = startX - e.changedTouches[0].pageX
    // 判断是否超过最大移动的位置
    moveDistance = moveDistance > maxTranslateXValue ? maxTranslateXValue : moveDistance
    tabsList.style.transform = `translateX(-${moveDistance}px)`
  }
  document.addEventListener('touchmove', tabsListTouchmove)
  document.addEventListener('touchend', () => document.removeEventListener('touchmove', tabsListTouchmove))
})
// tab栏内容展开逻辑
afterIcon.addEventListener('click', e => {
  tabsBody.style.animation = 'movetabsbodydown .2s ease-in-out forwards'
  maskLayer.style.display = 'block'
})
// tab栏内容收起逻辑
rotateIco.addEventListener('click', e => {
  tabsBody.style.animation = 'movetabsbodyup .2s ease-in-out forwards'
  maskLayer.style.display = 'none'
})
maskLayer.addEventListener('click', e => {
  tabsBody.style.animation = 'movetabsbodyup .2s ease-in-out forwards'
  maskLayer.style.display = 'none'
})