Page({
  data: {
    status:1,
    statusNum:0,
    order_sn:'',
    is_cancel:false,
    items: [
      {name: '想要重新下单', value: '0', checked: true},
      {name: '商品价格较贵', value: '1'},
      {name: '等待时机较长', value: '2'},
      {name: '是想了解流程', value: '3'},
      {name: '不想要了', value: '4'},
    ],
    again:0,
    moreHid: true,
    noneHid: true
  },

  onLoad(query) {
    this.setData({
      query: query,
      type:'all'
    })
  },
  onShow() {
    this.onReady();
  },
  onReady() {
    if(this.data.statusNum == 0){
      if(this.data.query.type==1){
        this.setData({
          status: 0,
        })
        return false;
      }
    }
    my.showLoading({
      content: '加载中...',
    });
    const query = this.data.query;
    const app = getApp();
    this.domain = app.globalData.domain;
    this.token  = app.globalData.userinfo.access_token;
    var type    = this.data.type;
    my.httpRequest({
      url: this.domain + 'aliapp/order/list/?access-token=' + this.token + "&type="+type+"&page=1", // 目标服务器 url
      success: (res) => {
        this.setData({
          number:res.data.customer_service
        })
        this._loadOrdersByType(res.data, type=type);
        my.hideLoading();
      },
      complete: (res) => {
        my.hideLoading();
        my.stopPullDownRefresh()
      }
    });
  },

  onSkip: function(event){
    const query = this.data.query;
    const app   = getApp();

    this.domain = app.globalData.domain;
    this.token  = app.globalData.userinfo.access_token;

    var type = event.currentTarget.dataset.type;
    this.setData({
      type : type,
      status:1
    })
    my.httpRequest({
      url: this.domain + 'aliapp/order/list/?access-token=' + this.token + "&type=" + type + "&page=1", // 目标服务器 url
      success: (res) => {
        this._loadOrdersByType(res.data, type=type);
      },

      fail: function (res) {
        my.alert({ content: '错误，请重试！' });
      },

    });
    
  },

  //点击加载更多
  loadMore: function(event){
    var page = event.currentTarget.dataset.page;
    var type = event.currentTarget.dataset.type;
    page = parseInt(page) + 1;
    my.httpRequest({
      url: this.domain + 'aliapp/order/list/?access-token=' + this.token + "&type=" + type + "&page=" + page, // 目标服务器 url
      success: (res) => {
        this._loadMoreOrdersByType(res.data, type=type);
      },
    });
  },

  //通过订单类型加载更多订单
  _loadMoreOrdersByType: function(res, type){
    var page = res.pager.page;
    var pagecount = res.pager.pagecount;
    if(page >= pagecount){
      var moreHid = true;
      var noneHid = false;
    }else{
      var moreHid = false;
      var noneHid = true;
    }
    res = res.data;
    var orderArr = this.data.orderArr;
    for(var i in res){
      orderArr.push(res[i]);
    }
    this.setData({
      orderArr: orderArr,
      type: type,
      page: page,
      moreHid: moreHid,
      noneHid: noneHid
    });
  },

  //通过订单类型加载订单
  _loadOrdersByType: function(res, type){
    var page = res.pager.page;
    var pagecount = res.pager.pagecount;
    if(this.data.statusNum == 0){
      if(res.pager.count == 0){
        this.setData({
          status:0
        })
      }else{
        this.setData({
          statusNum:1
        })
      }
    }
    if(page >= pagecount){
      var moreHid = true;
      var noneHid = false;
    }else{
      var moreHid = false;
      var noneHid = true;
    }
    res = res.data;

    this.setData({
      orderArr: res,
      type: type,
      page: page,
      moreHid: moreHid,
      noneHid: noneHid
    });
  },

  //跳转到订单详情页
  detail: function(data){
    var orderSn = data.target.dataset.orderSn;
    var order_status = data.target.dataset.status;
    my.navigateTo({
      url: '../order_detail/order_detail?orderSn='+orderSn+'&type='+order_status
    });
  },

  changeStatus: function(data){
    var order_sn = data.target.dataset.orderSn;
    var index = data.target.dataset.index;
    switch (index)
    {
      case 0://联系客服
        this.makePhoneCall();
        break;
      case 1://取消订单
        this.setData({
          is_cancel:true,
          order_sn:order_sn
        })
        console.log(this.data);
        break;
      case 2://查看物流
        this.showLogistics(order_sn);
        break;
      case 3://查看账单
        this.unsubscribe(order_sn);
        break;
      default:
        break; 
    }
  },
  again(){
    this.setData({
      is_cancel:false
    })
  },
  radioChange: function(e) {
    this.setData({
      again:e.detail.value
    })
  },
  cancelOrder: function(order){
    const app = getApp();
    var reason = this.data.items[this.data.again].name;
    my.httpRequest({
      url: app.globalData.domain+'aliapp/order/cancel/?access-token='+app.globalData.userinfo.access_token, // 目标服务器url
      method: 'POST',
      data :{
        order_sn : this.data.order_sn,
        remark : reason
      },
      success: (res) => {
        if(res.data.status == 1){
          this.setData({
            is_cancel:false
          })
          this.onReady();
        }else{
          my.alert({content:'请求错误!'});
        }
      },
    });
  },

  unsubscribe: function(order){
    my.navigateTo({
      url: '../order_bill/order_bill?order_sn='+ order
    });
  },

  showLogistics: function(order){
    my.navigateTo({
      url: '../logistics/logistics?order_sn='+order
    });
  },

  returnApplication: function(order){
    my.navigateTo({
      url: '../good_return/good_return?order_sn='+order
    });
  },
  onPullDownRefresh() {
    var type    = this.data.type;
    this.onReady();
  },
  makePhoneCall() {
    my.makePhoneCall({ number: this.data.number });
  },
  gehome(){
    my.switchTab({url:'/page/index/index'});
  }
});
