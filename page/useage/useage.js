Page({
  data: {
    content: []
  },
  onLoad() {
    const app = getApp();
    const domain = app.globalData.domain;
    my.httpRequest({
      url: domain + 'aliapp/user/helps/', // 目标服务器 url
      method: 'GET',
      success: (res) => {
        this.setData({
          content: res.data.data
        })
      },
    });
  },
  myalert(query) {
    my.alert({
      title: '详情',
      content: query.currentTarget.dataset.content
    });
  }
});
