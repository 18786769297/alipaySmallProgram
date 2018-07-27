Page({
  data: {
    order_sn:'',
    one_amount:'',
    leaseTerm:'',
    deposit:'',
    credit_amount:'',
    exempted_num:'',
    exempted:''
  },
  onLoad(query) {
    this.setData({
      order_sn:query.order_sn,
      one_amount:query.one_amount,
      leaseTerm:query.leaseTerm,
      deposit:query.deposit,
      credit_amount:query.credit_amount,
      exempted_num:query.exempted_num,
      exempted:query.exempted
    })
  },
  lookOrder(){
     my.switchTab({url:'/page/user/user'})
  },
  backIndex(){
    my.reLaunch({
      url: '/page/index/index'
    })
  }
});
