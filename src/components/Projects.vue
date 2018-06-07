<template>
	<section class="projects">
		<div class="container">
			<div class="box" v-for="i in 5">
				<ul class="grid grid-2 separator project">
					<li>
						<h1>Travel Mall <span :class="{primary : i==2||i==3, success: i==1, danger: i==4}" class="badge">IN PROGRESS</span></h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat</p>
					</li>
					<li>
						<div class="label">Cost</div>
						<div class="value">NGN 350, 000</div><br/>
						<div class="label">Due Date</div>
						<div class="value">24th Aug 2018</div><br/>
						<router-link to="/">View Milestone <i class="dc-caret right"></i></router-link>
					</li>
				</ul>
			</div>
			<div style="min-height:100px">&nbsp;</div>
		</div>
	</section>
</template>

<script>
	
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'Projects',
		data() { return { }},
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