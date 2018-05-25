<template>
	<header>
		<div>
			<div class="logo">
				<router-link to="/">
					<img src="../assets/img/dc_blue.png" alt="logo" v-show="!showGrayLogo">
					<img src="../assets/img/dc_gray.png" alt="logo" v-show="showGrayLogo">
				</router-link>
			</div>
			<div class="header-links">
				<ul v-show="showLinks">
					<li><a href="#" class="active">Profile</a></li>
					<li><a href="#">Projects</a></li>
					<li><a href="#">Inbox</a></li>
				</ul>
			</div>
			<div class="header-actions">
				<router-link to="/">
					<button v-show="showLogin" class="long">Log In</button>
				</router-link>
				<router-link to="/join-talent-pool">
					<a class="button" v-show="showSignup">Join Our Talent Pool</a>
				</router-link>
			</div>
		</div>
	</header>
</template>

<script>
	import Bus from '@/Bus'
	export default {
		name: 'Header',
		data() {
			return { showGrayLogo: false, showLinks: false, showLogin: false, showAccount: false, showSignup: false }
		},
		mounted() {
			var self = this;
			Bus.$on("Header_showLogin", function(bool){ self.showLogin = bool });
			Bus.$on("Header_showLinks", (bool) => { self.showLinks = bool });
			Bus.$on("Header_showGrayLogo", (bool) => { self.showGrayLogo = bool });
			Bus.$on("Header_showAccount", (bool) => { self.showAccount = bool });
			Bus.$on("Header_showSignup", (bool) => { self.showSignup = bool; console.log("show signup", bool); });
		}
	}
</script>