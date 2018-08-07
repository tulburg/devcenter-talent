<template>
	<header>
		<div :class="{ boot: !boot }" class="top">
			<div class="logo">
				<router-link to="/">
					<img src="../../assets/img/dc_blue.png" alt="logo" v-show="!showGrayLogo">
					<img src="../../assets/img/dc_gray.png" alt="logo" v-show="showGrayLogo">
				</router-link>
			</div>
			<div class="header-links">
				<ul v-show="showLinks">
					<li v-if="!showPMLinks"><a href="#" :class="{ active : (activeLink=='/profile/'+((user) ? user.username : '')) }" v-on:click.prevent="setActiveLink('/profile/'+((user) ? user.username : ''))">Profile</a></li>
					<li v-if="!showPMLinks"><a href="#" :class="{ active : (activeLink=='/projects') }" v-on:click.prevent="setActiveLink('/projects')">Projects</a></li>
					<li v-if="!showPMLinks"><a href="#" :class="{ active : (activeLink=='/inbox'), unread: unread }" v-on:click.prevent="setActiveLink('/inbox')">Inbox</a></li>
					<li v-if="showPMLinks"><a href="#" :class="{ active : (activeLink=='/project-manager') }" v-on:click.prevent="setActiveLink('/project-manager/new')">My Projects</a></li>
					<li v-if="showPMLinks"><a href="#" :class="{ active : (activeLink=='/project-manager/talent-pool') }" v-on:click.prevent="setActiveLink('/project-manager/talent-pool')">Talent Pool</a></li>
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
						<img src="../../assets/img/avatar.svg" alt="profile photo" class="account-pic acc-d" v-if="(user) ? user.profile_image==undefined : false" />
						<img :src="(user) ? user.profile_image : ''" alt="photo" class="account-pic acc-d" v-else />
					</div>
					<div class="account-name acc-d">{{ (user) ? user.first_name+" "+user.last_name : "John Doe" }} <i :class="{ upward: showAccountDropDown }" class="dc-caret acc-d"></i></div>
					<transition name="account-drop">
						<ul class="account-drop acc-d" v-show="showAccountDropDown">
							<li v-if="showPMAccount==true" v-for="i in accountLinks.filter((a) => { return !a.devOnly; })">
								<router-link :to="i.url" v-if="i.action == undefined">{{ i.title }}</router-link>
								<a href="" v-on:click.prevent="i.action" v-else>{{ i.title }}</a>
							</li> 
							<li v-if="showPMAccount==false" v-for="i in accountLinks">
								<router-link :to="i.url" v-if="i.action == undefined">{{ i.title }}</router-link>
								<a href="" v-on:click.prevent="i.action" v-else>{{ i.title }}</a>
							</li>
						</ul>
					</transition>
				</div>
			</div>
		</div>
		<div class="bottom" v-if="showPMLinks">
			<ul v-if="activeLink=='/project-manager'">
				<li><a href="#" :class="{ active : (activeSubLink=='/project-manager/new') }" v-on:click.prevent="setActiveSubLink('/project-manager/new')">New</a></li>
				<li><a href="#" :class="{ active : (activeSubLink=='/project-manager/pending') }" v-on:click.prevent="setActiveSubLink('/project-manager/pending')">Pending</a></li>
				<li><a href="#" :class="{ active : (activeSubLink=='/project-manager/in-progress') }" v-on:click.prevent="setActiveSubLink('/project-manager/in-progress')">In Progress</a></li>
				<li><a href="#" :class="{ active : (activeSubLink=='/project-manager/closed') }" v-on:click.prevent="setActiveSubLink('/project-manager/closed')">Closed</a></li>
			</ul>
			<ul v-else>
				<li><a href="#" :class="{ active: (activeSubLink=='/project-manager/talent-pool') }" v-on:click.prevent="setActiveSubLink('/project-manager/talent-pool')">All Talents</a></li>
				<li><a href="#" :class="{ active: (activeSubLink=='/project-manager/talent-pool-assigned') }" v-on:click.prevent="setActiveSubLink('/project-manager/talent-pool-assigned')">Assigned Talents</a></li>
			</ul>
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
			return { showGrayLogo: false, showLinks: false, showLogin: false, showHome: false, showAccount: false, 
				showSignup: false, showAccountDropDown: false, showPMLinks: false, boot: true, user: undefined,
				accountLinks: [
					{ url: "/account/earnings", title: "Earnings", devOnly: true },
					{ url: "/account/settings", title: "Account Settings" },
					{ url: "/account/feedback", title: "Feedback", devOnly: true },
					{ action: function() { self.logOut() }, title: "Log Out" }
				],
				activeLink: '', activeSubLink: '', unread : true, showPMAccount: false
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
				this.$router.push(link);
			},
			setActiveSubLink(link) {
				this.activeSubLink = link;
				this.$router.push(link);
			},
			bootNow() {
				var self = this;
				store.dispatch('getSession').then(session => {
					if(session) { 
						self.user = session.user;
						self.boot = true;
					}
				});
			}
		},
		mounted() {
			var self = this;
			Bus.$on("Header_showLogin", function(bool){ self.showLogin = bool });
			Bus.$on("Header_showHome", function(bool){ self.showHome = bool });
			Bus.$on("Header_showLinks", (bool) => { self.showLinks = bool });
			Bus.$on("Header_showPMLinks", (bool) => { 
				self.showPMLinks = bool; 
				self.activeLink = self.$route.path;
				self.activeSubLink = self.$route.path;
				if(this.$route.path.match('/project-manager/talent-pool')){ this.activeLink = '/project-manager/talent-pool'; }
				else if(this.$route.path.match('/project-manager')) this.activeLink = '/project-manager';
			});
			Bus.$on("Header_showPMAccount", (bool) => { self.showPMAccount = bool });
			Bus.$on("Header_showGrayLogo", (bool) => { self.showGrayLogo = bool });
			Bus.$on("Header_showAccount", (bool) => { self.showAccount = bool });
			Bus.$on("Header_showSignup", (bool) => { self.showSignup = bool; });
			Bus.$on("Header_activeLink", (string) => { self.setActiveLink(string); });
			Bus.$on("Header_setBoot", (bool) => { self.boot = bool });
			Bus.$on("Header_startBoot", (bool) => { self.bootNow() });
			Bus.$on("Header_updatePhoto", (photo) => {  var profile_image = photo; console.log("Header working..."); });
			document.addEventListener("click", function(e) { self.toggleDropDown(e); });
			store.dispatch('getSession').then(session => {
				if(session) { 
					self.user = session.user;
					console.log(self.user);
				}
			});
			console.log(self.showPMLinks);
		}
	}
</script>