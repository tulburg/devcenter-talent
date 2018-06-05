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
						<div class="search"><i class="dc-search"></i></div>
					</div>
					<div class="mail-list">

					</div>
				</div>
				<div class="right-pane">
					<h1>Board</h1>
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
		data() { return { showMenu: false, selectedMenu: 'All Inbox' } },
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
				// this.$http.post(store.state.api.development+"chat-auth", { channel_name: 'guest', socket_id: session.user.slack_username }).then(res => {
				// 	console.log(res);
				// }).catch(err => {
				// 	console.log(err);
				// })
				this.$http.get(store.state.api.development+"chat-messages/"+session.user.slack_username).then(res => {
					console.log(res);
				}).catch(err => {
					console.log(err);
				})
			})
		},
		destroyed() {
			Bus.$emit("Header_showAccount", false);
			Bus.$emit("Header_showLinks", false);
		}
	}
</script>