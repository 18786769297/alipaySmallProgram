Page({
  data: {
    order_sn:'',
    one_amount:'',
    leaseTerm:'',
    deposit:'',
    credit_amount:'',
    exempted_num:'',
    exempted:'',
    zmOrderNo:''
  },
  onLoad(query) {
    this.setData({
      order_sn:query.order_sn,
      one_amount:query.one_amount,
      leaseTerm:query.leaseTerm,
      deposit:query.deposit,
      credit_amount:query.credit_amount,
      exempted_num:query.exempted_num,
      exempted:query.exempted,
      zmOrderNo:query.zmOrderNo,
    })
    console.log(query);
  },
  submitform(){
    const app = getApp();
    var domain = app.globalData.domain;
    console.log(this.data.order_sn);
    console.log(this.data.zmOrderNo);
    my.zmRentTransition({      
      creditRentType:"signPay",/*信用租固定 */
      outOrderNo:this.data.order_sn,/** 外部订单号*/
      zmOrderNo:this.data.zmOrderNo,/** 芝麻订单号*/
      success: (res) => {
        if(res.order_status == 'SUCCESS'){
          my.httpRequest({
            url:domain+'aliapp/order/payment_order/',
            method:'post',
            data:{'order_sn':this.data.order_sn},
            success :(rest)=>{
              if(rest.data.status){
                my.redirectTo({ 
                  url: '/page/order_exhibition/order_exhibition?order_sn='+this.data.order_sn+'&one_amount='+this.data.one_amount
                  +'&leaseTerm='+this.data.leaseTerm+'&deposit='+this.data.deposit+'&credit_amount='+this.data.credit_amount
                  +'&exempted_num='+this.data.exempted_num+'&exempted='+this.data.exempted
                });
              }else{
                my.redirectTo({ 
                  url: '/page/order_fail/order_fail?order_sn='+this.data.order_sn+'&one_amount='+this.data.one_amount
                  +'&leaseTerm='+this.data.leaseTerm+'&deposit='+this.data.deposit+'&credit_amount='+this.data.credit_amount
                  +'&exempted_num='+this.data.exempted_num+'&exempted='+this.data.exempted+'&zmOrderNo='+this.data.zmOrderNo
                });
              }
            }
          })
        }else{
         my.redirectTo({ 
            url: '/page/order_fail/order_fail?order_sn='+this.data.order_sn+'&one_amount='+this.data.one_amount
            +'&leaseTerm='+this.data.leaseTerm+'&deposit='+this.data.deposit+'&credit_amount='+this.data.credit_amount
            +'&exempted_num='+this.data.exempted_num+'&exempted='+this.data.exempted+'&zmOrderNo='+this.data.zmOrderNo
          });
        }
      },
      fail: (res) => {
          my.redirectTo({ 
            url: '/page/order_fail/order_fail?order_sn='+this.data.order_sn+'&one_amount='+this.data.one_amount
            +'&leaseTerm='+this.data.leaseTerm+'&deposit='+this.data.deposit+'&credit_amount='+this.data.credit_amount
            +'&exempted_num='+this.data.exempted_num+'&exempted='+this.data.exempted+'&zmOrderNo='+this.data.zmOrderNo
          });
       }
     });
  }
});
