<template>
	<div class="container projects">
		<div class="box empty-state" v-if="projects.length < 1">
			<div><i class="dc-lazy"></i></div>
			<p>You have no pending projects at the moment</p>
		</div>
		<div class="list" v-else>
			<Project v-for="project in projects" :key="project.id" :data="{
				type: 'pm',
				title: project.project_name,
				description: project.description,
				assigner: project.assigned_pm
			}" />
			
		</div>
	</div>
</template>


<script>
	
	import Project from '@/components/main/Project'
	import ProjectView from '@/components/main/ProjectView'
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'Pending',
		data() { return { user: undefined, projects: [] } },
		components: { Project },
		mounted() {
			var self = this;
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_showPMLinks", true);
			Bus.$emit("Header_showGrayLogo", true);
			store.dispatch('getSession').then(session => {
				if(session) { 
					self.user = session.user;
					// fetch only new projects
					self.projects = session.projects.fetch({ project_stage: 0}, function(p) {
						if(p.description.length > 300){
							let desc = p.description;
							desc = desc.substring(0, 300)+"...";
							p.description = desc;
							return p;
						}
					});
					console.log(self.projects)
				}
			});
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showPMLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>