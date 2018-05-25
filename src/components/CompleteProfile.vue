<template>
	
	<section class="complete-profile">
		<div class="box welcome-message" v-show="showWelcomeMessage">
			<h1>Hi {{ name }},</h1>
			<p>Once again welcome to Devcenter's Talent Pool.</p>
			<p>We've pre-filled your profile with the details you provided to use while being screened.</p>
			<p>The next step is to tell us a bit more about what you do so that we can match you to projects you are best suited for. We don't want you missing out on great gigs.</p>
			<div class="buttons">
				<button class="clear">Skip for now</button> <button v-on:click="showWelcomeMessage=!showWelcomeMessage">Get Started</button>
			</div>
		</div>

		<section class="invert" v-show="!showWelcomeMessage">
			<div class="box process-stager">
				<ul class="grid grid-4">
					<li class="stage active"><div class="counter"><span v-if="state=='role'||state=='otherRoles'">1</span><i class="dc-tick" v-else></i></div><div>Role</div></li>
					<li :class="{active: state!='role'&&state!='otherRoles'}" class="stage"><div class="counter">2</div><div>Languages and Skills</div></li>
					<li class="stage"><div class="counter">3</div><div>Employment Status</div></li>
					<li class="stage"><div class="counter">4</div><div>Integrations</div></li>
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
					<ul class="grid grid-2 other-roles" style="position:relative;z-index:102;">
						<li><Select name="other-role-1" :options="roles" v-on:change="(v) => setOtherRoles(v, 1)" label="" :alt="true"  /></li>
						<li>&nbsp;</li>
					</ul>
					<ul class="grid grid-2 other-roles" v-show="moreRoles==2 || moreRoles==3" style="position:relative;z-index:101;">
						<li><Select name="other-role-2" :options="roles" v-on:change="(v) => setOtherRoles(v, 2)" label="" :alt="true"  /></li>
						<li>&nbsp;</li>
					</ul>
					<ul class="grid grid-2 other-roles" v-show="moreRoles==3">
						<li><Select name="other-role-3" :options="roles" v-on:change="(v) => setOtherRoles(v, 3)" label="" :alt="true"  /></li>
						<li>&nbsp;</li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreRoles" class="add-more-roles-btn">+ Add a Role</a>
				</div>
				<div v-show="state=='langSkills'" class="forms">
					<Title label="What language, frameworks or skills do you know?" :showAlert="showLangSkillsError" :alert="langSkillsError" />
					<ul class="grid grid-2 other-roles" style="position:relative;z-index:105;">
						<li><Select name="lang-skills-1" :options="skills" v-on:change="(v) => setLangSkills(v, 1)" label="" :alt="true"  /></li>
						<li class="alt"><Select name="lang-skills-year-1" :options="years" v-on:change="(v) => setLangSkillsYears(v, 1)" label=""  /></li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreRoles" class="add-more-roles-btn">+ Add a language, framework or skill</a>
				</div>
				<div class="form-footer" align="right">
					<button class="bordered" v-show="canGoBack" v-on:click="previousForm" style="float:left;">Back</button>
					<button class="long" v-on:click="nextForm">Next</button>
				</div>
			</div>
		</section>
	</section>
</template>

<script>
	import Select from '@/components/sub/Select'
	import Title from '@/components/sub/Title'
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
				moreRoles: 1, showOtherRoleError: false, otherRoleError: '', canGoBack: false,
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
				showLangSkillsError: false, langSkillsError: '* Please select at least one language, framework or skill',
				values: { coreRole: '', otherRoles: [], langSkills: [], employment: '', integrations: [] }
			}
		},
		components: { Select, Title },
		methods: {
			nextForm() {
				if(this.state == 'role') { 
					if(this.coreRole != ''){
						this.state = 'otherRoles';
						this.canGoBack = true; 
					}else { this.showRoleError = true }
				}else if(this.state == 'otherRoles') {
					this.state = 'langSkills';
				}
			},
			previousForm() {
				if(this.state == 'otherRoles') {
					this.canGoBack = false;
					this.state = 'role';
				}else if(this.state == 'langSkills') {
					this.state = 'otherRoles';
				}
			},
			setCoreRole: function(value) {
				if(value!=="") { this.showRoleError = false; }else { this.showRoleError=true; }
				this.values.coreRole = value;
			},
			setOtherRoles: function(value, id) { this.values.otherRoles[parseInt(id)-1] = value; },
			setLangSkills: function(value, id) { 
				var field = this.values.langSkills[parseInt(id)-1];
				(field) ? field.skill = value : field = { skill: value}; 
				this.values.langSkills[parseInt(id)-1] = field;
			},
			setLangSkillsYears: function(value, id) { 
				var field = this.values.langSkills[parseInt(id)-1];
				(field) ? field.years = value : field = { years: value}; 
				this.values.langSkills[parseInt(id)-1] = field;
			},
			addMoreRoles: function() {
				if(this.moreRoles > 2) { this.otherRoleError = "* You can't add more than 3 more roles"; this.showOtherRoleError = true; }
				else { this.moreRoles = this.moreRoles+1; }
			}
		}
	}

</script>