<template>
	<section class="set-password">
		<div class="box">
			<h1 v-if="!loading">Welcome to Devcenter's Talent Pool</h1>
			<h1 v-else>Loading... <i class="dc-spinner animate-spin"></i></h1>
			<p>Create a password below to get started</p>
			<form v-on:submit.prevent="createPassword">
				<Input type="password" label="Create Password" placeholder="Enter a unique password" :alert="passwordError" :showAlert="showPasswordError" v-on:clear="() => { this.showPasswordError = false; }" v-on:change="(v) => { this.password = v; }" />
				<Input type="password" label="Confirm Password" placeholder="Enter your password again" :alert="confirmError" :showAlert="showConfirmError" v-on:clear="() => { this.showConfirmError = false; }" v-on:change="(v) => { this.confirmPassword = v; }" />
				<button class="bar login">Create Password and Log In</button>
			</form>
		</div>
	</section>
</template>


<script>
	import Bus from '@/Bus'
	import store from '@/store'
	import Input from '@/components/sub/Input'

	export default {
		name: 'SetPassword',
		data() { return { passwordError: '', showPasswordError: false, confirmError: '', showConfirmError: false, password: '', confirmPassword: '', loading: false } },
		components: { Input },
		methods: {
			createPassword() {
				var self = this;
				self.loading = true;
				if(this.password == '' || this.confirmPassword == '') {
					this.passwordError = '* Please enter a valid password'; 
					self.loading = false;
					this.showPasswordError = true; return;
				} else if (this.password != this.confirmPassword) {
					this.confirmError = '* Password does not match';
					self.loading = false;
					this.showPasswordError = true; return;
				}
				this.$http.post(store.state.api.development+"recover-password-change", {
					email: this.$route.params.email,
					token: this.$route.params.token,
					newpass: this.password
				}, {
					headers: { 'Content-type': 'application/json' }
				}).then(res => {
					console.log(res, self.$route.params.email, self.password);
					self.$http.post(store.state.api.development+"login", { email: self.$route.params.email, password: self.password }).then(res => {
						let user = res.body.extras.user;
						store.commit("startSession", {token: res.body.extras.token, user: res.body.extras.user});
						self.$http.get(store.state.api.development+"profile/get",  { 
							headers: { 'Authorization': res.body.extras.token }
						}).then(res => {
							self.loading = false;
							store.commit("saveProfile", res.body.extras);
							if(user.account_type == 'developer') {
								self.$router.push("/complete-profile");
							}else if(user.account_type == 'project manager') {
								this.$router.push("/project-manager");
							}
						}).catch(err => {
							self.loading = false;
							console.log(err);
						});
					}).catch(err=>{
						console.log(err);
					});
					
				}).catch(err => { console.log(err); 
					self.loading = false;
					this.passwordError = '* '+err.body.extras.message;
					this.showPasswordError = true;
				});
			}
		}
	}
</script>