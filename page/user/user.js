Page({
  data:{
    type :0,
    number:'4000082588'
  },
  onShow() {
    my.showLoading({
      content: '加载中...',
    });
    const app = getApp();
      my.getAuthCode({
        scopes: 'auth_base',
        success: (res) => {
          my.httpRequest({
            url: app.globalData.domain+'aliapp/user/aliauth/?authCode='+res.authCode, // 目标服务器url
            success: (res) => {
              if(res.data.status == 1){
                app.globalData.userinfo.access_token = res.data.access_token;
                app.globalData.userinfo.phone = res.data.phone;
                app.globalData.userinfo.ali_uid = res.data.ali_uid;
                this.setData({
                  number:res.data.customer_service
                })
              }else{
                this.setData({
                  type:1
                })
              }
              my.hideLoading();
            }
          });
        }
      });
  },
  onChildItemTap(e){
    const { page } = e.target.dataset;
    my.navigateTo({ url: page+'?type='+this.data.type });
  },
  makePhoneCall() {
    my.makePhoneCall({ number: this.data.number });
  }
});
