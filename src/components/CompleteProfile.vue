<template>
	
	<section class="complete-profile">
		<div class="box welcome-message" v-show="showWelcomeMessage">
			<h1>Hi {{ name }},</h1>
			<p>Once again welcome to Devcenter's Talent Pool.</p>
			<p>We've pre-filled your profile with the details you provided to us while being screened.</p>
			<p>The next step is to tell us a bit more about what you do so that we can match you to projects you are best suited for. We don't want you missing out on great gigs.</p>
			<div class="buttons">
				<router-link to="/profile" class="button clear skip-btn">Skip for Now</router-link> <button v-on:click="showWelcomeMessage=!showWelcomeMessage">Get Started</button>
			</div>
		</div>

		<section class="invert" v-show="!showWelcomeMessage">
			<div class="box process-stager">
				<ul class="grid grid-4">
					<li class="stage active"><div class="counter"><span v-if="state=='role'||state=='otherRoles'">1</span><i class="dc-tick-2" v-else></i></div><div>Role</div></li>
					<li :class="{active: state!='role'&&state!='otherRoles'}" class="stage">
						<div class="counter"><span v-if="state!='employment'&&state!='integration'&&state!='submitting'">2</span><i class="dc-tick-2" v-else></i></div>
						<div>Languages and Skills</div>
					</li>
					<li :class="{active: state!='role'&&state!='otherRoles'&&state!='langSkills'}" class="stage">
						<div class="counter"><span v-if="state!='integration'&&state!='submitting'">3</span><i class="dc-tick-2" v-else></i></div>
						<div>Employment Status</div>
					</li>
					<li :class="{active: state=='integration'||state=='submitting'}" class="stage">
						<div class="counter"><span v-if="state!='submitting'">4</span><i class="dc-tick-2" v-else></i></div>
						<div>Integrations</div>
					</li>
				</ul>	
			</div>

			<div class="box process-form">
				<div v-show="state=='role'" class="forms">
					<Title label="What is your core Role?" :showAlert="showRoleError" alert="* Please select at least one role" />
					<ul class="grid grid-2">
						<li><Select name="core-role" :options="roles" v-on:change="setCoreRole" label="" :alt="true" :selected="(values.preferredRole.length > 0) ? values.preferredRole[0].value : ''" /></li>
						<li>&nbsp;</li>
					</ul>
				</div>
				<div v-show="state=='otherRoles'" class="forms">
					<Title label="What other roles best describer you?" :showAlert="showOtherRoleError" :alert="otherRoleError" />
					<ul class="grid grid-2 other-roles" :style="'position:relative;z-index:'+(106-i)+';'" v-for="i in moreRoles">
						<li><Select :name="'other-role-'+i" :options="roles" v-on:change="(v) => setOtherRoles(v, i)" v-on:delete="() => deleteRole(i)" label="" :alt="true" :showDelete="i>1" :selected="(values.roles[i-1]) ? values.roles[i-1].value : ''"  /></li>
						<li>&nbsp;</li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreRoles" class="add-more-roles-btn">+ Add a Role</a>
				</div>
				<div v-show="state=='langSkills'" class="forms">
					<Title label="What language, frameworks or skills do you know?" :showAlert="showLangSkillsError" :alert="langSkillsError" />
					<ul class="grid grid-2 other-roles" :style="'position:relative;z-index:'+(200-i)+';'" v-for="i in moreSkill">
						<li><Select :name="'lang-skills-'+i" :options="skills" v-on:change="(v) => setLangSkills(v, i)" label="" :alt="true" :selected="(values.langSkills[i-1]) ? values.langSkills[i-1].value : ''"  /></li>
						<li class="alt"><Select :name="'lang-skills-year-'+i" :options="years" v-on:change="(v) => setLangSkillsYears(v, i)" v-on:delete="() => deleteSkills(i)" label="" :showDelete="i>1" :style="'position:relative;z-index:0;'" :selected="(values.langSkills[i-1]) ? values.langSkills[i-1].experience : ''"  /></li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreSkill" class="add-more-roles-btn">+ Add a language, framework or skill</a>
				</div>
				<div v-show="state=='employment'" class="forms">
					<Title label="What is your current employment status?" :showAlert="showEmploymentError" :alert="employmentError" />
					<ul class="grid grid-2">
						<li><Select name="employment-status" :options="employment" v-on:change="setEmployment" label="" :alt="true" :selected="(values.employment != '') ? values.employment : ''"  /></li>
						<li>&nbsp;</li>
					</ul>
				</div> 
				<div v-show="state=='integration'" class="forms integrations">
					<Title label="Link your accounts so we can know more about you" :showAlert="showIntegrationError" :alert="integrationError" />
					<ul class="grid grid-2" v-for="i in integrations">
						<li><div class="name"><i :class="i.icon"></i> {{ i.title }}</div></li>
						<li>
							<p v-show="sets[i.key] != false">{{ values.integrations[i.key] }} <i class="dc-cancel" v-on:click="sets[i.key]=false"></i></p>
							<div v-show="sets[i.key]==false">
								<Input type="text" label="" :alt="true" placeholder="Enter your username" v-on:change="(v)=>setIntegrationValue(v, i.key)" :value="(values.integrations[i.key]) ? values.integrations[i.key] : ''" /><button class="small" v-on:click="setIntegration(i.key)">Link</button>
							</div>
						</li>
					</ul>
				</div>
				<div v-show="state=='submitting'">
					<div class="loading">
						<i class="dc-spinner animate-spin"></i>
						<p>Hold on for a couple of seconds while we build your profile</p>
					</div>
				</div>
				<div class="form-footer" align="right" v-show="state!='submitting'">
					<button class="bordered" v-show="canGoBack" v-on:click="previousForm" style="float:left;">Back</button>
					<button class="" v-on:click="finish" v-if="state=='integration'">Finish</button>
					<button class="" v-on:click="nextForm" v-else>Next</button>
				</div>
			</div>
		</section>
	</section>
</template>

<script>
	import Select from '@/components/sub/Select'
	import Title from '@/components/sub/Title'
	import Input from '@/components/sub/Input'
	import store from '@/store'
	import Bus from '@/Bus'
	export default {
		name: 'CompleteProfile',
		data() { 
			return { name: 'John', showWelcomeMessage: true, state: 'role', showRoleError: false, 
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
				sets: { li_username: false, git_username: false, behance_username: false, dribbble_username: false }
			}
		},
		components: { Select, Title, Input },
		methods: {
			nextForm() {
				console.log(this.values.integrations);
				if(this.state == 'role') { 
					if(this.values.preferredRole.length > 0 && this.showRoleError != true){
						this.state = 'otherRoles';
						this.canGoBack = true; 
					}else { this.showRoleError = true }
				}else if(this.state == 'otherRoles' && this.showOtherRoleError != true) {
					this.state = 'langSkills';
					this.canGoBack = true; 
				}else if(this.state == 'langSkills' && this.showLangSkillsError != true) {
					if(this.values.langSkills.length < 1) { this.showLangSkillsError = true; return; }
					this.state = 'employment';
					this.canGoBack = true; 
				}else if(this.state == 'employment' && this.showEmploymentError != true) {
					if(this.values.employment == "") { this.showEmploymentError = true; return; }
					this.state = 'integration';
					this.canGoBack = true; 
				}else if(this.state == 'integration' && this.showIntegrationError != true) {
					var errors = 0;
					if(!this.values.integrations["li_username"]){ errors++; } 
					if(!this.values.integrations["git_username"]){ errors++; } 
					if(!this.values.integrations["behance_username"]){ errors++; } 
					if(!this.values.integrations["dribbble_username"]){ errors++; } 
					console.log(errors);
					if(errors == 4) { this.showIntegrationError = true; return; }
					else { this.state = 'submitting'; }
				}
				this.saveState();
			},
			previousForm() {
				if(this.state == 'otherRoles') {
					this.canGoBack = false;
					this.state = 'role';
				}else if(this.state == 'langSkills') {
					this.state = 'otherRoles';
				}else if(this.state == 'employment') {
					this.state = 'langSkills'
				}else if(this.state == 'integration') {
					this.state = 'employment'
				}
			},
			finish() {
				this.nextForm();
				if(this.state == 'submitting') {
					this.saveState();
					this.saveRoles();
				}
			},
			setCoreRole: function(value) {
				if(value!=="") { this.showRoleError = false; }else { this.showRoleError=true; }
				this.values.preferredRole[0] = {value: value};
			},
			setOtherRoles: function(value, id) { 
				var fields = this.values.roles.concat(this.values.preferredRole);
				this.showOtherRoleError=false;
				for(var i=0;i<fields.length;i++) { if(fields[i].value == value) { this.otherRoleError="* You've already selected that role"; this.showOtherRoleError=true; }}
				this.values.roles[parseInt(id) - 1] = { value: value };
			},
			deleteRole(id) {
				delete this.values.roles[parseInt(id) - 1];
				this.moreRoles--;
				this.saveState();
			},
			setLangSkills: function(value, id) { 
				if(value!=="") { this.showLangSkillsError = false; }else { this.showLangSkillsError=true; return; }
				var field = this.values.langSkills[parseInt(id)-1]; 
				var all = this.values.langSkills;
				this.showLangSkillsError=false;
				for(var i=0;i<all.length;i++) { if(all[i].value == value) { this.langSkillsError="* You've already selected that skill"; this.showLangSkillsError=true; }}
				(field) ? field.value = value : field = { value: value, experience: "0 - 2 years"}; 
				this.values.langSkills[parseInt(id)-1] = field;
			},
			setLangSkillsYears: function(value, id) { 
				var field = this.values.langSkills[parseInt(id)-1];
				if(field) {
					field.experience = value;
				}else {
					this.showLangSkillsError=true;
					this.langSkillsError="* Please select a skill first";
					return;
				} 
				this.values.langSkills[parseInt(id)-1] = field;
			},
			deleteSkills(id) {
				delete this.values.langSkills[parseInt(id) -1];
				this.moreSkill--;
				this.saveState();
			},
			setEmployment: function(value) {
				if(value!=="") { this.showEmploymentError = false; }else { this.showEmploymentError=true; return; }
				this.values.employment = value;
			},
			setIntegration: function(key) {
				if(this.values.integrations[key].match(/^[a-z_.A-Z0-9\-]+$/)) {
					this.sets[key]=true;
					this.showIntegrationError = false;
				}else { this.showIntegrationError = true, this.integrationError = "Username is invalid, please try again!" }
			},
			setIntegrationValue: function(value, key) {
				this.values.integrations[key] = value;
				this.saveState();
			},
			addMoreRoles: function() {
				if(this.moreRoles > 10) { this.otherRoleError = "* You can't add more than 3 more roles"; this.showOtherRoleError = true; }
				else { this.moreRoles = this.moreRoles+1; }
			},
			addMoreSkill: function() {
				if(this.moreSkill < 10) { this.moreSkill = this.moreSkill+1; }
				else {
					this.showLangSkillsError = true;
					this.langSkillsError = "* You can't add more than 10 skill and languages"
				}
			},
			saveState() {
				localStorage.setItem("profile_completion_state", this.state);
				localStorage.setItem("profile_data", JSON.stringify({moreRoles: this.moreRoles, values: this.values, moreSkill: this.moreSkill}));
				if(this.state == "submitting") { 
					localStorage.removeItem("profile_completion_state");
					localStorage.removeItem("profile_data");
				}
			},
			saveRoles() {
				let self = this;
				store.dispatch('getSession').then(session => {
					this.$http.post(store.state.api.development+"profile/roles_and_skills/save", { "roles_and_skills_languages": this.values.langSkills, "roles_and_skills_roles" : this.values.roles }, 
						{ headers: { 'Authorization': session.token }}).then(res => {
							self.saveWorkPrefs();
					}).catch(err => { console.log(err, session); });
				});
			},
			saveWorkPrefs() {
				let self = this;
				store.dispatch('getSession').then(session => {
					let param = { "work_preference_preferred_roles": this.values.preferredRole }
					param[self.values.employment] = true;
					console.log(param);
					this.$http.post(store.state.api.development+"profile/work-preference/save", param, 
						{ headers: { 'Authorization': session.token }}).then(res => {
							self.updateProfile();
					}).catch(err => { console.log(err, session); });
				});
			},
			updateProfile() {
				let self = this;
				store.dispatch('getSession').then(session => {
					this.$http.post(store.state.api.development+"profile/update", this.values.integrations, 
						{ headers: { 'Authorization': session.token }}).then(res => {
							self.$http.get(store.state.api.development+"profile/get",  { 
								headers: { 'Authorization': session.token }
							}).then(res => {
								store.commit("saveProfile", res.body.extras);
								self.$router.push('/profile/'+session.user.username);
							}).catch(err => {
								console.log(err);
							});
					}).catch(err => { console.log(err, session); });
				});
			}
		},
		watch: {
			values: function(value) {
				console.log(value);
			}
		},
		created() {
			if(localStorage.getItem("profile_data")) {
				var data = JSON.parse(localStorage.getItem("profile_data"));
				this.values = data.values;
				this.moreSkill = data.moreSkill;
				this.moreRoles = data.moreRoles;
			}
		},
		mounted() {
			store.dispatch('getSession').then(session => {
				if(session == null) this.$router.push("/")
					else {
						Bus.$emit("Header_showAccount", true);
						if(localStorage.getItem("profile_completion_state")) {
							this.state = localStorage.getItem("profile_completion_state");
							if(this.state != 'role') { this.canGoBack = true; }
							this.showWelcomeMessage = false;
						}
						this.name = session.user.first_name;
					}
			});
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
		}
	}

</script>