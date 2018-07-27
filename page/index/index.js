Page({
  data: {
    banner: [],
    category: [],
    tuijian : [],
    killshow: true,
    time:[
      [-1]
    ]
  },
  // 页面加载,请求数据
   onReady() {
    my.showLoading({
      content: '加载中...',
    });
    const app = getApp();
    const domain = app.globalData.domain;
    my.httpRequest({
      url: domain + 'aliapp/index/index/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        this.setData({
          banner: res.data.banner,
          category: res.data.category,
          secondkill: res.data.secondkill,
          starttime: res.data.secondkill.startTimeStr,
          endtime: res.data.secondkill.endTimeStr,
          killtype: res.data.secondkill.type,
          now: res.data.secondkill.now,
          tuijian: res.data.recommend
        });
        // 定时任务
        var now = this.data.now;
        var killtype = this.data.killtype;
        if(killtype != '2'){
          var timer = setInterval(()=>{
            if(killtype == 0){
              if(this.data.starttime <= now) {
                this.setData({
                  killtype: 1
                })
              }else {
                const time =new Array();
                time[0] = parseInt((this.data.starttime - now)/3600);
                time[1] = parseInt(((this.data.starttime - now)%3600)/60);
                time[2] = (this.data.starttime - now)%60;
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
              if(this.data.endtime <= now) {
                clearInterval(timer);
                this.setData({
                  killshow: false
                })
              }else {
                const time =new Array();
                time[0] = parseInt((this.data.endtime - now)/3600);
                time[1] = parseInt(((this.data.endtime - now)%3600)/60);
                time[2] = (this.data.endtime - now)%60;
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
        }else{
          this.setData({killshow:false})
        }
        my.hideLoading();
        my.stopPullDownRefresh()
      }
    })
  },
  // 页面跳转
  redirect(query) {
    my.navigateTo({
      url: '../good/good?id='+query.currentTarget.dataset.id+'&days='+query.currentTarget.dataset.days
    })
  },
  // 分类页面
  category(query) {
    my.navigateTo({
      url: '../category/category?id='+query.currentTarget.dataset.id
    })
  },
  // 秒杀页面
  secondkill() {
    my.navigateTo({
      url: '../category/category?id='+10+'&kill =1'
    })
  }
  
});


