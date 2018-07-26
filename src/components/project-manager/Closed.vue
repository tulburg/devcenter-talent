<template>
	<div class="container projects">
		<div class="box empty-state" v-if="projects.length < 1">
			<div><i class="dc-lazy"></i></div>
			<p>You have no closed projects at the moment</p>
		</div>
		<div class="list" v-else>
			<div class="project-list-pane">
				<Project :click="() => { openProject(project) }" v-for="project in projects" :key="project.id" :data="{
					type: 'pm',
					title: project.project_name,
					description: (project.description.length > 300) ? project.description.substring(0, 300)+'...' : project.description,
					assigner: project.assigned_pm,
					badgeText: 'CLOSED',
					badgeStatus: 'primary',
					cost: '330,000'
				}" />
			</div>
			<div class="project-view-pane">
				<div class="breadcrumb-wrapper"><div class="breadcrumb" v-on:click="closeProject"><i class="dc-caret left"></i> In Progress Projects</div></div>
				<ProjectView v-if="selected!=undefined" :data="{
					title: selected.project_name,
					description: selected.description,
					assigner: selected.assigner.first_name+' '+selected.assigner.last_name,
					cost: (selected.agreed_cost) ? selected.agreed_cost.toLocaleString(): 0,
					category: (selected.categories) ? selected.categories.map((c) => { return c.title }) : [],
					platform: selected.platforms,
					stacks: selected.modules,
					deadline: (selected.deadline) ? simpleDateFormat(selected.deadline): '',
					due: (selected.deadline) ? simpleDateFormat(selected.deadline): '',
					assigned_to: 'Tolu Oluwagbemi',
					closed: (selected.deadline) ? simpleDateFormat(selected.deadline): '',
					badgeText: 'CLOSED',
					badgeStatus: 'primary'
				}" :actions="[
					{ title: 'View Project Brief', action: () => { (selected.requirement_doc_link&&selected.requirement_doc_link!='') ? this.gotoReqDoc() : showBriefErrorDialog = true; } },
				]" :menus="[
					{ title: 'Move to In Progress', action: '' },
					{ title: 'Move to Pending', action: '' }
				]" />
			</div>
		</div>
		<Modal title="Brief Required Modal" :sticky="true" :plain="true" :show="showBriefErrorDialog" :onclose="() => { showBriefErrorDialog=false }">
			<div slot="body">
				<i class="dc-cancel close" v-on:click="showBriefErrorDialog=false"></i>
				<p>No project brief has been added to this project</p>
			</div>
		</Modal>
	</div>
</template>


<script>
	
	import Project from '@/components/main/Project'
	import ProjectView from '@/components/main/ProjectView'
	import Modal from '@/components/sub/Modal'
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'Closed',
		data() { return { user: undefined, projects: [], selected: undefined, showBriefErrorDialog: false } },
		components: { Project, ProjectView, Modal },
		methods: {
			simpleDateFormat(d) {
				var date = new Date(d.split("-").map((v) => { return (v.length < 2) ? "0"+v : v }).join("-"));
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
				return date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
			},
			openProject(project) {
				var self = this;
				this.selected = project;
				this.$router.push("#project="+project.id);
				setTimeout(() => {
					$(".project-view-pane").expand();
					$(".project-list-pane").collapse();
				}, 10);
			},
			closeProject() {
				var self = this;
				$(".project-list-pane").expand()
				$(".project-view-pane").collapse(function(){ self.selected = undefined; });
				this.$router.go(-1);
			},
			gotoReqDoc() {
				window.open(this.selected.requirement_doc_link, '_blank');
			}
		},
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
					self.projects = session.projects.filter((a) => { return (a.closed>0||a.archive>0) });
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