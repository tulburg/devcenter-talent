<template>
	<div class="box" v-on:click="click">
		<ul class="grid grid-2 separator project">
			<li>
				<h1>{{ data.title }} <span :class="'badge '+data.badgeStatus" v-if="data.badgeText">{{ data.badgeText }}</span></h1>
				<p>{{ data.description }}</p>
			</li>
			<li>
				<div class="label">Cost</div>
				<div class="value">NGN {{ data.cost }}</div>
				<div class="label" v-if="data.type == 'talent'">Due Date</div>
				<div class="value" v-if="data.type == 'talent'">{{ data.due }}</div>
				<div class="label" v-if="data.type == 'pm'">Assigned by</div>
				<div class="value" v-if="data.type == 'pm'">{{ data.assigner }}</div>
				<a :href="data.milestone" target="_new" v-if="data.type == 'talent'">View Milestone <i class="dc-caret right"></i></a>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'Project',
		props: { data: { 
			type: Object, default() { return {
				type: 'pm', // pm, talent, admin
				title: 'Riby',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
				badgeStatus: 'default',
				badgeText: '',
				cost: '300, 000',
				assigner: 'Seun Smith',
				due: '24th Aug 2018',
				milestone: 'http://google.com'
			}} 
		}, click: { type: Function, default: function(){ console.error("OnClick function for project not set"); } }},
		data() { return {  } }
	}
</script>