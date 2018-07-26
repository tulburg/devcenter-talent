<template>
	<div class="box project-view">
		<h1>{{ data.title }} <span :class="'badge '+data.badgeStatus" v-if="data.badgeText">{{ data.badgeText }}</span> <i class="dc-menu-h dropdown-menu project-dropdown-anchor">
			<transition name="account-drop">
				<ul class="dropdown project-dropdown" v-show="showDropMenu">
					<li v-for="menu in menus"><a href="#" v-on:click.prevent="menu.action">{{ menu.title }}</a></li>
				</ul>
			</transition>
		</i></h1>
		<ul class="grid grid-2 separator project">
			<li>
				<p>{{ data.description }}</p>
			</li>
			<li>
				<div class="label">Cost</div>
				<div class="value">NGN {{ data.cost }}</div>
				<div class="label">Assigned by</div>
				<div class="value">{{ data.assigner }}</div>
				<div class="label" v-if="data.due">Due Date</div>
				<div class="value" v-if="data.due">{{ data.due }}</div>
				<div class="label" v-if="data.closed">Closed on</div>
				<div class="value" v-if="data.closed">{{ data.closed }}</div>
			</li>
		</ul>
		<div class="details">
			<div class="label" v-if="data.category">Category</div>
			<div class="value alt" v-if="data.category">{{ data.category.join(", ") }}</div>
			<div class="label" v-if="data.platform">Platforms</div>
			<div class="value alt" v-if="data.platform">{{ data.platform.join(", ") }}</div>
			<div class="label" v-if="data.stacks">Stack/Skills</div>
			<div class="value alt" v-if="data.stacks">{{ data.stacks.join(", ") }}</div>
			<div class="label" v-if="data.deadline">Deadline for Brief</div>
			<div class="value" v-if="data.deadline">{{ data.deadline }}</div>
			<div class="label" v-if="data.assigned_to">Assigned to</div>
			<div class="value" v-if="data.assigned_to">{{ data.assigned_to }}</div>
			<div class="label" v-if="data.shared_with">Shared with</div>
			<div class="value" v-if="data.shared_with">{{ data.shared_with.join(", ") }}</div>
		</div>
		<div class="fab-holder">
			<div :class="{ active: fabOpen }" class="actions">
				<a href="#" v-for="action in actions" v-on:click.prevent="action.action">{{ action.title }}</a>
			</div>
			<div :class="{ active: fabOpen }" class="fab" v-on:click="fabOpen=!fabOpen"><i class="dc-plus"></i></div>
		</div>
	</div>
</template>


<script>
	export default {
		name: 'ProjectView',
		props: { data: {
			type: Object, default() { return {
				title: 'Riby',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
				badgeStatus: 'default',
				badgeText: '',
				cost: '300, 000',
				assigner: 'Seun Smith',
				due: '24th Aug 2018',
				closed: '24th Aug 2018',
				milestone: 'http://google.com'
			}}
		}, actions: { type: Array, default() { return [
			{ title: "Default Action", action: function() { console.error("Please replace defualt action on fab"); } }
		]}},
			menus: { type: Array, default() { return [
			{ title: "Default Menu", action: function() { console.error("Please replace default menu on dropdown"); } }	
		]}}},
		data() { return { fabOpen: false, showDropMenu: false } },
		mounted() {
			var self = this;
			document.addEventListener("click", function(e) { 
				if(self.showDropMenu) self.showDropMenu = false;
				else if(e.target.className.match("project-dropdown-anchor") || e.target.className.match("project-dropdown")) self.showDropMenu = true;
			});
		}
	}
</script>