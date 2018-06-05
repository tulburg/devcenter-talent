import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import ForgotPassword from '@/components/ForgotPassword'
import JoinPool from '@/components/JoinPool'
import CompleteProfile from '@/components/CompleteProfile'
import Profile, { ProfileEmptyState, ProfileIncompleteState } from '@/components/Profile'
import ProfileView from '@/components/ProfileView'
import Settings from '@/components/Settings'
import Projects from '@/components/Projects'
import Inbox from '@/components/Inbox'

Vue.use(Router)

export default new Router({
  	routes: [
		{ path: '/', name: 'Welcome', component: Welcome },
		{ path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
		{ path: '/join-talent-pool', name: 'JoinPool', component: JoinPool },
		{ path: '/complete-profile', name: 'CompleteProfile', component: CompleteProfile },
		{ path: '/profile', component: Profile , children: [
			{ path: '', component: ProfileEmptyState, name: 'Profile' },
			{ path: 'incomplete', component: ProfileIncompleteState, name: 'ProfileIncomplete' },
			{ path: ':username', component: ProfileView, name: 'ProfileView' }
		] },
		{ path: '/settings', name: 'Settings', component: Settings, children: [
			{ path: 'account', component: ProfileEmptyState }
		] },
		{ path: '/projects', name: 'Projects', component: Projects },
		{ path: '/inbox', name: 'Inbox', component: Inbox }
  	],
  	mode: 'history'
})
