Page({
  data: {
    items: [
      {name: '想要重新下单', value: '0', checked: true},
      {name: '商品价格较贵', value: '1'},
      {name: '等待时机较长', value: '2'},
      {name: '是想了解流程', value: '3'},
      {name: '不想要了', value: '4'},
    ],
    order_type:'',
    buttonType: {
      cancel: "取消订单",//没付款
      logistics: "确认收货",
    },
    is_cancel:false,
    order_sn:'',
    again:0,
    number:'4000082588',
    orderInfo:[],
    modelContent:{},
    model:false
  },
  radioChange: function(e) {
    this.setData({
      again:e.detail.value
    })
  },
  again(){
    this.setData({
      is_cancel:false
    })
  },
  cancelOrder(){
    this.setData({
      is_cancel:true
    })
  },
  onLoad(query) {
    this.setData({
      order_sn:query.orderSn
    })
    const app = getApp();
    var access_token = app.globalData.userinfo.access_token;
    my.httpRequest({
      url: app.globalData.domain+'aliapp/order/orderdetail/?access-token='+access_token, // 目标服务器url
      method: "POST",
      data:{
        order_sn:this.data.order_sn
      },
      success: (res) => {
        if(res.data.status == 1){
          this.setData({
            orderInfo:res.data,
            number:res.data.customer_service,
            order_type:this.orderType(res.data.order_status),
          })
          console.log(res.data);
          if(res.data.return_status == 1){
            this.setData({
              order_type:{type:"退还中",msg:'产品正在退还中'},
            })
          }
          console.log(this.data);
        }else{
          // my.alert({content:res.data.msg})
        }
      },
    });
    
  },
  orderType(type){
    switch(type){
      case '-1' : return {type:"已取消",msg:'订单取消，用户主动取消'};break;
      case '0' :  return {type:"待发货",msg:'订单已经推送给商家备货，请耐心等待'};break;
      case '1' :  return {type:"待发货",msg:'订单已经推送给商家备货，请耐心等待'};break;
      case '20' : return {type:"已出库",msg:'商品已出库'};break;
      case '30' : return {type:"已发货",msg:'商品已发出'};break;
      case '40' : return {type:"租赁中",msg:'商品租用到期后买断或完成回收，冻结预授权金额将会释放'};break;
      case '80' : return {type:"完结",msg:'交易关闭'};break;
      default : return {type:"退还中",msg:'产品正在退还中'};break;
    }
  },
  cancelOrderC(){
    const app = getApp();
    var reason = this.data.items[this.data.again].name
    my.httpRequest({
      url: app.globalData.domain+'aliapp/order/cancel/?access-token='+app.globalData.userinfo.access_token, // 目标服务器url
      method: 'POST',
      data :{
        order_sn : this.data.order_sn,
        remark : reason
      },
      success: (res) => {
        if(res.data.status == 1){
          my.navigateBack();
        }else{
          my.alert({content:'请求错误!'});
        }
      },
    });
  },
  look(){
    my.navigateTo({
      url: '/page/order_bill/order_bill?order_sn='+this.data.order_sn
    })
  },
  qrsh(){

  },
  ghcp(){
    my.navigateTo({
      url: '/page/good_return/good_return?order_sn='+this.data.order_sn
    })
  },
  logistics(){
    my.navigateTo({
      url: '/page/logistics/logistics?order_sn='+this.data.order_sn
    })
  },
  zjsq(){
    this.setData({
      model:true,
      modelContent:this.data.orderInfo.aliAppDesc.zjsq
    })
  },
  mmzf(){
    this.setData({
      model:true,
      modelContent:this.data.orderInfo.aliAppDesc.mmzf
    })
  },
  fwf(){
    this.setData({
      model:true,
      modelContent:this.data.orderInfo.aliAppDesc.fwf
    })
  },
  qians(){
    this.setData({
      model:true,
      modelContent:this.data.orderInfo.aliAppDesc.qians
    })
  },
  modelColse(){
    this.setData({
      model:false
    })
  },
  makePhoneCall() {
    my.makePhoneCall({ number: this.data.number });
  }
});
