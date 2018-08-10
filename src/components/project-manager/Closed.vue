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
					assigner: project.assigner.first_name+' '+project.assigner.last_name,
					cost: (project.agreed_cost) ? project.agreed_cost.toLocaleString(): 0,
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
					{ title: 'Move to In Progress', action: () => { moveProjectTo('inprogress') } },
					{ title: 'Move to Pending', action: () => { moveProjectTo('pending') } }
				]" />
			</div>
		</div>
		<Modal title="Brief Required Modal" :sticky="true" :plain="true" :show="showBriefErrorDialog" :onclose="() => { showBriefErrorDialog=false }">
			<div slot="body">
				<i class="dc-cancel close" v-on:click="showBriefErrorDialog=false"></i>
				<p>No project brief has been added to this project</p>
			</div>
		</Modal>
		<Modal title="Status Modal" :sticky="true" :plain="true" :show="showStatusModal" :onclose="() => { showStatusModal=false }">
			<div slot="body" v-if="processLoading" class="preloader"><i class="dc-spinner animate-spin"></i></div>
			<div slot="body" v-else>
				<i class="dc-cancel close" v-on:click="showStatusModal=false"></i>
				<p>{{ processStatus }}</p>
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
		data() { return { user: undefined, projects: [], selected: undefined, showBriefErrorDialog: false,
			showStatusModal: false, processStatus: '', processLoading: false } 
		},
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
			moveProjectTo(stage) {
				var self = this;
				var req_stage;
				(stage == 'pending') ? req_stage = 'fund' : '';
				(stage == 'inprogress') ? req_stage = 'funded' : '';
				(stage == 'close') ? req_stage = 'completed' : '';
				this.processLoading = true;
				this.showStatusModal = true;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						self.$http.post(store.state.api.development+"push-project/"+req_stage, { project_ref: self.selected.project_ref.toString() }, {
							headers: { 'Authorization' : session.token, 'Content-Type': 'application/json' }
						}).then(res => { 
							(stage == 'pending') ? this.processStatus = "Project has been moved to Pending": '';
							(stage == 'inprogress') ? this.processStatus = "Project has been moved to In Progress": '';
							(stage == 'close') ? this.processStatus = "Project has been moved to Close": '';
							store.dispatch('getSession').then(session => {
								if(session) {
									session.projects.where({project_ref: self.selected.project_ref}).project_stage = res.body.extras.project.project_stage;
									session.projects.where({project_ref: self.selected.project_ref}).archive = res.body.extras.project.archive;
									store.commit("saveProjects", session.projects);
								}
							});
							self.projects.splice(self.projects.indexOf(self.selected), 1);
							this.processLoading = false;
							self.showProcessSuccessButton = false;
							self.closeProject();
							console.log(res);
						}).catch(err => { console.log(err); });
					}
				});
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
					self.projects = session.projects.filter((a) => { return (a.closed == 1 || a.archive == 1) });
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