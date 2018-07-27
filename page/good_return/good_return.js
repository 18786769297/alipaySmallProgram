Page({
  data: {
    order_sn:'',
    orderInfo:[],
    array: [],
    index:0,
  },
   bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
  },
  onLoad(query) {
    this.setData({
      order_sn:query.order_sn
    })
    const app = getApp();
    var token = app.globalData.userinfo.access_token;
    my.httpRequest({
      url: app.globalData.domain+'aliapp/order/returnview/?access-token='+token, // 目标服务器url
      method: 'POST',
      data:{order_sn:this.data.order_sn},
      success: (res) => {
        if(res.data.status == 1){
          this.setData({
            array:res.data.express,
            orderInfo:res.data
          })
        }
      },
    });
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  confirm(query){
    var express_name = this.data.array[this.data.index].name;
    var express_no = this.data.inputValue;
    if(!express_no){
      my.alert({content:'请输入物流单号'});
      return false;
    }
    const app = getApp();
    var token = app.globalData.userinfo.access_token;
    my.httpRequest({
      url: app.globalData.domain+'aliapp/order/returnback/?access-token='+token, // 目标服务器url
      method:'POST',
      data:{
        order_sn:this.data.order_sn,
        express_name:express_name,
        express_no:express_no
      },
      success: (res) => {
        if(res.data.status==1){
          my.navigateBack({delta: 2})
        }else{
          my.alert({content:res.data.msg})
        }
      },
    });
  }
});
