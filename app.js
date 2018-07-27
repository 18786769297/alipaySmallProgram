App({
  globalData: {
    domain: 'http://apitest.youyu.com/',
    // domain: 'https://www.youyu.com/',
    userinfo: {
      ali_uid : ''
    },
    query:[]
  },
  onLaunch(options){
    //获取启动参数  
    if (options.query) {
      this.globalData.query = options.query
    }
  }
});

