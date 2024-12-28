(function () {
  function typeOf(data) {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
  }
  // 定义一个按照指定要求创建节点的函数
  function createElement(tag, attrs, children) {
    if (typeof tag !== 'string') throw new Error('tag参数类型必须是字符串')
    let element = document.createElement(tag)
    if (element instanceof HTMLUnknownElement) throw new Error('tag标签名不合法')
    attrs = typeOf(attrs === 'object') ? attrs : {}
    Object.entries(attrs).forEach(attr => {
      let attrName = attr[0]
      let attrValue = typeOf(attr[1]) === 'object' ? Object.entries(attr[1]).join(';').split(',').join(':') : attr[1]
      element[attrName] = attrValue
    })
    if (typeof children === 'string') element.innerHTML = children
    return element
  }
  // tab栏滑动逻辑
  let pervTranslateX = 0
  function initScroll(element) {
    let distanceX = 0
    element.addEventListener('touchstart', event => {
      element.style.transition = 'unset'
      function tabsListTouchmove(e) {
        // 差值 = 鼠标移动时距离左边的距离 - 鼠标按下时距离左边的距离
        distanceX = e.touches[0].clientX - event.touches[0].clientX
        let resDistance = distanceX + pervTranslateX
        if (resDistance > 0) resDistance = 0
        if (resDistance < element.parentElement.getBoundingClientRect().width - element.scrollWidth) resDistance = element.parentElement.getBoundingClientRect().width - element.scrollWidth
        element.style.transform = `translate3d(${resDistance}px,0,0)`
      }
      document.addEventListener('touchmove', tabsListTouchmove)
      document.addEventListener('touchend', () => {
        pervTranslateX += distanceX
        distanceX = 0
        this.removeEventListener('touchmove', tabsListTouchmove)
      })
    })
  }
  // tab栏的每一项点击移到中间
  function bindEvent(element, callback) {
    // 父级坐标信息
    let parentRectInfo = element.parentElement.getBoundingClientRect()
    let centerX = parentRectInfo.width / 2
    let parentLeft = parentRectInfo.left
    let transformDistanceX = 0
    element.addEventListener('click', e => {
      if (e.target.classList.contains('tabs-item')) {
        let itemRectInfo = e.target.getBoundingClientRect()
        let itemLeft = itemRectInfo.left
        let distanceLeft = itemLeft - parentLeft
        transformDistanceX = centerX - distanceLeft - itemRectInfo.width / 2
        pervTranslateX += transformDistanceX
        if (pervTranslateX > 0) pervTranslateX = 0
        if (pervTranslateX < element.parentElement.getBoundingClientRect().width - element.scrollWidth) pervTranslateX = element.parentElement.getBoundingClientRect().width - element.scrollWidth
        element.style.cssText = `transform:translate3d(${pervTranslateX}px,0,0);transition:all 200ms ease-in`
        callback(e.target._customData)
      }
    })
  }
  // tab栏内容展开收起逻辑
  function tabExpansionOrTakeBack(parent, data, callback) {
    let isExpand = false
    let drawer = createElement('div', { className: 'tabsbody' })
    data.forEach(item => {
      let itemElement = createElement('a', { className: 'item', _customData: item }, item)
      drawer.appendChild(itemElement)
    })
    let iconDrawer = createElement('i', { className: 'iconfont rotate-ico' }, '&#xe645')
    drawer.appendChild(iconDrawer)
    parent.parentElement.replaceChild(drawer, parent)
    // tab栏展开时的遮罩层
    let maskLayer = document.querySelector('.maskLayer')
    function show() {
      drawer.style.animation = 'movetabsbodydown .2s ease-in-out forwards'
      maskLayer.style.display = 'block'
      isExpand = true
    }
    function hide() {
      drawer.style.animation = 'movetabsbodyup .2s ease-in-out forwards'
      maskLayer.style.display = 'none'
      isExpand = false
    }
    function toggle() {
      isExpand ? hide() : show()
    }
    let channelMenu = document.querySelector('.channel-menu')
    channelMenu.addEventListener('click', e => {
      if (e.target.className === 'iconfont' || e.target.className === 'iconfont rotate-ico' || e.target.className === 'maskLayer') toggle()
      if (e.target.className === 'item') {
        hide()
        typeof callback === 'function' && callback(e.target._customData)
      }
    })
  }
  // tab栏下方滑块逻辑
  function initslidingBlock(element) {
    let line = document.querySelector('.line')
    // tab栏内容下方滑块移动逻辑
    element.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        line.style.transform = `translateX(${e.target.offsetLeft}px)`
      }
    })
  }
  // 定义一个函数initTabs,渲染tab栏,指定一个挂载点,渲染
  function initTabs(el, config) {
    let root = null
    if (el instanceof HTMLElement) root = el
    if (typeof el === 'string') root = document.querySelector(el)
    if (!root) throw new Error('el必须是一个存在的元素')
    if (!config || typeOf(config.dataSource) !== 'array') throw new Error('config.dataSource必须是数组')
    let tabs = createElement('div', { className: 'tabs' })
    let tabsList = createElement('div', { className: 'tabs-list' })
    config.dataSource.forEach(data => {
      let tabsItem = createElement('a', { className: 'tabs-item', _customData: data }, data)
      tabsList.appendChild(tabsItem)
    })
    let line = createElement('div', { className: 'line' })
    tabsList.appendChild(line)
    tabs.appendChild(tabsList)
    root.parentElement.replaceChild(tabs, root)
    initScroll(tabsList)
    bindEvent(tabsList, config.callback)
    initslidingBlock(tabsList)
    let tabsBody = document.querySelector('.tabsbody')
    tabExpansionOrTakeBack(tabsBody, res.nav, config.callback)
  }
  // 定义一个函数rendererBody,渲染tab栏下方主体内容,指定一个挂载点,渲染
  function rendererBody(el, config) {
    let root = null
    if (el instanceof HTMLElement) root = el
    if (typeof el === 'string') root = document.querySelector(el)
    if (!root) throw new Error('el必须是一个存在的元素')
    if (!config || typeOf(config.dataSource) !== 'array') throw new Error('config.dataSource必须是数组')
    let videoList = createElement('div', { className: 'video-list' })
    config.dataSource.forEach(item => {
      let element = createElement('a', { href: '#', className: 'video-item', _customData: item.type_id }, `
        <div class="card">
            <img
              src="https://imageproxy.pimg.tw/resize?url=${item.pic}"
              alt="加载失败">
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
      `)
      videoList.appendChild(element)
    })
    root.parentElement.replaceChild(videoList, root)
    videoList.addEventListener('click', e => {
      if (e.target.tagName === 'P') return config.callback(e.target.parentElement._customData)
      if (e.target.tagName === 'IMG' || e.target.tagName === 'DIV') return config.callback(e.target.parentElement.parentElement._customData)
      if (e.target.tagName === 'SPAN') return config.callback(e.target.parentElement.parentElement.parentElement._customData)
      if (e.target.tagName === 'I') return config.callback(e.target.parentElement.parentElement.parentElement.parentElement._customData)
    })
  }
  initTabs('.tabs', {
    dataSource: res.nav,
    callback: function (e) {
      console.log(e);
    }
  })
  rendererBody('.video-list', {
    dataSource: res.data,
    callback: function (e) {
      console.log(e);
    }
  })
})()