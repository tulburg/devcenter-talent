import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import ForgotPassword from '@/components/ForgotPassword'
import JoinPool from '@/components/JoinPool'
import CompleteProfile from '@/components/CompleteProfile'
import Profile, { ProfileEmptyState, ProfileIncompleteState } from '@/components/Profile'
import ProfileView from '@/components/ProfileView'
import Account, { ChangePassword, Feedback, Settings } from '@/components/Account'
import Projects from '@/components/Projects'
import Inbox from '@/components/Inbox'
import SetPassword from '@/components/SetPassword'
import { PMSplash, New, Pending } from '@/components/project-manager'
import ProjectManager from '@/components/ProjectManager'

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
		{ path: '/account', component: Account, children : [
			{ path: 'settings', component: Settings, name: 'AccountSettings' },
			{ path: 'edit', component: ChangePassword, name: 'ChangePassword' },
			{ path: 'feedback', component: Feedback, name: 'Feedback' }
		] },
		{ path: '/projects', name: 'Projects', component: Projects },
		{ path: '/inbox', name: 'Inbox', component: Inbox },
		{ path: '/set-password/:email/:token', name: 'SetPassword', component: SetPassword },
		{ path: '/project-manager', component: ProjectManager, children: [
			{ path: '', component: PMSplash, name: 'PMSplash' },
			{ path: 'new', component: New, name: 'New' },
			{ path: 'pending', component: Pending, name: 'Pending' }
		] }
  	],
  	mode: 'history'
})
