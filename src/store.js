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
			Cookie.set("DevTalent", { 
				userid: payload.user.id, 
				type: payload.user.account_type,
				token: payload.token,
				user: payload.user
			}, { expires: 7 });
		},
		endSession: function(state, payload) {
			Cookie.remove("DevTalent");
		},
		saveProfile: function(state, payload) {
			let cookie = Cookie.getJSON("DevTalent");
			cookie.user_profile = payload;
			Cookie.set("DevTalent", cookie);
		}
	},
	actions: {
		getSession() {
			let cookie = Cookie.getJSON("DevTalent");
			if(cookie) {
				return cookie;
			} return null;
		}
	}
});