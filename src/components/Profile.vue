<template>
	<section class="profile" v-on:click="hideDropDown">
		<div class="container">
			<div class="left">
				<router-view></router-view>
			</div>
			<div class="right">
				<div class="box rank">
					<h3>Rank</h3>
					<img src="../assets/img/rank.svg" alt="rank" />
					<ul class="grid grid-2 separator">
						<li><div>Current rank</div><h1>Level 1</h1></li>
						<li><div>Max rank</div><h1>Level 5</h1></li>
					</ul>
				</div>
				<div class="box rating">
					<h3>Rating</h3>
					<div class="ratings">
						<div class="title">Attitude <span>75</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i < 5) }"></span>
						</div>
					</div>
					<div class="ratings">
						<div class="title">Communication <span>65</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i < 8) }"></span>
						</div>
					</div>
					<div class="ratings">
						<div class="title">Quality <span>165</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i < 10) }"></span>
						</div>
					</div>
					<div class="ratings">
						<div class="title">Timeliness <span>135</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i < 8) }"></span>
						</div>
					</div>
					<ul class="grid grid-2 separator">
						<li><div>Current rating</div><h1>60</h1></li>
						<li><div>Max rating</div><h1>300</h1></li>
					</ul>
					<button>Request a Review</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import Bus from '@/Bus'
	import store from '@/store'

	export const ProfileEmptyState = {
		name: 'EmptyState',
		data() { return { placeholder : require("../assets/img/placeholder.svg") }; },
		template: `<div class="profile-empty">
						<div class="box">
							<div class="profile-photo"><img :src="placeholder" alt="placeholder" /></div>
							<h1>Hi John,</h1>
							<p>We noticed that you haven't finished filling your profile. We need to know a bit more about you and what you do so that we know what kind of projects to send you.</p>
							<p>Click the button below to continue filling your profile, it'll only take a couple of minutes, we promise.</p>
							<button class="long" v-on:click="goToCompleteProfile">Continue</button>
						</div>
					</div>`,
		methods: {
			goToCompleteProfile() { this.$router.push('/complete-profile'); }
		}
	}

	export const ViewProfile = {
		name: 'ViewProfile',
		data() { return {
			fullname: "John Doe", hasOtherRole: false, role: "Backened", otherRole: ["Frontend"],
			languages: [
				{ name: "Python", experience: "15+ years" }
			],
			employment_status: "Freelance",
			placeholder : require("../assets/img/placeholder.svg")
		}},
		template: `<div class="profile-view">
			<div class="box">
				<div class="profile-photo">
					<img :src="placeholder" alt="placeholder" />
					<div class="cover" v-on:click="changePhoto"><span>Change your profile picture</span></div>
				</div>
				<div class="personal-pane">
					<h1>{{ fullname }} <a class="clear">Edit</a></h1>
					<p>I'm a <span>{{ role }}</span> developer with experience in <span>{{ otherRole[0] }}</span> development</p> 
				</div>
			</div>
		</div>`,
		methods: {
			changePhoto() {
				console.log("preparing to change photo")
			}
		}
	}

	export default {
		name: 'Profile',
		components: {  },
		data() {
			return {}
		}, 
		methods: {
			hideDropDown() { Bus.$emit("Header_hideDropDown"); }
		},
		mounted: function() {
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_showGrayLogo", true);
			store.dispatch('getSession').then(session => {
				if(session == null) this.$router.push("/")
					else console.log(session);
			});
		},
		destroyed: function() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}

</script>