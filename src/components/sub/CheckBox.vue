<template>
	<div :class="{ small: small }" class="checkbox" v-on:click="finalCheck=!finalCheck">
		<i class="dc-tick-2" v-show="finalCheck"></i>
	</div>
</template>

<script>
	export default {
		name: 'CheckBox',
		data() { return { finalCheck: this.checked }},
		props: { checked: false, small: false },
		watch: {
			finalCheck(value) {
				this.$emit("change", value);
			},
			checked(value) { this.finalCheck = value; }
		}
	}
</script>