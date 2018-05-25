<template>
	<div class="title">
		<div class="label">{{ label }}</div>
		<div :class="{ active: showAlert }" class="alert">{{ alert }}</div>
	</div>
</template>

<script>
	export default {
		name: "Title",
		props: {
			alert: { default: "* Default title alert", type: String },
			label: { default: "Default title label", type: String },
			showAlert: { default: false, type: Boolean }
		}
	}
</script>