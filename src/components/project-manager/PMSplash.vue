<template>
	<div class="container splash">
		<div class="box">
			<h1 class="heading">Hi {{ (user) ? user.first_name : '' }},</h1>
			<p>Welcome to Devcenter's project management platform. You'll be able to manage projects from start to finish here.<br/><br/>
				You'll also be able to; share projects with talents, assign talents to projects and share messages with talents here.<br/><br/>
				We hope this platform makes managing projects and talents alot easier. Get started by viewing your projects.
			</p>
			<div align="right">
				<button v-on:click="$router.push('/project-manager/new')">Go to My Projects</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'PMSplash',
		data() { return { user: undefined } },
		mounted() {
			var self = this;
			Bus.$emit("Header_showAccount", true);
			store.dispatch('getSession').then(session => {
				if(session) { 
					self.user = session.user;
				}
			});
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
		}
	}
</script>