<template>
	<section class="profile">

	</section>
</template>

<script>
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'Profile',
		data() {
			return {}
		},
		mounted: function() {
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_showGrayLogo", true);
		},
		destroyed: function() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}
</script>