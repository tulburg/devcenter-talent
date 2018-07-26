<template>
	<div class="container talent-pool-assigned">
		<div class="project-talents">
			<div class="left box">
				<h2>Refine by</h2>
				<div class="collapse-heading" v-on:click="toggleProjects">Projects <i :class="{ upward: openProjects }" class="dc-caret"></i></div>
				<ul class="collapse-body __projects-collapse">
					<li v-for="item in projects.map((p) => { return p.project_name })"><CheckBox :small="true" /> {{ item }}</li>
				</ul>
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
				<div class="box talent-profile-card" v-for="talent in talents">
					<div class="profile-photo"><img :src="talent.profile_image" alt="placeholder" /></div>
					<div class="profile-details">
						<h3>{{ talent.first_name+" "+talent.last_name }}</h3>
						<p>{{ (talent.preferred_roles.length > 0) ? talent.preferred_roles[0].value: '' }}, {{ talent.roles.slice(0, talent.roles.length - 1).map((a) => { return a.value }).join(", ")+" and "+((talent.roles.length > 0) ? talent.roles.slice(-1)[0].value : '')}}</p>
					</div>
					<i class="dc-menu-h dropdown-menu talent-dropdown-anchor" v-on:click="(e) => { showDropMenu(e) }">
						<transition name="account-drop">
							<ul class="dropdown talent-dropdown" style="display:none">
								<li v-for="menu in [
										{ title: 'Current Projects', action: () => { showCurrentProjectModal=true; setModalTitle('recent-project-modal', placeholder.name+'\'s Current Projects'); } },
										{ title: 'Project History', action: () => { showProjectHistoryModal=true; setModalTitle('project-history-modal', placeholder.name+'\'s Project History'); } },
										{ title: 'View Profile', action: () => { showProfileModal=true } },
										{ title: 'Earnings', action: () => { showEarningsModal=true; setModalTitle('earnings-modal', placeholder.name+'\'s Earnings'); } }				
									]"><a href="#" v-on:click.prevent="menu.action">{{ menu.title }}</a></li>
							</ul>
						</transition>
					</i>
				</div>
			</div>
			<Modal title="Recent Project Modal" :sticky="true" :show="showCurrentProjectModal" :onclose="() => { showCurrentProjectModal=false }">
				<div slot="body">
					<div class="box project-box" v-for="i in 2">
						<ul class="grid grid-2 separator project">
							<li>
								<h1>Travel Mall</h1>
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
	</div>
</template>

<script>
	import Bus from '@/Bus'
	import store from '@/store'
	import CheckBox from '@/components/sub/CheckBox'
	import Modal from '@/components/sub/Modal'
	import Input from '@/components/sub/Input'
	import Select from '@/components/sub/Select'

	export default {
		name: 'TalentPoolAssigned',
		components: { CheckBox, Modal, Input, Select },
		data() { return { openStacks: true, openRoles: true, openEmployment: true, openProjects: true, activeDropDown: null, showCurrentProjectModal: false,
			selectedTalentName: 'Joe', showProjectHistoryModal: false, showProfileModal: false, showEarningsModal: false, showProfileEarningsModal: false, talents: [],
			projects: [] } 
		},
		methods: {
			toggleProjects() {
				if(this.openProjects) {
					this.openProjects = false;
					$(".__projects-collapse").collapse();
				}else {
					this.openProjects = true;
					$(".__projects-collapse").expand();
				}
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
					var talents = [].push(session.projects.map((t) => { console.log(t.team_members); return t.team_members }));
					if(talents.length && talents.length > 0) self.talents = talents;
					self.projects = session.projects;
				}
			});
			var self = this;
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