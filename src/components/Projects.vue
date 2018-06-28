<template>
	<section class="projects">
		<div class="container">
			<Project :data="{
				type: 'talent', // pm, talent, admin
				title: 'Riby',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
				cost: '300, 000',
				assigner: 'Seun Smith',
				due: '24th Aug 2018',
				milestone: 'http://google.com'
			}" />
			<div style="min-height:100px">&nbsp;</div>
		</div>
	</section>
</template>

<script>
	import Project from '@/components/main/Project'
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'Projects',
		data() { return {  }},
		components: { Project },
		mounted() {
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_showGrayLogo", true);
			store.dispatch("getSession").then(session => {
				this.$http.get(store.state.api.development+"user/projects", { 
					headers: { 'Authorization': session.token }
				}).then(res => {
					console.log(res);
				}).catch(err => {
					console.log(err);
				})
			})
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>