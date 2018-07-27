Page({
  data: {
    order_sn:''
  },
  onLoad(qurey) {
    this.setData({
      order_sn : qurey.order_sn
    })
    const app = getApp();
    my.httpRequest({
      url: app.globalData.domain+'aliapp/goods/lease/?order_sn='+this.data.order_sn, // 目标服务器url
      success: (res) => {
        if(res.data.status == 1){
          this.setData({
            content:res.data.data.content
          })
        }
      },
    });
  },
});
