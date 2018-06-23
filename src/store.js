import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'js-cookie'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		api: {
			development: "http://alpha.developers.devcenter.co/api/",
			production: "http://developers.devcenter.co/api/"
		}
	},
	mutations: {
		startSession: function(state, payload){
			localStorage.setItem("DevTalent", JSON.stringify({ 
				userid: payload.user.id, 
				type: payload.user.account_type,
				token: payload.token,
				user: payload.user
			}));
		},
		endSession: function(state, payload) {
			localStorage.removeItem("DevTalent");
			localStorage.removeItem("profile_completion_state");
			localStorage.removeItem("profile_data");
		},
		saveProfile: function(state, payload) {
			let data = JSON.parse(localStorage.getItem("DevTalent"));
			data.user_profile = payload;
			localStorage.setItem("DevTalent", JSON.stringify(data));
		},
		saveUser: function(state, payload) {
			let data = JSON.parse(localStorage.getItem("DevTalent"));
			data.user = payload;
			localStorage.setItem("DevTalent", JSON.stringify(data));
		},
		saveProjects: function(state, payload) {
			let data = JSON.parse(localStorage.getItem("DevTalent"));
			data.projects = payload;
			localStorage.setItem("DevTalent", JSON.stringify(data));
		}
	},
	actions: {
		getSession() {
			let data = localStorage.getItem("DevTalent");
			if(data) {
				return JSON.parse(data);
			} return null;
		}
	}
});