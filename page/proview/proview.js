Page({
  data: {
    order_sn: '',
    lists: [],
    amount: '',
    query: [],
    radio:false,
    model:false,
    modelContent:{},
    radio1:false
  },
  onPullDownRefresh() {
    this.onReady();
    my.stopPullDownRefresh()
  },
  onLoad(query) {
    // query.order_sn = '2018062818224553525';
    // query.zmOrderNo = '2018062800001001088078787668';
    this.setData({
      query: query,
      order_sn: query.zmOrderNo
    })
  },

  // 加载商品
  onReady() {
    my.showLoading({
      content: '加载中...',
    });
    const query = this.data.query;
    const app = getApp();
    var domain = app.globalData.domain;

    my.httpRequest({
      url: domain + 'aliapp/order/getorder/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'order_sn': query.order_sn,
        'orderNo': query.zmOrderNo
      },
      dataType: 'json',
      success: (res) => {
        this.setData({
          lists : res.data
        })
        console.log(this.data);
      },
      fail: function (res) {
        console.log(res);
        // my.alert({ content: '错误，请重试！' });
      },
      complete: function (res) {
        my.hideLoading();
      }
    });
  },

  // 显示备注
  showdesc() {
    my.navigateTo({
       url:'/page/lease_agreement/lease_agreement?order_sn='+this.data.query.order_sn
    })
  },
  radio(){
    if(this.data.radio == false){
      this.setData({
        radio:true,
        radio1:false
      })
    }else{
      this.setData({
        radio:false
      })
    }
  },
  zjsq(){
    this.setData({
      model:true,
      modelContent:this.data.lists.aliAppDesc.zjsq
    })
  },
  mmzf(){
    this.setData({
      model:true,
      modelContent:this.data.lists.aliAppDesc.mmzf
    })
  },
  fwf(){
    this.setData({
      model:true,
      modelContent:this.data.lists.aliAppDesc.fwf
    })
  },
  modelColse(){
    this.setData({
      model:false
    })
  },
  submitform(){
    if(this.data.radio == false){
      this.setData({
        radio1:true
      })
      return false;
    }
    const app = getApp();
    var domain = app.globalData.domain;
    my.zmRentTransition({      
      creditRentType:"signPay",/*信用租固定 */
      outOrderNo:this.data.query.order_sn,/** 外部订单号*/
      zmOrderNo:this.data.query.zmOrderNo,/** 芝麻订单号*/
      success: (res) => {
        console.log(res);
        if(res.order_status == 'SUCCESS'){
          my.httpRequest({
            url:domain+'aliapp/order/payment_order/',
            method:'post',
            data:{'order_sn':this.data.query.order_sn},
            success :(rest)=>{
              if(rest.data.status){
                my.redirectTo({ 
                  url: '/page/order_exhibition/order_exhibition?order_sn='+this.data.order_sn+'&one_amount='+this.data.lists.one_amount
                  +'&leaseTerm='+this.data.lists.leaseTerm+'&deposit='+this.data.lists.deposit+'&credit_amount='+this.data.lists.credit_amount
                  +'&exempted_num='+this.data.lists.exempted_num+'&exempted='+this.data.lists.exempted
                });
              }else{
                my.redirectTo({ 
                  url: '/page/order_fail/order_fail?order_sn='+this.data.query.order_sn+'&one_amount='+this.data.lists.one_amount
                  +'&leaseTerm='+this.data.lists.leaseTerm+'&deposit='+this.data.lists.deposit+'&credit_amount='+this.data.lists.credit_amount
                  +'&exempted_num='+this.data.lists.exempted_num+'&exempted='+this.data.lists.exempted+'&zmOrderNo='+this.data.query.zmOrderNo
                });
              }
            }
          })
        }else{
         my.redirectTo({ 
            url: '/page/order_fail/order_fail?order_sn='+this.data.query.order_sn+'&one_amount='+this.data.lists.one_amount
            +'&leaseTerm='+this.data.lists.leaseTerm+'&deposit='+this.data.lists.deposit+'&credit_amount='+this.data.lists.credit_amount
            +'&exempted_num='+this.data.lists.exempted_num+'&exempted='+this.data.lists.exempted+'&zmOrderNo='+this.data.query.zmOrderNo
          });
        }
      },
      fail: (res) => {
          my.redirectTo({ 
            url: '/page/order_fail/order_fail?order_sn='+this.data.query.order_sn+'&one_amount='+this.data.lists.one_amount
            +'&leaseTerm='+this.data.lists.leaseTerm+'&deposit='+this.data.lists.deposit+'&credit_amount='+this.data.lists.credit_amount
            +'&exempted_num='+this.data.lists.exempted_num+'&exempted='+this.data.lists.exempted+'&zmOrderNo='+this.data.query.zmOrderNo
          });
       }
     });
  }

});
