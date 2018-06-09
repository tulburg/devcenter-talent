<template>
	<section class="profile" v-on:click="hideDropDown">
		<div class="container">
			<div class="preloader" v-if="!loadComplete">
				<i class="dc-spinner animate-spin"></i>
			</div>
			<div class="left" v-if="loadComplete">
				<router-view></router-view>
			</div>
			<div class="right" v-if="loadComplete">
				<div class="box rank">
					<h3>Rank</h3>
					<img src="../assets/img/rank.svg" alt="rank" />
					<ul class="grid grid-2 separator">
						<li><div>Current rank</div><h1>Level {{ ratings.level }}</h1></li>
						<li><div>Max rank</div><h1>Level 5</h1></li>
					</ul>
				</div>
				<div class="box rating">
					<h3>Rating</h3>
					<div class="ratings">
						<div class="title">Attitude <span>{{ ratings.attitude }}</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i <= (ratings.attitude/75)*15) }"></span>
						</div>
					</div>
					<div class="ratings">
						<div class="title">Communication <span>{{ ratings.communication }}</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i <= (ratings.communication/75)*15) }"></span>
						</div>
					</div>
					<div class="ratings">
						<div class="title">Quality <span>{{ ratings.quality }}</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i <= (ratings.quality/75)*15) }"></span>
						</div>
					</div>
					<div class="ratings">
						<div class="title">Timeliness <span>{{ ratings.timeliness }}</span></div>
						<div class="bar">
							<span v-for="i in 15" :class="{ active: (i <= (ratings.timeliness/75)*15) }"></span>
						</div>
					</div>
					<ul class="grid grid-2 separator rating-summary">
						<li><div>Current rating</div><h1>{{ ratings.total }}</h1></li>
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
	import Modal from '@/components/sub/Modal'
	
	export const ProfileEmptyState = {
		name: 'EmptyState',
		data() { return { placeholder : require("../assets/img/placeholder.svg"), firstname: 'John' } },
		template: `<div class="profile-empty">
						<div class="box">
							<div class="profile-photo"><img :src="placeholder" alt="placeholder" /></div>
							<h1>Hi {{ firstname }},</h1>
							<p>Your profile is looking quite empty. We need to know a bit more about you and what you do so that we know what kind of projects to send you.</p>
							<p>Click the button below to start filling your profile, it'll only take a couple of minutes, we promise.</p>
							<button class="long" v-on:click="goToCompleteProfile">Get Started</button>
						</div>
					</div>`,
		methods: {
			goToCompleteProfile() { this.$router.push('/complete-profile'); }
		},
		mounted() {
			store.dispatch('getSession').then(session => {
				if(session) { 
					if(session.user.first_name != undefined) { this.firstname = session.user.first_name }
				}
			});
		}
	}

	export const ProfileIncompleteState = {
		name: 'Incomplete',
		data() { return { placeholder : require("../assets/img/placeholder.svg"), ratings: {}, firstname: 'John' }; },
		template: `<div class="profile-empty">
						<div class="box">
							<div class="profile-photo"><img :src="placeholder" alt="placeholder" /></div>
							<h1>Hi {{ firstname }},</h1>
							<p>We noticed that you haven't finished filling your profile. We need to know a bit more about you and what you do so that we know what kind of projects to send you.</p>
							<p>Click the button below to continue filling your profile, it'll only take a couple of minutes, we promise.</p>
							<button class="long" v-on:click="goToCompleteProfile">Continue</button>
						</div>
					</div>`,
		methods: {
			goToCompleteProfile() { this.$router.push('/complete-profile'); }
		},
		mounted() {
			store.dispatch('getSession').then(session => {
				if(session) { 
					if(session.user.first_name != undefined) { this.firstname = session.user.first_name }
				}
			});
		}
	}

	export default {
		name: 'Profile',
		components: { Modal },
		data() {
			return { loadComplete: false }
		}, 
		methods: {
			hideDropDown() { Bus.$emit("Header_hideDropDown"); }
		},
		mounted: function() {
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_showGrayLogo", true);
			Bus.$emit("Header_activeLink", "/profile/tulburg");
			let self = this;
			store.dispatch('getSession').then(session => {
				if(session == null) this.$router.push("/")
					else {
						if(session.user_profile == undefined) {
							self.$http.get(store.state.api.development+"profile/get",  { 
								headers: { 'Authorization': session.token }
							}).then(res => {
								store.commit("saveProfile", res.body.extras);
								self.loadComplete = true;
								self.ratings = res.body.extras.user_rating;
							}).catch(err => {
								self.loadComplete = true;
								self.completeError = err.message;
							});
						}else {
							self.ratings = session.user_profile.user_rating;
							self.loadComplete = true;
						}
					}
			});
		},
		destroyed: function() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
			Bus.$emit("Header_showGrayLogo", false);
		}
	}

</script>