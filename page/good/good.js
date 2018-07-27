Page({
  data: {
    goods_info: [],
    introductimg: [],
    packages: '',
    hidden: 1,
    attrs: [],
    attr: [],
    attrinfo: '点击选择规格',
    attr_show: false,
    term_id: '',
    goods_item_id: '',
    days: '',
    query: [],
    type:0,
    secend:false,
    qclose : false,
    kill_timer:[
      [-1]
    ]
  },
  //申请评估
  submitform() {
    const app = getApp();
    const domain = app.globalData.domain;

    this.data.attr.forEach((element) => {
      if (element.title == '选择租期') {
        element.items.forEach((element) => {
          if (element.select == 1) {
            this.setData({
              term_id: element.id
            })
          }
        }, this);
      }
    }, this);
    var goodinfo = this.data;
    my.httpRequest({
      url: domain + 'aliapp/order/order/' + goodinfo.goods_info.goods_item_id+'?days='+goodinfo.days+'&type='+this.data.type,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        dataType: 'json',
        success : (res)=>{
          if(res.data.status == 1){
            my.startZMCreditRent({
                creditRentType: 'rent',
                category: res.data.type,/**分类(由支付宝类目表决定)*/
                amount: res.data.all_amount,/**总租金*/
                deposit: res.data.deposit,/**总押金*/
                out_order_no: res.data.order_sn,
                overdue_time: res.data.overdue,/**逾期时间*/
                order_process_url: res.data.order_process_url,
                item_id: res.data.item_id,
                subject: {
                    "products": [
                        {   "count": 1,   /** 商品件数 */
                            "amount": res.data.one_amount,  /**一期租金*/
                            "deposit": res.data.deposit, /**总押金*/
                            "installmentCount": res.data.leaseTerm,  /**分期数*/
                            "name": encodeURIComponent(goodinfo['goods_info'].goods_name) /** 商品名 */
                        }]
                },
                success: (res) => {
                    if(res.orderNo != null){
                      my.navigateTo({ url: '/page/proview/proview?order_sn='+res.outOrderNo+'&zmOrderNo='+res.orderNo });
                    }
                },
                fail: (res) => {
                    console.log(JSON.stringfy(res))
                }
            });
          }else{
            my.alert({content:"请重试"})
          }
        }
    })
    
  },
  // 商品属性
  attr() {
    const app = getApp();
    const domain = app.globalData.domain;
    this.setData({
      attr_show: true
    })
  },
  // 关闭属性页面
  attr_close() {
    this.setData({
      attr_show: false
    })
  },
  // 选择属性
  selectattr(query) {
    my.showLoading({
      content: '加载中...',
    });

    const app = getApp();
    const domain = app.globalData.domain;

    var i = query.currentTarget.dataset.i;
    var j = query.currentTarget.dataset.j;

    if (this.data.attr[i].title == '选择租期') {
      const temp = this.data.attr;

      temp[i].items.forEach(function (element) {
        element.select = 0;
      }, this);

      temp[i].items[j].select = 1;
      this.setData({
        attr: temp,
        term_id: temp[i].items[j].id,
        days:temp[i].items[j].days
      })
    }
    if (query.currentTarget.dataset.id) {
      // 商品信息
      my.httpRequest({
        url: domain + 'aliapp/goods/view/' + query.currentTarget.dataset.id+'?days='+this.data.days,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        dataType: 'text',
        success: (res) => {
          let responseData = JSON.parse(res.data);
          this.setData({
            goods_info: responseData.goods_info,
            attr:responseData.attr,
            goods_item_id: responseData.goods_info.goods_item_id
          });
          // 匹配图片
          var introduct = responseData.goods_info.introduct;
          var imgReg = /<img.*?(?:>|\/>)/gi;
          var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
          var arr = introduct.match(imgReg);
          const image_src = [];
          for (var i = 0; i < arr.length; i++) {
            var src = arr[i].match(srcReg);
            //获取图片地址
            if (src[1]) {
              image_src.push(src[1]);
            }
          }
          this.setData({
            introductimg: image_src
          })
          // 匹配文字
          var packages = responseData.goods_info.packages;
          var spanReg = /<span[^>]*>([\s\S]*?)<\/span>/i;
          var spanarr = packages.match(spanReg);
          if (spanarr!=null && spanarr[1]) {
            this.setData({
              packages: spanarr[1]
            })
          }
        },
        complete: function (res) {
          my.hideLoading();
        }
      });
    }
  },
  onLoad(query) {
    this.setData({
      query: query,
      days:query.days
    })
  },
  // 加载
  onReady() {
    my.showLoading({
      content: '加载中...',
    });
    const app = getApp();
    const domain = app.globalData.domain;
    if(app.globalData.query.length != 0){
      this.setData({
        query: app.globalData.query,
        days:app.globalData.query.days
      })
      app.globalData.query = [];
    }
    const query = this.data.query;
    if(query.type == 1){
      this.setData({
        type:1
      })
    }
    // 商品信息
    my.httpRequest({
      url: domain + 'aliapp/goods/view/' + query.id + '?days=' + this.data.days+'&type='+this.data.type,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'text',
      success: (res) => {
        let responseData = JSON.parse(res.data);
        this.setData({
          goods_info: responseData.goods_info,
          kill_secend: responseData.goods_info.kill_time - responseData.goods_info.now,
          attr: responseData.attr,
          goods_item_id: responseData.goods_info.goods_item_id
        });
        if(this.data.type){
          this.secend();
        }
        // 匹配图片
        var introduct = responseData.goods_info.introduct;
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = introduct.match(imgReg);
        const image_src = [];
        for (var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg);
          //获取图片地址
          if (src[1]) {
            image_src.push(src[1]);
          }
        }
        this.setData({
          introductimg: image_src
        })
        // 匹配文字
        var packages = responseData.goods_info.packages;
        var spanReg = /<span[^>]*>([\s\S]*?)<\/span>/i;
        var spanarr = packages.match(spanReg);
        if(spanarr != null){
          if (spanarr!=null&&spanarr[1]) {
            this.setData({
              packages: spanarr[1]
            })
          }
        }
      },
      complete: function (res) {
        my.hideLoading();
      }
    });
  },
  //倒计时
  secend() {
    if(this.data.secend){
      return false;
    }
    this.setData({
      secend : true
    })
    console.log(this.data.kill_secend);
    var ktimer1 = setInterval(() => {
      var kill_secend = this.data.kill_secend;
      if (this.data.kill_secend <= 0) {
        clearInterval(ktimer);
        this.setData({
          killshow: false
        })
      } else {
        const time = new Array();
        time[0] = parseInt(kill_secend / 3600);
        time[1] = parseInt((kill_secend % 3600) / 60);
        time[2] = kill_secend % 60;
        kill_secend--;
        var time0,time1,time2= '';
        if(time[0]<10) time0 = 0;
        if(time[1]<10) time1 = 0;
        if(time[2]<10) time2 = 0;
        this.setData({
          kill_timer: time,
          kill_secend: kill_secend,
          time0:time0,
          time1:time1,
          time2:time2,
        })
      }
    }, 1000);
  },
  // 隐藏切换
  onhidden(query) {
    this.setData({
      hidden: query.currentTarget.dataset.hidden
    })
  },
  //
  mysm(){
   this.setData({
     qclose : true
   })
  },
  qclose(){
    this.setData({
     qclose : false
   })
  },
  backIndex(){
    my.reLaunch({
      url: '/page/index/index'
    })
  },
  onShareAppMessage() {
      return {
        title: '鱿鱼',
        desc: '高端智能产品信用租赁平台',
        path: 'page/good/good?id='+this.data.query.id +'&days='+this.data.query.days+'&type='+this.data.query.type
      };
    },
});