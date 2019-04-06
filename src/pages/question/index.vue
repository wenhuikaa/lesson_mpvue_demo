<template>
  <div class="question">
    <img class="bg" src="/static/imgs/test.jpg" alt>
    <div class="qs_content" v-if="questions.length>0">
      <div v-if="!startqs">
        <p class="title">温馨提示:</p>
        <div class="warn_tag">为了更好的为您制定学习计划,请首先回答以下问题, 我们会为您量身推荐相关的课程.</div>
      </div>
      <div v-else>
        <p class="title">{{questions[currentIndex].title}}</p>
        <!-- 用户的选择response,然后遍历每个问题答案 -->
        <!-- item=>questions[currentIndex].option,index=>:key="index",每个问题选择的index -->
        <div
          class="response"
          v-for="(item,index) in questions[currentIndex].option"
          :key="index"
          @click="selectAnswer(index)"
        >
          <img v-if="item.select" src="/static/imgs/selected.jpg" alt>
          <img v-else src="/static/imgs/unselect.jpg" alt>
          <span>{{item.label}}</span>
        </div>
      </div>
    </div>
    <!-- disabled控制按钮能否被点击，用计算属性控制即可 ,disabled前面一定要有冒号，动态改变，没有冒号，则是"disabled"这个文本-->
    <button :disabled="disabled" @click="btn_click" class="qs_btn">{{btn_title}}</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      questions: [],
      startqs: false, //控制是否显示问题列表
      currentIndex: 0, //记录当前回到到第几题
      btn_title: "开始答题", //按钮的title
      lesson: "" //接收每次问题的答案
    };
  },
  // 小程序的生命周期
  onLoad() {
    this.getData();
  },

  computed: {
    disabled() {
      //!this.startqs为真，则说明this.startqs为假,则说明还没有有开始答题，则按钮有效
      if (!this.startqs) {
        return false;
      } else {
        //答题开始后，如果还需要继续答题，则获取选项
        const option = this.questions[this.currentIndex].option;
        let select = false;
        option.forEach(item => {
          if (item.select) {
            select = true;
          }
        });
        //若已经选中一项，则select改为true,返回!select,这样上面的disabled将会变为false,按钮有效
        return !select;
      }
    }
  },

  methods: {
    getData() {
      this.$https
        .request({
          url: this.$interfaces.getQuestions,
          method: "get"
        })
        .then(res => {
          console.log(res);
          //res.questions:从接口里拿到数据
          this.questions = res.questions;
        });
    },
    btn_click() {
      // 如果没有开始测试(this.startqs为false) 按钮标题默认显示’开始答题’如果已经开始测试 判断是否为最后一题（this.currentIndex == this.questions.length - 1）如果不是最后一题，按钮标题为’下一题’ 否则显示’完成’
      if (!this.startqs) {
        //开始答题后，把startqs设为true
        this.startqs = true;
        this.btn_title = "下一题";
      } else {
        //这里就要开始记录问题的答案
        this.lesson += this.getSelectOption();
        if (this.currentIndex < this.questions.length - 1) {
          this.btn_title = "下一题";
          this.currentIndex++;
          // 拼接逗号
          this.lesson += ",";
          if (this.currentIndex == this.questions.length - 1) {
            this.btn_title = "完成";
          }
        }else{
          //答题完成后
          console.log(this.lesson);
          this.sendQuestions();
        }
      }
    },

    //index是选中的索引
    selectAnswer(index) {
      const option = this.questions[this.currentIndex].option;
      //forEach将列表中的所有的是否选项都设置为未选中
      //每个option里面都有两个：label(是或否),select(false)
      //item就是option
      option.forEach(item => {
        item.select = false;
      });
      //将点击的选项选中，只要将其取反
      option[index].select = !option[index].select;
    },

    getSelectOption() {
      const option = this.questions[this.currentIndex].option;
      //label存储选中的答案
      let label = "";
      option.forEach(item => {
        if (item.select) label = item.label;
      });
      return label;
    },

    sendQuestions(){
      //定义默认等级为初级
      wx.setStorage({
        key:"grade",
        data:"初级"
      })
      this.$https.request({
        url:this.$interfaces.myLesson,
        method:"post",
        data:{
          //lesson拼接问题的答案
          lesson:this.lesson,
          //openId
          userId:this.$store.getters.openId,
        }
      })
      .then(res=>{
        //res:课程信息
        console.log(res);
        //存储课程信息到vuex
        this.$store.dispatch("setLessonInfo",res);
        //跳转到学习页面
        wx.switchTab({
          url:"../learn/main"
        })
      });
    }
  }
};
</script>
<style>
.question {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.question .bg {
  width: 100%;
  height: 100%;
}
.qs_content {
  position: absolute;
  width: 80%;
  height: 50%;
  background: #fff;
  top: 36%;
  left: 10%;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  color: rgb(13, 28, 51);
}
.qs_btn {
  position: absolute;
  top: 90%;
  left: 10%;
  width: 80%;
  background-color: #009eef;
  color: white;
}
.title {
  font-weight: bold;
  margin-bottom: 20px;
  word-break: break-all;
}
.warn_tag {
  padding: 40px 10px;
}
.response {
  padding: 10px;
}
.response img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>

