<template>
	<section class="inbox" v-on:click="handleClick">
		<div class="container">
			<div class="preloader" v-if="!loadComplete">
				<i class="dc-spinner animate-spin"></i>
			</div>
			<div class="box" v-else>
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
						<div class="mail" v-for="mail in threads" :class="{ active: selectedMessage!=undefined&&selectedMessage==mail}" v-on:click="openMail(mail)">
							<h2>{{ mail.last_message }} <span v-if="mail.type=='unread'" class="unread"></span></h2>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
						</div>
						<div class="placeholder" v-if="threads.length < 1">
							<p>No Projects have been shared with you yet</p>
						</div>
					</div>
				</div>
				<div class="right-pane" :class="{ complete: transitionComplete }">
					<div v-if="selectedMessage != undefined" class="message-box" :class="{ 'anim-translate-in': (transitioning!=undefined&&transitioning), 'anim-translate-out-alt': (transitioning!=undefined&&!transitioning), 'anim-translate-out': (transitioningAlt!=undefined&&transitioningAlt), 'anim-translate-in-alt': (transitioningAlt!=undefined&&!transitioningAlt) }">
						<div class="header">
							<div class="right">
								<label>{{ formatDate(new Date(selectedMessage.last_message_date)) }}</label>
								<label>12:15pm</label>
							</div>
							<h2>{{ selectedMessage.last_message_sender.first_name+" "+selectedMessage.last_message_sender.last_name }}</h2>
							<label>kayode@devcenter.co</label>
							<div class="subject">Projects</div>
						</div>
						<div class="body">
							<h1>{{ selectedMessage.last_message }}</h1>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
							quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
							consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
							cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
							proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						</div>
						<!-- <img src="../../static/2.jpg" /> -->
					</div>
					<!-- 'anim-translate-in': transitioning, 'anim-translate-out-alt': !transitioning,  -->
					<div  v-if="nextMessage != undefined" class="message-box alt" :class="{ 'anim-translate-out-alt': (transitioning!=undefined&&transitioning), 'anim-translate-in': (transitioning!=undefined&&!transitioning), 'anim-translate-in-alt': (transitioningAlt!=undefined&&transitioningAlt), 'anim-translate-out': (transitioningAlt!=undefined&&!transitioningAlt) }">
						<div class="header">
							<div class="right">
								<label>{{ formatDate(new Date(nextMessage.last_message_date)) }}</label>
								<label>12:15pm</label>
							</div>
							<h2>{{ nextMessage.last_message_sender.first_name+" "+nextMessage.last_message_sender.last_name }}</h2>
							<label>kayode@devcenter.co</label>
							<div class="subject">Projects</div>
						</div>
						<div class="body">
							<h1>{{ nextMessage.last_message }}</h1>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
							quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
							consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
							cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
							proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						</div>
						<!-- <img src="../../static/1.jpg" /> -->
					</div>
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
		data() { return { 
			showMenu: false, selectedMenu: 'All Inbox', showSearchBox: false, transitioning: undefined, transitioningAlt: false, selectedMessage: undefined,
			nextMessage: undefined, mailState: 0, loadComplete: false, threads: [], transitionComplete: false, oldMessage: undefined 
		} },
		methods: {
			formatDate(date) {
				let days="Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday".split(",");
				let months="January,February,March,April,May,June,July,August,September,October,November,December".split(",");
				return days[date.getDay()]+" "+months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
			},
			handleClick(e) {
				if(e.target.className == 'menu' || e.target.className == 'dc-caret') { 
					(this.showMenu) ? this.showMenu = false : this.showMenu = true;
				}else { 
					this.showMenu = false; 
				}
			},
			openMail(mail) {
				var self = this;
				if(this.selectedMessage != undefined && this.threads.indexOf(mail) < this.threads.indexOf(this.selectedMessage)) {
					this.transitioningAlt = undefined;
					this.transitioning = !this.transitioning;
				}else {
					this.transitioning = undefined;
					this.transitioningAlt = !this.transitioningAlt;
				}
				this.selectedMessage = mail;
				if(this.oldMessage != undefined) {
					if(this.oldMessage == mail) {
						console.log("its the old one", this.oldMessage, mail);
					}
					if(this.transitioning == true) this.nextMessage = this.oldMessage;
					if(this.transitioningAlt == true) this.nextMessage = mail;
				}else {
					this.nextMessage = mail;
				}
				setTimeout(() => { self.oldMessage = mail; self.transitionComplete = true }, 350);
			}
		},
		mounted() {
			Bus.$emit("Header_showAccount", true);
			Bus.$emit("Header_showLinks", true);
			Bus.$emit("Header_activeLink", '/inbox');
			store.dispatch("getSession").then(session => {
				console.log(session);
				this.$http.get(store.state.api.development+"get-threads", {
					headers: { 'Authorization': session.token }
				}).then(res => {
					console.log(res);
					this.loadComplete = true;
					this.threads = res.body.extras.threads;
				}).catch(err => {
					console.log(err);
				});
				// this.$http.get(store.state.api.development+"get-threads/job", {
				// 	headers: { 'Authorization': session.token }
				// }).then(res => {
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