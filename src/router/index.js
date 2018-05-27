import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import ForgotPassword from '@/components/ForgotPassword'
import JoinPool from '@/components/JoinPool'
import CompleteProfile from '@/components/CompleteProfile'
import Profile from '@/components/Profile'

Vue.use(Router)

export default new Router({
  	routes: [
		{ path: '/', name: 'Welcome', component: Welcome },
		{ path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
		{ path: '/join-talent-pool', name: 'JoinPool', component: JoinPool },
		{ path: '/complete-profile', name: 'CompleteProfile', component: CompleteProfile },
		{ path: '/profile', name: 'Profile', component: Profile }
  	],
  	mode: 'history'
})
