<template>
	
	<section class="complete-profile">
		<div class="box welcome-message" v-show="showWelcomeMessage">
			<h1>Hi {{ name }},</h1>
			<p>Once again welcome to Devcenter's Talent Pool.</p>
			<p>We've pre-filled your profile with the details you provided to use while being screened.</p>
			<p>The next step is to tell us a bit more about what you do so that we can match you to projects you are best suited for. We don't want you missing out on great gigs.</p>
			<div class="buttons">
				<router-link to="/profile" class="button clear">Skip for now</router-link> <button v-on:click="showWelcomeMessage=!showWelcomeMessage">Get Started</button>
			</div>
		</div>

		<section class="invert" v-show="!showWelcomeMessage">
			<div class="box process-stager">
				<ul class="grid grid-4">
					<li class="stage active"><div class="counter"><span v-if="state=='role'||state=='otherRoles'">1</span><i class="dc-tick" v-else></i></div><div>Role</div></li>
					<li :class="{active: state!='role'&&state!='otherRoles'}" class="stage">
						<div class="counter"><span v-if="state!='employment'&&state!='integration'&&state!='submitting'">2</span><i class="dc-tick" v-else></i></div>
						<div>Languages and Skills</div>
					</li>
					<li :class="{active: state!='role'&&state!='otherRoles'&&state!='langSkills'}" class="stage">
						<div class="counter"><span v-if="state!='integration'&&state!='submitting'">3</span><i class="dc-tick" v-else></i></div>
						<div>Employment Status</div>
					</li>
					<li :class="{active: state=='integration'||state=='submitting'}" class="stage">
						<div class="counter"><span v-if="state!='submitting'">4</span><i class="dc-tick" v-else></i></div>
						<div>Integrations</div>
					</li>
				</ul>	
			</div>

			<div class="box process-form">
				<div v-show="state=='role'" class="forms">
					<Title label="What is your core Role?" :showAlert="showRoleError" alert="* Please select at least one role" />
					<ul class="grid grid-2">
						<li><Select name="core-role" :options="roles" v-on:change="setCoreRole" label="" :alt="true" /></li>
						<li>&nbsp;</li>
					</ul>
				</div>
				<div v-show="state=='otherRoles'" class="forms">
					<Title label="What other roles best describer you?" :showAlert="showOtherRoleError" :alert="otherRoleError" />
					<ul class="grid grid-2 other-roles" :style="'position:relative;z-index:'+(106-i)+';'" v-for="i in moreRoles">
						<li><Select :name="'other-role-'+i" :options="roles" v-on:change="(v) => setOtherRoles(v, i)" label="" :alt="true"  /></li>
						<li>&nbsp;</li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreRoles" class="add-more-roles-btn">+ Add a Role</a>
				</div>
				<div v-show="state=='langSkills'" class="forms">
					<Title label="What language, frameworks or skills do you know?" :showAlert="showLangSkillsError" :alert="langSkillsError" />
					<ul class="grid grid-2 other-roles" :style="'position:relative;z-index:'+(200-i)+';'" v-for="i in moreSkill">
						<li><Select :name="'lang-skills-'+i" :options="skills" v-on:change="(v) => setLangSkills(v, i)" label="" :alt="true"  /></li>
						<li class="alt"><Select :name="'lang-skills-year-'+i" :options="years" v-on:change="(v) => setLangSkillsYears(v, i)" label=""  /></li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreSkill" class="add-more-roles-btn">+ Add a language, framework or skill</a>
				</div>
				<div v-show="state=='employment'" class="forms">
					<Title label="What is your current employment status?" :showAlert="showEmploymentError" :alert="employmentError" />
					<ul class="grid grid-2">
						<li><Select name="employment-status" :options="employment" v-on:change="setEmployment" label="" :alt="true"  /></li>
						<li>&nbsp;</li>
					</ul>
				</div> 
				<div v-show="state=='integration'" class="forms integrations">
					<Title label="Link your accounts so we can know more about you" :showAlert="showIntegrationError" :alert="integrationError" />
					<ul class="grid grid-2" v-for="i in integrations">
						<li><div class="name"><i :class="i.icon"></i> {{ i.title }}</div></li>
						<li><Input type="text" label="" :alt="true" placeholder="Enter your link" v-on:change="(v)=>setIntegrationValue(v, i)" /><button class="small" v-on:click="setIntegration(i.key)">Link</button></li>
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
					<button class="long" v-on:click="finish" v-if="state=='integration'">Finish</button>
					<button class="long" v-on:click="nextForm" v-else>Next</button>
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
					{ value: "android_dev", title: "Android Developer" },
					{ value: "backend_dev", title: "Backend Developer" },
					{ value: "frontend_dev", title: "Frontend Developer" },
					{ value: "ios_dev", title: "IOS Developer" },
					{ value: "mobile_dev", title: "Mobile Developer" },
					{ value: "ui_designer", title: "UI Designer" },
					{ value: "ux_researcher", title: "UX Researcher" },
					{ value: "ux_designer", title: "UX Designer" },
					{ value: "ui_ux_designer", title: "UI/UX Designer" }
				],
				moreRoles: 1, moreSkill: 1, showOtherRoleError: false, otherRoleError: '', canGoBack: false,
				skills: [
					{ value: "", title: "Select one" },
					{ value: "adobe_xd", title: "Adobe XD" },
					{ value: "angular_js", title: "Angular JS" },
					{ value: "bootstrap", title: "Bootstrap" },
					{ value: "c++", title: "C++" },
					{ value: "css", title: "CSS" },
					{ value: "django", title: "Django" },
					{ value: "electron_js", title: "Electron JS" },
					{ value: "go", title: "GO" },
					{ value: "html", title: "HTML"}
				],
				years: [
					{ value: "0_2", title: "0 - 2 years" },
					{ value: "2_5", title: "2 - 5 years" },
					{ value: "5_10", title: "5 - 10 years" },
					{ value: "10_20", title: "10 - 20 years" }
				],
				employment: [
					{ value: "", title: "Select a status" },
					{ value: "contract", title: "Contract" },
					{ value: "employed", title: "Employed (Full-time)" },
					{ value: "freelancer", title: "Freelancer" },
					{ value: "unemployed", title: "Unemployed" }
				],
				integrations: [
					{ icon: "dc-linkedin", title: "LinkedIn", key: "linkedin" },
					{ icon: "dc-github", title: "Github", key: "github" },
					{ icon: "dc-behance", title: "Behance", key: "behance" },
					{ icon: "dc-dribbble", title: "Dribbble", key: "dribbble" }
				],
				showLangSkillsError: false, langSkillsError: '* Please select at least one language, framework or skill',
				values: { preferredRole: [], roles: [], langSkills: [], employment: '', integrations: [] },
				showEmploymentError: false, employmentError: "* Please let us know your employment status",
				showIntegrationError: false, integrationError: "* Please link at least one of your accounts"
			}
		},
		components: { Select, Title, Input },
		methods: {
			nextForm() {
				if(this.state == 'role') { 
					if(this.values.coreRole != ''){
						this.state = 'otherRoles';
						this.canGoBack = true; 
					}else { this.showRoleError = true }
				}else if(this.state == 'otherRoles' && this.showOtherRoleError != true) {
					this.state = 'langSkills';
				}else if(this.state == 'langSkills' && this.showLangSkillsError != true) {
					if(this.values.langSkills.length < 1) { this.showLangSkillsError = true; return; }
					this.state = 'employment';
				}else if(this.state == 'employment' && this.showEmploymentError != true) {
					if(this.values.employment == "") { this.showEmploymentError = true; return; }
					this.state = 'integration';
				}else if(this.state == 'integration' && this.showIntegrationError != true) {
					if(this.values.integrations.length < 1) { this.showIntegrationError = true; return; }
					this.state = 'submitting';
				}
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
			},
			setCoreRole: function(value) {
				if(value!=="") { this.showRoleError = false; }else { this.showRoleError=true; }
				this.values.preferredRole[0] = {value: value};
			},
			setOtherRoles: function(value, id) { 
				var fields = this.values.roles.concat(this.values.preferredRole);
				this.showOtherRoleError=false;
				for(var i=0;i<fields.length;i++) { if(fields[i].value == value) { this.otherRoleError="* You've already selected that role"; this.showOtherRoleError=true; return; }}
				this.values.roles.push({ value: value});
			},
			setLangSkills: function(value, id) { 
				if(value!=="") { this.showLangSkillsError = false; }else { this.showLangSkillsError=true; return; }
				var field = this.values.langSkills[parseInt(id)-1]; 
				var all = this.values.langSkills;
				this.showLangSkillsError=false;
				for(var i=0;i<all.length;i++) { if(all[i].value == value) { this.langSkillsError="* You've already selected that skill"; this.showLangSkillsError=true; return; }}
				(field) ? field.value = value : field = { value: value}; 
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
			setIntegration: function() {

			},
			setIntegrationValue: function() {

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
			}
		},
		mounted() {
			Bus.$emit("Header_showAccount", true);
			store.dispatch('getSession').then(session => {
				if(session == null) this.$router.push("/")
					else {

					}
			});
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
		}
	}

</script>