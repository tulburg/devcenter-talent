<template>
	<div class="inputdrop" :id="name">
		<label v-if="label!=''">{{ label }}</label>
		<div class="wrapper">
			<span v-for="item in selected">{{ item }} <i class="dc-cancel" v-on:click="remove(item)"></i></span>
			<input type="text" class="bar __drop-input" :placeholder="placeholder" v-model="value" v-on:click="clear" v-on:input="change" autocomplete="off">
		</div>
		<div :class="{ active: showAlert }" class="alert">{{ alert }}</div>
		<ul class="dropdown __drop-dropdown" v-show="showDrop">
			<li v-for="option in options" v-on:click="select(option)">{{ option }}</li>
			<li v-if="options.length == 0"><i class="dc-spinner animate-spin"></i></li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'InputDrop',
		data() { return { value: '', showDrop: false  }},
		props: { 
			label: { type: String, default: 'Label default' },
			alert: { type: String, default: '* hello world' }, 
			placeholder: { type: String, default: 'Default placeholder' },
			showAlert: { type: Boolean, default: false },
			selected: { type: Array, default() { return [] }},
			options: { type: Array, default() { return [] }},
			name: { type: String, default: 'default' },
			remove: { type: Function, default: this.removeDefault }
		},
		watch: {
			showDrop(value) { 
				if(value) { 
					$("#"+this.name).$(".__drop-dropdown").style.left = $("#"+this.name).$(".__drop-input").offsetLeft+"px"; 
				} 
			}
		},
		methods: {
			clear() { this.$emit("clear"); },
			change() { 
				if(this.value.length > 2){ 
					this.showDrop = true; 
					this.$emit("change", this.value)  
				} else { 
					this.showDrop = false 
				}
			},
			select(option) {
				this.selected.push(option);
				this.value = '';
				this.showDrop = false;
				this.$emit("selected", this.selected);
			},
			removeDefault(option) {
				this.selected.splice(this.selected.indexOf(option), 1);
			}
		}
	}
</script>
