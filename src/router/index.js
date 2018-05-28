import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import ForgotPassword from '@/components/ForgotPassword'
import JoinPool from '@/components/JoinPool'
import CompleteProfile from '@/components/CompleteProfile'
import Profile, { ProfileEmptyState, ViewProfile } from '@/components/Profile'
import Settings from '@/components/Settings'

Vue.use(Router)

export default new Router({
  	routes: [
		{ path: '/', name: 'Welcome', component: Welcome },
		{ path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
		{ path: '/join-talent-pool', name: 'JoinPool', component: JoinPool },
		{ path: '/complete-profile', name: 'CompleteProfile', component: CompleteProfile },
		{ path: '/profile', component: Profile , children: [
			{ path: '', component: ProfileEmptyState, name: 'Profile' },
			{ path: ':username', component: ViewProfile, name: 'ViewProfile' }
		] },
		{ path: '/settings', name: 'Settings', component: Settings, children: [
			{ path: 'account', component: ProfileEmptyState }
		] }
  	],
  	mode: 'history'
})
