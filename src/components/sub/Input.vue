<template>
	<div class="input">
		<label>{{ label }}</label>
		<div :class="{ active: showAlert }" class="alert">{{ alert }}</div>
		<input :type="type" :class="{ alt: alt }" class="bar email" :placeholder="placeholder" v-on:click="clear" v-model="value" v-on:input="change">
	</div>
</template>

<script>
	export default {
		name: 'Input',
		data() { return { value: '' }},
		props: { 
			label: { type: String, default: 'Label default' },
			alert: { type: String, default: '* hello world' }, 
			type: { type: String, default: 'text' }, 
			alt: { type: Boolean, default: false },
			placeholder: { type: String, default: 'Default placeholder' },
			showAlert: { type: Boolean, default: false }
		},
		methods: {
			clear() { this.$emit("clear"); },
			change() { this.$emit("change", this.value) }
		}
	}
</script>