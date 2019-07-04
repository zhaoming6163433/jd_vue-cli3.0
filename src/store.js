import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    createproinfo:{}
}
const mutations = {
    SAVE_CREATE_PRO_INFO(state,obj){
        state.createproinfo = obj;
    }
}
const getters = {
    getCreateProInfo(state){
        return state.createproinfo
    }
}
const actions = {

}
export default new Vuex.Store({
	state,
	mutations,
	getters,
	actions
})
