// 渲染tab栏内容
// let tabsBody = document.querySelector('.tabsbody')
// let tabsList = document.querySelector('.tabs-list')
// let tabsBody = document.querySelector('.tabsbody')
let videoList = document.querySelector('.video-list')
let elementFragmentNav = document.createDocumentFragment()
res.nav.forEach(item => {
  let tabsListA = document.createElement('a')
  tabsListA.innerText = item
  elementFragmentNav.appendChild(tabsListA)
})
// 文档碎片加过去一个就会减少一个
tabsList.insertBefore(elementFragmentNav.cloneNode(true), tabsList.children[0])
tabsBody.insertBefore(elementFragmentNav.cloneNode(true), tabsBody.children[0])
let elementFragmentdata = document.createDocumentFragment()
res.data.forEach(item => {
  let videoListA = document.createElement('a')
  videoListA.classList.add('video-item')
  videoListA.innerHTML = `
        <div class="card">
          <img
            src="https://imageproxy.pimg.tw/resize?url=${item.pic}"
            alt="加载失败">
          <!-- 统计播放量 -->
          <div class="count">
            <span>
              <i class="iconfont icon_shipin_bofangshu">&#xe602;</i>
              ${item.hot_desc}
            </span>
            <span>
              <i class="iconfont icon_shipin_danmushu">&#xe6b6;</i>
              ${item.type_id}
            </span>
          </div>
        </div>
        <p class="title ellipsis-2">${item.title}</p>
  `
  elementFragmentdata.appendChild(videoListA)
})
videoList.appendChild(elementFragmentdata)