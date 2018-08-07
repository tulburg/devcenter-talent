<template>
	<div class="container talent-pool">
		<ul class="grid grid-4 field-pane">
			<li class="field"><InputDrop label="" name="role-input-drop" placeholder="Enter a Role" :options="roles" v-on:change="filterRoles" @selected="(v) => { selectedRoles = v }" /></li>
			<li class="field"><InputDrop label="" name="languages-input-drop" placeholder="Enter a Language" :options="languages" v-on:change="filterLanguages" @selected="(v) => { selectedLangauges = v }" /></li>
			<li class="field"><Select name="employment" :options="[
				{ title: 'Contract', value: 'contract' },
				{ title: 'Employed (Full-time)', value: 'employed' },
				{ title: 'Freelancer', value: 'freelancer' },
				{ title: 'Unemployed', value: 'unemployed' },
			]" label="" @change="(v) => { this.selectedEmploymentStatus = v }" /></li>
			<li class="field"><button class="bar" v-on:click="searchTalent">Search</button></li>
		</ul>
		<hr />
		<div class="card-pane" v-if="talentLoading==false">
			<div class="box talent-profile-card" v-for="talent in talents">
				<div class="profile-photo" v-on:click="() => { showProfileModal=true; setModal('profile-modal', talent); }"><img :src="talent.profile_image" alt="placeholder" /></div>
				<div class="profile-details" v-on:click="() => { showProfileModal=true; setModal('profile-modal', talent); }">
					<h3>{{ talent.first_name+" "+talent.last_name }}</h3>
					<p>{{ (talent.preferred_roles.length > 0) ? talent.preferred_roles[0].value: '' }}, {{ talent.roles.slice(0, talent.roles.length - 1).map((a) => { return a.value }).join(", ")+" and "+((talent.roles.length > 0) ? talent.roles.slice(-1)[0].value : '')}}</p>
				</div>
				<i class="dc-menu-h dropdown-menu talent-dropdown-anchor" v-on:click="(e) => { showDropMenu(e) }">
					<transition name="account-drop">
						<ul class="dropdown talent-dropdown" style="display:none">
							<li v-for="menu in [
									{ title: 'Project History', action: () => { showProjectHistoryModal=true; setModal('project-history-modal', talent); } },
									{ title: 'View Profile', action: () => { showProfileModal=true; setModal('profile-modal', talent); } },
									{ title: 'Earnings', action: () => { showEarningsModal=true; setModal('earnings-modal', talent); } }				
								]"><a href="#" v-on:click.prevent="menu.action">{{ menu.title }}</a></li>
						</ul>
					</transition>
				</i>
			</div>
		</div>
		<div class="preloader" v-else><i class="dc-spinner animate-spin"></i></div>
		<Modal title="Project History Modal" :sticky="true" :show="showProjectHistoryModal" :onclose="() => { showProjectHistoryModal=false }">
			<div slot="body">
				<div class="preloader" v-if="projectHistoryLoading"><i class="dc-spinner animate-spin"></i></div>
				<div class="box project-box" v-for="project in selectedProfileProjects" v-else>
					<ul class="grid grid-2 separator project">
						<li>
							<h1>{{ project.project_name }} <span class="badge" :class="{ success: project.project_stage==2, primary: project.project_stage==1, danger: project.project_stage==0}">
							{{ (project.project_stage==0) ? 'NEW': '' }}
							{{ (project.project_stage==1) ? 'PENDING': '' }}
							{{ (project.project_stage==2) ? 'IN PROGRESS': '' }}
							{{ (project.project_stage==3||project.project_stage==4) ? 'CLOSED': '' }}
						</span></h1>
							<p>{{ (project.description.length > 300) ? project.description.substring(0, 300)+'...' : project.description }} </p>
						</li>
						<li>
							<div class="label">Cost</div>
							<div class="value">NGN {{ (project.agreed_cost) ? project.agreed_cost.toLocaleString() : 0 }}</div><br/>
							<div class="label">Due Date</div>
							<div class="value">{{ (project.deadline) ? simpleDateFormat(project.deadline) : '' }}</div><br/>
						</li>
					</ul>
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
		<Modal title="Earnings Modal" :sticky="true" :show="showEarningsModal" :onclose="() => { showEarningsModal=false }">
			<div slot="body">
				<div class="table">
					<ul class="grid grid-4 thead"><li>Date</li><li>Project Name</li><li>Milestone</li><li>Amount (NGN)</li></ul>
					<ul class="grid grid-4 tbody" v-for="i in 120"><li>14 Jul 2018</li><li>Travel Mall</li><li>Milestone 2</li><li>100,000</li></ul>
				</div>
			</div>
			<div slot="footer" v-on:click="showProfileEarningsModal=true;showEarningsModal=false"><button>Update Earnings</button></div>
		</Modal>
		<Modal title="Profile Earnings Modal" :sticky="true" :plain="true" :show="showProfileEarningsModal" :onclose="() => { showProfileEarningsModal }">
			<div slot="body">
				<div class="details">
					<i class="dc-cancel close" v-on:click="showProfileEarningsModal=false"></i>
					<div class="profile-photo">
						<img src="../../assets/img/avatar.svg" alt="photo" />
					</div>
					<h1>John Doe</h1>
				</div>
				<form>
					<Select label="Project name" :options="[
						{ title: 'Select a Project', value: ''}, 
						{ title: 'Travel mall', value: 'Something'}
					]" />
					<Input label="Milestone" type="text" placeholder="Enter a milestone" />
					<Input label="Amount (NGN)" type="text" placeholder="Enter an Amount" />
					<Input label="Confirm amount (NGN)" type="text" placeholder="Enter an Amount" />
				</form>
			</div>
			<div slot="footer" class="buttons">
				<button class="bar">Update Earnings</button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Bus from '@/Bus'
	import store from '@/store'
	import Input from '@/components/sub/Input'
	import InputDrop from '@/components/sub/InputDrop'
	import Select from '@/components/sub/Select'
	import Modal from '@/components/sub/Modal'

	export default {
		name: 'TalentPool',
		components: { Input, InputDrop, Select, Modal },
		data() { return { roles: [], languages: [], placeholders: [ 
				{ name: "John Doe", stack: "Backend, Frontend, Mobile", photo: require("../../assets/img/avatar.svg") }, 
				{ name: "Jason Adetunbo", stack: "iOS Backend", photo: require("../../assets/img/avatar-2.svg") },
				{ name: "Chris Njoku", stack: "UX Researcher", photo: require("../../assets/img/avatar-3.svg") }, 
				{ name: "Lanre Shonibare", stack: "UX/UI Designer", photo: require("../../assets/img/avatar-4.svg") },
				{ name: "Alexander Pret", stack: "Backend", photo: require("../../assets/img/avatar-5.svg") }
			], activeDropDown: null, selectedTalentName: 'Jossy', showProjectHistoryModal: false, showProfileModal: false, showEarningsModal: false, showProfileEarningsModal: false, fetchedTools: [],
			selectedLangauges: [], selectedRoles: [], selectedEmploymentStatus: '', projectHistoryLoading: false, userProfileLoading: false, selectedProfile: undefined, selectedProfileRatings: undefined,
			talentLoading: false, talents: [], selectedProfileProjects: [] 
		} },
		methods: {
			simpleDateFormat(d) {
				var date = new Date(d.split("-").map((v) => { return (v.length < 2) ? "0"+v : v }).join("-"));
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
				return date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
			},
			filterRoles: function(v) {
				var all = [ 'Android Developer', 'Backend Developer', 'Frontend Developer', 'iOS Developer', 'Mobile Developer', 'UI Designer', 'UX Researcher', 'UX Designer', 'UX/UI Designer' ];
				this.roles = all.filter((t) => { return t.toLowerCase().match(v.toLowerCase()); });
			},
			filterLanguages: function(v) {
				this.languages = this.fetchedTools.filter((t) => { return t.toLowerCase().match(v.toLowerCase()); });
			},
			showDropMenu(e, t) {
				var a=e.target||e.srcElement;
				if(a.hasClass("talent-dropdown-anchor")) {
					if(!a.$(".dropdown").hasClass("active")){ 
						a.$(".dropdown").style.display='block';
						this.activeDropDown = a.$(".dropdown");
						setTimeout(() => { a.$(".dropdown").addClass("active"); }, 50);
					}else {
						a.$(".dropdown").removeClass("active");
						this.activeDropDown = null;
						setTimeout(() => { a.$(".dropdown").style.display='none'; }, 300);
					}
				}
			},
			setModal(id, talent) {
				var self = this;
				if(id == 'project-history-modal') {
					this.projectHistoryLoading = true;
					$("#"+id).$(".header").innerHTML = talent.first_name+" "+talent.last_name+"'s Project History";
					store.dispatch('getSession').then(session => {
						if(session == null) self.$router.push("/")
						else {
							this.$http.get(store.state.api.development+"project/get-user-projects/"+talent.id, {
								headers: { 'Authorization' : session.token }
							}).then(res => { 
								self.projectHistoryLoading = false;
								self.selectedProfileProjects = res.body.extras.projects;
							}).catch(err => { console.log(err); self.selectedProfileProjects = []; });
						}
					});
				}
				if(id == 'profile-modal') {
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
				}
				if(id == 'earnings-modal') {
					$("#"+id).$(".header").innerHTML = talent.first_name+" "+talent.last_name+"'s Earnings";
				}
			},
			searchTalent() {
				var self = this;
				self.talentLoading = true;
				var param = { roles: this.selectedRoles, skills: this.selectedLangauges, employment_status: this.selectedEmploymentStatus } 
				store.dispatch('getSession').then(session => {
					if(session == null) self.$router.push("/")
					else {
						this.$http.post(store.state.api.development+"project/find-talent", param, {
							headers: { 'Authorization' : session.token }
						}).then(res => {
							console.log(res);
							self.talentLoading = false;
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
			}
		},
		mounted() {
			var self = this;
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_showPMLinks", true);
			Bus.$emit("Header_showPMAccount", true);
			Bus.$emit("Header_showGrayLogo", true);
			store.dispatch('getSession').then(session => {
				if(session == null) self.$router.push("/")
				else {
					self.user = session.user;
					if(!session.tools) { self.fetchTools() }
					else { self.fetchedTools = session.tools.map((a) => { return a.title }); }
				}
			});
			document.addEventListener("click", function(e) { 
				if(!e.target.className.match("dropdown-anchor") && !e.target.className.match("talent-dropdown")){ 
					if(self.activeDropDown) self.activeDropDown.removeClass("active");
					setTimeout(() => { if(self.activeDropDown) { self.activeDropDown.style.display='none'; } self.activeDropDown = null; }, 300); 
				}
			});
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showPMLinks", false);
			Bus.$emit("Header_showPMAccount", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>