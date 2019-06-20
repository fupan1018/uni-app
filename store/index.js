import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		GWsearchData : '',// 搜索页面保存的参数
		pageUrl:'',//页面地址
		calendar:''//日期
		
    },
	getters:{
		getPageUrl:state=>state.pageUrl,
		getCalendar:state=>state.calendar
	},
    mutations: {
        setPageUrl(state,Url){
			//更改状态--页面地址
			state.pageUrl=Url;
		},
		setCalendar(state,calendar){
			//设置日期
			state.calendar=calendar;
		}
    },
	actions:{
		
	}
})

export default store
