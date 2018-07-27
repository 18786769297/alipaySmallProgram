Page({
  data: {
    order_sn:'',
    billInfo:[],
    model:false,
    modelContent:{}
  },
  onLoad(query) {
    this.setData({
      order_sn:query.order_sn
    })
    console.log(this.data);
    const app = getApp();
    var token = app.globalData.userinfo.access_token;
    my.httpRequest({
      url: app.globalData.domain+'aliapp/order/bill/?access_token='+token, // 目标服务器url
      method:"POST",
      data:{order_sn:this.data.order_sn},
      success: (res) => {
        if(res.data.status == 1){
          this.setData({
            orderInfo:res.data,
            billInfo:res.data.order_rent
          })
        }
      },
    });
  },
  mmzf(){
    this.setData({
      model:true,
      modelContent:this.data.orderInfo.aliAppDesc.mmzf
    })
  },
  modelColse(){
    this.setData({
      model:false
    })
  }
});
