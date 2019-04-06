<template>
  <div class="container">
    <div class="login">
      <img src="/static/imgs/guide_bg.jpg" alt>
      <div class="learn">
        <button open-type="getUserInfo" @getuserinfo="getUserInfo">开始学习</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getUserInfo(e) {
      //判断授权成功
      if (e.mp.detail.userInfo) {
        console.log(e.mp.detail.userInfo);
        //存储到vuex中
        this.$store.dispatch("setIsAuthenticate", true);
        this.$store.dispatch("setUser", e.mp.detail.userInfo);
        // 获取code
        this.getCode();
      }
    },
    getCode() {
      // 在mpvue中,提供了一个全局小程序对象 wx
      wx.login({
        success: res => {
          console.log(res);
          this.getOpenid(res.code);
        }
      });
    },
    getOpenid(code) {
      //三个参数appid appsecret code
      const appid = "wxad3a587b9f4aa646";
      const appsecret = "e692a872d11563b253d21b21ee1216ee";

      // //加载动画
      // wx.showLoading({
      //   title:"加载中..."
      // })
      // wx.request({
      //   url:this.$interfaces.getOpenid+appid+"/"+appsecret+"/"+code,
      //   method:"get",
      //   success(res){
      //     //请求成功后隐藏加载动画
      //     wx.hideLoading();
      //     console.log(res.data)
      //   },
      //   fail(err){
      //     console.log(err)
      //   }
      // })
      this.$https
        .request({
          url:
            this.$interfaces.getOpenid + appid + "/" + appsecret + "/" + code,
          method: "get"
        })
        .then(res => {
          console.log(res);
          //将openid存储到vuex中
          this.$store.dispatch("setOpenId",res.openid);

          //请求课程数据
          this.isLearned(res.openid);
        })
        .catch(err => {
          console.log(err);
        });
    },
    isLearned(openid){
      this.$https.request({
        //如果测试过了，就可以得到课程数据，若没有测试过，则不能拿到课程数据
        url:this.$interfaces.getMyLesson+openid,
        method:"get"
      }).then(res=>{
        console.log("已经测试通过了");
        console.log(res);
        this.$store.dispatch("setLessonInfo",res);
        //测试通过后，跳转学习页面
        wx.switchTab({
          url:"../learn/main"
        })
      }).catch(error=>{
        console.log("还没有测试");
        //没有通过测试，则跳到问题页面
        wx.redirectTo({
          url:"../question/main"
        });
      });
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.login {
  width: 100%;
  height: 100%;
  position: relative;
}
.login img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.login .learn {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
}
.learn button {
  position: absolute;
  top: 90%;
  left: 10%;
  width: 80%;
  background-color: #009eef;
  color: white;
}
</style>
