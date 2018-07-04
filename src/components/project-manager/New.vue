<template>
	<div class="container projects">
		<div class="box empty-state" v-if="projects.length < 1">
			<div><i class="dc-lazy"></i></div>
			<p>You have no new projects at the moment</p>
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
				<div class="breadcrumb-wrapper"><div class="breadcrumb" v-on:click="closeProject"><i class="dc-caret left"></i> New Projects</div></div>
				<ProjectView v-if="selected!=undefined" :data="{
					title: selected.project_name,
					description: selected.description,
					assigner: selected.assigned_pm,
					cost: '330, 000'
				}" :actions="[
					{ title: 'Update Project', action: () => { showModal = true; } },
					{ title: 'View Project Brief', action: '' },
					{ title: 'Find a Talent', action: () => { openTalentPane() } }
				]" :menus="[
					{ title: 'Archive Project', action: '' }
				]" />
			</div>
			<div class="project-talent-pane" v-if="selected!=undefined">
				<div class="breadcrumb-wrapper alt"><div class="breadcrumb" v-on:click="closeTalentPane"><i class="dc-caret left"></i> {{ selected.project_name }}</div></div>
				<div class="project-talents">
					<div class="left box">
						<h2>Refine by</h2>
						<div class="collapse-heading" v-on:click="toggleRoles">Roles <i :class="{ upward: openRoles }" class="dc-caret"></i></div>
						<ul class="collapse-body __roles-collapse">
							<li><CheckBox :small="true" /> Designers</li>
							<li><CheckBox :small="true" /> Developers</li>
						</ul>
						<div class="collapse-heading" v-on:click="toggleStacks">Stacks/Skills <i :class="{ upward: openStacks }" class="dc-caret"></i></div>
						<ul class="collapse-body __stacks-collapse">
							<li v-for="item in ['HTML', 'CSS', 'Swift', 'Java', 'JavaScript']"><CheckBox :small="true" /> {{ item }}</li>
						</ul>
						<div class="collapse-heading" v-on:click="toggleEmployment">Employment Status <i :class="{ upward: openEmployment }" class="dc-caret"></i></div>
						<ul class="collapse-body __employment-collapse">
							<li v-for="item in ['Contract', 'Employed', 'Freelancer', 'Unemployed']"><CheckBox :small="true" /> {{ item }}</li>
						</ul>
					</div>
					<div class="right">
						<div class="box talent-profile-card" v-for="placeholder in placeholders">
							<div class="profile-photo"><img :src="placeholder.photo" alt="placeholder" /></div>
							<div class="profile-details">
								<h3>{{ placeholder.name }}</h3>
								<p>{{ placeholder.stack }}</p>
							</div>
							<CheckBox :checked="true" v-on:change="(v) => { saveProject(v) }" />
						</div>
						<div class="box">&nbsp;</div>
					</div>
				</div>
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
		<Modal title="Find Talent Modal" :sticky="true" :show="showFindTalentModal" :onclose="() => { showFindTalentModal=false }">
			<div slot="body">
				<p>Travel Mall has been updated. Go ahead and find talents for the project</p>
				<button class="long">Find Talents</button>
			</div>
		</Modal>
	</div>
</template>


<script>
	import Project from '@/components/main/Project'
	import ProjectView from '@/components/main/ProjectView'
	import Modal from '@/components/sub/Modal'
	import Input from '@/components/sub/Input'
	import InputDrop from '@/components/sub/InputDrop'
	import CheckBox from '@/components/sub/CheckBox'
	import Datepicker from 'vuejs-datepicker'
	import Bus from '@/Bus'
	import store from '@/store'
	
	export default {
		name: 'New',
		data() { return { user: undefined, projects: [], selected: undefined, savingProject: false, showModal: false, name: 'Tolu', showDatePickerAlert: false, stacks: [], showFindTalentModal: false, openStacks: true, openRoles: true, openEmployment: true, 
			placeholders: [ 
				{ name: "John Doe", stack: "Backend, Frontend, Mobile", photo: require("../../assets/img/avatar.svg") }, 
				{ name: "Jason Adetunbo", stack: "iOS Backend", photo: require("../../assets/img/avatar-2.svg") },
				{ name: "Chris Njoku", stack: "UX Researcher", photo: require("../../assets/img/avatar-3.svg") }, 
				{ name: "Lanre Shonibare", stack: "UX/UI Designer", photo: require("../../assets/img/avatar-4.svg") },
				{ name: "Alexander Pret", stack: "Backend", photo: require("../../assets/img/avatar-5.svg") }
			]
		} },
		components: { Project, ProjectView, Modal, Input, Datepicker, InputDrop, CheckBox },
		methods: {
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
			openTalentPane() {
				$(".project-view-pane").collapse();
				$(".project-talent-pane").expand();
			},
			closeTalentPane() {
				$(".project-view-pane").expand();
				$(".project-talent-pane").collapse();
			},
			saveProject(v) {
				console.log(v);
			},
			fetchStacks() {
				var self = this;
				this.$http.get("https://restcountries.eu/rest/v2/all?fields=name").then(res=> {
					for(var i = 0; i<res.body.length;i++){
						self.stacks.push(res.body[i].name);
					}
				}).catch(err => console.log(err));
			},
			toggleStacks() {
				if(this.openStacks) {
					this.openStacks = false;
					$(".__stacks-collapse").collapse();
				}else {
					this.openStacks = true;
					$(".__stacks-collapse").expand();
				}
			},
			toggleRoles() {
				if(this.openRoles) {
					this.openRoles = false;
					$(".__roles-collapse").collapse();
				}else {
					this.openRoles = true;
					$(".__roles-collapse").expand();
				}
			},
			toggleEmployment() {
				if(this.openEmployment) {
					this.openEmployment = false;
					$(".__employment-collapse").collapse();
				}else {
					this.openEmployment = true;
					$(".__employment-collapse").expand();
				}
			}
		},
		watch: {
			selected: function(value) {
				console.log("changed", value);
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
					self.projects = session.projects.fetch({ project_stage: 0});
					console.log(self.projects)
				}
			});
			setTimeout(() => { this.showFindTalentModal = true }, 5000);
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showPMLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>