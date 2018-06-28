<template>
	<section class="set-password">
		<div class="box">
			<h1>Welcome to Devcenter's Talent Pool</h1>
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
		data() { return { passwordError: '', showPasswordError: false, confirmError: '', showConfirmError: false, password: '', confirmPassword: '' } },
		components: { Input },
		methods: {
			createPassword() {
				var self = this;
				if(this.password == '' || this.confirmPassword == '') {
					this.passwordError = '* Please enter a valid password'; 
					this.showPasswordError = true; return;
				} else if (this.password != this.confirmPassword) {
					this.confirmError = '* Password does not match';
					this.showPasswordError = true; return;
				}
				this.$http.post(store.state.api.development+"recover-password-change", {
					email: this.$route.params.email,
					token: this.$route.params.token,
					newpass: this.password
				}, {
					headers: { 'Content-type': 'application/json' }
				}).then(res => {
					self.$http.post(store.state.api.development+"login", { email: self.email, password: self.password }).then(res => {
						let user = res.body.extras.user;
						store.commit("startSession", {token: res.body.extras.token, user: res.body.extras.user});
						self.$http.get(store.state.api.development+"profile/get",  { 
							headers: { 'Authorization': res.body.extras.token }
						}).then(res => {
							store.commit("saveProfile", res.body.extras);
							if(user.account_type == 'developer') {
								self.$router.push("/complete-profile");
							}else if(user.account_type == 'project manager') {
								this.$router.push("/project-manager");
							}
						}).catch(err => {
							console.log(err);
						});
					}).catch(err=>{
						console.log(err);
					});
					
				}).catch(err => { console.log(err); 
					this.passwordError = '* '+err.body.extras.message;
					this.showPasswordError = true;
				});
			}
		}
	}
</script>