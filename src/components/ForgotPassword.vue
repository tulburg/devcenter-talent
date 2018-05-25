<template>
	<section class="forgot-password">
		<div class="box" v-if="!success">
			<h1 class="heading" v-if="loading"><i class="dc-spinner animate-spin"></i></h1>
			<h1 class="heading" v-else>Forgot Password</h1>
			<form align="left" v-on:submit.prevent="doResetPassword">
				<Input type="text" placeholder="example@domain.com" label="Email address" :showAlert="emailAlert" :alert="emailError" v-on:change="setEmail" v-on:clear="emailAlert=false" />
				<button class="bar">Reset Password</button>
			</form>
		</div>

		<div class="box forgot-password-success" v-else>
			<h1 class="heading">Forgot Password</h1>
			<p>A link to reset your password has been sent to your email</p>
			<div align="right">
				<router-link to="/">Back to Log In <i class="dc-caret right"></i></router-link>
			</div>
		</div>
	</section>
</template>

<script>
	import Bus from '@/Bus'
	import Input from '@/components/sub/Input'
	import store from '@/store'
	export default {
		name: 'ForgotPassword',
		components: { Input },
		data() { return { email: '', emailAlert: false, emailError: '* Invalid email address', loading: false, success: false }},
		methods: {
			setEmail(email) { this.email = email; },
			doResetPassword() { 
				var self = this; this.loading = true; this.success = true;
				console.log(self.email) ;
				this.$http.post(store.state.api.development+"forgot-password", { email: self.email, recovery_url: "http://devcenter.co/forgot-password/"+self.email+"/" }).then((res) => {
					self.loading = false;
				}).catch((err) => {
					self.loading = false;
					if(err.status != 200) { self.emailError = "* "+err.body.extras.message; self.emailAlert = true; }
				})
			}
		},
		mounted() {
		}
	}
</script>