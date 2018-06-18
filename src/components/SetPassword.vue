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
	import Input from '@/components/sub/Input'

	export default {
		name: 'SetPassword',
		data() { return { passwordError: '', showPasswordError: false, confirmError: '', showConfirmError: false, password: '', confirmPassword: '' } },
		components: { Input },
		methods: {
			createPassword() {
				if(this.password == '' || this.confirmPassword == '') {
					this.passwordError = 'Please enter a valid password'; 
					this.showPasswordError = true; return;
				} else if (this.password != this.confirmPassword) {
					this.confirmError = 'Password does not match';
					this.showPasswordError = true; return;
				}
				
			}
		},
		destoyed() {

		}
	}
</script>