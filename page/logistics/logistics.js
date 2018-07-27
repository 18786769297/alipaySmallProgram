Page({
  data: {
    data_order_info:'',
    logisticsInfo:[
      ],
  },
  onLoad(query) {
    var order_sn = query.order_sn;
    const app = getApp();
    var access_token = app.globalData.userinfo.access_token;
    my.httpRequest({
      url: app.globalData.domain+'/aliapp/order/trace/?access-token='+access_token+'&order_sn='+order_sn, // 目标服务器url
      success: (res) => {
        if(res.data.status == 1){
          this.setData({
            logisticsInfo:res.data.data_trace,
            data_order_info:res.data.data_order_info
          })
        }else{
          my.switchTab({
            url: '/page/user/user',
          });
        }
      },
    });
  },
});
