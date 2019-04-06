const domain = 'https://mpvue0124.herokuapp.com/';

const interfaces = {
    // 获取openID的接口
    getOpenid: domain + 'api/profiles/getOpenid/',
    getMyLesson:domain+'api/profiles/mylessons/',
    getQuestions:domain+'api/profiles/questions/',
    myLesson:domain+'api/profiles/myLesson/',
    getHotLessons:domain+'api/profiles/hotLessons/',
    getCatalogue:domain+"api/profiles/lessondetail/",
    getLessons:domain+"api/profiles/lessons",
}

//挂载，以便外部引用
module.exports=interfaces