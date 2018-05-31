<template>
	<div class="profile-view">
		<div class="box">
			<div class="profile-photo">
				<img :src="placeholder" alt="placeholder" />
				<div class="cover" v-on:click="changePhoto"><span>Change your profile picture</span></div>
			</div>
			<div class="personal-pane">
				<h1>{{ fullname }} <a href="#" class="clear" v-on:click.prevent="showRolesModal=!showRolesModal">Edit</a></h1>
				<p>I'm a <span>{{ role }}</span> developer with experience in <span>{{ otherRole[0] }}</span> development</p> 
				<div class="integration">
					<a href="#"><i class="dc-linkedin"></i></a>
					<a href="#"><i class="dc-github"></i></a>
				</div>
			</div>
			<div class="language-pane">
				<h2>Language and Skills <a href="#" class="clear">Edit</a></h2>
				<div class="taggered"><div class="title">Python</div><span></span><div class="counter">15+ years</div></div>
				<div class="taggered"><div class="title">Ruby</div><span></span><div class="counter">10 - 15 years</div></div>
			</div>
			<div class="employment-pane">
				<h2>Employment <a href="#" class="clear">Edit</a></h2>
				<p>Freelancer</p>
			</div>
		</div>
		<Modal title="Roles and Integrations" :show="showRolesModalAlt" :sticky="!showRolesModalAlt" :onclose="rolesModalClose">
			<div slot="body">
				<div class="roles">
					<Title label="What is your core Role?" :showAlert="showRoleError" alert="* Please select at least one role" />
					<ul class="grid grid-2">
						<li><Select name="core-role" :options="roles" v-on:change="setCoreRole" label="" :alt="true" /></li>
						<li>&nbsp;</li>
					</ul>
				</div>
				<div class="roles-others">
					<Title label="What other roles best describer you?" :showAlert="showOtherRoleError" :alert="otherRoleError" />
					<ul class="grid grid-2 other-roles" :style="'position:relative;z-index:'+(106-i)+';'" v-for="i in moreRoles">
						<li><Select :name="'other-role-'+i" :options="roles" v-on:change="(v) => setOtherRoles(v, i)" label="" :alt="true"  /></li>
						<li>&nbsp;</li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreRoles" class="add-more-roles-btn">+ Add a Role</a>
				</div>
				<div class="integration">
					<Title label="Link your accounts so we can know more about you" :showAlert="showIntegrationError" :alert="integrationError" />
					<ul class="grid grid-2" v-for="i in integrations">
						<li><div class="name"><i :class="i.icon"></i> {{ i.title }}</div></li>
						<li><Input type="text" label="" :alt="true" placeholder="Enter your link" v-on:change="(v)=>setIntegrationValue(v, i)" /><button class="small" v-on:click="setIntegration(i.key)">Link</button></li>
					</ul>
				</div>
			</div>
			<div slot="footer">
				<button class="long">Save</button>
			</div>
		</Modal>
		<Modal title="Language and Skills" :show="showRolesModal" :sticky="!showRolesModal" :onclose="rolesModalClose">
			<div slot="body">
				<div class="languages">
					<Title label="What language, frameworks or skills do you know?" :showAlert="showLangSkillsError" :alert="langSkillsError" />
					<ul class="grid grid-2 langs" :style="'position:relative;z-index:'+(200-i)+';'" v-for="i in moreSkill">
						<li><Select :name="'lang-skills-'+i" :options="skills" v-on:change="(v) => setLangSkills(v, i)" label="" :alt="true"  /></li>
						<li class="alt"><Select :name="'lang-skills-year-'+i" :options="years" v-on:change="(v) => setLangSkillsYears(v, i)" label=""  /></li>
					</ul>
					<a href="#" v-on:click.prevent="addMoreSkill" class="add-more-roles-btn">+ Add a language, framework or skill</a>
				</div>
			</div>
			<div slot="footer">
				<button class="long">Save</button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Modal from '@/components/sub/Modal'
	import Title from '@/components/sub/Title'
	import Select from '@/components/sub/Select'
	import Input from '@/components/sub/Input'
	export default {
		name: 'ViewProfile', 
		components: { Modal, Title, Select, Input },
		data() { return {
			moreRoles : 1,
			fullname: "John Doe", hasOtherRole: false, role: "Backened", otherRole: ["Frontend"],
			howRoleError: false, 
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
			showIntegrationError: false, integrationError: "* Please link at least one of your accounts",
			showRolesModal: false, 
			languages: [
				{ name: "Python", experience: "15+ years" }
			],
			employment_status: "Freelance",
			placeholder : require("../assets/img/placeholder.svg")
		}},
		methods: {
			changePhoto() {
				console.log("preparing to change photo")
			},
			rolesModalClose() {
				this.showRolesModal = false;
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
		}
	}

</script>