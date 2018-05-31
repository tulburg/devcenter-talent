<template>
	<header v-on:click="(e) => { toggleDropDown(e) }">
		<div>
			<div class="logo">
				<router-link to="/">
					<img src="../assets/img/dc_blue.png" alt="logo" v-show="!showGrayLogo">
					<img src="../assets/img/dc_gray.png" alt="logo" v-show="showGrayLogo">
				</router-link>
			</div>
			<div class="header-links">
				<ul v-show="showLinks">
					<li><a href="/profile/tulburg" :class="{ active : (activeLink=='/profile/tulburg') }" v-on:click="setActiveLink('/profile/tulburg')">Profile</a></li>
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
						<img src="../assets/img/placeholder.svg" alt="placeholder" class="account-pic" />
					</div>
					<div class="account-name">@adebayo <i :class="{ upward: showAccountDropDown }" class="dc-caret"></i></div>
					<transition name="account-drop">
						<ul class="account-drop" v-show="showAccountDropDown">
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
			return { showGrayLogo: false, showLinks: false, showLogin: false, showHome: false, showAccount: false, showSignup: false, showAccountDropDown: false,
				accountLinks: [
					{ url: "/account/earnings", title: "Earnings" },
					{ url: "/account/settings", title: "Account Settings" },
					{ url: "/feedback", title: "Feedback" },
					{ action: function() { self.logOut() }, title: "Log Out" }
				],
				activeLink: '', unread : true
			}
		},
		methods: {
			toggleDropDown: function(e) {
				var e = e || window.event;
				if(this.showAccountDropDown) this.showAccountDropDown = false;
				else if(e.target && e.target.className.match("account")) this.showAccountDropDown = true;
			},
			logOut: function() {
				this.showAccount = false;
				store.commit('endSession'); 
				this.$router.push("/");
			},
			setActiveLink(link) {
				this.activeLink = link;
				localStorage.setItem("activeLink", link);
			}
		},
		mounted() {
			var self = this;
			Bus.$on("Header_showLogin", function(bool){ self.showLogin = bool });
			Bus.$on("Header_showHome", function(bool){ self.showHome = bool });
			Bus.$on("Header_showLinks", (bool) => { self.showLinks = bool });
			Bus.$on("Header_showGrayLogo", (bool) => { self.showGrayLogo = bool });
			Bus.$on("Header_showAccount", (bool) => { self.showAccount = bool });
			Bus.$on("Header_showSignup", (bool) => { self.showSignup = bool; });
			Bus.$on("Header_hideDropDown", () => { self.toggleDropDown() });
			this.activeLink = localStorage.getItem("activeLink");
		}
	}
</script>