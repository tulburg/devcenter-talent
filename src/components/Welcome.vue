<template>
	<section class="welcome">

		<div v-show="!showLogin">
			<h1 class="heading">Welcome to Devcenter's Talent Pool</h1>
			<p class="sub-heading">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
			<button class="open-login long" v-on:click="showLogin=!showLogin">Log In</button>
		</div>

		<div class="box" v-show="showLogin">
			<div class="preloader small" v-if="loading"><i class="dc-spinner animate-spin"></i></div>
			<h1 class="login-title">Log in to Devcenter's Talent Pool</h1>
			<form v-on:submit.prevent="doLogin">
				<Input type="text" label="Email address" placeholder="example@domain.com" :alert="emailError" :showAlert="emailAlert" v-on:clear="resetInputs" v-on:change="setEmail" />
				<Input type="password" label="Password" placeholder="Enter a unique password" :alert="passwordError" :showAlert="passwordAlert"  v-on:clear="resetInputs" v-on:change="setPassword" />
				<button class="bar login">Log In</button>
			</form>
			<router-link class="forgot-password" to="/forgot-password">Forgot Password?</router-link>
		</div>

		<!-- <div class="box">
			<h1 class="heading">Hi John, </h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
			quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
			consequat. <br/><br/>Duis aute irure dolor in reprehenderit in voluptate velit esse
			cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
			proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			<br/><br/>
			<Input type="text" label="Email address" placeholder="example@domain.com" :alert="emailError" :showAlert="emailAlert" v-on:clear="resetInputs" />
			<Input type="password" label="Password" placeholder="Enter a unique password" :alert="passwordError" :showAlert="emailAlert"  v-on:clear="resetInputs" :alt="!passwordAlert" />
			<router-link to="/">Alpha Home <i class="dc-caret right"></i></router-link>
			<Select :showAlert="emailAlert" :options="genders" v-on:clear="resetInputs" v-on:change="log" />
			<Title :showAlert="passwordAlert" />
			<Modal title="Welcome" :show="passwordAlert" :sticky="!passwordAlert" :onclose="dialogClose">
				<div slot="body">
					<div class="hello world">Hello world</div>
					<h1>Whats up? </h1>
				</div>
				<div slot="footer">
					<button class="bordered">Hello there</button>
				</div>
			</Modal>
		</div> -->
	</section>
</template>

<script>
	import Input from '@/components/sub/Input'
	import Select from '@/components/sub/Select'
	import Title from '@/components/sub/Title'
	import Modal from '@/components/sub/Modal'
	import store from '@/store'
	import Bus from '@/Bus'
	import Cookie from 'js-cookie'
	export default {
		name: 'Welcome',
		components: { Input, Select, Title, Modal },
		data() {
			return { 
				email: String, password: String, loading: false,
				showLogin: false, emailAlert: false, passwordAlert: false, emailError: "* Please enter a valid email address", passwordError: "* Password should be longer than 4 characters",
				genders: [ { value: "m", title : "Male" }, { value: "f", title: "Female" }, { value: "o", title: "Others" } ]
			}
		},
		methods: {
			resetInputs() { var self=this;setTimeout(function(){ self.emailAlert = false; self.passwordAlert = false; }, 2400); },
			doLogin() { 
				var self = this; this.loading = true;
				this.$http.post(store.state.api.development+"login", { email: self.email, password: self.password }).then(res => {
					let user = res.body.extras.user;
					console.log(res);
					store.commit("startSession", {token: res.body.extras.token, user: res.body.extras.user});
					this.loading = false;
					if(user.account_type == 'developer') {
						self.$http.get(store.state.api.development+"profile/get",  { 
							headers: { 'Authorization': res.body.extras.token }
						}).then(res => {
							console.log(res);
							store.commit("saveProfile", res.body.extras);
							if(user.completed_level == 0) this.$router.push("/complete-profile");
							if(user.completed_level == 1) this.$router.push("/profile");
							if(user.completed_level == 2) this.$router.push("/profile/incomplete");
							if(user.completed_level == 3) this.$router.push("/profile/"+user.username);
						}).catch(err => {
							console.log(err);
						});
					}else if(user.account_type == 'pm') {
						this.$router.push("/project-manager");
					}
				}).catch(err=>{
					this.loading = false;
					console.log(err);
					if(err.status != 200) { self.emailError = "* "+err.body.extras.message; self.emailAlert = true; }
				});
			},
			setEmail: function(email) { this.email = email; },
			setPassword: function(password) { this.password = password; },
			dialogClose() { console.log("dialog closed"); }
		},
		mounted() {
			var self = this;
			Bus.$emit("Header_showSignup", true);
			store.dispatch('getSession').then(session => {
				if(session){
					if(session.user.account_type == 'developer') {
						if(session.user.completed_level == 0) this.$router.push("/complete-profile");
						if(session.user.completed_level == 1) this.$router.push("/profile");
						if(session.user.completed_level == 2) this.$router.push("/profile/incomplete");
						if(session.user.completed_level == 3) this.$router.push("/profile/"+session.user.username);
					}else if(session.user.account_type == 'pm') {
						this.$router.push("/project-manager");
					}
				}
			});
			if(this.$route.hash == '#logout') {
				this.showLogin = true;
			}
		},
		destroyed() {
			Bus.$emit("Header_showSignup", false);
		}

	}
</script>