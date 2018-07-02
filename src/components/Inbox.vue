<template>
	<section class="inbox" v-on:click="handleClick">
		<div class="container">
			<div class="box">
				<div class="left-pane">
					<div class="action-bar">
						<div class="menu">{{ selectedMenu }} <i :class="{upward: showMenu}" class="dc-caret"></i>
							<transition name="account-drop">
								<ul v-show="showMenu">
									<li v-if="selectedMenu != 'Projects'"><a href="#" v-on:click.prevent="selectedMenu = 'Projects'">Projects</a></li>
									<li v-if="selectedMenu != 'Notifications'"><a href="#" v-on:click.prevent="selectedMenu = 'Notifications'">Notifications</a></li>
									<li v-if="selectedMenu != 'All Inbox'"><a href="#" v-on:click.prevent="selectedMenu = 'All Inbox'">All Inbox</a></li>
								</ul>
							</transition>
						</div>
						<div :class="{ active: showSearchBox }" class="search"><i class="dc-search" v-on:click="showSearchBox=!showSearchBox"></i></div>
						<div :class="{ active: showSearchBox }" class="search-box">
							<div class="input-wrapper">
								<i class="dc-search"></i><input type="text" placeholder="Search" />
							</div>
							<i class="dc-cancel" v-on:click="showSearchBox=!showSearchBox"></i>
						</div>
					</div>
					<div class="mail-list">
						<!-- <div :class="{ active: mail.subject=='Kayode Ayeni'}" class="mail" v-for="mail in [
							{subject: 'Kayode Ayeni', body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.', status: 'unread' },
							{subject: 'Toyosi Shonibare', body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.', status: 'read' },
							{subject: 'Devcenter', body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.', status: 'unread' },
							{subject: 'Kayode Ayenigbala john ogunmakinde samuel', body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.', status: 'unread' },
							{subject: 'Tayo Shodipo', body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.', status: 'unread' }
						]">
							<h2>{{ mail.subject }} <span v-if="mail.status=='unread'" class="unread"></span></h2>
							<p>{{ (mail.body.length > 50) ? mail.body.substring(0, 50)+'...' :  mail.body }}</p>
						</div> -->
						<div class="placeholder">
							<p>No Projects have been shared with you yet</p>
						</div>
					</div>
				</div>
				<div class="right-pane">
					<h2></h2>
				</div>
			</div>
		</div>
	</section>
</template>


<script>
	import Bus from '@/Bus'
	import store from '@/store'

	export default {
		name: 'Inbox',
		data() { return { showMenu: false, selectedMenu: 'All Inbox', showSearchBox: false } },
		methods: {
			handleClick(e) {
				if(e.target.className == 'menu') { 
					(this.showMenu) ? this.showMenu = false : this.showMenu = true;
				}else { 
					this.showMenu = false; 
				}
			}
		},
		mounted() {
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			store.dispatch("getSession").then(session => {
				console.log(session);
				this.$http.post(store.state.api.development+"chat/generate-dm-code", { username: session.user.username }).then(res => {
					console.log(res);
				}).catch(err => {
					console.log(err);
				})
				// this.$http.get(store.state.api.development+"chat-messages/"+session.user.slack_username).then(res => {
				// 	console.log(res);
				// }).catch(err => {
				// 	console.log(err);
				// })
			})
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
		}
	}
</script>