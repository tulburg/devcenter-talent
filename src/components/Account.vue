<template>
	<section class="account">
		<router-view></router-view>
	</section>
</template>

<script>
	import Bus from '@/Bus'
	import Input from '@/components/sub/Input'
	import store from '@/store'

	export default {
		name: 'Account',
		mounted() {
			Bus.$emit("Header_showGrayLogo", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_activeLink", "");
		},
		destroyed() {
			Bus.$emit("Header_showGrayLogo", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showAccount", false);
		}
	}

	export const Settings = {
		name: 'Settings',
		template: `
			<div class="settings">
				<div class="box">
					<h1>Account Settings</h1>
					<label>Email address</label>
					<p>tulburg@yahoo.com</p>
					<ul class="grid grid-2">
						<li><label>Password</label></li><li></li>
					</ul>
					<ul class="grid grid-2">
						<li><p>*****************</p></li><li><a class="button clear colored" href="edit">Change Password</button></a></li>
					</ul>
					<label class="email">Email notifications</label>
					<label class="check"><input type="checkbox" checked /> Receive email notifications when you have been assigned to a project</label>
				</div>
			</div>
		`
	}

	export const ChangePassword = {
		name: 'ChangePassword',
		components: { Input },
		data() { 
			return { 
				currentPassError: "", newPassError: "", confirmPassError: "", currentPass: "", newPass: "", confirmPass: "",
				showCurrentError: false, showNewError: false, showConfirmError: false, loading: false, success: false
			} 
		},
		template: `
			<div>
				<div class="settings">
					<div class="box">
						<a class="history" href="javascript:history.go(-1)" v-if="!success"><i class="dc-caret left"></i> Account Settings</a>
						<h1><span v-if="!loading">Change Password</span> <i v-else class="dc-spinner animate-spin loader"></i></h1>
						<form v-on:submit.prevent="submit" v-if="!success">
							<Input type="password" label="Current Password" placeholder="Enter the current password" :alert="currentPassError" :showAlert="showCurrentError" v-on:clear="resetInputs" v-on:change="(v) => setPass('current', v)" />
							<Input type="password" label="New Password" placeholder="Enter the new password" :alert="newPassError" :showAlert="showNewError"  v-on:clear="resetInputs" v-on:change="(v) => setPass('new', v)" />
							<Input type="password" label="Confirm Password" placeholder="Confirm the new password" :alert="confirmPassError" :showAlert="showConfirmError"  v-on:clear="resetInputs" v-on:change="(v) => setPass('confirm', v)" />
							<button class="bar" v-on:click="submit">Create New Password</button>
						</form>
						<p v-if="success" class="success">Your password has been successfully changed</p>
						<div align="right" v-if="success">
							<router-link to="settings">Back to Account Settings <i class="dc-caret right"></i></router-link>
						</div>
					</div>
				</div>
			</div>
		`,
		methods: {
			setPass(type, value) {
				if(type == 'current') { this.currentPass = value; }
				if(type == 'new') { this.newPass = value; }
				if(type == 'confirm') { this.confirmPass = value; }
			},
			resetInputs() { var self=this; setTimeout(function(){ self.showCurrentError = self.showConfirmError = self.showNewError = false; }, 1400); },
			submit() {
				if(this.currentPass == "") { this.currentPassError = "* Please enter the current password"; this.showCurrentError = true; return; }
				if(this.newPass == "") { this.newPassError = "* Please enter a unique password"; this.showNewError = true; return; }
				if(this.confirmPass == "") { this.confirmPassError = "* Please enter a password that match"; this.showConfirmError = true; return; }
				if(this.newPass != this.confirmPass) { this.confirmPassError = "* Password does not match"; this.showConfirmError = true; return; }
				var self = this; this.loading = true;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
						else {
							self.$http.post(store.state.api.development+"user-change-password", { old_password: self.currentPass, new_password: self.newPass}, {
								headers: { 'Authorization': session.token }
							}).then(res => {
								console.log(res);
								self.loading = false;
								if(res.body.type == 'success') {
									self.success = true;
								}
							}).catch(err => {
								console.log(err);
								self.loading = false;
								self.currentPassError = "* "+err.body.extras.message;
								self.showCurrentError = true;
							});
						}
				})
			}
		}
	}

	export const Earnings = {
		name: 'Earnings'
	}

	export const Feedback = {
		name: 'Feedback',
		template: `
			<div class="feedback">

			</div>
		`
	}
</script>