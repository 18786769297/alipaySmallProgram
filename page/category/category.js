Page({
  data: {
    category: [],
    goods: [],
    id: '',
    secend : false,
    killshow: false,
    time:[
      [-1]
    ]
  },
  
  // 商品页
  good(query) {
    var type = 0;
    if(query.currentTarget.dataset.type == 1){
      type = 1;
    }
    my.navigateTo({
      url: '../good/good?id=' + query.currentTarget.dataset.id+'&days='+query.currentTarget.dataset.days+'&type='+type
    })
  },

  // 分类
  category(query) {
    var id = query.currentTarget.dataset.id;
    this.setData({
      id: id
    })
    if(id == 10){
      this.setData({
        killshow: true
      })
    }
    const app = getApp();
    const domain = app.globalData.domain;

    my.showLoading({
      content: '加载中...',
    });

    // 获取商品
    my.httpRequest({
      url: domain + 'aliapp/goods/categorylist/' + id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      success: (res) => {
        let responseData = res.data;
        if(id==10){
          if(res.data.seckill.data != undefined){

             let kill_secend = 0;
            if(res.data.type == 2){
              this.setData({
                killshow: false
              });
            }else{
              if(res.data.type == 1){
                kill_secend = responseData.seckill.endTimeStr - responseData.seckill.now
              }else{
                kill_secend = responseData.seckill.startTimeStr - responseData.seckill.now
              }
              this.setData({
                seckill: res.data.seckill,
                now:responseData.seckill.now,
                killtype:responseData.seckill.type,
                kill_secend: kill_secend
              });
              this.secend();
            }
          }else{
             this.setData({
              killshow: false
            });
          }
        }else{
          this.setData({
            goods: responseData,
            killshow: false
          });
        }
      },
      fail: function (res) {
        my.alert({ content: '数据请求错误，请重试！' });
      },
      complete: function (res) {
        my.hideLoading();
      }
    });
  },

  onLoad(query) {
    if (!query.id)
      var id = 1;
    else
      var id = query.id;

    this.setData({
      id: id
    })
  },

  // 加载商品
  onReady() {
    const app = getApp();
    const domain = app.globalData.domain;

    my.showLoading({
      content: '加载中...',
    });
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight-2
        })
      }
    })
    if(this.data.id == 10){
      this.setData({
        killshow: true
      })
    }
    // 获取商品
    my.httpRequest({
      url: domain + 'aliapp/goods/categorylist/' + this.data.id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'text',
      success: (res) => {
        let responseData = JSON.parse(res.data);
        if(this.data.id==10){
          if(responseData.seckill.data != undefined){
            let kill_secend = 0;
            if(res.data.type == 1){
              kill_secend = responseData.seckill.endTimeStr - responseData.seckill.now
            }else{
              kill_secend = responseData.seckill.startTimeStr - responseData.seckill.now
            }
             this.setData({
              seckill: responseData.seckill,
              killtype:responseData.seckill.type,
              now:responseData.seckill.now,
              kill_secend: kill_secend
            });
            this.secend();
          }else{
             this.setData({
              killshow: false
            });
          }
        }else{
          this.setData({
            goods: responseData,
            killshow: false
          });
        }
      },
      fail: function (res) {
        my.alert({ content: '数据请求错误，请重试！' });
      }
    });

    // 获取分类
    my.httpRequest({
      url: domain + 'aliapp/goods/category/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'text',
      success: (res) => {
        let responseData = JSON.parse(res.data);
        this.setData({
          category: responseData
        });
      },
      fail: function (res) {
        my.alert({ content: '数据请求错误，请重试！' });
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
    var now = this.data.now;
    var ktimer = setInterval(()=>{
      if(this.data.killtype == 0){
        if(this.data.seckill.startTimeStr <= now) {
          this.setData({
            killtype: 1
          })
        }else {
          const time =new Array();
          time[0] = parseInt((this.data.seckill.startTimeStr - now)/3600);
          time[1] = parseInt(((this.data.seckill.startTimeStr - now)%3600)/60);
          time[2] = (this.data.seckill.startTimeStr - now)%60;
          var time0,time1,time2= '';
          if(time[0]<10) time0 = 0;
          if(time[1]<10) time1 = 0;
          if(time[2]<10) time2 = 0;
          this.setData({
            time: time,
            time0:time0,
            time1:time1,
            time2:time2,
          })
          now++;
        }
      }else{
          if(this.data.seckill.endTimeStr <= now) {
          clearInterval(ktimer);
          this.setData({
            killshow: false
          })
        }else {
          const time =new Array();
          time[0] = parseInt((this.data.seckill.endTimeStr - now)/3600);
          time[1] = parseInt(((this.data.seckill.endTimeStr - now)%3600)/60);
          time[2] = (this.data.seckill.endTimeStr - now)%60;
          var time0,time1,time2= '';
          if(time[0]<10) time0 = 0;
          if(time[1]<10) time1 = 0;
          if(time[2]<10) time2 = 0;
          this.setData({
            time: time,
            time0:time0,
            time1:time1,
            time2:time2,
          })
          now++;
        }
      }
    }, 1000);
  },
});
