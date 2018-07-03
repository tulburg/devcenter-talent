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
			var self = this;
			store.dispatch('getSession').then(session => {
				if(session == null) self.$router.push("/")
			});
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
		data() { return { email: 'example@domain.com' } },
		template: `
			<div class="settings">
				<div class="box">
					<h1>Account Settings</h1>
					<label>Email address</label>
					<p>{{ email }}</p>
					<ul class="grid grid-2">
						<li><label>Password</label></li><li></li>
					</ul>
					<ul class="grid grid-2">
						<li><p>*****************</p></li><li><a class="button clear colored" href="edit">Change Password</button></a></li>
					</ul>
					<label class="email">Email notifications</label>
					<label class="check"><input type="checkbox" checked /> Receive email notifications for projects shared with you</label>
					<label class="check"><input type="checkbox" checked /> Receive email notifications when you have been assigned to a project</label>
					<label class="check"><input type="checkbox" checked /> Receive email notifications for all activity on your account</label>
				</div>
			</div>
		`,
		mounted() {
			store.dispatch('getSession').then(session => {
				if(session) { 
					if(session.user.email != undefined) { this.email = session.user.email }
						console.log(session.user);
				}
			});
		}
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
							<Input type="password" label="Current Password" placeholder="" :alert="currentPassError" :showAlert="showCurrentError" v-on:clear="resetInputs" v-on:change="(v) => setPass('current', v)" />
							<Input type="password" label="New Password" placeholder="" :alert="newPassError" :showAlert="showNewError"  v-on:clear="resetInputs" v-on:change="(v) => setPass('new', v)" />
							<Input type="password" label="Confirm Password" placeholder="" :alert="confirmPassError" :showAlert="showConfirmError"  v-on:clear="resetInputs" v-on:change="(v) => setPass('confirm', v)" />
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

	export const Feedback = {
		name: 'Feedback',
		data() { return { feedback: '', loading: false, success: false, user: undefined } },
		template: `
			<div class="feedback">
				<div class="box" v-if="!success">
					<p>We'd like to hear from you about how we can improve Devcenter's talent pool. Feel free to let us know both good and bad experiences you have had.</p>
					<form v-on:submit.prevent="submit" v-if="!loading">
						<textarea placeholder="Write your feedback here" v-on:change="setValue"></textarea>
						<button>Submit</button>
					</form>
					<div class="preloader" v-else><i class="dc-spinner animate-spin"></i></div>
				</div>
				<div class="box" v-else>
					<p>Thanks for giving us your feedback, you're a star.<br/>We'll review it and act on it accordingly.</p>
					<div align="right" class="success"><router-link :to="'/profile/'+user.username">Back to Profile <i class="dc-caret right"></i></router-link></div>
				</div>
			</div>
		`,
		methods: {
			setValue(e) { this.feedback = e.target.value; },
			submit() {
				if(this.feedback != '') {
					var self = this; self.loading = true;
					store.dispatch('getSession').then(session => {
						if(session == null) self.$router.push("/")
							else {
								this.user = session.user;
								this.$http.post(store.state.api.development+"mail/send", { 
									"subject": "DevCenter Pool Feedback",
									"mail_from": "feedback@devcenter.co",
									"mail_to": "projects@devcenter.co",
									"body": self.feedback
								}, { headers: { 'Authorization': session.token }}).then(res => {
									self.loading = false; console.log(res);
									if(res.body.type == 'success') { self.success = true; }
								}).catch(err => {
									self.loading = false; console.log(err);
								});
							}
					});
				}
			}
		}
	}
</script>