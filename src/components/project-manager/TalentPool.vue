<template>
	<div class="container talent-pool">
		<ul class="grid grid-4 field-pane">
			<li class="field"><InputDrop label="" name="role-input-drop" placeholder="Enter a Role" :options="roles" v-on:change="filterRoles" /></li>
			<li class="field"><InputDrop label="" name="languages-input-drop" placeholder="Enter a Language" :options="languages" v-on:change="filterLanguages" /></li>
			<li class="field"><Select name="employment" :options="[
				{ title: 'Contract', value: 'contract' },
				{ title: 'Employed (Full-time)', value: 'employed' },
				{ title: 'Freelancer', value: 'freelancer' },
				{ title: 'Unemployed', value: 'unemployed' },
			]" label="" /></li>
			<li class="field"><button class="bar">Search</button></li>
		</ul>
		<hr />
		<div class="card-pane">
			<div class="box talent-profile-card" v-for="placeholder in placeholders">
				<div class="profile-photo"><img :src="placeholder.photo" alt="placeholder" /></div>
				<div class="profile-details">
					<h3>{{ placeholder.name }}</h3>
					<p>{{ placeholder.stack }}</p>
				</div>
				<i class="dc-menu-h dropdown-menu talent-dropdown-anchor" v-on:click="(e) => { showDropMenu(e) }">
					<transition name="account-drop">
						<ul class="dropdown talent-dropdown" style="display:none">
							<li v-for="menu in [
									{ title: 'Project History', action: () => { showProjectHistoryModal=true; setModalTitle('project-history-modal', placeholder.name+'\'s Project History'); } },
									{ title: 'View Profile', action: () => { showProfileModal=true; } },
									{ title: 'Earnings', action: () => { showEarningsModal=true; setModalTitle('earnings-modal', placeholder.name+'\'s Earnings'); } }				
								]"><a href="#" v-on:click.prevent="menu.action">{{ menu.title }}</a></li>
						</ul>
					</transition>
				</i>
			</div>
		</div>
		<Modal title="Project History Modal" :sticky="true" :show="showProjectHistoryModal" :onclose="() => { showProjectHistoryModal=false }">
			<div slot="body">
				<div class="box project-box" v-for="i in 4">
					<ul class="grid grid-2 separator project">
						<li>
							<h1>Travel Mall <span class="badge" :class="{ success: i<2, default: i==3, danger: i==4}">COMPLETED</span></h1>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
							quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
							consequat. </p>
						</li>
						<li>
							<div class="label">Cost</div>
							<div class="value">NGN 330,000</div><br/>
							<div class="label">Due Date</div>
							<div class="value">24th Aug 2018</div><br/>
						</li>
					</ul>
				</div>
			</div>
		</Modal>
		<Modal title="Profile Modal" :plain="true" :sticky="false" :show="showProfileModal" :onclose="() => { showProfileModal=false }">
			<div slot="body">
				<i class="dc-cancel close" v-on:click="showProfileModal=false"></i>
				<div class="profile-photo">
					<img src="../../assets/img/avatar.svg" alt="photo" />
				</div>
				<div class="personal-pane">
					<h1>John Doe</h1>
					<p>I'm a Backend developer with experience in Frontend and Mobile development</p> 
					<div class="integration">
						<a href="https://linkedin.com/in/user.li_username" target="_new"><i class="dc-linkedin"></i></a>
						<a href="https://github.com/user.git_username" target="_new"><i class="dc-github"></i></a>
						<a href="https://dribbble.com/user.dribbble_username" target="_new"><i class="dc-dribbble"></i></a>
						<a href="https://behance.net/user.behance_username" target="_new"><i class="dc-behance"></i></a>
					</div>
				</div>
				<div class="language-pane">
					<h2>Language and Skills</h2>
					<div class="taggered" v-for="role in [
						{ value: 'Python', experience: '15+ years' },
						{ value: 'Ruby', experience: '10 - 15 years' }
					]"><div class="title">{{ role.value }}</div><span></span><div class="counter">{{ role.experience }}</div></div>
				</div>
				<div class="employment-pane">
					<h2>Employment</h2>
					<p>Unemployed</p>
				</div>
				<div class="rank-pane">
					<h2>Rank and Rating</h2>
					<ul class="rank grid grid-2">
						<li><div>Current rating</div><h1>60</h1></li>
						<li><div>Current rank</div><h1>Level 1</h1></li>
					</ul>
					<ul class="rating grid grid-2">
						<li v-for="i in 2">
							<div class="ratings">
								<div class="title">Attitude <span>15/75</span></div>
								<div class="bar">
									<span v-for="i in 15" :class="{ active: (i <= (15/75)*15) }"></span>
								</div>
							</div>
						</li>
					</ul>
					<ul class="rating grid grid-2">
						<li v-for="i in 2">
							<div class="ratings">
								<div class="title">Attitude <span>15/75</span></div>
								<div class="bar">
									<span v-for="i in 15" :class="{ active: (i <= (15/75)*15) }"></span>
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
			], activeDropDown: null, selectedTalentName: 'Jossy', showProjectHistoryModal: false, showProfileModal: false, showEarningsModal: false, showProfileEarningsModal: false 
		} },
		methods: {
			filterRoles: function(v) {
				var all = [ 'Android Developer', 'Backend Developer', 'Frontend Developer', 'iOS Developer', 'Mobile Developer', 'UI Designer', 'UX Researcher', 'UX Designer', 'UX/UI Designer' ];
				this.roles = all.filter((t) => { return t.toLowerCase().match(v.toLowerCase()); });
			},
			filterLanguages: function(v) {
				var all = ["Adobe XD", "Angular JS", "Bootstrap", "C++", "CSS", "Django", "Electron JS", "GO", "HTML"];
				this.languages = all.filter((t) => { return t.toLowerCase().match(v.toLowerCase()); });
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
			setModalTitle(id, title) {
				$("#"+id).$(".header").innerHTML = title;
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
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>