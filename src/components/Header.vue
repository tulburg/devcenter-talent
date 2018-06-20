<template>
	<header>
		<div :class="{ bootup: bootup, boot: (boot && !bootup) }">
			<div class="logo">
				<router-link to="/">
					<img src="../assets/img/dc_blue.png" alt="logo" v-show="!showGrayLogo">
					<img src="../assets/img/dc_gray.png" alt="logo" v-show="showGrayLogo">
				</router-link>
			</div>
			<div class="header-links">
				<ul v-show="showLinks">
					<li><a :href="'/profile/'+username" :class="{ active : (activeLink=='/profile/'+username) }" v-on:click="setActiveLink('/profile/'+username)">Profile</a></li>
					<li><a href="/projects" :class="{ active : (activeLink=='/projects') }" v-on:click="setActiveLink('/projects')">Projects</a></li>
					<li><a href="/inbox" :class="{ active : (activeLink=='/inbox'), unread: unread }" v-on:click="setActiveLink('/inbox')">Inbox</a></li>
				</ul>
			</div>
			<div class="header-actions">
				<router-link to="/">
					<button v-show="showHome" class="long">Home</button>
				</router-link>
				<router-link to="/">
					<button v-show="showLogin" class="long">Log In</button>
				</router-link>
				<router-link to="/join-talent-pool">
					<a class="button" v-show="showSignup">Join Our Talent Pool</a>
				</router-link>
				<div class="account-holder" v-show="showAccount">
					<div class="account-photo">
						<img src="../assets/img/placeholder.svg" alt="placeholder" class="account-pic acc-d" v-if="profile_image==undefined" />
						<img :src="profile_image" alt="photo" class="account-pic acc-d" v-else />
					</div>
					<div class="account-name acc-d">{{ fullname }} <i :class="{ upward: showAccountDropDown }" class="dc-caret acc-d"></i></div>
					<transition name="account-drop">
						<ul class="account-drop acc-d" v-show="showAccountDropDown">
							<li v-for="i in accountLinks">
								<router-link :to="i.url" v-if="i.action == undefined">{{ i.title }}</router-link>
								<a href="" v-on:click.prevent="i.action" v-else>{{ i.title }}</a>
							</li>
						</ul>
					</transition>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
	import Bus from '@/Bus'
	import store from '@/store'
	export default {
		name: 'Header',
		data() {
			var self = this;
			return { showGrayLogo: false, showLinks: false, showLogin: false, showHome: false, showAccount: false, showSignup: false, showAccountDropDown: false, boot: false, bootup: false, profile_image: undefined,
				accountLinks: [
					{ url: "/account/earnings", title: "Earnings" },
					{ url: "/account/settings", title: "Account Settings" },
					{ url: "/account/feedback", title: "Feedback" },
					{ action: function() { self.logOut() }, title: "Log Out" }
				],
				activeLink: '', unread : true, fullname: 'John Doe', username: 'john_doe'
			}
		},
		methods: {
			toggleDropDown: function(e) {
				var e = e || window.event;
				if(this.showAccountDropDown) this.showAccountDropDown = false;
				else if(e.target && e.target.className.match("acc-d")) this.showAccountDropDown = true;
			},
			logOut: function() {
				this.showAccount = false;
				store.commit('endSession'); 
				this.$router.push("/#logout");
			},
			setActiveLink(link) {
				this.activeLink = link;
				localStorage.setItem("activeLink", link);
			},
			bootNow() {
				var self = this;
				store.dispatch('getSession').then(session => {
					if(session) { 
						if(session.user.first_name != undefined) { this.fullname = session.user.first_name }
						if(session.user.last_name != undefined) { this.fullname = this.fullname+" "+session.user.last_name }
						if(session.user.username != undefined){ this.username = session.user.username; }
						self.bootup = true;
					}
				});
			}
		},
		created() {
			store.dispatch('getSession').then(session => {
				if(session) { 
					if(session.user.first_name != undefined) { this.fullname = session.user.first_name }
					if(session.user.last_name != undefined) { this.fullname = this.fullname+" "+session.user.last_name }
					if(session.user.username != undefined){ this.username = session.user.username; }
					if(session.user.profile_image) { this.profile_image = session.user.profile_image; }
				}
			});
		},
		mounted() {
			var self = this;
			Bus.$on("Header_showLogin", function(bool){ self.showLogin = bool });
			Bus.$on("Header_showHome", function(bool){ self.showHome = bool });
			Bus.$on("Header_showLinks", (bool) => { self.showLinks = bool });
			Bus.$on("Header_showGrayLogo", (bool) => { self.showGrayLogo = bool });
			Bus.$on("Header_showAccount", (bool) => { self.showAccount = bool });
			Bus.$on("Header_showSignup", (bool) => { self.showSignup = bool; });
			Bus.$on("Header_activeLink", (string) => { self.setActiveLink(string); });
			Bus.$on("Header_setBoot", (bool) => { self.boot = bool });
			Bus.$on("Header_startBoot", (bool) => { self.bootNow() });
			Bus.$on("Header_updatePhoto", (photo) => { self.profile_image = photo; console.log("Header working..."); });
			this.activeLink = localStorage.getItem("activeLink");
			document.addEventListener("click", function(e) { self.toggleDropDown(e); });
		}
	}
</script>