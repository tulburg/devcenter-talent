<template>
	<div class="container talent-pool">
		<ul class="grid grid-4 field-pane">
			<li><InputDrop label="" placeholder="Enter a Role" :options="roles" v-on:change="filterRoles" /></li>
			<li><Select name="language" :options="[{ title: 'Android Developer', value: '' }, { title: 'Backend Developer', value: 1}]" label="" /></li>
			<li><Select name="employment" :options="[{ title: 'Android Developer', value: '' }, { title: 'Backend Developer', value: 1}]" label="" /></li>
			<li><button>Search</button></li>
		</ul>
	</div>
</template>

<script>
	import Bus from '@/Bus'
	import store from '@/store'
	import Input from '@/components/sub/Input'
	import InputDrop from '@/components/sub/InputDrop'
	import Select from '@/components/sub/Select'

	export default {
		name: 'TalentPool',
		components: { Input, InputDrop, Select },
		data() { return { roles: [] } },
		methods: {
			filterRoles: function(v) {
				console.log(v);
				var all = [ 'Android Developer', 'Backend Developer', 'Frontend Developer', 'iOS Developer', 'Mobile Developer', 'UI Designer', 'UX Researcher', 'UX Designer', 'UX/UI Designer' ];
				this.roles = all.filter((t) => { return t.toLowerCase().match(v.toLowerCase()); });
				console.log("filtered", this.roles);
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
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showPMLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>