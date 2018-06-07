<template>
	<div class="select">
		<label>{{ label }}</label>
		<div :class="{ active: showAlert }" class="alert">{{ alert }}</div>
		<select :class="{ alt: alt }" class="cs-select default" :id="name" :name="name">
			<option v-for="option in options" :value="option.value" v-if="option.value != selected">{{ option.title }}</option>
			<option v-for="option in options" :value="option.value" v-if="option.value == selected" selected>{{ option.title }}</option>
		</select>
	</div>
</template>

<script>
	import SelectFx from 'periodicjs.component.selectfx'
	export default {
		name: "Select",
		props : {
			name: { type: String, default: 'select' },
			label: { type: String, default: 'Default Label' },
			alert: { type: String, default: '* default alert' }, 
			options: { type: Array, default: [
				{ value: "default", title: "Default Option" }
			]},
			showAlert: { type: Boolean, default: false },
			alt: { type: Boolean, default: false },
			selected: { type: String, default: '' }
		},
		methods: {
			clear() { this.$emit("clear"); },
			setValue(value) { this.$emit("change", value); }
		},
		mounted() {
			var self = this;
			var mySelectFx = new SelectFx(document.querySelector("#"+self.name), {
				onChange: function(value) { self.clear(); self.setValue(value); }
			});
		}
	}
</script> 