<template>
	<div class="profile-view" v-if="userProfile.work_preference">
		<div class="box">
			<div class="profile-photo">
				<img :src="placeholder" alt="placeholder" />
				<div class="cover" v-on:click="changePhoto"><span>Change your profile picture</span></div>
			</div>
			<div class="personal-pane">
				<h1>{{ }} <a href="#" class="clear" v-on:click.prevent="showProfileModal=true">Edit</a></h1>
				<p>I'm a <span>{{ userProfile.work_preference.preferred_roles[0].value }}</span> developer with experience in <span>{{ userProfile.roles_and_skills.roles.map((r,i) => { return " "+r.value;  }).toString() }}</span> development</p> 
				<div class="integration">
					<a :href="'https://linkedin.com/in/'+user.li_username" v-if="user.li_username" target="_new"><i class="dc-linkedin"></i></a>
					<a :href="'https://github.com/'+user.git_username" v-if="user.git_username" target="_new"><i class="dc-github"></i></a>
					<a :href="'https://dribbble.com/'+user.dribbble_username" v-if="user.dribbble_username" target="_new"><i class="dc-dribbble"></i></a>
					<a :href="'https://behance.net/'+user.behance_username" v-if="user.behance_username" target="_new"><i class="dc-behance"></i></a>
				</div>
			</div>
			<div class="language-pane">
				<h2>Language and Skills <a href="#" class="clear" v-on:click.prevent="showRolesModal=!showRolesModal">Edit</a></h2>
				<div class="taggered" v-for="role in userProfile.roles_and_skills.languages"><div class="title">{{ role.value }}</div><span></span><div class="counter">{{ role.experience }}</div></div>
			</div>
			<div class="employment-pane">
				<h2>Employment <a href="#" class="clear" v-on:click.prevent="showEmploymentModal=!showEmploymentModal">Edit</a></h2>
				<p>{{ 
					(userProfile.work_preference.employment_type_contract) ? 'Contract' : (userProfile.work_preference.employment_type_full_time) ? 'Full Time' : (userProfile.work_preference.employment_type_internship) ? "Internship" : (userProfile.work_preference.employment_type_remote) ? 'Freelancer' : 'Unemployed'
				 }}</p>
			</div>
		</div>
		<Modal title="Roles and Integrations" :show="showProfileModal" :sticky="1<0" :onclose="closeModal">
			<div slot="body">
				<div class="preloader" v-if="savingRolesIntegration"><i class="dc-spinner animate-spin"></i></div>
				<div class="roles" v-if="!savingRolesIntegration">
					<Title label="What is your core Role?" :showAlert="showRoleError" :alert="roleError" />
					<ul class="grid grid-2" style="position: relative; z-index: 110; ">
						<li><Select name="core-role" :options="roles" v-on:change="setCoreRole" label="" :alt="true" :selected="userProfile.work_preference.preferred_roles[0].value" /></li>
						<li>&nbsp;</li>
					</ul>
				</div>
				<div class="roles-others" v-if="!savingRolesIntegration">
					<Title label="What other roles best describer you?" :showAlert="showOtherRoleError" :alert="otherRoleError" />
					<ul class="grid grid-2 other-roles" :style="'position:relative;z-index:'+(106-i)+';'" v-for="i in moreRoles">
						<li><Select :name="'other-role-'+i" :options="roles" v-on:change="(v) => setOtherRoles(v, i)" label="" :alt="true" :selected="userProfile.roles_and_skills.roles[i-1].value"  /></li>
						<li>&nbsp;</li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreRoles" class="add-more-roles-btn">+ Add a Role</a>
				</div>
				<div class="integration" v-if="!savingRolesIntegration">
					<Title label="Link your accounts so we can know more about you" :showAlert="showIntegrationError" :alert="integrationError" />
					<ul class="grid grid-2" v-for="i in integrations">
						<li><div class="name"><i :class="i.icon"></i> {{ i.title }}</div></li>
						<li>
							<p v-show="sets[i.key] != false">{{ values.integrations[i.key] }} <i class="dc-cancel" v-on:click="sets[i.key]=false;removeIntegration(i.key)"></i></p>
							<div v-show="sets[i.key]==false">
								<Input type="text" label="" :value="user[i.key]" :alt="true" placeholder="Enter your username" v-on:change="(v)=>setIntegrationValue(v, i.key)" /><button class="small" v-on:click="setIntegration(i.key)">Link</button>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div slot="footer">
				<button class="long" v-on:click="saveRolesIntegration">Save</button>
			</div>
		</Modal>
		<Modal title="Language and Skills" :show="showRolesModal" :sticky="!showRolesModal" :onclose="closeModal">
			<div slot="body">
				<div class="languages">
					<Title label="What language, frameworks or skills do you know?" :showAlert="showLangSkillsError" :alert="langSkillsError" />
					<ul class="grid grid-2 langs" :style="'position:relative;z-index:'+(200-i)+';'" v-for="i in moreSkill">
						<li>
							<Select :name="'lang-skills-'+i" v-if="userProfile.roles_and_skills.languages[i-1]" :selected="userProfile.roles_and_skills.languages[i-1].value" :options="skills" v-on:change="(v) => setLangSkills(v, i)" label="" :alt="true"  />
							<Select :name="'lang-skills-'+i" v-else :options="skills" v-on:change="(v) => setLangSkills(v, i)" label="" :alt="true"  />
						</li>
						<li class="alt">
							<Select v-if="userProfile.roles_and_skills.languages[i-1]" :selected="userProfile.roles_and_skills.languages[i-1].experience" :name="'lang-skills-year-'+i" :options="years" v-on:change="(v) => setLangSkillsYears(v, i)" label=""  />
							<Select v-else :name="'lang-skills-year-'+i" :options="years" v-on:change="(v) => setLangSkillsYears(v, i)" label=""  />
						</li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreSkill" class="add-more-roles-btn">+ Add a language, framework or skill</a>
				</div>
			</div>
			<div slot="footer">
				<button class="long">Save</button>
			</div>
		</Modal>
		<Modal title="Employment Status" :show="showEmploymentModal" :sticky="!showEmploymentModal" :onclose="closeModal">
			<div slot="body">
				<div class="roles">
					<Title label="What is your current employment status?" :showAlert="showEmploymentError" :alert="employmentError" />
					<ul class="grid grid-2">
						<li><Select name="employment-status-value" :options="employment" v-on:change="setEmployment" label="" :alt="true" :selected="(userProfile.work_preference.employment_type_contract) ? 'work_preference_employment_type_contract' : (userProfile.work_preference.employment_type_full_time) ? 'work_preference_employment_type_full_time' : (userProfile.work_preference.employment_type_internship) ? 'work_preference_employment_type_internship' : (userProfile.work_preference.employment_type_remote) ? 'work_preference_employment_type_remote' : ''"  /></li>
						<li>&nbsp;</li>
					</ul>
				</div>
			</div>
			<div slot="footer">
				<button class="long">Save</button>
			</div>
		</Modal>
		<Modal title="suspend modal" :show="showSuspendedModal" :sticky="1>0" :plain="1>0" :onclose="closeModal">
			<div slot="body" class="">
				<h1>Oops!</h1>
				<p>Seems like your profile has been suspended.</p>
				<p>We've contacted you by email telling you why. If you feel like this isn't right, feel free to contact us.</p>
			</div>
			<div slot="footer">
				<button class="clear">Log Out</button> 
				<button class="clear colored">Contact Us <i class="dc-caret right"></i></button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Modal from '@/components/sub/Modal'
	import Title from '@/components/sub/Title'
	import Select from '@/components/sub/Select'
	import Input from '@/components/sub/Input'
	import store from '@/store'

	export default {
		name: 'ViewProfile', 
		components: { Modal, Title, Select, Input },
		data() { return {
			moreRoles : 1, user: undefined, loadingComplete: false, userProfile: {}, showSuspendedModal: false,
			fullname: "John Doe", hasOtherRole: false, role: "Backened", otherRole: ["Frontend"],
			howRoleError: false, savingRolesIntegration: false,
			roles: [
				{ value: "", title: "Select a Role" }, 
				{ value: "Android Developer", title: "Android Developer" },
				{ value: "Backend Developer", title: "Backend Developer" },
				{ value: "Frontend Developer", title: "Frontend Developer" },
				{ value: "IOS Developer", title: "IOS Developer" },
				{ value: "Mobile Developer", title: "Mobile Developer" },
				{ value: "UI Designer", title: "UI Designer" },
				{ value: "UX Researcher", title: "UX Researcher" },
				{ value: "UX Designer", title: "UX Designer" },
				{ value: "UI/UX Designer", title: "UI/UX Designer" }
			],
			moreRoles: 1, moreSkill: 1, showOtherRoleError: false, otherRoleError: '', canGoBack: false,
			showRoleError: false, roleError: "* Please select at least one role",
			skills: [
				{ value: "", title: "Select one" },
				{ value: "Adobe XD", title: "Adobe XD" },
				{ value: "Angular JS", title: "Angular JS" },
				{ value: "Bootstrap", title: "Bootstrap" },
				{ value: "C++", title: "C++" },
				{ value: "CSS", title: "CSS" },
				{ value: "Django", title: "Django" },
				{ value: "Electron JS", title: "Electron JS" },
				{ value: "GO", title: "GO" },
				{ value: "HTML", title: "HTML"}
			],
			years: [
				{ value: "0 - 2 years", title: "0 - 2 years" },
				{ value: "2 - 5 years", title: "2 - 5 years" },
				{ value: "5 - 10 years", title: "5 - 10 years" },
				{ value: "10 - 20 years", title: "10 - 20 years" }
			],
			employment: [
				{ value: "", title: "Select a status" },
				{ value: "work_preference_employment_type_contract", title: "Contract" },
				{ value: "work_preference_employment_type_full_time", title: "Employed (Full-time)" },
				{ value: "work_preference_employment_type_remote", title: "Freelancer" },
				{ value: "work_preference_employment_type_unemployed", title: "Unemployed" }
			],
			integrations: [
				{ icon: "dc-linkedin", title: "LinkedIn", key: "li_username" },
				{ icon: "dc-github", title: "Github", key: "git_username" },
				{ icon: "dc-behance", title: "Behance", key: "behance_username" },
				{ icon: "dc-dribbble", title: "Dribbble", key: "dribbble_username" }
			],
			showLangSkillsError: false, langSkillsError: '* Please select at least one language, framework or skill',
			values: { preferredRole: [], roles: [], langSkills: [], employment: '', integrations: {} },
			showEmploymentError: false, employmentError: "* Please let us know your employment status",
			showIntegrationError: false, integrationError: "* Please link at least one of your accounts",
			showRolesModal: false, showProfileModal: false, showEmploymentModal: false,
			languages: [
				{ name: "Python", experience: "15+ years" }
			],
			employment_status: "Freelance",
			placeholder : require("../assets/img/placeholder.svg"),
			sets: { li_username: false, git_username: false, behance_username: false, dribbble_username: false }
		}},
		methods: {
			changePhoto() {
				console.log("preparing to change photo")
			},
			closeModal() {
				this.showRolesModal = false;
				this.showProfileModal = false;
			},
			setCoreRole: function(value) {
				if(value!=="") { 
					this.showRoleError = false; 
					var fields = this.values.roles.concat(this.values.preferredRole);
					for(var i=0;i<fields.length;i++) { if(fields[i].value == value) { this.roleError="* You've already selected that role"; this.showRoleError=true; return; }}
					this.values.preferredRole[0] = {value: value};
				}else { this.showRoleError=true;  this.roleError="* Please select at least one role"; }
			},
			setOtherRoles: function(value, id) { 
				var fields = this.values.roles.concat(this.values.preferredRole);
				this.showOtherRoleError=false;
				for(var i=0;i<fields.length;i++) { if(fields[i].value == value) { this.otherRoleError="* You've already selected that role"; this.showOtherRoleError=true; return; }}
				this.values.roles[parseInt(id) - 1] = { value: value };
			},
			setLangSkills: function(value, id) { 
				if(value!=="") { this.showLangSkillsError = false; }else { this.showLangSkillsError=true; return; }
				var field = this.values.langSkills[parseInt(id)-1]; 
				var all = this.values.langSkills;
				this.showLangSkillsError=false;
				for(var i=0;i<all.length;i++) { if(all[i].value == value) { this.langSkillsError="* You've already selected that skill"; this.showLangSkillsError=true; return; }}
				(field) ? field.value = value : field = { value: value, experience: "0 - 2 years"}; 
				this.values.langSkills[parseInt(id)-1] = field;
			},
			setLangSkillsYears: function(value, id) { 
				var field = this.values.langSkills[parseInt(id)-1];
				(field) ? field.experience = value : field = { experience: value}; 
				this.values.langSkills[parseInt(id)-1] = field;
			},
			setEmployment: function(value) {
				if(value!=="") { this.showEmploymentError = false; }else { this.showEmploymentError=true; return; }
				this.values.employment = value;
			},
			setIntegration: function(key) {
				if(this.values.integrations[key] && this.values.integrations[key].match(/^[a-z_.A-Z0-9\-]+$/)) {
					this.sets[key]=true;
					this.showIntegrationError = false;
				}else { this.showIntegrationError = true, this.integrationError = "Username is invalid, please try again!" }
			},
			setIntegrationValue: function(value, key) {
				this.values.integrations[key] = value;
			},
			removeIntegration: function(key) {
				delete this.values.integrations[key];
			},
			addMoreRoles: function() {
				if(this.moreRoles > 2) { this.otherRoleError = "* You can't add more than 3 more roles"; this.showOtherRoleError = true; }
				else { this.moreRoles = this.moreRoles+1; }
			},
			addMoreSkill: function() {
				if(this.moreSkill < 10) { this.moreSkill=this.moreSkill+1; }
				else {
					this.showLangSkillsError = true;
					this.langSkillsError = "* You can't add more than 10 skill and languages"
				}
			},
			saveRolesIntegration: function() {
				let self = this;
				this.savingRolesIntegration = true;
				store.dispatch('getSession').then(session => {
					this.$http.post(store.state.api.development+"profile/roles_and_skills/save", { "roles_and_skills_roles" : this.values.roles }, 
						{ headers: { 'Authorization': session.token }}).then(res => {
							console.log(res);
							self.$http.post(store.state.api.development+"profile/update", self.values.integrations, 
								{ headers: { 'Authorization': session.token }}).then(res => {
									console.log(res);
									self.$http.post(store.state.api.development+"profile/work-preference/save", { "work_preference_preferred_roles": self.values.preferredRole }, 
										{ headers: { 'Authorization': session.token }}).then(res => {
											console.log(res);
											self.savingRolesIntegration = false;
									}).catch(err => { console.log(err, session); });
							}).catch(err => { console.log(err, session, self.values.integrations); });
					}).catch(err => { console.log(err, session); });
				});
			}
		},
		beforeMount() {
			
		},
		mounted() {
			var self = this;
			store.dispatch('getSession').then(session => {
				if(session){
					self.user = session.user;
					self.userProfile = session.user_profile;
					self.moreRoles = this.userProfile.roles_and_skills.roles.length;
					self.moreSkill = this.userProfile.roles_and_skills.languages.length;
					if(this.user.li_username) { this.values.integrations['li_username'] = this.user.li_username; this.sets['li_username'] = true; }
					if(this.user.git_username) { this.values.integrations['git_username'] = this.user.git_username; this.sets['git_username'] = true; }
					if(this.user.behance_username) { this.values.integrations['behance_username'] = this.user.behance_username; this.sets['behance_username'] = true; }
					if(this.user.dribbble_username) { this.values.integrations['dribbble_username'] = this.user.dribbble_username; this.sets['dribbble_username'] = true; }
					this.values.preferredRole = this.userProfile.work_preference.preferred_roles;
					this.values.roles = this.userProfile.roles_and_skills.roles;
					this.values.langSkills = this.userProfile.roles_and_skills.languages;
				}
			});
			// setTimeout(function() {
			// 	self.showSuspendedModal = true;
			// }, 1000);
		}
	}

</script>