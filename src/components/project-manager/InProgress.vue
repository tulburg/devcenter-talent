<template>
	<div class="container projects">
		<div class="box empty-state" v-if="projects.length < 1">
			<div><i class="dc-lazy"></i></div>
			<p>You have no project in progress at the moment</p>
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
					due: (selected.deadline) ? simpleDateFormat(selected.deadline): ''
				}" :actions="[
					{ title: 'View Project Brief', action: () => { (selected.requirement_doc_link&&selected.requirement_doc_link!='') ? this.gotoReqDoc() : showBriefErrorDialog = true; } },
					{ title: 'Find Talents', action: () => { (checkProjectCompletion(selected)) ? openTalentPane('find') : showCompletionErrorDialog = true; } },
					{ title: 'Assign Talents', action: () => { (checkProjectCompletion(selected)) ? openTalentPane('assign') : showCompletionErrorDialog = true; } },
					{ title: 'Remove Talents', action: () => { (checkProjectCompletion(selected)) ? openTalentPane('remove') : showCompletionErrorDialog = true; } },
				]" :menus="[
					{ title: 'Move to Pending', action: () => { moveProjectTo('pending') } },
					{ title: 'Archive Project', action: () => { showArchiveModal=true; } },
					{ title: 'Close Project', action: () => { moveProjectTo('close') } }
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
						<div :class="{ disabled: talentPaneMode!='remove' && (selected.team_members) ? selected.team_members.find((t)=>{ return t.id==talent.id })!=undefined : false}" class="box talent-profile-card" v-for="talent in talents" v-on:click="() => { showProfileModal=true; fetchTalentProfile(talent); }">
							<div class="profile-photo"><img :src="talent.profile_image" alt="placeholder" /></div>
							<div class="profile-details">
								<h3>{{ talent.first_name+" "+talent.last_name }}</h3>
								<p>{{ (talent.preferred_roles.length > 0) ? talent.preferred_roles[0].value: '' }}, {{ talent.roles.slice(0, talent.roles.length - 1).map((a) => { return a.value }).join(", ")+" and "+((talent.roles.length > 0) ? talent.roles.slice(-1)[0].value : '')}}</p>
							</div>
							<CheckBox :checked="talentPaneMode!='remove' && (selectedTalents.find((t)=>{ return t.id==talent.id })!=undefined||((selected.team_members) ? selected.team_members.find((t)=>{ return t.id==talent.id })!=undefined : false))" v-on:change="(v) => { shareWith(v, talent) }" />
						</div>
					</div>
				</div>
			</div>
		</div>
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
		<Modal title="Brief Required Modal" :sticky="true" :plain="true" :show="showBriefErrorDialog" :onclose="() => { showBriefErrorDialog=false }">
			<div slot="body">
				<i class="dc-cancel close" v-on:click="showBriefErrorDialog=false"></i>
				<p>No project brief has been added to this project</p>
			</div>
		</Modal>
		<Modal title="Fields Required Modal" :sticky="true" :plain="true" :show="showCompletionErrorDialog" :onclose="() => { showCompletionErrorDialog=false }">
			<div slot="body">
				<i class="dc-cancel close" v-on:click="showCompletionErrorDialog=false"></i>
				<p>Please update all fields for the project to be able to find talents</p>
			</div>
		</Modal>
		<Modal title="Status Modal" :sticky="true" :plain="true" :show="showStatusModal" :onclose="() => { showStatusModal=false }">
			<div slot="body" v-if="processLoading" class="preloader"><i class="dc-spinner animate-spin"></i></div>
			<div slot="body" v-else>
				<i class="dc-cancel close" v-on:click="showStatusModal=false"></i>
				<p>{{ processStatus }}</p>
				<div align="center" v-if="showProcessSuccessButton">
					<br/>
					<button class="long" v-on:click="processSuccessButtonAction">{{ processSuccessButtonText }}</button>
				</div>
			</div>
		</Modal>
		<Modal title="Profile Modal" :plain="true" :sticky="false" :show="showProfileModal" :onclose="() => { showProfileModal=false }">
			<div slot="body" class="preloader" v-if="userProfileLoading"><i class="dc-spinner animate-spin"></i></div>
			<div slot="body" v-if="selectedProfile!=undefined&&selectedProfileRatings!=undefined&&userProfileLoading==false">
				<i class="dc-cancel close" v-on:click="showProfileModal=false"></i>
				<div class="profile-photo">
					<img :src="(selectedProfile) ? selectedProfile.profile_image : '../../assets/img/avatar.svg'" alt="photo" />
				</div>
				<div class="personal-pane">
					<h1>{{ (selectedProfile) ? selectedProfile.first_name+' '+selectedProfile.last_name : 'John Doe' }}</h1>
					<p>I'm a {{ (selectedProfile&&selectedProfile.preferred_roles.length>0) ? selectedProfile.preferred_roles[0].value : 'Unknown' }} with experience in 
						{{ (selectedProfile) ? selectedProfile.roles.slice(0, selectedProfile.roles.length - 1).map((a) => { return a.value }).join(", ")+" and "+((selectedProfile.roles.length > 0) ? selectedProfile.roles.slice(-1)[0].value : '') : 'unknown and unknown' }}</p> 
					<div class="integration">
						<a v-if="selectedProfile&&selectedProfile.li_username" :href="'https://linkedin.com/in/'+selectedProfile.li_username" target="_new"><i class="dc-linkedin"></i></a>
						<a v-if="selectedProfile&&selectedProfile.git_username" :href="'https://github.com/'+selectedProfile.git_username" target="_new"><i class="dc-github"></i></a>
						<a v-if="selectedProfile&&selectedProfile.dribbble_username" :href="'https://dribbble.com/'+selectedProfile.dribbble_username" target="_new"><i class="dc-dribbble"></i></a>
						<a v-if="selectedProfile&&selectedProfile.behance_username" :href="'https://behance.net/'+selectedProfile.behance_username" target="_new"><i class="dc-behance"></i></a>
					</div>
				</div>
				<div class="language-pane" v-if="selectedProfile&&selectedProfile.languages">
					<h2>Language and Skills</h2>
					<div class="taggered" v-for="role in selectedProfile.languages"><div class="title">{{ role.value }}</div><span></span><div class="counter">{{ role.experience }}</div></div>
				</div>
				<div class="employment-pane">
					<h2>Employment</h2>
					<p v-if="selectedProfileRatings.work_preference.employment_type_contract">Contract</p>
					<p v-if="selectedProfileRatings.work_preference.employment_type_full_time">Employed</p>
					<p v-if="selectedProfileRatings.work_preference.employment_type_internship">Unemployed</p>
					<p v-if="selectedProfileRatings.work_preference.employment_type_remote">Freelancer</p>
				</div>
				<div class="rank-pane">
					<h2>Rank and Rating</h2>
					<ul class="rank grid grid-2">
						<li><div>Current rating</div><h1>{{ selectedProfileRatings.user_rating.total }}</h1></li>
						<li><div>Current rank</div><h1>Level {{ selectedProfileRatings.user_rating.level }}</h1></li>
					</ul>
					<ul class="rating grid grid-2">
						<li>
							<div class="ratings">
								<div class="title">Attitude <span>{{ selectedProfileRatings.user_rating.attitude }}/75</span></div>
								<div class="bar">
									<span v-for="i in 15" :class="{ active: (i <= (selectedProfileRatings.user_rating.attitude/75)*15) }"></span>
								</div>
							</div>
						</li>
						<li>
							<div class="ratings">
								<div class="title">Communication <span>{{ selectedProfileRatings.user_rating.communication }}/75</span></div>
								<div class="bar">
									<span v-for="i in 15" :class="{ active: (i <= (selectedProfileRatings.user_rating.communication/75)*15) }"></span>
								</div>
							</div>
						</li>
					</ul>
					<ul class="rating grid grid-2">
						<li>
							<div class="ratings">
								<div class="title">Quality <span> {{ selectedProfileRatings.user_rating.quality }}/75</span></div>
								<div class="bar">
									<span v-for="i in 15" :class="{ active: (i <= (selectedProfileRatings.user_rating.quality/75)*15) }"></span>
								</div>
							</div>
						</li>
						<li>
							<div class="ratings">
								<div class="title">Timeliness <span> {{ selectedProfileRatings.user_rating.timeliness }}/75</span></div>
								<div class="bar">
									<span v-for="i in 15" :class="{ active: (i <= (selectedProfileRatings.user_rating.timeliness/75)*15) }"></span>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</Modal>
		<div :class="{ active: showShareModal }" class="share-overlay">
			<button class="long" v-on:click="shareProject">Share Project</button>
		</div>
		<div :class="{ active: showAssignModal }" class="share-overlay">
			<button class="long" v-on:click="assignProject">Assign Project</button>
		</div>
		<div :class="{ active: showRemoveModal }" class="share-overlay">
			<button class="long" v-on:click="removeFromProject">Remove from Project</button>
		</div>
	</div>
</template>


<script>
	
	import Project from '@/components/main/Project'
	import ProjectView from '@/components/main/ProjectView'
	import Modal from '@/components/sub/Modal'
	import Input from '@/components/sub/Input'
	import CheckBox from '@/components/sub/CheckBox'
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'InProgress',
		data() { 
			return { 
				user: undefined, projects: [], selected: undefined, showArchiveModal: false, 
				archiveReason: '', archiveLoading: false, showBriefErrorDialog: false, talentsLoading: false,
				openStacks: true, openRoles: true, openEmployment: true, talents: [], stacks: [],
				showCompletionErrorDialog: false, selectedRoles: [], selectedLangauges: [], 
				selectedEmploymentStatus: [], selectedTalents: [], showShareModal: false, showAssignModal: false,
				talentPaneMode: '', showRemoveModal: false, showStatusModal: false, processStatus: '', 
				processLoading: false, showProcessSuccessButton: false, processSuccessButtonText: '', 
				processSuccessButtonAction: ()=>{}, userProfileLoading: false, selectedProfile: undefined, 
				selectedProfileRatings: undefined, showProfileModal: false
			} 
		},
		components: { Project, ProjectView, Modal, Input, CheckBox },
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
			openTalentPane(type) {
				if(type == 'remove') { 
					(this.selected.team_members) ? this.talents = this.selected.team_members : this.fetchTalents();
				}else if(type == 'assign' || type == 'find') {
					this.fetchTalents();
				}
				$(".project-view-pane").collapse();
				$(".project-talent-pane").expand();
				this.talentPaneMode = type;
			},
			closeTalentPane() {
				this.selectedTalents = [];
				this.showShareModal = false;
				this.showAssignModal = false;
				this.showRemoveModal = false;
				$(".project-view-pane").expand();
				$(".project-talent-pane").collapse();
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
			shareWith(v, talent) {
				(v) ? this.selectedTalents.push(talent) : this.selectedTalents = this.selectedTalents.filter((a) => { return a.id != talent.id });
				if(this.selectedTalents.length < 1) {
					this.showShareModal = false; 
					this.showAssignModal = false; 
					this.showRemoveModal = false;
					return;
				}
				(this.talentPaneMode == 'find') ? this.showShareModal = true : '';
				(this.talentPaneMode == 'assign') ? this.showAssignModal = true : '';
				(this.talentPaneMode == 'remove') ? this.showRemoveModal = true : '';
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
			assignProject() {
				var self = this;
				this.processLoading = true;
				this.showStatusModal = true;
				this.showAssignModal = false;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						self.$http.post(store.state.api.development+"project/assign", 
							{ project_ref: self.project_ref, users: self.selectedTalents.map((t) => { return t.id }) }, {
							headers: { 'Authorization' : session.token }
						}).then(res => { 
							this.processStatus = self.selectedTalents.map((t) => { return t.first_name+" "+t.last_name}).join(", ")+" has been assigned to "+self.selected.project_name;
							self.processSuccessButtonText = "Assign More Talents";
							self.showProcessSuccessButton = true;
							self.processSuccessButtonAction = () => { self.showStatusModal = false; }
							this.processLoading = false;
							(self.selected.team_members) ? self.selected.team_members = self.selected.team_members.concat(self.selectedTalents) : self.selected.team_members = self.selectedTalents;
							self.selectedTalents = [];
							console.log(res);
						}).catch(err => { console.log(err); });
					}
				});
			},
			removeFromProject() {
				var self = this;
				this.processLoading = true;
				this.showStatusModal = true;
				this.showRemoveModal = false;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						self.$http.post(store.state.api.development+"project/assign", 
							{ project_ref: self.project_ref, users: self.selectedTalents.map((t) => { return t.id }) }, {
							headers: { 'Authorization' : session.token }
						}).then(res => { 
							this.processLoading = false;
							this.processStatus = self.selectedTalents.map((t) => { return t.first_name+" "+t.last_name}).join(", ")+" has been removed from "+self.selected.project_name;
							self.processSuccessButtonText = "Remove More Talents";
							self.showProcessSuccessButton = true;
							self.processSuccessButtonAction = () => { self.showStatusModal = false; }
							(self.selected.team_members) ? self.selected.team_members = self.selected.team_members.filter((t) => { for(var i=0;i<self.selectedTalents.length;i++){ if(self.selectedTalents[i].id==t.id) return false; } return true; }) : self.selected.team_members = [];
							self.selectedTalents = [];
							self.talentPaneMode == 'remove';
							self.talents = self.selected.team_members;
							console.log(res);
						}).catch(err => { console.log(err); });
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
									store.commit("saveProjects", session.projects);
								}
							});
							this.processLoading = false;
							self.showProcessSuccessButton = false;
							self.projects.splice(self.projects.indexOf(this.selected), 1);
							console.log(res);
						}).catch(err => { console.log(err); });
					}
				});
			},
			checkProjectCompletion(project) {
				var all = [project.project_name, project.description, project.agreed_cost, project.categories, project.platforms, project.modules, project.deadline, project.requirement_doc_link, project.jira_link]
				for(var i = 0; i < all.length; i++) {
					if(!all[i]) { return false; }
					if(all[i] instanceof Array) {  if(all[i].length < 0) return false; }
					if(typeof(all[i]) == "string") { if(all[i] == '') return false; }
					if(typeof(all[i]) == "object") { if(JSON.stringify(all[i]).length < 3) return false; }
				}
				return true;
			},
			fetchTalentProfile(talent) {
				var self = this;
				this.userProfileLoading = true;
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						this.$http.get(store.state.api.development+"get-user-by-username/"+talent.username, {
							headers: { 'Authorization' : session.token }
						}).then(res => { 
							console.log(res);
							self.selectedProfile = res.body.extras;
							self.$http.get(store.state.api.development+"profile/get/"+talent.username, {
								headers: { 'Authorization': session.token }
							}).then(res => {
								self.selectedProfileRatings = res.body.extras;
								console.log(res, self.selectedProfile, self.selectedProfileRatings);
								self.userProfileLoading = false;
							})
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
					self.projects = session.projects.filter((o) => { return (o.project_stage==2&&o.closed==0&&o.archive==0)});
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