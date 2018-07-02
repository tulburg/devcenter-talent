<!-- # Project Stages
PROJECT_STAGE_BRIEF = 0 (new)
PROJECT_AWAITING_FUNDING = 1 (pending)
PROJECT_FUNDED = 2 (in progress)
PROJECT_MATCHED = 3 (assigned to developers)
PROJECT_CLOSE_DEV_CHAT = 4 (ignore this for now)
PROJECT_COMPLETED = 5 (completed) -->

<template>
	<section class="project-manager">
		<router-view v-if="loadComplete"></router-view>
		<div class="preloader" v-else>
			<i class="dc-spinner animate-spin"></i>
		</div>
	</section>
</template>

<script>
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'ProjectManager',
		data() { return { loadComplete: false } },
		mounted() {
			var self = this;
			store.dispatch('getSession').then(session => {
				if(session) { 
					self.user = session.user;
					self.$http.get(store.state.api.development+"user/get-my-projects", {
						headers: { 'Authorization': session.token }
					}).then(res => {
						store.commit("saveProjects", res.body.extras.projects);
						self.loadComplete = true;
					}).catch(err => { console.log(err); });
				}
			});
		}
	}
</script>