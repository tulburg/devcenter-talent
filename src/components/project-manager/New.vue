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
					assigner: project.assigner.first_name+' '+project.assigner.last_name,
					cost: (project.agreed_cost) ? project.agreed_cost.toLocaleString() : 0
				}" />
			</div>
			<div class="project-view-pane">
				<div class="breadcrumb-wrapper"><div class="breadcrumb" v-on:click="closeProject"><i class="dc-caret left"></i> New Projects</div></div>
				<ProjectView v-if="selected!=undefined" :data="{
					title: selected.project_name,
					description: selected.description,
					assigner: selected.assigner.first_name+' '+selected.assigner.last_name,
					cost: (selected.agreed_cost) ? selected.agreed_cost.toLocaleString(): 0,
					category: (selected.categories) ? selected.categories.map((c) => { return c.title }) : [],
					platform: selected.platforms,
					stacks: selected.modules,
					deadline: (selected.deadline) ? simpleDateFormat(selected.deadline): '',
					due: (selected.deadline) ? simpleDateFormat(selected.deadline): ''
				}" :actions="[
					{ title: 'Update Project', action: () => { showModal = true; } },
					{ title: 'View Project Brief', action: () => { (selected.requirement_doc_link&&selected.requirement_doc_link!='') ? this.gotoReqDoc() : showBriefErrorDialog = true; } },
					{ title: 'Find Talents', action: () => { (checkProjectCompletion(selected)) ? openTalentPane() : showCompletionErrorDialog = true; } }
				]" :menus="[
					{ title: 'Archive Project', action: () => { showArchiveModal=true; } }
				]" />
			</div>
			<div class="project-talent-pane" v-if="selected!=undefined">
				<div class="breadcrumb-wrapper alt"><div class="breadcrumb" v-on:click="closeTalentPane"><i class="dc-caret left"></i> {{ selected.project_name }}</div></div>
				<div class="project-talents">
					<div class="preloader" v-if="talentsLoading"><i class="dc-spinner animate-spin"></i></div>
					<div class="left box" v-else>
						<h2>Refine by</h2>
						<div class="collapse-heading" v-on:click="toggleRoles">Roles <i :class="{ upward: openRoles }" class="dc-caret"></i></div>
						<ul class="collapse-body __roles-collapse">
							<li v-for="item in [ 'Android Developer', 'Backend Developer', 'Frontend Developer', 'iOS Developer', 'Mobile Developer', 'UI Designer', 'UX Researcher', 'UX Designer', 'UX/UI Designer' ]"><CheckBox :small="true" v-on:change="(v) => { setValue('roles', v, item) }" /> {{ item }}</li>
						</ul>
						<div class="collapse-heading" v-on:click="toggleStacks">Stacks/Skills <i :class="{ upward: openStacks }" class="dc-caret"></i></div>
						<ul class="collapse-body __stacks-collapse">
							<li v-for="item in selected.modules"><CheckBox :small="true" :checked="true" v-on:change="(v) => { setValue('stacks', v, item) }" /> {{ item }}</li>
						</ul>
						<div class="collapse-heading" v-on:click="toggleEmployment">Employment Status <i :class="{ upward: openEmployment }" class="dc-caret"></i></div>
						<ul class="collapse-body __employment-collapse">
							<li v-for="item in ['Contract', 'Employed', 'Freelancer', 'Unemployed']"><CheckBox :small="true" v-on:change="(v) => { setValue('emp-status', v, item) }" /> {{ item }}</li>
						</ul>
					</div>
					<div class="right" v-if="!talentsLoading">
						<div class="box talent-profile-card" v-for="talent in talents">
							<div class="profile-photo"><img :src="talent.profile_image" alt="placeholder" /></div>
							<div class="profile-details">
								<h3>{{ talent.first_name+" "+talent.last_name }}</h3>
								<p>{{ (talent.preferred_roles.length > 0) ? talent.preferred_roles[0].value: '' }}, {{ talent.roles.slice(0, talent.roles.length - 1).map((a) => { return a.value }).join(", ")+" and "+((talent.roles.length > 0) ? talent.roles.slice(-1)[0].value : '')}}</p>
							</div>
							<CheckBox :checked="false" v-on:change="(v) => { shareWith(v, talent) }" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<Modal title="Project Modal" :sticky="true" :show="showModal" :onclose="() => { showModal=false }" v-if="selected!=undefined">
			<div slot="body" class="preloader" v-if="saveProjectLoading"><i class="dc-spinner animate-spin"></i></div>
			<div slot="body" v-else>
				<ul class="grid grid-2 project-title-wrapper">
					<li><Input label="Project name" placeholder="Project Name" :value="selected.project_name" v-on:change="(v) => { this.selected.project_name = v }" /></li>
					<li><Input label="Cost (NGN)" placeholder="Project Cost" :value="(selected.agreed_cost) ? selected.agreed_cost.toLocaleString() : '0'" v-on:change="(v) => { this.selected.agreed_cost = parseInt(v.replace(/,/, '')) }" /></li>
				</ul>
				<textarea class="project-description input" placeholder="Project Description" v-model="selected.description">{{ selected.description }}</textarea>
				<InputDrop name="category" label="Category" placeholder="Project Categories" :options="categories" :selected="(selected.categories) ? selected.categories.map((c) => { return c.title }) : []" :remove="(i) => { unsetCategory(i) }" v-on:change="fetchCategories" v-on:selected="setCategories" />
				<InputDrop name="platform" label="Platforms" placeholder="Project Platforms" :options="platforms" :selected="selected.platforms" v-on:change="fetchPlatforms" v-on:selected="(v) => { this.selected.platforms = v }" />
				<InputDrop name="stacks" label="Stacks/Skills" placeholder="Project Stacks and Skills" :options="stacks" v-on:change="fetchStacks" :selected="selected.modules" v-on:selected="(v) => { this.selected.skills = v }" />
				<ul class="grid grid-2 date-grid">
					<li>
						<Datepicker wrapper-class="select datepicker-select" placeholder="Select Deadline" :value="(selected.deadline) ? new Date(selected.deadline.split('-').map((v) => { return (v.length < 2) ? '0'+v : v }).join('-')) : ''" v-on:selected="(v) => { this.selected.deadline = v.getFullYear()+'-'+v.getMonth()+'-'+v.getDate(); }">
							<div slot="afterDateInput">
								<label>Deadline for Brief</label>
								<i class="dc-calendar"></i>
							</div>
						</Datepicker>
					</li>
					<li>&nbsp;</li>
				</ul>
				<Input label="undefined" placeholder="Product Requirement Link" :value="selected.requirement_doc_link" v-on:change="(v) => { this.selected.requirement_doc_link = v }">
					<div class="title-label"><label><i class='dc-link'></i> Link to Product Requirement Document</label></div>
				</Input>
				<Input label="undefined" placeholder="Project Link on Jira" :value="selected.jira_link" v-on:change="(v) => { this.selected.jira_link = v }">
					<div class="title-label"><label><i class='dc-link'></i> Link to Project on Jira <p>(This link will be displayed to Talents only)</p></label></div>
				</Input>
			</div>
			<div slot="footer" v-if="!saveProjectLoading">
				<button class="long" v-on:click="saveProject">Save</button>
			</div>
		</Modal>
		<Modal title="Find Talent Modal" :sticky="true" :show="showFindTalentModal" :onclose="() => { showFindTalentModal=false }">
			<div slot="body">
				<p>Travel Mall has been updated. Go ahead and find talents for the project</p>
				<button class="long" v-on:click="openTalentPane();showFindTalentModal=false">Find Talents</button>
			</div>
		</Modal>
		<Modal title="Archive Modal" :stickey="true" :plain="true" :show="showArchiveModal" :onclose="() => { showArchiveModal = false }">
			<div slot="body" class="preloader" v-if="archiveLoading"><i class="dc-spinner animate-spin"></i></div>
			<div slot="body" v-else>
				<i class="dc-cancel close" v-on:click="showArchiveModal=false"></i>
				<h4>Please enter a short description of why you are archiving this project</h4>
				<p>(Max 600 Characters)</p>
				<textarea class="input" placeholder="Enter a description here" v-model="archiveReason"></textarea>
			</div>
			<div slot="footer" align="center" v-if="!archiveLoading">
				<button class="long" v-on:click="archiveProject">Submit</button>
			</div>
		</Modal>
		<Modal title="Fields Required Modal" :sticky="true" :plain="true" :show="showCompletionErrorDialog" :onclose="() => { showCompletionErrorDialog=false }">
			<div slot="body">
				<i class="dc-cancel close" v-on:click="showCompletionErrorDialog=false"></i>
				<p>Please update all fields for the project to be able to find talents</p>
			</div>
		</Modal>
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
		<div :class="{ active: showShareModal }" class="share-overlay">
			<button class="long" v-on:click="shareProject">Share Project</button>
		</div>
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
		data() { return { user: undefined, projects: [], selected: undefined, savingProject: false, 
			showModal: false, name: 'Tolu', showDatePickerAlert: false, stacks: [], platforms: [], 
			categories: [], fetchedCategories: [], showFindTalentModal: false, openStacks: true, 
			openRoles: true, openEmployment: true, showShareModal: false, showArchiveModal: false, 
			archiveReason: '', archiveLoading: false, talentsLoading: false, selectedRoles: [],
			selectedLangauges: [], selectedEmploymentStatus: [], fetchedTools: [], talents: [],
			showCompletionErrorDialog: false, selectedTalents: [], showBriefErrorDialog: false,
			saveProjectLoading: false, showStatusModal: false, processStatus: '', processLoading: false }
		},
		components: { Project, ProjectView, Modal, Input, Datepicker, InputDrop, CheckBox },
		methods: {
			simpleDateFormat(d) {
				var date = new Date(d.split("-").map((v) => { return (v.length < 2) ? "0"+v : v }).join("-"));
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
				return date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
			},
			setValue(type, value, item) {
				if(type == 'roles') { (value) ? this.selectedRoles.push(item) : this.selectedRoles.splice(this.selectedRoles.indexOf(item), 1); }
				if(type == 'stacks') { (value) ? this.selectedLangauges.push(item) : this.selectedLangauges.splice(this.selectedLangauges.indexOf(item), 1); }
				if(type == 'emp-status') { (value) ? this.selectedEmploymentStatus.push(item) : this.selectedEmploymentStatus.splice(this.selectedEmploymentStatus.indexOf(item), 1); }
			},
			openProject(project) {
				var self = this;
				this.selected = project;
				this.$router.push("#project="+project.id);
				console.log(project);
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
				this.fetchTalents();
			},
			closeTalentPane() {
				this.selectedTalents = [];
				this.showShareModal = false;
				$(".project-view-pane").expand();
				$(".project-talent-pane").collapse();
			},
			saveProject(v) {
				var self = this;
				this.saveProjectLoading = true;
				let param = { 
					project_ref: this.selected.project_ref, 
					project_name: this.selected.project_name,
					cost: this.selected.agreed_cost,
					description: this.selected.description,
					categories: (this.selected.categories) ? this.selected.categories.map((v) => { return v.id; }) : [],
					platforms: this.selected.platforms,
					skills: this.selected.modules,
					deadline: this.selected.deadline,
					requirement_doc_link: this.selected.requirement_doc_link,
					jira_link: this.selected.jira_link
				}
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						self.$http.put(store.state.api.development+"project/update", param, {
							headers: { 'Authorization' : session.token }
						}).then(res => { 
							self.saveProjectLoading = false;
							self.showModal = false;
							if(self.checkProjectCompletion(res.body.extras.project)) {
								self.showFindTalentModal = true;
							}
							console.log(res);
						}).catch(err => { console.log(err); });
					}
				});
			},
			fetchStacks(v) {
				var all = this.fetchedTools;
				this.stacks = all.filter((t) => { return t.toLowerCase().match(v.toLowerCase()); });
				if(this.stacks.length < 1) this.stacks = all;
			},
			fetchPlatforms(v) {
				var all = [ 'Android', 'iOS', 'Website' ];
				this.platforms = all.filter((t) => { return t.toLowerCase().match(v.toLowerCase()); });
				if(this.platforms.length < 1) this.platforms = all;
			},
			fetchCategories(v) {
				let fetched = this.fetchedCategories.filter((t) => { return t.title.toLowerCase().match(v.toLowerCase()); });
				this.categories = [];
				for(var i = 0; i < fetched.length; i++) {
					this.categories.push(fetched[i].title);
				}
				if(this.categories.length < 1) this.categories = this.fetchedCategories.map((c) => { return c.title; });
			},
			setCategories(v) {
				var r = []
				for(var i = 0; i < v.length; i++) {
					r = r.concat(this.fetchedCategories.filter((a) => { return a.title == v[i]})[0])
				}
				this.selected.categories = r;
			},
			unsetCategory(v) {
				this.selected.categories = this.selected.categories.filter((a) => { return a.title != v });
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
			},
			checkProjectCompletion(project) {
				var all = [project.project_name, project.description, project.agreed_cost, project.categories, project.platforms, project.modules, project.deadline, project.requirement_doc_link, project.jira_link]
				for(var i = 0; i < all.length; i++) {
					console.log(all[i]);
					if(!all[i]) { return false; }
					if(all[i] instanceof Array) {  if(all[i].length < 0) return false; }
					if(typeof(all[i]) == "string") { if(all[i] == '') return false; }
					if(typeof(all[i]) == "object") { if(JSON.stringify(all[i]).length < 3) return false; }
				}
				return true;
			},
			shareWith(v, talent) {
				(v) ? this.selectedTalents.push(talent.id) : this.selectedTalents.splice(this.selectedTalents.indexOf(talent.id), 1);
				if(this.selectedTalents.length < 1) this.showShareModal = false;
				else this.showShareModal = true;
				console.log(this.selectedTalents, talent);
			},
			shareProject() {
				var self = this;
				this.processLoading = true;
				this.showStatusModal = true;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						self.$http.post(store.state.api.development+"project/share", { project_ref: self.project_ref }, {
							headers: { 'Authorization' : session.token }
						}).then(res => { 
							this.processStatus = "Project has been shared with names";
							this.processLoading = false;
							console.log(res);
						}).catch(err => { console.log(err); });
					}
				});
			},
			archiveProject() {
				this.archiveLoading = true;
				this.showArchiveModal = true;
				var self = this;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						self.$http.put(store.state.api.development+"project/archive", 
							{ project_ref: self.selected.project_ref, archiveReason: self.archiveReason }, {
								headers: { 'Authorization' : session.token }
							}
						).then(res => {
							self.archiveLoading = false;
							self.showArchiveModal = false;
						}).catch(err => { console.log(err); this.archiveLoading = false; });
					}
				});
			},
			fetchTalents() {
				var self = this;
				self.talentsLoading = true;
				const param = { roles: this.selectedRoles, skills: this.selectedLangauges, employment_status: this.selectedEmploymentStatus } 
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						this.$http.post(store.state.api.development+"project/find-talent", param, {
							headers: { 'Authorization' : session.token }
						}).then(res => {
							self.talentsLoading = false;
							self.talents = res.body.extras.talents;
						}).catch(err => { console.log(err); });
					}
				});
			},
			fetchTools() {
				var self = this;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						this.$http.get(store.state.api.development+"get-tools", {
							headers: { 'Authorization' : session.token }
						}).then(res => { 
							let all = res.body.extras.tools;
							store.commit("saveTools", all);
							for(var i = 0; i < all.length; i++) {
								self.fetchedTools.push(all[i].title);
							}
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
					if(!session.tools) { self.fetchTools() }
					else { self.fetchedTools = session.tools.map((a) => { return a.title }); }
					self.projects = session.projects.filter((o) => { return (o.project_stage==0&&o.closed==0&&o.archive==0)});
					this.$http.get(store.state.api.development+"category", {
						headers: { 'Authorization' : session.token }
					}).then(res => { 
						self.fetchedCategories = res.body.extras.category;
					}).catch(err => { console.log(err); });
				}
			});
			// setTimeout(() => { this.showFindTalentModal = true }, 5000);
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showPMLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>