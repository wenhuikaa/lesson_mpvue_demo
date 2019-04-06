import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const state={
    //是否授权
    isAuthenticate:false,
    user:null,
    openId:'',
    lessonInfo:null
};

export default new Vuex.Store({
   state,
   getters,
   mutations,
   actions 
})