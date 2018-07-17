<template>
	<div class="container projects">
		<div class="box empty-state" v-if="projects.length < 1">
			<div><i class="dc-lazy"></i></div>
			<p>You have no pending projects at the moment</p>
		</div>
		<div class="list" v-else>
			<div class="project-list-pane">
				<Project :click="() => { openProject(project) }" v-for="project in projects" :key="project.id" :data="{
					type: 'pm',
					title: project.project_name,
					description: (project.description.length > 300) ? project.description.substring(0, 300)+'...' : project.description,
					assigner: project.assigned_pm
				}" />
			</div>
			<div class="project-view-pane">
				<div class="breadcrumb-wrapper"><div class="breadcrumb" v-on:click="closeProject"><i class="dc-caret left"></i> Pending Projects</div></div>
				<ProjectView v-if="selected!=undefined" :data="{
					title: selected.project_name,
					description: selected.description,
					assigner: selected.assigned_pm,
					cost: '330, 000'
				}" :actions="[
					{ title: 'Update Project', action: () => { showModal = true; } },
					{ title: 'View Project Brief', action: '' },
					{ title: 'Find Talents', action: () => { openTalentPane() } },
					{ title: 'Assign Talents', action: () => { openTalentPane() } }
				]" :menus="[
					{ title: 'Move to in Progress', action: '' },
					{ title: 'Archive Project', action: '' }
				]" />
			</div>
		</div>
		<Modal title="Project Modal" :sticky="true" :show="showModal" :onclose="() => { showModal=false }" v-if="selected!=undefined">
			<div slot="body">
				<ul class="grid grid-2 project-title-wrapper">
					<li><Input label="Project name" placeholder="Project Name" :value="selected.project_name" /></li>
					<li><Input label="Cost (NGN)" placeholder="Project Cost" value="400,000" /></li>
				</ul>
				<textarea class="project-description input" placeholder="Project Description">{{ selected.description }}</textarea>
				<Input label="Category" placeholder="Project Categories">
					<div class="category-dropdown dropdown"></div>
				</Input>
				<Input label="Platforms" placeholder="Project Platforms">
					<div class="platform-dropdown dropdown"></div>
				</Input>
				<Input label="Stacks/Skills" placeholder="Project Stacks and Skills">
					<div class="stacks-dropdown dropdown"></div>
				</Input>
				<InputDrop label="Stacks/Skills" placeholder="Project Stacks and Skills" :options="stacks" v-on:change="fetchStacks" />
				<ul class="grid grid-2 date-grid">
					<li>
						<Datepicker wrapper-class="select datepicker-select" placeholder="Select Deadline">
							<div slot="afterDateInput">
								<label>Deadline for Brief</label>
								<i class="dc-calendar"></i>
							</div>
						</Datepicker>
					</li>
					<li>&nbsp;</li>
				</ul>
				<Input label="undefined" placeholder="Product Requirement Link">
					<div class="title-label"><label><i class='dc-link'></i> Link to Product Requirement Document</label></div>
				</Input>
				<Input label="undefined" placeholder="Project Link on Jira">
					<div class="title-label"><label><i class='dc-link'></i> Link to Project on Jira <p>(This link will be displayed to Talents only)</p></label></div>
				</Input>
			</div>
			<div slot="footer" v-if="!savingProject">
				<button class="long" v-on:click="saveProject">Save</button>
			</div>
		</Modal>
	</div>
</template>


<script>
	
	import Project from '@/components/main/Project'
	import ProjectView from '@/components/main/ProjectView'
	import Modal from '@/components/sub/Modal'
	import InputDrop from '@/components/sub/InputDrop'
	import Input from '@/components/sub/Input'
	import Datepicker from 'vuejs-datepicker'
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'Pending',
		data() { return { user: undefined, projects: [], selected: undefined, showModal: false, name: 'Tolu', showDatePickerAlert: false, stacks: [], savingProject: false } },
		components: { Project, ProjectView, Modal, InputDrop, Input, Datepicker },
		methods: {
			openProject(project) {
				var self = this;
				this.selected = project;
				console.log(project);
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
			fetchStacks() {
				var self = this;
				this.$http.get("https://restcountries.eu/rest/v2/all?fields=name").then(res=> {
					for(var i = 0; i<res.body.length;i++){
						self.stacks.push(res.body[i].name);
					}
				}).catch(err => console.log(err));
			},
			saveProject(v) {
				this.showShareModal = v;
			},
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
					self.projects = session.projects.filter((o) => { return (o.project_stage==1&&o.closed==0&&o.archive==0)});
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